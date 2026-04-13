"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Zap,
  Plus,
  Play,
  Pause,
  Trash2,
  Copy,
  Edit,
  ArrowRight,
  Clock,
  Users,
  LogIn,
  Shield,
  UserPlus,
  Mail,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

const actionTemplates = [
  {
    id: "post-login",
    name: "Post Login",
    description: "Execute custom logic after a user logs in",
    icon: LogIn,
    category: "Authentication",
    triggers: ["Login"],
    popularity: "popular",
  },
  {
    id: "pre-register",
    name: "Pre User Registration",
    description: "Validate or modify user data before signup",
    icon: UserPlus,
    category: "Authentication",
    triggers: ["Sign Up"],
    popularity: "popular",
  },
  {
    id: "add-claims",
    name: "Add Custom Claims",
    description: "Add custom claims to the ID and access tokens",
    icon: Plus,
    category: "Tokens",
    triggers: ["Login", "Token Exchange"],
    popularity: "popular",
  },
  {
    id: "mfa-enrollment",
    name: "MFA Enrollment",
    description: "Control when users enroll in MFA",
    icon: Shield,
    category: "Security",
    triggers: ["Login"],
    popularity: "common",
  },
  {
    id: "send-email",
    name: "Custom Email",
    description: "Send custom emails on authentication events",
    icon: Mail,
    category: "Notifications",
    triggers: ["Login", "Sign Up", "Password Change"],
    popularity: "common",
  },
  {
    id: "sync-user",
    name: "User Sync",
    description: "Sync user data to external systems",
    icon: Users,
    category: "Integration",
    triggers: ["Login", "Sign Up", "Profile Update"],
    popularity: "advanced",
  },
];

const deployedActions = [
  {
    id: "1",
    name: "Add Partner Claims",
    description: "Add partner-specific claims to tokens",
    status: "active",
    version: "1.2.0",
    lastModified: "2 hours ago",
    triggers: ["Login"],
    runs: 12450,
    errors: 0,
  },
  {
    id: "2",
    name: "Slack Notification",
    description: "Send login notifications to Slack",
    status: "active",
    version: "2.0.1",
    lastModified: "1 day ago",
    triggers: ["Login"],
    runs: 8432,
    errors: 2,
  },
  {
    id: "3",
    name: "Session Extension",
    description: "Extend session based on user tier",
    status: "active",
    version: "1.0.0",
    lastModified: "3 days ago",
    triggers: ["Login"],
    runs: 5200,
    errors: 0,
  },
  {
    id: "4",
    name: "Legacy Migration Hook",
    description: "Migrate users from legacy system",
    status: "disabled",
    version: "0.9.5",
    lastModified: "1 week ago",
    triggers: ["Sign Up"],
    runs: 156,
    errors: 12,
  },
  {
    id: "5",
    name: "Audit Logger",
    description: "Log all authentication events",
    status: "active",
    version: "3.1.0",
    lastModified: "5 hours ago",
    triggers: ["Login", "Sign Up", "Logout", "Password Change"],
    runs: 45200,
    errors: 0,
  },
];

const actionStats = [
  { label: "Total Actions", value: "12", change: "+3", trend: "up" },
  { label: "Active Actions", value: "8", change: "+1", trend: "up" },
  { label: "Total Executions", value: "71.4K", change: "+12.3%", trend: "up" },
  { label: "Error Rate", value: "0.02%", change: "-0.01%", trend: "down" },
];

export default function ActionsLibraryPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("deployed");

  const filteredTemplates = actionTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredActions = deployedActions.filter((action) => {
    const matchesSearch =
      action.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "active" && action.status === "active") ||
      (selectedCategory === "disabled" && action.status === "disabled");
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="px-6 py-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">Identity Actions Library</h1>
            <p className="text-muted-foreground">
              Create and manage custom authentication logic with Actions.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {actionStats.map((stat) => (
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
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {stat.trend === "up" ? (
                      <ChevronRight className="h-4 w-4 rotate-90" />
                    ) : (
                      <ChevronRight className="h-4 w-4 rotate-90" />
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
            <TabsTrigger value="deployed">Deployed Actions</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="logs">Execution Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="deployed" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search actions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Action
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {filteredActions.map((action) => (
                    <div
                      key={action.id}
                      className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Zap className="h-5 w-5 text-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{action.name}</p>
                          <Badge
                            variant={action.status === "active" ? "outline" : "secondary"}
                            className={cn(
                              "text-xs",
                              action.status === "active" &&
                                "border-green-200 bg-green-50 text-green-700"
                            )}
                          >
                            {action.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {action.description}
                        </p>
                      </div>
                      <div className="hidden flex-col items-end gap-1 md:flex">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{action.lastModified}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>v{action.version}</span>
                          <span>-</span>
                          <span>{action.runs.toLocaleString()} runs</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {action.status === "active" ? (
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pause className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Authentication">Authentication</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Tokens">Tokens</SelectItem>
                  <SelectItem value="Notifications">Notifications</SelectItem>
                  <SelectItem value="Integration">Integration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="group cursor-pointer transition-all hover:shadow-md"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                        <template.icon className="h-6 w-6 text-foreground" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <p className="font-medium">{template.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      {template.triggers.map((trigger) => (
                        <Badge key={trigger} variant="secondary" className="text-xs">
                          {trigger}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {template.popularity === "popular" && (
                          <>
                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                            <span>Popular</span>
                          </>
                        )}
                        {template.popularity === "common" && (
                          <>
                            <Users className="h-3 w-3 text-blue-600" />
                            <span>Common</span>
                          </>
                        )}
                        {template.popularity === "advanced" && (
                          <>
                            <AlertTriangle className="h-3 w-3 text-orange-600" />
                            <span>Advanced</span>
                          </>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 opacity-0 group-hover:opacity-100"
                      >
                        Create
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">Recent Executions</CardTitle>
                    <CardDescription>Latest action execution logs</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {deployedActions
                    .flatMap((action) =>
                      Array.from({ length: Math.min(2, action.runs / 5000) }).map((_, i) => ({
                        id: `${action.id}-${i}`,
                        actionName: action.name,
                        status: i === 0 && action.errors > 0 ? "error" : "success",
                        timestamp: `${i + 1 * 5} minutes ago`,
                        duration: `${Math.floor(Math.random() * 500) + 50}ms`,
                      }))
                    )
                    .map((log, index) => (
                      <div key={index} className="flex items-start gap-3 px-6 py-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted mt-0.5">
                          {log.status === "success" ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{log.actionName}</p>
                            <Badge
                              variant={log.status === "success" ? "outline" : "destructive"}
                              className="text-xs"
                            >
                              {log.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{log.timestamp}</span>
                            <span>-</span>
                            <span>{log.duration}</span>
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
            <p className="text-sm font-medium">Need help with Actions?</p>
            <p className="text-sm text-muted-foreground">
              Check our documentation for examples and guides.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="https://docs.aetheridentity.dev/actions" target="_blank">
              Action Documentation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
