package docker

// Scope represents an OAuth2 scope
type Scope string

// Common OAuth2 scopes for Aether Identity
const (
	ScopeVaultRead    Scope = "vault.read"
	ScopeVaultWrite   Scope = "vault.write"
	ScopeAccountRead  Scope = "account.read"
	ScopeAccountWrite Scope = "account.write"
	ScopeQueueConsume Scope = "queue.consume"
	ScopeQueueProduce Scope = "queue.produce"
	ScopeAdmin        Scope = "admin"
)

// String returns the scope as a string
func (s Scope) String() string {
	return string(s)
}

// Role represents an RBAC role
type Role string

// Common RBAC roles for Aether Identity
const (
	RoleAdmin     Role = "admin"
	RoleOperator  Role = "operator"
	RoleViewer    Role = "viewer"
	RoleService   Role = "service"
	RoleDeveloper Role = "developer"
)

// String returns the role as a string
func (r Role) String() string {
	return string(r)
}

// NetworkMode represents Docker network modes
type NetworkMode string

const (
	// NetworkBridge is the default bridge network
	NetworkBridge NetworkMode = "bridge"

	// NetworkHost uses the host network
	NetworkHost NetworkMode = "host"

	// NetworkNone disables networking
	NetworkNone NetworkMode = "none"
)

// RestartPolicy represents Docker restart policies
type RestartPolicy string

const (
	// RestartNo never restarts
	RestartNo RestartPolicy = "no"

	// RestartAlways always restarts
	RestartAlways RestartPolicy = "always"

	// RestartOnFailure restarts on failure
	RestartOnFailure RestartPolicy = "on-failure"

	// RestartUnlessStopped restarts unless manually stopped
	RestartUnlessStopped RestartPolicy = "unless-stopped"
)
