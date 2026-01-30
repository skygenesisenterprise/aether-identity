package server

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/skygenesisenterprise/aether-identity/package/github/config"
)

// Server represents the HTTP server for the GitHub App
type Server struct {
	config     config.ServerConfig
	httpServer *http.Server
	mux        *http.ServeMux
	handlers   *Handlers
}

// Handlers contains all HTTP handlers
type Handlers struct {
	WebhookHandler      http.HandlerFunc
	HealthHandler       http.HandlerFunc
	MetricsHandler      http.HandlerFunc
	InstallationHandler http.HandlerFunc
}

// NewServer creates a new HTTP server
func NewServer(cfg config.ServerConfig, handlers *Handlers) *Server {
	mux := http.NewServeMux()

	s := &Server{
		config:   cfg,
		mux:      mux,
		handlers: handlers,
	}

	// Setup routes
	s.setupRoutes()

	// Create HTTP server
	s.httpServer = &http.Server{
		Addr:         fmt.Sprintf("%s:%s", cfg.Host, cfg.Port),
		Handler:      mux,
		ReadTimeout:  cfg.ReadTimeout,
		WriteTimeout: cfg.WriteTimeout,
		IdleTimeout:  cfg.IdleTimeout,
	}

	return s
}

// setupRoutes configures all HTTP routes
func (s *Server) setupRoutes() {
	// Health check endpoint
	s.mux.HandleFunc("/health", s.handlers.HealthHandler)

	// Metrics endpoint (for monitoring)
	s.mux.HandleFunc("/metrics", s.handlers.MetricsHandler)

	// Webhook endpoint - GitHub sends events here
	s.mux.HandleFunc("/webhooks", s.handlers.WebhookHandler)

	// Installation management endpoint
	s.mux.HandleFunc("/installations", s.handlers.InstallationHandler)

	// Default handler for unknown paths
	s.mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" {
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(`{"status": "ok", "service": "aether-identity-github-app"}`))
			return
		}
		http.NotFound(w, r)
	})
}

// Start starts the HTTP server
func (s *Server) Start() error {
	log.Printf("Starting GitHub App server on %s", s.httpServer.Addr)
	return s.httpServer.ListenAndServe()
}

// Stop gracefully shuts down the server
func (s *Server) Stop(ctx context.Context) error {
	log.Println("Shutting down GitHub App server...")
	return s.httpServer.Shutdown(ctx)
}

// Addr returns the server address
func (s *Server) Addr() string {
	return s.httpServer.Addr
}
