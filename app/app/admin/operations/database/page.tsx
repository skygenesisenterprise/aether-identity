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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/dashboard/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/dashboard/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/dashboard/ui/tooltip";
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
  ArrowUpRight,
  Archive,
  Building2,
  CheckCircle2,
  Clock,
  Database,
  FileText,
  HardDrive,
  History,
  Layers,
  LayoutGrid,
  Lock,
  Monitor,
  Network,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Settings,
  TrendingUp,
  Unlock,
  Users,
  WifiOff,
  XCircle,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MetricCard } from "@/components/dashboard/metric-card";

// ============================================================================
// TYPES - Enterprise Database Management
// ============================================================================

type DatabaseStatus = "healthy" | "degraded" | "critical" | "unreachable" | "maintenance";
type DatabaseRole = "primary" | "replica" | "read-replica" | "standby" | "analytics";
type DatabaseEngine = "postgresql" | "mysql" | "redis" | "elasticsearch" | "mongodb";
type EnvironmentType = "production" | "staging" | "development";
type ComplianceLevel = "soc2" | "iso27001" | "gdpr" | "hipaa";
type PlanTier = "free" | "pro" | "enterprise";
type PermissionLevel = "viewer" | "operator" | "admin" | "superadmin";

interface DatabaseMetrics {
  connections: {
    active: number;
    max: number;
    waiting: number;
  };
  storage: {
    used: number;
    total: number;
    growthRate: number;
  };
  performance: {
    latency: number;
    throughput: number;
    errorRate: number;
    slowQueries: number;
  };
  replication: {
    lag: number;
    syncStatus: "synced" | "lagging" | "unavailable";
    lastSync: string;
  };
}

interface DatabaseBackup {
  enabled: boolean;
  strategy: "automated" | "manual" | "managed";
  frequency: string;
  lastBackup: string;
  nextBackup: string;
  retentionDays: number;
  storageLocation: string;
  encryption: "aes-256" | "none";
  integrity: "verified" | "pending" | "failed";
}

interface DatabaseSecurity {
  tlsVersion: string;
  encryptionAtRest: boolean;
  authMethod: string;
  networkPolicy: string;
  auditLogging: boolean;
  lastSecurityScan: string;
  vulnerabilities: number;
}

interface DatabaseAlert {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  type: "performance" | "capacity" | "security" | "replication" | "backup";
  message: string;
  timestamp: string;
  acknowledged: boolean;
  correlationId: string;
  autoResolved?: boolean;
}

interface Database {
  id: string;
  name: string;
  displayName: string;
  engine: DatabaseEngine;
  version: string;
  role: DatabaseRole;
  status: DatabaseStatus;
  environment: EnvironmentType;
  region: string;
  organizationId: string;
  clusterId?: string;
  host: string;
  port: number;
  metrics: DatabaseMetrics;
  backup: DatabaseBackup;
  security: DatabaseSecurity;
  compliance: ComplianceLevel[];
  alerts: DatabaseAlert[];
  maintenanceWindow?: string;
  createdAt: string;
  updatedAt: string;
  rbac: {
    minPermission: PermissionLevel;
    allowedRoles: string[];
  };
  planRequired: PlanTier;
}

interface Organization {
  id: string;
  name: string;
  plan: PlanTier;
  region: string;
  status: "active" | "suspended" | "pending";
  databaseCount: number;
  storageQuota: number;
  storageUsed: number;
}

interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  targetType: "database" | "backup" | "configuration" | "security";
  correlationId: string;
  ipAddress: string;
  result: "success" | "failure" | "denied";
  details: string;
}

interface CapacityForecast {
  metric: string;
  current: number;
  predicted: number;
  threshold: number;
  timeToThreshold: string;
}

// ============================================================================
// MOCK DATA - Enterprise Database Infrastructure
// ============================================================================

const organizations: Organization[] = [
  {
    id: "org_acme_corp",
    name: "Acme Corporation",
    plan: "enterprise",
    region: "US-East",
    status: "active",
    databaseCount: 8,
    storageQuota: 2048,
    storageUsed: 847,
  },
  {
    id: "org_techstart",
    name: "TechStart Inc",
    plan: "pro",
    region: "EU-West",
    status: "active",
    databaseCount: 3,
    storageQuota: 256,
    storageUsed: 124,
  },
];

const currentOrg = organizations[0];

