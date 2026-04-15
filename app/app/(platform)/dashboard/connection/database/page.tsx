"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Database,
  Key,
  Shield,
  ArrowRight,
  Lock,
  UserCheck,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { connectionsApi } from "@/lib/api/client";
import type { DatabaseConnection, DatabaseConnectionResponse } from "@/lib/api/types";

const features = [
  {
    icon: UserCheck,
    title: "Username-Password-Authentication",
    description:
      "Securely store and manage your customer's authorization credentials in an Identity Database or in your own store.",
    href: "/docs",
  },
  {
    icon: Lock,
    title: "Passkey Authorization",
    description:
      "Enable passwordless authentication with passkeys for a more secure and convenient user experience.",
    href: "/docs",
  },
  {
    icon: Shield,
    title: "Traditional Methods",
    description:
      "Use more traditional methods such as username/password with robust security measures.",
    href: "/docs",
  },
  {
    icon: Database,
    title: "Custom Database",
    description:
      "Connect to your own database to manage user credentials while leveraging Auth0 for authentication.",
    href: "/docs",
  },
];

const quickLinks = [
  {
    title: "Database Connections",
    description: "Complete guide to database authentication",
    href: "/docs/database",
  },
  {
    title: "Custom Databases",
    description: "Connect your own user store",
    href: "/docs/database/custom",
  },
  {
    title: "Passwordless",
    description: "Set up passwordless authentication",
    href: "/docs/passwordless",
  },
];

const userIdentifiers = [
  { id: "email", label: "Email Address", allowNonUnique: true },
  { id: "phone", label: "Phone Number" },
  { id: "username", label: "Username" },
];

const authMethods = [
  { id: "password", label: "Password" },
  { id: "passkey", label: "Passkey" },
  { id: "custom", label: "Use my own database" },
];

