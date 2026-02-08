"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/dashboard/ui/card";
import { Badge } from "@/components/dashboard/ui/badge";
import { Button } from "@/components/dashboard/ui/button";
import { Progress } from "@/components/dashboard/ui/progress";
import { Separator } from "@/components/dashboard/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dashboard/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/dashboard/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/dashboard/ui/select";
import { Input } from "@/components/dashboard/ui/input";
import {
  Ticket,
  TicketCheck,
  TicketX,
  Clock,
  AlertTriangle,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  Ban,
  User,
  Server,
  Smartphone,
  Globe,
  Key,
  History,
  Eye,
  CheckCircle2,
  AlertCircle,
  Info,
  Users,
  Download,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES - Token Management
// ============================================================================

type TokenType = "access" | "refresh" | "service" | "device" | "api";
type TokenStatus = "active" | "expired" | "revoked" | "pending";
type TokenSubjectType = "user" | "service" | "device" | "machine";

interface Token {
  id: string;
  type: TokenType;
  status: TokenStatus;
  subjectId: string;
  subjectType: TokenSubjectType;
  subjectName: string;
  scopes: string[];
  audience: string[];
  issuedAt: string;
  expiresAt: string;
  lastUsedAt?: string;
  issuedBy: string;
  issuedFrom: string;
  clientId?: string;
  deviceId?: string;
  ipAddress?: string;
  userAgent?: string;
  rotationCount: number;
  isRotated: boolean;
  parentTokenId?: string;
  metadata?: Record<string, unknown>;
}

interface TokenStats {
  totalTokens: number;
  activeTokens: number;
  expiredTokens: number;
  revokedTokens: number;
  serviceTokens: number;
  userTokens: number;
  deviceTokens: number;
  apiTokens: number;
  avgTokenAge: number;
  rotationRate: number;
}

interface TokenPolicy {
  type: TokenType;
  ttl: number;
  maxRotationCount: number;
  requireBinding: boolean;
  bindingTypes: ("ip" | "device" | "client")[];
  scopeConstraints: string[];
  audienceRules: string[];
  refreshStrategy: "sliding" | "absolute" | "on_demand";
}

interface RevocationEvent {
  id: string;
  timestamp: string;
  actor: {
    id: string;
    name: string;
    email: string;
  };
  type: "single" | "by_subject" | "by_client" | "by_scope" | "global";
  target: string;
  reason: string;
  affectedTokens: number;
  scope: string;
}

interface TokenAnomaly {
  id: string;
  severity: "low" | "medium" | "high" | "critical";
  type:
    | "unusual_pattern"
    | "suspicious_usage"
    | "expired_active"
    | "scope_escalation";
  description: string;
  tokenId?: string;
  detectedAt: string;
  resolved: boolean;
}

// ============================================================================
// MOCK DATA - Token Management State
// ============================================================================

const mockStats: TokenStats = {
  totalTokens: 12483,
  activeTokens: 9876,
  expiredTokens: 2453,
  revokedTokens: 154,
  serviceTokens: 432,
  userTokens: 8942,
  deviceTokens: 2891,
  apiTokens: 218,
  avgTokenAge: 3600,
  rotationRate: 94,
};

const mockTokens: Token[] = [
  {
    id: "tok_abc123xyz789",
    type: "access",
    status: "active",
    subjectId: "usr_001",
    subjectType: "user",
    subjectName: "john.smith@acme.com",
    scopes: ["read", "write", "admin"],
    audience: ["api", "web"],
    issuedAt: "2025-02-08T12:00:00Z",
    expiresAt: "2025-02-08T12:15:00Z",
    lastUsedAt: "2025-02-08T14:30:00Z",
    issuedBy: "identity",
    issuedFrom: "web_login",
    clientId: "web-dashboard",
    ipAddress: "10.0.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    rotationCount: 2,
    isRotated: false,
  },
  {
    id: "tok_svc_prod_api",
    type: "service",
    status: "active",
    subjectId: "svc_001",
    subjectType: "service",
    subjectName: "payment-service",
    scopes: ["payment:read", "payment:write", "audit:read"],
    audience: ["payment-api", "audit-api"],
    issuedAt: "2025-02-01T00:00:00Z",
    expiresAt: "2025-03-01T00:00:00Z",
    lastUsedAt: "2025-02-08T14:45:00Z",
    issuedBy: "admin@acme.com",
    issuedFrom: "service_provisioning",
    clientId: "service-account",
    rotationCount: 0,
    isRotated: false,
  },
  {
    id: "tok_device_mobile_001",
    type: "device",
    status: "active",
    subjectId: "dev_001",
    subjectType: "device",
    subjectName: "iPhone-John",
    scopes: ["read", "push:receive"],
    audience: ["mobile-api"],
    issuedAt: "2025-02-07T08:00:00Z",
    expiresAt: "2025-03-07T08:00:00Z",
    lastUsedAt: "2025-02-08T14:20:00Z",
    issuedBy: "device_enrollment",
    issuedFrom: "mobile_app",
    deviceId: "device_abc123",
    rotationCount: 1,
    isRotated: false,
  },
  {
    id: "tok_api_partner_xyz",
    type: "api",
    status: "active",
    subjectId: "api_001",
    subjectType: "service",
    subjectName: "partner-integration",
    scopes: ["read:limited", "webhook:write"],
    audience: ["public-api"],
    issuedAt: "2025-02-05T10:00:00Z",
    expiresAt: "2025-08-05T10:00:00Z",
    lastUsedAt: "2025-02-08T13:15:00Z",
    issuedBy: "partner-portal",
    issuedFrom: "api_provisioning",
    clientId: "partner-client",
    rotationCount: 0,
    isRotated: false,
  },
  {
    id: "tok_refresh_expired",
    type: "refresh",
    status: "expired",
    subjectId: "usr_002",
    subjectType: "user",
    subjectName: "jane.doe@acme.com",
    scopes: ["read", "write"],
    audience: ["api"],
    issuedAt: "2025-01-01T00:00:00Z",
    expiresAt: "2025-02-01T00:00:00Z",
    issuedBy: "identity",
    issuedFrom: "sso_login",
    rotationCount: 5,
    isRotated: true,
    parentTokenId: "tok_parent_001",
  },
  {
    id: "tok_revoked_security",
    type: "access",
    status: "revoked",
    subjectId: "usr_003",
    subjectType: "user",
    subjectName: "suspicious.user@external.com",
    scopes: ["read", "write", "admin"],
    audience: ["api", "admin"],
    issuedAt: "2025-02-08T10:00:00Z",
    expiresAt: "2025-02-08T10:15:00Z",
    lastUsedAt: "2025-02-08T10:05:00Z",
    issuedBy: "identity",
    issuedFrom: "password_login",
    ipAddress: "192.168.1.50",
    rotationCount: 0,
    isRotated: false,
  },
];

const mockTokenPolicies: TokenPolicy[] = [
  {
    type: "access",
    ttl: 900,
    maxRotationCount: 10,
    requireBinding: true,
    bindingTypes: ["ip", "device"],
    scopeConstraints: ["read", "write", "admin"],
    audienceRules: ["api", "web", "mobile"],
    refreshStrategy: "sliding",
  },
  {
    type: "refresh",
    ttl: 604800,
    maxRotationCount: 100,
    requireBinding: true,
    bindingTypes: ["device", "client"],
    scopeConstraints: ["refresh", "offline_access"],
    audienceRules: ["identity"],
    refreshStrategy: "absolute",
  },
  {
    type: "service",
    ttl: 2592000,
    maxRotationCount: 0,
    requireBinding: false,
    bindingTypes: [],
    scopeConstraints: ["service:*", "read", "write"],
    audienceRules: ["internal-api"],
    refreshStrategy: "on_demand",
  },
  {
    type: "device",
    ttl: 7776000,
    maxRotationCount: 5,
    requireBinding: true,
    bindingTypes: ["device"],
    scopeConstraints: ["device:*", "read", "push:*"],
    audienceRules: ["device-api", "mobile-api"],
    refreshStrategy: "sliding",
  },
  {
    type: "api",
    ttl: 15778800,
    maxRotationCount: 0,
    requireBinding: true,
    bindingTypes: ["client", "ip"],
    scopeConstraints: ["api:*", "public:read"],
    audienceRules: ["public-api", "partner-api"],
    refreshStrategy: "on_demand",
  },
];

const mockRevocationEvents: RevocationEvent[] = [
  {
    id: "rev_001",
    timestamp: "2025-02-08T14:30:00Z",
    actor: {
      id: "usr_admin_001",
      name: "Security Admin",
      email: "security@acme.com",
    },
    type: "single",
    target: "tok_revoked_security",
    reason: "Suspicious activity detected",
    affectedTokens: 1,
    scope: "admin:token:revoke",
  },
  {
    id: "rev_002",
    timestamp: "2025-02-08T12:00:00Z",
    actor: {
      id: "usr_admin_002",
      name: "System Admin",
      email: "admin@acme.com",
    },
    type: "by_subject",
    target: "usr_old_employee",
    reason: "Employee offboarding",
    affectedTokens: 23,
    scope: "admin:token:revoke:subject",
  },
  {
    id: "rev_003",
    timestamp: "2025-02-07T08:00:00Z",
    actor: {
      id: "system",
      name: "System Automation",
      email: "system@acme.com",
    },
    type: "by_scope",
    target: "admin:*",
    reason: "Emergency scope revocation",
    affectedTokens: 156,
    scope: "superadmin:token:revoke:scope",
  },
];

const mockAnomalies: TokenAnomaly[] = [
  {
    id: "anom_001",
    severity: "high",
    type: "suspicious_usage",
    description:
      "Token used from unusual location after recent login from different country",
    tokenId: "tok_abc123xyz789",
    detectedAt: "2025-02-08T14:35:00Z",
    resolved: false,
  },
  {
    id: "anom_002",
    severity: "medium",
    type: "scope_escalation",
    description:
      "Service token attempted to use scopes beyond its granted permissions",
    tokenId: "tok_svc_prod_api",
    detectedAt: "2025-02-08T13:20:00Z",
    resolved: true,
  },
  {
    id: "anom_003",
    severity: "critical",
    type: "unusual_pattern",
    description: "Multiple tokens issued in rapid succession for same subject",
    detectedAt: "2025-02-08T11:00:00Z",
    resolved: false,
  },
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function TokenTypeBadge({ type }: { type: TokenType }) {
  const configs = {
    access: {
      icon: Ticket,
      color: "bg-blue-500/10 text-blue-600",
      label: "Access",
    },
    refresh: {
      icon: RefreshCw,
      color: "bg-purple-500/10 text-purple-600",
      label: "Refresh",
    },
    service: {
      icon: Server,
      color: "bg-emerald-500/10 text-emerald-600",
      label: "Service",
    },
    device: {
      icon: Smartphone,
      color: "bg-amber-500/10 text-amber-600",
      label: "Device",
    },
    api: { icon: Globe, color: "bg-cyan-500/10 text-cyan-600", label: "API" },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium",
        config.color,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

function TokenStatusBadge({ status }: { status: TokenStatus }) {
  const configs = {
    active: {
      icon: TicketCheck,
      color: "bg-emerald-500/10 text-emerald-600",
      label: "Active",
    },
    expired: {
      icon: Clock,
      color: "bg-slate-500/10 text-slate-600",
      label: "Expired",
    },
    revoked: {
      icon: TicketX,
      color: "bg-red-500/10 text-red-600",
      label: "Revoked",
    },
    pending: {
      icon: AlertCircle,
      color: "bg-amber-500/10 text-amber-600",
      label: "Pending",
    },
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium",
        config.color,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

function SubjectTypeBadge({ type }: { type: TokenSubjectType }) {
  const configs = {
    user: { icon: User, label: "User" },
    service: { icon: Server, label: "Service" },
    device: { icon: Smartphone, label: "Device" },
    machine: { icon: Key, label: "Machine" },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

function AnomalySeverityBadge({
  severity,
}: {
  severity: TokenAnomaly["severity"];
}) {
  const configs = {
    low: { color: "bg-blue-500/10 text-blue-600", label: "Low" },
    medium: { color: "bg-amber-500/10 text-amber-600", label: "Medium" },
    high: { color: "bg-orange-500/10 text-orange-600", label: "High" },
    critical: { color: "bg-red-500/10 text-red-600", label: "Critical" },
  };

  const config = configs[severity];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase",
        config.color,
      )}
    >
      {config.label}
    </span>
  );
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d`;
  return `${Math.floor(seconds / 2592000)}mo`;
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
}

function formatTimeAgo(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

function TokenOverviewMetrics({ stats }: { stats: TokenStats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Total Tokens
              </p>
              <p className="text-2xl font-semibold mt-1">
                {stats.totalTokens.toLocaleString("en-US")}
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Ticket className="h-5 w-5 text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Active
              </p>
              <p className="text-2xl font-semibold mt-1 text-emerald-600">
                {stats.activeTokens.toLocaleString("en-US")}
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <TicketCheck className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
          <div className="mt-2">
            <Progress
              value={(stats.activeTokens / stats.totalTokens) * 100}
              className="h-1.5"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Revoked
              </p>
              <p className="text-2xl font-semibold mt-1 text-red-600">
                {stats.revokedTokens.toLocaleString("en-US")}
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Ban className="h-5 w-5 text-red-500" />
            </div>
          </div>
          {stats.revokedTokens > 0 && (
            <p className="text-xs text-amber-600 mt-2">Review required</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Rotation Rate
              </p>
              <p className="text-2xl font-semibold mt-1">
                {stats.rotationRate}%
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <RefreshCw className="h-5 w-5 text-purple-500" />
            </div>
          </div>
          <div className="mt-2">
            <Progress value={stats.rotationRate} className="h-1.5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TokenDistributionPanel({ stats }: { stats: TokenStats }) {
  const total =
    stats.serviceTokens +
    stats.userTokens +
    stats.deviceTokens +
    stats.apiTokens;

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">
              Token Distribution
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-blue-500" />
                <span>User Tokens</span>
              </div>
              <span className="font-medium">
                {stats.userTokens.toLocaleString("en-US")}
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${(stats.userTokens / total) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Smartphone className="h-3.5 w-3.5 text-amber-500" />
                <span>Device Tokens</span>
              </div>
              <span className="font-medium">
                {stats.deviceTokens.toLocaleString("en-US")}
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all"
                style={{ width: `${(stats.deviceTokens / total) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Server className="h-3.5 w-3.5 text-emerald-500" />
                <span>Service Tokens</span>
              </div>
              <span className="font-medium">
                {stats.serviceTokens.toLocaleString("en-US")}
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${(stats.serviceTokens / total) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-cyan-500" />
                <span>API Tokens</span>
              </div>
              <span className="font-medium">
                {stats.apiTokens.toLocaleString("en-US")}
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-500 rounded-full transition-all"
                style={{ width: `${(stats.apiTokens / total) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Average Token Age</span>
          <span className="font-medium">
            {formatDuration(stats.avgTokenAge)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function ActiveTokensTable({ tokens }: { tokens: Token[] }) {
  const [filterType, setFilterType] = React.useState<TokenType | "all">("all");
  const [filterStatus, setFilterStatus] = React.useState<TokenStatus | "all">(
    "all",
  );
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredTokens = tokens.filter((token) => {
    if (filterType !== "all" && token.type !== filterType) return false;
    if (filterStatus !== "all" && token.status !== filterStatus) return false;
    if (
      searchQuery &&
      !token.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !token.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">Active Tokens</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {filteredTokens.length} tokens
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Filters */}
        <div className="p-4 border-b flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by subject or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-64 text-xs"
            />
          </div>
          <Select
            value={filterType}
            onValueChange={(v) => setFilterType(v as TokenType | "all")}
          >
            <SelectTrigger className="h-8 w-32 text-xs">
              <Filter className="h-3.5 w-3.5 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="access">Access</SelectItem>
              <SelectItem value="refresh">Refresh</SelectItem>
              <SelectItem value="service">Service</SelectItem>
              <SelectItem value="device">Device</SelectItem>
              <SelectItem value="api">API</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filterStatus}
            onValueChange={(v) => setFilterStatus(v as TokenStatus | "all")}
          >
            <SelectTrigger className="h-8 w-32 text-xs">
              <Shield className="h-3.5 w-3.5 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="revoked">Revoked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tokens Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Token ID</TableHead>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="text-xs">Subject</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Scopes</TableHead>
                <TableHead className="text-xs">Expires</TableHead>
                <TableHead className="text-xs">Last Used</TableHead>
                <TableHead className="text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTokens.map((token) => (
                <TableRow key={token.id} className="group">
                  <TableCell className="font-mono text-xs">
                    <div className="flex items-center gap-2">
                      {token.id.substring(0, 12)}...
                      <TokenTypeBadge type={token.type} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <SubjectTypeBadge type={token.subjectType} />
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="space-y-0.5">
                      <p className="font-medium">{token.subjectName}</p>
                      <p className="text-muted-foreground">{token.subjectId}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <TokenStatusBadge status={token.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {token.scopes.slice(0, 2).map((scope) => (
                        <Badge
                          key={scope}
                          variant="outline"
                          className="text-[10px]"
                        >
                          {scope}
                        </Badge>
                      ))}
                      {token.scopes.length > 2 && (
                        <Badge variant="outline" className="text-[10px]">
                          +{token.scopes.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    {new Date(token.expiresAt) < new Date() ? (
                      <span className="text-red-600">
                        {formatDate(token.expiresAt)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        {formatDate(token.expiresAt)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {token.lastUsedAt
                      ? formatTimeAgo(token.lastUsedAt)
                      : "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-sm flex items-center gap-2">
                              <Ticket className="h-4 w-4" />
                              Token Details
                            </DialogTitle>
                            <DialogDescription className="text-xs">
                              Token ID:{" "}
                              <span className="font-mono">{token.id}</span>
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase">
                                  Type
                                </p>
                                <TokenTypeBadge type={token.type} />
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase">
                                  Status
                                </p>
                                <TokenStatusBadge status={token.status} />
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase">
                                  Subject
                                </p>
                                <p className="font-medium">
                                  {token.subjectName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {token.subjectId}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase">
                                  Subject Type
                                </p>
                                <SubjectTypeBadge type={token.subjectType} />
                              </div>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                              <p className="text-xs text-muted-foreground uppercase">
                                Scopes
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {token.scopes.map((scope) => (
                                  <Badge
                                    key={scope}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {scope}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <p className="text-xs text-muted-foreground uppercase">
                                Audience
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {token.audience.map((aud) => (
                                  <Badge
                                    key={aud}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {aud}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div className="space-y-1">
                                <p className="text-muted-foreground">
                                  Issued At
                                </p>
                                <p>{formatDate(token.issuedAt)}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-muted-foreground">
                                  Expires At
                                </p>
                                <p>{formatDate(token.expiresAt)}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-muted-foreground">
                                  Issued By
                                </p>
                                <p>{token.issuedBy}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-muted-foreground">
                                  Issued From
                                </p>
                                <p>{token.issuedFrom}</p>
                              </div>
                              {token.ipAddress && (
                                <div className="space-y-1">
                                  <p className="text-muted-foreground">
                                    IP Address
                                  </p>
                                  <p className="font-mono">{token.ipAddress}</p>
                                </div>
                              )}
                              {token.clientId && (
                                <div className="space-y-1">
                                  <p className="text-muted-foreground">
                                    Client ID
                                  </p>
                                  <p className="font-mono">{token.clientId}</p>
                                </div>
                              )}
                            </div>
                            {token.isRotated && (
                              <div className="p-3 rounded bg-amber-50 border border-amber-200">
                                <div className="flex items-start gap-2">
                                  <RefreshCw className="h-4 w-4 text-amber-600 mt-0.5" />
                                  <div>
                                    <p className="text-xs font-medium text-amber-900">
                                      Rotated Token
                                    </p>
                                    <p className="text-xs text-amber-700">
                                      This token has been rotated{" "}
                                      {token.rotationCount} times
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      {token.status === "active" && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Ban className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function TokenPoliciesPanel({ policies }: { policies: TokenPolicy[] }) {
  const [selectedPolicy, setSelectedPolicy] =
    React.useState<TokenPolicy | null>(null);

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">
              Token Policies
            </CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            Read-only
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="divide-y divide-border lg:border-r">
            {policies.map((policy) => (
              <button
                key={policy.type}
                onClick={() => setSelectedPolicy(policy)}
                className={cn(
                  "w-full p-4 text-left transition-colors hover:bg-muted/50",
                  selectedPolicy?.type === policy.type && "bg-muted",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <TokenTypeBadge type={policy.type} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        TTL: {formatDuration(policy.ttl)}
                      </span>
                      <span>
                        {policy.maxRotationCount > 0
                          ? `${policy.maxRotationCount} rotations`
                          : "No rotation"}
                      </span>
                    </div>
                  </div>
                  {selectedPolicy?.type === policy.type && (
                    <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                  )}
                </div>
              </button>
            ))}
          </div>
          <div className="p-4">
            {selectedPolicy ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Token Type
                  </p>
                  <TokenTypeBadge type={selectedPolicy.type} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      TTL
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <p className="text-sm font-medium">
                        {formatDuration(selectedPolicy.ttl)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Max Rotations
                    </p>
                    <p className="text-sm font-medium">
                      {selectedPolicy.maxRotationCount}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Refresh Strategy
                  </p>
                  <Badge variant="outline" className="text-xs capitalize">
                    {selectedPolicy.refreshStrategy.replace("_", " ")}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Binding Requirements
                  </p>
                  <div className="flex items-center gap-2">
                    {selectedPolicy.requireBinding ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Required
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                        <Shield className="h-3.5 w-3.5" />
                        Optional
                      </span>
                    )}
                  </div>
                  {selectedPolicy.bindingTypes.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {selectedPolicy.bindingTypes.map((type) => (
                        <Badge
                          key={type}
                          variant="secondary"
                          className="text-[10px] capitalize"
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Scope Constraints
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedPolicy.scopeConstraints.map((scope) => (
                      <Badge
                        key={scope}
                        variant="outline"
                        className="text-[10px]"
                      >
                        {scope}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Audience Rules
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedPolicy.audienceRules.map((audience) => (
                      <Badge
                        key={audience}
                        variant="outline"
                        className="text-[10px]"
                      >
                        {audience}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-8">
                <Shield className="h-10 w-10 mb-3 opacity-50" />
                <p className="text-sm">Select a policy to view details</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RevocationControlPanel() {
  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ban className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">
              Revocation Control
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="h-auto py-3 justify-start text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded bg-red-500/10 flex items-center justify-center shrink-0">
                    <TicketX className="h-4 w-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Revoke Single Token</p>
                    <p className="text-xs text-muted-foreground">
                      Target a specific token by ID
                    </p>
                  </div>
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-sm">
                  Revoke Single Token
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Enter the token ID to revoke immediately
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium">Token ID</label>
                  <Input placeholder="tok_..." className="text-xs" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium">Reason</label>
                  <Input
                    placeholder="Reason for revocation..."
                    className="text-xs"
                  />
                </div>
                <div className="p-3 rounded bg-amber-50 border border-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                    <p className="text-xs text-amber-700">
                      This action is immediate and cannot be undone. The subject
                      will need to re-authenticate.
                    </p>
                  </div>
                </div>
                <Button variant="destructive" className="w-full">
                  Revoke Token
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="h-auto py-3 justify-start text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded bg-orange-500/10 flex items-center justify-center shrink-0">
                    <Users className="h-4 w-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Revoke by Subject</p>
                    <p className="text-xs text-muted-foreground">
                      All tokens for a user/service
                    </p>
                  </div>
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-sm">Revoke by Subject</DialogTitle>
                <DialogDescription className="text-xs">
                  Revoke all tokens for a specific subject
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium">Subject ID</label>
                  <Input placeholder="usr_... or svc_..." className="text-xs" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium">Reason</label>
                  <Input
                    placeholder="Reason for revocation..."
                    className="text-xs"
                  />
                </div>
                <Button variant="destructive" className="w-full">
                  Revoke All Subject Tokens
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="h-auto py-3 justify-start text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded bg-purple-500/10 flex items-center justify-center shrink-0">
                    <Key className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Revoke by Client</p>
                    <p className="text-xs text-muted-foreground">
                      All tokens from a client
                    </p>
                  </div>
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-sm">Revoke by Client</DialogTitle>
                <DialogDescription className="text-xs">
                  Revoke all tokens issued to a specific client
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium">Client ID</label>
                  <Input placeholder="client_..." className="text-xs" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium">Reason</label>
                  <Input
                    placeholder="Reason for revocation..."
                    className="text-xs"
                  />
                </div>
                <Button variant="destructive" className="w-full">
                  Revoke All Client Tokens
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="h-auto py-3 justify-start text-left border-red-200 hover:bg-red-50"
              >
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded bg-red-500/10 flex items-center justify-center shrink-0">
                    <ShieldAlert className="h-4 w-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-600">
                      Global Revocation
                    </p>
                    <p className="text-xs text-muted-foreground">
                      All tokens (Superadmin only)
                    </p>
                  </div>
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-sm text-red-600">
                  Global Token Revocation
                </DialogTitle>
                <DialogDescription className="text-xs">
                  This will revoke ALL tokens across the platform. Use with
                  extreme caution.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="p-4 rounded bg-red-50 border border-red-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-900">
                        Critical Operation
                      </p>
                      <p className="text-xs text-red-700 mt-1">
                        This will force all users, services, and devices to
                        re-authenticate. This action requires superadmin
                        approval and will be logged.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium">Confirmation</label>
                  <Input
                    placeholder="Type 'REVOKE ALL' to confirm"
                    className="text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium">
                    Emergency Reason
                  </label>
                  <Input
                    placeholder="Emergency reason required..."
                    className="text-xs"
                  />
                </div>
                <Button variant="destructive" className="w-full" disabled>
                  Revoke All Tokens (Requires Approval)
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

function TokenAnomaliesPanel({ anomalies }: { anomalies: TokenAnomaly[] }) {
  const unresolvedCount = anomalies.filter((a) => !a.resolved).length;

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">
              Anomaly Detection
            </CardTitle>
          </div>
          {unresolvedCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unresolvedCount} unresolved
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {anomalies.map((anomaly) => (
            <div
              key={anomaly.id}
              className={cn(
                "p-4 hover:bg-muted/30 transition-colors",
                anomaly.resolved && "opacity-60",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <AnomalySeverityBadge severity={anomaly.severity} />
                    <span className="text-xs text-muted-foreground">
                      {anomaly.type.replace("_", " ")}
                    </span>
                    {anomaly.resolved && (
                      <Badge variant="outline" className="text-[10px]">
                        Resolved
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs">{anomaly.description}</p>
                  {anomaly.tokenId && (
                    <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                      Token: {anomaly.tokenId}
                    </p>
                  )}
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Detected {formatTimeAgo(anomaly.detectedAt)}
                  </p>
                </div>
                {!anomaly.resolved && (
                  <Button size="sm" variant="ghost" className="h-7 text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    Resolve
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RevocationAuditPanel({ events }: { events: RevocationEvent[] }) {
  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">
              Revocation History
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-7 text-xs">
              <ExternalLink className="h-3 w-3 mr-1" />
              <a href="/admin/security/audit">View in Audit</a>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border max-h-[300px] overflow-y-auto">
          {events.map((event) => (
            <div
              key={event.id}
              className="p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Ban className="h-3.5 w-3.5 text-red-500" />
                    <span className="text-xs font-medium capitalize">
                      {event.type.replace("_", " ")} Revocation
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {event.affectedTokens} tokens
                    </Badge>
                  </div>
                  <p className="text-xs mt-1">
                    <span className="font-medium">{event.actor.name}</span>
                    <span className="text-muted-foreground">
                      {" "}
                      — {event.reason}
                    </span>
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                    <span>{formatTimeAgo(event.timestamp)}</span>
                    <span className="font-mono">Target: {event.target}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function TokenPlatformPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-card-foreground">
            Token Platform
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Monitor, audit, and control all tokens issued by Aether Identity.
            View active sessions, manage token lifecycle, and perform targeted
            or bulk revocations. No secrets are displayed here.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-9 text-xs">
            <Download className="h-4 w-4 mr-1" />
            Export Report
          </Button>
          <Button size="sm" variant="default" className="h-9 text-xs">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Security Warning Banner */}
      <div className="p-4 rounded-lg border border-amber-200 bg-amber-50">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-900">
              Token Control Center
            </p>
            <p className="text-sm text-amber-700 mt-1">
              This is a read-only control interface. Token secrets are never
              displayed. All revocation actions are immediate, audited, and
              require appropriate scopes. Global revocation requires superadmin
              approval.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Overview */}
      <TokenOverviewMetrics stats={mockStats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Distribution & Anomalies */}
        <div className="lg:col-span-1 space-y-6">
          <TokenDistributionPanel stats={mockStats} />
          <TokenAnomaliesPanel anomalies={mockAnomalies} />
        </div>

        {/* Middle & Right Columns - Tokens Table */}
        <div className="lg:col-span-2 space-y-6">
          <ActiveTokensTable tokens={mockTokens} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TokenPoliciesPanel policies={mockTokenPolicies} />
            <RevocationControlPanel />
          </div>

          <RevocationAuditPanel events={mockRevocationEvents} />

          {/* API Integration Reference */}
          <Card className="border-border bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                API Integration Reference
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p className="text-xs">
                This interface interacts with the Identity Platform Token API.
                All operations require appropriate RBAC scopes and are subject
                to audit logging.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <p className="font-medium text-foreground">
                    Required Scopes:
                  </p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>
                      <code className="bg-muted px-1 rounded">
                        admin:token:read
                      </code>{" "}
                      - View tokens
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">
                        admin:token:revoke
                      </code>{" "}
                      - Revoke single token
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">
                        admin:token:revoke:subject
                      </code>{" "}
                      - Revoke by subject
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">
                        superadmin:token:revoke:all
                      </code>{" "}
                      - Global revocation
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-foreground">Key Endpoints:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>
                      <code className="bg-muted px-1 rounded">GET /tokens</code>{" "}
                      - List tokens
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">
                        GET /tokens/{"{id}"}
                      </code>{" "}
                      - Token details
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">
                        POST /tokens/{"{id}"}/revoke
                      </code>{" "}
                      - Revoke token
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">
                        POST /tokens/revoke/by-subject
                      </code>{" "}
                      - Bulk revoke
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
