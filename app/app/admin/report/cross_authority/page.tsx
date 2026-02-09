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
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  Network,
  Share2,
  AlertTriangle,
  AlertCircle,
  Info,
  Shield,
  ShieldAlert,
  Globe,
  Building2,
  Key,
  ArrowRight,
  ArrowLeft,
  ArrowRightLeft,
  Clock,
  FileText,
  Download,
  Eye,
  ExternalLink,
  Lock,
  GitBranch,
  Fingerprint,
  Scan,
  TrendingUp,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ==================== TYPES & INTERFACES ====================

export type AuthorityType =
  | "aether_tenant"
  | "external_idp_oidc"
  | "external_idp_saml"
  | "partner_org"
  | "infrastructure"
  | "regulatory_domain"
  | "network_zone";

export type TrustDirection = "inbound" | "outbound" | "bidirectional";
export type TrustStatus = "active" | "suspended" | "expired" | "pending";
export type RiskLevel = "informational" | "warning" | "critical";

export interface Authority {
  id: string;
  name: string;
  type: AuthorityType;
  identifier: string;
  domain?: string;
  region?: string;
  status: "active" | "inactive" | "compromised";
  verificationStatus: "verified" | "pending" | "failed";
  lastSeen?: string;
  metadata?: {
    tenantId?: string;
    organizationId?: string;
    providerUrl?: string;
    certificateFingerprint?: string;
  };
}

export interface TrustRelationship {
  id: string;
  sourceAuthority: Authority;
  targetAuthority: Authority;
  direction: TrustDirection;
  status: TrustStatus;
  level: "full" | "limited" | "conditional" | "temporary";
  privilegeLevel: "none" | "read" | "write" | "admin" | "root";
  establishedAt: string;
  expiresAt?: string;
  conditions?: string[];
  inherited: boolean;
  riskScore: number;
  usageStats: {
    totalAuthentications: number;
    last24h: number;
    failedAttempts: number;
  };
}

export interface CrossAuthorityAccessEvent {
  id: string;
  timestamp: string;
  sourceAuthority: Authority;
  targetAuthority: Authority;
  identity: {
    id: string;
    name: string;
    email?: string;
    type: string;
    originalAuthority: string;
  };
  resource: {
    id: string;
    name: string;
    type: string;
    authority: string;
  };
  action: string;
  decision: "allow" | "deny" | "challenge";
  policyId?: string;
  policyName?: string;
  justification?: string;
  privilegePropagated: boolean;
  propagatedPrivileges: string[];
  riskScore: number;
  trustChain: string[];
}

export interface PrivilegePropagation {
  id: string;
  sourceIdentity: string;
  sourceAuthority: string;
  targetAuthority: string;
  originalPrivileges: string[];
  propagatedPrivileges: string[];
  escalationType: "direct" | "indirect" | "inherited";
  pivotAccounts: string[];
  riskLevel: "low" | "medium" | "high" | "critical";
  detectedAt: string;
}

export interface CrossAuthorityRisk {
  id: string;
  type:
    | "unexpected_access"
    | "inactive_trust"
    | "trust_abuse"
    | "unjustified_access"
    | "privilege_escalation"
    | "credential_propagation"
    | "shadow_trust";
  severity: RiskLevel;
  title: string;
  description: string;
  affectedAuthorities: string[];
  detectedAt: string;
  evidence: string[];
  recommendation: string;
}

export interface CrossAuthoritySummary {
  totalAuthorities: number;
  activeTrusts: number;
  suspendedTrusts: number;
  crossAuthorityEvents24h: number;
  highPrivilegePaths: number;
  bidirectionalTrusts: number;
  inheritedTrusts: number;
  undocumentedTrusts: number;
  activeRisks: number;
  criticalRisks: number;
  warningRisks: number;
  trend: Array<{
    date: string;
    events: number;
    risks: number;
    trustChanges: number;
  }>;
}

// ==================== MOCK DATA ====================

const AUTHORITIES: Authority[] = [
  {
    id: "auth-aether-prod",
    name: "Aether Production",
    type: "aether_tenant",
    identifier: "tenant-prod-001",
    domain: "aether.io",
    region: "eu-west-1",
    status: "active",
    verificationStatus: "verified",
    lastSeen: "2025-02-09T10:30:00Z",
    metadata: { tenantId: "prod-001" },
  },
  {
    id: "auth-aether-staging",
    name: "Aether Staging",
    type: "aether_tenant",
    identifier: "tenant-staging-001",
    domain: "staging.aether.io",
    region: "eu-west-1",
    status: "active",
    verificationStatus: "verified",
    lastSeen: "2025-02-09T10:25:00Z",
    metadata: { tenantId: "staging-001" },
  },
  {
    id: "auth-okta-enterprise",
    name: "Okta Enterprise",
    type: "external_idp_oidc",
    identifier: "okta://enterprise",
    domain: "enterprise.okta.com",
    region: "us-east-1",
    status: "active",
    verificationStatus: "verified",
    lastSeen: "2025-02-09T10:28:00Z",
    metadata: { providerUrl: "https://enterprise.okta.com/oauth2/default" },
  },
  {
    id: "auth-azure-ad",
    name: "Azure AD Corporate",
    type: "external_idp_saml",
    identifier: "azure://corporate-tenant",
    domain: "corporate.onmicrosoft.com",
    region: "global",
    status: "active",
    verificationStatus: "verified",
    lastSeen: "2025-02-09T10:15:00Z",
    metadata: {},
  },
  {
    id: "auth-partner-techcorp",
    name: "TechCorp Partner",
    type: "partner_org",
    identifier: "partner://techcorp",
    domain: "techcorp.com",
    region: "us-west-2",
    status: "active",
    verificationStatus: "verified",
    lastSeen: "2025-02-09T09:45:00Z",
    metadata: { organizationId: "org-techcorp" },
  },
  {
    id: "auth-infra-legacy",
    name: "Legacy Infrastructure",
    type: "infrastructure",
    identifier: "infra://legacy-dc",
    domain: "legacy.internal",
    region: "on-prem",
    status: "inactive",
    verificationStatus: "pending",
    lastSeen: "2025-01-15T08:00:00Z",
    metadata: {},
  },
  {
    id: "auth-regulatory-gdpr",
    name: "GDPR Compliance Zone",
    type: "regulatory_domain",
    identifier: "regulatory://gdpr",
    domain: "eu.aether.io",
    region: "eu-central-1",
    status: "active",
    verificationStatus: "verified",
    metadata: {},
  },
  {
    id: "auth-network-dmz",
    name: "DMZ Network Zone",
    type: "network_zone",
    identifier: "network://dmz",
    domain: "dmz.aether.io",
    region: "eu-west-1",
    status: "active",
    verificationStatus: "verified",
    lastSeen: "2025-02-09T10:20:00Z",
    metadata: {},
  },
];

