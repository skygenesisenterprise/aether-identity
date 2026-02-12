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
import { MetricCard } from "@/components/dashboard/metric-card";
import { Progress } from "@/components/dashboard/ui/progress";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dashboard/ui/dialog";
import {
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
  Activity,
  Zap,
  AlertTriangle,
  Lock,
  Eye,
  Calendar,
  MoreHorizontal,
  ArrowRight,
  Building2,
  Layers,
  Settings,
  BarChart3,
  ShieldCheck,
  Database,
  CheckCircle,
} from "lucide-react";

// ============================================================================
// TYPES & CONFIGURATION
// ============================================================================

type DeploymentStatus =
  | "successful"
  | "in_progress"
  | "failed"
  | "rolled_back"
  | "pending"
  | "scheduled";
type DeploymentEnvironment =
  | "production"
  | "staging"
  | "development"
  | "sandbox";
type PlanTier = "enterprise" | "pro" | "free";
type ComplianceStatus = "compliant" | "warning" | "violation";

interface DeploymentStage {
  id: string;
  name: string;
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  duration?: string;
  timestamp?: string;
  message?: string;
  logs?: string;
}

interface DeploymentLog {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  message: string;
  correlationId?: string;
  source?: string;
}

interface Deployment {
  id: string;
  environment: DeploymentEnvironment;
  service: string;
  version: string;
  previousVersion?: string;
  status: DeploymentStatus;
  initiatedBy: string;
  initiatedByType: "admin" | "cicd" | "system" | "scheduled";
  startedAt: string;
  completedAt?: string;
  duration?: string;
  stages: DeploymentStage[];
  logs: DeploymentLog[];
  commitSha?: string;
  commitMessage?: string;
  notes?: string;
  approvalStatus?: "approved" | "pending" | "rejected";
  approvedBy?: string;
  rollbackReason?: string;
  tags?: string[];
}

interface EnvironmentStatus {
  environment: DeploymentEnvironment;
  status: "healthy" | "degraded" | "critical" | "maintenance";
  currentVersion: string;
  lastDeployment: string;
  uptime: string;
  healthScore: number;
  activeServices: number;
  totalServices: number;
  region?: string;
  isProduction: boolean;
}

interface ComplianceCheck {
  id: string;
  name: string;
  status: ComplianceStatus;
  description: string;
  lastChecked: string;
  framework: string;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const deploymentStatusConfig: Record<
  DeploymentStatus,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
  }
