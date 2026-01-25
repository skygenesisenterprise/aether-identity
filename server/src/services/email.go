package services

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"time"

	"github.com/skygenesisenterprise/aether-identity/server/src/model"
	"gorm.io/gorm"
)

// EmailService gère les opérations liées aux emails et tokens
type EmailService struct {
	DB *gorm.DB
}

// NewEmailService crée une nouvelle instance de EmailService
func NewEmailService(db *gorm.DB) *EmailService {
	return &EmailService{DB: db}
}

// GenerateToken génère un token aléatoire sécurisé
func (s *EmailService) GenerateToken() (string, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

// CreateEmailVerification crée un token de vérification d'email
func (s *EmailService) CreateEmailVerification(userID uint) (*model.EmailVerification, error) {
	// Supprimer les anciens tokens non utilisés
	s.DB.Where("user_id = ? AND is_used = false", userID).Delete(&model.EmailVerification{})

	token, err := s.GenerateToken()
	if err != nil {
		return nil, err
	}

	verification := &model.EmailVerification{
		UserID:    userID,
		Token:     token,
		ExpiresAt: time.Now().Add(24 * time.Hour), // 24 heures
		IsUsed:    false,
	}

	if err := s.DB.Create(verification).Error; err != nil {
		return nil, err
	}

	return verification, nil
}

// VerifyEmail vérifie un email avec un token
func (s *EmailService) VerifyEmail(token string) (*model.User, error) {
	var verification model.EmailVerification
	if err := s.DB.Where("token = ? AND is_used = false AND expires_at > ?", token, time.Now()).First(&verification).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("invalid or expired token")
		}
		return nil, err
	}

	// Marquer le token comme utilisé
	verification.IsUsed = true
	if err := s.DB.Save(&verification).Error; err != nil {
		return nil, err
	}

	// Activer le compte utilisateur
	var user model.User
	if err := s.DB.First(&user, verification.UserID).Error; err != nil {
		return nil, err
	}

	user.IsActive = true
	if err := s.DB.Save(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

// CreatePasswordReset crée un token de réinitialisation de mot de passe
func (s *EmailService) CreatePasswordReset(email string) (*model.PasswordReset, error) {
	// Récupérer l'utilisateur
	var user model.User
	if err := s.DB.Where("email = ?", email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}

	// Supprimer les anciens tokens non utilisés
	s.DB.Where("user_id = ? AND is_used = false", user.ID).Delete(&model.PasswordReset{})

	token, err := s.GenerateToken()
	if err != nil {
		return nil, err
	}

	reset := &model.PasswordReset{
		UserID:    user.ID,
		Token:     token,
		ExpiresAt: time.Now().Add(1 * time.Hour), // 1 heure
		IsUsed:    false,
	}

	if err := s.DB.Create(reset).Error; err != nil {
		return nil, err
	}

	return reset, nil
}

// ResetPassword réinitialise le mot de passe avec un token
func (s *EmailService) ResetPassword(token, newPassword string) error {
	var reset model.PasswordReset
	if err := s.DB.Where("token = ? AND is_used = false AND expires_at > ?", token, time.Now()).First(&reset).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("invalid or expired token")
		}
		return err
	}

	// Marquer le token comme utilisé
	reset.IsUsed = true
	if err := s.DB.Save(&reset).Error; err != nil {
		return err
	}

	// Mettre à jour le mot de passe utilisateur
	userService := NewUserService(s.DB)
	user, err := userService.GetUserByID(reset.UserID)
	if err != nil {
		return err
	}

	user.Password = newPassword
	return userService.UpdateUser(user)
}

// CreateRefreshToken crée un refresh token en base
func (s *EmailService) CreateRefreshToken(userID uint, token string) (*model.RefreshToken, error) {
	// Supprimer les anciens tokens révoqués ou expirés
	s.DB.Where("user_id = ? AND (is_revoked = true OR expires_at < ?)", userID, time.Now()).Delete(&model.RefreshToken{})

	refreshToken := &model.RefreshToken{
		UserID:    userID,
		Token:     token,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour), // 7 jours
		IsRevoked: false,
	}

	if err := s.DB.Create(refreshToken).Error; err != nil {
		return nil, err
	}

	return refreshToken, nil
}

// ValidateRefreshToken valide un refresh token
func (s *EmailService) ValidateRefreshToken(token string) (*model.RefreshToken, error) {
	var refreshToken model.RefreshToken
	if err := s.DB.Where("token = ? AND is_revoked = false AND expires_at > ?", token, time.Now()).First(&refreshToken).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("invalid or expired refresh token")
		}
		return nil, err
	}

	// Mettre à jour la date de dernière utilisation
	now := time.Now()
	refreshToken.LastUsedAt = &now
	s.DB.Save(&refreshToken)

	return &refreshToken, nil
}

// RevokeRefreshToken révoque un refresh token
func (s *EmailService) RevokeRefreshToken(token string) error {
	return s.DB.Model(&model.RefreshToken{}).Where("token = ?", token).Update("is_revoked", true).Error
}

// RevokeAllUserRefreshTokens révoque tous les refresh tokens d'un utilisateur
func (s *EmailService) RevokeAllUserRefreshTokens(userID uint) error {
	return s.DB.Model(&model.RefreshToken{}).Where("user_id = ?", userID).Update("is_revoked", true).Error
}

// SendEmailVerificationEmail envoie un email de vérification (simulation)
func (s *EmailService) SendEmailVerificationEmail(email, token string) error {
	// TODO: Intégrer avec un service d'email réel (SendGrid, AWS SES, etc.)
	verificationURL := fmt.Sprintf("http://localhost:3000/verify-email?token=%s", token)

	fmt.Printf("=== EMAIL VERIFICATION ===\n")
	fmt.Printf("To: %s\n", email)
	fmt.Printf("Verification URL: %s\n", verificationURL)
	fmt.Printf("========================\n")

	return nil
}

// SendPasswordResetEmail envoie un email de réinitialisation (simulation)
func (s *EmailService) SendPasswordResetEmail(email, token string) error {
	// TODO: Intégrer avec un service d'email réel
	resetURL := fmt.Sprintf("http://localhost:3000/reset-password?token=%s", token)

	fmt.Printf("=== PASSWORD RESET ===\n")
	fmt.Printf("To: %s\n", email)
	fmt.Printf("Reset URL: %s\n", resetURL)
	fmt.Printf("====================\n")

	return nil
}
