# Aether Identity - Dynamic Database Configuration

This document explains how to use the dynamic database configuration system that allows seamless switching between SQLite (development) and PostgreSQL (production) using environment variables.

## 🎯 Overview

The system uses **dynamic Prisma schema selection** to automatically choose the appropriate database configuration based on the `DATABASE_PROVIDER` environment variable.

## 📁 File Structure

```
api/prisma/
├── schema.prisma              # Active schema (generated dynamically)
├── schema.sqlite.prisma        # SQLite-specific schema
├── schema.postgresql.prisma    # PostgreSQL-specific schema
└── prisma/
    └── dev.db                 # SQLite database file

scripts/
└── select-prisma-schema.sh     # Dynamic schema selector script

.env.example                   # Example configuration
.env.development               # Development environment config
.env.production                # Production environment config
```

## 🔄 How It Works

### 1. Schema Selection Process

1. **Environment Detection**: The system reads `DATABASE_PROVIDER` from environment variables
2. **Schema Copy**: The appropriate schema file is copied to `schema.prisma`
3. **Validation**: The selected schema is validated
4. **Generation**: Prisma client is generated for the selected provider

### 2. Automatic Selection Logic

```bash
if [ "$DATABASE_PROVIDER" = "postgresql" ]; then
    # Use PostgreSQL schema
    cp api/prisma/schema.postgresql.prisma api/prisma/schema.prisma
else
    # Default to SQLite
    cp api/prisma/schema.sqlite.prisma api/prisma/schema.prisma
fi
```

## 🛠️ Usage Examples

### Development (SQLite)

```bash
# Set environment
export DATABASE_PROVIDER=sqlite
export DATABASE_URL="file:./api/prisma/dev.db"

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Start development server
npm run dev:api
```

### Production (PostgreSQL)

```bash
# Set environment
export DATABASE_PROVIDER=postgresql
export DATABASE_URL="postgresql://user:password@localhost:5432/aether_identity"

# Generate Prisma client
npm run db:generate

# Deploy migrations
npm run db:migrate:deploy

# Start production server
npm run start:api
```

### Docker Deployment

```bash
# Development with SQLite
./deploy.sh development deploy

# Production with PostgreSQL
./deploy.sh production deploy

# Custom provider
DATABASE_PROVIDER=postgresql ./deploy.sh development deploy
```

## 📋 Available Scripts

### Database Management

```bash
# Select and generate schema
npm run db:select

# Validate selected schema
npm run db:validate

# Generate Prisma client
npm run db:generate

# Push schema to database (development)
npm run db:push

# Create and apply migrations (development)
npm run db:migrate

# Deploy migrations (production)
npm run db:migrate:deploy

# Open Prisma Studio
npm run db:studio

# Reset database (development only)
npm run db:reset

# Seed database
npm run db:seed

# Complete database setup
npm run db:setup
```

### Deployment

```bash
# Deploy production
./deploy.sh production deploy

# Deploy development
./deploy.sh development deploy

# Build only
./deploy.sh production build

# Check status
./deploy.sh production status

# View logs
./deploy.sh production logs

# Health check
./deploy.sh production health

# Create backup
./deploy.sh production backup

# Test configuration
./deploy.sh production test
```

## 🔧 Configuration

### Environment Variables

#### Core Database Configuration

```bash
# Database provider (sqlite, postgresql)
DATABASE_PROVIDER=sqlite

# Database URL (provider-specific)
DATABASE_URL="file:./api/prisma/dev.db"
# DATABASE_URL="postgresql://user:password@host:5432/database"
```

#### PostgreSQL Specific

```bash
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=aether_identity
POSTGRES_USER=aether_user
POSTGRES_PASSWORD=your_password
```

#### SQLite Specific

```bash
# SQLite file path
DATABASE_URL="file:./api/prisma/dev.db"
```

## 🐳 Docker Configuration

### Build Arguments

The Docker build process uses these arguments:

