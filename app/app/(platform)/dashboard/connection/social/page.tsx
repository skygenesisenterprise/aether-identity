"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Network,
  Key,
  Shield,
  ArrowRight,
  Globe,
  LogIn,
  ArrowUpRight,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { connectionsApi } from "@/lib/api/client";
import type { SocialConnection } from "@/lib/api/types";

const features = [
  {
    icon: Globe,
    title: "Popular Providers",
    description:
      "Configure social connections like Facebook, Twitter, Github and others so that you can let your users login with them.",
    href: "/docs",
  },
  {
    icon: LogIn,
    title: "Google / Gmail",
    description: "Enable users to sign in with their Google account using google-oauth2.",
    href: "/docs",
  },
  {
    icon: Shield,
    title: "Enterprise Identity",
    description: "Integrate with enterprise identity providers for seamless authentication.",
    href: "/docs",
  },
  {
    icon: Network,
    title: "Multi-Provider",
    description:
      "Support multiple social providers simultaneously for flexible authentication options.",
    href: "/docs",
  },
];

const quickLinks = [
  {
    title: "Social Connections",
    description: "Complete guide to social login",
    href: "/docs/social",
  },
  {
    title: "Google OAuth2",
    description: "Configure Google authentication",
    href: "/docs/social/google",
  },
  {
    title: "Provider List",
    description: "All available social providers",
    href: "/docs/social/providers",
  },
];

export default function SocialPage() {
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [provider, setProvider] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const response = await connectionsApi.listSocial();
      if (response.success && response.data) {
        setConnections(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load connections");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      setCreating(true);
      await connectionsApi.createSocial({
        name: provider,
        provider,
        clientId,
        clientSecret,
      });
      setDialogOpen(false);
      setProvider("");
      setClientId("");
      setClientSecret("");
      fetchConnections();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create connection");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleConnection = async (conn: SocialConnection) => {
    try {
      if (conn.enabled) {
        await connectionsApi.disable(conn.id);
      } else {
        await connectionsApi.enable(conn.id);
      }
      fetchConnections();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update connection");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Network className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Identity Social Connections
                </h1>
                <p className="text-muted-foreground">
                  Configure social connections so that you can let your users login with them.
                </p>
              </div>
            </div>
            <Button onClick={() => setDialogOpen(true)}>
              <LogIn className="mr-2 h-4 w-4" />
              New Social Connection
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {connections.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your Connections</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {connections.map((conn) => (
                <Card key={conn.id} className="border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Globe className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{conn.name}</h3>
                          <p className="text-sm text-muted-foreground">{conn.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={conn.enabled ? "default" : "secondary"}>
                          {conn.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleConnection(conn)}
                        >
                          {conn.enabled ? "Disable" : "Enable"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Key className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-semibold">google-oauth2</h2>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    Recommended
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  Google / Gmail - Enable users to sign in with their Google account.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((feature) => (
              <Card key={feature.title} className="group hover:border-primary/30 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </div>
                  <CardTitle className="text-base mt-3">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Resources</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {quickLinks.map((link) => (
              <Link key={link.title} href={link.href} className="group block">
                <Card className="h-full hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      {link.title}
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
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

        <Separator />

        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/docs/social" target="_blank">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Documentation
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/connection/social/configure">
              Configure Social
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Social Connection</DialogTitle>
            <DialogDescription className="sr-only">
              Create a new social connection
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="provider">Identity Provider</Label>
              <Input
                id="provider"
                placeholder="e.g., google-oauth2, facebook"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter the identity provider name for the social connection.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="client-id">Client ID</Label>
              <Input
                id="client-id"
                placeholder="Enter the client ID from the provider"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client-secret">Client Secret</Label>
              <Input
                id="client-secret"
                type="password"
                placeholder="Enter the client secret from the provider"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!provider || !clientId || !clientSecret || creating}
            >
              {creating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
