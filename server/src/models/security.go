package models

type Device struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Type      string `json:"type"`
	OS        string `json:"os,omitempty"`
	Browser   string `json:"browser,omitempty"`
	LastSeen  string `json:"last_seen,omitempty"`
	IsTrusted bool   `json:"is_trusted"`
}

type Session struct {
	ID        string `json:"id"`
	Token     string `json:"-"`
	DeviceID  string `json:"device_id,omitempty"`
	IPAddress string `json:"ip_address,omitempty"`
	UserAgent string `json:"user_agent,omitempty"`
	ExpiresAt string `json:"expires_at,omitempty"`
	CreatedAt string `json:"created_at,omitempty"`
}

type SecurityActivity struct {
	ID          string `json:"id"`
	Type        string `json:"type"`
	Title       string `json:"title"`
	Description string `json:"description,omitempty"`
	Device      string `json:"device,omitempty"`
	IPAddress   string `json:"ip_address,omitempty"`
	Time        string `json:"time,omitempty"`
}

type TwoFactorConfig struct {
	Enabled bool   `json:"enabled"`
	Method  string `json:"method,omitempty"`
}

type SecurityResponse struct {
	Success bool          `json:"success"`
	Data    *SecurityData `json:"data,omitempty"`
	Error   string        `json:"error,omitempty"`
}

type SecurityData struct {
	Devices          []Device           `json:"devices"`
	Sessions         []Session          `json:"sessions"`
	Activities       []SecurityActivity `json:"activities"`
	TwoFactor        TwoFactorConfig    `json:"two_factor"`
	PasskeyEnabled   bool               `json:"passkey_enabled"`
	SecureNavigation bool               `json:"secure_navigation"`
}

type DevicesResponse struct {
	Success bool     `json:"success"`
	Data    []Device `json:"data,omitempty"`
	Error   string   `json:"error,omitempty"`
}

type SessionsResponse struct {
	Success bool      `json:"success"`
	Data    []Session `json:"data,omitempty"`
	Error   string    `json:"error,omitempty"`
}

type ActivitiesResponse struct {
	Success bool               `json:"success"`
	Data    []SecurityActivity `json:"data,omitempty"`
	Error   string             `json:"error,omitempty"`
}

type TrustDeviceRequest struct {
	DeviceID string `json:"device_id" binding:"required"`
}

type RevokeSessionRequest struct {
	SessionID string `json:"session_id" binding:"required"`
}

type EnableTwoFactorRequest struct {
	Method string `json:"method" binding:"required"`
	Code   string `json:"code" binding:"required"`
}

type VerifyTwoFactorRequest struct {
	Code string `json:"code" binding:"required"`
}
