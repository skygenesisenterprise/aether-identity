package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/skygenesisenterprise/aether-identity/server/src/models"
	"github.com/skygenesisenterprise/aether-identity/server/src/services"
)

func CreateAction(c *gin.Context) {
	var action models.Action
	if err := c.ShouldBindJSON(&action); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	actionService := services.NewActionService(services.DB)
	if err := actionService.CreateAction(&action); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, action)
}

func GetAction(c *gin.Context) {
	id := c.Param("id")
	actionService := services.NewActionService(services.DB)

	action, err := actionService.GetAction(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Action not found"})
		return
	}

	c.JSON(http.StatusOK, action)
}

func ListActions(c *gin.Context) {
	actionService := services.NewActionService(services.DB)

	actions, err := actionService.ListActions()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, actions)
}

func UpdateAction(c *gin.Context) {
	id := c.Param("id")
	var action models.Action
	if err := c.ShouldBindJSON(&action); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	action.ID = id
	actionService := services.NewActionService(services.DB)

	if err := actionService.UpdateAction(&action); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, action)
}

func DeleteAction(c *gin.Context) {
	id := c.Param("id")
	actionService := services.NewActionService(services.DB)

	if err := actionService.DeleteAction(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

func ListActionTriggers(c *gin.Context) {
	actionService := services.NewActionService(services.DB)

	triggers, err := actionService.ListActionTriggers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, triggers)
}

func ListActionLogs(c *gin.Context) {
	actionID := c.Param("id")
	actionService := services.NewActionService(services.DB)

	logs, err := actionService.GetActionLogsByAction(actionID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, logs)
}
