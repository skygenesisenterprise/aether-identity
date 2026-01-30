package permissions

import (
	"fmt"
	"strings"

	"github.com/skygenesisenterprise/aether-identity/package/github/github"
)

// Mapper maps GitHub concepts to Identity concepts
type Mapper struct{}

// NewMapper creates a new permission mapper
func NewMapper() *Mapper {
	return &Mapper{}
}

// MapGitHubEventToAction maps a GitHub event to an Identity action
func (m *Mapper) MapGitHubEventToAction(event *github.Event) (action string, resourceType string, err error) {
	switch event.Type {
	case github.EventTypePush:
		return "push", "repository", nil
	case github.EventTypePullRequest:
		action := m.mapPullRequestAction(event.Action)
		return action, "repository", nil
	case github.EventTypeRepository:
		action := m.mapRepositoryAction(event.Action)
		return action, "repository", nil
	case github.EventTypeMembership:
		return "membership.change", "organization", nil
	case github.EventTypeTeam:
		return "team.change", "organization", nil
	default:
		return "", "", fmt.Errorf("unsupported event type: %s", event.Type)
	}
}

// MapGitHubPermissionToIdentity maps a GitHub permission to Identity permissions
func (m *Mapper) MapGitHubPermissionToIdentity(githubPermission string) []string {
	switch strings.ToLower(githubPermission) {
	case "admin":
		return []string{"repo.admin", "repo.write", "repo.read", "repo.delete"}
	case "push", "write":
		return []string{"repo.write", "repo.read"}
	case "pull", "read":
		return []string{"repo.read"}
	case "triage":
		return []string{"repo.read", "repo.triage"}
	case "maintain":
		return []string{"repo.read", "repo.write", "repo.maintain"}
	default:
		return []string{"repo.read"}
	}
}

// MapGitHubRoleToIdentity maps a GitHub team/role to Identity role name
func (m *Mapper) MapGitHubRoleToIdentity(org, teamSlug string) string {
	return fmt.Sprintf("github:%s/%s", org, teamSlug)
}

// MapRepositoryToResourceID maps a repository to an Identity resource ID
func (m *Mapper) MapRepositoryToResourceID(owner, repo string) string {
	return fmt.Sprintf("github-repo:%s/%s", owner, repo)
}

// MapUserToIdentityID maps a GitHub user ID to an Identity user ID
func (m *Mapper) MapUserToIdentityID(githubUserID int64) string {
	return fmt.Sprintf("github:%d", githubUserID)
}

// mapPullRequestAction maps a pull request action to an Identity action
func (m *Mapper) mapPullRequestAction(action string) string {
	switch action {
	case "opened":
		return "pull_request.open"
	case "closed":
		return "pull_request.close"
	case "reopened":
		return "pull_request.reopen"
	case "merged":
		return "pull_request.merge"
	case "synchronize":
		return "pull_request.update"
	case "edited":
		return "pull_request.edit"
	default:
		return fmt.Sprintf("pull_request.%s", action)
	}
}

// mapRepositoryAction maps a repository action to an Identity action
func (m *Mapper) mapRepositoryAction(action string) string {
	switch action {
	case "created":
		return "repository.create"
	case "deleted":
		return "repository.delete"
	case "archived":
		return "repository.archive"
	case "unarchived":
		return "repository.unarchive"
	case "edited":
		return "repository.edit"
	case "transferred":
		return "repository.transfer"
	case "publicized":
		return "repository.publicize"
	case "privatized":
		return "repository.privatize"
	default:
		return fmt.Sprintf("repository.%s", action)
	}
}

// GetResourcePath returns the full resource path for a repository
func (m *Mapper) GetResourcePath(owner, repo string) string {
	return fmt.Sprintf("/repositories/%s/%s", owner, repo)
}

// GetOrganizationPath returns the full path for an organization
func (m *Mapper) GetOrganizationPath(org string) string {
	return fmt.Sprintf("/organizations/%s", org)
}

// ParseRepositoryFullName parses a repository full name into owner and repo
func (m *Mapper) ParseRepositoryFullName(fullName string) (owner, repo string, err error) {
	parts := strings.Split(fullName, "/")
	if len(parts) != 2 {
		return "", "", fmt.Errorf("invalid repository full name: %s", fullName)
	}
	return parts[0], parts[1], nil
}
