package interfaces

import "github.com/golang-jwt/jwt/v5"

// JWTService définit l'interface pour les opérations JWT
type JWTService interface {
	GenerateToken(userID uint, email string, role string) (string, error)
	GenerateRefreshToken(userID uint) (string, error)
	ValidateToken(tokenString string) (*jwt.Token, error)
	ExtractClaims(tokenString string) (jwt.MapClaims, error)
}
