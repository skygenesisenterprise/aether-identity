package http

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/skygenesisenterprise/aether-identity/errors"
)

const (
	defaultMaxRetries = 3
	defaultRetryDelay = 1000 * time.Millisecond
)

// Client defines the HTTP client interface
type Client interface {
	Get(ctx context.Context, endpoint string, accessToken string) ([]byte, error)
	Post(ctx context.Context, endpoint string, data interface{}, accessToken string) ([]byte, error)
	Put(ctx context.Context, endpoint string, data interface{}, accessToken string) ([]byte, error)
	Delete(ctx context.Context, endpoint string, accessToken string) ([]byte, error)
}

// Config holds the HTTP client configuration
type Config struct {
	BaseURL    string
	ClientID   string
	HTTPClient *http.Client
	MaxRetries int
	RetryDelay time.Duration
}

// Transport implements the HTTP client with retry logic
type Transport struct {
	config Config
	client *http.Client
}

// NewTransport creates a new HTTP transport
func NewTransport(config Config) *Transport {
	if config.HTTPClient == nil {
		config.HTTPClient = http.DefaultClient
	}
	if config.MaxRetries == 0 {
		config.MaxRetries = defaultMaxRetries
	}
	if config.RetryDelay == 0 {
		config.RetryDelay = defaultRetryDelay
	}

	return &Transport{
		config: config,
		client: config.HTTPClient,
	}
}

// request performs an HTTP request with retry logic
func (t *Transport) request(ctx context.Context, method, endpoint string, body []byte, accessToken string, retries int) ([]byte, error) {
	url := t.config.BaseURL + endpoint

	var bodyReader io.Reader
	if body != nil {
		bodyReader = bytes.NewReader(body)
	}

	req, err := http.NewRequestWithContext(ctx, method, url, bodyReader)
	if err != nil {
		return nil, errors.NewNetworkError(fmt.Sprintf("failed to create request: %v", err), "")
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Client-ID", t.config.ClientID)

	if accessToken != "" {
		req.Header.Set("Authorization", "Bearer "+accessToken)
	}

	resp, err := t.client.Do(req)
	if err != nil {
		if retries > 0 && t.isRetryableError(err) {
			time.Sleep(t.config.RetryDelay * time.Duration(t.config.MaxRetries-retries+1))
			return t.request(ctx, method, endpoint, body, accessToken, retries-1)
		}
		return nil, errors.NewNetworkError(fmt.Sprintf("request failed: %v", err), "")
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, errors.NewNetworkError(fmt.Sprintf("failed to read response: %v", err), "")
	}

	if resp.StatusCode >= 200 && resp.StatusCode < 300 {
		return respBody, nil
	}

	// Parse error response
	var errorData map[string]interface{}
	if err := json.Unmarshal(respBody, &errorData); err != nil {
		errorData = make(map[string]interface{})
	}

	requestID := resp.Header.Get("X-Request-ID")
	if requestID == "" {
		if rid, ok := errorData["requestId"].(string); ok {
			requestID = rid
		}
	}

	err = errors.CreateErrorFromResponse(resp.StatusCode, errorData, requestID)

	if retries > 0 && errors.IsRetryableError(err) {
		time.Sleep(t.config.RetryDelay * time.Duration(t.config.MaxRetries-retries+1))
		return t.request(ctx, method, endpoint, body, accessToken, retries-1)
	}

	return nil, err
}

// isRetryableError checks if an error is retryable
func (t *Transport) isRetryableError(err error) bool {
	return err != nil
}

// Get performs a GET request
func (t *Transport) Get(ctx context.Context, endpoint string, accessToken string) ([]byte, error) {
	return t.request(ctx, http.MethodGet, endpoint, nil, accessToken, t.config.MaxRetries)
}

// Post performs a POST request
func (t *Transport) Post(ctx context.Context, endpoint string, data interface{}, accessToken string) ([]byte, error) {
	var body []byte
	if data != nil {
		var err error
		body, err = json.Marshal(data)
		if err != nil {
			return nil, errors.NewIdentityError("failed to marshal request body", errors.ErrInvalidInput, "")
		}
	}
	return t.request(ctx, http.MethodPost, endpoint, body, accessToken, t.config.MaxRetries)
}

// Put performs a PUT request
func (t *Transport) Put(ctx context.Context, endpoint string, data interface{}, accessToken string) ([]byte, error) {
	var body []byte
	if data != nil {
		var err error
		body, err = json.Marshal(data)
		if err != nil {
			return nil, errors.NewIdentityError("failed to marshal request body", errors.ErrInvalidInput, "")
		}
	}
	return t.request(ctx, http.MethodPut, endpoint, body, accessToken, t.config.MaxRetries)
}

// Delete performs a DELETE request
func (t *Transport) Delete(ctx context.Context, endpoint string, accessToken string) ([]byte, error) {
	return t.request(ctx, http.MethodDelete, endpoint, nil, accessToken, t.config.MaxRetries)
}
