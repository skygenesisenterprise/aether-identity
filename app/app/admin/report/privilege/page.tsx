"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/dashboard/ui/card";
import { MetricCard } from "@/components/dashboard/metric-card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/dashboard/ui/tabs";
import { Badge } from "@/components/dashboard/ui/badge";
import { Button } from "@/components/dashboard/ui/button";
import { Input } from "@/components/dashboard/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/dashboard/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/dashboard/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/dashboard/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Search,
  Clock,
  Users,
  Key,
  Activity,
  Eye,
  FileText,
  AlertTriangle,
  CheckCircle,
  GitBranch,
  Fingerprint,
  TrendingUp,
  Download,
  Network,
  AlertOctagon,
  HelpCircle,
  Info,
  ExternalLink,
  Layers,
  History,
  ScrollText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ==================== TYPES & INTERFACES ====================

export type PrivilegeType =
  | "explicit"
  | "inherited"
  | "delegated"
  | "temporary"
  | "implicit";

export type PrivilegeLevel = "informational" | "elevated" | "critical";

export type IdentityType = "human" | "machine" | "service" | "system";

export type PrivilegeSource =
  | "role_assignment"
  | "policy_grant"
  | "trust_inheritance"
  | "delegation"
  | "break_glass"
  | "emergency_access";

export interface PrivilegeJustification {
  businessReason?: string;
  ticketId?: string;
  approver?: string;
  approvedAt?: string;
  expiresAt?: string;
  reviewedAt?: string;
}

export interface EffectivePrivilege {
  id: string;
  name: string;
  description: string;
  type: PrivilegeType;
  level: PrivilegeLevel;
  resource: {
    id: string;
    type: string;
    name: string;
    scope: string;
  };
  actions: string[];
  conditions?: string[];
  source: {
    type: PrivilegeSource;
    roleId?: string;
    roleName?: string;
    policyId?: string;
    policyName?: string;
    trustId?: string;
    delegatedBy?: string;
  };
  identity: {
    id: string;
    name: string;
    email?: string;
    type: IdentityType;
    organization: string;
    authority: string;
  };
  effectiveSince: string;
  expiresAt?: string;
  lastUsed?: string;
  usageCount: number;
  riskScore: number;
  justification?: PrivilegeJustification;
  path: PrivilegePathNode[];
}

export interface PrivilegePathNode {
  id: string;
  type: "role" | "policy" | "trust" | "permission" | "identity";
  name: string;
  description?: string;
  effective: boolean;
  children?: PrivilegePathNode[];
}

export interface IdentityPrivilegeEntry {
  identityId: string;
  identityName: string;
  identityType: IdentityType;
  organization: string;
  totalPrivileges: number;
  criticalPrivileges: number;
  elevatedPrivileges: number;
  inheritedPrivileges: number;
  delegatedPrivileges: number;
  temporaryPrivileges: number;
  unusedPrivileges: number;
  riskScore: number;
  lastReviewed?: string;
  privileges: EffectivePrivilege[];
}

export interface PrivilegeAccumulation {
  id: string;
  identityId: string;
  identityName: string;
  type: "accumulation" | "drift" | "unused" | "expired_persistent";
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  detectedAt: string;
  affectedPrivileges: string[];
  recommendedAction: string;
}

export interface PrivilegeRisk {
  id: string;
  type:
    | "over_privileged"
    | "toxic_combination"
    | "privilege_escalation"
    | "dormant_high_privilege"
    | "unjustified_access"
    | "orphaned_privilege"
    | "shadow_admin";
  severity: "informational" | "warning" | "critical";
  title: string;
  description: string;
  affectedIdentities: string[];
  affectedPrivileges: string[];
  detectedAt: string;
  evidence: string[];
  recommendation: string;
  remediationPriority: number;
}

export interface PrivilegeSummary {
  totalPrivileges: number;
  totalIdentities: number;
  criticalPrivileges: number;
  elevatedPrivileges: number;
  informationalPrivileges: number;
  inheritedPercentage: number;
  delegatedPercentage: number;
  temporaryPercentage: number;
  unusedPrivileges: number;
  unjustifiedPrivileges: number;
  highRiskIdentities: number;
  activeAccumulations: number;
  activeRisks: number;
  criticalRisks: number;
  trend: Array<{
    date: string;
    total: number;
    critical: number;
    unjustified: number;
    risks: number;
  }>;
  bySource: Array<{
    source: PrivilegeSource;
    count: number;
    percentage: number;
  }>;
  byIdentityType: Array<{
    type: IdentityType;
    count: number;
    avgPrivileges: number;
  }>;
  byRiskLevel: Array<{
    level: string;
    count: number;
  }>;
  topRiskIdentities: Array<{
    identityId: string;
    identityName: string;
    riskScore: number;
    privilegeCount: number;
  }>;
}

export interface PrivilegeFilters {
  identity?: string;
  privilegeType?: PrivilegeType | "all";
  riskLevel?: PrivilegeLevel | "all";
  identityType?: IdentityType | "all";
  source?: PrivilegeSource | "all";
  organization?: string;
  scope?: string;
  usage?: "all" | "used" | "unused";
  justification?: "all" | "justified" | "unjustified";
  search?: string;
}

// ==================== CONSTANTS ====================

const PRIVILEGE_TYPE_LABELS: Record<PrivilegeType, string> = {
  explicit: "Explicit",
  inherited: "Inherited",
  delegated: "Delegated",
  temporary: "Temporary",
  implicit: "Implicit",
};

const RISK_COLORS = {
  informational: {
    bg: "bg-blue-500/10",
    text: "text-blue-700",
    border: "border-blue-500/20",
    icon: Info,
  },
  elevated: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-700",
    border: "border-yellow-500/20",
    icon: AlertTriangle,
  },
  critical: {
    bg: "bg-red-500/10",
    text: "text-red-700",
    border: "border-red-500/20",
    icon: AlertOctagon,
  },
};

const SOURCE_TYPE_LABELS: Record<PrivilegeSource, string> = {
  role_assignment: "Role Assignment",
  policy_grant: "Policy Grant",
  trust_inheritance: "Trust Inheritance",
  delegation: "Delegation",
  break_glass: "Break Glass",
  emergency_access: "Emergency Access",
};

