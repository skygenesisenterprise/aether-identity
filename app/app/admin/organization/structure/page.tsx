"use client";

import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Building2,
  Users,
  UserCircle,
  Archive,
  MoreHorizontal,
  Plus,
  Pencil,
  Trash2,
  ArrowUpDown,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Shield,
  Globe,
  Tag,
  MapPin,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OrgUnit {
  id: string;
  name: string;
  type: "organization" | "division" | "department" | "team" | "unit";
  status: "active" | "archived";
  description?: string;
  children?: OrgUnit[];
  metadata?: {
    environmentScope?: string[];
    costCenter?: string;
    region?: string;
    trustZone?: string;
    externalId?: string;
  };
  stats?: {
    childrenCount: number;
    policyCount: number;
    roleCount: number;
    userCount: number;
  };
}

const mockOrgStructure: OrgUnit = {
  id: "org-root",
  name: "Acme Corporation",
  type: "organization",
  status: "active",
  description: "Root organization for all business units",
  metadata: {
    environmentScope: ["production", "staging", "development"],
    region: "us-east",
    trustZone: "internal",
  },
  stats: {
    childrenCount: 4,
    policyCount: 12,
    roleCount: 28,
    userCount: 2847,
  },
  children: [
    {
      id: "div-eng",
      name: "Engineering",
      type: "division",
      status: "active",
      description: "Core engineering and development teams",
      metadata: {
        costCenter: "ENG-001",
        region: "us-west",
        trustZone: "internal",
      },
      stats: {
        childrenCount: 3,
        policyCount: 5,
        roleCount: 15,
        userCount: 342,
      },
      children: [
        {
          id: "dept-platform",
          name: "Platform Engineering",
          type: "department",
          status: "active",
          description: "Infrastructure and platform services",
          metadata: {
            costCenter: "PLT-001",
            region: "us-west",
            trustZone: "internal",
          },
          stats: {
            childrenCount: 2,
            policyCount: 2,
            roleCount: 6,
            userCount: 89,
          },
          children: [
            {
              id: "team-infra",
              name: "Infrastructure",
              type: "team",
              status: "active",
              description: "Cloud infrastructure and DevOps",
              metadata: {
                costCenter: "INF-001",
                region: "us-west",
                trustZone: "internal",
              },
              stats: {
                childrenCount: 0,
                policyCount: 1,
                roleCount: 3,
                userCount: 24,
              },
            },
            {
              id: "team-sre",
              name: "Site Reliability",
              type: "team",
              status: "active",
              description: "SRE and observability",
              metadata: {
                costCenter: "SRE-001",
                region: "us-west",
                trustZone: "internal",
              },
              stats: {
                childrenCount: 0,
                policyCount: 1,
                roleCount: 3,
                userCount: 18,
              },
            },
          ],
        },
        {
          id: "dept-backend",
          name: "Backend Engineering",
          type: "department",
          status: "active",
          description: "Backend services and APIs",
          metadata: {
            costCenter: "BE-001",
            region: "us-east",
            trustZone: "internal",
          },
          stats: {
            childrenCount: 2,
            policyCount: 2,
            roleCount: 6,
            userCount: 156,
          },
          children: [
            {
              id: "team-api",
              name: "API Platform",
              type: "team",
              status: "active",
              description: "API gateway and platform",
              stats: {
                childrenCount: 0,
                policyCount: 1,
                roleCount: 2,
                userCount: 42,
              },
            },
            {
              id: "team-core",
              name: "Core Services",
              type: "team",
              status: "active",
              description: "Core business logic services",
              stats: {
                childrenCount: 0,
                policyCount: 1,
                roleCount: 2,
                userCount: 56,
              },
            },
          ],
        },
      ],
    },
    {
      id: "div-sales",
      name: "Sales",
      type: "division",
      status: "active",
      description: "Sales and revenue teams",
      metadata: {
        costCenter: "SLS-001",
        region: "us-east",
        trustZone: "internal",
      },
      stats: {
        childrenCount: 2,
        policyCount: 3,
        roleCount: 8,
        userCount: 423,
      },
      children: [
        {
          id: "dept-enterprise",
          name: "Enterprise Sales",
          type: "department",
          status: "active",
          description: "Enterprise account management",
          stats: {
            childrenCount: 1,
            policyCount: 1,
            roleCount: 3,
            userCount: 89,
          },
          children: [
            {
              id: "team-strategic",
              name: "Strategic Accounts",
              type: "team",
              status: "active",
              description: "Key enterprise accounts",
              stats: {
                childrenCount: 0,
                policyCount: 1,
                roleCount: 1,
                userCount: 23,
              },
            },
          ],
        },
        {
          id: "dept-smb",
          name: "SMB Sales",
          type: "department",
          status: "active",
          description: "Small and medium business",
          stats: {
            childrenCount: 0,
            policyCount: 1,
            roleCount: 3,
            userCount: 156,
          },
        },
      ],
    },
    {
      id: "div-finance",
      name: "Finance",
      type: "division",
      status: "active",
      description: "Financial operations and accounting",
      metadata: {
        costCenter: "FIN-001",
        region: "us-east",
        trustZone: "restricted",
      },
      stats: {
        childrenCount: 1,
        policyCount: 2,
        roleCount: 4,
        userCount: 67,
      },
      children: [
        {
          id: "dept-accounting",
          name: "Accounting",
          type: "department",
          status: "active",
          description: "General accounting and reporting",
          stats: {
            childrenCount: 0,
            policyCount: 1,
            roleCount: 2,
            userCount: 34,
          },
        },
      ],
    },
    {
      id: "dept-hr",
      name: "Human Resources",
      type: "department",
      status: "active",
      description: "HR operations and people management",
      metadata: {
        costCenter: "HR-001",
        region: "us-east",
        trustZone: "internal",
      },
      stats: {
        childrenCount: 0,
        policyCount: 1,
        roleCount: 3,
        userCount: 45,
      },
    },
  ],
};

