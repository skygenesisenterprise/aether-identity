"use client";

import * as React from "react";
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
  Activity,
  AlertCircle,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Database,
  Download,
  ExternalLink,
  FileText,
  Filter,
  Globe,
  History,
  Layers,
  LayoutGrid,
  Lock,
  LucideIcon,
  MinusCircle,
  RefreshCw,
  Search,
  Server,
  Settings,
  Shield,
  ShieldAlert,
  Sparkles,
  Terminal,
  TrendingUp,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dashboard/ui/dialog";
import { Switch } from "@/components/dashboard/ui/switch";
import { Label } from "@/components/dashboard/ui/label";
import { Slider } from "@/components/dashboard/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/dashboard/ui/select";
import { useState } from "react";

// ============================================================================
// TYPES - Enterprise Observability Platform
// ============================================================================

type SignalStatus = "healthy" | "degraded" | "critical" | "disabled";
type DeploymentMode = "saas_cloud" | "self_hosted" | "hybrid";
type PlanTier = "free" | "pro" | "enterprise";
type EnvironmentType = "production" | "staging" | "development";

interface OrganizationContext {
  id: string;
  name: string;
  plan: PlanTier;
  environment: EnvironmentType;
  region: string;
  deploymentMode: DeploymentMode;
}

interface SignalConfig {
  status: SignalStatus;
  enabled: boolean;
  collectionRate: number;
  retentionDays: number;
  lastSampleTime: string;
  samplingRate?: number;
  storageUsed: string;
  storageLimit: string;
}

interface ServiceHealth {
  id: string;
  name: string;
  category: "core" | "supporting" | "integration";
  status: SignalStatus;
  uptime: string;
  latency: string;
  errorRate: string;
  lastCheck: string;
  signals: {
    metrics: boolean;
    logs: boolean;
    traces: boolean;
  };
}

interface AlertRule {
  id: string;
  name: string;
  severity: "critical" | "high" | "medium" | "low";
  condition: string;
  status: "active" | "paused";
  lastTriggered?: string;
  triggerCount24h: number;
}

interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  correlationId: string;
  severity: "info" | "warning" | "error";
}

interface RetentionPolicy {
  metrics: number;
  logs: number;
  traces: number;
  audits: number;
  complianceStandard?: string;
}

// ============================================================================
// MOCK DATA - Enterprise Observability Context
// ============================================================================

const orgContext: OrganizationContext = {
  id: "org_2vPqN7xYz",
  name: "Acme Corporation",
  plan: "enterprise",
  environment: "production",
  region: "us-east-1",
  deploymentMode: "saas_cloud",
};

const signalConfigs: Record<string, SignalConfig> = {
  metrics: {
    status: "healthy",
    enabled: true,
    collectionRate: 99.8,
    retentionDays: 90,
    lastSampleTime: "Just now",
    storageUsed: "2.4 TB",
    storageLimit: "10 TB",
  },
  logs: {
    status: "healthy",
    enabled: true,
    collectionRate: 99.9,
    retentionDays: 180,
    lastSampleTime: "Just now",
    storageUsed: "8.7 TB",
    storageLimit: "50 TB",
  },
  traces: {
    status: "degraded",
    enabled: true,
    collectionRate: 85.2,
    samplingRate: 10,
    retentionDays: 14,
    lastSampleTime: "2 minutes ago",
    storageUsed: "450 GB",
    storageLimit: "5 TB",
  },
};

