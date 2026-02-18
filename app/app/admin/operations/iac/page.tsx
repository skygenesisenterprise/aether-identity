"use client";

import * as React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
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
import { MetricCard } from "@/components/dashboard/metric-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/dashboard/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/dashboard/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dashboard/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/dashboard/ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/dashboard/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/dashboard/ui/tooltip";
import { Switch } from "@/components/dashboard/ui/switch";
import { Label } from "@/components/dashboard/ui/label";
import { Input } from "@/components/dashboard/ui/input";
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Cloud,
  Code,
  Database,
  Download,
  ExternalLink,
  FileCode,
  Globe,
  History,
  Info,
  LayoutGrid,
  Layers,
  Loader2,
  Play,
  RefreshCw,
  RotateCcw,
  Server,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  TrendingUp,
  TrendingDown,
  Activity,
  Building2,
  ArrowRight,
  Eye,
  MoreHorizontal,
  Zap,
  Box,
  Container,
  Cpu,
  HardDrive,
  Network,
  Lock,
  Unlock,
  Copy,
} from "lucide-react";

// ============================================================================
// TYPES - Infrastructure as Code Management
// ============================================================================

type DeploymentMode = "saas_cloud" | "self_hosted" | "hybrid";
type PlanTier = "community" | "pro" | "enterprise";
type EnvironmentType = "production" | "staging" | "development";
type IaCStatus =
  | "in_sync"
  | "drift_detected"
  | "deployment_failed"
  | "not_configured";
type DeploymentStatus =
  | "success"
  | "failed"
  | "in_progress"
  | "pending"
  | "cancelled";
type DriftSeverity = "none" | "low" | "medium" | "high" | "critical";
type ProviderType =
  | "terraform"
  | "pulumi"
  | "cloudformation"
  | "ansible"
  | "custom";
type TriggerType = "manual" | "git_push" | "api" | "scheduled" | "webhook";
type ResourceType =
  | "compute"
  | "storage"
  | "network"
  | "security"
  | "database"
  | "identity";

interface OrganizationContext {
  id: string;
  name: string;
  plan: PlanTier;
  environment: EnvironmentType;
  region: string;
  deploymentMode: DeploymentMode;
}

