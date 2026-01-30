package config

import (
	"fmt"
	"os"
	"strings"

	"github.com/spf13/viper"
)

type Mode string

const (
	ModeHuman   Mode = "human"
	ModeMachine Mode = "machine"
	ModeAgent   Mode = "agent"
	ModeRuntime Mode = "runtime"
)

type Config struct {
	BaseURL string
	Mode    Mode
	Output  string
}

func Load() (*Config, error) {
	v := viper.New()

	v.SetEnvPrefix("AETHER_IDENTITY")
	v.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	v.AutomaticEnv()

	v.SetDefault("base_url", "https://identity.aether.dev")
	v.SetDefault("output", "text")

	if cfgFile := os.Getenv("AETHER_IDENTITY_CONFIG"); cfgFile != "" {
		v.SetConfigFile(cfgFile)
		if err := v.ReadInConfig(); err != nil {
			return nil, fmt.Errorf("failed to read config file: %w", err)
		}
	}

	var cfg Config
	if err := v.Unmarshal(&cfg); err != nil {
		return nil, fmt.Errorf("failed to unmarshal config: %w", err)
	}

	mode := v.GetString("mode")
	if mode != "" {
		cfg.Mode = Mode(mode)
	}

	return &cfg, nil
}

func (c *Config) Validate() error {
	if c.BaseURL == "" {
		return fmt.Errorf("base_url is required")
	}

	if c.Mode != "" {
		switch c.Mode {
		case ModeHuman, ModeMachine, ModeAgent, ModeRuntime:
		default:
			return fmt.Errorf("invalid mode: %s", c.Mode)
		}
	}

	return nil
}
