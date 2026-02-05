package github

import (
	"context"
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
	"fmt"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/go-github/v57/github"
	"github.com/skygenesisenterprise/aether-identity/package/github/config"
	"github.com/skygenesisenterprise/aether-identity/package/github/errors"
)

// Client provides an abstraction over the GitHub API for GitHub Apps
type Client struct {
	appID         int64
	privateKey    *rsa.PrivateKey
	client        *github.Client
	webhookSecret string
	enterpriseURL string
}

// NewClient creates a new GitHub App client
func NewClient(cfg config.GitHubConfig) (*Client, error) {
	privateKey, err := parsePrivateKey(cfg.PrivateKey)
	if err != nil {
		return nil, errors.Wrap(err, "GITHUB", "CONFIG_ERROR", "failed to parse private key")
	}

	var client *github.Client
	if cfg.EnterpriseURL != "" {
		client, err = github.NewEnterpriseClient(cfg.EnterpriseURL, cfg.EnterpriseURL, http.DefaultClient)
		if err != nil {
			return nil, errors.Wrap(err, "GITHUB", "CONFIG_ERROR", "failed to create enterprise client")
		}
	} else {
		client = github.NewClient(http.DefaultClient)
	}

	return &Client{
		appID:         cfg.AppID,
		privateKey:    privateKey,
		client:        client,
		webhookSecret: cfg.WebhookSecret,
		enterpriseURL: cfg.EnterpriseURL,
	}, nil
}

// parsePrivateKey parses a PEM-encoded RSA private key
func parsePrivateKey(key string) (*rsa.PrivateKey, error) {
	block, _ := pem.Decode([]byte(key))
	if block == nil {
		return nil, fmt.Errorf("failed to decode PEM block")
	}

	privateKey, err := x509.ParsePKCS1PrivateKey(block.Bytes)
	if err != nil {
		// Try PKCS8
		keyInterface, err := x509.ParsePKCS8PrivateKey(block.Bytes)
		if err != nil {
			return nil, fmt.Errorf("failed to parse private key: %w", err)
		}
		var ok bool
		privateKey, ok = keyInterface.(*rsa.PrivateKey)
		if !ok {
			return nil, fmt.Errorf("private key is not RSA")
		}
	}

	return privateKey, nil
}

// GenerateAppJWT generates a JWT for GitHub App authentication
func (c *Client) GenerateAppJWT() (string, error) {
	now := time.Now()
	token := jwt.NewWithClaims(jwt.SigningMethodRS256, jwt.MapClaims{
		"iat": now.Unix(),
		"exp": now.Add(10 * time.Minute).Unix(),
		"iss": c.appID,
	})

	tokenString, err := token.SignedString(c.privateKey)
	if err != nil {
		return "", errors.Wrap(err, "GITHUB", "AUTH_ERROR", "failed to sign JWT")
	}

	return tokenString, nil
}

// GetInstallationToken retrieves an installation access token
func (c *Client) GetInstallationToken(ctx context.Context, installationID int64) (string, error) {
	jwt, err := c.GenerateAppJWT()
	if err != nil {
		return "", err
	}

	client := c.client.WithAuthToken(jwt)
	token, _, err := client.Apps.CreateInstallationToken(ctx, installationID, nil)
	if err != nil {
		return "", errors.Wrap(err, "GITHUB", "API_ERROR", "failed to create installation token")
	}

	return token.GetToken(), nil
}

// GetInstallationClient returns a GitHub client authenticated for a specific installation
func (c *Client) GetInstallationClient(ctx context.Context, installationID int64) (*github.Client, error) {
	token, err := c.GetInstallationToken(ctx, installationID)
	if err != nil {
		return nil, err
	}

	return c.client.WithAuthToken(token), nil
}

// ValidateWebhookSignature validates the signature of a webhook payload
func (c *Client) ValidateWebhookSignature(payload []byte, signature string) error {
	if c.webhookSecret == "" {
		return errors.ErrInvalidWebhookSecret
	}

	// Use github library's validation
	if err := github.ValidateSignature(signature, payload, []byte(c.webhookSecret)); err != nil {
		return errors.Wrap(err, "WEBHOOK", "VALIDATION_ERROR", "invalid signature")
	}

	return nil
}

// GetApp retrieves the GitHub App details
func (c *Client) GetApp(ctx context.Context) (*github.App, error) {
	jwt, err := c.GenerateAppJWT()
	if err != nil {
		return nil, err
	}

	client := c.client.WithAuthToken(jwt)
	app, _, err := client.Apps.Get(ctx, "")
	if err != nil {
		return nil, errors.Wrap(err, "GITHUB", "API_ERROR", "failed to get app details")
	}

	return app, nil
}

