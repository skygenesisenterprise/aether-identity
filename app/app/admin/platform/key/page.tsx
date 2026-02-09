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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dashboard/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/dashboard/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/dashboard/ui/select";
import { Input } from "@/components/dashboard/ui/input";
import {
  Key,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  RefreshCw,
  Clock,
  AlertTriangle,
  Eye,
  Trash2,
  Activity,
  Globe,
  Server,
  Smartphone,
  KeyRound,
  FileKey,
  Fingerprint,
  ExternalLink,
  History,
  CheckCircle2,
  XCircle,
  Info,
  Search,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// API MAPPING DOCUMENTATION
// ============================================================================
//
// SECTION 1: KEY OVERVIEW
//   GET /api/v1/keys/stats           - Key statistics (total, active, expired, alerts)
//   Method: GET
//   Scopes: admin:keys:read
//
// SECTION 2: KEY REGISTRY
//   GET /api/v1/keys                  - List all keys with filtering
//   Method: GET
//   Scopes: admin:keys:read
//   Query params: type, status, usage, scope, kid
//
//   GET /api/v1/keys/{kid}           - Get key details (metadata only)
//   Method: GET
//   Scopes: admin:keys:read
//
// SECTION 3: ROTATION & LIFECYCLE
//   POST /api/v1/keys/{kid}/rotate   - Trigger key rotation
//   Method: POST
//   Scopes: admin:keys:write
//   Body: { reason: string, immediate: boolean }
//
//   POST /api/v1/keys/{kid}/activate - Activate a disabled key
//   Method: POST
//   Scopes: admin:keys:write
//
//   POST /api/v1/keys/{kid}/deactivate - Deactivate a key
//   Method: POST
//   Scopes: admin:keys:write
//
//   POST /api/v1/keys/{kid}/revoke  - Revoke a key
//   Method: POST
//   Scopes: admin:keys:write
//   Body: { reason: string }
//
//   GET /api/v1/keys/rotation/candidates - Get keys needing rotation
//   Method: GET
//   Scopes: admin:keys:read
//
// SECTION 4: TRUST & DISTRIBUTION
//   GET /api/v1/keys/jwks            - Public JWKS endpoint (read-only view)
//   Method: GET
//   Scopes: admin:keys:read
//
//   GET /api/v1/keys/{kid}/public    - Get public key material (for verification)
//   Method: GET
//   Scopes: admin:keys:read
//
//   GET /api/v1/trust/anchors        - List trust anchors
//   Method: GET
//   Scopes: admin:trust:read
//
// SECTION 5: AUDIT & COMPLIANCE
//   GET /api/v1/keys/{kid}/usage     - Key usage history
//   Method: GET
//   Scopes: admin:audit:read
//
//   GET /api/v1/keys/{kid}/rotation/history - Rotation history
//   Method: GET
//   Scopes: admin:audit:read
//
//   GET /api/v1/keys/events          - Key lifecycle events
//   Method: GET
//   Scopes: admin:audit:read
//
// NOTE: All POST/PUT/DELETE operations are API-driven by Identity Service.
//       This UI only displays metadata and triggers audited actions.
// ============================================================================

type KeyType =
  | "jwt-signing"
  | "jwt-encryption"
  | "rsa-keypair"
  | "ec-keypair"
  | "certificate"
  | "jwks"
  | "trust-anchor"
  | "mtls"
  | "interservice";

type KeyUsage = "sign" | "verify" | "encrypt" | "decrypt" | "wrap" | "unwrap";

type KeyStatus =
  | "active"
  | "disabled"
  | "expired"
  | "revoked"
  | "pending"
  | "rotating";

type KeyScope = "token" | "mtls" | "device" | "inter-org" | "internal";

interface Key {
  kid: string;
  type: KeyType;
  algorithm: string;
  usage: KeyUsage[];
  status: KeyStatus;
  scope: KeyScope;
  createdAt: string;
  activatedAt: string;
  expiresAt?: string;
  rotatedAt?: string;
  lastUsedAt?: string;
  rotationCount: number;
  nextRotationAt?: string;
  policyId?: string;
  description?: string;
  issuer?: string;
  subject?: string;
  fingerprint?: string;
  publicExponent?: string;
  keySize?: number;
  curve?: string;
}

interface KeyStats {
  totalKeys: number;
  activeKeys: number;
  disabledKeys: number;
  expiredKeys: number;
  revokedKeys: number;
  keysNeedingRotation: number;
  upcomingExpirations: number;
  securityAlerts: number;
}

interface RotationPolicy {
  id: string;
  name: string;
  type: KeyType[];
  intervalDays: number;
  gracePeriodDays: number;
  autoRotate: boolean;
  notifyBeforeDays: number;
}

interface TrustAnchor {
  id: string;
  type: "ca" | "root" | "intermediate";
  subject: string;
  issuer: string;
  fingerprint: string;
  validFrom: string;
  validTo: string;
  status: "active" | "expired" | "revoked";
}

interface KeyUsageEvent {
  id: string;
  kid: string;
  action: "sign" | "verify" | "encrypt" | "decrypt";
  timestamp: string;
  actor: string;
  service: string;
  result: "success" | "failure";
}

interface RotationEvent {
  id: string;
  kid: string;
  type: "scheduled" | "manual" | "emergency";
  oldKid?: string;
  newKid?: string;
  actor: string;
  timestamp: string;
  reason: string;
}

const mockStats: KeyStats = {
  totalKeys: 47,
  activeKeys: 38,
  disabledKeys: 4,
  expiredKeys: 3,
  revokedKeys: 2,
  keysNeedingRotation: 5,
  upcomingExpirations: 2,
  securityAlerts: 1,
};

const mockKeys: Key[] = [
  {
    kid: "key-jwt-primary-2024",
    type: "jwt-signing",
    algorithm: "RS256",
    usage: ["sign", "verify"],
    status: "active",
    scope: "token",
    createdAt: "2024-01-15T00:00:00Z",
    activatedAt: "2024-01-15T00:00:00Z",
    expiresAt: "2025-01-15T00:00:00Z",
    rotatedAt: "2024-07-15T00:00:00Z",
    lastUsedAt: "2025-02-08T14:45:00Z",
    rotationCount: 1,
    nextRotationAt: "2025-01-15T00:00:00Z",
    policyId: "pol-jwt-rotation",
    description: "Primary JWT signing key for access tokens",
    keySize: 4096,
  },
  {
    kid: "key-jwt-secondary-2024",
    type: "jwt-signing",
    algorithm: "RS256",
    usage: ["verify"],
    status: "active",
    scope: "token",
    createdAt: "2024-01-15T00:00:00Z",
    activatedAt: "2024-01-15T00:00:00Z",
    expiresAt: "2025-01-15T00:00:00Z",
    lastUsedAt: "2025-02-08T14:30:00Z",
    rotationCount: 0,
    policyId: "pol-jwt-rotation",
    description: "Secondary JWT signing key for verification during rotation",
    keySize: 4096,
  },
  {
    kid: "key-enc-primary-aes",
    type: "jwt-encryption",
    algorithm: "RSA-OAEP",
    usage: ["encrypt", "wrap"],
    status: "active",
    scope: "token",
    createdAt: "2024-03-01T00:00:00Z",
    activatedAt: "2024-03-01T00:00:00Z",
    expiresAt: "2026-03-01T00:00:00Z",
    lastUsedAt: "2025-02-08T12:00:00Z",
    rotationCount: 0,
    description: "Primary encryption key for JWT encryption",
    keySize: 4096,
  },
  {
    kid: "key-mtls-service-a",
    type: "mtls",
    algorithm: "ECDSA",
    usage: ["sign", "verify"],
    status: "active",
    scope: "internal",
    createdAt: "2024-06-01T00:00:00Z",
    activatedAt: "2024-06-01T00:00:00Z",
    expiresAt: "2025-06-01T00:00:00Z",
    lastUsedAt: "2025-02-08T14:50:00Z",
    rotationCount: 2,
    description: "mTLS certificate for Service A",
    curve: "P-256",
  },
  {
    kid: "key-interservice-b2b",
    type: "interservice",
    algorithm: "EdDSA",
    usage: ["sign", "verify"],
    status: "rotating",
    scope: "inter-org",
    createdAt: "2024-02-01T00:00:00Z",
    activatedAt: "2024-02-01T00:00:00Z",
    expiresAt: "2025-02-15T00:00:00Z",
    rotatedAt: "2025-02-08T10:00:00Z",
    rotationCount: 3,
    description: "Inter-service key for B2B partner integration",
    curve: "Ed25519",
  },
  {
    kid: "key-device-enrollment",
    type: "ec-keypair",
    algorithm: "ES256",
    usage: ["sign", "verify"],
    status: "disabled",
    scope: "device",
    createdAt: "2023-12-01T00:00:00Z",
    activatedAt: "2023-12-01T00:00:00Z",
    expiresAt: "2024-12-01T00:00:00Z",
    lastUsedAt: "2024-11-15T08:00:00Z",
    rotationCount: 1,
    description: "Device enrollment attestation key",
    curve: "P-256",
  },
  {
    kid: "key-cert-wildcard",
    type: "certificate",
    algorithm: "RSA",
    usage: ["verify", "encrypt"],
    status: "expired",
    scope: "internal",
    createdAt: "2023-01-01T00:00:00Z",
    activatedAt: "2023-01-01T00:00:00Z",
    expiresAt: "2024-01-01T00:00:00Z",
    lastUsedAt: "2024-01-01T00:00:00Z",
    rotationCount: 0,
    description: "Wildcard certificate for internal services",
    issuer: "Internal CA",
    subject: "*.internal.acme.com",
  },
];

const mockRotationPolicies: RotationPolicy[] = [
  {
    id: "pol-jwt-rotation",
    name: "JWT Signing Key Rotation",
    type: ["jwt-signing"],
    intervalDays: 180,
    gracePeriodDays: 14,
    autoRotate: true,
    notifyBeforeDays: 30,
  },
  {
    id: "pol-mtls-rotation",
    name: "mTLS Certificate Rotation",
    type: ["mtls"],
    intervalDays: 365,
    gracePeriodDays: 30,
    autoRotate: false,
    notifyBeforeDays: 60,
  },
  {
    id: "pol-interservice-rotation",
    name: "Interservice Key Rotation",
    type: ["interservice"],
    intervalDays: 90,
    gracePeriodDays: 7,
    autoRotate: true,
    notifyBeforeDays: 14,
  },
  {
    id: "pol-encryption-rotation",
    name: "Encryption Key Rotation",
    type: ["jwt-encryption"],
    intervalDays: 730,
    gracePeriodDays: 30,
    autoRotate: false,
    notifyBeforeDays: 90,
  },
];

const mockTrustAnchors: TrustAnchor[] = [
  {
    id: "ta-internal-ca",
    type: "root",
    subject: "CN=Internal CA, O=Acme Corporation, C=US",
    issuer: "CN=Internal CA, O=Acme Corporation, C=US",
    fingerprint: "SHA256:A1:B2:C3:D4:E5:F6:...",
    validFrom: "2020-01-01T00:00:00Z",
    validTo: "2040-01-01T00:00:00Z",
    status: "active",
  },
  {
    id: "ta-partner-root",
    type: "intermediate",
    subject: "CN=Partner Root CA, O=Partner Corp, C=US",
    issuer: "CN=Global Trust Root, O=Global Trust, C=US",
    fingerprint: "SHA256:F1:E2:D3:C4:B5:A6:...",
    validFrom: "2022-01-01T00:00:00Z",
    validTo: "2027-01-01T00:00:00Z",
    status: "active",
  },
];

const mockUsageEvents: KeyUsageEvent[] = [
  {
    id: "evt-001",
    kid: "key-jwt-primary-2024",
    action: "sign",
    timestamp: "2025-02-08T14:45:00Z",
    actor: "identity-service",
    service: "oauth2-token-endpoint",
    result: "success",
  },
  {
    id: "evt-002",
    kid: "key-mtls-service-a",
    action: "verify",
    timestamp: "2025-02-08T14:50:00Z",
    actor: "api-gateway",
    service: "mtls-handshake",
    result: "success",
  },
  {
    id: "evt-003",
    kid: "key-enc-primary-aes",
    action: "encrypt",
    timestamp: "2025-02-08T12:00:00Z",
    actor: "token-service",
    service: "jwt-encryption",
    result: "success",
  },
];

const mockRotationEvents: RotationEvent[] = [
  {
    id: "rot-001",
    kid: "key-jwt-primary-2024",
    type: "scheduled",
    oldKid: "key-jwt-primary-2023",
    newKid: "key-jwt-primary-2024",
    actor: "system",
    timestamp: "2024-01-15T00:00:00Z",
    reason: "Scheduled rotation per policy",
  },
  {
    id: "rot-002",
    kid: "key-interservice-b2b",
    type: "manual",
    newKid: "key-interservice-b2b-new",
    actor: "security@acme.com",
    timestamp: "2025-02-08T10:00:00Z",
    reason: "Proactive rotation due to security update",
  },
];

function KeyTypeBadge({ type }: { type: KeyType }) {
  const configs: Record<
    KeyType,
    { icon: React.ElementType; color: string; label: string }
  > = {
    "jwt-signing": {
      icon: KeyRound,
      color: "bg-blue-500/10 text-blue-600",
      label: "JWT Signing",
    },
    "jwt-encryption": {
      icon: Lock,
      color: "bg-emerald-500/10 text-emerald-600",
      label: "JWT Encryption",
    },
    "rsa-keypair": {
      icon: FileKey,
      color: "bg-purple-500/10 text-purple-600",
      label: "RSA Keypair",
    },
    "ec-keypair": {
      icon: FileKey,
      color: "bg-violet-500/10 text-violet-600",
      label: "EC Keypair",
    },
    certificate: {
      icon: Shield,
      color: "bg-amber-500/10 text-amber-600",
      label: "Certificate",
    },
    jwks: { icon: Globe, color: "bg-cyan-500/10 text-cyan-600", label: "JWKS" },
    "trust-anchor": {
      icon: Fingerprint,
      color: "bg-red-500/10 text-red-600",
      label: "Trust Anchor",
    },
    mtls: {
      icon: Server,
      color: "bg-indigo-500/10 text-indigo-600",
      label: "mTLS",
    },
    interservice: {
      icon: Smartphone,
      color: "bg-teal-500/10 text-teal-600",
      label: "Inter-service",
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium",
        config.color,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

function KeyStatusBadge({ status }: { status: KeyStatus }) {
  const configs: Record<
    KeyStatus,
    { icon: React.ElementType; color: string; label: string }
  > = {
    active: {
      icon: CheckCircle2,
      color: "bg-emerald-500/10 text-emerald-600",
      label: "Active",
    },
    disabled: {
      icon: XCircle,
      color: "bg-slate-500/10 text-slate-600",
      label: "Disabled",
    },
    expired: {
      icon: Clock,
      color: "bg-red-500/10 text-red-600",
      label: "Expired",
    },
    revoked: {
      icon: Trash2,
      color: "bg-orange-500/10 text-orange-600",
      label: "Revoked",
    },
    pending: {
      icon: Clock,
      color: "bg-amber-500/10 text-amber-600",
      label: "Pending",
    },
    rotating: {
      icon: RefreshCw,
      color: "bg-blue-500/10 text-blue-600",
      label: "Rotating",
    },
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium",
        config.color,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

function KeyUsageBadge({ usage }: { usage: KeyUsage[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {usage.map((u) => (
        <Badge key={u} variant="outline" className="text-[10px] capitalize">
          {u}
        </Badge>
      ))}
    </div>
  );
}

function ScopeBadge({ scope }: { scope: KeyScope }) {
  const configs: Record<KeyScope, { icon: React.ElementType; label: string }> =
    {
      token: { icon: KeyRound, label: "Token" },
      mtls: { icon: Shield, label: "mTLS" },
      device: { icon: Smartphone, label: "Device" },
      "inter-org": { icon: Globe, label: "Inter-org" },
      internal: { icon: Server, label: "Internal" },
    };

  const config = configs[scope];
  const Icon = config.icon;

  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatTimeAgo(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

function isExpired(expiresAt?: string): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
}

function daysUntilExpiration(expiresAt?: string): number | null {
  if (!expiresAt) return null;
  const diff = new Date(expiresAt).getTime() - new Date().getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function KeyOverviewMetrics({ stats }: { stats: KeyStats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Total Keys
              </p>
              <p className="text-2xl font-semibold mt-1">{stats.totalKeys}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Key className="h-5 w-5 text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Active
              </p>
              <p className="text-2xl font-semibold mt-1 text-emerald-600">
                {stats.activeKeys}
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
          <div className="mt-2">
            <Progress
              value={(stats.activeKeys / stats.totalKeys) * 100}
              className="h-1.5"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Needing Rotation
              </p>
              <p className="text-2xl font-semibold mt-1 text-amber-600">
                {stats.keysNeedingRotation}
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <RefreshCw className="h-5 w-5 text-amber-500" />
            </div>
          </div>
          {stats.keysNeedingRotation > 0 && (
            <p className="text-xs text-amber-600 mt-2">Review required</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Security Alerts
              </p>
              <p className="text-2xl font-semibold mt-1 text-red-600">
                {stats.securityAlerts}
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <ShieldAlert className="h-5 w-5 text-red-500" />
            </div>
          </div>
          {stats.securityAlerts > 0 && (
            <p className="text-xs text-red-600 mt-2">
              Immediate action required
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function KeyDistributionPanel({ keys }: { keys: Key[] }) {
  const typeCounts = keys.reduce(
    (acc, key) => {
      acc[key.type] = (acc[key.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const total = keys.length;

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">
              Key Distribution by Type
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-3">
          {Object.entries(typeCounts).map(([type, count]) => (
            <div key={type} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <KeyTypeBadge type={type as KeyType} />
                </div>
                <span className="font-medium">{count}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${(count / total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Active Keys</span>
            <span className="font-medium text-emerald-600">
              {keys.filter((k) => k.status === "active").length}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Expired/Revoked</span>
            <span className="font-medium text-red-600">
              {
                keys.filter(
                  (k) => k.status === "expired" || k.status === "revoked",
                ).length
              }
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SecurityAlertsPanel({
  alerts,
}: {
  alerts: { kid: string; type: string; severity: string; message: string }[];
}) {
  if (alerts.length === 0) {
    return (
      <Card className="border-border bg-card overflow-hidden">
        <CardHeader className="px-4 py-3 border-b bg-muted/30">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">
              Security Alerts
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm">No active security alerts</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="px-4 py-3 border-b bg-red-500/10">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-red-500" />
          <CardTitle className="text-sm font-medium text-red-600">
            Security Alerts
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {alerts.map((alert, index) => (
          <div
            key={alert.kid}
            className={cn("p-4", index < alerts.length - 1 && "border-b")}
          >
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded bg-red-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs">{alert.kid}</span>
                  <Badge variant="destructive" className="text-[10px]">
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-sm">{alert.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Action required
                </p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function KeyRegistryTable({ keys }: { keys: Key[] }) {
  const [filterType, setFilterType] = React.useState<KeyType | "all">("all");
  const [filterStatus, setFilterStatus] = React.useState<KeyStatus | "all">(
    "all",
  );
  const [filterScope, setFilterScope] = React.useState<KeyScope | "all">("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedKey, setSelectedKey] = React.useState<Key | null>(null);

  const filteredKeys = keys.filter((key) => {
    if (filterType !== "all" && key.type !== filterType) return false;
    if (filterStatus !== "all" && key.status !== filterStatus) return false;
    if (filterScope !== "all" && key.scope !== filterScope) return false;
    if (
      searchQuery &&
      !key.kid.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !key.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">Key Registry</CardTitle>
          </div>
          <span className="text-xs text-muted-foreground">
            {filteredKeys.length} keys
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 border-b flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by KID or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-64 text-xs"
            />
          </div>
          <Select
            value={filterType}
            onValueChange={(v: string) => setFilterType(v as KeyType | "all")}
          >
            <SelectTrigger className="h-8 w-36 text-xs">
              <Filter className="h-3.5 w-3.5 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="jwt-signing">JWT Signing</SelectItem>
              <SelectItem value="jwt-encryption">JWT Encryption</SelectItem>
              <SelectItem value="mtls">mTLS</SelectItem>
              <SelectItem value="interservice">Inter-service</SelectItem>
              <SelectItem value="certificate">Certificate</SelectItem>
              <SelectItem value="trust-anchor">Trust Anchor</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filterStatus}
            onValueChange={(v: string) =>
              setFilterStatus(v as KeyStatus | "all")
            }
          >
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="revoked">Revoked</SelectItem>
              <SelectItem value="rotating">Rotating</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filterScope}
            onValueChange={(v: string) => setFilterScope(v as KeyScope | "all")}
          >
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue placeholder="Scope" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scopes</SelectItem>
              <SelectItem value="token">Token</SelectItem>
              <SelectItem value="mtls">mTLS</SelectItem>
              <SelectItem value="device">Device</SelectItem>
              <SelectItem value="inter-org">Inter-org</SelectItem>
              <SelectItem value="internal">Internal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Key ID (KID)</TableHead>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="text-xs">Algorithm</TableHead>
                <TableHead className="text-xs">Usage</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Scope</TableHead>
                <TableHead className="text-xs">Expires</TableHead>
                <TableHead className="text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKeys.map((key) => (
                <TableRow key={key.kid} className="group">
                  <TableCell className="font-mono text-xs">
                    <span className="truncate max-w-[150px]">{key.kid}</span>
                  </TableCell>
                  <TableCell>
                    <KeyTypeBadge type={key.type} />
                  </TableCell>
                  <TableCell className="text-xs font-mono">
                    {key.algorithm}
                  </TableCell>
                  <TableCell>
                    <KeyUsageBadge usage={key.usage} />
                  </TableCell>
                  <TableCell>
                    <KeyStatusBadge status={key.status} />
                  </TableCell>
                  <TableCell>
                    <ScopeBadge scope={key.scope} />
                  </TableCell>
                  <TableCell className="text-xs">
                    {key.expiresAt ? (
                      <span
                        className={cn(
                          isExpired(key.expiresAt) && "text-red-600",
                        )}
                      >
                        {formatDate(key.expiresAt)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">No expiry</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => setSelectedKey(key)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-sm flex items-center gap-2">
                              <Key className="h-4 w-4" />
                              Key Details
                            </DialogTitle>
                            <DialogDescription className="text-xs">
                              Key ID:{" "}
                              <span className="font-mono">
                                {selectedKey?.kid}
                              </span>
                            </DialogDescription>
                          </DialogHeader>
                          {selectedKey && (
                            <div className="space-y-4 mt-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="space-y-1">
                                  <p className="text-xs text-muted-foreground uppercase">
                                    Type
                                  </p>
                                  <KeyTypeBadge type={selectedKey.type} />
                                </div>
                                <div className="space-y-1">
                                  <p className="text-xs text-muted-foreground uppercase">
                                    Status
                                  </p>
                                  <KeyStatusBadge status={selectedKey.status} />
                                </div>
                                <div className="space-y-1">
                                  <p className="text-xs text-muted-foreground uppercase">
                                    Algorithm
                                  </p>
                                  <p className="font-mono text-sm">
                                    {selectedKey.algorithm}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-xs text-muted-foreground uppercase">
                                    Usage
                                  </p>
                                  <KeyUsageBadge usage={selectedKey.usage} />
                                </div>
                              </div>

                              <Separator />

                              <div className="space-y-2">
                                <p className="text-xs text-muted-foreground uppercase">
                                  Description
                                </p>
                                <p className="text-sm">
                                  {selectedKey.description || "No description"}
                                </p>
                              </div>

                              <Separator />

                              <div className="grid grid-cols-2 gap-4 text-xs">
                                <div className="space-y-1">
                                  <p className="text-muted-foreground">
                                    Created
                                  </p>
                                  <p>{formatDateTime(selectedKey.createdAt)}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-muted-foreground">
                                    Activated
                                  </p>
                                  <p>
                                    {formatDateTime(selectedKey.activatedAt)}
                                  </p>
                                </div>
                                {selectedKey.expiresAt && (
                                  <>
                                    <div className="space-y-1">
                                      <p className="text-muted-foreground">
                                        Expires
                                      </p>
                                      <p
                                        className={cn(
                                          isExpired(selectedKey.expiresAt) &&
                                            "text-red-600",
                                        )}
                                      >
                                        {formatDateTime(selectedKey.expiresAt)}
                                      </p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-muted-foreground">
                                        Days Remaining
                                      </p>
                                      <p>
                                        {daysUntilExpiration(
                                          selectedKey.expiresAt,
                                        )}
                                      </p>
                                    </div>
                                  </>
                                )}
                                <div className="space-y-1">
                                  <p className="text-muted-foreground">
                                    Last Used
                                  </p>
                                  <p>
                                    {selectedKey.lastUsedAt
                                      ? formatTimeAgo(selectedKey.lastUsedAt)
                                      : "Never"}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-muted-foreground">
                                    Rotation Count
                                  </p>
                                  <p>{selectedKey.rotationCount}</p>
                                </div>
                              </div>

                              {selectedKey.type === "certificate" &&
                                (selectedKey.issuer || selectedKey.subject) && (
                                  <>
                                    <Separator />
                                    <div className="space-y-2">
                                      <p className="text-xs text-muted-foreground uppercase">
                                        Certificate Details
                                      </p>
                                      <div className="grid grid-cols-2 gap-4 text-xs">
                                        {selectedKey.subject && (
                                          <div className="space-y-1">
                                            <p className="text-muted-foreground">
                                              Subject
                                            </p>
                                            <p className="font-mono">
                                              {selectedKey.subject}
                                            </p>
                                          </div>
                                        )}
                                        {selectedKey.issuer && (
                                          <div className="space-y-1">
                                            <p className="text-muted-foreground">
                                              Issuer
                                            </p>
                                            <p className="font-mono">
                                              {selectedKey.issuer}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </>
                                )}

                              <div className="p-3 rounded bg-amber-50 border border-amber-200">
                                <div className="flex items-start gap-2">
                                  <Shield className="h-4 w-4 text-amber-600 mt-0.5" />
                                  <div>
                                    <p className="text-xs font-medium text-amber-900">
                                      Security Notice
                                    </p>
                                    <p className="text-xs text-amber-700">
                                      Private key material is never displayed or
                                      accessible through this interface. All
                                      cryptographic operations are performed by
                                      the Identity Service.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      {selectedKey?.status === "active" && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-amber-600 hover:text-amber-700"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
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

function RotationLifecyclePanel({
  policies,
  keys,
}: {
  policies: RotationPolicy[];
  keys: Key[];
}) {
  const rotationCandidates = keys.filter(
    (key) =>
      key.status === "active" &&
      daysUntilExpiration(key.expiresAt) !== null &&
      daysUntilExpiration(key.expiresAt)! <= 30,
  );

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card overflow-hidden">
        <CardHeader className="px-4 py-3 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-medium">
                Rotation Policies
              </CardTitle>
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
                className="p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-sm font-medium">{policy.name}</p>
                      <Badge variant="outline" className="text-[10px]">
                        {policy.type.join(", ")}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        Rotation: {policy.intervalDays} days
                      </span>
                      <span className="flex items-center gap-1">
                        <Shield className="h-3.5 w-3.5" />
                        Grace: {policy.gracePeriodDays} days
                      </span>
                      <span>Notify: {policy.notifyBeforeDays} days before</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {policy.autoRotate ? (
                      <Badge variant="secondary" className="text-xs">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Auto
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Manual
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card overflow-hidden">
        <CardHeader className="px-4 py-3 border-b bg-amber-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <CardTitle className="text-sm font-medium text-amber-900">
                Keys Requiring Rotation
              </CardTitle>
            </div>
            <Badge
              variant="secondary"
              className="text-xs bg-amber-500/20 text-amber-700"
            >
              {rotationCandidates.length} keys
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {rotationCandidates.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
              <p className="text-sm">No keys require immediate rotation</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {rotationCandidates.map((key) => (
                <div
                  key={key.kid}
                  className="p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <KeyTypeBadge type={key.type} />
                    <div>
                      <p className="font-mono text-xs">{key.kid}</p>
                      <p className="text-xs text-muted-foreground">
                        Expires in {daysUntilExpiration(key.expiresAt)} days
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs">
                    <RefreshCw className="h-3.5 w-3.5 mr-1" />
                    Rotate Now
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function TrustDistributionPanel({
  trustAnchors,
  keys,
}: {
  trustAnchors: TrustAnchor[];
  keys: Key[];
}) {
  const publicKeys = keys.filter((k) => k.status === "active");

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card overflow-hidden">
        <CardHeader className="px-4 py-3 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-medium">
                Public JWKS Endpoints
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Public JSON Web Key Set
            </p>
            <div className="flex items-center gap-2 p-3 rounded bg-muted/50 font-mono text-xs">
              <span>/api/v1/keys/jwks</span>
              <Button size="icon" variant="ghost" className="h-6 w-6 shrink-0">
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Exposes public keys for token verification by external parties
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Active Public Keys</p>
            <div className="grid grid-cols-2 gap-2">
              {publicKeys.slice(0, 4).map((key) => (
                <div key={key.kid} className="p-2 rounded border text-xs">
                  <p className="font-mono truncate">{key.kid}</p>
                  <p className="text-muted-foreground">{key.algorithm}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card overflow-hidden">
        <CardHeader className="px-4 py-3 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Fingerprint className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-medium">
                Trust Anchors
              </CardTitle>
            </div>
            <Badge variant="secondary" className="text-xs">
              {trustAnchors.length} anchors
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {trustAnchors.map((anchor) => (
              <div key={anchor.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-[10px]">
                        {anchor.type}
                      </Badge>
                      <Badge
                        variant={
                          anchor.status === "active"
                            ? "secondary"
                            : "destructive"
                        }
                        className="text-[10px]"
                      >
                        {anchor.status}
                      </Badge>
                    </div>
                    <p className="text-xs font-mono truncate mb-1">
                      {anchor.subject}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Issuer: {anchor.issuer}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
                      <span>Valid: {formatDate(anchor.validFrom)}</span>
                      <span>Expires: {formatDate(anchor.validTo)}</span>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 shrink-0"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card overflow-hidden">
        <CardHeader className="px-4 py-3 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-medium">
                Inter-service Trust
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between p-3 rounded border">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Internal Services</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {
                keys.filter(
                  (k) => k.scope === "internal" && k.status === "active",
                ).length
              }{" "}
              keys
            </Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded border">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Partner Organizations</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {
                keys.filter(
                  (k) => k.scope === "inter-org" && k.status === "active",
                ).length
              }{" "}
              keys
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AuditCompliancePanel({
  usageEvents,
  rotationEvents,
}: {
  usageEvents: KeyUsageEvent[];
  rotationEvents: RotationEvent[];
}) {
  return (
    <div className="space-y-6">
      <Card className="border-border bg-card overflow-hidden">
        <CardHeader className="px-4 py-3 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-medium">
                Key Usage History
              </CardTitle>
            </div>
            <Button size="sm" variant="ghost" className="text-xs">
              <History className="h-3.5 w-3.5 mr-1" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {usageEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                    {event.action === "sign" && (
                      <KeyRound className="h-4 w-4" />
                    )}
                    {event.action === "verify" && (
                      <Shield className="h-4 w-4" />
                    )}
                    {event.action === "encrypt" && <Lock className="h-4 w-4" />}
                    {event.action === "decrypt" && (
                      <Unlock className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-mono">{event.kid}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.actor} • {event.service}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      event.result === "success" ? "secondary" : "destructive"
                    }
                    className="text-[10px]"
                  >
                    {event.result}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(event.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card overflow-hidden">
        <CardHeader className="px-4 py-3 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-medium">
                Rotation History
              </CardTitle>
            </div>
            <Button size="sm" variant="ghost" className="text-xs">
              <History className="h-3.5 w-3.5 mr-1" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {rotationEvents.map((event) => (
              <div key={event.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                      <RefreshCw className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-mono">{event.kid}</p>
                        <Badge
                          variant="outline"
                          className="text-[10px] capitalize"
                        >
                          {event.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Rotated by {event.actor} •{" "}
                        {formatDateTime(event.timestamp)}
                      </p>
                      {event.reason && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Reason: {event.reason}
                        </p>
                      )}
                    </div>
                  </div>
                  {event.oldKid && event.newKid && (
                    <div className="text-xs text-muted-foreground">
                      <span className="line-through">{event.oldKid}</span>
                      <span className="mx-1">→</span>
                      <span>{event.newKid}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card overflow-hidden">
        <CardHeader className="px-4 py-3 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-medium">
                Compliance & Reports
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-auto justify-start text-left">
            <div className="flex items-start gap-3">
              <History className="h-4 w-4 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Security Audit Log</p>
                <p className="text-xs text-muted-foreground">
                  View detailed audit trail
                </p>
              </div>
            </div>
          </Button>
          <Button variant="outline" className="h-auto justify-start text-left">
            <div className="flex items-start gap-3">
              <FileKey className="h-4 w-4 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Compliance Report</p>
                <p className="text-xs text-muted-foreground">
                  Generate compliance documentation
                </p>
              </div>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function KeyManagementPage() {
  const securityAlerts = [
    {
      kid: "key-cert-wildcard",
      type: "certificate",
      severity: "critical",
      message: "Certificate has expired and needs immediate renewal",
    },
  ];

  return (
    <div className="space-y-6 text-foreground">
      <div>
        <h1 className="text-2xl font-semibold text-card-foreground">
          Cryptographic Key Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage keys, certificates, and trust materials for Identity services
        </p>
      </div>

      <div className="p-4 rounded-lg bg-muted/50 border border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">
              This page manages cryptographic trust materials. All operations
              are performed by the Identity Service API.
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Private keys are never displayed, exported, or accessible through
              this interface.
            </p>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Key Overview
        </h2>
        <KeyOverviewMetrics stats={mockStats} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <KeyDistributionPanel keys={mockKeys} />
          </div>
          <div className="lg:col-span-1">
            <SecurityAlertsPanel alerts={securityAlerts} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Key Registry
        </h2>
        <KeyRegistryTable keys={mockKeys} />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Rotation & Lifecycle
        </h2>
        <RotationLifecyclePanel
          policies={mockRotationPolicies}
          keys={mockKeys}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Trust & Distribution
        </h2>
        <TrustDistributionPanel
          trustAnchors={mockTrustAnchors}
          keys={mockKeys}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Audit & Compliance
        </h2>
        <AuditCompliancePanel
          usageEvents={mockUsageEvents}
          rotationEvents={mockRotationEvents}
        />
      </section>
    </div>
  );
}
