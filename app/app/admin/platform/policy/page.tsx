"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/dashboard/ui/card";
import { Badge } from "@/components/dashboard/ui/badge";
import { Button } from "@/components/dashboard/ui/button";
import { Progress } from "@/components/dashboard/ui/progress";
import { Separator } from "@/components/dashboard/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/dashboard/ui/accordion";
import {
  FileLock,
  ShieldCheck,
  Shield,
  Clock,
  Layers,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  Download,
  Upload,
  Eye,
  Edit3,
  Copy,
  Trash2,
  History,
  Globe,
  Monitor,
  Smartphone,
  AlertCircle,
  Info,
  Settings,
  Filter,
  ChevronRight,
  ShieldAlert,
  Lock,
  Unlock,
  FileText,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES - Policy Platform Configuration
// ============================================================================

type PolicyStatus = "active" | "draft" | "archived";
type PolicyAction = "allow" | "deny" | "challenge";
type EnforcementMode = "enforcing" | "permissive" | "report_only";

interface Policy {
  id: string;
  name: string;
  description: string;
  type: "rbac" | "contextual" | "mfa" | "session" | "trust";
  status: PolicyStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  scope: string[];
  rules: PolicyRule[];
  enforcementMode: EnforcementMode;
  priority: number;
}

interface PolicyRule {
  id: string;
  name: string;
  condition: string;
  action: PolicyAction;
  resources: string[];
  effect: "permit" | "deny";
}

interface RbacPolicy extends Policy {
  type: "rbac";
  roles: string[];
  permissions: string[];
  resourceTypes: string[];
}

interface ContextualRule {
  id: string;
  name: string;
  description: string;
  conditions: {
    timeBased?: {
      startTime: string;
      endTime: string;
      days: string[];
      timezone: string;
    };
    locationBased?: {
      allowedCountries: string[];
      blockedCountries: string[];
      requireVpn: boolean;
    };
    deviceBased?: {
      trustedOnly: boolean;
      maxDeviceAge: number;
      requireEncryption: boolean;
    };
    riskBased?: {
      maxRiskScore: number;
      requiredFactors: number;
    };
  };
  actions: {
    requireAdditionalAuth: boolean;
    stepUpMfa: boolean;
    notifyAdmin: boolean;
    blockAccess: boolean;
  };
  priority: number;
  status: "active" | "inactive";
}

interface MfaRequirement {
  id: string;
  context: string;
  requiredFactors: number;
  allowedMethods: string[];
  enforcement: "mandatory" | "conditional";
  exceptions: string[];
  gracePeriod: number;
}

interface SessionPolicy {
  id: string;
  context: string;
  maxConcurrentSessions: number;
  idleTimeout: number;
  absoluteTimeout: number;
  rememberMeDuration: number;
  securityControls: {
    invalidateOnIpChange: boolean;
    invalidateOnUserAgentChange: boolean;
    requireReauthForSensitiveOps: boolean;
  };
}

interface TrustConfig {
  deviceTrust: {
    trustedDeviceTtl: number;
    requireDeviceVerification: boolean;
    autoTrustCorporateDevices: boolean;
  };
  networkTrust: {
    trustedNetworks: NetworkRange[];
    untrustedNetworks: NetworkRange[];
    vpnRequiredForAdmin: boolean;
  };
  trustLevels: TrustLevel[];
}

interface NetworkRange {
  id: string;
  name: string;
  cidr: string;
  description: string;
  type: "corporate" | "vpn" | "datacenter" | "custom";
}

interface TrustLevel {
  level: number;
  name: string;
  description: string;
  requirements: string[];
}

interface PolicyAuditEntry {
  id: string;
  timestamp: string;
  actor: {
    id: string;
    name: string;
    email: string;
  };
  action:
    | "created"
    | "updated"
    | "deleted"
    | "activated"
    | "deactivated"
    | "cloned";
  policyId: string;
  policyName: string;
  changes: PolicyChange[];
  ipAddress: string;
  sessionId: string;
}

interface PolicyChange {
  field: string;
  oldValue: string;
  newValue: string;
}

interface PolicyStats {
  activePolicies: number;
  pendingChanges: number;
  violations24h: number;
  complianceScore: number;
}

interface PolicyTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  policyCount: number;
  complianceFrameworks: string[];
}

