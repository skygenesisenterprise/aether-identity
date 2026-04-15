# Node SDK Roadmap - aether-identity

This document outlines improvements needed for the `aether-identity` SDK to fully support `@app/` (Next.js application) and integrate with `@server/` (Go API).

**Package names:**

- **npm**: `aether-identity` (public package)
- **pnpm workspace**: `@aether-identity/node` (internal)
- **CDN**: `AetherClient` (global variable)

---

## Current State Analysis

### Client SDK (`IdentityClient`)

- ✅ Basic auth (login, register, logout)
- ✅ Session management with token storage
- ✅ User, Token, Session modules
- ✅ TOTP/MFA support
- ✅ Device enrollment
- ✅ EID verification
- ✅ Machine-to-machine authentication

### Server SDK (`IdentityServer`)

- ✅ Express.js middleware factory
- ✅ Token validation & caching
- ✅ RBAC middleware
- ✅ Hooks system
- ❌ **Only supports Express.js** - incompatible with Go server

### `@app/` Current Implementation

- Custom `AuthApiService` in `lib/api/auth.ts`
- Direct fetch calls to `/api/v1/*` endpoints
- Manual localStorage token management

---

## Gaps & Improvements

### Phase 1: Client SDK Enhancements for `@app/`

#### 1.1 Missing API Coverage

The SDK is missing coverage for these API endpoints from the server roadmap:

| Module                 | Missing Endpoints                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| **Users**              | `PATCH /users/:id`, `POST /users/:id/block`, `POST /users/:id/reset-password`, `GET /users/roles` |
| **Applications**       | Full CRUD, credentials management                                                                 |
| **Organizations**      | CRUD + members management                                                                         |
| **Connections**        | List, create, update auth connections                                                             |
| **Security**           | MFA policies, attack protection settings                                                          |
| **Branding**           | Universal login, custom domains                                                                   |
| **Actions/Extensions** | Actions CRUD, triggers, library                                                                   |
| **Logs**               | Query logs with filters, export                                                                   |
| **Activity**           | DAU, retention, signup analytics                                                                  |
| **Settings**           | General, email, feature flags                                                                     |

#### 1.2 React/Next.js Integration

Need to add:

- React Context provider (`AetherProvider`)
- Custom hooks (`useAuth`, `useUser`, `useSession`)
- SSR-compatible token management (cookies)
- Session persistence helpers

#### 1.3 TypeScript Enhancements

- Add comprehensive type definitions for all API responses
- Add request/response DTOs
- Strong typing for query parameters

### Phase 2: Server SDK Restructuring

#### 2.1 Remove Express.js Dependency

The current Server SDK is designed for Express.js but `@server/` is Go-based:

- **Option A**: Keep Express SDK for Node.js server usage (separate package?)
- **Option B**: Create a generic HTTP client wrapper that works with any backend

#### 2.2 Go-compatible Client Features

Since `@server/` is Go, the Node SDK should:

- Provide typed Go code generation helpers
- Support gRPC generation
- Generate TypeScript types from OpenAPI/Swagger specs

### Phase 3: Advanced Features

#### 3.1 Real-time Capabilities

- WebSocket support for log streaming
- Server-Sent Events for activity updates

#### 3.2 Caching & Performance

- Redis adapter for distributed caching
- Request deduplication
- Automatic token refresh middleware

#### 3.3 Security Enhancements

- CSRF protection
- Request signing
- Audit logging helpers

---

## Implementation Priority

### Priority 1: `@app/` Integration (MVP)

1. **Add missing client modules**
   - Applications module
   - Organizations module
   - Connections module
   - Users admin module

2. **React integration package**
   - Create `aether-identity/react` (or merge into main package)
   - `AetherProvider` component
   - `useAuth()` hook with SSR support
   - Token synchronization with cookies

3. **Example usage for Next.js**

   ```typescript
   // app/providers.tsx
   'use client'
   import { AetherProvider } from 'aether-identity/react'

   export function Providers({ children }) {
     return (
       <AetherProvider
         baseUrl={process.env.NEXT_PUBLIC_API_URL}
         clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
       >
         {children}
       </AetherProvider>
     )
   }

   // app/page.tsx
   import { useAuth } from 'aether-identity'

   export default function Page() {
     const { user, login, logout } = useAuth()
     // ...
   }
   ```

### Priority 2: Server-side Usage

1. **Service-to-service authentication**
   - M2M token generation
   - Service key management
   - Request signing

2. **Middleware for Node.js backends**
   - Add support for Fastify
   - Add support for Koa
   - Add support for NestJS

---

## Package Structure Recommendation

