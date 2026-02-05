package github

import (
	"encoding/json"
	"fmt"

	"github.com/google/go-github/v57/github"
)

// EventParser handles parsing of GitHub webhook events
type EventParser struct{}

// NewEventParser creates a new event parser
func NewEventParser() *EventParser {
	return &EventParser{}
}

// ParseEvent parses a raw GitHub webhook payload into a normalized Event
func (p *EventParser) ParseEvent(eventType string, payload []byte) (*Event, error) {
	event := &Event{
		Type:       EventType(eventType),
		RawPayload: payload,
	}

	switch eventType {
	case "push":
		return p.parsePushEvent(event, payload)
	case "pull_request":
		return p.parsePullRequestEvent(event, payload)
	case "membership":
		return p.parseMembershipEvent(event, payload)
	case "repository":
		return p.parseRepositoryEvent(event, payload)
	case "installation":
		return p.parseInstallationEvent(event, payload)
	case "installation_repositories":
		return p.parseInstallationRepositoriesEvent(event, payload)
	case "team":
		return p.parseTeamEvent(event, payload)
	case "team_add":
		return p.parseTeamAddEvent(event, payload)
	case "ping":
		return p.parsePingEvent(event, payload)
	default:
		// For unknown events, just parse the basic structure
		return p.parseGenericEvent(event, payload)
	}
}

func (p *EventParser) parsePushEvent(event *Event, payload []byte) (*Event, error) {
	var ghEvent github.PushEvent
	if err := json.Unmarshal(payload, &ghEvent); err != nil {
		return nil, fmt.Errorf("failed to parse push event: %w", err)
	}

	event.Action = "push"

	if ghEvent.Repo != nil {
		event.Repository = Repository{
			ID:          ghEvent.Repo.GetID(),
			Name:        ghEvent.Repo.GetName(),
			FullName:    ghEvent.Repo.GetFullName(),
			Private:     ghEvent.Repo.GetPrivate(),
			Description: ghEvent.Repo.GetDescription(),
		}
	}

	if ghEvent.Pusher != nil {
		event.Sender = User{
			Login: ghEvent.Pusher.GetLogin(),
			Name:  ghEvent.Pusher.GetName(),
			Email: ghEvent.Pusher.GetEmail(),
		}
	}

	if ghEvent.Organization != nil {
		event.Organization = Organization{
			ID:    ghEvent.Organization.GetID(),
			Login: ghEvent.Organization.GetLogin(),
		}
	}

	// Store raw payload for detailed processing
	var rawPayload map[string]interface{}
	if err := json.Unmarshal(payload, &rawPayload); err == nil {
		event.Payload = rawPayload
	}

	return event, nil
}

func (p *EventParser) parsePullRequestEvent(event *Event, payload []byte) (*Event, error) {
	var ghEvent github.PullRequestEvent
	if err := json.Unmarshal(payload, &ghEvent); err != nil {
		return nil, fmt.Errorf("failed to parse pull request event: %w", err)
	}

	event.Action = ghEvent.GetAction()

	if ghEvent.Repo != nil {
		event.Repository = p.convertRepository(ghEvent.Repo)
	}

	if ghEvent.Sender != nil {
		event.Sender = p.convertUser(ghEvent.Sender)
	}

	if ghEvent.Organization != nil {
		event.Organization = p.convertOrganization(ghEvent.Organization)
	}

	if ghEvent.Installation != nil {
		event.Installation = p.convertInstallation(ghEvent.Installation)
	}

	// Store the pull request data
	if ghEvent.PullRequest != nil {
		pr := PullRequest{
			ID:     ghEvent.PullRequest.GetID(),
			Number: ghEvent.PullRequest.GetNumber(),
			Title:  ghEvent.PullRequest.GetTitle(),
			State:  ghEvent.PullRequest.GetState(),
		}
		if ghEvent.PullRequest.User != nil {
			pr.User = p.convertUser(ghEvent.PullRequest.User)
		}

		var rawPayload map[string]interface{}
		if err := json.Unmarshal(payload, &rawPayload); err == nil {
			event.Payload = rawPayload
			event.Payload["normalized_pull_request"] = pr
		}
	}

	return event, nil
}

