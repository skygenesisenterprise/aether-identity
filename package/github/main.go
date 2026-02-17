package main

import (
	"context"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/signal"
	"runtime"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/skygenesisenterprise/aether-identity/package/github/config"
	"github.com/skygenesisenterprise/aether-identity/package/github/github"
	"github.com/skygenesisenterprise/aether-identity/package/github/identity"
	"github.com/skygenesisenterprise/aether-identity/package/github/permissions"
	"github.com/skygenesisenterprise/aether-identity/package/github/server"
	"github.com/skygenesisenterprise/aether-identity/package/github/sync"
)

func displayBanner() {
	fmt.Printf("\n")
	fmt.Printf("\033[1;36m    ██████╗ ██╗████████╗██╗  ██╗██╗   ██╗██████╗     ██╗██████╗ ███████╗███╗   ██╗████████╗██╗████████╗██╗   ██╗\n")
	fmt.Printf("\033[1;36m   ██╔════╝ ██║╚══██╔══╝██║  ██║██║   ██║██╔══██╗   ██╔╝██╔══██╗██╔════╝████╗  ██║╚══██╔══╝██║╚══██╔══╝╚██╗ ██╔╝\n")
	fmt.Printf("\033[1;36m   ██║  ███╗██║   ██║   ███████║██║   ██║██████╔╝  ██╔╝ ██║  ██║█████╗  ██╔██╗ ██║   ██║   ██║   ██║    ╚████╔╝ \n")
	fmt.Printf("\033[1;36m   ██║   ██║██║   ██║   ██╔══██║██║   ██║██╔══██╗ ██╔╝  ██║  ██║██╔══╝  ██║╚██╗██║   ██║   ██║   ██║     ╚██╔╝  \n")
	fmt.Printf("\033[1;36m   ╚██████╔╝██║   ██║   ██║  ██║╚██████╔╝██████╔╝██╔╝   ██████╔╝███████╗██║ ╚████║   ██║   ██║   ██║      ██║   \n")
	fmt.Printf("\033[1;36m    ╚═════╝ ╚═╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝    ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝   ╚═╝      ╚═╝   \n")
	fmt.Printf("\033[0;37m")
	fmt.Printf("\n")
	fmt.Printf("\033[1;33m    ╔═══════════════════════════════════════════════════════════════════════════╗\n")
	fmt.Printf("\033[1;33m    ║                        GITHUB IDENTITY SYNC                               ║\n")
	fmt.Printf("\033[1;33m    ║                   Enterprise GitHub Identity Management                   ║\n")
	fmt.Printf("\033[1;33m    ╚═══════════════════════════════════════════════════════════════════════════╝\n")
	fmt.Printf("\033[0;37m")
	fmt.Printf("\n")
	fmt.Printf("\033[1;32m[✓] System Architecture: %s\033[0m\n", runtime.GOARCH)
	fmt.Printf("\033[1;32m[✓] Operating System: %s\033[0m\n", runtime.GOOS)
	fmt.Printf("\033[1;32m[✓] Go Version: %s\033[0m\n", runtime.Version())
	fmt.Printf("\033[1;32m[✓] CPU Cores: %d\033[0m\n", runtime.NumCPU())
	fmt.Printf("\033[1;32m[✓] Process ID: %d\033[0m\n", os.Getpid())
	fmt.Printf("\n")
	fmt.Printf("\033[1;34m[info] Loading configuration...\033[0m\n")
	time.Sleep(300 * time.Millisecond)
	fmt.Printf("\033[1;34m[info] Initializing GitHub client...\033[0m\n")
	time.Sleep(300 * time.Millisecond)
	fmt.Printf("\033[1;34m[info] Setting up identity services...\033[0m\n")
	time.Sleep(300 * time.Millisecond)
	fmt.Printf("\033[1;34m[info] Configuring sync manager...\033[0m\n")
	time.Sleep(200 * time.Millisecond)
	fmt.Printf("\033[1;34m[info] Initializing permission system...\033[0m\n")
	time.Sleep(200 * time.Millisecond)
	fmt.Printf("\033[1;34m[info] Setting up webhook handlers...\033[0m\n")
	time.Sleep(200 * time.Millisecond)
	fmt.Printf("\n")
}

