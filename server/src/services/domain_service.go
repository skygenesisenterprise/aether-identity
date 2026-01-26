package services

import (
	"errors"
	"strings"
	"time"

	"github.com/skygenesisenterprise/aether-identity/server/src/model"
	"gorm.io/gorm"
)

// DomainService gère les opérations liées aux domaines
type DomainService struct {
	DB *gorm.DB
}

// NewDomainService crée une nouvelle instance de DomainService
func NewDomainService(db *gorm.DB) *DomainService {
	return &DomainService{DB: db}
}

// CreateDomain crée un nouveau domaine
func (s *DomainService) CreateDomain(domain *model.Domain) error {
	// Vérifier si le domaine existe déjà
	var existing model.Domain
	if err := s.DB.Where("name = ?", domain.Name).First(&existing).Error; err == nil {
		return errors.New("domain already exists")
	}

	// Si c'est un domaine interne, définir les valeurs par défaut
	if domain.IsInternal {
		domain.DisplayName = domain.Name
		domain.IsActive = true
	}

	return s.DB.Create(domain).Error
}

// GetDomainByID récupère un domaine par son ID
func (s *DomainService) GetDomainByID(id uint) (*model.Domain, error) {
	var domain model.Domain
	err := s.DB.First(&domain, id).Error
	if err != nil {
		return nil, err
	}
	return &domain, nil
}

// GetDomainByName récupère un domaine par son nom
func (s *DomainService) GetDomainByName(name string) (*model.Domain, error) {
	var domain model.Domain
	err := s.DB.Where("name = ?", name).First(&domain).Error
	if err != nil {
		return nil, err
	}
	return &domain, nil
}

// ListDomains liste tous les domaines
func (s *DomainService) ListDomains() ([]model.Domain, error) {
	var domains []model.Domain
	err := s.DB.Find(&domains).Error
	if err != nil {
		return nil, err
	}
	return domains, nil
}

// ListDomainsByOwner liste les domaines par propriétaire
func (s *DomainService) ListDomainsByOwner(ownerID uint, ownerType string) ([]model.Domain, error) {
	var domains []model.Domain
	err := s.DB.Where("owner_id = ? AND owner_type = ?", ownerID, ownerType).Find(&domains).Error
	if err != nil {
		return nil, err
	}
	return domains, nil
}

// UpdateDomain met à jour un domaine
func (s *DomainService) UpdateDomain(domain *model.Domain) error {
	return s.DB.Save(domain).Error
}

// DeleteDomain supprime un domaine
func (s *DomainService) DeleteDomain(id uint) error {
	return s.DB.Delete(&model.Domain{}, id).Error
}

// VerifyDomain vérifie un domaine
func (s *DomainService) VerifyDomain(domainID uint, method string, value string) error {
	// Créer ou mettre à jour la vérification
	token, err := GenerateRandomString(32)
	if err != nil {
		return err
	}
	
	verification := &model.DomainVerification{
		DomainID: domainID,
		Method:   method,
		Value:    value,
		Token:    token,
		IsVerified: true,
		VerifiedAt: &[]time.Time{time.Now()}[0],
	}

	return s.DB.Save(verification).Error
}

// AddUserToDomain ajoute un utilisateur à un domaine
func (s *DomainService) AddUserToDomain(domainID uint, userID uint, isAdmin bool, isOwner bool) error {
	domainUser := &model.DomainUser{
		DomainID: domainID,
		UserID:   userID,
		IsAdmin:  isAdmin,
		IsOwner:  isOwner,
	}

	return s.DB.Create(domainUser).Error
}

// RemoveUserFromDomain retire un utilisateur d'un domaine
func (s *DomainService) RemoveUserFromDomain(domainID uint, userID uint) error {
	return s.DB.Where("domain_id = ? AND user_id = ?", domainID, userID).Delete(&model.DomainUser{}).Error
}

// GetUsersByDomain récupère les utilisateurs d'un domaine
func (s *DomainService) GetUsersByDomain(domainID uint) ([]model.User, error) {
	var users []model.User
	err := s.DB.Joins("JOIN domain_users ON domain_users.user_id = users.id").
		Where("domain_users.domain_id = ?", domainID).Find(&users).Error
	if err != nil {
		return nil, err
	}
	return users, nil
}

// GetDomainsForUser récupère les domaines d'un utilisateur
func (s *DomainService) GetDomainsForUser(userID uint) ([]model.Domain, error) {
	var domains []model.Domain
	err := s.DB.Joins("JOIN domain_users ON domain_users.domain_id = domains.id").
		Where("domain_users.user_id = ?", userID).Find(&domains).Error
	if err != nil {
		return nil, err
	}
	return domains, nil
}

