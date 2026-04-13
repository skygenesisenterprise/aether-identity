"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Zap,
  Play,
  Pause,
  Plus,
  Trash2,
  Edit,
  ArrowRight,
  Clock,
  LogIn,
  UserPlus,
  LogOut,
  Key,
  Mail,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Search,
  Filter,
  Webhook,
  Timer,
  Fingerprint,
  CreditCard,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const triggerDefinitions = [
  {
    id: "login",
    name: "Login",
    description: "Executed when a user authenticates successfully",
    icon: LogIn,
    category: "Authentication",
    status: "enabled",
    actionsCount: 3,
    eventType: "post-login",
  },
  {
    id: "signup",
    name: "Sign Up",
    description: "Executed when a new user registers",
    icon: UserPlus,
    category: "Authentication",
    status: "enabled",
    actionsCount: 2,
    eventType: "pre-user-registration",
  },
  {
    id: "logout",
    name: "Logout",
    description: "Executed when a user logs out",
    icon: LogOut,
    category: "Authentication",
    status: "enabled",
    actionsCount: 1,
    eventType: "post-logout",
  },
  {
    id: "password-change",
    name: "Password Change",
    description: "Executed when a user changes their password",
    icon: Key,
    category: "Security",
    status: "enabled",
    actionsCount: 1,
    eventType: "post-change-password",
  },
  {
    id: "mfa-enroll",
    name: "MFA Enrollment",
    description: "Executed when a user enrolls in multi-factor authentication",
    icon: Fingerprint,
    category: "Security",
    status: "enabled",
    actionsCount: 1,
    eventType: "post-mfa-enrollment",
  },
  {
    id: "token-exchange",
    name: "Token Exchange",
    description: "Executed during OAuth token exchange",
    icon: RefreshCw,
    category: "Tokens",
    status: "disabled",
    actionsCount: 0,
    eventType: "token-exchange",
  },
  {
    id: "password-reset",
    name: "Password Reset",
    description: "Executed when a user requests a password reset",
    icon: CreditCard,
    category: "Security",
    status: "enabled",
    actionsCount: 2,
    eventType: "post-password-reset",
  },
  {
    id: "custom-email",
    name: "Custom Email",
    description: "Executed when sending custom emails",
    icon: Mail,
    category: "Notifications",
    status: "enabled",
    actionsCount: 1,
    eventType: "send-email",
  },
];

const triggerStats = [
  { label: "Total Triggers", value: "8", change: "0", trend: "neutral" },
  { label: "Enabled Triggers", value: "7", change: "0", trend: "neutral" },
  { label: "Total Executions", value: "156.2K", change: "+8.5%", trend: "up" },
  { label: "Error Rate", value: "0.03%", change: "-0.01%", trend: "down" },
];

const recentTriggerEvents = [
  {
    trigger: "Login",
    action: "Add Partner Claims",
    status: "success",
    timestamp: "2 seconds ago",
    duration: "45ms",
    user: "john.doe@example.com",
  },
  {
    trigger: "Sign Up",
    action: "User Sync",
    status: "success",
    timestamp: "15 seconds ago",
    duration: "120ms",
    user: "jane.smith@company.co",
  },
  {
    trigger: "Login",
    action: "Slack Notification",
    status: "success",
    timestamp: "32 seconds ago",
    duration: "89ms",
    user: "admin@etheriatimes.com",
  },
  {
    trigger: "Password Change",
    action: "Audit Logger",
    status: "error",
    timestamp: "1 minute ago",
    duration: "250ms",
    user: "secure@company.org",
  },
  {
    trigger: "MFA Enrollment",
    action: "MFA Enrollment Check",
    status: "success",
    timestamp: "2 minutes ago",
    duration: "65ms",
    user: "mfa.user@test.com",
  },
  {
    trigger: "Logout",
    action: "Session Cleanup",
    status: "success",
    timestamp: "3 minutes ago",
    duration: "32ms",
    user: "john.doe@example.com",
  },
  {
    trigger: "Login",
    action: "Session Extension",
    status: "success",
    timestamp: "5 minutes ago",
    duration: "28ms",
    user: "regular@user.com",
  },
  {
    trigger: "Sign Up",
    action: "Custom Welcome Email",
    status: "success",
    timestamp: "8 minutes ago",
    duration: "310ms",
    user: "new@member.org",
  },
];

