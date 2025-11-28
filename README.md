
<div align="center">

# Aether Identity

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)

> Enterprise OAuth2/OIDC Identity Provider with Single Sign-On, multi-factor authentication, and secure account management for modern applications and services.

</div>

## 🚀 Overview

Aether Identity is a comprehensive identity and access management (IAM) solution designed for enterprises. It provides secure authentication, authorization, and user management capabilities through industry-standard protocols including OAuth2, OpenID Connect (OIDC), and JWT-based authentication.

### 🎯 Key Features

- **🔐 Enterprise-Grade Authentication**: OAuth2/OIDC compliant with PKCE support
- **🌐 Single Sign-On (SSO)**: Seamless authentication across multiple applications
- **👥 User Management**: Complete user lifecycle management with profiles and roles
- **🏢 Organization Support**: Multi-tenant architecture with organizations and projects
- **🔑 API Token Management**: Service-to-service authentication with scoped API tokens
- **📱 Dynamic Client Applications**: Register and manage OAuth2 clients dynamically
- **🛡️ Security First**: Built-in security headers, rate limiting, and input validation
- **📊 Real-time Monitoring**: Health checks, logging, and performance metrics
- **🐳 Container Ready**: Optimized Docker deployment with multi-stage builds
- **⚡ High Performance**: Next.js 16 with Turbopack and Express.js backend

## 🏗️ Architecture

Aether Identity follows a modern microservices-inspired architecture within a monorepo structure:

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │
│   (Next.js)     │    │   (Express.js)  │
│                 │    │                 │
│ • React UI      │◄──►│ • REST API      │
│ • Auth Pages    │    │ • JWT Tokens    │
│ • Dashboard     │    │ • Prisma ORM    │
│ • Swagger UI    │    │ • Middleware    │
└─────────────────┘    └─────────────────┘
                                │
                       ┌─────────────────┐
                       │   Database      │
                       │   (SQLite)      │
                       │                 │
                       │ • Users         │
                       │ • Organizations │
                       │ • Sessions      │
                       │ • API Tokens    │
                       └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20.0.0 or higher
- pnpm package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/skygenesisenterprise/aether-identity.git
   cd aether-identity
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Initialize the database**
   ```bash
   pnpm db:generate
   pnpm db:push
   ```

5. **Start the development servers**
   ```bash
   # Start both frontend and backend
   pnpm dev
   
   # Or start them separately
   pnpm dev          # Frontend (http://localhost:3000)
   pnpm dev:api      # Backend API (http://localhost:8080)
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - API Documentation: http://localhost:8080/api/v1/docs
   - Health Check: http://localhost:8080/health

## ⚙️ Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Database Configuration
DATABASE_URL="file:./api/prisma/dev.db"

# API Server Configuration
PORT=8080
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# CORS Configuration
API_CORS_ORIGINS=http://localhost:3000,http://localhost:8080

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email Configuration (for password reset, email verification)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com

# Frontend URL for redirects
FRONTEND_URL=http://localhost:3000

# API Documentation
API_DOCS_ENABLED=true

# Logging
LOG_LEVEL=info
LOG_FILE=logs/api.log
```

### Database Setup

Aether Identity uses SQLite with Prisma ORM for development and can be configured for PostgreSQL in production:

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# View and edit database
pnpm db:studio
```

## 📚 API Documentation

### Core Endpoints

#### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/authorize` - OAuth2 authorization endpoint
- `POST /api/v1/auth/token` - OAuth2 token exchange
- `GET /api/v1/auth/userinfo` - Get user information

#### Account Management
- `GET /api/v1/accounts/profile` - Get user profile
- `PUT /api/v1/accounts/profile` - Update user profile
- `GET /api/v1/accounts/sessions` - Get active sessions
- `DELETE /api/v1/accounts/sessions/:id` - Revoke session

#### API Tokens
- `GET /api/v1/api-tokens` - List API tokens
- `POST /api/v1/api-tokens` - Create API token
- `DELETE /api/v1/api-tokens/:id` - Revoke API token

#### Client Applications
- `GET /api/v1/clients` - List OAuth2 clients
- `POST /api/v1/clients` - Register OAuth2 client
- `PUT /api/v1/clients/:id` - Update client
- `DELETE /api/v1/clients/:id` - Delete client

