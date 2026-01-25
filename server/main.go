package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/skygenesisenterprise/aether-identity/server/src/config"
	"github.com/skygenesisenterprise/aether-identity/server/src/routes"
	"github.com/skygenesisenterprise/aether-identity/server/src/services"
)

func main() {
	// Charger la configuration
	cfg := config.LoadConfig()

	// Initialiser Gin
	router := gin.Default()

	// Initialiser la base de données
	if err := services.InitDB(cfg.DatabaseURL); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer services.CloseDB()

	// Configurer les routes
	routes.SetupRoutes(router)

	// Démarrer le serveur
	log.Printf("Starting server on :%s...", cfg.Port)
	if err := router.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
