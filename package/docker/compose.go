package docker

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

// generateCompose generates a docker-compose.yml file for the stack
func (c *Client) generateCompose(stack *Stack, path string) error {
	if err := stack.Validate(); err != nil {
		return err
	}

	compose := &ComposeFile{
		Version:  "3.8",
		Services: make(map[string]ComposeService),
		Networks: make(map[string]ComposeNetwork),
		Volumes:  make(map[string]ComposeVolume),
	}

	// Add identity network
	compose.Networks["aether-identity"] = ComposeNetwork{
		Driver: "bridge",
	}

	// Add identity socket volume
	compose.Volumes["aether-identity-socket"] = ComposeVolume{
		Driver: "local",
	}

	// Add identity agent service
	agentService := c.buildAgentService(stack)
	compose.Services["identity-agent"] = agentService

	// Add user services
	for name, svc := range stack.services {
		composeService := c.buildComposeService(name, svc, stack)
		compose.Services[name] = composeService
	}

	// Marshal to YAML
	yaml, err := compose.ToYAML()
	if err != nil {
		return WrapError(err, "failed to marshal compose file")
	}

	// Ensure directory exists
	dir := filepath.Dir(path)
	if dir != "" && dir != "." {
		if err := os.MkdirAll(dir, 0755); err != nil {
			return WrapError(err, "failed to create directory %q", dir)
		}
	}

	// Write file
	if err := os.WriteFile(path, []byte(yaml), 0644); err != nil {
		return WrapError(err, "failed to write compose file to %q", path)
	}

	return nil
}

// buildAgentService builds the identity agent sidecar service
func (c *Client) buildAgentService(stack *Stack) ComposeService {
	config := c.config

	env := map[string]string{
		"AETHER_IDENTITY_ENDPOINT": config.IdentityEndpoint,
		"AETHER_PROJECT":           config.Project,
		"AETHER_STACK":             stack.name,
		"AETHER_AGENT_SOCKET":      config.AgentSocketPath,
		"AETHER_ENVIRONMENT":       config.Environment,
	}

	// Add agent-specific config
	if stack.agentConfig.ExtraEnv != nil {
		for k, v := range stack.agentConfig.ExtraEnv {
			env[k] = v
		}
	}

	return ComposeService{
		Image:       config.AgentImage,
		Restart:     "unless-stopped",
		Environment: env,
		Volumes: []string{
			"aether-identity-socket:" + filepath.Dir(config.AgentSocketPath),
		},
		Networks: []string{"aether-identity"},
		HealthCheck: &ComposeHealthCheck{
			Test:     []string{"CMD", "test", "-S", config.AgentSocketPath},
			Interval: "10s",
			Timeout:  "5s",
			Retries:  3,
		},
		Labels: map[string]string{
			"aether.identity.agent": "true",
			"aether.project":        config.Project,
			"aether.stack":          stack.name,
		},
	}
}

// buildComposeService builds a compose service from a Service definition
func (c *Client) buildComposeService(name string, svc Service, stack *Stack) ComposeService {
	cs := ComposeService{
		Image:       svc.Image,
		Command:     svc.Command,
		WorkingDir:  svc.WorkingDir,
		Restart:     "unless-stopped",
		Environment: make(map[string]string),
		Volumes:     make([]string, 0),
		Networks:    []string{"aether-identity"},
		DependsOn:   []string{"identity-agent"},
		Labels:      make(map[string]string),
	}

	// Copy environment variables
	for k, v := range svc.Environment {
		cs.Environment[k] = v
	}

	// Add identity environment variables
	if svc.HasIdentity() {
		cs.Environment["AETHER_IDENTITY_SOCKET"] = c.config.AgentSocketPath
		cs.Environment["AETHER_IDENTITY_SERVICE"] = svc.Identity.ServiceName
		if cs.Environment["AETHER_IDENTITY_SERVICE"] == "" {
			cs.Environment["AETHER_IDENTITY_SERVICE"] = name
		}

		// Mount identity socket
		cs.Volumes = append(cs.Volumes,
			"aether-identity-socket:"+filepath.Dir(c.config.AgentSocketPath)+":ro")
	}

	// Copy user volumes
	cs.Volumes = append(cs.Volumes, svc.Volumes...)

	// Copy ports
	cs.Ports = svc.Ports

	// Copy networks
	if len(svc.Networks) > 0 {
		cs.Networks = append(cs.Networks, svc.Networks...)
	}

	// Copy depends_on
	if len(svc.DependsOn) > 0 {
		cs.DependsOn = append(cs.DependsOn, svc.DependsOn...)
	}

	// Merge labels
	for k, v := range svc.Labels {
		cs.Labels[k] = v
	}

	// Add identity labels
	identityLabels := svc.GetIdentityLabels(name)
	for k, v := range identityLabels {
		cs.Labels[k] = v
	}

	// Add project/stack labels
	cs.Labels["aether.project"] = c.config.Project
	cs.Labels["aether.stack"] = stack.name
	cs.Labels["aether.service"] = name

	// Add health check if specified
	if svc.HealthCheck != nil {
		cs.HealthCheck = &ComposeHealthCheck{
			Test:     svc.HealthCheck.Test,
			Interval: svc.HealthCheck.Interval,
			Timeout:  svc.HealthCheck.Timeout,
			Retries:  svc.HealthCheck.Retries,
		}
	}

	return cs
}

// ComposeFile represents the structure of a docker-compose.yml file
type ComposeFile struct {
	Version  string                    `yaml:"version"`
	Services map[string]ComposeService `yaml:"services"`
	Networks map[string]ComposeNetwork `yaml:"networks,omitempty"`
	Volumes  map[string]ComposeVolume  `yaml:"volumes,omitempty"`
}

