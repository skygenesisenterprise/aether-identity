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
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  History,
  Info,
  PlayCircle,
  RefreshCw,
  RotateCcw,
  Search,
  Server,
  Shield,
  XCircle,
  GitCommit,
  User,
  Globe,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DeploymentStatus =
  | "successful"
  | "in_progress"
  | "failed"
  | "rolled_back"
  | "pending";

type DeploymentEnvironment = "production" | "staging" | "dev" | "custom";

interface DeploymentStage {
  name: string;
  status: "pending" | "running" | "completed" | "failed";
  duration?: string;
  timestamp?: string;
  message?: string;
}

interface DeploymentLog {
  timestamp: string;
  level: "info" | "warn" | "error";
  message: string;
}

interface Deployment {
  id: string;
  environment: DeploymentEnvironment;
  service: string;
  version: string;
  previousVersion?: string;
  status: DeploymentStatus;
  initiatedBy: string;
  initiatedByType: "admin" | "cicd";
  startedAt: string;
  completedAt?: string;
  duration?: string;
  stages: DeploymentStage[];
  logs: DeploymentLog[];
  commitSha?: string;
  commitMessage?: string;
  notes?: string;
}

interface DeploymentStatusConfig {
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

interface DeploymentEnvironmentConfig {
  label: string;
  description: string;
  color: string;
}

const deploymentStatusConfig: Record<DeploymentStatus, DeploymentStatusConfig> =
  {
    successful: {
      label: "Successful",
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    in_progress: {
      label: "In Progress",
      icon: RefreshCw,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    failed: {
      label: "Failed",
      icon: XCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    rolled_back: {
      label: "Rolled Back",
      icon: RotateCcw,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    pending: {
      label: "Pending",
      icon: Clock,
      color: "text-slate-500",
      bgColor: "bg-slate-500/10",
    },
  };

const deploymentEnvironmentConfig: Record<
  DeploymentEnvironment,
  DeploymentEnvironmentConfig
> = {
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

const deploymentsData: Deployment[] = [
  {
    id: "deploy-001",
    environment: "production",
    service: "Identity API",
    version: "v2.4.1",
    previousVersion: "v2.4.0",
    status: "successful",
    initiatedBy: "CI/CD Pipeline",
    initiatedByType: "cicd",
    startedAt: "2024-06-15T10:30:00Z",
    completedAt: "2024-06-15T10:35:42Z",
    duration: "5m 42s",
    commitSha: "a1b2c3d",
    commitMessage: "feat: Add user provisioning endpoint",
    stages: [
      {
        name: "Pre-flight Checks",
        status: "completed",
        duration: "12s",
        timestamp: "2024-06-15T10:30:12Z",
      },
      {
        name: "Database Migration",
        status: "completed",
        duration: "1m 23s",
        timestamp: "2024-06-15T10:31:35Z",
      },
      {
        name: "Container Update",
        status: "completed",
        duration: "2m 45s",
        timestamp: "2024-06-15T10:34:20Z",
      },
      {
        name: "Health Verification",
        status: "completed",
        duration: "1m 22s",
        timestamp: "2024-06-15T10:35:42Z",
      },
    ],
    logs: [
      {
        timestamp: "2024-06-15T10:30:00Z",
        level: "info",
        message: "Starting deployment for Identity API v2.4.1",
      },
      {
        timestamp: "2024-06-15T10:30:12Z",
        level: "info",
        message: "Pre-flight checks passed",
      },
      {
        timestamp: "2024-06-15T10:31:35Z",
        level: "info",
        message: "Database migration completed successfully",
      },
      {
        timestamp: "2024-06-15T10:34:20Z",
        level: "info",
        message: "All containers updated and healthy",
      },
      {
        timestamp: "2024-06-15T10:35:42Z",
        level: "info",
        message: "Deployment completed successfully",
      },
    ],
  },
  {
    id: "deploy-002",
    environment: "production",
    service: "Authentication Engine",
    version: "v2.4.0",
    previousVersion: "v2.3.9",
    status: "successful",
    initiatedBy: "admin@acme.com",
    initiatedByType: "admin",
    startedAt: "2024-06-14T08:00:00Z",
    completedAt: "2024-06-14T08:05:15Z",
    duration: "5m 15s",
    commitSha: "e4f5g6h",
    commitMessage: "fix: Resolve MFA token refresh issue",
    stages: [
      {
        name: "Pre-flight Checks",
        status: "completed",
        duration: "10s",
        timestamp: "2024-06-14T08:00:10Z",
      },
      {
        name: "Database Migration",
        status: "completed",
        duration: "45s",
        timestamp: "2024-06-14T08:00:55Z",
      },
      {
        name: "Container Update",
        status: "completed",
        duration: "2m 30s",
        timestamp: "2024-06-14T08:03:25Z",
      },
      {
        name: "Health Verification",
        status: "completed",
        duration: "1m 50s",
        timestamp: "2024-06-14T08:05:15Z",
      },
    ],
    logs: [
      {
        timestamp: "2024-06-14T08:00:00Z",
        level: "info",
        message: "Starting deployment for Authentication Engine v2.4.0",
      },
      {
        timestamp: "2024-06-14T08:05:15Z",
        level: "info",
        message: "Deployment completed successfully",
      },
    ],
  },
  {
    id: "deploy-003",
    environment: "staging",
    service: "Authorization Engine",
    version: "v2.5.0-rc1",
    previousVersion: "v2.4.1",
    status: "failed",
    initiatedBy: "CI/CD Pipeline",
    initiatedByType: "cicd",
    startedAt: "2024-06-13T14:00:00Z",
    completedAt: "2024-06-13T14:03:22Z",
    duration: "3m 22s",
    commitSha: "i7j8k9l",
    commitMessage: "feat: Implement new policy evaluation logic",
    stages: [
      {
        name: "Pre-flight Checks",
        status: "completed",
        duration: "8s",
        timestamp: "2024-06-13T14:00:08Z",
      },
      {
        name: "Database Migration",
        status: "completed",
        duration: "32s",
        timestamp: "2024-06-13T14:00:40Z",
      },
      {
        name: "Container Update",
        status: "failed",
        duration: "2m 42s",
        timestamp: "2024-06-13T14:03:22Z",
        message: "Container health check failed: connection timeout to cache",
      },
    ],
    logs: [
      {
        timestamp: "2024-06-13T14:00:00Z",
        level: "info",
        message: "Starting deployment for Authorization Engine v2.5.0-rc1",
      },
      {
        timestamp: "2024-06-13T14:03:22Z",
        level: "error",
        message: "Deployment failed: Container health check failed",
      },
      {
        timestamp: "2024-06-13T14:03:22Z",
        level: "error",
        message: "Error details: connection timeout to cache cluster",
      },
    ],
  },
  {
    id: "deploy-004",
    environment: "staging",
    service: "Session Manager",
    version: "v2.5.0-rc1",
    previousVersion: "v2.4.1",
    status: "in_progress",
    initiatedBy: "CI/CD Pipeline",
    initiatedByType: "cicd",
    startedAt: "2024-06-15T11:00:00Z",
    stages: [
      {
        name: "Pre-flight Checks",
        status: "completed",
        duration: "11s",
        timestamp: "2024-06-15T11:00:11Z",
      },
      {
        name: "Database Migration",
        status: "running",
        timestamp: "2024-06-15T11:00:22Z",
      },
      {
        name: "Container Update",
        status: "pending",
      },
      {
        name: "Health Verification",
        status: "pending",
      },
    ],
    logs: [
      {
        timestamp: "2024-06-15T11:00:00Z",
        level: "info",
        message: "Starting deployment for Session Manager v2.5.0-rc1",
      },
      {
        timestamp: "2024-06-15T11:00:11Z",
        level: "info",
        message: "Pre-flight checks passed",
      },
      {
        timestamp: "2024-06-15T11:00:22Z",
        level: "info",
        message: "Running database migrations...",
      },
    ],
  },
  {
    id: "deploy-005",
    environment: "production",
    service: "Token Service",
    version: "v2.3.8",
    previousVersion: "v2.3.9",
    status: "rolled_back",
    initiatedBy: "admin@acme.com",
    initiatedByType: "admin",
    startedAt: "2024-06-12T16:00:00Z",
    completedAt: "2024-06-12T16:04:30Z",
    duration: "4m 30s",
    commitSha: "m0n1p2q",
    commitMessage: "feat: Add token rotation enhancement",
    notes: "Rolled back due to compatibility issues with existing clients",
    stages: [
      {
        name: "Pre-flight Checks",
        status: "completed",
        duration: "9s",
        timestamp: "2024-06-12T16:00:09Z",
      },
      {
        name: "Database Migration",
        status: "completed",
        duration: "28s",
        timestamp: "2024-06-12T16:00:37Z",
      },
      {
        name: "Container Update",
        status: "completed",
        duration: "2m 15s",
        timestamp: "2024-06-12T16:02:52Z",
      },
      {
        name: "Health Verification",
        status: "completed",
        duration: "1m 38s",
        timestamp: "2024-06-12T16:04:30Z",
      },
    ],
    logs: [
      {
        timestamp: "2024-06-12T16:00:00Z",
        level: "info",
        message: "Starting deployment for Token Service v2.3.8",
      },
      {
        timestamp: "2024-06-12T16:04:30Z",
        level: "info",
        message: "Deployment completed successfully",
      },
      {
        timestamp: "2024-06-12T16:30:00Z",
        level: "warn",
        message: "Rolling back to v2.3.9 due to client compatibility issues",
      },
      {
        timestamp: "2024-06-12T16:35:00Z",
        level: "info",
        message: "Rollback to v2.3.9 completed successfully",
      },
    ],
  },
  {
    id: "deploy-006",
    environment: "dev",
    service: "Identity API",
    version: "v2.5.0-dev",
    previousVersion: "v2.5.0-dev",
    status: "successful",
    initiatedBy: "developer@acme.com",
    initiatedByType: "admin",
    startedAt: "2024-06-15T09:00:00Z",
    completedAt: "2024-06-15T09:02:15Z",
    duration: "2m 15s",
    commitSha: "r3s4t5u",
    commitMessage: "feat: Add new developer feature",
    stages: [
      {
        name: "Pre-flight Checks",
        status: "completed",
        duration: "5s",
        timestamp: "2024-06-15T09:00:05Z",
      },
      {
        name: "Database Migration",
        status: "completed",
        duration: "15s",
        timestamp: "2024-06-15T09:00:20Z",
      },
      {
        name: "Container Update",
        status: "completed",
        duration: "1m 20s",
        timestamp: "2024-06-15T09:01:40Z",
      },
      {
        name: "Health Verification",
        status: "completed",
        duration: "35s",
        timestamp: "2024-06-15T09:02:15Z",
      },
    ],
    logs: [
      {
        timestamp: "2024-06-15T09:00:00Z",
        level: "info",
        message: "Starting deployment for Identity API v2.5.0-dev",
      },
      {
        timestamp: "2024-06-15T09:02:15Z",
        level: "info",
        message: "Deployment completed successfully",
      },
    ],
  },
  {
    id: "deploy-007",
    environment: "production",
    service: "Audit Logs",
    version: "v1.8.2",
    previousVersion: "v1.8.1",
    status: "pending",
    initiatedBy: "CI/CD Pipeline",
    initiatedByType: "cicd",
    startedAt: "2024-06-15T12:00:00Z",
    stages: [
      {
        name: "Pre-flight Checks",
        status: "pending",
      },
      {
        name: "Database Migration",
        status: "pending",
      },
      {
        name: "Container Update",
        status: "pending",
      },
      {
        name: "Health Verification",
        status: "pending",
      },
    ],
    logs: [
      {
        timestamp: "2024-06-15T12:00:00Z",
        level: "info",
        message: "Deployment scheduled for Audit Logs v1.8.2",
      },
    ],
  },
];

function DeploymentOverview() {
  const totalDeployments = deploymentsData.length;
  const successfulCount = deploymentsData.filter(
    (d) => d.status === "successful",
  ).length;
  const inProgressCount = deploymentsData.filter(
    (d) => d.status === "in_progress",
  ).length;
  const failedCount = deploymentsData.filter(
    (d) => d.status === "failed",
  ).length;
  const pendingCount = deploymentsData.filter(
    (d) => d.status === "pending",
  ).length;

  const latestDeployment = deploymentsData[0];
  const latestVersion = latestDeployment?.version || "N/A";

  const latestConfig =
    deploymentStatusConfig[latestDeployment?.status || "pending"];
  const LatestIcon = latestConfig.icon;

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          Deployment Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-2 lg:grid-cols-5 divide-x divide-border">
          <div className="p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <History className="h-3 w-3" />
              Total Deployments
            </div>
            <p className="text-sm font-medium text-foreground">
              {totalDeployments}
            </p>
          </div>

          <div className="p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <CheckCircle2 className="h-3 w-3" />
              Successful
            </div>
            <p className="text-sm font-medium text-emerald-500">
              {successfulCount}
            </p>
          </div>

          <div className="p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <PlayCircle className="h-3 w-3" />
              In Progress
            </div>
            <p className="text-sm font-medium text-blue-500">
              {inProgressCount}
            </p>
          </div>

          <div className="p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <XCircle className="h-3 w-3" />
              Failed
            </div>
            <p
              className={cn(
                "text-sm font-medium",
                failedCount > 0 ? "text-destructive" : "text-foreground",
              )}
            >
              {failedCount}
            </p>
          </div>

          <div className="p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <Clock className="h-3 w-3" />
              Latest Version
            </div>
            <div className="flex items-center gap-2">
              <LatestIcon className={cn("h-4 w-4", latestConfig.color)} />
              <p className={cn("text-sm font-medium", latestConfig.color)}>
                {latestVersion}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: DeploymentStatus }) {
  const config = deploymentStatusConfig[status];
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

function DeploymentCard({
  deployment,
  onViewDetails,
}: {
  deployment: Deployment;
  onViewDetails: (deployment: Deployment) => void;
}) {
  const statusConfig = deploymentStatusConfig[deployment.status];
  const envConfig = deploymentEnvironmentConfig[deployment.environment];
  const StatusIcon = statusConfig.icon;

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
                  {deployment.service}
                </h3>
                <div className="flex items-center gap-2 text-xs">
                  <span className={cn("text-foreground", envConfig.color)}>
                    {envConfig.label}
                  </span>
                  <Badge variant="secondary" className="text-[10px]">
                    {deployment.version}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <StatusBadge status={deployment.status} />
              <span className="text-xs text-muted-foreground">
                {deployment.duration || "In progress"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="space-y-1">
              <span className="text-muted-foreground">Environment</span>
              <p className="text-foreground">{envConfig.label}</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Initiated By</span>
              <p className="text-foreground font-mono truncate">
                {deployment.initiatedBy}
              </p>
            </div>
          </div>

          {deployment.commitSha && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <GitCommit className="h-3 w-3" />
              <span className="font-mono">{deployment.commitSha}</span>
              <span className="truncate">{deployment.commitMessage}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              Started{" "}
              {new Date(deployment.startedAt).toISOString().split("T")[0]}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => onViewDetails(deployment)}
              >
                <FileText className="h-3 w-3 mr-1" />
                Details
              </Button>
            </DialogTrigger>
            <DeploymentDetailDialog deployment={deployment} />
          </Dialog>
          {(deployment.status === "failed" ||
            deployment.status === "rolled_back") && (
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
          {deployment.status === "successful" && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs text-muted-foreground"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Rollback
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-muted-foreground"
          >
            <Download className="h-3 w-3 mr-1" />
            Logs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function DeploymentDetailDialog({ deployment }: { deployment: Deployment }) {
  const statusConfig = deploymentStatusConfig[deployment.status];
  const envConfig = deploymentEnvironmentConfig[deployment.environment];
  const [expandedLogs, setExpandedLogs] = React.useState(false);

  const displayedLogs = expandedLogs
    ? deployment.logs
    : deployment.logs.slice(0, 5);

  const completedStages = deployment.stages.filter(
    (s) => s.status === "completed",
  ).length;
  const progressPercent = (completedStages / deployment.stages.length) * 100;

  return (
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Server className="h-5 w-5 text-muted-foreground" />
          {deployment.service}
        </DialogTitle>
        <DialogDescription>
          {envConfig.description} - Deployment {deployment.version}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 mt-4">
        <section className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <History className="h-4 w-4 text-muted-foreground" />
            Overview
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-muted-foreground">Status</span>
              <div className="flex items-center gap-2">
                {React.createElement(statusConfig.icon, {
                  className: cn("h-4 w-4", statusConfig.color),
                })}
                <span className={statusConfig.color}>{statusConfig.label}</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Environment</span>
              <p className={cn("text-foreground", envConfig.color)}>
                {envConfig.label}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Version</span>
              <p className="text-foreground font-mono">{deployment.version}</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Initiated By</span>
              <div className="flex items-center gap-2">
                {deployment.initiatedByType === "admin" ? (
                  <User className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                )}
                <p className="text-foreground font-mono text-xs truncate">
                  {deployment.initiatedBy}
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Started</span>
              <p className="text-foreground">
                {new Date(deployment.startedAt).toISOString().split("T")[0]}
              </p>
            </div>
            {deployment.completedAt && (
              <div className="space-y-1">
                <span className="text-muted-foreground">Completed</span>
                <p className="text-foreground">
                  {new Date(deployment.completedAt).toISOString().split("T")[0]}
                </p>
              </div>
            )}
            {deployment.commitSha && (
              <div className="space-y-1">
                <span className="text-muted-foreground">Commit</span>
                <div className="flex items-center gap-2">
                  <GitCommit className="h-4 w-4 text-muted-foreground" />
                  <code className="text-xs font-mono bg-muted px-1 rounded">
                    {deployment.commitSha}
                  </code>
                </div>
              </div>
            )}
            {deployment.duration && (
              <div className="space-y-1">
                <span className="text-muted-foreground">Duration</span>
                <p className="text-foreground">{deployment.duration}</p>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
            Deployment Progress
            <Badge variant="secondary" className="text-[10px] ml-auto">
              {completedStages}/{deployment.stages.length} stages
            </Badge>
          </h4>
          <div className="space-y-3">
            {deployment.stages.map((stage, index) => {
              const stageConfig = {
                pending: { icon: Clock, color: "text-slate-400" },
                running: { icon: RefreshCw, color: "text-blue-500" },
                completed: { icon: CheckCircle2, color: "text-emerald-500" },
                failed: { icon: XCircle, color: "text-destructive" },
              }[stage.status];
              const StageIcon = stageConfig.icon;

              return (
                <div
                  key={stage.name}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-md border",
                    stage.status === "running" &&
                      "bg-blue-500/5 border-blue-500/20",
                    stage.status === "failed" &&
                      "bg-destructive/5 border-destructive/20",
                  )}
                >
                  <StageIcon
                    className={cn("h-4 w-4 shrink-0", stageConfig.color)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {stage.name}
                      </span>
                      {stage.status === "running" && (
                        <RefreshCw className="h-3 w-3 animate-spin text-blue-500" />
                      )}
                    </div>
                    {stage.message && (
                      <p className="text-xs text-destructive mt-1">
                        {stage.message}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    {stage.duration && <span>{stage.duration}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            Deployment Logs
            <Badge variant="secondary" className="text-[10px] ml-auto">
              {deployment.logs.length} entries
            </Badge>
          </h4>
          <div className="bg-muted rounded-md p-4 space-y-2 max-h-64 overflow-y-auto">
            {displayedLogs.map((log, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-2 text-xs font-mono",
                  log.level === "error" && "text-destructive",
                  log.level === "warn" && "text-amber-500",
                  log.level === "info" && "text-muted-foreground",
                )}
              >
                <span className="shrink-0 text-muted-foreground/70">
                  {log.timestamp.split("T")[1]?.slice(0, 8) || log.timestamp}
                </span>
                <span className="uppercase text-[10px] font-medium w-12 shrink-0">
                  {log.level}
                </span>
                <span className="flex-1 break-all">{log.message}</span>
              </div>
            ))}
            {deployment.logs.length > 5 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-6 text-xs"
                onClick={() => setExpandedLogs(!expandedLogs)}
              >
                {expandedLogs ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    Show {deployment.logs.length - 5} more entries
                  </>
                )}
              </Button>
            )}
          </div>
        </section>

        <section className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            Actions
            <Badge variant="secondary" className="text-[10px] ml-2">
              Audit logged
            </Badge>
          </h4>
          <div className="flex flex-wrap gap-2">
            {(deployment.status === "failed" ||
              deployment.status === "rolled_back") && (
              <Button variant="outline" size="sm">
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry Deployment
              </Button>
            )}
            {deployment.status === "successful" && (
              <Button variant="outline" size="sm">
                <RotateCcw className="h-3 w-3 mr-1" />
                Rollback (v{deployment.previousVersion})
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Download className="h-3 w-3 mr-1" />
              Download Full Logs
            </Button>
          </div>
        </section>
      </div>
    </DialogContent>
  );
}

export default function DeploymentsPage() {
  const [selectedDeployment, setSelectedDeployment] =
    React.useState<Deployment | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [envFilter, setEnvFilter] = React.useState<string>("all");

  const filteredDeployments = deploymentsData.filter((deployment) => {
    const matchesSearch =
      deployment.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deployment.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deployment.initiatedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || deployment.status === statusFilter;
    const matchesEnv =
      envFilter === "all" || deployment.environment === envFilter;

    return matchesSearch && matchesStatus && matchesEnv;
  });

  const sortedDeployments = [...filteredDeployments].sort((a, b) => {
    return new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime();
  });

  return (
    <div className="space-y-8 text-foreground">
      <div>
        <h1 className="text-2xl font-semibold text-card-foreground">
          Deployments
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and monitor deployed versions across environments.
        </p>
      </div>

      <DeploymentOverview />

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <History className="h-4 w-4 text-muted-foreground" />
              All Deployments
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search deployments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 pl-7 pr-3 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-8 px-2 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="all">All Status</option>
                <option value="successful">Successful</option>
                <option value="in_progress">In Progress</option>
                <option value="failed">Failed</option>
                <option value="rolled_back">Rolled Back</option>
                <option value="pending">Pending</option>
              </select>
              <select
                value={envFilter}
                onChange={(e) => setEnvFilter(e.target.value)}
                className="h-8 px-2 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="all">All Environments</option>
                <option value="production">Production</option>
                <option value="staging">Staging</option>
                <option value="dev">Development</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {sortedDeployments.map((deployment) => (
              <DeploymentCard
                key={deployment.id}
                deployment={deployment}
                onViewDetails={setSelectedDeployment}
              />
            ))}
          </div>
          {sortedDeployments.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                No deployments found matching your filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border bg-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            Deployment Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            This page provides visibility into all Identity system deployments
            across environments. Deployments are tracked from initiation through
            completion, including any rollbacks or failures.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <p className="font-medium text-foreground">Status Definitions:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>
                  <span className="text-emerald-500">Successful</span>:
                  Deployment completed successfully and is active
                </li>
                <li>
                  <span className="text-blue-500">In Progress</span>: Deployment
                  is currently being executed
                </li>
                <li>
                  <span className="text-destructive">Failed</span>: Deployment
                  encountered errors and did not complete
                </li>
                <li>
                  <span className="text-amber-500">Rolled Back</span>:
                  Deployment was intentionally reverted after initial success
                </li>
                <li>
                  <span className="text-slate-500">Pending</span>: Deployment is
                  scheduled but not yet started
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground">Actions & Safety:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>
                  <strong className="text-foreground">Retry</strong>: Re-run a
                  failed deployment (requires confirmation)
                </li>
                <li>
                  <strong className="text-foreground">Rollback</strong>: Revert
                  to the previous version (requires explicit confirmation)
                </li>
                <li>
                  All actions are logged for audit purposes and require
                  appropriate permissions
                </li>
                <li>
                  Rollbacks are non-destructive and can be reapplied if needed
                </li>
              </ul>
            </div>
          </div>
          <div className="text-xs">
            <p className="font-medium text-foreground">Important Notes:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>
                This page is read-only by default. All actions require explicit
                confirmation
              </li>
              <li>
                Sensitive data such as secrets and tokens are never exposed in
                deployment logs
              </li>
              <li>
                Rollback and retry actions are restricted to admin and
                superadmin roles
              </li>
              <li>
                For production deployments, coordinate with your team before
                initiating rollback actions
              </li>
              <li>
                Detailed audit logs are available for compliance and security
                reviews
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