// ListInstallations lists all installations for the GitHub App
func (c *Client) ListInstallations(ctx context.Context) ([]*github.Installation, error) {
	jwt, err := c.GenerateAppJWT()
	if err != nil {
		return nil, err
	}

	client := c.client.WithAuthToken(jwt)

	var allInstallations []*github.Installation
	opts := &github.ListOptions{PerPage: 100}

	for {
		installations, resp, err := client.Apps.ListInstallations(ctx, opts)
		if err != nil {
			return nil, errors.Wrap(err, "GITHUB", "API_ERROR", "failed to list installations")
		}

		allInstallations = append(allInstallations, installations...)

		if resp.NextPage == 0 {
			break
		}
		opts.Page = resp.NextPage
	}

	return allInstallations, nil
}

// GetRepository retrieves a repository by owner and name
func (c *Client) GetRepository(ctx context.Context, installationID int64, owner, repo string) (*github.Repository, error) {
	client, err := c.GetInstallationClient(ctx, installationID)
	if err != nil {
		return nil, err
	}

	repository, resp, err := client.Repositories.Get(ctx, owner, repo)
	if err != nil {
		if resp != nil && resp.StatusCode == http.StatusNotFound {
			return nil, errors.ErrRepositoryNotFound
		}
		return nil, errors.Wrap(err, "GITHUB", "API_ERROR", "failed to get repository")
	}

	return repository, nil
}

// GetUser retrieves a GitHub user by ID
func (c *Client) GetUser(ctx context.Context, userID int64) (*github.User, error) {
	jwt, err := c.GenerateAppJWT()
	if err != nil {
		return nil, err
	}

	client := c.client.WithAuthToken(jwt)
	user, resp, err := client.Users.GetByID(ctx, userID)
	if err != nil {
		if resp != nil && resp.StatusCode == http.StatusNotFound {
			return nil, errors.ErrUserNotFound
		}
		return nil, errors.Wrap(err, "GITHUB", "API_ERROR", "failed to get user")
	}

	return user, nil
}

// GetTeam retrieves a team by ID
func (c *Client) GetTeam(ctx context.Context, installationID int64, orgID int64, teamID int64) (*github.Team, error) {
	client, err := c.GetInstallationClient(ctx, installationID)
	if err != nil {
		return nil, err
	}

	team, resp, err := client.Teams.GetTeamByID(ctx, orgID, teamID)
	if err != nil {
		if resp != nil && resp.StatusCode == http.StatusNotFound {
			return nil, errors.ErrTeamNotFound
		}
		return nil, errors.Wrap(err, "GITHUB", "API_ERROR", "failed to get team")
	}

	return team, nil
}

// ListTeamMembers lists members of a team
func (c *Client) ListTeamMembers(ctx context.Context, installationID int64, orgID int64, teamID int64) ([]*github.User, error) {
	client, err := c.GetInstallationClient(ctx, installationID)
	if err != nil {
		return nil, err
	}

	var allMembers []*github.User
	opts := &github.TeamListTeamMembersOptions{ListOptions: github.ListOptions{PerPage: 100}}

	for {
		members, resp, err := client.Teams.ListTeamMembersByID(ctx, orgID, teamID, opts)
		if err != nil {
			return nil, errors.Wrap(err, "GITHUB", "API_ERROR", "failed to list team members")
		}

		allMembers = append(allMembers, members...)

		if resp.NextPage == 0 {
			break
		}
		opts.Page = resp.NextPage
	}

	return allMembers, nil
}

// ListRepositoryTeams lists teams with access to a repository
func (c *Client) ListRepositoryTeams(ctx context.Context, installationID int64, owner, repo string) ([]*github.Team, error) {
	client, err := c.GetInstallationClient(ctx, installationID)
	if err != nil {
		return nil, err
	}

	var allTeams []*github.Team
	opts := &github.ListOptions{PerPage: 100}

	for {
		teams, resp, err := client.Repositories.ListTeams(ctx, owner, repo, opts)
		if err != nil {
			return nil, errors.Wrap(err, "GITHUB", "API_ERROR", "failed to list repository teams")
		}

		allTeams = append(allTeams, teams...)

		if resp.NextPage == 0 {
			break
		}
		opts.Page = resp.NextPage
	}

	return allTeams, nil
}

// GetRateLimit gets the current rate limit status
func (c *Client) GetRateLimit(ctx context.Context) (*github.RateLimits, error) {
	jwt, err := c.GenerateAppJWT()
	if err != nil {
		return nil, err
	}

	client := c.client.WithAuthToken(jwt)
	rateLimits, _, err := client.RateLimit.Get(ctx)
	if err != nil {
		return nil, errors.Wrap(err, "GITHUB", "API_ERROR", "failed to get rate limit")
	}

	return rateLimits, nil
}
