"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Key,
  Shield,
  ArrowRight,
  Globe,
  Lock,
  Users,
  ArrowUpRight,
  ExternalLink,
  Folder,
  FileKey,
  Link as LinkIcon,
  ArrowDownLeft,
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
import type { EnterpriseConnection } from "@/lib/api/types";

const features = [
  {
    icon: Globe,
    title: "SAML",
    description: "Enable Single Sign-On (SSO) for enterprise applications using SAML 2.0 protocol.",
    href: "/docs",
  },
  {
    icon: Lock,
    title: "OpenID Connect",
    description: "Configure OIDC-based SSO with identity providers for modern applications.",
    href: "/docs",
  },
  {
    icon: Users,
    title: "Active Directory / LDAP",
    description:
      "Integrate with your corporate Active Directory or LDAP directory for authentication.",
    href: "/docs",
  },
  {
    icon: Shield,
    title: "WS-Federation",
    description:
      "Support WS-Federation protocol for legacy enterprise applications and Microsoft ecosystem.",
    href: "/docs",
  },
];

const quickLinks = [
  {
    title: "Enterprise Connections",
    description: "Complete guide to enterprise SSO",
    href: "/docs/enterprise",
  },
  {
    title: "SAML Configuration",
    description: "Set up SAML connections",
    href: "/docs/enterprise/saml",
  },
  {
    title: "Active Directory",
    description: "Configure AD/LDAP integration",
    href: "/docs/enterprise/ad",
  },
];

const enterpriseTypes = [
  { id: "saml", label: "SAML", description: "SAML 2.0 Single Sign-On" },
  { id: "oidc", label: "OpenID Connect", description: "OIDC-based SSO" },
  { id: "ad", label: "Active Directory / LDAP", description: "Corporate directory" },
  { id: "wsfed", label: "WS-Federation", description: "Legacy Microsoft SSO" },
];

