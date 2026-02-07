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
  FileText,
  Globe,
  Info,
  Layers,
  RefreshCw,
  Server,
  Shield,
  XCircle,
  LayoutGrid
} from "lucide-react";
import { cn } from "@/lib/utils";

type EnvironmentStatus = "healthy" | "degraded" | "unhealthy" | "unknown";
type EnvironmentType = "production" | "staging" | "dev" | "custom";

interface EnvironmentConfiguration {
  runtimeMode: string;
  keyFlags: string[];
}

interface EnvironmentLimits {
  users: number;
  devices: number;
  apiCalls: number;
}

interface EnvironmentResources {
  cpu: string;
  memory: string;
  storage: string;
}

interface EnvironmentConnectivity {
  databases: string[];
  services: string[];
  externalIdPs: string[];
}

interface Environment {
  id: string;
  name: string;
  type: EnvironmentType;
  status: EnvironmentStatus;
  region: string;
  owner: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  configuration: EnvironmentConfiguration;
  limits: EnvironmentLimits;
  activeModules: string[];
  connectivity: EnvironmentConnectivity;
  resources: EnvironmentResources;
  lastError?: string;
  lastWarning?: string;
}

interface EnvironmentStatusConfig {
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

interface EnvironmentTypeConfig {
  label: string;
  description: string;
  color: string;
}

const environmentStatusConfig: Record<
  EnvironmentStatus,
  EnvironmentStatusConfig
> = {
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
  unhealthy: {
    label: "Unhealthy",
    icon: XCircle,
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

const environmentTypeConfig: Record<EnvironmentType, EnvironmentTypeConfig> = {
  production: {
    label: "Production",
    description: "Live production environment",
    color: "text-emerald-500",
  },
  staging: {
    label: "Staging",
    description: "Pre-production staging environment",
    color: "text-amber-500",
  },
  dev: {
    label: "Development",
    description: "Development environment",
    color: "text-blue-500",
  },
  custom: {
    label: "Custom",
    description: "Custom-configured environment",
    color: "text-purple-500",
  },
};

const environmentsData: Environment[] = [
  {
    id: "prod-us-east",
    name: "Production US-East",
    type: "production",
    status: "healthy",
    region: "US-East",
    owner: "Platform Team",
    version: "v2.4.1",
    createdAt: "Jan 15, 2024",
    updatedAt: "2 hours ago",
    configuration: {
      runtimeMode: "production",
      keyFlags: ["REPLICAS: 5", "RATE_LIMIT: 50k/min", "BACKUP: continuous"],
    },
    limits: {
      users: 100000,
      devices: 250000,
      apiCalls: 50000000,
    },
    activeModules: [
      "Identity API",
      "Authentication Engine",
      "Authorization Engine",
      "Session Manager",
      "Token Service",
      "Audit Logs",
    ],
    connectivity: {
      databases: ["Primary PostgreSQL", "Read Replica US-West"],
      services: ["Cache Cluster", "Message Queue", "Search Cluster"],
      externalIdPs: ["Azure AD", "Okta", "Google Workspace"],
    },
    resources: {
      cpu: "45%",
      memory: "62%",
      storage: "78%",
    },
  },
  {
    id: "prod-eu-west",
    name: "Production EU-West",
    type: "production",
    status: "healthy",
    region: "EU-West",
    owner: "Platform Team",
    version: "v2.4.1",
    createdAt: "Feb 1, 2024",
    updatedAt: "4 hours ago",
    configuration: {
      runtimeMode: "production",
      keyFlags: ["REPLICAS: 3", "RATE_LIMIT: 30k/min", "BACKUP: continuous"],
    },
    limits: {
      users: 50000,
      devices: 125000,
      apiCalls: 25000000,
    },
    activeModules: [
      "Identity API",
      "Authentication Engine",
      "Authorization Engine",
      "Session Manager",
      "Token Service",
    ],
    connectivity: {
      databases: ["Primary PostgreSQL EU"],
      services: ["Cache Cluster EU", "Message Queue EU"],
      externalIdPs: ["Azure AD EU", "Okta"],
    },
    resources: {
      cpu: "38%",
      memory: "55%",
      storage: "65%",
    },
  },
  {
    id: "staging-us-east",
    name: "Staging US-East",
    type: "staging",
    status: "degraded",
    region: "US-East",
    owner: "Engineering Team",
    version: "v2.5.0-rc1",
    createdAt: "Mar 10, 2024",
    updatedAt: "30 minutes ago",
    configuration: {
      runtimeMode: "staging",
      keyFlags: ["REPLICAS: 2", "RATE_LIMIT: 10k/min", "DEBUG_MODE: enabled"],
    },
    limits: {
      users: 5000,
      devices: 10000,
      apiCalls: 1000000,
    },
    activeModules: [
      "Identity API",
      "Authentication Engine",
      "Authorization Engine",
    ],
    connectivity: {
      databases: ["Staging PostgreSQL"],
      services: ["Staging Cache", "Staging Message Queue"],
      externalIdPs: ["Azure AD Staging"],
    },
    resources: {
      cpu: "72%",
      memory: "81%",
      storage: "45%",
    },
    lastWarning: "Elevated memory usage on auth service",
  },
  {
    id: "staging-eu-west",
    name: "Staging EU-West",
    type: "staging",
    status: "healthy",
    region: "EU-West",
    owner: "Engineering Team",
    version: "v2.5.0-rc1",
    createdAt: "Mar 12, 2024",
    updatedAt: "1 hour ago",
    configuration: {
      runtimeMode: "staging",
      keyFlags: ["REPLICAS: 2", "RATE_LIMIT: 5k/min"],
    },
    limits: {
      users: 2500,
      devices: 5000,
      apiCalls: 500000,
    },
    activeModules: ["Identity API", "Authentication Engine"],
    connectivity: {
      databases: ["Staging PostgreSQL EU"],
      services: ["Staging Cache EU"],
      externalIdPs: ["Azure AD Staging"],
    },
    resources: {
      cpu: "25%",
      memory: "42%",
      storage: "32%",
    },
  },
  {
    id: "dev-us-east",
    name: "Development US-East",
    type: "dev",
    status: "healthy",
    region: "US-East",
    owner: "Development Team",
    version: "v2.5.0-dev",
    createdAt: "Apr 1, 2024",
    updatedAt: "10 minutes ago",
    configuration: {
      runtimeMode: "development",
      keyFlags: ["REPLICAS: 1", "DEBUG_MODE: enabled", "LOG_LEVEL: verbose"],
    },
    limits: {
      users: 100,
      devices: 200,
      apiCalls: 10000,
    },
    activeModules: ["Identity API", "Authentication Engine"],
    connectivity: {
      databases: ["Dev PostgreSQL"],
      services: ["Dev Redis"],
      externalIdPs: ["Azure AD Dev"],
    },
    resources: {
      cpu: "15%",
      memory: "28%",
      storage: "12%",
    },
  },
  {
    id: "qa-us-east",
    name: "QA Environment",
    type: "custom",
    status: "healthy",
    region: "US-East",
    owner: "QA Team",
    version: "v2.4.1",
    createdAt: "May 15, 2024",
    updatedAt: "Yesterday",
    configuration: {
      runtimeMode: "qa",
      keyFlags: ["REPLICAS: 1", "TEST_DATA: loaded", "MOCK_IDPS: enabled"],
    },
    limits: {
      users: 500,
      devices: 1000,
      apiCalls: 50000,
    },
    activeModules: [
      "Identity API",
      "Authentication Engine",
      "Authorization Engine",
    ],
    connectivity: {
      databases: ["QA PostgreSQL"],
      services: ["QA Redis"],
      externalIdPs: ["Mock Azure AD"],
    },
    resources: {
      cpu: "8%",
      memory: "18%",
      storage: "22%",
    },
  },
];

// Environment overview card component
function EnvironmentOverview() {
  const totalEnvironments = environmentsData.length;
  const healthyCount = environmentsData.filter(
    (e) => e.status === "healthy",
  ).length;
  const degradedCount = environmentsData.filter(
    (e) => e.status === "degraded",
  ).length;
  const unhealthyCount = environmentsData.filter(
    (e) => e.status === "unhealthy",
  ).length;
  const unknownCount = environmentsData.filter(
    (e) => e.status === "unknown",
  ).length;

  // Calculate overall system health
  let overallHealth: { status: EnvironmentStatus; count: number } = {
    status: "healthy",
    count: healthyCount,
  };

  if (unhealthyCount > 0) {
    overallHealth = { status: "unhealthy", count: unhealthyCount };
  } else if (degradedCount > 0) {
    overallHealth = { status: "degraded", count: degradedCount };
  } else if (unknownCount > 0) {
    overallHealth = { status: "unknown", count: unknownCount };
  }

  const overallConfig = environmentStatusConfig[overallHealth.status];
  const OverallIcon = overallConfig.icon;

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          Environment Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
          {/* Overall Health */}
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

          {/* Healthy Environments */}
          <div className="p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <CheckCircle2 className="h-3 w-3" />
              Healthy
            </div>
            <p className="text-sm font-medium text-emerald-500">
              {healthyCount} environments
            </p>
          </div>

          {/* Degraded Environments */}
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
              {degradedCount} environments
            </p>
          </div>

          {/* Total Environments */}
          <div className="p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <Server className="h-3 w-3" />
              Total Environments
            </div>
            <p className="text-sm font-medium text-foreground">
              {totalEnvironments} environments
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Environment card component
function EnvironmentCard({
  environment,
  onViewDetails,
}: {
  environment: Environment;
  onViewDetails: (environment: Environment) => void;
}) {
  const statusConfig = environmentStatusConfig[environment.status];
  const StatusIcon = statusConfig.icon;
  const typeConfig = environmentTypeConfig[environment.type];

  return (
    <Card className="border-border bg-card hover:border-border/80 transition-colors">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-secondary">
                <Server className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">
                  {environment.name}
                </h3>
                <div className="flex items-center gap-2 text-xs">
                  <span className={cn("text-foreground", typeConfig.color)}>
                    {typeConfig.label}
                  </span>
                  <Badge variant="secondary" className="text-[10px]">
                    {environment.region}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <Badge
                className={cn(
                  "h-6 px-2 text-xs font-medium border-0",
                  statusConfig.bgColor,
                  statusConfig.color,
                )}
              >
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusConfig.label}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Updated {environment.updatedAt}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="space-y-1">
              <span className="text-muted-foreground">Owner</span>
              <p className="text-foreground font-mono">{environment.owner}</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Version</span>
              <p className="text-foreground font-mono">{environment.version}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Created {environment.createdAt}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => onViewDetails(environment)}
              >
                <FileText className="h-3 w-3 mr-1" />
                Details
              </Button>
            </DialogTrigger>
            <EnvironmentDetailDialog environment={environment} />
          </Dialog>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-muted-foreground"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-muted-foreground"
          >
            <Globe className="h-3 w-3 mr-1" />
            Context
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Environment detail dialog component
function EnvironmentDetailDialog({
  environment,
}: {
  environment: Environment;
}) {
  const statusConfig = environmentStatusConfig[environment.status];
  const StatusIcon = statusConfig.icon;
  const typeConfig = environmentTypeConfig[environment.type];

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Server className="h-5 w-5 text-muted-foreground" />
          {environment.name}
        </DialogTitle>
        <DialogDescription>
          {typeConfig.description} - {environment.region}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 mt-4">
        {/* Overview Section */}
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
              <span className="text-muted-foreground">Environment Type</span>
              <p className={cn("text-foreground", typeConfig.color)}>
                {typeConfig.label}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Owner</span>
              <p className="text-foreground font-mono">{environment.owner}</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Version</span>
              <p className="text-foreground font-mono">{environment.version}</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Created</span>
              <p className="text-foreground">{environment.createdAt}</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Updated</span>
              <p className="text-foreground">{environment.updatedAt}</p>
            </div>
          </div>
        </section>

        {/* Configuration Section */}
        <section className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <LayoutGrid className="h-4 w-4 text-muted-foreground" />
            Configuration
            <Badge variant="secondary" className="text-[10px] ml-2">
              Read-only
            </Badge>
          </h4>
          <div className="space-y-3 text-sm">
            <div className="space-y-1">
              <span className="text-muted-foreground">Runtime Mode</span>
              <p className="text-foreground font-mono">
                {environment.configuration.runtimeMode}
              </p>
            </div>
            {environment.configuration.keyFlags.length > 0 && (
              <div className="space-y-2">
                <span className="text-muted-foreground">Key Flags</span>
                <div className="flex flex-wrap gap-2">
                  {environment.configuration.keyFlags.map((flag: string) => (
                    <Badge
                      key={flag}
                      variant="secondary"
                      className="text-xs font-mono bg-muted"
                    >
                      {flag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Resource Limits Section */}
        <section className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Layers className="h-4 w-4 text-muted-foreground" />
            Resource Limits
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-muted-foreground">Users</span>
              <p className="text-foreground">
                {environment.limits.users.toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Devices</span>
              <p className="text-foreground">
                {environment.limits.devices.toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">API Calls</span>
              <p className="text-foreground">
                {environment.limits.apiCalls.toLocaleString()}
              </p>
            </div>
          </div>
        </section>

        {/* Active Modules Section */}
        <section className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            Active Modules
          </h4>
          <div className="flex flex-wrap gap-2">
            {environment.activeModules.map((module: string) => (
              <Badge key={module} variant="secondary" className="text-xs">
                {module}
              </Badge>
            ))}
          </div>
        </section>

        {/* Connectivity Section */}
        <section className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
            Connectivity
          </h4>
          <div className="space-y-3 text-sm">
            {environment.connectivity.databases.length > 0 && (
              <div>
                <span className="text-xs text-muted-foreground">Databases</span>
                <div className="flex flex-wrap gap-2">
                  {environment.connectivity.databases.map((db: string) => (
                    <Badge key={db} variant="outline" className="text-xs">
                      {db}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {environment.connectivity.services.length > 0 && (
              <div>
                <span className="text-xs text-muted-foreground">Services</span>
                <div className="flex flex-wrap gap-2">
                  {environment.connectivity.services.map((service: string) => (
                    <Badge key={service} variant="outline" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {environment.connectivity.externalIdPs.length > 0 && (
              <div>
                <span className="text-xs text-muted-foreground">
                  External IdPs
                </span>
                <div className="flex flex-wrap gap-2">
                  {environment.connectivity.externalIdPs.map((idp: string) => (
                    <Badge key={idp} variant="outline" className="text-xs">
                      {idp}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Status & Observability Section */}
        <section className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            Status & Observability
          </h4>
          <div className="space-y-2 text-sm">
            {environment.lastError && (
              <div className="flex items-center gap-2 text-destructive">
                <XCircle className="h-4 w-4" />
                <span>Recent Error: {environment.lastError}</span>
              </div>
            )}
            {environment.lastWarning && (
              <div className="flex items-center gap-2 text-amber-500">
                <AlertCircle className="h-4 w-4" />
                <span>Recent Warning: {environment.lastWarning}</span>
              </div>
            )}
          </div>
        </section>

        {/* Resource Metrics Section */}
        <section className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Layers className="h-4 w-4 text-muted-foreground" />
            Resource Metrics
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-muted-foreground">CPU</span>
              <p className="text-foreground">{environment.resources.cpu}</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Memory</span>
              <p className="text-foreground">{environment.resources.memory}</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Storage</span>
              <p className="text-foreground">{environment.resources.storage}</p>
            </div>
          </div>
        </section>
      </div>
    </DialogContent>
  );
}

// Main Environments page component
export default function EnvironmentsPage() {
  const [selectedEnvironment, setSelectedEnvironment] =
    React.useState<Environment | null>(null);

  // Sort environments: Production > Staging > Dev > Custom
  const sortedEnvironments = [...environmentsData].sort((a, b) => {
    const typeOrder: Record<EnvironmentType, number> = {
      production: 0,
      staging: 1,
      dev: 2,
      custom: 3,
    };

    if (typeOrder[a.type] !== typeOrder[b.type]) {
      return typeOrder[a.type] - typeOrder[b.type];
    }

    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-8 text-foreground">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-card-foreground">
          Environments
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage and monitor Identity deployment environments.
        </p>
      </div>

      {/* Environment Overview */}
      <EnvironmentOverview />

      {/* Environment List */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Server className="h-4 w-4 text-muted-foreground" />
            All Environments
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {sortedEnvironments.map((environment) => (
              <EnvironmentCard
                key={environment.id}
                environment={environment}
                onViewDetails={setSelectedEnvironment}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Help & Information */}
      <Card className="border-border bg-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            Environment Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            This page provides operational visibility into your Identity
            deployment environments. Each environment represents a complete
            Identity deployment instance with its own configuration, resources,
            and connectivity.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <p className="font-medium text-foreground">Environment Types:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>
                  <span className="text-emerald-500">Production</span>: Live
                  environment for production workloads
                </li>
                <li>
                  <span className="text-amber-500">Staging</span>:
                  Pre-production environment for testing
                </li>
                <li>
                  <span className="text-blue-500">Development</span>:
                  Development environment for feature development
                </li>
                <li>
                  <span className="text-purple-500">Custom</span>:
                  Custom-configured environments
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground">Status Definitions:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>
                  <span className="text-emerald-500">Healthy</span>: Environment
                  is operational and responding normally
                </li>
                <li>
                  <span className="text-amber-500">Degraded</span>: Environment
                  is operational but experiencing issues
                </li>
                <li>
                  <span className="text-destructive">Unhealthy</span>:
                  Environment is experiencing critical issues
                </li>
                <li>
                  <span className="text-slate-500">Unknown</span>: Environment
                  status cannot be determined
                </li>
              </ul>
            </div>
          </div>
          <div className="text-xs">
            <p className="font-medium text-foreground">Important Notes:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>
                Environment context switching may affect the scope of operations
                and visibility
              </li>
              <li>
                Resource limits and quotas are enforced at the environment level
              </li>
              <li>
                Active modules indicate which Identity services are deployed in
                this environment
              </li>
              <li>
                Connectivity information shows dependencies on databases,
                services, and external identity providers
              </li>
              <li>
                This page is read-only. Configuration changes require
                appropriate administrative tools
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