interface IaCOverview {
  status: IaCStatus;
  lastDeployment: {
    id: string;
    status: DeploymentStatus;
    timestamp: string;
    environment: EnvironmentType;
  } | null;
  activeEnvironment: EnvironmentType;
  driftStatus: {
    severity: DriftSeverity;
    resourcesAffected: number;
    lastScan: string;
  };
  managedResources: {
    total: number;
    byType: Record<ResourceType, number>;
  };
  deploymentFrequency: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

interface EnvironmentState {
  name: EnvironmentType;
  deploymentStatus: DeploymentStatus;
  lastApply: string;
  managedResources: number;
  driftStatus: {
    detected: boolean;
    severity: DriftSeverity;
    resourcesOutOfSync: number;
  };
  terraformVersion: string;
  stateLock: boolean;
  lockedBy?: string;
  lockedAt?: string;
}

interface DeploymentRecord {
  id: string;
  environment: EnvironmentType;
  trigger: TriggerType;
  author: string;
  status: DeploymentStatus;
  startedAt: string;
  completedAt?: string;
  duration: number;
  commitHash: string;
  commitMessage: string;
  branch: string;
  resourcesChanged: {
    added: number;
    modified: number;
    destroyed: number;
  };
}

interface DriftDetection {
  id: string;
  resourceName: string;
  resourceType: ResourceType;
  environment: EnvironmentType;
  severity: DriftSeverity;
  detectedAt: string;
  expectedState: string;
  actualState: string;
  remediation: string;
  acknowledged: boolean;
}

interface GitIntegration {
  provider: "github" | "gitlab" | "bitbucket" | "azure_devops" | "none";
  repository: string;
  branch: string;
  webhookStatus: "active" | "inactive" | "error";
  lastSyncAt: string;
  autoApply: boolean;
  pullRequestRequired: boolean;
  approvalsRequired: number;
}

interface ProviderConfig {
  type: ProviderType;
  version: string;
  status: "connected" | "disconnected" | "error";
  workspaces: string[];
  lastRunAt: string;
}

interface ComplianceCheck {
  id: string;
  name: string;
  category: "security" | "cost" | "governance" | "performance";
  status: "pass" | "fail" | "warning";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  resourcesAffected: number;
}

// ============================================================================
// MOCK DATA - IaC Context
// ============================================================================

const orgContext: OrganizationContext = {
  id: "org_2vPqN7xYz",
  name: "Acme Corporation",
  plan: "enterprise",
  environment: "production",
  region: "us-east-1",
  deploymentMode: "saas_cloud",
};

const iacOverview: IaCOverview = {
  status: "in_sync",
  lastDeployment: {
    id: "dep-20260212-001",
    status: "success",
    timestamp: "2026-02-12T14:30:00Z",
    environment: "production",
  },
  activeEnvironment: "production",
  driftStatus: {
    severity: "none",
    resourcesAffected: 0,
    lastScan: "2026-02-12T15:00:00Z",
  },
  managedResources: {
    total: 247,
    byType: {
      compute: 42,
      storage: 18,
      network: 35,
      security: 67,
      database: 28,
      identity: 57,
    },
  },
  deploymentFrequency: {
    daily: 8,
    weekly: 45,
    monthly: 186,
  },
};

const environments: EnvironmentState[] = [
  {
    name: "production",
    deploymentStatus: "success",
    lastApply: "2026-02-12T14:30:00Z",
    managedResources: 156,
    driftStatus: {
      detected: false,
      severity: "none",
      resourcesOutOfSync: 0,
    },
    terraformVersion: "1.9.0",
    stateLock: false,
  },
  {
    name: "staging",
    deploymentStatus: "success",
    lastApply: "2026-02-12T12:15:00Z",
    managedResources: 89,
    driftStatus: {
      detected: false,
      severity: "none",
      resourcesOutOfSync: 0,
    },
    terraformVersion: "1.9.0",
    stateLock: false,
  },
  {
    name: "development",
    deploymentStatus: "in_progress",
    lastApply: "2026-02-12T15:45:00Z",
    managedResources: 67,
    driftStatus: {
      detected: true,
      severity: "low",
      resourcesOutOfSync: 3,
    },
    terraformVersion: "1.9.0",
    stateLock: true,
    lockedBy: "devops@acme.com",
    lockedAt: "2026-02-12T15:45:00Z",
  },
];

const deploymentHistory: DeploymentRecord[] = [
  {
    id: "dep-20260212-001",
    environment: "production",
    trigger: "git_push",
    author: "sarah.chen@acme.com",
    status: "success",
    startedAt: "2026-02-12T14:28:00Z",
    completedAt: "2026-02-12T14:30:00Z",
    duration: 120,
    commitHash: "a1b2c3d",
    commitMessage: "feat: Update security group rules for API gateway",
    branch: "main",
    resourcesChanged: { added: 2, modified: 5, destroyed: 0 },
  },
  {
    id: "dep-20260212-002",
    environment: "staging",
    trigger: "git_push",
    author: "mike.rodriguez@acme.com",
    status: "success",
    startedAt: "2026-02-12T12:12:00Z",
    completedAt: "2026-02-12T12:15:00Z",
    duration: 180,
    commitHash: "e4f5g6h",
    commitMessage: "fix: Correct RDS instance sizing",
    branch: "main",
    resourcesChanged: { added: 0, modified: 1, destroyed: 0 },
  },
  {
    id: "dep-20260212-003",
    environment: "development",
    trigger: "manual",
    author: "alex.kumar@acme.com",
    status: "in_progress",
    startedAt: "2026-02-12T15:45:00Z",
    duration: 0,
    commitHash: "i7j8k9l",
    commitMessage: "feat: Add new microservice infrastructure",
    branch: "feature/auth-service",
    resourcesChanged: { added: 12, modified: 3, destroyed: 0 },
  },
  {
    id: "dep-20260211-001",
    environment: "production",
    trigger: "scheduled",
    author: "system",
    status: "success",
    startedAt: "2026-02-11T02:00:00Z",
    completedAt: "2026-02-11T02:08:00Z",
    duration: 480,
    commitHash: "m0n1o2p",
    commitMessage: "chore: Automated security patches",
    branch: "main",
    resourcesChanged: { added: 0, modified: 8, destroyed: 0 },
  },
  {
    id: "dep-20260211-002",
    environment: "staging",
    trigger: "api",
    author: "ci-cd@acme.com",
    status: "failed",
    startedAt: "2026-02-11T16:30:00Z",
    completedAt: "2026-02-11T16:35:00Z",
    duration: 300,
    commitHash: "q3r4s5t",
    commitMessage: "feat: Implement new caching layer",
    branch: "main",
    resourcesChanged: { added: 4, modified: 0, destroyed: 0 },
  },
  {
    id: "dep-20260210-001",
    environment: "production",
    trigger: "git_push",
    author: "jessica.wong@acme.com",
    status: "success",
    startedAt: "2026-02-10T11:20:00Z",
    completedAt: "2026-02-10T11:28:00Z",
    duration: 480,
    commitHash: "u6v7w8x",
    commitMessage: "feat: Scale worker pool for high traffic",
    branch: "main",
    resourcesChanged: { added: 3, modified: 2, destroyed: 0 },
  },
];

const driftDetections: DriftDetection[] = [
  {
    id: "drift-001",
    resourceName: "aws_security_group.dev_api",
    resourceType: "security",
    environment: "development",
    severity: "low",
    detectedAt: "2026-02-12T15:00:00Z",
    expectedState: "Inbound: 443, 80 from 10.0.0.0/8",
    actualState: "Inbound: 443, 80, 22 from 0.0.0.0/0",
    remediation: "Remove port 22 inbound rule",
    acknowledged: false,
  },
  {
    id: "drift-002",
    resourceName: "aws_instance.dev_worker_01",
    resourceType: "compute",
    environment: "development",
    severity: "low",
    detectedAt: "2026-02-12T15:00:00Z",
    expectedState: "Instance type: t3.medium",
    actualState: "Instance type: t3.large",
    remediation: "Scale down instance or update Terraform",
    acknowledged: false,
  },
  {
    id: "drift-003",
    resourceName: "aws_s3_bucket.dev_logs",
    resourceType: "storage",
    environment: "development",
    severity: "medium",
    detectedAt: "2026-02-12T15:00:00Z",
    expectedState: "Encryption: AES256",
    actualState: "Encryption: None",
    remediation: "Enable server-side encryption",
    acknowledged: false,
  },
];

const gitIntegration: GitIntegration = {
  provider: "github",
  repository: "acme-corp/infrastructure",
  branch: "main",
  webhookStatus: "active",
  lastSyncAt: "2026-02-12T14:30:00Z",
  autoApply: true,
  pullRequestRequired: true,
  approvalsRequired: 2,
};

const providerConfig: ProviderConfig = {
  type: "terraform",
  version: "1.9.0",
  status: "connected",
  workspaces: ["prod", "staging", "dev"],
  lastRunAt: "2026-02-12T14:30:00Z",
};

const complianceChecks: ComplianceCheck[] = [
  {
    id: "comp-001",
    name: "Encryption at Rest",
    category: "security",
    status: "pass",
    severity: "high",
    message: "All storage resources have encryption enabled",
    resourcesAffected: 0,
  },
  {
    id: "comp-002",
    name: "Public Access Prevention",
    category: "security",
    status: "pass",
    severity: "critical",
    message: "No resources exposed to public internet without justification",
    resourcesAffected: 0,
  },
  {
    id: "comp-003",
    name: "Cost Optimization",
    category: "cost",
    status: "warning",
    severity: "medium",
    message: "3 development instances running outside business hours",
    resourcesAffected: 3,
  },
  {
    id: "comp-004",
    name: "Tagging Compliance",
    category: "governance",
    status: "fail",
    severity: "medium",
    message: "12 resources missing required tags (Environment, Owner)",
    resourcesAffected: 12,
  },
  {
    id: "comp-005",
    name: "Backup Retention",
    category: "governance",
    status: "pass",
    severity: "high",
    message: "All databases have backup policies configured",
    resourcesAffected: 0,
  },
];

// ============================================================================
// STATUS CONFIGURATIONS
// ============================================================================

const iacStatusConfig: Record<
  IaCStatus,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    borderColor: string;
    description: string;
  }
