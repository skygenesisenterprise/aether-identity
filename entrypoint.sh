#!/bin/sh
set -e

# =============================================================================
# The Etheria Times - Service Entry Point
# =============================================================================

export PATH="/usr/local/bin:/usr/bin:/bin:/usr/local/go/bin:/go/bin:/root/go/bin:/root/.local/share/corepack"
export NODE_ENV="${NODE_ENV:-development}"

# =============================================================================
# Configuration
# =============================================================================

DB_HOST="${DB_HOST:-db}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-etheria_account}"
DB_USER="${DB_USER:-aether}"
DB_PASSWORD="${DB_PASSWORD:-password}"
DB_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

FRONTEND_PORT="${FRONTEND_PORT:-3000}"
API_PORT="${API_PORT:-8080}"

# =============================================================================
# Logging Functions
# =============================================================================

log_info() {
    echo "[INFO] $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_success() {
    echo "[✓]  $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_warn() {
    echo "[!]  $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_error() {
    echo "[X]  $(date '+%Y-%m-%d %H:%M:%S') - $1" >&2
}

# =============================================================================
# Header Display
# =============================================================================

display_header() {
    echo ""
    echo "╔══════════════════════════════════════════════════════════════════════╗"
    echo "║                    The Etheria Times                                 ║"
    echo "║               Enterprise Account Management                          ║"
    echo "║                   Version 1.0.0-alpha                                ║"
    echo "╚══════════════════════════════════════════════════════════════════════╝"
    echo ""
    log_info "Frontend: http://localhost:${FRONTEND_PORT}"
    log_info "API:      http://localhost:${API_PORT}"
    log_info "Database: ${DB_HOST}:${DB_PORT}/${DB_NAME}"
    echo ""
}

# =============================================================================
# System Setup
# =============================================================================

setup_pnpm() {
    log_info "Configuring pnpm..."
    rm -f /usr/local/bin/pnpm
    corepack enable
    corepack prepare pnpm@9.15.4 --activate
    log_success "pnpm configured"
}

# =============================================================================
# Database Health Check
# =============================================================================

wait_for_database() {
    if [ "$SKIP_PRISMA_SETUP" = "true" ]; then
        log_info "Database check skipped (handled by entrypoint script)"
        return 0
    fi

    log_info "Waiting for database to be ready..."

    MAX_RETRIES=30
    RETRY_COUNT=0

    while ! PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c '\q' 2>/dev/null; do
        RETRY_COUNT=$((RETRY_COUNT + 1))

        if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
            log_warn "Database not available after ${MAX_RETRIES} attempts"
            log_warn "Continuing in mock mode - some features may not work"
            return 1
        fi

        log_info "Waiting for database... (${RETRY_COUNT}/${MAX_RETRIES})"
        sleep 2
    done

    log_success "Database connected"
    return 0
}

# =============================================================================
# Prisma Setup
# =============================================================================

setup_prisma() {
    if [ "$SKIP_PRISMA_SETUP" = "true" ]; then
        log_info "Skipping Prisma setup (handled by entrypoint script)"
        return 0
    fi

    log_info "Setting up Prisma..."

    PRISMA_DIR="/app/server/prisma"

    if [ -d "$PRISMA_DIR" ]; then
        cd "$PRISMA_DIR"

        if [ -f "package.json" ]; then
            log_info "Installing Prisma dependencies..."
            npm install --silent 2>/dev/null || true
        fi

        if [ -f "schema.prisma" ]; then
            log_info "Generating Prisma client..."
            npx prisma generate 2>/dev/null || log_warn "Prisma generate failed, continuing..."

            log_info "Running database migrations..."
            npx prisma db push --accept-data-loss 2>/dev/null || log_warn "Prisma db push failed, continuing..."
        fi

        log_success "Prisma setup complete"
    else
        log_warn "Prisma directory not found at ${PRISMA_DIR}"
    fi
}

# =============================================================================
# Service Starters
# =============================================================================

start_frontend() {
    log_info "Starting Next.js on port ${FRONTEND_PORT}..."

    cd /app/app
    pnpm next dev -p "$FRONTEND_PORT" -H 0.0.0.0 &

    NEXT_PID=$!
    echo "$NEXT_PID" > /tmp/next.pid

    log_info "Next.js started (PID: $NEXT_PID)"

    # Wait for Next.js to be ready
    log_info "Waiting for Next.js to be ready..."
    sleep 5

    # Verify it's running
    if kill -0 "$NEXT_PID" 2>/dev/null; then
        log_success "Next.js is ready"
    else
        log_error "Next.js failed to start"
        return 1
    fi
}

start_api() {
    log_info "Starting Go API server on port ${API_PORT}..."

    cd /app
    air -c /app/.air.toml &

    API_PID=$!
    echo "$API_PID" > /tmp/api.pid

    log_info "Go API server started (PID: $API_PID)"

    # Wait a moment for the API to initialize
    sleep 3

    # Verify it's running
    if kill -0 "$API_PID" 2>/dev/null; then
        log_success "Go API server is ready"
    else
        log_error "Go API server failed to start"
        return 1
    fi
}

# =============================================================================
# Service Monitor
# =============================================================================

monitor_services() {
    log_info "All services started successfully!"
    echo ""
    echo "══════════════════════════════════════════════════════════════════════"
    echo "  Services are running. Press Ctrl+C to stop."
    echo "══════════════════════════════════════════════════════════════════════"
    echo ""

    # Monitor both processes
    while true; do
        # Check if either process died
        if ! kill -0 "$NEXT_PID" 2>/dev/null || ! kill -0 "$API_PID" 2>/dev/null; then
            log_error "A service has stopped unexpectedly!"
            break
        fi
        sleep 5
    done
}

# =============================================================================
# Cleanup Handler
# =============================================================================

cleanup() {
    echo ""
    log_info "Stopping services..."

    # Read PIDs
    if [ -f /tmp/next.pid ]; then
        kill "$(cat /tmp/next.pid)" 2>/dev/null || true
        rm -f /tmp/next.pid
    fi

    if [ -f /tmp/api.pid ]; then
        kill "$(cat /tmp/api.pid)" 2>/dev/null || true
        rm -f /tmp/api.pid
    fi

    log_info "All services stopped"
    exit 0
}

# =============================================================================
# Main Execution
# =============================================================================

main() {
    display_header

    # Setup
    setup_pnpm

    # Database check
    if wait_for_database; then
        setup_prisma
    fi

    # Start services
    start_frontend || log_warn "Frontend failed to start"
    start_api || log_warn "API failed to start"

    # Monitor
    monitor_services
}

# Trap for cleanup
trap cleanup SIGINT SIGTERM

# Run
main