const triggerActionMappings = [
  {
    trigger: "Login",
    actions: ["Add Partner Claims", "Slack Notification", "Session Extension"],
    enabled: true,
  },
  {
    trigger: "Sign Up",
    actions: ["User Sync", "Custom Welcome Email"],
    enabled: true,
  },
  {
    trigger: "Logout",
    actions: ["Session Cleanup"],
    enabled: true,
  },
  {
    trigger: "Password Change",
    actions: ["Audit Logger"],
    enabled: true,
  },
  {
    trigger: "Password Reset",
    actions: ["Password Reset Email", "Legacy Migration Hook"],
    enabled: true,
  },
  {
    trigger: "MFA Enrollment",
    actions: ["MFA Enrollment Check"],
    enabled: true,
  },
  {
    trigger: "Custom Email",
    actions: ["Custom Sending Service"],
    enabled: true,
  },
  {
    trigger: "Token Exchange",
    actions: [],
    enabled: false,
  },
];

function getCategoryColor(category: string) {
  switch (category) {
    case "Authentication":
      return "bg-blue-100 text-blue-700 hover:bg-blue-100";
    case "Security":
      return "bg-red-100 text-red-700 hover:bg-red-100";
    case "Tokens":
      return "bg-purple-100 text-purple-700 hover:bg-purple-100";
    case "Notifications":
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export default function TriggersPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("triggers");

  const filteredTriggers = triggerDefinitions.filter((trigger) => {
    const matchesSearch =
      trigger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trigger.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || trigger.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="px-6 py-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">Triggers</h1>
            <p className="text-muted-foreground">
              Configure event triggers that launch your Actions.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {triggerStats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Zap className="h-6 w-6 text-foreground" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <div
                    className={cn(
                      "flex items-center gap-1",
                      stat.trend === "up"
                        ? "text-green-600"
                        : stat.trend === "down"
                          ? "text-red-600"
                          : "text-muted-foreground"
                    )}
                  >
                    {stat.trend !== "neutral" && (
                      <ChevronRight
                        className={cn("h-4 w-4", stat.trend === "down" && "rotate-90")}
                      />
                    )}
                    <span className="font-medium">{stat.change}</span>
                  </div>
                  <span className="text-muted-foreground">from last week</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="triggers">Available Triggers</TabsTrigger>
            <TabsTrigger value="mappings">Action Mappings</TabsTrigger>
            <TabsTrigger value="logs">Execution Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="triggers" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search triggers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Authentication">Authentication</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Tokens">Tokens</SelectItem>
                  <SelectItem value="Notifications">Notifications</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {filteredTriggers.map((trigger) => (
                    <div
                      key={trigger.id}
                      className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <trigger.icon className="h-5 w-5 text-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{trigger.name}</p>
                          <Badge
                            className={cn(
                              "text-xs",
                              trigger.status === "enabled"
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {trigger.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {trigger.description}
                        </p>
                      </div>
                      <Badge className={cn("text-xs", getCategoryColor(trigger.category))}>
                        {trigger.category}
                      </Badge>
                      <div className="hidden flex-col items-end gap-1 md:flex">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Webhook className="h-3 w-3" />
                          <span>{trigger.eventType}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{trigger.actionsCount} actions</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          {trigger.status === "enabled" ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mappings" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Map triggers to Actions that should execute on each event.
                </p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Mapping
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {triggerActionMappings.map((mapping) => (
                <Card key={mapping.trigger}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                          <Zap className="h-4 w-4 text-foreground" />
                        </div>
                        <CardTitle className="text-base font-semibold">{mapping.trigger}</CardTitle>
                      </div>
                      <Switch checked={mapping.enabled} />
                    </div>
                    <CardDescription>{mapping.actions.length} action(s) configured</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {mapping.actions.length > 0 ? (
                      <div className="space-y-2">
                        {mapping.actions.map((action) => (
                          <div
                            key={action}
                            className="flex items-center justify-between rounded-md border p-3"
                          >
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-green-500" />
                              <span className="text-sm">{action}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <AlertTriangle className="h-4 w-4" />
                        <span>No actions configured</span>
                      </div>
                    )}
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      <Plus className="mr-2 h-3 w-3" />
                      Add Action
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">Recent Trigger Events</CardTitle>
                    <CardDescription>Latest trigger execution logs</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {recentTriggerEvents.map((event, index) => (
                    <div key={index} className="flex items-start gap-3 px-6 py-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted mt-0.5">
                        {event.status === "success" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{event.trigger}</p>
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          <p className="text-sm font-medium">{event.action}</p>
                          <Badge
                            variant={event.status === "success" ? "outline" : "destructive"}
                            className="text-xs"
                          >
                            {event.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{event.user}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{event.timestamp}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Timer className="h-3 w-3" />
                          <span>{event.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Need help with Triggers?</p>
            <p className="text-sm text-muted-foreground">
              Learn how triggers work and how to configure them.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="https://docs.aetheridentity.dev/actions/triggers" target="_blank">
              Trigger Documentation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
