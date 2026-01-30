<div align="center">

# 🐙 Aether Identity GitHub App

[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](https://github.com/skygenesisenterprise/aether-identity/blob/main/LICENSE) [![Go](https://img.shields.io/badge/Go-1.25+-blue?style=for-the-badge&logo=go)](https://golang.org/) [![GitHub App](https://img.shields.io/badge/GitHub_App-Ready-green?style=for-the-badge&logo=github)](https://github.com/marketplace)

**🔐 Enterprise GitHub Integration for Identity & Access Management**

A production-ready GitHub App that seamlessly synchronizes GitHub organizations, teams, and repositories with the Aether Identity platform. Features real-time webhook processing, permission mapping, audit logging, and enterprise-grade security.

[🚀 Quick Start](#-quick-start) • [📋 Features](#-features) • [🛠️ Architecture](#️-architecture) • [⚙️ Configuration](#️-configuration) • [🔒 Security](#-security) • [🤝 Contributing](#-contributing)

</div>

---

## 🌟 What is Aether Identity GitHub App?

**Aether Identity GitHub App** is a comprehensive integration solution that bridges GitHub organizations with the Aether Identity platform. It provides automated user provisioning, team synchronization, repository access management, and complete audit trails for enterprise identity governance.

### 🎯 Key Capabilities

- **🔄 Real-Time Synchronization** - Instant sync of users, teams, and repositories via webhooks
- **🔐 Permission Management** - Map GitHub permissions to identity roles with enforcement
- **📝 Audit Logging** - Complete audit trail of all identity and access changes
- **🛡️ Enterprise Security** - Webhook signature verification, JWT authentication, secure API communication
- **⚡ High Performance** - Go-based architecture with concurrent processing and connection pooling
- **🏢 Multi-Organization** - Support for multiple GitHub installations and enterprise scenarios
- **🐳 Production Ready** - Docker deployment with health checks and graceful shutdown

---

## 📋 Features

### 🔄 **Synchronization Engine**

- ✅ **User Sync** - Automatic user provisioning and deprovisioning
- ✅ **Team Sync** - GitHub team to identity group mapping
- ✅ **Repository Sync** - Repository access and permission synchronization
- ✅ **Incremental Updates** - Efficient delta sync with batch processing
- ✅ **Full Sync** - Complete organization synchronization on demand

### 🔐 **Permission & Access Control**

- ✅ **Permission Mapping** - Map GitHub roles to identity permissions
- ✅ **Access Enforcement** - Real-time permission validation and enforcement
- ✅ **Role-Based Access** - Support for custom role definitions
- ✅ **Repository Permissions** - Fine-grained repository access control

### 📝 **Audit & Compliance**

- ✅ **Audit Logging** - Complete audit trail of all operations
- ✅ **Event Tracking** - Track user access, permission changes, and sync events
- ✅ **Compliance Ready** - Structured logs for security auditing
- ✅ **Change History** - Historical record of identity modifications

### 🛡️ **Security Features**

- ✅ **Webhook Security** - HMAC-SHA256 signature verification
- ✅ **JWT Authentication** - Secure GitHub App authentication
- ✅ **API Key Protection** - Secure communication with Identity API
- ✅ **Input Validation** - Comprehensive request validation
- ✅ **Rate Limiting** - Built-in rate limiting protection

### 🏗️ **Enterprise Features**

- ✅ **GitHub Enterprise** - Support for GitHub Enterprise Server
- ✅ **Multi-Installation** - Handle multiple GitHub App installations
- ✅ **Scalable Architecture** - Concurrent processing with goroutines
- ✅ **Health Monitoring** - Health checks and metrics endpoints
- ✅ **Graceful Shutdown** - Clean shutdown with in-flight request handling

---

## 🚀 Quick Start

### 📋 Prerequisites

- **Go** 1.25.0 or higher
- **GitHub App** - Created on GitHub.com or GitHub Enterprise
- **Aether Identity API** - Running and accessible
- **Docker** (optional, for containerized deployment)
- **Make** (for command shortcuts)

### 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/skygenesisenterprise/aether-identity.git
   cd aether-identity/package/github
   ```

2. **Install Go dependencies**

   ```bash
   go mod download
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your GitHub App credentials
   ```

4. **Run the application**

   ```bash
   # Development mode
   make dev

   # Or run directly
   go run main.go
   ```

### 🐳 Docker Deployment

```bash
# Build and run with Docker
docker-compose up -d

# View logs
docker-compose logs -f github-app
```

### 🌐 Access Points

Once running, the following endpoints are available:

- **Health Check**: `http://localhost:8080/health`
- **Webhook Endpoint**: `http://localhost:8080/webhook` (for GitHub webhooks)
- **Metrics**: `http://localhost:8080/metrics`
- **Installation Sync**: `http://localhost:8080/installations/sync` (POST)

---

## ⚙️ Configuration

### Required Environment Variables

| Variable                    | Description                                 | Required |
| --------------------------- | ------------------------------------------- | -------- |
| `GITHUB_APP_ID`             | Your GitHub App ID                          | ✅       |
| `GITHUB_APP_PRIVATE_KEY`    | GitHub App private key (PEM format)         | ✅       |
| `GITHUB_APP_WEBHOOK_SECRET` | Webhook secret for signature verification   | ✅       |
| `IDENTITY_API_URL`          | Aether Identity API base URL                | ✅       |
| `IDENTITY_API_KEY`          | API key for Identity service authentication | ✅       |

### Optional Environment Variables

| Variable                | Description                              | Default   |
| ----------------------- | ---------------------------------------- | --------- |
| `GITHUB_APP_PORT`       | HTTP server port                         | `8080`    |
| `GITHUB_APP_HOST`       | HTTP server host                         | `0.0.0.0` |
| `GITHUB_CLIENT_ID`      | GitHub App OAuth client ID               | -         |
| `GITHUB_CLIENT_SECRET`  | GitHub App OAuth client secret           | -         |
| `GITHUB_ENTERPRISE_URL` | GitHub Enterprise Server URL             | -         |
| `SYNC_ENABLED`          | Enable automatic synchronization         | `true`    |
| `SYNC_INTERVAL`         | Sync interval duration                   | `5m`      |
| `LOG_LEVEL`             | Logging level (debug, info, warn, error) | `info`    |
| `LOG_FORMAT`            | Log format (json, text)                  | `json`    |

### GitHub App Setup

1. **Create a GitHub App** at Settings → Developer settings → GitHub Apps
2. **Set webhook URL** to your deployed app URL + `/webhook`
3. **Generate private key** and download the PEM file
4. **Configure permissions**:
   - Repository: Read (for repository sync)
   - Organization: Read (for team and member sync)
   - User: Read (for user profile sync)
5. **Subscribe to events**:
   - Installation
   - Installation repositories
   - Organization
   - Membership
   - Team
   - Repository

---

## 🛠️ Architecture

### 🏗️ **Package Structure**

```
package/github/
├── main.go                 # Application entry point
├── config/                 # Configuration management
│   └── config.go          # Environment-based config loading
├── github/                 # GitHub API client
│   ├── client.go          # GitHub App authentication & API client
│   ├── events.go          # Webhook event parsing
│   └── types.go           # GitHub data structures
├── identity/               # Aether Identity API client
│   ├── client.go          # Identity API communication
│   ├── models.go          # Identity data models
│   └── audit.go           # Audit logging service
├── permissions/            # Permission management
│   ├── checker.go         # Permission validation
│   ├── mapper.go          # GitHub to identity mapping
│   └── enforcement.go     # Permission enforcement
├── server/                 # HTTP server & handlers
│   ├── server.go          # HTTP server setup
│   ├── webhooks.go        # Webhook processing
│   └── middleware.go      # HTTP middleware
├── sync/                   # Synchronization engine
│   ├── sync.go            # Sync orchestration
│   ├── users.go           # User synchronization
│   ├── teams.go           # Team synchronization
│   └── repositories.go    # Repository synchronization
├── errors/                 # Error handling
│   └── errors.go          # Custom error types
├── Dockerfile             # Container image
├── docker-compose.yml     # Docker orchestration
└── Makefile              # Build automation
```

### 🔄 **Data Flow Architecture**

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   GitHub        │     │   GitHub App     │     │   Aether        │
│   (Source)      │────►│   (This Package) │────►│   Identity      │
│                 │     │                  │     │   (Target)      │
└─────────────────┘     └──────────────────┘     └─────────────────┘
         │                       │                       │
         │ Webhooks              │ Process               │ API Calls
         │ (Events)              │ (Sync/Permissions)    │ (CRUD)
         │                       │                       │
         ▼                       ▼                       ▼
  ┌─────────────┐          ┌─────────────┐         ┌─────────────┐
  │ User Events │          │  Sync       │         │  Users      │
  │ Team Events │          │  Manager    │         │  Teams      │
  │ Repo Events │          │             │         │  Audit Log  │
  └─────────────┘          └─────────────┘         └─────────────┘
```

### 🎯 **Core Components**

#### **GitHub Client** (`github/`)

- JWT-based GitHub App authentication
- Webhook event parsing and validation
- GraphQL and REST API operations

#### **Identity Client** (`identity/`)

- RESTful API communication with Aether Identity
- User, team, and repository CRUD operations
- Audit logging integration

#### **Sync Manager** (`sync/`)

- Orchestrates user, team, and repository synchronization
- Batch processing with concurrency control
- Incremental and full sync capabilities

#### **Permission System** (`permissions/`)

- Maps GitHub permissions to identity roles
- Validates access permissions in real-time
- Enforces permission policies

#### **Webhook Handler** (`server/webhooks.go`)

- Processes GitHub webhook events
- Routes events to appropriate handlers
- Validates webhook signatures

---

## 🔒 Security

### 🛡️ **Security Features**

- **Webhook Signature Verification** - All webhooks are validated using HMAC-SHA256
- **JWT Authentication** - GitHub App uses signed JWT tokens for API access
- **API Key Authentication** - Secure API key-based communication with Identity service
- **Input Validation** - Comprehensive validation of all incoming data
- **No Secret Logging** - Sensitive data is never logged
- **Secure Configuration** - Environment-based configuration with validation

### 🔐 **Webhook Security**

```go
// Webhook signatures are verified using HMAC-SHA256
signature := r.Header.Get("X-Hub-Signature-256")
expected := calculateHMAC(payload, webhookSecret)
if !hmac.Equal(signature, expected) {
    return errors.New("invalid webhook signature")
}
```

### 📝 **Audit Logging**

All security-relevant events are logged:

- User access grants/revocations
- Permission changes
- Synchronization events
- Authentication attempts
- Configuration changes

---

## 🛠️ Development

### 🎯 **Make Commands**

```bash
# Development
make dev              # Run in development mode
make build            # Build binary
make test             # Run tests
make clean            # Clean build artifacts

# Docker
make docker-build     # Build Docker image
make docker-run       # Run with Docker Compose
make docker-stop      # Stop Docker services

# Code Quality
make lint             # Run linter
make fmt              # Format Go code
make vet              # Run go vet

# Utilities
make help             # Show all commands
```

### 🏗️ **Development Workflow**

```bash
# Setup
git clone https://github.com/skygenesisenterprise/aether-identity.git
cd aether-identity/package/github
go mod download

# Configure
cp .env.example .env
# Edit .env with your credentials

# Run
go run main.go

# Test
make test

# Build
make build
```

### 🧪 **Testing**

```bash
# Run all tests
go test ./...

# Run with coverage
go test -cover ./...

# Run specific package tests
go test ./sync/...
go test ./permissions/...
```

---

## 📊 Monitoring & Observability

### 🏥 **Health Checks**

- **Endpoint**: `GET /health`
- **Response**: `{"status":"healthy","service":"aether-identity-github-app"}`

### 📈 **Metrics**

- **Endpoint**: `GET /metrics`
- **Available Metrics**:
  - Webhook processing count
  - Sync operation duration
  - API call latency
  - Error rates
  - Active installations

### 📝 **Logging**

Structured JSON logging with configurable levels:

- `debug` - Detailed debugging information
- `info` - General operational information
- `warn` - Warning events
- `error` - Error events

---

## 🤝 Contributing

We welcome contributions to the Aether Identity GitHub App!

### 🎯 **How to Contribute**

1. **Fork the repository** and create a feature branch
2. **Follow Go best practices** - Idiomatic Go code with proper error handling
3. **Add tests** for new functionality
4. **Update documentation** for API changes
5. **Submit a pull request** with clear description

### 🏗️ **Areas for Contribution**

- **Additional GitHub Events** - Support for more webhook event types
- **Enhanced Permission Models** - More granular permission mappings
- **Performance Optimization** - Faster sync operations
- **Monitoring Integration** - Prometheus, Grafana dashboards
- **Testing Coverage** - Unit and integration tests
- **Documentation** - Usage examples and guides

### 📝 **Code Standards**

- Follow standard Go conventions
- Use meaningful variable and function names
- Add comments for exported functions
- Handle errors explicitly
- Write testable code
- Use interfaces for dependencies

---

## 📞 Support

### 💬 **Getting Help**

- 📖 **[Documentation](../../docs/)** - Project documentation
- 🐛 **[GitHub Issues](https://github.com/skygenesisenterprise/aether-identity/issues)** - Bug reports and feature requests
- 💡 **[GitHub Discussions](https://github.com/skygenesisenterprise/aether-identity/discussions)** - Questions and ideas

### 🐛 **Reporting Issues**

When reporting bugs, please include:

- Clear description of the problem
- Steps to reproduce
- Environment information (Go version, OS, GitHub Enterprise vs.com)
- Error logs (with sensitive data redacted)
- Expected vs actual behavior

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

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

- **Sky Genesis Enterprise** - Project leadership
- **Go Community** - Excellent programming language and ecosystem
- **GitHub** - Platform and API
- **google/go-github** - Go client library for GitHub
- **golang-jwt** - JWT implementation for Go

---

<div align="center">

### 🚀 **Enterprise GitHub Integration Made Simple**

[⭐ Star This Repo](https://github.com/skygenesisenterprise/aether-identity) • [🐛 Report Issues](https://github.com/skygenesisenterprise/aether-identity/issues) • [💡 Start a Discussion](https://github.com/skygenesisenterprise/aether-identity/discussions)

---

**Made with ❤️ by the [Sky Genesis Enterprise](https://skygenesisenterprise.com) team**

_Integrating GitHub with enterprise identity management_

</div>
