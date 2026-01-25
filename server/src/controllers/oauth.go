package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Authorize redirige vers le provider OAuth2 (MVP: redirection simulée)
func Authorize(c *gin.Context) {
	provider := c.Query("provider")
	if provider == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "provider is required"})
		return
	}
	// Redirection vers le provider (placeholder)
	redirectURL := "https://example.com/oauth2/" + provider
	c.Redirect(http.StatusTemporaryRedirect, redirectURL)
}
