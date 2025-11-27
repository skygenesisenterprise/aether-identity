#!/bin/bash

echo "🚀 Deploying Aether Identity..."

# Build and push to registry
echo "📦 Building Docker image..."
docker build -t aether-identity:latest .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully!"
    echo "🐳 Ready for deployment!"
else
    echo "❌ Docker build failed!"
    exit 1
fi