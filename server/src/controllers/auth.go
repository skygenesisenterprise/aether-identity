package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/skygenesisenterprise/aether-identity/server/src/config"
	"github.com/skygenesisenterprise/aether-identity/server/src/model"
	"github.com/skygenesisenterprise/aether-identity/server/src/services"
)

// Login gère la connexion des utilisateurs
func Login(c *gin.Context) {
	var loginData model.LoginRequest

	if err := c.ShouldBindJSON(&loginData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request body",
		})
		return
	}

	// Authentifier l'utilisateur
	userService := services.NewUserService(services.DB)
	user, err := userService.AuthenticateUser(loginData.Email, loginData.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid email or password",
		})
		return
	}

	// Générer les tokens JWT
	cfg := config.LoadConfig()
	jwtService := services.NewJWTService(cfg.JWTSecret, cfg.AccessTokenExp, cfg.RefreshTokenExp)
	accessToken, err := jwtService.GenerateToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to generate access token",
		})
		return
	}

	refreshTokenString, err := jwtService.GenerateRefreshToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to generate refresh token",
		})
		return
	}

	// Stocker le refresh token en base
	emailService := services.NewEmailService(services.DB)
	_, err = emailService.CreateRefreshToken(user.ID, refreshTokenString)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to store refresh token",
		})
		return
	}

	// Set cookies HTTPOnly pour le token d’accès et le refresh
	ExpiresAccess := time.Now().Add(time.Duration(cfg.AccessTokenExp) * time.Minute)
	ExpiresRefresh := time.Now().Add(time.Duration(cfg.RefreshTokenExp) * time.Minute)

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "AETHER_ACCESS_TOKEN",
		Value:    accessToken,
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
		Expires:  ExpiresAccess,
	})
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "AETHER_REFRESH_TOKEN",
		Value:    refreshTokenString,
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
		Expires:  ExpiresRefresh,
	})

	c.JSON(http.StatusOK, model.TokenResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshTokenString,
		ExpiresIn:    cfg.AccessTokenExp,
	})
}

// Register gère l'inscription des nouveaux utilisateurs
func Register(c *gin.Context) {
	var registerData model.RegisterRequest

	if err := c.ShouldBindJSON(&registerData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request body",
		})
		return
	}

	// Créer l'utilisateur
	userService := services.NewUserService(services.DB)
	user := &model.User{
		Name:     registerData.Name,
		Email:    registerData.Email,
		Password: registerData.Password,
		Role:     "user",
	}

	if err := userService.CreateUser(user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create user",
		})
		return
	}

	// Générer les tokens JWT
	cfg := config.LoadConfig()
	jwtService := services.NewJWTService(cfg.JWTSecret, cfg.AccessTokenExp, cfg.RefreshTokenExp)
	accessToken, err := jwtService.GenerateToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to generate access token",
		})
		return
	}

	refreshTokenString, err := jwtService.GenerateRefreshToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to generate refresh token",
		})
		return
	}

	// Stocker le refresh token en base
	emailService := services.NewEmailService(services.DB)
	_, err = emailService.CreateRefreshToken(user.ID, refreshTokenString)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to store refresh token",
		})
		return
	}

	// Set cookies HTTPOnly pour le token d’accès et le refresh
	ExpiresAccess := time.Now().Add(time.Duration(cfg.AccessTokenExp) * time.Minute)
	ExpiresRefresh := time.Now().Add(time.Duration(cfg.RefreshTokenExp) * time.Minute)

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "AETHER_ACCESS_TOKEN",
		Value:    accessToken,
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
		Expires:  ExpiresAccess,
	})
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "AETHER_REFRESH_TOKEN",
		Value:    refreshTokenString,
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
		Expires:  ExpiresRefresh,
	})

	c.JSON(http.StatusCreated, model.TokenResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshTokenString,
		ExpiresIn:    cfg.AccessTokenExp,
	})
}

// Logout gère la déconnexion
func Logout(c *gin.Context) {
	var request model.RefreshTokenRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request body",
		})
		return
	}

	// Révoquer le refresh token
	emailService := services.NewEmailService(services.DB)
	if err := emailService.RevokeRefreshToken(request.RefreshToken); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to revoke refresh token",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Logged out successfully",
	})
}

// RefreshToken rafraîchit le token JWT
func RefreshToken(c *gin.Context) {
	var refreshData model.RefreshTokenRequest

	if err := c.ShouldBindJSON(&refreshData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request body",
		})
		return
	}

	// Valider le refresh token en base
	emailService := services.NewEmailService(services.DB)
	refreshToken, err := emailService.ValidateRefreshToken(refreshData.RefreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid or expired refresh token",
		})
		return
	}

	// Récupérer l'utilisateur
	userService := services.NewUserService(services.DB)
	user, err := userService.GetUserByID(refreshToken.UserID)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "User not found",
		})
		return
	}

	// Générer un nouveau token d'accès
	cfg := config.LoadConfig()
	jwtService := services.NewJWTService(cfg.JWTSecret, cfg.AccessTokenExp, cfg.RefreshTokenExp)
	newAccessToken, err := jwtService.GenerateToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to generate new access token",
		})
		return
	}

	c.JSON(http.StatusOK, model.TokenResponse{
		AccessToken:  newAccessToken,
		RefreshToken: refreshData.RefreshToken,
		ExpiresIn:    cfg.AccessTokenExp,
	})
}
