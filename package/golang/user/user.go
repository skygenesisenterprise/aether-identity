package user

import (
	"context"
	"encoding/json"

	"github.com/skygenesisenterprise/aether-identity/errors"
	"github.com/skygenesisenterprise/aether-identity/http"
	"github.com/skygenesisenterprise/aether-identity/session"
	"github.com/skygenesisenterprise/aether-identity/types"
)

// Module handles user-related operations
type Module struct {
	transport *http.Transport
	session   *session.Manager
}

// NewModule creates a new user module
func NewModule(transport *http.Transport, sessionManager *session.Manager) *Module {
	return &Module{
		transport: transport,
		session:   sessionManager,
	}
}

// Profile retrieves the current user's profile
func (m *Module) Profile(ctx context.Context) (*types.UserProfile, error) {
	token, ok := m.session.GetAccessToken()
	if !ok || token == "" {
		return nil, errors.NewSessionExpiredError("", "")
	}

	resp, err := m.transport.Get(ctx, "/api/v1/users/me", token)
	if err != nil {
		return nil, err
	}

	var profile types.UserProfile
	if err := json.Unmarshal(resp, &profile); err != nil {
		return nil, err
	}

	return &profile, nil
}

// Roles retrieves the current user's roles
func (m *Module) Roles(ctx context.Context) ([]types.UserRoles, error) {
	token, ok := m.session.GetAccessToken()
	if !ok || token == "" {
		return nil, errors.NewSessionExpiredError("", "")
	}

	resp, err := m.transport.Get(ctx, "/api/v1/userinfo", token)
	if err != nil {
		return nil, err
	}

	var user types.UserProfile
	if err := json.Unmarshal(resp, &user); err != nil {
		return nil, err
	}

	// Return a single role based on the user's role field
	return []types.UserRoles{
		{
			ID:          user.ID,
			Name:        user.Role,
			Permissions: []string{},
		},
	}, nil
}

// HasPermission checks if the user has a specific permission
func (m *Module) HasPermission(ctx context.Context, permission string) (bool, error) {
	token, ok := m.session.GetAccessToken()
	if !ok || token == "" {
		return false, errors.NewSessionExpiredError("", "")
	}

	roles, err := m.Roles(ctx)
	if err != nil {
		return false, err
	}

	for _, role := range roles {
		for _, perm := range role.Permissions {
			if perm == permission {
				return true, nil
			}
		}
	}

	return false, nil
}