### OAuth2 Flow Example

#### 1. Register Your Application

```bash
curl -X POST http://localhost:8080/api/v1/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "My Application",
    "redirectUris": ["https://myapp.com/callback"],
    "allowedScopes": ["read", "write", "profile"],
    "defaultScopes": ["read", "profile"],
    "skipConsent": false
  }'
```

#### 2. Redirect Users for Authentication

```javascript
const authUrl = new URL('http://localhost:8080/api/v1/auth/authorize');
authUrl.searchParams.set('client_id', 'your_client_id');
authUrl.searchParams.set('redirect_uri', 'https://myapp.com/callback');
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('state', generateRandomState());
authUrl.searchParams.set('scope', 'read profile');

window.location.href = authUrl.toString();
```

#### 3. Exchange Authorization Code for Tokens

```bash
curl -X POST http://localhost:8080/api/v1/auth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "authorization_code",
    "code": "AUTH_CODE_FROM_CALLBACK",
    "client_id": "your_client_id",
    "client_secret": "your_client_secret",
    "redirect_uri": "https://myapp.com/callback"
  }'
```

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Build and start the services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Build

```bash
# Build the image
docker build -t aether-identity .

# Run the container
docker run -d \
  --name aether-identity \
  -p 3000:3000 \
  -p 8080:8080 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/logs:/app/logs \
  -e NODE_ENV=production \
  -e JWT_SECRET=your-production-secret \
  aether-identity
```

### Production Deployment

For production deployments:

1. **Use PostgreSQL**: Configure `DATABASE_URL` for PostgreSQL
2. **Set Strong Secrets**: Generate secure `JWT_SECRET` and other secrets
3. **Configure HTTPS**: Set up SSL/TLS termination
4. **Environment Variables**: Use proper environment management
5. **Monitoring**: Set up logging and monitoring
6. **Backups**: Configure regular database backups

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication with configurable expiration
- **Refresh Tokens**: Automatic token rotation for enhanced security
- **API Tokens**: Service-to-service authentication with `sk_` prefix
- **PKCE Support**: Proof Key for Code Exchange for mobile/public clients
- **Scope-Based Access**: Fine-grained permissions with OAuth2 scopes

### Security Headers
- **Helmet.js**: Automatic security headers (CSP, HSTS, X-Frame-Options, etc.)
- **CORS Protection**: Configurable cross-origin resource sharing
- **Rate Limiting**: Configurable request rate limiting to prevent abuse
- **Input Validation**: Comprehensive request validation with express-validator

### Data Protection
- **Password Hashing**: bcryptjs for secure password storage
- **SQL Injection Prevention**: Prisma ORM with parameterized queries
- **Session Management**: Secure session handling with automatic expiration
- **Audit Logging**: Comprehensive logging for security events

## 🛠️ Development

### Project Structure

```
aether-identity/
├── app/                    # Next.js frontend application
│   ├── components/         # React components
│   ├── context/           # React contexts
│   ├── lib/               # Utility libraries
│   └── styles/            # CSS/Tailwind styles
├── api/                    # Express.js backend API
│   ├── src/
│   │   ├── controllers/   # API controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Data models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── config/        # Configuration files
│   └── prisma/            # Database schema and migrations
├── docs/                  # Documentation
├── public/                # Static assets
└── docker-compose.yml     # Docker configuration
```

### Available Scripts

```bash
# Development
pnpm dev              # Start frontend development server
pnpm dev:api          # Start backend API development server

# Building
pnpm build            # Build frontend for production
pnpm build:api        # Build backend API for production

# Production
pnpm start            # Start frontend production server
pnpm start:api        # Start backend API production server

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema changes to database
pnpm db:migrate       # Run database migrations
pnpm db:studio        # Open Prisma Studio

# Code Quality
pnpm lint             # Run ESLint
pnpm typecheck        # Run TypeScript type checking
```

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and commit them: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style

- **TypeScript**: Strict mode enabled with proper type definitions
- **ESLint**: Configured with Next.js and TypeScript rules
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standardized commit messages
- **Tests**: Comprehensive test coverage with Jest and React Testing Library

