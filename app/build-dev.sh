#!/bin/bash

# Script pour construire le stage builder et copier les artefacts pour le développement

# Construire le stage builder
docker build --target builder -t aether-identity-builder --file Dockerfile .

# Créer un conteneur temporaire à partir du stage builder
CONTAINER_ID=$(docker create aether-identity-builder)

# Copier les artefacts du stage builder vers le répertoire local
mkdir -p .next/standalone
mkdir -p .next/static
mkdir -p public

docker cp $CONTAINER_ID:/app/.next/standalone ./.next/
docker cp $CONTAINER_ID:/app/.next/static ./.next/
docker cp $CONTAINER_ID:/app/public ./public

# Nettoyer
docker rm $CONTAINER_ID
docker rmi aether-identity-builder

echo "Les artefacts ont été copiés avec succès dans le répertoire local."
