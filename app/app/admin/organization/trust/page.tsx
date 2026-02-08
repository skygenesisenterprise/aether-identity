"use client";

import { useState } from "react";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Globe,
  Building2,
  ArrowRight,
  ArrowLeft,
  ArrowLeftRight,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  X,
  Network,
  Lock,
  Eye,
  Activity,
  AlertOctagon,
  RefreshCw,
  Trash2,
  Edit3,
  PauseCircle,
  PlayCircle,
  Map,
  Fingerprint,
  Server,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type TrustDirection = "inbound" | "outbound" | "bidirectional";
type TrustStatus = "active" | "suspended" | "expired" | "pending";
type TrustLevel = "full" | "limited" | "conditional" | "temporary";
type TrustScope = "organization" | "environment" | "resource";
type EntityType =
  | "organization"
  | "identity_provider"
  | "service"
  | "environment";
type Protocol = "oidc" | "saml" | "api_key" | "mtls" | "oauth2" | "custom";

interface TrustCondition {
  id: string;
  type: "issuer" | "environment" | "network" | "region" | "protocol";
  operator: "equals" | "not_equals" | "contains" | "in_range" | "matches";
  value: string | string[];
  required: boolean;
  attribute?: string;
}

interface TrustEntity {
  id: string;
  name: string;
  type: EntityType;
  identifier: string;
  description?: string;
  metadata?: {
    domain?: string;
    region?: string;
    provider?: string;
    verificationStatus?: "verified" | "pending" | "failed";
  };
}