// ============================================================================
// MOCK DATA - Policy Platform State
// ============================================================================

const mockStats: PolicyStats = {
  activePolicies: 47,
  pendingChanges: 3,
  violations24h: 12,
  complianceScore: 94,
};

const mockRbacPolicies: RbacPolicy[] = [
  {
    id: "pol-rbac-001",
    name: "Admin Full Access",
    description: "Full administrative access to all resources",
    type: "rbac",
    status: "active",
    version: 3,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2025-01-20T14:30:00Z",
    createdBy: "system",
    scope: ["admin", "superadmin"],
    rules: [],
    enforcementMode: "enforcing",
    priority: 100,
    roles: ["admin", "superadmin"],
    permissions: ["*"],
    resourceTypes: ["*"],
  },
  {
    id: "pol-rbac-002",
    name: "Developer Restricted",
    description: "Development team access with production restrictions",
    type: "rbac",
    status: "active",
    version: 5,
    createdAt: "2024-02-01T09:00:00Z",
    updatedAt: "2025-02-05T11:20:00Z",
    createdBy: "admin@acme.com",
    scope: ["developer"],
    rules: [],
    enforcementMode: "enforcing",
    priority: 80,
    roles: ["developer", "engineer"],
    permissions: ["read", "write"],
    resourceTypes: ["repository", "staging", "logs"],
  },
  {
    id: "pol-rbac-003",
    name: "Read Only Audit",
    description: "Audit team read-only access across all environments",
    type: "rbac",
    status: "active",
    version: 2,
    createdAt: "2024-03-10T08:00:00Z",
    updatedAt: "2025-01-15T16:45:00Z",
    createdBy: "security@acme.com",
    scope: ["auditor"],
    rules: [],
    enforcementMode: "enforcing",
    priority: 70,
    roles: ["auditor", "security_reviewer"],
    permissions: ["read"],
    resourceTypes: ["*"],
  },
  {
    id: "pol-rbac-004",
    name: "Support Limited",
    description: "Customer support access with user management constraints",
    type: "rbac",
    status: "draft",
    version: 1,
    createdAt: "2025-02-07T13:00:00Z",
    updatedAt: "2025-02-07T13:00:00Z",
    createdBy: "admin@acme.com",
    scope: ["support"],
    rules: [],
    enforcementMode: "permissive",
    priority: 60,
    roles: ["support_agent"],
    permissions: ["read", "write"],
    resourceTypes: ["user", "ticket", "logs"],
  },
];

const mockContextualRules: ContextualRule[] = [
  {
    id: "ctx-001",
    name: "After Hours Admin",
    description:
      "Require additional MFA for admin access outside business hours",
    conditions: {
      timeBased: {
        startTime: "18:00",
        endTime: "08:00",
        days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        timezone: "America/New_York",
      },
    },
    actions: {
      requireAdditionalAuth: true,
      stepUpMfa: true,
      notifyAdmin: true,
      blockAccess: false,
    },
    priority: 90,
    status: "active",
  },
  {
    id: "ctx-002",
    name: "Untrusted Location",
    description: "Block access from high-risk countries",
    conditions: {
      locationBased: {
        allowedCountries: ["US", "CA", "GB", "DE", "FR"],
        blockedCountries: ["CN", "RU", "KP", "IR"],
        requireVpn: false,
      },
    },
    actions: {
      requireAdditionalAuth: false,
      stepUpMfa: false,
      notifyAdmin: true,
      blockAccess: true,
    },
    priority: 100,
    status: "active",
  },
  {
    id: "ctx-003",
    name: "High Risk Score",
    description: "Challenge authentication for suspicious behavior",
    conditions: {
      riskBased: {
        maxRiskScore: 70,
        requiredFactors: 2,
      },
    },
    actions: {
      requireAdditionalAuth: true,
      stepUpMfa: true,
      notifyAdmin: false,
      blockAccess: false,
    },
    priority: 85,
    status: "active",
  },
  {
    id: "ctx-004",
    name: "Unregistered Device",
    description: "Require device verification for new devices",
    conditions: {
      deviceBased: {
        trustedOnly: true,
        maxDeviceAge: 30,
        requireEncryption: true,
      },
    },
    actions: {
      requireAdditionalAuth: true,
      stepUpMfa: false,
      notifyAdmin: true,
      blockAccess: false,
    },
    priority: 75,
    status: "inactive",
  },
];

