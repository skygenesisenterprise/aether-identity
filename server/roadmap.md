# API Roadmap - /api/v1/\* Routes

This document maps the dashboard functionality to the required API endpoints for rapid deployment.

## Overview

The dashboard provides a comprehensive identity management platform with the following core areas:

- **Authentication (Public)** - Login, Register, OAuth, Passwordless
- **Users & Identity Management**
- **Applications & APIs**
- **Organizations**
- **Connections**
- **Security (MFA, Attack Protection)**
- **Branding**
- **Actions & Extensions**
- **Monitoring & Logs**
- **Settings**
- **Tenant Management**

---

## 1. Users & Identity Management

### Routes

- `GET    /api/v1/users` - List all users with pagination, filters
- `POST   /api/v1/users` - Create a new user
- `GET    /api/v1/users/:id` - Get user by ID
- `PATCH  /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user
- `POST   /api/v1/users/:id/block` - Block user
- `POST   /api/v1/users/:id/unblock` - Unblock user
- `POST   /api/v1/users/:id/reset-password` - Reset password
- `POST   /api/v1/users/:id/send-email` - Send email to user
- `POST   /api/v1/users/:id/force-logout` - Force logout user
- `POST   /api/v1/users/:id/mfa/enroll` - Enroll MFA for user
- `GET    /api/v1/users/:id/mfa/status` - Get MFA status
- `GET    /api/v1/users/:id/sessions` - Get active sessions
- `GET    /api/v1/users/roles` - List all roles
- `POST   /api/v1/users/roles` - Create role
- `PATCH  /api/v1/users/roles/:id` - Update role
- `DELETE /api/v1/users/roles/:id` - Delete role

### Query Parameters

- `status` - active, blocked, pending, inactive
- `connection` - Authentication method
- `search` - Search by name/email
- `page`, `limit` - Pagination

---

## 2. Applications

### Routes

- `GET    /api/v1/applications` - List all applications
- `POST   /api/v1/applications` - Create application
- `GET    /api/v1/applications/:id` - Get application details
- `PATCH  /api/v1/applications/:id` - Update application
- `DELETE /api/v1/applications/:id` - Delete application
- `GET    /api/v1/applications/:id/credentials` - Get client credentials
- `POST   /api/v1/applications/:id/rotate-secret` - Rotate client secret
- `GET    /api/v1/applications/:id/stats` - Get application statistics
- `GET    /api/v1/applications/apis` - List API applications (M2M)
- `GET    /api/v1/applications/external` - List external applications

---

## 3. Organizations

### Routes

- `GET    /api/v1/organizations` - List organizations
- `POST   /api/v1/organizations` - Create organization
- `GET    /api/v1/organizations/:id` - Get organization details
- `PATCH  /api/v1/organizations/:id` - Update organization
- `DELETE /api/v1/organizations/:id` - Delete organization
- `GET    /api/v1/organizations/:id/members` - List members
- `POST   /api/v1/organizations/:id/members` - Add member
- `DELETE /api/v1/organizations/:id/members/:userId` - Remove member
- `PATCH  /api/v1/organizations/:id/members/:userId` - Update member role

---

## 4. Connections (Authentication)

### Routes

- `GET    /api/v1/connections` - List all connections
- `POST   /api/v1/connections` - Create connection
- `GET    /api/v1/connections/:id` - Get connection details
- `PATCH  /api/v1/connections/:id` - Update connection
- `DELETE /api/v1/connections/:id` - Delete connection
- `POST   /api/v1/connections/:id/enable` - Enable connection
- `POST   /api/v1/connections/:id/disable` - Disable connection

### Database Connection

- `POST   /api/v1/connections/database` - Create database connection
- `PATCH  /api/v1/connections/database/:id` - Configure database connection
- `GET    /api/v1/connections/database/:id/users` - List database users

### Social Connections

- `GET    /api/v1/connections/social` - List social providers
- `POST   /api/v1/connections/social` - Configure social provider

### Enterprise Connections

- `GET    /api/v1/connections/enterprise` - List enterprise connections
- `POST   /api/v1/connections/enterprise/saml` - Create SAML connection
- `PATCH  /api/v1/connections/enterprise/saml/:id` - Update SAML settings
- `POST   /api/v1/connections/enterprise/saml/:id/metadata` - Update SAML metadata
- `POST   /api/v1/connections/enterprise/oidc` - Create OIDC connection

### Passwordless

- `GET    /api/v1/connections/passwordless` - List passwordless settings
- `POST   /api/v1/connections/passwordless` - Enable passwordless
- `PATCH  /api/v1/connections/passwordless/:id` - Configure passwordless

### Authentication Profiles

- `GET    /api/v1/connections/authentication-profiles` - List profiles
- `POST   /api/v1/connections/authentication-profiles` - Create profile

---

## 5. Security

### MFA (Multi-Factor Authentication)

- `GET    /api/v1/security/mfa/methods` - List MFA methods
- `PATCH  /api/v1/security/mfa/methods/:id` - Enable/disable MFA method
- `GET    /api/v1/security/mfa/policies` - List MFA policies
- `POST   /api/v1/security/mfa/policies` - Create MFA policy
- `PATCH  /api/v1/security/mfa/policies/:id` - Update MFA policy
- `DELETE /api/v1/security/mfa/policies/:id` - Delete MFA policy
- `GET    /api/v1/security/mfa/stats` - Get MFA statistics
- `GET    /api/v1/security/mfa/activity` - Get MFA activity logs
- `POST   /api/v1/security/mfa/challenge` - Initiate MFA challenge
- `POST   /api/v1/security/mfa/verify` - Verify MFA code

### Attack Protection

- `GET    /api/v1/security/attack-protection` - Get protection settings
- `PATCH  /api/v1/security/attack-protection` - Update protection settings
- `GET    /api/v1/security/attack-protection/brute-force` - Brute-force config
- `PATCH  /api/v1/security/attack-protection/brute-force` - Update brute-force
- `GET    /api/v1/security/attack-protection/breached-passwords` - Breached passwords config
- `PATCH  /api/v1/security/attack-protection/breached-passwords` - Update breached passwords

### Security Analytics

- `GET    /api/v1/security/analytics` - Get security analytics
- `GET    /api/v1/security/analytics/threats` - Get threat data

### Security Monitoring

- `GET    /api/v1/security/monitoring` - Get monitoring status

---

## 6. Branding

### Routes

- `GET    /api/v1/branding` - Get branding settings
- `PATCH  /api/v1/branding` - Update branding settings

### Universal Login

- `GET    /api/v1/branding/universal-login` - Get universal login config
- `PATCH  /api/v1/branding/universal-login` - Update universal login
- `GET    /api/v1/branding/universal-login/pages` - List login pages
- `POST   /api/v1/branding/universal-login/pages` - Create login page
- `PATCH  /api/v1/branding/universal-login/pages/:id` - Update login page

### Custom Login

- `GET    /api/v1/branding/custom-login` - Get custom login settings
- `PATCH  /api/v1/branding/custom-login` - Update custom login

### Templates

- `GET    /api/v1/branding/templates` - List branding templates
- `GET    /api/v1/branding/templates/:id` - Get template details
- `POST   /api/v1/branding/templates` - Create template
- `DELETE /api/v1/branding/templates/:id` - Delete template

### Custom Domain

- `GET    /api/v1/branding/custom-domains` - List custom domains
- `POST   /api/v1/branding/custom-domains` - Create custom domain
- `GET    /api/v1/branding/custom-domains/:id` - Get domain details
- `DELETE /api/v1/branding/custom-domains/:id` - Delete custom domain
- `POST   /api/v1/branding/custom-domains/:id/verify` - Verify domain

---

## 7. Actions & Extensions

### Actions

- `GET    /api/v1/actions` - List all actions
- `POST   /api/v1/actions` - Create action
- `GET    /api/v1/actions/:id` - Get action details
- `PATCH  /api/v1/actions/:id` - Update action
- `DELETE /api/v1/actions/:id` - Delete action
- `POST   /api/v1/actions/:id/deploy` - Deploy action
- `POST   /api/v1/actions/:id/test` - Test action
- `GET    /api/v1/actions/:id/logs` - Get action logs

### Triggers

- `GET    /api/v1/actions/triggers` - List available triggers
- `GET    /api/v1/actions/triggers/:triggerId/actions` - List actions for trigger

### Library

- `GET    /api/v1/actions/library` - List action library
- `POST   /api/v1/actions/library` - Add action to library
- `DELETE /api/v1/actions/library/:id` - Remove from library

### Forms

- `GET    /api/v1/actions/forms` - List form actions
- `POST   /api/v1/actions/forms` - Create form action

### Extensions

- `GET    /api/v1/extensions` - List installed extensions
- `POST   /api/v1/extensions` - Install extension
- `DELETE /api/v1/extensions/:id` - Uninstall extension
- `GET    /api/v1/extensions/:id/config` - Get extension config
- `PATCH  /api/v1/extensions/:id/config` - Update extension config

---

## 8. Monitoring & Logs

### Logs

- `GET    /api/v1/logs` - List logs with filters
- `GET    /api/v1/logs/:id` - Get log details
- `GET    /api/v1/logs/export` - Export logs (CSV/JSON)
- `GET    /api/v1/logs/stats` - Get log statistics

### Log Filters

- `GET    /api/v1/logs?level=error` - Filter by level
- `GET    /api/v1/logs?event=login` - Filter by event type
- `GET    /api/v1/logs?user=email` - Filter by user
- `GET    /api/v1/logs?connection=provider` - Filter by connection
- `GET    /api/v1/logs?ip=address` - Filter by IP

### Action Logs

- `GET    /api/v1/logs/actions` - List action execution logs
- `GET    /api/v1/logs/actions/:id` - Get action log details

### Logs Stream

- `GET    /api/v1/logs/stream` - Real-time log stream (WebSocket/Server-Sent Events)

### Monitoring

- `GET    /api/v1/monitoring/status` - Get system status
- `GET    /api/v1/monitoring/health` - Get health metrics

---

## 9. Activity & Analytics

### Routes

- `GET    /api/v1/activity` - Get activity overview
- `GET    /api/v1/activity/dau` - Daily active users
- `GET    /api/v1/activity/retention` - User retention data
- `GET    /api/v1/activity/signups` - Signup data
- `GET    /api/v1/activity/failed-logins` - Failed login data

### Dashboard Stats

- `GET    /api/v1/stats` - Get dashboard statistics
- `GET    /api/v1/stats/users` - User statistics
- `GET    /api/v1/stats/sessions` - Session statistics
- `GET    /api/v1/stats/logins` - Login statistics

---

## 10. Settings

### Routes

- `GET    /api/v1/settings` - Get system settings
- `PATCH  /api/v1/settings` - Update system settings
- `GET    /api/v1/settings/general` - General settings
- `PATCH  /api/v1/settings/general` - Update general settings
- `GET    /api/v1/settings/docker` - Docker configuration
- `PATCH  /api/v1/settings/docker` - Update Docker configuration
- `GET    /api/v1/settings/email` - Email/SMTP settings
- `PATCH  /api/v1/settings/email` - Update email settings
- `POST   /api/v1/settings/email/test` - Test email configuration
- `GET    /api/v1/settings/features` - Feature flags
- `PATCH  /api/v1/settings/features` - Update feature flags

---

## 11. Agents

### Routes

- `GET    /api/v1/agents` - List all agents
- `POST   /api/v1/agents` - Register agent
- `GET    /api/v1/agents/:id` - Get agent details
- `PATCH  /api/v1/agents/:id` - Update agent
- `DELETE /api/v1/agents/:id` - Delete agent
- `GET    /api/v1/agents/:id/status` - Get agent status
- `POST   /api/v1/agents/:id/restart` - Restart agent

---

## 12. Events

### Routes

- `GET    /api/v1/events` - List events
- `GET    /api/v1/events/:id` - Get event details

---

## 13. Marketplace

### Routes

- `GET    /api/v1/marketplace` - List marketplace integrations
- `GET    /api/v1/marketplace/:id` - Get integration details
- `POST   /api/v1/marketplace/:id/install` - Install integration
- `POST   /api/v1/marketplace/:id/uninstall` - Uninstall integration

---

## 14. Authentication (Public Endpoints)

These endpoints handle user authentication flows (OAuth 2.0 / OIDC compliant).

### Login & Session

- `POST   /api/v1/auth/login` - Authenticate user with credentials
- `POST   /api/v1/auth/logout` - End user session
- `POST   /api/v1/auth/refresh` - Refresh access token
- `GET    /api/v1/auth/me` - Get current authenticated user
- `POST   /api/v1/auth/validate` - Validate session/token

### Registration

- `POST   /api/v1/auth/register` - Register new user account
- `POST   /api/v1/auth/register/verify` - Verify email after registration
- `POST   /api/v1/auth/register/resend` - Resend verification email

### Password Management

- `POST   /api/v1/auth/password/reset` - Request password reset
- `POST   /api/v1/auth/password/reset/confirm` - Confirm password reset
- `POST   /api/v1/auth/password/change` - Change password (authenticated)
- `POST   /api/v1/auth/password/reset-by-admin` - Admin reset password

### Multi-Factor Authentication

- `POST   /api/v1/auth/mfa/enroll` - Initiate MFA enrollment
- `POST   /api/v1/auth/mfa/verify` - Verify MFA code
- `POST   /api/v1/auth/mfa/disable` - Disable MFA
- `GET    /api/v1/auth/mfa/challenge` - Trigger MFA challenge
- `POST   /api/v1/auth/mfa/backup-codes` - Generate backup codes

### OAuth 2.0 / OIDC Authorization

- `GET    /api/v1/auth/authorize` - Authorization endpoint (OAuth)
- `POST   /api/v1/auth/token` - Token endpoint (OAuth)
- `POST   /api/v1/auth/revoke` - Revoke token (OAuth)
- `GET    /api/v1/auth/.well-known/openid-configuration` - OIDC discovery
- `GET    /api/v1/auth/.well-known/jwks` - JSON Web Key Set

### Social Login

- `GET    /api/v1/auth/social/:provider` - Initiate social login
- `GET    /api/v1/auth/social/:provider/callback` - Social login callback
- Supported providers: Google, GitHub, Microsoft, Apple, Facebook, SAML, OIDC

### Passwordless

- `POST   /api/v1/auth/passwordless/start` - Initiate passwordless login
- `POST   /api/v1/auth/passwordless/verify` - Verify passwordless code
- `POST   /api/v1/auth/passwordless/email` - Send magic link
- `POST   /api/v1/auth/passwordless/sms` - Send SMS code

### Request Parameters

- `grant_type` - password, authorization_code, refresh_token, client_credentials
- `client_id` - Application client ID
- `client_secret` - Application client secret
- `redirect_uri` - OAuth redirect URI
- `response_type` - code, token, id_token
- `scope` - Space-separated scopes
- `state` - CSRF state parameter

### Headers

- `Authorization: Bearer <token>` - Access token
- `Content-Type: application/x-www-form-urlencoded`

---

## 15. Tenant / Domain Management

### Routes

- `GET    /api/v1/tenant` - Get tenant information
- `PATCH  /api/v1/tenant` - Update tenant settings
- `GET    /api/v1/tenant/usage` - Get usage statistics
- `GET    /api/v1/tenant/billing` - Get billing information

---

## Implementation Priority

### Phase 1 - Core Identity (MVP)

1. Users CRUD + blocking/reset password
2. Applications CRUD + credentials
3. Connections (Database, Social)
4. Login/Signup flows
5. Settings (General, Email)
6. Basic logs

### Phase 2 - Security

1. MFA methods + policies
2. Attack protection
3. Security analytics

### Phase 3 - Enterprise Features

1. Organizations + members
2. Enterprise connections (SAML, OIDC)
3. Custom domains

### Phase 4 - Extensions & Actions

1. Actions CRUD + deployment
2. Extensions management
3. Marketplace

### Phase 5 - Advanced

1. Branding customization
2. Real-time logs stream
3. Activity analytics
4. Agent management

---

## Notes

- All endpoints should support pagination (`page`, `limit`)
- Search functionality should be available on major entities
- Audit logs for all admin actions
- Rate limiting should be configurable
- Webhook support for event notifications
