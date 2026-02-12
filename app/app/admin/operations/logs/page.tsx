"use client";

import * as React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/dashboard/ui/card";
import { Badge } from "@/components/dashboard/ui/badge";
import { Button } from "@/components/dashboard/ui/button";
import { Progress } from "@/components/dashboard/ui/progress";
import { MetricCard } from "@/components/dashboard/metric-card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dashboard/ui/dialog";
import { Switch } from "@/components/dashboard/ui/switch";
import { Label } from "@/components/dashboard/ui/label";
import { Input } from "@/components/dashboard/ui/input";
import { Slider } from "@/components/dashboard/ui/slider";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/dashboard/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/dashboard/ui/tooltip";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Cloud,
  Database,
  Download,
  Eye,
  FileJson,
  FileText,
  Filter,
  Globe,
  HardDrive,
  History,
  Info,
  LayoutGrid,
  List,
  Lock,
  Monitor,
  MoreHorizontal,
  RefreshCw,
  Search,
  Server,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Terminal,
  Trash2,
  UploadCloud,
  User,
  Users,
  XCircle,
  Zap,
  FileSpreadsheet,
  type LucideIcon,
} from "lucide-react";

// ============================================================================
// TYPES - Enterprise Operational Logging System
// ============================================================================

type DeploymentMode = "saas_cloud" | "self_hosted" | "hybrid";
type PlanTier = "free" | "pro" | "enterprise";
type EnvironmentType = "production" | "staging" | "development";
type LoggingStatus = "healthy" | "delayed" | "failure" | "not_configured";
type LogSeverity = "info" | "warning" | "error" | "critical";
type LogSource =
  | "auth"
  | "api"
  | "backup"
  | "dr"
  | "iac"
  | "system"
  | "database"
  | "audit"
  | "security"
  | "integration";
type LogStatus = "success" | "failure" | "pending" | "blocked";
type AlertType =
  | "failed_login"
  | "suspicious_ip"
  | "privilege_escalation"
  | "token_misuse"
  | "api_abuse"
  | "anomaly";
type RetentionPolicy = "minimal" | "standard" | "extended" | "compliance";

interface OrganizationContext {
  id: string;
  name: string;
  plan: PlanTier;
  environment: EnvironmentType;
  region: string;
  deploymentMode: DeploymentMode;
}

interface LoggingHealth {
  overallStatus: LoggingStatus;
  lastEventAt: string;
  events24h: number;
  criticalEvents24h: number;
  failedAuthAttempts24h: number;
  adminActions24h: number;
  avgLatency: number; // in ms
  retentionDays: number;
  storageUsed: string;
  storageLimit: string;
}

interface LogEntry {
  id: string;
  timestamp: string;
  severity: LogSeverity;
  source: LogSource;
  user: string;
  service: string;
  action: string;
  status: LogStatus;
  ipAddress: string;
  environment: EnvironmentType;
  message: string;
  metadata: {
    userAgent?: string;
    requestId?: string;
    duration?: number;
    resource?: string;
    correlationId?: string;
  };
  tags: string[];
}

interface SecurityAlert {
  id: string;
  type: AlertType;
  severity: LogSeverity;
  message: string;
  detectedAt: string;
  source: LogSource;
  user?: string;
  ipAddress: string;
  details: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  autoResolved: boolean;
}

interface LogRetentionConfig {
  policy: RetentionPolicy;
  retentionDays: number;
  archiveEnabled: boolean;
  archiveStorageType: "s3" | "gcs" | "azure" | "local";
  compressionEnabled: boolean;
  compressionLevel: number;
  siemEnabled: boolean;
  siemEndpoint?: string;
}

interface LogFilter {
  severity: LogSeverity | "all";
  source: LogSource | "all";
  environment: EnvironmentType | "all";
  status: LogStatus | "all";
  user: string;
  searchQuery: string;
  dateFrom: string;
  dateTo: string;
}

interface AuditStats {
  totalEvents: number;
  criticalEvents: number;
  failedAuths: number;
  adminActions: number;
  uniqueUsers: number;
  uniqueIps: number;
  topSources: { source: LogSource; count: number }[];
  severityDistribution: Record<LogSeverity, number>;
}

// ============================================================================
// MOCK DATA - Enterprise Logging Context
// ============================================================================

const orgContext: OrganizationContext = {
  id: "org_2vPqN7xYz",
  name: "Acme Corporation",
  plan: "enterprise",
  environment: "production",
  region: "us-east-1",
  deploymentMode: "saas_cloud",
};

const loggingHealth: LoggingHealth = {
  overallStatus: "healthy",
  lastEventAt: "2026-02-12T15:02:34Z",
  events24h: 284756,
  criticalEvents24h: 3,
  failedAuthAttempts24h: 127,
  adminActions24h: 234,
  avgLatency: 45,
  retentionDays: 90,
  storageUsed: "847 GB",
  storageLimit: "2 TB",
};

