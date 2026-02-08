"use client";

import { useState } from "react";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  X,
  ChevronUp,
  ChevronDown,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Server,
  Users,
  Eye,
  Play,
  Copy,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/dashboard/ui/switch";

// Types

type PolicyStatus = "enabled" | "disabled";
type PolicyEffect = "allow" | "deny" | "override";
type ConditionOperator = "and" | "or";

interface Condition {
  id: string;
  attribute: string;
  operator: string;
  value: string | string[] | number | boolean;
}

interface ConditionGroup {
  operator: ConditionOperator;
  conditions: (Condition | ConditionGroup)[];
}

interface PolicyScope {
  targetRoles?: string[];
  targetIdentities?: string[];
  targetResources?: string[];
  exclusions?: {
    roles?: string[];
    identities?: string[];
  };
}

interface Policy {
  id: string;
  name: string;
  description: string;
  status: PolicyStatus;
  priority: number;
  effect: PolicyEffect;
  conditions: ConditionGroup;
  scope: PolicyScope;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  evaluationCount: number;
}

// Mock Data
const mockPolicies: Policy[] = [
  {
    id: "pol-1",
    name: "Production Admin Access",
    description:
      "Allow admin access to production only during business hours from corporate network",
    status: "enabled",
    priority: 1,
    effect: "allow",
    conditions: {
      operator: "and",
      conditions: [
        {
          id: "c1",
          attribute: "environment.type",
          operator: "is",
          value: "production",
        },
        {
          id: "c2",
          attribute: "user.role",
          operator: "contains",
          value: "admin",
        },
        {
          operator: "or",
          conditions: [
            {
              id: "c3",
              attribute: "request.time",
              operator: "between",
              value: "09:00-17:00",
            },
            {
              id: "c4",
              attribute: "request.ip",
              operator: "in_range",
              value: "10.0.0.0/8",
            },
          ],
        },
      ],
    },
    scope: {
      targetRoles: ["role-admin", "role-security"],
      targetResources: ["services", "deployments"],
    },
    createdBy: "System",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    evaluationCount: 15234,
  },
  {
    id: "pol-2",
    name: "Off-Hours Production Block",
    description:
      "Explicitly deny production access outside business hours for non-oncall users",
    status: "enabled",
    priority: 2,
    effect: "deny",
    conditions: {
      operator: "and",
      conditions: [
        {
          id: "c5",
          attribute: "environment.type",
          operator: "is",
          value: "production",
        },
        {
          id: "c6",
          attribute: "request.time",
          operator: "not_between",
          value: "09:00-17:00",
        },
        { id: "c7", attribute: "user.oncall", operator: "is", value: false },
      ],
    },
    scope: {
      targetResources: ["*"],
      exclusions: {
        roles: ["role-breakglass"],
      },
    },
    createdBy: "Robert Taylor",
    createdAt: "2023-06-15T00:00:00Z",
    updatedAt: "2023-12-01T14:22:00Z",
    evaluationCount: 8932,
  },
  {
    id: "pol-3",
    name: "Staging Access for Engineering",
    description: "Allow engineering team access to staging environments",
    status: "enabled",
    priority: 3,
    effect: "allow",
    conditions: {
      operator: "and",
      conditions: [
        {
          id: "c8",
          attribute: "environment.type",
          operator: "is",
          value: "staging",
        },
        {
          id: "c9",
          attribute: "user.department",
          operator: "is",
          value: "engineering",
        },
      ],
    },
    scope: {
      targetRoles: ["role-dev", "role-ops"],
      targetResources: ["services", "logs", "deployments"],
    },
    createdBy: "Sarah Jones",
    createdAt: "2023-08-20T00:00:00Z",
    updatedAt: "2024-01-10T09:15:00Z",
    evaluationCount: 45678,
  },
  {
    id: "pol-4",
    name: "External IP Restriction",
    description: "Block access from unknown IP ranges for sensitive resources",
    status: "disabled",
    priority: 4,
    effect: "deny",
    conditions: {
      operator: "and",
      conditions: [
        {
          id: "c10",
          attribute: "request.ip",
          operator: "not_in",
          value: ["10.0.0.0/8", "172.16.0.0/12"],
        },
        {
          id: "c11",
          attribute: "resource.classification",
          operator: "is",
          value: "confidential",
        },
      ],
    },
    scope: {
      targetResources: ["secrets", "audit", "compliance"],
    },
    createdBy: "Security Team",
    createdAt: "2023-09-10T00:00:00Z",
    updatedAt: "2024-01-05T16:45:00Z",
    evaluationCount: 1234,
  },
  {
    id: "pol-5",
    name: "Break-Glass Emergency Access",
    description: "Override all restrictions for emergency response team",
    status: "enabled",
    priority: 0,
    effect: "override",
    conditions: {
      operator: "and",
      conditions: [
        {
          id: "c12",
          attribute: "user.role",
          operator: "is",
          value: "breakglass",
        },
        { id: "c13", attribute: "request.mfa", operator: "is", value: true },
      ],
    },
    scope: {
      targetRoles: ["role-breakglass"],
      targetResources: ["*"],
    },
    createdBy: "CISO",
    createdAt: "2023-03-01T00:00:00Z",
    updatedAt: "2023-03-01T00:00:00Z",
    evaluationCount: 12,
  },
  {
    id: "pol-6",
    name: "Audit Read Access",
    description: "Allow auditors read-only access during audit period",
    status: "enabled",
    priority: 5,
    effect: "allow",
    conditions: {
      operator: "and",
      conditions: [
        {
          id: "c14",
          attribute: "user.department",
          operator: "is",
          value: "audit",
        },
        {
          id: "c15",
          attribute: "request.action",
          operator: "is",
          value: "read",
        },
      ],
    },
    scope: {
      targetRoles: ["role-viewer"],
      targetResources: ["audit", "logs", "users"],
    },
    createdBy: "Lisa Brown",
    createdAt: "2023-11-15T00:00:00Z",
    updatedAt: "2023-12-20T11:30:00Z",
    evaluationCount: 5678,
  },
];

