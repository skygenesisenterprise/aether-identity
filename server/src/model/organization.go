package model

import "gorm.io/gorm"

// Organization représente une entité Enterprise
type Organization struct {
	gorm.Model
	Name   string `gorm:"size:100;not null"`
	Domain string `gorm:"size:100;unique;not null"`
}

func (Organization) TableName() string { return "organizations" }
