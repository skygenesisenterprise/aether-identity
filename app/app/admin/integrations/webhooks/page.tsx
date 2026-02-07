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
import { Checkbox } from "@/components/dashboard/ui/checkbox";
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
  Webhook,
  RefreshCw,
  Plus,
  Settings,
  Trash2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Clock,
  Shield,
  Info,
  History,
  Pause,
  Play,
  Send,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Activity,
  Zap,
  User,
  Key,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

type WebhookStatus = "enabled" | "disabled" | "error";
type DeliveryStatus = "success" | "failed" | "pending" | "retrying";
type RetryPolicy = "none" | "linear" | "exponential";

interface WebhookDelivery {
  id: string;
  timestamp: string;
  event: string;
  status: DeliveryStatus;
  statusCode?: number;
  responseTime: number;
  retryCount: number;
  errorMessage?: string;
}

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  status: WebhookStatus;
  events: string[];
  timeout: number;
  retryPolicy: RetryPolicy;
  maxRetries: number;
  secret: string;
  secretHeader: string;
  lastDelivery?: WebhookDelivery;
  totalDeliveries: number;
  failedDeliveries: number;
  createdAt: string;
}

const availableEvents = [
  { id: "user.created", label: "User Created", category: "User" },
  { id: "user.updated", label: "User Updated", category: "User" },
  { id: "user.deleted", label: "User Deleted", category: "User" },
  { id: "login.success", label: "Login Success", category: "Authentication" },
  { id: "login.failed", label: "Login Failed", category: "Authentication" },
  { id: "logout", label: "Logout", category: "Authentication" },
  { id: "device.registered", label: "Device Registered", category: "Device" },
  {
    id: "device.unregistered",
    label: "Device Unregistered",
    category: "Device",
  },
  {
    id: "credential.issued",
    label: "Credential Issued",
    category: "Credential",
  },
  {
    id: "credential.revoked",
    label: "Credential Revoked",
    category: "Credential",
  },
  { id: "session.created", label: "Session Created", category: "Session" },
  {
    id: "session.terminated",
    label: "Session Terminated",
    category: "Session",
  },
];

const mockDeliveries: WebhookDelivery[] = [
  {
    id: "d-001",
    timestamp: "2024-02-07T09:45:23Z",
    event: "user.created",
    status: "success",
    statusCode: 200,
    responseTime: 245,
    retryCount: 0,
  },
  {
    id: "d-002",
    timestamp: "2024-02-07T09:42:11Z",
    event: "login.success",
    status: "success",
    statusCode: 204,
    responseTime: 189,
    retryCount: 0,
  },
  {
    id: "d-003",
    timestamp: "2024-02-07T09:38:55Z",
    event: "user.updated",
    status: "failed",
    responseTime: 5023,
    retryCount: 3,
    errorMessage: "Connection timeout after 5s",
  },
  {
    id: "d-004",
    timestamp: "2024-02-07T09:35:42Z",
    event: "device.registered",
    status: "success",
    statusCode: 200,
    responseTime: 312,
    retryCount: 0,
  },
  {
    id: "d-005",
    timestamp: "2024-02-07T09:30:18Z",
    event: "credential.issued",
    status: "failed",
    responseTime: 0,
    retryCount: 1,
    errorMessage: "DNS resolution failed",
  },
];