> = {
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
    label: "Pending Approval",
    icon: Clock,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  scheduled: {
    label: "Scheduled",
    icon: Calendar,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
};

const environmentConfig: Record<
  DeploymentEnvironment,
  {
    label: string;
    description: string;
    color: string;
    bgColor: string;
  }
> = {
  production: {
    label: "Production",
    description: "Live production environment with high availability SLA",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  staging: {
    label: "Staging",
    description: "Pre-production validation environment",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  development: {
    label: "Development",
    description: "Development and testing environment",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  sandbox: {
    label: "Sandbox",
    description: "Isolated testing and experimentation environment",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
};

const healthStatusConfig: Record<
  string,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
  }
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
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  maintenance: {
    label: "Maintenance",
    icon: Settings,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
};

// ============================================================================
// MOCK DATA - Enterprise SaaS Context
// ============================================================================

const organizationContext = {
  name: "Acme Corporation",
  workspace: "Global Production",
  plan: "enterprise" as PlanTier,
  planLabel: "Enterprise",
  region: "US-East (Virginia)",
  deploymentStrategy: "Blue-Green",
  rbacEnabled: true,
  auditLogging: true,
  retentionDays: 90,
  lastLogin: "Today, 9:42 AM",
  userRole: "Infrastructure Admin",
  userScope: [
    "deploy:read",
    "deploy:write",
    "deploy:approve",
    "deploy:rollback",
  ],
};

const environmentsData: EnvironmentStatus[] = [
  {
    environment: "production",
    status: "healthy",
    currentVersion: "v2.4.1",
    lastDeployment: "2024-06-15T10:35:42Z",
    uptime: "45d 12h 34m",
    healthScore: 98,
    activeServices: 12,
    totalServices: 12,
    region: "us-east-1",
    isProduction: true,
  },
  {
    environment: "staging",
    status: "degraded",
    currentVersion: "v2.5.0-rc1",
    lastDeployment: "2024-06-15T11:00:00Z",
    uptime: "23d 8h 15m",
    healthScore: 87,
    activeServices: 11,
    totalServices: 12,
    region: "us-east-1",
    isProduction: false,
  },
  {
    environment: "development",
    status: "healthy",
    currentVersion: "v2.5.0-dev",
    lastDeployment: "2024-06-15T09:02:15Z",
    uptime: "12d 4h 22m",
    healthScore: 95,
    activeServices: 8,
    totalServices: 8,
    region: "us-west-2",
    isProduction: false,
  },
  {
    environment: "sandbox",
    status: "maintenance",
    currentVersion: "v2.4.0",
    lastDeployment: "2024-06-10T14:30:00Z",
    uptime: "0d 0h 0m",
    healthScore: 0,
    activeServices: 0,
    totalServices: 4,
    region: "eu-west-1",
    isProduction: false,
  },
];

const deploymentsData: Deployment[] = [
  {
    id: "deploy-2024-001",
    environment: "production",
    service: "Identity Core API",
    version: "v2.4.1",
    previousVersion: "v2.4.0",
    status: "successful",
    initiatedBy: "CI/CD Pipeline",
    initiatedByType: "cicd",
    startedAt: "2024-06-15T10:30:00Z",
    completedAt: "2024-06-15T10:35:42Z",
    duration: "5m 42s",
    commitSha: "a1b2c3d4e5f6",
    commitMessage: "feat: Add enhanced user provisioning with SCIM 2.0 support",
    approvalStatus: "approved",
    approvedBy: "sarah.chen@acme.com",
    tags: ["security", "feature"],
    stages: [
      {
        id: "s1",
        name: "Pre-deployment Validation",
        status: "completed",
        duration: "12s",
        timestamp: "2024-06-15T10:30:12Z",
      },
      {
        id: "s2",
        name: "Database Migration",
        status: "completed",
        duration: "1m 23s",
        timestamp: "2024-06-15T10:31:35Z",
      },
      {
        id: "s3",
        name: "Blue-Green Switch",
        status: "completed",
        duration: "2m 45s",
        timestamp: "2024-06-15T10:34:20Z",
      },
      {
        id: "s4",
        name: "Health Verification",
        status: "completed",
        duration: "1m 22s",
        timestamp: "2024-06-15T10:35:42Z",
      },
    ],
    logs: [
      {
        id: "l1",
        timestamp: "2024-06-15T10:30:00Z",
        level: "info",
        message: "Deployment initiated for Identity Core API v2.4.1",
        correlationId: "corr-001",
        source: "deployment-controller",
      },
      {
        id: "l2",
        timestamp: "2024-06-15T10:30:12Z",
        level: "info",
        message: "Pre-deployment checks passed successfully",
        correlationId: "corr-001",
        source: "validator",
      },
      {
        id: "l3",
        timestamp: "2024-06-15T10:31:35Z",
        level: "info",
        message: "Database migration completed: 3 migrations applied",
        correlationId: "corr-001",
        source: "db-migrator",
      },
      {
        id: "l4",
        timestamp: "2024-06-15T10:34:20Z",
        level: "info",
        message: "Blue-green deployment switch completed",
        correlationId: "corr-001",
        source: "orchestrator",
      },
      {
        id: "l5",
        timestamp: "2024-06-15T10:35:42Z",
        level: "info",
        message: "All health checks passed. Deployment successful.",
        correlationId: "corr-001",
        source: "health-checker",
      },
    ],
  },
  {
    id: "deploy-2024-002",
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
    commitSha: "e4f5g6h7i8j9",
    commitMessage:
      "fix: Resolve MFA token refresh issue affecting mobile clients",
    approvalStatus: "approved",
    approvedBy: "security@acme.com",
    tags: ["hotfix", "security"],
    stages: [
      {
        id: "s1",
        name: "Pre-deployment Validation",
        status: "completed",
        duration: "10s",
        timestamp: "2024-06-14T08:00:10Z",
      },
      {
        id: "s2",
        name: "Database Migration",
        status: "completed",
        duration: "45s",
        timestamp: "2024-06-14T08:00:55Z",
      },
      {
        id: "s3",
        name: "Blue-Green Switch",
        status: "completed",
        duration: "2m 30s",
        timestamp: "2024-06-14T08:03:25Z",
      },
      {
        id: "s4",
        name: "Health Verification",
        status: "completed",
        duration: "1m 50s",
        timestamp: "2024-06-14T08:05:15Z",
      },
    ],
    logs: [
      {
        id: "l1",
        timestamp: "2024-06-14T08:00:00Z",
        level: "info",
        message: "Hotfix deployment initiated",
        correlationId: "corr-002",
        source: "deployment-controller",
      },
      {
        id: "l2",
        timestamp: "2024-06-14T08:05:15Z",
        level: "info",
        message: "Hotfix deployment completed successfully",
        correlationId: "corr-002",
        source: "health-checker",
      },
    ],
  },
  {
    id: "deploy-2024-003",
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
    commitSha: "i7j8k9l0m1n2",
    commitMessage: "feat: Implement new policy evaluation engine with caching",
    approvalStatus: "approved",
    tags: ["feature", "performance"],
    stages: [
      {
        id: "s1",
        name: "Pre-deployment Validation",
        status: "completed",
        duration: "8s",
        timestamp: "2024-06-13T14:00:08Z",
      },
      {
        id: "s2",
        name: "Database Migration",
        status: "completed",
        duration: "32s",
        timestamp: "2024-06-13T14:00:40Z",
      },
      {
        id: "s3",
        name: "Blue-Green Switch",
        status: "failed",
        duration: "2m 42s",
        timestamp: "2024-06-13T14:03:22Z",
        message:
          "Container health check failed: connection timeout to Redis cache cluster",
      },
      { id: "s4", name: "Health Verification", status: "skipped" },
    ],
    logs: [
      {
        id: "l1",
        timestamp: "2024-06-13T14:00:00Z",
        level: "info",
        message: "Deployment initiated for Authorization Engine v2.5.0-rc1",
        correlationId: "corr-003",
        source: "deployment-controller",
      },
      {
        id: "l2",
        timestamp: "2024-06-13T14:03:22Z",
        level: "error",
        message: "Container health check failed after 3 attempts",
        correlationId: "corr-003",
        source: "health-checker",
      },
      {
        id: "l3",
        timestamp: "2024-06-13T14:03:22Z",
        level: "error",
        message:
          "Error: connection timeout to Redis cache cluster at cache.staging.internal:6379",
        correlationId: "corr-003",
        source: "health-checker",
      },
      {
        id: "l4",
        timestamp: "2024-06-13T14:03:25Z",
        level: "warn",
        message: "Initiating automatic rollback to v2.4.1",
        correlationId: "corr-003",
        source: "orchestrator",
      },
    ],
  },
  {
    id: "deploy-2024-004",
    environment: "staging",
    service: "Session Manager",
    version: "v2.5.0-rc1",
    previousVersion: "v2.4.1",
    status: "in_progress",
    initiatedBy: "CI/CD Pipeline",
    initiatedByType: "cicd",
    startedAt: "2024-06-15T11:00:00Z",
    approvalStatus: "approved",
    tags: ["feature"],
    stages: [
      {
        id: "s1",
        name: "Pre-deployment Validation",
        status: "completed",
        duration: "11s",
        timestamp: "2024-06-15T11:00:11Z",
      },
      {
        id: "s2",
        name: "Database Migration",
        status: "running",
        timestamp: "2024-06-15T11:00:22Z",
      },
      { id: "s3", name: "Blue-Green Switch", status: "pending" },
      { id: "s4", name: "Health Verification", status: "pending" },
    ],
    logs: [
      {
        id: "l1",
        timestamp: "2024-06-15T11:00:00Z",
        level: "info",
        message: "Deployment initiated for Session Manager v2.5.0-rc1",
        correlationId: "corr-004",
        source: "deployment-controller",
      },
      {
        id: "l2",
        timestamp: "2024-06-15T11:00:11Z",
        level: "info",
        message: "Pre-deployment validation passed",
        correlationId: "corr-004",
        source: "validator",
      },
      {
        id: "l3",
        timestamp: "2024-06-15T11:00:22Z",
        level: "info",
        message: "Running database migrations...",
        correlationId: "corr-004",
        source: "db-migrator",
      },
    ],
  },
  {
    id: "deploy-2024-005",
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
    commitSha: "m0n1p2q3r4s5",
    commitMessage: "feat: Add token rotation enhancement",
    approvalStatus: "approved",
    approvedBy: "admin@acme.com",
    rollbackReason: "Compatibility issues detected with legacy client SDKs",
    tags: ["rollback", "incident"],
    stages: [
      {
        id: "s1",
        name: "Pre-deployment Validation",
        status: "completed",
        duration: "9s",
        timestamp: "2024-06-12T16:00:09Z",
      },
      {
        id: "s2",
        name: "Database Migration",
        status: "completed",
        duration: "28s",
        timestamp: "2024-06-12T16:00:37Z",
      },
      {
        id: "s3",
        name: "Blue-Green Switch",
        status: "completed",
        duration: "2m 15s",
        timestamp: "2024-06-12T16:02:52Z",
      },
      {
        id: "s4",
        name: "Health Verification",
        status: "completed",
        duration: "1m 38s",
        timestamp: "2024-06-12T16:04:30Z",
      },
    ],
    logs: [
      {
        id: "l1",
        timestamp: "2024-06-12T16:00:00Z",
        level: "info",
        message: "Deployment initiated for Token Service v2.3.8",
        correlationId: "corr-005",
        source: "deployment-controller",
      },
      {
        id: "l2",
        timestamp: "2024-06-12T16:04:30Z",
        level: "info",
        message: "Deployment completed successfully",
        correlationId: "corr-005",
        source: "health-checker",
      },
      {
        id: "l3",
        timestamp: "2024-06-12T16:30:00Z",
        level: "warn",
        message: "Rollback triggered: compatibility issues with legacy clients",
        correlationId: "corr-005",
        source: "admin@acme.com",
      },
      {
        id: "l4",
        timestamp: "2024-06-12T16:35:00Z",
        level: "info",
        message: "Rollback to v2.3.9 completed successfully",
        correlationId: "corr-005",
        source: "orchestrator",
      },
    ],
  },
  {
    id: "deploy-2024-006",
    environment: "development",
    service: "Identity Core API",
    version: "v2.5.0-dev.142",
    previousVersion: "v2.5.0-dev.141",
    status: "successful",
    initiatedBy: "developer@acme.com",
    initiatedByType: "admin",
    startedAt: "2024-06-15T09:00:00Z",
    completedAt: "2024-06-15T09:02:15Z",
    duration: "2m 15s",
    commitSha: "r3s4t5u6v7w8",
    commitMessage:
      "feat: Add new developer feature - experimental GraphQL endpoint",
    approvalStatus: "approved",
    tags: ["experimental"],
    stages: [
      {
        id: "s1",
        name: "Pre-deployment Validation",
        status: "completed",
        duration: "5s",
        timestamp: "2024-06-15T09:00:05Z",
      },
      {
        id: "s2",
        name: "Database Migration",
        status: "completed",
        duration: "15s",
        timestamp: "2024-06-15T09:00:20Z",
      },
      {
        id: "s3",
        name: "Blue-Green Switch",
        status: "completed",
        duration: "1m 20s",
        timestamp: "2024-06-15T09:01:40Z",
      },
      {
        id: "s4",
        name: "Health Verification",
        status: "completed",
        duration: "35s",
        timestamp: "2024-06-15T09:02:15Z",
      },
    ],
    logs: [
      {
        id: "l1",
        timestamp: "2024-06-15T09:00:00Z",
        level: "info",
        message: "Development deployment initiated",
        correlationId: "corr-006",
        source: "deployment-controller",
      },
      {
        id: "l2",
        timestamp: "2024-06-15T09:02:15Z",
        level: "info",
        message: "Development deployment completed",
        correlationId: "corr-006",
        source: "health-checker",
      },
    ],
  },
  {
    id: "deploy-2024-007",
    environment: "production",
    service: "Audit Log Service",
    version: "v1.8.2",
    previousVersion: "v1.8.1",
    status: "pending",
    initiatedBy: "CI/CD Pipeline",
    initiatedByType: "cicd",
    startedAt: "2024-06-15T12:00:00Z",
    approvalStatus: "pending",
    tags: ["maintenance", "security"],
    stages: [
      { id: "s1", name: "Pre-deployment Validation", status: "pending" },
      { id: "s2", name: "Database Migration", status: "pending" },
      { id: "s3", name: "Blue-Green Switch", status: "pending" },
      { id: "s4", name: "Health Verification", status: "pending" },
    ],
    logs: [
      {
        id: "l1",
        timestamp: "2024-06-15T12:00:00Z",
        level: "info",
        message: "Deployment scheduled for Audit Log Service v1.8.2",
        correlationId: "corr-007",
        source: "scheduler",
      },
      {
        id: "l2",
        timestamp: "2024-06-15T12:00:00Z",
        level: "info",
        message: "Awaiting approval from infrastructure team",
        correlationId: "corr-007",
        source: "approval-workflow",
      },
    ],
  },
];

const complianceChecks: ComplianceCheck[] = [
  {
    id: "comp-001",
    name: "SOC 2 Type II",
    status: "compliant",
    description: "Deployment audit trails and change management",
    lastChecked: "2024-06-15T08:00:00Z",
    framework: "SOC 2",
  },
  {
    id: "comp-002",
    name: "ISO 27001",
    status: "compliant",
    description: "Access controls and segregation of duties",
    lastChecked: "2024-06-15T08:00:00Z",
    framework: "ISO 27001",
  },
  {
    id: "comp-003",
    name: "GDPR Article 32",
    status: "warning",
    description: "Data encryption in transit during deployments",
    lastChecked: "2024-06-14T16:00:00Z",
    framework: "GDPR",
  },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function PlanBadge({ plan }: { plan: PlanTier }) {
  const config = {
    enterprise: {
      label: "Enterprise",
      color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    },
    pro: {
      label: "Pro",
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    },
    free: {
      label: "Free",
      color: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    },
  };
  const { label, color } = config[plan];

  return (
    <Badge className={cn("h-5 px-2 text-[10px] border", color)}>{label}</Badge>
  );
}

function StatusBadge({ status }: { status: DeploymentStatus }) {
  const config = deploymentStatusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      className={cn(
        "h-6 px-2 text-xs font-medium border-0 flex items-center gap-1",
        config.bgColor,
        config.color,
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

function EnvironmentHealthBadge({
  status,
}: {
  status: EnvironmentStatus["status"];
}) {
  const config = healthStatusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      className={cn(
        "h-6 px-2 text-xs font-medium border-0 flex items-center gap-1",
        config.bgColor,
        config.color,
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

function ComplianceBadge({ status }: { status: ComplianceStatus }) {
  const config = {
    compliant: {
      icon: ShieldCheck,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      label: "Compliant",
    },
    warning: {
      icon: AlertTriangle,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      label: "Warning",
    },
    violation: {
      icon: XCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      label: "Violation",
    },
  }[status];
  const Icon = config.icon;

  return (
    <Badge
      className={cn(
        "h-5 px-2 text-[10px] border-0 flex items-center gap-1",
        config.bgColor,
        config.color,
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

function DeploymentDetailDialog({ deployment }: { deployment: Deployment }) {
  const statusConfig = deploymentStatusConfig[deployment.status];
  const envConfig = environmentConfig[deployment.environment];
  const [expandedLogs, setExpandedLogs] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<
    "overview" | "logs" | "audit"
  >("overview");

  const displayedLogs = expandedLogs
    ? deployment.logs
    : deployment.logs.slice(0, 5);

  const completedStages = deployment.stages.filter(
    (s) => s.status === "completed",
  ).length;
  const progressPercent = (completedStages / deployment.stages.length) * 100;

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-secondary">
              <Server className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <DialogTitle className="text-lg">
                {deployment.service}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <span className={envConfig.color}>{envConfig.label}</span>
                <span className="text-muted-foreground">•</span>
                <span className="font-mono text-xs">{deployment.version}</span>
              </DialogDescription>
            </div>
          </div>
          <StatusBadge status={deployment.status} />
        </div>
      </DialogHeader>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border mt-4">
        {(["overview", "logs", "audit"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 text-sm font-medium capitalize transition-colors",
              activeTab === tab
                ? "text-foreground border-b-2 border-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-6 mt-4">
        {activeTab === "overview" && (
          <>
            {/* Overview Grid */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Status
                </span>
                <div className="flex items-center gap-2">
                  {React.createElement(statusConfig.icon, {
                    className: cn("h-4 w-4", statusConfig.color),
                  })}
                  <span
                    className={cn("text-sm font-medium", statusConfig.color)}
                  >
                    {statusConfig.label}
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Environment
                </span>
                <p className={cn("text-sm font-medium", envConfig.color)}>
                  {envConfig.label}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Duration
                </span>
                <p className="text-sm font-medium text-foreground">
                  {deployment.duration || "In progress"}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Initiated By
                </span>
                <div className="flex items-center gap-2">
                  {deployment.initiatedByType === "admin" ? (
                    <User className="h-3 w-3" />
                  ) : (
                    <RefreshCw className="h-3 w-3" />
                  )}
                  <span className="text-sm font-medium text-foreground truncate">
                    {deployment.initiatedBy}
                  </span>
                </div>
              </div>
            </section>

            {/* Approval Status */}
            {deployment.approvalStatus && (
              <section className="p-4 rounded-lg bg-muted/30 border border-border">
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  Approval Workflow
                </h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        deployment.approvalStatus === "approved"
                          ? "bg-emerald-500/20"
                          : "bg-amber-500/20",
                      )}
                    >
                      {deployment.approvalStatus === "approved" ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium capitalize">
                        {deployment.approvalStatus}
                      </p>
                      {deployment.approvedBy && (
                        <p className="text-xs text-muted-foreground">
                          by {deployment.approvedBy}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Progress */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  Deployment Progress
                </h4>
                <Badge variant="secondary" className="text-[10px]">
                  {completedStages}/{deployment.stages.length} stages
                </Badge>
              </div>
              <Progress value={progressPercent} className="h-2" />
              <div className="space-y-2">
                {deployment.stages.map((stage) => {
                  const stageConfig = {
                    pending: { icon: Clock, color: "text-slate-400" },
                    running: { icon: RefreshCw, color: "text-blue-500" },
                    completed: {
                      icon: CheckCircle2,
                      color: "text-emerald-500",
                    },
                    failed: { icon: XCircle, color: "text-destructive" },
                    skipped: { icon: MoreHorizontal, color: "text-slate-400" },
                  }[stage.status];
                  const StageIcon = stageConfig.icon;

                  return (
                    <div
                      key={stage.id}
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
                      {stage.duration && (
                        <span className="text-xs text-muted-foreground">
                          {stage.duration}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Commit Info */}
            {deployment.commitSha && (
              <section className="p-4 rounded-lg bg-muted/30 border border-border">
                <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <GitCommit className="h-4 w-4 text-muted-foreground" />
                  Source Code
                </h4>
                <div className="flex items-center gap-3">
                  <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                    {deployment.commitSha}
                  </code>
                  <span className="text-sm text-muted-foreground">
                    {deployment.commitMessage}
                  </span>
                </div>
              </section>
            )}
          </>
        )}

        {activeTab === "logs" && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Deployment Logs
              </h4>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px]">
                  {deployment.logs.length} entries
                </Badge>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
              </div>
            </div>
            <div className="bg-muted rounded-md p-4 space-y-2 max-h-96 overflow-y-auto font-mono text-xs">
              {displayedLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3">
                  <span className="shrink-0 text-muted-foreground/70 w-16">
                    {log.timestamp.split("T")[1]?.slice(0, 8) || log.timestamp}
                  </span>
                  <span
                    className={cn(
                      "uppercase text-[10px] font-medium w-12 shrink-0",
                      log.level === "error" && "text-destructive",
                      log.level === "warn" && "text-amber-500",
                      log.level === "info" && "text-blue-500",
                      log.level === "debug" && "text-slate-400",
                    )}
                  >
                    {log.level}
                  </span>
                  <div className="flex-1 space-y-1">
                    <span className="text-foreground">{log.message}</span>
                    {log.correlationId && (
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span>Correlation: {log.correlationId}</span>
                        {log.source && <span>• Source: {log.source}</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {deployment.logs.length > 5 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full h-6 text-xs mt-2"
                  onClick={() => setExpandedLogs(!expandedLogs)}
                >
                  {expandedLogs ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" /> Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" /> Show{" "}
                      {deployment.logs.length - 5} more
                    </>
                  )}
                </Button>
              )}
            </div>
          </section>
        )}

        {activeTab === "audit" && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                Audit Trail
              </h4>
              <Badge variant="secondary" className="text-[10px]">
                SOC 2 Compliant
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="p-3 rounded-md border border-border bg-muted/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Deployment Initiated
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(deployment.startedAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  By: {deployment.initiatedBy}
                </p>
              </div>
              {deployment.approvedBy && (
                <div className="p-3 rounded-md border border-border bg-muted/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Approved</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(deployment.startedAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    By: {deployment.approvedBy}
                  </p>
                </div>
              )}
              {deployment.completedAt && (
                <div className="p-3 rounded-md border border-border bg-muted/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Deployment Completed
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(deployment.completedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Actions */}
        <section className="flex flex-wrap gap-2 pt-4 border-t border-border">
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
              Rollback to {deployment.previousVersion}
            </Button>
          )}
          {deployment.approvalStatus === "pending" && (
            <>
              <Button
                variant="default"
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-destructive/10"
              >
                <XCircle className="h-3 w-3 mr-1" />
                Reject
              </Button>
            </>
          )}
          <Button variant="outline" size="sm">
            <Download className="h-3 w-3 mr-1" />
            Export Logs
          </Button>
        </section>
      </div>
    </DialogContent>
  );
}

function DeploymentCard({ deployment }: { deployment: Deployment }) {
  const envConfig = environmentConfig[deployment.environment];

  return (
    <Card className="border-border bg-card hover:border-border/80 transition-colors group">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-secondary">
                <Server className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">
                  {deployment.service}
                </h3>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="secondary" className="text-[10px]">
                    {deployment.version}
                  </Badge>
                  <span className={cn("font-medium", envConfig.color)}>
                    {envConfig.label}
                  </span>
                </div>
              </div>
            </div>
            <StatusBadge status={deployment.status} />
          </div>

          {deployment.commitMessage && (
            <p className="text-xs text-muted-foreground line-clamp-1">
              {deployment.commitMessage}
            </p>
          )}

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">
                {deployment.duration || "In progress"}
              </span>
              {deployment.approvalStatus === "pending" && (
                <Badge
                  variant="outline"
                  className="text-[10px] text-amber-500 border-amber-500/30"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  Awaiting Approval
                </Badge>
              )}
            </div>
            <span className="text-muted-foreground">
              {new Date(deployment.startedAt).toLocaleDateString()}
            </span>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Eye className="h-3 w-3 mr-1" />
                View Details
              </Button>
            </DialogTrigger>
            <DeploymentDetailDialog deployment={deployment} />
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

function EnvironmentCard({ environment }: { environment: EnvironmentStatus }) {
  const envConfig = environmentConfig[environment.environment];

  return (
    <Card
      className={cn(
        "border-border bg-card transition-colors",
        environment.isProduction && "border-emerald-500/30",
      )}
    >
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-md", envConfig.bgColor)}>
                <Globe className={cn("h-4 w-4", envConfig.color)} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-foreground">
                    {envConfig.label}
                  </h3>
                  {environment.isProduction && (
                    <Badge className="h-4 px-1.5 text-[9px] bg-emerald-500/20 text-emerald-400 border-0">
                      PROD
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {environment.region}
                </p>
              </div>
            </div>
            <EnvironmentHealthBadge status={environment.status} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-2 rounded-md bg-muted/50">
              <p className="text-[10px] text-muted-foreground uppercase">
                Current Version
              </p>
              <p className="text-sm font-medium font-mono">
                {environment.currentVersion}
              </p>
            </div>
            <div className="p-2 rounded-md bg-muted/50">
              <p className="text-[10px] text-muted-foreground uppercase">
                Uptime
              </p>
              <p className="text-sm font-medium">{environment.uptime}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Health Score</span>
              <span
                className={cn(
                  "font-medium",
                  environment.healthScore >= 90
                    ? "text-emerald-500"
                    : environment.healthScore >= 70
                      ? "text-amber-500"
                      : "text-destructive",
                )}
              >
                {environment.healthScore}%
              </span>
            </div>
            <Progress value={environment.healthScore} className="h-1.5" />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {environment.activeServices}/{environment.totalServices} services
              active
            </span>
            <span>
              Last deploy:{" "}
              {new Date(environment.lastDeployment).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function DeploymentsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [envFilter, setEnvFilter] = React.useState<string>("all");

  // Calculated metrics
  const totalDeployments = deploymentsData.length;
  const successfulDeployments = deploymentsData.filter(
    (d) => d.status === "successful",
  ).length;
  const failedDeployments = deploymentsData.filter(
    (d) => d.status === "failed",
  ).length;
  const inProgressDeployments = deploymentsData.filter(
    (d) => d.status === "in_progress",
  ).length;
  const pendingApprovals = deploymentsData.filter(
    (d) => d.approvalStatus === "pending",
  ).length;
  const successRate = Math.round(
    (successfulDeployments /
      (totalDeployments -
        deploymentsData.filter((d) => d.status === "pending").length)) *
      100,
  );

  const avgDeploymentTime = "4m 32s";

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

  const activeDeployments = sortedDeployments.filter(
    (d) => d.status === "in_progress" || d.status === "pending",
  );
  const recentDeployments = sortedDeployments
    .filter((d) => d.status !== "in_progress" && d.status !== "pending")
    .slice(0, 6);

  return (
    <div className="space-y-8 text-foreground">
      {/* =========================================================================
          HEADER SECTION - Context & Plan
          ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-semibold text-card-foreground">
              Identity Deployment Center
            </h1>
            <PlanBadge plan={organizationContext.plan} />
          </div>
          <p className="text-sm text-muted-foreground">
            Multi-environment deployment orchestration and management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="h-8 px-3 text-xs">
            <Globe className="h-3 w-3 mr-1" />
            {organizationContext.region}
          </Badge>
          <Badge variant="outline" className="h-8 px-3 text-xs">
            <Layers className="h-3 w-3 mr-1" />
            {organizationContext.deploymentStrategy}
          </Badge>
        </div>
      </div>

      {/* Context Overview */}
      <Card className="border-border bg-card overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
            <div className="p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <Building2 className="h-3 w-3" />
                Organization
              </div>
              <p className="text-sm font-medium text-foreground truncate">
                {organizationContext.name}
              </p>
            </div>
            <div className="p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <Layers className="h-3 w-3" />
                Workspace
              </div>
              <p className="text-sm font-medium text-foreground truncate">
                {organizationContext.workspace}
              </p>
            </div>
            <div className="p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <Shield className="h-3 w-3" />
                Access Level
              </div>
              <p className="text-sm font-medium text-foreground">
                {organizationContext.userRole}
              </p>
            </div>
            <div className="p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <Lock className="h-3 w-3" />
                Compliance
              </div>
              <div className="flex items-center gap-2">
                <Badge className="h-5 px-1.5 text-[10px] bg-emerald-500/20 text-emerald-400 border-0">
                  SOC 2
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {organizationContext.retentionDays}d retention
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* =========================================================================
          SECTION 1: DEPLOYMENT METRICS (KPIs)
          ========================================================================= */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Deployment Metrics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <MetricCard
            title="Total Deployments"
            value={totalDeployments}
            subtitle="Last 30 days"
            icon={BarChart3}
            trend={{ value: 12, isPositive: true }}
          />
          <MetricCard
            title="Success Rate"
            value={`${successRate}%`}
            subtitle="Target: 99.5%"
            icon={CheckCircle}
            variant={successRate >= 95 ? "accent" : "warning"}
          />
          <MetricCard
            title="Avg Duration"
            value={avgDeploymentTime}
            subtitle="Blue-green strategy"
            icon={Clock}
            trend={{ value: 8, isPositive: true }}
          />
          <MetricCard
            title="In Progress"
            value={inProgressDeployments}
            subtitle="Active deployments"
            icon={RefreshCw}
            variant={inProgressDeployments > 0 ? "accent" : "default"}
          />
          <MetricCard
            title="Failed"
            value={failedDeployments}
            subtitle="Require attention"
            icon={XCircle}
            variant={failedDeployments > 0 ? "destructive" : "default"}
          />
          <MetricCard
            title="Pending Approval"
            value={pendingApprovals}
            subtitle="Awaiting review"
            icon={Clock}
            variant={pendingApprovals > 0 ? "warning" : "default"}
          />
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: ENVIRONMENT STATUS
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Environment Health
          </h2>
          <Button variant="ghost" size="sm" className="h-8 text-xs">
            <Settings className="h-3 w-3 mr-1" />
            Configure
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {environmentsData.map((env) => (
            <EnvironmentCard key={env.environment} environment={env} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: ACTIVE DEPLOYMENTS
          ========================================================================= */}
      {activeDeployments.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Active Deployments
            </h2>
            <Badge variant="secondary" className="h-5 text-[10px]">
              {activeDeployments.length}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeDeployments.map((deployment) => (
              <DeploymentCard key={deployment.id} deployment={deployment} />
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 4: DEPLOYMENT HISTORY
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Deployment History
          </h2>
          <div className="flex items-center gap-2">
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
              <option value="failed">Failed</option>
              <option value="rolled_back">Rolled Back</option>
            </select>
            <select
              value={envFilter}
              onChange={(e) => setEnvFilter(e.target.value)}
              className="h-8 px-2 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="all">All Environments</option>
              <option value="production">Production</option>
              <option value="staging">Staging</option>
              <option value="development">Development</option>
            </select>
          </div>
        </div>

        <Card className="border-border bg-card">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {recentDeployments.map((deployment) => (
                <DeploymentCard key={deployment.id} deployment={deployment} />
              ))}
            </div>
            {recentDeployments.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  No deployments found matching your filters.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* =========================================================================
          SECTION 5: COMPLIANCE & GOVERNANCE
          ========================================================================= */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Compliance & Governance
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Compliance Status */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                Compliance Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {complianceChecks.map((check) => (
                <div
                  key={check.id}
                  className="flex items-start justify-between p-3 rounded-md bg-muted/30"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {check.name}
                      </span>
                      <ComplianceBadge status={check.status} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {check.description}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Last checked:{" "}
                      {new Date(check.lastChecked).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* RBAC & Permissions */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                Access Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-md bg-muted/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    RBAC Enabled
                  </span>
                  <Badge className="h-5 px-1.5 text-[10px] bg-emerald-500/20 text-emerald-400 border-0">
                    Active
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Role-based access control enforced
                </p>
              </div>
              <div className="p-3 rounded-md bg-muted/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Approval Required
                  </span>
                  <Badge className="h-5 px-1.5 text-[10px] bg-emerald-500/20 text-emerald-400 border-0">
                    Enabled
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Production deployments require approval
                </p>
              </div>
              <div className="p-3 rounded-md bg-muted/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Audit Logging
                  </span>
                  <Badge className="h-5 px-1.5 text-[10px] bg-emerald-500/20 text-emerald-400 border-0">
                    {organizationContext.retentionDays} days
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Full audit trail retention
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4 text-muted-foreground" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start h-10 text-sm"
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                New Deployment
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-10 text-sm"
              >
                <History className="h-4 w-4 mr-2" />
                View Audit Logs
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-10 text-sm"
              >
                <Database className="h-4 w-4 mr-2" />
                Manage Environments
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-10 text-sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: INFORMATION & DOCS
          ========================================================================= */}
      <Card className="border-border bg-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            Deployment Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            The Deployment Center provides enterprise-grade orchestration for
            multi-environment releases. All deployments follow your
            organization&apos;s compliance requirements with full audit trails,
            approval workflows, and automated rollback capabilities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-2">
              <p className="font-medium text-foreground">
                Enterprise Features:
              </p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Blue-green deployment strategy</li>
                <li>Automated health verification</li>
                <li>Correlation ID tracking</li>
                <li>Multi-region deployment support</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground">
                Security & Compliance:
              </p>
              <ul className="space-y-1 list-disc list-inside">
                <li>SOC 2 Type II audit trails</li>
                <li>Approval workflows for production</li>
                <li>Encrypted log transmission</li>
                <li>90-day retention policy</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground">Plan Limitations:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Unlimited deployments (Enterprise)</li>
                <li>4 environments included</li>
                <li>Advanced RBAC enabled</li>
                <li>Priority support access</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
