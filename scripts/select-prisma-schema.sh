#!/bin/bash

# Prisma Schema Selector and Generator
# This script dynamically selects the appropriate Prisma schema based on DATABASE_PROVIDER

set -e

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

# Get database provider from environment
DATABASE_PROVIDER=${DATABASE_PROVIDER:-sqlite}

# Detect context (Docker vs Local)
if [ -n "$DOCKER_CONTEXT" ]; then
    SCHEMA_DIR=${PRISMA_SCHEMA_DIR:-/app/api/prisma}
    TARGET_SCHEMA=${SCHEMA_DIR}/schema.prisma
    CONTEXT="docker"
    log_info "Docker context detected"
elif [ -f "/app/backend/prisma/schema.postgresql.prisma" ]; then
    SCHEMA_DIR=/app/backend/prisma
    TARGET_SCHEMA=${SCHEMA_DIR}/schema.prisma
    CONTEXT="docker"
    log_info "Docker context detected (backend path)"
else
    SCHEMA_DIR=${SCHEMA_DIR:-./api/prisma}
    TARGET_SCHEMA=${SCHEMA_DIR}/schema.prisma
    CONTEXT="local"
    log_info "Local context detected"
fi

log_info "Prisma Schema Selector"
log_info "Database Provider: $DATABASE_PROVIDER"
log_info "Context: $CONTEXT"
log_info "Schema Directory: $SCHEMA_DIR"
log_info "Target Schema: $TARGET_SCHEMA"

# Function to validate schema exists
validate_schema() {
    local schema_file=$1
    if [ ! -f "$schema_file" ]; then
        log_error "Schema file not found: $schema_file"
        log_info "Available files in $(dirname "$schema_file"):"
        ls -la "$(dirname "$schema_file")" 2>/dev/null || echo "Directory not accessible"
        exit 1
    fi
    log_success "Schema file found: $schema_file"
}

# Function to copy schema with retry mechanism
copy_schema() {
    local source_schema=$1
    local target_schema=$2
    local max_retries=3
    local retry_count=0
    
    log_info "Copying schema from $source_schema to $target_schema"
    
    while [ $retry_count -lt $max_retries ]; do
        # Try to remove target file first to avoid "Plan mode" error
        if [ -f "$target_schema" ]; then
            if ! rm -f "$target_schema" 2>/dev/null; then
                log_warning "Cannot remove $target_schema directly, trying with sudo..."
                if ! sudo rm -f "$target_schema" 2>/dev/null; then
                    log_warning "Cannot remove $target_schema, trying to overwrite directly..."
                    # Try to copy with force flag as fallback
                    if ! cp -f "$source_schema" "$target_schema" 2>/dev/null; then
                        retry_count=$((retry_count + 1))
                        if [ $retry_count -lt $max_retries ]; then
                            log_warning "Copy attempt $retry_count failed, retrying in 2 seconds..."
                            sleep 2
                            continue
                        else
                            log_error "Failed to copy schema after $max_retries attempts. Please check permissions for $target_schema"
                            # Try alternative approach: create temp file and move
                            local temp_schema="${target_schema}.tmp.$$"
                            if cp "$source_schema" "$temp_schema" && mv "$temp_schema" "$target_schema"; then
                                log_success "Schema copied successfully using temp file approach"
                                return 0
                            else
                                rm -f "$temp_schema" 2>/dev/null
                                exit 1
                            fi
                        fi
                    else
                        log_success "Schema overwritten successfully"
                        return 0
                    fi
                fi
            fi
            log_info "Removed existing target schema"
        fi
        
        # Copy the schema
        if cp "$source_schema" "$target_schema"; then
            log_success "Schema copied successfully"
            return 0
        else
            retry_count=$((retry_count + 1))
            if [ $retry_count -lt $max_retries ]; then
                log_warning "Copy attempt $retry_count failed, retrying in 2 seconds..."
                sleep 2
            else
                log_error "Failed to copy schema from $source_schema to $target_schema after $max_retries attempts"
                exit 1
            fi
        fi
    done
}

# Function to validate Prisma schema
validate_prisma_schema() {
    local schema_file=$1
    
    log_info "Validating Prisma schema..."
    if npx prisma validate --schema "$schema_file"; then
        log_success "Prisma schema validation passed"
        return 0
    else
        log_error "Prisma schema validation failed"
        return 1
    fi
}

