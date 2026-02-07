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
  BarChart3,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Gauge,
  HelpCircle,
  Info,
  Layers,
  LucideIcon,
  MinusCircle,
  RefreshCw,
  Shield,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  Thermometer,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
type SignalStatus = "enabled" | "disabled" | "partial";
type SignalQuality = "full" | "partial" | "minimal" | "none";
type DeploymentMode = "docker" | "iso" | "managed";

interface SignalConfig {
  status: SignalStatus;
  lastSampleTime?: string;
  details: Record<string, string>;
}

interface ObservabilitySignals {
  metrics: SignalConfig;
  logs: SignalConfig;
  traces: SignalConfig;
}

interface ServiceObservability {
  id: string;
  name: string;
  category: "core" | "supporting" | "external";
  metrics: boolean;
  logs: boolean;
  traces: boolean;
  signalQuality: SignalQuality;
  lastSignalReceived: string;
}

interface ExternalIntegration {
  detected: boolean;
  standards: string[];
  exporters: string[];
}

// Mock data
const observabilitySignals: ObservabilitySignals = {
  metrics: {
    status: "enabled",
    lastSampleTime: "2 minutes ago",
    details: {
      collectionMode: "Internal",
      scope: "All services",
      retention: "30 days",
    },
  },
  logs: {
    status: "enabled",
    lastSampleTime: "Just now",
    details: {
      destination: "Local",
      retention: "90 days",
      compression: "Enabled",
    },
  },
  traces: {
    status: "partial",
    lastSampleTime: "5 minutes ago",
    details: {
      samplingMode: "Probabilistic (10%)",
      propagation: "Internal",
      retention: "7 days",
    },
  },
};

const servicesObservability: ServiceObservability[] = [
  {
    id: "identity-api",
    name: "Identity API",
    category: "core",
    metrics: true,
    logs: true,
    traces: true,
    signalQuality: "full",
    lastSignalReceived: "1 minute ago",
  },
  {
    id: "authentication-engine",
    name: "Authentication Engine",
    category: "core",
    metrics: true,
    logs: true,
    traces: true,
    signalQuality: "full",
    lastSignalReceived: "2 minutes ago",
  },
  {
    id: "authorization-engine",
    name: "Authorization Engine",
    category: "core",
    metrics: true,
    logs: true,
    traces: false,
    signalQuality: "partial",
    lastSignalReceived: "3 minutes ago",
  },
  {
    id: "session-manager",
    name: "Session Manager",
    category: "core",
    metrics: true,
    logs: true,
    traces: true,
    signalQuality: "full",
    lastSignalReceived: "Just now",
  },
  {
    id: "token-service",
    name: "Token Service",
    category: "core",
    metrics: true,
    logs: true,
    traces: false,
    signalQuality: "partial",
    lastSignalReceived: "4 minutes ago",
  },
  {
    id: "database",
    name: "Database",
    category: "supporting",
    metrics: true,
    logs: true,
    traces: false,
    signalQuality: "partial",
    lastSignalReceived: "1 minute ago",
  },
  {
    id: "cache",
    name: "Cache",
    category: "supporting",
    metrics: true,
    logs: false,
    traces: false,
    signalQuality: "minimal",
    lastSignalReceived: "2 minutes ago",
  },
  {
    id: "message-queue",
    name: "Message Queue",
    category: "supporting",
    metrics: true,
    logs: true,
    traces: false,
    signalQuality: "partial",
    lastSignalReceived: "5 minutes ago",
  },
  {
    id: "audit-logs",
    name: "Audit / Logs",
    category: "supporting",
    metrics: true,
    logs: true,
    traces: false,
    signalQuality: "partial",
    lastSignalReceived: "1 minute ago",
  },
  {
    id: "smtp",
    name: "SMTP / Email",
    category: "external",
    metrics: false,
    logs: true,
    traces: false,
    signalQuality: "minimal",
    lastSignalReceived: "10 minutes ago",
  },
  {
    id: "sms-gateway",
    name: "SMS Gateway",
    category: "external",
    metrics: false,
    logs: true,
    traces: false,
    signalQuality: "minimal",
    lastSignalReceived: "15 minutes ago",
  },
  {
    id: "external-idp",
    name: "External IdP Bridge",
    category: "external",
    metrics: false,
    logs: true,
    traces: false,
    signalQuality: "minimal",
    lastSignalReceived: "8 minutes ago",
  },
];

const externalIntegration: ExternalIntegration = {
  detected: false,
  standards: ["OpenTelemetry", "Prometheus-compatible"],
  exporters: [],
};

const deploymentContext: {
  mode: DeploymentMode;
  description: string;
  limitations: string[];
} = {
  mode: "docker",
  description: "Docker / Local deployment",
  limitations: [
    "Metrics collection limited to local scope",
    "Log aggregation not configured",
    "Trace sampling reduced to conserve resources",
  ],
};

// Configuration helpers
const signalStatusConfig: Record<
  SignalStatus,
  { label: string; icon: LucideIcon; color: string; bgColor: string }
