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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dashboard/ui/dropdown-menu";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/dashboard/ui/progress";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ContextOverview } from "@/components/dashboard/context-overview";
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
  MoreVertical,
  Globe,
  Bell,
  ArrowRight,
  Filter,
  Search,
  BarChart3,
  Terminal,
  FileJson,
  ExternalLink,
  RotateCcw,
  TestTube,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

type WebhookStatus = "active" | "paused" | "error" | "disabled";
type DeliveryStatus = "success" | "failed" | "pending" | "retrying";
type RetryPolicy = "none" | "linear" | "exponential";
type EventCategory =
  | "User"
  | "Authentication"
  | "Device"
  | "Credential"
  | "Session";

interface WebhookDelivery {
  id: string;
  endpointId: string;
  timestamp: string;
  event: string;
  eventCategory: EventCategory;
  status: DeliveryStatus;
  statusCode?: number;
  responseTime: number;
  retryCount: number;
  errorMessage?: string;
  payload?: string;
  requestHeaders?: Record<string, string>;
  responseBody?: string;
}

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  status: WebhookStatus;
  events: string[];
  eventCategories: EventCategory[];
  timeout: number;
  retryPolicy: RetryPolicy;
  maxRetries: number;
  secret: string;
  secretHeader: string;
  createdAt: string;
  updatedAt: string;
  // Metrics
  totalDeliveries: number;
  failedDeliveries: number;
  avgResponseTime: number;
  successRate: number;
  lastDelivery?: WebhookDelivery;
  // Health
  healthStatus: "healthy" | "degraded" | "critical";
  consecutiveFailures: number;
}

