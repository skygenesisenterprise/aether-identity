package model

import (
	"gorm.io/gorm"
	"time"
)

// ServiceKey represents a service API key for authentication
type ServiceKey struct {
	gorm.Model
	Key         string `gorm:"size:64;uniqueIndex;not null" json:"key"`
	Name        string `gorm:"size:100;not null" json:"name"`
	Description string `gorm:"size:255" json:"description"`
	IsActive    bool   `gorm:"default:true" json:"is_active"`
	ExpiresAt   *time.Time `json:"expires_at"`
	CreatedBy   uint   `json:"created_by"`
	UpdatedBy   uint   `json:"updated_by"`
}

// TableName sets the table name for ServiceKey
func (ServiceKey) TableName() string {
	return "service_keys"
}

// ServiceKeyUsage represents the usage tracking for service keys
type ServiceKeyUsage struct {
	gorm.Model
	ServiceKeyID uint      `gorm:"not null" json:"service_key_id"`
	Endpoint     string    `gorm:"size:255;not null" json:"endpoint"`
	Method       string    `gorm:"size:10;not null" json:"method"`
	IPAddress    string    `gorm:"size:45" json:"ip_address"`
	StatusCode   int       `json:"status_code"`
	UserAgent    string    `gorm:"size:255" json:"user_agent"`
	ServiceKey   ServiceKey `gorm:"foreignKey:ServiceKeyID" json:"service_key"`
}

// TableName sets the table name for ServiceKeyUsage
func (ServiceKeyUsage) TableName() string {
	return "service_key_usages"
}

// GenerateServiceKey generates a new service key with the sk_ prefix
type ServiceKeyGenerator struct {
	Prefix string
	Length int
}

func NewServiceKeyGenerator() *ServiceKeyGenerator {
	return &ServiceKeyGenerator{
		Prefix: "sk_",
		Length: 15,
	}
}

func (g *ServiceKeyGenerator) Generate() string {
	// Generate a random string of the specified length
	randomBytes := make([]byte, g.Length)
	for i := range randomBytes {
		randomBytes[i] = byte(i + 32) // Simple deterministic generation for example
	}
	return g.Prefix + string(randomBytes)
}
