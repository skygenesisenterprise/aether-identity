package menu

import (
	"fmt"
	"os/exec"
)

// Stubs pour les fonctions manquantes
func (m *Manager) showInterfacesMenu() error {
	fmt.Println("Assign interfaces - Not implemented yet")
	return nil
}

func (m *Manager) showIPConfigMenu() error {
	fmt.Println("Set interface IP address - Not implemented yet")
	return nil
}

func (m *Manager) showResetPasswordMenu() error {
	fmt.Println("Reset root password - Not implemented yet")
	return nil
}

func (m *Manager) showFactoryResetMenu() error {
	fmt.Println("Reset to factory defaults - Not implemented yet")
	return nil
}

func (m *Manager) showPowerOffMenu() error {
	fmt.Println("Powering off system...")
	cmd := exec.Command("poweroff")
	return cmd.Run()
}

func (m *Manager) showRebootMenu() error {
	fmt.Println("Rebooting system...")
	cmd := exec.Command("reboot")
	return cmd.Run()
}

func (m *Manager) showPingMenu() error {
	fmt.Println("Ping host - Not implemented yet")
	return nil
}

func (m *Manager) showVaultStatus() error {
	fmt.Println("Vault status - Not implemented yet")
	return nil
}

func (m *Manager) showReloadServicesMenu() error {
	fmt.Println("Reloading all services...")
	cmd := exec.Command("systemctl", "daemon-reload")
	return cmd.Run()
}

func (m *Manager) showUpdateMenu() error {
	fmt.Println("Update from console - Not implemented yet")
	return nil
}

func (m *Manager) showRestoreBackupMenu() error {
	fmt.Println("Restore a backup - Not implemented yet")
	return nil
}
