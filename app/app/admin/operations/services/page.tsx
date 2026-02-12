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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/dashboard/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/dashboard/ui/select";
import { Progress } from "@/components/dashboard/ui/progress";
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
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock,
  Cog,
  Cpu,
  Database,
  HardDrive,
  History,
  Layers,
  LayoutGrid,
  Lock,
  Logs,
  MemoryStick,
  Monitor,
  Network,
  Server,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  TrendingUp,
  UserCog,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MetricCard } from "@/components/dashboard/metric-card";

// ============================================================================
// TYPES - Enterprise Service Management
// ============================================================================

type ServiceStatus =
  | "operational"
  | "degraded"
  | "maintenance"
  | "down"
  | "unknown";
type ServiceTier = "essential" | "standard" | "enterprise";
type EnvironmentType = "production" | "staging" | "development";
type ComplianceLevel = "soc2" | "iso27001" | "gdpr" | "hipaa";
type PermissionLevel = "viewer" | "operator" | "admin" | "superadmin";

interface ServiceMetrics {
  uptime: number;
  responseTime: number;
  throughput: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
}

interface Service {
  id: string;
  name: string;
  description: string;
  status: ServiceStatus;
  tier: ServiceTier;
  environment: EnvironmentType;
  version: string;
  region: string;
  organizationId: string;
  metrics: ServiceMetrics;
  lastDeployed: string;
  healthCheckEndpoint: string;
  dependencies: string[];
  dependents: string[];
  alerts: ServiceAlert[];
  incidents: Incident[];
  compliance: ComplianceLevel[];
  rbac: {
    minPermission: PermissionLevel;
    allowedRoles: string[];
  };
  scaling: {
    min: number;
    max: number;
    current: number;
    autoScaling: boolean;
  };
  logs: {
    retention: number;
    correlationId: string;
    lastEvent: string;
  };
}

interface ServiceAlert {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  type: "performance" | "security" | "availability" | "capacity";
  message: string;
  timestamp: string;
  acknowledged: boolean;
  correlationId: string;
}

interface Incident {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "open" | "investigating" | "resolved" | "closed";
  startedAt: string;
  resolvedAt?: string;
  affectedServices: string[];
  lead: string;
}

interface Organization {
  id: string;
  name: string;
  plan: "free" | "pro" | "enterprise";
  region: string;
  status: "active" | "suspended" | "pending";
  serviceCount: number;
  userCount: number;
}

interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  targetType: "service" | "configuration" | "permission" | "deployment";
  correlationId: string;
  ipAddress: string;
  userAgent: string;
  result: "success" | "failure" | "denied";
  details: string;
}

// ============================================================================
// MOCK DATA - Enterprise Services Architecture
// ============================================================================

const organizations: Organization[] = [
  {
    id: "org_acme_corp",
    name: "Acme Corporation",
    plan: "enterprise",
    region: "US-East",
    status: "active",
    serviceCount: 14,
    userCount: 2847,
  },
  {
    id: "org_techstart",
    name: "TechStart Inc",
    plan: "pro",
    region: "EU-West",
    status: "active",
    serviceCount: 8,
    userCount: 342,
  },
];

const currentOrg = organizations[0];

