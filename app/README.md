<div align="center">

# 🚀 Aether Identity - Frontend Application

[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE) [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/) [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/) [![React](https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react)](https://react.dev/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-black?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

**🔥 Modern Identity Management Frontend - Next.js 16 + React 19.2 with shadcn/ui**

A modern, enterprise-ready identity management frontend application built with **Next.js 16**, **React 19.2**, and **TypeScript 5**. Part of the Aether Identity ecosystem featuring complete authentication flows, OAuth2/OIDC support, and multi-factor authentication.

[🚀 Quick Start](#-quick-start) • [📋 Features](#-features) • [🛠️ Tech Stack](#️-tech-stack) • [📁 Architecture](#-architecture) • [💻 Development](#-development) • [🤝 Contributing](#-contributing)

[![GitHub stars](https://img.shields.io/github/stars/skygenesisenterprise/aether-identity?style=social)](https://github.com/skygenesisenterprise/aether-identity/stargazers) [![GitHub forks](https://img.shields.io/github/forks/skygenesisenterprise/aether-identity?style=social)](https://github.com/skygenesisenterprise/aether-identity/network) [![GitHub issues](https://img.shields.io/github/issues/github/skygenesisenterprise/aether-identity)](https://github.com/skygenesisenterprise/aether-identity/issues)

</div>

---

## 🌟 What is Aether Identity Frontend?

**Aether Identity Frontend** is a comprehensive, modern identity management interface that provides secure account management, multi-factor authentication, and enterprise-grade authentication flows. Built with the latest web technologies, it offers a seamless user experience while maintaining the highest security standards.

### 🎯 Key Features

- **🔐 Complete Authentication System** - Login, registration, password recovery, and session management
- **🔑 Multi-Factor Authentication** - TOTP support with WebAuthn-ready architecture
- **🔗 OAuth2/OIDC Support** - Enterprise identity provider integration
- **🎨 Modern UI/UX** - Next.js 16 + React 19.2 with shadcn/ui component library
- **🌙 Dark Mode Support** - System-aware theme switching with localStorage persistence
- **📱 Responsive Design** - Mobile-first approach for all screen sizes
- **🔒 Security-First** - Protected routes, JWT token management, and secure session handling
- **📝 TypeScript Strict Mode** - Full type safety across the entire codebase

---

## 🚀 Quick Start

### 📋 Prerequisites

- **Node.js** 18.0.0 or higher
- **pnpm** 9.0.0 or higher (recommended package manager)
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

Once running, you can access:

- **Frontend Application**: [http://localhost:3001](http://localhost:3001)
- **Login Page**: [http://localhost:3001/login](http://localhost:3001/login)
- **Registration**: [http://localhost:3001/register](http://localhost:3001/register)
- **Password Recovery**: [http://localhost:3001/forgot](http://localhost:3001/forgot)
- **TOTP Setup**: [http://localhost:3001/totp](http://localhost:3001/totp)
- **OAuth Authorization**: [http://localhost:3001/oauth/authorize](http://localhost:3001/oauth/authorize)

### 🎯 **Available Commands**

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

> 💡 **Tip**: Run `pnpm run` to see all available scripts in package.json

---

## 📋 Features

### 🔐 Authentication & Security

- **JWT Token Management** - Secure token-based authentication with refresh mechanism
- **Login/Registration Forms** - Complete user authentication flow with validation
- **Password Recovery** - Secure password reset flow with email verification
- **Multi-Factor Authentication** - TOTP (Time-based One-Time Password) support
- **OAuth2 Authorization** - Complete OAuth2/OIDC authorization flow
- **Session Management** - LocalStorage-based session persistence with automatic refresh
- **Protected Routes** - Route-based authentication guards and redirects
- **Theme Persistence** - Dark/light mode with system preference detection

### 🎨 User Interface

- **Modern Component Library** - shadcn/ui components with Tailwind CSS v4
- **Responsive Design** - Mobile-first approach for all devices
- **Dark Mode Support** - System-aware theme switching
- **Accessible Components** - WCAG 2.1 compliant UI elements
- **Animated Transitions** - Smooth page transitions and interactions

### 🔧 Developer Experience

- **TypeScript Strict Mode** - Full type safety across the codebase
- **Hot Reload** - Instant updates during development
- **ESLint + Prettier** - Consistent code formatting and quality
- **Component Structure** - Organized architecture following best practices
- **Context-Based State** - React Context for global state management

---

## 🛠️ Tech Stack

### 🎨 **Frontend Framework**

```
Next.js 16 + React 19.2.4 + TypeScript 5
├── 🎨 Tailwind CSS v4 (Styling)
├── 🎯 shadcn/ui (Component Library)
├── 🔐 JWT Authentication (Token Management)
├── 🛣️ Next.js App Router (Routing)
├── 📝 TypeScript Strict Mode (Type Safety)
├── 🔄 React Context (State Management)
├── 📦 Lucide React (Icons)
├── 🎯 Tw Animate CSS (Animations)
└── 🔧 ESLint + Prettier (Code Quality)
```

### 📦 **Core Dependencies**

```
Production Dependencies:
├── @loglayer/transport-pino     # Structured logging transport
├── @prisma/client              # Database client
├── @radix-ui/react-slot        # Accessible component primitives
├── class-variance-authority    # CSS class variants
├── clsx                        # Conditional class names
├── loglayer                    # Modern logging library
├── lucide-react               # Beautiful icons
├── next                       # React framework
├── pino                       # Fast JSON logger
├── react                      # UI library
├── react-dom                  # React DOM renderer
├── tailwind-merge             # Tailwind CSS utility merging
└── tw-animate-css            # CSS animations

Development Dependencies:
├── @capacitor/core            # Cross-platform framework
├── @tailwindcss/postcss       # Tailwind CSS PostCSS plugin
├── @types/node                # Node.js type definitions
├── @types/react               # React type definitions
├── @types/react-dom           # React DOM type definitions
├── eslint                     # Code linting
├── eslint-config-next         # Next.js ESLint config
├── prisma                     # Database ORM
├── tailwindcss                # Utility-first CSS
└── typescript                 # JavaScript superset
```

### 🏗️ **Project Structure**

```
app/
├── app/                       # Next.js App Router pages
│   ├── login/                # Login page with loading states
│   │   ├── loading.tsx       # Loading skeleton
│   │   └── page.tsx          # Login page component
│   ├── register/             # User registration page
│   ├── forgot/               # Password recovery page
│   ├── totp/                 # TOTP setup page
│   ├── oauth/                # OAuth authorization flow
│   │   └── authorize/        # Authorization endpoint
│   ├── layout.tsx            # Root layout with providers
│   └── page.tsx              # Home/dashboard page
├── components/               # React components
│   ├── ui/                   # shadcn/ui component library
│   │   ├── alert.tsx         # Alert component
│   │   ├── badge.tsx         # Badge component
│   │   ├── button.tsx        # Button component
│   │   ├── card.tsx          # Card container
│   │   ├── input.tsx         # Input field
│   │   └── label.tsx         # Form label
│   ├── login-form.tsx        # Login form component
│   └── DashboardLayout.tsx   # Dashboard layout wrapper
├── context/                  # React Context providers
│   ├── AuthContext.tsx       # Authentication state management
│   └── JwtAuthContext.tsx    # JWT token context (theme)
├── lib/                      # Utility functions
│   ├── utils.ts              # Common utilities (cn helper)
│   ├── navigation-config.tsx # Navigation configuration
│   └── logger.ts             # Logging utilities
├── config/                   # Configuration files
│   └── navigation.ts         # Navigation setup
├── styles/                   # Global styles
│   └── globals.css           # Tailwind CSS imports
├── public/                   # Static assets
│   ├── .well-known/          # Security.txt, browserconfig
│   ├── manifest.json         # PWA manifest
│   ├── robots.txt           # SEO robots
│   └── sitemap.xml          # SEO sitemap
├── .env.example             # Environment template
├── .dockerignore            # Docker ignore rules
├── components.json           # shadcn/ui config
├── eslint.config.mjs         # ESLint configuration
├── Makefile                  # Make commands
├── next.config.mjs          # Next.js configuration
├── next.config.ts           # Next.js TypeScript config
├── postcss.config.mjs       # PostCSS configuration
├── tailwind.config.js       # Tailwind CSS config
├── tsconfig.json            # TypeScript config
├── tsconfig.build.json      # TypeScript build config
└── start-dev.sh             # Development startup script
```

---

## 📁 Architecture

### 🔄 **Data Flow Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    Aether Identity Frontend                  │
│                     (Next.js 16 - Port 3001)                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    React Context Layer                       │
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │  AuthContext    │    │   JwtAuthContext (Theme)        │ │
│  │  (JWT Tokens)   │    │   (Theme Management)            │ │
│  └─────────────────┘    └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Component Layer                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Login Form  │  │ Dashboard   │  │  shadcn/ui          │ │
│  │ (Auth Flow) │  │  Layout     │  │  Components         │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Communication                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Backend API (Go Server - Port 8080)           │  │
│  │  • Authentication Endpoints    • User Management      │  │
│  │  • Token Refresh               • OAuth Flows          │  │
│  │  • Password Recovery           • TOTP Setup           │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Database (PostgreSQL - Port 5432)          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  • Users              • Sessions        • TOTP        │  │
│  │  • OAuth Clients      • Refresh Tokens  • Audit Logs  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 🔐 **Authentication Flow**

```
User Action                    Flow
───────────────────────────────────────────────────────────────
Login Request
  1. User submits credentials
  2. POST /api/auth/login
  3. Server validates credentials
  4. Returns JWT access + refresh tokens
  5. AuthContext stores tokens
  6. Redirect to dashboard

Token Refresh
  1. Access token expires
  2. AuthContext detects expiration
  3. POST /api/auth/refresh
  4. Server validates refresh token
  5. Returns new access token
  6. User session continues

Protected Route Access
  1. User navigates to protected route
  2. AuthContext checks token validity
  3. If valid → Grant access
  4. If invalid → Redirect to login
  5. After login → Redirect back to original route

Logout
  1. User clicks logout
  2. POST /api/auth/logout
  3. Server revokes tokens
  4. AuthContext clears local storage
  5. Redirect to login page
```

---

## 💻 Development

### 🎯 **Development Workflow**

```bash
# Start development server
pnpm dev

# Run with local environment
pnpm dev:local

# Run with debug logging
pnpm dev:debug

# Check code quality
pnpm lint
pnpm lint:fix
pnpm typecheck

# Build for production
pnpm build

# Clean build artifacts
pnpm clean
```

### 📋 **Development Guidelines**

- **TypeScript Strict Mode** - All code must pass strict type checking
- **Component Structure** - Follow established patterns for React components
- **Context Usage** - Use React Context for global state (auth, theme)
- **Tailwind CSS** - Use utility classes for styling
- **shadcn/ui** - Extend existing components rather than creating new ones
- **Code Formatting** - Run ESLint and Prettier before committing
- **Testing** - Add tests for new components and utilities
- **Documentation** - Document complex logic and component APIs

### 🔧 **Available Make Commands**

```bash
# Development
make dev              # Start development server
make dev:local        # Local environment development
make dev:debug        # Debug mode development

# Code Quality
make lint             # Run ESLint
make lint-fix         # Auto-fix linting issues
make typecheck        # TypeScript type checking

# Building
make build            # Production build
make clean            # Clean build artifacts

# Utility
make help             # Show all available commands
```

### 📦 **Managing Dependencies**

```bash
# Add a new dependency
pnpm add <package-name>

# Add a development dependency
pnpm add -D <package-name>

# Remove a dependency
pnpm remove <package-name>

# Update dependencies
pnpm update

# Install all dependencies
pnpm install
```

### 🎨 **Adding New Components**

The app uses shadcn/ui for component library. To add a new component:

```bash
# Generate a new component
npx shadcn@latest add <component-name>

# Or manually create in components/ui/
```

### 🔐 **Environment Variables**

Create a `.env.local` file in the `app/` directory:

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

## 📁 Pages & Routes

### Authentication Pages

| Route            | Description                 | Status      |
| ---------------- | --------------------------- | ----------- |
| `/login`         | User login page             | ✅ Complete |
| `/login/options` | Alternative login options   | ✅ Complete |
| `/register`      | User registration           | ✅ Complete |
| `/forgot`        | Password recovery           | ✅ Complete |
| `/totp`          | TOTP setup and verification | ✅ Complete |

### OAuth Pages

| Route              | Description                   | Status      |
| ------------------ | ----------------------------- | ----------- |
| `/oauth/authorize` | OAuth2 authorization endpoint | ✅ Complete |

### Dashboard Pages

| Route | Description    | Status      |
| ----- | -------------- | ----------- |
| `/`   | Main dashboard | ✅ Complete |

---

## 🔐 Security Features

### Implemented Security Measures

- **JWT Token Security** - Secure token storage and automatic refresh
- **Protected Routes** - Route guards prevent unauthorized access
- **Session Timeout** - Automatic logout on session expiration
- **CSRF Protection** - Built-in Next.js protection
- **XSS Prevention** - React's automatic escaping
- **Secure Headers** - Next.js security headers
- **Type Safety** - TypeScript prevents runtime errors

### Security Best Practices

- All authentication tokens stored securely
- Passwords hashed on backend (bcrypt)
- Refresh tokens with expiration
- Automatic token rotation
- Secure session management
- HTTPS in production

---

## 📊 Current Status

| Feature                       | Status         | Technology              | Notes               |
| ----------------------------- | -------------- | ----------------------- | ------------------- |
| **Frontend Framework**        | ✅ Working     | Next.js 16 + React 19.2 | Modern app router   |
| **Authentication System**     | ✅ Working     | JWT + React Context     | Complete flow       |
| **Login/Register Forms**      | ✅ Working     | React + shadcn/ui       | French localization |
| **Password Recovery**         | ✅ Working     | Next.js + API           | Email-based         |
| **Multi-Factor Auth**         | ✅ Working     | TOTP                    | WebAuthn ready      |
| **OAuth2/OIDC**               | ✅ Working     | Next.js                 | Authorization flow  |
| **Dark Mode**                 | ✅ Working     | Tailwind CSS            | System-aware        |
| **UI Components**             | ✅ Working     | shadcn/ui               | Full component set  |
| **TypeScript**                | ✅ Working     | Strict Mode             | Full type safety    |
| **Code Quality**              | ✅ Working     | ESLint + Prettier       | Auto-formatted      |
| **User Management Dashboard** | 🔄 In Progress | Next.js                 | In development      |
| **Audit Logging UI**          | 📋 Planned     | Next.js                 | Future feature      |
| **Testing Suite**             | 📋 Planned     | Jest + React Testing    | Future feature      |

---

## 🤝 Contributing

We welcome contributions to the Aether Identity frontend! Whether you're experienced with React, TypeScript, Next.js, or UI/UX design, there's a place for you.

### 🎯 **How to Get Started**

1. **Fork the repository** and create a feature branch
2. **Check the issues** for tasks that need help
3. **Join discussions** about architecture and features
4. **Start small** - Documentation, tests, or minor features
5. **Follow our code standards** and commit guidelines

### 🏗️ **Areas Needing Help**

- **React Development** - Components, hooks, and state management
- **TypeScript** - Type definitions and strict mode improvements
- **UI/UX Design** - Component design and user experience
- **Testing** - Unit tests and integration tests
- **Documentation** - API docs and user guides
- **Accessibility** - WCAG 2.1 compliance improvements
- **Performance** - Optimization and lazy loading
- **Security** - Security audits and improvements

### 📝 **Contribution Process**

1. **Choose an area** - Components, pages, or utilities
2. **Read the guidelines** - Understand our coding standards
3. **Create a branch** with a descriptive name
4. **Implement your changes** following our guidelines
5. **Test thoroughly** in all environments
6. **Submit a pull request** with clear description
7. **Address feedback** from maintainers

---

## 📞 Support & Community

### 💬 **Get Help**

- 📖 **[Documentation](docs/)** - Comprehensive guides and API docs
- 🐛 **[GitHub Issues](https://github.com/skygenesisenterprise/aether-identity/issues)** - Bug reports and feature requests
- 💡 **[GitHub Discussions](https://github.com/skygenesisenterprise/aether-identity/discussions)** - General questions and ideas
- 📧 **Email** - support@skygenesisenterprise.com

### 🐛 **Reporting Issues**

When reporting bugs, please include:

- Clear description of the problem
- Steps to reproduce
- Environment information (Node.js version, OS, browser, etc.)
- Error logs or screenshots
- Expected vs actual behavior
- Component-specific information (if applicable)

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
- **Next.js Team** - Excellent React framework
- **React Team** - Modern UI library
- **shadcn/ui** - Beautiful component library
- **Tailwind CSS Team** - Utility-first CSS framework
- **Vercel** - Next.js hosting and development
- **TypeScript Team** - Type safety for JavaScript
- **pnpm** - Fast, disk space efficient package manager
- **Open Source Community** - Tools, libraries, and inspiration

---

<div align="center">

### 🚀 **Join Us in Building the Future of Identity Management!**

[⭐ Star This Repo](https://github.com/skygenesisenterprise/aether-identity) • [🐛 Report Issues](https://github.com/skygenesisenterprise/aether-identity/issues) • [💡 Start a Discussion](https://github.com/skygenesisenterprise/aether-identity/discussions)

---

**🔐 Secure, Modern, Enterprise-Ready Identity Management**

**Made with ❤️ by the [Sky Genesis Enterprise](https://skygenesisenterprise.com) team**

_Building a modern identity server with complete authentication, OAuth2/OIDC support, and enterprise-grade security_

</div>
