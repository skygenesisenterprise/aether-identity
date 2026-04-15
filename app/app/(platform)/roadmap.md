# @app/(platform) Dashboard - API Roadmap

This document maps the UI pages in `@app/app/(platform)/dashboard/` to the required `@server/` API endpoints for full backend integration.

---

## Dashboard Pages Overview

| Section           | Pages                                                                              | Status    |
| ----------------- | ---------------------------------------------------------------------------------- | --------- |
| **Users**         | `users/page.tsx`, `users/roles/page.tsx`                                           | Mock data |
| **Applications**  | `applications/page.tsx`, `applications/apis/`, `applications/externalapps/`        | Partial   |
| **Organizations** | `organizations/page.tsx`                                                           | Mock data |
| **Connections**   | `database/`, `social/`, `enterprise/`, `passwordless/`, `authentication-profiles/` | Mock data |
| **Security**      | `mfa/`, `attack-protection/`, `analytics/`, `monitoring/`                          | Mock data |
| **Branding**      | `universal-login/`, `custom-login/`, `custom-domain/`, `templates/`                | Mock data |
| **Actions**       | `library/`, `triggers/`, `forms/`                                                  | Mock data |
| **Extensions**    | `extension/page.tsx`                                                               | Mock data |
| **Marketplace**   | `marketplace/page.tsx`                                                             | Mock data |
| **Activity**      | `activity/page.tsx`                                                                | Mock data |
| **Monitoring**    | `logs/`, `logs-stream/`, `action-logs/`                                            | Mock data |
| **Agents**        | `agents/page.tsx`                                                                  | Mock data |
| **Settings**      | `settings/page.tsx`                                                                | Mock data |
| **Events**        | `event/page.tsx`                                                                   | Mock data |

---

## 1. Users Management

### UI Pages

- `app/(platform)/dashboard/users/page.tsx` - User list with search, filters, actions
- `app/(platform)/dashboard/users/roles/page.tsx` - Role management

### API Endpoints Required

```
GET    /api/v1/users              - List users (pagination, filters)
POST   /api/v1/users              - Create user
GET    /api/v1/users/:id         - Get user details
PATCH  /api/v1/users/:id         - Update user
DELETE /api/v1/users/:id         - Delete user
POST   /api/v1/users/:id/block   - Block user
POST   /api/v1/users/:id/unblock - Unblock user
POST   /api/v1/users/:id/reset-password - Admin reset password
POST   /api/v1/users/:id/send-email      - Send email to user
POST   /api/v1/users/:id/force-logout    - Force logout user
POST   /api/v1/users/:id/mfa/enroll      - Enroll MFA
GET    /api/v1/users/:id/mfa/status      - Get MFA status
GET    /api/v1/users/:id/sessions        - Get active sessions

GET    /api/v1/users/roles      - List roles
POST   /api/v1/users/roles      - Create role
PATCH  /api/v1/users/roles/:id  - Update role
DELETE /api/v1/users/roles/:id  - Delete role
```

### Server Controller

- `server/src/controllers/user_admin.go` ✅ Exists
- `server/src/controllers/user.go` ✅ Exists

---

## 2. Applications

### UI Pages

- `app/(platform)/dashboard/applications/page.tsx` - App list
- `app/(platform)/dashboard/applications/apis/page.tsx` - M2M APIs
- `app/(platform)/dashboard/applications/externalapps/page.tsx` - External apps

### API Endpoints Required

```
GET    /api/v1/applications              - List applications
POST   /api/v1/applications              - Create application
GET    /api/v1/applications/:id         - Get application details
PATCH  /api/v1/applications/:id         - Update application
DELETE /api/v1/applications/:id         - Delete application
GET    /api/v1/applications/:id/credentials     - Get client credentials
POST   /api/v1/applications/:id/rotate-secret    - Rotate client secret
GET    /api/v1/applications/:id/stats            - Get app statistics

GET    /api/v1/applications/apis    - List API applications (M2M)
GET    /api/v1/applications/external - List external applications
```

### Server Controller

