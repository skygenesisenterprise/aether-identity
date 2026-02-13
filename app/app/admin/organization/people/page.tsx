"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import {
  Users,
  UserPlus,
  Mail,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  Download,
  Upload,
  MoreHorizontal,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Lock,
  Unlock,
  RefreshCw,
  Trash2,
  X,
  RefreshCcw,
  UserCog,
  TrendingUp,
  TrendingDown,
  Activity,
  Key,
  Fingerprint,
  Layers,
  ChevronDown,
  ChevronUp,
  Info,
  FileText,
  History,
  UserCheck,
  UserMinus,
  ShieldCheckIcon,
  Sparkles,
  BarChart3,
  Settings,
  ChevronRight,
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

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  status: "active" | "invited" | "suspended" | "archived";
  primaryOrgUnit: string;
  roles: string[];
  mfaEnabled: boolean;
  mfaRequired: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  environmentScope: string[];
  externalIdentity?: {
    provider: string;
    externalId: string;
  };
  lastActivity?: {
    action: string;
    timestamp: string;
    details: string;
  };
}

interface SecurityMetrics {
  mfaAdoption: number;
  passwordCompliance: number;
  activeSessions: number;
  riskScore: number;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockUsers: User[] = [
  {
    id: "usr-001",
    email: "john.smith@acme.com",
    username: "john.smith",
    displayName: "John Smith",
    status: "active",
    primaryOrgUnit: "Engineering",
    roles: ["Developer", "Team Lead"],
    mfaEnabled: true,
    mfaRequired: true,
    lastLoginAt: "2024-01-15T09:30:00Z",
    createdAt: "2023-06-01T00:00:00Z",
    environmentScope: ["production", "staging", "development"],
    externalIdentity: { provider: "Azure AD", externalId: "ext-12345" },
    lastActivity: {
      action: "Deployed service",
      timestamp: "2024-01-15T09:30:00Z",
      details: "Production deployment",
    },
  },
  {
    id: "usr-002",
    email: "sarah.jones@acme.com",
    username: "sarah.jones",
    displayName: "Sarah Jones",
    status: "active",
    primaryOrgUnit: "Platform Engineering",
    roles: ["Senior Developer", "Security Reviewer"],
    mfaEnabled: true,
    mfaRequired: true,
    lastLoginAt: "2024-01-15T08:45:00Z",
    createdAt: "2023-07-15T00:00:00Z",
    environmentScope: ["production", "staging"],
    externalIdentity: { provider: "Azure AD", externalId: "ext-12346" },
    lastActivity: {
      action: "Security review",
      timestamp: "2024-01-15T08:45:00Z",
      details: "Policy audit completed",
    },
  },
  {
    id: "usr-003",
    email: "michael.chen@acme.com",
    username: "michael.chen",
    displayName: "Michael Chen",
    status: "invited",
    primaryOrgUnit: "Backend Engineering",
    roles: ["Developer"],
    mfaEnabled: false,
    mfaRequired: false,
    lastLoginAt: null,
    createdAt: "2024-01-10T00:00:00Z",
    environmentScope: ["development"],
    lastActivity: {
      action: "Invitation sent",
      timestamp: "2024-01-10T00:00:00Z",
      details: "Pending acceptance",
    },
  },
  {
    id: "usr-004",
    email: "emily.davis@acme.com",
    username: "emily.davis",
    displayName: "Emily Davis",
    status: "suspended",
    primaryOrgUnit: "Finance",
    roles: ["Analyst"],
    mfaEnabled: true,
    mfaRequired: true,
    lastLoginAt: "2023-12-20T14:20:00Z",
    createdAt: "2023-03-10T00:00:00Z",
    environmentScope: ["production"],
    lastActivity: {
      action: "Account suspended",
      timestamp: "2023-12-20T14:20:00Z",
      details: "Security policy violation",
    },
  },
  {
    id: "usr-005",
    email: "david.wilson@acme.com",
    username: "david.wilson",
    displayName: "David Wilson",
    status: "active",
    primaryOrgUnit: "Enterprise Sales",
    roles: ["Sales Manager"],
    mfaEnabled: false,
    mfaRequired: true,
    lastLoginAt: "2024-01-14T16:30:00Z",
    createdAt: "2023-05-20T00:00:00Z",
    environmentScope: ["production", "staging"],
    lastActivity: {
      action: "Client meeting",
      timestamp: "2024-01-14T16:30:00Z",
      details: "Quarterly review",
    },
  },
  {
    id: "usr-006",
    email: "lisa.brown@acme.com",
    username: "lisa.brown",
    displayName: "Lisa Brown",
    status: "active",
    primaryOrgUnit: "Human Resources",
    roles: ["HR Specialist"],
    mfaEnabled: true,
    mfaRequired: true,
    lastLoginAt: "2024-01-15T10:15:00Z",
    createdAt: "2023-08-01T00:00:00Z",
    environmentScope: ["production"],
    externalIdentity: { provider: "Workday", externalId: "hr-789" },
    lastActivity: {
      action: "Updated profile",
      timestamp: "2024-01-15T10:15:00Z",
      details: "Contact information",
    },
  },
  {
    id: "usr-007",
    email: "robert.taylor@acme.com",
    username: "robert.taylor",
    displayName: "Robert Taylor",
    status: "archived",
    primaryOrgUnit: "Engineering",
    roles: ["Developer"],
    mfaEnabled: true,
    mfaRequired: true,
    lastLoginAt: "2023-09-15T11:00:00Z",
    createdAt: "2022-11-01T00:00:00Z",
    environmentScope: [],
    lastActivity: {
      action: "Account archived",
      timestamp: "2023-09-15T11:00:00Z",
      details: "Offboarding complete",
    },
  },
];

const securityMetrics: SecurityMetrics = {
  mfaAdoption: 71,
  passwordCompliance: 100,
  activeSessions: 24,
  riskScore: 12,
};

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
    description: "User has full access to authorized resources",
  },
  invited: {
    icon: Mail,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    label: "Invited",
    description: "Pending invitation acceptance",
  },
  suspended: {
    icon: AlertCircle,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    label: "Suspended",
    description: "Temporarily disabled access",
  },
  archived: {
    icon: XCircle,
    color: "text-slate-500",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    label: "Archived",
    description: "Permanently deactivated account",
  },
};

