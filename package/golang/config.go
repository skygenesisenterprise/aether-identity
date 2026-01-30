package identity

import (
	"net/http"

	"github.com/skygenesisenterprise/aether-identity/storage"
)

// Config holds the configuration for the Identity client
type Config struct {
	// Endpoint is the base URL of the Aether Identity API (required)
	// Example: "https://identity.aether.dev"
	Endpoint string

	// ClientID is the application/client identifier (required)
	ClientID string

	// AccessToken is an optional initial access token
	AccessToken string

	// HTTPClient is an optional custom HTTP client
	// If not provided, http.DefaultClient is used
	HTTPClient *http.Client

	// Storage is an optional custom storage implementation
	// If not provided, an in-memory storage is used
	Storage storage.Storage
}

// Validate checks if the configuration is valid
func (c Config) Validate() error {
	if c.Endpoint == "" {
		return &ConfigError{Field: "Endpoint", Message: "endpoint is required"}
	}
	if c.ClientID == "" {
		return &ConfigError{Field: "ClientID", Message: "clientID is required"}
	}
	return nil
}

// ConfigError represents a configuration validation error
type ConfigError struct {
	Field   string
	Message string
}

// Error implements the error interface
func (e *ConfigError) Error() string {
	return e.Field + ": " + e.Message
}
