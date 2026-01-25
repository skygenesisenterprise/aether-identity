package model

import "gorm.io/gorm"

// Membership définit l'appartenance utilisateur → org → role
type Membership struct {
	gorm.Model
	UserID uint
	OrgID  uint
	RoleID uint
}

func (Membership) TableName() string { return "memberships" }
