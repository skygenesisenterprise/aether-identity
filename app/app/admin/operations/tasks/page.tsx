"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/dashboard/ui/card";
import { Badge } from "@/components/dashboard/ui/badge";
import { Button } from "@/components/dashboard/ui/button";
import { Progress } from "@/components/dashboard/ui/progress";
import { MetricCard } from "@/components/dashboard/metric-card";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/dashboard/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/dashboard/ui/tabs";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dashboard/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/dashboard/ui/tooltip";
import { Switch } from "@/components/dashboard/ui/switch";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  BarChart3,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Database,
  Edit3,
  Eye,
  FileText,
  Filter,
  History,
  Info,
  LayoutGrid,
  List,
  Loader2,
  Lock,
  MoreHorizontal,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  SkipForward,
  StopCircle,
  Terminal,
  Trash2,
  User,
  Users,
  XCircle,
  Zap,
  Server,
  HardDrive,
  Globe,
  Building2,
  Wrench,
} from "lucide-react";

// ============================================================================
// TYPES - Task Management System
// ============================================================================

type TaskStatus =
  | "running"
  | "scheduled"
  | "success"
  | "failed"
  | "paused"
  | "pending"
  | "cancelled"
  | "retrying";

type TaskType =
  | "system"
  | "integration"
  | "backup"
  | "maintenance"
  | "custom"
  | "migration"
  | "cleanup"
  | "sync";

type TaskInitiator = "system" | "admin" | "api" | "schedule" | "webhook";

type ExecutionStatus =
  | "running"
  | "completed"
  | "failed"
  | "cancelled"
  | "timeout"
  | "skipped";

type ScheduleType = "cron" | "interval" | "once" | "manual";

type AlertSeverity = "critical" | "high" | "medium" | "low" | "info";

type AlertType = "failure" | "timeout" | "stuck" | "performance" | "resource";

interface TaskSchedule {
  type: ScheduleType;
  cronExpression?: string;
  intervalMinutes?: number;
  nextRunAt: string | null;
  timezone: string;
  retryPolicy: {
    maxRetries: number;
    retryDelaySeconds: number;
    exponentialBackoff: boolean;
  };
  timeoutMinutes: number;
  parallelism: number;
}

interface TaskExecution {
  id: string;
  taskId: string;
  status: ExecutionStatus;
  startedAt: string;
  completedAt?: string;
  duration?: number;
  logs: ExecutionLog[];
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
  correlationId: string;
  initiatedBy: TaskInitiator;
  initiatedByUser?: string;
  payload?: Record<string, unknown>;
  output?: Record<string, unknown>;
  affectedResources: string[];
}

interface ExecutionLog {
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  message: string;
  source: string;
  metadata?: Record<string, unknown>;
}

interface TaskAlert {
  id: string;
  taskId: string;
  severity: AlertSeverity;
  type: AlertType;
  message: string;
  triggeredAt: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  notificationsSent: string[];
}

interface TaskPermission {
  canView: boolean;
  canRun: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canPause: boolean;
  minRole: string;
  allowedUsers: string[];
}

interface TaskAuditEvent {
  id: string;
  taskId: string;
  timestamp: string;
  actor: string;
  actorType: "user" | "system" | "api";
  action: string;
  changes: Record<string, { old: unknown; new: unknown }>;
  correlationId: string;
  ipAddress?: string;
}

interface Task {
  id: string;
  name: string;
  description: string;
  type: TaskType;
  status: TaskStatus;
  schedule: TaskSchedule;
  lastExecution?: TaskExecution;
  lastSuccessAt?: string;
  lastFailureAt?: string;
  totalExecutions: number;
  successCount: number;
  failureCount: number;
  averageDuration: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isSystemTask: boolean;
  isEditable: boolean;
  initiator: TaskInitiator;
  tags: string[];
  impact: {
    users?: number;
    services?: string[];
    directories?: string[];
  };
  permissions: TaskPermission;
  alerts: TaskAlert[];
  auditLog: TaskAuditEvent[];
  executionHistory: TaskExecution[];
}

interface TaskStats {
  activeTasks: number;
  scheduledTasks: number;
  failedTasks24h: number;
  failedTasks7d: number;
  averageExecutionTime: number;
  nextScheduledTask: {
    name: string;
    scheduledAt: string;
  } | null;
  totalExecutions24h: number;
  successRate24h: number;
}

interface OrganizationContext {
  id: string;
  name: string;
  plan: "free" | "pro" | "enterprise";
  isSelfHosted: boolean;
  region: string;
  userRole: string;
  userPermissions: string[];
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const taskStatusConfig: Record<
  TaskStatus,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  running: {
    label: "Running",
    icon: Loader2,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  scheduled: {
    label: "Scheduled",
    icon: Calendar,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
  success: {
    label: "Success",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/20",
  },
  paused: {
    label: "Paused",
    icon: Pause,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
  },
  cancelled: {
    label: "Cancelled",
    icon: StopCircle,
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
    borderColor: "border-gray-500/20",
  },
  retrying: {
    label: "Retrying",
    icon: RefreshCw,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
  },
};

const taskTypeConfig: Record<
  TaskType,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    description: string;
  }
> = {
  system: {
    label: "System",
    icon: Settings,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    description: "Core system operations and maintenance",
  },
  integration: {
    label: "Integration",
    icon: Globe,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    description: "Third-party integrations and connectors",
  },
  backup: {
    label: "Backup",
    icon: HardDrive,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    description: "Data backup and recovery operations",
  },
  maintenance: {
    label: "Maintenance",
    icon: Wrench,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    description: "System maintenance and optimization",
  },
  custom: {
    label: "Custom",
    icon: FileText,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    description: "User-defined custom tasks",
  },
  migration: {
    label: "Migration",
    icon: Database,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    description: "Data migration and transformation",
  },
  cleanup: {
    label: "Cleanup",
    icon: Trash2,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    description: "Data cleanup and archival",
  },
  sync: {
    label: "Sync",
    icon: RefreshCw,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    description: "Directory and data synchronization",
  },
};

const executionStatusConfig: Record<
  ExecutionStatus,
  {
    label: string;
    icon: React.ElementType;
    color: string;
  }
> = {
  running: {
    label: "Running",
    icon: Loader2,
    color: "text-blue-500",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    color: "text-emerald-500",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    color: "text-destructive",
  },
  cancelled: {
    label: "Cancelled",
    icon: StopCircle,
    color: "text-gray-500",
  },
  timeout: {
    label: "Timeout",
    icon: Clock,
    color: "text-amber-500",
  },
  skipped: {
    label: "Skipped",
    icon: SkipForward,
    color: "text-muted-foreground",
  },
};

const alertSeverityConfig: Record<
  AlertSeverity,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
  }