// ComposeService represents a service in docker-compose
type ComposeService struct {
	Image       string              `yaml:"image"`
	Command     []string            `yaml:"command,omitempty"`
	WorkingDir  string              `yaml:"working_dir,omitempty"`
	Restart     string              `yaml:"restart,omitempty"`
	Environment map[string]string   `yaml:"environment,omitempty"`
	Ports       []string            `yaml:"ports,omitempty"`
	Volumes     []string            `yaml:"volumes,omitempty"`
	Networks    []string            `yaml:"networks,omitempty"`
	DependsOn   []string            `yaml:"depends_on,omitempty"`
	Labels      map[string]string   `yaml:"labels,omitempty"`
	HealthCheck *ComposeHealthCheck `yaml:"healthcheck,omitempty"`
}

// ComposeHealthCheck represents a health check configuration
type ComposeHealthCheck struct {
	Test     []string `yaml:"test"`
	Interval string   `yaml:"interval,omitempty"`
	Timeout  string   `yaml:"timeout,omitempty"`
	Retries  int      `yaml:"retries,omitempty"`
}

// ComposeNetwork represents a network in docker-compose
type ComposeNetwork struct {
	Driver string `yaml:"driver,omitempty"`
}

// ComposeVolume represents a volume in docker-compose
type ComposeVolume struct {
	Driver string `yaml:"driver,omitempty"`
}

// ToYAML converts the compose file to YAML format
func (cf *ComposeFile) ToYAML() (string, error) {
	var sb strings.Builder

	sb.WriteString("version: \"" + cf.Version + "\"\n")
	sb.WriteString("\nservices:\n")

	for name, svc := range cf.Services {
		sb.WriteString(fmt.Sprintf("  %s:\n", name))
		sb.WriteString(fmt.Sprintf("    image: %s\n", svc.Image))

		if svc.Restart != "" {
			sb.WriteString(fmt.Sprintf("    restart: %s\n", svc.Restart))
		}

		if svc.WorkingDir != "" {
			sb.WriteString(fmt.Sprintf("    working_dir: %s\n", svc.WorkingDir))
		}

		if len(svc.Command) > 0 {
			sb.WriteString(fmt.Sprintf("    command: [%s]\n", formatStringSlice(svc.Command)))
		}

		if len(svc.Ports) > 0 {
			sb.WriteString("    ports:\n")
			for _, port := range svc.Ports {
				sb.WriteString(fmt.Sprintf("      - \"%s\"\n", port))
			}
		}

		if len(svc.Environment) > 0 {
			sb.WriteString("    environment:\n")
			for k, v := range svc.Environment {
				sb.WriteString(fmt.Sprintf("      %s: %s\n", k, formatEnvValue(v)))
			}
		}

		if len(svc.Volumes) > 0 {
			sb.WriteString("    volumes:\n")
			for _, vol := range svc.Volumes {
				sb.WriteString(fmt.Sprintf("      - %s\n", vol))
			}
		}

		if len(svc.Networks) > 0 {
			sb.WriteString("    networks:\n")
			for _, net := range svc.Networks {
				sb.WriteString(fmt.Sprintf("      - %s\n", net))
			}
		}

		if len(svc.DependsOn) > 0 {
			sb.WriteString("    depends_on:\n")
			for _, dep := range svc.DependsOn {
				sb.WriteString(fmt.Sprintf("      - %s\n", dep))
			}
		}

		if len(svc.Labels) > 0 {
			sb.WriteString("    labels:\n")
			for k, v := range svc.Labels {
				sb.WriteString(fmt.Sprintf("      - \"%s=%s\"\n", k, v))
			}
		}

		if svc.HealthCheck != nil {
			sb.WriteString("    healthcheck:\n")
			sb.WriteString(fmt.Sprintf("      test: [%s]\n", formatStringSlice(svc.HealthCheck.Test)))
			if svc.HealthCheck.Interval != "" {
				sb.WriteString(fmt.Sprintf("      interval: %s\n", svc.HealthCheck.Interval))
			}
			if svc.HealthCheck.Timeout != "" {
				sb.WriteString(fmt.Sprintf("      timeout: %s\n", svc.HealthCheck.Timeout))
			}
			if svc.HealthCheck.Retries > 0 {
				sb.WriteString(fmt.Sprintf("      retries: %d\n", svc.HealthCheck.Retries))
			}
		}
	}

	if len(cf.Networks) > 0 {
		sb.WriteString("\nnetworks:\n")
		for name, net := range cf.Networks {
			sb.WriteString(fmt.Sprintf("  %s:\n", name))
			if net.Driver != "" {
				sb.WriteString(fmt.Sprintf("    driver: %s\n", net.Driver))
			}
		}
	}

	if len(cf.Volumes) > 0 {
		sb.WriteString("\nvolumes:\n")
		for name, vol := range cf.Volumes {
			sb.WriteString(fmt.Sprintf("  %s:\n", name))
			if vol.Driver != "" {
				sb.WriteString(fmt.Sprintf("    driver: %s\n", vol.Driver))
			}
		}
	}

	return sb.String(), nil
}

func formatStringSlice(slice []string) string {
	quoted := make([]string, len(slice))
	for i, s := range slice {
		quoted[i] = fmt.Sprintf("\"%s\"", s)
	}
	return strings.Join(quoted, ", ")
}

func formatEnvValue(v string) string {
	// If value contains special characters, quote it
	if strings.ContainsAny(v, ":#{}[]&*?!|><=\"") {
		return fmt.Sprintf("\"%s\"", v)
	}
	return v
}