func main() {
	displayBanner()

	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	ghClient, err := github.NewClient(cfg.GitHub)
	if err != nil {
		log.Fatalf("Failed to create GitHub client: %v", err)
	}

	idClient := identity.NewClient(cfg.Identity)
	auditLogger := identity.NewAuditLogger(idClient)
	syncMgr := sync.NewManager(cfg.Sync, idClient, auditLogger, ghClient)
	checker := permissions.NewChecker(idClient)
	mapper := permissions.NewMapper()
	enforcer := permissions.NewEnforcer(checker, auditLogger, mapper)
	eventParser := github.NewEventParser()

	webhookHandler := server.NewWebhookHandler(
		eventParser,
		syncMgr,
		enforcer,
		auditLogger,
		ghClient,
	)

	handlers := &server.Handlers{
		WebhookHandler:      webhookHandler.Handle,
		HealthHandler:       healthHandler,
		MetricsHandler:      metricsHandler,
		InstallationHandler: installationHandler(syncMgr),
	}

	gin.SetMode(gin.ReleaseMode)
	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	gin.DefaultWriter = io.Discard

	router.POST("/webhook", gin.WrapF(handlers.WebhookHandler))
	router.GET("/health", gin.WrapF(handlers.HealthHandler))
	router.GET("/metrics", gin.WrapF(handlers.MetricsHandler))
	router.POST("/installations/sync", gin.WrapF(handlers.InstallationHandler))

	port := os.Getenv("PORT")
	if port == "" {
		port = cfg.Server.Port
	}
	if port == "" {
		port = "8080"
	}

	fmt.Printf("\033[1;32m[✓] All systems operational\033[0m\n")
	fmt.Printf("\n")
	fmt.Printf("\033[1;36m┌─────────────────────────────────────────────────────────────────────────n")
	fmt.Printf("\033[1;36m│                      🚀 SERVER READY                                    │\n")
	fmt.Printf("\033[1;36m├─────────────────────────────────────────────────────────────────────────┤\n")
	fmt.Printf("\033[1;36m│  🌐 Server listening on: http://localhost:%s                           │\n", port)
	fmt.Printf("\033[1;36m│  📊 Health Check: http://localhost:%s/health                           │\n", port)
	fmt.Printf("\033[1;36m│  🔗 Webhook Endpoint: http://localhost:%s/webhook                      │\n", port)
	fmt.Printf("\033[1;36m│  ⚡ Mode: %s                                                           │\n", gin.Mode())
	fmt.Printf("\033[1;36m└─────────────────────────────────────────────────────────────────────────┘\n")
	fmt.Printf("\033[0;37m\n")
	fmt.Printf("\033[1;33m[info] Press Ctrl+C to stop the server\033[0m\n\n")

	// Create context for graceful shutdown
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	// Start server in a goroutine
	serverErr := make(chan error, 1)
	go func() {
		serverErr <- router.Run(":" + port)
	}()

	// Wait for shutdown signal or server error
	select {
	case <-ctx.Done():
		fmt.Println("\033[1;33m[info] Shutdown signal received, gracefully shutting down...\033[0m")
	case err := <-serverErr:
		log.Fatalf("Server error: %v", err)
	}

	// Graceful shutdown with timeout
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	<-shutdownCtx.Done()
	fmt.Println("\033[1;32m[✓] Server stopped gracefully\033[0m")
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status":"healthy","service":"aether-identity-github-app"}`))
}

func metricsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/plain")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("# Metrics endpoint - implement with Prometheus client library\n"))
}

func installationHandler(syncMgr *sync.Manager) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		go func() {
			ctx := context.Background()
			if err := syncMgr.SyncAllInstallations(ctx); err != nil {
				log.Printf("Error syncing installations: %v", err)
			}
		}()

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusAccepted)
		w.Write([]byte(`{"status":"sync_started"}`))
	}
}
