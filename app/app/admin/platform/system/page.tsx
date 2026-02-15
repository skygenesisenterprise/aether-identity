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
  Activity,
  AlertCircle,
  AlertTriangle,
  Archive,
  ArrowUpCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cpu,
  Database,
  Download,
  FileText,
  HardDrive,
  History,
  Info,
  Layers,
  LayoutGrid,
  Monitor,
  RefreshCw,
  RotateCcw,
  ScrollText,
  Server,
  Settings,
  Shield,
  Terminal,
  Wrench,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES - System Platform Configuration
// ============================================================================

type SystemStatus = "healthy" | "degraded" | "critical" | "maintenance";
type UpdateStatus =
  | "available"
  | "downloading"
  | "installing"
  | "completed"
  | "failed";
type MaintenanceType = "scheduled" | "emergency" | "routine";
type LogLevel = "info" | "warning" | "error" | "critical";

interface SystemHealth {
  status: SystemStatus;
  uptime: string;
  version: string;
  lastRestart: string;
  components: ComponentHealth[];
}

interface ComponentHealth {
  id: string;
  name: string;
  status: SystemStatus;
  latency: number;
  lastCheck: string;
}

interface SystemUpdate {
  id: string;
  version: string;
  type: "security" | "feature" | "patch";
  severity: "critical" | "high" | "medium" | "low";
  releaseDate: string;
  description: string;
  changelog: string[];
  size: string;
  status: UpdateStatus;
  progress?: number;
}

interface DiagnosticCheck {
  id: string;
  name: string;
  category: "connectivity" | "performance" | "security" | "integrity";
  status: "passed" | "failed" | "warning" | "pending";
  message: string;
  duration: number;
  lastRun: string;
}

interface SystemLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
  metadata?: Record<string, unknown>;
}

interface MaintenanceWindow {
  id: string;
  type: MaintenanceType;
  title: string;
  description: string;
  scheduledStart: string;
  estimatedDuration: string;
  affectedServices: string[];
  status: "planned" | "in_progress" | "completed" | "cancelled";
}

interface BackupStatus {
  id: string;
  type: "full" | "incremental" | "snapshot";
  status: "running" | "completed" | "failed" | "scheduled";
  startedAt: string;
  completedAt?: string;
  size: string;
  retention: string;
}

// ============================================================================
// MOCK DATA - System Platform State
// ============================================================================

const mockSystemHealth: SystemHealth = {
  status: "healthy",
  uptime: "45d 12h 34m",
  version: "2.4.1-enterprise",
  lastRestart: "2024-12-25T03:00:00Z",
  components: [
    {
      id: "api-gateway",
      name: "API Gateway",
      status: "healthy",
      latency: 12,
      lastCheck: "2s ago",
    },
    {
      id: "auth-engine",
      name: "Auth Engine",
      status: "healthy",
      latency: 8,
      lastCheck: "3s ago",
    },
    {
      id: "database",
      name: "Database",
      status: "healthy",
      latency: 5,
      lastCheck: "1s ago",
    },
    {
      id: "cache",
      name: "Cache Layer",
      status: "healthy",
      latency: 2,
      lastCheck: "2s ago",
    },
    {
      id: "messaging",
      name: "Message Queue",
      status: "degraded",
      latency: 145,
      lastCheck: "5s ago",
    },
  ],
};

const mockUpdates: SystemUpdate[] = [
  {
    id: "upd-001",
    version: "2.4.2",
    type: "security",
    severity: "critical",
    releaseDate: "2025-02-07T10:00:00Z",
    description:
      "Security patch addressing CVE-2025-XXXX in authentication module",
    changelog: [
      "Fixed session validation vulnerability",
      "Updated cryptographic libraries",
      "Enhanced audit logging for auth events",
    ],
    size: "45 MB",
    status: "available",
  },
  {
    id: "upd-002",
    version: "2.5.0",
    type: "feature",
    severity: "medium",
    releaseDate: "2025-02-05T14:30:00Z",
    description: "Major feature release with new RBAC capabilities",
    changelog: [
      "Added dynamic role inheritance",
      "Improved policy engine performance",
      "New audit report templates",
      "Enhanced SCIM 2.0 support",
    ],
    size: "128 MB",
    status: "available",
  },
  {
    id: "upd-003",
    version: "2.4.1-hotfix1",
    type: "patch",
    severity: "low",
    releaseDate: "2025-01-28T09:15:00Z",
    description: "Minor bug fixes and performance improvements",
    changelog: [
      "Fixed memory leak in token service",
      "Optimized database queries",
    ],
    size: "12 MB",
    status: "completed",
  },
];

