<div align="center">

# 🚀 Aether Identity — Java SDK

[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](./LICENSE) [![Java](https://img.shields.io/badge/Java-17+-orange?style=for-the-badge&logo=openjdk)](https://openjdk.org/) [![Maven](https://img.shields.io/badge/Maven-3.8+-red?style=for-the-badge&logo=apachemaven)](https://maven.apache.org/) [![Spring](https://img.shields.io/badge/Spring_Boot-Compatible-green?style=for-the-badge&logo=spring)](https://spring.io/)

**📦 Official Java SDK for Aether Identity — Authentication, Sessions, Tokens, EID, Device & Machine Management**

A comprehensive Java SDK providing seamless integration with Aether Identity services. Features modular architecture, comprehensive error handling, and enterprise-ready authentication capabilities.

[🚀 Installation](#-installation) • [⚡ Quick Start](#-quick-start) • [📦 API](#-api) • [🔧 Configuration](#-configuration) • [🧪 Development](#-développement) • [📄 Licence](#-licence)

</div>

---

## 🌟 What is Aether Identity Java SDK?

**Aether Identity Java SDK** is the official Java client library for integrating with Aether Identity services. Built with enterprise-grade features, it provides a unified interface for authentication, session management, token operations, EID verification, and device/machine enrollment.

### 🎯 Key Features

- **☕ Java 17+ Support** - Modern Java with records, pattern matching, and improved APIs
- **📦 Modular Architecture** - Clean separation into `auth`, `session`, `user`, `token`, `eid`, `machine`, `device` modules
- **🔐 Enterprise Authentication** - Complete support for JWT, 2FA/TOTP, session management, and token refresh
- **⚡ Type-Safe** - Strong typing with Java's type system
- **🛡️ Robust Error Handling** - Specialized exception classes for different failure scenarios
- **📊 Session Management** - Built-in token storage and automatic refresh mechanisms
- **🎯 EID Operations** - Electronic Identity verification and status checking
- **🔧 Customizable** - Support for custom HTTP clients and configuration options
- **🌱 Spring Boot Compatible** - Easy integration with Spring Boot applications

---

## 🚀 Installation

### 📦 Maven

Add the following dependency to your `pom.xml`:

```xml
<dependency>
    <groupId>com.aetheridentity</groupId>
    <artifactId>aether-identity-java</artifactId>
    <version>1.0.0</version>
</dependency>
```

### 📦 Gradle

Add the following to your `build.gradle`:

```groovy
implementation 'com.aetheridentity:aether-identity-java:1.0.0'
```

### 🔧 Requirements

- **Java**: 17 or higher
- **Maven**: 3.8+ or Gradle 7.0+
- **Jackson**: 2.15+ (for JSON serialization)

---

## ⚡ Quick Start

### 🎯 Basic Usage

```java
import com.aetheridentity.sdk.IdentityClient;
import com.aetheridentity.sdk.types.*;

public class Example {
    public static void main(String[] args) {
        // Initialize the client
        IdentityClientConfig config = IdentityClientConfig.builder()
            .baseUrl("http://localhost:8080")
            .clientId("your-client-id")
            .build();

        IdentityClient client = IdentityClient.create(config);

        // Authentication
        AuthInput authInput = new AuthInput("user@example.com", "secure-password");
        client.getAuth().login(authInput);

        // Get current user profile
        UserProfile profile = client.getUser().profile();
        System.out.println("User: " + profile.getName());

        // Check EID status
        EIDStatusResponse eidStatus = client.getEid().status();
        System.out.println("EID Verified: " + eidStatus.isVerified());
    }
}
```

### 🔐 Authentication with 2FA

```java
import com.aetheridentity.sdk.IdentityClient;
import com.aetheridentity.sdk.errors.TOTPRequiredError;
import com.aetheridentity.sdk.types.*;

public class TOTPExample {
    public static void main(String[] args) {
        IdentityClientConfig config = IdentityClientConfig.builder()
            .baseUrl("http://localhost:8080")
            .clientId("your-client-id")
            .build();

        IdentityClient client = IdentityClient.create(config);

        try {
            AuthInput authInput = new AuthInput("user@example.com", "secure-password");
            client.getAuth().login(authInput);
        } catch (TOTPRequiredError e) {
            // Handle 2FA
            TOTPLoginInput totpInput = new TOTPLoginInput(
                "user@example.com",
                "secure-password",
                "123456"
            );
            TokenResponse response = client.getTotp().login(totpInput);
        }
    }
}
```

### 🔄 Session Management

```java
// Store session token
TokenResponse tokens = client.getAuth().login(authInput);
// Tokens are automatically stored in the session manager

// Refresh token
client.getToken().refresh();

// Clear session
client.getAuth().logout();
```

### 🌱 Spring Boot Integration

```java
import com.aetheridentity.sdk.IdentityClient;
import com.aetheridentity.sdk.types.IdentityClientConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AetherIdentityConfig {

    @Bean
    public IdentityClient identityClient() {
        IdentityClientConfig config = IdentityClientConfig.builder()
            .baseUrl("${aether.identity.base-url}")
            .clientId("${aether.identity.client-id}")
            .systemKey("${aether.identity.system-key}")
            .build();

        return IdentityClient.create(config);
    }
}
```

---

## 🔧 Configuration

### ⚙️ Client Configuration

The `IdentityClient` accepts a configuration object of type `IdentityClientConfig`:

```java
public class IdentityClientConfig {
    /** Base URL of the Aether Identity API */
    private String baseUrl;

    /** Application/client identifier */
    private String clientId;

    /** Initial access token (optional) */
    private String accessToken;

    /** Custom HTTP fetcher implementation (optional) */
    private Function<TransportRequest, TransportResponse> fetcher;

    /** System key for machine-to-machine authentication (optional) */
    private String systemKey;

    /** TOTP configuration (optional) */
    private TOTPConfig totpConfig;
}
```

### 📝 Configuration Examples

**With Initial Token:**

```java
IdentityClientConfig config = IdentityClientConfig.builder()
    .baseUrl("https://api.aether-identity.com")
    .clientId("my-app-id")
    .accessToken("existing-jwt-token")
    .build();
```

**With Custom HTTP Client:**

```java
// Implement your own fetcher
Function<TransportRequest, TransportResponse> customFetcher = request -> {
    // Your custom HTTP implementation
    return new TransportResponse(200, "{\"data\": \"response\"}");
};

IdentityClientConfig config = IdentityClientConfig.builder()
    .baseUrl("http://localhost:8080")
    .clientId("test-client")
    .fetcher(customFetcher)
    .build();
```

---

## 📦 API Reference

### 🎯 Client Modules

The client exposes the following modules:

| Module                    | Description               | Key Methods                                         |
| ------------------------- | ------------------------- | --------------------------------------------------- |
| **`client.getAuth()`**    | Authentication operations | `login()`, `logout()`, `register()`, `strengthen()` |
| **`client.getSession()`** | Session management        | `current()`, `isAuthenticated()`                    |
| **`client.getUser()`**    | User profile & roles      | `profile()`, `roles()`, `hasPermission()`           |
| **`client.getToken()`**   | Token operations          | `refresh()`, `revoke()`                             |
| **`client.getEid()`**     | EID (Electronic Identity) | `verify()`, `status()`, `revoke()`                  |
| **`client.getMachine()`** | Machine enrollment        | `enroll()`, `token()`, `revoke()`                   |
| **`client.getDevice()`**  | Device information        | `detect()`, `status()`                              |
| **`client.getTotp()`**    | TOTP management           | `setup()`, `verify()`, `disable()`, `getStatus()`   |

### 📋 Exported Types

```java
// Configuration
IdentityClientConfig, TOTPConfig

// Authentication
AuthInput, OAuthParams, RegisterInput, RegisterResponse, StrengthenInput

// Tokens
TokenResponse

// Sessions
SessionResponse

// EID
EIDVerifyInput, EIDStatusResponse

// User
UserProfile, UserRoles

// Machine
MachineEnrollmentResponse, MachineTokenResponse

// Device
DeviceInfo, DeviceStatusResponse

// TOTP
TOTPSetupResponse, TOTPVerifyInput, TOTPStatusResponse, TOTPLoginInput
```

### 🛡️ Error Handling

The SDK exports specialized exception classes for different scenarios:

| Exception Class               | Description             | When Thrown                             |
| ----------------------------- | ----------------------- | --------------------------------------- |
| **`IdentityError`**           | Base exception class    | All SDK errors extend this              |
| **`AuthenticationError`**     | Authentication failures | Invalid credentials, login failures     |
| **`AuthorizationError`**      | Permission issues       | Insufficient permissions, access denied |
| **`SessionExpiredError`**     | Session timeout         | Token expired, session invalid          |
| **`TOTPRequiredError`**       | 2FA required            | Two-factor authentication needed        |
| **`DeviceNotAvailableError`** | Device issues           | Device not found or unavailable         |
| **`NetworkError`**            | Network failures        | Connection issues, timeouts             |
| **`ServerError`**             | Server-side errors      | 5xx responses, server failures          |

**Error Handling Example:**

```java
import com.aetheridentity.sdk.IdentityClient;
import com.aetheridentity.sdk.errors.*;

public class ErrorHandlingExample {
    public static void main(String[] args) {
        IdentityClient client = IdentityClient.create(config);

        try {
            UserProfile user = client.getUser().profile();
        } catch (AuthenticationError e) {
            System.err.println("Auth failed: " + e.getMessage());
            // Redirect to login
        } catch (SessionExpiredError e) {
            System.err.println("Session expired, refreshing...");
            client.getToken().refresh();
        } catch (NetworkError e) {
            System.err.println("Network issue: " + e.getMessage());
            // Retry or show offline message
        } catch (IdentityError e) {
            System.err.println("SDK error [" + e.getCode() + "]: " + e.getMessage());
        }
    }
}
```

---

## 🧪 Development

### 🏗️ Building the SDK

From the `package/java` directory:

```bash
# Compile the SDK
mvn clean compile

# Run tests
mvn test

# Package the SDK
mvn clean package

# Install to local repository
mvn clean install
```

### 📝 Development Guidelines

- **Java 17+ Features**: Use modern Java features like records, pattern matching, and improved APIs
- **Test Coverage**: Maintain >80% test coverage for new features
- **Error Handling**: Use exported exception classes for consistent error handling
- **Documentation**: Update Javadoc for new features or breaking changes
- **Code Quality**: Run `mvn checkstyle:check` before committing

---

## 📊 Architecture

### 🏗️ SDK Structure

```
package/java/
├── src/main/java/com/aetheridentity/sdk/
│   ├── IdentityClient.java           # Main client class
│   ├── HttpTransportFetcher.java     # Default HTTP implementation
│   ├── core/
│   │   ├── SessionManager.java       # Token storage and management
│   │   └── Transport.java            # HTTP transport layer
│   ├── modules/
│   │   ├── AuthModule.java           # Authentication operations
│   │   ├── SessionModule.java        # Session management
│   │   ├── UserModule.java           # User operations
│   │   ├── TokenModule.java          # Token operations
│   │   ├── EIDModule.java            # EID operations
│   │   ├── MachineModule.java        # Machine enrollment
│   │   ├── DeviceModule.java         # Device management
│   │   └── TOTPModule.java           # TOTP operations
│   ├── types/
│   │   ├── IdentityClientConfig.java # Configuration
│   │   ├── TokenResponse.java        # Token types
│   │   ├── UserProfile.java          # User types
│   │   ├── EIDStatusResponse.java    # EID types
│   │   ├── DeviceInfo.java           # Device types
│   │   ├── MachineEnrollmentResponse.java # Machine types
│   │   └── TOTPSetupResponse.java    # TOTP types
│   └── errors/
│       ├── ErrorCode.java            # Error codes enum
│       ├── IdentityError.java        # Base exception
│       ├── AuthenticationError.java  # Auth exceptions
│       ├── AuthorizationError.java   # Authorization exceptions
│       ├── SessionExpiredError.java  # Session exceptions
│       ├── TOTPRequiredError.java    # TOTP exceptions
│       ├── DeviceNotAvailableError.java # Device exceptions
│       ├── NetworkError.java         # Network exceptions
│       └── ServerError.java          # Server exceptions
├── src/test/java/                     # Unit tests
├── pom.xml                           # Maven configuration
└── README.md                         # This file
```

### 🔄 Data Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Your Java     │────▶│   Java SDK       │────▶│  Aether Identity│
│   Application   │     │   (aether-       │     │  API Server     │
│                 │◄────│   identity-java) │◄────│  (REST API)     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                        │                        │
        ▼                        ▼                        ▼
   Spring Boot App          Module Operations         Authentication
   Desktop Application      Auth/Session/Token         Sessions/Users
   Microservices            EID/Machine/Device
```

---

## 📦 Package Ecosystem

The Java SDK is part of the comprehensive Aether Identity package ecosystem:

| Package                     | Language   | Purpose             | Status            |
| --------------------------- | ---------- | ------------------- | ----------------- |
| **`@aether-identity/node`** | TypeScript | Node.js/Browser SDK | ✅ Ready          |
| **`aether-identity-java`**  | Java       | Java SDK            | ✅ Ready          |
| **`@aether-identity/go`**   | Go         | Native Go SDK       | 🔄 In Development |

---

## 🤝 Contributing

We welcome contributions to the Aether Identity Java SDK!

### 🎯 How to Contribute

1. **Fork the repository** and create a feature branch
2. **Install dependencies**: `mvn install`
3. **Make your changes** with tests
4. **Run tests**: `mvn test`
5. **Run checkstyle**: `mvn checkstyle:check`
6. **Submit a pull request** with clear description

### 🐛 Reporting Issues

When reporting bugs, please include:

- SDK version (`aether-identity-java` version)
- Java version
- Maven/Gradle version
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
- **Java Community** - Robust programming language and ecosystem
- **Jackson Team** - High-performance JSON library
- **Maven Team** - Build automation and dependency management
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
