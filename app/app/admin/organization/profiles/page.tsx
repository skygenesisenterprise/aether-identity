"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import {
  Users,
  UserPlus,
  Search,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Folder,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Mail,
  Lock,
  Unlock,
  X,
  Building2,
  Key,
  Activity,
  History,
  Fingerprint,
  Layers,
  Info,
  Trash2,
  UserCog,
  RefreshCcw,
  BarChart3,
  ChevronRight,
  Filter,
  ShieldCheckIcon,
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/dashboard/ui/dialog";
import { Input } from "@/components/dashboard/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/dashboard/ui/select";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface OrganizationProfile {
  id: string;
  displayName: string;
  email: string;
  username: string;
  status: "active" | "suspended" | "pending";
  groups: string[];
  groupIds: string[];
  lastLogin?: string;
  mfaEnabled: boolean;
  mfaRequired: boolean;
  createdAt: string;
  primaryOrgUnit: string;
  roles: string[];
  avatarUrl?: string;
}

interface ProfileGroup {
  id: string;
  name: string;
  slug: string;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockGroups: ProfileGroup[] = [
  { id: "grp-001", name: "Engineering", slug: "engineering" },
  { id: "grp-002", name: "Platform Engineering", slug: "platform-engineering" },
  { id: "grp-003", name: "Backend Team", slug: "backend-team" },
  { id: "grp-004", name: "Frontend Team", slug: "frontend-team" },
  { id: "grp-005", name: "Security", slug: "security" },
  { id: "grp-006", name: "Security Operations", slug: "security-operations" },
  { id: "grp-007", name: "Product", slug: "product" },
  { id: "grp-008", name: "Finance", slug: "finance" },
];

const mockProfiles: OrganizationProfile[] = [
  {
    id: "prof-001",
    displayName: "John Smith",
    email: "john.smith@acme.com",
    username: "john.smith",
    status: "active",
    groups: ["Engineering", "Backend Team"],
    groupIds: ["grp-001", "grp-003"],
    lastLogin: "2024-01-15T09:30:00Z",
    mfaEnabled: true,
    mfaRequired: true,
    createdAt: "2023-06-01T00:00:00Z",
    primaryOrgUnit: "Engineering",
    roles: ["Developer", "Team Lead"],
  },
  {
    id: "prof-002",
    displayName: "Sarah Jones",
    email: "sarah.jones@acme.com",
    username: "sarah.jones",
    status: "active",
    groups: ["Security", "Security Operations"],
    groupIds: ["grp-005", "grp-006"],
    lastLogin: "2024-01-15T08:45:00Z",
    mfaEnabled: true,
    mfaRequired: true,
    createdAt: "2023-07-15T00:00:00Z",
    primaryOrgUnit: "Security",
    roles: ["Security Engineer", "Security Reviewer"],
  },
  {
    id: "prof-003",
    displayName: "Michael Chen",
    email: "michael.chen@acme.com",
    username: "michael.chen",
    status: "pending",
    groups: ["Engineering"],
    groupIds: ["grp-001"],
    lastLogin: undefined,
    mfaEnabled: false,
    mfaRequired: false,
    createdAt: "2024-01-10T00:00:00Z",
    primaryOrgUnit: "Engineering",
    roles: ["Developer"],
  },
  {
    id: "prof-004",
    displayName: "Emily Davis",
    email: "emily.davis@acme.com",
    username: "emily.davis",
    status: "suspended",
    groups: ["Finance"],
    groupIds: ["grp-008"],
    lastLogin: "2023-12-20T14:20:00Z",
    mfaEnabled: true,
    mfaRequired: true,
    createdAt: "2023-03-10T00:00:00Z",
    primaryOrgUnit: "Finance",
    roles: ["Analyst"],
  },
  {
    id: "prof-005",
    displayName: "David Wilson",
    email: "david.wilson@acme.com",
    username: "david.wilson",
    status: "active",
    groups: ["Product"],
    groupIds: ["grp-007"],
    lastLogin: "2024-01-14T16:30:00Z",
    mfaEnabled: false,
    mfaRequired: true,
    createdAt: "2023-05-20T00:00:00Z",
    primaryOrgUnit: "Product",
    roles: ["Product Manager"],
  },
  {
    id: "prof-006",
    displayName: "Lisa Brown",
    email: "lisa.brown@acme.com",
    username: "lisa.brown",
    status: "active",
    groups: ["Platform Engineering"],
    groupIds: ["grp-002"],
    lastLogin: "2024-01-15T10:15:00Z",
    mfaEnabled: true,
    mfaRequired: true,
    createdAt: "2023-08-01T00:00:00Z",
    primaryOrgUnit: "Platform Engineering",
    roles: ["DevOps Engineer"],
  },
  {
    id: "prof-007",
    displayName: "Robert Taylor",
    email: "robert.taylor@acme.com",
    username: "robert.taylor",
    status: "active",
    groups: ["Frontend Team"],
    groupIds: ["grp-004"],
    lastLogin: "2024-01-13T11:00:00Z",
    mfaEnabled: true,
    mfaRequired: true,
    createdAt: "2023-09-01T00:00:00Z",
    primaryOrgUnit: "Engineering",
    roles: ["Frontend Developer"],
  },
  {
    id: "prof-008",
    displayName: "Jennifer Martinez",
    email: "jennifer.martinez@acme.com",
    username: "jennifer.martinez",
    status: "pending",
    groups: [],
    groupIds: [],
    lastLogin: undefined,
    mfaEnabled: false,
    mfaRequired: false,
    createdAt: "2024-01-14T00:00:00Z",
    primaryOrgUnit: "Product",
    roles: ["UX Designer"],
  },
];

// ============================================================================
// CONFIGURATION & UTILITIES
// ============================================================================

const statusConfig = {
  active: {
    icon: CheckCircle2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    label: "Active",
    description: "Profile has full access to authorized resources",
  },
  pending: {
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    label: "Pending",
    description: "Profile activation pending",
  },
  suspended: {
    icon: AlertCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    label: "Suspended",
    description: "Temporarily disabled access",
  },
};

function formatRelativeTime(dateString: string | undefined): string {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toISOString().split("T")[0];
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ============================================================================
// BADGE COMPONENTS
// ============================================================================

function StatusBadge({
  status,
  showLabel = true,
}: {
  status: OrganizationProfile["status"];
  showLabel?: boolean;
}) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        config.bgColor,
        config.color,
        config.borderColor,
      )}
      title={config.description}
    >
      <Icon className="h-3.5 w-3.5" />
      {showLabel && config.label}
    </span>
  );
}