const services: Service[] = [
  // Core Identity Services - Enterprise Tier
  {
    id: "svc_identity_api",
    name: "Identity API Gateway",
    description:
      "Primary REST/GraphQL API for identity operations and federation",
    status: "operational",
    tier: "essential",
    environment: "production",
    version: "v3.2.1",
    region: "US-East",
    organizationId: "org_acme_corp",
    metrics: {
      uptime: 99.99,
      responseTime: 45,
      throughput: 12500,
      errorRate: 0.001,
      cpuUsage: 34,
      memoryUsage: 62,
    },
    lastDeployed: "2026-02-10T14:30:00Z",
    healthCheckEndpoint: "/health/live",
    dependencies: ["svc_database", "svc_cache", "svc_message_queue"],
    dependents: ["svc_auth_engine", "svc_policy_engine"],
    alerts: [],
    incidents: [],
    compliance: ["soc2", "iso27001", "gdpr"],
    rbac: {
      minPermission: "operator",
      allowedRoles: ["devops", "platform_admin", "security_admin"],
    },
    scaling: {
      min: 3,
      max: 20,
      current: 5,
      autoScaling: true,
    },
    logs: {
      retention: 90,
      correlationId: "corr_7f8d9a2b",
      lastEvent: "2026-02-12T09:42:15Z",
    },
  },
  {
    id: "svc_auth_engine",
    name: "Authentication Engine",
    description: "Multi-factor authentication, SSO, and session management",
    status: "operational",
    tier: "essential",
    environment: "production",
    version: "v3.2.0",
    region: "US-East",
    organizationId: "org_acme_corp",
    metrics: {
      uptime: 99.97,
      responseTime: 32,
      throughput: 8500,
      errorRate: 0.002,
      cpuUsage: 28,
      memoryUsage: 54,
    },
    lastDeployed: "2026-02-09T10:15:00Z",
    healthCheckEndpoint: "/health",
    dependencies: ["svc_identity_api", "svc_session_manager"],
    dependents: ["svc_token_service"],
    alerts: [],
    incidents: [],
    compliance: ["soc2", "iso27001", "gdpr", "hipaa"],
    rbac: {
      minPermission: "admin",
      allowedRoles: ["security_admin", "platform_admin"],
    },
    scaling: {
      min: 2,
      max: 15,
      current: 4,
      autoScaling: true,
    },
    logs: {
      retention: 180,
      correlationId: "corr_9a8b7c6d",
      lastEvent: "2026-02-12T09:41:58Z",
    },
  },
  {
    id: "svc_policy_engine",
    name: "Policy Engine",
    description: "Fine-grained authorization and policy evaluation (ABAC/RBAC)",
    status: "operational",
    tier: "essential",
    environment: "production",
    version: "v3.1.8",
    region: "US-East",
    organizationId: "org_acme_corp",
    metrics: {
      uptime: 99.98,
      responseTime: 18,
      throughput: 25000,
      errorRate: 0.0005,
      cpuUsage: 22,
      memoryUsage: 48,
    },
    lastDeployed: "2026-02-08T16:45:00Z",
    healthCheckEndpoint: "/health",
    dependencies: ["svc_identity_api", "svc_database", "svc_cache"],
    dependents: [],
    alerts: [],
    incidents: [],
    compliance: ["soc2", "iso27001", "gdpr"],
    rbac: {
      minPermission: "admin",
      allowedRoles: ["security_admin", "platform_admin"],
    },
    scaling: {
      min: 3,
      max: 25,
      current: 6,
      autoScaling: true,
    },
    logs: {
      retention: 90,
      correlationId: "corr_3e4f5g6h",
      lastEvent: "2026-02-12T09:40:22Z",
    },
  },
  {
    id: "svc_token_service",
    name: "Token Service",
    description: "JWT issuance, validation, rotation, and revocation",
    status: "operational",
    tier: "essential",
    environment: "production",
    version: "v3.2.1",
    region: "US-East",
    organizationId: "org_acme_corp",
    metrics: {
      uptime: 99.99,
      responseTime: 8,
      throughput: 45000,
      errorRate: 0.0001,
      cpuUsage: 15,
      memoryUsage: 32,
    },
    lastDeployed: "2026-02-10T12:00:00Z",
    healthCheckEndpoint: "/health",
    dependencies: ["svc_cache"],
    dependents: [],
    alerts: [],
    incidents: [],
    compliance: ["soc2", "iso27001", "gdpr"],
    rbac: {
      minPermission: "operator",
      allowedRoles: ["devops", "security_admin"],
    },
    scaling: {
      min: 3,
      max: 30,
      current: 6,
      autoScaling: true,
    },
    logs: {
      retention: 90,
      correlationId: "corr_1a2b3c4d",
      lastEvent: "2026-02-12T09:42:33Z",
    },
  },
  // Infrastructure Services
  {
    id: "svc_database",
    name: "Primary Database",
    description: "PostgreSQL cluster with automated failover",
    status: "operational",
    tier: "essential",
    environment: "production",
    version: "PostgreSQL 16.2",
    region: "US-East",
    organizationId: "org_acme_corp",
    metrics: {
      uptime: 99.99,
      responseTime: 2,
      throughput: 15000,
      errorRate: 0.0,
      cpuUsage: 42,
      memoryUsage: 68,
    },
    lastDeployed: "2026-01-15T08:00:00Z",
    healthCheckEndpoint: "/health",
    dependencies: [],
    dependents: [
      "svc_identity_api",
      "svc_policy_engine",
      "svc_session_manager",
    ],
    alerts: [],
    incidents: [],
    compliance: ["soc2", "iso27001", "gdpr", "hipaa"],
    rbac: {
      minPermission: "admin",
      allowedRoles: ["platform_admin", "dba"],
    },
    scaling: {
      min: 2,
      max: 6,
      current: 3,
      autoScaling: false,
    },
    logs: {
      retention: 365,
      correlationId: "corr_db_primary_001",
      lastEvent: "2026-02-12T09:42:00Z",
    },
  },
  {
    id: "svc_cache",
    name: "Distributed Cache",
    description: "Redis cluster for session and policy caching",
    status: "operational",
    tier: "essential",
    environment: "production",
    version: "Redis 7.2",
    region: "US-East",
    organizationId: "org_acme_corp",
    metrics: {
      uptime: 99.96,
      responseTime: 1,
      throughput: 125000,
      errorRate: 0.001,
      cpuUsage: 38,
      memoryUsage: 72,
    },
    lastDeployed: "2026-01-20T10:30:00Z",
    healthCheckEndpoint: "/health",
    dependencies: [],
    dependents: [
      "svc_identity_api",
      "svc_token_service",
      "svc_session_manager",
    ],
    alerts: [
      {
        id: "alert_001",
        severity: "medium",
        type: "capacity",
        message: "Cache memory usage above 70% threshold",
        timestamp: "2026-02-12T08:30:00Z",
        acknowledged: false,
        correlationId: "corr_cache_capacity_001",
      },
    ],
    incidents: [],
    compliance: ["soc2", "iso27001"],
    rbac: {
      minPermission: "admin",
      allowedRoles: ["platform_admin"],
    },
    scaling: {
      min: 3,
      max: 12,
      current: 5,
      autoScaling: true,
    },
    logs: {
      retention: 30,
      correlationId: "corr_cache_cluster_001",
      lastEvent: "2026-02-12T09:41:45Z",
    },
  },
  {
    id: "svc_message_queue",
    name: "Message Queue",
    description: "RabbitMQ for async processing and event streaming",
    status: "degraded",
    tier: "standard",
    environment: "production",
    version: "RabbitMQ 3.13",
    region: "US-East",
    organizationId: "org_acme_corp",
    metrics: {
      uptime: 98.45,
      responseTime: 45,
      throughput: 3200,
      errorRate: 0.5,
      cpuUsage: 67,
      memoryUsage: 81,
    },
    lastDeployed: "2026-02-05T14:20:00Z",
    healthCheckEndpoint: "/health",
    dependencies: [],
    dependents: ["svc_identity_api"],
    alerts: [
      {
        id: "alert_002",
        severity: "high",
        type: "performance",
        message: "Consumer lag exceeding 5 minutes",
        timestamp: "2026-02-12T09:15:00Z",
        acknowledged: true,
        correlationId: "corr_queue_lag_002",
      },
    ],
    incidents: [
      {
        id: "inc_001",
        title: "Message Queue Consumer Lag",
        severity: "high",
        status: "investigating",
        startedAt: "2026-02-12T09:00:00Z",
        affectedServices: ["svc_message_queue", "svc_identity_api"],
        lead: "sre-oncall@acme.com",
      },
    ],
    compliance: ["soc2"],
    rbac: {
      minPermission: "operator",
      allowedRoles: ["devops", "platform_admin"],
    },
    scaling: {
      min: 2,
      max: 8,
      current: 4,
      autoScaling: true,
    },
    logs: {
      retention: 60,
      correlationId: "corr_queue_001",
      lastEvent: "2026-02-12T09:42:10Z",
    },
  },
  // Degraded External Service
  {
    id: "svc_external_idp",
    name: "External IdP Bridge",
    description: "SAML/OIDC integration gateway for Azure AD, Okta, Google",
    status: "degraded",
    tier: "enterprise",
    environment: "production",
    version: "v2.5.0",
    region: "US-East",
    organizationId: "org_acme_corp",
    metrics: {
      uptime: 97.23,
      responseTime: 850,
      throughput: 1200,
      errorRate: 2.8,
      cpuUsage: 45,
      memoryUsage: 58,
    },
    lastDeployed: "2026-02-01T09:00:00Z",
    healthCheckEndpoint: "/health",
    dependencies: ["svc_identity_api"],
    dependents: [],
    alerts: [
      {
        id: "alert_003",
        severity: "high",
        type: "availability",
        message: "Elevated error rate with Azure AD integration",
        timestamp: "2026-02-12T08:45:00Z",
        acknowledged: false,
        correlationId: "corr_ext_idp_003",
      },
    ],
    incidents: [
      {
        id: "inc_002",
        title: "Azure AD Integration Degradation",
        severity: "high",
        status: "investigating",
        startedAt: "2026-02-12T08:30:00Z",
        affectedServices: ["svc_external_idp"],
        lead: "integrations@acme.com",
      },
    ],
    compliance: ["soc2", "iso27001"],
    rbac: {
      minPermission: "admin",
      allowedRoles: ["security_admin", "platform_admin"],
    },
    scaling: {
      min: 2,
      max: 10,
      current: 3,
      autoScaling: true,
    },
    logs: {
      retention: 180,
      correlationId: "corr_ext_idp_001",
      lastEvent: "2026-02-12T09:40:00Z",
    },
  },
];

