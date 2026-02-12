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
  DialogTrigger,
} from "@/components/dashboard/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/dashboard/ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/dashboard/ui/tabs";
import { Switch } from "@/components/dashboard/ui/switch";
import { Label } from "@/components/dashboard/ui/label";
import { Slider } from "@/components/dashboard/ui/slider";
import { Input } from "@/components/dashboard/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/dashboard/ui/tooltip";
import {
  Archive,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Cloud,
  Database,
  Download,
  FileText,
  HardDrive,
  History,
  Info,
  Key,
  Lock,
  Play,
  RefreshCw,
  RotateCcw,
  Server,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";

// ============================================================================
// TYPES - Enterprise Backup Management System
// ============================================================================

type DeploymentMode = "saas_cloud" | "self_hosted" | "hybrid";
type PlanTier = "free" | "pro" | "enterprise";
type EnvironmentType = "production" | "staging" | "development";
type BackupStatus =
  | "success"
  | "failed"
  | "partial"
  | "in_progress"
  | "pending";
type BackupType = "automated" | "manual" | "snapshot" | "incremental" | "full";
type StorageType =
  | "s3"
  | "s3_compatible"
  | "azure_blob"
  | "gcs"
  | "local"
  | "nfs";
type EncryptionLevel = "platform_managed" | "customer_managed" | "none";
type RetentionPolicy = "standard" | "extended" | "compliance" | "custom";

interface OrganizationContext {
  id: string;
  name: string;
  plan: PlanTier;
  environment: EnvironmentType;
  region: string;
  deploymentMode: DeploymentMode;
}

interface BackupHealth {
  overallStatus: "healthy" | "degraded" | "critical";
  lastBackupAt: string;
  nextBackupAt: string;
  successRate7d: number;
  totalBackups: number;
  failedBackups24h: number;
  averageSize: string;
  storageUsed: string;
  storageLimit: string;
}

interface BackupRecord {
  id: string;
  name: string;
  type: BackupType;
  status: BackupStatus;
  environment: EnvironmentType;
  size: string;
  sizeBytes: number;
  duration: string;
  durationSeconds: number;
  startedAt: string;
  completedAt?: string;
  encryption: EncryptionLevel;
  integrity: "verified" | "pending" | "failed";
  storageLocation: string;
  retentionDays: number;
  metadata: {
    tables?: number;
    indexes?: number;
    checksum: string;
  };
  tags: string[];
}

interface BackupSchedule {
  id: string;
  name: string;
  enabled: boolean;
  frequency: "hourly" | "daily" | "weekly" | "custom";
  cronExpression?: string;
  time: string;
  timezone: string;
  type: BackupType;
  retentionPolicy: RetentionPolicy;
  retentionDays: number;
  maxVersions: number;
  notifyOnFailure: boolean;
  notifyEmails: string[];
  environments: EnvironmentType[];
}

interface StorageConfiguration {
  type: StorageType;
  enabled: boolean;
  bucket?: string;
  region?: string;
  endpoint?: string;
  path?: string;
  encryptionAtRest: boolean;
  compressionEnabled: boolean;
  compressionLevel: number;
  connectionTested: boolean;
  lastTestedAt?: string;
  credentials: {
    type: "iam_role" | "access_key" | "managed_identity" | "none";
    lastRotated?: string;
  };
}

interface RestoreJob {
  id: string;
  backupId: string;
  status: "pending" | "in_progress" | "completed" | "failed" | "cancelled";
  startedAt: string;
  completedAt?: string;
  targetEnvironment: EnvironmentType;
  mode: "full" | "partial";
  progress: number;
  logs: RestoreLog[];
}

interface RestoreLog {
  timestamp: string;
  level: "info" | "warning" | "error";
  message: string;
}

interface AlertRule {
  id: string;
  name: string;
  type:
    | "backup_failure"
    | "restore_failure"
    | "storage_threshold"
    | "integrity_failure";
  severity: "critical" | "high" | "medium" | "low";
  enabled: boolean;
  condition: string;
  channels: ("email" | "webhook" | "slack" | "pagerduty")[];
  lastTriggered?: string;
}

interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action:
    | "backup_created"
    | "backup_deleted"
    | "restore_initiated"
    | "restore_completed"
    | "config_changed"
    | "schedule_modified";
  target: string;
  correlationId: string;
  result: "success" | "failure" | "denied";
  ipAddress?: string;
}

// ============================================================================
// MOCK DATA - Enterprise Backup Context
// ============================================================================

const orgContext: OrganizationContext = {
  id: "org_2vPqN7xYz",
  name: "Acme Corporation",
  plan: "enterprise",
  environment: "production",
  region: "us-east-1",
  deploymentMode: "saas_cloud",
};

const backupHealth: BackupHealth = {
  overallStatus: "healthy",
  lastBackupAt: "2026-02-12T10:00:00Z",
  nextBackupAt: "2026-02-12T16:00:00Z",
  successRate7d: 99.2,
  totalBackups: 1247,
  failedBackups24h: 0,
  averageSize: "2.3 GB",
  storageUsed: "847 GB",
  storageLimit: "2 TB",
};

