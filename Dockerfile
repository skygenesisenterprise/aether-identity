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
COPY . .

# Build backend (no Prisma generate here)
RUN pnpm run build:api

# Build Next.js frontend
RUN pnpm run build

RUN test -d api/dist || (echo "Backend build failed" && exit 1)
RUN test -d .next || (echo "Frontend build failed" && exit 1)


#############################################
# 3. PRODUCTION IMAGE (Alpine)
#############################################
FROM node:20-alpine AS production

# Required system libs
RUN apk add --no-cache sqlite curl

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Create dirs
RUN mkdir -p /app/frontend /app/backend


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


#############################################
# Reinstall dependencies purposely in Alpine
#############################################
WORKDIR /app/backend
RUN pnpm install --prod --ignore-scripts

# Regenerate Prisma for linux-musl
RUN pnpm prisma generate

WORKDIR /app/frontend
RUN pnpm install --prod --ignore-scripts


#############################################
# DB directory
#############################################
RUN mkdir -p /app/backend/data && \
    chown -R node:node /app/backend


#############################################
# Entrypoint
#############################################
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

ENV NODE_ENV=production
ENV DATABASE_URL="file:/app/backend/data/dev.db"
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

ENTRYPOINT ["/app/docker-entrypoint.sh"]