function MfaBadge({
  enabled,
  required,
}: {
  enabled: boolean;
  required: boolean;
}) {
  if (enabled) {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200"
        title="Multi-factor authentication is enabled"
      >
        <ShieldCheck className="h-3 w-3" />
        Enabled
      </span>
    );
  }
  if (required) {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200"
        title="MFA is required but not yet configured"
      >
        <ShieldAlert className="h-3 w-3" />
        Required
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200"
      title="Multi-factor authentication is disabled"
    >
      <Shield className="h-3 w-3" />
      Disabled
    </span>
  );
}

function GroupBadges({ groups }: { groups: string[] }) {
  if (groups.length === 0) {
    return (
      <span className="text-xs text-muted-foreground italic">No groups</span>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-1">
      {groups.slice(0, 2).map((group) => (
        <span
          key={group}
          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground border border-border/50"
        >
          {group}
        </span>
      ))}
      {groups.length > 2 && (
        <span
          className="text-xs text-muted-foreground"
          title={`${groups.length - 2} more groups`}
        >
          +{groups.length - 2}
        </span>
      )}
    </div>
  );
}

// ============================================================================
// KPI CARD COMPONENT
// ============================================================================

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
}: KpiCardProps) {
  const variantStyles = {
    default: {
      iconBg: "bg-muted",
      iconColor: "text-muted-foreground",
      valueColor: "text-foreground",
    },
    success: {
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-600",
    },
    warning: {
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      valueColor: "text-amber-600",
    },
    danger: {
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      valueColor: "text-red-600",
    },
    info: {
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      valueColor: "text-blue-600",
    },
  };

  const styles = variantStyles[variant];

  return (
    <Card className="border-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {title}
            </p>
            <p className={cn("text-2xl font-bold", styles.valueColor)}>
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={cn("rounded-lg p-2", styles.iconBg)}>
            <Icon className={cn("h-4 w-4", styles.iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SECTION HEADER COMPONENT
// ============================================================================

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: React.ElementType;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ElementType;
  };
}

function SectionHeader({
  title,
  description,
  icon: Icon,
  action,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {action.icon && <action.icon className="h-3.5 w-3.5" />}
          {action.label}
        </button>
      )}
    </div>
  );
}

