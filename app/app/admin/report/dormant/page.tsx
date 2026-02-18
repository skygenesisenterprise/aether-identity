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
import { Progress } from "@/components/dashboard/ui/progress";
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
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Moon,
  User,
  Users,
  Server,
  Key,
  Lock,
  Shield,
  ShieldAlert,
  AlertTriangle,
  AlertCircle,
  Info,
  Clock,
  Eye,
  ExternalLink,
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Fingerprint,
  Globe,
  Activity,
  Ban,
  History,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ==================== TYPES & INTERFACES ====================

type DormantEntityType =
  | "human_identity"
  | "machine_identity"
  | "token"
  | "session"
  | "key"
  | "secret"
  | "role"
  | "permission"
  | "trust";

type DormancyCategory = "acceptable" | "monitoring" | "disable" | "critical";
type RiskLevel = "low" | "medium" | "high" | "critical";
type PrivilegeLevel = "none" | "read" | "write" | "admin" | "root";

interface DormantEntity {
  id: string;
  type: DormantEntityType;
  identifier: string;
  displayName: string;
  organization: string;
  environment: string;
  authority: string;
  lastActivityAt: string;
  dormantSince: string;
  dormantDays: number;
  privilegeLevel: PrivilegeLevel;
  riskScore: number;
  category: DormancyCategory;
  metadata: Record<string, unknown>;
  evidence: string[];
}

interface DormantSummary {
  totalDormant: number;
  byType: Record<DormantEntityType, number>;
  byCategory: Record<DormancyCategory, number>;
  byRisk: Record<RiskLevel, number>;
  totalRiskScore: number;
  highPrivilegeDormant: number;
  crossAuthorityDormant: number;
  trend: Array<{
    date: string;
    count: number;
    resolved: number;
    newDormant: number;
  }>;
}

interface ExposureAnalysis {
  totalUnusedPermissions: number;
  cumulativePrivilegeScore: number;
  crossAuthorityExposure: number;
  blastRadius: number;
  potentialAbuseVectors: number;
}

interface DormancyPolicy {
  type: DormantEntityType;
  thresholdDays: number;
  autoAlert: boolean;
  autoDisable: boolean;
  escalationDays: number;
}

// ==================== MOCK DATA ====================

