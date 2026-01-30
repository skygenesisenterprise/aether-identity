package device

import (
	"context"
	"encoding/json"

	"github.com/skygenesisenterprise/aether-identity/errors"
	"github.com/skygenesisenterprise/aether-identity/http"
	"github.com/skygenesisenterprise/aether-identity/session"
	"github.com/skygenesisenterprise/aether-identity/types"
)

// Module handles device-related operations
type Module struct {
	transport *http.Transport
	session   *session.Manager
}

// NewModule creates a new device module
func NewModule(transport *http.Transport, sessionManager *session.Manager) *Module {
	return &Module{
		transport: transport,
		session:   sessionManager,
	}
}

// Detect retrieves a list of detected devices
func (m *Module) Detect(ctx context.Context) ([]types.DeviceInfo, error) {
	token, ok := m.session.GetAccessToken()
	if !ok || token == "" {
		return nil, errors.NewSessionExpiredError("", "")
	}

	resp, err := m.transport.Get(ctx, "/api/v1/devices", token)
	if err != nil {
		return nil, err
	}

	var devices []types.DeviceInfo
	if err := json.Unmarshal(resp, &devices); err != nil {
		return nil, err
	}

	return devices, nil
}

// Status retrieves the current device status
func (m *Module) Status(ctx context.Context) (*types.DeviceStatusResponse, error) {
	token, ok := m.session.GetAccessToken()
	if !ok || token == "" {
		return nil, errors.NewSessionExpiredError("", "")
	}

	resp, err := m.transport.Get(ctx, "/api/v1/devices/status", token)
	if err != nil {
		return nil, err
	}

	var status types.DeviceStatusResponse
	if err := json.Unmarshal(resp, &status); err != nil {
		return nil, err
	}

	return &status, nil
}
