package docker

// Client is the main entrypoint for the Docker SDK
// It provides configuration and factory methods for creating stacks
type Client struct {
	config Config
}

// Config holds the global configuration for the Docker SDK
type Config struct {
	// IdentityEndpoint is the URL of the Aether Identity service
	IdentityEndpoint string

	// Project is the project name for resource organization
	Project string

	// AgentImage is the Docker image for the identity agent sidecar
	// Defaults to "aether/identity-agent:latest" if empty
	AgentImage string

	// AgentSocketPath is the path where the agent socket is mounted
	// Defaults to "/var/run/aether/identity.sock" if empty
	AgentSocketPath string

	// Environment is the deployment environment (dev, staging, prod)
	Environment string
}

// NewClient creates a new Docker SDK client with the provided configuration
func NewClient(config Config) *Client {
	// Apply defaults
	if config.AgentImage == "" {
		config.AgentImage = "aether/identity-agent:latest"
	}
	if config.AgentSocketPath == "" {
		config.AgentSocketPath = "/var/run/aether/identity.sock"
	}
	if config.Environment == "" {
		config.Environment = "development"
	}

	return &Client{config: config}
}

// NewStack creates a new Docker stack with the given name
func (c *Client) NewStack(name string) *Stack {
	return &Stack{
		name:     name,
		client:   c,
		services: make(map[string]Service),
	}
}

// Config returns the client configuration (read-only copy)
func (c *Client) Config() Config {
	return c.config
}