func (p *EventParser) parseMembershipEvent(event *Event, payload []byte) (*Event, error) {
	var ghEvent github.MembershipEvent
	if err := json.Unmarshal(payload, &ghEvent); err != nil {
		return nil, fmt.Errorf("failed to parse membership event: %w", err)
	}

	event.Action = ghEvent.GetAction()

	if ghEvent.Sender != nil {
		event.Sender = p.convertUser(ghEvent.Sender)
	}

	if ghEvent.Org != nil {
		event.Organization = p.convertOrganization(ghEvent.Org)
	}

	// Store membership details
	var rawPayload map[string]interface{}
	if err := json.Unmarshal(payload, &rawPayload); err == nil {
		event.Payload = rawPayload
	}

	return event, nil
}

func (p *EventParser) parseRepositoryEvent(event *Event, payload []byte) (*Event, error) {
	var ghEvent github.RepositoryEvent
	if err := json.Unmarshal(payload, &ghEvent); err != nil {
		return nil, fmt.Errorf("failed to parse repository event: %w", err)
	}

	event.Action = ghEvent.GetAction()

	if ghEvent.Repo != nil {
		event.Repository = p.convertRepository(ghEvent.Repo)
	}

	if ghEvent.Sender != nil {
		event.Sender = p.convertUser(ghEvent.Sender)
	}

	if ghEvent.Org != nil {
		event.Organization = p.convertOrganization(ghEvent.Org)
	}

	var rawPayload map[string]interface{}
	if err := json.Unmarshal(payload, &rawPayload); err == nil {
		event.Payload = rawPayload
	}

	return event, nil
}

func (p *EventParser) parseInstallationEvent(event *Event, payload []byte) (*Event, error) {
	var ghEvent github.InstallationEvent
	if err := json.Unmarshal(payload, &ghEvent); err != nil {
		return nil, fmt.Errorf("failed to parse installation event: %w", err)
	}

	event.Action = ghEvent.GetAction()

	if ghEvent.Installation != nil {
		event.Installation = p.convertInstallation(ghEvent.Installation)
	}

	if ghEvent.Sender != nil {
		event.Sender = p.convertUser(ghEvent.Sender)
	}

	var rawPayload map[string]interface{}
	if err := json.Unmarshal(payload, &rawPayload); err == nil {
		event.Payload = rawPayload
	}

	return event, nil
}

func (p *EventParser) parseInstallationRepositoriesEvent(event *Event, payload []byte) (*Event, error) {
	var ghEvent github.InstallationRepositoriesEvent
	if err := json.Unmarshal(payload, &ghEvent); err != nil {
		return nil, fmt.Errorf("failed to parse installation repositories event: %w", err)
	}

	event.Action = ghEvent.GetAction()

	if ghEvent.Installation != nil {
		event.Installation = p.convertInstallation(ghEvent.Installation)
	}

	if ghEvent.Sender != nil {
		event.Sender = p.convertUser(ghEvent.Sender)
	}

	var rawPayload map[string]interface{}
	if err := json.Unmarshal(payload, &rawPayload); err == nil {
		event.Payload = rawPayload
	}

	return event, nil
}

func (p *EventParser) parseTeamEvent(event *Event, payload []byte) (*Event, error) {
	var ghEvent github.TeamEvent
	if err := json.Unmarshal(payload, &ghEvent); err != nil {
		return nil, fmt.Errorf("failed to parse team event: %w", err)
	}

	event.Action = ghEvent.GetAction()

	if ghEvent.Sender != nil {
		event.Sender = p.convertUser(ghEvent.Sender)
	}

	if ghEvent.Org != nil {
		event.Organization = p.convertOrganization(ghEvent.Org)
	}

	var rawPayload map[string]interface{}
	if err := json.Unmarshal(payload, &rawPayload); err == nil {
		event.Payload = rawPayload
	}

	return event, nil
}

