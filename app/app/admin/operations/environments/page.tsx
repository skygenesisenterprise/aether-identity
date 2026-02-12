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
import { Tabs, TabsList, TabsTrigger } from "@/components/dashboard/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/dashboard/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dashboard/ui/dialog";
import { MetricCard } from "@/components/dashboard/metric-card";
import { cn } from "@/lib/utils";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Cloud,
  Cpu,
  Database,
  FileText,
  Filter,
  HardDrive,
  History,
  Layers,
  Lock,
  MemoryStick,
  Monitor,
  Plus,
  RefreshCw,
  Scale,
  Search,
  Server,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Users,
  XCircle,
  Zap,
  BarChart3,
  Bell,
  GitBranch,
  Terminal,
  LockKeyhole,
  FileClock,
  Scan,
} from "lucide-react";

// ============================================================================
// TYPES & CONFIGURATION
// ============================================================================

type EnvironmentStatus =
  | "healthy"
  | "degraded"
  | "unhealthy"
  | "maintenance"
  | "unknown";
type EnvironmentType = "production" | "staging" | "development" | "isolated";
type DeploymentMode = "saas" | "self-hosted" | "hybrid";
type SubscriptionTier = "free" | "pro" | "enterprise";
type ComplianceLevel = "soc2" | "iso27001" | "gdpr" | "hipaa" | null;

interface EnvironmentMetrics {
  cpu: number;
  memory: number;
  storage: number;
  networkLatency: number;
  requestRate: number;
  errorRate: number;
}

interface EnvironmentLimits {
  users: number;
  usersUsed: number;
  apiCalls: number;
  apiCallsUsed: number;
  storage: number;
  storageUsed: number;
}

interface EnvironmentSecurity {
  encryptionAtRest: boolean;
  encryptionInTransit: boolean;
  mfaRequired: boolean;
  ssoEnabled: boolean;
  compliance: ComplianceLevel[];
  lastSecurityScan: string;
  vulnerabilities: number;
}

interface EnvironmentAudit {
  lastDeployment: string;
  lastBackup: string;
  lastSecurityAudit: string;
  changeCount24h: number;
  incidentCount30d: number;
}

interface Environment {
  id: string;
  name: string;
  type: EnvironmentType;
  status: EnvironmentStatus;
  region: string;
  owner: string;
  ownerTeam: string;
  version: string;
  deploymentMode: DeploymentMode;
  createdAt: string;
  updatedAt: string;
  metrics: EnvironmentMetrics;
  limits: EnvironmentLimits;
  security: EnvironmentSecurity;
  audit: EnvironmentAudit;
  activeServices: string[];
  dependencies: {
    databases: string[];
    caches: string[];
    messageQueues: string[];
    externalIdPs: string[];
  };
  alerts: EnvironmentAlert[];
  tags: string[];
}

interface EnvironmentAlert {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  category: "performance" | "security" | "availability" | "capacity";
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

interface OrganizationContext {
  id: string;
  name: string;
  tier: SubscriptionTier;
  deploymentMode: DeploymentMode;
  totalEnvironments: number;
  maxEnvironments: number;
  regions: string[];
  primaryAdmin: string;
  securityContact: string;
  billingContact: string;
  complianceFrameworks: ComplianceLevel[];
}

// ============================================================================
// CONFIGURATION OBJECTS
// ============================================================================

const statusConfig: Record<
  EnvironmentStatus,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    description: string;
  }
> = {
  healthy: {
    label: "Operational",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    description: "All systems operational",
  },
  degraded: {
    label: "Degraded",
    icon: AlertTriangle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    description: "Performance impacted",
  },
  unhealthy: {
    label: "Critical",
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    description: "Service disruption",
  },
  maintenance: {
    label: "Maintenance",
    icon: Settings,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    description: "Scheduled maintenance",
  },
  unknown: {
    label: "Unknown",
    icon: Activity,
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
    description: "Status unavailable",
  },
};

const typeConfig: Record<
  EnvironmentType,
  {
    label: string;
    description: string;
    color: string;
    icon: React.ElementType;
  }
> = {
  production: {
    label: "Production",
    description: "Live production workload",
    color: "text-emerald-500",
    icon: ShieldCheck,
  },
  staging: {
    label: "Staging",
    description: "Pre-production validation",
    color: "text-amber-500",
    icon: GitBranch,
  },
  development: {
    label: "Development",
    description: "Development & testing",
    color: "text-blue-500",
    icon: Terminal,
  },
  isolated: {
    label: "Isolated",
    description: "Air-gapped environment",
    color: "text-purple-500",
    icon: LockKeyhole,
  },
};

const tierConfig: Record<
  SubscriptionTier,
  {
    label: string;
    badge: string;
    features: string[];
  }
> = {
  free: {
    label: "Free",
    badge: "bg-slate-500/10 text-slate-500",
    features: ["2 environments", "Community support", "Basic monitoring"],
  },
  pro: {
    label: "Pro",
    badge: "bg-blue-500/10 text-blue-500",
    features: [
      "10 environments",
      "Priority support",
      "Advanced monitoring",
      "SSO",
    ],
  },
  enterprise: {
    label: "Enterprise",
    badge: "bg-purple-500/10 text-purple-500",
    features: [
      "Unlimited environments",
      "24/7 support",
      "Custom compliance",
      "SLA guarantee",
    ],
  },
};

// ============================================================================
// MOCK DATA - ENTERPRISE GRADE
// ============================================================================

const orgContext: OrganizationContext = {
  id: "org-12345",
  name: "Acme Corporation",
  tier: "enterprise",
  deploymentMode: "hybrid",
  totalEnvironments: 6,
  maxEnvironments: 25,
  regions: ["US-East", "US-West", "EU-West", "APAC"],
  primaryAdmin: "platform-team@acme.com",
  securityContact: "security@acme.com",
  billingContact: "billing@acme.com",
  complianceFrameworks: ["soc2", "iso27001", "gdpr"],
};