const IDENTITY_TYPE_ICONS: Record<IdentityType, React.ElementType> = {
  human: Users,
  machine: Key,
  service: Network,
  system: Shield,
};

// ==================== MOCK DATA ====================

const MOCK_PRIVILEGES: EffectivePrivilege[] = [
  {
    id: "priv-001",
    name: "Production Database Admin",
    description: "Full administrative access to production databases",
    type: "explicit",
    level: "critical",
    resource: {
      id: "res-db-prod",
      type: "database",
      name: "Production PostgreSQL Cluster",
      scope: "global",
    },
    actions: ["read", "write", "admin", "backup", "restore"],
    conditions: ["MFA required", "Business hours only"],
    source: {
      type: "role_assignment",
      roleId: "role-db-admin",
      roleName: "Database Administrator",
    },
    identity: {
      id: "user-001",
      name: "alice.chen@company.com",
      email: "alice.chen@company.com",
      type: "human",
      organization: "Engineering",
      authority: "Aether Production",
    },
    effectiveSince: "2024-01-15T08:00:00Z",
    lastUsed: "2025-02-08T14:30:00Z",
    usageCount: 234,
    riskScore: 85,
    justification: {
      businessReason: "Database maintenance and incident response",
      ticketId: "TKT-2024-001",
      approver: "CTO",
      approvedAt: "2024-01-10T10:00:00Z",
      reviewedAt: "2024-12-15T09:00:00Z",
    },
    path: [
      { id: "user-001", type: "identity", name: "Alice Chen", effective: true },
      {
        id: "role-db-admin",
        type: "role",
        name: "DB Admin Role",
        effective: true,
      },
      {
        id: "pol-db-access",
        type: "policy",
        name: "DB Access Policy",
        effective: true,
      },
      {
        id: "priv-001",
        type: "permission",
        name: "Admin Privilege",
        effective: true,
      },
    ],
  },
  {
    id: "priv-002",
    name: "Kubernetes Cluster Admin",
    description: "Full cluster administrative access",
    type: "inherited",
    level: "critical",
    resource: {
      id: "res-k8s-prod",
      type: "infrastructure",
      name: "Production Kubernetes",
      scope: "cluster-wide",
    },
    actions: ["create", "delete", "admin", "exec", "logs"],
    source: {
      type: "trust_inheritance",
      trustId: "trust-001",
    },
    identity: {
      id: "svc-deploy",
      name: "deployment-service",
      type: "service",
      organization: "Platform",
      authority: "Aether Production",
    },
    effectiveSince: "2024-06-01T00:00:00Z",
    lastUsed: "2025-02-09T10:15:00Z",
    usageCount: 5678,
    riskScore: 75,
    path: [
      {
        id: "svc-deploy",
        type: "identity",
        name: "Deployment Service",
        effective: true,
      },
      {
        id: "trust-001",
        type: "trust",
        name: "Infrastructure Trust",
        effective: true,
      },
      {
        id: "role-k8s-admin",
        type: "role",
        name: "K8s Admin",
        effective: true,
      },
      {
        id: "priv-002",
        type: "permission",
        name: "Cluster Admin",
        effective: true,
      },
    ],
  },
  {
    id: "priv-003",
    name: "Temporary Security Audit Access",
    description: "Read-only access for security audit",
    type: "temporary",
    level: "elevated",
    resource: {
      id: "res-security",
      type: "application",
      name: "Security Dashboard",
      scope: "audit",
    },
    actions: ["read", "export"],
    conditions: ["Audit period only", "Session recorded"],
    source: {
      type: "delegation",
      delegatedBy: "security-lead@company.com",
    },
    identity: {
      id: "user-002",
      name: "bob.auditor@external.com",
      email: "bob.auditor@external.com",
      type: "human",
      organization: "External Audit",
      authority: "Aether Production",
    },
    effectiveSince: "2025-02-01T00:00:00Z",
    expiresAt: "2025-02-28T23:59:59Z",
    lastUsed: "2025-02-08T16:45:00Z",
    usageCount: 12,
    riskScore: 45,
    justification: {
      businessReason: "Q1 2025 Security Audit",
      ticketId: "AUDIT-2025-Q1",
      approver: "CISO",
      approvedAt: "2025-01-28T09:00:00Z",
      expiresAt: "2025-02-28T23:59:59Z",
    },
    path: [
      {
        id: "user-002",
        type: "identity",
        name: "Bob Auditor",
        effective: true,
      },
      {
        id: "del-001",
        type: "trust",
        name: "Audit Delegation",
        effective: true,
      },
      {
        id: "priv-003",
        type: "permission",
        name: "Audit Read",
        effective: true,
      },
    ],
  },
  {
    id: "priv-004",
    name: "AWS Production ReadOnly",
    description: "Read-only access to AWS production resources",
    type: "explicit",
    level: "informational",
    resource: {
      id: "res-aws-prod",
      type: "cloud",
      name: "AWS Production Account",
      scope: "read-only",
    },
    actions: ["read", "list", "describe"],
    source: {
      type: "policy_grant",
      policyId: "pol-aws-read",
      policyName: "AWS ReadOnly Policy",
    },
    identity: {
      id: "user-003",
      name: "charlie.dev@company.com",
      email: "charlie.dev@company.com",
      type: "human",
      organization: "Engineering",
      authority: "Aether Production",
    },
    effectiveSince: "2024-03-15T10:00:00Z",
    lastUsed: "2024-12-20T11:00:00Z",
    usageCount: 3,
    riskScore: 15,
    path: [
      {
        id: "user-003",
        type: "identity",
        name: "Charlie Dev",
        effective: true,
      },
      {
        id: "pol-aws-read",
        type: "policy",
        name: "AWS Read Policy",
        effective: true,
      },
      { id: "priv-004", type: "permission", name: "AWS Read", effective: true },
    ],
  },
  {
    id: "priv-005",
    name: "Break Glass Root Access",
    description: "Emergency root access for critical incidents",
    type: "implicit",
    level: "critical",
    resource: {
      id: "res-root",
      type: "system",
      name: "Root Infrastructure",
      scope: "global",
    },
    actions: ["admin", "root", "emergency"],
    conditions: [
      "Emergency only",
      "Dual authorization required",
      "Auto-revoke after 4h",
    ],
    source: {
      type: "break_glass",
    },
    identity: {
      id: "user-004",
      name: "diana.oncall@company.com",
      email: "diana.oncall@company.com",
      type: "human",
      organization: "SRE",
      authority: "Aether Production",
    },
    effectiveSince: "2024-01-01T00:00:00Z",
    lastUsed: "2024-11-15T03:00:00Z",
    usageCount: 2,
    riskScore: 95,
    justification: {
      businessReason: "Emergency response capability",
      approver: "VP Engineering",
      approvedAt: "2024-01-01T00:00:00Z",
    },
    path: [
      {
        id: "user-004",
        type: "identity",
        name: "Diana On-Call",
        effective: true,
      },
      {
        id: "bg-001",
        type: "policy",
        name: "Break Glass Policy",
        effective: true,
      },
      {
        id: "priv-005",
        type: "permission",
        name: "Root Access",
        effective: false,
      },
    ],
  },
];

