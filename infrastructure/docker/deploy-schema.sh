#!/bin/sh
# Deploys the Prisma schema to the PostgreSQL database.
# Used by the entrypoint.sh watcher (DEPLOY_SCRIPT=/usr/local/bin/deploy-schema.sh)
# and by the postgresql service on boot. Mirrors the strategy logic of
# run_prisma_schema_deploy() in entrypoint.sh.
set -e

# ── Configuration (mirrors entrypoint.sh defaults) ───────────────────────────
PRISMA_SCHEMA_DEPLOY="${PRISMA_SCHEMA_DEPLOY:-true}"
PRISMA_SCHEMA_DEPLOY_STRATEGY="${PRISMA_SCHEMA_DEPLOY_STRATEGY:-push}"
PRISMA_MIGRATE_DEPLOY="${PRISMA_MIGRATE_DEPLOY:-true}"
DATABASE_URL="${DATABASE_URL:-}"

log_info() { echo "[INFO] $(date -u '+%Y-%m-%dT%H:%M:%SZ') - $1"; }
log_error() { echo "[ERROR] $(date -u '+%Y-%m-%dT%H:%M:%SZ') - $1" >&2; }

if [ "${PRISMA_SCHEMA_DEPLOY}" != "true" ]; then
    log_info "Prisma schema deployment disabled (PRISMA_SCHEMA_DEPLOY != true)"
    exit 0
fi

if [ -z "${DATABASE_URL}" ]; then
    log_error "DATABASE_URL is required to deploy the Prisma schema"
    exit 1
fi

# ── Locate the Prisma CLI ────────────────────────────────────────────────────
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

prisma_bin="$(find_prisma_bin || true)"
if [ -z "${prisma_bin}" ]; then
    log_error "Prisma CLI is not available"
    exit 1
fi

# ── Deploy ───────────────────────────────────────────────────────────────────
case "${PRISMA_SCHEMA_DEPLOY_STRATEGY}" in
    migrate)
        log_info "Generating Prisma client..."
        # shellcheck disable=SC2086
        DATABASE_URL="${DATABASE_URL}" ${prisma_bin} generate

        if [ "${PRISMA_MIGRATE_DEPLOY}" != "true" ]; then
            log_info "Prisma migrate deploy disabled"
            exit 0
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
        exit 1
        ;;
esac

log_info "Prisma schema deployed"
