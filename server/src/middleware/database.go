package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/skygenesisenterprise/aether-identity/server/src/config"
	"github.com/skygenesisenterprise/aether-identity/server/src/services"
	"net/http"
)

// DatabaseMiddleware vérifie et rétablit la connexion DB si nécessaire
func DatabaseMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// InitialiseDB si nécessaire
		if services.DB == nil {
			cfg := config.LoadConfig()
			if err := services.InitDB(cfg.DatabaseURL); err != nil {
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
					"error": "Database initialization failed",
				})
				return
			}
		}

		// Ping pour vérifier la connexion active
		if sqlDB, err := services.DB.DB(); err == nil {
			if err := sqlDB.Ping(); err != nil {
				cfg := config.LoadConfig()
				if err := services.InitDB(cfg.DatabaseURL); err != nil {
					c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
						"error": "Database connection lost",
					})
					return
				}
			}
		} else {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
				"error": "Database handle error",
			})
			return
		}

		c.Next()
	}
}