const MOCK_IDENTITY_MATRIX: IdentityPrivilegeEntry[] = [
  {
    identityId: "user-001",
    identityName: "alice.chen@company.com",
    identityType: "human",
    organization: "Engineering",
    totalPrivileges: 12,
    criticalPrivileges: 3,
    elevatedPrivileges: 5,
    inheritedPrivileges: 4,
    delegatedPrivileges: 0,
    temporaryPrivileges: 1,
    unusedPrivileges: 2,
    riskScore: 78,
    lastReviewed: "2024-12-15T09:00:00Z",
    privileges: MOCK_PRIVILEGES.filter((p) => p.identity.id === "user-001"),
  },
  {
    identityId: "svc-deploy",
    identityName: "deployment-service",
    identityType: "service",
    organization: "Platform",
    totalPrivileges: 8,
    criticalPrivileges: 2,
    elevatedPrivileges: 4,
    inheritedPrivileges: 6,
    delegatedPrivileges: 0,
    temporaryPrivileges: 0,
    unusedPrivileges: 1,
    riskScore: 65,
    privileges: MOCK_PRIVILEGES.filter((p) => p.identity.id === "svc-deploy"),
  },
  {
    identityId: "user-002",
    identityName: "bob.auditor@external.com",
    identityType: "human",
    organization: "External Audit",
    totalPrivileges: 3,
    criticalPrivileges: 0,
    elevatedPrivileges: 2,
    inheritedPrivileges: 0,
    delegatedPrivileges: 1,
    temporaryPrivileges: 2,
    unusedPrivileges: 0,
    riskScore: 42,
    privileges: MOCK_PRIVILEGES.filter((p) => p.identity.id === "user-002"),
  },
  {
    identityId: "user-003",
    identityName: "charlie.dev@company.com",
    identityType: "human",
    organization: "Engineering",
    totalPrivileges: 6,
    criticalPrivileges: 0,
    elevatedPrivileges: 1,
    inheritedPrivileges: 2,
    delegatedPrivileges: 0,
    temporaryPrivileges: 0,
    unusedPrivileges: 4,
    riskScore: 25,
    privileges: MOCK_PRIVILEGES.filter((p) => p.identity.id === "user-003"),
  },
  {
    identityId: "user-004",
    identityName: "diana.oncall@company.com",
    identityType: "human",
    organization: "SRE",
    totalPrivileges: 15,
    criticalPrivileges: 5,
    elevatedPrivileges: 6,
    inheritedPrivileges: 3,
    delegatedPrivileges: 0,
    temporaryPrivileges: 0,
    unusedPrivileges: 8,
    riskScore: 88,
    lastReviewed: "2024-11-01T10:00:00Z",
    privileges: MOCK_PRIVILEGES.filter((p) => p.identity.id === "user-004"),
  },
];

const MOCK_ACCUMULATIONS: PrivilegeAccumulation[] = [
  {
    id: "acc-001",
    identityId: "user-004",
    identityName: "diana.oncall@company.com",
    type: "accumulation",
    description:
      "Identity has accumulated 15 privileges over 3 years without review",
    severity: "high",
    detectedAt: "2025-02-09T00:00:00Z",
    affectedPrivileges: ["priv-005", "priv-006", "priv-007"],
    recommendedAction:
      "Conduct comprehensive access review and remove unnecessary privileges",
  },
  {
    id: "acc-002",
    identityId: "user-003",
    identityName: "charlie.dev@company.com",
    type: "unused",
    description: "4 out of 6 privileges have not been used in 90+ days",
    severity: "medium",
    detectedAt: "2025-02-08T00:00:00Z",
    affectedPrivileges: ["priv-004"],
    recommendedAction: "Revoke unused privileges or document continued need",
  },
  {
    id: "acc-003",
    identityId: "legacy-svc",
    identityName: "legacy-integration-service",
    type: "expired_persistent",
    description: "Temporary privileges granted 6 months ago are still active",
    severity: "critical",
    detectedAt: "2025-02-09T08:00:00Z",
    affectedPrivileges: ["priv-expired-001"],
    recommendedAction: "Immediately revoke expired temporary privileges",
  },
];

const MOCK_RISKS: PrivilegeRisk[] = [
  {
    id: "risk-001",
    type: "toxic_combination",
    severity: "critical",
    title: "Toxic Privilege Combination Detected",
    description:
      "User has both deployment and production database admin privileges, enabling potential data exfiltration",
    affectedIdentities: ["user-001"],
    affectedPrivileges: ["priv-001", "priv-008"],
    detectedAt: "2025-02-09T10:00:00Z",
    evidence: ["priv-001", "priv-008", "cross-resource-analysis"],
    recommendation:
      "Implement separation of duties - split deployment and database admin roles",
    remediationPriority: 1,
  },
  {
    id: "risk-002",
    type: "dormant_high_privilege",
    severity: "warning",
    title: "Dormant High-Privilege Account",
    description:
      "Break glass access has not been reviewed in 60+ days despite high risk score",
    affectedIdentities: ["user-004"],
    affectedPrivileges: ["priv-005"],
    detectedAt: "2025-02-08T00:00:00Z",
    evidence: ["priv-005", "usage-logs"],
    recommendation: "Require quarterly review of all break glass access",
    remediationPriority: 3,
  },
  {
    id: "risk-003",
    type: "shadow_admin",
    severity: "critical",
    title: "Shadow Admin Path Detected",
    description:
      "Service account can escalate privileges through inherited trust chain",
    affectedIdentities: ["svc-deploy"],
    affectedPrivileges: ["priv-002", "priv-009"],
    detectedAt: "2025-02-09T09:30:00Z",
    evidence: ["trust-001", "role-k8s-admin", "path-analysis"],
    recommendation:
      "Review trust inheritance chain and implement privilege boundaries",
    remediationPriority: 1,
  },
  {
    id: "risk-004",
    type: "unjustified_access",
    severity: "informational",
    title: "Privileges Missing Business Justification",
    description:
      "12% of effective privileges lack documented business justification",
    affectedIdentities: ["user-003"],
    affectedPrivileges: ["priv-004"],
    detectedAt: "2025-02-01T00:00:00Z",
    evidence: ["justification-audit"],
    recommendation:
      "Enforce justification requirements for all privilege grants",
    remediationPriority: 5,
  },
];