const TRUST_RELATIONSHIPS: TrustRelationship[] = [
  {
    id: "trust-001",
    sourceAuthority: AUTHORITIES[0],
    targetAuthority: AUTHORITIES[2],
    direction: "bidirectional",
    status: "active",
    level: "full",
    privilegeLevel: "admin",
    establishedAt: "2024-06-15T10:00:00Z",
    conditions: ["MFA required", "IP whitelist"],
    inherited: false,
    riskScore: 35,
    usageStats: {
      totalAuthentications: 12456,
      last24h: 342,
      failedAttempts: 12,
    },
  },
  {
    id: "trust-002",
    sourceAuthority: AUTHORITIES[0],
    targetAuthority: AUTHORITIES[3],
    direction: "outbound",
    status: "active",
    level: "conditional",
    privilegeLevel: "write",
    establishedAt: "2024-08-20T14:30:00Z",
    conditions: ["Business hours only", "Justification required"],
    inherited: false,
    riskScore: 55,
    usageStats: { totalAuthentications: 5678, last24h: 156, failedAttempts: 3 },
  },
  {
    id: "trust-003",
    sourceAuthority: AUTHORITIES[2],
    targetAuthority: AUTHORITIES[4],
    direction: "outbound",
    status: "active",
    level: "limited",
    privilegeLevel: "read",
    establishedAt: "2024-09-10T09:00:00Z",
    inherited: true,
    riskScore: 25,
    usageStats: { totalAuthentications: 890, last24h: 45, failedAttempts: 0 },
  },
  {
    id: "trust-004",
    sourceAuthority: AUTHORITIES[4],
    targetAuthority: AUTHORITIES[0],
    direction: "inbound",
    status: "suspended",
    level: "temporary",
    privilegeLevel: "write",
    establishedAt: "2024-10-05T11:00:00Z",
    expiresAt: "2025-01-05T11:00:00Z",
    inherited: false,
    riskScore: 75,
    usageStats: { totalAuthentications: 234, last24h: 0, failedAttempts: 15 },
  },
  {
    id: "trust-005",
    sourceAuthority: AUTHORITIES[1],
    targetAuthority: AUTHORITIES[0],
    direction: "bidirectional",
    status: "active",
    level: "full",
    privilegeLevel: "admin",
    establishedAt: "2024-01-10T08:00:00Z",
    conditions: ["Environment separation enforced"],
    inherited: false,
    riskScore: 45,
    usageStats: { totalAuthentications: 4567, last24h: 123, failedAttempts: 2 },
  },
  {
    id: "trust-006",
    sourceAuthority: AUTHORITIES[6],
    targetAuthority: AUTHORITIES[0],
    direction: "outbound",
    status: "active",
    level: "conditional",
    privilegeLevel: "read",
    establishedAt: "2024-07-22T16:00:00Z",
    conditions: ["Data residency enforced"],
    inherited: false,
    riskScore: 20,
    usageStats: { totalAuthentications: 3456, last24h: 89, failedAttempts: 1 },
  },
];