interface TrustRelationship {
  id: string;
  name: string;
  description: string;
  direction: TrustDirection;
  status: TrustStatus;
  level: TrustLevel;
  scope: TrustScope;
  trustedEntity: TrustEntity;
  environments: string[];
  conditions: TrustCondition[];
  protocols: Protocol[];
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastVerifiedAt?: string;
  riskScore: number;
  blastRadius: "low" | "medium" | "high" | "critical";
  dependencies: string[];
  usageStats: {
    totalAuthentications: number;
    last24h: number;
    failedAttempts: number;
  };
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockTrustRelationships: TrustRelationship[] = [
  {
    id: "trust-001",
    name: "PartnerCorp Federation",
    description:
      "Full federation trust with PartnerCorp for cross-organizational collaboration",
    direction: "bidirectional",
    status: "active",
    level: "full",
    scope: "organization",
    trustedEntity: {
      id: "ent-001",
      name: "PartnerCorp Inc",
      type: "organization",
      identifier: "partnercorp.com",
      description: "Strategic partner organization",
      metadata: {
        domain: "partnercorp.com",
        region: "us-west",
        verificationStatus: "verified",
      },
    },
    environments: ["production", "staging"],
    conditions: [
      {
        id: "cond-001",
        type: "issuer",
        operator: "equals",
        value: "https://auth.partnercorp.com",
        required: true,
      },
      {
        id: "cond-002",
        type: "protocol",
        operator: "equals",
        value: "oidc",
        required: true,
      },
    ],
    protocols: ["oidc", "saml"],
    expiresAt: "2025-12-31T23:59:59Z",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-06-20T10:30:00Z",
    createdBy: "System Administrator",
    lastVerifiedAt: "2024-06-20T10:30:00Z",
    riskScore: 25,
    blastRadius: "medium",
    dependencies: ["trust-003"],
    usageStats: {
      totalAuthentications: 15420,
      last24h: 142,
      failedAttempts: 23,
    },
  },
  {
    id: "trust-002",
    name: "External Contractor Access",
    description: "Limited trust for external development contractors",
    direction: "inbound",
    status: "active",
    level: "limited",
    scope: "environment",
    trustedEntity: {
      id: "ent-002",
      name: "DevContractors Ltd",
      type: "organization",
      identifier: "devcontractors.io",
      description: "External development team",
      metadata: {
        domain: "devcontractors.io",
        region: "eu-west",
        verificationStatus: "verified",
      },
    },
    environments: ["development"],
    conditions: [
      {
        id: "cond-003",
        type: "network",
        operator: "in_range",
        value: "192.168.100.0/24",
        required: true,
      },
      {
        id: "cond-004",
        type: "environment",
        operator: "equals",
        value: "development",
        required: true,
      },
    ],
    protocols: ["oidc"],
    expiresAt: "2024-08-15T00:00:00Z",
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-05-10T14:22:00Z",
    createdBy: "Security Team",
    lastVerifiedAt: "2024-06-19T08:15:00Z",
    riskScore: 45,
    blastRadius: "low",
    dependencies: [],
    usageStats: {
      totalAuthentications: 892,
      last24h: 12,
      failedAttempts: 5,
    },
  },
  {
    id: "trust-003",
    name: "Azure AD Enterprise Connection",
    description: "Enterprise identity provider for SSO",
    direction: "inbound",
    status: "active",
    level: "full",
    scope: "organization",
    trustedEntity: {
      id: "ent-003",
      name: "Azure Active Directory",
      type: "identity_provider",
      identifier: "acme-corp.onmicrosoft.com",
      description: "Primary enterprise IdP",
      metadata: {
        provider: "Microsoft Azure AD",
        region: "global",
        verificationStatus: "verified",
      },
    },
    environments: ["production", "staging", "development"],
    conditions: [
      {
        id: "cond-005",
        type: "issuer",
        operator: "equals",
        value: "https://login.microsoftonline.com/{tenant-id}/v2.0",
        required: true,
      },
      {
        id: "cond-006",
        type: "protocol",
        operator: "equals",
        value: "oidc",
        required: true,
      },
    ],
    protocols: ["oidc", "saml"],
    createdAt: "2023-06-01T00:00:00Z",
    updatedAt: "2024-01-10T09:15:00Z",
    createdBy: "Platform Team",
    lastVerifiedAt: "2024-06-20T12:00:00Z",
    riskScore: 15,
    blastRadius: "critical",
    dependencies: [],
    usageStats: {
      totalAuthentications: 245678,
      last24h: 3245,
      failedAttempts: 89,
    },
  },
  {
    id: "trust-004",
    name: "Staging Environment Internal",
    description: "Internal trust for staging environment services",
    direction: "bidirectional",
    status: "active",
    level: "conditional",
    scope: "environment",
    trustedEntity: {
      id: "ent-004",
      name: "Staging Cluster",
      type: "environment",
      identifier: "staging.internal",
      description: "Internal staging environment",
      metadata: {
        region: "us-east",
        verificationStatus: "verified",
      },
    },
    environments: ["staging"],
    conditions: [
      {
        id: "cond-007",
        type: "network",
        operator: "in_range",
        value: "10.0.0.0/8",
        required: true,
      },
      {
        id: "cond-008",
        type: "protocol",
        operator: "equals",
        value: "mtls",
        required: true,
      },
    ],
    protocols: ["mtls", "api_key"],
    createdAt: "2023-08-20T00:00:00Z",
    updatedAt: "2024-03-15T16:45:00Z",
    createdBy: "DevOps Team",
    lastVerifiedAt: "2024-06-20T06:30:00Z",
    riskScore: 20,
    blastRadius: "low",
    dependencies: [],
    usageStats: {
      totalAuthentications: 45678,
      last24h: 892,
      failedAttempts: 12,
    },
  },
  {
    id: "trust-005",
    name: "Temporary Audit Access",
    description: "Temporary trust for external auditors",
    direction: "inbound",
    status: "suspended",
    level: "temporary",
    scope: "resource",
    trustedEntity: {
      id: "ent-005",
      name: "Audit Firm LLC",
      type: "organization",
      identifier: "auditfirm.com",
      description: "External auditors",
      metadata: {
        domain: "auditfirm.com",
        verificationStatus: "verified",
      },
    },
    environments: ["production"],
    conditions: [
      {
        id: "cond-009",
        type: "network",
        operator: "in_range",
        value: "203.0.113.0/24",
        required: true,
      },
    ],
    protocols: ["saml"],
    expiresAt: "2024-03-31T00:00:00Z",
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-03-31T00:00:01Z",
    createdBy: "Compliance Team",
    lastVerifiedAt: "2024-03-15T10:00:00Z",
    riskScore: 60,
    blastRadius: "medium",
    dependencies: [],
    usageStats: {
      totalAuthentications: 156,
      last24h: 0,
      failedAttempts: 3,
    },
  },
  {
    id: "trust-006",
    name: "Third-Party Service Integration",
    description: "Trust for payment processing service",
    direction: "outbound",
    status: "active",
    level: "conditional",
    scope: "resource",
    trustedEntity: {
      id: "ent-006",
      name: "PaymentGateway API",
      type: "service",
      identifier: "api.paymentgateway.com",
      description: "External payment processing service",
      metadata: {
        provider: "Stripe",
        region: "global",
        verificationStatus: "verified",
      },
    },
    environments: ["production"],
    conditions: [
      {
        id: "cond-010",
        type: "protocol",
        operator: "equals",
        value: "api_key",
        required: true,
      },
      {
        id: "cond-011",
        type: "network",
        operator: "matches",
        value: "*.paymentgateway.com",
        required: true,
      },
    ],
    protocols: ["api_key", "mtls"],
    createdAt: "2023-09-10T00:00:00Z",
    updatedAt: "2024-02-28T11:30:00Z",
    createdBy: "Engineering Team",
    lastVerifiedAt: "2024-06-19T22:00:00Z",
    riskScore: 35,
    blastRadius: "high",
    dependencies: [],
    usageStats: {
      totalAuthentications: 89342,
      last24h: 2341,
      failedAttempts: 45,
    },
  },
];

// ============================================================================
// CONFIGURATION
// ============================================================================

const directionConfig = {
  inbound: {
    icon: ArrowRight,
    label: "Inbound",
    description: "External entities trust us",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  outbound: {
    icon: ArrowLeft,
    label: "Outbound",
    description: "We trust external entities",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  bidirectional: {
    icon: ArrowLeftRight,
    label: "Bidirectional",
    description: "Mutual trust relationship",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
};

const statusConfig = {
  active: {
    icon: CheckCircle2,
    label: "Active",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  suspended: {
    icon: PauseCircle,
    label: "Suspended",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  expired: {
    icon: XCircle,
    label: "Expired",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  pending: {
    icon: Clock,
    label: "Pending",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
};

const levelConfig = {
  full: {
    icon: ShieldCheck,
    label: "Full Trust",
    description: "Complete trust with minimal restrictions",
    color: "text-emerald-500",
  },
  limited: {
    icon: Shield,
    label: "Limited Trust",
    description: "Restricted to specific contexts",
    color: "text-blue-500",
  },
  conditional: {
    icon: ShieldAlert,
    label: "Conditional",
    description: "Trust requires specific conditions",
    color: "text-amber-500",
  },
  temporary: {
    icon: Clock,
    label: "Temporary",
    description: "Time-bound trust relationship",
    color: "text-purple-500",
  },
};

const entityTypeConfig = {
  organization: { icon: Building2, label: "Organization" },
  identity_provider: { icon: Fingerprint, label: "Identity Provider" },
  service: { icon: Server, label: "Service" },
  environment: { icon: Globe, label: "Environment" },
};

const protocolConfig = {
  oidc: { label: "OpenID Connect", color: "bg-blue-100 text-blue-700" },
  saml: { label: "SAML 2.0", color: "bg-purple-100 text-purple-700" },
  api_key: { label: "API Key", color: "bg-amber-100 text-amber-700" },
  mtls: { label: "mTLS", color: "bg-emerald-100 text-emerald-700" },
  oauth2: { label: "OAuth 2.0", color: "bg-indigo-100 text-indigo-700" },
  custom: { label: "Custom", color: "bg-slate-100 text-slate-700" },
};

const blastRadiusConfig = {
  low: {
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    label: "Low",
  },
  medium: {
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    label: "Medium",
  },
  high: {
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    label: "High",
  },
  critical: {
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    label: "Critical",
  },
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function DirectionBadge({ direction }: { direction: TrustDirection }) {
  const config = directionConfig[direction];
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
        config.bgColor,
        config.color,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

function StatusBadge({ status }: { status: TrustStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
        config.bgColor,
        config.color,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

function LevelBadge({ level }: { level: TrustLevel }) {
  const config = levelConfig[level];
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-muted",
        config.color,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

function BlastRadiusBadge({
  level,
}: {
  level: TrustRelationship["blastRadius"];
}) {
  const config = blastRadiusConfig[level];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
        config.bgColor,
        config.color,
      )}
    >
      {config.label} Impact
    </span>
  );
}

function EntityTypeBadge({ type }: { type: EntityType }) {
  const config = entityTypeConfig[type];
  const Icon = config.icon;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

function ProtocolBadge({ protocol }: { protocol: Protocol }) {
  const config = protocolConfig[protocol];
  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded text-[10px] font-medium",
        config.color,
      )}
    >
      {config.label}
    </span>
  );
}

function RiskScoreIndicator({ score }: { score: number }) {
  let color = "text-emerald-500";
  let bgColor = "bg-emerald-500/10";
  if (score > 30) {
    color = "text-amber-500";
    bgColor = "bg-amber-500/10";
  }
  if (score > 60) {
    color = "text-red-500";
    bgColor = "bg-red-500/10";
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full", bgColor.replace("/10", ""))}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={cn("text-xs font-medium w-8 text-right", color)}>
        {score}
      </span>
    </div>
  );
}

function EnvironmentBadges({ environments }: { environments: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {environments.map((env) => (
        <span
          key={env}
          className={cn(
            "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium uppercase",
            env === "production"
              ? "bg-red-500/10 text-red-500"
              : env === "staging"
                ? "bg-amber-500/10 text-amber-500"
                : "bg-blue-500/10 text-blue-500",
          )}
        >
          {env}
        </span>
      ))}
    </div>
  );
}

function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays < 1) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toISOString().split("T")[0];
}

// ============================================================================
// MAIN COMPONENTS
// ============================================================================

function TrustHeader({
  onCreateTrust,
  onViewGraph,
}: {
  onCreateTrust: () => void;
  onViewGraph: () => void;
}) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-card-foreground">Trust</h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          Define trust relationships between organizations. Trust determines{" "}
          <strong>
            who we trust, under which conditions, and for what purposes
          </strong>
          . Trust is a prerequisite for authorization, not permission itself.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onViewGraph}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors"
        >
          <Network className="h-4 w-4" />
          Trust Graph
        </button>
        <button
          onClick={onCreateTrust}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Trust
        </button>
      </div>
    </div>
  );
}

function TrustStats({ relationships }: { relationships: TrustRelationship[] }) {
  const stats = {
    total: relationships.length,
    active: relationships.filter((r) => r.status === "active").length,
    inbound: relationships.filter(
      (r) => r.direction === "inbound" || r.direction === "bidirectional",
    ).length,
    outbound: relationships.filter(
      (r) => r.direction === "outbound" || r.direction === "bidirectional",
    ).length,
    highRisk: relationships.filter((r) => r.riskScore > 50).length,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div className="p-4 rounded-lg border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-semibold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total Trusts</p>
          </div>
          <Shield className="h-8 w-8 text-muted-foreground/50" />
        </div>
      </div>
      <div className="p-4 rounded-lg border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-semibold text-emerald-600">
              {stats.active}
            </p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
          <CheckCircle2 className="h-8 w-8 text-emerald-500/50" />
        </div>
      </div>
      <div className="p-4 rounded-lg border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-semibold text-blue-600">
              {stats.inbound}
            </p>
            <p className="text-xs text-muted-foreground">Inbound</p>
          </div>
          <ArrowRight className="h-8 w-8 text-blue-500/50" />
        </div>
      </div>
      <div className="p-4 rounded-lg border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-semibold text-amber-600">
              {stats.outbound}
            </p>
            <p className="text-xs text-muted-foreground">Outbound</p>
          </div>
          <ArrowLeft className="h-8 w-8 text-amber-500/50" />
        </div>
      </div>
      <div className="p-4 rounded-lg border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-semibold text-red-600">
              {stats.highRisk}
            </p>
            <p className="text-xs text-muted-foreground">High Risk</p>
          </div>
          <AlertTriangle className="h-8 w-8 text-red-500/50" />
        </div>
      </div>
    </div>
  );
}

function TrustFilterBar({
  searchQuery,
  onSearchChange,
  directionFilter,
  onDirectionFilterChange,
  statusFilter,
  onStatusFilterChange,
}: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  directionFilter: TrustDirection | "all";
  onDirectionFilterChange: (direction: TrustDirection | "all") => void;
  statusFilter: TrustStatus | "all";
  onStatusFilterChange: (status: TrustStatus | "all") => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="relative flex-1 max-w-md w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search trusts by name, entity, or identifier..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="flex items-center gap-2">
        <select
          value={directionFilter}
          onChange={(e) =>
            onDirectionFilterChange(e.target.value as TrustDirection | "all")
          }
          className="px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Directions</option>
          <option value="inbound">Inbound</option>
          <option value="outbound">Outbound</option>
          <option value="bidirectional">Bidirectional</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) =>
            onStatusFilterChange(e.target.value as TrustStatus | "all")
          }
          className="px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="expired">Expired</option>
          <option value="pending">Pending</option>
        </select>
        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
          <Filter className="h-4 w-4" />
          More Filters
        </button>
      </div>
    </div>
  );
}

