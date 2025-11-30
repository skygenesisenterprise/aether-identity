#!/bin/sh
set -e

echo "🚀 Starting Aether Identity Backend..."
echo "📍 Environment: $NODE_ENV"
echo "🗄️  Database Provider: $DATABASE_PROVIDER"
echo "🔗 Database URL: $(echo $DATABASE_URL | sed 's|://.*@|://***:***@|')"

cd /app/backend

# Function to wait for PostgreSQL
wait_for_postgres() {
    if [ "$DATABASE_PROVIDER" = "postgresql" ]; then
        echo "⏳ Waiting for PostgreSQL to be ready..."
        MAX_RETRIES=${POSTGRES_HEALTH_CHECK_RETRIES:-30}
        RETRY_COUNT=0
        
        while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
            if pg_isready -h ${POSTGRES_HOST:-postgres} -p ${POSTGRES_PORT:-5432} -U ${POSTGRES_USER:-aether_user} -d ${POSTGRES_DB:-aether_identity}; then
                echo "✅ PostgreSQL is ready!"
                break
            fi
            
            RETRY_COUNT=$((RETRY_COUNT + 1))
            echo "⏳ Attempt $RETRY_COUNT/$MAX_RETRIES: PostgreSQL not ready, waiting..."
            sleep 2
        done
        
        if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
            echo "❌ PostgreSQL connection failed after $MAX_RETRIES attempts"
            exit 1
        fi
        
        # Test database connection
        echo "🔍 Testing database connection..."
        if ! psql "$DATABASE_URL" -c "SELECT 1;" > /dev/null 2>&1; then
            echo "❌ Database connection test failed"
            exit 1
        fi
        echo "✅ Database connection successful"
    else
        echo "📁 SQLite database detected - skipping PostgreSQL wait"
    fi
}

# Function to check if database is empty
is_database_empty() {
    if [ "$DATABASE_PROVIDER" = "postgresql" ]; then
        TABLE_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | tr -d ' ' || echo "0")
        echo "$TABLE_COUNT"
    else
        # For SQLite, check if database file exists and has tables
        DB_FILE=$(echo "$DATABASE_URL" | sed 's|file:||')
        if [ -f "$DB_FILE" ]; then
            TABLE_COUNT=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';" 2>/dev/null | tr -d ' ' || echo "0")
            echo "$TABLE_COUNT"
        else
            echo "0"
        fi
    fi
}

# Function to check if users exist
check_existing_users() {
    if [ "$DATABASE_PROVIDER" = "postgresql" ]; then
        USER_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM \"users\";" 2>/dev/null | tr -d ' ' || echo "0")
        echo "$USER_COUNT"
    else
        DB_FILE=$(echo "$DATABASE_URL" | sed 's|file:||')
        if [ -f "$DB_FILE" ]; then
            USER_COUNT=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM users;" 2>/dev/null | tr -d ' ' || echo "0")
            echo "$USER_COUNT"
        else
            echo "0"
        fi
    fi
}

# Function to create backup
create_backup() {
    if [ "$BACKUP_ENABLED" = "true" ] && [ "$DATABASE_PROVIDER" = "postgresql" ]; then
        echo "💾 Creating backup..."
        BACKUP_FILE="/app/backups/backup-$(date +%Y%m%d-%H%M%S).sql"
        mkdir -p /app/backups
        pg_dump "$DATABASE_URL" > "$BACKUP_FILE"
        echo "✅ Backup created: $BACKUP_FILE"
        echo "$BACKUP_FILE"
    else
        echo ""
    fi
}

