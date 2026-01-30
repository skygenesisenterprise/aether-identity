package device

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"net"
	"os"
)

type Device struct {
	ID         string `json:"id"`
	Hostname   string `json:"hostname"`
	MACAddress string `json:"mac_address,omitempty"`
	Type       string `json:"type"`
}

type Proof struct {
	DeviceID   string `json:"device_id"`
	Timestamp  int64  `json:"timestamp"`
	Hash       string `json:"hash"`
	Signature  string `json:"signature,omitempty"`
	Identifier string `json:"identifier,omitempty"`
}

func GetDeviceProof() (*Proof, error) {
	hostname, err := getHostname()
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

	proof := &Proof{
		DeviceID:   deviceID,
		Timestamp:  0,
		Hash:       "",
		Identifier: fmt.Sprintf("%s|%s", hostname, mac),
	}

	return proof, nil
}

func getHostname() (string, error) {
	hostname, err := os.Hostname()
	if err != nil {
		return "", fmt.Errorf("failed to get hostname: %w", err)
	}
	return hostname, nil
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
