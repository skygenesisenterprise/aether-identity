"use client";

import { useState } from "react";
import {
  Shield,
  Users,
  Layers,
  Building2,
  Search,
  Filter,
  Plus,
  Copy,
  Trash2,
  MoreHorizontal,
  X,
  Eye,
  Globe,
  Server,
  FolderTree,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface Permission {
  id: string;
  resource: string;
  actions: ("read" | "write" | "delete" | "manage")[];
  scope: string;
}

interface Assignment {
  id: string;
  type: "user" | "group" | "service";
  name: string;
  email?: string;
  avatar?: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  scope: "organization" | "environment";
  scopeTarget?: string;
  permissions: Permission[];
  assignments: Assignment[];
  inheritedFrom?: string;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock Data
const mockRoles: Role[] = [
  {
    id: "role-admin",
    name: "Organization Admin",
    description: "Full administrative access to the entire organization",
    scope: "organization",
    permissions: [
      {
        id: "perm-1",
        resource: "users",
        actions: ["read", "write", "delete", "manage"],
        scope: "*",
      },
      {
        id: "perm-2",
        resource: "roles",
        actions: ["read", "write", "delete", "manage"],
        scope: "*",
      },
      {
        id: "perm-3",
        resource: "settings",
        actions: ["read", "write", "manage"],
        scope: "*",
      },
    ],
    assignments: [
      {
        id: "asgn-1",
        type: "user",
        name: "John Smith",
        email: "john@acme.com",
      },
      {
        id: "asgn-2",
        type: "user",
        name: "Sarah Jones",
        email: "sarah@acme.com",
      },
    ],
    isSystem: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "role-dev",
    name: "Developer",
    description: "Standard development permissions across environments",
    scope: "environment",
    scopeTarget: "staging,development",
    permissions: [
      {
        id: "perm-4",
        resource: "services",
        actions: ["read", "write"],
        scope: "staging,development",
      },
      {
        id: "perm-5",
        resource: "deployments",
        actions: ["read", "write"],
        scope: "staging,development",
      },
      {
        id: "perm-6",
        resource: "logs",
        actions: ["read"],
        scope: "staging,development",
      },
    ],
    assignments: [
      { id: "asgn-3", type: "group", name: "Engineering Team" },
      {
        id: "asgn-4",
        type: "user",
        name: "Michael Chen",
        email: "michael@acme.com",
      },
      {
        id: "asgn-5",
        type: "user",
        name: "Emily Davis",
        email: "emily@acme.com",
      },
    ],
    isSystem: false,
    createdAt: "2023-06-15T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "role-viewer",
    name: "Read Only",
    description: "View-only access for auditors and stakeholders",
    scope: "organization",
    permissions: [
      { id: "perm-7", resource: "users", actions: ["read"], scope: "*" },
      { id: "perm-8", resource: "services", actions: ["read"], scope: "*" },
      { id: "perm-9", resource: "audit", actions: ["read"], scope: "*" },
    ],
    assignments: [
      { id: "asgn-6", type: "group", name: "Audit Team" },
      {
        id: "asgn-7",
        type: "user",
        name: "Lisa Brown",
        email: "lisa@acme.com",
      },
    ],
    isSystem: true,
    createdAt: "2023-03-01T00:00:00Z",
    updatedAt: "2023-03-01T00:00:00Z",
  },
  {
    id: "role-ops",
    name: "Operations",
    description: "Production operations and incident response",
    scope: "environment",
    scopeTarget: "production,staging",
    permissions: [
      {
        id: "perm-10",
        resource: "services",
        actions: ["read", "write", "manage"],
        scope: "production,staging",
      },
      {
        id: "perm-11",
        resource: "deployments",
        actions: ["read", "write"],
        scope: "production,staging",
      },
      {
        id: "perm-12",
        resource: "alerts",
        actions: ["read", "write", "manage"],
        scope: "production,staging",
      },
    ],
    assignments: [{ id: "asgn-8", type: "group", name: "SRE Team" }],
    isSystem: false,
    createdAt: "2023-08-20T00:00:00Z",
    updatedAt: "2023-11-05T00:00:00Z",
  },
  {
    id: "role-security",
    name: "Security Admin",
    description: "Security policy and compliance management",
    scope: "organization",
    permissions: [
      {
        id: "perm-13",
        resource: "policies",
        actions: ["read", "write", "delete", "manage"],
        scope: "*",
      },
      {
        id: "perm-14",
        resource: "audit",
        actions: ["read", "manage"],
        scope: "*",
      },
      {
        id: "perm-15",
        resource: "secrets",
        actions: ["read", "write", "manage"],
        scope: "*",
      },
    ],
    assignments: [
      {
        id: "asgn-9",
        type: "user",
        name: "Robert Taylor",
        email: "robert@acme.com",
      },
    ],
    isSystem: false,
    createdAt: "2023-09-10T00:00:00Z",
    updatedAt: "2024-01-05T00:00:00Z",
  },
];

// Helper Components
function ScopeBadge({
  scope,
  target,
}: {
  scope: Role["scope"];
  target?: string;
}) {
  const Icon = scope === "organization" ? Building2 : Server;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium",
        scope === "organization"
          ? "bg-purple-500/10 text-purple-600"
          : "bg-blue-500/10 text-blue-600",
      )}
    >
      <Icon className="h-3 w-3" />
      {scope === "organization" ? "Organization" : `Env: ${target || "*"}`}
    </span>
  );
}

