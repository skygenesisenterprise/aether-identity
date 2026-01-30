package sync

import (
	"context"
	"fmt"
	"sync"
	"time"

	gh "github.com/google/go-github/v57/github"
	"github.com/skygenesisenterprise/aether-identity/package/github/config"
	internalgithub "github.com/skygenesisenterprise/aether-identity/package/github/github"
	"github.com/skygenesisenterprise/aether-identity/package/github/identity"
)

// Manager coordinates all synchronization operations
type Manager struct {
	config         config.SyncConfig
	userSync       *UserSync
	teamSync       *TeamSync
	repositorySync *RepositorySync
	identityClient *identity.Client
	auditLogger    *identity.AuditLogger
	githubClient   *internalgithub.Client
	lastSyncTime   map[string]time.Time
	syncMutex      sync.RWMutex
}

// NewManager creates a new sync manager
func NewManager(
	cfg config.SyncConfig,
	identityClient *identity.Client,
	auditLogger *identity.AuditLogger,
	githubClient *internalgithub.Client,
) *Manager {
	return &Manager{
		config:         cfg,
		userSync:       NewUserSync(identityClient, auditLogger),
		teamSync:       NewTeamSync(identityClient, auditLogger),
		repositorySync: NewRepositorySync(identityClient, auditLogger),
		identityClient: identityClient,
		auditLogger:    auditLogger,
		githubClient:   githubClient,
		lastSyncTime:   make(map[string]time.Time),
	}
}

// HandleEvent processes a webhook event and triggers appropriate sync operations
func (m *Manager) HandleEvent(ctx context.Context, event *internalgithub.Event) error {
	if !m.config.Enabled {
		return nil
	}

	requestID := generateRequestID()

	switch event.Type {
	case internalgithub.EventTypePush:
		return m.handlePushEvent(ctx, event, requestID)
	case internalgithub.EventTypePullRequest:
		return m.handlePullRequestEvent(ctx, event, requestID)
	case internalgithub.EventTypeMembership:
		return m.handleMembershipEvent(ctx, event, requestID)
	case internalgithub.EventTypeRepository:
		return m.handleRepositoryEvent(ctx, event, requestID)
	case internalgithub.EventTypeInstallation:
		return m.handleInstallationEvent(ctx, event, requestID)
	case internalgithub.EventTypeTeam:
		return m.handleTeamEvent(ctx, event, requestID)
	default:
		// For other events, just sync the sender
		return m.userSync.SyncUserFromEvent(ctx, event.Sender.ID, event.Sender.Login, string(event.Type), event.Action, requestID)
	}
}

// SyncInstallation performs a full sync of an installation
func (m *Manager) SyncInstallation(ctx context.Context, installationID int64) error {
	if !m.config.Enabled {
		return nil
	}

	requestID := generateRequestID()

	// Get installation client
	client, err := m.githubClient.GetInstallationClient(ctx, installationID)
	if err != nil {
		return fmt.Errorf("failed to get installation client: %w", err)
	}

	// Sync repositories
	opts := &gh.ListOptions{PerPage: m.config.BatchSize}
	for {
		repoList, resp, err := client.Apps.ListRepos(ctx, opts)
		if err != nil {
			return fmt.Errorf("failed to list repositories: %w", err)
		}

		for _, repo := range repoList.Repositories {
			if err := m.repositorySync.SyncRepository(ctx, repo, installationID, requestID); err != nil {
				m.logSyncError(ctx, "repository", repo.GetFullName(), err, requestID)
			}
		}

		if resp.NextPage == 0 {
			break
		}
		opts.Page = resp.NextPage
	}

	m.updateLastSyncTime(fmt.Sprintf("installation:%d", installationID))

	return nil
}

// SyncAllInstallations syncs all installations
func (m *Manager) SyncAllInstallations(ctx context.Context) error {
	if !m.config.Enabled {
		return nil
	}

	installations, err := m.githubClient.ListInstallations(ctx)
	if err != nil {
		return fmt.Errorf("failed to list installations: %w", err)
	}

	var wg sync.WaitGroup
	semaphore := make(chan struct{}, m.config.MaxConcurrency)

	for _, inst := range installations {
		wg.Add(1)
		semaphore <- struct{}{}

		go func(installationID int64) {
			defer wg.Done()
			defer func() { <-semaphore }()

			if err := m.SyncInstallation(ctx, installationID); err != nil {
				m.logSyncError(ctx, "installation", fmt.Sprintf("%d", installationID), err, generateRequestID())
			}
		}(inst.GetID())
	}

	wg.Wait()
	return nil
}

// GetLastSyncTime returns the last sync time for a given key
func (m *Manager) GetLastSyncTime(key string) time.Time {
	m.syncMutex.RLock()
	defer m.syncMutex.RUnlock()
	return m.lastSyncTime[key]
}

// updateLastSyncTime updates the last sync time for a key
func (m *Manager) updateLastSyncTime(key string) {
	m.syncMutex.Lock()
	defer m.syncMutex.Unlock()
	m.lastSyncTime[key] = time.Now().UTC()
}

