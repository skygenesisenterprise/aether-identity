# Aether Vault CMD Architecture

## 🎯 Mission

Le dossier `cmd/` est le poste de pilotage d'Aether Vault - une console système interactive pour appliance Debian bootable.

## 🏗️ Architecture Complète

```
cmd/
├── vaultctl/                    # Binaire principal de la console
│   ├── main.go                  # Point d'entrée
│   ├── root.go                  # Commande racine Cobra
│   ├── config.go                # Configuration globale
│   └── version.go               # Version et build info
├── internal/                    # Packages internes (non importables)
│   ├── banner/                  # ASCII art & infos système
│   │   ├── banner.go
│   │   ├── system.go            # Infos système (hostname, kernel, etc.)
│   │   └── styles.go            # Couleurs et styles
│   ├── menu/                    # Menus interactifs
│   │   ├── manager.go           # Gestionnaire des menus
│   │   ├── renderer.go          # Rendu des menus
│   │   ├── navigation.go        # Navigation clavier
│   │   └── types.go             # Types de menus
│   ├── actions/                 # Actions exécutables
│   │   ├── system/              # Actions système
│   │   │   ├── status.go        # État du système
│   │   │   ├── shutdown.go      # Arrêt/redémarrage
│   │   │   └── info.go          # Informations détaillées
│   │   ├── services/            # Gestion des services
│   │   │   ├── manager.go       # Manager systemd
│   │   │   ├── list.go          # Lister les services
│   │   │   ├── control.go       # Start/stop/restart
│   │   │   └── logs.go          # Visualisation des logs
│   │   ├── network/             # Configuration réseau
│   │   │   ├── interfaces.go    # Gestion des interfaces
│   │   │   ├── firewall.go      # Règles firewall
│   │   │   └── diagnostics.go   # Tests réseau
│   │   ├── security/            # Sécurité
│   │   │   ├── users.go         # Gestion utilisateurs
│   │   │   ├── certificates.go  # Certificats SSL/TLS
│   │   │   └── audit.go         # Logs d'audit
│   │   ├── maintenance/         # Maintenance
│   │   │   ├── backup.go        # Backups
│   │   │   ├── update.go        # Mises à jour
│   │   │   └── cleanup.go       # Nettoyage
│   │   └── vault/               # Interaction avec Vault Core
│   │       ├── status.go        # État de Vault
│   │       ├── tokens.go        # Gestion tokens
│   │       └── seal.go          # Scellement/déscellement
│   ├── context/                 # État global de la session
│   │   ├── session.go           # Session utilisateur
│   │   ├── permissions.go       # Gestion des permissions
│   │   └── environment.go       # Variables d'environnement
│   ├── ui/                      # Rendering CLI
│   │   ├── components/          # Composants UI réutilisables
│   │   │   ├── table.go         # Tables formatées
│   │   │   ├── progress.go      # Barres de progression
│   │   │   ├── modal.go         # Modales et confirmations
│   │   │   └── input.go         # Champs de saisie
│   │   ├── theme/               # Thèmes et couleurs
│   │   │   ├── colors.go        # Palette de couleurs
│   │   │   └── icons.go         # Icônes ASCII/Unicode
│   │   └── layout/              # Mise en page
│   │       ├── screen.go        # Gestion d'écran
│   │       └── responsive.go    # Adaptation taille terminal
│   ├── auth/                    # Authentification locale
│   │   ├── authenticator.go     # Interface d'auth
│   │   ├── pam.go               # Intégration PAM
│   │   ├── ssh.go               # Support SSH
│   │   └── session.go           # Gestion de session
│   ├── config/                  # Configuration CLI
│   │   ├── loader.go            # Chargement config
│   │   ├── validator.go         # Validation config
│   │   └── defaults.go          # Valeurs par défaut
│   └── utils/                   # Utilitaires
│       ├── systemd.go           # Interface systemd
│       ├── file.go              # Opérations fichiers
│       ├── network.go           # Utilitaires réseau
│       └── crypto.go            # Opérations crypto
├── pkg/                         # Packages publics réutilisables
│   ├── client/                  # Client Vault Core
│   │   ├── client.go
│   │   └── types.go
│   └── types/                   # Types partagés
│       └── common.go
├── scripts/                     # Scripts système
│   ├── install.sh               # Installation binaire
│   ├── service.sh               # Service systemd
│   └── uninstall.sh             # Désinstallation
├── configs/                     # Fichiers de config
│   ├── default.yaml             # Configuration par défaut
│   └── development.yaml         # Config développement
├── docs/                        # Documentation
│   ├── API.md                   # Documentation API interne
│   ├── DEVELOPMENT.md           # Guide dev
│   └── DEPLOYMENT.md            # Guide déploiement
├── tests/                       # Tests
│   ├── unit/                    # Tests unitaires
│   ├── integration/            # Tests d'intégration
│   └── e2e/                     # Tests end-to-end
├── go.mod
├── go.sum
├── Makefile                     # Build et déploiement
└── README.md
```