# Function to generate Prisma client
generate_prisma_client() {
    local schema_file=$1
    
    log_info "Generating Prisma client..."
    if npx prisma generate --schema "$schema_file"; then
        log_success "Prisma client generated successfully"
        return 0
    else
        log_error "Prisma client generation failed"
        return 1
    fi
}

# Function to show schema info
show_schema_info() {
    local schema_file=$1
    
    log_info "Schema Information:"
    echo "  File: $schema_file"
    echo "  Size: $(du -h "$schema_file" | cut -f1)"
    echo "  Modified: $(stat -c %y "$schema_file" 2>/dev/null || stat -f %Sm "$schema_file" 2>/dev/null)"
    
    # Extract provider from schema
    local provider=$(grep -A 5 "datasource db" "$schema_file" | grep "provider" | cut -d'"' -f2 || echo "unknown")
    echo "  Provider: $provider"
}

# Main execution logic
main() {
    local action=${1:-generate}
    
    case "$DATABASE_PROVIDER" in
        "postgresql")
            SOURCE_SCHEMA="${SCHEMA_DIR}/schema.postgresql.prisma"
            log_info "Using PostgreSQL schema"
            # Set default DATABASE_URL for PostgreSQL if not provided
            if [ -z "$DATABASE_URL" ]; then
                export DATABASE_URL="postgresql://postgres:password@localhost:5432/aether_identity"
                log_info "Using default PostgreSQL URL for validation"
            fi
            ;;
        "sqlite")
            SOURCE_SCHEMA="${SCHEMA_DIR}/schema.sqlite.prisma"
            log_info "Using SQLite schema"
            # Set default DATABASE_URL for SQLite if not provided
            if [ -z "$DATABASE_URL" ]; then
                export DATABASE_URL="file:./api/prisma/dev.db"
                log_info "Using default SQLite URL for validation"
            fi
            ;;
        *)
            log_warning "Unknown database provider: $DATABASE_PROVIDER, defaulting to SQLite"
            SOURCE_SCHEMA="${SCHEMA_DIR}/schema.sqlite.prisma"
            DATABASE_PROVIDER="sqlite"
            # Set default DATABASE_URL for SQLite if not provided
            if [ -z "$DATABASE_URL" ]; then
                export DATABASE_URL="file:./api/prisma/dev.db"
                log_info "Using default SQLite URL for validation"
            fi
            ;;
    esac
    
    # Validate source schema exists
    validate_schema "$SOURCE_SCHEMA"
    
    # Create schema directory if it doesn't exist
    mkdir -p "$(dirname "$TARGET_SCHEMA")"
    
    case "$action" in
        "copy")
            copy_schema "$SOURCE_SCHEMA" "$TARGET_SCHEMA"
            ;;
        "validate")
            copy_schema "$SOURCE_SCHEMA" "$TARGET_SCHEMA"
            validate_prisma_schema "$TARGET_SCHEMA"
            ;;
        "generate")
            copy_schema "$SOURCE_SCHEMA" "$TARGET_SCHEMA"
            validate_prisma_schema "$TARGET_SCHEMA"
            generate_prisma_client "$TARGET_SCHEMA"
            ;;
        "info")
            show_schema_info "$SOURCE_SCHEMA"
            ;;
        "help"|"-h"|"--help")
            echo "Usage: $0 [action]"
            echo ""
            echo "Actions:"
            echo "  copy      Copy the appropriate schema to schema.prisma"
            echo "  validate  Copy and validate the schema"
            echo "  generate  Copy, validate, and generate Prisma client (default)"
            echo "  info      Show schema information"
            echo "  help      Show this help message"
            echo ""
            echo "Environment Variables:"
            echo "  DATABASE_PROVIDER    Database provider (sqlite, postgresql)"
            echo "  SCHEMA_DIR          Schema directory (default: ./api/prisma)"
            echo ""
            echo "Examples:"
            echo "  DATABASE_PROVIDER=postgresql $0 generate"
            echo "  DATABASE_PROVIDER=sqlite $0 validate"
            ;;
        *)
            log_error "Unknown action: $action"
            echo "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
    
    log_success "Operation completed successfully"
}

# Trap to handle interruption
trap 'log_error "Script interrupted"; exit 1' INT TERM

# Run main function
main "$@"