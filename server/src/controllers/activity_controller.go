package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/skygenesisenterprise/aether-identity/server/src/services"
)

func GetActivityStats(c *gin.Context) {
	date := c.Query("date")
	activityService := services.NewActivityService(services.DB)

	activity, err := activityService.GetActivity(date)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Activity not found"})
		return
	}

	c.JSON(http.StatusOK, activity)
}

func ListActivities(c *gin.Context) {
	activityService := services.NewActivityService(services.DB)

	activities, err := activityService.ListActivities(30)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, activities)
}

func ListDAU(c *gin.Context) {
	activityService := services.NewActivityService(services.DB)

	dauList, err := activityService.ListDAU(30)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, dauList)
}

func ListRetentions(c *gin.Context) {
	activityService := services.NewActivityService(services.DB)

	retentions, err := activityService.ListRetentions()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, retentions)
}

func ListSignups(c *gin.Context) {
	activityService := services.NewActivityService(services.DB)

	signups, err := activityService.ListSignups(30)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, signups)
}
