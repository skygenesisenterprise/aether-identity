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
import { Progress } from "@/components/dashboard/ui/progress";
import { Separator } from "@/components/dashboard/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";

import {
  Globe,
  LogIn,
  UserPlus,
  KeyRound,
  CheckCircle,
  AlertTriangle,
  Shield,
  Info,
  RefreshCw,
  Server,
  Cloud,
  Layers,
  Activity,
  Check,
  X,
  ChevronRight,
  Zap,
  Lock,
  History,
  Settings2,
  ArrowUpRight,
  FileText,
  Cpu,
  Network,
} from "lucide-react";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type IntegrationMode = "internal" | "external" | "hybrid";
type PageStatus = "internal" | "external" | "disabled";
type ConnectionHealth = "healthy" | "degraded" | "unhealthy" | "unknown";
type EnvironmentType = "cloud" | "self-hosted";

interface PublicPageConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: PageStatus;
  url?: string;
  urlError?: string;
  isValidating?: boolean;
  lastHealthCheck?: Date;
  healthStatus?: ConnectionHealth;
  responseTime?: number;
}

interface IntegrationStats {
  totalPages: number;
  externalPages: number;
  internalPages: number;
  disabledPages: number;
  avgResponseTime: number;
  lastSync: Date;
}

interface AuditEvent {
  id: string;
  type: "mode_change" | "page_config" | "health_check" | "security_alert";
  description: string;
  actor: string;
  timestamp: Date;
  severity?: "info" | "warning" | "critical";
}

// ============================================================================
// MOCK DATA
// ============================================================================

const modeConfig: Record<
  IntegrationMode,
  {
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    benefits: string[];
    considerations: string[];
  }
> = {
  internal: {
    label: "Internal Hosting",
    description: "All pages served by Aether Identity",
    icon: Server,
    color: "emerald",
    benefits: [
      "Zero external dependencies",
      "Simplified maintenance",
      "Built-in security controls",
      "Automatic updates",
    ],
    considerations: ["Limited customization"],
  },
  external: {
    label: "External Hosting",
    description: "Full control on your infrastructure",
    icon: Cloud,
    color: "blue",
    benefits: [
      "Complete customization",
      "Brand consistency",
      "Advanced theming",
      "Custom workflows",
    ],
    considerations: [
      "Requires HTTPS endpoints",
      "Self-managed availability",
      "Security compliance needed",
    ],
  },
  hybrid: {
    label: "Hybrid Mode",
    description: "Mix internal and external pages",
    icon: Layers,
    color: "violet",
    benefits: [
      "Flexible migration path",
      "Gradual transition",
      "Selective customization",
      "Best of both worlds",
    ],
    considerations: [
      "Complex configuration",
      "Requires planning",
      "Monitoring essential",
    ],
  },
};

const initialPages: PublicPageConfig[] = [
  {
    id: "login",
    name: "Authentication",
    description: "Primary login and SSO entry point",
    icon: LogIn,
    status: "internal",
    url: "",
    healthStatus: "healthy",
    responseTime: 145,
  },
  {
    id: "register",
    name: "Registration",
    description: "New user onboarding flow",
    icon: UserPlus,
    status: "internal",
    url: "",
    healthStatus: "healthy",
    responseTime: 132,
  },
  {
    id: "password-reset",
    name: "Password Recovery",
    description: "Secure password reset workflow",
    icon: KeyRound,
    status: "internal",
    url: "",
    healthStatus: "healthy",
    responseTime: 128,
  },
  {
    id: "consent",
    name: "Consent & Permissions",
    description: "OAuth scopes and data permissions",
    icon: CheckCircle,
    status: "internal",
    url: "",
    healthStatus: "healthy",
    responseTime: 156,
  },
  {
    id: "error",
    name: "Error Handling",
    description: "Error pages and maintenance mode",
    icon: AlertTriangle,
    status: "internal",
    url: "",
    healthStatus: "healthy",
    responseTime: 98,
  },
];

