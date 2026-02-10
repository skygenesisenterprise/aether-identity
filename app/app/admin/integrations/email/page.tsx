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
  Mail,
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
  Server,
  Send,
  FileText,
  History,
  MoreVertical,
  Play,
  Pause,
  Search,
  Filter,
  ChevronRight,
  Shield,
  BarChart3,
  Info,
  Check,
  Eye,
  EyeOff,
  TestTube,
  Globe,
  LayoutTemplate
} from "lucide-react";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type EmailProviderType =
  | "smtp"
  | "api"
  | "ses"
  | "sendgrid"
  | "mailgun"
  | "custom";
type EmailProviderStatus = "active" | "inactive" | "error" | "configuring";
type EmailTemplateStatus = "active" | "draft" | "deprecated";
type EmailLogStatus = "sent" | "delivered" | "bounced" | "failed" | "pending";
type EmailPriority = "high" | "normal" | "low";

interface EmailProvider {
  id: string;
  name: string;
  type: EmailProviderType;
  status: EmailProviderStatus;
  description: string;

  // Connection Settings
  host?: string;
  port?: number;
  secure: boolean;
  username?: string;
  password?: string;
  apiKey?: string;
  region?: string;

  // Configuration
  fromName: string;
  fromEmail: string;
  replyTo?: string;
  maxRetries: number;
  timeout: number;

  // Health & Metrics
  healthStatus: "healthy" | "degraded" | "critical" | "unknown";
  lastCheck?: string;
  uptime: number;

  // Usage Stats
  emailsSent24h: number;
  successRate: number;
  avgDeliveryTime: number;

  // Metadata
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
  isManaged: boolean;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  description: string;
  status: EmailTemplateStatus;
  category: "notification" | "onboarding" | "alert" | "marketing" | "security";
  variables: string[];
  lastModified: string;
  usageCount: number;
  previewUrl?: string;
}

interface EmailLog {
  id: string;
  timestamp: string;
  status: EmailLogStatus;
  recipient: string;
  subject: string;
  templateName?: string;
  providerId: string;
  providerName: string;
  priority: EmailPriority;
  error?: string;
  deliveryTime?: number;
}

interface EmailStats {
  totalEmails24h: number;
  deliveredCount: number;
  failedCount: number;
  pendingCount: number;
  successRate: number;
  avgDeliveryTime: number;
  activeProviders: number;
  totalProviders: number;
  templateCount: number;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const providerTypeConfig: Record<
  EmailProviderType,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    description: string;
  }
> = {
  smtp: {
    label: "SMTP",
    icon: Server,
    color: "blue",
    bgColor: "bg-blue-500/10",
    description: "Standard SMTP server",
  },
  api: {
    label: "API",
    icon: Zap,
    color: "violet",
    bgColor: "bg-violet-500/10",
    description: "REST API integration",
  },
  ses: {
    label: "Amazon SES",
    icon: Globe,
    color: "amber",
    bgColor: "bg-amber-500/10",
    description: "AWS Simple Email Service",
  },
  sendgrid: {
    label: "SendGrid",
    icon: Send,
    color: "emerald",
    bgColor: "bg-emerald-500/10",
    description: "Twilio SendGrid",
  },
  mailgun: {
    label: "Mailgun",
    icon: Mail,
    color: "rose",
    bgColor: "bg-rose-500/10",
    description: "Mailgun by Sinch",
  },
  custom: {
    label: "Custom",
    icon: Settings,
    color: "slate",
    bgColor: "bg-slate-500/10",
    description: "Custom provider",
  },
};

const statusConfig: Record<
  EmailProviderStatus,
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
};

const healthConfig: Record<
  "healthy" | "degraded" | "critical" | "unknown",
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

const templateCategoryConfig: Record<
  EmailTemplate["category"],
  {
    label: string;
    color: string;
    bgColor: string;
  }
