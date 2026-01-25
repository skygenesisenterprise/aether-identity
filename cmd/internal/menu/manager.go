package menu

import (
	"bufio"
	"fmt"
	"os"
	"os/exec"
	"strconv"
	"strings"

	"github.com/skygenesisenterprise/aether-vault/cmd/internal/context"
	"github.com/skygenesisenterprise/aether-vault/cmd/internal/ui/theme"
)

// Manager gère les menus interactifs
type Manager struct {
	ctx    *context.Context
	reader *bufio.Reader
	colors *theme.Colors
}

// NewManager crée un nouveau gestionnaire de menus
func NewManager(ctx *context.Context) *Manager {
	return &Manager{
		ctx:    ctx,
		reader: bufio.NewReader(os.Stdin),
		colors: theme.GetColors(),
	}
}

// RunMainMenu lance le menu principal
func (m *Manager) RunMainMenu() error {
	for {
		if err := m.displayMainMenu(); err != nil {
			return err
		}

		choice, err := m.getUserInput()
		if err != nil {
			return err
		}

		if err := m.handleMainMenuChoice(choice); err != nil {
			fmt.Printf("%sErreur: %v%s\n", m.colors.Error, err, m.colors.Reset)
			fmt.Println("Appuyez sur Entrée pour continuer...")
			m.reader.ReadString('\n')
		}

		if choice == "0" {
			break
		}
	}
	return nil
}

func (m *Manager) displayMainMenu() error {
	fmt.Printf(`
  0) Logout                              7) Ping host
  1) Assign interfaces                   8) Shell
  2) Set interface IP address            9) Vault status
  3) Reset root password                10) Logs
  4) Reset to factory defaults          11) Reload all services
  5) Power off system                   12) Update from console
  6) Reboot system                      13) Restore a backup

`)

	fmt.Printf("Enter an option: ")
	return nil
}

func (m *Manager) getUserInput() (string, error) {
	input, err := m.reader.ReadString('\n')
	if err != nil {
		return "", err
	}
	return strings.TrimSpace(input), nil
}

func (m *Manager) handleMainMenuChoice(choice string) error {
	switch choice {
	case "0":
		fmt.Println("\nLogout...")
		return nil
	case "1":
		return m.showInterfacesMenu()
	case "2":
		return m.showIPConfigMenu()
	case "3":
		return m.showResetPasswordMenu()
	case "4":
		return m.showFactoryResetMenu()
	case "5":
		return m.showPowerOffMenu()
	case "6":
		return m.showRebootMenu()
	case "7":
		return m.showPingMenu()
	case "8":
		return m.openSecureShell()
	case "9":
		return m.showVaultStatus()
	case "10":
		return m.showLogsMenu()
	case "11":
		return m.showReloadServicesMenu()
	case "12":
		return m.showUpdateMenu()
	case "13":
		return m.showRestoreBackupMenu()
	default:
		return fmt.Errorf("invalid option: %s", choice)
	}
}

func (m *Manager) showSystemStatus() error {
	return nil // Implémenté plus tard
}

func (m *Manager) showServicesMenu() error {
	fmt.Printf(`
%s┌─ SERVICES ────────────────────────────────────────────────────┐
│  %s1.%s Lister les services                                       │
│  %s2.%s Démarrer un service                                       │
│  %s3.%s Arrêter un service                                        │
│  %s4.%s Redémarrer un service                                    │
│  %s5.%s Voir les logs d'un service                               │
│                                                              │
│  %s0.%s Retour au menu principal                                 │
└─────────────────────────────────────────────────────────────────┘%s

`,
		m.colors.Header,
		m.colors.Info, m.colors.Reset,
		m.colors.Info, m.colors.Reset,
		m.colors.Info, m.colors.Reset,
		m.colors.Info, m.colors.Reset,
		m.colors.Info, m.colors.Reset,
		m.colors.Warning, m.colors.Reset,
		m.colors.Reset,
	)
	return nil
}

