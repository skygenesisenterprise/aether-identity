package security

import (
	"fmt"
	"os"
	"os/exec"
	"os/user"
	"strconv"
	"strings"
	"time"

	"github.com/skygenesisenterprise/aether-vault/cmd/internal/context"
	"github.com/skygenesisenterprise/aether-vault/cmd/internal/ui/theme"
)

// ListUsersAction liste les utilisateurs système
type ListUsersAction struct{}

func NewListUsersAction() *ListUsersAction {
	return &ListUsersAction{}
}

func (a *ListUsersAction) Name() string {
	return "security-users"
}

func (a *ListUsersAction) Description() string {
	return "Liste tous les utilisateurs système"
}

func (a *ListUsersAction) Execute(ctx interface{}, args []string) error {
	colors := theme.GetColors()

	fmt.Print("\033[H\033[2J")

	fmt.Printf(`
%s┌─ UTILISATEURS SYSTÈME ─────────────────────────────────────────┐
│                                                              │
`,
		colors.Header,
	)

	// Lire /etc/passwd
	cmd := exec.Command("cat", "/etc/passwd")
	output, err := cmd.Output()
	if err != nil {
		return fmt.Errorf("erreur lors de la lecture des utilisateurs: %w", err)
	}

	lines := strings.Split(string(output), "\n")
	userCount := 0

	for _, line := range lines {
		if strings.TrimSpace(line) == "" {
			continue
		}

		parts := strings.Split(line, ":")
		if len(parts) >= 7 {
			username := parts[0]
			uid := parts[2]
			gid := parts[3]
			comment := parts[4]
			home := parts[5]
			shell := parts[6]

			// Ignorer les utilisateurs système (UID < 1000 sauf exceptions)
			uidNum, _ := strconv.Atoi(uid)
			if uidNum < 1000 && username != "root" {
				continue
			}

			// Déterminer si l'utilisateur peut se connecter
			canLogin := true
			if !strings.Contains(shell, "bash") && !strings.Contains(shell, "sh") {
				canLogin = false
			}

			loginColor := colors.Success
			loginSymbol := "✓"
			if !canLogin {
				loginColor = colors.Warning
				loginSymbol = "○"
			}

			// Vérifier si l'utilisateur est connecté
			isOnline := isUserOnline(username)
			onlineColor := colors.Reset
			onlineSymbol := ""
			if isOnline {
				onlineColor = colors.Success
				onlineSymbol = "●"
			}

			fmt.Printf("│  %s%s%s %s%-12s%s %sUID:%s %s%-6s%s %s%s %s%-15s%s │\n",
				loginColor, loginSymbol, onlineColor,
				colors.Info, username, colors.Reset,
				colors.Label, colors.Reset, colors.Info, uid, colors.Reset,
				onlineColor, onlineSymbol,
				colors.Info, home, colors.Reset,
			)

			userCount++
		}
	}

	fmt.Printf(`
│                                                              │
│  Total: %s%d utilisateurs affichés%s                           │
└──────────────────────────────────────────────────────────────┘%s

`,
		colors.Info, userCount, colors.Reset,
		colors.Reset,
	)

	return nil
}

func (a *ListUsersAction) Validate(args []string) error {
	return nil
}

func (a *ListUsersAction) RequiresAuth() bool {
	return true
}

// ListSSHKeysAction liste les clés SSH configurées
type ListSSHKeysAction struct{}

func NewListSSHKeysAction() *ListSSHKeysAction {
	return &ListSSHKeysAction{}
}

func (a *ListSSHKeysAction) Name() string {
	return "security-ssh-keys"
}

func (a *ListSSHKeysAction) Description() string {
	return "Liste les clés SSH du serveur"
}

