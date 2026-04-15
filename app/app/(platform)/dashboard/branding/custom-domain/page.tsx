"use client";

import { useState } from "react";
import {
  Globe,
  Link2,
  Shield,
  Eye,
  Save,
  Trash2,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  Settings,
  RefreshCw,
  Lock,
  Unlock,
  AlertTriangle,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const domains = [
  {
    id: "1",
    domain: "auth.example.com",
    status: "active",
    ssl: "valid",
    expires: "2025-08-15",
    verified: true,
  },
  {
    id: "2",
    domain: "login.company.io",
    status: "pending",
    ssl: "pending",
    expires: null,
    verified: false,
  },
  {
    id: "3",
    domain: "sso.internal.net",
    status: "inactive",
    ssl: "expired",
    expires: "2024-12-01",
    verified: true,
  },
];

const recordTypes = [
  { type: "CNAME", host: "auth", value: "auth.aetheridentity.dev", required: true },
  { type: "TXT", host: "@", value: "aether-verification=abc123xyz", required: true },
];

export default function CustomDomainPage() {
  const [activeTab, setActiveTab] = useState("domains");
  const [newDomain, setNewDomain] = useState("");
  const [enableHttps, setEnableHttps] = useState(true);
  const [httpRedirect, setHttpRedirect] = useState(true);
  const [forceHttps, setForceHttps] = useState(false);
  const [enableHsts, setEnableHsts] = useState(false);
  const [customCertificate, setCustomCertificate] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string | null>("1");

  const currentDomain = domains.find((d) => d.id === selectedDomain);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "inactive":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSslStatusBadge = (ssl: string) => {
    switch (ssl) {
      case "valid":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <Lock className="h-3 w-3 mr-1" />
            Valid
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            Pending
          </Badge>
        );
      case "expired":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Expired
          </Badge>
        );
      default:
        return <Badge variant="secondary">{ssl}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="px-6 py-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">Identity Custom Domain</h1>
            <p className="text-muted-foreground">
              Configure custom domains for your authentication pages
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Active Domains</p>
                  <p className="text-3xl font-bold tracking-tight">1</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <Globe className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-3xl font-bold tracking-tight">1</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">SSL Certificates</p>
                  <p className="text-3xl font-bold tracking-tight">2</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Shield className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p className="text-xl font-bold tracking-tight">2h ago</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <RefreshCw className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-semibold">
                        Domain Configuration
                      </CardTitle>
                      <CardDescription>Manage your custom domains and SSL settings</CardDescription>
                    </div>
                  </div>
                  <TabsList className="mt-4">
                    <TabsTrigger value="domains">Domains</TabsTrigger>
                    <TabsTrigger value="ssl">SSL/TLS</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                </CardHeader>

                <CardContent>
                  <TabsContent value="domains" className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Add New Domain</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="auth.yourcompany.com"
                            value={newDomain}
                            onChange={(e) => setNewDomain(e.target.value)}
                          />
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Domain
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Enter your custom domain to verify ownership
                        </p>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label>Configured Domains</Label>
                        <div className="border rounded-lg divide-y">
                          {domains.map((domain) => (
                            <div
                              key={domain.id}
                              className={cn(
                                "flex items-center justify-between p-4 cursor-pointer transition-colors hover:bg-muted/50",
                                selectedDomain === domain.id && "bg-muted/50"
                              )}
                              onClick={() => setSelectedDomain(domain.id)}
                            >
                              <div className="flex items-center gap-4">
                                {getStatusIcon(domain.status)}
                                <div className="space-y-1">
                                  <p className="text-sm font-medium">{domain.domain}</p>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className={cn(domain.verified && "text-green-600")}>
                                      {domain.verified ? "Verified" : "Pending verification"}
                                    </span>
                                    <span>-</span>
                                    <span>{domain.status}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getSslStatusBadge(domain.ssl)}
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Settings className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-500"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {currentDomain && !currentDomain.verified && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                          <div className="flex-1 space-y-2">
                            <p className="font-medium text-yellow-800">
                              Domain Verification Required
                            </p>
                            <p className="text-sm text-yellow-700">
                              Add the following DNS records to verify ownership of{" "}
                              <span className="font-mono font-medium">{currentDomain.domain}</span>
                            </p>
                            <div className="mt-3 space-y-2">
                              {recordTypes.map((record, index) => (
                                <div key={index} className="bg-background rounded border p-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <Badge variant="outline">{record.type}</Badge>
                                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                                      <Copy className="h-3 w-3 mr-1" />
                                      Copy
                                    </Button>
                                  </div>
                                  <div className="space-y-1 text-xs font-mono">
                                    <p className="text-muted-foreground">
                                      Host: <span className="text-foreground">{record.host}</span>
                                    </p>
                                    <p className="text-muted-foreground">
                                      Value: <span className="text-foreground">{record.value}</span>
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <Button variant="outline" className="mt-3">
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Verify DNS Records
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="ssl" className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Automatic SSL</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically provision and renew SSL certificates
                          </p>
                        </div>
                        <Switch checked={enableHttps} onCheckedChange={setEnableHttps} />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Custom Certificate</Label>
                          <p className="text-sm text-muted-foreground">
                            Upload your own SSL certificate
                          </p>
                        </div>
                        <Switch
                          checked={customCertificate}
                          onCheckedChange={setCustomCertificate}
                        />
                      </div>

                      {customCertificate && (
                        <>
                          <Separator />
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Certificate File (.crt)</Label>
                              <Input type="file" accept=".crt,.pem" />
                            </div>
                            <div className="space-y-2">
                              <Label>Private Key (.key)</Label>
                              <Input type="file" accept=".key,.pem" />
                            </div>
                            <div className="space-y-2">
                              <Label>CA Bundle (optional)</Label>
                              <Input type="file" accept=".crt,.pem,.ca" />
                            </div>
                          </div>
                        </>
                      )}

                      <Separator />

                      <div className="space-y-2">
                        <Label>Certificate Provider</Label>
                        <Select defaultValue="letsencrypt">
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="letsencrypt">Let&apos;s Encrypt</SelectItem>
                            <SelectItem value="digicert">DigiCert</SelectItem>
                            <SelectItem value="godaddy">GoDaddy</SelectItem>
                            <SelectItem value="custom">Custom Provider</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator />

                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Shield className="h-5 w-5 text-green-600" />
                          <span className="font-medium">Certificate Status</span>
                          {currentDomain && getSslStatusBadge(currentDomain.ssl)}
                        </div>
                        <div className="grid gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Expires</span>
                            <span className="font-mono">{currentDomain?.expires || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Auto-renew</span>
                            <span>Enabled (30 days before expiry)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Force HTTPS</Label>
                          <p className="text-sm text-muted-foreground">
                            Redirect all HTTP traffic to HTTPS
                          </p>
                        </div>
                        <Switch checked={forceHttps} onCheckedChange={setForceHttps} />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>HTTP to HTTPS Redirect</Label>
                          <p className="text-sm text-muted-foreground">
                            Enable automatic redirect from HTTP
                          </p>
                        </div>
                        <Switch checked={httpRedirect} onCheckedChange={setHttpRedirect} />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>HSTS (HTTP Strict Transport Security)</Label>
                          <p className="text-sm text-muted-foreground">
                            Enable HSTS header for this domain
                          </p>
                        </div>
                        <Switch checked={enableHsts} onCheckedChange={setEnableHsts} />
                      </div>

                      {enableHsts && (
                        <>
                          <Separator />
                          <div className="space-y-2">
                            <Label>HSTS Max Age</Label>
                            <Select defaultValue="31536000">
                              <SelectTrigger className="w-48">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="3600">1 hour</SelectItem>
                                <SelectItem value="86400">1 day</SelectItem>
                                <SelectItem value="2592000">30 days</SelectItem>
                                <SelectItem value="31536000">1 year</SelectItem>
                                <SelectItem value="63072000">2 years</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}

                      <Separator />

                      <div className="space-y-2">
                        <Label>Domain Aliases</Label>
                        <Input placeholder="e.g., www.example.com, example.com" />
                        <p className="text-xs text-muted-foreground">
                          Additional domains to redirect to the primary domain
                        </p>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label>Default Redirect URL</Label>
                        <Input placeholder="https://your-app.com/dashboard" />
                        <p className="text-xs text-muted-foreground">
                          Where to redirect users after authentication (optional)
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>

            <div className="flex items-center justify-between">
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Status
              </Button>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Domain Details</CardTitle>
                <CardDescription>Selected domain configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentDomain ? (
                  <>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Domain</p>
                      <p className="font-mono font-medium">{currentDomain.domain}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Status</p>
                      <Badge
                        className={cn(
                          "capitalize",
                          currentDomain.status === "active" &&
                            "bg-green-100 text-green-700 hover:bg-green-100",
                          currentDomain.status === "pending" &&
                            "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
                          currentDomain.status === "inactive" &&
                            "bg-red-100 text-red-700 hover:bg-red-100"
                        )}
                      >
                        {currentDomain.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">SSL Status</p>
                      {getSslStatusBadge(currentDomain.ssl)}
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Expires</p>
                      <p className="font-mono text-sm">{currentDomain.expires || "N/A"}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Link2 className="h-4 w-4 mr-2" />
                        Copy URL
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Select a domain to view details</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Domain
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Verify All Domains
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Unlock className="h-4 w-4 mr-2" />
                  Force HTTPS All
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Integration</CardTitle>
                <CardDescription>Use your custom domain</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Authorization URL</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      value="https://sso.skygenesisenterprise.com/login"
                      className="text-xs font-mono"
                    />
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use this URL as your authorization endpoint
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