const environmentsData: Environment[] = [
  {
    id: "prod-us-east-001",
    name: "Production US-East",
    type: "production",
    status: "healthy",
    region: "US-East",
    owner: "platform-team@acme.com",
    ownerTeam: "Platform Engineering",
    version: "v2.4.1-stable",
    deploymentMode: "saas",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-05-15T14:30:00Z",
    metrics: {
      cpu: 45,
      memory: 62,
      storage: 78,
      networkLatency: 12,
      requestRate: 15420,
      errorRate: 0.02,
    },
    limits: {
      users: 100000,
      usersUsed: 87432,
      apiCalls: 50000000,
      apiCallsUsed: 42156300,
      storage: 1073741824000,
      storageUsed: 832456000000,
    },
    security: {
      encryptionAtRest: true,
      encryptionInTransit: true,
      mfaRequired: true,
      ssoEnabled: true,
      compliance: ["soc2", "iso27001", "gdpr"],
      lastSecurityScan: "2 hours ago",
      vulnerabilities: 0,
    },
    audit: {
      lastDeployment: "2024-05-15T10:00:00Z",
      lastBackup: "2024-05-15T12:00:00Z",
      lastSecurityAudit: "2024-05-10T00:00:00Z",
      changeCount24h: 3,
      incidentCount30d: 0,
    },
    activeServices: [
      "Identity API",
      "Auth Engine",
      "Session Mgr",
      "Token Service",
      "Audit Logs",
      "Rate Limiter",
    ],
    dependencies: {
      databases: ["PostgreSQL Primary", "PostgreSQL Replica"],
      caches: ["Redis Cluster", "Memcached"],
      messageQueues: ["RabbitMQ", "Kafka"],
      externalIdPs: ["Azure AD", "Okta", "Google Workspace"],
    },
    alerts: [],
    tags: ["critical", "customer-facing", "pci-scope"],
  },
  {
    id: "prod-eu-west-001",
    name: "Production EU-West",
    type: "production",
    status: "healthy",
    region: "EU-West",
    owner: "platform-team@acme.com",
    ownerTeam: "Platform Engineering",
    version: "v2.4.1-stable",
    deploymentMode: "saas",
    createdAt: "2024-02-01T08:00:00Z",
    updatedAt: "2024-05-15T12:45:00Z",
    metrics: {
      cpu: 38,
      memory: 55,
      storage: 65,
      networkLatency: 8,
      requestRate: 8930,
      errorRate: 0.01,
    },
    limits: {
      users: 50000,
      usersUsed: 42150,
      apiCalls: 25000000,
      apiCallsUsed: 19876500,
      storage: 536870912000,
      storageUsed: 345678000000,
    },
    security: {
      encryptionAtRest: true,
      encryptionInTransit: true,
      mfaRequired: true,
      ssoEnabled: true,
      compliance: ["soc2", "iso27001", "gdpr"],
      lastSecurityScan: "4 hours ago",
      vulnerabilities: 0,
    },
    audit: {
      lastDeployment: "2024-05-15T08:00:00Z",
      lastBackup: "2024-05-15T10:00:00Z",
      lastSecurityAudit: "2024-05-10T00:00:00Z",
      changeCount24h: 2,
      incidentCount30d: 0,
    },
    activeServices: [
      "Identity API",
      "Auth Engine",
      "Session Mgr",
      "Token Service",
    ],
    dependencies: {
      databases: ["PostgreSQL EU"],
      caches: ["Redis EU"],
      messageQueues: ["RabbitMQ EU"],
      externalIdPs: ["Azure AD EU", "Okta"],
    },
    alerts: [],
    tags: ["critical", "gdpr-compliant"],
  },
  {
    id: "staging-us-east-001",
    name: "Staging US-East",
    type: "staging",
    status: "degraded",
    region: "US-East",
    owner: "engineering@acme.com",
    ownerTeam: "Engineering",
    version: "v2.5.0-rc2",
    deploymentMode: "saas",
    createdAt: "2024-03-10T08:00:00Z",
    updatedAt: "2024-05-15T16:20:00Z",
    metrics: {
      cpu: 78,
      memory: 85,
      storage: 45,
      networkLatency: 24,
      requestRate: 2100,
      errorRate: 2.5,
    },
    limits: {
      users: 5000,
      usersUsed: 2341,
      apiCalls: 1000000,
      apiCallsUsed: 456000,
      storage: 107374182400,
      storageUsed: 48000000000,
    },
    security: {
      encryptionAtRest: true,
      encryptionInTransit: true,
      mfaRequired: false,
      ssoEnabled: true,
      compliance: [],
      lastSecurityScan: "1 day ago",
      vulnerabilities: 2,
    },
    audit: {
      lastDeployment: "2024-05-15T14:00:00Z",
      lastBackup: "2024-05-15T00:00:00Z",
      lastSecurityAudit: "2024-05-01T00:00:00Z",
      changeCount24h: 12,
      incidentCount30d: 1,
    },
    activeServices: ["Identity API", "Auth Engine", "Session Mgr"],
    dependencies: {
      databases: ["PostgreSQL Staging"],
      caches: ["Redis Staging"],
      messageQueues: ["RabbitMQ Staging"],
      externalIdPs: ["Azure AD Staging"],
    },
    alerts: [
      {
        id: "alert-001",
        severity: "high",
        category: "performance",
        message: "Memory utilization above threshold (85%)",
        timestamp: "2024-05-15T16:15:00Z",
        acknowledged: false,
      },
      {
        id: "alert-002",
        severity: "medium",
        category: "performance",
        message: "Elevated error rate detected",
        timestamp: "2024-05-15T15:45:00Z",
        acknowledged: false,
      },
    ],
    tags: ["testing", "auto-deploy"],
  },
  {
    id: "staging-eu-west-001",
    name: "Staging EU-West",
    type: "staging",
    status: "healthy",
    region: "EU-West",
    owner: "engineering@acme.com",
    ownerTeam: "Engineering",
    version: "v2.5.0-rc2",
    deploymentMode: "saas",
    createdAt: "2024-03-12T08:00:00Z",
    updatedAt: "2024-05-15T11:30:00Z",
    metrics: {
      cpu: 32,
      memory: 48,
      storage: 38,
      networkLatency: 15,
      requestRate: 980,
      errorRate: 0.05,
    },
    limits: {
      users: 2500,
      usersUsed: 1200,
      apiCalls: 500000,
      apiCallsUsed: 234000,
      storage: 53687091200,
      storageUsed: 20000000000,
    },
    security: {
      encryptionAtRest: true,
      encryptionInTransit: true,
      mfaRequired: false,
      ssoEnabled: true,
      compliance: [],
      lastSecurityScan: "2 days ago",
      vulnerabilities: 0,
    },
    audit: {
      lastDeployment: "2024-05-14T16:00:00Z",
      lastBackup: "2024-05-15T00:00:00Z",
      lastSecurityAudit: "2024-05-01T00:00:00Z",
      changeCount24h: 5,
      incidentCount30d: 0,
    },
    activeServices: ["Identity API", "Auth Engine"],
    dependencies: {
      databases: ["PostgreSQL Staging EU"],
      caches: ["Redis Staging EU"],
      messageQueues: ["RabbitMQ Staging EU"],
      externalIdPs: ["Azure AD Staging"],
    },
    alerts: [],
    tags: ["testing"],
  },
  {
    id: "dev-us-east-001",
    name: "Development US-East",
    type: "development",
    status: "healthy",
    region: "US-East",
    owner: "dev-team@acme.com",
    ownerTeam: "Development",
    version: "v2.5.0-dev.142",
    deploymentMode: "saas",
    createdAt: "2024-04-01T08:00:00Z",
    updatedAt: "2024-05-15T17:00:00Z",
    metrics: {
      cpu: 22,
      memory: 35,
      storage: 28,
      networkLatency: 18,
      requestRate: 450,
      errorRate: 0.1,
    },
    limits: {
      users: 100,
      usersUsed: 67,
      apiCalls: 10000,
      apiCallsUsed: 3400,
      storage: 10737418240,
      storageUsed: 3000000000,
    },
    security: {
      encryptionAtRest: false,
      encryptionInTransit: true,
      mfaRequired: false,
      ssoEnabled: false,
      compliance: [],
      lastSecurityScan: "3 days ago",
      vulnerabilities: 1,
    },
    audit: {
      lastDeployment: "2024-05-15T09:00:00Z",
      lastBackup: "2024-05-14T00:00:00Z",
      lastSecurityAudit: "2024-04-01T00:00:00Z",
      changeCount24h: 8,
      incidentCount30d: 0,
    },
    activeServices: ["Identity API", "Auth Engine"],
    dependencies: {
      databases: ["PostgreSQL Dev"],
      caches: ["Redis Dev"],
      messageQueues: [],
      externalIdPs: ["Azure AD Dev"],
    },
    alerts: [],
    tags: ["development", "ephemeral"],
  },
  {
    id: "onprem-hq-001",
    name: "On-Premises HQ",
    type: "isolated",
    status: "healthy",
    region: "On-Premises",
    owner: "security@acme.com",
    ownerTeam: "Security Operations",
    version: "v2.4.0-lts",
    deploymentMode: "self-hosted",
    createdAt: "2024-01-20T08:00:00Z",
    updatedAt: "2024-05-15T08:00:00Z",
    metrics: {
      cpu: 55,
      memory: 70,
      storage: 82,
      networkLatency: 5,
      requestRate: 3200,
      errorRate: 0.0,
    },
    limits: {
      users: 5000,
      usersUsed: 3421,
      apiCalls: 5000000,
      apiCallsUsed: 1234000,
      storage: 214748364800,
      storageUsed: 175921860444,
    },
    security: {
      encryptionAtRest: true,
      encryptionInTransit: true,
      mfaRequired: true,
      ssoEnabled: true,
      compliance: ["soc2", "iso27001", "hipaa"],
      lastSecurityScan: "6 hours ago",
      vulnerabilities: 0,
    },
    audit: {
      lastDeployment: "2024-05-01T02:00:00Z",
      lastBackup: "2024-05-15T06:00:00Z",
      lastSecurityAudit: "2024-05-14T00:00:00Z",
      changeCount24h: 1,
      incidentCount30d: 0,
    },
    activeServices: [
      "Identity API",
      "Auth Engine",
      "Session Mgr",
      "Token Service",
      "Audit Logs",
    ],
    dependencies: {
      databases: ["PostgreSQL On-Prem"],
      caches: ["Redis On-Prem"],
      messageQueues: ["RabbitMQ On-Prem"],
      externalIdPs: ["Active Directory"],
    },
    alerts: [],
    tags: ["air-gapped", "hipaa-compliant", "restricted"],
  },
];