> = {
  critical: {
    label: "Critical",
    icon: ShieldAlert,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  high: {
    label: "High",
    icon: AlertTriangle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  medium: {
    label: "Medium",
    icon: AlertCircle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  low: {
    label: "Low",
    icon: Info,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  info: {
    label: "Info",
    icon: Info,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
};

const initiatorConfig: Record<
  TaskInitiator,
  {
    label: string;
    icon: React.ElementType;
    color: string;
  }
> = {
  system: {
    label: "System",
    icon: Settings,
    color: "text-blue-500",
  },
  admin: {
    label: "Admin",
    icon: User,
    color: "text-purple-500",
  },
  api: {
    label: "API",
    icon: Globe,
    color: "text-cyan-500",
  },
  schedule: {
    label: "Schedule",
    icon: Calendar,
    color: "text-emerald-500",
  },
  webhook: {
    label: "Webhook",
    icon: Zap,
    color: "text-amber-500",
  },
};

// ============================================================================
// MOCK DATA - Enterprise Task Management
// ============================================================================

const organizationContext: OrganizationContext = {
  id: "org_acme_corp",
  name: "Acme Corporation",
  plan: "enterprise",
  isSelfHosted: false,
  region: "US-East",
  userRole: "Platform Admin",
  userPermissions: [
    "tasks:read",
    "tasks:write",
    "tasks:delete",
    "tasks:run",
    "tasks:pause",
  ],
};

const taskStats: TaskStats = {
  activeTasks: 12,
  scheduledTasks: 28,
  failedTasks24h: 3,
  failedTasks7d: 8,
  averageExecutionTime: 245,
  nextScheduledTask: {
    name: "Directory Sync - Active Directory",
    scheduledAt: "2026-02-12T15:00:00Z",
  },
  totalExecutions24h: 156,
  successRate24h: 98.1,
};

const mockTasks: Task[] = [
  // System Tasks
  {
    id: "task_system_cleanup",
    name: "System Cleanup",
    description:
      "Automated cleanup of temporary files, logs, and expired sessions",
    type: "system",
    status: "success",
    schedule: {
      type: "cron",
      cronExpression: "0 2 * * *",
      nextRunAt: "2026-02-13T02:00:00Z",
      timezone: "UTC",
      retryPolicy: {
        maxRetries: 3,
        retryDelaySeconds: 60,
        exponentialBackoff: true,
      },
      timeoutMinutes: 30,
      parallelism: 1,
    },
    lastExecution: {
      id: "exec_001",
      taskId: "task_system_cleanup",
      status: "completed",
      startedAt: "2026-02-12T02:00:00Z",
      completedAt: "2026-02-12T02:15:23Z",
      duration: 923,
      logs: [
        {
          timestamp: "2026-02-12T02:00:00Z",
          level: "info",
          message: "Starting system cleanup",
          source: "cleanup-service",
        },
        {
          timestamp: "2026-02-12T02:05:12Z",
          level: "info",
          message: "Cleaned 1,247 expired sessions",
          source: "session-manager",
        },
        {
          timestamp: "2026-02-12T02:10:45Z",
          level: "info",
          message: "Removed 3.2GB of temporary files",
          source: "cleanup-service",
        },
        {
          timestamp: "2026-02-12T02:15:23Z",
          level: "info",
          message: "Cleanup completed successfully",
          source: "cleanup-service",
        },
      ],
      correlationId: "corr_cleanup_001",
      initiatedBy: "schedule",
      affectedResources: ["temp_files", "sessions", "logs"],
    },
    lastSuccessAt: "2026-02-12T02:15:23Z",
    totalExecutions: 156,
    successCount: 154,
    failureCount: 2,
    averageDuration: 850,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2026-02-12T02:15:23Z",
    createdBy: "system",
    isSystemTask: true,
    isEditable: false,
    initiator: "schedule",
    tags: ["maintenance", "cleanup", "automated"],
    impact: {
      services: ["core"],
    },
    permissions: {
      canView: true,
      canRun: true,
      canEdit: false,
      canDelete: false,
      canPause: true,
      minRole: "operator",
      allowedUsers: [],
    },
    alerts: [],
    auditLog: [],
    executionHistory: [],
  },
  {
    id: "task_health_check",
    name: "Health Check Monitor",
    description: "Continuous health monitoring of all system services",
    type: "system",
    status: "running",
    schedule: {
      type: "interval",
      intervalMinutes: 5,
      nextRunAt: "2026-02-12T14:05:00Z",
      timezone: "UTC",
      retryPolicy: {
        maxRetries: 2,
        retryDelaySeconds: 30,
        exponentialBackoff: false,
      },
      timeoutMinutes: 2,
      parallelism: 5,
    },
    lastExecution: {
      id: "exec_002",
      taskId: "task_health_check",
      status: "completed",
      startedAt: "2026-02-12T14:00:00Z",
      completedAt: "2026-02-12T14:00:45Z",
      duration: 45,
      logs: [
        {
          timestamp: "2026-02-12T14:00:00Z",
          level: "info",
          message: "Starting health checks for 12 services",
          source: "health-monitor",
        },
        {
          timestamp: "2026-02-12T14:00:30Z",
          level: "info",
          message: "All services responding within SLA",
          source: "health-monitor",
        },
      ],
      correlationId: "corr_health_002",
      initiatedBy: "schedule",
      affectedResources: ["api_gateway", "auth_service", "database"],
    },
    lastSuccessAt: "2026-02-12T14:00:45Z",
    totalExecutions: 2880,
    successCount: 2875,
    failureCount: 5,
    averageDuration: 42,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2026-02-12T14:00:45Z",
    createdBy: "system",
    isSystemTask: true,
    isEditable: false,
    initiator: "system",
    tags: ["monitoring", "health", "critical"],
    impact: {
      services: ["all"],
    },
    permissions: {
      canView: true,
      canRun: false,
      canEdit: false,
      canDelete: false,
      canPause: false,
      minRole: "viewer",
      allowedUsers: [],
    },
    alerts: [],
    auditLog: [],
    executionHistory: [],
  },

  // Integration Tasks
  {
    id: "task_ad_sync",
    name: "Directory Sync - Active Directory",
    description: "Synchronize users and groups from Active Directory",
    type: "sync",
    status: "scheduled",
    schedule: {
      type: "cron",
      cronExpression: "0 */4 * * *",
      nextRunAt: "2026-02-12T15:00:00Z",
      timezone: "America/New_York",
      retryPolicy: {
        maxRetries: 5,
        retryDelaySeconds: 300,
        exponentialBackoff: true,
      },
      timeoutMinutes: 60,
      parallelism: 3,
    },
    lastExecution: {
      id: "exec_003",
      taskId: "task_ad_sync",
      status: "completed",
      startedAt: "2026-02-12T11:00:00Z",
      completedAt: "2026-02-12T11:23:45Z",
      duration: 1425,
      logs: [
        {
          timestamp: "2026-02-12T11:00:00Z",
          level: "info",
          message: "Starting AD sync for domain acme.corp",
          source: "ad-connector",
        },
        {
          timestamp: "2026-02-12T11:05:30Z",
          level: "info",
          message: "Fetched 2,847 users, 156 groups",
          source: "ad-connector",
        },
        {
          timestamp: "2026-02-12T11:20:15Z",
          level: "info",
          message:
            "Processed 247 changes (23 new, 198 updated, 26 deactivated)",
          source: "sync-processor",
        },
        {
          timestamp: "2026-02-12T11:23:45Z",
          level: "info",
          message: "Sync completed successfully",
          source: "sync-processor",
        },
      ],
      correlationId: "corr_ad_sync_003",
      initiatedBy: "schedule",
      affectedResources: ["users", "groups", "directory_ad"],
    },
    lastSuccessAt: "2026-02-12T11:23:45Z",
    totalExecutions: 432,
    successCount: 428,
    failureCount: 4,
    averageDuration: 1350,
    createdAt: "2025-03-15T10:00:00Z",
    updatedAt: "2026-02-12T11:23:45Z",
    createdBy: "admin@acme.com",
    isSystemTask: false,
    isEditable: true,
    initiator: "schedule",
    tags: ["directory", "sync", "ad", "scim"],
    impact: {
      users: 2847,
      services: ["identity", "provisioning"],
      directories: ["Active Directory"],
    },
    permissions: {
      canView: true,
      canRun: true,
      canEdit: true,
      canDelete: true,
      canPause: true,
      minRole: "admin",
      allowedUsers: ["admin@acme.com", "devops@acme.com"],
    },
    alerts: [],
    auditLog: [],
    executionHistory: [],
  },
  {
    id: "task_azure_sync",
    name: "Directory Sync - Azure AD",
    description: "Synchronize users and groups from Azure Active Directory",
    type: "sync",
    status: "failed",
    schedule: {
      type: "cron",
      cronExpression: "0 */6 * * *",
      nextRunAt: "2026-02-12T17:00:00Z",
      timezone: "UTC",
      retryPolicy: {
        maxRetries: 3,
        retryDelaySeconds: 600,
        exponentialBackoff: true,
      },
      timeoutMinutes: 90,
      parallelism: 3,
    },
    lastExecution: {
      id: "exec_004",
      taskId: "task_azure_sync",
      status: "failed",
      startedAt: "2026-02-12T08:00:00Z",
      completedAt: "2026-02-12T08:15:23Z",
      duration: 923,
      logs: [
        {
          timestamp: "2026-02-12T08:00:00Z",
          level: "info",
          message: "Starting Azure AD sync",
          source: "azure-connector",
        },
        {
          timestamp: "2026-02-12T08:05:45Z",
          level: "info",
          message: "Authenticated to Microsoft Graph API",
          source: "azure-connector",
        },
        {
          timestamp: "2026-02-12T08:10:30Z",
          level: "warn",
          message: "Rate limit approaching: 850/1000 requests",
          source: "azure-connector",
        },
        {
          timestamp: "2026-02-12T08:15:23Z",
          level: "error",
          message: "Sync failed: Microsoft Graph API rate limit exceeded",
          source: "azure-connector",
        },
        {
          timestamp: "2026-02-12T08:15:23Z",
          level: "error",
          message: "Retry scheduled in 10 minutes",
          source: "task-scheduler",
        },
      ],
      error: {
        message: "Microsoft Graph API rate limit exceeded (429)",
        code: "RATE_LIMIT_EXCEEDED",
      },
      correlationId: "corr_azure_sync_004",
      initiatedBy: "schedule",
      affectedResources: ["directory_azure"],
    },
    lastFailureAt: "2026-02-12T08:15:23Z",
    totalExecutions: 289,
    successCount: 285,
    failureCount: 4,
    averageDuration: 1200,
    createdAt: "2025-04-01T12:00:00Z",
    updatedAt: "2026-02-12T08:15:23Z",
    createdBy: "admin@acme.com",
    isSystemTask: false,
    isEditable: true,
    initiator: "schedule",
    tags: ["directory", "sync", "azure", "microsoft"],
    impact: {
      users: 1563,
      services: ["identity", "provisioning"],
      directories: ["Azure AD"],
    },
    permissions: {
      canView: true,
      canRun: true,
      canEdit: true,
      canDelete: true,
      canPause: true,
      minRole: "admin",
      allowedUsers: [],
    },
    alerts: [
      {
        id: "alert_001",
        taskId: "task_azure_sync",
        severity: "high",
        type: "failure",
        message: "Azure AD sync failed 3 times in the last 24 hours",
        triggeredAt: "2026-02-12T08:15:30Z",
        acknowledged: false,
        notificationsSent: ["email", "webhook"],
      },
    ],
    auditLog: [],
    executionHistory: [],
  },

  // Backup Tasks
  {
    id: "task_full_backup",
    name: "Full Database Backup",
    description: "Complete backup of all databases and configuration",
    type: "backup",
    status: "success",
    schedule: {
      type: "cron",
      cronExpression: "0 1 * * *",
      nextRunAt: "2026-02-13T01:00:00Z",
      timezone: "UTC",
      retryPolicy: {
        maxRetries: 2,
        retryDelaySeconds: 300,
        exponentialBackoff: true,
      },
      timeoutMinutes: 120,
      parallelism: 1,
    },
    lastExecution: {
      id: "exec_005",
      taskId: "task_full_backup",
      status: "completed",
      startedAt: "2026-02-12T01:00:00Z",
      completedAt: "2026-02-12T01:45:12Z",
      duration: 2712,
      logs: [
        {
          timestamp: "2026-02-12T01:00:00Z",
          level: "info",
          message: "Starting full database backup",
          source: "backup-service",
        },
        {
          timestamp: "2026-02-12T01:15:30Z",
          level: "info",
          message: "Backing up identity database (42GB)",
          source: "backup-service",
        },
        {
          timestamp: "2026-02-12T01:30:45Z",
          level: "info",
          message: "Backing up audit logs (12GB)",
          source: "backup-service",
        },
        {
          timestamp: "2026-02-12T01:45:12Z",
          level: "info",
          message: "Backup completed: 54GB uploaded to S3",
          source: "backup-service",
        },
      ],
      correlationId: "corr_backup_005",
      initiatedBy: "schedule",
      affectedResources: ["database", "audit_logs", "config"],
      output: {
        backupSize: "54GB",
        location: "s3://acme-backups/full/2026-02-12",
        retention: "90 days",
      },
    },
    lastSuccessAt: "2026-02-12T01:45:12Z",
    totalExecutions: 365,
    successCount: 365,
    failureCount: 0,
    averageDuration: 2640,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2026-02-12T01:45:12Z",
    createdBy: "system",
    isSystemTask: true,
    isEditable: true,
    initiator: "schedule",
    tags: ["backup", "database", "critical", "compliance"],
    impact: {
      services: ["all"],
    },
    permissions: {
      canView: true,
      canRun: true,
      canEdit: false,
      canDelete: false,
      canPause: true,
      minRole: "admin",
      allowedUsers: [],
    },
    alerts: [],
    auditLog: [],
    executionHistory: [],
  },

  // Maintenance Tasks
  {
    id: "task_index_rebuild",
    name: "Search Index Rebuild",
    description: "Rebuild Lucene search indexes for user directory",
    type: "maintenance",
    status: "paused",
    schedule: {
      type: "cron",
      cronExpression: "0 3 * * 0",
      nextRunAt: "2026-02-16T03:00:00Z",
      timezone: "UTC",
      retryPolicy: {
        maxRetries: 1,
        retryDelaySeconds: 60,
        exponentialBackoff: false,
      },
      timeoutMinutes: 180,
      parallelism: 2,
    },
    lastExecution: {
      id: "exec_006",
      taskId: "task_index_rebuild",
      status: "completed",
      startedAt: "2026-02-09T03:00:00Z",
      completedAt: "2026-02-09T04:12:33Z",
      duration: 4353,
      logs: [
        {
          timestamp: "2026-02-09T03:00:00Z",
          level: "info",
          message: "Starting search index rebuild",
          source: "search-service",
        },
        {
          timestamp: "2026-02-09T03:30:15Z",
          level: "info",
          message: "Processing 45,234 user records",
          source: "indexer",
        },
        {
          timestamp: "2026-02-09T04:12:33Z",
          level: "info",
          message: "Index rebuild completed",
          source: "search-service",
        },
      ],
      correlationId: "corr_index_006",
      initiatedBy: "schedule",
      affectedResources: ["search_index"],
    },
    lastSuccessAt: "2026-02-09T04:12:33Z",
    totalExecutions: 52,
    successCount: 51,
    failureCount: 1,
    averageDuration: 4200,
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2026-02-10T10:00:00Z",
    createdBy: "admin@acme.com",
    isSystemTask: false,
    isEditable: true,
    initiator: "schedule",
    tags: ["maintenance", "search", "index", "weekly"],
    impact: {
      services: ["search", "directory"],
    },
    permissions: {
      canView: true,
      canRun: true,
      canEdit: true,
      canDelete: true,
      canPause: true,
      minRole: "operator",
      allowedUsers: [],
    },
    alerts: [],
    auditLog: [
      {
        id: "audit_001",
        taskId: "task_index_rebuild",
        timestamp: "2026-02-10T10:00:00Z",
        actor: "admin@acme.com",
        actorType: "user",
        action: "task_paused",
        changes: {
          status: { old: "scheduled", new: "paused" },
        },
        correlationId: "corr_audit_001",
        ipAddress: "192.168.1.100",
      },
    ],
    executionHistory: [],
  },

  // Custom Tasks
  {
    id: "task_user_report",
    name: "Monthly User Activity Report",
    description: "Generate and email monthly user activity analytics",
    type: "custom",
    status: "running",
    schedule: {
      type: "cron",
      cronExpression: "0 9 1 * *",
      nextRunAt: null,
      timezone: "America/New_York",
      retryPolicy: {
        maxRetries: 2,
        retryDelaySeconds: 300,
        exponentialBackoff: true,
      },
      timeoutMinutes: 45,
      parallelism: 1,
    },
    lastExecution: {
      id: "exec_007",
      taskId: "task_user_report",
      status: "completed",
      startedAt: "2026-02-01T09:00:00Z",
      completedAt: "2026-02-01T09:23:15Z",
      duration: 1395,
      logs: [
        {
          timestamp: "2026-02-01T09:00:00Z",
          level: "info",
          message: "Starting monthly user report generation",
          source: "report-service",
        },
        {
          timestamp: "2026-02-01T09:15:30Z",
          level: "info",
          message: "Aggregating data from 2,847 users",
          source: "analytics-engine",
        },
        {
          timestamp: "2026-02-01T09:23:15Z",
          level: "info",
          message: "Report generated and emailed to 5 recipients",
          source: "report-service",
        },
      ],
      correlationId: "corr_report_007",
      initiatedBy: "schedule",
      affectedResources: ["analytics_db", "email_service"],
      output: {
        reportId: "rpt_2026_02",
        recipients: 5,
        format: "PDF",
      },
    },
    totalExecutions: 13,
    successCount: 13,
    failureCount: 0,
    averageDuration: 1200,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2026-02-01T09:23:15Z",
    createdBy: "admin@acme.com",
    isSystemTask: false,
    isEditable: true,
    initiator: "admin",
    tags: ["reporting", "analytics", "custom", "monthly"],
    impact: {
      services: ["analytics", "email"],
    },
    permissions: {
      canView: true,
      canRun: true,
      canEdit: true,
      canDelete: true,
      canPause: true,
      minRole: "admin",
      allowedUsers: ["admin@acme.com"],
    },
    alerts: [],
    auditLog: [],
    executionHistory: [],
  },

  // Migration Tasks
  {
    id: "task_data_migration",
    name: "Legacy Data Migration",
    description: "Migrate user data from legacy identity system",
    type: "migration",
    status: "pending",
    schedule: {
      type: "once",
      nextRunAt: "2026-02-15T02:00:00Z",
      timezone: "UTC",
      retryPolicy: {
        maxRetries: 0,
        retryDelaySeconds: 0,
        exponentialBackoff: false,
      },
      timeoutMinutes: 360,
      parallelism: 4,
    },
    totalExecutions: 0,
    successCount: 0,
    failureCount: 0,
    averageDuration: 0,
    createdAt: "2026-02-10T14:00:00Z",
    updatedAt: "2026-02-10T14:00:00Z",
    createdBy: "migration-team@acme.com",
    isSystemTask: false,
    isEditable: true,
    initiator: "admin",
    tags: ["migration", "legacy", "data", "one-time"],
    impact: {
      users: 5000,
      services: ["identity", "database"],
    },
    permissions: {
      canView: true,
      canRun: true,
      canEdit: true,
      canDelete: true,
      canPause: true,
      minRole: "superadmin",
      allowedUsers: ["migration-team@acme.com"],
    },
    alerts: [],
    auditLog: [],
    executionHistory: [],
  },

  // Cleanup Tasks
  {
    id: "task_audit_cleanup",
    name: "Audit Log Archival",
    description: "Archive audit logs older than 90 days to cold storage",
    type: "cleanup",
    status: "retrying",
    schedule: {
      type: "cron",
      cronExpression: "0 4 * * *",
      nextRunAt: "2026-02-13T04:00:00Z",
      timezone: "UTC",
      retryPolicy: {
        maxRetries: 3,
        retryDelaySeconds: 600,
        exponentialBackoff: true,
      },
      timeoutMinutes: 120,
      parallelism: 2,
    },
    lastExecution: {
      id: "exec_008",
      taskId: "task_audit_cleanup",
      status: "failed",
      startedAt: "2026-02-12T04:00:00Z",
      completedAt: "2026-02-12T04:45:00Z",
      duration: 2700,
      logs: [
        {
          timestamp: "2026-02-12T04:00:00Z",
          level: "info",
          message: "Starting audit log archival",
          source: "cleanup-service",
        },
        {
          timestamp: "2026-02-12T04:30:15Z",
          level: "info",
          message: "Identified 2.1M log entries to archive",
          source: "cleanup-service",
        },
        {
          timestamp: "2026-02-12T04:45:00Z",
          level: "error",
          message: "S3 connection timeout during upload",
          source: "storage-service",
        },
      ],
      error: {
        message: "Connection timeout to S3 cold storage",
        code: "STORAGE_TIMEOUT",
      },
      correlationId: "corr_cleanup_008",
      initiatedBy: "schedule",
      affectedResources: ["audit_logs"],
    },
    lastFailureAt: "2026-02-12T04:45:00Z",
    totalExecutions: 89,
    successCount: 87,
    failureCount: 2,
    averageDuration: 2400,
    createdAt: "2025-06-01T00:00:00Z",
    updatedAt: "2026-02-12T04:45:00Z",
    createdBy: "system",
    isSystemTask: true,
    isEditable: true,
    initiator: "schedule",
    tags: ["cleanup", "audit", "archival", "compliance"],
    impact: {
      services: ["audit", "storage"],
    },
    permissions: {
      canView: true,
      canRun: true,
      canEdit: false,
      canDelete: false,
      canPause: true,
      minRole: "admin",
      allowedUsers: [],
    },
    alerts: [
      {
        id: "alert_002",
        taskId: "task_audit_cleanup",
        severity: "medium",
        type: "failure",
        message: "Audit log archival failed - retry in progress",
        triggeredAt: "2026-02-12T04:45:15Z",
        acknowledged: true,
        acknowledgedBy: "devops@acme.com",
        acknowledgedAt: "2026-02-12T09:00:00Z",
        notificationsSent: ["email"],
      },
    ],
    auditLog: [],
    executionHistory: [],
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  }
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${mins}m`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

function getSuccessRate(success: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((success / total) * 100);
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function StatusBadge({ status }: { status: TaskStatus }) {
  const config = taskStatusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "flex items-center gap-1.5 px-2 py-1",
        config.bgColor,
        config.color,
        config.borderColor,
      )}
    >
      <Icon
        className={cn("h-3.5 w-3.5", status === "running" && "animate-spin")}
      />
      <span className="text-xs font-medium">{config.label}</span>
    </Badge>
  );
}

function TypeBadge({ type }: { type: TaskType }) {
  const config = taskTypeConfig[type];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "flex items-center gap-1.5 px-2 py-1",
        config.bgColor,
        config.color,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="text-xs font-medium">{config.label}</span>
    </Badge>
  );
}

function InitiatorBadge({ initiator }: { initiator: TaskInitiator }) {
  const config = initiatorConfig[initiator];
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-1.5 text-xs", config.color)}>
      <Icon className="h-3.5 w-3.5" />
      <span>{config.label}</span>
    </div>
  );
}

function ExecutionStatusBadge({ status }: { status: ExecutionStatus }) {
  const config = executionStatusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-1.5 text-xs", config.color)}>
      <Icon className="h-3.5 w-3.5" />
      <span>{config.label}</span>
    </div>
  );
}

function AlertSeverityBadge({ severity }: { severity: AlertSeverity }) {
  const config = alertSeverityConfig[severity];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "flex items-center gap-1.5 px-2 py-1",
        config.bgColor,
        config.color,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="text-xs font-medium">{config.label}</span>
    </Badge>
  );
}

function CorrelationId({ id }: { id: string }) {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="font-mono">{id}</span>
            {copied ? (
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? "Copied!" : "Click to copy"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function LogLevelBadge({ level }: { level: ExecutionLog["level"] }) {
  const colors = {
    info: "text-blue-500 bg-blue-500/10",
    warn: "text-amber-500 bg-amber-500/10",
    error: "text-destructive bg-destructive/10",
    debug: "text-muted-foreground bg-muted",
  };

  return (
    <Badge
      variant="outline"
      className={cn("text-xs px-1.5 py-0", colors[level])}
    >
      {level.toUpperCase()}
    </Badge>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function TasksPage() {
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [filterType, setFilterType] = React.useState<TaskType | "all">("all");
  const [filterStatus, setFilterStatus] = React.useState<TaskStatus | "all">(
    "all",
  );
  const [filterInitiator, setFilterInitiator] = React.useState<
    TaskInitiator | "all"
  >("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("overview");

  // Filter tasks
  const filteredTasks = mockTasks.filter((task) => {
    if (filterType !== "all" && task.type !== filterType) return false;
    if (filterStatus !== "all" && task.status !== filterStatus) return false;
    if (filterInitiator !== "all" && task.initiator !== filterInitiator)
      return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        task.name.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }
    return true;
  });

  // Calculate stats
  const runningTasks = mockTasks.filter((t) => t.status === "running").length;

  return (
    <div className="space-y-6 text-foreground">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-card-foreground">
            Identity Task Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Orchestrate, monitor, and manage operational tasks across your
            identity infrastructure
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <Building2 className="h-3 w-3 mr-1" />
            {organizationContext.name}
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              "text-xs",
              organizationContext.isSelfHosted
                ? "text-purple-500 bg-purple-500/10"
                : "text-blue-500 bg-blue-500/10",
            )}
          >
            {organizationContext.isSelfHosted ? "Self-Hosted" : "SaaS"}
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Tasks"
          value={taskStats.activeTasks}
          subtitle={`${runningTasks} running now`}
          icon={Activity}
          variant="accent"
          trend={{ value: 8.5, isPositive: true }}
        />
        <MetricCard
          title="Scheduled Tasks"
          value={taskStats.scheduledTasks}
          subtitle={
            taskStats.nextScheduledTask
              ? `Next: ${taskStats.nextScheduledTask.name}`
              : "No upcoming tasks"
          }
          icon={Calendar}
          variant="default"
        />
        <MetricCard
          title="Failed (24h)"
          value={taskStats.failedTasks24h}
          subtitle={`${taskStats.failedTasks7d} in last 7 days`}
          icon={XCircle}
          variant={taskStats.failedTasks24h > 0 ? "destructive" : "default"}
          trend={
            taskStats.failedTasks24h > 0
              ? { value: 50, isPositive: false }
              : undefined
          }
        />
        <MetricCard
          title="Success Rate"
          value={`${taskStats.successRate24h}%`}
          subtitle={`${taskStats.totalExecutions24h} executions in 24h`}
          icon={CheckCircle2}
          variant={taskStats.successRate24h > 95 ? "accent" : "warning"}
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="bg-muted">
          <TabsTrigger value="overview" className="text-xs">
            <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="tasks" className="text-xs">
            <List className="h-3.5 w-3.5 mr-1.5" />
            All Tasks
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="text-xs">
            <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="alerts" className="text-xs">
            <Bell className="h-3.5 w-3.5 mr-1.5" />
            Alerts
            {mockTasks.some((t) => t.alerts.some((a) => !a.acknowledged)) && (
              <Badge
                variant="destructive"
                className="ml-1.5 h-4 min-w-4 px-1 text-[10px]"
              >
                {
                  mockTasks.filter((t) => t.alerts.some((a) => !a.acknowledged))
                    .length
                }
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="audit" className="text-xs">
            <Shield className="h-3.5 w-3.5 mr-1.5" />
            Audit
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  Running Now
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockTasks
                    .filter((t) => t.status === "running")
                    .map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                          <span className="text-sm font-medium">
                            {task.name}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {formatDuration(task.lastExecution?.duration || 0)}{" "}
                          elapsed
                        </Badge>
                      </div>
                    ))}
                  {mockTasks.filter((t) => t.status === "running").length ===
                    0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No tasks currently running
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  Requires Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockTasks
                    .filter(
                      (t) =>
                        t.status === "failed" ||
                        (t.status === "retrying" && t.alerts.length > 0),
                    )
                    .map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-destructive/5 border border-destructive/20"
                      >
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-destructive" />
                          <span className="text-sm font-medium">
                            {task.name}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => {
                            setSelectedTask(task);
                            setActiveTab("tasks");
                          }}
                        >
                          View
                        </Button>
                      </div>
                    ))}
                  {mockTasks.filter(
                    (t) =>
                      t.status === "failed" ||
                      (t.status === "retrying" && t.alerts.length > 0),
                  ).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      All tasks healthy
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-500" />
                  Upcoming
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockTasks
                    .filter(
                      (t) =>
                        t.schedule.nextRunAt &&
                        new Date(t.schedule.nextRunAt) > new Date(),
                    )
                    .sort(
                      (a, b) =>
                        new Date(a.schedule.nextRunAt!).getTime() -
                        new Date(b.schedule.nextRunAt!).getTime(),
                    )
                    .slice(0, 3)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                      >
                        <div>
                          <p className="text-sm font-medium">{task.name}</p>
                          <p
                            className="text-xs text-muted-foreground"
                            suppressHydrationWarning
                          >
                            {formatDate(task.schedule.nextRunAt!)}
                          </p>
                        </div>
                        <TypeBadge type={task.type} />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tasks by Type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tasks by Category</CardTitle>
              <CardDescription>
                Distribution of tasks across different operational categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(taskTypeConfig).map(([type, config]) => {
                  const count = mockTasks.filter((t) => t.type === type).length;
                  const Icon = config.icon;
                  return (
                    <div
                      key={type}
                      className="p-4 rounded-lg border border-border hover:border-border/80 transition-colors cursor-pointer"
                      onClick={() => {
                        setFilterType(type as TaskType);
                        setActiveTab("tasks");
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn("p-2 rounded-md", config.bgColor)}>
                          <Icon className={cn("h-4 w-4", config.color)} />
                        </div>
                        <span className="text-2xl font-semibold">{count}</span>
                      </div>
                      <p className="text-sm font-medium">{config.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {config.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-50">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm bg-muted border-0 rounded-md focus:ring-2 focus:ring-ring"
                  />
                </div>

                <Select
                  value={filterType}
                  onValueChange={(v) => setFilterType(v as TaskType | "all")}
                >
                  <SelectTrigger className="w-35 text-xs">
                    <Filter className="h-3.5 w-3.5 mr-1.5" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {Object.entries(taskTypeConfig).map(([type, config]) => (
                      <SelectItem key={type} value={type}>
                        <div className="flex items-center gap-2">
                          <config.icon
                            className={cn("h-3.5 w-3.5", config.color)}
                          />
                          {config.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filterStatus}
                  onValueChange={(v) =>
                    setFilterStatus(v as TaskStatus | "all")
                  }
                >
                  <SelectTrigger className="w-35 text-xs">
                    <Activity className="h-3.5 w-3.5 mr-1.5" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {Object.entries(taskStatusConfig).map(
                      ([status, config]) => (
                        <SelectItem key={status} value={status}>
                          <div className="flex items-center gap-2">
                            <config.icon
                              className={cn("h-3.5 w-3.5", config.color)}
                            />
                            {config.label}
                          </div>
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>

                <Select
                  value={filterInitiator}
                  onValueChange={(v) =>
                    setFilterInitiator(v as TaskInitiator | "all")
                  }
                >
                  <SelectTrigger className="w-35 text-xs">
                    <User className="h-3.5 w-3.5 mr-1.5" />
                    <SelectValue placeholder="Initiator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Initiators</SelectItem>
                    {Object.entries(initiatorConfig).map(
                      ([initiator, config]) => (
                        <SelectItem key={initiator} value={initiator}>
                          <div className="flex items-center gap-2">
                            <config.icon
                              className={cn("h-3.5 w-3.5", config.color)}
                            />
                            {config.label}
                          </div>
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>

                {(filterType !== "all" ||
                  filterStatus !== "all" ||
                  filterInitiator !== "all" ||
                  searchQuery) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFilterType("all");
                      setFilterStatus("all");
                      setFilterInitiator("all");
                      setSearchQuery("");
                    }}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tasks Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs">Task</TableHead>
                    <TableHead className="text-xs">Type</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs">Last Run</TableHead>
                    <TableHead className="text-xs">Next Run</TableHead>
                    <TableHead className="text-xs">Success Rate</TableHead>
                    <TableHead className="text-xs">Initiator</TableHead>
                    <TableHead className="text-xs text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id} className="group">
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{task.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {task.description}
                          </p>
                          {task.isSystemTask && (
                            <Badge
                              variant="outline"
                              className="mt-1 text-[10px] bg-blue-500/10 text-blue-500"
                            >
                              <Lock className="h-3 w-3 mr-1" />
                              System
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <TypeBadge type={task.type} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={task.status} />
                      </TableCell>
                      <TableCell>
                        {task.lastExecution ? (
                          <div className="text-xs">
                            <p>
                              {formatRelativeTime(task.lastExecution.startedAt)}
                            </p>
                            {task.lastExecution.duration && (
                              <p className="text-muted-foreground">
                                {formatDuration(task.lastExecution.duration)}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Never
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {task.schedule.nextRunAt ? (
                          <div className="text-xs">
                            <p>{formatRelativeTime(task.schedule.nextRunAt)}</p>
                            <p className="text-muted-foreground">
                              {task.schedule.type === "cron" &&
                              task.schedule.cronExpression
                                ? task.schedule.cronExpression
                                : task.schedule.type}
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            -
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full",
                                getSuccessRate(
                                  task.successCount,
                                  task.totalExecutions,
                                ) > 95
                                  ? "bg-emerald-500"
                                  : getSuccessRate(
                                        task.successCount,
                                        task.totalExecutions,
                                      ) > 80
                                    ? "bg-amber-500"
                                    : "bg-destructive",
                              )}
                              style={{
                                width: `${getSuccessRate(task.successCount, task.totalExecutions)}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs w-8 text-right">
                            {getSuccessRate(
                              task.successCount,
                              task.totalExecutions,
                            )}
                            %
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <InitiatorBadge initiator={task.initiator} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => setSelectedTask(task)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View details</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          {task.permissions.canRun &&
                            task.status !== "running" && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                    >
                                      <Play className="h-4 w-4 text-emerald-500" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Run now</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => setSelectedTask(task)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {task.permissions.canEdit && task.isEditable && (
                                <DropdownMenuItem>
                                  <Edit3 className="h-4 w-4 mr-2" />
                                  Edit Schedule
                                </DropdownMenuItem>
                              )}
                              {task.permissions.canPause && (
                                <DropdownMenuItem>
                                  {task.status === "paused" ? (
                                    <>
                                      <Play className="h-4 w-4 mr-2" />
                                      Resume
                                    </>
                                  ) : (
                                    <>
                                      <Pause className="h-4 w-4 mr-2" />
                                      Pause
                                    </>
                                  )}
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              {task.permissions.canRun &&
                                task.status === "failed" && (
                                  <DropdownMenuItem>
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Retry
                                  </DropdownMenuItem>
                                )}
                              {task.permissions.canDelete &&
                                !task.isSystemTask && (
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Execution Trends (24h)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-emerald-500/10">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Successful</p>
                        <p className="text-xs text-muted-foreground">
                          Last 24 hours
                        </p>
                      </div>
                    </div>
                    <span className="text-xl font-semibold text-emerald-500">
                      {taskStats.totalExecutions24h - taskStats.failedTasks24h}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-destructive/10">
                        <XCircle className="h-4 w-4 text-destructive" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Failed</p>
                        <p className="text-xs text-muted-foreground">
                          Last 24 hours
                        </p>
                      </div>
                    </div>
                    <span className="text-xl font-semibold text-destructive">
                      {taskStats.failedTasks24h}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-blue-500/10">
                        <Clock className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Avg Duration</p>
                        <p className="text-xs text-muted-foreground">
                          All tasks
                        </p>
                      </div>
                    </div>
                    <span className="text-xl font-semibold">
                      {formatDuration(taskStats.averageExecutionTime)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Anomaly Detection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockTasks
                    .filter(
                      (t) =>
                        t.status === "failed" ||
                        (t.alerts.length > 0 &&
                          t.alerts.some((a) => a.severity === "high")),
                    )
                    .map((task) => (
                      <div
                        key={task.id}
                        className="p-3 rounded-lg border border-destructive/20 bg-destructive/5"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium">{task.name}</p>
                            {task.alerts.length > 0 && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {task.alerts[0].message}
                              </p>
                            )}
                          </div>
                          <StatusBadge status={task.status} />
                        </div>
                      </div>
                    ))}
                  {mockTasks.filter(
                    (t) =>
                      t.status === "failed" ||
                      (t.alerts.length > 0 &&
                        t.alerts.some((a) => a.severity === "high")),
                  ).length === 0 && (
                    <div className="flex items-center justify-center p-8 text-center">
                      <div>
                        <ShieldCheck className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          No anomalies detected
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Task Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Task Performance Overview
              </CardTitle>
              <CardDescription>
                Success rates and execution times by task type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(taskTypeConfig).map(([type, config]) => {
                  const tasksOfType = mockTasks.filter((t) => t.type === type);
                  const totalExecs = tasksOfType.reduce(
                    (sum, t) => sum + t.totalExecutions,
                    0,
                  );
                  const totalSuccess = tasksOfType.reduce(
                    (sum, t) => sum + t.successCount,
                    0,
                  );
                  const avgDuration =
                    tasksOfType.length > 0
                      ? tasksOfType.reduce(
                          (sum, t) => sum + t.averageDuration,
                          0,
                        ) / tasksOfType.length
                      : 0;

                  return (
                    <div key={type} className="flex items-center gap-4">
                      <div className="w-32 flex items-center gap-2">
                        <config.icon className={cn("h-4 w-4", config.color)} />
                        <span className="text-sm font-medium">
                          {config.label}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Progress
                            value={getSuccessRate(totalSuccess, totalExecs)}
                            className="h-2"
                          />
                          <span className="text-xs w-8">
                            {getSuccessRate(totalSuccess, totalExecs)}%
                          </span>
                        </div>
                      </div>
                      <div className="w-24 text-right">
                        <span className="text-xs text-muted-foreground">
                          {formatDuration(avgDuration)} avg
                        </span>
                      </div>
                      <div className="w-20 text-right">
                        <span className="text-xs">
                          {tasksOfType.length} tasks
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Active Alerts</CardTitle>
                <CardDescription>
                  Monitor and acknowledge task-related alerts
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <CheckCircle2 className="h-4 w-4 mr-1.5" />
                Acknowledge All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTasks
                  .flatMap((t) =>
                    t.alerts.map((alert) => ({ ...alert, taskName: t.name })),
                  )
                  .sort(
                    (a, b) =>
                      new Date(b.triggeredAt).getTime() -
                      new Date(a.triggeredAt).getTime(),
                  )
                  .map((alert) => (
                    <div
                      key={alert.id}
                      className={cn(
                        "p-4 rounded-lg border",
                        alert.acknowledged
                          ? "border-muted bg-muted/30"
                          : "border-destructive/20 bg-destructive/5",
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <AlertSeverityBadge severity={alert.severity} />
                          <div>
                            <p className="font-medium text-sm">
                              {alert.taskName}
                            </p>
                            <p className="text-sm mt-1">{alert.message}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>
                                {formatRelativeTime(alert.triggeredAt)}
                              </span>
                              {alert.acknowledged && (
                                <span>
                                  Acknowledged by {alert.acknowledgedBy}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Bell className="h-3 w-3" />
                                {alert.notificationsSent.join(", ")}
                              </span>
                            </div>
                          </div>
                        </div>
                        {!alert.acknowledged && (
                          <Button variant="outline" size="sm">
                            Acknowledge
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                {mockTasks.flatMap((t) => t.alerts).length === 0 && (
                  <div className="flex items-center justify-center p-8 text-center">
                    <div>
                      <ShieldCheck className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        No active alerts
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Tab */}
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Audit Log</CardTitle>
              <CardDescription>
                Track all changes and actions performed on tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTasks
                  .flatMap((t) =>
                    t.auditLog.map((event) => ({ ...event, taskName: t.name })),
                  )
                  .sort(
                    (a, b) =>
                      new Date(b.timestamp).getTime() -
                      new Date(a.timestamp).getTime(),
                  )
                  .map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start justify-between p-3 rounded-lg border border-border"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-md bg-muted">
                          <History className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {event.action.replace(/_/g, " ").toUpperCase()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {event.taskName} • {event.actor}
                          </p>
                          <CorrelationId id={event.correlationId} />
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(event.timestamp)}
                      </span>
                    </div>
                  ))}
                {mockTasks.flatMap((t) => t.auditLog).length === 0 && (
                  <div className="flex items-center justify-center p-8 text-center">
                    <div>
                      <Shield className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        No audit events recorded
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Task Detail Dialog */}
      <Dialog
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedTask && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="flex items-center gap-2">
                      {selectedTask.name}
                      {selectedTask.isSystemTask && (
                        <Badge
                          variant="outline"
                          className="bg-blue-500/10 text-blue-500"
                        >
                          <Lock className="h-3 w-3 mr-1" />
                          System
                        </Badge>
                      )}
                    </DialogTitle>
                    <DialogDescription className="mt-1.5">
                      {selectedTask.description}
                    </DialogDescription>
                  </div>
                  <StatusBadge status={selectedTask.status} />
                </div>
              </DialogHeader>

              <Tabs defaultValue="overview" className="mt-4">
                <TabsList className="bg-muted">
                  <TabsTrigger value="overview" className="text-xs">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="executions" className="text-xs">
                    Executions
                  </TabsTrigger>
                  <TabsTrigger value="logs" className="text-xs">
                    Logs
                  </TabsTrigger>
                  <TabsTrigger value="schedule" className="text-xs">
                    Schedule
                  </TabsTrigger>
                  <TabsTrigger value="permissions" className="text-xs">
                    Permissions
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Type</p>
                      <TypeBadge type={selectedTask.type} />
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Initiator</p>
                      <InitiatorBadge initiator={selectedTask.initiator} />
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">
                        Success Rate
                      </p>
                      <p className="text-lg font-semibold">
                        {getSuccessRate(
                          selectedTask.successCount,
                          selectedTask.totalExecutions,
                        )}
                        %
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">
                        Avg Duration
                      </p>
                      <p className="text-lg font-semibold">
                        {formatDuration(selectedTask.averageDuration)}
                      </p>
                    </div>
                  </div>

                  {selectedTask.impact && (
                    <div className="p-4 rounded-lg border border-border">
                      <h4 className="text-sm font-medium mb-3">Impact Scope</h4>
                      <div className="grid grid-cols-3 gap-4">
                        {selectedTask.impact.users && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {selectedTask.impact.users.toLocaleString()} users
                            </span>
                          </div>
                        )}
                        {selectedTask.impact.services && (
                          <div className="flex items-center gap-2">
                            <Server className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {selectedTask.impact.services.length} services
                            </span>
                          </div>
                        )}
                        {selectedTask.impact.directories && (
                          <div className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {selectedTask.impact.directories.length}{" "}
                              directories
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedTask.lastExecution && (
                    <div className="p-4 rounded-lg border border-border">
                      <h4 className="text-sm font-medium mb-3">
                        Last Execution
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Status</span>
                          <ExecutionStatusBadge
                            status={selectedTask.lastExecution.status}
                          />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Started</span>
                          <span suppressHydrationWarning>
                            {formatDate(selectedTask.lastExecution.startedAt)}
                          </span>
                        </div>
                        {selectedTask.lastExecution.completedAt && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Completed
                            </span>
                            <span suppressHydrationWarning>
                              {formatDate(
                                selectedTask.lastExecution.completedAt,
                              )}
                            </span>
                          </div>
                        )}
                        {selectedTask.lastExecution.duration && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Duration
                            </span>
                            <span>
                              {formatDuration(
                                selectedTask.lastExecution.duration,
                              )}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Correlation ID
                          </span>
                          <CorrelationId
                            id={selectedTask.lastExecution.correlationId}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {selectedTask.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TabsContent>

                {/* Executions Tab */}
                <TabsContent value="executions" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    {selectedTask.executionHistory.length > 0 ? (
                      selectedTask.executionHistory.map((exec) => (
                        <div
                          key={exec.id}
                          className="p-3 rounded-lg border border-border"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ExecutionStatusBadge status={exec.status} />
                              <span className="text-sm font-medium">
                                {exec.id}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatRelativeTime(exec.startedAt)}
                            </span>
                          </div>
                          {exec.duration && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Duration: {formatDuration(exec.duration)}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <History className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">
                          No execution history available
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Logs Tab */}
                <TabsContent value="logs" className="space-y-4 mt-4">
                  {selectedTask.lastExecution?.logs ? (
                    <div className="space-y-1 font-mono text-xs">
                      {selectedTask.lastExecution.logs.map((log, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-2 rounded hover:bg-muted/50"
                        >
                          <span className="text-muted-foreground whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                          <LogLevelBadge level={log.level} />
                          <span className="text-muted-foreground">
                            [{log.source}]
                          </span>
                          <span className="flex-1">{log.message}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Terminal className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">No logs available</p>
                    </div>
                  )}
                </TabsContent>

                {/* Schedule Tab */}
                <TabsContent value="schedule" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground">
                          Schedule Type
                        </p>
                        <p className="text-sm font-medium capitalize">
                          {selectedTask.schedule.type}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground">
                          Timezone
                        </p>
                        <p className="text-sm font-medium">
                          {selectedTask.schedule.timezone}
                        </p>
                      </div>
                    </div>

                    {selectedTask.schedule.cronExpression && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground">
                          Cron Expression
                        </p>
                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                          {selectedTask.schedule.cronExpression}
                        </code>
                      </div>
                    )}

                    {selectedTask.schedule.nextRunAt && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground">
                          Next Run
                        </p>
                        <p
                          className="text-sm font-medium"
                          suppressHydrationWarning
                        >
                          {formatDate(selectedTask.schedule.nextRunAt)}
                        </p>
                      </div>
                    )}

                    <div className="p-4 rounded-lg border border-border">
                      <h4 className="text-sm font-medium mb-3">Retry Policy</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Max Retries
                          </p>
                          <p>{selectedTask.schedule.retryPolicy.maxRetries}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Retry Delay
                          </p>
                          <p>
                            {
                              selectedTask.schedule.retryPolicy
                                .retryDelaySeconds
                            }
                            s
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Backoff
                          </p>
                          <p>
                            {selectedTask.schedule.retryPolicy
                              .exponentialBackoff
                              ? "Exponential"
                              : "Fixed"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-border">
                      <h4 className="text-sm font-medium mb-3">
                        Resource Limits
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Timeout
                          </p>
                          <p>{selectedTask.schedule.timeoutMinutes} minutes</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Parallelism
                          </p>
                          <p>{selectedTask.schedule.parallelism} concurrent</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Permissions Tab */}
                <TabsContent value="permissions" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-border">
                      <h4 className="text-sm font-medium mb-3">
                        Access Control
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(selectedTask.permissions)
                          .filter(([key]) => key.startsWith("can"))
                          .map(([key, value]) => (
                            <div
                              key={key}
                              className="flex items-center justify-between"
                            >
                              <span className="text-sm capitalize">
                                {key
                                  .replace("can", "")
                                  .replace(/([A-Z])/g, " $1")}
                              </span>
                              <Switch checked={value as boolean} disabled />
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-border">
                      <h4 className="text-sm font-medium mb-3">
                        Minimum Role Required
                      </h4>
                      <Badge variant="outline" className="text-xs capitalize">
                        {selectedTask.permissions.minRole}
                      </Badge>
                    </div>

                    {selectedTask.permissions.allowedUsers.length > 0 && (
                      <div className="p-4 rounded-lg border border-border">
                        <h4 className="text-sm font-medium mb-3">
                          Allowed Users
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedTask.permissions.allowedUsers.map((user) => (
                            <Badge
                              key={user}
                              variant="secondary"
                              className="text-xs"
                            >
                              <User className="h-3 w-3 mr-1" />
                              {user}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {!selectedTask.isEditable && (
                      <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <div className="flex items-start gap-3">
                          <Lock className="h-4 w-4 text-amber-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-amber-500">
                              System Task
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              This is a system-managed task. Schedule and
                              configuration cannot be modified.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2 mt-4">
                {selectedTask.permissions.canPause && (
                  <Button variant="outline">
                    {selectedTask.status === "paused" ? (
                      <>
                        <Play className="h-4 w-4 mr-1.5" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause className="h-4 w-4 mr-1.5" />
                        Pause
                      </>
                    )}
                  </Button>
                )}
                {selectedTask.permissions.canRun &&
                  selectedTask.status !== "running" && (
                    <Button>
                      <Play className="h-4 w-4 mr-1.5" />
                      Run Now
                    </Button>
                  )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
