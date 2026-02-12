"use client";

import * as React from "react";
import { useState } from "react";
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
import { Switch } from "@/components/dashboard/ui/switch";
import { Input } from "@/components/dashboard/ui/input";
import { Label } from "@/components/dashboard/ui/label";
import { Slider } from "@/components/dashboard/ui/slider";
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
import {
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Cloud,
  Database,
  Download,
  Globe,
  HardDrive,
  History,
  Info,
  LayoutGrid,
  List,
  Loader2,
  MapPin,
  Play,
  RefreshCw,
  RotateCcw,
  Server,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Target,
  Timer,
  TrendingDown,
  TrendingUp,
  Wifi,
  XCircle,
  Zap,
} from "lucide-react";

// ============================================================================
// TYPES - Disaster Recovery Management
// ============================================================================

type DeploymentMode = "saas_cloud" | "self_hosted" | "hybrid";
type PlanTier = "community" | "pro" | "enterprise";
type EnvironmentType = "production" | "staging" | "development";
type DRStatus = "protected" | "at_risk" | "critical" | "not_configured";
type ReplicationMode = "active_passive" | "active_active" | "disabled";
type BackupType = "full" | "incremental" | "differential";
type BackupStatus = "completed" | "in_progress" | "failed" | "pending";
type IntegrityStatus = "verified" | "pending" | "failed" | "unknown";
type AlertSeverity = "critical" | "high" | "medium" | "low";
type TrendDirection = "up" | "down" | "stable";
type RegionStatus = "healthy" | "degraded" | "unavailable";

interface OrganizationContext {
  id: string;
  name: string;
  plan: PlanTier;
  environment: EnvironmentType;
  region: string;
  deploymentMode: DeploymentMode;
}

interface RecoveryObjective {
  rpo: number; // Recovery Point Objective in minutes
  rto: number; // Recovery Time Objective in minutes
  targetRpo: number;
  targetRto: number;
  lastVerifiedAt: string | null;
  complianceStatus: "compliant" | "warning" | "breach";
}

interface ReplicationPolicy {
  mode: ReplicationMode;
  primaryRegion: Region;
  secondaryRegions: Region[];
  syncInterval: number; // in seconds
  lastSyncAt: string | null;
  lag: number; // in seconds
  compressionEnabled: boolean;
  encryptionEnabled: boolean;
}

interface Region {
  id: string;
  name: string;
  location: string;
  status: RegionStatus;
  latency: number; // in ms
  lastHealthCheck: string;
  isPrimary: boolean;
}

interface BackupPoint {
  id: string;
  timestamp: string;
  type: BackupType;
  size: number; // in GB
  region: string;
  integrity: IntegrityStatus;
  retentionUntil: string;
  restorePoints: number;
}

interface DRTest {
  id: string;
  name: string;
  status: "passed" | "failed" | "in_progress" | "scheduled";
  startedAt: string | null;
  completedAt: string | null;
  duration: number | null; // in minutes
  recoveryTime: number | null; // in minutes
  dataLoss: number | null; // in minutes (RPO achieved)
  notes: string;
}

interface DRPolicy {
  automaticFailover: boolean;
  failoverDelay: number; // in minutes
  backupRetentionDays: number;
  snapshotFrequency: number; // in hours
  compressionLevel: "low" | "medium" | "high";
  encryptionAlgorithm: string;
  multiRegionEnabled: boolean;
}

interface RiskIndicator {
  id: string;
  severity: AlertSeverity;
  category: string;
  message: string;
  details: string;
  detectedAt: string;
  acknowledged: boolean;
}

// ============================================================================
// MOCK DATA - Disaster Recovery Context
// ============================================================================

const orgContext: OrganizationContext = {
  id: "org_2vPqN7xYz",
  name: "Acme Corporation",
  plan: "enterprise",
  environment: "production",
  region: "us-east-1",
  deploymentMode: "saas_cloud",
};

const overallStatus: DRStatus = "protected";

const recoveryObjectives: RecoveryObjective = {
  rpo: 5,
  rto: 15,
  targetRpo: 5,
  targetRto: 15,
  lastVerifiedAt: "2026-02-10T14:30:00Z",
  complianceStatus: "compliant",
};

const replicationPolicy: ReplicationPolicy = {
  mode: "active_passive",
  primaryRegion: {
    id: "us-east-1",
    name: "US East (N. Virginia)",
    location: "Virginia, USA",
    status: "healthy",
    latency: 12,
    lastHealthCheck: "2026-02-12T15:00:00Z",
    isPrimary: true,
  },
  secondaryRegions: [
    {
      id: "eu-west-1",
      name: "EU West (Ireland)",
      location: "Dublin, Ireland",
      status: "healthy",
      latency: 89,
      lastHealthCheck: "2026-02-12T15:00:00Z",
      isPrimary: false,
    },
    {
      id: "ap-southeast-1",
      name: "Asia Pacific (Singapore)",
      location: "Singapore",
      status: "healthy",
      latency: 156,
      lastHealthCheck: "2026-02-12T15:00:00Z",
      isPrimary: false,
    },
  ],
  syncInterval: 300,
  lastSyncAt: "2026-02-12T14:59:45Z",
  lag: 15,
  compressionEnabled: true,
  encryptionEnabled: true,
};