```
aether-identity/
├── client/          # Client SDK (browsers, Node.js)
│   ├── auth.ts
│   ├── user.ts
│   ├── applications.ts
│   ├── ...
│   └── types.ts
├── server/          # Server SDK (Express, Fastify, etc.)
│   ├── express/
│   ├── fastify/
│   └── ...
├── react/           # React integration (optional sub-path)
│   ├── provider.tsx
│   ├── hooks.ts
│   └── context.tsx
└── types/           # Shared types
```

---

## Migration Path for `@app/`

### Current (Custom Implementation)

```typescript
// lib/api/auth.ts
const authApi = new AuthApiService();
await authApi.login(email, password);
localStorage.setItem("accessToken", token);
```

### Target (SDK)

```typescript
// providers.tsx
import { AetherProvider } from "aether-identity";

// hooks/use-auth.ts
import { useAuth } from "aether-identity";
const { login, logout, user } = useAuth();
```

---

## Next Steps

1. **Audit current SDK** against server API specification
2. **Define missing types** for all API endpoints
3. **Implement missing client modules** (Applications, Organizations, etc.)
4. **Create React integration** or extend SDK for React/Next.js
5. **Add documentation** with examples for `@app/` use case

---

## Notes

- The `@server/` Go API already exists with full implementation per `roadmap.md`
- Focus on making `@app/` use the SDK instead of custom fetch calls
- The Server SDK (Express middleware) is useful for Node.js microservices, not the main Go server

---

## Production SSO External Authentication

### Problem Statement

In production environments, `@app/` may need to delegate authentication to an external SSO service (e.g., `sso.skygenesisenterprise.com`) instead of using the local API directly.

### Solution: `identity.config.ts` Configuration

Create a configuration file that defines authentication behavior based on environment:

```typescript
// app/identity.config.ts
import type { IdentityConfig } from "aether-identity";

export const identityConfig: IdentityConfig = {
  // Environment-aware auth service URL
  authService: {
    development: {
      useExternal: false,
      baseUrl: "http://localhost:8080",
      ssoUrl: undefined,
    },
    staging: {
      useExternal: true,
      baseUrl: "https://api-staging.etheriatimes.com",
      ssoUrl: "https://sso-staging.skygenesisenterprise.com",
    },
    production: {
      useExternal: true,
      baseUrl: "https://api.etheriatimes.com",
      ssoUrl: "https://sso.skygenesisenterprise.com",
    },
  },

  // Client configuration
  client: {
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI,
  },

  // Security settings
  security: {
    tokenStorage: "cookie", // 'cookie' for SSR, 'localStorage' for SPA
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },
};

export type Environment = "development" | "staging" | "production";
```

### Integration with `@app/middleware.ts`

The middleware should use the config to determine authentication flow:

```typescript
// app/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { identityConfig, getEnvironment } from "./identity.config";

export function middleware(request: NextRequest) {
  const env = getEnvironment();
  const config = identityConfig.authService[env];

  // For protected paths, check authentication
  if (isProtectedPath(request.nextUrl.pathname)) {
    const authToken = request.cookies.get("auth_token");

    if (!authToken?.value) {
      // In production with external SSO, redirect to SSO service
      if (config.useExternal && config.ssoUrl) {
        const ssoLoginUrl = new URL("/login", config.ssoUrl);
        ssoLoginUrl.searchParams.set("redirect_uri", request.url);
        ssoLoginUrl.searchParams.set("client_id", identityConfig.client.clientId);
        return NextResponse.redirect(ssoLoginUrl);
      }

      // Development/staging: local login
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Validate token with auth service
    const validationResult = validateToken(authToken.value, config.baseUrl);
    if (!validationResult.valid) {
      // Token expired or invalid - redirect to SSO in production
      if (config.useExternal && config.ssoUrl) {
        const ssoLoginUrl = new URL("/login", config.ssoUrl);
        ssoLoginUrl.searchParams.set("redirect_uri", request.url);
        return NextResponse.redirect(ssoLoginUrl);
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

function getEnvironment(): "development" | "staging" | "production" {
  if (process.env.NODE_ENV === "production") return "production";
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === "staging") return "staging";
  return "development";
}
```

### SSO Flow in Production

```
User → @app/ (protected route)
       ↓ (no valid token)
   @app/middleware.ts
       ↓ (config.useExternal = true)
   https://sso.skygenesisenterprise.com/login?redirect_uri=...&client_id=...
       ↓ (user authenticates)
   SSO Service → issues tokens → redirects to @app/callback
       ↓
   @app/ stores tokens in httpOnly cookies
       ↓
   Access granted to protected route
```

### SDK Changes Required

1. **Add `IdentityConfig` type** - Define the configuration structure
2. **Add `createIdentityClient(config)` factory** - Accept environment-aware config
3. **Add `validateToken()` helper** - Server-side token validation (without UI)
4. **Add cookie-based storage option** - For SSR-compatible token handling
5. **Add SSO redirect helper** - Generate proper OAuth redirect URLs
