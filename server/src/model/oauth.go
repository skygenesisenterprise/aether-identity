package model

import (
	"time"
)

// OAuthClient représente un client OAuth2/OpenID Connect
type OAuthClient struct {
	ID             uint      `json:"id" gorm:"primaryKey"`
	ClientID       string    `json:"clientId" gorm:"unique;not null"`
	ClientSecret   string    `json:"clientSecret" gorm:"not null"`
	Name           string    `json:"name" gorm:"not null"`
	RedirectURIs   []string  `json:"redirectUris" gorm:"type:text[]"`
	GrantTypes     []string  `json:"grantTypes" gorm:"type:text[]"`
	Scopes         []string  `json:"scopes" gorm:"type:text[]"`
	PostLoginPath  string    `json:"postLoginPath" gorm:"default:/"`    // Chemin après login
	PostLogoutPath string    `json:"postLogoutPath" gorm:"default:/"`   // Chemin après logout
	AllowedOrigins []string  `json:"allowedOrigins" gorm:"type:text[]"` // CORS origins autorisées
	CreatedAt      time.Time `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt      time.Time `json:"updatedAt" gorm:"autoUpdateTime"`
}

// OAuthAuthorizationCode représente un code d'autorisation OAuth2
type OAuthAuthorizationCode struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Code        string    `json:"code" gorm:"unique;not null"`
	ClientID    string    `json:"clientId" gorm:"not null"`
	UserID      uint      `json:"userId" gorm:"not null"`
	RedirectURI string    `json:"redirectUri" gorm:"not null"`
	Scopes      []string  `json:"scopes" gorm:"type:text[]"`
	ExpiresAt   time.Time `json:"expiresAt" gorm:"not null"`
	CreatedAt   time.Time `json:"createdAt" gorm:"autoCreateTime"`
}

// OAuthAccessToken représente un token d'accès OAuth2
type OAuthAccessToken struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Token     string    `json:"token" gorm:"unique;not null"`
	ClientID  string    `json:"clientId" gorm:"not null"`
	UserID    uint      `json:"userId" gorm:"not null"`
	Scopes    []string  `json:"scopes" gorm:"type:text[]"`
	ExpiresAt time.Time `json:"expiresAt" gorm:"not null"`
	CreatedAt time.Time `json:"createdAt" gorm:"autoCreateTime"`
}

// OAuthRefreshToken représente un token de rafraîchissement OAuth2
type OAuthRefreshToken struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Token     string    `json:"token" gorm:"unique;not null"`
	ClientID  string    `json:"clientId" gorm:"not null"`
	UserID    uint      `json:"userId" gorm:"not null"`
	ExpiresAt time.Time `json:"expiresAt" gorm:"not null"`
	CreatedAt time.Time `json:"createdAt" gorm:"autoCreateTime"`
}

// OAuthConsent représente le consentement de l'utilisateur
type OAuthConsent struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    uint      `json:"userId" gorm:"not null"`
	ClientID  string    `json:"clientId" gorm:"not null"`
	Scopes    []string  `json:"scopes" gorm:"type:text[]"`
	CreatedAt time.Time `json:"createdAt" gorm:"autoCreateTime"`
}

// AuthorizationRequest représente une requête d'autorisation OAuth2
type AuthorizationRequest struct {
	ClientID      string `form:"client_id" binding:"required"`
	RedirectURI   string `form:"redirect_uri" binding:"required"`
	ResponseType  string `form:"response_type" binding:"required"`
	Scope         string `form:"scope"`
	State         string `form:"state"`
	CodeChallenge string `form:"code_challenge"`
	CodeMethod    string `form:"code_method"`
	Nonce         string `form:"nonce"`
}

// TokenRequest représente une requête de token OAuth2
type TokenRequest struct {
	GrantType    string `form:"grant_type" binding:"required"`
	Code         string `form:"code"`
	RedirectURI  string `form:"redirect_uri"`
	ClientID     string `form:"client_id"`
	ClientSecret string `form:"client_secret"`
	RefreshToken string `form:"refresh_token"`
	Username     string `form:"username"`
	Password     string `form:"password"`
}

// TokenResponse représente une réponse de token OAuth2
type TokenResponse struct {
	AccessToken  string `json:"access_token"`
	TokenType    string `json:"token_type"`
	ExpiresIn    int    `json:"expires_in"`
	RefreshToken string `json:"refresh_token,omitempty"`
	IDToken      string `json:"id_token,omitempty"`
	Scope        string `json:"scope,omitempty"`
}

// UserInfoResponse représente une réponse d'information utilisateur OpenID Connect
type UserInfoResponse struct {
	Sub           string   `json:"sub"`
	Name          string   `json:"name,omitempty"`
	Email         string   `json:"email,omitempty"`
	EmailVerified bool     `json:"email_verified,omitempty"`
	GivenName     string   `json:"given_name,omitempty"`
	FamilyName    string   `json:"family_name,omitempty"`
	Roles         []string `json:"roles,omitempty"`
}