export default function DatabasePage() {
  const [connections, setConnections] = useState<DatabaseConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [connectionName, setConnectionName] = useState("");
  const [identifiers, setIdentifiers] = useState<string[]>(["email"]);
  const [authMethodsEnabled, setAuthMethodsEnabled] = useState<string[]>(["password"]);
  const [allowNonUniqueEmail, setAllowNonUniqueEmail] = useState(false);
  const [disableSignUps, setDisableSignUps] = useState(false);
  const [promoteToDomain, setPromoteToDomain] = useState(false);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const response = await connectionsApi.listDatabase();
      if (response.success && response.data) {
        setConnections(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load connections");
    } finally {
      setLoading(false);
    }
  };

  const handleIdentifierToggle = (id: string) => {
    setIdentifiers((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleAuthMethodToggle = (id: string) => {
    setAuthMethodsEnabled((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    try {
      setCreating(true);
      await connectionsApi.createDatabase({
        name: connectionName,
        identifiers,
        authMethods: authMethodsEnabled,
        allowNonUniqueEmail,
        disableSignUps,
        promoteToDomain,
      });
      setDialogOpen(false);
      setConnectionName("");
      setIdentifiers(["email"]);
      setAuthMethodsEnabled(["password"]);
      setAllowNonUniqueEmail(false);
      setDisableSignUps(false);
      setPromoteToDomain(false);
      fetchConnections();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create connection");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleConnection = async (conn: DatabaseConnection) => {
    try {
      if (conn.enabled) {
        await connectionsApi.updateDatabase(conn.id, { disableSignUps: true });
      } else {
        await connectionsApi.updateDatabase(conn.id, { disableSignUps: false });
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
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Identity Database Connections
                </h1>
                <p className="text-muted-foreground">
                  Securely store and manage your customer&apos;s authorization credentials.
                </p>
              </div>
            </div>
            <Button onClick={() => setDialogOpen(true)}>
              <LogIn className="mr-2 h-4 w-4" />
              New Database Connection
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
                          <Database className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{conn.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {conn.options?.identifiers?.join(", ") || "Username-Password"}
                          </p>
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
                  <h2 className="text-lg font-semibold">Username-Password-Authentication</h2>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    Recommended
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  Securely store and manage your customer&apos;s authorization credentials in an
                  Identity Database or in your own store.
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
            <Link href="/docs/database" target="_blank">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Documentation
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/connection/database/configure">
              Configure Database
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Database Connection</DialogTitle>
            <DialogDescription className="sr-only">
              Create a new database connection
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="connection-name">Connection name</Label>
              <Input
                id="connection-name"
                placeholder="Enter a name for this database connection"
                value={connectionName}
                onChange={(e) => setConnectionName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                A connection name is required. Please enter a name for the connection.
              </p>
              <p className="text-xs text-muted-foreground">
                Must start and end with an alphanumeric character and can only contain alphanumeric
                characters and &apos;-&apos;. Can&apos;t have more than 35 characters.
              </p>
            </div>

            <div className="space-y-3">
              <Label>Choose one or more attributes as user identifiers</Label>
              <p className="text-xs text-muted-foreground">
                Toggling on an attribute will make it an identifier for this connection.
              </p>
              <div className="space-y-3">
                {userIdentifiers.map((identifier) => (
                  <div key={identifier.id} className="flex items-start gap-3">
                    <Checkbox
                      id={identifier.id}
                      checked={identifiers.includes(identifier.id)}
                      onCheckedChange={() => handleIdentifierToggle(identifier.id)}
                      className="mt-1"
                    />
                    <div className="space-y-1">
                      <Label htmlFor={identifier.id} className="text-sm font-medium cursor-pointer">
                        {identifier.label}
                      </Label>
                      {identifier.allowNonUnique && identifiers.includes("email") && (
                        <div className="flex items-start gap-2 mt-1">
                          <Checkbox
                            id="non-unique-email"
                            checked={allowNonUniqueEmail}
                            onCheckedChange={(checked) =>
                              setAllowNonUniqueEmail(checked as boolean)
                            }
                            className="mt-0.5"
                          />
                          <div>
                            <Label
                              htmlFor="non-unique-email"
                              className="text-xs font-medium cursor-pointer text-amber-600"
                            >
                              Allow non-unique email addresses
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              EARLY ACCESS - This allows multiple accounts to have the same email
                              address and is a permanent setting that cannot be undone.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Choose one or more authentication methods</Label>
              <p className="text-xs text-muted-foreground">
                Toggling on an authentication method will allow it to be used to challenge users.
              </p>
              <div className="space-y-3">
                {authMethods.map((method) => (
                  <div key={method.id} className="flex items-start gap-3">
                    <Checkbox
                      id={method.id}
                      checked={authMethodsEnabled.includes(method.id)}
                      onCheckedChange={() => handleAuthMethodToggle(method.id)}
                      className="mt-1"
                    />
                    <Label htmlFor={method.id} className="text-sm font-medium cursor-pointer">
                      {method.label}
                      {method.id === "passkey" && (
                        <span className="ml-2 text-xs text-muted-foreground font-normal">
                          After creating the connection, you can activate passkeys by adding it as
                          an authentication method.
                        </span>
                      )}
                      {method.id === "custom" && (
                        <span className="ml-2 text-xs text-muted-foreground font-normal">
                          By default, Identity will provide the infrastructure to store users on our
                          own database. Enable if you have a legacy database or if you want to use
                          your own database (MySql, Mongo, SQL Server, etc.). Learn more.
                        </span>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="disable-signups"
                  checked={disableSignUps}
                  onCheckedChange={(checked) => setDisableSignUps(checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="disable-signups" className="text-sm cursor-pointer">
                  Disable Sign Ups
                  <span className="ml-2 text-xs text-muted-foreground font-normal">
                    Prevent new user signups to your application from public (unauthenticated)
                    endpoints. You will still be able to create users with your API credentials or
                    from the Management dashboard. Disabling signups will not impact organization
                    signup.
                  </span>
                </Label>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="promote-domain"
                  checked={promoteToDomain}
                  onCheckedChange={(checked) => setPromoteToDomain(checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="promote-domain" className="text-sm cursor-pointer">
                  Promote Connection to Domain Level
                  <span className="ml-2 text-xs text-muted-foreground font-normal">
                    Promote this connection to the domain level so it can be used by third-party
                    applications. Once promoted, all third-party applications in your tenant will
                    automatically have access to this connection. Learn more
                  </span>
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!connectionName || creating}>
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
