"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Store,
  Search,
  Star,
  Download,
  Filter,
  ArrowRight,
  Package,
  Shield,
  Zap,
  Globe,
  Database,
  Lock,
  Mail,
  Users,
  Code2,
  Palette,
  HardDrive,
  CheckCircle2,
  TrendingUp,
  ExternalLink,
  Sparkles,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", name: "All", icon: Store },
  { id: "actions", name: "Actions", icon: Zap },
  { id: "connections", name: "Connections", icon: Database },
  { id: "templates", name: "Templates", icon: Package },
  { id: "security", name: "Security", icon: Shield },
  { id: "integrations", name: "Integrations", icon: Code2 },
];

const extensions = [
  {
    id: "1",
    name: "Custom Email Templates",
    description:
      "Fully customizable email templates for welcome, reset password, and MFA scenarios.",
    category: "templates",
    author: "Aether Team",
    rating: 4.8,
    downloads: 12450,
    icon: Mail,
    featured: true,
  },
  {
    id: "2",
    name: "SAML Enterprise Connector",
    description: "Connect your existing SAML identity providers for enterprise SSO.",
    category: "connections",
    author: "Aether Team",
    rating: 4.9,
    downloads: 8920,
    icon: Globe,
    featured: true,
  },
  {
    id: "3",
    name: "Webhook Dispatcher",
    description: "Send authentication events to external systems via webhooks.",
    category: "actions",
    author: "Community",
    rating: 4.5,
    downloads: 5430,
    icon: Zap,
    featured: false,
  },
  {
    id: "4",
    name: "TOTP MFA Provider",
    description: "Time-based one-time password authentication for enhanced security.",
    category: "security",
    author: "Aether Team",
    rating: 4.7,
    downloads: 9870,
    icon: Lock,
    featured: true,
  },
  {
    id: "5",
    name: "User Directory Sync",
    description: "Sync users from Active Directory or LDAP to your tenant.",
    category: "integrations",
    author: "Partner",
    rating: 4.3,
    downloads: 3210,
    icon: Users,
    featured: false,
  },
  {
    id: "6",
    name: "Password Policy Enforcer",
    description: "Enforce complex password policies with customizable rules.",
    category: "security",
    author: "Aether Team",
    rating: 4.6,
    downloads: 7650,
    icon: Shield,
    featured: false,
  },
  {
    id: "7",
    name: "Login Page Customizer",
    description: "Advanced branding options for your Universal Login page.",
    category: "templates",
    author: "Community",
    rating: 4.4,
    downloads: 4560,
    icon: Palette,
    featured: false,
  },
  {
    id: "8",
    name: "Redis Session Store",
    description: "Store sessions in Redis for distributed session management.",
    category: "integrations",
    author: "Partner",
    rating: 4.5,
    downloads: 2890,
    icon: HardDrive,
    featured: false,
  },
];

const installedExtensions = [
  { name: "Custom Email Templates", version: "2.1.0", status: "active" },
  { name: "TOTP MFA Provider", version: "1.5.2", status: "active" },
  { name: "Webhook Dispatcher", version: "3.0.1", status: "needs-update" },
];

const trendingExtensions = [
  { name: "Biometric Auth", downloads: 2340, trend: "+45%" },
  { name: "SMS Verification", downloads: 1890, trend: "+32%" },
  { name: "Session Manager", downloads: 1560, trend: "+28%" },
  { name: "Audit Logger Pro", downloads: 1230, trend: "+21%" },
];

function getCategoryIcon(category: string) {
  switch (category) {
    case "actions":
      return Zap;
    case "connections":
      return Database;
    case "templates":
      return Package;
    case "security":
      return Shield;
    case "integrations":
      return Code2;
    default:
      return Store;
  }
}

