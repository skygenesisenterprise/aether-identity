"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, AppWindow, Key, ArrowUpRight, Activity } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { StatsCard } from "@/components/admin/stats-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const dailyActiveUsersData = [
  { date: "Mar 26", users: 0 },
  { date: "Mar 27", users: 1 },
  { date: "Mar 28", users: 0 },
  { date: "Mar 29", users: 2 },
  { date: "Mar 30", users: 1 },
  { date: "Mar 31", users: 0 },
  { date: "Apr 1", users: 1 },
  { date: "Apr 2", users: 0 },
  { date: "Apr 3", users: 2 },
  { date: "Apr 4", users: 1 },
  { date: "Apr 5", users: 2 },
  { date: "Apr 6", users: 1 },
  { date: "Apr 7", users: 3 },
  { date: "Apr 8", users: 2 },
  { date: "Apr 9", users: 1 },
  { date: "Apr 10", users: 0 },
];

const retentionData = [
  { date: "Mar 29", retention: 0 },
  { date: "Apr 4", retention: 25 },
  { date: "Apr 10", retention: 50 },
];

const signupsData = [
  { date: "Mar 29", signups: 1 },
  { date: "Apr 1", signups: 2 },
  { date: "Apr 4", signups: 1 },
  { date: "Apr 7", signups: 3 },
  { date: "Apr 10", signups: 2 },
];

const failedLoginsData = [
  { date: "Mar 26", failed: 0 },
  { date: "Mar 27", failed: 1 },
  { date: "Mar 28", failed: 0 },
  { date: "Mar 29", failed: 2 },
  { date: "Mar 30", failed: 1 },
  { date: "Mar 31", failed: 0 },
  { date: "Apr 1", failed: 1 },
  { date: "Apr 2", failed: 0 },
  { date: "Apr 3", failed: 2 },
  { date: "Apr 4", failed: 1 },
  { date: "Apr 5", failed: 0 },
  { date: "Apr 6", failed: 1 },
  { date: "Apr 7", failed: 2 },
  { date: "Apr 8", failed: 0 },
  { date: "Apr 9", failed: 1 },
  { date: "Apr 10", failed: 0 },
];

const usersChartConfig = {
  users: { label: "Users", color: "oklch(0.55 0.15 250)" },
};

const retentionChartConfig = {
  retention: { label: "Retention", color: "oklch(0.65 0.15 145)" },
};

const signupsChartConfig = {
  signups: { label: "Signups", color: "oklch(0.65 0.15 145)" },
};

const failedChartConfig = {
  failed: { label: "Failed", color: "oklch(0.65 0.2 25)" },
};

export default function ActivityPage() {
  const [timeRange, setTimeRange] = useState("30d");

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Activity</h1>
          <p className="text-sm text-muted-foreground">Monitor events, logs and system activity</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <Activity className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value="0"
          change="0%"
          changeType="neutral"
          description="vs last period"
          icon={Users}
        />
        <StatsCard
          title="Applications"
          value="2"
          change="+0"
          changeType="neutral"
          description="vs last period"
          icon={AppWindow}
        />
        <StatsCard
          title="APIs"
          value="0"
          change="0%"
          changeType="neutral"
          description="vs last period"
          icon={Key}
        />
        <StatsCard
          title="Connections"
          value="0"
          change="0%"
          changeType="neutral"
          description="vs last period"
          icon={Activity}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Daily Active Users</CardTitle>
                <CardDescription>Unique users who logged in per day</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={usersChartConfig} className="h-50 w-full">
              <AreaChart
                data={dailyActiveUsersData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-users)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-users)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  allowDecimals={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="var(--color-users)"
                  strokeWidth={2}
                  fill="url(#fillUsers)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">User Retention</CardTitle>
                <CardDescription>Percentage of returning users</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={retentionChartConfig} className="h-50 w-full">
              <AreaChart data={retentionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillRetention" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-retention)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-retention)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="retention"
                  stroke="var(--color-retention)"
                  strokeWidth={2}
                  fill="url(#fillRetention)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Signups</CardTitle>
                <CardDescription>New user registrations</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/monitoring/logs" className="gap-1">
                  View logs
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={signupsChartConfig} className="h-37.5 w-full">
              <BarChart data={signupsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  allowDecimals={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="signups" fill="var(--color-signups)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Failed Logins</CardTitle>
                <CardDescription>Unsuccessful authentication attempts</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/monitoring/logs" className="gap-1">
                  View logs
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={failedChartConfig} className="h-37.5 w-full">
              <AreaChart
                data={failedLoginsData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="fillFailed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-failed)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-failed)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  allowDecimals={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="failed"
                  stroke="var(--color-failed)"
                  strokeWidth={2}
                  fill="url(#fillFailed)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
