package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"

	"github.com/skygenesisenterprise/aether-identity/package/cli/cmd/agent"
	"github.com/skygenesisenterprise/aether-identity/package/cli/cmd/eid"
	"github.com/skygenesisenterprise/aether-identity/package/cli/cmd/machine"
	"github.com/skygenesisenterprise/aether-identity/package/cli/cmd/run"
	"github.com/skygenesisenterprise/aether-identity/package/cli/internal/config"
	"github.com/skygenesisenterprise/aether-identity/package/cli/internal/output"
)

var (
	cfgFile      string
	outputFormat string
	cfg          *config.Config
	formatter    output.Formatter
)

func init() {
	cobra.OnInitialize(initConfig)
}

func initConfig() {
	var err error
	cfg, err = config.Load()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading config: %v\n", err)
		os.Exit(1)
	}

	if cfgFile != "" {
		viper.SetConfigFile(cfgFile)
	}

	if err := cfg.Validate(); err != nil {
		fmt.Fprintf(os.Stderr, "Invalid config: %v\n", err)
		os.Exit(1)
	}

	formatter = output.NewFormatter(outputFormat)
}

var rootCmd = &cobra.Command{
	Use:   "identity",
	Short: "Aether Identity CLI - Multi-role identity orchestrator",
	Long: `Aether Identity is a multi-role identity actor that supports:
  
  Human → Machine (H2M): Authentication for users
  Machine → Machine (M2M): Service-to-service identity
  Device / Agent: Hardware bridge and monitoring
  Runtime / Container: Credential injection and renewal`,
	Version: "1.0.0",
	PersistentPreRun: func(cmd *cobra.Command, args []string) {
		formatter = output.NewFormatter(outputFormat)
	},
}

func Execute() error {
	return rootCmd.Execute()
}

func NewRootCommand() *cobra.Command {
	return rootCmd
}

func init() {
	rootCmd.PersistentFlags().StringVar(&cfgFile, "config", "", "config file (default is $HOME/.aether/config.yaml)")
	rootCmd.PersistentFlags().StringVarP(&outputFormat, "output", "o", "text", "output format: text|json")

	if err := viper.BindPFlag("output", rootCmd.PersistentFlags().Lookup("output")); err != nil {
		fmt.Fprintf(os.Stderr, "Error binding flag: %v\n", err)
	}

	rootCmd.AddCommand(eid.NewCommands(output.NewFormatter))
	rootCmd.AddCommand(machine.NewCommands(output.NewFormatter))
	rootCmd.AddCommand(agent.NewCommands(output.NewFormatter))
	runCmd := run.NewCommands(output.NewFormatter)
	rootCmd.AddCommand(runCmd)
}
