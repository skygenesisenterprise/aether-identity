package auth

import (
	"context"
	"encoding/json"

	"github.com/skygenesisenterprise/aether-identity/errors"
	"github.com/skygenesisenterprise/aether-identity/http"
	"github.com/skygenesisenterprise/aether-identity/session"
	"github.com/skygenesisenterprise/aether-identity/types"
)

// Module handles authentication operations
type Module struct {
	transport *http.Transport
	session   *session.Manager
}

// NewModule creates a new auth module
func NewModule(transport *http.Transport, sessionManager *session.Manager) *Module {
	return &Module{
		transport: transport,
		session:   sessionManager,
	}
}

// Login authenticates a user with email and password
func (m *Module) Login(ctx context.Context, input types.AuthInput) error {
	payload := map[string]string{
		"email":    input.Email,
		"password": input.Password,
	}

	if input.TOTPCode != "" {
		payload["totpCode"] = input.TOTPCode
	}

	resp, err := m.transport.Post(ctx, "/api/v1/auth/login", payload, "")
	if err != nil {
		return err
	}

	var tokenResp types.TokenResponse
	if err := json.Unmarshal(resp, &tokenResp); err != nil {
		return errors.NewIdentityError("failed to parse token response", errors.ErrInvalidInput, "")
	}

	m.session.SetTokens(tokenResp)
	return nil
}

// Logout ends the current session
func (m *Module) Logout(ctx context.Context) error {
	token, ok := m.session.GetAccessToken()
	if ok && token != "" {
		// Attempt to notify server, but ignore errors
		_, _ = m.transport.Post(ctx, "/api/v1/auth/logout", nil, token)
	}

	m.session.Clear()
	return nil
}

// Strengthen strengthens the authentication with additional factors
func (m *Module) Strengthen(ctx context.Context, input types.StrengthenInput) error {
	token, ok := m.session.GetAccessToken()
	if !ok || token == "" {
		return errors.NewSessionExpiredError("", "")
	}

	payload := map[string]string{
		"type": input.Type,
	}

	if input.Value != "" {
		payload["value"] = input.Value
	}

	_, err := m.transport.Post(ctx, "/api/v1/auth/strengthen", payload, token)
	return err
}
