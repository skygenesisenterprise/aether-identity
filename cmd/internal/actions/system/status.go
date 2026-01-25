package system

import (
	"fmt"
	"os/exec"
	"runtime"
	"strconv"
	"strings"
	"time"

	"github.com/skygenesisenterprise/aether-vault/cmd/internal/context"
	"github.com/skygenesisenterprise/aether-vault/cmd/internal/menu/types"
	"github.com/skygenesisenterprise/aether-vault/cmd/internal/ui/theme"
)

// GetStatusAction récupère le statut du système
type GetStatusAction struct{}

func NewGetStatusAction() *GetStatusAction {
	return &GetStatusAction{}
}

func (a *GetStatusAction) Name() string {
	return "system-status"
}

func (a *GetStatusAction) Description() string {
	return "Affiche le statut complet du système"
}

func (a *GetStatusAction) Execute(ctx interface{}, args []string) error {
	context := ctx.(*context.Context)
	colors := theme.GetColors()

	// Nettoyer l'écran
	fmt.Print("\033[H\033[2J")

	// Afficher le statut système
	fmt.Printf(`
%s┌─ SYSTÈME STATUS ────────────────────────────────────────────────┐
│                                                              │
│  %sHostname:%s    %s%-20s%s                              │
│  %sPlatform:%s    %s%-20s%s                              │
│  %sArchitecture:%s %s%-20s%s                              │
│  %sKernel:%s      %s%-20s%s                              │
│  %sUptime:%s      %s%-20s%s                              │
│  %sLoad Average:%s %s%-20s%s                              │
│                                                              │
└──────────────────────────────────────────────────────────────┘%s

`,
		colors.Header,
		colors.Label, colors.Reset, colors.Info, getHostname(), colors.Reset,
		colors.Label, colors.Reset, colors.Info, runtime.GOOS, colors.Reset,
		colors.Label, colors.Reset, colors.Info, runtime.GOARCH, colors.Reset,
		colors.Label, colors.Reset, colors.Info, getKernelVersion(), colors.Reset,
		colors.Label, colors.Reset, colors.Info, getUptime(), colors.Reset,
		colors.Label, colors.Reset, colors.Info, getLoadAverage(), colors.Reset,
		colors.Reset,
	)

	// Afficher l'utilisation mémoire
	displayMemoryStatus()

	// Afficher l'utilisation disque
	displayDiskStatus()

	return nil
}

func (a *GetStatusAction) Validate(args []string) error {
	return nil
}

func (a *GetStatusAction) RequiresAuth() bool {
	return false
}

// ShutdownAction éteint le système
type ShutdownAction struct{}

func NewShutdownAction() *ShutdownAction {
	return &ShutdownAction{}
}

func (a *ShutdownAction) Name() string {
	return "system-shutdown"
}

func (a *ShutdownAction) Description() string {
	return "Éteint le système de manière sécurisée"
}

func (a *ShutdownAction) Execute(ctx interface{}, args []string) error {
	fmt.Println("Arrêt du système dans 10 secondes...")
	fmt.Println("Appuyez sur Ctrl+C pour annuler")

	// Compte à rebours
	for i := 10; i > 0; i-- {
		fmt.Printf("\rArrêt dans %d secondes... ", i)
		time.Sleep(1 * time.Second)
	}

	fmt.Println("\nArrêt du système...")
	cmd := exec.Command("shutdown", "now")
	return cmd.Run()
}

func (a *ShutdownAction) Validate(args []string) error {
	return nil
}

func (a *ShutdownAction) RequiresAuth() bool {
	return true
}

// RebootAction redémarre le système
type RebootAction struct{}

func NewRebootAction() *RebootAction {
	return &RebootAction{}
}

func (a *RebootAction) Name() string {
	return "system-reboot"
}

func (a *RebootAction) Description() string {
	return "Redémarre le système"
}

func (a *RebootAction) Execute(ctx interface{}, args []string) error {
	fmt.Println("Redémarrage du système dans 10 secondes...")
	fmt.Println("Appuyez sur Ctrl+C pour annuler")

	// Compte à rebours
	for i := 10; i > 0; i-- {
		fmt.Printf("\rRedémarrage dans %d secondes... ", i)
		time.Sleep(1 * time.Second)
	}

	fmt.Println("\nRedémarrage du système...")
	cmd := exec.Command("reboot")
	return cmd.Run()
}

