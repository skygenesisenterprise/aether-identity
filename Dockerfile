#############################################
# 1. BASE (Debian) – install dependencies
#############################################
FROM node:20-bullseye AS base

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files and install dependencies
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
ENV DOCKER_CONTEXT=true
ENV PRISMA_SCHEMA_DIR=/app/api/prisma

# Copy all source code
COPY . .

# Copy Prisma schema selector script
COPY scripts/select-prisma-schema.sh /tmp/select-prisma-schema.sh
RUN chmod +x /tmp/select-prisma-schema.sh

# Generate Prisma client for TypeScript build
RUN DATABASE_PROVIDER=${DATABASE_PROVIDER:-sqlite} /tmp/select-prisma-schema.sh generate

# Build backend
RUN pnpm run build:api

# Build frontend (Next.js)
RUN pnpm run build

#############################################
# 3. PRODUCTION IMAGE (Alpine)
#############################################
FROM node:20-alpine AS production

# Install required system libraries
RUN apk add --no-cache \
    sqlite \
    curl \
    openssl \
    postgresql-client \
    bash \
    ncurses

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Create directories with proper permissions
RUN mkdir -p /app/frontend /app/backend /app/backups /app/logs /app/data

#############################################
# Copy build artifacts only
#############################################
# Frontend
COPY --from=builder /app/.next /app/frontend/.next
COPY --from=builder /app/public /app/frontend/public
COPY --from=builder /app/package.json /app/frontend/package.json

# Backend
COPY --from=builder /app/api/dist /app/backend/dist
COPY --from=builder /app/api/prisma /app/backend/prisma
COPY --from=builder /app/api/package.backend.json /app/backend/package.json

# Copy scripts and environment examples
COPY --from=builder /app/docker-entrypoint.sh /app/docker-entrypoint.sh
COPY --from=builder /app/.env.example /app/.env.example

RUN chmod +x /app/docker-entrypoint.sh

# Give node user ownership of prisma folder to avoid runtime permission issues
RUN chown -R node:node /app/backend/prisma

#############################################
# Install production dependencies
#############################################
WORKDIR /app/backend
RUN pnpm install --prod --ignore-scripts

# Copy Prisma schema selector script for runtime (optional)
COPY --from=builder /tmp/select-prisma-schema.sh /tmp/select-prisma-schema.sh
ENV DOCKER_CONTEXT=true
ENV PRISMA_SCHEMA_DIR=/app/backend/prisma

WORKDIR /app/frontend
RUN pnpm install --prod --ignore-scripts

#############################################
# Default environment variables
#############################################
ENV NODE_ENV=production
ENV DATABASE_PROVIDER=postgresql
ENV DATABASE_URL=""
ENV NEXT_TELEMETRY_DISABLED=1

# Safety defaults
ENV BACKUP_ENABLED=true
ENV AUTO_BACKUP_BEFORE_MIGRATION=true
ENV DISABLE_DB_RESET=true
ENV DISABLE_SEED_OVERRIDE=true
ENV REQUIRE_MIGRATION_BACKUP=true

# Logging defaults
ENV LOG_LEVEL=warn
ENV LOG_FILE=logs/api.log

# Ports
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

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:${BACKEND_PORT:-8080}/health || exit 1

# Use unprivileged user
USER node

# Entrypoint
ENTRYPOINT ["/app/docker-entrypoint.sh"]