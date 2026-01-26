package model

// LoginRequest représente les données de connexion
type LoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// RegisterRequest représente les données d'inscription
type RegisterRequest struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// JWTTokenResponse représente la réponse avec les tokens JWT
type JWTTokenResponse struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
	ExpiresIn    int    `json:"expiresIn"`
}

// RefreshTokenRequest représente les données pour rafraîchir un token
type RefreshTokenRequest struct {
	RefreshToken string `json:"refreshToken" binding:"required"`
}