const DORMANT_ENTITIES: DormantEntity[] = [
  // Human Identities
  {
    id: "dorm-001",
    type: "human_identity",
    identifier: "john.smith@legacy-company.com",
    displayName: "John Smith",
    organization: "Legacy Corp",
    environment: "production",
    authority: "auth-aether-prod",
    lastActivityAt: "2024-06-15T10:30:00Z",
    dormantSince: "2024-06-16T00:00:00Z",
    dormantDays: 239,
    privilegeLevel: "admin",
    riskScore: 85,
    category: "critical",
    metadata: {
      accountType: "employee",
      department: "Engineering",
      hireDate: "2020-03-15",
      terminationDate: "2024-06-15",
      mfaEnabled: true,
    },
    evidence: [
      "No login for 239 days",
      "Admin privileges retained",
      "Former employee",
    ],
  },
  {
    id: "dorm-002",
    type: "human_identity",
    identifier: "sarah.jones@acme.com",
    displayName: "Sarah Jones",
    organization: "Acme Inc",
    environment: "staging",
    authority: "auth-aether-staging",
    lastActivityAt: "2024-11-20T14:22:00Z",
    dormantSince: "2024-11-21T00:00:00Z",
    dormantDays: 81,
    privilegeLevel: "write",
    riskScore: 45,
    category: "monitoring",
    metadata: {
      accountType: "contractor",
      department: "Consulting",
      contractEnd: "2024-11-20",
      mfaEnabled: false,
    },
    evidence: ["Contractor expired", "No activity since contract end"],
  },
  {
    id: "dorm-003",
    type: "human_identity",
    identifier: "admin.backup@aether.io",
    displayName: "Backup Admin",
    organization: "Aether",
    environment: "production",
    authority: "auth-aether-prod",
    lastActivityAt: "2024-08-01T09:00:00Z",
    dormantSince: "2024-08-02T00:00:00Z",
    dormantDays: 192,
    privilegeLevel: "root",
    riskScore: 95,
    category: "critical",
    metadata: {
      accountType: "service",
      purpose: "Emergency access",
      lastUsed: "Never for intended purpose",
    },
    evidence: [
      "Root privileges",
      "Never used for intended purpose",
      "High exposure",
    ],
  },
  // Machine Identities
  {
    id: "dorm-004",
    type: "machine_identity",
    identifier: "svc-legacy-integration",
    displayName: "Legacy Integration Service",
    organization: "Acme Inc",
    environment: "production",
    authority: "auth-aether-prod",
    lastActivityAt: "2024-09-10T16:45:00Z",
    dormantSince: "2024-09-11T00:00:00Z",
    dormantDays: 152,
    privilegeLevel: "write",
    riskScore: 70,
    category: "disable",
    metadata: {
      serviceType: "microservice",
      owner: "Platform Team",
      decommissioned: true,
      replacement: "svc-new-integration",
    },
    evidence: [
      "Service decommissioned",
      "Credentials still valid",
      "API access retained",
    ],
  },
  {
    id: "dorm-005",
    type: "machine_identity",
    identifier: "oauth-client-old-mobile",
    displayName: "Old Mobile App OAuth",
    organization: "Acme Inc",
    environment: "production",
    authority: "auth-okta-enterprise",
    lastActivityAt: "2024-07-22T11:30:00Z",
    dormantSince: "2024-07-23T00:00:00Z",
    dormantDays: 202,
    privilegeLevel: "read",
    riskScore: 55,
    category: "disable",
    metadata: {
      clientType: "mobile_app",
      appVersion: "v1.x",
      deprecated: true,
      users: 0,
    },
    evidence: [
      "App deprecated",
      "No active users",
      "OAuth client still enabled",
    ],
  },
  // Tokens
  {
    id: "dorm-006",
    type: "token",
    identifier: "tok_refresh_legacy_001",
    displayName: "Legacy Refresh Token",
    organization: "Acme Inc",
    environment: "production",
    authority: "auth-aether-prod",
    lastActivityAt: "2024-05-20T08:00:00Z",
    dormantSince: "2024-05-21T00:00:00Z",
    dormantDays: 265,
    privilegeLevel: "admin",
    riskScore: 75,
    category: "critical",
    metadata: {
      tokenType: "refresh",
      subject: "john.smith@legacy-company.com",
      longLived: true,
      rotationCount: 0,
    },
    evidence: [
      "Long-lived token",
      "Never rotated",
      "Linked to dormant identity",
    ],
  },
  {
    id: "dorm-007",
    type: "token",
    identifier: "tok_api_partner_old",
    displayName: "Old Partner API Token",
    organization: "TechCorp Partner",
    environment: "production",
    authority: "auth-partner-techcorp",
    lastActivityAt: "2024-10-05T14:00:00Z",
    dormantSince: "2024-10-06T00:00:00Z",
    dormantDays: 127,
    privilegeLevel: "write",
    riskScore: 60,
    category: "monitoring",
    metadata: {
      tokenType: "api",
      partner: "TechCorp",
      contractStatus: "renewed",
      newTokenIssued: true,
    },
    evidence: [
      "Partner contract renewed",
      "New token issued",
      "Old token not revoked",
    ],
  },
  // Sessions
  {
    id: "dorm-008",
    type: "session",
    identifier: "sess_persistent_admin_001",
    displayName: "Persistent Admin Session",
    organization: "Aether",
    environment: "production",
    authority: "auth-aether-prod",
    lastActivityAt: "2024-12-01T10:00:00Z",
    dormantSince: "2024-12-02T00:00:00Z",
    dormantDays: 70,
    privilegeLevel: "admin",
    riskScore: 65,
    category: "monitoring",
    metadata: {
      sessionType: "persistent",
      device: "Workstation-Admin-01",
      ipAddress: "10.0.1.100",
      rememberMe: true,
    },
    evidence: [
      "Persistent session",
      "No activity for 70 days",
      "Admin privileges",
    ],
  },
  // Keys
  {
    id: "dorm-009",
    type: "key",
    identifier: "key_signing_legacy_2023",
    displayName: "Legacy Signing Key 2023",
    organization: "Aether",
    environment: "production",
    authority: "auth-aether-prod",
    lastActivityAt: "2024-01-15T09:00:00Z",
    dormantSince: "2024-01-16T00:00:00Z",
    dormantDays: 391,
    privilegeLevel: "root",
    riskScore: 90,
    category: "critical",
    metadata: {
      keyType: "signing",
      algorithm: "RSA-2048",
      created: "2023-01-15",
      lastRotated: "Never",
      usage: "Token signing",
    },
    evidence: ["Never rotated", "391 days old", "Critical signing key"],
  },
  {
    id: "dorm-010",
    type: "key",
    identifier: "key_encryption_backup",
    displayName: "Backup Encryption Key",
    organization: "Aether",
    environment: "production",
    authority: "auth-aether-prod",
    lastActivityAt: "2024-03-20T11:00:00Z",
    dormantSince: "2024-03-21T00:00:00Z",
    dormantDays: 326,
    privilegeLevel: "admin",
    riskScore: 80,
    category: "acceptable",
    metadata: {
      keyType: "encryption",
      purpose: "Cold storage backup",
      lastRotated: "2024-03-20",
      acceptableDormancy: true,
    },
    evidence: ["Cold storage backup key", "Acceptable dormancy per policy"],
  },
  // Secrets
  {
    id: "dorm-011",
    type: "secret",
    identifier: "secret_db_legacy_prod",
    displayName: "Legacy Production DB Secret",
    organization: "Acme Inc",
    environment: "production",
    authority: "auth-aether-prod",
    lastActivityAt: "2024-06-01T15:30:00Z",
    dormantSince: "2024-06-02T00:00:00Z",
    dormantDays: 253,
    privilegeLevel: "write",
    riskScore: 72,
    category: "disable",
    metadata: {
      secretType: "database_credential",
      database: "legacy-prod-db",
      service: "old-analytics-service",
      rotationDue: "2024-07-01",
    },
    evidence: [
      "Database migrated",
      "Old service decommissioned",
      "Secret not rotated",
    ],
  },
  // Roles & Permissions
  {
    id: "dorm-012",
    type: "role",
    identifier: "role_legacy_admin_finance",
    displayName: "Legacy Finance Admin",
    organization: "Acme Inc",
    environment: "production",
    authority: "auth-aether-prod",
    lastActivityAt: "2024-04-10T10:00:00Z",
    dormantSince: "2024-04-11T00:00:00Z",
    dormantDays: 305,
    privilegeLevel: "admin",
    riskScore: 68,
    category: "disable",
    metadata: {
      roleType: "custom",
      assignments: 0,
      permissions: ["finance:read", "finance:write", "finance:admin"],
      deprecated: true,
    },
    evidence: ["No assignments", "Deprecated role", "Permissions still valid"],
  },
  {
    id: "dorm-013",
    type: "permission",
    identifier: "perm_old_api_access",
    displayName: "Old API Access Permission",
    organization: "Acme Inc",
    environment: "production",
    authority: "auth-aether-prod",
    lastActivityAt: "2024-08-15T14:00:00Z",
    dormantSince: "2024-08-16T00:00:00Z",
    dormantDays: 178,
    privilegeLevel: "write",
    riskScore: 42,
    category: "acceptable",
    metadata: {
      permission: "api:legacy:write",
      apiVersion: "v1",
      apiStatus: "deprecated",
      grantedTo: 3,
    },
    evidence: ["API deprecated", "Limited exposure (3 users)"],
  },
  // Trust Relationships
  {
    id: "dorm-014",
    type: "trust",
    identifier: "trust_inactive_partner",
    displayName: "Inactive Partner Trust",
    organization: "TechCorp Partner",
    environment: "production",
    authority: "auth-partner-techcorp",
    lastActivityAt: "2024-07-01T09:00:00Z",
    dormantSince: "2024-07-02T00:00:00Z",
    dormantDays: 223,
    privilegeLevel: "write",
    riskScore: 58,
    category: "monitoring",
    metadata: {
      trustType: "partner",
      source: "Aether Production",
      target: "TechCorp Partner",
      traffic: 0,
      partnerStatus: "inactive",
    },
    evidence: [
      "No trust traffic for 223 days",
      "Partner inactive",
      "Trust still configured",
    ],
  },
];

