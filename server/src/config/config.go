package config

import (
	"fmt"
	"os"
)

// Config représente la configuration de l'application
type Config struct {
	JWTSecret      string
	AccessTokenExp int
	RefreshTokenExp int
	DatabaseURL    string
	Port           string
	SystemKey      string // Clé système pour les requêtes internes de l'application
}

// LoadConfig charge la configuration depuis les variables d'environnement
func LoadConfig() *Config {
	return &Config{
		JWTSecret:      getEnv("JWT_SECRET", "votre-cle-secrete-ici"),
		AccessTokenExp: getEnvAsInt("ACCESS_TOKEN_EXP", 15),
		RefreshTokenExp: getEnvAsInt("REFRESH_TOKEN_EXP", 720),
		DatabaseURL:    getEnv("DATABASE_URL", "host=localhost user=postgres password=postgres dbname=aether_identity port=5432 sslmode=disable"),
		Port:           getEnv("PORT", "8080"),
		SystemKey:      getEnv("SYSTEM_KEY", "sk_system_default_key_change_in_production"),
	}
}

// getEnv récupère une variable d'environnement avec une valeur par défaut
func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

// getEnvAsInt récupère une variable d'environnement en tant qu'entier
func getEnvAsInt(key string, defaultValue int) int {
	valueStr := os.Getenv(key)
	if valueStr == "" {
		return defaultValue
	}
	var value int
	_, err := fmt.Sscanf(valueStr, "%d", &value)
	if err != nil {
		return defaultValue
	}
	return value
}