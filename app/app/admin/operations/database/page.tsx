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
  CheckCircle2,
  Clock,
  Database,
  FileText,
  Globe,
  HardDrive,
  Info,
  Lock,
  Network,
  RefreshCw,
  Server,
  Shield,
  Users,
  WifiOff,
  XCircle,
  Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DatabaseStatus = "healthy" | "degraded" | "unreachable" | "unknown";
type DatabaseRole = "primary" | "replica" | "read-only" | "standby";
type DatabaseEngine = "PostgreSQL" | "MySQL" | "SQLite" | "MariaDB" | "Redis";
type DatabaseEnvironment = "container" | "external" | "local";

interface DatabaseBackup {
  enabled: boolean;
  lastBackup?: string;
  retentionPolicy: string;
  nextBackup?: string;
}

interface Database {
  id: string;
  name: string;
  engine: DatabaseEngine;
  engineVersion: string;
  role: DatabaseRole;
  environment: DatabaseEnvironment;
  status: DatabaseStatus;
  host: string;
  port: number;
  connectionMode: "internal" | "external";
  latency?: string;
  storageUsed: string;
  storageTotal?: string;
  uptime?: string;
  activeConnections: number;
  lastHealthCheck: string;
  backup: DatabaseBackup;
  tlsEnabled: boolean;
  authMode: string;
  lastError?: string;
  lastWarning?: string;
  replicationLag?: string;
}

