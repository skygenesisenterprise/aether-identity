# ══════════════════════════════════════════════════════════════════════════════
# Aether Identity — unified image (dev + production)
# A single image that supports every role. The entrypoint.sh switches behaviour
# based on NODE_ENV (development: Next.js dev + Air hot-reload; production:
# static frontend via http-server + compiled Go binary).
# ══════════════════════════════════════════════════════════════════════════════

# ══════════════════════════════════════════════════════════════════════════════
# Stage 1 — Go builder (API/worker binary + Air for hot-reload)
# ══════════════════════════════════════════════════════════════════════════════
FROM golang:1.26-alpine AS go-builder

RUN apk add --no-cache gcc musl-dev

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

RUN go install github.com/air-verse/air@latest

COPY server/ ./server/

RUN CGO_ENABLED=1 GOOS=linux \
    go build -ldflags="-s -w" -o /app/tmp/aether-server ./server/

# ══════════════════════════════════════════════════════════════════════════════
# Stage 2 — Node / pnpm (frontend deps + optional static export)
# ══════════════════════════════════════════════════════════════════════════════
FROM node:25-alpine AS node-builder

ARG NODE_ENV=production
ARG BUILD_STATIC

WORKDIR /app

RUN npm install -g corepack --force \
    && corepack enable \
    && corepack prepare pnpm@9.15.4 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/package.json ./apps/

RUN mkdir -p apps/next/fond/google && \
    printf 'module.exports = {};\n' > apps/next/fond/google/index.js && \
    printf '{"name":"google","version":"0.0.0"}\n' > apps/next/fond/google/package.json && \
    pnpm install --filter @aether-identity/apps... --no-frozen-lockfile

COPY apps/ ./apps/

RUN     if [ "${BUILD_STATIC:-0}" = "1" ] || { [ -z "${BUILD_STATIC:-}" ] && [ "${NODE_ENV}" = "production" ]; }; then \
        BUILD_WEB_STATIC=true pnpm --dir apps build:web; \
    else \
        echo "Skipping static web export (BUILD_STATIC != 1)"; \
    fi

# Ensure /app/apps/out always exists (dev builds skip the static export)
RUN mkdir -p /app/apps/out

# ══════════════════════════════════════════════════════════════════════════════
# Stage 3 — Prisma client generation
# ══════════════════════════════════════════════════════════════════════════════
FROM node:25-alpine AS prisma-builder

ARG DATABASE_URL

WORKDIR /tmp/prisma

COPY server/prisma/package.json ./
RUN npm install --no-audit --no-fund

COPY server/prisma/schema.prisma server/prisma/prisma.config.ts ./

RUN if [ -n "${DATABASE_URL:-}" ]; then \
        DATABASE_URL="${DATABASE_URL}" npx prisma generate; \
    else \
        echo "DATABASE_URL not provided; skipping Prisma client generation"; \
    fi

# ══════════════════════════════════════════════════════════════════════════════
# Stage final — unified runtime (development superset + production runtime)
# ══════════════════════════════════════════════════════════════════════════════
FROM node:25-alpine

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN apk add --no-cache \
    ca-certificates \
    tzdata \
    curl \
    bash \
    git \
    wget \
    build-base \
    libc6-compat \
    postgresql \
    postgresql-client \
    openssl \
    npm \
    gosu \
    coreutils \
    inotify-tools \
    netcat-openbsd

ENV GOPATH="/go"
ENV PATH="/usr/local/go/bin:/go/bin:/root/go/bin:/root/.local/share/corepack:/usr/local/bin:/usr/bin:/bin:${PATH}"
ENV SCHEMA_PATH=/app/server/prisma/schema.prisma
ENV PRISMA_DIR=/app/server/prisma
ENV DEPLOY_SCRIPT=/usr/local/bin/deploy-schema.sh

RUN npm install -g corepack --force && corepack enable && corepack prepare pnpm@9.15.4 --activate && \
    ln -sf /root/.local/share/corepack/pnpm /usr/local/bin/pnpm

RUN npm install -g http-server@14

WORKDIR /app

RUN mkdir -p /certs /templates

# ── Go toolchain + Air (dev hot-reload) ─────────────────────────────────────
COPY --from=go-builder /go/bin/air /go/bin/air
COPY --from=go-builder /usr/local/go /usr/local/go
COPY --from=go-builder /app/server/ ./server/
COPY --from=go-builder /app/tmp/aether-server /app/tmp/aether-server
COPY --from=go-builder /app/tmp/aether-server /app/server/aether-server

# ── Frontend (node_modules for dev + static export for prod) ────────────────
COPY --from=node-builder /app/node_modules ./node_modules/
COPY --from=node-builder /app/apps/node_modules ./apps/node_modules/
COPY --from=node-builder /app/apps/out ./out

# ── Prisma ──────────────────────────────────────────────────────────────────
COPY --from=prisma-builder /tmp/prisma/ ./prisma/
COPY server/prisma/ ./server/prisma/
RUN cd server/prisma && npm install --no-audit --no-fund

# ── Frontend sources (écrasées par le volume mount en dev) ──────────────────
COPY apps/package.json         ./apps/
COPY apps/tsconfig.json        ./apps/
COPY apps/next.config.ts       ./apps/
COPY apps/postcss.config.mjs   ./apps/
COPY apps/components.json      ./apps/
COPY apps/eslint.config.mjs    ./apps/
COPY apps/app/                 ./apps/app/
COPY apps/components/          ./apps/components/
COPY apps/context/             ./apps/context/
COPY apps/hooks/               ./apps/hooks/
COPY apps/lib/                 ./apps/lib/
COPY apps/public/              ./apps/public/
COPY apps/styles/              ./apps/styles/
COPY middleware.ts             ./apps/middleware.ts

# ── Config ──────────────────────────────────────────────────────────────────
COPY .air.toml   ./
COPY .env.example ./
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000
EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]