const logEntries: LogEntry[] = [
  {
    id: "evt_001",
    timestamp: "2026-02-12T15:02:34Z",
    severity: "info",
    source: "auth",
    user: "sarah.chen@acme.com",
    service: "identity-service",
    action: "user_login",
    status: "success",
    ipAddress: "203.0.113.45",
    environment: "production",
    message: "User successfully authenticated via SSO",
    metadata: {
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      requestId: "req_a1b2c3d4",
      duration: 234,
      correlationId: "corr_auth_001",
    },
    tags: ["sso", "okta", "successful"],
  },
  {
    id: "evt_002",
    timestamp: "2026-02-12T15:01:12Z",
    severity: "warning",
    source: "api",
    user: "api-key-prod-7xYz",
    service: "api-gateway",
    action: "rate_limit_approaching",
    status: "success",
    ipAddress: "198.51.100.23",
    environment: "production",
    message: "API key approaching rate limit: 850/1000 requests",
    metadata: {
      requestId: "req_e4f5g6h7",
      duration: 12,
      correlationId: "corr_api_002",
    },
    tags: ["rate-limit", "api-key", "monitoring"],
  },
  {
    id: "evt_003",
    timestamp: "2026-02-12T15:00:45Z",
    severity: "error",
    source: "database",
    user: "system",
    service: "postgres-primary",
    action: "query_timeout",
    status: "failure",
    ipAddress: "10.0.1.15",
    environment: "production",
    message: "Query timeout after 30000ms: SELECT * FROM users WHERE...",
    metadata: {
      requestId: "req_i8j9k0l1",
      duration: 30000,
      resource: "users_table",
      correlationId: "corr_db_003",
    },
    tags: ["timeout", "performance", "postgres"],
  },
  {
    id: "evt_004",
    timestamp: "2026-02-12T14:59:23Z",
    severity: "critical",
    source: "security",
    user: "unknown",
    service: "auth-service",
    action: "brute_force_detected",
    status: "blocked",
    ipAddress: "192.0.2.89",
    environment: "production",
    message: "Multiple failed login attempts from suspicious IP",
    metadata: {
      userAgent: "Mozilla/5.0 (compatible; Bot/1.0)",
      requestId: "req_m2n3o4p5",
      correlationId: "corr_sec_004",
    },
    tags: ["brute-force", "blocked", "security"],
  },
  {
    id: "evt_005",
    timestamp: "2026-02-12T14:58:01Z",
    severity: "info",
    source: "audit",
    user: "admin.johnson@acme.com",
    service: "admin-console",
    action: "policy_updated",
    status: "success",
    ipAddress: "203.0.113.67",
    environment: "production",
    message: "MFA policy updated for Engineering team",
    metadata: {
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      requestId: "req_q6r7s8t9",
      duration: 456,
      correlationId: "corr_audit_005",
    },
    tags: ["admin", "policy", "mfa"],
  },
  {
    id: "evt_006",
    timestamp: "2026-02-12T14:56:45Z",
    severity: "warning",
    source: "integration",
    user: "system",
    service: "azure-ad-connector",
    action: "sync_partial_failure",
    status: "failure",
    ipAddress: "10.0.2.34",
    environment: "production",
    message: "Directory sync completed with 3 errors out of 2847 users",
    metadata: {
      requestId: "req_u0v1w2x3",
      duration: 12456,
      resource: "azure_ad_sync",
      correlationId: "corr_int_006",
    },
    tags: ["sync", "azure-ad", "partial-failure"],
  },
  {
    id: "evt_007",
    timestamp: "2026-02-12T14:55:12Z",
    severity: "info",
    source: "backup",
    user: "system",
    service: "backup-service",
    action: "backup_completed",
    status: "success",
    ipAddress: "10.0.1.45",
    environment: "production",
    message: "Automated backup completed successfully: 2.4GB in 3m 42s",
    metadata: {
      requestId: "req_y4z5a6b7",
      duration: 222,
      resource: "full_database",
      correlationId: "corr_backup_007",
    },
    tags: ["backup", "automated", "success"],
  },
  {
    id: "evt_008",
    timestamp: "2026-02-12T14:54:38Z",
    severity: "error",
    source: "iac",
    user: "terraform@acme.com",
    service: "terraform-cloud",
    action: "deployment_failed",
    status: "failure",
    ipAddress: "203.0.113.12",
    environment: "staging",
    message: "Terraform apply failed: Resource limit exceeded",
    metadata: {
      requestId: "req_c8d9e0f1",
      duration: 45000,
      resource: "aws_instance.worker",
      correlationId: "corr_iac_008",
    },
    tags: ["terraform", "deployment", "failure"],
  },
  {
    id: "evt_009",
    timestamp: "2026-02-12T14:53:21Z",
    severity: "info",
    source: "system",
    user: "system",
    service: "health-monitor",
    action: "health_check_passed",
    status: "success",
    ipAddress: "127.0.0.1",
    environment: "production",
    message: "All services responding within SLA",
    metadata: {
      requestId: "req_g2h3i4j5",
      duration: 45,
      correlationId: "corr_sys_009",
    },
    tags: ["health-check", "monitoring", "success"],
  },
  {
    id: "evt_010",
    timestamp: "2026-02-12T14:52:09Z",
    severity: "critical",
    source: "security",
    user: "admin.legacy@acme.com",
    service: "auth-service",
    action: "privilege_escalation_detected",
    status: "blocked",
    ipAddress: "203.0.113.89",
    environment: "production",
    message: "Suspicious privilege escalation attempt detected",
    metadata: {
      userAgent: "Mozilla/5.0 (X11; Linux x86_64)",
      requestId: "req_k6l7m8n9",
      correlationId: "corr_sec_010",
    },
    tags: ["privilege-escalation", "blocked", "critical"],
  },
  {
    id: "evt_011",
    timestamp: "2026-02-12T14:51:33Z",
    severity: "info",
    source: "dr",
    user: "system",
    service: "replication-service",
    action: "sync_completed",
    status: "success",
    ipAddress: "10.0.3.21",
    environment: "production",
    message: "Cross-region replication sync completed: 15s lag",
    metadata: {
      requestId: "req_o0p1q2r3",
      duration: 15000,
      resource: "eu-west-1",
      correlationId: "corr_dr_011",
    },
    tags: ["replication", "dr", "success"],
  },
  {
    id: "evt_012",
    timestamp: "2026-02-12T14:50:15Z",
    severity: "warning",
    source: "api",
    user: "api-key-staging-4aBc",
    service: "api-gateway",
    action: "deprecated_endpoint",
    status: "success",
    ipAddress: "198.51.100.45",
    environment: "staging",
    message: "Deprecated API endpoint called: /v1/users (use /v2/users)",
    metadata: {
      requestId: "req_s4t5u6v7",
      duration: 23,
      correlationId: "corr_api_012",
    },
    tags: ["deprecated", "api", "warning"],
  },
];

