package context

import (
	"github.com/skygenesisenterprise/aether-vault/cmd/internal/config"
)

// Context représente l'état global de la session
type Context struct {
	Config     *config.Config
	Session    *Session
	Permission *Permission
}

// Session contient les informations de session utilisateur
type Session struct {
	User      string
	TTY       string
	StartTime int64
	IsRoot    bool
}

// Permission gère les permissions utilisateur
type Permission struct {
	ReadOnly bool
	Level    string // "admin", "user", "readonly"
}

// New crée un nouveau contexte
func New(cfg *config.Config) *Context {
	return &Context{
		Config:     cfg,
		Session:    NewSession(),
		Permission: NewPermission(),
	}
}

// NewSession crée une nouvelle session
func NewSession() *Session {
	return &Session{
		User:      getCurrentUser(),
		TTY:       getCurrentTTY(),
		StartTime: getCurrentTime(),
		IsRoot:    isRoot(),
	}
}

// NewPermission crée un nouveau gestionnaire de permissions
func NewPermission() *Permission {
	return &Permission{
		ReadOnly: false,
		Level:    getPermissionLevel(),
	}
}
