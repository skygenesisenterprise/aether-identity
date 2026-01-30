package session

import (
	"strconv"
	"sync"
	"time"

	"github.com/skygenesisenterprise/aether-identity/storage"
	"github.com/skygenesisenterprise/aether-identity/types"
)

// Manager handles session and token management
type Manager struct {
	storage storage.Storage
	mu      sync.RWMutex
}

// NewManager creates a new session manager
func NewManager(s storage.Storage) *Manager {
	if s == nil {
		s = storage.NewMemoryStorage()
	}
	return &Manager{
		storage: s,
	}
}

// SetTokens stores the access and refresh tokens
func (m *Manager) SetTokens(tokens types.TokenResponse) {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.storage.Set(storage.AccessTokenKey, tokens.AccessToken)
	m.storage.Set(storage.RefreshTokenKey, tokens.RefreshToken)
	expiresAt := time.Now().Unix() + int64(tokens.ExpiresIn)
	m.storage.Set(storage.ExpiresAtKey, strconv.FormatInt(expiresAt, 10))
}

// GetAccessToken retrieves the access token
func (m *Manager) GetAccessToken() (string, bool) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	return m.storage.Get(storage.AccessTokenKey)
}

// GetRefreshToken retrieves the refresh token
func (m *Manager) GetRefreshToken() (string, bool) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	return m.storage.Get(storage.RefreshTokenKey)
}

// GetExpiresAt retrieves the expiration timestamp
func (m *Manager) GetExpiresAt() (int64, bool) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	val, ok := m.storage.Get(storage.ExpiresAtKey)
	if !ok || val == "" {
		return 0, false
	}

	expiresAt, err := strconv.ParseInt(val, 10, 64)
	if err != nil {
		return 0, false
	}
	return expiresAt, true
}

// IsAuthenticated checks if the session is valid and not expired
func (m *Manager) IsAuthenticated() bool {
	m.mu.RLock()
	defer m.mu.RUnlock()

	expiresAt, ok := m.GetExpiresAt()
	if !ok {
		return false
	}

	return time.Now().Unix() < expiresAt
}

// IsTokenRefreshing always returns false (for compatibility with Node SDK)
func (m *Manager) IsTokenRefreshing() bool {
	return false
}

// SetAccessToken stores a new access token with expiration
func (m *Manager) SetAccessToken(token string, expiresIn int) {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.storage.Set(storage.AccessTokenKey, token)
	expiresAt := time.Now().Unix() + int64(expiresIn)
	m.storage.Set(storage.ExpiresAtKey, strconv.FormatInt(expiresAt, 10))
}

// SetToken stores a token with a default 1-hour expiration
func (m *Manager) SetToken(token string) {
	m.SetAccessToken(token, 3600)
}

// Clear removes all session data
func (m *Manager) Clear() {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.storage.Delete(storage.AccessTokenKey)
	m.storage.Delete(storage.RefreshTokenKey)
	m.storage.Delete(storage.ExpiresAtKey)
}