const securityAlerts: SecurityAlert[] = [
  {
    id: "sec_001",
    type: "failed_login",
    severity: "critical",
    message: "Multiple failed login attempts detected",
    detectedAt: "2026-02-12T14:59:23Z",
    source: "security",
    ipAddress: "192.0.2.89",
    details:
      "15 failed attempts in 5 minutes from IP 192.0.2.89. User agents suggest automated attack.",
    acknowledged: false,
    autoResolved: false,
  },
  {
    id: "sec_002",
    type: "privilege_escalation",
    severity: "critical",
    message: "Privilege escalation attempt blocked",
    detectedAt: "2026-02-12T14:52:09Z",
    source: "security",
    user: "admin.legacy@acme.com",
    ipAddress: "203.0.113.89",
    details:
      "Attempt to grant superadmin role by non-superadmin account. Account temporarily suspended.",
    acknowledged: false,
    autoResolved: true,
  },
  {
    id: "sec_003",
    type: "suspicious_ip",
    severity: "warning",
    message: "Login from unusual location",
    detectedAt: "2026-02-12T14:45:12Z",
    source: "auth",
    user: "james.wilson@acme.com",
    ipAddress: "185.220.101.42",
    details:
      "Login from Moscow, Russia. Previous logins from New York, USA. Requires verification.",
    acknowledged: true,
    acknowledgedBy: "security-team@acme.com",
    acknowledgedAt: "2026-02-12T14:47:33Z",
    autoResolved: false,
  },
  {
    id: "sec_004",
    type: "token_misuse",
    severity: "error",
    message: "API token used from unauthorized IP",
    detectedAt: "2026-02-12T14:30:45Z",
    source: "api",
    user: "service-account-backup",
    ipAddress: "203.0.113.201",
    details:
      "Backup service account token used from unknown IP range. Token rotated as precaution.",
    acknowledged: true,
    acknowledgedBy: "devops@acme.com",
    acknowledgedAt: "2026-02-12T14:35:12Z",
    autoResolved: true,
  },
  {
    id: "sec_005",
    type: "api_abuse",
    severity: "warning",
    message: "API abuse pattern detected",
    detectedAt: "2026-02-12T14:15:23Z",
    source: "api",
    ipAddress: "198.51.100.67",
    details:
      "Unusual request pattern: 10,000 requests/min from single IP. Rate limiting applied.",
    acknowledged: false,
    autoResolved: true,
  },
];

const retentionConfig: LogRetentionConfig = {
  policy: "extended",
  retentionDays: 90,
  archiveEnabled: true,
  archiveStorageType: "s3",
  compressionEnabled: true,
  compressionLevel: 6,
  siemEnabled: true,
  siemEndpoint: "https://splunk.acme.com:8088/services/collector/event",
};

