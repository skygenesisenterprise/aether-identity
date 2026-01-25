package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/skygenesisenterprise/aether-identity/server/src/model"
	"github.com/skygenesisenterprise/aether-identity/server/src/services"
)

// DBStatus retourne l'état de connexion à la base de données
func DBStatus(c *gin.Context) {
	db := services.DB
	if db == nil {
		c.JSON(http.StatusOK, gin.H{"db": "unset"})
		return
	}
	if sqlDB, err := db.DB(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"db": "error", "error": err.Error()})
		return
	} else {
		if err := sqlDB.Ping(); err != nil {
			c.JSON(http.StatusServiceUnavailable, gin.H{"db": "disconnected", "error": err.Error()})
			return
		}
	}
	c.JSON(http.StatusOK, gin.H{"db": "connected"})
}

// DBMigrate déclenche les migrations manuelles (MVP)
func DBMigrate(c *gin.Context) {
	if err := services.DB.AutoMigrate(&model.User{}, &model.Organization{}, &model.Role{}, &model.Membership{}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Migration failed", "details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Migrations applied"})
}