// Helper Components

function EffectBadge({ effect }: { effect: PolicyEffect }) {
  const config = {
    allow: {
      icon: ShieldCheck,
      label: "Allow",
      className: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    deny: {
      icon: ShieldX,
      label: "Deny",
      className: "bg-red-100 text-red-700 border-red-200",
    },
    override: {
      icon: ShieldAlert,
      label: "Override",
      className: "bg-amber-100 text-amber-700 border-amber-200",
    },
  };

  const { icon: Icon, label, className } = config[effect];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border",
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

function StatusBadge({ status }: { status: PolicyStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium",
        status === "enabled"
          ? "bg-emerald-100 text-emerald-700"
          : "bg-slate-100 text-slate-500",
      )}
    >
      {status === "enabled" ? (
        <ToggleRight className="h-3 w-3" />
      ) : (
        <ToggleLeft className="h-3 w-3" />
      )}
      {status === "enabled" ? "Enabled" : "Disabled"}
    </span>
  );
}

function PriorityIndicator({ priority }: { priority: number }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs font-mono text-muted-foreground w-5">
        #{priority}
      </span>
      <div className="flex flex-col">
        <button className="p-0.5 hover:bg-muted rounded">
          <ChevronUp className="h-3 w-3 text-muted-foreground" />
        </button>
        <button className="p-0.5 hover:bg-muted rounded">
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}