function getCategoryBadgeVariant(category: string) {
  switch (category) {
    case "actions":
      return "default";
    case "connections":
      return "outline";
    case "templates":
      return "secondary";
    case "security":
      return "destructive";
    case "integrations":
      return "outline";
    default:
      return "secondary";
  }
}

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredExtensions = extensions.filter((ext) => {
    const matchesSearch =
      ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ext.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || ext.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredExtensions = extensions.filter((ext) => ext.featured);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="px-6 py-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">Identity Marketplace</h1>
            <p className="text-muted-foreground">
              Discover extensions, integrations, and templates for your identity platform.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search extensions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="browse">
          <TabsList>
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="installed">Installed</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6 mt-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                  className="gap-2"
                >
                  <category.icon className="h-4 w-4" />
                  {category.name}
                </Button>
              ))}
            </div>

            {activeCategory === "all" && (
              <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-amber-500" />
                      <CardTitle className="text-base font-semibold">Featured Extensions</CardTitle>
                    </div>
                    <CardDescription>Hand-picked by the Aether team</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {featuredExtensions.map((ext) => (
                        <div
                          key={ext.id}
                          className="flex gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted shrink-0">
                            <ext.icon className="h-6 w-6 text-foreground" />
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium truncate">{ext.name}</p>
                              <Badge
                                variant={getCategoryBadgeVariant(ext.category)}
                                className="text-xs"
                              >
                                {ext.category}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {ext.description}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                <span>{ext.rating}</span>
                              </div>
                              <span>{ext.downloads.toLocaleString()} downloads</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <CardTitle className="text-base font-semibold">Trending</CardTitle>
                    </div>
                    <CardDescription>Most popular this week</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {trendingExtensions.map((ext, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{ext.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {ext.downloads.toLocaleString()} downloads
                          </p>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          {ext.trend}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">
                  {activeCategory === "all"
                    ? "All Extensions"
                    : categories.find((c) => c.id === activeCategory)?.name}
                </CardTitle>
                <CardDescription>
                  {filteredExtensions.length} extension{filteredExtensions.length !== 1 ? "s" : ""}{" "}
                  available
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredExtensions.map((ext) => (
                    <div
                      key={ext.id}
                      className="flex flex-col gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <ext.icon className="h-5 w-5 text-foreground" />
                        </div>
                        <Badge variant={getCategoryBadgeVariant(ext.category)} className="text-xs">
                          {ext.category}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{ext.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {ext.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{ext.author}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          <span>{ext.rating}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full gap-2 mt-auto">
                        <Download className="h-3.5 w-3.5" />
                        Install
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="installed" className="space-y-6 mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Installed Extensions</CardTitle>
                <CardDescription>Manage your installed extensions</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {installedExtensions.map((ext, index) => (
                    <div key={index} className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <Package className="h-5 w-5 text-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{ext.name}</p>
                          <p className="text-xs text-muted-foreground">Version {ext.version}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          className={cn(
                            "text-xs",
                            ext.status === "active"
                              ? "bg-green-100 text-green-700 hover:bg-green-100"
                              : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                          )}
                        >
                          {ext.status === "active" ? (
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                          ) : null}
                          {ext.status === "active" ? "Active" : "Update Available"}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          Configure
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              <Card className="group cursor-pointer transition-all hover:shadow-md">
                <Link href="https://docs.aetheridentity.dev/marketplace" target="_blank">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                      <ExternalLink className="h-6 w-6 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Documentation</p>
                      <p className="text-sm text-muted-foreground">
                        Learn how to create extensions
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </CardContent>
                </Link>
              </Card>

              <Card className="group cursor-pointer transition-all hover:shadow-md">
                <Link href="/dashboard/extensions">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                      <Code2 className="h-6 w-6 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Developer Tools</p>
                      <p className="text-sm text-muted-foreground">SDKs and CLI tools</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </CardContent>
                </Link>
              </Card>

              <Card className="group cursor-pointer transition-all hover:shadow-md">
                <Link href="/dashboard/settings">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                      <Store className="h-6 w-6 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Publish Extension</p>
                      <p className="text-sm text-muted-foreground">
                        Share your extension with others
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </CardContent>
                </Link>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="updates" className="space-y-6 mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Available Updates</CardTitle>
                <CardDescription>Extensions with new versions available</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Zap className="h-5 w-5 text-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Webhook Dispatcher</p>
                        <p className="text-xs text-muted-foreground">3.0.1 → 3.1.0</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 border-amber-200"
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        Security Update
                      </Badge>
                      <Button size="sm">Update Now</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Auto-Update Settings</CardTitle>
                <CardDescription>Configure automatic updates for extensions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Automatic Updates</p>
                      <p className="text-xs text-muted-foreground">
                        Automatically install minor updates
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enabled
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Security Updates</p>
                      <p className="text-xs text-muted-foreground">
                        Immediately install critical security patches
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enabled
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
