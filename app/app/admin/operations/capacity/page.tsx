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
import { MetricCard } from "@/components/dashboard/metric-card";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/dashboard/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/dashboard/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/dashboard/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dashboard/ui/dialog";
import { Switch } from "@/components/dashboard/ui/switch";
import { Label } from "@/components/dashboard/ui/label";
import { Slider } from "@/components/dashboard/ui/slider";
import { ChartContainer, ChartTooltip } from "@/components/dashboard/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bell,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Cpu,
  Download,
  Gauge,
  HardDrive,
  History,
  Info,
  LayoutGrid,
  Layers,
  LineChart as LineChartIcon,
  MemoryStick,
  Network,
  Scale,
  Server,
  Settings,
  Shield,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  XCircle,
  Zap,
} from "lucide-react";

// ============================================================================
// TYPES - Enterprise Capacity Management
// ============================================================================

type CapacityStatus = "healthy" | "under_pressure" | "critical";
type DeploymentMode = "saas_cloud" | "self_hosted" | "hybrid";
type PlanTier = "free" | "pro" | "enterprise";
type EnvironmentType = "production" | "staging" | "development";
type ResourceType = "cpu" | "memory" | "storage" | "network";
type AlertSeverity = "critical" | "high" | "medium" | "low";
type TrendDirection = "up" | "down" | "stable";

interface OrganizationContext {
  id: string;
  name: string;
  plan: PlanTier;
  environment: EnvironmentType;
  region: string;
  deploymentMode: DeploymentMode;
}

interface ResourceMetrics {
  current: number;
  peak: number;
  average: number;
  limit: number;
  unit: string;
  trend: TrendDirection;
  growthRate: number;
}

interface ResourceUtilization {
  type: ResourceType;
  status: CapacityStatus;
  metrics: ResourceMetrics;
  history: { timestamp: string; value: number }[];
  projections: { timestamp: string; value: number; predicted: boolean }[];
}

interface CapacityAlert {
  id: string;
  severity: AlertSeverity;
  resource: ResourceType;
  message: string;
  threshold: number;
  currentValue: number;
  triggeredAt: string;
  acknowledged: boolean;
  autoResolve: boolean;
}

interface CapacityQuota {
  resource: ResourceType;
  current: number;
  limit: number;
  unit: string;
  planLimit: number;
  upgradeRecommended: boolean;
}

interface WorkerStatus {
  id: string;
  type: string;
  status: "active" | "idle" | "busy" | "error";
  cpuUsage: number;
  memoryUsage: number;
  tasksProcessed: number;
  lastActive: string;
}

interface QueueMetrics {
  name: string;
  length: number;
  throughput: number;
  avgWaitTime: number;
  maxWaitTime: number;
}

interface ApplicationLoad {
  timestamp: string;
  requestsPerMinute: number;
  authenticationsPerMinute: number;
  directorySyncs: number;
  webhooksSent: number;
  scheduledTasksExecuted: number;
}

interface CapacityRecommendation {
  id: string;
  priority: AlertSeverity;
  category: "scaling" | "optimization" | "planning" | "cost";
  title: string;
  description: string;
  impact: string;
  estimatedCost?: string;
  automatedAction?: string;
}

interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  correlationId: string;
  details: string;
}

interface ThresholdConfig {
  resource: ResourceType;
  warning: number;
  critical: number;
  enabled: boolean;
  notifications: string[];
}

// ============================================================================
// MOCK DATA - Enterprise Capacity Context
// ============================================================================

const orgContext: OrganizationContext = {
  id: "org_2vPqN7xYz",
  name: "Acme Corporation",
  plan: "enterprise",
  environment: "production",
  region: "us-east-1",
  deploymentMode: "saas_cloud",
};

const overallStatus: CapacityStatus = "under_pressure";

const resourceUtilization: ResourceUtilization[] = [
  {
    type: "cpu",
    status: "under_pressure",
    metrics: {
      current: 72,
      peak: 89,
      average: 58,
      limit: 100,
      unit: "%",
      trend: "up",
      growthRate: 15.3,
    },
    history: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
      value: 45 + Math.random() * 30 + i * 0.5,
    })),
    projections: Array.from({ length: 72 }, (_, i) => ({
      timestamp: new Date(Date.now() + i * 3600000).toISOString(),
      value: 72 + i * 0.3 + Math.random() * 5,
      predicted: true,
    })),
  },
  {
    type: "memory",
    status: "healthy",
    metrics: {
      current: 64,
      peak: 78,
      average: 61,
      limit: 100,
      unit: "%",
      trend: "stable",
      growthRate: 3.2,
    },
    history: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
      value: 55 + Math.random() * 15,
    })),
    projections: Array.from({ length: 72 }, (_, i) => ({
      timestamp: new Date(Date.now() + i * 3600000).toISOString(),
      value: 64 + i * 0.05 + Math.random() * 3,
      predicted: true,
    })),
  },
  {
    type: "storage",
    status: "healthy",
    metrics: {
      current: 42,
      peak: 45,
      average: 40,
      limit: 100,
      unit: "%",
      trend: "up",
      growthRate: 8.7,
    },
    history: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
      value: 38 + i * 0.2 + Math.random() * 2,
    })),
    projections: Array.from({ length: 72 }, (_, i) => ({
      timestamp: new Date(Date.now() + i * 3600000).toISOString(),
      value: 42 + i * 0.1 + Math.random() * 2,
      predicted: true,
    })),
  },
  {
    type: "network",
    status: "healthy",
    metrics: {
      current: 35,
      peak: 67,
      average: 32,
      limit: 100,
      unit: "%",
      trend: "stable",
      growthRate: 2.1,
    },
    history: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
      value: 25 + Math.random() * 20,
    })),
    projections: Array.from({ length: 72 }, (_, i) => ({
      timestamp: new Date(Date.now() + i * 3600000).toISOString(),
      value: 35 + Math.random() * 10,
      predicted: true,
    })),
  },
];

