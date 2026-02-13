"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Shield,
  Tag,
  MapPin,
  Layers,
  LayoutGrid,
  List,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Activity,
  Settings,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  FolderTree,
  Briefcase,
  History,
  Unlock,
  RefreshCw,
  Copy,
  ExternalLink,
  BarChart3,
  Sparkles,
  Info,
  SlidersHorizontal,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface OrgUnit {
  id: string;
  name: string;
  type: "organization" | "division" | "department" | "team" | "unit";
  status: "active" | "archived" | "pending";
  description?: string;
  children?: OrgUnit[];
  metadata?: {
    environmentScope?: string[];
    costCenter?: string;
    region?: string;
    trustZone?: "internal" | "restricted" | "confidential" | "public";
    externalId?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    manager?: string;
    budget?: number;
  };
  stats?: {
    childrenCount: number;
    policyCount: number;
    roleCount: number;
    userCount: number;
    resourceCount?: number;
    complianceScore?: number;
  };
}

interface OrgAlert {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  category: "compliance" | "security" | "configuration" | "usage";
  title: string;
  description: string;
  unitId?: string;
  timestamp: string;
  actionable: boolean;
}

interface OrgMetric {
  label: string;
  value: number;
  change?: number;
  trend?: "up" | "down" | "stable";
  icon: React.ElementType;
  color?: "default" | "success" | "warning" | "danger" | "info";
  suffix?: string;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockOrgStructure: OrgUnit = {
  id: "org-root",
  name: "Acme Corporation",
  type: "organization",
  status: "active",
  description: "Global technology company headquartered in San Francisco",
  metadata: {
    environmentScope: ["production", "staging", "development"],
    region: "multi-region",
    trustZone: "internal",
    createdAt: "2020-01-15T00:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    createdBy: "system",
    manager: "CEO Office",
    budget: 50000000,
  },
  stats: {
    childrenCount: 4,
    policyCount: 24,
    roleCount: 56,
    userCount: 2847,
    resourceCount: 1284,
    complianceScore: 94,
  },
  children: [
    {
      id: "div-eng",
      name: "Engineering",
      type: "division",
      status: "active",
      description: "Core engineering, infrastructure, and platform development",
      metadata: {
        costCenter: "ENG-001",
        region: "us-west",
        trustZone: "internal",
        createdAt: "2020-02-01T00:00:00Z",
        updatedAt: "2024-01-10T14:22:00Z",
        manager: "Sarah Chen",
        budget: 15000000,
      },
      stats: {
        childrenCount: 5,
        policyCount: 12,
        roleCount: 28,
        userCount: 587,
        resourceCount: 423,
        complianceScore: 96,
      },
      children: [
        {
          id: "dept-platform",
          name: "Platform Engineering",
          type: "department",
          status: "active",
          description: "Cloud infrastructure, DevOps, and platform services",
          metadata: {
            costCenter: "PLT-001",
            region: "us-west",
            trustZone: "internal",
            createdAt: "2020-03-15T00:00:00Z",
            manager: "Michael Torres",
            budget: 4500000,
          },
          stats: {
            childrenCount: 3,
            policyCount: 8,
            roleCount: 12,
            userCount: 89,
            resourceCount: 156,
            complianceScore: 98,
          },
          children: [
            {
              id: "team-infra",
              name: "Infrastructure",
              type: "team",
              status: "active",
              description: "Cloud infrastructure, networking, and compute",
              metadata: {
                costCenter: "INF-001",
                region: "us-west",
                trustZone: "internal",
                manager: "Alex Kumar",
              },
              stats: {
                childrenCount: 0,
                policyCount: 4,
                roleCount: 5,
                userCount: 24,
                resourceCount: 89,
                complianceScore: 99,
              },
            },
            {
              id: "team-sre",
              name: "Site Reliability",
              type: "team",
              status: "active",
              description: "SRE, observability, and incident response",
              metadata: {
                costCenter: "SRE-001",
                region: "us-west",
                trustZone: "internal",
                manager: "Lisa Park",
              },
              stats: {
                childrenCount: 0,
                policyCount: 3,
                roleCount: 4,
                userCount: 18,
                resourceCount: 45,
                complianceScore: 97,
              },
            },
            {
              id: "team-security",
              name: "Security Engineering",
              type: "team",
              status: "active",
              description: "Security architecture and tooling",
              metadata: {
                costCenter: "SEC-001",
                region: "us-west",
                trustZone: "restricted",
                manager: "David Chen",
              },
              stats: {
                childrenCount: 0,
                policyCount: 6,
                roleCount: 3,
                userCount: 12,
                resourceCount: 22,
                complianceScore: 100,
              },
            },
          ],
        },
        {
          id: "dept-backend",
          name: "Backend Engineering",
          type: "department",
          status: "active",
          description: "Backend services, APIs, and data platforms",
          metadata: {
            costCenter: "BE-001",
            region: "us-east",
            trustZone: "internal",
            createdAt: "2020-04-01T00:00:00Z",
            manager: "Jennifer Walsh",
            budget: 6200000,
          },
          stats: {
            childrenCount: 4,
            policyCount: 6,
            roleCount: 14,
            userCount: 234,
            resourceCount: 156,
            complianceScore: 93,
          },
          children: [
            {
              id: "team-api",
              name: "API Platform",
              type: "team",
              status: "active",
              description: "API gateway, GraphQL, and developer experience",
              metadata: {
                costCenter: "API-001",
                region: "us-east",
                trustZone: "internal",
                manager: "Robert Kim",
              },
              stats: {
                childrenCount: 0,
                policyCount: 3,
                roleCount: 5,
                userCount: 42,
                resourceCount: 67,
                complianceScore: 95,
              },
            },
            {
              id: "team-core",
              name: "Core Services",
              type: "team",
              status: "active",
              description: "Core business logic and microservices",
              metadata: {
                costCenter: "CORE-001",
                region: "us-east",
                trustZone: "internal",
                manager: "Emma Davis",
              },
              stats: {
                childrenCount: 0,
                policyCount: 2,
                roleCount: 6,
                userCount: 89,
                resourceCount: 78,
                complianceScore: 92,
              },
            },
          ],
        },
      ],
    },
    {
      id: "div-sales",
      name: "Sales & Revenue",
      type: "division",
      status: "active",
      description: "Sales operations, revenue, and customer success",
      metadata: {
        costCenter: "SLS-001",
        region: "us-east",
        trustZone: "internal",
        createdAt: "2020-02-15T00:00:00Z",
        updatedAt: "2024-01-12T09:15:00Z",
        manager: "James Wilson",
        budget: 8000000,
      },
      stats: {
        childrenCount: 3,
        policyCount: 6,
        roleCount: 12,
        userCount: 423,
        resourceCount: 234,
        complianceScore: 91,
      },
      children: [
        {
          id: "dept-enterprise",
          name: "Enterprise Sales",
          type: "department",
          status: "active",
          description: "Enterprise account management and strategic accounts",
          metadata: {
            costCenter: "ENT-001",
            region: "us-east",
            trustZone: "internal",
            manager: "Rachel Green",
            budget: 3200000,
          },
          stats: {
            childrenCount: 2,
            policyCount: 3,
            roleCount: 6,
            userCount: 89,
            resourceCount: 45,
            complianceScore: 90,
          },
          children: [
            {
              id: "team-strategic",
              name: "Strategic Accounts",
              type: "team",
              status: "active",
              description: "Fortune 500 strategic account management",
              metadata: {
                costCenter: "STRAT-001",
                region: "us-east",
                trustZone: "internal",
                manager: "Tom Anderson",
              },
              stats: {
                childrenCount: 0,
                policyCount: 2,
                roleCount: 3,
                userCount: 23,
                resourceCount: 12,
                complianceScore: 95,
              },
            },
          ],
        },
        {
          id: "dept-smb",
          name: "SMB Sales",
          type: "department",
          status: "active",
          description: "Small and medium business sales operations",
          metadata: {
            costCenter: "SMB-001",
            region: "us-east",
            trustZone: "internal",
            manager: "Maria Garcia",
            budget: 2100000,
          },
          stats: {
            childrenCount: 0,
            policyCount: 2,
            roleCount: 4,
            userCount: 156,
            resourceCount: 67,
            complianceScore: 88,
          },
        },
      ],
    },
    {
      id: "div-finance",
      name: "Finance & Operations",
      type: "division",
      status: "active",
      description: "Financial operations, accounting, and FP&A",
      metadata: {
        costCenter: "FIN-001",
        region: "us-east",
        trustZone: "restricted",
        createdAt: "2020-02-20T00:00:00Z",
        manager: "Patricia Moore",
        budget: 3800000,
      },
      stats: {
        childrenCount: 2,
        policyCount: 4,
        roleCount: 8,
        userCount: 67,
        resourceCount: 89,
        complianceScore: 98,
      },
      children: [
        {
          id: "dept-accounting",
          name: "Accounting",
          type: "department",
          status: "active",
          description: "General accounting, AR/AP, and financial reporting",
          metadata: {
            costCenter: "ACC-001",
            region: "us-east",
            trustZone: "restricted",
            manager: "Steven Lee",
          },
          stats: {
            childrenCount: 0,
            policyCount: 2,
            roleCount: 4,
            userCount: 34,
            resourceCount: 45,
            complianceScore: 99,
          },
        },
        {
          id: "dept-fpa",
          name: "Financial Planning",
          type: "department",
          status: "active",
          description: "Budgeting, forecasting, and financial analysis",
          metadata: {
            costCenter: "FPA-001",
            region: "us-east",
            trustZone: "restricted",
            manager: "Nancy Taylor",
          },
          stats: {
            childrenCount: 0,
            policyCount: 2,
            roleCount: 4,
            userCount: 28,
            resourceCount: 34,
            complianceScore: 97,
          },
        },
      ],
    },
    {
      id: "dept-hr",
      name: "Human Resources",
      type: "department",
      status: "active",
      description: "People operations, talent acquisition, and culture",
      metadata: {
        costCenter: "HR-001",
        region: "us-east",
        trustZone: "restricted",
        createdAt: "2020-03-01T00:00:00Z",
        manager: "Linda Martinez",
        budget: 2500000,
      },
      stats: {
        childrenCount: 0,
        policyCount: 2,
        roleCount: 6,
        userCount: 45,
        resourceCount: 34,
        complianceScore: 96,
      },
    },
  ],
};

const mockAlerts: OrgAlert[] = [
  {
    id: "alert-001",
    severity: "high",
    category: "compliance",
    title: "SMB Sales compliance score below threshold",
    description: "Compliance score is 88%, below the 90% organization minimum",
    unitId: "dept-smb",
    timestamp: "2 hours ago",
    actionable: true,
  },
  {
    id: "alert-002",
    severity: "medium",
    category: "configuration",
    title: "Backend Engineering missing cost center assignment",
    description: "3 teams lack proper cost center metadata",
    unitId: "dept-backend",
    timestamp: "1 day ago",
    actionable: true,
  },
  {
    id: "alert-003",
    severity: "low",
    category: "usage",
    title: "Infrastructure team has inactive resources",
    description: "12 resources haven't been accessed in 90+ days",
    unitId: "team-infra",
    timestamp: "3 days ago",
    actionable: false,
  },
];

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

const typeConfig = {
  organization: {
    icon: Building2,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    label: "Organization",
    description: "Top-level organizational entity",
  },
  division: {
    icon: Layers,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    label: "Division",
    description: "Major business division",
  },
  department: {
    icon: Users,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    label: "Department",
    description: "Functional department",
  },
  team: {
    icon: UserCircle,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    label: "Team",
    description: "Operational team",
  },
  unit: {
    icon: Tag,
    color: "text-slate-600",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    label: "Unit",
    description: "Specialized unit",
  },
};

const trustZoneConfig = {
  internal: {
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    label: "Internal",
  },
  restricted: {
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    label: "Restricted",
  },
  confidential: {
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    label: "Confidential",
  },
  public: {
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    label: "Public",
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function calculateOrgMetrics(structure: OrgUnit): OrgMetric[] {
  let totalUnits = 0;
  let totalUsers = 0;
  let totalResources = 0;
  let avgCompliance = 0;
  let complianceCount = 0;

  function traverse(unit: OrgUnit) {
    totalUnits++;
    if (unit.stats) {
      totalUsers += unit.stats.userCount;
      totalResources += unit.stats.resourceCount || 0;
      if (unit.stats.complianceScore) {
        avgCompliance += unit.stats.complianceScore;
        complianceCount++;
      }
    }
    unit.children?.forEach(traverse);
  }

  traverse(structure);

  const avgComplianceScore =
    complianceCount > 0 ? Math.round(avgCompliance / complianceCount) : 0;

  return [
    {
      label: "Total Units",
      value: totalUnits,
      icon: FolderTree,
      color: "default",
    },
    {
      label: "Total Users",
      value: totalUsers,
      change: 4.2,
      trend: "up",
      icon: Users,
      color: "success",
    },
    {
      label: "Resources",
      value: totalResources,
      change: -1.8,
      trend: "down",
      icon: Briefcase,
      color: "warning",
    },
    {
      label: "Compliance",
      value: avgComplianceScore,
      suffix: "%",
      change: 2.1,
      trend: "up",
      icon: CheckCircle2,
      color:
        avgComplianceScore >= 90
          ? "success"
          : avgComplianceScore >= 80
            ? "warning"
            : "danger",
    },
  ];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

// ============================================================================
// COMPONENT: BADGES
// ============================================================================

function TypeBadge({
  type,
  showLabel = true,
  size = "sm",
}: {
  type: OrgUnit["type"];
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const config = typeConfig[type];
  const Icon = config.icon;
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-sm gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2",
  };
  const iconSizes = { sm: "h-3 w-3", md: "h-4 w-4", lg: "h-5 w-5" };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        config.bgColor,
        config.color,
        sizeClasses[size],
      )}
    >
      <Icon className={iconSizes[size]} />
      {showLabel && config.label}
    </span>
  );
}

function StatusBadge({
  status,
  size = "sm",
}: {
  status: OrgUnit["status"];
  size?: "sm" | "md";
}) {
  const config = {
    active: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      label: "Active",
    },
    archived: {
      bg: "bg-slate-50",
      text: "text-slate-600",
      border: "border-slate-200",
      label: "Archived",
    },
    pending: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      label: "Pending",
    },
  }[status];

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium border",
        config.bg,
        config.text,
        config.border,
        sizeClasses[size],
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full mr-1.5",
          status === "active"
            ? "bg-emerald-500"
            : status === "archived"
              ? "bg-slate-400"
              : "bg-amber-500",
        )}
      />
      {config.label}
    </span>
  );
}