const backupHistory: BackupRecord[] = [
  {
    id: "bkp_001",
    name: "Auto-Backup Production DB",
    type: "automated",
    status: "success",
    environment: "production",
    size: "2.4 GB",
    sizeBytes: 2576980378,
    duration: "3m 42s",
    durationSeconds: 222,
    startedAt: "2026-02-12T10:00:00Z",
    completedAt: "2026-02-12T10:03:42Z",
    encryption: "platform_managed",
    integrity: "verified",
    storageLocation: "s3://aether-backups-prod/us-east-1",
    retentionDays: 35,
    metadata: {
      tables: 127,
      indexes: 342,
      checksum: "sha256:a1b2c3d4e5f6",
    },
    tags: ["automated", "production", "daily"],
  },
  {
    id: "bkp_002",
    name: "Manual Pre-Deployment",
    type: "manual",
    status: "success",
    environment: "production",
    size: "2.4 GB",
    sizeBytes: 2576980378,
    duration: "4m 12s",
    durationSeconds: 252,
    startedAt: "2026-02-12T08:30:00Z",
    completedAt: "2026-02-12T08:34:12Z",
    encryption: "platform_managed",
    integrity: "verified",
    storageLocation: "s3://aether-backups-prod/us-east-1",
    retentionDays: 90,
    metadata: {
      tables: 127,
      indexes: 342,
      checksum: "sha256:b2c3d4e5f6g7",
    },
    tags: ["manual", "production", "pre-deployment"],
  },
  {
    id: "bkp_003",
    name: "Auto-Backup Staging DB",
    type: "automated",
    status: "success",
    environment: "staging",
    size: "456 MB",
    sizeBytes: 478150656,
    duration: "1m 18s",
    durationSeconds: 78,
    startedAt: "2026-02-12T04:00:00Z",
    completedAt: "2026-02-12T04:01:18Z",
    encryption: "platform_managed",
    integrity: "verified",
    storageLocation: "s3://aether-backups-staging/us-east-1",
    retentionDays: 14,
    metadata: {
      tables: 127,
      indexes: 342,
      checksum: "sha256:c3d4e5f6g7h8",
    },
    tags: ["automated", "staging", "daily"],
  },
  {
    id: "bkp_004",
    name: "Weekly Full Backup",
    type: "full",
    status: "in_progress",
    environment: "production",
    size: "2.4 GB",
    sizeBytes: 2576980378,
    duration: "2m 15s",
    durationSeconds: 135,
    startedAt: "2026-02-12T10:45:00Z",
    encryption: "platform_managed",
    integrity: "pending",
    storageLocation: "s3://aether-backups-prod/us-east-1",
    retentionDays: 90,
    metadata: {
      tables: 127,
      indexes: 342,
      checksum: "pending",
    },
    tags: ["weekly", "production", "full"],
  },
  {
    id: "bkp_005",
    name: "Auto-Backup Production DB",
    type: "automated",
    status: "failed",
    environment: "production",
    size: "0 B",
    sizeBytes: 0,
    duration: "5m 00s",
    durationSeconds: 300,
    startedAt: "2026-02-11T22:00:00Z",
    completedAt: "2026-02-11T22:05:00Z",
    encryption: "platform_managed",
    integrity: "failed",
    storageLocation: "s3://aether-backups-prod/us-east-1",
    retentionDays: 35,
    metadata: {
      tables: 0,
      indexes: 0,
      checksum: "failed",
    },
    tags: ["automated", "production", "failed"],
  },
  {
    id: "bkp_006",
    name: "Incremental Snapshot",
    type: "incremental",
    status: "success",
    environment: "production",
    size: "145 MB",
    sizeBytes: 152043520,
    duration: "45s",
    durationSeconds: 45,
    startedAt: "2026-02-11T16:00:00Z",
    completedAt: "2026-02-11T16:00:45Z",
    encryption: "platform_managed",
    integrity: "verified",
    storageLocation: "s3://aether-backups-prod/us-east-1",
    retentionDays: 35,
    metadata: {
      tables: 127,
      indexes: 342,
      checksum: "sha256:d4e5f6g7h8i9",
    },
    tags: ["incremental", "production", "6h"],
  },
  {
    id: "bkp_007",
    name: "Compliance Archive Q4",
    type: "snapshot",
    status: "success",
    environment: "production",
    size: "2.1 GB",
    sizeBytes: 2254857830,
    duration: "8m 30s",
    durationSeconds: 510,
    startedAt: "2026-02-10T02:00:00Z",
    completedAt: "2026-02-10T02:08:30Z",
    encryption: "customer_managed",
    integrity: "verified",
    storageLocation: "s3://aether-compliance-archive/us-east-1",
    retentionDays: 2555,
    metadata: {
      tables: 127,
      indexes: 342,
      checksum: "sha256:e5f6g7h8i9j0",
    },
    tags: ["compliance", "archive", "quarterly"],
  },
];

