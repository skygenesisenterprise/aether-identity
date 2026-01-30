package sync

import (
	"context"
	"fmt"
	"time"

	gh "github.com/google/go-github/v57/github"
	"github.com/skygenesisenterprise/aether-identity/package/github/identity"
)

// UserSync handles synchronization of GitHub users to Identity
type UserSync struct {
	identityClient *identity.Client
	auditLogger    *identity.AuditLogger
}

// NewUserSync creates a new user synchronizer
func NewUserSync(identityClient *identity.Client, auditLogger *identity.AuditLogger) *UserSync {
	return &UserSync{
		identityClient: identityClient,
		auditLogger:    auditLogger,
	}
}

// SyncUser synchronizes a single GitHub user to Identity
func (s *UserSync) SyncUser(ctx context.Context, ghUser *gh.User, installationID int64, requestID string) error {
	user := s.convertGitHubUser(ghUser)

	event := identity.SyncEvent{
		EventType:  "user_sync",
		Provider:   "github",
		EntityType: "user",
		EntityID:   fmt.Sprintf("%d", ghUser.GetID()),
		Data: map[string]interface{}{
			"user":            user,
			"github_id":       ghUser.GetID(),
			"github_login":    ghUser.GetLogin(),
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
			Action: "sync_user",
			Resource: identity.Resource{
				Type: "user",
				ID:   fmt.Sprintf("%d", ghUser.GetID()),
				Name: ghUser.GetLogin(),
			},
			Decision: "success",
			Reason:   "User synchronized to Identity",
		}
		s.auditLogger.LogSync(ctx, auditEntry)
	}

	return nil
}

// SyncUsers synchronizes multiple GitHub users to Identity
func (s *UserSync) SyncUsers(ctx context.Context, ghUsers []*gh.User, installationID int64, requestID string) error {
	for _, ghUser := range ghUsers {
		if err := s.SyncUser(ctx, ghUser, installationID, requestID); err != nil {
			// Log error but continue with other users
			if s.auditLogger != nil {
				auditEntry := identity.AuditEntry{
					RequestID: requestID,
					Actor: identity.Actor{
						Type:       "system",
						ID:         "github-app",
						ExternalID: fmt.Sprintf("%d", installationID),
					},
					Action: "sync_user",
					Resource: identity.Resource{
						Type: "user",
						ID:   fmt.Sprintf("%d", ghUser.GetID()),
						Name: ghUser.GetLogin(),
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

// SyncUserFromEvent synchronizes a user from a webhook event
func (s *UserSync) SyncUserFromEvent(ctx context.Context, senderID int64, senderLogin string, eventType string, eventAction string, requestID string) error {
	if senderID == 0 {
		return fmt.Errorf("no sender information in event")
	}

	syncEvent := identity.SyncEvent{
		EventType:  "user_sync_from_event",
		Provider:   "github",
		EntityType: "user",
		EntityID:   fmt.Sprintf("%d", senderID),
		Data: map[string]interface{}{
			"github_id":    senderID,
			"github_login": senderLogin,
			"event_type":   eventType,
			"event_action": eventAction,
		},
		Timestamp: time.Now().UTC(),
		RequestID: requestID,
	}

	return s.identityClient.SyncEntity(ctx, syncEvent)
}

// convertGitHubUser converts a GitHub user to Identity user format
func (s *UserSync) convertGitHubUser(ghUser *gh.User) identity.User {
	return identity.User{
		ID:         fmt.Sprintf("github:%d", ghUser.GetID()),
		ExternalID: fmt.Sprintf("%d", ghUser.GetID()),
		Provider:   "github",
		Email:      ghUser.GetEmail(),
		Name:       ghUser.GetName(),
		Attributes: map[string]interface{}{
			"login":      ghUser.GetLogin(),
			"avatar_url": ghUser.GetAvatarURL(),
			"type":       ghUser.GetType(),
		},
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
	}
}
