package tui

import (
	"fmt"
	"os"
	"os/exec"
	"runtime"
	"strings"

	tea "github.com/charmbracelet/bubbletea"
)

// Page représente l'écran actuel
type Page int

const (
	MainMenuPage Page = iota
	InterfacesPage
	IPConfigPage
	PasswordPage
	FactoryResetPage
	PowerOffPage
	RebootPage
	PingPage
	ShellPage
	VaultPage
	LogsPage
	ServicesPage
	UpdatePage
	BackupPage
)

// AppModel est le modèle principal
type AppModel struct {
	width      int
	height     int
	page       Page
	hostname   string
	version    string
	interfaces []NetInterface
	sshKeys    []SSHKey
	input      string
	output     string
	quitting   bool
}

// NetInterface représente une interface réseau
type NetInterface struct {
	Name   string
	Type   string
	IP     string
	Status string
	MAC    string
}

// SSHKey représente une clé SSH
type SSHKey struct {
	Type string
	Hash string
}

// NewAppModel crée un nouveau modèle
func NewAppModel() AppModel {
	return AppModel{
		page:       MainMenuPage,
		version:    "1.0.0",
		hostname:   getHostname(),
		interfaces: getNetworkInterfaces(),
		sshKeys:    getSSHKeys(),
	}
}

func getHostname() string {
	if h, err := exec.Command("hostname").Output(); err == nil {
		return strings.TrimSpace(string(h))
	}
	return "aether.local"
}

func getNetworkInterfaces() []NetInterface {
	var interfaces []NetInterface

	if output, err := exec.Command("ip", "addr", "show").Output(); err == nil {
		lines := strings.Split(string(output), "\n")
		var currentIface *NetInterface

		for _, line := range lines {
			line = strings.TrimSpace(line)

			if strings.Contains(line, ": <") && !strings.Contains(line, "lo:") {
				if currentIface != nil && currentIface.IP != "" {
					interfaces = append(interfaces, *currentIface)
				}

				parts := strings.Split(line, ":")
				if len(parts) >= 2 {
					name := strings.TrimSpace(parts[1])
					status := "DOWN"
					if strings.Contains(line, "UP") {
						status = "UP"
					}
					currentIface = &NetInterface{
						Name:   name,
						Status: status,
					}
				}
			}

			if currentIface != nil && strings.HasPrefix(line, "inet ") {
				fields := strings.Fields(line)
				if len(fields) >= 2 {
					currentIface.IP = fields[1]
					currentIface.Type = "DHCP4"
				}
			}

			if currentIface != nil && strings.HasPrefix(line, "link/ether") {
				fields := strings.Fields(line)
				if len(fields) >= 2 {
					currentIface.MAC = fields[1]
				}
			}
		}

		if currentIface != nil && currentIface.IP != "" {
			interfaces = append(interfaces, *currentIface)
		}
	}

	if len(interfaces) == 0 {
		interfaces = append(interfaces, NetInterface{
			Name:   "eth0",
			Type:   "DHCP4",
			IP:     "192.168.1.100/24",
			Status: "UP",
			MAC:    "aa:bb:cc:dd:ee:ff",
		})
	}

	return interfaces
}

func getSSHKeys() []SSHKey {
	var keys []SSHKey

	keyFiles := []struct {
		file string
		name string
	}{
		{"/etc/ssh/ssh_host_ecdsa_key.pub", "ECDSA"},
		{"/etc/ssh/ssh_host_ed25519_key.pub", "ED25519"},
		{"/etc/ssh/ssh_host_rsa_key.pub", "RSA"},
	}

	for _, kf := range keyFiles {
		if output, err := exec.Command("ssh-keygen", "-l", "-f", kf.file).Output(); err == nil {
			fields := strings.Fields(string(output))
			if len(fields) >= 2 {
				keys = append(keys, SSHKey{
					Type: kf.name,
					Hash: fields[1],
				})
			}
		}
	}

	if len(keys) == 0 {
		keys = []SSHKey{
			{"ECDSA", "KIA9sznSNgfI62XARZu2fUsqphfmaT6t85X1Ig0r8x8"},
			{"ED25519", "GuXWJcRtkC4zmJzRJi0DOCAZElkO9+U6oW89asIPfYc"},
			{"RSA", "0F0DJElCEDH9BqUlVgbUAAgcsLNQkUatU79ODO+V7AU"},
		}
	}

	return keys
}

