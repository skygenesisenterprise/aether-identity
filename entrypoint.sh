#!/bin/sh
set -e

export PATH="/usr/local/go/bin:/go/bin:/root/go/bin:/root/.local/share/corepack:/root/.local/share/corepack/shims:/usr/local/bin:/usr/bin:/bin:${PATH}"
export NODE_ENV="${NODE_ENV:-development}"
export LOG_LEVEL="${LOG_LEVEL:-info}"
export PRISMA_SCHEMA_DEPLOY="${PRISMA_SCHEMA_DEPLOY:-true}"
export PRISMA_SCHEMA_DEPLOY_STRATEGY="${PRISMA_SCHEMA_DEPLOY_STRATEGY:-push}"
export ALLOW_MIGRATION_FAILURE="${ALLOW_MIGRATION_FAILURE:-false}"
export PRISMA_MIGRATE_DEPLOY="${PRISMA_MIGRATE_DEPLOY:-true}"
export PRISMA_HOT_RELOAD="${PRISMA_HOT_RELOAD:-false}"
export PRISMA_POLL_INTERVAL="${PRISMA_POLL_INTERVAL:-5}"

# ── Logging ────────────────────────────────────────────────────────────────────

timestamp_utc() {
    date -u '+%Y-%m-%dT%H:%M:%SZ'
}

should_log() {
    requested_level="$1"

    case "${LOG_LEVEL:-info}" in
        debug)  return 0 ;;
        info)   [ "${requested_level}" != "debug" ] ;;
        warn)   [ "${requested_level}" = "warn" ] || [ "${requested_level}" = "error" ] ;;
        error)  [ "${requested_level}" = "error" ] ;;
        *)      return 0 ;;
    esac
}

log_debug() {
    if should_log debug; then
        echo "[DEBUG] $(timestamp_utc) - $1"
    fi
}

log_info() {
    if should_log info; then
        echo "[INFO] $(timestamp_utc) - $1"
    fi
}

log_warn() {
    if should_log warn; then
        echo "[WARN] $(timestamp_utc) - $1" >&2
    fi
}

log_error() {
    if should_log error; then
        echo "[ERROR] $(timestamp_utc) - $1" >&2
    fi
}

# ── Runtime defaults ──────────────────────────────────────────────────────────

configure_runtime() {
    export USE_EMBEDDED_DB="${USE_EMBEDDED_DB:-false}"
    export FRONTEND_PORT="${FRONTEND_PORT:-3000}"
    export API_PORT="${API_PORT:-8080}"
    export SERVER_PORT="${SERVER_PORT:-${API_PORT}}"
    if [ "${NODE_ENV}" = "production" ]; then
        export GIN_MODE="${GIN_MODE:-release}"
    else
        export GIN_MODE="${GIN_MODE:-debug}"
    fi
}

# ── Display ───────────────────────────────────────────────────────────────────

display_header() {
    echo ""
    echo "Aether Identity container"
    echo ""
    log_info "Node env: ${NODE_ENV}"
    log_info "Frontend: http://localhost:${FRONTEND_PORT}"
    log_info "API:      http://localhost:${API_PORT}"
    echo ""
}

# ── Helpers ───────────────────────────────────────────────────────────────────

setup_pnpm() {
    if command -v pnpm >/dev/null 2>&1; then
        return 0
    fi

    if command -v corepack >/dev/null 2>&1; then
        corepack enable >/dev/null 2>&1 || true
        corepack prepare pnpm@9.15.4 --activate >/dev/null 2>&1 || true
    fi

    if command -v pnpm >/dev/null 2>&1; then
        return 0
    fi

    log_warn "pnpm is not available; falling back to npx where possible"
}

find_backend_binary() {
    for binary in \
        /app/server/aether-server \
        /app/tmp/aether-server
    do
        if [ -x "${binary}" ]; then
            echo "${binary}"
            return 0
        fi
    done

    return 1
}

find_prisma_dir() {
    for dir in /prisma /app/prisma /app/server/prisma ./server/prisma; do
        if [ -f "${dir}/schema.prisma" ]; then
            echo "${dir}"
            return 0
        fi
    done
    return 1
}