const CROSS_AUTHORITY_EVENTS: CrossAuthorityAccessEvent[] = [
  {
    id: "evt-ca-001",
    timestamp: "2025-02-09T10:25:00Z",
    sourceAuthority: AUTHORITIES[2],
    targetAuthority: AUTHORITIES[0],
    identity: {
      id: "user-123",
      name: "john.smith@enterprise.okta.com",
      email: "john.smith@enterprise.okta.com",
      type: "user",
      originalAuthority: "Okta Enterprise",
    },
    resource: {
      id: "res-api-prod",
      name: "Production API Gateway",
      type: "api",
      authority: "Aether Production",
    },
    action: "read:metrics",
    decision: "allow",
    policyId: "pol-cross-auth-001",
    policyName: "Cross-Authority Production Access",
    justification: "Monitoring dashboard access",
    privilegePropagated: true,
    propagatedPrivileges: ["read:metrics", "read:logs"],
    riskScore: 25,
    trustChain: ["auth-okta-enterprise", "trust-001", "auth-aether-prod"],
  },
  {
    id: "evt-ca-002",
    timestamp: "2025-02-09T10:20:00Z",
    sourceAuthority: AUTHORITIES[4],
    targetAuthority: AUTHORITIES[0],
    identity: {
      id: "svc-partner-001",
      name: "techcorp-integration-service",
      type: "service",
      originalAuthority: "TechCorp Partner",
    },
    resource: {
      id: "res-db-shared",
      name: "Shared Customer Database",
      type: "database",
      authority: "Aether Production",
    },
    action: "write:customer_data",
    decision: "allow",
    policyId: "pol-partner-001",
    policyName: "Partner Integration Policy",
    justification: "Customer data synchronization",
    privilegePropagated: true,
    propagatedPrivileges: ["write:customer_data", "read:customer_metadata"],
    riskScore: 65,
    trustChain: ["auth-partner-techcorp", "trust-004", "auth-aether-prod"],
  },
  {
    id: "evt-ca-003",
    timestamp: "2025-02-09T10:15:00Z",
    sourceAuthority: AUTHORITIES[0],
    targetAuthority: AUTHORITIES[3],
    identity: {
      id: "user-456",
      name: "alice.jones@aether.io",
      email: "alice.jones@aether.io",
      type: "user",
      originalAuthority: "Aether Production",
    },
    resource: {
      id: "res-sharepoint",
      name: "Corporate SharePoint",
      type: "application",
      authority: "Azure AD Corporate",
    },
    action: "read:documents",
    decision: "allow",
    privilegePropagated: false,
    propagatedPrivileges: [],
    riskScore: 15,
    trustChain: ["auth-aether-prod", "trust-002", "auth-azure-ad"],
  },
  {
    id: "evt-ca-004",
    timestamp: "2025-02-09T09:45:00Z",
    sourceAuthority: AUTHORITIES[0],
    targetAuthority: AUTHORITIES[2],
    identity: {
      id: "admin-789",
      name: "admin@aether.io",
      email: "admin@aether.io",
      type: "user",
      originalAuthority: "Aether Production",
    },
    resource: {
      id: "res-okta-admin",
      name: "Okta Admin Console",
      type: "application",
      authority: "Okta Enterprise",
    },
    action: "admin:configure",
    decision: "deny",
    policyId: "pol-privileged-001",
    policyName: "Privileged Cross-Authority Access",
    justification: "Cross-authority admin access blocked",
    privilegePropagated: false,
    propagatedPrivileges: [],
    riskScore: 85,
    trustChain: ["auth-aether-prod", "trust-001", "auth-okta-enterprise"],
  },
  {
    id: "evt-ca-005",
    timestamp: "2025-02-09T09:30:00Z",
    sourceAuthority: AUTHORITIES[1],
    targetAuthority: AUTHORITIES[0],
    identity: {
      id: "deploy-svc",
      name: "staging-deployment-service",
      type: "service",
      originalAuthority: "Aether Staging",
    },
    resource: {
      id: "res-k8s-prod",
      name: "Production Kubernetes",
      type: "infrastructure",
      authority: "Aether Production",
    },
    action: "deploy:application",
    decision: "challenge",
    policyId: "pol-deployment-001",
    policyName: "Cross-Environment Deployment",
    justification: "Promotion from staging to production",
    privilegePropagated: true,
    propagatedPrivileges: ["deploy:application", "read:config"],
    riskScore: 70,
    trustChain: ["auth-aether-staging", "trust-005", "auth-aether-prod"],
  },
];

const PRIVILEGE_PROPAGATIONS: PrivilegePropagation[] = [
  {
    id: "pp-001",
    sourceIdentity: "john.smith@enterprise.okta.com",
    sourceAuthority: "Okta Enterprise",
    targetAuthority: "Aether Production",
    originalPrivileges: ["user:standard"],
    propagatedPrivileges: ["user:standard", "read:metrics", "read:logs"],
    escalationType: "direct",
    pivotAccounts: [],
    riskLevel: "medium",
    detectedAt: "2025-02-09T10:25:00Z",
  },
  {
    id: "pp-002",
    sourceIdentity: "techcorp-integration-service",
    sourceAuthority: "TechCorp Partner",
    targetAuthority: "Aether Production",
    originalPrivileges: ["partner:read"],
    propagatedPrivileges: [
      "partner:read",
      "write:customer_data",
      "read:customer_metadata",
    ],
    escalationType: "indirect",
    pivotAccounts: ["svc-intermediate-001"],
    riskLevel: "high",
    detectedAt: "2025-02-09T10:20:00Z",
  },
  {
    id: "pp-003",
    sourceIdentity: "admin@aether.io",
    sourceAuthority: "Aether Production",
    targetAuthority: "Okta Enterprise",
    originalPrivileges: ["admin:super"],
    propagatedPrivileges: ["admin:super", "admin:okta", "user:manage"],
    escalationType: "inherited",
    pivotAccounts: ["sync-service-001", "auth-bridge-002"],
    riskLevel: "critical",
    detectedAt: "2025-02-09T09:45:00Z",
  },
];

