"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import {
  Monitor,
  Search,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  PowerOff,
  Filter,
  RefreshCw,
  MoreHorizontal,
  Eye,
  Download,
  Globe,
  Smartphone,
  Laptop,
  Tablet,
  MapPin,
  History,
  Activity,
  AlertTriangle,
  FileText,
  ChevronDown,
  ChevronUp,
  XCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/dashboard/ui/card";
import { Badge } from "@/components/dashboard/ui/badge";
import { Button } from "@/components/dashboard/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/dashboard/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dashboard/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/dashboard/ui/table";
import { Input } from "@/components/dashboard/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/dashboard/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/dashboard/ui/tabs";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface UserSession {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  groups: string[];
  device: string;
  browser: string;
  deviceType: "desktop" | "mobile" | "tablet";
  ipAddress: string;
  location?: string;
  country?: string;
  city?: string;
  loginTime: string;
  lastActivity: string;
  status: "active" | "idle" | "terminated";
  mfaEnabled: boolean;
  mfaVerified: boolean;
  riskScore?: number;
  isSuspicious?: boolean;
}

interface SessionStats {
  totalActive: number;
  idleSessions: number;
  highRiskSessions: number;
  mfaProtected: number;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockSessions: UserSession[] = [
  {
    id: "sess-001",
    userId: "usr-001",
    displayName: "John Smith",
    email: "john.smith@acme.com",
    groups: ["Engineering", "Backend Team"],
    device: "MacBook Pro",
    browser: "Chrome 120",
    deviceType: "desktop",
    ipAddress: "192.168.1.105",
    location: "San Francisco, US",
    country: "US",
    city: "San Francisco",
    loginTime: "2024-01-15T08:30:00Z",
    lastActivity: "2024-01-15T14:25:00Z",
    status: "active",
    mfaEnabled: true,
    mfaVerified: true,
    riskScore: 15,
    isSuspicious: false,
  },
  {
    id: "sess-002",
    userId: "usr-002",
    displayName: "Sarah Jones",
    email: "sarah.jones@acme.com",
    groups: ["Security", "Security Operations"],
    device: "iPhone 15 Pro",
    browser: "Safari Mobile",
    deviceType: "mobile",
    ipAddress: "203.45.67.89",
    location: "New York, US",
    country: "US",
    city: "New York",
    loginTime: "2024-01-15T12:15:00Z",
    lastActivity: "2024-01-15T14:20:00Z",
    status: "active",
    mfaEnabled: true,
    mfaVerified: true,
    riskScore: 10,
    isSuspicious: false,
  },
  {
    id: "sess-003",
    userId: "usr-003",
    displayName: "Michael Chen",
    email: "michael.chen@acme.com",
    groups: ["Engineering"],
    device: "Windows PC",
    browser: "Firefox 121",
    deviceType: "desktop",
    ipAddress: "185.220.101.42",
    location: "Unknown Location",
    country: "??",
    city: "Unknown",
    loginTime: "2024-01-15T09:00:00Z",
    lastActivity: "2024-01-15T10:30:00Z",
    status: "idle",
    mfaEnabled: false,
    mfaVerified: false,
    riskScore: 65,
    isSuspicious: true,
  },
  {
    id: "sess-004",
    userId: "usr-004",
    displayName: "Emily Davis",
    email: "emily.davis@acme.com",
    groups: ["Finance"],
    device: "iPad Pro",
    browser: "Chrome Mobile",
    deviceType: "tablet",
    ipAddress: "45.23.156.78",
    location: "London, UK",
    country: "UK",
    city: "London",
    loginTime: "2024-01-15T06:45:00Z",
    lastActivity: "2024-01-15T14:15:00Z",
    status: "active",
    mfaEnabled: true,
    mfaVerified: true,
    riskScore: 20,
    isSuspicious: false,
  },
  {
    id: "sess-005",
    userId: "usr-005",
    displayName: "David Wilson",
    email: "david.wilson@acme.com",
    groups: ["Product"],
    device: "MacBook Air",
    browser: "Safari 17",
    deviceType: "desktop",
    ipAddress: "98.76.54.32",
    location: "Austin, US",
    country: "US",
    city: "Austin",
    loginTime: "2024-01-15T13:00:00Z",
    lastActivity: "2024-01-15T13:45:00Z",
    status: "idle",
    mfaEnabled: true,
    mfaVerified: false,
    riskScore: 35,
    isSuspicious: false,
  },
  {
    id: "sess-006",
    userId: "usr-006",
    displayName: "Lisa Brown",
    email: "lisa.brown@acme.com",
    groups: ["Platform Engineering"],
    device: "Linux Workstation",
    browser: "Chrome 120",
    deviceType: "desktop",
    ipAddress: "203.0.113.50",
    location: "Seattle, US",
    country: "US",
    city: "Seattle",
    loginTime: "2024-01-15T07:00:00Z",
    lastActivity: "2024-01-15T14:30:00Z",
    status: "active",
    mfaEnabled: true,
    mfaVerified: true,
    riskScore: 5,
    isSuspicious: false,
  },
  {
    id: "sess-007",
    userId: "usr-007",
    displayName: "Robert Taylor",
    email: "robert.taylor@acme.com",
    groups: ["Frontend Team"],
    device: "Samsung Galaxy S23",
    browser: "Chrome Mobile",
    deviceType: "mobile",
    ipAddress: "77.88.99.100",
    location: "Moscow, RU",
    country: "RU",
    city: "Moscow",
    loginTime: "2024-01-15T11:30:00Z",
    lastActivity: "2024-01-15T14:28:00Z",
    status: "active",
    mfaEnabled: true,
    mfaVerified: true,
    riskScore: 75,
    isSuspicious: true,
  },
  {
    id: "sess-008",
    userId: "usr-008",
    displayName: "Jennifer Martinez",
    email: "jennifer.martinez@acme.com",
    groups: ["Product"],
    device: "Windows Laptop",
    browser: "Edge 120",
    deviceType: "desktop",
    ipAddress: "198.51.100.25",
    location: "Toronto, CA",
    country: "CA",
    city: "Toronto",
    loginTime: "2024-01-15T14:00:00Z",
    lastActivity: "2024-01-15T14:30:00Z",
    status: "active",
    mfaEnabled: false,
    mfaVerified: false,
    riskScore: 40,
    isSuspicious: false,
  },
];

// ============================================================================
// CHART DATA & CONFIGURATION
// ============================================================================

const COLORS = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
];

