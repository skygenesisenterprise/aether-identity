"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import {
  Plus,
  Key,
  RefreshCw,
  Settings,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Users,
  Webhook,
  Database,
  Globe,
  Zap,
  Activity,
  Shield,
  MoreHorizontal,
  Filter,
  Power,
  PowerOff,
  Edit,
  Trash2,
  Eye,
  ArrowRight,
  Download,
  Upload,
  Layers,
  BarChart3,
  TrendingUp,
  TrendingDown,
  FileJson,
  Server,
  Cloud,
  Check,
  AlertTriangle,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/dashboard/ui/card";
import { Badge } from "@/components/dashboard/ui/badge";
import { Button } from "@/components/dashboard/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/dashboard/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/dashboard/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dashboard/ui/dropdown-menu";
import { Label } from "@/components/dashboard/ui/label";

import { Switch } from "@/components/dashboard/ui/switch";
import { Input } from "@/components/dashboard/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/dashboard/ui/tabs";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type ProvisioningType = "manual" | "scim" | "hr" | "api" | "external_idp";

type SyncMode = "push" | "pull" | "bidirectional";
type HealthStatus = "healthy" | "warning" | "error" | "unknown";
type SyncStatus = "success" | "partial" | "failed" | "running" | "scheduled";

interface ProvisioningSource {
  id: string;
  name: string;
  type: ProvisioningType;
  enabled: boolean;
  lastSync?: string;
  mode: SyncMode;
  health: HealthStatus;
  description?: string;
  endpoint?: string;
  identitiesCount?: number;
  configStatus: "configured" | "pending" | "error";
}

interface SyncActivity {
  id: string;
  sourceId: string;
  sourceName: string;
  status: SyncStatus;
  startedAt: string;
  completedAt?: string;
  identitiesCreated: number;
  identitiesUpdated: number;
  identitiesFailed: number;
  details?: string;
}

interface ProvisioningPolicy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: "assignment" | "activation" | "approval" | "security";
  config?: Record<string, unknown>;
}

// ============================================================================
// MOCK DATA - Provisioning Sources
// ============================================================================

const provisioningSources: ProvisioningSource[] = [
  {
    id: "src-001",
    name: "Okta Directory",
    type: "scim",
    enabled: true,
    lastSync: "2024-01-15T09:30:00Z",
    mode: "bidirectional",
    health: "healthy",
    description: "Primary identity provider for SSO and user provisioning",
    endpoint: "https://acme.okta.com/scim/v2",
    identitiesCount: 2847,
    configStatus: "configured",
  },
  {
    id: "src-002",
    name: "Workday HR",
    type: "hr",
    enabled: true,
    lastSync: "2024-01-15T08:00:00Z",
    mode: "pull",
    health: "healthy",
    description: "HR system for employee lifecycle management",
    endpoint: "https://workday.acme.com/api",
    identitiesCount: 2847,
    configStatus: "configured",
  },
  {
    id: "src-003",
    name: "Azure AD",
    type: "external_idp",
    enabled: true,
    lastSync: "2024-01-15T09:45:00Z",
    mode: "push",
    health: "warning",
    description: "Microsoft Entra ID integration for Microsoft ecosystem",
    endpoint: "https://graph.microsoft.com/v1.0",
    identitiesCount: 1923,
    configStatus: "configured",
  },
  {
    id: "src-004",
    name: "Custom API Gateway",
    type: "api",
    enabled: false,
    mode: "bidirectional",
    health: "unknown",
    description: "Internal API for custom identity workflows",
    endpoint: "https://api.internal.acme.com/provisioning",
    identitiesCount: 0,
    configStatus: "pending",
  },
  {
    id: "src-005",
    name: "Manual Provisioning",
    type: "manual",
    enabled: true,
    lastSync: "2024-01-15T10:15:00Z",
    mode: "push",
    health: "healthy",
    description: "Administrator-initiated identity creation",
    identitiesCount: 156,
    configStatus: "configured",
  },
  {
    id: "src-006",
    name: "BambooHR",
    type: "hr",
    enabled: false,
    mode: "pull",
    health: "error",
    description: "Secondary HR system for contractors",
    endpoint: "https://api.bamboohr.com/api/gateway.php",
    identitiesCount: 234,
    configStatus: "error",
  },
];

// ============================================================================
// MOCK DATA - Sync Activity
// ============================================================================