find_prisma_bin() {
    for bin in \
        /prisma/node_modules/.bin/prisma \
        /app/prisma/node_modules/.bin/prisma \
        /app/server/prisma/node_modules/.bin/prisma \
        ./node_modules/.bin/prisma \
        ./server/prisma/node_modules/.bin/prisma
    do
        if [ -x "${bin}" ]; then
            echo "${bin}"
            return 0
        fi
    done

    if command -v prisma >/dev/null 2>&1; then
        command -v prisma
        return 0
    fi

    if command -v npx >/dev/null 2>&1; then
        echo "npx prisma"
        return 0
    fi

    return 1
}

run_prisma_schema_deploy() {
    if [ "${PRISMA_SCHEMA_DEPLOY:-true}" != "true" ]; then
        log_info "Prisma schema deployment disabled"
        return 0
    fi

    if [ -z "${DATABASE_URL:-}" ]; then
        log_error "DATABASE_URL is required to deploy the Prisma schema"
        return 1
    fi

    prisma_dir="$(find_prisma_dir || true)"
    if [ -z "${prisma_dir}" ]; then
        log_warn "Prisma schema not found; skipping database schema setup"
        return 0
    fi

    cd "${prisma_dir}"

    prisma_bin="$(find_prisma_bin || true)"
    if [ -z "${prisma_bin}" ] && [ -f package.json ] && command -v npm >/dev/null 2>&1; then
        log_info "Installing Prisma dependencies..."
        if [ -f package-lock.json ]; then
            npm ci --no-audit --no-fund || return 1
        else
            npm install --no-audit --no-fund || return 1
        fi
        prisma_bin="$(find_prisma_bin || true)"
    fi

    if [ -z "${prisma_bin}" ]; then
        log_error "Prisma CLI is not available"
        return 1
    fi

    case "${PRISMA_SCHEMA_DEPLOY_STRATEGY:-push}" in
        migrate)
            log_info "Generating Prisma client..."
            # shellcheck disable=SC2086
            DATABASE_URL="${DATABASE_URL}" ${prisma_bin} generate

            if [ "${PRISMA_MIGRATE_DEPLOY:-true}" != "true" ]; then
                log_info "Prisma migrate deploy disabled"
                return 0
            fi

            log_info "Deploying Prisma migrations"
            # shellcheck disable=SC2086
            DATABASE_URL="${DATABASE_URL}" ${prisma_bin} migrate deploy
            ;;
        push)
            log_info "Pushing Prisma schema"
            # shellcheck disable=SC2086
            DATABASE_URL="${DATABASE_URL}" ${prisma_bin} db push --accept-data-loss
            ;;
        *)
            log_error "Unknown PRISMA_SCHEMA_DEPLOY_STRATEGY: ${PRISMA_SCHEMA_DEPLOY_STRATEGY}"
            return 1
            ;;
    esac

    log_info "Prisma schema deployed"
}

# ── Prisma hot-reload watcher ───────────────────────────────────────────────

start_prisma_watcher() {
    schema_path="${SCHEMA_PATH:-/app/server/prisma/schema.prisma}"
    schema_dir="$(dirname "${schema_path}")"
    migrations_dir="${schema_dir}/migrations"
    deploy_script="${DEPLOY_SCRIPT:-/usr/local/bin/deploy-schema.sh}"
    poll_interval="${PRISMA_POLL_INTERVAL:-5}"

    if [ ! -f "${schema_path}" ]; then
        log_warn "Schema file not found at ${schema_path}; watcher disabled"
        return 0
    fi

    compute_combined_hash() {
        schema_hash=$(sha256sum "${schema_path}" 2>/dev/null | awk '{print $1}' || echo "")
        mig_hash=""
        if [ -d "${migrations_dir}" ]; then
            mig_hash=$(find "${migrations_dir}" -type f -name "*.sql" -o -name "migration_lock.toml" 2>/dev/null \
                | sort \
                | xargs -d '\n' sha256sum 2>/dev/null \
                | sha256sum \
                | awk '{print $1}' || echo "")
        fi
        echo "${schema_hash}|${mig_hash}"
    }

    run_migration() {
        log_info "Change detected — deploying migrations..."
        if [ -x "${deploy_script}" ]; then
            "${deploy_script}" || log_warn "Migration deploy failed (hot-reload)"
        else
            run_prisma_schema_deploy || log_warn "Migration deploy failed (hot-reload)"
        fi
    }

    if command -v inotifywait >/dev/null 2>&1; then
        log_info "Watching schema and migrations for changes (inotify)"
        log_info "  • schema    : ${schema_path}"
        log_info "  • migrations: ${migrations_dir}"
        while true; do
            inotifywait -qq -e modify,create,delete,move "${schema_path}" 2>/dev/null || {
                inotifywait -qq -e modify,create,delete,move -r "${migrations_dir}" 2>/dev/null || {
                    sleep "${poll_interval}"
                    continue
                }
            }
            run_migration
        done
    else
        log_info "Watching schema and migrations for changes (polling every ${poll_interval}s)"
        log_info "  • schema    : ${schema_path}"
        log_info "  • migrations: ${migrations_dir}"
        prev_hash=""
        while true; do
            curr_hash="$(compute_combined_hash)"
            if [ -n "${prev_hash}" ] && [ "${curr_hash}" != "${prev_hash}" ]; then
                run_migration
            fi
            prev_hash="${curr_hash}"
            sleep "${poll_interval}"
        done
    fi
}

