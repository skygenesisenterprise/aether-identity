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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dashboard/ui/dropdown-menu";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/dashboard/ui/progress";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ContextOverview } from "@/components/dashboard/context-overview";
import { Separator } from "@/components/dashboard/ui/separator";
import { TooltipProvider } from "@/components/dashboard/ui/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";

import {
  Users,
  Plus,
  Settings,
  Trash2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Activity,
  Zap,
  Server,
  Shield,
  MoreVertical,
  Play,
  Pause,
  Search,
  Filter,
  ChevronRight,
  History,
  Info,
  Check,
  RotateCcw,
  UserCog,
  Link2,
  ArrowRightLeft,
  ArrowRight,
  Key,
  GitCompare,
  ArrowUpDown,
  Globe,
  Building2,
  Workflow,
  BadgeCheck,
  XCircle,
} from "lucide-react";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type ScimProviderType =
  | "azure_ad"
  | "okta"
  | "onelogin"
  | "google_workspace"
  | "jumpcloud"
  | "custom";

type ScimStatus = "active" | "inactive" | "error" | "configuring";

type ScimSyncDirection = "inbound" | "outbound" | "bidirectional";

type HealthStatus = "healthy" | "degraded" | "critical" | "unknown";

type SyncOperationType = "create" | "update" | "delete" | "sync";

type SyncStatus = "success" | "failed" | "partial" | "in_progress";

interface ScimAttributeMapping {
  id: string;
  sourceAttribute: string;
  targetAttribute: string;
  isRequired: boolean;
  transform?: string;
  isActive: boolean;
}

interface ScimCredential {
  type: "bearer_token" | "api_key" | "oauth" | "basic_auth";
  identifier?: string;
  lastRotated?: string;
  expiresAt?: string;
}

interface ScimSyncStats {
  usersCreated: number;
  usersUpdated: number;
  usersDeleted: number;
  groupsCreated: number;
  groupsUpdated: number;
  errors: number;
}

interface ScimProvider {
  id: string;
  name: string;
  type: ScimProviderType;
  status: ScimStatus;
  description: string;

  // Connection Settings
  baseUrl: string;
  tenantId?: string;
  credentials: ScimCredential;

  // Provisioning Configuration
  syncDirection: ScimSyncDirection;
  syncInterval: number; // in minutes
  autoProvision: boolean;
  deprovisionOnDelete: boolean;
  conflictResolution: "source_wins" | "target_wins" | "manual";

  // Attribute Mappings
  attributeMappings: ScimAttributeMapping[];

  // Health & Metrics
  healthStatus: HealthStatus;
  lastSync?: string;
  nextSync?: string;
  uptime: number;

  // Usage Stats
  totalSyncs24h: number;
  successRate: number;
  avgSyncTime: number;

  // Metadata
  createdAt: string;
  updatedAt: string;
  isManaged: boolean;
  isDefault: boolean;
}

interface ScimSyncLog {
  id: string;
  timestamp: string;
  providerId: string;
  providerName: string;
  operation: SyncOperationType;
  status: SyncStatus;
  stats: ScimSyncStats;
  duration: number; // in ms
  errorMessage?: string;
  details?: string;
}

interface ScimStats {
  totalProviders: number;
  activeProviders: number;
  errorProviders: number;
  totalUsersSynced24h: number;
  totalGroupsSynced24h: number;
  successRate: number;
  avgSyncTime: number;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const providerTypeConfig: Record<
  ScimProviderType,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    description: string;
  }
> = {
  azure_ad: {
    label: "Azure AD",
    icon: Globe,
    color: "blue",
    bgColor: "bg-blue-500/10",
    description: "Microsoft Azure Active Directory",
  },
  okta: {
    label: "Okta",
    icon: Shield,
    color: "violet",
    bgColor: "bg-violet-500/10",
    description: "Okta Identity Cloud",
  },
  onelogin: {
    label: "OneLogin",
    icon: Key,
    color: "emerald",
    bgColor: "bg-emerald-500/10",
    description: "OneLogin Identity Platform",
  },
  google_workspace: {
    label: "Google Workspace",
    icon: Globe,
    color: "amber",
    bgColor: "bg-amber-500/10",
    description: "Google Workspace Directory",
  },
  jumpcloud: {
    label: "JumpCloud",
    icon: Server,
    color: "rose",
    bgColor: "bg-rose-500/10",
    description: "JumpCloud Directory Platform",
  },
  custom: {
    label: "Custom",
    icon: Settings,
    color: "slate",
    bgColor: "bg-slate-500/10",
    description: "Custom SCIM 2.0 provider",
  },
};

const statusConfig: Record<
  ScimStatus,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
  }
