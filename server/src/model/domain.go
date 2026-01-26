package model

import (
	"time"
)

// Domain représente un domaine géré par le système
// Un domaine peut être interne (aethermail.*, skygenesisenterprise.*) ou client personnalisé
type Domain struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Name        string    `json:"name" gorm:"unique;not null"`
	DisplayName string    `json:"displayName" gorm:"not null"`
	IsInternal  bool      `json:"isInternal" gorm:"default:false"`
	IsActive    bool      `json:"isActive" gorm:"default:true"`
	OwnerID     *uint     `json:"ownerId,omitempty"` // ID de l'organisation ou utilisateur propriétaire (pour les domaines clients)
	OwnerType   string    `json:"ownerType" gorm:"default:"organization";check:owner_type IN ('organization', 'user')"` // "organization" ou "user"
	CreatedAt   time.Time `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt   time.Time `json:"updatedAt" gorm:"autoUpdateTime"`
	VerifiedAt  *time.Time `json:"verifiedAt,omitempty"` // Date de vérification du domaine
	VerificationToken string `json:"verificationToken,omitempty"` // Token pour la vérification DNS/TXT
	Notes       string    `json:"notes,omitempty"` // Notes administratives
}

// DomainUser représente l'association entre un utilisateur et un domaine
type DomainUser struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	DomainID  uint      `json:"domainId" gorm:"not null"`
	UserID    uint      `json:"userId" gorm:"not null"`
	IsAdmin   bool      `json:"isAdmin" gorm:"default:false"` // Si l'utilisateur est administrateur du domaine
	IsOwner   bool      `json:"isOwner" gorm:"default:false"` // Si l'utilisateur est propriétaire du domaine
	CreatedAt time.Time `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updatedAt" gorm:"autoUpdateTime"`
}

// DomainVerification représente les informations de vérification d'un domaine
type DomainVerification struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	DomainID    uint      `json:"domainId" gorm:"unique;not null"`
	Method      string    `json:"method" gorm:"not null;check:method IN ('dns', 'file', 'mx')"` // Méthode de vérification
	Token       string    `json:"token" gorm:"not null"` // Token de vérification
	Value       string    `json:"value" gorm:"not null"` // Valeur à vérifier (enregistrement DNS, fichier, etc.)
	IsVerified  bool      `json:"isVerified" gorm:"default:false"`
	VerifiedAt  *time.Time `json:"verifiedAt,omitempty"`
	CreatedAt   time.Time `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt   time.Time `json:"updatedAt" gorm:"autoUpdateTime"`
}

// DomainSettings représente les paramètres spécifiques à un domaine
type DomainSettings struct {
	ID              uint      `json:"id" gorm:"primaryKey"`
	DomainID        uint      `json:"domainId" gorm:"unique;not null"`
	EmailPrefix     string    `json:"emailPrefix,omitempty"` // Préfixe pour les adresses email (ex: user@prefix.domain.com)
	EmailSuffix     string    `json:"emailSuffix,omitempty"` // Suffixe pour les adresses email (ex: user@domain.suffix)
	AllowPublicSignUp bool     `json:"allowPublicSignUp" gorm:"default:false"` // Autoriser l'inscription publique
	RequireApproval  bool     `json:"requireApproval" gorm:"default:false"` // Nécessiter une approbation pour les nouveaux utilisateurs
	MaxUsers        *int      `json:"maxUsers,omitempty"` // Nombre maximum d'utilisateurs
	CreatedAt       time.Time `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt       time.Time `json:"updatedAt" gorm:"autoUpdateTime"`
}

// DomainUserCount représente le nombre d'utilisateurs par domaine (vue matérialisée ou calculée)
type DomainUserCount struct {
	DomainID uint `json:"domainId"`
	Count    int  `json:"count"`
}

// DomainWithDetails représente un domaine avec ses informations détaillées
type DomainWithDetails struct {
	Domain
	Owner          interface{} `json:"owner,omitempty"` // Peut être Organization ou User
	UserCount      int         `json:"userCount"`
	IsVerified     bool        `json:"isVerified"`
	Verification   *DomainVerification `json:"verification,omitempty"`
	Settings       *DomainSettings `json:"settings,omitempty"`
}

// DomainVerificationMethod représente les méthodes de vérification disponibles
const (
	DomainVerificationDNS  = "dns"
	DomainVerificationFile = "file"
	DomainVerificationMX   = "mx"
)

// DomainOwnerType représente les types de propriétaires de domaine
const (
	DomainOwnerOrganization = "organization"
	DomainOwnerUser         = "user"
)