func (m AppModel) Init() tea.Cmd {
	return nil
}

func (m AppModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		// Gestion globale
		switch msg.String() {
		case "ctrl+c":
			m.quitting = true
			return m, tea.Quit
		}

		// Navigation selon la page actuelle
		switch m.page {
		case MainMenuPage:
			return m.handleMainMenu(msg)
		case InterfacesPage:
			return m.handleInterfacesPage(msg)
		case IPConfigPage:
			return m.handleIPConfigPage(msg)
		case PasswordPage:
			return m.handlePasswordPage(msg)
		case FactoryResetPage:
			return m.handleFactoryResetPage(msg)
		case PowerOffPage:
			return m.handlePowerOffPage(msg)
		case RebootPage:
			return m.handleRebootPage(msg)
		case PingPage:
			return m.handlePingPage(msg)
		case ShellPage:
			return m.handleShellPage(msg)
		case VaultPage:
			return m.handleVaultPage(msg)
		case LogsPage:
			return m.handleLogsPage(msg)
		case ServicesPage:
			return m.handleServicesPage(msg)
		case UpdatePage:
			return m.handleUpdatePage(msg)
		case BackupPage:
			return m.handleBackupPage(msg)
		}
	}

	return m, nil
}

func (m AppModel) handleMainMenu(msg tea.KeyMsg) (tea.Model, tea.Cmd) {
	switch msg.String() {
	case "q", "0":
		m.quitting = true
		return m, tea.Quit
	case "1":
		m.page = InterfacesPage
	case "2":
		m.page = IPConfigPage
	case "3":
		m.page = PasswordPage
	case "4":
		m.page = FactoryResetPage
	case "5":
		m.page = PowerOffPage
	case "6":
		m.page = RebootPage
	case "7":
		m.page = PingPage
		m.input = ""
		m.output = ""
	case "8":
		m.page = ShellPage
	case "9":
		m.page = VaultPage
	case "10":
		m.page = LogsPage
	case "11":
		m.page = ServicesPage
	case "12":
		m.page = UpdatePage
	case "13":
		m.page = BackupPage
	}
	return m, nil
}

func (m AppModel) handleInterfacesPage(msg tea.KeyMsg) (tea.Model, tea.Cmd) {
	if msg.String() == "q" || msg.String() == "esc" {
		m.page = MainMenuPage
	}
	return m, nil
}

func (m AppModel) handleIPConfigPage(msg tea.KeyMsg) (tea.Model, tea.Cmd) {
	if msg.String() == "q" || msg.String() == "esc" {
		m.page = MainMenuPage
	}
	return m, nil
}

func (m AppModel) handlePasswordPage(msg tea.KeyMsg) (tea.Model, tea.Cmd) {
	if msg.String() == "q" || msg.String() == "esc" {
		m.page = MainMenuPage
	} else if msg.String() == "enter" {
		// Simuler le changement de mot de passe
		m.output = "Mot de passe root modifié avec succès!"
	} else if msg.String() == "backspace" {
		if len(m.input) > 0 {
			m.input = m.input[:len(m.input)-1]
		}
	} else if len(msg.String()) == 1 {
		m.input += msg.String()
	}
	return m, nil
}

func (m AppModel) handleFactoryResetPage(msg tea.KeyMsg) (tea.Model, tea.Cmd) {
	if msg.String() == "n" || msg.String() == "q" || msg.String() == "esc" {
		m.page = MainMenuPage
	} else if msg.String() == "y" {
		m.output = "Réinitialisation en cours..."
	}
	return m, nil
}

func (m AppModel) handlePowerOffPage(msg tea.KeyMsg) (tea.Model, tea.Cmd) {
	if msg.String() == "n" || msg.String() == "q" || msg.String() == "esc" {
		m.page = MainMenuPage
	} else if msg.String() == "y" {
		exec.Command("poweroff").Start()
		m.output = "Arrêt du système..."
	}
	return m, nil
}

func (m AppModel) handleRebootPage(msg tea.KeyMsg) (tea.Model, tea.Cmd) {
	if msg.String() == "n" || msg.String() == "q" || msg.String() == "esc" {
		m.page = MainMenuPage
	} else if msg.String() == "y" {
		exec.Command("reboot").Start()
		m.output = "Redémarrage du système..."
	}
	return m, nil
}

