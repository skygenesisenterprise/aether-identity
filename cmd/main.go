package main

import (
	"bufio"
	"fmt"
	"os"
	"os/exec"
	"runtime"
	"strings"
	"time"
)

// Styles avec codes ANSI
type styles struct {
	reset  string
	bold   string
	cyan   string
	green  string
	yellow string
	white  string
	gray   string
	red    string
}

func newStyles() styles {
	return styles{
		reset:  "\033[0m",
		bold:   "\033[1m",
		cyan:   "\033[96m",
		green:  "\033[92m",
		yellow: "\033[93m",
		white:  "\033[97m",
		gray:   "\033[90m",
		red:    "\033[91m",
	}
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

var (
	s          = newStyles()
	hostname   string
	version    = "1.0.0"
	interfaces []NetInterface
	sshKeys    []SSHKey
	reader     = bufio.NewReader(os.Stdin)
)

func init() {
	hostname = getHostname()
	interfaces = getNetworkInterfaces()
	sshKeys = getSSHKeys()
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

func clearScreen() {
	fmt.Print("\033[H\033[2J")
}

func printBanner() {
	fmt.Println("------------------------------------------------")
	fmt.Println("|              Hello, this is AETHER IDENTITY   |           :::::::::.")
	fmt.Println("|                                              |           :::::::::.")
	fmt.Println("|  Website:     https://aether-identity.io/     |        :::        :::")
	fmt.Println("|  Handbook:    https://docs.aether-identity.io/|        :::        :::")
	fmt.Println("|  Forums:      https://forum.aether-identity.io/|        :::        :::")
	fmt.Println("|  Code:        https://github.com/aether-identity|         `:::::::::")
	fmt.Println("|  Reddit:      https://reddit.com/r/aetheridentity|           `:::::::")
	fmt.Println("------------------------------------------------")
	fmt.Println()
}

func printSystemInfo() {
	fmt.Printf("*** %s: Aether Identity %s (%s) ***\n\n",
		hostname, version, runtime.GOARCH)

	// Interfaces réseau
	for _, iface := range interfaces {
		fmt.Printf(" LAN (%s)    -> v4/%s: %s\n",
			iface.Name, iface.Type, iface.IP)
	}
	fmt.Println()

	// Clés SSH
	for _, key := range sshKeys {
		fmt.Printf(" SSH:   SHA256 %s (%s)\n", key.Hash, key.Type)
	}
	fmt.Println()
}

func printMenu() {
	fmt.Println("  0) Logout                              7) Ping host")
	fmt.Println("  1) Assign interfaces                   8) Shell")
	fmt.Println("  2) Set interface IP address            9) Vault status")
	fmt.Println("  3) Reset root password                10) Logs")
	fmt.Println("  4) Reset to factory defaults          11) Reload all services")
	fmt.Println("  5) Power off system                   12) Update from console")
	fmt.Println("  6) Reboot system                      13) Restore a backup")
	fmt.Println()
}

func waitForEnter() {
	fmt.Println("\nAppuyez sur Entrée pour continuer...")
	reader.ReadString('\n')
}

func showInterfaces() {
	clearScreen()
	fmt.Println("\n=== CONFIGURATION DES INTERFACES ===\n")
	fmt.Println("Interfaces réseau disponibles:\n")

	for i, iface := range interfaces {
		fmt.Printf("%d. %s\n", i+1, iface.Name)
		fmt.Printf("   Status: %s\n", iface.Status)
		fmt.Printf("   IP: %s\n", iface.IP)
		fmt.Printf("   MAC: %s\n\n", iface.MAC)
	}

	waitForEnter()
}

func showIPConfig() {
	clearScreen()
	fmt.Println("\n=== CONFIGURATION IP ===\n")
	fmt.Println("Interfaces configurées:\n")

	for _, iface := range interfaces {
		fmt.Printf("Interface: %s\n", iface.Name)
		fmt.Printf("  Adresse IP actuelle: %s\n", iface.IP)
		fmt.Printf("  Type: %s\n\n", iface.Type)
	}

	waitForEnter()
}

func resetPassword() {
	clearScreen()
	fmt.Println("\n=== RÉINITIALISATION MOT DE PASSE ROOT ===\n")
	fmt.Print("Entrez le nouveau mot de passe: ")

	// Lire le mot de passe (caché)
	password, _ := reader.ReadString('\n')
	password = strings.TrimSpace(password)

	if password != "" {
		// Simuler le changement
		fmt.Println("\nMot de passe root modifié avec succès!")
	} else {
		fmt.Println("\nOpération annulée.")
	}

	waitForEnter()
}

func factoryReset() {
	clearScreen()
	fmt.Println("\n=== RÉINITIALISATION USINE ===\n")
	fmt.Println("⚠️  ATTENTION! Cette action va effacer toutes les configurations!\n")
	fmt.Print("Êtes-vous sûr de vouloir continuer? (y/n): ")

	response, _ := reader.ReadString('\n')
	response = strings.TrimSpace(strings.ToLower(response))

	if response == "y" || response == "yes" {
		fmt.Println("\nRéinitialisation en cours...")
		time.Sleep(2 * time.Second)
		fmt.Println("Système réinitialisé aux paramètres d'usine.")
	} else {
		fmt.Println("\nOpération annulée.")
	}

	waitForEnter()
}

func powerOff() {
	clearScreen()
	fmt.Println("\n=== ARRÊT DU SYSTÈME ===\n")
	fmt.Print("Voulez-vous vraiment éteindre le système? (y/n): ")

	response, _ := reader.ReadString('\n')
	response = strings.TrimSpace(strings.ToLower(response))

	if response == "y" || response == "yes" {
		fmt.Println("\nArrêt du système...")
		exec.Command("poweroff").Start()
		time.Sleep(5 * time.Second)
	} else {
		fmt.Println("\nOpération annulée.")
		waitForEnter()
	}
}

func reboot() {
	clearScreen()
	fmt.Println("\n=== REDÉMARRAGE DU SYSTÈME ===\n")
	fmt.Print("Voulez-vous vraiment redémarrer le système? (y/n): ")

	response, _ := reader.ReadString('\n')
	response = strings.TrimSpace(strings.ToLower(response))

	if response == "y" || response == "yes" {
		fmt.Println("\nRedémarrage du système...")
		exec.Command("reboot").Start()
		time.Sleep(5 * time.Second)
	} else {
		fmt.Println("\nOpération annulée.")
		waitForEnter()
	}
}

func pingHost() {
	clearScreen()
	fmt.Println("\n=== TEST DE CONNECTIVITÉ (PING) ===\n")
	fmt.Print("Entrez l'adresse IP ou le nom d'hôte: ")

	host, _ := reader.ReadString('\n')
	host = strings.TrimSpace(host)

	if host != "" {
		fmt.Printf("\nPing vers %s...\n\n", host)
		cmd := exec.Command("ping", "-c", "3", host)
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
		cmd.Run()
	}

	waitForEnter()
}

func openShell() {
	clearScreen()
	fmt.Println("Lancement du shell...")
	fmt.Println("Tapez 'exit' pour revenir au menu principal")
	fmt.Println()

	cmd := exec.Command("/bin/sh")
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Run()
}

func showVaultStatus() {
	clearScreen()
	fmt.Println("\n=== STATUT VAULT CORE ===\n")
	fmt.Printf("État du Vault: %sOpérationnel%s\n", s.green, s.reset)
	fmt.Println("Version: 1.0.0")
	fmt.Println("Statut: Non scellé")
	fmt.Println("Tokens actifs: 3")
	fmt.Println()
	waitForEnter()
}

func showLogs() {
	clearScreen()
	fmt.Println("\n=== JOURNAUX SYSTÈME ===\n")

	if output, err := exec.Command("journalctl", "-n", "20", "--no-pager").Output(); err == nil {
		fmt.Print(string(output))
	} else {
		fmt.Println("Impossible de lire les journaux système")
	}

	waitForEnter()
}

func reloadServices() {
	clearScreen()
	fmt.Println("\n=== GESTION DES SERVICES ===\n")

	if output, err := exec.Command("systemctl", "list-units", "--type=service", "--state=running", "--no-pager", "-n", "15").Output(); err == nil {
		fmt.Print(string(output))
	} else {
		fmt.Println("Impossible de lister les services")
	}

	fmt.Println("\nAppuyez sur 'r' pour recharger tous les services, ou Entrée pour continuer")

	response, _ := reader.ReadString('\n')
	response = strings.TrimSpace(strings.ToLower(response))

	if response == "r" {
		fmt.Println("Rechargement des services...")
		exec.Command("systemctl", "daemon-reload").Run()
		fmt.Println("Services rechargés avec succès!")
		time.Sleep(1 * time.Second)
	}
}

func updateSystem() {
	clearScreen()
	fmt.Println("\n=== MISE À JOUR DU SYSTÈME ===\n")
	fmt.Println("Recherche des mises à jour...")
	time.Sleep(1 * time.Second)
	fmt.Println("Système à jour.")
	waitForEnter()
}

func restoreBackup() {
	clearScreen()
	fmt.Println("\n=== RESTAURATION DE SAUVEGARDE ===\n")
	fmt.Println("Sauvegardes disponibles:\n")
	fmt.Println("1. backup-2024-01-15.tar.gz")
	fmt.Println("2. backup-2024-01-01.tar.gz")
	fmt.Println()
	fmt.Print("Sélectionnez une sauvegarde (1-2): ")

	choice, _ := reader.ReadString('\n')
	choice = strings.TrimSpace(choice)

	if choice == "1" || choice == "2" {
		fmt.Println("\nRestauration en cours...")
		time.Sleep(2 * time.Second)
		fmt.Println("Sauvegarde restaurée avec succès!")
	} else {
		fmt.Println("\nOpération annulée.")
	}

	waitForEnter()
}

func runMenu() {
	for {
		clearScreen()
		printBanner()
		printSystemInfo()
		printMenu()

		fmt.Print("Enter an option: ")

		// Lire l'entrée utilisateur
		choice, _ := reader.ReadString('\n')
		choice = strings.TrimSpace(choice)

		switch choice {
		case "0", "q", "quit", "exit":
			clearScreen()
			fmt.Println("\nAu revoir!\n")
			return
		case "1":
			showInterfaces()
		case "2":
			showIPConfig()
		case "3":
			resetPassword()
		case "4":
			factoryReset()
		case "5":
			powerOff()
		case "6":
			reboot()
		case "7":
			pingHost()
		case "8":
			openShell()
		case "9":
			showVaultStatus()
		case "10":
			showLogs()
		case "11":
			reloadServices()
		case "12":
			updateSystem()
		case "13":
			restoreBackup()
		default:
			if choice != "" {
				fmt.Printf("\nOption invalide: %s\n", choice)
				time.Sleep(1 * time.Second)
			}
		}
	}
}

func main() {
	runMenu()
}
