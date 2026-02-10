# Aether Identity - Guide des Fonctionnalités

## Vue d'ensemble

Aether Identity est une plateforme complète de gestion d'identité et d'accès (IAM) comprenant :

- **Frontend** : Application Next.js moderne avec interface admin
- **Backend** : API Go robuste et performante
- **Base de données** : Schéma Prisma avec PostgreSQL
- **SDKs** : Bibliothèques multi-langages pour intégration

---

## Table des matières

1. [Architecture Frontend](#architecture-frontend)
2. [Architecture Backend](#architecture-backend)
3. [Base de données](#base-de-données)
4. [SDKs & Packages](#sdks--packages)
5. [Guide d'intégration](#guide-dintégration)
6. [API Reference](#api-reference)

---

## Architecture Frontend

### Structure (`@app/`)

```
app/
├── app/                          # App Router Next.js
│   ├── admin/                    # Dashboard administrateur
│   │   ├── home/                 # Dashboard principal
│   │   ├── integrations/         # Intégrations externes
│   │   │   ├── directory/        # Synchronisation annuaires
│   │   │   ├── email/            # Configuration email
│   │   │   ├── external/         # Services externes
│   │   │   ├── providers/        # Fournisseurs d'identité
│   │   │   ├── provisioning/     # Provisionnement
│   │   │   ├── scim/             # Protocole SCIM
│   │   │   ├── services/         # Catalogue de services
│   │   │   └── webhooks/         # Webhooks
│   │   ├── operations/           # Opérations infrastructure
│   │   │   ├── backups/          # Sauvegardes
│   │   │   ├── capacity/         # Planification capacité
│   │   │   ├── costs/            # Gestion des coûts
│   │   │   ├── database/         # Base de données
│   │   │   ├── deployments/      # Déploiements
│   │   │   ├── dr/               # Disaster Recovery
│   │   │   ├── environments/     # Environnements
│   │   │   ├── iac/              # Infrastructure as Code
│   │   │   ├── observability/    # Observabilité
│   │   │   ├── services/         # Services cloud
│   │   │   └── tasks/            # Tâches asynchrones
│   │   ├── organization/         # Gestion organisationnelle
│   │   │   ├── groups/           # Groupes d'utilisateurs
│   │   │   ├── lifecycle/        # Cycle de vie utilisateurs
│   │   │   ├── people/           # Utilisateurs
│   │   │   ├── policies/         # Politiques
│   │   │   ├── profiles/         # Profils utilisateurs
│   │   │   ├── provisioning/     # Provisionnement org
│   │   │   ├── rbac/             # Contrôle d'accès
│   │   │   ├── sessions/         # Sessions actives
│   │   │   ├── structure/        # Structure hiérarchique
│   │   │   └── trust/            # Relations de confiance
│   │   ├── platform/             # Configuration plateforme
│   │   │   ├── identity/         # Gestion identités
│   │   │   ├── key/              # Gestion des clés
│   │   │   ├── policy/           # Politiques plateforme
│   │   │   ├── sso/              # Single Sign-On
│   │   │   ├── system/           # Système
│   │   │   └── token/            # Gestion des tokens
│   │   ├── report/               # Rapports et analytics
│   │   │   ├── access/           # Rapports d'accès
│   │   │   ├── behavior/         # Analyse comportementale
│   │   │   ├── compliance/       # Conformité
│   │   │   ├── cross_authority/  # Cross-authority analysis
│   │   │   ├── dormant/          # Comptes inactifs
│   │   │   └── privilege/        # Analyse des privilèges
│   │   ├── security/             # Sécurité
│   │   │   ├── audit/            # Audit et traçabilité
│   │   │   ├── compliance/       # Conformité sécurité
│   │   │   ├── conditional/      # Accès conditionnel
│   │   │   ├── dlp/              # Data Loss Prevention
│   │   │   ├── identity/         # Sécurité identités
│   │   │   ├── mfa/              # Multi-Factor Authentication
│   │   │   ├── pam/              # Privileged Access Management
│   │   │   ├── passwords/        # Politiques mots de passe
│   │   │   ├── secrets/          # Gestion des secrets
│   │   │   └── threats/          # Intelligence menaces
│   │   └── settings/             # Paramètres
│   │       ├── automation/       # Automatisations
│   │       ├── context/          # Contextes
│   │       ├── data/             # Données
│   │       ├── governance/       # Gouvernance des données
│   │       ├── naming/           # Conventions de nommage
│   │       ├── notifications/    # Notifications
│   │       ├── views/            # Vues personnalisées
│   │       └── workspace/        # Espace de travail
│   └── docs/                     # Documentation (vous êtes ici!)
├── components/                   # Composants React
│   ├── dashboard/               # Composants dashboard
│   └── ui/                      # Composants UI réutilisables
├── context/                     # Contextes React (Auth, JWT)
├── lib/                         # Utilitaires
└── styles/                      # Styles globaux
```

### Fonctionnalités clés du Frontend

#### 1. Dashboard Administrateur

- **Dashboard principal** : Vue d'ensemble de la sécurité et de la santé du système
- **Métriques en temps réel** : Utilisateurs actifs, alertes, conformité
- **Widgets personnalisables** : Security score, activité récente, actions rapides

#### 2. Gestion des Utilisateurs (Organization)

- **Lifecycle Management** : Onboarding/offboarding automatisé
- **Domain-Based Provisioning** : Attribution automatique par domaine email
- **Group Management** : Groupes dynamiques et statiques
- **Session Management** : Sessions actives avec révocation à distance
- **Profile Management** : Attributs personnalisés et préférences

#### 3. Sécurité Avancée

- **MFA** : TOTP, SMS, WebAuthn
- **Conditional Access** : Politiques basées sur localisation, appareil, risque
- **Password Policies** : Complexité, rotation, historique
- **PAM** : Comptes privilégiés avec Just-in-Time access
- **DLP** : Prévention de perte de données
- **Threat Intelligence** : Détection et analyse des menaces

#### 4. Intégrations

- **SCIM** : Synchronisation automatique (Azure AD, Okta, etc.)
- **Directory Sync** : Active Directory, LDAP
- **Email** : Configuration SMTP/IMAP pour notifications
- **Service Catalog** : Aether Mail, Meet, Drive, etc.
- **Webhooks** : Événements en temps réel

#### 5. Analytics & Reporting

- **Behavior Analytics** : Détection d'anomalies
- **Compliance Reports** : RGPD, SOC2, ISO 27001
- **Privilege Analysis** : Analyse des privilèges effectifs
- **Access Reports** : Qui a accès à quoi

---

## Architecture Backend

### Structure (`@server/`)

```
server/
├── src/
│   ├── config/                  # Configuration
│   │   ├── config.go            # Configuration générale
│   │   ├── oauth_config.go      # Configuration OAuth
│   │   └── oauth_providers_config.go  # Fournisseurs OAuth
│   ├── controllers/             # Contrôleurs HTTP
│   │   ├── auth.go              # Authentification
│   │   ├── client_controller.go # Gestion clients OAuth
│   │   ├── database.go          # Opérations base de données
│   │   ├── discord.go           # Intégration Discord
│   │   ├── discovery_controller.go  # Discovery OIDC
│   │   ├── domain_controller.go # Gestion des domaines
│   │   ├── email.go             # Envoi d'emails
│   │   ├── external_auth_controller.go  # Auth externe
│   │   ├── health.go            # Health checks
│   │   ├── introspect.go        # Introspection tokens
│   │   ├── oauth_controller.go  # Flux OAuth 2.0/OIDC
│   │   ├── service_key_controller.go  # Clés de service
│   │   ├── token.go             # Gestion des tokens
│   │   ├── totp.go              # TOTP/MFA
│   │   ├── user.go              # Gestion utilisateurs
│   │   ├── user_admin.go        # Administration utilisateurs
│   │   ├── user_keys_controller.go  # Clés utilisateurs
│   │   └── userinfo.go          # Endpoint UserInfo OIDC
│   ├── interfaces/              # Interfaces abstraites
│   │   ├── database_service.go
│   │   ├── jwt_service.go
│   │   └── user_repository.go
│   ├── middleware/              # Middlewares HTTP
│   │   ├── admin_middleware.go  # Vérification admin
│   │   ├── app_auth.go          # Auth applications
│   │   ├── auth.go              # Authentification JWT
│   │   ├── cors.go              # CORS
│   │   ├── database.go          # Injection DB
│   │   ├── oauth_middleware.go  # Validation OAuth
│   │   ├── rbac.go              # Contrôle d'accès
│   │   ├── service_key_auth.go  # Auth par clé de service
│   │   ├── totp.go              # Vérification TOTP
│   │   └── validation.go        # Validation des entrées
│   ├── model/                   # Modèles de données
│   │   ├── auth.go              # Modèles auth
│   │   ├── database.go          # Modèles DB
│   │   ├── domain.go            # Modèles domaines
│   │   ├── external_account.go  # Comptes externes
│   │   ├── oauth.go             # Modèles OAuth
│   │   ├── organization.go      # Organisations
│   │   ├── role.go              # Rôles et permissions
│   │   ├── service_key.go       # Clés de service
│   │   ├── token.go             # Tokens
│   │   ├── totp.go              # TOTP
│   │   └── user.go              # Utilisateurs
│   ├── routes/                  # Routes HTTP
│   │   └── routes.go            # Définition des routes
│   ├── services/                # Services métier
│   │   ├── database.go          # Service base de données
│   │   ├── domain_service.go    # Service domaines
│   │   ├── email.go             # Service email
│   │   ├── external_auth_migration.go  # Migration auth externe
│   │   ├── external_auth_service.go    # Auth externe
│   │   ├── jwt.go               # Service JWT
│   │   ├── oauth.go             # Service OAuth
│   │   ├── service_key.go       # Service clés
│   │   ├── totp.go              # Service TOTP
│   │   ├── user.go              # Service utilisateurs
│   │   └── validation.go        # Service validation
│   └── utils/                   # Utilitaires
│       └── database.go          # Utilitaires DB
└── infra/                       # Infrastructure
    ├── Dockerfile               # Image production
    ├── Dockerfile.dev           # Image développement
    ├── docker-compose.yml       # Stack production
    └── docker-compose.dev.yml   # Stack développement
```

### Fonctionnalités clés du Backend

#### 1. Authentification & Autorisation

- **OAuth 2.0 / OIDC** : Flux Authorization Code, Client Credentials, Device Code
- **JWT** : Tokens signés avec rotation des clés
- **RBAC** : Contrôle d'accès basé sur les rôles hiérarchiques
- **TOTP** : MFA avec support Google Authenticator, Authy

#### 2. Gestion des Identités

- **User Management** : CRUD utilisateurs avec validation
- **Domain Management** : Vérification et gestion des domaines
- **Organization Management** : Multi-tenant avec isolation
- **External Auth** : Migration et liaison de comptes externes

#### 3. Sécurité

- **Service Keys** : Authentification machine-to-machine
- **Rate Limiting** : Protection contre les abus
- **Input Validation** : Validation stricte des entrées
- **CORS** : Configuration flexible des origines

#### 4. Intégrations

- **Email Service** : Envoi de notifications et OTP
- **Discord Integration** : Notifications et webhooks
- **Discovery Endpoint** : Configuration OIDC dynamique

---

## Base de données

### Structure (`@prisma/`)

```
prisma/
├── schema.prisma               # Schéma Prisma principal
├── prisma.config.ts            # Configuration Prisma
├── vault.config.ts             # Configuration HashiCorp Vault
└── infra/                      # Infrastructure
    ├── Dockerfile
    ├── docker-compose.yml
    └── docker-compose.dev.yml
```

### Modèles principaux

#### Utilisateurs & Identités

```prisma
model User {
  id              String    @id @default(uuid())
  email           String    @unique
  username        String    @unique
  passwordHash    String?
  emailVerified   Boolean   @default(false)
  isAdmin         Boolean   @default(false)
  isActive        Boolean   @default(true)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relations
  organization    Organization? @relation(fields: [organizationId], references: [id])
  organizationId  String?
  roles           UserRole[]
  sessions        Session[]
  externalAccounts ExternalAccount[]
  totpSecrets     TOTPSecret[]
  serviceKeys     ServiceKey[]
}
```

#### Organisations & Structure

```prisma
model Organization {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  domain      String?
  settings    Json?
  createdAt   DateTime @default(now())

  // Relations
  users       User[]
  roles       Role[]
  groups      Group[]
}
```

#### RBAC & Permissions

```prisma
model Role {
  id              String   @id @default(uuid())
  name            String
  description     String?
  isSystem        Boolean  @default(false)
  permissions     Json     // Array de permissions

  // Relations
  organization    Organization? @relation(fields: [organizationId], references: [id])
  organizationId  String?
  userRoles       UserRole[]
  parentRoles     Role[]   @relation("RoleHierarchy")
  childRoles      Role[]   @relation("RoleHierarchy")
}

model UserRole {
  id        String   @id @default(uuid())
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  role      Role     @relation(fields: [roleId], references: [id])
  roleId    String
  grantedAt DateTime @default(now())
  grantedBy String?
  expiresAt DateTime?

  @@unique([userId, roleId])
}
```

#### OAuth & Applications

```prisma
model OAuthClient {
  id              String   @id @default(uuid())
  clientId        String   @unique
  clientSecret    String
  name            String
  redirectUris    String[]
  allowedScopes   String[]
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())

  // Relations
  tokens          OAuthToken[]
}

model OAuthToken {
  id            String      @id @default(uuid())
  accessToken   String      @unique
  refreshToken  String?     @unique
  tokenType     String      @default("Bearer")
  scope         String?
  expiresAt     DateTime

  // Relations
  client        OAuthClient @relation(fields: [clientId], references: [id])
  clientId      String
  user          User        @relation(fields: [userId], references: [id])
  userId        String
}
```

### Stratégies de stockage

- **HashiCorp Vault** : Secrets, clés de chiffrement
- **PostgreSQL** : Données métier
- **Redis** : Sessions, rate limiting, cache

---

## SDKs & Packages

### Structure (`@package/`)

```
package/
├── dart/                       # SDK Dart/Flutter
│   └── README.md
├── dotnet/                     # SDK .NET
│   └── README.md
├── drivers/                    # Drivers natifs
│   └── Cargo.toml
├── extension/                  # Extensions navigateur
│   └── package.json
├── gcc/                        # Support GCC
│   └── README.md
├── github/                     # Intégration GitHub
│   ├── github/                 # Client API GitHub
│   ├── identity/               # Auth Aether
│   ├── permissions/            # Gestion permissions
│   └── sync/                   # Synchronisation
├── java/                       # SDK Java
│   └── src/main/java/com/aetheridentity/sdk/
├── node/                       # SDK Node.js/TypeScript
│   └── tsconfig.json
├── php/                        # SDK PHP
│   └── README.md
├── scala/                      # SDK Scala
│   └── README.md
└── vscode/                     # Extension VSCode
    └── package.json
```

### SDK Node.js (`@package/node`)

```typescript
import { AetherClient } from "@aether-identity/node";

const client = new AetherClient({
  baseURL: "https://api.aether.io",
  apiKey: process.env.AETHER_API_KEY,
});

// Authentifier un utilisateur
const session = await client.auth.login({
  email: "user@example.com",
  password: "password",
});

// Vérifier les permissions
const hasAccess = await client.rbac.check({
  userId: session.user.id,
  resource: "documents",
  action: "read",
});

// Gérer les utilisateurs
const users = await client.users.list({
  organizationId: "org_123",
  limit: 50,
});
```

### SDK Java (`@package/java`)

```java
import com.aetheridentity.sdk.IdentityClient;
import com.aetheridentity.sdk.types.*;

public class Example {
    public static void main(String[] args) {
        IdentityClient client = new IdentityClient(
            IdentityClientConfig.builder()
                .baseUrl("https://api.aether.io")
                .apiKey(System.getenv("AETHER_API_KEY"))
                .build()
        );

        // Authentification
        AuthInput authInput = AuthInput.builder()
            .email("user@example.com")
            .password("password")
            .build();

        SessionResponse session = client.authModule().login(authInput);

        // Gestion des sessions
        DeviceInfo deviceInfo = DeviceInfo.builder()
            .deviceId("device-123")
            .deviceName("My Laptop")
            .build();

        client.sessionModule().registerDevice(session.getToken(), deviceInfo);
    }
}
```

### SDK Go (`@server/` comme référence)

Le SDK Go est intégré dans le backend et peut être utilisé comme référence pour créer des clients.

### Intégration GitHub (`@package/github`)

Package spécial pour synchronisation GitHub :

- **Teams Sync** : Synchronisation des équipes
- **Repositories Access** : Gestion des accès repos
- **Audit** : Traçabilité des actions
- **Webhooks** : Événements en temps réel

---

## Guide d'intégration

### 1. Intégration OAuth 2.0

```javascript
// 1. Redirection vers le serveur d'autorisation
const authorizeUrl = `https://auth.aether.io/oauth/authorize?
  response_type=code
  &client_id=${CLIENT_ID}
  &redirect_uri=${REDIRECT_URI}
  &scope=openid profile email
  &state=${STATE}`;

window.location.href = authorizeUrl;

// 2. Échange du code contre un token
const response = await fetch("https://auth.aether.io/oauth/token", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({
    grant_type: "authorization_code",
    code: AUTHORIZATION_CODE,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  }),
});

const tokens = await response.json();
```

### 2. Intégration SCIM

```bash
# Créer un utilisateur via SCIM
curl -X POST https://api.aether.io/scim/v2/Users \
  -H "Authorization: Bearer ${SCIM_TOKEN}" \
  -H "Content-Type: application/scim+json" \
  -d '{
    "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
    "userName": "john.doe@example.com",
    "name": {
      "givenName": "John",
      "familyName": "Doe"
    },
    "emails": [{
      "value": "john.doe@example.com",
      "primary": true
    }]
  }'
```

### 3. Webhooks

Configuration des webhooks pour recevoir des événements en temps réel :

```javascript
// Exemple de gestionnaire webhook
app.post("/webhooks/aether", (req, res) => {
  const signature = req.headers["x-aether-signature"];
  const payload = req.body;

  // Vérifier la signature
  const isValid = verifySignature(payload, signature, WEBHOOK_SECRET);

  if (!isValid) {
    return res.status(401).send("Unauthorized");
  }

  switch (payload.event) {
    case "user.created":
      handleUserCreated(payload.data);
      break;
    case "user.deleted":
      handleUserDeleted(payload.data);
      break;
    case "role.assigned":
      handleRoleAssigned(payload.data);
      break;
  }

  res.status(200).send("OK");
});
```

### 4. Domain-Based Auto-Provisioning

Configuration de règles de provisionnement automatique :

```yaml
# Configuration example
provisioning_rules:
  - domain: "company.com"
    template: "standard_employee"
    auto_assign:
      roles:
        - "employee_base"
      services:
        - "aether_mail"
        - "aether_meet"
        - "aether_drive"
  - domain: "partners.com"
    template: "external_user"
    auto_assign:
      roles:
        - "partner_limited"
      services:
        - "aether_meet"
    approval_required: true
```

---

## API Reference

### Endpoints principaux

#### Authentication

```
POST   /oauth/token              # Obtenir un token
POST   /oauth/revoke             # Révoquer un token
GET    /oauth/userinfo           # Informations utilisateur
POST   /auth/login               # Login direct
POST   /auth/logout              # Déconnexion
POST   /auth/refresh             # Rafraîchir le token
POST   /auth/totp/setup          # Configurer TOTP
POST   /auth/totp/verify         # Vérifier TOTP
```

#### Users

```
GET    /api/users                # Liste des utilisateurs
POST   /api/users                # Créer un utilisateur
GET    /api/users/:id            # Détails utilisateur
PUT    /api/users/:id            # Mettre à jour
DELETE /api/users/:id            # Supprimer
GET    /api/users/:id/sessions   # Sessions actives
DELETE /api/users/:id/sessions    # Révoquer toutes les sessions
```

#### Organizations

```
GET    /api/organizations        # Liste des organisations
POST   /api/organizations        # Créer une organisation
GET    /api/organizations/:id    # Détails organisation
PUT    /api/organizations/:id    # Mettre à jour
DELETE /api/organizations/:id    # Supprimer
GET    /api/organizations/:id/members  # Membres
```

#### RBAC

```
GET    /api/roles                # Liste des rôles
POST   /api/roles                # Créer un rôle
GET    /api/roles/:id            # Détails rôle
PUT    /api/roles/:id            # Mettre à jour
DELETE /api/roles/:id            # Supprimer
POST   /api/roles/:id/assign     # Assigner à un utilisateur
POST   /api/roles/:id/revoke     # Révoquer d'un utilisateur
```

#### SCIM

```
GET    /scim/v2/Users            # Liste utilisateurs SCIM
POST   /scim/v2/Users            # Créer utilisateur SCIM
GET    /scim/v2/Users/:id        # Détails utilisateur
PUT    /scim/v2/Users/:id        # Mettre à jour
DELETE /scim/v2/Users/:id        # Supprimer
GET    /scim/v2/Groups           # Liste groupes
POST   /scim/v2/Groups           # Créer groupe
```

### Codes d'erreur

| Code                       | Description                         |
| -------------------------- | ----------------------------------- |
| `invalid_request`          | Requête malformée                   |
| `invalid_client`           | Client OAuth invalide               |
| `invalid_grant`            | Grant invalide ou expiré            |
| `unauthorized_client`      | Client non autorisé                 |
| `unsupported_grant_type`   | Type de grant non supporté          |
| `invalid_scope`            | Scope demandé invalide              |
| `access_denied`            | Accès refusé                        |
| `server_error`             | Erreur serveur                      |
| `temporarily_unavailable`  | Service temporairement indisponible |
| `insufficient_permissions` | Permissions insuffisantes           |
| `rate_limit_exceeded`      | Taux de requêtes dépassé            |
| `resource_not_found`       | Ressource non trouvée               |
| `conflict`                 | Conflit (ex: email déjà utilisé)    |
| `validation_error`         | Erreur de validation                |

---

## Déploiement

### Docker Compose (Production)

```yaml
version: "3.8"
services:
  api:
    build:
      context: ./server
      dockerfile: Dockerfile
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/aether
      - REDIS_URL=redis://redis:6379
      - VAULT_ADDR=https://vault:8200
    ports:
      - "8080:8080"
    depends_on:
      - db
      - redis
      - vault

  web:
    build:
      context: ./app
      dockerfile: Dockerfile
    environment:
      - NEXT_PUBLIC_API_URL=https://api.aether.io
    ports:
      - "3000:3000"

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=aether
      - POSTGRES_USER=aether
      - POSTGRES_PASSWORD=secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  vault:
    image: hashicorp/vault:latest
    cap_add:
      - IPC_LOCK
    environment:
      - VAULT_DEV_ROOT_TOKEN_ID=dev-token

volumes:
  postgres_data:
  redis_data:
```

### Variables d'environnement

#### Backend (`server/.env`)

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/aether
DATABASE_MAX_CONNECTIONS=20

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_EXPIRY=7d

# OAuth
OAUTH_ISSUER_URL=https://auth.aether.io
OAUTH_AUTHORIZATION_ENDPOINT=/oauth/authorize
OAUTH_TOKEN_ENDPOINT=/oauth/token

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@aether.io
SMTP_PASSWORD=secure_smtp_password
EMAIL_FROM=Aether Identity <noreply@aether.io>

# Vault
VAULT_ADDR=https://vault.aether.io:8200
VAULT_TOKEN=your-vault-token
VAULT_MOUNT_PATH=secret

# Security
BCRYPT_COST=12
TOTP_ISSUER=Aether Identity
ALLOWED_ORIGINS=https://admin.aether.io,https://app.aether.io
RATE_LIMIT_REQUESTS_PER_MINUTE=100

# Monitoring
LOG_LEVEL=info
METRICS_ENABLED=true
TRACING_ENABLED=true
```

#### Frontend (`app/.env`)

```bash
# API
NEXT_PUBLIC_API_URL=https://api.aether.io
NEXT_PUBLIC_AUTH_URL=https://auth.aether.io

# App
NEXT_PUBLIC_APP_NAME=Aether Identity
NEXT_PUBLIC_APP_URL=https://admin.aether.io

# Features
NEXT_PUBLIC_MFA_ENABLED=true
NEXT_PUBLIC_OIDC_ENABLED=true
NEXT_PUBLIC_SCIM_ENABLED=true
```

---

## Sécurité

### Bonnes pratiques

1. **Authentification**
   - Toujours utiliser HTTPS en production
   - Activer MFA pour tous les comptes admin
   - Implémenter la rotation des clés JWT
   - Utiliser des tokens à durée de vie courte (access: 15min, refresh: 7j)

2. **Autorisation**
   - Principe du moindre privilège
   - RBAC avec revues régulières
   - Séparation des préoccupations (admin vs user)
   - Audit de toutes les actions sensibles

3. **Données**
   - Chiffrement au repos (AES-256)
   - Chiffrement en transit (TLS 1.3)
   - Hashage des mots de passe (bcrypt avec cost ≥ 12)
   - Secrets dans Vault, jamais en dur

4. **Infrastructure**
   - Réseaux isolés (Docker networks)
   - Firewalls restrictifs
   - Logs centralisés et immuables
   - Backups chiffrés et testés

5. **Développement**
   - Pas de secrets dans le code
   - Validation stricte des entrées
   - Protection contre injection SQL (Prisma)
   - Headers de sécurité (HSTS, CSP, etc.)

---

## Support

### Ressources

- **Documentation** : https://docs.aether.io
- **API Reference** : https://api.aether.io/docs
- **Status Page** : https://status.aether.io
- **Support** : support@aether.io

### Communauté

- **GitHub** : https://github.com/skygenesisenterprise/aether-identity
- **Discord** : https://discord.gg/aether-identity
- **Forum** : https://community.aether.io

### Contribution

1. Fork le repository
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

---

## Roadmap

### Q1 2026

- [x] Dashboard administrateur complet
- [x] Gestion utilisateurs avancée
- [x] MFA et authentification renforcée
- [x] Intégrations SCIM et Directory
- [ ] Analytics comportemental
- [ ] Mobile app (React Native)

### Q2 2026

- [ ] PAM (Privileged Access Management)
- [ ] DLP avancé
- [ ] Threat Intelligence intégré
- [ ] Machine Learning pour détection anomalie
- [ ] Vault dynamique pour secrets

### Q3 2026

- [ ] Fédération d'identités multi-cloud
- [ ] Certificats et PKI
- [ ] Biométrie avancée
- [ ] Audit automatisé et conformité continue

### Q4 2026

- [ ] IA pour recommandations sécurité
- [ ] Zero Trust Architecture complète
- [ ] Edge Computing pour auth distribuée
- [ ] Marketplace d'extensions

---

_Dernière mise à jour : 2026-02-10_
_Version : 2.0_
_Auteur : Sky Genesis Enterprise_
