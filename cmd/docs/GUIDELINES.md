# Guidelines d'Architecture - Aether Vault CMD

## 🎯 Principes Fondamentaux

### 1. **Séparation des Responsabilités**

Chaque package a une responsabilité claire et unique :

- `banner/` - Affichage uniquement
- `menu/` - Navigation et interaction utilisateur
- `actions/` - Logique métier et exécution
- `context/` - État global de la session
- `ui/` - Composants visuels réutilisables
- `auth/` - Authentification et autorisation
- `config/` - Configuration de l'application
- `utils/` - Utilitaires système

### 2. **Architecture en Couches**

```
UI (menu/) → Context (context/) → Actions (actions/) → System (utils/)
```

### 3. **Interfaces First**

Toutes les interactions entre packages se font via des interfaces :

- `Menu` interface pour les menus
- `Action` interface pour les actions
- `Authenticator` interface pour l'authentification

## 🔧 Patterns d'Extension

### Ajouter un Nouveau Menu

```go
// 1. Implémenter l'interface Menu
type NewMenu struct {
    ctx    *context.Context
    colors *theme.Colors
}

func (m *NewMenu) Title() string { return "Nouveau Menu" }
func (m *NewMenu) Options() []types.Option { /* ... */ }
func (m *NewMenu) Execute(option int) error { /* ... */ }
func (m *NewMenu) Back() types.Menu { /* ... */ }

// 2. Ajouter au menu principal
func (m *Manager) handleMainMenuChoice(choice string) error {
    switch choice {
    // ...
    case "9":
        return m.showNewMenu()
    // ...
    }
}
```

### Ajouter une Nouvelle Action

```go
// 1. Implémenter l'interface Action
type NewAction struct{}

func (a *NewAction) Name() string { return "new-action" }
func (a *NewAction) Description() string { return "Description" }
func (a *NewAction) Execute(ctx interface{}, args []string) error { /* ... */ }
func (a *NewAction) Validate(args []string) error { /* ... */ }
func (a *NewAction) RequiresAuth() bool { return true }

// 2. Enregistrer dans le menu approprié
func (m *Manager) showNewMenu() error {
    // Créer et exécuter l'action
}
```

### Ajouter un Nouveau Thème

```go
// 1. Créer une nouvelle palette
func GetDarkTheme() *theme.Colors {
    return &theme.Colors{
        Reset:   "\033[0m",
        Border:  "\033[37m",    // Blanc
        Header:  "\033[35m",    // Magenta
        // ...
    }
}

// 2. Ajouter un sélecteur de thème
func (m *Manager) setTheme(themeName string) {
    switch themeName {
    case "dark":
        m.colors = theme.GetDarkTheme()
    default:
        m.colors = theme.GetColors()
    }
}
```

## 📦 Structure des Packages

### Packages Internes (`internal/`)

Ces packages ne sont pas importables de l'extérieur :

- Encapsulent la logique métier
- Peuvent changer sans impact externe
- Sont testables unitairement

### Packages Publics (`pkg/`)

Ces packages sont réutilisables :

- API stable
- Documentation complète
- Versioning sémantique

## 🧪 Guidelines de Test

### Tests Unitaires

```go
// tests/unit/menu_test.go
func TestMenuManager_GetUserInput(t *testing.T) {
    // Mock du reader
    reader := strings.NewReader("1\n")
    manager := &Manager{reader: reader}

    input, err := manager.getUserInput()
    assert.NoError(t, err)
    assert.Equal(t, "1", input)
}
```

### Tests d'Intégration

```go
// tests/integration/systemd_test.go
func TestSystemdManager_ListServices(t *testing.T) {
    if testing.Short() {
        t.Skip("Skipping integration test")
    }

    manager := NewSystemdManager()
    services, err := manager.ListServices()
    assert.NoError(t, err)
    assert.NotEmpty(t, services)
}
```

### Tests E2E

```go
// tests/e2e/console_test.go
func TestConsole_MainMenu(t *testing.T) {
    // Utiliser une machine virtuelle légère
    // Tester le flux utilisateur complet
}
```

## 🔐 Guidelines de Sécurité

### 1. **Validation des Entrées**

Toutes les entrées utilisateur doivent être validées :

```go
func (m *Manager) validateChoice(choice string) error {
    if choice == "" {
        return errors.New("choix requis")
    }
    if !regexp.MustCompile(`^[0-9]+$`).MatchString(choice) {
        return errors.New("choix invalide")
    }
    return nil
}
```

