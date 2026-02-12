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
import { ChartContainer, ChartTooltip } from "@/components/dashboard/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
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
  Banknote,
  BarChart3,
  Bell,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Cloud,
  Cpu,
  CreditCard,
  Database,
  DollarSign,
  Download,
  Eye,
  Gauge,
  HardDrive,
  History,
  Info,
  Layers,
  Network,
  Package,
  Receipt,
  RefreshCw,
  Server,
  Settings,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wallet,
  Wifi,
  Zap,
} from "lucide-react";

// ============================================================================
// TYPES - Operational Cost Management
// ============================================================================

type DeploymentMode = "saas_cloud" | "self_hosted" | "hybrid";
type PlanTier = "free" | "pro" | "enterprise";
type EnvironmentType = "production" | "staging" | "development";
type CostStatus = "healthy" | "warning" | "critical";
type CostCategory =
  | "compute"
  | "storage"
  | "network"
  | "backup"
  | "integrations"
  | "logs";
type TrendDirection = "up" | "down" | "stable";
type AlertSeverity = "critical" | "high" | "medium" | "low";

interface OrganizationContext {
  id: string;
  name: string;
  plan: PlanTier;
  environment: EnvironmentType;
  region: string;
  deploymentMode: DeploymentMode;
}

interface CostMetrics {
  estimatedMonthlyCost: number;
  currentMonthUsage: number;
  storageCost: number;
  computeCost: number;
  networkCost: number;
  backupCost: number;
  integrationsCost: number;
  logsCost: number;
  growthRate: number;
  budgetLimit: number;
  budgetUsed: number;
}

interface CostBreakdownItem {
  category: CostCategory;
  currentCost: number;
  previousCost: number;
  projectedCost: number;
  usage: string;
  usageUnit: string;
  trend: TrendDirection;
  trendValue: number;
  status: CostStatus;
  details: {
    label: string;
    value: string;
  }[];
}

interface CostProjection {
  period: "30d" | "60d" | "90d";
  projectedCost: number;
  confidence: number;
  scenarios: {
    label: string;
    impact: number;
    description: string;
  }[];
}

interface UserGrowthImpact {
  currentUsers: number;
  projectedUsers: number;
  currentCost: number;
  projectedCost: number;
  costPerUser: number;
  scenarios: {
    users: number;
    cost: number;
    label: string;
  }[];
}

interface CostAlert {
  id: string;
  severity: AlertSeverity;
  category: CostCategory;
  message: string;
  threshold: number;
  currentValue: number;
  triggeredAt: string;
  acknowledged: boolean;
  recommendation?: string;
}

interface MonthlyCostHistory {
  month: string;
  compute: number;
  storage: number;
  network: number;
  backup: number;
  integrations: number;
  logs: number;
  total: number;
}

// ============================================================================
// MOCK DATA - Enterprise Cost Context
// ============================================================================

const orgContext: OrganizationContext = {
  id: "org_2vPqN7xYz",
  name: "Acme Corporation",
  plan: "enterprise",
  environment: "production",
  region: "us-east-1",
  deploymentMode: "self_hosted",
};

const costMetrics: CostMetrics = {
  estimatedMonthlyCost: 4520,
  currentMonthUsage: 3247,
  storageCost: 1240,
  computeCost: 1850,
  networkCost: 680,
  backupCost: 420,
  integrationsCost: 180,
  logsCost: 130,
  growthRate: 8.3,
  budgetLimit: 5000,
  budgetUsed: 3247,
};