- `server/src/controllers/application_controller.go` ✅ Exists

---

## 3. Organizations

### UI Pages

- `app/(platform)/dashboard/organizations/page.tsx` - Org list, members

### API Endpoints Required

```
GET    /api/v1/organizations              - List organizations
POST   /api/v1/organizations              - Create organization
GET    /api/v1/organizations/:id         - Get organization details
PATCH  /api/v1/organizations/:id         - Update organization
DELETE /api/v1/organizations/:id         - Delete organization
GET    /api/v1/organizations/:id/members - List members
POST   /api/v1/organizations/:id/members - Add member
DELETE /api/v1/organizations/:id/members/:userId - Remove member
PATCH  /api/v1/organizations/:id/members/:userId - Update member role
```

### Server Controller

- `server/src/controllers/organization_controller.go` ✅ Exists

---

## 4. Connections

### UI Pages

- `app/(platform)/dashboard/connection/database/page.tsx` - Database auth
- `app/(platform)/dashboard/connection/social/page.tsx` - Social providers
- `app/(platform)/dashboard/connection/enterprise/page.tsx` - SAML/OIDC
- `app/(platform)/dashboard/connection/passwordless/page.tsx` - Passwordless
- `app/(platform)/dashboard/connection/authentication-profiles/page.tsx` - Auth profiles

### API Endpoints Required

```
GET    /api/v1/connections                    - List all connections
POST   /api/v1/connections                    - Create connection
GET    /api/v1/connections/:id               - Get connection details
PATCH  /api/v1/connections/:id               - Update connection
DELETE /api/v1/connections/:id               - Delete connection
POST   /api/v1/connections/:id/enable        - Enable connection
POST   /api/v1/connections/:id/disable       - Disable connection

POST   /api/v1/connections/database         - Create database connection
PATCH  /api/v1/connections/database/:id     - Configure database connection
GET    /api/v1/connections/database/:id/users - List database users

GET    /api/v1/connections/social           - List social providers
POST   /api/v1/connections/social           - Configure social provider

GET    /api/v1/connections/enterprise       - List enterprise connections
POST   /api/v1/connections/enterprise/saml  - Create SAML connection
PATCH  /api/v1/connections/enterprise/saml/:id - Update SAML settings
POST   /api/v1/connections/enterprise/saml/:id/metadata - Update SAML metadata
POST   /api/v1/connections/enterprise/oidc - Create OIDC connection

GET    /api/v1/connections/passwordless     - List passwordless settings
POST   /api/v1/connections/passwordless     - Enable passwordless
PATCH  /api/v1/connections/passwordless/:id - Configure passwordless

GET    /api/v1/connections/authentication-profiles - List profiles
POST   /api/v1/connections/authentication-profiles - Create profile
```

### Server Controller

- `server/src/controllers/connection_controller.go` ✅ Exists
- `server/src/controllers/database.go` ✅ Exists
- `server/src/services/connection_service.go` ✅ Exists

---

## 5. Security

### UI Pages

- `app/(platform)/dashboard/security/mfa/page.tsx` - MFA methods & policies
- `app/(platform)/dashboard/security/attack-protection/page.tsx` - Brute-force, breaches
- `app/(platform)/dashboard/security/analytics/page.tsx` - Security analytics
- `app/(platform)/dashboard/security/monitoring/page.tsx` - Monitoring status

### API Endpoints Required

