<div align="center">

# 🚀 Aether Identity SDK for Swift

[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](https://github.com/skygenesisenterprise/aether-identity/blob/main/LICENSE) [![Swift](https://img.shields.io/badge/Swift-5.9+-orange?style=for-the-badge&logo=swift)](https://swift.org/) [![Platforms](https://img.shields.io/badge/Platforms-macOS_iOS_tvOS_watchOS-lightgrey?style=for-the-badge)](https://swift.org/platform-support/) [![Swift Package Manager](https://img.shields.io/badge/SPM-Compatible-green?style=for-the-badge&logo=swift)](https://swift.org/package-manager/)

**Official Swift SDK for Aether Identity - A port of the Node.js SDK**

This SDK is a feature-equivalent port of the [Node.js SDK](https://github.com/skygenesisenterprise/aether-identity/tree/main/package/node), providing the same functionality with Swift-native patterns.

[📘 Documentation](#-quick-start) • [📦 Installation](#-installation) • [💻 API Reference](#-api-reference) • [🤝 Contributing](#-contributing)

[![GitHub stars](https://img.shields.io/github/stars/skygenesisenterprise/aether-identity?style=social)](https://github.com/skygenesisenterprise/aether-identity/stargazers) [![GitHub forks](https://img.shields.io/github/forks/skygenesisenterprise/aether-identity?style=social)](https://github.com/skygenesisenterprise/aether-identity/network) [![GitHub issues](https://img.shields.io/github/issues/github/skygenesisenterprise/aether-identity)](https://github.com/skygenesisenterprise/aether-identity/issues)

</div>

---

## 🌟 What is Aether Identity SDK for Swift?

**Aether Identity SDK for Swift** is a first-party Swift client library for the Aether Identity authentication and authorization platform. This SDK is a direct port of the official Node.js SDK, ensuring feature parity and consistent behavior across platforms.

### 🎯 Key Features

- **🔐 Complete Authentication** - Email/password login with optional TOTP (2FA) support
- **📱 Multi-Platform** - Supports macOS, iOS, tvOS, and watchOS
- **🔄 Session Management** - Automatic token storage, refresh, and expiration handling
- **🛡️ Role-Based Access Control** - User roles and permission checking
- **📄 Electronic ID Verification** - eID document verification support
- **🤖 Machine-to-Machine Auth** - Client credentials flow for services
- **📲 Device Management** - Device detection and status monitoring
- **🔒 Secure Storage** - Keychain integration for token security

---

## 🆕 Port Details

This Swift SDK is a **feature-equivalent port** of the Node.js SDK with the following design principles:

| Node.js                        | Swift                     | Notes                     |
| ------------------------------ | ------------------------- | ------------------------- |
| `CreateIdentityClient(config)` | `IdentityClient(config:)` | Factory → Initializer     |
| `Promise<T>`                   | `async throws -> T`       | Native async/await        |
| `class`                        | `class` / `struct`        | Value/reference semantics |
| `interface`                    | `protocol`                | Protocol-oriented design  |
| `fetch`                        | `URLSession`              | Native HTTP client        |
| `localStorage`                 | `KeychainStorage`         | Secure platform storage   |
| `Error` subclasses             | typed `Error` enums       | Protocol-based errors     |

---

## 📊 Platform Support

| Platform    | Minimum Version | Status       |
| ----------- | --------------- | ------------ |
| **macOS**   | 12.0 (Monterey) | ✅ Supported |
| **iOS**     | 15.0            | ✅ Supported |
| **tvOS**    | 15.0            | ✅ Supported |
| **watchOS** | 8.0             | ✅ Supported |

---

## 🚀 Quick Start

### 📋 Prerequisites

- **Swift** 5.9 or higher
- **Xcode** 15.0 or higher (for iOS/macOS development)
- **Swift Package Manager** (included with Swift)

### 📦 Installation

#### Swift Package Manager (Recommended)

**Add to `Package.swift`:**

```swift
dependencies: [
    .package(url: "https://github.com/skygenesisenterprise/aether-identity.git", from: "1.0.0")
]
```

**Or in Xcode:**

1. File → Add Package Dependencies
2. Enter: `https://github.com/skygenesisenterprise/aether-identity.git`
3. Select "Up to Next Major Version" with "1.0.0"
4. Add to your target

### 💻 Basic Usage

```swift
import AetherIdentity

// Initialize the client
let identity = IdentityClient(config: IdentityClientConfig(
    baseUrl: "https://identity.aether.dev",
    clientId: "your-client-id"
))

// Login with email and password
try await identity.auth.login(
    email: "user@example.com",
    password: "password123"
)

// Get current session
let session = try await identity.session.current()
if session.isAuthenticated {
    print("Welcome, \(session.user?.name ?? "User")!")
}

// Check user profile
let profile = try await identity.user.profile()
print("Role: \(profile.role)")

// Check permissions
let canAccess = try await identity.user.hasPermission("read:documents")
print("Can read documents: \(canAccess)")

// Logout
try await identity.auth.logout()
```

### 🔐 With TOTP (Two-Factor Authentication)

```swift
// Attempt login without TOTP first
do {
    try await identity.auth.login(email: email, password: password)
} catch let error as TOTPRequiredError {
    // TOTP verification required
    try await identity.auth.strengthen(
        type: .totp,
        value: "123456"
    )
}
```

### 🤖 Machine-to-Machine Authentication

```swift
// Enroll a machine/service
let enrollment = try await identity.machine.enroll()
print("Machine ID: \(enrollment.machineId)")
print("Secret: \(enrollment.secret)")

// Later, obtain tokens using the secret
let tokenResponse = try await identity.machine.token(secret: enrollment.secret)
print("Access Token: \(tokenResponse.accessToken)")
```

---

## 📁 Project Structure

```
package/swift/
├── Sources/
│   └── AetherIdentity/
│       ├── IdentityClient.swift      # Main client class
│       ├── AetherIdentity.swift      # Public exports
│       ├── Auth/
│       │   ├── AuthService.swift     # Authentication operations
│       │   ├── TokenService.swift    # Token refresh/revoke
│       │   ├── EIDService.swift      # eID verification
│       │   └── MachineService.swift  # Machine authentication
│       ├── Session/
│       │   ├── SessionService.swift  # Session management
│       │   └── SessionManager.swift  # Token storage
│       ├── RBAC/
│       │   └── UserService.swift     # User & permissions
│       ├── HTTP/
│       │   └── Transport.swift       # HTTP client with retry
│       ├── Storage/
│       │   ├── SessionStorage.swift  # Storage protocol
│       │   ├── MemoryStorage.swift   # In-memory storage
│       │   └── KeychainStorage.swift # Keychain integration
│       ├── Errors/
│       │   ├── IdentityError.swift   # Error types
│       │   └── ErrorFactory.swift    # Error creation
│       └── Types/
│           ├── Types.swift           # Config types
│           ├── AuthTypes.swift       # Auth input types
│           ├── UserTypes.swift       # User profile types
│           ├── TokenTypes.swift      # Token types
│           ├── EIDTypes.swift        # eID types
│           ├── DeviceTypes.swift     # Device types
│           └── MachineTypes.swift    # Machine types
├── Tests/
│   └── AetherIdentityTests.swift     # Unit tests
└── Package.swift                      # Swift Package manifest
```

---

## 💻 Node.js to Swift Mapping

### Core Concepts

| Node.js                        | Swift                     | Description           |
| ------------------------------ | ------------------------- | --------------------- |
| `CreateIdentityClient(config)` | `IdentityClient(config:)` | Factory → Init        |
| `Promise<T>`                   | `async throws -> T`       | Async patterns        |
| `class`                        | `class` / `struct`        | Type definitions      |
| `interface`                    | `protocol`                | Protocol abstractions |
| `fetch`                        | `URLSession`              | HTTP abstraction      |
| `localStorage`                 | `KeychainStorage`         | Secure storage        |

### Auth Module

| Node.js Method                    | Swift Method                            | Description      |
| --------------------------------- | --------------------------------------- | ---------------- |
| `identity.auth.login(input)`      | `identity.auth.login(email:password:)`  | User login       |
| `identity.auth.logout()`          | `identity.auth.logout()`                | Logout           |
| `identity.auth.strengthen(input)` | `identity.auth.strengthen(type:value:)` | 2FA verification |
| `identity.token.refresh()`        | `identity.token.refresh()`              | Refresh token    |
| `identity.token.revoke()`         | `identity.token.revoke()`               | Revoke tokens    |

### Session Module

| Node.js Method                       | Swift Method                         | Description      |
| ------------------------------------ | ------------------------------------ | ---------------- |
| `identity.session.current()`         | `identity.session.current()`         | Get session      |
| `identity.session.isAuthenticated()` | `identity.session.isAuthenticated()` | Check auth state |

### User Module

| Node.js Method                   | Swift Method                      | Description      |
| -------------------------------- | --------------------------------- | ---------------- |
| `identity.user.profile()`        | `identity.user.profile()`         | Get user profile |
| `identity.user.roles()`          | `identity.user.roles()`           | Get user roles   |
| `identity.user.hasPermission(p)` | `identity.user.hasPermission(_:)` | Check permission |

### Additional Modules

| Node.js Method                   | Swift Method                      | Description       |
| -------------------------------- | --------------------------------- | ----------------- |
| `identity.eid.verify(input)`     | `identity.eid.verify(input:)`     | Verify eID        |
| `identity.eid.status()`          | `identity.eid.status()`           | Get eID status    |
| `identity.machine.enroll()`      | `identity.machine.enroll()`       | Enroll machine    |
| `identity.machine.token(secret)` | `identity.machine.token(secret:)` | Get machine token |
| `identity.device.detect()`       | `identity.device.detect()`        | List devices      |
| `identity.device.status()`       | `identity.device.status()`        | Device status     |

---

## 🔧 Error Handling

All errors conform to the `IdentityError` protocol:

```swift
do {
    try await identity.auth.login(email: email, password: password)
} catch let error as AuthenticationError {
    print("Authentication failed: \(error.message)")
    print("Request ID: \(error.requestId ?? "N/A")")
} catch let error as TOTPRequiredError {
    print("TOTP verification required")
} catch let error as SessionExpiredError {
    print("Session expired, please login again")
} catch let error as AuthorizationError {
    print("Not authorized: \(error.message)")
} catch {
    print("Unexpected error: \(error)")
}
```

### Error Types

| Error Type                | Code                    | Description        |
| ------------------------- | ----------------------- | ------------------ |
| `AuthenticationError`     | `AUTHENTICATION_FAILED` | Login failed       |
| `AuthorizationError`      | `AUTHORIZATION_FAILED`  | Not authorized     |
| `SessionExpiredError`     | `SESSION_EXPIRED`       | Token expired      |
| `TOTPRequiredError`       | `TOTP_REQUIRED`         | 2FA required       |
| `DeviceNotAvailableError` | `DEVICE_NOT_AVAILABLE`  | Device unavailable |
| `NetworkError`            | `NETWORK_ERROR`         | Network failure    |
| `ServerError`             | `SERVER_ERROR`          | Server error       |

---

## 🔒 Storage

By default, tokens are stored securely using the iOS/macOS Keychain. You can customize storage:

```swift
// Use in-memory storage (not recommended for production)
let identity = IdentityClient(config: IdentityClientConfig(
    baseUrl: "https://identity.aether.dev",
    clientId: "your-client-id",
    storage: MemoryStorage()
))

// Use custom Keychain storage
let keychainStorage = try KeychainStorage(service: "com.myapp")
let identity = IdentityClient(config: IdentityClientConfig(
    baseUrl: "https://identity.aether.dev",
    clientId: "your-client-id",
    storage: keychainStorage
))
```

---

## 🛠️ Development

### Building

```bash
# Build the package
swift build

# Build for production
swift build -c release

# Run tests
swift test

# Generate Xcode project
swift package generate-xcodeproj
```

### Code Quality

```bash
# Format code (install swiftformat first)
swiftformat .

# Lint (install swiftlint first)
swiftlint
```

---

## 📦 Related Packages

| Package                                                                                       | Language   | Description                       |
| --------------------------------------------------------------------------------------------- | ---------- | --------------------------------- |
| [Node.js SDK](https://github.com/skygenesisenterprise/aether-identity/tree/main/package/node) | TypeScript | Original reference implementation |
| [Go SDK](https://github.com/skygenesisenterprise/aether-identity/tree/main/package/golang)    | Go         | Native Go client library          |
| [Aether Identity](https://github.com/skygenesisenterprise/aether-identity)                    | -          | Main repository                   |

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

### How to Contribute

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add/update tests
5. Submit a pull request

### Areas Needing Help

- Additional platform support
- Performance optimizations
- Documentation improvements
- Test coverage expansion

---

## 📞 Support & Community

- 📖 **[Documentation](docs/)** - Comprehensive guides
- 🐛 **[GitHub Issues](https://github.com/skygenesisenterprise/aether-identity/issues)** - Bug reports
- 💡 **[GitHub Discussions](https://github.com/skygenesisenterprise/aether-identity/discussions)** - Q&A
- 📧 **Email** - support@skygenesisenterprise.com

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
- **Swift Team** - Programming language and ecosystem
- **Apple** - Foundation framework and Keychain Services
- **KeychainAccess** - Community Keychain wrapper library
- **Open Source Community** - Tools and inspiration

---

<div align="center">

### 🚀 **Building the Future of Identity Management!**

[⭐ Star This Repo](https://github.com/skygenesisenterprise/aether-identity) • [🐛 Report Issues](https://github.com/skygenesisenterprise/aether-identity/issues) • [💡 Start a Discussion](https://github.com/skygenesisenterprise/aether-identity/discussions)

---

**Swift SDK for Aether Identity - Feature-equivalent port of the Node.js SDK**

**Made with ❤️ by the [Sky Genesis Enterprise](https://skygenesisenterprise.com) team**

</div>
