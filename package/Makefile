# Aether Identity Package Ecosystem Makefile
# Multi-language SDK management and build orchestration

.PHONY: help install clean build test lint format typecheck
.PHONY: build-all build-node build-golang build-swift build-docker build-github build-cli
.PHONY: test-all test-node test-golang test-swift test-docker test-github test-cli
.PHONY: dev dev-node dev-golang dev-docker dev-github dev-cli
.PHONY: publish publish-node publish-docker publish-shared
.PHONY: build-python build-rust build-java build-dotnet build-php build-ruby
.PHONY: test-python test-rust test-java test-dotnet test-php test-ruby

# Default target
.DEFAULT_GOAL := help

# Variables
PNPM := pnpm
NODE_VERSION := 18.0.0
GO_VERSION := 1.21
SWIFT_VERSION := 5.9

# Colors for output
BLUE := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
RESET := \033[0m

## 🚀 Quick Start & Help
help: ## Show all available commands
	@echo "$(BLUE)📦 Aether Identity Package Ecosystem$(RESET)"
	@echo ""
	@echo "$(GREEN)🚀 Quick Start:$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / && /Quick/ {printf "  $(YELLOW)%-25s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(GREEN)🏗️ Build Commands:$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / && /Build/ {printf "  $(YELLOW)%-25s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(GREEN)🧪 Test Commands:$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / && /Test/ {printf "  $(YELLOW)%-25s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(GREEN)🔧 Development:$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / && /Development/ {printf "  $(YELLOW)%-25s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(GREEN)📦 Publishing:$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / && /Publish/ {printf "  $(YELLOW)%-25s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(GREEN)🧹 Maintenance:$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / && /Maintenance/ {printf "  $(YELLOW)%-25s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

## 📦 Installation & Setup
install: ## Quick - Install all dependencies
	@echo "$(BLUE)📦 Installing package ecosystem dependencies...$(RESET)"
	@$(PNPM) install
	@echo "$(GREEN)✅ Dependencies installed$(RESET)"

install-node: ## Quick - Install Node.js dependencies only
	@echo "$(BLUE)📦 Installing Node.js dependencies...$(RESET)"
	@$(PNPM) install

install-golang: ## Quick - Install Go dependencies
	@echo "$(BLUE)📦 Installing Go dependencies...$(RESET)"
	@cd golang && go mod download

install-swift: ## Quick - Install Swift dependencies
	@echo "$(BLUE)📦 Installing Swift dependencies...$(RESET)"
	@cd swift && swift package resolve

## 🏗️ Build Commands - All Packages
build-all: ## Build - Build all packages (TypeScript + Go + Swift)
	@echo "$(BLUE)🏗️ Building all packages...$(RESET)"
	@$(MAKE) build-node
	@$(MAKE) build-golang
	@$(MAKE) build-swift
	@$(MAKE) build-docker
	@$(MAKE) build-github
	@$(MAKE) build-cli
	@echo "$(GREEN)✅ All packages built successfully$(RESET)"

build: ## Build - Build all TypeScript packages
	@echo "$(BLUE)🏗️ Building TypeScript packages...$(RESET)"
	@$(PNPM) build

## 🏗️ Build Commands - Individual Packages
build-node: ## Build - Build Node.js SDK
	@echo "$(BLUE)📦 Building Node.js SDK...$(RESET)"
	@cd node && $(PNPM) build

build-golang: ## Build - Build Go SDK
	@echo "$(BLUE)🐹 Building Go SDK...$(RESET)"
	@cd golang && go build ./...

build-swift: ## Build - Build Swift SDK
	@echo "$(BLUE)📱 Building Swift SDK...$(RESET)"
	@cd swift && swift build

build-docker: ## Build - Build Docker SDK
	@echo "$(BLUE)🐳 Building Docker SDK...$(RESET)"
	@cd docker && $(PNPM) build

build-github: ## Build - Build GitHub App
	@echo "$(BLUE)🐙 Building GitHub App...$(RESET)"
	@cd github && go build

build-cli: ## Build - Build CLI tool
	@echo "$(BLUE)🛠️ Building CLI tool...$(RESET)"
	@cd cli && go build

build-vscode: ## Build - Build VSCode Extension
	@echo "$(BLUE)📝 Building VSCode Extension...$(RESET)"
	@cd vscode && $(PNPM) build

build-shared: ## Build - Build shared types
	@echo "$(BLUE)📋 Building shared types...$(RESET)"
	@cd shared && $(PNPM) build

build-action: ## Build - Build GitHub Action
	@echo "$(BLUE)⚡ Building GitHub Action...$(RESET)"
	@cd action && echo "GitHub Action ready"

## 🏗️ Build Commands - Work In Progress
build-python: ## Build - Build Python SDK (WIP)
	@echo "$(BLUE)🐍 Building Python SDK...$(RESET)"
	@if [ -d "python" ]; then cd python && python -m build; else echo "$(YELLOW)⚠️ Python SDK not yet implemented$(RESET)"; fi

build-rust: ## Build - Build Rust SDK (WIP)
	@echo "$(BLUE)🦀 Building Rust SDK...$(RESET)"
	@if [ -d "rust" ]; then cd rust && cargo build; else echo "$(YELLOW)⚠️ Rust SDK not yet implemented$(RESET)"; fi

build-java: ## Build - Build Java SDK (WIP)
	@echo "$(BLUE)☕ Building Java SDK...$(RESET)"
	@if [ -d "java" ]; then cd java && mvn compile; else echo "$(YELLOW)⚠️ Java SDK not yet implemented$(RESET)"; fi

build-dotnet: ## Build - Build .NET SDK (WIP)
	@echo "$(BLUE)🟣 Building .NET SDK...$(RESET)"
	@if [ -d ".net" ]; then cd .net && dotnet build; else echo "$(YELLOW)⚠️ .NET SDK not yet implemented$(RESET)"; fi

build-php: ## Build - Build PHP SDK (WIP)
	@echo "$(BLUE)🐘 Building PHP SDK...$(RESET)"
	@if [ -d "php" ]; then cd php && composer install; else echo "$(YELLOW)⚠️ PHP SDK not yet implemented$(RESET)"; fi

build-ruby: ## Build - Build Ruby SDK (WIP)
	@echo "$(BLUE)💎 Building Ruby SDK...$(RESET)"
	@if [ -d "ruby" ]; then cd ruby && bundle install; else echo "$(YELLOW)⚠️ Ruby SDK not yet implemented$(RESET)"; fi

build-k8s: ## Build - Build Kubernetes Operator (WIP)
	@echo "$(BLUE)☸️ Building Kubernetes Operator...$(RESET)"
	@if [ -d "k8s" ]; then cd k8s && go build; else echo "$(YELLOW)⚠️ Kubernetes Operator not yet implemented$(RESET)"; fi

build-extension: ## Build - Build Browser Extension (WIP)
	@echo "$(BLUE)🔌 Building Browser Extension...$(RESET)"
	@if [ -d "extension" ]; then cd extension && $(PNPM) build; else echo "$(YELLOW)⚠️ Browser Extension not yet implemented$(RESET)"; fi

build-snap: ## Build - Build Snap Package (WIP)
	@echo "$(BLUE)📦 Building Snap Package...$(RESET)"
	@if [ -d "snap" ]; then cd snap && snapcraft; else echo "$(YELLOW)⚠️ Snap Package not yet implemented$(RESET)"; fi

build-gcc: ## Build - Build GCC Plugin (WIP)
	@echo "$(BLUE)🔧 Building GCC Plugin...$(RESET)"
	@if [ -d "gcc" ]; then cd gcc && make; else echo "$(YELLOW)⚠️ GCC Plugin not yet implemented$(RESET)"; fi

## 🧪 Test Commands - All Packages
test-all: ## Test - Test all packages
	@echo "$(BLUE)🧪 Testing all packages...$(RESET)"
	@$(MAKE) test-node
	@$(MAKE) test-golang
	@$(MAKE) test-swift
	@$(MAKE) test-docker
	@$(MAKE) test-github
	@$(MAKE) test-cli
	@echo "$(GREEN)✅ All tests completed$(RESET)"

test: ## Test - Test all TypeScript packages
	@echo "$(BLUE)🧪 Testing TypeScript packages...$(RESET)"
	@$(PNPM) test

## 🧪 Test Commands - Individual Packages
test-node: ## Test - Test Node.js SDK
	@echo "$(BLUE)📦 Testing Node.js SDK...$(RESET)"
	@cd node && $(PNPM) test

test-golang: ## Test - Test Go SDK
	@echo "$(BLUE)🐹 Testing Go SDK...$(RESET)"
	@cd golang && go test ./...

test-swift: ## Test - Test Swift SDK
	@echo "$(BLUE)📱 Testing Swift SDK...$(RESET)"
	@cd swift && swift test

test-docker: ## Test - Test Docker SDK
	@echo "$(BLUE)🐳 Testing Docker SDK...$(RESET)"
	@cd docker && $(PNPM) test

test-github: ## Test - Test GitHub App
	@echo "$(BLUE)🐙 Testing GitHub App...$(RESET)"
	@cd github && go test ./...

test-cli: ## Test - Test CLI tool
	@echo "$(BLUE)🛠️ Testing CLI tool...$(RESET)"
	@cd cli && go test ./...

test-vscode: ## Test - Test VSCode Extension
	@echo "$(BLUE)📝 Testing VSCode Extension...$(RESET)"
	@cd vscode && $(PNPM) test

test-shared: ## Test - Test shared types
	@echo "$(BLUE)📋 Testing shared types...$(RESET)"
	@cd shared && $(PNPM) test

## 🧪 Test Commands - Work In Progress
test-python: ## Test - Test Python SDK (WIP)
	@echo "$(BLUE)🐍 Testing Python SDK...$(RESET)"
	@if [ -d "python" ]; then cd python && pytest; else echo "$(YELLOW)⚠️ Python SDK not yet implemented$(RESET)"; fi

test-rust: ## Test - Test Rust SDK (WIP)
	@echo "$(BLUE)🦀 Testing Rust SDK...$(RESET)"
	@if [ -d "rust" ]; then cd rust && cargo test; else echo "$(YELLOW)⚠️ Rust SDK not yet implemented$(RESET)"; fi

test-java: ## Test - Test Java SDK (WIP)
	@echo "$(BLUE)☕ Testing Java SDK...$(RESET)"
	@if [ -d "java" ]; then cd java && mvn test; else echo "$(YELLOW)⚠️ Java SDK not yet implemented$(RESET)"; fi

test-dotnet: ## Test - Test .NET SDK (WIP)
	@echo "$(BLUE)🟣 Testing .NET SDK...$(RESET)"
	@if [ -d ".net" ]; then cd .net && dotnet test; else echo "$(YELLOW)⚠️ .NET SDK not yet implemented$(RESET)"; fi

test-php: ## Test - Test PHP SDK (WIP)
	@echo "$(BLUE)🐘 Testing PHP SDK...$(RESET)"
	@if [ -d "php" ]; then cd php && vendor/bin/phpunit; else echo "$(YELLOW)⚠️ PHP SDK not yet implemented$(RESET)"; fi

test-ruby: ## Test - Test Ruby SDK (WIP)
	@echo "$(BLUE)💎 Testing Ruby SDK...$(RESET)"
	@if [ -d "ruby" ]; then cd ruby && bundle exec rspec; else echo "$(YELLOW)⚠️ Ruby SDK not yet implemented$(RESET)"; fi

## 🔧 Development Commands
dev: ## Development - Start all TypeScript packages in dev mode
	@echo "$(BLUE)🔧 Starting development mode for all packages...$(RESET)"
	@$(PNPM) dev

dev-node: ## Development - Start Node.js SDK in dev mode
	@echo "$(BLUE)📦 Starting Node.js SDK development...$(RESET)"
	@cd node && $(PNPM) dev

dev-docker: ## Development - Start Docker SDK in dev mode
	@echo "$(BLUE)🐳 Starting Docker SDK development...$(RESET)"
	@cd docker && $(PNPM) dev

dev-vscode: ## Development - Start VSCode Extension in dev mode
	@echo "$(BLUE)📝 Starting VSCode Extension development...$(RESET)"
	@cd vscode && $(PNPM) dev

dev-github: ## Development - Start GitHub App in dev mode
	@echo "$(BLUE)🐙 Starting GitHub App development...$(RESET)"
	@cd github && go run main.go

dev-cli: ## Development - Start CLI in dev mode
	@echo "$(BLUE)🛠️ Starting CLI development...$(RESET)"
	@cd cli && go run main.go

dev-golang: ## Development - Watch Go SDK for changes
	@echo "$(BLUE)🐹 Starting Go SDK development (watch mode)...$(RESET)"
	@cd golang && air

## 🔧 Code Quality
lint: ## Code - Lint all TypeScript packages
	@echo "$(BLUE)🔍 Linting all packages...$(RESET)"
	@$(PNPM) lint

lint-fix: ## Code - Fix linting issues
	@echo "$(BLUE)🔧 Fixing linting issues...$(RESET)"
	@$(PNPM) lint:fix

typecheck: ## Code - Type check all TypeScript packages
	@echo "$(BLUE)🔍 Type checking all packages...$(RESET)"
	@$(PNPM) typecheck

format: ## Code - Format all code
	@echo "$(BLUE)💅 Formatting code...$(RESET)"
	@$(PNPM) format

format-check: ## Code - Check code formatting
	@echo "$(BLUE)🔍 Checking code formatting...$(RESET)"
	@$(PNPM) format:check

## 📦 Publishing Commands
publish: ## Publish - Publish all packages
	@echo "$(BLUE)📦 Publishing all packages...$(RESET)"
	@$(MAKE) publish-node
	@$(MAKE) publish-docker
	@$(MAKE) publish-shared

publish-node: ## Publish - Publish Node.js SDK
	@echo "$(BLUE)📦 Publishing Node.js SDK...$(RESET)"
	@cd node && $(PNPM) publish

publish-docker: ## Publish - Publish Docker SDK
	@echo "$(BLUE)🐳 Publishing Docker SDK...$(RESET)"
	@cd docker && $(PNPM) publish

publish-shared: ## Publish - Publish shared types
	@echo "$(BLUE)📋 Publishing shared types...$(RESET)"
	@cd shared && $(PNPM) publish

## 🧹 Maintenance Commands
clean: ## Maintenance - Clean all build artifacts and dependencies
	@echo "$(BLUE)🧹 Cleaning package ecosystem...$(RESET)"
	@$(PNPM) clean
	@cd golang && go clean
	@cd swift && swift package clean
	@cd github && go clean
	@cd cli && go clean
	@echo "$(GREEN)✅ Clean complete$(RESET)"

clean-node: ## Maintenance - Clean Node.js artifacts
	@echo "$(BLUE)🧹 Cleaning Node.js artifacts...$(RESET)"
	@rm -rf node_modules
	@cd node && rm -rf dist node_modules
	@cd docker && rm -rf dist node_modules
	@cd vscode && rm -rf dist node_modules
	@cd shared && rm -rf dist node_modules

clean-golang: ## Maintenance - Clean Go artifacts
	@echo "$(BLUE)🧹 Cleaning Go artifacts...$(RESET)"
	@cd golang && go clean

clean-swift: ## Maintenance - Clean Swift artifacts
	@echo "$(BLUE)🧹 Cleaning Swift artifacts...$(RESET)"
	@cd swift && swift package clean

reset: ## Maintenance - Clean and reinstall everything
	@echo "$(BLUE)🔄 Resetting package ecosystem...$(RESET)"
	@$(MAKE) clean
	@$(MAKE) install

## 📊 Status & Info
status: ## Maintenance - Show package ecosystem status
	@echo "$(BLUE)📊 Package Ecosystem Status:$(RESET)"
	@echo "$(GREEN)Node.js:$(RESET) $(shell node --version)"
	@echo "$(GREEN)pnpm:$(RESET) $(shell pnpm --version)"
	@echo "$(GREEN)Go:$(RESET) $(shell go version 2>/dev/null || echo 'Not installed')"
	@echo "$(GREEN)Swift:$(RESET) $(shell swift --version 2>/dev/null || echo 'Not installed')"
	@echo ""
	@echo "$(BLUE)📦 Available Packages:$(RESET)"
	@echo "  $(GREEN)✅$(RESET) Node.js SDK (Ready)"
	@echo "  $(GREEN)✅$(RESET) Go SDK (Ready)"
	@echo "  $(GREEN)✅$(RESET) Swift SDK (Ready)"
	@echo "  $(GREEN)✅$(RESET) Docker SDK (Ready)"
	@echo "  $(GREEN)✅$(RESET) GitHub App (Ready)"
	@echo "  $(YELLOW)🔄$(RESET) CLI Tool (Alpha)"
	@echo "  $(YELLOW)🔄$(RESET) VSCode Extension (Alpha)"
	@echo "  $(YELLOW)🔄$(RESET) Kubernetes Operator (Alpha)"
	@echo "  $(RED)🚧$(RESET) Python SDK (In Progress)"
	@echo "  $(RED)🚧$(RESET) Rust SDK (In Progress)"
	@echo "  $(RED)🚧$(RESET) Java SDK (In Progress)"
	@echo "  $(RED)🚧$(RESET) .NET SDK (Planned)"
	@echo "  $(RED)🚧$(RESET) PHP SDK (Planned)"
	@echo "  $(RED)🚧$(RESET) Ruby SDK (Planned)"

version: ## Maintenance - Show package versions
	@echo "$(BLUE)📋 Package Versions:$(RESET)"
	@$(PNPM) version

## 🔗 Cross-Package Commands
link-shared: ## Development - Link shared types to all packages
	@echo "$(BLUE)🔗 Linking shared types...$(RESET)"
	@cd shared && $(PNPM) link
	@cd node && $(PNPM) link @aether-identity/shared
	@cd docker && $(PNPM) link @aether-identity/shared
	@cd vscode && $(PNPM) link @aether-identity/shared

## 🧪 Integration Testing
integration-test: ## Test - Run integration tests
	@echo "$(BLUE)🧪 Running integration tests...$(RESET)"
	@echo "$(YELLOW)Integration tests should be run from the root Makefile$(RESET)"
	@echo "Run: make test-integration"

## 📚 Documentation
docs: ## Development - Generate package documentation
	@echo "$(BLUE)📚 Generating documentation...$(RESET)"
	@cd node && $(PNPM) docs 2>/dev/null || echo "$(YELLOW)No docs script for Node.js SDK$(RESET)"
	@cd golang && godoc -http=:6060 &
	@echo "$(GREEN)✅ Go docs server started at http://localhost:6060$(RESET)"