const mockDiagnostics: DiagnosticCheck[] = [
  {
    id: "diag-001",
    name: "Database Connectivity",
    category: "connectivity",
    status: "passed",
    message: "All database connections healthy",
    duration: 245,
    lastRun: "2 minutes ago",
  },
  {
    id: "diag-002",
    name: "External IdP Reachability",
    category: "connectivity",
    status: "passed",
    message: "All external providers responding",
    duration: 890,
    lastRun: "2 minutes ago",
  },
  {
    id: "diag-003",
    name: "Cache Performance",
    category: "performance",
    status: "warning",
    message: "Cache hit ratio below threshold (78%)",
    duration: 156,
    lastRun: "2 minutes ago",
  },
  {
    id: "diag-004",
    name: "Disk Space",
    category: "integrity",
    status: "passed",
    message: "Storage usage: 67% (sufficient)",
    duration: 45,
    lastRun: "2 minutes ago",
  },
  {
    id: "diag-005",
    name: "Certificate Validity",
    category: "security",
    status: "passed",
    message: "All certificates valid for > 30 days",
    duration: 123,
    lastRun: "2 minutes ago",
  },
  {
    id: "diag-006",
    name: "Memory Usage",
    category: "performance",
    status: "warning",
    message: "High memory usage detected (87%)",
    duration: 67,
    lastRun: "2 minutes ago",
  },
];

const mockLogs: SystemLog[] = [
  {
    id: "log-001",
    timestamp: "2025-02-08T14:32:15Z",
    level: "info",
    source: "auth-engine",
    message: "User authentication successful",
    metadata: { userId: "usr-123", method: "sso" },
  },
  {
    id: "log-002",
    timestamp: "2025-02-08T14:31:42Z",
    level: "warning",
    source: "cache",
    message: "Cache eviction rate high",
    metadata: { evictionRate: "15%", threshold: "10%" },
  },
  {
    id: "log-003",
    timestamp: "2025-02-08T14:30:18Z",
    level: "error",
    source: "messaging",
    message: "Message queue consumer lag detected",
    metadata: { lag: "2min", queue: "audit-events" },
  },
  {
    id: "log-004",
    timestamp: "2025-02-08T14:28:55Z",
    level: "info",
    source: "api-gateway",
    message: "Rate limit applied",
    metadata: { clientId: "cli-456", limit: "1000/hour" },
  },
  {
    id: "log-005",
    timestamp: "2025-02-08T14:25:30Z",
    level: "critical",
    source: "security",
    message: "Multiple failed login attempts",
    metadata: { attempts: 5, sourceIp: "192.168.1.100", userId: "usr-789" },
  },
];

const mockMaintenance: MaintenanceWindow[] = [
  {
    id: "mnt-001",
    type: "scheduled",
    title: "February Security Update",
    description: "Installation of critical security patches",
    scheduledStart: "2025-02-15T02:00:00Z",
    estimatedDuration: "45 minutes",
    affectedServices: ["auth-engine", "api-gateway"],
    status: "planned",
  },
  {
    id: "mnt-002",
    type: "routine",
    title: "Database Optimization",
    description: "Scheduled vacuum and index rebuild",
    scheduledStart: "2025-02-10T01:00:00Z",
    estimatedDuration: "2 hours",
    affectedServices: ["database"],
    status: "planned",
  },
];