const auditStats: AuditStats = {
  totalEvents: 284756,
  criticalEvents: 3,
  failedAuths: 127,
  adminActions: 234,
  uniqueUsers: 2847,
  uniqueIps: 456,
  topSources: [
    { source: "auth", count: 98456 },
    { source: "api", count: 67234 },
    { source: "system", count: 45123 },
    { source: "audit", count: 28901 },
    { source: "integration", count: 23456 },
  ],
  severityDistribution: {
    info: 256789,
    warning: 18456,
    error: 6501,
    critical: 3,
  },
};

// ============================================================================
// STATUS CONFIGURATIONS
// ============================================================================

const loggingStatusConfig: Record<
  LoggingStatus,
  {
    label: string;
    icon: LucideIcon;
    color: string;
    bgColor: string;
    borderColor: string;
    description: string;
  }
> = {
  healthy: {
    label: "Healthy Logging",
    icon: ShieldCheck,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    description: "All logging systems operational and current",
  },
  delayed: {
    label: "Delayed",
    icon: Clock,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    description: "Log processing experiencing delays",
  },
  failure: {
    label: "Logging Failure",
    icon: Siren,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/20",
    description: "Critical logging infrastructure failure",
  },
  not_configured: {
    label: "Not Configured",
    icon: Settings,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    borderColor: "border-border",
    description: "Logging has not been configured",
  },
};

