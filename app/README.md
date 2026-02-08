<div align="center">

# 🚀 Aether Identity - Frontend Application

[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE) [![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/) [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/) [![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-black?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

**🔥 Enterprise Identity Management Platform - Next.js 16 + React 19 with shadcn/ui**

A modern, enterprise-ready identity management platform built with **Next.js 16**, **React 19**, and **TypeScript 5.7**. Features complete authentication flows, OAuth2/OIDC support, comprehensive admin dashboard, and integrated documentation.

[🚀 Quick Start](#-quick-start) • [📋 Features](#-features) • [🛠️ Tech Stack](#️-tech-stack) • [📁 Architecture](#-architecture) • [💻 Development](#-development) • [🤝 Contributing](#-contributing)

</div>

---

## 🌟 Overview

**Aether Identity Frontend** is an enterprise-grade identity management platform providing secure authentication, comprehensive administration tools, and multi-tenant organization management. Built with cutting-edge web technologies, it delivers a seamless experience for both end-users and administrators.

### 🎯 Key Features

- **🔐 Complete Authentication System** - Login, registration, password recovery, TOTP MFA, and social authentication
- **🛡️ Enterprise Admin Dashboard** - 8 major sections with 41+ administrative pages
- **📚 Integrated Documentation** - Complete SDK documentation for 12 programming languages
- **🔗 OAuth2/OIDC Support** - Full authorization server capabilities
- **🎨 Modern UI/UX** - shadcn/ui component library with Tailwind CSS v4
- **🌙 Dark Mode Support** - System-aware theme switching with persistence
- **📱 Responsive Design** - Mobile-first approach with adaptive layouts
- **🔒 Security-First** - Protected routes, JWT management, enterprise-grade security
- **📝 TypeScript Strict** - Full type safety across the entire codebase

---

## 🚀 Quick Start

### 📋 Prerequisites

- **Node.js** 18.0.0 or higher
- **pnpm** 9.0.0 or higher (recommended)
- **Git** for version control

### 🔧 Installation & Setup

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

### 🌐 Access Points

| Endpoint            | URL                                   | Description            |
| ------------------- | ------------------------------------- | ---------------------- |
| **Frontend**        | http://localhost:3001                 | Main application       |
| **Login**           | http://localhost:3001/login           | Authentication page    |
| **Register**        | http://localhost:3001/register        | User registration      |
| **Forgot Password** | http://localhost:3001/forgot          | Password recovery      |
| **TOTP Setup**      | http://localhost:3001/totp            | MFA configuration      |
| **Admin Dashboard** | http://localhost:3001/admin           | Administration console |
| **Documentation**   | http://localhost:3001/docs            | SDK documentation      |
| **OAuth Auth**      | http://localhost:3001/oauth/authorize | OAuth2 authorization   |

### 🎯 Available Commands

```bash
# 🚀 Development
pnpm dev              # Start development server (port 3001)
pnpm dev:local        # Start with local environment
pnpm dev:debug        # Start with debug mode enabled

# 🏗️ Building
pnpm build            # Build for production
pnpm start            # Start production server

# 🔧 Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Auto-fix linting issues
pnpm typecheck        # TypeScript type checking

# 🧹 Maintenance
pnpm clean            # Clean build artifacts
```

---

## 📋 Features

### 🔐 Authentication & Security

- **JWT Token Management** - Secure authentication with automatic refresh
- **Multi-Factor Authentication** - TOTP support with QR code setup
- **Social Authentication** - GitHub OAuth integration
- **Organization-based Auth** - Multi-tenant login with organization selection
- **Protected Routes** - Automatic redirection and access control
- **Session Management** - Persistent sessions with secure storage
- **PIN Method Support** - Alternative authentication methods

### 🛡️ Admin Dashboard

Comprehensive administration interface with 8 major sections:

| Section          | Description                                                        | Pages |
| ---------------- | ------------------------------------------------------------------ | ----- |
| **Home**         | Dashboard overview and metrics                                     | 1     |
| **Platform**     | Identity, system, policy, token, key management                    | 5     |
| **Organization** | Structure, people, RBAC, policies, trust                           | 5     |
| **Operations**   | Services, observability, environments, deployments, database       | 5     |
| **Integrations** | External systems, providers, provisioning, webhooks                | 4     |
| **Security**     | Secrets, audit logs, identity security, compliance                 | 4     |
| **Reports**      | Access, compliance, cross-authority, dormant accounts, privilege   | 5     |
| **Settings**     | Naming, context, data, automation, notifications, views, workspace | 7     |

### 📚 Documentation Platform

Integrated documentation site with comprehensive SDK guides:

- **12 Programming Languages** - Dart, .NET, Elixir, Go, Java, Kotlin, Node.js, PHP, Python, Rust, Scala, Swift
- **Getting Started Guides** - Installation, configuration, first steps
- **Core SDK Documentation** - Client/server implementation, RBAC, tokens
- **Extensions & Tools** - CLI, GitHub Actions, VSCode extension
- **Runtime Guides** - Docker, Kubernetes, Snap deployment

### 🎨 User Interface

- **50+ shadcn/ui Components** - Complete design system
- **Responsive Dashboard** - Adaptive layouts for all screen sizes
- **Dark/Light Themes** - System preference detection
- **Animated Transitions** - Smooth page transitions with Framer Motion
- **Data Visualization** - Charts and metrics with Recharts
- **Accessible Design** - WCAG 2.1 compliant components

### 🔧 Developer Experience

- **TypeScript 5.7 Strict Mode** - Full type safety
- **Hot Module Replacement** - Instant updates during development
- **ESLint + Prettier** - Consistent code quality
- **Structured Logging** - Pino-based logging with multiple transports
- **Path Aliases** - Clean imports with `@/*` aliases

---

## 🛠️ Tech Stack

### Core Framework

| Technology       | Version | Purpose                         |
| ---------------- | ------- | ------------------------------- |
| **Next.js**      | 16.1.6  | React framework with App Router |
| **React**        | 19.x    | UI library                      |
| **TypeScript**   | 5.7.3   | Type-safe development           |
| **Tailwind CSS** | 4.1.18  | Utility-first styling           |
| **Radix UI**     | 1.x     | Headless accessible primitives  |

### Key Dependencies

```
Production:
├── aether-identity          # Identity SDK client
├── @radix-ui/*              # Accessible UI primitives
├── @loglayer/transport-pino # Structured logging
├── framer-motion            # Animations
├── lucide-react             # Icons
├── pino                     # JSON logger
├── recharts                 # Charts
├── zod                      # Schema validation
└── react-hook-form          # Form management

Development:
├── @types/*                 # Type definitions
├── eslint                   # Code linting
├── typescript               # TypeScript compiler
└── tailwindcss              # CSS framework
```

---

## 📁 Architecture

### Project Structure

```
app/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes group
│   │   ├── login/                # Login page + sub-routes
│   │   │   ├── connected/        # Post-login redirect
│   │   │   ├── github/           # GitHub OAuth
│   │   │   ├── options/          # Login options
│   │   │   ├── organization/     # Org selection
│   │   │   └── pin-method/       # PIN authentication
│   │   ├── register/             # Registration page
│   │   ├── forgot/               # Password recovery
│   │   └── totp/                 # TOTP setup
│   ├── admin/                    # Admin dashboard
│   │   ├── home/                 # Dashboard overview
│   │   ├── platform/             # Platform management
│   │   ├── organization/         # Organization management
│   │   ├── operations/           # Operations center
│   │   ├── integrations/         # Integrations hub
│   │   ├── security/             # Security center
│   │   ├── report/               # Reports & analytics
│   │   ├── settings/             # System settings
│   │   ├── layout.tsx            # Admin layout (Sidebar + Header)
│   │   └── styles/               # Admin-specific styles
│   ├── docs/                     # Documentation site
│   │   ├── _components/          # Doc components (CodeBlock, Sidebar, Toc)
│   │   ├── sdk/                  # SDK documentation
│   │   │   ├── core/             # SDK guides per language
│   │   │   ├── extensions/       # Extensions docs
│   │   │   ├── runtime/          # Runtime guides
│   │   │   └── tools/            # Tools documentation
│   │   ├── getting-started/      # Quick start guides
│   │   └── home/                 # Docs homepage
│   ├── oauth/                    # OAuth flows
│   │   └── authorize/            # Authorization endpoint
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Root page (redirect)
│
├── components/                   # React components
│   ├── ui/                       # Base UI components (6)
│   │   ├── alert.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── label.tsx
│   ├── dashboard/                # Dashboard components
│   │   ├── activity-feed.tsx     # Activity timeline
│   │   ├── context-header.tsx    # Context selector
│   │   ├── context-overview.tsx  # Context overview
│   │   ├── metric-card.tsx       # Metric display
│   │   ├── quick-actions.tsx     # Action buttons
│   │   ├── security-posture.tsx  # Security status
│   │   └── ui/                   # 50+ shadcn/ui components
│   ├── login-form.tsx            # Login form
│   ├── DashboardLayout.tsx       # Conditional layout wrapper
│   ├── Header.tsx                # Navigation header
│   ├── Footer.tsx                # Page footer
│   └── Sidebar.tsx               # Navigation sidebar
│
├── context/                      # React Context providers
│   ├── AuthContext.tsx           # Authentication state
│   └── JwtAuthContext.tsx        # Theme management
│
├── lib/                          # Utility functions
│   ├── utils.ts                  # Tailwind cn() helper
│   ├── logger.ts                 # Pino logging setup
│   └── navigation-config.ts      # Navigation mode config
│
├── config/                       # Configuration
│   └── navigation.ts             # Navigation redirects
│
├── styles/                       # Global styles
│   └── globals.css               # Tailwind + CSS variables
│
├── public/                       # Static assets
│   ├── icons/                    # Icon assets
│   ├── screenshots/              # UI screenshots
│   └── .well-known/              # Security files
│
├── infra/                        # Docker infrastructure
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── docker-compose.dev.yml
│
└── test/                         # Test project (Next.js)
    ├── app/
    ├── components/
    └── package.json
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
│  │   (auth)     │  │    admin     │  │       docs         │ │
│  │   Routes     │  │   Dashboard  │  │  Documentation     │ │
│  └──────────────┘  └──────────────┘  └────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Context Layer                             │
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │  AuthContext    │    │   JwtAuthContext                │ │
│  │  (User Auth)    │    │   (Theme: light/dark/system)    │ │
│  └─────────────────┘    └─────────────────────────────────┘ │
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
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
Login Flow:
1. User accesses /login
2. Credentials submitted to API
3. API validates and returns JWT tokens
4. AuthContext stores tokens
5. Redirect based on role (admin → /admin, user → /home)

Protected Route Access:
1. Route checks AuthContext
2. Valid token → Grant access
3. Invalid/missing → Redirect to /login
4. Post-login → Return to original route

Token Refresh:
1. Access token expires
2. Automatic refresh with refresh token
3. New tokens issued
4. Session continues seamlessly
```

### Context Architecture

#### AuthContext

- **Purpose**: Global authentication state management
- **Provides**: `user`, `isAuthenticated`, `isLoading`, `login()`, `logout()`, `checkAuth()`
- **Features**: Automatic token refresh, protected route guards
- **Hook**: `useProtectedRoute()` for route protection

#### JwtAuthContext (Theme)

- **Purpose**: Theme management (despite file name)
- **Themes**: `light`, `dark`, `system`
- **Persistence**: localStorage (`aether-mail-theme`)
- **Provides**: `theme`, `resolvedTheme`, `setTheme()`, `toggleTheme()`

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
├── dbLogger       # Database operations
└── monitorLogger  # Monitoring & metrics
```

---

## 💻 Development

### Development Workflow

```bash
# Start development
pnpm dev              # Port 3001
pnpm dev:local        # Local environment
pnpm dev:debug        # Debug logging

# Code quality
pnpm lint             # ESLint
pnpm lint:fix         # Auto-fix
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
- **Styling**: Tailwind CSS with `cn()` utility for conditional classes
- **Forms**: React Hook Form + Zod validation

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

## 📊 Routes Reference

### Authentication Routes

| Route                 | Description               | Access        |
| --------------------- | ------------------------- | ------------- |
| `/login`              | Main login page           | Public        |
| `/login/options`      | Alternative login methods | Public        |
| `/login/github`       | GitHub OAuth              | Public        |
| `/login/organization` | Organization selection    | Public        |
| `/login/pin-method`   | PIN authentication        | Public        |
| `/register`           | User registration         | Public        |
| `/forgot`             | Password recovery         | Public        |
| `/totp`               | TOTP setup/verify         | Authenticated |

### Admin Routes

| Section      | Base Route              | Pages                                                              |
| ------------ | ----------------------- | ------------------------------------------------------------------ |
| Dashboard    | `/admin/home`           | Overview                                                           |
| Platform     | `/admin/platform/*`     | identity, system, policy, token, key                               |
| Organization | `/admin/organization/*` | structure, people, rbac, policies, trust                           |
| Operations   | `/admin/operations/*`   | services, observability, environments, deployments, database       |
| Integrations | `/admin/integrations/*` | external, providers, provisioning, webhooks                        |
| Security     | `/admin/security/*`     | secrets, audit, identity, compliance                               |
| Reports      | `/admin/report/*`       | access, compliance, cross_authority, dormant, privilege            |
| Settings     | `/admin/settings/*`     | naming, context, data, automation, notifications, views, workspace |

### Documentation Routes

| Route                     | Description                 |
| ------------------------- | --------------------------- |
| `/docs`                   | Documentation homepage      |
| `/docs/getting-started/*` | Quick start guides          |
| `/docs/sdk/core/*`        | SDK guides per language     |
| `/docs/sdk/extensions/*`  | Extensions documentation    |
| `/docs/sdk/runtime/*`     | Runtime deployment guides   |
| `/docs/sdk/tools/*`       | Tools and CLI documentation |

---

## 🔐 Security

### Implemented Measures

- **JWT Tokens** - Short-lived access tokens with refresh mechanism
- **Protected Routes** - Automatic authentication checks
- **CSRF Protection** - Next.js built-in protection
- **XSS Prevention** - React automatic escaping
- **Secure Headers** - X-Frame-Options, X-Content-Type-Options
- **HTTPS** - Enforced in production

### Best Practices

- Tokens stored in memory (not localStorage for sensitive data)
- Automatic token rotation on refresh
- Secure session timeout handling
- Role-based access control (RBAC)
- Organization-based multi-tenancy

---

## 🤝 Contributing

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

### Code Standards

- Follow TypeScript strict mode
- Use existing components from shadcn/ui
- Maintain consistent code style (ESLint + Prettier)
- Write clear commit messages
- Add documentation for complex features

---

## 📄 License

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

## 🙏 Acknowledgments

- **Sky Genesis Enterprise** - Project leadership
- **Next.js Team** - React framework
- **shadcn/ui** - Component library
- **Tailwind CSS Team** - CSS framework
- **Radix UI Team** - Accessible primitives
- **Open Source Community** - Tools and libraries

---

<div align="center">

### 🚀 Building the Future of Identity Management

[⭐ Star](https://github.com/skygenesisenterprise/aether-identity) • [🐛 Issues](https://github.com/skygenesisenterprise/aether-identity/issues) • [💡 Discussions](https://github.com/skygenesisenterprise/aether-identity/discussions)

---

**🔐 Secure. Modern. Enterprise-Ready.**

**Made with ❤️ by [Sky Genesis Enterprise](https://skygenesisenterprise.com)**

</div>