```
# MFA Methods
GET    /api/v1/security/mfa/methods               - List MFA methods
PATCH  /api/v1/security/mfa/methods/:id          - Enable/disable MFA method

# MFA Policies
GET    /api/v1/security/mfa/policies              - List MFA policies
POST   /api/v1/security/mfa/policies              - Create MFA policy
PATCH  /api/v1/security/mfa/policies/:id          - Update MFA policy
DELETE /api/v1/security/mfa/policies/:id          - Delete MFA policy

GET    /api/v1/security/mfa/stats                - Get MFA statistics
GET    /api/v1/security/mfa/activity             - Get MFA activity logs
POST   /api/v1/security/mfa/challenge            - Initiate MFA challenge
POST   /api/v1/security/mfa/verify               - Verify MFA code

# Attack Protection
GET    /api/v1/security/attack-protection        - Get protection settings
PATCH  /api/v1/security/attack-protection        - Update protection settings
GET    /api/v1/security/attack-protection/brute-force   - Brute-force config
PATCH  /api/v1/security/attack-protection/brute-force  - Update brute-force
GET    /api/v1/security/attack-protection/breached-passwords - Breached passwords
PATCH  /api/v1/security/attack-protection/breached-passwords - Update

# Security Analytics
GET    /api/v1/security/analytics                - Get security analytics
GET    /api/v1/security/analytics/threats       - Get threat data
GET    /api/v1/security/monitoring              - Get monitoring status
```

### Server Controller

- `server/src/controllers/totp.go` ✅ Exists
- `server/src/services/security_service.go` ✅ Exists

---

## 6. Branding

### UI Pages

- `app/(platform)/dashboard/branding/universal-login/page.tsx` - Universal login
- `app/(platform)/dashboard/branding/custom-login/page.tsx` - Custom login
- `app/(platform)/dashboard/branding/custom-domain/page.tsx` - Custom domains
- `app/(platform)/dashboard/branding/templates/page.tsx` - Login page templates

### API Endpoints Required

```
GET    /api/v1/branding                         - Get branding settings
PATCH  /api/v1/branding                         - Update branding settings

# Universal Login
GET    /api/v1/branding/universal-login        - Get universal login config
PATCH  /api/v1/branding/universal-login        - Update universal login
GET    /api/v1/branding/universal-login/pages  - List login pages
POST   /api/v1/branding/universal-login/pages  - Create login page
PATCH  /api/v1/branding/universal-login/pages/:id - Update login page

# Custom Login
GET    /api/v1/branding/custom-login           - Get custom login settings
PATCH  /api/v1/branding/custom-login          - Update custom login

# Custom Domain
GET    /api/v1/branding/custom-domains        - List custom domains
POST   /api/v1/branding/custom-domains        - Create custom domain
GET    /api/v1/branding/custom-domains/:id    - Get domain details
DELETE /api/v1/branding/custom-domains/:id   - Delete custom domain
POST   /api/v1/branding/custom-domains/:id/verify - Verify domain

# Templates
GET    /api/v1/branding/templates              - List branding templates
GET    /api/v1/branding/templates/:id         - Get template details
POST   /api/v1/branding/templates             - Create template
DELETE /api/v1/branding/templates/:id         - Delete template
```

### Server Controller

- `server/src/controllers/branding_controller.go` ✅ Exists
- `server/src/controllers/domain_controller.go` ✅ Exists
- `server/src/services/branding_service.go` ✅ Exists
- `server/src/services/domain_service.go` ✅ Exists

---

## 7. Actions & Extensions

### UI Pages

- `app/(platform)/dashboard/actions/library/page.tsx` - Action library
- `app/(platform)/dashboard/actions/triggers/page.tsx` - Triggers
- `app/(platform)/dashboard/actions/forms/page.tsx` - Form actions
- `app/(platform)/dashboard/extension/page.tsx` - Extensions

### API Endpoints Required

```
# Actions
GET    /api/v1/actions                  - List all actions
POST   /api/v1/actions                  - Create action
GET    /api/v1/actions/:id             - Get action details
PATCH  /api/v1/actions/:id             - Update action
DELETE /api/v1/actions/:id             - Delete action
POST   /api/v1/actions/:id/deploy      - Deploy action
POST   /api/v1/actions/:id/test        - Test action
GET    /api/v1/actions/:id/logs       - Get action logs

# Triggers
GET    /api/v1/actions/triggers        - List available triggers
GET    /api/v1/actions/triggers/:triggerId/actions - List actions for trigger

# Library
GET    /api/v1/actions/library         - List action library
POST   /api/v1/actions/library         - Add action to library
DELETE /api/v1/actions/library/:id     - Remove from library

# Forms
GET    /api/v1/actions/forms           - List form actions
POST   /api/v1/actions/forms           - Create form action

# Extensions
GET    /api/v1/extensions               - List installed extensions
POST   /api/v1/extensions             - Install extension
DELETE /api/v1/extensions/:id         - Uninstall extension
GET    /api/v1/extensions/:id/config  - Get extension config
PATCH  /api/v1/extensions/:id/config  - Update extension config
```