const mockWebhooks: WebhookConfig[] = [
  {
    id: "wh-slack",
    name: "Slack Notifications",
    url: "https://hooks.slack.com/services/T000/B000/XXXX",
    status: "enabled",
    events: ["user.created", "user.deleted", "login.failed"],
    timeout: 5000,
    retryPolicy: "exponential",
    maxRetries: 3,
    secret: "whsec_1234567890abcdef",
    secretHeader: "X-Webhook-Signature",
    lastDelivery: mockDeliveries[0],
    totalDeliveries: 15234,
    failedDeliveries: 23,
    createdAt: "2023-12-01",
  },
  {
    id: "wh-siem",
    name: "SIEM Integration",
    url: "https://siem.company.com/api/webhooks/identity",
    status: "enabled",
    events: ["login.success", "login.failed", "user.created", "user.deleted"],
    timeout: 10000,
    retryPolicy: "linear",
    maxRetries: 5,
    secret: "whsec_fedcba0987654321",
    secretHeader: "X-Webhook-Signature",
    lastDelivery: mockDeliveries[1],
    totalDeliveries: 89234,
    failedDeliveries: 156,
    createdAt: "2023-11-15",
  },
  {
    id: "wh-custom",
    name: "HRIS Sync",
    url: "https://hris.internal.com/webhooks/identity",
    status: "error",
    events: ["user.created", "user.updated", "user.deleted"],
    timeout: 30000,
    retryPolicy: "exponential",
    maxRetries: 5,
    secret: "whsec_hris_secret_key",
    secretHeader: "X-Webhook-Signature",
    lastDelivery: mockDeliveries[2],
    totalDeliveries: 4521,
    failedDeliveries: 89,
    createdAt: "2024-01-10",
  },
  {
    id: "wh-dev",
    name: "Development Endpoint",
    url: "https://dev-ngrok.io/webhook/test",
    status: "disabled",
    events: ["user.created"],
    timeout: 5000,
    retryPolicy: "none",
    maxRetries: 0,
    secret: "whsec_dev_test",
    secretHeader: "X-Webhook-Signature",
    totalDeliveries: 0,
    failedDeliveries: 0,
    createdAt: "2024-02-01",
  },
];