// ============================================================================
// PROFILE LIST ITEM COMPONENT
// ============================================================================

function ProfileListItem({
  profile,
  isSelected,
  onSelect,
}: {
  profile: OrganizationProfile;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const initials = profile.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border",
        isSelected
          ? "bg-primary/10 border-primary/30"
          : "bg-card hover:bg-muted/50 border-transparent",
      )}
      onClick={onSelect}
    >
      <div
        className={cn(
          "h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
          isSelected
            ? "bg-primary/20 text-primary"
            : "bg-muted text-muted-foreground",
        )}
      >
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm truncate">{profile.displayName}</p>
          <StatusBadge status={profile.status} showLabel={false} />
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground truncate">
            {profile.email}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <MfaBadge
            enabled={profile.mfaEnabled}
            required={profile.mfaRequired}
          />
          <span className="text-xs text-muted-foreground">
            {profile.groups.length} groups
          </span>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
    </div>
  );
}

// ============================================================================
// PROFILE LIST COMPONENT
// ============================================================================

function ProfileList({
  profiles,
  selectedProfileId,
  onSelectProfile,
  searchQuery,
  statusFilter,
}: {
  profiles: OrganizationProfile[];
  selectedProfileId: string | null;
  onSelectProfile: (profile: OrganizationProfile) => void;
  searchQuery: string;
  statusFilter: OrganizationProfile["status"] | "all";
}) {
  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <Search className="h-6 w-6 text-muted-foreground/50" />
        </div>
        <p className="text-sm font-medium text-foreground">No profiles found</p>
        <p className="text-xs text-muted-foreground mt-1">
          {searchQuery || statusFilter !== "all"
            ? "Try adjusting your search or filters"
            : "Create your first profile to get started"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {profiles.map((profile) => (
        <ProfileListItem
          key={profile.id}
          profile={profile}
          isSelected={selectedProfileId === profile.id}
          onSelect={() => onSelectProfile(profile)}
        />
      ))}
    </div>
  );
}

// ============================================================================
// PROFILE DETAIL PANEL COMPONENT
// ============================================================================

