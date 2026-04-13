"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Puzzle,
  Package,
  Settings,
  Plus,
  Download,
  Trash2,
  RefreshCw,
  ExternalLink,
  Search,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const installedExtensions = [
  {
    id: 1,
    name: "Auth0 Sentinel",
    description: "Advanced threat detection and bot protection",
    version: "2.4.1",
    status: "active",
    lastUpdated: "2 days ago",
    author: "Aether Security",
  },
  {
    id: 2,
    name: "Custom Social Connections",
    description: "Extend social login with custom providers",
    version: "1.8.0",
    status: "active",
    lastUpdated: "1 week ago",
    author: "Aether Labs",
  },
  {
    id: 3,
    name: "Webhook Dispatcher",
    description: "Send authentication events to external systems",
    version: "3.1.2",
    status: "active",
    lastUpdated: "3 days ago",
    author: "Aether Integration",
  },
  {
    id: 4,
    name: "MFA Backup Codes",
    description: "Generate backup codes for account recovery",
    version: "1.2.0",
    status: "inactive",
    lastUpdated: "2 weeks ago",
    author: "Aether Security",
  },
  {
    id: 5,
    name: "Session Manager Pro",
    description: "Advanced session management and analytics",
    version: "2.0.0",
    status: "active",
    lastUpdated: "5 hours ago",
    author: "Aether Enterprise",
  },
];

const availableExtensions = [
  {
    id: 1,
    name: "Passwordless Email Magic Link",
    description: "Authenticate users via email magic links",
    category: "Authentication",
    downloads: 12450,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Active Directory Connector",
    description: "Sync users from Microsoft Active Directory",
    category: "Directory",
    downloads: 8920,
    rating: 4.6,
  },
  {
    id: 3,
    name: "SAML Enterprise SSO",
    description: "Add SAML 2.0 support for enterprise SSO",
    category: "Enterprise",
    downloads: 15230,
    rating: 4.9,
  },
  {
    id: 4,
    name: "Biometric Authentication",
    description: "Enable WebAuthn and biometric login",
    category: "Security",
    downloads: 6780,
    rating: 4.7,
  },
  {
    id: 5,
    name: "LDAP Directory Sync",
    description: "Synchronize users from LDAP directories",
    category: "Directory",
    downloads: 5430,
    rating: 4.4,
  },
  {
    id: 6,
    name: "OIDC Provider",
    description: "Act as an OIDC identity provider",
    category: "Enterprise",
    downloads: 9870,
    rating: 4.5,
  },
];

const extensionMetrics = [
  { name: "Active Extensions", value: 4, change: "+2 this month" },
  { name: "Total Requests", value: "128.4K", change: "+15.2%" },
  { name: "Avg Response Time", value: "23ms", change: "-5ms" },
  { name: "Error Rate", value: "0.12%", change: "-0.03%" },
];

function getStatusBadge(status: string) {
  return status === "active" ? (
    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs font-normal">
      Active
    </Badge>
  ) : (
    <Badge variant="secondary" className="text-xs font-normal">
      Inactive
    </Badge>
  );
}

export default function ExtensionPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("installed");

  const filteredExtensions = installedExtensions.filter((ext) => {
    const matchesSearch =
      ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ext.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || ext.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="px-6 py-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight"> Identity Extensions</h1>
            <p className="text-muted-foreground">
              Extend your identity platform with integrations and plugins.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {extensionMetrics.map((metric) => (
            <Card key={metric.name}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{metric.name}</p>
                    <p className="text-2xl font-bold tracking-tight">{metric.value}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Package className="h-5 w-5 text-foreground" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">{metric.change}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Extension Marketplace</CardTitle>
                <CardDescription>Browse and install extensions</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link
                  href="/marketplace"
                  target="_blank"
                  className="gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Browse Marketplace
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableExtensions.map((ext) => (
                <div
                  key={ext.id}
                  className="flex flex-col gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Puzzle className="h-5 w-5 text-foreground" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {ext.category}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{ext.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{ext.description}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      <span>{ext.downloads.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-600">★</span>
                      <span>{ext.rating}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="mt-auto">
                    <Plus className="h-4 w-4 mr-1" />
                    Install
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search extensions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Upload Extension
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Installed Extensions</CardTitle>
                <CardDescription>Manage your installed extensions</CardDescription>
              </div>
              <Badge variant="outline">
                {installedExtensions.filter((e) => e.status === "active").length} active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredExtensions.map((extension) => (
                <div
                  key={extension.id}
                  className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Puzzle className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{extension.name}</p>
                      <Badge variant="outline" className="text-xs">
                        v{extension.version}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {extension.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      by {extension.author} • Updated {extension.lastUpdated}
                    </p>
                  </div>
                  {getStatusBadge(extension.status)}
                  <div className="flex items-center gap-2">
                    {extension.status === "active" ? (
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="icon">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {filteredExtensions.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Package className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="mt-4 text-sm font-medium">No extensions found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
