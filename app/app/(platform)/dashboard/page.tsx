"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Activity,
  AppWindow,
  Key,
  ArrowRight,
  LogIn,
  UserPlus,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Shield,
  Globe,
  Database,
  Zap,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Cpu,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useAuth } from "@/context/AuthContext";
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

const activityData = [
  { time: "00:00", logins: 120, signups: 8, failures: 3 },
  { time: "04:00", logins: 85, signups: 4, failures: 2 },
  { time: "08:00", logins: 450, signups: 25, failures: 12 },
  { time: "12:00", logins: 680, signups: 42, failures: 18 },
  { time: "16:00", logins: 590, signups: 35, failures: 8 },
  { time: "20:00", logins: 320, signups: 18, failures: 5 },
];

const gettingStartedSteps = [
  {
    id: 1,
    title: "Create your first application",
    description: "Register an application to get your Client ID and Secret",
    href: "/dashboard/applications",
    completed: true,
    icon: AppWindow,
  },
  {
    id: 2,
    title: "Configure a connection",
    description: "Set up how users will authenticate (Database, Social, Enterprise)",
    href: "/dashboard/connection/database",
    completed: true,
    icon: Database,
  },
  {
    id: 3,
    title: "Customize your login page",
    description: "Brand your Universal Login experience",
    href: "/dashboard/branding/universal-login",
    completed: false,
    icon: Globe,
  },
  {
    id: 4,
    title: "Enable Multi-Factor Authentication",
    description: "Add an extra layer of security for your users",
    href: "/dashboard/security/mfa",
    completed: false,
    icon: Shield,
  },
  {
    id: 5,
    title: "Set up Actions",
    description: "Extend authentication flows with custom logic",
    href: "/dashboard/actions/library",
    completed: false,
    icon: Zap,
  },
];

const recentEvents = [
  {
    type: "success_login",
    description: "Successful login",
    user: "john.doe@example.com",
    connection: "Username-Password",
    time: "2 minutes ago",
    ip: "192.168.1.45",
  },
  {
    type: "success_signup",
    description: "New user signup",
    user: "jane.smith@company.co",
    connection: "Google OAuth",
    time: "8 minutes ago",
    ip: "10.0.0.123",
  },
  {
    type: "failed_login",
    description: "Failed login attempt",
    user: "unknown@test.com",
    connection: "Username-Password",
    time: "15 minutes ago",
    ip: "203.45.67.89",
  },
  {
    type: "success_login",
    description: "Successful login",
    user: "admin@etheriatimes.com",
    connection: "SAML Enterprise",
    time: "22 minutes ago",
    ip: "172.16.0.55",
  },
  {
    type: "mfa_challenge",
    description: "MFA challenge completed",
    user: "secure@company.org",
    connection: "Username-Password",
    time: "31 minutes ago",
    ip: "192.168.2.100",
  },
];

const applications = [
  { name: "Production Web App", type: "Regular Web App", status: "active", logins: 1234 },
  { name: "Mobile iOS App", type: "Native App", status: "active", logins: 567 },
  { name: "Admin Dashboard", type: "Single Page App", status: "active", logins: 89 },
  { name: "Legacy Backend", type: "Machine to Machine", status: "inactive", logins: 0 },
];

const systemHealth = [
  { name: "Authentication API", status: "operational", latency: "12ms" },
  { name: "Management API", status: "operational", latency: "45ms" },
  { name: "Database Connections", status: "operational", latency: "8ms" },
  { name: "Token Service", status: "operational", latency: "15ms" },
];

const chartConfig = {
  logins: { label: "Logins", color: "oklch(0.18 0 0)" },
  signups: { label: "Signups", color: "oklch(0.55 0.15 145)" },
  failures: { label: "Failures", color: "oklch(0.55 0.2 25)" },
};