const servicesHealth: ServiceHealth[] = [
  {
    id: "svc-identity-api",
    name: "Identity API",
    category: "core",
    status: "healthy",
    uptime: "99.99%",
    latency: "45ms",
    errorRate: "0.01%",
    lastCheck: "10s ago",
    signals: { metrics: true, logs: true, traces: true },
  },
  {
    id: "svc-auth-engine",
    name: "Authentication Engine",
    category: "core",
    status: "healthy",
    uptime: "99.97%",
    latency: "23ms",
    errorRate: "0.00%",
    lastCheck: "15s ago",
    signals: { metrics: true, logs: true, traces: true },
  },
  {
    id: "svc-session-manager",
    name: "Session Manager",
    category: "core",
    status: "healthy",
    uptime: "99.95%",
    latency: "12ms",
    errorRate: "0.02%",
    lastCheck: "12s ago",
    signals: { metrics: true, logs: true, traces: false },
  },
  {
    id: "svc-policy-engine",
    name: "Policy Engine",
    category: "core",
    status: "degraded",
    uptime: "98.45%",
    latency: "180ms",
    errorRate: "0.15%",
    lastCheck: "8s ago",
    signals: { metrics: true, logs: true, traces: true },
  },
  {
    id: "svc-database",
    name: "PostgreSQL Primary",
    category: "supporting",
    status: "healthy",
    uptime: "99.99%",
    latency: "3ms",
    errorRate: "0.00%",
    lastCheck: "5s ago",
    signals: { metrics: true, logs: true, traces: false },
  },
  {
    id: "svc-cache",
    name: "Redis Cluster",
    category: "supporting",
    status: "healthy",
    uptime: "99.98%",
    latency: "1ms",
    errorRate: "0.00%",
    lastCheck: "7s ago",
    signals: { metrics: true, logs: false, traces: false },
  },
  {
    id: "svc-message-queue",
    name: "Message Queue",
    category: "supporting",
    status: "healthy",
    uptime: "99.96%",
    latency: "8ms",
    errorRate: "0.01%",
    lastCheck: "11s ago",
    signals: { metrics: true, logs: true, traces: false },
  },
  {
    id: "svc-audit-logs",
    name: "Audit Log Processor",
    category: "supporting",
    status: "healthy",
    uptime: "99.99%",
    latency: "25ms",
    errorRate: "0.00%",
    lastCheck: "9s ago",
    signals: { metrics: true, logs: true, traces: false },
  },
  {
    id: "svc-smtp",
    name: "Email Gateway",
    category: "integration",
    status: "healthy",
    uptime: "99.89%",
    latency: "120ms",
    errorRate: "0.05%",
    lastCheck: "20s ago",
    signals: { metrics: true, logs: true, traces: false },
  },
  {
    id: "svc-sms",
    name: "SMS Provider",
    category: "integration",
    status: "disabled",
    uptime: "N/A",
    latency: "N/A",
    errorRate: "N/A",
    lastCheck: "1h ago",
    signals: { metrics: false, logs: true, traces: false },
  },
];

const alertRules: AlertRule[] = [
  {
    id: "alert-001",
    name: "High Error Rate",
    severity: "critical",
    condition: "error_rate > 1% for 5m",
    status: "active",
    lastTriggered: "3 hours ago",
    triggerCount24h: 0,
  },
  {
    id: "alert-002",
    name: "Latency Spike",
    severity: "high",
    condition: "p99_latency > 500ms for 10m",
    status: "active",
    lastTriggered: "15 minutes ago",
    triggerCount24h: 2,
  },
  {
    id: "alert-003",
    name: "Service Down",
    severity: "critical",
    condition: "service_health == 0 for 1m",
    status: "active",
    lastTriggered: "2 days ago",
    triggerCount24h: 0,
  },
  {
    id: "alert-004",
    name: "Storage Threshold",
    severity: "medium",
    condition: "storage_usage > 80%",
    status: "paused",
    triggerCount24h: 0,
  },
  {
    id: "alert-005",
    name: "Failed Auth Spike",
    severity: "high",
    condition: "failed_auth > 100/min for 5m",
    status: "active",
    lastTriggered: "1 hour ago",
    triggerCount24h: 5,
  },
];

const recentAuditEvents: AuditEvent[] = [
  {
    id: "evt-001",
    timestamp: "2026-02-12T14:23:45Z",
    actor: "admin@acme.com",
    action: "VIEW",
    resource: "observability_dashboard",
    correlationId: "corr_7a3f9e2b",
    severity: "info",
  },
  {
    id: "evt-002",
    timestamp: "2026-02-12T14:20:12Z",
    actor: "system",
    action: "ALERT_TRIGGERED",
    resource: "alert-002",
    correlationId: "corr_9b2e4d1c",
    severity: "warning",
  },
  {
    id: "evt-003",
    timestamp: "2026-02-12T14:15:33Z",
    actor: "secops@acme.com",
    action: "EXPORT",
    resource: "logs_2026-02-12",
    correlationId: "corr_4f8a6e3d",
    severity: "info",
  },
  {
    id: "evt-004",
    timestamp: "2026-02-12T14:10:08Z",
    actor: "system",
    action: "CONFIG_CHANGED",
    resource: "trace_sampling_rate",
    correlationId: "corr_1c5e7a9f",
    severity: "info",
  },
  {
    id: "evt-005",
    timestamp: "2026-02-12T13:58:22Z",
    actor: "devops@acme.com",
    action: "MUTE_ALERT",
    resource: "alert-004",
    correlationId: "corr_6d2b8e4a",
    severity: "warning",
  },
];

const retentionPolicy: RetentionPolicy = {
  metrics: 90,
  logs: 180,
  traces: 14,
  audits: 2555, // 7 years
  complianceStandard: "SOC2",
};

