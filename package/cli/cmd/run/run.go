package run

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/spf13/cobra"

	"github.com/skygenesisenterprise/aether-identity/package/cli/internal/runtime"
	"github.com/skygenesisenterprise/aether-identity/package/cli/internal/session"
)

var (
	renewInterval time.Duration
	tokenEnvVar   string
	outputFormat  string
	formatter     Formatter
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

var runCmd = &cobra.Command{
	Use:   "run -- <command>",
	Short: "Run a command with injected credentials",
	Long: `Run a command as a security sidecar with automatic credential injection and renewal.
Designed for Docker, CI, and Kubernetes environments.`,
	Example: `  identity run -- npm test
  identity run -- ./deploy.sh
  identity run --renew-interval 30m -- ./long-running-job.sh`,
	DisableFlagsInUseLine: true,
	Run: func(cmd *cobra.Command, args []string) {
		if len(args) == 0 {
			formatter.Errorf("No command provided. Use -- to separate command from flags")
			return
		}

		sessionMgr, err := session.NewManager()
		if err != nil {
			formatter.Errorf("Failed to initialize session manager: %v", err)
			os.Exit(1)
		}

		token, err := getAuthToken(sessionMgr)
		if err != nil {
			formatter.Errorf("Failed to get authentication token: %v", err)
			os.Exit(1)
		}

		runner := runtime.NewRunner(tokenEnvVar)
		ctx := context.Background()

		var renewFunc func() (string, error)
		if renewInterval > 0 {
			renewFunc = func() (string, error) {
				return getAuthToken(sessionMgr)
			}
		}

		if err := runner.Run(ctx, token, args, renewInterval, renewFunc); err != nil {
			formatter.Errorf("Command failed: %v", err)
			os.Exit(1)
		}
	},
}

func init() {
	runCmd.Flags().DurationVarP(&renewInterval, "renew-interval", "r", 0, "token renewal interval (e.g., 30m, 1h)")
	runCmd.Flags().StringVarP(&tokenEnvVar, "token-env", "t", "AETHER_IDENTITY_TOKEN", "environment variable name for token injection")
	runCmd.Flags().StringVarP(&outputFormat, "output", "o", "text", "output format: text|json")
}

func NewCommands(formatterProvider func(string) Formatter) *cobra.Command {
	formatter = formatterProvider(outputFormat)
	return runCmd
}

func getAuthToken(mgr *session.Manager) (string, error) {
	humanSession, err := mgr.GetHumanSession()
	if err != nil {
		return "", err
	}

	if humanSession != nil && humanSession.Token != "" {
		return humanSession.Token, nil
	}

	machineIdentity, err := mgr.GetMachineIdentity()
	if err != nil {
		return "", err
	}

	if machineIdentity != nil {
		return "machine-token-" + machineIdentity.ID, nil
	}

	return "", fmt.Errorf("no valid authentication found. Run 'identity login' or 'identity machine enroll' first")
}
