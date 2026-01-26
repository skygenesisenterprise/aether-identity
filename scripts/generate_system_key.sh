#!/bin/bash

# Script pour générer une clé système sécurisée pour Aether Identity
# La clé système est utilisée par l'application web pour authentifier les requêtes internes
# Format : sk_ + 15 caractères aléatoires (basé sur 32 bits)

# Générer une clé aléatoire de 15 caractères (basée sur 32 bits)
# Utilisation de caractères alphanumériques (a-z, A-Z, 0-9) pour une meilleure sécurité
SYSTEM_KEY="sk_$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 15)"

echo "Clé système générée : $SYSTEM_KEY"
echo ""
echo "Vérification : La clé a bien 15 caractères après le préfixe"
echo "Longueur totale : ${#SYSTEM_KEY} caractères"
echo "Caractères après préfixe : $(echo ${SYSTEM_KEY#sk_} | wc -c) (sans le caractère de nouvelle ligne)"
echo ""
echo "Ajoutez cette clé à votre fichier .env :"
echo "SYSTEM_KEY=$SYSTEM_KEY"
