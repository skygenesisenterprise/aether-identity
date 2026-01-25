package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/skygenesisenterprise/aether-identity/server/src/config"
)

// AuthMiddleware vérifie la présence et la validité du token JWT
func AuthMiddleware() gin.HandlerFunc {
	cfg := config.LoadConfig()
	return func(c *gin.Context) {
		// Récupérer le token du header Authorization
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			// Vérifier si le token est présent dans le cookie
			if cookie, err := c.Request.Cookie("AETHER_ACCESS_TOKEN"); err == nil {
				authHeader = "Bearer " + cookie.Value
				c.Request.Header.Set("Authorization", authHeader)
			} else {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
					"error": "Authorization header is required",
				})
				return
			}
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "Authorization header must be Bearer token",
			})
			return
		}

		tokenString := parts[1]

		// Valider le token JWT
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return []byte(cfg.JWTSecret), nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid or expired token",
			})
			return
		}

		c.Next()
	}
}
