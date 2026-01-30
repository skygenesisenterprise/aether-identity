package types

// AuthInput represents the input for authentication
type AuthInput struct {
	Email    string
	Password string
	TOTPCode string // Optional TOTP code for 2FA
}

// StrengthenInput represents the input for strengthening authentication
type StrengthenInput struct {
	Type  string // "totp", "email", or "sms"
	Value string // Optional value depending on type
}

// UserProfile represents a user's profile information
type UserProfile struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Email       string `json:"email"`
	Role        string `json:"role"`
	IsActive    bool   `json:"isActive"`
	AccountType string `json:"accountType"`
	CreatedAt   int64  `json:"createdAt"`
	UpdatedAt   int64  `json:"updatedAt"`
}

// UserRoles represents a user's roles and permissions
type UserRoles struct {
	ID          string   `json:"id"`
	Name        string   `json:"name"`
	Permissions []string `json:"permissions"`
}

// TokenResponse represents the response from token operations
type TokenResponse struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
	ExpiresIn    int    `json:"expiresIn"`
}

// SessionResponse represents the current session state
type SessionResponse struct {
	IsAuthenticated bool         `json:"isAuthenticated"`
	User            *UserProfile `json:"user,omitempty"`
	ExpiresAt       *int64       `json:"expiresAt,omitempty"`
}

// EIDVerifyInput represents the input for EID verification
type EIDVerifyInput struct {
	DocumentType   string `json:"documentType"`
	DocumentNumber string `json:"documentNumber"`
	IssuanceDate   string `json:"issuanceDate"`
	ExpirationDate string `json:"expirationDate"`
}

// EIDStatusResponse represents the EID verification status
type EIDStatusResponse struct {
	Verified     bool   `json:"verified"`
	DocumentType string `json:"documentType,omitempty"`
	VerifiedAt   *int64 `json:"verifiedAt,omitempty"`
	ExpiresAt    *int64 `json:"expiresAt,omitempty"`
}

// DeviceInfo represents information about a device
type DeviceInfo struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Type     string `json:"type"`
	LastSeen *int64 `json:"lastSeen,omitempty"`
	Trusted  bool   `json:"trusted"`
}

// DeviceStatusResponse represents the device status
type DeviceStatusResponse struct {
	Available bool        `json:"available"`
	Device    *DeviceInfo `json:"device,omitempty"`
	LastSync  *int64      `json:"lastSync,omitempty"`
}

// MachineEnrollmentResponse represents the response from machine enrollment
type MachineEnrollmentResponse struct {
	MachineID   string `json:"machineId"`
	ClientID    string `json:"clientId"`
	Secret      string `json:"secret"`
	AccessToken string `json:"accessToken,omitempty"`
}

// MachineTokenResponse represents the response from machine token request
type MachineTokenResponse struct {
	AccessToken string `json:"accessToken"`
	ExpiresIn   int    `json:"expiresIn"`
	TokenType   string `json:"tokenType"`
}
