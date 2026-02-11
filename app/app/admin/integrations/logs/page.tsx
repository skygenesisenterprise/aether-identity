"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Badge } from "@/components/dashboard/ui/badge";
import { Input } from "@/components/dashboard/ui/input";
import { Label } from "@/components/dashboard/ui/label";
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/dashboard/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ContextOverview } from "@/components/dashboard/context-overview";
import { TooltipProvider } from "@/components/dashboard/ui/tooltip";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/dashboard/ui/toggle-group";
import { cn } from "@/lib/utils";
import Link from "next/link";

import {
  Activity,
  Zap,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Search,
  Download,
  Eye,
  ChevronRight,
  Server,
  Mail,
  Users,
  FolderSync,
  Webhook,
  Database,
  Shield,
  ExternalLink,
  Copy,
  FileJson,
  Terminal,
  Link2,
  User,
  XCircle,
  Info,
  Wrench,
  Cpu,
} from "lucide-react";

type IntegrationSource =
  | "service"
  | "email"
  | "scim"
  | "directory"
  | "webhook"
  | "provisioning"
  | "provider"
  | "external";

type LogSeverity = "success" | "info" | "warning" | "error" | "critical";

type EventImpact = "user" | "group" | "service" | "sync" | "system";

interface IntegrationLog {
  id: string;
  timestamp: string;
  source: IntegrationSource;
  sourceName: string;
  eventType: string;
  severity: LogSeverity;
  impact: EventImpact;
  message: string;
  correlationId: string;
  requestId?: string;
  userId?: string;
  userEmail?: string;
  errorCode?: string;
  stackTrace?: string;
  payload?: Record<string, unknown>;
  responseCode?: number;
  duration?: number;
  recommendation?: string;
}

interface LogStats {
  totalEvents24h: number;
  totalEvents7d: number;
  totalEvents30d: number;
  criticalErrors24h: number;
  activeIntegrations: number;
  degradedIntegrations: number;
  lastErrorTimestamp?: string;
  lastErrorMessage?: string;
  successRate24h: number;
}

const sourceConfig: Record<
  IntegrationSource,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
  }