const mockBackups: BackupStatus[] = [
  {
    id: "bkp-001",
    type: "full",
    status: "completed",
    startedAt: "2025-02-08T00:00:00Z",
    completedAt: "2025-02-08T01:23:45Z",
    size: "4.2 GB",
    retention: "90 days",
  },
  {
    id: "bkp-002",
    type: "incremental",
    status: "completed",
    startedAt: "2025-02-07T00:00:00Z",
    completedAt: "2025-02-07T00:15:22Z",
    size: "156 MB",
    retention: "30 days",
  },
  {
    id: "bkp-003",
    type: "snapshot",
    status: "scheduled",
    startedAt: "2025-02-09T00:00:00Z",
    size: "-",
    retention: "7 days",
  },
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function StatusBadge({ status }: { status: SystemStatus }) {
  const configs = {
    healthy: {
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      label: "Healthy",
    },
    degraded: {
      icon: AlertCircle,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      label: "Degraded",
    },
    critical: {
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      label: "Critical",
    },
    maintenance: {
      icon: Wrench,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      label: "Maintenance",
    },
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        config.bgColor,
        config.color,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: SystemUpdate["severity"] }) {
  const configs = {
    critical: { color: "bg-red-500/10 text-red-600", label: "Critical" },
    high: { color: "bg-orange-500/10 text-orange-600", label: "High" },
    medium: { color: "bg-blue-500/10 text-blue-600", label: "Medium" },
    low: { color: "bg-slate-500/10 text-slate-600", label: "Low" },
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

function LogLevelBadge({ level }: { level: LogLevel }) {
  const configs = {
    info: { color: "bg-blue-500/10 text-blue-600", icon: Info },
    warning: { color: "bg-amber-500/10 text-amber-600", icon: AlertTriangle },
    error: { color: "bg-orange-500/10 text-orange-600", icon: XCircle },
    critical: { color: "bg-red-500/10 text-red-600", icon: AlertCircle },
  };

  const config = configs[level];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium uppercase",
        config.color,
      )}
    >
      <Icon className="h-3 w-3" />
      {level}
    </span>
  );
}