func (a *ListSSHKeysAction) Execute(ctx interface{}, args []string) error {
	colors := theme.GetColors()

	fmt.Print("\033[H\033[2J")

	fmt.Printf(`
%s┌─ CLÉS SSH SERVEUR ────────────────────────────────────────────┐
│                                                              │
`,
		colors.Header,
	)

	// Clés hôtes SSH
	hostKeys := []struct {
		name string
		path string
	}{
		{"RSA", "/etc/ssh/ssh_host_rsa_key.pub"},
		{"ECDSA", "/etc/ssh/ssh_host_ecdsa_key.pub"},
		{"ED25519", "/etc/ssh/ssh_host_ed25519_key.pub"},
	}

	for _, key := range hostKeys {
		if _, err := os.Stat(key.path); err == nil {
			cmd := exec.Command("ssh-keygen", "-l", "-f", key.path)
			output, err := cmd.Output()
			if err == nil {
				parts := strings.Fields(string(output))
				if len(parts) >= 2 {
					fingerprint := parts[1]
					fmt.Printf("│  %sHôte %s:%s  %s%s%s\n",
						colors.Label, key.name, colors.Reset,
						colors.Info, fingerprint, colors.Reset)
				}
			}
		}
	}

	fmt.Printf(`
│                                                              │
│  %sClés SSH utilisateur:/root/.ssh/authorized_keys%s         │
`,
		colors.Warning, colors.Reset,
	)

	// Afficher les clés autorisées pour root
	if authKeys, err := os.ReadFile("/root/.ssh/authorized_keys"); err == nil {
		lines := strings.Split(string(authKeys), "\n")
		keyCount := 0

		for _, line := range lines {
			if strings.TrimSpace(line) != "" && !strings.HasPrefix(line, "#") {
				parts := strings.Fields(line)
				if len(parts) >= 3 {
					comment := parts[2]
					fmt.Printf("│    %s•%s %s%-50s%s│\n",
						colors.Info, colors.Reset,
						colors.Info, comment, colors.Reset)
					keyCount++
				}
			}
		}

		if keyCount == 0 {
			fmt.Printf("│    %sAucune clé autorisée configurée%s                    │\n",
				colors.Warning, colors.Reset)
		}
	}

	fmt.Printf(`
└──────────────────────────────────────────────────────────────┘%s

`,
		colors.Reset,
	)

	return nil
}

func (a *ListSSHKeysAction) Validate(args []string) error {
	return nil
}

func (a *ListSSHKeysAction) RequiresAuth() bool {
	return true
}

// ShowAuditLogAction affiche les logs d'audit
type ShowAuditLogAction struct{}

func NewShowAuditLogAction() *ShowAuditLogAction {
	return &ShowAuditLogAction{}
}

func (a *ShowAuditLogAction) Name() string {
	return "security-audit"
}

func (a *ShowAuditLogAction) Description() string {
	return "Affiche les logs d'audit système"
}

func (a *ShowAuditLogAction) Execute(ctx interface{}, args []string) error {
	colors := theme.GetColors()

	fmt.Print("\033[H\033[2J")

	fmt.Printf(`
%s┌─ LOGS D'AUDIT SYSTÈME ───────────────────────────────────────┐
│                                                              │
`,
		colors.Header,
	)

	// Afficher les 20 dernières lignes de auth.log
	cmd := exec.Command("tail", "-20", "/var/log/auth.log")
	output, err := cmd.Output()
	if err != nil {
		// Essayer alternatives
		cmd = exec.Command("tail", "-20", "/var/log/secure")
		output, err = cmd.Output()
		if err != nil {
			cmd = exec.Command("journalctl", "-n", "20", "-u", "sshd")
			output, err = cmd.Output()
			if err != nil {
				return fmt.Errorf("impossible de lire les logs d'audit: %w", err)
			}
		}
	}

	lines := strings.Split(string(output), "\n")
	for i, line := range lines {
		if strings.TrimSpace(line) == "" {
			continue
		}

		// Parser et coloriser les types d'événements
		var lineColor, symbol string

		if strings.Contains(line, "Failed password") {
			lineColor = colors.Error
			symbol = "✗"
		} else if strings.Contains(line, "Accepted password") {
			lineColor = colors.Success
			symbol = "✓"
		} else if strings.Contains(line, "Invalid user") {
			lineColor = colors.Warning
			symbol = "⚠"
		} else if strings.Contains(line, "session opened") {
			lineColor = colors.Info
			symbol = "○"
		} else {
			lineColor = colors.Reset
			symbol = " "
		}

		// Limiter la longueur pour l'affichage
		displayLine := line
		if len(displayLine) > 55 {
			displayLine = displayLine[:52] + "..."
		}

		fmt.Printf("│  %s%s%s %s%-55s%s │\n",
			lineColor, symbol, colors.Reset,
			lineColor, displayLine, colors.Reset)

		// Limiter l'affichage
		if i >= 15 {
			break
		}
	}

	fmt.Printf(`
│                                                              │
│  %sUtilisez 'journalctl -f' pour les logs en temps réel%s    │
└──────────────────────────────────────────────────────────────┘%s

`,
		colors.Info, colors.Reset,
		colors.Reset,
	)

	return nil
}

