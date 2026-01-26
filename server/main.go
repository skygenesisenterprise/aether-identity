package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"runtime"
	"time"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"github.com/skygenesisenterprise/aether-identity/server/src/config"
	"github.com/skygenesisenterprise/aether-identity/server/src/routes"
	"github.com/skygenesisenterprise/aether-identity/server/src/services"
)

func displayBanner() {
	fmt.Printf("\n")
	fmt.Printf("\033[1;36m    ██╗    ██╗██╗  ██╗ █████╗ ████████╗██╗  ██╗███████╗████████╗\n")
	fmt.Printf("\033[1;36m    ██║    ██║██║  ██║██╔══██╗╚══██╔══╝██║  ██║██╔════╝╚══██╔══╝\n")
	fmt.Printf("\033[1;36m    ██║ █╗ ██║███████║███████║   ██║   ███████║█████╗     ██║   \n")
	fmt.Printf("\033[1;36m    ██║███╗██║██╔══██║██╔══██║   ██║   ██╔══██║██╔══╝     ██║   \n")
	fmt.Printf("\033[1;36m    ╚███╔███╔╝██║  ██║██║  ██║   ██║   ██║  ██║███████╗   ██║   \n")
	fmt.Printf("\033[1;36m     ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝   ╚═╝   \n")
	fmt.Printf("\033[0;37m")
	fmt.Printf("\n")
	fmt.Printf("\033[1;33m    ╔══════════════════════════════════════════════════════════════╗\n")
	fmt.Printf("\033[1;33m    ║                    AETHER IDENTITY SERVER                    ║\n")
	fmt.Printf("\033[1;33m    ║              Enterprise Identity Management                ║\n")
	fmt.Printf("\033[1;33m    ║                   Version 1.0.0-alpha                      ║\n")
	fmt.Printf("\033[1;33m    ╚══════════════════════════════════════════════════════════════╝\n")
	fmt.Printf("\033[0;37m")
	fmt.Printf("\n")
	fmt.Printf("\033[1;32m[✓] System Architecture: %s\033[0m\n", runtime.GOARCH)
	fmt.Printf("\033[1;32m[✓] Operating System: %s\033[0m\n", runtime.GOOS)
	fmt.Printf("\033[1;32m[✓] Go Version: %s\033[0m\n", runtime.Version())
	fmt.Printf("\033[1;32m[✓] CPU Cores: %d\033[0m\n", runtime.NumCPU())
	fmt.Printf("\033[1;32m[✓] Process ID: %d\033[0m\n", os.Getpid())
	fmt.Printf("\n")
}

func main() {
	displayBanner()

	fmt.Printf("\033[1;34m[info] Initializing identity management system...\033[0m\n")
	time.Sleep(300 * time.Millisecond)

	// Charger la configuration
	fmt.Printf("\033[1;34m[info] Loading configuration...\033[0m\n")
	cfg := config.LoadConfig()
	time.Sleep(200 * time.Millisecond)

	// Initialiser Gin
	fmt.Printf("\033[1;34m[info] Setting up Gin router...\033[0m\n")
	gin.SetMode(gin.ReleaseMode)
	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	// Disable Gin debug output
	gin.DefaultWriter = io.Discard
	time.Sleep(200 * time.Millisecond)

	// Configurer les sessions pour OAuth
	fmt.Printf("\033[1;34m[info] Configuring OAuth sessions...\033[0m\n")
	store := cookie.NewStore([]byte(cfg.JWTSecret))
	store.Options(sessions.Options{
		Path:     "/",
		MaxAge:   86400 * 7, // 7 jours
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	})
	router.Use(sessions.Sessions("aether_oauth_session", store))
	time.Sleep(200 * time.Millisecond)

	// Initialiser la base de données (optionnel)
	fmt.Printf("\033[1;34m[info] Initializing database connection...\033[0m\n")
	dbInitialized := true
	if err := services.InitDB(cfg.DatabaseURL); err != nil {
		fmt.Printf("\033[1;33m[warn] Failed to initialize database: %v\033[0m\n", err)
		fmt.Printf("\033[1;33m[warn] Running in database-less mode\033[0m\n")
		dbInitialized = false
	}
	defer func() {
		if dbInitialized {
			if err := services.CloseDB(); err != nil {
				fmt.Printf("\033[1;33m[warn] Error closing database: %v\033[0m\n", err)
			} else {
				fmt.Printf("\033[1;34m[info] Database connection closed\033[0m\n")
			}
		}
	}()
	time.Sleep(300 * time.Millisecond)

	// Initialiser les domaines par défaut (si la base de données est disponible)
	if dbInitialized {
		fmt.Printf("\033[1;34m[info] Initializing default domains...\033[0m\n")
		domainService := services.NewDomainService(services.DB)
		if err := domainService.InitializeDefaultDomains(); err != nil {
			fmt.Printf("\033[1;33m[warn] Failed to initialize default domains: %v\033[0m\n", err)
		} else {
			fmt.Printf("\033[1;32m[success] Default domains initialized\033[0m\n")
		}
		time.Sleep(200 * time.Millisecond)
	}

	// Configurer les routes
	fmt.Printf("\033[1;34m[info] Setting up API routes...\033[0m\n")
	routes.SetupRoutes(router)
	time.Sleep(200 * time.Millisecond)

	fmt.Printf("\n")
	fmt.Printf("\033[1;32m[✓] All systems operational\033[0m\n")
	fmt.Printf("\n")
	fmt.Printf("\033[1;36m┌─────────────────────────────────────────────────────────────────┐\n")
	fmt.Printf("\033[1;36m│                    🚀 AETHER IDENTITY SERVER READY               │\n")
	fmt.Printf("\033[1;36m├─────────────────────────────────────────────────────────────────┤\n")
	fmt.Printf("\033[1;36m│  🌐 Server listening on: http://localhost:%s                   │\n", cfg.Port)
	fmt.Printf("\033[1;36m│  🔐 OAuth2 Endpoint: http://localhost:%s/oauth/authorize       │\n", cfg.Port)
	fmt.Printf("\033[1;36m│  📊 API Endpoint: http://localhost:%s/api/v1                  │\n", cfg.Port)
	fmt.Printf("\033[1;36m│  ⚡ Mode: %s", gin.Mode())
	if !dbInitialized {
		fmt.Printf(" (Database-less)")
	}
	fmt.Printf("                                                    │\n")
	fmt.Printf("\033[1;36m└─────────────────────────────────────────────────────────────────┘\n")
	fmt.Printf("\033[0;37m\n")
	fmt.Printf("\033[1;33m[info] Press Ctrl+C to stop the server\033[0m\n\n")

	// Démarrer le serveur
	fmt.Printf("\033[1;34m[info] Starting HTTP server...\033[0m\n")
	if err := router.Run(":" + cfg.Port); err != nil {
		fmt.Printf("\033[1;31m[error] Failed to start server: %v\033[0m\n", err)
		log.Fatal(err)
	}
}