const costBreakdown: CostBreakdownItem[] = [
  {
    category: "compute",
    currentCost: 1850,
    previousCost: 1720,
    projectedCost: 1950,
    usage: "847",
    usageUnit: "hours",
    trend: "up",
    trendValue: 7.6,
    status: "warning",
    details: [
      { label: "Instance Type", value: "r6i.xlarge" },
      { label: "Nodes", value: "4 active" },
      { label: "Avg. CPU", value: "62%" },
    ],
  },
  {
    category: "storage",
    currentCost: 1240,
    previousCost: 1150,
    projectedCost: 1320,
    usage: "847",
    usageUnit: "GB",
    trend: "up",
    trendValue: 7.8,
    status: "healthy",
    details: [
      { label: "Database", value: "420 GB" },
      { label: "Backups", value: "380 GB" },
      { label: "Logs", value: "47 GB" },
    ],
  },
  {
    category: "network",
    currentCost: 680,
    previousCost: 650,
    projectedCost: 720,
    usage: "2.4",
    usageUnit: "TB",
    trend: "stable",
    trendValue: 2.1,
    status: "healthy",
    details: [
      { label: "Egress", value: "1.8 TB" },
      { label: "Ingress", value: "0.6 TB" },
      { label: "CDN", value: "enabled" },
    ],
  },
  {
    category: "backup",
    currentCost: 420,
    previousCost: 380,
    projectedCost: 450,
    usage: "847",
    usageUnit: "GB",
    trend: "up",
    trendValue: 10.5,
    status: "warning",
    details: [
      { label: "Retention", value: "35 days" },
      { label: "Frequency", value: "hourly" },
      { label: "Compression", value: "enabled" },
    ],
  },
  {
    category: "integrations",
    currentCost: 180,
    previousCost: 180,
    projectedCost: 180,
    usage: "14",
    usageUnit: "services",
    trend: "stable",
    trendValue: 0,
    status: "healthy",
    details: [
      { label: "AD/LDAP", value: "connected" },
      { label: "SAML/SSO", value: "2 providers" },
      { label: "Webhooks", value: "8 active" },
    ],
  },
  {
    category: "logs",
    currentCost: 130,
    previousCost: 95,
    projectedCost: 145,
    usage: "47",
    usageUnit: "GB/day",
    trend: "up",
    trendValue: 36.8,
    status: "critical",
    details: [
      { label: "Retention", value: "30 days" },
      { label: "Log Level", value: "info" },
      { label: "Compression", value: "enabled" },
    ],
  },
];

const costProjections: CostProjection[] = [
  {
    period: "30d",
    projectedCost: 4780,
    confidence: 92,
    scenarios: [
      {
        label: "Conservative",
        impact: -5,
        description: "Based on current usage",
      },
      { label: "Expected", impact: 0, description: "Normal growth trajectory" },
      { label: "Aggressive", impact: 15, description: "If traffic spikes 30%" },
    ],
  },
  {
    period: "60d",
    projectedCost: 5120,
    confidence: 85,
    scenarios: [
      {
        label: "Conservative",
        impact: -8,
        description: "Cost optimization applied",
      },
      { label: "Expected", impact: 5, description: "Normal growth trajectory" },
      { label: "Aggressive", impact: 25, description: "If traffic spikes 50%" },
    ],
  },
  {
    period: "90d",
    projectedCost: 5480,
    confidence: 78,
    scenarios: [
      {
        label: "Conservative",
        impact: -12,
        description: "Scaling optimization",
      },
      { label: "Expected", impact: 12, description: "Based on user growth" },
      { label: "Aggressive", impact: 35, description: "Major feature launch" },
    ],
  },
];

const userGrowthImpact: UserGrowthImpact = {
  currentUsers: 2847,
  projectedUsers: 3500,
  currentCost: 3247,
  projectedCost: 3980,
  costPerUser: 1.14,
  scenarios: [
    { users: 2847, cost: 3247, label: "Current" },
    { users: 3000, cost: 3420, label: "+10%" },
    { users: 3500, cost: 3980, label: "+25%" },
    { users: 4000, cost: 4550, label: "+40%" },
    { users: 5000, cost: 5680, label: "+75%" },
  ],
};

const costAlerts: CostAlert[] = [
  {
    id: "cost-001",
    severity: "high",
    category: "logs",
    message: "Log ingestion 37% higher than previous month",
    threshold: 30,
    currentValue: 36.8,
    triggeredAt: "2026-02-12T08:00:00Z",
    acknowledged: false,
    recommendation: "Consider adjusting log retention or filtering debug logs",
  },
  {
    id: "cost-002",
    severity: "medium",
    category: "compute",
    message: "Compute costs trending above budget projection",
    threshold: 5,
    currentValue: 7.6,
    triggeredAt: "2026-02-11T14:00:00Z",
    acknowledged: true,
    recommendation: "Review instance sizing and consider reserved instances",
  },
  {
    id: "cost-003",
    severity: "medium",
    category: "backup",
    message: "Backup storage growing faster than expected",
    threshold: 8,
    currentValue: 10.5,
    triggeredAt: "2026-02-10T10:00:00Z",
    acknowledged: false,
    recommendation: "Consider adjusting backup compression or retention",
  },
  {
    id: "cost-004",
    severity: "low",
    category: "storage",
    message: "Storage usage at 42% of allocated capacity",
    threshold: 50,
    currentValue: 42,
    triggeredAt: "2026-02-12T00:00:00Z",
    acknowledged: true,
  },
];

