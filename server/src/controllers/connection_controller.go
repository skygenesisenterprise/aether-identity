package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/skygenesisenterprise/aether-identity/server/src/models"
	"github.com/skygenesisenterprise/aether-identity/server/src/services"
)

func CreateConnection(c *gin.Context) {
	var conn models.Connection
	if err := c.ShouldBindJSON(&conn); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	connService := services.NewConnectionService(services.DB)
	if err := connService.CreateConnection(&conn); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, conn)
}

func GetConnection(c *gin.Context) {
	id := c.Param("id")
	connService := services.NewConnectionService(services.DB)

	conn, err := connService.GetConnectionByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Connection not found"})
		return
	}

	c.JSON(http.StatusOK, conn)
}

func ListConnections(c *gin.Context) {
	connService := services.NewConnectionService(services.DB)

	conns, err := connService.ListConnections()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, conns)
}

func UpdateConnection(c *gin.Context) {
	id := c.Param("id")
	var conn models.Connection
	if err := c.ShouldBindJSON(&conn); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	conn.ID = id
	connService := services.NewConnectionService(services.DB)

	if err := connService.UpdateConnection(&conn); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, conn)
}

func DeleteConnection(c *gin.Context) {
	id := c.Param("id")
	connService := services.NewConnectionService(services.DB)

	if err := connService.DeleteConnection(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

func EnableConnection(c *gin.Context) {
	id := c.Param("id")
	connService := services.NewConnectionService(services.DB)

	conn, err := connService.GetConnectionByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Connection not found"})
		return
	}

	conn.IsEnabled = true
	if err := connService.UpdateConnection(conn); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, conn)
}

func CreateAuthenticationProfile(c *gin.Context) {
	var profile models.AuthenticationProfile
	if err := c.ShouldBindJSON(&profile); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	connService := services.NewConnectionService(services.DB)
	if err := connService.CreateAuthenticationProfile(&profile); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, profile)
}

func ListAuthenticationProfiles(c *gin.Context) {
	connService := services.NewConnectionService(services.DB)

	profiles, err := connService.ListAuthenticationProfiles()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, profiles)
}
