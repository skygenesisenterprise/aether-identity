"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/dashboard/ui/tabs";
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
import { Separator } from "@/components/dashboard/ui/separator";
import { TooltipProvider } from "@/components/dashboard/ui/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";

import {
  Plug,
  Plus,
  Settings,
  Trash2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Activity,
  Zap,
  Globe,
  Server,
  Database,
  Cloud,
  Key,
  MoreVertical,
  Play,
  Pause,
  Search,
  Filter,
  ChevronRight,
  History,
  Shield,
  BarChart3,
  Info,
  Check,
  Copy,
  Eye,
  EyeOff,
  RotateCcw,
  TestTube,
} from "lucide-react";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type ServiceType =
  | "storage"
  | "compute"
  | "security"
  | "communication"
  | "analytics";
type ServiceStatus =
  | "active"
  | "inactive"
  | "error"
  | "configuring"
  | "pending";
type ConnectionMethod = "api_key" | "oauth" | "saml" | "mtls" | "basic_auth";
type HealthStatus = "healthy" | "degraded" | "critical" | "unknown";
type ServiceTier = "essential" | "advanced" | "enterprise";

interface ServiceEndpoint {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  description?: string;
}

interface ServiceCredential {
  type: ConnectionMethod;
  identifier?: string;
  lastRotated?: string;
  expiresAt?: string;
}

interface ServiceMetric {
  name: string;
  value: number;
  unit: string;
  trend?: "up" | "down" | "stable";
}

interface ServiceLog {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "error" | "success";
  message: string;
  details?: string;
}

interface Service {
  id: string;
  name: string;
  type: ServiceType;
  status: ServiceStatus;
  description: string;
  provider: string;
  icon?: string;

  // Connection
  endpoints: ServiceEndpoint[];
  credentials: ServiceCredential;

  // Configuration
  config: Record<string, string | number | boolean | string[]>;
  webhooksEnabled: boolean;
  autoRetry: boolean;
  timeout: number;

  // Health & Metrics
  healthStatus: HealthStatus;
  lastSync?: string;
  nextSync?: string;
  uptime: number;

  // Usage
  metrics: ServiceMetric[];
  totalRequests: number;
  errorRate: number;
  avgResponseTime: number;

  // Metadata
  createdAt: string;
  updatedAt: string;
  tier: ServiceTier;
  isCustom: boolean;

  // SaaS vs Self-hosted
  isManaged: boolean;
  region?: string;
}

interface ServiceStats {
  totalServices: number;
  activeServices: number;
  errorServices: number;
  pendingServices: number;
  totalRequests24h: number;
  avgSuccessRate: number;
  avgResponseTime: number;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const typeConfig: Record<
  ServiceType,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    description: string;
  }
> = {
  storage: {
    label: "Storage",
    icon: Database,
    color: "blue",
    bgColor: "bg-blue-500/10",
    description: "Data persistence and file storage services",
  },
  compute: {
    label: "Compute",
    icon: Server,
    color: "violet",
    bgColor: "bg-violet-500/10",
    description: "Processing and computational services",
  },
  security: {
    label: "Security",
    icon: Shield,
    color: "emerald",
    bgColor: "bg-emerald-500/10",
    description: "Authentication, authorization and security",
  },
  communication: {
    label: "Communication",
    icon: Globe,
    color: "amber",
    bgColor: "bg-amber-500/10",
    description: "Email, SMS and messaging services",
  },
  analytics: {
    label: "Analytics",
    icon: BarChart3,
    color: "rose",
    bgColor: "bg-rose-500/10",
    description: "Monitoring, logging and analytics",
  },
};

const statusConfig: Record<
  ServiceStatus,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
  }
