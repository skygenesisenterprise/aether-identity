package eid

import (
	"github.com/spf13/cobra"
)

var statusCmd = &cobra.Command{
	Use:   "status",
	Short: "Show eID verification status",
	Long:  `Display the current status of eID verification and device state.`,
	Run: func(cmd *cobra.Command, args []string) {
		device, err := detectEIDDevice()
		if err != nil {
			formatter.Printf("No eID device detected\n")
			return
		}

		formatter.Printf("eID Device: %s\n", device.ID)
		formatter.Printf(" Status: Connected\n")
		formatter.Printf(" Type: %s\n", device.Type)
	},
}

func initStatusCmd(formatterProvider func(string) Formatter) {
	formatter = formatterProvider(outputFormat)
}