const recentActivity: AuditEvent[] = [
  {
    id: "evt-1",
    type: "health_check",
    description: "All endpoints responding normally",
    actor: "system",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    severity: "info",
  },
  {
    id: "evt-2",
    type: "page_config",
    description: "Login page URL validated",
    actor: "admin@acme.com",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    severity: "info",
  },
  {
    id: "evt-3",
    type: "security_alert",
    description: "External URL certificate expires in 14 days",
    actor: "system",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    severity: "warning",
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatRelativeTime = (date: Date): string => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const getHealthColor = (status: ConnectionHealth): string => {
  const colors = {
    healthy: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    degraded: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    unhealthy: "text-red-500 bg-red-500/10 border-red-500/20",
    unknown: "text-slate-500 bg-slate-500/10 border-slate-500/20",
  };
  return colors[status];
};

const getHealthIcon = (status: ConnectionHealth) => {
  const icons = {
    healthy: Check,
    degraded: AlertTriangle,
    unhealthy: X,
    unknown: Activity,
  };
  return icons[status];
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ExternalIntegrationsPage() {
  // State
  const [mode, setMode] = React.useState<IntegrationMode>("internal");
  const [pages, setPages] = React.useState<PublicPageConfig[]>(initialPages);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("overview");
  const [environment] = React.useState<EnvironmentType>("cloud");
  const [showModeConfirm, setShowModeConfirm] = React.useState(false);
  const [pendingMode, setPendingMode] = React.useState<IntegrationMode | null>(
    null,
  );

  // Derived state
  const stats: IntegrationStats = React.useMemo(() => {
    const external = pages.filter((p) => p.status === "external").length;
    const internal = pages.filter((p) => p.status === "internal").length;
    const disabled = pages.filter((p) => p.status === "disabled").length;
    const avgResponse =
      pages.reduce((acc, p) => acc + (p.responseTime || 0), 0) / pages.length;

    return {
      totalPages: pages.length,
      externalPages: external,
      internalPages: internal,
      disabledPages: disabled,
      avgResponseTime: Math.round(avgResponse),
      lastSync: new Date(),
    };
  }, [pages]);

  const externalPercentage = Math.round(
    (stats.externalPages / stats.totalPages) * 100,
  );

  const hasIssues = pages.some((p) => p.healthStatus === "unhealthy");
  const hasWarnings = pages.some((p) => p.healthStatus === "degraded");

  // Validation
  const validateUrl = (url: string): string | undefined => {
    if (!url) return "URL is required";
    if (!url.startsWith("https://")) return "HTTPS required";
    try {
      new URL(url);
      return undefined;
    } catch {
      return "Invalid URL format";
    }
  };

  // Handlers
  const handleModeSelect = (newMode: IntegrationMode) => {
    if (newMode === mode) return;
    setPendingMode(newMode);
    setShowModeConfirm(true);
  };

  const confirmModeChange = () => {
    if (pendingMode) {
      setMode(pendingMode);
      setHasUnsavedChanges(true);
      setShowModeConfirm(false);
      setPendingMode(null);
    }
  };

  const handlePageStatusChange = (pageId: string, newStatus: PageStatus) => {
    setPages((prev) =>
      prev.map((page) => {
        if (page.id !== pageId) return page;
        const updated = { ...page, status: newStatus };
        if (newStatus === "external" && !page.url) {
          updated.urlError = "URL required";
        } else {
          updated.urlError = undefined;
        }
        return updated;
      }),
    );
    setHasUnsavedChanges(true);
  };

  const handleUrlChange = (pageId: string, url: string) => {
    setPages((prev) =>
      prev.map((page) => {
        if (page.id !== pageId) return page;
        const error = url ? validateUrl(url) : undefined;
        return { ...page, url, urlError: error };
      }),
    );
    setHasUnsavedChanges(true);
  };

  const handleTestConnection = async (pageId: string) => {
    setPages((prev) =>
      prev.map((page) =>
        page.id === pageId ? { ...page, isValidating: true } : page,
      ),
    );

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setPages((prev) =>
      prev.map((page) =>
        page.id === pageId
          ? {
              ...page,
              isValidating: false,
              healthStatus: "healthy",
              responseTime: Math.floor(Math.random() * 200) + 50,
              lastHealthCheck: new Date(),
            }
          : page,
      ),
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setHasUnsavedChanges(false);
  };

  const runHealthCheck = async () => {
    setPages((prev) => prev.map((page) => ({ ...page, isValidating: true })));

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setPages((prev) =>
      prev.map((page) => ({
        ...page,
        isValidating: false,
        healthStatus: Math.random() > 0.2 ? "healthy" : "degraded",
        responseTime: Math.floor(Math.random() * 300) + 50,
        lastHealthCheck: new Date(),
      })),
    );
  };

  // Render helpers
  const ModeCard = ({
    modeKey,
    isActive,
  }: {
    modeKey: IntegrationMode;
    isActive: boolean;
  }) => {
    const config = modeConfig[modeKey];
    const Icon = config.icon;

    return (
      <button
        onClick={() => handleModeSelect(modeKey)}
        className={cn(
          "relative flex flex-col items-start gap-3 rounded-xl border p-5 text-left transition-all duration-200",
          isActive
            ? `border-${config.color}-500 bg-${config.color}-500/5 shadow-sm`
            : "border-border bg-card hover:border-muted-foreground/30 hover:bg-muted/50",
        )}
      >
        {isActive && (
          <div
            className={cn(
              "absolute top-3 right-3 h-2 w-2 rounded-full",
              `bg-${config.color}-500`,
            )}
          />
        )}

        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            isActive ? `bg-${config.color}-500/10` : "bg-muted",
          )}
        >
          <Icon
            className={cn(
              "h-5 w-5",
              isActive ? `text-${config.color}-500` : "text-muted-foreground",
            )}
          />
        </div>

        <div className="space-y-1">
          <h3 className="font-semibold text-foreground">{config.label}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {config.description}
          </p>
        </div>

        <div className="w-full pt-2 space-y-1.5">
          {config.benefits.slice(0, 2).map((benefit, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-xs">
              <Check className="h-3 w-3 text-emerald-500" />
              <span className="text-muted-foreground">{benefit}</span>
            </div>
          ))}
        </div>
      </button>
    );
  };

  const StatusBadge = ({ status }: { status: PageStatus }) => {
    const configs = {
      internal: {
        variant: "default" as const,
        label: "Internal",
        icon: Server,
      },
      external: {
        variant: "outline" as const,
        label: "External",
        icon: Cloud,
      },
      disabled: {
        variant: "secondary" as const,
        label: "Disabled",
        icon: X,
      },
    };
    const config = configs[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1 text-xs font-medium">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <TooltipProvider>
      <div className="space-y-6 text-foreground">
        {/* =========================================================================
            HEADER SECTION
            ========================================================================= */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-card-foreground">
                External Integrations
              </h1>
              <Badge
                variant={mode === "internal" ? "default" : "outline"}
                className="font-medium"
              >
                {modeConfig[mode].label}
              </Badge>
              {environment === "self-hosted" && (
                <Badge variant="secondary" className="font-medium">
                  <Cpu className="h-3 w-3 mr-1" />
                  Self-Hosted
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Configure how public authentication pages are served and managed
            </p>
          </div>

          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <Badge
                variant="outline"
                className="text-amber-500 border-amber-500/30"
              >
                Unsaved changes
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={runHealthCheck}
              className="gap-2"
            >
              <Activity className="h-4 w-4" />
              Health Check
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!hasUnsavedChanges || isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </div>

        {/* =========================================================================
            OVERVIEW DASHBOARD
            ========================================================================= */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "h-2 w-2 rounded-full",
                hasIssues
                  ? "bg-red-500 animate-pulse"
                  : hasWarnings
                    ? "bg-amber-500"
                    : "bg-emerald-500",
              )}
            />
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              System Overview
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Integration Progress */}
            <Card className="border-border bg-card md:col-span-2">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      External Integration
                    </p>
                    <p className="text-2xl font-semibold mt-1">
                      {externalPercentage}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {stats.externalPages} of {stats.totalPages} pages
                      externalized
                    </p>
                  </div>
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center",
                      externalPercentage === 0
                        ? "bg-emerald-500/10"
                        : externalPercentage === 100
                          ? "bg-blue-500/10"
                          : "bg-violet-500/10",
                    )}
                  >
                    <Globe
                      className={cn(
                        "h-5 w-5",
                        externalPercentage === 0
                          ? "text-emerald-500"
                          : externalPercentage === 100
                            ? "text-blue-500"
                            : "text-violet-500",
                      )}
                    />
                  </div>
                </div>
                <Progress value={externalPercentage} className="h-2" />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>Internal</span>
                  <span>Hybrid</span>
                  <span>External</span>
                </div>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card className="border-border bg-card">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Avg Response
                    </p>
                    <p className="text-2xl font-semibold mt-1">
                      {stats.avgResponseTime}ms
                    </p>
                    <p className="text-xs text-emerald-500 mt-0.5">
                      Optimal performance
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-emerald-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Status */}
            <Card className="border-border bg-card">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Security Status
                    </p>
                    <p className="text-2xl font-semibold mt-1">
                      {hasIssues ? "Issues" : hasWarnings ? "Warnings" : "Good"}
                    </p>
                    <p
                      className={cn(
                        "text-xs mt-0.5",
                        hasIssues
                          ? "text-red-500"
                          : hasWarnings
                            ? "text-amber-500"
                            : "text-emerald-500",
                      )}
                    >
                      {hasIssues
                        ? "Action required"
                        : hasWarnings
                          ? "Review recommended"
                          : "All checks passed"}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center",
                      hasIssues
                        ? "bg-red-500/10"
                        : hasWarnings
                          ? "bg-amber-500/10"
                          : "bg-emerald-500/10",
                    )}
                  >
                    <Shield
                      className={cn(
                        "h-5 w-5",
                        hasIssues
                          ? "text-red-500"
                          : hasWarnings
                            ? "text-amber-500"
                            : "text-emerald-500",
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
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
          <TabsList className="bg-muted/50">
            <TabsTrigger value="overview" className="gap-2">
              <Settings2 className="h-4 w-4" />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="pages" className="gap-2">
              <FileText className="h-4 w-4" />
              Public Pages
              <Badge variant="secondary" className="ml-1 text-xs">
                {pages.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="gap-2">
              <Activity className="h-4 w-4" />
              Monitoring
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <History className="h-4 w-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          {/* CONFIGURATION TAB */}
          <TabsContent value="overview" className="space-y-6">
            {/* Mode Selection */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-foreground">
                    Architecture Mode
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Choose how public pages are hosted and served
                  </p>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>
                      Changing modes affects all users immediately. Ensure you
                      have tested your configuration.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {(["internal", "external", "hybrid"] as IntegrationMode[]).map(
                  (m) => (
                    <ModeCard key={m} modeKey={m} isActive={mode === m} />
                  ),
                )}
              </div>

              {/* Mode Confirmation */}
              {showModeConfirm && pendingMode && (
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-amber-700">
                        Confirm Architecture Change
                      </h4>
                      <p className="text-sm text-amber-600 mt-1">
                        Switching to {modeConfig[pendingMode].label} will
                        {pendingMode === "external"
                          ? " require all external URLs to be configured"
                          : pendingMode === "internal"
                            ? " disable all external page configurations"
                            : " require per-page configuration"}
                        . This change will be logged for audit purposes.
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" onClick={confirmModeChange}>
                          Confirm Change
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setShowModeConfirm(false);
                            setPendingMode(null);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Quick Stats */}
            <section className="grid gap-4 md:grid-cols-3">
              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Network className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Endpoints
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stats.externalPages} external configured
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <Lock className="h-4 w-4 text-violet-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        SSL/TLS
                      </p>
                      <p className="text-xs text-muted-foreground">
                        All external endpoints use HTTPS
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Validation
                      </p>
                      <p className="text-xs text-muted-foreground">
                        All URLs verified and active
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          {/* PAGES TAB */}
          <TabsContent value="pages" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-foreground">
                  Public Page Configuration
                </h3>
                <p className="text-xs text-muted-foreground">
                  Manage individual page hosting and routing
                </p>
              </div>
              {mode === "hybrid" && (
                <Badge variant="outline" className="text-xs">
                  Hybrid mode active - configure per page
                </Badge>
              )}
            </div>

            <div className="grid gap-4">
              {pages.map((page) => {
                const Icon = page.icon;
                const HealthIcon = getHealthIcon(
                  page.healthStatus || "unknown",
                );
                const showUrlConfig =
                  mode === "external" ||
                  (mode === "hybrid" && page.status === "external");
                const isConfigurable = mode !== "internal";

                return (
                  <Card
                    key={page.id}
                    className={cn(
                      "border-border bg-card transition-all",
                      page.status === "disabled" && "opacity-75",
                    )}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Icon & Info */}
                        <div className="flex items-start gap-3 flex-1">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary shrink-0">
                            <Icon className="h-5 w-5 text-muted-foreground" />
                          </div>

                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-foreground">
                                {page.name}
                              </h4>
                              <StatusBadge status={page.status} />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {page.description}
                            </p>

                            {/* URL Configuration */}
                            {showUrlConfig && (
                              <div className="pt-3 space-y-2">
                                <Label
                                  htmlFor={`${page.id}-url`}
                                  className="text-xs font-medium"
                                >
                                  External Endpoint URL
                                </Label>
                                <div className="flex gap-2">
                                  <div className="relative flex-1">
                                    <Input
                                      id={`${page.id}-url`}
                                      type="url"
                                      placeholder="https://auth.yourdomain.com/login"
                                      value={page.url}
                                      onChange={(e) =>
                                        handleUrlChange(page.id, e.target.value)
                                      }
                                      className={cn(
                                        "pr-10",
                                        page.urlError && "border-red-500",
                                      )}
                                    />
                                    {page.url && !page.urlError && (
                                      <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                                    )}
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                      handleTestConnection(page.id)
                                    }
                                    disabled={
                                      !!page.urlError ||
                                      !page.url ||
                                      page.isValidating
                                    }
                                  >
                                    {page.isValidating ? (
                                      <RefreshCw className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <ArrowUpRight className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                                {page.urlError && (
                                  <p className="text-xs text-red-500">
                                    {page.urlError}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col items-end gap-3 shrink-0">
                          {isConfigurable && mode === "hybrid" && (
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor={`${page.id}-toggle`}
                                className="text-xs text-muted-foreground"
                              >
                                External
                              </Label>
                              <Switch
                                id={`${page.id}-toggle`}
                                checked={page.status === "external"}
                                onCheckedChange={(checked) =>
                                  handlePageStatusChange(
                                    page.id,
                                    checked ? "external" : "internal",
                                  )
                                }
                              />
                            </div>
                          )}

                          {/* Health Status */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={cn(
                                  "flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs",
                                  getHealthColor(
                                    page.healthStatus || "unknown",
                                  ),
                                )}
                              >
                                <HealthIcon className="h-3 w-3" />
                                <span className="capitalize">
                                  {page.healthStatus || "Unknown"}
                                </span>
                                {page.responseTime && (
                                  <span className="opacity-60">
                                    {page.responseTime}ms
                                  </span>
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Last checked:
                                {page.lastHealthCheck
                                  ? formatRelativeTime(page.lastHealthCheck)
                                  : "Never"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* MONITORING TAB */}
          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Connection Health */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    Endpoint Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pages.map((page) => {
                    const HealthIcon = getHealthIcon(
                      page.healthStatus || "unknown",
                    );
                    return (
                      <div
                        key={page.id}
                        className="flex items-center justify-between py-2 border-b border-border last:border-0"
                      >
                        <div className="flex items-center gap-2">
                          <page.icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{page.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {page.responseTime && (
                            <span className="text-xs text-muted-foreground">
                              {page.responseTime}ms
                            </span>
                          )}
                          <div
                            className={cn(
                              "flex items-center gap-1 px-2 py-0.5 rounded text-xs",
                              getHealthColor(page.healthStatus || "unknown"),
                            )}
                          >
                            <HealthIcon className="h-3 w-3" />
                            <span className="capitalize">
                              {page.healthStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Security Overview */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    Security Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        SSL/TLS Encryption
                      </span>
                      <span className="text-emerald-500 font-medium">
                        Enforced
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Redirect Validation
                      </span>
                      <span className="text-emerald-500 font-medium">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Context Enforcement
                      </span>
                      <span className="text-emerald-500 font-medium">
                        Strict
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Token Security
                      </span>
                      <span className="text-emerald-500 font-medium">
                        HMAC-SHA256
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="rounded-md bg-emerald-500/5 border border-emerald-500/20 p-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-emerald-700">
                          Security Compliant
                        </p>
                        <p className="text-xs text-emerald-600 mt-0.5">
                          All security checks passed. Configuration meets
                          enterprise standards.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Avg Latency</p>
                    <p className="text-2xl font-semibold">
                      {stats.avgResponseTime}ms
                    </p>
                    <p className="text-xs text-emerald-500">Optimal</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Uptime</p>
                    <p className="text-2xl font-semibold">99.98%</p>
                    <p className="text-xs text-emerald-500">Last 30 days</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Success Rate
                    </p>
                    <p className="text-2xl font-semibold">99.95%</p>
                    <p className="text-xs text-emerald-500">Requests</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Last Health Check
                    </p>
                    <p className="text-2xl font-semibold">2m</p>
                    <p className="text-xs text-muted-foreground">ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ACTIVITY TAB */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <History className="h-4 w-4 text-muted-foreground" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Audit log of configuration changes and system events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 py-3 border-b border-border last:border-0"
                  >
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                        event.severity === "critical"
                          ? "bg-red-500/10"
                          : event.severity === "warning"
                            ? "bg-amber-500/10"
                            : "bg-blue-500/10",
                      )}
                    >
                      {event.type === "health_check" ? (
                        <Activity
                          className={cn(
                            "h-4 w-4",
                            event.severity === "critical"
                              ? "text-red-500"
                              : event.severity === "warning"
                                ? "text-amber-500"
                                : "text-blue-500",
                          )}
                        />
                      ) : event.type === "security_alert" ? (
                        <Shield
                          className={cn(
                            "h-4 w-4",
                            event.severity === "critical"
                              ? "text-red-500"
                              : event.severity === "warning"
                                ? "text-amber-500"
                                : "text-blue-500",
                          )}
                        />
                      ) : (
                        <Settings2
                          className={cn(
                            "h-4 w-4",
                            event.severity === "critical"
                              ? "text-red-500"
                              : event.severity === "warning"
                                ? "text-amber-500"
                                : "text-blue-500",
                          )}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {event.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {event.actor === "system" ? "System" : event.actor}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(event.timestamp)}
                        </span>
                      </div>
                    </div>
                    {event.severity && (
                      <Badge
                        variant={
                          event.severity === "critical"
                            ? "destructive"
                            : event.severity === "warning"
                              ? "default"
                              : "secondary"
                        }
                        className="text-xs shrink-0"
                      >
                        {event.severity}
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Link href="/admin/integrations/logs">
                <Button variant="outline" className="gap-2">
                  View Full Audit Log
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>

        {/* =========================================================================
            FOOTER INFO
            ========================================================================= */}
        <Separator />
        <div className="flex items-start gap-3 text-xs text-muted-foreground">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p>
              <strong className="text-foreground">Audit Logging:</strong> All
              configuration changes are logged with administrator identification
              and retained for 90 days.
            </p>
            <p>
              <strong className="text-foreground">Token Security:</strong>
              Authentication flows use cryptographically signed tokens
              (HMAC-SHA256) with automatic expiration.
            </p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
