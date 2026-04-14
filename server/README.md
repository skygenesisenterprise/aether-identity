<div align="center">

# 🚀 Aether Identity API

[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](https://github.com/skygenesisenterprise/aether-identity/blob/main/LICENSE) [![Go](https://img.shields.io/badge/Go-1.21+-blue?style=for-the-badge&logo=go)](https://golang.org/) [![Gin](https://img.shields.io/badge/Gin-1.9+-lightgrey?style=for-the-badge&logo=go)](https://gin-gonic.com/) [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/) [![Prisma](https://img.shields.io/badge/Prisma-5+-2D3748?style=for-the-badge)](https://prisma.io/)

**🔐 Enterprise Identity & Access Management - Complete OAuth 2.0 / OIDC Platform**

Aether Identity is a comprehensive **identity management platform** built with Go, providing complete authentication, authorization, multi-tenancy, and enterprise features with OAuth 2.0 / OIDC compliance.

[🚀 Quick Start](#-quick-start) • [📋 Features](#-features) • [🛠️ Tech Stack](#-tech-stack) • [📁 Architecture](#-architecture) • [🔐 Authentication](#-authentication) • [📊 API Reference](#-api-reference) • [🤝 Contributing](#-contributing)

[![GitHub stars](https://img.shields.io/github/stars/skygenesisenterprise/aether-identity?style=social)](https://github.com/skygenesisenterprise/aether-identity/stargazers) [![GitHub forks](https://img.shields.io/github/forks/skygenesisenterprise/aether-identity?style=social)](https://github.com/skygenesisenterprise/aether-identity/network) [![GitHub issues](https://img.shields.io/github/issues/github/skygenesisenterprise/aether-identity)](https://github.com/skygenesisenterprise/aether-identity/issues)

</div>

---

## 🌟 What is Aether Identity?

**Aether Identity** is an enterprise-grade identity and access management platform that provides complete authentication, authorization, and user management capabilities with OAuth 2.0 / OIDC compliance.

### 🎯 Core Vision

- **🔐 Complete Authentication** - JWT-based system with login/register, MFA, social login
- **🏢 Enterprise Multi-Tenancy** - Organization, domain, and tenant management
- **🔗 OAuth 2.0 / OIDC** - Full compliance with authorization code, client credentials, refresh token flows
- **🛡️ Advanced Security** - MFA (TOTP, Email, SMS), attack protection, brute-force detection
- **📱 Social Connections** - Google, GitHub, Microsoft, Discord, Apple, Facebook integration
- **🏗️ Enterprise Connections** - SAML 2.0, OIDC, passwordless authentication
- **📊 Analytics** - Activity tracking, user stats, security monitoring

---

## 📋 Features

### 🔐 Authentication & Security

- ✅ **JWT Authentication** - Access tokens with refresh token mechanism
- ✅ **Multi-Factor Authentication (MFA)** - TOTP, Email, SMS support
- ✅ **Social Login** - Google, GitHub, Microsoft, Discord, Apple, Facebook
- ✅ **Enterprise Connections** - SAML 2.0, OIDC, passwordless
- ✅ **Attack Protection** - Brute-force detection, rate limiting
- ✅ **Password Policies** - Strength validation, breach detection

### 👥 User Management

- ✅ **User CRUD** - Create, read, update, delete users
- ✅ **User Blocking** - Block/unblock, force logout
- ✅ **Password Reset** - Email-based reset flow
- ✅ **Email Verification** - Email confirmation
- ✅ **Session Management** - Active sessions, force logout

### 🏢 Organizations & Domains

- ✅ **Organization Management** - Create, update, delete organizations
- ✅ **Member Management** - Add, remove, update roles
- ✅ **Domain Management** - Custom domains, verification
- ✅ **Multi-Tenancy** - Tenant isolation, billing

### 🔗 Connections & Applications

- ✅ **OAuth 2.0 Clients** - Client credentials, redirect URIs
- ✅ **Applications** - SPA, web, native, API, M2M applications
- ✅ **Database Connections** - Custom database authentication
- ✅ **Social Providers** - Configure social login providers
- ✅ **Authentication Profiles** - Customizable auth flows

### 📊 Security & Monitoring

- ✅ **MFA Policies** - Per-connection MFA requirements
- ✅ **Security Analytics** - Threat detection, breach monitoring
- ✅ **Activity Logs** - Comprehensive audit trail
- ✅ **Health Monitoring** - System status, metrics

### 🎨 Branding & Customization

- ✅ **Universal Login** - Custom login pages
- ✅ **Branding** - Colors, logos, custom CSS
- ✅ **Custom Domains** - Full domain customization
- ✅ **Templates** - Pre-built branding templates

### ⚡ Actions & Extensions

- ✅ **Actions** - Custom code execution on triggers
- ✅ **Action Library** - Reusable action components
- ✅ **Extensions** - Third-party integrations
- ✅ **Marketplace** - Integration plugins

---

## 🛠️ Tech Stack

### ⚙️ Backend Layer

```
Go 1.21+ + Gin Framework
├── 🗄️ GORM + PostgreSQL (Database)
├── 🔐 JWT Authentication (OAuth 2.0 / OIDC)
├── 🛡️ Middleware (Security, CORS, Logging)
├── 🌐 HTTP Router (Gin Router)
├── 📦 JSON Serialization (Native Go)
└── 🔒 Password Security (bcrypt)
```

### 🗄️ Data Layer

```
PostgreSQL 14+ + GORM + Prisma
├── 🏗️ Schema Management (Auto-migration)
├── 🔍 Query Builder (Type-Safe Queries)
├── 🔄 Connection Pooling (Performance)
├── 👤 User Models (Complete Implementation)
└── 📈 Seed Scripts (Development Data)
```

### 📦 Infrastructure

```
Make + Go Modules + Docker
├── 🐳 Docker Deployment
├── 📦 Prisma ORM (Database)
└── 🔧 CLI Tools (Management)
```

---

## 🚀 Quick Start

### 📋 Prerequisites

- **Go** 1.21.0 or higher
- **PostgreSQL** 14.0 or higher
- **Docker** (optional, for container deployment)
- **Make** (for command shortcuts)

### 🔧 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/skygenesisenterprise/aether-identity.git
   cd aether-identity
   ```

2. **Environment setup**

   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Quick start (recommended)**

   ```bash
   # Install dependencies and start server
   make install
   make dev
   ```

4. **Manual setup**

   ```bash
   # Install Go dependencies
   go mod download

   # Generate Prisma client
   make db-generate

   # Run database migrations
   make db-migrate

   # Start development server
   make server
   ```

### 🌐 Access Points

Once running, you can access:

- **API Server**: [http://localhost:8080](http://localhost:8080)
- **Health Check**: [http://localhost:8080/health](http://localhost:8080/api/v1/health)
- **OAuth Endpoints**: [http://localhost:8080/oauth](http://localhost:8080/oauth)

### 🎯 **Make Commands**

```bash
# 🚀 Server Management
make server           # Start development server
make server-prod      # Start production server
make build            # Build binary

# 🗄️ Database
make db-generate     # Generate Prisma client
make db-migrate      # Run migrations
make db-studio       # Open Prisma Studio
make db-seed         # Seed development data
make db-reset        # Reset database

# 🔧 Code Quality
make lint            # Lint code
make format          # Format code

# 🐳 Docker
make docker-build    # Build Docker image
make docker-run      # Run with Docker
make docker-stop    # Stop Docker services

# 🛠️ Utilities
make help            # Show all commands
make status          # Show project status
make health          # Check service health
```

---

## ���� Architecture

### 🏗️ Server Structure

```
server/
├── main.go                 # Main entry point
├── Makefile               # Build & development commands
├── prisma/
│   └── schema.prisma      # Database schema (60+ models)
├── src/
│   ├── config/           # Configuration
│   │   ├── config.go     # Main configuration
│   │   ├── oauth_config.go
│   │   └── oauth_providers_config.go
│   ├── controllers/      # HTTP handlers (18 controllers)
│   │   ├── auth.go
│   │   ├── user.go
│   │   ├── oauth_controller.go
│   │   ├── application_controller.go
│   │   ├── organization_controller.go
│   │   ├── connection_controller.go
│   │   ├── security_controller.go
│   │   ├── branding_controller.go
│   │   ├── action_controller.go
│   │   ├── extension_controller.go
│   │   ├── log_controller.go
│   │   ├── activity_controller.go
│   │   ├── settings_controller.go
│   │   ├── agent_controller.go
│   │   ├── event_controller.go
│   │   ├── marketplace_controller.go
│   │   └── tenant_controller.go
│   ├── middleware/       # Gin middleware (10 middlewares)
│   │   ├── auth.go
│   │   ├── cors.go
│   │   ├── admin_middleware.go
│   │   ├── app_auth.go
│   │   ├── service_key_auth.go
│   │   ├── oauth_middleware.go
│   │   ├── totp.go
│   │   ├── rbac.go
│   │   ├── database.go
│   │   └── validation.go
│   ├── models/           # Data models (27 models)
│   │   ├── user.go
│   │   ├── organization.go
│   │   ├── application.go
│   │   ├── connection.go
│   │   ├── security.go
│   │   ├── oauth.go
│   │   ├── role.go
│   │   ├── domain.go
│   │   ├── branding.go
│   │   ├── action.go
│   │   ├── extension.go
│   │   └── ...
│   ├── routes/           # API routes
│   │   └── routes.go    # All route definitions
│   ├── services/         # Business logic (22 services)
│   │   ├── user.go
│   │   ├── auth_service.go
│   │   ├── jwt.go
│   │   ├── oauth.go
│   │   ├── application_service.go
│   │   ├── organization_service.go
│   │   ├── connection_service.go
│   │   ├── security_service.go
│   │   └── ...
│   ├── interfaces/       # Interface definitions
│   └── utils/            # Utility functions
├── LICENSE
└── README.md
```

### 🔄 **Data Flow Architecture**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client App    │    │   Gin API        │    │   PostgreSQL    │
│   (Frontend)    │◄──►│   (Backend)      │◄──►│   (Database)    │
│  Port 3000      │    │  Port 8080       │    │  Port 5432      │
│  TypeScript     │    │  Go              │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                      │                       │
         ▼                      ▼                       ▼
    JWT Tokens            API Endpoints         User/Org Data
    OAuth 2.0            Authentication         GORM ORM
    React Context        Business Logic        Prisma ORM
         │                      │
         ▼                      ▼
    ┌─────────────────┐    ┌──────────────────┐
    │  Social Login   │    │  Security        │
    │  Google        │    │  MFA, Brute-force│
    │  GitHub        │    │  Protection      │
    │  Discord       │    │                  │
    └─────────────────┘    └──────────────────┘
```

---

## 🔐 Authentication

### 🎯 **OAuth 2.0 flows**

The API supports multiple OAuth 2.0 grant types:

- **Authorization Code** - Standard web applications
- **Authorization Code + PKCE** - Mobile/SPA applications
- **Client Credentials** - M2M (machine-to-machine)
- **Refresh Token** - Token refresh
- **Password Grant** - Legacy support (deprecated)

### 🔑 **Token Endpoints**

```
POST /oauth/token          # Token endpoint
POST /oauth/revoke         # Token revocation
GET  /oauth/userinfo       # User info endpoint
GET  /oauth/authorize      # Authorization endpoint
GET  /oauth/.well-known/openid-configuration  # OIDC Discovery
GET  /oauth/jwks           # JSON Web Key Set
```

### 🛡️ **Security Implementation**

- JWT tokens with RS256 signing
- Token expiration (access: 15min, refresh: 7 days)
- Scope-based authorization
  -Rate limiting per endpoint
- CORS configuration
- Input validation

---

## 📊 API Reference

### 📋 **Core Endpoints**

#### Authentication (`/api/v1/auth`)

| Method | Endpoint               | Description            |
| ------ | ---------------------- | ---------------------- |
| POST   | /auth/login            | User login             |
| POST   | /auth/register         | User registration      |
| POST   | /auth/logout           | User logout            |
| POST   | /auth/refresh          | Refresh token          |
| POST   | /auth/token            | OAuth token            |
| GET    | /auth/authorize        | Authorization endpoint |
| GET    | /auth/discord/callback | Discord OAuth callback |

#### Users (`/api/v1/users`)

| Method | Endpoint   | Description  |
| ------ | ---------- | ------------ |
| GET    | /users     | List users   |
| POST   | /users     | Create user  |
| GET    | /users/:id | Get user     |
| PUT    | /users/:id | Update user  |
| DELETE | /users/:id | Delete user  |
| GET    | /users/me  | Current user |

#### Organizations (`/api/v1/organizations`)

| Method | Endpoint                   | Description         |
| ------ | -------------------------- | ------------------- |
| GET    | /organizations             | List organizations  |
| POST   | /organizations             | Create organization |
| GET    | /organizations/:id         | Get organization    |
| PUT    | /organizations/:id         | Update organization |
| DELETE | /organizations/:id         | Delete organization |
| GET    | /organizations/:id/members | List members        |

#### Applications (`/api/v1/applications`)

| Method | Endpoint                        | Description        |
| ------ | ------------------------------- | ------------------ |
| GET    | /applications                   | List applications  |
| POST   | /applications                   | Create application |
| GET    | /applications/:id               | Get application    |
| PATCH  | /applications/:id               | Update application |
| DELETE | /applications/:id               | Delete application |
| POST   | /applications/:id/rotate-secret | Rotate secret      |

#### Connections (`/api/v1/connections`)

| Method | Endpoint                 | Description        |
| ------ | ------------------------ | ------------------ |
| GET    | /connections             | List connections   |
| POST   | /connections             | Create connection  |
| GET    | /connections/:id         | Get connection     |
| PATCH  | /connections/:id         | Update connection  |
| DELETE | /connections/:id         | Delete connection  |
| POST   | /connections/:id/enable  | Enable connection  |
| POST   | /connections/:id/disable | Disable connection |

#### MFA (`/api/v1/security/mfa`)

| Method | Endpoint                  | Description            |
| ------ | ------------------------- | ---------------------- |
| GET    | /security/mfa/methods     | List MFA methods       |
| PATCH  | /security/mfa/methods/:id | Enable/disable MFA     |
| GET    | /security/mfa/policies    | List MFA policies      |
| POST   | /security/mfa/policies    | Create MFA policy      |
| POST   | /security/mfa/challenge   | Initiate MFA challenge |
| POST   | /security/mfa/verify      | Verify MFA code        |

#### Settings (`/api/v1/settings`)

| Method | Endpoint        | Description           |
| ------ | --------------- | --------------------- |
| GET    | /settings       | Get system settings   |
| PATCH  | /settings       | Update settings       |
| GET    | /settings/email | Get email settings    |
| PATCH  | /settings/email | Update email settings |

### 📋 **OAuth Endpoints**

| Method | Endpoint                                | Description            |
| ------ | --------------------------------------- | ---------------------- |
| GET    | /oauth/authorize                        | Authorization endpoint |
| POST   | /oauth/token                            | Token endpoint         |
| GET    | /oauth/userinfo                         | User info endpoint     |
| POST   | /oauth/revoke                           | Revoke endpoint        |
| GET    | /oauth/.well-known/openid-configuration | OIDC Discovery         |
| GET    | /oauth/jwks                             | JWKS endpoint          |

---

## 🗺️ Development Roadmap

### 🎯 **Phase 1: Core Identity (✅ Complete)**

- ✅ User CRUD + blocking/reset password
- ✅ JWT Authentication with refresh tokens
- ✅ Login/Signup flows
- ✅ Basic logging

### 🚀 **Phase 2: Security (✅ Complete)**

- ✅ MFA methods (TOTP, Email, SMS)
- ✅ MFA policies
- ✅ Attack protection
- ✅ Security analytics

### 🏢 **Phase 3: Enterprise Features (✅ Complete)**

- ✅ Organizations + members
- ✅ Domain management
- ✅ Custom domains
- ✅ Enterprise connections

### 📦 **Phase 4: Extensions (🔄 In Progress)**

- ⏳ Actions CRUD + deployment
- ⏳ Extensions management
- ⏳ Marketplace integrations
- 📋 Webhooks

### 🎨 **Phase 5: Advanced Features (📋 Planned)**

- 📋 Branding customization
- 📋 Real-time logs stream
- 📋 Activity analytics
- 📋 Agent management

---

## 🤝 Contributing

We're looking for contributors to help build this identity platform!

### 🏗️ Areas Needing Help

- **Go Backend Development** - API endpoints, business logic
- **Security** - Authentication, encryption, MFA
- **Database Design** - Schema, migrations, optimization
- **Frontend Development** - Admin dashboard
- **DevOps** - Docker, deployment, CI/CD
- **Documentation** - API docs, guides

### 📝 **Contribution Process**

1. **Fork the repository** and create a feature branch
2. **Check the issues** for tasks that need help
3. **Implement your changes** following our guidelines
4. **Test thoroughly** before submitting
5. **Submit a pull request** with clear description

---

## 📞 Support & Community

### 💬 **Get Help**

- 📖 **[Documentation](docs/)** - Comprehensive guides
- 🐛 **[GitHub Issues](https://github.com/skygenesisenterprise/aether-identity/issues)** - Bug reports
- 💡 **[GitHub Discussions](https://github.com/skygenesisenterprise/aether-identity/discussions)** - Questions

---

## 📊 Project Status

| Component            | Status         | Technology | Notes                    |
| -------------------- | -------------- | ---------- | ------------------------ |
| **Authentication**   | ✅ Working     | JWT + Go   | Complete implementation  |
| **OAuth 2.0 / OIDC** | ✅ Working     | Go + Gin   | Full compliance          |
| **User Management**  | ✅ Working     | Go + GORM  | CRUD operations          |
| **Organization**     | ✅ Working     | Go + GORM  | Multi-tenant support     |
| **MFA**              | ✅ Working     | Go         | TOTP, Email, SMS         |
| **Security**         | ✅ Working     | Go         | Attack protection        |
| **Connections**      | ✅ Working     | Go + GORM  | Database, Social, SAML   |
| **Actions**          | 🔄 In Progress | Go         | Custom code execution    |
| **Extensions**       | 🔄 In Progress | Go         | Third-party integrations |
| **Admin Dashboard**  | 📋 Planned     | React      | User management UI       |

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

- **Go Community** - High-performance programming language
- **Gin Framework** - Lightweight HTTP web framework
- **GORM Team** - Modern Go database library
- **Prisma Team** - Database ORM
- **Sky Genesis Enterprise** - Project leadership
- **Open Source Community** - Tools, libraries, and inspiration

---

<div align="center">

### 🚀 **Join Us in Building the Future of Identity Management!**

[⭐ Star This Repo](https://github.com/skygenesisenterprise/aether-identity) • [🐛 Report Issues](https://github.com/skygenesisenterprise/aether-identity/issues) • [💡 Start a Discussion](https://github.com/skygenesisenterprise/aether-identity/discussions)

---

**🔐 Complete Enterprise Identity Platform with OAuth 2.0 / OIDC Support!**

**Made with ❤️ by the [Sky Genesis Enterprise](https://skygenesisenterprise.com) team**

_Building the future of enterprise identity management_

</div>
