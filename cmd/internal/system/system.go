package system

import (
	"os/exec"
	"runtime"
	"strings"
	"time"
)

// SystemInfo contient les informations système
type SystemInfo struct {
	Hostname     string
	Kernel       string
	Platform     string
	Architecture string
	Uptime       string
	LoadAvg      string
}

// GetInfo récupère les informations système
func GetInfo() *SystemInfo {
	return &SystemInfo{
		Hostname:     getHostname(),
		Kernel:       getKernel(),
		Platform:     runtime.GOOS,
		Architecture: runtime.GOARCH,
		Uptime:       getUptime(),
		LoadAvg:      getLoadAvg(),
	}
}

func getHostname() string {
	if hostname, err := exec.Command("hostname").Output(); err == nil {
		return strings.TrimSpace(string(hostname))
	}
	return "unknown"
}

func getKernel() string {
	if uname, err := exec.Command("uname", "-r").Output(); err == nil {
		return strings.TrimSpace(string(uname))
	}
	return "unknown"
}

func getUptime() string {
	if uptime, err := exec.Command("uptime", "-p").Output(); err == nil {
		return strings.TrimSpace(string(uptime))
	}
	return "unknown"
}

func getLoadAvg() string {
	if load, err := exec.Command("cat", "/proc/loadavg").Output(); err == nil {
		parts := strings.Fields(string(load))
		if len(parts) >= 3 {
			return parts[0] + " " + parts[1] + " " + parts[2]
		}
	}
	return "0.00 0.00 0.00"
}
