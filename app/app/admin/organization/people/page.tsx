"use client";

import { useState } from "react";
import {
  Users,
  UserPlus,
  UserMinus,
  Mail,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  Download,
  Upload,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Lock,
  Unlock,
  RefreshCw,
  Trash2,
  Eye,
  Check,
  X,
  RefreshCcw,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
}

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
  },
];

const statusConfig = {
  active: {
    icon: CheckCircle2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    label: "Active",
  },
  invited: {
    icon: Mail,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    label: "Invited",
  },
  suspended: {
    icon: AlertCircle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    label: "Suspended",
  },
  archived: {
    icon: XCircle,
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
    label: "Archived",
  },
};

function StatusBadge({ status }: { status: User["status"] }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        config.bgColor,
        config.color,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
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
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-500">
        <ShieldCheck className="h-3 w-3" />
        Enabled
      </span>
    );
  }
  if (required) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-500">
        <ShieldAlert className="h-3 w-3" />
        Required
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-500/10 text-slate-500">
      <Shield className="h-3 w-3" />
      Optional
    </span>
  );
}

function EnvironmentBadges({ environments }: { environments: string[] }) {
  if (environments.length === 0) {
    return <span className="text-xs text-muted-foreground italic">None</span>;
  }
  return (
    <div className="flex flex-wrap gap-1">
      {environments.map((env) => (
        <span
          key={env}
          className={cn(
            "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium uppercase",
            env === "production"
              ? "bg-red-500/10 text-red-500"
              : env === "staging"
                ? "bg-amber-500/10 text-amber-500"
                : "bg-blue-500/10 text-blue-500",
          )}
        >
          {env}
        </span>
      ))}
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
          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground"
        >
          {role}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className="text-xs text-muted-foreground">+{remainingCount}</span>
      )}
    </div>
  );
}

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
  // Use consistent ISO date format to avoid hydration mismatches
  return date.toISOString().split("T")[0];
}

function UserTable({
  users,
  selectedUser,
  onSelectUser,
}: {
  users: User[];
  selectedUser: User | null;
  onSelectUser: (user: User | null) => void;
}) {
  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="border-b">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground w-8">
                <input
                  type="checkbox"
                  className="rounded border-input"
                  onChange={() => {}}
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
                MFA
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Last Login
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Environments
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground w-10">
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
                    onChange={() => {}}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
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
                    className="p-1 hover:bg-muted rounded transition-colors"
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
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
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
          Showing {users.length} of {mockUsers.length} users
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm font-medium border rounded hover:bg-muted transition-colors disabled:opacity-50">
            Previous
          </button>
          <button className="px-3 py-1.5 text-sm font-medium border rounded hover:bg-muted transition-colors disabled:opacity-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function UserDetailPanel({
  user,
  onClose,
}: {
  user: User | null;
  onClose: () => void;
}) {
  if (!user) {
    return (
      <div className="border rounded-lg bg-card p-6 h-full">
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
          <Users className="h-12 w-12 mb-4 opacity-50" />
          <p className="text-sm">Select a user to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-card overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between px-4 py-4 border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
            {user.displayName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              {user.displayName}
            </h3>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-muted rounded transition-colors"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Status & Quick Actions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <StatusBadge status={user.status} />
            <span className="text-xs text-muted-foreground font-mono">
              {user.id}
            </span>
          </div>

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

        {/* Identity Section */}
        <div className="space-y-3 pt-4 border-t">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Identity
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Username</span>
              <span className="font-mono">{user.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span>{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            {user.externalIdentity && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">External ID</span>
                <span className="font-mono text-xs">
                  {user.externalIdentity.provider}:{" "}
                  {user.externalIdentity.externalId}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Organization Section */}
        <div className="space-y-3 pt-4 border-t">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Organization
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Primary Unit</span>
              <span>{user.primaryOrgUnit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Environments</span>
              <EnvironmentBadges environments={user.environmentScope} />
            </div>
          </div>
        </div>

        {/* Roles Section */}
        <div className="space-y-3 pt-4 border-t">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Access & Roles
          </h4>
          <div className="flex flex-wrap gap-2">
            {user.roles.map((role) => (
              <span
                key={role}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-foreground"
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* Security Section */}
        <div className="space-y-3 pt-4 border-t">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Security
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">MFA Status</span>
              <MfaBadge enabled={user.mfaEnabled} required={user.mfaRequired} />
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Login</span>
              <span>
                {user.lastLoginAt
                  ? formatRelativeTime(user.lastLoginAt)
                  : "Never"}
              </span>
            </div>
          </div>
          {user.mfaEnabled && (
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-amber-200">
              <RefreshCw className="h-4 w-4" />
              Reset MFA
            </button>
          )}
        </div>

        {/* Danger Zone */}
        <div className="space-y-3 pt-4 border-t">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-destructive">
            Danger Zone
          </h4>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-destructive/20">
              <Trash2 className="h-4 w-4" />
              {user.status === "archived"
                ? "Permanently Delete"
                : "Archive User"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PeoplePage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<User["status"] | "all">(
    "all",
  );

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      searchQuery === "" ||
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockUsers.length,
    active: mockUsers.filter((u) => u.status === "active").length,
    invited: mockUsers.filter((u) => u.status === "invited").length,
    suspended: mockUsers.filter((u) => u.status === "suspended").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-card-foreground">
            People
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Manage human identities in your organization. Users represent
            individuals who authenticate and access resources within your
            identity system.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
            <Upload className="h-4 w-4" />
            Import
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <UserPlus className="h-4 w-4" />
            Invite User
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border bg-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Users</p>
            </div>
            <Users className="h-8 w-8 text-muted-foreground/50" />
          </div>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-emerald-500">
                {stats.active}
              </p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-emerald-500/50" />
          </div>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-blue-500">
                {stats.invited}
              </p>
              <p className="text-xs text-muted-foreground">Invited</p>
            </div>
            <Mail className="h-8 w-8 text-blue-500/50" />
          </div>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-amber-500">
                {stats.suspended}
              </p>
              <p className="text-xs text-muted-foreground">Suspended</p>
            </div>
            <AlertCircle className="h-8 w-8 text-amber-500/50" />
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email, or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as User["status"] | "all")
            }
            className="px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="invited">Invited</option>
            <option value="suspended">Suspended</option>
            <option value="archived">Archived</option>
          </select>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
            <Filter className="h-4 w-4" />
            More Filters
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UserTable
            users={filteredUsers}
            selectedUser={selectedUser}
            onSelectUser={setSelectedUser}
          />
        </div>
        <div className="lg:col-span-1">
          <UserDetailPanel
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        </div>
      </div>
    </div>
  );
}