const databases: Database[] = [
  // Production Primary Database
  {
    id: "db_prod_primary",
    name: "identity-db-primary",
    displayName: "Identity Database (Primary)",
    engine: "postgresql",
    version: "16.2",
    role: "primary",
    status: "healthy",
    environment: "production",
    region: "us-east-1",
    organizationId: "org_acme_corp",
    clusterId: "cluster_identity_prod",
    host: "identity-db-prod.cluster-abc123.us-east-1.rds.amazonaws.com",
    port: 5432,
    metrics: {
      connections: { active: 142, max: 500, waiting: 3 },
      storage: { used: 456, total: 1024, growthRate: 2.3 },
      performance: {
        latency: 1.2,
        throughput: 12500,
        errorRate: 0.001,
        slowQueries: 2,
      },
      replication: {
        lag: 0,
        syncStatus: "synced",
        lastSync: "2026-02-12T10:45:00Z",
      },
    },
    backup: {
      enabled: true,
      strategy: "automated",
      frequency: "Every 6 hours",
      lastBackup: "2026-02-12T06:00:00Z",
      nextBackup: "2026-02-12T12:00:00Z",
      retentionDays: 35,
      storageLocation: "S3 Encrypted (US-East)",
      encryption: "aes-256",
      integrity: "verified",
    },
    security: {
      tlsVersion: "TLS 1.3",
      encryptionAtRest: true,
      authMethod: "SCRAM-SHA-256 + IAM",
      networkPolicy: "Private VPC Only",
      auditLogging: true,
      lastSecurityScan: "2026-02-11T02:00:00Z",
      vulnerabilities: 0,
    },
    compliance: ["soc2", "iso27001", "gdpr", "hipaa"],
    alerts: [],
    maintenanceWindow: "Sunday 02:00-04:00 UTC",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2026-02-12T10:30:00Z",
    rbac: {
      minPermission: "admin",
      allowedRoles: ["dba", "platform_admin", "security_admin"],
    },
    planRequired: "enterprise",
  },
  // Production Read Replica
  {
    id: "db_prod_replica_1",
    name: "identity-db-replica-1",
    displayName: "Identity Database (Read Replica 1)",
    engine: "postgresql",
    version: "16.2",
    role: "read-replica",
    status: "healthy",
    environment: "production",
    region: "us-east-1",
    organizationId: "org_acme_corp",
    clusterId: "cluster_identity_prod",
    host: "identity-db-replica-1.cluster-abc123.us-east-1.rds.amazonaws.com",
    port: 5432,
    metrics: {
      connections: { active: 89, max: 500, waiting: 0 },
      storage: { used: 454, total: 1024, growthRate: 2.3 },
      performance: {
        latency: 1.8,
        throughput: 8200,
        errorRate: 0.002,
        slowQueries: 1,
      },
      replication: {
        lag: 0.3,
        syncStatus: "synced",
        lastSync: "2026-02-12T10:44:58Z",
      },
    },
    backup: {
      enabled: false,
      strategy: "managed",
      frequency: "N/A - Replica",
      lastBackup: "N/A",
      nextBackup: "N/A",
      retentionDays: 0,
      storageLocation: "N/A",
      encryption: "aes-256",
      integrity: "verified",
    },
    security: {
      tlsVersion: "TLS 1.3",
      encryptionAtRest: true,
      authMethod: "SCRAM-SHA-256 + IAM",
      networkPolicy: "Private VPC Only",
      auditLogging: true,
      lastSecurityScan: "2026-02-11T02:00:00Z",
      vulnerabilities: 0,
    },
    compliance: ["soc2", "iso27001", "gdpr", "hipaa"],
    alerts: [],
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2026-02-12T10:30:00Z",
    rbac: {
      minPermission: "admin",
      allowedRoles: ["dba", "platform_admin"],
    },
    planRequired: "enterprise",
  },
  // Cache Cluster
  {
    id: "db_cache_prod",
    name: "identity-cache-cluster",
    displayName: "Identity Cache Cluster",
    engine: "redis",
    version: "7.2",
    role: "primary",
    status: "healthy",
    environment: "production",
    region: "us-east-1",
    organizationId: "org_acme_corp",
    clusterId: "cluster_cache_prod",
    host: "identity-cache.abc123.cache.amazonaws.com",
    port: 6379,
    metrics: {
      connections: { active: 324, max: 65000, waiting: 0 },
      storage: { used: 12, total: 64, growthRate: 0.8 },
      performance: {
        latency: 0.5,
        throughput: 125000,
        errorRate: 0.0,
        slowQueries: 0,
      },
      replication: {
        lag: 0,
        syncStatus: "synced",
        lastSync: "2026-02-12T10:45:00Z",
      },
    },
    backup: {
      enabled: true,
      strategy: "automated",
      frequency: "Daily snapshots",
      lastBackup: "2026-02-12T03:00:00Z",
      nextBackup: "2026-02-13T03:00:00Z",
      retentionDays: 7,
      storageLocation: "S3 (US-East)",
      encryption: "aes-256",
      integrity: "verified",
    },
    security: {
      tlsVersion: "TLS 1.3",
      encryptionAtRest: true,
      authMethod: "Redis AUTH + IAM",
      networkPolicy: "Private VPC Only",
      auditLogging: false,
      lastSecurityScan: "2026-02-11T02:00:00Z",
      vulnerabilities: 0,
    },
    compliance: ["soc2", "iso27001"],
    alerts: [
      {
        id: "alert_cache_001",
        severity: "medium",
        type: "capacity",
        message: "Cache memory usage above 70% threshold",
        timestamp: "2026-02-12T08:30:00Z",
        acknowledged: false,
        correlationId: "corr_cache_capacity_001",
      },
    ],
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2026-02-12T10:30:00Z",
    rbac: {
      minPermission: "operator",
      allowedRoles: ["devops", "platform_admin"],
    },
    planRequired: "pro",
  },
  // Staging Database
  {
    id: "db_staging_primary",
    name: "identity-db-staging",
    displayName: "Identity Database (Staging)",
    engine: "postgresql",
    version: "16.2",
    role: "primary",
    status: "healthy",
    environment: "staging",
    region: "us-east-1",
    organizationId: "org_acme_corp",
    clusterId: "cluster_identity_staging",
    host: "identity-db-staging.cluster-def456.us-east-1.rds.amazonaws.com",
    port: 5432,
    metrics: {
      connections: { active: 23, max: 100, waiting: 0 },
      storage: { used: 89, total: 256, growthRate: 5.2 },
      performance: {
        latency: 2.1,
        throughput: 2100,
        errorRate: 0.005,
        slowQueries: 5,
      },
      replication: { lag: 0, syncStatus: "unavailable", lastSync: "N/A" },
    },
    backup: {
      enabled: true,
      strategy: "automated",
      frequency: "Daily",
      lastBackup: "2026-02-12T01:00:00Z",
      nextBackup: "2026-02-13T01:00:00Z",
      retentionDays: 7,
      storageLocation: "S3 (US-East)",
      encryption: "aes-256",
      integrity: "verified",
    },
    security: {
      tlsVersion: "TLS 1.2",
      encryptionAtRest: true,
      authMethod: "SCRAM-SHA-256",
      networkPolicy: "VPC + VPN",
      auditLogging: true,
      lastSecurityScan: "2026-02-10T02:00:00Z",
      vulnerabilities: 0,
    },
    compliance: ["soc2"],
    alerts: [],
    maintenanceWindow: "Saturday 01:00-03:00 UTC",
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2026-02-12T10:15:00Z",
    rbac: {
      minPermission: "operator",
      allowedRoles: ["devops", "developer", "qa"],
    },
    planRequired: "pro",
  },
  // Analytics Read Replica
  {
    id: "db_analytics",
    name: "identity-analytics-db",
    displayName: "Analytics Database",
    engine: "postgresql",
    version: "16.2",
    role: "analytics",
    status: "degraded",
    environment: "production",
    region: "us-west-2",
    organizationId: "org_acme_corp",
    host: "identity-analytics.ghi789.us-west-2.rds.amazonaws.com",
    port: 5432,
    metrics: {
      connections: { active: 12, max: 100, waiting: 4 },
      storage: { used: 234, total: 512, growthRate: 12.5 },
      performance: {
        latency: 45.2,
        throughput: 850,
        errorRate: 0.8,
        slowQueries: 18,
      },
      replication: { lag: 0, syncStatus: "unavailable", lastSync: "N/A" },
    },
    backup: {
      enabled: true,
      strategy: "automated",
      frequency: "Daily",
      lastBackup: "2026-02-11T22:00:00Z",
      nextBackup: "2026-02-12T22:00:00Z",
      retentionDays: 90,
      storageLocation: "S3 Glacier (US-West)",
      encryption: "aes-256",
      integrity: "verified",
    },
    security: {
      tlsVersion: "TLS 1.3",
      encryptionAtRest: true,
      authMethod: "SCRAM-SHA-256 + IAM",
      networkPolicy: "Private VPC Only",
      auditLogging: true,
      lastSecurityScan: "2026-02-11T02:00:00Z",
      vulnerabilities: 0,
    },
    compliance: ["soc2", "iso27001"],
    alerts: [
      {
        id: "alert_analytics_001",
        severity: "high",
        type: "performance",
        message: "Elevated query latency detected - potential resource contention",
        timestamp: "2026-02-12T09:15:00Z",
        acknowledged: false,
        correlationId: "corr_analytics_perf_001",
      },
    ],
    createdAt: "2024-06-01T00:00:00Z",
    updatedAt: "2026-02-12T09:15:00Z",
    rbac: {
      minPermission: "viewer",
      allowedRoles: ["data_analyst", "bi_team", "platform_admin"],
    },
    planRequired: "enterprise",
  },
  // Development Database
  {
    id: "db_dev_local",
    name: "identity-db-dev",
    displayName: "Identity Database (Development)",
    engine: "postgresql",
    version: "16.1",
    role: "primary",
    status: "healthy",
    environment: "development",
    region: "local",
    organizationId: "org_acme_corp",
    host: "localhost",
    port: 5432,
    metrics: {
      connections: { active: 5, max: 20, waiting: 0 },
      storage: { used: 12, total: 100, growthRate: 8.5 },
      performance: {
        latency: 0.8,
        throughput: 450,
        errorRate: 0.0,
        slowQueries: 0,
      },
      replication: { lag: 0, syncStatus: "unavailable", lastSync: "N/A" },
    },
    backup: {
      enabled: false,
      strategy: "manual",
      frequency: "On-demand",
      lastBackup: "2026-02-10T14:30:00Z",
      nextBackup: "Manual",
      retentionDays: 0,
      storageLocation: "Local",
      encryption: "none",
      integrity: "pending",
    },
    security: {
      tlsVersion: "Disabled",
      encryptionAtRest: false,
      authMethod: "Password Only",
      networkPolicy: "Localhost Only",
      auditLogging: false,
      lastSecurityScan: "N/A",
      vulnerabilities: 2,
    },
    compliance: [],
    alerts: [
      {
        id: "alert_dev_001",
        severity: "low",
        type: "security",
        message: "Development database lacks encryption - acceptable for local use",
        timestamp: "2026-02-12T00:00:00Z",
        acknowledged: true,
        correlationId: "corr_dev_security_001",
        autoResolved: false,
      },
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-02-12T08:00:00Z",
    rbac: {
      minPermission: "operator",
      allowedRoles: ["developer"],
    },
    planRequired: "free",
  },
];

const auditEvents: AuditEvent[] = [
  {
    id: "evt_001",
    timestamp: "2026-02-12T10:42:15Z",
    actor: "admin.sarah@acme.com",
    action: "database.backup.restore",
    target: "db_staging_primary",
    targetType: "backup",
    correlationId: "corr_restore_001",
    ipAddress: "10.0.1.45",
    result: "success",
    details: "Restored staging database from production backup",
  },
  {
    id: "evt_002",
    timestamp: "2026-02-12T09:30:00Z",
    actor: "dba.mike@acme.com",
    action: "database.configuration.update",
    target: "db_cache_prod",
    targetType: "configuration",
    correlationId: "corr_config_002",
    ipAddress: "10.0.1.32",
    result: "success",
    details: "Increased maxmemory policy to allkeys-lru",
  },
  {
    id: "evt_003",
    timestamp: "2026-02-12T09:15:00Z",
    actor: "system",
    action: "database.alert.triggered",
    target: "db_analytics",
    targetType: "database",
    correlationId: "corr_alert_003",
    ipAddress: "internal",
    result: "success",
    details: "Performance threshold exceeded - elevated latency detected",
  },
  {
    id: "evt_004",
    timestamp: "2026-02-12T08:45:00Z",
    actor: "security.jane@acme.com",
    action: "database.security.scan",
    target: "db_prod_primary",
    targetType: "security",
    correlationId: "corr_scan_004",
    ipAddress: "10.0.1.28",
    result: "success",
    details: "Weekly security scan completed - no vulnerabilities found",
  },
  {
    id: "evt_005",
    timestamp: "2026-02-12T06:00:00Z",
    actor: "system",
    action: "database.backup.completed",
    target: "db_prod_primary",
    targetType: "backup",
    correlationId: "corr_backup_005",
    ipAddress: "internal",
    result: "success",
    details: "Automated backup completed successfully",
  },
];

const capacityForecasts: CapacityForecast[] = [
  {
    metric: "Storage",
    current: 847,
    predicted: 1024,
    threshold: 90,
    timeToThreshold: "45 days",
  },
  {
    metric: "Connections (Primary)",
    current: 28,
    predicted: 80,
    threshold: 85,
    timeToThreshold: "120 days",
  },
  {
    metric: "Cache Memory",
    current: 19,
    predicted: 90,
    threshold: 80,
    timeToThreshold: "14 days",
  },
];

// ============================================================================
// CONFIGURATION
// ============================================================================

const statusConfig: Record<
  DatabaseStatus,
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
  critical: {
    label: "Critical",
    icon: ShieldAlert,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
  unreachable: {
    label: "Unreachable",
    icon: WifiOff,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/20",
  },
  maintenance: {
    label: "Maintenance",
    icon: Settings,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
};

const roleConfig: Record<
  DatabaseRole,
  {
    label: string;
    color: string;
    bgColor: string;
    description: string;
  }
> = {
  primary: {
    label: "Primary",
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    description: "Main read-write instance",
  },
  replica: {
    label: "Replica",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    description: "Hot standby replica",
  },
  "read-replica": {
    label: "Read Replica",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    description: "Read-only query offloading",
  },
  standby: {
    label: "Standby",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    description: "Disaster recovery standby",
  },
  analytics: {
    label: "Analytics",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    description: "BI and reporting instance",
  },
};

const engineConfig: Record<
  DatabaseEngine,
  {
    label: string;
    icon: React.ElementType;
    color: string;
  }
> = {
  postgresql: { label: "PostgreSQL", icon: Database, color: "text-blue-500" },
  mysql: { label: "MySQL", icon: Database, color: "text-orange-500" },
  redis: { label: "Redis", icon: Zap, color: "text-red-500" },
  elasticsearch: {
    label: "Elasticsearch",
    icon: Database,
    color: "text-yellow-500",
  },
  mongodb: { label: "MongoDB", icon: Database, color: "text-green-500" },
};

const severityConfig: Record<string, { color: string; bgColor: string; label: string }> = {
  critical: {
    label: "Critical",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  high: { label: "High", color: "text-amber-500", bgColor: "bg-amber-500/10" },
  medium: {
    label: "Medium",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  low: { label: "Low", color: "text-slate-500", bgColor: "bg-slate-500/10" },
};

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

function StatusBadge({
  status,
  showLabel = true,
  size = "default",
}: {
  status: DatabaseStatus;
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
        size === "lg" && "h-7 px-3 text-sm"
      )}
    >
      <Icon
        className={cn(
          "mr-1",
          size === "sm" ? "h-3 w-3" : size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5"
        )}
      />
      {showLabel && config.label}
    </Badge>
  );
}

function RoleBadge({ role }: { role: DatabaseRole }) {
  const config = roleConfig[role];
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={cn("text-xs font-medium cursor-help", config.color, config.bgColor)}
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

function EngineBadge({ engine, version }: { engine: DatabaseEngine; version: string }) {
  const config = engineConfig[engine];
  const Icon = config.icon;
  return (
    <div className="flex items-center gap-1.5">
      <Icon className={cn("h-4 w-4", config.color)} />
      <span className="text-sm text-foreground">{config.label}</span>
      <span className="text-xs text-muted-foreground">{version}</span>
    </div>
  );
}

function ComplianceBadge({ standards }: { standards: ComplianceLevel[] }) {
  const icons: Record<ComplianceLevel, React.ElementType> = {
    soc2: ShieldCheck,
    iso27001: Shield,
    gdpr: Lock,
    hipaa: Users,
  };

  if (standards.length === 0) {
    return (
      <Badge variant="outline" className="text-[10px] text-muted-foreground">
        <Unlock className="h-3 w-3 mr-1" />
        No Compliance
      </Badge>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {standards.slice(0, 2).map((standard) => {
        const Icon = icons[standard];
        return (
          <TooltipProvider key={standard}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="h-5 px-1.5 text-[10px] uppercase">
                  <Icon className="h-3 w-3 mr-1" />
                  {standard}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Compliant with {standard.toUpperCase()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
      {standards.length > 2 && (
        <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
          +{standards.length - 2}
        </Badge>
      )}
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

function StorageBar({
  used,
  total,
  growthRate,
}: {
  used: number;
  total: number;
  growthRate: number;
}) {
  const percentage = (used / total) * 100;
  let color = "bg-emerald-500";
  if (percentage >= 90) color = "bg-destructive";
  else if (percentage >= 75) color = "bg-amber-500";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {used} GB / {total} GB
        </span>
        <span
          className={cn("font-medium", percentage >= 75 ? "text-amber-500" : "text-foreground")}
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
      <p className="text-[10px] text-muted-foreground">+{growthRate}% growth / month</p>
    </div>
  );
}

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

function OrganizationSelector({ currentOrg }: { currentOrg: Organization }) {
  const usagePercent = (currentOrg.storageUsed / currentOrg.storageQuota) * 100;

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg border border-border bg-card">
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
            <span className="text-xs text-muted-foreground">{currentOrg.region}</span>
          </div>
        </div>
      </div>
      <div className="md:ml-auto flex flex-col md:flex-row md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Storage Quota</span>
            <span
              className={cn(
                "font-medium",
                usagePercent >= 80 ? "text-amber-500" : "text-foreground"
              )}
            >
              {usagePercent.toFixed(1)}%
            </span>
          </div>
          <Progress value={usagePercent} className="w-32 h-1.5" />
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Database className="h-3.5 w-3.5" />
            <span>{currentOrg.databaseCount} databases</span>
          </div>
          <div className="flex items-center gap-1">
            <HardDrive className="h-3.5 w-3.5" />
            <span>
              {currentOrg.storageUsed} GB / {currentOrg.storageQuota} GB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DatabaseOverviewSection({ databases }: { databases: Database[] }) {
  const degradedCount = databases.filter((d) => d.status === "degraded").length;
  const criticalCount = databases.filter(
    (d) => d.status === "critical" || d.status === "unreachable"
  ).length;
  const maintenanceCount = databases.filter((d) => d.status === "maintenance").length;

  const totalStorage = databases.reduce((acc, d) => acc + d.metrics.storage.used, 0);
  const totalConnections = databases.reduce((acc, d) => acc + d.metrics.connections.active, 0);
  const avgLatency =
    databases.length > 0
      ? databases.reduce((acc, d) => acc + d.metrics.performance.latency, 0) / databases.length
      : 0;

  const unacknowledgedAlerts = databases
    .flatMap((d) => d.alerts)
    .filter((a) => !a.acknowledged).length;

  let overallStatus: DatabaseStatus = "healthy";
  if (criticalCount > 0) overallStatus = "critical";
  else if (degradedCount > 0) overallStatus = "degraded";
  else if (maintenanceCount > 0) overallStatus = "maintenance";

  const getStatusIcon = () => {
    switch (overallStatus) {
      case "healthy":
        return CheckCircle2;
      case "degraded":
        return AlertTriangle;
      case "critical":
        return ShieldAlert;
      case "maintenance":
        return Settings;
      default:
        return Activity;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Infrastructure Status"
        value={statusConfig[overallStatus].label}
        icon={getStatusIcon()}
        variant={
          overallStatus === "healthy"
            ? "default"
            : overallStatus === "degraded"
              ? "warning"
              : "destructive"
        }
      />
      <MetricCard
        title="Total Storage Used"
        value={`${totalStorage} GB`}
        icon={HardDrive}
        subtitle={`Across ${databases.length} databases`}
      />
      <MetricCard
        title="Active Connections"
        value={totalConnections}
        icon={Network}
        subtitle="Current sessions"
        trend={{ value: 12.5, isPositive: true }}
      />
      <MetricCard
        title="Avg Query Latency"
        value={`${avgLatency.toFixed(1)}ms`}
        icon={Zap}
        subtitle="p95 latency"
        variant={avgLatency > 10 ? "warning" : "default"}
      />
    </div>
  );
}

function DatabaseStatusSummary({ databases }: { databases: Database[] }) {
  const byStatus = {
    healthy: databases.filter((d) => d.status === "healthy").length,
    degraded: databases.filter((d) => d.status === "degraded").length,
    critical: databases.filter((d) => d.status === "critical" || d.status === "unreachable").length,
    maintenance: databases.filter((d) => d.status === "maintenance").length,
  };

  const byEnvironment = {
    production: databases.filter((d) => d.environment === "production").length,
    staging: databases.filter((d) => d.environment === "staging").length,
    development: databases.filter((d) => d.environment === "development").length,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            Status Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center p-3 rounded-lg bg-emerald-500/10">
              <p className="text-2xl font-semibold text-emerald-500">{byStatus.healthy}</p>
              <p className="text-[10px] uppercase tracking-wide text-emerald-600">Healthy</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-amber-500/10">
              <p className="text-2xl font-semibold text-amber-500">{byStatus.degraded}</p>
              <p className="text-[10px] uppercase tracking-wide text-amber-600">Degraded</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-red-500/10">
              <p className="text-2xl font-semibold text-red-500">{byStatus.critical}</p>
              <p className="text-[10px] uppercase tracking-wide text-red-600">Critical</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-500/10">
              <p className="text-2xl font-semibold text-blue-500">{byStatus.maintenance}</p>
              <p className="text-[10px] uppercase tracking-wide text-blue-600">Maintenance</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Layers className="h-4 w-4 text-muted-foreground" />
            Environment Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="text-sm text-muted-foreground">Production</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {byEnvironment.production}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-sm text-muted-foreground">Staging</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {byEnvironment.staging}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-slate-500" />
                <span className="text-sm text-muted-foreground">Development</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {byEnvironment.development}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DatabaseCard({ database }: { database: Database }) {
  const statusCfg = statusConfig[database.status];
  const roleCfg = roleConfig[database.role];
  const hasAlerts = database.alerts.some((a) => !a.acknowledged);
  const criticalAlerts = database.alerts.filter(
    (a) => a.severity === "critical" && !a.acknowledged
  ).length;

  return (
    <Card
      className={cn(
        "border transition-all hover:shadow-md",
        database.status === "critical" || database.status === "unreachable"
          ? "border-destructive/50"
          : database.status === "degraded"
            ? "border-amber-500/50"
            : "border-border"
      )}
    >
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={cn("p-2 rounded-lg", statusCfg.bgColor)}>
              <Database className={cn("h-5 w-5", statusCfg.color)} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-foreground truncate">{database.displayName}</h3>
                {hasAlerts && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "h-5 px-1.5 text-[10px]",
                      criticalAlerts > 0
                        ? "border-destructive/30 text-destructive"
                        : "border-amber-500/30 text-amber-500"
                    )}
                  >
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {database.alerts.filter((a) => !a.acknowledged).length}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <EngineBadge engine={database.engine} version={database.version} />
              </div>
            </div>
          </div>
          <StatusBadge status={database.status} size="sm" />
        </div>

        {/* Role & Environment */}
        <div className="flex items-center gap-2">
          <RoleBadge role={database.role} />
          <Badge variant="outline" className="text-[10px] h-5 capitalize">
            {database.environment}
          </Badge>
          <Badge variant="outline" className="text-[10px] h-5">
            {database.region}
          </Badge>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Connections
            </p>
            <p className="font-medium">
              {database.metrics.connections.active} / {database.metrics.connections.max}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Latency</p>
            <p className="font-medium">{database.metrics.performance.latency}ms</p>
          </div>
        </div>

        {/* Storage */}
        <StorageBar
          used={database.metrics.storage.used}
          total={database.metrics.storage.total}
          growthRate={database.metrics.storage.growthRate}
        />

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <ComplianceBadge standards={database.compliance} />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              Updated{" "}
              {(() => {
                const date = new Date(database.updatedAt);
                return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
              })()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DatabasesGridSection({ databases }: { databases: Database[] }) {
  const production = databases.filter((d) => d.environment === "production");
  const staging = databases.filter((d) => d.environment === "staging");
  const development = databases.filter((d) => d.environment === "development");

  return (
    <div className="space-y-6">
      {/* Production Databases */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-rose-500" />
            <h3 className="text-sm font-medium">Production Databases</h3>
            <Badge variant="secondary" className="text-xs">
              {production.length}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">Enterprise SLA: 99.99% uptime</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {production.map((db) => (
            <DatabaseCard key={db.id} database={db} />
          ))}
        </div>
      </section>

      {/* Staging Databases */}
      {staging.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <h3 className="text-sm font-medium">Staging Databases</h3>
              <Badge variant="secondary" className="text-xs">
                {staging.length}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Test environment</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {staging.map((db) => (
              <DatabaseCard key={db.id} database={db} />
            ))}
          </div>
        </section>
      )}

      {/* Development Databases */}
      {development.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-slate-500" />
              <h3 className="text-sm font-medium">Development Databases</h3>
              <Badge variant="secondary" className="text-xs">
                {development.length}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Local development</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {development.map((db) => (
              <DatabaseCard key={db.id} database={db} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function AlertsSection({ databases }: { databases: Database[] }) {
  const allAlerts = databases.flatMap((d) =>
    d.alerts.map((a) => ({
      ...a,
      databaseName: d.displayName,
      databaseId: d.id,
    }))
  );
  const unacknowledged = allAlerts.filter((a) => !a.acknowledged);
  const criticalCount = unacknowledged.filter((a) => a.severity === "critical").length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {criticalCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {criticalCount} Critical
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {unacknowledged.length} open
            </Badge>
          </div>
        </div>
        <CardDescription>Database alerts requiring attention</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {unacknowledged.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
            <p className="text-sm">No active alerts</p>
            <p className="text-xs">All databases operating normally</p>
          </div>
        ) : (
          unacknowledged.slice(0, 5).map((alert) => (
            <div
              key={alert.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border",
                alert.severity === "critical"
                  ? "border-destructive/30 bg-destructive/5"
                  : alert.severity === "high"
                    ? "border-amber-500/30 bg-amber-500/5"
                    : "border-border"
              )}
            >
              <div
                className={cn(
                  "h-2 w-2 rounded-full mt-1.5",
                  severityConfig[alert.severity].bgColor.replace("/10", "")
                )}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{alert.message}</p>
                  <CorrelationId id={alert.correlationId} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {alert.databaseName} • {new Date(alert.timestamp).toLocaleTimeString()}
                </p>
              </div>
              <Badge variant="outline" className="text-[10px] h-5">
                {alert.type}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function BackupStatusSection({ databases }: { databases: Database[] }) {
  const backupEnabled = databases.filter((d) => d.backup.enabled).length;
  const totalWithBackup = databases.filter((d) => d.backup.strategy !== "manual").length;
  const recentBackups = databases
    .filter((d) => d.backup.enabled && d.backup.lastBackup !== "N/A")
    .sort(
      (a, b) => new Date(b.backup.lastBackup).getTime() - new Date(a.backup.lastBackup).getTime()
    )
    .slice(0, 3);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Archive className="h-4 w-4 text-blue-500" />
            <CardTitle className="text-sm font-medium">Backup Status</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {backupEnabled}/{totalWithBackup} enabled
          </Badge>
        </div>
        <CardDescription>Automated backup coverage</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {recentBackups.map((db) => (
            <div
              key={db.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center",
                    db.backup.integrity === "verified" ? "bg-emerald-500/10" : "bg-amber-500/10"
                  )}
                >
                  {db.backup.integrity === "verified" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{db.displayName}</p>
                  <p className="text-xs text-muted-foreground">
                    Last backup: {new Date(db.backup.lastBackup).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Retention</p>
                <p className="text-sm font-medium">{db.backup.retentionDays} days</p>
              </div>
            </div>
          ))}
        </div>
        <div className="pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>All backups encrypted with AES-256</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SecurityPostureSection({ databases }: { databases: Database[] }) {
  const withEncryption = databases.filter((d) => d.security.encryptionAtRest).length;
  const withTLS13 = databases.filter((d) => d.security.tlsVersion === "TLS 1.3").length;
  const withAudit = databases.filter((d) => d.security.auditLogging).length;
  const totalVulnerabilities = databases.reduce((acc, d) => acc + d.security.vulnerabilities, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-violet-500" />
            <CardTitle className="text-sm font-medium">Security Posture</CardTitle>
          </div>
          {totalVulnerabilities > 0 && (
            <Badge variant="destructive" className="text-xs">
              {totalVulnerabilities} vulnerabilities
            </Badge>
          )}
        </div>
        <CardDescription>Security configuration overview</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Encryption at Rest</span>
            </div>
            <Badge
              variant={withEncryption === databases.length ? "default" : "outline"}
              className="text-xs"
            >
              {withEncryption}/{databases.length}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Network className="h-4 w-4" />
              <span>TLS 1.3</span>
            </div>
            <Badge
              variant={withTLS13 === databases.length ? "default" : "outline"}
              className="text-xs"
            >
              {withTLS13}/{databases.length}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>Audit Logging</span>
            </div>
            <Badge
              variant={withAudit === databases.length ? "default" : "outline"}
              className="text-xs"
            >
              {withAudit}/{databases.length}
            </Badge>
          </div>
        </div>
        <div className="pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Last scan: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CapacityPlanningSection({ forecasts }: { forecasts: CapacityForecast[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <CardTitle className="text-sm font-medium">Capacity Forecast</CardTitle>
          </div>
        </div>
        <CardDescription>Predicted resource utilization</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {forecasts.map((forecast) => {
            const currentPercent = (forecast.current / forecast.threshold) * 100;
            const predictedPercent = (forecast.predicted / forecast.threshold) * 100;

            return (
              <div key={forecast.metric} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{forecast.metric}</span>
                  <span className="text-xs text-amber-500">
                    {forecast.timeToThreshold} to threshold
                  </span>
                </div>
                <div className="relative h-2 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className="absolute h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${currentPercent}%` }}
                  />
                  <div
                    className="absolute h-full bg-amber-500/50 border-l-2 border-amber-500"
                    style={{ left: `${predictedPercent}%`, width: "2px" }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Current: {forecast.current}</span>
                  <span>Predicted: {forecast.predicted}</span>
                  <span>Threshold: {forecast.threshold}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
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
        <CardDescription>Recent database operations</CardDescription>
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
                  event.result === "success" ? "bg-emerald-500/10" : "bg-destructive/10"
                )}
              >
                {event.result === "success" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive" />
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

function ComplianceOverviewSection({ databases }: { databases: Database[] }) {
  const complianceStats = {
    soc2: databases.filter((d) => d.compliance.includes("soc2")).length,
    iso27001: databases.filter((d) => d.compliance.includes("iso27001")).length,
    gdpr: databases.filter((d) => d.compliance.includes("gdpr")).length,
    hipaa: databases.filter((d) => d.compliance.includes("hipaa")).length,
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <CardTitle className="text-sm font-medium">Compliance Status</CardTitle>
        </div>
        <CardDescription>Regulatory compliance across databases</CardDescription>
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
              <Progress value={(count / databases.length) * 100} className="w-24 h-1.5" />
              <span className="text-xs text-muted-foreground">
                {count}/{databases.length}
              </span>
            </div>
          </div>
        ))}
        <div className="pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>All production databases SOC 2 Type II compliant</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function DatabaseOperationsPage() {
  const [activeTab, setActiveTab] = React.useState("overview");
  const [selectedEnvironment, setSelectedEnvironment] = React.useState<EnvironmentType | "all">(
    "all"
  );

  const filteredDatabases =
    selectedEnvironment === "all"
      ? databases
      : databases.filter((d) => d.environment === selectedEnvironment);

  return (
    <TooltipProvider>
      <div className="space-y-6 text-foreground">
        {/* =========================================================================
            HEADER SECTION
            ========================================================================= */}
        <div>
          <h1 className="text-2xl font-semibold text-card-foreground">
            Identity Database Operations
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enterprise database infrastructure management, monitoring, and governance
          </p>
        </div>

        {/* Organization Context */}
        <OrganizationSelector currentOrg={currentOrg} />

        {/* =========================================================================
            SECTION 1: PLATFORM OVERVIEW
            Critical priority - Database health and KPIs
            ========================================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "h-2 w-2 rounded-full animate-pulse",
                  databases.some((d) => d.status === "critical" || d.status === "unreachable")
                    ? "bg-red-500"
                    : databases.some((d) => d.status === "degraded")
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                )}
              />
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Infrastructure Overview
              </h2>
            </div>
            <Select
              value={selectedEnvironment}
              onValueChange={(value) => setSelectedEnvironment(value as EnvironmentType | "all")}
            >
              <SelectTrigger className="w-40 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Environments</SelectItem>
                <SelectItem value="production">Production</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="development">Development</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DatabaseOverviewSection databases={filteredDatabases} />
          <DatabaseStatusSummary databases={filteredDatabases} />
        </section>

        {/* =========================================================================
            SECTION 2: DATABASE MANAGEMENT
            Primary functionality - Database instances and monitoring
            ========================================================================= */}
        <section className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Database Management
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
                <TabsTrigger value="backups" className="text-xs px-3">
                  <Archive className="h-3.5 w-3.5 mr-1.5" />
                  Backups
                </TabsTrigger>
                <TabsTrigger value="security" className="text-xs px-3">
                  <Shield className="h-3.5 w-3.5 mr-1.5" />
                  Security
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-6">
              <DatabasesGridSection databases={filteredDatabases} />
            </TabsContent>

            <TabsContent value="monitoring" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <AlertsSection databases={filteredDatabases} />
                </div>
                <div>
                  <CapacityPlanningSection forecasts={capacityForecasts} />
                </div>
              </div>
              <AuditLogSection events={auditEvents} />
            </TabsContent>

            <TabsContent value="backups" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BackupStatusSection databases={filteredDatabases} />
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <History className="h-4 w-4 text-muted-foreground" />
                      Backup Retention Policies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Environment</TableHead>
                          <TableHead className="text-xs">Retention</TableHead>
                          <TableHead className="text-xs">Encryption</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="text-sm">Production</TableCell>
                          <TableCell className="text-sm">35 days</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[10px]">
                              AES-256
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="text-sm">Staging</TableCell>
                          <TableCell className="text-sm">7 days</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[10px]">
                              AES-256
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="text-sm">Development</TableCell>
                          <TableCell className="text-sm">Manual</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[10px]">
                              None
                            </Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SecurityPostureSection databases={filteredDatabases} />
                <ComplianceOverviewSection databases={filteredDatabases} />
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      Access Control
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Admin Level</span>
                        <Badge variant="outline" className="text-xs">
                          {filteredDatabases.filter((d) => d.rbac.minPermission === "admin").length}{" "}
                          databases
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Operator Level</span>
                        <Badge variant="outline" className="text-xs">
                          {
                            filteredDatabases.filter((d) => d.rbac.minPermission === "operator")
                              .length
                          }{" "}
                          databases
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Viewer Level</span>
                        <Badge variant="outline" className="text-xs">
                          {
                            filteredDatabases.filter((d) => d.rbac.minPermission === "viewer")
                              .length
                          }{" "}
                          databases
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* =========================================================================
            SECTION 3: GOVERNANCE & COMPLIANCE
            Enterprise features - Compliance and governance
            ========================================================================= */}
        <section className="space-y-4">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Governance & Compliance
          </h2>

          <Card className="bg-muted/30 border-border">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-primary/10">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Enterprise Database Governance</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your database infrastructure is managed according to enterprise-grade standards
                    with automated compliance monitoring, audit logging, and security scanning.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>SOC 2 Type II compliant infrastructure</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>End-to-end encryption (at rest & in transit)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Point-in-time recovery enabled</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </TooltipProvider>
  );
}
