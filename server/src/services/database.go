package services

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"github.com/skygenesisenterprise/aether-identity/server/src/model"
)

// DB est l'instance globale de la base de données
var DB *gorm.DB

// InitDB initialise la connexion à la base de données
func InitDB(dsn string) error {
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return err
	}

	// Auto-migrate les modèles
	if err := DB.AutoMigrate(&model.User{}); err != nil {
		return err
	}

	log.Println("Database connection established successfully")
	return nil
}

// CloseDB ferme la connexion à la base de données
func CloseDB() error {
	sqlDB, err := DB.DB()
	if err != nil {
		return err
	}
	return sqlDB.Close()
}