function PermissionBadge({ action }: { action: string }) {
  const colors: Record<string, string> = {
    read: "bg-slate-100 text-slate-700",
    write: "bg-blue-100 text-blue-700",
    delete: "bg-red-100 text-red-700",
    manage: "bg-purple-100 text-purple-700",
  };
  return (
    <span
      className={cn(
        "px-1.5 py-0.5 rounded text-[10px] font-medium uppercase",
        colors[action] || colors.read,
      )}
    >
      {action}
    </span>
  );
}

function AssignmentAvatar({ assignment }: { assignment: Assignment }) {
  const initials = assignment.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const icons = {
    user: Users,
    group: Layers,
    service: Server,
  };
  const Icon = icons[assignment.type];

  return (
    <div className="flex items-center gap-2">
      <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground">
        {initials}
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-sm text-foreground">{assignment.name}</span>
        <Icon className="h-3 w-3 text-muted-foreground" />
      </div>
      {assignment.email && (
        <span className="text-xs text-muted-foreground">
          {assignment.email}
        </span>
      )}
    </div>
  );
}

// Role Table Component
function RoleTable({
  roles,
  selectedRole,
  onSelectRole,
}: {
  roles: Role[];
  selectedRole: Role | null;
  onSelectRole: (role: Role | null) => void;
}) {
  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="border-b">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground w-8">
                <input type="checkbox" className="rounded border-input" />
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Role
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Scope
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Permissions
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Assigned
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground w-10">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {roles.map((role) => (
              <tr
                key={role.id}
                className={cn(
                  "transition-colors cursor-pointer hover:bg-muted/50",
                  selectedRole?.id === role.id && "bg-muted",
                )}
                onClick={() => onSelectRole(role)}
              >
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" className="rounded border-input" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">
                          {role.name}
                        </p>
                        {role.isSystem && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700">
                            System
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {role.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <ScopeBadge scope={role.scope} target={role.scopeTarget} />
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-muted-foreground">
                    {role.permissions.length} permissions
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {role.assignments.length}
                    </span>
                  </div>
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

      {roles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Shield className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">
            No roles found
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Try adjusting your filters or create a new role to get started.
          </p>
        </div>
      )}
    </div>
  );
}