func (a *ShowAuditLogAction) Validate(args []string) error {
	return nil
}

func (a *ShowAuditLogAction) RequiresAuth() bool {
	return true
}

// ChangePasswordAction change le mot de passe d'un utilisateur
type ChangePasswordAction struct{}

func NewChangePasswordAction() *ChangePasswordAction {
	return &ChangePasswordAction{}
}

func (a *ChangePasswordAction) Name() string {
	return "security-change-password"
}

func (a *ChangePasswordAction) Description() string {
	return "Change le mot de passe d'un utilisateur"
}

func (a *ChangePasswordAction) Execute(ctx interface{}, args []string) error {
	username := "root"
	if len(args) > 0 {
		username = args[0]
	}

	colors := theme.GetColors()

	fmt.Printf("Changement du mot de passe pour l'utilisateur %s%s%s\n",
		colors.Info, username, colors.Reset)

	// Utiliser passwd pour changer le mot de passe
	cmd := exec.Command("passwd", username)
	cmd.Stdin = nil // Laisser stdin interactif
	cmd.Stdout = nil
	cmd.Stderr = nil

	if err := cmd.Run(); err != nil {
		return fmt.Errorf("erreur lors du changement de mot de passe: %w", err)
	}

	fmt.Printf("%s✓ Mot de passe changé avec succès%s\n",
		colors.Success, colors.Reset)

	return nil
}

func (a *ChangePasswordAction) Validate(args []string) error {
	// Valider que l'utilisateur existe
	username := "root"
	if len(args) > 0 {
		username = args[0]
	}

	if _, err := user.Lookup(username); err != nil {
		return fmt.Errorf("l'utilisateur %s n'existe pas", username)
	}

	return nil
}

func (a *ChangePasswordAction) RequiresAuth() bool {
	return true
}

// Fonctions utilitaires
func isUserOnline(username string) bool {
	cmd := exec.Command("who")
	output, err := cmd.Output()
	if err != nil {
		return false
	}

	return strings.Contains(string(output), username)
}

// GetLastLoginTime récupère la date du dernier login
func GetLastLoginTime(username string) string {
	cmd := exec.Command("last", "-n", "1", username)
	output, err := cmd.Output()
	if err != nil {
		return "Jamais"
	}

	lines := strings.Split(string(output), "\n")
	if len(lines) >= 2 && !strings.Contains(lines[0], "wtmp") {
		parts := strings.Fields(lines[0])
		if len(parts) >= 3 {
			return strings.Join(parts[2:], " ")
		}
	}

	return "Jamais"
}

// GetFailedLoginCount compte les tentatives de connexion échouées
func GetFailedLoginCount() int {
	cmd := exec.Command("journalctl", "-u", "sshd", "--since", "1 day ago")
	output, err := cmd.Output()
	if err != nil {
		return 0
	}

	failedCount := 0
	lines := strings.Split(string(output), "\n")
	for _, line := range lines {
		if strings.Contains(line, "Failed password") {
			failedCount++
		}
	}

	return failedCount
}
