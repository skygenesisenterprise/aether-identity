package model

import (
	"gorm.io/gorm"
)

// User représente un utilisateur dans la base de données
type User struct {
	gorm.Model
	Name      string `gorm:"size:100;not null" json:"name"`
	Email     string `gorm:"size:100;unique;not null" json:"email"`
	Password  string `gorm:"size:255;not null" json:"-"`
	Role      string `gorm:"size:50;default:user" json:"role"`
	IsActive  bool   `gorm:"default:true" json:"isActive"`
}

// TableName spécifie le nom de la table pour le modèle User
func (User) TableName() string {
	return "users"
}

// UserResponse représente la réponse utilisateur sans le mot de passe
type UserResponse struct {
	ID       uint   `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Role     string `json:"role"`
	IsActive bool   `json:"isActive"`
	CreatedAt int64  `json:"createdAt"`
	UpdatedAt int64  `json:"updatedAt"`
}

// ToResponse convertit un modèle User en UserResponse
func (u *User) ToResponse() *UserResponse {
	return &UserResponse{
		ID:       u.ID,
		Name:     u.Name,
		Email:    u.Email,
		Role:     u.Role,
		IsActive: u.IsActive,
		CreatedAt: u.CreatedAt.Unix(),
		UpdatedAt: u.UpdatedAt.Unix(),
	}
}
