"use client";

import Link from "next/link";
import {
  Key,
  Shield,
  Globe,
  Lock,
  ExternalLink,
  CheckCircle2,
  LogIn,
  Users,
  ArrowUpRight,
  Settings,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const ssoIntegrations = [
  {
    id: "sso_1",
    name: "Office 365",
    type: "SAML",
    status: "active",
    users: 456,
    lastSync: "2 min ago",
  },
  {
    id: "sso_2",
    name: "Salesforce",
    type: "OIDC",
    status: "active",
    users: 234,
    lastSync: "5 min ago",
  },
  {
    id: "sso_3",
    name: "Google Workspace",
    type: "SAML",
    status: "active",
    users: 892,
    lastSync: "1 min ago",
  },
  {
    id: "sso_4",
    name: "Slack",
    type: "OIDC",
    status: "inactive",
    users: 0,
    lastSync: "Never",
  },
];

const features = [
  {
    icon: Globe,
    title: "SaaS Applications",
    description: "Enable single sign-on for purchased applications and SaaS services.",
    enabled: true,
  },
  {
    icon: Lock,
    title: "Centralized Authentication",
    description: "SSO enables users to authenticate with one set of credentials.",
    enabled: true,
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Maintain security and compliance while simplifying user access.",
    enabled: true,
  },
  {
    icon: Key,
    title: "Identity Providers",
    description: "Integrate with popular identity providers like Okta, Azure AD.",
    enabled: false,
  },
];

const quickLinks = [
  {
    title: "SSO Documentation",
    description: "Complete guide to setting up single sign-on",
    href: "/docs/sso",
  },
  {
    title: "SAML Configuration",
    description: "Configure SAML-based SSO for your applications",
    href: "/docs/sso/saml",
  },
  {
    title: "OIDC Setup",
    description: "Set up OpenID Connect integration",
    href: "/docs/sso/oidc",
  },
];

export default function ExternalAppsPage() {
  const activeIntegrations = ssoIntegrations.filter((i) => i.status === "active").length;
  const totalUsers = ssoIntegrations.reduce((acc, i) => acc + i.users, 0);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="px-6 py-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">SSO Integrations</h1>
            <p className="text-muted-foreground">
              Enable single sign-on for your SaaS applications and external services.
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
                  <p className="text-sm font-medium text-muted-foreground">Total Integrations</p>
                  <p className="text-3xl font-bold tracking-tight">{ssoIntegrations.length}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Globe className="h-6 w-6 text-foreground" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Configured SSO apps</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Active Connections</p>
                  <p className="text-3xl font-bold tracking-tight">{activeIntegrations}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <CheckCircle2 className="h-6 w-6 text-foreground" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">
                  {Math.round((activeIntegrations / ssoIntegrations.length) * 100)}% of total
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">SSO Users</p>
                  <p className="text-3xl font-bold tracking-tight">{totalUsers.toLocaleString()}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Users className="h-6 w-6 text-foreground" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1 text-green-600">
                  <LogIn className="h-4 w-4" />
                  <span className="font-medium">+12.5%</span>
                </div>
                <span className="text-muted-foreground">this month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Active Integrations</CardTitle>
                <CardDescription>Your configured SSO connections</CardDescription>
              </div>
              <Button asChild>
                <Link href="/dashboard/applications/externalapps/configure">
                  <Key className="h-4 w-4 mr-2" />
                  Add Integration
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {ssoIntegrations.map((integration) => (
                <div
                  key={integration.id}
                  className="group flex flex-col gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Globe className="h-5 w-5 text-foreground" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={integration.status === "active" ? "outline" : "secondary"}
                        className={cn(
                          "text-xs",
                          integration.status === "active" &&
                            "border-green-200 bg-green-50 text-green-700"
                        )}
                      >
                        {integration.status}
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
                            <Link href={`/dashboard/applications/externalapps/${integration.id}`}>
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/applications/externalapps/${integration.id}/settings`}
                            >
                              Settings
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{integration.name}</p>
                    <p className="text-xs text-muted-foreground">{integration.type}</p>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{integration.users} users</span>
                    </div>
                    <span>Synced {integration.lastSync}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">SSO Features</CardTitle>
                  <CardDescription>Available single sign-on capabilities</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="flex items-start gap-4 px-6 py-4 transition-colors hover:bg-muted/50"
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        feature.enabled ? "bg-green-100" : "bg-muted"
                      )}
                    >
                      {feature.enabled ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <feature.icon className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{feature.title}</p>
                        {feature.enabled && (
                          <Badge variant="outline" className="text-xs font-normal">
                            Enabled
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Resources</CardTitle>
                  <CardDescription>Documentation and guides</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {quickLinks.map((link) => (
                  <Link
                    key={link.title}
                    href={link.href}
                    className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{link.title}</p>
                      <p className="text-xs text-muted-foreground">{link.description}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-1">Single Sign-On</h2>
                <p className="text-muted-foreground">
                  SSO enables users to authenticate with one set of credentials to access any number
                  of service provider applications.
                </p>
                <div className="mt-4 flex gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/docs/sso">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Documentation
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/dashboard/applications/externalapps/configure">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure SSO
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
