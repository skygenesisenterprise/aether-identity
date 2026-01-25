package services

import (
	"fmt"
	"os/exec"
	"strings"

	"github.com/skygenesisenterprise/aether-vault/cmd/internal/context"
	"github.com/skygenesisenterprise/aether-vault/cmd/internal/menu/types"
	"github.com/skygenesisenterprise/aether-vault/cmd/internal/ui/theme"
)

// ListServicesAction liste tous les services système
type ListServicesAction struct{}

func NewListServicesAction() *ListServicesAction {
	return &ListServicesAction{}
}

func (a *ListServicesAction) Name() string {
	return "services-list"
}

func (a *ListServicesAction) Description() string {
	return "Liste tous les services systemd"
}

func (a *ListServicesAction) Execute(ctx interface{}, args []string) error {
	colors := theme.GetColors()

	fmt.Print("\033[H\033[2J")

	// Obtenir la liste des services
	cmd := exec.Command("systemctl", "list-units", "--type=service", "--no-pager", "--all")
	output, err := cmd.Output()
	if err != nil {
		return fmt.Errorf("erreur lors de la récupération des services: %w", err)
	}

	fmt.Printf(`
%s┌─ SERVICES SYSTÈME ────────────────────────────────────────────┐
│                                                              │
`,
		colors.Header,
	)

	lines := strings.Split(string(output), "\n")
	serviceCount := 0

	for i, line := range lines {
		if i == 0 || strings.TrimSpace(line) == "" {
			continue // Skip header and empty lines
		}

		// Parser les colonnes
		fields := strings.Fields(line)
		if len(fields) >= 4 {
			serviceName := fields[0]
			load := fields[1]
			active := fields[2]
			sub := fields[3]
			description := ""

			if len(fields) > 4 {
				description = strings.Join(fields[4:], " ")
			}

			// Déterminer le statut avec couleur
			statusColor := colors.Error // Rouge par défaut
			statusSymbol := "✗"

			if active == "active" {
				statusColor = colors.Success
				statusSymbol = "✓"
			} else if active == "inactive" {
				statusColor = colors.Warning
				statusSymbol = "○"
			}

			// Limiter la description
			if len(description) > 50 {
				description = description[:47] + "..."
			}

			fmt.Printf("│  %s%s%s  %s%-30s%s  %s%-8s%s  %-30s  │\n",
				statusColor, statusSymbol, colors.Reset,
				colors.Info, serviceName, colors.Reset,
				statusColor, active, colors.Reset,
				description,
			)

			serviceCount++
			if serviceCount >= 15 { // Limiter l'affichage
				fmt.Printf("│  %s... %d autres services affichés avec 'systemctl list-units'%s  │\n",
					colors.Info, len(lines)-serviceCount, colors.Reset)
				break
			}
		}
	}

	fmt.Printf(`
│                                                              │
│  Total: %s%d services affichés%s                                │
└──────────────────────────────────────────────────────────────┘%s

`,
		colors.Info, serviceCount, colors.Reset,
		colors.Reset,
	)

	return nil
}

func (a *ListServicesAction) Validate(args []string) error {
	return nil
}

func (a *ListServicesAction) RequiresAuth() bool {
	return false
}

// StartServiceAction démarre un service
type StartServiceAction struct{}

func NewStartServiceAction() *StartServiceAction {
	return &StartServiceAction{}
}

func (a *StartServiceAction) Name() string {
	return "service-start"
}

func (a *StartServiceAction) Description() string {
	return "Démarre un service spécifique"
}

func (a *StartServiceAction) Execute(ctx interface{}, args []string) error {
	if len(args) < 1 {
		return fmt.Errorf("usage: service-start <nom-du-service>")
	}

	serviceName := args[0]
	colors := theme.GetColors()

	fmt.Printf("Démarrage du service %s%s%s...\n", colors.Info, serviceName, colors.Reset)

	cmd := exec.Command("systemctl", "start", serviceName)
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("erreur lors du démarrage du service %s: %w", serviceName, err)
	}

	// Vérifier le statut
	statusCmd := exec.Command("systemctl", "is-active", serviceName)
	status, _ := statusCmd.Output()

	fmt.Printf("✓ Service %s%s%s %sactif%s\n",
		colors.Info, serviceName, colors.Reset,
		colors.Success, colors.Reset)
	fmt.Printf("  Statut: %s%s%s\n", colors.Info, strings.TrimSpace(string(status)), colors.Reset)

	return nil
}

func (a *StartServiceAction) Validate(args []string) error {
	if len(args) < 1 {
		return fmt.Errorf("nom du service requis")
	}
	return nil
}