function formatRelativeTime(dateString: string | null): string {
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

// ============================================================================
// BADGE COMPONENTS
// ============================================================================

function StatusBadge({
  status,
  showLabel = true,
}: {
  status: User["status"];
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
        Active
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
      title="Multi-factor authentication is optional"
    >
      <Shield className="h-3 w-3" />
      Optional
    </span>
  );
}

function EnvironmentBadges({ environments }: { environments: string[] }) {
  if (environments.length === 0) {
    return (
      <span className="text-xs text-muted-foreground italic">No access</span>
    );
  }
  return (
    <div className="flex flex-wrap gap-1">
      {environments.slice(0, 3).map((env) => (
        <span
          key={env}
          className={cn(
            "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide",
            env === "production"
              ? "bg-red-100 text-red-700 border border-red-200"
              : env === "staging"
                ? "bg-amber-100 text-amber-700 border border-amber-200"
                : "bg-blue-100 text-blue-700 border border-blue-200",
          )}
          title={`Access to ${env} environment`}
        >
          {env}
        </span>
      ))}
      {environments.length > 3 && (
        <span
          className="text-xs text-muted-foreground"
          title={`${environments.length - 3} more environments`}
        >
          +{environments.length - 3}
        </span>
      )}
    </div>
  );
}

function RoleBadges({ roles }: { roles: string[] }) {
  const displayRoles = roles.slice(0, 2);
  const remainingCount = roles.length - 2;

  return (
    <div className="flex flex-wrap items-center gap-1">
      {displayRoles.map((role) => (
        <span
          key={role}
          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground border border-border/50"
          title={`Role: ${role}`}
        >
          {role}
        </span>
      ))}
      {remainingCount > 0 && (
        <span
          className="text-xs text-muted-foreground"
          title={`${remainingCount} more roles`}
        >
          +{remainingCount}
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
  trend?: {
    value: string | number;
    isPositive: boolean;
    label: string;
  };
  variant?: "default" | "success" | "warning" | "danger" | "info";
  badge?: {
    label: string;
    variant: "default" | "success" | "warning" | "danger";
  };
  tooltip?: string;
}

function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  badge,
  tooltip,
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
  const TrendIcon = trend?.isPositive ? TrendingUp : TrendingDown;

  return (
    <Card
      className="border-border bg-card hover:shadow-md transition-shadow duration-200"
      title={tooltip}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {title}
              </p>
              {badge && (
                <Badge
                  variant={
                    badge.variant === "success"
                      ? "default"
                      : badge.variant === "warning"
                        ? "secondary"
                        : "destructive"
                  }
                  className="text-[10px] px-1.5 py-0"
                >
                  {badge.label}
                </Badge>
              )}
            </div>
            <p
              className={cn(
                "text-3xl font-bold tabular-nums",
                styles.valueColor,
              )}
            >
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1">
                <TrendIcon
                  className={cn(
                    "h-3 w-3",
                    trend.isPositive ? "text-emerald-600" : "text-red-600",
                  )}
                />
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.isPositive ? "text-emerald-600" : "text-red-600",
                  )}
                >
                  {trend.isPositive ? "+" : "-"}
                  {trend.value}%
                </span>
                <span className="text-xs text-muted-foreground">
                  {trend.label}
                </span>
              </div>
            )}
          </div>
          <div className={cn("rounded-lg p-2.5", styles.iconBg)}>
            <Icon className={cn("h-5 w-5", styles.iconColor)} />
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
// ALERT COMPONENT
// ============================================================================

interface AlertBannerProps {
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

function AlertBanner({ type, title, message, action }: AlertBannerProps) {
  const config = {
    info: {
      icon: Info,
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-900",
      subtext: "text-blue-700",
      iconColor: "text-blue-600",
    },
    warning: {
      icon: AlertTriangle,
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-900",
      subtext: "text-amber-700",
      iconColor: "text-amber-600",
    },
    error: {
      icon: XCircle,
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-900",
      subtext: "text-red-700",
      iconColor: "text-red-600",
    },
    success: {
      icon: CheckCircle2,
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-900",
      subtext: "text-emerald-700",
      iconColor: "text-emerald-600",
    },
  };

  const { icon: Icon, bg, border, text, subtext, iconColor } = config[type];

  return (
    <div
      className={cn("flex items-start gap-3 p-4 rounded-lg border", bg, border)}
    >
      <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", iconColor)} />
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium", text)}>{title}</p>
        <p className={cn("text-sm mt-1", subtext)}>{message}</p>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className={cn(
            "text-sm font-medium px-3 py-1.5 rounded-md transition-colors",
            "bg-white hover:bg-opacity-90 border",
            border,
            text,
          )}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// ============================================================================
// USER TABLE COMPONENT
// ============================================================================

interface UserTableProps {
  users: User[];
  selectedUser: User | null;
  onSelectUser: (user: User | null) => void;
  selectedUsers: Set<string>;
  onToggleSelectUser: (userId: string) => void;
  onToggleSelectAll: () => void;
}

function UserTable({
  users,
  selectedUser,
  onSelectUser,
  selectedUsers,
  onToggleSelectUser,
  onToggleSelectAll,
}: UserTableProps) {
  const allSelected = users.length > 0 && selectedUsers.size === users.length;
  const someSelected =
    selectedUsers.size > 0 && selectedUsers.size < users.length;

  return (
    <Card className="border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="border-b">
              <th className="px-4 py-3 text-left w-10">
                <input
                  type="checkbox"
                  className="rounded border-input"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={onToggleSelectAll}
                />
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                User
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Organization
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Roles
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Security
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Last Login
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Access
              </th>
              <th className="px-4 py-3 text-right w-10">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr
                key={user.id}
                className={cn(
                  "transition-colors cursor-pointer hover:bg-muted/50",
                  selectedUser?.id === user.id && "bg-muted",
                )}
                onClick={() => onSelectUser(user)}
              >
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="rounded border-input"
                    checked={selectedUsers.has(user.id)}
                    onChange={() => onToggleSelectUser(user.id)}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-xs font-semibold text-muted-foreground border border-border">
                      {user.displayName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {user.displayName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={user.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm">{user.primaryOrgUnit}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <RoleBadges roles={user.roles} />
                </td>
                <td className="px-4 py-3">
                  <MfaBadge
                    enabled={user.mfaEnabled}
                    required={user.mfaRequired}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-sm">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span
                      className={cn(
                        !user.lastLoginAt && "text-muted-foreground italic",
                      )}
                    >
                      {formatRelativeTime(user.lastLoginAt)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <EnvironmentBadges environments={user.environmentScope} />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 hover:bg-muted rounded-md transition-colors"
                    title="More actions"
                  >
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">
            No users found
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Try adjusting your filters or search query to find what you&apos;re
            looking for.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/30">
        <div className="text-sm text-muted-foreground">
          {selectedUsers.size > 0 ? (
            <span className="font-medium text-foreground">
              {selectedUsers.size} selected
            </span>
          ) : (
            <span>
              Showing {users.length} of {mockUsers.length} users
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm font-medium border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>
          <button className="px-3 py-1.5 text-sm font-medium border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      </div>
    </Card>
  );
}

// ============================================================================
// USER DETAIL PANEL COMPONENT
// ============================================================================

interface UserDetailPanelProps {
  user: User | null;
  onClose: () => void;
}

function UserDetailPanel({ user, onClose }: UserDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "security" | "activity"
  >("overview");

  if (!user) {
    return (
      <Card className="h-full flex flex-col">
        <CardContent className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Users className="h-8 w-8 opacity-50" />
          </div>
          <p className="text-sm font-medium">Select a user to view details</p>
          <p className="text-xs text-muted-foreground mt-1">
            Click on any user row to see their profile
          </p>
        </CardContent>
      </Card>
    );
  }

  const statusConf = statusConfig[user.status];

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between px-5 py-5 border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-bold text-primary border border-primary/20">
            {user.displayName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {user.displayName}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
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
          <StatusBadge status={user.status} />
          <span className="text-xs text-muted-foreground font-mono">
            {user.id}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {statusConf.description}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="px-5 py-3 border-b bg-muted/20">
        <div className="grid grid-cols-2 gap-2">
          {user.status === "active" && (
            <>
              <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
                <Lock className="h-4 w-4" />
                Suspend
              </button>
              <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
                <UserCog className="h-4 w-4" />
                Edit
              </button>
            </>
          )}
          {user.status === "invited" && (
            <>
              <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
                <RefreshCcw className="h-4 w-4" />
                Resend
              </button>
              <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
                <X className="h-4 w-4" />
                Revoke
              </button>
            </>
          )}
          {user.status === "suspended" && (
            <>
              <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
                <Unlock className="h-4 w-4" />
                Reactivate
              </button>
              <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
                <Trash2 className="h-4 w-4" />
                Archive
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {[
          { id: "overview", label: "Overview", icon: FileText },
          { id: "security", label: "Security", icon: Shield },
          { id: "activity", label: "Activity", icon: Activity },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors",
              activeTab === tab.id
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50",
            )}
          >
            <tab.icon className="h-4 w-4" />
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
                Identity
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Username</span>
                  <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                    {user.username}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Email</span>
                  <span className="text-xs">{user.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Created</span>
                  <span className="text-xs">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {user.externalIdentity && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">External ID</span>
                    <span className="font-mono text-xs">
                      {user.externalIdentity.provider}:{" "}
                      {user.externalIdentity.externalId}
                    </span>
                  </div>
                )}
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
                  <span>{user.primaryOrgUnit}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">Environments</span>
                  <EnvironmentBadges environments={user.environmentScope} />
                </div>
              </div>
            </section>

            {/* Roles Section */}
            <section className="pt-4 border-t">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <Layers className="h-3.5 w-3.5" />
                Access & Roles ({user.roles.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {user.roles.map((role) => (
                  <span
                    key={role}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-foreground border border-border"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            <section>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <Key className="h-3.5 w-3.5" />
                Authentication
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg border bg-card">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">MFA Status</span>
                  </div>
                  <MfaBadge
                    enabled={user.mfaEnabled}
                    required={user.mfaRequired}
                  />
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg border bg-card">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Last Login</span>
                  </div>
                  <span className="text-sm">
                    {user.lastLoginAt
                      ? formatRelativeTime(user.lastLoginAt)
                      : "Never"}
                  </span>
                </div>
              </div>
              {user.mfaEnabled && (
                <button className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50 rounded-lg transition-colors border border-amber-200">
                  <RefreshCw className="h-4 w-4" />
                  Reset MFA
                </button>
              )}
            </section>

            <section className="pt-4 border-t">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <Activity className="h-3.5 w-3.5" />
                Session Information
              </h4>
              <div className="p-3 rounded-lg border bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  Session data available in detailed logs
                </p>
              </div>
            </section>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-4">
            <section>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <History className="h-3.5 w-3.5" />
                Recent Activity
              </h4>
              {user.lastActivity ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <Activity className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        {user.lastActivity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.lastActivity.details}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatRelativeTime(user.lastActivity.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No recent activity recorded
                </p>
              )}
            </section>

            <div className="pt-4 border-t">
              <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors border border-dashed">
                <History className="h-4 w-4" />
                View Full History
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
          {user.status === "archived" ? "Permanently Delete" : "Archive User"}
        </button>
      </div>
    </Card>
  );
}

// ============================================================================
// SECURITY DASHBOARD COMPONENT
// ============================================================================

function SecurityDashboard() {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Security Overview
        </CardTitle>
        <CardDescription>
          Identity security metrics and compliance status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* MFA Adoption */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">MFA Adoption</span>
            <span className="font-medium">{securityMetrics.mfaAdoption}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                securityMetrics.mfaAdoption >= 80
                  ? "bg-emerald-500"
                  : securityMetrics.mfaAdoption >= 50
                    ? "bg-amber-500"
                    : "bg-red-500",
              )}
              style={{ width: `${securityMetrics.mfaAdoption}%` }}
            />
          </div>
        </div>

        {/* Password Compliance */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Password Policy</span>
            <span className="font-medium">
              {securityMetrics.passwordCompliance}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${securityMetrics.passwordCompliance}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3 rounded-lg bg-muted/50 border">
            <p className="text-2xl font-bold">
              {securityMetrics.activeSessions}
            </p>
            <p className="text-xs text-muted-foreground">Active Sessions</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 border">
            <p
              className={cn(
                "text-2xl font-bold",
                securityMetrics.riskScore > 50
                  ? "text-red-600"
                  : "text-emerald-600",
              )}
            >
              {securityMetrics.riskScore}
            </p>
            <p className="text-xs text-muted-foreground">Risk Score</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function PeoplePage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<User["status"] | "all">(
    "all",
  );
  const [orgUnitFilter, setOrgUnitFilter] = useState<string>("all");
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Derived state
  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      const matchesSearch =
        searchQuery === "" ||
        user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;
      const matchesOrgUnit =
        orgUnitFilter === "all" || user.primaryOrgUnit === orgUnitFilter;

      return matchesSearch && matchesStatus && matchesOrgUnit;
    });
  }, [searchQuery, statusFilter, orgUnitFilter]);

  const stats = useMemo(() => {
    const active = mockUsers.filter((u) => u.status === "active").length;
    const invited = mockUsers.filter((u) => u.status === "invited").length;
    const suspended = mockUsers.filter((u) => u.status === "suspended").length;
    const archived = mockUsers.filter((u) => u.status === "archived").length;
    const total = mockUsers.length;

    return {
      total,
      active,
      invited,
      suspended,
      archived,
      mfaEnabled: mockUsers.filter((u) => u.mfaEnabled).length,
      mfaRequired: mockUsers.filter((u) => u.mfaRequired && !u.mfaEnabled)
        .length,
    };
  }, []);

  // Handlers
  const handleToggleSelectUser = (userId: string) => {
    setSelectedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map((u) => u.id)));
    }
  };

  const orgUnits = useMemo(() => {
    const units = new Set(mockUsers.map((u) => u.primaryOrgUnit));
    return Array.from(units).sort();
  }, []);

  return (
    <div className="space-y-8">
      {/* ==========================================================================
          HEADER SECTION
          Structure claire avec titre, sous-titre et statut global
          ========================================================================== */}
      <section className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Identity Organization People
              </h1>
              <Badge variant="secondary" className="text-xs">
                {stats.total} total
              </Badge>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Manage human identities, access permissions, and security
              policies. Monitor user activity, enforce MFA requirements, and
              maintain compliance across your organization.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
              <Upload className="h-4 w-4" />
              Import
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
              <UserPlus className="h-4 w-4" />
              Invite User
            </button>
          </div>
        </div>

        {/* Alert Banner for pending actions */}
        {stats.mfaRequired > 0 && (
          <AlertBanner
            type="warning"
            title={`${stats.mfaRequired} users require MFA setup`}
            message="These users have not configured multi-factor authentication but it's required by your security policy."
            action={{
              label: "Review",
              onClick: () => setStatusFilter("active"),
            }}
          />
        )}
      </section>

      {/* ==========================================================================
          KPI SECTION - Vue d'ensemble segmentée
          ========================================================================== */}
      <section className="space-y-4">
        <SectionHeader
          title="Overview"
          description="Key metrics and user distribution"
          icon={BarChart3}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI Principaux */}
          <KpiCard
            title="Total Users"
            value={stats.total}
            subtitle="Across all units"
            icon={Users}
            trend={{ value: 12.5, isPositive: true, label: "vs last month" }}
            variant="default"
            tooltip="Total number of user accounts including all statuses"
          />
          <KpiCard
            title="Active Users"
            value={stats.active}
            subtitle="Currently enabled"
            icon={UserCheck}
            badge={{ label: "Healthy", variant: "success" }}
            variant="success"
            tooltip="Users with full access to authorized resources"
          />
          <KpiCard
            title="Pending Invites"
            value={stats.invited}
            subtitle="Awaiting acceptance"
            icon={Mail}
            variant="info"
            tooltip="Users who have been invited but haven't accepted yet"
          />
          <KpiCard
            title="Dormant Accounts"
            value={stats.suspended + stats.archived}
            subtitle="Inactive or archived"
            icon={UserMinus}
            variant="warning"
            tooltip="Suspended and archived accounts requiring attention"
          />
        </div>
      </section>

      {/* ==========================================================================
          SECURITY METRICS SECTION
          ========================================================================== */}
      <section className="space-y-4">
        <SectionHeader
          title="Security & Compliance"
          description="Identity security posture and MFA adoption"
          icon={ShieldCheckIcon}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <KpiCard
            title="MFA Adoption"
            value={`${Math.round((stats.mfaEnabled / stats.total) * 100)}%`}
            subtitle={`${stats.mfaEnabled} of ${stats.total} users`}
            icon={ShieldCheck}
            variant="success"
            tooltip="Percentage of users with multi-factor authentication enabled"
          />
          <KpiCard
            title="MFA Required"
            value={stats.mfaRequired}
            subtitle="Pending configuration"
            icon={ShieldAlert}
            badge={
              stats.mfaRequired > 0
                ? { label: "Action needed", variant: "warning" }
                : undefined
            }
            variant={stats.mfaRequired > 0 ? "warning" : "default"}
            tooltip="Users required to have MFA but haven't configured it yet"
          />
          <KpiCard
            title="Security Score"
            value={securityMetrics.riskScore}
            subtitle="Risk assessment"
            icon={Shield}
            variant={securityMetrics.riskScore > 50 ? "danger" : "success"}
            tooltip="Overall security risk score based on multiple factors"
          />
        </div>
      </section>

      {/* ==========================================================================
          FILTERS & SEARCH SECTION
          ========================================================================== */}
      <section className="space-y-4">
        <SectionHeader
          title="User Directory"
          description="Search, filter and manage users"
          icon={Users}
        />

        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, email, or username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as User["status"] | "all")
                }
                className="px-3 py-2.5 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                title="Filter users by their account status"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="invited">Invited</option>
                <option value="suspended">Suspended</option>
                <option value="archived">Archived</option>
              </select>
              <select
                value={orgUnitFilter}
                onChange={(e) => setOrgUnitFilter(e.target.value)}
                className="px-3 py-2.5 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                title="Filter users by their organizational unit"
              >
                <option value="all">All Units</option>
                {orgUnits.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 text-sm font-medium border rounded-lg transition-colors",
                  isFiltersOpen ? "bg-muted border-primary" : "hover:bg-muted",
                )}
                title="Toggle advanced filters"
              >
                <Filter className="h-4 w-4" />
                Filters
                {isFiltersOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedUsers.size > 0 && (
            <div className="flex items-center justify-between p-3 bg-muted/50 border rounded-lg">
              <span className="text-sm font-medium">
                {selectedUsers.size} user(s) selected
              </span>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border rounded-md hover:bg-background transition-colors">
                  <Shield className="h-4 w-4" />
                  Require MFA
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border rounded-md hover:bg-background transition-colors">
                  <Lock className="h-4 w-4" />
                  Suspend
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-destructive border border-destructive/20 rounded-md hover:bg-destructive/10 transition-colors">
                  <Trash2 className="h-4 w-4" />
                  Archive
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ==========================================================================
          CONFIGURATION & AUTOMATION SECTION
          Positionné avant le directory pour une meilleure hiérarchie
          ========================================================================== */}
      <section className="space-y-4">
        <SectionHeader
          title="Configuration & Automation"
          description="Advanced settings and automated workflows"
          icon={Settings}
          action={{
            label: "View all settings",
            onClick: () => {},
            icon: ChevronRight,
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">Provisioning Rules</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Auto-assign roles and environments
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-100">
                  <RefreshCw className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">Lifecycle Policies</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Automated onboarding & offboarding
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Activity className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">Activity Monitoring</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Track access patterns and anomalies
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ==========================================================================
          MAIN CONTENT SECTION
          ========================================================================== */}
      <section className="pb-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Table */}
          <div className="xl:col-span-3">
            <UserTable
              users={filteredUsers}
              selectedUser={selectedUser}
              onSelectUser={setSelectedUser}
              selectedUsers={selectedUsers}
              onToggleSelectUser={handleToggleSelectUser}
              onToggleSelectAll={handleToggleSelectAll}
            />
          </div>

          {/* Side Panel - Réorganisé : Security en premier, toujours visible */}
          <div className="xl:col-span-1 space-y-6">
            <SecurityDashboard />
            <UserDetailPanel
              user={selectedUser}
              onClose={() => setSelectedUser(null)}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