function ConditionPreview({ conditions }: { conditions: ConditionGroup }) {
  const renderCondition = (
    condition: Condition | ConditionGroup,
    depth = 0,
  ): string => {
    if ("operator" in condition && "conditions" in condition) {
      const subConditions = condition.conditions.map((c) =>
        renderCondition(c, depth + 1),
      );
      return `(${subConditions.join(` ${condition.operator.toUpperCase()} `)})`;
    }
    return `${condition.attribute} ${condition.operator} ${condition.value}`;
  };

  const summary = renderCondition(conditions);

  // Truncate for display
  const displaySummary =
    summary.length > 60 ? summary.slice(0, 60) + "..." : summary;

  return (
    <span className="text-xs text-muted-foreground font-mono truncate max-w-[250px] block">
      {displaySummary}
    </span>
  );
}

function HumanReadableCondition({
  conditions,
}: {
  conditions: ConditionGroup;
}) {
  const renderHumanReadable = (
    condition: Condition | ConditionGroup,
    isTopLevel = true,
  ): React.ReactNode => {
    if ("operator" in condition && "conditions" in condition) {
      return (
        <div
          className={cn(
            "space-y-2",
            !isTopLevel && "pl-4 border-l-2 border-muted ml-2",
          )}
        >
          {condition.conditions.map((c, idx) => (
            <div key={idx}>
              {idx > 0 && (
                <span className="text-xs font-semibold text-muted-foreground uppercase my-1 block">
                  {condition.operator}
                </span>
              )}
              {renderHumanReadable(c, false)}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 text-sm">
        <code className="px-1.5 py-0.5 bg-muted rounded text-xs">
          {condition.attribute}
        </code>
        <span className="text-muted-foreground">{condition.operator}</span>
        <code className="px-1.5 py-0.5 bg-muted rounded text-xs">
          {Array.isArray(condition.value)
            ? condition.value.join(", ")
            : String(condition.value)}
        </code>
      </div>
    );
  };

  return (
    <div className="p-3 bg-muted/50 rounded-lg">
      <p className="text-xs text-muted-foreground mb-2">
        This policy applies when:
      </p>
      {renderHumanReadable(conditions)}
    </div>
  );
}

// Components

function PoliciesHeader({
  onCreatePolicy,
  simulationMode,
  onToggleSimulation,
}: {
  onCreatePolicy: () => void;
  simulationMode: boolean;
  onToggleSimulation: () => void;
}) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-card-foreground">
          Policies
        </h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          Define conditional access rules that extend RBAC. Policies answer:{" "}
          <em>under which conditions</em> can access be granted or denied.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSimulation}
          className={cn(
            "flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg transition-colors",
            simulationMode
              ? "bg-purple-50 border-purple-200 text-purple-700"
              : "hover:bg-muted",
          )}
        >
          <Play className="h-4 w-4" />
          {simulationMode ? "Simulation On" : "Simulation"}
        </button>
        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
          <Eye className="h-4 w-4" />
          Eval Order
        </button>
        <button
          onClick={onCreatePolicy}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Policy
        </button>
      </div>
    </div>
  );
}

function PoliciesStats({ policies }: { policies: Policy[] }) {
  const stats = {
    total: policies.length,
    enabled: policies.filter((p) => p.status === "enabled").length,
    deny: policies.filter((p) => p.effect === "deny").length,
    override: policies.filter((p) => p.effect === "override").length,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-4 rounded-lg border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-semibold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total Policies</p>
          </div>
          <Shield className="h-8 w-8 text-muted-foreground/50" />
        </div>
      </div>
      <div className="p-4 rounded-lg border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-semibold text-emerald-600">
              {stats.enabled}
            </p>
            <p className="text-xs text-muted-foreground">Enabled</p>
          </div>
          <CheckCircle2 className="h-8 w-8 text-emerald-500/50" />
        </div>
      </div>
      <div className="p-4 rounded-lg border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-semibold text-red-600">{stats.deny}</p>
            <p className="text-xs text-muted-foreground">Deny Rules</p>
          </div>
          <ShieldX className="h-8 w-8 text-red-500/50" />
        </div>
      </div>
      <div className="p-4 rounded-lg border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-semibold text-amber-600">
              {stats.override}
            </p>
            <p className="text-xs text-muted-foreground">Overrides</p>
          </div>
          <AlertTriangle className="h-8 w-8 text-amber-500/50" />
        </div>
      </div>
    </div>
  );
}

function PoliciesFilterBar({
  searchQuery,
  onSearchChange,
  effectFilter,
  onEffectFilterChange,
  statusFilter,
  onStatusFilterChange,
}: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  effectFilter: PolicyEffect | "all";
  onEffectFilterChange: (effect: PolicyEffect | "all") => void;
  statusFilter: PolicyStatus | "all";
  onStatusFilterChange: (status: PolicyStatus | "all") => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="relative flex-1 max-w-md w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search policies..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="flex items-center gap-2">
        <select
          value={effectFilter}
          onChange={(e) =>
            onEffectFilterChange(e.target.value as PolicyEffect | "all")
          }
          className="px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Effects</option>
          <option value="allow">Allow</option>
          <option value="deny">Deny</option>
          <option value="override">Override</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) =>
            onStatusFilterChange(e.target.value as PolicyStatus | "all")
          }
          className="px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Status</option>
          <option value="enabled">Enabled</option>
          <option value="disabled">Disabled</option>
        </select>
        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
          <Filter className="h-4 w-4" />
          More Filters
        </button>
      </div>
    </div>
  );
}