interface WebhookMetrics {
  totalEndpoints: number;
  activeEndpoints: number;
  errorEndpoints: number;
  totalDeliveries24h: number;
  successRate24h: number;
  avgLatency24h: number;
  eventsPerMinute: number;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockDeliveries: WebhookDelivery[] = [
  {
    id: "d-001",
    endpointId: "wh-slack",
    timestamp: "2024-02-07T09:45:23Z",
    event: "user.created",
    eventCategory: "User",
    status: "success",
    statusCode: 200,
    responseTime: 245,
    retryCount: 0,
    payload: '{"userId": "usr_123", "email": "john@example.com"}',
    requestHeaders: {
      "Content-Type": "application/json",
      "X-Webhook-Signature": "sha256=abc123...",
    },
    responseBody: '{"ok": true}',
  },
  {
    id: "d-002",
    endpointId: "wh-siem",
    timestamp: "2024-02-07T09:44:18Z",
    event: "login.success",
    eventCategory: "Authentication",
    status: "success",
    statusCode: 204,
    responseTime: 189,
    retryCount: 0,
    payload: '{"userId": "usr_456", "ip": "192.168.1.100"}',
    requestHeaders: {
      "Content-Type": "application/json",
      "X-Webhook-Signature": "sha256=def456...",
    },
  },
  {
    id: "d-003",
    endpointId: "wh-hris",
    timestamp: "2024-02-07T09:42:55Z",
    event: "user.updated",
    eventCategory: "User",
    status: "failed",
    responseTime: 5023,
    retryCount: 3,
    errorMessage: "Connection timeout after 5s",
    payload: '{"userId": "usr_789", "changes": ["email"]}',
    requestHeaders: {
      "Content-Type": "application/json",
      "X-Webhook-Signature": "sha256=ghi789...",
    },
  },
  {
    id: "d-004",
    endpointId: "wh-siem",
    timestamp: "2024-02-07T09:41:42Z",
    event: "device.registered",
    eventCategory: "Device",
    status: "success",
    statusCode: 200,
    responseTime: 312,
    retryCount: 0,
    payload: '{"deviceId": "dev_abc", "userId": "usr_123"}',
    requestHeaders: {
      "Content-Type": "application/json",
      "X-Webhook-Signature": "sha256=jkl012...",
    },
    responseBody: '{"received": true}',
  },
  {
    id: "d-005",
    endpointId: "wh-slack",
    timestamp: "2024-02-07T09:38:18Z",
    event: "credential.issued",
    eventCategory: "Credential",
    status: "retrying",
    responseTime: 1200,
    retryCount: 2,
    payload: '{"credentialId": "cred_xyz"}',
    requestHeaders: {
      "Content-Type": "application/json",
      "X-Webhook-Signature": "sha256=mno345...",
    },
  },
  {
    id: "d-006",
    endpointId: "wh-siem",
    timestamp: "2024-02-07T09:35:12Z",
    event: "session.created",
    eventCategory: "Session",
    status: "success",
    statusCode: 200,
    responseTime: 178,
    retryCount: 0,
    payload: '{"sessionId": "sess_001", "userId": "usr_456"}',
    requestHeaders: {
      "Content-Type": "application/json",
      "X-Webhook-Signature": "sha256=pqr678...",
    },
    responseBody: '{"processed": true}',
  },
];

const mockEndpoints: WebhookEndpoint[] = [
  {
    id: "wh-slack",
    name: "Slack Notifications",
    url: "https://hooks.slack.com/services/T000/B000/XXXX",
    status: "active",
    events: ["user.created", "user.deleted", "login.failed"],
    eventCategories: ["User", "Authentication"],
    timeout: 5000,
    retryPolicy: "exponential",
    maxRetries: 3,
    secret: "whsec_1234567890abcdef",
    secretHeader: "X-Webhook-Signature",
    createdAt: "2023-12-01",
    updatedAt: "2024-02-01",
    totalDeliveries: 15234,
    failedDeliveries: 23,
    avgResponseTime: 245,
    successRate: 99.8,
    lastDelivery: mockDeliveries[0],
    healthStatus: "healthy",
    consecutiveFailures: 0,
  },
  {
    id: "wh-siem",
    name: "SIEM Integration",
    url: "https://siem.company.com/api/webhooks/identity",
    status: "active",
    events: [
      "login.success",
      "login.failed",
      "user.created",
      "user.deleted",
      "device.registered",
    ],
    eventCategories: ["Authentication", "User", "Device"],
    timeout: 10000,
    retryPolicy: "linear",
    maxRetries: 5,
    secret: "whsec_fedcba0987654321",
    secretHeader: "X-Webhook-Signature",
    createdAt: "2023-11-15",
    updatedAt: "2024-02-05",
    totalDeliveries: 89234,
    failedDeliveries: 156,
    avgResponseTime: 312,
    successRate: 99.7,
    lastDelivery: mockDeliveries[1],
    healthStatus: "healthy",
    consecutiveFailures: 0,
  },
  {
    id: "wh-hris",
    name: "HRIS Sync",
    url: "https://hris.internal.com/webhooks/identity",
    status: "error",
    events: ["user.created", "user.updated", "user.deleted"],
    eventCategories: ["User"],
    timeout: 30000,
    retryPolicy: "exponential",
    maxRetries: 5,
    secret: "whsec_hris_secret_key",
    secretHeader: "X-Webhook-Signature",
    createdAt: "2024-01-10",
    updatedAt: "2024-02-06",
    totalDeliveries: 4521,
    failedDeliveries: 89,
    avgResponseTime: 5234,
    successRate: 78.5,
    lastDelivery: mockDeliveries[2],
    healthStatus: "critical",
    consecutiveFailures: 15,
  },
  {
    id: "wh-dev",
    name: "Development Endpoint",
    url: "https://dev-ngrok.io/webhook/test",
    status: "paused",
    events: ["user.created"],
    eventCategories: ["User"],
    timeout: 5000,
    retryPolicy: "none",
    maxRetries: 0,
    secret: "whsec_dev_test",
    secretHeader: "X-Webhook-Signature",
    createdAt: "2024-02-01",
    updatedAt: "2024-02-07",
    totalDeliveries: 0,
    failedDeliveries: 0,
    avgResponseTime: 0,
    successRate: 0,
    healthStatus: "healthy",
    consecutiveFailures: 0,
  },
];

const mockMetrics: WebhookMetrics = {
  totalEndpoints: 4,
  activeEndpoints: 2,
  errorEndpoints: 1,
  totalDeliveries24h: 8947,
  successRate24h: 99.2,
  avgLatency24h: 267,
  eventsPerMinute: 6.2,
};

// Format number consistently for SSR/CSR
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const availableEvents = [
  {
    id: "user.created",
    label: "User Created",
    category: "User" as EventCategory,
  },
  {
    id: "user.updated",
    label: "User Updated",
    category: "User" as EventCategory,
  },
  {
    id: "user.deleted",
    label: "User Deleted",
    category: "User" as EventCategory,
  },
  {
    id: "login.success",
    label: "Login Success",
    category: "Authentication" as EventCategory,
  },
  {
    id: "login.failed",
    label: "Login Failed",
    category: "Authentication" as EventCategory,
  },
  {
    id: "logout",
    label: "Logout",
    category: "Authentication" as EventCategory,
  },
  {
    id: "device.registered",
    label: "Device Registered",
    category: "Device" as EventCategory,
  },
  {
    id: "device.unregistered",
    label: "Device Unregistered",
    category: "Device" as EventCategory,
  },
  {
    id: "credential.issued",
    label: "Credential Issued",
    category: "Credential" as EventCategory,
  },
  {
    id: "credential.revoked",
    label: "Credential Revoked",
    category: "Credential" as EventCategory,
  },
  {
    id: "session.created",
    label: "Session Created",
    category: "Session" as EventCategory,
  },
  {
    id: "session.terminated",
    label: "Session Terminated",
    category: "Session" as EventCategory,
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getEventIcon = (category: EventCategory) => {
  switch (category) {
    case "User":
      return User;
    case "Authentication":
      return Shield;
    case "Device":
      return Smartphone;
    case "Credential":
      return Key;
    case "Session":
      return Globe;
    default:
      return Zap;
  }
};

const getStatusConfig = (status: WebhookStatus) => {
  const configs = {
    active: {
      variant: "default" as const,
      label: "Active",
      icon: Play,
      color: "text-green-600",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    paused: {
      variant: "secondary" as const,
      label: "Paused",
      icon: Pause,
      color: "text-amber-600",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    error: {
      variant: "destructive" as const,
      label: "Error",
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
    },
    disabled: {
      variant: "outline" as const,
      label: "Disabled",
      icon: AlertTriangle,
      color: "text-muted-foreground",
      bgColor: "bg-secondary",
      borderColor: "border-border",
    },
  };
  return configs[status];
};

const getDeliveryStatusConfig = (status: DeliveryStatus) => {
  const configs = {
    success: {
      className: "bg-green-500/10 text-green-600 border-green-500/20",
      icon: CheckCircle2,
    },
    pending: {
      className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      icon: Clock,
    },
    retrying: {
      className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      icon: RefreshCw,
    },
    failed: {
      className: "bg-red-500/10 text-red-600 border-red-500/20",
      icon: AlertCircle,
    },
  };
  return configs[status];
};

const getHealthStatusConfig = (status: WebhookEndpoint["healthStatus"]) => {
  const configs = {
    healthy: {
      color: "text-green-600",
      bgColor: "bg-green-500/10",
      label: "Healthy",
      icon: CheckCircle2,
    },
    degraded: {
      color: "text-amber-600",
      bgColor: "bg-amber-500/10",
      label: "Degraded",
      icon: AlertTriangle,
    },
    critical: {
      color: "text-red-600",
      bgColor: "bg-red-500/10",
      label: "Critical",
      icon: AlertCircle,
    },
  };
  return configs[status];
};

const formatRelativeTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

// ============================================================================
// COMPONENTS
// ============================================================================

function EndpointCard({
  endpoint,
  onConfigure,
  onToggle,
  onDelete,
  onViewDeliveries,
  onTest,
}: {
  endpoint: WebhookEndpoint;
  onConfigure: (endpoint: WebhookEndpoint) => void;
  onToggle: (id: string) => void;
  onDelete: (endpoint: WebhookEndpoint) => void;
  onViewDeliveries: (endpoint: WebhookEndpoint) => void;
  onTest: (endpoint: WebhookEndpoint) => void;
}) {
  const statusConfig = getStatusConfig(endpoint.status);
  const healthConfig = getHealthStatusConfig(endpoint.healthStatus);
  const StatusIcon = statusConfig.icon;
  const HealthIcon = healthConfig.icon;

  return (
    <Card
      className={cn(
        "group border-border bg-card transition-all duration-200",
        endpoint.status === "error" && "border-red-500/30 shadow-red-500/5",
        endpoint.status === "paused" && "opacity-75",
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                statusConfig.bgColor,
              )}
            >
              <Send className={cn("h-5 w-5", statusConfig.color)} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-medium text-foreground truncate">
                  {endpoint.name}
                </CardTitle>
                {endpoint.status === "error" && (
                  <Badge variant="destructive" className="text-xs shrink-0">
                    Action Required
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {endpoint.url.replace(/^https:\/\//, "")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "text-xs gap-1",
                statusConfig.bgColor,
                statusConfig.color,
                statusConfig.borderColor,
              )}
            >
              <StatusIcon className="h-3 w-3" />
              {statusConfig.label}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onConfigure(endpoint)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewDeliveries(endpoint)}>
                  <Activity className="h-4 w-4 mr-2" />
                  View Deliveries
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onTest(endpoint)}>
                  <TestTube className="h-4 w-4 mr-2" />
                  Test Endpoint
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onToggle(endpoint.id)}
                  className={
                    endpoint.status === "active"
                      ? "text-amber-600"
                      : "text-green-600"
                  }
                >
                  {endpoint.status === "active" ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause Webhook
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Resume Webhook
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(endpoint)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Health & Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <HealthIcon className={cn("h-3.5 w-3.5", healthConfig.color)} />
              <span className={cn("text-xs font-medium", healthConfig.color)}>
                {healthConfig.label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {endpoint.consecutiveFailures > 0
                ? `${endpoint.consecutiveFailures} consecutive failures`
                : "No recent issues"}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">
                {endpoint.successRate}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(endpoint.totalDeliveries)} total deliveries
            </p>
          </div>
        </div>

        {/* Performance Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Success Rate</span>
            <span
              className={cn(
                "font-medium",
                endpoint.successRate >= 99
                  ? "text-green-600"
                  : endpoint.successRate >= 95
                    ? "text-amber-600"
                    : "text-red-600",
              )}
            >
              {endpoint.successRate}%
            </span>
          </div>
          <Progress value={endpoint.successRate} className="h-1.5" />
        </div>

        {/* Event Categories */}
        <div className="flex flex-wrap gap-1.5">
          {endpoint.eventCategories.map((category) => {
            const Icon = getEventIcon(category);
            return (
              <Badge
                key={category}
                variant="secondary"
                className="text-xs gap-1 font-normal"
              >
                <Icon className="h-3 w-3" />
                {category}
              </Badge>
            );
          })}
          {endpoint.events.length > endpoint.eventCategories.length * 2 && (
            <Badge variant="outline" className="text-xs font-normal">
              +{endpoint.events.length - endpoint.eventCategories.length * 2}{" "}
              more
            </Badge>
          )}
        </div>

        {/* Last Delivery */}
        {endpoint.lastDelivery && endpoint.status !== "disabled" && (
          <div className="flex items-center gap-3 p-2.5 rounded-md bg-secondary/50">
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full shrink-0",
                endpoint.lastDelivery.status === "success"
                  ? "bg-green-500/10"
                  : "bg-red-500/10",
              )}
            >
              {React.createElement(
                getEventIcon(endpoint.lastDelivery.eventCategory),
                {
                  className: cn(
                    "h-3.5 w-3.5",
                    endpoint.lastDelivery.status === "success"
                      ? "text-green-600"
                      : "text-red-600",
                  ),
                },
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium truncate">
                  {endpoint.lastDelivery.event}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(endpoint.lastDelivery.timestamp)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{endpoint.lastDelivery.responseTime}ms</span>
                {endpoint.lastDelivery.statusCode && (
                  <span>• HTTP {endpoint.lastDelivery.statusCode}</span>
                )}
              </div>
            </div>
            {getDeliveryStatusBadge(endpoint.lastDelivery.status)}
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <Switch
              id={`${endpoint.id}-toggle`}
              checked={endpoint.status === "active"}
              onCheckedChange={() => onToggle(endpoint.id)}
              disabled={endpoint.status === "error"}
            />
            <Label
              htmlFor={`${endpoint.id}-toggle`}
              className="text-sm text-muted-foreground cursor-pointer"
            >
              {endpoint.status === "active" ? "Enabled" : "Disabled"}
            </Label>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDeliveries(endpoint)}
              className="h-8 text-xs"
            >
              <Activity className="h-3.5 w-3.5 mr-1" />
              Logs
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onConfigure(endpoint)}
              className="h-8 text-xs"
            >
              <Settings className="h-3.5 w-3.5 mr-1" />
              Configure
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getDeliveryStatusBadge(status: DeliveryStatus) {
  const config = getDeliveryStatusConfig(status);
  return (
    <Badge variant="outline" className={cn("text-xs", config.className)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function DeliveryRow({
  delivery,
  showEndpoint = false,
  endpoints = [],
}: {
  delivery: WebhookDelivery;
  showEndpoint?: boolean;
  endpoints?: WebhookEndpoint[];
}) {
  const eventIconConfig = getEventIcon(delivery.eventCategory);
  const endpoint = endpoints.find((e) => e.id === delivery.endpointId);

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer">
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full shrink-0 mt-0.5",
          delivery.status === "success" ? "bg-green-500/10" : "bg-red-500/10",
        )}
      >
        {React.createElement(eventIconConfig, {
          className: cn(
            "h-4 w-4",
            delivery.status === "success" ? "text-green-600" : "text-red-600",
          ),
        })}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium">{delivery.event}</span>
          {getDeliveryStatusBadge(delivery.status)}
          {showEndpoint && endpoint && (
            <Badge variant="outline" className="text-xs font-normal">
              <Send className="h-3 w-3 mr-1" />
              {endpoint.name}
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(delivery.timestamp)}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
          {delivery.statusCode && <span>HTTP {delivery.statusCode}</span>}
          <span>{delivery.responseTime}ms</span>
          {delivery.retryCount > 0 && (
            <span className="text-amber-600">
              {delivery.retryCount} retries
            </span>
          )}
        </div>
        {delivery.errorMessage && (
          <p className="text-xs text-red-600 mt-1.5 p-2 bg-red-500/10 rounded">
            {delivery.errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function WebhooksPage() {
  const [endpoints, setEndpoints] =
    React.useState<WebhookEndpoint[]>(mockEndpoints);
  const [metrics] = React.useState<WebhookMetrics>(mockMetrics);
  const [selectedEndpoint, setSelectedEndpoint] =
    React.useState<WebhookEndpoint | null>(null);
  const [isConfigOpen, setIsConfigOpen] = React.useState(false);
  const [endpointToDelete, setEndpointToDelete] =
    React.useState<WebhookEndpoint | null>(null);
  const [showDeliveries, setShowDeliveries] = React.useState(false);
  const [showSecret, setShowSecret] = React.useState(false);
  const [isNewSecret, setIsNewSecret] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<WebhookStatus | "all">(
    "all",
  );

  // Filter endpoints
  const filteredEndpoints = React.useMemo(() => {
    return endpoints.filter((endpoint) => {
      const matchesSearch =
        endpoint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        endpoint.url.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || endpoint.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [endpoints, searchQuery, statusFilter]);

  // Stats
  const hasErrors = endpoints.some((e) => e.status === "error");

  // Handlers
  const handleToggle = (id: string) => {
    setEndpoints((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        const newStatus = e.status === "active" ? "paused" : "active";
        return { ...e, status: newStatus };
      }),
    );
  };

  const handleConfigure = (endpoint: WebhookEndpoint) => {
    setSelectedEndpoint({ ...endpoint });
    setIsNewSecret(false);
    setShowSecret(false);
    setIsConfigOpen(true);
  };

  const handleAdd = () => {
    const newEndpoint: WebhookEndpoint = {
      id: `wh-${Date.now()}`,
      name: "",
      url: "",
      status: "disabled",
      events: [],
      eventCategories: [],
      timeout: 5000,
      retryPolicy: "exponential",
      maxRetries: 3,
      secret: `whsec_${Math.random().toString(36).substring(2, 15)}`,
      secretHeader: "X-Webhook-Signature",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalDeliveries: 0,
      failedDeliveries: 0,
      avgResponseTime: 0,
      successRate: 0,
      healthStatus: "healthy",
      consecutiveFailures: 0,
    };
    setSelectedEndpoint(newEndpoint);
    setIsNewSecret(true);
    setShowSecret(true);
    setIsConfigOpen(true);
  };

  const handleSave = () => {
    if (!selectedEndpoint) return;
    setEndpoints((prev) => {
      const exists = prev.find((e) => e.id === selectedEndpoint.id);
      if (exists) {
        return prev.map((e) =>
          e.id === selectedEndpoint.id
            ? { ...selectedEndpoint, updatedAt: new Date().toISOString() }
            : e,
        );
      }
      return [...prev, selectedEndpoint];
    });
    setIsConfigOpen(false);
    setSelectedEndpoint(null);
  };

  const handleDelete = () => {
    if (!endpointToDelete) return;
    setEndpoints((prev) => prev.filter((e) => e.id !== endpointToDelete.id));
    setEndpointToDelete(null);
  };

  const handleViewDeliveries = (endpoint: WebhookEndpoint) => {
    setSelectedEndpoint(endpoint);
    setShowDeliveries(true);
  };

  const handleTest = (endpoint: WebhookEndpoint) => {
    // Mock test functionality
    alert(
      `Testing webhook: ${endpoint.name}\nSending test payload to ${endpoint.url}`,
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

  const generateNewSecret = () => {
    if (!selectedEndpoint) return;
    setSelectedEndpoint({
      ...selectedEndpoint,
      secret: `whsec_${Math.random().toString(36).substring(2, 15)}${Math.random()
        .toString(36)
        .substring(2, 15)}`,
    });
    setIsNewSecret(true);
    setShowSecret(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const groupedEvents = availableEvents.reduce(
    (acc, event) => {
      if (!acc[event.category]) acc[event.category] = [];
      acc[event.category].push(event);
      return acc;
    },
    {} as Record<EventCategory, typeof availableEvents>,
  );

  return (
    <div className="space-y-6 text-foreground">
      {/* =========================================================================
          HEADER SECTION
          Context and metrics overview
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-card-foreground">
              Identity Webhooks
            </h1>
            {hasErrors && (
              <Badge variant="destructive" className="text-xs gap-1">
                <AlertCircle className="h-3 w-3" />
                {endpoints.filter((e) => e.status === "error").length} errors
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time event notifications for external integrations and
            workflows
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Endpoint
          </Button>
        </div>
      </div>

      <ContextOverview
        authority="Acme Corporation"
        workspace="Production"
        role="Identity Administrator"
        accessLevel="Full webhook management"
        isPrivileged={true}
        lastLogin="Today, 9:42 AM"
      />

      {/* =========================================================================
          SECTION 1: PLATFORM HEALTH
          Critical system metrics and alerts
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-2 w-2 rounded-full animate-pulse",
              hasErrors ? "bg-red-500" : "bg-green-500",
            )}
          />
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Platform Health
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Active Endpoints"
            value={metrics.activeEndpoints}
            subtitle={`${metrics.totalEndpoints} total configured`}
            icon={Webhook}
            trend={{
              value: metrics.activeEndpoints,
              isPositive: metrics.activeEndpoints > 0,
            }}
            variant={hasErrors ? "destructive" : "default"}
          />
          <MetricCard
            title="24h Success Rate"
            value={`${metrics.successRate24h}%`}
            subtitle={`${formatNumber(metrics.totalDeliveries24h)} deliveries`}
            icon={CheckCircle2}
            trend={{
              value: 0.5,
              isPositive: true,
            }}
            variant={metrics.successRate24h >= 99 ? "default" : "warning"}
          />
          <MetricCard
            title="Avg Latency"
            value={`${metrics.avgLatency24h}ms`}
            subtitle="Last 24 hours"
            icon={Clock}
            trend={{
              value: 12,
              isPositive: false,
            }}
            variant="accent"
          />
          <MetricCard
            title="Events/min"
            value={metrics.eventsPerMinute}
            subtitle="Current throughput"
            icon={Zap}
            trend={{
              value: 0.8,
              isPositive: true,
            }}
          />
        </div>

        {hasErrors && (
          <Alert
            variant="destructive"
            className="border-red-500/30 bg-red-500/10"
          >
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertTitle className="text-red-400">
              Webhook Errors Detected
            </AlertTitle>
            <AlertDescription className="text-red-400/80">
              {endpoints.filter((e) => e.status === "error").length} endpoint(s)
              experiencing delivery failures. Check endpoint configuration and
              receiver status.
            </AlertDescription>
          </Alert>
        )}
      </section>

      {/* =========================================================================
          SECTION 2: ENDPOINTS MANAGEMENT
          List of configured webhooks with filtering
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Configured Endpoints
            <span className="ml-2 text-xs normal-case text-muted-foreground">
              ({filteredEndpoints.length} of {endpoints.length})
            </span>
          </h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search endpoints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-[200px]"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as WebhookStatus | "all")}
            >
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredEndpoints.map((endpoint) => (
            <EndpointCard
              key={endpoint.id}
              endpoint={endpoint}
              onConfigure={handleConfigure}
              onToggle={handleToggle}
              onDelete={setEndpointToDelete}
              onViewDeliveries={handleViewDeliveries}
              onTest={handleTest}
            />
          ))}
          {filteredEndpoints.length === 0 && (
            <Card className="col-span-full border-dashed border-2 border-border bg-card/50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary mb-4">
                  <Webhook className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-medium text-foreground mb-1">
                  No endpoints found
                </h3>
                <p className="text-xs text-muted-foreground text-center max-w-xs">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Configure your first webhook to start receiving real-time events"}
                </p>
                {!searchQuery && statusFilter === "all" && (
                  <Button onClick={handleAdd} className="mt-4 gap-2">
                    <Plus className="h-4 w-4" />
                    Add First Endpoint
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: EVENT STREAM
          Recent deliveries with real-time feel and endpoint context
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Recent Deliveries
            </h2>
            <Badge variant="secondary" className="text-xs">
              {mockDeliveries.length} total
            </Badge>
          </div>
          <Button variant="ghost" size="sm" className="gap-2">
            <Activity className="h-4 w-4" />
            View Full Log
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>

        {/* Delivery Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="border-border bg-card">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-500/10">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    {
                      mockDeliveries.filter((d) => d.status === "success")
                        .length
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">Successful</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-red-500/10">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    {mockDeliveries.filter((d) => d.status === "failed").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Failed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-500/10">
                  <RefreshCw className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    {
                      mockDeliveries.filter((d) => d.status === "retrying")
                        .length
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">Retrying</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500/10">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    {Math.round(
                      mockDeliveries.reduce(
                        (acc, d) => acc + d.responseTime,
                        0,
                      ) / mockDeliveries.length,
                    )}
                    ms
                  </p>
                  <p className="text-xs text-muted-foreground">Avg Latency</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Latest Activity
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-muted-foreground">Live</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {mockDeliveries.slice(0, 5).map((delivery) => (
                <DeliveryRow
                  key={delivery.id}
                  delivery={delivery}
                  showEndpoint
                  endpoints={endpoints}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* =========================================================================
          SECTION 4: QUICK REFERENCE
          Documentation and best practices
          ========================================================================= */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Quick Reference
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardTitle className="text-sm font-medium">Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" />
                  <span>All payloads signed with HMAC-SHA256</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" />
                  <span>Secrets never exposed after creation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" />
                  <span>HTTPS-only endpoint validation</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary">
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardTitle className="text-sm font-medium">
                  Reliability
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" />
                  <span>At-least-once delivery guarantee</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" />
                  <span>Automatic retries with backoff</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" />
                  <span>Timeout and circuit breaker protection</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary">
                  <Terminal className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardTitle className="text-sm font-medium">
                  Integration
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Info className="h-3.5 w-3.5 text-blue-600 mt-0.5 shrink-0" />
                  <span>Implement idempotency with event IDs</span>
                </li>
                <li className="flex items-start gap-2">
                  <Info className="h-3.5 w-3.5 text-blue-600 mt-0.5 shrink-0" />
                  <span>Verify signatures before processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <Info className="h-3.5 w-3.5 text-blue-600 mt-0.5 shrink-0" />
                  <span>Return 2xx to acknowledge delivery</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* =========================================================================
          DIALOGS
          ========================================================================= */}

      {/* Configuration Dialog */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {selectedEndpoint?.id.startsWith("wh-") && !selectedEndpoint?.name
                ? "Configure New Endpoint"
                : `Configure ${selectedEndpoint?.name}`}
            </DialogTitle>
            <DialogDescription>
              Manage endpoint settings, event subscriptions, and security
              options.
            </DialogDescription>
          </DialogHeader>

          {selectedEndpoint && (
            <div className="space-y-6 py-4">
              {/* New Endpoint Alert */}
              {selectedEndpoint.totalDeliveries === 0 && (
                <Alert className="border-blue-500/30 bg-blue-500/10">
                  <Info className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-sm text-blue-400">
                    Configure this new endpoint with a name, URL, and event
                    subscriptions. The endpoint will be created in disabled
                    state for security.
                  </AlertDescription>
                </Alert>
              )}

              {/* Core Settings */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  Endpoint Configuration
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="webhook-name">Endpoint Name</Label>
                  <Input
                    id="webhook-name"
                    value={selectedEndpoint.name}
                    onChange={(e) =>
                      setSelectedEndpoint({
                        ...selectedEndpoint,
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
                    value={selectedEndpoint.url}
                    onChange={(e) =>
                      setSelectedEndpoint({
                        ...selectedEndpoint,
                        url: e.target.value,
                      })
                    }
                    placeholder="https://api.example.com/webhook"
                    className={cn(
                      validateUrl(selectedEndpoint.url) && "border-destructive",
                    )}
                  />
                  {validateUrl(selectedEndpoint.url) && (
                    <p className="text-xs text-destructive">
                      {validateUrl(selectedEndpoint.url)}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeout">Timeout (ms)</Label>
                    <Input
                      id="timeout"
                      type="number"
                      value={selectedEndpoint.timeout}
                      onChange={(e) =>
                        setSelectedEndpoint({
                          ...selectedEndpoint,
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
                      value={selectedEndpoint.maxRetries}
                      onChange={(e) =>
                        setSelectedEndpoint({
                          ...selectedEndpoint,
                          maxRetries: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retry-policy">Retry Policy</Label>
                  <Select
                    value={selectedEndpoint.retryPolicy}
                    onValueChange={(value: RetryPolicy) =>
                      setSelectedEndpoint({
                        ...selectedEndpoint,
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
                <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  Security
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="secret-header">Signature Header</Label>
                  <Input
                    id="secret-header"
                    value={selectedEndpoint.secretHeader}
                    readOnly
                    className="bg-secondary/50 font-mono text-sm"
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
                        onClick={() => copyToClipboard(selectedEndpoint.secret)}
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
                      value={selectedEndpoint.secret}
                      readOnly={!isNewSecret}
                      onChange={(e) =>
                        setSelectedEndpoint({
                          ...selectedEndpoint,
                          secret: e.target.value,
                        })
                      }
                      className="font-mono text-sm"
                    />
                    <Button variant="outline" onClick={generateNewSecret}>
                      <RotateCcw className="h-4 w-4" />
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
                  <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    Event Subscriptions
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {selectedEndpoint.events.length} selected
                  </Badge>
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {(Object.keys(groupedEvents) as EventCategory[]).map(
                    (category) => (
                      <div key={category}>
                        <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
                          {React.createElement(getEventIcon(category), {
                            className: "h-3.5 w-3.5",
                          })}
                          {category}
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {groupedEvents[category].map((event) => (
                            <div
                              key={event.id}
                              className="flex items-center gap-2"
                            >
                              <Checkbox
                                id={`event-${event.id}`}
                                checked={selectedEndpoint.events.includes(
                                  event.id,
                                )}
                                onCheckedChange={(checked) => {
                                  const newEvents = checked
                                    ? [...selectedEndpoint.events, event.id]
                                    : selectedEndpoint.events.filter(
                                        (e) => e !== event.id,
                                      );
                                  const newCategories = Array.from(
                                    new Set(
                                      newEvents
                                        .map(
                                          (e) =>
                                            availableEvents.find(
                                              (ae) => ae.id === e,
                                            )?.category,
                                        )
                                        .filter(Boolean),
                                    ),
                                  ) as EventCategory[];
                                  setSelectedEndpoint({
                                    ...selectedEndpoint,
                                    events: newEvents,
                                    eventCategories: newCategories,
                                  });
                                }}
                              />
                              <Label
                                htmlFor={`event-${event.id}`}
                                className="text-sm cursor-pointer"
                              >
                                {event.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>

                {selectedEndpoint.events.length === 0 && (
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
              onClick={handleSave}
              disabled={
                !selectedEndpoint?.name ||
                !selectedEndpoint?.url ||
                validateUrl(selectedEndpoint?.url || "") !== undefined ||
                selectedEndpoint?.events.length === 0
              }
            >
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delivery Log Dialog */}
      <Dialog open={showDeliveries} onOpenChange={setShowDeliveries}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Delivery Log
                </DialogTitle>
                <DialogDescription>
                  Delivery attempts for {selectedEndpoint?.name}
                </DialogDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                {
                  mockDeliveries.filter(
                    (d) => d.endpointId === selectedEndpoint?.id,
                  ).length
                }{" "}
                entries
              </Badge>
            </div>
          </DialogHeader>

          {/* Stats Overview */}
          <div className="grid grid-cols-4 gap-3 py-4 border-b border-border">
            <div className="text-center">
              <p className="text-2xl font-semibold text-green-600">
                {
                  mockDeliveries.filter(
                    (d) =>
                      d.endpointId === selectedEndpoint?.id &&
                      d.status === "success",
                  ).length
                }
              </p>
              <p className="text-xs text-muted-foreground">Successful</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-red-600">
                {
                  mockDeliveries.filter(
                    (d) =>
                      d.endpointId === selectedEndpoint?.id &&
                      d.status === "failed",
                  ).length
                }
              </p>
              <p className="text-xs text-muted-foreground">Failed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-amber-600">
                {
                  mockDeliveries.filter(
                    (d) =>
                      d.endpointId === selectedEndpoint?.id &&
                      d.status === "retrying",
                  ).length
                }
              </p>
              <p className="text-xs text-muted-foreground">Retrying</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-foreground">
                {selectedEndpoint?.avgResponseTime}ms
              </p>
              <p className="text-xs text-muted-foreground">Avg Latency</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 py-2">
            <Button variant="ghost" size="sm" className="text-xs">
              All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-green-600"
            >
              Success
            </Button>
            <Button variant="ghost" size="sm" className="text-xs text-red-600">
              Failed
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-amber-600"
            >
              Retrying
            </Button>
          </div>

          {/* Delivery List */}
          <div className="space-y-3 py-2">
            {mockDeliveries
              .filter((d) => d.endpointId === selectedEndpoint?.id)
              .map((delivery) => (
                <div
                  key={delivery.id}
                  className={cn(
                    "p-4 rounded-lg border",
                    delivery.status === "success"
                      ? "border-green-500/20 bg-green-500/5"
                      : "border-red-500/20 bg-red-500/5",
                  )}
                >
                  <DeliveryRow delivery={delivery} endpoints={endpoints} />

                  {/* Detailed Info */}
                  <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
                    {/* Request Headers */}
                    {delivery.requestHeaders && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          Request Headers
                        </p>
                        <div className="p-2 bg-background rounded border font-mono text-xs overflow-x-auto">
                          {Object.entries(delivery.requestHeaders).map(
                            ([key, value]) => (
                              <div key={key} className="flex gap-2">
                                <span className="text-muted-foreground">
                                  {key}:
                                </span>
                                <span className="text-foreground">{value}</span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    {/* Payload */}
                    {delivery.payload && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
                          <FileJson className="h-3.5 w-3.5" />
                          Request Payload
                        </p>
                        <div className="p-3 bg-background rounded border font-mono text-xs overflow-x-auto">
                          <pre className="text-muted-foreground">
                            {delivery.payload}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Response */}
                    {delivery.responseBody && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          Response (HTTP {delivery.statusCode})
                        </p>
                        <div className="p-3 bg-background rounded border font-mono text-xs overflow-x-auto">
                          <pre className="text-muted-foreground">
                            {delivery.responseBody}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Error */}
                    {delivery.errorMessage && (
                      <div>
                        <p className="text-xs font-medium text-red-600 mb-2">
                          Error
                        </p>
                        <div className="p-3 bg-red-500/10 rounded border border-red-500/20 font-mono text-xs text-red-600">
                          {delivery.errorMessage}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

            {mockDeliveries.filter((d) => d.endpointId === selectedEndpoint?.id)
              .length === 0 && (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">
                  No deliveries yet
                </p>
                <p className="text-xs text-muted-foreground">
                  This endpoint hasn&apos;t received any events yet
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDeliveries(false)}>
              Close
            </Button>
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button className="gap-2">
              <ExternalLink className="h-4 w-4" />
              View Full Logs
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!endpointToDelete}
        onOpenChange={() => setEndpointToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Endpoint</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {endpointToDelete?.name}? This
              will immediately stop all event deliveries to this endpoint. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Endpoint
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