const typeConfig = {
  organization: {
    icon: Building2,
    color: "text-blue-500",
    label: "Organization",
  },
  division: { icon: Layers, color: "text-purple-500", label: "Division" },
  department: { icon: Users, color: "text-emerald-500", label: "Department" },
  team: { icon: UserCircle, color: "text-amber-500", label: "Team" },
  unit: { icon: Tag, color: "text-slate-500", label: "Unit" },
};

function TypeBadge({ type }: { type: OrgUnit["type"] }) {
  const config = typeConfig[type];
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted",
        config.color,
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

function StatusBadge({ status }: { status: OrgUnit["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        status === "active"
          ? "bg-emerald-500/10 text-emerald-500"
          : "bg-amber-500/10 text-amber-500",
      )}
    >
      {status === "active" ? "Active" : "Archived"}
    </span>
  );
}

function OrgUnitRow({
  unit,
  depth = 0,
  expanded,
  selected,
  onToggle,
  onSelect,
}: {
  unit: OrgUnit;
  depth?: number;
  expanded: boolean;
  selected: boolean;
  onToggle: () => void;
  onSelect: () => void;
}) {
  const hasChildren = unit.children && unit.children.length > 0;
  const config = typeConfig[unit.type];
  const Icon = config.icon;

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors hover:bg-muted/50",
          selected && "bg-muted",
          depth > 0 && "border-l border-border/50 ml-4",
        )}
        style={{ paddingLeft: `${12 + depth * 20}px` }}
        onClick={onSelect}
      >
        <div className="w-6 flex items-center justify-center">
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="p-0.5 hover:bg-muted rounded transition-colors"
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          ) : (
            <div className="h-4 w-4" />
          )}
        </div>

        <Icon className={cn("h-4 w-4 shrink-0", config.color)} />

        <span className="flex-1 font-medium text-sm truncate">{unit.name}</span>

        <TypeBadge type={unit.type} />

        {unit.stats && (
          <span className="text-xs text-muted-foreground hidden lg:inline">
            {unit.stats.childrenCount > 0 &&
              `${unit.stats.childrenCount} units`}
          </span>
        )}

        <StatusBadge status={unit.status} />

        <button
          onClick={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded transition-all"
        >
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {expanded && hasChildren && (
        <div className="animate-in slide-in-from-top-2 duration-200">
          {unit.children!.map((child) => (
            <OrgUnitRow
              key={child.id}
              unit={child}
              depth={depth + 1}
              expanded={false}
              selected={false}
              onToggle={() => {}}
              onSelect={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function OrgTree({
  structure,
  selectedId,
  onSelect,
}: {
  structure: OrgUnit;
  selectedId: string | null;
  onSelect: (unit: OrgUnit) => void;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["org-root"]));

  const toggle = (id: string) => {
    const next = new Set(expanded);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setExpanded(next);
  };

  const isExpanded = (id: string) => expanded.has(id);

  return (
    <div className="border rounded-lg bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="font-medium text-sm">Organization Hierarchy</h3>
        <span className="text-xs text-muted-foreground">
          {structure.children?.length || 0} top-level units
        </span>
      </div>
      <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
        <OrgUnitRow
          unit={structure}
          expanded={isExpanded(structure.id)}
          selected={selectedId === structure.id}
          onToggle={() => toggle(structure.id)}
          onSelect={() => onSelect(structure)}
        />
        {structure.children?.map((child) => (
          <OrgUnitRow
            key={child.id}
            unit={child}
            expanded={isExpanded(child.id)}
            selected={selectedId === child.id}
            onToggle={() => toggle(child.id)}
            onSelect={() => onSelect(child)}
          />
        ))}
      </div>
    </div>
  );
}

function InspectorPanel({
  unit,
  onClose,
}: {
  unit: OrgUnit | null;
  onClose: () => void;
}) {
  if (!unit) {
    return (
      <div className="border rounded-lg bg-card p-6">
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
          Select an organizational unit to view details
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          <h3 className="font-medium text-sm">Unit Details</h3>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Name
          </label>
          <p className="font-medium">{unit.name}</p>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Description
          </label>
          <p className="text-sm text-muted-foreground">
            {unit.description || "No description provided"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Type
            </label>
            <TypeBadge type={unit.type} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Status
            </label>
            <StatusBadge status={unit.status} />
          </div>
        </div>

        {unit.metadata && (
          <div className="space-y-3">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Metadata
            </label>
            <div className="grid gap-2 text-sm">
              {unit.metadata.costCenter && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Cost Center:</span>
                  <span className="font-mono">{unit.metadata.costCenter}</span>
                </div>
              )}
              {unit.metadata.region && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Region:</span>
                  <span>{unit.metadata.region}</span>
                </div>
              )}
              {unit.metadata.trustZone && (
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Trust Zone:</span>
                  <span>{unit.metadata.trustZone}</span>
                </div>
              )}
              {unit.metadata.environmentScope && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Environments:</span>
                  <span>{unit.metadata.environmentScope.join(", ")}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {unit.stats && (
          <div className="space-y-3">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Statistics
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-semibold">
                  {unit.stats.childrenCount}
                </p>
                <p className="text-xs text-muted-foreground">Sub-units</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-semibold">{unit.stats.userCount}</p>
                <p className="text-xs text-muted-foreground">Users</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-semibold">{unit.stats.roleCount}</p>
                <p className="text-xs text-muted-foreground">Roles</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-semibold">
                  {unit.stats.policyCount}
                </p>
                <p className="text-xs text-muted-foreground">Policies</p>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Actions
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
              <Plus className="h-4 w-4" />
              Add Child
            </button>
            <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
              <Pencil className="h-4 w-4" />
              Edit
            </button>
            <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
              <ArrowUpDown className="h-4 w-4" />
              Move
            </button>
            <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
              <Archive className="h-4 w-4" />
              Archive
            </button>
          </div>
        </div>

        <div className="pt-4 border-t">
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
            <Trash2 className="h-4 w-4" />
            Delete Unit
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrganizationStructurePage() {
  const [selectedUnit, setSelectedUnit] = useState<OrgUnit | null>(null);
  const [viewMode, setViewMode] = useState<"tree" | "list">("tree");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-card-foreground">
            Organization Structure
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Define and manage the hierarchical structure of your organization
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
            <Plus className="h-4 w-4" />
            Create Unit
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search organizational units..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <div className="flex items-center border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("tree")}
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors",
                viewMode === "tree"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Tree
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors",
                viewMode === "list"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              List
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OrgTree
            structure={mockOrgStructure}
            selectedId={selectedUnit?.id || null}
            onSelect={setSelectedUnit}
          />
        </div>
        <div className="lg:col-span-1">
          <InspectorPanel
            unit={selectedUnit}
            onClose={() => setSelectedUnit(null)}
          />
        </div>
      </div>
    </div>
  );
}
