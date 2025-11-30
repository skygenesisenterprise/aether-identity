# Aether Identity

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Prisma Version](https://img.shields.io/badge/Prisma-5.22.0-blue.svg)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

Aether Identity is a comprehensive enterprise identity and access management (IAM) platform built with modern web technologies. It provides secure authentication, authorization, and user management capabilities for modern applications.

## ✨ Features

### 🔐 Authentication & Security
- **Multi-Factor Authentication (MFA)**: TOTP, SMS, Email, and Backup Codes
- **JWT-based Authentication**: Secure token-based authentication
- **Password Security**: Strong hashing with bcryptjs
- **Session Management**: Secure session handling with refresh tokens
- **Rate Limiting**: Protection against brute force attacks

### 👥 User & Access Management
- **Role-Based Access Control (RBAC)**: Granular permission system
- **Organization Management**: Multi-tenant support
- **User Profiles**: Comprehensive user information management
- **Audit Logging**: Complete audit trail for compliance
- **API Token Management**: Secure API access tokens

### 🌐 Single Sign-On (SSO)
- **OAuth 2.0 / OpenID Connect**: Standard SSO protocols
- **Client Application Management**: Manage external applications
- **Dynamic Redirect URLs**: Flexible redirect handling
- **Consent Management**: User consent tracking

### 📊 Monitoring & Compliance
- **Webhook System**: Real-time event notifications
- **Health Monitoring**: System health checks
- **Compliance Ready**: Built with privacy and security in mind
- **Audit Trails**: Complete activity logging

### 🛠️ Developer Experience
- **RESTful API**: Well-documented API endpoints
- **Swagger Documentation**: Interactive API documentation
- **TypeScript**: Full type safety
- **Docker Support**: Containerized deployment
- **Dynamic Database**: Support for SQLite and PostgreSQL

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 or higher
- pnpm package manager
- Docker (optional, for containerized deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/aether-identity.git
   cd aether-identity
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Setup database**
   ```bash
   # For development (SQLite)
   npm run db:setup
   
   # For production (PostgreSQL)
   DATABASE_PROVIDER=postgresql npm run db:setup
   ```

5. **Start the application**
   ```bash
   # Development
   pnpm dev
   
   # Production
   pnpm build
   pnpm start
   ```

## 🐳 Docker Deployment

### Development
```bash
# SQLite development
./deploy.sh development deploy

# PostgreSQL development
DATABASE_PROVIDER=postgresql ./deploy.sh development deploy
```

### Production
```bash
# PostgreSQL production
./deploy.sh production deploy
```

## 📚 Documentation

- [API Documentation](/swagger) - Interactive API documentation
- [Database Setup](docs/DYNAMIC_DATABASE.md) - Dynamic database configuration
- [Deployment Guide](docs/DEPLOYMENT.md) - Complete deployment instructions
- [Security Policy](/SECURITY.md) - Security information and reporting

## 🔧 Configuration

### Environment Variables

#### Core Configuration
```bash
NODE_ENV=development
DATABASE_PROVIDER=sqlite
DATABASE_URL="file:./api/prisma/dev.db"
PORT=8080
```

#### Security
```bash
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
API_CORS_ORIGINS=http://localhost:3000
```

#### Database (PostgreSQL)
```bash
DATABASE_PROVIDER=postgresql
DATABASE_URL="postgresql://user:password@localhost:5432/aether_identity"
```

### Database Management

```bash
# Generate Prisma client
npm run db:generate

# Create and apply migrations
npm run db:migrate

# Push schema to database
npm run db:push

# Open Prisma Studio
npm run db:studio

# Reset database (development only)
npm run db:reset
```

## 🏗️ Architecture

### Frontend (Next.js)
- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: React Context
- **Type Safety**: Full TypeScript support

### Backend (Express.js)
- **Framework**: Express.js with TypeScript
- **Database**: Prisma ORM with SQLite/PostgreSQL
- **Authentication**: JWT with refresh tokens
- **Security**: Helmet, CORS, Rate Limiting
- **Documentation**: Swagger/OpenAPI

### Database
- **Development**: SQLite for fast iteration
- **Production**: PostgreSQL for scalability
- **Migrations**: Prisma migration system
- **Seeding**: Automated seed data management

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Security**: Secure token generation and validation
- **Rate Limiting**: Express-rate-limit for API protection
- **CORS Protection**: Configurable CORS policies
- **Input Validation**: Express-validator for request validation
- **Security Headers**: Helmet.js for security headers
- **Audit Logging**: Complete activity tracking
- **MFA Support**: Multiple authentication factors

## 📊 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/mfa/setup` - Setup MFA
- `POST /api/v1/auth/mfa/verify` - Verify MFA

### User Management
- `GET /api/v1/users` - List users
- `POST /api/v1/users` - Create user
- `GET /api/v1/users/:id` - Get user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Organizations
- `GET /api/v1/organizations` - List organizations
- `POST /api/v1/organizations` - Create organization
- `GET /api/v1/organizations/:id` - Get organization
- `PUT /api/v1/organizations/:id` - Update organization

### API Tokens
- `GET /api/v1/tokens` - List API tokens
- `POST /api/v1/tokens` - Create API token
- `DELETE /api/v1/tokens/:id` - Revoke API token

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📈 Monitoring

### Health Checks
- Application health: `GET /health`
- Database health: Included in health endpoint
- System metrics: Available via health endpoint

### Logging
- Structured logging with Morgan
- Configurable log levels
- File-based logging for production
- Audit trail for security events

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Write meaningful commit messages
- Add documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/your-org/aether-identity/issues)
- **Security**: [security@aether-identity.com](mailto:security@aether-identity.com)
- **General**: [support@aether-identity.com](mailto:support@aether-identity.com)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Express.js](https://expressjs.com/) - Web framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - UI components
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) - Password hashing

---

**Aether Identity** - Secure Identity Management for Modern Applications 🚀