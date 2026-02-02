#!/bin/bash

# Script de génération de clé système pour Aether Identity
# Cette clé est utilisée uniquement en interne par le serveur
# pour authentifier les requêtes provenant de l'application web (@app/)
#
# Usage: ./generate_system_key.sh [options]
# Options:
#   --env-file <path>  : Écrire la clé dans le fichier spécifié
#   --overwrite        : Remplacer la clé existante dans le fichier
#   --print            : Afficher la clé à l'écran (par défaut)

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
ENV_FILE=""
OVERWRITE=false
PRINT_ONLY=true

# Fonction pour afficher l'aide
show_help() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --env-file <path>  Écrire la clé dans le fichier .env spécifié"
    echo "  --overwrite        Remplacer la clé SYSTEM_KEY existante"
    echo "  --print            Afficher la clé à l'écran (par défaut)"
    echo "  -h, --help         Afficher cette aide"
    echo ""
    echo "Exemples:"
    echo "  $0                                    # Générer et afficher"
    echo "  $0 --env-file .env                    # Générer et ajouter au .env"
    echo "  $0 --env-file .env --overwrite        # Remplacer la clé existante"
    exit 0
}

# Parsing des arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --env-file)
            ENV_FILE="$2"
            PRINT_ONLY=false
            shift 2
            ;;
        --overwrite)
            OVERWRITE=true
            shift
            ;;
        --print)
            PRINT_ONLY=true
            shift
            ;;
        -h|--help)
            show_help
            ;;
        *)
            echo "Option invalide: $1"
            show_help
            ;;
    esac
done

# Génération de la clé système (format: sk_<base64url_encoded_random_bytes>)
generate_system_key() {
    # Générer 32 bytes aléatoires cryptographiquement sécurisés
    local random_bytes
    random_bytes=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)
    
    # Encoder en base64 URL-safe (remplacer + et /, enlever le padding =)
    local encoded
    encoded=$(echo -n "$random_bytes" | tr '+/' '-_' | tr -d '=')
    
    # Extraire les 43 premiers caractères (32 bytes encodés = ~43 caractères base64)
    encoded="${encoded:0:43}"
    
    # Ajouter le préfixe
    echo "sk_${encoded}"
}

# Générer la clé
SYSTEM_KEY=$(generate_system_key)

if [ "$PRINT_ONLY" = true ]; then
    echo -e "${GREEN}Clé système générée avec succès:${NC}"
    echo ""
    echo -e "${YELLOW}$SYSTEM_KEY${NC}"
    echo ""
    echo -e "${RED}⚠️  IMPORTANT:${NC}"
    echo -e "   - Ne partagez jamais cette clé"
    echo -e "   - Ne la committez pas dans votre repository"
    echo -e "   - Utilisez-la uniquement pour la variable d'environnement SYSTEM_KEY"
    echo ""
    echo "Pour l'utiliser, ajoutez cette ligne à votre fichier .env :"
    echo ""
    echo "SYSTEM_KEY=$SYSTEM_KEY"
    exit 0
fi

# Écriture dans le fichier .env
if [ -n "$ENV_FILE" ]; then
    # Vérifier si le fichier existe
    if [ ! -f "$ENV_FILE" ]; then
        echo -e "${YELLOW}Le fichier $ENV_FILE n'existe pas. Création...${NC}"
        touch "$ENV_FILE"
    fi
    
    # Vérifier si SYSTEM_KEY existe déjà
    if grep -q "^SYSTEM_KEY=" "$ENV_FILE"; then
        if [ "$OVERWRITE" = true ]; then
            # Remplacer la clé existante
            sed -i.bak "s/^SYSTEM_KEY=.*/SYSTEM_KEY=$SYSTEM_KEY/" "$ENV_FILE" && rm -f "$ENV_FILE.bak"
            echo -e "${GREEN}✓ Clé système remplacée dans $ENV_FILE${NC}"
        else
            echo -e "${YELLOW}⚠️  Une clé SYSTEM_KEY existe déjà dans $ENV_FILE${NC}"
            echo -e "   Utilisez ${YELLOW}--overwrite${NC} pour la remplacer"
            echo ""
            echo "Clé existante: $(grep "^SYSTEM_KEY=" "$ENV_FILE" | cut -d'=' -f2)"
            echo "Nouvelle clé:  $SYSTEM_KEY"
            exit 1
        fi
    else
        # Ajouter la nouvelle clé
        echo "" >> "$ENV_FILE"
        echo "# System Key for internal app authentication" >> "$ENV_FILE"
        echo "SYSTEM_KEY=$SYSTEM_KEY" >> "$ENV_FILE"
        echo -e "${GREEN}✓ Clé système ajoutée à $ENV_FILE${NC}"
    fi
    
    echo ""
    echo -e "${RED}⚠️  IMPORTANT:${NC}"
    echo -e "   - Ne partagez jamais cette clé"
    echo -e "   - Ne committez pas le fichier .env dans votre repository"
    echo -e "   - Cette clé doit être utilisée uniquement par l'application web interne"
fi