# ── PostgreSQL role ─────────────────────────────────────────────────────────

run_postgresql() {
    export PGDATA="${PGDATA:-/var/lib/postgresql/data}"
    export LANG="${LANG:-C.UTF-8}"
    export LC_ALL="${LC_ALL:-C.UTF-8}"

    log_info "PostgreSQL container starting"
    log_info "Data directory: ${PGDATA}"

    # Root-level setup: ensure directories exist and are owned by postgres
    mkdir -p "$PGDATA" /var/run/postgresql
    chown -R postgres:postgres "$PGDATA" /var/run/postgresql

    # Initialize the database cluster if the data directory is empty
    if [ ! -f "$PGDATA/PG_VERSION" ]; then
        log_info "Initializing PostgreSQL data directory..."
        gosu postgres initdb -D "$PGDATA" --encoding=UTF8 --locale=C.UTF-8 --auth-host=trust --auth-local=trust
        {
            echo "listen_addresses = '*'"
            echo "port = 5432"
        } >> "$PGDATA/postgresql.conf"
    fi

    # Ensure Docker network connections are allowed (development only)
    if [ -f "$PGDATA/pg_hba.conf" ]; then
        if ! grep -q "^host all all all " "$PGDATA/pg_hba.conf"; then
            log_info "Allowing connections from any host in pg_hba.conf"
            {
                echo ""
                echo "# Allow connections from any host (development only)"
                echo "host all all all trust"
            } >> "$PGDATA/pg_hba.conf"
        fi
    fi

    # Start PostgreSQL in the background
    gosu postgres postgres -D "$PGDATA" -c listen_addresses='*' -c port=5432 &
    pg_pid=$!

    trap "kill ${pg_pid} 2>/dev/null; wait ${pg_pid} 2>/dev/null" SIGTERM SIGINT

    log_info "Waiting for PostgreSQL to accept connections..."
    retry=0
    max_retry=60
    until pg_isready -U "${POSTGRES_USER:-postgres}" -q 2>/dev/null; do
        retry=$((retry + 1))
        if [ "${retry}" -ge "${max_retry}" ]; then
            log_error "PostgreSQL did not become ready within ${max_retry}s"
            return 1
        fi
        if ! kill -0 ${pg_pid} 2>/dev/null; then
            log_error "PostgreSQL process exited unexpectedly"
            return 1
        fi
        sleep 1
    done
    log_info "PostgreSQL is accepting connections"

    # Create the requested role/database (mirrors the official image behaviour)
    db_user="${POSTGRES_USER:-postgres}"
    db_pass="${POSTGRES_PASSWORD:-}"
    db_name="${POSTGRES_DB:-postgres}"

    if [ "${db_user}" != "postgres" ]; then
        log_info "Creating role: ${db_user}"
        gosu postgres psql -v ON_ERROR_STOP=1 --username postgres -tc "SELECT 1 FROM pg_roles WHERE rolname='${db_user}'" | grep -q 1 || \
            gosu postgres psql -v ON_ERROR_STOP=1 --username postgres -c "CREATE ROLE \"${db_user}\" WITH SUPERUSER LOGIN PASSWORD '${db_pass}'" || true
    fi
    if [ "${db_name}" != "postgres" ]; then
        log_info "Creating database: ${db_name}"
        gosu postgres psql -v ON_ERROR_STOP=1 --username postgres -tc "SELECT 1 FROM pg_database WHERE datname='${db_name}'" | grep -q 1 || \
            gosu postgres psql -v ON_ERROR_STOP=1 --username postgres -c "CREATE DATABASE \"${db_name}\" OWNER \"${db_user}\"" || true
    fi

    # Prisma schema deployment
    if ! run_prisma_schema_deploy; then
        if [ "${ALLOW_MIGRATION_FAILURE}" = "true" ]; then
            log_warn "Prisma schema deployment failed; continuing because ALLOW_MIGRATION_FAILURE=true"
        else
            log_error "Prisma schema deployment failed"
            return 1
        fi
    fi

    # Hot-reload watcher (background)
    if [ "${PRISMA_HOT_RELOAD}" = "true" ]; then
        start_prisma_watcher &
    fi

    # Forward signals and wait for PostgreSQL to exit
    wait ${pg_pid}
}