interface DatabaseStatusConfig {
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

interface DatabaseRoleConfig {
  label: string;
  color: string;
}

interface DatabaseEnvironmentConfig {
  label: string;
  color: string;
}

const databaseStatusConfig: Record<DatabaseStatus, DatabaseStatusConfig> = {
  healthy: {
    label: "Healthy",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  degraded: {
    label: "Degraded",
    icon: AlertCircle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  unreachable: {
    label: "Unreachable",
    icon: WifiOff,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  unknown: {
    label: "Unknown",
    icon: Activity,
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
  },
};

const databaseRoleConfig: Record<DatabaseRole, DatabaseRoleConfig> = {
  primary: { label: "Primary", color: "text-emerald-500" },
  replica: { label: "Replica", color: "text-blue-500" },
  "read-only": { label: "Read-only", color: "text-purple-500" },
  standby: { label: "Standby", color: "text-amber-500" },
};

const databaseEnvironmentConfig: Record<
  DatabaseEnvironment,
  DatabaseEnvironmentConfig
> = {
  container: { label: "Container", color: "text-blue-500" },
  external: { label: "External", color: "text-purple-500" },
  local: { label: "Local", color: "text-slate-500" },
};

const databasesData: Database[] = [
  {
    id: "db-primary-prod",
    name: "Primary Database (Production)",
    engine: "PostgreSQL",
    engineVersion: "15.4",
    role: "primary",
    environment: "container",
    status: "healthy",
    host: "db-primary-prod.internal",
    port: 5432,
    connectionMode: "internal",
    latency: "2ms",
    storageUsed: "128 GB",
    storageTotal: "256 GB",
    uptime: "99.99%",
    activeConnections: 47,
    lastHealthCheck: "Just now",
    backup: {
      enabled: true,
      lastBackup: "2024-06-15 02:00 UTC",
      retentionPolicy: "30 days",
      nextBackup: "2024-06-16 02:00 UTC",
    },
    tlsEnabled: true,
    authMode: "Certificate + Password",
  },
  {
    id: "db-replica-prod",
    name: "Read Replica (Production)",
    engine: "PostgreSQL",
    engineVersion: "15.4",
    role: "replica",
    environment: "container",
    status: "healthy",
    host: "db-replica-prod.internal",
    port: 5432,
    connectionMode: "internal",
    latency: "15ms",
    storageUsed: "126 GB",
    storageTotal: "256 GB",
    uptime: "99.95%",
    activeConnections: 12,
    lastHealthCheck: "Just now",
    backup: {
      enabled: false,
      retentionPolicy: "N/A - Replica",
    },
    tlsEnabled: true,
    authMode: "Certificate + Password",
    replicationLag: "0.3s",
  },
  {
    id: "db-cache-prod",
    name: "Cache Cluster",
    engine: "Redis",
    engineVersion: "7.2",
    role: "primary",
    environment: "container",
    status: "healthy",
    host: "cache-prod.internal",
    port: 6379,
    connectionMode: "internal",
    latency: "1ms",
    storageUsed: "8 GB",
    storageTotal: "16 GB",
    uptime: "99.99%",
    activeConnections: 89,
    lastHealthCheck: "Just now",
    backup: {
      enabled: true,
      lastBackup: "2024-06-15 03:00 UTC",
      retentionPolicy: "7 days",
    },
    tlsEnabled: true,
    authMode: "Password",
  },
  {
    id: "db-staging",
    name: "Staging Database",
    engine: "PostgreSQL",
    engineVersion: "15.4",
    role: "primary",
    environment: "container",
    status: "healthy",
    host: "db-staging.internal",
    port: 5432,
    connectionMode: "internal",
    latency: "3ms",
    storageUsed: "24 GB",
    storageTotal: "50 GB",
    uptime: "99.90%",
    activeConnections: 8,
    lastHealthCheck: "2 minutes ago",
    backup: {
      enabled: true,
      lastBackup: "2024-06-15 01:00 UTC",
      retentionPolicy: "7 days",
    },
    tlsEnabled: true,
    authMode: "Certificate + Password",
  },
  {
    id: "db-dev",
    name: "Development Database",
    engine: "SQLite",
    engineVersion: "3.44.0",
    role: "primary",
    environment: "local",
    status: "healthy",
    host: "/data/dev.db",
    port: 0,
    connectionMode: "internal",
    latency: "0.5ms",
    storageUsed: "1.2 GB",
    uptime: "N/A",
    activeConnections: 3,
    lastHealthCheck: "5 minutes ago",
    backup: {
      enabled: false,
      retentionPolicy: "Manual only",
    },
    tlsEnabled: false,
    authMode: "None (Local)",
  },
  {
    id: "db-analytics",
    name: "Analytics Database",
    engine: "MySQL",
    engineVersion: "8.0.33",
    role: "read-only",
    environment: "external",
    status: "degraded",
    host: "analytics.external.acme.com",
    port: 3306,
    connectionMode: "external",
    latency: "45ms",
    storageUsed: "512 GB",
    storageTotal: "1 TB",
    uptime: "98.50%",
    activeConnections: 5,
    lastHealthCheck: "10 minutes ago",
    backup: {
      enabled: true,
      lastBackup: "2024-06-14 22:00 UTC",
      retentionPolicy: "90 days",
    },
    tlsEnabled: true,
    authMode: "IAM + Password",
    lastWarning: "Elevated query latency detected",
  },
];

function DatabaseOverview() {
  const totalDatabases = databasesData.length;
  const healthyCount = databasesData.filter(
    (d) => d.status === "healthy",
  ).length;
  const degradedCount = databasesData.filter(
    (d) => d.status === "degraded",
  ).length;
  const unreachableCount = databasesData.filter(
    (d) => d.status === "unreachable",
  ).length;

  const primaryDatabases = databasesData.filter(
    (d) => d.role === "primary",
  ).length;
  const replicaDatabases = databasesData.filter(
    (d) => d.role === "replica" || d.role === "read-only",
  ).length;

  const databasesWithBackup = databasesData.filter(
    (d) => d.backup.enabled,
  ).length;

  let overallHealth: { status: DatabaseStatus; count: number } = {
    status: "healthy",
    count: healthyCount,
  };

  if (unreachableCount > 0) {
    overallHealth = { status: "unreachable", count: unreachableCount };
  } else if (degradedCount > 0) {
    overallHealth = { status: "degraded", count: degradedCount };
  }

  const overallConfig = databaseStatusConfig[overallHealth.status];
  const OverallIcon = overallConfig.icon;

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Database className="h-4 w-4 text-muted-foreground" />
          Database Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-2 lg:grid-cols-5 divide-x divide-border">
          <div className="p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <Activity className="h-3 w-3" />
              Overall Health
            </div>
            <div className="flex items-center gap-2">
              <OverallIcon className={cn("h-4 w-4", overallConfig.color)} />
              <p className={cn("text-sm font-medium", overallConfig.color)}>
                {overallConfig.label}
              </p>
            </div>
          </div>

          <div className="p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <CheckCircle2 className="h-3 w-3" />
              Healthy
            </div>
            <p className="text-sm font-medium text-emerald-500">
              {healthyCount} databases
            </p>
          </div>

          <div className="p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <AlertCircle className="h-3 w-3" />
              Degraded
            </div>
            <p
              className={cn(
                "text-sm font-medium",
                degradedCount > 0 ? "text-amber-500" : "text-foreground",
              )}
            >
              {degradedCount} databases
            </p>
          </div>

          <div className="p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <Server className="h-3 w-3" />
              Total Databases
            </div>
            <p className="text-sm font-medium text-foreground">
              {totalDatabases}
            </p>
          </div>

          <div className="p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <HardDrive className="h-3 w-3" />
              Backed Up
            </div>
            <p className="text-sm font-medium text-foreground">
              {databasesWithBackup}/{totalDatabases}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: DatabaseStatus }) {
  const config = databaseStatusConfig[status];
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

function DatabaseCard({
  database,
  onViewDetails,
}: {
  database: Database;
  onViewDetails: (database: Database) => void;
}) {
  const statusConfig = databaseStatusConfig[database.status];
  const roleConfig = databaseRoleConfig[database.role];
  const envConfig = databaseEnvironmentConfig[database.environment];
  const StatusIcon = statusConfig.icon;

  return (
    <Card className="border-border bg-card hover:border-border/80 transition-colors">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-md bg-secondary">
                  <Database className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">
                    {database.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={cn("text-foreground", roleConfig.color)}>
                      {roleConfig.label}
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {database.engine} {database.engineVersion}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1 text-right ml-4">
              <StatusBadge status={database.status} />
              <span className="text-xs text-muted-foreground">
                {database.connectionMode === "internal" ? (
                  <>
                    <Network className="h-3 w-3 inline mr-1" />
                    Internal
                  </>
                ) : (
                  <>
                    <Globe className="h-3 w-3 inline mr-1" />
                    External
                  </>
                )}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="space-y-1">
              <span className="text-muted-foreground">Storage</span>
              <p className="text-foreground font-mono">
                {database.storageUsed}
                {database.storageTotal && ` / ${database.storageTotal}`}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Connections</span>
              <p className="text-foreground font-mono">
                {database.activeConnections}
              </p>
            </div>
            {database.latency && (
              <div className="space-y-1">
                <span className="text-muted-foreground">Latency</span>
                <p className="text-foreground font-mono">{database.latency}</p>
              </div>
            )}
            {database.uptime && (
              <div className="space-y-1">
                <span className="text-muted-foreground">Uptime</span>
                <p className="text-foreground font-mono">{database.uptime}</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Checked {database.lastHealthCheck}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => onViewDetails(database)}
              >
                <FileText className="h-3 w-3 mr-1" />
                Details
              </Button>
            </DialogTrigger>
            <DatabaseDetailDialog database={database} />
          </Dialog>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-muted-foreground"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function DatabaseDetailDialog({ database }: { database: Database }) {
  const statusConfig = databaseStatusConfig[database.status];
  const roleConfig = databaseRoleConfig[database.role];
  const envConfig = databaseEnvironmentConfig[database.environment];
  const StatusIcon = statusConfig.icon;

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-muted-foreground" />
          {database.name}
        </DialogTitle>
        <DialogDescription>
          {roleConfig.label} {database.engine} instance - {envConfig.label}{" "}
          environment
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 mt-4">
        <section className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            Overview
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-muted-foreground">Status</span>
              <div className="flex items-center gap-2">
                <StatusIcon className={cn("h-4 w-4", statusConfig.color)} />
                <span className={statusConfig.color}>{statusConfig.label}</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Role</span>
              <p className={cn("text-foreground", roleConfig.color)}>
                {roleConfig.label}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Engine</span>
              <p className="text-foreground">
                {database.engine} {database.engineVersion}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Environment</span>
              <p className={envConfig.color}>{envConfig.label}</p>
            </div>
            {database.uptime && (
              <div className="space-y-1">
                <span className="text-muted-foreground">Uptime</span>
                <p className="text-foreground">{database.uptime}</p>
              </div>
            )}
            <div className="space-y-1">
              <span className="text-muted-foreground">Storage</span>
              <p className="text-foreground">
                {database.storageUsed}
                {database.storageTotal && ` / ${database.storageTotal}`}
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Network className="h-4 w-4 text-muted-foreground" />
            Connectivity
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-muted-foreground">Host</span>
              <div className="flex items-center gap-2">
                <p className="text-foreground font-mono text-xs flex-1 truncate">
                  {database.host}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => navigator.clipboard.writeText(database.host)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Port</span>
              <p className="text-foreground font-mono">{database.port}</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Connection Mode</span>
              <p className="text-foreground">
                {database.connectionMode === "internal"
                  ? "Internal"
                  : "External"}
              </p>
            </div>
            {database.latency && (
              <div className="space-y-1">
                <span className="text-muted-foreground">Latency</span>
                <p className="text-foreground">{database.latency}</p>
              </div>
            )}
            <div className="space-y-1">
              <span className="text-muted-foreground">Active Connections</span>
              <p className="text-foreground">{database.activeConnections}</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            Security
            <Badge variant="secondary" className="text-[10px] ml-2">
              Read-only
            </Badge>
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-muted-foreground">TLS / Encryption</span>
              <div className="flex items-center gap-2">
                {database.tlsEnabled ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-emerald-500">Enabled</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-500">Disabled</span>
                  </>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Authentication</span>
              <p className="text-foreground">{database.authMode}</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-muted-foreground" />
            Backup & Retention
            <Badge variant="secondary" className="text-[10px] ml-2">
              Read-only
            </Badge>
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              {database.backup.enabled ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-500">Backup Enabled</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-500">Backup Disabled</span>
                </>
              )}
            </div>
            {database.backup.lastBackup && (
              <div className="space-y-1">
                <span className="text-muted-foreground">Last Backup</span>
                <p className="text-foreground">{database.backup.lastBackup}</p>
              </div>
            )}
            <div className="space-y-1">
              <span className="text-muted-foreground">Retention Policy</span>
              <p className="text-foreground">
                {database.backup.retentionPolicy}
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Health Signals
          </h4>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Last health check: {database.lastHealthCheck}</span>
          </div>
          {database.lastError && (
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="h-4 w-4" />
              <span>Error: {database.lastError}</span>
            </div>
          )}
          {database.lastWarning && (
            <div className="flex items-center gap-2 text-amber-500">
              <AlertCircle className="h-4 w-4" />
              <span>Warning: {database.lastWarning}</span>
            </div>
          )}
        </section>
      </div>
    </DialogContent>
  );
}

export default function DatabasePage() {
  const [selectedDatabase, setSelectedDatabase] =
    React.useState<Database | null>(null);

  const sortedDatabases = [...databasesData].sort((a, b) => {
    if (a.role !== b.role) {
      const roleOrder: Record<DatabaseRole, number> = {
        primary: 0,
        replica: 1,
        "read-only": 2,
        standby: 3,
      };
      return roleOrder[a.role] - roleOrder[b.role];
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-8 text-foreground">
      <div>
        <h1 className="text-2xl font-semibold text-card-foreground">
          Database
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Database health, configuration, and connectivity overview.
        </p>
      </div>

      <DatabaseOverview />

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            All Databases
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {sortedDatabases.map((database) => (
              <DatabaseCard
                key={database.id}
                database={database}
                onViewDetails={setSelectedDatabase}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            Database Observability
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            This page provides operational visibility into your database
            infrastructure. All status information is read-only and updated
            periodically via automated health checks.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <p className="font-medium text-foreground">Status Definitions:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>
                  <span className="text-emerald-500">Healthy</span>: Database is
                  operational and responding normally
                </li>
                <li>
                  <span className="text-amber-500">Degraded</span>: Database is
                  operational but experiencing issues
                </li>
                <li>
                  <span className="text-destructive">Unreachable</span>:
                  Database cannot be contacted
                </li>
                <li>
                  <span className="text-slate-500">Unknown</span>: Database
                  status cannot be determined
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground">Role Definitions:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>
                  <span className="text-emerald-500">Primary</span>: Main
                  read-write database instance
                </li>
                <li>
                  <span className="text-blue-500">Replica</span>: Read-only copy
                  syncing from primary
                </li>
                <li>
                  <span className="text-purple-500">Read-only</span>: Dedicated
                  read-only instance
                </li>
                <li>
                  <span className="text-amber-500">Standby</span>: Hot standby
                  ready for promotion
                </li>
              </ul>
            </div>
          </div>
          <div className="text-xs">
            <p className="font-medium text-foreground">Important Notes:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>
                This page is read-only. No database operations can be performed
                from this interface
              </li>
              <li>
                Credentials and secrets are never exposed. Connection details
                show only hostnames and ports
              </li>
              <li>
                Health checks run every 60 seconds. Status may not reflect
                instantaneous conditions
              </li>
              <li>
                Backup status shows configuration only. Backups are managed by
                your infrastructure
              </li>
              <li>
                For database administration tasks, use your database management
                tools or CLI
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            Security & Compliance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Database observability supports your compliance and security
            requirements with read-only access to critical information.
          </p>
          <ul className="space-y-2 text-xs list-disc list-inside">
            <li>
              <strong className="text-foreground">No Data Access:</strong> This
              page never exposes or provides access to database contents,
              schemas, or query capabilities
            </li>
            <li>
              <strong className="text-foreground">Credential Safety:</strong>{" "}
              All authentication modes are shown but credentials are always
              masked
            </li>
            <li>
              <strong className="text-foreground">Read-Only Operations:</strong>
              Refresh status is the only available action - no modifications,
              queries, or administrative operations
            </li>
            <li>
              <strong className="text-foreground">Audit Trail:</strong> All
              access to this page is logged for compliance and security reviews
            </li>
            <li>
              <strong className="text-foreground">Role-Based Access:</strong>{" "}
              Database visibility requires admin or superadmin permissions
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