const capacityAlerts: CapacityAlert[] = [
  {
    id: "alert-001",
    severity: "high",
    resource: "cpu",
    message: "CPU usage sustained above 70% for more than 15 minutes",
    threshold: 70,
    currentValue: 72,
    triggeredAt: "2026-02-12T14:30:00Z",
    acknowledged: false,
    autoResolve: true,
  },
  {
    id: "alert-002",
    severity: "medium",
    resource: "memory",
    message: "Memory usage approaching configured warning threshold",
    threshold: 75,
    currentValue: 64,
    triggeredAt: "2026-02-12T13:45:00Z",
    acknowledged: true,
    autoResolve: false,
  },
  {
    id: "alert-003",
    severity: "low",
    resource: "storage",
    message: "Storage growth rate higher than expected",
    threshold: 50,
    currentValue: 42,
    triggeredAt: "2026-02-12T12:00:00Z",
    acknowledged: true,
    autoResolve: true,
  },
];

const capacityQuotas: CapacityQuota[] = [
  {
    resource: "cpu",
    current: 72,
    limit: 100,
    unit: "%",
    planLimit: 100,
    upgradeRecommended: false,
  },
  {
    resource: "memory",
    current: 64,
    limit: 128,
    unit: "GB",
    planLimit: 256,
    upgradeRecommended: false,
  },
  {
    resource: "storage",
    current: 420,
    limit: 1000,
    unit: "GB",
    planLimit: 2000,
    upgradeRecommended: false,
  },
];

const workers: WorkerStatus[] = [
  {
    id: "worker-001",
    type: "authentication",
    status: "active",
    cpuUsage: 45,
    memoryUsage: 38,
    tasksProcessed: 12543,
    lastActive: "2026-02-12T15:00:00Z",
  },
  {
    id: "worker-002",
    type: "sync",
    status: "busy",
    cpuUsage: 78,
    memoryUsage: 62,
    tasksProcessed: 8932,
    lastActive: "2026-02-12T15:02:00Z",
  },
  {
    id: "worker-003",
    type: "webhook",
    status: "active",
    cpuUsage: 32,
    memoryUsage: 28,
    tasksProcessed: 45671,
    lastActive: "2026-02-12T15:01:00Z",
  },
  {
    id: "worker-004",
    type: "background",
    status: "idle",
    cpuUsage: 12,
    memoryUsage: 15,
    tasksProcessed: 3421,
    lastActive: "2026-02-12T14:45:00Z",
  },
];

const queueMetrics: QueueMetrics[] = [
  {
    name: "authentication",
    length: 23,
    throughput: 145,
    avgWaitTime: 12,
    maxWaitTime: 89,
  },
  {
    name: "sync",
    length: 8,
    throughput: 23,
    avgWaitTime: 45,
    maxWaitTime: 234,
  },
  {
    name: "webhook",
    length: 156,
    throughput: 892,
    avgWaitTime: 3,
    maxWaitTime: 23,
  },
  {
    name: "scheduled",
    length: 4,
    throughput: 12,
    avgWaitTime: 120,
    maxWaitTime: 567,
  },
];

const applicationLoadData: ApplicationLoad[] = Array.from({ length: 24 }, (_, i) => ({
  timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
  requestsPerMinute: 1200 + Math.random() * 400 + i * 5,
  authenticationsPerMinute: 85 + Math.random() * 30,
  directorySyncs: 12 + Math.random() * 5,
  webhooksSent: 340 + Math.random() * 100,
  scheduledTasksExecuted: 8 + Math.random() * 4,
}));

const capacityRecommendations: CapacityRecommendation[] = [
  {
    id: "rec-001",
    priority: "high",
    category: "scaling",
    title: "Scale Authentication Workers",
    description:
      "CPU pressure detected on authentication workers. Recommend adding 2 additional workers.",
    impact: "Reduce average response time by ~40%",
    estimatedCost: "$120/month",
  },
  {
    id: "rec-002",
    priority: "medium",
    category: "optimization",
    title: "Optimize Sync Queue Processing",
    description:
      "Sync queue showing high variance in wait times. Consider optimizing sync job batching.",
    impact: "Improve sync throughput by 25%",
  },
  {
    id: "rec-003",
    priority: "medium",
    category: "planning",
    title: "Storage Growth Projection",
    description: "At current growth rate, storage will reach 80% capacity in 45 days.",
    impact: "Plan storage expansion before critical threshold",
  },
  {
    id: "rec-004",
    priority: "low",
    category: "cost",
    title: "Right-size Idle Workers",
    description:
      "1 background worker has been idle for extended periods. Consider reducing allocation.",
    impact: "Save ~$60/month with minimal performance impact",
  },
];

