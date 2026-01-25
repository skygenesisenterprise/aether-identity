package vaultctl

import (
	"github.com/skygenesisenterprise/aether-vault/cmd/internal/context"
	"github.com/spf13/cobra"
)

// Execute lance la commande principale
func Execute(ctx *context.Context) error {
	rootCmd := NewRootCommand(ctx)
	return rootCmd.Execute()
}

// NewRootCommand crée la commande racine
func NewRootCommand(ctx *context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "vaultctl",
		Short: "Aether Vault Console",
		Long:  `Console système interactive pour Aether Vault`,
		RunE: func(cmd *cobra.Command, args []string) error {
			return runInteractiveMode(ctx)
		},
	}

	// Ajouter les sous-commandes
	cmd.AddCommand(newVersionCommand())
	cmd.AddCommand(newStatusCommand(ctx))
	cmd.AddCommand(newServiceCommand(ctx))
	cmd.AddCommand(newNetworkCommand(ctx))
	cmd.AddCommand(newSecurityCommand(ctx))
	cmd.AddCommand(newMaintenanceCommand(ctx))

	return cmd
}
