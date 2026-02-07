"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Badge } from "@/components/dashboard/ui/badge";
import { Input } from "@/components/dashboard/ui/input";
import { Label } from "@/components/dashboard/ui/label";
import { Switch } from "@/components/dashboard/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/dashboard/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/dashboard/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/dashboard/ui/alert-dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Key,
  Users,
  Shield,
  AlertTriangle,
  AlertCircle,
  Settings,
  Trash2,
  Plus,
  RefreshCw,
  CheckCircle2,
  Globe,
  Building2,
  Lock,
  Info,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ProviderType = "social" | "enterprise" | "custom";
type ProviderStatus = "enabled" | "disabled" | "misconfigured";
type AccountLinkingPolicy = "auto" | "manual" | "strict";

interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  status: ProviderStatus;
  description: string;
  clientId?: string;
  clientSecret?: string;
  issuerUrl?: string;
  scopes?: string;
  callbackUrl: string;
  accountLinking: AccountLinkingPolicy;
  mfaEnforced: boolean;
  allowedContexts: string[];
  lastModified: string;
}

const typeIcons: Record<
  ProviderType,
  React.ComponentType<{ className?: string }>
> = {
  social: Globe,
  enterprise: Building2,
  custom: Lock,
};

const typeLabels: Record<ProviderType, string> = {
  social: "Social",
  enterprise: "Enterprise",
  custom: "Custom",
};

const mockProviders: Provider[] = [
  {
    id: "google",
    name: "Google",
    type: "social",
    status: "enabled",
    description: "Google OAuth 2.0 authentication",
    clientId: "google-client-id-123",
    scopes: "openid email profile",
    callbackUrl: "https://identity.example.com/auth/google/callback",
    accountLinking: "auto",
    mfaEnforced: false,
    allowedContexts: ["user"],
    lastModified: "2024-01-15",
  },
  {
    id: "github",
    name: "GitHub",
    type: "social",
    status: "disabled",
    description: "GitHub OAuth authentication",
    callbackUrl: "https://identity.example.com/auth/github/callback",
    accountLinking: "manual",
    mfaEnforced: false,
    allowedContexts: ["user"],
    lastModified: "2024-01-20",
  },
  {
    id: "oidc-azure",
    name: "Azure AD (OIDC)",
    type: "enterprise",
    status: "misconfigured",
    description: "Microsoft Azure Active Directory via OIDC",
    issuerUrl: "https://login.microsoftonline.com/{tenant}/v2.0",
    callbackUrl: "https://identity.example.com/auth/azure/callback",
    accountLinking: "strict",
    mfaEnforced: true,
    allowedContexts: ["user"],
    lastModified: "2024-02-01",
  },
  {
    id: "saml-okta",
    name: "Okta (SAML)",
    type: "enterprise",
    status: "enabled",
    description: "Okta SAML 2.0 identity provider",
    callbackUrl: "https://identity.example.com/auth/saml/okta/callback",
    accountLinking: "strict",
    mfaEnforced: true,
    allowedContexts: ["user"],
    lastModified: "2024-01-10",
  },
  {
    id: "ldap-internal",
    name: "Corporate LDAP",
    type: "custom",
    status: "disabled",
    description: "Internal LDAP directory service",
    callbackUrl: "https://identity.example.com/auth/ldap/callback",
    accountLinking: "manual",
    mfaEnforced: false,
    allowedContexts: ["user"],
    lastModified: "2023-12-15",
  },
];