const thresholdConfigs: ThresholdConfig[] = [
  {
    resource: "cpu",
    warning: 70,
    critical: 85,
    enabled: true,
    notifications: ["email", "webhook"],
  },
  {
    resource: "memory",
    warning: 75,
    critical: 90,
    enabled: true,
    notifications: ["email"],
  },
  {
    resource: "storage",
    warning: 80,
    critical: 95,
    enabled: true,
    notifications: ["email", "webhook"],
  },
  {
    resource: "network",
    warning: 70,
    critical: 90,
    enabled: false,
    notifications: [],
  },
];

const auditEvents: AuditEvent[] = [
  {
    id: "evt-001",
    timestamp: "2026-02-12T14:30:00Z",
    actor: "system",
    action: "threshold_breach",
    resource: "cpu",
    correlationId: "corr-001",
    details: "CPU usage exceeded 70% threshold for 15 minutes",
  },
  {
    id: "evt-002",
    timestamp: "2026-02-12T13:45:00Z",
    actor: "admin@acme.com",
    action: "alert_acknowledged",
    resource: "memory",
    correlationId: "corr-002",
    details: "Acknowledged memory warning alert",
  },
  {
    id: "evt-003",
    timestamp: "2026-02-12T12:00:00Z",
    actor: "system",
    action: "auto_scaling_triggered",
    resource: "workers",
    correlationId: "corr-003",
    details: "Automatically scaled authentication workers from 3 to 4",
  },
  {
    id: "evt-004",
    timestamp: "2026-02-12T10:15:00Z",
    actor: "ops@acme.com",
    action: "threshold_updated",
    resource: "cpu",
    correlationId: "corr-004",
    details: "Updated CPU critical threshold from 80% to 85%",
  },
];

// ============================================================================
// STATUS CONFIGURATIONS
// ============================================================================

const statusConfig: Record<
  CapacityStatus,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    borderColor: string;
    description: string;
  }
> = {
  healthy: {
    label: "Healthy",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    description: "All systems operating within normal parameters",
  },
  under_pressure: {
    label: "Under Pressure",
    icon: AlertTriangle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    description: "Some resources approaching capacity limits",
  },
  critical: {
    label: "Critical",
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/20",
    description: "Immediate attention required - capacity limits exceeded",
  },
};

const alertSeverityConfig: Record<
  AlertSeverity,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
  }
