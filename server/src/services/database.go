package services

import (
	"log"

	"github.com/skygenesisenterprise/aether-identity/server/src/model"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// DB est l'instance globale de la base de données
var DB *gorm.DB

// InitDB initialise la connexion à la base de données
func InitDB(dsn string) error {
	var err error
	
	// Configurer le logger pour GORM
	config := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Error),
	}
	
	// Se connecter à la base de données
	DB, err = gorm.Open(postgres.Open(dsn), config)
	if err != nil {
		return err
	}
	
	// Configurer la connexion pour gérer les pools de connexions
	sqlDB, err := DB.DB()
	if err != nil {
		return err
	}
	
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(0)
	
	log.Println("Connected to database successfully")
	
	// Auto-migrate les modèles
	if err := AutoMigrate(); err != nil {
		return err
	}
	
	return nil
}

// AutoMigrate exécute l'auto-migration des modèles
func AutoMigrate() error {
	return DB.AutoMigrate(
		&model.User{},
		&model.Organization{},
		&model.Role{},
		&model.Membership{},
		&model.OAuthClient{},
		&model.OAuthAuthorizationCode{},
		&model.OAuthAccessToken{},
		&model.OAuthRefreshToken{},
		&model.OAuthConsent{},
		&model.Domain{},
		&model.DomainUser{},
		&model.DomainVerification{},
		&model.DomainSettings{},
	)
}

// CloseDB ferme la connexion à la base de données
func CloseDB() error {
	sqlDB, err := DB.DB()
	if err != nil {
		return err
	}
	return sqlDB.Close()
}
