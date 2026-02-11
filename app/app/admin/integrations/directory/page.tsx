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
import { MetricCard } from "@/components/dashboard/metric-card";
import { ContextOverview } from "@/components/dashboard/context-overview";
import { Separator } from "@/components/dashboard/ui/separator";
import { TooltipProvider } from "@/components/dashboard/ui/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";

import {
  Database,
  Plus,
  Settings,
  Trash2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Activity,
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
  ArrowRight,
  GitCompare,
  Globe,
  Building2,
  XCircle,
  Eye,
  EyeOff,
  TestTube,
  Users,
  UserPlus,
  UserMinus,
  ShieldAlert,
  Lock,
  Cloud,
  DatabaseZap,
  OctagonAlert,
  CircleStop,
  UsersRound,
  Network,
  FileText,
  MapPin,
} from "lucide-react";

type DirectoryType =
  | "ldap"
  | "active_directory"
  | "azure_ad"
  | "google_workspace"
  | "custom_ldap"
  | "openldap"
  | "freeipa";

type DirectoryStatus =
  | "active"
  | "inactive"
  | "error"
  | "configuring"
  | "degraded";

type HealthStatus = "healthy" | "degraded" | "critical" | "unknown";

type SyncOperationType =
  | "create"
  | "update"
  | "delete"
  | "full_sync"
  | "group_sync";

type SyncStatus =
  | "success"
  | "failed"
  | "partial"
  | "in_progress"
  | "pending"
  | "cancelled";

type ConnectionSecurity = "none" | "tls" | "ssl" | "starttls";

interface DirectoryAttributeMapping {
  id: string;
  directoryAttribute: string;
  identityAttribute: string;
  isRequired: boolean;
  isActive: boolean;
  transform?: string;
  description?: string;
}

interface DirectoryCredential {
  type: "bind_dn" | "service_account" | "anonymous" | "sasl";
  username?: string;
  lastRotated?: string;
  expiresAt?: string;
}

interface DirectorySyncStats {
  usersCreated: number;
  usersUpdated: number;
  usersDeleted: number;
  usersDeactivated: number;
  groupsCreated: number;
  groupsUpdated: number;
  groupsDeleted: number;
  errors: number;
  warnings: number;
}

interface DirectoryFilter {
  id: string;
  name: string;
  filter: string;
  scope: "users" | "groups" | "both";
  isActive: boolean;
}

interface DirectoryConnection {
  host: string;
  port: number;
  security: ConnectionSecurity;
  baseDn: string;
  useSsl: boolean;
  timeout: number;
  maxRetries: number;
  followReferrals: boolean;
  customOptions?: Record<string, string>;
}

interface Directory {
  id: string;
  name: string;
  type: DirectoryType;
  status: DirectoryStatus;
  description: string;
  connection: DirectoryConnection;
  credentials: DirectoryCredential;
  filters: DirectoryFilter[];
  attributeMappings: DirectoryAttributeMapping[];
  syncEnabled: boolean;
  syncInterval: number;
  lastSync?: string;
  nextSync?: string;
  syncDirection: "inbound" | "outbound";
  provisioningActions: {
    create: boolean;
    update: boolean;
    deactivate: boolean;
    delete: boolean;
  };
  conflictResolution: "directory_wins" | "identity_wins" | "manual";
  healthStatus: HealthStatus;
  uptime: number;
  totalUsers: number;
  totalGroups: number;
  lastStats?: DirectorySyncStats;
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
  isManaged: boolean;
  region?: string;
}

interface SyncLog {
  id: string;
  timestamp: string;
  directoryId: string;
  directoryName: string;
  operation: SyncOperationType;
  status: SyncStatus;
  stats: DirectorySyncStats;
  duration: number;
  errorMessage?: string;
  errorDetails?: string;
  warnings?: string[];
}

interface DirectoryStats {
  totalDirectories: number;
  activeDirectories: number;
  errorDirectories: number;
  totalUsersSynced: number;
  totalGroupsSynced: number;
  avgSuccessRate: number;
  avgSyncTime: number;
  healthScore: number;
}

const directoryTypeConfig: Record<
  DirectoryType,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    description: string;
    provider?: string;
  }
> = {
  ldap: {
    label: "LDAP",
    icon: Database,
    color: "blue",
    bgColor: "bg-blue-500/10",
    description: "Standard LDAP directory service",
  },
  active_directory: {
    label: "Active Directory",
    icon: Building2,
    color: "violet",
    bgColor: "bg-violet-500/10",
    description: "Microsoft Active Directory",
    provider: "Microsoft",
  },
  azure_ad: {
    label: "Azure AD",
    icon: Cloud,
    color: "sky",
    bgColor: "bg-sky-500/10",
    description: "Azure Active Directory",
    provider: "Microsoft",
  },
  google_workspace: {
    label: "Google Workspace",
    icon: Globe,
    color: "amber",
    bgColor: "bg-amber-500/10",
    description: "Google Workspace Directory",
    provider: "Google",
  },
  custom_ldap: {
    label: "Custom LDAP",
    icon: Server,
    color: "slate",
    bgColor: "bg-slate-500/10",
    description: "Custom LDAP implementation",
  },
  openldap: {
    label: "OpenLDAP",
    icon: DatabaseZap,
    color: "orange",
    bgColor: "bg-orange-500/10",
    description: "OpenLDAP Server",
  },
  freeipa: {
    label: "FreeIPA",
    icon: Shield,
    color: "red",
    bgColor: "bg-red-500/10",
    description: "FreeIPA Identity Management",
    provider: "Red Hat",
  },
};

const statusConfig: Record<
  DirectoryStatus,
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
  degraded: {
    label: "Degraded",
    icon: AlertTriangle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
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
    icon: OctagonAlert,
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
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
  },
  cancelled: {
    label: "Cancelled",
    icon: CircleStop,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
};

