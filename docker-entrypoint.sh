#!/bin/sh
set -e

###########################################
# Start Backend API
###########################################
echo "🔧 Starting backend API on port 8080..."
cd /app/backend

# Ensure database directory exists and has correct permissions
mkdir -p data
chown -R node:node data
chmod -R 755 data

# Initialize database if it doesn't exist
if [ ! -f "data/dev.db" ]; then
    echo "📄 Initializing database..."
    npx prisma db push --schema prisma/schema.prisma
fi

if [ -f "dist/server.js" ]; then
    node dist/server.js &
else
    echo "❌ ERROR: dist/server.js not found!"
    exit 1
fi

BACKEND_PID=$!

###########################################
# Start Frontend (Next.js 16 - Turbopack)
###########################################
echo "🎨 Starting Next.js frontend on port 3000..."
cd /app/frontend

# Next.js 16 does not create a standalone server.
# `pnpm start` calls: next start
# Use pnpm to start Next.js
if command -v pnpm >/dev/null 2>&1; then
    pnpm start &
elif [ -f "node_modules/.bin/next" ]; then
    node node_modules/.bin/next start &
else
    echo "❌ ERROR: Next.js binary not found!"
    exit 1
fi

FRONTEND_PID=$!

###########################################
# Graceful shutdown
###########################################
cleanup() {
    echo "🛑 Shutting down services..."
    
    kill "$BACKEND_PID" 2>/dev/null || true
    kill "$FRONTEND_PID" 2>/dev/null || true
    
    wait || true
    echo "✅ All services stopped"
}

trap cleanup SIGTERM SIGINT

echo ""
echo "📊 Services are running:"
echo "  ➜ Frontend:        http://localhost:3000"
echo "  ➜ Backend API:     http://localhost:8080"
echo "  ➜ Health Check:    http://localhost:8080/health"
echo "  ➜ API Docs:        http://localhost:8080/api/v1/docs"
echo ""
echo "Press Ctrl+C to stop all services"

wait
