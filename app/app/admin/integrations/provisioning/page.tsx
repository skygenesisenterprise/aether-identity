"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

type SourceType = "scim" | "api" | "csv" | "webhook";
type SyncMode = "create_only" | "update_only" | "full_sync";
type SourceStatus = "enabled" | "disabled" | "error";
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
  scim: "SCIM",
  api: "API",
  csv: "CSV Import",
  webhook: "Webhook",
};

const syncModeLabels: Record<SyncMode, string> = {
  create_only: "Create Only",
  update_only: "Update Only",
  full_sync: "Full Sync",
};

const mockSources: ProvisioningSource[] = [
  {
    id: "scim-okta",
    name: "Okta SCIM",
    type: "scim",
    status: "enabled",
    description: "Okta directory synchronization via SCIM 2.0",
    authMethod: "token",
    endpoint: "https://identity.example.com/scim/v2",
    syncMode: "full_sync",
    schedule: "Every 15 minutes",
    lastActivity: "2 minutes ago",
    lastRunStatus: "success",
    objectsCreated: 47,
    objectsUpdated: 12,
    objectsRevoked: 3,
    errorCount: 0,
    dryRunMode: false,
    maxObjectsPerRun: 1000,
    approvalRequired: false,
    allowedTargets: ["users"],
  },
  {
    id: "api-workday",
    name: "Workday API",
    type: "api",
    status: "enabled",
    description: "Workday HRIS integration via REST API",
    authMethod: "oauth",
    syncMode: "create_only",
    schedule: "Daily at 2:00 AM",
    lastActivity: "5 hours ago",
    lastRunStatus: "partial",
    objectsCreated: 23,
    objectsUpdated: 0,
    objectsRevoked: 0,
    errorCount: 2,
    dryRunMode: false,
    maxObjectsPerRun: 500,
    approvalRequired: true,
    allowedTargets: ["users"],
  },
  {
    id: "webhook-bamboo",
    name: "BambooHR Webhook",
    type: "webhook",
    status: "error",
    description: "Real-time updates from BambooHR events",
    authMethod: "token",
    syncMode: "full_sync",
    lastActivity: "3 days ago",
    lastRunStatus: "failed",
    objectsCreated: 0,
    objectsUpdated: 0,
    objectsRevoked: 0,
    errorCount: 15,
    dryRunMode: false,
    maxObjectsPerRun: 100,
    approvalRequired: false,
    allowedTargets: ["users"],
  },
  {
    id: "csv-import",
    name: "Legacy CSV Import",
    type: "csv",
    status: "disabled",
    description: "Manual CSV file import for bulk operations",
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
    allowedTargets: ["users", "devices"],
  },
];

interface TargetConfig {
  id: ProvisioningTarget;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  dependencies?: ProvisioningTarget[];
}

const targetConfigs: TargetConfig[] = [
  {
    id: "users",
    name: "Users",
    description: "Provision user identities and accounts",
    icon: Users,
  },
  {
    id: "devices",
    name: "Devices",
    description: "Provision device identities and registrations",
    icon: Smartphone,
    dependencies: ["users"],
  },
  {
    id: "credentials",
    name: "Credentials",
    description: "Provision badges, wallets, and machine identities",
    icon: Key,
    dependencies: ["users"],
  },
];

