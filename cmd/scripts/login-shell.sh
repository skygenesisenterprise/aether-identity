#!/bin/bash

# Aether Vault Shell Wrapper
# Ce script remplace le shell par défaut pour afficher le menu système

# Chemin vers le binaire vaultctl
VAULTCTL_BIN="/usr/local/bin/vaultctl"

# Vérifier si vaultctl est installé
if [ ! -f "$VAULTCTL_BIN" ]; then
    echo "Erreur: vaultctl n'est pas installé"
    echo "Utilisation du shell par défaut..."
    exec /bin/bash
fi

# Afficher le menu principal
$VAULTCTL_BIN

# Si vaultctl se termine, offrir un shell standard
echo ""
echo "Appuyez sur Entrée pour lancer un shell standard..."
read -r
exec /bin/bash