const auditEvents: AuditEvent[] = [
  {
    id: "evt_001",
    timestamp: "2026-02-12T09:42:15Z",
    actor: "admin.sarah@acme.com",
    action: "service.restart",
    target: "svc_message_queue",
    targetType: "service",
    correlationId: "corr_restart_001",
    ipAddress: "10.0.1.45",
    userAgent: "Mozilla/5.0 (Admin Dashboard)",
    result: "success",
    details: "Restarted message queue to address consumer lag",
  },
  {
    id: "evt_002",
    timestamp: "2026-02-12T09:30:00Z",
    actor: "devops.mike@acme.com",
    action: "config.update",
    target: "svc_cache",
    targetType: "configuration",
    correlationId: "corr_config_002",
    ipAddress: "10.0.1.32",
    userAgent: "Terraform/1.7.0",
    result: "success",
    details: "Increased maxmemory policy to allkeys-lru",
  },
  {
    id: "evt_003",
    timestamp: "2026-02-12T09:15:00Z",
    actor: "system",
    action: "alert.triggered",
    target: "svc_message_queue",
    targetType: "service",
    correlationId: "corr_alert_003",
    ipAddress: "internal",
    userAgent: "Identity Monitoring",
    result: "success",
    details: "Consumer lag threshold exceeded",
  },
  {
    id: "evt_004",
    timestamp: "2026-02-12T08:45:00Z",
    actor: "security.jane@acme.com",
    action: "permission.grant",
    target: "svc_auth_engine",
    targetType: "permission",
    correlationId: "corr_perm_004",
    ipAddress: "10.0.1.28",
    userAgent: "Mozilla/5.0 (Admin Dashboard)",
    result: "success",
    details: "Granted operator access to new DevOps team member",
  },
  {
    id: "evt_005",
    timestamp: "2026-02-12T08:00:00Z",
    actor: "system",
    action: "deployment.complete",
    target: "svc_identity_api",
    targetType: "deployment",
    correlationId: "corr_deploy_005",
    ipAddress: "internal",
    userAgent: "GitHub Actions",
    result: "success",
    details: "Automated deployment of v3.2.1 to production",
  },
];

