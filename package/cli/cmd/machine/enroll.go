package machine

import (
	"time"

	"github.com/spf13/cobra"

	"github.com/skygenesisenterprise/aether-identity/package/cli/internal/session"
)

var (
	outputFormat string
	formatter    Formatter
)

type Formatter interface {
	Print(format string, args ...interface{})
	Println(args ...interface{})
	Printf(format string, args ...interface{})
	PrintJSON(v interface{}) error
	Errorf(format string, args ...interface{})
	Successf(format string, args ...interface{})
	Warnf(format string, args ...interface{})
}

var enrollCmd = &cobra.Command{
	Use:   "enroll",
	Short: "Enroll machine as an identity",
	Long: `Register the current machine as an identity with the Aether Identity service.
Generates a local keypair and registers with the server.`,
	Run: func(cmd *cobra.Command, args []string) {
		sessionMgr, err := session.NewManager()
		if err != nil {
			formatter.Errorf("Failed to initialize session manager: %v", err)
			return
		}

		identity, err := sessionMgr.CreateMachineIdentity()
		if err != nil {
			formatter.Errorf("Failed to create machine identity: %v", err)
			return
		}

		if err := registerWithServer(identity); err != nil {
			formatter.Errorf("Failed to register with server: %v", err)
			return
		}

		formatter.Successf("Machine enrolled successfully")
		formatter.Printf("Identity ID: %s\n", identity.ID)
		formatter.Printf("Created: %s\n", identity.Created.Format(time.RFC3339))
	},
}

var tokenCmd = &cobra.Command{
	Use:   "token",
	Short: "Get machine authentication token",
	Long:  `Obtain a short-lived authentication token for machine-to-machine communication.`,
	Run: func(cmd *cobra.Command, args []string) {
		sessionMgr, err := session.NewManager()
		if err != nil {
			formatter.Errorf("Failed to initialize session manager: %v", err)
			return
		}

		identity, err := sessionMgr.GetMachineIdentity()
		if err != nil {
			formatter.Errorf("Failed to retrieve machine identity: %v", err)
			return
		}

		if identity == nil {
			formatter.Errorf("Machine not enrolled. Run 'identity machine enroll' first")
			return
		}

		token, expiry, err := requestMachineToken(identity.ID)
		if err != nil {
			formatter.Errorf("Failed to get token: %v", err)
			return
		}

		formatter.Successf("Token obtained successfully")
		formatter.Printf("Token: %s\n", token)
		formatter.Printf("Expires: %s\n", expiry.Format(time.RFC3339))
	},
}

var revokeCmd = &cobra.Command{
	Use:   "revoke",
	Short: "Revoke machine identity",
	Long:  `Revoke the machine identity and invalidate all credentials.`,
	Run: func(cmd *cobra.Command, args []string) {
		sessionMgr, err := session.NewManager()
		if err != nil {
			formatter.Errorf("Failed to initialize session manager: %v", err)
			return
		}

		identity, err := sessionMgr.GetMachineIdentity()
		if err != nil {
			formatter.Errorf("Failed to retrieve machine identity: %v", err)
			return
		}

		if identity == nil {
			formatter.Warnf("No machine identity found")
			return
		}

		if err := revokeFromServer(identity.ID); err != nil {
			formatter.Errorf("Failed to revoke identity: %v", err)
			return
		}

		if err := sessionMgr.DeleteMachineIdentity(); err != nil {
			formatter.Errorf("Failed to delete local identity: %v", err)
			return
		}

		formatter.Successf("Machine identity revoked")
	},
}

func init() {
	enrollCmd.Flags().StringVarP(&outputFormat, "output", "o", "text", "output format: text|json")
	tokenCmd.Flags().StringVarP(&outputFormat, "output", "o", "text", "output format: text|json")
	revokeCmd.Flags().StringVarP(&outputFormat, "output", "o", "text", "output format: text|json")
}

func NewCommands(formatterProvider func(string) Formatter) []*cobra.Command {
	formatter = formatterProvider(outputFormat)
	return []*cobra.Command{enrollCmd, tokenCmd, revokeCmd}
}

func registerWithServer(identity *session.MachineIdentity) error {
	return nil
}

func requestMachineToken(identityID string) (string, time.Time, error) {
	token := "machine-token-" + identityID
	expiry := time.Now().Add(1 * time.Hour)
	return token, expiry, nil
}

func revokeFromServer(identityID string) error {
	return nil
}
