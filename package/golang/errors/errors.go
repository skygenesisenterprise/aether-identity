package errors

import (
	"fmt"
)

// ErrorCode represents the type of error that occurred
type ErrorCode string

const (
	// ErrAuthenticationFailed indicates authentication failed
	ErrAuthenticationFailed ErrorCode = "AUTHENTICATION_FAILED"
	// ErrAuthorizationFailed indicates authorization failed
	ErrAuthorizationFailed ErrorCode = "AUTHORIZATION_FAILED"
	// ErrSessionExpired indicates the session has expired
	ErrSessionExpired ErrorCode = "SESSION_EXPIRED"
	// ErrTOTPRequired indicates TOTP verification is required
	ErrTOTPRequired ErrorCode = "TOTP_REQUIRED"
	// ErrDeviceNotAvailable indicates the device is not available
	ErrDeviceNotAvailable ErrorCode = "DEVICE_NOT_AVAILABLE"
	// ErrInvalidInput indicates invalid input was provided
	ErrInvalidInput ErrorCode = "INVALID_INPUT"
	// ErrNetworkError indicates a network error occurred
	ErrNetworkError ErrorCode = "NETWORK_ERROR"
	// ErrServerError indicates a server error occurred
	ErrServerError ErrorCode = "SERVER_ERROR"
)

// IdentityError is the base error type for all identity-related errors
type IdentityError struct {
	Code      ErrorCode
	Message   string
	RequestID string
}

// Error implements the error interface
func (e *IdentityError) Error() string {
	if e.RequestID != "" {
		return fmt.Sprintf("%s (code: %s, request_id: %s)", e.Message, e.Code, e.RequestID)
	}
	return fmt.Sprintf("%s (code: %s)", e.Message, e.Code)
}

// AuthenticationError indicates authentication failed
type AuthenticationError struct {
	IdentityError
}

// NewAuthenticationError creates a new AuthenticationError
func NewAuthenticationError(message string, requestID string) *AuthenticationError {
	if message == "" {
		message = "Authentication failed"
	}
	return &AuthenticationError{
		IdentityError: IdentityError{
			Code:      ErrAuthenticationFailed,
			Message:   message,
			RequestID: requestID,
		},
	}
}

// AuthorizationError indicates authorization failed
type AuthorizationError struct {
	IdentityError
}

// NewAuthorizationError creates a new AuthorizationError
func NewAuthorizationError(message string, requestID string) *AuthorizationError {
	if message == "" {
		message = "Authorization failed"
	}
	return &AuthorizationError{
		IdentityError: IdentityError{
			Code:      ErrAuthorizationFailed,
			Message:   message,
			RequestID: requestID,
		},
	}
}

// SessionExpiredError indicates the session has expired
type SessionExpiredError struct {
	IdentityError
}

// NewSessionExpiredError creates a new SessionExpiredError
func NewSessionExpiredError(message string, requestID string) *SessionExpiredError {
	if message == "" {
		message = "Session expired"
	}
	return &SessionExpiredError{
		IdentityError: IdentityError{
			Code:      ErrSessionExpired,
			Message:   message,
			RequestID: requestID,
		},
	}
}

// TOTPRequiredError indicates TOTP verification is required
type TOTPRequiredError struct {
	IdentityError
}

// NewTOTPRequiredError creates a new TOTPRequiredError
func NewTOTPRequiredError(message string, requestID string) *TOTPRequiredError {
	if message == "" {
		message = "TOTP verification required"
	}
	return &TOTPRequiredError{
		IdentityError: IdentityError{
			Code:      ErrTOTPRequired,
			Message:   message,
			RequestID: requestID,
		},
	}
}

// DeviceNotAvailableError indicates the device is not available
type DeviceNotAvailableError struct {
	IdentityError
}

// NewDeviceNotAvailableError creates a new DeviceNotAvailableError
func NewDeviceNotAvailableError(message string, requestID string) *DeviceNotAvailableError {
	if message == "" {
		message = "Device not available"
	}
	return &DeviceNotAvailableError{
		IdentityError: IdentityError{
			Code:      ErrDeviceNotAvailable,
			Message:   message,
			RequestID: requestID,
		},
	}
}

// NetworkError indicates a network error occurred
type NetworkError struct {
	IdentityError
}

// NewNetworkError creates a new NetworkError
func NewNetworkError(message string, requestID string) *NetworkError {
	if message == "" {
		message = "Network error occurred"
	}
	return &NetworkError{
		IdentityError: IdentityError{
			Code:      ErrNetworkError,
			Message:   message,
			RequestID: requestID,
		},
	}
}

// ServerError indicates a server error occurred
type ServerError struct {
	IdentityError
}

// NewServerError creates a new ServerError
func NewServerError(message string, requestID string) *ServerError {
	if message == "" {
		message = "Server error occurred"
	}
	return &ServerError{
		IdentityError: IdentityError{
			Code:      ErrServerError,
			Message:   message,
			RequestID: requestID,
		},
	}
}

// CreateErrorFromResponse creates an appropriate error from an HTTP response
func CreateErrorFromResponse(statusCode int, data map[string]interface{}, requestID string) error {
	// Extract message from data
	message := ""
	if msg, ok := data["message"].(string); ok {
		message = msg
	}

	// Extract code from data
	code := ""
	if c, ok := data["code"].(string); ok {
		code = c
	}

	// Check for requiresTOTP flag
	requiresTOTP := false
	if req, ok := data["requiresTOTP"].(bool); ok {
		requiresTOTP = req
	}

	switch {
	case statusCode == 401 && code == "SESSION_EXPIRED":
		if message == "" {
			message = "Session expired"
		}
		return NewSessionExpiredError(message, requestID)
	case statusCode == 401 && (code == "TOTP_REQUIRED" || requiresTOTP):
		if message == "" {
			message = "TOTP verification required"
		}
		return NewTOTPRequiredError(message, requestID)
	case statusCode == 401:
		return NewAuthenticationError(message, requestID)
	case statusCode == 403:
		return NewAuthorizationError(message, requestID)
	case code == "DEVICE_NOT_AVAILABLE":
		return NewDeviceNotAvailableError(message, requestID)
	case statusCode >= 500:
		return NewServerError(message, requestID)
	default:
		if message == "" {
			message = "An error occurred"
		}
		return &IdentityError{
			Code:      ErrInvalidInput,
			Message:   message,
			RequestID: requestID,
		}
	}
}

// NewIdentityError creates a new IdentityError with the specified code
func NewIdentityError(message string, code ErrorCode, requestID string) *IdentityError {
	return &IdentityError{
		Code:      code,
		Message:   message,
		RequestID: requestID,
	}
}

// IsRetryableError returns true if the error is retryable
func IsRetryableError(err error) bool {
	if err == nil {
		return false
	}

	switch err.(type) {
	case *NetworkError, *ServerError:
		return true
	default:
		return false
	}
}