func (m *Manager) showNetworkMenu() error {
	fmt.Printf(`
%s┌─ RÉSEAU ───────────────────────────────────────────────────────┐
│  %s1.%s Interfaces réseau                                         │
│  %s2.%s Configuration IP                                          │
│  %s3.%s Firewall                                                  │
│  %s4.%s Diagnostics réseau                                        │
│                                                              │
│  %s0.%s Retour au menu principal                                 │
└─────────────────────────────────────────────────────────────────┘%s

`,
		m.colors.Header,
		m.colors.Info, m.colors.Reset,
		m.colors.Info, m.colors.Reset,
		m.colors.Info, m.colors.Reset,
		m.colors.Info, m.colors.Reset,
		m.colors.Warning, m.colors.Reset,
		m.colors.Reset,
	)
	return nil
}

func (m *Manager) showSecurityMenu() error {
	fmt.Printf(`
%s┌─ SÉCURITÉ ─────────────────────────────────────────────────────┐
│  %s1.%s Utilisateurs locaux                                        │
│  %s2.%s Certificats SSL/TLS                                       │
│  %s3.%s Logs d'audit                                              │
│  %s4.%s Politiques de sécurité                                    │
│                                                              │
│  %s0.%s Retour au menu principal                                 │
└─────────────────────────────────────────────────────────────────┘%s

`,
		m.colors.Header,
		m.colors.Info, m.colors.Reset,
		m.colors.Info, m.colors.Reset,
		m.colors.Info, m.colors.Reset,
		m.colors.Info, m.colors.Reset,
		m.colors.Warning, m.colors.Reset,
		m.colors.Reset,
	)
	return nil
}

func (m *Manager) showMaintenanceMenu() error {
	fmt.Printf(`
%s┌─ MAINTENANCE ──────────────────────────────────────────────────┐
│  %s1.%s Sauvegarder le système                                     │
│  %s2.%s Restaurer une sauvegarde                                  │
│  %s3.%s Mettre à jour le système                                   │
│  %s4.%s Nettoyage du disque                                       │
│  %s5.%s Vérifier l'intégrité                                      │
│                                                              │
│  %s0.%s Retour au menu principal                                 │
└─────────────────────────────────────────────────────────────────┘%s

`,
		m.colors.Header,
		m.colors.Info, m.colors.Reset,
		m.colors.Info, m.colors.Reset,
		m.colors.Info, m.colors.Reset,
		m.colors.Info, m.colors.Reset,
		m.colors.Info, m.colors.Reset,
		m.colors.Warning, m.colors.Reset,
		m.colors.Reset,
	)
	return nil
}

func (m *Manager) showVaultMenu() error {
	fmt.Printf(`
%s┌─ VAULT CORE ───────────────────────────────────────────────────┐
│  %s1.%s État de Vault                                              │
│  %s2.%s Sceller / Désceller                                        │
│  %s3.%s Gérer les tokens                                           │
│  %s4.%s Configuration Vault                                        │
│                                                              │
│  %s0.%s Retour au menu principal                                 │
└─────────────────────────────────────────────────────────────────┘%s

`,
		m.colors.Header,
		m.colors.Info, m.colors.Reset,
		m.colors.Info, m.colors.Reset,
		m.colors.Info, m.colors.Reset,
		m.colors.Info, m.colors.Reset,
		m.colors.Warning, m.colors.Reset,
		m.colors.Reset,
	)
	return nil
}

func (m *Manager) showLogsMenu() error {
	fmt.Printf(`
%s┌─ JOURNAUX ──────────────────────────────────────────────────────┐
│  %s1.%s Logs système                                               │
│  %s2.%s Logs Vault Core                                            │
│  %s3.%s Logs d'audit                                               │
│  %s4.%s Logs en temps réel                                         │
│                                                              │
│  %s0.%s Retour au menu principal                                 │
└─────────────────────────────────────────────────────────────────┘%s

`,
		m.colors.Header,
		m.colors.Info, m.colors.Reset,
		m.colors.Info, m.colors.Reset,
		m.colors.Info, m.colors.Reset,
		m.colors.Info, m.colors.Reset,
		m.colors.Warning, m.colors.Reset,
		m.colors.Reset,
	)
	return nil
}

func (m *Manager) openSecureShell() error {
	fmt.Println("Launching shell...")
	// Lancer un bash interactif
	cmd := exec.Command("/bin/bash")
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}
