"use client";

import { useState } from "react";
import {
  Fingerprint,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Key,
  Clock,
  RefreshCw,
  Lock,
  Unlock,
  UserCircle,
  Server,
  Terminal,
  Globe,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Activity,
  Cpu,
  Settings,
  AlertCircle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES - Identity Platform Configuration
// ============================================================================

interface IdentityEngineConfig {
  version: string;
  status: "healthy" | "degraded" | "critical";
  enabledTypes: ("human" | "service" | "device")[];
  activeEnvironments: string[];
  lifecycleStates: string[];
  lastUpdated: string;
}

interface AuthenticationFactor {
  id: string;
  name: string;
  type: "knowledge" | "possession" | "inherence";
  enabled: boolean;
  configurable: boolean;
  description: string;
}

interface MfaPolicy {
  baseline: "optional" | "required" | "risk_based";
  enforcementContexts: string[];
  recoveryMethods: string[];
  allowedFallbacks: string[];
}

interface TokenConfig {
  format: "jwt" | "opaque";
  signingAlgorithm: string;
  issuer: string;
  accessTokenLifetime: number;
  refreshTokenLifetime: number;
  rotationStrategy: "sliding" | "absolute" | "on_demand";
}

interface SessionPolicy {
  type: string;
  idleTimeout: number;
  absoluteTimeout: number;
  concurrentLimit: number;
  isolationLevel: "user" | "context" | "device";
  revocationBehavior: "immediate" | "grace_period";
}

interface IdentityContext {
  id: string;
  name: string;
  description: string;
  allowedAuthMethods: string[];
  maxSessionDuration: number;
  tokenScopeLimit: string[];
  escalationAllowed: boolean;
  riskLevel: "low" | "medium" | "high" | "critical";
}

// ============================================================================
// MOCK DATA - Identity Platform State
// ============================================================================

const mockEngineConfig: IdentityEngineConfig = {
  version: "2.4.1",
  status: "healthy",
  enabledTypes: ["human", "service", "device"],
  activeEnvironments: ["production", "staging", "development"],
  lifecycleStates: ["active", "suspended", "revoked", "pending"],
  lastUpdated: "2024-01-15T08:30:00Z",
};

const mockAuthFactors: AuthenticationFactor[] = [
  {
    id: "password",
    name: "Password",
    type: "knowledge",
    enabled: true,
    configurable: true,
    description:
      "Primary authentication factor using password-based credentials",
  },
  {
    id: "totp",
    name: "TOTP (Time-based OTP)",
    type: "possession",
    enabled: true,
    configurable: true,
    description: "Time-based one-time password via authenticator apps",
  },
  {
    id: "webauthn",
    name: "WebAuthn / Passkeys",
    type: "inherence",
    enabled: true,
    configurable: true,
    description: "Hardware-backed biometric or security key authentication",
  },
  {
    id: "mfa-sms",
    name: "SMS OTP",
    type: "possession",
    enabled: false,
    configurable: true,
    description: "One-time password delivered via SMS (not recommended)",
  },
  {
    id: "mfa-email",
    name: "Email OTP",
    type: "possession",
    enabled: false,
    configurable: true,
    description: "One-time password delivered via email",
  },
  {
    id: "client-cert",
    name: "Client Certificates",
    type: "possession",
    enabled: true,
    configurable: false,
    description: "X.509 certificate-based authentication for service accounts",
  },
];

const mockMfaPolicy: MfaPolicy = {
  baseline: "risk_based",
  enforcementContexts: ["admin", "production", "privilege_escalation"],
  recoveryMethods: ["backup_codes", "admin_reset"],
  allowedFallbacks: ["backup_codes"],
};

const mockTokenConfig: TokenConfig = {
  format: "jwt",
  signingAlgorithm: "RS256",
  issuer: "https://identity.aether.internal",
  accessTokenLifetime: 900,
  refreshTokenLifetime: 604800,
  rotationStrategy: "sliding",
};

const mockSessionPolicies: SessionPolicy[] = [
  {
    type: "browser",
    idleTimeout: 1800,
    absoluteTimeout: 28800,
    concurrentLimit: 5,
    isolationLevel: "context",
    revocationBehavior: "immediate",
  },
  {
    type: "cli",
    idleTimeout: 3600,
    absoluteTimeout: 86400,
    concurrentLimit: 10,
    isolationLevel: "device",
    revocationBehavior: "immediate",
  },
  {
    type: "device",
    idleTimeout: 86400,
    absoluteTimeout: 2592000,
    concurrentLimit: 1,
    isolationLevel: "device",
    revocationBehavior: "grace_period",
  },
  {
    type: "service",
    idleTimeout: 3600,
    absoluteTimeout: 86400,
    concurrentLimit: 100,
    isolationLevel: "user",
    revocationBehavior: "immediate",
  },
];

const mockContexts: IdentityContext[] = [
  {
    id: "ctx-user",
    name: "User Context",
    description: "Standard user authentication context for regular operations",
    allowedAuthMethods: ["password", "totp", "webauthn"],
    maxSessionDuration: 28800,
    tokenScopeLimit: ["read", "write"],
    escalationAllowed: true,
    riskLevel: "low",
  },
  {
    id: "ctx-admin",
    name: "Admin Context",
    description: "Administrative context with elevated privileges",
    allowedAuthMethods: ["password", "totp", "webauthn"],
    maxSessionDuration: 7200,
    tokenScopeLimit: ["read", "write", "delete", "manage"],
    escalationAllowed: false,
    riskLevel: "critical",
  },
  {
    id: "ctx-cli",
    name: "CLI Context",
    description: "Command-line interface authentication context",
    allowedAuthMethods: ["password", "totp", "client-cert"],
    maxSessionDuration: 86400,
    tokenScopeLimit: ["read", "write", "manage"],
    escalationAllowed: false,
    riskLevel: "medium",
  },
  {
    id: "ctx-device",
    name: "Device Context",
    description: "IoT and device authentication context",
    allowedAuthMethods: ["client-cert"],
    maxSessionDuration: 2592000,
    tokenScopeLimit: ["read", "write"],
    escalationAllowed: false,
    riskLevel: "medium",
  },
  {
    id: "ctx-console",
    name: "Console Context",
    description: "Emergency console access context",
    allowedAuthMethods: ["password", "totp", "webauthn"],
    maxSessionDuration: 3600,
    tokenScopeLimit: ["read", "write", "delete", "manage"],
    escalationAllowed: false,
    riskLevel: "high",
  },
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function StatusBadge({ status }: { status: IdentityEngineConfig["status"] }) {
  const configs = {
    healthy: {
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      label: "Healthy",
    },
    degraded: {
      icon: AlertCircle,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      label: "Degraded",
    },
    critical: {
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      label: "Critical",
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

function FactorTypeBadge({ type }: { type: AuthenticationFactor["type"] }) {
  const configs = {
    knowledge: { color: "bg-blue-500/10 text-blue-600", label: "Knowledge" },
    possession: {
      color: "bg-purple-500/10 text-purple-600",
      label: "Possession",
    },
    inherence: {
      color: "bg-emerald-500/10 text-emerald-600",
      label: "Inherence",
    },
  };

  const config = configs[type];

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

function RiskBadge({ level }: { level: IdentityContext["riskLevel"] }) {
  const configs = {
    low: { color: "bg-emerald-500/10 text-emerald-600", label: "Low Risk" },
    medium: { color: "bg-blue-500/10 text-blue-600", label: "Medium Risk" },
    high: { color: "bg-amber-500/10 text-amber-600", label: "High Risk" },
    critical: { color: "bg-red-500/10 text-red-600", label: "Critical Risk" },
  };

  const config = configs[level];

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

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

function EngineOverviewPanel({ config }: { config: IdentityEngineConfig }) {
  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      <div className="px-4 py-3 border-b bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">Identity Engine</h3>
        </div>
        <StatusBadge status={config.status} />
      </div>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Version
            </p>
            <p className="text-sm font-mono font-medium">{config.version}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Last Updated
            </p>
            <p className="text-sm text-muted-foreground">
              {new Date(config.lastUpdated).toISOString().split("T")[0]}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Enabled Identity Types
          </p>
          <div className="flex flex-wrap gap-2">
            {config.enabledTypes.map((type) => (
              <span
                key={type}
                className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground capitalize"
              >
                {type === "human" && <UserCircle className="h-3 w-3" />}
                {type === "service" && <Server className="h-3 w-3" />}
                {type === "device" && <Cpu className="h-3 w-3" />}
                {type}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Active Environments
          </p>
          <div className="flex flex-wrap gap-2">
            {config.activeEnvironments.map((env) => (
              <span
                key={env}
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase",
                  env === "production"
                    ? "bg-red-500/10 text-red-500"
                    : env === "staging"
                      ? "bg-amber-500/10 text-amber-500"
                      : "bg-blue-500/10 text-blue-500",
                )}
              >
                {env}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Lifecycle States
          </p>
          <div className="flex flex-wrap gap-2">
            {config.lifecycleStates.map((state) => (
              <span
                key={state}
                className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 capitalize"
              >
                {state}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthenticationFactorsPanel({
  factors,
}: {
  factors: AuthenticationFactor[];
}) {
  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      <div className="px-4 py-3 border-b bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">Authentication Factors</h3>
        </div>
        <span className="text-xs text-muted-foreground">
          {factors.filter((f) => f.enabled).length} enabled
        </span>
      </div>
      <div className="divide-y divide-border">
        {factors.map((factor) => (
          <div
            key={factor.id}
            className={cn(
              "p-4 flex items-start justify-between gap-4",
              !factor.enabled && "opacity-50",
            )}
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{factor.name}</span>
                <FactorTypeBadge type={factor.type} />
                {!factor.configurable && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700">
                    System
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {factor.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {factor.enabled ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-600">
                  <ShieldCheck className="h-3 w-3" />
                  Enabled
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-500/10 text-slate-500">
                  <Shield className="h-3 w-3" />
                  Disabled
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MfaPolicyPanel({ policy }: { policy: MfaPolicy }) {
  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      <div className="px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">MFA Policy</h3>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Baseline Enforcement
          </p>
          <div className="flex items-center gap-2">
            {policy.baseline === "required" ? (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-emerald-500/10 text-emerald-600">
                <Lock className="h-3 w-3" />
                Required
              </span>
            ) : policy.baseline === "optional" ? (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-blue-500/10 text-blue-600">
                <Unlock className="h-3 w-3" />
                Optional
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-purple-500/10 text-purple-600">
                <Activity className="h-3 w-3" />
                Risk-Based
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Enforced Contexts
          </p>
          <div className="flex flex-wrap gap-2">
            {policy.enforcementContexts.map((ctx) => (
              <span
                key={ctx}
                className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-red-500/10 text-red-600 uppercase"
              >
                {ctx}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Recovery Methods
          </p>
          <div className="flex flex-wrap gap-2">
            {policy.recoveryMethods.map((method) => (
              <span
                key={method}
                className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-600 capitalize"
              >
                {method.replace("_", " ")}
              </span>
            ))}
          </div>
        </div>

        {policy.baseline !== "required" && (
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
            <div className="flex items-start gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700">
                MFA is not globally required. Consider enabling mandatory MFA
                for enhanced security.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TokenConfigurationPanel({ config }: { config: TokenConfig }) {
  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      <div className="px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Key className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">Token Configuration</h3>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Token Format
            </p>
            <p className="text-sm font-medium uppercase">{config.format}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Signing Algorithm
            </p>
            <p className="text-sm font-mono font-medium">
              {config.signingAlgorithm}
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Issuer
          </p>
          <p className="text-sm font-mono text-muted-foreground truncate">
            {config.issuer}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Access Token TTL
            </p>
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-sm font-medium">
                {formatDuration(config.accessTokenLifetime)}
              </p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Refresh Token TTL
            </p>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-sm font-medium">
                {formatDuration(config.refreshTokenLifetime)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Rotation Strategy
          </p>
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium capitalize">
              {config.rotationStrategy.replace("_", " ")}
            </span>
          </div>
        </div>

        {config.accessTokenLifetime > 3600 && (
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700">
                Access token lifetime exceeds 1 hour. This increases the window
                of opportunity for token misuse if compromised.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SessionPoliciesPanel({ policies }: { policies: SessionPolicy[] }) {
  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      <div className="px-4 py-3 border-b bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">Session Policies</h3>
        </div>
        <span className="text-xs text-muted-foreground">
          {policies.length} session types
        </span>
      </div>
      <div className="divide-y divide-border">
        {policies.map((policy) => (
          <div key={policy.type} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {policy.type === "browser" && (
                  <Globe className="h-4 w-4 text-muted-foreground" />
                )}
                {policy.type === "cli" && (
                  <Terminal className="h-4 w-4 text-muted-foreground" />
                )}
                {policy.type === "device" && (
                  <Cpu className="h-4 w-4 text-muted-foreground" />
                )}
                {policy.type === "service" && (
                  <Server className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="font-medium text-sm capitalize">
                  {policy.type} Sessions
                </span>
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                Max: {policy.concurrentLimit}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Idle Timeout</p>
                <p className="font-medium">
                  {formatDuration(policy.idleTimeout)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  Absolute Timeout
                </p>
                <p className="font-medium">
                  {formatDuration(policy.absoluteTimeout)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="text-muted-foreground">
                Isolation:{" "}
                <span className="text-foreground capitalize">
                  {policy.isolationLevel}
                </span>
              </span>
              <span className="text-muted-foreground">
                Revocation:{" "}
                <span className="text-foreground capitalize">
                  {policy.revocationBehavior.replace("_", " ")}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContextsPanel({ contexts }: { contexts: IdentityContext[] }) {
  const [selectedContext, setSelectedContext] =
    useState<IdentityContext | null>(null);

  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      <div className="px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Fingerprint className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">Identity Contexts</h3>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="divide-y divide-border lg:border-r">
          {contexts.map((context) => (
            <button
              key={context.id}
              onClick={() => setSelectedContext(context)}
              className={cn(
                "w-full p-4 text-left transition-colors hover:bg-muted/50",
                selectedContext?.id === context.id && "bg-muted",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{context.name}</span>
                    <RiskBadge level={context.riskLevel} />
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {context.description}
                  </p>
                </div>
                {selectedContext?.id === context.id && (
                  <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                )}
              </div>
            </button>
          ))}
        </div>
        <div className="p-4">
          {selectedContext ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Context ID
                </p>
                <p className="text-sm font-mono text-muted-foreground">
                  {selectedContext.id}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Allowed Authentication Methods
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedContext.allowedAuthMethods.map((method) => (
                    <span
                      key={method}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground capitalize"
                    >
                      {method.replace("-", " ")}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Maximum Session Duration
                </p>
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    {formatDuration(selectedContext.maxSessionDuration)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Token Scope Limitations
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedContext.tokenScopeLimit.map((scope) => (
                    <span
                      key={scope}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-600 uppercase"
                    >
                      {scope}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Escalation
                </p>
                <div className="flex items-center gap-2">
                  {selectedContext.escalationAllowed ? (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                      <Unlock className="h-3.5 w-3.5" />
                      Escalation permitted
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                      <Lock className="h-3.5 w-3.5" />
                      No escalation
                    </span>
                  )}
                </div>
              </div>

              {selectedContext.riskLevel === "critical" && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-red-700">
                      This is a critical-risk context. All activities are
                      audited and session durations are limited.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-8">
              <Fingerprint className="h-10 w-10 mb-3 opacity-50" />
              <p className="text-sm">Select a context to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function IdentityPlatformPage() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-card-foreground">
            Identity Platform
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Configure the core identity engine mechanics. These settings define
            how identities are issued, validated, and managed across all
            environments. Changes here impact the entire platform.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          <Settings className="h-4 w-4" />
          Edit Configuration
        </button>
      </div>

      {/* Global Warning Banner */}
      <div className="p-4 rounded-lg border border-amber-200 bg-amber-50">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-900">
              Platform-Level Configuration
            </p>
            <p className="text-sm text-amber-700 mt-1">
              Changes to these settings affect all environments and
              organizations. Review carefully before applying modifications.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Engine Overview & Auth */}
        <div className="lg:col-span-1 space-y-6">
          <EngineOverviewPanel config={mockEngineConfig} />
          <AuthenticationFactorsPanel factors={mockAuthFactors} />
          <MfaPolicyPanel policy={mockMfaPolicy} />
        </div>

        {/* Right Column - Tokens, Sessions, Contexts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Token & Session Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TokenConfigurationPanel config={mockTokenConfig} />
            <SessionPoliciesPanel policies={mockSessionPolicies} />
          </div>

          {/* Context Behavior */}
          <ContextsPanel contexts={mockContexts} />

          {/* Best Practices Notice */}
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  Security Best Practices
                </p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• Use short-lived access tokens with sliding refresh</li>
                  <li>• Enable MFA for all administrative contexts</li>
                  <li>• Separate session policies by device type</li>
                  <li>• Regularly rotate signing keys</li>
                  <li>• Monitor identity engine health status</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
