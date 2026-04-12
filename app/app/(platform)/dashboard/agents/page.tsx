"use client";

import Link from "next/link";
import {
  Bot,
  Shield,
  FileText,
  ArrowRight,
  Users,
  Sparkles,
  ExternalLink,
  Key,
  Cpu,
  CheckCircle2,
  AlertCircle,
  LogIn,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const agentStats = [
  { label: "Active Agents", value: "24", change: "+3", trend: "up", icon: Bot },
  { label: "Total Requests", value: "8,432", change: "+18%", trend: "up", icon: Users },
  { label: "Auth Success Rate", value: "99.7%", change: "+0.2%", trend: "up", icon: Shield },
  {
    label: "Failed Authentications",
    value: "12",
    change: "-23%",
    trend: "down",
    icon: AlertCircle,
  },
];

const features = [
  {
    icon: Users,
    title: "User Auth",
    description:
      "Easily implement secure login experiences for AI agents – from interactive chatbots to background workers.",
    href: "/docs",
    status: "available",
  },
  {
    icon: Shield,
    title: "Calling APIs",
    description:
      "Use secure standards to retrieve and store API tokens for Google, Github and more in just a few lines of code.",
    href: "/docs",
    status: "available",
  },
  {
    icon: FileText,
    title: "Async Auth",
    description:
      "Let your autonomous, async agents do work in the background with secure authorization flows.",
    href: "/docs",
    status: "available",
  },
  {
    icon: Shield,
    title: "FGA for RAG",
    description:
      "Only retrieve documents users have access to. Avoid leaking sensitive data in your AI responses.",
    href: "/docs",
    status: "coming_soon",
  },
];

const quickLinks = [
  {
    title: "Quickstarts",
    description: "Getting started guides to integrate AI Agents in minutes",
    href: "/docs/quickstarts",
    icon: Sparkles,
  },
  {
    title: "SDKs",
    description: "Libraries for popular frameworks and languages",
    href: "/docs/sdks",
    icon: Key,
  },
  {
    title: "Sample Apps",
    description: "Bootstrapped example projects to learn from",
    href: "/docs/samples",
    icon: Cpu,
  },
];

const recentAgentActivity = [
  {
    agent: "customer-support-bot",
    action: "User authentication completed",
    user: "john.doe@example.com",
    status: "success",
    time: "2 minutes ago",
  },
  {
    agent: "data-sync-worker",
    action: "API token refreshed",
    user: "system",
    status: "success",
    time: "5 minutes ago",
  },
  {
    agent: "notification-agent",
    action: "Auth challenge failed - retrying",
    user: "unknown",
    status: "warning",
    time: "12 minutes ago",
  },
  {
    agent: "analysis-bot",
    action: "Fine-grained access check passed",
    user: "jane.smith@company.co",
    status: "success",
    time: "18 minutes ago",
  },
];

const configuredAgents = [
  { name: "Customer Support Bot", type: "Interactive", status: "active", requests: 342 },
  { name: "Data Sync Worker", type: "Background", status: "active", requests: 1250 },
  { name: "Notification Agent", type: "Event-driven", status: "inactive", requests: 0 },
  { name: "Analysis Bot", type: "Scheduled", status: "active", requests: 89 },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "success":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs font-normal">
          Success
        </Badge>
      );
    case "warning":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 text-xs font-normal">
          Warning
        </Badge>
      );
    case "active":
      return (
        <Badge
          variant="outline"
          className="text-xs font-normal border-green-200 bg-green-50 text-green-700"
        >
          Active
        </Badge>
      );
    case "inactive":
      return (
        <Badge variant="secondary" className="text-xs font-normal">
          Inactive
        </Badge>
      );
    case "available":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs font-normal">
          Available
        </Badge>
      );
    case "coming_soon":
      return (
        <Badge variant="secondary" className="text-xs font-normal">
          Coming Soon
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="text-xs font-normal">
          {status}
        </Badge>
      );
  }
}

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="px-6 py-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              NEW
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">AI Agents</h1>
            <p className="text-muted-foreground">
              Secure your AI Agents with robust user authentication, secure API access on behalf of
              users, and fine-grained authorization.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {agentStats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <stat.icon className="h-6 w-6 text-foreground" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <div
                    className={cn(
                      "flex items-center gap-1",
                      stat.trend === "up" ? "text-green-600" : "text-green-600"
                    )}
                  >
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-medium">{stat.change}</span>
                  </div>
                  <span className="text-muted-foreground">from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-1">Secure your AI Agents</h2>
                <p className="text-muted-foreground">
                  Enable AI Agents to securely access tools, workflows, and data with fine-grained
                  control and just a few lines of code.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-semibold">Use Cases</CardTitle>
              </div>
              <CardDescription>Capabilities for your AI agents</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{feature.title}</p>
                        {getStatusBadge(feature.status)}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {feature.description}
                      </p>
                    </div>
                    <Link href={feature.href}>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Recent Agent Activity</CardTitle>
                  <CardDescription>Latest authentication events</CardDescription>
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
                {recentAgentActivity.map((event, index) => (
                  <div key={index} className="flex items-start gap-3 px-6 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted mt-0.5">
                      {event.status === "success" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{event.agent}</p>
                        {getStatusBadge(event.status)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{event.action}</span>
                        <span>-</span>
                        <span>{event.user}</span>
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

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Configured Agents</CardTitle>
                <CardDescription>Registered AI agents</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/agents/configure" className="gap-2">
                  <Bot className="h-4 w-4" />
                  Manage Agents
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {configuredAgents.map((agent) => (
                <div
                  key={agent.name}
                  className="flex flex-col gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Bot className="h-5 w-5 text-foreground" />
                    </div>
                    {getStatusBadge(agent.status)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.type}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <LogIn className="h-3 w-3" />
                    <span>{agent.requests.toLocaleString()} requests</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-xl font-semibold mb-4">Ready to dive deeper?</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {quickLinks.map((link) => (
              <Link key={link.title} href={link.href} className="group block">
                <Card className="h-full hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      {link.title}
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">{link.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="group cursor-pointer transition-all hover:shadow-md">
            <Link href="/docs/agents">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <ExternalLink className="h-6 w-6 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Documentation</p>
                  <p className="text-sm text-muted-foreground">
                    Explore agent authentication guides
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </CardContent>
            </Link>
          </Card>

          <Card className="group cursor-pointer transition-all hover:shadow-md">
            <Link href="/dashboard/agents/configure">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <Bot className="h-6 w-6 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Configure Agents</p>
                  <p className="text-sm text-muted-foreground">
                    Set up your AI agent configurations
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </CardContent>
            </Link>
          </Card>

          <Card className="group cursor-pointer transition-all hover:shadow-md">
            <Link href="/dashboard/security/mfa">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <Shield className="h-6 w-6 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Security Settings</p>
                  <p className="text-sm text-muted-foreground">Configure agent security policies</p>
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
