package services

import (
	"github.com/skygenesisenterprise/aether-identity/server/src/models"
	"gorm.io/gorm"
)

type ExtensionService struct {
	DB *gorm.DB
}

func NewExtensionService(db *gorm.DB) *ExtensionService {
	return &ExtensionService{DB: db}
}

func (s *ExtensionService) CreateExtension(ext *models.Extension) error {
	return s.DB.Create(ext).Error
}

func (s *ExtensionService) GetExtension(id string) (*models.Extension, error) {
	var ext models.Extension
	if err := s.DB.First(&ext, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &ext, nil
}

func (s *ExtensionService) GetExtensionByName(name string) (*models.Extension, error) {
	var ext models.Extension
	if err := s.DB.Where("name = ?", name).First(&ext).Error; err != nil {
		return nil, err
	}
	return &ext, nil
}

func (s *ExtensionService) ListExtensions() ([]models.Extension, error) {
	var extensions []models.Extension
	if err := s.DB.Find(&extensions).Error; err != nil {
		return nil, err
	}
	return extensions, nil
}

func (s *ExtensionService) UpdateExtension(ext *models.Extension) error {
	return s.DB.Save(ext).Error
}

func (s *ExtensionService) DeleteExtension(id string) error {
	return s.DB.Delete(&models.Extension{}, "id = ?", id).Error
}
