"use client";

import { useState } from "react";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Activity,
  LogIn,
  AlertTriangle,
  Lock,
  Eye,
  Download,
  RefreshCw,
  Clock,
  ChevronRight,
  UserCheck,
  Key,
  Ban,
  Flag,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const securityMetrics = {
  totalEvents: 12847,
  blockedAttempts: 234,
  failedLogins: 156,
  suspiciousActivity: 12,
  activeBlocks: 8,
  mfaChallenges: 892,
};

const threatData = [
  { time: "00:00", blocked: 12, failed: 8, suspicious: 2 },
  { time: "04:00", blocked: 8, failed: 5, suspicious: 1 },
  { time: "08:00", blocked: 25, failed: 18, suspicious: 3 },
  { time: "12:00", blocked: 45, failed: 32, suspicious: 5 },
  { time: "16:00", blocked: 38, failed: 24, suspicious: 4 },
  { time: "20:00", blocked: 22, failed: 15, suspicious: 2 },
];

const attackTypes = [
  { type: "Brute Force", count: 156, severity: "high" },
  { type: "Credential Stuffing", count: 89, severity: "high" },
  { type: "Suspicious IP", count: 45, severity: "medium" },
  { type: "MFA Bypass", count: 23, severity: "high" },
  { type: "Token Theft", count: 12, severity: "critical" },
  { type: "Session Hijacking", count: 8, severity: "critical" },
];

const securityEvents = [
  {
    id: 1,
    type: "blocked_ip",
    severity: "high",
    description: "IP blocked due to failed login attempts",
    ip: "203.45.67.89",
    location: "Unknown",
    count: 47,
    time: "2 minutes ago",
    action: "Blocked",
  },
  {
    id: 2,
    type: "suspicious_login",
    severity: "medium",
    description: "Login attempt from unusual location",
    ip: "10.0.0.123",
    location: "Russia",
    time: "8 minutes ago",
    action: "Flagged",
  },
  {
    id: 3,
    type: "brute_force",
    severity: "high",
    description: "Multiple failed login attempts detected",
    ip: "45.67.89.101",
    location: "China",
    count: 23,
    time: "15 minutes ago",
    action: "Blocked",
  },
  {
    id: 4,
    type: "mfa_failed",
    severity: "medium",
    description: "MFA challenge failed 3 times",
    ip: "192.168.2.100",
    location: "Ukraine",
    count: 3,
    time: "22 minutes ago",
    action: "Locked",
  },
  {
    id: 5,
    type: "credential_stuffing",
    severity: "high",
    description: "Suspicious login pattern detected",
    ip: "172.16.0.55",
    location: "Nigeria",
    count: 156,
    time: "31 minutes ago",
    action: "Blocked",
  },
];

const blockedIPs = [
  { ip: "203.45.67.89", reason: "Brute Force Attack", expires: "2 hours", addedBy: "System" },
  { ip: "45.67.89.101", reason: "Credential Stuffing", expires: "12 hours", addedBy: "Admin" },
  { ip: "172.16.0.55", reason: "Suspicious Activity", expires: "1 hour", addedBy: "System" },
];

const chartConfig = {
  blocked: { label: "Blocked", color: "oklch(0.55 0.2 25)" },
  failed: { label: "Failed", color: "oklch(0.55 0.15 45)" },
  suspicious: { label: "Suspicious", color: "oklch(0.6 0.2 320)" },
};

function getSeverityBadge(severity: string) {
  switch (severity) {
    case "critical":
      return (
        <Badge variant="destructive" className="text-xs font-normal">
          Critical
        </Badge>
      );
    case "high":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-xs font-normal">High</Badge>
      );
    case "medium":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 text-xs font-normal">
          Medium
        </Badge>
      );
    case "low":
      return (
        <Badge variant="outline" className="text-xs font-normal">
          Low
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="text-xs font-normal">
          Unknown
        </Badge>
      );
  }
}

function getEventIcon(type: string) {
  switch (type) {
    case "blocked_ip":
      return <Ban className="h-4 w-4 text-red-500" />;
    case "suspicious_login":
      return <Eye className="h-4 w-4 text-yellow-500" />;
    case "brute_force":
      return <Key className="h-4 w-4 text-red-500" />;
    case "mfa_failed":
      return <ShieldAlert className="h-4 w-4 text-yellow-500" />;
    case "credential_stuffing":
      return <Flag className="h-4 w-4 text-red-500" />;
    default:
      return <Shield className="h-4 w-4" />;
  }
}

