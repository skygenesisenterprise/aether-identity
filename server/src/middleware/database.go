package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/skygenesisenterprise/aether-identity/server/src/config"
	"github.com/skygenesisenterprise/aether-identity/server/src/services"
)

// DatabaseMiddleware vérifie et rétablit la connexion DB si nécessaire
func DatabaseMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Vérifier si nous sommes en mode database-less
		if services.DB == nil {
			// Mode database-less - ne pas bloquer les requêtes
			c.Set("database_less", true)
			c.Next()
			return
		}

		// Ping pour vérifier la connexion active
		sqlDB, err := services.DB.DB()
		if err != nil {
			// Erreur avec le handle de la base de données, mais ne pas bloquer en mode database-less
			c.Set("database_less", true)
			c.Next()
			return
		}

		if err := sqlDB.Ping(); err != nil {
			// Tentative de reconnexion
			cfg := config.LoadConfig()
			if reconnectErr := services.InitDB(cfg.DatabaseURL); reconnectErr != nil {
				// Échec de la reconnexion, mais ne pas bloquer en mode database-less
				c.Set("database_less", true)
				c.Set("database_error", err.Error())
				c.Next()
				return
			}
		}

		c.Next()
	}
}
