package runtime

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"os/signal"
	"syscall"
	"time"
)

type Runner struct {
	TokenEnvVar string
}

func NewRunner(tokenEnvVar string) *Runner {
	if tokenEnvVar == "" {
		tokenEnvVar = "AETHER_IDENTITY_TOKEN"
	}

	return &Runner{
		TokenEnvVar: tokenEnvVar,
	}
}

func (r *Runner) Run(ctx context.Context, token string, command []string, renewRenewal time.Duration, renewFunc func() (string, error)) error {
	if len(command) == 0 {
		return fmt.Errorf("no command provided")
	}

	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	tokenChan := make(chan string, 1)
	errorChan := make(chan error, 1)

	tokenChan <- token

	if renewRenewal > 0 && renewFunc != nil {
		go r.renewToken(ctx, renewRenewal, renewFunc, tokenChan, errorChan)
	}

	cmd := exec.CommandContext(ctx, command[0], command[1:]...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin

	cmd.Env = append(os.Environ(), fmt.Sprintf("%s=%s", r.TokenEnvVar, token))

	if err := cmd.Start(); err != nil {
		return fmt.Errorf("failed to start command: %w", err)
	}

	go func() {
		if renewRenewal > 0 {
			for newToken := range tokenChan {
				cmd.Process.Signal(syscall.SIGTERM)

				cmd = exec.CommandContext(ctx, command[0], command[1:]...)
				cmd.Stdout = os.Stdout
				cmd.Stderr = os.Stderr
				cmd.Stdin = os.Stdin
				cmd.Env = append(os.Environ(), fmt.Sprintf("%s=%s", r.TokenEnvVar, newToken))

				cmd.Start()
			}
		}
	}()

	select {
	case sig := <-sigChan:
		cancel()
		fmt.Printf("\nReceived signal %v, terminating...\n", sig)
	case <-ctx.Done():
	case err := <-errorChan:
		cancel()
		return err
	}

	return cmd.Wait()
}

func (r *Runner) renewToken(ctx context.Context, interval time.Duration, renewFunc func() (string, error), tokenChan chan<- string, errorChan chan<- error) {
	ticker := time.NewTicker(interval)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			newToken, err := renewFunc()
			if err != nil {
				errorChan <- fmt.Errorf("failed to renew token: %w", err)
				return
			}
			tokenChan <- newToken
		}
	}
}