func (p *EventParser) parseTeamAddEvent(event *Event, payload []byte) (*Event, error) {
	var ghEvent github.TeamAddEvent
	if err := json.Unmarshal(payload, &ghEvent); err != nil {
		return nil, fmt.Errorf("failed to parse team add event: %w", err)
	}

	event.Action = "added"

	if ghEvent.Sender != nil {
		event.Sender = p.convertUser(ghEvent.Sender)
	}

	if ghEvent.Org != nil {
		event.Organization = p.convertOrganization(ghEvent.Org)
	}

	var rawPayload map[string]interface{}
	if err := json.Unmarshal(payload, &rawPayload); err == nil {
		event.Payload = rawPayload
	}

	return event, nil
}

func (p *EventParser) parsePingEvent(event *Event, payload []byte) (*Event, error) {
	event.Action = "ping"

	var rawPayload map[string]interface{}
	if err := json.Unmarshal(payload, &rawPayload); err == nil {
		event.Payload = rawPayload
	}

	return event, nil
}

func (p *EventParser) parseGenericEvent(event *Event, payload []byte) (*Event, error) {
	var rawPayload map[string]interface{}
	if err := json.Unmarshal(payload, &rawPayload); err != nil {
		return nil, fmt.Errorf("failed to parse event payload: %w", err)
	}

	event.Payload = rawPayload

	// Try to extract common fields
	if sender, ok := rawPayload["sender"].(map[string]interface{}); ok {
		if login, ok := sender["login"].(string); ok {
			event.Sender.Login = login
		}
		if id, ok := sender["id"].(float64); ok {
			event.Sender.ID = int64(id)
		}
	}

	if repo, ok := rawPayload["repository"].(map[string]interface{}); ok {
		if name, ok := repo["name"].(string); ok {
			event.Repository.Name = name
		}
		if fullName, ok := repo["full_name"].(string); ok {
			event.Repository.FullName = fullName
		}
		if id, ok := repo["id"].(float64); ok {
			event.Repository.ID = int64(id)
		}
	}

	return event, nil
}

// Helper conversion functions
func (p *EventParser) convertRepository(repo *github.Repository) Repository {
	r := Repository{
		ID:            repo.GetID(),
		NodeID:        repo.GetNodeID(),
		Name:          repo.GetName(),
		FullName:      repo.GetFullName(),
		Private:       repo.GetPrivate(),
		Description:   repo.GetDescription(),
		HTMLURL:       repo.GetHTMLURL(),
		CloneURL:      repo.GetCloneURL(),
		DefaultBranch: repo.GetDefaultBranch(),
	}

	if repo.Owner != nil {
		r.Owner = p.convertUser(repo.Owner)
	}

	return r
}

func (p *EventParser) convertUser(user *github.User) User {
	return User{
		ID:        user.GetID(),
		Login:     user.GetLogin(),
		NodeID:    user.GetNodeID(),
		Email:     user.GetEmail(),
		Name:      user.GetName(),
		Type:      user.GetType(),
		AvatarURL: user.GetAvatarURL(),
	}
}

func (p *EventParser) convertOrganization(org *github.Organization) Organization {
	return Organization{
		ID:          org.GetID(),
		Login:       org.GetLogin(),
		NodeID:      org.GetNodeID(),
		Description: org.GetDescription(),
	}
}

func (p *EventParser) convertInstallation(inst *github.Installation) Installation {
	i := Installation{
		ID:      inst.GetID(),
		AppID:   inst.GetAppID(),
		AppSlug: inst.GetAppSlug(),
	}

	if inst.Account != nil {
		i.Account = p.convertUser(inst.Account)
	}

	return i
}

func (p *EventParser) convertTeam(team *github.Team) Team {
	return Team{
		ID:          team.GetID(),
		NodeID:      team.GetNodeID(),
		Name:        team.GetName(),
		Slug:        team.GetSlug(),
		Description: team.GetDescription(),
		Privacy:     team.GetPrivacy(),
	}
}