function CheckStatusBadge({ status }: { status: DiagnosticCheck["status"] }) {
  const configs = {
    passed: {
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      label: "Passed",
    },
    failed: {
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      label: "Failed",
    },
    warning: {
      icon: AlertTriangle,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      label: "Warning",
    },
    pending: {
      icon: Clock,
      color: "text-slate-500",
      bgColor: "bg-slate-500/10",
      label: "Pending",
    },
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium",
        config.bgColor,
        config.color,
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

function SystemOverviewPanel({ health }: { health: SystemHealth }) {
  const healthyCount = health.components.filter(
    (c) => c.status === "healthy",
  ).length;
  const degradedCount = health.components.filter(
    (c) => c.status === "degraded",
  ).length;
  const criticalCount = health.components.filter(
    (c) => c.status === "critical",
  ).length;

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">
              System Overview
            </CardTitle>
          </div>
          <StatusBadge status={health.status} />
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Version
            </p>
            <p className="text-sm font-mono font-medium">{health.version}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Uptime
            </p>
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-sm font-medium">{health.uptime}</p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Component Health</span>
            <span className="text-muted-foreground">
              {healthyCount}/{health.components.length} healthy
            </span>
          </div>
          <div className="flex gap-1 h-2">
            <div
              className="bg-emerald-500 rounded-l"
              style={{
                width: `${(healthyCount / health.components.length) * 100}%`,
              }}
            />
            <div
              className="bg-amber-500"
              style={{
                width: `${(degradedCount / health.components.length) * 100}%`,
              }}
            />
            <div
              className="bg-red-500 rounded-r"
              style={{
                width: `${(criticalCount / health.components.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Components
          </p>
          <div className="space-y-1.5">
            {health.components.map((component) => (
              <div
                key={component.id}
                className="flex items-center justify-between py-1.5 px-2 rounded bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      component.status === "healthy"
                        ? "bg-emerald-500"
                        : component.status === "degraded"
                          ? "bg-amber-500"
                          : "bg-red-500",
                    )}
                  />
                  <span className="text-xs font-medium">{component.name}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{component.latency}ms</span>
                  <span>{component.lastCheck}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UpdatesPanel({ updates }: { updates: SystemUpdate[] }) {
  const availableUpdates = updates.filter((u) => u.status === "available");
  const criticalUpdates = availableUpdates.filter(
    (u) => u.severity === "critical",
  );

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowUpCircle className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">
              System Updates
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {criticalUpdates.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {criticalUpdates.length} critical
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {availableUpdates.length} available
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {updates.map((update) => (
            <div key={update.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      v{update.version}
                    </span>
                    <SeverityBadge severity={update.severity} />
                    <Badge
                      variant="secondary"
                      className="text-[10px] capitalize"
                    >
                      {update.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {update.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{update.size}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(update.releaseDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {update.status === "installing" &&
                update.progress !== undefined && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        Installing...
                      </span>
                      <span>{update.progress}%</span>
                    </div>
                    <Progress value={update.progress} className="h-1.5" />
                  </div>
                )}

              <div className="flex items-center gap-2">
                {update.status === "available" && (
                  <Button size="sm" variant="default" className="h-7 text-xs">
                    <Download className="h-3 w-3 mr-1" />
                    Install
                  </Button>
                )}
                {update.status === "completed" && (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Installed
                  </span>
                )}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs text-muted-foreground"
                    >
                      <ScrollText className="h-3 w-3 mr-1" />
                      Changelog
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-sm">
                        Changelog v{update.version}
                      </DialogTitle>
                      <DialogDescription className="text-xs">
                        Release date:{" "}
                        {new Date(update.releaseDate).toLocaleString()}
                      </DialogDescription>
                    </DialogHeader>
                    <ul className="space-y-2 text-sm mt-4">
                      {update.changelog.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <ChevronRight className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DiagnosticsPanel({ checks }: { checks: DiagnosticCheck[] }) {
  const passedCount = checks.filter((c) => c.status === "passed").length;
  const failedCount = checks.filter((c) => c.status === "failed").length;
  const warningCount = checks.filter((c) => c.status === "warning").length;

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">
              System Diagnostics
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {failedCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {failedCount} failed
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge
                variant="secondary"
                className="text-xs bg-amber-500/10 text-amber-600"
              >
                {warningCount} warning
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs">
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Run All Checks
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 text-xs text-muted-foreground"
          >
            <History className="h-3.5 w-3.5 mr-1" />
            View History
          </Button>
        </div>

        <div className="space-y-1.5">
          {checks.map((check) => (
            <div
              key={check.id}
              className="flex items-center justify-between py-2 px-3 rounded border border-border/50 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <CheckStatusBadge status={check.status} />
                <div>
                  <p className="text-xs font-medium">{check.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {check.message}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground">
                  {formatDuration(check.duration)}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {check.lastRun}
                </p>
              </div>
            </div>
          ))}
        </div>

        {warningCount > 0 && (
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700">
                {warningCount} diagnostic check(s) reported warnings. Review the
                details above for recommended actions.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LogsPanel({ logs }: { logs: SystemLog[] }) {
  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">System Logs</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-7 text-xs">
              <FileText className="h-3 w-3 mr-1" />
              View All
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs text-muted-foreground"
            >
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-3 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <LogLevelBadge level={log.level} />
                    <span className="text-xs font-medium text-muted-foreground">
                      {log.source}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs text-foreground">{log.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function MaintenancePanel({
  windows,
  backups,
}: {
  windows: MaintenanceWindow[];
  backups: BackupStatus[];
}) {
  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">
              Maintenance & Backup
            </CardTitle>
          </div>
          <Button size="sm" variant="outline" className="h-7 text-xs">
            <Settings className="h-3 w-3 mr-1" />
            Schedule
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        {/* Scheduled Maintenance */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" />
            Scheduled Maintenance
          </h4>
          <div className="space-y-2">
            {windows.map((window) => (
              <div
                key={window.id}
                className="p-3 rounded border border-border/50 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">
                        {window.title}
                      </span>
                      <Badge
                        variant="secondary"
                        className="text-[10px] capitalize"
                      >
                        {window.type}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {window.description}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded font-medium",
                      window.status === "planned"
                        ? "bg-blue-500/10 text-blue-600"
                        : window.status === "in_progress"
                          ? "bg-amber-500/10 text-amber-600"
                          : window.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-slate-500/10 text-slate-600",
                    )}
                  >
                    {window.status.replace("_", " ")}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {window.affectedServices.map((service) => (
                    <span
                      key={service}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                    >
                      {service}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(window.scheduledStart).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <HourglassIcon />
                    {window.estimatedDuration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Backup Status */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-2">
            <Archive className="h-3.5 w-3.5" />
            Backup Status
          </h4>
          <div className="space-y-2">
            {backups.map((backup) => (
              <div
                key={backup.id}
                className="flex items-center justify-between py-2 px-3 rounded bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      backup.status === "completed"
                        ? "bg-emerald-500"
                        : backup.status === "running"
                          ? "bg-blue-500 animate-pulse"
                          : backup.status === "failed"
                            ? "bg-red-500"
                            : "bg-slate-400",
                    )}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium capitalize">
                        {backup.type} Backup
                      </span>
                      <Badge variant="secondary" className="text-[10px]">
                        {backup.status}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {backup.status === "scheduled"
                        ? `Scheduled for ${new Date(backup.startedAt).toLocaleString()}`
                        : backup.completedAt
                          ? `Completed ${new Date(backup.completedAt).toLocaleString()}`
                          : `Started ${new Date(backup.startedAt).toLocaleString()}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium">{backup.size}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {backup.retention} retention
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function HourglassIcon() {
  return (
    <svg
      className="h-3 w-3"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 22h14M5 2h14M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
    </svg>
  );
}

function ResourceUsagePanel() {
  const resources = [
    { name: "CPU", value: 42, limit: 80, icon: Cpu, color: "text-blue-500" },
    {
      name: "Memory",
      value: 67,
      limit: 85,
      icon: Layers,
      color: "text-purple-500",
    },
    {
      name: "Storage",
      value: 58,
      limit: 90,
      icon: HardDrive,
      color: "text-emerald-500",
    },
    {
      name: "Database",
      value: 34,
      limit: 70,
      icon: Database,
      color: "text-amber-500",
    },
  ];

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-medium">Resource Usage</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {resources.map((resource) => {
          const Icon = resource.icon;
          const isWarning = resource.value > resource.limit * 0.8;
          const isCritical = resource.value > resource.limit;

          return (
            <div key={resource.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Icon className={cn("h-3.5 w-3.5", resource.color)} />
                  <span className="font-medium">{resource.name}</span>
                </div>
                <span
                  className={cn(
                    "font-medium",
                    isCritical
                      ? "text-red-500"
                      : isWarning
                        ? "text-amber-500"
                        : "text-muted-foreground",
                  )}
                >
                  {resource.value}%
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    isCritical
                      ? "bg-red-500"
                      : isWarning
                        ? "bg-amber-500"
                        : resource.color.replace("text-", "bg-"),
                  )}
                  style={{ width: `${Math.min(resource.value, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                Limit: {resource.limit}%{" "}
                {isWarning && !isCritical && "(approaching limit)"}{" "}
                {isCritical && "(limit exceeded)"}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function SystemPlatformPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-card-foreground">
            System Platform
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            System-level administration and maintenance. Monitor platform
            health, manage updates, run diagnostics, and schedule maintenance
            operations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-9 text-xs">
            <RotateCcw className="h-4 w-4 mr-1" />
            Restart Services
          </Button>
          <Button size="sm" variant="default" className="h-9 text-xs">
            <Settings className="h-4 w-4 mr-1" />
            System Settings
          </Button>
        </div>
      </div>

      {/* Security Warning Banner */}
      <div className="p-4 rounded-lg border border-amber-200 bg-amber-50">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-900">
              Privileged System Access
            </p>
            <p className="text-sm text-amber-700 mt-1">
              You are accessing critical system infrastructure. All actions are
              logged and audited. Changes may affect platform availability and
              require superadmin approval.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - System Overview & Resources */}
        <div className="lg:col-span-1 space-y-6">
          <SystemOverviewPanel health={mockSystemHealth} />
          <ResourceUsagePanel />
          <MaintenancePanel windows={mockMaintenance} backups={mockBackups} />
        </div>

        {/* Middle & Right Columns - Updates, Diagnostics, Logs */}
        <div className="lg:col-span-2 space-y-6">
          <UpdatesPanel updates={mockUpdates} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DiagnosticsPanel checks={mockDiagnostics} />
            <LogsPanel logs={mockLogs} />
          </div>

          {/* API Integration Reference */}
          <Card className="border-border bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Server className="h-4 w-4 text-muted-foreground" />
                API Integration Reference
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p className="text-xs">
                This interface interacts with the Identity Platform System API.
                All operations require appropriate RBAC scopes.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <p className="font-medium text-foreground">
                    Required Scopes:
                  </p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>
                      <code className="bg-muted px-1 rounded">
                        admin:system:read
                      </code>{" "}
                      - View system status
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">
                        admin:system:write
                      </code>{" "}
                      - Modify settings
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">
                        admin:updates:manage
                      </code>{" "}
                      - Install updates
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">
                        superadmin:system
                      </code>{" "}
                      - Critical operations
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-foreground">Key Endpoints:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>
                      <code className="bg-muted px-1 rounded">
                        GET /system/status
                      </code>{" "}
                      - Health status
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">
                        GET /system/updates
                      </code>{" "}
                      - Available updates
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">
                        POST /system/diagnostics
                      </code>{" "}
                      - Run checks
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">
                        GET /system/logs
                      </code>{" "}
                      - System logs
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