> = {
  active: {
    label: "Active",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  inactive: {
    label: "Inactive",
    icon: Pause,
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
  },
  error: {
    label: "Error",
    icon: AlertCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  configuring: {
    label: "Configuring",
    icon: Settings,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
};

const healthConfig: Record<
  HealthStatus,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
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
    icon: AlertCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  unknown: {
    label: "Unknown",
    icon: Info,
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
  },
};

const syncDirectionConfig: Record<
  ScimSyncDirection,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
  }
> = {
  inbound: {
    label: "Inbound",
    icon: ArrowRight,
    description: "Import users/groups from provider",
  },
  outbound: {
    label: "Outbound",
    icon: ArrowRight,
    description: "Export users/groups to provider",
  },
  bidirectional: {
    label: "Bidirectional",
    icon: ArrowRightLeft,
    description: "Sync both directions",
  },
};

const syncStatusConfig: Record<
  SyncStatus,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
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
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  partial: {
    label: "Partial",
    icon: AlertTriangle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  in_progress: {
    label: "In Progress",
    icon: RefreshCw,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
};

const operationTypeConfig: Record<
  SyncOperationType,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  create: {
    label: "Create",
    icon: Plus,
  },
  update: {
    label: "Update",
    icon: RefreshCw,
  },
  delete: {
    label: "Delete",
    icon: Trash2,
  },
  sync: {
    label: "Full Sync",
    icon: ArrowUpDown,
  },
};

const defaultAttributeMappings: ScimAttributeMapping[] = [
  {
    id: "map-1",
    sourceAttribute: "userName",
    targetAttribute: "email",
    isRequired: true,
    isActive: true,
  },
  {
    id: "map-2",
    sourceAttribute: "name.givenName",
    targetAttribute: "firstName",
    isRequired: true,
    isActive: true,
  },
  {
    id: "map-3",
    sourceAttribute: "name.familyName",
    targetAttribute: "lastName",
    isRequired: true,
    isActive: true,
  },
  {
    id: "map-4",
    sourceAttribute: "displayName",
    targetAttribute: "displayName",
    isRequired: false,
    isActive: true,
  },
  {
    id: "map-5",
    sourceAttribute: "active",
    targetAttribute: "isActive",
    isRequired: true,
    isActive: true,
  },
  {
    id: "map-6",
    sourceAttribute: "groups",
    targetAttribute: "groups",
    isRequired: false,
    isActive: true,
  },
  {
    id: "map-7",
    sourceAttribute: "externalId",
    targetAttribute: "externalId",
    isRequired: false,
    isActive: false,
  },
];

const mockProviders: ScimProvider[] = [
  {
    id: "scim-azure-prod",
    name: "Azure AD Production",
    type: "azure_ad",
    status: "active",
    description: "Primary enterprise directory for user provisioning",
    baseUrl: "https://graph.microsoft.com/v1.0",
    tenantId: "aether-corp.onmicrosoft.com",
    credentials: {
      type: "bearer_token",
      identifier: "eyJ0****",
      lastRotated: "2024-01-15",
    },
    syncDirection: "bidirectional",
    syncInterval: 15,
    autoProvision: true,
    deprovisionOnDelete: true,
    conflictResolution: "source_wins",
    attributeMappings: defaultAttributeMappings,
    healthStatus: "healthy",
    lastSync: "2024-02-07T10:30:00Z",
    nextSync: "2024-02-07T10:45:00Z",
    uptime: 99.97,
    totalSyncs24h: 96,
    successRate: 99.2,
    avgSyncTime: 2340,
    createdAt: "2023-06-15",
    updatedAt: "2024-02-01",
    isManaged: true,
    isDefault: true,
  },
  {
    id: "scim-okta-hr",
    name: "Okta HR System",
    type: "okta",
    status: "active",
    description: "HR-driven user lifecycle management",
    baseUrl: "https://aether-corp.okta.com/api/v1",
    credentials: {
      type: "api_key",
      identifier: "00u****",
      lastRotated: "2024-02-01",
    },
    syncDirection: "inbound",
    syncInterval: 60,
    autoProvision: true,
    deprovisionOnDelete: false,
    conflictResolution: "source_wins",
    attributeMappings: defaultAttributeMappings.map((m) => ({
      ...m,
      isActive: m.id !== "map-7",
    })),
    healthStatus: "healthy",
    lastSync: "2024-02-07T10:25:00Z",
    nextSync: "2024-02-07T11:25:00Z",
    uptime: 99.95,
    totalSyncs24h: 24,
    successRate: 99.8,
    avgSyncTime: 1450,
    createdAt: "2023-08-20",
    updatedAt: "2024-02-05",
    isManaged: true,
    isDefault: false,
  },
  {
    id: "scim-google-workspace",
    name: "Google Workspace",
    type: "google_workspace",
    status: "error",
    description: "Google Workspace directory sync",
    baseUrl: "https://admin.googleapis.com/admin/directory/v1",
    credentials: {
      type: "oauth",
      identifier: "google-oauth",
      lastRotated: "2024-01-10",
    },
    syncDirection: "outbound",
    syncInterval: 30,
    autoProvision: false,
    deprovisionOnDelete: false,
    conflictResolution: "manual",
    attributeMappings: defaultAttributeMappings,
    healthStatus: "critical",
    lastSync: "2024-02-07T08:20:00Z",
    nextSync: "2024-02-07T10:50:00Z",
    uptime: 94.2,
    totalSyncs24h: 48,
    successRate: 45.8,
    avgSyncTime: 5200,
    createdAt: "2023-05-10",
    updatedAt: "2024-02-06",
    isManaged: true,
    isDefault: false,
  },
  {
    id: "scim-jumpcloud",
    name: "JumpCloud Directory",
    type: "jumpcloud",
    status: "configuring",
    description: "JumpCloud directory service integration",
    baseUrl: "https://console.jumpcloud.com/api/v2",
    credentials: {
      type: "api_key",
    },
    syncDirection: "bidirectional",
    syncInterval: 15,
    autoProvision: true,
    deprovisionOnDelete: true,
    conflictResolution: "target_wins",
    attributeMappings: defaultAttributeMappings,
    healthStatus: "unknown",
    uptime: 0,
    totalSyncs24h: 0,
    successRate: 0,
    avgSyncTime: 0,
    createdAt: "2024-02-01",
    updatedAt: "2024-02-07",
    isManaged: true,
    isDefault: false,
  },
  {
    id: "scim-custom-legacy",
    name: "Legacy HR System",
    type: "custom",
    status: "inactive",
    description: "Custom SCIM integration for legacy HR database",
    baseUrl: "https://hr-internal.company.com/scim/v2",
    credentials: {
      type: "basic_auth",
      identifier: "scim-service",
      lastRotated: "2023-12-01",
    },
    syncDirection: "inbound",
    syncInterval: 360,
    autoProvision: false,
    deprovisionOnDelete: false,
    conflictResolution: "manual",
    attributeMappings: defaultAttributeMappings,
    healthStatus: "unknown",
    lastSync: "2024-01-15T14:30:00Z",
    nextSync: "2024-01-15T20:30:00Z",
    uptime: 0,
    totalSyncs24h: 0,
    successRate: 0,
    avgSyncTime: 0,
    createdAt: "2023-03-10",
    updatedAt: "2024-01-15",
    isManaged: false,
    isDefault: false,
  },
];

const mockSyncLogs: ScimSyncLog[] = [
  {
    id: "sync-001",
    timestamp: "2024-02-07T10:30:00Z",
    providerId: "scim-azure-prod",
    providerName: "Azure AD Production",
    operation: "sync",
    status: "success",
    stats: {
      usersCreated: 3,
      usersUpdated: 12,
      usersDeleted: 0,
      groupsCreated: 0,
      groupsUpdated: 2,
      errors: 0,
    },
    duration: 2340,
  },
  {
    id: "sync-002",
    timestamp: "2024-02-07T10:28:42Z",
    providerId: "scim-google-workspace",
    providerName: "Google Workspace",
    operation: "update",
    status: "failed",
    stats: {
      usersCreated: 0,
      usersUpdated: 0,
      usersDeleted: 0,
      groupsCreated: 0,
      groupsUpdated: 0,
      errors: 1,
    },
    duration: 5200,
    errorMessage: "OAuth token expired",
    details: "Token refresh failed: invalid_grant",
  },
  {
    id: "sync-003",
    timestamp: "2024-02-07T10:25:00Z",
    providerId: "scim-okta-hr",
    providerName: "Okta HR System",
    operation: "create",
    status: "success",
    stats: {
      usersCreated: 1,
      usersUpdated: 0,
      usersDeleted: 0,
      groupsCreated: 0,
      groupsUpdated: 0,
      errors: 0,
    },
    duration: 1450,
  },
  {
    id: "sync-004",
    timestamp: "2024-02-07T10:15:30Z",
    providerId: "scim-azure-prod",
    providerName: "Azure AD Production",
    operation: "sync",
    status: "partial",
    stats: {
      usersCreated: 0,
      usersUpdated: 8,
      usersDeleted: 0,
      groupsCreated: 0,
      groupsUpdated: 1,
      errors: 2,
    },
    duration: 1890,
    errorMessage: "2 attributes failed to sync",
    details: "Missing required field: department for user john.doe@company.com",
  },
  {
    id: "sync-005",
    timestamp: "2024-02-07T10:10:00Z",
    providerId: "scim-google-workspace",
    providerName: "Google Workspace",
    operation: "delete",
    status: "failed",
    stats: {
      usersCreated: 0,
      usersUpdated: 0,
      usersDeleted: 0,
      groupsCreated: 0,
      groupsUpdated: 0,
      errors: 1,
    },
    duration: 3100,
    errorMessage: "Rate limit exceeded",
    details: "Too many requests, retry after 60 seconds",
  },
  {
    id: "sync-006",
    timestamp: "2024-02-07T10:05:00Z",
    providerId: "scim-azure-prod",
    providerName: "Azure AD Production",
    operation: "sync",
    status: "success",
    stats: {
      usersCreated: 0,
      usersUpdated: 5,
      usersDeleted: 1,
      groupsCreated: 0,
      groupsUpdated: 0,
      errors: 0,
    },
    duration: 2100,
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatRelativeTime = (timestamp?: string): string => {
  if (!timestamp) return "Never";
  const date = new Date(timestamp);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ScimIntegrationsPage() {
  // State
  const [providers, setProviders] =
    React.useState<ScimProvider[]>(mockProviders);
  const [syncLogs] = React.useState<ScimSyncLog[]>(mockSyncLogs);
  const [selectedProvider, setSelectedProvider] =
    React.useState<ScimProvider | null>(null);
  const [isConfigOpen, setIsConfigOpen] = React.useState(false);
  const [providerToDelete, setProviderToDelete] =
    React.useState<ScimProvider | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("providers");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterType, setFilterType] = React.useState<ScimProviderType | "all">(
    "all",
  );
  const [filterStatus, setFilterStatus] = React.useState<ScimStatus | "all">(
    "all",
  );
  const [showSecret, setShowSecret] = React.useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = React.useState(false);
  const [isTesting, setIsTesting] = React.useState(false);
  const [mappingProvider, setMappingProvider] =
    React.useState<ScimProvider | null>(null);
  const [isMappingOpen, setIsMappingOpen] = React.useState(false);

  // Ref for unique IDs
  const providerCounterRef = React.useRef(0);

  // Derived state
  const stats: ScimStats = React.useMemo(() => {
    const active = providers.filter((p) => p.status === "active").length;
    const errors = providers.filter((p) => p.status === "error").length;
    const totalUsers = syncLogs
      .filter((log) => log.status === "success" || log.status === "partial")
      .reduce(
        (acc, log) =>
          acc +
          log.stats.usersCreated +
          log.stats.usersUpdated +
          log.stats.usersDeleted,
        0,
      );
    const totalGroups = syncLogs
      .filter((log) => log.status === "success" || log.status === "partial")
      .reduce(
        (acc, log) => acc + log.stats.groupsCreated + log.stats.groupsUpdated,
        0,
      );
    const avgSuccessRate =
      providers.length > 0
        ? providers.reduce((acc, p) => acc + p.successRate, 0) /
          providers.length
        : 0;
    const avgSyncTime =
      providers.length > 0
        ? providers.reduce((acc, p) => acc + p.avgSyncTime, 0) /
          providers.length
        : 0;

    return {
      totalProviders: providers.length,
      activeProviders: active,
      errorProviders: errors,
      totalUsersSynced24h: totalUsers,
      totalGroupsSynced24h: totalGroups,
      successRate: avgSuccessRate,
      avgSyncTime,
    };
  }, [providers, syncLogs]);

  const filteredProviders = React.useMemo(() => {
    return providers.filter((provider) => {
      const matchesSearch =
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === "all" || provider.type === filterType;
      const matchesStatus =
        filterStatus === "all" || provider.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [providers, searchQuery, filterType, filterStatus]);

  const hasErrors = stats.errorProviders > 0;
  const hasPending = providers.some((p) => p.status === "configuring");

  // Handlers
  const handleToggleProvider = (providerId: string) => {
    setProviders((prev) =>
      prev.map((p) => {
        if (p.id !== providerId) return p;
        const newStatus = p.status === "active" ? "inactive" : "active";
        return { ...p, status: newStatus, updatedAt: new Date().toISOString() };
      }),
    );
  };

  const handleConfigure = (provider: ScimProvider) => {
    setSelectedProvider({ ...provider });
    setShowSecret(false);
    setIsConfigOpen(true);
  };

  const handleOpenMappings = (provider: ScimProvider) => {
    setMappingProvider({ ...provider });
    setIsMappingOpen(true);
  };

  const handleSaveConfiguration = () => {
    if (!selectedProvider) return;
    setProviders((prev) =>
      prev.map((p) =>
        p.id === selectedProvider.id
          ? { ...selectedProvider, updatedAt: new Date().toISOString() }
          : p,
      ),
    );
    setIsConfigOpen(false);
    setSelectedProvider(null);
  };

  const handleSaveMappings = () => {
    if (!mappingProvider) return;
    setProviders((prev) =>
      prev.map((p) =>
        p.id === mappingProvider.id
          ? { ...mappingProvider, updatedAt: new Date().toISOString() }
          : p,
      ),
    );
    setIsMappingOpen(false);
    setMappingProvider(null);
  };

  const handleDelete = (provider: ScimProvider) => {
    setProviderToDelete(provider);
  };

  const confirmDelete = () => {
    if (!providerToDelete) return;
    setProviders((prev) => prev.filter((p) => p.id !== providerToDelete.id));
    setProviderToDelete(null);
  };

  const handleAddProvider = (type: ScimProviderType) => {
    providerCounterRef.current += 1;
    const timestamp = providerCounterRef.current;
    const newProvider: ScimProvider = {
      id: `scim-new-${timestamp}`,
      name: `New ${providerTypeConfig[type].label} Provider`,
      type,
      status: "configuring",
      description: "Configure this SCIM provider",
      baseUrl: "",
      credentials: {
        type: "bearer_token",
      },
      syncDirection: "inbound",
      syncInterval: 15,
      autoProvision: false,
      deprovisionOnDelete: false,
      conflictResolution: "source_wins",
      attributeMappings: [...defaultAttributeMappings],
      healthStatus: "unknown",
      uptime: 0,
      totalSyncs24h: 0,
      successRate: 0,
      avgSyncTime: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isManaged: type !== "custom",
      isDefault: false,
    };
    setProviders((prev) => [...prev, newProvider]);
    setIsAddDialogOpen(false);
    handleConfigure(newProvider);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsTesting(false);
    setIsTestDialogOpen(false);
    alert("Connection test successful!");
  };

  const handleSyncAll = () => {
    // Trigger sync for all active providers
    alert("Starting full sync for all active SCIM providers...");
  };

  const handleCheckAllHealth = () => {
    setProviders((prev) =>
      prev.map((p) => ({
        ...p,
        healthStatus: p.status === "error" ? "critical" : "healthy",
        lastSync: p.status === "active" ? new Date().toISOString() : p.lastSync,
      })),
    );
  };

  const handleSetDefault = (providerId: string) => {
    setProviders((prev) =>
      prev.map((p) => ({
        ...p,
        isDefault: p.id === providerId,
      })),
    );
  };

  const handleForceSync = (providerId: string) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === providerId ? { ...p, lastSync: new Date().toISOString() } : p,
      ),
    );
    alert(`Full sync triggered for provider`);
  };

  // Render helpers
  const StatusBadge = ({ status }: { status: ScimStatus }) => {
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge
        variant="outline"
        className={cn(
          "gap-1 text-xs font-medium",
          config.bgColor,
          config.color,
        )}
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const HealthBadge = ({ status }: { status: HealthStatus }) => {
    const config = healthConfig[status];
    const Icon = config.icon;

    return (
      <Badge
        variant="outline"
        className={cn(
          "gap-1 text-xs font-medium",
          config.bgColor,
          config.color,
        )}
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const TypeBadge = ({ type }: { type: ScimProviderType }) => {
    const config = providerTypeConfig[type];

    return (
      <Badge
        variant="outline"
        className={cn(
          "gap-1 text-xs",
          config.bgColor,
          `text-${config.color}-500 border-${config.color}-500/20`,
        )}
      >
        <config.icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const DirectionBadge = ({ direction }: { direction: ScimSyncDirection }) => {
    const config = syncDirectionConfig[direction];

    return (
      <Badge variant="outline" className="gap-1 text-xs">
        <config.icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const SyncStatusBadge = ({ status }: { status: SyncStatus }) => {
    const config = syncStatusConfig[status];
    const Icon = config.icon;

    return (
      <Badge
        variant="outline"
        className={cn(
          "gap-1 text-xs font-medium",
          config.bgColor,
          config.color,
        )}
      >
        <Icon
          className={cn("h-3 w-3", status === "in_progress" && "animate-spin")}
        />
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
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-card-foreground">
                Identity SCIM Provisioning
              </h1>
              {hasErrors && (
                <Badge variant="destructive" className="text-xs gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {stats.errorProviders} errors
                </Badge>
              )}
              {hasPending && (
                <Badge
                  variant="outline"
                  className="text-xs text-amber-500 border-amber-500/30"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {
                    providers.filter((p) => p.status === "configuring").length
                  }{" "}
                  pending
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Manage SCIM 2.0 user provisioning and directory synchronization
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleCheckAllHealth}
              className="gap-2"
            >
              <Activity className="h-4 w-4" />
              Health Check
            </Button>
            <Button variant="outline" onClick={handleSyncAll} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Sync All
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Provider
            </Button>
          </div>
        </div>

        <ContextOverview
          authority="Acme Corporation"
          workspace="Production"
          role="Identity Administrator"
          accessLevel="Full SCIM management"
          isPrivileged={true}
          lastLogin="Today, 9:42 AM"
        />

        {/* =========================================================================
            PLATFORM HEALTH & STATS
            ========================================================================= */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "h-2 w-2 rounded-full animate-pulse",
                hasErrors
                  ? "bg-red-500"
                  : hasPending
                    ? "bg-amber-500"
                    : "bg-emerald-500",
              )}
            />
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Provisioning Overview
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Active Providers"
              value={stats.activeProviders}
              subtitle={`${stats.totalProviders} total configured`}
              icon={Server}
              variant={hasErrors ? "destructive" : "default"}
              trend={{
                value: stats.activeProviders,
                isPositive: stats.activeProviders > 0,
              }}
            />
            <MetricCard
              title="Users Synced (24h)"
              value={formatNumber(stats.totalUsersSynced24h)}
              subtitle="Total user operations"
              icon={Users}
              variant={stats.successRate >= 95 ? "default" : "warning"}
              trend={{ value: 8.3, isPositive: true }}
            />
            <MetricCard
              title="Sync Success Rate"
              value={`${stats.successRate.toFixed(1)}%`}
              subtitle="Average across providers"
              icon={CheckCircle2}
              variant={
                stats.successRate >= 95
                  ? "default"
                  : stats.successRate >= 80
                    ? "warning"
                    : "destructive"
              }
              trend={{ value: 2.1, isPositive: true }}
            />
            <MetricCard
              title="Avg Sync Time"
              value={`${formatDuration(stats.avgSyncTime)}`}
              subtitle="End-to-end synchronization"
              icon={Zap}
              variant={
                stats.avgSyncTime < 3000
                  ? "default"
                  : stats.avgSyncTime < 5000
                    ? "warning"
                    : "destructive"
              }
              trend={{ value: 15, isPositive: false }}
            />
          </div>

          {hasErrors && (
            <Alert
              variant="destructive"
              className="border-red-500/30 bg-red-500/10"
            >
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertTitle className="text-red-400">
                SCIM Provider Errors Detected
              </AlertTitle>
              <AlertDescription className="text-red-400/80">
                {stats.errorProviders} provider(s) experiencing connectivity
                issues. Review credentials and endpoint configurations. Failed
                syncs may result in outdated user data.
              </AlertDescription>
            </Alert>
          )}
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
            <TabsTrigger value="providers" className="gap-2">
              <Server className="h-4 w-4" />
              Providers
              <Badge variant="secondary" className="ml-1 text-xs">
                {providers.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-2">
              <History className="h-4 w-4" />
              Sync Logs
              <Badge variant="secondary" className="ml-1 text-xs">
                {syncLogs.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="mappings" className="gap-2">
              <GitCompare className="h-4 w-4" />
              Attribute Mappings
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Global Settings
            </TabsTrigger>
          </TabsList>

          {/* PROVIDERS TAB */}
          <TabsContent value="providers" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search SCIM providers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={filterType}
                  onValueChange={(v) =>
                    setFilterType(v as ScimProviderType | "all")
                  }
                >
                  <SelectTrigger className="w-[160px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="azure_ad">Azure AD</SelectItem>
                    <SelectItem value="okta">Okta</SelectItem>
                    <SelectItem value="onelogin">OneLogin</SelectItem>
                    <SelectItem value="google_workspace">
                      Google Workspace
                    </SelectItem>
                    <SelectItem value="jumpcloud">JumpCloud</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filterStatus}
                  onValueChange={(v) =>
                    setFilterStatus(v as ScimStatus | "all")
                  }
                >
                  <SelectTrigger className="w-[160px]">
                    <Activity className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="configuring">Configuring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Providers Grid */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredProviders.map((provider) => {
                const Icon = providerTypeConfig[provider.type].icon;
                const isError = provider.status === "error";
                const isConfiguring = provider.status === "configuring";

                return (
                  <Card
                    key={provider.id}
                    className={cn(
                      "border-border bg-card transition-all",
                      provider.status === "inactive" && "opacity-75",
                      isError && "border-red-500/30 shadow-red-500/5",
                      isConfiguring && "border-blue-500/30",
                      provider.isDefault && "ring-1 ring-emerald-500/30",
                    )}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-lg",
                              providerTypeConfig[provider.type].bgColor,
                            )}
                          >
                            <Icon
                              className={cn(
                                "h-5 w-5",
                                `text-${providerTypeConfig[provider.type].color}-500`,
                              )}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-sm font-medium text-foreground truncate">
                                {provider.name}
                              </CardTitle>
                              {provider.isDefault && (
                                <Badge
                                  variant="outline"
                                  className="text-xs gap-1 text-emerald-500 border-emerald-500/20"
                                >
                                  <Check className="h-3 w-3" />
                                  Default
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {providerTypeConfig[provider.type].description}
                            </p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleConfigure(provider)}
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              Configure
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleOpenMappings(provider)}
                            >
                              <GitCompare className="h-4 w-4 mr-2" />
                              Edit Mappings
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleForceSync(provider.id)}
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Force Sync
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleSetDefault(provider.id)}
                              disabled={provider.isDefault}
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Set as Default
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleToggleProvider(provider.id)}
                            >
                              {provider.status === "active" ? (
                                <>
                                  <Pause className="h-4 w-4 mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(provider)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Status Row */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge status={provider.status} />
                        <HealthBadge status={provider.healthStatus} />
                        <TypeBadge type={provider.type} />
                      </div>

                      {/* Description */}
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {provider.description}
                      </p>

                      {/* Sync Configuration */}
                      <div className="flex items-center gap-2 text-xs">
                        <DirectionBadge direction={provider.syncDirection} />
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">
                          Every {provider.syncInterval} min
                        </span>
                        {provider.autoProvision && (
                          <>
                            <span className="text-muted-foreground">•</span>
                            <Badge
                              variant="outline"
                              className="text-[10px] gap-1"
                            >
                              <BadgeCheck className="h-3 w-3" />
                              Auto
                            </Badge>
                          </>
                        )}
                      </div>

                      {/* Metrics Row */}
                      {provider.status === "active" && (
                        <div className="grid grid-cols-3 gap-2 py-3 border-y border-border">
                          <div className="text-center">
                            <p className="text-lg font-semibold text-foreground">
                              {formatNumber(provider.totalSyncs24h)}
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase">
                              Syncs (24h)
                            </p>
                          </div>
                          <div className="text-center">
                            <p
                              className={cn(
                                "text-lg font-semibold",
                                provider.successRate >= 95
                                  ? "text-emerald-500"
                                  : provider.successRate >= 80
                                    ? "text-amber-500"
                                    : "text-red-500",
                              )}
                            >
                              {provider.successRate.toFixed(1)}%
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase">
                              Success
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-semibold text-foreground">
                              {formatDuration(provider.avgSyncTime)}
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase">
                              Avg Time
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Error Alert */}
                      {isError && (
                        <div className="rounded-md bg-red-500/5 border border-red-500/20 p-3">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-red-700">
                                Connection Error
                              </p>
                              <p className="text-xs text-red-600 mt-0.5">
                                Provider is not responding. Check credentials
                                and endpoint configuration.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Last Sync */}
                      {provider.lastSync && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            Last sync: {formatRelativeTime(provider.lastSync)}
                          </span>
                          {provider.nextSync && (
                            <>
                              <span>•</span>
                              <span>
                                Next: {formatRelativeTime(provider.nextSync)}
                              </span>
                            </>
                          )}
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <Switch
                            id={`${provider.id}-toggle`}
                            checked={provider.status === "active"}
                            onCheckedChange={() =>
                              handleToggleProvider(provider.id)
                            }
                            disabled={
                              provider.status === "configuring" ||
                              provider.status === "error"
                            }
                          />
                          <Label
                            htmlFor={`${provider.id}-toggle`}
                            className="text-sm text-muted-foreground cursor-pointer"
                          >
                            {provider.status === "active"
                              ? "Enabled"
                              : "Disabled"}
                          </Label>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleConfigure(provider)}
                            className="h-8 text-xs"
                          >
                            <Settings className="h-3.5 w-3.5 mr-1" />
                            Configure
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredProviders.length === 0 && (
              <Card className="border-dashed border-2 border-border bg-card/50">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary mb-4">
                    <Server className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-sm font-medium text-foreground mb-1">
                    No SCIM providers found
                  </h3>
                  <p className="text-xs text-muted-foreground text-center max-w-xs">
                    {searchQuery ||
                    filterType !== "all" ||
                    filterStatus !== "all"
                      ? "Try adjusting your search or filters"
                      : "Configure your first SCIM provider to enable user provisioning"}
                  </p>
                  {!searchQuery &&
                    filterType === "all" &&
                    filterStatus === "all" && (
                      <Button
                        onClick={() => setIsAddDialogOpen(true)}
                        className="mt-4 gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add First Provider
                      </Button>
                    )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* SYNC LOGS TAB */}
          <TabsContent value="logs" className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <History className="h-4 w-4 text-muted-foreground" />
                    Recent Synchronization Activity
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-muted-foreground">Live</span>
                  </div>
                </div>
                <CardDescription>
                  SCIM synchronization events across all providers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {syncLogs.map((log) => {
                  const operationConfig = operationTypeConfig[log.operation];
                  const OpIcon = operationConfig.icon;

                  return (
                    <div
                      key={log.id}
                      className="flex items-start gap-3 py-3 border-b border-border last:border-0"
                    >
                      <div
                        className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                          log.status === "success" && "bg-emerald-500/10",
                          log.status === "failed" && "bg-red-500/10",
                          log.status === "partial" && "bg-amber-500/10",
                          log.status === "in_progress" && "bg-blue-500/10",
                        )}
                      >
                        {log.status === "success" ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : log.status === "failed" ? (
                          <XCircle className="h-4 w-4 text-red-500" />
                        ) : log.status === "partial" ? (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        ) : (
                          <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-foreground">
                            {log.providerName}
                          </p>
                          <Badge
                            variant="outline"
                            className="text-[10px] gap-1"
                          >
                            <OpIcon className="h-3 w-3" />
                            {operationConfig.label}
                          </Badge>
                          <SyncStatusBadge status={log.status} />
                        </div>

                        {/* Stats */}
                        {(log.status === "success" ||
                          log.status === "partial") && (
                          <div className="flex items-center gap-3 mt-1 text-xs">
                            {(log.stats.usersCreated > 0 ||
                              log.stats.usersUpdated > 0 ||
                              log.stats.usersDeleted > 0) && (
                              <span className="text-muted-foreground">
                                Users:{" "}
                                {log.stats.usersCreated > 0 &&
                                  `+${log.stats.usersCreated} `}
                                {log.stats.usersUpdated > 0 &&
                                  `~${log.stats.usersUpdated} `}
                                {log.stats.usersDeleted > 0 &&
                                  `-${log.stats.usersDeleted}`}
                              </span>
                            )}
                            {(log.stats.groupsCreated > 0 ||
                              log.stats.groupsUpdated > 0) && (
                              <span className="text-muted-foreground">
                                Groups:{" "}
                                {log.stats.groupsCreated > 0 &&
                                  `+${log.stats.groupsCreated} `}
                                {log.stats.groupsUpdated > 0 &&
                                  `~${log.stats.groupsUpdated}`}
                              </span>
                            )}
                            <span className="text-muted-foreground">
                              Duration: {formatDuration(log.duration)}
                            </span>
                          </div>
                        )}

                        {log.errorMessage && (
                          <div className="mt-1">
                            <p className="text-xs text-red-500">
                              Error: {log.errorMessage}
                            </p>
                            {log.details && (
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                {log.details}
                              </p>
                            )}
                          </div>
                        )}

                        <p className="text-xs text-muted-foreground mt-1">
                          {formatRelativeTime(log.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Link href="/admin/integrations/logs">
                <Button variant="outline" className="gap-2">
                  View Full Integration Logs
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </TabsContent>

          {/* ATTRIBUTE MAPPINGS TAB */}
          <TabsContent value="mappings" className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <GitCompare className="h-4 w-4 text-muted-foreground" />
                  SCIM Attribute Mappings
                </CardTitle>
                <CardDescription>
                  Standard mappings used across SCIM providers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border border-border">
                  <div className="grid grid-cols-4 gap-4 p-3 bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground">
                    <div>Source (SCIM)</div>
                    <div>Target (Aether)</div>
                    <div>Required</div>
                    <div>Status</div>
                  </div>
                  {defaultAttributeMappings.map((mapping) => (
                    <div
                      key={mapping.id}
                      className="grid grid-cols-4 gap-4 p-3 border-b border-border last:border-0 text-sm"
                    >
                      <div className="font-mono text-xs">
                        {mapping.sourceAttribute}
                      </div>
                      <div className="font-mono text-xs">
                        {mapping.targetAttribute}
                      </div>
                      <div>
                        {mapping.isRequired ? (
                          <Badge
                            variant="outline"
                            className="text-[10px] text-amber-500"
                          >
                            Required
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Optional
                          </span>
                        )}
                      </div>
                      <div>
                        {mapping.isActive ? (
                          <Badge
                            variant="outline"
                            className="text-[10px] gap-1 text-emerald-500 border-emerald-500/20"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            Active
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-[10px] gap-1 text-slate-500"
                          >
                            <Pause className="h-3 w-3" />
                            Inactive
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-md bg-blue-500/5 border border-blue-500/20 p-3">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-700">
                        About Attribute Mappings
                      </p>
                      <p className="text-xs text-blue-600 mt-0.5">
                        Mappings define how user attributes from SCIM providers
                        are translated to Aether Identity fields. Each provider
                        can have custom mappings that override these defaults.
                        Required fields must be present for successful
                        provisioning.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SETTINGS TAB */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        Require Admin Approval
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Review user deprovisioning actions
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Audit All Changes</p>
                      <p className="text-xs text-muted-foreground">
                        Log every user/group modification
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Encrypt Sync Data</p>
                      <p className="text-xs text-muted-foreground">
                        TLS 1.3 for all SCIM traffic
                      </p>
                    </div>
                    <Switch defaultChecked disabled />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Workflow className="h-4 w-4 text-muted-foreground" />
                    Sync Behavior
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        Auto-retry Failed Syncs
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Retry up to 3 times with backoff
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        Conflict Notifications
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Alert on data conflicts
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Email on Error</p>
                      <p className="text-xs text-muted-foreground">
                        Notify admins of sync failures
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* =========================================================================
            ADD PROVIDER DIALOG
            ========================================================================= */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add SCIM Provider
              </DialogTitle>
              <DialogDescription>
                Select a provider type to configure SCIM 2.0 integration
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 py-4">
              {(Object.keys(providerTypeConfig) as ScimProviderType[]).map(
                (type) => {
                  const config = providerTypeConfig[type];
                  const Icon = config.icon;
                  return (
                    <Button
                      key={type}
                      variant="outline"
                      className="h-auto py-4 flex flex-col items-start gap-2 justify-start"
                      onClick={() => handleAddProvider(type)}
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
                      <div className="text-left">
                        <p className="font-medium text-sm">{config.label}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {config.description}
                        </p>
                      </div>
                    </Button>
                  );
                },
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* =========================================================================
            CONFIGURE PROVIDER DIALOG
            ========================================================================= */}
        <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configure SCIM Provider
              </DialogTitle>
              <DialogDescription>
                Update connection settings and provisioning behavior
              </DialogDescription>
            </DialogHeader>
            {selectedProvider && (
              <div className="space-y-6 py-4">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Basic Information
                  </h4>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Provider Name</Label>
                      <Input
                        id="name"
                        value={selectedProvider.name}
                        onChange={(e) =>
                          setSelectedProvider({
                            ...selectedProvider,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={selectedProvider.description}
                        onChange={(e) =>
                          setSelectedProvider({
                            ...selectedProvider,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Connection Settings */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Link2 className="h-4 w-4" />
                    Connection Settings
                  </h4>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="baseUrl">SCIM Base URL</Label>
                      <Input
                        id="baseUrl"
                        value={selectedProvider.baseUrl}
                        onChange={(e) =>
                          setSelectedProvider({
                            ...selectedProvider,
                            baseUrl: e.target.value,
                          })
                        }
                        placeholder="https://scim.example.com/v2"
                      />
                    </div>
                    {selectedProvider.type === "azure_ad" && (
                      <div className="space-y-2">
                        <Label htmlFor="tenantId">Tenant ID</Label>
                        <Input
                          id="tenantId"
                          value={selectedProvider.tenantId || ""}
                          onChange={(e) =>
                            setSelectedProvider({
                              ...selectedProvider,
                              tenantId: e.target.value,
                            })
                          }
                          placeholder="your-tenant.onmicrosoft.com"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label>Authentication</Label>
                      <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                        <Key className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {selectedProvider.credentials.type ===
                            "bearer_token"
                              ? "Bearer Token"
                              : selectedProvider.credentials.type === "api_key"
                                ? "API Key"
                                : selectedProvider.credentials.type === "oauth"
                                  ? "OAuth 2.0"
                                  : "Basic Auth"}
                          </p>
                          {selectedProvider.credentials.identifier && (
                            <p className="text-xs text-muted-foreground">
                              ID: {selectedProvider.credentials.identifier}
                            </p>
                          )}
                        </div>
                        <Button variant="outline" size="sm">
                          <RotateCcw className="h-3.5 w-3.5 mr-1" />
                          Rotate
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Provisioning Settings */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <UserCog className="h-4 w-4" />
                    Provisioning Settings
                  </h4>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>Sync Direction</Label>
                      <Select
                        value={selectedProvider.syncDirection}
                        onValueChange={(v) =>
                          setSelectedProvider({
                            ...selectedProvider,
                            syncDirection: v as ScimSyncDirection,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inbound">
                            <div className="flex items-center gap-2">
                              <ArrowRight className="h-4 w-4" />
                              Inbound (Import)
                            </div>
                          </SelectItem>
                          <SelectItem value="outbound">
                            <div className="flex items-center gap-2">
                              <ArrowRight className="h-4 w-4 rotate-180" />
                              Outbound (Export)
                            </div>
                          </SelectItem>
                          <SelectItem value="bidirectional">
                            <div className="flex items-center gap-2">
                              <ArrowRightLeft className="h-4 w-4" />
                              Bidirectional
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="syncInterval">
                        Sync Interval (minutes)
                      </Label>
                      <Input
                        id="syncInterval"
                        type="number"
                        min={5}
                        max={1440}
                        value={selectedProvider.syncInterval}
                        onChange={(e) =>
                          setSelectedProvider({
                            ...selectedProvider,
                            syncInterval: parseInt(e.target.value) || 15,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Conflict Resolution</Label>
                      <Select
                        value={selectedProvider.conflictResolution}
                        onValueChange={(v) =>
                          setSelectedProvider({
                            ...selectedProvider,
                            conflictResolution:
                              v as ScimProvider["conflictResolution"],
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="source_wins">
                            Source Wins (SCIM provider)
                          </SelectItem>
                          <SelectItem value="target_wins">
                            Target Wins (Aether)
                          </SelectItem>
                          <SelectItem value="manual">Manual Review</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          Auto-Provision Users
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Automatically create new users
                        </p>
                      </div>
                      <Switch
                        checked={selectedProvider.autoProvision}
                        onCheckedChange={(checked) =>
                          setSelectedProvider({
                            ...selectedProvider,
                            autoProvision: checked,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          Deprovision on Delete
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Disable users when deleted in source
                        </p>
                      </div>
                      <Switch
                        checked={selectedProvider.deprovisionOnDelete}
                        onCheckedChange={(checked) =>
                          setSelectedProvider({
                            ...selectedProvider,
                            deprovisionOnDelete: checked,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveConfiguration}>
                <Check className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* =========================================================================
            ATTRIBUTE MAPPINGS DIALOG
            ========================================================================= */}
        <Dialog open={isMappingOpen} onOpenChange={setIsMappingOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <GitCompare className="h-5 w-5" />
                Edit Attribute Mappings
              </DialogTitle>
              <DialogDescription>
                {mappingProvider &&
                  `Custom mappings for ${mappingProvider.name}`}
              </DialogDescription>
            </DialogHeader>
            {mappingProvider && (
              <div className="space-y-4 py-4">
                <div className="rounded-md border border-border">
                  <div className="grid grid-cols-12 gap-2 p-3 bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground">
                    <div className="col-span-3">SCIM Attribute</div>
                    <div className="col-span-3">Aether Field</div>
                    <div className="col-span-2">Transform</div>
                    <div className="col-span-2">Required</div>
                    <div className="col-span-2">Active</div>
                  </div>
                  {mappingProvider.attributeMappings.map((mapping, index) => (
                    <div
                      key={mapping.id}
                      className="grid grid-cols-12 gap-2 p-3 border-b border-border last:border-0 items-center"
                    >
                      <div className="col-span-3">
                        <Input
                          value={mapping.sourceAttribute}
                          onChange={(e) => {
                            const newMappings = [
                              ...mappingProvider.attributeMappings,
                            ];
                            newMappings[index] = {
                              ...mapping,
                              sourceAttribute: e.target.value,
                            };
                            setMappingProvider({
                              ...mappingProvider,
                              attributeMappings: newMappings,
                            });
                          }}
                          className="h-8 text-xs"
                        />
                      </div>
                      <div className="col-span-3">
                        <Input
                          value={mapping.targetAttribute}
                          onChange={(e) => {
                            const newMappings = [
                              ...mappingProvider.attributeMappings,
                            ];
                            newMappings[index] = {
                              ...mapping,
                              targetAttribute: e.target.value,
                            };
                            setMappingProvider({
                              ...mappingProvider,
                              attributeMappings: newMappings,
                            });
                          }}
                          className="h-8 text-xs"
                        />
                      </div>
                      <div className="col-span-2">
                        <Select
                          value={mapping.transform || "none"}
                          onValueChange={(v) => {
                            const newMappings = [
                              ...mappingProvider.attributeMappings,
                            ];
                            newMappings[index] = {
                              ...mapping,
                              transform: v === "none" ? undefined : v,
                            };
                            setMappingProvider({
                              ...mappingProvider,
                              attributeMappings: newMappings,
                            });
                          }}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="lowercase">Lowercase</SelectItem>
                            <SelectItem value="uppercase">Uppercase</SelectItem>
                            <SelectItem value="trim">Trim</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <Checkbox
                          checked={mapping.isRequired}
                          onCheckedChange={(checked) => {
                            const newMappings = [
                              ...mappingProvider.attributeMappings,
                            ];
                            newMappings[index] = {
                              ...mapping,
                              isRequired: checked as boolean,
                            };
                            setMappingProvider({
                              ...mappingProvider,
                              attributeMappings: newMappings,
                            });
                          }}
                        />
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <Switch
                          checked={mapping.isActive}
                          onCheckedChange={(checked) => {
                            const newMappings = [
                              ...mappingProvider.attributeMappings,
                            ];
                            newMappings[index] = {
                              ...mapping,
                              isActive: checked,
                            };
                            setMappingProvider({
                              ...mappingProvider,
                              attributeMappings: newMappings,
                            });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => {
                    const newMapping: ScimAttributeMapping = {
                      id: `map-new-${Date.now()}`,
                      sourceAttribute: "",
                      targetAttribute: "",
                      isRequired: false,
                      isActive: true,
                    };
                    setMappingProvider({
                      ...mappingProvider,
                      attributeMappings: [
                        ...mappingProvider.attributeMappings,
                        newMapping,
                      ],
                    });
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Add Mapping
                </Button>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsMappingOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveMappings}>
                <Check className="h-4 w-4 mr-2" />
                Save Mappings
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* =========================================================================
            DELETE CONFIRMATION DIALOG
            ========================================================================= */}
        <AlertDialog
          open={!!providerToDelete}
          onOpenChange={() => setProviderToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Delete SCIM Provider
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete{" "}
                <strong>{providerToDelete?.name}</strong>? This will stop all
                synchronization with this provider. Existing users will remain
                in the system, but will no longer be updated from this source.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Provider
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}