const PRIVILEGE_SUMMARY: PrivilegeSummary = {
  totalPrivileges: 2458,
  totalIdentities: 342,
  criticalPrivileges: 89,
  elevatedPrivileges: 456,
  informationalPrivileges: 1913,
  inheritedPercentage: 34.2,
  delegatedPercentage: 8.5,
  temporaryPercentage: 12.3,
  unusedPrivileges: 312,
  unjustifiedPrivileges: 156,
  highRiskIdentities: 23,
  activeAccumulations: 8,
  activeRisks: 15,
  criticalRisks: 3,
  trend: [
    {
      date: "2024-02-03",
      total: 2389,
      critical: 85,
      unjustified: 142,
      risks: 12,
    },
    {
      date: "2024-02-04",
      total: 2395,
      critical: 86,
      unjustified: 145,
      risks: 13,
    },
    {
      date: "2024-02-05",
      total: 2401,
      critical: 87,
      unjustified: 148,
      risks: 13,
    },
    {
      date: "2024-02-06",
      total: 2420,
      critical: 88,
      unjustified: 152,
      risks: 14,
    },
    {
      date: "2024-02-07",
      total: 2445,
      critical: 89,
      unjustified: 154,
      risks: 14,
    },
    {
      date: "2024-02-08",
      total: 2450,
      critical: 89,
      unjustified: 155,
      risks: 15,
    },
    {
      date: "2025-02-09",
      total: 2458,
      critical: 89,
      unjustified: 156,
      risks: 15,
    },
  ],
  bySource: [
    { source: "role_assignment", count: 1245, percentage: 50.6 },
    { source: "policy_grant", count: 567, percentage: 23.1 },
    { source: "trust_inheritance", count: 421, percentage: 17.1 },
    { source: "delegation", count: 134, percentage: 5.5 },
    { source: "break_glass", count: 67, percentage: 2.7 },
    { source: "emergency_access", count: 24, percentage: 1.0 },
  ],
  byIdentityType: [
    { type: "human", count: 234, avgPrivileges: 4.2 },
    { type: "machine", count: 67, avgPrivileges: 12.8 },
    { type: "service", count: 34, avgPrivileges: 18.5 },
    { type: "system", count: 7, avgPrivileges: 28.3 },
  ],
  byRiskLevel: [
    { level: "informational", count: 1913 },
    { level: "elevated", count: 456 },
    { level: "critical", count: 89 },
  ],
  topRiskIdentities: [
    {
      identityId: "user-004",
      identityName: "diana.oncall@company.com",
      riskScore: 88,
      privilegeCount: 15,
    },
    {
      identityId: "user-001",
      identityName: "alice.chen@company.com",
      riskScore: 78,
      privilegeCount: 12,
    },
    {
      identityId: "svc-deploy",
      identityName: "deployment-service",
      riskScore: 65,
      privilegeCount: 8,
    },
  ],
};

// ==================== HELPER COMPONENTS ====================

function TimeDisplay() {
  const [time, setTime] = React.useState<string>("");

  React.useEffect(() => {
    setTime(new Date().toLocaleString());
  }, []);

  return <span suppressHydrationWarning>{time}</span>;
}

function PrivilegeTypeBadge({ type }: { type: PrivilegeType }) {
  const colors = {
    explicit: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    inherited: "bg-purple-500/10 text-purple-700 border-purple-500/20",
    delegated: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    temporary: "bg-green-500/10 text-green-700 border-green-500/20",
    implicit: "bg-gray-500/10 text-gray-700 border-gray-500/20",
  };

  return (
    <Badge variant="outline" className={cn("gap-1", colors[type])}>
      {PRIVILEGE_TYPE_LABELS[type]}
    </Badge>
  );
}

function RiskLevelBadge({ level }: { level: PrivilegeLevel | "warning" }) {
  const mappedLevel = level === "warning" ? "elevated" : level;
  const config = RISK_COLORS[mappedLevel];
  const Icon = config.icon;
  return (
    <Badge
      variant="outline"
      className={cn("gap-1", config.bg, config.text, config.border)}
    >
      <Icon className="h-3 w-3" />
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </Badge>
  );
}

function SourceBadge({ source }: { source: PrivilegeSource }) {
  return (
    <Badge variant="outline" className="text-xs">
      {SOURCE_TYPE_LABELS[source]}
    </Badge>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const colors = {
    low: "bg-green-500/10 text-green-700",
    medium: "bg-yellow-500/10 text-yellow-700",
    high: "bg-orange-500/10 text-orange-700",
    critical: "bg-red-500/10 text-red-700",
  };

  return (
    <Badge
      variant="outline"
      className={cn("capitalize", colors[severity as keyof typeof colors])}
    >
      {severity}
    </Badge>
  );
}

function RiskTypeBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    over_privileged: "Over-Privileged",
    toxic_combination: "Toxic Combination",
    privilege_escalation: "Privilege Escalation",
    dormant_high_privilege: "Dormant High Privilege",
    unjustified_access: "Unjustified Access",
    orphaned_privilege: "Orphaned Privilege",
    shadow_admin: "Shadow Admin",
  };

  return (
    <Badge variant="secondary" className="text-xs capitalize">
      {labels[type] || type}
    </Badge>
  );
}

function AccumulationTypeBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    accumulation: "Privilege Accumulation",
    drift: "Privilege Drift",
    unused: "Unused Privileges",
    expired_persistent: "Expired but Persistent",
  };

  return (
    <Badge variant="secondary" className="text-xs capitalize">
      {labels[type] || type}
    </Badge>
  );
}

// ==================== CHART COMPONENTS ====================

function PrivilegeTrendChart({ data }: { data: PrivilegeSummary["trend"] }) {
  return (
    <ChartContainer config={{}} className="h-[300px]">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="date"
          className="text-xs"
          tickLine={false}
          axisLine={false}
        />
        <YAxis className="text-xs" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
          name="Total Privileges"
        />
        <Line
          type="monotone"
          dataKey="critical"
          stroke="#ef4444"
          strokeWidth={2}
          dot={false}
          name="Critical"
        />
        <Line
          type="monotone"
          dataKey="unjustified"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={false}
          name="Unjustified"
        />
        <Line
          type="monotone"
          dataKey="risks"
          stroke="#8b5cf6"
          strokeWidth={2}
          dot={false}
          name="Active Risks"
        />
      </LineChart>
    </ChartContainer>
  );
}

function PrivilegeSourceChart({
  data,
}: {
  data: PrivilegeSummary["bySource"];
}) {
  return (
    <ChartContainer config={{}} className="h-[250px]">
      <BarChart data={data} layout="vertical">
        <CartesianGrid
          strokeDasharray="3 3"
          className="stroke-muted"
          horizontal={false}
        />
        <XAxis
          type="number"
          className="text-xs"
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          dataKey="source"
          type="category"
          className="text-xs"
          tickLine={false}
          axisLine={false}
          width={120}
          tickFormatter={(value) =>
            SOURCE_TYPE_LABELS[value as PrivilegeSource]
          }
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="currentColor" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ChartContainer>
  );
}

function RiskDistributionChart({
  data,
}: {
  data: PrivilegeSummary["byRiskLevel"];
}) {
  const COLORS = ["#3b82f6", "#f59e0b", "#ef4444"];

  return (
    <ChartContainer config={{}} className="h-[250px]">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="count"
          nameKey="level"
          label={({ level, count }) => `${level}: ${count}`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
      </PieChart>
    </ChartContainer>
  );
}

function IdentityTypeDistributionChart({
  data,
}: {
  data: PrivilegeSummary["byIdentityType"];
}) {
  return (
    <ChartContainer config={{}} className="h-[250px]">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="type"
          className="text-xs"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) =>
            value.charAt(0).toUpperCase() + value.slice(1)
          }
        />
        <YAxis className="text-xs" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="currentColor" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}

// ==================== TABLE COMPONENTS ====================

