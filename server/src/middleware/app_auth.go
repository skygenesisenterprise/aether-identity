package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// AppAuthMiddleware est un middleware qui valide la clé système pour les requêtes de l'application
// Ce middleware est conçu pour être utilisé par l'application web (app/app/) pour authentifier
// les requêtes internes. La clé système est considérée comme une clé "système" et ne doit
// être utilisée que par l'application elle-même.
type AppAuthMiddleware struct {
	systemKey string
}

// NewAppAuthMiddleware crée un nouveau AppAuthMiddleware
func NewAppAuthMiddleware(systemKey string) *AppAuthMiddleware {
	return &AppAuthMiddleware{systemKey: systemKey}
}

// Authenticate valide la clé système à partir de la requête
func (m *AppAuthMiddleware) Authenticate(c *gin.Context) {
	// Get the service key from the Authorization header
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error":   "Authorization header is required",
			"message": "System key authentication required",
		})
		return
	}

	// Extract the service key from the header
	// Expected format: "Bearer sk_..." or just "sk_..."
	parts := strings.Split(authHeader, " ")
	var serviceKey string
	if len(parts) == 2 && parts[0] == "Bearer" {
		serviceKey = parts[1]
	} else if len(parts) == 1 {
		serviceKey = parts[0]
	} else {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error":   "Invalid authorization format",
			"message": "System key must be in format 'Bearer sk_...' or 'sk_...'",
		})
		return
	}

	// Vérifier si la clé correspond à la clé système
	if serviceKey != m.systemKey {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error":   "Invalid system key",
			"message": "System key is invalid",
		})
		return
	}

	// Attacher une indication au contexte que cette requête provient de l'application
	c.Set("is_app_request", true)

	// Continuer vers le prochain middleware
	c.Next()
}

// AppAuth est une fonction de commodité pour créer le middleware
func AppAuth(systemKey string) gin.HandlerFunc {
	return NewAppAuthMiddleware(systemKey).Authenticate
}
