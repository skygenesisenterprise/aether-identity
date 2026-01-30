package server

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/skygenesisenterprise/aether-identity/package/github/errors"
)

// Middleware provides HTTP middleware functions
type Middleware struct {
	webhookSecret string
}

// NewMiddleware creates a new middleware instance
func NewMiddleware(webhookSecret string) *Middleware {
	return &Middleware{
		webhookSecret: webhookSecret,
	}
}

// LoggingMiddleware logs all HTTP requests
func (m *Middleware) LoggingMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// Create a response writer wrapper to capture status code
		wrapped := &responseWriter{ResponseWriter: w, statusCode: http.StatusOK}

		next(wrapped, r)

		duration := time.Since(start)
		log.Printf("[%s] %s %s - %d - %v",
			r.Method,
			r.URL.Path,
			r.RemoteAddr,
			wrapped.statusCode,
			duration,
		)
	}
}

// RecoveryMiddleware recovers from panics
func (m *Middleware) RecoveryMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				log.Printf("Panic recovered: %v", err)
				http.Error(w, "Internal server error", http.StatusInternalServerError)
			}
		}()

		next(w, r)
	}
}

// RequestIDMiddleware adds a request ID to the context
func (m *Middleware) RequestIDMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		requestID := r.Header.Get("X-Request-ID")
		if requestID == "" {
			requestID = generateRequestID()
		}

		// Add to response headers
		w.Header().Set("X-Request-ID", requestID)

		// Add to context
		ctx := context.WithValue(r.Context(), "request_id", requestID)
		next(w, r.WithContext(ctx))
	}
}

// CORSMiddleware adds CORS headers
func (m *Middleware) CORSMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-GitHub-Event, X-GitHub-Delivery, X-Hub-Signature, X-Hub-Signature-256")

		// Handle preflight requests
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

// SecurityHeadersMiddleware adds security headers
func (m *Middleware) SecurityHeadersMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Security headers
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("X-XSS-Protection", "1; mode=block")
		w.Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")

		next(w, r)
	}
}

// TimeoutMiddleware adds a timeout to the request context
func (m *Middleware) TimeoutMiddleware(timeout time.Duration) func(http.HandlerFunc) http.HandlerFunc {
	return func(next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			ctx, cancel := context.WithTimeout(r.Context(), timeout)
			defer cancel()

			next(w, r.WithContext(ctx))
		}
	}
}

// Chain chains multiple middleware functions
func Chain(middlewares ...func(http.HandlerFunc) http.HandlerFunc) func(http.HandlerFunc) http.HandlerFunc {
	return func(final http.HandlerFunc) http.HandlerFunc {
		for i := len(middlewares) - 1; i >= 0; i-- {
			final = middlewares[i](final)
		}
		return final
	}
}

// responseWriter is a wrapper around http.ResponseWriter to capture status code
type responseWriter struct {
	http.ResponseWriter
	statusCode int
}

// WriteHeader captures the status code
func (rw *responseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}

// GetRequestID retrieves the request ID from context
func GetRequestID(ctx context.Context) string {
	if id, ok := ctx.Value("request_id").(string); ok {
		return id
	}
	return ""
}

// ErrorHandler is a generic error handler
func ErrorHandler(w http.ResponseWriter, err error, statusCode int) {
	requestID := ""

	log.Printf("Error: %v", err)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	response := map[string]interface{}{
		"error":      err.Error(),
		"request_id": requestID,
		"timestamp":  time.Now().UTC().Format(time.RFC3339),
	}

	if appErr, ok := err.(*errors.AppError); ok {
		response["error_type"] = appErr.Type
		response["error_code"] = appErr.Code
	}

	// Simple JSON encoding without importing encoding/json
	w.Write([]byte(`{"error":"` + err.Error() + `","request_id":"` + requestID + `"}`))
}