export default function SecurityMonitoringPage() {
  const [timeRange, setTimeRange] = useState("24h");
  const [eventFilter, setEventFilter] = useState("all");

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header Section */}
      <div className="border-b bg-background">
        <div className="px-6 py-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">Security Monitoring</h1>
            <p className="text-muted-foreground">
              Monitor threat detection, blocked attempts, and security events.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Security Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                  <p className="text-2xl font-bold tracking-tight">
                    {securityMetrics.totalEvents.toLocaleString()}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Activity className="h-5 w-5 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Blocked Attempts</p>
                  <p className="text-2xl font-bold tracking-tight text-red-600">
                    {securityMetrics.blockedAttempts}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <Ban className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Failed Logins</p>
                  <p className="text-2xl font-bold tracking-tight">
                    {securityMetrics.failedLogins}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <LogIn className="h-5 w-5 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Suspicious</p>
                  <p className="text-2xl font-bold tracking-tight text-yellow-600">
                    {securityMetrics.suspiciousActivity}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Active Blocks</p>
                  <p className="text-2xl font-bold tracking-tight">
                    {securityMetrics.activeBlocks}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Lock className="h-5 w-5 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">MFA Challenges</p>
                  <p className="text-2xl font-bold tracking-tight">
                    {securityMetrics.mfaChallenges}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <ShieldCheck className="h-5 w-5 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Threat Activity Chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base font-semibold">Threat Activity</CardTitle>
                <CardDescription>Blocked and failed attempts over time</CardDescription>
              </div>
              <div className="flex gap-2">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">Last hour</SelectItem>
                    <SelectItem value="24h">Last 24 hours</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="h-8">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-sm text-muted-foreground">Blocked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <span className="text-sm text-muted-foreground">Failed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-pink-500" />
                  <span className="text-sm text-muted-foreground">Suspicious</span>
                </div>
              </div>
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <AreaChart data={threatData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillBlocked" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-blocked)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--color-blocked)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="blocked"
                    stroke="var(--color-blocked)"
                    strokeWidth={2}
                    fill="url(#fillBlocked)"
                  />
                  <Area
                    type="monotone"
                    dataKey="failed"
                    stroke="var(--color-failed)"
                    strokeWidth={2}
                    fill="transparent"
                  />
                  <Area
                    type="monotone"
                    dataKey="suspicious"
                    stroke="var(--color-suspicious)"
                    strokeWidth={2}
                    fill="transparent"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Attack Types */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Attack Types</CardTitle>
              <CardDescription>Threat distribution by category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {attackTypes.map((attack) => (
                <div key={attack.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        attack.severity === "critical"
                          ? "bg-red-600"
                          : attack.severity === "high"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                      )}
                    />
                    <span className="text-sm">{attack.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{attack.count}</span>
                    {getSeverityBadge(attack.severity)}
                  </div>
                </div>
              ))}
              <Separator className="my-4" />
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Block Rate</span>
                  <span className="font-medium">98.2%</span>
                </div>
                <Progress value={98.2} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Events & Blocked IPs */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Security Events */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Recent Security Events</CardTitle>
                  <CardDescription>Latest threat detections</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={eventFilter} onValueChange={setEventFilter}>
                    <SelectTrigger className="w-36 h-8">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Events</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                      <SelectItem value="flagged">Flagged</SelectItem>
                      <SelectItem value="locked">Locked</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" className="h-8">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {securityEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 px-6 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted mt-0.5">
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{event.description}</p>
                        {getSeverityBadge(event.severity)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{event.ip}</span>
                        <span>-</span>
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline" className="text-xs font-normal">
                        {event.action}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{event.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Blocked IPs */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Blocked IP Addresses</CardTitle>
                  <CardDescription>Currently blocked addresses</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="h-8">
                  <Ban className="h-4 w-4 mr-2" />
                  Add Block
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {blockedIPs.map((ip) => (
                  <div key={ip.ip} className="flex items-center justify-between px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                        <Ban className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium font-mono">{ip.ip}</p>
                        <p className="text-xs text-muted-foreground">{ip.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Expires in {ip.expires}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        <ShieldX className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Services & Rules */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Protection Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Protection Status</CardTitle>
              <CardDescription>Active security features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Brute Force Protection</p>
                    <p className="text-xs text-muted-foreground">Active after 5 attempts</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">MFA Challenge</p>
                    <p className="text-xs text-muted-foreground">Required for sensitive actions</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Anomaly Detection</p>
                    <p className="text-xs text-muted-foreground">ML-based threat detection</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                    <ShieldAlert className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">IP Reputation</p>
                    <p className="text-xs text-muted-foreground">Block known malicious IPs</p>
                  </div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                  Learning
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Bot Detection</p>
                    <p className="text-xs text-muted-foreground">Block automated attacks</p>
                  </div>
                </div>
                <Badge variant="outline">Disabled</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Activity Log */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Activity Log</CardTitle>
                  <CardDescription>Security action history</CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                  <Ban className="h-3 w-3 text-red-600" />
                </div>
                <span className="flex-1">IP 203.45.67.89 blocked</span>
                <span className="text-muted-foreground">2m ago</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100">
                  <Flag className="h-3 w-3 text-yellow-600" />
                </div>
                <span className="flex-1">Suspicious activity flagged</span>
                <span className="text-muted-foreground">8m ago</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                  <Ban className="h-3 w-3 text-red-600" />
                </div>
                <span className="flex-1">Brute force attack blocked</span>
                <span className="text-muted-foreground">15m ago</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                  <Lock className="h-3 w-3 text-blue-600" />
                </div>
                <span className="flex-1">Account locked due to MFA failures</span>
                <span className="text-muted-foreground">22m ago</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                  <UserCheck className="h-3 w-3 text-green-600" />
                </div>
                <span className="flex-1">MFA challenge completed</span>
                <span className="text-muted-foreground">31m ago</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="cursor-pointer transition-all hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <Ban className="h-6 w-6 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Block IP Address</p>
                <p className="text-sm text-muted-foreground">Manually block an IP</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-all hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <Key className="h-6 w-6 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Security Rules</p>
                <p className="text-sm text-muted-foreground">Configure threat rules</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-all hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <Activity className="h-6 w-6 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Audit Logs</p>
                <p className="text-sm text-muted-foreground">View complete logs</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