const recentActivity = [
  {
    id: "act-001",
    type: "deployment",
    environment: "Production US-East",
    actor: "platform-team@acme.com",
    action: "Deployed v2.4.1-stable",
    timestamp: "2 hours ago",
    status: "success",
  },
  {
    id: "act-002",
    type: "scaling",
    environment: "Staging US-East",
    actor: "auto-scaler",
    action: "Auto-scaled to 4 replicas",
    timestamp: "4 hours ago",
    status: "success",
  },
  {
    id: "act-003",
    type: "alert",
    environment: "Staging US-East",
    actor: "monitoring-system",
    action: "Memory threshold alert triggered",
    timestamp: "5 hours ago",
    status: "warning",
  },
  {
    id: "act-004",
    type: "backup",
    environment: "Production EU-West",
    actor: "backup-service",
    action: "Automated backup completed",
    timestamp: "6 hours ago",
    status: "success",
  },
  {
    id: "act-005",
    type: "security",
    environment: "On-Premises HQ",
    actor: "security@acme.com",
    action: "Security scan completed",
    timestamp: "6 hours ago",
    status: "success",
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatBytes(bytes: number): string {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

function calculateHealthScore(env: Environment): number {
  let score = 100;
  if (env.status === "degraded") score -= 20;
  if (env.status === "unhealthy") score -= 50;
  if (env.metrics.errorRate > 1) score -= 15;
  if (env.metrics.cpu > 80) score -= 10;
  if (env.metrics.memory > 80) score -= 10;
  if (env.security.vulnerabilities > 0) score -= 10;
  return Math.max(0, score);
}

// ============================================================================
// COMPONENT: Organization Context Bar
// ============================================================================

function OrganizationContextBar() {
  const tier = tierConfig[orgContext.tier];
  const usagePercent =
    (orgContext.totalEnvironments / orgContext.maxEnvironments) * 100;

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Building className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-foreground">
                  {orgContext.name}
                </h2>
                <Badge className={cn("text-[10px]", tier.badge)}>
                  {tier.label}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {orgContext.deploymentMode === "hybrid"
                  ? "Hybrid deployment (SaaS + Self-hosted)"
                  : `${orgContext.deploymentMode === "saas" ? "SaaS Cloud" : "Self-hosted"} deployment`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            {/* Environment Quota */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  Environment Quota
                </p>
                <p className="text-sm font-medium">
                  {orgContext.totalEnvironments} / {orgContext.maxEnvironments}
                </p>
              </div>
              <div className="w-16">
                <Progress value={usagePercent} className="h-2" />
              </div>
            </div>

            {/* Compliance Badges */}
            <div className="flex items-center gap-2">
              {orgContext.complianceFrameworks
                .filter(Boolean)
                .map((framework) => (
                  <TooltipProvider key={framework}>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge
                          variant="outline"
                          className="text-[10px] uppercase"
                        >
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          {framework}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Compliant with {framework?.toUpperCase()}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
            </div>

            {/* Contact Info */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>Primary: {orgContext.primaryAdmin}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// COMPONENT: Platform Overview Metrics
// ============================================================================

function PlatformOverviewMetrics() {
  const totalEnvironments = environmentsData.length;
  const healthyCount = environmentsData.filter(
    (e) => e.status === "healthy",
  ).length;
  const degradedCount = environmentsData.filter(
    (e) => e.status === "degraded",
  ).length;
  const criticalCount = environmentsData.filter(
    (e) => e.status === "unhealthy",
  ).length;
  const totalAlerts = environmentsData.reduce(
    (acc, env) => acc + env.alerts.length,
    0,
  );
  const activeUsers = environmentsData.reduce(
    (acc, env) => acc + env.limits.usersUsed,
    0,
  );
  const avgHealthScore = Math.round(
    environmentsData.reduce((acc, env) => acc + calculateHealthScore(env), 0) /
      totalEnvironments,
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <MetricCard
        title="Total Environments"
        value={totalEnvironments}
        icon={Server}
        subtitle={`of ${orgContext.maxEnvironments} allowed`}
      />
      <MetricCard
        title="Healthy"
        value={healthyCount}
        icon={CheckCircle2}
        variant="accent"
        trend={{
          value: 100 * (healthyCount / totalEnvironments),
          isPositive: true,
        }}
      />
      <MetricCard
        title="Degraded"
        value={degradedCount}
        icon={AlertTriangle}
        variant={degradedCount > 0 ? "warning" : "default"}
      />
      <MetricCard
        title="Critical"
        value={criticalCount}
        icon={XCircle}
        variant={criticalCount > 0 ? "destructive" : "default"}
      />
      <MetricCard
        title="Active Alerts"
        value={totalAlerts}
        icon={Bell}
        variant={totalAlerts > 0 ? "warning" : "default"}
        subtitle={totalAlerts > 0 ? "Action required" : "All clear"}
      />
      <MetricCard
        title="Health Score"
        value={`${avgHealthScore}%`}
        icon={Activity}
        variant={
          avgHealthScore >= 90
            ? "accent"
            : avgHealthScore >= 70
              ? "warning"
              : "destructive"
        }
        subtitle="Avg. across all envs"
      />
    </div>
  );
}

// ============================================================================
// COMPONENT: Platform Health Status
// ============================================================================

function PlatformHealthStatus() {
  const criticalAlerts = environmentsData.flatMap((env) =>
    env.alerts.filter(
      (a) => a.severity === "critical" || a.severity === "high",
    ),
  );

  const overallStatus: EnvironmentStatus =
    criticalAlerts.length > 0
      ? "degraded"
      : environmentsData.some((e) => e.status === "unhealthy")
        ? "unhealthy"
        : environmentsData.some((e) => e.status === "degraded")
          ? "degraded"
          : "healthy";

  const config = statusConfig[overallStatus];
  const StatusIcon = config.icon;

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Monitor className="h-4 w-4 text-muted-foreground" />
            Platform Health Status
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Last updated:</span>
            <span className="text-xs font-medium">2s ago</span>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn("p-3 rounded-lg", config.bgColor)}>
                <StatusIcon className={cn("h-6 w-6", config.color)} />
              </div>
              <div>
                <h3 className={cn("text-lg font-semibold", config.color)}>
                  {config.label}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {config.description}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">
                {environmentsData.filter((e) => e.status === "healthy").length}/
                {environmentsData.length}
              </p>
              <p className="text-xs text-muted-foreground">
                Systems operational
              </p>
            </div>
          </div>
        </div>

        {criticalAlerts.length > 0 && (
          <div className="p-4 bg-destructive/5 border-b border-border">
            <h4 className="text-sm font-medium text-destructive flex items-center gap-2 mb-3">
              <ShieldAlert className="h-4 w-4" />
              Active Alerts ({criticalAlerts.length})
            </h4>
            <div className="space-y-2">
              {criticalAlerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-3 rounded-md bg-card border border-border"
                >
                  <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {alert.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {alert.category} • {alert.timestamp}
                    </p>
                  </div>
                  <Badge variant="destructive" className="text-[10px] shrink-0">
                    {alert.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          <div className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Regions
            </p>
            <p className="text-lg font-semibold mt-1">
              {orgContext.regions.length}
            </p>
          </div>
          <div className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Services
            </p>
            <p className="text-lg font-semibold mt-1">42</p>
          </div>
          <div className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Deployments
            </p>
            <p className="text-lg font-semibold mt-1">24h</p>
          </div>
          <div className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Uptime
            </p>
            <p className="text-lg font-semibold mt-1 text-emerald-500">
              99.97%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// COMPONENT: Environment Card
// ============================================================================

function EnvironmentCard({
  environment,
  onViewDetails,
}: {
  environment: Environment;
  onViewDetails: (env: Environment) => void;
}) {
  const status = statusConfig[environment.status];
  const type = typeConfig[environment.type];
  const StatusIcon = status.icon;
  const TypeIcon = type.icon;
  const healthScore = calculateHealthScore(environment);

  return (
    <Card className="border-border bg-card hover:border-border/80 hover:shadow-md transition-all group">
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "p-2 rounded-lg",
                  type.color.replace("text-", "bg-").replace("500", "500/10"),
                )}
              >
                <TypeIcon className={cn("h-4 w-4", type.color)} />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground truncate">
                  {environment.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[10px]">
                    {environment.region}
                  </Badge>
                  <Badge
                    className={cn(
                      "text-[10px] border-0",
                      status.bgColor,
                      status.color,
                    )}
                  >
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {status.label}
                  </Badge>
                </div>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onViewDetails(environment)}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View details</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Metrics */}
        <div className="p-4 space-y-3">
          {/* Health Score */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Health Score</span>
            <span
              className={cn(
                "font-medium",
                healthScore >= 90
                  ? "text-emerald-500"
                  : healthScore >= 70
                    ? "text-amber-500"
                    : "text-destructive",
              )}
            >
              {healthScore}%
            </span>
          </div>
          <Progress
            value={healthScore}
            className={cn(
              "h-1.5",
              healthScore >= 90
                ? "bg-emerald-500"
                : healthScore >= 70
                  ? "bg-amber-500"
                  : "bg-destructive",
            )}
          />

          {/* Resource Usage */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">CPU</p>
              <p
                className={cn(
                  "text-sm font-medium",
                  environment.metrics.cpu > 80
                    ? "text-destructive"
                    : "text-foreground",
                )}
              >
                {environment.metrics.cpu}%
              </p>
            </div>
            <div className="text-center border-x border-border">
              <p className="text-xs text-muted-foreground">Memory</p>
              <p
                className={cn(
                  "text-sm font-medium",
                  environment.metrics.memory > 80
                    ? "text-destructive"
                    : "text-foreground",
                )}
              >
                {environment.metrics.memory}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Storage</p>
              <p className="text-sm font-medium">
                {environment.metrics.storage}%
              </p>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="pt-2 border-t border-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Users</span>
              <span className="font-mono">
                {formatNumber(environment.limits.usersUsed)} /{" "}
                {formatNumber(environment.limits.users)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">API Calls</span>
              <span className="font-mono">
                {formatNumber(environment.limits.apiCallsUsed)} /{" "}
                {formatNumber(environment.limits.apiCalls)}
              </span>
            </div>
          </div>

          {/* Alerts & Security */}
          {(environment.alerts.length > 0 ||
            environment.security.vulnerabilities > 0) && (
            <div className="flex items-center gap-2 pt-2">
              {environment.alerts.length > 0 && (
                <Badge variant="destructive" className="text-[10px]">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {environment.alerts.length} alert
                  {environment.alerts.length > 1 ? "s" : ""}
                </Badge>
              )}
              {environment.security.vulnerabilities > 0 && (
                <Badge
                  variant="outline"
                  className="text-[10px] text-amber-500 border-amber-500"
                >
                  <ShieldAlert className="h-3 w-3 mr-1" />
                  {environment.security.vulnerabilities} vuln.
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Cloud className="h-3 w-3" />
              <span>{environment.deploymentMode}</span>
              <span className="text-border">|</span>
              <span>v{environment.version}</span>
            </div>
            <div className="flex items-center gap-1">
              {environment.security.compliance
                .filter(Boolean)
                .slice(0, 2)
                .map((c) => (
                  <TooltipProvider key={c}>
                    <Tooltip>
                      <TooltipTrigger>
                        <ShieldCheck className="h-3 w-3 text-emerald-500" />
                      </TooltipTrigger>
                      <TooltipContent>{c?.toUpperCase()}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// COMPONENT: Environment Detail Dialog
// ============================================================================

function EnvironmentDetailDialog({
  environment,
  open,
  onOpenChange,
}: {
  environment: Environment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!environment) return null;

  const status = statusConfig[environment.status];
  const type = typeConfig[environment.type];
  const StatusIcon = status.icon;
  const TypeIcon = type.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "p-2 rounded-lg",
                type.color.replace("text-", "bg-").replace("500", "500/10"),
              )}
            >
              <TypeIcon className={cn("h-5 w-5", type.color)} />
            </div>
            <div>
              <DialogTitle className="text-xl">{environment.name}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <Badge
                  className={cn(
                    "text-[10px] border-0",
                    status.bgColor,
                    status.color,
                  )}
                >
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {status.label}
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  {environment.region}
                </Badge>
                <span className="text-xs">ID: {environment.id}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Overview Tab */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium uppercase text-muted-foreground">
                  Owner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">{environment.ownerTeam}</p>
                <p className="text-xs text-muted-foreground">
                  {environment.owner}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium uppercase text-muted-foreground">
                  Version
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">{environment.version}</p>
                <p className="text-xs text-muted-foreground">
                  {environment.deploymentMode}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium uppercase text-muted-foreground">
                  Created
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">
                  {new Date(environment.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  Last updated:{" "}
                  {new Date(environment.updatedAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Metrics */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              Resource Metrics
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">CPU</span>
                  </div>
                  <p
                    className={cn(
                      "text-2xl font-semibold mt-2",
                      environment.metrics.cpu > 80
                        ? "text-destructive"
                        : "text-foreground",
                    )}
                  >
                    {environment.metrics.cpu}%
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <MemoryStick className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Memory
                    </span>
                  </div>
                  <p
                    className={cn(
                      "text-2xl font-semibold mt-2",
                      environment.metrics.memory > 80
                        ? "text-destructive"
                        : "text-foreground",
                    )}
                  >
                    {environment.metrics.memory}%
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Storage
                    </span>
                  </div>
                  <p className="text-2xl font-semibold mt-2">
                    {environment.metrics.storage}%
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Req/sec
                    </span>
                  </div>
                  <p className="text-2xl font-semibold mt-2">
                    {formatNumber(environment.metrics.requestRate)}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Security */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              Security Configuration
            </h4>
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    {environment.security.encryptionAtRest ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                    <span className="text-sm">Encryption at Rest</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {environment.security.encryptionInTransit ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                    <span className="text-sm">Encryption in Transit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {environment.security.mfaRequired ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm">MFA Required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {environment.security.ssoEnabled ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm">SSO Enabled</span>
                  </div>
                </div>
                {environment.security.compliance.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">
                      Compliance Frameworks
                    </p>
                    <div className="flex gap-2">
                      {environment.security.compliance
                        .filter(Boolean)
                        .map((c) => (
                          <Badge
                            key={c}
                            variant="outline"
                            className="text-xs uppercase"
                          >
                            <ShieldCheck className="h-3 w-3 mr-1" />
                            {c}
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Dependencies */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              Dependencies
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium uppercase text-muted-foreground flex items-center gap-2">
                    <Database className="h-3 w-3" />
                    Databases
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {environment.dependencies.databases.map((db) => (
                      <Badge key={db} variant="secondary" className="text-xs">
                        {db}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium uppercase text-muted-foreground flex items-center gap-2">
                    <Cloud className="h-3 w-3" />
                    External IdPs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {environment.dependencies.externalIdPs.map((idp) => (
                      <Badge key={idp} variant="secondary" className="text-xs">
                        {idp}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// COMPONENT: Compliance & Governance Panel
// ============================================================================

function ComplianceGovernancePanel() {
  return (
    <Card className="border-border bg-card h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          Governance & Compliance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Compliance Status */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium uppercase text-muted-foreground">
            Compliance Status
          </h4>
          <div className="space-y-2">
            {["soc2", "iso27001", "gdpr"].map((framework) => {
              const isCompliant = orgContext.complianceFrameworks.includes(
                framework as ComplianceLevel,
              );
              return (
                <div
                  key={framework}
                  className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <Scan className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm uppercase">{framework}</span>
                  </div>
                  {isCompliant ? (
                    <Badge
                      variant="outline"
                      className="text-[10px] text-emerald-500 border-emerald-500"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Compliant
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-[10px] text-muted-foreground"
                    >
                      N/A
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit Summary */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium uppercase text-muted-foreground">
            Audit Summary (30d)
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-md bg-muted/50 text-center">
              <p className="text-lg font-semibold">23</p>
              <p className="text-[10px] text-muted-foreground">Deployments</p>
            </div>
            <div className="p-2 rounded-md bg-muted/50 text-center">
              <p className="text-lg font-semibold">0</p>
              <p className="text-[10px] text-muted-foreground">Incidents</p>
            </div>
            <div className="p-2 rounded-md bg-muted/50 text-center">
              <p className="text-lg font-semibold">156</p>
              <p className="text-[10px] text-muted-foreground">Changes</p>
            </div>
            <div className="p-2 rounded-md bg-muted/50 text-center">
              <p className="text-lg font-semibold">100%</p>
              <p className="text-[10px] text-muted-foreground">Backups OK</p>
            </div>
          </div>
        </div>

        {/* Policy Links */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium uppercase text-muted-foreground">
            Policies
          </h4>
          <div className="space-y-1">
            {[
              { label: "Data Retention Policy", icon: FileClock },
              { label: "Access Control Policy", icon: Lock },
              { label: "Incident Response Plan", icon: ShieldAlert },
            ].map((policy) => (
              <Button
                key={policy.label}
                variant="ghost"
                className="w-full justify-start h-8 text-xs"
              >
                <policy.icon className="h-3 w-3 mr-2" />
                {policy.label}
                <ChevronRight className="h-3 w-3 ml-auto" />
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// COMPONENT: Recent Activity Feed
// ============================================================================

function RecentActivityFeed() {
  const getActivityIcon = (type: string, status: string) => {
    const icons: Record<string, React.ElementType> = {
      deployment: GitBranch,
      scaling: Scale,
      alert: AlertCircle,
      backup: Database,
      security: Shield,
    };
    const Icon = icons[type] || Activity;
    const colorClass =
      status === "success"
        ? "text-emerald-500"
        : status === "warning"
          ? "text-amber-500"
          : "text-foreground";
    return <Icon className={cn("h-4 w-4", colorClass)} />;
  };

  return (
    <Card className="border-border bg-card h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <History className="h-4 w-4 text-muted-foreground" />
            Recent Activity
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-7 text-xs">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              <div className="p-1.5 rounded bg-muted">
                {getActivityIcon(activity.type, activity.status)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {activity.action}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.environment} • {activity.actor}
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {activity.timestamp}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// COMPONENT: Quick Actions Panel
// ============================================================================

function QuickActionsPanel() {
  const actions = [
    {
      label: "Deploy New Environment",
      icon: Plus,
      description: "Create staging or dev env",
      primary: true,
    },
    {
      label: "View Audit Logs",
      icon: FileText,
      description: "Access full audit trail",
    },
    {
      label: "Configure Backups",
      icon: Database,
      description: "Manage backup policies",
    },
    {
      label: "Set Up Alerting",
      icon: Bell,
      description: "Configure notifications",
    },
    {
      label: "Manage RBAC",
      icon: Users,
      description: "Review access permissions",
    },
    {
      label: "View Reports",
      icon: BarChart3,
      description: "Generate compliance reports",
    },
  ];

  return (
    <Card className="border-border bg-card h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Zap className="h-4 w-4 text-muted-foreground" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant={action.primary ? "default" : "ghost"}
              className={cn(
                "w-full justify-start h-auto py-3",
                action.primary && "mb-2",
              )}
            >
              <div
                className={cn(
                  "p-1.5 rounded mr-3",
                  action.primary ? "bg-primary-foreground/20" : "bg-muted",
                )}
              >
                <action.icon className="h-4 w-4" />
              </div>
              <div className="text-left">
                <p
                  className={cn(
                    "text-sm font-medium",
                    !action.primary && "font-normal",
                  )}
                >
                  {action.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function EnvironmentsPage() {
  const [selectedEnvironment, setSelectedEnvironment] =
    React.useState<Environment | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [filter, setFilter] = React.useState<"all" | EnvironmentType>("all");

  // Advanced filter states
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<
    EnvironmentStatus | "all"
  >("all");
  const [regionFilter, setRegionFilter] = React.useState<string>("all");
  const [teamFilter, setTeamFilter] = React.useState<string>("all");
  const [deploymentFilter, setDeploymentFilter] = React.useState<
    DeploymentMode | "all"
  >("all");
  const [showFilters, setShowFilters] = React.useState(false);

  // New environment dialog state
  const [createOpen, setCreateOpen] = React.useState(false);
  const [newEnvName, setNewEnvName] = React.useState("");
  const [newEnvType, setNewEnvType] =
    React.useState<EnvironmentType>("development");
  const [newEnvRegion, setNewEnvRegion] = React.useState("US-East");
  const [newEnvMode, setNewEnvMode] = React.useState<DeploymentMode>("saas");
  const [isCreating, setIsCreating] = React.useState(false);

  const handleViewDetails = (env: Environment) => {
    setSelectedEnvironment(env);
    setDetailOpen(true);
  };

  // Get unique values for filters
  const uniqueRegions = Array.from(
    new Set(environmentsData.map((e) => e.region)),
  );
  const uniqueTeams = Array.from(
    new Set(environmentsData.map((e) => e.ownerTeam)),
  );

  // Apply all filters
  const filteredEnvironments = environmentsData.filter((env) => {
    // Type filter
    if (filter !== "all" && env.type !== filter) return false;

    // Search query
    if (
      searchQuery &&
      !env.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !env.owner.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !env.id.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Status filter
    if (statusFilter !== "all" && env.status !== statusFilter) return false;

    // Region filter
    if (regionFilter !== "all" && env.region !== regionFilter) return false;

    // Team filter
    if (teamFilter !== "all" && env.ownerTeam !== teamFilter) return false;

    // Deployment mode filter
    if (deploymentFilter !== "all" && env.deploymentMode !== deploymentFilter)
      return false;

    return true;
  });

  const sortedEnvironments = [...filteredEnvironments].sort((a, b) => {
    const typeOrder: Record<EnvironmentType, number> = {
      production: 0,
      staging: 1,
      development: 2,
      isolated: 3,
    };
    if (typeOrder[a.type] !== typeOrder[b.type]) {
      return typeOrder[a.type] - typeOrder[b.type];
    }
    return a.name.localeCompare(b.name);
  });

  // Count active filters
  const activeFiltersCount = [
    statusFilter !== "all",
    regionFilter !== "all",
    teamFilter !== "all",
    deploymentFilter !== "all",
    searchQuery !== "",
  ].filter(Boolean).length;

  // Handle create environment
  const handleCreateEnvironment = async () => {
    if (!newEnvName.trim()) return;

    setIsCreating(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In a real app, this would create the environment
    console.log("Creating environment:", {
      name: newEnvName,
      type: newEnvType,
      region: newEnvRegion,
      deploymentMode: newEnvMode,
    });

    setIsCreating(false);
    setCreateOpen(false);

    // Reset form
    setNewEnvName("");
    setNewEnvType("development");
    setNewEnvRegion("US-East");
    setNewEnvMode("saas");
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setRegionFilter("all");
    setTeamFilter("all");
    setDeploymentFilter("all");
    setFilter("all");
  };

  return (
    <div className="space-y-6 text-foreground">
      {/* =========================================================================
          HEADER SECTION
          Page title and description
          ========================================================================= */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-card-foreground">
              Identity Environment Management
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Monitor, manage, and govern your Identity deployment environments
              across all regions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Filter Dropdown */}
            <DropdownMenu open={showFilters} onOpenChange={setShowFilters}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                  {activeFiltersCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-2 text-[10px] h-5 min-w-[18px] flex items-center justify-center"
                    >
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Filter Environments</span>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs text-muted-foreground"
                      onClick={clearFilters}
                    >
                      Clear all
                    </Button>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Search */}
                <div className="p-2">
                  <Label className="text-xs mb-2 block">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, owner, ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 h-8 text-sm"
                    />
                  </div>
                </div>

                <DropdownMenuSeparator />

                {/* Status Filter */}
                <DropdownMenuLabel className="text-xs">
                  Status
                </DropdownMenuLabel>
                {(
                  [
                    "all",
                    "healthy",
                    "degraded",
                    "unhealthy",
                    "maintenance",
                  ] as const
                ).map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilter === status}
                    onCheckedChange={() => setStatusFilter(status)}
                  >
                    <span className="capitalize">
                      {status === "all" ? "All Statuses" : status}
                    </span>
                  </DropdownMenuCheckboxItem>
                ))}

                <DropdownMenuSeparator />

                {/* Region Filter */}
                <DropdownMenuLabel className="text-xs">
                  Region
                </DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={regionFilter === "all"}
                  onCheckedChange={() => setRegionFilter("all")}
                >
                  All Regions
                </DropdownMenuCheckboxItem>
                {uniqueRegions.map((region) => (
                  <DropdownMenuCheckboxItem
                    key={region}
                    checked={regionFilter === region}
                    onCheckedChange={() => setRegionFilter(region)}
                  >
                    {region}
                  </DropdownMenuCheckboxItem>
                ))}

                <DropdownMenuSeparator />

                {/* Team Filter */}
                <DropdownMenuLabel className="text-xs">Team</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={teamFilter === "all"}
                  onCheckedChange={() => setTeamFilter("all")}
                >
                  All Teams
                </DropdownMenuCheckboxItem>
                {uniqueTeams.map((team) => (
                  <DropdownMenuCheckboxItem
                    key={team}
                    checked={teamFilter === team}
                    onCheckedChange={() => setTeamFilter(team)}
                  >
                    {team}
                  </DropdownMenuCheckboxItem>
                ))}

                <DropdownMenuSeparator />

                {/* Deployment Mode Filter */}
                <DropdownMenuLabel className="text-xs">
                  Deployment Mode
                </DropdownMenuLabel>
                {(["all", "saas", "self-hosted", "hybrid"] as const).map(
                  (mode) => (
                    <DropdownMenuCheckboxItem
                      key={mode}
                      checked={deploymentFilter === mode}
                      onCheckedChange={() => setDeploymentFilter(mode)}
                    >
                      <span className="capitalize">
                        {mode === "all" ? "All Modes" : mode}
                      </span>
                    </DropdownMenuCheckboxItem>
                  ),
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* New Environment Button */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8">
                  <Plus className="h-4 w-4 mr-2" />
                  New Environment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create New Environment</DialogTitle>
                  <DialogDescription>
                    Configure a new Identity environment for your organization.
                    {orgContext.totalEnvironments >=
                      orgContext.maxEnvironments && (
                      <span className="block mt-2 text-destructive">
                        Warning: You have reached your environment quota limit (
                        {orgContext.maxEnvironments}). Upgrade your plan to
                        create more environments.
                      </span>
                    )}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  {/* Environment Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Environment Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Production EU-North"
                      value={newEnvName}
                      onChange={(e) => setNewEnvName(e.target.value)}
                    />
                  </div>

                  {/* Environment Type */}
                  <div className="space-y-2">
                    <Label>Environment Type</Label>
                    <Select
                      value={newEnvType}
                      onValueChange={(v) => setNewEnvType(v as EnvironmentType)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="production">Production</SelectItem>
                        <SelectItem value="staging">Staging</SelectItem>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="isolated">Isolated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Region */}
                  <div className="space-y-2">
                    <Label>Region</Label>
                    <Select
                      value={newEnvRegion}
                      onValueChange={setNewEnvRegion}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {orgContext.regions.map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Deployment Mode */}
                  <div className="space-y-2">
                    <Label>Deployment Mode</Label>
                    <Select
                      value={newEnvMode}
                      onValueChange={(v) => setNewEnvMode(v as DeploymentMode)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="saas">
                          SaaS Cloud (Managed)
                        </SelectItem>
                        <SelectItem value="self-hosted">Self-Hosted</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {newEnvMode === "saas" &&
                        "Fully managed by Identity with automatic updates and monitoring."}
                      {newEnvMode === "self-hosted" &&
                        "Deploy on your own infrastructure with full control."}
                      {newEnvMode === "hybrid" &&
                        "Mix of SaaS and self-hosted components."}
                    </p>
                  </div>

                  {/* Info Box */}
                  <div className="p-3 rounded-md bg-muted text-xs space-y-1">
                    <p className="font-medium">What happens next?</p>
                    <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                      <li>Environment will be provisioned in 5-10 minutes</li>
                      <li>You will receive an email when ready</li>
                      <li>Default security policies will be applied</li>
                      <li>Audit logging will be enabled automatically</li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCreateOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateEnvironment}
                    disabled={
                      !newEnvName.trim() ||
                      isCreating ||
                      orgContext.totalEnvironments >= orgContext.maxEnvironments
                    }
                  >
                    {isCreating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Environment"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: ORGANIZATION CONTEXT
          Enterprise organization overview
          ========================================================================= */}
      <OrganizationContextBar />

      {/* =========================================================================
          SECTION 2: PLATFORM OVERVIEW METRICS
          Key performance indicators
          ========================================================================= */}
      <PlatformOverviewMetrics />

      {/* =========================================================================
          SECTION 3: PLATFORM HEALTH STATUS
          Critical system status and alerts
          ========================================================================= */}
      <PlatformHealthStatus />

      {/* =========================================================================
          SECTION 4: ENVIRONMENT GRID
          Filterable environment cards
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Environments
          </h2>
          <Tabs
            value={filter}
            onValueChange={(v) => setFilter(v as typeof filter)}
          >
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-xs">
                All
              </TabsTrigger>
              <TabsTrigger value="production" className="text-xs">
                Production
              </TabsTrigger>
              <TabsTrigger value="staging" className="text-xs">
                Staging
              </TabsTrigger>
              <TabsTrigger value="development" className="text-xs">
                Dev
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedEnvironments.map((environment) => (
            <EnvironmentCard
              key={environment.id}
              environment={environment}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: GOVERNANCE & OPERATIONS
          Compliance, activity, and quick actions
          ========================================================================= */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Governance & Operations
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ComplianceGovernancePanel />
          </div>
          <div className="lg:col-span-1">
            <RecentActivityFeed />
          </div>
          <div className="lg:col-span-1">
            <QuickActionsPanel />
          </div>
        </div>
      </section>

      {/* =========================================================================
          DETAIL DIALOG
          Environment detail modal
          ========================================================================= */}
      <EnvironmentDetailDialog
        environment={selectedEnvironment}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}

// Missing import for Building icon
import { Building } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dashboard/ui/dropdown-menu";
import { Input } from "@/components/dashboard/ui/input";
import { Label } from "@/components/dashboard/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/dashboard/ui/select";
