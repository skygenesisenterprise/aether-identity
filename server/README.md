<div align="center">

# 🚀 Aether Identity Server

[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](https://github.com/skygenesisenterprise/aether-identity/blob/main/LICENSE) [![Go](https://img.shields.io/badge/Go-1.21+-blue?style=for-the-badge&logo=go)](https://golang.org/) [![Gin](https://img.shields.io/badge/Gin-1.9+-lightgrey?style=for-the-badge&logo=go)](https://gin-gonic.com/)

**🔐 Enterprise-Grade Identity Management Server**

A high-performance, secure identity management server built with Go, featuring JWT authentication, OAuth2 support, RBAC, and comprehensive API endpoints for user management, authentication, and authorization.

[🚀 Quick Start](#-quick-start) • [📋 Features](#-features) • [🛠️ Tech Stack](#️-tech-stack) • [📁 Architecture](#-architecture) • [💻 Development](#-development)

[![GitHub stars](https://img.shields.io/github/stars/skygenesisenterprise/aether-identity?style=social)](https://github.com/skygenesisenterprise/aether-identity/stargazers) [![GitHub forks](https://img.shields.io/github/forks/skygenesisenterprise/aether-identity?style=social)](https://github.com/skygenesisenterprise/aether-identity/network)

</div>

---

## 🌟 What is Aether Identity Server?

**Aether Identity Server** is the core authentication and identity management component of the Aether ecosystem. Built with Go and the Gin framework, it provides:

- **🔐 Complete Authentication System** - JWT-based authentication with refresh tokens
- **🛡️ Enterprise Security** - RBAC, input validation, rate limiting, and security middleware
- **🔄 OAuth2 Support** - Userinfo, introspect, and authorization endpoints
- **⚡ High Performance** - Go backend with GORM and PostgreSQL integration
- **📊 Comprehensive API** - RESTful endpoints for user management and identity operations
- **🏗️ Modular Architecture** - Clean separation of concerns with controllers, services, and repositories
- **🔑 System Key Authentication** - Dedicated `sk_` key system for application-to-server communication

### 🎯 Our Vision

- **🚀 High-Performance Backend** - Go 1.21+ with Gin framework for maximum throughput
- **🔐 Complete Security** - JWT authentication, RBAC, input validation, and security headers
- **🔄 OAuth2 Compliance** - Full OAuth2 specification implementation
- **📊 RESTful API** - Well-documented, versioned API endpoints
- **🗄️ Database Integration** - GORM ORM with PostgreSQL for data persistence
- **🛠️ Developer-Friendly** - Comprehensive Makefile, hot reload, and testing support
- **🔑 System Key Management** - Secure internal communication between application and server

---

## 🆕 What's New

### 🎯 **Major Features**

#### 🔐 **Authentication System**

- ✅ **JWT Tokens** - Secure token-based authentication with refresh mechanism
- ✅ **OAuth2 Support** - Userinfo, introspect, and authorization endpoints
- ✅ **Password Security** - bcrypt hashing for secure password storage
- ✅ **Session Management** - HTTP-only cookies for secure token handling
- ✅ **Email Verification** - Complete email verification workflow
- ✅ **Password Reset** - Secure password recovery mechanism

#### 🛡️ **Security Enhancements**

- ✅ **RBAC Middleware** - Role-based access control for API endpoints
- ✅ **Input Validation** - Comprehensive validation middleware
- ✅ **Rate Limiting** - Protection against brute force attacks
- ✅ **CORS Configuration** - Secure cross-origin resource sharing
- ✅ **Security Headers** - HTTP security headers for all responses
- ✅ **System Key Authentication** - Dedicated `sk_` key for application-to-server communication

#### 📊 **API Endpoints**

- ✅ **Authentication** - Login, register, logout, refresh token
- ✅ **User Management** - CRUD operations for users
- ✅ **OAuth2** - Userinfo, introspect, authorize, discovery endpoints
- ✅ **Health Checks** - Database health and maintenance endpoints
- ✅ **Organization** - Organization and membership management
- ✅ **Roles** - Role and permission management
- ✅ **Domain Management** - Domain registration and verification
- ✅ **Email Service** - Email sending and verification
- ✅ **Client Management** - OAuth2 client registration
- ✅ **Discord Integration** - Discord OAuth2 integration
- ✅ **Service Keys** - API key management with `sk_` prefix for service authentication
- ✅ **System Key Routes** - Dedicated endpoints for application-to-server communication

#### 🗄️ **Database Layer**

- ✅ **GORM Integration** - Type-safe database operations
- ✅ **PostgreSQL Support** - Production-ready database backend
- ✅ **Auto-migrations** - Schema management with Prisma
- ✅ **Connection Pooling** - Performance optimization
- ✅ **Seed Scripts** - Development data initialization

---

## 📊 Current Status

> **✅ Production-Ready**: Complete authentication system with enterprise security features and system key authentication.

### ✅ **Currently Implemented**

#### 🏗️ **Core Foundation**

- ✅ **Go Backend Server** - High-performance Gin API
- ✅ **Authentication System** - JWT with refresh tokens and OAuth2 support
- ✅ **Database Layer** - GORM with PostgreSQL and complete identity models
- ✅ **Security Middleware** - RBAC, validation, rate limiting, CORS
- ✅ **API Endpoints** - Complete RESTful API for identity management
- ✅ **System Key Authentication** - Dedicated `sk_` key system for application communication

#### 🔐 **Security Implementation**

- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **RBAC Middleware** - Role-based access control
- ✅ **Input Validation** - Comprehensive request validation
- ✅ **Rate Limiting** - Protection against brute force attacks
- ✅ **Security Headers** - HTTP security headers
- ✅ **System Key Middleware** - `AppAuthMiddleware` for application-to-server authentication

#### 📊 **API Features**

- ✅ **Authentication** - Login, register, logout, refresh token
- ✅ **User Management** - CRUD operations with proper authorization
- ✅ **OAuth2** - Userinfo, introspect, authorize, discovery endpoints
- ✅ **Health Checks** - Database health monitoring
- ✅ **Organization** - Organization and membership management
- ✅ **Roles** - Role and permission management
- ✅ **Domain Management** - Domain registration and verification
- ✅ **Email Service** - Email sending and verification
- ✅ **Client Management** - OAuth2 client registration
- ✅ **Discord Integration** - Discord OAuth2 integration
- ✅ **Service Keys** - API key management with `sk_` prefix
- ✅ **System Key Routes** - Protected endpoints for application communication

#### 🛠️ **Development Infrastructure**

- ✅ **Development Environment** - Hot reload, Go modules
- ✅ **Docker Deployment** - Production-ready containerization
- ✅ **Makefile** - Comprehensive build and development commands
- ✅ **Testing Suite** - Unit and integration tests
- ✅ **Structured Logging** - Zerolog-based logging
- ✅ **System Key Generation** - Script for secure key generation

### 🔄 **In Development**

- **Advanced Security** - Enhanced rate limiting and input validation
- **API Documentation** - Comprehensive Swagger/OpenAPI documentation
- **Testing Suite** - Expanded unit and integration tests
- **Performance Optimization** - Caching and query optimization

### 📋 **Planned Features**

- **Multi-Factor Authentication** - TOTP and hardware key support
- **Advanced Auditing** - Comprehensive logging and monitoring
- **Single Sign-On** - SAML and OAuth2 federation
- **Identity Federation** - Social login integration
- **Advanced Analytics** - Usage metrics and reporting

---

## 🔑 System Key Authentication

### 🎯 **Overview**

The **System Key** is a special authentication key designed for secure communication between the application web (`app/app/`) and the Aether Identity Server. This key follows the format `sk_<15_random_characters>` and is considered a "system" key that should only be used by the application itself.

### 🔐 **Key Features**

- **Dedicated Authentication** - Separate from regular service keys
- **Application-Only** - Reserved for application-to-server communication
- **15-Character Randomness** - Secure random generation for production
- **Environment-Specific** - Different keys for dev, staging, and production
- **No Database Storage** - System key is configured via environment variables

### 📋 **System Key Format**

```
sk_<15_characters>
```

Where:
- `sk_` is the fixed prefix
- `<15_characters>` are 15 alphanumeric characters generated randomly

### 🔧 **Configuration**

1. **Generate a System Key**

   ```bash
   ./scripts/generate_system_key.sh
   ```

2. **Add to Environment Variables**

   ```bash
   # In .env file
   SYSTEM_KEY=sk_your_random_key_here
   ```

3. **Use in Application**

   ```javascript
   // In Next.js application
   const response = await fetch('http://localhost:8080/api/v1/app/health', {
     headers: {
       'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SYSTEM_KEY}`
     }
   });
   ```

### 🛡️ **Security Best Practices**

- **Never commit** the system key to version control
- **Rotate regularly** (every 3-6 months in production)
- **Use different keys** for different environments
- **Limit access** to the key to authorized team members only
- **Monitor usage** of system key endpoints

### 📚 **System Key Middleware**

The server provides two middleware components for system key authentication:

1. **`AppAuthMiddleware`** - Specifically for application routes
   - Validates the system key
   - Attaches `is_app_request` flag to context
   - Used for dedicated application endpoints

2. **`ServiceKeyAuthMiddleware`** - For general service key authentication
   - Checks for system key first
   - Falls back to database lookup for regular service keys
   - Attaches `is_system_key` flag when system key is used

### 🌐 **Protected Routes**

System key-protected endpoints are available at:

```
GET    /api/v1/app/health          - Health check for application
GET    /api/v1/app/userinfo        - User info with system key auth
```

---

## 🚀 Quick Start

### 📋 Prerequisites

- **Go** 1.21.0 or higher (for backend)
- **Node.js** 18.0.0 or higher (for database migrations)
- **PostgreSQL** 14.0 or higher (for database)
- **Docker** (optional, for containerized deployment)
- **Make** (for command shortcuts - included with most systems)

### 🔧 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/skygenesisenterprise/aether-identity.git
   cd aether-identity
   ```

2. **Navigate to server directory**

   ```bash
   cd server
   ```

3. **Install Go dependencies**

   ```bash
   go mod download
   ```

4. **Environment setup**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   # Generate a system key:
   cd ..
   ./scripts/generate_system_key.sh
   cd server
   ```

5. **Database initialization**

   ```bash
   # From project root
   make db-migrate
   ```

6. **Start the server**

   ```bash
   go run main.go
   ```

   Or using Makefile:

   ```bash
   make go-server
   ```

### 🌐 Access Points

Once running, you can access:

- **API Server**: [http://localhost:8080](http://localhost:8080)
- **Health Check**: [http://localhost:8080/health](http://localhost:8080/health)
- **Database Health**: [http://localhost:8080/health/database](http://localhost:8080/health/database)
- **System Key Health**: [http://localhost:8080/api/v1/app/health](http://localhost:8080/api/v1/app/health) (with system key auth)

### 🎯 **Make Commands**

```bash
# 🚀 Development
make go-server           # Start Go server
make go-build            # Build Go binary
make go-test             # Run Go tests
make go-mod-tidy         # Clean Go dependencies
make go-fmt              # Format Go code

# 🏗️ Building & Production
make build               # Build production binary
make docker-build        # Build Docker image
make docker-run          # Run with Docker Compose

# 🔧 Code Quality & Testing
make lint                # Lint Go code
make test                # Run all tests
make test-coverage       # Run tests with coverage

# 🗄️ Database
make db-migrate          # Run database migrations
make db-studio           # Open Prisma Studio (from project root)

# 🔧 Utilities
make clean               # Clean build artifacts
make help                # Show all available commands
```

---

## 🛠️ Tech Stack

### ⚙️ **Backend Layer**

```
Go 1.21+ + Gin Framework
├── 🗄️ GORM + PostgreSQL (Database Layer)
├── 🔐 JWT Authentication (Complete Implementation)
├── 🛡️ Middleware (Security, CORS, Logging, RBAC, System Key Auth)
├── 🌐 HTTP Router (Gin Router)
├── 📦 JSON Serialization (Native Go)
└── 📊 Structured Logging (Zerolog)
```

### 🗄️ **Data Layer**

```
PostgreSQL + GORM
├── 🏗️ Schema Management (Auto-migration with Prisma)
├── 🔍 Query Builder (Type-Safe Queries)
├── 🔄 Connection Pooling (Performance)
├── 👤 User Models (Complete Implementation)
├── 🏢 Organization Models (Enterprise Features)
├── 🎭 Role Models (RBAC Implementation)
├── 🔗 Membership Models (Organization Membership)
├── 🌐 Domain Models (Domain Management)
├── 🔐 Token Models (JWT and Refresh Tokens)
├── 🔄 OAuth2 Models (OAuth2 Integration)
├── 🔑 Service Key Models (sk_ prefix for API keys)
└── 📈 Seed Scripts (Development Data)
```

### 🏗️ **Server Architecture**

```
aether-identity/server/
├── cmd/                    # Command-line entry points
│   └── server/            # Main server application
│       └── main.go       # Server entry point
├── src/                    # Main source code
│   ├── config/           # Configuration management
│   │   ├── config.go     # Server configuration (includes SystemKey)
│   │   └── oauth_config.go # OAuth2 configuration
│   ├── controllers/      # HTTP request handlers
│   │   ├── auth.go       # Authentication endpoints
│   │   ├── client_controller.go # Client management endpoints
│   │   ├── database.go   # Database controller
│   │   ├── discord.go    # Discord integration endpoints
│   │   ├── discovery_controller.go # Discovery endpoints
│   │   ├── domain_controller.go # Domain management endpoints
│   │   ├── email.go      # Email service endpoints
│   │   ├── health.go     # Health check endpoints
│   │   ├── introspect.go # Token introspection endpoints
│   │   ├── oauth_controller.go # OAuth2 endpoints
│   │   ├── service_key_controller.go # Service key management endpoints
│   │   ├── token.go      # Token management endpoints
│   │   ├── user.go       # User management endpoints
│   │   └── userinfo.go   # Userinfo endpoints
│   ├── interfaces/       # Interface definitions
│   │   ├── jwt_service.go # JWT service interface
│   │   └── user_repository.go # User repository interface
│   ├── middleware/       # HTTP middleware
│   │   ├── admin_middleware.go # Admin role middleware
│   │   ├── app_auth.go  # System key authentication middleware
│   │   ├── auth.go       # Authentication middleware
│   │   ├── database.go   # Database connection middleware
│   │   ├── oauth_middleware.go # OAuth2 middleware
│   │   ├── rbac.go       # RBAC middleware
│   │   └── validation.go # Input validation middleware
│   ├── model/            # Data models
│   │   ├── auth.go       # Authentication models
│   │   ├── database.go   # Database models
│   │   ├── domain.go     # Domain models
│   │   ├── membership.go # Membership models
│   │   ├── oauth.go      # OAuth2 models
│   │   ├── organization.go # Organization models
│   │   ├── role.go       # Role models
│   │   ├── service_key.go # Service key models (sk_ prefix)
│   │   ├── token.go      # Token models
│   │   └── user.go       # User models
│   ├── routes/           # API route definitions
│   │   └── routes.go     # Route configuration (includes system key routes)
│   └── services/         # Business logic
│       ├── database.go   # Database service
│       ├── domain_service.go # Domain service
│       ├── email.go      # Email service
│       ├── jwt.go        # JWT service implementation
│       ├── oauth.go      # OAuth2 service
│       ├── service_key.go # Service key service
│       └── user.go       # User service
├── main.go               # Main entry point
├── go.mod                # Go modules file
├── go.sum                # Go modules checksum
└── Makefile              # Build and development commands
```

---

## 📊 API Reference

### 🎯 **Base URL**

```
http://localhost:8080/api/v1
```

All API endpoints are versioned and follow RESTful conventions.

### 🔐 **Authentication**

Most endpoints require authentication using JWT tokens. Include the token in the `Authorization` header:

```bash
Authorization: Bearer <your_jwt_token>
```

### 📋 **Response Format**

All responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

Error responses:

```json
{
  "success": false,
  "error": "Invalid credentials",
  "message": "Authentication failed"
}
```

### 🔑 **System Key Authentication**

For system key-protected endpoints, use the system key in the Authorization header:

```bash
Authorization: Bearer sk_your_system_key_here
```

Or without the Bearer prefix:

```bash
Authorization: sk_your_system_key_here
```

---

## 📁 Architecture

### 🏗️ **Server Structure**

The server follows a clean, modular architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                     HTTP Request                           │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                     Middleware Layer                        │
│  (Auth, RBAC, Validation, Database, Logging, System Key)   │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                     Controller Layer                        │
│  (Request handling, validation, response formatting)       │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                     Service Layer                           │
│  (Business logic, domain operations)                        │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                     Repository Layer                        │
│  (Database operations, GORM integration)                    │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                     Database (PostgreSQL)                   │
└─────────────────────────────────────────────────────────────┘
```

### 🔄 **Data Flow**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   HTTP Client   │    │   Gin API        │    │   PostgreSQL    │
│  (Frontend)     │◄──►│   (Backend)      │◄──►│   (Database)    │
│  Port 3000      │    │  Port 8080       │    │  Port 5432      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
           │                       │                       │
           ▼                       ▼                       ▼
     HTTP Requests           API Endpoints         User/Data
           │                       │                       │
           ▼                       ▼                       ▼
    ┌─────────────────┐    ┌──────────────────┐
    │  Middleware     │    │  Controllers     │
    │  (Auth, RBAC,   │    │  (Request        │
    │   Validation)   │    │   Handling)      │
    └─────────────────┘    └──────────────────┘
           │                       │
           ▼                       ▼
    ┌─────────────────┐    ┌──────────────────┐
    │  Services       │    │  Repositories    │
    │  (Business      │    │  (Database       │
    │   Logic)        │    │   Operations)    │
    └─────────────────┘    └──────────────────┘
```

---

## 💻 Development

### 🎯 **Development Workflow**

```bash
# New developer setup
cd server
go mod download

# Daily development
go run main.go          # Start server
go test ./...           # Run tests
go fmt ./...            # Format code
go mod tidy             # Clean dependencies

# Before committing
make lint               # Check code quality
make test               # Run tests
go fmt ./...            # Format code

# Production deployment
make build              # Build production binary
make docker-build       # Create Docker image
make docker-run         # Deploy
```

### 📋 **Development Guidelines**

- **Go Best Practices** - Follow Go conventions for backend code
- **Clean Architecture** - Maintain separation of concerns
- **Interface-Based Design** - Use interfaces for dependencies
- **Error Handling** - Comprehensive error handling and logging
- **Security First** - Validate all inputs and implement proper authentication
- **Testing** - Write unit tests for all business logic
- **Documentation** - Document all public APIs and functions

### 🎯 **Advanced Commands**

```bash
# Performance & Monitoring
make perf-build         # Build with performance analysis

# Environment Management
make env-dev            # Setup development environment
make env-prod           # Setup production environment

# CI/CD Helpers
make ci-build           # Build for CI
make ci-test            # Test for CI

# Project Information
make help               # Show all commands
```

---

## 🔐 Authentication System

### 🎯 **Complete Implementation**

The authentication system is fully implemented with JWT tokens and OAuth2 support:

- **JWT Tokens** - Secure token-based authentication with refresh mechanism
- **OAuth2 Support** - Userinfo, introspect, and authorization endpoints
- **Password Security** - bcrypt hashing for secure password storage
- **Session Management** - HTTP-only cookies for secure token handling
- **Email Verification** - Complete email verification workflow
- **Password Reset** - Secure password recovery mechanism
- **System Key Authentication** - Dedicated `sk_` key for application-to-server communication

### 🔄 **Authentication Flow**

```go
// Registration Process
1. User submits registration → API validation
2. Password hashing with bcrypt → Database storage
3. JWT tokens generated → Client receives tokens
4. User logged in

// Login Process
1. User submits credentials → API validation
2. Password verification → JWT token generation
3. Tokens stored → User authenticated
4. Redirect to protected routes

// Token Refresh
1. Background token refresh → Automatic renewal
2. Invalid tokens → Redirect to login
3. Session expiration → Clean logout

// System Key Authentication
1. Application includes system key in Authorization header
2. Server validates system key
3. Request processed with system key privileges
4. Response returned to application
```

### 🛡️ **Security Features**

- **RBAC Middleware** - Role-based access control for all endpoints
- **Input Validation** - Comprehensive request validation
- **Rate Limiting** - Protection against brute force attacks
- **CORS Configuration** - Secure cross-origin resource sharing
- **Security Headers** - HTTP security headers for all responses
- **CSRF Protection** - Cross-site request forgery prevention
- **XSS Protection** - Cross-site scripting prevention
- **System Key Isolation** - System key is separate from regular service keys

---

## 📞 Support & Community

### 💬 **Get Help**

- 📖 **[Documentation](https://github.com/skygenesisenterprise/aether-identity/docs/)** - Comprehensive guides and API docs
- 🐛 **[GitHub Issues](https://github.com/skygenesisenterprise/aether-identity/issues)** - Bug reports and feature requests
- 💡 **[GitHub Discussions](https://github.com/skygenesisenterprise/aether-identity/discussions)** - General questions and ideas

### 🐛 **Reporting Issues**

When reporting bugs, please include:

- Clear description of the problem
- Steps to reproduce
- Environment information (Go version, PostgreSQL version, OS, etc.)
- Error logs or screenshots
- Expected vs actual behavior

---

## 📊 Project Status

| Component                 | Status         | Technology                | Notes                             |
| ------------------------- | -------------- | ------------------------- | --------------------------------- |
| **Go Backend API**        | ✅ Working     | Gin + GORM                | High-performance with PostgreSQL  |
| **Authentication System** | ✅ Working     | JWT + OAuth2              | Complete implementation          |
| **Security Middleware**   | ✅ Working     | RBAC + Validation         | Enterprise-grade security       |
| **Database Layer**        | ✅ Working     | GORM + PostgreSQL         | Auto-migrations + user models    |
| **API Endpoints**         | ✅ Working     | RESTful API              | Complete identity management     |
| **OAuth2 Support**        | ✅ Working     | Userinfo + Introspect     | Full OAuth2 specification        |
| **Testing Suite**         | 🔄 In Progress | Go Testing Framework      | Unit and integration tests       |
| **API Documentation**     | 📋 Planned     | Swagger/OpenAPI          | Comprehensive API docs          |
| **Performance Optimization** | 📋 Planned | Caching + Optimization  | Query and caching optimization  |
| **System Key Authentication** | ✅ Working | System Key Middleware | Application-to-server auth |

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

- **Sky Genesis Enterprise** - Project leadership and development
- **Go Community** - High-performance programming language and ecosystem
- **Gin Framework** - Lightweight HTTP web framework
- **GORM Team** - Modern Go database library
- **PostgreSQL Team** - Reliable database backend
- **JWT Community** - JSON Web Token specification and libraries
- **OAuth2 Community** - OAuth2 specification and best practices
- **Open Source Community** - Tools, libraries, and inspiration

---

<div align="center">

### 🚀 **Join Us in Building the Future of Enterprise Identity Management!**

[⭐ Star This Repo](https://github.com/skygenesisenterprise/aether-identity) • [🐛 Report Issues](https://github.com/skygenesisenterprise/aether-identity/issues) • [💡 Start a Discussion](https://github.com/skygenesisenterprise/aether-identity/discussions)

**🔐 Enterprise-Grade Identity Management with Go and Gin**

**Made with ❤️ by the [Sky Genesis Enterprise](https://skygenesisenterprise.com) team**

_Building secure, high-performance identity management solutions for enterprises_

</div>