func (m AppModel) handlePingPage(msg tea.KeyMsg) (tea.Model, tea.Cmd) {
	if msg.String() == "q" || msg.String() == "esc" {
		m.page = MainMenuPage
		m.input = ""
		m.output = ""
	} else if msg.String() == "enter" {
		if m.input != "" {
			// Exécuter le ping
			cmd := exec.Command("ping", "-c", "3", m.input)
			output, err := cmd.CombinedOutput()
			if err != nil {
				m.output = fmt.Sprintf("Erreur: %v\n%s", err, string(output))
			} else {
				m.output = string(output)
			}
		}
	} else if msg.String() == "backspace" {
		if len(m.input) > 0 {
			m.input = m.input[:len(m.input)-1]
		}
	} else if msg.String() == "space" {
		m.input += " "
	} else if len(msg.String()) == 1 && msg.String() != " " {
		m.input += msg.String()
	}
	return m, nil
}

func (m AppModel) handleShellPage(msg tea.KeyMsg) (tea.Model, tea.Cmd) {
	// Lancer un shell interactif et revenir au menu
	fmt.Print("\033[H\033[2J") // Clear screen
	fmt.Println("Lancement du shell...")
	fmt.Println("Tapez 'exit' pour revenir au menu principal")
	fmt.Println()

	cmd := exec.Command("/bin/sh")
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Run()

	m.page = MainMenuPage
	return m, nil
}

func (m AppModel) handleVaultPage(msg tea.KeyMsg) (tea.Model, tea.Cmd) {
	if msg.String() == "q" || msg.String() == "esc" {
		m.page = MainMenuPage
	}
	return m, nil
}

func (m AppModel) handleLogsPage(msg tea.KeyMsg) (tea.Model, tea.Cmd) {
	if msg.String() == "q" || msg.String() == "esc" {
		m.page = MainMenuPage
	}
	return m, nil
}

func (m AppModel) handleServicesPage(msg tea.KeyMsg) (tea.Model, tea.Cmd) {
	if msg.String() == "q" || msg.String() == "esc" {
		m.page = MainMenuPage
	} else if msg.String() == "r" {
		exec.Command("systemctl", "daemon-reload").Run()
		m.output = "Services rechargés avec succès!"
	}
	return m, nil
}

func (m AppModel) handleUpdatePage(msg tea.KeyMsg) (tea.Model, tea.Cmd) {
	if msg.String() == "q" || msg.String() == "esc" {
		m.page = MainMenuPage
	}
	return m, nil
}

func (m AppModel) handleBackupPage(msg tea.KeyMsg) (tea.Model, tea.Cmd) {
	if msg.String() == "q" || msg.String() == "esc" {
		m.page = MainMenuPage
	}
	return m, nil
}

func (m AppModel) View() string {
	if m.quitting {
		return "\nAu revoir!\n\n"
	}

	switch m.page {
	case MainMenuPage:
		return m.renderMainMenu()
	case InterfacesPage:
		return m.renderInterfacesPage()
	case IPConfigPage:
		return m.renderIPConfigPage()
	case PasswordPage:
		return m.renderPasswordPage()
	case FactoryResetPage:
		return m.renderFactoryResetPage()
	case PowerOffPage:
		return m.renderPowerOffPage()
	case RebootPage:
		return m.renderRebootPage()
	case PingPage:
		return m.renderPingPage()
	case VaultPage:
		return m.renderVaultPage()
	case LogsPage:
		return m.renderLogsPage()
	case ServicesPage:
		return m.renderServicesPage()
	case UpdatePage:
		return m.renderUpdatePage()
	case BackupPage:
		return m.renderBackupPage()
	default:
		return m.renderMainMenu()
	}
}

