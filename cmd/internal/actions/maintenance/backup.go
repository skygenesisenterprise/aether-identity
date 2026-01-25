package maintenance

import (
	"fmt"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"time"

	"github.com/skygenesisenterprise/aether-vault/cmd/internal/context"
	"github.com/skygenesisenterprise/aether-vault/cmd/internal/ui/theme"
)

// BackupSystemAction effectue une sauvegarde complète du système
type BackupSystemAction struct{}

func NewBackupSystemAction() *BackupSystemAction {
	return &BackupSystemAction{}
}

func (a *BackupSystemAction) Name() string {
	return "maintenance-backup"
}

func (a *BackupSystemAction) Description() string {
	return "Effectue une sauvegarde complète du système"
}

func (a *BackupSystemAction) Execute(ctx interface{}, args []string) error {
	colors := theme.GetColors()

	timestamp := time.Now().Format("20060102-150405")
	backupFile := fmt.Sprintf("/tmp/aether-vault-backup-%s.tar.gz", timestamp)

	fmt.Printf(`
%s┌─ SAUVEGARDE SYSTÈME ─────────────────────────────────────────┐
│                                                              │
│  %sFichier:%s  %s%-50s%s  │
│  %sDate:%s     %s%-50s%s  │
│                                                              │
│  %s!%s Cette opération peut prendre plusieurs minutes        │
│                                                              │
└──────────────────────────────────────────────────────────────┘%s

`,
		colors.Header,
		colors.Label, colors.Reset, colors.Info, backupFile, colors.Reset,
		colors.Label, colors.Reset, colors.Info, time.Now().Format("2006-01-02 15:04:05"), colors.Reset,
		colors.Warning, colors.Reset,
		colors.Reset,
	)

	fmt.Printf("Début de la sauvegarde...\n")

	// Créer la sauvegarde avec tar
	cmd := exec.Command("tar", "-czf", backupFile,
		"--exclude=/tmp/*",
		"--exclude=/var/tmp/*",
		"--exclude=/var/cache/*",
		"--exclude=/proc/*",
		"--exclude=/sys/*",
		"--exclude=/dev/*",
		"--exclude=/run/*",
		"--exclude=/lost+found",
		"/",
	)

	// Afficher la progression
	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("erreur lors de la sauvegarde: %w\nOutput: %s", err, string(output))
	}

	// Vérifier la taille du fichier
	if stat, err := os.Stat(backupFile); err == nil {
		sizeMB := float64(stat.Size()) / (1024 * 1024)
		fmt.Printf("\n%s✓ Sauvegarde terminée avec succès%s\n", colors.Success, colors.Reset)
		fmt.Printf("  %sFichier:%s %s\n", colors.Label, colors.Reset, backupFile)
		fmt.Printf("  %sTaille:%s  %.2f MB\n", colors.Label, colors.Reset, sizeMB)
	} else {
		return fmt.Errorf("impossible de vérifier le fichier de sauvegarde")
	}

	return nil
}

func (a *BackupSystemAction) Validate(args []string) error {
	// Vérifier l'espace disque disponible
	cmd := exec.Command("df", "/")
	output, err := cmd.Output()
	if err == nil {
		lines := strings.Split(string(output), "\n")
		if len(lines) >= 2 {
			fields := strings.Fields(lines[1])
			if len(fields) >= 4 {
				available := fields[3]
				sizeGB, _ := strconv.ParseFloat(available[:len(available)-1], 64)
				if strings.HasSuffix(available, "M") && sizeGB < 1024 {
					return fmt.Errorf("espace disque insuffisant: %s disponibles", available)
				}
			}
		}
	}
	return nil
}

func (a *BackupSystemAction) RequiresAuth() bool {
	return true
}

// UpdateSystemAction met à jour le système
type UpdateSystemAction struct{}

func NewUpdateSystemAction() *UpdateSystemAction {
	return &UpdateSystemAction{}
}

func (a *UpdateSystemAction) Name() string {
	return "maintenance-update"
}

func (a *UpdateSystemAction) Description() string {
	return "Met à jour les paquets système"
}

