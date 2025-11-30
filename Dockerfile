#############################################
# 1. BASE (Debian) – install dependencies
#############################################
FROM node:20-bullseye AS base
RUN npm install -g pnpm
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile


#############################################
# 2. BUILDER (Debian) – build backend + frontend
#############################################
FROM base AS builder
ARG NODE_ENV=production
ARG DATABASE_PROVIDER=postgresql

# Set build environment
ENV NODE_ENV=${NODE_ENV}
ENV DATABASE_PROVIDER=${DATABASE_PROVIDER}

COPY . .

# Generate Prisma client first
RUN npx prisma generate --schema api/prisma/schema.prisma

# Build backend
RUN pnpm run build:api

# Build Next.js frontend
RUN pnpm run build

RUN test -d api/dist || (echo "Backend build failed" && exit 1)
RUN test -d .next || (echo "Frontend build failed" && exit 1)


#############################################
# 3. PRODUCTION IMAGE (Alpine)
#############################################
FROM node:20-alpine AS production

# Required system libs for both SQLite and PostgreSQL
RUN apk add --no-cache \
    sqlite \
    curl \
    openssl \
    postgresql-client \
    bash \
    ncurses

# Install pnpm
RUN npm install -g pnpm && pnpm --version

WORKDIR /app

# Create dirs with proper permissions
RUN mkdir -p /app/frontend /app/backend /app/backups /app/logs /app/data && \
    chown -R node:node /app && \
    chmod -R 755 /app

#############################################
# Copy build artifacts only (no node_modules)
#############################################
# Frontend
COPY --from=builder /app/.next /app/frontend/.next
COPY --from=builder /app/public /app/frontend/public
COPY --from=builder /app/package.json /app/frontend/package.json

# Backend compiled output
COPY --from=builder /app/api/dist /app/backend/dist
COPY --from=builder /app/api/prisma /app/backend/prisma
COPY --from=builder /app/api/package.backend.json /app/backend/package.json

# Copy scripts and configuration
COPY --from=builder /app/docker-entrypoint.sh /app/docker-entrypoint.sh
COPY --from=builder /app/.env.example /app/.env.example

# Make scripts executable
RUN chmod +x /app/docker-entrypoint.sh

#############################################
# Reinstall dependencies purposely in Alpine
#############################################
WORKDIR /app/backend
RUN pnpm install --prod --ignore-scripts

# Regenerate Prisma for linux-musl with dynamic provider
RUN npx prisma generate --schema /app/backend/prisma/schema.prisma

WORKDIR /app/frontend
RUN pnpm install --prod --ignore-scripts

#############################################
# Default Environment Variables
#############################################
ENV NODE_ENV=production
ENV DATABASE_PROVIDER=postgresql
ENV DATABASE_URL=""
ENV NEXT_TELEMETRY_DISABLED=1

# Default safety settings
ENV BACKUP_ENABLED=true
ENV AUTO_BACKUP_BEFORE_MIGRATION=true
ENV DISABLE_DB_RESET=true
ENV DISABLE_SEED_OVERRIDE=true
ENV REQUIRE_MIGRATION_BACKUP=true

# Default logging
ENV LOG_LEVEL=warn
ENV LOG_FILE=logs/api.log

# Default ports
ENV PORT=8080
ENV BACKEND_PORT=8080
ENV FRONTEND_PORT=3000

# Default PostgreSQL settings
ENV POSTGRES_HOST=postgres
ENV POSTGRES_PORT=5432
ENV POSTGRES_DB=aether_identity
ENV POSTGRES_USER=aether_user

# Expose ports
EXPOSE 3000 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:${BACKEND_PORT:-8080}/health || exit 1

# Set user
USER node

ENTRYPOINT ["/app/docker-entrypoint.sh"]