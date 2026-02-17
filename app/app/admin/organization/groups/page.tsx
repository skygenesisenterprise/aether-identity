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
  Filter,
  RefreshCw,
  MoreHorizontal,
  Eye,
  Download,
  ChevronDown,
  ChevronUp,
  FolderTree,
  FileText,
  ShieldAlert,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dashboard/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/dashboard/ui/table";
import { Input } from "@/components/dashboard/ui/input";
import { Textarea } from "@/components/dashboard/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/dashboard/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/dashboard/ui/tabs";

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
// BADGE COMPONENTS
// ============================================================================

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
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        bgColor,
        color,
        borderColor,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
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
// GROUP DETAILS DIALOG
// ============================================================================

interface GroupDetailsDialogProps {
  group: OrganizationGroup | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allGroups: OrganizationGroup[];
}

function GroupDetailsDialog({
  group,
  open,
  onOpenChange,
  allGroups,
}: GroupDetailsDialogProps) {
  const [activeTab, setActiveTab] = React.useState<
    "overview" | "permissions" | "members" | "inheritance"
  >("overview");

  if (!group) return null;

  const parentName = getParentGroupName(group.parentGroupId, allGroups);
  const inheritedPermissions = getInheritedPermissions(group, allGroups);
  const directPermissions = group.permissions;

  const initials = group.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            Group Details
          </DialogTitle>
          <DialogDescription>
            Detailed information about the organizational group and its
            configuration.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Group Info Header */}
          <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border">
            <div className="h-12 w-12 rounded-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-bold text-primary border border-primary/20">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{group.name}</h3>
                <StatusBadge status={group.status} />
              </div>
              <p className="text-sm text-muted-foreground font-mono">
                {group.slug}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground">
                  {group.membersCount} members
                </span>
                {parentName && (
                  <>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">
                      Child of {parentName}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-mono">
                {group.id}
              </p>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(v) =>
              setActiveTab(
                v as "overview" | "permissions" | "members" | "inheritance",
              )
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="text-xs">
                <Info className="h-3.5 w-3.5 mr-1.5" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="permissions" className="text-xs">
                <Shield className="h-3.5 w-3.5 mr-1.5" />
                Permissions
              </TabsTrigger>
              <TabsTrigger value="members" className="text-xs">
                <Users className="h-3.5 w-3.5 mr-1.5" />
                Members
              </TabsTrigger>
              <TabsTrigger value="inheritance" className="text-xs">
                <Layers className="h-3.5 w-3.5 mr-1.5" />
                Inheritance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              {/* General Information */}
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5" />
                  General Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Name</span>
                    <p className="font-medium">{group.name}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Slug</span>
                    <p className="font-mono text-xs bg-muted px-2 py-1 rounded inline-block">
                      {group.slug}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Status</span>
                    <div>
                      <StatusBadge status={group.status} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Members</span>
                    <p className="font-medium">{group.membersCount}</p>
                  </div>
                </div>
              </section>

              {/* Description */}
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

              {/* Hierarchy */}
              <section className="pt-4 border-t">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                  <Link2 className="h-3.5 w-3.5" />
                  Hierarchy
                </h4>
                <div className="p-3 rounded-lg border bg-muted/30">
                  {parentName ? (
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Parent Group: <strong>{parentName}</strong>
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      This is a root-level group with no parent
                    </p>
                  )}
                </div>
              </section>

              {/* Timestamps */}
              <section className="pt-4 border-t">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  Timestamps
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Created</span>
                    <p className="font-medium">
                      {new Date(group.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Last Updated</span>
                    <p className="font-medium">
                      {formatRelativeTime(group.updatedAt)}
                    </p>
                  </div>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-4 mt-4">
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5" />
                  Direct Permissions ({directPermissions.length})
                </h4>
                {directPermissions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {directPermissions.map((permission) => (
                      <PermissionBadge
                        key={permission}
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

              <div className="pt-4 border-t">
                <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors border border-dashed">
                  <ShieldCheck className="h-4 w-4" />
                  Manage Permissions
                </button>
              </div>
            </TabsContent>

            <TabsContent value="members" className="space-y-4 mt-4">
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
            </TabsContent>

            <TabsContent value="inheritance" className="space-y-4 mt-4">
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
                      <PermissionBadge
                        key={permission}
                        permission={permission}
                      />
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
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// DELETE GROUP DIALOG
// ============================================================================

interface DeleteGroupDialogProps {
  group: OrganizationGroup | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

function DeleteGroupDialog({
  group,
  open,
  onOpenChange,
  onConfirm,
}: DeleteGroupDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onConfirm();
    setIsDeleting(false);
    onOpenChange(false);
  };

  if (!group) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <ShieldAlert className="h-5 w-5" />
            Delete Group
          </DialogTitle>
          <DialogDescription>
            This action will permanently delete the group &quot;{group.name}
            &quot;.
            {group.membersCount > 0 && (
              <span className="block mt-2">
                This group has {group.membersCount} member
                {group.membersCount !== 1 ? "s" : ""} who will be affected.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Warning</p>
              <p className="text-xs text-red-600 mt-1">
                This action cannot be undone. All permissions and configurations
                associated with this group will be permanently removed.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Group
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function GroupsPage() {
  const [groups, setGroups] = useState<OrganizationGroup[]>(mockGroups);
  const [selectedGroup, setSelectedGroup] = useState<OrganizationGroup | null>(
    null,
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    OrganizationGroup["status"] | "all"
  >("all");
  const [hierarchyFilter, setHierarchyFilter] = useState<
    "all" | "root" | "child"
  >("all");
  const [sortBy, setSortBy] = useState<"name" | "members" | "updated">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [newGroup, setNewGroup] = useState({
    name: "",
    slug: "",
    description: "",
    parentGroupId: "none",
  });

  // Statistics
  const stats = useMemo(() => {
    const total = groups.length;
    const active = groups.filter((g) => g.status === "active").length;
    const inactive = groups.filter((g) => g.status === "inactive").length;
    const totalMembers = groups.reduce((sum, g) => sum + g.membersCount, 0);
    const rootGroups = groups.filter((g) => !g.parentGroupId).length;

    return {
      total,
      active,
      inactive,
      totalMembers,
      rootGroups,
    };
  }, [groups]);

  // Filtered and sorted groups
  const filteredGroups = useMemo(() => {
    let result = groups.filter((group) => {
      const matchesSearch =
        searchQuery === "" ||
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || group.status === statusFilter;

      const matchesHierarchy =
        hierarchyFilter === "all" ||
        (hierarchyFilter === "root" && !group.parentGroupId) ||
        (hierarchyFilter === "child" && group.parentGroupId);

      return matchesSearch && matchesStatus && matchesHierarchy;
    });

    // Sort
    result = [...result].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "members":
          comparison = a.membersCount - b.membersCount;
          break;
        case "updated":
          comparison =
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [groups, searchQuery, statusFilter, hierarchyFilter, sortBy, sortOrder]);

  // Handlers
  const handleViewDetails = (group: OrganizationGroup) => {
    setSelectedGroup(group);
    setIsDetailsOpen(true);
  };

  const handleDeleteGroup = (group: OrganizationGroup) => {
    setSelectedGroup(group);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedGroup) {
      setGroups((prev) => prev.filter((g) => g.id !== selectedGroup.id));
    }
  };

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

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setHierarchyFilter("all");
  };

  const hasActiveFilters =
    searchQuery || statusFilter !== "all" || hierarchyFilter !== "all";

  return (
    <div className="space-y-6 text-foreground">
      {/* =========================================================================
          HEADER SECTION
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-card-foreground">
                Identity Organization Groups
              </h1>
              <Badge variant="secondary" className="text-xs">
                {stats.total} total
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Manage organizational groups, their hierarchy, permissions, and
              member assignments. Configure inheritance and access control for
              your identity infrastructure.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")}
              />
              Refresh
            </Button>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Group
                </Button>q
              </DialogTrigger>
              <DialogContent className="sm:max-w-125">
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
                        {groups
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
                    {isCreating && (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    )}
                    {isCreating ? "Creating..." : "Create Group"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* =========================================================================
          KPI SECTION
          ========================================================================= */}
      <section className="space-y-4">
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

      {/* =========================================================================
          FILTERS & SEARCH SECTION
          ========================================================================= */}
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
                placeholder="Search by name, slug, or description..."
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

              <Select
                value={hierarchyFilter}
                onValueChange={(v) =>
                  setHierarchyFilter(v as typeof hierarchyFilter)
                }
              >
                <SelectTrigger className="w-35">
                  <SelectValue placeholder="Hierarchy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                  <SelectItem value="root">Root Groups</SelectItem>
                  <SelectItem value="child">Child Groups</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2 ml-auto">
                <Select
                  value={sortBy}
                  onValueChange={(v) => setSortBy(v as typeof sortBy)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="members">Members</SelectItem>
                    <SelectItem value="updated">Last Updated</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                >
                  {sortOrder === "asc" ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Active Filters Indicator */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Showing {filteredGroups.length} of {groups.length} groups
                </span>
                <button
                  onClick={clearFilters}
                  className="ml-auto text-xs text-primary hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* =========================================================================
          GROUPS TABLE SECTION
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Group Directory
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Card className="border-border overflow-hidden">
          {filteredGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Folder className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                No groups found
              </h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                {hasActiveFilters
                  ? "Try adjusting your search or filters to find what you&apos;re looking for."
                  : "Create your first group to get started."}
              </p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={clearFilters}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Group</TableHead>
                    <TableHead>Hierarchy</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-25">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGroups.map((group) => (
                    <TableRow
                      key={group.id}
                      className="cursor-pointer"
                      onClick={() => handleViewDetails(group)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-xs font-semibold">
                            <Folder className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{group.name}</p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {group.slug}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {group.parentGroupId ? (
                          <div className="flex items-center gap-1.5">
                            <FolderTree className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm">
                              {getParentGroupName(group.parentGroupId, groups)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground italic">
                            Root group
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm">{group.membersCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {group.permissions.slice(0, 2).map((permission) => (
                            <PermissionBadge
                              key={permission}
                              permission={permission}
                            />
                          ))}
                          {group.permissions.length > 2 && (
                            <span className="text-[10px] text-muted-foreground">
                              +{group.permissions.length - 2}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {formatRelativeTime(group.updatedAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={group.status} />
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleViewDetails(group)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Group
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <User className="h-4 w-4 mr-2" />
                              Manage Members
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteGroup(group)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Group
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </section>

      {/* =========================================================================
          REPORTS SECTION
          ========================================================================= */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Reports & Analytics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-dashed border-2 border-border/50 bg-muted/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Group Report</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Generate detailed group structure and membership reports.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4"
                disabled
              >
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>

          <Card className="border-dashed border-2 border-border/50 bg-muted/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Permission Audit</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Analyze permission distribution and inheritance across
                    groups.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4"
                disabled
              >
                <Eye className="h-4 w-4 mr-2" />
                View Analysis
              </Button>
            </CardContent>
          </Card>

          <Card className="border-dashed border-2 border-border/50 bg-muted/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <FolderTree className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Hierarchy View</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Visualize group hierarchy and inheritance relationships.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4"
                disabled
              >
                <Eye className="h-4 w-4 mr-2" />
                View Hierarchy
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* =========================================================================
          DIALOGS
          ========================================================================= */}
      <GroupDetailsDialog
        group={selectedGroup}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        allGroups={groups}
      />

      <DeleteGroupDialog
        group={selectedGroup}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