# Function to apply migrations
apply_migrations() {
    echo "📦 Applying database migrations..."
    
    # Generate Prisma client with dynamic schema selection
    echo "🔧 Selecting and generating Prisma client..."
    DATABASE_PROVIDER=${DATABASE_PROVIDER:-sqlite} /tmp/select-prisma-schema.sh generate
    
    # Check migration status
    echo "📊 Checking migration status..."
    MIGRATION_STATUS=$(npx prisma migrate status --schema /app/backend/prisma/schema.prisma 2>&1 || echo "error")
    
    if echo "$MIGRATION_STATUS" | grep -q "Your database is up to date"; then
        echo "✅ Database is up to date - no migration needed"
        return 0
    elif echo "$MIGRATION_STATUS" | grep -q "error\|Can't find"; then
        echo "🎯 No migration history detected - initializing database..."
        
        if [ "$NODE_ENV" = "production" ]; then
            # Production: use db push for initial setup
            npx prisma db push --schema /app/backend/prisma/schema.prisma
            echo "📝 Creating initial migration..."
            npx prisma migrate dev --name init --schema /app/backend/prisma/schema.prisma --accept-data-loss
        else
            # Development: use migrate dev
            npx prisma migrate dev --name init --schema /app/backend/prisma/schema.prisma --accept-data-loss
        fi
    else
        echo "🔄 Applying pending migrations..."
        if [ "$NODE_ENV" = "production" ]; then
            npx prisma migrate deploy --schema /app/backend/prisma/schema.prisma
        else
            npx prisma migrate dev --schema /app/backend/prisma/schema.prisma
        fi
        echo "✅ Migrations applied successfully"
    fi
}

# Function to seed data
seed_data() {
    echo "🌱 Checking if seeding is needed..."
    USER_COUNT=$(check_existing_users)
    
    if [ "$USER_COUNT" -eq 0 ]; then
        echo "🌱 No users found - running seeding..."
        if [ -f "/app/backend/dist/scripts/seed.js" ]; then
            node /app/backend/dist/scripts/seed.js
            echo "✅ Seeding completed successfully"
        else
            echo "⚠️ Seed script not found - skipping seeding"
        fi
    else
        echo "✅ Users exist - skipping seeding to protect existing data"
    fi
}

# Main execution flow
main() {
    # Wait for database
    wait_for_postgres
    
    # Check if database is empty
    TABLE_COUNT=$(is_database_empty)
    
    if [ "$TABLE_COUNT" -eq 0 ]; then
        echo "🎯 First deployment detected - initializing database..."
        
        # Create backup if enabled and PostgreSQL
        if [ "$DATABASE_PROVIDER" = "postgresql" ] && [ "$BACKUP_ENABLED" = "true" ]; then
            create_backup
        fi
        
        # Apply initial migrations
        apply_migrations
        
        # Seed initial data
        seed_data
        
        echo "✅ First deployment completed successfully"
    else
        echo "🔄 Existing database detected - applying safe updates..."
        
        # Create backup before migration if enabled
        BACKUP_FILE=""
        if [ "$AUTO_BACKUP_BEFORE_MIGRATION" = "true" ]; then
            BACKUP_FILE=$(create_backup)
        fi
        
        # Validate schema
        echo "🔍 Validating database schema..."
        if ! npx prisma validate --schema /app/backend/prisma/schema.prisma; then
            echo "❌ Schema validation failed"
            if [ -n "$BACKUP_FILE" ] && [ "$REQUIRE_MIGRATION_BACKUP" = "true" ]; then
                echo "🔄 Restoring from backup due to validation failure..."
                psql "$DATABASE_URL" < "$BACKUP_FILE"
            fi
            exit 1
        fi
        
        # Apply migrations
        apply_migrations
        
        # Check if seeding is needed
        seed_data
        
        echo "✅ Database update completed successfully"
    fi
    
    # Final health check
    echo "🏥 Performing final health check..."
    if [ "$DATABASE_PROVIDER" = "postgresql" ]; then
        if ! psql "$DATABASE_URL" -c "SELECT 1;" > /dev/null 2>&1; then
            echo "❌ Final health check failed"
            exit 1
        fi
    fi
    echo "✅ Final health check passed"
    
    echo "🚀 Starting application server..."
}

