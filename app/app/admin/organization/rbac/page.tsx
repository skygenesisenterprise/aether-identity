"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Users,
  Search,
  Plus,
  Folder,
  ChevronRight,
  Clock,
  User,
  Edit,
  Trash2,
  X,
  Link2,
  ArrowUpRight,
  Layers,
  CheckCircle2,
  XCircle,
  Info,
  Loader2,
  Key,
  FileKey,
  AlertTriangle,
  Activity,
  History,
  RefreshCcw,
  Filter,
  Unlock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { Textarea } from "@/components/dashboard/ui/textarea";
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

interface Role {
  id: string;
  name: string;
  description?: string;
  parentRoleId?: string | null;
  permissions: string[];
  membersCount: number;
  createdAt: string;
  updatedAt: string;
  status: "active" | "inactive";
}

interface Permission {
  id: string;
  name: string;
  description?: string;
  category: string;
  resource: string;
  action: string;
  riskLevel: "low" | "medium" | "high" | "critical";
}

interface RoleMember {
  id: string;
  name: string;
  email: string;
  role: string;
  addedAt: string;
  source: "direct" | "inherited" | "group";
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockPermissions: Permission[] = [
  {
    id: "perm-001",
    name: "users:read",
    description: "View user profiles and basic information",
    category: "Identity",
    resource: "users",
    action: "read",
    riskLevel: "low",
  },
  {
    id: "perm-002",
    name: "users:write",
    description: "Create and modify user profiles",
    category: "Identity",
    resource: "users",
    action: "write",
    riskLevel: "medium",
  },
  {
    id: "perm-003",
    name: "users:delete",
    description: "Delete user accounts permanently",
    category: "Identity",
    resource: "users",
    action: "delete",
    riskLevel: "high",
  },
  {
    id: "perm-004",
    name: "groups:read",
    description: "View group memberships and structure",
    category: "Organization",
    resource: "groups",
    action: "read",
    riskLevel: "low",
  },
  {
    id: "perm-005",
    name: "groups:write",
    description: "Manage groups and their members",
    category: "Organization",
    resource: "groups",
    action: "write",
    riskLevel: "medium",
  },
  {
    id: "perm-006",
    name: "roles:read",
    description: "View roles and permissions",
    category: "Access Control",
    resource: "roles",
    action: "read",
    riskLevel: "low",
  },
  {
    id: "perm-007",
    name: "roles:write",
    description: "Create and modify roles",
    category: "Access Control",
    resource: "roles",
    action: "write",
    riskLevel: "high",
  },
  {
    id: "perm-008",
    name: "audit:read",
    description: "Access audit logs and activity history",
    category: "Security",
    resource: "audit",
    action: "read",
    riskLevel: "medium",
  },
  {
    id: "perm-009",
    name: "security:admin",
    description: "Full security administration access",
    category: "Security",
    resource: "security",
    action: "admin",
    riskLevel: "critical",
  },
  {
    id: "perm-010",
    name: "system:admin",
    description: "Full system administration access",
    category: "System",
    resource: "system",
    action: "admin",
    riskLevel: "critical",
  },
  {
    id: "perm-011",
    name: "mfa:manage",
    description: "Manage MFA settings and reset tokens",
    category: "Security",
    resource: "mfa",
    action: "write",
    riskLevel: "high",
  },
  {
    id: "perm-012",
    name: "reports:read",
    description: "View compliance and security reports",
    category: "Reporting",
    resource: "reports",
    action: "read",
    riskLevel: "low",
  },
];

const mockRoles: Role[] = [
  {
    id: "role-001",
    name: "Super Administrator",
    description: "Full system access with all permissions",
    parentRoleId: null,
    permissions: [
      "perm-001",
      "perm-002",
      "perm-003",
      "perm-004",
      "perm-005",
      "perm-006",
      "perm-007",
      "perm-008",
      "perm-009",
      "perm-010",
      "perm-011",
      "perm-012",
    ],
    membersCount: 3,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    status: "active",
  },
  {
    id: "role-002",
    name: "Identity Administrator",
    description: "Manage users, groups, and identity settings",
    parentRoleId: "role-001",
    permissions: [
      "perm-001",
      "perm-002",
      "perm-003",
      "perm-004",
      "perm-005",
      "perm-006",
      "perm-007",
    ],
    membersCount: 8,
    createdAt: "2023-02-15T00:00:00Z",
    updatedAt: "2024-01-10T14:20:00Z",
    status: "active",
  },
  {
    id: "role-003",
    name: "Security Auditor",
    description: "Read-only access to security and audit data",
    parentRoleId: "role-002",
    permissions: ["perm-001", "perm-004", "perm-006", "perm-008", "perm-012"],
    membersCount: 12,
    createdAt: "2023-03-01T00:00:00Z",
    updatedAt: "2024-01-08T09:15:00Z",
    status: "active",
  },
  {
    id: "role-004",
    name: "Group Manager",
    description: "Manage group memberships and structure",
    parentRoleId: "role-002",
    permissions: ["perm-001", "perm-004", "perm-005", "perm-006"],
    membersCount: 24,
    createdAt: "2023-04-10T00:00:00Z",
    updatedAt: "2023-12-20T16:45:00Z",
    status: "active",
  },
  {
    id: "role-005",
    name: "User Support",
    description: "Basic user management and support access",
    parentRoleId: "role-004",
    permissions: ["perm-001", "perm-002", "perm-004", "perm-011"],
    membersCount: 15,
    createdAt: "2023-05-20T00:00:00Z",
    updatedAt: "2024-01-05T11:20:00Z",
    status: "active",
  },
  {
    id: "role-006",
    name: "Read Only",
    description: "View-only access to organizational data",
    parentRoleId: null,
    permissions: ["perm-001", "perm-004", "perm-006", "perm-012"],
    membersCount: 45,
    createdAt: "2023-06-01T00:00:00Z",
    updatedAt: "2023-11-30T09:45:00Z",
    status: "active",
  },
  {
    id: "role-007",
    name: "Developer",
    description: "Access to development resources and tools",
    parentRoleId: "role-006",
    permissions: ["perm-001", "perm-004", "perm-006", "perm-012"],
    membersCount: 32,
    createdAt: "2023-07-15T00:00:00Z",
    updatedAt: "2024-01-12T10:00:00Z",
    status: "active",
  },
  {
    id: "role-008",
    name: "Legacy Admin",
    description: "Deprecated administrative role",
    parentRoleId: null,
    permissions: ["perm-001", "perm-002", "perm-004", "perm-005"],
    membersCount: 2,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-06-01T00:00:00Z",
    status: "inactive",
  },
];

const mockMembers: RoleMember[] = [
  {
    id: "usr-001",
    name: "John Smith",
    email: "john.smith@acme.com",
    role: "Identity Administrator",
    addedAt: "2023-01-20T00:00:00Z",
    source: "direct",
  },
  {
    id: "usr-002",
    name: "Sarah Jones",
    email: "sarah.jones@acme.com",
    role: "Security Auditor",
    addedAt: "2023-02-01T00:00:00Z",
    source: "inherited",
  },
  {
    id: "usr-003",
    name: "Michael Chen",
    email: "michael.chen@acme.com",
    role: "Group Manager",
    addedAt: "2023-03-15T00:00:00Z",
    source: "group",
  },
  {
    id: "usr-004",
    name: "Emily Davis",
    email: "emily.davis@acme.com",
    role: "User Support",
    addedAt: "2023-04-01T00:00:00Z",
    source: "direct",
  },
  {
    id: "usr-005",
    name: "David Wilson",
    email: "david.wilson@acme.com",
    role: "Read Only",
    addedAt: "2023-05-10T00:00:00Z",
    source: "inherited",
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffMonths < 12) return `${diffMonths} months ago`;
  return date.toISOString().split("T")[0];
}

function getParentRoleName(
  parentRoleId: string | null | undefined,
  roles: Role[],
): string | null {
  if (!parentRoleId) return null;
  const parent = roles.find((r) => r.id === parentRoleId);
  return parent?.name || null;
}

function getInheritedPermissions(role: Role, roles: Role[]): Permission[] {
  if (!role.parentRoleId) return [];
  const parent = roles.find((r) => r.id === role.parentRoleId);
  if (!parent) return [];
  const parentPermissions = mockPermissions.filter((p) =>
    parent.permissions.includes(p.id),
  );
  const ancestorPermissions = getInheritedPermissions(parent, roles);
  return [...ancestorPermissions, ...parentPermissions];
}

function getEffectivePermissions(role: Role, roles: Role[]): Permission[] {
  const inherited = getInheritedPermissions(role, roles);
  const direct = mockPermissions.filter((p) => role.permissions.includes(p.id));
  const allPermissions = [...inherited, ...direct];
  // Remove duplicates based on permission id
  const uniquePermissions = allPermissions.filter(
    (perm, index, self) => index === self.findIndex((p) => p.id === perm.id),
  );
  return uniquePermissions;
}

// ============================================================================
// COMPONENTS
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

function StatusBadge({ status }: { status: Role["status"] }) {
  const config = {
    active: {
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      label: "Active",
    },
    inactive: {
      icon: XCircle,
      color: "text-slate-500",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
      label: "Inactive",
    },
  };

  const { icon: Icon, color, bgColor, borderColor, label } = config[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border",
        bgColor,
        color,
        borderColor,
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

function RiskBadge({ level }: { level: Permission["riskLevel"] }) {
  const config = {
    low: {
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      label: "Low",
    },
    medium: {
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      label: "Medium",
    },
    high: {
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      label: "High",
    },
    critical: {
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      label: "Critical",
    },
  };

  const { color, bgColor, borderColor, label } = config[level];

  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border",
        bgColor,
        color,
        borderColor,
      )}
    >
      {label}
    </span>
  );
}

