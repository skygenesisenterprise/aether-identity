"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  AppWindow,
  Plus,
  MoreHorizontal,
  ArrowUpRight,
  Copy,
  Smartphone,
  Globe,
  Cpu,
  Check,
  TrendingUp,
  LogIn,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { applicationsApi } from "@/lib/api";
import type { ApplicationType } from "@/lib/api/types";

const applicationTypes = [
  {
    id: "native",
    name: "Native",
    description: "Mobile, desktop, CLI and smart device apps running natively.",
    example: "e.g.: iOS, Electron, Apple TV apps",
    icon: Smartphone,
  },
  {
    id: "spa",
    name: "Single Page Web Application",
    description: "A JavaScript front-end app that uses an API.",
    example: "e.g.: Angular, React, Vue",
    icon: Globe,
  },
  {
    id: "regular",
    name: "Regular Web Application",
    description: "Traditional web app using redirects.",
    example: "e.g.: Node.js Express, ASP.NET, Java, PHP",
    icon: Globe,
  },
  {
    id: "m2m",
    name: "Machine to Machine Application",
    description: "CLIs, daemons or services running on your backend.",
    example: "e.g.: Shell script",
    icon: Cpu,
  },
];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [appName, setAppName] = useState("");
  const [appDescription, setAppDescription] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await applicationsApi.list();
      if (response.success && response.data) {
        setApplications(response.data);
      } else {
        setError(response.error || "Failed to load applications");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!appName || !selectedType) return;
    try {
      await applicationsApi.create({
        name: appName,
        description: appDescription,
        type: selectedType,
      });
      setDialogOpen(false);
      setAppName("");
      setAppDescription("");
      setSelectedType(null);
      loadApplications();
    } catch (err) {
      console.error("Failed to create application:", err);
    }
  };

  const activeApps = applications.filter((app) => app.status === "active").length;
  const totalLogins = applications.reduce((acc, app) => acc + app.logins, 0);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="px-6 py-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">Identity Applications</h1>
            <p className="text-muted-foreground">
              Manage your client applications and API credentials.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                  <p className="text-3xl font-bold tracking-tight">{applications.length}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <AppWindow className="h-6 w-6 text-foreground" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">+2</span>
                </div>
                <span className="text-muted-foreground">this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Active Applications</p>
                  <p className="text-3xl font-bold tracking-tight">{activeApps}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <LogIn className="h-6 w-6 text-foreground" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">
                  {applications.length > 0
                    ? Math.round((activeApps / applications.length) * 100)
                    : 0}
                  % of total
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Logins Today</p>
                  <p className="text-3xl font-bold tracking-tight">
                    {totalLogins.toLocaleString()}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <TrendingUp className="h-6 w-6 text-foreground" />
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
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Registered Applications</CardTitle>
                <CardDescription>Your client applications and their credentials</CardDescription>
              </div>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Application
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="flex items-center justify-center p-8 text-red-500">{error}</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="group flex flex-col gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <AppWindow className="h-5 w-5 text-foreground" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={app.status === "active" ? "outline" : "secondary"}
                          className={cn(
                            "text-xs",
                            app.status === "active" && "border-green-200 bg-green-50 text-green-700"
                          )}
                        >
                          {app.status}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/applications/${app.id}`}>View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/applications/${app.id}/settings`}>
                                Settings
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{app.name}</p>
                      <p className="text-xs text-muted-foreground">{app.type}</p>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span className="text-muted-foreground">Client ID:</span>
                        <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
                          {app.clientId.slice(0, 8)}...
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(app.clientId);
                          }}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <LogIn className="h-3 w-3" />
                      <span>{app.logins.toLocaleString()} logins today</span>
                    </div>
                    {app.isDefault && (
                      <Badge variant="secondary" className="w-fit text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="group cursor-pointer transition-all hover:shadow-md">
          <Link href="/docs/applications">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <ArrowUpRight className="h-6 w-6 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Documentation</p>
                <p className="text-sm text-muted-foreground">
                  Learn how to configure applications for different platform types
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </CardContent>
          </Link>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create application</DialogTitle>
            <DialogDescription className="sr-only">Create a new application</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="app-name">Name</Label>
              <Input
                id="app-name"
                placeholder="My App"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                You can change the application name later in the application settings.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="app-description">Description (optional)</Label>
              <Textarea
                id="app-description"
                placeholder="Enter a description for your application"
                value={appDescription}
                onChange={(e) => setAppDescription(e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Choose an application type</Label>
              <div className="grid gap-2">
                {applicationTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-colors ${
                      selectedType === type.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        selectedType === type.id ? "bg-primary/10" : "bg-muted"
                      }`}
                    >
                      <type.icon
                        className={`h-4 w-4 ${
                          selectedType === type.id ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{type.name}</p>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{type.example}</p>
                    </div>
                    {selectedType === type.id && (
                      <Check className="h-4 w-4 text-primary shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!appName || !selectedType}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