const mockMfaRequirements: MfaRequirement[] = [
  {
    id: "mfa-001",
    context: "Admin Panel",
    requiredFactors: 2,
    allowedMethods: ["totp", "webauthn"],
    enforcement: "mandatory",
    exceptions: [],
    gracePeriod: 0,
  },
  {
    id: "mfa-002",
    context: "Production Access",
    requiredFactors: 2,
    allowedMethods: ["totp", "webauthn", "push"],
    enforcement: "mandatory",
    exceptions: ["break_glass_accounts"],
    gracePeriod: 0,
  },
  {
    id: "mfa-003",
    context: "Standard User",
    requiredFactors: 1,
    allowedMethods: ["totp", "sms", "email"],
    enforcement: "conditional",
    exceptions: ["service_accounts"],
    gracePeriod: 7,
  },
  {
    id: "mfa-004",
    context: "API Access",
    requiredFactors: 1,
    allowedMethods: ["client_certificate"],
    enforcement: "mandatory",
    exceptions: [],
    gracePeriod: 0,
  },
];

const mockSessionPolicies: SessionPolicy[] = [
  {
    id: "sess-001",
    context: "Browser",
    maxConcurrentSessions: 5,
    idleTimeout: 1800,
    absoluteTimeout: 28800,
    rememberMeDuration: 604800,
    securityControls: {
      invalidateOnIpChange: true,
      invalidateOnUserAgentChange: false,
      requireReauthForSensitiveOps: true,
    },
  },
  {
    id: "sess-002",
    context: "CLI",
    maxConcurrentSessions: 10,
    idleTimeout: 3600,
    absoluteTimeout: 86400,
    rememberMeDuration: 0,
    securityControls: {
      invalidateOnIpChange: false,
      invalidateOnUserAgentChange: false,
      requireReauthForSensitiveOps: false,
    },
  },
  {
    id: "sess-003",
    context: "Mobile App",
    maxConcurrentSessions: 3,
    idleTimeout: 900,
    absoluteTimeout: 14400,
    rememberMeDuration: 2592000,
    securityControls: {
      invalidateOnIpChange: true,
      invalidateOnUserAgentChange: true,
      requireReauthForSensitiveOps: true,
    },
  },
  {
    id: "sess-004",
    context: "Admin Console",
    maxConcurrentSessions: 2,
    idleTimeout: 900,
    absoluteTimeout: 7200,
    rememberMeDuration: 0,
    securityControls: {
      invalidateOnIpChange: true,
      invalidateOnUserAgentChange: true,
      requireReauthForSensitiveOps: true,
    },
  },
];

