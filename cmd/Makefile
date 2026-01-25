.PHONY: build install dev test lint clean

# Variables
BINARY=vaultctl
BUILD_DIR=build
GO_FILES=$(shell find . -name "*.go" -type f)

# Build
build:
	@echo "Building $(BINARY)..."
	@mkdir -p $(BUILD_DIR)
	@go build -o $(BUILD_DIR)/$(BINARY) ./main.go

# Install
install: build
	@echo "Installing $(BINARY)..."
	@sudo cp $(BUILD_DIR)/$(BINARY) /usr/local/bin/
	@sudo chmod +x /usr/local/bin/$(BINARY)
	@sudo cp scripts/service.sh /etc/systemd/system/vaultctl.service
	@sudo systemctl daemon-reload
	@sudo systemctl enable vaultctl

# Dev
dev:
	@echo "Running $(BINARY) in development mode..."
	@go run ./main.go

# Test
test:
	@echo "Running tests..."
	@go test -v ./...

# Lint
lint:
	@echo "Running linter..."
	@golangci-lint run

# Clean
clean:
	@echo "Cleaning up..."
	@rm -rf $(BUILD_DIR)
	@go clean

# Format
fmt:
	@echo "Formatting code..."
	@go fmt $(GO_FILES)

# Dependencies
deps:
	@echo "Downloading dependencies..."
	@go mod download
	@go mod tidy

# Docker build (for testing)
docker-build:
	@echo "Building Docker image..."
	@docker build -t aether-vault/cmd .

# Run tests in Docker
docker-test: docker-build
	@echo "Running tests in Docker..."
	@docker run --rm aether-vault/cmd make test