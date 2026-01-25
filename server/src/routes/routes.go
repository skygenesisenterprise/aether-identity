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
		// Apply DB health middleware to all API v1 routes
		apiV1.Use(middleware.DatabaseMiddleware())

		// Routes d'authentification
		authRoutes := apiV1.Group("/auth")
		{
			authRoutes.POST("/login", controllers.Login)
			authRoutes.POST("/register", controllers.Register)
			authRoutes.POST("/logout", controllers.Logout)
			authRoutes.POST("/refresh", controllers.RefreshToken)
			authRoutes.POST("/token", controllers.Token)
			authRoutes.GET("/authorize", controllers.Authorize)
			authRoutes.GET("/discord/callback", controllers.DiscordCallback)

			// Email verification
			authRoutes.POST("/send-verification", controllers.SendEmailVerification)
			authRoutes.POST("/verify-email", controllers.VerifyEmail)

			// Password reset
			authRoutes.POST("/request-password-reset", controllers.RequestPasswordReset)
			authRoutes.POST("/confirm-password-reset", controllers.ConfirmPasswordReset)
		}

		// Routes utilisateur (protégées par JWT)
		userRoutes := apiV1.Group("/users")
		userRoutes.Use(middleware.AuthMiddleware())
		{
			userRoutes.GET(":id", controllers.GetUser)
			userRoutes.PUT(":id", controllers.UpdateUser)
			userRoutes.DELETE(":id", controllers.DeleteUser)
		}

		// Routes de santé
		apiV1.GET("/health", controllers.HealthCheck)

		// RBAC et info util
		apiV1.GET("/userinfo", middleware.AuthMiddleware(), controllers.UserInfo)
		apiV1.POST("/introspect", controllers.Introspect)
	}
}
