package identity

// Models for Identity API interactions

// EntityType represents the type of entity being synchronized
type EntityType string

const (
	EntityTypeUser       EntityType = "user"
	EntityTypeRole       EntityType = "role"
	EntityTypeResource   EntityType = "resource"
	EntityTypePermission EntityType = "permission"
	EntityTypeMembership EntityType = "membership"
)

// SyncStatus represents the status of a synchronization operation
type SyncStatus string

const (
	SyncStatusPending    SyncStatus = "pending"
	SyncStatusInProgress SyncStatus = "in_progress"
	SyncStatusCompleted  SyncStatus = "completed"
	SyncStatusFailed     SyncStatus = "failed"
	SyncStatusPartial    SyncStatus = "partial"
)

// SyncResult represents the result of a synchronization operation
type SyncResult struct {
	Status      SyncStatus  `json:"status"`
	EntityType  EntityType  `json:"entity_type"`
	Processed   int         `json:"processed"`
	Succeeded   int         `json:"succeeded"`
	Failed      int         `json:"failed"`
	Errors      []SyncError `json:"errors,omitempty"`
	StartedAt   string      `json:"started_at"`
	CompletedAt string      `json:"completed_at,omitempty"`
}

// SyncError represents an error during synchronization
type SyncError struct {
	EntityID string `json:"entity_id"`
	Error    string `json:"error"`
	Code     string `json:"code"`
}

// Resource represents a resource in the Identity system
type Resource struct {
	ID             string                 `json:"id"`
	Type           string                 `json:"type"`
	Name           string                 `json:"name"`
	Description    string                 `json:"description,omitempty"`
	OrganizationID string                 `json:"organization_id,omitempty"`
	Attributes     map[string]interface{} `json:"attributes,omitempty"`
	ExternalIDs    map[string]string      `json:"external_ids,omitempty"`
}

// Membership represents a membership relationship
type Membership struct {
	ID         string `json:"id"`
	UserID     string `json:"user_id"`
	RoleID     string `json:"role_id"`
	ResourceID string `json:"resource_id,omitempty"`
}

// Permission represents a permission in the system
type Permission struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description,omitempty"`
	Resource    string `json:"resource,omitempty"`
	Action      string `json:"action"`
}

// GitHubMapping represents a mapping between GitHub and Identity entities
type GitHubMapping struct {
	GitHubID     string     `json:"github_id"`
	IdentityID   string     `json:"identity_id"`
	EntityType   EntityType `json:"entity_type"`
	Provider     string     `json:"provider"`
	LastSyncedAt string     `json:"last_synced_at"`
}

// BatchSyncRequest represents a batch synchronization request
type BatchSyncRequest struct {
	RequestID  string      `json:"request_id"`
	EntityType EntityType  `json:"entity_type"`
	Entities   []SyncEvent `json:"entities"`
	Options    SyncOptions `json:"options,omitempty"`
}

// SyncOptions represents options for synchronization
type SyncOptions struct {
	DryRun       bool `json:"dry_run,omitempty"`
	Force        bool `json:"force,omitempty"`
	SkipExisting bool `json:"skip_existing,omitempty"`
}

// BatchSyncResponse represents a batch synchronization response
type BatchSyncResponse struct {
	RequestID string     `json:"request_id"`
	Status    SyncStatus `json:"status"`
	Result    SyncResult `json:"result"`
}
