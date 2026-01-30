# Aether Identity Go SDK - Makefile
# Development and build automation for the Go SDK

.PHONY: help install dev build test lint format clean docker docker-build docker-test
.PHONY: verify coverage bench security doc

# Default target
.DEFAULT_GOAL := help

# Variables
GO := go
GO_VERSION := 1.21
MODULE_PATH := github.com/skygenesisenterprise/aether-identity
DOCKER_IMAGE := aether-identity-golang-sdk
DOCKER_TAG := latest

# Colors for output
BLUE := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
RESET := \033[0m

## 🚀 Quick Start & Development
help: ## Show all available commands
	@echo "$(BLUE)🔐 Aether Identity Go SDK$(RESET)"
	@echo ""
	@echo "$(GREEN)🚀 Quick Start:$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / && /Quick Start/ {printf "  $(YELLOW)%-20s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(GREEN)🔧 Development:$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / && /Development/ {printf "  $(YELLOW)%-20s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(GREEN)🏗️ Build & Test:$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / && /Build/ {printf "  $(YELLOW)%-20s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(GREEN)🐳 Docker:$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / && /Docker/ {printf "  $(YELLOW)%-20s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(GREEN)🔧 Code Quality:$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / && /Code/ {printf "  $(YELLOW)%-20s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(GREEN)🛠️ Utilities:$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / && /Utilities/ {printf "  $(YELLOW)%-20s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

quick-start: ## Quick Start - Install dependencies and verify SDK
	@echo "$(BLUE)🚀 Quick Start - Aether Identity Go SDK$(RESET)"
	@echo "$(YELLOW)Installing dependencies...$(RESET)"
	@$(MAKE) install
	@echo "$(YELLOW)Verifying SDK...$(RESET)"
	@$(MAKE) verify
	@echo "$(YELLOW)Running tests...$(RESET)"
	@$(MAKE) test
	@echo "$(GREEN)✅ SDK is ready for development!$(RESET)"

## 🔧 Development Commands
dev: ## Development - Start development mode (watch for changes)
	@echo "$(BLUE)🔧 Starting Go SDK development mode...$(RESET)"
	@echo "$(YELLOW)Installing dependencies...$(RESET)"
	@$(GO) mod download
	@echo "$(YELLOW)Running initial build...$(RESET)"
	@$(GO) build ./...
	@echo "$(GREEN)✅ SDK development environment ready$(RESET)"
	@echo "$(YELLOW)Use 'make test' to run tests, 'make build' to build$(RESET)"

install: ## Install - Install Go dependencies
	@echo "$(BLUE)📦 Installing Go dependencies...$(RESET)"
	@$(GO) mod download
	@$(GO) mod verify
	@echo "$(GREEN)✅ Dependencies installed$(RESET)"

deps: ## Dependencies - Update and tidy Go modules
	@echo "$(BLUE)📦 Updating Go dependencies...$(RESET)"
	@$(GO) get -u ./...
	@$(GO) mod tidy
	@echo "$(GREEN)✅ Dependencies updated$(RESET)"

verify: ## Verify - Verify SDK compiles correctly
	@echo "$(BLUE)🔍 Verifying SDK...$(RESET)"
	@$(GO) build ./...
	@echo "$(GREEN)✅ SDK verification passed$(RESET)"

## 🏗️ Build & Test Commands
build: ## Build - Build the SDK
	@echo "$(BLUE)🏗️ Building Go SDK...$(RESET)"
	@$(GO) build ./...
	@echo "$(GREEN)✅ Build successful$(RESET)"

test: ## Test - Run all tests
	@echo "$(BLUE)🧪 Running tests...$(RESET)"
	@$(GO) test -v ./...
	@echo "$(GREEN)✅ Tests completed$(RESET)"

test-short: ## Test - Run short tests only
	@echo "$(BLUE)🧪 Running short tests...$(RESET)"
	@$(GO) test -short ./...
	@echo "$(GREEN)✅ Short tests completed$(RESET)"

test-race: ## Test - Run tests with race detector
	@echo "$(BLUE)🧪 Running tests with race detector...$(RESET)"
	@$(GO) test -race ./...
	@echo "$(GREEN)✅ Race detection tests completed$(RESET)"

test-integration: ## Test - Run integration tests (requires server)
	@echo "$(BLUE)🧪 Running integration tests...$(RESET)"
	@IDENTITY_ENDPOINT=${IDENTITY_ENDPOINT:-http://localhost:8080} \
	 IDENTITY_CLIENT_ID=${IDENTITY_CLIENT_ID:-test-client} \
	 $(GO) test -v -tags=integration ./...
	@echo "$(GREEN)✅ Integration tests completed$(RESET)"

coverage: ## Test - Run tests with coverage report
	@echo "$(BLUE)📊 Running tests with coverage...$(RESET)"
	@$(GO) test -cover ./...
	@$(GO) test -coverprofile=coverage.out ./...
	@$(GO) tool cover -html=coverage.out -o coverage.html
	@echo "$(GREEN)✅ Coverage report generated: coverage.html$(RESET)"

bench: ## Test - Run benchmarks
	@echo "$(BLUE)⚡ Running benchmarks...$(RESET)"
	@$(GO) test -bench=. -benchmem ./...
	@echo "$(GREEN)✅ Benchmarks completed$(RESET)"

## 🔧 Code Quality Commands
lint: ## Code - Run linter
	@echo "$(BLUE)🔍 Running linter...$(RESET)"
	@if command -v golangci-lint >/dev/null 2>&1; then \
		golangci-lint run ./...; \
	else \
		echo "$(YELLOW)golangci-lint not installed, using go vet$(RESET)"; \
		$(GO) vet ./...; \
	fi
	@echo "$(GREEN)✅ Linting completed$(RESET)"

lint-fix: ## Code - Fix linting issues (if supported)
	@echo "$(BLUE)🔧 Fixing linting issues...$(RESET)"
	@if command -v golangci-lint >/dev/null 2>&1; then \
		golangci-lint run --fix ./...; \
	else \
		echo "$(YELLOW)golangci-lint not installed, skipping auto-fix$(RESET)"; \
	fi
	@echo "$(GREEN)✅ Linting fixes applied$(RESET)"

format: ## Code - Format Go code
	@echo "$(BLUE)💅 Formatting code...$(RESET)"
	@$(GO) fmt ./...
	@echo "$(GREEN)✅ Code formatted$(RESET)"

vet: ## Code - Run go vet
	@echo "$(BLUE)🔍 Running go vet...$(RESET)"
	@$(GO) vet ./...
	@echo "$(GREEN)✅ Vet completed$(RESET)"

check: ## Code - Run all code quality checks
	@echo "$(BLUE)🔍 Running all code quality checks...$(RESET)"
	@$(MAKE) format
	@$(MAKE) vet
	@$(MAKE) lint
	@$(MAKE) test
	@echo "$(GREEN)✅ All checks passed$(RESET)"

## 🐳 Docker Commands
docker-build: ## Docker - Build Docker image
	@echo "$(BLUE)🐳 Building Docker image...$(RESET)"
	@docker build -t $(DOCKER_IMAGE):$(DOCKER_TAG) .
	@echo "$(GREEN)✅ Docker image built: $(DOCKER_IMAGE):$(DOCKER_TAG)$(RESET)"

docker-dev: ## Docker - Start development environment
	@echo "$(BLUE)🐳 Starting Docker development environment...$(RESET)"
	@docker-compose up -d golang-sdk-dev
	@echo "$(GREEN)✅ Development environment started$(RESET)"
	@echo "$(YELLOW)Attach to container: docker-compose exec golang-sdk-dev sh$(RESET)"

docker-test: ## Docker - Run tests in Docker
	@echo "$(BLUE)🐳 Running tests in Docker...$(RESET)"
	@docker-compose --profile test run --rm golang-sdk-test
	@echo "$(GREEN)✅ Docker tests completed$(RESET)"

docker-lint: ## Docker - Run linter in Docker
	@echo "$(BLUE)🐳 Running linter in Docker...$(RESET)"
	@docker-compose --profile lint run --rm golang-sdk-lint
	@echo "$(GREEN)✅ Docker linting completed$(RESET)"

docker-stop: ## Docker - Stop Docker containers
	@echo "$(BLUE)🛑 Stopping Docker containers...$(RESET)"
	@docker-compose down
	@echo "$(GREEN)✅ Docker containers stopped$(RESET)"

docker-clean: ## Docker - Clean Docker containers and images
	@echo "$(BLUE)🧹 Cleaning Docker resources...$(RESET)"
	@docker-compose down -v --rmi local
	@docker rmi $(DOCKER_IMAGE):$(DOCKER_TAG) 2>/dev/null || true
	@echo "$(GREEN)✅ Docker resources cleaned$(RESET)"

## 🔒 Security Commands
security: ## Security - Run security scan
	@echo "$(BLUE)🔒 Running security scan...$(RESET)"
	@if command -v gosec >/dev/null 2>&1; then \
		gosec ./...; \
	else \
		echo "$(YELLOW)gosec not installed, install with: go install github.com/securego/gosec/v2/cmd/gosec@latest$(RESET)"; \
	fi
	@$(GO) mod audit 2>/dev/null || echo "$(YELLOW)Go mod audit not available$(RESET)"
	@echo "$(GREEN)✅ Security scan completed$(RESET)"

## 📚 Documentation Commands
doc: ## Documentation - Generate documentation
	@echo "$(BLUE)📚 Generating documentation...$(RESET)"
	@if command -v godoc >/dev/null 2>&1; then \
		echo "$(YELLOW)Starting godoc server at http://localhost:6060$(RESET)"; \
		godoc -http=:6060; \
	else \
		echo "$(YELLOW)godoc not installed, install with: go install golang.org/x/tools/cmd/godoc@latest$(RESET)"; \
	fi

doc-readme: ## Documentation - Preview README
	@echo "$(BLUE)📖 README.md preview$(RESET)"
	@cat README.md | head -100

## 🛠️ Utility Commands
clean: ## Utilities - Clean build artifacts
	@echo "$(BLUE)🧹 Cleaning build artifacts...$(RESET)"
	@rm -f coverage.out coverage.html
	@rm -rf dist/
	@$(GO) clean ./...
	@echo "$(GREEN)✅ Clean completed$(RESET)"

status: ## Utilities - Show project status
	@echo "$(BLUE)📊 Go SDK Project Status:$(RESET)"
	@echo "$(GREEN)Go version:$(RESET) $(shell go version)"
	@echo "$(GREEN)Module:$(RESET) $(MODULE_PATH)"
	@echo "$(GREEN)Git branch:$(RESET) $(shell git branch --show-current 2>/dev/null || echo 'N/A')"
	@echo "$(GREEN)Git status:$(RESET) $(shell git status --porcelain 2>/dev/null | wc -l) modified files"
	@echo "$(GREEN)Packages:$(RESET)"
	@$(GO) list ./... | sed 's/^/  - /'

version: ## Utilities - Show version information
	@echo "$(BLUE)📋 Version Information:$(RESET)"
	@echo "$(GREEN)Go SDK Version:$(RESET) $(shell git describe --tags --always 2>/dev/null || echo 'dev')"
	@echo "$(GREEN)Go Version:$(RESET) $(shell go version)"
	@echo "$(GREEN)Module:$(RESET) $(MODULE_PATH)"

## 🚀 Release Commands
release-check: ## Release - Check if ready for release
	@echo "$(BLUE)🔍 Checking release readiness...$(RESET)"
	@$(MAKE) check
	@echo "$(GREEN)✅ SDK is ready for release$(RESET)"

mod-tidy: ## Release - Tidy and verify Go modules
	@echo "$(BLUE)📦 Tidying Go modules...$(RESET)"
	@$(GO) mod tidy
	@$(GO) mod verify
	@echo "$(GREEN)✅ Modules tidied$(RESET)"

# CI/CD Commands
ci: ## CI - Run CI pipeline locally
	@echo "$(BLUE)🔄 Running CI pipeline...$(RESET)"
	@$(MAKE) install
	@$(MAKE) check
	@$(MAKE) coverage
	@echo "$(GREEN)✅ CI pipeline completed$(RESET)"