function TrustTable({
  relationships,
  selectedTrust,
  onSelectTrust,
}: {
  relationships: TrustRelationship[];
  selectedTrust: TrustRelationship | null;
  onSelectTrust: (trust: TrustRelationship | null) => void;
}) {
  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="border-b">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Trust Relationship
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Entity
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Direction
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Level
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Risk
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Environments
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground w-10">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {relationships.map((trust) => (
              <tr
                key={trust.id}
                className={cn(
                  "transition-colors cursor-pointer hover:bg-muted/50",
                  selectedTrust?.id === trust.id && "bg-muted",
                  trust.status !== "active" && "opacity-60",
                )}
                onClick={() => onSelectTrust(trust)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center",
                        trust.level === "full"
                          ? "bg-emerald-500/10"
                          : trust.level === "limited"
                            ? "bg-blue-500/10"
                            : trust.level === "conditional"
                              ? "bg-amber-500/10"
                              : "bg-purple-500/10",
                      )}
                    >
                      {trust.level === "full" ? (
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      ) : trust.level === "limited" ? (
                        <Shield className="h-4 w-4 text-blue-600" />
                      ) : trust.level === "conditional" ? (
                        <ShieldAlert className="h-4 w-4 text-amber-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {trust.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {trust.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">
                      {trust.trustedEntity.name}
                    </p>
                    <EntityTypeBadge type={trust.trustedEntity.type} />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <DirectionBadge direction={trust.direction} />
                </td>
                <td className="px-4 py-3">
                  <LevelBadge level={trust.level} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={trust.status} />
                </td>
                <td className="px-4 py-3">
                  <RiskScoreIndicator score={trust.riskScore} />
                </td>
                <td className="px-4 py-3">
                  <EnvironmentBadges environments={trust.environments} />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 hover:bg-muted rounded transition-colors"
                  >
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {relationships.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Shield className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">
            No trust relationships found
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Try adjusting your filters or create a new trust relationship to get
            started.
          </p>
        </div>
      )}
    </div>
  );
}

