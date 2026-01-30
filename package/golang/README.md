<div align="center">

# 🔐 Aether Identity — Go SDK

[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](./LICENSE) [![Go](https://img.shields.io/badge/Go-1.21+-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://golang.org/) [![Module](https://img.shields.io/badge/module-identity-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://pkg.go.dev/github.com/skygenesisenterprise/aether-identity)

**Official Go SDK for Aether Identity — Authentication, Sessions, Tokens, EID, Device & Machine Management**

This SDK is a faithful port of the [Node.js SDK](../node) to Go, maintaining the same concepts, behaviors, and mental model for developers.

[🚀 Quick Start](#-quick-start) • [📦 Installation](#-installation) • [📚 API Reference](#-api-reference) • [🔁 Node to Go Mapping](#-nodejs-to-go-mapping) • [🛡️ Error Handling](#️-error-handling) • [🧪 Development](#-development)

</div>

---

## 🌟 What is Aether Identity Go SDK?

**Aether Identity Go SDK** is the official Go client library for integrating with Aether Identity services. It provides a comprehensive, type-safe interface for authentication, session management, user operations, EID verification, and machine/device management.

### 🎯 Key Features

- **🔐 Complete Authentication** — Login/logout with 2FA/TOTP support
- **📊 Session Management** — Automatic token refresh and session state
- **👤 User Operations** — Profile retrieval, roles, and permission checking
- **🆔 EID Verification** — Electronic identity document verification
- **🤖 Machine Enrollment** — Machine-to-machine authentication
- **📱 Device Management** — Device detection and status monitoring
- **⚡ Idiomatic Go** — Native Go patterns with context support
- **🔒 Secure by Default** — Tokens never logged, pluggable storage
- **📦 Modular Design** — Clean separation of concerns
- **✅ Production Ready** — Comprehensive error handling and retries

---

## 📦 Installation

```bash
go get github.com/skygenesisenterprise/aether-identity
```

### Requirements

- **Go** 1.21 or higher
- **Aether Identity Server** (running instance)

---

## 🚀 Quick Start

### Basic Authentication Flow

```go
package main

import (
    "context"
    "fmt"
    "log"

    identity "github.com/skygenesisenterprise/aether-identity"
)

func main() {
    // Create a new client
    client := identity.NewClient(identity.Config{
        Endpoint: "https://identity.aether.dev",
        ClientID: "your-client-id",
    })

    ctx := context.Background()

    // Login with email and password
    err := client.Auth.Login(ctx, identity.AuthInput{
        Email:    "user@example.com",
        Password: "secure-password",
    })
    if err != nil {
        log.Fatal(err)
    }

    // Get current session
    session, err := client.Session.Current(ctx)
    if err != nil {
        log.Fatal(err)
    }

    if session.IsAuthenticated {
        fmt.Printf("Welcome, %s!\n", session.User.Name)
    }

    // Get user profile
    profile, err := client.User.Profile(ctx)
    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("User ID: %s, Role: %s\n", profile.ID, profile.Role)

    // Logout when done
    if err := client.Auth.Logout(ctx); err != nil {
        log.Fatal(err)
    }
}
```

### Login with TOTP (Two-Factor Authentication)

```go
// First login attempt without TOTP
err := client.Auth.Login(ctx, identity.AuthInput{
    Email:    "user@example.com",
    Password: "secure-password",
})

// Check if TOTP is required
if totpErr, ok := err.(*errors.TOTPRequiredError); ok {
    // Prompt user for TOTP code
    totpCode := promptForTOTP() // Your implementation

    // Retry with TOTP code
    err = client.Auth.Login(ctx, identity.AuthInput{
        Email:     "user@example.com",
        Password:  "secure-password",
        TOTPCode:  totpCode,
    })
}
```

---

## 📚 API Reference

### Client Configuration

```go
type Config struct {
    Endpoint    string              // Required: API base URL
    ClientID    string              // Required: Application client ID
    AccessToken string              // Optional: Initial access token
    HTTPClient  *http.Client        // Optional: Custom HTTP client
    Storage     storage.Storage     // Optional: Custom storage implementation
}
```

### Client Modules

The client exposes the following modules:

| Module           | Purpose            | Key Methods                               |
| ---------------- | ------------------ | ----------------------------------------- |
| `client.Auth`    | Authentication     | `Login()`, `Logout()`, `Strengthen()`     |
| `client.Session` | Session management | `Current()`, `IsAuthenticated()`          |
| `client.User`    | User operations    | `Profile()`, `Roles()`, `HasPermission()` |
| `client.Token`   | Token operations   | `Refresh()`, `Revoke()`                   |
| `client.EID`     | EID verification   | `Verify()`, `Status()`, `Revoke()`        |
| `client.Machine` | Machine enrollment | `Enroll()`, `Token()`, `Revoke()`         |
| `client.Device`  | Device management  | `Detect()`, `Status()`                    |

### Auth Module

```go
// Login with credentials
err := client.Auth.Login(ctx, identity.AuthInput{
    Email:     "user@example.com",
    Password:  "password",
    TOTPCode:  "123456", // Optional: for 2FA
})

// Logout and clear session
err := client.Auth.Logout(ctx)

// Strengthen authentication with additional factors
err := client.Auth.Strengthen(ctx, identity.StrengthenInput{
    Type:  "totp",     // "totp", "email", or "sms"
    Value: "123456",   // Optional: depending on type
})
```

### Session Module

```go
// Get current session information
session, err := client.Session.Current(ctx)
// Returns: isAuthenticated, user profile, expiresAt

// Check authentication status
isAuth := client.Session.IsAuthenticated()
```

### User Module

```go
// Get user profile
profile, err := client.User.Profile(ctx)
// Returns: id, name, email, role, isActive, accountType, createdAt, updatedAt

// Get user roles
roles, err := client.User.Roles(ctx)
// Returns: []UserRoles with id, name, permissions

// Check specific permission
hasPermission, err := client.User.HasPermission(ctx, "admin:write")
```

### Token Module

```go
// Refresh access token using refresh token
err := client.Token.Refresh(ctx)

// Revoke current token
err := client.Token.Revoke(ctx)
```

### EID Module

```go
// Verify EID document
err := client.EID.Verify(ctx, identity.EIDVerifyInput{
    DocumentType:   "passport",
    DocumentNumber: "ABC123456",
    IssuanceDate:   "2023-01-01",
    ExpirationDate: "2033-01-01",
})

// Check EID verification status
status, err := client.EID.Status(ctx)
// Returns: verified, documentType, verifiedAt, expiresAt

// Revoke EID verification
err := client.EID.Revoke(ctx)
```

### Machine Module

```go
// Enroll a new machine
enrollment, err := client.Machine.Enroll(ctx)
// Returns: machineId, clientId, secret, accessToken

// Get machine token using secret
token, err := client.Machine.Token(ctx, enrollment.Secret)
// Returns: accessToken, expiresIn, tokenType

// Revoke machine credentials
err := client.Machine.Revoke(ctx, enrollment.Secret)
```

### Device Module

```go
// Detect available devices
devices, err := client.Device.Detect(ctx)
// Returns: []DeviceInfo with id, name, type, lastSeen, trusted

// Get device status
status, err := client.Device.Status(ctx)
// Returns: available, device, lastSync
```

---

## 🔁 Node.js to Go Mapping

| Node.js               | Go                               | Notes                                       |
| --------------------- | -------------------------------- | ------------------------------------------- |
| `async/await`         | `context.Context` + error return | Go uses explicit context and error handling |
| `Promise<T>`          | `(T, error)`                     | Go returns values and errors separately     |
| `class`               | `struct`                         | Go uses structs with methods                |
| `new Client(config)`  | `identity.NewClient(config)`     | Factory function pattern                    |
| `client.auth.login()` | `client.Auth.Login(ctx, input)`  | Context is first parameter                  |
| `try/catch`           | `if err != nil`                  | Go uses explicit error checking             |
| `fetch`               | `net/http`                       | Go standard library                         |
| `localStorage`        | `storage.Storage`                | Pluggable storage interface                 |

### Example Comparison

**Node.js:**

```javascript
import { CreateIdentityClient } from "@aether-identity/node";

const client = CreateIdentityClient({
  baseUrl: "https://identity.aether.dev",
  clientId: "my-client-id",
});

try {
  await client.auth.login({ email, password });
  const session = await client.session.current();
  console.log(session.user.name);
} catch (error) {
  console.error(error.message);
}
```

**Go:**

```go
import identity "github.com/skygenesisenterprise/aether-identity"

client := identity.NewClient(identity.Config{
    Endpoint: "https://identity.aether.dev",
    ClientID: "my-client-id",
})

ctx := context.Background()

if err := client.Auth.Login(ctx, identity.AuthInput{Email: email, Password: password}); err != nil {
    log.Fatal(err)
}

session, err := client.Session.Current(ctx)
if err != nil {
    log.Fatal(err)
}

fmt.Println(session.User.Name)
```

---

## 🛡️ Error Handling

The SDK provides typed errors for different failure scenarios:

```go
import "github.com/skygenesisenterprise/aether-identity/errors"

err := client.Auth.Login(ctx, input)
if err != nil {
    switch e := err.(type) {
    case *errors.AuthenticationError:
        // Handle authentication failure (401)
        log.Printf("Authentication failed: %s", e.Message)

    case *errors.TOTPRequiredError:
        // Handle TOTP/2FA required
        log.Println("TOTP code required")

    case *errors.SessionExpiredError:
        // Handle expired session
        log.Println("Session expired, please login again")

    case *errors.AuthorizationError:
        // Handle authorization failure (403)
        log.Printf("Access denied: %s", e.Message)

    case *errors.NetworkError:
        // Handle network issues
        log.Printf("Network error: %s", e.Message)

    case *errors.ServerError:
        // Handle server errors (5xx)
        log.Printf("Server error: %s", e.Message)

    case *errors.DeviceNotAvailableError:
        // Handle device not available
        log.Println("Device not available")

    default:
        // Handle other errors
        log.Printf("Error: %v", err)
    }
}
```

### Error Types

| Error Type                        | HTTP Status | Description                                   |
| --------------------------------- | ----------- | --------------------------------------------- |
| `*errors.IdentityError`           | —           | Base error type with Code, Message, RequestID |
| `*errors.AuthenticationError`     | 401         | Invalid credentials or authentication failure |
| `*errors.AuthorizationError`      | 403         | Insufficient permissions                      |
| `*errors.SessionExpiredError`     | 401         | Session has expired                           |
| `*errors.TOTPRequiredError`       | 401         | Two-factor authentication required            |
| `*errors.DeviceNotAvailableError` | —           | Device not available for operation            |
| `*errors.NetworkError`            | —           | Network connectivity issues                   |
| `*errors.ServerError`             | 5xx         | Server-side errors                            |

---

## 🔐 Security & Session Handling

### Security Features

- **🔒 Tokens Never Logged** — Access and refresh tokens are never output in logs
- **🔐 Secure Storage** — Tokens stored in configurable storage (memory, file, or custom)
- **⏰ Automatic Expiration** — Session expiration tracking with automatic cleanup
- **🔄 Token Refresh** — Automatic refresh token handling (manual refresh via `client.Token.Refresh()`)
- **🛡️ Request ID Tracking** — All errors include request IDs for debugging

### Custom Storage

Implement the `storage.Storage` interface for custom token storage:

```go
package main

import (
    "github.com/skygenesisenterprise/aether-identity"
    "github.com/skygenesisenterprise/aether-identity/storage"
)

// SecureStorage implements custom secure storage
type SecureStorage struct {
    // Your secure storage implementation
}

func (s *SecureStorage) Get(key string) (string, bool) {
    // Retrieve from secure storage
}

func (s *SecureStorage) Set(key string, value string) {
    // Store securely (encrypt if needed)
}

func (s *SecureStorage) Delete(key string) {
    // Securely delete
}

func (s *SecureStorage) Clear() {
    // Clear all stored data
}

// Usage
func main() {
    secureStore := &SecureStorage{}

    client := identity.NewClient(identity.Config{
        Endpoint: "https://identity.aether.dev",
        ClientID: "your-client-id",
        Storage:  secureStore,
    })

    // Tokens will be stored in your secure storage
}
```

---

## 📁 Package Structure

```
github.com/skygenesisenterprise/aether-identity/
├── client.go              // Main client entrypoint
├── config.go              // Configuration types
├── auth/                  // Authentication module
│   └── auth.go
├── sessionmodule/         // Session management module
│   └── session.go
├── user/                  // User operations module
│   └── user.go
├── token/                 // Token operations module
│   └── token.go
├── eid/                   // EID verification module
│   └── eid.go
├── machine/               // Machine enrollment module
│   └── machine.go
├── device/                // Device management module
│   └── device.go
├── http/                  // HTTP transport layer
│   └── http.go
├── session/               // Session/token storage manager
│   └── session.go
├── storage/               // Storage interface and implementations
│   └── storage.go
├── errors/                // Typed errors
│   └── errors.go
├── types/                 // Shared domain types
│   └── types.go
└── go.mod                 // Go module definition
```

---

## 🧪 Development

### Running Tests

```bash
# Run all tests
go test ./...

# Run tests with coverage
go test -cover ./...

# Run tests for specific package
go test ./auth/...
```

### Building

```bash
# Build the package
go build

# Verify module
go mod verify

# Tidy dependencies
go mod tidy
```

### Code Quality

```bash
# Format code
go fmt ./...

# Run linter (requires golangci-lint)
golangci-lint run

# Vet code
go vet ./...
```

---

## 🤝 Contributing

This SDK is a port of the Node.js SDK. When contributing:

1. **Maintain API Parity** — Keep the same concepts and behaviors as the Node.js SDK
2. **Follow Go Idioms** — Use standard Go patterns and conventions
3. **Add Tests** — Include tests for new functionality
4. **Document Changes** — Update README and code documentation
5. **Handle Errors** — Use typed errors from the `errors` package
6. **Use Context** — Always accept `context.Context` as first parameter for async operations

### Development Workflow

```bash
# Clone the repository
git clone https://github.com/skygenesisenterprise/aether-identity.git
cd aether-identity/package/golang

# Install dependencies
go mod download

# Run tests
go test ./...

# Make changes and test
go test ./...

# Format and lint
go fmt ./...
golangci-lint run

# Submit pull request
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](../../LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Sky Genesis Enterprise** — Project leadership and development
- **Go Community** — Excellent standard library and ecosystem
- **Node.js SDK Team** — Original SDK design and API specification
- **Contributors** — All contributors to this SDK

---

<div align="center">

### 🔐 **Secure, Idiomatic Go SDK for Aether Identity**

[⭐ Star This Repo](https://github.com/skygenesisenterprise/aether-identity) • [🐛 Report Issues](https://github.com/skygenesisenterprise/aether-identity/issues) • [💡 Start a Discussion](https://github.com/skygenesisenterprise/aether-identity/discussions)

---

**Made with ❤️ by the [Sky Genesis Enterprise](https://skygenesisenterprise.com) team**

_Faithful Go port of the Aether Identity Node.js SDK — Consistency across languages_

</div>
