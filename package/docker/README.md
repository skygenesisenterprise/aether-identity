<div align="center">

# 🐳 Aether Identity Docker SDK

[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE) [![Go](https://img.shields.io/badge/Go-1.21+-blue?style=for-the-badge&logo=go)](https://golang.org/) [![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=for-the-badge&logo=docker)](https://docker.com/)

**🔐 Secure Docker Integration - Declarative Go API for Identity Management**

A programmatic Go SDK for integrating Aether Identity into Docker-based environments with automatic sidecar injection, secure configuration generation, and CI/CD pipeline helpers.

[🚀 Quick Start](#-quick-start) • [📋 Features](#-features) • [🛠️ Installation](#️-installation) • [📦 API Reference](#-api-reference) • [🔐 Security](#-security)

</div>

---

## 🌟 What is Aether Identity Docker SDK?

**Aether Identity Docker SDK** provides a declarative Go API for describing Docker services and their identity requirements. It generates Docker artifacts (docker-compose.yml, .env files, agent configuration) without embedding secrets or tokens in images.

### 🎯 Key Capabilities

- **📝 Declarative Go API** - Programmatic Docker service definitions with strong typing
- **🔄 Automatic Sidecar Injection** - Identity agent automatically injected into stacks
- **🔐 Secure by Default** - No secrets in generated files, runtime token resolution
- **🚀 CI/CD Pipeline Helpers** - Generate GitLab CI and GitHub Actions configurations
- **✅ Strong Validation** - Type-safe configuration with validation before generation

---

## 📋 Features

### ✅ **Core SDK Features**

- **Declarative Service Definitions** - Define Docker services with identity requirements in Go
- **Automatic Sidecar Injection** - Identity agent service automatically added to compose files
- **Secure Configuration Generation** - .env files with non-sensitive configuration only
- **Agent Configuration** - Generate identity agent config with service-to-identity mappings
- **Validation & Type Safety** - Validate identity requirements before artifact generation

### 🔐 **Security Features**

- **No Secrets in Images** - Runtime token resolution via sidecar agent
- **No Long-lived Tokens** - Short-lived JWTs handled by identity agent
- **Environment-based Configuration** - Endpoints and socket paths via environment variables
- **Secure Defaults** - All generated artifacts follow security best practices

### 🚀 **CI/CD Integration**

- **GitLab CI Generation** - Generate pipeline configurations for GitLab
- **GitHub Actions Support** - Generate workflow files for GitHub Actions
- **Multi-Environment Support** - Different configurations for dev/staging/prod

---

## 🛠️ Installation

### Prerequisites

- **Go** 1.21.0 or higher
- **Docker** (for running generated configurations)
- **docker-compose** (for stack orchestration)

### Install via Go Modules

```bash
go get github.com/skygenesisenterprise/aether-identity/package/docker
```

---

## 🚀 Quick Start

### 1. **Basic Setup**

```go
package main

import (
    "log"
    "github.com/skygenesisenterprise/aether-identity/package/docker"
)

func main() {
    // Create client
    client := docker.NewClient(docker.Config{
        IdentityEndpoint: "https://identity.aether.dev",
        Project:          "my-project",
    })

    // Create stack
    stack := client.NewStack("api-services")

    // Add service with identity requirements
    stack.Service("api", docker.Service{
        Image: "myapp/api:latest",
        Ports: []string{"8080:8080"},
        Identity: docker.IdentityBinding{
            Scopes: []string{"vault.read", "account.read"},
            Roles:  []string{"service"},
        },
    })

    // Generate artifacts
    if err := stack.GenerateCompose("docker-compose.yml"); err != nil {
        log.Fatal(err)
    }

    if err := stack.GenerateEnv(".env"); err != nil {
        log.Fatal(err)
    }

    if err := stack.GenerateAgentConfig("agent-config.json"); err != nil {
        log.Fatal(err)
    }
}
```

### 2. **Run Your Stack**

```bash
# Start the generated stack
docker-compose up -d

# Services automatically communicate with identity agent via local socket
```

---

## 📦 API Reference

### 🔧 **Client**

The entrypoint for the SDK:

```go
client := docker.NewClient(docker.Config{
    IdentityEndpoint: "https://identity.aether.dev",    // Required: Identity service URL
    Project:          "my-project",                      // Required: Project name
    AgentImage:       "aether/identity-agent:latest",    // Optional: Custom agent image
    AgentSocketPath:  "/var/run/aether/identity.sock",   // Optional: Custom socket path
    Environment:      "development",                     // Optional: Environment name
})
```

### 📚 **Stack**

A collection of related services:

```go
stack := client.NewStack("my-stack")

// Add services
stack.Service("api", docker.Service{...})
stack.Service("worker", docker.Service{...})

// Generate artifacts
stack.GenerateCompose("docker-compose.yml")
stack.GenerateEnv(".env")
stack.GenerateAgentConfig("agent.json")

// Validate before generating
err := stack.Validate()
```

### ⚙️ **Service Definition**

Docker service with identity binding:

```go
docker.Service{
    Image:       "myapp:latest",
    Ports:       []string{"8080:8080"},
    Environment: map[string]string{"LOG_LEVEL": "info"},
    Volumes:     []string{"./data:/data"},
    Networks:    []string{"backend"},
    DependsOn:   []string{"database"},
    Identity: docker.IdentityBinding{
        Scopes: []string{"vault.read", "account.read"},
        Roles:  []string{"service"},
    },
}
```

### 🔐 **Identity Binding**

Identity requirements for a service:

```go
docker.IdentityBinding{
    Scopes:          []string{"vault.read"},     // OAuth2 scopes required
    Roles:           []string{"service"},        // RBAC roles assigned
    ServiceName:     "custom-name",              // Optional: Override service identifier
    RequireIdentity: true,                       // Mandatory identity binding
    Audience:        "api.aether.dev",           // Token audience
}
```

### 🚀 **CI/CD Helpers**

Generate pipeline configurations:

```go
pipeline := stack.NewPipeline()

// GitLab CI
gitlabConfig, err := pipeline.GenerateGitLabCI()

// GitHub Actions
githubConfig, err := pipeline.GenerateGitHubActions()
```

---

## 🔐 Security

### **Security Model**

**Strict Security Constraints:**

- ✅ No secrets embedded in generated files
- ✅ No long-lived tokens in configuration
- ✅ No plaintext credentials
- ✅ Environment variables only for endpoints/socket paths
- ✅ Tokens resolved at runtime via agent

### **Identity Integration Model**

Each Docker service can declare:

- **Scopes**: OAuth2 scopes required by the service
- **Roles**: RBAC roles assigned to the service
- **Service Name**: Override for the service identifier

Identity is resolved at runtime via:

1. **Identity Agent** (sidecar container)
2. **Local socket** or localhost HTTP
3. **Short-lived JWTs** (no long-lived tokens)

### **Generated Artifacts**

**docker-compose.yml:**

- Identity agent service (sidecar)
- User services with identity dependencies
- Shared volume for identity socket
- Docker labels for identity metadata

**.env:**

- Identity endpoint URL
- Project and stack names
- Socket paths (non-sensitive only)

**agent-config.json:**

- Service-to-identity mappings
- Scope and role requirements
- Runtime configuration

---

## 💡 Examples

### **Local Development**

```go
client := docker.NewClient(docker.Config{
    IdentityEndpoint: "http://localhost:8080",
    Project:          "dev-project",
    Environment:      "development",
})

stack := client.NewStack("dev-stack")

stack.Service("app", docker.Service{
    Image: "myapp:dev",
    Ports: []string{"3000:3000"},
    Identity: docker.IdentityBinding{
        Scopes: []string{"dev.access"},
    },
})

stack.GenerateCompose("docker-compose.yml")
```

### **Production Deployment**

```go
client := docker.NewClient(docker.Config{
    IdentityEndpoint: "https://identity.aether.io",
    Project:          "production",
    AgentImage:       "aether/identity-agent:v1.2.3",
    Environment:      "production",
})

stack := client.NewStack("api-cluster")

stack.Service("gateway", docker.Service{
    Image:   "aether/gateway:v2.0",
    Ports:   []string{"443:8443"},
    Restart: docker.RestartUnlessStopped,
    Identity: docker.IdentityBinding{
        Scopes: []string{
            docker.ScopeVaultRead.String(),
            docker.ScopeAccountRead.String(),
        },
        Roles:  []string{docker.RoleService.String()},
        RequireIdentity: true,
    },
})
```

### **Multiple Services with Different Identities**

```go
stack := client.NewStack("microservices")

// Public API with limited scope
stack.Service("public-api", docker.Service{
    Image: "api/public:latest",
    Ports: []string{"8080:8080"},
    Identity: docker.IdentityBinding{
        Scopes: []string{"public.read"},
    },
})

// Admin API with elevated permissions
stack.Service("admin-api", docker.Service{
    Image: "api/admin:latest",
    Ports: []string{"8081:8080"},
    Identity: docker.IdentityBinding{
        Scopes: []string{"admin.full"},
        Roles:  []string{"admin"},
        RequireIdentity: true,
    },
})

// Background worker
stack.Service("worker", docker.Service{
    Image: "worker:latest",
    Identity: docker.IdentityBinding{
        Scopes: []string{"queue.consume", "queue.produce"},
        Roles:  []string{"service"},
    },
})
```

---

## 📊 What This SDK Does (and Does Not Do)

### ✅ **This SDK does:**

- Provide a programmatic abstraction layer for Docker + Identity integration
- Generate docker-compose.yml with identity sidecar configuration
- Create .env files with non-sensitive configuration
- Generate identity agent configuration
- Validate identity requirements before generation
- Support CI/CD pipeline generation

### ❌ **This SDK does NOT:**

- Call Docker directly at runtime
- Embed secrets or tokens in images
- Store credentials in Docker layers
- Make HTTP calls to Identity services directly
- Replace Docker or docker-compose

---

## 🗺️ Future Extensions

Planned future enhancements:

- **Kubernetes support** - Similar SDK for K8s manifests
- **Nomad support** - HashiCorp Nomad integration
- **Advanced CI/CD** - More pipeline templates (CircleCI, Travis, etc.)
- **Validation hooks** - Custom validation functions
- **Import existing compose** - Parse and enhance existing docker-compose.yml files

---

## 🤝 Contributing

Contributions are welcome! Please ensure:

- Tests pass: `go test ./...`
- Code is formatted: `go fmt ./...`
- No secrets in test files or examples
- Follow Go best practices and conventions

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### 🚀 **Secure Docker Integration Made Simple**

[⭐ Star This Repo](https://github.com/skygenesisenterprise/aether-identity) • [🐛 Report Issues](../../issues) • [💡 Start a Discussion](../../discussions)

---

**Made with ❤️ by the [Sky Genesis Enterprise](https://skygenesisenterprise.com) team**

</div>
