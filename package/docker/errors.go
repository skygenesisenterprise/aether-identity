package docker

import "fmt"

// ValidationError represents a validation error
type ValidationError struct {
	Message string
}

func (e ValidationError) Error() string {
	return e.Message
}

// NewValidationError creates a new validation error
func NewValidationError(message string) error {
	return ValidationError{Message: message}
}

// GenerationError represents an error during artifact generation
type GenerationError struct {
	Message string
	Cause   error
}

func (e GenerationError) Error() string {
	if e.Cause != nil {
		return fmt.Sprintf("%s: %v", e.Message, e.Cause)
	}
	return e.Message
}

func (e GenerationError) Unwrap() error {
	return e.Cause
}

// NewGenerationError creates a new generation error
func NewGenerationError(message string, cause error) error {
	return GenerationError{Message: message, Cause: cause}
}

// WrapError wraps an error with additional context
func WrapError(err error, format string, args ...interface{}) error {
	if err == nil {
		return nil
	}
	return GenerationError{
		Message: fmt.Sprintf(format, args...),
		Cause:   err,
	}
}

// IsValidationError checks if an error is a validation error
func IsValidationError(err error) bool {
	_, ok := err.(ValidationError)
	return ok
}

// IsGenerationError checks if an error is a generation error
func IsGenerationError(err error) bool {
	_, ok := err.(GenerationError)
	return ok
}