function PermissionBadge({ permission }: { permission: Permission }) {
  return (
    <div
      className="inline-flex flex-col gap-1 p-2 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
      title={permission.description}
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono font-medium text-foreground">
          {permission.name}
        </span>
        <RiskBadge level={permission.riskLevel} />
      </div>
      <span className="text-[10px] text-muted-foreground">
        {permission.category}
      </span>
    </div>
  );
}

function SourceBadge({ source }: { source: RoleMember["source"] }) {
  const config = {
    direct: {
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      label: "Direct",
    },
    inherited: {
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      label: "Inherited",
    },
    group: {
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      label: "Group",
    },
  };

  const { color, bgColor, borderColor, label } = config[source];

  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border",
        bgColor,
        color,
        borderColor,
      )}
    >
      {label}
    </span>
  );
}

function RoleListItem({
  role,
  isSelected,
  onSelect,
  parentName,
}: {
  role: Role;
  isSelected: boolean;
  onSelect: () => void;
  parentName: string | null;
}) {
  const permissionCount = role.permissions.length;

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
          "h-10 w-10 rounded-lg flex items-center justify-center transition-colors",
          isSelected
            ? "bg-primary/20 text-primary"
            : "bg-muted text-muted-foreground",
        )}
      >
        <Shield className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm truncate">{role.name}</p>
          <StatusBadge status={role.status} />
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">
            {role.membersCount} members
          </span>
          <span className="text-xs text-muted-foreground">
            {permissionCount} permissions
          </span>
          {parentName && (
            <>
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                inherits from {parentName}
              </span>
            </>
          )}
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
    </div>
  );
}

