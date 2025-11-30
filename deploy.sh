#!/bin/bash

# Aether Identity Deployment Script with Dynamic Prisma Schema Support
# Usage: ./deploy.sh [environment] [action]

set -e

# Default values
ENVIRONMENT=${1:-production}
ACTION=${2:-deploy}
COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env.${ENVIRONMENT}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required files exist
check_requirements() {
    log_info "Checking requirements..."
    
    if [ ! -f "$ENV_FILE" ]; then
        log_error "Environment file $ENV_FILE not found!"
        log_info "Please create $ENV_FILE from .env.example"
        exit 1
    fi
    
    if [ ! -f "$COMPOSE_FILE" ]; then
        log_error "Docker Compose file $COMPOSE_FILE not found!"
        exit 1
    fi
    
    if [ ! -f "scripts/select-prisma-schema.sh" ]; then
        log_error "Prisma schema selector script not found!"
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed!"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose is not installed!"
        exit 1
    fi
    
    log_success "Requirements check passed"
}

# Load environment variables
load_env() {
    log_info "Loading environment variables from $ENV_FILE..."
    export $(grep -v '^#' "$ENV_FILE" | xargs)
    log_success "Environment variables loaded"
    
    # Show database configuration
    log_info "Database Configuration:"
    echo "  Provider: ${DATABASE_PROVIDER:-sqlite}"
    echo "  URL: $(echo ${DATABASE_URL:-file:./api/prisma/dev.db} | sed 's|://.*@|://***:***@|')"
}

# Create necessary directories
create_directories() {
    log_info "Creating necessary directories..."
    
    mkdir -p "${DATA_DIR:-./data}"
    mkdir -p "${BACKUP_DIR:-./backups}"
    mkdir -p "${LOGS_DIR:-./logs}"
    mkdir -p "${INIT_SCRIPTS_DIR:-./init-scripts}"
    
    # Set proper permissions
    chmod 755 "${DATA_DIR:-./data}"
    chmod 755 "${BACKUP_DIR:-./backups}"
    chmod 755 "${LOGS_DIR:-./logs}"
    chmod 755 "${INIT_SCRIPTS_DIR:-./init-scripts}"
    
    log_success "Directories created"
}

# Validate Prisma schema locally
validate_prisma_schema() {
    log_info "Validating Prisma schema for ${DATABASE_PROVIDER:-sqlite}..."
    
    # Make schema selector executable
    chmod +x scripts/select-prisma-schema.sh
    
    # Validate schema
    if DATABASE_PROVIDER=${DATABASE_PROVIDER:-sqlite} ./scripts/select-prisma-schema.sh validate; then
        log_success "Prisma schema validation passed"
    else
        log_error "Prisma schema validation failed"
        exit 1
    fi
}

# Build Docker images
build_images() {
    log_info "Building Docker images with DATABASE_PROVIDER=${DATABASE_PROVIDER:-sqlite}..."
    
    # Build args for dynamic schema selection
    BUILD_ARGS="--build-arg NODE_ENV=${NODE_ENV:-production}"
    BUILD_ARGS="$BUILD_ARGS --build-arg DATABASE_PROVIDER=${DATABASE_PROVIDER:-sqlite}"
    
    if docker compose version &> /dev/null; then
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" build $BUILD_ARGS
    else
        docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" build $BUILD_ARGS
    fi
    
    log_success "Docker images built successfully"
}

# Deploy services
deploy_services() {
    log_info "Deploying services for $ENVIRONMENT environment..."
    
    if docker compose version &> /dev/null; then
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d
    else
        docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d
    fi
    
    log_success "Services deployed successfully"
}

# Deploy specific profile
deploy_profile() {
    local profile=$1
    log_info "Deploying $profile profile for $ENVIRONMENT environment..."
    
    if docker compose version &> /dev/null; then
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" --profile "$profile" up -d
    else
        docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" --profile "$profile" up -d
    fi
    
    log_success "$profile profile deployed successfully"
}

# Stop services
stop_services() {
    log_info "Stopping services..."
    
    if docker compose version &> /dev/null; then
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down
    else
        docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down
    fi
    
    log_success "Services stopped"
}

# Show status
show_status() {
    log_info "Service status:"
    
    if docker compose version &> /dev/null; then
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
    else
        docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
    fi
}

# Show logs
show_logs() {
    local service=${1:-}
    log_info "Showing logs..."
    
    if docker compose version &> /dev/null; then
        if [ -n "$service" ]; then
            docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs -f "$service"
        else
            docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs -f
        fi
    else
        if [ -n "$service" ]; then
            docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs -f "$service"
        else
            docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs -f
        fi
    fi
}

