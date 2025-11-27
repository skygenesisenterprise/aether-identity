# Multi-stage build for frontend and backend
FROM node:20-alpine AS base

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

# Backend build stage  
FROM base AS backend-builder
COPY . .
RUN pnpm run build:api

# Production stage with both services
FROM node:20-alpine AS production

# Install pnpm
RUN npm install -g pnpm

# Install additional dependencies for Prisma
RUN apk add --no-cache sqlite

# Create app directories
WORKDIR /app
RUN mkdir -p /app/frontend /app/backend

# Copy built frontend
COPY --from=frontend-builder /app/.next /app/frontend/.next
COPY --from=frontend-builder /app/public /app/frontend/public
COPY --from=frontend-builder /app/node_modules /app/frontend/node_modules
COPY --from=frontend-builder /app/package.json /app/frontend/package.json
COPY --from=frontend-builder /app/next.config.ts /app/frontend/next.config.ts

# Copy built backend
COPY --from=backend-builder /app/api/dist /app/backend/dist
COPY --from=backend-builder /app/api/prisma /app/backend/prisma
COPY --from=backend-builder /app/node_modules /app/backend/node_modules
COPY --from=backend-builder /app/package.json /app/backend/package.json

# Create database directory
RUN mkdir -p /app/backend/data

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
ENTRYPOINT ["/app/docker-entrypoint.sh"]