## 🎨 Philosophie de Design

### 1. Séparation des Responsabilités

- **UI**: `internal/ui/` - Rendu et interaction
- **Logique**: `internal/actions/` - Actions métier
- **État**: `internal/context/` - Gestion de session
- **Système**: `internal/utils/` - Interface avec le système

### 2. Extensibilité

- Pattern **Plugin** pour les actions
- Interface **Menu** pour les nouveaux menus
- Système de **thèmes** pour l'apparence

### 3. Sécurité

- Authentification **PAM** locale
- Permissions **granulaires**
- Pas de secrets en clair
- Mode **lecture seule** disponible

## 🔧 Interfaces Clés

### Menu Interface

```go
type Menu interface {
    Title() string
    Options() []Option
    Execute(option int) error
    Back() Menu
}
```

### Action Interface

```go
type Action interface {
    Name() string
    Description() string
    Execute(ctx context.Context, args []string) error
    Validate(args []string) error
}
```

### Auth Interface

```go
type Authenticator interface {
    Authenticate(username, password string) (*Session, error)
    Authorize(session *Session, action string) bool
    Logout(session *Session) error
}
```

## 🚀 Cycle de Vie d'une Session

1. **Connexion** (TTY/SSH) → `auth/`
2. **Banner** système → `banner/`
3. **Menu** principal → `menu/`
4. **Action** sélectionnée → `actions/`
5. **Rendu** résultat → `ui/`
6. **Retour** au menu → boucle

## 📦 Dépendances Actuelles

- **gin-gonic/gin**: API HTTP (si besoin)
- **golang-jwt/jwt/v5**: Tokens JWT
- **google/uuid**: Identifiants uniques
- **joho/godotenv**: Variables d'environnement
- **spf13/viper**: Configuration
- **golang.org/x/crypto**: Crypto
- **gorm.io/gorm**: Base de données (si besoin)

## 🎯 Use Types Cibles

### 1. **Appliance ISO**

- Boot direct sur console
- Configuration initiale
- Mode recovery

### 2. **VM**

- Administration via SSH
- Monitoring des services
- Backups automatiques

### 3. **Bare-metal**

- Gestion complète système
- Performance monitoring
- Sécurité renforcée

## 🔮 Évolution Long Terme

### Phase 1: Socle CLI

- Menu interactif
- Actions système basiques
- Authentification locale

### Phase 2: Advanced Features

- Thèmes personnalisables
- Plugins externes
- API REST interne

### Phase 3: Enterprise

- Multi-utilisateurs
- RBAC avancé
- Intégration monitoring

## 🚨 Contraintes et Limites

- **Local uniquement** (pas d'exposition réseau)
- **Pas de logique métier** Vault dans cmd/
- **Compatibilité** systemd obligatoire
- **Testabilité** sans environnement complet

## 🧪 Tests

### Unit Tests

- `tests/unit/` - Tests isolés des composants
- Mock des interfaces système

### Integration Tests

- `tests/integration/` - Tests avec vrais services
- Conteneurs Docker isolés

### E2E Tests

- `tests/e2e/` - Scénarios utilisateur complets
- Machines virtuelles légères

Cette architecture positionne `cmd/` comme le véritable poste de pilotage d'Aether Vault, offrant une expérience d'administration locale sécurisée et intuitive.
