#!/bin/bash

# Aether Vault Container Entrypoint Script
# Starts all services in the correct order

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Aether Vault Container...${NC}"

# Function to wait for service
wait_for_service() {
    local service_name=$1
    local check_command=$2
    local max_attempts=${3:-30}
    local attempt=1
    
    echo -e "${YELLOW}⏳ Waiting for $service_name...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if eval "$check_command" >/dev/null 2>&1; then
            echo -e "${GREEN}✅ $service_name is ready${NC}"
            return 0
        fi
        echo -e "${YELLOW}⏳ Attempt $attempt/$max_attempts: $service_name not ready yet${NC}"
        sleep 2
        ((attempt++))
    done
    
    echo -e "${RED}❌ $service_name failed to start${NC}"
    return 1
}

# Initialize directories and permissions
echo -e "${BLUE}📁 Initializing directories and permissions...${NC}"
mkdir -p /app/logs /app/uploads /var/log/nginx /var/log/supervisor
chown -R aether:aether /app
chown -R postgres:postgres /var/lib/postgresql /var/run/postgresql /var/log/postgresql
chmod 755 /usr/local/bin/vault-shell.sh

# Start PostgreSQL
echo -e "${BLUE}🐘 Starting PostgreSQL...${NC}"
if [ "$(id -u)" = "0" ]; then
    # Start as root with user switch
    su-exec postgres pg_ctl -D /var/lib/postgresql/data -l /var/log/postgresql/startup.log start
else
    echo -e "${RED}❌ PostgreSQL must be started as root${NC}"
    exit 1
fi

# Wait for PostgreSQL to be ready
wait_for_service "PostgreSQL" "pg_isready -U aether" 30

# Start Redis
echo -e "${BLUE}🔴 Starting Redis...${NC}"
redis-server --daemonize yes --appendonly yes --requirepass ${REDIS_PASSWORD:-vault_redis_2024}

# Wait for Redis to be ready
wait_for_service "Redis" "redis-cli -a ${REDIS_PASSWORD:-vault_redis_2024} ping" 20

# Start Go Backend
echo -e "${BLUE}⚡ Starting Aether Vault API Server...${NC}"
cd /app/backend

# Export environment variables for backend
export NODE_ENV=production
export SERVER_HOST=0.0.0.0
export SERVER_PORT=8080
export DATABASE_HOST=localhost
export DATABASE_PORT=5432
export DATABASE_USER=${POSTGRES_USER:-aether}
export DATABASE_PASSWORD=${POSTGRES_PASSWORD:-vault_postgres_2024}
export DATABASE_NAME=${POSTGRES_DB:-aether_vault}
export DATABASE_SSLMODE=disable
export REDIS_HOST=localhost
export REDIS_PORT=6379
export REDIS_PASSWORD=${REDIS_PASSWORD:-vault_redis_2024}
export JWT_SECRET=${JWT_SECRET:-your-super-secret-jwt-key-change-in-production}
export SECURITY_ENCRYPTION_KEY=${SECURITY_ENCRYPTION_KEY:-your-32-character-encryption-key}

# Start backend in background
nohup ./main > /app/logs/backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > /app/backend.pid

# Wait for backend to be ready
wait_for_service "Backend API" "curl -f http://localhost:8080/health" 30

# Start Next.js Frontend
echo -e "${BLUE}🌐 Starting Next.js Frontend...${NC}"
cd /app/frontend

# Export environment variables for frontend
export NODE_ENV=production
export PORT=3000
export HOSTNAME=0.0.0.0
export BACKEND_URL=http://localhost:8080
export API_BASE_URL=http://localhost:8080
export NEXTAUTH_URL=http://localhost:3000
export NEXTAUTH_SECRET=${NEXTAUTH_SECRET:-your-super-secret-nextauth-key-change-in-production}

# Start frontend in background
nohup node server.js > /app/logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > /app/frontend.pid

# Wait for frontend to be ready
wait_for_service "Frontend" "curl -f http://localhost:3000" 30

# Start SSH Server
echo -e "${BLUE}🔐 Starting SSH Server...${NC}"
if [ "$(id -u)" = "0" ]; then
    # Generate SSH host keys if they don't exist
    ssh-keygen -A -f /etc/ssh/ssh_host_rsa_key
    
    # Start SSH server
    /usr/sbin/sshd -D -e /etc/ssh/sshd_config &
    SSH_PID=$!
    echo $SSH_PID > /app/ssh.pid
    
    wait_for_service "SSH Server" "nc -z localhost 2222" 10
else
    echo -e "${YELLOW}⚠️ SSH server requires root privileges${NC}"
fi

# Setup log rotation
echo -e "${BLUE}📝 Setting up log rotation...${NC}"
cat > /etc/logrotate.d/aether-vault << EOF
/app/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 644 aether aether
}
EOF

# Display service status
echo -e "${GREEN}🎉 Aether Vault is fully operational!${NC}"
echo -e "${BLUE}┌─────────────────────────────────────────────────────────┐${NC}"
echo -e "${BLUE}│ Service URLs:                                     │${NC}"
echo -e "${BLUE}│ • Frontend:  http://localhost:3000               │${NC}"
echo -e "${BLUE}│ • Backend:   http://localhost:8080/health         │${NC}"
echo -e "${BLUE}│ • SSH:       ssh ssh-user@localhost -p 2222       │${NC}"
echo -e "${BLUE}└─────────────────────────────────────────────────────────┘${NC}"

# Function to handle shutdown
cleanup() {
    echo -e "${YELLOW}🛑 Shutting down services...${NC}"
    
    # Stop services
    if [ -f /app/frontend.pid ]; then
        kill $(cat /app/frontend.pid) 2>/dev/null || true
    fi
    
    if [ -f /app/backend.pid ]; then
        kill $(cat /app/backend.pid) 2>/dev/null || true
    fi
    
    if [ -f /app/ssh.pid ]; then
        kill $(cat /app/ssh.pid) 2>/dev/null || true
    fi
    
    # Stop PostgreSQL
    if [ "$(id -u)" = "0" ]; then
        su-exec postgres pg_ctl -D /var/lib/postgresql/data stop
    fi
    
    # Stop Redis
    redis-cli -a ${REDIS_PASSWORD:-vault_redis_2024} shutdown
    
    echo -e "${GREEN}✅ All services stopped gracefully${NC}"
    exit 0
}

# Setup signal handlers
trap cleanup SIGTERM SIGINT

# Keep container running and monitor services
echo -e "${BLUE}🔍 Monitoring services...${NC}"
while true; do
    # Check if critical services are still running
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo -e "${RED}❌ Backend service died, restarting...${NC}"
        cd /app/backend && nohup ./main > /app/logs/backend.log 2>&1 &
        BACKEND_PID=$!
        echo $BACKEND_PID > /app/backend.pid
    fi
    
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        echo -e "${RED}❌ Frontend service died, restarting...${NC}"
        cd /app/frontend && nohup node server.js > /app/logs/frontend.log 2>&1 &
        FRONTEND_PID=$!
        echo $FRONTEND_PID > /app/frontend.pid
    fi
    
    sleep 30
done