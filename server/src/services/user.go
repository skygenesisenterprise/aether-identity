package services

import (
	"errors"

	"github.com/skygenesisenterprise/aether-identity/server/src/model"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// UserService gère les opérations liées aux utilisateurs
type UserService struct {
	DB *gorm.DB
}

// NewUserService crée une nouvelle instance de UserService
func NewUserService(db *gorm.DB) *UserService {
	return &UserService{DB: db}
}

// CreateUser crée un nouvel utilisateur avec validation
func (s *UserService) CreateUser(user *model.User) error {
	// Vérifier si l'email existe déjà
	existingUser, _ := s.GetUserByEmail(user.Email)
	if existingUser != nil {
		return errors.New("email already exists")
	}

	// Hacher le mot de passe
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)

	// Sauvegarder dans la base de données
	return s.DB.Create(user).Error
}

// CheckEmailExists vérifie si un email existe déjà
func (s *UserService) CheckEmailExists(email string) bool {
	var count int64
	s.DB.Model(&model.User{}).Where("email = ?", email).Count(&count)
	return count > 0
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

// UserToResponse convertit un modèle User en une réponse appropriée
func (s *UserService) UserToResponse(user *model.User) map[string]interface{} {
	return map[string]interface{}{
		"id":         user.ID,
		"email":      user.Email,
		"name":       user.Name,
		"created_at": user.CreatedAt,
		"updated_at": user.UpdatedAt,
		"role":       user.Role,
	}
}

// ListUsersFilter représente les filtres pour la liste des utilisateurs
type ListUsersFilter struct {
	Role      string
	IsActive  *bool
	Search    string
	SortBy    string
	SortOrder string
}

// ListUsersResponse représente la réponse paginée de la liste des utilisateurs
type ListUsersResponse struct {
	Users      []model.User `json:"users"`
	Total      int64        `json:"total"`
	Page       int          `json:"page"`
	Limit      int          `json:"limit"`
	TotalPages int          `json:"totalPages"`
}

// ListUsers récupère la liste des utilisateurs avec pagination et filtres
func (s *UserService) ListUsers(page, limit int, filter ListUsersFilter) (*ListUsersResponse, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	offset := (page - 1) * limit

	// Construire la requête de base
	query := s.DB.Model(&model.User{})

	// Appliquer les filtres
	if filter.Role != "" {
		query = query.Where("role = ?", filter.Role)
	}
	if filter.IsActive != nil {
		query = query.Where("is_active = ?", *filter.IsActive)
	}
	if filter.Search != "" {
		searchPattern := "%" + filter.Search + "%"
		query = query.Where(
			"name ILIKE ? OR email ILIKE ?",
			searchPattern,
			searchPattern,
		)
	}

	// Compter le total
	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, err
	}

	// Appliquer le tri
	sortBy := filter.SortBy
	if sortBy == "" {
		sortBy = "created_at"
	}
	sortOrder := filter.SortOrder
	if sortOrder != "asc" && sortOrder != "desc" {
		sortOrder = "desc"
	}
	orderClause := sortBy + " " + sortOrder

	// Récupérer les utilisateurs
	var users []model.User
	if err := query.Order(orderClause).Limit(limit).Offset(offset).Find(&users).Error; err != nil {
		return nil, err
	}

	totalPages := int((total + int64(limit) - 1) / int64(limit))

	return &ListUsersResponse{
		Users:      users,
		Total:      total,
		Page:       page,
		Limit:      limit,
		TotalPages: totalPages,
	}, nil
}
