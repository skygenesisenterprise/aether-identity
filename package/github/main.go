package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/skygenesisenterprise/aether-identity/package/github/config"
	"github.com/skygenesisenterprise/aether-identity/package/github/github"
	"github.com/skygenesisenterprise/aether-identity/package/github/identity"
	"github.com/skygenesisenterprise/aether-identity/package/github/permissions"
	"github.com/skygenesisenterprise/aether-identity/package/github/server"
	"github.com/skygenesisenterprise/aether-identity/package/github/sync"
)

// App represents the GitHub App application
type App struct {
	config         *config.Config
	githubClient   *github.Client
	identityClient *identity.Client
	auditLogger    *identity.AuditLogger
	syncManager    *sync.Manager
	checker        *permissions.Checker
	mapper         *permissions.Mapper
	enforcer       *permissions.Enforcer
	webhookHandler *server.WebhookHandler
	httpServer     *server.Server
}

// NewApp creates a new GitHub App instance
func NewApp() (*App, error) {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		return nil, err
	}

	// Create GitHub client
	ghClient, err := github.NewClient(cfg.GitHub)
	if err != nil {
		return nil, err
	}

	// Create Identity client
	idClient := identity.NewClient(cfg.Identity)

	// Create audit logger
	auditLogger := identity.NewAuditLogger(idClient)

	// Create sync manager
	syncMgr := sync.NewManager(cfg.Sync, idClient, auditLogger, ghClient)

	// Create permission checker
	checker := permissions.NewChecker(idClient)

	// Create permission mapper
	mapper := permissions.NewMapper()

	// Create enforcer
	enforcer := permissions.NewEnforcer(checker, auditLogger, mapper)

	// Create event parser
	eventParser := github.NewEventParser()

	// Create webhook handler
	webhookHandler := server.NewWebhookHandler(
		eventParser,
		syncMgr,
		enforcer,
		auditLogger,
		ghClient,
	)

	// Create HTTP handlers
	handlers := &server.Handlers{
		WebhookHandler:      webhookHandler.Handle,
		HealthHandler:       healthHandler,
		MetricsHandler:      metricsHandler,
		InstallationHandler: installationHandler(syncMgr),
	}

	// Create HTTP server
	httpServer := server.NewServer(cfg.Server, handlers)

	return &App{
		config:         cfg,
		githubClient:   ghClient,
		identityClient: idClient,
		auditLogger:    auditLogger,
		syncManager:    syncMgr,
		checker:        checker,
		mapper:         mapper,
		enforcer:       enforcer,
		webhookHandler: webhookHandler,
		httpServer:     httpServer,
	}, nil
}

// Run starts the GitHub App
func (a *App) Run() error {
	// Create context for graceful shutdown
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	// Start HTTP server in a goroutine
	serverErr := make(chan error, 1)
	go func() {
		log.Printf("Starting GitHub App on %s", a.httpServer.Addr())
		if err := a.httpServer.Start(); err != nil {
			serverErr <- err
		}
	}()

	// Wait for shutdown signal or server error
	select {
	case <-ctx.Done():
		log.Println("Shutdown signal received, gracefully shutting down...")
	case err := <-serverErr:
		return err
	}

	// Graceful shutdown with timeout
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := a.httpServer.Stop(shutdownCtx); err != nil {
		log.Printf("Error during shutdown: %v", err)
		return err
	}

	log.Println("Server stopped gracefully")
	return nil
}

// healthHandler handles health check requests
func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status":"healthy","service":"aether-identity-github-app"}`))
}

// metricsHandler handles metrics requests (placeholder for Prometheus/metrics)
func metricsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/plain")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("# Metrics endpoint - implement with Prometheus client library\n"))
}

// installationHandler handles installation management requests
func installationHandler(syncMgr *sync.Manager) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		// Trigger sync for all installations
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

func main() {
	app, err := NewApp()
	if err != nil {
		log.Fatalf("Failed to create app: %v", err)
	}

	if err := app.Run(); err != nil {
		log.Fatalf("Error running app: %v", err)
	}
}
