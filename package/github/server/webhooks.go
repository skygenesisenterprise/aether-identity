package server

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/skygenesisenterprise/aether-identity/package/github/errors"
	"github.com/skygenesisenterprise/aether-identity/package/github/github"
	"github.com/skygenesisenterprise/aether-identity/package/github/identity"
	"github.com/skygenesisenterprise/aether-identity/package/github/permissions"
	"github.com/skygenesisenterprise/aether-identity/package/github/sync"
)

// WebhookHandler handles GitHub webhook events
type WebhookHandler struct {
	eventParser  *github.EventParser
	syncManager  *sync.Manager
	enforcer     *permissions.Enforcer
	auditLogger  *identity.AuditLogger
	githubClient *github.Client
}

// NewWebhookHandler creates a new webhook handler
func NewWebhookHandler(
	eventParser *github.EventParser,
	syncManager *sync.Manager,
	enforcer *permissions.Enforcer,
	auditLogger *identity.AuditLogger,
	githubClient *github.Client,
) *WebhookHandler {
	return &WebhookHandler{
		eventParser:  eventParser,
		syncManager:  syncManager,
		enforcer:     enforcer,
		auditLogger:  auditLogger,
		githubClient: githubClient,
	}
}

// Handle processes incoming webhook requests
func (h *WebhookHandler) Handle(w http.ResponseWriter, r *http.Request) {
	requestID := generateRequestID()
	startTime := time.Now()

	// Only accept POST requests
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Get event type from header
	eventType := r.Header.Get("X-GitHub-Event")
	if eventType == "" {
		http.Error(w, "Missing X-GitHub-Event header", http.StatusBadRequest)
		return
	}

	// Get delivery ID
	deliveryID := r.Header.Get("X-GitHub-Delivery")
	if deliveryID == "" {
		deliveryID = requestID
	}

	// Get signature
	signature := r.Header.Get("X-Hub-Signature-256")
	if signature == "" {
		signature = r.Header.Get("X-Hub-Signature")
	}

	// Read body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Printf("[%s] Error reading body: %v", requestID, err)
		http.Error(w, "Error reading body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	// Validate signature
	if err := h.githubClient.ValidateWebhookSignature(body, signature); err != nil {
		log.Printf("[%s] Invalid signature: %v", requestID, err)
		http.Error(w, "Invalid signature", http.StatusUnauthorized)
		return
	}

	// Parse event
	event, err := h.eventParser.ParseEvent(eventType, body)
	if err != nil {
		log.Printf("[%s] Error parsing event: %v", requestID, err)
		http.Error(w, "Error parsing event", http.StatusBadRequest)
		return
	}

	event.DeliveryID = deliveryID
	event.ReceivedAt = startTime

	log.Printf("[%s] Received %s event (delivery: %s)", requestID, eventType, deliveryID)

	// Handle ping events immediately
	if eventType == "ping" {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status": "pong"}`))
		return
	}

	// Process event asynchronously for non-sensitive events
	if event.IsSensitiveAction() {
		// For sensitive events, enforce authorization
		result, err := h.enforceAuthorization(r.Context(), event)
		if err != nil {
			log.Printf("[%s] Authorization check error: %v", requestID, err)
			// Log error but don't block - let Identity decide
		}

		if result != nil && result.ShouldBlock() {
			log.Printf("[%s] Action blocked: %s", requestID, result.Reason)
			w.WriteHeader(http.StatusForbidden)
			json.NewEncoder(w).Encode(map[string]interface{}{
				"status":     "blocked",
				"reason":     result.Reason,
				"request_id": requestID,
			})
			return
		}
	}

	// Sync event data to Identity
	go func() {
		ctx := context.Background()
		if err := h.syncManager.HandleEvent(ctx, event); err != nil {
			log.Printf("[%s] Sync error: %v", requestID, err)
		}
	}()

	// Return success immediately
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status": "ok"}`))

	log.Printf("[%s] Event processed in %v", requestID, time.Since(startTime))
}

// enforceAuthorization enforces authorization for sensitive actions
func (h *WebhookHandler) enforceAuthorization(ctx context.Context, event *github.Event) (*permissions.EnforcementResult, error) {
	// Extract repository info
	owner, repo, err := event.GetRepositoryInfo()
	if err != nil {
		return nil, err
	}

	// Get actor
	actor := event.GetActor()
	githubUserID := fmt.Sprintf("%d", actor.ID)

	switch event.Type {
	case github.EventTypePush:
		// For push events, check push authorization
		branch := "main" // Default branch - should extract from event
		if payload, ok := event.Payload["ref"].(string); ok {
			branch = extractBranchFromRef(payload)
		}
		return h.enforcer.EnforcePush(ctx, githubUserID, owner, repo, branch, event.Installation.ID)

	case github.EventTypePullRequest:
		// For PR events, check PR authorization
		prNumber := 0
		if payload, ok := event.Payload["number"].(float64); ok {
			prNumber = int(payload)
		}
		return h.enforcer.EnforcePullRequest(ctx, githubUserID, owner, repo, prNumber, event.Action, event.Installation.ID)

	default:
		// For other events, allow by default (Identity will handle via sync)
		return &permissions.EnforcementResult{
			Allowed:   true,
			Reason:    "Non-sensitive event - allowed by default",
			RequestID: generateRequestID(),
		}, nil
	}
}

// extractBranchFromRef extracts branch name from git ref
func extractBranchFromRef(ref string) string {
	if len(ref) > 11 && ref[:11] == "refs/heads/" {
		return ref[11:]
	}
	return ref
}

// generateRequestID generates a unique request ID
func generateRequestID() string {
	return fmt.Sprintf("webhook-%d", time.Now().UnixNano())
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Error     string `json:"error"`
	RequestID string `json:"request_id"`
	Timestamp string `json:"timestamp"`
}

// WriteError writes an error response
func WriteError(w http.ResponseWriter, err error, requestID string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	response := ErrorResponse{
		Error:     err.Error(),
		RequestID: requestID,
		Timestamp: time.Now().UTC().Format(time.RFC3339),
	}

	json.NewEncoder(w).Encode(response)
}

// IsRetryableError checks if an error is retryable
func IsRetryableError(err error) bool {
	return errors.IsGitHubError(err) || errors.IsIdentityError(err)
}