// IsUserDomainAdmin vérifie si un utilisateur est administrateur d'un domaine
func (s *DomainService) IsUserDomainAdmin(userID uint, domainID uint) (bool, error) {
	var count int64
	err := s.DB.Model(&model.DomainUser{}).
		Where("user_id = ? AND domain_id = ? AND is_admin = true", userID, domainID).
		Count(&count).Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

// IsUserDomainOwner vérifie si un utilisateur est propriétaire d'un domaine
func (s *DomainService) IsUserDomainOwner(userID uint, domainID uint) (bool, error) {
	var count int64
	err := s.DB.Model(&model.DomainUser{}).
		Where("user_id = ? AND domain_id = ? AND is_owner = true", userID, domainID).
		Count(&count).Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

// GetDomainUserCount récupère le nombre d'utilisateurs d'un domaine
func (s *DomainService) GetDomainUserCount(domainID uint) (int, error) {
	var count int64
	err := s.DB.Model(&model.DomainUser{}).
		Where("domain_id = ?", domainID).
		Count(&count).Error
	if err != nil {
		return 0, err
	}
	return int(count), nil
}

// CreateDomainSettings crée ou met à jour les paramètres d'un domaine
func (s *DomainService) CreateDomainSettings(settings *model.DomainSettings) error {
	return s.DB.Save(settings).Error
}

// GetDomainSettings récupère les paramètres d'un domaine
func (s *DomainService) GetDomainSettings(domainID uint) (*model.DomainSettings, error) {
	var settings model.DomainSettings
	err := s.DB.Where("domain_id = ?", domainID).First(&settings).Error
	if err != nil {
		return nil, err
	}
	return &settings, nil
}

// IsDomainActive vérifie si un domaine est actif
func (s *DomainService) IsDomainActive(domainName string) (bool, error) {
	var domain model.Domain
	err := s.DB.Where("name = ? AND is_active = true", domainName).First(&domain).Error
	if err != nil {
		return false, err
	}
	return true, nil
}

// IsEmailFromManagedDomain vérifie si une adresse email appartient à un domaine géré
func (s *DomainService) IsEmailFromManagedDomain(email string) (bool, *model.Domain, error) {
	// Extraire le domaine de l'email
	parts := strings.Split(email, "@")
	if len(parts) != 2 {
		return false, nil, nil
	}
	domainName := parts[1]

	var domain model.Domain
	err := s.DB.Where("name = ? AND is_active = true", domainName).First(&domain).Error
	if err != nil {
		return false, nil, err
	}

	return true, &domain, nil
}

// GetDomainWithDetails récupère un domaine avec ses informations détaillées
func (s *DomainService) GetDomainWithDetails(domainID uint) (*model.DomainWithDetails, error) {
	// Récupérer le domaine
	domain, err := s.GetDomainByID(domainID)
	if err != nil {
		return nil, err
	}

	// Récupérer le nombre d'utilisateurs
	userCount, err := s.GetDomainUserCount(domainID)
	if err != nil {
		return nil, err
	}

	// Récupérer la vérification
	var verification *model.DomainVerification
	s.DB.Where("domain_id = ?", domainID).First(&verification)

	// Récupérer les paramètres
	var settings *model.DomainSettings
	s.DB.Where("domain_id = ?", domainID).First(&settings)

	// Construire la réponse
	result := &model.DomainWithDetails{
		Domain:      *domain,
		UserCount:   userCount,
		IsVerified:  verification != nil && verification.IsVerified,
		Verification: verification,
		Settings:    settings,
	}

	// Récupérer le propriétaire
	if domain.OwnerID != nil {
		if domain.OwnerType == model.DomainOwnerOrganization {
			var org model.Organization
			if err := s.DB.First(&org, domain.OwnerID).Error; err == nil {
				result.Owner = org
			}
		} else if domain.OwnerType == model.DomainOwnerUser {
			var user model.User
			if err := s.DB.First(&user, domain.OwnerID).Error; err == nil {
				result.Owner = user
			}
		}
	}

	return result, nil
}

// InitializeDefaultDomains initialise les domaines par défaut (aethermail.*, skygenesisenterprise.*)
func (s *DomainService) InitializeDefaultDomains() error {
	defaultDomains := []string{
		"aethermail.com",
		"skygenesisenterprise.com",
		"aethermail.fr",
		"skygenesisenterprise.fr",
	}

	for _, domainName := range defaultDomains {
		// Vérifier si le domaine existe déjà
		var existing model.Domain
		if err := s.DB.Where("name = ?", domainName).First(&existing).Error; err == nil {
			// Le domaine existe déjà, le mettre à jour
			existing.IsInternal = true
			existing.IsActive = true
			existing.DisplayName = domainName
			if err := s.DB.Save(&existing).Error; err != nil {
				return err
			}
		} else {
			// Créer le domaine
			domain := model.Domain{
				Name:        domainName,
				DisplayName: domainName,
				IsInternal:  true,
				IsActive:    true,
			}
			if err := s.DB.Create(&domain).Error; err != nil {
				return err
			}
		}
	}

	return nil
}
