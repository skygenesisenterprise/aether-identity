<div align="center">

# 🚀 Aether Identity — Node.js SDK

[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](./LICENSE) [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/) [![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/) [![npm](https://img.shields.io/badge/npm-Ready-red?style=for-the-badge&logo=npm)](https://www.npmjs.com/)

**📦 Official TypeScript SDK for Aether Identity — Authentication, Sessions, Tokens, EID, Device & Machine Management**

A comprehensive Node.js/TypeScript SDK providing seamless integration with Aether Identity services. Features modular architecture, universal fetch support, comprehensive error handling, and enterprise-ready authentication capabilities.

[🚀 Installation](#-installation) • [⚡ Quick Start](#-quick-start) • [📦 API](#-api) • [🔧 Configuration](#-configuration) • [🧪 Development](#-développement) • [📄 Licence](#-licence)

</div>

---

## 🌟 What is Aether Identity Node.js SDK?

**Aether Identity Node.js SDK** is the official TypeScript/JavaScript client library for integrating with Aether Identity services. Built with enterprise-grade features, it provides a unified interface for authentication, session management, token operations, EID verification, and device/machine enrollment.

### 🎯 Key Features

- **🚀 Universal Client** - Works in Node.js 18+ and browser environments with automatic fetch polyfill
- **📦 Modular Architecture** - Clean separation into `auth`, `session`, `user`, `token`, `eid`, `machine`, `device` modules
- **🔐 Enterprise Authentication** - Complete support for JWT, 2FA/TOTP, session management, and token refresh
- **⚡ TypeScript First** - Full TypeScript support with strict mode, comprehensive type definitions
- **🛡️ Robust Error Handling** - Specialized error classes for different failure scenarios
- **🔄 Auto Fetch Fallback** - Dynamic loading of `node-fetch` for Node.js < 18 or non-standard environments
- **📊 Session Management** - Built-in token storage and automatic refresh mechanisms
- **🎯 EID Operations** - Electronic Identity verification and status checking
- **🔧 Customizable** - Support for custom fetch implementations and configuration options

---

## 🚀 Installation

### 📦 Package Managers

**pnpm (Recommended):**

```bash
pnpm add @aether-identity/node
```

**npm:**

```bash
npm install @aether-identity/node
```

**yarn:**

```bash
yarn add @aether-identity/node
```

### 🔧 Requirements

- **Node.js**: 18.0.0 or higher (automatic polyfill for Node.js < 18)
- **TypeScript**: 5.0+ (for TypeScript projects)
- **Fetch API**: Native or polyfilled (automatically handled)

---

## ⚡ Quick Start

### 🎯 Basic Usage

```typescript
import { CreateIdentityClient } from "@aether-identity/node";

// Initialize the client
const client = CreateIdentityClient({
  baseUrl: "http://localhost:8080",
  clientId: "your-client-id",
});

// Authentication
const loginResponse = await client.auth.login({
  username: "user@example.com",
  password: "secure-password",
});

// Get current user
const me = await client.user.me();
console.log("User:", me);

// Check EID status
const eidStatus = await client.eid.status();
console.log("EID Status:", eidStatus);
```

### 🔐 Authentication with 2FA

```typescript
import { CreateIdentityClient, TOTPRequiredError } from "@aether-identity/node";

const client = CreateIdentityClient({
  baseUrl: "http://localhost:8080",
  clientId: "your-client-id",
});

try {
  const response = await client.auth.login({
    username: "user@example.com",
    password: "secure-password",
  });
} catch (error) {
  if (error instanceof TOTPRequiredError) {
    // Handle 2FA
    const totpResponse = await client.auth.verifyTOTP({
      code: "123456",
      sessionId: error.sessionId,
    });
  }
}
```

### 🔄 Session Management

```typescript
// Store session token
await client.session.setToken(loginResponse.accessToken);

// Refresh token automatically
const refreshed = await client.token.refresh();

// Clear session
await client.session.clear();
```

---

## 🔧 Configuration

### ⚙️ Client Configuration

The `CreateIdentityClient` function accepts a configuration object of type `IdentityClientConfig`:

```typescript
interface IdentityClientConfig {
  /** Base URL of the Aether Identity API */
  baseUrl: string;

  /** Application/client identifier */
  clientId: string;

  /** Initial access token (optional) */
  accessToken?: string;

  /** Custom fetch implementation (optional) */
  fetcher?: typeof fetch;
}
```

### 📝 Configuration Examples

**With Initial Token:**

```typescript
const client = CreateIdentityClient({
  baseUrl: "https://api.aether-identity.com",
  clientId: "my-app-id",
  accessToken: "existing-jwt-token",
});
```

**With Custom Fetch (for testing or special environments):**

```typescript
import fetch from "cross-fetch";

const client = CreateIdentityClient({
  baseUrl: "http://localhost:8080",
  clientId: "test-client",
  fetcher: fetch,
});
```

**Browser Environment:**

```typescript
// Works automatically in browsers with native fetch
const client = CreateIdentityClient({
  baseUrl: process.env.REACT_APP_API_URL!,
  clientId: process.env.REACT_APP_CLIENT_ID!,
});
```

> 💡 **Note**: If `fetch` is not available (Node.js < 18 or custom environments), the SDK automatically loads `node-fetch` dynamically.

---

## 📦 API Reference

### 🎯 Client Modules

The client exposes the following modules:

| Module               | Description               | Key Methods                                         |
| -------------------- | ------------------------- | --------------------------------------------------- |
| **`client.auth`**    | Authentication operations | `login()`, `logout()`, `verifyTOTP()`, `register()` |
| **`client.session`** | Session management        | `getToken()`, `setToken()`, `clear()`, `isValid()`  |
| **`client.user`**    | User profile & roles      | `me()`, `update()`, `getRoles()`, `updateProfile()` |
| **`client.token`**   | Token operations          | `refresh()`, `validate()`, `revoke()`, `create()`   |
| **`client.eid`**     | EID (Electronic Identity) | `verify()`, `status()`, `validate()`                |
| **`client.machine`** | Machine enrollment        | `enroll()`, `getToken()`, `verify()`, `list()`      |
| **`client.device`**  | Device information        | `info()`, `status()`, `register()`, `unregister()`  |

### 📋 Exported Types

```typescript
// Configuration
IdentityClientConfig;

// Authentication
(AuthInput, AuthResponse, LoginCredentials, TOTPInput);

// Tokens
(TokenResponse, TokenRefreshInput, TokenValidateResponse);

// Sessions
(SessionResponse, SessionStatus);

// EID
(EIDVerifyInput, EIDStatusResponse, EIDValidationResult);

// User
(UserProfile, UserRoles, UserUpdateInput);

// Machine
(MachineEnrollInput, MachineTokenResponse, MachineInfo);

// Device
(DeviceInfo, DeviceStatus, DeviceRegistrationInput);
```

### 🛡️ Error Handling

The SDK exports specialized error classes for different scenarios:

| Error Class                   | Description             | When Thrown                             |
| ----------------------------- | ----------------------- | --------------------------------------- |
| **`IdentityError`**           | Base error class        | All SDK errors extend this              |
| **`AuthenticationError`**     | Authentication failures | Invalid credentials, login failures     |
| **`AuthorizationError`**      | Permission issues       | Insufficient permissions, access denied |
| **`SessionExpiredError`**     | Session timeout         | Token expired, session invalid          |
| **`TOTPRequiredError`**       | 2FA required            | Two-factor authentication needed        |
| **`DeviceNotAvailableError`** | Device issues           | Device not found or unavailable         |
| **`NetworkError`**            | Network failures        | Connection issues, timeouts             |
| **`ServerError`**             | Server-side errors      | 5xx responses, server failures          |

**Error Handling Example:**

```typescript
import {
  CreateIdentityClient,
  AuthenticationError,
  SessionExpiredError,
  NetworkError,
} from "@aether-identity/node";

const client = CreateIdentityClient({
  baseUrl: "http://localhost:8080",
  clientId: "my-client",
});

try {
  const user = await client.user.me();
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error("Auth failed:", error.message);
    // Redirect to login
  } else if (error instanceof SessionExpiredError) {
    console.error("Session expired, refreshing...");
    await client.token.refresh();
  } else if (error instanceof NetworkError) {
    console.error("Network issue:", error.message);
    // Retry or show offline message
  } else {
    console.error("Unknown error:", error);
  }
}
```

---

## 🧪 Développement

### 🏗️ Local Development

From the `package/node` directory:

```bash
# Install dependencies
pnpm install

# Build the package
pnpm build

# Run tests
pnpm test

# Run linter
pnpm lint

# Type checking
pnpm typecheck
```

### 🔄 Watch Mode

For development with automatic rebuilding:

```bash
pnpm dev
```

This starts TypeScript in watch mode for rapid development.

### 📝 Development Guidelines

- **TypeScript Strict Mode**: All code must pass strict type checking
- **Test Coverage**: Maintain >80% test coverage for new features
- **Error Handling**: Use exported error classes for consistent error handling
- **Documentation**: Update README for new features or breaking changes
- **Linting**: Run `pnpm lint` before committing

---

## 📊 Architecture

### 🏗️ SDK Structure

```
package/node/
├── src/
│   ├── client.ts           # Main client factory
│   ├── modules/
│   │   ├── auth.ts         # Authentication module
│   │   ├── session.ts      # Session management
│   │   ├── user.ts         # User operations
│   │   ├── token.ts        # Token operations
│   │   ├── eid.ts          # EID operations
│   │   ├── machine.ts      # Machine enrollment
│   │   └── device.ts       # Device management
│   ├── types/
│   │   ├── config.ts       # Configuration types
│   │   ├── auth.ts         # Authentication types
│   │   ├── session.ts      # Session types
│   │   └── errors.ts       # Error type definitions
│   ├── errors/
│   │   ├── base.ts         # Base error classes
│   │   ├── auth.ts         # Authentication errors
│   │   └── network.ts      # Network errors
│   └── utils/
│       ├── fetch.ts        # Fetch polyfill handling
│       └── helpers.ts      # Utility functions
├── tests/
│   ├── unit/               # Unit tests
│   └── integration/        # Integration tests
├── examples/               # Usage examples
├── package.json
├── tsconfig.json
└── README.md
```

### 🔄 Data Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Your App      │────▶│   Node.js SDK    │────▶│  Aether Identity│
│   (Node/Browser)│     │   (@aether-      │     │  API Server     │
│                 │◄────│   identity/node) │◄────│  (REST API)     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                        │                        │
        ▼                        ▼                        ▼
   User Interface          Module Operations         Authentication
   React/Vue/etc          Auth/Session/Token         Sessions/Users
                                                   EID/Machine/Device
```

---

## 📦 Package Ecosystem

The Node.js SDK is part of the comprehensive Aether Identity package ecosystem:

| Package                      | Language   | Purpose                  | Status            |
| ---------------------------- | ---------- | ------------------------ | ----------------- |
| **`@aether-identity/node`**  | TypeScript | Node.js/Browser SDK      | ✅ Ready          |
| **`@aether-identity/go`**    | Go         | Native Go SDK            | 🔄 In Development |
| **`@aether-identity/cli`**   | TypeScript | Command-line tools       | 🔄 In Development |
| **`@aether-identity/react`** | TypeScript | React hooks & components | 📋 Planned        |

---

## 🤝 Contributing

We welcome contributions to the Aether Identity Node.js SDK!

### 🎯 How to Contribute

1. **Fork the repository** and create a feature branch
2. **Install dependencies**: `pnpm install`
3. **Make your changes** with tests
4. **Run tests**: `pnpm test`
5. **Run linter**: `pnpm lint`
6. **Submit a pull request** with clear description

### 🐛 Reporting Issues

When reporting bugs, please include:

- SDK version (`@aether-identity/node` version)
- Node.js version
- TypeScript version (if applicable)
- Steps to reproduce
- Expected vs actual behavior
- Error messages or stack traces

---

## 📞 Support

### 💬 Getting Help

- 📖 **[Documentation](https://docs.aether-identity.com)** - Comprehensive guides and API docs
- 🐛 **[GitHub Issues](https://github.com/skygenesisenterprise/aether-identity/issues)** - Bug reports and feature requests
- 💡 **[GitHub Discussions](https://github.com/skygenesisenterprise/aether-identity/discussions)** - Questions and ideas

---

## 🏆 Sponsors & Partners

**Development led by [Sky Genesis Enterprise](https://skygenesisenterprise.com)**

We're looking for sponsors and partners to help accelerate development of this open-source evolved identity server project.

[🤝 Become a Sponsor](https://github.com/sponsors/skygenesisenterprise)

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

- **Sky Genesis Enterprise** - Project leadership and evolution
- **Go Community** - High-performance programming language and ecosystem
- **Gin Framework** - Lightweight HTTP web framework
- **GORM Team** - Modern Go database library
- **Next.js Team** - Excellent React framework
- **React Team** - Modern UI library
- **shadcn/ui** - Beautiful component library
- **GitHub** - Marketplace platform and integration tools
- **Fastify Team** - High-performance Node.js framework
- **pnpm** - Fast, disk space efficient package manager
- **Make** - Universal build automation and command interface
- **Docker Team** - Container platform and tools
- **Open Source Community** - Tools, libraries, and inspiration

---

<div align="center">

### 🚀 **Join Us in Building the Evolved Future of Identity Infrastructure!**

[⭐ Star This Repo](https://github.com/skygenesisenterprise/aether-identity) • [🐛 Report Issues](https://github.com/skygenesisenterprise/aether-identity/issues) • [💡 Start a Discussion](https://github.com/skygenesisenterprise/aether-identity/discussions)

---

**🔧 Rapid Evolution - Complete Package Ecosystem with GitHub Marketplace Integration!**

**Made with ❤️ by the [Sky Genesis Enterprise](https://skygenesisenterprise.com) team**

_Building an evolved identity server with complete authentication, package ecosystem, and GitHub integration_

</div>