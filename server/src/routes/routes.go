package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/skygenesisenterprise/aether-identity/server/src/controllers"
	"github.com/skygenesisenterprise/aether-identity/server/src/middleware"
)

func SetupRoutes(router *gin.Engine, systemKey string) {
	// API versioning
	apiV1 := router.Group("/api/v1")
	{
		// Health routes - without database middleware
		apiV1.GET("/health", controllers.HealthCheck)

		// Routes that require database
		dbRoutes := apiV1.Group("")
		dbRoutes.Use(middleware.DatabaseMiddleware())
		{
			// Authentication routes
			authRoutes := dbRoutes.Group("/auth")
			{
				authRoutes.POST("/login", controllers.Login)
				authRoutes.POST("/register", controllers.Register)
				authRoutes.POST("/logout", controllers.Logout)
				authRoutes.POST("/refresh", controllers.RefreshToken)
				authRoutes.POST("/token", controllers.Token)
				authRoutes.GET("/authorize", controllers.AuthorizationHandler)
				authRoutes.GET("/discord/callback", controllers.DiscordCallback)

				// Email verification
				authRoutes.POST("/send-verification", controllers.SendEmailVerification)
				authRoutes.POST("/verify-email", controllers.VerifyEmail)

				// Password reset
				authRoutes.POST("/request-password-reset", controllers.RequestPasswordReset)
				authRoutes.POST("/confirm-password-reset", controllers.ConfirmPasswordReset)
			}

			// Routes OAuth2/OpenID Connect
			oauthRoutes := dbRoutes.Group("/oauth2")
			{
				oauthRoutes.POST("/token", controllers.TokenHandler)
				oauthRoutes.GET("/userinfo", controllers.UserInfoHandler)
				oauthRoutes.POST("/revoke", controllers.RevokeHandler)
				oauthRoutes.GET("/.well-known/openid-configuration", controllers.DiscoveryHandler)
				oauthRoutes.GET("/jwks", controllers.JWKSHandler)
			}

			// Routes de gestion des clients OAuth (protégées par admin)
			clientRoutes := dbRoutes.Group("/clients")
			clientRoutes.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())
			{
				clientRoutes.POST("", controllers.CreateClient)
				clientRoutes.GET("", controllers.ListClients)
				clientRoutes.GET(":clientId", controllers.GetClient)
				clientRoutes.PUT(":clientId", controllers.UpdateClient)
				clientRoutes.POST(":clientId/rotate-secret", controllers.RotateClientSecret)
				clientRoutes.DELETE(":clientId", controllers.DeleteClient)
			}

			// Routes de gestion des domaines (protégées par admin)
			domainRoutes := dbRoutes.Group("/domains")
			domainRoutes.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())
			{
				domainRoutes.POST("", controllers.CreateDomain)
				domainRoutes.GET("", controllers.ListDomains)
				domainRoutes.GET(":domainId", controllers.GetDomain)
				domainRoutes.PUT(":domainId", controllers.UpdateDomain)
				domainRoutes.DELETE(":domainId", controllers.DeleteDomain)
				domainRoutes.POST(":domainId/verify", controllers.VerifyDomain)
				domainRoutes.GET(":domainId/users", controllers.GetDomainUsers)
				domainRoutes.POST(":domainId/users", controllers.AddUserToDomain)
				domainRoutes.DELETE(":domainId/users/:userId", controllers.RemoveUserFromDomain)
				domainRoutes.GET(":domainId/details", controllers.GetDomainDetails)
			}

			// Routes utilisateur (protégées par JWT)
			userRoutes := dbRoutes.Group("/users")
			userRoutes.Use(middleware.AuthMiddleware())
			{
				userRoutes.GET(":id", controllers.GetUser)
				userRoutes.PUT(":id", controllers.UpdateUser)
				userRoutes.DELETE(":id", controllers.DeleteUser)
			}

			// RBAC et info util
			dbRoutes.GET("/userinfo", middleware.AuthMiddleware(), controllers.UserInfo)
			dbRoutes.POST("/introspect", controllers.Introspect)
		}
	}

	// Routes OAuth2/OpenID Connect (accessibles directement)
	oauthRoutes := router.Group("/oauth")
	oauthRoutes.Use(middleware.DatabaseMiddleware())
	{
		oauthRoutes.GET("/authorize", controllers.AuthorizationHandler)
		oauthRoutes.POST("/token", controllers.TokenHandler)
		oauthRoutes.GET("/userinfo", controllers.UserInfoHandler)
		oauthRoutes.POST("/revoke", controllers.RevokeHandler)
		oauthRoutes.GET("/.well-known/openid-configuration", controllers.DiscoveryHandler)
		oauthRoutes.GET("/jwks", controllers.JWKSHandler)
	}

	// Routes de gestion des clés de service (protégées par JWT)
	serviceKeyRoutes := router.Group("/api/v1/service-keys")
	serviceKeyRoutes.Use(middleware.AuthMiddleware())
	{
		serviceKeyRoutes.POST("", controllers.CreateServiceKey)
		serviceKeyRoutes.GET("", controllers.ListServiceKeys)
		serviceKeyRoutes.GET(":id", controllers.GetServiceKey)
		serviceKeyRoutes.PUT(":id", controllers.UpdateServiceKey)
		serviceKeyRoutes.DELETE(":id", controllers.DeleteServiceKey)
		serviceKeyRoutes.GET(":id/usage", controllers.GetServiceKeyUsage)
	}

	// Route pour valider une clé de service (sans authentification JWT)
	serviceKeyRoutes.POST("/validate", controllers.ValidateServiceKey)

	// Routes protégées par la clé système (pour les requêtes de l'application)
	appRoutes := router.Group("/api/v1/app")
	appRoutes.Use(middleware.AppAuth(systemKey))
	{
		appRoutes.GET("/health", controllers.HealthCheck)
		appRoutes.GET("/userinfo", middleware.AuthMiddleware(), controllers.UserInfo)
	}
}