### 2. **Permissions Explicites**

Chaque action vérifie les permissions :

```go
func (a *SensitiveAction) Execute(ctx interface{}, args []string) error {
    session := ctx.(*context.Context).Session
    if !session.IsRoot {
        return errors.New("action non autorisée")
    }
    // ...
}
```

### 3. **Pas de Secrets en Clair**

Utiliser des références indirectes :

```go
// ❌ À ne pas faire
fmt.Println("Token:", token)

// ✅ À faire
fmt.Println("Token configuré")
```

## 🎨 Guidelines UI/CLI

### 1. **Cohérence Visuelle**

- Utiliser la palette de couleurs définie
- Maintenir l'alignement des bordures
- Standardiser les icônes et symboles

### 2. **Accessibilité**

- Codes couleur clairs (pas uniquement sur la couleur)
- Messages d'erreur explicites
- Navigation au clavier uniquement

### 3. **Performance**

- Limiter les rafraîchissements d'écran
- Utiliser le buffering pour les gros outputs
- Prévoir l'interruption (Ctrl+C)

## 🔄 Gestion des Erreurs

### Pattern d'Erreur

```go
// 1. Définir des erreurs spécifiques
var (
    ErrServiceNotFound = errors.New("service non trouvé")
    ErrPermissionDenied = errors.New("permission refusée")
)

// 2. Wraper les erreurs avec contexte
func (sm *SystemdManager) StartService(service string) error {
    cmd := exec.Command("systemctl", "start", service)
    if err := cmd.Run(); err != nil {
        return fmt.Errorf("démarrage service %s: %w", service, err)
    }
    return nil
}

// 3. Gérer les erreurs au niveau UI
func (m *Manager) handleMainMenuChoice(choice string) error {
    if err := m.executeChoice(choice); err != nil {
        fmt.Printf("%sErreur: %v%s\n", m.colors.Error, err, m.colors.Reset)
        return err // Retourner l'erreur pour logging
    }
    return nil
}
```

## 📝 Guidelines de Documentation

### 1. **Code Documentation**

```go
// SystemdManager gère les interactions avec systemd.
// Il fournit une interface de haut niveau pour les opérations courantes.
type SystemdManager struct{}

// ListServices retourne la liste de tous les services systemd actifs.
// Retourne une erreur si la commande systemctl échoue.
func (sm *SystemdManager) ListServices() ([]string, error) {
    // ...
}
```

### 2. **README par Package**

Chaque package doit avoir un README.md expliquant :

- Son rôle et responsabilités
- Comment l'utiliser
- Exemples de code
- Dépendances

### 3. **Documentation API**

Pour les packages publics (`pkg/`) :

- Documentation complète des interfaces
- Exemples d'utilisation
- Changelog

## 🚀 Guidelines de Déploiement

### 1. **Build**

```bash
# Production
make build

# Développement
make dev

# Docker
make docker-build
```

### 2. **Installation**

```bash
# Installation système
sudo make install

# Service systemd
sudo systemctl enable vaultctl
sudo systemctl start vaultctl
```

### 3. **Configuration**

- Fichiers de config dans `/etc/vaultctl/`
- Logs dans `/var/log/vaultctl.log`
- Binaire dans `/usr/local/bin/vaultctl`

## 🧭 Guidelines d'Évolution

### Phase 1: Socle (v1.0)

- Menu interactif basique
- Actions système essentielles
- Authentification locale

### Phase 2: Avancé (v2.0)

- Plugins externes
- Thèmes personnalisables
- API REST interne

### Phase 3: Enterprise (v3.0)

- Multi-utilisateurs avancé
- RBAC complet
- Monitoring intégré

## 📋 Checklist de Review

### Code Review

- [ ] Séparation des responsabilités respectée
- [ ] Interfaces utilisées correctement
- [ ] Erreurs gérées proprement
- [ ] Sécurité vérifiée
- [ ] Tests présents
- [ ] Documentation à jour

### Architecture Review

- [ ] Cohérence avec l'existant
- [ ] Extensibilité assurée
- [ ] Performance acceptable
- [ ] Maintenabilité garantie

Ces guidelines assurent que l'architecture reste cohérente, sécurisée et évolutive tout au long du développement d'Aether Vault CMD.
