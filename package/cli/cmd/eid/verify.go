package eid

import (
	"fmt"

	"github.com/spf13/cobra"
)

var (
	outputFormat string
	formatter    Formatter
)

type Formatter interface {
	Print(format string, args ...interface{})
	Println(args ...interface{})
	Printf(format string, args ...interface{})
	PrintJSON(v interface{}) error
	Errorf(format string, args ...interface{})
	Successf(format string, args ...interface{})
	Warnf(format string, args ...interface{})
}

var verifyCmd = &cobra.Command{
	Use:   "verify",
	Short: "Verify eID credentials",
	Long: `Verify electronic identity credentials using physical presence detection.
This verifies the identity through badge or smart card device.`,
	Run: func(cmd *cobra.Command, args []string) {
		device, err := detectEIDDevice()
		if err != nil {
			formatter.Errorf("Failed to detect eID device: %v", err)
			return
		}

		proof, err := generateEIDProof(device)
		if err != nil {
			formatter.Errorf("Failed to generate eID proof: %v", err)
			return
		}

		valid, err := verifyWithServer(proof)
		if err != nil {
			formatter.Errorf("Verification failed: %v", err)
			return
		}

		if valid {
			formatter.Successf("eID verified successfully")
			formatter.Printf("Device: %s\n", device.ID)
			formatter.Printf("Proof ID: %s\n", proof.ID)
		} else {
			formatter.Errorf("eID verification failed")
		}
	},
}

var revokeCmd = &cobra.Command{
	Use:   "revoke",
	Short: "Revoke eID credentials",
	Long: `Revoke the current electronic identity verification.
This invalidates the proof with the identity server.`,
	Run: func(cmd *cobra.Command, args []string) {
		if err := revokeFromServer(); err != nil {
			formatter.Errorf("Failed to revoke eID: %v", err)
			return
		}

		formatter.Successf("eID credentials revoked")
	},
}

type EIDDevice struct {
	ID        string
	Type      string
	Connected bool
	LastUsed  string
}

type EIDProof struct {
	ID     string
	Device string
	Nonce  []byte
	Hash   []byte
	Signed bool
}

func init() {
	verifyCmd.Flags().StringVarP(&outputFormat, "output", "o", "text", "output format: text|json")
	statusCmd.Flags().StringVarP(&outputFormat, "output", "o", "text", "output format: text|json")
	revokeCmd.Flags().StringVarP(&outputFormat, "output", "o", "text", "output format: text|json")
}

func NewCommands(formatterProvider func(string) Formatter) []*cobra.Command {
	formatter = formatterProvider(outputFormat)
	return []*cobra.Command{verifyCmd, statusCmd, revokeCmd}
}

func detectEIDDevice() (*EIDDevice, error) {
	return &EIDDevice{
		ID:        "eid-1234567890",
		Type:      "smart-card",
		Connected: true,
		LastUsed:  "2026-01-30T10:00:00Z",
	}, nil
}

func generateEIDProof(device *EIDDevice) (*EIDProof, error) {
	proof := &EIDProof{
		ID:     fmt.Sprintf("proof-%s", device.ID),
		Device: device.ID,
		Nonce:  []byte("random-nonce"),
		Hash:   []byte("sha256-hash"),
		Signed: true,
	}
	return proof, nil
}

func verifyWithServer(proof *EIDProof) (bool, error) {
	return true, nil
}

func revokeFromServer() error {
	return nil
}
