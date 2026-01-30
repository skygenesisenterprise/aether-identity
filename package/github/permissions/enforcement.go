package permissions

import (
	"context"
	"fmt"
	"time"

	"github.com/skygenesisenterprise/aether-identity/package/github/identity"
)

// Enforcer enforces authorization decisions from Identity
type Enforcer struct {
	checker     *Checker
	auditLogger *identity.AuditLogger
	mapper      *Mapper
}

// EnforcementResult represents the result of an enforcement action
type EnforcementResult struct {
	Action    string
	Allowed   bool
	Reason    string
	RequestID string
	Timestamp time.Time
}

// NewEnforcer creates a new policy enforcer
func NewEnforcer(checker *Checker, auditLogger *identity.AuditLogger, mapper *Mapper) *Enforcer {
	return &Enforcer{
		checker:     checker,
		auditLogger: auditLogger,
		mapper:      mapper,
	}
}

// EnforcePush enforces authorization for a push event
func (e *Enforcer) EnforcePush(ctx context.Context, githubUserID string, repoOwner, repoName, branch string, installationID int64) (*EnforcementResult, error) {
	requestID := generateEnforcementID()

	// Check authorization
	result, err := e.checker.CheckPushAuthorization(ctx, githubUserID, repoOwner, repoName, branch, installationID)
	if err != nil {
		e.logEnforcementError(ctx, githubUserID, "push", repoOwner, repoName, err, requestID)
		return nil, err
	}

	// Log the enforcement decision
	e.logEnforcementDecision(ctx, githubUserID, "push", repoOwner, repoName, result, requestID)

	return &EnforcementResult{
		Action:    "push",
		Allowed:   result.Allowed,
		Reason:    result.Reason,
		RequestID: requestID,
		Timestamp: time.Now().UTC(),
	}, nil
}

// EnforcePullRequest enforces authorization for a pull request action
func (e *Enforcer) EnforcePullRequest(ctx context.Context, githubUserID string, repoOwner, repoName string, prNumber int, action string, installationID int64) (*EnforcementResult, error) {
	requestID := generateEnforcementID()

	// Check authorization
	result, err := e.checker.CheckPullRequestAuthorization(ctx, githubUserID, repoOwner, repoName, prNumber, action, installationID)
	if err != nil {
		e.logEnforcementError(ctx, githubUserID, fmt.Sprintf("pull_request.%s", action), repoOwner, repoName, err, requestID)
		return nil, err
	}

	// Log the enforcement decision
	e.logEnforcementDecision(ctx, githubUserID, fmt.Sprintf("pull_request.%s", action), repoOwner, repoName, result, requestID)

	return &EnforcementResult{
		Action:    fmt.Sprintf("pull_request.%s", action),
		Allowed:   result.Allowed,
		Reason:    result.Reason,
		RequestID: requestID,
		Timestamp: time.Now().UTC(),
	}, nil
}

// EnforceAdminAction enforces authorization for an admin action
func (e *Enforcer) EnforceAdminAction(ctx context.Context, githubUserID string, repoOwner, repoName, adminAction string, installationID int64) (*EnforcementResult, error) {
	requestID := generateEnforcementID()

	// Check authorization
	result, err := e.checker.CheckAdminAuthorization(ctx, githubUserID, repoOwner, repoName, adminAction, installationID)
	if err != nil {
		e.logEnforcementError(ctx, githubUserID, fmt.Sprintf("admin.%s", adminAction), repoOwner, repoName, err, requestID)
		return nil, err
	}

	// Log the enforcement decision
	e.logEnforcementDecision(ctx, githubUserID, fmt.Sprintf("admin.%s", adminAction), repoOwner, repoName, result, requestID)

	return &EnforcementResult{
		Action:    fmt.Sprintf("admin.%s", adminAction),
		Allowed:   result.Allowed,
		Reason:    result.Reason,
		RequestID: requestID,
		Timestamp: time.Now().UTC(),
	}, nil
}

// ShouldBlock returns true if the action should be blocked
func (e *EnforcementResult) ShouldBlock() bool {
	return !e.Allowed
}

// logEnforcementDecision logs an enforcement decision
func (e *Enforcer) logEnforcementDecision(ctx context.Context, githubUserID, action, repoOwner, repoName string, result *CheckResult, requestID string) {
	if e.auditLogger == nil {
		return
	}

	decision := "allow"
	if !result.Allowed {
		decision = "block"
	}

	auditEntry := identity.AuditEntry{
		RequestID: requestID,
		Actor: identity.Actor{
			Type:       "user",
			ExternalID: githubUserID,
		},
		Action: action,
		Resource: identity.Resource{
			Type: "repository",
			ID:   fmt.Sprintf("%s/%s", repoOwner, repoName),
			Name: fmt.Sprintf("%s/%s", repoOwner, repoName),
		},
		Decision: decision,
		Reason:   result.Reason,
	}

	e.auditLogger.LogEnforcement(ctx, auditEntry)
}

// logEnforcementError logs an enforcement error
func (e *Enforcer) logEnforcementError(ctx context.Context, githubUserID, action, repoOwner, repoName string, err error, requestID string) {
	if e.auditLogger == nil {
		return
	}

	auditEntry := identity.AuditEntry{
		RequestID: requestID,
		Actor: identity.Actor{
			Type:       "user",
			ExternalID: githubUserID,
		},
		Action: action,
		Resource: identity.Resource{
			Type: "repository",
			ID:   fmt.Sprintf("%s/%s", repoOwner, repoName),
			Name: fmt.Sprintf("%s/%s", repoOwner, repoName),
		},
		Decision: "error",
		Reason:   err.Error(),
	}

	e.auditLogger.LogError(ctx, auditEntry, err)
}

// generateEnforcementID generates a unique enforcement ID
func generateEnforcementID() string {
	return fmt.Sprintf("enf-%d", time.Now().UnixNano())
}
