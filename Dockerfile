#############################################
# 1. BASE IMAGE – install dependencies
#############################################
FROM node:20-bullseye AS base
RUN npm install -g pnpm
WORKDIR /app

# Copy workspace metadata
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install all dependencies
RUN pnpm install --frozen-lockfile


#############################################
# 2. BUILDER – build backend + frontend
#############################################
FROM base AS builder

# Copy the full repository
COPY . .

# Prisma client generation
RUN pnpm db:generate --schema api/prisma/schema.prisma

# Build backend
RUN pnpm run build:api

# Build Next.js frontend (Turbopack)
RUN pnpm run build

# Validate builds exist
RUN test -d api/dist || (echo "Backend build failed" && exit 1)
RUN test -d .next || (echo "Frontend build failed" && exit 1)


#############################################
# 3. PRODUCTION IMAGE
#############################################
FROM node:20-alpine AS production

# Install required system deps
RUN apk add --no-cache sqlite curl

WORKDIR /app

# Create final structure
RUN mkdir -p /app/frontend /app/backend


#############################################
# Copy Frontend (Next.js)
#############################################
COPY --from=builder /app/.next /app/frontend/.next
COPY --from=builder /app/public /app/frontend/public
COPY --from=builder /app/package.json /app/frontend/package.json
COPY --from=builder /app/node_modules /app/frontend/node_modules


#############################################
# Copy Backend (Express + Prisma)
#############################################
COPY --from=builder /app/api/dist /app/backend/dist
COPY --from=builder /app/api/prisma /app/backend/prisma
COPY --from=builder /app/api/package.backend.json /app/backend/package.json
COPY --from=builder /app/node_modules /app/backend/node_modules


#############################################
# DB directory
#############################################
RUN mkdir -p /app/backend/data && \
    chown -R node:node /app/backend


#############################################
# ENTRYPOINT SCRIPTS
#############################################
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh


#############################################
# Environment
#############################################
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:/app/backend/data/dev.db"


#############################################
# Ports
#############################################
EXPOSE 3000 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1


#############################################
# Start everything
#############################################
ENTRYPOINT ["/app/docker-entrypoint.sh"]