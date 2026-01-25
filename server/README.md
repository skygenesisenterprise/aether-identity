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

### 🎯 Our Vision

- **🚀 High-Performance Backend** - Go 1.21+ with Gin framework for maximum throughput
- **🔐 Complete Security** - JWT authentication, RBAC, input validation, and security headers
- **🔄 OAuth2 Compliance** - Full OAuth2 specification implementation
- **📊 RESTful API** - Well-documented, versioned API endpoints
- **🗄️ Database Integration** - GORM ORM with PostgreSQL for data persistence
- **🛠️ Developer-Friendly** - Comprehensive Makefile, hot reload, and testing support

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

#### 📊 **API Endpoints**

- ✅ **Authentication** - Login, register, logout, refresh token
- ✅ **User Management** - CRUD operations for users
- ✅ **OAuth2** - Userinfo, introspect, authorize endpoints
- ✅ **Health Checks** - Database health and maintenance endpoints
- ✅ **Organization** - Organization and membership management
- ✅ **Roles** - Role and permission management

#### 🗄️ **Database Layer**

- ✅ **GORM Integration** - Type-safe database operations
- ✅ **PostgreSQL Support** - Production-ready database backend
- ✅ **Auto-migrations** - Schema management with Prisma
- ✅ **Connection Pooling** - Performance optimization
- ✅ **Seed Scripts** - Development data initialization

---

## 📊 Current Status

> **✅ Production-Ready**: Complete authentication system with enterprise security features.

### ✅ **Currently Implemented**

#### 🏗️ **Core Foundation**

- ✅ **Go Backend Server** - High-performance Gin API
- ✅ **Authentication System** - JWT with refresh tokens and OAuth2 support
- ✅ **Database Layer** - GORM with PostgreSQL and complete identity models
- ✅ **Security Middleware** - RBAC, validation, rate limiting, CORS
- ✅ **API Endpoints** - Complete RESTful API for identity management

#### 🔐 **Security Implementation**

- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **RBAC Middleware** - Role-based access control
- ✅ **Input Validation** - Comprehensive request validation
- ✅ **Rate Limiting** - Protection against brute force attacks
- ✅ **Security Headers** - HTTP security headers

#### 📊 **API Features**

- ✅ **Authentication** - Login, register, logout, refresh token
- ✅ **User Management** - CRUD operations with proper authorization
- ✅ **OAuth2** - Userinfo, introspect, authorize endpoints
- ✅ **Health Checks** - Database health monitoring
- ✅ **Organization** - Organization and membership management
- ✅ **Roles** - Role and permission management

#### 🛠️ **Development Infrastructure**

- ✅ **Development Environment** - Hot reload, Go modules
- ✅ **Docker Deployment** - Production-ready containerization
- ✅ **Makefile** - Comprehensive build and development commands
- ✅ **Testing Suite** - Unit and integration tests
- ✅ **Structured Logging** - Zerolog-based logging

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
- **Swagger Docs**: [http://localhost:8080/docs](http://localhost:8080/docs) (if enabled)

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
├── 🛡️ Middleware (Security, CORS, Logging, RBAC)
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
│   │   └── config.go     # Server configuration
│   ├── controllers/      # HTTP request handlers
│   │   ├── auth.go       # Authentication endpoints
│   │   ├── user.go       # User management endpoints
│   │   ├── oauth.go      # OAuth2 endpoints
│   │   ├── token.go      # Token management endpoints
│   │   └── health.go     # Health check endpoints
│   ├── interfaces/       # Interface definitions
│   │   ├── jwt_service.go # JWT service interface
│   │   └── user_repository.go # User repository interface
│   ├── middleware/       # HTTP middleware
│   │   ├── auth.go       # Authentication middleware
│   │   ├── rbac.go       # RBAC middleware
│   │   ├── validation.go # Input validation middleware
│   │   └── database.go   # Database connection middleware
│   ├── model/            # Data models
│   │   ├── auth.go       # Authentication models
│   │   ├── user.go       # User models
│   │   ├── organization.go # Organization models
│   │   ├── role.go       # Role models
│   │   └── token.go      # Token models
│   ├── routes/           # API route definitions
│   │   └── routes.go     # Route configuration
│   ├── services/         # Business logic
│   │   ├── auth.go       # Authentication service
│   │   ├── user.go       # User service
│   │   ├── jwt.go        # JWT service implementation
│   │   └── database.go   # Database service
│   └── tests/            # Unit and integration tests
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

### 🔑 **Authentication Endpoints**

#### Register a new user

```bash
POST /api/v1/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "tokens": {
      "access_token": "eyJhbGci...",
      "refresh_token": "eyJhbGci..."
    }
  },
  "message": "User registered successfully"
}
```

#### Login

```bash
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tokens": {
      "access_token": "eyJhbGci...",
      "refresh_token": "eyJhbGci..."
    }
  },
  "message": "Login successful"
}
```

#### Refresh Token

```bash
POST /api/v1/auth/refresh
```

**Request Body:**
```json
{
  "refresh_token": "eyJhbGci..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGci..."
  },
  "message": "Token refreshed successfully"
}
```

#### Logout

```bash
POST /api/v1/auth/logout
```

**Headers:**
```bash
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 👤 **User Management Endpoints**

#### Get current user

```bash
GET /api/v1/users/me
```

**Headers:**
```bash
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z",
    "role": "user"
  },
  "message": "User retrieved successfully"
}
```

#### Update user profile

```bash
PUT /api/v1/users/me
```

**Headers:**
```bash
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "email": "newemail@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "email": "newemail@example.com",
    "name": "John Doe Updated",
    "updated_at": "2024-01-16T14:20:00Z"
  },
  "message": "User updated successfully"
}
```

#### Change password

```bash
POST /api/v1/users/change-password
```

**Headers:**
```bash
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "current_password": "oldPassword123",
  "new_password": "newSecurePassword456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### 🔄 **OAuth2 Endpoints**