> = {
  notification: {
    label: "Notification",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  onboarding: {
    label: "Onboarding",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  alert: {
    label: "Alert",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  marketing: {
    label: "Marketing",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  security: {
    label: "Security",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
};

const logStatusConfig: Record<
  EmailLogStatus,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
  }
> = {
  sent: {
    label: "Sent",
    icon: Send,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  bounced: {
    label: "Bounced",
    icon: AlertTriangle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  failed: {
    label: "Failed",
    icon: AlertCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
  },
};

const mockProviders: EmailProvider[] = [
  {
    id: "prov-sendgrid",
    name: "SendGrid Production",
    type: "sendgrid",
    status: "active",
    description: "Primary transactional email provider",
    secure: true,
    apiKey: "SG.****",
    fromName: "Aether Identity",
    fromEmail: "noreply@aether-identity.com",
    replyTo: "support@aether-identity.com",
    maxRetries: 3,
    timeout: 30000,
    healthStatus: "healthy",
    lastCheck: "2024-02-07T10:30:00Z",
    uptime: 99.98,
    emailsSent24h: 15234,
    successRate: 99.7,
    avgDeliveryTime: 234,
    createdAt: "2023-08-20",
    updatedAt: "2024-02-05",
    isDefault: true,
    isManaged: true,
  },
  {
    id: "prov-ses",
    name: "AWS SES Backup",
    type: "ses",
    status: "active",
    description: "Backup email delivery service",
    secure: true,
    region: "us-east-1",
    fromName: "Aether Identity",
    fromEmail: "backup@aether-identity.com",
    maxRetries: 3,
    timeout: 45000,
    healthStatus: "healthy",
    lastCheck: "2024-02-07T10:25:00Z",
    uptime: 99.95,
    emailsSent24h: 1247,
    successRate: 99.9,
    avgDeliveryTime: 189,
    createdAt: "2023-09-15",
    updatedAt: "2024-02-03",
    isDefault: false,
    isManaged: true,
  },
  {
    id: "prov-smtp-internal",
    name: "Internal SMTP",
    type: "smtp",
    status: "error",
    description: "Corporate SMTP relay",
    host: "smtp.company.com",
    port: 587,
    secure: true,
    username: "aether-service",
    fromName: "Aether Identity",
    fromEmail: "system@company.com",
    maxRetries: 2,
    timeout: 60000,
    healthStatus: "critical",
    lastCheck: "2024-02-07T08:20:00Z",
    uptime: 94.2,
    emailsSent24h: 0,
    successRate: 0,
    avgDeliveryTime: 0,
    createdAt: "2023-05-10",
    updatedAt: "2024-02-06",
    isDefault: false,
    isManaged: false,
  },
  {
    id: "prov-mailgun-dev",
    name: "Mailgun Dev",
    type: "mailgun",
    status: "configuring",
    description: "Development environment emails",
    secure: true,
    apiKey: "key-****",
    fromName: "Aether Dev",
    fromEmail: "dev@aether-identity.com",
    maxRetries: 3,
    timeout: 30000,
    healthStatus: "unknown",
    uptime: 0,
    emailsSent24h: 0,
    successRate: 0,
    avgDeliveryTime: 0,
    createdAt: "2024-02-01",
    updatedAt: "2024-02-07",
    isDefault: false,
    isManaged: true,
  },
];

const mockTemplates: EmailTemplate[] = [
  {
    id: "tmpl-welcome",
    name: "Welcome Email",
    subject: "Welcome to {{organizationName}}!",
    description: "Sent to new users upon registration",
    status: "active",
    category: "onboarding",
    variables: ["userName", "organizationName", "loginUrl"],
    lastModified: "2024-01-15",
    usageCount: 2847,
  },
  {
    id: "tmpl-reset",
    name: "Password Reset",
    subject: "Reset your password",
    description: "Password reset request confirmation",
    status: "active",
    category: "security",
    variables: ["userName", "resetLink", "expiryTime"],
    lastModified: "2024-01-20",
    usageCount: 892,
  },
  {
    id: "tmpl-mfa",
    name: "MFA Verification",
    subject: "Your verification code: {{code}}",
    description: "Multi-factor authentication code",
    status: "active",
    category: "security",
    variables: ["userName", "code", "expiryMinutes"],
    lastModified: "2024-02-01",
    usageCount: 4521,
  },
  {
    id: "tmpl-alert",
    name: "Security Alert",
    subject: "Security alert: {{alertType}}",
    description: "Security-related notifications",
    status: "active",
    category: "alert",
    variables: ["userName", "alertType", "details", "actionRequired"],
    lastModified: "2024-01-10",
    usageCount: 156,
  },
  {
    id: "tmpl-invite",
    name: "Organization Invite",
    subject: "You've been invited to {{organizationName}}",
    description: "User invitation to join organization",
    status: "draft",
    category: "onboarding",
    variables: ["inviterName", "organizationName", "inviteLink", "role"],
    lastModified: "2024-02-05",
    usageCount: 0,
  },
  {
    id: "tmpl-newsletter",
    name: "Monthly Newsletter",
    subject: "{{month}} Updates from {{organizationName}}",
    description: "Monthly product updates newsletter",
    status: "draft",
    category: "marketing",
    variables: ["userName", "month", "organizationName", "highlights"],
    lastModified: "2024-01-28",
    usageCount: 0,
  },
];

const mockLogs: EmailLog[] = [
  {
    id: "log-001",
    timestamp: "2024-02-07T10:30:15Z",
    status: "delivered",
    recipient: "john.smith@company.com",
    subject: "Welcome to Aether Identity!",
    templateName: "Welcome Email",
    providerId: "prov-sendgrid",
    providerName: "SendGrid Production",
    priority: "normal",
    deliveryTime: 245,
  },
  {
    id: "log-002",
    timestamp: "2024-02-07T10:28:42Z",
    status: "failed",
    recipient: "jane.doe@external.com",
    subject: "Your verification code: 123456",
    templateName: "MFA Verification",
    providerId: "prov-smtp-internal",
    providerName: "Internal SMTP",
    priority: "high",
    error: "Connection refused: smtp.company.com:587",
  },
  {
    id: "log-003",
    timestamp: "2024-02-07T10:25:00Z",
    status: "delivered",
    recipient: "admin@company.com",
    subject: "Security alert: Failed login attempt",
    templateName: "Security Alert",
    providerId: "prov-sendgrid",
    providerName: "SendGrid Production",
    priority: "high",
    deliveryTime: 189,
  },
  {
    id: "log-004",
    timestamp: "2024-02-07T10:20:18Z",
    status: "bounced",
    recipient: "invalid@nonexistent.com",
    subject: "Reset your password",
    templateName: "Password Reset",
    providerId: "prov-sendgrid",
    providerName: "SendGrid Production",
    priority: "normal",
    error: "550 5.1.1 Recipient address rejected: User unknown",
  },
  {
    id: "log-005",
    timestamp: "2024-02-07T10:15:30Z",
    status: "pending",
    recipient: "new.user@company.com",
    subject: "Welcome to Aether Identity!",
    templateName: "Welcome Email",
    providerId: "prov-sendgrid",
    providerName: "SendGrid Production",
    priority: "normal",
  },
  {
    id: "log-006",
    timestamp: "2024-02-07T10:10:00Z",
    status: "delivered",
    recipient: "security@company.com",
    subject: "Security alert: New device login",
    templateName: "Security Alert",
    providerId: "prov-ses",
    providerName: "AWS SES Backup",
    priority: "high",
    deliveryTime: 312,
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

export default function EmailIntegrationsPage() {
  // State
  const [providers, setProviders] =
    React.useState<EmailProvider[]>(mockProviders);
  const [templates] = React.useState<EmailTemplate[]>(mockTemplates);
  const [logs] = React.useState<EmailLog[]>(mockLogs);
  const [selectedProvider, setSelectedProvider] =
    React.useState<EmailProvider | null>(null);
  const [isConfigOpen, setIsConfigOpen] = React.useState(false);
  const [providerToDelete, setProviderToDelete] =
    React.useState<EmailProvider | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("providers");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterType, setFilterType] = React.useState<EmailProviderType | "all">(
    "all",
  );
  const [filterStatus, setFilterStatus] = React.useState<
    EmailProviderStatus | "all"
  >("all");
  const [showSecret, setShowSecret] = React.useState(false);
  const [testEmail, setTestEmail] = React.useState("");
  const [isTesting, setIsTesting] = React.useState(false);

  // Ref for unique IDs
  const providerCounterRef = React.useRef(0);

  // Derived state
  const stats: EmailStats = React.useMemo(() => {
    const active = providers.filter((p) => p.status === "active").length;
    const totalSent = providers.reduce((acc, p) => acc + p.emailsSent24h, 0);
    const avgSuccessRate =
      providers.length > 0
        ? providers.reduce((acc, p) => acc + p.successRate, 0) /
          providers.length
        : 0;
    const avgDeliveryTime =
      providers.length > 0
        ? providers.reduce((acc, p) => acc + p.avgDeliveryTime, 0) /
          providers.length
        : 0;

    return {
      totalEmails24h: totalSent,
      deliveredCount: Math.floor(totalSent * (avgSuccessRate / 100)),
      failedCount: Math.floor(totalSent * ((100 - avgSuccessRate) / 100)),
      pendingCount: logs.filter((l) => l.status === "pending").length,
      successRate: avgSuccessRate,
      avgDeliveryTime,
      activeProviders: active,
      totalProviders: providers.length,
      templateCount: templates.filter((t) => t.status === "active").length,
    };
  }, [providers, logs, templates]);

  const filteredProviders = React.useMemo(() => {
    return providers.filter((provider) => {
      const matchesSearch =
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === "all" || provider.type === filterType;
      const matchesStatus =
        filterStatus === "all" || provider.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [providers, searchQuery, filterType, filterStatus]);

  const hasErrors = providers.some((p) => p.status === "error");
  const hasPending = providers.some((p) => p.status === "configuring");

  // Handlers
  const handleToggleProvider = (providerId: string) => {
    setProviders((prev) =>
      prev.map((p) => {
        if (p.id !== providerId) return p;
        const newStatus = p.status === "active" ? "inactive" : "active";
        return { ...p, status: newStatus, updatedAt: new Date().toISOString() };
      }),
    );
  };

  const handleConfigure = (provider: EmailProvider) => {
    setSelectedProvider({ ...provider });
    setShowSecret(false);
    setIsConfigOpen(true);
  };

  const handleSaveConfiguration = () => {
    if (!selectedProvider) return;
    setProviders((prev) =>
      prev.map((p) =>
        p.id === selectedProvider.id
          ? { ...selectedProvider, updatedAt: new Date().toISOString() }
          : p,
      ),
    );
    setIsConfigOpen(false);
    setSelectedProvider(null);
  };

  const handleDelete = (provider: EmailProvider) => {
    setProviderToDelete(provider);
  };

  const confirmDelete = () => {
    if (!providerToDelete) return;
    setProviders((prev) => prev.filter((p) => p.id !== providerToDelete.id));
    setProviderToDelete(null);
  };

  const handleAddProvider = (type: EmailProviderType) => {
    providerCounterRef.current += 1;
    const timestamp = providerCounterRef.current;
    const newProvider: EmailProvider = {
      id: `prov-new-${timestamp}`,
      name: `New ${providerTypeConfig[type].label} Provider`,
      type,
      status: "configuring",
      description: "Configure this email provider",
      secure: type === "smtp",
      fromName: "",
      fromEmail: "",
      maxRetries: 3,
      timeout: 30000,
      healthStatus: "unknown",
      uptime: 0,
      emailsSent24h: 0,
      successRate: 0,
      avgDeliveryTime: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDefault: false,
      isManaged: type !== "smtp",
    };
    setProviders((prev) => [...prev, newProvider]);
    setIsAddDialogOpen(false);
    handleConfigure(newProvider);
  };

  const handleTestConnection = async () => {
    if (!testEmail) return;
    setIsTesting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsTesting(false);
    setIsTestDialogOpen(false);
    setTestEmail("");
    alert("Test email sent successfully!");
  };

  const handleCheckAllHealth = () => {
    setProviders((prev) =>
      prev.map((p) => ({
        ...p,
        healthStatus: p.status === "error" ? "critical" : "healthy",
        lastCheck: new Date().toISOString(),
      })),
    );
  };

  const handleSetDefault = (providerId: string) => {
    setProviders((prev) =>
      prev.map((p) => ({
        ...p,
        isDefault: p.id === providerId,
      })),
    );
  };

  // Render helpers
  const StatusBadge = ({ status }: { status: EmailProviderStatus }) => {
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

  const HealthBadge = ({
    status,
  }: {
    status: EmailProvider["healthStatus"];
  }) => {
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

  const TypeBadge = ({ type }: { type: EmailProviderType }) => {
    const config = providerTypeConfig[type];

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
                Identity Email Integrations
              </h1>
              {hasErrors && (
                <Badge variant="destructive" className="text-xs gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {providers.filter((p) => p.status === "error").length} errors
                </Badge>
              )}
              {hasPending && (
                <Badge
                  variant="outline"
                  className="text-xs text-amber-500 border-amber-500/30"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {
                    providers.filter((p) => p.status === "configuring").length
                  }{" "}
                  pending
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Manage email providers, templates, and delivery configuration
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleCheckAllHealth}
              className="gap-2"
            >
              <Activity className="h-4 w-4" />
              Health Check
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsTestDialogOpen(true)}
              className="gap-2"
            >
              <TestTube className="h-4 w-4" />
              Test Email
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Provider
            </Button>
          </div>
        </div>

        <ContextOverview
          authority="Acme Corporation"
          workspace="Production"
          role="Identity Administrator"
          accessLevel="Full email management"
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
              Delivery Overview
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Emails Sent (24h)"
              value={formatNumber(stats.totalEmails24h)}
              subtitle={`${formatNumber(stats.deliveredCount)} delivered`}
              icon={Send}
              variant={stats.successRate >= 99 ? "default" : "warning"}
              trend={{ value: 12.5, isPositive: true }}
            />
            <MetricCard
              title="Success Rate"
              value={`${stats.successRate.toFixed(1)}%`}
              subtitle="Delivery success rate"
              icon={CheckCircle2}
              variant={
                stats.successRate >= 99
                  ? "default"
                  : stats.successRate >= 95
                    ? "warning"
                    : "destructive"
              }
              trend={{ value: 0.8, isPositive: true }}
            />
            <MetricCard
              title="Active Providers"
              value={stats.activeProviders}
              subtitle={`${stats.totalProviders} total configured`}
              icon={Server}
              variant={hasErrors ? "destructive" : "default"}
              trend={{
                value: stats.activeProviders,
                isPositive: stats.activeProviders > 0,
              }}
            />
            <MetricCard
              title="Avg Delivery Time"
              value={`${Math.round(stats.avgDeliveryTime)}ms`}
              subtitle="End-to-end delivery"
              icon={Zap}
              variant={
                stats.avgDeliveryTime < 300
                  ? "default"
                  : stats.avgDeliveryTime < 500
                    ? "warning"
                    : "destructive"
              }
              trend={{ value: 15, isPositive: false }}
            />
          </div>

          {hasErrors && (
            <Alert
              variant="destructive"
              className="border-red-500/30 bg-red-500/10"
            >
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertTitle className="text-red-400">
                Provider Errors Detected
              </AlertTitle>
              <AlertDescription className="text-red-400/80">
                {providers.filter((p) => p.status === "error").length} email
                provider(s) experiencing connectivity issues. Review
                configurations and credentials.
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
            <TabsTrigger value="providers" className="gap-2">
              <Server className="h-4 w-4" />
              Providers
              <Badge variant="secondary" className="ml-1 text-xs">
                {providers.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-2">
              <LayoutTemplate className="h-4 w-4" />
              Templates
              <Badge variant="secondary" className="ml-1 text-xs">
                {templates.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-2">
              <History className="h-4 w-4" />
              Logs
              <Badge variant="secondary" className="ml-1 text-xs">
                {logs.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* PROVIDERS TAB */}
          <TabsContent value="providers" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search providers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={filterType}
                  onValueChange={(v) =>
                    setFilterType(v as EmailProviderType | "all")
                  }
                >
                  <SelectTrigger className="w-[160px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="smtp">SMTP</SelectItem>
                    <SelectItem value="api">API</SelectItem>
                    <SelectItem value="ses">Amazon SES</SelectItem>
                    <SelectItem value="sendgrid">SendGrid</SelectItem>
                    <SelectItem value="mailgun">Mailgun</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filterStatus}
                  onValueChange={(v) =>
                    setFilterStatus(v as EmailProviderStatus | "all")
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

            {/* Providers Grid */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredProviders.map((provider) => {
                const Icon = providerTypeConfig[provider.type].icon;
                const isError = provider.status === "error";
                const isConfiguring = provider.status === "configuring";

                return (
                  <Card
                    key={provider.id}
                    className={cn(
                      "border-border bg-card transition-all",
                      provider.status === "inactive" && "opacity-75",
                      isError && "border-red-500/30 shadow-red-500/5",
                      isConfiguring && "border-blue-500/30",
                      provider.isDefault && "ring-1 ring-emerald-500/30",
                    )}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-lg",
                              providerTypeConfig[provider.type].bgColor,
                            )}
                          >
                            <Icon
                              className={cn(
                                "h-5 w-5",
                                `text-${providerTypeConfig[provider.type].color}-500`,
                              )}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-sm font-medium text-foreground truncate">
                                {provider.name}
                              </CardTitle>
                              {provider.isDefault && (
                                <Badge
                                  variant="outline"
                                  className="text-xs gap-1 text-emerald-500 border-emerald-500/20"
                                >
                                  <Check className="h-3 w-3" />
                                  Default
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {provider.fromEmail}
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
                              onClick={() => handleConfigure(provider)}
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              Configure
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleSetDefault(provider.id)}
                              disabled={provider.isDefault}
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Set as Default
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleProvider(provider.id)}
                            >
                              {provider.status === "active" ? (
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
                              onClick={() => handleDelete(provider)}
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
                        <StatusBadge status={provider.status} />
                        <HealthBadge status={provider.healthStatus} />
                        <TypeBadge type={provider.type} />
                      </div>

                      {/* Description */}
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {provider.description}
                      </p>

                      {/* Metrics Row */}
                      {provider.status === "active" && (
                        <div className="grid grid-cols-3 gap-2 py-3 border-y border-border">
                          <div className="text-center">
                            <p className="text-lg font-semibold text-foreground">
                              {formatNumber(provider.emailsSent24h)}
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase">
                              24h Sent
                            </p>
                          </div>
                          <div className="text-center">
                            <p
                              className={cn(
                                "text-lg font-semibold",
                                provider.successRate >= 99
                                  ? "text-emerald-500"
                                  : provider.successRate >= 95
                                    ? "text-amber-500"
                                    : "text-red-500",
                              )}
                            >
                              {provider.successRate.toFixed(1)}%
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase">
                              Success
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-semibold text-foreground">
                              {provider.avgDeliveryTime}ms
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase">
                              Avg Time
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
                                Provider is not responding. Check credentials
                                and connection settings.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Last Check */}
                      {provider.lastCheck && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            Last check: {formatRelativeTime(provider.lastCheck)}
                          </span>
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <Switch
                            id={`${provider.id}-toggle`}
                            checked={provider.status === "active"}
                            onCheckedChange={() =>
                              handleToggleProvider(provider.id)
                            }
                            disabled={
                              provider.status === "configuring" ||
                              provider.status === "error"
                            }
                          />
                          <Label
                            htmlFor={`${provider.id}-toggle`}
                            className="text-sm text-muted-foreground cursor-pointer"
                          >
                            {provider.status === "active"
                              ? "Enabled"
                              : "Disabled"}
                          </Label>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleConfigure(provider)}
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

            {filteredProviders.length === 0 && (
              <Card className="border-dashed border-2 border-border bg-card/50">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary mb-4">
                    <Server className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-sm font-medium text-foreground mb-1">
                    No providers found
                  </h3>
                  <p className="text-xs text-muted-foreground text-center max-w-xs">
                    {searchQuery ||
                    filterType !== "all" ||
                    filterStatus !== "all"
                      ? "Try adjusting your search or filters"
                      : "Configure your first email provider to get started"}
                  </p>
                  {!searchQuery &&
                    filterType === "all" &&
                    filterStatus === "all" && (
                      <Button
                        onClick={() => setIsAddDialogOpen(true)}
                        className="mt-4 gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add First Provider
                      </Button>
                    )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* TEMPLATES TAB */}
          <TabsContent value="templates" className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">
                        Total Templates
                      </p>
                      <p className="text-2xl font-semibold">
                        {templates.length}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <LayoutTemplate className="h-5 w-5 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">
                        Active
                      </p>
                      <p className="text-2xl font-semibold">
                        {templates.filter((t) => t.status === "active").length}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">
                        Drafts
                      </p>
                      <p className="text-2xl font-semibold">
                        {templates.filter((t) => t.status === "draft").length}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-amber-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">
                        Total Usage
                      </p>
                      <p className="text-2xl font-semibold">
                        {formatNumber(
                          templates.reduce((acc, t) => acc + t.usageCount, 0),
                        )}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-violet-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Templates Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {templates.map((template) => {
                const categoryConfig =
                  templateCategoryConfig[template.category];

                return (
                  <Card
                    key={template.id}
                    className={cn(
                      "border-border bg-card transition-all",
                      template.status === "draft" && "opacity-75",
                    )}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-lg",
                              categoryConfig.bgColor,
                            )}
                          >
                            <Mail
                              className={cn("h-5 w-5", categoryConfig.color)}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-foreground">
                                {template.name}
                              </h3>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs",
                                  categoryConfig.bgColor,
                                  categoryConfig.color,
                                )}
                              >
                                {categoryConfig.label}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {template.description}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            template.status === "active"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {template.status === "active" ? "Active" : "Draft"}
                        </Badge>
                      </div>

                      {/* Subject */}
                      <div className="bg-secondary/50 rounded-md p-3 mb-4">
                        <p className="text-xs text-muted-foreground mb-1">
                          Subject:
                        </p>
                        <p className="text-sm font-medium text-foreground truncate">
                          {template.subject}
                        </p>
                      </div>

                      {/* Variables */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {template.variables.map((variable) => (
                          <Badge
                            key={variable}
                            variant="outline"
                            className="text-xs font-mono bg-secondary/50"
                          >
                            {`{{${variable}}}`}
                          </Badge>
                        ))}
                      </div>

                      {/* Stats & Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{formatNumber(template.usageCount)} uses</span>
                          <span>Modified {template.lastModified}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            Preview
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Settings className="h-3.5 w-3.5" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* LOGS TAB */}
          <TabsContent value="logs" className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <History className="h-4 w-4 text-muted-foreground" />
                    Recent Email Activity
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-muted-foreground">Live</span>
                  </div>
                </div>
                <CardDescription>
                  Email delivery events and status changes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {logs.map((log) => {
                  const statusConfig = logStatusConfig[log.status];
                  const StatusIcon = statusConfig.icon;

                  return (
                    <div
                      key={log.id}
                      className="flex items-start gap-3 py-3 border-b border-border last:border-0"
                    >
                      <div
                        className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                          statusConfig.bgColor,
                        )}
                      >
                        <StatusIcon
                          className={cn("h-4 w-4", statusConfig.color)}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-foreground">
                            {log.subject}
                          </p>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              statusConfig.bgColor,
                              statusConfig.color,
                            )}
                          >
                            {statusConfig.label}
                          </Badge>
                          {log.priority === "high" && (
                            <Badge
                              variant="outline"
                              className="text-xs text-red-500"
                            >
                              High Priority
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>To: {log.recipient}</span>
                          <span>•</span>
                          <Badge variant="outline" className="text-xs">
                            {log.providerName}
                          </Badge>
                          {log.templateName && (
                            <>
                              <span>•</span>
                              <span className="text-xs">
                                {log.templateName}
                              </span>
                            </>
                          )}
                        </div>
                        {log.error && (
                          <p className="text-xs text-red-500 mt-1">
                            {log.error}
                          </p>
                        )}
                        {log.deliveryTime && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Delivered in {log.deliveryTime}ms
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {formatRelativeTime(log.timestamp)}
                      </span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Link href="/admin/integrations/logs">
                <Button variant="outline" className="gap-2">
                  View Full Email Logs
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </TabsContent>

          {/* SETTINGS TAB */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Global Settings */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    Global Email Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm">Retry Failed Emails</Label>
                        <p className="text-xs text-muted-foreground">
                          Automatically retry failed deliveries
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm">Rate Limiting</Label>
                        <p className="text-xs text-muted-foreground">
                          Enforce rate limits per provider
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm">Email Tracking</Label>
                        <p className="text-xs text-muted-foreground">
                          Track opens and clicks
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm">Bounce Handling</Label>
                        <p className="text-xs text-muted-foreground">
                          Automatically process bounces
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    Security & Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm">DKIM Signing</Label>
                        <p className="text-xs text-muted-foreground">
                          Sign outgoing emails with DKIM
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm">SPF Validation</Label>
                        <p className="text-xs text-muted-foreground">
                          Validate SPF records
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm">Encryption</Label>
                        <p className="text-xs text-muted-foreground">
                          Use TLS for all connections
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Delivery Settings */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Default Delivery Settings
                </CardTitle>
                <CardDescription>
                  Configure fallback and delivery behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max-retries">Max Retries</Label>
                    <Input
                      id="max-retries"
                      type="number"
                      defaultValue={3}
                      min={1}
                      max={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeout">Timeout (ms)</Label>
                    <Input
                      id="timeout"
                      type="number"
                      defaultValue={30000}
                      min={5000}
                      step={1000}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="batch-size">Batch Size</Label>
                    <Input
                      id="batch-size"
                      type="number"
                      defaultValue={100}
                      min={10}
                      max={1000}
                    />
                  </div>
                </div>

                <div className="rounded-md bg-secondary/50 p-3">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Note:</strong> These
                    settings apply to all email providers unless overridden in
                    provider-specific configuration.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* =========================================================================
            DIALOGS
            ========================================================================= */}

        {/* Add Provider Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Email Provider</DialogTitle>
              <DialogDescription>
                Select the type of email provider to configure
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 py-4">
              {(Object.keys(providerTypeConfig) as EmailProviderType[]).map(
                (type) => {
                  const config = providerTypeConfig[type];
                  const Icon = config.icon;

                  return (
                    <Button
                      key={type}
                      variant="outline"
                      className="flex flex-col items-center gap-2 h-auto py-4 justify-start"
                      onClick={() => handleAddProvider(type)}
                    >
                      <div
                        className={cn(
                          "h-10 w-10 rounded-lg flex items-center justify-center",
                          config.bgColor,
                        )}
                      >
                        <Icon
                          className={cn("h-5 w-5", `text-${config.color}-500`)}
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">{config.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {config.description}
                        </p>
                      </div>
                    </Button>
                  );
                },
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Configuration Dialog */}
        <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedProvider && (
                  <div
                    className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center",
                      providerTypeConfig[selectedProvider.type].bgColor,
                    )}
                  >
                    {React.createElement(
                      providerTypeConfig[selectedProvider.type].icon,
                      {
                        className: cn(
                          "h-4 w-4",
                          `text-${providerTypeConfig[selectedProvider.type].color}-500`,
                        ),
                      },
                    )}
                  </div>
                )}
                Configure {selectedProvider?.name}
              </DialogTitle>
              <DialogDescription>
                Update email provider settings and connection parameters
              </DialogDescription>
            </DialogHeader>

            {selectedProvider && (
              <div className="space-y-6 py-4">
                {/* Basic Settings */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-foreground">
                    Basic Settings
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="from-name">From Name</Label>
                      <Input
                        id="from-name"
                        value={selectedProvider.fromName}
                        onChange={(e) =>
                          setSelectedProvider({
                            ...selectedProvider,
                            fromName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="from-email">From Email</Label>
                      <Input
                        id="from-email"
                        type="email"
                        value={selectedProvider.fromEmail}
                        onChange={(e) =>
                          setSelectedProvider({
                            ...selectedProvider,
                            fromEmail: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {selectedProvider.replyTo && (
                    <div className="space-y-2">
                      <Label htmlFor="reply-to">Reply-To</Label>
                      <Input
                        id="reply-to"
                        type="email"
                        value={selectedProvider.replyTo}
                        onChange={(e) =>
                          setSelectedProvider({
                            ...selectedProvider,
                            replyTo: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}
                </div>

                <Separator />

                {/* Connection Settings */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-foreground">
                    Connection Settings
                  </h3>

                  {selectedProvider.type === "smtp" && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="smtp-host">SMTP Host</Label>
                          <Input
                            id="smtp-host"
                            value={selectedProvider.host || ""}
                            onChange={(e) =>
                              setSelectedProvider({
                                ...selectedProvider,
                                host: e.target.value,
                              })
                            }
                            placeholder="smtp.example.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="smtp-port">Port</Label>
                          <Input
                            id="smtp-port"
                            type="number"
                            value={selectedProvider.port || ""}
                            onChange={(e) =>
                              setSelectedProvider({
                                ...selectedProvider,
                                port: parseInt(e.target.value),
                              })
                            }
                            placeholder="587"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          id="smtp-secure"
                          checked={selectedProvider.secure}
                          onCheckedChange={(checked) =>
                            setSelectedProvider({
                              ...selectedProvider,
                              secure: checked,
                            })
                          }
                        />
                        <Label htmlFor="smtp-secure">Use TLS/SSL</Label>
                      </div>
                    </>
                  )}

                  {(selectedProvider.type === "smtp" ||
                    selectedProvider.username) && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={selectedProvider.username || ""}
                          onChange={(e) =>
                            setSelectedProvider({
                              ...selectedProvider,
                              username: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showSecret ? "text" : "password"}
                            value={selectedProvider.password || ""}
                            onChange={(e) =>
                              setSelectedProvider({
                                ...selectedProvider,
                                password: e.target.value,
                              })
                            }
                            placeholder={
                              selectedProvider.password
                                ? "••••••••"
                                : "Enter password"
                            }
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                            onClick={() => setShowSecret(!showSecret)}
                          >
                            {showSecret ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </>
                  )}

                  {(selectedProvider.type === "sendgrid" ||
                    selectedProvider.type === "mailgun" ||
                    selectedProvider.type === "api") && (
                    <div className="space-y-2">
                      <Label htmlFor="api-key">API Key</Label>
                      <div className="relative">
                        <Input
                          id="api-key"
                          type={showSecret ? "text" : "password"}
                          value={selectedProvider.apiKey || ""}
                          onChange={(e) =>
                            setSelectedProvider({
                              ...selectedProvider,
                              apiKey: e.target.value,
                            })
                          }
                          placeholder={
                            selectedProvider.apiKey
                              ? "••••••••"
                              : "Enter API key"
                          }
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                          onClick={() => setShowSecret(!showSecret)}
                        >
                          {showSecret ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {selectedProvider.type === "ses" && (
                    <div className="space-y-2">
                      <Label htmlFor="region">AWS Region</Label>
                      <Select
                        value={selectedProvider.region || "us-east-1"}
                        onValueChange={(value) =>
                          setSelectedProvider({
                            ...selectedProvider,
                            region: value,
                          })
                        }
                      >
                        <SelectTrigger id="region">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us-east-1">
                            US East (N. Virginia)
                          </SelectItem>
                          <SelectItem value="us-west-2">
                            US West (Oregon)
                          </SelectItem>
                          <SelectItem value="eu-west-1">
                            EU (Ireland)
                          </SelectItem>
                          <SelectItem value="eu-central-1">
                            EU (Frankfurt)
                          </SelectItem>
                          <SelectItem value="ap-southeast-1">
                            Asia Pacific (Singapore)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Delivery Options */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-foreground">
                    Delivery Options
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="max-retries">Max Retries</Label>
                      <Input
                        id="max-retries"
                        type="number"
                        value={selectedProvider.maxRetries}
                        onChange={(e) =>
                          setSelectedProvider({
                            ...selectedProvider,
                            maxRetries: parseInt(e.target.value),
                          })
                        }
                        min={0}
                        max={10}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeout">Timeout (ms)</Label>
                      <Input
                        id="timeout"
                        type="number"
                        value={selectedProvider.timeout}
                        onChange={(e) =>
                          setSelectedProvider({
                            ...selectedProvider,
                            timeout: parseInt(e.target.value),
                          })
                        }
                        min={1000}
                        step={1000}
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter>
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

        {/* Test Email Dialog */}
        <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Send Test Email
              </DialogTitle>
              <DialogDescription>
                Send a test email to verify provider configuration
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="test-email">Recipient Email</Label>
                <Input
                  id="test-email"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="Enter recipient email"
                />
              </div>
              <div className="rounded-md bg-secondary/50 p-3">
                <p className="text-xs text-muted-foreground">
                  A test email will be sent using your default provider. Check
                  your inbox to confirm delivery.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsTestDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleTestConnection}
                disabled={!testEmail || isTesting}
                className="gap-2"
              >
                {isTesting ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {isTesting ? "Sending..." : "Send Test"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog
          open={!!providerToDelete}
          onOpenChange={() => setProviderToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Email Provider</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &quot;{providerToDelete?.name}
                &quot;? This action cannot be undone. Active emails will be
                routed to the default provider.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Provider
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}
