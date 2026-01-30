package cmd

import (
	"github.com/spf13/cobra"

	"github.com/skygenesisenterprise/aether-identity/package/cli/internal/session"
)

var logoutCmd = &cobra.Command{
	Use:   "logout",
	Short: "End your current session",
	Long: `Terminate your current authentication session.
Removes stored credentials from local storage.`,
	Run: func(cmd *cobra.Command, args []string) {
		sessionMgr, err := session.NewManager()
		if err != nil {
			formatter.Errorf("Failed to initialize session manager: %v", err)
			return
		}

		if err := sessionMgr.DeleteHumanSession(); err != nil {
			formatter.Errorf("Failed to logout: %v", err)
			return
		}

		formatter.Successf("Successfully logged out")
	},
}

func init() {
	rootCmd.AddCommand(logoutCmd)
}
