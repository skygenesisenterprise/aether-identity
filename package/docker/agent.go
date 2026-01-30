package docker

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

// AgentConfig holds configuration for the identity agent
type AgentConfig struct {
	// ExtraEnv provides additional environment variables for the agent
	ExtraEnv map[string]string

	// LogLevel sets the agent logging level
	LogLevel string

	// TokenRefreshInterval controls how often to refresh tokens
	TokenRefreshInterval string
}

// AgentConfiguration is the full agent configuration file structure
type AgentConfiguration struct {
	Version     string                     `json:"version"`
	Endpoint    string                     `json:"endpoint"`
	Project     string                     `json:"project"`
	Stack       string                     `json:"stack"`
	Environment string                     `json:"environment"`
	SocketPath  string                     `json:"socket_path"`
	Services    map[string]ServiceIdentity `json:"services"`
}

// ServiceIdentity defines identity requirements for a service in agent config
type ServiceIdentity struct {
	Scopes      []string `json:"scopes,omitempty"`
	Roles       []string `json:"roles,omitempty"`
	ServiceName string   `json:"service_name"`
	Audience    string   `json:"audience,omitempty"`
}

// generateAgentConfig generates the identity agent configuration file
func (c *Client) generateAgentConfig(stack *Stack, path string) error {
	if err := stack.Validate(); err != nil {
		return err
	}

	config := AgentConfiguration{
		Version:     "1.0",
		Endpoint:    c.config.IdentityEndpoint,
		Project:     c.config.Project,
		Stack:       stack.name,
		Environment: c.config.Environment,
		SocketPath:  c.config.AgentSocketPath,
		Services:    make(map[string]ServiceIdentity),
	}

	// Add service identities
	for name, svc := range stack.services {
		if svc.HasIdentity() {
			si := ServiceIdentity{
				Scopes:      svc.Identity.GetScopes(),
				Roles:       svc.Identity.GetRoles(),
				ServiceName: svc.Identity.ServiceName,
				Audience:    svc.Identity.Audience,
			}

			if si.ServiceName == "" {
				si.ServiceName = name
			}

			config.Services[name] = si
		}
	}

	// Marshal to JSON
	data, err := json.MarshalIndent(config, "", "  ")
	if err != nil {
		return WrapError(err, "failed to marshal agent config")
	}

	// Ensure directory exists
	dir := filepath.Dir(path)
	if dir != "" && dir != "." {
		if err := os.MkdirAll(dir, 0755); err != nil {
			return WrapError(err, "failed to create directory %q", dir)
		}
	}

	// Write file
	if err := os.WriteFile(path, data, 0644); err != nil {
		return WrapError(err, "failed to write agent config to %q", path)
	}

	return nil
}

// generateEnv generates an .env file with non-sensitive configuration
func (c *Client) generateEnv(stack *Stack, path string) error {
	var content string

	// Add header
	content += "# Aether Identity Docker Environment Configuration\n"
	content += "# This file contains non-sensitive configuration only\n"
	content += fmt.Sprintf("# Project: %s\n", c.config.Project)
	content += fmt.Sprintf("# Stack: %s\n", stack.name)
	content += fmt.Sprintf("# Generated: %s\n\n", c.config.Environment)

	// Add identity endpoint
	content += fmt.Sprintf("AETHER_IDENTITY_ENDPOINT=%s\n", c.config.IdentityEndpoint)
	content += fmt.Sprintf("AETHER_PROJECT=%s\n", c.config.Project)
	content += fmt.Sprintf("AETHER_STACK=%s\n", stack.name)
	content += fmt.Sprintf("AETHER_ENVIRONMENT=%s\n", c.config.Environment)
	content += fmt.Sprintf("AETHER_AGENT_SOCKET=%s\n", c.config.AgentSocketPath)
	content += fmt.Sprintf("AETHER_AGENT_IMAGE=%s\n", c.config.AgentImage)

	// Ensure directory exists
	dir := filepath.Dir(path)
	if dir != "" && dir != "." {
		if err := os.MkdirAll(dir, 0755); err != nil {
			return WrapError(err, "failed to create directory %q", dir)
		}
	}

	// Write file
	if err := os.WriteFile(path, []byte(content), 0644); err != nil {
		return WrapError(err, "failed to write env file to %q", path)
	}

	return nil
}
