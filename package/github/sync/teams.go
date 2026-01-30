package sync

import (
	"context"
	"fmt"
	"time"

	gh "github.com/google/go-github/v57/github"
	"github.com/skygenesisenterprise/aether-identity/package/github/identity"
)

// TeamSync handles synchronization of GitHub teams to Identity roles
type TeamSync struct {
	identityClient *identity.Client
	auditLogger    *identity.AuditLogger
}

// NewTeamSync creates a new team synchronizer
func NewTeamSync(identityClient *identity.Client, auditLogger *identity.AuditLogger) *TeamSync {
	return &TeamSync{
		identityClient: identityClient,
		auditLogger:    auditLogger,
	}
}

// SyncTeam synchronizes a single GitHub team to Identity as a role
func (s *TeamSync) SyncTeam(ctx context.Context, ghTeam *gh.Team, org string, installationID int64, requestID string) error {
	role := s.convertGitHubTeam(ghTeam, org)

	event := identity.SyncEvent{
		EventType:  "team_sync",
		Provider:   "github",
		EntityType: "role",
		EntityID:   fmt.Sprintf("%d", ghTeam.GetID()),
		Data: map[string]interface{}{
			"role":            role,
			"github_id":       ghTeam.GetID(),
			"github_slug":     ghTeam.GetSlug(),
			"organization":    org,
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
			Action: "sync_team",
			Resource: identity.Resource{
				Type: "role",
				ID:   fmt.Sprintf("%d", ghTeam.GetID()),
				Name: ghTeam.GetName(),
			},
			Decision: "success",
			Reason:   "Team synchronized to Identity as role",
		}
		s.auditLogger.LogSync(ctx, auditEntry)
	}

	return nil
}

// SyncTeams synchronizes multiple GitHub teams to Identity
func (s *TeamSync) SyncTeams(ctx context.Context, ghTeams []*gh.Team, org string, installationID int64, requestID string) error {
	for _, ghTeam := range ghTeams {
		if err := s.SyncTeam(ctx, ghTeam, org, installationID, requestID); err != nil {
			// Log error but continue with other teams
			if s.auditLogger != nil {
				auditEntry := identity.AuditEntry{
					RequestID: requestID,
					Actor: identity.Actor{
						Type:       "system",
						ID:         "github-app",
						ExternalID: fmt.Sprintf("%d", installationID),
					},
					Action: "sync_team",
					Resource: identity.Resource{
						Type: "role",
						ID:   fmt.Sprintf("%d", ghTeam.GetID()),
						Name: ghTeam.GetName(),
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

// SyncTeamFromEvent synchronizes a team from a webhook event
func (s *TeamSync) SyncTeamFromEvent(ctx context.Context, orgLogin string, payload map[string]interface{}, eventType string, eventAction string, requestID string) error {
	if orgLogin == "" {
		return fmt.Errorf("no organization information in event")
	}

	// Extract team info from event payload if available
	teamData, ok := payload["team"].(map[string]interface{})
	if !ok {
		return fmt.Errorf("no team information in event payload")
	}

	teamID, ok := teamData["id"].(float64)
	if !ok {
		return fmt.Errorf("no team ID in event payload")
	}

	syncEvent := identity.SyncEvent{
		EventType:  "team_sync_from_event",
		Provider:   "github",
		EntityType: "role",
		EntityID:   fmt.Sprintf("%d", int64(teamID)),
		Data: map[string]interface{}{
			"team":         teamData,
			"organization": orgLogin,
			"event_type":   eventType,
			"event_action": eventAction,
		},
		Timestamp: time.Now().UTC(),
		RequestID: requestID,
	}

	return s.identityClient.SyncEntity(ctx, syncEvent)
}

// SyncTeamMembers synchronizes team membership to Identity
func (s *TeamSync) SyncTeamMembers(ctx context.Context, teamID int64, members []*gh.User, org string, installationID int64, requestID string) error {
	memberIDs := make([]string, 0, len(members))
	for _, member := range members {
		memberIDs = append(memberIDs, fmt.Sprintf("%d", member.GetID()))
	}

	event := identity.SyncEvent{
		EventType:  "team_members_sync",
		Provider:   "github",
		EntityType: "membership",
		EntityID:   fmt.Sprintf("%d", teamID),
		Data: map[string]interface{}{
			"team_id":         teamID,
			"member_ids":      memberIDs,
			"organization":    org,
			"installation_id": installationID,
		},
		Timestamp: time.Now().UTC(),
		RequestID: requestID,
	}

	return s.identityClient.SyncEntity(ctx, event)
}

// convertGitHubTeam converts a GitHub team to Identity role format
func (s *TeamSync) convertGitHubTeam(ghTeam *gh.Team, org string) identity.Role {
	return identity.Role{
		ID:          fmt.Sprintf("github-team:%d", ghTeam.GetID()),
		Name:        fmt.Sprintf("%s/%s", org, ghTeam.GetSlug()),
		Description: ghTeam.GetDescription(),
		Permissions: []string{}, // Permissions will be managed by Identity
	}
}