> = {
  in_sync: {
    label: "In Sync",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    description: "All environments match desired state",
  },
  drift_detected: {
    label: "Drift Detected",
    icon: AlertTriangle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    description: "Configuration drift detected in some resources",
  },
  deployment_failed: {
    label: "Deployment Failed",
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/20",
    description: "Recent deployment failed - requires attention",
  },
  not_configured: {
    label: "Not Configured",
    icon: Settings,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    borderColor: "border-border",
    description: "IaC has not been configured for this organization",
  },
};

const deploymentStatusConfig: Record<
  DeploymentStatus,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
  }
> = {
  success: {
    label: "Success",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  in_progress: {
    label: "In Progress",
    icon: Loader2,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
  },
};

const driftSeverityConfig: Record<
  DriftSeverity,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
  }
> = {
  none: {
    label: "None",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  low: {
    label: "Low",
    icon: Info,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  medium: {
    label: "Medium",
    icon: AlertTriangle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  high: {
    label: "High",
    icon: AlertCircle,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  critical: {
    label: "Critical",
    icon: ShieldAlert,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
};

const triggerConfig: Record<
  TriggerType,
  {
    label: string;
    icon: React.ElementType;
    color: string;
  }
> = {
  manual: {
    label: "Manual",
    icon: Play,
    color: "text-purple-500",
  },
  git_push: {
    label: "Git Push",
    icon: GitCommit,
    color: "text-blue-500",
  },
  api: {
    label: "API",
    icon: Globe,
    color: "text-cyan-500",
  },
  scheduled: {
    label: "Scheduled",
    icon: Clock,
    color: "text-emerald-500",
  },
  webhook: {
    label: "Webhook",
    icon: Zap,
    color: "text-amber-500",
  },
};

const complianceCategoryConfig: Record<
  ComplianceCheck["category"],
  {
    label: string;
    icon: React.ElementType;
    color: string;
  }
> = {
  security: {
    label: "Security",
    icon: Shield,
    color: "text-emerald-500",
  },
  cost: {
    label: "Cost",
    icon: TrendingDown,
    color: "text-blue-500",
  },
  governance: {
    label: "Governance",
    icon: Building2,
    color: "text-purple-500",
  },
  performance: {
    label: "Performance",
    icon: Zap,
    color: "text-amber-500",
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  }
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${mins}m`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function StatusBadge({
  status,
  size = "default",
}: {
  status: IaCStatus;
  size?: "sm" | "default" | "lg";
}) {
  const config = iacStatusConfig[status];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    default: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2",
  };

  return (
    <Badge
      className={cn(
        "font-medium border-0 flex items-center gap-1.5",
        config.bgColor,
        config.color,
        sizeClasses[size],
      )}
    >
      <Icon className={cn(size === "lg" ? "h-5 w-5" : "h-4 w-4")} />
      {config.label}
    </Badge>
  );
}

function DeploymentStatusBadge({
  status,
  size = "default",
}: {
  status: DeploymentStatus;
  size?: "sm" | "default";
}) {
  const config = deploymentStatusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "flex items-center gap-1.5",
        config.bgColor,
        config.color,
        size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1",
      )}
    >
      <Icon
        className={cn(
          "h-3.5 w-3.5",
          status === "in_progress" && "animate-spin",
        )}
      />
      {config.label}
    </Badge>
  );
}

function DriftSeverityBadge({ severity }: { severity: DriftSeverity }) {
  const config = driftSeverityConfig[severity];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn("flex items-center gap-1.5", config.bgColor, config.color)}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </Badge>
  );
}

function TriggerBadge({ trigger }: { trigger: TriggerType }) {
  const config = triggerConfig[trigger];
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-1.5 text-xs", config.color)}>
      <Icon className="h-3.5 w-3.5" />
      <span>{config.label}</span>
    </div>
  );
}

function ComplianceStatusBadge({
  status,
}: {
  status: ComplianceCheck["status"];
}) {
  const config = {
    pass: {
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      icon: CheckCircle2,
    },
    fail: {
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      icon: XCircle,
    },
    warning: {
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      icon: AlertTriangle,
    },
  }[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn("flex items-center gap-1.5", config.bgColor, config.color)}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="capitalize">{status}</span>
    </Badge>
  );
}

function CommitHash({ hash }: { hash: string }) {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={copyToClipboard}
            className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {hash}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? "Copied!" : "Click to copy"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function IaCPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDeployment, setSelectedDeployment] =
    useState<DeploymentRecord | null>(null);
  const [showDeploymentDetails, setShowDeploymentDetails] = useState(false);
  const [showRunDialog, setShowRunDialog] = useState(false);
  const [showDriftDialog, setShowDriftDialog] = useState(false);
  const [selectedDrift, setSelectedDrift] = useState<DriftDetection | null>(
    null,
  );
  const [isRunningDeployment, setIsRunningDeployment] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);

  const status = iacOverview.status;
  const statusInfo = iacStatusConfig[status];

  // Calculate metrics
  const activeDrifts = driftDetections.filter((d) => !d.acknowledged);
  const failedDeployments = deploymentHistory.filter(
    (d) => d.status === "failed",
  ).length;
  const inProgressDeployments = deploymentHistory.filter(
    (d) => d.status === "in_progress",
  ).length;

  // Run deployment
  const handleRunDeployment = async () => {
    setIsRunningDeployment(true);
    setDeploymentProgress(0);

    const steps = [
      { message: "Initializing Terraform...", delay: 1000 },
      { message: "Planning infrastructure changes...", delay: 1500 },
      { message: "Validating configuration...", delay: 1000 },
      { message: "Applying changes...", delay: 2000 },
      { message: "Verifying deployment...", delay: 1500 },
    ];

    let progress = 0;
    const stepIncrement = 100 / steps.length;

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, step.delay));
      progress += stepIncrement;
      setDeploymentProgress(Math.min(progress, 95));
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    setDeploymentProgress(100);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRunningDeployment(false);
    setDeploymentProgress(0);
    setShowRunDialog(false);
    toast.success("Deployment completed successfully");
  };

  return (
    <div className="space-y-6 p-6">
      {/* ============================================================================
          HEADER SECTION
          ============================================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-card-foreground">
            Identity Infrastructure as Code
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and audit declarative infrastructure configurations powering
            your Identity instance.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <Building2 className="h-3 w-3 mr-1" />
            {orgContext.name}
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              "text-xs",
              orgContext.deploymentMode === "self_hosted"
                ? "text-purple-500 bg-purple-500/10"
                : "text-blue-500 bg-blue-500/10",
            )}
          >
            {orgContext.deploymentMode === "self_hosted"
              ? "Self-Hosted"
              : "SaaS"}
          </Badge>
          <StatusBadge status={status} size="sm" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export State
        </Button>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          View State
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDriftDialog(true)}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Scan Drift
        </Button>
        <Button
          size="sm"
          className="bg-accent hover:bg-accent/90"
          onClick={() => setShowRunDialog(true)}
          disabled={isRunningDeployment}
        >
          {isRunningDeployment ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Play className="h-4 w-4 mr-2" />
          )}
          {isRunningDeployment ? "Deploying..." : "Run Deployment"}
        </Button>
      </div>

      {/* ============================================================================
          STATUS OVERVIEW BANNER
          ============================================================================ */}
      <Card className={cn("border-l-4", statusInfo.borderColor)}>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={cn("p-3 rounded-lg", statusInfo.bgColor)}>
                <Code className={cn("h-8 w-8", statusInfo.color)} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-lg font-semibold">IaC Status</h2>
                  <StatusBadge status={status} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {statusInfo.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <p
                  className={cn(
                    "text-2xl font-semibold",
                    activeDrifts.length > 0
                      ? "text-amber-500"
                      : "text-emerald-500",
                  )}
                >
                  {activeDrifts.length}
                </p>
                <p className="text-muted-foreground">Active Drifts</p>
              </div>
              <div className="text-center">
                <p
                  className={cn(
                    "text-2xl font-semibold",
                    failedDeployments > 0
                      ? "text-destructive"
                      : "text-emerald-500",
                  )}
                >
                  {failedDeployments}
                </p>
                <p className="text-muted-foreground">Failed (24h)</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold">
                  {iacOverview.managedResources.total}
                </p>
                <p className="text-muted-foreground">Resources</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============================================================================
          KPI CARDS
          ============================================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          title="Last Deployment"
          value={
            iacOverview.lastDeployment
              ? formatRelativeTime(iacOverview.lastDeployment.timestamp)
              : "N/A"
          }
          subtitle={
            iacOverview.lastDeployment
              ? `${iacOverview.lastDeployment.environment}`
              : "No deployments"
          }
          icon={
            iacOverview.lastDeployment?.status === "success"
              ? CheckCircle2
              : iacOverview.lastDeployment?.status === "failed"
                ? XCircle
                : Clock
          }
          variant={
            iacOverview.lastDeployment?.status === "success"
              ? "accent"
              : iacOverview.lastDeployment?.status === "failed"
                ? "destructive"
                : "default"
          }
        />
        <MetricCard
          title="Active Environment"
          value={
            iacOverview.activeEnvironment.charAt(0).toUpperCase() +
            iacOverview.activeEnvironment.slice(1)
          }
          subtitle={
            environments.find((e) => e.name === iacOverview.activeEnvironment)
              ?.terraformVersion || "v1.9.0"
          }
          icon={Layers}
          variant="default"
        />
        <MetricCard
          title="Drift Status"
          value={
            iacOverview.driftStatus.severity === "none"
              ? "No Drift"
              : `${iacOverview.driftStatus.resourcesAffected} Resources`
          }
          subtitle={`Last scan: ${formatRelativeTime(iacOverview.driftStatus.lastScan)}`}
          icon={
            iacOverview.driftStatus.severity === "none"
              ? ShieldCheck
              : AlertTriangle
          }
          variant={
            iacOverview.driftStatus.severity === "none" ? "accent" : "warning"
          }
        />
        <MetricCard
          title="Managed Resources"
          value={iacOverview.managedResources.total.toString()}
          subtitle={`${iacOverview.managedResources.byType.compute} compute, ${iacOverview.managedResources.byType.security} security`}
          icon={Server}
          variant="accent"
        />
        <MetricCard
          title="Last Commit"
          value={deploymentHistory[0]?.commitHash.slice(0, 7) || "N/A"}
          subtitle={
            deploymentHistory[0]?.commitMessage.slice(0, 30) + "..." ||
            "No commits"
          }
          icon={GitCommit}
          variant="default"
        />
        <MetricCard
          title="Deploy Frequency"
          value={iacOverview.deploymentFrequency.daily.toString()}
          subtitle={`${iacOverview.deploymentFrequency.weekly}/week, ${iacOverview.deploymentFrequency.monthly}/month`}
          icon={Activity}
          variant="accent"
        />
      </div>

      {/* ============================================================================
          MAIN CONTENT TABS
          ============================================================================ */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="bg-muted">
          <TabsTrigger value="overview" className="text-xs">
            <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="environments" className="text-xs">
            <Layers className="h-3.5 w-3.5 mr-1.5" />
            Environments
          </TabsTrigger>
          <TabsTrigger value="deployments" className="text-xs">
            <History className="h-3.5 w-3.5 mr-1.5" />
            Deployments
          </TabsTrigger>
          <TabsTrigger value="drift" className="text-xs">
            <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
            Drift Detection
          </TabsTrigger>
          <TabsTrigger value="compliance" className="text-xs">
            <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="integration" className="text-xs">
            <GitBranch className="h-3.5 w-3.5 mr-1.5" />
            Integration
          </TabsTrigger>
        </TabsList>

        {/* ============================================================================
            OVERVIEW TAB
            ============================================================================ */}
        <TabsContent value="overview" className="space-y-6">
          {/* Environment Cards */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Environment Status
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {environments.map((env) => (
                <Card key={env.name} className="border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium capitalize flex items-center gap-2">
                        <Box className="h-4 w-4 text-blue-500" />
                        {env.name}
                      </CardTitle>
                      <DeploymentStatusBadge
                        status={env.deploymentStatus}
                        size="sm"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Last Apply
                        </span>
                        <span className="font-medium">
                          {formatRelativeTime(env.lastApply)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Resources</span>
                        <span className="font-medium">
                          {env.managedResources}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Terraform</span>
                        <span className="font-medium">
                          {env.terraformVersion}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Drift</span>
                        <DriftSeverityBadge
                          severity={env.driftStatus.severity}
                        />
                      </div>
                    </div>
                    {env.stateLock && (
                      <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs">
                        <div className="flex items-center gap-1 text-amber-600">
                          <Lock className="h-3 w-3" />
                          <span className="font-medium">State Locked</span>
                        </div>
                        <p className="text-muted-foreground mt-1">
                          by {env.lockedBy}
                        </p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        View State
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs"
                      >
                        <FileCode className="h-3.5 w-3.5 mr-1" />
                        View Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Recent Deployments */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
                <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Recent Deployments
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("deployments")}
              >
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <Card className="border-border">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Deployment</TableHead>
                      <TableHead>Environment</TableHead>
                      <TableHead>Trigger</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deploymentHistory.slice(0, 5).map((deployment) => (
                      <TableRow key={deployment.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-sm">
                              {deployment.id}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <CommitHash hash={deployment.commitHash} />
                              <span>• {deployment.branch}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {deployment.environment}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <TriggerBadge trigger={deployment.trigger} />
                        </TableCell>
                        <TableCell className="text-sm">
                          {deployment.author}
                        </TableCell>
                        <TableCell>
                          <DeploymentStatusBadge
                            status={deployment.status}
                            size="sm"
                          />
                        </TableCell>
                        <TableCell className="text-sm tabular-nums">
                          {deployment.duration > 0
                            ? formatDuration(deployment.duration)
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedDeployment(deployment);
                              setShowDeploymentDetails(true);
                            }}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>

          {/* Resource Distribution */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Resource Distribution
              </h2>
            </div>
            <Card className="border-border">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                  {Object.entries(iacOverview.managedResources.byType).map(
                    ([type, count]) => {
                      const icons: Record<string, React.ElementType> = {
                        compute: Cpu,
                        storage: HardDrive,
                        network: Network,
                        security: Shield,
                        database: Database,
                        identity: Lock,
                      };
                      const colors: Record<string, string> = {
                        compute: "text-blue-500",
                        storage: "text-cyan-500",
                        network: "text-purple-500",
                        security: "text-emerald-500",
                        database: "text-amber-500",
                        identity: "text-pink-500",
                      };
                      const Icon = icons[type];

                      return (
                        <div key={type} className="text-center">
                          <div
                            className={cn(
                              "p-3 rounded-lg bg-muted inline-block mb-2",
                              colors[type],
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="text-2xl font-semibold">{count}</div>
                          <div className="text-xs text-muted-foreground capitalize">
                            {type}
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        {/* ============================================================================
            ENVIRONMENTS TAB
            ============================================================================ */}
        <TabsContent value="environments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {environments.map((env) => (
              <Card key={env.name} className="border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium capitalize flex items-center gap-2">
                      <Box className="h-5 w-5 text-blue-500" />
                      {env.name}
                    </CardTitle>
                    <DeploymentStatusBadge status={env.deploymentStatus} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted">
                      <p className="text-xs text-muted-foreground">
                        Last Apply
                      </p>
                      <p className="text-sm font-medium">
                        {formatRelativeTime(env.lastApply)}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted">
                      <p className="text-xs text-muted-foreground">Resources</p>
                      <p className="text-sm font-medium">
                        {env.managedResources}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted">
                      <p className="text-xs text-muted-foreground">Terraform</p>
                      <p className="text-sm font-medium">
                        {env.terraformVersion}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted">
                      <p className="text-xs text-muted-foreground">Drift</p>
                      <p className="text-sm font-medium">
                        {env.driftStatus.resourcesOutOfSync} resources
                      </p>
                    </div>
                  </div>

                  {env.stateLock && (
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <div className="flex items-center gap-2 text-amber-600">
                        <Lock className="h-4 w-4" />
                        <span className="font-medium text-sm">
                          State Locked
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        by {env.lockedBy} •{" "}
                        {env.lockedAt && formatRelativeTime(env.lockedAt)}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Quick Actions</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        View State
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        <FileCode className="h-3.5 w-3.5 mr-1" />
                        Plan Changes
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        <Download className="h-3.5 w-3.5 mr-1" />
                        Download State
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        <RefreshCw className="h-3.5 w-3.5 mr-1" />
                        Refresh
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ============================================================================
            DEPLOYMENTS TAB
            ============================================================================ */}
        <TabsContent value="deployments" className="space-y-6">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">
                  Deployment History
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="h-8 w-36 text-xs">
                      <SelectValue placeholder="Environment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Environments</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                      <SelectItem value="staging">Staging</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="h-8 w-36 text-xs">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Deployment ID</TableHead>
                    <TableHead>Environment</TableHead>
                    <TableHead>Trigger</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deploymentHistory.map((deployment) => (
                    <TableRow key={deployment.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm font-mono">
                            {deployment.id}
                          </div>
                          <div className="text-xs text-muted-foreground truncate max-w-50">
                            {deployment.commitMessage}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs capitalize">
                          {deployment.environment}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <TriggerBadge trigger={deployment.trigger} />
                      </TableCell>
                      <TableCell className="text-sm">
                        {deployment.author}
                      </TableCell>
                      <TableCell>
                        <DeploymentStatusBadge
                          status={deployment.status}
                          size="sm"
                        />
                      </TableCell>
                      <TableCell className="text-sm" suppressHydrationWarning>
                        {formatDate(deployment.startedAt)}
                      </TableCell>
                      <TableCell className="text-sm tabular-nums">
                        {deployment.duration > 0
                          ? formatDuration(deployment.duration)
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedDeployment(deployment);
                            setShowDeploymentDetails(true);
                          }}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================================
            DRIFT DETECTION TAB
            ============================================================================ */}
        <TabsContent value="drift" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold">
                      {activeDrifts.length}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Active Drifts
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold">
                      {
                        driftDetections.filter(
                          (d) =>
                            d.severity === "high" || d.severity === "critical",
                        ).length
                      }
                    </p>
                    <p className="text-xs text-muted-foreground">
                      High Severity
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <ShieldAlert className="h-5 w-5 text-destructive" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold">
                      {formatRelativeTime(iacOverview.driftStatus.lastScan)}
                    </p>
                    <p className="text-xs text-muted-foreground">Last Scan</p>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Clock className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold">Auto</p>
                    <p className="text-xs text-muted-foreground">
                      Scan Schedule
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <RefreshCw className="h-5 w-5 text-emerald-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {activeDrifts.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Configuration Drift
                </h2>
              </div>
              <div className="space-y-2">
                {driftDetections.map((drift) => (
                  <Card
                    key={drift.id}
                    className={cn(
                      "border-l-4 transition-colors",
                      drift.severity === "critical" || drift.severity === "high"
                        ? "border-l-destructive"
                        : drift.severity === "medium"
                          ? "border-l-amber-500"
                          : "border-l-blue-500",
                      !drift.acknowledged && "bg-amber-500/5",
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <DriftSeverityBadge severity={drift.severity} />
                            <Badge
                              variant="outline"
                              className="text-xs capitalize"
                            >
                              {drift.environment}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {drift.resourceType}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-sm">
                            {drift.resourceName}
                          </h4>
                          <div className="mt-2 space-y-1 text-xs">
                            <p className="text-muted-foreground">
                              <span className="font-medium text-foreground">
                                Expected:
                              </span>{" "}
                              {drift.expectedState}
                            </p>
                            <p className="text-muted-foreground">
                              <span className="font-medium text-foreground">
                                Actual:
                              </span>{" "}
                              {drift.actualState}
                            </p>
                          </div>
                          <div className="mt-2 p-2 rounded bg-muted text-xs">
                            <span className="font-medium">Remediation:</span>{" "}
                            {drift.remediation}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className="text-xs text-muted-foreground"
                            suppressHydrationWarning
                          >
                            {formatRelativeTime(drift.detectedAt)}
                          </span>
                          {!drift.acknowledged ? (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-7"
                              >
                                Acknowledge
                              </Button>
                              <Button size="sm" className="text-xs h-7">
                                <RotateCcw className="h-3 w-3 mr-1" />
                                Fix
                              </Button>
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Acknowledged
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {activeDrifts.length === 0 && (
            <Card className="border-border border-emerald-500/20">
              <CardContent className="p-8 text-center">
                <div className="p-3 rounded-full bg-emerald-500/10 inline-block mb-4">
                  <ShieldCheck className="h-8 w-8 text-emerald-500" />
                </div>
                <h3 className="text-lg font-medium">No Configuration Drift</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  All resources are in sync with your IaC definitions.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => setShowDriftDialog(true)}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Run Manual Scan
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ============================================================================
            COMPLIANCE TAB
            ============================================================================ */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold text-emerald-500">
                      {
                        complianceChecks.filter((c) => c.status === "pass")
                          .length
                      }
                    </p>
                    <p className="text-xs text-muted-foreground">Passing</p>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold text-amber-500">
                      {
                        complianceChecks.filter((c) => c.status === "warning")
                          .length
                      }
                    </p>
                    <p className="text-xs text-muted-foreground">Warnings</p>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold text-destructive">
                      {
                        complianceChecks.filter((c) => c.status === "fail")
                          .length
                      }
                    </p>
                    <p className="text-xs text-muted-foreground">Failed</p>
                  </div>
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <XCircle className="h-5 w-5 text-destructive" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold">
                      {Math.round(
                        (complianceChecks.filter((c) => c.status === "pass")
                          .length /
                          complianceChecks.length) *
                          100,
                      )}
                      %
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Compliance Score
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <ShieldCheck className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Compliance Checks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Check</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead className="text-right">Resources</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complianceChecks.map((check) => {
                    const category = complianceCategoryConfig[check.category];
                    const CategoryIcon = category.icon;

                    return (
                      <TableRow key={check.id}>
                        <TableCell className="font-medium">
                          {check.name}
                        </TableCell>
                        <TableCell>
                          <div
                            className={cn(
                              "flex items-center gap-1.5 text-xs",
                              category.color,
                            )}
                          >
                            <CategoryIcon className="h-3.5 w-3.5" />
                            {category.label}
                          </div>
                        </TableCell>
                        <TableCell>
                          <ComplianceStatusBadge status={check.status} />
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              check.severity === "critical"
                                ? "text-destructive"
                                : check.severity === "high"
                                  ? "text-orange-500"
                                  : check.severity === "medium"
                                    ? "text-amber-500"
                                    : "text-blue-500",
                            )}
                          >
                            {check.severity.charAt(0).toUpperCase() +
                              check.severity.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm max-w-75 truncate">
                          {check.message}
                        </TableCell>
                        <TableCell className="text-right">
                          {check.resourcesAffected > 0 ? (
                            <Badge variant="secondary" className="text-xs">
                              {check.resourcesAffected} affected
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              —
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================================
            INTEGRATION TAB
            ============================================================================ */}
        <TabsContent value="integration" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Git Integration */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <GitBranch className="h-5 w-5 text-purple-500" />
                  Git Repository
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Provider
                    </span>
                    <div className="flex items-center gap-2">
                      <GithubIcon className="h-4 w-4" />
                      <span className="text-sm font-medium capitalize">
                        {gitIntegration.provider}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Repository
                    </span>
                    <span className="text-sm font-medium">
                      {gitIntegration.repository}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Branch
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {gitIntegration.branch}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Webhook
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        gitIntegration.webhookStatus === "active"
                          ? "text-emerald-500"
                          : gitIntegration.webhookStatus === "error"
                            ? "text-destructive"
                            : "text-muted-foreground",
                      )}
                    >
                      {gitIntegration.webhookStatus === "active" && (
                        <CheckCircle2 className="h-3 w-3 mr-1 inline" />
                      )}
                      {gitIntegration.webhookStatus}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Last Sync
                    </span>
                    <span className="text-sm font-medium">
                      {formatRelativeTime(gitIntegration.lastSyncAt)}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Auto-Apply</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically apply changes on merge
                      </p>
                    </div>
                    <Switch checked={gitIntegration.autoApply} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Require PR</Label>
                      <p className="text-xs text-muted-foreground">
                        Require pull request for changes
                      </p>
                    </div>
                    <Switch checked={gitIntegration.pullRequestRequired} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Required Approvals</Label>
                      <p className="text-xs text-muted-foreground">
                        Minimum approvers for production
                      </p>
                    </div>
                    <span className="text-sm font-medium">
                      {gitIntegration.approvalsRequired}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Provider Configuration */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-amber-500" />
                  Provider Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <div className="p-2 rounded bg-purple-500/10">
                    <Layers className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium capitalize">
                      {providerConfig.type}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Version {providerConfig.version}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "ml-auto",
                      providerConfig.status === "connected"
                        ? "text-emerald-500"
                        : "text-destructive",
                    )}
                  >
                    {providerConfig.status === "connected" ? (
                      <CheckCircle2 className="h-3 w-3 mr-1 inline" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1 inline" />
                    )}
                    {providerConfig.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Workspaces</p>
                  <div className="flex flex-wrap gap-2">
                    {providerConfig.workspaces.map((workspace) => (
                      <Badge
                        key={workspace}
                        variant="secondary"
                        className="text-xs"
                      >
                        {workspace}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Last Run
                    </span>
                    <span className="text-sm font-medium">
                      {formatRelativeTime(providerConfig.lastRunAt)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Webhook Configuration */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Webhook Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted">
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Webhook URL</p>
                  <code className="text-xs bg-background px-2 py-1 rounded">
                    https://api.aether.id/v1/iac/webhooks/github
                  </code>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast.success("Webhook URL copied to clipboard")
                  }
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy URL
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">
                  Supported Events:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>push — Trigger deployment on code push</li>
                  <li>pull_request — Validate changes in PR</li>
                  <li>pull_request_review — Require approvals</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ============================================================================
          DIALOGS
          ============================================================================ */}

      {/* Deployment Details Dialog */}
      <Dialog
        open={showDeploymentDetails}
        onOpenChange={setShowDeploymentDetails}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Deployment Details</DialogTitle>
            <DialogDescription>{selectedDeployment?.id}</DialogDescription>
          </DialogHeader>
          {selectedDeployment && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Environment</p>
                  <Badge variant="outline" className="capitalize">
                    {selectedDeployment.environment}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <DeploymentStatusBadge status={selectedDeployment.status} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Trigger</p>
                  <TriggerBadge trigger={selectedDeployment.trigger} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Author</p>
                  <p className="text-sm font-medium">
                    {selectedDeployment.author}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Started</p>
                  <p className="text-sm font-medium">
                    {formatDate(selectedDeployment.startedAt)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="text-sm font-medium">
                    {selectedDeployment.duration > 0
                      ? formatDuration(selectedDeployment.duration)
                      : "—"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Commit</p>
                <div className="p-3 rounded-lg bg-muted">
                  <div className="flex items-center gap-2 mb-2">
                    <CommitHash hash={selectedDeployment.commitHash} />
                    <Badge variant="outline" className="text-xs">
                      {selectedDeployment.branch}
                    </Badge>
                  </div>
                  <p className="text-sm">{selectedDeployment.commitMessage}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Resources Changed
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 rounded-lg bg-muted text-center">
                    <p className="text-2xl font-semibold text-emerald-500">
                      +{selectedDeployment.resourcesChanged.added}
                    </p>
                    <p className="text-xs text-muted-foreground">Added</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted text-center">
                    <p className="text-2xl font-semibold text-amber-500">
                      ~{selectedDeployment.resourcesChanged.modified}
                    </p>
                    <p className="text-xs text-muted-foreground">Modified</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted text-center">
                    <p className="text-2xl font-semibold text-destructive">
                      -{selectedDeployment.resourcesChanged.destroyed}
                    </p>
                    <p className="text-xs text-muted-foreground">Destroyed</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeploymentDetails(false)}
            >
              Close
            </Button>
            <Button>View Logs</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Run Deployment Dialog */}
      <Dialog open={showRunDialog} onOpenChange={setShowRunDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Run Deployment</DialogTitle>
            <DialogDescription>
              Execute infrastructure changes
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Environment</Label>
              <Select defaultValue="development">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Commit/Branch</Label>
              <Input placeholder="main or commit hash" defaultValue="main" />
            </div>
            <div className="flex items-center gap-2">
              <Switch id="dry-run" />
              <Label htmlFor="dry-run" className="text-sm">
                Dry run (plan only)
              </Label>
            </div>

            {isRunningDeployment && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{deploymentProgress}%</span>
                </div>
                <Progress value={deploymentProgress} className="h-2" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRunDialog(false)}
              disabled={isRunningDeployment}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRunDeployment}
              disabled={isRunningDeployment}
            >
              {isRunningDeployment ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {isRunningDeployment ? "Deploying..." : "Run Deployment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Drift Scan Dialog */}
      <Dialog open={showDriftDialog} onOpenChange={setShowDriftDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan for Configuration Drift</DialogTitle>
            <DialogDescription>
              Compare actual infrastructure state with IaC definitions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Target Environment</Label>
              <Select defaultValue="all">
                <SelectTrigger>
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
            <div className="space-y-2">
              <Label>Resource Types</Label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Compute",
                  "Storage",
                  "Network",
                  "Security",
                  "Database",
                  "Identity",
                ].map((type) => (
                  <Badge
                    key={type}
                    variant="secondary"
                    className="cursor-pointer"
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDriftDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success("Drift scan initiated");
                setShowDriftDialog(false);
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Start Scan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// GitHub Icon Component
function GithubIcon({ className }: { className?: string }) {
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
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}