const RISKS: CrossAuthorityRisk[] = [
  {
    id: "risk-001",
    type: "inactive_trust",
    severity: "warning",
    title: "Suspended Trust Still Active",
    description:
      "Trust relationship trust-004 (TechCorp Partner → Aether Production) is suspended but still receiving traffic",
    affectedAuthorities: ["auth-partner-techcorp", "auth-aether-prod"],
    detectedAt: "2025-02-09T10:00:00Z",
    evidence: ["evt-ca-002", "trust-004"],
    recommendation:
      "Review and terminate trust or reactivate with proper controls",
  },
  {
    id: "risk-002",
    type: "privilege_escalation",
    severity: "critical",
    title: "Critical Privilege Escalation Detected",
    description:
      "Admin account admin@aether.io attempting cross-authority admin access to Okta Enterprise",
    affectedAuthorities: ["auth-aether-prod", "auth-okta-enterprise"],
    detectedAt: "2025-02-09T09:45:00Z",
    evidence: ["evt-ca-004", "pp-003"],
    recommendation:
      "Immediately review trust privilege levels and implement separation of duties",
  },
  {
    id: "risk-003",
    type: "shadow_trust",
    severity: "warning",
    title: "Undocumented Inherited Trust",
    description:
      "Trust from Okta Enterprise → TechCorp Partner is inherited but not documented in trust registry",
    affectedAuthorities: ["auth-okta-enterprise", "auth-partner-techcorp"],
    detectedAt: "2025-02-09T08:30:00Z",
    evidence: ["trust-003"],
    recommendation:
      "Document inherited trust relationship or revoke if unauthorized",
  },
  {
    id: "risk-004",
    type: "credential_propagation",
    severity: "critical",
    title: "Multi-Authority Token Validity",
    description:
      "Service account staging-deployment-service has valid tokens across 3 authorities simultaneously",
    affectedAuthorities: [
      "auth-aether-staging",
      "auth-aether-prod",
      "auth-azure-ad",
    ],
    detectedAt: "2025-02-09T09:30:00Z",
    evidence: ["evt-ca-005"],
    recommendation:
      "Implement token scope isolation and cross-authority token invalidation",
  },
  {
    id: "risk-005",
    type: "unjustified_access",
    severity: "informational",
    title: "Cross-Authority Access Without Business Justification",
    description:
      "Several access events lack explicit business justification in policy logs",
    affectedAuthorities: ["auth-aether-prod", "auth-okta-enterprise"],
    detectedAt: "2025-02-09T00:00:00Z",
    evidence: ["audit-logs-24h"],
    recommendation:
      "Enforce justification requirement for all cross-authority access",
  },
];

const CROSS_AUTHORITY_SUMMARY: CrossAuthoritySummary = {
  totalAuthorities: 8,
  activeTrusts: 5,
  suspendedTrusts: 1,
  crossAuthorityEvents24h: 234,
  highPrivilegePaths: 3,
  bidirectionalTrusts: 2,
  inheritedTrusts: 1,
  undocumentedTrusts: 1,
  activeRisks: 5,
  criticalRisks: 2,
  warningRisks: 2,
  trend: [
    { date: "2024-02-03", events: 189, risks: 3, trustChanges: 0 },
    { date: "2024-02-04", events: 201, risks: 3, trustChanges: 1 },
    { date: "2024-02-05", events: 195, risks: 4, trustChanges: 0 },
    { date: "2024-02-06", events: 210, risks: 4, trustChanges: 0 },
    { date: "2024-02-07", events: 218, risks: 5, trustChanges: 1 },
    { date: "2024-02-08", events: 225, risks: 5, trustChanges: 0 },
    { date: "2025-02-09", events: 234, risks: 5, trustChanges: 0 },
  ],
};

// ==================== CONSTANTS ====================

const AUTHORITY_TYPE_LABELS: Record<AuthorityType, string> = {
  aether_tenant: "Aether Tenant",
  external_idp_oidc: "External IdP (OIDC)",
  external_idp_saml: "External IdP (SAML)",
  partner_org: "Partner Organization",
  infrastructure: "Infrastructure",
  regulatory_domain: "Regulatory Domain",
  network_zone: "Network Zone",
};

const AUTHORITY_TYPE_ICONS: Record<AuthorityType, React.ElementType> = {
  aether_tenant: Shield,
  external_idp_oidc: Globe,
  external_idp_saml: Globe,
  partner_org: Building2,
  infrastructure: Network,
  regulatory_domain: Lock,
  network_zone: Activity,
};

const RISK_COLORS = {
  informational: {
    bg: "bg-blue-500/10",
    text: "text-blue-700",
    border: "border-blue-500/20",
    icon: Info,
  },
  warning: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-700",
    border: "border-yellow-500/20",
    icon: AlertTriangle,
  },
  critical: {
    bg: "bg-red-500/10",
    text: "text-red-700",
    border: "border-red-500/20",
    icon: AlertCircle,
  },
};

// ==================== COMPONENTS ====================

function TimeDisplay() {
  const [time, setTime] = React.useState<string>("");

  React.useEffect(() => {
    setTime(new Date().toLocaleString());
  }, []);

  return <span suppressHydrationWarning>{time}</span>;
}

function AuthorityTypeBadge({ type }: { type: AuthorityType }) {
  const Icon = AUTHORITY_TYPE_ICONS[type];
  return (
    <Badge variant="outline" className="gap-1">
      <Icon className="h-3 w-3" />
      {AUTHORITY_TYPE_LABELS[type]}
    </Badge>
  );
}

