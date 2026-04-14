package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/skygenesisenterprise/aether-identity/server/src/models"
	"github.com/skygenesisenterprise/aether-identity/server/src/services"
)

func CreateExtension(c *gin.Context) {
	var ext models.Extension
	if err := c.ShouldBindJSON(&ext); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	extService := services.NewExtensionService(services.DB)
	if err := extService.CreateExtension(&ext); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, ext)
}

func GetExtension(c *gin.Context) {
	id := c.Param("id")
	extService := services.NewExtensionService(services.DB)

	ext, err := extService.GetExtension(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Extension not found"})
		return
	}

	c.JSON(http.StatusOK, ext)
}

func ListExtensions(c *gin.Context) {
	extService := services.NewExtensionService(services.DB)

	extensions, err := extService.ListExtensions()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, extensions)
}

func UpdateExtension(c *gin.Context) {
	id := c.Param("id")
	var ext models.Extension
	if err := c.ShouldBindJSON(&ext); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	ext.ID = id
	extService := services.NewExtensionService(services.DB)

	if err := extService.UpdateExtension(&ext); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, ext)
}

func DeleteExtension(c *gin.Context) {
	id := c.Param("id")
	extService := services.NewExtensionService(services.DB)

	if err := extService.DeleteExtension(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}