const monthlyCostHistory: MonthlyCostHistory[] = [
  {
    month: "Aug",
    compute: 1420,
    storage: 980,
    network: 520,
    backup: 320,
    integrations: 180,
    logs: 85,
    total: 3505,
  },
  {
    month: "Sep",
    compute: 1480,
    storage: 1020,
    network: 580,
    backup: 340,
    integrations: 180,
    logs: 92,
    total: 3692,
  },
  {
    month: "Oct",
    compute: 1550,
    storage: 1080,
    network: 620,
    backup: 360,
    integrations: 180,
    logs: 98,
    total: 3888,
  },
  {
    month: "Nov",
    compute: 1620,
    storage: 1120,
    network: 640,
    backup: 380,
    integrations: 180,
    logs: 105,
    total: 4045,
  },
  {
    month: "Dec",
    compute: 1680,
    storage: 1180,
    network: 660,
    backup: 400,
    integrations: 180,
    logs: 112,
    total: 4212,
  },
  {
    month: "Jan",
    compute: 1720,
    storage: 1150,
    network: 650,
    backup: 380,
    integrations: 180,
    logs: 95,
    total: 4175,
  },
  {
    month: "Feb",
    compute: 1850,
    storage: 1240,
    network: 680,
    backup: 420,
    integrations: 180,
    logs: 130,
    total: 4500,
  },
];

const pieChartData = [
  { name: "Compute", value: 1850, color: "#8b5cf6" },
  { name: "Storage", value: 1240, color: "#06b6d4" },
  { name: "Network", value: 680, color: "#10b981" },
  { name: "Backup", value: 420, color: "#f59e0b" },
  { name: "Integrations", value: 180, color: "#ec4899" },
  { name: "Logs", value: 130, color: "#ef4444" },
];

// ============================================================================
// STATUS CONFIGURATIONS
// ============================================================================