const getEventIcon = (eventId: string) => {
  if (eventId.includes("user")) return User;
  if (eventId.includes("login") || eventId.includes("logout")) return Shield;
  if (eventId.includes("device")) return Smartphone;
  if (eventId.includes("credential")) return Key;
  return Zap;
};

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = React.useState<WebhookConfig[]>(mockWebhooks);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [selectedWebhook, setSelectedWebhook] =
    React.useState<WebhookConfig | null>(null);
  const [isConfigOpen, setIsConfigOpen] = React.useState(false);
  const [webhookToDelete, setWebhookToDelete] =
    React.useState<WebhookConfig | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [showSecret, setShowSecret] = React.useState(false);
  const [showDeliveryLog, setShowDeliveryLog] = React.useState(false);
  const [isNewSecret, setIsNewSecret] = React.useState(false);

  const enabledCount = webhooks.filter((w) => w.status === "enabled").length;
  const errorCount = webhooks.filter((w) => w.status === "error").length;
  const totalCount = webhooks.length;

  const getStatusBadge = (status: WebhookStatus) => {
    const configs = {
      enabled: {
        variant: "default" as const,
        label: "Enabled",
        icon: CheckCircle2,
      },
      disabled: {
        variant: "secondary" as const,
        label: "Disabled",
        icon: Pause,
      },
      error: {
        variant: "destructive" as const,
        label: "Error",
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

  const getDeliveryStatusBadge = (status: DeliveryStatus) => {
    const configs = {
      success: {
        className: "bg-green-500/10 text-green-600 border-green-500/20",
      },
      pending: { className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
      retrying: {
        className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      },
      failed: { className: "bg-red-500/10 text-red-600 border-red-500/20" },
    };
    const config = configs[status];
    return (
      <Badge variant="outline" className={cn("text-xs", config.className)}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const validateUrl = (url: string): string | undefined => {
    if (!url) return "URL is required";
    if (!url.startsWith("https://")) return "URL must use HTTPS";
    try {
      new URL(url);
      return undefined;
    } catch {
      return "Invalid URL format";
    }
  };

  const handleToggleWebhook = (webhookId: string) => {
    setWebhooks((prev) =>
      prev.map((w) => {
        if (w.id !== webhookId) return w;
        const newStatus = w.status === "enabled" ? "disabled" : "enabled";
        return { ...w, status: newStatus };
      }),
    );
    setHasUnsavedChanges(true);
  };

  const handleConfigure = (webhook: WebhookConfig) => {
    setSelectedWebhook({ ...webhook });
    setIsNewSecret(false);
    setShowSecret(false);
    setIsConfigOpen(true);
  };

  const handleAddWebhook = () => {
    const newWebhook: WebhookConfig = {
      id: `wh-${Date.now()}`,
      name: "",
      url: "",
      status: "disabled",
      events: [],
      timeout: 5000,
      retryPolicy: "exponential",
      maxRetries: 3,
      secret: `whsec_${Math.random().toString(36).substring(2, 15)}`,
      secretHeader: "X-Webhook-Signature",
      totalDeliveries: 0,
      failedDeliveries: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setSelectedWebhook(newWebhook);
    setIsNewSecret(true);
    setShowSecret(true);
    setIsAddDialogOpen(false);
    setIsConfigOpen(true);
  };

  const handleSaveConfiguration = () => {
    if (!selectedWebhook) return;

    const urlError = validateUrl(selectedWebhook.url);
    if (urlError) return;

    setWebhooks((prev) => {
      const exists = prev.find((w) => w.id === selectedWebhook.id);
      if (exists) {
        return prev.map((w) =>
          w.id === selectedWebhook.id ? selectedWebhook : w,
        );
      }
      return [...prev, selectedWebhook];
    });
    setIsConfigOpen(false);
    setSelectedWebhook(null);
    setHasUnsavedChanges(true);
  };

  const handleDelete = (webhook: WebhookConfig) => {
    setWebhookToDelete(webhook);
  };

  const confirmDelete = () => {
    if (!webhookToDelete) return;
    setWebhooks((prev) => prev.filter((w) => w.id !== webhookToDelete.id));
    setWebhookToDelete(null);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    setHasUnsavedChanges(false);
  };

  const generateNewSecret = () => {
    if (!selectedWebhook) return;
    setSelectedWebhook({
      ...selectedWebhook,
      secret: `whsec_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
    });
    setIsNewSecret(true);
    setShowSecret(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const validateConfiguration = (): boolean => {
    if (!selectedWebhook) return false;
    if (!selectedWebhook.name.trim()) return false;
    if (validateUrl(selectedWebhook.url)) return false;
    if (selectedWebhook.events.length === 0) return false;
    return true;
  };

  const groupedEvents = availableEvents.reduce(
    (acc, event) => {
      if (!acc[event.category]) acc[event.category] = [];
      acc[event.category].push(event);
      return acc;
    },
    {} as Record<string, typeof availableEvents>,
  );

  return (
    <div className="space-y-6 text-foreground">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-card-foreground">
              Webhooks
            </h1>
            {totalCount === 0 && (
              <Badge variant="secondary" className="text-xs">
                No webhooks configured
              </Badge>
            )}
            {errorCount > 0 && (
              <Badge variant="destructive" className="text-xs gap-1">
                <AlertCircle className="h-3 w-3" />
                {errorCount} errors
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Configure outgoing event notifications sent by Identity.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsAddDialogOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Webhook
          </Button>
          {hasUnsavedChanges && (
            <Button onClick={handleSave} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Save Changes
            </Button>
          )}
        </div>
      </div>

      {/* Webhooks Overview */}
      <section>
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
          Webhooks Overview
        </h2>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                <Webhook className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Webhooks deliver real-time event notifications to external
                  systems when identity-related events occur. They enable
                  integration with SIEMs, notification services, and custom
                  workflows.
                </p>
                <p className="text-sm text-muted-foreground">
                  Webhooks are always delivered asynchronously on a best-effort
                  basis. Receivers should implement idempotency and handle
                  duplicate deliveries gracefully.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Webhook List */}
      <section>
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
          Configured Webhooks
          <span className="ml-2 text-xs normal-case">
            ({enabledCount} active / {totalCount} total)
          </span>
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {webhooks.map((webhook) => {
            const isError = webhook.status === "error";
            const successRate =
              webhook.totalDeliveries > 0
                ? (
                    ((webhook.totalDeliveries - webhook.failedDeliveries) /
                      webhook.totalDeliveries) *
                    100
                  ).toFixed(1)
                : "100";

            return (
              <Card
                key={webhook.id}
                className={cn(
                  "border-border bg-card",
                  webhook.status === "disabled" && "opacity-75",
                  isError && "border-destructive/50",
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary">
                        <Send className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-sm font-medium text-foreground">
                            {webhook.name}
                          </CardTitle>
                        </div>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {webhook.url.replace(/^https:\/\//, "")}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(webhook.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isError && (
                    <Alert
                      variant="destructive"
                      className="border-red-500/30 bg-red-500/10 py-2"
                    >
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <AlertDescription className="text-xs text-red-400">
                        Delivery failures detected. Check endpoint
                        configuration.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Subscribed Events
                      </span>
                      <span className="font-medium">
                        {webhook.events.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Success Rate
                      </span>
                      <span
                        className={cn(
                          "font-medium",
                          parseFloat(successRate) >= 99
                            ? "text-green-600"
                            : "text-amber-600",
                        )}
                      >
                        {successRate}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Total Deliveries
                      </span>
                      <span className="font-medium">
                        {webhook.totalDeliveries.toLocaleString("en-US")}
                      </span>
                    </div>
                  </div>

                  {webhook.lastDelivery && (
                    <div className="flex items-center gap-2 rounded-md bg-secondary/50 px-3 py-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Last delivery:{" "}
                        {getDeliveryStatusBadge(webhook.lastDelivery.status)} •{" "}
                        {webhook.lastDelivery.responseTime}ms
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 rounded-md bg-secondary/50 px-3 py-2">
                    <Lock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Signed with HMAC-SHA256
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`${webhook.id}-toggle`}
                        checked={webhook.status === "enabled"}
                        onCheckedChange={() => handleToggleWebhook(webhook.id)}
                      />
                      <Label
                        htmlFor={`${webhook.id}-toggle`}
                        className="text-sm text-muted-foreground cursor-pointer"
                      >
                        {webhook.status === "enabled" ? "Enabled" : "Disabled"}
                      </Label>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedWebhook(webhook);
                          setShowDeliveryLog(true);
                        }}
                        className="gap-1"
                      >
                        <Activity className="h-3.5 w-3.5" />
                        Deliveries
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleConfigure(webhook)}
                        className="gap-1"
                      >
                        <Settings className="h-3.5 w-3.5" />
                        Configure
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(webhook)}
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

      {/* Delivery Logs */}
      <section>
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
          Recent Deliveries
        </h2>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="space-y-3">
              {mockDeliveries.map((delivery) => {
                const EventIcon = getEventIcon(delivery.event);
                return (
                  <div
                    key={delivery.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30"
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full",
                        delivery.status === "success"
                          ? "bg-green-500/10"
                          : "bg-red-500/10",
                      )}
                    >
                      <EventIcon
                        className={cn(
                          "h-4 w-4",
                          delivery.status === "success"
                            ? "text-green-600"
                            : "text-red-600",
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">
                          {delivery.event}
                        </span>
                        {getDeliveryStatusBadge(delivery.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(delivery.timestamp).toLocaleString("en-US")}
                        {delivery.statusCode &&
                          ` • HTTP ${delivery.statusCode}`}
                        {delivery.responseTime > 0 &&
                          ` • ${delivery.responseTime}ms`}
                        {delivery.retryCount > 0 &&
                          ` • ${delivery.retryCount} retries`}
                      </p>
                      {delivery.errorMessage && (
                        <p className="text-xs text-red-600 mt-1">
                          {delivery.errorMessage}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="flex items-center justify-center pt-2">
                <Button variant="ghost" size="sm" className="gap-2">
                  <History className="h-4 w-4" />
                  View Full Delivery Log
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Safety & Guarantees */}
      <section>
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
          Delivery Guarantees
        </h2>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Signed Payloads
                  </p>
                  <p className="text-xs text-muted-foreground">
                    All webhooks include HMAC-SHA256 signatures for verification
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary">
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    At-Least-Once
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Events are retried until acknowledged or max retries
                    exceeded
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    No Ordering Guarantee
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Events may arrive out of order; use timestamps for
                    sequencing
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
                    Data Exposure
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Webhooks only expose event-related data necessary for the
                    subscribed event type. Sensitive fields like passwords,
                    secrets, and internal identifiers are never included in
                    webhook payloads. Admin and console context events are never
                    sent via webhooks.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-foreground">
                    Secret Management
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Webhook secrets are used to sign payloads and verify
                    authenticity. Secrets are never shown after initial
                    creation. Rotate secrets regularly and store them securely
                    in your receiving system.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-foreground">
                    Audit & Compliance
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    All webhook deliveries, failures, and configuration changes
                    are logged and auditable. Delivery logs include HTTP status
                    codes, response times, and sanitized error messages for
                    troubleshooting.
                  </p>
                </div>

                <div className="rounded-md bg-secondary/50 p-3">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Best Practice:</strong>{" "}
                    Implement idempotency in your webhook receivers using the
                    event ID. Verify signatures before processing payloads.
                    Respond with 2xx status codes to acknowledge successful
                    delivery.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Add Webhook Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Webhook</DialogTitle>
            <DialogDescription>
              Create a new webhook endpoint for receiving event notifications.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert className="border-amber-500/30 bg-amber-500/10">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <AlertDescription className="text-sm text-amber-400">
                New webhooks are created in disabled state. Enable after
                configuration is complete.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddWebhook}>Create Webhook</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Configuration Dialog */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Webhook className="h-5 w-5" />
              {selectedWebhook?.name
                ? `Configure ${selectedWebhook.name}`
                : "Configure Webhook"}
            </DialogTitle>
            <DialogDescription>
              Update webhook settings, event subscriptions, and security
              options.
            </DialogDescription>
          </DialogHeader>

          {selectedWebhook && (
            <div className="space-y-6 py-4">
              {/* Core Settings */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">
                  Core Settings
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="webhook-name">Webhook Name</Label>
                  <Input
                    id="webhook-name"
                    value={selectedWebhook.name}
                    onChange={(e) =>
                      setSelectedWebhook({
                        ...selectedWebhook,
                        name: e.target.value,
                      })
                    }
                    placeholder="e.g., Slack Notifications"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhook-url">Target URL (HTTPS only)</Label>
                  <Input
                    id="webhook-url"
                    value={selectedWebhook.url}
                    onChange={(e) =>
                      setSelectedWebhook({
                        ...selectedWebhook,
                        url: e.target.value,
                      })
                    }
                    placeholder="https://api.example.com/webhook"
                    className={cn(
                      validateUrl(selectedWebhook.url) && "border-destructive",
                    )}
                  />
                  {validateUrl(selectedWebhook.url) && (
                    <p className="text-xs text-destructive">
                      {validateUrl(selectedWebhook.url)}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeout">Timeout (ms)</Label>
                    <Input
                      id="timeout"
                      type="number"
                      value={selectedWebhook.timeout}
                      onChange={(e) =>
                        setSelectedWebhook({
                          ...selectedWebhook,
                          timeout: parseInt(e.target.value) || 5000,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-retries">Max Retries</Label>
                    <Input
                      id="max-retries"
                      type="number"
                      value={selectedWebhook.maxRetries}
                      onChange={(e) =>
                        setSelectedWebhook({
                          ...selectedWebhook,
                          maxRetries: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retry-policy">Retry Policy</Label>
                  <Select
                    value={selectedWebhook.retryPolicy}
                    onValueChange={(value: RetryPolicy) =>
                      setSelectedWebhook({
                        ...selectedWebhook,
                        retryPolicy: value,
                      })
                    }
                  >
                    <SelectTrigger id="retry-policy">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Retries</SelectItem>
                      <SelectItem value="linear">Linear Backoff</SelectItem>
                      <SelectItem value="exponential">
                        Exponential Backoff
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Security */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-sm font-medium text-foreground">
                  Security
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="secret-header">Signature Header</Label>
                  <Input
                    id="secret-header"
                    value={selectedWebhook.secretHeader}
                    readOnly
                    className="bg-secondary/50"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="webhook-secret">Webhook Secret</Label>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSecret(!showSecret)}
                        className="h-6 gap-1"
                      >
                        {showSecret ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                        {showSecret ? "Hide" : "Show"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(selectedWebhook.secret)}
                        className="h-6 gap-1"
                      >
                        <Copy className="h-3 w-3" />
                        Copy
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="webhook-secret"
                      type={showSecret ? "text" : "password"}
                      value={selectedWebhook.secret}
                      readOnly={!isNewSecret}
                      onChange={(e) =>
                        setSelectedWebhook({
                          ...selectedWebhook,
                          secret: e.target.value,
                        })
                      }
                      className="font-mono text-sm"
                    />
                    <Button variant="outline" onClick={generateNewSecret}>
                      Rotate
                    </Button>
                  </div>
                  {isNewSecret && (
                    <p className="text-xs text-amber-600">
                      This secret will only be shown once. Copy it now.
                    </p>
                  )}
                </div>
              </div>

              {/* Event Selection */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">
                    Event Subscriptions
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {selectedWebhook.events.length} selected
                  </span>
                </div>

                <div className="space-y-4">
                  {Object.entries(groupedEvents).map(([category, events]) => (
                    <div key={category}>
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        {category}
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {events.map((event) => (
                          <div
                            key={event.id}
                            className="flex items-center gap-2"
                          >
                            <Checkbox
                              id={`event-${event.id}`}
                              checked={selectedWebhook.events.includes(
                                event.id,
                              )}
                              onCheckedChange={(checked) => {
                                const newEvents = checked
                                  ? [...selectedWebhook.events, event.id]
                                  : selectedWebhook.events.filter(
                                      (e) => e !== event.id,
                                    );
                                setSelectedWebhook({
                                  ...selectedWebhook,
                                  events: newEvents,
                                });
                              }}
                            />
                            <Label
                              htmlFor={`event-${event.id}`}
                              className="text-sm cursor-pointer flex items-center gap-2"
                            >
                              {React.createElement(getEventIcon(event.id), {
                                className: "h-3 w-3 text-muted-foreground",
                              })}
                              {event.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedWebhook.events.length === 0 && (
                  <Alert
                    variant="destructive"
                    className="border-red-500/30 bg-red-500/10"
                  >
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-sm text-red-400">
                      Select at least one event to subscribe to.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
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

      {/* Delivery Log Dialog */}
      <Dialog open={showDeliveryLog} onOpenChange={setShowDeliveryLog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Delivery Log: {selectedWebhook?.name}
            </DialogTitle>
            <DialogDescription>
              Recent delivery attempts and their status.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {mockDeliveries.map((delivery) => {
              const EventIcon = getEventIcon(delivery.event);
              return (
                <div
                  key={delivery.id}
                  className={cn(
                    "p-4 rounded-lg border",
                    delivery.status === "success"
                      ? "border-green-500/20 bg-green-500/5"
                      : "border-red-500/20 bg-red-500/5",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full shrink-0",
                        delivery.status === "success"
                          ? "bg-green-500/10"
                          : "bg-red-500/10",
                      )}
                    >
                      <EventIcon
                        className={cn(
                          "h-4 w-4",
                          delivery.status === "success"
                            ? "text-green-600"
                            : "text-red-600",
                        )}
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          {delivery.event}
                        </span>
                        {getDeliveryStatusBadge(delivery.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(delivery.timestamp).toLocaleString("en-US")} •
                        ID: {delivery.id}
                      </p>
                      <div className="flex items-center gap-4 text-xs">
                        {delivery.statusCode && (
                          <span className="text-muted-foreground">
                            HTTP {delivery.statusCode}
                          </span>
                        )}
                        <span className="text-muted-foreground">
                          {delivery.responseTime}ms
                        </span>
                        {delivery.retryCount > 0 && (
                          <span className="text-amber-600">
                            {delivery.retryCount} retries
                          </span>
                        )}
                      </div>
                      {delivery.errorMessage && (
                        <p className="text-xs text-red-600 mt-2 p-2 bg-red-500/10 rounded">
                          {delivery.errorMessage}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeliveryLog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!webhookToDelete}
        onOpenChange={() => setWebhookToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Webhook</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {webhookToDelete?.name}? This will
              stop all event deliveries to this endpoint. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove Webhook
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