const defaultAttributeMappings: DirectoryAttributeMapping[] = [
  {
    id: "map-1",
    directoryAttribute: "uid",
    identityAttribute: "username",
    isRequired: true,
    isActive: true,
    description: "Unique user identifier",
  },
  {
    id: "map-2",
    directoryAttribute: "mail",
    identityAttribute: "email",
    isRequired: true,
    isActive: true,
    description: "User email address",
  },
  {
    id: "map-3",
    directoryAttribute: "cn",
    identityAttribute: "displayName",
    isRequired: false,
    isActive: true,
    description: "Common name / display name",
  },
  {
    id: "map-4",
    directoryAttribute: "givenName",
    identityAttribute: "firstName",
    isRequired: false,
    isActive: true,
    description: "First name",
  },
  {
    id: "map-5",
    directoryAttribute: "sn",
    identityAttribute: "lastName",
    isRequired: false,
    isActive: true,
    description: "Last name / surname",
  },
  {
    id: "map-6",
    directoryAttribute: "memberOf",
    identityAttribute: "groups",
    isRequired: false,
    isActive: true,
    transform: "extract_cn",
    description: "Group memberships",
  },
  {
    id: "map-7",
    directoryAttribute: "department",
    identityAttribute: "department",
    isRequired: false,
    isActive: true,
    description: "Department",
  },
  {
    id: "map-8",
    directoryAttribute: "title",
    identityAttribute: "jobTitle",
    isRequired: false,
    isActive: true,
    description: "Job title",
  },
  {
    id: "map-9",
    directoryAttribute: "telephoneNumber",
    identityAttribute: "phone",
    isRequired: false,
    isActive: false,
    description: "Phone number",
  },
  {
    id: "map-10",
    directoryAttribute: "employeeNumber",
    identityAttribute: "employeeId",
    isRequired: false,
    isActive: false,
    description: "Employee ID",
  },
];

const defaultFilters: DirectoryFilter[] = [
  {
    id: "filter-1",
    name: "All Users",
    filter: "(objectClass=person)",
    scope: "users",
    isActive: true,
  },
  {
    id: "filter-2",
    name: "All Groups",
    filter: "(objectClass=groupOfNames)",
    scope: "groups",
    isActive: true,
  },
];

const mockDirectories: Directory[] = [
  {
    id: "dir-corp-ldap",
    name: "Corporate LDAP",
    type: "ldap",
    status: "active",
    description: "Primary corporate LDAP directory for all employees",
    connection: {
      host: "ldap.company.com",
      port: 636,
      security: "ssl",
      baseDn: "dc=company,dc=com",
      useSsl: true,
      timeout: 30000,
      maxRetries: 3,
      followReferrals: true,
    },
    credentials: {
      type: "bind_dn",
      username: "cn=aether-sync,ou=services,dc=company,dc=com",
      lastRotated: "2024-01-15",
    },
    filters: defaultFilters,
    attributeMappings: [...defaultAttributeMappings],
    syncEnabled: true,
    syncInterval: 30,
    lastSync: "2024-02-07T10:30:00Z",
    nextSync: "2024-02-07T11:00:00Z",
    syncDirection: "inbound",
    provisioningActions: {
      create: true,
      update: true,
      deactivate: true,
      delete: false,
    },
    conflictResolution: "directory_wins",
    healthStatus: "healthy",
    uptime: 99.97,
    totalUsers: 2847,
    totalGroups: 156,
    lastStats: {
      usersCreated: 3,
      usersUpdated: 12,
      usersDeleted: 0,
      usersDeactivated: 2,
      groupsCreated: 0,
      groupsUpdated: 5,
      groupsDeleted: 0,
      errors: 0,
      warnings: 3,
    },
    createdAt: "2023-06-15",
    updatedAt: "2024-02-01",
    isDefault: true,
    isManaged: false,
    region: "internal",
  },
  {
    id: "dir-azure-ad",
    name: "Azure AD Production",
    type: "azure_ad",
    status: "active",
    description: "Azure Active Directory for cloud users and groups",
    connection: {
      host: "graph.microsoft.com",
      port: 443,
      security: "tls",
      baseDn: "",
      useSsl: true,
      timeout: 60000,
      maxRetries: 3,
      followReferrals: false,
    },
    credentials: {
      type: "service_account",
      username: "aether-sync@company.onmicrosoft.com",
      lastRotated: "2024-02-01",
      expiresAt: "2024-08-01",
    },
    filters: defaultFilters,
    attributeMappings: [...defaultAttributeMappings],
    syncEnabled: true,
    syncInterval: 15,
    lastSync: "2024-02-07T10:25:00Z",
    nextSync: "2024-02-07T10:40:00Z",
    syncDirection: "inbound",
    provisioningActions: {
      create: true,
      update: true,
      deactivate: true,
      delete: true,
    },
    conflictResolution: "directory_wins",
    healthStatus: "healthy",
    uptime: 99.95,
    totalUsers: 3124,
    totalGroups: 203,
    lastStats: {
      usersCreated: 5,
      usersUpdated: 23,
      usersDeleted: 1,
      usersDeactivated: 4,
      groupsCreated: 2,
      groupsUpdated: 8,
      groupsDeleted: 0,
      errors: 0,
      warnings: 1,
    },
    createdAt: "2023-08-20",
    updatedAt: "2024-02-05",
    isDefault: false,
    isManaged: true,
    region: "us-east",
  },
  {
    id: "dir-ad-domain",
    name: "Windows AD Domain",
    type: "active_directory",
    status: "degraded",
    description: "Primary Windows Active Directory for legacy systems",
    connection: {
      host: "dc01.company.local",
      port: 389,
      security: "starttls",
      baseDn: "dc=company,dc=local",
      useSsl: true,
      timeout: 45000,
      maxRetries: 3,
      followReferrals: true,
    },
    credentials: {
      type: "service_account",
      username: "COMPANY\\aether-sync",
      lastRotated: "2024-01-10",
    },
    filters: defaultFilters,
    attributeMappings: [...defaultAttributeMappings],
    syncEnabled: true,
    syncInterval: 60,
    lastSync: "2024-02-07T09:15:00Z",
    nextSync: "2024-02-07T10:15:00Z",
    syncDirection: "inbound",
    provisioningActions: {
      create: true,
      update: true,
      deactivate: true,
      delete: false,
    },
    conflictResolution: "manual",
    healthStatus: "degraded",
    uptime: 94.2,
    totalUsers: 2456,
    totalGroups: 98,
    lastStats: {
      usersCreated: 0,
      usersUpdated: 45,
      usersDeleted: 0,
      usersDeactivated: 3,
      groupsCreated: 0,
      groupsUpdated: 12,
      groupsDeleted: 0,
      errors: 5,
      warnings: 12,
    },
    createdAt: "2023-05-10",
    updatedAt: "2024-02-06",
    isDefault: false,
    isManaged: false,
    region: "internal",
  },
  {
    id: "dir-google-workspace",
    name: "Google Workspace Directory",
    type: "google_workspace",
    status: "error",
    description: "Google Workspace for contractor and external user management",
    connection: {
      host: "admin.googleapis.com",
      port: 443,
      security: "tls",
      baseDn: "",
      useSsl: true,
      timeout: 30000,
      maxRetries: 2,
      followReferrals: false,
    },
    credentials: {
      type: "service_account",
      username: "aether-sync@company.iam.gserviceaccount.com",
      lastRotated: "2024-01-20",
    },
    filters: [
      {
        id: "filter-gws-1",
        name: "All Users",
        filter: "",
        scope: "users",
        isActive: true,
      },
    ],
    attributeMappings: [...defaultAttributeMappings],
    syncEnabled: true,
    syncInterval: 120,
    lastSync: "2024-02-07T08:00:00Z",
    nextSync: "2024-02-07T10:00:00Z",
    syncDirection: "inbound",
    provisioningActions: {
      create: false,
      update: true,
      deactivate: true,
      delete: false,
    },
    conflictResolution: "identity_wins",
    healthStatus: "critical",
    uptime: 89.5,
    totalUsers: 567,
    totalGroups: 34,
    lastStats: {
      usersCreated: 0,
      usersUpdated: 0,
      usersDeleted: 0,
      usersDeactivated: 0,
      groupsCreated: 0,
      groupsUpdated: 0,
      groupsDeleted: 0,
      errors: 1,
      warnings: 0,
    },
    createdAt: "2023-11-15",
    updatedAt: "2024-02-07",
    isDefault: false,
    isManaged: true,
    region: "us-central1",
  },
  {
    id: "dir-openldap-dev",
    name: "OpenLDAP Development",
    type: "openldap",
    status: "configuring",
    description: "Development and testing LDAP environment",
    connection: {
      host: "ldap-dev.company.com",
      port: 389,
      security: "none",
      baseDn: "dc=dev,dc=company,dc=com",
      useSsl: false,
      timeout: 15000,
      maxRetries: 3,
      followReferrals: false,
    },
    credentials: {
      type: "bind_dn",
      username: "cn=admin,dc=dev,dc=company,dc=com",
    },
    filters: defaultFilters,
    attributeMappings: [...defaultAttributeMappings],
    syncEnabled: false,
    syncInterval: 60,
    healthStatus: "unknown",
    uptime: 0,
    totalUsers: 0,
    totalGroups: 0,
    createdAt: "2024-02-01",
    updatedAt: "2024-02-07",
    isDefault: false,
    isManaged: false,
    region: "internal",
    syncDirection: "inbound",
    provisioningActions: {
      create: true,
      update: true,
      deactivate: false,
      delete: false,
    },
    conflictResolution: "directory_wins",
  },
];