const RISK_COLORS = [
  "#10b981", // 0-20: Low - emerald
  "#22c55e", // 21-40: Low-Medium - green
  "#f59e0b", // 41-60: Medium - amber
  "#ef4444", // 61-80: High - red
  "#dc2626", // 81-100: Critical - dark red
];

// Données pour les graphiques basées sur mockSessions
const deviceTypeData = [
  { name: "Desktop", sessions: 5 },
  { name: "Mobile", sessions: 2 },
  { name: "Tablet", sessions: 1 },
];

const countryData = [
  { name: "United States", value: 5 },
  { name: "United Kingdom", value: 1 },
  { name: "Canada", value: 1 },
  { name: "Russia", value: 1 },
];

const activityData = [
  { day: "Mon", active: 6, idle: 2, terminated: 1 },
  { day: "Tue", active: 7, idle: 1, terminated: 0 },
  { day: "Wed", active: 5, idle: 3, terminated: 2 },
  { day: "Thu", active: 8, idle: 2, terminated: 1 },
  { day: "Fri", active: 6, idle: 2, terminated: 0 },
  { day: "Sat", active: 4, idle: 1, terminated: 0 },
  { day: "Sun", active: 3, idle: 1, terminated: 0 },
];

const riskDistributionData = [
  { range: "0-20", count: 3, label: "Faible" },
  { range: "21-40", count: 2, label: "Moyen" },
  { range: "41-60", count: 1, label: "Élevé" },
  { range: "61-80", count: 1, label: "Critique" },
  { range: "81-100", count: 1, label: "Extrême" },
];

const mfaData = [
  { name: "Vérifié", value: 5 },
  { name: "En attente", value: 1 },
  { name: "Désactivé", value: 2 },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatDuration(startTime: string, endTime?: string): string {
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : new Date();
  const diffMs = end.getTime() - start.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffHours > 0) {
    return `${diffHours}h ${diffMins % 60}m`;
  }
  return `${diffMins}m`;
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return formatDateTime(dateString);
}

// ============================================================================
// CONFIGURATION & BADGE COMPONENTS
// ============================================================================

const statusConfig = {
  active: {
    icon: CheckCircle2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    label: "Active",
  },
  idle: {
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    label: "Idle",
  },
  terminated: {
    icon: XCircle,
    color: "text-slate-600",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    label: "Terminated",
  },
};

function StatusBadge({ status }: { status: UserSession["status"] }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        config.bgColor,
        config.color,
        config.borderColor
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

function MfaBadge({ enabled, verified }: { enabled: boolean; verified: boolean }) {
  if (enabled && verified) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
        <ShieldCheck className="h-3 w-3" />
        Verified
      </span>
    );
  }
  if (enabled && !verified) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
        <Shield className="h-3 w-3" />
        Pending
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
      <Shield className="h-3 w-3" />
      Disabled
    </span>
  );
}

