# 🖥️ Console Preview

When you SSH into an Aether Vault server, you'll experience a professional OPNsense-style interface:

```
------------------------------------------------
|              Hello, this is AETHER VAULT     |           :::::::.
|                                              |           :::::::::.
|  Website:     https://aether-vault.io/       |        :::        :::
|  Handbook:    https://docs.aether-vault.io/  |        :::        :::
|  Forums:      https://forum.aether-vault.io/ |        :::        :::
|  Code:        https://github.com/aether-vault|         `:::::::::
|  Reddit:      https://reddit.com/r/aethervault|           `:::::::
------------------------------------------------

*** vault01.local: Aether Vault 1.0.0 (amd64) ***

 LAN (eth0)    -> v4/DHCP4: 192.168.1.100/24

 SSH:   SHA256 KIA9sznSNgfI62XARZu2fUsqphfmaT6t85X1Ig0r8x8 (ECDSA)
 SSH:   SHA256 GuXWJcRtkC4zmJzRJi0DOCAZElkO9+U6oW89asIPfYc (ED25519)
 SSH:   SHA256 0F0DJElCEDH9BqUlVgbUAAgcsLNQkUatU79ODO+V7AU (RSA)

  0) Logout                              7) Ping host
  1) Assign interfaces                   8) Shell
  2) Set interface IP address            9) Vault status
  3) Reset root password                10) Logs
  4) Reset to factory defaults          11) Reload all services
  5) Power off system                   12) Update from console
  6) Reboot system                      13) Restore a backup

Enter an option:
```

## 🎨 Interactive Menu System

### System Status Display

```
┌─ SYSTÈME STATUS ────────────────────────────────────────────────┐
│                                                              │
│  Hostname:    vault01.local          │  Kernel: 6.1.0-21-amd64   │
│  Platform:    linux                   │  Arch:   amd64              │
│  Uptime:      2 days, 14:32:15      │  Load:   0.15 0.12 0.08    │
│                                                              │
└───────────────────────────────────────────────────────────────────────┘

┌─ MÉMOIRE ────────────────────────────────────────────────────┐
│  Total:     8.0GiB               │  Utilisée:  4.2GiB    │
│  Disponible: 3.8GiB               │  Pourcent:  52.5%     │
└───────────────────────────────────────────────────────────────────┘
```

### Service Management

```
┌─ SERVICES SYSTÈME ────────────────────────────────────────────┐
│                                                              │
│  ✓ sshd                       active  OpenSSH Daemon          │
│  ✓ vaultctl                    active  Aether Vault Console   │
│  ✓ networking                  active  Network Manager        │
│  ✓ vault-core                  active  Vault Core Service     │
│  ○ nginx                       inactive Web Server             │
│  ✓ firewalld                   active  Firewall Daemon        │
│                                                              │
│  Total: 6 services affichés                               │
└───────────────────────────────────────────────────────────────────┘
```

### Network Interface Information

```
┌─ INTERFACES RÉSEAU ──────────────────────────────────────────┐
│                                                              │
│  ● eth0                       UP                           │
│    IPv4: 192.168.1.100/20                            │
│    MAC:  52:54:00:12:34:56                            │
│                                                              │
│  ○ eth1                       DOWN                         │
│                                                              │
└───────────────────────────────────────────────────────────────────┘

┌─ ROUTES PAR DÉFAUT ──────────────────────────────────────────┐
│                                                              │
│  Passerelle:  192.168.1.1         Interface:  eth0      │
│                                                              │
└───────────────────────────────────────────────────────────────────┘
```

### Security Management

```
┌─ UTILISATEURS SYSTÈME ─────────────────────────────────────────┐
│                                                              │
│  ✓ ● root           UID: 0        /root                   │
│  ○ admin          UID: 1000      /home/admin              │
│  ○ user           UID: 1001      /home/user              │
│                                                              │
│  Total: 3 utilisateurs affichés                           │
└───────────────────────────────────────────────────────────────────────┘

