package model

import (
	"time"

	"gorm.io/gorm"
)

// ExternalAccount représente un compte externe lié à un utilisateur
type ExternalAccount struct {
	ID             uint           `json:"id" gorm:"primaryKey"`
	UserID         uint           `json:"userId" gorm:"not null;index:idx_user_provider,unique"`
	Provider       string         `json:"provider" gorm:"size:50;not null;index:idx_user_provider,unique"` // github, google, microsoft, discord
	ProviderUserID string         `json:"providerUserId" gorm:"size:255;not null;index:idx_provider_user_id,unique"`
	Email          string         `json:"email" gorm:"size:255"`
	Name           string         `json:"name" gorm:"size:255"`
	AvatarURL      string         `json:"avatarUrl" gorm:"size:512"`
	AccessToken    string         `json:"-" gorm:"size:512"` // Token chiffré
	RefreshToken   string         `json:"-" gorm:"size:512"` // Token chiffré
	TokenExpiresAt *time.Time     `json:"-"`
	ProviderData   string         `json:"-" gorm:"type:text"`             // Données JSON brutes du provider
	IsPrimary      bool           `json:"isPrimary" gorm:"default:false"` // Pour l'authentification principale
	LastLoginAt    *time.Time     `json:"lastLoginAt"`
	CreatedAt      time.Time      `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt      time.Time      `json:"updatedAt" gorm:"autoUpdateTime"`
	DeletedAt      gorm.DeletedAt `json:"-" gorm:"index"`

	// Relations
	User User `json:"-" gorm:"foreignKey:UserID"`
}

// TableName spécifie le nom de la table
func (ExternalAccount) TableName() string {
	return "external_accounts"
}

// ExternalAccountResponse représente la réponse publique d'un compte externe
type ExternalAccountResponse struct {
	ID          uint       `json:"id"`
	Provider    string     `json:"provider"`
	Email       string     `json:"email"`
	Name        string     `json:"name"`
	AvatarURL   string     `json:"avatarUrl"`
	IsPrimary   bool       `json:"isPrimary"`
	LastLoginAt *time.Time `json:"lastLoginAt,omitempty"`
	CreatedAt   time.Time  `json:"createdAt"`
}

// ToResponse convertit le modèle en réponse publique
func (ea *ExternalAccount) ToResponse() *ExternalAccountResponse {
	return &ExternalAccountResponse{
		ID:          ea.ID,
		Provider:    ea.Provider,
		Email:       ea.Email,
		Name:        ea.Name,
		AvatarURL:   ea.AvatarURL,
		IsPrimary:   ea.IsPrimary,
		LastLoginAt: ea.LastLoginAt,
		CreatedAt:   ea.CreatedAt,
	}
}

// ProviderUserInfo représente les informations récupérées d'un provider OAuth
type ProviderUserInfo struct {
	ID       string `json:"id"`
	Email    string `json:"email"`
	Name     string `json:"name"`
	Avatar   string `json:"avatar"`
	Username string `json:"username,omitempty"`
	Verified bool   `json:"verified,omitempty"`
}

// OAuthState représente l'état temporaire d'une transaction OAuth
type OAuthState struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	State     string    `json:"state" gorm:"uniqueIndex;size:128;not null"`
	Provider  string    `json:"provider" gorm:"size:50;not null"`
	UserID    *uint     `json:"userId"`                         // Null si nouvelle connexion, UserID si linkage
	Action    string    `json:"action" gorm:"size:20;not null"` // "login" ou "link"
	ExpiresAt time.Time `json:"expiresAt" gorm:"not null"`
	CreatedAt time.Time `json:"createdAt" gorm:"autoCreateTime"`
}

// TableName spécifie le nom de la table
func (OAuthState) TableName() string {
	return "oauth_states"
}

// IsExpired vérifie si le state est expiré
func (s *OAuthState) IsExpired() bool {
	return time.Now().After(s.ExpiresAt)
}