function RoleList({
  roles,
  selectedRoleId,
  onSelectRole,
  searchQuery,
  statusFilter,
  allRoles,
}: {
  roles: Role[];
  selectedRoleId: string | null;
  onSelectRole: (role: Role) => void;
  searchQuery: string;
  statusFilter: Role["status"] | "all";
  allRoles: Role[];
}) {
  const filteredRoles = useMemo(() => {
    let result = roles;

    if (searchQuery) {
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((r) => r.status === statusFilter);
    }

    return result;
  }, [roles, searchQuery, statusFilter]);

  if (filteredRoles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <Shield className="h-6 w-6 text-muted-foreground/50" />
        </div>
        <p className="text-sm font-medium text-foreground">No roles found</p>
        <p className="text-xs text-muted-foreground mt-1">
          {searchQuery || statusFilter !== "all"
            ? "Try adjusting your search or filters"
            : "Create your first role to get started"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {filteredRoles.map((role) => (
        <RoleListItem
          key={role.id}
          role={role}
          isSelected={selectedRoleId === role.id}
          onSelect={() => onSelectRole(role)}
          parentName={getParentRoleName(role.parentRoleId, allRoles)}
        />
      ))}
    </div>
  );
}

interface RoleDetailPanelProps {
  role: Role | null;
  allRoles: Role[];
  onClose: () => void;
}

function RoleDetailPanel({ role, allRoles, onClose }: RoleDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "permissions" | "members" | "inheritance"
  >("overview");

  if (!role) {
    return (
      <Card className="h-full flex flex-col">
        <CardContent className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 opacity-50" />
          </div>
          <p className="text-sm font-medium">Select a role to view details</p>
          <p className="text-xs text-muted-foreground mt-1">
            Click on any role to see its configuration and permissions
          </p>
        </CardContent>
      </Card>
    );
  }

  const parentName = getParentRoleName(role.parentRoleId, allRoles);
  const inheritedPermissions = getInheritedPermissions(role, allRoles);
  const directPermissions = mockPermissions.filter((p) =>
    role.permissions.includes(p.id),
  );
  const effectivePermissions = getEffectivePermissions(role, allRoles);

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between px-5 py-5 border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {role.name}
            </h3>
            <p className="text-xs text-muted-foreground font-mono truncate">
              {role.id}
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
          <StatusBadge status={role.status} />
          <span className="text-xs text-muted-foreground font-mono">
            {role.id}
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 py-3 border-b bg-muted/20">
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
            <Edit className="h-4 w-4" />
            Edit Role
          </button>
          <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
            <Users className="h-4 w-4" />
            Manage Members
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {[
          { id: "overview", label: "Overview", icon: Info },
          { id: "permissions", label: "Permissions", icon: Key },
          { id: "members", label: "Members", icon: Users },
          { id: "inheritance", label: "Inheritance", icon: Layers },
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
            <section>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <Shield className="h-3.5 w-3.5" />
                General Information
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Role Name</span>
                  <span className="font-medium">{role.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={role.status} />
                </div>
              </div>
            </section>

            {role.description && (
              <section className="pt-4 border-t">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                  Description
                </h4>
                <p className="text-sm text-muted-foreground">
                  {role.description}
                </p>
              </section>
            )}

            <section className="pt-4 border-t">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <Link2 className="h-3.5 w-3.5" />
                Inheritance
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Parent Role</span>
                  {parentName ? (
                    <span className="font-medium">{parentName}</span>
                  ) : (
                    <span className="text-muted-foreground italic">
                      Root role (no parent)
                    </span>
                  )}
                </div>
              </div>
            </section>

            <section className="pt-4 border-t">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" />
                Timestamps
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date(role.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span>{formatRelativeTime(role.updatedAt)}</span>
                </div>
              </div>
            </section>

            <section className="pt-4 border-t">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <Activity className="h-3.5 w-3.5" />
                Quick Stats
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border bg-muted/30">
                  <p className="text-2xl font-bold">{role.membersCount}</p>
                  <p className="text-xs text-muted-foreground">Members</p>
                </div>
                <div className="p-3 rounded-lg border bg-muted/30">
                  <p className="text-2xl font-bold">
                    {role.permissions.length}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Direct Permissions
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === "permissions" && (
          <div className="space-y-6">
            <section>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <Key className="h-3.5 w-3.5" />
                Direct Permissions ({directPermissions.length})
              </h4>
              {directPermissions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {directPermissions.map((permission) => (
                    <PermissionBadge
                      key={permission.id}
                      permission={permission}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No direct permissions assigned
                </p>
              )}
            </section>

            {inheritedPermissions.length > 0 && (
              <section className="pt-4 border-t">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                  <Layers className="h-3.5 w-3.5" />
                  Inherited Permissions ({inheritedPermissions.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {inheritedPermissions.map((permission) => (
                    <PermissionBadge
                      key={permission.id}
                      permission={permission}
                    />
                  ))}
                </div>
              </section>
            )}

            <section className="pt-4 border-t">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5" />
                Effective Permissions ({effectivePermissions.length})
              </h4>
              <div className="p-3 rounded-lg border bg-muted/30">
                <p className="text-xs text-muted-foreground">
                  Effective permissions = Direct permissions (
                  {directPermissions.length}) + Inherited permissions (
                  {inheritedPermissions.length}) = {effectivePermissions.length}{" "}
                  total
                </p>
              </div>
            </section>

            <div className="pt-4 border-t">
              <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors border border-dashed">
                <ShieldCheck className="h-4 w-4" />
                Add / Remove Permission
              </button>
            </div>
          </div>
        )}

        {activeTab === "members" && (
          <div className="space-y-4">
            <section>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <Users className="h-3.5 w-3.5" />
                Role Members ({role.membersCount})
              </h4>
              <div className="space-y-2">
                {mockMembers.slice(0, 3).map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-2 rounded-lg border bg-card"
                  >
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {member.email}
                      </p>
                    </div>
                    <SourceBadge source={member.source} />
                  </div>
                ))}
              </div>
            </section>

            {role.membersCount > 3 && (
              <div className="pt-2">
                <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors border border-dashed">
                  <Users className="h-4 w-4" />
                  View All {role.membersCount} Members
                </button>
              </div>
            )}

            <div className="pt-4 border-t">
              <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <User className="h-4 w-4" />
                Add Members
              </button>
            </div>
          </div>
        )}

        {activeTab === "inheritance" && (
          <div className="space-y-6">
            <section>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <Layers className="h-3.5 w-3.5" />
                Inheritance Chain
              </h4>
              <div className="space-y-2">
                {parentName ? (
                  <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/30">
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Inherits from: {parentName}</span>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground p-3 rounded-lg border bg-muted/30">
                    This is a root-level role with no parent
                  </p>
                )}
              </div>
            </section>

            <section className="pt-4 border-t">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <FileKey className="h-3.5 w-3.5" />
                Permission Breakdown
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg border bg-card">
                  <span className="text-sm">Direct Permissions</span>
                  <Badge variant="secondary">{directPermissions.length}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg border bg-card">
                  <span className="text-sm">Inherited Permissions</span>
                  <Badge variant="secondary">
                    {inheritedPermissions.length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg border bg-card">
                  <span className="text-sm font-medium">Total Effective</span>
                  <Badge>{effectivePermissions.length}</Badge>
                </div>
              </div>
            </section>

            <section className="pt-4 border-t">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5" />
                Risk Assessment
              </h4>
              <div className="space-y-2">
                {effectivePermissions.some(
                  (p) => p.riskLevel === "critical",
                ) && (
                  <div className="flex items-center gap-2 p-2 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
                    <ShieldAlert className="h-4 w-4" />
                    Contains critical permissions
                  </div>
                )}
                {effectivePermissions.some((p) => p.riskLevel === "high") && (
                  <div className="flex items-center gap-2 p-2 rounded-lg border border-orange-200 bg-orange-50 text-orange-700 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    Contains high-risk permissions
                  </div>
                )}
                {!effectivePermissions.some(
                  (p) => p.riskLevel === "critical" || p.riskLevel === "high",
                ) && (
                  <div className="flex items-center gap-2 p-2 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm">
                    <CheckCircle2 className="h-4 w-4" />
                    Low risk profile
                  </div>
                )}
              </div>
            </section>

            {/* Future: Access Preview */}
            <section className="pt-4 border-t">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <History className="h-3.5 w-3.5" />
                Access Preview
              </h4>
              <div className="p-3 rounded-lg border bg-muted/30">
                <p className="text-xs text-muted-foreground">
                  Access preview and simulation will be available here. This
                  will allow you to test what resources members of this role can
                  access.
                </p>
              </div>
            </section>
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
          Delete Role
        </button>
      </div>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function RbacPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Role["status"] | "all">(
    "all",
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    parentRoleId: "none",
  });

  const stats = useMemo(() => {
    const total = mockRoles.length;
    const active = mockRoles.filter((r) => r.status === "active").length;
    const inactive = mockRoles.filter((r) => r.status === "inactive").length;
    const totalMembers = mockRoles.reduce((sum, r) => sum + r.membersCount, 0);
    const rootRoles = mockRoles.filter((r) => !r.parentRoleId).length;
    const totalPermissions = mockPermissions.length;
    const criticalPermissions = mockPermissions.filter(
      (p) => p.riskLevel === "critical",
    ).length;

    return {
      total,
      active,
      inactive,
      totalMembers,
      rootRoles,
      totalPermissions,
      criticalPermissions,
    };
  }, []);

  const handleCreateRole = async () => {
    setIsCreating(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsCreating(false);
    setIsCreateDialogOpen(false);
    setNewRole({
      name: "",
      description: "",
      parentRoleId: "none",
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
                Identity Organization RBAC
              </h1>
              <Badge variant="secondary" className="text-xs">
                {stats.total} roles
              </Badge>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Manage roles, permissions, and access across your organization.
              Configure role inheritance, assign permissions, and control member
              access.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4" />
                  Create Role
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-125">
                <DialogHeader>
                  <DialogTitle>Create New Role</DialogTitle>
                  <DialogDescription>
                    Create a new role to manage access permissions and member
                    assignments.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Role Name
                    </label>
                    <Input
                      id="name"
                      placeholder="e.g., Security Administrator"
                      value={newRole.name}
                      onChange={(e) =>
                        setNewRole((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <label
                      htmlFor="description"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Description
                    </label>
                    <Textarea
                      id="description"
                      placeholder="Describe the purpose and scope of this role..."
                      value={newRole.description}
                      onChange={(e) =>
                        setNewRole((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label
                      htmlFor="parent"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Parent Role (Inheritance)
                    </label>
                    <Select
                      value={newRole.parentRoleId}
                      onValueChange={(value) =>
                        setNewRole((prev) => ({
                          ...prev,
                          parentRoleId: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a parent role (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">
                          No parent (root role)
                        </SelectItem>
                        {mockRoles
                          .filter((r) => r.status === "active")
                          .map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Child roles inherit all permissions from their parent
                    </p>
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
                    onClick={handleCreateRole}
                    disabled={!newRole.name || isCreating}
                  >
                    {isCreating && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isCreating ? "Creating..." : "Create Role"}
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
          description="Key metrics and role distribution"
          icon={Shield}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Total Roles"
            value={stats.total}
            subtitle="Defined in system"
            icon={Shield}
            variant="default"
          />
          <KpiCard
            title="Active Roles"
            value={stats.active}
            subtitle="Currently enabled"
            icon={CheckCircle2}
            variant="success"
          />
          <KpiCard
            title="Total Members"
            value={stats.totalMembers}
            subtitle="Across all roles"
            icon={Users}
            variant="info"
          />
          <KpiCard
            title="Root Roles"
            value={stats.rootRoles}
            subtitle="Top-level roles"
            icon={Layers}
            variant="warning"
          />
        </div>
      </section>

      {/* ==========================================================================
          PERMISSIONS SECTION
          ========================================================================== */}
      <section className="space-y-4">
        <SectionHeader
          title="Permissions Inventory"
          description="Available permissions in the system"
          icon={Key}
          action={{
            label: "View All Permissions",
            onClick: () => {},
            icon: ChevronRight,
          }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Total Permissions"
            value={stats.totalPermissions}
            subtitle="System-wide"
            icon={Key}
            variant="default"
          />
          <KpiCard
            title="Critical"
            value={stats.criticalPermissions}
            subtitle="High risk"
            icon={ShieldAlert}
            variant="danger"
          />
          <KpiCard
            title="Categories"
            value={6}
            subtitle="Permission types"
            icon={Folder}
            variant="info"
          />
          <KpiCard
            title="Unused"
            value={2}
            subtitle="Not assigned to roles"
            icon={Unlock}
            variant="warning"
          />
        </div>
      </section>

      {/* ==========================================================================
          FILTERS & SEARCH SECTION
          ========================================================================== */}
      <section className="space-y-4">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by role name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
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

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
              >
                <SelectTrigger className="w-35">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                disabled={!searchQuery && statusFilter === "all"}
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>

            {/* Active Filters Indicator */}
            {(searchQuery || statusFilter !== "all") && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Showing{" "}
                  {
                    mockRoles.filter((r) => {
                      const matchesSearch =
                        searchQuery === "" ||
                        r.name
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                        r.description
                          ?.toLowerCase()
                          .includes(searchQuery.toLowerCase());
                      const matchesStatus =
                        statusFilter === "all" || r.status === statusFilter;
                      return matchesSearch && matchesStatus;
                    }).length
                  }{" "}
                  of {mockRoles.length} roles
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* ==========================================================================
          ROLES TABLE SECTION
          ========================================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Role List
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronRight className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Card className="border-border overflow-hidden">
          {(() => {
            const filteredRoles = mockRoles.filter((r) => {
              const matchesSearch =
                searchQuery === "" ||
                r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.description
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase());
              const matchesStatus =
                statusFilter === "all" || r.status === statusFilter;
              return matchesSearch && matchesStatus;
            });

            if (filteredRoles.length === 0) {
              return (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Shield className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    No roles found
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-md">
                    {searchQuery || statusFilter !== "all"
                      ? "Try adjusting your search or filters to find what you're looking for."
                      : "There are no roles to display at the moment."}
                  </p>
                  {(searchQuery || statusFilter !== "all") && (
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("all");
                      }}
                    >
                      <RefreshCcw className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  )}
                </div>
              );
            }

            return (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">
                        Role Name
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">
                        Description
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">
                        Members
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">
                        Permissions
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">
                        Parent Role
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">
                        Status
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3 w-20">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredRoles.map((role) => (
                      <tr
                        key={role.id}
                        className="hover:bg-muted/30 cursor-pointer transition-colors"
                        onClick={() => setSelectedRole(role)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Shield className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{role.name}</p>
                              <p className="text-xs text-muted-foreground font-mono">
                                {role.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {role.description || "No description"}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{role.membersCount}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className="text-xs">
                            {role.permissions.length} permissions
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          {getParentRoleName(role.parentRoleId, mockRoles) ? (
                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <ArrowUpRight className="h-3 w-3" />
                              {getParentRoleName(role.parentRoleId, mockRoles)}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">
                              None
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={role.status} />
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRole(role);
                            }}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })()}
        </Card>
      </section>

      {/* ==========================================================================
          ROLE DETAILS DIALOG
          ========================================================================== */}
      <Dialog
        open={!!selectedRole}
        onOpenChange={(open) => !open && setSelectedRole(null)}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedRole && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Role Details
                </DialogTitle>
                <DialogDescription>
                  Detailed information about the role and its configuration.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Role Info Header */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {selectedRole.name}
                      </h3>
                      <StatusBadge status={selectedRole.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedRole.description || "No description"}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                      {selectedRole.id}
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg border bg-card">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Members
                      </span>
                    </div>
                    <p className="text-2xl font-bold mt-1">
                      {selectedRole.membersCount}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border bg-card">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Permissions
                      </span>
                    </div>
                    <p className="text-2xl font-bold mt-1">
                      {selectedRole.permissions.length}
                    </p>
                  </div>
                </div>

                {/* Inheritance */}
                <section>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5" />
                    Inheritance
                  </h4>
                  <div className="p-3 rounded-lg border bg-muted/30">
                    {getParentRoleName(selectedRole.parentRoleId, mockRoles) ? (
                      <div className="flex items-center gap-2">
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          Inherits from:{" "}
                          {getParentRoleName(
                            selectedRole.parentRoleId,
                            mockRoles,
                          )}
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        This is a root-level role with no parent
                      </p>
                    )}
                  </div>
                </section>

                {/* Permissions */}
                <section>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                    <Key className="h-3.5 w-3.5" />
                    Direct Permissions
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {mockPermissions
                      .filter((p) => selectedRole.permissions.includes(p.id))
                      .map((permission) => (
                        <div
                          key={permission.id}
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-mono bg-muted border"
                        >
                          {permission.name}
                          <RiskBadge level={permission.riskLevel} />
                        </div>
                      ))}
                  </div>
                </section>

                {/* Timestamps */}
                <section className="pt-4 border-t">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    Timestamps
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Created</span>
                      <p className="font-medium">
                        {new Date(selectedRole.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Last Updated
                      </span>
                      <p className="font-medium">
                        {formatRelativeTime(selectedRole.updatedAt)}
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setSelectedRole(null)}>
                  Close
                </Button>
                <Button variant="default">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Role
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
