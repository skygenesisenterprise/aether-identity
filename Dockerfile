# Multi-stage build for frontend and backend
FROM node:20-bullseye AS base

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Frontend build stage
FROM base AS frontend-builder
COPY . .
RUN pnpm run build
RUN ls -la .next || echo "Build failed - no .next directory"

# Backend build stage  
FROM base AS backend-builder
COPY . .
# Generate Prisma client first
RUN pnpm db:generate --schema api/prisma/schema.prisma
# Then build API
RUN pnpm run build:api

# Production stage with both services
FROM node:20-alpine AS production

# Install additional dependencies for Prisma and curl for health check
RUN apk add --no-cache sqlite curl

# Create app directories
WORKDIR /app
RUN mkdir -p /app/frontend /app/backend

# Copy built frontend (standalone mode)
COPY --from=frontend-builder ./.next/standalone /app/frontend/
COPY --from=frontend-builder ./.next/static /app/frontend/.next/static
COPY --from=frontend-builder ./public /app/frontend/public

# Copy built backend
COPY --from=backend-builder ./api/dist /app/backend/dist
COPY --from=backend-builder ./api/prisma /app/backend/prisma
COPY --from=backend-builder ./node_modules /app/backend/node_modules
COPY --from=backend-builder ./api/package.backend.json /app/backend/package.json

# Create database directory and ensure proper permissions
RUN mkdir -p /app/backend/data && \
    chown -R node:node /app/backend

# Copy startup scripts
COPY docker-compose.yml /app/
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:/app/backend/data/dev.db"

# Expose ports
EXPOSE 3000 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Start both services
WORKDIR /app
ENTRYPOINT ["/app/docker-entrypoint.sh"]