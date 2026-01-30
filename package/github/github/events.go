package github

import (
	"encoding/json"
	"fmt"
	"time"
)

// Event represents a normalized GitHub webhook event
type Event struct {
	Type         EventType              `json:"type"`
	Action       string                 `json:"action,omitempty"`
	DeliveryID   string                 `json:"delivery_id"`
	Installation Installation           `json:"installation,omitempty"`
	Repository   Repository             `json:"repository,omitempty"`
	Organization Organization           `json:"organization,omitempty"`
	Sender       User                   `json:"sender"`
	Payload      map[string]interface{} `json:"payload"`
	RawPayload   []byte                 `json:"-"`
	ReceivedAt   time.Time              `json:"received_at"`
}

// EventType represents the type of GitHub event
type EventType string

const (
	EventTypePush         EventType = "push"
	EventTypePullRequest  EventType = "pull_request"
	EventTypeMembership   EventType = "membership"
	EventTypeRepository   EventType = "repository"
	EventTypeInstallation EventType = "installation"
	EventTypeTeam         EventType = "team"
	EventTypeWorkflowJob  EventType = "workflow_job"
	EventTypeWorkflowRun  EventType = "workflow_run"
	EventTypeRelease      EventType = "release"
	EventTypeCreate       EventType = "create"
	EventTypeDelete       EventType = "delete"
	EventTypePing         EventType = "ping"
)

// Installation represents a GitHub App installation
type Installation struct {
	ID      int64  `json:"id"`
	Account User   `json:"account"`
	AppID   int64  `json:"app_id"`
	AppSlug string `json:"app_slug,omitempty"`
}

// Repository represents a GitHub repository
type Repository struct {
	ID            int64  `json:"id"`
	NodeID        string `json:"node_id"`
	Name          string `json:"name"`
	FullName      string `json:"full_name"`
	Owner         User   `json:"owner"`
	Private       bool   `json:"private"`
	Description   string `json:"description,omitempty"`
	HTMLURL       string `json:"html_url"`
	CloneURL      string `json:"clone_url,omitempty"`
	DefaultBranch string `json:"default_branch,omitempty"`
}

// Organization represents a GitHub organization
type Organization struct {
	ID          int64  `json:"id"`
	Login       string `json:"login"`
	NodeID      string `json:"node_id,omitempty"`
	Description string `json:"description,omitempty"`
}

// User represents a GitHub user
type User struct {
	ID        int64  `json:"id"`
	Login     string `json:"login"`
	NodeID    string `json:"node_id,omitempty"`
	Email     string `json:"email,omitempty"`
	Name      string `json:"name,omitempty"`
	Type      string `json:"type,omitempty"`
	AvatarURL string `json:"avatar_url,omitempty"`
}

// Team represents a GitHub team
type Team struct {
	ID          int64  `json:"id"`
	NodeID      string `json:"node_id"`
	Name        string `json:"name"`
	Slug        string `json:"slug"`
	Description string `json:"description,omitempty"`
	Privacy     string `json:"privacy,omitempty"`
}

// PullRequest represents a pull request (extracted from pull_request event)
type PullRequest struct {
	ID        int64  `json:"id"`
	Number    int    `json:"number"`
	Title     string `json:"title"`
	State     string `json:"state"`
	User      User   `json:"user"`
	Head      Branch `json:"head"`
	Base      Branch `json:"base"`
	Merged    bool   `json:"merged,omitempty"`
	Mergeable bool   `json:"mergeable,omitempty"`
}

// Branch represents a branch reference
type Branch struct {
	Ref  string     `json:"ref"`
	SHA  string     `json:"sha"`
	Repo Repository `json:"repo,omitempty"`
}

// PushEventPayload represents the payload of a push event
type PushEventPayload struct {
	Ref     string   `json:"ref"`
	Before  string   `json:"before"`
	After   string   `json:"after"`
	Commits []Commit `json:"commits"`
	Pusher  User     `json:"pusher"`
	Forced  bool     `json:"forced,omitempty"`
}

// Commit represents a commit in a push event
type Commit struct {
	ID        string   `json:"id"`
	Message   string   `json:"message"`
	Author    User     `json:"author"`
	Committer User     `json:"committer"`
	Added     []string `json:"added,omitempty"`
	Removed   []string `json:"removed,omitempty"`
	Modified  []string `json:"modified,omitempty"`
}

// PullRequestEventPayload represents the payload of a pull request event
type PullRequestEventPayload struct {
	Action      string      `json:"action"`
	Number      int         `json:"number"`
	PullRequest PullRequest `json:"pull_request"`
}

// MembershipEventPayload represents the payload of a membership event
type MembershipEventPayload struct {
	Action string `json:"action"`
	Scope  string `json:"scope"`
	Member User   `json:"member"`
	Team   Team   `json:"team,omitempty"`
	Sender User   `json:"sender"`
}

// RepositoryEventPayload represents the payload of a repository event
type RepositoryEventPayload struct {
	Action       string       `json:"action"`
	Repository   Repository   `json:"repository"`
	Organization Organization `json:"organization,omitempty"`
	Sender       User         `json:"sender"`
}

// InstallationEventPayload represents the payload of an installation event
type InstallationEventPayload struct {
	Action       string       `json:"action"`
	Installation Installation `json:"installation"`
	Repositories []Repository `json:"repositories,omitempty"`
	Sender       User         `json:"sender"`
}

// TeamEventPayload represents the payload of a team event
type TeamEventPayload struct {
	Action       string       `json:"action"`
	Team         Team         `json:"team"`
	Changes      Changes      `json:"changes,omitempty"`
	Organization Organization `json:"organization,omitempty"`
	Sender       User         `json:"sender"`
}

// Changes represents changes in a team event
type Changes struct {
	Description *Change `json:"description,omitempty"`
	Name        *Change `json:"name,omitempty"`
	Privacy     *Change `json:"privacy,omitempty"`
}

// Change represents a single change
type Change struct {
	From string `json:"from"`
}

// IsSensitiveAction returns true if the event represents a sensitive action that requires authorization
func (e *Event) IsSensitiveAction() bool {
	switch e.Type {
	case EventTypePush:
		return true
	case EventTypePullRequest:
		action := e.Action
		return action == "merged" || action == "closed" || action == "reopened"
	default:
		return false
	}
}

// GetRepositoryInfo extracts repository information from the event
func (e *Event) GetRepositoryInfo() (owner, repo string, err error) {
	if e.Repository.FullName == "" {
		return "", "", fmt.Errorf("no repository information in event")
	}

	// Parse owner/repo from full_name
	parts := splitRepoFullName(e.Repository.FullName)
	if len(parts) != 2 {
		return "", "", fmt.Errorf("invalid repository full name: %s", e.Repository.FullName)
	}

	return parts[0], parts[1], nil
}

// GetActor returns the actor who triggered the event
func (e *Event) GetActor() User {
	return e.Sender
}

// ToJSON serializes the event to JSON
func (e *Event) ToJSON() ([]byte, error) {
	return json.Marshal(e)
}

// splitRepoFullName splits a repository full name into owner and repo
func splitRepoFullName(fullName string) []string {
	result := make([]string, 0)
	current := ""

	for _, char := range fullName {
		if char == '/' {
			if current != "" {
				result = append(result, current)
				current = ""
			}
		} else {
			current += string(char)
		}
	}

	if current != "" {
		result = append(result, current)
	}

	return result
}