const statusConfig: Record<
  CostStatus,
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
    description: "Costs within expected range",
  },
  warning: {
    label: "Warning",
    icon: AlertTriangle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    description: "Costs trending above projection",
  },
  critical: {
    label: "Critical",
    icon: AlertCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/20",
    description: "Immediate attention required",
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
    icon: AlertCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  high: {
    label: "High",
    icon: AlertTriangle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  medium: {
    label: "Medium",
    icon: AlertCircle,
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

const categoryConfig: Record<
  CostCategory,
  {
    label: string;
    icon: React.ElementType;
    color: string;
  }
> = {
  compute: {
    label: "Compute",
    icon: Cpu,
    color: "text-purple-500",
  },
  storage: {
    label: "Storage",
    icon: HardDrive,
    color: "text-cyan-500",
  },
  network: {
    label: "Network",
    icon: Network,
    color: "text-emerald-500",
  },
  backup: {
    label: "Backup",
    icon: Database,
    color: "text-amber-500",
  },
  integrations: {
    label: "Integrations",
    icon: Layers,
    color: "text-pink-500",
  },
  logs: {
    label: "Logs",
    icon: FileText,
    color: "text-red-500",
  },
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function FileText({ className }: { className?: string }) {
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
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  );
}

function StatusBadge({
  status,
  size = "default",
}: {
  status: CostStatus;
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

function TrendIndicator({
  trend,
  value,
}: {
  trend: TrendDirection;
  value: number;
}) {
  const config = {
    up: { icon: TrendingUp, color: "text-amber-500", label: "Increasing" },
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

function CostBreakdownRow({
  item,
  onViewDetails,
}: {
  item: CostBreakdownItem;
  onViewDetails: (item: CostBreakdownItem) => void;
}) {
  const categoryInfo = categoryConfig[item.category];
  const statusInfo = statusConfig[item.status];
  const CategoryIcon = categoryInfo.icon;

  return (
    <Card className="border-border hover:border-border/80 transition-colors overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={cn("p-2.5 rounded-lg shrink-0", statusInfo.bgColor)}
            >
              <CategoryIcon className={cn("h-5 w-5", categoryInfo.color)} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium capitalize truncate">
                  {item.category}
                </h3>
                <StatusBadge status={item.status} size="sm" />
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {item.usage} {item.usageUnit}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-8 justify-between sm:justify-end">
            <div className="text-right shrink-0">
              <p className="text-lg font-semibold tabular-nums">
                ${item.currentCost.toLocaleString("en-US")}
              </p>
              <p className="text-xs text-muted-foreground">
                vs ${item.previousCost.toLocaleString("en-US")} last month
              </p>
            </div>
            <div className="w-32 shrink-0 hidden sm:block">
              <TrendIndicator trend={item.trend} value={item.trendValue} />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0"
              onClick={() => onViewDetails(item)}
            >
              <Eye className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Details</span>
            </Button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-4">
            {item.details.map((detail) => (
              <div key={detail.label}>
                <p className="text-xs text-muted-foreground">{detail.label}</p>
                <p className="text-sm font-medium">{detail.value}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function CostsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState<"30d" | "90d" | "12m">("30d");
  const [showBudgetDialog, setShowBudgetDialog] = useState(false);
  const [selectedCostItem, setSelectedCostItem] =
    useState<CostBreakdownItem | null>(null);

  const activeAlerts = costAlerts.filter((a) => !a.acknowledged);
  const budgetPercentage =
    (costMetrics.budgetUsed / costMetrics.budgetLimit) * 100;
  const budgetStatus =
    budgetPercentage > 90
      ? "critical"
      : budgetPercentage > 75
        ? "warning"
        : "healthy";

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6 p-6 overflow-hidden">
      {/* ============================================================================
          HEADER SECTION
          ============================================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-card-foreground">
            Identity Operational Costs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor infrastructure usage, service-level consumption and cost
            projections for your Identity instance.
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
          <Badge
            variant="outline"
            className={cn(
              "text-xs",
              orgContext.plan === "enterprise"
                ? "text-amber-500 bg-amber-500/10"
                : orgContext.plan === "pro"
                  ? "text-blue-500 bg-blue-500/10"
                  : "text-muted-foreground",
            )}
          >
            {orgContext.plan.charAt(0).toUpperCase() + orgContext.plan.slice(1)}
          </Badge>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
        <Button variant="outline" size="sm">
          <Receipt className="h-4 w-4 mr-2" />
          Billing Details
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowBudgetDialog(true)}
        >
          <Wallet className="h-4 w-4 mr-2" />
          Configure Budget
        </Button>
      </div>

      {/* ============================================================================
          STATUS OVERVIEW BANNER
          ============================================================================ */}
      <Card
        className={cn(
          "border-l-4 overflow-hidden",
          statusConfig[budgetStatus].borderColor,
        )}
      >
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "p-3 rounded-lg shrink-0",
                  statusConfig[budgetStatus].bgColor,
                )}
              >
                <Gauge
                  className={cn("h-8 w-8", statusConfig[budgetStatus].color)}
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-lg font-semibold">Budget Status</h2>
                  <StatusBadge status={budgetStatus} />
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {budgetPercentage.toFixed(0)}% of monthly budget consumed •{" "}
                  {formatCurrency(
                    costMetrics.budgetLimit - costMetrics.budgetUsed,
                  )}{" "}
                  remaining
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 text-sm justify-between sm:justify-end">
              <div className="text-center">
                <p className="text-2xl font-semibold text-amber-500">
                  {activeAlerts.length}
                </p>
                <p className="text-muted-foreground">Active Alerts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold">
                  {formatCurrency(costMetrics.budgetUsed)}
                </p>
                <p className="text-muted-foreground">Used</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-emerald-500">
                  {formatCurrency(costMetrics.budgetLimit)}
                </p>
                <p className="text-muted-foreground">Budget</p>
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
          title="Estimated Monthly Cost"
          value={formatCurrency(costMetrics.estimatedMonthlyCost)}
          subtitle="Based on current usage"
          icon={DollarSign}
          variant="accent"
          trend={{ value: costMetrics.growthRate, isPositive: false }}
        />
        <MetricCard
          title="Current Month Usage"
          value={formatCurrency(costMetrics.currentMonthUsage)}
          subtitle="Pro-rated to date"
          icon={CreditCard}
          variant="default"
          trend={{ value: 4.2, isPositive: false }}
        />
        <MetricCard
          title="Compute Cost"
          value={formatCurrency(costMetrics.computeCost)}
          subtitle="Instances & workers"
          icon={Cpu}
          variant="warning"
          trend={{ value: 7.6, isPositive: false }}
        />
        <MetricCard
          title="Storage Cost"
          value={formatCurrency(costMetrics.storageCost)}
          subtitle="Database & backups"
          icon={HardDrive}
          variant="default"
          trend={{ value: 7.8, isPositive: false }}
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
          <TabsTrigger value="breakdown" className="text-xs">
            <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
            Breakdown
          </TabsTrigger>
          <TabsTrigger value="forecast" className="text-xs">
            <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
            Forecast
          </TabsTrigger>
          <TabsTrigger value="alerts" className="text-xs">
            <Bell className="h-3.5 w-3.5 mr-1.5" />
            Alerts & Risks
          </TabsTrigger>
        </TabsList>

        {/* ============================================================================
            OVERVIEW TAB
            ============================================================================ */}
        <TabsContent value="overview" className="space-y-6">
          {/* Cost Breakdown Cards */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Cost Distribution
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {costBreakdown.map((item) => (
                <CostBreakdownRow
                  key={item.category}
                  item={item}
                  onViewDetails={setSelectedCostItem}
                />
              ))}
            </div>
          </section>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trend */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">
                  Monthly Cost Trend
                </CardTitle>
                <CardDescription>
                  Last 7 months cost breakdown by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={monthlyCostHistory}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorTotal"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#8b5cf6"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#8b5cf6"
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
                        dataKey="month"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                        width={45}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [`$${value}`, "Cost"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke="#8b5cf6"
                        fillOpacity={1}
                        fill="url(#colorTotal)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Pie Chart Distribution */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">
                  Cost Distribution
                </CardTitle>
                <CardDescription>
                  Current month breakdown by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [`$${value}`, "Cost"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-3 mt-2">
                  {pieChartData.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-1.5 text-xs"
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============================================================================
            BREAKDOWN TAB
            ============================================================================ */}
        <TabsContent value="breakdown" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Time Range:</span>
              <Select
                value={timeRange}
                onValueChange={(v) => setTimeRange(v as typeof timeRange)}
              >
                <SelectTrigger className="w-[120px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="12m">Last 12 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Detailed Table */}
          <Card className="border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Current Cost</TableHead>
                    <TableHead className="text-right">Previous</TableHead>
                    <TableHead className="text-right">Change</TableHead>
                    <TableHead className="text-right">Projected</TableHead>
                    <TableHead className="text-right">Usage</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {costBreakdown.map((item) => {
                    const categoryInfo = categoryConfig[item.category];
                    const CategoryIcon = categoryInfo.icon;
                    const changePercent =
                      ((item.currentCost - item.previousCost) /
                        item.previousCost) *
                      100;

                    return (
                      <TableRow key={item.category}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "p-1.5 rounded-md",
                                statusConfig[item.status].bgColor,
                              )}
                            >
                              <CategoryIcon
                                className={cn("h-4 w-4", categoryInfo.color)}
                              />
                            </div>
                            <span className="font-medium capitalize">
                              {item.category}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium tabular-nums">
                          ${item.currentCost.toLocaleString("en-US")}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground tabular-nums">
                          ${item.previousCost.toLocaleString("en-US")}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={cn(
                              "text-xs font-medium",
                              changePercent > 0
                                ? "text-amber-500"
                                : "text-emerald-500",
                            )}
                          >
                            {changePercent > 0 ? "+" : ""}
                            {changePercent.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground tabular-nums">
                          ${item.projectedCost.toLocaleString("en-US")}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {item.usage} {item.usageUnit}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={item.status} size="sm" />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Network & Storage Additional Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Network className="h-4 w-4 text-emerald-500" />
                  Network Usage Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Egress Traffic
                    </span>
                    <span className="font-medium">1.8 TB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Ingress Traffic
                    </span>
                    <span className="font-medium">0.6 TB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      CDN Usage
                    </span>
                    <Badge variant="outline">Enabled</Badge>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Cost per GB
                      </span>
                      <span className="font-medium">$0.085</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-cyan-500" />
                  Storage Usage Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Database Storage
                    </span>
                    <span className="font-medium">420 GB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Backup Storage
                    </span>
                    <span className="font-medium">380 GB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Log Storage
                    </span>
                    <span className="font-medium">47 GB</span>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Cost per GB
                      </span>
                      <span className="font-medium">$0.023</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============================================================================
            FORECAST TAB
            ============================================================================ */}
        <TabsContent value="forecast" className="space-y-6">
          {/* Cost Projections */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Cost Projections
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {costProjections.map((projection) => (
                <Card key={projection.period} className="border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium">
                        Next {projection.period.replace("d", " Days")}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {projection.confidence}% confidence
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-3xl font-bold tabular-nums">
                        ${projection.projectedCost.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Projected total cost
                      </p>
                    </div>
                    <div className="space-y-2">
                      {projection.scenarios.map((scenario) => (
                        <div
                          key={scenario.label}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-muted-foreground">
                            {scenario.label}
                          </span>
                          <div className="text-right">
                            <span
                              className={cn(
                                "font-medium",
                                scenario.impact > 0
                                  ? "text-amber-500"
                                  : "text-emerald-500",
                              )}
                            >
                              {scenario.impact > 0 ? "+" : ""}
                              {scenario.impact}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* User Growth Impact */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                User Growth Impact
              </h2>
            </div>
            <Card className="border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-medium">
                      Cost Projection by User Count
                    </CardTitle>
                    <CardDescription>
                      Current cost per user: $
                      {userGrowthImpact.costPerUser.toFixed(2)}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {userGrowthImpact.currentUsers.toLocaleString("en-US")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Current users
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={userGrowthImpact.scenarios}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="label"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                        width={50}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number, name: string) => [
                          `${value.toLocaleString("en-US")}`,
                          name === "cost" ? "Estimated Cost" : name,
                        ]}
                      />
                      <Bar
                        dataKey="cost"
                        fill="#8b5cf6"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Simulation Tool */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Impact Simulator
              </h2>
            </div>
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">
                  Estimate Impact of User Growth
                </CardTitle>
                <CardDescription>
                  Adjust the slider to see estimated cost impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>User Growth: +40%</Label>
                      <span className="text-sm font-medium">~4,000 users</span>
                    </div>
                    <Slider
                      defaultValue={[40]}
                      max={100}
                      step={10}
                      className="w-full"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Estimated Monthly Cost
                      </p>
                      <p className="text-2xl font-bold">$4,550</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Cost per User
                      </p>
                      <p className="text-2xl font-bold">$1.14</p>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Run Full Simulation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        {/* ============================================================================
            ALERTS TAB
            ============================================================================ */}
        <TabsContent value="alerts" className="space-y-6">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Active Cost Alerts
                </h2>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configure Alerts
              </Button>
            </div>
            <div className="space-y-2">
              {costAlerts.map((alert) => {
                const categoryInfo = categoryConfig[alert.category];
                const CategoryIcon = categoryInfo.icon;

                return (
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
                      !alert.acknowledged && "bg-amber-500/5",
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div
                            className={cn(
                              "p-2 rounded-lg",
                              alertSeverityConfig[alert.severity].bgColor,
                            )}
                          >
                            <CategoryIcon
                              className={cn("h-5 w-5", categoryInfo.color)}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <AlertSeverityBadge severity={alert.severity} />
                              <Badge
                                variant="outline"
                                className="text-xs capitalize"
                              >
                                {alert.category}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium">
                              {alert.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Triggered{" "}
                              {new Date(alert.triggeredAt).toLocaleString(
                                "en-US",
                              )}
                            </p>
                            {alert.recommendation && (
                              <p className="text-xs text-blue-500 mt-2">
                                Recommendation: {alert.recommendation}
                              </p>
                            )}
                          </div>
                        </div>
                        {!alert.acknowledged ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              toast.success(`Alert ${alert.id} acknowledged`)
                            }
                          >
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
                );
              })}
            </div>
          </section>

          {/* Risk Indicators */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Risk Indicators
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-medium">Budget Threshold</p>
                      <p className="text-sm text-muted-foreground">
                        65% of budget consumed
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress value={65} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-500/10">
                      <HardDrive className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <p className="font-medium">Log Growth</p>
                      <p className="text-sm text-muted-foreground">
                        37% increase vs last month
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress value={78} className="h-2 bg-red-500/20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium">Cost Trend</p>
                      <p className="text-sm text-muted-foreground">
                        8.3% month-over-month
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress value={45} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </TabsContent>
      </Tabs>

      {/* ============================================================================
          BUDGET CONFIGURATION DIALOG
          ============================================================================ */}
      <Dialog open={showBudgetDialog} onOpenChange={setShowBudgetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Budget</DialogTitle>
            <DialogDescription>
              Set monthly budget limits and alert thresholds for operational
              costs.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Monthly Budget Limit</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">$</span>
                <Input
                  type="number"
                  defaultValue={costMetrics.budgetLimit}
                  className="w-full"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Warning Threshold (%)</Label>
              <Slider
                defaultValue={[75]}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Alert when budget usage exceeds this threshold
              </p>
            </div>
            <div className="space-y-2">
              <Label>Critical Threshold (%)</Label>
              <Slider
                defaultValue={[90]}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Critical alert when budget usage exceeds this threshold
              </p>
            </div>
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2">
                <Switch id="email-alerts" defaultChecked />
                <Label htmlFor="email-alerts">Email notifications</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBudgetDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowBudgetDialog(false);
                toast.success("Budget configuration saved");
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============================================================================
          COST DETAILS DIALOG
          ============================================================================ */}
      <Dialog
        open={!!selectedCostItem}
        onOpenChange={(open) => !open && setSelectedCostItem(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 capitalize">
              {selectedCostItem && (
                <>
                  {categoryConfig[selectedCostItem.category].icon &&
                    React.createElement(
                      categoryConfig[selectedCostItem.category].icon,
                      {
                        className:
                          categoryConfig[selectedCostItem.category].color,
                      },
                    )}
                  {selectedCostItem.category} Details
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Detailed breakdown and usage metrics for this cost category.
            </DialogDescription>
          </DialogHeader>
          {selectedCostItem && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Current Cost</p>
                  <p className="text-2xl font-semibold">
                    ${selectedCostItem.currentCost.toLocaleString("en-US")}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Previous Cost</p>
                  <p className="text-2xl font-semibold">
                    ${selectedCostItem.previousCost.toLocaleString("en-US")}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Projected</p>
                  <p className="text-2xl font-semibold">
                    ${selectedCostItem.projectedCost.toLocaleString("en-US")}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Usage</p>
                  <p className="text-2xl font-semibold">
                    {selectedCostItem.usage} {selectedCostItem.usageUnit}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedCostItem.details.map((detail) => (
                    <div
                      key={detail.label}
                      className="flex justify-between items-center p-3 rounded-lg bg-muted/30"
                    >
                      <span className="text-sm text-muted-foreground">
                        {detail.label}
                      </span>
                      <span className="text-sm font-medium">
                        {detail.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Trend Analysis</h4>
                <div className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      Monthly Trend
                    </span>
                    <StatusBadge status={selectedCostItem.status} />
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendIndicator
                      trend={selectedCostItem.trend}
                      value={selectedCostItem.trendValue}
                    />
                    <span className="text-sm text-muted-foreground">
                      {selectedCostItem.trend === "up"
                        ? "+"
                        : selectedCostItem.trend === "down"
                          ? "-"
                          : ""}
                      {selectedCostItem.trendValue}% vs last month
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedCostItem(null)}>
              Close
            </Button>
            <Button>Export Data</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================================
// ADDITIONAL HELPER COMPONENTS
// ============================================================================

function LayoutGrid({ className }: { className?: string }) {
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
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}

function Calculator({ className }: { className?: string }) {
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
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="16" x2="16" y1="14" y2="18" />
      <path d="M16 10h.01" />
      <path d="M12 10h.01" />
      <path d="M8 10h.01" />
      <path d="M12 14h.01" />
      <path d="M8 14h.01" />
      <path d="M12 18h.01" />
      <path d="M8 18h.01" />
    </svg>
  );
}