const mockTrustConfig: TrustConfig = {
  deviceTrust: {
    trustedDeviceTtl: 2592000,
    requireDeviceVerification: true,
    autoTrustCorporateDevices: true,
  },
  networkTrust: {
    trustedNetworks: [
      {
        id: "net-001",
        name: "Corporate HQ",
        cidr: "10.0.0.0/8",
        description: "Main office network",
        type: "corporate",
      },
      {
        id: "net-002",
        name: "VPN Range",
        cidr: "172.16.0.0/12",
        description: "Corporate VPN addresses",
        type: "vpn",
      },
    ],
    untrustedNetworks: [
      {
        id: "net-003",
        name: "Public WiFi Block",
        cidr: "192.168.0.0/16",
        description: "Generic public networks",
        type: "custom",
      },
    ],
    vpnRequiredForAdmin: true,
  },
  trustLevels: [
    {
      level: 0,
      name: "Untrusted",
      description: "Unknown or high-risk devices",
      requirements: [],
    },
    {
      level: 1,
      name: "Low",
      description: "Known device, basic verification",
      requirements: ["device_registered"],
    },
    {
      level: 2,
      name: "Medium",
      description: "Verified device, standard security",
      requirements: ["device_registered", "mfa_enabled"],
    },
    {
      level: 3,
      name: "High",
      description: "Corporate device, enhanced security",
      requirements: ["device_registered", "mfa_enabled", "encryption_enabled"],
    },
    {
      level: 4,
      name: "Absolute",
      description: "Hardware-backed, biometric verified",
      requirements: ["hardware_key", "biometric_verified"],
    },
  ],
};

const mockAuditEntries: PolicyAuditEntry[] = [
  {
    id: "aud-001",
    timestamp: "2025-02-08T14:32:15Z",
    actor: { id: "usr-001", name: "John Smith", email: "john.smith@acme.com" },
    action: "updated",
    policyId: "pol-rbac-002",
    policyName: "Developer Restricted",
    changes: [
      { field: "permissions", oldValue: "[read]", newValue: "[read, write]" },
    ],
    ipAddress: "10.0.1.100",
    sessionId: "sess-abc-123",
  },
  {
    id: "aud-002",
    timestamp: "2025-02-08T13:15:00Z",
    actor: { id: "usr-002", name: "Sarah Chen", email: "sarah.chen@acme.com" },
    action: "created",
    policyId: "ctx-004",
    policyName: "Unregistered Device",
    changes: [],
    ipAddress: "10.0.1.105",
    sessionId: "sess-def-456",
  },
  {
    id: "aud-003",
    timestamp: "2025-02-08T11:45:30Z",
    actor: { id: "usr-003", name: "Admin Bot", email: "admin@acme.com" },
    action: "activated",
    policyId: "pol-rbac-003",
    policyName: "Read Only Audit",
    changes: [{ field: "status", oldValue: "draft", newValue: "active" }],
    ipAddress: "10.0.1.1",
    sessionId: "sess-system-001",
  },
  {
    id: "aud-004",
    timestamp: "2025-02-08T09:20:00Z",
    actor: { id: "usr-001", name: "John Smith", email: "john.smith@acme.com" },
    action: "cloned",
    policyId: "pol-rbac-004",
    policyName: "Support Limited",
    changes: [{ field: "source", oldValue: "", newValue: "pol-rbac-002" }],
    ipAddress: "10.0.1.100",
    sessionId: "sess-abc-124",
  },
  {
    id: "aud-005",
    timestamp: "2025-02-07T16:00:00Z",
    actor: { id: "usr-004", name: "Security Team", email: "security@acme.com" },
    action: "updated",
    policyId: "ctx-002",
    policyName: "Untrusted Location",
    changes: [
      {
        field: "blockedCountries",
        oldValue: "[CN, RU]",
        newValue: "[CN, RU, KP, IR]",
      },
    ],
    ipAddress: "10.0.2.50",
    sessionId: "sess-ghi-789",
  },
];

