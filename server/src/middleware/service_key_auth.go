package middleware

import (
	"net/http"
	"strings"

	"github.com/skygenesisenterprise/aether-identity/server/src/services"
	"github.com/gin-gonic/gin"
)

// ServiceKeyAuthMiddleware is a middleware that validates service keys
type ServiceKeyAuthMiddleware struct {
	ServiceKeyService *services.ServiceKeyService
}

// NewServiceKeyAuthMiddleware creates a new ServiceKeyAuthMiddleware
func NewServiceKeyAuthMiddleware(serviceKeyService *services.ServiceKeyService) *ServiceKeyAuthMiddleware {
	return &ServiceKeyAuthMiddleware{ServiceKeyService: serviceKeyService}
}

// Authenticate validates the service key from the request
func (m *ServiceKeyAuthMiddleware) Authenticate(c *gin.Context) {
	// Get the service key from the Authorization header
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error":   "Authorization header is required",
			"message": "Service key authentication required",
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
			"message": "Service key must be in format 'Bearer sk_...' or 'sk_...'",
		})
		return
	}

	// Validate the service key
	isValid, err := m.ServiceKeyService.ValidateServiceKey(serviceKey)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error":   "Invalid service key",
			"message": err.Error(),
		})
		return
	}

	if !isValid {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error":   "Invalid service key",
			"message": "Service key is invalid or expired",
		})
		return
	}

	// Get the service key details to attach to the context
	serviceKeyDetails, err := m.ServiceKeyService.GetServiceKeyByKey(serviceKey)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Internal server error",
			"message": "Failed to retrieve service key details",
		})
		return
	}

	// Attach the service key to the context
	c.Set("service_key", serviceKeyDetails)

	// Continue to the next middleware
	c.Next()
}

// ServiceKeyAuth is a convenience function to create the middleware
func ServiceKeyAuth(serviceKeyService *services.ServiceKeyService) gin.HandlerFunc {
	return NewServiceKeyAuthMiddleware(serviceKeyService).Authenticate
}
