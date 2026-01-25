package vaultctl

import (
	"fmt"

	"github.com/skygenesisenterprise/aether-vault/cmd/internal/banner"
	"github.com/skygenesisenterprise/aether-vault/cmd/internal/context"
	"github.com/skygenesisenterprise/aether-vault/cmd/internal/menu"
)

func runInteractiveMode(ctx *context.Context) error {
	// Afficher le banner OPNsense-style
	if err := banner.DisplayWelcome(); err != nil {
		return fmt.Errorf("erreur lors de l'affichage du banner: %w", err)
	}

	// Créer et lancer le menu principal
	menuManager := menu.NewManager(ctx)
	return menuManager.RunMainMenu()
}