// Role Detail Panel Component
function RoleDetailPanel({
  role,
  onClose,
}: {
  role: Role | null;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<
    "permissions" | "assignments" | "preview"
  >("permissions");

  if (!role) {
    return (
      <div className="border rounded-lg bg-card p-6 h-full">
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
          <Shield className="h-12 w-12 mb-4 opacity-50" />
          <p className="text-sm">Select a role to view details</p>
        </div>
      </div>
    );
  }

  const groupedPermissions = role.permissions.reduce(
    (acc, perm) => {
      if (!acc[perm.resource]) acc[perm.resource] = [];
      acc[perm.resource].push(perm);
      return acc;
    },
    {} as Record<string, Permission[]>,
  );

  return (
    <div className="border rounded-lg bg-card overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between px-4 py-4 border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{role.name}</h3>
              {role.isSystem && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700">
                  System
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{role.id}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-muted rounded transition-colors"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Role Info */}
      <div className="px-4 py-3 border-b space-y-2">
        <p className="text-sm text-muted-foreground">{role.description}</p>
        <div className="flex items-center gap-2">
          <ScopeBadge scope={role.scope} target={role.scopeTarget} />
          <span className="text-xs text-muted-foreground">
            Updated {new Date(role.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {[
          {
            id: "permissions",
            label: "Permissions",
            count: role.permissions.length,
          },
          {
            id: "assignments",
            label: "Assignments",
            count: role.assignments.length,
          },
          { id: "preview", label: "Effective Access" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-muted">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "permissions" && (
          <div className="space-y-4">
            {Object.entries(groupedPermissions).map(([resource, perms]) => (
              <div key={resource} className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                  <FolderTree className="h-3 w-3" />
                  {resource}
                </h4>
                <div className="space-y-2">
                  {perms.map((perm) => (
                    <div
                      key={perm.id}
                      className="flex items-center justify-between p-2 rounded-lg border bg-card"
                    >
                      <div className="flex items-center gap-2">
                        {perm.actions.map((action) => (
                          <PermissionBadge key={action} action={action} />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">
                        {perm.scope}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "assignments" && (
          <div className="space-y-3">
            {role.assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <AssignmentAvatar assignment={assignment} />
                <button className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border border-dashed rounded-lg hover:bg-muted transition-colors text-muted-foreground">
              <Plus className="h-4 w-4" />
              Add Assignment
            </button>
          </div>
        )}

        {activeTab === "preview" && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-start gap-2">
                <Eye className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Effective Access Preview
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    This shows what users with this role can do based on current
                    permissions and scope.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Accessible Resources
              </h4>
              {Object.entries(groupedPermissions).map(([resource, perms]) => {
                const allActions = perms.flatMap((p) => p.actions);
                const uniqueActions = [...new Set(allActions)];
                return (
                  <div key={resource} className="p-3 rounded-lg border bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{resource}</span>
                      <ScopeBadge
                        scope={role.scope}
                        target={role.scopeTarget}
                      />
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {uniqueActions.map((action) => (
                        <PermissionBadge key={action} action={action} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t space-y-2">
        {!role.isSystem && (
          <>
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
              <Copy className="h-4 w-4" />
              Duplicate Role
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-destructive/20">
              <Trash2 className="h-4 w-4" />
              Delete Role
            </button>
          </>
        )}
        {role.isSystem && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700">
              System roles cannot be modified or deleted. They are maintained by
              the platform.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Main Page Component
export default function RbacPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [scopeFilter, setScopeFilter] = useState<Role["scope"] | "all">("all");

  const filteredRoles = mockRoles.filter((role) => {
    const matchesSearch =
      searchQuery === "" ||
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesScope = scopeFilter === "all" || role.scope === scopeFilter;

    return matchesSearch && matchesScope;
  });

  const stats = {
    total: mockRoles.length,
    orgScoped: mockRoles.filter((r) => r.scope === "organization").length,
    envScoped: mockRoles.filter((r) => r.scope === "environment").length,
    totalAssignments: mockRoles.reduce(
      (acc, r) => acc + r.assignments.length,
      0,
    ),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-card-foreground">RBAC</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Define and manage role-based access control. Roles combine
            permissions with scope to determine what users can do and where they
            can do it.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
            <Globe className="h-4 w-4" />
            Import
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" />
            Create Role
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border bg-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Roles</p>
            </div>
            <Shield className="h-8 w-8 text-muted-foreground/50" />
          </div>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-purple-600">
                {stats.orgScoped}
              </p>
              <p className="text-xs text-muted-foreground">Org Scoped</p>
            </div>
            <Building2 className="h-8 w-8 text-purple-500/50" />
          </div>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-blue-600">
                {stats.envScoped}
              </p>
              <p className="text-xs text-muted-foreground">Env Scoped</p>
            </div>
            <Server className="h-8 w-8 text-blue-500/50" />
          </div>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-emerald-600">
                {stats.totalAssignments}
              </p>
              <p className="text-xs text-muted-foreground">Assignments</p>
            </div>
            <Users className="h-8 w-8 text-emerald-500/50" />
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={scopeFilter}
            onChange={(e) =>
              setScopeFilter(e.target.value as Role["scope"] | "all")
            }
            className="px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Scopes</option>
            <option value="organization">Organization</option>
            <option value="environment">Environment</option>
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
          <RoleTable
            roles={filteredRoles}
            selectedRole={selectedRole}
            onSelectRole={setSelectedRole}
          />
        </div>
        <div className="lg:col-span-1">
          <RoleDetailPanel
            role={selectedRole}
            onClose={() => setSelectedRole(null)}
          />
        </div>
      </div>
    </div>
  );
}