const mockTemplates: PolicyTemplate[] = [
  {
    id: "tpl-001",
    name: "SOC 2 Type II",
    description: "Comprehensive policies for SOC 2 Type II compliance",
    category: "Compliance",
    policyCount: 12,
    complianceFrameworks: ["SOC 2", "ISO 27001"],
  },
  {
    id: "tpl-002",
    name: "HIPAA Security",
    description: "Healthcare data protection and access controls",
    category: "Compliance",
    policyCount: 18,
    complianceFrameworks: ["HIPAA", "HITECH"],
  },
  {
    id: "tpl-003",
    name: "Zero Trust Architecture",
    description: "Never trust, always verify security model",
    category: "Security",
    policyCount: 24,
    complianceFrameworks: ["NIST", "CIS"],
  },
  {
    id: "tpl-004",
    name: "PCI DSS",
    description: "Payment card industry data security standards",
    category: "Compliance",
    policyCount: 15,
    complianceFrameworks: ["PCI DSS 4.0"],
  },
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function PolicyStatusBadge({ status }: { status: PolicyStatus }) {
  const configs = {
    active: {
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      label: "Active",
    },
    draft: {
      icon: AlertCircle,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      label: "Draft",
    },
    archived: {
      icon: XCircle,
      color: "text-slate-500",
      bgColor: "bg-slate-500/10",
      label: "Archived",
    },
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        config.bgColor,
        config.color,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

function EnforcementBadge({ mode }: { mode: EnforcementMode }) {
  const configs = {
    enforcing: {
      color: "bg-emerald-500/10 text-emerald-600",
      label: "Enforcing",
    },
    permissive: {
      color: "bg-amber-500/10 text-amber-600",
      label: "Permissive",
    },
    report_only: {
      color: "bg-blue-500/10 text-blue-600",
      label: "Report Only",
    },
  };

  const config = configs[mode];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase",
        config.color,
      )}
    >
      {config.label}
    </span>
  );
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toISOString().split("T")[0];
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

function PolicyOverviewMetrics({ stats }: { stats: PolicyStats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Active Policies
              </p>
              <p className="text-2xl font-semibold mt-1">
                {stats.activePolicies}
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <FileLock className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Pending Changes
              </p>
              <p className="text-2xl font-semibold mt-1">
                {stats.pendingChanges}
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
          </div>
          {stats.pendingChanges > 0 && (
            <p className="text-xs text-amber-600 mt-2">Awaiting review</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Violations (24h)
              </p>
              <p
                className={cn(
                  "text-2xl font-semibold mt-1",
                  stats.violations24h > 0 ? "text-red-500" : "",
                )}
              >
                {stats.violations24h}
              </p>
            </div>
            <div
              className={cn(
                "h-10 w-10 rounded-lg flex items-center justify-center",
                stats.violations24h > 0 ? "bg-red-500/10" : "bg-emerald-500/10",
              )}
            >
              <AlertTriangle
                className={cn(
                  "h-5 w-5",
                  stats.violations24h > 0 ? "text-red-500" : "text-emerald-500",
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Compliance Score
              </p>
              <p className="text-2xl font-semibold mt-1">
                {stats.complianceScore}%
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <div className="mt-2">
            <Progress value={stats.complianceScore} className="h-1.5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RbacPoliciesPanel({ policies }: { policies: RbacPolicy[] }) {
  const [selectedPolicy, setSelectedPolicy] = React.useState<RbacPolicy | null>(
    null,
  );

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">RBAC Policies</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            {policies.length} policies
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {policies.map((policy) => (
            <div
              key={policy.id}
              className={cn(
                "p-4 cursor-pointer transition-colors hover:bg-muted/50",
                selectedPolicy?.id === policy.id && "bg-muted",
              )}
              onClick={() => setSelectedPolicy(policy)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm truncate">
                      {policy.name}
                    </span>
                    <PolicyStatusBadge status={policy.status} />
                    <EnforcementBadge mode={policy.enforcementMode} />
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {policy.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                    <span>v{policy.version}</span>
                    <span>Updated {formatDate(policy.updatedAt)}</span>
                    <span>Priority: {policy.priority}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" className="h-7 w-7">
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7">
                    <Edit3 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ContextualRulesPanel({ rules }: { rules: ContextualRule[] }) {
  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">
              Contextual Rules
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {rules.filter((r) => r.status === "active").length} active
            </Badge>
            <Button size="sm" variant="outline" className="h-7 text-xs">
              <Play className="h-3 w-3 mr-1" />
              Test
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="w-full">
          {rules.map((rule) => (
            <AccordionItem
              key={rule.id}
              value={rule.id}
              className="border-b border-border"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30">
                <div className="flex items-center gap-3 text-left">
                  {rule.status === "active" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-slate-400 shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{rule.name}</span>
                      <span className="text-[10px] text-muted-foreground">
                        P{rule.priority}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {rule.description}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-3 pl-7">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Conditions
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {rule.conditions.timeBased && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Time-based
                        </Badge>
                      )}
                      {rule.conditions.locationBased && (
                        <Badge variant="outline" className="text-xs">
                          <Globe className="h-3 w-3 mr-1" />
                          Location
                        </Badge>
                      )}
                      {rule.conditions.deviceBased && (
                        <Badge variant="outline" className="text-xs">
                          <Monitor className="h-3 w-3 mr-1" />
                          Device
                        </Badge>
                      )}
                      {rule.conditions.riskBased && (
                        <Badge variant="outline" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Risk Score
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Actions
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {rule.actions.requireAdditionalAuth && (
                        <Badge className="text-xs bg-amber-500/10 text-amber-600">
                          +Auth Required
                        </Badge>
                      )}
                      {rule.actions.stepUpMfa && (
                        <Badge className="text-xs bg-purple-500/10 text-purple-600">
                          Step-up MFA
                        </Badge>
                      )}
                      {rule.actions.notifyAdmin && (
                        <Badge className="text-xs bg-blue-500/10 text-blue-600">
                          Notify Admin
                        </Badge>
                      )}
                      {rule.actions.blockAccess && (
                        <Badge className="text-xs bg-red-500/10 text-red-600">
                          Block Access
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

function MfaRequirementsPanel({
  requirements,
}: {
  requirements: MfaRequirement[];
}) {
  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">
              MFA Requirements
            </CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            {requirements.length} contexts
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {requirements.map((req) => (
            <div key={req.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{req.context}</span>
                    {req.enforcement === "mandatory" ? (
                      <Badge className="text-xs bg-emerald-500/10 text-emerald-600">
                        <Lock className="h-3 w-3 mr-1" />
                        Mandatory
                      </Badge>
                    ) : (
                      <Badge className="text-xs bg-blue-500/10 text-blue-600">
                        <Unlock className="h-3 w-3 mr-1" />
                        Conditional
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {req.requiredFactors} factor
                      {req.requiredFactors > 1 ? "s" : ""}
                    </span>
                    <span>{req.allowedMethods.length} methods allowed</span>
                    {req.gracePeriod > 0 && (
                      <span className="text-amber-600">
                        {req.gracePeriod}d grace period
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SessionPoliciesPanel({ policies }: { policies: SessionPolicy[] }) {
  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">
              Session Policies
            </CardTitle>
          </div>
          <span className="text-xs text-muted-foreground">
            {policies.length} contexts
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {policies.map((policy) => (
            <div
              key={policy.id}
              className="p-3 rounded-lg border border-border/50 bg-muted/30 space-y-2"
            >
              <div className="flex items-center gap-2">
                {policy.context === "Browser" && (
                  <Globe className="h-4 w-4 text-muted-foreground" />
                )}
                {policy.context === "CLI" && (
                  <Settings className="h-4 w-4 text-muted-foreground" />
                )}
                {policy.context === "Mobile App" && (
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                )}
                {policy.context === "Admin Console" && (
                  <Shield className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="font-medium text-sm">{policy.context}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Idle</p>
                  <p className="font-medium">
                    {formatDuration(policy.idleTimeout)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Absolute</p>
                  <p className="font-medium">
                    {formatDuration(policy.absoluteTimeout)}
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Max {policy.maxConcurrentSessions} concurrent
              </p>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Security Controls
          </p>
          <div className="space-y-1">
            {policies[0]?.securityControls.invalidateOnIpChange && (
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Invalidate on IP change</span>
              </div>
            )}
            {policies[0]?.securityControls.requireReauthForSensitiveOps && (
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Re-auth for sensitive operations</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TrustConfigurationPanel({ config }: { config: TrustConfig }) {
  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">
              Trust Configuration
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        {/* Trust Levels */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Trust Levels
          </p>
          <div className="space-y-2">
            {config.trustLevels.map((level) => (
              <div
                key={level.level}
                className="flex items-center justify-between py-2 px-3 rounded bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      level.level === 0 && "bg-red-500",
                      level.level === 1 && "bg-orange-500",
                      level.level === 2 && "bg-yellow-500",
                      level.level === 3 && "bg-blue-500",
                      level.level === 4 && "bg-emerald-500",
                    )}
                  />
                  <div>
                    <p className="text-xs font-medium">{level.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {level.description}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  L{level.level}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Network Trust */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Network Trust
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs">Trusted Networks</span>
              <Badge variant="secondary" className="text-[10px]">
                {config.networkTrust.trustedNetworks.length}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">VPN Required for Admin</span>
              <Badge
                className={cn(
                  "text-[10px]",
                  config.networkTrust.vpnRequiredForAdmin
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-slate-500/10 text-slate-600",
                )}
              >
                {config.networkTrust.vpnRequiredForAdmin ? "Yes" : "No"}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Device Trust */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Device Trust
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Trusted Device TTL</span>
              <span className="font-medium">
                {formatDuration(config.deviceTrust.trustedDeviceTtl)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Auto-trust Corporate
              </span>
              <span className="font-medium">
                {config.deviceTrust.autoTrustCorporateDevices ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PolicyTemplatesPanel({ templates }: { templates: PolicyTemplate[] }) {
  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">
              Policy Templates
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {templates.map((template) => (
            <div key={template.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{template.name}</span>
                    <Badge variant="outline" className="text-[10px]">
                      {template.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {template.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="text-[10px] bg-blue-500/10 text-blue-600">
                      {template.policyCount} policies
                    </Badge>
                    {template.complianceFrameworks.map((framework) => (
                      <span
                        key={framework}
                        className="text-[10px] text-muted-foreground"
                      >
                        {framework}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="ghost" className="h-7 text-xs">
                    Preview
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PolicyAuditPanel({ entries }: { entries: PolicyAuditEntry[] }) {
  const getActionIcon = (action: PolicyAuditEntry["action"]) => {
    switch (action) {
      case "created":
        return <Plus className="h-3.5 w-3.5 text-emerald-500" />;
      case "updated":
        return <Edit3 className="h-3.5 w-3.5 text-blue-500" />;
      case "deleted":
        return <Trash2 className="h-3.5 w-3.5 text-red-500" />;
      case "activated":
        return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />;
      case "deactivated":
        return <XCircle className="h-3.5 w-3.5 text-amber-500" />;
      case "cloned":
        return <Copy className="h-3.5 w-3.5 text-purple-500" />;
    }
  };

  const getActionColor = (action: PolicyAuditEntry["action"]) => {
    switch (action) {
      case "created":
      case "activated":
        return "text-emerald-600";
      case "updated":
        return "text-blue-600";
      case "deleted":
        return "text-red-600";
      case "deactivated":
        return "text-amber-600";
      case "cloned":
        return "text-purple-600";
    }
  };

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">
              Policy Audit Trail
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-7 text-xs">
              <Filter className="h-3 w-3 mr-1" />
              Filter
            </Button>
            <Button size="sm" variant="ghost" className="h-7 text-xs">
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border max-h-[300px] overflow-y-auto">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getActionIcon(entry.action)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-xs font-medium capitalize",
                        getActionColor(entry.action),
                      )}
                    >
                      {entry.action}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {entry.policyName}
                    </span>
                  </div>
                  <p className="text-xs mt-1">
                    by <span className="font-medium">{entry.actor.name}</span>
                  </p>
                  {entry.changes.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {entry.changes.map((change, idx) => (
                        <div
                          key={idx}
                          className="text-[10px] text-muted-foreground bg-muted/50 rounded px-2 py-1"
                        >
                          <span className="font-medium">{change.field}:</span>{" "}
                          <span className="line-through">
                            {change.oldValue}
                          </span>{" "}
                          <ChevronRight className="h-3 w-3 inline mx-1" />
                          <span className="text-emerald-600">
                            {change.newValue}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                    <span>
                      {formatDate(entry.timestamp)}{" "}
                      {formatTime(entry.timestamp)}
                    </span>
                    <span>{entry.ipAddress}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function PolicyPlatformPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-card-foreground">
            Policy Platform
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Centralized policy management for RBAC, contextual rules, MFA
            requirements, session controls, and trust configurations. Changes
            apply immediately across all environments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-9 text-xs">
            <Upload className="h-4 w-4 mr-1" />
            Import
          </Button>
          <Button size="sm" variant="outline" className="h-9 text-xs">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button size="sm" variant="default" className="h-9 text-xs">
            <Plus className="h-4 w-4 mr-1" />
            Create Policy
          </Button>
        </div>
      </div>

      {/* Security Warning Banner */}
      <div className="p-4 rounded-lg border border-amber-200 bg-amber-50">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-900">
              Critical Policy Configuration
            </p>
            <p className="text-sm text-amber-700 mt-1">
              Policy changes affect authentication and authorization flows
              immediately. Test in staging before applying to production. All
              modifications are logged and audited.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Overview */}
      <PolicyOverviewMetrics stats={mockStats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - RBAC, MFA, Templates */}
        <div className="lg:col-span-1 space-y-6">
          <RbacPoliciesPanel policies={mockRbacPolicies} />
          <MfaRequirementsPanel requirements={mockMfaRequirements} />
          <PolicyTemplatesPanel templates={mockTemplates} />
        </div>

        {/* Middle & Right Columns - Context Rules, Sessions, Trust, Audit */}
        <div className="lg:col-span-2 space-y-6">
          <ContextualRulesPanel rules={mockContextualRules} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SessionPoliciesPanel policies={mockSessionPolicies} />
            <TrustConfigurationPanel config={mockTrustConfig} />
          </div>

          <PolicyAuditPanel entries={mockAuditEntries} />

          {/* API Integration Reference */}
          <Card className="border-border bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                API Integration Reference
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p className="text-xs">
                This interface interacts with the Identity Platform Policy API.
                All operations require appropriate RBAC scopes and are subject
                to audit logging.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <p className="font-medium text-foreground">
                    Required Scopes:
                  </p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>
                      <code className="bg-muted px-1 rounded">
                        admin:policy:read
                      </code>{" "}
                      - View policies
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">
                        admin:policy:write
                      </code>{" "}
                      - Modify policies
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">
                        admin:rbac:manage
                      </code>{" "}
                      - RBAC management
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">
                        superadmin:policy
                      </code>{" "}
                      - Delete/critical ops
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-foreground">Key Endpoints:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>
                      <code className="bg-muted px-1 rounded">
                        GET /policy/list
                      </code>{" "}
                      - List policies
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">
                        POST /policy/create
                      </code>{" "}
                      - Create policy
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">
                        GET /context/rules
                      </code>{" "}
                      - Context rules
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">
                        GET /audit/policy
                      </code>{" "}
                      - Audit logs
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