const syncActivities: SyncActivity[] = [
  {
    id: "sync-001",
    sourceId: "src-001",
    sourceName: "Okta Directory",
    status: "success",
    startedAt: "2024-01-15T09:30:00Z",
    completedAt: "2024-01-15T09:32:15Z",
    identitiesCreated: 3,
    identitiesUpdated: 47,
    identitiesFailed: 0,
    details: "Full synchronization completed successfully",
  },
  {
    id: "sync-002",
    sourceId: "src-002",
    sourceName: "Workday HR",
    status: "success",
    startedAt: "2024-01-15T08:00:00Z",
    completedAt: "2024-01-15T08:05:32Z",
    identitiesCreated: 2,
    identitiesUpdated: 12,
    identitiesFailed: 0,
    details: "Daily HR sync - 2 new hires, 12 updates",
  },
  {
    id: "sync-003",
    sourceId: "src-003",
    sourceName: "Azure AD",
    status: "partial",
    startedAt: "2024-01-15T09:45:00Z",
    completedAt: "2024-01-15T09:48:10Z",
    identitiesCreated: 0,
    identitiesUpdated: 89,
    identitiesFailed: 3,
    details: "3 identities failed due to missing required attributes",
  },
  {
    id: "sync-004",
    sourceId: "src-001",
    sourceName: "Okta Directory",
    status: "failed",
    startedAt: "2024-01-14T22:00:00Z",
    completedAt: "2024-01-14T22:02:45Z",
    identitiesCreated: 0,
    identitiesUpdated: 0,
    identitiesFailed: 0,
    details: "Connection timeout - Okta API rate limit exceeded",
  },
  {
    id: "sync-005",
    sourceId: "src-005",
    sourceName: "Manual Provisioning",
    status: "success",
    startedAt: "2024-01-15T10:15:00Z",
    completedAt: "2024-01-15T10:15:30Z",
    identitiesCreated: 1,
    identitiesUpdated: 0,
    identitiesFailed: 0,
    details: "Manual creation of contractor account",
  },
  {
    id: "sync-006",
    sourceId: "src-002",
    sourceName: "Workday HR",
    status: "running",
    startedAt: "2024-01-15T11:00:00Z",
    identitiesCreated: 0,
    identitiesUpdated: 0,
    identitiesFailed: 0,
    details: "Real-time sync in progress...",
  },
  {
    id: "sync-007",
    sourceId: "src-001",
    sourceName: "Okta Directory",
    status: "scheduled",
    startedAt: "2024-01-15T12:00:00Z",
    identitiesCreated: 0,
    identitiesUpdated: 0,
    identitiesFailed: 0,
    details: "Next scheduled sync in 45 minutes",
  },
];

// ============================================================================
// MOCK DATA - Provisioning Policies
// ============================================================================

const provisioningPolicies: ProvisioningPolicy[] = [
  {
    id: "policy-001",
    name: "Auto-assign Default Group",
    description:
      "Automatically assign new identities to the default organization group",
    enabled: true,
    category: "assignment",
    config: { defaultGroup: "All Users" },
  },
  {
    id: "policy-002",
    name: "Auto-activate After Provisioning",
    description:
      "Immediately activate identities after successful provisioning",
    enabled: true,
    category: "activation",
    config: { requireVerification: false },
  },
  {
    id: "policy-003",
    name: "Require Approval for Privileged",
    description:
      "Require administrator approval for privileged role assignments",
    enabled: true,
    category: "approval",
    config: { privilegedRoles: ["Admin", "SuperAdmin"] },
  },
  {
    id: "policy-004",
    name: "Auto-MFA Enforcement",
    description:
      "Automatically require MFA for all newly provisioned identities",
    enabled: false,
    category: "security",
    config: { gracePeriodDays: 7 },
  },
  {
    id: "policy-005",
    name: "External Identity Verification",
    description: "Require email verification for identities from external IdPs",
    enabled: true,
    category: "security",
    config: { externalProviders: ["Google", "GitHub"] },
  },
  {
    id: "policy-006",
    name: "Department Auto-Assignment",
    description: "Automatically assign department based on HR data attributes",
    enabled: true,
    category: "assignment",
    config: { hrSource: "Workday" },
  },
];

// ============================================================================
// CONFIGURATION & UTILITIES
// ============================================================================

const provisioningTypeConfig: Record<
  ProvisioningType,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    borderColor: string;
    description: string;
  }