function PoliciesTable({
  policies,
  selectedPolicy,
  onSelectPolicy,
  onToggleStatus,
}: {
  policies: Policy[];
  selectedPolicy: Policy | null;
  onSelectPolicy: (policy: Policy | null) => void;
  onToggleStatus: (policyId: string) => void;
}) {
  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="border-b">
              <th className="px-3 py-3 text-left font-medium text-muted-foreground w-16">
                Priority
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Policy
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Effect
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Conditions
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground w-10">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {policies.map((policy) => (
              <tr
                key={policy.id}
                className={cn(
                  "transition-colors cursor-pointer hover:bg-muted/50",
                  selectedPolicy?.id === policy.id && "bg-muted",
                  policy.status === "disabled" && "opacity-60",
                )}
                onClick={() => onSelectPolicy(policy)}
              >
                <td className="px-3 py-3">
                  <PriorityIndicator priority={policy.priority} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center",
                        policy.effect === "deny"
                          ? "bg-red-500/10"
                          : policy.effect === "override"
                            ? "bg-amber-500/10"
                            : "bg-emerald-500/10",
                      )}
                    >
                      {policy.effect === "deny" ? (
                        <ShieldX className="h-4 w-4 text-red-600" />
                      ) : policy.effect === "override" ? (
                        <ShieldAlert className="h-4 w-4 text-amber-600" />
                      ) : (
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      )}
                    </div>
                    <div>
                      <p
                        className={cn(
                          "font-medium",
                          policy.status === "disabled" &&
                            "line-through text-muted-foreground",
                        )}
                      >
                        {policy.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {policy.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <EffectBadge effect={policy.effect} />
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <Switch
                    checked={policy.status === "enabled"}
                    onCheckedChange={() => onToggleStatus(policy.id)}
                  />
                </td>
                <td className="px-4 py-3">
                  <ConditionPreview conditions={policy.conditions} />
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

      {policies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Shield className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">
            No policies found
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Try adjusting your filters or create a new policy to get started.
          </p>
        </div>
      )}
    </div>
  );
}

