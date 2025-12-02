# Aether Identity - Service d'Authentification Centralisé

## Vue d'ensemble

Aether Identity est un service d'authentification centralisé (Identity Provider) qui permet aux applications externes d'implémenter facilement l'authentification unique (SSO) via le protocole OAuth2.

## Architecture Dynamique

Le système est conçu pour être **agnostique** et s'adapter à n'importe quelle application cliente :

### 1. Applications Clientes Dynamiques

Chaque application peut s'enregistrer et définir :
- **URIs de redirection personnalisées** : URLs où les utilisateurs sont redirigés après authentification
- **Scopes personnalisés** : Permissions spécifiques à l'application
- **Apparence personnalisée** : Logo, nom, couleurs
- **Flux de consentement** : Optionnel ou obligatoire selon les besoins

### 2. Flux d'Authentification

#### Étape 1: Enregistrement de l'Application
```bash
POST /api/v1/clients
{
  "name": "Mon Application",
  "redirectUris": ["https://monapp.com/callback", "https://monapp.com/auth/callback"],
  "allowedScopes": ["read", "write", "profile", "email"],
  "defaultScopes": ["read", "profile"],
  "skipConsent": false,
  "logoUrl": "https://monapp.com/logo.png",
  "homepageUrl": "https://monapp.com"
}
```

#### Étape 2: Lancement du Flux OAuth2
L'application cliente redirige l'utilisateur vers :
```
GET /api/v1/auth/authorize?
  client_id=client_xxx&
  redirect_uri=https://monapp.com/callback&
  response_type=code&
  state=xyz123&
  scope=read profile
```

#### Étape 3: Validation Dynamique
Aether Identity vérifie :
- ✅ Client ID valide et actif
- ✅ URI de redirection autorisée pour ce client
- ✅ Scopes demandés autorisés pour ce client
- ✅ Création d'une session d'autorisation

#### Étape 4: Page de Login Personnalisée
L'utilisateur voit une page de login avec :
- 🎨 Logo et nom de l'application cliente
- 📝 Message contextuel : "Connectez-vous pour continuer à Mon Application"
- 🔒 Options de consentement selon configuration

#### Étape 5: Redirection Personnalisée
Après authentification, l'utilisateur est redirigé vers :
```
https://monapp.com/callback?
  code=auth_code_xxx&
  state=xyz123
```

#### Étape 6: Échange de Token
L'application cliente échange le code contre des tokens :
```bash
POST /api/v1/auth/token
{
  "grant_type": "authorization_code",
  "code": "auth_code_xxx",
  "client_id": "client_xxx",
  "client_secret": "secret_xxx",
  "redirect_uri": "https://monapp.com/callback"
}
```

## Cas d'Usage

### 1. Application Web Traditionnelle
- **Redirect URIs**: `https://app.com/callback`
- **Scopes**: `['read', 'write', 'profile']`
- **Consentement**: Obligatoire

### 2. Application Mobile
- **Redirect URIs**: `['myapp://auth/callback']`
- **Scopes**: `['profile', 'email']`
- **Consentement**: Optionnel (deep linking)

### 3. Service API
- **Redirect URIs**: `['https://api.service.com/oauth/callback']`
- **Scopes**: `['api:read', 'api:write']`
- **Consentement**: Désactivé (service-to-service)

### 4. Microservices
- **Redirect URIs**: `['http://localhost:8081/callback']` (développement)
- **Scopes**: `['service:access']`
- **Consentement**: Désactivé

## API Tokens (sk_ prefix)

Pour les communications service-to-service :

### Création d'un Token API
```bash
POST /api/v1/api-tokens
{
  "name": "Production Service Token",
  "permissions": ["users:read", "accounts:write"],
  "expiresAt": "2025-12-31T23:59:59Z"
}
```

### Utilisation
```bash
curl -H "Authorization: Bearer sk_7aec907b4dd613791ce9331f6c07838d67da96f3849d35b4888c2cea6e9ef4ac" \
  https://sso.skygenesisenterprise.net/api/v1/api/user
```

## Sécurité

### Validation des URIs
- Seules les URIs pré-enregistrées sont acceptées
- Support des URLs localhost pour le développement
- Validation stricte du format

### Gestion des Tokens
- Tokens JWT avec expiration configurable
- Refresh tokens rotation
- API tokens avec préfixe `sk_`
- Révocation instantanée possible

### PKCE Support
- Support de Proof Key for Code Exchange
- Obligatoire pour les applications mobiles/public

## Configuration

### Variables d'Environnement
```bash
FRONTEND_URL=http://localhost:3000
DATABASE_URL=file:./prisma/dev.db
JWT_SECRET=votre-secret
JWT_EXPIRES_IN=24h
```

### Scopes Disponibles
- `read` : Lecture des données de base
- `write` : Modification des données
- `profile` : Accès au profil utilisateur
- `email` : Accès à l'email
- `admin` : Accès administrateur

## Exemples d'Intégration

### JavaScript (Frontend)
```javascript
// Redirection vers Aether Identity
const authUrl = new URL('https://identity.aether.com/api/v1/auth/authorize');
authUrl.searchParams.set('client_id', 'client_xxx');
authUrl.searchParams.set('redirect_uri', 'https://monapp.com/callback');
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('state', generateState());

window.location.href = authUrl.toString();
```

### Node.js (Backend)
```javascript
// Échange du code contre des tokens
const response = await fetch('https://identity.aether.com/api/v1/auth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    grant_type: 'authorization_code',
    code: authCode,
    client_id: 'client_xxx',
    client_secret: 'secret_xxx',
    redirect_uri: 'https://monapp.com/callback'
  })
});

const { access_token, refresh_token } = await response.json();
```

### Python (Backend)
```python
import requests

# Échange du code contre des tokens
response = requests.post('https://identity.aether.com/api/v1/auth/token', json={
    'grant_type': 'authorization_code',
    'code': auth_code,
    'client_id': 'client_xxx',
    'client_secret': 'secret_xxx',
    'redirect_uri': 'https://monapp.com/callback'
})

tokens = response.json()
access_token = tokens['access_token']
```

## Monitoring

### Endpoints de Santé
- `/health` : État général du service
- `/api/v1/auth/userinfo` : Validation de tokens
- `/api/v1/api/verify` : Validation des API tokens

### Logs
- Tentatives d'authentification
- Création/rotation de tokens
- Erreurs de validation

## Support

Pour toute question ou problème d'intégration :
- 📧 Email : support@aether-identity.com
- 📚 Documentation : https://docs.aether-identity.com
- 🐛 Issues : https://github.com/aether/identity/issues