export default function ProvisioningPage() {
  const [sources, setSources] =
    React.useState<ProvisioningSource[]>(mockSources);
  const [enabledTargets, setEnabledTargets] = React.useState<
    ProvisioningTarget[]
  >(["users"]);
  const [isProvisioningEnabled, setIsProvisioningEnabled] =
    React.useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [selectedSource, setSelectedSource] =
    React.useState<ProvisioningSource | null>(null);
  const [isConfigOpen, setIsConfigOpen] = React.useState(false);
  const [sourceToDelete, setSourceToDelete] =
    React.useState<ProvisioningSource | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [pendingTargetChanges, setPendingTargetChanges] = React.useState<
    ProvisioningTarget[] | null
  >(null);
  const [showTargetConfirm, setShowTargetConfirm] = React.useState(false);

  const enabledCount = sources.filter((s) => s.status === "enabled").length;
  const errorCount = sources.filter((s) => s.status === "error").length;
  const totalSources = sources.length;

  const getStatusBadge = (status: SourceStatus) => {
    const configs = {
      enabled: {
        variant: "default" as const,
        label: "Enabled",
        icon: CheckCircle2,
      },
      disabled: {
        variant: "secondary" as const,
        label: "Disabled",
        icon: Pause,
      },
      error: {
        variant: "destructive" as const,
        label: "Error",
        icon: AlertCircle,
      },
    };
    const config = configs[status];
    return (
      <Badge variant={config.variant} className="text-xs gap-1">
        {config.icon && <config.icon className="h-3 w-3" />}
        {config.label}
      </Badge>
    );
  };

  const getLastRunBadge = (
    status: "success" | "partial" | "failed" | null | undefined,
  ) => {
    if (!status)
      return <span className="text-xs text-muted-foreground">Never run</span>;

    if (status === "success") {
      return (
        <Badge
          variant="default"
          className="text-xs bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20"
        >
          Success
        </Badge>
      );
    }
    if (status === "partial") {
      return (
        <Badge
          variant="outline"
          className="text-xs bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20"
        >
          Partial
        </Badge>
      );
    }
    return (
      <Badge variant="destructive" className="text-xs">
        Failed
      </Badge>
    );
  };

  const handleToggleSource = (sourceId: string) => {
    setSources((prev) =>
      prev.map((s) => {
        if (s.id !== sourceId) return s;
        const newStatus = s.status === "enabled" ? "disabled" : "enabled";
        return { ...s, status: newStatus };
      }),
    );
    setHasUnsavedChanges(true);
  };

  const handleTargetToggle = (target: ProvisioningTarget, checked: boolean) => {
    const newTargets = checked
      ? [...enabledTargets, target]
      : enabledTargets.filter((t) => t !== target);

    // Check dependencies
    if (!checked) {
      const dependentTargets = targetConfigs.filter(
        (t) => t.dependencies?.includes(target) && newTargets.includes(t.id),
      );
      if (dependentTargets.length > 0) {
        // Would disable dependent targets too
        const toRemove = dependentTargets.map((t) => t.id);
        setPendingTargetChanges(
          newTargets.filter((t) => !toRemove.includes(t)),
        );
      } else {
        setPendingTargetChanges(newTargets);
      }
    } else {
      setPendingTargetChanges(newTargets);
    }
    setShowTargetConfirm(true);
  };

  const confirmTargetChanges = () => {
    if (pendingTargetChanges) {
      setEnabledTargets(pendingTargetChanges);
      setHasUnsavedChanges(true);
    }
    setShowTargetConfirm(false);
    setPendingTargetChanges(null);
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
    setHasUnsavedChanges(true);
  };

  const handleDelete = (source: ProvisioningSource) => {
    setSourceToDelete(source);
  };

  const confirmDelete = () => {
    if (!sourceToDelete) return;
    setSources((prev) => prev.filter((s) => s.id !== sourceToDelete.id));
    setSourceToDelete(null);
    setHasUnsavedChanges(true);
  };

  const handleAddSource = (type: SourceType) => {
    const newSource: ProvisioningSource = {
      id: `new-${Date.now()}`,
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
    };
    setSources((prev) => [...prev, newSource]);
    setIsAddDialogOpen(false);
    setHasUnsavedChanges(true);
    handleConfigure(newSource);
  };

  const handleSave = () => {
    setHasUnsavedChanges(false);
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
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-card-foreground">
              Provisioning
            </h1>
            <Badge
              variant={isProvisioningEnabled ? "default" : "secondary"}
              className="text-xs gap-1"
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
            {errorCount > 0 && (
              <Badge variant="destructive" className="text-xs gap-1">
                <AlertCircle className="h-3 w-3" />
                {errorCount} errors
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Configure automated identity lifecycle management from external
            systems.
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
          {hasUnsavedChanges && (
            <Button onClick={handleSave} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Save Changes
            </Button>
          )}
        </div>
      </div>

      {/* Provisioning Overview */}
      <section>
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
          Provisioning Overview
        </h2>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                <RefreshCw className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Provisioning automates the lifecycle management of identities
                  from external systems into Aether Identity. When enabled,
                  external sources can create, update, and revoke users,
                  devices, and credentials without manual intervention.
                </p>
                <p className="text-sm text-muted-foreground">
                  All provisioning actions respect your organization&apos;s
                  policies and RBAC configurations. Manual changes to
                  provisioned identities may be overridden during subsequent
                  sync operations.
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <Switch
                    id="provisioning-master-toggle"
                    checked={isProvisioningEnabled}
                    onCheckedChange={(checked) => {
                      setIsProvisioningEnabled(checked);
                      setHasUnsavedChanges(true);
                    }}
                  />
                  <Label
                    htmlFor="provisioning-master-toggle"
                    className="text-sm font-medium cursor-pointer"
                  >
                    {isProvisioningEnabled
                      ? "Provisioning is enabled"
                      : "Provisioning is disabled"}
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Provisioning Targets */}
      <section>
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
          Provisioning Targets
        </h2>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-4">
              Select which identity objects can be provisioned from external
              sources. Changes require confirmation and may affect active
              provisioning jobs.
            </p>
            <div className="space-y-4">
              {targetConfigs.map((target) => {
                const Icon = target.icon;
                const isEnabled = enabledTargets.includes(target.id);
                const canEnable = canEnableTarget(target.id);
                const hasMissingDeps =
                  !isEnabled &&
                  target.dependencies?.some(
                    (dep) => !enabledTargets.includes(dep),
                  );

                return (
                  <div
                    key={target.id}
                    className={cn(
                      "flex items-start justify-between p-4 rounded-lg border",
                      isEnabled
                        ? "border-primary/20 bg-primary/5"
                        : "border-border bg-secondary/30",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-md",
                          isEnabled ? "bg-primary/10" : "bg-secondary",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4",
                            isEnabled
                              ? "text-primary"
                              : "text-muted-foreground",
                          )}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "font-medium",
                              isEnabled
                                ? "text-foreground"
                                : "text-muted-foreground",
                            )}
                          >
                            {target.name}
                          </span>
                          {isEnabled && (
                            <Badge variant="default" className="text-xs">
                              Enabled
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {target.description}
                        </p>
                        {target.dependencies &&
                          target.dependencies.length > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Requires:{" "}
                              {target.dependencies
                                .map(
                                  (d) =>
                                    targetConfigs.find((t) => t.id === d)?.name,
                                )
                                .join(", ")}
                            </p>
                          )}
                        {hasMissingDeps && (
                          <p className="text-xs text-destructive mt-1">
                            Enable required dependencies first
                          </p>
                        )}
                      </div>
                    </div>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={(checked) =>
                        handleTargetToggle(target.id, checked)
                      }
                      disabled={!canEnable && !isEnabled}
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Provisioning Sources */}
      <section>
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
          Provisioning Sources
          <span className="ml-2 text-xs normal-case">
            ({enabledCount} active / {totalSources} total)
          </span>
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {sources.map((source) => {
            const Icon = typeIcons[source.type];
            const isError = source.status === "error";

            return (
              <Card
                key={source.id}
                className={cn(
                  "border-border bg-card",
                  source.status === "disabled" && "opacity-75",
                  isError && "border-destructive/50",
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-sm font-medium text-foreground">
                            {source.name}
                          </CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {typeLabels[source.type]}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {source.description}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(source.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isError && (
                    <Alert
                      variant="destructive"
                      className="border-red-500/30 bg-red-500/10 py-2"
                    >
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <AlertDescription className="text-xs text-red-400">
                        Provisioning failed. {source.errorCount} errors
                        detected. Review logs for details.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground">Last Run</span>
                      <div className="mt-1">
                        {getLastRunBadge(source.lastRunStatus)}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Last Activity
                      </span>
                      <div className="mt-1 font-medium">
                        {source.lastActivity}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Sync Mode</span>
                      <div className="mt-1 font-medium">
                        {syncModeLabels[source.syncMode]}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Schedule</span>
                      <div className="mt-1 font-medium">
                        {source.schedule || "On demand"}
                      </div>
                    </div>
                  </div>

                  {(source.objectsCreated > 0 ||
                    source.objectsUpdated > 0 ||
                    source.objectsRevoked > 0) && (
                    <div className="flex items-center gap-4 rounded-md bg-secondary/50 px-3 py-2">
                      <div className="text-xs">
                        <span className="text-muted-foreground">Created: </span>
                        <span className="font-medium text-green-600">
                          {source.objectsCreated}
                        </span>
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground">Updated: </span>
                        <span className="font-medium text-blue-600">
                          {source.objectsUpdated}
                        </span>
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground">Revoked: </span>
                        <span className="font-medium text-amber-600">
                          {source.objectsRevoked}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 rounded-md bg-secondary/50 px-3 py-2">
                    <Shield className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Targets: {source.allowedTargets.join(", ")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`${source.id}-toggle`}
                        checked={source.status === "enabled"}
                        onCheckedChange={() => handleToggleSource(source.id)}
                      />
                      <Label
                        htmlFor={`${source.id}-toggle`}
                        className="text-sm text-muted-foreground cursor-pointer"
                      >
                        {source.status === "enabled" ? "Enabled" : "Disabled"}
                      </Label>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleConfigure(source)}
                        className="gap-1"
                      >
                        <Settings className="h-3.5 w-3.5" />
                        Configure
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(source)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Logs & Execution State */}
      <section>
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
          Recent Activity
        </h2>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Okta SCIM sync completed
                  </p>
                  <p className="text-xs text-muted-foreground">
                    47 created, 12 updated, 3 revoked • 2 minutes ago
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Success
                </Badge>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Workday API sync partial
                  </p>
                  <p className="text-xs text-muted-foreground">
                    23 created, 2 errors (duplicate emails) • 5 hours ago
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Partial
                </Badge>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">BambooHR webhook failed</p>
                  <p className="text-xs text-muted-foreground">
                    Authentication error • 3 days ago
                  </p>
                </div>
                <Badge variant="destructive" className="text-xs">
                  Failed
                </Badge>
              </div>

              <div className="flex items-center justify-center pt-2">
                <Button variant="ghost" size="sm" className="gap-2">
                  <History className="h-4 w-4" />
                  View Full Audit Log
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Security & Policy Notes */}
      <section>
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
          Security & Policy Information
        </h2>
        <Card className="border-border bg-card">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-3 flex-1">
                <div>
                  <h4 className="text-sm font-medium text-foreground">
                    Audit & Compliance
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    All provisioning actions are fully audited with detailed
                    logs of each operation. Changes made by provisioning sources
                    are attributed and can be traced back to the originating
                    system. Audit logs are retained for compliance purposes.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-foreground">
                    Policy Enforcement
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Provisioning never bypasses RBAC, security policies, or
                    context restrictions. All provisioned identities are subject
                    to the same policies as manually created identities. Admin
                    and console contexts cannot be provisioned.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-foreground">
                    Conflict Resolution
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    When provisioning encounters conflicts (e.g., duplicate
                    identifiers), the configured resolution strategy determines
                    the outcome. Manual changes to provisioned objects may be
                    overridden during subsequent sync operations depending on
                    sync mode.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-foreground">
                    Safety Controls
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Dry-run mode allows testing provisioning configurations
                    without making actual changes. Rate limiting and maximum
                    object counts prevent accidental bulk operations. Approval
                    workflows can be enabled for high-risk provisioning sources.
                  </p>
                </div>

                <div className="rounded-md bg-secondary/50 p-3">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Security Note:</strong>{" "}
                    Authentication credentials for provisioning sources are
                    encrypted at rest and transmitted securely. Credential
                    rotation should be performed regularly according to your
                    security policies.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Target Changes Confirmation Dialog */}
      <AlertDialog open={showTargetConfirm} onOpenChange={setShowTargetConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Target Changes</AlertDialogTitle>
            <AlertDialogDescription>
              Changing provisioning targets may affect active provisioning jobs.
              Existing sources targeting disabled objects will be unable to
              sync. This action will be logged for audit purposes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setPendingTargetChanges(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmTargetChanges}>
              Confirm Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
              Update provisioning source settings and synchronization
              parameters.
            </DialogDescription>
          </DialogHeader>

          {selectedSource && (
            <div className="space-y-6 py-4">
              {/* Source Settings */}
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

              {/* Sync Configuration */}
              <div className="space-y-4 pt-4 border-t border-border">
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
                  <p className="text-xs text-muted-foreground">
                    Full sync allows create, update, and revoke operations.
                  </p>
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
                    placeholder="e.g., Every 15 minutes or Daily at 2:00 AM"
                  />
                </div>
              </div>

              {/* Targets */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-sm font-medium text-foreground">
                  Provisioning Targets
                </h3>
                <div className="space-y-2">
                  {targetConfigs.map((target) => (
                    <div key={target.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`target-${target.id}`}
                        checked={selectedSource.allowedTargets.includes(
                          target.id,
                        )}
                        onCheckedChange={(checked) => {
                          const newTargets = checked
                            ? [...selectedSource.allowedTargets, target.id]
                            : selectedSource.allowedTargets.filter(
                                (t) => t !== target.id,
                              );
                          setSelectedSource({
                            ...selectedSource,
                            allowedTargets: newTargets,
                          });
                        }}
                      />
                      <Label
                        htmlFor={`target-${target.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {target.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety Options */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-sm font-medium text-foreground">
                  Safety Options
                </h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dry-run">Dry-Run Mode</Label>
                    <p className="text-xs text-muted-foreground">
                      Simulate operations without making changes
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

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="approval-required">Require Approval</Label>
                    <p className="text-xs text-muted-foreground">
                      Queue changes for admin approval before applying
                    </p>
                  </div>
                  <Switch
                    id="approval-required"
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
              Select the type of provisioning source to configure.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <button
              onClick={() => handleAddSource("scim")}
              className="flex items-center gap-4 rounded-lg border border-border p-4 text-left transition-colors hover:bg-secondary/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                <Server className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">SCIM Provider</p>
                <p className="text-sm text-muted-foreground">
                  Okta, Azure AD, OneLogin, etc.
                </p>
              </div>
            </button>
            <button
              onClick={() => handleAddSource("api")}
              className="flex items-center gap-4 rounded-lg border border-border p-4 text-left transition-colors hover:bg-secondary/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">REST API</p>
                <p className="text-sm text-muted-foreground">
                  Workday, custom HRIS, etc.
                </p>
              </div>
            </button>
            <button
              onClick={() => handleAddSource("webhook")}
              className="flex items-center gap-4 rounded-lg border border-border p-4 text-left transition-colors hover:bg-secondary/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                <Zap className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">Webhook</p>
                <p className="text-sm text-muted-foreground">
                  Real-time event-driven updates
                </p>
              </div>
            </button>
            <button
              onClick={() => handleAddSource("csv")}
              className="flex items-center gap-4 rounded-lg border border-border p-4 text-left transition-colors hover:bg-secondary/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">CSV Import</p>
                <p className="text-sm text-muted-foreground">
                  Manual bulk import from files
                </p>
              </div>
            </button>
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
