#!/bin/sh

# Initialize Prisma database
echo "🗄️  Initializing Prisma database..."
cd /app/backend

# Generate Prisma client first (ensure it's available)
echo "📦 Generating Prisma client..."
pnpm db:generate --schema ./prisma/schema.prisma

# Wait a moment for the client to be properly generated
sleep 2

if [ ! -f "data/dev.db" ]; then
    echo "Creating new database..."
    pnpm db:push --schema ./prisma/schema.prisma
else
    echo "Database exists, applying migrations..."
    pnpm db:push --schema ./prisma/schema.prisma
fi

# Start both services in background
echo "🚀 Starting Aether Identity services..."

# Start backend API
echo "🔧 Starting backend API on port 8080..."
cd /app/backend
pnpm start:api &
BACKEND_PID=$!

# Start frontend
echo "🎨 Starting frontend on port 3000..."
cd /app/frontend
pnpm start &
FRONTEND_PID=$!

# Function to handle shutdown
cleanup() {
    echo "🛑 Shutting down services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    wait
    echo "✅ All services stopped"
}

# Trap signals
trap cleanup SIGTERM SIGINT

# Wait for services
echo "📊 Services are running:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:8080"
echo "  Health Check: http://localhost:8080/health"
echo "  API Documentation: http://localhost:8080/api/v1/docs"
echo ""
echo "Press Ctrl+C to stop all services"

wait