export default function EnterprisePage() {
  const [connections, setConnections] = useState<EnterpriseConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [connectionName, setConnectionName] = useState("");
  const [idpMetadata, setIdpMetadata] = useState("");
  const [issuer, setIssuer] = useState("");
  const [clientIdOidc, setClientIdOidc] = useState("");
  const [clientSecretOidc, setClientSecretOidc] = useState("");
  const [adConnection, setAdConnection] = useState("");
  const [baseDn, setBaseDn] = useState("");
  const [bindDn, setBindDn] = useState("");
  const [bindPassword, setBindPassword] = useState("");

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const response = await connectionsApi.listEnterprise();
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
      if (selectedType === "saml") {
        await connectionsApi.createSaml({
          name: connectionName,
          type: "saml",
          metadataUrl: idpMetadata,
        });
      } else if (selectedType === "oidc") {
        await connectionsApi.createOidc({
          name: connectionName,
          type: "oidc",
          issuer,
          clientId: clientIdOidc,
          clientSecret: clientSecretOidc,
        });
      } else if (selectedType === "ad") {
        await connectionsApi.createAd({
          name: connectionName,
          type: "ad",
          connectionString: adConnection,
          baseDn,
          bindDn,
          bindPassword,
        });
      }
      setDialogOpen(false);
      resetForm();
      fetchConnections();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create connection");
    } finally {
      setCreating(false);
    }
  };

  const resetForm = () => {
    setSelectedType("");
    setConnectionName("");
    setIdpMetadata("");
    setIssuer("");
    setClientIdOidc("");
    setClientSecretOidc("");
    setAdConnection("");
    setBaseDn("");
    setBindDn("");
    setBindPassword("");
  };

  const handleToggleConnection = async (conn: EnterpriseConnection) => {
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
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Identity Enterprise Connections
                </h1>
                <p className="text-muted-foreground">
                  Enable Single Sign-On (SSO) for your enterprise with SAML, OIDC, AD/LDAP and more.
                </p>
              </div>
            </div>
            <Button onClick={() => setDialogOpen(true)}>
              <FileKey className="mr-2 h-4 w-4" />
              New Enterprise Connection
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
                          <p className="text-sm text-muted-foreground">
                            {conn.type?.toUpperCase()}
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
                  <h2 className="text-lg font-semibold">SAML Single Sign-On</h2>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    Recommended
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  Enable SAML 2.0 Single Sign-On for enterprise applications. Connect with any SAML
                  identity provider including Okta, Azure AD, OneLogin, and more.
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
            <Link href="/docs/enterprise" target="_blank">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Documentation
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/connection/enterprise/configure">
              Configure Enterprise
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Enterprise Connection</DialogTitle>
            <DialogDescription className="sr-only">
              Create a new enterprise connection
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Connection Type</Label>
              <p className="text-xs text-muted-foreground">
                Select the type of enterprise connection you want to create.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {enterpriseTypes.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`cursor-pointer rounded-lg border-2 p-3 transition-colors ${
                      selectedType === type.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-4 w-4 rounded-full border-2 ${
                          selectedType === type.id
                            ? "border-primary bg-primary"
                            : "border-muted-foreground"
                        }`}
                      />
                      <span className="text-sm font-medium">{type.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="connection-name">Connection name</Label>
              <Input
                id="connection-name"
                placeholder="Enter a name for this connection"
                value={connectionName}
                onChange={(e) => setConnectionName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                A connection name is required. Must start and end with an alphanumeric character and
                can only contain alphanumeric characters and &apos;-&apos;. Can&apos;t have more
                than 35 characters.
              </p>
            </div>

            {selectedType === "saml" && (
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <ArrowDownLeft className="h-4 w-4" />
                  <span>Service Provider Details</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sp-entity-id">Entity ID</Label>
                    <Input id="sp-entity-id" placeholder="https://your-tenant.auth.com" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sp-acs">ACS URL</Label>
                    <Input
                      id="sp-acs"
                      placeholder="https://your-tenant.auth.com/saml/..."
                      readOnly
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idp-metadata">IdP Metadata URL (optional)</Label>
                  <Input
                    id="idp-metadata"
                    placeholder="https://your-idp.com/metadata"
                    value={idpMetadata}
                    onChange={(e) => setIdpMetadata(e.target.value)}
                  />
                </div>
              </div>
            )}

            {selectedType === "oidc" && (
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <LinkIcon className="h-4 w-4" />
                  <span>OAuth / OIDC Configuration</span>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issuer">Issuer</Label>
                  <Input
                    id="issuer"
                    placeholder="https://your-idp.com"
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-id-oidc">Client ID</Label>
                  <Input
                    id="client-id-oidc"
                    placeholder="Enter the client ID"
                    value={clientIdOidc}
                    onChange={(e) => setClientIdOidc(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-secret-oidc">Client Secret</Label>
                  <Input
                    id="client-secret-oidc"
                    type="password"
                    placeholder="Enter the client secret"
                    value={clientSecretOidc}
                    onChange={(e) => setClientSecretOidc(e.target.value)}
                  />
                </div>
              </div>
            )}

            {selectedType === "ad" && (
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Folder className="h-4 w-4" />
                  <span>Directory Configuration</span>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ad-connection">Connection String</Label>
                  <Input
                    id="ad-connection"
                    placeholder="ldap://your-dc-server:389"
                    value={adConnection}
                    onChange={(e) => setAdConnection(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="base-dn">Base DN</Label>
                  <Input
                    id="base-dn"
                    placeholder="dc=example,dc=com"
                    value={baseDn}
                    onChange={(e) => setBaseDn(e.target.value)}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="bind-dn">Bind DN</Label>
                    <Input
                      id="bind-dn"
                      placeholder="cn=admin,dc=example,dc=com"
                      value={bindDn}
                      onChange={(e) => setBindDn(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bind-password">Bind Password</Label>
                    <Input
                      id="bind-password"
                      type="password"
                      placeholder="Enter bind password"
                      value={bindPassword}
                      onChange={(e) => setBindPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!selectedType || !connectionName || creating}>
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
