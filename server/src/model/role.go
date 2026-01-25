package model

import "gorm.io/gorm"

// Role représente un rôle RBAC
type Role struct {
	gorm.Model
	Name        string `gorm:"size:50;unique;not null"`
	Permissions string `gorm:"type:text"`
}

func (Role) TableName() string { return "roles" }