function PolicyDetailPanel({
  policy,
  onClose,
  onToggleStatus,
}: {
  policy: Policy | null;
  onClose: () => void;
  onToggleStatus: (policyId: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<
    "conditions" | "scope" | "evaluation" | "history"
  >("conditions");

  if (!policy) {
    return (
      <div className="border rounded-lg bg-card p-6 h-full">
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
          <Shield className="h-12 w-12 mb-4 opacity-50" />
          <p className="text-sm">Select a policy to view details</p>
          <p className="text-xs mt-2 max-w-[200px]">
            Policies define conditional access rules that extend RBAC
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-card overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between px-4 py-4 border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center",
              policy.effect === "deny"
                ? "bg-red-500/10"
                : policy.effect === "override"
                  ? "bg-amber-500/10"
                  : "bg-emerald-500/10",
            )}
          >
            {policy.effect === "deny" ? (
              <ShieldX className="h-5 w-5 text-red-600" />
            ) : policy.effect === "override" ? (
              <ShieldAlert className="h-5 w-5 text-amber-600" />
            ) : (
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3
                className={cn(
                  "font-semibold",
                  policy.status === "disabled" &&
                    "line-through text-muted-foreground",
                )}
              >
                {policy.name}
              </h3>
              {policy.effect === "override" && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700">
                  Override
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{policy.id}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-muted rounded transition-colors"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Policy Info */}
      <div className="px-4 py-3 border-b space-y-2">
        <p className="text-sm text-muted-foreground">{policy.description}</p>
        <div className="flex items-center gap-3 flex-wrap">
          <StatusBadge status={policy.status} />
          <EffectBadge effect={policy.effect} />
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Priority #{policy.priority}
          </span>
          <span className="text-xs text-muted-foreground">
            Updated {new Date(policy.updatedAt).toLocaleDateString()}
          </span>
        </div>
        {policy.effect === "override" && (
          <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-50 border border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700">
              This is an override policy. It bypasses normal evaluation rules
              and should be used sparingly.
            </p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {[
          { id: "conditions", label: "Conditions" },
          { id: "scope", label: "Scope" },
          { id: "evaluation", label: "Evaluation" },
          { id: "history", label: "History" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "flex-1 px-3 py-2 text-sm font-medium border-b-2 transition-colors",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "conditions" && (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Eye className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Condition Logic
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Conditions are evaluated in order. All AND conditions must
                    match, any OR condition can match.
                  </p>
                </div>
              </div>
            </div>

            <HumanReadableCondition conditions={policy.conditions} />

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Raw Conditions
              </h4>
              <div className="p-3 bg-muted rounded-lg font-mono text-xs overflow-x-auto">
                <pre>{JSON.stringify(policy.conditions, null, 2)}</pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === "scope" && (
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Applies To
              </h4>

              {policy.scope.targetRoles &&
                policy.scope.targetRoles.length > 0 && (
                  <div className="p-3 rounded-lg border bg-card">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Target Roles</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {policy.scope.targetRoles.map((role) => (
                        <span
                          key={role}
                          className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-700"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {policy.scope.targetIdentities &&
                policy.scope.targetIdentities.length > 0 && (
                  <div className="p-3 rounded-lg border bg-card">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Target Identities
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {policy.scope.targetIdentities.map((id) => (
                        <span
                          key={id}
                          className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700"
                        >
                          {id}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {policy.scope.targetResources &&
                policy.scope.targetResources.length > 0 && (
                  <div className="p-3 rounded-lg border bg-card">
                    <div className="flex items-center gap-2 mb-2">
                      <Server className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Target Resources
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {policy.scope.targetResources.map((resource) => (
                        <span
                          key={resource}
                          className="px-2 py-1 rounded text-xs bg-emerald-100 text-emerald-700"
                        >
                          {resource}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {policy.scope.exclusions && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-red-600">
                  Exclusions
                </h4>

                {policy.scope.exclusions.roles &&
                  policy.scope.exclusions.roles.length > 0 && (
                    <div className="p-3 rounded-lg border bg-red-50 border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldX className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium text-red-900">
                          Excluded Roles
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {policy.scope.exclusions.roles.map((role) => (
                          <span
                            key={role}
                            className="px-2 py-1 rounded text-xs bg-red-100 text-red-700"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>
        )}

        {activeTab === "evaluation" && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="flex items-start gap-2">
                <Play className="h-4 w-4 text-emerald-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-emerald-900">
                    Evaluation Flow
                  </p>
                  <p className="text-xs text-emerald-700 mt-1">
                    This policy is evaluated at priority #{policy.priority}.
                    DENY policies are checked first.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Example Scenarios
              </h4>

              <div className="p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium">Scenario: Match</span>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>Environment: production</p>
                  <p>User Role: admin</p>
                  <p>Time: 14:30 (within business hours)</p>
                  <p className="text-emerald-600 font-medium mt-2">
                    Result: ALLOW
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldX className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">
                    Scenario: No Match
                  </span>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>Environment: development</p>
                  <p>User Role: admin</p>
                  <p>Time: 14:30</p>
                  <p className="text-red-600 font-medium mt-2">
                    Result: DENY (environment.type != production)
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg border bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Evaluation Count
                </span>
                <span className="text-sm font-semibold">
                  {policy.evaluationCount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Last Evaluated
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(policy.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Change History
              </h4>

              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="h-3 w-3 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Policy updated</p>
                    <p className="text-xs text-muted-foreground">
                      Modified conditions for time-based access
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(policy.updatedAt).toLocaleString()} by{" "}
                      {policy.createdBy}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                  <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Plus className="h-3 w-3 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Policy created</p>
                    <p className="text-xs text-muted-foreground">
                      Initial policy configuration
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(policy.createdAt).toLocaleString()} by{" "}
                      {policy.createdBy}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Policy Status</span>
          <Switch
            checked={policy.status === "enabled"}
            onCheckedChange={() => onToggleStatus(policy.id)}
          />
        </div>

        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
          <Copy className="h-4 w-4" />
          Duplicate Policy
        </button>

        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-destructive/20">
          <Trash2 className="h-4 w-4" />
          Delete Policy
        </button>
      </div>
    </div>
  );
}

// Main Page Component
export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>(mockPolicies);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [effectFilter, setEffectFilter] = useState<PolicyEffect | "all">("all");
  const [statusFilter, setStatusFilter] = useState<PolicyStatus | "all">("all");
  const [simulationMode, setSimulationMode] = useState(false);

  const handleToggleStatus = (policyId: string) => {
    setPolicies((prev) =>
      prev.map((p) =>
        p.id === policyId
          ? { ...p, status: p.status === "enabled" ? "disabled" : "enabled" }
          : p,
      ),
    );

    // Update selected policy if it's the one being toggled
    if (selectedPolicy?.id === policyId) {
      setSelectedPolicy((prev) =>
        prev
          ? {
              ...prev,
              status: prev.status === "enabled" ? "disabled" : "enabled",
            }
          : null,
      );
    }
  };

  const filteredPolicies = policies.filter((policy) => {
    const matchesSearch =
      searchQuery === "" ||
      policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesEffect =
      effectFilter === "all" || policy.effect === effectFilter;
    const matchesStatus =
      statusFilter === "all" || policy.status === statusFilter;

    return matchesSearch && matchesEffect && matchesStatus;
  });

  // Sort by priority
  const sortedPolicies = [...filteredPolicies].sort(
    (a, b) => a.priority - b.priority,
  );

  return (
    <div className="space-y-6">
      <PoliciesHeader
        onCreatePolicy={() => {}}
        simulationMode={simulationMode}
        onToggleSimulation={() => setSimulationMode(!simulationMode)}
      />

      <PoliciesStats policies={policies} />

      <PoliciesFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        effectFilter={effectFilter}
        onEffectFilterChange={setEffectFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PoliciesTable
            policies={sortedPolicies}
            selectedPolicy={selectedPolicy}
            onSelectPolicy={setSelectedPolicy}
            onToggleStatus={handleToggleStatus}
          />
        </div>
        <div className="lg:col-span-1">
          <PolicyDetailPanel
            policy={selectedPolicy}
            onClose={() => setSelectedPolicy(null)}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      </div>
    </div>
  );
}