#### Userinfo

```bash
GET /api/v1/oauth/userinfo
```

**Headers:**
```bash
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sub": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "message": "Userinfo retrieved successfully"
}
```

#### Introspect Token

```bash
POST /api/v1/oauth/introspect
```

**Request Body:**
```json
{
  "token": "eyJhbGci..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "active": true,
    "sub": "user-123",
    "exp": 1735689600,
    "iat": 1735686000,
    "role": "user"
  },
  "message": "Token is active"
}
```

### 🏢 **Organization Endpoints**

#### Create organization

```bash
POST /api/v1/organizations
```

**Headers:**
```bash
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "Acme Corp",
  "description": "Enterprise software company"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "org-456",
    "name": "Acme Corp",
    "description": "Enterprise software company",
    "created_at": "2024-01-17T09:15:00Z"
  },
  "message": "Organization created successfully"
}
```

#### Get organization members

```bash
GET /api/v1/organizations/{org_id}/members
```

**Headers:**
```bash
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "user_id": "user-123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "admin"
    },
    {
      "user_id": "user-789",
      "email": "member@example.com",
      "name": "Jane Smith",
      "role": "member"
    }
  ],
  "message": "Members retrieved successfully"
}
```

### 🛡️ **Health Check Endpoints**

#### Server Health

```bash
GET /api/v1/health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-18T11:25:00Z"
  },
  "message": "Server is healthy"
}
```

#### Database Health

```bash
GET /api/v1/health/database
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "database": "PostgreSQL",
    "version": "14.5",
    "timestamp": "2024-01-18T11:25:00Z"
  },
  "message": "Database connection is healthy"
}
```

### 📚 **API Usage Examples**

#### Using cURL

```bash
# Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securePassword123"}'

# Get user info (with auth)
curl -X GET http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer eyJhbGci..."
```

#### Using JavaScript (Fetch API)

```javascript
// Login
const login = async (email, password) => {
  const response = await fetch('http://localhost:8080/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return await response.json();
};

// Get user info
const getUser = async (token) => {
  const response = await fetch('http://localhost:8080/api/v1/users/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
};
```

#### Using Python (Requests)

```python
import requests

# Login
response = requests.post(
  'http://localhost:8080/api/v1/auth/login',
  json={'email': 'user@example.com', 'password': 'securePassword123'}
)
tokens = response.json()['data']

# Get user info
headers = {'Authorization': f'Bearer {tokens["access_token"]}'}
response = requests.get('http://localhost:8080/api/v1/users/me', headers=headers)
user = response.json()['data']
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
│  (Auth, RBAC, Validation, Database, Logging)              │
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
```

### 🛡️ **Security Features**

- **RBAC Middleware** - Role-based access control for all endpoints
- **Input Validation** - Comprehensive request validation
- **Rate Limiting** - Protection against brute force attacks
- **CORS Configuration** - Secure cross-origin resource sharing
- **Security Headers** - HTTP security headers for all responses
- **CSRF Protection** - Cross-site request forgery prevention
- **XSS Protection** - Cross-site scripting prevention

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

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](https://github.com/skygenesisenterprise/aether-identity/blob/main/LICENSE) file for details.

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
