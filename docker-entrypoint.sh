#!/bin/sh
set -e

echo "🚀 Starting Aether Identity..."
echo "📍 Environment: $NODE_ENV"
echo "🗄️  Database Provider: $DATABASE_PROVIDER"
echo "🔗 Database URL: $(echo $DATABASE_URL | sed 's|://.*@|://***:***@|')"

#############################################
# Wait for PostgreSQL if needed
#############################################
wait_for_postgres() {
    if [ "$DATABASE_PROVIDER" = "postgresql" ]; then
        echo "⏳ Waiting for PostgreSQL..."
        MAX_RETRIES=${POSTGRES_HEALTH_CHECK_RETRIES:-30}
        RETRY_COUNT=0

        until pg_isready -h "${POSTGRES_HOST:-postgres}" -p "${POSTGRES_PORT:-5432}" -U "${POSTGRES_USER:-aether_user}" -d "${POSTGRES_DB:-aether_identity}" > /dev/null 2>&1; do
            RETRY_COUNT=$((RETRY_COUNT + 1))
            echo "⏳ Attempt $RETRY_COUNT/$MAX_RETRIES: PostgreSQL not ready..."
            if [ "$RETRY_COUNT" -ge "$MAX_RETRIES" ]; then
                echo "❌ PostgreSQL connection failed after $MAX_RETRIES attempts"
                exit 1
            fi
            sleep 2
        done

        echo "✅ PostgreSQL is ready!"
    else
        echo "📁 SQLite detected, skipping PostgreSQL wait"
    fi
}

#############################################
# Check if database is empty
#############################################
is_database_empty() {
    if [ "$DATABASE_PROVIDER" = "postgresql" ]; then
        COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';" 2>/dev/null | tr -d ' ')
        echo "${COUNT:-0}"
    else
        DB_FILE=$(echo "$DATABASE_URL" | sed 's|file:||')
        if [ -f "$DB_FILE" ]; then
            COUNT=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';" 2>/dev/null | tr -d ' ')
            echo "${COUNT:-0}"
        else
            echo "0"
        fi
    fi
}

#############################################
# Check existing users
#############################################
check_existing_users() {
    if [ "$DATABASE_PROVIDER" = "postgresql" ]; then
        COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM \"users\";" 2>/dev/null | tr -d ' ')
        echo "${COUNT:-0}"
    else
        DB_FILE=$(echo "$DATABASE_URL" | sed 's|file:||')
        if [ -f "$DB_FILE" ]; then
            COUNT=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM users;" 2>/dev/null | tr -d ' ')
            echo "${COUNT:-0}"
        else
            echo "0"
        fi
    fi
}

#############################################
# Create database backup
#############################################
create_backup() {
    if [ "$BACKUP_ENABLED" = "true" ] && [ "$DATABASE_PROVIDER" = "postgresql" ]; then
        mkdir -p /app/backups
        BACKUP_FILE="/app/backups/backup-$(date +%Y%m%d-%H%M%S).sql"
        echo "💾 Creating backup at $BACKUP_FILE..."
        pg_dump "$DATABASE_URL" > "$BACKUP_FILE"
        echo "✅ Backup created"
        echo "$BACKUP_FILE"
    else
        echo ""
    fi
}

#############################################
# Apply Prisma migrations if needed
#############################################
apply_migrations() {
    echo "📦 Applying Prisma migrations..."

    # Regenerate Prisma client for Alpine (musl) if needed
    if [ "$DOCKER_CONTEXT" = "true" ]; then
        echo "🔧 Generating Prisma client for production..."
        DATABASE_PROVIDER=${DATABASE_PROVIDER:-postgresql} /tmp/select-prisma-schema.sh generate
    fi

    # Determine migration status
    STATUS=$(npx prisma migrate status --schema /app/backend/prisma/schema.prisma 2>&1 || echo "error")

    if echo "$STATUS" | grep -q "Your database is up to date"; then
        echo "✅ Database is up to date"
    else
        echo "🔄 Applying pending migrations..."
        if [ "$NODE_ENV" = "production" ]; then
            npx prisma migrate deploy --schema /app/backend/prisma/schema.prisma
        else
            npx prisma migrate dev --name init --schema /app/backend/prisma/schema.prisma --accept-data-loss
        fi
        echo "✅ Migrations applied"
    fi
}

#############################################
# Seed initial data if needed
#############################################
seed_data() {
    USER_COUNT=$(check_existing_users)
    if [ "$USER_COUNT" -eq 0 ]; then
        echo "🌱 Seeding initial data..."
        if [ -f "/app/backend/dist/scripts/seed.js" ]; then
            node /app/backend/dist/scripts/seed.js
            echo "✅ Seeding completed"
        else
            echo "⚠️ Seed script not found, skipping"
        fi
    else
        echo "✅ Users exist, skipping seeding"
    fi
}

#############################################
# Initialize database
#############################################
initialize_database() {
    wait_for_postgres
    TABLE_COUNT=$(is_database_empty)

    if [ "$TABLE_COUNT" -eq 0 ]; then
        echo "🎯 First deployment detected..."
        BACKUP_FILE=""
        if [ "$DATABASE_PROVIDER" = "postgresql" ] && [ "$BACKUP_ENABLED" = "true" ]; then
            BACKUP_FILE=$(create_backup)
        fi
        apply_migrations
        seed_data
        echo "✅ First deployment completed"
    else
        echo "🔄 Existing database detected..."
        BACKUP_FILE=""
        if [ "$AUTO_BACKUP_BEFORE_MIGRATION" = "true" ]; then
            BACKUP_FILE=$(create_backup)
        fi
        apply_migrations
        seed_data
        echo "✅ Database update completed"
    fi
}

#############################################
# Start backend
#############################################
start_backend() {
    echo "🔧 Starting backend on port ${BACKEND_PORT:-8080}..."
    cd /app/backend
    node dist/server.js &
    BACKEND_PID=$!
    sleep 3
    if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
        echo "❌ Backend failed to start"
        exit 1
    fi
    echo "✅ Backend running (PID $BACKEND_PID)"
}

#############################################
# Start frontend
#############################################
start_frontend() {
    echo "🎨 Starting frontend on port ${FRONTEND_PORT:-3000}..."
    cd /app/frontend
    sh node_modules/.bin/next start -p "${FRONTEND_PORT:-3000}" -H 0.0.0.0 &
    FRONTEND_PID=$!
    sleep 5
    if ! kill -0 "$FRONTEND_PID" 2>/dev/null; then
        echo "❌ Frontend failed to start"
        exit 1
    fi
    echo "✅ Frontend running (PID $FRONTEND_PID)"
}

#############################################
# Cleanup function
#############################################
cleanup() {
    echo "🛑 Shutting down services..."
    if [ -n "$BACKEND_PID" ]; then kill "$BACKEND_PID" 2>/dev/null || true; fi
    if [ -n "$FRONTEND_PID" ]; then kill "$FRONTEND_PID" 2>/dev/null || true; fi
    wait || true
    echo "✅ All services stopped"
}

trap cleanup SIGTERM SIGINT

#############################################
# Main execution
#############################################
initialize_database
start_backend
start_frontend

echo ""
echo "📊 Services running:"
echo "  ➜ Frontend: http://localhost:${FRONTEND_PORT:-3000}"
echo "  ➜ Backend:  http://localhost:${BACKEND_PORT:-8080}"
echo "  ➜ Health:   http://localhost:${BACKEND_PORT:-8080}/health"
echo "  ➜ API Docs: http://localhost:${BACKEND_PORT:-8080}/api/v1/docs"
echo ""
echo "Press Ctrl+C to stop all services"

wait