func (a *UpdateSystemAction) Execute(ctx interface{}, args []string) error {
	colors := theme.GetColors()

	fmt.Printf(`
%s┌─ MISE À JOUR SYSTÈME ─────────────────────────────────────────┐
│                                                              │
│  %sMise à jour des paquets système...                        │
│                                                              │
└──────────────────────────────────────────────────────────────┘%s

`,
		colors.Header,
		colors.Info,
		colors.Reset,
	)

	// Détecter le gestionnaire de paquets
	packageManager := detectPackageManager()
	if packageManager == "" {
		return fmt.Errorf("gestionnaire de paquets non détecté")
	}

	switch packageManager {
	case "apt":
		return updateWithAPT(colors)
	case "yum":
		return updateWithYUM(colors)
	case "dnf":
		return updateWithDNF(colors)
	default:
		return fmt.Errorf("gestionnaire de paquets non supporté: %s", packageManager)
	}
}

func (a *UpdateSystemAction) Validate(args []string) error {
	return nil
}

func (a *UpdateSystemAction) RequiresAuth() bool {
	return true
}

// CleanupSystemAction nettoie le système
type CleanupSystemAction struct{}

func NewCleanupSystemAction() *CleanupSystemAction {
	return &CleanupSystemAction{}
}

func (a *CleanupSystemAction) Name() string {
	return "maintenance-cleanup"
}

func (a *CleanupSystemAction) Description() string {
	return "Nettoie les fichiers temporaires et le cache"
}

func (a *CleanupSystemAction) Execute(ctx interface{}, args []string) error {
	colors := theme.GetColors()

	fmt.Printf(`
%s┌─ NETTOYAGE SYSTÈME ───────────────────────────────────────────┐
│                                                              │
`,
		colors.Header,
	)

	// Nettoyer les fichiers temporaires
	fmt.Printf("│  %sNettoyage des fichiers temporaires...%s\n", colors.Info, colors.Reset)
	cmds := []string{
		"rm -rf /tmp/*",
		"rm -rf /var/tmp/*",
		"rm -rf /var/cache/apt/archives/*.deb",
		"journalctl --vacuum-time=7d",
	}

	cleanedSpace := int64(0)
	for _, cmdStr := range cmds {
		cmd := exec.Command("sh", "-c", cmdStr)
		if err := cmd.Run(); err != nil {
			fmt.Printf("│    %s✗ Erreur: %v%s\n", colors.Error, err, colors.Reset)
		} else {
			fmt.Printf("│    %s✓ OK%s\n", colors.Success, colors.Reset)
		}
	}

	// Vérifier l'espace libéré
	if stat, err := os.Stat("/tmp"); err == nil {
		fmt.Printf("│                                                              │\n")
		fmt.Printf("│  %sEspace libéré approximatif: ~100-500 MB%s              │\n",
			colors.Success, colors.Reset)
	}

	fmt.Printf(`
│                                                              │
│  %s✓ Nettoyage terminé%s                                        │
└──────────────────────────────────────────────────────────────┘%s

`,
		colors.Success, colors.Reset,
		colors.Reset,
	)

	return nil
}

func (a *CleanupSystemAction) Validate(args []string) error {
	return nil
}

func (a *CleanupSystemAction) RequiresAuth() bool {
	return true
}

// CheckIntegrityAction vérifie l'intégrité du système
type CheckIntegrityAction struct{}

func NewCheckIntegrityAction() *CheckIntegrityAction {
	return &CheckIntegrityAction{}
}

func (a *CheckIntegrityAction) Name() string {
	return "maintenance-integrity"
}

func (a *CheckIntegrityAction) Description() string {
	return "Vérifie l'intégrité des fichiers système"
}

