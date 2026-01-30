package sync

import (
	"context"
	"fmt"
	"time"

	gh "github.com/google/go-github/v57/github"
	"github.com/skygenesisenterprise/aether-identity/package/github/identity"
)

// RepositorySync handles synchronization of GitHub repositories to Identity resources
type RepositorySync struct {
	identityClient *identity.Client
	auditLogger    *identity.AuditLogger
}

// NewRepositorySync creates a new repository synchronizer
func NewRepositorySync(identityClient *identity.Client, auditLogger *identity.AuditLogger) *RepositorySync {
	return &RepositorySync{
		identityClient: identityClient,
		auditLogger:    auditLogger,
	}
}

// SyncRepository synchronizes a single GitHub repository to Identity as a resource
func (s *RepositorySync) SyncRepository(ctx context.Context, ghRepo *gh.Repository, installationID int64, requestID string) error {
	resource := s.convertGitHubRepository(ghRepo)

	event := identity.SyncEvent{
		EventType:  "repository_sync",
		Provider:   "github",
		EntityType: "resource",
		EntityID:   fmt.Sprintf("%d", ghRepo.GetID()),
		Data: map[string]interface{}{
			"resource":        resource,
			"github_id":       ghRepo.GetID(),
			"full_name":       ghRepo.GetFullName(),
			"installation_id": installationID,
		},
		Timestamp: time.Now().UTC(),
		RequestID: requestID,
	}

	if err := s.identityClient.SyncEntity(ctx, event); err != nil {
		return err
	}

	// Log the sync
	if s.auditLogger != nil {
		auditEntry := identity.AuditEntry{
			RequestID: requestID,
			Actor: identity.Actor{
				Type:       "system",
				ID:         "github-app",
				ExternalID: fmt.Sprintf("%d", installationID),
			},
			Action: "sync_repository",
			Resource: identity.Resource{
				Type: "resource",
				ID:   fmt.Sprintf("%d", ghRepo.GetID()),
				Name: ghRepo.GetFullName(),
			},
			Decision: "success",
			Reason:   "Repository synchronized to Identity as resource",
		}
		s.auditLogger.LogSync(ctx, auditEntry)
	}

	return nil
}

// SyncRepositories synchronizes multiple GitHub repositories to Identity
func (s *RepositorySync) SyncRepositories(ctx context.Context, ghRepos []*gh.Repository, installationID int64, requestID string) error {
	for _, ghRepo := range ghRepos {
		if err := s.SyncRepository(ctx, ghRepo, installationID, requestID); err != nil {
			// Log error but continue with other repositories
			if s.auditLogger != nil {
				auditEntry := identity.AuditEntry{
					RequestID: requestID,
					Actor: identity.Actor{
						Type:       "system",
						ID:         "github-app",
						ExternalID: fmt.Sprintf("%d", installationID),
					},
					Action: "sync_repository",
					Resource: identity.Resource{
						Type: "resource",
						ID:   fmt.Sprintf("%d", ghRepo.GetID()),
						Name: ghRepo.GetFullName(),
					},
					Decision: "failed",
					Reason:   err.Error(),
				}
				s.auditLogger.LogError(ctx, auditEntry, err)
			}
			continue
		}
	}

	return nil
}

// SyncRepositoryFromEvent synchronizes a repository from a webhook event
func (s *RepositorySync) SyncRepositoryFromEvent(ctx context.Context, repoID int64, repoName string, fullName string, private bool, eventType string, eventAction string, requestID string) error {
	if repoID == 0 {
		return fmt.Errorf("no repository information in event")
	}

	syncEvent := identity.SyncEvent{
		EventType:  "repository_sync_from_event",
		Provider:   "github",
		EntityType: "resource",
		EntityID:   fmt.Sprintf("%d", repoID),
		Data: map[string]interface{}{
			"repository_id":   repoID,
			"repository_name": repoName,
			"full_name":       fullName,
			"private":         private,
			"event_type":      eventType,
			"event_action":    eventAction,
		},
		Timestamp: time.Now().UTC(),
		RequestID: requestID,
	}

	return s.identityClient.SyncEntity(ctx, syncEvent)
}

// SyncRepositoryTeams synchronizes repository team access to Identity
func (s *RepositorySync) SyncRepositoryTeams(ctx context.Context, repoID int64, teams []*gh.Team, installationID int64, requestID string) error {
	teamIDs := make([]string, 0, len(teams))
	for _, team := range teams {
		teamIDs = append(teamIDs, fmt.Sprintf("%d", team.GetID()))
	}

	event := identity.SyncEvent{
		EventType:  "repository_teams_sync",
		Provider:   "github",
		EntityType: "resource_access",
		EntityID:   fmt.Sprintf("%d", repoID),
		Data: map[string]interface{}{
			"repository_id":   repoID,
			"team_ids":        teamIDs,
			"installation_id": installationID,
		},
		Timestamp: time.Now().UTC(),
		RequestID: requestID,
	}

	return s.identityClient.SyncEntity(ctx, event)
}

// DeleteRepository marks a repository as deleted in Identity
func (s *RepositorySync) DeleteRepository(ctx context.Context, repoID int64, installationID int64, requestID string) error {
	event := identity.SyncEvent{
		EventType:  "repository_delete",
		Provider:   "github",
		EntityType: "resource",
		EntityID:   fmt.Sprintf("%d", repoID),
		Data: map[string]interface{}{
			"repository_id":   repoID,
			"installation_id": installationID,
			"deleted":         true,
		},
		Timestamp: time.Now().UTC(),
		RequestID: requestID,
	}

	if err := s.identityClient.SyncEntity(ctx, event); err != nil {
		return err
	}

	// Log the deletion
	if s.auditLogger != nil {
		auditEntry := identity.AuditEntry{
			RequestID: requestID,
			Actor: identity.Actor{
				Type:       "system",
				ID:         "github-app",
				ExternalID: fmt.Sprintf("%d", installationID),
			},
			Action: "delete_repository",
			Resource: identity.Resource{
				Type: "resource",
				ID:   fmt.Sprintf("%d", repoID),
			},
			Decision: "success",
			Reason:   "Repository marked as deleted in Identity",
		}
		s.auditLogger.LogSync(ctx, auditEntry)
	}

	return nil
}

// convertGitHubRepository converts a GitHub repository to Identity resource format
func (s *RepositorySync) convertGitHubRepository(ghRepo *gh.Repository) identity.Resource {
	return identity.Resource{
		ID:          fmt.Sprintf("github-repo:%d", ghRepo.GetID()),
		Type:        "repository",
		Name:        ghRepo.GetFullName(),
		Description: ghRepo.GetDescription(),
		Attributes: map[string]interface{}{
			"github_id":      ghRepo.GetID(),
			"name":           ghRepo.GetName(),
			"full_name":      ghRepo.GetFullName(),
			"private":        ghRepo.GetPrivate(),
			"default_branch": ghRepo.GetDefaultBranch(),
			"html_url":       ghRepo.GetHTMLURL(),
		},
		ExternalIDs: map[string]string{
			"github": fmt.Sprintf("%d", ghRepo.GetID()),
		},
	}
}
