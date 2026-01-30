package config

import (
	"fmt"
	"os"
	"strconv"
	"time"
)

// Config holds all configuration for the GitHub App
type Config struct {
	// Server configuration
	Server ServerConfig

	// GitHub App configuration
	GitHub GitHubConfig

	// Identity API configuration
	Identity IdentityConfig

	// Sync configuration
	Sync SyncConfig

	// Logging configuration
	Log LogConfig
}

// ServerConfig holds HTTP server configuration
type ServerConfig struct {
	Port         string
	Host         string
	ReadTimeout  time.Duration
	WriteTimeout time.Duration
	IdleTimeout  time.Duration
}

// GitHubConfig holds GitHub App credentials and settings
type GitHubConfig struct {
	AppID         int64
	PrivateKey    string
	WebhookSecret string
	ClientID      string
	ClientSecret  string
	EnterpriseURL string // For GitHub Enterprise Server
}

// IdentityConfig holds Aether Identity API configuration
type IdentityConfig struct {
	BaseURL       string
	APIKey        string
	Timeout       time.Duration
	RetryAttempts int
	RetryBackoff  time.Duration
}

// SyncConfig holds synchronization settings
type SyncConfig struct {
	Enabled        bool
	Interval       time.Duration
	BatchSize      int
	MaxConcurrency int
}

// LogConfig holds logging configuration
type LogConfig struct {
	Level  string
	Format string // json or text
}

// Load loads configuration from environment variables
func Load() (*Config, error) {
	cfg := &Config{
		Server: ServerConfig{
			Port:         getEnv("GITHUB_APP_PORT", "8080"),
			Host:         getEnv("GITHUB_APP_HOST", "0.0.0.0"),
			ReadTimeout:  getDuration("GITHUB_APP_READ_TIMEOUT", 30*time.Second),
			WriteTimeout: getDuration("GITHUB_APP_WRITE_TIMEOUT", 30*time.Second),
			IdleTimeout:  getDuration("GITHUB_APP_IDLE_TIMEOUT", 60*time.Second),
		},
		GitHub: GitHubConfig{
			AppID:         getInt64("GITHUB_APP_ID", 0),
			PrivateKey:    getEnv("GITHUB_APP_PRIVATE_KEY", ""),
			WebhookSecret: getEnv("GITHUB_APP_WEBHOOK_SECRET", ""),
			ClientID:      getEnv("GITHUB_CLIENT_ID", ""),
			ClientSecret:  getEnv("GITHUB_CLIENT_SECRET", ""),
			EnterpriseURL: getEnv("GITHUB_ENTERPRISE_URL", ""),
		},
		Identity: IdentityConfig{
			BaseURL:       getEnv("IDENTITY_API_URL", ""),
			APIKey:        getEnv("IDENTITY_API_KEY", ""),
			Timeout:       getDuration("IDENTITY_API_TIMEOUT", 30*time.Second),
			RetryAttempts: getInt("IDENTITY_RETRY_ATTEMPTS", 3),
			RetryBackoff:  getDuration("IDENTITY_RETRY_BACKOFF", 1*time.Second),
		},
		Sync: SyncConfig{
			Enabled:        getBool("SYNC_ENABLED", true),
			Interval:       getDuration("SYNC_INTERVAL", 5*time.Minute),
			BatchSize:      getInt("SYNC_BATCH_SIZE", 100),
			MaxConcurrency: getInt("SYNC_MAX_CONCURRENCY", 10),
		},
		Log: LogConfig{
			Level:  getEnv("LOG_LEVEL", "info"),
			Format: getEnv("LOG_FORMAT", "json"),
		},
	}

	if err := cfg.Validate(); err != nil {
		return nil, fmt.Errorf("configuration validation failed: %w", err)
	}

	return cfg, nil
}

// Validate validates the configuration
func (c *Config) Validate() error {
	if c.GitHub.AppID == 0 {
		return fmt.Errorf("GITHUB_APP_ID is required")
	}
	if c.GitHub.PrivateKey == "" {
		return fmt.Errorf("GITHUB_APP_PRIVATE_KEY is required")
	}
	if c.GitHub.WebhookSecret == "" {
		return fmt.Errorf("GITHUB_APP_WEBHOOK_SECRET is required")
	}
	if c.Identity.BaseURL == "" {
		return fmt.Errorf("IDENTITY_API_URL is required")
	}
	if c.Identity.APIKey == "" {
		return fmt.Errorf("IDENTITY_API_KEY is required")
	}
	return nil
}

// Helper functions
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if i, err := strconv.Atoi(value); err == nil {
			return i
		}
	}
	return defaultValue
}

func getInt64(key string, defaultValue int64) int64 {
	if value := os.Getenv(key); value != "" {
		if i, err := strconv.ParseInt(value, 10, 64); err == nil {
			return i
		}
	}
	return defaultValue
}

func getBool(key string, defaultValue bool) bool {
	if value := os.Getenv(key); value != "" {
		if b, err := strconv.ParseBool(value); err == nil {
			return b
		}
	}
	return defaultValue
}

func getDuration(key string, defaultValue time.Duration) time.Duration {
	if value := os.Getenv(key); value != "" {
		if d, err := time.ParseDuration(value); err == nil {
			return d
		}
	}
	return defaultValue
}
