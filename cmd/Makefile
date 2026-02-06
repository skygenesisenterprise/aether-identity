.PHONY: build run test clean docker-build docker-run docker-shell help

# Variables
BINARY=aether-console
BUILD_DIR=build
DOCKER_IMAGE=aether-identity/console

# Build
build:
	@echo "🏗️  Building $(BINARY)..."
	@mkdir -p $(BUILD_DIR)
	@go build -o $(BUILD_DIR)/$(BINARY) ./main.go
	@echo "✅ Build complete: $(BUILD_DIR)/$(BINARY)"

# Run locally
run: build
	@echo "🚀 Running $(BINARY)..."
	@./$(BUILD_DIR)/$(BINARY)

# Run development mode (direct)
dev:
	@echo "🚀 Running in dev mode..."
	@go run ./main.go

# Test
test:
	@echo "🧪 Running tests..."
	@go test -v ./...

# Clean
clean:
	@echo "🧹 Cleaning up..."
	@rm -rf $(BUILD_DIR)
	@go clean

# Format
fmt:
	@echo "✨ Formatting code..."
	@go fmt ./...

# Dependencies
deps:
	@echo "📦 Downloading dependencies..."
	@go mod download
	@go mod tidy

# Docker build
docker-build:
	@echo "🐳 Building Docker image..."
	@docker build -t $(DOCKER_IMAGE):latest -f infra/Dockerfile .

# Docker interactive shell (console)
docker-shell: docker-build
	@echo "🖥️  Starting interactive console in Docker..."
	@docker run -it --rm --name aether-console $(DOCKER_IMAGE):latest

# Docker compose up (interactive)
docker-up:
	@echo "🚀 Starting with Docker Compose (interactive)..."
	@cd infra && docker-compose run --rm aether-console

# Docker compose down
docker-down:
	@echo "🛑 Stopping Docker Compose..."
	@cd infra && docker-compose down

# Install locally
install: build
	@echo "💿 Installing $(BINARY) to /usr/local/bin..."
	@sudo cp $(BUILD_DIR)/$(BINARY) /usr/local/bin/
	@sudo chmod +x /usr/local/bin/$(BINARY)
	@echo "✅ Installation complete!"
	@echo "Run '$(BINARY)' to start the console"

# Uninstall
uninstall:
	@echo "🗑️  Uninstalling $(BINARY)..."
	@sudo rm -f /usr/local/bin/$(BINARY)
	@echo "✅ Uninstall complete"

# Show help
help:
	@echo "🛡️  Aether Identity Console - Available Commands:"
	@echo ""
	@echo "Development:"
	@echo "  make build         - Build the binary"
	@echo "  make run           - Build and run locally"
	@echo "  make dev           - Run directly with go run"
	@echo "  make test          - Run tests"
	@echo "  make fmt           - Format code"
	@echo "  make clean         - Clean build artifacts"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-build  - Build Docker image"
	@echo "  make docker-shell  - Run interactive console in Docker"
	@echo "  make docker-up     - Start with Docker Compose"
	@echo "  make docker-down   - Stop Docker Compose"
	@echo ""
	@echo "Installation:"
	@echo "  make install       - Install to /usr/local/bin"
	@echo "  make uninstall     - Remove from /usr/local/bin"
	@echo ""
	@echo "Usage:"
	@echo "  Once running, type a number (0-13) and press Enter"
	@echo "  0 = Quitter, 1-13 = Actions diverses"
