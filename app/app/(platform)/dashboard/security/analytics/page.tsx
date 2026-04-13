"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Globe,
  ArrowRight,
  ChevronRight,
  Fingerprint,
  MapPin,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Ban,
  Eye,
  Skull,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  XAxis as BarXAxis,
  YAxis as BarYAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const securityActivityData = [
  { time: "00:00", blocked: 12, failed: 3, suspicious: 1, mfa: 8 },
  { time: "04:00", blocked: 8, failed: 2, suspicious: 0, mfa: 5 },
  { time: "08:00", blocked: 45, failed: 18, suspicious: 5, mfa: 32 },
  { time: "12:00", blocked: 78, failed: 28, suspicious: 12, mfa: 55 },
  { time: "16:00", blocked: 52, failed: 15, suspicious: 8, mfa: 42 },
  { time: "20:00", blocked: 34, failed: 8, suspicious: 3, mfa: 25 },
];

const threatData = [
  { type: "Brute Force", count: 234, severity: "high" },
  { type: "Credential Stuffing", count: 89, severity: "critical" },
  { type: "Suspicious IP", count: 156, severity: "medium" },
  { type: "Account Takeover", count: 23, severity: "critical" },
  { type: "Bot Detection", count: 412, severity: "low" },
];

const securityEvents = [
  {
    type: "blocked_ip",
    severity: "critical",
    description: "IP blocked due to multiple failed attempts",
    ip: "192.168.1.100",
    location: "Russia",
    time: "2 minutes ago",
    count: 47,
  },
  {
    type: "credential_stuffing",
    severity: "critical",
    description: "Credential stuffing attack detected",
    ip: "10.0.0.45",
    location: "China",
    time: "8 minutes ago",
    count: 234,
  },
  {
    type: "mfa_challenge",
    severity: "warning",
    description: "MFA challenge failed multiple times",
    ip: "172.16.0.23",
    location: "Unknown",
    time: "15 minutes ago",
    count: 5,
  },
  {
    type: "suspicious_login",
    severity: "warning",
    description: "Login from unusual location",
    ip: "203.45.67.89",
    location: "Brazil",
    time: "22 minutes ago",
    count: 1,
  },
  {
    type: "brute_force",
    severity: "high",
    description: "Brute force attack attempt blocked",
    ip: "198.51.100.23",
    location: "Ukraine",
    time: "31 minutes ago",
    count: 156,
  },
];

const suspiciousIPs = [
  {
    ip: "192.168.1.100",
    location: "Russia",
    attempts: 47,
    lastSeen: "2 min ago",
    action: "blocked",
  },
  { ip: "10.0.0.45", location: "China", attempts: 234, lastSeen: "8 min ago", action: "blocked" },
  {
    ip: "198.51.100.23",
    location: "Ukraine",
    attempts: 156,
    lastSeen: "31 min ago",
    action: "blocked",
  },
  {
    ip: "203.45.67.89",
    location: "Brazil",
    attempts: 12,
    lastSeen: "45 min ago",
    action: "watching",
  },
];

const mfaStats = [
  { method: "Authenticator App", users: 4523, percentage: 65 },
  { method: "SMS", users: 1245, percentage: 18 },
  { method: "Email", users: 678, percentage: 10 },
  { method: "Hardware Key", users: 234, percentage: 3 },
  { method: "None", users: 342, percentage: 5 },
];

const chartConfig = {
  blocked: { label: "Blocked", color: "oklch(0.55 0.2 25)" },
  failed: { label: "Failed", color: "oklch(0.55 0.2 45)" },
  suspicious: { label: "Suspicious", color: "oklch(0.55 0.15 145)" },
  mfa: { label: "MFA Challenges", color: "oklch(0.18 0 0)" },
};

function getSeverityColor(severity: string) {
  switch (severity) {
    case "critical":
      return "bg-red-500";
    case "high":
      return "bg-orange-500";
    case "warning":
      return "bg-yellow-500";
    case "medium":
      return "bg-yellow-400";
    default:
      return "bg-green-500";
  }
}

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
        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 text-xs font-normal">
          High
        </Badge>
      );
    case "warning":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 text-xs font-normal">
          Warning
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-xs font-normal">
          Low
        </Badge>
      );
  }
}

function getEventIcon(type: string) {
  switch (type) {
    case "blocked_ip":
      return <Ban className="h-4 w-4 text-red-500" />;
    case "credential_stuffing":
      return <Skull className="h-4 w-4 text-red-600" />;
    case "mfa_challenge":
      return <Fingerprint className="h-4 w-4 text-yellow-500" />;
    case "suspicious_login":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case "brute_force":
      return <ShieldAlert className="h-4 w-4 text-orange-500" />;
    default:
      return <Shield className="h-4 w-4" />;
  }
}