// ============================================================================
// CONFIGURATION
// ============================================================================

const statusConfig: Record<
  ServiceStatus,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  operational: {
    label: "Operational",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  degraded: {
    label: "Degraded",
    icon: AlertTriangle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  maintenance: {
    label: "Maintenance",
    icon: Settings,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  down: {
    label: "Down",
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/20",
  },
  unknown: {
    label: "Unknown",
    icon: HelpCircle,
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
    borderColor: "border-slate-500/20",
  },
};

const tierConfig: Record<
  ServiceTier,
  { label: string; color: string; bgColor: string; description: string }
> = {
  essential: {
    label: "Essential",
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    description: "Core platform services - 99.99% SLA",
  },
  standard: {
    label: "Standard",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    description: "Supporting infrastructure - 99.9% SLA",
  },
  enterprise: {
    label: "Enterprise",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    description: "Advanced integrations - 99.95% SLA",
  },
};

const severityConfig: Record<
  string,
  { color: string; bgColor: string; label: string }
> = {
  critical: {
    label: "Critical",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  high: {
    label: "High",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  medium: {
    label: "Medium",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  low: {
    label: "Low",
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
  },
};

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

function HelpCircle(props: React.SVGProps<SVGSVGElement>) {
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
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function StatusBadge({
  status,
  showLabel = true,
  size = "default",
}: {
  status: ServiceStatus;
  showLabel?: boolean;
  size?: "default" | "sm" | "lg";
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

function TierBadge({ tier }: { tier: ServiceTier }) {
  const config = tierConfig[tier];
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={cn(
              "text-xs font-medium cursor-help",
              config.color,
              config.bgColor,
            )}
          >
            {config.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{config.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function ComplianceBadge({ standards }: { standards: ComplianceLevel[] }) {
  const icons: Record<ComplianceLevel, React.ElementType> = {
    soc2: ShieldCheck,
    iso27001: Shield,
    gdpr: Lock,
    hipaa: UserCog,
  };

  return (
    <div className="flex items-center gap-1">
      {standards.map((standard) => {
        const Icon = icons[standard];
        return (
          <TooltipProvider key={standard}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="h-5 px-1.5 text-[10px] uppercase"
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {standard}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  Compliant with {standard.toUpperCase()}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
}

function MetricBar({
  label,
  value,
  unit = "%",
  warningThreshold = 70,
  criticalThreshold = 90,
  icon: Icon,
}: {
  label: string;
  value: number;
  unit?: string;
  warningThreshold?: number;
  criticalThreshold?: number;
  icon: React.ElementType;
}) {
  let color = "bg-emerald-500";
  if (value >= criticalThreshold) color = "bg-destructive";
  else if (value >= warningThreshold) color = "bg-amber-500";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
          <span>{label}</span>
        </div>
        <span
          className={cn(
            "font-medium",
            value >= criticalThreshold
              ? "text-destructive"
              : value >= warningThreshold
                ? "text-amber-500"
                : "text-foreground",
          )}
        >
          {value}
          {unit}
        </span>
      </div>
      <div
        className={cn("h-1.5 w-full rounded-full bg-secondary overflow-hidden")}
      >
        <div
          className={cn("h-full transition-all duration-300", color)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
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

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

function ServicesOverviewSection({ services }: { services: Service[] }) {
  const degradedCount = services.filter((s) => s.status === "degraded").length;
  const downCount = services.filter(
    (s) => s.status === "down" || s.status === "unknown",
  ).length;

  const avgUptime =
    services.reduce((acc, s) => acc + s.metrics.uptime, 0) / services.length;
  const avgResponseTime =
    services.reduce((acc, s) => acc + s.metrics.responseTime, 0) /
    services.length;
  const totalThroughput = services.reduce(
    (acc, s) => acc + s.metrics.throughput,
    0,
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="System Status"
        value={
          downCount > 0
            ? "Critical"
            : degradedCount > 0
              ? "Degraded"
              : "Healthy"
        }
        icon={
          downCount > 0
            ? XCircle
            : degradedCount > 0
              ? AlertTriangle
              : CheckCircle2
        }
        variant={
          downCount > 0
            ? "destructive"
            : degradedCount > 0
              ? "warning"
              : "default"
        }
      />
      <MetricCard
        title="Avg Uptime (30d)"
        value={`${avgUptime.toFixed(2)}%`}
        icon={Activity}
        trend={{ value: 0.03, isPositive: true }}
      />
      <MetricCard
        title="Avg Response Time"
        value={`${Math.round(avgResponseTime)}ms`}
        icon={Zap}
        subtitle="p95 latency"
      />
      <MetricCard
        title="Total Throughput"
        value={`${(totalThroughput / 1000).toFixed(1)}k`}
        icon={TrendingUp}
        subtitle="requests/min"
      />
    </div>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const statusConfig = {
    operational: {
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      icon: CheckCircle2,
    },
    degraded: {
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      icon: AlertTriangle,
    },
    maintenance: {
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      icon: Settings,
    },
    down: {
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive/20",
      icon: XCircle,
    },
    unknown: {
      color: "text-slate-500",
      bgColor: "bg-slate-500/10",
      borderColor: "border-slate-500/20",
      icon: HelpCircle,
    },
  }[service.status];

  const hasAlerts = service.alerts.length > 0;
  const hasIncidents = service.incidents.length > 0;

  return (
    <Card
      className={cn(
        "border transition-all hover:shadow-md",
        hasIncidents ? "border-destructive/50" : "border-border",
      )}
    >
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={cn("p-2 rounded-lg", statusConfig.bgColor)}>
              <Server className={cn("h-5 w-5", statusConfig.color)} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-foreground">{service.name}</h3>
                {hasAlerts && (
                  <Badge
                    variant="outline"
                    className="h-5 px-1.5 text-[10px] border-amber-500/30 text-amber-500"
                  >
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {service.alerts.length}
                  </Badge>
                )}
                {hasIncidents && (
                  <Badge
                    variant="outline"
                    className="h-5 px-1.5 text-[10px] border-destructive/30 text-destructive"
                  >
                    <ShieldAlert className="h-3 w-3 mr-1" />
                    Incident
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {service.description}
              </p>
            </div>
          </div>
          <StatusBadge status={service.status} size="sm" />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Uptime
            </p>
            <p className="text-sm font-medium">{service.metrics.uptime}%</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Latency
            </p>
            <p className="text-sm font-medium">
              {service.metrics.responseTime}ms
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Version
            </p>
            <p className="text-sm font-medium">{service.version}</p>
          </div>
        </div>

        {/* Resource Usage */}
        <div className="space-y-2">
          <MetricBar label="CPU" value={service.metrics.cpuUsage} icon={Cpu} />
          <MetricBar
            label="Memory"
            value={service.metrics.memoryUsage}
            icon={MemoryStick}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <TierBadge tier={service.tier} />
            <ComplianceBadge standards={service.compliance} />
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{new Date(service.lastDeployed).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ServicesGridSection({ services }: { services: Service[] }) {
  const essentialServices = services.filter((s) => s.tier === "essential");
  const standardServices = services.filter((s) => s.tier === "standard");
  const enterpriseServices = services.filter((s) => s.tier === "enterprise");

  return (
    <div className="space-y-6">
      {/* Essential Services */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-rose-500" />
            <h3 className="text-sm font-medium">Essential Services</h3>
            <Badge variant="secondary" className="text-xs">
              {essentialServices.length}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">99.99% SLA Guaranteed</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {essentialServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* Standard Services */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-medium">Standard Services</h3>
            <Badge variant="secondary" className="text-xs">
              {standardServices.length}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">99.9% SLA</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {standardServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* Enterprise Services */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-violet-500" />
            <h3 className="text-sm font-medium">Enterprise Integrations</h3>
            <Badge variant="secondary" className="text-xs">
              {enterpriseServices.length}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">99.95% SLA</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {enterpriseServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>
    </div>
  );
}

function AlertsAndIncidentsSection({ services }: { services: Service[] }) {
  const allAlerts = services.flatMap((s) =>
    s.alerts.map((a) => ({ ...a, serviceName: s.name, serviceId: s.id })),
  );
  const allIncidents = services.flatMap((s) =>
    s.incidents.map((i) => ({ ...i, serviceName: s.name, serviceId: s.id })),
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Active Alerts */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <CardTitle className="text-sm font-medium">
                Active Alerts
              </CardTitle>
            </div>
            <Badge variant="outline" className="text-xs">
              {allAlerts.length} open
            </Badge>
          </div>
          <CardDescription>Service alerts requiring attention</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {allAlerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
              <p className="text-sm">No active alerts</p>
              <p className="text-xs">All services operating normally</p>
            </div>
          ) : (
            allAlerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border",
                  alert.severity === "critical"
                    ? "border-destructive/30 bg-destructive/5"
                    : alert.severity === "high"
                      ? "border-amber-500/30 bg-amber-500/5"
                      : "border-border",
                )}
              >
                <div
                  className={cn(
                    "h-2 w-2 rounded-full mt-1.5",
                    severityConfig[alert.severity].bgColor.replace("/10", ""),
                  )}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">
                      {alert.message}
                    </p>
                    <CorrelationId id={alert.correlationId} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {alert.serviceName} •{" "}
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <Badge variant="outline" className="text-[10px] h-5">
                  {alert.severity}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Active Incidents */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-destructive" />
              <CardTitle className="text-sm font-medium">
                Active Incidents
              </CardTitle>
            </div>
            <Badge variant="outline" className="text-xs">
              {allIncidents.length} ongoing
            </Badge>
          </div>
          <CardDescription>
            Service incidents under investigation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {allIncidents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
              <p className="text-sm">No active incidents</p>
              <p className="text-xs">All services stable</p>
            </div>
          ) : (
            allIncidents.map((incident) => (
              <div
                key={incident.id}
                className="p-3 rounded-lg border border-destructive/30 bg-destructive/5 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{incident.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {incident.affectedServices.length} services affected •{" "}
                      {incident.lead}
                    </p>
                  </div>
                  <Badge className="text-[10px] h-5 bg-destructive text-destructive-foreground">
                    {incident.severity}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Started {new Date(incident.startedAt).toLocaleTimeString()}
                  </span>
                  <span className="text-destructive font-medium">
                    (ongoing)
                  </span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AuditLogSection({ events }: { events: AuditEvent[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">Audit Log</CardTitle>
          </div>
          <Button variant="outline" size="sm" className="h-7 text-xs">
            View All
            <ArrowUpRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
        <CardDescription>
          Recent administrative actions across services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center",
                  event.result === "success"
                    ? "bg-emerald-500/10"
                    : event.result === "failure"
                      ? "bg-destructive/10"
                      : "bg-amber-500/10",
                )}
              >
                {event.result === "success" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : event.result === "failure" ? (
                  <XCircle className="h-4 w-4 text-destructive" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{event.action}</p>
                  <CorrelationId id={event.correlationId} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {event.target} • {event.actor}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span>{new Date(event.timestamp).toLocaleString()}</span>
                  <span>•</span>
                  <span>{event.ipAddress}</span>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] h-5">
                {event.targetType}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function GovernanceAndComplianceSection({ services }: { services: Service[] }) {
  const complianceStats = {
    soc2: services.filter((s) => s.compliance.includes("soc2")).length,
    iso27001: services.filter((s) => s.compliance.includes("iso27001")).length,
    gdpr: services.filter((s) => s.compliance.includes("gdpr")).length,
    hipaa: services.filter((s) => s.compliance.includes("hipaa")).length,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Compliance Overview */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <CardTitle className="text-sm font-medium">
              Compliance Status
            </CardTitle>
          </div>
          <CardDescription>
            Regulatory compliance across services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(complianceStats).map(([standard, count]) => (
            <div key={standard} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] uppercase">
                  {standard}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Progress
                  value={(count / services.length) * 100}
                  className="w-24 h-1.5"
                />
                <span className="text-xs text-muted-foreground">
                  {count}/{services.length}
                </span>
              </div>
            </div>
          ))}
          <div className="pt-3 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5" />
              <span>All essential services compliant with SOC 2 Type II</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Retention */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-blue-500" />
            <CardTitle className="text-sm font-medium">
              Data Retention
            </CardTitle>
          </div>
          <CardDescription>
            Log retention policies by service tier
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Essential Services</span>
              <span className="font-medium">365 days</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Standard Services</span>
              <span className="font-medium">90 days</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Enterprise Integrations
              </span>
              <span className="font-medium">180 days</span>
            </div>
          </div>
          <div className="pt-3 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <HardDrive className="h-3.5 w-3.5" />
              <span>2.4 TB total log storage used</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RBAC Overview */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <UserCog className="h-4 w-4 text-violet-500" />
            <CardTitle className="text-sm font-medium">
              Access Control
            </CardTitle>
          </div>
          <CardDescription>Role-based access across services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Admin Level</span>
              <Badge variant="outline" className="text-xs">
                {
                  services.filter((s) => s.rbac.minPermission === "admin")
                    .length
                }{" "}
                services
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Operator Level</span>
              <Badge variant="outline" className="text-xs">
                {
                  services.filter((s) => s.rbac.minPermission === "operator")
                    .length
                }{" "}
                services
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Viewer Level</span>
              <Badge variant="outline" className="text-xs">
                {
                  services.filter((s) => s.rbac.minPermission === "viewer")
                    .length
                }{" "}
                services
              </Badge>
            </div>
          </div>
          <div className="pt-3 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span>42 users with service access</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function OrganizationSelector({ currentOrg }: { currentOrg: Organization }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium">{currentOrg.name}</p>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] h-5 capitalize">
              {currentOrg.plan}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {currentOrg.region}
            </span>
          </div>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Server className="h-3.5 w-3.5" />
          <span>{currentOrg.serviceCount} services</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          <span>{currentOrg.userCount.toLocaleString()} users</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function ServicesPage() {
  const [activeTab, setActiveTab] = React.useState("overview");
  const [selectedEnvironment, setSelectedEnvironment] =
    React.useState<EnvironmentType>("production");

  const filteredServices = services.filter(
    (s) => s.environment === selectedEnvironment,
  );

  return (
    <TooltipProvider>
      <div className="space-y-6 text-foreground">
        {/* =========================================================================
            HEADER SECTION
            ========================================================================= */}
        <div>
          <h1 className="text-2xl font-semibold text-card-foreground">
            Identity Service Operations
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enterprise service management, monitoring, and governance
          </p>
        </div>

        {/* Organization Context */}
        <OrganizationSelector currentOrg={currentOrg} />

        {/* =========================================================================
            SECTION 1: PLATFORM OVERVIEW
            Critical priority - System health and KPIs
            ========================================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Platform Overview
              </h2>
            </div>
            <Select
              value={selectedEnvironment}
              onValueChange={(value) =>
                setSelectedEnvironment(value as EnvironmentType)
              }
            >
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="production">Production</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="development">Development</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ServicesOverviewSection services={filteredServices} />
        </section>

        {/* =========================================================================
            SECTION 2: SERVICE MONITORING
            Primary functionality - Service health and status
            ========================================================================= */}
        <section className="space-y-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Service Management
              </h2>
              <TabsList className="h-8">
                <TabsTrigger value="overview" className="text-xs px-3">
                  <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="monitoring" className="text-xs px-3">
                  <Monitor className="h-3.5 w-3.5 mr-1.5" />
                  Monitoring
                </TabsTrigger>
                <TabsTrigger value="governance" className="text-xs px-3">
                  <Shield className="h-3.5 w-3.5 mr-1.5" />
                  Governance
                </TabsTrigger>
                <TabsTrigger value="logs" className="text-xs px-3">
                  <Logs className="h-3.5 w-3.5 mr-1.5" />
                  Audit
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-6 m-0">
              <ServicesGridSection services={filteredServices} />
            </TabsContent>

            <TabsContent value="monitoring" className="space-y-6 m-0">
              <AlertsAndIncidentsSection services={filteredServices} />
            </TabsContent>

            <TabsContent value="governance" className="space-y-6 m-0">
              <GovernanceAndComplianceSection services={filteredServices} />
            </TabsContent>

            <TabsContent value="logs" className="space-y-6 m-0">
              <AuditLogSection events={auditEvents} />
            </TabsContent>
          </Tabs>
        </section>

        {/* =========================================================================
            SECTION 3: OPERATIONAL GUIDANCE
            ========================================================================= */}
        <section className="space-y-4">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Operational Guidance
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border-border bg-muted/30">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Cog className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium">
                    Configuration Management
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Service configurations are managed through Infrastructure as
                  Code (Terraform) and GitOps workflows. Direct manual changes
                  should be avoided in production environments.
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="text-[10px]">
                    Terraform
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    GitOps
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    IaC
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-muted/30">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Incident Response</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Active incidents trigger automated alerts to on-call engineers
                  via PagerDuty. Critical incidents require immediate
                  acknowledgment within 5 minutes.
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="text-[10px]">
                    SLA: 99.99%
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    MTTR: &lt;15min
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-muted/30">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Network className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Multi-Environment</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Services are deployed across isolated environments with
                  automated promotion pipelines. Configuration drift is
                  monitored and alerted automatically.
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="text-[10px]">
                    Production
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    Staging
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    Development
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* =========================================================================
            FOOTER: SYSTEM METADATA
            ========================================================================= */}
        <div className="flex items-center justify-between pt-4 border-t border-border text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Last updated: {new Date().toLocaleString()}</span>
            <span>•</span>
            <span>
              Correlation ID: <CorrelationId id="corr_page_render_001" />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>Identity Platform v3.2.1</span>
            <Badge variant="outline" className="text-[10px]">
              {currentOrg.plan.toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
