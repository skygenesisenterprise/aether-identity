package main

import (
	"fmt"
	"os"
	"runtime"

	"github.com/gin-gonic/gin"

	"github.com/skygenesisenterprise/aether-identity/server/src/config"
	"github.com/skygenesisenterprise/aether-identity/server/src/middleware"
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
	fmt.Printf("\033[0;37m")
	fmt.Printf("\n")
	fmt.Printf("\033[1;33m    ╔══════════════════════════════════════════════════════════════╗\n")
	fmt.Printf("\033[1;33m    ║                     Aether Identity                          ║\n")
	fmt.Printf("\033[1;33m    ║               Enterprise Account Management                  ║\n")
	fmt.Printf("\033[1;33m    ║                   Version 1.0.0-alpha                        ║\n")
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
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	displayBanner()

	cfg := config.LoadConfig()

	serviceKeyService := services.NewServiceKeyService(nil)

	router := gin.New()
	router.Use(gin.Recovery())

	router.Use(middleware.AdaptiveCORSMiddleware())

	routes.SetupRoutes(router, cfg.SystemKey, serviceKeyService, nil)

	addr := fmt.Sprintf(":%s", cfg.Port)
	fmt.Printf("\033[1;32m[✓] Server starting on %s\033[0m\n", addr)
	fmt.Printf("\033[1;36m[✓] API available at http://localhost%s/api/v1\033[0m\n", addr)
	fmt.Printf("\n")

	if err := router.Run(addr); err != nil {
		fmt.Printf("\033[1;31m[✗] Failed to start server: %v\033[0m\n", err)
		os.Exit(1)
	}
}
