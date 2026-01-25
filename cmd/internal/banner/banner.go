package banner

import (
	"fmt"
	"os"
	"os/exec"
	"runtime"
	"strings"
	"time"

	"github.com/skygenesisenterprise/aether-identity/cmd/internal/system"
	"github.com/skygenesisenterprise/aether-identity/cmd/internal/ui/theme"
)

// Display affiche le banner système complet
func Display() error {
	// Afficher le banner OPNsense-style
	displayOPNsenseBanner()

	// Afficher les infos système
	displaySystemInfo()

	// Afficher les infos réseau
	displayNetworkInfo()

	// Afficher les clés SSH
	displaySSHKeys()

	return nil
}

// DisplayWelcome affiche le banner de bienvenue pour les connexions SSH
func DisplayWelcome() error {
	displayOPNsenseBanner()
	displaySystemInfo()
	displayNetworkInfo()
	displaySSHKeys()
	return nil
}

func displayOPNsenseBanner() {
	fmt.Printf(`
------------------------------------------------
|              Hello, this is AETHER IDENTITY   |           :::::::.
|                                              |           :::::::::.
|  Website:     https://aether-identity.io/     |        :::        :::
|  Handbook:    https://docs.aether-identity.io/|        :::        :::
|  Forums:      https://forum.aether-identity.io/|        :::        :::
|  Code:        https://github.com/aether-identity|         ` + "`" + `:::::::::
|  Reddit:      https://reddit.com/r/aetheridentity|           ` + "`" + `:::::::
------------------------------------------------

`)
}

func displaySystemInfo() {
	sysInfo := system.GetInfo()
	hostname := getHostname()

	fmt.Printf(`*** %s: Aether Identity 1.0.0 (%s) ***

`, hostname, runtime.GOARCH)
}

func displayTime() {
	colors := theme.GetColors()
	now := time.Now()

	fmt.Printf(`
%s┌─ SESSION ───────────────────────────────────────────────────┐
│  %s%s%s  │  User: %s%s%s  │  TTY: %s%s%s  │
└───────────────────────────────────────────────────────────────┘%s

`,
		colors.Header,
		colors.Time, now.Format("2006-01-02 15:04:05"), colors.Reset,
		colors.User, getCurrentUser(), colors.Reset,
		colors.Info, getCurrentTTY(), colors.Reset,
		colors.Reset,
	)
}

func getHostname() string {
	if hostname, err := exec.Command("hostname").Output(); err == nil {
		return strings.TrimSpace(string(hostname))
	}
	return "AetherIdentity.local"
}

func getNetworkInterfaces() []string {
	var interfaces []string
	if output, err := exec.Command("ip", "addr", "show").Output(); err == nil {
		lines := strings.Split(string(output), "\n")
		for _, line := range lines {
			if strings.Contains(line, "inet ") && strings.Contains(line, "global") {
				parts := strings.Fields(line)
				if len(parts) >= 2 {
					interfaces = append(interfaces, parts[1])
				}
			}
		}
	}
	return interfaces
}

func getSSHKeys() []string {
	var keys []string
	if output, err := exec.Command("ssh-keygen", "-l", "-f", "/etc/ssh/ssh_host_ecdsa_key.pub").Output(); err == nil {
		keys = append(keys, "ECDSA "+strings.TrimSpace(strings.Split(string(output), " ")[1]))
	}
	if output, err := exec.Command("ssh-keygen", "-l", "-f", "/etc/ssh/ssh_host_ed25519_key.pub").Output(); err == nil {
		keys = append(keys, "ED25519 "+strings.TrimSpace(strings.Split(string(output), " ")[1]))
	}
	if output, err := exec.Command("ssh-keygen", "-l", "-f", "/etc/ssh/ssh_host_rsa_key.pub").Output(); err == nil {
		keys = append(keys, "RSA "+strings.TrimSpace(strings.Split(string(output), " ")[1]))
	}
	return keys
}

func displayNetworkInfo() {
	interfaces := getNetworkInterfaces()
	if len(interfaces) > 0 {
		fmt.Printf(" LAN (eth0)    -> v4/DHCP4: %s\n", interfaces[0])
	}
	fmt.Println()
}

func displaySSHInfo() {
	keys := getSSHKeys()
	for _, key := range keys {
		fmt.Printf(" SSH:   SHA256 %s\n", key)
	}
	fmt.Println()
}

func displaySSHKeys() {
	displaySSHInfo()
}
