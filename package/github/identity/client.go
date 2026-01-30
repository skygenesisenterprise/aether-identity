package identity

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/skygenesisenterprise/aether-identity/package/github/config"
	"github.com/skygenesisenterprise/aether-identity/package/github/errors"
)

// Client provides an interface to the Aether Identity API
type Client struct {
	baseURL       string
	apiKey        string
	httpClient    *http.Client
	retryAttempts int
	retryBackoff  time.Duration
}

// NewClient creates a new Identity API client
func NewClient(cfg config.IdentityConfig) *Client {
	return &Client{
		baseURL:       cfg.BaseURL,
		apiKey:        cfg.APIKey,
		httpClient:    &http.Client{Timeout: cfg.Timeout},
		retryAttempts: cfg.RetryAttempts,
		retryBackoff:  cfg.RetryBackoff,
	}
}

// AuthorizationRequest represents a request to check authorization
type AuthorizationRequest struct {
	UserID    string                 `json:"user_id"`
	Action    string                 `json:"action"`
	Resource  AuthorizationResource  `json:"resource"`
	Context   map[string]interface{} `json:"context,omitempty"`
	RequestID string                 `json:"request_id"`
	Timestamp time.Time              `json:"timestamp"`
}

// AuthorizationResource represents a resource in the authorization system
type AuthorizationResource struct {
	Type         string `json:"type"`
	ID           string `json:"id"`
	Name         string `json:"name,omitempty"`
	Organization string `json:"organization,omitempty"`
}

// AuthorizationResponse represents the response from an authorization check
type AuthorizationResponse struct {
	Allowed  bool                   `json:"allowed"`
	Reason   string                 `json:"reason,omitempty"`
	Decision string                 `json:"decision"`
	Metadata map[string]interface{} `json:"metadata,omitempty"`
}

// User represents an Identity user
type User struct {
	ID         string                 `json:"id"`
	ExternalID string                 `json:"external_id"`
	Provider   string                 `json:"provider"`
	Email      string                 `json:"email"`
	Name       string                 `json:"name"`
	Roles      []string               `json:"roles"`
	Attributes map[string]interface{} `json:"attributes,omitempty"`
	CreatedAt  time.Time              `json:"created_at"`
	UpdatedAt  time.Time              `json:"updated_at"`
}

// Role represents an Identity role (mapped from GitHub Team)
type Role struct {
	ID          string   `json:"id"`
	Name        string   `json:"name"`
	Description string   `json:"description,omitempty"`
	Permissions []string `json:"permissions"`
}

// SyncEvent represents a synchronization event to send to Identity
type SyncEvent struct {
	EventType  string                 `json:"event_type"`
	Provider   string                 `json:"provider"`
	EntityType string                 `json:"entity_type"`
	EntityID   string                 `json:"entity_id"`
	Data       map[string]interface{} `json:"data"`
	Timestamp  time.Time              `json:"timestamp"`
	RequestID  string                 `json:"request_id"`
}

// CheckAuthorization asks Identity if a user is allowed to perform an action
func (c *Client) CheckAuthorization(ctx context.Context, req AuthorizationRequest) (*AuthorizationResponse, error) {
	url := fmt.Sprintf("%s/api/v1/authz/check", c.baseURL)

	body, err := json.Marshal(req)
	if err != nil {
		return nil, errors.Wrap(err, "IDENTITY", "SERIALIZATION_ERROR", "failed to marshal authorization request")
	}

	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(body))
	if err != nil {
		return nil, errors.Wrap(err, "IDENTITY", "REQUEST_ERROR", "failed to create authorization request")
	}

	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Authorization", fmt.Sprintf("Bearer %s", c.apiKey))
	httpReq.Header.Set("X-Request-ID", req.RequestID)

	resp, err := c.doWithRetry(httpReq)
	if err != nil {
		return nil, errors.Wrap(err, "IDENTITY", "API_ERROR", "authorization check failed")
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, errors.New("IDENTITY", "API_ERROR", fmt.Sprintf("authorization check returned status %d", resp.StatusCode))
	}

	var authResp AuthorizationResponse
	if err := json.NewDecoder(resp.Body).Decode(&authResp); err != nil {
		return nil, errors.Wrap(err, "IDENTITY", "DESERIALIZATION_ERROR", "failed to decode authorization response")
	}

	return &authResp, nil
}