const DORMANT_SUMMARY: DormantSummary = {
  totalDormant: 1437,
  byType: {
    human_identity: 234,
    machine_identity: 189,
    token: 456,
    session: 312,
    key: 89,
    secret: 76,
    role: 45,
    permission: 23,
    trust: 13,
  },
  byCategory: {
    acceptable: 298,
    monitoring: 542,
    disable: 412,
    critical: 185,
  },
  byRisk: {
    low: 412,
    medium: 523,
    high: 356,
    critical: 146,
  },
  totalRiskScore: 67,
  highPrivilegeDormant: 89,
  crossAuthorityDormant: 34,
  trend: [
    { date: "2024-08-09", count: 1289, resolved: 45, newDormant: 67 },
    { date: "2024-09-09", count: 1312, resolved: 52, newDormant: 75 },
    { date: "2024-10-09", count: 1335, resolved: 38, newDormant: 61 },
    { date: "2024-11-09", count: 1358, resolved: 41, newDormant: 64 },
    { date: "2024-12-09", count: 1381, resolved: 29, newDormant: 52 },
    { date: "2025-01-09", count: 1409, resolved: 35, newDormant: 63 },
    { date: "2025-02-09", count: 1437, resolved: 28, newDormant: 56 },
  ],
};

const EXPOSURE_ANALYSIS: ExposureAnalysis = {
  totalUnusedPermissions: 2847,
  cumulativePrivilegeScore: 18456,
  crossAuthorityExposure: 23,
  blastRadius: 892,
  potentialAbuseVectors: 156,
};

const DORMANCY_POLICIES: DormancyPolicy[] = [
  {
    type: "human_identity",
    thresholdDays: 90,
    autoAlert: true,
    autoDisable: false,
    escalationDays: 180,
  },
  {
    type: "machine_identity",
    thresholdDays: 60,
    autoAlert: true,
    autoDisable: true,
    escalationDays: 120,
  },
  {
    type: "token",
    thresholdDays: 30,
    autoAlert: true,
    autoDisable: true,
    escalationDays: 90,
  },
  {
    type: "session",
    thresholdDays: 7,
    autoAlert: true,
    autoDisable: true,
    escalationDays: 30,
  },
  {
    type: "key",
    thresholdDays: 180,
    autoAlert: true,
    autoDisable: false,
    escalationDays: 365,
  },
  {
    type: "secret",
    thresholdDays: 90,
    autoAlert: true,
    autoDisable: false,
    escalationDays: 180,
  },
  {
    type: "role",
    thresholdDays: 180,
    autoAlert: true,
    autoDisable: false,
    escalationDays: 365,
  },
  {
    type: "permission",
    thresholdDays: 365,
    autoAlert: false,
    autoDisable: false,
    escalationDays: 545,
  },
  {
    type: "trust",
    thresholdDays: 90,
    autoAlert: true,
    autoDisable: false,
    escalationDays: 180,
  },
];

// ==================== CONSTANTS ====================

