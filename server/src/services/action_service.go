package services

import (
	"github.com/skygenesisenterprise/aether-identity/server/src/models"
	"gorm.io/gorm"
)

type ActionService struct {
	DB *gorm.DB
}

func NewActionService(db *gorm.DB) *ActionService {
	return &ActionService{DB: db}
}

func (s *ActionService) CreateAction(action *models.Action) error {
	return s.DB.Create(action).Error
}

func (s *ActionService) GetAction(id string) (*models.Action, error) {
	var action models.Action
	if err := s.DB.First(&action, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &action, nil
}

func (s *ActionService) GetActionByName(name string) (*models.Action, error) {
	var action models.Action
	if err := s.DB.Where("name = ?", name).First(&action).Error; err != nil {
		return nil, err
	}
	return &action, nil
}

func (s *ActionService) ListActions() ([]models.Action, error) {
	var actions []models.Action
	if err := s.DB.Find(&actions).Error; err != nil {
		return nil, err
	}
	return actions, nil
}

func (s *ActionService) UpdateAction(action *models.Action) error {
	return s.DB.Save(action).Error
}

func (s *ActionService) DeleteAction(id string) error {
	return s.DB.Delete(&models.Action{}, "id = ?", id).Error
}

func (s *ActionService) CreateActionTrigger(trigger *models.ActionTrigger) error {
	return s.DB.Create(trigger).Error
}

func (s *ActionService) GetActionTrigger(id string) (*models.ActionTrigger, error) {
	var trigger models.ActionTrigger
	if err := s.DB.First(&trigger, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &trigger, nil
}

func (s *ActionService) GetActionTriggerByName(name string) (*models.ActionTrigger, error) {
	var trigger models.ActionTrigger
	if err := s.DB.Where("name = ?", name).First(&trigger).Error; err != nil {
		return nil, err
	}
	return &trigger, nil
}

func (s *ActionService) ListActionTriggers() ([]models.ActionTrigger, error) {
	var triggers []models.ActionTrigger
	if err := s.DB.Find(&triggers).Error; err != nil {
		return nil, err
	}
	return triggers, nil
}

func (s *ActionService) UpdateActionTrigger(trigger *models.ActionTrigger) error {
	return s.DB.Save(trigger).Error
}

func (s *ActionService) DeleteActionTrigger(id string) error {
	return s.DB.Delete(&models.ActionTrigger{}, "id = ?", id).Error
}

func (s *ActionService) CreateActionLog(log *models.ActionLog) error {
	return s.DB.Create(log).Error
}

func (s *ActionService) GetActionLog(id string) (*models.ActionLog, error) {
	var log models.ActionLog
	if err := s.DB.First(&log, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &log, nil
}

func (s *ActionService) GetActionLogsByAction(actionID string) ([]models.ActionLog, error) {
	var logs []models.ActionLog
	if err := s.DB.Where("action_id = ?", actionID).Order("created_at DESC").Find(&logs).Error; err != nil {
		return nil, err
	}
	return logs, nil
}

func (s *ActionService) UpdateActionLog(log *models.ActionLog) error {
	return s.DB.Save(log).Error
}