const backupPoints: BackupPoint[] = [
  {
    id: "bkp-20260212-150000",
    timestamp: "2026-02-12T15:00:00Z",
    type: "full",
    size: 54.2,
    region: "us-east-1",
    integrity: "verified",
    retentionUntil: "2026-05-13T15:00:00Z",
    restorePoints: 1,
  },
  {
    id: "bkp-20260212-140000",
    timestamp: "2026-02-12T14:00:00Z",
    type: "incremental",
    size: 2.8,
    region: "us-east-1",
    integrity: "verified",
    retentionUntil: "2026-02-19T14:00:00Z",
    restorePoints: 13,
  },
  {
    id: "bkp-20260212-130000",
    timestamp: "2026-02-12T13:00:00Z",
    type: "incremental",
    size: 3.1,
    region: "us-east-1",
    integrity: "verified",
    retentionUntil: "2026-02-19T13:00:00Z",
    restorePoints: 12,
  },
  {
    id: "bkp-20260212-120000",
    timestamp: "2026-02-12T12:00:00Z",
    type: "incremental",
    size: 2.9,
    region: "us-east-1",
    integrity: "verified",
    retentionUntil: "2026-02-19T12:00:00Z",
    restorePoints: 11,
  },
  {
    id: "bkp-20260212-110000",
    timestamp: "2026-02-12T11:00:00Z",
    type: "differential",
    size: 18.5,
    region: "eu-west-1",
    integrity: "verified",
    retentionUntil: "2026-02-19T11:00:00Z",
    restorePoints: 10,
  },
  {
    id: "bkp-20260211-150000",
    timestamp: "2026-02-11T15:00:00Z",
    type: "full",
    size: 53.8,
    region: "eu-west-1",
    integrity: "verified",
    retentionUntil: "2026-05-12T15:00:00Z",
    restorePoints: 24,
  },
];

const drTests: DRTest[] = [
  {
    id: "test-20260210",
    name: "Monthly DR Validation",
    status: "passed",
    startedAt: "2026-02-10T02:00:00Z",
    completedAt: "2026-02-10T02:14:32Z",
    duration: 14.5,
    recoveryTime: 8.2,
    dataLoss: 2,
    notes: "All recovery objectives met. Failover completed successfully.",
  },
  {
    id: "test-20260113",
    name: "Quarterly Full DR Test",
    status: "passed",
    startedAt: "2026-01-13T02:00:00Z",
    completedAt: "2026-01-13T02:12:18Z",
    duration: 12.3,
    recoveryTime: 7.5,
    dataLoss: 3,
    notes: "Cross-region failover validated. RTO achieved within SLA.",
  },
  {
    id: "test-20251210",
    name: "Monthly DR Validation",
    status: "passed",
    startedAt: "2025-12-10T02:00:00Z",
    completedAt: "2025-12-10T02:16:45Z",
    duration: 16.75,
    recoveryTime: 9.1,
    dataLoss: 4,
    notes: "Slight delay in database recovery. Within acceptable range.",
  },
];

const drPolicy: DRPolicy = {
  automaticFailover: true,
  failoverDelay: 5,
  backupRetentionDays: 90,
  snapshotFrequency: 1,
  compressionLevel: "high",
  encryptionAlgorithm: "AES-256-GCM",
  multiRegionEnabled: true,
};

const riskIndicators: RiskIndicator[] = [
  {
    id: "risk-001",
    severity: "high",
    category: "Replication Lag",
    message: "Replication lag exceeded 30 seconds",
    details:
      "Current lag: 45 seconds. Check network connectivity to eu-west-1.",
    detectedAt: "2026-02-12T14:45:00Z",
    acknowledged: false,
  },
  {
    id: "risk-002",
    severity: "medium",
    category: "DR Testing",
    message: "Last DR test performed 32 days ago",
    details: "Recommended frequency: Monthly. Next test scheduled for Feb 13.",
    detectedAt: "2026-02-12T10:00:00Z",
    acknowledged: true,
  },
  {
    id: "risk-003",
    severity: "low",
    category: "Backup Verification",
    message: "Incremental backup verification pending",
    details: "Integrity check queued for next maintenance window.",
    detectedAt: "2026-02-12T08:00:00Z",
    acknowledged: true,
  },
];

// ============================================================================
// STATUS CONFIGURATIONS
// ============================================================================

const statusConfig: Record<
  DRStatus,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    borderColor: string;
    description: string;
  }
> = {
  protected: {
    label: "Protected",
    icon: ShieldCheck,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    description: "All DR objectives met and systems operational",
  },
  at_risk: {
    label: "At Risk",
    icon: AlertTriangle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    description: "Some DR components require attention",
  },
  critical: {
    label: "Critical",
    icon: Siren,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/20",
    description: "Immediate action required - DR capability compromised",
  },
  not_configured: {
    label: "Not Configured",
    icon: Shield,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    borderColor: "border-border",
    description: "DR has not been configured for this organization",
  },
};

const alertSeverityConfig: Record<
  AlertSeverity,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  critical: {
    label: "Critical",
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-l-destructive",
  },
  high: {
    label: "High",
    icon: AlertCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-l-red-500",
  },
  medium: {
    label: "Medium",
    icon: AlertTriangle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-l-amber-500",
  },
  low: {
    label: "Low",
    icon: Info,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-l-blue-500",
  },
};

const regionStatusConfig: Record<
  RegionStatus,
  {
    label: string;
    color: string;
    bgColor: string;
  }
> = {
  healthy: {
    label: "Healthy",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500",
  },
  degraded: {
    label: "Degraded",
    color: "text-amber-500",
    bgColor: "bg-amber-500",
  },
  unavailable: {
    label: "Unavailable",
    color: "text-destructive",
    bgColor: "bg-destructive",
  },
};

const backupTypeConfig: Record<
  BackupType,
  {
    label: string;
    color: string;
    bgColor: string;
  }