> = {
  service: {
    label: "Services",
    icon: Server,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  email: {
    label: "Email",
    icon: Mail,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  scim: {
    label: "SCIM",
    icon: Users,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  directory: {
    label: "Directory",
    icon: FolderSync,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  webhook: {
    label: "Webhooks",
    icon: Webhook,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  provisioning: {
    label: "Provisioning",
    icon: Database,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  provider: {
    label: "Providers",
    icon: Shield,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  external: {
    label: "External",
    icon: ExternalLink,
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
  },
};

const severityConfig: Record<
  LogSeverity,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  success: {
    label: "Success",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
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
    icon: XCircle,
    color: "text-red-700",
    bgColor: "bg-red-500/20",
    borderColor: "border-red-500/30",
  },
};

const impactConfig: Record<
  EventImpact,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  user: { label: "User", icon: User },
  group: { label: "Group", icon: Users },
  service: { label: "Service", icon: Cpu },
  sync: { label: "Sync", icon: RefreshCw },
  system: { label: "System", icon: Server },
};

const mockLogs: IntegrationLog[] = [
  {
    id: "log-001",
    timestamp: "2024-02-07T10:45:23Z",
    source: "scim",
    sourceName: "Okta SCIM",
    eventType: "user.sync",
    severity: "success",
    impact: "user",
    message: "Successfully synchronized 47 users from Okta directory",
    correlationId: "corr-okta-001",
    requestId: "req-abc123",
    userId: "usr_okta_001",
    userEmail: "sync@okta.com",
    duration: 4523,
  },
  {
    id: "log-002",
    timestamp: "2024-02-07T10:44:18Z",
    source: "email",
    sourceName: "SendGrid",
    eventType: "email.failed",
    severity: "error",
    impact: "user",
    message: "Failed to deliver password reset email to john.doe@acme.com",
    correlationId: "corr-email-002",
    requestId: "req-def456",
    userId: "usr_123",
    userEmail: "john.doe@acme.com",
    errorCode: "EMAIL_503",
    responseCode: 503,
    recommendation:
      "Check SendGrid API status and verify recipient email address validity",
    payload: { to: "john.doe@acme.com", template: "password_reset" },
  },
  {
    id: "log-003",
    timestamp: "2024-02-07T10:42:55Z",
    source: "directory",
    sourceName: "Azure AD",
    eventType: "group.update",
    severity: "warning",
    impact: "group",
    message: "Group 'Engineering' sync completed with 3 warnings",
    correlationId: "corr-azure-003",
    requestId: "req-ghi789",
    duration: 8234,
    recommendation: "Review user attributes that failed to sync",
    payload: { groupId: "grp_eng_001", warnings: 3, synced: 145 },
  },
  {
    id: "log-004",
    timestamp: "2024-02-07T10:40:12Z",
    source: "webhook",
    sourceName: "SIEM Integration",
    eventType: "delivery.failed",
    severity: "error",
    impact: "service",
    message:
      "Webhook delivery failed after 3 retries to https://siem.company.com",
    correlationId: "corr-webhook-004",
    requestId: "req-jkl012",
    errorCode: "WEBHOOK_TIMEOUT",
    responseCode: 504,
    duration: 15000,
    recommendation:
      "Check endpoint availability and consider increasing timeout",
    payload: {
      endpoint: "https://siem.company.com/webhooks",
      event: "login.success",
    },
  },
  {
    id: "log-005",
    timestamp: "2024-02-07T10:38:45Z",
    source: "provisioning",
    sourceName: "Jira Provisioning",
    eventType: "account.created",
    severity: "success",
    impact: "user",
    message: "Created Jira account for sarah.jones@acme.com",
    correlationId: "corr-prov-005",
    requestId: "req-mno345",
    userId: "usr_456",
    userEmail: "sarah.jones@acme.com",
    duration: 1234,
  },
  {
    id: "log-006",
    timestamp: "2024-02-07T10:35:22Z",
    source: "service",
    sourceName: "Redis Cache",
    eventType: "connection.failed",
    severity: "critical",
    impact: "service",
    message: "Unable to establish connection to Redis cache cluster",
    correlationId: "corr-svc-006",
    requestId: "req-pqr678",
    errorCode: "REDIS_CONN_REFUSED",
    stackTrace:
      "Error: connect ECONNREFUSED 10.0.1.50:6379\n    at TCPConnectWrap.afterConnect...",
    recommendation:
      "Check Redis cluster status and network connectivity. Consider failover to secondary.",
  },
  {
    id: "log-007",
    timestamp: "2024-02-07T10:32:18Z",
    source: "provider",
    sourceName: "Okta MFA",
    eventType: "factor.enrolled",
    severity: "success",
    impact: "user",
    message: "User enrolled in Okta Verify push notification",
    correlationId: "corr-prov-007",
    requestId: "req-stu901",
    userId: "usr_789",
    userEmail: "mike.chen@acme.com",
    duration: 567,
  },
  {
    id: "log-008",
    timestamp: "2024-02-07T10:30:00Z",
    source: "external",
    sourceName: "Slack",
    eventType: "message.sent",
    severity: "success",
    impact: "service",
    message: "Sent security alert to #security-ops channel",
    correlationId: "corr-ext-008",
    requestId: "req-vwx234",
    duration: 234,
    payload: {
      channel: "#security-ops",
      message: "Multiple failed login attempts detected",
    },
  },
  {
    id: "log-009",
    timestamp: "2024-02-07T10:28:42Z",
    source: "scim",
    sourceName: "Azure AD SCIM",
    eventType: "user.delete",
    severity: "warning",
    impact: "user",
    message: "User deletion synced but target service returned partial success",
    correlationId: "corr-scim-009",
    requestId: "req-yza567",
    errorCode: "SCIM_PARTIAL",
    recommendation: "Manually verify user removal from all target applications",
  },
  {
    id: "log-010",
    timestamp: "2024-02-07T10:25:15Z",
    source: "directory",
    sourceName: "LDAP",
    eventType: "sync.completed",
    severity: "success",
    impact: "sync",
    message: "Full LDAP directory sync completed successfully",
    correlationId: "corr-dir-010",
    requestId: "req-bcd890",
    duration: 45678,
    payload: {
      usersProcessed: 2847,
      groupsProcessed: 156,
      changesDetected: 23,
    },
  },
];

const mockStats: LogStats = {
  totalEvents24h: 12453,
  totalEvents7d: 89234,
  totalEvents30d: 456789,
  criticalErrors24h: 3,
  activeIntegrations: 12,
  degradedIntegrations: 2,
  lastErrorTimestamp: "2024-02-07T10:40:12Z",
  lastErrorMessage: "Webhook delivery failed after 3 retries",
  successRate24h: 99.2,
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toISOString().replace("T", " ").substring(0, 19);
};

function LogDetailDialog({
  log,
  open,
  onOpenChange,
}: {
  log: IntegrationLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [showRawPayload, setShowRawPayload] = React.useState(false);

  if (!log) return null;

  const sourceConf = sourceConfig[log.source];
  const severityConf = severityConfig[log.severity];
  const ImpactIcon = impactConfig[log.impact].icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                sourceConf.bgColor,
              )}
            >
              <sourceConf.icon className={cn("h-5 w-5", sourceConf.color)} />
            </div>
            <div>
              <DialogTitle className="flex items-center gap-2">
                {log.eventType}
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    severityConf.bgColor,
                    severityConf.color,
                    severityConf.borderColor,
                  )}
                >
                  <severityConf.icon className="h-3 w-3 mr-1" />
                  {severityConf.label}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                {log.sourceName} • {formatTimestamp(log.timestamp)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Correlation ID
              </Label>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-secondary px-2 py-1 rounded">
                  {log.correlationId}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() =>
                    navigator.clipboard.writeText(log.correlationId)
                  }
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            {log.requestId && (
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Request ID
                </Label>
                <code className="text-xs bg-secondary px-2 py-1 rounded block">
                  {log.requestId}
                </code>
              </div>
            )}
            {log.errorCode && (
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Error Code
                </Label>
                <Badge variant="destructive" className="text-xs">
                  {log.errorCode}
                </Badge>
              </div>
            )}
            {log.responseCode && (
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Response
                </Label>
                <Badge variant="outline" className="text-xs">
                  {log.responseCode}
                </Badge>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Message</Label>
            <div className="p-3 rounded-md bg-secondary/50 text-sm">
              {log.message}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Impact</Label>
              <div className="flex items-center gap-2">
                <ImpactIcon className="h-4 w-4 text-muted-foreground" />
                <Badge variant="secondary" className="text-xs">
                  {impactConfig[log.impact].label}
                </Badge>
              </div>
            </div>
            {log.duration && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Duration
                </Label>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{log.duration}ms</span>
                </div>
              </div>
            )}
          </div>

          {log.userEmail && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Affected User
              </Label>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{log.userEmail}</span>
                <Link href={`/admin/users?search=${log.userEmail}`}>
                  <Button variant="ghost" size="sm" className="h-6 text-xs">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View User
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {log.recommendation && (
            <Alert className="border-blue-500/30 bg-blue-500/10">
              <Wrench className="h-4 w-4 text-blue-400" />
              <AlertTitle className="text-blue-400 text-sm">
                Recommended Action
              </AlertTitle>
              <AlertDescription className="text-blue-400/80 text-sm">
                {log.recommendation}
              </AlertDescription>
            </Alert>
          )}

          {log.stackTrace && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Stack Trace
              </Label>
              <div className="p-3 rounded-md bg-red-500/5 border border-red-500/20 font-mono text-xs overflow-x-auto">
                <pre className="text-red-400">{log.stackTrace}</pre>
              </div>
            </div>
          )}

          {log.payload && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Payload</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs gap-1"
                  onClick={() => setShowRawPayload(!showRawPayload)}
                >
                  {showRawPayload ? (
                    <Eye className="h-3 w-3" />
                  ) : (
                    <FileJson className="h-3 w-3" />
                  )}
                  {showRawPayload ? "Formatted" : "Raw JSON"}
                </Button>
              </div>
              <div className="p-3 rounded-md bg-secondary/50 font-mono text-xs overflow-x-auto">
                <pre className="text-foreground">
                  {showRawPayload
                    ? JSON.stringify(log.payload, null, 2)
                    : JSON.stringify(log.payload)}
                </pre>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button variant="outline" className="gap-2">
            <Link2 className="h-4 w-4" />
            View Correlated Logs
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TimelineView({ logs }: { logs: IntegrationLog[] }) {
  const hourlyData = React.useMemo(() => {
    const groups: Record<
      string,
      {
        hour: string;
        total: number;
        errors: number;
        warnings: number;
        success: number;
      }
    > = {};
    logs.forEach((log) => {
      const hour = log.timestamp.substring(0, 13) + ":00";
      if (!groups[hour]) {
        groups[hour] = { hour, total: 0, errors: 0, warnings: 0, success: 0 };
      }
      groups[hour].total++;
      if (log.severity === "error" || log.severity === "critical")
        groups[hour].errors++;
      else if (log.severity === "warning") groups[hour].warnings++;
      else groups[hour].success++;
    });
    return Object.values(groups)
      .sort((a, b) => a.hour.localeCompare(b.hour))
      .slice(-12);
  }, [logs]);

  const maxTotal = Math.max(...hourlyData.map((h) => h.total), 1);

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            Activity Timeline (Last 12 Hours)
          </CardTitle>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground">Success</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">Warning</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-muted-foreground">Error</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {hourlyData.map((group) => (
            <div key={group.hour} className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{group.hour.substring(11, 16)}</span>
                <span>{group.total} events</span>
              </div>
              <div className="flex h-6 rounded-full overflow-hidden bg-secondary">
                <div
                  className="h-full bg-emerald-500 transition-all"
                  style={{ width: `${(group.success / maxTotal) * 100}%` }}
                />
                <div
                  className="h-full bg-amber-500 transition-all"
                  style={{ width: `${(group.warnings / maxTotal) * 100}%` }}
                />
                <div
                  className="h-full bg-red-500 transition-all"
                  style={{ width: `${(group.errors / maxTotal) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LogsTable({
  logs,
  onViewDetail,
}: {
  logs: IntegrationLog[];
  onViewDetail: (log: IntegrationLog) => void;
}) {
  return (
    <div className="rounded-md border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Timestamp
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Source
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Event
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Impact
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Message
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Correlation
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {logs.map((log) => {
              const sourceConf = sourceConfig[log.source];
              const severityConf = severityConfig[log.severity];
              const ImpactIcon = impactConfig[log.impact].icon;

              return (
                <tr
                  key={log.id}
                  className="hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => onViewDetail(log)}
                >
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                    {formatTimestamp(log.timestamp)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded",
                          sourceConf.bgColor,
                        )}
                      >
                        <sourceConf.icon
                          className={cn("h-4 w-4", sourceConf.color)}
                        />
                      </div>
                      <span className="text-sm">{log.sourceName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className="text-xs">
                      {log.eventType}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs gap-1",
                        severityConf.bgColor,
                        severityConf.color,
                        severityConf.borderColor,
                      )}
                    >
                      <severityConf.icon className="h-3 w-3" />
                      {severityConf.label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <ImpactIcon className="h-3.5 w-3.5" />
                      <span className="text-xs capitalize">{log.impact}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm truncate max-w-xs block">
                      {log.message}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                      {log.correlationId.substring(0, 12)}...
                    </code>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
        <span className="text-xs text-muted-foreground">
          Showing {logs.length} of {mockLogs.length} logs
        </span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

function RetentionPolicyCard() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          Log Retention Policy
        </CardTitle>
        <CardDescription>Data retention depends on your plan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-md bg-secondary/50">
            <p className="text-xs text-muted-foreground">Free Plan</p>
            <p className="text-lg font-semibold">7 days</p>
            <p className="text-xs text-muted-foreground">10K events</p>
          </div>
          <div className="p-3 rounded-md bg-secondary/50">
            <p className="text-xs text-muted-foreground">Starter</p>
            <p className="text-lg font-semibold">30 days</p>
            <p className="text-xs text-muted-foreground">100K events</p>
          </div>
          <div className="p-3 rounded-md bg-secondary/50">
            <p className="text-xs text-muted-foreground">Professional</p>
            <p className="text-lg font-semibold">90 days</p>
            <p className="text-xs text-muted-foreground">1M events</p>
          </div>
          <div className="p-3 rounded-md bg-secondary/50">
            <p className="text-xs text-muted-foreground">Enterprise</p>
            <p className="text-lg font-semibold">365 days</p>
            <p className="text-xs text-muted-foreground">10M events</p>
          </div>
        </div>
        <Alert className="border-blue-500/30 bg-blue-500/10">
          <Info className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-400/80 text-xs">
            Self-hosted instances can configure retention from 7 to 730 days in
            settings.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

function AlertsMonitoringCard() {
  const alerts = [
    {
      type: "degraded",
      message: "Redis Cache experiencing connection issues",
      count: 1,
    },
    { type: "error", message: "HRIS webhook failing delivery", count: 1 },
    { type: "warning", message: "Azure AD sync with 3 warnings", count: 1 },
  ];

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Active Alerts
          </CardTitle>
          <Badge variant="destructive" className="text-xs">
            {alerts.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-2 rounded-md bg-secondary/50"
          >
            <div
              className={cn(
                "h-2 w-2 rounded-full mt-1.5",
                alert.type === "error"
                  ? "bg-red-500"
                  : alert.type === "warning"
                    ? "bg-amber-500"
                    : "bg-blue-500",
              )}
            />
            <div className="flex-1">
              <p className="text-xs">{alert.message}</p>
              <Button
                variant="link"
                size="sm"
                className="h-5 text-xs p-0 mt-0.5"
              >
                View details <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function IntegrationLogsPage() {
  const [logs] = React.useState<IntegrationLog[]>(mockLogs);
  const [selectedLog, setSelectedLog] = React.useState<IntegrationLog | null>(
    null,
  );
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<"table" | "timeline">("table");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterSource, setFilterSource] = React.useState<
    IntegrationSource | "all"
  >("all");
  const [filterSeverity, setFilterSeverity] = React.useState<
    LogSeverity | "all"
  >("all");
  const [filterImpact, setFilterImpact] = React.useState<EventImpact | "all">(
    "all",
  );

  const filteredLogs = React.useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.correlationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.sourceName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSource =
        filterSource === "all" || log.source === filterSource;
      const matchesSeverity =
        filterSeverity === "all" || log.severity === filterSeverity;
      const matchesImpact =
        filterImpact === "all" || log.impact === filterImpact;
      return matchesSearch && matchesSource && matchesSeverity && matchesImpact;
    });
  }, [logs, searchQuery, filterSource, filterSeverity, filterImpact]);

  const criticalCount = logs.filter((l) => l.severity === "critical").length;
  const errorCount = logs.filter((l) => l.severity === "error").length;

  return (
    <TooltipProvider>
      <div className="space-y-6 text-foreground">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-card-foreground">
                Identity Integration Logs
              </h1>
              {(criticalCount > 0 || errorCount > 0) && (
                <Badge variant="destructive" className="text-xs gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {criticalCount + errorCount} issues
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Centralized monitoring and investigation of all integration
              activity
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        <ContextOverview
          authority="Acme Corporation"
          workspace="Production"
          role="Identity Administrator"
          accessLevel="Full log access"
          isPrivileged={true}
          lastLogin="Today, 9:42 AM"
        />

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "h-2 w-2 rounded-full animate-pulse",
                errorCount > 0 ? "bg-red-500" : "bg-emerald-500",
              )}
            />
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Activity Overview
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <MetricCard
              title="24h Events"
              value={formatNumber(mockStats.totalEvents24h)}
              subtitle="Last 24 hours"
              icon={Activity}
              trend={{ value: 8.5, isPositive: true }}
            />
            <MetricCard
              title="Critical"
              value={mockStats.criticalErrors24h}
              subtitle="Last 24h"
              icon={XCircle}
              variant={
                mockStats.criticalErrors24h > 0 ? "destructive" : "default"
              }
            />
            <MetricCard
              title="Active"
              value={mockStats.activeIntegrations}
              subtitle="Integrations"
              icon={CheckCircle2}
              variant="accent"
            />
            <MetricCard
              title="Degraded"
              value={mockStats.degradedIntegrations}
              subtitle="Need attention"
              icon={AlertTriangle}
              variant={
                mockStats.degradedIntegrations > 0 ? "warning" : "default"
              }
            />
            <MetricCard
              title="Success Rate"
              value={`${mockStats.successRate24h}%`}
              subtitle="24h average"
              icon={Zap}
              variant={mockStats.successRate24h >= 99 ? "default" : "warning"}
            />
          </div>

          {(criticalCount > 0 || errorCount > 0) && (
            <Alert
              variant="destructive"
              className="border-red-500/30 bg-red-500/10"
            >
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertTitle className="text-red-400">
                {criticalCount} Critical, {errorCount} Errors Detected
              </AlertTitle>
              <AlertDescription className="text-red-400/80">
                Review the logs below to identify and resolve issues affecting
                integration health.
              </AlertDescription>
            </Alert>
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Integration Activity
                </h2>
                <div className="flex items-center gap-2">
                  <ToggleGroup
                    type="single"
                    value={viewMode}
                    onValueChange={(value: string | undefined) => {
                      if (value) setViewMode(value as "table" | "timeline");
                    }}
                  >
                    <ToggleGroupItem
                      value="table"
                      className="h-8 px-3 text-xs gap-1.5"
                    >
                      <Terminal className="h-3.5 w-3.5" />
                      Table
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="timeline"
                      className="h-8 px-3 text-xs gap-1.5"
                    >
                      <Activity className="h-3.5 w-3.5" />
                      Timeline
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>

              {viewMode === "table" ? (
                <>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search logs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Select
                        value={filterSource}
                        onValueChange={(v) =>
                          setFilterSource(v as IntegrationSource | "all")
                        }
                      >
                        <SelectTrigger className="w-[140px] h-8">
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
                        value={filterSeverity}
                        onValueChange={(v) =>
                          setFilterSeverity(v as LogSeverity | "all")
                        }
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue placeholder="Severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Levels</SelectItem>
                          {Object.entries(severityConfig).map(
                            ([key, config]) => (
                              <SelectItem key={key} value={key}>
                                {config.label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      <Select
                        value={filterImpact}
                        onValueChange={(v) =>
                          setFilterImpact(v as EventImpact | "all")
                        }
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue placeholder="Impact" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Impact</SelectItem>
                          {Object.entries(impactConfig).map(([key, config]) => (
                            <SelectItem key={key} value={key}>
                              {config.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <LogsTable
                    logs={filteredLogs}
                    onViewDetail={(log) => {
                      setSelectedLog(log);
                      setIsDetailOpen(true);
                    }}
                  />
                </>
              ) : (
                <TimelineView logs={logs} />
              )}
            </section>
          </div>

          <div className="space-y-6">
            <RetentionPolicyCard />
            <AlertsMonitoringCard />

            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                  Quick Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/admin/integrations/services">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between h-8 text-xs"
                  >
                    <span className="flex items-center gap-2">
                      <Server className="h-3.5 w-3.5" />
                      Services Configuration
                    </span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Link href="/admin/integrations/webhooks">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between h-8 text-xs"
                  >
                    <span className="flex items-center gap-2">
                      <Webhook className="h-3.5 w-3.5" />
                      Webhooks Management
                    </span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Link href="/admin/integrations/scim">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between h-8 text-xs"
                  >
                    <span className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5" />
                      SCIM Provisioning
                    </span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Link href="/admin/integrations/directory">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between h-8 text-xs"
                  >
                    <span className="flex items-center gap-2">
                      <FolderSync className="h-3.5 w-3.5" />
                      Directory Sync
                    </span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <LogDetailDialog
        log={selectedLog}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </TooltipProvider>
  );
}
