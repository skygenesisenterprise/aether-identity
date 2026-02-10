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
import { Separator } from "@/components/dashboard/ui/separator";
import { TooltipProvider } from "@/components/dashboard/ui/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";

import {
  Shield,
  AlertTriangle,
  AlertCircle,
  Settings,
  Trash2,
  Plus,
  RefreshCw,
  CheckCircle2,
  Globe,
  Building2,
  Lock,
  Info,
  ExternalLink,
  Activity,
  Zap,
  TrendingUp,
  UserCheck,
  History,
  ChevronRight,
  Search,
  Filter,
  Check,
  X,
  Clock,
} from "lucide-react";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type ProviderType = "social" | "enterprise" | "custom";
type ProviderStatus = "enabled" | "disabled" | "misconfigured";
type AccountLinkingPolicy = "auto" | "manual" | "strict";

interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  status: ProviderStatus;
  description: string;
  clientId?: string;
  clientSecret?: string;
  issuerUrl?: string;
  scopes?: string;
  callbackUrl: string;
  accountLinking: AccountLinkingPolicy;
  mfaEnforced: boolean;
  allowedContexts: string[];
  lastModified: string;
  lastUsed?: Date;
  usageCount?: number;
  icon?: string;
}

interface ProviderStats {
  totalProviders: number;
  enabledCount: number;
  misconfiguredCount: number;
  totalLogins24h: number;
  successRate: number;
}

interface AuditEvent {
  id: string;
  type:
    | "provider_enabled"
    | "provider_disabled"
    | "login_success"
    | "login_failure"
    | "config_change";
  providerName: string;
  description: string;
  timestamp: Date;
  actor?: string;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const typeConfig: Record<
  ProviderType,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
  }
> = {
  social: {
    label: "Social",
    icon: Globe,
    color: "blue",
    bgColor: "bg-blue-500/10",
  },
  enterprise: {
    label: "Enterprise",
    icon: Building2,
    color: "violet",
    bgColor: "bg-violet-500/10",
  },
  custom: {
    label: "Custom",
    icon: Lock,
    color: "amber",
    bgColor: "bg-amber-500/10",
  },
};

const mockProviders: Provider[] = [
  {
    id: "google",
    name: "Google",
    type: "social",
    status: "enabled",
    description: "Google OAuth 2.0 authentication",
    clientId: "google-client-id-123",
    scopes: "openid email profile",
    callbackUrl: "https://identity.example.com/auth/google/callback",
    accountLinking: "auto",
    mfaEnforced: false,
    allowedContexts: ["user"],
    lastModified: "2024-01-15",
    lastUsed: new Date(Date.now() - 1000 * 60 * 5),
    usageCount: 1247,
  },
  {
    id: "github",
    name: "GitHub",
    type: "social",
    status: "disabled",
    description: "GitHub OAuth authentication",
    callbackUrl: "https://identity.example.com/auth/github/callback",
    accountLinking: "manual",
    mfaEnforced: false,
    allowedContexts: ["user"],
    lastModified: "2024-01-20",
    usageCount: 0,
  },
  {
    id: "oidc-azure",
    name: "Azure AD",
    type: "enterprise",
    status: "misconfigured",
    description: "Microsoft Azure Active Directory via OIDC",
    issuerUrl: "https://login.microsoftonline.com/{tenant}/v2.0",
    callbackUrl: "https://identity.example.com/auth/azure/callback",
    accountLinking: "strict",
    mfaEnforced: true,
    allowedContexts: ["user"],
    lastModified: "2024-02-01",
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 2),
    usageCount: 892,
  },
  {
    id: "saml-okta",
    name: "Okta",
    type: "enterprise",
    status: "enabled",
    description: "Okta SAML 2.0 identity provider",
    callbackUrl: "https://identity.example.com/auth/saml/okta/callback",
    accountLinking: "strict",
    mfaEnforced: true,
    allowedContexts: ["user"],
    lastModified: "2024-01-10",
    lastUsed: new Date(Date.now() - 1000 * 60 * 30),
    usageCount: 2156,
  },
  {
    id: "ldap-internal",
    name: "Corporate LDAP",
    type: "custom",
    status: "disabled",
    description: "Internal LDAP directory service",
    callbackUrl: "https://identity.example.com/auth/ldap/callback",
    accountLinking: "manual",
    mfaEnforced: false,
    allowedContexts: ["user"],
    lastModified: "2023-12-15",
    usageCount: 0,
  },
];