func (a *StartServiceAction) RequiresAuth() bool {
	return true
}

// StopServiceAction arrête un service
type StopServiceAction struct{}

func NewStopServiceAction() *StopServiceAction {
	return &StopServiceAction{}
}

func (a *StopServiceAction) Name() string {
	return "service-stop"
}

func (a *StopServiceAction) Description() string {
	return "Arrête un service spécifique"
}

func (a *StopServiceAction) Execute(ctx interface{}, args []string) error {
	if len(args) < 1 {
		return fmt.Errorf("usage: service-stop <nom-du-service>")
	}

	serviceName := args[0]
	colors := theme.GetColors()

	fmt.Printf("Arrêt du service %s%s%s...\n", colors.Info, serviceName, colors.Reset)

	cmd := exec.Command("systemctl", "stop", serviceName)
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("erreur lors de l'arrêt du service %s: %w", serviceName, err)
	}

	// Vérifier le statut
	statusCmd := exec.Command("systemctl", "is-active", serviceName)
	status, _ := statusCmd.Output()

	fmt.Printf("✓ Service %s%s%s %sinactif%s\n",
		colors.Info, serviceName, colors.Reset,
		colors.Warning, colors.Reset)
	fmt.Printf("  Statut: %s%s%s\n", colors.Info, strings.TrimSpace(string(status)), colors.Reset)

	return nil
}

func (a *StopServiceAction) Validate(args []string) error {
	if len(args) < 1 {
		return fmt.Errorf("nom du service requis")
	}
	return nil
}

func (a *StopServiceAction) RequiresAuth() bool {
	return true
}

// RestartServiceAction redémarre un service
type RestartServiceAction struct{}

func NewRestartServiceAction() *RestartServiceAction {
	return &RestartServiceAction{}
}

func (a *RestartServiceAction) Name() string {
	return "service-restart"
}

func (a *RestartServiceAction) Description() string {
	return "Redémarre un service spécifique"
}

func (a *RestartServiceAction) Execute(ctx interface{}, args []string) error {
	if len(args) < 1 {
		return fmt.Errorf("usage: service-restart <nom-du-service>")
	}

	serviceName := args[0]
	colors := theme.GetColors()

	fmt.Printf("Redémarrage du service %s%s%s...\n", colors.Info, serviceName, colors.Reset)

	cmd := exec.Command("systemctl", "restart", serviceName)
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("erreur lors du redémarrage du service %s: %w", serviceName, err)
	}

	// Vérifier le statut
	statusCmd := exec.Command("systemctl", "is-active", serviceName)
	status, _ := statusCmd.Output()

	fmt.Printf("✓ Service %s%s%s %sredémarré%s\n",
		colors.Info, serviceName, colors.Reset,
		colors.Success, colors.Reset)
	fmt.Printf("  Statut: %s%s%s\n", colors.Info, strings.TrimSpace(string(status)), colors.Reset)

	return nil
}

func (a *RestartServiceAction) Validate(args []string) error {
	if len(args) < 1 {
		return fmt.Errorf("nom du service requis")
	}
	return nil
}

func (a *RestartServiceAction) RequiresAuth() bool {
	return true
}

// ServiceStatusAction affiche le statut détaillé d'un service
type ServiceStatusAction struct{}

func NewServiceStatusAction() *ServiceStatusAction {
	return &ServiceStatusAction{}
}

func (a *ServiceStatusAction) Name() string {
	return "service-status"
}

func (a *ServiceStatusAction) Description() string {
	return "Affiche le statut détaillé d'un service"
}

func (a *ServiceStatusAction) Execute(ctx interface{}, args []string) error {
	if len(args) < 1 {
		return fmt.Errorf("usage: service-status <nom-du-service>")
	}

	serviceName := args[0]
	colors := theme.GetColors()

	fmt.Printf("\n%sStatut détaillé du service %s%s%s:%s\n\n",
		colors.Header, colors.Info, serviceName, colors.Reset, colors.Reset)

	cmd := exec.Command("systemctl", "status", "--no-pager", serviceName)
	cmd.Stdout = nil // Laisser stdout vers la console
	cmd.Stderr = nil // Laisser stderr vers la console

	if err := cmd.Run(); err != nil {
		// systemctl status retourne souvent un code non-zero même si tout va bien
		// Donc on ne traite pas l'erreur comme fatale
	}

	return nil
}

func (a *ServiceStatusAction) Validate(args []string) error {
	if len(args) < 1 {
		return fmt.Errorf("nom du service requis")
	}
	return nil
}

func (a *ServiceStatusAction) RequiresAuth() bool {
	return false
}
