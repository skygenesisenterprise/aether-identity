package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/skygenesisenterprise/aether-identity/server/src/models"
	"github.com/skygenesisenterprise/aether-identity/server/src/services"
)

func CreateLog(c *gin.Context) {
	var log models.Log
	if err := c.ShouldBindJSON(&log); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	logService := services.NewLogService(services.DB)
	if err := logService.CreateLog(&log); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, log)
}

func GetLog(c *gin.Context) {
	id := c.Param("id")
	logService := services.NewLogService(services.DB)

	log, err := logService.GetLog(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Log not found"})
		return
	}

	c.JSON(http.StatusOK, log)
}

func ListLogs(c *gin.Context) {
	logService := services.NewLogService(services.DB)

	logs, err := logService.ListLogs(100, 0)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, logs)
}

func ListMonitoringStatuses(c *gin.Context) {
	logService := services.NewLogService(services.DB)

	statuses, err := logService.ListMonitoringStatuses()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, statuses)
}

func GetLogStats(c *gin.Context) {
	date := c.Query("date")
	logService := services.NewLogService(services.DB)

	stats, err := logService.GetLogStats(date)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Log stats not found"})
		return
	}

	c.JSON(http.StatusOK, stats)
}
