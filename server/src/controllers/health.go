package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// HealthCheck vérifie l'état de santé de l'API
func HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "healthy",
		"message": "API is running successfully",
		"version": "1.0.0",
	})
}
