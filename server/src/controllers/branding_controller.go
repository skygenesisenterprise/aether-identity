package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/skygenesisenterprise/aether-identity/server/src/models"
	"github.com/skygenesisenterprise/aether-identity/server/src/services"
)

func CreateBranding(c *gin.Context) {
	var branding models.Branding
	if err := c.ShouldBindJSON(&branding); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	brandingService := services.NewBrandingService(services.DB)
	if err := brandingService.CreateBranding(&branding); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, branding)
}

func GetBranding(c *gin.Context) {
	id := c.Param("id")
	brandingService := services.NewBrandingService(services.DB)

	branding, err := brandingService.GetBranding(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Branding not found"})
		return
	}

	c.JSON(http.StatusOK, branding)
}

func UpdateBranding(c *gin.Context) {
	id := c.Param("id")
	var branding models.Branding
	if err := c.ShouldBindJSON(&branding); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	branding.ID = id
	brandingService := services.NewBrandingService(services.DB)

	if err := brandingService.UpdateBranding(&branding); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, branding)
}

func DeleteBranding(c *gin.Context) {
	id := c.Param("id")
	brandingService := services.NewBrandingService(services.DB)

	if err := brandingService.DeleteBranding(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

func ListCustomDomains(c *gin.Context) {
	brandingService := services.NewBrandingService(services.DB)

	domains, err := brandingService.ListCustomDomains()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, domains)
}

func ListBrandingTemplates(c *gin.Context) {
	brandingService := services.NewBrandingService(services.DB)

	templates, err := brandingService.ListTemplates()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, templates)
}
