# Aether Vault - Comprehensive Makefile
# Enterprise-Grade Secrets Management Platform

.PHONY: help install clean reset dev build start test lint format typecheck
.PHONY: quick-start status health docker db db-migrate db-studio db-seed
.PHONY: go-server go-build go-test go-clean go-install-deps go-secrets
.PHONY: packages packages-dev packages-build packages-test
.PHONY: github-app golang-sdk nodejs-sdk python-sdk

# Default target
.DEFAULT_GOAL := help

# Variables
PNPM := pnpm
NODE_VERSION := 18.0.0
GO_VERSION := 1.21
PORT_FRONTEND := 3000
PORT_BACKEND := 8080

# Colors for output
BLUE := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
RESET := \033[0m

## 🚀 Quick Start & Development
help: ## Show all available commands
	@echo "$(BLUE)🔐 Aether Vault - Enterprise Secrets Management$(RESET)"
	@echo ""
	@echo "$(GREEN)🚀 Quick Start:$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / && /Quick Start/ {printf "  $(YELLOW)%-20s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(GREEN)🔧 Development:$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / && /Development/ {printf "  $(YELLOW)%-20s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(GREEN)🏗️ Build & Production:$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / && /Build/ {printf "  $(YELLOW)%-20s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(GREEN)📦 Package Ecosystem:$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / && /Package/ {printf "  $(YELLOW)%-20s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(GREEN)🗄️ Database:$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / && /Database/ {printf "  $(YELLOW)%-20s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(GREEN)🐹 Go Backend:$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / && /Go/ {printf "  $(YELLOW)%-20s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(GREEN)🐳 Docker & Deployment:$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / && /Docker/ {printf "  $(YELLOW)%-20s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(GREEN)🔧 Code Quality:$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / && /Code/ {printf "  $(YELLOW)%-20s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(GREEN)🛠️ Utilities:$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / && /Utilities/ {printf "  $(YELLOW)%-20s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

quick-start: ## Quick Start - Install, migrate, and start dev servers
	@echo "$(BLUE)🚀 Quick Start - Aether Vault$(RESET)"
	@echo "$(YELLOW)Installing dependencies...$(RESET)"
	@$(MAKE) install
	@echo "$(YELLOW)Setting up environment...$(RESET)"
	@$(MAKE) env-dev
	@echo "$(YELLOW)Running database migrations...$(RESET)"
	@$(MAKE) db-migrate
	@echo "$(YELLOW)Starting development servers...$(RESET)"
	@$(MAKE) dev

## 🏗️ Development Commands
dev: ## Development - Start all services (frontend + backend)
	@echo "$(BLUE)🔧 Starting all development services...$(RESET)"
	@$(PNPM) dev

dev-frontend: ## Development - Start frontend only (port 3000)
	@echo "$(BLUE)🎨 Starting frontend development server...$(RESET)"
	@$(PNPM) dev:frontend

dev-backend: ## Development - Start backend only (port 8080)
	@echo "$(BLUE)⚙️ Starting backend development server...$(RESET)"
	@$(PNPM) dev:backend

dev-github: ## Development - Start GitHub App development
	@echo "$(BLUE)🚀 Starting GitHub App development server...$(RESET)"
	@cd package/github && $(PNPM) dev

## 🔧 Installation & Setup
install: ## Install - Install all dependencies
	@echo "$(BLUE)📦 Installing all dependencies...$(RESET)"
	@$(PNPM) install

env-dev: ## Environment - Setup development environment
	@echo "$(BLUE)🔧 Setting up development environment...$(RESET)"
	@if [ ! -f .env.local ]; then cp .env.example .env.local; echo "$(GREEN)✅ Created .env.local$(RESET)"; fi

reset: ## Reset - Clean and reinstall everything
	@echo "$(BLUE)🔄 Resetting project...$(RESET)"
	@$(MAKE) clean
	@$(MAKE) install

## 🏗️ Build & Production
build: ## Build - Build all packages
	@echo "$(BLUE)🏗️ Building all packages...$(RESET)"
	@$(PNPM) build

build-frontend: ## Build - Build frontend only
	@echo "$(BLUE)🎨 Building frontend...$(RESET)"
	@$(PNPM) build:frontend

build-backend: ## Build - Build backend only
	@echo "$(BLUE)⚙️ Building backend...$(RESET)"
	@$(PNPM) build:backend

build-cli: ## Build - Build CLI only
	@echo "$(BLUE)🛠️ Building CLI...$(RESET)"
	@$(PNPM) build:cli

start: ## Start - Start production servers
	@echo "$(BLUE)🚀 Starting production servers...$(RESET)"
	@$(PNPM) start

## 📦 Package Ecosystem
packages: ## Package - Build all packages
	@echo "$(BLUE)📦 Building all packages...$(RESET)"
	@cd package/github && $(PNPM) build
	@cd package/golang && go build
	@cd package/node && $(PNPM) build
	@cd package/python && python -m build

packages-dev: ## Package - Start all packages in development mode
	@echo "$(BLUE)📦 Starting all packages in development...$(RESET)"
	@concurrently "cd package/github && pnpm dev" "cd package/golang && go run main.go" "cd package/node && pnpm dev"

packages-test: ## Package - Test all packages
	@echo "$(BLUE)📧 Testing all packages...$(RESET)"
	@cd package/github && $(PNPM) test
	@cd package/golang && go test
	@cd package/node && $(PNPM) test
	@cd package/python && python -m pytest

github-app: ## Package - Start GitHub App development
	@echo "$(BLUE)🚀 Starting GitHub App...$(RESET)"
	@cd package/github && $(PNPM) dev

golang-sdk: ## Package - Build Go SDK
	@echo "$(BLUE)🐹 Building Go SDK...$(RESET)"
	@cd package/golang && go build

nodejs-sdk: ## Package - Build Node.js SDK
	@echo "$(BLUE)📦 Building Node.js SDK...$(RESET)"
	@cd package/node && $(PNPM) build

python-sdk: ## Package - Build Python SDK
	@echo "$(BLUE)🐍 Building Python SDK...$(RESET)"
	@cd package/python && python -m build

## 🗄️ Database Commands
db-migrate: ## Database - Run migrations
	@echo "$(BLUE)🗄️ Running database migrations...$(RESET)"
	@$(PNPM) db:migrate

db-studio: ## Database - Open database studio
	@echo "$(BLUE)🔍 Opening Prisma Studio...$(RESET)"
	@$(PNPM) db:studio

db-seed: ## Database - Seed development data
	@echo "$(BLUE)🌱 Seeding development data...$(RESET)"
	@$(PNPM) db:seed

db-generate: ## Database - Generate Prisma client
	@echo "$(BLUE)⚙️ Generating Prisma client...$(RESET)"
	@$(PNPM) db:generate

## 🐹 Go Backend Commands
go-server: ## Go - Start Go server directly
	@echo "$(BLUE)🐹 Starting Go server...$(RESET)"
	@cd server && go run main.go

go-build: ## Go - Build Go binary
	@echo "$(BLUE)🐹 Building Go binary...$(RESET)"
	@cd server && go build -o bin/server main.go

go-test: ## Go - Run Go tests
	@echo "$(BLUE)🧪 Running Go tests...$(RESET)"
	@cd server && go test ./...

go-clean: ## Go - Clean Go build artifacts
	@echo "$(BLUE)🧹 Cleaning Go artifacts...$(RESET)"
	@cd server && rm -rf bin/

go-install-deps: ## Go - Install Go dependencies
	@echo "$(BLUE)📦 Installing Go dependencies...$(RESET)"
	@cd server && go mod download

go-secrets: ## Go - Generate JWT and encryption secrets for .env.example
	@echo "$(BLUE)🔐 Generating new secrets for server/.env.example...$(RESET)"
	@echo "$(YELLOW)Generating JWT secret...$(RESET)"
	@JWT_SECRET=$$(openssl rand -base64 32 | tr -d '\n'); \
	ENCRYPTION_KEY=$$(openssl rand -base64 24 | tr -d '\n'); \
	sed -i.tmp "s/VAULT_JWT_SECRET=.*/VAULT_JWT_SECRET=$$JWT_SECRET/" server/.env.example; \
	sed -i.tmp "s/VAULT_SECURITY_ENCRYPTION_KEY=.*/VAULT_SECURITY_ENCRYPTION_KEY=$$ENCRYPTION_KEY/" server/.env.example; \
	rm -f server/.env.example.tmp
	@echo "$(GREEN)✅ Secrets generated and updated in server/.env.example$(RESET)"
	@echo "$(YELLOW)JWT Secret: $$(grep VAULT_JWT_SECRET server/.env.example | cut -d'=' -f2)$(RESET)"
	@echo "$(YELLOW)Encryption Key: $$(grep VAULT_SECURITY_ENCRYPTION_KEY server/.env.example | cut -d'=' -f2)$(RESET)"

## 🐳 Docker Commands
docker-build: ## Docker - Build Docker image
	@echo "$(BLUE)🐳 Building Docker image...$(RESET)"
	@$(PNPM) docker:build

docker-run: ## Docker - Run Docker containers
	@echo "$(BLUE)🐳 Starting Docker containers...$(RESET)"
	@$(PNPM) docker:run

docker-stop: ## Docker - Stop Docker containers
	@echo "$(BLUE)🛑 Stopping Docker containers...$(RESET)"
	@$(PNPM) docker:stop

docker-dev: ## Docker - Start development environment
	@echo "$(BLUE)🐳 Starting development Docker environment...$(RESET)"
	@docker-compose -f docker-compose.dev.yml up -d

docker-prod: ## Docker - Start production environment
	@echo "$(BLUE)🐳 Starting production Docker environment...$(RESET)"
	@docker-compose up -d

## 🔧 Code Quality
lint: ## Code - Lint all packages
	@echo "$(BLUE)🔍 Linting all packages...$(RESET)"
	@$(PNPM) lint

lint-fix: ## Code - Fix linting issues
	@echo "$(BLUE)🔧 Fixing linting issues...$(RESET)"
	@$(PNPM) lint:fix

typecheck: ## Code - Type check all packages
	@echo "$(BLUE)🔍 Type checking all packages...$(RESET)"
	@$(PNPM) typecheck

format: ## Code - Format code with Prettier
	@echo "$(BLUE)💅 Formatting code...$(RESET)"
	@$(PNPM) format

test: ## Code - Run all tests
	@echo "$(BLUE)🧪 Running all tests...$(RESET)"
	@$(PNPM) test

## 🛠️ Utilities
clean: ## Utilities - Clean build artifacts and dependencies
	@echo "$(BLUE)🧹 Cleaning project...$(RESET)"
	@$(PNPM) clean

clean-build: ## Utilities - Clean build directories
	@echo "$(BLUE)🧹 Cleaning build directories...$(RESET)"
	@$(PNPM) clean:build

clean-deps: ## Utilities - Clean node_modules
	@echo "$(BLUE)🧹 Cleaning dependencies...$(RESET)"
	@$(PNPM) clean:deps

status: ## Utilities - Show project status
	@echo "$(BLUE)📊 Project Status:$(RESET)"
	@echo "$(GREEN)Node.js version:$(RESET) $(shell node --version)"
	@echo "$(GREEN)pnpm version:$(RESET) $(shell pnpm --version)"
	@echo "$(GREEN)Go version:$(RESET) $(shell go version)"
	@echo "$(GREEN)Git branch:$(RESET) $(shell git branch --show-current)"
	@echo "$(GREEN)Git status:$(RESET) $(shell git status --porcelain | wc -l) modified files"

health: ## Utilities - Check service health
	@echo "$(BLUE)🏥 Checking service health...$(RESET)"
	@if curl -s http://localhost:$(PORT_BACKEND)/health > /dev/null; then echo "$(GREEN)✅ Backend is healthy$(RESET)"; else echo "$(RED)❌ Backend is down$(RESET)"; fi
	@if curl -s http://localhost:$(PORT_FRONTEND) > /dev/null; then echo "$(GREEN)✅ Frontend is running$(RESET)"; else echo "$(RED)❌ Frontend is down$(RESET)"; fi

cli: ## Utilities - Run CLI
	@echo "$(BLUE)🛠️ Running Aether Vault CLI...$(RESET)"
	@$(PNPM) cli

logs: ## Utilities - Show development logs
	@echo "$(BLUE)📝 Showing development logs...$(RESET)"
	@docker-compose logs -f

update: ## Utilities - Update all dependencies
	@echo "$(BLUE)⬆️ Updating dependencies...$(RESET)"
	@$(PNPM) update:all

install-deps: ## Utilities - Install all dependencies
	@echo "$(BLUE)📦 Installing all dependencies...$(RESET)"
	@$(PNPM) install:all

## 🚀 Release & Publishing
release: ## Release - Build and publish packages
	@echo "$(BLUE)🚀 Building and releasing packages...$(RESET)"
	@$(PNPM) release

version-packages: ## Release - Version packages
	@echo "$(BLUE)📋 Versioning packages...$(RESET)"
	@$(PNPM) version-packages

changeset: ## Release - Create changeset
	@echo "$(BLUE)📝 Creating changeset...$(RESET)"
	@$(PNPM) changeset

## 📊 Monitoring
monitoring: ## Monitoring - Start monitoring stack
	@echo "$(BLUE)📊 Starting monitoring stack...$(RESET)"
	@cd monitoring && docker-compose up -d

monitoring-stop: ## Monitoring - Stop monitoring stack
	@echo "$(BLUE)🛑 Stopping monitoring stack...$(RESET)"
	@cd monitoring && docker-compose down

## 🔐 Security
security-scan: ## Security - Run security scan
	@echo "$(BLUE)🔒 Running security scan...$(RESET)"
	@npm audit
	@cd server && go mod audit

## 📚 Documentation
docs-serve: ## Documentation - Serve documentation locally
	@echo "$(BLUE)📚 Serving documentation...$(RESET)"
	@cd docs && $(PNPM) dev

## 🌐 CI/CD
ci: ## CI - Run CI pipeline locally
	@echo "$(BLUE)🔄 Running CI pipeline...$(RESET)"
	@$(MAKE) lint
	@$(MAKE) typecheck
	@$(MAKE) test
	@$(MAKE) build