# Health check
health_check() {
    log_info "Performing health check..."
    
    local backend_url="http://localhost:${BACKEND_PORT:-8080}/health"
    local frontend_url="http://localhost:${FRONTEND_PORT:-3000}"
    
    # Wait for services to start
    log_info "Waiting for services to start..."
    sleep 30
    
    # Check backend health
    if curl -f "$backend_url" > /dev/null 2>&1; then
        log_success "Backend health check passed"
    else
        log_error "Backend health check failed"
        return 1
    fi
    
    # Check frontend health
    if curl -f "$frontend_url" > /dev/null 2>&1; then
        log_success "Frontend health check passed"
    else
        log_warning "Frontend health check failed (may be starting)"
    fi
    
    log_success "Health check completed"
}

# Backup database
backup_database() {
    if [ "$DATABASE_PROVIDER" = "postgresql" ] && [ "$BACKUP_ENABLED" = "true" ]; then
        log_info "Creating database backup..."
        
        local backup_file="${BACKUP_DIR:-./backups}/manual-backup-$(date +%Y%m%d-%H%M%S).sql"
        
        if docker compose version &> /dev/null; then
            docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec postgres pg_dump -U "${POSTGRES_USER:-aether_user}" "${POSTGRES_DB:-aether_identity}" > "$backup_file"
        else
            docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec postgres pg_dump -U "${POSTGRES_USER:-aether_user}" "${POSTGRES_DB:-aether_identity}" > "$backup_file"
        fi
        
        log_success "Database backup created: $backup_file"
    else
        log_warning "Database backup skipped (PostgreSQL not enabled or backups disabled)"
    fi
}

# Test database connection
test_database() {
    log_info "Testing database connection..."
    
    # Test local schema generation
    if DATABASE_PROVIDER=${DATABASE_PROVIDER:-sqlite} ./scripts/select-prisma-schema.sh info; then
        log_success "Database schema test passed"
    else
        log_error "Database schema test failed"
        exit 1
    fi
}

# Show usage
show_usage() {
    echo "Usage: $0 [environment] [action] [options]"
    echo ""
    echo "Environments:"
    echo "  production    Deploy production environment (PostgreSQL)"
    echo "  development   Deploy development environment (SQLite)"
    echo ""
    echo "Actions:"
    echo "  deploy        Deploy all services (default)"
    echo "  build         Build Docker images only"
    echo "  stop          Stop all services"
    echo "  restart       Restart all services"
    echo "  status        Show service status"
    echo "  logs          Show service logs"
    echo "  health        Perform health check"
    echo "  backup        Create database backup"
    echo "  test          Test database configuration"
    echo ""
    echo "Database Providers:"
    echo "  sqlite        Use SQLite (default for development)"
    echo "  postgresql    Use PostgreSQL (default for production)"
    echo ""
    echo "Examples:"
    echo "  $0 production deploy"
    echo "  $0 development logs backend"
    echo "  $0 production health"
    echo "  DATABASE_PROVIDER=postgresql $0 development test"
    echo ""
}

# Main execution logic
main() {
    log_info "Aether Identity Deployment Script with Dynamic Prisma Support"
    log_info "Environment: $ENVIRONMENT"
    log_info "Action: $ACTION"
    
    case "$ACTION" in
        "deploy")
            check_requirements
            load_env
            create_directories
            validate_prisma_schema
            test_database
            build_images
            
            if [ "$ENVIRONMENT" = "production" ]; then
                deploy_profile "production"
            else
                deploy_profile "development"
            fi
            
            sleep 10
            show_status
            health_check
            ;;
        "build")
            check_requirements
            load_env
            validate_prisma_schema
            build_images
            ;;
        "stop")
            check_requirements
            load_env
            stop_services
            ;;
        "restart")
            check_requirements
            load_env
            stop_services
            sleep 5
            if [ "$ENVIRONMENT" = "production" ]; then
                deploy_profile "production"
            else
                deploy_profile "development"
            fi
            ;;
        "status")
            check_requirements
            load_env
            show_status
            ;;
        "logs")
            check_requirements
            load_env
            show_logs "$3"
            ;;
        "health")
            check_requirements
            load_env
            health_check
            ;;
        "backup")
            check_requirements
            load_env
            backup_database
            ;;
        "test")
            check_requirements
            load_env
            test_database
            ;;
        "help"|"-h"|"--help")
            show_usage
            ;;
        *)
            log_error "Unknown action: $ACTION"
            show_usage
            exit 1
            ;;
    esac
    
    log_success "Script completed successfully"
}

# Trap to handle interruption
trap 'log_error "Script interrupted"; exit 1' INT TERM

# Run main function
main "$@"