const backupSchedules: BackupSchedule[] = [
  {
    id: "sch_001",
    name: "Production Automated",
    enabled: true,
    frequency: "daily",
    time: "10:00",
    timezone: "UTC",
    type: "automated",
    retentionPolicy: "standard",
    retentionDays: 35,
    maxVersions: 35,
    notifyOnFailure: true,
    notifyEmails: ["ops@acme.com", "dba@acme.com"],
    environments: ["production"],
  },
  {
    id: "sch_002",
    name: "Staging Automated",
    enabled: true,
    frequency: "daily",
    time: "04:00",
    timezone: "UTC",
    type: "automated",
    retentionPolicy: "standard",
    retentionDays: 14,
    maxVersions: 14,
    notifyOnFailure: true,
    notifyEmails: ["ops@acme.com"],
    environments: ["staging"],
  },
  {
    id: "sch_003",
    name: "Weekly Full Backup",
    enabled: true,
    frequency: "weekly",
    time: "02:00",
    timezone: "UTC",
    type: "full",
    retentionPolicy: "extended",
    retentionDays: 90,
    maxVersions: 12,
    notifyOnFailure: true,
    notifyEmails: ["ops@acme.com", "dba@acme.com", "compliance@acme.com"],
    environments: ["production"],
  },
  {
    id: "sch_004",
    name: "Compliance Archive",
    enabled: true,
    frequency: "custom",
    cronExpression: "0 2 1 */3 *",
    time: "02:00",
    timezone: "UTC",
    type: "snapshot",
    retentionPolicy: "compliance",
    retentionDays: 2555,
    maxVersions: 20,
    notifyOnFailure: true,
    notifyEmails: ["compliance@acme.com", "legal@acme.com"],
    environments: ["production"],
  },
];

const storageConfigs: StorageConfiguration[] = [
  {
    type: "s3",
    enabled: true,
    bucket: "aether-backups-prod",
    region: "us-east-1",
    encryptionAtRest: true,
    compressionEnabled: true,
    compressionLevel: 6,
    connectionTested: true,
    lastTestedAt: "2026-02-12T08:00:00Z",
    credentials: {
      type: "iam_role",
      lastRotated: "2026-01-15T00:00:00Z",
    },
  },
  {
    type: "s3",
    enabled: true,
    bucket: "aether-backups-staging",
    region: "us-east-1",
    encryptionAtRest: true,
    compressionEnabled: true,
    compressionLevel: 6,
    connectionTested: true,
    lastTestedAt: "2026-02-12T08:00:00Z",
    credentials: {
      type: "iam_role",
      lastRotated: "2026-01-15T00:00:00Z",
    },
  },
  {
    type: "s3",
    enabled: true,
    bucket: "aether-compliance-archive",
    region: "us-east-1",
    encryptionAtRest: true,
    compressionEnabled: true,
    compressionLevel: 9,
    connectionTested: true,
    lastTestedAt: "2026-02-11T00:00:00Z",
    credentials: {
      type: "iam_role",
      lastRotated: "2026-01-15T00:00:00Z",
    },
  },
];

const alertRules: AlertRule[] = [
  {
    id: "alert_001",
    name: "Backup Failure",
    type: "backup_failure",
    severity: "critical",
    enabled: true,
    condition: "Any backup fails",
    channels: ["email", "slack"],
    lastTriggered: "2026-02-11T22:05:00Z",
  },
  {
    id: "alert_002",
    name: "Storage Threshold",
    type: "storage_threshold",
    severity: "high",
    enabled: true,
    condition: "Storage usage > 80%",
    channels: ["email", "webhook"],
  },
  {
    id: "alert_003",
    name: "Integrity Check Failure",
    type: "integrity_failure",
    severity: "critical",
    enabled: true,
    condition: "Any integrity check fails",
    channels: ["email", "slack", "pagerduty"],
  },
  {
    id: "alert_004",
    name: "Restore Failure",
    type: "restore_failure",
    severity: "high",
    enabled: true,
    condition: "Any restore operation fails",
    channels: ["email", "slack"],
  },
];

const auditEvents: AuditEvent[] = [
  {
    id: "evt_001",
    timestamp: "2026-02-12T10:03:42Z",
    actor: "system",
    action: "backup_created",
    target: "bkp_001",
    correlationId: "corr_backup_001",
    result: "success",
    ipAddress: "internal",
  },
  {
    id: "evt_002",
    timestamp: "2026-02-12T08:30:00Z",
    actor: "admin.sarah@acme.com",
    action: "backup_created",
    target: "bkp_002",
    correlationId: "corr_backup_002",
    result: "success",
    ipAddress: "10.0.1.45",
  },
  {
    id: "evt_003",
    timestamp: "2026-02-11T22:05:00Z",
    actor: "system",
    action: "backup_created",
    target: "bkp_005",
    correlationId: "corr_backup_005",
    result: "failure",
    ipAddress: "internal",
  },
  {
    id: "evt_004",
    timestamp: "2026-02-10T14:23:00Z",
    actor: "dba.mike@acme.com",
    action: "restore_initiated",
    target: "bkp_003",
    correlationId: "corr_restore_001",
    result: "success",
    ipAddress: "10.0.1.32",
  },
  {
    id: "evt_005",
    timestamp: "2026-02-10T14:45:00Z",
    actor: "system",
    action: "restore_completed",
    target: "bkp_003",
    correlationId: "corr_restore_001",
    result: "success",
    ipAddress: "internal",
  },
];

