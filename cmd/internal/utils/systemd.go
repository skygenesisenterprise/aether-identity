package utils

import (
	"fmt"
	"os/exec"
	"strings"
)

// SystemdManager gère les interactions avec systemd
type SystemdManager struct{}

// NewSystemdManager crée un nouveau gestionnaire systemd
func NewSystemdManager() *SystemdManager {
	return &SystemdManager{}
}

// ListServices liste tous les services systemd
func (sm *SystemdManager) ListServices() ([]string, error) {
	cmd := exec.Command("systemctl", "list-units", "--type=service", "--no-pager")
	output, err := cmd.Output()
	if err != nil {
		return nil, fmt.Errorf("erreur lors de la liste des services: %w", err)
	}

	var services []string
	lines := strings.Split(string(output), "\n")
	for _, line := range lines {
		if strings.Contains(line, ".service") && !strings.HasPrefix(line, "UNIT") {
			parts := strings.Fields(line)
			if len(parts) > 0 {
				serviceName := strings.TrimSuffix(parts[0], ".service")
				services = append(services, serviceName)
			}
		}
	}
	return services, nil
}

// GetServiceStatus obtient le statut d'un service
func (sm *SystemdManager) GetServiceStatus(service string) (string, error) {
	cmd := exec.Command("systemctl", "is-active", service)
	output, err := cmd.Output()
	if err != nil {
		return "inactive", nil
	}
	return strings.TrimSpace(string(output)), nil
}

// StartService démarre un service
func (sm *SystemdManager) StartService(service string) error {
	cmd := exec.Command("systemctl", "start", service)
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("erreur lors du démarrage du service %s: %w", service, err)
	}
	return nil
}

// StopService arrête un service
func (sm *SystemdManager) StopService(service string) error {
	cmd := exec.Command("systemctl", "stop", service)
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("erreur lors de l'arrêt du service %s: %w", service, err)
	}
	return nil
}

// RestartService redémarre un service
func (sm *SystemdManager) RestartService(service string) error {
	cmd := exec.Command("systemctl", "restart", service)
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("erreur lors du redémarrage du service %s: %w", service, err)
	}
	return nil
}

// EnableService active un service au démarrage
func (sm *SystemdManager) EnableService(service string) error {
	cmd := exec.Command("systemctl", "enable", service)
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("erreur lors de l'activation du service %s: %w", service, err)
	}
	return nil
}

// DisableService désactive un service au démarrage
func (sm *SystemdManager) DisableService(service string) error {
	cmd := exec.Command("systemctl", "disable", service)
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("erreur lors de la désactivation du service %s: %w", service, err)
	}
	return nil
}

// IsServiceEnabled vérifie si un service est activé
func (sm *SystemdManager) IsServiceEnabled(service string) (bool, error) {
	cmd := exec.Command("systemctl", "is-enabled", service)
	output, err := cmd.Output()
	if err != nil {
		return false, nil
	}
	return strings.TrimSpace(string(output)) == "enabled", nil
}
