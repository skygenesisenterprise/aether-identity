# Dockerfile - Production and Development build stages

# ----------------------------
# Builder stage
# ----------------------------
FROM node:20-alpine AS builder

# Install system dependencies
RUN apk add --no-cache libc6-compat git bash curl

# Enable Corepack and pnpm
RUN corepack enable && corepack prepare pnpm@10.28.1 --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN pnpm install --force

# Copy app source
COPY . .

# Build the application for production
RUN pnpm build

# ----------------------------
# Development stage
# ----------------------------
FROM node:20-alpine AS dev

# Install system dependencies
RUN apk add --no-cache libc6-compat git bash curl

# Enable Corepack and pnpm
RUN corepack enable && corepack prepare pnpm@10.28.1 --activate

# Set working directory
WORKDIR /app

# Expose dev ports
EXPOSE 3000 24678

# Environment variables
ENV NODE_ENV=development
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV CHOKIDAR_USEPOLLING=true

# Copy package files and install dependencies
COPY package.json ./

# Copy built files from builder stage
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Install dependencies as root (avoids permission issues)
RUN pnpm install --force

# Copy app source
COPY . .

# Start dev server as root (for volume permissions)
CMD ["pnpm", "dev", "--hostname", "0.0.0.0", "--port", "3000"]
