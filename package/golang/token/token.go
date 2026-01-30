package token

import (
	"context"
	"encoding/json"

	"github.com/skygenesisenterprise/aether-identity/errors"
	"github.com/skygenesisenterprise/aether-identity/http"
	"github.com/skygenesisenterprise/aether-identity/session"
	"github.com/skygenesisenterprise/aether-identity/types"
)

// Module handles token operations
type Module struct {
	transport *http.Transport
	session   *session.Manager
}

// NewModule creates a new token module
func NewModule(transport *http.Transport, sessionManager *session.Manager) *Module {
	return &Module{
		transport: transport,
		session:   sessionManager,
	}
}

// Refresh refreshes the access token using the refresh token
func (m *Module) Refresh(ctx context.Context) error {
	refreshToken, ok := m.session.GetRefreshToken()
	if !ok || refreshToken == "" {
		return errors.NewSessionExpiredError("", "")
	}

	payload := map[string]string{
		"refreshToken": refreshToken,
	}

	resp, err := m.transport.Post(ctx, "/api/v1/auth/refresh", payload, "")
	if err != nil {
		return err
	}

	var tokenResp types.TokenResponse
	if err := json.Unmarshal(resp, &tokenResp); err != nil {
		return err
	}

	m.session.SetAccessToken(tokenResp.AccessToken, tokenResp.ExpiresIn)
	return nil
}

// Revoke revokes the current token
func (m *Module) Revoke(ctx context.Context) error {
	token, ok := m.session.GetAccessToken()
	if !ok || token == "" {
		return nil
	}

	// Attempt to revoke on server, but ignore errors
	_, _ = m.transport.Post(ctx, "/api/v1/auth/token/revoke", nil, token)

	m.session.Clear()
	return nil
}
