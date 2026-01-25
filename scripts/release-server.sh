#!/bin/bash

# Script pour versionner le serveur
set -e

VERSION=$1
if [ -z "$VERSION" ]; then
    echo "Usage: $0 <version>"
    echo "Example: $0 1.0.0"
    exit 1
fi

TAG="v${VERSION}-server"

echo "Creating release for server version $TAG"

# Vérifier que le répertoire server existe
if [ ! -d "server" ]; then
    echo "Error: server directory not found"
    exit 1
fi

# Ajouter les changements du server
git add server/
git commit -m "feat(server): release version $VERSION" || true

# Créer le tag
git tag -a "$TAG" -m "Server release version $VERSION"

# Pousser le commit et le tag
git push origin main
git push origin "$TAG"

echo "✅ Server version $TAG released successfully!"