package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/skygenesisenterprise/aether-identity/server/src/config"
	"github.com/skygenesisenterprise/aether-identity/server/src/model"
	"github.com/skygenesisenterprise/aether-identity/server/src/services"
)

// Token endpoints pour OAuth2/password grant (MVP: réplique simple de login)
func Token(c *gin.Context) {
	var loginData model.LoginRequest
	if err := c.ShouldBindJSON(&loginData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	userService := services.NewUserService(services.DB)
	user, err := userService.AuthenticateUser(loginData.Email, loginData.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	cfg := config.LoadConfig()
	jwtService := services.NewJWTService(cfg.JWTSecret, cfg.AccessTokenExp, cfg.RefreshTokenExp)
	accessToken, err := jwtService.GenerateToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate access token"})
		return
	}
	refreshTokenString, err := jwtService.GenerateRefreshToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate refresh token"})
		return
	}

	emailService := services.NewEmailService(services.DB)
	_, err = emailService.CreateRefreshToken(user.ID, refreshTokenString)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store refresh token"})
		return
	}

	ExpiresAccess := time.Now().Add(time.Duration(cfg.AccessTokenExp) * time.Minute)
	http.SetCookie(c.Writer, &http.Cookie{Name: "AETHER_ACCESS_TOKEN", Value: accessToken, Path: "/", HttpOnly: true, Secure: true, SameSite: http.SameSiteLaxMode, Expires: ExpiresAccess})
	expiresRefresh := time.Now().Add(time.Duration(cfg.RefreshTokenExp) * time.Minute)
	http.SetCookie(c.Writer, &http.Cookie{Name: "AETHER_REFRESH_TOKEN", Value: refreshTokenString, Path: "/", HttpOnly: true, Secure: true, SameSite: http.SameSiteLaxMode, Expires: expiresRefresh})

	c.JSON(http.StatusOK, model.TokenResponse{AccessToken: accessToken, RefreshToken: refreshTokenString, ExpiresIn: cfg.AccessTokenExp})
}