export default function ProvidersPage() {
  const [providers, setProviders] = React.useState<Provider[]>(mockProviders);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [selectedProvider, setSelectedProvider] =
    React.useState<Provider | null>(null);
  const [isConfigOpen, setIsConfigOpen] = React.useState(false);
  const [providerToDelete, setProviderToDelete] =
    React.useState<Provider | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  const enabledCount = providers.filter((p) => p.status === "enabled").length;
  const misconfiguredCount = providers.filter(
    (p) => p.status === "misconfigured",
  ).length;
  const totalCount = providers.length;

  const getStatusBadge = (status: ProviderStatus) => {
    const configs = {
      enabled: {
        variant: "default" as const,
        label: "Enabled",
        icon: CheckCircle2,
      },
      disabled: {
        variant: "secondary" as const,
        label: "Disabled",
        icon: null,
      },
      misconfigured: {
        variant: "destructive" as const,
        label: "Misconfigured",
        icon: AlertCircle,
      },
    };
    const config = configs[status];
    return (
      <Badge variant={config.variant} className="text-xs gap-1">
        {config.icon && <config.icon className="h-3 w-3" />}
        {config.label}
      </Badge>
    );
  };

  const getTypeBadge = (type: ProviderType) => {
    const configs = {
      social: { variant: "outline" as const, label: "Social" },
      enterprise: { variant: "secondary" as const, label: "Enterprise" },
      custom: { variant: "outline" as const, label: "Custom" },
    };
    const config = configs[type];
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  const handleToggleProvider = (providerId: string) => {
    setProviders((prev) =>
      prev.map((p) => {
        if (p.id !== providerId) return p;
        if (p.status === "misconfigured") {
          return p;
        }
        const newStatus = p.status === "enabled" ? "disabled" : "enabled";
        return {
          ...p,
          status: newStatus,
          lastModified: new Date().toISOString().split("T")[0],
        };
      }),
    );
    setHasUnsavedChanges(true);
  };

  const handleConfigure = (provider: Provider) => {
    setSelectedProvider({ ...provider });
    setIsConfigOpen(true);
  };

  const handleSaveConfiguration = () => {
    if (!selectedProvider) return;
    setProviders((prev) =>
      prev.map((p) =>
        p.id === selectedProvider.id
          ? {
              ...selectedProvider,
              lastModified: new Date().toISOString().split("T")[0],
            }
          : p,
      ),
    );
    setIsConfigOpen(false);
    setSelectedProvider(null);
    setHasUnsavedChanges(true);
  };

  const handleDelete = (provider: Provider) => {
    setProviderToDelete(provider);
  };

  const confirmDelete = () => {
    if (!providerToDelete) return;
    setProviders((prev) => prev.filter((p) => p.id !== providerToDelete.id));
    setProviderToDelete(null);
    setHasUnsavedChanges(true);
  };

  const handleAddProvider = (type: ProviderType) => {
    const newProvider: Provider = {
      id: `new-${Date.now()}`,
      name:
        type === "social"
          ? "New Social Provider"
          : type === "enterprise"
            ? "New Enterprise Provider"
            : "New Custom Provider",
      type,
      status: "disabled",
      description: "Configure this provider",
      callbackUrl: `https://identity.example.com/auth/${Date.now()}/callback`,
      accountLinking: "manual",
      mfaEnforced: false,
      allowedContexts: ["user"],
      lastModified: new Date().toISOString().split("T")[0],
    };
    setProviders((prev) => [...prev, newProvider]);
    setIsAddDialogOpen(false);
    setHasUnsavedChanges(true);
    handleConfigure(newProvider);
  };

  const handleSave = () => {
    setHasUnsavedChanges(false);
  };

  const validateConfiguration = (): boolean => {
    if (!selectedProvider) return false;
    if (selectedProvider.type !== "custom" && !selectedProvider.clientId)
      return false;
    if (selectedProvider.type === "enterprise" && !selectedProvider.issuerUrl)
      return false;
    return true;
  };

  return (
    <div className="space-y-6 text-foreground">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-card-foreground">
              Identity Providers
            </h1>
            {enabledCount === 0 && (
              <Badge variant="destructive" className="text-xs">
                No providers enabled
              </Badge>
            )}
            {misconfiguredCount > 0 && (
              <Badge variant="destructive" className="text-xs gap-1">
                <AlertCircle className="h-3 w-3" />
                {misconfiguredCount} misconfigured
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Configure external identity sources used for user authentication.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsAddDialogOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Provider
          </Button>
          {hasUnsavedChanges && (
            <Button onClick={handleSave} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Save Changes
            </Button>
          )}
        </div>
      </div>

      {/* Provider Overview */}
      <section>
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
          Provider Overview
        </h2>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                  <Key className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">
                    {totalCount}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total Providers
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">
                    {enabledCount}
                  </p>
                  <p className="text-sm text-muted-foreground">Enabled</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Providers integrate into login flows as authentication
                    options for end users. All provider authentication is
                    audited and subject to context scope restrictions.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Provider List */}
      <section>
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
          Configured Providers
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {providers.map((provider) => {
            const Icon = typeIcons[provider.type];
            const isMisconfigured = provider.status === "misconfigured";

            return (
              <Card
                key={provider.id}
                className={cn(
                  "border-border bg-card",
                  provider.status === "disabled" && "opacity-75",
                  isMisconfigured && "border-destructive/50",
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-sm font-medium text-foreground">
                            {provider.name}
                          </CardTitle>
                          {getTypeBadge(provider.type)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {provider.description}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(provider.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isMisconfigured && (
                    <Alert
                      variant="destructive"
                      className="border-red-500/30 bg-red-500/10 py-2"
                    >
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <AlertDescription className="text-xs text-red-400">
                        Provider configuration is incomplete. Review required
                        fields.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Account Linking
                      </span>
                      <span className="font-medium capitalize">
                        {provider.accountLinking}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        MFA Required
                      </span>
                      <span className="font-medium">
                        {provider.mfaEnforced ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Last Modified
                      </span>
                      <span className="text-muted-foreground">
                        {provider.lastModified}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-md bg-secondary/50 px-3 py-2">
                    <Shield className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Context: user scope only
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`${provider.id}-toggle`}
                        checked={provider.status === "enabled"}
                        onCheckedChange={() =>
                          handleToggleProvider(provider.id)
                        }
                        disabled={isMisconfigured}
                      />
                      <Label
                        htmlFor={`${provider.id}-toggle`}
                        className="text-sm text-muted-foreground cursor-pointer"
                      >
                        {provider.status === "enabled" ? "Enabled" : "Disabled"}
                      </Label>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleConfigure(provider)}
                        className="gap-1"
                      >
                        <Settings className="h-3.5 w-3.5" />
                        Configure
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(provider)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Security & Policy Notes */}
      <section>
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
          Security & Policy Information
        </h2>
        <Card className="border-border bg-card">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-3 flex-1">
                <div>
                  <h4 className="text-sm font-medium text-foreground">
                    Context Scope Restrictions
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Identity providers are strictly limited to user
                    authentication contexts. Admin and console authentication
                    cannot use external identity providers. This restriction is
                    enforced at the API and policy layers.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-foreground">
                    Fixed Redirect URIs
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    All callback URLs are generated and managed by Identity.
                    Wildcard redirects are not permitted. Each provider must be
                    explicitly configured with its fixed callback endpoint.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-foreground">
                    Audit & Compliance
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    All authentication flows through external providers are
                    fully audited. Login attempts, failures, and account linking
                    events are logged with timestamps and source information.
                    Configuration changes require administrator privileges and
                    are logged for compliance.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-foreground">
                    Provider Disable Behavior
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Disabling a provider immediately prevents new
                    authentications but does not affect existing linked
                    accounts. Users with linked accounts can still authenticate
                    using other enabled providers or local credentials.
                  </p>
                </div>

                <div className="rounded-md bg-secondary/50 p-3">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Security Note:</strong>{" "}
                    Client secrets are encrypted at rest and never displayed
                    after initial configuration. Rotating credentials requires
                    re-entering the secret.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Configuration Dialog */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedProvider &&
                React.createElement(typeIcons[selectedProvider.type], {
                  className: "h-5 w-5",
                })}
              Configure {selectedProvider?.name}
            </DialogTitle>
            <DialogDescription>
              Update provider settings and authentication parameters.
            </DialogDescription>
          </DialogHeader>

          {selectedProvider && (
            <div className="space-y-6 py-4">
              {/* Basic Configuration */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">
                  Basic Configuration
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="provider-name">Provider Name</Label>
                  <Input
                    id="provider-name"
                    value={selectedProvider.name}
                    onChange={(e) =>
                      setSelectedProvider({
                        ...selectedProvider,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                {selectedProvider.type !== "custom" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="client-id">Client ID</Label>
                      <Input
                        id="client-id"
                        value={selectedProvider.clientId || ""}
                        onChange={(e) =>
                          setSelectedProvider({
                            ...selectedProvider,
                            clientId: e.target.value,
                          })
                        }
                        placeholder="Enter client ID from provider"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="client-secret">Client Secret</Label>
                      <Input
                        id="client-secret"
                        type="password"
                        value={selectedProvider.clientSecret || ""}
                        onChange={(e) =>
                          setSelectedProvider({
                            ...selectedProvider,
                            clientSecret: e.target.value,
                          })
                        }
                        placeholder={
                          selectedProvider.clientId
                            ? "••••••••••••••••"
                            : "Enter client secret"
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Secret is encrypted and never displayed after saving.
                      </p>
                    </div>
                  </>
                )}

                {selectedProvider.type === "enterprise" && (
                  <div className="space-y-2">
                    <Label htmlFor="issuer-url">Issuer / Metadata URL</Label>
                    <Input
                      id="issuer-url"
                      value={selectedProvider.issuerUrl || ""}
                      onChange={(e) =>
                        setSelectedProvider({
                          ...selectedProvider,
                          issuerUrl: e.target.value,
                        })
                      }
                      placeholder="https://login.microsoftonline.com/{tenant}/v2.0"
                    />
                  </div>
                )}

                {selectedProvider.type === "social" && (
                  <div className="space-y-2">
                    <Label htmlFor="scopes">Scopes</Label>
                    <Input
                      id="scopes"
                      value={selectedProvider.scopes || ""}
                      onChange={(e) =>
                        setSelectedProvider({
                          ...selectedProvider,
                          scopes: e.target.value,
                        })
                      }
                      placeholder="openid email profile"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="callback-url">Callback URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="callback-url"
                      value={selectedProvider.callbackUrl}
                      readOnly
                      className="bg-secondary/50"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          selectedProvider.callbackUrl,
                        )
                      }
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This URL is fixed and must be configured in your identity
                    provider.
                  </p>
                </div>
              </div>

              {/* Attribute Mapping */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-sm font-medium text-foreground">
                  Account Linking & Policies
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="account-linking">
                    Account Linking Policy
                  </Label>
                  <Select
                    value={selectedProvider.accountLinking}
                    onValueChange={(value: AccountLinkingPolicy) =>
                      setSelectedProvider({
                        ...selectedProvider,
                        accountLinking: value,
                      })
                    }
                  >
                    <SelectTrigger id="account-linking">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">
                        Auto-link (automatic on match)
                      </SelectItem>
                      <SelectItem value="manual">
                        Manual (user confirmation required)
                      </SelectItem>
                      <SelectItem value="strict">
                        Strict (admin approval required)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Controls how external identities are linked to existing
                    accounts.
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="mfa-enforced">Require MFA</Label>
                    <p className="text-xs text-muted-foreground">
                      Enforce multi-factor authentication for this provider
                    </p>
                  </div>
                  <Switch
                    id="mfa-enforced"
                    checked={selectedProvider.mfaEnforced}
                    onCheckedChange={(checked) =>
                      setSelectedProvider({
                        ...selectedProvider,
                        mfaEnforced: checked,
                      })
                    }
                  />
                </div>
              </div>

              {/* Allowed Contexts */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-sm font-medium text-foreground">
                  Allowed Contexts
                </h3>
                <div className="flex items-center gap-2 rounded-md bg-secondary/50 px-3 py-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">user</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Only user context is supported for identity providers. Admin
                  and device contexts are not available for external
                  authentication.
                </p>
              </div>

              {!validateConfiguration() && (
                <Alert
                  variant="destructive"
                  className="border-red-500/30 bg-red-500/10"
                >
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-sm text-red-400">
                    Please complete all required fields before enabling this
                    provider.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveConfiguration}
              disabled={!validateConfiguration()}
            >
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Provider Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Identity Provider</DialogTitle>
            <DialogDescription>
              Select the type of identity provider to configure.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <button
              onClick={() => handleAddProvider("social")}
              className="flex items-center gap-4 rounded-lg border border-border p-4 text-left transition-colors hover:bg-secondary/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                <Globe className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">Social Provider</p>
                <p className="text-sm text-muted-foreground">
                  Google, GitHub, Twitter, etc.
                </p>
              </div>
            </button>
            <button
              onClick={() => handleAddProvider("enterprise")}
              className="flex items-center gap-4 rounded-lg border border-border p-4 text-left transition-colors hover:bg-secondary/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                <Building2 className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  Enterprise Provider
                </p>
                <p className="text-sm text-muted-foreground">
                  Azure AD, Okta, OIDC, SAML, etc.
                </p>
              </div>
            </button>
            <button
              onClick={() => handleAddProvider("custom")}
              className="flex items-center gap-4 rounded-lg border border-border p-4 text-left transition-colors hover:bg-secondary/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">Custom Provider</p>
                <p className="text-sm text-muted-foreground">
                  LDAP, Active Directory, custom OIDC, etc.
                </p>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!providerToDelete}
        onOpenChange={() => setProviderToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Provider</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {providerToDelete?.name}? This
              action cannot be undone. Existing linked accounts will remain but
              users will no longer be able to authenticate through this
              provider.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove Provider
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
