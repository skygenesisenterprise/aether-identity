#!/bin/sh
set -e

###########################################
# Start Backend API
###########################################
echo "🔧 Starting backend API on port 8080..."
cd /app/backend

if [ -f "dist/server.js" ]; then
    node dist/server.js &
else
    echo "❌ ERROR: dist/server.js not found!"
    exit 1
fi

BACKEND_PID=$!

###########################################
# Start Frontend (Next.js 16)
###########################################
echo "🎨 Starting Next.js frontend on port 3000..."
cd /app/frontend

# Next.js 16 (Turbopack) has NO .next/standalone build.
# Use `pnpm start`, which runs: next start
pnpm start &
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