"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Activity,
  AppWindow,
  Key,
  ArrowUpRight,
  Clock,
  LogIn,
  UserPlus,
  KeyRound,
  RefreshCw,
  Settings,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useAuth } from "@/context/AuthContext";
import { StatsCard } from "@/components/admin/stats-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const activityData = [
  { date: "00h", requests: 1200, sessions: 45 },
  { date: "04h", requests: 1800, sessions: 62 },
  { date: "08h", requests: 3500, sessions: 128 },
  { date: "12h", requests: 5200, sessions: 185 },
  { date: "16h", requests: 4800, sessions: 165 },
  { date: "20h", requests: 3200, sessions: 110 },
  { date: "24h", requests: 2100, sessions: 78 },
];

const connectionsData = [
  { name: "Email/Password", users: 845, color: "#8B5CF6" },
  { name: "Google OAuth", users: 312, color: "#EA4335" },
  { name: "GitHub OAuth", users: 156, color: "#333" },
  { name: "SAML Enterprise", users: 45, color: "#0066CC" },
];

const recentActivity = [
  {
    type: "login",
    user: "john@example.com",
    action: "logged in",
    target: "via Email/Password",
    time: "2 min ago",
    icon: LogIn,
    status: "success",
  },
  {
    type: "api-key",
    user: "admin@etheriatimes.com",
    action: "created API key",
    target: "Production API",
    time: "15 min ago",
    icon: KeyRound,
    status: "success",
  },
  {
    type: "oauth",
    user: "jane@company.com",
    action: "authorized via",
    target: "Google OAuth",
    time: "1 hour ago",
    icon: LogIn,
    status: "success",
  },
  {
    type: "password-reset",
    user: "reset@request.com",
    action: "password reset",
    target: "failed - too many attempts",
    time: "2 hours ago",
    icon: RefreshCw,
    status: "failed",
  },
  {
    type: "user-created",
    user: "admin@etheriatimes.com",
    action: "created user",
    target: "new@company.com",
    time: "3 hours ago",
    icon: UserPlus,
    status: "success",
  },
];

const applicationStatus = [
  { name: "Web App", clientId: "web_123", status: "active", users: 456 },
  { name: "Mobile iOS", clientId: "ios_456", status: "active", users: 234 },
  { name: "API Service", clientId: "api_789", status: "active", users: 89 },
  { name: "Legacy App", clientId: "legacy_000", status: "inactive", users: 0 },
];

const quickActions = [
  {
    label: "New Application",
    href: "/dashboard/applications",
    icon: AppWindow,
    color: "bg-violet-500",
  },
  { label: "View Logs", href: "/dashboard/monitoring/logs", icon: Activity, color: "bg-cyan-500" },
  { label: "Add User", href: "/dashboard/users", icon: UserPlus, color: "bg-emerald-500" },
  { label: "Settings", href: "/dashboard/extension", icon: Settings, color: "bg-amber-500" },
];

const chartConfig = {
  requests: { label: "Requêtes", color: "oklch(0.55 0.15 250)" },
  sessions: { label: "Sessions", color: "oklch(0.7 0.15 250)" },
};

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
    case "inactive":
      return <Badge variant="secondary">Inactive</Badge>;
    case "success":
      return (
        <Badge variant="outline" className="text-green-600">
          Success
        </Badge>
      );
    case "failed":
      return <Badge variant="destructive">Failed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("24h");

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {user?.name?.split(" ")[0] || "Admin"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening with your identity platform today.
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <Activity className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">Last hour</SelectItem>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2"
            asChild
          >
            <Link href={action.href}>
              <div className={`p-2 rounded-lg ${action.color}`}>
                <action.icon className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm">{action.label}</span>
            </Link>
          </Button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value="1,358"
          change="+12%"
          changeType="positive"
          description="vs last period"
          icon={Users}
        />
        <StatsCard
          title="Active Sessions"
          value="89"
          change="+5%"
          changeType="positive"
          description="vs last period"
          icon={Activity}
        />
        <StatsCard
          title="Applications"
          value="12"
          change="+2"
          changeType="positive"
          description="vs last period"
          icon={AppWindow}
        />
        <StatsCard
          title="API Requests"
          value="45.2K"
          change="-3%"
          changeType="negative"
          description="vs last period"
          icon={Key}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">API Activity</CardTitle>
                <CardDescription>Requests and sessions over time</CardDescription>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Requests</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[oklch(0.7_0.15_250)]" />
                  <span className="text-muted-foreground">Sessions</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-70 w-full">
              <AreaChart data={activityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-requests)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-requests)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fillSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-sessions)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-sessions)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="sessions"
                  stroke="var(--color-sessions)"
                  strokeWidth={2}
                  fill="url(#fillSessions)"
                />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stroke="var(--color-requests)"
                  strokeWidth={2}
                  fill="url(#fillRequests)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Connections</CardTitle>
                <CardDescription>Users by authentication method</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/connection" className="gap-1">
                  View all
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {connectionsData.map((connection) => (
                <div key={connection.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: connection.color }}
                    />
                    <span className="text-sm font-medium">{connection.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{connection.users}</span>
                    <Badge variant="outline" className="text-xs">
                      {connection.users > 500 ? "High" : connection.users > 100 ? "Medium" : "Low"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Recent Activity</CardTitle>
                <CardDescription>Latest events in your platform</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/monitoring/logs" className="gap-1">
                  View all
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 px-6 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <activity.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>{" "}
                      <span className="text-muted-foreground">{activity.action}</span>
                      {activity.target && (
                        <>
                          {" "}
                          <span className="font-medium">{activity.target}</span>
                        </>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </p>
                  </div>
                  {getStatusBadge(activity.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Applications</CardTitle>
                <CardDescription>Client applications status</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/applications" className="gap-1">
                  View all
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {applicationStatus.map((app) => (
                <div key={app.clientId} className="flex items-center justify-between px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <AppWindow className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{app.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{app.clientId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{app.users} users</span>
                    {getStatusBadge(app.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
