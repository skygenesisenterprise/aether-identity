package agent

import (
	"fmt"
	"net/http"

	"github.com/spf13/cobra"
)

var (
	bindAddr     string
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

var startCmd = &cobra.Command{
	Use:   "start",
	Short: "Start the agent daemon",
	Long: `Start the Aether Identity agent daemon.
Monitors hardware and exposes a local API for web apps.`,
	Run: func(cmd *cobra.Command, args []string) {
		if bindAddr == "" {
			bindAddr = "127.0.0.1:8080"
		}

		formatter.Printf("Starting Aether Identity agent daemon...\n")
		formatter.Printf("Listening on http://%s\n", bindAddr)
		formatter.Printf("Press Ctrl+C to stop\n")

		if err := startAgent(bindAddr); err != nil {
			formatter.Errorf("Agent failed: %v", err)
			return
		}
	},
}

var statusCmd = &cobra.Command{
	Use:   "status",
	Short: "Show agent status",
	Long:  `Display the status of the Aether Identity agent daemon.`,
	Run: func(cmd *cobra.Command, args []string) {
		running, err := checkAgentStatus(bindAddr)
		if err != nil {
			formatter.Errorf("Failed to check agent status: %v", err)
			return
		}

		if running {
			formatter.Successf("Agent is running")
			formatter.Printf("API endpoint: http://%s\n", bindAddr)
		} else {
			formatter.Printf("Agent is not running\n")
		}
	},
}

func init() {
	startCmd.Flags().StringVarP(&bindAddr, "bind", "b", "127.0.0.1:8080", "bind address for agent API")
	startCmd.Flags().StringVarP(&outputFormat, "output", "o", "text", "output format: text|json")

	statusCmd.Flags().StringVarP(&bindAddr, "bind", "b", "127.0.0.1:8080", "bind address for agent API")
	statusCmd.Flags().StringVarP(&outputFormat, "output", "o", "text", "output format: text|json")
}

func NewCommands(formatterProvider func(string) Formatter) []*cobra.Command {
	formatter = formatterProvider(outputFormat)
	return []*cobra.Command{startCmd, statusCmd}
}

func startAgent(addr string) error {
	mux := http.NewServeMux()

	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"status":"healthy"}`)
	})

	mux.HandleFunc("/device", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"device_id":"local-agent-001","status":"connected"}`)
	})

	if err := http.ListenAndServe(addr, mux); err != nil {
		return fmt.Errorf("server error: %w", err)
	}

	return nil
}

func checkAgentStatus(addr string) (bool, error) {
	client := &http.Client{}
	resp, err := client.Get(fmt.Sprintf("http://%s/health", addr))
	if err != nil {
		return false, nil
	}
	defer resp.Body.Close()
	return resp.StatusCode == http.StatusOK, nil
}
