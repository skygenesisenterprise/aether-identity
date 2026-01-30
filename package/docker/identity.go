package docker

// IdentityBinding defines identity requirements for a Docker service
type IdentityBinding struct {
	// Scopes are the OAuth2 scopes required by this service
	Scopes []string

	// Roles are the RBAC roles assigned to this service
	Roles []string

	// ServiceName overrides the service identifier
	// If empty, the service name from the stack is used
	ServiceName string

	// RequireIdentity indicates if identity is mandatory
	// When true, the service will fail to start without identity
	RequireIdentity bool

	// TokenEndpoint specifies a custom token endpoint
	// If empty, the client's IdentityEndpoint is used
	TokenEndpoint string

	// Audience specifies the intended audience for tokens
	Audience string
}

// Validate validates the identity binding
func (ib IdentityBinding) Validate() error {
	// Identity is optional, but if specified, must be valid
	if !ib.HasRequirements() {
		return nil
	}

	// Scopes and roles cannot both be empty if identity is enabled
	if len(ib.Scopes) == 0 && len(ib.Roles) == 0 {
		return NewValidationError("identity binding must specify at least one scope or role")
	}

	return nil
}

// HasRequirements returns true if the service has any identity requirements
func (ib IdentityBinding) HasRequirements() bool {
	return len(ib.Scopes) > 0 || len(ib.Roles) > 0 || ib.RequireIdentity
}

// GetScopes returns the required scopes
func (ib IdentityBinding) GetScopes() []string {
	if ib.Scopes == nil {
		return []string{}
	}
	return append([]string{}, ib.Scopes...)
}

// GetRoles returns the assigned roles
func (ib IdentityBinding) GetRoles() []string {
	if ib.Roles == nil {
		return []string{}
	}
	return append([]string{}, ib.Roles...)
}
