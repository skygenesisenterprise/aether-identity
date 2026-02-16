"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import {
  Users,
  Search,
  Plus,
  Shield,
  ShieldCheck,
  Building2,
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
  Copy,
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

interface OrganizationGroup {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentGroupId: string | null;
  membersCount: number;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  status: "active" | "inactive";
}

interface GroupMember {
  id: string;
  name: string;
  email: string;
  role: string;
  addedAt: string;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockGroups: OrganizationGroup[] = [
  {
    id: "grp-001",
    name: "Engineering",
    slug: "engineering",
    description: "Core engineering team responsible for product development",
    parentGroupId: null,
    membersCount: 45,
    permissions: [
      "admin:code:read",
      "admin:code:write",
      "admin:deploy:execute",
    ],
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2024-01-10T14:30:00Z",
    status: "active",
  },
  {
    id: "grp-002",
    name: "Platform Engineering",
    slug: "platform-engineering",
    description: "Infrastructure and platform team",
    parentGroupId: "grp-001",
    membersCount: 12,
    permissions: ["admin:infrastructure:read", "admin:infrastructure:write"],
    createdAt: "2023-03-01T00:00:00Z",
    updatedAt: "2024-01-08T09:15:00Z",
    status: "active",
  },
  {
    id: "grp-003",
    name: "Backend Team",
    slug: "backend-team",
    description: "Backend development team",
    parentGroupId: "grp-001",
    membersCount: 18,
    permissions: ["admin:code:read", "admin:code:write"],
    createdAt: "2023-04-15T00:00:00Z",
    updatedAt: "2024-01-05T11:20:00Z",
    status: "active",
  },
  {
    id: "grp-004",
    name: "Frontend Team",
    slug: "frontend-team",
    description: "Frontend development team",
    parentGroupId: "grp-001",
    membersCount: 15,
    permissions: ["admin:code:read", "admin:ui:write"],
    createdAt: "2023-05-01T00:00:00Z",
    updatedAt: "2023-12-20T16:45:00Z",
    status: "active",
  },
  {
    id: "grp-005",
    name: "Security",
    slug: "security",
    description: "Security and compliance team",
    parentGroupId: null,
    membersCount: 8,
    permissions: [
      "admin:security:read",
      "admin:security:write",
      "admin:audit:read",
    ],
    createdAt: "2023-02-01T00:00:00Z",
    updatedAt: "2024-01-12T10:00:00Z",
    status: "active",
  },
  {
    id: "grp-006",
    name: "Security Operations",
    slug: "security-operations",
    description: "SecOps team handling day-to-day security operations",
    parentGroupId: "grp-005",
    membersCount: 5,
    permissions: ["admin:security:read", "admin:security:write"],
    createdAt: "2023-06-01T00:00:00Z",
    updatedAt: "2024-01-11T08:30:00Z",
    status: "active",
  },
  {
    id: "grp-007",
    name: "Product",
    slug: "product",
    description: "Product management and design",
    parentGroupId: null,
    membersCount: 20,
    permissions: ["admin:product:read", "admin:product:write"],
    createdAt: "2023-02-15T00:00:00Z",
    updatedAt: "2023-12-15T13:00:00Z",
    status: "active",
  },
  {
    id: "grp-008",
    name: "Finance",
    slug: "finance",
    description: "Finance and accounting team",
    parentGroupId: null,
    membersCount: 10,
    permissions: ["admin:finance:read", "admin:finance:write"],
    createdAt: "2023-03-15T00:00:00Z",
    updatedAt: "2023-11-30T09:45:00Z",
    status: "inactive",
  },
];

const mockMembers: GroupMember[] = [
  {
    id: "usr-001",
    name: "John Smith",
    email: "john.smith@acme.com",
    role: "Member",
    addedAt: "2023-01-20T00:00:00Z",
  },
  {
    id: "usr-002",
    name: "Sarah Jones",
    email: "sarah.jones@acme.com",
    role: "Admin",
    addedAt: "2023-02-01T00:00:00Z",
  },
  {
    id: "usr-003",
    name: "Michael Chen",
    email: "michael.chen@acme.com",
    role: "Member",
    addedAt: "2023-03-15T00:00:00Z",
  },
  {
    id: "usr-004",
    name: "Emily Davis",
    email: "emily.davis@acme.com",
    role: "Viewer",
    addedAt: "2023-04-01T00:00:00Z",
  },
  {
    id: "usr-005",
    name: "David Wilson",
    email: "david.wilson@acme.com",
    role: "Member",
    addedAt: "2023-05-10T00:00:00Z",
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

function getParentGroupName(
  parentGroupId: string | null,
  groups: OrganizationGroup[],
): string | null {
  if (!parentGroupId) return null;
  const parent = groups.find((g) => g.id === parentGroupId);
  return parent?.name || null;
}

function getInheritedPermissions(
  group: OrganizationGroup,
  groups: OrganizationGroup[],
): string[] {
  if (!group.parentGroupId) return [];
  const parent = groups.find((g) => g.id === group.parentGroupId);
  if (!parent) return [];
  return [...getInheritedPermissions(parent, groups), ...parent.permissions];
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

function StatusBadge({ status }: { status: OrganizationGroup["status"] }) {
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

function PermissionBadge({ permission }: { permission: string }) {
  const isReadPermission = permission.includes(":read");
  const isWritePermission = permission.includes(":write");
  const isExecutePermission = permission.includes(":execute");

  let variant: "default" | "info" | "warning" | "danger" = "default";
  if (isExecutePermission) variant = "danger";
  else if (isWritePermission) variant = "warning";
  else if (isReadPermission) variant = "info";

  const variantStyles: Record<
    "default" | "info" | "warning" | "danger",
    string
  > = {
    default: "bg-muted text-muted-foreground border-border",
    info: "bg-blue-100 text-blue-700 border-blue-200",
    warning: "bg-amber-100 text-amber-700 border-amber-200",
    danger: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border",
        variantStyles[variant],
      )}
      title={permission}
    >
      {permission}
    </span>
  );
}

function GroupListItem({
  group,
  isSelected,
  onSelect,
  parentName,
}: {
  group: OrganizationGroup;
  isSelected: boolean;
  onSelect: () => void;
  parentName: string | null;
}) {
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
        <Folder className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm truncate">{group.name}</p>
          <StatusBadge status={group.status} />
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">
            {group.membersCount} members
          </span>
          {parentName && (
            <>
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {parentName}
              </span>
            </>
          )}
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
    </div>
  );
}

function GroupList({
  groups,
  selectedGroupId,
  onSelectGroup,
  searchQuery,
}: {
  groups: OrganizationGroup[];
  selectedGroupId: string | null;
  onSelectGroup: (group: OrganizationGroup) => void;
  searchQuery: string;
}) {
  const filteredGroups = useMemo(() => {
    if (!searchQuery) return groups;
    return groups.filter(
      (g) =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [groups, searchQuery]);

  if (filteredGroups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <Folder className="h-6 w-6 text-muted-foreground/50" />
        </div>
        <p className="text-sm font-medium text-foreground">No groups found</p>
        <p className="text-xs text-muted-foreground mt-1">
          {searchQuery
            ? "Try adjusting your search query"
            : "Create your first group to get started"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {filteredGroups.map((group) => (
        <GroupListItem
          key={group.id}
          group={group}
          isSelected={selectedGroupId === group.id}
          onSelect={() => onSelectGroup(group)}
          parentName={getParentGroupName(group.parentGroupId, groups)}
        />
      ))}
    </div>
  );
}

interface GroupDetailPanelProps {
  group: OrganizationGroup | null;
  allGroups: OrganizationGroup[];
  onClose: () => void;
}

function GroupDetailPanel({
  group,
  allGroups,
  onClose,
}: GroupDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "permissions" | "members" | "inheritance"
  >("overview");

  if (!group) {
    return (
      <Card className="h-full flex flex-col">
        <CardContent className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Folder className="h-8 w-8 opacity-50" />
          </div>
          <p className="text-sm font-medium">Select a group to view details</p>
          <p className="text-xs text-muted-foreground mt-1">
            Click on any group to see its configuration
          </p>
        </CardContent>
      </Card>
    );
  }

  const parentName = getParentGroupName(group.parentGroupId, allGroups);
  const inheritedPermissions = getInheritedPermissions(group, allGroups);
  const directPermissions = group.permissions;

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between px-5 py-5 border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Folder className="h-6 w-6 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {group.name}
            </h3>
            <p className="text-xs text-muted-foreground font-mono truncate">
              {group.slug}
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
          <StatusBadge status={group.status} />
          <span className="text-xs text-muted-foreground font-mono">
            {group.id}
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 py-3 border-b bg-muted/20">
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
            <Edit className="h-4 w-4" />
            Edit
          </button>
          <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
            <User className="h-4 w-4" />
            Members
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {[
          { id: "overview", label: "Overview", icon: Info },
          { id: "permissions", label: "Permissions", icon: Shield },
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
                <Building2 className="h-3.5 w-3.5" />
                General Information
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">{group.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Slug</span>
                  <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                    {group.slug}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={group.status} />
                </div>
              </div>
            </section>

            {group.description && (
              <section className="pt-4 border-t">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                  Description
                </h4>
                <p className="text-sm text-muted-foreground">
                  {group.description}
                </p>
              </section>
            )}

            <section className="pt-4 border-t">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <Link2 className="h-3.5 w-3.5" />
                Hierarchy
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Parent Group</span>
                  {parentName ? (
                    <span className="font-medium">{parentName}</span>
                  ) : (
                    <span className="text-muted-foreground italic">
                      Root group
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
                  <span>{new Date(group.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span>{formatRelativeTime(group.updatedAt)}</span>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === "permissions" && (
          <div className="space-y-6">
            <section>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <Shield className="h-3.5 w-3.5" />
                Direct Permissions ({directPermissions.length})
              </h4>
              {directPermissions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {directPermissions.map((permission) => (
                    <PermissionBadge key={permission} permission={permission} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No direct permissions assigned
                </p>
              )}
            </section>

            <div className="pt-4 border-t">
              <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors border border-dashed">
                <ShieldCheck className="h-4 w-4" />
                Manage Permissions
              </button>
            </div>
          </div>
        )}

        {activeTab === "members" && (
          <div className="space-y-4">
            <section>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <Users className="h-3.5 w-3.5" />
                Members ({group.membersCount})
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
                    <Badge variant="secondary" className="text-xs">
                      {member.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </section>

            {group.membersCount > 3 && (
              <div className="pt-2">
                <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors border border-dashed">
                  <Users className="h-4 w-4" />
                  View All {group.membersCount} Members
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
                    <span className="text-sm">Parent: {parentName}</span>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground p-3 rounded-lg border bg-muted/30">
                    This is a root-level group with no parent
                  </p>
                )}
              </div>
            </section>

            <section className="pt-4 border-t">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <Shield className="h-3.5 w-3.5" />
                Inherited Permissions ({inheritedPermissions.length})
              </h4>
              {inheritedPermissions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {inheritedPermissions.map((permission) => (
                    <PermissionBadge key={permission} permission={permission} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No inherited permissions
                </p>
              )}
            </section>

            <section className="pt-4 border-t">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5" />
                Effective Permissions
              </h4>
              <div className="p-3 rounded-lg border bg-muted/30">
                <p className="text-xs text-muted-foreground">
                  Effective permissions = Direct permissions + Inherited
                  permissions from parent groups
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
          Delete Group
        </button>
      </div>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function GroupsPage() {
  const [selectedGroup, setSelectedGroup] = useState<OrganizationGroup | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    slug: "",
    description: "",
    parentGroupId: "none",
  });

  const stats = useMemo(() => {
    const total = mockGroups.length;
    const active = mockGroups.filter((g) => g.status === "active").length;
    const inactive = mockGroups.filter((g) => g.status === "inactive").length;
    const totalMembers = mockGroups.reduce((sum, g) => sum + g.membersCount, 0);
    const rootGroups = mockGroups.filter((g) => !g.parentGroupId).length;

    return {
      total,
      active,
      inactive,
      totalMembers,
      rootGroups,
    };
  }, []);

  const handleNameChange = (name: string) => {
    setNewGroup((prev) => ({
      ...prev,
      name,
      slug: name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-"),
    }));
  };

  const handleCreateGroup = async () => {
    setIsCreating(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsCreating(false);
    setIsCreateDialogOpen(false);
    setNewGroup({
      name: "",
      slug: "",
      description: "",
      parentGroupId: "none",
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
                Identity Organization Groups
              </h1>
              <Badge variant="secondary" className="text-xs">
                {stats.total} total
              </Badge>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Manage organizational groups, their hierarchy, permissions, and
              member assignments. Configure inheritance and access control for
              your identity infrastructure.
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
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Group</DialogTitle>
                  <DialogDescription>
                    Create a new organizational group to manage members and
                    permissions.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Group Name
                    </label>
                    <Input
                      id="name"
                      placeholder="e.g., Engineering"
                      value={newGroup.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label
                      htmlFor="slug"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Slug
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="slug"
                        placeholder="e.g., engineering"
                        value={newGroup.slug}
                        onChange={(e) =>
                          setNewGroup((prev) => ({
                            ...prev,
                            slug: e.target.value,
                          }))
                        }
                        className="font-mono"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setNewGroup((prev) => ({
                            ...prev,
                            slug: prev.name
                              .toLowerCase()
                              .replace(/[^a-z0-9\s-]/g, "")
                              .replace(/\s+/g, "-"),
                          }))
                        }
                        title="Generate slug from name"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      URL-friendly identifier used in API requests
                    </p>
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
                      placeholder="Brief description of this group's purpose..."
                      value={newGroup.description}
                      onChange={(e) =>
                        setNewGroup((prev) => ({
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
                      Parent Group
                    </label>
                    <Select
                      value={newGroup.parentGroupId}
                      onValueChange={(value) =>
                        setNewGroup((prev) => ({
                          ...prev,
                          parentGroupId: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a parent group (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">
                          No parent (root level)
                        </SelectItem>
                        {mockGroups
                          .filter((g) => g.status === "active")
                          .map((group) => (
                            <SelectItem key={group.id} value={group.id}>
                              {group.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Child groups inherit permissions from their parent
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
                    onClick={handleCreateGroup}
                    disabled={!newGroup.name || !newGroup.slug || isCreating}
                  >
                    {isCreating && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isCreating ? "Creating..." : "Create Group"}
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
          description="Key metrics and group distribution"
          icon={Shield}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Total Groups"
            value={stats.total}
            subtitle="Across organization"
            icon={Folder}
            variant="default"
          />
          <KpiCard
            title="Active Groups"
            value={stats.active}
            subtitle="Currently enabled"
            icon={CheckCircle2}
            variant="success"
          />
          <KpiCard
            title="Total Members"
            value={stats.totalMembers}
            subtitle="Across all groups"
            icon={Users}
            variant="info"
          />
          <KpiCard
            title="Root Groups"
            value={stats.rootGroups}
            subtitle="Top-level units"
            icon={Building2}
            variant="warning"
          />
        </div>
      </section>

      {/* ==========================================================================
          SEARCH SECTION
          ========================================================================== */}
      <section className="space-y-4">
        <SectionHeader
          title="Group Directory"
          description="Search and filter groups"
          icon={Search}
        />

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search groups by name, slug, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
        </div>
      </section>

      {/* ==========================================================================
          MAIN CONTENT SECTION
          ========================================================================== */}
      <section className="pb-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Group List */}
          <div className="xl:col-span-1">
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">
                  Groups ({mockGroups.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <GroupList
                  groups={mockGroups}
                  selectedGroupId={selectedGroup?.id || null}
                  onSelectGroup={setSelectedGroup}
                  searchQuery={searchQuery}
                />
              </CardContent>
            </Card>
          </div>

          {/* Detail Panel */}
          <div className="xl:col-span-3">
            <GroupDetailPanel
              group={selectedGroup}
              allGroups={mockGroups}
              onClose={() => setSelectedGroup(null)}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
