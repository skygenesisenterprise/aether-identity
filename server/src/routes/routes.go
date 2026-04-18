package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/skygenesisenterprise/aether-identity/server/src/controllers"
	"github.com/skygenesisenterprise/aether-identity/server/src/interfaces"
	"github.com/skygenesisenterprise/aether-identity/server/src/middleware"
	"github.com/skygenesisenterprise/aether-identity/server/src/services"
)

func SetupRoutes(router *gin.Engine, systemKey string, serviceKeyService *services.ServiceKeyService, dbService interfaces.IDatabaseService) {
	router.Use(middleware.AdaptiveCORSMiddleware())

	externalAuthController := controllers.NewExternalAuthController()
	databaseController := controllers.NewDatabaseController(dbService)

	apiV1 := router.Group("/api/v1")
	{
		apiV1.GET("/health", controllers.HealthCheck)
		apiV1.HEAD("/health", controllers.HealthCheck)

		authPublic := apiV1.Group("/auth")
		authPublic.Use(middleware.DatabaseMiddleware(dbService))
		{
			authPublic.POST("/login", controllers.Login)
			authPublic.POST("/register", controllers.Register)
		}

		protectedV1 := apiV1.Group("")
		protectedV1.Use(middleware.AppAuth(systemKey, serviceKeyService))
		protectedV1.Use(middleware.DatabaseMiddleware(dbService))
		{
			protectedV1.GET("/check-email", controllers.CheckEmailAvailability)

			databaseRoutes := protectedV1.Group("/database")
			databaseRoutes.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())
			{
				databaseRoutes.GET("/status", databaseController.GetStatus)
				databaseRoutes.GET("/stats", databaseController.GetStats)
				databaseRoutes.GET("/tables", databaseController.GetTables)
				databaseRoutes.GET("/tables/:tableName/schema", databaseController.GetTableSchema)
				databaseRoutes.POST("/migrate", databaseController.Migrate)
				databaseRoutes.POST("/maintenance", databaseController.Maintenance)
			}

			authRoutes := protectedV1.Group("/auth")
			authRoutes.Use(middleware.ServiceKeyAuth(serviceKeyService, systemKey))
			{
				authRoutes.POST("/logout", controllers.Logout)
				authRoutes.POST("/refresh", controllers.RefreshToken)
				authRoutes.POST("/token", controllers.Token)
				authRoutes.GET("/authorize", controllers.AuthorizationHandler)
				authRoutes.GET("/discord/callback", controllers.DiscordCallback)

				authRoutes.GET("/external/providers", externalAuthController.GetEnabledProviders)
				authRoutes.GET("/external/:provider", externalAuthController.InitiateOAuth)
				authRoutes.GET("/external/:provider/callback", externalAuthController.HandleOAuthCallback)

				authRoutes.POST("/send-verification", controllers.SendEmailVerification)
				authRoutes.POST("/verify-email", controllers.VerifyEmail)

				authRoutes.POST("/request-password-reset", controllers.RequestPasswordReset)
				authRoutes.POST("/confirm-password-reset", controllers.ConfirmPasswordReset)

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

			oauthRoutes := protectedV1.Group("/oauth2")
			{
				oauthRoutes.POST("/token", controllers.TokenHandler)
				oauthRoutes.GET("/userinfo", controllers.UserInfoHandler)
				oauthRoutes.POST("/revoke", controllers.RevokeHandler)
				oauthRoutes.GET("/.well-known/openid-configuration", controllers.DiscoveryHandler)
				oauthRoutes.GET("/jwks", controllers.JWKSHandler)
			}

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

			userRoutes := protectedV1.Group("/users")
			userRoutes.Use(middleware.AuthMiddleware())
			{
				userRoutes.GET("/me", controllers.GetCurrentUser)
				userRoutes.GET(":id", controllers.GetUser)
				userRoutes.PUT(":id", controllers.UpdateUser)
				userRoutes.DELETE(":id", controllers.DeleteUser)

				userRoutes.GET("/me/external-accounts", externalAuthController.GetLinkedAccounts)
				userRoutes.DELETE("/me/external-accounts/:provider", externalAuthController.UnlinkAccount)
			}

			adminUserRoutes := protectedV1.Group("/admin/users")
			adminUserRoutes.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())
			{
				adminUserRoutes.GET("", controllers.ListUsers)
				adminUserRoutes.POST("", controllers.CreateUserAdmin)
			}

			adminOAuthRoutes := protectedV1.Group("/admin/oauth")
			adminOAuthRoutes.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())
			{
				adminOAuthRoutes.GET("/external-accounts/migration-status", externalAuthController.GetMigrationStatus)
				adminOAuthRoutes.POST("/external-accounts/migrate", externalAuthController.MigrateExternalAccounts)
			}

			userKeysRoutes := protectedV1.Group("/keys")
			userKeysRoutes.Use(middleware.AuthMiddleware())
			{
				userKeysRoutes.POST("/generate", controllers.GenerateUserKey)
				userKeysRoutes.GET("", controllers.ListUserKeys)
				userKeysRoutes.GET("/:id", controllers.GetUserKeyInfo)
				userKeysRoutes.POST("/:id/revoke", controllers.RevokeUserKey)
				userKeysRoutes.DELETE("/:id", controllers.DeleteUserKey)
			}

			protectedV1.GET("/userinfo", middleware.AuthMiddleware(), controllers.UserInfo)
			protectedV1.POST("/introspect", controllers.Introspect)

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
			serviceKeyRoutes.POST("/validate", controllers.ValidateServiceKey)

			applicationRoutes := protectedV1.Group("/applications")
			applicationRoutes.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())
			{
				applicationRoutes.GET("", controllers.ListApplications)
				applicationRoutes.POST("", controllers.CreateApplication)
				applicationRoutes.GET(":id", controllers.GetApplication)
				applicationRoutes.PATCH(":id", controllers.UpdateApplication)
				applicationRoutes.DELETE(":id", controllers.DeleteApplication)
				applicationRoutes.GET(":id/credentials", controllers.GetApplicationCredentials)
				applicationRoutes.POST(":id/rotate-secret", controllers.RotateApplicationSecret)
				applicationRoutes.GET(":id/stats", controllers.GetApplicationStats)
				applicationRoutes.GET("/apis", controllers.ListApiApplications)
				applicationRoutes.GET("/external", controllers.ListExternalApplications)
			}

			organizationRoutes := protectedV1.Group("/organizations")
			organizationRoutes.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())
			{
				organizationRoutes.GET("", controllers.ListOrganizations)
				organizationRoutes.POST("", controllers.CreateOrganization)
				organizationRoutes.GET(":id", controllers.GetOrganization)
				organizationRoutes.PATCH(":id", controllers.UpdateOrganization)
				organizationRoutes.DELETE(":id", controllers.DeleteOrganization)
				organizationRoutes.GET(":id/members", controllers.ListOrganizationMembers)
				organizationRoutes.POST(":id/members", controllers.AddOrganizationMember)
				organizationRoutes.DELETE(":id/members/:userId", controllers.RemoveOrganizationMember)
				organizationRoutes.PATCH(":id/members/:userId", controllers.UpdateOrganizationMember)
			}

			connectionRoutes := protectedV1.Group("/connections")
			connectionRoutes.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())
			{
				connectionRoutes.GET("", controllers.ListConnections)
				connectionRoutes.POST("", controllers.CreateConnection)
				connectionRoutes.GET(":id", controllers.GetConnection)
				connectionRoutes.PATCH(":id", controllers.UpdateConnection)
				connectionRoutes.DELETE(":id", controllers.DeleteConnection)
				connectionRoutes.POST(":id/enable", controllers.EnableConnection)
				connectionRoutes.POST(":id/disable", controllers.DisableConnection)

				dbConnRoutes := connectionRoutes.Group("/database")
				{
					dbConnRoutes.POST("", controllers.CreateDatabaseConnection)
					dbConnRoutes.PATCH(":id", controllers.ConfigureDatabaseConnection)
					dbConnRoutes.GET(":id/users", controllers.ListDatabaseConnectionUsers)
				}

				socialRoutes := connectionRoutes.Group("/social")
				{
					socialRoutes.GET("", controllers.ListSocialProviders)
					socialRoutes.POST("", controllers.ConfigureSocialProvider)
				}

				enterpriseRoutes := connectionRoutes.Group("/enterprise")
				{
					enterpriseRoutes.GET("", controllers.ListEnterpriseConnections)
					enterpriseRoutes.POST("/saml", controllers.CreateSamlConnection)
					enterpriseRoutes.PATCH("/saml/:id", controllers.UpdateSamlSettings)
					enterpriseRoutes.POST("/saml/:id/metadata", controllers.UpdateSamlMetadata)
					enterpriseRoutes.POST("/oidc", controllers.CreateOidcConnection)
				}

				passwordlessRoutes := connectionRoutes.Group("/passwordless")
				{
					passwordlessRoutes.GET("", controllers.ListPasswordlessSettings)
					passwordlessRoutes.POST("", controllers.EnablePasswordless)
					passwordlessRoutes.PATCH(":id", controllers.ConfigurePasswordless)
				}

				authProfileRoutes := connectionRoutes.Group("/authentication-profiles")
				{
					authProfileRoutes.GET("", controllers.ListAuthenticationProfiles)
					authProfileRoutes.POST("", controllers.CreateAuthenticationProfile)
				}
			}

			securityRoutes := protectedV1.Group("/security")
			securityRoutes.Use(middleware.AuthMiddleware())
			{
				mfaRoutes := securityRoutes.Group("/mfa")
				{
					mfaRoutes.GET("/methods", controllers.ListMfaMethods)
					mfaRoutes.PATCH("/methods/:id", controllers.EnableDisableMfaMethod)
					mfaRoutes.GET("/policies", controllers.ListMfaPolicies)
					mfaRoutes.POST("/policies", controllers.CreateMfaPolicy)
					mfaRoutes.PATCH("/policies/:id", controllers.UpdateMfaPolicy)
					mfaRoutes.DELETE("/policies/:id", controllers.DeleteMfaPolicy)
					mfaRoutes.GET("/stats", controllers.GetMfaStats)
					mfaRoutes.GET("/activity", controllers.GetMfaActivity)
					mfaRoutes.POST("/challenge", controllers.InitiateMfaChallenge)
					mfaRoutes.POST("/verify", controllers.VerifyMfaCode)
				}

				attackRoutes := securityRoutes.Group("/attack-protection")
				{
					attackRoutes.GET("", controllers.GetAttackProtectionSettings)
					attackRoutes.PATCH("", controllers.UpdateAttackProtectionSettings)
					attackRoutes.GET("/brute-force", controllers.GetBruteForceConfig)
					attackRoutes.PATCH("/brute-force", controllers.UpdateBruteForceConfig)
					attackRoutes.GET("/breached-passwords", controllers.GetBreachedPasswordsConfig)
					attackRoutes.PATCH("/breached-passwords", controllers.UpdateBreachedPasswordsConfig)
				}

				securityRoutes.GET("/analytics", controllers.GetSecurityAnalytics)
				securityRoutes.GET("/analytics/threats", controllers.GetThreatData)
				securityRoutes.GET("/monitoring", controllers.GetMonitoringStatus)
			}

			brandingRoutes := protectedV1.Group("/branding")
			brandingRoutes.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())
			{
				brandingRoutes.GET("", controllers.GetBrandingSettings)
				brandingRoutes.PATCH("", controllers.UpdateBrandingSettings)

				ulRoutes := brandingRoutes.Group("/universal-login")
				{
					ulRoutes.GET("", controllers.GetUniversalLoginConfig)
					ulRoutes.PATCH("", controllers.UpdateUniversalLogin)
					ulRoutes.GET("/pages", controllers.ListLoginPages)
					ulRoutes.POST("/pages", controllers.CreateLoginPage)
					ulRoutes.PATCH("/pages/:id", controllers.UpdateLoginPage)
				}

				clRoutes := brandingRoutes.Group("/custom-login")
				{
					clRoutes.GET("", controllers.GetCustomLoginSettings)
					clRoutes.PATCH("", controllers.UpdateCustomLogin)
				}

				templateRoutes := brandingRoutes.Group("/templates")
				{
					templateRoutes.GET("", controllers.ListBrandingTemplates)
					templateRoutes.GET(":id", controllers.GetTemplateDetails)
					templateRoutes.POST("", controllers.CreateTemplate)
					templateRoutes.DELETE(":id", controllers.DeleteTemplate)
				}

				domainRoutes := brandingRoutes.Group("/custom-domains")
				{
					domainRoutes.GET("", controllers.ListCustomDomains)
					domainRoutes.POST("", controllers.CreateCustomDomain)
					domainRoutes.GET(":id", controllers.GetCustomDomainDetails)
					domainRoutes.DELETE(":id", controllers.DeleteCustomDomain)
					domainRoutes.POST(":id/verify", controllers.VerifyCustomDomain)
				}
			}

			actionRoutes := protectedV1.Group("/actions")
			actionRoutes.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())
			{
				actionRoutes.GET("", controllers.ListActions)
				actionRoutes.POST("", controllers.CreateAction)
				actionRoutes.GET(":id", controllers.GetActionDetails)
				actionRoutes.PATCH(":id", controllers.UpdateAction)
				actionRoutes.DELETE(":id", controllers.DeleteAction)
				actionRoutes.POST(":id/deploy", controllers.DeployAction)
				actionRoutes.POST(":id/test", controllers.TestAction)
				actionRoutes.GET(":id/logs", controllers.GetActionLogs)

				actionRoutes.GET("/triggers", controllers.ListAvailableTriggers)
				actionRoutes.GET("/triggers/:triggerId/actions", controllers.ListActionsForTrigger)

				actionRoutes.GET("/library", controllers.ListActionLibrary)
				actionRoutes.POST("/library", controllers.AddActionToLibrary)
				actionRoutes.DELETE("/library/:id", controllers.RemoveActionFromLibrary)

				actionRoutes.GET("/forms", controllers.ListFormActions)
				actionRoutes.POST("/forms", controllers.CreateFormAction)
			}

			extensionRoutes := protectedV1.Group("/extensions")
			extensionRoutes.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())
			{
				extensionRoutes.GET("", controllers.ListExtensions)
				extensionRoutes.POST("", controllers.InstallExtension)
				extensionRoutes.DELETE(":id", controllers.UninstallExtension)
				extensionRoutes.GET(":id/config", controllers.GetExtensionConfig)
				extensionRoutes.PATCH(":id/config", controllers.UpdateExtensionConfig)
			}

			logRoutes := protectedV1.Group("/logs")
			logRoutes.Use(middleware.AuthMiddleware())
			{
				logRoutes.GET("", controllers.ListLogs)
				logRoutes.GET(":id", controllers.GetLogDetails)
				logRoutes.GET("/export", controllers.ExportLogs)
				logRoutes.GET("/stats", controllers.GetLogStats)

				logRoutes.GET("/actions", controllers.ListActionLogs)
				logRoutes.GET("/actions/:id", controllers.GetActionLogDetails)

				logRoutes.GET("/stream", controllers.GetLogStream)
			}

			protectedV1.GET("/monitoring/status", controllers.GetSystemStatus)
			protectedV1.GET("/monitoring/health", controllers.GetHealthMetrics)

			activityRoutes := protectedV1.Group("/activity")
			activityRoutes.Use(middleware.AuthMiddleware())
			{
				activityRoutes.GET("", controllers.GetActivityOverview)
				activityRoutes.GET("/dau", controllers.GetDailyActiveUsers)
				activityRoutes.GET("/retention", controllers.GetUserRetention)
				activityRoutes.GET("/signups", controllers.GetSignupData)
				activityRoutes.GET("/failed-logins", controllers.GetFailedLoginData)
			}

			statsRoutes := protectedV1.Group("/stats")
			statsRoutes.Use(middleware.AuthMiddleware())
			{
				statsRoutes.GET("", controllers.GetDashboardStats)
				statsRoutes.GET("/users", controllers.GetUserStats)
				statsRoutes.GET("/sessions", controllers.GetSessionStats)
				statsRoutes.GET("/logins", controllers.GetLoginStats)
			}

			settingRoutes := protectedV1.Group("/settings")
			settingRoutes.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())
			{
				settingRoutes.GET("", controllers.GetSystemSettings)
				settingRoutes.PATCH("", controllers.UpdateSystemSettings)
				settingRoutes.GET("/general", controllers.GetGeneralSettings)
				settingRoutes.PATCH("/general", controllers.UpdateGeneralSettings)
				settingRoutes.GET("/docker", controllers.GetDockerSettings)
				settingRoutes.PATCH("/docker", controllers.UpdateDockerSettings)
				settingRoutes.GET("/email", controllers.GetEmailSettings)
				settingRoutes.PATCH("/email", controllers.UpdateEmailSettings)
				settingRoutes.POST("/email/test", controllers.TestEmailConfig)
				settingRoutes.GET("/features", controllers.GetFeatureFlags)
				settingRoutes.PATCH("/features", controllers.UpdateFeatureFlags)
			}

			agentRoutes := protectedV1.Group("/agents")
			agentRoutes.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())
			{
				agentRoutes.GET("", controllers.ListAgents)
				agentRoutes.POST("", controllers.RegisterAgent)
				agentRoutes.GET(":id", controllers.GetAgentDetails)
				agentRoutes.PATCH(":id", controllers.UpdateAgent)
				agentRoutes.DELETE(":id", controllers.DeleteAgent)
				agentRoutes.GET(":id/status", controllers.GetAgentStatus)
				agentRoutes.POST(":id/restart", controllers.RestartAgent)
			}

			eventRoutes := protectedV1.Group("/events")
			eventRoutes.Use(middleware.AuthMiddleware())
			{
				eventRoutes.GET("", controllers.ListEvents)
				eventRoutes.GET(":id", controllers.GetEventDetails)
			}

			marketplaceRoutes := protectedV1.Group("/marketplace")
			marketplaceRoutes.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())
			{
				marketplaceRoutes.GET("", controllers.ListMarketplaceIntegrations)
				marketplaceRoutes.GET(":id", controllers.GetIntegrationDetails)
				marketplaceRoutes.POST(":id/install", controllers.InstallIntegration)
				marketplaceRoutes.POST(":id/uninstall", controllers.UninstallIntegration)
			}

			tenantRoutes := protectedV1.Group("/tenant")
			tenantRoutes.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())
			{
				tenantRoutes.GET("", controllers.GetTenantInfo)
				tenantRoutes.PATCH("", controllers.UpdateTenantSettings)
				tenantRoutes.GET("/usage", controllers.GetTenantUsage)
				tenantRoutes.GET("/billing", controllers.GetBillingInfo)
			}
		}
	}

	oauthRoutes := router.Group("/oauth")
	oauthRoutes.Use(middleware.DatabaseMiddleware(dbService))
	{
		oauthRoutes.GET("/authorize", controllers.AuthorizationHandler)
		oauthRoutes.POST("/token", controllers.TokenHandler)
		oauthRoutes.GET("/userinfo", controllers.UserInfoHandler)
		oauthRoutes.POST("/revoke", controllers.RevokeHandler)
		oauthRoutes.GET("/.well-known/openid-configuration", controllers.DiscoveryHandler)
		oauthRoutes.GET("/jwks", controllers.JWKSHandler)
	}

	appRoutes := router.Group("/api/v1/app")
	appRoutes.Use(middleware.AppAuth(systemKey, serviceKeyService))
	{
		appRoutes.GET("/health", controllers.HealthCheck)
		appRoutes.GET("/userinfo", middleware.AuthMiddleware(), controllers.UserInfo)
	}
}