function ProfileDetailPanel({
  profile,
  allGroups,
  onClose,
}: {
  profile: OrganizationProfile | null;
  allGroups: ProfileGroup[];
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "access" | "security" | "audit"
  >("overview");

  if (!profile) {
    return (
      <Card className="h-full flex flex-col">
        <CardContent className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Users className="h-8 w-8 opacity-50" />
          </div>
          <p className="text-sm font-medium">
            Select a profile to view details
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Click on any profile to see its information
          </p>
        </CardContent>
      </Card>
    );
  }

  const profileGroups = allGroups.filter((g) =>
    profile.groupIds.includes(g.id),
  );
  const statusConf = statusConfig[profile.status];
  const initials = profile.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between px-5 py-5 border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-bold text-primary border border-primary/20">
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {profile.displayName}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {profile.email}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-muted rounded-md transition-colors"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Status Bar */}
      <div className="px-5 py-3 border-b space-y-2">
        <div className="flex items-center justify-between">
          <StatusBadge status={profile.status} />
          <span className="text-xs text-muted-foreground font-mono">
            {profile.id}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {statusConf.description}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="px-5 py-3 border-b bg-muted/20">
        <div className="grid grid-cols-2 gap-2">
          {profile.status === "active" && (
            <>
              <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
                <UserCog className="h-4 w-4" />
                Edit
              </button>
              <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
                <Lock className="h-4 w-4" />
                Suspend
              </button>
            </>
          )}
          {profile.status === "pending" && (
            <>
              <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <Mail className="h-4 w-4" />
                Activate
              </button>
              <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
                <X className="h-4 w-4" />
                Cancel
              </button>
            </>
          )}
          {profile.status === "suspended" && (
            <>
              <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <Unlock className="h-4 w-4" />
                Reactivate
              </button>
              <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {[
          { id: "overview", label: "Overview", icon: Info },
          { id: "access", label: "Access", icon: Layers },
          { id: "security", label: "Security", icon: Shield },
          { id: "audit", label: "Audit", icon: History },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1 px-2 py-2.5 text-xs font-medium border-b-2 transition-colors",
              activeTab === tab.id
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50",
            )}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Identity Section */}
            <section>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <Fingerprint className="h-3.5 w-3.5" />
                Identity Information
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Display Name</span>
                  <span className="font-medium">{profile.displayName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Email</span>
                  <span className="text-xs">{profile.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Username</span>
                  <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                    {profile.username}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={profile.status} />
                </div>
              </div>
            </section>

            {/* Timestamps Section */}
            <section className="pt-4 border-t">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" />
                Timestamps
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Created At</span>
                  <span>{formatDate(profile.createdAt)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Last Login</span>
                  <span
                    className={cn(
                      !profile.lastLogin && "text-muted-foreground",
                    )}
                  >
                    {profile.lastLogin
                      ? formatRelativeTime(profile.lastLogin)
                      : "Never"}
                  </span>
                </div>
              </div>
            </section>

            {/* Organization Section */}
            <section className="pt-4 border-t">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5" />
                Organization
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Primary Unit</span>
                  <span>{profile.primaryOrgUnit}</span>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === "access" && (
          <div className="space-y-6">
            {/* Groups Section */}
            <section>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <Folder className="h-3.5 w-3.5" />
                Group Memberships ({profileGroups.length})
              </h4>
              {profileGroups.length > 0 ? (
                <div className="space-y-2">
                  {profileGroups.map((group) => (
                    <div
                      key={group.id}
                      className="flex items-center gap-3 p-2 rounded-lg border bg-card"
                    >
                      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                        <Folder className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{group.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {group.slug}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Not member of any groups
                </p>
              )}
            </section>

            {/* Roles Section */}
            <section className="pt-4 border-t">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <Layers className="h-3.5 w-3.5" />
                Assigned Roles ({profile.roles.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.roles.map((role) => (
                  <span
                    key={role}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-foreground border border-border"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </section>

            {/* Effective Permissions Placeholder */}
            <section className="pt-4 border-t">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <Key className="h-3.5 w-3.5" />
                Effective Permissions
              </h4>
              <div className="p-3 rounded-lg border bg-muted/30">
                <p className="text-xs text-muted-foreground">
                  Effective permissions will be calculated based on group
                  memberships and role assignments (RBAC).
                </p>
              </div>
            </section>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            {/* MFA Section */}
            <section>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <Key className="h-3.5 w-3.5" />
                Multi-Factor Authentication
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg border bg-card">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">MFA Status</span>
                  </div>
                  <MfaBadge
                    enabled={profile.mfaEnabled}
                    required={profile.mfaRequired}
                  />
                </div>
                {profile.mfaEnabled && (
                  <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50 rounded-lg transition-colors border border-amber-200">
                    <RefreshCcw className="h-4 w-4" />
                    Reset MFA
                  </button>
                )}
              </div>
            </section>

            {/* Sessions Placeholder */}
            <section className="pt-4 border-t">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <Activity className="h-3.5 w-3.5" />
                Active Sessions
              </h4>
              <div className="p-3 rounded-lg border bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  Session management will be integrated here.
                </p>
              </div>
            </section>

            {/* API Tokens Placeholder */}
            <section className="pt-4 border-t">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <Key className="h-3.5 w-3.5" />
                API Tokens
              </h4>
              <div className="p-3 rounded-lg border bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  API token management will be available here.
                </p>
              </div>
            </section>
          </div>
        )}

        {activeTab === "audit" && (
          <div className="space-y-4">
            <section>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <History className="h-3.5 w-3.5" />
                Recent Activity
              </h4>
              <div className="p-3 rounded-lg border bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  Audit log integration pending. Activity tracking will be
                  displayed here.
                </p>
              </div>
            </section>

            <div className="pt-4 border-t">
              <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors border border-dashed">
                <History className="h-4 w-4" />
                View Full Audit Log
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="p-5 border-t bg-muted/20">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-destructive mb-3">
          Danger Zone
        </h4>
        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-destructive/20">
          <Trash2 className="h-4 w-4" />
          Delete Profile
        </button>
      </div>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function ProfilesPage() {
  const [selectedProfile, setSelectedProfile] =
    useState<OrganizationProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    OrganizationProfile["status"] | "all"
  >("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newProfile, setNewProfile] = useState({
    displayName: "",
    email: "",
    primaryOrgUnit: "",
  });

  const stats = useMemo(() => {
    const total = mockProfiles.length;
    const active = mockProfiles.filter((p) => p.status === "active").length;
    const suspended = mockProfiles.filter(
      (p) => p.status === "suspended",
    ).length;
    const pending = mockProfiles.filter((p) => p.status === "pending").length;
    const mfaEnabled = mockProfiles.filter((p) => p.mfaEnabled).length;
    const mfaRequired = mockProfiles.filter(
      (p) => p.mfaRequired && !p.mfaEnabled,
    ).length;

    return {
      total,
      active,
      suspended,
      pending,
      mfaEnabled,
      mfaRequired,
    };
  }, []);

  // Filtered profiles for display
  const filteredProfiles = useMemo(() => {
    return mockProfiles.filter((profile) => {
      const matchesSearch =
        searchQuery === "" ||
        profile.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.username.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || profile.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const handleCreateProfile = async () => {
    setIsCreating(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsCreating(false);
    setIsCreateDialogOpen(false);
    setNewProfile({
      displayName: "",
      email: "",
      primaryOrgUnit: "",
    });
  };

  return (
    <div className="space-y-8">
      {/* ==========================================================================
          HEADER SECTION
          ========================================================================== */}
      <section className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Identity Organization Profiles
              </h1>
              <Badge variant="secondary" className="text-xs">
                {stats.total} total
              </Badge>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Manage identities and access across your organization. View
              profile details, group memberships, security settings, and audit
              activity.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Profile</DialogTitle>
                  <DialogDescription>
                    Create a new organization profile to manage identity and
                    access.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label
                      htmlFor="displayName"
                      className="text-sm font-medium leading-none"
                    >
                      Display Name
                    </label>
                    <Input
                      id="displayName"
                      placeholder="e.g., John Smith"
                      value={newProfile.displayName}
                      onChange={(e) =>
                        setNewProfile((prev) => ({
                          ...prev,
                          displayName: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium leading-none"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="e.g., john.smith@acme.com"
                      value={newProfile.email}
                      onChange={(e) =>
                        setNewProfile((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <label
                      htmlFor="orgUnit"
                      className="text-sm font-medium leading-none"
                    >
                      Organization Unit
                    </label>
                    <Input
                      id="orgUnit"
                      placeholder="e.g., Engineering"
                      value={newProfile.primaryOrgUnit}
                      onChange={(e) =>
                        setNewProfile((prev) => ({
                          ...prev,
                          primaryOrgUnit: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    disabled={isCreating}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateProfile}
                    disabled={
                      !newProfile.displayName || !newProfile.email || isCreating
                    }
                  >
                    {isCreating ? "Creating..." : "Create Profile"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          KPI SECTION
          ========================================================================== */}
      <section className="space-y-4">
        <SectionHeader
          title="Overview"
          description="Key metrics and profile distribution"
          icon={BarChart3}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Total Profiles"
            value={stats.total}
            subtitle="Across organization"
            icon={Users}
            variant="default"
          />
          <KpiCard
            title="Active"
            value={stats.active}
            subtitle="Currently enabled"
            icon={CheckCircle2}
            variant="success"
          />
          <KpiCard
            title="Pending"
            value={stats.pending}
            subtitle="Awaiting activation"
            icon={Clock}
            variant="warning"
          />
          <KpiCard
            title="Suspended"
            value={stats.suspended}
            subtitle="Temporarily disabled"
            icon={XCircle}
            variant="danger"
          />
        </div>
      </section>

      {/* ==========================================================================
          SECURITY METRICS SECTION
          ========================================================================== */}
      <section className="space-y-4">
        <SectionHeader
          title="Security Overview"
          description="MFA adoption and security posture"
          icon={ShieldCheckIcon}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <KpiCard
            title="MFA Enabled"
            value={stats.mfaEnabled}
            subtitle={`${Math.round((stats.mfaEnabled / stats.total) * 100)}% of profiles`}
            icon={ShieldCheck}
            variant="success"
          />
          <KpiCard
            title="MFA Required"
            value={stats.mfaRequired}
            subtitle="Pending configuration"
            icon={ShieldAlert}
            variant={stats.mfaRequired > 0 ? "warning" : "default"}
          />
          <KpiCard
            title="Security Score"
            value="92"
            subtitle="Based on MFA adoption"
            icon={Shield}
            variant="success"
          />
        </div>
      </section>

      {/* ==========================================================================
          PROFILE DIRECTORY SECTION - Enhanced UX
          ========================================================================== */}
      <section className="space-y-6">
        {/* Header avec actions */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Profile Directory
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Browse and manage organization profiles
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {filteredProfiles.length} of {mockProfiles.length} profiles
            </span>
          </div>
        </div>

        {/* Filtres visuels par statut */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground mr-2">
            Filter by status:
          </span>
          <button
            onClick={() => setStatusFilter("all")}
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
              statusFilter === "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card hover:bg-muted/50 border-border text-muted-foreground",
            )}
          >
            <Users className="h-3 w-3" />
            All
            <span
              className={cn(
                "ml-1 px-1.5 py-0.5 rounded-full text-[10px]",
                statusFilter === "all"
                  ? "bg-primary-foreground/20"
                  : "bg-muted",
              )}
            >
              {mockProfiles.length}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter("active")}
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
              statusFilter === "active"
                ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                : "bg-card hover:bg-muted/50 border-border text-muted-foreground",
            )}
          >
            <CheckCircle2 className="h-3 w-3" />
            Active
            <span
              className={cn(
                "ml-1 px-1.5 py-0.5 rounded-full text-[10px]",
                statusFilter === "active" ? "bg-emerald-200" : "bg-muted",
              )}
            >
              {mockProfiles.filter((p) => p.status === "active").length}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter("pending")}
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
              statusFilter === "pending"
                ? "bg-amber-100 text-amber-700 border-amber-300"
                : "bg-card hover:bg-muted/50 border-border text-muted-foreground",
            )}
          >
            <Clock className="h-3 w-3" />
            Pending
            <span
              className={cn(
                "ml-1 px-1.5 py-0.5 rounded-full text-[10px]",
                statusFilter === "pending" ? "bg-amber-200" : "bg-muted",
              )}
            >
              {mockProfiles.filter((p) => p.status === "pending").length}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter("suspended")}
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
              statusFilter === "suspended"
                ? "bg-red-100 text-red-700 border-red-300"
                : "bg-card hover:bg-muted/50 border-border text-muted-foreground",
            )}
          >
            <AlertCircle className="h-3 w-3" />
            Suspended
            <span
              className={cn(
                "ml-1 px-1.5 py-0.5 rounded-full text-[10px]",
                statusFilter === "suspended" ? "bg-red-200" : "bg-muted",
              )}
            >
              {mockProfiles.filter((p) => p.status === "suspended").length}
            </span>
          </button>
        </div>

        {/* Barre de recherche et actions */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
          </div>

          {(searchQuery || statusFilter !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCcw className="h-3 w-3" />
              Clear filters
            </button>
          )}
        </div>

        {/* Résultats filtrés indicator */}
        {(searchQuery || statusFilter !== "all") && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Showing {filteredProfiles.length} profile
              {filteredProfiles.length !== 1 ? "s" : ""}
              {searchQuery && ` matching "${searchQuery}"`}
              {statusFilter !== "all" && ` with status "${statusFilter}"`}
            </span>
          </div>
        )}
      </section>

      {/* ==========================================================================
          MAIN CONTENT SECTION - Two Column Layout
          ========================================================================== */}
      <section className="pb-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Profile List - Left Column */}
          <div className="xl:col-span-1">
            <Card className="border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">
                    Profiles
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">
                    {filteredProfiles.length} shown
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ProfileList
                  profiles={filteredProfiles}
                  selectedProfileId={selectedProfile?.id || null}
                  onSelectProfile={setSelectedProfile}
                  searchQuery={searchQuery}
                  statusFilter={statusFilter}
                />
              </CardContent>
            </Card>
          </div>

          {/* Detail Panel - Right Column */}
          <div className="xl:col-span-3">
            <ProfileDetailPanel
              profile={selectedProfile}
              allGroups={mockGroups}
              onClose={() => setSelectedProfile(null)}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
