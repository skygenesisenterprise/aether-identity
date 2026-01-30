package eid

import (
	"context"
	"encoding/json"

	"github.com/skygenesisenterprise/aether-identity/errors"
	"github.com/skygenesisenterprise/aether-identity/http"
	"github.com/skygenesisenterprise/aether-identity/session"
	"github.com/skygenesisenterprise/aether-identity/types"
)

// Module handles EID (Electronic Identity) operations
type Module struct {
	transport *http.Transport
	session   *session.Manager
}

// NewModule creates a new EID module
func NewModule(transport *http.Transport, sessionManager *session.Manager) *Module {
	return &Module{
		transport: transport,
		session:   sessionManager,
	}
}

// Verify submits EID verification data
func (m *Module) Verify(ctx context.Context, input types.EIDVerifyInput) error {
	token, ok := m.session.GetAccessToken()
	if !ok || token == "" {
		return errors.NewSessionExpiredError("", "")
	}

	_, err := m.transport.Post(ctx, "/api/v1/eid/verify", input, token)
	return err
}

// Status retrieves the EID verification status
func (m *Module) Status(ctx context.Context) (*types.EIDStatusResponse, error) {
	token, ok := m.session.GetAccessToken()
	if !ok || token == "" {
		return nil, errors.NewSessionExpiredError("", "")
	}

	resp, err := m.transport.Get(ctx, "/api/v1/eid/status", token)
	if err != nil {
		return nil, err
	}

	var status types.EIDStatusResponse
	if err := json.Unmarshal(resp, &status); err != nil {
		return nil, err
	}

	return &status, nil
}

// Revoke revokes the EID verification
func (m *Module) Revoke(ctx context.Context) error {
	token, ok := m.session.GetAccessToken()
	if !ok || token == "" {
		return errors.NewSessionExpiredError("", "")
	}

	_, err := m.transport.Post(ctx, "/api/v1/eid/revoke", nil, token)
	return err
}
