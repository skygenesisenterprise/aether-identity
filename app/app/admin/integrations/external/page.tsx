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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Globe,
  LogIn,
  UserPlus,
  KeyRound,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Shield,
  Info,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

type IntegrationMode = "internal" | "external" | "hybrid";
type PageStatus = "internal" | "external" | "disabled";

interface PublicPageConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: PageStatus;
  url?: string;
  urlError?: string;
  isValidating?: boolean;
}

const modeDescriptions: Record<IntegrationMode, string> = {
  internal:
    "All public pages are served internally by Identity. No external configuration required.",
  external:
    "All public pages are hosted externally. Requires full external URL configuration.",
  hybrid:
    "Mix of internal and external pages. Configure each page individually.",
};

const modeWarnings: Record<IntegrationMode, string | null> = {
  internal: null,
  external:
    "External mode requires all public pages to be hosted on your own infrastructure. Ensure high availability and security compliance.",
  hybrid:
    "Hybrid mode requires careful configuration. Ensure redirect validation and context enforcement are properly implemented.",
};

export default function ExternalIntegrationsPage() {
  const [mode, setMode] = React.useState<IntegrationMode>("internal");
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [pendingMode, setPendingMode] = React.useState<IntegrationMode | null>(
    null,
  );

  const [pages, setPages] = React.useState<PublicPageConfig[]>([
    {
      id: "login",
      name: "Login Page",
      description: "User authentication entry point",
      icon: LogIn,
      status: "internal",
      url: "",
    },
    {
      id: "register",
      name: "Registration Page",
      description: "New user registration flow",
      icon: UserPlus,
      status: "internal",
      url: "",
    },
    {
      id: "password-reset",
      name: "Password Reset",
      description: "Forgot password and reset flow",
      icon: KeyRound,
      status: "internal",
      url: "",
    },
    {
      id: "consent",
      name: "Consent Page",
      description: "OAuth and permission consent",
      icon: CheckCircle,
      status: "internal",
      url: "",
    },
    {
      id: "error",
      name: "Error & Maintenance",
      description: "Error pages and maintenance mode",
      icon: AlertTriangle,
      status: "internal",
      url: "",
    },
  ]);

  const validateUrl = (url: string): string | undefined => {
    if (!url) return "URL is required for external pages";
    if (!url.startsWith("https://")) return "URL must use HTTPS";
    try {
      new URL(url);
      return undefined;
    } catch {
      return "Invalid URL format";
    }
  };

  const handleModeChange = (newMode: IntegrationMode) => {
    if (newMode === mode) return;
    setPendingMode(newMode);
    setShowConfirmDialog(true);
  };

  const confirmModeChange = () => {
    if (pendingMode) {
      setMode(pendingMode);
      setHasUnsavedChanges(true);
      setShowConfirmDialog(false);
      setPendingMode(null);
    }
  };

  const handlePageStatusChange = (pageId: string, newStatus: PageStatus) => {
    setPages((prev) =>
      prev.map((page) => {
        if (page.id !== pageId) return page;
        const updated = { ...page, status: newStatus };
        if (newStatus === "external" && !page.url) {
          updated.urlError = "URL is required";
        } else {
          updated.urlError = undefined;
        }
        return updated;
      }),
    );
    setHasUnsavedChanges(true);
  };

  const handleUrlChange = (pageId: string, url: string) => {
    setPages((prev) =>
      prev.map((page) => {
        if (page.id !== pageId) return page;
        const error = validateUrl(url);
        return { ...page, url, urlError: error };
      }),
    );
    setHasUnsavedChanges(true);
  };

  const handleTestUrl = async (pageId: string) => {
    setPages((prev) =>
      prev.map((page) =>
        page.id === pageId ? { ...page, isValidating: true } : page,
      ),
    );

    // Simulate URL validation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setPages((prev) =>
      prev.map((page) =>
        page.id === pageId ? { ...page, isValidating: false } : page,
      ),
    );
  };

  const handleSave = () => {
    // Simulate save
    setHasUnsavedChanges(false);
  };

  const getStatusBadge = (status: PageStatus) => {
    const configs = {
      internal: { variant: "default" as const, label: "Internal" },
      external: { variant: "outline" as const, label: "External" },
      disabled: { variant: "secondary" as const, label: "Disabled" },
    };
    const config = configs[status];
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  const getModeBadge = () => {
    const configs = {
      internal: { variant: "default" as const, label: "Internal" },
      external: { variant: "outline" as const, label: "External" },
      hybrid: { variant: "secondary" as const, label: "Hybrid" },
    };
    const config = configs[mode];
    return (
      <Badge variant={config.variant} className="ml-3">
        {config.label}
      </Badge>
    );
  };

  const hasDangerousConfig = () => {
    const externalLogin =
      pages.find((p) => p.id === "login")?.status === "external";
    const internalError =
      pages.find((p) => p.id === "error")?.status === "internal";
    return externalLogin && internalError && mode !== "internal";
  };

  return (
    <div className="space-y-6 text-foreground">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-card-foreground">
              External Integrations
            </h1>
            {getModeBadge()}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Configure external public pages used during authentication flows.
          </p>
        </div>
        {hasUnsavedChanges && (
          <Button onClick={handleSave} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Save Changes
          </Button>
        )}
      </div>

      {/* Danger Warning */}
      {hasDangerousConfig() && (
        <Alert variant="destructive" className="border-red-500/50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Configuration Warning</AlertTitle>
          <AlertDescription>
            External login page is configured without an external error page.
            This may result in inconsistent user experience during failures.
          </AlertDescription>
        </Alert>
      )}

      {/* Section A: Global Mode */}
      <section>
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
          Global Configuration
        </h2>
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base font-medium text-foreground">
                Integration Mode
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {(["internal", "external", "hybrid"] as IntegrationMode[]).map(
                (m) => (
                  <button
                    key={m}
                    onClick={() => handleModeChange(m)}
                    className={cn(
                      "relative flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors hover:bg-secondary/50",
                      mode === m
                        ? "border-primary bg-primary/5"
                        : "border-border",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "h-4 w-4 rounded-full border",
                          mode === m
                            ? "border-primary bg-primary"
                            : "border-muted-foreground",
                        )}
                      >
                        {mode === m && (
                          <div className="m-1 h-2 w-2 rounded-full bg-primary-foreground" />
                        )}
                      </div>
                      <span className="font-medium capitalize">{m}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {modeDescriptions[m]}
                    </p>
                  </button>
                ),
              )}
            </div>

            {modeWarnings[mode] && (
              <Alert className="border-amber-500/30 bg-amber-500/10">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <AlertDescription className="text-amber-400">
                  {modeWarnings[mode]}
                </AlertDescription>
              </Alert>
            )}

            {showConfirmDialog && (
              <div className="rounded-lg border border-border bg-secondary/50 p-4">
                <p className="text-sm text-foreground mb-3">
                  Changing the integration mode will affect how users access
                  public pages. This action will be logged for audit purposes.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={confirmModeChange}>
                    Confirm Change
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setShowConfirmDialog(false);
                      setPendingMode(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Section B: Public Pages Configuration */}
      <section>
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
          Public Pages Configuration
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {pages.map((page) => {
            const Icon = page.icon;
            const showUrlField =
              mode === "external" ||
              (mode === "hybrid" && page.status === "external");

            return (
              <Card
                key={page.id}
                className={cn(
                  "border-border bg-card",
                  page.status === "disabled" && "opacity-75",
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-medium text-foreground">
                          {page.name}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {page.description}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(page.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mode === "hybrid" && (
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor={`${page.id}-toggle`}
                        className="text-sm text-muted-foreground"
                      >
                        Use External Page
                      </Label>
                      <Switch
                        id={`${page.id}-toggle`}
                        checked={page.status === "external"}
                        onCheckedChange={(checked) =>
                          handlePageStatusChange(
                            page.id,
                            checked ? "external" : "internal",
                          )
                        }
                      />
                    </div>
                  )}

                  {showUrlField && (
                    <div className="space-y-2">
                      <Label
                        htmlFor={`${page.id}-url`}
                        className="text-xs text-muted-foreground"
                      >
                        External URL
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id={`${page.id}-url`}
                          type="url"
                          placeholder="https://auth.example.com/login"
                          value={page.url}
                          onChange={(e) =>
                            handleUrlChange(page.id, e.target.value)
                          }
                          className={cn(
                            "flex-1",
                            page.urlError && "border-destructive",
                          )}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleTestUrl(page.id)}
                          disabled={!!page.urlError || !page.url}
                          className="shrink-0"
                        >
                          {page.isValidating ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <ExternalLink className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {page.urlError && (
                        <p className="text-xs text-destructive">
                          {page.urlError}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 rounded-md bg-secondary/50 px-3 py-2">
                    <Shield className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Context: user scope only
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Section C: Security & Flow Notes */}
      <section>
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
          Security & Flow Information
        </h2>
        <Card className="border-border bg-card">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-3 flex-1">
                <div>
                  <h4 className="text-sm font-medium text-foreground">
                    Redirect Validation
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    All redirect URLs are validated against a whitelist of
                    allowed domains. Wildcard redirects are not permitted. Each
                    external page must be explicitly configured and verified.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-foreground">
                    Context Enforcement
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Public pages operate strictly within the user context scope.
                    Admin and console contexts are never allowed for external
                    page configurations. Context elevation is blocked at the API
                    level.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-foreground">
                    Token-Based Flow Security
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Authentication flows use cryptographically signed flow
                    tokens (flow_token) that bind the session to the originating
                    request. Tokens are single-use and time-bound to prevent
                    replay attacks.
                  </p>
                </div>

                <div className="rounded-md bg-secondary/50 p-3">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Audit Logging:</strong>{" "}
                    All changes to external integration settings are logged with
                    administrator identification, timestamp, and change details.
                    Configuration history is retained for 90 days.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
