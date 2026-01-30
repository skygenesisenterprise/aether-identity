package docker

// Stack represents a Docker Compose stack with identity-aware services
type Stack struct {
	name        string
	client      *Client
	services    map[string]Service
	agentConfig AgentConfig
}

// StackOption configures a stack
type StackOption func(*Stack)

// WithAgentConfig sets custom agent configuration for the stack
func WithAgentConfig(config AgentConfig) StackOption {
	return func(s *Stack) {
		s.agentConfig = config
	}
}

// Name returns the stack name
func (s *Stack) Name() string {
	return s.name
}

// Service adds or updates a service in the stack
func (s *Stack) Service(name string, svc Service) *Stack {
	s.services[name] = svc
	return s
}

// Services returns all services in the stack
func (s *Stack) Services() map[string]Service {
	// Return a copy to prevent external modification
	result := make(map[string]Service, len(s.services))
	for k, v := range s.services {
		result[k] = v
	}
	return result
}

// GenerateCompose generates a docker-compose.yml file at the specified path
func (s *Stack) GenerateCompose(path string) error {
	return s.client.generateCompose(s, path)
}

// GenerateEnv generates an .env file at the specified path
// This file contains only non-sensitive configuration (endpoints, socket paths)
func (s *Stack) GenerateEnv(path string) error {
	return s.client.generateEnv(s, path)
}

// GenerateAgentConfig generates the identity agent configuration
func (s *Stack) GenerateAgentConfig(path string) error {
	return s.client.generateAgentConfig(s, path)
}

// Validate validates the stack configuration
func (s *Stack) Validate() error {
	if s.name == "" {
		return NewValidationError("stack name is required")
	}

	if len(s.services) == 0 {
		return NewValidationError("stack must have at least one service")
	}

	for name, svc := range s.services {
		if err := svc.Validate(); err != nil {
			return WrapError(err, "service %q validation failed", name)
		}
	}

	return nil
}