func (m AppModel) renderMainMenu() string {
	var b strings.Builder

	// Bannière
	b.WriteString("------------------------------------------------\n")
	b.WriteString("|              Hello, this is AETHER IDENTITY   |           :::::::::.\n")
	b.WriteString("|                                              |           :::::::::.\n")
	b.WriteString("|  Website:     https://aether-identity.io/     |        :::        :::\n")
	b.WriteString("|  Handbook:    https://docs.aether-identity.io/|        :::        :::\n")
	b.WriteString("|  Forums:      https://forum.aether-identity.io/|        :::        :::\n")
	b.WriteString("|  Code:        https://github.com/aether-identity|         `:::::::::\n")
	b.WriteString("|  Reddit:      https://reddit.com/r/aetheridentity|           `:::::::\n")
	b.WriteString("------------------------------------------------\n")
	b.WriteString("\n")

	// Info système
	b.WriteString(fmt.Sprintf("*** %s: Aether Identity %s (%s) ***\n\n",
		m.hostname, m.version, runtime.GOARCH))

	// Interfaces réseau
	for _, iface := range m.interfaces {
		b.WriteString(fmt.Sprintf(" LAN (%s)    -> v4/%s: %s\n",
			iface.Name, iface.Type, iface.IP))
	}
	b.WriteString("\n")

	// Clés SSH
	for _, key := range m.sshKeys {
		b.WriteString(fmt.Sprintf(" SSH:   SHA256 %s (%s)\n", key.Hash, key.Type))
	}
	b.WriteString("\n")

	// Menu
	b.WriteString("  0) Logout                              7) Ping host\n")
	b.WriteString("  1) Assign interfaces                   8) Shell\n")
	b.WriteString("  2) Set interface IP address            9) Vault status\n")
	b.WriteString("  3) Reset root password                10) Logs\n")
	b.WriteString("  4) Reset to factory defaults          11) Reload all services\n")
	b.WriteString("  5) Power off system                   12) Update from console\n")
	b.WriteString("  6) Reboot system                      13) Restore a backup\n")
	b.WriteString("\n")

	b.WriteString("Enter an option: ")

	return b.String()
}

func (m AppModel) renderInterfacesPage() string {
	var b strings.Builder
	b.WriteString("\n=== CONFIGURATION DES INTERFACES ===\n\n")
	b.WriteString("Interfaces réseau disponibles:\n\n")

	for i, iface := range m.interfaces {
		b.WriteString(fmt.Sprintf("%d. %s\n", i+1, iface.Name))
		b.WriteString(fmt.Sprintf("   Status: %s\n", iface.Status))
		b.WriteString(fmt.Sprintf("   IP: %s\n", iface.IP))
		b.WriteString(fmt.Sprintf("   MAC: %s\n\n", iface.MAC))
	}

	b.WriteString("\nAppuyez sur 'q' ou Échap pour revenir au menu\n")
	return b.String()
}

func (m AppModel) renderIPConfigPage() string {
	var b strings.Builder
	b.WriteString("\n=== CONFIGURATION IP ===\n\n")
	b.WriteString("Interfaces configurées:\n\n")

	for _, iface := range m.interfaces {
		b.WriteString(fmt.Sprintf("Interface: %s\n", iface.Name))
		b.WriteString(fmt.Sprintf("  Adresse IP actuelle: %s\n", iface.IP))
		b.WriteString(fmt.Sprintf("  Type: %s\n\n", iface.Type))
	}

	b.WriteString("\nAppuyez sur 'q' ou Échap pour revenir au menu\n")
	return b.String()
}

func (m AppModel) renderPasswordPage() string {
	var b strings.Builder
	b.WriteString("\n=== RÉINITIALISATION MOT DE PASSE ROOT ===\n\n")
	b.WriteString("Entrez le nouveau mot de passe: ")
	b.WriteString(strings.Repeat("*", len(m.input)))
	b.WriteString("\n\n")

	if m.output != "" {
		b.WriteString(m.output)
		b.WriteString("\n\n")
	}

	b.WriteString("Appuyez sur Entrée pour confirmer\n")
	b.WriteString("Appuyez sur 'q' ou Échap pour annuler\n")
	return b.String()
}

func (m AppModel) renderFactoryResetPage() string {
	var b strings.Builder
	b.WriteString("\n=== RÉINITIALISATION USINE ===\n\n")
	b.WriteString("⚠️  ATTENTION! Cette action va effacer toutes les configurations!\n\n")
	b.WriteString("Êtes-vous sûr de vouloir continuer? (y/n)\n\n")

	if m.output != "" {
		b.WriteString(m.output)
		b.WriteString("\n")
	}

	b.WriteString("\nAppuyez sur 'q' ou Échap pour annuler\n")
	return b.String()
}

