package types

// Menu définit l'interface pour tous les menus
type Menu interface {
	Title() string
	Options() []Option
	Execute(option int) error
	Back() Menu
}

// Option représente une option de menu
type Option struct {
	ID          int
	Label       string
	Description string
	Action      Action
}

// Action définit l'interface pour les actions exécutables
type Action interface {
	Name() string
	Description() string
	Execute(ctx interface{}, args []string) error
	Validate(args []string) error
	RequiresAuth() bool
}

// Authenticator définit l'interface d'authentification
type Authenticator interface {
	Authenticate(username, password string) (*Session, error)
	Authorize(session *Session, action string) bool
	Logout(session *Session) error
}

// Session représente une session utilisateur
type Session struct {
	ID        string
	User      string
	TTY       string
	StartTime int64
	IsRoot    bool
	Timeout   int64
}

// SystemInfo contient les informations système
type SystemInfo struct {
	Hostname     string
	Kernel       string
	Platform     string
	Architecture string
	Uptime       string
	LoadAvg      string
	Memory       MemoryInfo
	Disk         DiskInfo
}

// MemoryInfo contient les informations mémoire
type MemoryInfo struct {
	Total     string
	Used      string
	Available string
	Percent   float64
}

// DiskInfo contient les informations disque
type DiskInfo struct {
	Total   string
	Used    string
	Free    string
	Percent float64
}

// ServiceInfo contient les informations sur un service
type ServiceInfo struct {
	Name        string
	Status      string
	Enabled     bool
	Description string
	PID         int
}

// NetworkInterface contient les informations sur une interface réseau
type NetworkInterface struct {
	Name    string
	IP      string
	Netmask string
	Gateway string
	MAC     string
	Status  string
	RxBytes uint64
	TxBytes uint64
}

// SecurityEvent représente un événement de sécurité
type SecurityEvent struct {
	Timestamp int64
	Type      string
	User      string
	Action    string
	Source    string
	Details   string
}
