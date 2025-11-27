#!/bin/bash

echo "🔧 Building Aether Identity for Production..."

# Set environment for build
export NODE_ENV=production

# Generate Prisma client first
echo "📦 Generating Prisma client..."
cd api && pnpm db:generate
if [ $? -ne 0 ]; then
    echo "❌ Prisma generation failed"
    exit 1
fi

# Build API
echo "🏗️ Building API..."
pnpm run build:api
if [ $? -ne 0 ]; then
    echo "❌ API build failed"
    exit 1
fi

# Build Frontend
echo "🎨 Building Frontend..."
cd .. && pnpm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

echo "✅ Build completed successfully!"