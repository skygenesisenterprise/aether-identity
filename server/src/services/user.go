package services

import (
	"errors"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"github.com/skygenesisenterprise/aether-identity/server/src/model"
)

// UserService gère les opérations liées aux utilisateurs
type UserService struct {
	DB *gorm.DB
}

// NewUserService crée une nouvelle instance de UserService
func NewUserService(db *gorm.DB) *UserService {
	return &UserService{DB: db}
}

// CreateUser crée un nouvel utilisateur
func (s *UserService) CreateUser(user *model.User) error {
	// Hacher le mot de passe
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)

	// Sauvegarder dans la base de données
	return s.DB.Create(user).Error
}

// GetUserByID récupère un utilisateur par son ID
func (s *UserService) GetUserByID(id uint) (*model.User, error) {
	var user model.User
	if err := s.DB.First(&user, id).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

// GetUserByEmail récupère un utilisateur par son email
func (s *UserService) GetUserByEmail(email string) (*model.User, error) {
	var user model.User
	if err := s.DB.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

// UpdateUser met à jour un utilisateur
func (s *UserService) UpdateUser(user *model.User) error {
	// Si le mot de passe est fourni, le hacher
	if user.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			return err
		}
		user.Password = string(hashedPassword)
	}

	return s.DB.Save(user).Error
}

// DeleteUser supprime un utilisateur
func (s *UserService) DeleteUser(id uint) error {
	return s.DB.Delete(&model.User{}, id).Error
}

// AuthenticateUser authentifie un utilisateur
func (s *UserService) AuthenticateUser(email, password string) (*model.User, error) {
	user, err := s.GetUserByEmail(email)
	if err != nil {
		return nil, err
	}

	// Vérifier le mot de passe
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, errors.New("invalid password")
	}

	return user, nil
}
