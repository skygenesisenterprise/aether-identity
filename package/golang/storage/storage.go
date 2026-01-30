package storage

// Storage defines the interface for token and session storage
type Storage interface {
	Get(key string) (string, bool)
	Set(key string, value string)
	Delete(key string)
	Clear()
}

// MemoryStorage implements Storage using an in-memory map
type MemoryStorage struct {
	data map[string]string
}

// NewMemoryStorage creates a new MemoryStorage instance
func NewMemoryStorage() *MemoryStorage {
	return &MemoryStorage{
		data: make(map[string]string),
	}
}

// Get retrieves a value from storage
func (s *MemoryStorage) Get(key string) (string, bool) {
	val, ok := s.data[key]
	return val, ok
}

// Set stores a value in storage
func (s *MemoryStorage) Set(key string, value string) {
	s.data[key] = value
}

// Delete removes a value from storage
func (s *MemoryStorage) Delete(key string) {
	delete(s.data, key)
}

// Clear removes all values from storage
func (s *MemoryStorage) Clear() {
	s.data = make(map[string]string)
}

// FileStorage implements Storage using a file-based backend
// This is a placeholder for future secure storage implementations
type FileStorage struct {
	filepath string
	data     map[string]string
}

// NewFileStorage creates a new FileStorage instance
func NewFileStorage(filepath string) *FileStorage {
	return &FileStorage{
		filepath: filepath,
		data:     make(map[string]string),
	}
}

// Get retrieves a value from storage
func (s *FileStorage) Get(key string) (string, bool) {
	val, ok := s.data[key]
	return val, ok
}

// Set stores a value in storage
func (s *FileStorage) Set(key string, value string) {
	s.data[key] = value
}

// Delete removes a value from storage
func (s *FileStorage) Delete(key string) {
	delete(s.data, key)
}

// Clear removes all values from storage
func (s *FileStorage) Clear() {
	s.data = make(map[string]string)
}

// Storage keys used by the SDK
const (
	AccessTokenKey  = "aether_access_token"
	RefreshTokenKey = "aether_refresh_token"
	ExpiresAtKey    = "aether_expires_at"
)
