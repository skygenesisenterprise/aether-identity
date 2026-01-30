package session

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"crypto/x509"
	"encoding/hex"
	"encoding/json"
	"encoding/pem"
	"fmt"
	"net"
	"os"
	"path/filepath"
	"time"
)

type Session struct {
	ID        string    `json:"id"`
	Token     string    `json:"token,omitempty"`
	ExpiresAt time.Time `json:"expires_at,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}

type MachineIdentity struct {
	ID      string    `json:"id"`
	Public  string    `json:"public_key"`
	Private []byte    `json:"-"`
	Created time.Time `json:"created"`
}

type Manager struct {
	dataDir string
}

func NewManager() (*Manager, error) {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return nil, fmt.Errorf("failed to get home directory: %w", err)
	}

	dataDir := filepath.Join(homeDir, ".aether", "identity")
	if err := os.MkdirAll(dataDir, 0700); err != nil {
		return nil, fmt.Errorf("failed to create data directory: %w", err)
	}

	return &Manager{dataDir: dataDir}, nil
}

func (m *Manager) CreateHumanSession(token string, expiresAt time.Time) (*Session, error) {
	sessionID, err := generateSessionID()
	if err != nil {
		return nil, err
	}

	session := &Session{
		ID:        sessionID,
		Token:     token,
		ExpiresAt: expiresAt,
		CreatedAt: time.Now(),
	}

	if err := m.saveSession(session); err != nil {
		return nil, err
	}

	return session, nil
}

func (m *Manager) GetHumanSession() (*Session, error) {
	sessionPath := filepath.Join(m.dataDir, "session.json")

	data, err := os.ReadFile(sessionPath)
	if err != nil {
		if os.IsNotExist(err) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to read session: %w", err)
	}

	var session Session
	if err := json.Unmarshal(data, &session); err != nil {
		return nil, fmt.Errorf("failed to unmarshal session: %w", err)
	}

	if !session.ExpiresAt.IsZero() && time.Now().After(session.ExpiresAt) {
		m.DeleteHumanSession()
		return nil, nil
	}

	return &session, nil
}

func (m *Manager) DeleteHumanSession() error {
	sessionPath := filepath.Join(m.dataDir, "session.json")
	if err := os.Remove(sessionPath); err != nil && !os.IsNotExist(err) {
		return fmt.Errorf("failed to delete session: %w", err)
	}
	return nil
}

func (m *Manager) CreateMachineIdentity() (*MachineIdentity, error) {
	privateKey, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		return nil, fmt.Errorf("failed to generate keypair: %w", err)
	}

	publicKeyBytes, err := x509.MarshalPKIXPublicKey(&privateKey.PublicKey)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal public key: %w", err)
	}

	privateKeyBytes := x509.MarshalPKCS1PrivateKey(privateKey)

	identityID, err := generateSessionID()
	if err != nil {
		return nil, err
	}

	identity := &MachineIdentity{
		ID:      identityID,
		Public:  string(pem.EncodeToMemory(&pem.Block{Type: "PUBLIC KEY", Bytes: publicKeyBytes})),
		Private: privateKeyBytes,
		Created: time.Now(),
	}

	if err := m.saveMachineIdentity(identity); err != nil {
		return nil, err
	}

	return identity, nil
}

func (m *Manager) GetMachineIdentity() (*MachineIdentity, error) {
	identityPath := filepath.Join(m.dataDir, "machine.json")

	data, err := os.ReadFile(identityPath)
	if err != nil {
		if os.IsNotExist(err) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to read machine identity: %w", err)
	}

	var identity MachineIdentity
	if err := json.Unmarshal(data, &identity); err != nil {
		return nil, fmt.Errorf("failed to unmarshal machine identity: %w", err)
	}

	identity.Private = nil

	return &identity, nil
}

func (m *Manager) DeleteMachineIdentity() error {
	identityPath := filepath.Join(m.dataDir, "machine.json")
	privateKeyPath := filepath.Join(m.dataDir, "machine.key")

	if err := os.Remove(identityPath); err != nil && !os.IsNotExist(err) {
		return fmt.Errorf("failed to delete machine identity: %w", err)
	}

	if err := os.Remove(privateKeyPath); err != nil && !os.IsNotExist(err) {
		return fmt.Errorf("failed to delete private key: %w", err)
	}

	return nil
}

func (m *Manager) saveSession(session *Session) error {
	sessionPath := filepath.Join(m.dataDir, "session.json")
	data, err := json.MarshalIndent(session, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal session: %w", err)
	}

	if err := os.WriteFile(sessionPath, data, 0600); err != nil {
		return fmt.Errorf("failed to write session: %w", err)
	}

	return nil
}

func (m *Manager) saveMachineIdentity(identity *MachineIdentity) error {
	identityPath := filepath.Join(m.dataDir, "machine.json")

	identityCopy := *identity
	identityCopy.Private = nil

	data, err := json.MarshalIndent(&identityCopy, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal machine identity: %w", err)
	}

	if err := os.WriteFile(identityPath, data, 0600); err != nil {
		return fmt.Errorf("failed to write machine identity: %w", err)
	}

	privateKeyPath := filepath.Join(m.dataDir, "machine.key")
	privateKeyPEM := pem.EncodeToMemory(&pem.Block{
		Type:  "RSA PRIVATE KEY",
		Bytes: identity.Private,
	})

	if err := os.WriteFile(privateKeyPath, privateKeyPEM, 0600); err != nil {
		return fmt.Errorf("failed to write private key: %w", err)
	}

	return nil
}

func generateSessionID() (string, error) {
	b := make([]byte, 16)
	if _, err := rand.Read(b); err != nil {
		return "", fmt.Errorf("failed to generate session ID: %w", err)
	}
	return fmt.Sprintf("%x", b), nil
}

type DeviceProof struct {
	DeviceID   string `json:"device_id"`
	Timestamp  int64  `json:"timestamp"`
	Hash       string `json:"hash"`
	Signature  string `json:"signature,omitempty"`
	Identifier string `json:"identifier,omitempty"`
}

func GetDeviceProof() (*DeviceProof, error) {
	hostname, err := os.Hostname()
	if err != nil {
		return nil, fmt.Errorf("failed to get hostname: %w", err)
	}

	mac, err := getMACAddress()
	if err != nil {
		mac = ""
	}

	deviceID, err := generateDeviceID(hostname, mac)
	if err != nil {
		return nil, err
	}

	proof := &DeviceProof{
		DeviceID:   deviceID,
		Timestamp:  time.Now().Unix(),
		Hash:       "",
		Identifier: fmt.Sprintf("%s|%s", hostname, mac),
	}

	return proof, nil
}

func getMACAddress() (string, error) {
	interfaces, err := net.Interfaces()
	if err != nil {
		return "", fmt.Errorf("failed to get network interfaces: %w", err)
	}

	for _, iface := range interfaces {
		if iface.Flags&net.FlagUp == 0 {
			continue
		}

		if iface.Flags&net.FlagLoopback != 0 {
			continue
		}

		if len(iface.HardwareAddr) == 0 {
			continue
		}

		return iface.HardwareAddr.String(), nil
	}

	return "", fmt.Errorf("no suitable network interface found")
}

func generateDeviceID(hostname, mac string) (string, error) {
	data := fmt.Sprintf("%s|%s", hostname, mac)

	hash := sha256.New()
	hash.Write([]byte(data))

	deviceID := hex.EncodeToString(hash.Sum(nil))

	return deviceID[:16], nil
}
