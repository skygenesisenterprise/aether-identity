package errors

import (
	"errors"
	"fmt"
)

var (
	// Configuration errors
	ErrInvalidConfig        = errors.New("invalid configuration")
	ErrMissingEnvVar        = errors.New("missing required environment variable")
	ErrInvalidWebhookSecret = errors.New("invalid webhook secret")

	// GitHub API errors
	ErrGitHubAPIError     = errors.New("github API error")
	ErrRateLimitExceeded  = errors.New("github rate limit exceeded")
	ErrRepositoryNotFound = errors.New("repository not found")
	ErrUserNotFound       = errors.New("user not found")
	ErrTeamNotFound       = errors.New("team not found")

	// Identity API errors
	ErrIdentityAPIError    = errors.New("identity API error")
	ErrIdentityUnavailable = errors.New("identity service unavailable")
	ErrUnauthorized        = errors.New("unauthorized")
	ErrForbidden           = errors.New("forbidden")

	// Webhook errors
	ErrInvalidSignature = errors.New("invalid webhook signature")
	ErrInvalidPayload   = errors.New("invalid webhook payload")
	ErrUnsupportedEvent = errors.New("unsupported webhook event")

	// Sync errors
	ErrSyncFailed  = errors.New("synchronization failed")
	ErrPartialSync = errors.New("partial synchronization failure")
)

// AppError represents a typed application error with context
type AppError struct {
	Type    string
	Code    string
	Message string
	Cause   error
	Context map[string]interface{}
}

func (e *AppError) Error() string {
	if e.Cause != nil {
		return fmt.Sprintf("[%s:%s] %s: %v", e.Type, e.Code, e.Message, e.Cause)
	}
	return fmt.Sprintf("[%s:%s] %s", e.Type, e.Code, e.Message)
}

func (e *AppError) Unwrap() error {
	return e.Cause
}

// New creates a new AppError
func New(errType, code, message string) *AppError {
	return &AppError{
		Type:    errType,
		Code:    code,
		Message: message,
		Context: make(map[string]interface{}),
	}
}

// Wrap wraps an existing error with additional context
func Wrap(err error, errType, code, message string) *AppError {
	return &AppError{
		Type:    errType,
		Code:    code,
		Message: message,
		Cause:   err,
		Context: make(map[string]interface{}),
	}
}

// WithContext adds context to an error
func (e *AppError) WithContext(key string, value interface{}) *AppError {
	e.Context[key] = value
	return e
}

// IsConfigError checks if error is a configuration error
func IsConfigError(err error) bool {
	var appErr *AppError
	if errors.As(err, &appErr) {
		return appErr.Type == "CONFIG"
	}
	return errors.Is(err, ErrInvalidConfig) || errors.Is(err, ErrMissingEnvVar)
}

// IsGitHubError checks if error is a GitHub API error
func IsGitHubError(err error) bool {
	var appErr *AppError
	if errors.As(err, &appErr) {
		return appErr.Type == "GITHUB"
	}
	return errors.Is(err, ErrGitHubAPIError)
}

// IsIdentityError checks if error is an Identity API error
func IsIdentityError(err error) bool {
	var appErr *AppError
	if errors.As(err, &appErr) {
		return appErr.Type == "IDENTITY"
	}
	return errors.Is(err, ErrIdentityAPIError)
}

// IsWebhookError checks if error is a webhook error
func IsWebhookError(err error) bool {
	var appErr *AppError
	if errors.As(err, &appErr) {
		return appErr.Type == "WEBHOOK"
	}
	return errors.Is(err, ErrInvalidSignature) || errors.Is(err, ErrInvalidPayload)
}

// IsAuthorizationError checks if error is an authorization error
func IsAuthorizationError(err error) bool {
	return errors.Is(err, ErrUnauthorized) || errors.Is(err, ErrForbidden)
}
