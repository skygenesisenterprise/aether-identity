package permissions

import (
	"context"
	"errors"
	"fmt"
	"time"

	apperrors "github.com/skygenesisenterprise/aether-identity/package/github/errors"
	"github.com/skygenesisenterprise/aether-identity/package/github/identity"
)

// Checker provides authorization checking capabilities
type Checker struct {
	identityClient *identity.Client
}

// NewChecker creates a new authorization checker
func NewChecker(identityClient *identity.Client) *Checker {
	return &Checker{
		identityClient: identityClient,
	}
}

// CheckResult represents the result of an authorization check
type CheckResult struct {
	Allowed   bool
	Reason    string
	Decision  string
	RequestID string
	Timestamp time.Time
}

// CheckAuthorization checks if a user is authorized to perform an action on a resource
func (c *Checker) CheckAuthorization(ctx context.Context, githubUserID string, action string, resource identity.AuthorizationResource, contextData map[string]interface{}) (*CheckResult, error) {
	requestID := generateRequestID()

	// First, resolve the GitHub user to an Identity user
	identityUser, err := c.identityClient.ResolveUser(ctx, githubUserID)
	if err != nil {
		if errors.Is(err, apperrors.ErrUserNotFound) {
			return &CheckResult{
				Allowed:   false,
				Reason:    "User not found in Identity",
				Decision:  "deny",
				RequestID: requestID,
				Timestamp: time.Now().UTC(),
			}, nil
		}
		return nil, apperrors.Wrap(err, "AUTHZ", "RESOLUTION_ERROR", "failed to resolve user")
	}

	// Build the authorization request
	authReq := identity.AuthorizationRequest{
		UserID:    identityUser.ID,
		Action:    action,
		Resource:  resource,
		Context:   contextData,
		RequestID: requestID,
		Timestamp: time.Now().UTC(),
	}

	// Ask Identity for authorization decision
	authResp, err := c.identityClient.CheckAuthorization(ctx, authReq)
	if err != nil {
		return nil, apperrors.Wrap(err, "AUTHZ", "CHECK_ERROR", "authorization check failed")
	}

	return &CheckResult{
		Allowed:   authResp.Allowed,
		Reason:    authResp.Reason,
		Decision:  authResp.Decision,
		RequestID: requestID,
		Timestamp: time.Now().UTC(),
	}, nil
}

// CheckPushAuthorization checks if a user is authorized to push to a repository
func (c *Checker) CheckPushAuthorization(ctx context.Context, githubUserID string, repoOwner, repoName, branch string, installationID int64) (*CheckResult, error) {
	resource := identity.AuthorizationResource{
		Type:         "repository",
		ID:           fmt.Sprintf("%s/%s", repoOwner, repoName),
		Name:         fmt.Sprintf("%s/%s", repoOwner, repoName),
		Organization: repoOwner,
	}

	contextData := map[string]interface{}{
		"action_type":     "push",
		"branch":          branch,
		"installation_id": installationID,
	}

	return c.CheckAuthorization(ctx, githubUserID, "push", resource, contextData)
}

// CheckPullRequestAuthorization checks if a user is authorized to perform a pull request action
func (c *Checker) CheckPullRequestAuthorization(ctx context.Context, githubUserID string, repoOwner, repoName string, prNumber int, action string, installationID int64) (*CheckResult, error) {
	resource := identity.AuthorizationResource{
		Type:         "repository",
		ID:           fmt.Sprintf("%s/%s", repoOwner, repoName),
		Name:         fmt.Sprintf("%s/%s", repoOwner, repoName),
		Organization: repoOwner,
	}

	contextData := map[string]interface{}{
		"action_type":     "pull_request",
		"pr_number":       prNumber,
		"pr_action":       action,
		"installation_id": installationID,
	}

	return c.CheckAuthorization(ctx, githubUserID, fmt.Sprintf("pull_request.%s", action), resource, contextData)
}

// CheckAdminAuthorization checks if a user is authorized to perform an admin action
func (c *Checker) CheckAdminAuthorization(ctx context.Context, githubUserID string, repoOwner, repoName, adminAction string, installationID int64) (*CheckResult, error) {
	resource := identity.AuthorizationResource{
		Type:         "repository",
		ID:           fmt.Sprintf("%s/%s", repoOwner, repoName),
		Name:         fmt.Sprintf("%s/%s", repoOwner, repoName),
		Organization: repoOwner,
	}

	contextData := map[string]interface{}{
		"action_type":     "admin",
		"admin_action":    adminAction,
		"installation_id": installationID,
	}

	return c.CheckAuthorization(ctx, githubUserID, fmt.Sprintf("admin.%s", adminAction), resource, contextData)
}

// generateRequestID generates a unique request ID
func generateRequestID() string {
	return fmt.Sprintf("authz-%d", time.Now().UnixNano())
}