function TrustVisualization({
  relationships,
}: {
  relationships: TrustRelationship[];
}) {
  // Simple visualization showing trust map
  return (
    <div className="border rounded-lg bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Map className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium text-sm">Trust Map Visualization</h3>
        </div>
        <span className="text-xs text-muted-foreground">Read-only view</span>
      </div>

      <div className="relative h-64 bg-muted/30 rounded-lg overflow-hidden">
        {/* Central organization */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary flex flex-col items-center justify-center">
            <Building2 className="h-8 w-8 text-primary mb-1" />
            <span className="text-xs font-medium text-primary">Your Org</span>
          </div>
        </div>

        {/* Trusted entities positioned around center */}
        {relationships.slice(0, 5).map((trust, index) => {
          const angle =
            (index / Math.min(relationships.length, 5)) * 2 * Math.PI -
            Math.PI / 2;
          const radius = 100;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <div
              key={trust.id}
              className="absolute top-1/2 left-1/2"
              style={{
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              }}
            >
              <div
                className={cn(
                  "w-16 h-16 rounded-full border-2 flex flex-col items-center justify-center",
                  trust.status === "active"
                    ? "bg-emerald-500/10 border-emerald-500"
                    : trust.status === "suspended"
                      ? "bg-amber-500/10 border-amber-500"
                      : "bg-red-500/10 border-red-500",
                )}
              >
                {trust.direction === "inbound" ? (
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                ) : trust.direction === "outbound" ? (
                  <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-[10px] font-medium mt-0.5 truncate max-w-14 px-1">
                  {trust.trustedEntity.name.slice(0, 8)}...
                </span>
              </div>
            </div>
          );
        })}

        {relationships.length > 5 && (
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
            +{relationships.length - 5} more
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500" />
          <span>Active</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500" />
          <span>Suspended</span>
        </div>
        <div className="flex items-center gap-1">
          <ArrowRight className="h-3 w-3" />
          <span>Inbound</span>
        </div>
        <div className="flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" />
          <span>Outbound</span>
        </div>
      </div>
    </div>
  );
}

function TrustDetailPanel({
  trust,
  onClose,
}: {
  trust: TrustRelationship | null;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "conditions" | "scope" | "risk"
  >("overview");

  if (!trust) {
    return (
      <div className="border rounded-lg bg-card p-6 h-full">
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
          <Shield className="h-12 w-12 mb-4 opacity-50" />
          <p className="text-sm">Select a trust relationship to view details</p>
          <p className="text-xs mt-2 max-w-[200px]">
            Trust relationships define who is allowed to interact with your
            identity domain
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-card overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between px-4 py-4 border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center",
              trust.level === "full"
                ? "bg-emerald-500/10"
                : trust.level === "limited"
                  ? "bg-blue-500/10"
                  : trust.level === "conditional"
                    ? "bg-amber-500/10"
                    : "bg-purple-500/10",
            )}
          >
            {trust.level === "full" ? (
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
            ) : trust.level === "limited" ? (
              <Shield className="h-5 w-5 text-blue-600" />
            ) : trust.level === "conditional" ? (
              <ShieldAlert className="h-5 w-5 text-amber-600" />
            ) : (
              <Clock className="h-5 w-5 text-purple-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{trust.name}</h3>
            <p className="text-xs text-muted-foreground">{trust.id}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-muted rounded transition-colors"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Trust Info */}
      <div className="px-4 py-3 border-b space-y-2">
        <p className="text-sm text-muted-foreground">{trust.description}</p>
        <div className="flex items-center gap-3 flex-wrap">
          <StatusBadge status={trust.status} />
          <DirectionBadge direction={trust.direction} />
          <LevelBadge level={trust.level} />
        </div>
        {trust.expiresAt && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>
              Expires {new Date(trust.expiresAt).toLocaleDateString()}
            </span>
            {new Date(trust.expiresAt) < new Date() && (
              <span className="text-red-500 font-medium">(Expired)</span>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {[
          { id: "overview", label: "Overview" },
          { id: "conditions", label: "Conditions" },
          { id: "scope", label: "Scope" },
          { id: "risk", label: "Risk" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "flex-1 px-3 py-2 text-sm font-medium border-b-2 transition-colors",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Trusted Entity */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Trusted Entity
              </h4>
              <div className="p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {trust.trustedEntity.name}
                    </p>
                    <EntityTypeBadge type={trust.trustedEntity.type} />
                  </div>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>
                    <span className="font-medium">Identifier:</span>{" "}
                    {trust.trustedEntity.identifier}
                  </p>
                  {trust.trustedEntity.metadata?.domain && (
                    <p>
                      <span className="font-medium">Domain:</span>{" "}
                      {trust.trustedEntity.metadata.domain}
                    </p>
                  )}
                  {trust.trustedEntity.metadata?.region && (
                    <p>
                      <span className="font-medium">Region:</span>{" "}
                      {trust.trustedEntity.metadata.region}
                    </p>
                  )}
                  {trust.trustedEntity.metadata?.verificationStatus && (
                    <div className="flex items-center gap-1 mt-2">
                      {trust.trustedEntity.metadata.verificationStatus ===
                      "verified" ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="text-emerald-600">Verified</span>
                        </>
                      ) : trust.trustedEntity.metadata.verificationStatus ===
                        "pending" ? (
                        <>
                          <Clock className="h-3.5 w-3.5 text-amber-500" />
                          <span className="text-amber-600">
                            Pending Verification
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3.5 w-3.5 text-red-500" />
                          <span className="text-red-600">
                            Verification Failed
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Protocols */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Supported Protocols
              </h4>
              <div className="flex flex-wrap gap-2">
                {trust.protocols.map((protocol) => (
                  <ProtocolBadge key={protocol} protocol={protocol} />
                ))}
              </div>
            </div>

            {/* Usage Stats */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Usage Statistics
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded-lg bg-muted/50 text-center">
                  <p className="text-lg font-semibold">
                    {trust.usageStats.totalAuthentications.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Total Auth
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-muted/50 text-center">
                  <p className="text-lg font-semibold">
                    {trust.usageStats.last24h}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Last 24h</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/50 text-center">
                  <p className="text-lg font-semibold text-red-500">
                    {trust.usageStats.failedAttempts}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Failed</p>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-2 pt-4 border-t text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Created</span>
                <span>{new Date(trust.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Updated</span>
                <span>{new Date(trust.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Created By</span>
                <span>{trust.createdBy}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Verified</span>
                <span>{formatRelativeTime(trust.lastVerifiedAt || null)}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "conditions" && (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Eye className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Trust Conditions
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    All conditions must be satisfied for trust to be
                    established. Required conditions are mandatory.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {trust.conditions.map((condition) => (
                <div
                  key={condition.id}
                  className="p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {condition.type}
                    </span>
                    {condition.required ? (
                      <span className="text-[10px] font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                        Required
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        Optional
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <code className="px-1.5 py-0.5 bg-muted rounded text-xs">
                      {condition.attribute || condition.type}
                    </code>
                    <span className="text-muted-foreground">
                      {condition.operator}
                    </span>
                    <code className="px-1.5 py-0.5 bg-muted rounded text-xs">
                      {Array.isArray(condition.value)
                        ? condition.value.join(", ")
                        : condition.value}
                    </code>
                  </div>
                </div>
              ))}
            </div>

            {trust.conditions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Lock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No conditions defined</p>
                <p className="text-xs mt-1">
                  This trust has no conditional requirements
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "scope" && (
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Trust Scope
              </h4>
              <div className="p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium capitalize">
                    {trust.scope} Level
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {trust.scope === "organization"
                    ? "Trust applies organization-wide across all resources"
                    : trust.scope === "environment"
                      ? "Trust is limited to specific environments"
                      : "Trust is restricted to specific resources"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Affected Environments
              </h4>
              <div className="flex flex-wrap gap-2">
                {trust.environments.map((env) => (
                  <span
                    key={env}
                    className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      env === "production"
                        ? "bg-red-100 text-red-700"
                        : env === "staging"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700",
                    )}
                  >
                    {env}
                  </span>
                ))}
              </div>
            </div>

            {trust.dependencies.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Dependencies
                </h4>
                <div className="space-y-1">
                  {trust.dependencies.map((depId) => (
                    <div
                      key={depId}
                      className="flex items-center gap-2 p-2 rounded bg-muted/50 text-xs"
                    >
                      <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-mono">{depId}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "risk" && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Risk Score</span>
                <span
                  className={cn(
                    "text-lg font-bold",
                    trust.riskScore > 60
                      ? "text-red-500"
                      : trust.riskScore > 30
                        ? "text-amber-500"
                        : "text-emerald-500",
                  )}
                >
                  {trust.riskScore}/100
                </span>
              </div>
              <RiskScoreIndicator score={trust.riskScore} />
            </div>

            <div className="p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Blast Radius</span>
                <BlastRadiusBadge level={trust.blastRadius} />
              </div>
              <p className="text-xs text-muted-foreground">
                {trust.blastRadius === "critical"
                  ? "Compromise would affect the entire organization"
                  : trust.blastRadius === "high"
                    ? "Compromise would affect multiple environments"
                    : trust.blastRadius === "medium"
                      ? "Compromise would affect specific resources"
                      : "Limited impact scope"}
              </p>
            </div>

            {trust.riskScore > 50 && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <div className="flex items-start gap-2">
                  <AlertOctagon className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-900">
                      High Risk Trust
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      This trust relationship has elevated risk. Review
                      conditions and scope regularly.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3 pt-4 border-t">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Risk Factors
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Trust Level</span>
                  <span
                    className={cn(
                      trust.level === "full"
                        ? "text-red-500"
                        : trust.level === "limited"
                          ? "text-amber-500"
                          : "text-emerald-500",
                    )}
                  >
                    {trust.level === "full"
                      ? "High"
                      : trust.level === "limited"
                        ? "Medium"
                        : "Low"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Scope</span>
                  <span
                    className={cn(
                      trust.scope === "organization"
                        ? "text-red-500"
                        : trust.scope === "environment"
                          ? "text-amber-500"
                          : "text-emerald-500",
                    )}
                  >
                    {trust.scope === "organization"
                      ? "High"
                      : trust.scope === "environment"
                        ? "Medium"
                        : "Low"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Direction</span>
                  <span
                    className={cn(
                      trust.direction === "bidirectional"
                        ? "text-red-500"
                        : trust.direction === "inbound"
                          ? "text-amber-500"
                          : "text-emerald-500",
                    )}
                  >
                    {trust.direction === "bidirectional"
                      ? "High"
                      : trust.direction === "inbound"
                        ? "Medium"
                        : "Low"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Environment</span>
                  <span
                    className={cn(
                      trust.environments.includes("production")
                        ? "text-red-500"
                        : trust.environments.includes("staging")
                          ? "text-amber-500"
                          : "text-emerald-500",
                    )}
                  >
                    {trust.environments.includes("production")
                      ? "High"
                      : trust.environments.includes("staging")
                        ? "Medium"
                        : "Low"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
            <Edit3 className="h-4 w-4" />
            Edit
          </button>
          {trust.status === "active" ? (
            <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors text-amber-600">
              <PauseCircle className="h-4 w-4" />
              Suspend
            </button>
          ) : (
            <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors text-emerald-600">
              <PlayCircle className="h-4 w-4" />
              Activate
            </button>
          )}
        </div>

        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
          <RefreshCw className="h-4 w-4" />
          Verify Trust
        </button>

        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-destructive/20">
          <Trash2 className="h-4 w-4" />
          Revoke Trust
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function TrustPage() {
  const [relationships] = useState<TrustRelationship[]>(mockTrustRelationships);
  const [selectedTrust, setSelectedTrust] = useState<TrustRelationship | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [directionFilter, setDirectionFilter] = useState<
    TrustDirection | "all"
  >("all");
  const [statusFilter, setStatusFilter] = useState<TrustStatus | "all">("all");
  const [showVisualization, setShowVisualization] = useState(false);

  const filteredRelationships = relationships.filter((trust) => {
    const matchesSearch =
      searchQuery === "" ||
      trust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trust.trustedEntity.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      trust.trustedEntity.identifier
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesDirection =
      directionFilter === "all" || trust.direction === directionFilter;
    const matchesStatus =
      statusFilter === "all" || trust.status === statusFilter;

    return matchesSearch && matchesDirection && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <TrustHeader
        onCreateTrust={() => {}}
        onViewGraph={() => setShowVisualization(!showVisualization)}
      />

      <TrustStats relationships={relationships} />

      {showVisualization && (
        <TrustVisualization relationships={filteredRelationships} />
      )}

      <TrustFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        directionFilter={directionFilter}
        onDirectionFilterChange={setDirectionFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrustTable
            relationships={filteredRelationships}
            selectedTrust={selectedTrust}
            onSelectTrust={setSelectedTrust}
          />
        </div>
        <div className="lg:col-span-1">
          <TrustDetailPanel
            trust={selectedTrust}
            onClose={() => setSelectedTrust(null)}
          />
        </div>
      </div>
    </div>
  );
}