function getEventIcon(type: string) {
  switch (type) {
    case "success_login":
      return <LogIn className="h-4 w-4 text-foreground" />;
    case "success_signup":
      return <UserPlus className="h-4 w-4 text-green-600" />;
    case "failed_login":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case "mfa_challenge":
      return <Shield className="h-4 w-4 text-blue-500" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
}

function getEventBadge(type: string) {
  switch (type) {
    case "success_login":
      return (
        <Badge variant="outline" className="text-xs font-normal">
          Success
        </Badge>
      );
    case "success_signup":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs font-normal">
          New User
        </Badge>
      );
    case "failed_login":
      return (
        <Badge variant="destructive" className="text-xs font-normal">
          Failed
        </Badge>
      );
    case "mfa_challenge":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs font-normal">
          MFA
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="text-xs font-normal">
          Event
        </Badge>
      );
  }
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("24h");
  const completedSteps = gettingStartedSteps.filter((s) => s.completed).length;
  const progress = (completedSteps / gettingStartedSteps.length) * 100;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header Section */}
      <div className="border-b bg-background">
        <div className="px-6 py-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back, {user?.name?.split(" ")[0] || "Developer"}
            </h1>
            <p className="text-muted-foreground">
              Monitor your identity platform and manage authentication services.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold tracking-tight">12,847</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Users className="h-6 w-6 text-foreground" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">+12.5%</span>
                </div>
                <span className="text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
                  <p className="text-3xl font-bold tracking-tight">2,847</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Activity className="h-6 w-6 text-foreground" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">+5.2%</span>
                </div>
                <span className="text-muted-foreground">from yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Logins Today</p>
                  <p className="text-3xl font-bold tracking-tight">8,432</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <LogIn className="h-6 w-6 text-foreground" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">+18.3%</span>
                </div>
                <span className="text-muted-foreground">from average</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Failed Logins</p>
                  <p className="text-3xl font-bold tracking-tight">48</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <AlertCircle className="h-6 w-6 text-foreground" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingDown className="h-4 w-4" />
                  <span className="font-medium">-23.1%</span>
                </div>
                <span className="text-muted-foreground">from yesterday</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Activity Chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base font-semibold">Authentication Activity</CardTitle>
                <CardDescription>Login and signup trends over time</CardDescription>
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
                  <div className="h-3 w-3 rounded-full bg-foreground" />
                  <span className="text-sm text-muted-foreground">Logins</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-sm text-muted-foreground">Signups</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-sm text-muted-foreground">Failures</span>
                </div>
              </div>
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <AreaChart data={activityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillLogins" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-logins)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--color-logins)" stopOpacity={0} />
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
                    dataKey="logins"
                    stroke="var(--color-logins)"
                    strokeWidth={2}
                    fill="url(#fillLogins)"
                  />
                  <Area
                    type="monotone"
                    dataKey="signups"
                    stroke="var(--color-signups)"
                    strokeWidth={2}
                    fill="transparent"
                  />
                  <Area
                    type="monotone"
                    dataKey="failures"
                    stroke="var(--color-failures)"
                    strokeWidth={2}
                    fill="transparent"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">System Status</CardTitle>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  All Operational
                </Badge>
              </div>
              <CardDescription>Service health and latency</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {systemHealth.map((service) => (
                <div key={service.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm">{service.name}</span>
                  </div>
                  <span className="text-sm font-mono text-muted-foreground">{service.latency}</span>
                </div>
              ))}
              <Separator className="my-4" />
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">API Rate Limit</span>
                  <span className="font-medium">2,847 / 10,000</span>
                </div>
                <Progress value={28.47} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started & Recent Events */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Getting Started */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Getting Started</CardTitle>
                  <CardDescription>Complete your platform setup</CardDescription>
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {completedSteps}/{gettingStartedSteps.length} completed
                </span>
              </div>
              <Progress value={progress} className="h-2 mt-3" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {gettingStartedSteps.map((step) => (
                  <Link
                    key={step.id}
                    href={step.href}
                    className={cn(
                      "flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/50",
                      step.completed && "opacity-60"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full",
                        step.completed ? "bg-green-100" : "bg-muted"
                      )}
                    >
                      {step.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <step.icon className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm font-medium", step.completed && "line-through")}>
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{step.description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Events */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Recent Events</CardTitle>
                  <CardDescription>Latest authentication activity</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/monitoring/logs" className="gap-1">
                    View all
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {recentEvents.map((event, index) => (
                  <div key={index} className="flex items-start gap-3 px-6 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted mt-0.5">
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{event.user}</p>
                        {getEventBadge(event.type)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{event.connection}</span>
                        <span>-</span>
                        <span>{event.ip}</span>
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
        </div>

        {/* Applications Overview */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Applications</CardTitle>
                <CardDescription>Registered client applications</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/applications" className="gap-2">
                  <AppWindow className="h-4 w-4" />
                  Manage Applications
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {applications.map((app) => (
                <div
                  key={app.name}
                  className="flex flex-col gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <AppWindow className="h-5 w-5 text-foreground" />
                    </div>
                    <Badge
                      variant={app.status === "active" ? "outline" : "secondary"}
                      className={cn(
                        "text-xs",
                        app.status === "active" && "border-green-200 bg-green-50 text-green-700"
                      )}
                    >
                      {app.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{app.name}</p>
                    <p className="text-xs text-muted-foreground">{app.type}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <LogIn className="h-3 w-3" />
                    <span>{app.logins.toLocaleString("en-US")} logins today</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="group cursor-pointer transition-all hover:shadow-md">
            <Link href="https://docs.aetheridentity.dev" target="_blank">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <ExternalLink className="h-6 w-6 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Documentation</p>
                  <p className="text-sm text-muted-foreground">Explore guides and API reference</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </CardContent>
            </Link>
          </Card>

          <Card className="group cursor-pointer transition-all hover:shadow-md">
            <Link href="/dashboard/applications">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <Key className="h-6 w-6 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">API Keys</p>
                  <p className="text-sm text-muted-foreground">Manage your API credentials</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </CardContent>
            </Link>
          </Card>

          <Card className="group cursor-pointer transition-all hover:shadow-md">
            <Link href="/dashboard/settings">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <Cpu className="h-6 w-6 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Tenant Settings</p>
                  <p className="text-sm text-muted-foreground">Configure your environment</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
