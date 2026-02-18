"use client";

import { MetricCard } from "@/components/dashboard/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/dashboard/ui/card";
import { Badge } from "@/components/dashboard/ui/badge";
import { Progress } from "@/components/dashboard/ui/progress";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Shield,
  Key,
  Users,
  Activity,
  Lock,
  Fingerprint,
  CheckCircle2,
  AlertCircle,
  Server,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  ShieldCheck,
  ShieldAlert,
  Vault,
  Terminal,
  Globe,
  Clock,
  Zap,
} from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

interface ProtectedSystem {
  id: string;
  name: string;
  type: "vault" | "ssh" | "api" | "database" | "application";
  status: "healthy" | "degraded" | "critical";
  authMethod: string;
  lastAuth: string;
  totalAuths: number;
}

// ============================================================================
// MOCK DATA - Identity Platform State
// ============================================================================

const identityStatus = {
  status: "operational" as const,
  lastIncident: "14 days ago",
  uptime: "99.97%",
};

const globalHealthData = {
  authSuccessRate: 98.7,
  activeSessions: 1247,
  failedAttempts24h: 23,
  tokenIssuance24h: 4521,
};

const securityPostureData = {
  mfaCoverage: 87,
  passwordlessAdoption: 34,
  policyCompliance: 94,
  rbacViolations: 2,
};

const protectedSystems: ProtectedSystem[] = [
  {
    id: "vault-001",
    name: "HashiCorp Vault",
    type: "vault",
    status: "healthy",
    authMethod: "AppRole + LDAP",
    lastAuth: "2 minutes ago",
    totalAuths: 45231,
  },
  {
    id: "ssh-001",
    name: "SSH Bastion",
    type: "ssh",
    status: "healthy",
    authMethod: "Certificate-based",
    lastAuth: "5 minutes ago",
    totalAuths: 12847,
  },
  {
    id: "api-001",
    name: "API Gateway",
    type: "api",
    status: "degraded",
    authMethod: "JWT + mTLS",
    lastAuth: "1 minute ago",
    totalAuths: 89234,
  },
  {
    id: "db-001",
    name: "PostgreSQL Cluster",
    type: "database",
    status: "healthy",
    authMethod: "IAM Integration",
    lastAuth: "30 seconds ago",
    totalAuths: 3421,
  },
  {
    id: "app-001",
    name: "Internal Admin Portal",
    type: "application",
    status: "healthy",
    authMethod: "OIDC",
    lastAuth: "10 seconds ago",
    totalAuths: 5621,
  },
];

const recentIncidents = [
  {
    id: "inc-001",
    severity: "high" as const,
    title: "Elevated failed authentication attempts",
    description: "Unusual spike detected from IP range 203.0.113.0/24",
    timestamp: "2 hours ago",
    status: "investigating",
  },
  {
    id: "inc-002",
    severity: "medium" as const,
    title: "Token refresh latency increase",
    description: "Average latency increased by 45%",
    timestamp: "5 hours ago",
    status: "resolved",
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getStatusConfig = (status: string) => {
  const configs = {
    operational: {
      label: "Operational",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30",
      icon: CheckCircle2,
    },
    degraded: {
      label: "Degraded",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/30",
      icon: AlertCircle,
    },
    maintenance: {
      label: "Maintenance",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      icon: Clock,
    },
    critical: {
      label: "Critical",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
      icon: ShieldAlert,
    },
  };
  return configs[status as keyof typeof configs] || configs.operational;
};

const getSystemIcon = (type: string) => {
  const icons = {
    vault: Vault,
    ssh: Terminal,
    api: Globe,
    database: Server,
    application: Zap,
  };
  return icons[type as keyof typeof icons] || Server;
};

const getSystemStatusConfig = (status: string) => {
  const configs = {
    healthy: {
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30",
      label: "Healthy",
    },
    degraded: {
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/30",
      label: "Degraded",
    },
    critical: {
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
      label: "Critical",
    },
  };
  return configs[status as keyof typeof configs] || configs.healthy;
};

const getIncidentSeverityConfig = (severity: string) => {
  const configs = {
    critical: {
      borderColor: "border-red-500/50",
      bgColor: "bg-red-500/10",
      titleColor: "text-red-700",
      descriptionColor: "text-red-600",
      badge: "destructive" as const,
    },
    high: {
      borderColor: "border-orange-500/50",
      bgColor: "bg-orange-500/10",
      titleColor: "text-orange-700",
      descriptionColor: "text-orange-600",
      badge: "default" as const,
    },
    medium: {
      borderColor: "border-amber-500/50",
      bgColor: "bg-amber-500/10",
      titleColor: "text-amber-700",
      descriptionColor: "text-amber-600",
      badge: "secondary" as const,
    },
    low: {
      borderColor: "border-blue-500/50",
      bgColor: "bg-blue-500/10",
      titleColor: "text-blue-700",
      descriptionColor: "text-blue-600",
      badge: "outline" as const,
    },
  };
  return configs[severity as keyof typeof configs] || configs.low;
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function StatusBadge({ status }: { status: string }) {
  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full border",
        config.bgColor,
        config.borderColor
      )}
    >
      <Icon className={cn("h-4 w-4", config.color)} />
      <span className={cn("text-sm font-medium", config.color)}>{config.label}</span>
    </div>
  );
}

function SecurityMetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ElementType;
  trend?: { value: number; isPositive: boolean };
}) {
  return (
    <Card className="border-border bg-card hover:border-border/80 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-semibold tabular-nums text-foreground">{value}%</p>
              {trend && (
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.isPositive ? "text-emerald-500" : "text-red-500"
                  )}
                >
                  {trend.isPositive ? "+" : ""}
                  {trend.value}%
                </span>
              )}
            </div>
            <Progress value={value} className="h-1.5" />
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <div className="rounded-md bg-secondary p-2 text-muted-foreground">
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProtectedSystemCard({ system }: { system: ProtectedSystem }) {
  const statusConfig = getSystemStatusConfig(system.status);
  const SystemIcon = getSystemIcon(system.type);

  return (
    <Card
      className={cn(
        "border-border bg-card hover:border-border/80 transition-colors",
        system.status === "degraded" && "border-amber-500/50"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={cn("rounded-md p-2", statusConfig.bgColor, statusConfig.color)}>
              <SystemIcon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{system.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{system.authMethod}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-muted-foreground">
                  {system.totalAuths.toLocaleString()} auths
                </span>
                <span className="text-xs text-muted-foreground">Last: {system.lastAuth}</span>
              </div>
            </div>
          </div>
          <Badge
            variant={system.status === "healthy" ? "secondary" : "outline"}
            className={cn(
              "text-xs",
              statusConfig.color,
              system.status === "healthy" && statusConfig.bgColor
            )}
          >
            {statusConfig.label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function IncidentCard({ incident }: { incident: (typeof recentIncidents)[0] }) {
  const config = getIncidentSeverityConfig(incident.severity);

  return (
    <div className={cn("p-3 rounded-lg border", config.borderColor, config.bgColor)}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={cn("text-sm font-medium", config.titleColor)}>{incident.title}</p>
            <Badge variant={config.badge} className="text-[10px] uppercase">
              {incident.status}
            </Badge>
          </div>
          <p className={cn("text-xs mt-0.5", config.descriptionColor)}>{incident.description}</p>
          <p className="text-[10px] text-muted-foreground mt-2">{incident.timestamp}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function IdentityPage() {
  const statusConfig = getStatusConfig(identityStatus.status);

  return (
    <div className="space-y-6 text-foreground">
      {/* =========================================================================
          HEADER SECTION
          Strategic header with status badge
          ========================================================================= */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-card-foreground">Identity Platform</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Central control system for authentication, authorization, and identity governance
          </p>
        </div>
        <StatusBadge status={identityStatus.status} />
      </div>

      {/* =========================================================================
          SECTION 1: IDENTITY GLOBAL HEALTH
          Primary metrics for identity system health
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-2 w-2 rounded-full animate-pulse",
              statusConfig.color.replace("text-", "bg-")
            )}
          />
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Identity Global Health
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Auth Success Rate"
            value={`${globalHealthData.authSuccessRate}%`}
            subtitle="Last 24 hours"
            icon={ShieldCheck}
            trend={{ value: 0.8, isPositive: true }}
            variant="accent"
          />
          <MetricCard
            title="Active Sessions"
            value={globalHealthData.activeSessions}
            subtitle="Currently authenticated users"
            icon={Users}
            variant="default"
          />
          <MetricCard
            title="Failed Attempts"
            value={globalHealthData.failedAttempts24h}
            subtitle="Last 24 hours"
            icon={ShieldAlert}
            variant={globalHealthData.failedAttempts24h > 50 ? "destructive" : "warning"}
          />
          <MetricCard
            title="Token Issuance"
            value={globalHealthData.tokenIssuance24h.toLocaleString()}
            subtitle="Access tokens granted (24h)"
            icon={Key}
            trend={{ value: 12.5, isPositive: true }}
          />
        </div>

        {/* Last incident banner */}
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Last Incident</p>
                  <p className="text-xs text-muted-foreground">
                    No critical incidents in the last {identityStatus.lastIncident}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-emerald-500">{identityStatus.uptime}</p>
                <p className="text-xs text-muted-foreground">Uptime (30d)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* =========================================================================
          SECTION 2: SECURITY POSTURE
          Governance and compliance metrics
          ========================================================================= */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Security Posture
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SecurityMetricCard
            title="MFA Coverage"
            value={securityPostureData.mfaCoverage}
            subtitle="Users with MFA enabled"
            icon={Fingerprint}
            trend={{ value: 3.2, isPositive: true }}
          />
          <SecurityMetricCard
            title="Passwordless Adoption"
            value={securityPostureData.passwordlessAdoption}
            subtitle="Passkeys & biometrics"
            icon={Lock}
            trend={{ value: 8.5, isPositive: true }}
          />
          <SecurityMetricCard
            title="Policy Compliance"
            value={securityPostureData.policyCompliance}
            subtitle="Password & access policies"
            icon={ShieldCheck}
          />
          <Card
            className={cn(
              "border-border bg-card hover:border-border/80 transition-colors",
              securityPostureData.rbacViolations > 0 && "border-red-500/30"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    RBAC Violations
                  </p>
                  <p
                    className={cn(
                      "text-2xl font-semibold tabular-nums",
                      securityPostureData.rbacViolations > 0 ? "text-red-500" : "text-emerald-500"
                    )}
                  >
                    {securityPostureData.rbacViolations}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Active violations requiring review
                  </p>
                </div>
                <div
                  className={cn(
                    "rounded-md p-2",
                    securityPostureData.rbacViolations > 0
                      ? "bg-red-500/10 text-red-500"
                      : "bg-emerald-500/10 text-emerald-500"
                  )}
                >
                  <ShieldAlert className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: SYSTEMS PROTECTED BY IDENTITY
          Integrated services overview
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Systems Protected by Identity
          </h2>
          <Link
            href="/admin/platform/systems"
            className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
          >
            View All Systems
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {protectedSystems.map((system) => (
            <ProtectedSystemCard key={system.id} system={system} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: RECENT INCIDENTS
          Operational visibility
          ========================================================================= */}
      {recentIncidents.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Recent Incidents
          </h2>

          <div className="space-y-2">
            {recentIncidents.map((incident) => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 5: QUICK ACTIONS
          Administrative shortcuts
          ========================================================================= */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/users">
            <Card className="border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer h-full">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Manage Users</p>
                  <p className="text-xs text-muted-foreground">Add, edit, or remove</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/platform/policy">
            <Card className="border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer h-full">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Security Policies</p>
                  <p className="text-xs text-muted-foreground">Configure rules</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/platform/integrations">
            <Card className="border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer h-full">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Integrations</p>
                  <p className="text-xs text-muted-foreground">Connect systems</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/audit">
            <Card className="border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer h-full">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Audit Logs</p>
                  <p className="text-xs text-muted-foreground">Review activity</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}