### Server Controller

- `server/src/controllers/action_controller.go` ✅ Exists
- `server/src/controllers/extension_controller.go` ✅ Exists
- `server/src/services/action_service.go` ✅ Exists
- `server/src/services/extension_service.go` ✅ Exists

---

## 8. Marketplace

### UI Pages

- `app/(platform)/dashboard/marketplace/page.tsx` - Marketplace integrations

### API Endpoints Required

```
GET    /api/v1/marketplace                  - List marketplace integrations
GET    /api/v1/marketplace/:id             - Get integration details
POST   /api/v1/marketplace/:id/install     - Install integration
POST   /api/v1/marketplace/:id/uninstall   - Uninstall integration
```

### Server Controller

- `server/src/controllers/marketplace_controller.go` ✅ Exists

---

## 9. Activity & Analytics

### UI Pages

- `app/(platform)/dashboard/activity/page.tsx` - Activity overview

### API Endpoints Required

```
GET    /api/v1/activity                  - Get activity overview
GET    /api/v1/activity/dau              - Daily active users
GET    /api/v1/activity/retention        - User retention data
GET    /api/v1/activity/signups          - Signup data
GET    /api/v1/activity/failed-logins    - Failed login data

GET    /api/v1/stats                     - Get dashboard statistics
GET    /api/v1/stats/users               - User statistics
GET    /api/v1/stats/sessions            - Session statistics
GET    /api/v1/stats/logins              - Login statistics
```

### Server Controller

- `server/src/services/activity_service.go` ✅ Exists

---

## 10. Monitoring & Logs

### UI Pages

- `app/(platform)/dashboard/monitoring/logs/page.tsx` - Log queries
- `app/(platform)/dashboard/monitoring/logs-stream/page.tsx` - Real-time logs
- `app/(platform)/dashboard/monitoring/action-logs/page.tsx` - Action execution logs

### API Endpoints Required

```
# Logs
GET    /api/v1/logs                       - List logs with filters
GET    /api/v1/logs/:id                  - Get log details
GET    /api/v1/logs/export                - Export logs (CSV/JSON)
GET    /api/v1/logs/stats                 - Get log statistics

# Log Filters (query params)
GET    /api/v1/logs?level=error           - Filter by level
GET    /api/v1/logs?event=login           - Filter by event type
GET    /api/v1/logs?user=email            - Filter by user
GET    /api/v1/logs?connection=provider   - Filter by connection
GET    /api/v1/logs?ip=address            - Filter by IP

# Action Logs
GET    /api/v1/logs/actions               - List action execution logs
GET    /api/v1/logs/actions/:id          - Get action log details

# Real-time
GET    /api/v1/logs/stream                 - Real-time log stream (SSE/WebSocket)

# Monitoring
GET    /api/v1/monitoring/status           - Get system status
GET    /api/v1/monitoring/health          - Get health metrics
```

### Server Controller

- `server/src/controllers/log_controller.go` ✅ Exists

---

## 11. Agents

### UI Pages

- `app/(platform)/dashboard/agents/page.tsx` - Agent management

### API Endpoints Required

```
GET    /api/v1/agents                  - List all agents
POST   /api/v1/agents                  - Register agent
GET    /api/v1/agents/:id             - Get agent details
PATCH  /api/v1/agents/:id             - Update agent
DELETE /api/v1/agents/:id             - Delete agent
GET    /api/v1/agents/:id/status     - Get agent status
POST   /api/v1/agents/:id/restart    - Restart agent
```

### Server Controller

- `server/src/controllers/agent_controller.go` ✅ Exists
- `server/src/services/agent_service.go` ✅ Exists

