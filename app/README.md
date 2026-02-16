<div align="center">

# Aether Identity - Frontend Application

[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE) [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/) [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/) [![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-black?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

**Enterprise Identity Management Platform - Next.js 16 + React 19 with shadcn/ui**

A modern, enterprise-ready identity management platform built with **Next.js 16**, **React 19**, and **TypeScript 5.9**. Features complete authentication flows, OAuth2/OIDC support, comprehensive admin dashboard, integrated documentation, and advanced security features.

[Quick Start](#quick-start) • [Features](#features) • [Tech Stack](#tech-stack) • [Architecture](#architecture) • [Development](#development) • [Contributing](#contributing)

</div>

---

## Preview

![Aether Identity Dashboard](assets/Capture%20d%27%C3%A9cran%20du%202026-02-16%2009-47-54.png)

---

## Overview

**Aether Identity Frontend** is an enterprise-grade identity management platform providing secure authentication, comprehensive administration tools, multi-tenant organization management, and advanced security features. Built with cutting-edge web technologies, it delivers a seamless experience for both end-users and administrators.

### Key Features

- **Complete Authentication System** - Login, registration, password recovery, TOTP MFA, social authentication, and PIN-based methods
- **Enterprise Admin Dashboard** - 10 major sections with 70+ administrative pages
- **Integrated Documentation** - Complete SDK documentation for 12 programming languages plus architecture and security guides
- **OAuth2/OIDC Support** - Full authorization server capabilities
- **Billing Management** - Subscription plans, usage tracking, and billing administration
- **Advanced Security** - MFA, PAM, DLP, threat detection, audit logging, and compliance management
- **Modern UI/UX** - shadcn/ui component library with Tailwind CSS v4
- **Dark Mode Support** - System-aware theme switching with persistence
- **Responsive Design** - Mobile-first approach with adaptive layouts
- **Security-First** - Protected routes, JWT management, enterprise-grade security
- **TypeScript Strict** - Full type safety across the entire codebase

---

## Quick Start

### Prerequisites

- **Node.js** 18.0.0 or higher
- **pnpm** 9.0.0 or higher (recommended)
- **Git** for version control

### Installation & Setup

1. **Navigate to the app directory**

   ```bash
   cd app
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**

   ```bash
   pnpm dev
   ```

### Access Points

| Endpoint            | URL                                   | Description              |
| ------------------- | ------------------------------------- | ------------------------ |
| **Frontend**        | http://localhost:3001                 | Main application         |
| **Login**           | http://localhost:3001/login           | Authentication page      |
| **Register**        | http://localhost:3001/register        | User registration        |
| **Forgot Password** | http://localhost:3001/forgot          | Password recovery        |
| **TOTP Setup**      | http://localhost:3001/totp            | MFA configuration        |
| **Admin Dashboard** | http://localhost:3001/admin           | Administration console   |
| **Billing**         | http://localhost:3001/admin/billing   | Subscription and billing |
| **Documentation**   | http://localhost:3001/docs            | SDK documentation        |
| **OAuth Auth**      | http://localhost:3001/oauth/authorize | OAuth2 authorization     |

### Available Commands

```bash
# Development
pnpm dev              # Start development server (port 3001)
pnpm dev:local        # Start with local environment
pnpm dev:debug        # Start with debug mode enabled

# Building
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm typecheck        # TypeScript type checking

# Maintenance
pnpm clean            # Clean build artifacts
```

---

## Features

### Authentication & Security

- **JWT Token Management** - Secure authentication with automatic refresh
- **Multi-Factor Authentication** - TOTP support with QR code setup
- **Social Authentication** - GitHub OAuth integration
- **PIN Method Support** - Alternative authentication methods
- **Organization-based Auth** - Multi-tenant login with organization selection
- **Protected Routes** - Automatic redirection and access control
- **Session Management** - Persistent sessions with secure storage
- **Password Recovery** - Secure forgot password flow with confirmation

### Admin Dashboard

Comprehensive administration interface with 10 major sections:

| Section          | Description                                                                                                           | Pages |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- | ----- |
| **Home**         | Dashboard overview and metrics                                                                                        | 1     |
| **Platform**     | Identity, system, policy, token, key, cache, domains, encryption, events, protocols, regions, SSO, certificates, logs | 14    |
| **Organization** | Structure, people, RBAC, policies, trust, groups, lifecycle, provisioning, profiles, sessions, logs                   | 11    |
| **Operations**   | Services, observability, environments, deployments, database, backups, capacity, costs, DR, IAC, logs, tasks          | 12    |
| **Integrations** | Directory, email, external systems, providers, provisioning, SCIM, services, webhooks, logs                           | 9     |
| **Security**     | Secrets, audit logs, identity security, compliance, conditional access, DLP, MFA, PAM, passwords, threats             | 10    |
| **Reports**      | Access, compliance, cross-authority, dormant accounts, privilege, behavior, logs                                      | 7     |
| **Settings**     | Naming, context, data, automation, notifications, views, workspace, license, updates, governance                      | 10    |
| **Billing**      | Plans, subscriptions, usage tracking                                                                                  | 2     |
| **Profile**      | User profile management                                                                                               | 1     |
| **Support**      | Help and support center                                                                                               | 1     |

### Documentation Platform

Integrated documentation site with comprehensive guides:

- **12 Programming Languages** - Dart, .NET, Elixir, Go, Java, Kotlin, Node.js, PHP, Python, Rust, Scala, Swift
- **Getting Started Guides** - Installation, configuration, first steps
- **Core SDK Documentation** - Client/server implementation, RBAC, tokens
- **Architecture Guides** - System architecture and design patterns
- **Security Documentation** - Security best practices and implementation
- **Extensions & Tools** - CLI, GitHub Actions, VSCode extension, OpenAPI
- **Runtime Guides** - Docker, Kubernetes, Snap deployment
- **Integration Guides** - Third-party integrations and connectors
- **Observability** - Monitoring, logging, and observability setup

### User Interface

- **50+ shadcn/ui Components** - Complete design system
- **Responsive Dashboard** - Adaptive layouts for all screen sizes
- **Dark/Light Themes** - System preference detection
- **Animated Transitions** - Smooth page transitions with Framer Motion
- **Data Visualization** - Charts and metrics with Recharts
- **Accessible Design** - WCAG 2.1 compliant components

### Developer Experience

- **TypeScript 5.9 Strict Mode** - Full type safety
- **Hot Module Replacement** - Instant updates during development
- **ESLint** - Consistent code quality
- **Structured Logging** - Pino-based logging with multiple transports
- **Path Aliases** - Clean imports with `@/*` aliases

---

## Tech Stack

### Core Framework

| Technology       | Version | Purpose                         |
| ---------------- | ------- | ------------------------------- |
| **Next.js**      | 16.1.6  | React framework with App Router |
| **React**        | 19.x    | UI library                      |
| **TypeScript**   | 5.9.3   | Type-safe development           |
| **Tailwind CSS** | 4.1.18  | Utility-first styling           |
| **Radix UI**     | 1.x     | Headless accessible primitives  |

### Key Dependencies

**Production:**

- `aether-identity` - Identity SDK client
- `@radix-ui/*` - Accessible UI primitives
- `@loglayer/transport-pino` - Structured logging
- `@prisma/client` - Database ORM
- `framer-motion` - Animations
- `lucide-react` - Icons
- `pino` - JSON logger
- `recharts` - Charts
- `zod` - Schema validation
- `react-hook-form` - Form management
- `next-themes` - Theme management
- `qrcode.react` - QR code generation
- `sonner` - Toast notifications
- `date-fns` - Date utilities
- `embla-carousel-react` - Carousels
- `input-otp` - OTP input component
- `vaul` - Drawer component

**Development:**

- `@types/*` - Type definitions
- `eslint` - Code linting
- `typescript` - TypeScript compiler
- `tailwindcss` - CSS framework
- `prisma` - Database tooling

---

## Architecture

### Project Structure

```
app/
├── app/                          # Next.js App Router
│   ├── login/                    # Login routes
│   │   ├── connected/            # Post-login redirect
│   │   ├── github/               # GitHub OAuth
│   │   ├── options/              # Login options
│   │   ├── organization/         # Organization selection
│   │   └── pin-method/           # PIN authentication
│   ├── register/                 # Registration routes
│   │   ├── confirmed/            # Registration confirmation
│   │   └── forgot/               # Forgot password from register
│   ├── forgot/                   # Password recovery
│   │   └── confirmed/            # Password reset confirmation
│   ├── totp/                     # TOTP/MFA routes
│   │   ├── confirmed/            # TOTP confirmation
│   │   └── register/             # TOTP registration
│   ├── admin/                    # Admin dashboard
│   │   ├── home/                 # Dashboard overview
│   │   ├── platform/             # Platform management
│   │   │   ├── identity/         # Identity management
│   │   │   ├── system/           # System settings
│   │   │   ├── policy/           # Policy management
│   │   │   ├── token/            # Token management
│   │   │   ├── key/              # Key management
│   │   │   ├── cache/            # Cache management
│   │   │   ├── certificates/     # SSL/TLS certificates
│   │   │   ├── domains/          # Domain management
│   │   │   ├── encryption/       # Encryption settings
│   │   │   ├── events/           # Event management
│   │   │   ├── logs/             # Platform logs
│   │   │   ├── protocols/        # Protocol configuration
│   │   │   ├── regions/          # Region management
│   │   │   └── sso/              # SSO configuration
│   │   ├── organization/         # Organization management
│   │   │   ├── structure/        # Org structure
│   │   │   ├── people/           # User management
│   │   │   ├── rbac/             # Role-based access
│   │   │   ├── policies/         # Organization policies
│   │   │   ├── trust/            # Trust settings
│   │   │   ├── groups/           # Group management
│   │   │   ├── lifecycle/        # Lifecycle management
│   │   │   ├── provisioning/     # User provisioning
│   │   │   ├── profiles/         # Profile management
│   │   │   ├── sessions/         # Session management
│   │   │   └── logs/             # Organization logs
│   │   ├── operations/           # Operations center
│   │   │   ├── services/         # Service management
│   │   │   ├── observability/    # Monitoring & observability
│   │   │   ├── environments/     # Environment management
│   │   │   ├── deployments/      # Deployment management
│   │   │   ├── database/         # Database operations
│   │   │   ├── backups/          # Backup management
│   │   │   ├── capacity/         # Capacity planning
│   │   │   ├── costs/            # Cost management
│   │   │   ├── dr/               # Disaster recovery
│   │   │   ├── iac/              # Infrastructure as code
│   │   │   ├── logs/             # Operations logs
│   │   │   └── tasks/            # Task management
│   │   ├── integrations/         # Integrations hub
│   │   │   ├── directory/        # Directory integrations
│   │   │   ├── email/            # Email integrations
│   │   │   ├── external/         # External systems
│   │   │   ├── providers/        # Identity providers
│   │   │   ├── provisioning/     # Provisioning integrations
│   │   │   ├── scim/             # SCIM protocol
│   │   │   ├── services/         # Service integrations
│   │   │   ├── webhooks/         # Webhook management
│   │   │   └── logs/             # Integration logs
│   │   ├── security/             # Security center
│   │   │   ├── secrets/          # Secret management
│   │   │   ├── audit/            # Audit logging
│   │   │   ├── identity/         # Identity security
│   │   │   ├── compliance/       # Compliance management
│   │   │   ├── conditional/      # Conditional access
│   │   │   ├── dlp/              # Data loss prevention
│   │   │   ├── mfa/              # MFA management
│   │   │   ├── pam/              # Privileged access
│   │   │   ├── passwords/        # Password policies
│   │   │   ├── threats/          # Threat detection
│   │   │   └── logs/             # Security logs
│   │   ├── report/               # Reports & analytics
│   │   │   ├── access/           # Access reports
│   │   │   ├── compliance/       # Compliance reports
│   │   │   ├── cross_authority/  # Cross-authority reports
│   │   │   ├── dormant/          # Dormant account reports
│   │   │   ├── privilege/        # Privilege reports
│   │   │   ├── behavior/         # Behavior analytics
│   │   │   └── logs/             # Report logs
│   │   ├── settings/             # System settings
│   │   │   ├── naming/           # Naming conventions
│   │   │   ├── context/          # Context settings
│   │   │   ├── data/             # Data management
│   │   │   ├── automation/       # Automation rules
│   │   │   ├── notifications/    # Notification settings
│   │   │   ├── views/            # View customization
│   │   │   ├── workspace/        # Workspace settings
│   │   │   ├── license/          # License management
│   │   │   ├── updates/          # Update settings
│   │   │   └── governance/       # Governance settings
│   │   ├── billing/              # Billing management
│   │   │   └── plan/             # Subscription plans
│   │   ├── profile/              # User profile
│   │   ├── support/              # Support center
│   │   ├── layout.tsx            # Admin layout
│   │   └── styles/               # Admin-specific styles
│   ├── docs/                     # Documentation site
│   │   ├── _components/          # Doc components
│   │   ├── home/                 # Docs homepage
│   │   ├── getting-started/      # Quick start guides
│   │   ├── guides/               # User guides
│   │   ├── how-to/               # How-to guides
│   │   ├── architecture/         # Architecture docs
│   │   ├── security/             # Security documentation
│   │   ├── deployment/           # Deployment guides
│   │   ├── identity/             # Identity concepts
│   │   ├── integrations/         # Integration guides
│   │   ├── observability/        # Observability docs
│   │   ├── contributing/         # Contribution guides
│   │   ├── admin/                # Admin documentation
│   │   ├── reference/            # API references
│   │   ├── references/           # Additional references
│   │   └── sdk/                  # SDK documentation
│   │       ├── core/             # SDK guides per language
│   │       ├── extensions/       # Extensions docs
│   │       ├── runtime/          # Runtime guides
│   │       └── tools/            # Tools documentation
│   ├── oauth/                    # OAuth flows
│   │   └── authorize/            # Authorization endpoint
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Root page
│
├── components/                   # React components
│   ├── ui/                       # Base UI components
│   ├── dashboard/                # Dashboard components
│   │   └── ui/                   # shadcn/ui components
│   ├── billing/                  # Billing components
│   └── ...                       # Other components
│
├── services/                     # Service layer
├── hook/                         # Custom React hooks
├── context/                      # React Context providers
├── lib/                          # Utility functions
├── config/                       # Configuration
├── styles/                       # Global styles
├── assets/                       # Static assets
├── public/                       # Public assets
└── infra/                        # Docker infrastructure
```

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Browser                            │
│              (Next.js 16 - Port 3001)                        │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App Router                        │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐ │
│  │   Routes     │  │    admin     │  │       docs         │ │
│  │   (auth)     │  │   Dashboard  │  │  Documentation     │ │
│  └──────────────┘  └──────────────┘  └────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                             │
│  ┌─────────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │     services/   │  │    hook/    │  │    context/     │  │
│  │  (API clients)  │  │  (Hooks)    │  │  (Providers)    │  │
│  └─────────────────┘  └─────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Component Layer                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ UI Components│  │  Dashboard  │  │  shadcn/ui Library  │  │
│  │  (Base)     │  │  Components │  │  (50+ components)   │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Communication                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Aether Identity API (Go Server)               │  │
│  │  • Auth Endpoints    • User Management                │  │
│  │  • Token Refresh     • OAuth2/OIDC                    │  │
│  │  • MFA/TOTP          • Organization                   │  │
│  │  • Billing           • Security                       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Authentication Flow

**Login Flow:**

1. User accesses `/login`
2. Credentials submitted to API
3. API validates and returns JWT tokens
4. Context providers store tokens
5. Redirect based on role (admin → `/admin`, user → `/home`)

**Protected Route Access:**

1. Route checks authentication context
2. Valid token → Grant access
3. Invalid/missing → Redirect to `/login`
4. Post-login → Return to original route

**Token Refresh:**

1. Access token expires
2. Automatic refresh with refresh token
3. New tokens issued
4. Session continues seamlessly

### Context Architecture

**Authentication Context**

- **Purpose**: Global authentication state management
- **Provides**: User state, authentication status, login/logout methods
- **Features**: Automatic token refresh, protected route guards

**Theme Context**

- **Purpose**: Theme management (light/dark/system)
- **Persistence**: localStorage
- **Provides**: Theme state, toggle methods

### Service Layer Architecture

```
services/
├── API clients for external services
├── Business logic abstraction
└── Data transformation layer

hook/
├── Custom React hooks
├── Reusable logic extraction
└── Data fetching hooks
```

### Logging Architecture

```
LogLayer + Pino Transport
├── Console Output (pino-pretty, level: info)
├── File: app.log (level: warn)
└── File: error.log (level: error)

Specialized Loggers:
├── appLogger      # Application logs
├── authLogger     # Authentication events
├── apiLogger      # API communication
└── monitorLogger  # Monitoring & metrics
```

---

## Development

### Development Workflow

```bash
# Start development
pnpm dev              # Port 3001
pnpm dev:local        # Local environment
pnpm dev:debug        # Debug logging

# Code quality
pnpm lint             # ESLint
pnpm typecheck        # TypeScript check

# Build
pnpm build            # Production build
pnpm clean            # Clean artifacts
```

### Project Conventions

- **TypeScript**: Strict mode enabled, no implicit any
- **Components**: PascalCase for components, kebab-case for files
- **Hooks**: Prefix with `use` (e.g., `useAuth()`)
- **Contexts**: Suffix with `Context` and `Provider`
- **Imports**: Use `@/*` path aliases
- **Styling**: Tailwind CSS with `cn()` utility
- **Forms**: React Hook Form + Zod validation
- **Services**: Business logic in `services/` directory
- **Hooks**: Reusable logic in `hook/` directory

### Adding Components

```bash
# Add shadcn/ui component
npx shadcn@latest add <component-name>

# Components are added to components/dashboard/ui/
```

### Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080

# Authentication
JWT_SECRET=your-jwt-secret
REFRESH_TOKEN_SECRET=your-refresh-secret

# Theme
NEXT_PUBLIC_DEFAULT_THEME=system

# Logging
LOG_LEVEL=debug
```

---

## Routes Reference

### Authentication Routes

| Route                 | Description               | Access        |
| --------------------- | ------------------------- | ------------- |
| `/login`              | Main login page           | Public        |
| `/login/options`      | Alternative login methods | Public        |
| `/login/github`       | GitHub OAuth              | Public        |
| `/login/organization` | Organization selection    | Public        |
| `/login/pin-method`   | PIN authentication        | Public        |
| `/register`           | User registration         | Public        |
| `/register/confirmed` | Registration confirmation | Public        |
| `/forgot`             | Password recovery         | Public        |
| `/forgot/confirmed`   | Password reset confirmed  | Public        |
| `/totp`               | TOTP setup/verify         | Authenticated |
| `/totp/register`      | TOTP registration         | Authenticated |
| `/totp/confirmed`     | TOTP confirmation         | Authenticated |

### Admin Routes

| Section      | Base Route              | Subsections                                                                                                           |
| ------------ | ----------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Dashboard    | `/admin/home`           | Overview                                                                                                              |
| Platform     | `/admin/platform/*`     | identity, system, policy, token, key, cache, certificates, domains, encryption, events, logs, protocols, regions, sso |
| Organization | `/admin/organization/*` | structure, people, rbac, policies, trust, groups, lifecycle, provisioning, profiles, sessions, logs                   |
| Operations   | `/admin/operations/*`   | services, observability, environments, deployments, database, backups, capacity, costs, dr, iac, logs, tasks          |
| Integrations | `/admin/integrations/*` | directory, email, external, providers, provisioning, scim, services, webhooks, logs                                   |
| Security     | `/admin/security/*`     | secrets, audit, identity, compliance, conditional, dlp, mfa, pam, passwords, threats, logs                            |
| Reports      | `/admin/report/*`       | access, compliance, cross_authority, dormant, privilege, behavior, logs                                               |
| Settings     | `/admin/settings/*`     | naming, context, data, automation, notifications, views, workspace, license, updates, governance                      |
| Billing      | `/admin/billing/*`      | plan                                                                                                                  |
| Profile      | `/admin/profile`        | User profile                                                                                                          |
| Support      | `/admin/support`        | Support center                                                                                                        |

### Documentation Routes

| Route                     | Description                 |
| ------------------------- | --------------------------- |
| `/docs`                   | Documentation homepage      |
| `/docs/getting-started/*` | Quick start guides          |
| `/docs/guides/*`          | User guides                 |
| `/docs/how-to/*`          | How-to guides               |
| `/docs/architecture/*`    | Architecture documentation  |
| `/docs/security/*`        | Security documentation      |
| `/docs/deployment/*`      | Deployment guides           |
| `/docs/identity/*`        | Identity concepts           |
| `/docs/integrations/*`    | Integration guides          |
| `/docs/observability/*`   | Observability documentation |
| `/docs/sdk/core/*`        | SDK guides per language     |
| `/docs/sdk/extensions/*`  | Extensions documentation    |
| `/docs/sdk/runtime/*`     | Runtime deployment guides   |
| `/docs/sdk/tools/*`       | Tools and CLI documentation |
| `/docs/admin/*`           | Admin documentation         |
| `/docs/reference/*`       | API references              |
| `/docs/references/*`      | Additional references       |

---

## Security

### Implemented Measures

- **JWT Tokens** - Short-lived access tokens with refresh mechanism
- **Protected Routes** - Automatic authentication checks
- **CSRF Protection** - Next.js built-in protection
- **XSS Prevention** - React automatic escaping
- **Secure Headers** - X-Frame-Options, X-Content-Type-Options
- **HTTPS** - Enforced in production
- **MFA/TOTP** - Multi-factor authentication support
- **Audit Logging** - Comprehensive security event logging
- **DLP** - Data loss prevention capabilities
- **Threat Detection** - Security threat monitoring

### Best Practices

- Tokens stored in memory (not localStorage for sensitive data)
- Automatic token rotation on refresh
- Secure session timeout handling
- Role-based access control (RBAC)
- Organization-based multi-tenancy
- Password policy enforcement
- Privileged access management (PAM)

---

## Contributing

### Getting Started

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Areas

- **Frontend Development** - React components, hooks, state management
- **UI/UX Design** - Component design, accessibility improvements
- **Documentation** - SDK guides, API documentation
- **Testing** - Unit tests, integration tests
- **Performance** - Optimization, lazy loading
- **Security** - Security enhancements, audit improvements

### Code Standards

- Follow TypeScript strict mode
- Use existing components from shadcn/ui
- Maintain consistent code style (ESLint)
- Write clear commit messages
- Add documentation for complex features
- Follow existing folder structure conventions

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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

## Acknowledgments

- **Sky Genesis Enterprise** - Project leadership
- **Next.js Team** - React framework
- **shadcn/ui** - Component library
- **Tailwind CSS Team** - CSS framework
- **Radix UI Team** - Accessible primitives
- **Open Source Community** - Tools and libraries

---

<div align="center">

### 🚀 **Join Us in Building the Evolved Future of Identity Infrastructure!**

[⭐ Star This Repo](https://github.com/skygenesisenterprise/aether-identity) • [🐛 Report Issues](https://github.com/skygenesisenterprise/aether-identity/issues) • [💡 Start a Discussion](https://github.com/skygenesisenterprise/aether-identity/discussions)

---

**🔧 Rapid Evolution - Complete Package Ecosystem with GitHub Marketplace Integration!**

**Made with ❤️ by the [Sky Genesis Enterprise](https://skygenesisenterprise.com) team**

_Building an evolved identity server with complete authentication, package ecosystem, and GitHub integration_

</div>
