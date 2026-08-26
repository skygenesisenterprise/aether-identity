.PHONY: help build build-dev build-prod dev-up dev-down dev-logs dev-rebuild prod-up prod-down prod-logs prod-rebuild stop clean prune

APP_NAME := skygenesisenterprise/aether-identity

help:
	@echo "Available targets:"
	@echo "  build          - Build production image (default Dockerfile)"
	@echo "  build-dev      - Build development image (NODE_ENV=development)"
	@echo "  build-prod     - Build production image (NODE_ENV=production)"
	@echo "  dev-up         - Start dev environment (compose --profile dev)"
	@echo "  dev-down       - Stop dev environment"
	@echo "  dev-logs       - View dev environment logs"
	@echo "  dev-rebuild    - Rebuild and restart dev environment"
	@echo "  prod-up        - Start production environment (default profile)"
	@echo "  prod-down      - Stop production environment"
	@echo "  prod-logs      - View production environment logs"
	@echo "  prod-rebuild   - Rebuild and restart production environment"
	@echo "  stop           - Stop all containers"
	@echo "  clean          - Remove build artifacts"
	@echo "  prune          - Clean up Docker system"

build:
	docker build -f Dockerfile -t $(APP_NAME):latest .

build-dev:
	docker build -f Dockerfile \
		--build-arg NODE_ENV=development \
		--build-arg BUILD_STATIC=0 \
		-t $(APP_NAME):dev .

build-prod:
	docker build -f Dockerfile \
		--build-arg NODE_ENV=production \
		--build-arg BUILD_STATIC=1 \
		-t $(APP_NAME):latest .

dev-up:
	APP_IMAGE_TAG=dev NODE_ENV=development WORKER_COMMAND=air BUILD_STATIC=0 \
		docker compose --profile dev up -d

dev-down:
	docker compose --profile dev down

dev-logs:
	docker compose --profile dev logs -f

dev-rebuild:
	docker compose --profile dev down
	APP_IMAGE_TAG=dev NODE_ENV=development WORKER_COMMAND=air BUILD_STATIC=0 \
		docker compose --profile dev up -d --build

prod-up:
	APP_IMAGE_TAG=latest NODE_ENV=production WORKER_COMMAND=worker BUILD_STATIC=1 \
		docker compose up -d 

prod-down:
	docker compose down

prod-logs:
	docker compose logs -f

prod-rebuild:
	docker compose down
	APP_IMAGE_TAG=latest NODE_ENV=production WORKER_COMMAND=worker BUILD_STATIC=1 \
		docker compose up -d --force-recreate --build

stop:
	docker compose down 2>/dev/null || true

clean:
	rm -rf apps/.next
	rm -rf server/aether-server

prune:
	docker system prune -f
