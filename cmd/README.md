<div align="center">

# 🛡️ Aether Identity CMD

[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](https://github.com/skygenesisenterprise/aether-vault/blob/main/LICENSE) [![Go](https://img.shields.io/badge/Go-1.25+-blue?style=for-the-badge&logo=go)](https://golang.org/) [![Cobra](https://img.shields.io/badge/Cobra-1.8+-lightgrey?style=for-the-badge&logo=go)](https://github.com/spf13/cobra) [![Systemd](https://img.shields.io/badge/Systemd-Integrated-green?style=for-the-badge&logo=linux)](https://systemd.io/) [![SSH](https://img.shields.io/badge/SSH-Supported-orange?style=for-the-badge&logo=openssh)](https://www.openssh.com/) [![Debian](https://img.shields.io/badge/Debian-Compatible-red?style=for-the-badge&logo=debian)](https://www.debian.org/)

**🔥 Enterprise Console System - OPNsense-Style Interactive Management for Aether Vault**

A sophisticated system console that provides **complete appliance-style management** for Aether Vault. Featuring **OPNsense-inspired interface**, **comprehensive system actions**, **SSH integration**, and **enterprise-ready architecture** with enhanced capabilities.

[🚀 Quick Start](#-quick-start) • [📋 What's New](#-whats-new) • [📊 Current Status](#-current-status) • [🛠️ Tech Stack](#️-tech-stack) • [🏗️ Architecture](#-architecture) • [🤝 Contributing](#-contributing)

[![GitHub stars](https://img.shields.io/github/stars/skygenesisenterprise/aether-vault?style=social)](https://github.com/skygenesisenterprise/aether-vault/stargazers) [![GitHub forks](https://img.shields.io/github/forks/skygenesisenterprise/aether-vault?style=social)](https://github.com/skygenesisenterprise/aether-vault/network) [![GitHub issues](https://img.shields.io/github/issues/github/skygenesisenterprise/aether-vault)](https://github.com/skygenesisenterprise/aether-vault/issues)

</div>

---

## 🌟 What is Aether Vault CMD?

**Aether Vault CMD** is a comprehensive system console that transforms server administration into an **enterprise appliance experience**. Inspired by industry-leading solutions like OPNsense and pfSense, it provides **complete system management** through an intuitive SSH interface with **modular action system**, **security-first design**, and **production-ready deployment**.

### 🎯 Our Vision

- **🛡️ Enterprise Console Architecture** - Go 1.25+ backend with **OPNsense-style interface**
- **📦 Modular Action System** - **System**, **Services**, **Network**, **Security**, **Maintenance**, **Vault** modules
- **🔐 Security-First Design** - Local authentication with **PAM integration** and **permission management**
- **⚡ High-Performance Backend** - Go-based CLI with **Cobra framework** and **systemd integration**
- **🎨 Terminal UX Excellence** - **Colorized interfaces**, **ASCII art banners**, **responsive layouts**
- **🔗 SSH Integration** - **Automatic shell replacement** with **welcome banners** and **menu system**
- **🏗️ Enterprise-Ready Architecture** - Scalable, maintainable, and production-tested
- **📚 Comprehensive Documentation** - **Complete API docs** and **development guidelines**
- **🛠️ Developer-Friendly** - **Extensible plugin system**, **hot reload**, **type-safe Go modules**

---

## 🆕 What's New - Recent Evolution

### 🎯 **Major Features in v1.0+**

#### 🖥️ **Complete Console Interface** (NEW)

- ✅ **OPNsense-Style Menu** - Numbered options with intuitive navigation
- ✅ **ASCII Art Banners** - Professional system welcome screens
- ✅ **SSH Integration** - Automatic shell replacement with MOTD
- ✅ **Colorized Interface** - Terminal colors with visual feedback
- ✅ **System Information Display** - Hostname, kernel, uptime, network status

#### 🏗️ **Modular Action System** (NEW)

- ✅ **System Actions** - Status, shutdown, reboot, information display
- ✅ **Service Management** - Complete systemd integration with start/stop/restart
- ✅ **Network Management** - Interface listing, IP configuration, ping tools
- ✅ **Security Management** - User management, SSH keys, audit logs
- ✅ **Maintenance Actions** - Backup, update, cleanup, integrity checks
- ✅ **Vault Integration** - Status, tokens, seal/unseal operations

#### 🔧 **Enhanced Development Infrastructure** (IMPROVED)

- ✅ **Make-Driven Workflow** - Comprehensive build and deployment automation
- ✅ **Modular Architecture** - Clean separation with internal packages
- ✅ **Type-Safe Interfaces** - Go interfaces for extensibility and testing
- ✅ **Production Deployment** - systemd service integration and shell wrapper
- ✅ **Configuration Management** - YAML-based configuration with validation

---

## 📊 Current Status

> **✅ Production Ready**: Complete console system with OPNsense-style interface and full system management.

### ✅ **Currently Implemented**

#### 🏗️ **Core Console Foundation**

- ✅ **Complete CLI Interface** - Cobra-based command structure with subcommands
- ✅ **OPNsense-Style Menu** - Interactive numbered menu system
- ✅ **SSH Integration** - Automatic shell replacement with MOTD
- ✅ **Systemd Integration** - Service management and status monitoring
- ✅ **Banner System** - ASCII art with system information display
- ✅ **Colorized Interface** - Terminal colors with visual status indicators

#### 🎯 **Modular Action System** (NEW)

- ✅ **System Actions** - Complete system status, shutdown/reboot controls
- ✅ **Service Management** - Full systemd integration with listing/control
- ✅ **Network Management** - Interface discovery, IP configuration, ping
- ✅ **Security Management** - User listing, SSH key management, audit logs
- ✅ **Maintenance Suite** - System backup, updates, cleanup, integrity checks
- ✅ **Vault Actions** - Vault Core status and management interface

#### 🛠️ **Development Infrastructure** (NEW)

- ✅ **Extensible Architecture** - Interface-based action system
- ✅ **Configuration Management** - YAML configuration with validation
- ✅ **Production Scripts** - Installation, service setup, shell integration
- ✅ **Documentation** - Complete architecture and development guides
- ✅ **Build System** - Make-based build and deployment automation

### 🔄 **In Development**

- **Advanced Security Features** - Role-based access control, session management
- **Plugin System** - External action module loading
- **Real-time Monitoring** - System metrics and live logs
- **Advanced Network Tools** - Firewall management, route configuration
- **Vault Integration** - Complete Vault Core API client

### 📋 **Planned Features**

- **Web Console** - Web-based management interface
- **Cluster Management** - Multi-node appliance management
- **Advanced Diagnostics** - System health checks and troubleshooting
- **Backup Automation** - Scheduled backups with retention policies
- **API Access** - RESTful API for external integrations

---

## 🚀 Quick Start

### 📋 Prerequisites

- **Go** 1.25.0 or higher (for compilation)
- **Debian/Ubuntu** system (recommended for appliance mode)
- **systemd** for service management (recommended)
- **SSH server** for remote management (recommended)
- **Make** (included with most Linux distributions)
- **Root/sudo access** for system administration features

### 🔧 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/skygenesisenterprise/aether-vault.git
   cd aether-vault/cmd
   ```

2. **Quick installation** (recommended)

   ```bash
   # One-command build and install
   sudo make install
   ```

3. **Manual setup**

   ```bash
   # Build the binary
   make build

   # Install to system
   sudo cp build/vaultctl /usr/local/bin/
   sudo chmod +x /usr/local/bin/vaultctl

   # Install systemd service
   sudo cp scripts/vaultctl.service /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable vaultctl
   ```

4. **SSH Integration** (recommended)

   ```bash
   # Set vaultctl as default shell for root
   sudo chsh -s /usr/local/bin/vaultctl root

   # Or set as MOTD for all users
   echo '/usr/local/bin/vaultctl' >> /etc/motd
   ```

### 🌐 Access Points

Once installed, you can access the console:

- **Local Console**: `sudo vaultctl` (direct execution)
- **SSH Access**: `ssh root@your-server` (automatic welcome)
- **Systemd Service**: `sudo systemctl start vaultctl` (background service)
- **Shell Replacement**: Login as root (automatic menu display)

### 🎯 **Enhanced Make Commands**

```bash
# 🚀 Build & Installation
make build               # Build vaultctl binary
make install              # Install to system with service
make clean                # Clean build artifacts
make dev                  # Run in development mode

# 🏗️ Development & Testing
make test                 # Run unit tests
make lint                 # Run Go linter
make fmt                  # Format Go code
make deps                  # Download dependencies

# 🐳 Docker Support
make docker-build         # Build Docker image
make docker-test          # Run tests in Docker
```

> 💡 **Tip**: Run `make help` to see all available commands with descriptions.

---

## 🛠️ Tech Stack

### ⚙️ **Core Console Layer**

```
Go 1.25+ + Cobra CLI Framework
├── 🖥️ Interactive Menu System (Numbered Interface)
├── 🎨 Terminal Colors & ASCII Art (Visual Experience)
├── 🔧 Modular Actions System (Plugin Architecture)
├── 🛡️ Security & Authentication (Local PAM)
├── 🌐 System Integration (systemd, network, users)
├── 📊 Real-time Information (System Status Display)
└── 🔄 State Management (Session & Context)
```

### 📦 **Action Modules Layer**

```
Modular Action System
├── 🏗️ System Actions (Status, Power, Information)
├── ⚙️ Service Management (systemd integration)
├── 🌐 Network Management (Interfaces, IP, Diagnostics)
├── 🛡️ Security Management (Users, SSH, Audit)
├── 🔧 Maintenance Suite (Backup, Update, Cleanup)
└── 🔐 Vault Integration (Status, Tokens, Operations)
```

### 🏗️ **System Integration Layer**

```
Linux System Integration
├── 📋 systemd Service Management
├── 🖥️ SSH Shell Replacement
├── 🔧 System Command Execution
├── 📊 /proc File System Access
├── 🌐 Network Interface Discovery
├── 👤 User Management Integration
└── 🗄️ File System Operations
```

### 🚀 **Deployment Infrastructure**

```
Production Deployment
├── 📦 Binary Distribution (Single executable)
├── 🔧 Systemd Service Integration
├── 🖥️ SSH Shell Wrapper Scripts
├── 📝 Configuration Management (YAML)
├── 🐳 Docker Container Support
└── 🛠️ Installation & Setup Scripts
```

---

## 🏗️ Architecture

### 🎯 **Modular Console Architecture**

```
cmd/
├── 📦 vaultctl/                   # Main Binary & CLI Commands
│   ├── main.go                    # Application Entry Point
│   ├── root.go                    # Root Command Configuration
│   └── commands.go                # Subcommand Definitions
├── 🔧 internal/                   # Internal Packages (Non-exportable)
│   ├── 🎨 banner/                # ASCII Art & System Info
│   ├── 📋 menu/                  # Interactive Menu System
│   ├── ⚡ actions/               # Modular Action System
│   │   ├── 🏗️ system/          # System Management Actions
│   │   ├── ⚙️ services/        # Service Management
│   │   ├── 🌐 network/          # Network Management
│   │   ├── 🛡️ security/        # Security Management
│   │   ├── 🔧 maintenance/      # Maintenance Actions
│   │   └── 🔐 vault/           # Vault Integration
│   ├── 🧠 context/               # Session & State Management
│   ├── 🎨 ui/                    # User Interface Components
│   ├── 🔐 auth/                   # Authentication & Authorization
│   ├── ⚙️ config/                 # Configuration Management
│   └── 🛠️ utils/                  # System Utilities
├── 📦 pkg/                        # Public Packages (Exportable)
├── 📝 configs/                    # Configuration Files
├── 🛠️ scripts/                    # Installation & Setup Scripts
└── 📚 docs/                       # Documentation
```

### 🔄 **Console Flow Architecture**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   SSH Login     │    │  Banner Display  │    │  Main Menu     │
│   (User Auth)   │◄──►│  (System Info)   │◄──►│  (Interactive)  │
│  Port 22       │    │  ASCII Art      │    │  Numbered UI    │
│  shell/bash    │    │  Status Display │    │  Colorized      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
            │                       │                       │
            ▼                       ▼                       ▼
      Authentication           System Information        Action Selection
      PAM/Local            Hostname/Kernel           Module Choice
      Session Start          Uptime/Memory             Command Input
            │                       │                       │
            ▼                       ▼                       ▼
     ┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
     │  Action Module  │   │  System Control  │   │  Service Mgmt  │
     │  (Specific)    │   │  (Power/Info)   │   │  (systemd)      │
     │  Execute Cmd    │   │  Shell Commands │   │  Service List   │
     │  Show Result   │   │  System Status   │   │  Start/Stop     │
     └─────────────────┘    └──────────────────┘    └─────────────────┘
```

### 📦 **Action Module Interface**

```go
// Standardized Action Interface
type Action interface {
    Name() string           // Action identifier
    Description() string     // Human-readable description
    Execute(ctx Context, args []string) error  // Main execution
    Validate(args []string) error                 // Input validation
    RequiresAuth() bool        // Authentication requirement
}

// Menu Interface
type Menu interface {
    Title() string            // Menu title
    Options() []Option       // Available options
    Execute(option int) error // Option execution
    Back() Menu             // Navigation
}
```

---

## 🖥️ Console Preview

### 🎯 **SSH Login Experience**

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

### 📋 **Usage Examples**

#### Basic Console Operations

```bash
# Start interactive console
sudo vaultctl

# Direct command execution
vaultctl status
vaultctl services list
vaultctl network interfaces
vaultctl security users
vaultctl maintenance backup

# Service management
vaultctl service start nginx
vaultctl service restart sshd
vaultctl service stop fail2ban
```

#### Advanced Operations

```bash
# Network management
vaultctl network interfaces    # List all interfaces
vaultctl network ping 8.8.8.8  # Test connectivity
vaultctl network ip eth0       # Show IP configuration

# Security operations
vaultctl security users       # List system users
vaultctl security ssh-keys    # Show SSH host keys
vaultctl security audit      # Display security logs
```

#### SSH Integration Workflow

```bash
# Automatic console on SSH login
ssh root@your-server
# -> Displays welcome banner
# -> Shows interactive menu
# -> Provides numbered options

# Shell access from menu
# Option 8) Shell
# -> Launches secure bash shell
# -> Type 'exit' to return to menu
```

For more detailed console previews and screenshots, see: [docs/CONSOLE_PREVIEW.md](docs/CONSOLE_PREVIEW.md)

---

## 🤝 Contributing

We're looking for contributors to help build this **enterprise console system**! Whether you're experienced with Go, system administration, CLI development, or appliance interfaces, there's a place for you.

### 🎯 **How to Get Started**

1. **Fork the repository** and create a feature branch
2. **Check issues** for tasks that need help
3. **Join discussions** about architecture and features
4. **Start small** - Documentation, tests, or minor features
5. **Follow our code standards** and commit guidelines

### 🏗️ **Areas Needing Help**

- **Go Backend Development** - CLI commands, system integration, action modules
- **System Administration** - Service management, security features, network tools
- **UI/UX Design** - Terminal interface improvements, menu optimization
- **Security Experts** - Authentication, access control, audit systems
- **DevOps Engineers** - Deployment automation, Docker integration
- **Documentation** - User guides, API docs, technical writing
- **Testing** - Unit tests, integration tests, system validation

### 📝 **Contribution Process**

1. **Choose an area** - Core console, action modules, or system integration
2. **Read the guidelines** - Understand our architecture and standards
3. **Create a branch** with a descriptive name
4. **Implement your changes** following our interface patterns
5. **Test thoroughly** in development environments
6. **Submit a pull request** with clear description and testing
7. **Address feedback** from maintainers and community

---

## 📞 Support & Community

### 💬 **Get Help**

- 📖 **[Documentation](docs/)** - Comprehensive guides and API docs
- 📋 **[Architecture Guide](ARCHITECTURE.md)** - System architecture overview
- 📝 **[Development Guidelines](docs/GUIDELINES.md)** - Contributing guidelines
- 🐛 **[GitHub Issues](https://github.com/skygenesisenterprise/aether-vault/issues)** - Bug reports and feature requests
- 💡 **[GitHub Discussions](https://github.com/skygenesisenterprise/aether-vault/discussions)** - General questions and ideas
- 📧 **Email** - support@skygenesisenterprise.com

### 🐛 **Reporting Issues**

When reporting bugs, please include:

- Clear description of problem
- Steps to reproduce
- Environment information (Go version, OS, systemd version)
- Error logs or screenshots
- Expected vs actual behavior
- Module or action-specific information

---

## 📊 Project Status

| Component               | Status         | Technology              | Notes                               |
| ----------------------- | -------------- | ----------------------- | ----------------------------------- |
| **Console Interface**   | ✅ Working     | Go + Cobra              | OPNsense-style interactive menu     |
| **Action System**       | ✅ Working     | Go Interfaces           | Modular extensible architecture     |
| **System Integration**  | ✅ Working     | systemd + Linux         | Full system control and monitoring  |
| **SSH Integration**     | ✅ Working     | SSH + Shell Wrapper     | Automatic console on login          |
| **Service Management**  | ✅ Working     | systemd API             | Start/stop/restart with status      |
| **Network Management**  | ✅ Working     | ip/proc commands        | Interface discovery and diagnostics |
| **Security Management** | ✅ Working     | /etc/passwd + auth logs | User management and audit logs      |
| **Maintenance Suite**   | ✅ Working     | tar + apt/yum           | Backup, update, cleanup, checks     |
| **Vault Integration**   | 🔄 In Progress | Vault API               | Status and management interface     |
| **Configuration**       | ✅ Working     | YAML + Viper            | Flexible config management          |
| **Documentation**       | ✅ Working     | Markdown + GoDocs       | Comprehensive guides                |
| **Build System**        | ✅ Working     | Make + Go Modules       | Automated build and deployment      |
| **Docker Support**      | ✅ Working     | Multi-stage Docker      | Container deployment option         |
| **Testing Suite**       | 📋 Planned     | Go testing              | Unit and integration tests          |

---

## 🏆 Sponsors & Partners

**Development led by [Sky Genesis Enterprise](https://skygenesisenterprise.com)**

We're looking for sponsors and partners to help accelerate development of this open-source enterprise console system.

[🤝 Become a Sponsor](https://github.com/sponsors/skygenesisenterprise)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](../LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Sky Genesis Enterprise

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🙏 Acknowledgments

- **Sky Genesis Enterprise** - Project leadership and vision
- **Go Community** - High-performance programming language and ecosystem
- **Cobra Team** - Excellent CLI framework for Go
- **systemd Team** - Modern Linux service management
- **OPNsense Project** - Inspiration for interface design
- **pfSense Project** - Network appliance interface patterns
- **OpenSSH Team** - Secure shell and remote access
- **Linux Community** - System tools and utilities
- **Debian Project** - Stable and secure base system
- **Open Source Community** - Tools, libraries, and inspiration

---

<div align="center">

### 🚀 **Join Us in Building the Future of Enterprise Console Management!**

[⭐ Star This Repo](https://github.com/skygenesisenterprise/aether-vault) • [🐛 Report Issues](https://github.com/skygenesisenterprise/aether-vault/issues) • [💡 Start a Discussion](https://github.com/skygenesisenterprise/aether-vault/discussions)

---

**🛡️ Enterprise-Ready Console with OPNsense-Style Interface!**

**Made with ❤️ by the [Sky Genesis Enterprise](https://skygenesisenterprise.com) team**

_Building enterprise-grade console management with security, modularity, and exceptional user experience_

</div>
