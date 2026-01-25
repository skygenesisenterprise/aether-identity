# Console User Experience Guide

## 🖥️ Aether Vault Console Experience

This guide demonstrates the complete user experience when interacting with Aether Vault's enterprise console system.

---

## 🎯 SSH Connection Experience

### First Connection

When you first connect to an Aether Vault server via SSH, you're greeted with a professional OPNsense-style interface:

```
ssh root@192.168.1.100
(root@192.168.1.100) Password:
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

### System Status Display

Choosing option 9 shows Vault Core status:

```
Enter an option: 9
┌─ VAULT CORE STATUS ───────────────────────────────────────────┐
│                                                              │
│  Status:      ✓ Active and Initialized                        │
│  Version:     1.12.3                                        │
│  Sealed:      ✓ Unsealed                                     │
│  Leader:      ✓ This node is leader                           │
│  Storage:     Raft (3 nodes)                                │
│  Uptime:      14 days, 3:45:22                             │
│  Requests:    1,247,892 total / 842 per minute              │
│                                                              │
└───────────────────────────────────────────────────────────────────────┘

Press Enter to continue...
```

---

## 🔧 Service Management

### Listing All Services

```
Enter an option: 1
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
└───────────────────────────────────────────────────────────────────────┘

Press Enter to continue...
```

### Controlling Services

```
Enter an option: 3
┌─ SERVICE MANAGEMENT ──────────────────────────────────────────────┐
│                                                              │
│  Available Services:                                          │
│  1) sshd          - SSH Daemon                             │
│  2) vault-core     - Vault Core Service                     │
│  3) nginx          - Web Server                            │
│  4) firewalld      - Firewall Daemon                       │
│                                                              │
│  Select service to manage: 2                                │
│                                                              │
└───────────────────────────────────────────────────────────────────────┘

┌─ SERVICE CONTROL ────────────────────────────────────────────────┐
│                                                              │
│  Service: vault-core                                        │
│  Status: active                                             │
│  Actions:                                                   │
│  1) Start service                                           │
│  2) Stop service                                            │
│  3) Restart service                                         │
│  4) View service status                                    │
│                                                              │
└───────────────────────────────────────────────────────────────────────┘

Select action: 3
✓ Service vault-core redémarré
  Status: active
```

---

## 🌐 Network Management

### Interface Information

```
Enter an option: 2
┌─ INTERFACES RÉSEAU ──────────────────────────────────────────┐
│                                                              │
│  ● eth0                       UP                           │
│    IPv4: 192.168.1.100/20                            │
│    MAC:  52:54:00:12:34:56                            │
│                                                              │
│  ○ eth1                       DOWN                         │
│                                                              │
└───────────────────────────────────────────────────────────────────────┘

┌─ ROUTES PAR DÉFAUT ──────────────────────────────────────────┐
│                                                              │
│  Passerelle:  192.168.1.1         Interface:  eth0      │
│                                                              │
└───────────────────────────────────────────────────────────────────────┘

Press Enter to continue...
```

### Network Diagnostics

```
Enter an option: 7
Test de connectivité vers 8.8.8.8...

PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=12.3ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=117 time=11.8ms
64 bytes from 8.8.8.8: icmp_seq=3 ttl=117 time=12.1ms
64 bytes from 8.8.8.8: icmp_seq=4 ttl=117 time=11.9ms

--- 8.8.8.8 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3003ms
rtt min/avg/max/mdev = 11.800/12.025/12.300/0.196 ms

✓ Ping réussi vers 8.8.8.8
```

---

## 🛡️ Security Management

### User Management

```
Enter an option: 5
┌─ UTILISATEURS SYSTÈME ─────────────────────────────────────────┐
│                                                              │
│  ● root          UID: 0        /root                   │
│  ○ admin         UID: 1000      /home/admin              │
│  ○ operator      UID: 1001      /home/operator           │
│                                                              │
│  Total: 3 utilisateurs affichés                           │
└───────────────────────────────────────────────────────────────────────┘
```

### Security Audit

```
┌─ LOGS D'AUDIT SYSTÈME ───────────────────────────────────────┐
│                                                              │
│  ✗ Failed password for root from 192.168.1.210           │
│  ✓ Accepted password for root from 192.168.1.21            │
│  ⚠ Invalid user admin from 192.168.1.45                  │
│  ○ session opened for root by root(uid=0)                │
│  ✗ Failed password for root from 192.168.1.210           │
│  ✓ Accepted password for root from 192.168.1.21            │
│                                                              │
│  Utilisez 'journalctl -f' pour les logs en temps réel    │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Maintenance Operations

### System Backup