> = {
  critical: {
    label: "Critical",
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  high: {
    label: "High",
    icon: AlertCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  medium: {
    label: "Medium",
    icon: AlertTriangle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  low: {
    label: "Low",
    icon: Info,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
};

const recommendationCategoryConfig: Record<
  CapacityRecommendation["category"],
  {
    label: string;
    icon: React.ElementType;
    color: string;
  }
> = {
  scaling: {
    label: "Scaling",
    icon: Server,
    color: "text-purple-500",
  },
  optimization: {
    label: "Optimization",
    icon: Zap,
    color: "text-amber-500",
  },
  planning: {
    label: "Planning",
    icon: Calendar,
    color: "text-blue-500",
  },
  cost: {
    label: "Cost",
    icon: Target,
    color: "text-emerald-500",
  },
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function StatusBadge({
  status,
  size = "default",
}: {
  status: CapacityStatus;
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
        sizeClasses[size]
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
      className={cn("font-medium border-0 flex items-center gap-1", config.bgColor, config.color)}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

function ResourceIcon({ type, className }: { type: ResourceType; className?: string }) {
  const icons: Record<ResourceType, React.ElementType> = {
    cpu: Cpu,
    memory: MemoryStick,
    storage: HardDrive,
    network: Network,
  };

  const Icon = icons[type];
  return <Icon className={className} />;
}

function TrendIndicator({ trend, value }: { trend: TrendDirection; value: number }) {
  const config = {
    up: { icon: TrendingUp, color: "text-amber-500", label: "Growing" },
    down: {
      icon: TrendingDown,
      color: "text-emerald-500",
      label: "Decreasing",
    },
    stable: { icon: Activity, color: "text-blue-500", label: "Stable" },
  };

  const { icon: Icon, color, label } = config[trend];

  return (
    <div className={cn("flex items-center gap-1 text-xs", color)}>
      <Icon className="h-3 w-3" />
      <span>{label}</span>
      <span className="tabular-nums">
        ({value > 0 ? "+" : ""}
        {value}%)
      </span>
    </div>
  );
}

function ProgressWithStatus({ value, status }: { value: number; status: CapacityStatus }) {
  const config = {
    healthy: { color: "bg-emerald-500", trackColor: "bg-emerald-500/20" },
    under_pressure: { color: "bg-amber-500", trackColor: "bg-amber-500/20" },
    critical: { color: "bg-destructive", trackColor: "bg-destructive/20" },
  };

  const { color } = config[status];

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Utilization</span>
        <span className="font-medium">{value.toFixed(1)}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", color)}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function CapacityPage() {
  const [timeRange, setTimeRange] = React.useState<"24h" | "7d" | "30d">("24h");
  const [activeTab, setActiveTab] = React.useState("overview");
  const [showThresholdDialog, setShowThresholdDialog] = React.useState(false);

  const activeAlerts = capacityAlerts.filter((a) => !a.acknowledged);
  const status = overallStatus;
  const statusInfo = statusConfig[status];

  // Calculate aggregate metrics
  const totalWorkers = workers.length;
  const activeWorkers = workers.filter((w) => w.status === "active").length;
  const totalQueueItems = queueMetrics.reduce((acc, q) => acc + q.length, 0);
  const avgCpuUsage = resourceUtilization.find((r) => r.type === "cpu")?.metrics.average || 0;
  const avgMemoryUsage = resourceUtilization.find((r) => r.type === "memory")?.metrics.average || 0;

  return (
    <div className="space-y-6 p-6">
      {/* ============================================================================
          HEADER SECTION
          ============================================================================ */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-card-foreground">
            Identity Capacity Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor resource utilization, anticipate capacity needs, and optimize infrastructure
            performance
          </p>
        </div>
        <div className="flex items-center gap-2">
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
                : "text-blue-500 bg-blue-500/10"
            )}
          >
            {orgContext.deploymentMode === "self_hosted" ? "Self-Hosted" : "SaaS"}
          </Badge>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Configure
        </Button>
        <Button size="sm" className="bg-accent hover:bg-accent/90">
          <Scale className="h-4 w-4 mr-2" />
          Scale Resources
        </Button>
      </div>

      {/* ============================================================================
          STATUS OVERVIEW BANNER
          ============================================================================ */}
      <Card className={cn("border-l-4", statusInfo.borderColor)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn("p-3 rounded-lg", statusInfo.bgColor)}>
                <Gauge className={cn("h-8 w-8", statusInfo.color)} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-lg font-semibold">Capacity Status</h2>
                  <StatusBadge status={status} />
                </div>
                <p className="text-sm text-muted-foreground">{statusInfo.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <p className="text-2xl font-semibold text-amber-500">{activeAlerts.length}</p>
                <p className="text-muted-foreground">Active Alerts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-emerald-500">
                  {activeWorkers}/{totalWorkers}
                </p>
                <p className="text-muted-foreground">Active Workers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold">{totalQueueItems}</p>
                <p className="text-muted-foreground">Queued Items</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============================================================================
          KPI CARDS
          ============================================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="CPU Usage"
          value={`${avgCpuUsage.toFixed(1)}%`}
          subtitle="Average over 24h"
          icon={Cpu}
          variant={avgCpuUsage > 70 ? "warning" : "default"}
          trend={{ value: 15.3, isPositive: false }}
        />
        <MetricCard
          title="Memory Usage"
          value={`${avgMemoryUsage.toFixed(1)}%`}
          subtitle="Average over 24h"
          icon={MemoryStick}
          variant={avgMemoryUsage > 75 ? "warning" : "default"}
          trend={{ value: 3.2, isPositive: true }}
        />
        <MetricCard
          title="Active Users"
          value="2,847"
          subtitle="Currently online"
          icon={Users}
          variant="accent"
          trend={{ value: 12.5, isPositive: true }}
        />
        <MetricCard
          title="Services Connected"
          value="14"
          subtitle="All operational"
          icon={Layers}
          variant="accent"
          trend={{ value: 2, isPositive: true }}
        />
      </div>

      {/* ============================================================================
          MAIN CONTENT TABS
          ============================================================================ */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="overview" className="text-xs">
            <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="resources" className="text-xs">
            <Server className="h-3.5 w-3.5 mr-1.5" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="load" className="text-xs">
            <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
            Load Analysis
          </TabsTrigger>
          <TabsTrigger value="planning" className="text-xs">
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            Capacity Planning
          </TabsTrigger>
          <TabsTrigger value="alerts" className="text-xs">
            <Bell className="h-3.5 w-3.5 mr-1.5" />
            Alerts & Thresholds
          </TabsTrigger>
        </TabsList>

        {/* ============================================================================
            OVERVIEW TAB
            ============================================================================ */}
        <TabsContent value="overview" className="space-y-6">
          {/* Resource Utilization Cards */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Resource Utilization
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {resourceUtilization.map((resource) => (
                <Card
                  key={resource.type}
                  className="border-border hover:border-border/80 transition-colors cursor-pointer"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "p-2 rounded-md",
                            resource.status === "healthy"
                              ? "bg-emerald-500/10"
                              : resource.status === "under_pressure"
                                ? "bg-amber-500/10"
                                : "bg-destructive/10"
                          )}
                        >
                          <ResourceIcon
                            type={resource.type}
                            className={cn(
                              "h-4 w-4",
                              resource.status === "healthy"
                                ? "text-emerald-500"
                                : resource.status === "under_pressure"
                                  ? "text-amber-500"
                                  : "text-destructive"
                            )}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium capitalize">{resource.type}</p>
                          <StatusBadge status={resource.status} size="sm" />
                        </div>
                      </div>
                    </div>
                    <ProgressWithStatus value={resource.metrics.current} status={resource.status} />
                    <div className="mt-4 pt-4 border-t border-border space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Peak</span>
                        <span className="font-medium">
                          {resource.metrics.peak}
                          {resource.metrics.unit}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Average</span>
                        <span className="font-medium">
                          {resource.metrics.average}
                          {resource.metrics.unit}
                        </span>
                      </div>
                      <TrendIndicator
                        trend={resource.metrics.trend}
                        value={resource.metrics.growthRate}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Workers & Queues */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Worker Status
                </h2>
              </div>
              <Card className="border-border">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-25">Worker</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">CPU/Mem</TableHead>
                        <TableHead className="text-right">Tasks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {workers.map((worker) => (
                        <TableRow key={worker.id}>
                          <TableCell className="font-medium">{worker.id}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs capitalize">
                              {worker.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  "h-2 w-2 rounded-full",
                                  worker.status === "active"
                                    ? "bg-emerald-500"
                                    : worker.status === "busy"
                                      ? "bg-amber-500 animate-pulse"
                                      : worker.status === "idle"
                                        ? "bg-blue-500"
                                        : "bg-destructive"
                                )}
                              />
                              <span className="text-sm capitalize">{worker.status}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-xs tabular-nums">
                            {worker.cpuUsage}% / {worker.memoryUsage}%
                          </TableCell>
                          <TableCell
                            className="text-right text-xs tabular-nums"
                            suppressHydrationWarning
                          >
                            {worker.tasksProcessed.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
                <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Queue Metrics
                </h2>
              </div>
              <Card className="border-border">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead>Queue</TableHead>
                        <TableHead className="text-right">Length</TableHead>
                        <TableHead className="text-right">Throughput</TableHead>
                        <TableHead className="text-right">Avg Wait</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {queueMetrics.map((queue) => (
                        <TableRow key={queue.name}>
                          <TableCell>
                            <span className="font-medium capitalize">{queue.name}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant={queue.length > 100 ? "destructive" : "secondary"}
                              className="text-xs"
                            >
                              {queue.length}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-xs tabular-nums">
                            {queue.throughput}/min
                          </TableCell>
                          <TableCell className="text-right text-xs tabular-nums">
                            {queue.avgWaitTime}s
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Recent Alerts */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Recent Alerts
                </h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab("alerts")}>
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-2">
              {capacityAlerts.slice(0, 3).map((alert) => (
                <Card
                  key={alert.id}
                  className={cn(
                    "border-l-4 transition-colors",
                    alert.severity === "critical"
                      ? "border-l-destructive"
                      : alert.severity === "high"
                        ? "border-l-red-500"
                        : alert.severity === "medium"
                          ? "border-l-amber-500"
                          : "border-l-blue-500",
                    !alert.acknowledged && "bg-amber-500/5"
                  )}
                >
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertSeverityBadge severity={alert.severity} />
                      <div suppressHydrationWarning>
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                          {alert.resource} • Triggered{" "}
                          {new Date(alert.triggeredAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {!alert.acknowledged ? (
                      <Button size="sm" variant="outline">
                        Acknowledge
                      </Button>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Acknowledged
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </TabsContent>

        {/* ============================================================================
            RESOURCES TAB
            ============================================================================ */}
        <TabsContent value="resources" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Time Range:</span>
              <Select value={timeRange} onValueChange={(v) => setTimeRange(v as typeof timeRange)}>
                <SelectTrigger className="w-30 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Resource Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {resourceUtilization.map((resource) => {
              const warningThreshold = 70;
              const criticalThreshold = 85;

              return (
                <Card key={resource.type} className="border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "p-2 rounded-lg",
                            resource.status === "healthy"
                              ? "bg-emerald-500/10"
                              : resource.status === "under_pressure"
                                ? "bg-amber-500/10"
                                : "bg-red-500/10"
                          )}
                        >
                          <ResourceIcon
                            type={resource.type}
                            className={cn(
                              "h-5 w-5",
                              resource.status === "healthy"
                                ? "text-emerald-500"
                                : resource.status === "under_pressure"
                                  ? "text-amber-500"
                                  : "text-red-500"
                            )}
                          />
                        </div>
                        <div>
                          <CardTitle className="text-base font-medium capitalize">
                            {resource.type} Utilization
                          </CardTitle>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-2xl font-bold tabular-nums">
                              {resource.metrics.current}
                              {resource.metrics.unit}
                            </span>
                            <StatusBadge status={resource.status} size="sm" />
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>
                          Peak:{" "}
                          <span className="font-medium text-foreground">
                            {resource.metrics.peak}
                            {resource.metrics.unit}
                          </span>
                        </p>
                        <p>
                          Avg:{" "}
                          <span className="font-medium text-foreground">
                            {resource.metrics.average}
                            {resource.metrics.unit}
                          </span>
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-45 bg-muted/30 rounded-lg p-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={[
                            ...resource.history.map((d) => ({
                              time: new Date(d.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              }),
                              value: Math.round(d.value * 10) / 10,
                              isProjection: false,
                            })),
                            ...resource.projections.slice(0, 24).map((d) => ({
                              time: new Date(d.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              }),
                              value: Math.round(d.value * 10) / 10,
                              isProjection: true,
                            })),
                          ]}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id={`gradient-${resource.type}`}
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor={
                                  resource.status === "healthy"
                                    ? "#10b981"
                                    : resource.status === "under_pressure"
                                      ? "#f59e0b"
                                      : "#ef4444"
                                }
                                stopOpacity={0.2}
                              />
                              <stop
                                offset="95%"
                                stopColor={
                                  resource.status === "healthy"
                                    ? "#10b981"
                                    : resource.status === "under_pressure"
                                      ? "#f59e0b"
                                      : "#ef4444"
                                }
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="hsl(var(--border))"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="time"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={9}
                            tickLine={false}
                            axisLine={false}
                            interval={5}
                          />
                          <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={9}
                            unit="%"
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 100]}
                            width={30}
                          />
                          <Tooltip
                            content={({
                              active,
                              payload,
                            }: {
                              active?: boolean;
                              payload?: readonly {
                                payload?: {
                                  time: string;
                                  value: number;
                                  isProjection: boolean;
                                };
                              }[];
                            }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                if (!data) return null;
                                return (
                                  <div className="bg-popover border border-border rounded-lg p-2 shadow-lg">
                                    <div className="flex items-center justify-between mb-1">
                                      <p className="font-medium text-xs">{data.time}</p>
                                      {data.isProjection && (
                                        <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded border">
                                          Projected
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs">
                                      <span className="text-muted-foreground">Usage: </span>
                                      <span className="font-semibold">
                                        {data.value}
                                        {resource.metrics.unit}
                                      </span>
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          {/* Reference lines for thresholds */}
                          <ReferenceLine
                            y={warningThreshold}
                            stroke="#f59e0b"
                            strokeDasharray="4 4"
                            strokeWidth={1}
                          />
                          <ReferenceLine
                            y={criticalThreshold}
                            stroke="#ef4444"
                            strokeDasharray="4 4"
                            strokeWidth={1}
                          />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke={
                              resource.status === "healthy"
                                ? "#10b981"
                                : resource.status === "under_pressure"
                                  ? "#f59e0b"
                                  : "#ef4444"
                            }
                            fill={`url(#gradient-${resource.type})`}
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    {/* Legend & Stats */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <div className="w-3 border-t border-dashed border-amber-500" />
                          <span>Warning ({warningThreshold}%)</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <div className="w-3 border-t border-dashed border-red-500" />
                          <span>Critical ({criticalThreshold}%)</span>
                        </div>
                      </div>
                      <TrendIndicator
                        trend={resource.metrics.trend}
                        value={resource.metrics.growthRate}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Capacity Quotas */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Plan Limits & Quotas
              </h2>
            </div>
            <Card className="border-border">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {capacityQuotas.map((quota) => (
                    <div key={quota.resource} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ResourceIcon
                            type={quota.resource}
                            className="h-4 w-4 text-muted-foreground"
                          />
                          <span className="font-medium capitalize">{quota.resource}</span>
                        </div>
                        {quota.upgradeRecommended && (
                          <Badge className="text-xs bg-amber-500/10 text-amber-500 border-0">
                            Upgrade
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Used</span>
                          <span className="font-medium">
                            {quota.current} / {quota.limit} {quota.unit}
                          </span>
                        </div>
                        <Progress
                          value={(quota.current / quota.limit) * 100}
                          className={cn(
                            quota.current / quota.limit > 0.8
                              ? "[&>div]:bg-amber-500"
                              : quota.current / quota.limit > 0.9
                                ? "[&>div]:bg-destructive"
                                : "[&>div]:bg-emerald-500"
                          )}
                        />
                        <p className="text-xs text-muted-foreground">
                          Plan limit: {quota.planLimit} {quota.unit}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        {/* ============================================================================
            LOAD ANALYSIS TAB
            ============================================================================ */}
        <TabsContent value="load" className="space-y-6">
          {/* Application Load Chart */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Application Load Overview</CardTitle>
                  <CardDescription>
                    Requests, authentications, and operations over time
                  </CardDescription>
                </div>
                <Select
                  value={timeRange}
                  onValueChange={(v) => setTimeRange(v as typeof timeRange)}
                >
                  <SelectTrigger className="w-30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Last 24h</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {/* 4 Mini Charts Grid */}
              <div className="grid grid-cols-2 gap-4" suppressHydrationWarning>
                {/* Requests Chart */}
                <div className="space-y-2" suppressHydrationWarning>
                  <div className="flex items-center justify-between" suppressHydrationWarning>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-xs font-medium">Requests/min</span>
                    </div>
                    <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                      Avg:{" "}
                      {Math.round(
                        applicationLoadData.reduce((a, b) => a + b.requestsPerMinute, 0) /
                          applicationLoadData.length
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="h-30 bg-muted/30 rounded-lg p-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={applicationLoadData.map((d) => ({
                          time: new Date(d.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          }),
                          value: d.requestsPerMinute,
                        }))}
                        margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="gradient-requests" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#3b82f6"
                          fill="url(#gradient-requests)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Auth Chart */}
                <div className="space-y-2" suppressHydrationWarning>
                  <div className="flex items-center justify-between" suppressHydrationWarning>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs font-medium">Authentications/min</span>
                    </div>
                    <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                      Avg:{" "}
                      {Math.round(
                        applicationLoadData.reduce((a, b) => a + b.authenticationsPerMinute, 0) /
                          applicationLoadData.length
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="h-30 bg-muted/30 rounded-lg p-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={applicationLoadData.map((d) => ({
                          time: new Date(d.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          }),
                          value: d.authenticationsPerMinute,
                        }))}
                        margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="gradient-auth" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#10b981"
                          fill="url(#gradient-auth)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Syncs Chart */}
                <div className="space-y-2" suppressHydrationWarning>
                  <div className="flex items-center justify-between" suppressHydrationWarning>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-xs font-medium">Directory Syncs</span>
                    </div>
                    <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                      Total:{" "}
                      {applicationLoadData
                        .reduce((a, b) => a + b.directorySyncs, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                  <div className="h-30 bg-muted/30 rounded-lg p-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={applicationLoadData.map((d) => ({
                          time: new Date(d.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          }),
                          value: d.directorySyncs,
                        }))}
                        margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
                      >
                        <Bar dataKey="value" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Webhooks Chart */}
                <div className="space-y-2" suppressHydrationWarning>
                  <div className="flex items-center justify-between" suppressHydrationWarning>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <span className="text-xs font-medium">Webhooks Sent</span>
                    </div>
                    <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                      Total:{" "}
                      {applicationLoadData.reduce((a, b) => a + b.webhooksSent, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="h-30 bg-muted/30 rounded-lg p-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={applicationLoadData.map((d) => ({
                          time: new Date(d.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          }),
                          value: d.webhooksSent,
                        }))}
                        margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="gradient-webhooks" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#8b5cf6"
                          fill="url(#gradient-webhooks)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Combined Overview Chart */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-3">
                  Combined Overview (Normalized %)
                </p>
                <div className="h-37.5">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={applicationLoadData.map((d) => {
                        const maxReq = Math.max(
                          ...applicationLoadData.map((x) => x.requestsPerMinute)
                        );
                        const maxAuth = Math.max(
                          ...applicationLoadData.map((x) => x.authenticationsPerMinute)
                        );
                        const maxSync = Math.max(
                          ...applicationLoadData.map((x) => x.directorySyncs)
                        );
                        const maxWebhook = Math.max(
                          ...applicationLoadData.map((x) => x.webhooksSent)
                        );
                        return {
                          time: new Date(d.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          }),
                          requests: (d.requestsPerMinute / maxReq) * 100,
                          auth: (d.authenticationsPerMinute / maxAuth) * 100,
                          syncs: (d.directorySyncs / maxSync) * 100,
                          webhooks: (d.webhooksSent / maxWebhook) * 100,
                        };
                      })}
                      margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="time"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        interval={5}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        unit="%"
                      />
                      <Line
                        type="monotone"
                        dataKey="requests"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="auth"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="syncs"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="webhooks"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================================
            CAPACITY PLANNING TAB
            ============================================================================ */}
        <TabsContent value="planning" className="space-y-6">
          {/* Recommendations */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Capacity Recommendations
              </h2>
            </div>
            <div className="space-y-3">
              {capacityRecommendations.map((rec) => {
                const categoryConfig = recommendationCategoryConfig[rec.category];
                const Icon = categoryConfig.icon;

                return (
                  <Card key={rec.id} className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "p-2 rounded-md mt-0.5",
                              categoryConfig.color.replace("text-", "bg-").replace("500", "500/10")
                            )}
                          >
                            <Icon className={cn("h-4 w-4", categoryConfig.color)} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">{rec.title}</h3>
                              <Badge variant="outline" className="text-xs capitalize">
                                {rec.category}
                              </Badge>
                              <AlertSeverityBadge severity={rec.priority} />
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                            <div className="flex items-center gap-4 text-xs">
                              <span className="text-muted-foreground">
                                <span className="font-medium text-foreground">Impact:</span>{" "}
                                {rec.impact}
                              </span>
                              {rec.estimatedCost && (
                                <span className="text-muted-foreground">
                                  <span className="font-medium text-foreground">Cost:</span>{" "}
                                  {rec.estimatedCost}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {rec.automatedAction ? (
                            <Button size="sm" variant="outline">
                              Review
                            </Button>
                          ) : (
                            <Button size="sm" className="bg-accent hover:bg-accent/90">
                              Apply
                            </Button>
                          )}
                          <Button size="sm" variant="ghost">
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Growth Projections */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <LineChartIcon className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Growth Projections
              </h2>
            </div>
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base">Resource Utilization Forecast</CardTitle>
                <CardDescription>
                  Projected capacity needs based on current growth trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-62.5">
                  <ChartContainer
                    config={{
                      cpu: { label: "CPU" },
                      memory: { label: "Memory" },
                      storage: { label: "Storage" },
                    }}
                  >
                    <AreaChart
                      data={Array.from({ length: 90 }, (_, i) => ({
                        day: `Day ${i + 1}`,
                        cpu: Math.min(100, 72 + i * 0.3 + Math.sin(i * 0.1) * 5),
                        memory: Math.min(100, 64 + i * 0.1 + Math.cos(i * 0.1) * 3),
                        storage: Math.min(100, 42 + i * 0.15),
                      }))}
                    >
                      <defs>
                        <linearGradient id="gradient-cpu-proj" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradient-memory-proj" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="day"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={10}
                        interval={14}
                      />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} unit="%" />
                      <ChartTooltip />
                      <Area
                        type="monotone"
                        dataKey="cpu"
                        stroke="#f59e0b"
                        fill="url(#gradient-cpu-proj)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="memory"
                        stroke="#10b981"
                        fill="url(#gradient-memory-proj)"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="storage"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={false}
                      />
                    </AreaChart>
                  </ChartContainer>
                </div>
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Saturation Estimate</p>
                      <p className="text-sm text-muted-foreground">
                        At current growth rates, CPU is projected to reach critical threshold (85%)
                        in approximately
                        <span className="font-medium text-foreground"> 18 days</span>. Consider
                        scaling resources or optimizing workload distribution.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        {/* ============================================================================
            ALERTS & THRESHOLDS TAB
            ============================================================================ */}
        <TabsContent value="alerts" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Alert Configuration
              </h2>
            </div>
            <Button onClick={() => setShowThresholdDialog(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Configure Thresholds
            </Button>
          </div>

          {/* Threshold Configuration */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">Current Thresholds</CardTitle>
              <CardDescription>Alert thresholds for capacity monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {thresholdConfigs.map((config) => (
                  <div key={config.resource} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ResourceIcon
                          type={config.resource}
                          className="h-4 w-4 text-muted-foreground"
                        />
                        <span className="font-medium capitalize">{config.resource}</span>
                      </div>
                      <Switch checked={config.enabled} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Warning</span>
                          <span className="font-medium">{config.warning}%</span>
                        </div>
                        <Progress value={config.warning} className="[&>div]:bg-amber-500" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Critical</span>
                          <span className="font-medium">{config.critical}%</span>
                        </div>
                        <Progress value={config.critical} className="[&>div]:bg-destructive" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Bell className="h-3 w-3" />
                      Notifications: {config.notifications.join(", ") || "None"}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* All Alerts */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Alert History
              </h2>
            </div>
            <Card className="border-border">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Severity</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Triggered</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {capacityAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell>
                          <AlertSeverityBadge severity={alert.severity} />
                        </TableCell>
                        <TableCell className="capitalize">{alert.resource}</TableCell>
                        <TableCell className="max-w-75 truncate">{alert.message}</TableCell>
                        <TableCell className="tabular-nums">
                          {alert.currentValue}% / {alert.threshold}%
                        </TableCell>
                        <TableCell className="text-muted-foreground" suppressHydrationWarning>
                          {new Date(alert.triggeredAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {alert.acknowledged ? (
                            <Badge variant="outline" className="text-xs">
                              Acknowledged
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              Active
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>

          {/* Audit Events */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Capacity Audit Log
              </h2>
            </div>
            <Card className="border-border">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Actor</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="text-muted-foreground" suppressHydrationWarning>
                          {new Date(event.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-medium">{event.actor}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs capitalize">
                            {event.action.replace(/_/g, " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">{event.resource}</TableCell>
                        <TableCell className="text-muted-foreground text-xs max-w-62.5 truncate">
                          {event.details}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>
        </TabsContent>
      </Tabs>

      {/* ============================================================================
          THRESHOLD CONFIGURATION DIALOG
          ============================================================================ */}
      <Dialog open={showThresholdDialog} onOpenChange={setShowThresholdDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configure Capacity Thresholds</DialogTitle>
            <DialogDescription>
              Set alert thresholds for capacity monitoring across all resources
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {thresholdConfigs.map((config) => (
              <div key={config.resource} className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ResourceIcon
                      type={config.resource}
                      className="h-5 w-5 text-muted-foreground"
                    />
                    <Label className="font-medium capitalize">{config.resource} Thresholds</Label>
                  </div>
                  <Switch checked={config.enabled} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label className="text-xs text-muted-foreground">Warning Threshold</Label>
                      <span className="text-xs font-medium">{config.warning}%</span>
                    </div>
                    <Slider
                      value={[config.warning]}
                      min={50}
                      max={95}
                      step={5}
                      className="**:[[role=slider]]:bg-amber-500"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label className="text-xs text-muted-foreground">Critical Threshold</Label>
                      <span className="text-xs font-medium">{config.critical}%</span>
                    </div>
                    <Slider
                      value={[config.critical]}
                      min={60}
                      max={99}
                      step={5}
                      className="**:[[role=slider]]:bg-destructive"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowThresholdDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-accent hover:bg-accent/90">Save Configuration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