// handlePushEvent handles push events
func (m *Manager) handlePushEvent(ctx context.Context, event *internalgithub.Event, requestID string) error {
	// Sync the sender
	if err := m.userSync.SyncUserFromEvent(ctx, event.Sender.ID, event.Sender.Login, string(event.Type), event.Action, requestID); err != nil {
		m.logSyncError(ctx, "user", event.Sender.Login, err, requestID)
	}

	// Sync the repository
	if event.Repository.ID != 0 {
		if err := m.repositorySync.SyncRepositoryFromEvent(ctx, event.Repository.ID, event.Repository.Name, event.Repository.FullName, event.Repository.Private, string(event.Type), event.Action, requestID); err != nil {
			m.logSyncError(ctx, "repository", event.Repository.FullName, err, requestID)
		}
	}

	return nil
}

// handlePullRequestEvent handles pull request events
func (m *Manager) handlePullRequestEvent(ctx context.Context, event *internalgithub.Event, requestID string) error {
	// Sync the sender
	if err := m.userSync.SyncUserFromEvent(ctx, event.Sender.ID, event.Sender.Login, string(event.Type), event.Action, requestID); err != nil {
		m.logSyncError(ctx, "user", event.Sender.Login, err, requestID)
	}

	// Sync the repository
	if event.Repository.ID != 0 {
		if err := m.repositorySync.SyncRepositoryFromEvent(ctx, event.Repository.ID, event.Repository.Name, event.Repository.FullName, event.Repository.Private, string(event.Type), event.Action, requestID); err != nil {
			m.logSyncError(ctx, "repository", event.Repository.FullName, err, requestID)
		}
	}

	return nil
}

// handleMembershipEvent handles membership events
func (m *Manager) handleMembershipEvent(ctx context.Context, event *internalgithub.Event, requestID string) error {
	// Sync the member
	if err := m.userSync.SyncUserFromEvent(ctx, event.Sender.ID, event.Sender.Login, string(event.Type), event.Action, requestID); err != nil {
		m.logSyncError(ctx, "user", event.Sender.Login, err, requestID)
	}

	return nil
}

// handleRepositoryEvent handles repository events
func (m *Manager) handleRepositoryEvent(ctx context.Context, event *internalgithub.Event, requestID string) error {
	switch event.Action {
	case "created", "edited", "transferred", "publicized", "privatized":
		// Sync the repository
		if event.Repository.ID != 0 {
			if err := m.repositorySync.SyncRepositoryFromEvent(ctx, event.Repository.ID, event.Repository.Name, event.Repository.FullName, event.Repository.Private, string(event.Type), event.Action, requestID); err != nil {
				m.logSyncError(ctx, "repository", event.Repository.FullName, err, requestID)
			}
		}
	case "deleted", "archived":
		// Mark repository as deleted
		if event.Repository.ID != 0 {
			if err := m.repositorySync.DeleteRepository(ctx, event.Repository.ID, event.Installation.ID, requestID); err != nil {
				m.logSyncError(ctx, "repository", event.Repository.FullName, err, requestID)
			}
		}
	}

	return nil
}

// handleInstallationEvent handles installation events
func (m *Manager) handleInstallationEvent(ctx context.Context, event *internalgithub.Event, requestID string) error {
	switch event.Action {
	case "created":
		// Full sync of the new installation
		if event.Installation.ID != 0 {
			if err := m.SyncInstallation(ctx, event.Installation.ID); err != nil {
				m.logSyncError(ctx, "installation", fmt.Sprintf("%d", event.Installation.ID), err, requestID)
			}
		}
	case "deleted":
		// Handle installation deletion - mark all resources as orphaned
		// This would require additional logic to handle cleanup
	}

	return nil
}

// handleTeamEvent handles team events
func (m *Manager) handleTeamEvent(ctx context.Context, event *internalgithub.Event, requestID string) error {
	switch event.Action {
	case "created", "edited":
		// Sync the team
		if err := m.teamSync.SyncTeamFromEvent(ctx, event.Organization.Login, event.Payload, string(event.Type), event.Action, requestID); err != nil {
			m.logSyncError(ctx, "team", event.Organization.Login, err, requestID)
		}
	case "deleted":
		// Handle team deletion
		// This would require additional logic to handle cleanup
	}

	return nil
}

// logSyncError logs a synchronization error
func (m *Manager) logSyncError(ctx context.Context, entityType, entityID string, err error, requestID string) {
	if m.auditLogger == nil {
		return
	}

	auditEntry := identity.AuditEntry{
		RequestID: requestID,
		Actor: identity.Actor{
			Type: "system",
			ID:   "github-app",
		},
		Action: fmt.Sprintf("sync_%s", entityType),
		Resource: identity.Resource{
			Type: entityType,
			ID:   entityID,
		},
		Decision: "failed",
		Reason:   err.Error(),
	}

	m.auditLogger.LogError(ctx, auditEntry, err)
}

// generateRequestID generates a unique request ID
func generateRequestID() string {
	return fmt.Sprintf("req-%d", time.Now().UnixNano())
}