```
Enter an option: 13
┌─ SAUVEGARDE SYSTÈME ─────────────────────────────────────────┐
│                                                              │
│  Fichier:  /tmp/aether-vault-backup-20250105-143022.tar.gz  │
│  Date:     2025-01-05 14:30:22                           │
│                                                              │
│  ! Cette opération peut prendre plusieurs minutes                │
│                                                              │
└───────────────────────────────────────────────────────────────────────┘

Début de la sauvegarde...

✓ Sauvegarde terminée avec succès
  Fichier: /tmp/aether-vault-backup-20250105-143022.tar.gz
  Taille: 2.34 GB
```

### System Update

```
Enter an option: 12
┌─ MISE À JOUR SYSTÈME ─────────────────────────────────────────┐
│                                                              │
│  Mise à jour des paquets système...                        │
│                                                              │
└───────────────────────────────────────────────────────────────────────┘

Exécution: apt update
Get:1 http://security.debian.org/debian-security bullseye-security InRelease [44.2 kB]
Get:2 http://deb.debian.org/debian bullseye InRelease [116 kB]
...
Reading package lists... Done

Exécution: apt upgrade -y
Reading package lists... Done
Building dependency tree... Done
Calculating upgrade... Done
The following packages will be upgraded:
  curl 7.74.0-1.3+deb11u11 -> 7.74.0-1.3+deb11u13
  ...
0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.

✓ Mise à jour terminée avec succès
```

---

## 🚪 Shell Integration

### Secure Shell Access

From the main menu, option 8 provides shell access:

```
Enter an option: 8
Launching shell...
```

The system drops to a secure bash shell with limited permissions:

```bash
root@vault01:~#
# Here you have full shell access
# Type 'exit' to return to the console menu
root@vault01:~# exit
logout
```

### Return to Console

After exiting the shell, users return to the main menu:

```
[Previous menu selection: 8]

Enter an option:
```

---

## 🎨 Terminal Features

### Color Coding System

- ✅ **Green** - Active, successful, online
- ⚠️ **Yellow** - Warning, inactive, offline
- ❌ **Red** - Error, failed, critical
- 🔵 **Blue** - Information, neutral
- 🟣 **Magenta** - User interfaces
- 🟦 **Cyan** - System components

### Interactive Elements

- **Numbered menus** for easy navigation (0-13)
- **Progress indicators** for long-running operations
- **Confirmation prompts** for destructive actions
- **Status symbols** (✓○✗) for quick visual feedback
- **Real-time updates** during operations like backups and updates

### Navigation Patterns

- **Enter** confirms selections and continues
- **0** always returns to previous menu or logs out
- **Ctrl+C** safely cancels operations and returns to menu
- **Tab** completion in shell mode
- **Arrow keys** navigate through history in shell mode

---

## 🔧 Direct Command Usage

For power users and automation, the console can be controlled directly:

```bash
# Get system overview
sudo vaultctl system-status
┌─ SYSTÈME STATUS ────────────────────────────────────────────────┐
│  Hostname:    vault01.local          │  Kernel: 6.1.0-21-amd64   │
│  Platform:    linux                   │  Arch:   amd64              │
│  Uptime:      2 days, 14:32:15      │  Load:   0.15 0.12 0.08    │
└───────────────────────────────────────────────────────────────────────┘

# Service management
sudo vaultctl service restart vault-core
✓ Service vault-core redémarré
  Statut: active

# Network operations
sudo vaultctl network ping google.com
✓ Ping réussi vers google.com

# Security operations
sudo vaultctl security audit
[Shows security logs as in interactive mode]

# Maintenance
sudo vaultctl maintenance backup
[Performs system backup as shown above]
```

---

## 📊 User Experience Benefits

### 🎯 **Intuitive Interface**

- **Familiar OPNsense-style** interface reduces learning curve
- **Consistent navigation** patterns across all modules
- **Visual feedback** with colors and status symbols
- **Numbered options** for quick access

### 🛡️ **Enterprise Security**

- **Secure SSH integration** with automatic key display
- **Audit logging** of all administrative actions
- **Permission-based access** control
- **Safe shell access** with controlled environment

### ⚡ **Efficient Operations**

- **Quick access** to common tasks via numbered menu
- **Batch operations** through direct commands
- **Automation-ready** for scripting and CI/CD
- **Progress feedback** for long-running operations

### 🔧 **Comprehensive Coverage**

- **Complete system management** without needing multiple tools
- **Service lifecycle management** with systemd integration
- **Network diagnostics** and configuration
- **Security monitoring** and user management
- **Maintenance automation** with backup and update capabilities

This console experience provides enterprise-grade system management with the familiarity and efficiency of traditional appliance interfaces, making server administration both powerful and accessible.