func (a *RebootAction) Validate(args []string) error {
	return nil
}

func (a *RebootAction) RequiresAuth() bool {
	return true
}

func getHostname() string {
	if hostname, err := exec.Command("hostname").Output(); err == nil {
		return strings.TrimSpace(string(hostname))
	}
	return "unknown"
}

func getKernelVersion() string {
	if uname, err := exec.Command("uname", "-r").Output(); err == nil {
		return strings.TrimSpace(string(uname))
	}
	return "unknown"
}

func getUptime() string {
	if uptime, err := exec.Command("uptime", "-p").Output(); err == nil {
		uptimeStr := strings.TrimSpace(string(uptime))
		return strings.ReplaceAll(uptimeStr, "up ", "")
	}
	return "unknown"
}

func getLoadAverage() string {
	if load, err := exec.Command("cat", "/proc/loadavg").Output(); err == nil {
		parts := strings.Fields(string(load))
		if len(parts) >= 3 {
			return fmt.Sprintf("%s %s %s", parts[0], parts[1], parts[2])
		}
	}
	return "0.00 0.00 0.00"
}

func displayMemoryStatus() {
	colors := theme.GetColors()

	if meminfo, err := exec.Command("cat", "/proc/meminfo").Output(); err == nil {
		lines := strings.Split(string(meminfo), "\n")
		var total, available, used int64

		for _, line := range lines {
			fields := strings.Fields(line)
			if len(fields) >= 2 {
				switch fields[0] {
				case "MemTotal:":
					total, _ = strconv.ParseInt(fields[1], 10, 64)
				case "MemAvailable:":
					available, _ = strconv.ParseInt(fields[1], 10, 64)
				}
			}
		}

		used = total - available
		percent := float64(used) / float64(total) * 100

		fmt.Printf(`
%s┌─ MÉMOIRE ────────────────────────────────────────────────────┐
│  %sTotal:%s     %s%-15s%s  %sUtilisée:%s  %s%-10s%s  │
│  %sDisponible:%s %s%-15s%s  %sPourcent:%s  %s%-10.1f%s%s  │
└───────────────────────────────────────────────────────────────┘%s

`,
			colors.Header,
			colors.Label, colors.Reset, colors.Info, formatBytes(total), colors.Reset,
			colors.Label, colors.Reset, colors.Info, formatBytes(used), colors.Reset,
			colors.Label, colors.Reset, colors.Info, formatBytes(available), colors.Reset,
			colors.Label, colors.Reset, colors.Info, percent, "%", colors.Reset,
			colors.Reset,
		)
	}
}

func displayDiskStatus() {
	colors := theme.GetColors()

	if df, err := exec.Command("df", "-h", "/").Output(); err == nil {
		lines := strings.Split(string(df), "\n")
		if len(lines) >= 2 {
			fields := strings.Fields(lines[1])
			if len(fields) >= 6 {
				size := fields[1]
				used := fields[2]
				avail := fields[3]
				percent := fields[4]

				fmt.Printf(`
%s┌─ DISQUE ─────────────────────────────────────────────────────┐
│  %sTaille:%s     %s%-15s%s  %sUtilisé:%s  %s%-10s%s  │
│  %sDisponible:%s  %s%-15s%s  %sPourcent:%s  %s%-10s%s  │
└───────────────────────────────────────────────────────────────┘%s

`,
					colors.Header,
					colors.Label, colors.Reset, colors.Info, size, colors.Reset,
					colors.Label, colors.Reset, colors.Info, used, colors.Reset,
					colors.Label, colors.Reset, colors.Info, avail, colors.Reset,
					colors.Label, colors.Reset, colors.Info, percent, colors.Reset,
					colors.Reset,
				)
			}
		}
	}
}

func formatBytes(bytes int64) string {
	const unit = 1024
	if bytes < unit {
		return fmt.Sprintf("%d B", bytes)
	}
	div, exp := int64(unit), 0
	for n := bytes / unit; n >= unit; n /= unit {
		div *= unit
		exp++
	}
	return fmt.Sprintf("%.1f %ciB", float64(bytes)/float64(div), "KMGTPE"[exp])
}