> = {
  enabled: {
    label: "Enabled",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  partial: {
    label: "Partial",
    icon: AlertCircle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  disabled: {
    label: "Disabled",
    icon: MinusCircle,
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
  },
};

const signalQualityConfig: Record<
  SignalQuality,
  { label: string; icon: LucideIcon; color: string; description: string }
> = {
  full: {
    label: "Full",
    icon: SignalHigh,
    color: "text-emerald-500",
    description: "All signal types active",
  },
  partial: {
    label: "Partial",
    icon: SignalMedium,
    color: "text-blue-500",
    description: "Some signal types active",
  },
  minimal: {
    label: "Minimal",
    icon: SignalLow,
    color: "text-amber-500",
    description: "Basic signals only",
  },
  none: {
    label: "None",
    icon: Signal,
    color: "text-slate-500",
    description: "No signals available",
  },
};

// Components
function SignalStatusBadge({ status }: { status: SignalStatus }) {
  const config = signalStatusConfig[status];
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

function SignalQualityBadge({ quality }: { quality: SignalQuality }) {
  const config = signalQualityConfig[quality];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2">
      <Icon className={cn("h-4 w-4", config.color)} />
      <span className={cn("text-sm font-medium", config.color)}>
        {config.label}
      </span>
    </div>
  );
}

function SignalToggle({ active }: { active: boolean }) {
  return active ? (
    <div className="flex items-center gap-1.5">
      <div className="h-2 w-2 rounded-full bg-emerald-500" />
      <span className="text-sm text-muted-foreground">On</span>
    </div>
  ) : (
    <div className="flex items-center gap-1.5">
      <div className="h-2 w-2 rounded-full bg-slate-400" />
      <span className="text-sm text-muted-foreground">Off</span>
    </div>
  );
}

function SignalCard({
  title,
  icon: Icon,
  signal,
}: {
  title: string;
  icon: LucideIcon;
  signal: SignalConfig;
}) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-md bg-secondary">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
          </div>
          <SignalStatusBadge status={signal.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {signal.lastSampleTime && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Last sample: {signal.lastSampleTime}</span>
          </div>
        )}
        <div className="space-y-2">
          {Object.entries(signal.details).map(([key, value]) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-muted-foreground capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}:
              </span>
              <span className="text-foreground font-medium">{value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ObservabilityPage() {
  const overallStatus: SignalStatus =
    observabilitySignals.metrics.status === "enabled" &&
    observabilitySignals.logs.status === "enabled" &&
    observabilitySignals.traces.status === "enabled"
      ? "enabled"
      : observabilitySignals.metrics.status === "disabled" &&
          observabilitySignals.logs.status === "disabled" &&
          observabilitySignals.traces.status === "disabled"
        ? "disabled"
        : "partial";

  return (
    <div className="space-y-8 text-foreground">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-card-foreground">
            Observability
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Runtime visibility and health signals across Identity services.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Status:</span>
            <SignalStatusBadge status={overallStatus} />
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <BarChart3 className="h-3 w-3" />
            <FileText className="h-3 w-3" />
            <Layers className="h-3 w-3" />
          </div>
        </div>
      </div>

      {/* Observability Signal Overview */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Signal Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SignalCard
            title="Metrics"
            icon={BarChart3}
            signal={observabilitySignals.metrics}
          />
          <SignalCard
            title="Logs"
            icon={FileText}
            signal={observabilitySignals.logs}
          />
          <SignalCard
            title="Traces"
            icon={Layers}
            signal={observabilitySignals.traces}
          />
        </div>
      </section>

      {/* Service-Level Observability Table */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Service Observability
          </h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <RefreshCw className="h-3 w-3" />
            <span>Manual refresh</span>
          </div>
        </div>
        <Card className="border-border bg-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Service</TableHead>
                  <TableHead className="text-center">Metrics</TableHead>
                  <TableHead className="text-center">Logs</TableHead>
                  <TableHead className="text-center">Traces</TableHead>
                  <TableHead>Signal Quality</TableHead>
                  <TableHead>Last Signal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {servicesObservability.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div className="font-medium text-foreground">
                        {service.name}
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {service.category} service
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <SignalToggle active={service.metrics} />
                    </TableCell>
                    <TableCell className="text-center">
                      <SignalToggle active={service.logs} />
                    </TableCell>
                    <TableCell className="text-center">
                      <SignalToggle active={service.traces} />
                    </TableCell>
                    <TableCell>
                      <SignalQualityBadge quality={service.signalQuality} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {service.lastSignalReceived}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* Understanding Signal Quality */}
      <Card className="border-border bg-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
            Understanding Signal Quality
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Signal quality indicates the completeness of observability coverage
            for each service. This helps you understand what visibility you have
            without requiring deep technical knowledge.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <p className="font-medium text-foreground">Quality Levels:</p>
              <ul className="space-y-2 text-xs">
                <li className="flex items-start gap-2">
                  <SignalHigh className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>
                    <strong className="text-foreground">Full</strong>: All
                    signal types (metrics, logs, traces) are actively collected
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <SignalMedium className="h-4 w-4 text-blue-500 shrink-0" />
                  <span>
                    <strong className="text-foreground">Partial</strong>: Some
                    signal types active. Common for supporting services.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <SignalLow className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>
                    <strong className="text-foreground">Minimal</strong>: Basic
                    signals only. External services often show this.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Signal className="h-4 w-4 text-slate-500 shrink-0" />
                  <span>
                    <strong className="text-foreground">None</strong>: No
                    observability signals available for this service
                  </span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="font-medium text-foreground">Important Notes:</p>
              <ul className="space-y-2 text-xs list-disc list-inside">
                <li>
                  <strong className="text-foreground">
                    Lack of signals ≠ service failure
                  </strong>
                  . A service may be healthy even with minimal observability.
                </li>
                <li>
                  External services may not report back to Aether Identity
                  observability systems.
                </li>
                <li>
                  Self-hosted deployments may have different signal coverage
                  based on configuration.
                </li>
                <li>
                  Trace collection is often sampled to reduce overhead in
                  production.
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* External Observability Integration */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
              External Observability Integration
            </CardTitle>
            <Badge
              variant={externalIntegration.detected ? "default" : "secondary"}
              className="text-xs"
            >
              {externalIntegration.detected ? "Connected" : "Not Detected"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Aether Identity can integrate with external observability platforms
            to extend visibility beyond built-in capabilities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="font-medium text-foreground text-xs">
                Supported Standards:
              </p>
              <div className="flex flex-wrap gap-2">
                {externalIntegration.standards.map((standard) => (
                  <Badge key={standard} variant="outline" className="text-xs">
                    {standard}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground text-xs">
                Detected Exporters:
              </p>
              {externalIntegration.exporters.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {externalIntegration.exporters.map((exporter) => (
                    <Badge
                      key={exporter}
                      variant="secondary"
                      className="text-xs"
                    >
                      {exporter}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs italic">No external exporters detected</p>
              )}
            </div>
          </div>
          <div className="pt-2 border-t border-border">
            <p className="text-xs">
              <Info className="h-3 w-3 inline mr-1" />
              <strong className="text-foreground">Note:</strong> Aether Identity
              does not replace your observability stack. This page provides
              built-in visibility only. For comprehensive monitoring, integrate
              with your existing tools.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Deployment Context Awareness */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-muted-foreground" />
              Deployment Context
            </CardTitle>
            <Badge variant="secondary" className="text-xs capitalize">
              {deploymentContext.mode}
            </Badge>
          </div>
          <CardDescription>{deploymentContext.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p className="text-xs">
            The observability configuration adapts based on your deployment
            environment:
          </p>
          <ul className="space-y-2 text-xs list-disc list-inside">
            {deploymentContext.limitations.map((limitation, index) => (
              <li key={index}>{limitation}</li>
            ))}
          </ul>
          <div className="pt-2 text-xs">
            <p>
              <strong className="text-foreground">Docker / Local:</strong>{" "}
              Reduced signals, local-only observability
            </p>
            <p>
              <strong className="text-foreground">ISO / Appliance:</strong>{" "}
              Extended internal metrics, system-level insights allowed
            </p>
            <p>
              <strong className="text-foreground">Managed:</strong> Full
              observability enabled by default (future)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Permissions & Security */}
      <Card className="border-border bg-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            Permissions & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Observability data is subject to strict access controls and
            sanitization policies.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <p className="font-medium text-foreground">Access Control:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Restricted to admin and superadmin roles only</li>
                <li>Read-only access - no modification allowed</li>
                <li>Audit logging of all observability view access</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground">Data Sanitization:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>No secrets or credentials exposed</li>
                <li>No personally identifiable information (PII)</li>
                <li>Token values and payloads are redacted</li>
              </ul>
            </div>
          </div>
          <div className="pt-2 border-t border-border">
            <p className="text-xs">
              <Shield className="h-3 w-3 inline mr-1" />
              <strong className="text-foreground">Security Note:</strong>{" "}
              Sensitive payloads and credentials are never exposed through
              observability views. If you need access to detailed logs for
              debugging, contact your security administrator.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Non-Goals Reminder */}
      <Card className="border-border bg-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            What This Page Is (And Is Not)
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-2">
              <p className="font-medium text-foreground">This page answers:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Are my services observable and healthy?</li>
                <li>What signal coverage do I have?</li>
                <li>When were signals last received?</li>
                <li>Is external observability integrated?</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground">This page is NOT:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>A Grafana or metrics visualization replacement</li>
                <li>A log search engine or query builder</li>
                <li>A trace waterfall or distributed tracing UI</li>
                <li>An alert configuration interface</li>
                <li>A live log streaming viewer</li>
              </ul>
            </div>
          </div>
          <p className="mt-4 text-xs">
            For production debugging and deep analysis, use your dedicated
            observability platform (Grafana, Datadog, etc.) integrated with
            Aether Identity exporters.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