const severityConfig: Record<
  LogSeverity,
  {
    label: string;
    icon: LucideIcon;
    color: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  info: {
    label: "Info",
    icon: Info,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  warning: {
    label: "Warning",
    icon: AlertTriangle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  error: {
    label: "Error",
    icon: AlertCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
  critical: {
    label: "Critical",
    icon: Siren,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/20",
  },
};

const sourceConfig: Record<
  LogSource,
  {
    label: string;
    icon: LucideIcon;
    color: string;
  }
> = {
  auth: { label: "Auth", icon: Lock, color: "text-purple-500" },
  api: { label: "API", icon: Globe, color: "text-cyan-500" },
  backup: { label: "Backup", icon: Database, color: "text-emerald-500" },
  dr: { label: "DR", icon: Server, color: "text-indigo-500" },
  iac: { label: "IaC", icon: Terminal, color: "text-pink-500" },
  system: { label: "System", icon: Monitor, color: "text-blue-500" },
  database: { label: "Database", icon: Database, color: "text-amber-500" },
  audit: { label: "Audit", icon: Shield, color: "text-violet-500" },
  security: { label: "Security", icon: ShieldAlert, color: "text-red-500" },
  integration: { label: "Integration", icon: Zap, color: "text-orange-500" },
};

const statusConfig: Record<
  LogStatus,
  {
    label: string;
    icon: LucideIcon;
    color: string;
  }
> = {
  success: { label: "Success", icon: CheckCircle2, color: "text-emerald-500" },
  failure: { label: "Failure", icon: XCircle, color: "text-destructive" },
  pending: { label: "Pending", icon: Clock, color: "text-amber-500" },
  blocked: { label: "Blocked", icon: ShieldAlert, color: "text-red-500" },
};

const alertTypeConfig: Record<
  AlertType,
  {
    label: string;
    description: string;
  }
> = {
  failed_login: {
    label: "Failed Login",
    description: "Multiple authentication failures detected",
  },
  suspicious_ip: {
    label: "Suspicious IP",
    description: "Login from unusual geographic location",
  },
  privilege_escalation: {
    label: "Privilege Escalation",
    description: "Unauthorized attempt to elevate permissions",
  },
  token_misuse: {
    label: "Token Misuse",
    description: "API token used from unauthorized location",
  },
  api_abuse: {
    label: "API Abuse",
    description: "Unusual API request patterns detected",
  },
  anomaly: {
    label: "Anomaly",
    description: "Unusual behavior pattern detected",
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function LoggingStatusBadge({
  status,
  size = "default",
}: {
  status: LoggingStatus;
  size?: "sm" | "default" | "lg";
}) {
  const config = loggingStatusConfig[status];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    default: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2",
  };

  return (
    <Badge
      className={cn(
        "font-medium border-0 flex items-center gap-1.5",
        config.bgColor,
        config.color,
        sizeClasses[size],
      )}
    >
      <Icon className={cn(size === "lg" ? "h-5 w-5" : "h-4 w-4")} />
      {config.label}
    </Badge>
  );
}

function SeverityBadge({
  severity,
  size = "default",
}: {
  severity: LogSeverity;
  size?: "sm" | "default";
}) {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium flex items-center gap-1",
        config.bgColor,
        config.color,
        size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1",
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </Badge>
  );
}

function SourceBadge({ source }: { source: LogSource }) {
  const config = sourceConfig[source];
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-1.5 text-xs", config.color)}>
      <Icon className="h-3.5 w-3.5" />
      <span>{config.label}</span>
    </div>
  );
}

function StatusIndicator({ status }: { status: LogStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-1.5 text-xs", config.color)}>
      <Icon className="h-3.5 w-3.5" />
      <span>{config.label}</span>
    </div>
  );
}

function CorrelationId({ id }: { id: string }) {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={copyToClipboard}
            className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {id.slice(0, 12)}...
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{id}</p>
          <p className="text-[10px] text-muted-foreground">
            {copied ? "Copied!" : "Click to copy"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

function LogStreamSection() {
  const [filter, setFilter] = useState<LogFilter>({
    severity: "all",
    source: "all",
    environment: "all",
    status: "all",
    user: "",
    searchQuery: "",
    dateFrom: "",
    dateTo: "",
  });
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const filteredLogs = logEntries.filter((log) => {
    if (filter.severity !== "all" && log.severity !== filter.severity)
      return false;
    if (filter.source !== "all" && log.source !== filter.source) return false;
    if (filter.environment !== "all" && log.environment !== filter.environment)
      return false;
    if (filter.status !== "all" && log.status !== filter.status) return false;
    if (
      filter.user &&
      !log.user.toLowerCase().includes(filter.user.toLowerCase())
    )
      return false;
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      const searchFields = [
        log.message,
        log.user,
        log.action,
        log.ipAddress,
        log.service,
      ];
      if (!searchFields.some((field) => field.toLowerCase().includes(query)))
        return false;
    }
    return true;
  });

  const handleExport = (format: "csv" | "json") => {
    toast.success(
      `Exporting ${filteredLogs.length} logs as ${format.toUpperCase()}`,
    );
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <List className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Log Stream</CardTitle>
              <Badge variant="outline" className="text-xs">
                {filteredLogs.length} events
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => handleExport("csv")}
              >
                <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => handleExport("json")}
              >
                <FileJson className="h-3.5 w-3.5 mr-1.5" />
                JSON
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={filter.searchQuery}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    searchQuery: e.target.value,
                  }))
                }
                className="pl-9 h-8 text-sm"
              />
            </div>
            <Select
              value={filter.severity}
              onValueChange={(v) =>
                setFilter((prev) => ({
                  ...prev,
                  severity: v as LogSeverity | "all",
                }))
              }
            >
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <Filter className="h-3.5 w-3.5 mr-1.5" />
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filter.source}
              onValueChange={(v) =>
                setFilter((prev) => ({
                  ...prev,
                  source: v as LogSource | "all",
                }))
              }
            >
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {Object.entries(sourceConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filter.environment}
              onValueChange={(v) =>
                setFilter((prev) => ({
                  ...prev,
                  environment: v as EnvironmentType | "all",
                }))
              }
            >
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <SelectValue placeholder="Environment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Environments</SelectItem>
                <SelectItem value="production">Production</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="development">Development</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>User / Service</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow
                  key={log.id}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedLog(log);
                    setShowDetailsDialog(true);
                  }}
                >
                  <TableCell className="font-mono text-xs">
                    {formatRelativeTime(log.timestamp)}
                  </TableCell>
                  <TableCell>
                    <SeverityBadge severity={log.severity} size="sm" />
                  </TableCell>
                  <TableCell>
                    <SourceBadge source={log.source} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{log.user}</span>
                      <span className="text-xs text-muted-foreground">
                        {log.service}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{log.action}</TableCell>
                  <TableCell>
                    <StatusIndicator status={log.status} />
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {log.ipAddress}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Log Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                Log Entry Details
                {selectedLog && (
                  <SeverityBadge severity={selectedLog.severity} size="sm" />
                )}
              </DialogTitle>
              <DialogDescription>
                {selectedLog && <CorrelationId id={selectedLog.id} />}
              </DialogDescription>
            </DialogHeader>
            {selectedLog && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Timestamp</p>
                    <p className="font-medium">
                      {formatDate(selectedLog.timestamp)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Source</p>
                    <SourceBadge source={selectedLog.source} />
                  </div>
                  <div>
                    <p className="text-muted-foreground">User</p>
                    <p className="font-medium">{selectedLog.user}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Service</p>
                    <p className="font-medium">{selectedLog.service}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Action</p>
                    <p className="font-medium">{selectedLog.action}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <StatusIndicator status={selectedLog.status} />
                  </div>
                  <div>
                    <p className="text-muted-foreground">IP Address</p>
                    <p className="font-medium font-mono">
                      {selectedLog.ipAddress}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Environment</p>
                    <Badge variant="outline" className="text-xs capitalize">
                      {selectedLog.environment}
                    </Badge>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-muted-foreground text-sm mb-2">Message</p>
                  <p className="text-sm bg-muted p-3 rounded-md">
                    {selectedLog.message}
                  </p>
                </div>

                {selectedLog.metadata && (
                  <div className="border-t pt-4">
                    <p className="text-muted-foreground text-sm mb-2">
                      Metadata
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs bg-muted p-3 rounded-md">
                      {Object.entries(selectedLog.metadata).map(
                        ([key, value]) => (
                          <div key={key}>
                            <span className="text-muted-foreground">
                              {key}:{" "}
                            </span>
                            <span className="font-mono">{value}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <p className="text-muted-foreground text-sm mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedLog.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDetailsDialog(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  if (selectedLog) {
                    navigator.clipboard.writeText(
                      JSON.stringify(selectedLog, null, 2),
                    );
                    toast.success("Log entry copied to clipboard");
                  }
                }}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy JSON
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function SecurityAlertsSection() {
  const activeAlerts = securityAlerts.filter((a) => !a.acknowledged);

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-red-500" />
            <CardTitle className="text-sm font-medium">
              Security & Anomaly Detection
            </CardTitle>
            {activeAlerts.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {activeAlerts.length} active
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" className="h-8 text-xs">
            View All
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
        <CardDescription>
          Real-time security monitoring and threat detection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {securityAlerts.map((alert) => (
          <div
            key={alert.id}
            className={cn(
              "p-4 rounded-lg border transition-colors",
              alert.acknowledged ? "border-border bg-muted/30" : "border-l-4",
              alert.severity === "critical" &&
                !alert.acknowledged &&
                "border-l-destructive bg-destructive/5",
              alert.severity === "error" &&
                !alert.acknowledged &&
                "border-l-red-500 bg-red-500/5",
              alert.severity === "warning" &&
                !alert.acknowledged &&
                "border-l-amber-500 bg-amber-500/5",
            )}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={alert.severity} size="sm" />
                  <span className="font-medium text-sm">
                    {alertTypeConfig[alert.type].label}
                  </span>
                  {!alert.acknowledged && (
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                </div>
                <p className="text-sm">{alert.message}</p>
                <p className="text-xs text-muted-foreground">{alert.details}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                  <span>Source: {alert.source}</span>
                  <span>IP: {alert.ipAddress}</span>
                  <span>{formatRelativeTime(alert.detectedAt)}</span>
                </div>
              </div>
              {!alert.acknowledged ? (
                <Button size="sm" variant="outline" className="h-7 text-xs">
                  Acknowledge
                </Button>
              ) : (
                <Badge variant="outline" className="text-xs">
                  Acknowledged
                </Badge>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function RetentionConfigSection() {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">
              Log Retention & Storage
            </CardTitle>
          </div>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <Settings className="h-3.5 w-3.5 mr-1.5" />
            Configure
          </Button>
        </div>
        <CardDescription>
          Manage retention policies and storage configuration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Retention Policy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Retention Policy</Label>
              <Badge variant="outline" className="text-xs capitalize">
                {retentionConfig.policy}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Retention Period</span>
                <span className="font-medium">
                  {retentionConfig.retentionDays} days
                </span>
              </div>
              <Slider
                defaultValue={[retentionConfig.retentionDays]}
                max={365}
                step={30}
                disabled
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>30 days</span>
                <span>365 days</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Archive Configuration</Label>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  retentionConfig.archiveEnabled
                    ? "text-emerald-500 border-emerald-500/30"
                    : "text-muted-foreground",
                )}
              >
                {retentionConfig.archiveEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Storage Type</span>
                <span className="font-medium uppercase">
                  {retentionConfig.archiveStorageType}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Compression</span>
                <span className="font-medium">
                  Level {retentionConfig.compressionLevel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SIEM Integration */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Cloud className="h-4 w-4 text-blue-500" />
              <Label className="text-sm font-medium">SIEM Integration</Label>
            </div>
            <Switch checked={retentionConfig.siemEnabled} />
          </div>
          {retentionConfig.siemEnabled && (
            <div className="p-3 rounded-md bg-muted text-xs">
              <p className="text-muted-foreground">Endpoint</p>
              <p className="font-mono break-all">
                {retentionConfig.siemEndpoint}
              </p>
            </div>
          )}
        </div>

        {/* Storage Usage */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Storage Usage</span>
            <span className="text-sm text-muted-foreground">
              {loggingHealth.storageUsed} / {loggingHealth.storageLimit}
            </span>
          </div>
          <Progress value={42.3} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            Approximately 45 days of logs remaining at current ingestion rate
          </p>
        </div>

        {/* Enterprise Features */}
        <div className="border-t pt-4">
          <div className="rounded-lg bg-muted/50 border border-border p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">
                  Enterprise Compliance Features
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Immutable audit logs with WORM (Write Once Read Many) storage
                  for compliance requirements.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span>SOC 2 Type II Ready</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span>GDPR Compliant</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span>HIPAA Compatible</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span>ISO 27001 Certified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function LogsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const status = loggingHealth.overallStatus;
  const statusInfo = loggingStatusConfig[status];

  // Calculate storage percentage
  const storagePercent =
    (parseFloat(loggingHealth.storageUsed) /
      parseFloat(loggingHealth.storageLimit)) *
    100;

  return (
    <div className="space-y-6 p-6">
      {/* ============================================================================
          HEADER SECTION
          ============================================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-card-foreground">
            Identity Operational Logs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor system events, security activity and administrative actions
            across your Identity instance.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <Building2 className="h-3 w-3 mr-1" />
            {orgContext.name}
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              "text-xs",
              orgContext.deploymentMode === "self_hosted"
                ? "text-purple-500 bg-purple-500/10"
                : "text-blue-500 bg-blue-500/10",
            )}
          >
            {orgContext.deploymentMode === "self_hosted"
              ? "Self-Hosted"
              : "SaaS"}
          </Badge>
          <LoggingStatusBadge status={status} size="sm" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Saved Filters
        </Button>
        <Button variant="outline" size="sm">
          <BarChart3 className="h-4 w-4 mr-2" />
          Analytics
        </Button>
        <Button size="sm" className="bg-accent hover:bg-accent/90">
          <Search className="h-4 w-4 mr-2" />
          Live Tail
        </Button>
      </div>

      {/* ============================================================================
          STATUS OVERVIEW BANNER
          ============================================================================ */}
      <Card className={cn("border-l-4", statusInfo.borderColor)}>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={cn("p-3 rounded-lg", statusInfo.bgColor)}>
                <Activity className={cn("h-8 w-8", statusInfo.color)} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-lg font-semibold">Logging Status</h2>
                  <LoggingStatusBadge status={status} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {statusInfo.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <p className="text-2xl font-semibold">
                  {formatNumber(loggingHealth.events24h)}
                </p>
                <p className="text-muted-foreground">Events (24h)</p>
              </div>
              <div className="text-center">
                <p
                  className={cn(
                    "text-2xl font-semibold",
                    loggingHealth.criticalEvents24h > 0
                      ? "text-destructive"
                      : "text-emerald-500",
                  )}
                >
                  {loggingHealth.criticalEvents24h}
                </p>
                <p className="text-muted-foreground">Critical</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold">
                  {loggingHealth.avgLatency}ms
                </p>
                <p className="text-muted-foreground">Avg Latency</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============================================================================
          KPI CARDS
          ============================================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          title="Total Events"
          value={formatNumber(loggingHealth.events24h)}
          subtitle="Last 24 hours"
          icon={Activity}
          variant="accent"
          trend={{ value: 12.5, isPositive: true }}
        />
        <MetricCard
          title="Critical Events"
          value={loggingHealth.criticalEvents24h.toString()}
          subtitle="Requires attention"
          icon={Siren}
          variant={
            loggingHealth.criticalEvents24h > 0 ? "destructive" : "default"
          }
        />
        <MetricCard
          title="Failed Auth"
          value={loggingHealth.failedAuthAttempts24h.toString()}
          subtitle="Login attempts"
          icon={XCircle}
          variant={
            loggingHealth.failedAuthAttempts24h > 100 ? "warning" : "default"
          }
        />
        <MetricCard
          title="Admin Actions"
          value={loggingHealth.adminActions24h.toString()}
          subtitle="Administrative events"
          icon={User}
          variant="accent"
        />
        <MetricCard
          title="Retention"
          value={`${loggingHealth.retentionDays} days`}
          subtitle="Log retention period"
          icon={Calendar}
          variant="default"
        />
        <MetricCard
          title="Storage"
          value={loggingHealth.storageUsed}
          subtitle={`of ${loggingHealth.storageLimit}`}
          icon={HardDrive}
          variant={storagePercent >= 75 ? "warning" : "default"}
        />
      </div>

      {/* ============================================================================
          MAIN CONTENT TABS
          ============================================================================ */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="bg-muted">
          <TabsTrigger value="overview" className="text-xs">
            <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="stream" className="text-xs">
            <List className="h-3.5 w-3.5 mr-1.5" />
            Log Stream
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs">
            <ShieldAlert className="h-3.5 w-3.5 mr-1.5" />
            Security Alerts
            {securityAlerts.filter((a) => !a.acknowledged).length > 0 && (
              <Badge
                variant="destructive"
                className="ml-1.5 h-4 min-w-4 px-1 text-[10px]"
              >
                {securityAlerts.filter((a) => !a.acknowledged).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="retention" className="text-xs">
            <HardDrive className="h-3.5 w-3.5 mr-1.5" />
            Retention
          </TabsTrigger>
          <TabsTrigger value="audit" className="text-xs">
            <Shield className="h-3.5 w-3.5 mr-1.5" />
            Audit Trail
          </TabsTrigger>
        </TabsList>

        {/* ============================================================================
            OVERVIEW TAB
            ============================================================================ */}
        <TabsContent value="overview" className="space-y-6">
          {/* Top Sources */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Event Sources (24h)
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {auditStats.topSources.map(({ source, count }) => {
                const config = sourceConfig[source];
                const Icon = config.icon;
                const percentage = Math.round(
                  (count / auditStats.totalEvents) * 100,
                );
                return (
                  <Card
                    key={source}
                    className="border-border hover:border-border/80 transition-colors cursor-pointer"
                    onClick={() => setActiveTab("stream")}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 rounded-md bg-muted">
                          <Icon className={cn("h-4 w-4", config.color)} />
                        </div>
                        <span className="text-2xl font-semibold">
                          {formatNumber(count)}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{config.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {percentage}% of total
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Severity Distribution */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Severity Distribution
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(auditStats.severityDistribution).map(
                ([severity, count]) => {
                  const config = severityConfig[severity as LogSeverity];
                  const Icon = config.icon;
                  const percentage = Math.round(
                    (count / auditStats.totalEvents) * 100,
                  );
                  return (
                    <Card key={severity} className="border-border">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className={cn("p-2 rounded-md", config.bgColor)}>
                            <Icon className={cn("h-4 w-4", config.color)} />
                          </div>
                          <span className="text-2xl font-semibold">
                            {formatNumber(count)}
                          </span>
                        </div>
                        <p className="text-sm font-medium">{config.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {percentage}% of events
                        </p>
                      </CardContent>
                    </Card>
                  );
                },
              )}
            </div>
          </section>

          {/* Recent Critical Events */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Recent Critical Events
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("stream")}
              >
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-2">
              {logEntries
                .filter(
                  (log) =>
                    log.severity === "critical" || log.severity === "error",
                )
                .slice(0, 3)
                .map((log) => (
                  <Card
                    key={log.id}
                    className={cn(
                      "border-l-4 transition-colors",
                      log.severity === "critical"
                        ? "border-l-destructive bg-destructive/5"
                        : "border-l-red-500 bg-red-500/5",
                    )}
                  >
                    <CardContent className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <SeverityBadge severity={log.severity} size="sm" />
                        <div>
                          <p className="text-sm font-medium">{log.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {log.source} • {log.user} •{" "}
                            {formatRelativeTime(log.timestamp)}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </section>
        </TabsContent>

        {/* ============================================================================
            LOG STREAM TAB
            ============================================================================ */}
        <TabsContent value="stream" className="space-y-6">
          <LogStreamSection />
        </TabsContent>

        {/* ============================================================================
            SECURITY TAB
            ============================================================================ */}
        <TabsContent value="security" className="space-y-6">
          <SecurityAlertsSection />
        </TabsContent>

        {/* ============================================================================
            RETENTION TAB
            ============================================================================ */}
        <TabsContent value="retention" className="space-y-6">
          <RetentionConfigSection />
        </TabsContent>

        {/* ============================================================================
            AUDIT TAB
            ============================================================================ */}
        <TabsContent value="audit" className="space-y-6">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-violet-500" />
                <CardTitle className="text-sm font-medium">
                  Audit Trail Integrity
                </CardTitle>
              </div>
              <CardDescription>
                Immutable audit logs for compliance and forensic investigation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <Lock className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">Tamper-Proof</h4>
                      <p className="text-xs text-muted-foreground">
                        Cryptographically signed
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    All audit events are cryptographically signed to ensure
                    integrity and prevent tampering.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <History className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">Chain of Custody</h4>
                      <p className="text-xs text-muted-foreground">
                        Complete traceability
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Every event includes actor, timestamp, IP address, and
                    correlation ID for complete traceability.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-violet-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">Export Ready</h4>
                      <p className="text-xs text-muted-foreground">
                        Compliance reports
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Generate compliance-ready audit reports for SOC 2, ISO
                    27001, and GDPR requirements.
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Recent Administrative Actions</h4>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Export Report
                  </Button>
                </div>
                <div className="space-y-2">
                  {logEntries
                    .filter((log) => log.source === "audit")
                    .slice(0, 3)
                    .map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <SourceBadge source={log.source} />
                          <div>
                            <p className="text-sm font-medium">{log.action}</p>
                            <p className="text-xs text-muted-foreground">
                              {log.user} • {formatRelativeTime(log.timestamp)}
                            </p>
                          </div>
                        </div>
                        <StatusIndicator status={log.status} />
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ============================================================================
          ENTERPRISE POSITIONING FOOTER
          ============================================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div>
            <h4 className="font-medium text-sm">SOC 2 Ready</h4>
            <p className="text-xs text-muted-foreground">
              Comprehensive audit trails for Type II compliance
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Lock className="h-4 w-4 text-blue-500" />
          </div>
          <div>
            <h4 className="font-medium text-sm">Integrity Guaranteed</h4>
            <p className="text-xs text-muted-foreground">
              Immutable logs with cryptographic verification
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-violet-500/10">
            <Globe className="h-4 w-4 text-violet-500" />
          </div>
          <div>
            <h4 className="font-medium text-sm">SIEM Integration</h4>
            <p className="text-xs text-muted-foreground">
              Export to Splunk, Datadog, or custom endpoints
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <div>
            <h4 className="font-medium text-sm">Real-time Analytics</h4>
            <p className="text-xs text-muted-foreground">
              Sub-second latency for critical event detection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Import Copy icon that was missing
function Copy({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}
