"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Badge } from "@/components/dashboard/ui/badge";
import { Input } from "@/components/dashboard/ui/input";
import { Label } from "@/components/dashboard/ui/label";
import { Switch } from "@/components/dashboard/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/dashboard/ui/select";
import { Checkbox } from "@/components/dashboard/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { Progress } from "@/components/dashboard/ui/progress";
import { MetricCard } from "@/components/dashboard/metric-card";
import {
  Users,
  Smartphone,
  Key,
  RefreshCw,
  Plus,
  Settings,
  Trash2,
  Activity,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Clock,
  FileText,
  Webhook,
  Upload,
  Shield,
  Info,
  History,
  Pause,
  Play,
  Server,
  ArrowRightLeft,
  Zap,
  Filter,
  Search,
  ChevronRight,
  LayoutGrid,
  List,
  Terminal,
  Lock,
  Globe,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SourceType = "scim" | "api" | "csv" | "webhook";
type SyncMode = "create_only" | "update_only" | "full_sync";
type SourceStatus = "enabled" | "disabled" | "error" | "syncing";
type AuthMethod = "token" | "basic" | "mtls" | "oauth";
type ProvisioningTarget = "users" | "devices" | "credentials";

interface ProvisioningSource {
  id: string;
  name: string;
  type: SourceType;
  status: SourceStatus;
  description: string;
  authMethod: AuthMethod;
  endpoint?: string;
  syncMode: SyncMode;
  schedule?: string;
  lastActivity: string;
  lastRunStatus?: "success" | "partial" | "failed" | null;
  objectsCreated: number;
  objectsUpdated: number;
  objectsRevoked: number;
  errorCount: number;
  dryRunMode: boolean;
  maxObjectsPerRun: number;
  approvalRequired: boolean;
  allowedTargets: ProvisioningTarget[];
  successRate: number;
  avgSyncTime: string;
}

interface ProvisioningRun {
  id: string;
  sourceId: string;
  sourceName: string;
  status: "success" | "partial" | "failed" | "running";
  startedAt: string;
  completedAt?: string;
  objectsCreated: number;
  objectsUpdated: number;
  objectsRevoked: number;
  errors: string[];
  triggeredBy: "scheduled" | "manual" | "webhook";
}

const typeIcons: Record<
  SourceType,
  React.ComponentType<{ className?: string }>
> = {
  scim: Server,
  api: ArrowRightLeft,
  csv: FileText,
  webhook: Webhook,
};

const typeLabels: Record<SourceType, string> = {
  scim: "SCIM 2.0",
  api: "REST API",
  csv: "CSV Import",
  webhook: "Webhook",
};

// ============================================================================
// MOCK DATA
// ============================================================================

const mockSources: ProvisioningSource[] = [
  {
    id: "scim-okta",
    name: "Okta Directory",
    type: "scim",
    status: "enabled",
    description: "Enterprise directory synchronization via SCIM 2.0 protocol",
    authMethod: "token",
    endpoint: "https://acme.okta.com/scim/v2",
    syncMode: "full_sync",
    schedule: "Every 15 minutes",
    lastActivity: "2 minutes ago",
    lastRunStatus: "success",
    objectsCreated: 2847,
    objectsUpdated: 342,
    objectsRevoked: 23,
    errorCount: 0,
    dryRunMode: false,
    maxObjectsPerRun: 5000,
    approvalRequired: false,
    allowedTargets: ["users", "devices"],
    successRate: 99.2,
    avgSyncTime: "12s",
  },
  {
    id: "api-workday",
    name: "Workday HRIS",
    type: "api",
    status: "enabled",
    description: "HR system integration for employee lifecycle management",
    authMethod: "oauth",
    syncMode: "create_only",
    schedule: "Daily at 2:00 AM",
    lastActivity: "5 hours ago",
    lastRunStatus: "partial",
    objectsCreated: 156,
    objectsUpdated: 0,
    objectsRevoked: 0,
    errorCount: 3,
    dryRunMode: false,
    maxObjectsPerRun: 1000,
    approvalRequired: true,
    allowedTargets: ["users"],
    successRate: 94.5,
    avgSyncTime: "45s",
  },
  {
    id: "webhook-bamboo",
    name: "BambooHR Events",
    type: "webhook",
    status: "error",
    description: "Real-time updates from BambooHR webhook events",
    authMethod: "token",
    syncMode: "full_sync",
    lastActivity: "3 days ago",
    lastRunStatus: "failed",
    objectsCreated: 0,
    objectsUpdated: 0,
    objectsRevoked: 0,
    errorCount: 15,
    dryRunMode: false,
    maxObjectsPerRun: 500,
    approvalRequired: false,
    allowedTargets: ["users"],
    successRate: 23.1,
    avgSyncTime: "N/A",
  },
  {
    id: "csv-import",
    name: "Legacy Import",
    type: "csv",
    status: "disabled",
    description: "Manual CSV import for bulk data migration",
    authMethod: "token",
    syncMode: "create_only",
    lastActivity: "Never",
    lastRunStatus: null,
    objectsCreated: 0,
    objectsUpdated: 0,
    objectsRevoked: 0,
    errorCount: 0,
    dryRunMode: true,
    maxObjectsPerRun: 10000,
    approvalRequired: true,
    allowedTargets: ["users", "devices", "credentials"],
    successRate: 0,
    avgSyncTime: "N/A",
  },
];

const mockRuns: ProvisioningRun[] = [
  {
    id: "run-001",
    sourceId: "scim-okta",
    sourceName: "Okta Directory",
    status: "success",
    startedAt: "2 minutes ago",
    completedAt: "2 minutes ago",
    objectsCreated: 3,
    objectsUpdated: 7,
    objectsRevoked: 0,
    errors: [],
    triggeredBy: "scheduled",
  },
  {
    id: "run-002",
    sourceId: "api-workday",
    sourceName: "Workday HRIS",
    status: "partial",
    startedAt: "5 hours ago",
    completedAt: "5 hours ago",
    objectsCreated: 23,
    objectsUpdated: 0,
    objectsRevoked: 0,
    errors: [
      "Duplicate email: john.doe@company.com",
      "Invalid department ID: DEPT-999",
    ],
    triggeredBy: "scheduled",
  },
  {
    id: "run-003",
    sourceId: "webhook-bamboo",
    sourceName: "BambooHR Events",
    status: "failed",
    startedAt: "3 days ago",
    completedAt: "3 days ago",
    objectsCreated: 0,
    objectsUpdated: 0,
    objectsRevoked: 0,
    errors: [
      "Authentication failed: Invalid bearer token",
      "Endpoint returned 401",
    ],
    triggeredBy: "webhook",
  },
];

interface TargetConfig {
  id: ProvisioningTarget;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  dependencies?: ProvisioningTarget[];
}

const targetConfigs: TargetConfig[] = [
  {
    id: "users",
    name: "User Identities",
    description: "Provision and manage user accounts and profiles",
    icon: Users,
    color: "blue",
  },
  {
    id: "devices",
    name: "Device Registrations",
    description: "Provision device identities and trust relationships",
    icon: Smartphone,
    color: "purple",
    dependencies: ["users"],
  },
  {
    id: "credentials",
    name: "Digital Credentials",
    description: "Provision badges, wallets, and machine credentials",
    icon: Key,
    color: "amber",
    dependencies: ["users"],
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getStatusBadge(status: SourceStatus) {
  const configs = {
    enabled: {
      variant: "default" as const,
      label: "Active",
      icon: CheckCircle2,
      className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    },
    disabled: {
      variant: "secondary" as const,
      label: "Disabled",
      icon: Pause,
      className: "bg-muted text-muted-foreground",
    },
    error: {
      variant: "destructive" as const,
      label: "Error",
      icon: AlertCircle,
      className: "",
    },
    syncing: {
      variant: "default" as const,
      label: "Syncing",
      icon: RefreshCw,
      className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    },
  };
  const config = configs[status];
  return (
    <Badge
      variant={config.variant}
      className={cn("text-xs gap-1.5 px-2 py-0.5", config.className)}
    >
      <config.icon
        className={cn("h-3 w-3", status === "syncing" && "animate-spin")}
      />
      {config.label}
    </Badge>
  );
}

function getRunStatusBadge(status: ProvisioningRun["status"]) {
  const configs = {
    success: {
      className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      icon: CheckCircle2,
      label: "Success",
    },
    partial: {
      className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      icon: AlertTriangle,
      label: "Partial",
    },
    failed: {
      className: "bg-red-500/10 text-red-600 border-red-500/20",
      icon: AlertCircle,
      label: "Failed",
    },
    running: {
      className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      icon: RefreshCw,
      label: "Running",
    },
  };
  const config = configs[status];
  return (
    <Badge
      variant="outline"
      className={cn("text-xs gap-1.5", config.className)}
    >
      <config.icon
        className={cn("h-3 w-3", status === "running" && "animate-spin")}
      />
      {config.label}
    </Badge>
  );
}

function getSuccessRateColor(rate: number): string {
  if (rate >= 95) return "text-emerald-600";
  if (rate >= 80) return "text-amber-600";
  return "text-red-600";
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ProvisioningPage() {
  // State
  const idCounterRef = React.useRef(0);
  const [sources, setSources] =
    React.useState<ProvisioningSource[]>(mockSources);
  const [enabledTargets, setEnabledTargets] = React.useState<
    ProvisioningTarget[]
  >(["users", "devices"]);
  const [isProvisioningEnabled, setIsProvisioningEnabled] =
    React.useState(true);
  const [selectedSource, setSelectedSource] =
    React.useState<ProvisioningSource | null>(null);
  const [isConfigOpen, setIsConfigOpen] = React.useState(false);
  const [sourceToDelete, setSourceToDelete] =
    React.useState<ProvisioningSource | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("overview");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<SourceStatus | "all">(
    "all",
  );
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  // Derived metrics
  const enabledCount = sources.filter((s) => s.status === "enabled").length;
  const errorCount = sources.filter((s) => s.status === "error").length;
  const syncingCount = sources.filter((s) => s.status === "syncing").length;
  const totalObjects = sources.reduce(
    (acc, s) => acc + s.objectsCreated + s.objectsUpdated,
    0,
  );
  const avgSuccessRate =
    sources.length > 0
      ? sources
          .filter((s) => s.status === "enabled")
          .reduce((acc, s) => acc + s.successRate, 0) / enabledCount
      : 0;

  // Filtered sources
  const filteredSources = sources.filter((source) => {
    const matchesSearch =
      source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || source.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handlers
  const handleToggleSource = (sourceId: string) => {
    setSources((prev) =>
      prev.map((s) => {
        if (s.id !== sourceId) return s;
        const newStatus = s.status === "enabled" ? "disabled" : "enabled";
        return { ...s, status: newStatus };
      }),
    );
  };

  const handleConfigure = (source: ProvisioningSource) => {
    setSelectedSource({ ...source });
    setIsConfigOpen(true);
  };

  const handleSaveConfiguration = () => {
    if (!selectedSource) return;
    setSources((prev) =>
      prev.map((s) => (s.id === selectedSource.id ? selectedSource : s)),
    );
    setIsConfigOpen(false);
    setSelectedSource(null);
  };

  const handleDelete = (source: ProvisioningSource) => {
    setSourceToDelete(source);
  };

  const confirmDelete = () => {
    if (!sourceToDelete) return;
    setSources((prev) => prev.filter((s) => s.id !== sourceToDelete.id));
    setSourceToDelete(null);
  };

  const handleAddSource = (type: SourceType) => {
    idCounterRef.current += 1;
    const newSource: ProvisioningSource = {
      id: `new-${idCounterRef.current}`,
      name: `New ${typeLabels[type]}`,
      type,
      status: "disabled",
      description: "Configure this provisioning source",
      authMethod: "token",
      syncMode: "full_sync",
      lastActivity: "Never",
      lastRunStatus: null,
      objectsCreated: 0,
      objectsUpdated: 0,
      objectsRevoked: 0,
      errorCount: 0,
      dryRunMode: true,
      maxObjectsPerRun: 1000,
      approvalRequired: false,
      allowedTargets: ["users"],
      successRate: 0,
      avgSyncTime: "N/A",
    };
    setSources((prev) => [...prev, newSource]);
    setIsAddDialogOpen(false);
    handleConfigure(newSource);
  };

  const handleManualSync = (sourceId: string) => {
    setSources((prev) =>
      prev.map((s) => (s.id === sourceId ? { ...s, status: "syncing" } : s)),
    );
    // Simulate sync completion
    setTimeout(() => {
      setSources((prev) =>
        prev.map((s) =>
          s.id === sourceId
            ? {
                ...s,
                status: "enabled",
                lastActivity: "Just now",
                lastRunStatus: "success",
              }
            : s,
        ),
      );
    }, 2000);
  };

  const canEnableTarget = (target: ProvisioningTarget): boolean => {
    const targetConfig = targetConfigs.find((t) => t.id === target);
    if (!targetConfig?.dependencies) return true;
    return targetConfig.dependencies.every((dep) =>
      enabledTargets.includes(dep),
    );
  };

  return (
    <div className="space-y-6 text-foreground">
      {/* =========================================================================
          HEADER SECTION
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-card-foreground">
              Identity Provisioning
            </h1>
            <Badge
              variant={isProvisioningEnabled ? "default" : "secondary"}
              className={cn(
                "text-xs gap-1.5",
                isProvisioningEnabled &&
                  "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
              )}
            >
              {isProvisioningEnabled ? (
                <>
                  <Play className="h-3 w-3" />
                  Enabled
                </>
              ) : (
                <>
                  <Pause className="h-3 w-3" />
                  Disabled
                </>
              )}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Automate identity lifecycle management from external systems and
            directories
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsAddDialogOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Source
          </Button>
          <Button className="gap-2">
            <Settings className="h-4 w-4" />
            Configure
          </Button>
        </div>
      </div>

      {/* =========================================================================
          PROVISIONING METRICS
          ========================================================================= */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Provisioning Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            title="Active Sources"
            value={enabledCount}
            subtitle={`${errorCount > 0 ? `${errorCount} with errors` : "All healthy"}`}
            icon={Server}
            variant={errorCount > 0 ? "warning" : "default"}
          />
          <MetricCard
            title="Objects Synced"
            value={totalObjects.toLocaleString()}
            subtitle="Total provisioned"
            icon={Database}
            trend={{ value: 12.5, isPositive: true }}
          />
          <MetricCard
            title="Success Rate"
            value={`${avgSuccessRate.toFixed(1)}%`}
            subtitle="Last 30 days"
            icon={Activity}
            variant={
              avgSuccessRate >= 95
                ? "default"
                : avgSuccessRate >= 80
                  ? "warning"
                  : "destructive"
            }
          />
          <MetricCard
            title="Queue Status"
            value={syncingCount > 0 ? "Syncing" : "Idle"}
            subtitle={
              syncingCount > 0
                ? `${syncingCount} jobs running`
                : "No active jobs"
            }
            icon={RefreshCw}
            variant={syncingCount > 0 ? "accent" : "default"}
          />
        </div>
      </section>

      {/* =========================================================================
          MAIN CONTENT TABS
          ========================================================================= */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4 lg:w-fit">
          <TabsTrigger value="overview" className="gap-2">
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="sources" className="gap-2">
            <Server className="h-4 w-4" />
            <span className="hidden sm:inline">Sources</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Activity</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          {/* System Health */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-medium">
                      Provisioning Health
                    </CardTitle>
                    <CardDescription>
                      Real-time status of all provisioning sources
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sources.slice(0, 3).map((source) => {
                    const Icon = typeIcons[source.type];
                    const isError = source.status === "error";
                    const isSyncing = source.status === "syncing";

                    return (
                      <div
                        key={source.id}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-lg border transition-colors",
                          isError
                            ? "border-red-500/20 bg-red-500/5"
                            : "border-border bg-secondary/30",
                          isSyncing && "border-blue-500/20 bg-blue-500/5",
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-md",
                            isError
                              ? "bg-red-500/10"
                              : isSyncing
                                ? "bg-blue-500/10"
                                : "bg-secondary",
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-5 w-5",
                              isError
                                ? "text-red-500"
                                : isSyncing
                                  ? "text-blue-500"
                                  : "text-muted-foreground",
                            )}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {source.name}
                            </span>
                            {getStatusBadge(source.status)}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {source.description}
                          </p>
                          <div className="flex items-center gap-4 mt-1 text-xs">
                            <span className="text-muted-foreground">
                              Success rate:{" "}
                              <span
                                className={getSuccessRateColor(
                                  source.successRate,
                                )}
                              >
                                {source.successRate}%
                              </span>
                            </span>
                            <span className="text-muted-foreground">
                              Last: {source.lastActivity}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {source.status === "enabled" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleManualSync(source.id)}
                              className="gap-1"
                            >
                              <RefreshCw className="h-3.5 w-3.5" />
                              Sync Now
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleConfigure(source)}
                            className="h-8 w-8"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {sources.length > 3 && (
                    <Button
                      variant="ghost"
                      className="w-full gap-2 text-muted-foreground"
                      onClick={() => setActiveTab("sources")}
                    >
                      View all {sources.length} sources
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">
                  Quick Stats
                </CardTitle>
                <CardDescription>Last 24 hours activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Created</span>
                    <span className="font-medium text-emerald-600">+47</span>
                  </div>
                  <Progress value={75} className="h-2 bg-secondary" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Updated</span>
                    <span className="font-medium text-blue-600">+128</span>
                  </div>
                  <Progress value={60} className="h-2 bg-secondary" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Revoked</span>
                    <span className="font-medium text-amber-600">-12</span>
                  </div>
                  <Progress value={20} className="h-2 bg-secondary" />
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Changes
                    </span>
                    <span className="text-lg font-semibold">163</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-medium">
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Latest provisioning operations
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab("activity")}
                >
                  View all
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockRuns.slice(0, 3).map((run, index) => (
                  <div
                    key={run.id}
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-lg",
                      index !== mockRuns.length - 1 &&
                        "border-b border-border/50",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full",
                        run.status === "success" && "bg-emerald-500/10",
                        run.status === "partial" && "bg-amber-500/10",
                        run.status === "failed" && "bg-red-500/10",
                      )}
                    >
                      {run.status === "success" && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      )}
                      {run.status === "partial" && (
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                      )}
                      {run.status === "failed" && (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {run.sourceName}
                        </span>
                        {getRunStatusBadge(run.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {run.objectsCreated > 0 &&
                          `${run.objectsCreated} created `}
                        {run.objectsUpdated > 0 &&
                          `${run.objectsUpdated} updated `}
                        {run.objectsRevoked > 0 &&
                          `${run.objectsRevoked} revoked`}
                        {run.errors.length > 0 &&
                          ` • ${run.errors.length} errors`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {run.startedAt}
                      </p>
                      <Badge variant="outline" className="text-[10px] mt-1">
                        {run.triggeredBy}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SOURCES TAB */}
        <TabsContent value="sources" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={statusFilter}
                onValueChange={(v) =>
                  setStatusFilter(v as SourceStatus | "all")
                }
              >
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="enabled">Active</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="syncing">Syncing</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-9 w-9 rounded-none rounded-l-md"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-9 w-9 rounded-none rounded-r-md"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sources Grid */}
          {viewMode === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredSources.map((source) => {
                const Icon = typeIcons[source.type];
                const isError = source.status === "error";

                return (
                  <Card
                    key={source.id}
                    className={cn(
                      "border-border bg-card overflow-hidden",
                      source.status === "disabled" && "opacity-75",
                      isError && "border-red-500/50",
                    )}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-lg",
                              isError ? "bg-red-500/10" : "bg-secondary",
                            )}
                          >
                            <Icon
                              className={cn(
                                "h-5 w-5",
                                isError
                                  ? "text-red-500"
                                  : "text-muted-foreground",
                              )}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-sm font-medium text-foreground">
                                {source.name}
                              </CardTitle>
                              <Badge variant="outline" className="text-[10px]">
                                {typeLabels[source.type]}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {source.description}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(source.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {isError && (
                        <div className="flex items-center gap-2 p-2 rounded-md bg-red-500/10 text-red-600 text-xs">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          <span>{source.errorCount} errors detected</span>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-2 rounded-md bg-secondary/50">
                          <span className="text-muted-foreground block">
                            Success Rate
                          </span>
                          <span
                            className={cn(
                              "font-medium",
                              getSuccessRateColor(source.successRate),
                            )}
                          >
                            {source.successRate}%
                          </span>
                        </div>
                        <div className="p-2 rounded-md bg-secondary/50">
                          <span className="text-muted-foreground block">
                            Avg Sync
                          </span>
                          <span className="font-medium">
                            {source.avgSyncTime}
                          </span>
                        </div>
                        <div className="p-2 rounded-md bg-secondary/50">
                          <span className="text-muted-foreground block">
                            Created
                          </span>
                          <span className="font-medium text-emerald-600">
                            {source.objectsCreated}
                          </span>
                        </div>
                        <div className="p-2 rounded-md bg-secondary/50">
                          <span className="text-muted-foreground block">
                            Updated
                          </span>
                          <span className="font-medium text-blue-600">
                            {source.objectsUpdated}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Last activity: {source.lastActivity}</span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <Switch
                          checked={source.status === "enabled"}
                          onCheckedChange={() => handleToggleSource(source.id)}
                        />
                        <div className="flex gap-1">
                          {source.status === "enabled" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleManualSync(source.id)}
                              className="h-8 gap-1"
                            >
                              <RefreshCw className="h-3.5 w-3.5" />
                              Sync
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleConfigure(source)}
                            className="h-8 w-8"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(source)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="border-border bg-card">
              <CardContent className="p-0">
                {filteredSources.map((source, index) => {
                  const Icon = typeIcons[source.type];
                  return (
                    <div
                      key={source.id}
                      className={cn(
                        "flex items-center gap-4 p-4",
                        index !== filteredSources.length - 1 &&
                          "border-b border-border",
                      )}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{source.name}</span>
                          <Badge variant="outline" className="text-[10px]">
                            {typeLabels[source.type]}
                          </Badge>
                          {getStatusBadge(source.status)}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {source.description}
                        </p>
                      </div>
                      <div className="hidden md:flex items-center gap-6 text-sm">
                        <div className="text-right">
                          <span className="text-muted-foreground block text-xs">
                            Success Rate
                          </span>
                          <span
                            className={getSuccessRateColor(source.successRate)}
                          >
                            {source.successRate}%
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-muted-foreground block text-xs">
                            Objects
                          </span>
                          <span>
                            {source.objectsCreated + source.objectsUpdated}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-muted-foreground block text-xs">
                            Last Run
                          </span>
                          <span>{source.lastActivity}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Switch
                          checked={source.status === "enabled"}
                          onCheckedChange={() => handleToggleSource(source.id)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleConfigure(source)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ACTIVITY TAB */}
        <TabsContent value="activity" className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Provisioning Runs
              </CardTitle>
              <CardDescription>
                History of all provisioning operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRuns.map((run) => (
                  <div
                    key={run.id}
                    className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-secondary/30 transition-colors"
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full shrink-0",
                        run.status === "success" && "bg-emerald-500/10",
                        run.status === "partial" && "bg-amber-500/10",
                        run.status === "failed" && "bg-red-500/10",
                      )}
                    >
                      {run.status === "success" && (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      )}
                      {run.status === "partial" && (
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                      )}
                      {run.status === "failed" && (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{run.sourceName}</span>
                        {getRunStatusBadge(run.status)}
                        <Badge variant="outline" className="text-[10px]">
                          {run.triggeredBy}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm">
                        {run.objectsCreated > 0 && (
                          <span className="text-emerald-600">
                            +{run.objectsCreated} created
                          </span>
                        )}
                        {run.objectsUpdated > 0 && (
                          <span className="text-blue-600">
                            +{run.objectsUpdated} updated
                          </span>
                        )}
                        {run.objectsRevoked > 0 && (
                          <span className="text-amber-600">
                            -{run.objectsRevoked} revoked
                          </span>
                        )}
                      </div>
                      {run.errors.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {run.errors.map((error, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-xs text-red-600"
                            >
                              <AlertCircle className="h-3 w-3" />
                              {error}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>{run.startedAt}</p>
                      {run.completedAt && run.completedAt !== run.startedAt && (
                        <p className="text-xs">Completed {run.completedAt}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SETTINGS TAB */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Global Settings */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Global Configuration
                </CardTitle>
                <CardDescription>
                  Manage provisioning system-wide settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Enable Provisioning</Label>
                    <p className="text-xs text-muted-foreground">
                      Master toggle for all provisioning operations
                    </p>
                  </div>
                  <Switch
                    checked={isProvisioningEnabled}
                    onCheckedChange={setIsProvisioningEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Dry Run Mode</Label>
                    <p className="text-xs text-muted-foreground">
                      Simulate changes without applying them
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Auto-retry Failed Jobs</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically retry failed provisioning runs
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label>Default Max Objects Per Run</Label>
                  <Input type="number" defaultValue={5000} />
                  <p className="text-xs text-muted-foreground">
                    Safety limit for bulk operations
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Targets Configuration */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Provisioning Targets
                </CardTitle>
                <CardDescription>
                  Enable identity types for provisioning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {targetConfigs.map((target) => {
                    const Icon = target.icon;
                    const isEnabled = enabledTargets.includes(target.id);
                    const canEnable = canEnableTarget(target.id);

                    return (
                      <div
                        key={target.id}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg border transition-colors",
                          isEnabled
                            ? "border-primary/20 bg-primary/5"
                            : "border-border bg-secondary/30",
                        )}
                      >
                        <Checkbox
                          id={target.id}
                          checked={isEnabled}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setEnabledTargets([...enabledTargets, target.id]);
                            } else {
                              setEnabledTargets(
                                enabledTargets.filter((t) => t !== target.id),
                              );
                            }
                          }}
                          disabled={!canEnable && !isEnabled}
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor={target.id}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Icon className="h-4 w-4" />
                            {target.name}
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1">
                            {target.description}
                          </p>
                          {target.dependencies &&
                            target.dependencies.length > 0 && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Requires:{" "}
                                {target.dependencies
                                  .map(
                                    (d) =>
                                      targetConfigs.find((t) => t.id === d)
                                        ?.name,
                                  )
                                  .join(", ")}
                              </p>
                            )}
                          {!canEnable && !isEnabled && (
                            <p className="text-xs text-destructive mt-1">
                              Enable required dependencies first
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="border-border bg-card lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Security & Compliance
                </CardTitle>
                <CardDescription>
                  Configure security policies for provisioning
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Require Approval for Deletes
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Admin approval required for identity revocation
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Enforce MFA for API Access
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Require MFA for provisioning API calls
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm flex items-center gap-2">
                        <Terminal className="h-4 w-4" />
                        Audit All Operations
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Log all provisioning actions for compliance
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        IP Allowlist Enforcement
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Restrict provisioning sources to allowed IPs
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="rounded-md bg-secondary/50 p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium">Security Note</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Authentication credentials for provisioning sources are
                        encrypted at rest using AES-256 and transmitted securely
                        via TLS 1.3. Credential rotation should be performed
                        regularly according to your security policies.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* =========================================================================
          DIALOGS
          ========================================================================= */}

      {/* Configuration Dialog */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedSource &&
                React.createElement(typeIcons[selectedSource.type], {
                  className: "h-5 w-5",
                })}
              Configure {selectedSource?.name}
            </DialogTitle>
            <DialogDescription>
              Update provisioning source settings and synchronization parameters
            </DialogDescription>
          </DialogHeader>

          {selectedSource && (
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">
                  Source Settings
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="source-name">Source Name</Label>
                  <Input
                    id="source-name"
                    value={selectedSource.name}
                    onChange={(e) =>
                      setSelectedSource({
                        ...selectedSource,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="auth-method">Authentication Method</Label>
                  <Select
                    value={selectedSource.authMethod}
                    onValueChange={(value: AuthMethod) =>
                      setSelectedSource({
                        ...selectedSource,
                        authMethod: value,
                      })
                    }
                  >
                    <SelectTrigger id="auth-method">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="token">Bearer Token</SelectItem>
                      <SelectItem value="basic">Basic Auth</SelectItem>
                      <SelectItem value="oauth">OAuth 2.0</SelectItem>
                      <SelectItem value="mtls">Mutual TLS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedSource.type !== "csv" && (
                  <div className="space-y-2">
                    <Label htmlFor="endpoint">Endpoint URL</Label>
                    <Input
                      id="endpoint"
                      value={selectedSource.endpoint || ""}
                      onChange={(e) =>
                        setSelectedSource({
                          ...selectedSource,
                          endpoint: e.target.value,
                        })
                      }
                      placeholder="https://api.example.com/scim/v2"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-sm font-medium text-foreground">
                  Sync Configuration
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="sync-mode">Sync Mode</Label>
                  <Select
                    value={selectedSource.syncMode}
                    onValueChange={(value: SyncMode) =>
                      setSelectedSource({ ...selectedSource, syncMode: value })
                    }
                  >
                    <SelectTrigger id="sync-mode">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="create_only">Create Only</SelectItem>
                      <SelectItem value="update_only">Update Only</SelectItem>
                      <SelectItem value="full_sync">Full Sync</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schedule">Schedule</Label>
                  <Input
                    id="schedule"
                    value={selectedSource.schedule || ""}
                    onChange={(e) =>
                      setSelectedSource({
                        ...selectedSource,
                        schedule: e.target.value,
                      })
                    }
                    placeholder="e.g., Every 15 minutes"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-objects">Max Objects Per Run</Label>
                  <Input
                    id="max-objects"
                    type="number"
                    value={selectedSource.maxObjectsPerRun}
                    onChange={(e) =>
                      setSelectedSource({
                        ...selectedSource,
                        maxObjectsPerRun: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-sm font-medium text-foreground">
                  Safety Options
                </h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dry-run">Dry-Run Mode</Label>
                    <p className="text-xs text-muted-foreground">
                      Simulate without making changes
                    </p>
                  </div>
                  <Switch
                    id="dry-run"
                    checked={selectedSource.dryRunMode}
                    onCheckedChange={(checked) =>
                      setSelectedSource({
                        ...selectedSource,
                        dryRunMode: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="approval">Require Approval</Label>
                    <p className="text-xs text-muted-foreground">
                      Queue for admin approval
                    </p>
                  </div>
                  <Switch
                    id="approval"
                    checked={selectedSource.approvalRequired}
                    onCheckedChange={(checked) =>
                      setSelectedSource({
                        ...selectedSource,
                        approvalRequired: checked,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveConfiguration}>
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Source Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Provisioning Source</DialogTitle>
            <DialogDescription>
              Select the type of provisioning source to configure
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            {[
              {
                type: "scim" as const,
                icon: Server,
                title: "SCIM Provider",
                desc: "Okta, Azure AD, OneLogin",
              },
              {
                type: "api" as const,
                icon: ArrowRightLeft,
                title: "REST API",
                desc: "Workday, custom HRIS",
              },
              {
                type: "webhook" as const,
                icon: Zap,
                title: "Webhook",
                desc: "Real-time event updates",
              },
              {
                type: "csv" as const,
                icon: Upload,
                title: "CSV Import",
                desc: "Manual bulk import",
              },
            ].map(({ type, icon: Icon, title, desc }) => (
              <button
                key={type}
                onClick={() => handleAddSource(type)}
                className="flex items-center gap-4 rounded-lg border border-border p-4 text-left transition-colors hover:bg-secondary/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{title}</p>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!sourceToDelete}
        onOpenChange={() => setSourceToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Provisioning Source</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {sourceToDelete?.name}? This will
              stop all synchronization from this source. Provisioned identities
              will remain in the system but will no longer be updated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove Source
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
