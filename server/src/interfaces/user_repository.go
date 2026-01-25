package interfaces

import "github.com/skygenesisenterprise/aether-identity/server/src/model"

// UserRepository définit l'interface pour les opérations sur les utilisateurs
type UserRepository interface {
	CreateUser(user *model.User) error
	GetUserByID(id uint) (*model.User, error)
	GetUserByEmail(email string) (*model.User, error)
	UpdateUser(user *model.User) error
	DeleteUser(id uint) error
	AuthenticateUser(email, password string) (*model.User, error)
}