function TrustDirectionBadge({ direction }: { direction: TrustDirection }) {
  const config = {
    inbound: {
      icon: ArrowLeft,
      label: "Inbound",
      className: "bg-blue-500/10 text-blue-700",
    },
    outbound: {
      icon: ArrowRight,
      label: "Outbound",
      className: "bg-purple-500/10 text-purple-700",
    },
    bidirectional: {
      icon: ArrowRightLeft,
      label: "Bidirectional",
      className: "bg-green-500/10 text-green-700",
    },
  };
  const { icon: Icon, label, className } = config[direction];
  return (
    <Badge variant="outline" className={cn("gap-1", className)}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}

function RiskLevelBadge({ level }: { level: RiskLevel }) {
  const config = RISK_COLORS[level];
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

function TrustGraph() {
  // Simplified SVG-based network visualization
  const width = 800;
  const height = 400;

  // Position nodes in a circle
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 140;

  const nodes = AUTHORITIES.map((auth, i) => {
    const angle = (i / AUTHORITIES.length) * 2 * Math.PI - Math.PI / 2;
    return {
      ...auth,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          Trust Relationships Map
        </CardTitle>
        <CardDescription>
          Visual representation of authority trust connections
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto min-h-[400px]"
          >
            {/* Draw trust lines */}
            {TRUST_RELATIONSHIPS.map((trust) => {
              const source = nodes.find(
                (n) => n.id === trust.sourceAuthority.id,
              );
              const target = nodes.find(
                (n) => n.id === trust.targetAuthority.id,
              );
              if (!source || !target) return null;

              const isBidirectional = trust.direction === "bidirectional";
              const isInherited = trust.inherited;
              const isSuspended = trust.status === "suspended";

              return (
                <g key={trust.id}>
                  <line
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={
                      isSuspended
                        ? "#ef4444"
                        : isInherited
                          ? "#f59e0b"
                          : "#22c55e"
                    }
                    strokeWidth={
                      trust.privilegeLevel === "admin" ||
                      trust.privilegeLevel === "root"
                        ? 3
                        : 2
                    }
                    strokeDasharray={isInherited ? "5,5" : undefined}
                    opacity={isSuspended ? 0.5 : 1}
                    markerEnd={isBidirectional ? undefined : "url(#arrowhead)"}
                  />
                  {isBidirectional && (
                    <line
                      x1={target.x}
                      y1={target.y}
                      x2={source.x}
                      y2={source.y}
                      stroke={isSuspended ? "#ef4444" : "#22c55e"}
                      strokeWidth={2}
                      opacity={isSuspended ? 0.5 : 1}
                      markerEnd="url(#arrowhead)"
                    />
                  )}
                </g>
              );
            })}

            {/* Arrow marker */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="28"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" />
              </marker>
            </defs>

            {/* Draw nodes */}
            {nodes.map((node) => {
              const Icon = AUTHORITY_TYPE_ICONS[node.type];
              const isInactive = node.status === "inactive";

              return (
                <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                  <circle
                    r="24"
                    fill={isInactive ? "#fee2e2" : "#dbeafe"}
                    stroke={isInactive ? "#ef4444" : "#3b82f6"}
                    strokeWidth="2"
                  />
                  <foreignObject x="-12" y="-12" width="24" height="24">
                    <div className="flex items-center justify-center h-full">
                      <Icon
                        className={cn(
                          "h-4 w-4",
                          isInactive ? "text-red-500" : "text-blue-600",
                        )}
                      />
                    </div>
                  </foreignObject>
                  <text
                    y="40"
                    textAnchor="middle"
                    className="text-xs fill-current"
                    style={{ fontSize: "10px", fontWeight: 500 }}
                  >
                    {node.name.length > 15
                      ? node.name.substring(0, 15) + "..."
                      : node.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-green-500" />
              <span>Active Trust</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-red-500 opacity-50" />
              <span>Suspended</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-0.5 bg-yellow-500"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, transparent, transparent 3px, #f59e0b 3px, #f59e0b 6px)",
                }}
              />
              <span>Inherited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-green-500" />
              <span>High Privilege</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TrustRelationshipsTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Trust</TableHead>
            <TableHead>Direction</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Privilege</TableHead>
            <TableHead>Inherited</TableHead>
            <TableHead>Risk Score</TableHead>
            <TableHead>Usage (24h)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {TRUST_RELATIONSHIPS.map((trust) => (
            <TableRow key={trust.id}>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium text-sm">
                    {trust.sourceAuthority.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    → {trust.targetAuthority.name}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <TrustDirectionBadge direction={trust.direction} />
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {trust.level}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn(
                    "capitalize",
                    trust.privilegeLevel === "admin" &&
                      "bg-red-500/10 text-red-700",
                    trust.privilegeLevel === "root" &&
                      "bg-red-900/10 text-red-900",
                  )}
                >
                  {trust.privilegeLevel}
                </Badge>
              </TableCell>
              <TableCell>
                {trust.inherited ? (
                  <Badge variant="secondary">Yes</Badge>
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
                        trust.riskScore >= 70
                          ? "bg-red-500"
                          : trust.riskScore >= 40
                            ? "bg-yellow-500"
                            : "bg-green-500",
                      )}
                      style={{ width: `${trust.riskScore}%` }}
                    />
                  </div>
                  <span className="text-sm">{trust.riskScore}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {trust.usageStats.last24h} events
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function CrossAuthorityEventsTable({
  events,
}: {
  events: CrossAuthorityAccessEvent[];
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Identity</TableHead>
            <TableHead>Source → Target</TableHead>
            <TableHead>Resource</TableHead>
            <TableHead>Decision</TableHead>
            <TableHead>Privilege Prop.</TableHead>
            <TableHead>Risk</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="whitespace-nowrap text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  {new Date(event.timestamp).toLocaleTimeString()}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium text-sm">
                    {event.identity.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {event.identity.type}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <span className="text-muted-foreground">
                    {event.sourceAuthority.name}
                  </span>
                  <ArrowRight className="inline h-3 w-3 mx-1" />
                  <span>{event.targetAuthority.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium text-sm">
                    {event.resource.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {event.resource.type}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    event.decision === "allow"
                      ? "secondary"
                      : event.decision === "deny"
                        ? "destructive"
                        : "default"
                  }
                  className={cn(
                    event.decision === "allow" &&
                      "bg-green-500/10 text-green-700",
                    event.decision === "challenge" &&
                      "bg-yellow-500/10 text-yellow-700",
                  )}
                >
                  {event.decision}
                </Badge>
              </TableCell>
              <TableCell>
                {event.privilegePropagated ? (
                  <div className="flex flex-wrap gap-1">
                    {event.propagatedPrivileges.slice(0, 2).map((priv, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {priv}
                      </Badge>
                    ))}
                    {event.propagatedPrivileges.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{event.propagatedPrivileges.length - 2}
                      </Badge>
                    )}
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        event.riskScore >= 70
                          ? "bg-red-500"
                          : event.riskScore >= 40
                            ? "bg-yellow-500"
                            : "bg-green-500",
                      )}
                      style={{ width: `${event.riskScore}%` }}
                    />
                  </div>
                  <span className="text-sm">{event.riskScore}</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function PrivilegePropagationCard({
  propagation,
}: {
  propagation: PrivilegePropagation;
}) {
  return (
    <Card
      className={cn(
        "border-l-4",
        propagation.riskLevel === "critical" && "border-l-red-500",
        propagation.riskLevel === "high" && "border-l-orange-500",
        propagation.riskLevel === "medium" && "border-l-yellow-500",
        propagation.riskLevel === "low" && "border-l-green-500",
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">
              {propagation.sourceIdentity}
            </CardTitle>
            <CardDescription className="mt-1">
              {propagation.sourceAuthority} → {propagation.targetAuthority}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className={cn(
              propagation.riskLevel === "critical" &&
                "bg-red-500/10 text-red-700",
              propagation.riskLevel === "high" &&
                "bg-orange-500/10 text-orange-700",
              propagation.riskLevel === "medium" &&
                "bg-yellow-500/10 text-yellow-700",
              propagation.riskLevel === "low" &&
                "bg-green-500/10 text-green-700",
            )}
          >
            {propagation.riskLevel.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              Original Privileges
            </div>
            <div className="flex flex-wrap gap-1">
              {propagation.originalPrivileges.map((priv, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {priv}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              Propagated Privileges
            </div>
            <div className="flex flex-wrap gap-1">
              {propagation.propagatedPrivileges.map((priv, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="text-xs bg-yellow-500/10"
                >
                  {priv}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Escalation:</span>
            <span className="capitalize">{propagation.escalationType}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Detected {new Date(propagation.detectedAt).toLocaleTimeString()}
          </div>
        </div>

        {propagation.pivotAccounts.length > 0 && (
          <div className="pt-2 border-t">
            <div className="text-xs text-muted-foreground mb-1">
              Pivot Accounts
            </div>
            <div className="flex flex-wrap gap-1">
              {propagation.pivotAccounts.map((account, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  <Fingerprint className="h-3 w-3 mr-1" />
                  {account}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RiskCard({ risk }: { risk: CrossAuthorityRisk }) {
  const config = RISK_COLORS[risk.severity];
  const Icon = config.icon;

  return (
    <Card
      className={cn(
        "border-l-4",
        config.border.replace("border-", "border-l-"),
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className={cn("p-2 rounded-lg", config.bg)}>
            <Icon className={cn("h-5 w-5", config.text)} />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <CardTitle className="text-base">{risk.title}</CardTitle>
              <RiskLevelBadge level={risk.severity} />
            </div>
            <CardDescription className="mt-1">
              {risk.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="flex flex-wrap gap-2">
          {risk.affectedAuthorities.map((authId) => {
            const auth = AUTHORITIES.find((a) => a.id === authId);
            return auth ? (
              <Badge key={authId} variant="outline" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                {auth.name}
              </Badge>
            ) : null;
          })}
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-start gap-2">
            <Scan className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <div className="text-xs font-medium text-muted-foreground">
                Recommendation
              </div>
              <div className="text-sm">{risk.recommendation}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Detected: {new Date(risk.detectedAt).toLocaleString()}</span>
          <div className="flex items-center gap-1">
            <span>Evidence:</span>
            {risk.evidence.map((ev, i) => (
              <code key={i} className="bg-muted px-1 rounded">
                {ev}
              </code>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TrendChart({ data }: { data: CrossAuthoritySummary["trend"] }) {
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
          dataKey="events"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
          name="Events"
        />
        <Line
          type="monotone"
          dataKey="risks"
          stroke="#ef4444"
          strokeWidth={2}
          dot={false}
          name="Risks"
        />
        <Line
          type="monotone"
          dataKey="trustChanges"
          stroke="#22c55e"
          strokeWidth={2}
          dot={{ r: 4 }}
          name="Trust Changes"
        />
      </LineChart>
    </ChartContainer>
  );
}

// ==================== MAIN PAGE ====================

export default function CrossAuthorityReportPage() {
  const [activeTab, setActiveTab] = React.useState("overview");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Cross-Authority Report
          </h1>
          <p className="text-muted-foreground mt-1">
            Visualize, analyze, and audit access traversing multiple identity
            authorities
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
        <Link href="/admin/platform/policy">
          <Button variant="outline" size="sm" className="gap-1">
            <Shield className="h-3 w-3" />
            Policy Engine
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
        <Link href="/security/audit">
          <Button variant="outline" size="sm" className="gap-1">
            <FileText className="h-3 w-3" />
            Audit Logs
            <ExternalLink className="h-3 w-3" />
          </Button>
        </Link>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6 lg:w-[800px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trusts">Trust Map</TabsTrigger>
          <TabsTrigger value="access">Access Flow</TabsTrigger>
          <TabsTrigger value="privileges">Propagation</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Connected Authorities"
              value={CROSS_AUTHORITY_SUMMARY.totalAuthorities.toString()}
              icon={Globe}
              variant="default"
              subtitle="Across all environments"
            />
            <MetricCard
              title="Active Trusts"
              value={CROSS_AUTHORITY_SUMMARY.activeTrusts.toString()}
              icon={Share2}
              variant="accent"
              trend={{ value: 1, isPositive: true }}
              subtitle={`${CROSS_AUTHORITY_SUMMARY.bidirectionalTrusts} bidirectional`}
            />
            <MetricCard
              title="Cross-Authority Events"
              value={CROSS_AUTHORITY_SUMMARY.crossAuthorityEvents24h.toString()}
              icon={ArrowRightLeft}
              variant="warning"
              trend={{ value: 4.2, isPositive: true }}
              subtitle="Last 24 hours"
            />
            <MetricCard
              title="Active Risks"
              value={CROSS_AUTHORITY_SUMMARY.activeRisks.toString()}
              icon={ShieldAlert}
              variant="destructive"
              subtitle={`${CROSS_AUTHORITY_SUMMARY.criticalRisks} critical`}
            />
          </div>

          {/* Detailed Summary Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Trust Relationships
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Active</span>
                    <span className="font-medium">
                      {CROSS_AUTHORITY_SUMMARY.activeTrusts}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Suspended</span>
                    <span className="font-medium text-yellow-600">
                      {CROSS_AUTHORITY_SUMMARY.suspendedTrusts}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Bidirectional</span>
                    <span className="font-medium">
                      {CROSS_AUTHORITY_SUMMARY.bidirectionalTrusts}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Inherited</span>
                    <span className="font-medium text-yellow-600">
                      {CROSS_AUTHORITY_SUMMARY.inheritedTrusts}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Undocumented</span>
                    <span className="font-medium text-red-600">
                      {CROSS_AUTHORITY_SUMMARY.undocumentedTrusts}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Risk Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Active</span>
                    <span className="font-medium">
                      {CROSS_AUTHORITY_SUMMARY.activeRisks}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Critical</span>
                    <span className="font-medium text-red-600">
                      {CROSS_AUTHORITY_SUMMARY.criticalRisks}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Warnings</span>
                    <span className="font-medium text-yellow-600">
                      {CROSS_AUTHORITY_SUMMARY.warningRisks}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      High Privilege Paths
                    </span>
                    <span className="font-medium text-red-600">
                      {CROSS_AUTHORITY_SUMMARY.highPrivilegePaths}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Connected Authority Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array.from(new Set(AUTHORITIES.map((a) => a.type))).map(
                    (type) => {
                      const count = AUTHORITIES.filter(
                        (a) => a.type === type,
                      ).length;
                      const Icon = AUTHORITY_TYPE_ICONS[type];
                      return (
                        <div
                          key={type}
                          className="flex justify-between text-sm items-center"
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {AUTHORITY_TYPE_LABELS[type]}
                            </span>
                          </div>
                          <span className="font-medium">{count}</span>
                        </div>
                      );
                    },
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Cross-Authority Activity Trend
              </CardTitle>
              <CardDescription>
                Events, risks, and trust changes over the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TrendChart data={CROSS_AUTHORITY_SUMMARY.trend} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* TRUST MAP TAB */}
        <TabsContent value="trusts" className="space-y-6 mt-6">
          <TrustGraph />

          <Card>
            <CardHeader>
              <CardTitle>Trust Relationships Detail</CardTitle>
              <CardDescription>
                Complete list of trust relationships between authorities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TrustRelationshipsTable />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ACCESS FLOW TAB */}
        <TabsContent value="access" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Cross-Authority Access Events</CardTitle>
                  <CardDescription>
                    Identity access traversing organizational boundaries
                  </CardDescription>
                </div>
                <Badge variant="outline">
                  {CROSS_AUTHORITY_EVENTS.length} events
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CrossAuthorityEventsTable events={CROSS_AUTHORITY_EVENTS} />
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Trust Chain Analysis</CardTitle>
                <CardDescription>
                  Complete authority chains for cross-boundary access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {CROSS_AUTHORITY_EVENTS.slice(0, 3).map((event) => (
                    <div key={event.id} className="p-3 rounded-lg bg-muted/50">
                      <div className="text-xs text-muted-foreground mb-2">
                        {event.id}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {event.trustChain.map((nodeId, i) => (
                          <React.Fragment key={i}>
                            <code className="bg-background px-2 py-0.5 rounded text-xs">
                              {nodeId.split("-").slice(-2).join("-")}
                            </code>
                            {i < event.trustChain.length - 1 && (
                              <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privilege Propagation by Event</CardTitle>
                <CardDescription>
                  Privileges granted across authority boundaries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {CROSS_AUTHORITY_EVENTS.filter(
                    (e) => e.privilegePropagated,
                  ).map((event) => (
                    <div key={event.id} className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          {event.identity.name}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {event.id}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {event.propagatedPrivileges.map((priv, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-xs"
                          >
                            {priv}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* PRIVILEGE PROPAGATION TAB */}
        <TabsContent value="privileges" className="space-y-6 mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PRIVILEGE_PROPAGATIONS.map((prop) => (
              <PrivilegePropagationCard key={prop.id} propagation={prop} />
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Propagation Analysis Summary</CardTitle>
              <CardDescription>
                Key metrics on privilege escalation across authorities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold">
                    {PRIVILEGE_PROPAGATIONS.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Active Propagations
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-red-500/10">
                  <div className="text-2xl font-bold text-red-600">
                    {
                      PRIVILEGE_PROPAGATIONS.filter(
                        (p) => p.riskLevel === "critical",
                      ).length
                    }
                  </div>
                  <div className="text-sm text-red-600/70">Critical</div>
                </div>
                <div className="p-4 rounded-lg bg-yellow-500/10">
                  <div className="text-2xl font-bold text-yellow-600">
                    {
                      PRIVILEGE_PROPAGATIONS.filter(
                        (p) =>
                          p.riskLevel === "high" || p.riskLevel === "medium",
                      ).length
                    }
                  </div>
                  <div className="text-sm text-yellow-600/70">High/Medium</div>
                </div>
                <div className="p-4 rounded-lg bg-blue-500/10">
                  <div className="text-2xl font-bold text-blue-600">
                    {
                      PRIVILEGE_PROPAGATIONS.filter(
                        (p) => p.escalationType === "indirect",
                      ).length
                    }
                  </div>
                  <div className="text-sm text-blue-600/70">
                    Indirect Escalations
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RISKS TAB */}
        <TabsContent value="risks" className="space-y-6 mt-6">
          <div className="grid gap-4">
            {RISKS.sort((a, b) => {
              const severityOrder = {
                critical: 0,
                warning: 1,
                informational: 2,
              };
              return severityOrder[a.severity] - severityOrder[b.severity];
            }).map((risk) => (
              <RiskCard key={risk.id} risk={risk} />
            ))}
          </div>
        </TabsContent>

        {/* EVIDENCE TAB */}
        <TabsContent value="evidence" className="space-y-6 mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export Cross-Authority Report
                </CardTitle>
                <CardDescription>
                  Generate machine-readable evidence for audit and analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Export Format</label>
                  <Select defaultValue="json">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          JSON (Machine-readable)
                        </div>
                      </SelectItem>
                      <SelectItem value="csv">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          CSV (Spreadsheet)
                        </div>
                      </SelectItem>
                      <SelectItem value="graphml">
                        <div className="flex items-center gap-2">
                          <Network className="h-4 w-4" />
                          GraphML (Network graph)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Include Data</label>
                  <div className="space-y-2">
                    {[
                      "Trust Relationships",
                      "Access Events",
                      "Privilege Propagations",
                      "Risk Findings",
                      "Authority Metadata",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded"
                        />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Export
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Audit Trail
                </CardTitle>
                <CardDescription>
                  This page access is audited. Recent report views:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      user: "security-architect@aether.io",
                      action: "Viewed trust graph",
                      timestamp: "2025-02-09T10:45:00Z",
                      ip: "198.51.100.10",
                    },
                    {
                      user: "auditor@external-firm.com",
                      action: "Exported risk findings",
                      timestamp: "2025-02-09T09:30:00Z",
                      ip: "203.0.113.50",
                    },
                    {
                      user: "admin@aether.io",
                      action: "Viewed privilege propagation",
                      timestamp: "2025-02-08T16:20:00Z",
                      ip: "198.51.100.5",
                    },
                  ].map((entry, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg border text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{entry.user}</span>
                        <span className="text-muted-foreground">
                          {entry.action}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <code className="text-xs bg-muted px-2 py-0.5 rounded">
                          {entry.ip}
                        </code>
                        <span>
                          {new Date(entry.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Evidence Sources</CardTitle>
              <CardDescription>
                Data sources aggregated in this cross-authority report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    name: "Trust Registry",
                    status: "connected",
                    lastSync: "1 min ago",
                  },
                  {
                    name: "Access Decision Logs",
                    status: "connected",
                    lastSync: "30 sec ago",
                  },
                  {
                    name: "Identity Federation Service",
                    status: "connected",
                    lastSync: "2 min ago",
                  },
                  {
                    name: "Token Validation Service",
                    status: "connected",
                    lastSync: "1 min ago",
                  },
                  {
                    name: "Risk Analysis Engine",
                    status: "connected",
                    lastSync: "5 min ago",
                  },
                ].map((source) => (
                  <div
                    key={source.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-2.5 w-2.5 rounded-full",
                          source.status === "connected"
                            ? "bg-green-500"
                            : "bg-red-500",
                        )}
                      />
                      <span className="text-sm font-medium">{source.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Synced {source.lastSync}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
