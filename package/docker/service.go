package docker

import "fmt"

// Service represents a Docker service with identity requirements
type Service struct {
	// Image is the Docker image for the service
	Image string

	// Ports to expose (format: "host:container" or "container")
	Ports []string

	// Environment variables (non-sensitive only)
	Environment map[string]string

	// Volumes to mount (format: "source:target" or "target")
	Volumes []string

	// Networks to attach the service to
	Networks []string

	// DependsOn specifies service dependencies
	DependsOn []string

	// Identity defines the identity requirements for this service
	Identity IdentityBinding

	// Labels for the service
	Labels map[string]string

	// Command override
	Command []string

	// Working directory
	WorkingDir string

	// Health check configuration
	HealthCheck *HealthCheck
}

// HealthCheck defines container health check settings
type HealthCheck struct {
	Test     []string
	Interval string
	Timeout  string
	Retries  int
}

// Validate validates the service configuration
func (s Service) Validate() error {
	if s.Image == "" {
		return NewValidationError("service image is required")
	}

	// Validate identity binding
	if err := s.Identity.Validate(); err != nil {
		return err
	}

	return nil
}

// HasIdentity returns true if the service has identity requirements
func (s Service) HasIdentity() bool {
	return s.Identity.HasRequirements()
}

// GetIdentityLabels returns Docker labels for identity metadata
func (s Service) GetIdentityLabels(serviceName string) map[string]string {
	labels := make(map[string]string)

	if !s.HasIdentity() {
		return labels
	}

	labels["aether.identity.enabled"] = "true"
	labels["aether.identity.service"] = s.Identity.ServiceName
	if s.Identity.ServiceName == "" {
		labels["aether.identity.service"] = serviceName
	}

	if len(s.Identity.Scopes) > 0 {
		for i, scope := range s.Identity.Scopes {
			labels[fmt.Sprintf("aether.identity.scope.%d", i)] = scope
		}
	}

	if len(s.Identity.Roles) > 0 {
		for i, role := range s.Identity.Roles {
			labels[fmt.Sprintf("aether.identity.role.%d", i)] = role
		}
	}

	return labels
}
