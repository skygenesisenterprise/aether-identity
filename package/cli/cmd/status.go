package cmd

import (
	"time"

	"github.com/spf13/cobra"

	"github.com/skygenesisenterprise/aether-identity/package/cli/internal/session"
)

var statusCmd = &cobra.Command{
	Use:   "status",
	Short: "Display current authentication status",
	Long: `Show the status of your current identity session.
This includes session information and expiration time.`,
	Run: func(cmd *cobra.Command, args []string) {
		sessionMgr, err := session.NewManager()
		if err != nil {
			formatter.Errorf("Failed to initialize session manager: %v", err)
			return
		}

		showHumanStatus(sessionMgr)
		showMachineStatus(sessionMgr)
	},
}

func init() {
	rootCmd.AddCommand(statusCmd)
}

func showHumanStatus(mgr *session.Manager) {
	sess, err := mgr.GetHumanSession()
	if err != nil {
		formatter.Errorf("Failed to retrieve session: %v", err)
		return
	}

	if sess == nil {
		formatter.Printf("Human session: Not authenticated\n")
		return
	}

	formatter.Printf("Human session: Active\n")
	formatter.Printf("  Session ID: %s\n", sess.ID)
	formatter.Printf("  Created: %s\n", sess.CreatedAt.Format(time.RFC3339))

	if !sess.ExpiresAt.IsZero() {
		remaining := time.Until(sess.ExpiresAt)
		if remaining > 0 {
			formatter.Printf("  Expires: %s (in %s)\n", sess.ExpiresAt.Format(time.RFC3339), remaining.Round(time.Minute))
		} else {
			formatter.Printf("  Expires: %s (expired)\n", sess.ExpiresAt.Format(time.RFC3339))
		}
	}
}

func showMachineStatus(mgr *session.Manager) {
	identity, err := mgr.GetMachineIdentity()
	if err != nil {
		formatter.Errorf("Failed to retrieve machine identity: %v", err)
		return
	}

	if identity == nil {
		formatter.Printf("Machine identity: Not enrolled\n")
		return
	}

	formatter.Printf("Machine identity: Enrolled\n")
	formatter.Printf("  Identity ID: %s\n", identity.ID)
	formatter.Printf("  Created: %s\n", identity.Created.Format(time.RFC3339))
	formatter.Printf("  Public key: %s\n", identity.Public[:50]+"...")
}