function RiskBadge({ score, isSuspicious }: { score?: number; isSuspicious?: boolean }) {
  if (isSuspicious || (score && score >= 70)) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-700 border border-red-200">
        <AlertTriangle className="h-3 w-3" />
        High Risk
      </span>
    );
  }
  if (score && score >= 40) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
        <AlertCircle className="h-3 w-3" />
        Medium
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
      <ShieldCheck className="h-3 w-3" />
      Low
    </span>
  );
}

function DeviceIcon({ type }: { type: UserSession["deviceType"] }) {
  const icons = {
    desktop: Laptop,
    mobile: Smartphone,
    tablet: Tablet,
  };
  const Icon = icons[type];
  return <Icon className="h-4 w-4 text-muted-foreground" />;
}

// ============================================================================
// KPI CARD COMPONENT
// ============================================================================

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

function KpiCard({ title, value, subtitle, icon: Icon, variant = "default" }: KpiCardProps) {
  const variantStyles = {
    default: {
      iconBg: "bg-muted",
      iconColor: "text-muted-foreground",
      valueColor: "text-foreground",
    },
    success: {
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-600",
    },
    warning: {
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      valueColor: "text-amber-600",
    },
    danger: {
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      valueColor: "text-red-600",
    },
    info: {
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      valueColor: "text-blue-600",
    },
  };

  const styles = variantStyles[variant];

  return (
    <Card className="border-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {title}
            </p>
            <p className={cn("text-2xl font-bold", styles.valueColor)}>{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className={cn("rounded-lg p-2", styles.iconBg)}>
            <Icon className={cn("h-4 w-4", styles.iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SESSION DETAILS DIALOG
// ============================================================================

interface SessionDetailsDialogProps {
  session: UserSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTerminate: (sessionId: string) => void;
}

function SessionDetailsDialog({
  session,
  open,
  onOpenChange,
  onTerminate,
}: SessionDetailsDialogProps) {
  const [isTerminating, setIsTerminating] = useState(false);

  if (!session) return null;

  const handleTerminate = async () => {
    setIsTerminating(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onTerminate(session.id);
    setIsTerminating(false);
    onOpenChange(false);
  };

  const initials = session.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Session Details
          </DialogTitle>
          <DialogDescription>
            Detailed information about the active session and security context.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* User Info Header */}
          <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border">
            <div className="h-12 w-12 rounded-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-bold text-primary border border-primary/20">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{session.displayName}</h3>
                <StatusBadge status={session.status} />
              </div>
              <p className="text-sm text-muted-foreground">{session.email}</p>
              <div className="flex items-center gap-2 mt-2">
                {session.groups.map((group) => (
                  <span
                    key={group}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground border border-border/50"
                  >
                    {group}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-mono">{session.id}</p>
              <p className="text-xs text-muted-foreground">{session.userId}</p>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="text-xs">
                <Activity className="h-3.5 w-3.5 mr-1.5" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="security" className="text-xs">
                <Shield className="h-3.5 w-3.5 mr-1.5" />
                Security
              </TabsTrigger>
              <TabsTrigger value="timeline" className="text-xs">
                <History className="h-3.5 w-3.5 mr-1.5" />
                Timeline
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              {/* Device Info */}
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                  <DeviceIcon type={session.deviceType} />
                  Device Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Device</span>
                    <p className="font-medium">{session.device}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Browser</span>
                    <p className="font-medium">{session.browser}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Type</span>
                    <p className="font-medium capitalize">{session.deviceType}</p>
                  </div>
                </div>
              </section>

              {/* Location Info */}
              <section className="pt-4 border-t">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" />
                  Location & Network
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-muted-foreground">IP Address</span>
                    <p className="font-mono text-xs bg-muted px-2 py-1 rounded inline-block">
                      {session.ipAddress}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Location</span>
                    <p className="font-medium">{session.location || "Unknown"}</p>
                  </div>
                </div>
              </section>

              {/* Session Timing */}
              <section className="pt-4 border-t">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  Session Timing
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Login Time</span>
                    <p className="font-medium">{formatDateTime(session.loginTime)}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Last Activity</span>
                    <p className="font-medium">{getRelativeTime(session.lastActivity)}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Session Duration</span>
                    <p className="font-medium">{formatDuration(session.loginTime)}</p>
                  </div>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="security" className="space-y-4 mt-4">
              {/* MFA Status */}
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Authentication
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg border bg-card">
                    <span className="text-sm">MFA Status</span>
                    <MfaBadge enabled={session.mfaEnabled} verified={session.mfaVerified} />
                  </div>
                </div>
              </section>

              {/* Risk Assessment */}
              <section className="pt-4 border-t">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Risk Assessment
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg border bg-card">
                    <span className="text-sm">Risk Level</span>
                    <RiskBadge score={session.riskScore} isSuspicious={session.isSuspicious} />
                  </div>
                  {session.riskScore && (
                    <div className="p-3 rounded-lg border bg-muted/30">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-muted-foreground">Risk Score</span>
                        <span className="text-sm font-medium">{session.riskScore}/100</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all",
                            session.riskScore >= 70
                              ? "bg-red-500"
                              : session.riskScore >= 40
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                          )}
                          style={{ width: `${session.riskScore}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {session.isSuspicious && (
                    <div className="p-3 rounded-lg border border-red-200 bg-red-50">
                      <div className="flex items-center gap-2 text-red-700">
                        <ShieldAlert className="h-4 w-4" />
                        <span className="text-sm font-medium">Suspicious Activity Detected</span>
                      </div>
                      <p className="text-xs text-red-600 mt-1">
                        This session has been flagged due to unusual location or behavior patterns.
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Permissions Snapshot (Placeholder) */}
              <section className="pt-4 border-t">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5" />
                  Permissions Snapshot
                </h4>
                <div className="p-3 rounded-lg border bg-muted/30">
                  <p className="text-sm text-muted-foreground">
                    Effective permissions will be displayed here based on group memberships and role
                    assignments.
                  </p>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4 mt-4">
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                  <History className="h-3.5 w-3.5" />
                  Activity Timeline
                </h4>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <div className="w-px h-full bg-border mt-1" />
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium">Session Started</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(session.loginTime)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        User authenticated successfully
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      <div className="w-px h-full bg-border mt-1" />
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium">Last Activity</p>
                      <p className="text-xs text-muted-foreground">
                        {getRelativeTime(session.lastActivity)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        User interaction detected
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-muted" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Current Status</p>
                      <p className="text-xs text-muted-foreground">Session {session.status}</p>
                    </div>
                  </div>
                </div>
              </section>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {session.status !== "terminated" && (
            <Button variant="destructive" onClick={handleTerminate} disabled={isTerminating}>
              {isTerminating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Terminating...
                </>
              ) : (
                <>
                  <PowerOff className="h-4 w-4 mr-2" />
                  Terminate Session
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// TERMINATE ALL DIALOG
// ============================================================================

interface TerminateAllDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionCount: number;
  onConfirm: () => void;
}

function TerminateAllDialog({
  open,
  onOpenChange,
  sessionCount,
  onConfirm,
}: TerminateAllDialogProps) {
  const [isTerminating, setIsTerminating] = useState(false);

  const handleConfirm = async () => {
    setIsTerminating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onConfirm();
    setIsTerminating(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Terminate All Sessions
          </DialogTitle>
          <DialogDescription>
            This action will terminate {sessionCount} active session
            {sessionCount !== 1 ? "s" : ""}. All affected users will be logged out immediately and
            will need to re-authenticate.
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Warning</p>
              <p className="text-xs text-red-600 mt-1">
                This action cannot be undone. Users may lose unsaved work. Consider notifying users
                before proceeding.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isTerminating}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isTerminating}>
            {isTerminating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Terminating...
              </>
            ) : (
              <>
                <PowerOff className="h-4 w-4 mr-2" />
                Terminate All
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// REPORT DIALOG COMPONENT
// ============================================================================

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessions: UserSession[];
}

function ReportDialog({ open, onOpenChange, sessions }: ReportDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportType, setReportType] = useState<"csv" | "json">("csv");

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Générer le rapport
    const reportData = sessions.map((s) => ({
      id: s.id,
      user: s.displayName,
      email: s.email,
      device: s.device,
      browser: s.browser,
      location: s.location,
      ipAddress: s.ipAddress,
      loginTime: s.loginTime,
      lastActivity: s.lastActivity,
      status: s.status,
      mfaEnabled: s.mfaEnabled,
      mfaVerified: s.mfaVerified,
      riskScore: s.riskScore,
      isSuspicious: s.isSuspicious,
    }));

    const content =
      reportType === "csv" ? convertToCSV(reportData) : JSON.stringify(reportData, null, 2);

    const blob = new Blob([content], {
      type: reportType === "csv" ? "text/csv" : "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `session-report-${new Date().toISOString().split("T")[0]}.${reportType}`;
    a.click();
    URL.revokeObjectURL(url);

    setIsGenerating(false);
    onOpenChange(false);
  };

  const convertToCSV = (data: object[]) => {
    if (data.length === 0) return "";
    const headers = Object.keys(data[0]);
    const rows = data.map((obj) =>
      headers
        .map((header) => JSON.stringify((obj as Record<string, unknown>)[header] ?? ""))
        .join(",")
    );
    return [headers.join(","), ...rows].join("\n");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Session Report
          </DialogTitle>
          <DialogDescription>
            Export session data for compliance and audit purposes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Report Format</label>
            <Select value={reportType} onValueChange={(v) => setReportType(v as "csv" | "json")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV (Excel)</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-3 rounded-lg bg-muted/50 border">
            <p className="text-xs text-muted-foreground">
              <strong>{sessions.length}</strong> sessions will be included in the report
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleGenerateReport} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// RISK ANALYSIS DIALOG COMPONENT
// ============================================================================

interface RiskAnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessions: UserSession[];
}

function RiskAnalysisDialog({ open, onOpenChange, sessions }: RiskAnalysisDialogProps) {
  const riskStats = useMemo(() => {
    const highRisk = sessions.filter(
      (s) => s.isSuspicious || (s.riskScore && s.riskScore >= 70)
    ).length;
    const mediumRisk = sessions.filter(
      (s) => s.riskScore && s.riskScore >= 40 && s.riskScore < 70
    ).length;
    const lowRisk = sessions.filter((s) => !s.riskScore || s.riskScore < 40).length;
    const avgRiskScore =
      sessions.reduce((acc, s) => acc + (s.riskScore || 0), 0) / (sessions.length || 1);

    return { highRisk, mediumRisk, lowRisk, avgRiskScore };
  }, [sessions]);

  const suspiciousSessions = sessions.filter((s) => s.isSuspicious);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Risk Analysis Report
          </DialogTitle>
          <DialogDescription>
            Comprehensive risk assessment and anomaly detection overview.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Risk Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-red-600 font-medium">High Risk</p>
                    <p className="text-2xl font-bold text-red-700">{riskStats.highRisk}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Avg Risk Score</p>
                    <p className="text-2xl font-bold">{riskStats.avgRiskScore.toFixed(1)}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <Activity className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Suspicious Sessions */}
          {suspiciousSessions.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-600" />
                Suspicious Sessions Detected
              </h4>
              <div className="space-y-2">
                {suspiciousSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-3 rounded-lg border border-red-200 bg-red-50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-xs font-semibold text-red-700">
                        {session.displayName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{session.displayName}</p>
                        <p className="text-xs text-muted-foreground">{session.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <RiskBadge score={session.riskScore} isSuspicious={session.isSuspicious} />
                      <p className="text-xs text-muted-foreground mt-1">{session.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risk Distribution Chart */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Risk Distribution</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: "Low (0-39)", count: riskStats.lowRisk, color: "#10b981" },
                    { name: "Medium (40-69)", count: riskStats.mediumRisk, color: "#f59e0b" },
                    { name: "High (70+)", count: riskStats.highRisk, color: "#ef4444" },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    <Cell fill="#10b981" />
                    <Cell fill="#f59e0b" />
                    <Cell fill="#ef4444" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// HISTORY DIALOG COMPONENT
// ============================================================================

interface HistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessions: UserSession[];
}

function HistoryDialog({ open, onOpenChange, sessions }: HistoryDialogProps) {
  const [selectedDateRange, setSelectedDateRange] = useState<"7" | "30" | "90">("7");

  const terminatedSessions = sessions.filter((s) => s.status === "terminated");

  const recentSessions = useMemo(() => {
    const days = parseInt(selectedDateRange);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return sessions.filter((s) => new Date(s.loginTime) >= cutoff);
  }, [sessions, selectedDateRange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Session History
          </DialogTitle>
          <DialogDescription>
            Historical session data and terminated session logs.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Date Range Filter */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Time Range:</span>
            <Select
              value={selectedDateRange}
              onValueChange={(v) => setSelectedDateRange(v as "7" | "30" | "90")}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold">{recentSessions.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {recentSessions.filter((s) => s.status === "active").length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Terminated</p>
                <p className="text-2xl font-bold text-red-600">{terminatedSessions.length}</p>
              </CardContent>
            </Card>
          </div>

          {/* Session History Table */}
          {recentSessions.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Login Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold">
                            {session.displayName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                          <span className="text-sm">{session.displayName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{formatDateTime(session.loginTime)}</TableCell>
                      <TableCell className="text-sm">
                        {formatDuration(session.loginTime, session.lastActivity)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={session.status} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {session.location || "Unknown"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No session history for the selected period.</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function SessionsPage() {
  const [sessions, setSessions] = useState<UserSession[]>(mockSessions);
  const [selectedSession, setSelectedSession] = useState<UserSession | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isTerminateAllOpen, setIsTerminateAllOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Report & Audit Dialogs
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isRiskAnalysisOpen, setIsRiskAnalysisOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);

  // Monitoring Chart Selection
  type ChartType = "overview" | "devices" | "geography" | "activity" | "risk" | "mfa";
  const [selectedChart, setSelectedChart] = useState<ChartType>("overview");

  const chartTitles: Record<ChartType, string> = {
    overview: "Vue d'ensemble - Activité sur 7 jours",
    devices: "Sessions par Type d'Appareil",
    geography: "Répartition Géographique",
    activity: "Activité Temporelle Détaillée",
    risk: "Distribution des Scores de Risque",
    mfa: "Statut de l'Authentification MFA",
  };

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserSession["status"] | "all">("all");
  const [riskFilter, setRiskFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [deviceFilter, setDeviceFilter] = useState<UserSession["deviceType"] | "all">("all");
  const [sortBy, setSortBy] = useState<"lastActivity" | "loginTime" | "riskScore">("lastActivity");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Statistics
  const stats: SessionStats = useMemo(() => {
    const active = sessions.filter((s) => s.status === "active").length;
    const idle = sessions.filter((s) => s.status === "idle").length;
    const highRisk = sessions.filter(
      (s) => s.isSuspicious || (s.riskScore && s.riskScore >= 70)
    ).length;
    const mfaProtected = sessions.filter((s) => s.mfaEnabled && s.mfaVerified).length;

    return {
      totalActive: active + idle,
      idleSessions: idle,
      highRiskSessions: highRisk,
      mfaProtected,
    };
  }, [sessions]);

  // Filtered and sorted sessions
  const filteredSessions = useMemo(() => {
    let result = sessions.filter((session) => {
      const matchesSearch =
        searchQuery === "" ||
        session.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.ipAddress.includes(searchQuery);

      const matchesStatus = statusFilter === "all" || session.status === statusFilter;

      const matchesRisk =
        riskFilter === "all" ||
        (riskFilter === "high" &&
          (session.isSuspicious || (session.riskScore && session.riskScore >= 70))) ||
        (riskFilter === "medium" &&
          session.riskScore &&
          session.riskScore >= 40 &&
          session.riskScore < 70) ||
        (riskFilter === "low" && (!session.riskScore || session.riskScore < 40));

      const matchesDevice = deviceFilter === "all" || session.deviceType === deviceFilter;

      return matchesSearch && matchesStatus && matchesRisk && matchesDevice;
    });

    // Sort
    result = [...result].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "lastActivity":
          comparison = new Date(a.lastActivity).getTime() - new Date(b.lastActivity).getTime();
          break;
        case "loginTime":
          comparison = new Date(a.loginTime).getTime() - new Date(b.loginTime).getTime();
          break;
        case "riskScore":
          comparison = (a.riskScore || 0) - (b.riskScore || 0);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [sessions, searchQuery, statusFilter, riskFilter, deviceFilter, sortBy, sortOrder]);

  // Handlers
  const handleViewDetails = (session: UserSession) => {
    setSelectedSession(session);
    setIsDetailsOpen(true);
  };

  const handleTerminateSession = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status: "terminated" } : s))
    );
  };

  const handleTerminateAll = () => {
    setSessions((prev) =>
      prev.map((s) => (s.status !== "terminated" ? { ...s, status: "terminated" } : s))
    );
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setRiskFilter("all");
    setDeviceFilter("all");
  };

  const hasActiveFilters =
    searchQuery || statusFilter !== "all" || riskFilter !== "all" || deviceFilter !== "all";

  return (
    <div className="space-y-6 text-foreground">
      {/* =========================================================================
          HEADER SECTION
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-card-foreground">
                Identity Active Sessions
              </h1>
              <Badge variant="secondary" className="text-xs">
                {stats.totalActive} active
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Monitor and control active user sessions across the organization. Review session
              details, identify risks, and terminate sessions when necessary.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
              Refresh
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsTerminateAllOpen(true)}
              disabled={stats.totalActive === 0}
            >
              <PowerOff className="h-4 w-4 mr-2" />
              Terminate All
            </Button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          KPI SECTION
          ========================================================================= */}
      <section className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Active Sessions"
            value={stats.totalActive}
            subtitle="Currently logged in"
            icon={Monitor}
            variant="info"
          />
          <KpiCard
            title="Idle Sessions"
            value={stats.idleSessions}
            subtitle="Inactive for 30+ min"
            icon={Clock}
            variant="warning"
          />
          <KpiCard
            title="High Risk"
            value={stats.highRiskSessions}
            subtitle="Requires attention"
            icon={AlertTriangle}
            variant={stats.highRiskSessions > 0 ? "danger" : "default"}
          />
          <KpiCard
            title="MFA Protected"
            value={stats.mfaProtected}
            subtitle={`${Math.round((stats.mfaProtected / (stats.totalActive || 1)) * 100)}% of sessions`}
            icon={ShieldCheck}
            variant="success"
          />
        </div>
      </section>

      {/* =========================================================================
          FILTERS & SEARCH SECTION
          ========================================================================= */}
      <section className="space-y-4">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user, device, or IP address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
              >
                <SelectTrigger className="w-35">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="idle">Idle</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={riskFilter}
                onValueChange={(v) => setRiskFilter(v as typeof riskFilter)}
              >
                <SelectTrigger className="w-35">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risks</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={deviceFilter}
                onValueChange={(v) => setDeviceFilter(v as typeof deviceFilter)}
              >
                <SelectTrigger className="w-35">
                  <SelectValue placeholder="Device Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Devices</SelectItem>
                  <SelectItem value="desktop">Desktop</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="tablet">Tablet</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2 ml-auto">
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lastActivity">Last Activity</SelectItem>
                    <SelectItem value="loginTime">Login Time</SelectItem>
                    <SelectItem value="riskScore">Risk Score</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                >
                  {sortOrder === "asc" ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Active Filters Indicator */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Showing {filteredSessions.length} of {sessions.length} sessions
                </span>
                <button
                  onClick={clearFilters}
                  className="ml-auto text-xs text-primary hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* =========================================================================
          SESSIONS TABLE SECTION
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Session List
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsReportDialogOpen(true)}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Card className="border-border overflow-hidden">
          {filteredSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Monitor className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No sessions found</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                {hasActiveFilters
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "There are no active sessions to display at the moment."}
              </p>
              {hasActiveFilters && (
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Groups</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Login Time</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>MFA</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead className="w-25">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.map((session) => (
                    <TableRow
                      key={session.id}
                      className={cn(
                        "cursor-pointer",
                        session.isSuspicious && "bg-red-50/50 hover:bg-red-50"
                      )}
                      onClick={() => handleViewDetails(session)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                            {session.displayName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{session.displayName}</p>
                            <p className="text-xs text-muted-foreground">{session.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {session.groups.slice(0, 2).map((group) => (
                            <span
                              key={group}
                              className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground border"
                            >
                              {group}
                            </span>
                          ))}
                          {session.groups.length > 2 && (
                            <span className="text-[10px] text-muted-foreground">
                              +{session.groups.length - 2}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <DeviceIcon type={session.deviceType} />
                          <div>
                            <p className="text-sm">{session.device}</p>
                            <p className="text-xs text-muted-foreground">{session.browser}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                          <div>
                            <p className="text-sm">{session.location || "Unknown"}</p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {session.ipAddress}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm" suppressHydrationWarning>
                          {formatTime(session.loginTime)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm" suppressHydrationWarning>
                          {getRelativeTime(session.lastActivity)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={session.status} />
                      </TableCell>
                      <TableCell>
                        <MfaBadge enabled={session.mfaEnabled} verified={session.mfaVerified} />
                      </TableCell>
                      <TableCell>
                        <RiskBadge score={session.riskScore} isSuspicious={session.isSuspicious} />
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(session)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleTerminateSession(session.id)}
                              disabled={session.status === "terminated"}
                            >
                              <PowerOff className="h-4 w-4 mr-2" />
                              Terminate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </section>

      {/* =========================================================================
          REPORTS & AUDIT SECTION
          ========================================================================= */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Reports & Audit
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Session Report</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Generate detailed session activity reports for compliance and audit purposes.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4"
                onClick={() => setIsReportDialogOpen(true)}
              >
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Risk Analysis</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    View comprehensive risk analysis and anomaly detection reports.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4"
                onClick={() => setIsRiskAnalysisOpen(true)}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Analysis
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <History className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Session History</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Access historical session data and terminated session logs.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4"
                onClick={() => setIsHistoryDialogOpen(true)}
              >
                <History className="h-4 w-4 mr-2" />
                View History
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* =========================================================================
          MONITORING SECTION - Dashboard unifié avec sélection intelligente
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Monitoring
          </h2>
          <div className="flex items-center gap-2">
            <Select value={selectedChart} onValueChange={(v) => setSelectedChart(v as ChartType)}>
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Vue d&apos;ensemble</SelectItem>
                <SelectItem value="devices">Par Type d&apos;Appareil</SelectItem>
                <SelectItem value="geography">Répartition Géographique</SelectItem>
                <SelectItem value="activity">Activité Temporelle</SelectItem>
                <SelectItem value="risk">Distribution des Risques</SelectItem>
                <SelectItem value="mfa">Statut MFA</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              {selectedChart === "overview" && <Activity className="h-4 w-4" />}
              {selectedChart === "devices" && <Laptop className="h-4 w-4" />}
              {selectedChart === "geography" && <Globe className="h-4 w-4" />}
              {selectedChart === "activity" && <Clock className="h-4 w-4" />}
              {selectedChart === "risk" && <AlertTriangle className="h-4 w-4" />}
              {selectedChart === "mfa" && <ShieldCheck className="h-4 w-4" />}
              {chartTitles[selectedChart]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {selectedChart === "overview" ? (
                  <LineChart
                    data={activityData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="active"
                      name="Sessions Actives"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: "#10b981" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="idle"
                      name="Sessions Inactives"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={{ fill: "#f59e0b" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="terminated"
                      name="Sessions Terminées"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ fill: "#ef4444" }}
                    />
                  </LineChart>
                ) : selectedChart === "devices" ? (
                  <BarChart
                    data={deviceTypeData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                    />
                    <Bar dataKey="sessions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : selectedChart === "geography" ? (
                  <PieChart>
                    <Pie
                      data={countryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                      }
                    >
                      {countryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                    />
                    <Legend />
                  </PieChart>
                ) : selectedChart === "activity" ? (
                  <LineChart
                    data={activityData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="active"
                      name="Sessions Actives"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: "#3b82f6", r: 5 }}
                    />
                  </LineChart>
                ) : selectedChart === "risk" ? (
                  <BarChart
                    data={riskDistributionData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {riskDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={RISK_COLORS[index]} />
                      ))}
                    </Bar>
                  </BarChart>
                ) : (
                  <PieChart>
                    <Pie
                      data={mfaData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                      }
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#f59e0b" />
                      <Cell fill="#6b7280" />
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                    />
                    <Legend />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => setSelectedChart("devices")}
            className={cn(
              "p-3 rounded-lg border text-left transition-all hover:shadow-md",
              selectedChart === "devices"
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-primary/50"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <Laptop className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Appareils</span>
            </div>
            <p className="text-lg font-semibold">
              {deviceTypeData.reduce((a, b) => a + b.sessions, 0)}
            </p>
            <p className="text-xs text-muted-foreground">{deviceTypeData.length} types</p>
          </button>

          <button
            onClick={() => setSelectedChart("geography")}
            className={cn(
              "p-3 rounded-lg border text-left transition-all hover:shadow-md",
              selectedChart === "geography"
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-primary/50"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Pays</span>
            </div>
            <p className="text-lg font-semibold">{countryData.length}</p>
            <p className="text-xs text-muted-foreground">localisations</p>
          </button>

          <button
            onClick={() => setSelectedChart("risk")}
            className={cn(
              "p-3 rounded-lg border text-left transition-all hover:shadow-md",
              selectedChart === "risk"
                ? "border-red-400 bg-red-50"
                : "border-border bg-card hover:border-red-300"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-xs text-muted-foreground">Risque Élevé</span>
            </div>
            <p className="text-lg font-semibold text-red-600">{stats.highRiskSessions}</p>
            <p className="text-xs text-muted-foreground">sessions</p>
          </button>

          <button
            onClick={() => setSelectedChart("mfa")}
            className={cn(
              "p-3 rounded-lg border text-left transition-all hover:shadow-md",
              selectedChart === "mfa"
                ? "border-emerald-400 bg-emerald-50"
                : "border-border bg-card hover:border-emerald-300"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span className="text-xs text-muted-foreground">MFA Actif</span>
            </div>
            <p className="text-lg font-semibold text-emerald-600">
              {Math.round((stats.mfaProtected / (stats.totalActive || 1)) * 100)}%
            </p>
            <p className="text-xs text-muted-foreground">{stats.mfaProtected} sessions</p>
          </button>
        </div>
      </section>

      {/* =========================================================================
          DIALOGS
          ========================================================================= */}
      <SessionDetailsDialog
        session={selectedSession}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onTerminate={handleTerminateSession}
      />

      <TerminateAllDialog
        open={isTerminateAllOpen}
        onOpenChange={setIsTerminateAllOpen}
        sessionCount={stats.totalActive}
        onConfirm={handleTerminateAll}
      />

      <ReportDialog
        open={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        sessions={filteredSessions}
      />

      <RiskAnalysisDialog
        open={isRiskAnalysisOpen}
        onOpenChange={setIsRiskAnalysisOpen}
        sessions={sessions}
      />

      <HistoryDialog
        open={isHistoryDialogOpen}
        onOpenChange={setIsHistoryDialogOpen}
        sessions={sessions}
      />
    </div>
  );
}
