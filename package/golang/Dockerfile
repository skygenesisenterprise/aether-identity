# Aether Identity Go SDK - Development Dockerfile
# Used for development, testing, and building the SDK

# Build stage
FROM golang:1.21-alpine AS builder

# Install build dependencies
RUN apk add --no-cache git ca-certificates tzdata make

# Set working directory
WORKDIR /sdk

# Copy go mod files first for better layer caching
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build and test the SDK
RUN go build ./... && \
    go test ./...

# Development stage with full toolchain
FROM golang:1.21-alpine AS development

# Install development dependencies
RUN apk add --no-cache \
    git \
    ca-certificates \
    tzdata \
    make \
    curl \
    bash

# Install Go tools
RUN go install golang.org/x/lint/golint@latest && \
    go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest

# Set working directory
WORKDIR /sdk

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Set environment variables
ENV GO111MODULE=on
ENV CGO_ENABLED=0

# Default command for development
CMD ["make", "dev"]

# Production-ready stage (for SDK distribution)
FROM alpine:latest AS production

# Install runtime dependencies
RUN apk --no-cache add ca-certificates tzdata

# Create non-root user
RUN addgroup -g 1001 -S sdkgroup && \
    adduser -u 1001 -S sdkuser -G sdkgroup

# Set working directory
WORKDIR /sdk

# Copy built artifacts from builder
COPY --from=builder /sdk/go.mod ./
COPY --from=builder /sdk/go.sum ./
COPY --from=builder /sdk/*.go ./
COPY --from=builder /sdk/auth/ ./auth/
COPY --from=builder /sdk/device/ ./device/
COPY --from=builder /sdk/eid/ ./eid/
COPY --from=builder /sdk/errors/ ./errors/
COPY --from=builder /sdk/http/ ./http/
COPY --from=builder /sdk/machine/ ./machine/
COPY --from=builder /sdk/session/ ./session/
COPY --from=builder /sdk/sessionmodule/ ./sessionmodule/
COPY --from=builder /sdk/storage/ ./storage/
COPY --from=builder /sdk/token/ ./token/
COPY --from=builder /sdk/types/ ./types/
COPY --from=builder /sdk/user/ ./user/

# Change ownership to non-root user
RUN chown -R sdkuser:sdkgroup /sdk

# Switch to non-root user
USER sdkuser

# Health check (verify SDK is intact)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD test -f go.mod && test -f client.go || exit 1

# Default command
CMD ["echo", "Aether Identity Go SDK - Library Package"]
