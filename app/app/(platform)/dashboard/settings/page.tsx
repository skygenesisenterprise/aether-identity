"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Globe,
  Mail,
  Shield,
  Container,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Info,
  GitBranch,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { settingsApi } from "@/lib/api/client";
import { SystemSettings } from "@/lib/api/types";

const defaultSettings: SystemSettings = {
  id: "",
  siteName: "Aether Identity",
  siteDescription: "",
  siteUrl: "",
  logoUrl: "",
  faviconUrl: "",
  email: "",
  smtpHost: "",
  smtpPort: 587,
  smtpUser: "",
  fromName: "",
  fromEmail: "",
  maintenanceMode: false,
  registrationOpen: true,
  commentsEnabled: true,
  newsletterEnabled: false,
  analyticsEnabled: true,
  sslEnforced: true,
  dockerImage: "skygenesisenterprise/aether-identity:latest",
  version: "1.0.0",
  createdAt: "",
  updatedAt: "",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dockerLoading, setDockerLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testingEmail, setTestingEmail] = useState(false);
  const [emailTestResult, setEmailTestResult] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setError(null);
      const response = await settingsApi.get();
      if (response.data) {
        setSettings(response.data);
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
      setError("Failed to load settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await settingsApi.update(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save settings:", err);
      setError("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateDockerImage = async () => {
    setDockerLoading(true);
    setError(null);
    try {
      await settingsApi.update({ dockerImage: settings.dockerImage });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to update Docker image:", err);
      setError("Failed to update Docker image. Please try again.");
    } finally {
      setDockerLoading(false);
    }
  };

  const handleTestEmail = async () => {
    setTestingEmail(true);
    setEmailTestResult(null);
    setError(null);
    try {
      await settingsApi.testEmail();
      setEmailTestResult("success");
    } catch (err) {
      console.error("Failed to test email:", err);
      setEmailTestResult("error");
      setError("Failed to send test email. Please check your SMTP configuration.");
    } finally {
      setTestingEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="px-6 py-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
              <Settings className="h-6 w-6" />
              Identity Platform Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your identity platform configuration and Docker deployment.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-6 flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-background">
            <TabsTrigger value="general" className="gap-2">
              <Globe className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="docker" className="gap-2">
              <Container className="h-4 w-4" />
              Docker
            </TabsTrigger>
            <TabsTrigger value="email" className="gap-2">
              <Mail className="h-4 w-4" />
              Email (SMTP)
            </TabsTrigger>
            <TabsTrigger value="features" className="gap-2">
              <Shield className="h-4 w-4" />
              Features
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic information about your platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      placeholder="Aether Identity"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteUrl">Site URL</Label>
                    <Input
                      id="siteUrl"
                      value={settings.siteUrl || ""}
                      onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                      placeholder="https://identity.example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription || ""}
                    onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                    placeholder="Describe your identity platform..."
                    rows={3}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input
                      id="logoUrl"
                      value={settings.logoUrl || ""}
                      onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faviconUrl">Favicon URL</Label>
                    <Input
                      id="faviconUrl"
                      value={settings.faviconUrl || ""}
                      onChange={(e) => setSettings({ ...settings, faviconUrl: e.target.value })}
                      placeholder="https://example.com/favicon.ico"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email || ""}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    placeholder="admin@example.com"
                  />
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <GitBranch className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Current Version</p>
                    <p className="text-sm text-muted-foreground">{settings.version}</p>
                  </div>
                  <Badge variant="outline">Stable</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="docker" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Docker Configuration</CardTitle>
                <CardDescription>Manage your Docker container image and deployment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Docker Deployment</p>
                    <p className="text-sm text-blue-700">
                      Update the Docker image tag to pull a different version. Use{" "}
                      <code className="text-xs bg-blue-100 px-1 rounded">latest</code> for the most
                      recent version or specify a specific version tag.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dockerImage">Docker Image</Label>
                  <div className="flex gap-2">
                    <Input
                      id="dockerImage"
                      value={settings.dockerImage}
                      onChange={(e) => setSettings({ ...settings, dockerImage: e.target.value })}
                      placeholder="skygenesisenterprise/aether-identity:latest"
                      className="font-mono"
                    />
                    <Button
                      onClick={handleUpdateDockerImage}
                      disabled={dockerLoading}
                      className="gap-2"
                    >
                      {dockerLoading ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                      Update
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Format: <code>registry/image:tag</code>
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Image Information</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-3 p-3 rounded-lg border">
                      <Container className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Current Image</p>
                        <p className="text-sm font-mono">{settings.dockerImage}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg border">
                      <GitBranch className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Version</p>
                        <p className="text-sm font-mono">{settings.version}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-amber-50 border border-amber-200">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-900">Warning</p>
                    <p className="text-sm text-amber-700">
                      Changing the Docker image will require container recreation. Make sure to
                      backup your data before updating.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SMTP Configuration</CardTitle>
                <CardDescription>
                  Configure email delivery for transactional emails and notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={settings.smtpHost || ""}
                      onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                      placeholder="smtp.example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Select
                      value={String(settings.smtpPort || 587)}
                      onValueChange={(value) =>
                        setSettings({ ...settings, smtpPort: parseInt(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">25 (Standard)</SelectItem>
                        <SelectItem value="465">465 (SSL)</SelectItem>
                        <SelectItem value="587">587 (TLS)</SelectItem>
                        <SelectItem value="2525">2525 (Alternative)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="smtpUser">SMTP Username</Label>
                    <Input
                      id="smtpUser"
                      value={settings.smtpUser || ""}
                      onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                      placeholder="username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                    <Input id="smtpPassword" type="password" placeholder="••••••••" />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Sender Configuration</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fromName">From Name</Label>
                      <Input
                        id="fromName"
                        value={settings.fromName || ""}
                        onChange={(e) => setSettings({ ...settings, fromName: e.target.value })}
                        placeholder="Aether Identity"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fromEmail">From Email</Label>
                      <Input
                        id="fromEmail"
                        type="email"
                        value={settings.fromEmail || ""}
                        onChange={(e) => setSettings({ ...settings, fromEmail: e.target.value })}
                        placeholder="noreply@example.com"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={handleTestEmail}
                  disabled={testingEmail}
                >
                  {testingEmail ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                  {testingEmail ? "Sending..." : "Test Email Configuration"}
                </Button>
                {emailTestResult === "success" && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Test email sent successfully!</span>
                  </div>
                )}
                {emailTestResult === "error" && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>Failed to send test email</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Features</CardTitle>
                <CardDescription>Enable or disable platform features and behaviors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="space-y-0.5">
                      <Label className="text-base">Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable to block all user access while performing maintenance
                      </p>
                    </div>
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, maintenanceMode: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="space-y-0.5">
                      <Label className="text-base">User Registration</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow new users to register on the platform
                      </p>
                    </div>
                    <Switch
                      checked={settings.registrationOpen}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, registrationOpen: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="space-y-0.5">
                      <Label className="text-base">Comments</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow users to comment on articles
                      </p>
                    </div>
                    <Switch
                      checked={settings.commentsEnabled}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, commentsEnabled: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="space-y-0.5">
                      <Label className="text-base">Newsletter</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable newsletter subscription functionality
                      </p>
                    </div>
                    <Switch
                      checked={settings.newsletterEnabled}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, newsletterEnabled: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="space-y-0.5">
                      <Label className="text-base">Analytics</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable analytics and usage tracking
                      </p>
                    </div>
                    <Switch
                      checked={settings.analyticsEnabled}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, analyticsEnabled: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="space-y-0.5">
                      <Label className="text-base">Enforce SSL</Label>
                      <p className="text-sm text-muted-foreground">
                        Redirect all HTTP traffic to HTTPS
                      </p>
                    </div>
                    <Switch
                      checked={settings.sslEnforced}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, sslEnforced: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex items-center justify-end gap-4">
          {saved && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm">Settings saved successfully</span>
            </div>
          )}
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