function TrustZoneBadge({
  zone,
}: {
  zone: "internal" | "restricted" | "confidential" | "public" | undefined;
}) {
  if (!zone) return null;
  const config = trustZoneConfig[zone];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
        config.bgColor,
        config.color,
      )}
    >
      <Shield className="h-3 w-3 mr-1" />
      {config.label}
    </span>
  );
}

function EnvironmentBadges({ environments }: { environments: string[] }) {
  if (!environments?.length)
    return <span className="text-xs text-muted-foreground italic">None</span>;

  return (
    <div className="flex flex-wrap gap-1">
      {environments.map((env) => (
        <span
          key={env}
          className={cn(
            "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium uppercase",
            env === "production"
              ? "bg-red-50 text-red-700 border border-red-200"
              : env === "staging"
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-blue-50 text-blue-700 border border-blue-200",
          )}
        >
          {env}
        </span>
      ))}
    </div>
  );
}

function AlertSeverityBadge({ severity }: { severity: OrgAlert["severity"] }) {
  const config = {
    critical: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      dot: "bg-red-500",
    },
    high: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
      dot: "bg-orange-500",
    },
    medium: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      dot: "bg-amber-500",
    },
    low: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      dot: "bg-blue-500",
    },
  }[severity];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
        config.bg,
        config.text,
        config.border,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full mr-1.5", config.dot)} />
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
}

// ============================================================================
// COMPONENT: METRIC CARD
// ============================================================================

