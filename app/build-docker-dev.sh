#!/bin/bash

# Script optimisé pour construire et démarrer l'environnement de développement Docker
# Ce script gère correctement les fichiers statiques et les MIME types

echo "🚀 Construction de l'environnement de développement Docker..."

# Construire l'image Docker avec les deux stages
cd /home/liam/Bureau/enterprise/aether-identity/app
docker build -t aether-identity-dev -f Dockerfile.dev .

if [ $? -eq 0 ]; then
    echo "✅ Construction réussie !"
    echo "📦 Démarrage du conteneur..."
    
    # Démarrer le conteneur
    docker compose -f docker-compose.dev.yml up -d
    
    if [ $? -eq 0 ]; then
        echo "✅ Conteneur démarré avec succès !"
        echo "🌐 Votre application est disponible sur :"
        echo "   - http://localhost:3000 (Next.js direct)"
        echo "   - http://localhost (via Nginx avec MIME types corrects)"
        echo ""
        echo "📝 Pour voir les logs :"
        echo "   docker logs -f aether-identity-frontend-dev"
    else
        echo "❌ Échec du démarrage du conteneur"
        exit 1
    fi
else
    echo "❌ Échec de la construction Docker"
    exit 1
fi
