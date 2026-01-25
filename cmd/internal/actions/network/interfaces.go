package network

import (
	"fmt"
	"os/exec"
	"regexp"
	"strings"

	"github.com/skygenesisenterprise/aether-vault/cmd/internal/context"
	"github.com/skygenesisenterprise/aether-vault/cmd/internal/ui/theme"
)

// ListInterfacesAction liste les interfaces réseau
type ListInterfacesAction struct{}

func NewListInterfacesAction() *ListInterfacesAction {
	return &ListInterfacesAction{}
}

func (a *ListInterfacesAction) Name() string {
	return "network-interfaces"
}

func (a *ListInterfacesAction) Description() string {
	return "Liste toutes les interfaces réseau configurées"
}

func (a *ListInterfacesAction) Execute(ctx interface{}, args []string) error {
	colors := theme.GetColors()

	fmt.Print("\033[H\033[2J")

	fmt.Printf(`
%s┌─ INTERFACES RÉSEAU ──────────────────────────────────────────┐
│                                                              │
`,
		colors.Header,
	)

	// Obtenir les informations avec ip addr
	cmd := exec.Command("ip", "addr", "show")
	output, err := cmd.Output()
	if err != nil {
		return fmt.Errorf("erreur lors de la récupération des interfaces: %w", err)
	}

	interfaces := parseIPAddrOutput(string(output))

	for name, iface := range interfaces {
		statusColor := colors.Warning
		statusSymbol := "○"
		statusText := "Down"

		if iface.Status == "UP" {
			statusColor = colors.Success
			statusSymbol = "●"
			statusText = "Up"
		}

		// Afficher les informations de l'interface
		fmt.Printf("│  %s%s%s %s%-15s%s %s%s%s │\n",
			statusColor, statusSymbol, colors.Reset,
			colors.Info, name, colors.Reset,
			statusColor, statusText, colors.Reset,
		)

		if len(iface.IPv4) > 0 {
			for _, ip := range iface.IPv4 {
				fmt.Printf("│    %sIPv4:%s %s%-20s%s                    │\n",
					colors.Label, colors.Reset, colors.Info, ip, colors.Reset)
			}
		}

		if len(iface.IPv6) > 0 {
			for _, ip := range iface.IPv6 {
				// Limiter l'affichage IPv6
				displayIP := ip
				if len(displayIP) > 25 {
					displayIP = displayIP[:22] + "..."
				}
				fmt.Printf("│    %sIPv6:%s %s%-20s%s                    │\n",
					colors.Label, colors.Reset, colors.Info, displayIP, colors.Reset)
			}
		}

		if iface.MAC != "" {
			fmt.Printf("│    %sMAC:%s  %s%-20s%s                    │\n",
				colors.Label, colors.Reset, colors.Info, iface.MAC, colors.Reset)
		}

		fmt.Printf("│                                                              │\n")
	}

	fmt.Printf(`
└──────────────────────────────────────────────────────────────┘%s

`,
		colors.Reset,
	)

	// Afficher les routes par défaut
	displayDefaultRoutes(colors)

	return nil
}

func (a *ListInterfacesAction) Validate(args []string) error {
	return nil
}

func (a *ListInterfacesAction) RequiresAuth() bool {
	return false
}

// PingHostAction teste la connectivité vers un hôte
type PingHostAction struct{}

func NewPingHostAction() *PingHostAction {
	return &PingHostAction{}
}

func (a *PingHostAction) Name() string {
	return "network-ping"
}

func (a *PingHostAction) Description() string {
	return "Teste la connectivité vers un hôte"
}

func (a *PingHostAction) Execute(ctx interface{}, args []string) error {
	if len(args) < 1 {
		return fmt.Errorf("usage: ping <hostname|ip>")
	}

	host := args[0]
	colors := theme.GetColors()

	fmt.Printf("Test de connectivité vers %s%s%s...\n\n", colors.Info, host, colors.Reset)

	// Utiliser ping -c 4 pour 4 packets
	cmd := exec.Command("ping", "-c", "4", host)
	cmd.Stdout = nil // Laisser stdout vers la console
	cmd.Stderr = nil // Laisser stderr vers la console

	if err := cmd.Run(); err != nil {
		fmt.Printf("\n%s✗ Échec du ping vers %s%s%s\n",
			colors.Error, colors.Info, host, colors.Reset)
		return err
	}

	fmt.Printf("\n%s✓ Ping réussi vers %s%s%s\n",
		colors.Success, colors.Info, host, colors.Reset)

	return nil
}

