package sessionmodule

import (
	"context"
	"encoding/json"

	"github.com/skygenesisenterprise/aether-identity/http"
	"github.com/skygenesisenterprise/aether-identity/session"
	"github.com/skygenesisenterprise/aether-identity/types"
)

// Module handles session operations
// Note: This package is named sessionmodule to avoid conflict with the session package
type Module struct {
	transport *http.Transport
	session   *session.Manager
}

// NewModule creates a new session module
func NewModule(transport *http.Transport, sessionManager *session.Manager) *Module {
	return &Module{
		transport: transport,
		session:   sessionManager,
	}
}

// Current retrieves the current session information
func (m *Module) Current(ctx context.Context) (*types.SessionResponse, error) {
	token, ok := m.session.GetAccessToken()
	if !ok || !m.session.IsAuthenticated() {
		return &types.SessionResponse{
			IsAuthenticated: false,
		}, nil
	}

	resp, err := m.transport.Get(ctx, "/api/v1/userinfo", token)
	if err != nil {
		return nil, err
	}

	var user types.UserProfile
	if err := json.Unmarshal(resp, &user); err != nil {
		return nil, err
	}

	expiresAt, _ := m.session.GetExpiresAt()

	return &types.SessionResponse{
		IsAuthenticated: true,
		User:            &user,
		ExpiresAt:       &expiresAt,
	}, nil
}

// IsAuthenticated checks if the user is currently authenticated
func (m *Module) IsAuthenticated() bool {
	return m.session.IsAuthenticated()
}