```dockerfile
ARG NODE_ENV=production
ARG DATABASE_PROVIDER=postgresql
```

### Environment Variables in Container

```dockerfile
ENV DATABASE_PROVIDER=${DATABASE_PROVIDER:-postgresql}
ENV DATABASE_URL=""
```

### Multi-Environment Support

The `docker-compose.yml` supports multiple profiles:

- **Production**: PostgreSQL with full backup and safety features
- **Development**: SQLite with fast iteration capabilities

## 🔄 Migration Workflow

### First Deployment

1. **Schema Selection**: Automatic based on `DATABASE_PROVIDER`
2. **Database Creation**: Database and tables created automatically
3. **Initial Migration**: First migration file created
4. **Seed Data**: Essential data seeded if database is empty

### Subsequent Deployments

1. **Backup Creation**: Automatic backup (PostgreSQL production)
2. **Schema Validation**: Schema validated before migration
3. **Migration Application**: Safe migration with rollback capability
4. **Data Protection**: Existing data preserved

## 🛡️ Safety Features

### Production Protection

```bash
# Safety flags (enabled in production)
DISABLE_DB_RESET=true
DISABLE_SEED_OVERRIDE=true
REQUIRE_MIGRATION_BACKUP=true
AUTO_BACKUP_BEFORE_MIGRATION=true
```

### Development Flexibility

```bash
# Development flags (more permissive)
DISABLE_DB_RESET=false
DISABLE_SEED_OVERRIDE=false
REQUIRE_MIGRATION_BACKUP=false
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Schema Validation Failed

```bash
# Check which schema is being used
DATABASE_PROVIDER=postgresql ./scripts/select-prisma-schema.sh info

# Validate manually
DATABASE_PROVIDER=postgresql npm run db:validate
```

#### 2. Migration Conflicts

```bash
# Reset development database
npm run db:reset

# Check migration status
npm run db:migrate -- --status
```

#### 3. Connection Issues

```bash
# Test database configuration
./deploy.sh production test

# Check environment variables
./deploy.sh production status
```

### Debug Mode

Enable debug logging:

```bash
export LOG_LEVEL=debug
npm run dev:api
```

## 📊 Monitoring

### Health Check Endpoint

```bash
curl http://localhost:8080/health
```

Response includes database information:

```json
{
  "status": "OK",
  "database": {
    "provider": "postgresql",
    "connected": true,
    "migrationStatus": "up-to-date"
  }
}
```

### Database Status

```bash
# Check migration status
npx prisma migrate status

# View database info
./scripts/select-prisma-schema.sh info
```

## 🚀 Best Practices

### Development

1. **Use SQLite** for fast local development
2. **Test migrations** before deploying
3. **Use seed data** for consistent test environment
4. **Reset database** when schema changes significantly

### Production

1. **Use PostgreSQL** for scalability and reliability
2. **Enable backups** before any migration
3. **Monitor health** checks regularly
4. **Test in staging** before production deployment

### Security

1. **Never commit** database credentials
2. **Use environment variables** for all configuration
3. **Enable SSL** for PostgreSQL connections
4. **Regular backups** with retention policy

## 📚 Advanced Usage

### Custom Providers

To add a new database provider:

1. Create `schema.{provider}.prisma`
2. Update `select-prisma-schema.sh`
3. Add provider-specific configuration
4. Test with `DATABASE_PROVIDER={provider}`

### Migration Strategies

#### Zero-Downtime Deployment

```bash
# 1. Create backup
./deploy.sh production backup

# 2. Deploy with health check
./deploy.sh production deploy

# 3. Verify health
./deploy.sh production health
```

#### Rollback Strategy

```bash
# 1. Stop services
./deploy.sh production stop

# 2. Restore from backup
psql $DATABASE_URL < backup-file.sql

# 3. Deploy previous version
# (use previous image tag)
```

This dynamic configuration system provides maximum flexibility while maintaining safety and reliability across different environments.