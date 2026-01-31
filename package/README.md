<div align="center">

# 📦 Aether Identity Package Ecosystem

[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](https://github.com/skygenesisenterprise/aether-identity/blob/main/LICENSE) [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/) [![Go](https://img.shields.io/badge/Go-1.21+-blue?style=for-the-badge&logo=go)](https://golang.org/) [![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/) [![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=for-the-badge&logo=docker)](https://docker.com/)

**🔐 Complete Multi-Language SDK Ecosystem for Identity & Access Management**

A comprehensive package ecosystem providing SDKs, tools, and integrations for the Aether Identity platform. From official TypeScript and Go SDKs to community ports, GitHub integrations, and infrastructure tools.

[🚀 Quick Start](#-quick-start) • [📦 Packages](#-packages) • [🛠️ Installation](#️-installation) • [🏗️ Architecture](#️-architecture) • [🤝 Contributing](#-contributing)

</div>

---

## 🌟 What is the Aether Identity Package Ecosystem?

The **Aether Identity Package Ecosystem** is a comprehensive collection of SDKs, tools, and integrations designed to make integrating with Aether Identity seamless across any technology stack. Whether you're building web applications, mobile apps, CLI tools, or infrastructure automation, we have a package for you.

### 🎯 Key Features

- **📦 Multi-Language SDKs** - Official SDKs for TypeScript/Node.js, Go, Swift, and more
- **🔐 Enterprise-Ready** - Production-grade authentication, session management, and security
- **🚀 Universal Support** - Browser, Node.js, mobile, and backend environments
- **🛠️ Developer Tools** - CLI, GitHub Actions, VSCode extensions, and Docker tools
- **📊 Complete Coverage** - Auth, sessions, tokens, EID, devices, machines, and more
- **🔄 Consistent APIs** - Same mental model across all languages and platforms
- **🐳 Infrastructure Ready** - Kubernetes operators, Docker SDK, and deployment tools
- **📚 Comprehensive Docs** - Each package includes detailed documentation and examples

---

## 📦 Packages

### ✅ Production-Ready SDKs

These packages are fully documented, tested, and ready for production use:

| Package                             | Language           | Status   | Description                              | Documentation                 |
| ----------------------------------- | ------------------ | -------- | ---------------------------------------- | ----------------------------- |
| **[@aether-identity/node](./node)** | TypeScript/Node.js | ✅ Ready | Universal SDK for Node.js and browser    | [📖 Docs](./node/README.md)   |
| **[Go SDK](./golang)**              | Go                 | ✅ Ready | Native Go client with idiomatic patterns | [📖 Docs](./golang/README.md) |
| **[Swift SDK](./swift)**            | Swift              | ✅ Ready | iOS/macOS native SDK                     | [📖 Docs](./swift/README.md)  |
| **[Docker SDK](./docker)**          | TypeScript/Node.js | ✅ Ready | Docker container and registry management | [📖 Docs](./docker/README.md) |
| **[GitHub App](./github)**          | Go                 | ✅ Ready | GitHub integration for identity sync     | [📖 Docs](./github/README.md) |

### 🛠️ Tools & Integrations

| Package                          | Type       | Status   | Description                                    | Documentation                 |
| -------------------------------- | ---------- | -------- | ---------------------------------------------- | ----------------------------- |
| **[CLI](./cli)**                 | Go         | 🔄 Alpha | Command-line interface for identity management | [📖 Docs](./cli/README.md)    |
| **[GitHub Action](./action)**    | YAML       | ✅ Ready | GitHub Actions for CI/CD integration           | [📖 Docs](./action/README.md) |
| **[VSCode Extension](./vscode)** | TypeScript | 🔄 Alpha | IDE integration for developers                 | [📖 Docs](./vscode/README.md) |
| **[Kubernetes Operator](./k8s)** | Go         | 🔄 Alpha | K8s operator for cloud-native deployments      | [📖 Docs](./k8s/README.md)    |

### 🚧 In Development

These packages are currently being developed and will be available soon:

| Package                              | Language   | Status         | ETA     | Description                   |
| ------------------------------------ | ---------- | -------------- | ------- | ----------------------------- |
| **[Python SDK](./python)**           | Python     | 🚧 In Progress | Q2 2025 | Python client library         |
| **[Rust SDK](./rust)**               | Rust       | 🚧 In Progress | Q2 2025 | Systems programming SDK       |
| **[Java SDK](./java)**               | Java       | 🚧 In Progress | Q2 2025 | Enterprise Java support       |
| **[.NET SDK](./.net)**               | C#         | 🚧 Planned     | Q3 2025 | .NET and ASP.NET integration  |
| **[PHP SDK](./php)**                 | PHP        | 🚧 Planned     | Q3 2025 | PHP web applications          |
| **[Ruby SDK](./ruby)**               | Ruby       | 🚧 Planned     | Q3 2025 | Ruby and Rails support        |
| **[Browser Extension](./extension)** | TypeScript | 🚧 Planned     | Q3 2025 | Chrome/Firefox extension      |
| **[Snap Package](./snap)**           | Snap       | 🚧 Planned     | Q3 2025 | Ubuntu Snap distribution      |
| **[GCC Plugin](./gcc)**              | C/C++      | 🚧 Planned     | Q4 2025 | Low-level systems integration |

### 📦 Shared Components

| Package                | Purpose      | Description                                                 |
| ---------------------- | ------------ | ----------------------------------------------------------- |
| **[shared](./shared)** | Common Types | Shared TypeScript types and interfaces used across packages |

---

## 🚀 Quick Start

### Choose Your SDK

#### 🟦 TypeScript/Node.js (Recommended for Web)

```bash
# pnpm (recommended)
pnpm add @aether-identity/node

# npm
npm install @aether-identity/node

# yarn
yarn add @aether-identity/node
```

```typescript
import { CreateIdentityClient } from "@aether-identity/node";

const client = CreateIdentityClient({
  baseUrl: "http://localhost:8080",
  clientId: "your-client-id",
});

// Login
const login = await client.auth.login({
  username: "user@example.com",
  password: "secure-password",
});

// Get current user
const me = await client.user.me();
console.log("User:", me);
```

#### 🟦 Go (Recommended for Backend)

```bash
go get github.com/skygenesisenterprise/aether-identity
```

```go
package main

import (
    "context"
    "fmt"
    identity "github.com/skygenesisenterprise/aether-identity"
)

func main() {
    client := identity.NewClient(identity.Config{
        Endpoint: "https://identity.aether.dev",
        ClientID: "your-client-id",
    })

    ctx := context.Background()

    // Login
    err := client.Auth.Login(ctx, identity.AuthInput{
        Email:    "user@example.com",
        Password: "secure-password",
    })

    // Get profile
    profile, _ := client.User.Profile(ctx)
    fmt.Printf("Welcome, %s!\n", profile.Name)
}
```

#### 🟦 Swift (Recommended for iOS/macOS)

```swift
import AetherIdentity

let client = IdentityClient(
    baseURL: URL(string: "https://identity.aether.dev")!,
    clientId: "your-client-id"
)

// Login
do {
    let session = try await client.auth.login(
        email: "user@example.com",
        password: "secure-password"
    )
    print("Welcome, \(session.user.name)!")
} catch {
    print("Login failed: \(error)")
}
```

#### 🟦 Docker SDK

```typescript
import { DockerClient } from "@aether-identity/docker";

const docker = new DockerClient({
  baseUrl: "http://localhost:8080",
  registryUrl: "https://registry.aether.dev",
});

// List containers
const containers = await docker.containers.list();
console.log("Running containers:", containers);
```

---

## 🛠️ Installation

### Prerequisites

- **Node.js** 18.0.0+ (for TypeScript packages)
- **Go** 1.21.0+ (for Go packages)
- **Swift** 5.9+ (for Swift packages)
- **Docker** (optional, for containerized packages)
- **pnpm** 9.0.0+ (recommended package manager)

### Monorepo Setup

If you're working with the entire package ecosystem:

```bash
# Clone the repository
git clone https://github.com/skygenesisenterprise/aether-identity.git
cd aether-identity

# Install all dependencies
make install

# Build all packages
make build-packages

# Test all packages
make test-packages
```

### Package-Specific Development

```bash
# Node.js SDK
cd package/node && pnpm install && pnpm dev

# Go SDK
cd package/golang && go mod download && go test ./...

# GitHub App
cd package/github && go mod download && go run main.go

# Docker SDK
cd package/docker && pnpm install && pnpm build
```

---

## 🏗️ Architecture

### Package Structure

```
package/
├── node/                    # 🚀 TypeScript/Node.js SDK
│   ├── src/                # Source code
│   ├── examples/           # Usage examples
│   └── README.md           # Full documentation
├── golang/                 # 🔐 Go SDK
│   ├── *.go               # Go source files
│   └── README.md          # Full documentation
├── swift/                  # 📱 Swift SDK
│   ├── Sources/           # Swift source
│   └── README.md          # Full documentation
├── docker/                 # 🐳 Docker SDK
│   ├── src/               # TypeScript source
│   └── README.md          # Full documentation
├── github/                 # 🐙 GitHub App
│   ├── src/               # Go source
│   └── README.md          # Full documentation
├── cli/                    # 🛠️ CLI Tool (Go)
├── action/                 # ⚡ GitHub Action
├── vscode/                 # 📝 VSCode Extension
├── k8s/                    # ☸️ Kubernetes Operator
├── python/                 # 🐍 Python SDK (WIP)
├── rust/                   # 🦀 Rust SDK (WIP)
├── java/                   # ☕ Java SDK (WIP)
├── .net/                   # 🟣 .NET SDK (WIP)
├── php/                    # 🐘 PHP SDK (WIP)
├── ruby/                   # 💎 Ruby SDK (WIP)
├── extension/              # 🔌 Browser Extension (WIP)
├── snap/                   # 📦 Snap Package (WIP)
├── gcc/                    # 🔧 GCC Plugin (WIP)
├── shared/                 # 📋 Shared Types
└── README.md              # 📖 This file
```

### SDK Architecture Pattern

All SDKs follow a consistent modular architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                    Identity Client                          │
├─────────────────────────────────────────────────────────────┤
│  Auth  │  Session  │  User  │  Token  │  EID  │  Machine   │
├─────────────────────────────────────────────────────────────┤
│              HTTP Client / Transport Layer                  │
├─────────────────────────────────────────────────────────────┤
│              Error Handling / Retry Logic                   │
└─────────────────────────────────────────────────────────────┘
```

### Cross-Language Consistency

| Feature      | Node.js | Go  | Swift | Python (WIP) | Rust (WIP) |
| ------------ | ------- | --- | ----- | ------------ | ---------- |
| **Auth**     | ✅      | ✅  | ✅    | 🚧           | 🚧         |
| **Session**  | ✅      | ✅  | ✅    | 🚧           | 🚧         |
| **User**     | ✅      | ✅  | ✅    | 🚧           | 🚧         |
| **Token**    | ✅      | ✅  | ✅    | 🚧           | 🚧         |
| **EID**      | ✅      | ✅  | ✅    | 🚧           | 🚧         |
| **Machine**  | ✅      | ✅  | ✅    | 🚧           | 🚧         |
| **Device**   | ✅      | ✅  | ✅    | 🚧           | 🚧         |
| **2FA/TOTP** | ✅      | ✅  | ✅    | 🚧           | 🚧         |

---

## 📊 Feature Matrix

### SDK Capabilities

| Capability         | Node.js | Go  | Swift | Docker | GitHub |
| ------------------ | ------- | --- | ----- | ------ | ------ |
| JWT Authentication | ✅      | ✅  | ✅    | N/A    | ✅     |
| Session Management | ✅      | ✅  | ✅    | N/A    | ✅     |
| Token Refresh      | ✅      | ✅  | ✅    | N/A    | ✅     |
| 2FA/TOTP           | ✅      | ✅  | ✅    | N/A    | N/A    |
| EID Verification   | ✅      | ✅  | ✅    | N/A    | N/A    |
| Machine Auth       | ✅      | ✅  | ✅    | N/A    | N/A    |
| Device Management  | ✅      | ✅  | ✅    | N/A    | N/A    |
| Error Handling     | ✅      | ✅  | ✅    | ✅     | ✅     |
| Retry Logic        | ✅      | ✅  | ✅    | ✅     | ✅     |
| Type Safety        | ✅      | ✅  | ✅    | ✅     | N/A    |
| Browser Support    | ✅      | N/A | N/A   | N/A    | N/A    |
| Native Performance | N/A     | ✅  | ✅    | ✅     | ✅     |

### Integration Capabilities

| Integration         | Status     | Use Case                           |
| ------------------- | ---------- | ---------------------------------- |
| GitHub App          | ✅ Ready   | Organization sync, team management |
| GitHub Action       | ✅ Ready   | CI/CD pipeline integration         |
| VSCode Extension    | 🔄 Alpha   | Developer IDE integration          |
| Kubernetes Operator | 🔄 Alpha   | Cloud-native deployment            |
| CLI Tool            | 🔄 Alpha   | Command-line management            |
| Docker SDK          | ✅ Ready   | Container orchestration            |
| Browser Extension   | 🚧 Planned | Browser-based identity             |

---

## 🎯 Which SDK Should I Use?

### By Use Case

| Use Case                                | Recommended SDK | Reason                            |
| --------------------------------------- | --------------- | --------------------------------- |
| **Web Application (React/Vue/Angular)** | Node.js         | Universal client, browser support |
| **Backend API (Node.js)**               | Node.js         | Native async/await, TypeScript    |
| **Backend Service (Go)**                | Go              | High performance, low latency     |
| **iOS/macOS App**                       | Swift           | Native platform integration       |
| **Microservices**                       | Go              | Small footprint, fast startup     |
| **CLI Tool**                            | Go              | Single binary, cross-platform     |
| **Docker/Orchestration**                | Docker SDK      | Container-native operations       |
| **CI/CD Pipeline**                      | GitHub Action   | Native GitHub integration         |
| **Infrastructure Automation**           | CLI + K8s       | Complete tool chain               |

### By Team Expertise

| Team Background       | Recommended SDK  |
| --------------------- | ---------------- |
| TypeScript/JavaScript | Node.js SDK      |
| Go Developers         | Go SDK           |
| iOS/macOS Developers  | Swift SDK        |
| DevOps/SRE            | CLI + Docker SDK |
| Full-Stack JavaScript | Node.js SDK      |
| Systems Programming   | Go SDK           |
| Mobile Development    | Swift SDK        |

---

## 🔧 Make Commands

The package ecosystem supports unified development commands:

```bash
# Package Development
make build-packages       # Build all packages
make test-packages        # Test all packages
make lint-packages        # Lint all packages
make typecheck-packages   # Type check TypeScript packages

# Individual Package Development
make dev-node            # Develop Node.js SDK
make dev-go              # Develop Go SDK
make dev-github          # Develop GitHub App
make dev-docker          # Develop Docker SDK

# Testing
make test-node           # Test Node.js SDK
make test-go             # Test Go packages
make test-integration    # Run integration tests

# Publishing
make publish-node        # Publish Node.js packages
make publish-go          # Tag Go releases
```

---

## 🤝 Contributing

We welcome contributions to any package in the ecosystem!

### Priority Areas

🔴 **High Priority:**

- Python SDK completion
- Rust SDK implementation
- CLI tool development
- Kubernetes operator

🟡 **Medium Priority:**

- Java SDK
- .NET SDK
- PHP SDK
- Ruby SDK

🟢 **Future:**

- Browser extension
- GCC plugin
- Additional language support

### How to Contribute

1. **Fork** the repository
2. **Choose a package** to work on (check issues for good first issues)
3. **Read the package README** for specific guidelines
4. **Create a feature branch**
5. **Follow the coding standards** for the specific language
6. **Add tests** for new functionality
7. **Update documentation**
8. **Submit a pull request**

### Package-Specific Guidelines

- **Node.js**: TypeScript strict mode, ESLint + Prettier, Jest testing
- **Go**: Standard Go formatting (`go fmt`), table-driven tests, context usage
- **Swift**: SwiftLint, XCTest, async/await patterns
- **Docker**: Container best practices, health checks, multi-stage builds

---

## 📞 Support & Resources

### Documentation

- **[Main Documentation](../docs/)** - Core platform documentation
- **[Node.js SDK](./node/README.md)** - TypeScript/JavaScript guide
- **[Go SDK](./golang/README.md)** - Go integration guide
- **[Swift SDK](./swift/README.md)** - iOS/macOS guide
- **[Docker SDK](./docker/README.md)** - Container management guide
- **[GitHub App](./github/README.md)** - GitHub integration guide

### Getting Help

- 🐛 **[GitHub Issues](https://github.com/skygenesisenterprise/aether-identity/issues)** - Bug reports and feature requests
- 💬 **[GitHub Discussions](https://github.com/skygenesisenterprise/aether-identity/discussions)** - Questions and ideas
- 📧 **Email** - support@skygenesisenterprise.com

### Community

- ⭐ **Star the repository** to show support
- 🍴 **Fork and contribute** to help grow the ecosystem
- 📢 **Share your use case** in discussions

---

## 📈 Roadmap

### Q2 2025

- [ ] Python SDK release
- [ ] Rust SDK release
- [ ] CLI tool stable release
- [ ] Java SDK beta

### Q3 2025

- [ ] .NET SDK release
- [ ] PHP SDK release
- [ ] Ruby SDK release
- [ ] VSCode extension stable
- [ ] Browser extension beta

### Q4 2025

- [ ] Kubernetes operator stable
- [ ] GCC plugin release
- [ ] Snap package distribution
- [ ] Additional enterprise integrations

---

## 📄 License

All packages in the Aether Identity ecosystem are licensed under the **MIT License**. See individual package READMEs for specific license details.

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

- **Sky Genesis Enterprise** - Project leadership and ecosystem development
- **Contributors** - Community members building packages across languages
- **Open Source Community** - Tools, libraries, and inspiration

---

<div align="center">

### 🚀 **Build Identity-First Applications in Any Language!**

[⭐ Star This Repo](https://github.com/skygenesisenterprise/aether-identity) • [🐛 Report Issues](https://github.com/skygenesisenterprise/aether-identity/issues) • [💡 Start a Discussion](https://github.com/skygenesisenterprise/aether-identity/discussions)

---

**Made with ❤️ by the [Sky Genesis Enterprise](https://skygenesisenterprise.com) team**

_Empowering developers to build secure, identity-first applications across all platforms and languages._

</div>
