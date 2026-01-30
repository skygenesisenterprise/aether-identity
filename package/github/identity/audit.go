package identity

import (
	"context"
	"time"

	"github.com/skygenesisenterprise/aether-identity/package/github/errors"
)

// AuditLogger provides audit logging capabilities for authorization decisions
type AuditLogger struct {
	client *Client
}

// NewAuditLogger creates a new audit logger
func NewAuditLogger(client *Client) *AuditLogger {
	return &AuditLogger{client: client}
}

// AuditEntry represents a single audit log entry
type AuditEntry struct {
	ID            string                 `json:"id"`
	Timestamp     time.Time              `json:"timestamp"`
	RequestID     string                 `json:"request_id"`
	EventType     AuditEventType         `json:"event_type"`
	Actor         Actor                  `json:"actor"`
	Action        string                 `json:"action"`
	Resource      Resource               `json:"resource"`
	Decision      string                 `json:"decision"`
	Reason        string                 `json:"reason,omitempty"`
	GitHubContext GitHubContext          `json:"github_context,omitempty"`
	Metadata      map[string]interface{} `json:"metadata,omitempty"`
}

// AuditEventType represents the type of audit event
type AuditEventType string

const (
	AuditEventAuthorization AuditEventType = "AUTHORIZATION"
	AuditEventSync          AuditEventType = "SYNC"
	AuditEventEnforcement   AuditEventType = "ENFORCEMENT"
	AuditEventError         AuditEventType = "ERROR"
)

// Actor represents the entity performing an action
type Actor struct {
	Type       string `json:"type"` // "user", "app", "service"
	ID         string `json:"id"`
	ExternalID string `json:"external_id,omitempty"`
	Name       string `json:"name,omitempty"`
	Email      string `json:"email,omitempty"`
}

// GitHubContext holds GitHub-specific context for audit entries
type GitHubContext struct {
	EventType      string `json:"event_type,omitempty"`
	Repository     string `json:"repository,omitempty"`
	Organization   string `json:"organization,omitempty"`
	InstallationID int64  `json:"installation_id,omitempty"`
	PullRequestID  int    `json:"pull_request_id,omitempty"`
	CommitSHA      string `json:"commit_sha,omitempty"`
	Branch         string `json:"branch,omitempty"`
}

// LogAuthorization logs an authorization decision
func (a *AuditLogger) LogAuthorization(ctx context.Context, entry AuditEntry) error {
	entry.EventType = AuditEventAuthorization
	entry.Timestamp = time.Now().UTC()

	if entry.ID == "" {
		entry.ID = generateID()
	}

	// Send to Identity audit API
	syncEvent := SyncEvent{
		EventType:  "audit",
		Provider:   "github",
		EntityType: "audit_entry",
		EntityID:   entry.ID,
		Data: map[string]interface{}{
			"entry": entry,
		},
		Timestamp: entry.Timestamp,
		RequestID: entry.RequestID,
	}

	if err := a.client.SyncEntity(ctx, syncEvent); err != nil {
		return errors.Wrap(err, "AUDIT", "LOG_ERROR", "failed to log authorization")
	}

	return nil
}

// LogSync logs a synchronization event
func (a *AuditLogger) LogSync(ctx context.Context, entry AuditEntry) error {
	entry.EventType = AuditEventSync
	entry.Timestamp = time.Now().UTC()

	if entry.ID == "" {
		entry.ID = generateID()
	}

	syncEvent := SyncEvent{
		EventType:  "audit",
		Provider:   "github",
		EntityType: "audit_entry",
		EntityID:   entry.ID,
		Data: map[string]interface{}{
			"entry": entry,
		},
		Timestamp: entry.Timestamp,
		RequestID: entry.RequestID,
	}

	if err := a.client.SyncEntity(ctx, syncEvent); err != nil {
		return errors.Wrap(err, "AUDIT", "LOG_ERROR", "failed to log sync")
	}

	return nil
}

// LogEnforcement logs a policy enforcement action
func (a *AuditLogger) LogEnforcement(ctx context.Context, entry AuditEntry) error {
	entry.EventType = AuditEventEnforcement
	entry.Timestamp = time.Now().UTC()

	if entry.ID == "" {
		entry.ID = generateID()
	}

	syncEvent := SyncEvent{
		EventType:  "audit",
		Provider:   "github",
		EntityType: "audit_entry",
		EntityID:   entry.ID,
		Data: map[string]interface{}{
			"entry": entry,
		},
		Timestamp: entry.Timestamp,
		RequestID: entry.RequestID,
	}

	if err := a.client.SyncEntity(ctx, syncEvent); err != nil {
		return errors.Wrap(err, "AUDIT", "LOG_ERROR", "failed to log enforcement")
	}

	return nil
}

// LogError logs an error event
func (a *AuditLogger) LogError(ctx context.Context, entry AuditEntry, err error) error {
	entry.EventType = AuditEventError
	entry.Timestamp = time.Now().UTC()

	if entry.ID == "" {
		entry.ID = generateID()
	}

	if entry.Metadata == nil {
		entry.Metadata = make(map[string]interface{})
	}
	entry.Metadata["error"] = err.Error()

	syncEvent := SyncEvent{
		EventType:  "audit",
		Provider:   "github",
		EntityType: "audit_entry",
		EntityID:   entry.ID,
		Data: map[string]interface{}{
			"entry": entry,
		},
		Timestamp: entry.Timestamp,
		RequestID: entry.RequestID,
	}

	if syncErr := a.client.SyncEntity(ctx, syncEvent); syncErr != nil {
		return errors.Wrap(syncErr, "AUDIT", "LOG_ERROR", "failed to log error")
	}

	return nil
}

// generateID generates a unique ID for audit entries
func generateID() string {
	return time.Now().Format("20060102-150405-") + randomString(8)
}

// randomString generates a random string of the specified length
func randomString(length int) string {
	const charset = "abcdefghijklmnopqrstuvwxyz0123456789"
	b := make([]byte, length)
	for i := range b {
		b[i] = charset[time.Now().UnixNano()%int64(len(charset))]
	}
	return string(b)
}
