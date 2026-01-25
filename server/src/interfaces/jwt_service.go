package interfaces

import (
	"github.com/golang-jwt/jwt/v5"
	"github.com/skygenesisenterprise/aether-identity/server/src/model"
)

// JWTService définit l'interface pour les opérations JWT
type JWTService interface {
	GenerateToken(user *model.User) (string, error)
	GenerateRefreshToken(userID uint) (string, error)
	ValidateToken(tokenString string) (*jwt.Token, error)
	ExtractClaims(tokenString string) (jwt.MapClaims, error)
}