export default function SecurityAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("24h");
  const [threatType, setThreatType] = useState("all");

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="px-6 py-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">Security Analytics</h1>
            <p className="text-muted-foreground">
              Monitor security threats, blocked attacks, and authentication protection.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Threats Blocked</p>
                  <p className="text-3xl font-bold tracking-tight">1,284</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                  <ShieldAlert className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">+34.2%</span>
                </div>
                <span className="text-muted-foreground">from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Failed MFA Attempts</p>
                  <p className="text-3xl font-bold tracking-tight">156</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-50">
                  <Fingerprint className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1 text-red-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">+12.8%</span>
                </div>
                <span className="text-muted-foreground">from yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">IPs Blocked</p>
                  <p className="text-3xl font-bold tracking-tight">89</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                  <Ban className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingDown className="h-4 w-4" />
                  <span className="font-medium">-8.3%</span>
                </div>
                <span className="text-muted-foreground">from yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">MFA Adoption</p>
                  <p className="text-3xl font-bold tracking-tight">95%</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                  <ShieldCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">+5.2%</span>
                </div>
                <span className="text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base font-semibold">Security Activity</CardTitle>
                <CardDescription>Threats blocked and failed attempts over time</CardDescription>
              </div>
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
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-sm text-muted-foreground">Blocked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Failed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <span className="text-sm text-muted-foreground">Suspicious</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-foreground" />
                  <span className="text-sm text-muted-foreground">MFA</span>
                </div>
              </div>
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <AreaChart
                  data={securityActivityData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
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
                  <Area
                    type="monotone"
                    dataKey="mfa"
                    stroke="var(--color-mfa)"
                    strokeWidth={2}
                    fill="transparent"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Threats by Type</CardTitle>
              <CardDescription>Distribution of detected threats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {threatData.map((threat) => (
                  <div key={threat.type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{threat.type}</span>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs font-normal",
                            threat.severity === "critical" && "border-red-200 text-red-600",
                            threat.severity === "high" && "border-orange-200 text-orange-600",
                            threat.severity === "medium" && "border-yellow-200 text-yellow-600",
                            threat.severity === "low" && "border-green-200 text-green-600"
                          )}
                        >
                          {threat.severity}
                        </Badge>
                        <span className="text-sm font-medium">{threat.count}</span>
                      </div>
                    </div>
                    <Progress
                      value={(threat.count / 500) * 100}
                      className={cn(
                        "h-2",
                        threat.severity === "critical" && "[&>div]:bg-red-500",
                        threat.severity === "high" && "[&>div]:bg-orange-500",
                        threat.severity === "medium" && "[&>div]:bg-yellow-500",
                        threat.severity === "low" && "[&>div]:bg-green-500"
                      )}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Security Events</CardTitle>
                  <CardDescription>Recent security incidents</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/security/events" className="gap-1">
                    View all
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {securityEvents.map((event, index) => (
                  <div key={index} className="flex items-start gap-3 px-6 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted mt-0.5">
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{event.description}</p>
                        {getSeverityBadge(event.severity)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                        <span>-</span>
                        <span>{event.ip}</span>
                        <span>-</span>
                        <span>{event.count} attempts</span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {event.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Blocked IPs</CardTitle>
                  <CardDescription>Malicious IP addresses</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/security/blocklist" className="gap-1">
                    <Ban className="h-4 w-4" />
                    Manage Blocklist
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {suspiciousIPs.map((ip, index) => (
                  <div key={index} className="flex items-start gap-3 px-6 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 mt-0.5">
                      <Ban className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-mono font-medium">{ip.ip}</p>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs font-normal",
                            ip.action === "blocked"
                              ? "border-red-200 bg-red-50 text-red-600"
                              : "border-yellow-200 bg-yellow-50 text-yellow-600"
                          )}
                        >
                          {ip.action}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{ip.location}</span>
                        <span>-</span>
                        <span>{ip.attempts} attempts</span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {ip.lastSeen}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">MFA Methods</CardTitle>
              <CardDescription>Multi-factor authentication adoption by method</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mfaStats.map((stat) => (
                  <div key={stat.method} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
                        <Fingerprint className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="text-sm">{stat.method}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">{stat.users.toLocaleString()}</span>
                      <Progress value={stat.percentage} className="w-24 h-2" />
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {stat.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Protection Status</CardTitle>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  All Protections Active
                </Badge>
              </div>
              <CardDescription>Security features and protection status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Brute Force Protection</span>
                </div>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Fingerprint className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">MFA Challenge</span>
                </div>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Anomaly Detection</span>
                </div>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">IP Reputation</span>
                </div>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium">Bot Detection</span>
                </div>
                <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 text-xs">
                  Learning
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="group cursor-pointer transition-all hover:shadow-md">
            <Link href="/dashboard/security/blocklist">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50">
                  <Ban className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">IP Blocklist</p>
                  <p className="text-sm text-muted-foreground">Block malicious IP addresses</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </CardContent>
            </Link>
          </Card>

          <Card className="group cursor-pointer transition-all hover:shadow-md">
            <Link href="/dashboard/security/rules">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-50">
                  <ShieldAlert className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Security Rules</p>
                  <p className="text-sm text-muted-foreground">Configure threat detection rules</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </CardContent>
            </Link>
          </Card>

          <Card className="group cursor-pointer transition-all hover:shadow-md">
            <Link href="/dashboard/security/mfa">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50">
                  <Fingerprint className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">MFA Settings</p>
                  <p className="text-sm text-muted-foreground">Configure authentication methods</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