function MetricCard({ metric }: { metric: OrgMetric & { suffix?: string } }) {
  const colorClasses = {
    default: "text-foreground",
    success: "text-emerald-600",
    warning: "text-amber-600",
    danger: "text-red-600",
    info: "text-blue-600",
  };

  const iconBgClasses = {
    default: "bg-muted",
    success: "bg-emerald-50",
    warning: "bg-amber-50",
    danger: "bg-red-50",
    info: "bg-blue-50",
  };

  const Icon = metric.icon;

  return (
    <div className="p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            {metric.label}
          </p>
          <div className="flex items-baseline gap-1">
            <p
              className={cn(
                "text-2xl font-semibold",
                colorClasses[metric.color || "default"],
              )}
            >
              {metric.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              {metric.suffix || ""}
            </p>
            {metric.change !== undefined && (
              <span
                className={cn(
                  "text-xs font-medium flex items-center",
                  metric.trend === "up"
                    ? "text-emerald-600"
                    : metric.trend === "down"
                      ? "text-red-600"
                      : "text-muted-foreground",
                )}
              >
                {metric.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 mr-0.5" />
                ) : metric.trend === "down" ? (
                  <TrendingDown className="h-3 w-3 mr-0.5" />
                ) : (
                  <Minus className="h-3 w-3 mr-0.5" />
                )}
                {Math.abs(metric.change)}%
              </span>
            )}
          </div>
        </div>
        <div
          className={cn(
            "p-2 rounded-lg",
            iconBgClasses[metric.color || "default"],
          )}
        >
          <Icon
            className={cn("h-5 w-5", colorClasses[metric.color || "default"])}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT: ORG TREE
// ============================================================================

function OrgUnitRow({
  unit,
  depth = 0,
  isExpanded,
  isSelected,
  onToggle,
  onSelect,
}: {
  unit: OrgUnit;
  depth?: number;
  isExpanded: boolean;
  isSelected: boolean;
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
          "group flex items-center gap-2 px-3 py-2.5 cursor-pointer transition-all duration-150",
          isSelected
            ? "bg-primary/5 border-l-2 border-l-primary"
            : "hover:bg-muted/50 border-l-2 border-l-transparent",
          depth > 0 && "ml-4",
        )}
        style={{ paddingLeft: `${12 + depth * 24}px` }}
        onClick={onSelect}
      >
        {/* Expand/Collapse Button */}
        <div className="w-5 flex items-center justify-center">
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="p-0.5 hover:bg-muted rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          ) : (
            <div className="h-4 w-4" />
          )}
        </div>

        {/* Type Icon */}
        <div className={cn("p-1.5 rounded", config.bgColor)}>
          <Icon className={cn("h-4 w-4 shrink-0", config.color)} />
        </div>

        {/* Unit Name */}
        <div className="flex-1 min-w-0">
          <span
            className={cn(
              "block text-sm font-medium truncate",
              isSelected ? "text-primary" : "text-foreground",
            )}
          >
            {unit.name}
          </span>
          {unit.metadata?.costCenter && (
            <span className="text-[10px] text-muted-foreground font-mono">
              {unit.metadata.costCenter}
            </span>
          )}
        </div>

        {/* Stats Preview */}
        {unit.stats && (
          <div className="hidden lg:flex items-center gap-3 text-xs text-muted-foreground">
            {unit.stats.userCount > 0 && (
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {unit.stats.userCount}
              </span>
            )}
            {unit.stats.childrenCount > 0 && (
              <span className="flex items-center gap-1">
                <FolderTree className="h-3 w-3" />
                {unit.stats.childrenCount}
              </span>
            )}
            {unit.stats.complianceScore !== undefined && (
              <span
                className={cn(
                  "flex items-center gap-1",
                  unit.stats.complianceScore >= 90
                    ? "text-emerald-600"
                    : unit.stats.complianceScore >= 80
                      ? "text-amber-600"
                      : "text-red-600",
                )}
              >
                <CheckCircle2 className="h-3 w-3" />
                {unit.stats.complianceScore}%
              </span>
            )}
          </div>
        )}

        {/* Status Badge */}
        <StatusBadge status={unit.status} />

        {/* Actions Menu */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-muted rounded transition-all"
        >
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Children with framer-motion animation */}
      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {unit.children!.map((child) => (
              <OrgUnitRow
                key={child.id}
                unit={child}
                depth={depth + 1}
                isExpanded={false}
                isSelected={false}
                onToggle={() => {}}
                onSelect={() => {}}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OrgTree({
  structure,
  selectedId,
  onSelect,
  searchQuery,
}: {
  structure: OrgUnit;
  selectedId: string | null;
  onSelect: (unit: OrgUnit) => void;
  searchQuery: string;
}) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(["org-root", "div-eng"]),
  );

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Auto-expand matching nodes when searching
  const getMatchingIds = (unit: OrgUnit, query: string): Set<string> => {
    const matching = new Set<string>();
    const searchLower = query.toLowerCase();

    function traverse(u: OrgUnit, parentIds: string[] = []) {
      const isMatch =
        u.name.toLowerCase().includes(searchLower) ||
        u.description?.toLowerCase().includes(searchLower) ||
        u.metadata?.costCenter?.toLowerCase().includes(searchLower);

      if (isMatch && query) {
        parentIds.forEach((id) => matching.add(id));
        matching.add(u.id);
      }

      u.children?.forEach((child) => traverse(child, [...parentIds, u.id]));
    }

    traverse(unit);
    return matching;
  };

  const matchingIds = searchQuery
    ? getMatchingIds(structure, searchQuery)
    : new Set<string>();

  // Filter visible units based on search
  const filterVisible = (unit: OrgUnit): OrgUnit | null => {
    if (!searchQuery) return unit;

    const isMatch = matchingIds.has(unit.id);
    const filteredChildren = unit.children
      ?.map(filterVisible)
      .filter((c): c is OrgUnit => c !== null);

    if (isMatch || (filteredChildren && filteredChildren.length > 0)) {
      return { ...unit, children: filteredChildren };
    }
    return null;
  };

  const visibleStructure = filterVisible(structure) || structure;

  // Count visible units
  const countVisible = (unit: OrgUnit): number => {
    let count = 1;
    if (expandedIds.has(unit.id) && unit.children) {
      unit.children.forEach((child) => (count += countVisible(child)));
    }
    return count;
  };

  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <FolderTree className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium text-sm">Organization Hierarchy</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {structure.children?.length || 0} divisions
          </span>
          <div className="h-4 w-px bg-border" />
          <button
            onClick={() => setExpandedIds(new Set(["org-root"]))}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Collapse All
          </button>
          <button
            onClick={() => {
              const allIds = new Set<string>();
              const collectIds = (u: OrgUnit) => {
                allIds.add(u.id);
                u.children?.forEach(collectIds);
              };
              collectIds(structure);
              setExpandedIds(allIds);
            }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Expand All
          </button>
        </div>
      </div>

      {/* Tree Content */}
      <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
        <OrgUnitRow
          unit={visibleStructure}
          isExpanded={expandedIds.has(visibleStructure.id)}
          isSelected={selectedId === visibleStructure.id}
          onToggle={() => toggleExpanded(visibleStructure.id)}
          onSelect={() => onSelect(visibleStructure)}
        />
        {expandedIds.has(visibleStructure.id) &&
          visibleStructure.children?.map((child) => (
            <OrgUnitRow
              key={child.id}
              unit={child}
              depth={1}
              isExpanded={expandedIds.has(child.id)}
              isSelected={selectedId === child.id}
              onToggle={() => toggleExpanded(child.id)}
              onSelect={() => onSelect(child)}
            />
          ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t bg-muted/30 text-xs text-muted-foreground flex items-center justify-between">
        <span>Showing {countVisible(visibleStructure)} units</span>
        {searchQuery && (
          <span className="text-primary">
            {matchingIds.size} matches for &quot;{searchQuery}&quot;
          </span>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT: INSPECTOR PANEL
// ============================================================================

function InspectorPanel({
  unit,
  onClose,
}: {
  unit: OrgUnit | null;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "metadata" | "activity" | "settings"
  >("overview");

  if (!unit) {
    return (
      <div className="border rounded-lg bg-card h-full flex flex-col">
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-6">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Building2 className="h-8 w-8 opacity-50" />
          </div>
          <p className="text-sm font-medium">Select an organizational unit</p>
          <p className="text-xs mt-1 max-w-[200px]">
            Click on any unit in the hierarchy to view details, manage settings,
            and see activity
          </p>
        </div>
      </div>
    );
  }

  const config = typeConfig[unit.type];
  const Icon = config.icon;

  return (
    <div className="border rounded-lg bg-card overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between px-4 py-4 border-b bg-muted/30">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "h-12 w-12 rounded-lg flex items-center justify-center shrink-0",
              config.bgColor,
            )}
          >
            <Icon className={cn("h-6 w-6", config.color)} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground truncate">
                {unit.name}
              </h3>
              <StatusBadge status={unit.status} size="sm" />
            </div>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              {unit.id}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-muted rounded-lg transition-colors shrink-0"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Description */}
      {unit.description && (
        <div className="px-4 py-3 border-b bg-muted/20">
          <p className="text-sm text-muted-foreground">{unit.description}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b">
        {[
          { id: "overview", label: "Overview", icon: LayoutGrid },
          { id: "metadata", label: "Metadata", icon: Tag },
          { id: "activity", label: "Activity", icon: Activity },
          { id: "settings", label: "Settings", icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors",
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
      <div className="flex-1 overflow-y-auto">
        {activeTab === "overview" && (
          <div className="p-4 space-y-6">
            {/* Stats Grid */}
            {unit.stats && (
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Users</span>
                  </div>
                  <p className="text-xl font-semibold">
                    {unit.stats.userCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <div className="flex items-center gap-2 mb-1">
                    <FolderTree className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Sub-units
                    </span>
                  </div>
                  <p className="text-xl font-semibold">
                    {unit.stats.childrenCount}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Roles</span>
                  </div>
                  <p className="text-xl font-semibold">
                    {unit.stats.roleCount}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Policies
                    </span>
                  </div>
                  <p className="text-xl font-semibold">
                    {unit.stats.policyCount}
                  </p>
                </div>
              </div>
            )}

            {/* Type & Trust Zone */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Classification
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <TypeBadge type={unit.type} size="sm" />
                </div>
                {unit.metadata?.trustZone && (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <span className="text-sm text-muted-foreground">
                      Trust Zone
                    </span>
                    <TrustZoneBadge
                      zone={
                        unit.metadata.trustZone as
                          | "internal"
                          | "restricted"
                          | "confidential"
                          | "public"
                      }
                    />
                  </div>
                )}
                {unit.metadata?.region && (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <span className="text-sm text-muted-foreground">
                      Region
                    </span>
                    <span className="text-sm flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      {unit.metadata.region}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Compliance Score */}
            {unit.stats?.complianceScore !== undefined && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Compliance
                </h4>
                <div
                  className={cn(
                    "p-3 rounded-lg border",
                    unit.stats.complianceScore >= 90
                      ? "bg-emerald-50 border-emerald-200"
                      : unit.stats.complianceScore >= 80
                        ? "bg-amber-50 border-amber-200"
                        : "bg-red-50 border-red-200",
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Compliance Score
                    </span>
                    <span
                      className={cn(
                        "text-lg font-semibold",
                        unit.stats.complianceScore >= 90
                          ? "text-emerald-700"
                          : unit.stats.complianceScore >= 80
                            ? "text-amber-700"
                            : "text-red-700",
                      )}
                    >
                      {unit.stats.complianceScore}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        unit.stats.complianceScore >= 90
                          ? "bg-emerald-500"
                          : unit.stats.complianceScore >= 80
                            ? "bg-amber-500"
                            : "bg-red-500",
                      )}
                      style={{ width: `${unit.stats.complianceScore}%` }}
                    />
                  </div>
                  <p className="text-xs mt-2 opacity-70">
                    {unit.stats.complianceScore >= 90
                      ? "Excellent compliance posture"
                      : unit.stats.complianceScore >= 80
                        ? "Review recommended"
                        : "Immediate attention required"}
                  </p>
                </div>
              </div>
            )}

            {/* Environments */}
            {unit.metadata?.environmentScope && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Environment Scope
                </h4>
                <EnvironmentBadges
                  environments={unit.metadata.environmentScope}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === "metadata" && (
          <div className="p-4 space-y-6">
            {/* Cost Center & Budget */}
            {(unit.metadata?.costCenter || unit.metadata?.budget) && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Financial
                </h4>
                <div className="space-y-2">
                  {unit.metadata?.costCenter && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Cost Center
                      </span>
                      <span className="text-sm font-mono">
                        {unit.metadata.costCenter}
                      </span>
                    </div>
                  )}
                  {unit.metadata?.budget && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Budget
                      </span>
                      <span className="text-sm font-medium">
                        {formatCurrency(unit.metadata.budget)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Manager */}
            {unit.metadata?.manager && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Leadership
                </h4>
                <div className="p-3 rounded-lg bg-muted/30 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {unit.metadata.manager}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Unit Manager
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Timeline
              </h4>
              <div className="space-y-2 text-sm">
                {unit.metadata?.createdAt && (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Created
                    </span>
                    <span>{formatDate(unit.metadata.createdAt)}</span>
                  </div>
                )}
                {unit.metadata?.updatedAt && (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Last Updated
                    </span>
                    <span>{formatDate(unit.metadata.updatedAt)}</span>
                  </div>
                )}
                {unit.metadata?.createdBy && (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <UserCircle className="h-4 w-4" />
                      Created By
                    </span>
                    <span>{unit.metadata.createdBy}</span>
                  </div>
                )}
              </div>
            </div>

            {/* External ID */}
            {unit.metadata?.externalId && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  External Integration
                </h4>
                <div className="p-2 rounded-lg bg-muted/30">
                  <span className="text-xs text-muted-foreground">
                    External ID
                  </span>
                  <p className="text-sm font-mono mt-0.5">
                    {unit.metadata.externalId}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "activity" && (
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <Info className="h-4 w-4 text-blue-600 shrink-0" />
              <p className="text-xs text-blue-700">
                Activity feed shows recent changes to this unit and its children
              </p>
            </div>

            <div className="space-y-3">
              {/* Mock Activity Items */}
              <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <Users className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">User added to unit</p>
                  <p className="text-xs text-muted-foreground">
                    john.smith@acme.com was added to this unit
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    2 hours ago
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Settings className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Policy updated</p>
                  <p className="text-xs text-muted-foreground">
                    Access policy modified for production environment
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    1 day ago
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                  <Pencil className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Unit details modified</p>
                  <p className="text-xs text-muted-foreground">
                    Description and metadata updated
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    3 days ago
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="p-4 space-y-6">
            {/* Quick Actions */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Quick Actions
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
                  <Plus className="h-4 w-4" />
                  Add Child
                </button>
                <button className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>
                <button className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
                  <ArrowUpDown className="h-4 w-4" />
                  Move
                </button>
                <button className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
                  <Copy className="h-4 w-4" />
                  Duplicate
                </button>
              </div>
            </div>

            {/* Status Management */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Status Management
              </h4>
              <div className="space-y-2">
                {unit.status === "active" ? (
                  <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
                    <Archive className="h-4 w-4" />
                    Archive Unit
                  </button>
                ) : (
                  <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
                    <Unlock className="h-4 w-4" />
                    Reactivate Unit
                  </button>
                )}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="space-y-3 pt-4 border-t">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-destructive">
                Danger Zone
              </h4>
              <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-destructive/20">
                <Trash2 className="h-4 w-4" />
                Delete Unit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT: ORG UNIT LIST VIEW (TABLE)
// ============================================================================

interface SortConfig {
  key: keyof OrgUnit | "users" | "compliance";
  direction: "asc" | "desc";
}

// Flatten the org structure for list view - defined outside component to avoid useMemo dependency warning
const flattenUnits = (
  unit: OrgUnit,
  depth = 0,
): (OrgUnit & { depth: number; path: string })[] => {
  const path = unit.name;
  const result: (OrgUnit & { depth: number; path: string })[] = [
    { ...unit, depth, path },
  ];

  unit.children?.forEach((child) => {
    result.push(...flattenUnits(child, depth + 1));
  });

  return result;
};

function OrgUnitListView({
  structure,
  selectedId,
  onSelect,
  searchQuery,
  filterType,
  filterStatus,
}: {
  structure: OrgUnit;
  selectedId: string | null;
  onSelect: (unit: OrgUnit) => void;
  searchQuery: string;
  filterType: OrgUnit["type"] | "all";
  filterStatus: OrgUnit["status"] | "all";
}) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "name",
    direction: "asc",
  });

  const allUnits = useMemo(() => flattenUnits(structure), [structure]);

  // Filter and sort units
  const filteredUnits = useMemo(() => {
    let result = allUnits;

    // Apply search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      result = result.filter(
        (unit) =>
          unit.name.toLowerCase().includes(searchLower) ||
          unit.description?.toLowerCase().includes(searchLower) ||
          unit.metadata?.costCenter?.toLowerCase().includes(searchLower) ||
          unit.id.toLowerCase().includes(searchLower),
      );
    }

    // Apply type filter
    if (filterType !== "all") {
      result = result.filter((unit) => unit.type === filterType);
    }

    // Apply status filter
    if (filterStatus !== "all") {
      result = result.filter((unit) => unit.status === filterStatus);
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortConfig.key) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "type":
          aValue = a.type;
          bValue = b.type;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "users":
          aValue = a.stats?.userCount || 0;
          bValue = b.stats?.userCount || 0;
          break;
        case "compliance":
          aValue = a.stats?.complianceScore || 0;
          bValue = b.stats?.complianceScore || 0;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [allUnits, searchQuery, filterType, filterStatus, sortConfig]);

  const handleSort = (key: SortConfig["key"]) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Helper function to render sort icon
  const renderSortIcon = (columnKey: SortConfig["key"]) => {
    if (sortConfig.key !== columnKey) {
      return (
        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground opacity-30" />
      );
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="h-3.5 w-3.5 text-primary" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5 text-primary" />
    );
  };

  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <List className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium text-sm">Organization Units</h3>
          <span className="text-xs text-muted-foreground">
            ({filteredUnits.length} units)
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="border-b">
              <th
                className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1.5">
                  Unit Name
                  {renderSortIcon("name")}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort("type")}
              >
                <div className="flex items-center gap-1.5">
                  Type
                  {renderSortIcon("type")}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-1.5">
                  Status
                  {renderSortIcon("status")}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort("users")}
              >
                <div className="flex items-center gap-1.5">
                  Users
                  {renderSortIcon("users")}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:bg-muted/70 transition-colors hidden md:table-cell"
                onClick={() => handleSort("compliance")}
              >
                <div className="flex items-center gap-1.5">
                  Compliance
                  {renderSortIcon("compliance")}
                </div>
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">
                Cost Center
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground w-10">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <AnimatePresence mode="popLayout">
              {filteredUnits.map((unit) => {
                const config = typeConfig[unit.type];
                const Icon = config.icon;

                return (
                  <motion.tr
                    key={unit.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "transition-colors cursor-pointer hover:bg-muted/50",
                      selectedId === unit.id && "bg-primary/5",
                    )}
                    onClick={() => onSelect(unit)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 flex items-center justify-center"
                          style={{ marginLeft: `${unit.depth * 16}px` }}
                        >
                          <div className={cn("p-1 rounded", config.bgColor)}>
                            <Icon className={cn("h-3.5 w-3.5", config.color)} />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <p
                            className={cn(
                              "font-medium truncate",
                              selectedId === unit.id
                                ? "text-primary"
                                : "text-foreground",
                            )}
                          >
                            {unit.name}
                          </p>
                          {unit.metadata?.costCenter && (
                            <p className="text-[10px] text-muted-foreground font-mono">
                              {unit.metadata.costCenter}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <TypeBadge type={unit.type} size="sm" showLabel={true} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={unit.status} size="sm" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">
                          {unit.stats?.userCount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {unit.stats?.complianceScore !== undefined ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full",
                                unit.stats.complianceScore >= 90
                                  ? "bg-emerald-500"
                                  : unit.stats.complianceScore >= 80
                                    ? "bg-amber-500"
                                    : "bg-red-500",
                              )}
                              style={{
                                width: `${unit.stats.complianceScore}%`,
                              }}
                            />
                          </div>
                          <span
                            className={cn(
                              "text-xs font-medium",
                              unit.stats.complianceScore >= 90
                                ? "text-emerald-600"
                                : unit.stats.complianceScore >= 80
                                  ? "text-amber-600"
                                  : "text-red-600",
                            )}
                          >
                            {unit.stats.complianceScore}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-muted-foreground font-mono">
                        {unit.metadata?.costCenter || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 hover:bg-muted rounded transition-colors"
                      >
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {filteredUnits.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-base font-medium text-foreground mb-1">
            No units found
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Try adjusting your search or filters to find what you&apos;re
            looking for.
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-2 border-t bg-muted/30 text-xs text-muted-foreground flex items-center justify-between">
        <span>
          Showing {filteredUnits.length} of {allUnits.length} units
        </span>
        {searchQuery && (
          <span className="text-primary">
            Filtered by &quot;{searchQuery}&quot;
          </span>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT: ANIMATED DROPDOWN
// ============================================================================

interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ElementType;
  color?: string;
}

function AnimatedDropdown({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);
  const SelectedIcon = selectedOption?.icon;

  return (
    <div ref={dropdownRef} className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg bg-background transition-all min-w-[140px]",
          isOpen
            ? "border-primary ring-2 ring-primary/20"
            : "border-border hover:border-muted-foreground/50",
        )}
        whileTap={{ scale: 0.98 }}
      >
        {SelectedIcon && (
          <SelectedIcon
            className={cn(
              "h-4 w-4",
              selectedOption?.color || "text-muted-foreground",
            )}
          />
        )}
        <span className="flex-1 text-left">
          {selectedOption?.label || placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{
                duration: 0.15,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="absolute top-full left-0 mt-1 w-56 bg-card border rounded-lg shadow-lg z-50 overflow-hidden"
            >
              <div className="py-1">
                {options.map((option, index) => {
                  const Icon = option.icon;
                  const isSelected = value === option.value;

                  return (
                    <motion.button
                      key={option.value}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors",
                        isSelected
                          ? "bg-primary/5 text-primary"
                          : "text-foreground hover:bg-muted/50",
                      )}
                    >
                      {Icon && (
                        <Icon
                          className={cn(
                            "h-4 w-4",
                            option.color || "text-muted-foreground",
                            isSelected && "text-primary",
                          )}
                        />
                      )}
                      <span className="flex-1 text-left">{option.label}</span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="h-4 w-4 rounded-full bg-primary flex items-center justify-center"
                        >
                          <CheckCircle2 className="h-2.5 w-2.5 text-primary-foreground" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// COMPONENT: ADVANCED FILTERS PANEL
// ============================================================================

interface FilterState {
  types: OrgUnit["type"][];
  statuses: OrgUnit["status"][];
  trustZones: ("internal" | "restricted" | "confidential" | "public")[];
  hasChildren: "all" | "with" | "without";
  complianceRange: { min: number; max: number };
  userCountRange: { min: number; max: number };
}

function AdvancedFiltersPanel({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onReset,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onReset: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const toggleArrayValue = <T,>(
    current: T[],
    value: T,
    onChange: (value: T[]) => void,
  ) => {
    if (current.includes(value)) {
      onChange(current.filter((v) => v !== value));
    } else {
      onChange([...current, value]);
    }
  };

  const hasActiveFilters =
    filters.types.length > 0 ||
    filters.statuses.length > 0 ||
    filters.trustZones.length > 0 ||
    filters.hasChildren !== "all" ||
    filters.complianceRange.min > 0 ||
    filters.complianceRange.max < 100 ||
    filters.userCountRange.min > 0 ||
    filters.userCountRange.max < 10000;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 bg-card border-l shadow-xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30 sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium text-sm">Advanced Filters</h3>
                {hasActiveFilters && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-primary text-primary-foreground">
                    Active
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Unit Types */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Unit Types
                </h4>
                <div className="space-y-2">
                  {(
                    [
                      "organization",
                      "division",
                      "department",
                      "team",
                      "unit",
                    ] as OrgUnit["type"][]
                  ).map((type) => {
                    const config = typeConfig[type];
                    const Icon = config.icon;
                    const isSelected = filters.types.includes(type);

                    return (
                      <motion.button
                        key={type}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          toggleArrayValue(filters.types, type, (types) =>
                            onFiltersChange({ ...filters, types }),
                          )
                        }
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-lg border transition-all",
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground/30",
                        )}
                      >
                        <div
                          className={cn(
                            "p-1.5 rounded",
                            isSelected ? config.bgColor : "bg-muted",
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-4 w-4",
                              isSelected
                                ? config.color
                                : "text-muted-foreground",
                            )}
                          />
                        </div>
                        <span
                          className={cn(
                            "text-sm flex-1 text-left",
                            isSelected ? "font-medium" : "",
                          )}
                        >
                          {config.label}
                        </span>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="h-5 w-5 rounded-full bg-primary flex items-center justify-center"
                          >
                            <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Status */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Status
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(
                    ["active", "archived", "pending"] as OrgUnit["status"][]
                  ).map((status) => {
                    const isSelected = filters.statuses.includes(status);
                    return (
                      <motion.button
                        key={status}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          toggleArrayValue(
                            filters.statuses,
                            status,
                            (statuses) =>
                              onFiltersChange({ ...filters, statuses }),
                          )
                        }
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                          isSelected
                            ? status === "active"
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                              : status === "archived"
                                ? "bg-slate-50 border-slate-200 text-slate-600"
                                : "bg-amber-50 border-amber-200 text-amber-700"
                            : "border-border hover:border-muted-foreground/30",
                        )}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Trust Zones */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Trust Zones
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      "internal",
                      "restricted",
                      "confidential",
                      "public",
                    ] as const
                  ).map((zone) => {
                    const config = trustZoneConfig[zone];
                    const isSelected = filters.trustZones.includes(zone);
                    return (
                      <motion.button
                        key={zone}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          toggleArrayValue(
                            filters.trustZones,
                            zone,
                            (trustZones) =>
                              onFiltersChange({ ...filters, trustZones }),
                          )
                        }
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5",
                          isSelected
                            ? cn(
                                config.bgColor,
                                config.borderColor,
                                config.color,
                              )
                            : "border-border hover:border-muted-foreground/30",
                        )}
                      >
                        <Shield className="h-3 w-3" />
                        {config.label}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Hierarchy Options */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Hierarchy
                </h4>
                <div className="flex gap-2 p-1 bg-muted rounded-lg">
                  {(["all", "with", "without"] as const).map((option) => (
                    <button
                      key={option}
                      onClick={() =>
                        onFiltersChange({ ...filters, hasChildren: option })
                      }
                      className={cn(
                        "flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                        filters.hasChildren === option
                          ? "bg-card shadow-sm"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {option === "all"
                        ? "All Units"
                        : option === "with"
                          ? "With Children"
                          : "Leaf Units"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Compliance Score Range */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Compliance Score
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {filters.complianceRange.min}% -{" "}
                    {filters.complianceRange.max}%
                  </span>
                </div>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.complianceRange.min}
                    onChange={(e) =>
                      onFiltersChange({
                        ...filters,
                        complianceRange: {
                          ...filters.complianceRange,
                          min: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.complianceRange.max}
                    onChange={(e) =>
                      onFiltersChange({
                        ...filters,
                        complianceRange: {
                          ...filters.complianceRange,
                          max: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 px-4 py-3 border-t bg-card space-y-2">
              <button
                onClick={() => {
                  onReset();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Reset Filters
              </button>
              <button
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" />
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// COMPONENT: IMPORT MODAL
// ============================================================================

function ImportModal({
  isOpen,
  onClose,
  onImport,
}: {
  isOpen: boolean;
  onClose: () => void;
  onImport?: (data: OrgUnit[]) => void;
}) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [importFormat, setImportFormat] = useState<"json" | "csv">("json");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    // Simulate import
    setTimeout(() => {
      onImport?.([]);
      setFile(null);
      onClose();
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-card border rounded-xl shadow-xl max-w-lg w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Import Organization Structure
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Import units from a file
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Format Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Import Format</label>
                  <div className="flex gap-2">
                    {(["json", "csv"] as const).map((format) => (
                      <button
                        key={format}
                        onClick={() => setImportFormat(format)}
                        className={cn(
                          "flex-1 px-4 py-2 text-sm font-medium border rounded-lg transition-all",
                          importFormat === format
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-muted-foreground/50",
                        )}
                      >
                        {format.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* File Upload Area */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
                    dragActive
                      ? "border-primary bg-primary/5"
                      : file
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-border hover:border-muted-foreground/50 hover:bg-muted/30",
                  )}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={importFormat === "json" ? ".json" : ".csv"}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <AnimatePresence mode="wait">
                    {file ? (
                      <motion.div
                        key="file"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex flex-col items-center gap-2"
                      >
                        <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                          <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                        </div>
                        <p className="font-medium text-emerald-700">
                          {file.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                          }}
                          className="text-sm text-destructive hover:underline mt-2"
                        >
                          Remove file
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="upload"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-3"
                      >
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">
                            Drop your file here, or click to browse
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Supports {importFormat.toUpperCase()} files up to
                            10MB
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Info Box */}
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium text-foreground mb-1">
                        Import Guidelines
                      </p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>
                          File must include unit name, type, and parent ID
                        </li>
                        <li>Maximum 1000 units per import</li>
                        <li>Existing units will be updated, not duplicated</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-muted/30">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={!file}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    file
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-muted-foreground cursor-not-allowed",
                  )}
                >
                  Import Structure
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// COMPONENT: EXPORT MODAL
// ============================================================================

function ExportModal({
  isOpen,
  onClose,
  structure,
}: {
  isOpen: boolean;
  onClose: () => void;
  structure: OrgUnit;
}) {
  const [exportFormat, setExportFormat] = useState<"json" | "csv" | "pdf">(
    "json",
  );
  const [includeStats, setIncludeStats] = useState(true);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [exportScope, setExportScope] = useState<"all" | "filtered">("all");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    // Simulate export delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Create and download file
    const data = {
      exportedAt: new Date().toISOString(),
      format: exportFormat,
      structure,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: exportFormat === "json" ? "application/json" : "text/csv",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `organization-structure-${new Date().toISOString().split("T")[0]}.${exportFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsExporting(false);
    onClose();
  };

  const formatIcons = {
    json: { icon: FileText, label: "JSON", desc: "Machine-readable format" },
    csv: { icon: LayoutGrid, label: "CSV", desc: "Spreadsheet format" },
    pdf: { icon: FileText, label: "PDF", desc: "Document format" },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-card border rounded-xl shadow-xl max-w-lg w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Download className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Export Organization Structure
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Download your organization data
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Export Format */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Export Format</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(
                      Object.keys(formatIcons) as Array<
                        keyof typeof formatIcons
                      >
                    ).map((format) => {
                      const { icon: Icon, label, desc } = formatIcons[format];
                      const isSelected = exportFormat === format;

                      return (
                        <motion.button
                          key={format}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setExportFormat(format)}
                          className={cn(
                            "p-4 rounded-xl border transition-all text-left",
                            isSelected
                              ? "border-primary bg-primary/5 ring-1 ring-primary"
                              : "border-border hover:border-muted-foreground/50 hover:bg-muted/30",
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-6 w-6 mb-2",
                              isSelected
                                ? "text-primary"
                                : "text-muted-foreground",
                            )}
                          />
                          <p
                            className={cn(
                              "font-medium",
                              isSelected ? "text-primary" : "",
                            )}
                          >
                            {label}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {desc}
                          </p>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Export Options */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Export Options</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeStats}
                        onChange={(e) => setIncludeStats(e.target.checked)}
                        className="rounded border-input"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Include Statistics
                        </p>
                        <p className="text-xs text-muted-foreground">
                          User counts, compliance scores, and resource data
                        </p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeMetadata}
                        onChange={(e) => setIncludeMetadata(e.target.checked)}
                        className="rounded border-input"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Include Metadata</p>
                        <p className="text-xs text-muted-foreground">
                          Cost centers, regions, trust zones, and custom fields
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Export Scope */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Export Scope</label>
                  <div className="flex gap-2 p-1 bg-muted rounded-lg">
                    {(["all", "filtered"] as const).map((scope) => (
                      <button
                        key={scope}
                        onClick={() => setExportScope(scope)}
                        className={cn(
                          "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all",
                          exportScope === scope
                            ? "bg-card shadow-sm"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {scope === "all" ? "All Units" : "Filtered Only"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Units to export:
                    </span>
                    <span className="font-semibold">
                      {exportScope === "all"
                        ? "All organization"
                        : "Filtered results"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-muted/30">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isExporting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </motion.div>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Export {exportFormat.toUpperCase()}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// COMPONENT: CREATE UNIT MODAL
// ============================================================================

function CreateUnitModal({
  isOpen,
  onClose,
  onCreate,
  parentUnits,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (unit: Partial<OrgUnit>) => void;
  parentUnits: OrgUnit[];
}) {
  const [formData, setFormData] = useState({
    name: "",
    type: "department" as OrgUnit["type"],
    description: "",
    parentId: "",
    costCenter: "",
    region: "",
    trustZone: "internal" as
      | "internal"
      | "restricted"
      | "confidential"
      | "public",
    manager: "",
  });
  const [isCreating, setIsCreating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newUnit: Partial<OrgUnit> = {
      id: `unit-${Date.now()}`,
      name: formData.name,
      type: formData.type,
      status: "active",
      description: formData.description,
      metadata: {
        costCenter: formData.costCenter || undefined,
        region: formData.region || undefined,
        trustZone: formData.trustZone,
        manager: formData.manager || undefined,
        createdAt: new Date().toISOString(),
      },
      stats: {
        childrenCount: 0,
        policyCount: 0,
        roleCount: 0,
        userCount: 0,
        resourceCount: 0,
        complianceScore: 100,
      },
    };

    onCreate?.(newUnit);
    setIsCreating(false);
    setFormData({
      name: "",
      type: "department",
      description: "",
      parentId: "",
      costCenter: "",
      region: "",
      trustZone: "internal",
      manager: "",
    });
    setCurrentStep(1);
    onClose();
  };

  const steps = [
    { id: 1, label: "Basic Info", icon: FileText },
    { id: 2, label: "Configuration", icon: Settings },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-card border rounded-xl shadow-xl max-w-2xl w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Create Organization Unit
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Add a new unit to your organization
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              {/* Step Indicator */}
              <div className="px-6 py-4 border-b bg-muted/30">
                <div className="flex items-center gap-4">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;

                    return (
                      <div key={step.id} className="flex items-center gap-2">
                        <motion.div
                          animate={{
                            backgroundColor: isActive
                              ? "rgb(var(--primary))"
                              : isCompleted
                                ? "rgb(var(--primary) / 0.1)"
                                : "rgb(var(--muted))",
                          }}
                          className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : isCompleted
                                ? "text-primary"
                                : "text-muted-foreground",
                          )}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Icon className="h-4 w-4" />
                          )}
                          {step.label}
                        </motion.div>
                        {index < steps.length - 1 && (
                          <div
                            className={cn(
                              "w-8 h-px",
                              isCompleted ? "bg-primary" : "bg-border",
                            )}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Content */}
                <div className="p-6">
                  <AnimatePresence mode="wait">
                    {currentStep === 1 ? (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                      >
                        {/* Unit Name */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Unit Name{" "}
                            <span className="text-destructive">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="e.g., Platform Engineering"
                            className="w-full px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>

                        {/* Unit Type */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Unit Type{" "}
                            <span className="text-destructive">*</span>
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {(
                              [
                                "division",
                                "department",
                                "team",
                                "unit",
                              ] as OrgUnit["type"][]
                            ).map((type) => {
                              const config = typeConfig[type];
                              const Icon = config.icon;
                              const isSelected = formData.type === type;

                              return (
                                <motion.button
                                  key={type}
                                  type="button"
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() =>
                                    setFormData({ ...formData, type })
                                  }
                                  className={cn(
                                    "flex items-center gap-2 px-3 py-2 text-sm border rounded-lg transition-all",
                                    isSelected
                                      ? "border-primary bg-primary/5 text-primary"
                                      : "border-border hover:bg-muted/50",
                                  )}
                                >
                                  <Icon
                                    className={cn("h-4 w-4", config.color)}
                                  />
                                  {config.label}
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Parent Unit */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Parent Unit
                          </label>
                          <select
                            value={formData.parentId}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                parentId: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="">No parent (Root level)</option>
                            {parentUnits.map((unit) => (
                              <option key={unit.id} value={unit.id}>
                                {unit.name} ({typeConfig[unit.type].label})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Description
                          </label>
                          <textarea
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                description: e.target.value,
                              })
                            }
                            placeholder="Brief description of this unit's purpose..."
                            rows={3}
                            className="w-full px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                          />
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        {/* Cost Center */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Cost Center
                          </label>
                          <input
                            type="text"
                            value={formData.costCenter}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                costCenter: e.target.value,
                              })
                            }
                            placeholder="e.g., ENG-001"
                            className="w-full px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>

                        {/* Region */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Region</label>
                          <select
                            value={formData.region}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                region: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="">Select region...</option>
                            <option value="us-east">US East</option>
                            <option value="us-west">US West</option>
                            <option value="eu-west">EU West</option>
                            <option value="eu-central">EU Central</option>
                            <option value="apac">Asia Pacific</option>
                          </select>
                        </div>

                        {/* Trust Zone */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Trust Zone
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {(
                              [
                                "internal",
                                "restricted",
                                "confidential",
                                "public",
                              ] as const
                            ).map((zone) => {
                              const config = trustZoneConfig[zone];
                              const isSelected = formData.trustZone === zone;

                              return (
                                <motion.button
                                  key={zone}
                                  type="button"
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() =>
                                    setFormData({
                                      ...formData,
                                      trustZone: zone,
                                    })
                                  }
                                  className={cn(
                                    "flex items-center gap-2 px-3 py-2 text-sm border rounded-lg transition-all",
                                    isSelected
                                      ? cn(
                                          "border-primary bg-primary/5",
                                          config.color,
                                        )
                                      : "border-border hover:bg-muted/50",
                                  )}
                                >
                                  <Shield className="h-4 w-4" />
                                  {config.label}
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Manager */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Unit Manager
                          </label>
                          <input
                            type="text"
                            value={formData.manager}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                manager: e.target.value,
                              })
                            }
                            placeholder="e.g., John Smith"
                            className="w-full px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/30">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors"
                    >
                      Previous
                    </button>
                  ) : (
                    <div />
                  )}

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors"
                    >
                      Cancel
                    </button>
                    {currentStep < 2 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentStep(currentStep + 1)}
                        disabled={!formData.name}
                        className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isCreating}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                      >
                        {isCreating ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </motion.div>
                            Creating...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            Create Unit
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// COMPONENT: ALERTS SECTION
// ============================================================================

function AlertsSection({
  alerts,
  onAlertClick,
}: {
  alerts: OrgAlert[];
  onAlertClick?: (alert: OrgAlert) => void;
}) {
  if (alerts.length === 0) return null;

  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const highCount = alerts.filter((a) => a.severity === "high").length;

  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <AlertTriangle
            className={cn(
              "h-4 w-4",
              criticalCount > 0
                ? "text-red-500"
                : highCount > 0
                  ? "text-orange-500"
                  : "text-amber-500",
            )}
          />
          <h3 className="font-medium text-sm">Active Alerts</h3>
          <span className="text-xs text-muted-foreground">
            ({alerts.length})
          </span>
        </div>
        <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          View All
        </button>
      </div>

      <div className="divide-y divide-border">
        {alerts.slice(0, 3).map((alert) => (
          <div
            key={alert.id}
            onClick={() => onAlertClick?.(alert)}
            className={cn(
              "p-3 hover:bg-muted/30 transition-colors cursor-pointer",
              alert.actionable && "border-l-2 border-l-primary",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <AlertSeverityBadge severity={alert.severity} />
                  <span className="text-xs text-muted-foreground uppercase">
                    {alert.category}
                  </span>
                </div>
                <p className="text-sm font-medium mt-1.5">{alert.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {alert.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {alert.timestamp}
                  </span>
                  {alert.unitId && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {alert.unitId}
                      </span>
                    </>
                  )}
                </div>
              </div>
              {alert.actionable && (
                <button className="shrink-0 p-1.5 hover:bg-primary/10 rounded transition-colors text-primary">
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {alerts.length > 3 && (
        <div className="px-4 py-2 border-t bg-muted/20 text-center">
          <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Show {alerts.length - 3} more alerts
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function OrganizationStructurePage() {
  const [selectedUnit, setSelectedUnit] = useState<OrgUnit | null>(null);
  const [viewMode, setViewMode] = useState<"tree" | "list">("tree");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<OrgUnit["type"] | "all">("all");
  const [filterStatus, setFilterStatus] = useState<OrgUnit["status"] | "all">(
    "all",
  );
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<FilterState>({
    types: [],
    statuses: [],
    trustZones: [],
    hasChildren: "all",
    complianceRange: { min: 0, max: 100 },
    userCountRange: { min: 0, max: 10000 },
  });

  // Calculate metrics
  const metrics = useMemo(() => calculateOrgMetrics(mockOrgStructure), []);

  // Get all units for parent selection
  const allUnits = useMemo(() => flattenUnits(mockOrgStructure), []);

  // Handle alert click
  const handleAlertClick = (alert: OrgAlert) => {
    // Find and select the unit related to this alert
    const findUnit = (unit: OrgUnit, id: string): OrgUnit | null => {
      if (unit.id === id) return unit;
      for (const child of unit.children || []) {
        const found = findUnit(child, id);
        if (found) return found;
      }
      return null;
    };

    if (alert.unitId) {
      const unit = findUnit(mockOrgStructure, alert.unitId);
      if (unit) setSelectedUnit(unit);
    }
  };

  const resetAdvancedFilters = () => {
    setAdvancedFilters({
      types: [],
      statuses: [],
      trustZones: [],
      hasChildren: "all",
      complianceRange: { min: 0, max: 100 },
      userCountRange: { min: 0, max: 10000 },
    });
  };

  // Check if advanced filters are active
  const hasAdvancedFilters =
    advancedFilters.types.length > 0 ||
    advancedFilters.statuses.length > 0 ||
    advancedFilters.trustZones.length > 0 ||
    advancedFilters.hasChildren !== "all" ||
    advancedFilters.complianceRange.min > 0 ||
    advancedFilters.complianceRange.max < 100;

  return (
    <div className="space-y-6">
      {/* =========================================================================
          HEADER SECTION
          Title, subtitle, and primary actions
          ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-card-foreground">
              Identity Organization Structure
            </h1>
            <StatusBadge status="active" />
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Manage your organizational hierarchy, define reporting
            relationships, and configure access policies across divisions,
            departments, and teams. Structure determines inheritance of
            permissions, policies, and resource access.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Import</span>
          </button>
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Create Unit
          </button>
        </div>
      </div>

      {/* =========================================================================
          KPI CARDS SECTION
          Key organizational metrics at a glance
          ========================================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>

      {/* =========================================================================
          FILTERS & SEARCH BAR
          Advanced filtering and view controls
          ========================================================================= */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search units by name, ID, or cost center..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-muted rounded transition-colors"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto">
          {/* Animated Type Dropdown */}
          <AnimatedDropdown
            value={filterType}
            onChange={(value) =>
              setFilterType(value as OrgUnit["type"] | "all")
            }
            options={[
              { value: "all", label: "All Types", icon: Layers },
              { value: "organization", label: "Organization", icon: Building2 },
              { value: "division", label: "Division", icon: Layers },
              { value: "department", label: "Department", icon: Users },
              { value: "team", label: "Team", icon: UserCircle },
              { value: "unit", label: "Unit", icon: Tag },
            ]}
            placeholder="All Types"
          />

          {/* Animated Status Dropdown */}
          <AnimatedDropdown
            value={filterStatus}
            onChange={(value) =>
              setFilterStatus(value as OrgUnit["status"] | "all")
            }
            options={[
              {
                value: "all",
                label: "All Status",
                icon: CheckCircle2,
                color: "text-muted-foreground",
              },
              {
                value: "active",
                label: "Active",
                icon: CheckCircle2,
                color: "text-emerald-600",
              },
              {
                value: "archived",
                label: "Archived",
                icon: Archive,
                color: "text-slate-600",
              },
              {
                value: "pending",
                label: "Pending",
                icon: Clock,
                color: "text-amber-600",
              },
            ]}
            placeholder="All Status"
          />

          <button
            onClick={() => setIsFiltersPanelOpen(true)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg transition-colors",
              hasAdvancedFilters
                ? "border-primary bg-primary/5 text-primary"
                : "hover:bg-muted",
            )}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">More Filters</span>
            {hasAdvancedFilters && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-primary text-primary-foreground">
                {advancedFilters.types.length +
                  advancedFilters.statuses.length +
                  advancedFilters.trustZones.length}
              </span>
            )}
          </button>

          <div className="flex items-center border rounded-lg overflow-hidden ml-auto lg:ml-0">
            <button
              onClick={() => setViewMode("tree")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors",
                viewMode === "tree"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              <FolderTree className="h-4 w-4" />
              <span className="hidden sm:inline">Tree</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors",
                viewMode === "list"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MAIN CONTENT
          Tree/List view with inspector panel
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Organization Tree/List */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {viewMode === "tree" ? (
              <motion.div
                key="tree"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <OrgTree
                  structure={mockOrgStructure}
                  selectedId={selectedUnit?.id || null}
                  onSelect={setSelectedUnit}
                  searchQuery={searchQuery}
                />
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <OrgUnitListView
                  structure={mockOrgStructure}
                  selectedId={selectedUnit?.id || null}
                  onSelect={setSelectedUnit}
                  searchQuery={searchQuery}
                  filterType={filterType}
                  filterStatus={filterStatus}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Alerts Section */}
          <AlertsSection alerts={mockAlerts} onAlertClick={handleAlertClick} />
        </div>

        {/* Right Column - Inspector Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <InspectorPanel
              unit={selectedUnit}
              onClose={() => setSelectedUnit(null)}
            />
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AdvancedFiltersPanel
        isOpen={isFiltersPanelOpen}
        onClose={() => setIsFiltersPanelOpen(false)}
        filters={advancedFilters}
        onFiltersChange={setAdvancedFilters}
        onReset={resetAdvancedFilters}
      />

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={(data) => {
          console.log("Imported data:", data);
          // Handle import logic here
        }}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        structure={mockOrgStructure}
      />

      {/* Create Unit Modal */}
      <CreateUnitModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={(unit) => {
          console.log("Created unit:", unit);
          // Handle create logic here
        }}
        parentUnits={allUnits}
      />

      {/* =========================================================================
          BOTTOM SECTION
          Additional context and quick actions
          ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
        <div className="p-4 rounded-lg border bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-medium">Quick Tips</h4>
          </div>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li className="flex items-start gap-1.5">
              <ChevronRight className="h-3 w-3 mt-0.5 shrink-0" />
              Click any unit to view details and manage settings
            </li>
            <li className="flex items-start gap-1.5">
              <ChevronRight className="h-3 w-3 mt-0.5 shrink-0" />
              Use the chevron to expand or collapse branches
            </li>
            <li className="flex items-start gap-1.5">
              <ChevronRight className="h-3 w-3 mt-0.5 shrink-0" />
              Drag and drop to reorganize (coming soon)
            </li>
          </ul>
        </div>

        <div className="p-4 rounded-lg border bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <ExternalLink className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-medium">Related Resources</h4>
          </div>
          <ul className="space-y-1.5 text-xs">
            <li>
              <a
                href="/app/admin/organization/people"
                className="text-primary hover:underline flex items-center gap-1.5"
              >
                <Users className="h-3 w-3" />
                Manage People
              </a>
            </li>
            <li>
              <a
                href="/app/admin/organization/groups"
                className="text-primary hover:underline flex items-center gap-1.5"
              >
                <Layers className="h-3 w-3" />
                Manage Groups
              </a>
            </li>
            <li>
              <a
                href="/app/admin/organization/policies"
                className="text-primary hover:underline flex items-center gap-1.5"
              >
                <Shield className="h-3 w-3" />
                Organization Policies
              </a>
            </li>
          </ul>
        </div>

        <div className="p-4 rounded-lg border bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <History className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-medium">Recent Changes</h4>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Engineering division updated
              </span>
              <span className="text-muted-foreground">2h ago</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                New team: Security Engineering
              </span>
              <span className="text-muted-foreground">1d ago</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Budget updated for Finance
              </span>
              <span className="text-muted-foreground">3d ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
