package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/skygenesisenterprise/aether-identity/server/src/models"
	"github.com/skygenesisenterprise/aether-identity/server/src/services"
)

func ListMfaMethods(c *gin.Context) {
	securityService := services.NewSecurityService(services.DB)

	methods, err := securityService.ListMfaMethods()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, methods)
}

func CreateMfaMethod(c *gin.Context) {
	var method models.MfaMethod
	if err := c.ShouldBindJSON(&method); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	securityService := services.NewSecurityService(services.DB)
	if err := securityService.CreateMfaMethod(&method); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, method)
}

func GetMfaMethod(c *gin.Context) {
	id := c.Param("id")
	securityService := services.NewSecurityService(services.DB)

	method, err := securityService.GetMfaMethod(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "MFA method not found"})
		return
	}

	c.JSON(http.StatusOK, method)
}

func UpdateMfaMethod(c *gin.Context) {
	id := c.Param("id")
	var method models.MfaMethod
	if err := c.ShouldBindJSON(&method); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	method.ID = id
	securityService := services.NewSecurityService(services.DB)

	if err := securityService.UpdateMfaMethod(&method); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, method)
}

func DeleteMfaMethod(c *gin.Context) {
	id := c.Param("id")
	securityService := services.NewSecurityService(services.DB)

	if err := securityService.DeleteMfaMethod(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

func ListMfaPolicies(c *gin.Context) {
	securityService := services.NewSecurityService(services.DB)

	policies, err := securityService.ListMfaPolicies()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, policies)
}

func GetBruteForceConfig(c *gin.Context) {
	securityService := services.NewSecurityService(services.DB)

	config, err := securityService.GetBruteForceConfig()
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Brute force config not found"})
		return
	}

	c.JSON(http.StatusOK, config)
}

func UpdateBruteForceConfig(c *gin.Context) {
	var config models.BruteForceConfig
	if err := c.ShouldBindJSON(&config); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	securityService := services.NewSecurityService(services.DB)
	if err := securityService.UpdateBruteForceConfig(&config); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, config)
}
