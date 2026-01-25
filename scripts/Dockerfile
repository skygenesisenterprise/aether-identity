# Use Node.js 18 Alpine as base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./
COPY app/package.json ./app/
COPY tools/package.json ./tools/
COPY options/package.json ./options/
COPY package/node/package.json ./package/node/
COPY package/github/package.json ./package/github/
COPY package/vscode/package.json ./package/vscode/
COPY snap/package.json ./snap/
COPY tests/package.json ./tests/
COPY messages/package.json ./messages/
COPY prisma/package.json ./prisma/
COPY monitoring/package.json ./monitoring/

# Install pnpm
RUN corepack enable pnpm && pnpm --version

# Install dependencies
RUN pnpm install --frozen-lockfile --prefer-frozen-lockfile

# Generate Prisma client
FROM base AS prisma
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma/
COPY package.json ./
RUN npx prisma generate

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=prisma /app/node_modules ./node_modules
COPY --from=prisma /app/prisma ./prisma

# Copy all workspace packages
COPY app ./app/
COPY tools ./tools/
COPY options ./options/
COPY package/node ./package/node/
COPY package/github ./package/github/
COPY package/vscode ./package/vscode/
COPY snap ./snap/
COPY tests ./tests/
COPY messages ./messages/
COPY monitoring ./monitoring/
COPY prisma ./prisma/

# Copy configuration files
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY next.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY eslint.config.mjs ./

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build all workspaces
RUN pnpm -r build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built applications
COPY --from=builder --chown=nextjs:nodejs /app/app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/app/public ./public

# Copy built tools if they exist
RUN mkdir -p /app/tools /app/cli
COPY --from=builder --chown=nextjs:nodejs /app/tools/dist ./tools/dist/ || true
COPY --from=builder --chown=nextjs:nodejs /app/cli/dist ./cli/dist/ || true

# Copy Prisma schema and generated client
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma/
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma/
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma/

# Copy package.json for runtime dependencies
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/app/package.json ./app/package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]