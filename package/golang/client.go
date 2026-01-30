package identity

import (
	"github.com/skygenesisenterprise/aether-identity/auth"
	"github.com/skygenesisenterprise/aether-identity/device"
	"github.com/skygenesisenterprise/aether-identity/eid"
	"github.com/skygenesisenterprise/aether-identity/http"
	"github.com/skygenesisenterprise/aether-identity/machine"
	"github.com/skygenesisenterprise/aether-identity/session"
	"github.com/skygenesisenterprise/aether-identity/sessionmodule"
	"github.com/skygenesisenterprise/aether-identity/storage"
	"github.com/skygenesisenterprise/aether-identity/token"
	"github.com/skygenesisenterprise/aether-identity/user"
)

// Client is the main entry point for the Aether Identity SDK
type Client struct {
	Auth    *auth.Module
	Session *sessionmodule.Module
	User    *user.Module
	Token   *token.Module
	EID     *eid.Module
	Machine *machine.Module
	Device  *device.Module

	transport      *http.Transport
	sessionManager *session.Manager
}

// NewClient creates a new Identity client with the provided configuration
func NewClient(config Config) *Client {
	// Create storage (use provided or default to memory)
	store := config.Storage
	if store == nil {
		store = storage.NewMemoryStorage()
	}

	// Create session manager
	sessionManager := session.NewManager(store)

	// Set initial access token if provided
	if config.AccessToken != "" {
		sessionManager.SetToken(config.AccessToken)
	}

	// Create HTTP transport
	httpConfig := http.Config{
		BaseURL:    config.Endpoint,
		ClientID:   config.ClientID,
		HTTPClient: config.HTTPClient,
	}
	transport := http.NewTransport(httpConfig)

	// Create modules
	return &Client{
		Auth:           auth.NewModule(transport, sessionManager),
		Session:        sessionmodule.NewModule(transport, sessionManager),
		User:           user.NewModule(transport, sessionManager),
		Token:          token.NewModule(transport, sessionManager),
		EID:            eid.NewModule(transport, sessionManager),
		Machine:        machine.NewModule(transport, config.ClientID),
		Device:         device.NewModule(transport, sessionManager),
		transport:      transport,
		sessionManager: sessionManager,
	}
}

// IsAuthenticated returns whether the client has an active authenticated session
func (c *Client) IsAuthenticated() bool {
	return c.sessionManager.IsAuthenticated()
}
