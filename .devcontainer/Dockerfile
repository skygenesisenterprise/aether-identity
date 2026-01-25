FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Install Go for backend development
RUN apk add --no-cache git go

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY --from=base /app/package.json ./

# Install dependencies with pnpm cache
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Expose ports
EXPOSE 3000 8080

# Default command
CMD ["pnpm", "dev"]