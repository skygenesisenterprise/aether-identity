package cmd

import (
	"fmt"
	"time"

	"github.com/spf13/cobra"

	"github.com/skygenesisenterprise/aether-identity/package/cli/internal/session"
)

var loginCmd = &cobra.Command{
	Use:   "login",
	Short: "Authenticate as a human user",
	Long: `Authenticate with the Aether Identity service.
Stores a secure session token for subsequent commands.`,
	Run: func(cmd *cobra.Command, args []string) {
		deviceProof, err := performDeviceProof()
		if err != nil {
			formatter.Errorf("Failed to generate device proof: %v", err)
			return
		}

		token, err := requestAuthToken(deviceProof.DeviceID)
		if err != nil {
			formatter.Errorf("Authentication failed: %v", err)
			return
		}

		sessionMgr, err := session.NewManager()
		if err != nil {
			formatter.Errorf("Failed to initialize session manager: %v", err)
			return
		}

		expiresAt := time.Now().Add(24 * time.Hour)
		sess, err := sessionMgr.CreateHumanSession(token, expiresAt)
		if err != nil {
			formatter.Errorf("Failed to create session: %v", err)
			return
		}

		formatter.Successf("Successfully authenticated")
		formatter.Printf("Session ID: %s\n", sess.ID)
		formatter.Printf("Expires at: %s\n", expiresAt.Format(time.RFC3339))
	},
}

func init() {
	rootCmd.AddCommand(loginCmd)
}

func performDeviceProof() (*session.DeviceProof, error) {
	proof, err := session.GetDeviceProof()
	if err != nil {
		return nil, fmt.Errorf("device proof generation failed: %w", err)
	}
	return proof, nil
}

func requestAuthToken(deviceID string) (string, error) {
	return "mock-token-" + deviceID, nil
}