const ENTITY_TYPE_LABELS: Record<DormantEntityType, string> = {
  human_identity: "Human Identity",
  machine_identity: "Machine Identity",
  token: "Token",
  session: "Session",
  key: "Key",
  secret: "Secret",
  role: "Role",
  permission: "Permission",
  trust: "Trust Relationship",
};

const ENTITY_TYPE_ICONS: Record<DormantEntityType, React.ElementType> = {
  human_identity: User,
  machine_identity: Server,
  token: Key,
  session: Clock,
  key: Lock,
  secret: Shield,
  role: Users,
  permission: ShieldAlert,
  trust: Globe,
};

const CATEGORY_CONFIG: Record<
  DormancyCategory,
  { label: string; color: string; icon: React.ElementType }
> = {
  acceptable: {
    label: "Acceptable",
    color: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    icon: Info,
  },
  monitoring: {
    label: "To Monitor",
    color: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
    icon: AlertTriangle,
  },
  disable: {
    label: "To Disable",
    color: "bg-orange-500/10 text-orange-700 border-orange-500/20",
    icon: Ban,
  },
  critical: {
    label: "Critical",
    color: "bg-red-500/10 text-red-700 border-red-500/20",
    icon: AlertCircle,
  },
};

const PRIVILEGE_COLORS: Record<PrivilegeLevel, string> = {
  none: "bg-slate-500/10 text-slate-700",
  read: "bg-blue-500/10 text-blue-700",
  write: "bg-yellow-500/10 text-yellow-700",
  admin: "bg-orange-500/10 text-orange-700",
  root: "bg-red-500/10 text-red-700",
};

const TYPE_DISTRIBUTION_COLORS = [
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#06b6d4", // cyan
  "#ec4899", // pink
  "#6366f1", // indigo
  "#14b8a6", // teal
];

// ==================== HELPER FUNCTIONS ====================

function formatDuration(days: number): string {
  if (days < 7) return `${days}d`;
  if (days < 30) return `${Math.floor(days / 7)}w`;
  if (days < 365) return `${Math.floor(days / 30)}mo`;
  return `${Math.floor(days / 365)}y`;
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ==================== COMPONENTS ====================

function TimeDisplay() {
  const [time, setTime] = React.useState<string>("");

  React.useEffect(() => {
    setTime(new Date().toLocaleString());
  }, []);

  return <span suppressHydrationWarning>{time}</span>;
}

function EntityTypeBadge({ type }: { type: DormantEntityType }) {
  const Icon = ENTITY_TYPE_ICONS[type];
  return (
    <Badge variant="outline" className="gap-1">
      <Icon className="h-3 w-3" />
      {ENTITY_TYPE_LABELS[type]}
    </Badge>
  );
}

function CategoryBadge({ category }: { category: DormancyCategory }) {
  const config = CATEGORY_CONFIG[category];
  const Icon = config.icon;
  return (
    <Badge variant="outline" className={cn("gap-1", config.color)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

function PrivilegeBadge({ level }: { level: PrivilegeLevel }) {
  return (
    <Badge
      variant="outline"
      className={cn("capitalize", PRIVILEGE_COLORS[level])}
    >
      {level}
    </Badge>
  );
}

function RiskScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full",
            score >= 80
              ? "bg-red-500"
              : score >= 60
                ? "bg-orange-500"
                : score >= 40
                  ? "bg-yellow-500"
                  : "bg-green-500",
          )}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-sm font-medium">{score}</span>
    </div>
  );
}

function TypeDistributionChart() {
  const data = Object.entries(DORMANT_SUMMARY.byType).map(([type, count]) => ({
    name: ENTITY_TYPE_LABELS[type as DormantEntityType],
    value: count,
    type: type as DormantEntityType,
  }));

  return (
    <div className="h-75">
      <PieChart width={600} height={300}>
        <Pie
          data={data}
          cx={150}
          cy={150}
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                TYPE_DISTRIBUTION_COLORS[
                  index % TYPE_DISTRIBUTION_COLORS.length
                ]
              }
            />
          ))}
        </Pie>
        <Legend
          verticalAlign="middle"
          align="right"
          layout="vertical"
          wrapperStyle={{ fontSize: "12px" }}
        />
        <ChartTooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="bg-background border rounded p-2 text-xs">
                  <p className="font-medium">{data.name}</p>
                  <p className="text-muted-foreground">{data.value} entities</p>
                </div>
              );
            }
            return null;
          }}
        />
      </PieChart>
    </div>
  );
}

function TrendChart() {
  return (
    <ChartContainer config={{}} className="h-75">
      <LineChart data={DORMANT_SUMMARY.trend}>
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
          dataKey="count"
          stroke="#ef4444"
          strokeWidth={2}
          dot={false}
          name="Total Dormant"
        />
        <Line
          type="monotone"
          dataKey="resolved"
          stroke="#22c55e"
          strokeWidth={2}
          dot={false}
          name="Resolved"
        />
        <Line
          type="monotone"
          dataKey="newDormant"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={false}
          name="New Dormant"
        />
      </LineChart>
    </ChartContainer>
  );
}

