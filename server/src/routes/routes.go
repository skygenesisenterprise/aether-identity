package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/skygenesisenterprise/aether-identity/server/src/controllers"
	"github.com/skygenesisenterprise/aether-identity/server/src/middleware"
)

func SetupRoutes(router *gin.Engine) {
	// API versioning
	apiV1 := router.Group("/api/v1")
	{
		// Routes d'authentification
		authRoutes := apiV1.Group("/auth")
		{
			authRoutes.POST("/login", controllers.Login)
			authRoutes.POST("/register", controllers.Register)
			authRoutes.POST("/logout", controllers.Logout)
			authRoutes.POST("/refresh", controllers.RefreshToken)
		}

		// Routes utilisateur (protégées par JWT)
		userRoutes := apiV1.Group("/users")
		userRoutes.Use(middleware.AuthMiddleware())
		{
			userRoutes.GET("/:id", controllers.GetUser)
			userRoutes.PUT("/:id", controllers.UpdateUser)
			userRoutes.DELETE("/:id", controllers.DeleteUser)
		}

		// Routes de santé
		apiV1.GET("/health", controllers.HealthCheck)
	}
}