// ============================================================================
// CONFIGURATION HELPERS
// ============================================================================

const statusConfig: Record<
  BackupStatus,
  { label: string; icon: LucideIcon; color: string; bgColor: string }
> = {
  success: {
    label: "Success",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  partial: {
    label: "Partial",
    icon: AlertTriangle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  in_progress: {
    label: "In Progress",
    icon: RefreshCw,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-slate-400",
    bgColor: "bg-slate-500/10",
  },
};

const typeConfig: Record<
  BackupType,
  { label: string; color: string; bgColor: string }
> = {
  automated: {
    label: "Automated",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  manual: {
    label: "Manual",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  snapshot: {
    label: "Snapshot",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  incremental: {
    label: "Incremental",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  full: {
    label: "Full",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
};

const severityConfig: Record<
  string,
  { color: string; bgColor: string; label: string }
> = {
  critical: {
    label: "Critical",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  high: {
    label: "High",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  medium: {
    label: "Medium",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  low: {
    label: "Low",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
};

const planConfig: Record<PlanTier, { label: string; color: string }> = {
  free: { label: "Free", color: "text-slate-500" },
  pro: { label: "Pro", color: "text-blue-500" },
  enterprise: { label: "Enterprise", color: "text-purple-500" },
};

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

function StatusBadge({
  status,
  showLabel = true,
  size = "default",
}: {
  status: BackupStatus;
  showLabel?: boolean;
  size?: "sm" | "default" | "lg";
}) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      className={cn(
        "font-medium border-0",
        config.bgColor,
        config.color,
        size === "sm" && "h-5 px-1.5 text-[10px]",
        size === "default" && "h-6 px-2 text-xs",
        size === "lg" && "h-7 px-3 text-sm",
      )}
    >
      <Icon
        className={cn(
          "mr-1",
          size === "sm" ? "h-3 w-3" : size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5",
        )}
      />
      {showLabel && config.label}
    </Badge>
  );
}

function TypeBadge({ type }: { type: BackupType }) {
  const config = typeConfig[type];
  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium", config.color, config.bgColor)}
    >
      {config.label}
    </Badge>
  );
}

function PlanBadge({ plan }: { plan: PlanTier }) {
  const config = planConfig[plan];
  return (
    <Badge
      variant="outline"
      className={cn("h-5 px-2 text-xs font-medium", config.color)}
    >
      <Sparkles className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const config = severityConfig[severity] || severityConfig.low;
  return (
    <Badge
      className={cn(
        "h-5 px-1.5 text-xs font-medium border-0",
        config.bgColor,
        config.color,
      )}
    >
      {config.label}
    </Badge>
  );
}

function CorrelationId({ id }: { id: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <code
            className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono cursor-pointer hover:bg-muted/80 transition-colors"
            onClick={() => navigator.clipboard.writeText(id)}
          >
            {id.slice(0, 12)}...
          </code>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{id}</p>
          <p className="text-[10px] text-muted-foreground">Click to copy</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function StorageBar({ used, limit }: { used: string; limit: string }) {
  const usedNum = parseFloat(used);
  const limitNum = parseFloat(limit);
  const percentage = (usedNum / limitNum) * 100;

  let color = "bg-emerald-500";
  if (percentage >= 90) color = "bg-red-500";
  else if (percentage >= 75) color = "bg-amber-500";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {used} / {limit}
        </span>
        <span
          className={cn(
            "font-medium",
            percentage >= 75 ? "text-amber-500" : "text-foreground",
          )}
        >
          {percentage.toFixed(1)}%
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
        <div
          className={cn("h-full transition-all duration-300", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

function OverviewSection({ health }: { health: BackupHealth }) {
  const storagePercent =
    (parseFloat(health.storageUsed) / parseFloat(health.storageLimit)) * 100;
  const timeSinceLastBackup = Math.floor(
    (new Date().getTime() - new Date(health.lastBackupAt).getTime()) /
      (1000 * 60 * 60),
  );
  const nextBackupDate = new Date(health.nextBackupAt);
  const nextBackupTime = `${nextBackupDate.getUTCHours().toString().padStart(2, "0")}:${nextBackupDate.getUTCMinutes().toString().padStart(2, "0")} UTC`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Last Backup"
        value={
          timeSinceLastBackup < 1 ? "< 1h ago" : `${timeSinceLastBackup}h ago`
        }
        icon={History}
        subtitle={`Next: ${nextBackupTime}`}
        variant={health.failedBackups24h > 0 ? "warning" : "default"}
      />
      <MetricCard
        title="Success Rate (7d)"
        value={`${health.successRate7d}%`}
        icon={health.successRate7d >= 99 ? CheckCircle2 : AlertTriangle}
        subtitle={`${health.failedBackups24h} failures in 24h`}
        variant={health.successRate7d >= 99 ? "default" : "warning"}
        trend={{ value: 0.3, isPositive: true }}
      />
      <MetricCard
        title="Average Size"
        value={health.averageSize}
        icon={Archive}
        subtitle={`${health.totalBackups} total backups`}
      />
      <MetricCard
        title="Storage Used"
        value={health.storageUsed}
        icon={HardDrive}
        subtitle={`of ${health.storageLimit} limit`}
        variant={storagePercent >= 80 ? "warning" : "default"}
      />
    </div>
  );
}

function BackupHistorySection({ backups }: { backups: BackupRecord[] }) {
  const [statusFilter, setStatusFilter] = useState<BackupStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<BackupType | "all">("all");
  const [environmentFilter, setEnvironmentFilter] = useState<
    EnvironmentType | "all"
  >("all");

  const filteredBackups = backups.filter((backup) => {
    if (statusFilter !== "all" && backup.status !== statusFilter) return false;
    if (typeFilter !== "all" && backup.type !== typeFilter) return false;
    if (environmentFilter !== "all" && backup.environment !== environmentFilter)
      return false;
    return true;
  });

  const handleDownload = (backup: BackupRecord) => {
    toast.success(`Downloading backup ${backup.name}`);
  };

  const handleRestore = (backup: BackupRecord) => {
    toast.info(`Initiating restore for ${backup.name}`);
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Archive className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">
              Backup History
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as BackupStatus | "all")}
            >
              <SelectTrigger className="h-8 w-36 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={typeFilter}
              onValueChange={(v) => setTypeFilter(v as BackupType | "all")}
            >
              <SelectTrigger className="h-8 w-36 text-xs">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="automated">Automated</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="full">Full</SelectItem>
                <SelectItem value="incremental">Incremental</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={environmentFilter}
              onValueChange={(v) =>
                setEnvironmentFilter(v as EnvironmentType | "all")
              }
            >
              <SelectTrigger className="h-8 w-36 text-xs">
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
        <CardDescription>
          {filteredBackups.length} backups found
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Backup</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Environment</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBackups.map((backup) => (
              <TableRow key={backup.id}>
                <TableCell>
                  <div>
                    <div className="font-medium text-foreground">
                      {backup.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(backup.startedAt).toLocaleString()}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <TypeBadge type={backup.type} />
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs capitalize">
                    {backup.environment}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{backup.size}</TableCell>
                <TableCell>{backup.duration}</TableCell>
                <TableCell>
                  <StatusBadge status={backup.status} size="sm" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => handleDownload(backup)}
                      disabled={backup.status !== "success"}
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          disabled={backup.status !== "success"}
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5 text-red-500" />
                            Confirm Restore Operation
                          </AlertDialogTitle>
                          <AlertDialogDescription className="space-y-2">
                            <p>
                              You are about to restore from backup{" "}
                              <strong>{backup.name}</strong>.
                            </p>
                            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-sm">
                              <p className="font-medium text-amber-600 flex items-center gap-1">
                                <AlertTriangle className="h-4 w-4" />
                                Warning: This action will overwrite current data
                              </p>
                              <ul className="mt-2 space-y-1 text-muted-foreground list-disc list-inside">
                                <li>All current data will be replaced</li>
                                <li>Active sessions may be interrupted</li>
                                <li>This action cannot be undone</li>
                              </ul>
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => handleRestore(backup)}
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Restore Backup
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                        >
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Backup Details</DialogTitle>
                          <DialogDescription>{backup.name}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">ID</p>
                              <p className="font-medium">{backup.id}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Status</p>
                              <StatusBadge status={backup.status} />
                            </div>
                            <div>
                              <p className="text-muted-foreground">Started</p>
                              <p className="font-medium">
                                {new Date(backup.startedAt).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Completed</p>
                              <p className="font-medium">
                                {backup.completedAt
                                  ? new Date(
                                      backup.completedAt,
                                    ).toLocaleString()
                                  : "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Size</p>
                              <p className="font-medium">{backup.size}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Duration</p>
                              <p className="font-medium">{backup.duration}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">
                                Encryption
                              </p>
                              <p className="font-medium capitalize">
                                {backup.encryption.replace("_", " ")}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Integrity</p>
                              <p className="font-medium capitalize">
                                {backup.integrity}
                              </p>
                            </div>
                          </div>
                          <div className="border-t pt-4">
                            <p className="text-muted-foreground text-sm mb-2">
                              Storage Location
                            </p>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {backup.storageLocation}
                            </code>
                          </div>
                          <div className="border-t pt-4">
                            <p className="text-muted-foreground text-sm mb-2">
                              Metadata
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <p>Tables: {backup.metadata.tables}</p>
                              <p>Indexes: {backup.metadata.indexes}</p>
                              <p className="col-span-2 font-mono text-xs break-all">
                                Checksum: {backup.metadata.checksum}
                              </p>
                            </div>
                          </div>
                          <div className="border-t pt-4">
                            <p className="text-muted-foreground text-sm mb-2">
                              Tags
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {backup.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ScheduleSection({ schedules }: { schedules: BackupSchedule[] }) {
  const [localSchedules, setLocalSchedules] = useState(schedules);

  const toggleSchedule = (id: string) => {
    setLocalSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    );
    toast.success("Schedule updated");
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">
              Backup Schedules
            </CardTitle>
          </div>
          <Button size="sm" className="h-8 text-xs">
            <Play className="h-3.5 w-3.5 mr-1.5" />
            Add Schedule
          </Button>
        </div>
        <CardDescription>
          Automated backup scheduling and retention policies
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {localSchedules.map((schedule) => (
          <div
            key={schedule.id}
            className={cn(
              "p-4 rounded-lg border transition-colors",
              schedule.enabled
                ? "border-border bg-card"
                : "border-border/50 bg-muted/30",
            )}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4
                    className={cn(
                      "font-medium",
                      !schedule.enabled && "text-muted-foreground",
                    )}
                  >
                    {schedule.name}
                  </h4>
                  <Badge
                    variant={schedule.enabled ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {schedule.enabled ? "Active" : "Paused"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {schedule.frequency === "custom"
                    ? schedule.cronExpression
                    : schedule.frequency}{" "}
                  at {schedule.time} {schedule.timezone}
                </p>
              </div>
              <Switch
                checked={schedule.enabled}
                onCheckedChange={() => toggleSchedule(schedule.id)}
              />
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <p className="text-muted-foreground">Type</p>
                <p className="font-medium capitalize">{schedule.type}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Retention</p>
                <p className="font-medium">{schedule.retentionDays} days</p>
              </div>
              <div>
                <p className="text-muted-foreground">Max Versions</p>
                <p className="font-medium">{schedule.maxVersions}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Environments</p>
                <p className="font-medium">
                  {schedule.environments.join(", ")}
                </p>
              </div>
            </div>

            {schedule.notifyOnFailure && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Notifications: {schedule.notifyEmails.join(", ")}
                </p>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function StorageConfigurationSection({
  configs,
}: {
  configs: StorageConfiguration[];
}) {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">
              Storage Configuration
            </CardTitle>
          </div>
          {orgContext.deploymentMode === "self_hosted" && (
            <Button size="sm" variant="outline" className="h-8 text-xs">
              <Settings className="h-3.5 w-3.5 mr-1.5" />
              Configure
            </Button>
          )}
        </div>
        <CardDescription>
          {orgContext.deploymentMode === "saas_cloud"
            ? "Managed storage configuration (SaaS)"
            : "Self-hosted storage backends"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {configs.map((config, index) => (
          <div key={index} className="p-4 rounded-lg border border-border">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-blue-500" />
                  <h4 className="font-medium">
                    {config.bucket || config.type.toUpperCase()}
                  </h4>
                  {config.connectionTested ? (
                    <Badge
                      variant="outline"
                      className="text-xs text-emerald-500 border-emerald-500/30"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-xs text-amber-500 border-amber-500/30"
                    >
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Not Tested
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {config.region} • Last tested:{" "}
                  {config.lastTestedAt
                    ? new Date(config.lastTestedAt).toLocaleString()
                    : "Never"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {config.encryptionAtRest && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="text-xs">
                          <Lock className="h-3 w-3 mr-1" />
                          Encrypted
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Encryption at rest enabled</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {config.compressionEnabled && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="text-xs">
                          <Archive className="h-3 w-3 mr-1" />L
                          {config.compressionLevel}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          Compression level {config.compressionLevel}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <p className="text-muted-foreground">Type</p>
                <p className="font-medium uppercase">
                  {config.type.replace("_", " ")}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Auth</p>
                <p className="font-medium capitalize">
                  {config.credentials.type.replace("_", " ")}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Endpoint</p>
                <p className="font-medium truncate">
                  {config.endpoint || "Default"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Credentials Rotated</p>
                <p className="font-medium">
                  {config.credentials.lastRotated
                    ? new Date(
                        config.credentials.lastRotated,
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        ))}

        {orgContext.deploymentMode === "saas_cloud" && (
          <div className="rounded-lg bg-muted/50 border border-border p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">Managed by Aether</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Storage is fully managed by Aether Identity platform. All
                  backups are encrypted at rest with AES-256 and replicated
                  across multiple availability zones for durability.
                </p>
                <div className="mt-3 flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span>99.999999999% durability</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Multi-region replication</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span>SOC 2 Type II compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RestoreSection() {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">
            Restore Operations
          </CardTitle>
        </div>
        <CardDescription>Recover data from backup points</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Database className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h4 className="font-medium">Full Restore</h4>
                <p className="text-xs text-muted-foreground">
                  Complete database recovery
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Restore the entire database from a selected backup point. This
              will replace all current data.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                  Initiate Full Restore
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-red-500" />
                    Full Database Restore
                  </AlertDialogTitle>
                  <AlertDialogDescription className="space-y-2">
                    <p>
                      This is a destructive operation that will replace all data
                      in the target database.
                    </p>
                    <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
                      <p className="text-sm font-medium text-red-600">
                        Critical Warning
                      </p>
                      <ul className="mt-2 space-y-1 text-xs text-muted-foreground list-disc list-inside">
                        <li>
                          All current data will be permanently overwritten
                        </li>
                        <li>Active user sessions will be terminated</li>
                        <li>
                          This operation may take several minutes to complete
                        </li>
                        <li>Cannot be undone once started</li>
                      </ul>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-500 hover:bg-red-600">
                    Confirm Restore
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="p-4 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <h4 className="font-medium">Point-in-Time Recovery</h4>
                <p className="text-xs text-muted-foreground">
                  Recover to specific timestamp
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Restore to a specific point in time within the retention window
              (up to 35 days).
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              disabled={orgContext.plan !== "enterprise"}
            >
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              Select Point in Time
              {orgContext.plan !== "enterprise" && (
                <Badge variant="secondary" className="ml-2 text-[10px]">
                  Enterprise
                </Badge>
              )}
            </Button>
          </div>
        </div>

        <div className="rounded-lg bg-blue-500/5 border border-blue-500/20 p-4">
          <div className="flex items-start gap-3">
            <History className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-sm">Restore Best Practices</h4>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground list-disc list-inside">
                <li>
                  Always test restores in a non-production environment first
                </li>
                <li>Verify backup integrity before initiating restore</li>
                <li>
                  Schedule restores during maintenance windows when possible
                </li>
                <li>Document all restore operations for audit purposes</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SecurityComplianceSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-violet-500" />
            <CardTitle className="text-sm font-medium">
              Encryption & Security
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Encryption at Rest</span>
            </div>
            <Badge variant="default" className="text-xs">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              AES-256
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              <span>Encryption in Transit</span>
            </div>
            <Badge variant="default" className="text-xs">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              TLS 1.3
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Key className="h-4 w-4" />
              <span>Key Management</span>
            </div>
            <Badge variant="outline" className="text-xs capitalize">
              {orgContext.deploymentMode === "saas_cloud"
                ? "Platform Managed"
                : "Customer Managed"}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>Integrity Verification</span>
            </div>
            <Badge variant="default" className="text-xs">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              SHA-256
            </Badge>
          </div>

          <div className="pt-3 border-t border-border">
            <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span className="text-xs font-medium text-emerald-600">
                  Compliance Certified
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                <Badge variant="outline" className="text-[10px]">
                  SOC 2 Type II
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  ISO 27001
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  GDPR
                </Badge>
                {orgContext.plan === "enterprise" && (
                  <Badge variant="outline" className="text-[10px]">
                    HIPAA
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-blue-500" />
            <CardTitle className="text-sm font-medium">Audit Log</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {auditEvents.slice(0, 4).map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 p-2 rounded-lg bg-muted/50"
            >
              <div
                className={cn(
                  "h-2 w-2 rounded-full mt-1.5 shrink-0",
                  event.result === "success"
                    ? "bg-emerald-500"
                    : event.result === "failure"
                      ? "bg-red-500"
                      : "bg-amber-500",
                )}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium capitalize">
                    {event.action.replace("_", " ")}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {event.actor} • {event.target}
                </p>
                <CorrelationId id={event.correlationId} />
              </div>
            </div>
          ))}
          <Button variant="ghost" className="w-full h-8 text-xs" size="sm">
            View All Events
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function MonitoringAlertsSection({ alerts }: { alerts: AlertRule[] }) {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <CardTitle className="text-sm font-medium">
              Monitoring & Alerts
            </CardTitle>
          </div>
          <Button size="sm" variant="outline" className="h-8 text-xs">
            <Settings className="h-3.5 w-3.5 mr-1.5" />
            Configure
          </Button>
        </div>
        <CardDescription>Alert rules and notification channels</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Rule Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Channels</TableHead>
              <TableHead className="text-right">Last Triggered</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell>
                  <div className="font-medium text-sm">{alert.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {alert.condition}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs capitalize">
                    {alert.type.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <SeverityBadge severity={alert.severity} />
                </TableCell>
                <TableCell>
                  <Switch checked={alert.enabled} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {alert.channels.map((channel) => (
                      <Badge
                        key={channel}
                        variant="secondary"
                        className="text-[10px] capitalize"
                      >
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {alert.lastTriggered
                    ? new Date(alert.lastTriggered).toLocaleDateString()
                    : "Never"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="rounded-lg bg-muted/50 p-4">
            <h4 className="font-medium text-sm mb-2">Integration Endpoints</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-muted-foreground">Webhook:</span>
                <code className="text-xs bg-background px-1.5 py-0.5 rounded">
                  Configured
                </code>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-muted-foreground">Slack:</span>
                <code className="text-xs bg-background px-1.5 py-0.5 rounded">
                  #ops-alerts
                </code>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-slate-300" />
                <span className="text-muted-foreground">PagerDuty:</span>
                <code className="text-xs bg-background px-1.5 py-0.5 rounded">
                  Disabled
                </code>
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

export default function BackupsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [createBackupDialogOpen, setCreateBackupDialogOpen] = useState(false);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);

  const handleCreateBackup = () => {
    setIsCreatingBackup(true);
    setTimeout(() => {
      setIsCreatingBackup(false);
      setCreateBackupDialogOpen(false);
      toast.success("Manual backup initiated successfully");
    }, 2000);
  };

  return (
    <div className="space-y-8 text-foreground">
      {/* ========================================================================
          HEADER SECTION
          ======================================================================== */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-semibold text-card-foreground">
              Identity Backups Management
            </h1>
            <PlanBadge plan={orgContext.plan} />
            <Badge variant="outline" className="h-5 text-xs capitalize">
              <Cloud className="h-3 w-3 mr-1" />
              {orgContext.deploymentMode.replace("_", " ")}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Enterprise backup strategy, disaster recovery, and data protection
            for {orgContext.name}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Backup status refreshed")}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog
            open={createBackupDialogOpen}
            onOpenChange={setCreateBackupDialogOpen}
          >
            <DialogTrigger asChild>
              <Button size="sm">
                <UploadCloud className="h-4 w-4 mr-2" />
                Create Backup
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Manual Backup</DialogTitle>
                <DialogDescription>
                  Initiate an on-demand backup of your databases.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Environment</Label>
                  <Select defaultValue="production">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="production">Production</SelectItem>
                      <SelectItem value="staging">Staging</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Backup Type</Label>
                  <Select defaultValue="full">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Backup</SelectItem>
                      <SelectItem value="incremental">Incremental</SelectItem>
                      <SelectItem value="snapshot">Snapshot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Retention (days)</Label>
                  <Slider defaultValue={[30]} max={365} step={1} />
                  <p className="text-xs text-muted-foreground">30 days</p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setCreateBackupDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateBackup}
                  disabled={isCreatingBackup}
                >
                  {isCreatingBackup ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Backup
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ========================================================================
          TABS NAVIGATION
          ======================================================================== */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="overview" className="text-xs">
            Overview
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs">
            History
          </TabsTrigger>
          <TabsTrigger value="schedules" className="text-xs">
            Schedules
          </TabsTrigger>
          <TabsTrigger value="restore" className="text-xs">
            Restore
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs">
            Security
          </TabsTrigger>
        </TabsList>

        {/* ========================================================================
            OVERVIEW TAB
            ======================================================================== */}
        <TabsContent value="overview" className="space-y-6">
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "h-2 w-2 rounded-full",
                  backupHealth.overallStatus === "healthy"
                    ? "bg-emerald-500"
                    : backupHealth.overallStatus === "degraded"
                      ? "bg-amber-500"
                      : "bg-red-500",
                )}
              />
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Backup Health Overview
              </h2>
            </div>
            <OverviewSection health={backupHealth} />
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Recent Activity
            </h2>
            <BackupHistorySection backups={backupHistory.slice(0, 3)} />
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Active Schedules
            </h2>
            <ScheduleSection schedules={backupSchedules.slice(0, 2)} />
          </section>
        </TabsContent>

        {/* ========================================================================
            HISTORY TAB
            ======================================================================== */}
        <TabsContent value="history" className="space-y-6">
          <BackupHistorySection backups={backupHistory} />
        </TabsContent>

        {/* ========================================================================
            SCHEDULES TAB
            ======================================================================== */}
        <TabsContent value="schedules" className="space-y-6">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Backup Schedules
              </h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                <span>Admin access required</span>
              </div>
            </div>
            <ScheduleSection schedules={backupSchedules} />
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Storage Configuration
            </h2>
            <StorageConfigurationSection configs={storageConfigs} />
          </section>
        </TabsContent>

        {/* ========================================================================
            RESTORE TAB
            ======================================================================== */}
        <TabsContent value="restore" className="space-y-6">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Restore Operations
              </h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldAlert className="h-3 w-3 text-red-500" />
                <span>Destructive actions</span>
              </div>
            </div>
            <RestoreSection />
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Available Backups
            </h2>
            <BackupHistorySection
              backups={backupHistory.filter((b) => b.status === "success")}
            />
          </section>
        </TabsContent>

        {/* ========================================================================
            SECURITY TAB
            ======================================================================== */}
        <TabsContent value="security" className="space-y-6">
          <section className="space-y-4">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Security & Compliance
            </h2>
            <SecurityComplianceSection />
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Monitoring & Alerts
            </h2>
            <MonitoringAlertsSection alerts={alertRules} />
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Storage Configuration
            </h2>
            <StorageConfigurationSection configs={storageConfigs} />
          </section>
        </TabsContent>
      </Tabs>

      {/* ========================================================================
          FOOTER
          ======================================================================== */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          <Info className="h-3 w-3 inline mr-1" />
          All timestamps are in UTC. Backup operations are monitored 24/7.
        </p>
        <div className="flex items-center gap-3">
          <Button variant="link" size="sm" className="h-8 text-xs">
            Documentation
          </Button>
          <Button variant="link" size="sm" className="h-8 text-xs">
            Support
          </Button>
        </div>
      </div>
    </div>
  );
}
