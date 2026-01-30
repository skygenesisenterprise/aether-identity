package docker

import (
	"fmt"
)

// Pipeline provides CI/CD helpers for Docker-based identity workflows
type Pipeline struct {
	client *Client
	stack  *Stack
}

// NewPipeline creates a new pipeline helper for the given stack
func (s *Stack) NewPipeline() *Pipeline {
	return &Pipeline{
		client: s.client,
		stack:  s,
	}
}

// PipelineStage represents a CI/CD pipeline stage
type PipelineStage struct {
	Name        string
	Image       string
	Commands    []string
	Environment map[string]string
	Identity    *PipelineIdentity
}

// PipelineIdentity defines identity for a pipeline stage
type PipelineIdentity struct {
	Scopes      []string
	Roles       []string
	ServiceName string
}

// GenerateGitLabCI generates a GitLab CI configuration
func (p *Pipeline) GenerateGitLabCI() (*GitLabCIConfig, error) {
	if err := p.stack.Validate(); err != nil {
		return nil, err
	}

	config := &GitLabCIConfig{
		Stages: []string{"authenticate", "build", "deploy"},
		Variables: map[string]string{
			"AETHER_IDENTITY_ENDPOINT": p.client.config.IdentityEndpoint,
			"AETHER_PROJECT":           p.client.config.Project,
			"AETHER_STACK":             p.stack.name,
		},
		Jobs: make(map[string]GitLabCIJob),
	}

	// Authenticate job
	config.Jobs["authenticate"] = GitLabCIJob{
		Stage: "authenticate",
		Image: p.client.config.AgentImage,
		Script: []string{
			"echo \"Authenticating with Aether Identity...\"",
			"aether-agent authenticate || exit 1",
			"echo \"Authentication successful\"",
		},
		Artifacts: &GitLabCIArtifacts{
			Paths:    []string{".aether/token"},
			ExpireIn: "1 hour",
		},
	}

	// Build job for each service
	for name, svc := range p.stack.services {
		jobName := fmt.Sprintf("build:%s", name)
		config.Jobs[jobName] = GitLabCIJob{
			Stage:    "build",
			Image:    "docker:latest",
			Services: []string{"docker:dind"},
			Variables: map[string]string{
				"DOCKER_DRIVER": "overlay2",
			},
			Script: []string{
				fmt.Sprintf("docker build -t %s .", svc.Image),
				fmt.Sprintf("docker push %s", svc.Image),
			},
			Dependencies: []string{"authenticate"},
		}
	}

	// Deploy job
	config.Jobs["deploy"] = GitLabCIJob{
		Stage: "deploy",
		Image: "docker/compose:latest",
		Script: []string{
			"docker-compose -f docker-compose.yml up -d",
		},
		Dependencies: []string{"authenticate"},
		Environment: &GitLabCIEnvironment{
			Name: p.stack.name,
		},
	}

	return config, nil
}

// GenerateGitHubActions generates GitHub Actions workflow configuration
func (p *Pipeline) GenerateGitHubActions() (*GitHubActionsConfig, error) {
	if err := p.stack.Validate(); err != nil {
		return nil, err
	}

	config := &GitHubActionsConfig{
		Name: fmt.Sprintf("Deploy %s", p.stack.name),
		On: GitHubActionsOn{
			Push: &GitHubActionsPush{
				Branches: []string{"main"},
			},
		},
		Jobs: make(map[string]GitHubActionsJob),
	}

	// Authenticate job
	config.Jobs["authenticate"] = GitHubActionsJob{
		RunsOn: "ubuntu-latest",
		Steps: []GitHubActionsStep{
			{
				Name: "Checkout",
				Uses: "actions/checkout@v4",
			},
			{
				Name: "Authenticate with Aether Identity",
				Uses: "aether/identity-action@v1",
				With: map[string]string{
					"endpoint": p.client.config.IdentityEndpoint,
					"project":  p.client.config.Project,
				},
			},
		},
		Outputs: map[string]string{
			"token": "${{ steps.auth.outputs.token }}",
		},
	}

	// Build job
	buildSteps := []GitHubActionsStep{
		{
			Name: "Checkout",
			Uses: "actions/checkout@v4",
		},
		{
			Name: "Set up Docker Buildx",
			Uses: "docker/setup-buildx-action@v3",
		},
	}

	for name, svc := range p.stack.services {
		buildSteps = append(buildSteps, GitHubActionsStep{
			Name: fmt.Sprintf("Build %s", name),
			Run:  fmt.Sprintf("docker build -t %s .", svc.Image),
		})
	}

	config.Jobs["build"] = GitHubActionsJob{
		RunsOn: "ubuntu-latest",
		Needs:  []string{"authenticate"},
		Steps:  buildSteps,
	}

	return config, nil
}

// GitLabCIConfig represents a GitLab CI configuration
type GitLabCIConfig struct {
	Stages    []string               `yaml:"stages"`
	Variables map[string]string      `yaml:"variables,omitempty"`
	Jobs      map[string]GitLabCIJob `yaml:"-"`
}

// GitLabCIJob represents a GitLab CI job
type GitLabCIJob struct {
	Stage        string               `yaml:"stage"`
	Image        string               `yaml:"image,omitempty"`
	Services     []string             `yaml:"services,omitempty"`
	Variables    map[string]string    `yaml:"variables,omitempty"`
	Script       []string             `yaml:"script"`
	Dependencies []string             `yaml:"dependencies,omitempty"`
	Artifacts    *GitLabCIArtifacts   `yaml:"artifacts,omitempty"`
	Environment  *GitLabCIEnvironment `yaml:"environment,omitempty"`
}

// GitLabCIArtifacts represents GitLab CI artifacts
type GitLabCIArtifacts struct {
	Paths    []string `yaml:"paths"`
	ExpireIn string   `yaml:"expire_in,omitempty"`
}

// GitLabCIEnvironment represents GitLab CI environment
type GitLabCIEnvironment struct {
	Name string `yaml:"name"`
}

// GitHubActionsConfig represents a GitHub Actions workflow
type GitHubActionsConfig struct {
	Name string                      `yaml:"name"`
	On   GitHubActionsOn             `yaml:"on"`
	Jobs map[string]GitHubActionsJob `yaml:"jobs"`
}

// GitHubActionsOn represents GitHub Actions triggers
type GitHubActionsOn struct {
	Push        *GitHubActionsPush `yaml:"push,omitempty"`
	PullRequest *GitHubActionsPR   `yaml:"pull_request,omitempty"`
}

// GitHubActionsPush represents push trigger
type GitHubActionsPush struct {
	Branches []string `yaml:"branches,omitempty"`
}

// GitHubActionsPR represents PR trigger
type GitHubActionsPR struct {
	Branches []string `yaml:"branches,omitempty"`
}

// GitHubActionsJob represents a GitHub Actions job
type GitHubActionsJob struct {
	RunsOn  string              `yaml:"runs-on"`
	Needs   []string            `yaml:"needs,omitempty"`
	Steps   []GitHubActionsStep `yaml:"steps"`
	Outputs map[string]string   `yaml:"outputs,omitempty"`
}

// GitHubActionsStep represents a GitHub Actions step
type GitHubActionsStep struct {
	Name string            `yaml:"name,omitempty"`
	Uses string            `yaml:"uses,omitempty"`
	Run  string            `yaml:"run,omitempty"`
	With map[string]string `yaml:"with,omitempty"`
}