// ============================================================================
// CONFIGURATION HELPERS
// ============================================================================

const statusConfig: Record<
  SignalStatus,
  { label: string; icon: LucideIcon; color: string; bgColor: string }
> = {
  healthy: {
    label: "Healthy",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  degraded: {
    label: "Degraded",
    icon: AlertTriangle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  critical: {
    label: "Critical",
    icon: AlertCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  disabled: {
    label: "Disabled",
    icon: MinusCircle,
    color: "text-slate-400",
    bgColor: "bg-slate-500/10",
  },
};

const severityConfig: Record<
  string,
  { color: string; bgColor: string; label: string }
> = {
  critical: {
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    label: "Critical",
  },
  high: {
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    label: "High",
  },
  medium: {
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    label: "Medium",
  },
  low: {
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    label: "Low",
  },
};

const planConfig: Record<PlanTier, { label: string; color: string }> = {
  free: { label: "Free", color: "text-slate-500" },
  pro: { label: "Pro", color: "text-blue-500" },
  enterprise: { label: "Enterprise", color: "text-purple-500" },
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function StatusBadge({ status }: { status: SignalStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      className={cn(
        "h-6 px-2 text-xs font-medium border-0",
        config.bgColor,
        config.color,
      )}
    >
      <Icon className="h-3 w-3 mr-1" />
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

function SignalIndicator({ active }: { active: boolean }) {
  return (
    <div
      className={cn(
        "h-2 w-2 rounded-full",
        active ? "bg-emerald-500" : "bg-slate-300",
      )}
    />
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; isPositive: boolean };
  variant?: "default" | "accent" | "warning" | "destructive";
}) {
  const variantStyles = {
    default: "bg-card",
    accent: "bg-blue-500/5 border-blue-500/20",
    warning: "bg-amber-500/5 border-amber-500/20",
    destructive: "bg-red-500/5 border-red-500/20",
  };

  return (
    <Card className={cn("border", variantStyles[variant])}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            <p className="text-2xl font-semibold">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <div
                className={cn(
                  "flex items-center gap-1 text-xs",
                  trend.isPositive ? "text-emerald-500" : "text-red-500",
                )}
              >
                <TrendingUp className="h-3 w-3" />
                <span>{trend.value}%</span>
              </div>
            )}
          </div>
          <div className="p-2 rounded-md bg-secondary">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SignalCard({
  title,
  icon: Icon,
  signal,
  plan,
}: {
  title: string;
  icon: LucideIcon;
  signal: SignalConfig;
  plan: PlanTier;
}) {
  const storagePercent =
    (parseFloat(signal.storageUsed) / parseFloat(signal.storageLimit)) * 100;

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-md bg-secondary">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
          </div>
          <StatusBadge status={signal.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Collection Rate */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Collection Rate</span>
            <span className="font-medium">{signal.collectionRate}%</span>
          </div>
          <Progress value={signal.collectionRate} className="h-1.5" />
        </div>

        {/* Storage Usage */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Storage Used</span>
            <span className="font-medium">
              {signal.storageUsed} / {signal.storageLimit}
            </span>
          </div>
          <Progress value={storagePercent} className="h-1.5" />
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="space-y-0.5">
            <span className="text-muted-foreground">Retention</span>
            <p className="font-medium">{signal.retentionDays} days</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-muted-foreground">Last Sample</span>
            <p className="font-medium">{signal.lastSampleTime}</p>
          </div>
          {signal.samplingRate && (
            <div className="space-y-0.5">
              <span className="text-muted-foreground">Sampling</span>
              <p className="font-medium">{signal.samplingRate}%</p>
            </div>
          )}
          <div className="space-y-0.5">
            <span className="text-muted-foreground">Status</span>
            <p className="font-medium">
              {signal.enabled ? "Active" : "Paused"}
            </p>
          </div>
        </div>

        {plan !== "enterprise" && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              <Lock className="h-3 w-3 inline mr-1" />
              <span className="font-medium text-foreground">
                Enterprise
              </span>{" "}
              upgrade available for extended retention
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function ObservabilityPage() {
  const healthyServices = servicesHealth.filter(
    (s) => s.status === "healthy",
  ).length;
  const degradedServices = servicesHealth.filter(
    (s) => s.status === "degraded",
  ).length;
  const criticalServices = servicesHealth.filter(
    (s) => s.status === "critical",
  ).length;
  const activeAlerts = alertRules.filter((a) => a.status === "active").length;

  return (
    <div className="space-y-8 text-foreground">
      {/* ========================================================================
          HEADER SECTION
          Context organization, plan, and environment
          ======================================================================== */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-semibold text-card-foreground">
              Identity Observability
            </h1>
            <PlanBadge plan={orgContext.plan} />
            <Badge variant="outline" className="h-5 text-xs capitalize">
              <Globe className="h-3 w-3 mr-1" />
              {orgContext.region}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Enterprise monitoring, logging, and tracing for {orgContext.name}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Grafana
          </Button>
        </div>
      </div>

      {/* ========================================================================
          SECTION 1: PLATFORM HEALTH OVERVIEW
          Critical KPIs and system status
          ======================================================================== */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-2 w-2 rounded-full",
              criticalServices > 0
                ? "bg-red-500 animate-pulse"
                : degradedServices > 0
                  ? "bg-amber-500"
                  : "bg-emerald-500",
            )}
          />
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Platform Health Overview
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Healthy Services"
            value={healthyServices}
            subtitle={`of ${servicesHealth.length} total`}
            icon={CheckCircle2}
            variant="default"
          />
          <MetricCard
            title="Degraded Services"
            value={degradedServices}
            subtitle="Requires attention"
            icon={AlertTriangle}
            variant={degradedServices > 0 ? "warning" : "default"}
          />
          <MetricCard
            title="Active Alerts"
            value={activeAlerts}
            subtitle={`${alertRules.filter((a) => a.triggerCount24h > 0).length} triggered today`}
            icon={ShieldAlert}
            variant={activeAlerts > 0 ? "destructive" : "default"}
          />
          <MetricCard
            title="Data Ingestion"
            value="2.3M/min"
            subtitle="Metrics, logs & traces"
            icon={Activity}
            variant="accent"
          />
        </div>
      </section>

      {/* ========================================================================
          SECTION 2: SIGNAL CONFIGURATION
          Metrics, Logs, Traces configuration and status
          ======================================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Signal Configuration
          </h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span>Admin access required</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SignalCard
            title="Metrics"
            icon={BarChart3}
            signal={signalConfigs.metrics}
            plan={orgContext.plan}
          />
          <SignalCard
            title="Logs"
            icon={FileText}
            signal={signalConfigs.logs}
            plan={orgContext.plan}
          />
          <SignalCard
            title="Distributed Traces"
            icon={Layers}
            signal={signalConfigs.traces}
            plan={orgContext.plan}
          />
        </div>
      </section>

      {/* ========================================================================
          SECTION 3: SERVICE HEALTH & MONITORING
          Detailed service status and signal coverage
          ======================================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Service Health & Signals
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              <Filter className="h-3 w-3 mr-1" />
              Filter
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
          </div>
        </div>

        <Card className="border-border">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[200px]">Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Metrics</TableHead>
                  <TableHead className="text-center">Logs</TableHead>
                  <TableHead className="text-center">Traces</TableHead>
                  <TableHead>Uptime</TableHead>
                  <TableHead>Latency</TableHead>
                  <TableHead>Error Rate</TableHead>
                  <TableHead className="text-right">Last Check</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {servicesHealth.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-foreground">
                          {service.name}
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {service.category}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={service.status} />
                    </TableCell>
                    <TableCell className="text-center">
                      <SignalIndicator active={service.signals.metrics} />
                    </TableCell>
                    <TableCell className="text-center">
                      <SignalIndicator active={service.signals.logs} />
                    </TableCell>
                    <TableCell className="text-center">
                      <SignalIndicator active={service.signals.traces} />
                    </TableCell>
                    <TableCell className="font-medium">
                      {service.uptime}
                    </TableCell>
                    <TableCell>{service.latency}</TableCell>
                    <TableCell>{service.errorRate}</TableCell>
                    <TableCell className="text-right text-muted-foreground text-sm">
                      {service.lastCheck}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* ========================================================================
          SECTION 4: ALERTS & MONITORING
          Alert rules and recent triggers
          ======================================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Alert Rules & Monitoring
          </h2>
          <Button variant="ghost" size="sm" className="h-8 text-xs">
            Manage Rules
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                Active Alert Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Rule Name</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Triggers (24h)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alertRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell>
                        <div className="font-medium text-sm">{rule.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {rule.condition}
                        </div>
                      </TableCell>
                      <TableCell>
                        <SeverityBadge severity={rule.severity} />
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            rule.status === "active" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {rule.status === "active" ? "Active" : "Paused"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {rule.triggerCount24h}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <History className="h-4 w-4 text-muted-foreground" />
                Recent Audit Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentAuditEvents.slice(0, 4).map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full mt-1.5 shrink-0",
                      event.severity === "error"
                        ? "bg-red-500"
                        : event.severity === "warning"
                          ? "bg-amber-500"
                          : "bg-blue-500",
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium truncate">
                        {event.action}
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {event.actor} → {event.resource}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                      ID: {event.correlationId}
                    </p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full h-8 text-xs" size="sm">
                <Search className="h-3 w-3 mr-1" />
                View All Events
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ========================================================================
          SECTION 5: GOVERNANCE & COMPLIANCE
          Retention policies, RBAC, and compliance
          ======================================================================== */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Governance & Compliance
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                Data Retention Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Metrics</span>
                  <span className="font-medium">
                    {retentionPolicy.metrics} days
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Logs</span>
                  <span className="font-medium">
                    {retentionPolicy.logs} days
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Traces</span>
                  <span className="font-medium">
                    {retentionPolicy.traces} days
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Audit Events</span>
                  <span className="font-medium">
                    {Math.round(retentionPolicy.audits / 365)} years
                  </span>
                </div>
              </div>
              {retentionPolicy.complianceStandard && (
                <div className="pt-3 border-t border-border">
                  <Badge variant="outline" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    {retentionPolicy.complianceStandard} Compliant
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                Access Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    View Observability
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    Admin, SecOps
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Export Data</span>
                  <Badge variant="secondary" className="text-xs">
                    Admin only
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Modify Alerts</span>
                  <Badge variant="secondary" className="text-xs">
                    Admin only
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">View PII</span>
                  <Badge variant="secondary" className="text-xs">
                    Superadmin
                  </Badge>
                </div>
              </div>
              <div className="pt-3 border-t border-border text-xs text-muted-foreground">
                <Shield className="h-3 w-3 inline mr-1" />
                All access is logged and audited
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Server className="h-4 w-4 text-muted-foreground" />
                Deployment Context
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mode</span>
                  <Badge variant="outline" className="text-xs capitalize">
                    {orgContext.deploymentMode.replace("_", " ")}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Environment</span>
                  <span className="font-medium capitalize">
                    {orgContext.environment}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Region</span>
                  <span className="font-medium">{orgContext.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Org ID</span>
                  <span className="font-mono text-xs">{orgContext.id}</span>
                </div>
              </div>
              <div className="pt-3 border-t border-border">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <Terminal className="h-3 w-3 mr-1" />
                  View API Status
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ========================================================================
          SECTION 6: EXTERNAL INTEGRATIONS
          Third-party observability tools and exporters
          ======================================================================== */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          External Integrations
        </h2>

        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                Connected Observability Platforms
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                Enterprise Feature
              </Badge>
            </div>
            <CardDescription>
              Export telemetry data to your existing observability stack
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "Grafana Cloud", status: "connected", type: "Metrics" },
                {
                  name: "Datadog",
                  status: "connected",
                  type: "Metrics & Logs",
                },
                { name: "Splunk", status: "configured", type: "Logs" },
                { name: "Jaeger", status: "disabled", type: "Traces" },
              ].map((integration) => (
                <div
                  key={integration.name}
                  className="p-4 rounded-lg border border-border bg-card"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">
                      {integration.name}
                    </span>
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        integration.status === "connected"
                          ? "bg-emerald-500"
                          : integration.status === "configured"
                            ? "bg-amber-500"
                            : "bg-slate-300",
                      )}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {integration.type}
                  </p>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      integration.status === "connected"
                        ? "text-emerald-500 border-emerald-500/30"
                        : integration.status === "configured"
                          ? "text-amber-500 border-amber-500/30"
                          : "text-slate-400",
                    )}
                  >
                    {integration.status === "connected"
                      ? "Connected"
                      : integration.status === "configured"
                        ? "Configured"
                        : "Disabled"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ========================================================================
          SECTION 7: PLAN LIMITATIONS & UPGRADE
          SaaS-specific plan information
          ======================================================================== */}
      {orgContext.plan !== "enterprise" && (
        <Card className="border-purple-500/30 bg-purple-500/5">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-500" />
                  <h3 className="font-semibold text-foreground">
                    Unlock Enterprise Observability
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  Upgrade to Enterprise for unlimited retention, advanced
                  alerting, custom dashboards, and multi-region support.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-purple-500" />
                    <span>Unlimited retention</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-purple-500" />
                    <span>Custom alert rules</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-purple-500" />
                    <span>Advanced analytics</span>
                  </div>
                </div>
              </div>
              <Button className="shrink-0">
                Upgrade to Enterprise
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ========================================================================
          FOOTER: DOCUMENTATION & SUPPORT
          ======================================================================== */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          <Info className="h-3 w-3 inline mr-1" />
          All timestamps are in UTC. Data is refreshed every 30 seconds.
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

// Info icon component for footer
function Info({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
