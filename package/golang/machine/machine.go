package machine

import (
	"context"
	"encoding/json"

	"github.com/skygenesisenterprise/aether-identity/http"
	"github.com/skygenesisenterprise/aether-identity/types"
)

// Module handles machine enrollment and token operations
type Module struct {
	transport *http.Transport
	clientID  string
}

// NewModule creates a new machine module
func NewModule(transport *http.Transport, clientID string) *Module {
	return &Module{
		transport: transport,
		clientID:  clientID,
	}
}

// Enroll enrolls a new machine and returns enrollment credentials
func (m *Module) Enroll(ctx context.Context) (*types.MachineEnrollmentResponse, error) {
	payload := map[string]string{
		"clientId": m.clientID,
	}

	resp, err := m.transport.Post(ctx, "/api/v1/machine/enroll", payload, "")
	if err != nil {
		return nil, err
	}

	var enrollment types.MachineEnrollmentResponse
	if err := json.Unmarshal(resp, &enrollment); err != nil {
		return nil, err
	}

	return &enrollment, nil
}

// Token exchanges a machine secret for an access token
func (m *Module) Token(ctx context.Context, secret string) (*types.MachineTokenResponse, error) {
	payload := map[string]string{
		"grant_type":    "client_credentials",
		"client_id":     m.clientID,
		"client_secret": secret,
	}

	resp, err := m.transport.Post(ctx, "/oauth2/token", payload, "")
	if err != nil {
		return nil, err
	}

	var tokenResp types.MachineTokenResponse
	if err := json.Unmarshal(resp, &tokenResp); err != nil {
		return nil, err
	}

	return &tokenResp, nil
}

// Revoke revokes a machine's credentials
func (m *Module) Revoke(ctx context.Context, secret string) error {
	payload := map[string]string{
		"client_id":     m.clientID,
		"client_secret": secret,
	}

	_, err := m.transport.Post(ctx, "/oauth2/revoke", payload, "")
	return err
}