> = {
  full: {
    label: "Full",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  incremental: {
    label: "Incremental",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  differential: {
    label: "Differential",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
};

const integrityConfig: Record<
  IntegrityStatus,
  {
    label: string;
    icon: React.ElementType;
    color: string;
  }
> = {
  verified: {
    label: "Verified",
    icon: CheckCircle2,
    color: "text-emerald-500",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-amber-500",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    color: "text-destructive",
  },
  unknown: {
    label: "Unknown",
    icon: HelpCircle,
    color: "text-muted-foreground",
  },
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function HelpCircle({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" x2="12.01" y1="17" y2="17" />
    </svg>
  );
}

function StatusBadge({
  status,
  size = "default",
}: {
  status: DRStatus;
  size?: "sm" | "default" | "lg";
}) {
  const config = statusConfig[status];
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

function AlertSeverityBadge({ severity }: { severity: AlertSeverity }) {
  const config = alertSeverityConfig[severity];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border-0 flex items-center gap-1",
        config.bgColor,
        config.color,
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

function RegionStatusIndicator({ status }: { status: RegionStatus }) {
  const config = regionStatusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <div className={cn("h-2 w-2 rounded-full", config.bgColor)} />
      <span className={cn("text-sm font-medium", config.color)}>
        {config.label}
      </span>
    </div>
  );
}

function BackupTypeBadge({ type }: { type: BackupType }) {
  const config = backupTypeConfig[type];

  return (
    <Badge
      variant="outline"
      className={cn("text-xs", config.bgColor, config.color)}
    >
      {config.label}
    </Badge>
  );
}

function IntegrityBadge({ integrity }: { integrity: IntegrityStatus }) {
  const config = integrityConfig[integrity];
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-1.5 text-xs", config.color)}>
      <Icon className="h-3.5 w-3.5" />
      <span>{config.label}</span>
    </div>
  );
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
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
// MAIN PAGE COMPONENT
// ============================================================================

export default function DisasterRecoveryPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showFailoverDialog, setShowFailoverDialog] = useState(false);
  const [showTestDialog, setShowTestDialog] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupPoint | null>(
    null,
  );
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [showPolicyDialog, setShowPolicyDialog] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isTestingFailover, setIsTestingFailover] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [testSteps, setTestSteps] = useState<string[]>([]);
  const [isInitiatingFailover, setIsInitiatingFailover] = useState(false);
  const [failoverStep, setFailoverStep] = useState(0);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const status = overallStatus;
  const statusInfo = statusConfig[status];
  const activeAlerts = riskIndicators.filter((r) => !r.acknowledged);

  // Calculate derived metrics
  const lastBackup = backupPoints[0];
  const lastTest = drTests[0];
  const daysSinceTest = lastTest?.completedAt
    ? Math.floor(
        (new Date().getTime() - new Date(lastTest.completedAt).getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  // Determine features based on deployment mode and plan
  const isEnterprise = orgContext.plan === "enterprise";
  const isCloud = orgContext.deploymentMode === "saas_cloud";
  const isSelfHosted = orgContext.deploymentMode === "self_hosted";

  // Export DR Report
  const handleExportReport = async () => {
    setIsExporting(true);

    // Generate report data
    const report = {
      generatedAt: new Date().toISOString(),
      organization: orgContext,
      status: overallStatus,
      recoveryObjectives,
      replicationPolicy: {
        ...replicationPolicy,
        primaryRegion: {
          ...replicationPolicy.primaryRegion,
          lastHealthCheck: replicationPolicy.primaryRegion.lastHealthCheck,
        },
        secondaryRegions: replicationPolicy.secondaryRegions.map((r) => ({
          ...r,
          lastHealthCheck: r.lastHealthCheck,
        })),
      },
      recentBackups: backupPoints.slice(0, 10),
      recentTests: drTests.slice(0, 5),
      activeRisks: riskIndicators.filter((r) => !r.acknowledged),
      policy: drPolicy,
    };

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Create and download file
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dr-report-${orgContext.name.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsExporting(false);
    setNotification({
      message: "DR Report exported successfully",
      type: "success",
    });
    setTimeout(() => setNotification(null), 3000);
  };

  // Run Test Failover
  const handleRunTest = async (targetRegion: string, testType: string) => {
    setIsTestingFailover(true);
    setTestProgress(0);
    setTestSteps(["Initializing test environment..."]);

    const steps = [
      { message: "Verifying backup integrity...", delay: 1500 },
      { message: `Preparing ${targetRegion} for test...`, delay: 2000 },
      { message: "Simulating failover scenario...", delay: 2500 },
      { message: "Validating data consistency...", delay: 2000 },
      { message: "Testing recovery procedures...", delay: 2000 },
      { message: "Measuring RTO/RPO metrics...", delay: 1500 },
      { message: "Cleaning up test environment...", delay: 1500 },
    ];

    let progress = 0;
    const stepIncrement = 100 / (steps.length + 1);

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, step.delay));
      progress += stepIncrement;
      setTestProgress(Math.min(progress, 95));
      setTestSteps((prev) => [...prev, step.message]);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setTestProgress(100);
    setTestSteps((prev) => [...prev, "Test completed successfully!"]);

    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsTestingFailover(false);
    setTestProgress(0);
    setTestSteps([]);
    setShowTestDialog(false);
    setNotification({
      message: `DR Test completed on ${targetRegion}`,
      type: "success",
    });
    setTimeout(() => setNotification(null), 3000);
  };

  // Initiate Production Failover
  const handleInitiateFailover = async (targetRegion: string) => {
    setIsInitiatingFailover(true);
    setFailoverStep(1);

    const steps = [
      { step: 2, message: "Pre-failover health checks...", delay: 2000 },
      { step: 3, message: "Notifying stakeholders...", delay: 1500 },
      { step: 4, message: "Synchronizing final data...", delay: 3000 },
      { step: 5, message: `Activating ${targetRegion}...`, delay: 2500 },
      { step: 6, message: "Updating DNS records...", delay: 2000 },
      { step: 7, message: "Validating service health...", delay: 2000 },
      { step: 8, message: "Failover complete!", delay: 1000 },
    ];

    for (const { step, message, delay } of steps) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      setFailoverStep(step);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsInitiatingFailover(false);
    setFailoverStep(0);
    setShowFailoverDialog(false);
    setNotification({
      message: `Failover to ${targetRegion} completed successfully`,
      type: "success",
    });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="space-y-6 p-6">
      {/* ============================================================================
          HEADER SECTION
          ============================================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-card-foreground">
            Identity Disaster Recovery
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ensure business continuity through replication policies, recovery
            objectives and failover orchestration.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportReport}
          disabled={isExporting}
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          {isExporting ? "Exporting..." : "Export DR Report"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveTab("policy")}
        >
          <Settings className="h-4 w-4 mr-2" />
          Configure Policies
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowTestDialog(true)}
          disabled={isTestingFailover}
        >
          {isTestingFailover ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Play className="h-4 w-4 mr-2" />
          )}
          {isTestingFailover ? "Testing..." : "Test Failover"}
        </Button>
        <Button
          size="sm"
          className="bg-accent hover:bg-accent/90"
          onClick={() => setShowFailoverDialog(true)}
          disabled={isInitiatingFailover}
        >
          {isInitiatingFailover ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Zap className="h-4 w-4 mr-2" />
          )}
          {isInitiatingFailover ? "Initiating..." : "Initiate Failover"}
        </Button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={cn(
            "fixed bottom-4 right-4 p-4 rounded-lg shadow-lg border z-50 animate-in slide-in-from-bottom-2",
            notification.type === "success" &&
              "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
            notification.type === "error" &&
              "bg-destructive/10 border-destructive/20 text-destructive",
            notification.type === "info" &&
              "bg-blue-500/10 border-blue-500/20 text-blue-500",
          )}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" && (
              <CheckCircle2 className="h-4 w-4" />
            )}
            {notification.type === "error" && <XCircle className="h-4 w-4" />}
            {notification.type === "info" && <Info className="h-4 w-4" />}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* ============================================================================
          STATUS OVERVIEW BANNER
          ============================================================================ */}
      <Card className={cn("border-l-4", statusInfo.borderColor)}>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={cn("p-3 rounded-lg", statusInfo.bgColor)}>
                <Shield className={cn("h-8 w-8", statusInfo.color)} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-lg font-semibold">DR Status</h2>
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
                    activeAlerts.length > 0
                      ? "text-amber-500"
                      : "text-emerald-500",
                  )}
                >
                  {activeAlerts.length}
                </p>
                <p className="text-muted-foreground">Active Risks</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold">
                  {recoveryObjectives.rpo}m
                </p>
                <p className="text-muted-foreground">Current RPO</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold">
                  {recoveryObjectives.rto}m
                </p>
                <p className="text-muted-foreground">Current RTO</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============================================================================
          KPI CARDS - GLOBAL RESILIENCE OVERVIEW
          ============================================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Recovery Point Objective"
          value={`${recoveryObjectives.rpo} minutes`}
          subtitle={`Target: ${recoveryObjectives.targetRpo}m`}
          icon={Clock}
          variant={
            recoveryObjectives.rpo <= recoveryObjectives.targetRpo
              ? "accent"
              : "warning"
          }
          trend={
            recoveryObjectives.rpo <= recoveryObjectives.targetRpo
              ? { value: 0, isPositive: true }
              : undefined
          }
        />
        <MetricCard
          title="Recovery Time Objective"
          value={`${recoveryObjectives.rto} minutes`}
          subtitle={`Target: ${recoveryObjectives.targetRto}m`}
          icon={Timer}
          variant={
            recoveryObjectives.rto <= recoveryObjectives.targetRto
              ? "accent"
              : "warning"
          }
        />
        <MetricCard
          title="Last Backup"
          value={lastBackup ? formatRelativeTime(lastBackup.timestamp) : "N/A"}
          subtitle={
            lastBackup
              ? `${lastBackup.size} GB ${lastBackup.type}`
              : "No backups"
          }
          icon={Database}
          variant="accent"
        />
        <MetricCard
          title="Replication Lag"
          value={`${replicationPolicy.lag}s`}
          subtitle={`Sync every ${replicationPolicy.syncInterval / 60}m`}
          icon={RefreshCw}
          variant={replicationPolicy.lag < 30 ? "default" : "warning"}
          trend={
            replicationPolicy.lag > 30
              ? { value: replicationPolicy.lag, isPositive: false }
              : undefined
          }
        />
        <MetricCard
          title="Last DR Test"
          value={daysSinceTest !== null ? `${daysSinceTest} days ago` : "Never"}
          subtitle={
            lastTest?.status === "passed" ? "Test passed" : "Test required"
          }
          icon={CheckCircle2}
          variant={
            daysSinceTest !== null && daysSinceTest <= 30 ? "accent" : "warning"
          }
        />
        <MetricCard
          title="Multi-Region Status"
          value={drPolicy.multiRegionEnabled ? "Active" : "Disabled"}
          subtitle={`${replicationPolicy.secondaryRegions.length} secondary regions`}
          icon={Globe}
          variant={drPolicy.multiRegionEnabled ? "accent" : "default"}
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
          <TabsTrigger value="replication" className="text-xs">
            <Globe className="h-3.5 w-3.5 mr-1.5" />
            Replication
          </TabsTrigger>
          <TabsTrigger value="backups" className="text-xs">
            <Database className="h-3.5 w-3.5 mr-1.5" />
            Backups
          </TabsTrigger>
          <TabsTrigger value="testing" className="text-xs">
            <Target className="h-3.5 w-3.5 mr-1.5" />
            DR Testing
          </TabsTrigger>
          <TabsTrigger value="policy" className="text-xs">
            <Settings className="h-3.5 w-3.5 mr-1.5" />
            Policy
          </TabsTrigger>
          <TabsTrigger value="risks" className="text-xs">
            <ShieldAlert className="h-3.5 w-3.5 mr-1.5" />
            Risks
          </TabsTrigger>
        </TabsList>

        {/* ============================================================================
            OVERVIEW TAB
            ============================================================================ */}
        <TabsContent value="overview" className="space-y-6">
          {/* Replication Summary */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Replication Topology
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Primary Region */}
              <Card className="border-border border-l-4 border-l-emerald-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-500" />
                      Primary Region
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="text-xs bg-emerald-500/10 text-emerald-500"
                    >
                      Primary
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-lg font-semibold">
                      {replicationPolicy.primaryRegion.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {replicationPolicy.primaryRegion.location}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <RegionStatusIndicator
                        status={replicationPolicy.primaryRegion.status}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Latency</span>
                      <span className="font-medium">
                        {replicationPolicy.primaryRegion.latency}ms
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Check</span>
                      <span className="font-medium">
                        {formatRelativeTime(
                          replicationPolicy.primaryRegion.lastHealthCheck,
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Secondary Regions */}
              {replicationPolicy.secondaryRegions.map((region) => (
                <Card key={region.id} className="border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Globe className="h-4 w-4 text-blue-500" />
                        Secondary Region
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        Replica
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-lg font-semibold">{region.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {region.location}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Status</span>
                        <RegionStatusIndicator status={region.status} />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Latency</span>
                        <span className="font-medium">{region.latency}ms</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Sync Lag</span>
                        <span
                          className={cn(
                            "font-medium",
                            replicationPolicy.lag > 30
                              ? "text-amber-500"
                              : "text-emerald-500",
                          )}
                        >
                          {replicationPolicy.lag}s
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Recent Backups */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
                <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Recent Backup Points
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("backups")}
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
                      <TableHead>Backup ID</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead className="text-right">Size</TableHead>
                      <TableHead>Integrity</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {backupPoints.slice(0, 5).map((backup) => (
                      <TableRow key={backup.id}>
                        <TableCell className="font-mono text-xs">
                          {backup.id}
                        </TableCell>
                        <TableCell suppressHydrationWarning>
                          {formatDate(backup.timestamp)}
                        </TableCell>
                        <TableCell>
                          <BackupTypeBadge type={backup.type} />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {backup.region}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {backup.size} GB
                        </TableCell>
                        <TableCell>
                          <IntegrityBadge integrity={backup.integrity} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedBackup(backup);
                              setShowRestoreDialog(true);
                            }}
                          >
                            <RotateCcw className="h-3.5 w-3.5 mr-1" />
                            Restore
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>

          {/* Active Risks */}
          {activeAlerts.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Active Risk Indicators
                </h2>
              </div>
              <div className="space-y-2">
                {activeAlerts.map((risk) => (
                  <Card
                    key={risk.id}
                    className={cn(
                      "border-l-4 transition-colors",
                      alertSeverityConfig[risk.severity].borderColor,
                      "bg-amber-500/5",
                    )}
                  >
                    <CardContent className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertSeverityBadge severity={risk.severity} />
                        <div>
                          <p className="text-sm font-medium">{risk.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {risk.category} • Detected{" "}
                            {formatRelativeTime(risk.detectedAt)}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Acknowledge
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </TabsContent>

        {/* ============================================================================
            REPLICATION TAB
            ============================================================================ */}
        <TabsContent value="replication" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Replication Mode */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Replication Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Mode</span>
                  <Badge variant="outline" className="text-xs capitalize">
                    {replicationPolicy.mode.replace("_", "-")}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Sync Interval
                  </span>
                  <span className="font-medium">
                    {replicationPolicy.syncInterval / 60} minutes
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Compression
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      replicationPolicy.compressionEnabled
                        ? "text-emerald-500"
                        : "text-muted-foreground",
                    )}
                  >
                    {replicationPolicy.compressionEnabled
                      ? "Enabled"
                      : "Disabled"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Encryption
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      replicationPolicy.encryptionEnabled
                        ? "text-emerald-500"
                        : "text-muted-foreground",
                    )}
                  >
                    {replicationPolicy.encryptionEnabled
                      ? "Enabled"
                      : "Disabled"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Last Sync
                  </span>
                  <span className="font-medium">
                    {replicationPolicy.lastSyncAt
                      ? formatRelativeTime(replicationPolicy.lastSyncAt)
                      : "Never"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Sync Status */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Synchronization Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Lag</span>
                    <span
                      className={cn(
                        "font-medium",
                        replicationPolicy.lag > 30
                          ? "text-amber-500"
                          : "text-emerald-500",
                      )}
                    >
                      {replicationPolicy.lag} seconds
                    </span>
                  </div>
                  <Progress
                    value={Math.min((replicationPolicy.lag / 60) * 100, 100)}
                    className="h-2"
                  />
                </div>
                <div className="pt-4 border-t border-border space-y-3">
                  {replicationPolicy.secondaryRegions.map((region) => (
                    <div
                      key={region.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full",
                            region.status === "healthy"
                              ? "bg-emerald-500"
                              : region.status === "degraded"
                                ? "bg-amber-500"
                                : "bg-destructive",
                          )}
                        />
                        <span className="text-sm">{region.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {region.latency}ms
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Failover Actions */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Failover Operations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span className="font-medium">Test Failover</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Simulate a failover to validate DR procedures without
                    affecting production.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowTestDialog(true)}
                  >
                    Run Test
                  </Button>
                </div>
                <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20 space-y-3">
                  <div className="flex items-center gap-2">
                    <Siren className="h-4 w-4 text-destructive" />
                    <span className="font-medium text-destructive">
                      Production Failover
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Initiate an actual failover to a secondary region. Use only
                    during emergencies.
                  </p>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setShowFailoverDialog(true)}
                  >
                    Initiate Failover
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Region Details Table */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Region Health Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Region</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Latency</TableHead>
                    <TableHead>Last Health Check</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      {replicationPolicy.primaryRegion.name}
                    </TableCell>
                    <TableCell>
                      {replicationPolicy.primaryRegion.location}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-xs bg-emerald-500/10 text-emerald-500"
                      >
                        Primary
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <RegionStatusIndicator
                        status={replicationPolicy.primaryRegion.status}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      {replicationPolicy.primaryRegion.latency}ms
                    </TableCell>
                    <TableCell suppressHydrationWarning>
                      {formatRelativeTime(
                        replicationPolicy.primaryRegion.lastHealthCheck,
                      )}
                    </TableCell>
                  </TableRow>
                  {replicationPolicy.secondaryRegions.map((region) => (
                    <TableRow key={region.id}>
                      <TableCell className="font-medium">
                        {region.name}
                      </TableCell>
                      <TableCell>{region.location}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          Secondary
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <RegionStatusIndicator status={region.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        {region.latency}ms
                      </TableCell>
                      <TableCell suppressHydrationWarning>
                        {formatRelativeTime(region.lastHealthCheck)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================================
            BACKUPS TAB
            ============================================================================ */}
        <TabsContent value="backups" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Backups
                    </p>
                    <p className="text-2xl font-semibold">
                      {backupPoints.length}
                    </p>
                  </div>
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Database className="h-5 w-5 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Size</p>
                    <p className="text-2xl font-semibold">
                      {backupPoints
                        .reduce((acc, b) => acc + b.size, 0)
                        .toFixed(1)}{" "}
                      GB
                    </p>
                  </div>
                  <div className="p-2 bg-cyan-500/10 rounded-lg">
                    <HardDrive className="h-5 w-5 text-cyan-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Retention</p>
                    <p className="text-2xl font-semibold">
                      {drPolicy.backupRetentionDays} days
                    </p>
                  </div>
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-amber-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">
                  Backup History
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="full">Full</SelectItem>
                      <SelectItem value="incremental">Incremental</SelectItem>
                      <SelectItem value="differential">Differential</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Backup ID</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead className="text-right">Size</TableHead>
                    <TableHead>Integrity</TableHead>
                    <TableHead className="text-right">Restore Points</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {backupPoints.map((backup) => (
                    <TableRow key={backup.id}>
                      <TableCell className="font-mono text-xs">
                        {backup.id}
                      </TableCell>
                      <TableCell suppressHydrationWarning>
                        {formatDate(backup.timestamp)}
                      </TableCell>
                      <TableCell>
                        <BackupTypeBadge type={backup.type} />
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {backup.region}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {backup.size} GB
                      </TableCell>
                      <TableCell>
                        <IntegrityBadge integrity={backup.integrity} />
                      </TableCell>
                      <TableCell className="text-right">
                        {backup.restorePoints}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                            Validate
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedBackup(backup);
                              setShowRestoreDialog(true);
                            }}
                          >
                            <RotateCcw className="h-3.5 w-3.5 mr-1" />
                            Restore
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Restore Simulation */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Restore Simulation
              </CardTitle>
              <CardDescription>
                Simulate a restore operation to validate backup integrity and
                estimate recovery time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm">Target Backup</Label>
                    <Select defaultValue={backupPoints[0]?.id}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select backup" />
                      </SelectTrigger>
                      <SelectContent>
                        {backupPoints.map((backup) => (
                          <SelectItem key={backup.id} value={backup.id}>
                            {backup.id} ({formatDate(backup.timestamp)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm">Target Region</Label>
                    <Select defaultValue="us-east-1">
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us-east-1">
                          US East (N. Virginia)
                        </SelectItem>
                        <SelectItem value="eu-west-1">
                          EU West (Ireland)
                        </SelectItem>
                        <SelectItem value="ap-southeast-1">
                          Asia Pacific (Singapore)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                  <h4 className="font-medium">Estimated Recovery</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Estimated Time
                      </span>
                      <span className="font-medium">~12 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Data Loss</span>
                      <span className="font-medium text-emerald-500">
                        0 minutes (full backup)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Integrity</span>
                      <span className="font-medium text-emerald-500">
                        Verified
                      </span>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Run Simulation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================================
            TESTING TAB
            ============================================================================ */}
        <TabsContent value="testing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Last Test Summary */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Last DR Test
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {lastTest ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "p-2 rounded-lg",
                          lastTest.status === "passed"
                            ? "bg-emerald-500/10"
                            : "bg-destructive/10",
                        )}
                      >
                        {lastTest.status === "passed" ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{lastTest.name}</p>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs mt-1",
                            lastTest.status === "passed"
                              ? "text-emerald-500"
                              : "text-destructive",
                          )}
                        >
                          {lastTest.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2 pt-4 border-t border-border">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Recovery Time
                        </span>
                        <span className="font-medium">
                          {lastTest.recoveryTime} minutes
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Data Loss (RPO)
                        </span>
                        <span className="font-medium">
                          {lastTest.dataLoss} minutes
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Test Duration
                        </span>
                        <span className="font-medium">
                          {lastTest.duration} minutes
                        </span>
                      </div>
                    </div>
                    {lastTest.notes && (
                      <p className="text-sm text-muted-foreground pt-2">
                        {lastTest.notes}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No DR tests have been performed yet.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* RTO/RPO Compliance */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Recovery Objectives
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">RTO Target</span>
                      <span className="font-medium">
                        {recoveryObjectives.targetRto} minutes
                      </span>
                    </div>
                    <Progress
                      value={
                        (recoveryObjectives.rto /
                          recoveryObjectives.targetRto) *
                        100
                      }
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Current: {recoveryObjectives.rto} minutes
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">RPO Target</span>
                      <span className="font-medium">
                        {recoveryObjectives.targetRpo} minutes
                      </span>
                    </div>
                    <Progress
                      value={
                        (recoveryObjectives.rpo /
                          recoveryObjectives.targetRpo) *
                        100
                      }
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Current: {recoveryObjectives.rpo} minutes
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    {recoveryObjectives.complianceStatus === "compliant" ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm text-emerald-500 font-medium">
                          Objectives Met
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span className="text-sm text-amber-500 font-medium">
                          Objectives At Risk
                        </span>
                      </>
                    )}
                  </div>
                  {recoveryObjectives.lastVerifiedAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Last verified:{" "}
                      {formatDate(recoveryObjectives.lastVerifiedAt)}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Schedule Test */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Schedule DR Test
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Regular DR testing ensures your recovery procedures work when
                  needed. Recommended frequency: Monthly.
                </p>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm">Test Type</Label>
                    <Select defaultValue="partial">
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select test type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="partial">
                          Partial Failover (Read-only)
                        </SelectItem>
                        <SelectItem value="full">
                          Full Failover (Production)
                        </SelectItem>
                        <SelectItem value="validation">
                          Backup Validation Only
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Test History */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base font-medium">
                DR Test History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Test ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead className="text-right">Duration</TableHead>
                    <TableHead className="text-right">Recovery Time</TableHead>
                    <TableHead className="text-right">Data Loss</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drTests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-mono text-xs">
                        {test.id}
                      </TableCell>
                      <TableCell className="font-medium">{test.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            test.status === "passed"
                              ? "text-emerald-500"
                              : test.status === "failed"
                                ? "text-destructive"
                                : test.status === "in_progress"
                                  ? "text-blue-500"
                                  : "text-amber-500",
                          )}
                        >
                          {test.status.replace("_", " ").toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell suppressHydrationWarning>
                        {test.startedAt ? formatDate(test.startedAt) : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        {test.duration ? `${test.duration} min` : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        {test.recoveryTime ? `${test.recoveryTime} min` : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        {test.dataLoss !== null ? `${test.dataLoss} min` : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================================
            POLICY TAB
            ============================================================================ */}
        <TabsContent value="policy" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* DR Policy Configuration */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Recovery Objectives
                </CardTitle>
                <CardDescription>
                  Define your target recovery time and point objectives.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>RTO Target (minutes)</Label>
                      <span className="text-sm font-medium">
                        {recoveryObjectives.targetRto} minutes
                      </span>
                    </div>
                    <Slider
                      defaultValue={[recoveryObjectives.targetRto]}
                      min={5}
                      max={120}
                      step={5}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Maximum acceptable downtime
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>RPO Target (minutes)</Label>
                      <span className="text-sm font-medium">
                        {recoveryObjectives.targetRpo} minutes
                      </span>
                    </div>
                    <Slider
                      defaultValue={[recoveryObjectives.targetRpo]}
                      min={1}
                      max={60}
                      step={1}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Maximum acceptable data loss
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Failover Settings */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Failover Configuration
                </CardTitle>
                <CardDescription>
                  Configure automatic failover behavior and delays.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Automatic Failover</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically failover when primary region fails
                    </p>
                  </div>
                  <Switch checked={drPolicy.automaticFailover} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-sm">Failover Delay</Label>
                    <span className="text-sm font-medium">
                      {drPolicy.failoverDelay} minutes
                    </span>
                  </div>
                  <Slider
                    defaultValue={[drPolicy.failoverDelay]}
                    min={0}
                    max={30}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Wait time before initiating failover
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Multi-Region Replication</Label>
                    <p className="text-xs text-muted-foreground">
                      Enable replication to multiple secondary regions
                    </p>
                  </div>
                  <Switch checked={drPolicy.multiRegionEnabled} />
                </div>
              </CardContent>
            </Card>

            {/* Backup Policy */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Backup Policy
                </CardTitle>
                <CardDescription>
                  Configure backup retention and scheduling.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-sm">Retention Period</Label>
                    <span className="text-sm font-medium">
                      {drPolicy.backupRetentionDays} days
                    </span>
                  </div>
                  <Slider
                    defaultValue={[drPolicy.backupRetentionDays]}
                    min={7}
                    max={365}
                    step={7}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Snapshot Frequency</Label>
                  <Select defaultValue={`${drPolicy.snapshotFrequency}`}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Every hour</SelectItem>
                      <SelectItem value="6">Every 6 hours</SelectItem>
                      <SelectItem value="12">Every 12 hours</SelectItem>
                      <SelectItem value="24">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Compression Level</Label>
                  <Select defaultValue={drPolicy.compressionLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select compression" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (Faster)</SelectItem>
                      <SelectItem value="medium">Medium (Balanced)</SelectItem>
                      <SelectItem value="high">High (Smaller)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Security & Encryption
                </CardTitle>
                <CardDescription>
                  Configure encryption settings for backups and replication.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Encryption at Rest</Label>
                    <p className="text-xs text-muted-foreground">
                      Encrypt all backup data
                    </p>
                  </div>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Encryption in Transit</Label>
                    <p className="text-xs text-muted-foreground">
                      Encrypt replication traffic
                    </p>
                  </div>
                  <Switch checked={replicationPolicy.encryptionEnabled} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Encryption Algorithm</Label>
                  <Input
                    value={drPolicy.encryptionAlgorithm}
                    readOnly
                    className="font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline">Reset to Defaults</Button>
            <Button>Save Changes</Button>
          </div>
        </TabsContent>

        {/* ============================================================================
            RISKS TAB
            ============================================================================ */}
        <TabsContent value="risks" className="space-y-6">
          {/* Risk Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Critical</p>
                    <p className="text-2xl font-semibold text-destructive">
                      {
                        riskIndicators.filter(
                          (r) => r.severity === "critical" && !r.acknowledged,
                        ).length
                      }
                    </p>
                  </div>
                  <div className="p-2 bg-destructive/10 rounded-lg">
                    <ShieldAlert className="h-5 w-5 text-destructive" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">High</p>
                    <p className="text-2xl font-semibold text-red-500">
                      {
                        riskIndicators.filter(
                          (r) => r.severity === "high" && !r.acknowledged,
                        ).length
                      }
                    </p>
                  </div>
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Medium</p>
                    <p className="text-2xl font-semibold text-amber-500">
                      {
                        riskIndicators.filter(
                          (r) => r.severity === "medium" && !r.acknowledged,
                        ).length
                      }
                    </p>
                  </div>
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Low</p>
                    <p className="text-2xl font-semibold text-blue-500">
                      {
                        riskIndicators.filter(
                          (r) => r.severity === "low" && !r.acknowledged,
                        ).length
                      }
                    </p>
                  </div>
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Info className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Indicators List */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Risk & Compliance Indicators
              </h2>
            </div>
            <div className="space-y-2">
              {riskIndicators.map((risk) => (
                <Card
                  key={risk.id}
                  className={cn(
                    "border-l-4 transition-colors",
                    alertSeverityConfig[risk.severity].borderColor,
                    !risk.acknowledged && "bg-amber-500/5",
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <AlertSeverityBadge severity={risk.severity} />
                        <div>
                          <p className="text-sm font-medium">{risk.message}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {risk.details}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {risk.category} • Detected{" "}
                            {formatRelativeTime(risk.detectedAt)}
                          </p>
                        </div>
                      </div>
                      {!risk.acknowledged ? (
                        <Button size="sm" variant="outline">
                          Acknowledge
                        </Button>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          Acknowledged
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Compliance Checklist */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base font-medium">
                DR Compliance Checklist
              </CardTitle>
              <CardDescription>
                Key indicators for maintaining DR readiness.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span className="text-sm">
                      Backup completed in last 24 hours
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs text-emerald-500">
                    PASS
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span className="text-sm">
                      Replication lag under 1 minute
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs text-emerald-500">
                    PASS
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <span className="text-sm">
                      DR test performed in last 30 days
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs text-amber-500">
                    WARNING
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span className="text-sm">
                      Multi-region replication enabled
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs text-emerald-500">
                    PASS
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span className="text-sm">RTO/RPO objectives defined</span>
                  </div>
                  <Badge variant="outline" className="text-xs text-emerald-500">
                    PASS
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ============================================================================
          DIALOGS
          ============================================================================ */}

      {/* Failover Dialog */}
      <Dialog open={showFailoverDialog} onOpenChange={setShowFailoverDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Siren className="h-5 w-5 text-destructive" />
              Initiate Failover
            </DialogTitle>
            <DialogDescription>
              This will initiate a production failover to a secondary region.
              Only proceed during actual emergencies.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
              <h4 className="font-medium text-destructive mb-2">
                Emergency Failover Checklist
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Primary region is confirmed unavailable</li>
                <li>• Secondary regions are healthy</li>
                <li>• All stakeholders have been notified</li>
                <li>• Rollback plan is prepared</li>
              </ul>
            </div>
            <div>
              <Label>Target Region</Label>
              <Select defaultValue="eu-west-1">
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select target region" />
                </SelectTrigger>
                <SelectContent>
                  {replicationPolicy.secondaryRegions.map((region) => (
                    <SelectItem key={region.id} value={region.id}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowFailoverDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive">Confirm Failover</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Dialog */}
      <Dialog open={showTestDialog} onOpenChange={setShowTestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Test Failover
            </DialogTitle>
            <DialogDescription>
              Run a DR test to validate your recovery procedures without
              affecting production traffic.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Test Type</Label>
              <Select defaultValue="partial">
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="partial">
                    Partial Failover (Read-only validation)
                  </SelectItem>
                  <SelectItem value="full">
                    Full Failover (Complete validation)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Target Region</Label>
              <Select defaultValue="eu-west-1">
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select target region" />
                </SelectTrigger>
                <SelectContent>
                  {replicationPolicy.secondaryRegions.map((region) => (
                    <SelectItem key={region.id} value={region.id}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTestDialog(false)}>
              Cancel
            </Button>
            <Button>Start Test</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Dialog */}
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-blue-500" />
              Restore from Backup
            </DialogTitle>
            <DialogDescription>
              Restore your system to a previous backup point.
            </DialogDescription>
          </DialogHeader>
          {selectedBackup && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Backup ID</span>
                  <span className="font-medium font-mono">
                    {selectedBackup.id}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Timestamp</span>
                  <span className="font-medium">
                    {formatDate(selectedBackup.timestamp)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Size</span>
                  <span className="font-medium">{selectedBackup.size} GB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Region</span>
                  <span className="font-medium">{selectedBackup.region}</span>
                </div>
              </div>
              <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                <h4 className="font-medium text-amber-500 mb-2">Warning</h4>
                <p className="text-sm text-muted-foreground">
                  This will replace current data with the backup. Any changes
                  made after the backup timestamp will be lost.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRestoreDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive">Confirm Restore</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