┌─ CLÉS SSH SERVEUR ────────────────────────────────────────────┐
│                                                              │
│  Hôte RSA:     SHA256 0F0DJElCEDH9BqUlVgbUAAgcsLNQkUatU79ODO+V7AU │
│  Hôte ECDSA:   SHA256 KIA9sznSNgfI62XARZu2fUsqphfmaT6t85X1Ig0r8x8 │
│  Hôte ED25519: SHA256 GuXWJcRtkC4zmJzRJi0DOCAZElkO9+U6oW89asIPfYc │
│                                                              │
│  Clés SSH utilisateur:/root/.ssh/authorized_keys          │
│    • workstation-2024                                       │
│    • laptop-development                                       │
│                                                              │
└───────────────────────────────────────────────────────────────────┘
```

### Maintenance Operations

```
┌─ SAUVEGARDE SYSTÈME ─────────────────────────────────────────┐
│                                                              │
│  Fichier:  /tmp/aether-vault-backup-20250105-143022.tar.gz  │
│  Date:     2025-01-05 14:30:22                           │
│                                                              │
│  ! Cette opération peut prendre plusieurs minutes                │
│                                                              │
└───────────────────────────────────────────────────────────────┘

Début de la sauvegarde...
✓ Sauvegarde terminée avec succès
  Fichier: /tmp/aether-vault-backup-20250105-143022.tar.gz
  Taille:  2.34 GB
```

## 🔧 Command Examples

### Direct Command Usage

```bash
# System information
$ sudo vaultctl system-status
# → Displays complete system overview with memory, disk, and network

# Service management
$ sudo vaultctl service list
# → Shows all systemd services with status

$ sudo vaultctl service restart nginx
# → Restarts nginx service with confirmation

# Network diagnostics
$ sudo vaultctl network ping 8.8.8.8
# → Tests connectivity to Google DNS
PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=12.3ms

# Security operations
$ sudo vaultctl security users
# → Lists all system users with login status

# Maintenance tasks
$ sudo vaultctl maintenance backup
# → Creates complete system backup
✓ Backup completed: /tmp/vault-backup-20250105-143022.tar.gz
```

### SSH Integration Workflow

```bash
# Connect to server
$ ssh root@192.168.1.100
Last login: Mon Jan  5 14:30:22 2026 from 192.168.1.21
------------------------------------------------
|              Hello, this is AETHER VAULT     |           :::::::.
|                                              |           :::::::::.
|  Website:     https://aether-vault.io/       |        :::        :::
|  Handbook:    https://docs.aether-vault.io/  |        :::        :::
|  Forums:      https://forum.aether-vault.io/ |        :::        :::
|  Code:        https://github.com/aether-vault|         `:::::::::
|  Reddit:      https://reddit.com/r/aethervault|           `:::::::
------------------------------------------------

*** vault01.local: Aether Vault 1.0.0 (amd64) ***
[Previous menu selection: 9]

Enter an option: 9
┌─ VAULT CORE STATUS ───────────────────────────────────────────┐
│                                                              │
│  Status:      ✓ Active and Initialized                        │
│  Version:     1.12.3                                        │
│  Sealed:      ✓ Unsealed                                     │
│  Leader:      ✓ This node is leader                           │
│  Storage:     Raft (3 nodes)                                │
│                                                              │
└───────────────────────────────────────────────────────────────────┘

Press Enter to continue...

Enter an option: 0
Logout...
Connection to 192.168.1.100 closed.
```

## 🎨 Terminal Features

### Color Coding

- ✅ **Green** - Active, successful, online
- ⚠️ **Yellow** - Warning, inactive, offline
- ❌ **Red** - Error, failed, critical
- 🔵 **Blue** - Information, neutral
- 🟣 **Magenta** - User interfaces
- 🟡 **Cyan** - System components

### Interactive Elements

- **Numbered menus** for easy navigation
- **Progress indicators** for long operations
- **Confirmation prompts** for destructive actions
- **Status symbols** (✓○✗) for quick visual feedback
- **Real-time updates** during operations

This console experience provides enterprise-grade system management with the familiarity of traditional appliance interfaces, making server administration intuitive and efficient.