function CategoryDistributionChart() {
  const data = [
    {
      name: "Acceptable",
      value: DORMANT_SUMMARY.byCategory.acceptable,
      color: "#3b82f6",
    },
    {
      name: "To Monitor",
      value: DORMANT_SUMMARY.byCategory.monitoring,
      color: "#f59e0b",
    },
    {
      name: "To Disable",
      value: DORMANT_SUMMARY.byCategory.disable,
      color: "#f97316",
    },
    {
      name: "Critical",
      value: DORMANT_SUMMARY.byCategory.critical,
      color: "#ef4444",
    },
  ];

  return (
    <ChartContainer config={{}} className="h-62.5">
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
          dataKey="name"
          type="category"
          className="text-xs"
          tickLine={false}
          axisLine={false}
          width={100}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

function DormantEntitiesTable({ entities }: { entities: DormantEntity[] }) {
  const [filterType, setFilterType] = React.useState<DormantEntityType | "all">(
    "all",
  );
  const [filterCategory, setFilterCategory] = React.useState<
    DormancyCategory | "all"
  >("all");
  const [filterRisk, setFilterRisk] = React.useState<RiskLevel | "all">("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredEntities = entities.filter((entity) => {
    if (filterType !== "all" && entity.type !== filterType) return false;
    if (filterCategory !== "all" && entity.category !== filterCategory)
      return false;
    const riskLevel: RiskLevel =
      entity.riskScore >= 80
        ? "critical"
        : entity.riskScore >= 60
          ? "high"
          : entity.riskScore >= 40
            ? "medium"
            : "low";
    if (filterRisk !== "all" && riskLevel !== filterRisk) return false;
    if (
      searchQuery &&
      !entity.displayName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !entity.identifier.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const getActionUrl = (entity: DormantEntity): string => {
    switch (entity.type) {
      case "human_identity":
      case "machine_identity":
        return `/admin/platform/identity?id=${entity.id}`;
      case "token":
      case "session":
        return `/admin/platform/token?id=${entity.id}`;
      case "key":
        return `/admin/platform/key?id=${entity.id}`;
      case "secret":
        return `/admin/security/secrets?id=${entity.id}`;
      case "role":
      case "permission":
        return `/admin/organization/rbac?id=${entity.id}`;
      case "trust":
        return `/admin/organization/trust?id=${entity.id}`;
      default:
        return "#";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dormant Entities</CardTitle>
        <CardDescription>
          {filteredEntities.length} entities match current filters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or identifier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-64 text-xs"
            />
          </div>
          <Select
            value={filterType}
            onValueChange={(v) => setFilterType(v as DormantEntityType | "all")}
          >
            <SelectTrigger className="h-8 w-40 text-xs">
              <Filter className="h-3.5 w-3.5 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.entries(ENTITY_TYPE_LABELS).map(([type, label]) => (
                <SelectItem key={type} value={type}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filterCategory}
            onValueChange={(v) =>
              setFilterCategory(v as DormancyCategory | "all")
            }
          >
            <SelectTrigger className="h-8 w-36 text-xs">
              <AlertTriangle className="h-3.5 w-3.5 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="acceptable">Acceptable</SelectItem>
              <SelectItem value="monitoring">To Monitor</SelectItem>
              <SelectItem value="disable">To Disable</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filterRisk}
            onValueChange={(v) => setFilterRisk(v as RiskLevel | "all")}
          >
            <SelectTrigger className="h-8 w-32 text-xs">
              <ShieldAlert className="h-3.5 w-3.5 mr-2" />
              <SelectValue placeholder="Risk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entity</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Dormant Since</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Privilege</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntities.map((entity) => (
                <TableRow key={entity.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-sm">
                        {entity.displayName}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {entity.identifier.length > 30
                          ? entity.identifier.substring(0, 30) + "..."
                          : entity.identifier}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {entity.organization} • {entity.environment}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <EntityTypeBadge type={entity.type} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {formatDate(entity.dormantSince)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">
                        {formatDuration(entity.dormantDays)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <PrivilegeBadge level={entity.privilegeLevel} />
                  </TableCell>
                  <TableCell>
                    <CategoryBadge category={entity.category} />
                  </TableCell>
                  <TableCell>
                    <RiskScoreBar score={entity.riskScore} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={getActionUrl(entity)}>
                      <Button variant="ghost" size="sm" className="gap-1">
                        Review
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function EvidencePanel({ entity }: { entity: DormantEntity }) {
  const getActionUrl = (entity: DormantEntity): string => {
    switch (entity.type) {
      case "human_identity":
      case "machine_identity":
        return `/admin/platform/identity?id=${entity.id}`;
      case "token":
      case "session":
        return `/admin/platform/token?id=${entity.id}`;
      case "key":
        return `/admin/platform/key?id=${entity.id}`;
      case "secret":
        return `/admin/security/secrets?id=${entity.id}`;
      case "role":
      case "permission":
        return `/admin/organization/rbac?id=${entity.id}`;
      case "trust":
        return `/admin/organization/trust?id=${entity.id}`;
      default:
        return "#";
    }
  };

  return (
    <Card className="border-l-4 border-l-red-500">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{entity.displayName}</CardTitle>
            <CardDescription className="mt-1">
              {entity.identifier}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <EntityTypeBadge type={entity.type} />
            <CategoryBadge category={entity.category} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              Organization
            </div>
            <div className="text-sm font-medium">{entity.organization}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              Environment
            </div>
            <div className="text-sm font-medium">{entity.environment}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Authority</div>
            <div className="text-sm font-medium">{entity.authority}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              Privilege Level
            </div>
            <PrivilegeBadge level={entity.privilegeLevel} />
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            Evidence & Justification
          </div>
          <ul className="space-y-2">
            {entity.evidence.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {Object.keys(entity.metadata).length > 0 && (
          <div className="pt-4 border-t">
            <div className="text-xs font-medium text-muted-foreground mb-2">
              Metadata
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(entity.metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-muted-foreground">{key}:</span>
                  <span className="font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t flex gap-2">
          <Link href={getActionUrl(entity)} className="flex-1">
            <Button className="w-full gap-2">
              <ExternalLink className="h-4 w-4" />
              Manage Entity
            </Button>
          </Link>
          <Link href={`/admin/security/audit?entity=${entity.id}`}>
            <Button variant="outline" className="gap-2">
              <History className="h-4 w-4" />
              Audit Trail
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// ==================== MAIN PAGE ====================

export default function DormantReportPage() {
  const [activeTab, setActiveTab] = React.useState("overview");
  const [selectedEntity, setSelectedEntity] =
    React.useState<DormantEntity | null>(null);

  const criticalEntities = DORMANT_ENTITIES.filter(
    (e) => e.category === "critical",
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Moon className="h-8 w-8 text-amber-500" />
            Dormant Identities Report
          </h1>
          <p className="text-muted-foreground mt-1">
            Identify inactive but still valid identities, tokens, keys, and
            permissions
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
          <Badge variant="outline" className="bg-amber-500/10 text-amber-700">
            <Eye className="h-3 w-3 mr-1" />
            Read-Only
          </Badge>
        </div>
      </div>

      {/* Alert Banner for Critical Items */}
      {criticalEntities.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <h3 className="font-medium text-red-900">
              {criticalEntities.length} Critical Dormant Entities Require
              Immediate Attention
            </h3>
            <p className="text-sm text-red-700 mt-1">
              These entities pose significant security risks due to high
              privileges, extended dormancy, or association with former
              employees or decommissioned services.
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setActiveTab("entities")}
          >
            Review Critical
          </Button>
        </div>
      )}

      {/* Navigation to Related Pages */}
      <div className="flex flex-wrap gap-2">
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
        <Link href="/admin/platform/key">
          <Button variant="outline" size="sm" className="gap-1">
            <Lock className="h-3 w-3" />
            Key Management
            <ExternalLink className="h-3 w-3" />
          </Button>
        </Link>
        <Link href="/admin/security/secrets">
          <Button variant="outline" size="sm" className="gap-1">
            <Shield className="h-3 w-3" />
            Secrets
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
            <Globe className="h-3 w-3" />
            Cross-Authority
            <ExternalLink className="h-3 w-3" />
          </Button>
        </Link>
        <Link href="/admin/security/audit">
          <Button variant="outline" size="sm" className="gap-1">
            <FileText className="h-3 w-3" />
            Audit Logs
            <ExternalLink className="h-3 w-3" />
          </Button>
        </Link>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6 lg:w-200">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="entities">Entities</TabsTrigger>
          <TabsTrigger value="classification">Classification</TabsTrigger>
          <TabsTrigger value="exposure">Exposure</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Dormant"
              value={DORMANT_SUMMARY.totalDormant}
              icon={Moon}
              variant="warning"
              subtitle="Across all entity types"
            />
            <MetricCard
              title="Critical Risk"
              value={DORMANT_SUMMARY.byCategory.critical}
              icon={AlertCircle}
              variant="destructive"
              trend={{ value: 12, isPositive: false }}
              subtitle="Require immediate action"
            />
            <MetricCard
              title="High Privilege"
              value={DORMANT_SUMMARY.highPrivilegeDormant}
              icon={ShieldAlert}
              variant="warning"
              subtitle="Admin or root access"
            />
            <MetricCard
              title="Cross-Authority"
              value={DORMANT_SUMMARY.crossAuthorityDormant}
              icon={Globe}
              variant="accent"
              subtitle="Spanning multiple authorities"
            />
          </div>

          {/* Risk Score and Type Distribution */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5" />
                  Global Risk Score
                </CardTitle>
                <CardDescription>
                  Overall risk assessment based on dormant entity analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-orange-500">
                      {DORMANT_SUMMARY.totalRiskScore}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      out of 100
                    </div>
                    <Badge className="mt-4 bg-orange-500/10 text-orange-700">
                      High Risk
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Low Risk Entities
                    </span>
                    <span className="font-medium">
                      {DORMANT_SUMMARY.byRisk.low}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Medium Risk</span>
                    <span className="font-medium">
                      {DORMANT_SUMMARY.byRisk.medium}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">High Risk</span>
                    <span className="font-medium text-orange-600">
                      {DORMANT_SUMMARY.byRisk.high}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Critical Risk</span>
                    <span className="font-medium text-red-600">
                      {DORMANT_SUMMARY.byRisk.critical}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Distribution by Type
                </CardTitle>
                <CardDescription>
                  Breakdown of dormant entities by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TypeDistributionChart />
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Classification Summary</CardTitle>
              <CardDescription>
                Dormant entities categorized by recommended action
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Acceptable</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {DORMANT_SUMMARY.byCategory.acceptable}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Backup, archive, or cold storage entities
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">To Monitor</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {DORMANT_SUMMARY.byCategory.monitoring}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Under observation, review periodically
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Ban className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">To Disable</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {DORMANT_SUMMARY.byCategory.disable}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Should be disabled without business impact
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="font-medium">Critical</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {DORMANT_SUMMARY.byCategory.critical}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Immediate security risk, requires action
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ENTITIES TAB */}
        <TabsContent value="entities" className="space-y-6 mt-6">
          <DormantEntitiesTable entities={DORMANT_ENTITIES} />
        </TabsContent>

        {/* CLASSIFICATION TAB */}
        <TabsContent value="classification" className="space-y-6 mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Classification Distribution</CardTitle>
                <CardDescription>
                  Entities by recommended action category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryDistributionChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dormancy Policies</CardTitle>
                <CardDescription>
                  Thresholds and automated actions by entity type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {DORMANCY_POLICIES.map((policy) => (
                    <div
                      key={policy.type}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {(() => {
                          const Icon = ENTITY_TYPE_ICONS[policy.type];
                          return (
                            <Icon className="h-4 w-4 text-muted-foreground" />
                          );
                        })()}
                        <div>
                          <div className="font-medium text-sm">
                            {ENTITY_TYPE_LABELS[policy.type]}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Threshold: {policy.thresholdDays} days
                            {policy.escalationDays > 0 &&
                              ` • Escalation: ${policy.escalationDays}d`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {policy.autoAlert && (
                          <Badge variant="outline" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Alert
                          </Badge>
                        )}
                        {policy.autoDisable && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-red-500/10 text-red-700"
                          >
                            <Ban className="h-3 w-3 mr-1" />
                            Auto-Disable
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Classification Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Classification Guidelines</CardTitle>
              <CardDescription>
                How dormant entities are categorized
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="font-medium">Acceptable</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Backup and archive keys</li>
                    <li>• Cold storage credentials</li>
                    <li>• Seasonal access accounts</li>
                    <li>• Emergency access (documented)</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="font-medium">To Monitor</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Low privilege dormant accounts</li>
                    <li>• Recently inactive (within 90d)</li>
                    <li>• Active contracts but no usage</li>
                    <li>• Pending decommissioning</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span className="font-medium">To Disable</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Decommissioned services</li>
                    <li>• Migrated resources</li>
                    <li>• Deprecated integrations</li>
                    <li>• Unused roles & permissions</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="font-medium">Critical</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Former employees with access</li>
                    <li>• Admin/root dormant accounts</li>
                    <li>• Long-lived tokens (&gt;180d)</li>
                    <li>• Unrotated critical keys</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* EXPOSURE TAB */}
        <TabsContent value="exposure" className="space-y-6 mt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              title="Unused Permissions"
              value={EXPOSURE_ANALYSIS.totalUnusedPermissions}
              icon={Shield}
              variant="warning"
              subtitle="Granted but never exercised"
            />
            <MetricCard
              title="Cumulative Privilege"
              value={EXPOSURE_ANALYSIS.cumulativePrivilegeScore.toLocaleString()}
              icon={TrendingUp}
              variant="destructive"
              subtitle="Total privilege score of dormant entities"
            />
            <MetricCard
              title="Potential Abuse Vectors"
              value={EXPOSURE_ANALYSIS.potentialAbuseVectors}
              icon={AlertTriangle}
              variant="destructive"
              subtitle="Identified attack paths"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Cross-Authority Exposure
                </CardTitle>
                <CardDescription>
                  Dormant entities spanning multiple identity authorities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                    <div>
                      <div className="text-sm font-medium">
                        Exposed Authorities
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Authorities with dormant cross-access
                      </div>
                    </div>
                    <div className="text-2xl font-bold">
                      {EXPOSURE_ANALYSIS.crossAuthorityExposure}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {DORMANT_ENTITIES.filter((e) => e.type === "trust").map(
                      (trust) => (
                        <div
                          key={trust.id}
                          className="flex items-center justify-between p-3 rounded border"
                        >
                          <div className="flex items-center gap-3">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="text-sm font-medium">
                                {trust.displayName}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {trust.metadata.source as string} →{" "}
                                {trust.metadata.target as string}
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline">
                            {trust.dormantDays}d dormant
                          </Badge>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Blast Radius Analysis
                </CardTitle>
                <CardDescription>
                  Potential impact if dormant entities are compromised
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 border border-red-200">
                    <div>
                      <div className="text-sm font-medium text-red-900">
                        Affected Resources
                      </div>
                      <div className="text-xs text-red-700">
                        Resources accessible by dormant entities
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-red-600">
                      {EXPOSURE_ANALYSIS.blastRadius}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm font-medium">
                      Exposure Breakdown
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Databases</span>
                        <span className="font-medium">124</span>
                      </div>
                      <Progress value={45} className="h-1.5" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">APIs</span>
                        <span className="font-medium">287</span>
                      </div>
                      <Progress value={62} className="h-1.5" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Applications
                        </span>
                        <span className="font-medium">156</span>
                      </div>
                      <Progress value={35} className="h-1.5" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Infrastructure
                        </span>
                        <span className="font-medium">89</span>
                      </div>
                      <Progress value={22} className="h-1.5" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Risk Reduction Recommendations</CardTitle>
              <CardDescription>
                Prioritized actions to reduce attack surface
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 rounded-lg border border-red-200 bg-red-50">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-700 font-bold text-sm shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-red-900">
                      Disable Former Employee Access
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                      47 dormant accounts belong to former employees with
                      retained access privileges. Immediate disable recommended.
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="bg-red-100">
                        47 entities
                      </Badge>
                      <Badge variant="outline" className="bg-red-100">
                        Risk Score: 85+
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg border border-orange-200 bg-orange-50">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-bold text-sm shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-orange-900">
                      Rotate Unrotated Keys
                    </div>
                    <p className="text-sm text-orange-700 mt-1">
                      23 signing and encryption keys have not been rotated in
                      over 180 days. Rotation required for compliance.
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="bg-orange-100">
                        23 keys
                      </Badge>
                      <Badge variant="outline" className="bg-orange-100">
                        &gt;180 days
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg border border-yellow-200 bg-yellow-50">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 font-bold text-sm shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-yellow-900">
                      Revoke Long-Lived Tokens
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      312 tokens have exceeded their recommended lifetime
                      without rotation. Review and revoke unnecessary tokens.
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="bg-yellow-100">
                        312 tokens
                      </Badge>
                      <Badge variant="outline" className="bg-yellow-100">
                        30-90 days
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg border border-blue-200 bg-blue-50">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm shrink-0">
                    4
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-blue-900">
                      Clean Up Deprecated Roles
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      45 custom roles are no longer assigned to any user but
                      retain active permissions. Safe to remove.
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="bg-blue-100">
                        45 roles
                      </Badge>
                      <Badge variant="outline" className="bg-blue-100">
                        No assignments
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TRENDS TAB */}
        <TabsContent value="trends" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Dormancy Trends (6 Months)
              </CardTitle>
              <CardDescription>
                Evolution of dormant entities over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TrendChart />
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Remediation Effectiveness</CardTitle>
                <CardDescription>
                  How well dormancy cleanup policies are working
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-center gap-3">
                      <TrendingDown className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium text-green-900">
                          Critical Entities
                        </div>
                        <div className="text-xs text-green-700">
                          Reduction this quarter
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      -18%
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 border border-red-200">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-red-600" />
                      <div>
                        <div className="font-medium text-red-900">
                          New Dormant
                        </div>
                        <div className="text-xs text-red-700">
                          Increase vs last month
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-red-600">+12%</div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium mb-3">
                      Policy Compliance
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Auto-Disable Rules</span>
                          <span className="font-medium">87%</span>
                        </div>
                        <Progress value={87} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Rotation Compliance</span>
                          <span className="font-medium">72%</span>
                        </div>
                        <Progress value={72} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Review SLAs</span>
                          <span className="font-medium">94%</span>
                        </div>
                        <Progress value={94} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Activity</CardTitle>
                <CardDescription>
                  Dormancy detection and remediation activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {DORMANT_SUMMARY.trend.slice(-4).map((period) => (
                    <div key={period.date} className="p-3 rounded border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">
                          {new Date(period.date).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <Badge variant="outline">{period.count} total</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingDown className="h-3 w-3" />
                          {period.resolved} resolved
                        </div>
                        <div className="flex items-center gap-1 text-red-600">
                          <TrendingUp className="h-3 w-3" />
                          {period.newDormant} new
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* EVIDENCE TAB */}
        <TabsContent value="evidence" className="space-y-6 mt-6">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Entity Evidence Details</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    Export CSV
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <FileText className="h-4 w-4" />
                    Export JSON
                  </Button>
                </div>
              </div>

              {selectedEntity ? (
                <EvidencePanel entity={selectedEntity} />
              ) : (
                <Card className="border-dashed">
                  <CardContent className="py-12 text-center">
                    <Moon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Select an entity to view detailed evidence
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Critical Entities</h3>
              <div className="space-y-2 max-h-200 overflow-y-auto">
                {DORMANT_ENTITIES.filter((e) => e.category === "critical")
                  .sort((a, b) => b.riskScore - a.riskScore)
                  .map((entity) => (
                    <button
                      key={entity.id}
                      onClick={() => setSelectedEntity(entity)}
                      className={cn(
                        "w-full text-left p-3 rounded-lg border transition-colors",
                        selectedEntity?.id === entity.id
                          ? "bg-red-50 border-red-200"
                          : "hover:bg-muted/50",
                      )}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className="font-medium text-sm">
                          {entity.displayName}
                        </span>
                        <span className="text-xs font-bold text-red-600">
                          {entity.riskScore}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {ENTITY_TYPE_LABELS[entity.type]} •{" "}
                        {formatDuration(entity.dormantDays)}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-[10px]">
                          {entity.privilegeLevel}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-red-500/10 text-red-700"
                        >
                          critical
                        </Badge>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