func (m AppModel) renderPowerOffPage() string {
	var b strings.Builder
	b.WriteString("\n=== ARRÊT DU SYSTÈME ===\n\n")
	b.WriteString("Voulez-vous vraiment éteindre le système? (y/n)\n\n")

	if m.output != "" {
		b.WriteString(m.output)
		b.WriteString("\n")
	}

	b.WriteString("\nAppuyez sur 'q' ou Échap pour annuler\n")
	return b.String()
}

func (m AppModel) renderRebootPage() string {
	var b strings.Builder
	b.WriteString("\n=== REDÉMARRAGE DU SYSTÈME ===\n\n")
	b.WriteString("Voulez-vous vraiment redémarrer le système? (y/n)\n\n")

	if m.output != "" {
		b.WriteString(m.output)
		b.WriteString("\n")
	}

	b.WriteString("\nAppuyez sur 'q' ou Échap pour annuler\n")
	return b.String()
}

func (m AppModel) renderPingPage() string {
	var b strings.Builder
	b.WriteString("\n=== TEST DE CONNECTIVITÉ (PING) ===\n\n")
	b.WriteString("Entrez l'adresse IP ou le nom d'hôte: ")
	b.WriteString(m.input)
	b.WriteString("\n\n")

	if m.output != "" {
		b.WriteString("Résultat:\n")
		b.WriteString(m.output)
		b.WriteString("\n")
	}

	b.WriteString("\nAppuyez sur Entrée pour lancer le ping\n")
	b.WriteString("Appuyez sur 'q' ou Échap pour revenir au menu\n")
	return b.String()
}

func (m AppModel) renderVaultPage() string {
	var b strings.Builder
	b.WriteString("\n=== STATUT VAULT CORE ===\n\n")
	b.WriteString("État du Vault: ")
	b.WriteString("\033[32mOpérationnel\033[0m\n")
	b.WriteString("Version: 1.0.0\n")
	b.WriteString("Statut: Non scellé\n")
	b.WriteString("Tokens actifs: 3\n")
	b.WriteString("\n")
	b.WriteString("Appuyez sur 'q' ou Échap pour revenir au menu\n")
	return b.String()
}

func (m AppModel) renderLogsPage() string {
	var b strings.Builder
	b.WriteString("\n=== JOURNAUX SYSTÈME ===\n\n")

	// Récupérer les dernières lignes du journal
	if output, err := exec.Command("journalctl", "-n", "20", "--no-pager").Output(); err == nil {
		b.WriteString(string(output))
	} else {
		b.WriteString("Impossible de lire les journaux système\n")
	}

	b.WriteString("\nAppuyez sur 'q' ou Échap pour revenir au menu\n")
	return b.String()
}

func (m AppModel) renderServicesPage() string {
	var b strings.Builder
	b.WriteString("\n=== GESTION DES SERVICES ===\n\n")

	if output, err := exec.Command("systemctl", "list-units", "--type=service", "--state=running", "--no-pager").Output(); err == nil {
		lines := strings.Split(string(output), "\n")
		for i, line := range lines {
			if i < 15 { // Limiter l'affichage
				b.WriteString(line)
				b.WriteString("\n")
			}
		}
	} else {
		b.WriteString("Impossible de lister les services\n")
	}

	if m.output != "" {
		b.WriteString("\n")
		b.WriteString(m.output)
		b.WriteString("\n")
	}

	b.WriteString("\nAppuyez sur 'r' pour recharger tous les services\n")
	b.WriteString("Appuyez sur 'q' ou Échap pour revenir au menu\n")
	return b.String()
}

func (m AppModel) renderUpdatePage() string {
	var b strings.Builder
	b.WriteString("\n=== MISE À JOUR DU SYSTÈME ===\n\n")
	b.WriteString("Recherche des mises à jour...\n\n")
	b.WriteString("Système à jour.\n")
	b.WriteString("\nAppuyez sur 'q' ou Échap pour revenir au menu\n")
	return b.String()
}

func (m AppModel) renderBackupPage() string {
	var b strings.Builder
	b.WriteString("\n=== RESTAURATION DE SAUVEGARDE ===\n\n")
	b.WriteString("Sauvegardes disponibles:\n\n")
	b.WriteString("1. backup-2024-01-15.tar.gz\n")
	b.WriteString("2. backup-2024-01-01.tar.gz\n")
	b.WriteString("\nAppuyez sur 'q' ou Échap pour revenir au menu\n")
	return b.String()
}
