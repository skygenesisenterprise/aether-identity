# 🔄 Redirection URL Dynamique - Aether Identity

## Vue d'ensemble

Aether Identity supporte maintenant les **redirections URL complètement dynamiques**, permettant aux applications clientes de choisir où rediriger les utilisateurs après authentification, exactement comme Google et Microsoft.

## 🏗️ Architecture de Redirection

### 3 Niveaux de Priorité

1. **`final_redirect_url`** (Priorité Maximale)
   - URL dynamique spécifiée par requête
   - Permet des redirections personnalisées par utilisateur/session
   - Idéal pour des workflows complexes

2. **`redirect_uri`** (Standard OAuth2)
   - URI de redirection standard OAuth2
   - Doit être pré-validée dans la configuration client
   - Sécurité maximale

3. **`defaultRedirectUrl`** (Fallback)
   - URL par défaut configurée dans l'application cliente
   - Utilisée si aucune autre URL n'est spécifiée
   - Configuration simple

## 📋 Cas d'Usage

### 1. Application Web Standard
```bash
# Redirection vers dashboard après auth
GET /api/v1/auth/authorize?
  client_id=client_xxx&
  redirect_uri=https://app.com/callback&
  response_type=code&
  final_redirect_url=https://app.com/dashboard
```

### 2. Application Multi-tenant
```bash
# Redirection vers le tenant spécifique
GET /api/v1/auth/authorize?
  client_id=client_xxx&
  redirect_uri=https://app.com/callback&
  final_redirect_url=https://tenant123.app.com/home
```

### 3. Workflow Personnalisé
```bash
# Redirection vers une page spécifique
GET /api/v1/auth/authorize?
  client_id=client_xxx&
  redirect_uri=https://app.com/callback&
  final_redirect_url=https://app.com/onboarding/step2?ref=special
```

### 4. Application Mobile
```bash
# Deep linking après auth
GET /api/v1/auth/authorize?
  client_id=client_xxx&
  redirect_uri=myapp://auth/callback&
  final_redirect_url=myapp://home/notifications
```

## 🔧 Configuration Client

### Enregistrement avec URL par défaut
```json
{
  "name": "Mon Application",
  "redirectUris": [
    "https://app.com/callback",
    "https://app.com/auth/callback"
  ],
  "defaultRedirectUrl": "https://app.com/dashboard",
  "allowedScopes": ["read", "write", "profile"]
}
```

### Mise à jour de l'URL par défaut
```bash
PUT /api/v1/clients/{id}
{
  "defaultRedirectUrl": "https://new-app.com/welcome"
}
```

## 🌐 Frontend Integration

### Parsing des Paramètres
```javascript
const urlParams = new URLSearchParams(window.location.search)
const redirect = urlParams.get('redirect_uri')
const finalRedirect = urlParams.get('final_redirect_url')
const client = urlParams.get('client_id')
const state = urlParams.get('state')
```

### Logique de Redirection
```javascript
// Priority: final_redirect_url > redirect_uri
const targetUrl = finalRedirect || redirect || defaultClientUrl

const redirectUrlWithCode = new URL(targetUrl)
redirectUrlWithCode.searchParams.set('code', authCode)
if (state) redirectUrlWithCode.searchParams.set('state', state)

window.location.href = redirectUrlWithCode.toString()
```

## 🔒 Sécurité

### Validation des URLs
- ✅ **Format validation** : Vérification du format URL
- ✅ **Allowed URIs** : `redirect_uri` doit être pré-autorisée
- ✅ **Dynamic validation** : `final_redirect_url` validée mais flexible
- ✅ **HTTPS support** : Support des URLs sécurisées
- ✅ **Localhost support** : URLs localhost pour développement

### Exemples de Validation
```javascript
// ✅ Valides
https://app.com/dashboard
http://localhost:3001/home
myapp://auth/callback
https://tenant.app.com/specific-page

// ❌ Invalides
javascript:alert('x')
file:///etc/passwd
// Domaines non-autorisés
```

## 📊 Monitoring

### Logs de Redirection
```json
{
  "timestamp": "2025-11-27T21:37:12Z",
  "clientId": "client_4b84ed0ceff8152c3ee2f67a7dccf136",
  "redirectUri": "http://localhost:3001/callback",
  "finalRedirectUrl": "http://localhost:3001/special-welcome",
  "userId": "user_123",
  "success": true
}
```

### Métriques
- 📈 Taux de redirection par type
- 🎯 URLs les plus utilisées
- 🔍 Erreurs de validation
- ⏱️ Temps de redirection moyen

## 🚀 Avantages

### Pour les Développeurs
- **Flexibilité maximale** : Redirections personnalisées
- **Workflows complexes** : Support des scénarios avancés
- **Multi-tenant** : Support des architectures multi-tenants
- **Mobile-friendly** : Deep linking support

### Pour les Utilisateurs
- **Expérience fluide** : Redirection directe vers la bonne page
- **Contexte préservé** : Maintien du contexte utilisateur
- **Moins de clics** : Navigation optimisée

### Pour la Sécurité
- **Contrôle total** : Validation stricte des URLs
- **Fallback sécurisé** : URL par défaut si problème
- **Audit complet** : Traçabilité des redirections

## 🔄 Comparaison avec Google/Microsoft

| Fonctionnalité | Aether Identity | Google | Microsoft |
|---|---|---|---|
| `redirect_uri` standard | ✅ | ✅ | ✅ |
| URL dynamique | ✅ | ❌ | ❌ |
| URL par défaut client | ✅ | ✅ | ✅ |
| Deep linking | ✅ | ✅ | ✅ |
| Multi-tenant | ✅ | ✅ | ✅ |
| Validation stricte | ✅ | ✅ | ✅ |

## 🎯 Conclusion

Aether Identity va **au-delà** des standards OAuth2 en offrant une **flexibilité de redirection supérieure** tout en maintenant une **sécurité maximale**. Les applications peuvent maintenant créer des expériences utilisateur vraiment personnalisées avec des redirections dynamiques adaptées à leurs besoins spécifiques.