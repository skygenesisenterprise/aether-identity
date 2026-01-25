package context

import (
	"os"
	"os/user"
	"time"
)

func getCurrentUser() string {
	if u, err := user.Current(); err == nil {
		return u.Username
	}
	if user := os.Getenv("USER"); user != "" {
		return user
	}
	return "unknown"
}

func getCurrentTTY() string {
	if tty := os.Getenv("TTY"); tty != "" {
		return tty
	}
	return "console"
}

func getCurrentTime() int64 {
	return time.Now().Unix()
}

func isRoot() bool {
	if u, err := user.Current(); err == nil {
		return u.Uid == "0"
	}
	return false
}

func getPermissionLevel() string {
	if isRoot() {
		return "admin"
	}
	return "user"
}