// ResolveUser resolves a GitHub user to an Identity user
func (c *Client) ResolveUser(ctx context.Context, githubUserID string) (*User, error) {
	url := fmt.Sprintf("%s/api/v1/users/resolve?provider=github&external_id=%s", c.baseURL, githubUserID)

	httpReq, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, errors.Wrap(err, "IDENTITY", "REQUEST_ERROR", "failed to create user resolve request")
	}

	httpReq.Header.Set("Authorization", fmt.Sprintf("Bearer %s", c.apiKey))

	resp, err := c.doWithRetry(httpReq)
	if err != nil {
		return nil, errors.Wrap(err, "IDENTITY", "API_ERROR", "user resolution failed")
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusNotFound {
		return nil, errors.ErrUserNotFound
	}

	if resp.StatusCode != http.StatusOK {
		return nil, errors.New("IDENTITY", "API_ERROR", fmt.Sprintf("user resolution returned status %d", resp.StatusCode))
	}

	var user User
	if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {
		return nil, errors.Wrap(err, "IDENTITY", "DESERIALIZATION_ERROR", "failed to decode user response")
	}

	return &user, nil
}

// SyncEntity sends a synchronization event to Identity
func (c *Client) SyncEntity(ctx context.Context, event SyncEvent) error {
	url := fmt.Sprintf("%s/api/v1/sync/github", c.baseURL)

	body, err := json.Marshal(event)
	if err != nil {
		return errors.Wrap(err, "IDENTITY", "SERIALIZATION_ERROR", "failed to marshal sync event")
	}

	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(body))
	if err != nil {
		return errors.Wrap(err, "IDENTITY", "REQUEST_ERROR", "failed to create sync request")
	}

	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Authorization", fmt.Sprintf("Bearer %s", c.apiKey))
	httpReq.Header.Set("X-Request-ID", event.RequestID)

	resp, err := c.doWithRetry(httpReq)
	if err != nil {
		return errors.Wrap(err, "IDENTITY", "API_ERROR", "sync failed")
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		return errors.New("IDENTITY", "API_ERROR", fmt.Sprintf("sync returned status %d", resp.StatusCode))
	}

	return nil
}

// GetUserRoles retrieves roles for a user from Identity
func (c *Client) GetUserRoles(ctx context.Context, userID string) ([]Role, error) {
	url := fmt.Sprintf("%s/api/v1/users/%s/roles", c.baseURL, userID)

	httpReq, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, errors.Wrap(err, "IDENTITY", "REQUEST_ERROR", "failed to create roles request")
	}

	httpReq.Header.Set("Authorization", fmt.Sprintf("Bearer %s", c.apiKey))

	resp, err := c.doWithRetry(httpReq)
	if err != nil {
		return nil, errors.Wrap(err, "IDENTITY", "API_ERROR", "failed to get user roles")
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, errors.New("IDENTITY", "API_ERROR", fmt.Sprintf("get roles returned status %d", resp.StatusCode))
	}

	var roles []Role
	if err := json.NewDecoder(resp.Body).Decode(&roles); err != nil {
		return nil, errors.Wrap(err, "IDENTITY", "DESERIALIZATION_ERROR", "failed to decode roles response")
	}

	return roles, nil
}

// doWithRetry performs an HTTP request with retry logic
func (c *Client) doWithRetry(req *http.Request) (*http.Response, error) {
	var lastErr error

	for attempt := 0; attempt <= c.retryAttempts; attempt++ {
		if attempt > 0 {
			time.Sleep(c.retryBackoff * time.Duration(attempt))
		}

		resp, err := c.httpClient.Do(req)
		if err != nil {
			lastErr = err
			continue
		}

		// Don't retry on 4xx errors (client errors)
		if resp.StatusCode >= 400 && resp.StatusCode < 500 {
			return resp, nil
		}

		// Success or non-retryable error
		if resp.StatusCode < 500 {
			return resp, nil
		}

		// Server error - retry
		resp.Body.Close()
		lastErr = fmt.Errorf("server error: %d", resp.StatusCode)
	}

	return nil, lastErr
}
