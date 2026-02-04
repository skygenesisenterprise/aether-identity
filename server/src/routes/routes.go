package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/skygenesisenterprise/aether-identity/server/src/controllers"
	"github.com/skygenesisenterprise/aether-identity/server/src/middleware"
	"github.com/skygenesisenterprise/aether-identity/server/src/services"
)

func SetupRoutes(router *gin.Engine, systemKey string, serviceKeyService *services.ServiceKeyService) {
	// Middleware CORS adaptatif global
	router.Use(middleware.AdaptiveCORSMiddleware())

	// Créer le contrôleur d'authentification externe
	externalAuthController := controllers.NewExternalAuthController()

	// API versioning
	apiV1 := router.Group("/api/v1")
	{
		// Health routes - without database middleware and authentication
		// These routes are public and accessible without any authentication
		apiV1.GET("/health", controllers.HealthCheck)
		apiV1.HEAD("/health", controllers.HealthCheck)

		// Protected routes - require system key authentication
		// All other /api/v1/* routes must be accompanied by the system key
		protectedV1 := apiV1.Group("")
		protectedV1.Use(middleware.AppAuth(systemKey))
		protectedV1.Use(middleware.DatabaseMiddleware())
		{
			// Authentication routes - protégées par Service Key
			authRoutes := protectedV1.Group("/auth")
			authRoutes.Use(middleware.ServiceKeyAuth(serviceKeyService, systemKey))
			{
				authRoutes.POST("/login", controllers.Login)
				authRoutes.POST("/register", controllers.Register)
				authRoutes.POST("/logout", controllers.Logout)
				authRoutes.POST("/refresh", controllers.RefreshToken)
				authRoutes.POST("/token", controllers.Token)
				authRoutes.GET("/authorize", controllers.AuthorizationHandler)
				authRoutes.GET("/discord/callback", controllers.DiscordCallback)

				// Routes OAuth externes (Social Login)
				authRoutes.GET("/external/providers", externalAuthController.GetEnabledProviders)
				authRoutes.GET("/external/:provider", externalAuthController.InitiateOAuth)
				authRoutes.GET("/external/:provider/callback", externalAuthController.HandleOAuthCallback)

				// Email verification
				authRoutes.POST("/send-verification", controllers.SendEmailVerification)
				authRoutes.POST("/verify-email", controllers.VerifyEmail)

				// Password reset
				authRoutes.POST("/request-password-reset", controllers.RequestPasswordReset)
				authRoutes.POST("/confirm-password-reset", controllers.ConfirmPasswordReset)

				// TOTP routes
				totpRoutes := authRoutes.Group("/totp")
				totpRoutes.Use(middleware.AuthMiddleware())
				{
					totpRoutes.GET("/setup", controllers.GenerateTOTPSecret)
					totpRoutes.POST("/verify", controllers.VerifyTOTPCode)
					totpRoutes.POST("/disable", controllers.DisableTOTP)
					totpRoutes.GET("/status", controllers.GetTOTPStatus)
				}
				authRoutes.POST("/totp/login", controllers.VerifyTOTPLogin)
			}

			// Routes OAuth2/OpenID Connect
			oauthRoutes := protectedV1.Group("/oauth2")
			{
				oauthRoutes.POST("/token", controllers.TokenHandler)
				oauthRoutes.GET("/userinfo", controllers.UserInfoHandler)
				oauthRoutes.POST("/revoke", controllers.RevokeHandler)
				oauthRoutes.GET("/.well-known/openid-configuration", controllers.DiscoveryHandler)
				oauthRoutes.GET("/jwks", controllers.JWKSHandler)
			}

			// Routes de gestion des clients OAuth (protégées par admin)
			clientRoutes := protectedV1.Group("/clients")
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
			domainRoutes := protectedV1.Group("/domains")
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
			userRoutes := protectedV1.Group("/users")
			userRoutes.Use(middleware.AuthMiddleware())
			{
				userRoutes.GET("/me", controllers.GetCurrentUser)
				userRoutes.GET(":id", controllers.GetUser)
				userRoutes.PUT(":id", controllers.UpdateUser)
				userRoutes.DELETE(":id", controllers.DeleteUser)

				// Routes pour les comptes externes liés
				userRoutes.GET("/me/external-accounts", externalAuthController.GetLinkedAccounts)
				userRoutes.DELETE("/me/external-accounts/:provider", externalAuthController.UnlinkAccount)
			}

			// Routes admin pour la gestion des utilisateurs
			adminUserRoutes := protectedV1.Group("/admin/users")
			adminUserRoutes.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())
			{
				adminUserRoutes.GET("", controllers.ListUsers)
				adminUserRoutes.POST("", controllers.CreateUserAdmin)
			}

			// Routes admin pour la gestion OAuth
			adminOAuthRoutes := protectedV1.Group("/admin/oauth")
			adminOAuthRoutes.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())
			{
				adminOAuthRoutes.GET("/external-accounts/migration-status", externalAuthController.GetMigrationStatus)
				adminOAuthRoutes.POST("/external-accounts/migrate", externalAuthController.MigrateExternalAccounts)
			}

			// Route pour vérifier la disponibilité d'un email
			protectedV1.GET("/check-email", controllers.CheckEmailAvailability)

			// Routes pour la gestion des clés de service par les utilisateurs
			userKeysRoutes := protectedV1.Group("/keys")
			userKeysRoutes.Use(middleware.AuthMiddleware())
			{
				userKeysRoutes.POST("/generate", controllers.GenerateUserKey)
				userKeysRoutes.GET("", controllers.ListUserKeys)
				userKeysRoutes.GET("/:id", controllers.GetUserKeyInfo)
				userKeysRoutes.POST("/:id/revoke", controllers.RevokeUserKey)
				userKeysRoutes.DELETE("/:id", controllers.DeleteUserKey)
			}

			// RBAC et info util
			protectedV1.GET("/userinfo", middleware.AuthMiddleware(), controllers.UserInfo)
			protectedV1.POST("/introspect", controllers.Introspect)

			// Routes de gestion des clés de service (protégées par JWT)
			serviceKeyRoutes := protectedV1.Group("/service-keys")
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
		}
	}

	// Routes OAuth2/OpenID Connect (accessibles directement sous /oauth)
	// Note: Les routes équivalentes sous /api/v1/oauth2 sont maintenant protégées par le system key
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

	// Routes protégées par la clé système (pour les requêtes de l'application)
	// Ces routes sont spécifiques à l'application interne
	appRoutes := router.Group("/api/v1/app")
	appRoutes.Use(middleware.AppAuth(systemKey))
	{
		appRoutes.GET("/health", controllers.HealthCheck)
		appRoutes.GET("/userinfo", middleware.AuthMiddleware(), controllers.UserInfo)
	}
}