function PrivilegeMatrixTable({
  entries,
  onViewDetail,
}: {
  entries: IdentityPrivilegeEntry[];
  onViewDetail: (entry: IdentityPrivilegeEntry) => void;
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Identity</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right text-red-600">Critical</TableHead>
            <TableHead className="text-right text-yellow-600">
              Elevated
            </TableHead>
            <TableHead className="text-right">Inherited</TableHead>
            <TableHead className="text-right">Unused</TableHead>
            <TableHead>Risk Score</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => {
            const IdentityIcon = IDENTITY_TYPE_ICONS[entry.identityType];
            return (
              <TableRow key={entry.identityId}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <IdentityIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-sm">
                        {entry.identityName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {entry.identityId}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="capitalize text-sm">
                    {entry.identityType}
                  </span>
                </TableCell>
                <TableCell className="text-sm">{entry.organization}</TableCell>
                <TableCell className="text-right font-medium">
                  {entry.totalPrivileges}
                </TableCell>
                <TableCell className="text-right">
                  {entry.criticalPrivileges > 0 ? (
                    <span className="text-red-600 font-medium">
                      {entry.criticalPrivileges}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {entry.elevatedPrivileges > 0 ? (
                    <span className="text-yellow-600 font-medium">
                      {entry.elevatedPrivileges}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {entry.inheritedPrivileges > 0
                    ? entry.inheritedPrivileges
                    : "-"}
                </TableCell>
                <TableCell className="text-right">
                  {entry.unusedPrivileges > 0 ? (
                    <Badge
                      variant="outline"
                      className="text-xs text-orange-600"
                    >
                      {entry.unusedPrivileges}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          entry.riskScore >= 70
                            ? "bg-red-500"
                            : entry.riskScore >= 40
                              ? "bg-yellow-500"
                              : "bg-green-500",
                        )}
                        style={{ width: `${entry.riskScore}%` }}
                      />
                    </div>
                    <span className="text-sm">{entry.riskScore}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetail(entry)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function PrivilegeDetailTable({
  privileges,
  onViewPath,
}: {
  privileges: EffectivePrivilege[];
  onViewPath: (privilege: EffectivePrivilege) => void;
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Privilege</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Resource</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Last Used</TableHead>
            <TableHead>Justification</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {privileges.map((priv) => (
            <TableRow key={priv.id}>
              <TableCell>
                <div>
                  <div className="font-medium text-sm">{priv.name}</div>
                  <div className="text-xs text-muted-foreground">{priv.id}</div>
                </div>
              </TableCell>
              <TableCell>
                <PrivilegeTypeBadge type={priv.type} />
              </TableCell>
              <TableCell>
                <RiskLevelBadge level={priv.level} />
              </TableCell>
              <TableCell>
                <div>
                  <div className="text-sm">{priv.resource.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {priv.resource.type}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <SourceBadge source={priv.source.type} />
              </TableCell>
              <TableCell>
                {priv.lastUsed ? (
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    {new Date(priv.lastUsed).toLocaleDateString()}
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">Never</span>
                )}
              </TableCell>
              <TableCell>
                {priv.justification ? (
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-muted-foreground">
                      {priv.justification.ticketId || "Approved"}
                    </span>
                  </div>
                ) : (
                  <Badge variant="outline" className="text-xs text-red-600">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Missing
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewPath(priv)}
                >
                  <GitBranch className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function AccumulationTable({
  accumulations,
}: {
  accumulations: PrivilegeAccumulation[];
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Identity</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Detected</TableHead>
            <TableHead>Recommendation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accumulations.map((acc) => (
            <TableRow key={acc.id}>
              <TableCell>
                <div>
                  <div className="font-medium text-sm">{acc.identityName}</div>
                  <div className="text-xs text-muted-foreground">
                    {acc.identityId}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <AccumulationTypeBadge type={acc.type} />
              </TableCell>
              <TableCell>
                <SeverityBadge severity={acc.severity} />
              </TableCell>
              <TableCell className="text-sm max-w-[300px]">
                {acc.description}
              </TableCell>
              <TableCell className="text-sm">
                {new Date(acc.detectedAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-sm max-w-[250px]">
                {acc.recommendedAction}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function RiskTable({ risks }: { risks: PrivilegeRisk[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Risk</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Affected Identities</TableHead>
            <TableHead>Detected</TableHead>
            <TableHead>Priority</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {risks.map((risk) => (
            <TableRow key={risk.id}>
              <TableCell>
                <div>
                  <div className="font-medium text-sm">{risk.title}</div>
                  <div className="text-xs text-muted-foreground max-w-[300px] truncate">
                    {risk.description}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <RiskTypeBadge type={risk.type} />
              </TableCell>
              <TableCell>
                <RiskLevelBadge level={risk.severity} />
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {risk.affectedIdentities.slice(0, 2).map((id, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {id}
                    </Badge>
                  ))}
                  {risk.affectedIdentities.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{risk.affectedIdentities.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-sm">
                {new Date(risk.detectedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        risk.remediationPriority <= 2
                          ? "bg-red-500"
                          : risk.remediationPriority <= 4
                            ? "bg-yellow-500"
                            : "bg-blue-500",
                      )}
                      style={{
                        width: `${(6 - risk.remediationPriority) * 20}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs">{risk.remediationPriority}</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ==================== PATH VISUALIZATION ====================

function PrivilegePathVisualization({ path }: { path: PrivilegePathNode[] }) {
  return (
    <div className="flex flex-col gap-2">
      {path.map((node, index) => (
        <div key={node.id} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2",
                node.effective
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-muted border-muted-foreground/30 text-muted-foreground",
              )}
            >
              {node.type === "identity" && <Fingerprint className="h-4 w-4" />}
              {node.type === "role" && <Shield className="h-4 w-4" />}
              {node.type === "policy" && <FileText className="h-4 w-4" />}
              {node.type === "trust" && <Network className="h-4 w-4" />}
              {node.type === "permission" && <Key className="h-4 w-4" />}
            </div>
            {index < path.length - 1 && <div className="w-0.5 h-8 bg-border" />}
          </div>
          <div className="flex-1 pb-4">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{node.name}</span>
              <Badge variant="outline" className="text-xs capitalize">
                {node.type}
              </Badge>
              {!node.effective && (
                <Badge
                  variant="outline"
                  className="text-xs text-muted-foreground"
                >
                  Inactive
                </Badge>
              )}
            </div>
            {node.description && (
              <p className="text-xs text-muted-foreground mt-1">
                {node.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ==================== FILTER BAR ====================

function FilterBar({
  filters,
  onFiltersChange,
  onExport,
}: {
  filters: PrivilegeFilters;
  onFiltersChange: (filters: PrivilegeFilters) => void;
  onExport: (format: "csv" | "json" | "pdf") => void;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search identities, privileges..."
            className="pl-9"
            value={filters.search || ""}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
          />
        </div>
        <Select
          value={filters.privilegeType || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              privilegeType: value as PrivilegeFilters["privilegeType"],
            })
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Privilege Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="explicit">Explicit</SelectItem>
            <SelectItem value="inherited">Inherited</SelectItem>
            <SelectItem value="delegated">Delegated</SelectItem>
            <SelectItem value="temporary">Temporary</SelectItem>
            <SelectItem value="implicit">Implicit</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.riskLevel || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              riskLevel: value as PrivilegeFilters["riskLevel"],
            })
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Risk Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="informational">Informational</SelectItem>
            <SelectItem value="elevated">Elevated</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.identityType || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              identityType: value as PrivilegeFilters["identityType"],
            })
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Identity Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="human">Human</SelectItem>
            <SelectItem value="machine">Machine</SelectItem>
            <SelectItem value="service">Service</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.usage || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              usage: value as PrivilegeFilters["usage"],
            })
          }
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Usage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="used">Used</SelectItem>
            <SelectItem value="unused">Unused</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.justification || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              justification: value as PrivilegeFilters["justification"],
            })
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Justification" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="justified">Justified</SelectItem>
            <SelectItem value="unjustified">Unjustified</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
        <Select
          onValueChange={(value) => onExport(value as "csv" | "json" | "pdf")}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Export" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="csv">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> CSV
              </div>
            </SelectItem>
            <SelectItem value="json">
              <div className="flex items-center gap-2">
                <ScrollText className="h-4 w-4" /> JSON
              </div>
            </SelectItem>
            <SelectItem value="pdf">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> PDF
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// ==================== DIALOG COMPONENTS ====================

function IdentityDetailDialog({
  entry,
  onClose,
  onViewPath,
}: {
  entry: IdentityPrivilegeEntry;
  onClose: () => void;
  onViewPath: (privilege: EffectivePrivilege) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Fingerprint className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">{entry.identityName}</CardTitle>
                <CardDescription>
                  {entry.identityId} • {entry.organization}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize">
                {entry.identityType}
              </Badge>
              <RiskLevelBadge
                level={
                  entry.riskScore >= 70
                    ? "critical"
                    : entry.riskScore >= 40
                      ? "elevated"
                      : "informational"
                }
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {entry.totalPrivileges}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total Privileges
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">
                  {entry.criticalPrivileges}
                </div>
                <p className="text-xs text-muted-foreground">Critical</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-yellow-600">
                  {entry.elevatedPrivileges}
                </div>
                <p className="text-xs text-muted-foreground">Elevated</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">
                  {entry.unusedPrivileges}
                </div>
                <p className="text-xs text-muted-foreground">Unused</p>
              </CardContent>
            </Card>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Effective Privileges</h4>
            <PrivilegeDetailTable
              privileges={entry.privileges}
              onViewPath={onViewPath}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/admin/platform/identity?id=${entry.identityId}`}>
                <ExternalLink className="h-4 w-4 mr-2" /> View Identity
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PrivilegePathDialog({
  privilege,
  onClose,
}: {
  privilege: EffectivePrivilege;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <GitBranch className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  Privilege Attribution Path
                </CardTitle>
                <CardDescription>{privilege.name}</CardDescription>
              </div>
            </div>
            <PrivilegeTypeBadge type={privilege.type} />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <PrivilegePathVisualization path={privilege.path} />

          <div className="mt-6 pt-6 border-t">
            <h4 className="font-semibold mb-2">Privilege Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Resource:</span>
                <p className="font-medium">{privilege.resource.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Actions:</span>
                <p className="font-medium">{privilege.actions.join(", ")}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Effective Since:</span>
                <p className="font-medium">
                  {new Date(privilege.effectiveSince).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Risk Score:</span>
                <p className="font-medium">{privilege.riskScore}/100</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 mt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ==================== MAIN PAGE ====================

export default function PrivilegeReportPage() {
  const [filters, setFilters] = React.useState<PrivilegeFilters>({});
  const [activeTab, setActiveTab] = React.useState("overview");
  const [selectedIdentity, setSelectedIdentity] =
    React.useState<IdentityPrivilegeEntry | null>(null);
  const [selectedPrivilegePath, setSelectedPrivilegePath] =
    React.useState<EffectivePrivilege | null>(null);

  const handleExport = (format: "csv" | "json" | "pdf") => {
    console.log(`Exporting privilege report as ${format}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Privilege Report
          </h1>
          <p className="text-muted-foreground mt-1">
            Visualize, analyze, and evaluate effective privileges across your
            identity ecosystem
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">
              Report Generated
            </div>
            <div className="text-sm font-medium">
              <TimeDisplay />
            </div>
          </div>
          <Badge variant="outline" className="bg-blue-500/10 text-blue-700">
            <Eye className="h-3 w-3 mr-1" />
            Read-Only
          </Badge>
        </div>
      </div>

      {/* Cross-Navigation */}
      <div className="flex flex-wrap gap-2">
        <Link href="/admin/organization/rbac">
          <Button variant="outline" size="sm" className="gap-1">
            <Shield className="h-3 w-3" />
            RBAC Management
            <ExternalLink className="h-3 w-3" />
          </Button>
        </Link>
        <Link href="/admin/organization/policies">
          <Button variant="outline" size="sm" className="gap-1">
            <FileText className="h-3 w-3" />
            Policies
            <ExternalLink className="h-3 w-3" />
          </Button>
        </Link>
        <Link href="/admin/platform/identity">
          <Button variant="outline" size="sm" className="gap-1">
            <Fingerprint className="h-3 w-3" />
            Identity Engine
            <ExternalLink className="h-3 w-3" />
          </Button>
        </Link>
        <Link href="/admin/platform/token">
          <Button variant="outline" size="sm" className="gap-1">
            <Key className="h-3 w-3" />
            Token Management
            <ExternalLink className="h-3 w-3" />
          </Button>
        </Link>
        <Link href="/admin/report/access">
          <Button variant="outline" size="sm" className="gap-1">
            <Activity className="h-3 w-3" />
            Access Report
            <ExternalLink className="h-3 w-3" />
          </Button>
        </Link>
        <Link href="/admin/report/cross_authority">
          <Button variant="outline" size="sm" className="gap-1">
            <Network className="h-3 w-3" />
            Cross-Authority
            <ExternalLink className="h-3 w-3" />
          </Button>
        </Link>
        <Link href="/admin/security/audit">
          <Button variant="outline" size="sm" className="gap-1">
            <ScrollText className="h-3 w-3" />
            Audit Logs
            <ExternalLink className="h-3 w-3" />
          </Button>
        </Link>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6 lg:w-[800px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="matrix">Identity Matrix</TabsTrigger>
          <TabsTrigger value="paths">Paths</TabsTrigger>
          <TabsTrigger value="accumulation">Accumulation</TabsTrigger>
          <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Privileges"
              value={PRIVILEGE_SUMMARY.totalPrivileges.toLocaleString()}
              icon={Key}
              variant="default"
              subtitle={`${PRIVILEGE_SUMMARY.totalIdentities} identities`}
            />
            <MetricCard
              title="Critical Privileges"
              value={PRIVILEGE_SUMMARY.criticalPrivileges.toString()}
              icon={AlertOctagon}
              variant="destructive"
              trend={{ value: 2.1, isPositive: false }}
              subtitle={`${PRIVILEGE_SUMMARY.elevatedPrivileges} elevated`}
            />
            <MetricCard
              title="Unjustified Access"
              value={PRIVILEGE_SUMMARY.unjustifiedPrivileges.toString()}
              icon={HelpCircle}
              variant="warning"
              subtitle="Missing business reason"
            />
            <MetricCard
              title="Active Risks"
              value={PRIVILEGE_SUMMARY.activeRisks.toString()}
              icon={ShieldAlert}
              variant="destructive"
              subtitle={`${PRIVILEGE_SUMMARY.criticalRisks} critical`}
            />
          </div>

          {/* Secondary Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Privilege Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Inherited</span>
                    <span className="font-medium">
                      {PRIVILEGE_SUMMARY.inheritedPercentage}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delegated</span>
                    <span className="font-medium">
                      {PRIVILEGE_SUMMARY.delegatedPercentage}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Temporary</span>
                    <span className="font-medium">
                      {PRIVILEGE_SUMMARY.temporaryPercentage}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Unused (90d+)</span>
                    <span className="font-medium text-orange-600">
                      {PRIVILEGE_SUMMARY.unusedPrivileges}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  High-Risk Identities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {PRIVILEGE_SUMMARY.topRiskIdentities.map((identity) => (
                    <div
                      key={identity.identityId}
                      className="flex items-center justify-between"
                    >
                      <div className="text-sm truncate max-w-[150px]">
                        {identity.identityName}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              identity.riskScore >= 70
                                ? "bg-red-500"
                                : "bg-yellow-500",
                            )}
                            style={{ width: `${identity.riskScore}%` }}
                          />
                        </div>
                        <span className="text-xs">{identity.riskScore}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Privilege Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {PRIVILEGE_SUMMARY.bySource.slice(0, 4).map((source) => (
                    <div
                      key={source.source}
                      className="flex justify-between text-sm items-center"
                    >
                      <span className="text-muted-foreground truncate max-w-[150px]">
                        {SOURCE_TYPE_LABELS[source.source]}
                      </span>
                      <span className="font-medium">{source.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Privilege Trend</CardTitle>
                <CardDescription>
                  Evolution of privileges and risks over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PrivilegeTrendChart data={PRIVILEGE_SUMMARY.trend} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
                <CardDescription>Privileges by risk level</CardDescription>
              </CardHeader>
              <CardContent>
                <RiskDistributionChart data={PRIVILEGE_SUMMARY.byRiskLevel} />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Privilege Sources</CardTitle>
                <CardDescription>
                  Distribution by attribution source
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PrivilegeSourceChart data={PRIVILEGE_SUMMARY.bySource} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Identity Type Distribution</CardTitle>
                <CardDescription>
                  Privileges by identity category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <IdentityTypeDistributionChart
                  data={PRIVILEGE_SUMMARY.byIdentityType}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* IDENTITY MATRIX TAB */}
        <TabsContent value="matrix" className="space-y-6 mt-6">
          <FilterBar
            filters={filters}
            onFiltersChange={setFilters}
            onExport={handleExport}
          />
          <Card>
            <CardHeader>
              <CardTitle>Identity Privilege Matrix</CardTitle>
              <CardDescription>
                Cross-reference identities with their effective privileges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PrivilegeMatrixTable
                entries={MOCK_IDENTITY_MATRIX}
                onViewDetail={setSelectedIdentity}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* PATHS TAB */}
        <TabsContent value="paths" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Privilege Attribution Paths</CardTitle>
              <CardDescription>
                Visualize how privileges flow from sources to identities through
                roles, policies, and trusts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {MOCK_PRIVILEGES.slice(0, 3).map((privilege) => (
                  <Card
                    key={privilege.id}
                    className="border-l-4 border-l-primary"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">
                            {privilege.name}
                          </CardTitle>
                          <CardDescription>
                            {privilege.description}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <PrivilegeTypeBadge type={privilege.type} />
                          <RiskLevelBadge level={privilege.level} />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <div className="text-xs text-muted-foreground mb-2">
                            Attribution Path
                          </div>
                          <PrivilegePathVisualization path={privilege.path} />
                        </div>
                        <div className="space-y-4">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">
                              Identity
                            </div>
                            <div className="text-sm font-medium">
                              {privilege.identity.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {privilege.identity.type}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">
                              Resource
                            </div>
                            <div className="text-sm font-medium">
                              {privilege.resource.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {privilege.resource.type}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">
                              Actions
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {privilege.actions.map((action) => (
                                <Badge
                                  key={action}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {action}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ACCUMULATION TAB */}
        <TabsContent value="accumulation" className="space-y-6 mt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              title="Accumulation Cases"
              value={PRIVILEGE_SUMMARY.activeAccumulations.toString()}
              icon={Layers}
              variant="warning"
              subtitle="Privilege buildup detected"
            />
            <MetricCard
              title="Drift Detections"
              value="5"
              icon={TrendingUp}
              variant="warning"
              subtitle="Unexpected privilege changes"
            />
            <MetricCard
              title="Expired Persistent"
              value="3"
              icon={AlertTriangle}
              variant="destructive"
              subtitle="Temporary privileges still active"
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Privilege Accumulation & Drift</CardTitle>
              <CardDescription>
                Identities with excessive privileges, drift from baseline, or
                expired temporary access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AccumulationTable accumulations={MOCK_ACCUMULATIONS} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* RISKS TAB */}
        <TabsContent value="risks" className="space-y-6 mt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Critical Risks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {PRIVILEGE_SUMMARY.criticalRisks}
                </div>
                <p className="text-xs text-muted-foreground">
                  Require immediate attention
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Warnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">
                  {PRIVILEGE_SUMMARY.activeRisks -
                    PRIVILEGE_SUMMARY.criticalRisks}
                </div>
                <p className="text-xs text-muted-foreground">
                  Should be reviewed soon
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Informational
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">8</div>
                <p className="text-xs text-muted-foreground">
                  Best practice improvements
                </p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Risk Analysis</CardTitle>
              <CardDescription>
                Detected privilege risks requiring assessment and remediation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RiskTable risks={MOCK_RISKS} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* EVIDENCE TAB */}
        <TabsContent value="evidence" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Evidence & Export</CardTitle>
              <CardDescription>
                Technical evidence and audit trail for compliance and
                investigation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Export Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      onClick={() => handleExport("csv")}
                    >
                      <span>Export as CSV</span>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      onClick={() => handleExport("json")}
                    >
                      <span>Export as JSON</span>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      onClick={() => handleExport("pdf")}
                    >
                      <span>Export as PDF</span>
                      <Download className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Audit Trail
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Last Full Scan
                        </span>
                        <span>2025-02-09 02:00 UTC</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Last Incremental
                        </span>
                        <span>2025-02-09 10:00 UTC</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Data Source
                        </span>
                        <span>Identity Engine v2.4</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Retention</span>
                        <span>90 days</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Technical Evidence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Privilege Calculation Methodology
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Effective privileges are calculated through transitive
                        closure of role assignments, policy grants, trust
                        inheritances, and delegations. The calculation considers
                        temporal constraints, conditional policies, and
                        organizational boundaries.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Risk Scoring Algorithm
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Risk scores (0-100) are derived from: privilege level
                        (40%), access patterns (25%), identity type (15%),
                        justification status (10%), and inheritance depth (10%).
                        Scores ≥70 indicate critical risk requiring immediate
                        review.
                      </p>
                    </div>
                    <div className="flex gap-2 pt-4 border-t">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/admin/security/audit">
                          <ScrollText className="h-4 w-4 mr-2" />
                          View Full Audit Logs
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/admin/report/compliance">
                          <ShieldCheck className="h-4 w-4 mr-2" />
                          Compliance Report
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      {selectedIdentity && (
        <IdentityDetailDialog
          entry={selectedIdentity}
          onClose={() => setSelectedIdentity(null)}
          onViewPath={(privilege) => {
            setSelectedPrivilegePath(privilege);
            setSelectedIdentity(null);
          }}
        />
      )}

      {selectedPrivilegePath && (
        <PrivilegePathDialog
          privilege={selectedPrivilegePath}
          onClose={() => setSelectedPrivilegePath(null)}
        />
      )}
    </div>
  );
}