const recentActivity: AuditEvent[] = [
  {
    id: "evt-1",
    type: "login_success",
    providerName: "Google",
    description: "User authenticated via Google OAuth",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: "evt-2",
    type: "login_success",
    providerName: "Okta",
    description: "Enterprise user authenticated via SAML",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: "evt-3",
    type: "config_change",
    providerName: "Azure AD",
    description: "Configuration updated by admin",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    actor: "admin@acme.com",
  },
  {
    id: "evt-4",
    type: "login_failure",
    providerName: "GitHub",
    description: "Authentication failed - invalid credentials",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
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

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ProvidersPage() {
  // State
  const [providers, setProviders] = React.useState<Provider[]>(mockProviders);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [selectedProvider, setSelectedProvider] =
    React.useState<Provider | null>(null);
  const [isConfigOpen, setIsConfigOpen] = React.useState(false);
  const [providerToDelete, setProviderToDelete] =
    React.useState<Provider | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("overview");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterType, setFilterType] = React.useState<ProviderType | "all">(
    "all",
  );
  const [isSaving, setIsSaving] = React.useState(false);

  // Refs
  const providerCounterRef = React.useRef(0);

  // Derived state
  const stats: ProviderStats = React.useMemo(() => {
    const enabled = providers.filter((p) => p.status === "enabled").length;
    const misconfigured = providers.filter(
      (p) => p.status === "misconfigured",
    ).length;

    return {
      totalProviders: providers.length,
      enabledCount: enabled,
      misconfiguredCount: misconfigured,
      totalLogins24h: 156,
      successRate: 98.7,
    };
  }, [providers]);

  const filteredProviders = React.useMemo(() => {
    return providers.filter((provider) => {
      const matchesSearch =
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === "all" || provider.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [providers, searchQuery, filterType]);

  const hasIssues = stats.misconfiguredCount > 0;
  const allEnabled =
    stats.enabledCount === stats.totalProviders && stats.totalProviders > 0;

  // Handlers
  const handleToggleProvider = (providerId: string) => {
    setProviders((prev) =>
      prev.map((p) => {
        if (p.id !== providerId) return p;
        if (p.status === "misconfigured") return p;
        const newStatus = p.status === "enabled" ? "disabled" : "enabled";
        return {
          ...p,
          status: newStatus,
          lastModified: new Date().toISOString().split("T")[0],
        };
      }),
    );
    setHasUnsavedChanges(true);
  };

  const handleConfigure = (provider: Provider) => {
    setSelectedProvider({ ...provider });
    setIsConfigOpen(true);
  };

  const handleSaveConfiguration = () => {
    if (!selectedProvider) return;
    setProviders((prev) =>
      prev.map((p) =>
        p.id === selectedProvider.id
          ? {
              ...selectedProvider,
              lastModified: new Date().toISOString().split("T")[0],
            }
          : p,
      ),
    );
    setIsConfigOpen(false);
    setSelectedProvider(null);
    setHasUnsavedChanges(true);
  };

  const handleDelete = (provider: Provider) => {
    setProviderToDelete(provider);
  };

  const confirmDelete = () => {
    if (!providerToDelete) return;
    setProviders((prev) => prev.filter((p) => p.id !== providerToDelete.id));
    setProviderToDelete(null);
    setHasUnsavedChanges(true);
  };

  const handleAddProvider = (type: ProviderType) => {
    providerCounterRef.current += 1;
    const timestamp = providerCounterRef.current;
    const newProvider: Provider = {
      id: `new-${timestamp}`,
      name:
        type === "social"
          ? "New Social Provider"
          : type === "enterprise"
            ? "New Enterprise Provider"
            : "New Custom Provider",
      type,
      status: "disabled",
      description: "Configure this provider",
      callbackUrl: `https://identity.example.com/auth/${timestamp}/callback`,
      accountLinking: "manual",
      mfaEnforced: false,
      allowedContexts: ["user"],
      lastModified: new Date().toISOString().split("T")[0],
    };
    setProviders((prev) => [...prev, newProvider]);
    setIsAddDialogOpen(false);
    setHasUnsavedChanges(true);
    handleConfigure(newProvider);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setHasUnsavedChanges(false);
  };

  const validateConfiguration = (): boolean => {
    if (!selectedProvider) return false;
    if (selectedProvider.type !== "custom" && !selectedProvider.clientId)
      return false;
    if (selectedProvider.type === "enterprise" && !selectedProvider.issuerUrl)
      return false;
    return true;
  };

  // Render helpers
  const StatusBadge = ({ status }: { status: ProviderStatus }) => {
    const configs = {
      enabled: {
        variant: "default" as const,
        label: "Active",
        icon: CheckCircle2,
        className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      },
      disabled: {
        variant: "secondary" as const,
        label: "Inactive",
        icon: X,
        className: "bg-slate-500/10 text-slate-500 border-slate-500/20",
      },
      misconfigured: {
        variant: "destructive" as const,
        label: "Issues",
        icon: AlertCircle,
        className: "bg-red-500/10 text-red-500 border-red-500/20",
      },
    };
    const config = configs[status];
    const Icon = config.icon;

    return (
      <Badge
        variant="outline"
        className={cn("gap-1 text-xs font-medium", config.className)}
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const TypeBadge = ({ type }: { type: ProviderType }) => {
    const config = typeConfig[type];
    const Icon = config.icon;

    return (
      <Badge
        variant="outline"
        className={cn(
          "gap-1 text-xs",
          config.bgColor,
          `text-${config.color}-500 border-${config.color}-500/20`,
        )}
      >
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
                Identity Providers
              </h1>
              {stats.enabledCount === 0 && (
                <Badge variant="destructive" className="text-xs">
                  No providers active
                </Badge>
              )}
              {hasIssues && (
                <Badge
                  variant="outline"
                  className="text-xs text-red-500 border-red-500/30"
                >
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {stats.misconfiguredCount} issues
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Manage external identity sources for user authentication
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
              onClick={() => setIsAddDialogOpen(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Provider
            </Button>
            <Button
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
                  : allEnabled
                    ? "bg-emerald-500"
                    : "bg-amber-500",
              )}
            />
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Provider Overview
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Active Providers */}
            <Card className="border-border bg-card">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Active Providers
                    </p>
                    <p className="text-2xl font-semibold mt-1">
                      {stats.enabledCount}
                      <span className="text-sm text-muted-foreground font-normal">
                        /{stats.totalProviders}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {(
                        (stats.enabledCount / stats.totalProviders) *
                        100
                      ).toFixed(0)}
                      % enabled
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  </div>
                </div>
                <Progress
                  value={(stats.enabledCount / stats.totalProviders) * 100}
                  className="h-1.5 mt-4"
                />
              </CardContent>
            </Card>

            {/* Auth Success Rate */}
            <Card className="border-border bg-card">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Success Rate
                    </p>
                    <p className="text-2xl font-semibold mt-1">
                      {stats.successRate}%
                    </p>
                    <p className="text-xs text-emerald-500 mt-0.5">
                      <TrendingUp className="h-3 w-3 inline mr-1" />
                      +2.1% vs last week
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Logins (24h) */}
            <Card className="border-border bg-card">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Logins (24h)
                    </p>
                    <p className="text-2xl font-semibold mt-1">
                      {stats.totalLogins24h}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Across all providers
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <UserCheck className="h-5 w-5 text-violet-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Health Status */}
            <Card className="border-border bg-card">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Health Status
                    </p>
                    <p className="text-2xl font-semibold mt-1">
                      {hasIssues ? "Issues" : "Healthy"}
                    </p>
                    <p
                      className={cn(
                        "text-xs mt-0.5",
                        hasIssues ? "text-red-500" : "text-emerald-500",
                      )}
                    >
                      {hasIssues
                        ? "Action required"
                        : "All systems operational"}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center",
                      hasIssues ? "bg-red-500/10" : "bg-emerald-500/10",
                    )}
                  >
                    <Activity
                      className={cn(
                        "h-5 w-5",
                        hasIssues ? "text-red-500" : "text-emerald-500",
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
              <Shield className="h-4 w-4" />
              Providers
              <Badge variant="secondary" className="ml-1 text-xs">
                {providers.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <History className="h-4 w-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Lock className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* PROVIDERS TAB */}
          <TabsContent value="overview" className="space-y-6">
            {/* Filters */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search providers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                value={filterType}
                onValueChange={(v) => setFilterType(v as ProviderType | "all")}
              >
                <SelectTrigger className="w-[160px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Provider Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {filteredProviders.map((provider) => {
                const Icon = typeConfig[provider.type].icon;
                const isMisconfigured = provider.status === "misconfigured";

                return (
                  <Card
                    key={provider.id}
                    className={cn(
                      "border-border bg-card transition-all",
                      provider.status === "disabled" && "opacity-75",
                      isMisconfigured && "border-red-500/30",
                    )}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-lg",
                              typeConfig[provider.type].bgColor,
                            )}
                          >
                            <Icon
                              className={cn(
                                "h-5 w-5",
                                `text-${typeConfig[provider.type].color}-500`,
                              )}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-foreground">
                                {provider.name}
                              </h3>
                              <TypeBadge type={provider.type} />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {provider.description}
                            </p>
                          </div>
                        </div>
                        <StatusBadge status={provider.status} />
                      </div>

                      {/* Stats Row */}
                      <div className="flex items-center gap-4 py-3 border-y border-border mb-4">
                        <div className="flex items-center gap-1.5">
                          <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {provider.usageCount || 0} logins
                          </span>
                        </div>
                        {provider.lastUsed && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Last used {formatRelativeTime(provider.lastUsed)}
                            </span>
                          </div>
                        )}
                      </div>

                      {isMisconfigured && (
                        <div className="rounded-md bg-red-500/5 border border-red-500/20 p-3 mb-4">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-red-700">
                                Configuration Issues
                              </p>
                              <p className="text-xs text-red-600 mt-0.5">
                                Provider configuration is incomplete. Review
                                required fields.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Quick Info */}
                      <div className="flex items-center justify-between text-xs mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground">
                            Linking:{" "}
                            <span className="font-medium capitalize">
                              {provider.accountLinking}
                            </span>
                          </span>
                          {provider.mfaEnforced && (
                            <Badge variant="outline" className="text-xs gap-1">
                              <Shield className="h-3 w-3" />
                              MFA
                            </Badge>
                          )}
                        </div>
                        <span className="text-muted-foreground">
                          Modified {provider.lastModified}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <Switch
                            id={`${provider.id}-toggle`}
                            checked={provider.status === "enabled"}
                            onCheckedChange={() =>
                              handleToggleProvider(provider.id)
                            }
                            disabled={isMisconfigured}
                          />
                          <Label
                            htmlFor={`${provider.id}-toggle`}
                            className="text-sm text-muted-foreground cursor-pointer"
                          >
                            {provider.status === "enabled"
                              ? "Active"
                              : "Inactive"}
                          </Label>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleConfigure(provider)}
                            className="gap-1"
                          >
                            <Settings className="h-3.5 w-3.5" />
                            Configure
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(provider)}
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

            {filteredProviders.length === 0 && (
              <Card className="border-border bg-card">
                <CardContent className="p-8 text-center">
                  <div className="h-12 w-12 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-foreground">
                    No providers found
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try adjusting your search or filter criteria
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ACTIVITY TAB */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <History className="h-4 w-4 text-muted-foreground" />
                  Recent Authentication Activity
                </CardTitle>
                <CardDescription>
                  Logins and configuration changes across all providers
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
                        event.type === "login_success"
                          ? "bg-emerald-500/10"
                          : event.type === "login_failure"
                            ? "bg-red-500/10"
                            : "bg-blue-500/10",
                      )}
                    >
                      {event.type === "login_success" ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : event.type === "login_failure" ? (
                        <X className="h-4 w-4 text-red-500" />
                      ) : (
                        <Settings className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {event.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {event.providerName}
                        </Badge>
                        {event.actor && (
                          <>
                            <span className="text-xs text-muted-foreground">
                              by
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {event.actor}
                            </span>
                          </>
                        )}
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(event.timestamp)}
                        </span>
                      </div>
                    </div>
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

          {/* SECURITY TAB */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Security Overview */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    Security Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Context Restriction
                      </span>
                      <span className="text-emerald-500 font-medium">
                        User Only
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Redirect Validation
                      </span>
                      <span className="text-emerald-500 font-medium">
                        Strict
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Token Encryption
                      </span>
                      <span className="text-emerald-500 font-medium">
                        AES-256
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Audit Logging
                      </span>
                      <span className="text-emerald-500 font-medium">
                        Enabled
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="rounded-md bg-emerald-500/5 border border-emerald-500/20 p-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-emerald-700">
                          Security Compliant
                        </p>
                        <p className="text-xs text-emerald-600 mt-0.5">
                          All identity providers meet security standards
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* MFA Statistics */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    MFA Enforcement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {providers
                      .filter((p) => p.status === "enabled")
                      .map((provider) => (
                        <div
                          key={provider.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-muted-foreground">
                            {provider.name}
                          </span>
                          <Badge
                            variant={
                              provider.mfaEnforced ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {provider.mfaEnforced ? "Required" : "Optional"}
                          </Badge>
                        </div>
                      ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        MFA Coverage
                      </span>
                      <span className="font-medium">
                        {
                          providers.filter(
                            (p) => p.status === "enabled" && p.mfaEnforced,
                          ).length
                        }
                        /
                        {providers.filter((p) => p.status === "enabled").length}{" "}
                        providers
                      </span>
                    </div>
                    <Progress
                      value={
                        (providers.filter(
                          (p) => p.status === "enabled" && p.mfaEnforced,
                        ).length /
                          Math.max(
                            providers.filter((p) => p.status === "enabled")
                              .length,
                            1,
                          )) *
                        100
                      }
                      className="h-1.5"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Security Policies */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Security Policies
                </CardTitle>
                <CardDescription>
                  How identity providers are secured and restricted
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-foreground">
                        Context Scope Restrictions
                      </h4>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Identity providers are strictly limited to user
                        authentication contexts. Admin and console
                        authentication cannot use external identity providers.
                        This restriction is enforced at the API and policy
                        layers.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-foreground">
                        Fixed Redirect URIs
                      </h4>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        All callback URLs are generated and managed by Identity.
                        Wildcard redirects are not permitted. Each provider must
                        be explicitly configured with its fixed callback
                        endpoint.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-foreground">
                        Audit & Compliance
                      </h4>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        All authentication flows through external providers are
                        fully audited. Login attempts, failures, and account
                        linking events are logged with timestamps and source
                        information. Configuration changes require administrator
                        privileges and are logged for compliance.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-md bg-secondary/50 p-3">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Security Note:</strong>{" "}
                    Client secrets are encrypted at rest and never displayed
                    after initial configuration. Rotating credentials requires
                    re-entering the secret.
                  </p>
                </div>
              </CardContent>
            </Card>
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
                {selectedProvider && (
                  <div
                    className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center",
                      typeConfig[selectedProvider.type].bgColor,
                    )}
                  >
                    {React.createElement(
                      typeConfig[selectedProvider.type].icon,
                      {
                        className: cn(
                          "h-4 w-4",
                          `text-${typeConfig[selectedProvider.type].color}-500`,
                        ),
                      },
                    )}
                  </div>
                )}
                Configure {selectedProvider?.name}
              </DialogTitle>
              <DialogDescription>
                Update provider settings and authentication parameters
              </DialogDescription>
            </DialogHeader>

            {selectedProvider && (
              <div className="space-y-6 py-4">
                {/* Basic Configuration */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-foreground">
                    Basic Configuration
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="provider-name">Provider Name</Label>
                    <Input
                      id="provider-name"
                      value={selectedProvider.name}
                      onChange={(e) =>
                        setSelectedProvider({
                          ...selectedProvider,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>

                  {selectedProvider.type !== "custom" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="client-id">Client ID</Label>
                        <Input
                          id="client-id"
                          value={selectedProvider.clientId || ""}
                          onChange={(e) =>
                            setSelectedProvider({
                              ...selectedProvider,
                              clientId: e.target.value,
                            })
                          }
                          placeholder="Enter client ID from provider"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="client-secret">Client Secret</Label>
                        <Input
                          id="client-secret"
                          type="password"
                          value={selectedProvider.clientSecret || ""}
                          onChange={(e) =>
                            setSelectedProvider({
                              ...selectedProvider,
                              clientSecret: e.target.value,
                            })
                          }
                          placeholder={
                            selectedProvider.clientId
                              ? "••••••••••••••••"
                              : "Enter client secret"
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          Secret is encrypted and never displayed after saving
                        </p>
                      </div>
                    </>
                  )}

                  {selectedProvider.type === "enterprise" && (
                    <div className="space-y-2">
                      <Label htmlFor="issuer-url">Issuer / Metadata URL</Label>
                      <Input
                        id="issuer-url"
                        value={selectedProvider.issuerUrl || ""}
                        onChange={(e) =>
                          setSelectedProvider({
                            ...selectedProvider,
                            issuerUrl: e.target.value,
                          })
                        }
                        placeholder="https://login.microsoftonline.com/{tenant}/v2.0"
                      />
                    </div>
                  )}

                  {selectedProvider.type === "social" && (
                    <div className="space-y-2">
                      <Label htmlFor="scopes">Scopes</Label>
                      <Input
                        id="scopes"
                        value={selectedProvider.scopes || ""}
                        onChange={(e) =>
                          setSelectedProvider({
                            ...selectedProvider,
                            scopes: e.target.value,
                          })
                        }
                        placeholder="openid email profile"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="callback-url">Callback URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="callback-url"
                        value={selectedProvider.callbackUrl}
                        readOnly
                        className="bg-secondary/50"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            selectedProvider.callbackUrl,
                          )
                        }
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This URL is fixed and must be configured in your identity
                      provider
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Account Linking & Policies */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-foreground">
                    Account Linking & Policies
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="account-linking">
                      Account Linking Policy
                    </Label>
                    <Select
                      value={selectedProvider.accountLinking}
                      onValueChange={(value: AccountLinkingPolicy) =>
                        setSelectedProvider({
                          ...selectedProvider,
                          accountLinking: value,
                        })
                      }
                    >
                      <SelectTrigger id="account-linking">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">
                          Auto-link (automatic on match)
                        </SelectItem>
                        <SelectItem value="manual">
                          Manual (user confirmation required)
                        </SelectItem>
                        <SelectItem value="strict">
                          Strict (admin approval required)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Controls how external identities are linked to existing
                      accounts
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="mfa-enforced">Require MFA</Label>
                      <p className="text-xs text-muted-foreground">
                        Enforce multi-factor authentication for this provider
                      </p>
                    </div>
                    <Switch
                      id="mfa-enforced"
                      checked={selectedProvider.mfaEnforced}
                      onCheckedChange={(checked) =>
                        setSelectedProvider({
                          ...selectedProvider,
                          mfaEnforced: checked,
                        })
                      }
                    />
                  </div>
                </div>

                {!validateConfiguration() && (
                  <div className="rounded-md bg-red-500/5 border border-red-500/20 p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                      <p className="text-sm text-red-600">
                        Please complete all required fields before enabling this
                        provider
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveConfiguration}
                disabled={!validateConfiguration()}
              >
                Save Configuration
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Provider Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Identity Provider</DialogTitle>
              <DialogDescription>
                Select the type of identity provider to configure
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-4">
              {(["social", "enterprise", "custom"] as ProviderType[]).map(
                (type) => {
                  const config = typeConfig[type];
                  const Icon = config.icon;

                  return (
                    <button
                      key={type}
                      onClick={() => handleAddProvider(type)}
                      className="flex items-center gap-4 rounded-lg border border-border p-4 text-left transition-all hover:bg-muted/50 hover:border-muted-foreground/30"
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg",
                          config.bgColor,
                        )}
                      >
                        <Icon
                          className={cn("h-5 w-5", `text-${config.color}-500`)}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {config.label} Provider
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {type === "social"
                            ? "Google, GitHub, Twitter, etc."
                            : type === "enterprise"
                              ? "Azure AD, Okta, OIDC, SAML, etc."
                              : "LDAP, Active Directory, custom OIDC, etc."}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
                    </button>
                  );
                },
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!providerToDelete}
          onOpenChange={() => setProviderToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Provider</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove {providerToDelete?.name}? This
                action cannot be undone. Existing linked accounts will remain
                but users will no longer be able to authenticate through this
                provider.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Remove Provider
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}
