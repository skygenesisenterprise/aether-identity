package config

import (
	"fmt"
	"os"

	"github.com/spf13/viper"
)

// Config représente la configuration de vaultctl
type Config struct {
	Server   ServerConfig   `mapstructure:"server"`
	Auth     AuthConfig     `mapstructure:"auth"`
	Logging  LoggingConfig  `mapstructure:"logging"`
	Features FeaturesConfig `mapstructure:"features"`
}

// ServerConfig contient la configuration serveur
type ServerConfig struct {
	Host string `mapstructure:"host"`
	Port int    `mapstructure:"port"`
}

// AuthConfig contient la configuration d'authentification
type AuthConfig struct {
	Method      string `mapstructure:"method"`
	Timeout     int    `mapstructure:"timeout"`
	MaxSessions int    `mapstructure:"max_sessions"`
}

// LoggingConfig contient la configuration de logging
type LoggingConfig struct {
	Level  string `mapstructure:"level"`
	Format string `mapstructure:"format"`
	File   string `mapstructure:"file"`
}

// FeaturesConfig contient la configuration des fonctionnalités
type FeaturesConfig struct {
	ReadOnly     bool `mapstructure:"read_only"`
	NetworkMgmt  bool `mapstructure:"network_mgmt"`
	SecurityMgmt bool `mapstructure:"security_mgmt"`
	BackupMgmt   bool `mapstructure:"backup_mgmt"`
}

// Load charge la configuration depuis les fichiers et variables d'environnement
func Load() (*Config, error) {
	viper.SetConfigName("default")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("./configs")
	viper.AddConfigPath("/etc/vaultctl")
	viper.AddConfigPath("$HOME/.vaultctl")

	// Variables d'environnement
	viper.AutomaticEnv()
	viper.SetEnvPrefix("VAULTCTL")

	// Valeurs par défaut
	setDefaults()

	// Charger le fichier de configuration
	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
			// Fichier non trouvé, utiliser les valeurs par défaut
			fmt.Println("Configuration file not found, using defaults")
		} else {
			return nil, fmt.Errorf("error reading config file: %w", err)
		}
	}

	var config Config
	if err := viper.Unmarshal(&config); err != nil {
		return nil, fmt.Errorf("error unmarshaling config: %w", err)
	}

	return &config, nil
}

func setDefaults() {
	viper.SetDefault("server.host", "localhost")
	viper.SetDefault("server.port", 8080)
	viper.SetDefault("auth.method", "pam")
	viper.SetDefault("auth.timeout", 300)
	viper.SetDefault("auth.max_sessions", 5)
	viper.SetDefault("logging.level", "info")
	viper.SetDefault("logging.format", "text")
	viper.SetDefault("logging.file", "/var/log/vaultctl.log")
	viper.SetDefault("features.read_only", false)
	viper.SetDefault("features.network_mgmt", true)
	viper.SetDefault("features.security_mgmt", true)
	viper.SetDefault("features.backup_mgmt", true)
}