const mockSyncLogs: SyncLog[] = [
  {
    id: "sync-001",
    timestamp: "2024-02-07T10:30:00Z",
    directoryId: "dir-corp-ldap",
    directoryName: "Corporate LDAP",
    operation: "full_sync",
    status: "success",
    stats: {
      usersCreated: 3,
      usersUpdated: 12,
      usersDeleted: 0,
      usersDeactivated: 2,
      groupsCreated: 0,
      groupsUpdated: 5,
      groupsDeleted: 0,
      errors: 0,
      warnings: 3,
    },
    duration: 45230,
    warnings: [
      "3 users without email address - used generated email",
      "2 groups with duplicate names - renamed automatically",
    ],
  },
  {
    id: "sync-002",
    timestamp: "2024-02-07T10:25:00Z",
    directoryId: "dir-azure-ad",
    directoryName: "Azure AD Production",
    operation: "update",
    status: "success",
    stats: {
      usersCreated: 5,
      usersUpdated: 23,
      usersDeleted: 1,
      usersDeactivated: 4,
      groupsCreated: 2,
      groupsUpdated: 8,
      groupsDeleted: 0,
      errors: 0,
      warnings: 1,
    },
    duration: 78450,
    warnings: ["1 user with invalid email format - skipped"],
  },
  {
    id: "sync-003",
    timestamp: "2024-02-07T09:15:00Z",
    directoryId: "dir-ad-domain",
    directoryName: "Windows AD Domain",
    operation: "full_sync",
    status: "partial",
    stats: {
      usersCreated: 0,
      usersUpdated: 45,
      usersDeleted: 0,
      usersDeactivated: 3,
      groupsCreated: 0,
      groupsUpdated: 12,
      groupsDeleted: 0,
      errors: 5,
      warnings: 12,
    },
    duration: 156780,
    errorMessage: "5 connection timeouts",
    errorDetails: "Some LDAP queries exceeded timeout threshold",
    warnings: [
      "8 users not in expected OU",
      "4 groups with circular membership detected",
    ],
  },
  {
    id: "sync-004",
    timestamp: "2024-02-07T08:00:00Z",
    directoryId: "dir-google-workspace",
    directoryName: "Google Workspace Directory",
    operation: "full_sync",
    status: "failed",
    stats: {
      usersCreated: 0,
      usersUpdated: 0,
      usersDeleted: 0,
      usersDeactivated: 0,
      groupsCreated: 0,
      groupsUpdated: 0,
      groupsDeleted: 0,
      errors: 1,
      warnings: 0,
    },
    duration: 2340,
    errorMessage: "OAuth token expired",
    errorDetails:
      "Token refresh failed: invalid_grant - Service account key may need rotation",
  },
  {
    id: "sync-005",
    timestamp: "2024-02-07T07:30:00Z",
    directoryId: "dir-corp-ldap",
    directoryName: "Corporate LDAP",
    operation: "group_sync",
    status: "success",
    stats: {
      usersCreated: 0,
      usersUpdated: 8,
      usersDeleted: 0,
      usersDeactivated: 0,
      groupsCreated: 0,
      groupsUpdated: 5,
      groupsDeleted: 0,
      errors: 0,
      warnings: 0,
    },
    duration: 12340,
  },
  {
    id: "sync-006",
    timestamp: "2024-02-07T06:00:00Z",
    directoryId: "dir-azure-ad",
    directoryName: "Azure AD Production",
    operation: "full_sync",
    status: "success",
    stats: {
      usersCreated: 2,
      usersUpdated: 15,
      usersDeleted: 0,
      usersDeactivated: 1,
      groupsCreated: 1,
      groupsUpdated: 3,
      groupsDeleted: 0,
      errors: 0,
      warnings: 2,
    },
    duration: 98760,
    warnings: ["2 users with missing department attribute"],
  },
];

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
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${((ms % 60000) / 1000).toFixed(0)}s`;
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const SyncStatusBadge = ({ status }: { status: SyncStatus }) => {
  const config = syncStatusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn("gap-1 text-xs font-medium", config.bgColor, config.color)}
    >
      <Icon
        className={cn("h-3 w-3", status === "in_progress" && "animate-spin")}
      />
      {config.label}
    </Badge>
  );
};

export default function DirectoryPage() {
  const [directories, setDirectories] =
    React.useState<Directory[]>(mockDirectories);
  const [syncLogs] = React.useState<SyncLog[]>(mockSyncLogs);
  const [selectedDirectory, setSelectedDirectory] =
    React.useState<Directory | null>(null);
  const [isConfigOpen, setIsConfigOpen] = React.useState(false);
  const [directoryToDelete, setDirectoryToDelete] =
    React.useState<Directory | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("directories");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterType, setFilterType] = React.useState<DirectoryType | "all">(
    "all",
  );
  const [filterStatus, setFilterStatus] = React.useState<
    DirectoryStatus | "all"
  >("all");
  const [showSecret, setShowSecret] = React.useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = React.useState(false);
  const [isTesting, setIsTesting] = React.useState(false);
  const [mappingDirectory, setMappingDirectory] =
    React.useState<Directory | null>(null);
  const [isMappingOpen, setIsMappingOpen] = React.useState(false);
  const [selectedLog, setSelectedLog] = React.useState<SyncLog | null>(null);
  const [isLogDetailOpen, setIsLogDetailOpen] = React.useState(false);

  const directoryCounterRef = React.useRef(0);

  const stats: DirectoryStats = React.useMemo(() => {
    const active = directories.filter((d) => d.status === "active").length;
    const errors = directories.filter(
      (d) => d.status === "error" || d.status === "degraded",
    ).length;
    const totalUsers = directories.reduce((acc, d) => acc + d.totalUsers, 0);
    const totalGroups = directories.reduce((acc, d) => acc + d.totalGroups, 0);
    const avgSuccessRate =
      directories.length > 0
        ? directories.reduce((acc, d) => {
            const lastStats = d.lastStats;
            if (!lastStats || lastStats.errors > 0) return acc;
            const total =
              lastStats.usersCreated +
              lastStats.usersUpdated +
              lastStats.usersDeleted +
              lastStats.usersDeactivated;
            return (
              acc +
              (total > 0 ? ((total - lastStats.errors) / total) * 100 : 100)
            );
          }, 0) / (directories.filter((d) => d.lastStats).length || 1)
        : 0;
    const avgSyncTime =
      directories.length > 0
        ? directories
            .filter((d) => d.lastStats)
            .reduce((acc) => acc + 45000, 0) /
          (directories.filter((d) => d.lastStats).length || 1)
        : 0;
    const healthyCount = directories.filter(
      (d) => d.healthStatus === "healthy",
    ).length;
    const healthScore = (healthyCount / directories.length) * 100 || 0;

    return {
      totalDirectories: directories.length,
      activeDirectories: active,
      errorDirectories: errors,
      totalUsersSynced: totalUsers,
      totalGroupsSynced: totalGroups,
      avgSuccessRate,
      avgSyncTime,
      healthScore,
    };
  }, [directories]);

  const filteredDirectories = React.useMemo(() => {
    return directories.filter((directory) => {
      const matchesSearch =
        directory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        directory.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === "all" || directory.type === filterType;
      const matchesStatus =
        filterStatus === "all" || directory.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [directories, searchQuery, filterType, filterStatus]);

  const hasErrors = stats.errorDirectories > 0;
  const hasConfiguring = directories.some((d) => d.status === "configuring");

  const handleToggleDirectory = (directoryId: string) => {
    setDirectories((prev) =>
      prev.map((d) => {
        if (d.id !== directoryId) return d;
        const newStatus = d.status === "active" ? "inactive" : "active";
        return { ...d, status: newStatus, updatedAt: new Date().toISOString() };
      }),
    );
  };

  const handleConfigure = (directory: Directory) => {
    setSelectedDirectory({ ...directory });
    setShowSecret(false);
    setIsConfigOpen(true);
  };

  const handleOpenMappings = (directory: Directory) => {
    setMappingDirectory({ ...directory });
    setIsMappingOpen(true);
  };

  const handleSaveConfiguration = () => {
    if (!selectedDirectory) return;
    setDirectories((prev) =>
      prev.map((d) =>
        d.id === selectedDirectory.id
          ? { ...selectedDirectory, updatedAt: new Date().toISOString() }
          : d,
      ),
    );
    setIsConfigOpen(false);
    setSelectedDirectory(null);
  };

  const handleSaveMappings = () => {
    if (!mappingDirectory) return;
    setDirectories((prev) =>
      prev.map((d) =>
        d.id === mappingDirectory.id
          ? { ...mappingDirectory, updatedAt: new Date().toISOString() }
          : d,
      ),
    );
    setIsMappingOpen(false);
    setMappingDirectory(null);
  };

  const handleDelete = (directory: Directory) => {
    setDirectoryToDelete(directory);
  };

  const confirmDelete = () => {
    if (!directoryToDelete) return;
    setDirectories((prev) => prev.filter((d) => d.id !== directoryToDelete.id));
    setDirectoryToDelete(null);
  };

  const handleAddDirectory = (type: DirectoryType) => {
    directoryCounterRef.current += 1;
    const timestamp = directoryCounterRef.current;
    const typeConfig = directoryTypeConfig[type];
    const newDirectory: Directory = {
      id: `dir-new-${timestamp}`,
      name: `New ${typeConfig.label} Directory`,
      type,
      status: "configuring",
      description: "Configure this directory connection",
      connection: {
        host: "",
        port: type === "ldap" ? 389 : 636,
        security: type === "ldap" ? "none" : "tls",
        baseDn: "",
        useSsl: type === "ldap",
        timeout: 30000,
        maxRetries: 3,
        followReferrals: false,
      },
      credentials: {
        type: "bind_dn",
      },
      filters: [...defaultFilters],
      attributeMappings: [...defaultAttributeMappings],
      syncEnabled: false,
      syncInterval: 30,
      healthStatus: "unknown",
      uptime: 0,
      totalUsers: 0,
      totalGroups: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDefault: false,
      isManaged: type === "azure_ad" || type === "google_workspace",
      syncDirection: "inbound",
      provisioningActions: {
        create: true,
        update: true,
        deactivate: false,
        delete: false,
      },
      conflictResolution: "directory_wins",
    };
    setDirectories((prev) => [...prev, newDirectory]);
    setIsAddDialogOpen(false);
    handleConfigure(newDirectory);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsTesting(false);
    setIsTestDialogOpen(false);
    alert("Connection test successful!");
  };

  const handleSyncAll = () => {
    alert("Starting full sync for all active directories...");
  };

  const handleCheckAllHealth = () => {
    setDirectories((prev) =>
      prev.map((d) => ({
        ...d,
        healthStatus:
          d.status === "error"
            ? "critical"
            : d.status === "degraded"
              ? "degraded"
              : "healthy",
        lastSync: d.status === "active" ? new Date().toISOString() : d.lastSync,
      })),
    );
  };

  const handleSetDefault = (directoryId: string) => {
    setDirectories((prev) =>
      prev.map((d) => ({
        ...d,
        isDefault: d.id === directoryId,
      })),
    );
  };

  const handleForceSync = (directoryId: string) => {
    setDirectories((prev) =>
      prev.map((d) =>
        d.id === directoryId
          ? {
              ...d,
              lastSync: new Date().toISOString(),
              nextSync: new Date(
                Date.now() + d.syncInterval * 60000,
              ).toISOString(),
            }
          : d,
      ),
    );
    alert(`Full sync triggered for directory`);
  };

  const handleViewLogDetail = (log: SyncLog) => {
    setSelectedLog(log);
    setIsLogDetailOpen(true);
  };

  const StatusBadge = ({ status }: { status: DirectoryStatus }) => {
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

  const TypeBadge = ({ type }: { type: DirectoryType }) => {
    const config = directoryTypeConfig[type];

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

  return (
    <TooltipProvider>
      <div className="space-y-6 text-foreground">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-card-foreground">
                Identity Directory Integrations
              </h1>
              {hasErrors && (
                <Badge variant="destructive" className="text-xs gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {stats.errorDirectories} issues
                </Badge>
              )}
              {hasConfiguring && (
                <Badge
                  variant="outline"
                  className="text-xs text-amber-500 border-amber-500/30"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {
                    directories.filter((d) => d.status === "configuring").length
                  }{" "}
                  configuring
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Manage external directory connections for user and group
              synchronization
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
              Add Directory
            </Button>
          </div>
        </div>

        <ContextOverview
          authority="Acme Corporation"
          workspace="Production"
          role="Identity Administrator"
          accessLevel="Full directory management"
          isPrivileged={true}
          lastLogin="Today, 9:42 AM"
        />

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "h-2 w-2 rounded-full animate-pulse",
                hasErrors
                  ? "bg-red-500"
                  : hasConfiguring
                    ? "bg-amber-500"
                    : "bg-emerald-500",
              )}
            />
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Directory Health Overview
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Active Directories"
              value={stats.activeDirectories}
              subtitle={`${stats.totalDirectories} total configured`}
              icon={Server}
              variant={hasErrors ? "warning" : "default"}
              trend={{
                value: stats.activeDirectories,
                isPositive: stats.activeDirectories > 0,
              }}
            />
            <MetricCard
              title="Users Synced"
              value={formatNumber(stats.totalUsersSynced)}
              subtitle="Across all directories"
              icon={Users}
              variant="default"
              trend={{ value: 5.2, isPositive: true }}
            />
            <MetricCard
              title="Groups Synced"
              value={formatNumber(stats.totalGroupsSynced)}
              subtitle="Across all directories"
              icon={UsersRound}
              variant="default"
              trend={{ value: 3.8, isPositive: true }}
            />
            <MetricCard
              title="Success Rate"
              value={`${stats.avgSuccessRate.toFixed(1)}%`}
              subtitle="Average across directories"
              icon={CheckCircle2}
              variant={
                stats.healthScore >= 90
                  ? "default"
                  : stats.healthScore >= 70
                    ? "warning"
                    : "destructive"
              }
              trend={{ value: 2.1, isPositive: true }}
            />
          </div>

          {hasErrors && (
            <Alert
              variant="destructive"
              className="border-red-500/30 bg-red-500/10"
            >
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertTitle className="text-red-400">
                Directory Issues Detected
              </AlertTitle>
              <AlertDescription className="text-red-400/80">
                {stats.errorDirectories} directory(s) experiencing issues.
                Review configurations and credentials to ensure proper
                synchronization.
              </AlertDescription>
            </Alert>
          )}
        </section>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-muted/50">
            <TabsTrigger value="directories" className="gap-2">
              <Database className="h-4 w-4" />
              Directories
              <Badge variant="secondary" className="ml-1 text-xs">
                {directories.length}
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

          <TabsContent value="directories" className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search directories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={filterType}
                  onValueChange={(v) =>
                    setFilterType(v as DirectoryType | "all")
                  }
                >
                  <SelectTrigger className="w-[160px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Directory type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="ldap">LDAP</SelectItem>
                    <SelectItem value="active_directory">
                      Active Directory
                    </SelectItem>
                    <SelectItem value="azure_ad">Azure AD</SelectItem>
                    <SelectItem value="google_workspace">
                      Google Workspace
                    </SelectItem>
                    <SelectItem value="openldap">OpenLDAP</SelectItem>
                    <SelectItem value="freeipa">FreeIPA</SelectItem>
                    <SelectItem value="custom_ldap">Custom LDAP</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filterStatus}
                  onValueChange={(v) =>
                    setFilterStatus(v as DirectoryStatus | "all")
                  }
                >
                  <SelectTrigger className="w-[160px]">
                    <Activity className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="degraded">Degraded</SelectItem>
                    <SelectItem value="configuring">Configuring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredDirectories.map((directory) => {
                const Icon = directoryTypeConfig[directory.type].icon;
                const isError =
                  directory.status === "error" ||
                  directory.healthStatus === "critical";
                const isDegraded =
                  directory.status === "degraded" ||
                  directory.healthStatus === "degraded";
                const isConfiguring = directory.status === "configuring";

                return (
                  <Card
                    key={directory.id}
                    className={cn(
                      "border-border bg-card transition-all",
                      directory.status === "inactive" && "opacity-75",
                      isError && "border-red-500/30 shadow-red-500/5",
                      isDegraded && "border-amber-500/30",
                      isConfiguring && "border-blue-500/30",
                      directory.isDefault && "ring-1 ring-emerald-500/30",
                    )}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-lg",
                              directoryTypeConfig[directory.type].bgColor,
                            )}
                          >
                            <Icon
                              className={cn(
                                "h-5 w-5",
                                `text-${directoryTypeConfig[directory.type].color}-500`,
                              )}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-sm font-medium text-foreground truncate">
                                {directory.name}
                              </CardTitle>
                              {directory.isDefault && (
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
                              {directoryTypeConfig[directory.type].description}
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
                              onClick={() => handleConfigure(directory)}
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              Configure
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleOpenMappings(directory)}
                            >
                              <GitCompare className="h-4 w-4 mr-2" />
                              Edit Mappings
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleForceSync(directory.id)}
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Force Sync
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleSetDefault(directory.id)}
                              disabled={directory.isDefault}
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Set as Default
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                handleToggleDirectory(directory.id)
                              }
                            >
                              {directory.status === "active" ? (
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
                              onClick={() => handleDelete(directory)}
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
                      <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge status={directory.status} />
                        <HealthBadge status={directory.healthStatus} />
                        <TypeBadge type={directory.type} />
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {directory.description}
                      </p>

                      <div className="flex items-center gap-2 text-xs">
                        {directory.connection.host && (
                          <>
                            <Network className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {directory.connection.host}
                            </span>
                            <span className="text-muted-foreground">:</span>
                            <span className="text-muted-foreground">
                              {directory.connection.port}
                            </span>
                          </>
                        )}
                        {directory.syncEnabled && (
                          <>
                            <span className="text-muted-foreground">•</span>
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              Every {directory.syncInterval} min
                            </span>
                          </>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 py-3 border-y border-border">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Users className="h-3.5 w-3.5 text-muted-foreground" />
                            <p className="text-lg font-semibold text-foreground">
                              {formatNumber(directory.totalUsers)}
                            </p>
                          </div>
                          <p className="text-[10px] text-muted-foreground uppercase">
                            Users
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <UsersRound className="h-3.5 w-3.5 text-muted-foreground" />
                            <p className="text-lg font-semibold text-foreground">
                              {formatNumber(directory.totalGroups)}
                            </p>
                          </div>
                          <p className="text-[10px] text-muted-foreground uppercase">
                            Groups
                          </p>
                        </div>
                      </div>

                      {directory.lastStats && (
                        <div className="grid grid-cols-3 gap-2 py-2 border-y border-border">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <UserPlus className="h-3 w-3 text-emerald-500" />
                              <p className="text-sm font-medium text-emerald-500">
                                {directory.lastStats.usersCreated}
                              </p>
                            </div>
                            <p className="text-[10px] text-muted-foreground uppercase">
                              Created
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <RefreshCw className="h-3 w-3 text-blue-500" />
                              <p className="text-sm font-medium text-blue-500">
                                {directory.lastStats.usersUpdated}
                              </p>
                            </div>
                            <p className="text-[10px] text-muted-foreground uppercase">
                              Updated
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <UserMinus className="h-3 w-3 text-amber-500" />
                              <p className="text-sm font-medium text-amber-500">
                                {directory.lastStats.usersDeactivated}
                              </p>
                            </div>
                            <p className="text-[10px] text-muted-foreground uppercase">
                              Deactivated
                            </p>
                          </div>
                        </div>
                      )}

                      {(isError || isDegraded) && (
                        <div
                          className={cn(
                            "rounded-md border p-3",
                            isError
                              ? "bg-red-500/5 border-red-500/20"
                              : "bg-amber-500/5 border-amber-500/20",
                          )}
                        >
                          <div className="flex items-start gap-2">
                            {isError ? (
                              <OctagonAlert className="h-4 w-4 text-red-500 mt-0.5" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                            )}
                            <div>
                              <p
                                className={cn(
                                  "text-sm font-medium",
                                  isError ? "text-red-700" : "text-amber-700",
                                )}
                              >
                                {isError
                                  ? "Connection Error"
                                  : "Degraded Performance"}
                              </p>
                              <p
                                className={cn(
                                  "text-xs mt-0.5",
                                  isError ? "text-red-600" : "text-amber-600",
                                )}
                              >
                                {isError
                                  ? "Directory not responding. Check connection settings."
                                  : "Some operations timing out. Consider adjusting timeout settings."}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {directory.lastSync && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            Last sync: {formatRelativeTime(directory.lastSync)}
                          </span>
                          {directory.nextSync && (
                            <>
                              <span>•</span>
                              <span>
                                Next: {formatRelativeTime(directory.nextSync)}
                              </span>
                            </>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <Switch
                            id={`${directory.id}-toggle`}
                            checked={directory.status === "active"}
                            onCheckedChange={() =>
                              handleToggleDirectory(directory.id)
                            }
                            disabled={
                              directory.status === "configuring" ||
                              directory.status === "error"
                            }
                          />
                          <Label
                            htmlFor={`${directory.id}-toggle`}
                            className="text-sm text-muted-foreground cursor-pointer"
                          >
                            {directory.status === "active"
                              ? "Enabled"
                              : "Disabled"}
                          </Label>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleConfigure(directory)}
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

            {filteredDirectories.length === 0 && (
              <Card className="border-dashed border-2 border-border bg-card/50">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary mb-4">
                    <Database className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-sm font-medium text-foreground mb-1">
                    No directories found
                  </h3>
                  <p className="text-xs text-muted-foreground text-center max-w-xs">
                    {searchQuery ||
                    filterType !== "all" ||
                    filterStatus !== "all"
                      ? "Try adjusting your search or filters"
                      : "Connect your first directory to enable user and group synchronization"}
                  </p>
                  {!searchQuery &&
                    filterType === "all" &&
                    filterStatus === "all" && (
                      <Button
                        onClick={() => setIsAddDialogOpen(true)}
                        className="mt-4 gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add First Directory
                      </Button>
                    )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <History className="h-4 w-4 text-muted-foreground" />
                    Recent Synchronization Activity
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Link href="/admin/integrations/logs">
                      <Button variant="outline" className="gap-2 text-xs">
                        <FileText className="h-3.5 w-3.5" />
                        View Full Logs
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <CardDescription>
                  Directory synchronization history and diagnostics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border border-border">
                  <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    <div className="col-span-2">Timestamp</div>
                    <div className="col-span-3">Directory</div>
                    <div className="col-span-2">Operation</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Duration</div>
                    <div className="col-span-1">Actions</div>
                  </div>
                  <div className="divide-y divide-border">
                    {syncLogs.map((log) => (
                      <div
                        key={log.id}
                        className="grid grid-cols-12 gap-4 px-4 py-3 text-sm items-center hover:bg-muted/25 transition-colors"
                      >
                        <div className="col-span-2 text-muted-foreground">
                          {formatRelativeTime(log.timestamp)}
                        </div>
                        <div className="col-span-3 font-medium text-foreground">
                          {log.directoryName}
                        </div>
                        <div className="col-span-2">
                          <Badge variant="outline" className="text-xs gap-1">
                            {log.operation === "full_sync" && (
                              <RefreshCw className="h-3 w-3" />
                            )}
                            {log.operation === "update" && (
                              <RefreshCw className="h-3 w-3" />
                            )}
                            {log.operation === "create" && (
                              <UserPlus className="h-3 w-3" />
                            )}
                            {log.operation === "delete" && (
                              <UserMinus className="h-3 w-3" />
                            )}
                            {log.operation === "group_sync" && (
                              <UsersRound className="h-3 w-3" />
                            )}
                            {log.operation.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="col-span-2">
                          <SyncStatusBadge status={log.status} />
                        </div>
                        <div className="col-span-2 text-muted-foreground">
                          {formatDuration(log.duration)}
                        </div>
                        <div className="col-span-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleViewLogDetail(log)}
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-xs text-muted-foreground">
                      Success
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="text-xs text-muted-foreground">
                      Partial
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="text-xs text-muted-foreground">
                      Failed
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-xs text-muted-foreground">
                      In Progress
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mappings" className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <GitCompare className="h-4 w-4 text-muted-foreground" />
                  Default Attribute Mappings
                </CardTitle>
                <CardDescription>
                  Standard mappings for directory attributes to Identity
                  attributes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-border">
                  <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    <div className="col-span-2">Directory Attribute</div>
                    <div className="col-span-2">Identity Attribute</div>
                    <div className="col-span-1">Required</div>
                  </div>
                  <div className="divide-y divide-border">
                    {defaultAttributeMappings.map((mapping) => (
                      <div
                        key={mapping.id}
                        className="grid grid-cols-5 gap-4 px-4 py-3 text-sm items-center"
                      >
                        <div className="col-span-2">
                          <code className="text-xs bg-muted/50 px-1.5 py-0.5 rounded">
                            {mapping.directoryAttribute}
                          </code>
                        </div>
                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">
                              {mapping.identityAttribute}
                            </span>
                          </div>
                        </div>
                        <div className="col-span-1">
                          {mapping.isRequired ? (
                            <Badge
                              variant="outline"
                              className="text-xs gap-1 text-red-500 border-red-500/20"
                            >
                              <Lock className="h-3 w-3" />
                              Required
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              Optional
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  These are default mappings. Individual directories can have
                  custom mappings configured in their settings. Transforms can
                  be applied to modify attribute values during synchronization.
                </p>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    Available Transforms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <code className="text-xs bg-muted/50 px-1.5 py-0.5 rounded">
                      lowercase
                    </code>
                    <span className="text-muted-foreground">
                      Convert to lowercase
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <code className="text-xs bg-muted/50 px-1.5 py-0.5 rounded">
                      uppercase
                    </code>
                    <span className="text-muted-foreground">
                      Convert to uppercase
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <code className="text-xs bg-muted/50 px-1.5 py-0.5 rounded">
                      extract_cn
                    </code>
                    <span className="text-muted-foreground">
                      Extract CN from DN
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <code className="text-xs bg-muted/50 px-1.5 py-0.5 rounded">
                      extract_domain
                    </code>
                    <span className="text-muted-foreground">
                      Extract domain from email
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <code className="text-xs bg-muted/50 px-1.5 py-0.5 rounded">
                      static
                    </code>
                    <span className="text-muted-foreground">
                      Use static value
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                    Security Considerations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2 text-sm">
                    <Lock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">
                      Credentials are encrypted at rest and never logged
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <EyeOff className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">
                      Sensitive attributes can be masked in logs
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Shield className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">
                      TLS/SSL required for production directories
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  Global Directory Settings
                </CardTitle>
                <CardDescription>
                  Default settings applied to all directory integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="default-timeout" className="text-sm">
                      Default Connection Timeout
                    </Label>
                    <Input
                      id="default-timeout"
                      type="number"
                      defaultValue={30000}
                      className="max-w-xs"
                    />
                    <p className="text-xs text-muted-foreground">
                      Timeout in milliseconds for directory connections
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default-interval" className="text-sm">
                      Default Sync Interval
                    </Label>
                    <Select defaultValue="30">
                      <SelectTrigger className="max-w-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="360">6 hours</SelectItem>
                        <SelectItem value="1440">24 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Provisioning Defaults</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Auto-create users</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Auto-update users</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserMinus className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Auto-deactivate users</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Auto-delete users</span>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Security Settings</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Require TLS/SSL for all connections
                      </span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Validate certificates</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Alert on sync failures</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Directory</DialogTitle>
              <DialogDescription>
                Connect a new directory to enable user and group synchronization
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Label className="text-sm">Directory Type</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { type: "ldap", icon: Database, label: "LDAP" },
                  {
                    type: "active_directory",
                    icon: Building2,
                    label: "Active Directory",
                  },
                  { type: "azure_ad", icon: Cloud, label: "Azure AD" },
                  {
                    type: "google_workspace",
                    icon: Globe,
                    label: "Google Workspace",
                  },
                  { type: "openldap", icon: DatabaseZap, label: "OpenLDAP" },
                  { type: "custom_ldap", icon: Server, label: "Custom LDAP" },
                ].map((option) => (
                  <Button
                    key={option.type}
                    variant="outline"
                    className="h-auto py-3 flex-col gap-2"
                    onClick={() =>
                      handleAddDirectory(option.type as DirectoryType)
                    }
                  >
                    <option.icon className="h-5 w-5" />
                    <span className="text-xs">{option.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Configure Directory</DialogTitle>
              <DialogDescription>
                {selectedDirectory?.name} - Connection and synchronization
                settings
              </DialogDescription>
            </DialogHeader>
            {selectedDirectory && (
              <Tabs defaultValue="connection" className="mt-4">
                <TabsList className="w-full">
                  <TabsTrigger value="connection" className="flex-1">
                    Connection
                  </TabsTrigger>
                  <TabsTrigger value="credentials" className="flex-1">
                    Credentials
                  </TabsTrigger>
                  <TabsTrigger value="sync" className="flex-1">
                    Synchronization
                  </TabsTrigger>
                  <TabsTrigger value="provisioning" className="flex-1">
                    Provisioning
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="connection" className="space-y-4 mt-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="host" className="text-sm">
                        Directory Host
                      </Label>
                      <Input
                        id="host"
                        defaultValue={selectedDirectory.connection.host}
                        placeholder="ldap.company.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="port" className="text-sm">
                        Port
                      </Label>
                      <Input
                        id="port"
                        type="number"
                        defaultValue={selectedDirectory.connection.port}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="base-dn" className="text-sm">
                      Base DN
                    </Label>
                    <Input
                      id="base-dn"
                      defaultValue={selectedDirectory.connection.baseDn}
                      placeholder="dc=company,dc=com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="security" className="text-sm">
                      Security
                    </Label>
                    <Select
                      defaultValue={selectedDirectory.connection.security}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="tls">TLS</SelectItem>
                        <SelectItem value="ssl">SSL</SelectItem>
                        <SelectItem value="starttls">STARTTLS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="timeout" className="text-sm">
                        Timeout (ms)
                      </Label>
                      <Input
                        id="timeout"
                        type="number"
                        defaultValue={selectedDirectory.connection.timeout}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="retries" className="text-sm">
                        Max Retries
                      </Label>
                      <Input
                        id="retries"
                        type="number"
                        defaultValue={selectedDirectory.connection.maxRetries}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="follow-referrals"
                      defaultChecked={
                        selectedDirectory.connection.followReferrals
                      }
                    />
                    <Label htmlFor="follow-referrals" className="text-sm">
                      Follow LDAP referrals
                    </Label>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsTestDialogOpen(true)}
                      className="gap-2"
                    >
                      <TestTube className="h-4 w-4" />
                      Test Connection
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="credentials" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm">
                      Bind DN / Username
                    </Label>
                    <Input
                      id="username"
                      defaultValue={selectedDirectory.credentials.username}
                      placeholder="cn=aether-sync,ou=services,dc=company,dc=com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showSecret ? "text" : "password"}
                        placeholder="Enter password"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowSecret(!showSecret)}
                      >
                        {showSecret ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-md bg-muted/50 p-4">
                    <div className="flex items-start gap-2">
                      <Lock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">Credentials are encrypted</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Passwords are encrypted using AES-256 and never logged
                          or exposed in UI
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="sync" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="sync-enabled" className="text-sm">
                        Enable automatic synchronization
                      </Label>
                    </div>
                    <Switch
                      id="sync-enabled"
                      defaultChecked={selectedDirectory.syncEnabled}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sync-interval" className="text-sm">
                      Sync Interval
                    </Label>
                    <Select
                      defaultValue={selectedDirectory.syncInterval.toString()}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">Every 15 minutes</SelectItem>
                        <SelectItem value="30">Every 30 minutes</SelectItem>
                        <SelectItem value="60">Every hour</SelectItem>
                        <SelectItem value="120">Every 2 hours</SelectItem>
                        <SelectItem value="360">Every 6 hours</SelectItem>
                        <SelectItem value="1440">Every 24 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="conflict-resolution" className="text-sm">
                      Conflict Resolution
                    </Label>
                    <Select defaultValue={selectedDirectory.conflictResolution}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="directory_wins">
                          Directory wins
                        </SelectItem>
                        <SelectItem value="identity_wins">
                          Identity wins
                        </SelectItem>
                        <SelectItem value="manual">
                          Manual resolution
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="provisioning" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    <Label className="text-sm">Provisioning Actions</Label>
                    <div className="grid gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <UserPlus className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Create users</span>
                        </div>
                        <Switch
                          defaultChecked={
                            selectedDirectory.provisioningActions.create
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <RefreshCw className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Update users</span>
                        </div>
                        <Switch
                          defaultChecked={
                            selectedDirectory.provisioningActions.update
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <UserMinus className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Deactivate users</span>
                        </div>
                        <Switch
                          defaultChecked={
                            selectedDirectory.provisioningActions.deactivate
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Delete users</span>
                        </div>
                        <Switch
                          defaultChecked={
                            selectedDirectory.provisioningActions.delete
                          }
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveConfiguration}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Test Connection</DialogTitle>
              <DialogDescription>
                Verify connectivity to the directory server
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              {isTesting ? (
                <div className="flex flex-col items-center gap-4">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Testing connection...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <TestTube className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground text-center">
                    Ready to test connection with current settings
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsTestDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleTestConnection} disabled={isTesting}>
                {isTesting ? "Testing..." : "Start Test"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isMappingOpen} onOpenChange={setIsMappingOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Attribute Mappings</DialogTitle>
              <DialogDescription>
                Configure how directory attributes map to Identity attributes
              </DialogDescription>
            </DialogHeader>
            {mappingDirectory && (
              <div className="space-y-4 mt-4">
                <div className="rounded-md border border-border">
                  <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    <div className="col-span-4">Directory Attribute</div>
                    <div className="col-span-4">Identity Attribute</div>
                    <div className="col-span-2">Required</div>
                    <div className="col-span-2">Active</div>
                  </div>
                  <div className="divide-y divide-border">
                    {mappingDirectory.attributeMappings.map((mapping) => (
                      <div
                        key={mapping.id}
                        className="grid grid-cols-12 gap-4 px-4 py-3 text-sm items-center"
                      >
                        <div className="col-span-4">
                          <Input
                            defaultValue={mapping.directoryAttribute}
                            className="h-8"
                          />
                        </div>
                        <div className="col-span-4">
                          <Input
                            defaultValue={mapping.identityAttribute}
                            className="h-8"
                          />
                        </div>
                        <div className="col-span-2">
                          <Checkbox defaultChecked={mapping.isRequired} />
                        </div>
                        <div className="col-span-2">
                          <Switch defaultChecked={mapping.isActive} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Button variant="outline" className="w-full gap-2">
                  <Plus className="h-4 w-4" />
                  Add Custom Mapping
                </Button>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsMappingOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveMappings}>Save Mappings</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isLogDetailOpen} onOpenChange={setIsLogDetailOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Sync Details</DialogTitle>
              <DialogDescription>
                {selectedLog?.directoryName} -{" "}
                {selectedLog?.timestamp &&
                  new Date(selectedLog.timestamp).toLocaleString()}
              </DialogDescription>
            </DialogHeader>
            {selectedLog && (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">
                      Operation
                    </p>
                    <Badge variant="outline">
                      {selectedLog.operation.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">
                      Status
                    </p>
                    <SyncStatusBadge status={selectedLog.status} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">
                      Duration
                    </p>
                    <p className="text-sm font-medium">
                      {formatDuration(selectedLog.duration)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">
                      Timestamp
                    </p>
                    <p className="text-sm font-medium">
                      {new Date(selectedLog.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground uppercase">
                    Statistics
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                      <p className="text-2xl font-semibold text-emerald-500">
                        {selectedLog.stats.usersCreated}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Users Created
                      </p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                      <p className="text-2xl font-semibold text-blue-500">
                        {selectedLog.stats.usersUpdated}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Users Updated
                      </p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                      <p className="text-2xl font-semibold text-amber-500">
                        {selectedLog.stats.usersDeactivated}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Users Deactivated
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="text-center p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                      <p className="text-xl font-semibold text-purple-500">
                        {selectedLog.stats.groupsCreated +
                          selectedLog.stats.groupsUpdated}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Groups Updated
                      </p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                      <p className="text-xl font-semibold text-red-500">
                        {selectedLog.stats.errors}
                      </p>
                      <p className="text-xs text-muted-foreground">Errors</p>
                    </div>
                  </div>
                </div>

                {selectedLog.errorMessage && (
                  <>
                    <Separator />
                    <div className="rounded-md bg-red-500/5 border border-red-500/20 p-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-red-700">
                            {selectedLog.errorMessage}
                          </p>
                          {selectedLog.errorDetails && (
                            <p className="text-xs text-red-600 mt-1">
                              {selectedLog.errorDetails}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {selectedLog.warnings && selectedLog.warnings.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground uppercase">
                        Warnings
                      </p>
                      {selectedLog.warnings.map((warning, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-sm"
                        >
                          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">
                            {warning}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsLogDetailOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog
          open={!!directoryToDelete}
          onOpenChange={() => setDirectoryToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Directory</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &quot;{directoryToDelete?.name}
                &quot;? This will remove all synchronization settings and cached
                data. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Directory
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}