# ── Commands ──────────────────────────────────────────────────────────────────

run_server() {
    configure_runtime
    setup_pnpm

    if [ "${NODE_ENV}" = "production" ]; then
        log_info "Aether Identity frontend starting (static)"
        log_info "Frontend listening on 0.0.0.0:${FRONTEND_PORT}"

        if [ ! -d /app/out ]; then
            log_error "Static frontend build not found at /app/out"
            return 1
        fi

        http_server_args="/app/out -a 0.0.0.0 -p ${FRONTEND_PORT} -c-1 -e html"
        if [ "${HTTP_ACCESS_LOGS}" != "true" ]; then
            http_server_args="${http_server_args} --silent"
        fi

        log_info "Starting static frontend"
        # shellcheck disable=SC2086
        exec http-server ${http_server_args}
    fi

    log_info "Aether Identity frontend starting (development)"
    log_info "Frontend listening on 0.0.0.0:${FRONTEND_PORT}"

    if [ -d /app/apps ]; then
        cd /app/apps
    elif [ -d ./apps ]; then
        cd ./apps
    else
        log_error "Next.js app directory not found at /app/apps or ./apps"
        return 1
    fi
    rm -rf .next/cache 2>/dev/null || true

    if command -v pnpm >/dev/null 2>&1; then
        exec pnpm next dev -p "${FRONTEND_PORT}" -H 0.0.0.0 --turbopack "$@"
    fi

    if command -v npx >/dev/null 2>&1; then
        exec npx next dev -p "${FRONTEND_PORT}" -H 0.0.0.0 --turbopack "$@"
    fi

    log_error "Neither pnpm nor npx is available"
    return 1
}

run_worker() {
    configure_runtime

    log_info "Aether Identity API starting"
    log_info "Backend runtime configured for 0.0.0.0:${SERVER_PORT}"

    if [ -z "${DATABASE_URL:-}" ]; then
        log_error "DATABASE_URL is required for the Go API"
        return 1
    fi

    if ! run_prisma_schema_deploy; then
        if [ "${ALLOW_MIGRATION_FAILURE}" = "true" ]; then
            log_warn "Prisma schema deployment failed; continuing because ALLOW_MIGRATION_FAILURE=true"
        else
            log_error "Prisma schema deployment failed"
            return 1
        fi
    fi

    backend_binary="$(find_backend_binary || true)"
    if [ -z "${backend_binary}" ]; then
        log_error "Go backend binary not found at /app/server/aether-server"
        return 1
    fi

    log_info "Starting Go backend"
    exec "${backend_binary}" worker "$@"
}

run_air() {
    configure_runtime

    log_info "Aether Identity API starting (hot-reload)"

    if ! run_prisma_schema_deploy; then
        if [ "${ALLOW_MIGRATION_FAILURE}" = "true" ]; then
            log_warn "Prisma schema deployment failed; continuing because ALLOW_MIGRATION_FAILURE=true"
        else
            log_error "Prisma schema deployment failed"
            return 1
        fi
    fi

    log_info "Starting air for Go hot-reload"
    cd /app
    exec air "$@"
}

# ── Entrypoint ────────────────────────────────────────────────────────────────

role="${1:-server}"

case "${role}" in
    server)
        shift || true
        run_server "$@"
        ;;
    worker)
        shift || true
        run_worker "$@"
        ;;
    air)
        shift || true
        run_air "$@"
        ;;
    postgresql)
        shift || true
        run_postgresql "$@"
        ;;
    *)
        configure_runtime
        display_header
        exec "$@"
        ;;
esac