# Execute main function
main() {
    # Wait for database
    wait_for_postgres
    
    # Check if database is empty
    TABLE_COUNT=$(is_database_empty)
    
    if [ "$TABLE_COUNT" -eq 0 ]; then
        echo "🎯 First deployment detected - initializing database..."
        
        # Create backup if enabled and PostgreSQL
        if [ "$DATABASE_PROVIDER" = "postgresql" ] && [ "$BACKUP_ENABLED" = "true" ]; then
            create_backup
        fi
        
        # Apply initial migrations
        apply_migrations
        
        # Seed initial data
        seed_data
        
        echo "✅ First deployment completed successfully"
    else
        echo "🔄 Existing database detected - applying safe updates..."
        
        # Create backup before migration if enabled
        BACKUP_FILE=""
        if [ "$AUTO_BACKUP_BEFORE_MIGRATION" = "true" ]; then
            BACKUP_FILE=$(create_backup)
        fi
        
        # Validate schema
        echo "🔍 Validating database schema..."
        if ! npx prisma validate --schema /app/backend/prisma/schema.prisma; then
            echo "❌ Schema validation failed"
            if [ -n "$BACKUP_FILE" ] && [ "$REQUIRE_MIGRATION_BACKUP" = "true" ]; then
                echo "🔄 Restoring from backup due to validation failure..."
                psql "$DATABASE_URL" < "$BACKUP_FILE"
            fi
            exit 1
        fi
        
        # Apply migrations
        apply_migrations
        
        # Check if seeding is needed
        seed_data
        
        echo "✅ Database update completed successfully"
    fi
    
    # Final health check
    echo "🏥 Performing final health check..."
    if [ "$DATABASE_PROVIDER" = "postgresql" ]; then
        if ! psql "$DATABASE_URL" -c "SELECT 1;" > /dev/null 2>&1; then
            echo "❌ Final health check failed"
            exit 1
        fi
    fi
    echo "✅ Final health check passed"
    
    echo "🚀 Starting application services..."
}

# Function to start backend
start_backend() {
    echo "🔧 Starting backend API on port ${BACKEND_PORT:-8080}..."
    cd /app/backend
    
    if [ -f "dist/server.js" ]; then
        node dist/server.js &
        BACKEND_PID=$!
        echo "✅ Backend started with PID: $BACKEND_PID"
        return $BACKEND_PID
    else
        echo "❌ ERROR: dist/server.js not found!"
        exit 1
    fi
}

# Function to start frontend
start_frontend() {
    echo "🎨 Starting Next.js frontend on port ${FRONTEND_PORT:-3000}..."
    cd /app/frontend
    
    if [ -f "node_modules/.bin/next" ]; then
        sh node_modules/.bin/next start -p ${FRONTEND_PORT:-3000} -H 0.0.0.0 &
        FRONTEND_PID=$!
        echo "✅ Frontend started with PID: $FRONTEND_PID"
        return $FRONTEND_PID
    else
        echo "❌ ERROR: Next.js binary not found!"
        exit 1
    fi
}

# Cleanup function
cleanup() {
    echo "🛑 Shutting down services..."
    if [ -n "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null || true
        echo "✅ Backend stopped"
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null || true
        echo "✅ Frontend stopped"
    fi
    wait || true
    echo "✅ All services stopped"
}

# Trap signals for cleanup
trap cleanup SIGTERM SIGINT

# Execute main function
main

# Start both services
BACKEND_PID=$(start_backend)
FRONTEND_PID=$(start_frontend)

echo ""
echo "📊 Services running:"
echo "  ➜ Frontend:        http://localhost:${FRONTEND_PORT:-3000}"
echo "  ➜ Backend API:     http://localhost:${BACKEND_PORT:-8080}"
echo "  ➜ Health Check:    http://localhost:${BACKEND_PORT:-8080}/health"
echo "  ➜ API Docs:        http://localhost:${BACKEND_PORT:-8080}/api/v1/docs"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for all processes
wait