func (a *PingHostAction) Validate(args []string) error {
	if len(args) < 1 {
		return fmt.Errorf("hostname ou IP requis")
	}
	return nil
}

func (a *PingHostAction) RequiresAuth() bool {
	return false
}

// NetworkInterface contient les informations d'une interface réseau
type NetworkInterface struct {
	Name   string
	Status string
	IPv4   []string
	IPv6   []string
	MAC    string
}

// parseIPAddrOutput parse la sortie de ip addr show
func parseIPAddrOutput(output string) map[string]*NetworkInterface {
	interfaces := make(map[string]*NetworkInterface)

	lines := strings.Split(output, "\n")
	var currentInterface *NetworkInterface

	interfaceRegex := regexp.MustCompile(`^\d+:\s+(\w+):\s+(.*)`)
	ipRegex := regexp.MustCompile(`\s+inet\s+(\S+)`)
	ipv6Regex := regexp.MustCompile(`\s+inet6\s+(\S+)`)
	macRegex := regexp.MustCompile(`link/\S+\s+([0-9a-f:]{17})`)

	for _, line := range lines {
		line = strings.TrimSpace(line)

		if matches := interfaceRegex.FindStringSubmatch(line); matches != nil {
			name := matches[1]
			flags := matches[2]

			currentInterface = &NetworkInterface{
				Name:   name,
				Status: "DOWN",
				IPv4:   []string{},
				IPv6:   []string{},
				MAC:    "",
			}

			if strings.Contains(flags, "UP") {
				currentInterface.Status = "UP"
			}

			interfaces[name] = currentInterface
			continue
		}

		if currentInterface == nil {
			continue
		}

		if matches := ipRegex.FindStringSubmatch(line); matches != nil {
			ip := matches[1]
			// Exclure les adresses localhost
			if !strings.HasPrefix(ip, "127.") {
				currentInterface.IPv4 = append(currentInterface.IPv4, ip)
			}
		}

		if matches := ipv6Regex.FindStringSubmatch(line); matches != nil {
			ip := matches[1]
			// Excluer les adresses loopback et lien-local
			if !strings.HasPrefix(ip, "::1") && !strings.HasPrefix(ip, "fe80:") {
				currentInterface.IPv6 = append(currentInterface.IPv6, ip)
			}
		}

		if matches := macRegex.FindStringSubmatch(line); matches != nil {
			currentInterface.MAC = matches[1]
		}
	}

	return interfaces
}

func displayDefaultRoutes(colors *theme.Colors) {
	fmt.Printf(`
%s┌─ ROUTES PAR DÉFAUT ──────────────────────────────────────────┐
│                                                              │
`,
		colors.Header,
	)

	// Obtenir les routes par défaut
	cmd := exec.Command("ip", "route", "show", "default")
	output, err := cmd.Output()
	if err == nil {
		lines := strings.Split(string(output), "\n")
		for _, line := range lines {
			if strings.Contains(line, "default") {
				parts := strings.Fields(line)
				gateway := ""
				interfaceName := ""

				for i, part := range parts {
					if part == "via" && i+1 < len(parts) {
						gateway = parts[i+1]
					}
					if part == "dev" && i+1 < len(parts) {
						interfaceName = parts[i+1]
					}
				}

				if gateway != "" {
					fmt.Printf("│  %sPasserelle:%s  %s%-15s%s  %sInterface:%s  %s%s%s  │\n",
						colors.Label, colors.Reset,
						colors.Info, gateway, colors.Reset,
						colors.Label, colors.Reset,
						colors.Info, interfaceName, colors.Reset,
					)
				}
			}
		}
	} else {
		fmt.Printf("│  %sAucune route par défaut configurée%s                    │\n",
			colors.Warning, colors.Reset)
	}

	fmt.Printf(`
│                                                              │
└──────────────────────────────────────────────────────────────┘%s

`,
		colors.Reset,
	)
}