> = {
  manual: {
    label: "Manual",
    icon: Users,
    color: "text-slate-600",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    description: "Administrator-initiated provisioning",
  },
  scim: {
    label: "SCIM",
    icon: FileJson,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    description: "System for Cross-domain Identity Management",
  },
  hr: {
    label: "HR System",
    icon: Database,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    description: "Human Resources system integration",
  },
  api: {
    label: "API",
    icon: Server,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    description: "Custom API-based provisioning",
  },
  external_idp: {
    label: "External IdP",
    icon: Cloud,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    description: "External Identity Provider integration",
  },
};

const syncModeConfig: Record<
  SyncMode,
  {
    label: string;
    icon: React.ElementType;
    description: string;
  }
> = {
  push: {
    label: "Push",
    icon: Upload,
    description: "Send identities to target system",
  },
  pull: {
    label: "Pull",
    icon: Download,
    description: "Import identities from source system",
  },
  bidirectional: {
    label: "Bidirectional",
    icon: ArrowRight,
    description: "Sync in both directions",
  },
};

const healthStatusConfig: Record<
  HealthStatus,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  healthy: {
    label: "Healthy",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  warning: {
    label: "Warning",
    icon: AlertCircle,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  error: {
    label: "Error",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  unknown: {
    label: "Unknown",
    icon: Clock,
    color: "text-slate-500",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
  },
};

const syncStatusConfig: Record<
  SyncStatus,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  success: {
    label: "Success",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  partial: {
    label: "Partial",
    icon: AlertCircle,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  running: {
    label: "Running",
    icon: RefreshCw,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  scheduled: {
    label: "Scheduled",
    icon: Clock,
    color: "text-slate-600",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
  },
};

const policyCategoryConfig: Record<
  ProvisioningPolicy["category"],
  {
    label: string;
    icon: React.ElementType;
    color: string;
  }
> = {
  assignment: {
    label: "Assignment",
    icon: Layers,
    color: "text-blue-600",
  },
  activation: {
    label: "Activation",
    icon: Power,
    color: "text-emerald-600",
  },
  approval: {
    label: "Approval",
    icon: Check,
    color: "text-amber-600",
  },
  security: {
    label: "Security",
    icon: Shield,
    color: "text-purple-600",
  },
};

function formatRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toISOString().split("T")[0];
}

function formatDuration(startedAt: string, completedAt?: string): string {
  if (!completedAt) return "In progress";
  const start = new Date(startedAt);
  const end = new Date(completedAt);
  const diffMs = end.getTime() - start.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return `${diffSecs}s`;
  return `${diffMins}m ${diffSecs % 60}s`;
}

// ============================================================================
// UI COMPONENTS
// ============================================================================

function SectionHeader({
  title,
  description,
  icon: Icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: React.ElementType;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ElementType;
  };
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {action.icon && <action.icon className="h-3.5 w-3.5" />}
          {action.label}
        </button>
      )}
    </div>
  );
}

function TypeBadge({ type }: { type: ProvisioningType }) {
  const config = provisioningTypeConfig[type];
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        config.bgColor,
        config.color,
        config.borderColor,
      )}
      title={config.description}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

function ModeBadge({ mode }: { mode: SyncMode }) {
  const config = syncModeConfig[mode];
  const Icon = config.icon;
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground border border-border">
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

function HealthBadge({ health }: { health: HealthStatus }) {
  const config = healthStatusConfig[health];
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border",
        config.bgColor,
        config.color,
        config.borderColor,
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

function SyncStatusBadge({ status }: { status: SyncStatus }) {
  const config = syncStatusConfig[status];
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        config.bgColor,
        config.color,
        config.borderColor,
      )}
    >
      <Icon
        className={cn("h-3.5 w-3.5", status === "running" && "animate-spin")}
      />
      {config.label}
    </span>
  );
}