## 📊 Monitoring & Health

### Health Endpoints

- **General Health**: `GET /health` - Overall system status
- **Database Health**: Included in health check response
- **API Status**: `GET /api/v1/status` - API-specific status

### Logging

- **Structured Logging**: JSON-formatted logs for easy parsing
- **Log Levels**: Configurable log levels (debug, info, warn, error)
- **Request Logging**: Morgan middleware for HTTP request logging
- **Error Tracking**: Comprehensive error logging with stack traces

### Metrics

- **Response Times**: Track API response times
- **Error Rates**: Monitor error frequencies
- **User Activity**: Track authentication events
- **Token Usage**: Monitor API token usage patterns

## 🌐 Integration Examples

### JavaScript/TypeScript Client

```typescript
class AetherIdentityClient {
  constructor(
    private baseUrl: string,
    private clientId: string,
    private clientSecret: string
  ) {}

  async getAuthorizationUrl(redirectUri: string, scope: string[]) {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: scope.join(' '),
      state: this.generateState()
    });

    return `${this.baseUrl}/api/v1/auth/authorize?${params}`;
  }

  async exchangeCodeForTokens(code: string, redirectUri: string) {
    const response = await fetch(`${this.baseUrl}/api/v1/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: redirectUri
      })
    });

    return response.json();
  }

  async getUserInfo(accessToken: string) {
    const response = await fetch(`${this.baseUrl}/api/v1/auth/userinfo`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    return response.json();
  }

  private generateState(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}

// Usage
const client = new AetherIdentityClient(
  'https://identity.yourdomain.com',
  'your_client_id',
  'your_client_secret'
);
```

### Python Client

```python
import requests
import secrets
from urllib.parse import urlencode

class AetherIdentityClient:
    def __init__(self, base_url: str, client_id: str, client_secret: str):
        self.base_url = base_url
        self.client_id = client_id
        self.client_secret = client_secret

    def get_authorization_url(self, redirect_uri: str, scopes: list[str]) -> str:
        params = {
            'client_id': self.client_id,
            'redirect_uri': redirect_uri,
            'response_type': 'code',
            'scope': ' '.join(scopes),
            'state': secrets.token_urlsafe(16)
        }
        return f"{self.base_url}/api/v1/auth/authorize?{urlencode(params)}"

    def exchange_code_for_tokens(self, code: str, redirect_uri: str) -> dict:
        response = requests.post(
            f"{self.base_url}/api/v1/auth/token",
            json={
                'grant_type': 'authorization_code',
                'code': code,
                'client_id': self.client_id,
                'client_secret': self.client_secret,
                'redirect_uri': redirect_uri
            }
        )
        return response.json()

    def get_user_info(self, access_token: str) -> dict:
        response = requests.get(
            f"{self.base_url}/api/v1/auth/userinfo",
            headers={'Authorization': f'Bearer {access_token}'}
        )
        return response.json()
```

## 🤝 Support

### Documentation
- **API Documentation**: Available at `/api/v1/docs` when running the server
- **Guides**: Check the `docs/` directory for detailed guides
- **Examples**: See the integration examples above

### Getting Help
- **Issues**: Report bugs via [GitHub Issues](https://github.com/skygenesisenterprise/aether-identity/issues)
- **Discussions**: Use [GitHub Discussions](https://github.com/skygenesisenterprise/aether-identity/discussions) for questions
- **Email**: Contact support@aether-identity.com for enterprise support

### Community
- **Contributing**: We welcome contributions! See the Contributing section above
- **Roadmap**: Check our project roadmap for upcoming features
- **Changelog**: View the CHANGELOG.md for version history

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Third-Party Licenses

This project uses several open-source libraries:

- **Next.js** - MIT License
- **Express.js** - MIT License  
- **Prisma** - Apache-2.0 License
- **React** - MIT License
- **TypeScript** - Apache-2.0 License

See the package.json file for a complete list of dependencies and their licenses.

---

<div align="center">

**Built with ❤️ by the Sky Genesis Enterprise Team**

[Website](https://skygenesisenterprise.com) • [Documentation](https://wiki.skygenesisenterprise.com) • [Support](mailto:support@skygenesisenterprise.com)

</div>
