# Aether Identity GitHub App Makefile
# Build automation and development commands

.PHONY: help dev build test clean docker docker-build docker-run docker-stop lint fmt vet

# Default target
.DEFAULT_GOAL := help

# Variables
APP_NAME := github-app
PORT := 3000
GO := go
DOCKER := docker
DOCKER_COMPOSE := docker-compose

# Colors for output
BLUE := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
RESET := \033[0m

## 🚀 Help
help: ## Show all available commands
	@echo "$(BLUE)🐙 Aether Identity GitHub App$(RESET)"
	@echo ""
	@echo "$(GREEN)🚀 Development:$(RESET)"
	@echo "  $(YELLOW)make dev$(RESET)              Run in development mode"
	@echo "  $(YELLOW)make build$(RESET)            Build binary"
	@echo "  $(YELLOW)make test$(RESET)             Run tests"
	@echo "  $(YELLOW)make clean$(RESET)            Clean build artifacts"
	@echo ""
	@echo "$(GREEN)🐳 Docker:$(RESET)"
	@echo "  $(YELLOW)make docker-build$(RESET)     Build Docker image"
	@echo "  $(YELLOW)make docker-run$(RESET)       Run with Docker Compose"
	@echo "  $(YELLOW)make docker-stop$(RESET)      Stop Docker services"
	@echo "  $(YELLOW)make docker-logs$(RESET)      View Docker logs"
	@echo ""
	@echo "$(GREEN)🔧 Code Quality:$(RESET)"
	@echo "  $(YELLOW)make lint$(RESET)             Run linter"
	@echo "  $(YELLOW)make fmt$(RESET)              Format Go code"
	@echo "  $(YELLOW)make vet$(RESET)              Run go vet"
	@echo ""
	@echo "$(GREEN)🛠️ Utilities:$(RESET)"
	@echo "  $(YELLOW)make deps$(RESET)             Download dependencies"
	@echo "  $(YELLOW)make health$(RESET)           Check service health"

## 🚀 Development
dev: ## Run in development mode
	@echo "$(BLUE)🚀 Starting GitHub App in development mode...$(RESET)"
	$(GO) run main.go

build: ## Build binary
	@echo "$(BLUE)🏗️ Building binary...$(RESET)"
	$(GO) build -o bin/$(APP_NAME) main.go
	@echo "$(GREEN)✅ Binary built: bin/$(APP_NAME)$(RESET)"

test: ## Run tests
	@echo "$(BLUE)🧪 Running tests...$(RESET)"
	$(GO) test -v ./...

test-coverage: ## Run tests with coverage
	@echo "$(BLUE)🧪 Running tests with coverage...$(RESET)"
	$(GO) test -cover -coverprofile=coverage.out ./...
	$(GO) tool cover -html=coverage.out -o coverage.html
	@echo "$(GREEN)✅ Coverage report generated: coverage.html$(RESET)"

clean: ## Clean build artifacts
	@echo "$(BLUE)🧹 Cleaning build artifacts...$(RESET)"
	rm -rf bin/
	rm -f coverage.out coverage.html
	@echo "$(GREEN)✅ Cleaned$(RESET)"

deps: ## Download dependencies
	@echo "$(BLUE)📦 Downloading dependencies...$(RESET)"
	$(GO) mod download
	@echo "$(GREEN)✅ Dependencies downloaded$(RESET)"

## 🐳 Docker
docker-build: ## Build Docker image
	@echo "$(BLUE)🐳 Building Docker image...$(RESET)"
	$(DOCKER) build -t aether-identity/$(APP_NAME):latest .
	@echo "$(GREEN)✅ Docker image built$(RESET)"

docker-run: ## Run with Docker Compose
	@echo "$(BLUE)🐳 Starting Docker containers...$(RESET)"
	$(DOCKER_COMPOSE) up -d
	@echo "$(GREEN)✅ Containers started$(RESET)"
	@echo "$(YELLOW)Health check: http://localhost:$(PORT)/health$(RESET)"

docker-stop: ## Stop Docker services
	@echo "$(BLUE)🛑 Stopping Docker containers...$(RESET)"
	$(DOCKER_COMPOSE) down
	@echo "$(GREEN)✅ Containers stopped$(RESET)"

docker-logs: ## View Docker logs
	@echo "$(BLUE)📝 Viewing Docker logs...$(RESET)"
	$(DOCKER_COMPOSE) logs -f $(APP_NAME)

docker-restart: ## Restart Docker services
	@echo "$(BLUE)🔄 Restarting Docker containers...$(RESET)"
	$(DOCKER_COMPOSE) restart
	@echo "$(GREEN)✅ Containers restarted$(RESET)"

## 🔧 Code Quality
lint: ## Run linter
	@echo "$(BLUE)🔍 Running linter...$(RESET)"
	@if command -v golangci-lint >/dev/null 2>&1; then \
		golangci-lint run; \
	else \
		echo "$(YELLOW)⚠️ golangci-lint not installed. Install with: go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest$(RESET)"; \
		exit 1; \
	fi

fmt: ## Format Go code
	@echo "$(BLUE)💅 Formatting Go code...$(RESET)"
	$(GO) fmt ./...
	@echo "$(GREEN)✅ Code formatted$(RESET)"

vet: ## Run go vet
	@echo "$(BLUE)🔍 Running go vet...$(RESET)"
	$(GO) vet ./...
	@echo "$(GREEN)✅ Vet complete$(RESET)"

## 🛠️ Utilities
health: ## Check service health
	@echo "$(BLUE)🏥 Checking service health...$(RESET)"
	@if curl -s http://localhost:$(PORT)/health > /dev/null 2>&1; then \
		echo "$(GREEN)✅ Service is healthy$(RESET)"; \
		curl -s http://localhost:$(PORT)/health | $(GO) run -mod=mod -exec "cat" 2>/dev/null || cat; \
	else \
		echo "$(RED)❌ Service is not responding$(RESET)"; \
		exit 1; \
	fi

env-example: ## Create .env.example file
	@echo "$(BLUE)📝 Creating .env.example...$(RESET)"
	@echo "# GitHub App Configuration" > .env.example
	@echo "GITHUB_APP_ID=your_app_id_here" >> .env.example
	@echo "GITHUB_APP_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----\\n...\\n-----END RSA PRIVATE KEY-----" >> .env.example
	@echo "GITHUB_APP_WEBHOOK_SECRET=your_webhook_secret_here" >> .env.example
	@echo "GITHUB_CLIENT_ID=your_client_id_here" >> .env.example
	@echo "GITHUB_CLIENT_SECRET=your_client_secret_here" >> .env.example
	@echo "" >> .env.example
	@echo "# Aether Identity API Configuration" >> .env.example
	@echo "IDENTITY_API_URL=http://localhost:8080" >> .env.example
	@echo "IDENTITY_API_KEY=your_api_key_here" >> .env.example
	@echo "$(GREEN)✅ .env.example created$(RESET)"

install: ## Install binary to GOPATH/bin
	@echo "$(BLUE)📦 Installing binary...$(RESET)"
	$(GO) install .
	@echo "$(GREEN)✅ Binary installed$(RESET)"

# CI/CD helpers
ci: ## Run CI pipeline locally
	@echo "$(BLUE)🔄 Running CI pipeline...$(RESET)"
	$(MAKE) fmt
	$(MAKE) vet
	$(MAKE) test
	$(MAKE) build
	@echo "$(GREEN)✅ CI pipeline complete$(RESET)"