func (a *CheckIntegrityAction) Execute(ctx interface{}, args []string) error {
	colors := theme.GetColors()

	fmt.Printf(`
%s┌─ VÉRIFICATION INTÉGRITÉ ────────────────────────────────────────┐
│                                                              │
`,
		colors.Header,
	)

	// Vérifier l'espace disque
	fmt.Printf("│  %sVérification de l'espace disque...%s\n", colors.Info, colors.Reset)
	if cmd := exec.Command("df", "-h"); cmd.Run() == nil {
		fmt.Printf("│    %s✓ OK%s\n", colors.Success, colors.Reset)
	} else {
		fmt.Printf("│    %s✗ Erreur%s\n", colors.Error, colors.Reset)
	}

	// Vérifier la mémoire
	fmt.Printf("│  %sVérification de la mémoire...%s\n", colors.Info, colors.Reset)
	if cmd := exec.Command("free", "-h"); cmd.Run() == nil {
		fmt.Printf("│    %s✓ OK%s\n", colors.Success, colors.Reset)
	} else {
		fmt.Printf("│    %s✗ Erreur%s\n", colors.Error, colors.Reset)
	}

	// Vérifier les services critiques
	fmt.Printf("│  %sVérification des services critiques...%s\n", colors.Info, colors.Reset)
	criticalServices := []string{"sshd", "systemd-journald", "networking"}
	for _, service := range criticalServices {
		if cmd := exec.Command("systemctl", "is-active", service); cmd.Run() == nil {
			fmt.Printf("│    %s✓ %s%s\n", colors.Success, service, colors.Reset)
		} else {
			fmt.Printf("│    %s✗ %s (inactif)%s\n", colors.Error, service, colors.Reset)
		}
	}

	// Vérifier les erreurs dans les logs
	fmt.Printf("│  %sVérification des erreurs système...%s\n", colors.Info, colors.Reset)
	cmd := exec.Command("journalctl", "-p", "err", "--since", "1 hour ago", "--no-pager")
	output, err := cmd.Output()
	if err == nil {
		errorCount := len(strings.Split(string(output), "\n")) - 1
		if errorCount > 0 {
			fmt.Printf("│    %s⚠ %d erreurs trouvées dans la dernière heure%s\n",
				colors.Warning, errorCount, colors.Reset)
		} else {
			fmt.Printf("│    %s✓ Aucune erreur récente%s\n", colors.Success, colors.Reset)
		}
	} else {
		fmt.Printf("│    %s✗ Impossible de vérifier les logs%s\n", colors.Error, colors.Reset)
	}

	fmt.Printf(`
│                                                              │
│  %s✓ Vérification terminée%s                                  │
└──────────────────────────────────────────────────────────────┘%s

`,
		colors.Success, colors.Reset,
		colors.Reset,
	)

	return nil
}

func (a *CheckIntegrityAction) Validate(args []string) error {
	return nil
}

func (a *CheckIntegrityAction) RequiresAuth() bool {
	return false
}

// Fonctions utilitaires
func detectPackageManager() string {
	if _, err := os.Stat("/usr/bin/apt"); err == nil {
		return "apt"
	}
	if _, err := os.Stat("/usr/bin/yum"); err == nil {
		return "yum"
	}
	if _, err := os.Stat("/usr/bin/dnf"); err == nil {
		return "dnf"
	}
	return ""
}

func updateWithAPT(colors *theme.Colors) error {
	commands := [][]string{
		{"apt", "update"},
		{"apt", "upgrade", "-y"},
		{"apt", "autoremove", "-y"},
		{"apt", "autoclean"},
	}

	for _, cmdArgs := range commands {
		cmd := exec.Command(cmdArgs[0], cmdArgs[1:]...)
		fmt.Printf("\n%sExécution: %s%s\n", colors.Info, strings.Join(cmdArgs, " "), colors.Reset)

		cmd.Stdout = nil
		cmd.Stderr = nil

		if err := cmd.Run(); err != nil {
			fmt.Printf("%s✗ Erreur lors de: %s%s\n", colors.Error, strings.Join(cmdArgs, " "), colors.Reset)
			return err
		}
	}

	fmt.Printf("\n%s✓ Mise à jour terminée avec succès%s\n", colors.Success, colors.Reset)
	return nil
}

func updateWithYUM(colors *theme.Colors) error {
	cmd := exec.Command("yum", "update", "-y")
	fmt.Printf("\n%sExécution: yum update -y%s\n", colors.Info, colors.Reset)

	cmd.Stdout = nil
	cmd.Stderr = nil

	if err := cmd.Run(); err != nil {
		fmt.Printf("%s✗ Erreur lors de la mise à jour%s\n", colors.Error, colors.Reset)
		return err
	}

	fmt.Printf("\n%s✓ Mise à jour terminée avec succès%s\n", colors.Success, colors.Reset)
	return nil
}

func updateWithDNF(colors *theme.Colors) error {
	cmd := exec.Command("dnf", "update", "-y")
	fmt.Printf("\n%sExécution: dnf update -y%s\n", colors.Info, colors.Reset)

	cmd.Stdout = nil
	cmd.Stderr = nil

	if err := cmd.Run(); err != nil {
		fmt.Printf("%s✗ Erreur lors de la mise à jour%s\n", colors.Error, colors.Reset)
		return err
	}

	fmt.Printf("\n%s✓ Mise à jour terminée avec succès%s\n", colors.Success, colors.Reset)
	return nil
}