function ConfigStatusBadge({
  status,
}: {
  status: ProvisioningSource["configStatus"];
}) {
  const config = {
    configured: {
      label: "Configured",
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    pending: {
      label: "Pending",
      color: "bg-amber-100 text-amber-700 border-amber-200",
    },
    error: {
      label: "Error",
      color: "bg-red-100 text-red-700 border-red-200",
    },
  };

  return (
    <Badge
      variant="outline"
      className={cn("text-[10px] px-1.5 py-0", config[status].color)}
    >
      {config[status].label}
    </Badge>
  );
}

function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  badge,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: {
    value: string | number;
    isPositive: boolean;
    label: string;
  };
  variant?: "default" | "success" | "warning" | "danger" | "info";
  badge?: { label: string; variant: "success" | "warning" | "danger" };
}) {
  const variantStyles = {
    default: {
      iconBg: "bg-muted",
      iconColor: "text-muted-foreground",
      valueColor: "text-foreground",
    },
    success: {
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-600",
    },
    warning: {
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      valueColor: "text-amber-600",
    },
    danger: {
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      valueColor: "text-red-600",
    },
    info: {
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      valueColor: "text-blue-600",
    },
  };

  const styles = variantStyles[variant];
  const TrendIcon = trend?.isPositive ? TrendingUp : TrendingDown;

  return (
    <Card className="border-border bg-card hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {title}
              </p>
              {badge && (
                <Badge
                  variant={
                    badge.variant === "success"
                      ? "default"
                      : badge.variant === "warning"
                        ? "secondary"
                        : "destructive"
                  }
                  className="text-[10px] px-1.5 py-0"
                >
                  {badge.label}
                </Badge>
              )}
            </div>
            <p
              className={cn(
                "text-3xl font-bold tabular-nums",
                styles.valueColor,
              )}
            >
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1">
                <TrendIcon
                  className={cn(
                    "h-3 w-3",
                    trend.isPositive ? "text-emerald-600" : "text-red-600",
                  )}
                />
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.isPositive ? "text-emerald-600" : "text-red-600",
                  )}
                >
                  {trend.isPositive ? "+" : "-"}
                  {trend.value}%
                </span>
                <span className="text-xs text-muted-foreground">
                  {trend.label}
                </span>
              </div>
            )}
          </div>
          <div className={cn("rounded-lg p-2.5", styles.iconBg)}>
            <Icon className={cn("h-5 w-5", styles.iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

function ProvisioningSourcesSection() {
  const [sources, setSources] =
    useState<ProvisioningSource[]>(provisioningSources);
  const [filter, setFilter] = useState<"all" | ProvisioningType>("all");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const filteredSources = useMemo(() => {
    if (filter === "all") return sources;
    return sources.filter((s) => s.type === filter);
  }, [filter, sources]);

  const handleToggleEnabled = (sourceId: string) => {
    setSources((prev) =>
      prev.map((s) => (s.id === sourceId ? { ...s, enabled: !s.enabled } : s)),
    );
  };

  const stats = useMemo(() => {
    const total = sources.length;
    const enabled = sources.filter((s) => s.enabled).length;
    const healthy = sources.filter(
      (s) => s.health === "healthy" && s.enabled,
    ).length;
    const warning = sources.filter(
      (s) => s.health === "warning" && s.enabled,
    ).length;
    const error = sources.filter(
      (s) => s.health === "error" || s.configStatus === "error",
    ).length;
    const totalIdentities = sources.reduce(
      (sum, s) => sum + (s.identitiesCount || 0),
      0,
    );

    return { total, enabled, healthy, warning, error, totalIdentities };
  }, [sources]);

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Provisioning Sources"
        description="Configure and manage identity provisioning connectors"
        icon={Layers}
        action={{
          label: "Add Source",
          onClick: () => setShowAddDialog(true),
          icon: Plus,
        }}
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground mr-2">
          Filter by type:
        </span>
        {["all", "scim", "hr", "api", "external_idp", "manual"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as "all" | ProvisioningType)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border capitalize",
              filter === f
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card hover:bg-muted/50 border-border text-muted-foreground",
            )}
          >
            {f}
            {f !== "all" && (
              <span
                className={cn(
                  "ml-1 px-1.5 py-0.5 rounded-full text-[10px]",
                  filter === f ? "bg-primary-foreground/20" : "bg-muted",
                )}
              >
                {sources.filter((s) => s.type === f).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-3 rounded-lg bg-muted/50 border">
          <p className="text-xs text-muted-foreground">Total Sources</p>
          <p className="text-xl font-bold">{stats.total}</p>
        </div>
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
          <p className="text-xs text-emerald-600">Enabled</p>
          <p className="text-xl font-bold text-emerald-700">{stats.enabled}</p>
        </div>
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
          <p className="text-xs text-emerald-600">Healthy</p>
          <p className="text-xl font-bold text-emerald-700">{stats.healthy}</p>
        </div>
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
          <p className="text-xs text-amber-600">Warning</p>
          <p className="text-xl font-bold text-amber-700">{stats.warning}</p>
        </div>
        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
          <p className="text-xs text-red-600">Errors</p>
          <p className="text-xl font-bold text-red-700">{stats.error}</p>
        </div>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredSources.map((source) => {
          const typeConfig = provisioningTypeConfig[source.type];
          const TypeIcon = typeConfig.icon;

          return (
            <Card
              key={source.id}
              className={cn(
                "border-2 transition-all duration-200",
                source.enabled
                  ? "border-border hover:border-primary/50 hover:shadow-md"
                  : "border-dashed border-border/50 opacity-75",
              )}
            >
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center",
                        source.enabled ? typeConfig.bgColor : "bg-muted",
                      )}
                    >
                      <TypeIcon
                        className={cn(
                          "h-5 w-5",
                          source.enabled
                            ? typeConfig.color
                            : "text-muted-foreground",
                        )}
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm truncate">
                        {source.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <TypeBadge type={source.type} />
                        {!source.enabled && (
                          <Badge variant="outline" className="text-[10px]">
                            Disabled
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleEnabled(source.id)}
                      className={cn(
                        "p-1.5 rounded-md transition-colors",
                        source.enabled
                          ? "hover:bg-emerald-100 text-emerald-600"
                          : "hover:bg-slate-100 text-slate-400",
                      )}
                      title={source.enabled ? "Disable" : "Enable"}
                    >
                      {source.enabled ? (
                        <Power className="h-4 w-4" />
                      ) : (
                        <PowerOff className="h-4 w-4" />
                      )}
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1.5 hover:bg-muted rounded-md transition-colors">
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="cursor-pointer">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Configuration
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Trigger Sync
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Source
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Description */}
                {source.description && (
                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                    {source.description}
                  </p>
                )}

                {/* Status Row */}
                <div className="flex items-center justify-between mb-4">
                  <HealthBadge health={source.health} />
                  <ModeBadge mode={source.mode} />
                  <ConfigStatusBadge status={source.configStatus} />
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Identities</p>
                    <p className="text-lg font-semibold">
                      {source.identitiesCount?.toLocaleString() || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Last Sync</p>
                    <p className="text-sm font-medium">
                      {formatRelativeTime(source.lastSync)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredSources.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border rounded-lg">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Filter className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">
            No sources found
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Try adjusting your filter or add a new provisioning source.
          </p>
        </div>
      )}

      {/* Add Source Dialog */}
      <AddProvisioningSourceDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </section>
  );
}

function SyncActivitySection() {
  const [activities] = useState<SyncActivity[]>(syncActivities);
  const [filter, setFilter] = useState<"all" | SyncStatus>("all");

  const filteredActivities = useMemo(() => {
    if (filter === "all") return activities;
    return activities.filter((a) => a.status === filter);
  }, [filter, activities]);

  const stats = useMemo(() => {
    const total = activities.length;
    const success = activities.filter((a) => a.status === "success").length;
    const failed = activities.filter((a) => a.status === "failed").length;
    const running = activities.filter((a) => a.status === "running").length;

    const totalCreated = activities.reduce(
      (sum, a) => sum + a.identitiesCreated,
      0,
    );
    const totalUpdated = activities.reduce(
      (sum, a) => sum + a.identitiesUpdated,
      0,
    );
    const totalFailed = activities.reduce(
      (sum, a) => sum + a.identitiesFailed,
      0,
    );

    return {
      total,
      success,
      failed,
      running,
      totalCreated,
      totalUpdated,
      totalFailed,
    };
  }, [activities]);

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Sync Activity"
        description="Recent synchronization operations and their status"
        icon={Activity}
        action={{
          label: "View All",
          onClick: () => {},
          icon: ArrowRight,
        }}
      />

      {/* Activity Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
          <p className="text-xs text-emerald-600">Created</p>
          <p className="text-2xl font-bold text-emerald-700">
            {stats.totalCreated}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-xs text-blue-600">Updated</p>
          <p className="text-2xl font-bold text-blue-700">
            {stats.totalUpdated}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
          <p className="text-xs text-red-600">Failed</p>
          <p className="text-2xl font-bold text-red-700">{stats.totalFailed}</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/50 border">
          <p className="text-xs text-muted-foreground">Success Rate</p>
          <p className="text-2xl font-bold">
            {stats.total > 0
              ? Math.round((stats.success / stats.total) * 100)
              : 0}
            %
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground mr-2">
          Filter by status:
        </span>
        {["all", "success", "partial", "failed", "running", "scheduled"].map(
          (f) => (
            <button
              key={f}
              onClick={() => setFilter(f as "all" | SyncStatus)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border capitalize",
                filter === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card hover:bg-muted/50 border-border text-muted-foreground",
              )}
            >
              {f}
              {f !== "all" && (
                <span
                  className={cn(
                    "ml-1 px-1.5 py-0.5 rounded-full text-[10px]",
                    filter === f ? "bg-primary-foreground/20" : "bg-muted",
                  )}
                >
                  {activities.filter((a) => a.status === f).length}
                </span>
              )}
            </button>
          ),
        )}
      </div>

      {/* Activity Table */}
      <Card className="border-border">
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredActivities.slice(0, 10).map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="shrink-0">
                  <SyncStatusBadge status={activity.status} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{activity.sourceName}</p>
                    <span className="text-xs text-muted-foreground font-mono">
                      {activity.id}
                    </span>
                  </div>
                  {activity.details && (
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.details}
                    </p>
                  )}
                </div>

                <div className="hidden md:flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="font-semibold text-emerald-600">
                      +{activity.identitiesCreated}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Created</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-blue-600">
                      ~{activity.identitiesUpdated}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Updated</p>
                  </div>
                  {activity.identitiesFailed > 0 && (
                    <div className="text-center">
                      <p className="font-semibold text-red-600">
                        !{activity.identitiesFailed}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Failed
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-right text-sm">
                  <p className="text-muted-foreground">
                    {formatRelativeTime(activity.startedAt)}
                  </p>
                  {activity.completedAt && (
                    <p className="text-xs text-muted-foreground">
                      Duration:{" "}
                      {formatDuration(activity.startedAt, activity.completedAt)}
                    </p>
                  )}
                </div>

                <div className="shrink-0">
                  <button className="p-1.5 hover:bg-muted rounded-md transition-colors">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredActivities.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Activity className="h-6 w-6 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium text-foreground">
                No activity found
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try adjusting your filter
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function ProvisioningPoliciesSection() {
  const [policies, setPolicies] =
    useState<ProvisioningPolicy[]>(provisioningPolicies);
  const [showConfigDialog, setShowConfigDialog] = useState(false);

  const handleToggleEnabled = (policyId: string) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === policyId ? { ...p, enabled: !p.enabled } : p)),
    );
  };

  const stats = useMemo(() => {
    const total = policies.length;
    const enabled = policies.filter((p) => p.enabled).length;
    const byCategory = policies.reduce(
      (acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return { total, enabled, byCategory };
  }, [policies]);

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Provisioning Policies"
        description="Automated rules for identity provisioning and management"
        icon={Shield}
        action={{
          label: "Configure",
          onClick: () => setShowConfigDialog(true),
          icon: Settings,
        }}
      />

      {/* Policy Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(policyCategoryConfig).map(([category, config]) => {
          const Icon = config.icon;
          const count = stats.byCategory[category] || 0;
          const enabledCount = policies.filter(
            (p) => p.category === category && p.enabled,
          ).length;

          return (
            <div
              key={category}
              className="p-3 rounded-lg bg-muted/50 border flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Icon className={cn("h-4 w-4", config.color)} />
                <span className="text-sm font-medium">{config.label}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="font-semibold text-emerald-600">
                  {enabledCount}
                </span>
                <span>/</span>
                <span>{count}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {policies.map((policy) => {
          const categoryConfig = policyCategoryConfig[policy.category];
          const CategoryIcon = categoryConfig.icon;

          return (
            <Card
              key={policy.id}
              className={cn(
                "border-2 transition-all duration-200",
                policy.enabled
                  ? "border-border hover:border-primary/50"
                  : "border-dashed border-border/50 opacity-75",
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center",
                        policy.enabled ? "bg-primary/10" : "bg-muted",
                      )}
                    >
                      <CategoryIcon
                        className={cn(
                          "h-5 w-5",
                          policy.enabled
                            ? categoryConfig.color
                            : "text-muted-foreground",
                        )}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{policy.name}</h3>
                        {!policy.enabled && (
                          <Badge variant="outline" className="text-[10px]">
                            Disabled
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {policy.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-[10px]">
                          {categoryConfig.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={policy.enabled}
                    onCheckedChange={() => handleToggleEnabled(policy.id)}
                  />
                </div>

                {/* Configuration Preview */}
                {policy.enabled && policy.config && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Configuration:
                      </span>
                      <button className="text-primary hover:text-primary/80 font-medium">
                        Edit
                      </button>
                    </div>
                    <div className="mt-2 p-2 rounded bg-muted/50 font-mono text-[10px] text-muted-foreground overflow-x-auto">
                      {JSON.stringify(policy.config, null, 2)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Configure Policies Dialog */}
      <ConfigurePoliciesDialog
        open={showConfigDialog}
        onOpenChange={setShowConfigDialog}
        policies={policies}
        onToggleEnabled={handleToggleEnabled}
      />
    </section>
  );
}

// ============================================================================
// DIALOG COMPONENTS
// ============================================================================

function AddProvisioningSourceDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [selectedType, setSelectedType] = useState<ProvisioningType | null>(
    null,
  );

  const sourceTypes: { type: ProvisioningType; comingSoon?: boolean }[] = [
    { type: "scim" },
    { type: "hr" },
    { type: "external_idp" },
    { type: "api" },
    { type: "manual" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Provisioning Source
          </DialogTitle>
          <DialogDescription>
            Choose a provisioning source type to connect to your identity
            system.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {sourceTypes.map(({ type, comingSoon }) => {
            const config = provisioningTypeConfig[type];
            const Icon = config.icon;

            return (
              <button
                key={type}
                onClick={() => !comingSoon && setSelectedType(type)}
                disabled={comingSoon}
                className={cn(
                  "relative p-4 rounded-lg border-2 text-left transition-all",
                  comingSoon
                    ? "opacity-50 cursor-not-allowed border-dashed"
                    : selectedType === type
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/50",
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center",
                      config.bgColor,
                    )}
                  >
                    <Icon className={cn("h-5 w-5", config.color)} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{config.label}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {config.description}
                    </p>
                  </div>
                </div>
                {comingSoon && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
                    <Badge variant="secondary">Coming Soon</Badge>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!selectedType}
            onClick={() => {
              console.log("Creating source:", selectedType);
              onOpenChange(false);
            }}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ConfigurePoliciesDialog({
  open,
  onOpenChange,
  policies,
  onToggleEnabled,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policies: ProvisioningPolicy[];
  onToggleEnabled: (id: string) => void;
}) {
  const [activeTab, setActiveTab] =
    useState<ProvisioningPolicy["category"]>("assignment");

  const filteredPolicies = policies.filter((p) => p.category === activeTab);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configure Provisioning Policies
          </DialogTitle>
          <DialogDescription>
            Manage automated rules for identity provisioning and lifecycle
            management.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) =>
            setActiveTab(v as ProvisioningPolicy["category"])
          }
          className="mt-4"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="assignment" className="text-xs">
              <Layers className="h-3.5 w-3.5 mr-1.5" />
              Assignment
            </TabsTrigger>
            <TabsTrigger value="activation" className="text-xs">
              <Power className="h-3.5 w-3.5 mr-1.5" />
              Activation
            </TabsTrigger>
            <TabsTrigger value="approval" className="text-xs">
              <Check className="h-3.5 w-3.5 mr-1.5" />
              Approval
            </TabsTrigger>
            <TabsTrigger value="security" className="text-xs">
              <Shield className="h-3.5 w-3.5 mr-1.5" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-4">
            {filteredPolicies.map((policy) => (
              <div
                key={policy.id}
                className="flex items-start justify-between p-4 rounded-lg border"
              >
                <div>
                  <h4 className="font-medium text-sm">{policy.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {policy.description}
                  </p>
                  {policy.config && (
                    <div className="mt-2 p-2 rounded bg-muted/50 font-mono text-[10px] text-muted-foreground">
                      {JSON.stringify(policy.config, null, 2)}
                    </div>
                  )}
                </div>
                <Switch
                  checked={policy.enabled}
                  onCheckedChange={() => onToggleEnabled(policy.id)}
                />
              </div>
            ))}

            {filteredPolicies.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No policies in this category
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function ProvisioningPage() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);

  const stats = useMemo(() => {
    const totalSources = provisioningSources.length;
    const activeSources = provisioningSources.filter((s) => s.enabled).length;
    const totalIdentities = provisioningSources.reduce(
      (sum, s) => sum + (s.identitiesCount || 0),
      0,
    );
    const recentSyncs = syncActivities.filter(
      (a) => a.status === "success" || a.status === "running",
    ).length;

    return { totalSources, activeSources, totalIdentities, recentSyncs };
  }, []);

  return (
    <div className="space-y-8">
      {/* ==========================================================================
          HEADER SECTION
          ========================================================================== */}
      <section className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Identity Organization Provisioning
              </h1>
              <Badge variant="secondary" className="text-xs">
                {stats.activeSources} active
              </Badge>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Configure how identities are created, synchronized and managed
              across the organization. Connect external systems, set up
              automation policies, and monitor provisioning activity.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" onClick={() => setShowApiKeyDialog(true)}>
              <Key className="h-4 w-4 mr-2" />
              Generate API Key
            </Button>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Source
            </Button>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          KPI SECTION
          ========================================================================== */}
      <section className="space-y-4">
        <SectionHeader
          title="Overview"
          description="Provisioning system metrics and health"
          icon={BarChart3}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Total Sources"
            value={stats.totalSources}
            subtitle={`${stats.activeSources} enabled`}
            icon={Layers}
            variant="default"
          />
          <KpiCard
            title="Active Sync"
            value={stats.activeSources}
            subtitle="Sources running"
            icon={RefreshCw}
            variant="success"
          />
          <KpiCard
            title="Total Identities"
            value={stats.totalIdentities.toLocaleString()}
            subtitle="Across all sources"
            icon={Users}
            variant="info"
          />
          <KpiCard
            title="Recent Syncs"
            value={stats.recentSyncs}
            subtitle="Last 24 hours"
            icon={Activity}
            variant="default"
          />
        </div>
      </section>

      {/* ==========================================================================
          PROVISIONING SOURCES SECTION
          ========================================================================== */}
      <ProvisioningSourcesSection />

      {/* ==========================================================================
          SYNC ACTIVITY SECTION
          ========================================================================== */}
      <SyncActivitySection />

      {/* ==========================================================================
          PROVISIONING POLICIES SECTION
          ========================================================================== */}
      <ProvisioningPoliciesSection />

      {/* ==========================================================================
          INTEGRATION PREVIEW SECTION
          ========================================================================== */}
      <section className="space-y-4">
        <SectionHeader
          title="Future Integrations"
          description="Upcoming provisioning capabilities"
          icon={Workflow}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "SCIM 2.0",
              description:
                "Full SCIM protocol support for automated provisioning",
              icon: FileJson,
              status: "ready" as const,
            },
            {
              title: "Webhooks",
              description: "Real-time event-driven provisioning",
              icon: Webhook,
              status: "soon" as const,
            },
            {
              title: "Event Engine",
              description: "Event-driven identity lifecycle automation",
              icon: Zap,
              status: "soon" as const,
            },
            {
              title: "Multi-Region",
              description: "Global provisioning across regions",
              icon: Globe,
              status: "planned" as const,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.title}
                className="border-dashed border-2 border-border/50 bg-muted/20"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{item.title}</h3>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px]",
                            item.status === "ready"
                              ? "text-emerald-600 border-emerald-200"
                              : item.status === "soon"
                                ? "text-amber-600 border-amber-200"
                                : "text-slate-500 border-slate-200",
                          )}
                        >
                          {item.status === "ready"
                            ? "Ready"
                            : item.status === "soon"
                              ? "Soon"
                              : "Planned"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Dialogs */}
      <AddProvisioningSourceDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />

      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Generate API Key
            </DialogTitle>
            <DialogDescription>
              Create a new API key for programmatic access to the provisioning
              API.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="key-name">Key Name</Label>
              <Input
                id="key-name"
                placeholder="e.g., Production SCIM Integration"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="key-scope">Scope</Label>
              <Select>
                <SelectTrigger id="key-scope">
                  <SelectValue placeholder="Select permissions scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="read">Read Only</SelectItem>
                  <SelectItem value="write">Read & Write</SelectItem>
                  <SelectItem value="admin">Full Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                <p className="text-xs text-amber-800">
                  API keys provide programmatic access to your identity system.
                  Store them securely and never expose them in client-side code.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApiKeyDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setShowApiKeyDialog(false)}>
              Generate Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