---

## 12. Settings

### UI Pages

- `app/(platform)/dashboard/settings/page.tsx` - System settings

### API Endpoints Required

```
GET    /api/v1/settings                - Get system settings
PATCH  /api/v1/settings                - Update system settings

GET    /api/v1/settings/general        - General settings
PATCH  /api/v1/settings/general        - Update general settings

GET    /api/v1/settings/docker         - Docker configuration
PATCH  /api/v1/settings/docker         - Update Docker configuration

GET    /api/v1/settings/email          - Email/SMTP settings
PATCH  /api/v1/settings/email          - Update email settings
POST   /api/v1/settings/email/test     - Test email configuration

GET    /api/v1/settings/features        - Feature flags
PATCH  /api/v1/settings/features       - Update feature flags
```

### Server Controller

- `server/src/services/settings_service.go` ✅ Exists

---

## 13. Events

### UI Pages

- `app/(platform)/dashboard/event/page.tsx` - Event management

### API Endpoints Required

```
GET    /api/v1/events                  - List events
GET    /api/v1/events/:id             - Get event details
```

### Server Controller

- `server/src/controllers/event_controller.go` ✅ Exists

---

## Implementation Priority

### Phase 1: Core Identity (MVP)

1. **Users** - Full CRUD, blocking, password reset, sessions
2. **Applications** - CRUD, credentials, stats
3. **Connections** - Database, Social, Enterprise (SAML/OIDC)

### Phase 2: Security

1. **MFA** - Methods, policies, statistics
2. **Attack Protection** - Brute-force, breached passwords

### Phase 3: Enterprise Features

1. **Organizations** - CRUD, members management
2. **Branding** - Universal login, custom domains
3. **Settings** - General, email, features

### Phase 4: Extensions & Actions

1. **Actions** - CRUD, triggers, library
2. **Extensions** - Management, configuration

### Phase 5: Monitoring & Analytics

1. **Logs** - Query, filters, export
2. **Activity** - Analytics, statistics
3. **Agents** - Management, status

---

## Backend Implementation Checklist

| Module        | Controller                    | Service                    | Model              | Status |
| ------------- | ----------------------------- | -------------------------- | ------------------ | ------ |
| Users         | ✅ user_admin.go              | ✅ user.go                 | ✅ user.go         | Done   |
| Applications  | ✅ application_controller.go  | ✅ application.go          | ✅ application.go  | Done   |
| Organizations | ✅ organization_controller.go | ✅ organization_service.go | ✅ organization.go | Done   |
| Connections   | ✅ connection_controller.go   | ✅ connection_service.go   | ✅ connection.go   | Done   |
| Security      | ✅ totp.go                    | ✅ security_service.go     | ✅ security.go     | Done   |
| Branding      | ✅ branding_controller.go     | ✅ branding_service.go     | ✅ branding.go     | Done   |
| Actions       | ✅ action_controller.go       | ✅ action_service.go       | ✅ action.go       | Done   |
| Extensions    | ✅ extension_controller.go    | ✅ extension_service.go    | ✅ extension.go    | Done   |
| Marketplace   | ✅ marketplace_controller.go  | ✅ marketplace_service.go  |                    | Done   |
| Activity      |                               | ✅ activity_service.go     | ✅ activity.go     | Done   |
| Logs          | ✅ log_controller.go          | ✅ log_service.go          | ✅ log.go          | Done   |
| Agents        | ✅ agent_controller.go        | ✅ agent_service.go        |                    | Done   |
| Settings      |                               | ✅ settings_service.go     | ✅ settings.go     | Done   |
| Events        | ✅ event_controller.go        | ✅ event_service.go        |                    | Done   |

---

## Next Steps for @app Integration

1. **Replace mock data** in each page with API calls
2. **Create API service layer** in `app/lib/api/`
3. **Add loading states** and error handling
4. **Implement optimistic updates** where appropriate
5. **Add pagination** for list views
6. **Implement real-time** for logs-stream page (SSE/WebSocket)