> = {
  active: {
    label: "Active",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  inactive: {
    label: "Inactive",
    icon: Pause,
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
  },
  error: {
    label: "Error",
    icon: AlertCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  configuring: {
    label: "Configuring",
    icon: Settings,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
};

const healthConfig: Record<
  HealthStatus,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
  }
> = {
  healthy: {
    label: "Healthy",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  degraded: {
    label: "Degraded",
    icon: AlertTriangle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  critical: {
    label: "Critical",
    icon: AlertCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  unknown: {
    label: "Unknown",
    icon: Info,
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
  },
};

const mockServices: Service[] = [
  {
    id: "svc-aws-s3",
    name: "AWS S3 Storage",
    type: "storage",
    status: "active",
    description: "Amazon S3 for document and asset storage",
    provider: "Amazon Web Services",
    endpoints: [
      {
        url: "https://s3.amazonaws.com",
        method: "GET",
        description: "List buckets",
      },
      {
        url: "https://s3.amazonaws.com/{bucket}",
        method: "PUT",
        description: "Upload object",
      },
    ],
    credentials: {
      type: "api_key",
      identifier: "AKIA****",
      lastRotated: "2024-01-15",
    },
    config: { region: "us-east-1", bucket_prefix: "aether-" },
    webhooksEnabled: true,
    autoRetry: true,
    timeout: 30000,
    healthStatus: "healthy",
    lastSync: "2024-02-07T10:30:00Z",
    uptime: 99.97,
    metrics: [
      { name: "Storage Used", value: 847.3, unit: "GB", trend: "up" },
      { name: "Requests/min", value: 1245, unit: "req", trend: "stable" },
    ],
    totalRequests: 8947321,
    errorRate: 0.02,
    avgResponseTime: 145,
    createdAt: "2023-06-15",
    updatedAt: "2024-02-01",
    tier: "essential",
    isCustom: false,
    isManaged: true,
    region: "us-east-1",
  },
  {
    id: "svc-sendgrid",
    name: "SendGrid Email",
    type: "communication",
    status: "active",
    description: "Transactional email delivery service",
    provider: "Twilio SendGrid",
    endpoints: [
      {
        url: "https://api.sendgrid.com/v3/mail/send",
        method: "POST",
        description: "Send email",
      },
    ],
    credentials: {
      type: "api_key",
      identifier: "SG.****",
      lastRotated: "2024-02-01",
    },
    config: { template_mode: "dynamic", tracking_enabled: true },
    webhooksEnabled: true,
    autoRetry: true,
    timeout: 15000,
    healthStatus: "healthy",
    lastSync: "2024-02-07T09:45:00Z",
    uptime: 99.99,
    metrics: [
      { name: "Sent Today", value: 15234, unit: "emails", trend: "up" },
      { name: "Bounce Rate", value: 0.3, unit: "%", trend: "down" },
    ],
    totalRequests: 4521893,
    errorRate: 0.15,
    avgResponseTime: 234,
    createdAt: "2023-08-20",
    updatedAt: "2024-02-05",
    tier: "essential",
    isCustom: false,
    isManaged: true,
  },
  {
    id: "svc-redis-cache",
    name: "Redis Cache",
    type: "compute",
    status: "error",
    description: "In-memory data structure store for caching",
    provider: "Redis Cloud",
    endpoints: [
      {
        url: "redis://cache.internal:6379",
        method: "GET",
        description: "Cache operations",
      },
    ],
    credentials: {
      type: "basic_auth",
      identifier: "cache-user",
      lastRotated: "2024-01-10",
    },
    config: { maxmemory_policy: "allkeys-lru", persistence: "rdb" },
    webhooksEnabled: false,
    autoRetry: true,
    timeout: 5000,
    healthStatus: "critical",
    lastSync: "2024-02-07T08:20:00Z",
    uptime: 94.2,
    metrics: [
      { name: "Memory Usage", value: 89.4, unit: "%", trend: "up" },
      { name: "Hit Rate", value: 94.2, unit: "%", trend: "stable" },
    ],
    totalRequests: 23456789,
    errorRate: 5.8,
    avgResponseTime: 12,
    createdAt: "2023-05-10",
    updatedAt: "2024-02-06",
    tier: "advanced",
    isCustom: false,
    isManaged: false,
    region: "us-east-1",
  },
  {
    id: "svc-splunk",
    name: "Splunk SIEM",
    type: "analytics",
    status: "configuring",
    description: "Security information and event management",
    provider: "Splunk Inc.",
    endpoints: [
      {
        url: "https://splunk.company.com:8088",
        method: "POST",
        description: "Event ingestion",
      },
    ],
    credentials: { type: "api_key" },
    config: { index: "main", sourcetype: "_json" },
    webhooksEnabled: true,
    autoRetry: true,
    timeout: 10000,
    healthStatus: "unknown",
    uptime: 0,
    metrics: [],
    totalRequests: 0,
    errorRate: 0,
    avgResponseTime: 0,
    createdAt: "2024-02-01",
    updatedAt: "2024-02-07",
    tier: "enterprise",
    isCustom: false,
    isManaged: false,
    region: "internal",
  },
  {
    id: "svc-okta-mfa",
    name: "Okta MFA",
    type: "security",
    status: "active",
    description: "Multi-factor authentication provider",
    provider: "Okta",
    endpoints: [
      {
        url: "https://{org}.okta.com/api/v1/authn",
        method: "POST",
        description: "Authentication",
      },
    ],
    credentials: {
      type: "oauth",
      identifier: "okta-app",
      lastRotated: "2024-01-20",
    },
    config: { factors: ["push", "sms", "totp"], auto_enroll: true },
    webhooksEnabled: true,
    autoRetry: true,
    timeout: 10000,
    healthStatus: "healthy",
    lastSync: "2024-02-07T10:25:00Z",
    uptime: 99.95,
    metrics: [
      { name: "Active Factors", value: 2847, unit: "users", trend: "up" },
      { name: "Success Rate", value: 98.7, unit: "%", trend: "stable" },
    ],
    totalRequests: 1234567,
    errorRate: 1.3,
    avgResponseTime: 456,
    createdAt: "2023-07-15",
    updatedAt: "2024-02-03",
    tier: "enterprise",
    isCustom: false,
    isManaged: true,
  },
  {
    id: "svc-internal-ldap",
    name: "Corporate LDAP",
    type: "security",
    status: "inactive",
    description: "Internal directory service integration",
    provider: "Internal IT",
    endpoints: [
      {
        url: "ldaps://ldap.company.com:636",
        method: "GET",
        description: "Directory queries",
      },
    ],
    credentials: {
      type: "mtls",
      identifier: "aether-ldap-cert",
      lastRotated: "2023-12-01",
    },
    config: {
      base_dn: "dc=company,dc=com",
      user_filter: "(objectClass=person)",
    },
    webhooksEnabled: false,
    autoRetry: false,
    timeout: 5000,
    healthStatus: "unknown",
    lastSync: "2024-01-15T14:30:00Z",
    uptime: 0,
    metrics: [],
    totalRequests: 456789,
    errorRate: 0,
    avgResponseTime: 89,
    createdAt: "2023-03-10",
    updatedAt: "2024-01-15",
    tier: "advanced",
    isCustom: true,
    isManaged: false,
    region: "internal",
  },
];

const mockLogs: ServiceLog[] = [
  {
    id: "log-001",
    timestamp: "2024-02-07T10:30:15Z",
    level: "success",
    message: "AWS S3: Successfully uploaded 47 files",
  },
  {
    id: "log-002",
    timestamp: "2024-02-07T10:28:42Z",
    level: "error",
    message: "Redis Cache: Connection timeout",
    details: "Connection to redis://cache.internal:6379 timed out after 5000ms",
  },
  {
    id: "log-003",
    timestamp: "2024-02-07T10:25:00Z",
    level: "success",
    message: "Okta MFA: Authentication successful",
  },
  {
    id: "log-004",
    timestamp: "2024-02-07T10:20:18Z",
    level: "warn",
    message: "SendGrid: High bounce rate detected",
    details: "Bounce rate at 0.8%, threshold is 0.5%",
  },
  {
    id: "log-005",
    timestamp: "2024-02-07T10:15:30Z",
    level: "info",
    message: "Splunk SIEM: Configuration in progress",
  },
  {
    id: "log-006",
    timestamp: "2024-02-07T10:10:00Z",
    level: "error",
    message: "Redis Cache: Memory threshold exceeded",
    details: "Memory usage at 89.4%, consider scaling",
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatRelativeTime = (timestamp?: string): string => {
  if (!timestamp) return "Never";
  const date = new Date(timestamp);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ServicesPage() {
  // State
  const [services, setServices] = React.useState<Service[]>(mockServices);
  const [logs] = React.useState<ServiceLog[]>(mockLogs);
  const [selectedService, setSelectedService] = React.useState<Service | null>(
    null,
  );
  const [isConfigOpen, setIsConfigOpen] = React.useState(false);
  const [serviceToDelete, setServiceToDelete] = React.useState<Service | null>(
    null,
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("services");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterType, setFilterType] = React.useState<ServiceType | "all">(
    "all",
  );
  const [filterStatus, setFilterStatus] = React.useState<ServiceStatus | "all">(
    "all",
  );
  const [showSecret, setShowSecret] = React.useState(false);

  // Ref for unique IDs
  const serviceCounterRef = React.useRef(0);

  // Derived state
  const stats: ServiceStats = React.useMemo(() => {
    const active = services.filter((s) => s.status === "active").length;
    const errors = services.filter((s) => s.status === "error").length;
    const pending = services.filter(
      (s) => s.status === "pending" || s.status === "configuring",
    ).length;
    const avgSuccessRate =
      services.length > 0
        ? services.reduce((acc, s) => acc + (100 - s.errorRate), 0) /
          services.length
        : 0;
    const avgResponseTime =
      services.length > 0
        ? services.reduce((acc, s) => acc + s.avgResponseTime, 0) /
          services.length
        : 0;

    return {
      totalServices: services.length,
      activeServices: active,
      errorServices: errors,
      pendingServices: pending,
      totalRequests24h: 8947,
      avgSuccessRate,
      avgResponseTime,
    };
  }, [services]);

  const filteredServices = React.useMemo(() => {
    return services.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.provider.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === "all" || service.type === filterType;
      const matchesStatus =
        filterStatus === "all" || service.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [services, searchQuery, filterType, filterStatus]);

  const hasErrors = stats.errorServices > 0;
  const hasPending = stats.pendingServices > 0;

  // Handlers
  const handleToggleService = (serviceId: string) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id !== serviceId) return s;
        const newStatus = s.status === "active" ? "inactive" : "active";
        return { ...s, status: newStatus, updatedAt: new Date().toISOString() };
      }),
    );
  };

  const handleConfigure = (service: Service) => {
    setSelectedService({ ...service });
    setShowSecret(false);
    setIsConfigOpen(true);
  };

  const handleSaveConfiguration = () => {
    if (!selectedService) return;
    setServices((prev) =>
      prev.map((s) =>
        s.id === selectedService.id
          ? { ...selectedService, updatedAt: new Date().toISOString() }
          : s,
      ),
    );
    setIsConfigOpen(false);
    setSelectedService(null);
  };

  const handleDelete = (service: Service) => {
    setServiceToDelete(service);
  };

  const confirmDelete = () => {
    if (!serviceToDelete) return;
    setServices((prev) => prev.filter((s) => s.id !== serviceToDelete.id));
    setServiceToDelete(null);
  };

  const handleAddService = (type: ServiceType) => {
    serviceCounterRef.current += 1;
    const timestamp = serviceCounterRef.current;
    const newService: Service = {
      id: `svc-new-${timestamp}`,
      name: `New ${typeConfig[type].label} Service`,
      type,
      status: "configuring",
      description: "Configure this service integration",
      provider: "Custom",
      endpoints: [],
      credentials: { type: "api_key" },
      config: {},
      webhooksEnabled: false,
      autoRetry: true,
      timeout: 30000,
      healthStatus: "unknown",
      uptime: 0,
      metrics: [],
      totalRequests: 0,
      errorRate: 0,
      avgResponseTime: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tier: "essential",
      isCustom: true,
      isManaged: false,
    };
    setServices((prev) => [...prev, newService]);
    setIsAddDialogOpen(false);
    handleConfigure(newService);
  };

  const handleReconnectAll = () => {
    setServices((prev) =>
      prev.map((s) =>
        s.status === "error" ? { ...s, status: "configuring" } : s,
      ),
    );
    // Simulate reconnection
    setTimeout(() => {
      setServices((prev) =>
        prev.map((s) =>
          s.status === "configuring" && s.id.includes("new-")
            ? { ...s, status: "active", healthStatus: "healthy" }
            : s,
        ),
      );
    }, 2000);
  };

  const handleSyncAll = () => {
    // Trigger sync for all active services
    alert("Syncing all active services...");
  };

  // Render helpers
  const StatusBadge = ({ status }: { status: ServiceStatus }) => {
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge
        variant="outline"
        className={cn(
          "gap-1 text-xs font-medium",
          config.bgColor,
          config.color,
        )}
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const HealthBadge = ({ status }: { status: HealthStatus }) => {
    const config = healthConfig[status];
    const Icon = config.icon;

    return (
      <Badge
        variant="outline"
        className={cn(
          "gap-1 text-xs font-medium",
          config.bgColor,
          config.color,
        )}
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const TypeBadge = ({ type }: { type: ServiceType }) => {
    const config = typeConfig[type];

    return (
      <Badge
        variant="outline"
        className={cn(
          "gap-1 text-xs",
          config.bgColor,
          `text-${config.color}-500 border-${config.color}-500/20`,
        )}
      >
        <config.icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <TooltipProvider>
      <div className="space-y-6 text-foreground">
        {/* =========================================================================
            HEADER SECTION
            ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-card-foreground">
                Identity Integrated Services
              </h1>
              {hasErrors && (
                <Badge variant="destructive" className="text-xs gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {stats.errorServices} errors
                </Badge>
              )}
              {hasPending && (
                <Badge
                  variant="outline"
                  className="text-xs text-amber-500 border-amber-500/30"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {stats.pendingServices} pending
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Manage external service integrations and connections
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleReconnectAll}
              className="gap-2"
              disabled={!hasErrors}
            >
              <RotateCcw className="h-4 w-4" />
              Reconnect All
            </Button>
            <Button variant="outline" onClick={handleSyncAll} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Sync All
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Service
            </Button>
          </div>
        </div>

        <ContextOverview
          authority="Acme Corporation"
          workspace="Production"
          role="Identity Administrator"
          accessLevel="Full service management"
          isPrivileged={true}
          lastLogin="Today, 9:42 AM"
        />

        {/* =========================================================================
            PLATFORM HEALTH & STATS
            ========================================================================= */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "h-2 w-2 rounded-full animate-pulse",
                hasErrors
                  ? "bg-red-500"
                  : hasPending
                    ? "bg-amber-500"
                    : "bg-emerald-500",
              )}
            />
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Platform Health
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Active Services"
              value={stats.activeServices}
              subtitle={`${stats.totalServices} total configured`}
              icon={Plug}
              variant={hasErrors ? "destructive" : "default"}
              trend={{
                value: stats.activeServices,
                isPositive: stats.activeServices > 0,
              }}
            />
            <MetricCard
              title="Success Rate"
              value={`${stats.avgSuccessRate.toFixed(1)}%`}
              subtitle="Average across services"
              icon={CheckCircle2}
              variant={
                stats.avgSuccessRate >= 99
                  ? "default"
                  : stats.avgSuccessRate >= 95
                    ? "warning"
                    : "destructive"
              }
              trend={{ value: 0.8, isPositive: true }}
            />
            <MetricCard
              title="Avg Response"
              value={`${Math.round(stats.avgResponseTime)}ms`}
              subtitle="Response time average"
              icon={Zap}
              variant={
                stats.avgResponseTime < 200
                  ? "default"
                  : stats.avgResponseTime < 500
                    ? "warning"
                    : "destructive"
              }
              trend={{ value: 15, isPositive: false }}
            />
            <MetricCard
              title="24h Requests"
              value={formatNumber(stats.totalRequests24h)}
              subtitle="Total API calls"
              icon={Activity}
              trend={{ value: 12.3, isPositive: true }}
            />
          </div>

          {hasErrors && (
            <Alert
              variant="destructive"
              className="border-red-500/30 bg-red-500/10"
            >
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertTitle className="text-red-400">
                Service Errors Detected
              </AlertTitle>
              <AlertDescription className="text-red-400/80">
                {stats.errorServices} service(s) experiencing connectivity
                issues. Review service configurations and credentials.
              </AlertDescription>
            </Alert>
          )}
        </section>

        {/* =========================================================================
            MAIN CONTENT TABS
            ========================================================================= */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-muted/50">
            <TabsTrigger value="services" className="gap-2">
              <Plug className="h-4 w-4" />
              Services
              <Badge variant="secondary" className="ml-1 text-xs">
                {services.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-2">
              <History className="h-4 w-4" />
              Activity Log
            </TabsTrigger>
            <TabsTrigger value="health" className="gap-2">
              <Activity className="h-4 w-4" />
              Health Check
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Global Settings
            </TabsTrigger>
          </TabsList>

          {/* SERVICES TAB */}
          <TabsContent value="services" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={filterType}
                  onValueChange={(v) => setFilterType(v as ServiceType | "all")}
                >
                  <SelectTrigger className="w-[160px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="storage">Storage</SelectItem>
                    <SelectItem value="compute">Compute</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="communication">Communication</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filterStatus}
                  onValueChange={(v) =>
                    setFilterStatus(v as ServiceStatus | "all")
                  }
                >
                  <SelectTrigger className="w-[160px]">
                    <Activity className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="configuring">Configuring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredServices.map((service) => {
                const Icon = typeConfig[service.type].icon;
                const isError = service.status === "error";
                const isConfiguring = service.status === "configuring";

                return (
                  <Card
                    key={service.id}
                    className={cn(
                      "border-border bg-card transition-all",
                      service.status === "inactive" && "opacity-75",
                      isError && "border-red-500/30 shadow-red-500/5",
                      isConfiguring && "border-blue-500/30",
                    )}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-lg",
                              typeConfig[service.type].bgColor,
                            )}
                          >
                            <Icon
                              className={cn(
                                "h-5 w-5",
                                `text-${typeConfig[service.type].color}-500`,
                              )}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-sm font-medium text-foreground truncate">
                                {service.name}
                              </CardTitle>
                              {service.isCustom && (
                                <Badge
                                  variant="outline"
                                  className="text-xs shrink-0"
                                >
                                  Custom
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {service.provider}
                            </p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleConfigure(service)}
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              Configure
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleService(service.id)}
                            >
                              {service.status === "active" ? (
                                <>
                                  <Pause className="h-4 w-4 mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(service)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Status Row */}
                      <div className="flex items-center gap-2">
                        <StatusBadge status={service.status} />
                        <HealthBadge status={service.healthStatus} />
                        <TypeBadge type={service.type} />
                      </div>

                      {/* Description */}
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {service.description}
                      </p>

                      {/* Metrics Row */}
                      {service.status === "active" && (
                        <div className="grid grid-cols-3 gap-2 py-3 border-y border-border">
                          <div className="text-center">
                            <p className="text-lg font-semibold text-foreground">
                              {formatNumber(service.totalRequests)}
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase">
                              Requests
                            </p>
                          </div>
                          <div className="text-center">
                            <p
                              className={cn(
                                "text-lg font-semibold",
                                service.errorRate > 1
                                  ? "text-red-500"
                                  : "text-emerald-500",
                              )}
                            >
                              {service.errorRate.toFixed(2)}%
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase">
                              Error Rate
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-semibold text-foreground">
                              {service.avgResponseTime}ms
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase">
                              Avg Latency
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Error Alert */}
                      {isError && (
                        <div className="rounded-md bg-red-500/5 border border-red-500/20 p-3">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-red-700">
                                Connection Error
                              </p>
                              <p className="text-xs text-red-600 mt-0.5">
                                Service is not responding. Check credentials and
                                endpoint configuration.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Last Sync */}
                      {service.lastSync && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            Last sync: {formatRelativeTime(service.lastSync)}
                          </span>
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <Switch
                            id={`${service.id}-toggle`}
                            checked={service.status === "active"}
                            onCheckedChange={() =>
                              handleToggleService(service.id)
                            }
                            disabled={
                              service.status === "configuring" ||
                              service.status === "error"
                            }
                          />
                          <Label
                            htmlFor={`${service.id}-toggle`}
                            className="text-sm text-muted-foreground cursor-pointer"
                          >
                            {service.status === "active"
                              ? "Enabled"
                              : "Disabled"}
                          </Label>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleConfigure(service)}
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
              })}
            </div>

            {filteredServices.length === 0 && (
              <Card className="border-dashed border-2 border-border bg-card/50">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary mb-4">
                    <Plug className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-sm font-medium text-foreground mb-1">
                    No services found
                  </h3>
                  <p className="text-xs text-muted-foreground text-center max-w-xs">
                    {searchQuery ||
                    filterType !== "all" ||
                    filterStatus !== "all"
                      ? "Try adjusting your search or filters"
                      : "Configure your first service integration to get started"}
                  </p>
                  {!searchQuery &&
                    filterType === "all" &&
                    filterStatus === "all" && (
                      <Button
                        onClick={() => setIsAddDialogOpen(true)}
                        className="mt-4 gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add First Service
                      </Button>
                    )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ACTIVITY LOG TAB */}
          <TabsContent value="logs" className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <History className="h-4 w-4 text-muted-foreground" />
                    Recent Service Activity
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-muted-foreground">Live</span>
                  </div>
                </div>
                <CardDescription>
                  Service events and status changes across all integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 py-3 border-b border-border last:border-0"
                  >
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                        log.level === "success" && "bg-emerald-500/10",
                        log.level === "error" && "bg-red-500/10",
                        log.level === "warn" && "bg-amber-500/10",
                        log.level === "info" && "bg-blue-500/10",
                      )}
                    >
                      {log.level === "success" ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : log.level === "error" ? (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      ) : log.level === "warn" ? (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      ) : (
                        <Info className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {log.message}
                      </p>
                      {log.details && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {log.details}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatRelativeTime(log.timestamp)}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        log.level === "success" &&
                          "text-emerald-500 border-emerald-500/20",
                        log.level === "error" &&
                          "text-red-500 border-red-500/20",
                        log.level === "warn" &&
                          "text-amber-500 border-amber-500/20",
                        log.level === "info" &&
                          "text-blue-500 border-blue-500/20",
                      )}
                    >
                      {log.level.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Link href="/admin/integrations/logs">
                <Button variant="outline" className="gap-2">
                  View Full Integration Logs
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </TabsContent>

          {/* HEALTH CHECK TAB */}
          <TabsContent value="health" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Health Overview */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    Health Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {React.createElement(typeConfig[service.type].icon, {
                            className: "h-4 w-4 text-muted-foreground",
                          })}
                          <span className="text-sm text-foreground">
                            {service.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {service.uptime > 0 && (
                            <span className="text-xs text-muted-foreground">
                              {service.uptime.toFixed(2)}% uptime
                            </span>
                          )}
                          <div
                            className={cn(
                              "h-2 w-2 rounded-full",
                              service.healthStatus === "healthy" &&
                                "bg-emerald-500",
                              service.healthStatus === "degraded" &&
                                "bg-amber-500",
                              service.healthStatus === "critical" &&
                                "bg-red-500",
                              service.healthStatus === "unknown" &&
                                "bg-slate-400",
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="rounded-md bg-emerald-500/5 border border-emerald-500/20 p-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-emerald-700">
                          Health Monitoring Active
                        </p>
                        <p className="text-xs text-emerald-600 mt-0.5">
                          Services are checked every 60 seconds for availability
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">
                          Success Rate
                        </span>
                        <span className="font-medium">
                          {stats.avgSuccessRate.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={stats.avgSuccessRate} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">
                          Active Services
                        </span>
                        <span className="font-medium">
                          {stats.activeServices}/{stats.totalServices}
                        </span>
                      </div>
                      <Progress
                        value={
                          (stats.activeServices / stats.totalServices) * 100
                        }
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">
                          Error Rate
                        </span>
                        <span className="font-medium text-red-500">
                          {(100 - stats.avgSuccessRate).toFixed(1)}%
                        </span>
                      </div>
                      <Progress
                        value={100 - stats.avgSuccessRate}
                        className="h-2 bg-red-500/20"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Service Diagnostics */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Service Diagnostics
                </CardTitle>
                <CardDescription>
                  Run diagnostics to verify service connectivity and
                  configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-lg",
                            typeConfig[service.type].bgColor,
                          )}
                        >
                          {React.createElement(typeConfig[service.type].icon, {
                            className: cn(
                              "h-4 w-4",
                              `text-${typeConfig[service.type].color}-500`,
                            ),
                          })}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {service.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {service.status === "active"
                              ? "Connected"
                              : "Disconnected"}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1">
                        <TestTube className="h-3.5 w-3.5" />
                        Test
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* GLOBAL SETTINGS TAB */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Global Configuration */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Global Configuration
                  </CardTitle>
                  <CardDescription>
                    Default settings for all service integrations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">
                        Auto-retry Failed Requests
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically retry failed API calls
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Webhook Notifications</Label>
                      <p className="text-xs text-muted-foreground">
                        Enable webhook events for all services
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Health Check Monitoring</Label>
                      <p className="text-xs text-muted-foreground">
                        Monitor service health every 60 seconds
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Default Timeout</Label>
                    <Select defaultValue="30000">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5000">5 seconds</SelectItem>
                        <SelectItem value="10000">10 seconds</SelectItem>
                        <SelectItem value="30000">30 seconds</SelectItem>
                        <SelectItem value="60000">60 seconds</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Authentication and credential management
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">
                        Encrypt Credentials at Rest
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Use AES-256 encryption for stored credentials
                      </p>
                    </div>
                    <Switch defaultChecked disabled />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">
                        Credential Rotation Alerts
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Alert 30 days before credentials expire
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Allowed Connection Methods</Label>
                    <div className="space-y-2">
                      {[
                        "API Key",
                        "OAuth 2.0",
                        "SAML",
                        "mTLS",
                        "Basic Auth",
                      ].map((method) => (
                        <div key={method} className="flex items-center gap-2">
                          <Checkbox id={`method-${method}`} defaultChecked />
                          <Label
                            htmlFor={`method-${method}`}
                            className="text-sm"
                          >
                            {method}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* SaaS vs Self-hosted Info */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-muted-foreground" />
                  Deployment Mode
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-secondary/50 p-4">
                  <div className="flex items-start gap-3">
                    <Server className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Currently Running in SaaS Mode
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Services marked as &quot;Managed&quot; are hosted and
                        maintained by Aether. Custom and self-hosted services
                        require manual configuration and maintenance.
                      </p>
                      <div className="flex gap-4 mt-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          <span className="text-xs text-muted-foreground">
                            {services.filter((s) => s.isManaged).length} Managed
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-slate-500" />
                          <span className="text-xs text-muted-foreground">
                            {services.filter((s) => !s.isManaged).length}{" "}
                            Self-hosted
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* =========================================================================
            DIALOGS
            ========================================================================= */}

        {/* Add Service Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Service
              </DialogTitle>
              <DialogDescription>
                Choose a service category to integrate with Aether Identity
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-3 py-4">
              {(Object.keys(typeConfig) as ServiceType[]).map((type) => {
                const config = typeConfig[type];
                const Icon = config.icon;

                return (
                  <button
                    key={type}
                    onClick={() => handleAddService(type)}
                    className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card hover:bg-accent hover:border-accent transition-colors text-left"
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        config.bgColor,
                      )}
                    >
                      <Icon
                        className={cn("h-5 w-5", `text-${config.color}-500`)}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">
                          {config.label}
                        </h3>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {config.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>

        {/* Configuration Dialog */}
        <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedService && (
                  <div
                    className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center",
                      typeConfig[selectedService.type].bgColor,
                    )}
                  >
                    {React.createElement(
                      typeConfig[selectedService.type].icon,
                      {
                        className: cn(
                          "h-4 w-4",
                          `text-${typeConfig[selectedService.type].color}-500`,
                        ),
                      },
                    )}
                  </div>
                )}
                Configure {selectedService?.name}
              </DialogTitle>
              <DialogDescription>
                Update service settings, credentials, and connection parameters
              </DialogDescription>
            </DialogHeader>

            {selectedService && (
              <div className="space-y-6 py-4">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-foreground">
                    Basic Information
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="service-name">Service Name</Label>
                    <Input
                      id="service-name"
                      value={selectedService.name}
                      onChange={(e) =>
                        setSelectedService({
                          ...selectedService,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service-description">Description</Label>
                    <Input
                      id="service-description"
                      value={selectedService.description}
                      onChange={(e) =>
                        setSelectedService({
                          ...selectedService,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="service-provider">Provider</Label>
                      <Input
                        id="service-provider"
                        value={selectedService.provider}
                        onChange={(e) =>
                          setSelectedService({
                            ...selectedService,
                            provider: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service-tier">Service Tier</Label>
                      <Select
                        value={selectedService.tier}
                        onValueChange={(value: ServiceTier) =>
                          setSelectedService({
                            ...selectedService,
                            tier: value,
                          })
                        }
                      >
                        <SelectTrigger id="service-tier">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="essential">Essential</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Credentials */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    Credentials
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="auth-type">Authentication Type</Label>
                      <Select
                        value={selectedService.credentials.type}
                        onValueChange={(value: ConnectionMethod) =>
                          setSelectedService({
                            ...selectedService,
                            credentials: {
                              ...selectedService.credentials,
                              type: value,
                            },
                          })
                        }
                      >
                        <SelectTrigger id="auth-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="api_key">API Key</SelectItem>
                          <SelectItem value="oauth">OAuth 2.0</SelectItem>
                          <SelectItem value="saml">SAML</SelectItem>
                          <SelectItem value="mtls">mTLS</SelectItem>
                          <SelectItem value="basic_auth">Basic Auth</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="credential-id">Credential ID</Label>
                      <Input
                        id="credential-id"
                        value={selectedService.credentials.identifier || ""}
                        onChange={(e) =>
                          setSelectedService({
                            ...selectedService,
                            credentials: {
                              ...selectedService.credentials,
                              identifier: e.target.value,
                            },
                          })
                        }
                        placeholder="Enter credential identifier"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="api-secret">API Secret / Token</Label>
                    <div className="flex gap-2">
                      <Input
                        id="api-secret"
                        type={showSecret ? "text" : "password"}
                        placeholder="Enter your API secret"
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setShowSecret(!showSecret)}
                      >
                        {showSecret ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          navigator.clipboard.writeText("api-secret-value")
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Secret is encrypted and never displayed after saving
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Connection Settings */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    Connection Settings
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="endpoint-url">Primary Endpoint URL</Label>
                    <Input
                      id="endpoint-url"
                      value={selectedService.endpoints[0]?.url || ""}
                      onChange={(e) =>
                        setSelectedService({
                          ...selectedService,
                          endpoints: [
                            {
                              ...(selectedService.endpoints[0] || {}),
                              url: e.target.value,
                            },
                            ...selectedService.endpoints.slice(1),
                          ],
                        })
                      }
                      placeholder="https://api.example.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timeout">Timeout (ms)</Label>
                      <Input
                        id="timeout"
                        type="number"
                        value={selectedService.timeout}
                        onChange={(e) =>
                          setSelectedService({
                            ...selectedService,
                            timeout: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="region">Region</Label>
                      <Select
                        value={selectedService.region || "auto"}
                        onValueChange={(value) =>
                          setSelectedService({
                            ...selectedService,
                            region: value,
                          })
                        }
                      >
                        <SelectTrigger id="region">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Auto-detect</SelectItem>
                          <SelectItem value="us-east-1">
                            US East (N. Virginia)
                          </SelectItem>
                          <SelectItem value="us-west-2">
                            US West (Oregon)
                          </SelectItem>
                          <SelectItem value="eu-west-1">
                            EU (Ireland)
                          </SelectItem>
                          <SelectItem value="ap-southeast-1">
                            Asia Pacific (Singapore)
                          </SelectItem>
                          <SelectItem value="internal">
                            Internal Network
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Enable Webhooks</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive real-time events from this service
                      </p>
                    </div>
                    <Switch
                      checked={selectedService.webhooksEnabled}
                      onCheckedChange={(checked) =>
                        setSelectedService({
                          ...selectedService,
                          webhooksEnabled: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">
                        Auto-retry Failed Requests
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically retry on transient failures
                      </p>
                    </div>
                    <Switch
                      checked={selectedService.autoRetry}
                      onCheckedChange={(checked) =>
                        setSelectedService({
                          ...selectedService,
                          autoRetry: checked,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Deployment Info */}
                {selectedService.isManaged && (
                  <>
                    <Separator />
                    <div className="rounded-md bg-blue-500/5 border border-blue-500/20 p-3">
                      <div className="flex items-start gap-2">
                        <Cloud className="h-4 w-4 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-700">
                            Managed Service
                          </p>
                          <p className="text-xs text-blue-600 mt-0.5">
                            This is a managed service hosted by Aether.
                            Infrastructure maintenance, updates, and scaling are
                            handled automatically.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsConfigOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveConfiguration} className="gap-2">
                    <Check className="h-4 w-4" />
                    Save Configuration
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!serviceToDelete}
          onOpenChange={() => setServiceToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Service Integration</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the integration with{" "}
                <strong>{serviceToDelete?.name}</strong>? This action cannot be
                undone.
                {serviceToDelete?.totalRequests &&
                  serviceToDelete.totalRequests > 0 && (
                    <p className="mt-2 text-amber-600">
                      Warning: This service has processed{" "}
                      {formatNumber(serviceToDelete.totalRequests)} requests.
                    </p>
                  )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Service
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}
