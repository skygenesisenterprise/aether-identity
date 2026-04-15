"use client";

import { useState, useEffect } from "react";
import {
  Globe,
  LayoutTemplate,
  Eye,
  Save,
  RotateCcw,
  Upload,
  Monitor,
  Smartphone,
  Tablet,
  Check,
  Users,
  Settings,
  Sparkles,
  Loader2,
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
import { brandingApi } from "@/lib/api/client";
import type { BrandingUniversalLogin, BrandingUniversalLoginPages } from "@/lib/api/types";

const loginPageTemplates = [
  { id: "classic", name: "Classic", description: "Traditional centered card layout" },
  { id: "modern", name: "Modern", description: "Full-screen split layout" },
  { id: "minimal", name: "Minimal", description: "Clean, minimal design" },
  { id: "enterprise", name: "Enterprise", description: "Professional with branding" },
];

const backgroundOptions = [
  { id: "solid", name: "Solid Color", preview: "bg-slate-100" },
  { id: "gradient", name: "Gradient", preview: "bg-gradient-to-br from-violet-500 to-purple-600" },
  {
    id: "image",
    name: "Background Image",
    preview: "bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?w=800')]",
  },
  {
    id: "pattern",
    name: "Pattern",
    preview:
      "bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] bg-slate-50",
  },
];

const previewDevices = [
  { id: "desktop", name: "Desktop", icon: Monitor },
  { id: "tablet", name: "Tablet", icon: Tablet },
  { id: "mobile", name: "Mobile", icon: Smartphone },
];

export default function UniversalLoginPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState("templates");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [selectedBackground, setSelectedBackground] = useState("gradient");
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [logoUrl, setLogoUrl] = useState("");
  const [companyName, setCompanyName] = useState("Acme Inc.");
  const [welcomeTitle, setWelcomeTitle] = useState("Welcome back");
  const [welcomeSubtitle, setWelcomeSubtitle] = useState("Sign in to your account");
  const [showSocialLogin, setShowSocialLogin] = useState(true);
  const [showSignUp, setShowSignUp] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(true);
  const [showRememberMe, setShowRememberMe] = useState(true);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("7d");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [accentColor, setAccentColor] = useState("#6366f1");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [isActive, setIsActive] = useState(true);

  const [stats, setStats] = useState({
    activeUsers: 0,
    templates: 0,
    lastUpdated: "Just now",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [universalLoginRes, pagesRes] = await Promise.all([
          brandingApi.getUniversalLogin(),
          brandingApi.getUniversalLoginPages(),
        ]);

        if (universalLoginRes.data) {
          const data = universalLoginRes.data;
          setSelectedTemplate(data.template || "modern");
          setSelectedBackground(data.background || "gradient");
          setBackgroundImageUrl(data.backgroundImageUrl || "");
          setLogoUrl(data.logoUrl || "");
          setCompanyName(data.companyName || "Acme Inc.");
          setWelcomeTitle(data.welcomeTitle || "Welcome back");
          setWelcomeSubtitle(data.welcomeSubtitle || "Sign in to your account");
          setShowSocialLogin(data.showSocialLogin ?? true);
          setShowSignUp(data.showSignUp ?? true);
          setShowForgotPassword(data.showForgotPassword ?? true);
          setShowRememberMe(data.showRememberMe ?? true);
          setShowCaptcha(data.showCaptcha ?? false);
          setSessionTimeout(data.sessionTimeout || "7d");
          setRedirectUrl(data.redirectUrl || "");
          setAccentColor(data.accentColor || "#6366f1");
          setBackgroundColor(data.backgroundColor || "#ffffff");
          setIsActive(data.isActive ?? true);
        }

        if (pagesRes.data) {
          setStats((prev) => ({ ...prev, templates: pagesRes.data?.length || 0 }));
        }

        setStats((prev) => ({ ...prev, lastUpdated: "Just now" }));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load branding settings");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      await brandingApi.updateUniversalLogin({
        template: selectedTemplate,
        background: selectedBackground,
        backgroundImageUrl,
        logoUrl,
        companyName,
        welcomeTitle,
        welcomeSubtitle,
        showSocialLogin,
        showSignUp,
        showForgotPassword,
        showRememberMe,
        showCaptcha,
        sessionTimeout,
        redirectUrl,
        accentColor,
        backgroundColor,
        isActive,
      });

      setSuccess("Settings saved successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const deviceWidths = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  const currentBackground = backgroundOptions.find((b) => b.id === selectedBackground);
  const currentTemplate = loginPageTemplates.find((t) => t.id === selectedTemplate);

  return (
    <div className="min-h-screen bg-muted/30">
      {loading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}
      {!loading && error && (
        <div className="px-6 pt-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}
      {!loading && success && (
        <div className="px-6 pt-6">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        </div>
      )}
      {!loading && (
        <>
          <div className="border-b bg-background">
            <div className="px-6 py-6">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold tracking-tight">Identity Universal Login</h1>
                <p className="text-muted-foreground">
                  Configure your default login experience for all applications
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
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <div className="flex items-center gap-2">
                        <p className="text-3xl font-bold tracking-tight">Active</p>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          Enabled
                        </Badge>
                      </div>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Template</p>
                      <p className="text-3xl font-bold tracking-tight">4</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <LayoutTemplate className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                      <p className="text-3xl font-bold tracking-tight">12,847</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <Users className="h-6 w-6 text-foreground" />
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
                      <Eye className="h-6 w-6 text-foreground" />
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
                            Login Configuration
                          </CardTitle>
                          <CardDescription>
                            Customize your Universal Login experience
                          </CardDescription>
                        </div>
                      </div>
                      <TabsList className="mt-4">
                        <TabsTrigger value="templates">Templates</TabsTrigger>
                        <TabsTrigger value="branding">Branding</TabsTrigger>
                        <TabsTrigger value="content">Content</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                      </TabsList>
                    </CardHeader>

                    <CardContent>
                      <TabsContent value="templates" className="space-y-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Page Template</Label>
                            <div className="grid grid-cols-2 gap-3">
                              {loginPageTemplates.map((template) => (
                                <button
                                  key={template.id}
                                  onClick={() => setSelectedTemplate(template.id)}
                                  className={cn(
                                    "flex flex-col items-start p-4 rounded-lg border-2 transition-all hover:scale-[1.02]",
                                    selectedTemplate === template.id
                                      ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                                      : "border-border hover:border-muted-foreground"
                                  )}
                                >
                                  <div className="flex items-center gap-2 w-full">
                                    <LayoutTemplate className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">{template.name}</span>
                                    {selectedTemplate === template.id && (
                                      <Check className="h-4 w-4 text-primary ml-auto" />
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1 text-left">
                                    {template.description}
                                  </p>
                                </button>
                              ))}
                            </div>
                          </div>

                          <Separator />

                          <div className="space-y-2">
                            <Label>Background</Label>
                            <div className="grid grid-cols-4 gap-2">
                              {backgroundOptions.map((bg) => (
                                <button
                                  key={bg.id}
                                  onClick={() => setSelectedBackground(bg.id)}
                                  className={cn(
                                    "h-16 rounded-lg border-2 transition-all hover:scale-105",
                                    selectedBackground === bg.id
                                      ? "border-primary ring-2 ring-primary/20"
                                      : "border-border",
                                    bg.preview
                                  )}
                                  title={bg.name}
                                />
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Selected: {currentBackground?.name}
                            </p>
                          </div>

                          {selectedBackground === "image" && (
                            <>
                              <Separator />
                              <div className="space-y-2">
                                <Label>Background Image URL</Label>
                                <Input
                                  placeholder="https://example.com/background.jpg"
                                  value={backgroundImageUrl}
                                  onChange={(e) => setBackgroundImageUrl(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                  Recommended: 1920x1080px, JPG or PNG
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="branding" className="space-y-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Company Logo</Label>
                            <div className="flex items-center gap-4">
                              <div className="h-16 w-16 rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/50">
                                {logoUrl ? (
                                  <img
                                    src={logoUrl}
                                    alt="Logo"
                                    className="h-full w-full object-contain rounded-lg"
                                  />
                                ) : (
                                  <Upload className="h-6 w-6 text-muted-foreground" />
                                )}
                              </div>
                              <div className="space-y-2">
                                <Input
                                  placeholder="Enter logo URL"
                                  value={logoUrl}
                                  onChange={(e) => setLogoUrl(e.target.value)}
                                  className="max-w-xs"
                                />
                                <p className="text-xs text-muted-foreground">
                                  Recommended: 200x80px, PNG or SVG
                                </p>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          <div className="space-y-2">
                            <Label>Company Name</Label>
                            <Input
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
                              placeholder="Your company name"
                            />
                          </div>

                          <Separator />

                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Accent Color</Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="color"
                                  value={accentColor}
                                  onChange={(e) => setAccentColor(e.target.value)}
                                  className="w-12 h-10 p-1 rounded-md"
                                />
                                <Input
                                  value={accentColor}
                                  onChange={(e) => setAccentColor(e.target.value)}
                                  className="flex-1 font-mono"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Background Color</Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="color"
                                  value={backgroundColor}
                                  onChange={(e) => setBackgroundColor(e.target.value)}
                                  className="w-12 h-10 p-1 rounded-md"
                                />
                                <Input
                                  value={backgroundColor}
                                  onChange={(e) => setBackgroundColor(e.target.value)}
                                  className="flex-1 font-mono"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="content" className="space-y-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Welcome Title</Label>
                            <Input
                              value={welcomeTitle}
                              onChange={(e) => setWelcomeTitle(e.target.value)}
                              placeholder="Welcome back"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Welcome Subtitle</Label>
                            <Input
                              value={welcomeSubtitle}
                              onChange={(e) => setWelcomeSubtitle(e.target.value)}
                              placeholder="Sign in to your account"
                            />
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Social Login</Label>
                              <p className="text-sm text-muted-foreground">
                                Show social login buttons (Google, GitHub, etc.)
                              </p>
                            </div>
                            <Switch
                              checked={showSocialLogin}
                              onCheckedChange={setShowSocialLogin}
                            />
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Sign Up Link</Label>
                              <p className="text-sm text-muted-foreground">
                                Show "Don't have an account? Sign up" link
                              </p>
                            </div>
                            <Switch checked={showSignUp} onCheckedChange={setShowSignUp} />
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Forgot Password</Label>
                              <p className="text-sm text-muted-foreground">
                                Show "Forgot password?" link
                              </p>
                            </div>
                            <Switch
                              checked={showForgotPassword}
                              onCheckedChange={setShowForgotPassword}
                            />
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Remember Me</Label>
                              <p className="text-sm text-muted-foreground">
                                Show "Remember me" checkbox
                              </p>
                            </div>
                            <Switch checked={showRememberMe} onCheckedChange={setShowRememberMe} />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="security" className="space-y-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>CAPTCHA Verification</Label>
                              <p className="text-sm text-muted-foreground">
                                Require CAPTCHA verification on login
                              </p>
                            </div>
                            <Switch checked={showCaptcha} onCheckedChange={setShowCaptcha} />
                          </div>

                          <Separator />

                          <div className="space-y-2">
                            <Label>Session Timeout</Label>
                            <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                              <SelectTrigger className="w-48">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1h">1 hour</SelectItem>
                                <SelectItem value="24h">24 hours</SelectItem>
                                <SelectItem value="7d">7 days</SelectItem>
                                <SelectItem value="30d">30 days</SelectItem>
                                <SelectItem value="never">Never</SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                              How long users stay logged in
                            </p>
                          </div>

                          <Separator />

                          <div className="space-y-2">
                            <Label>Post-Login Redirect URL</Label>
                            <Input
                              value={redirectUrl}
                              onChange={(e) => setRedirectUrl(e.target.value)}
                              placeholder="https://your-app.com/dashboard"
                            />
                            <p className="text-xs text-muted-foreground">
                              Default redirect after successful login (optional)
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                    </CardContent>
                  </Tabs>
                </Card>

                <div className="flex items-center justify-between">
                  <Button variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset to Default
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview Full Page
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold">Live Preview</CardTitle>
                      <div className="flex items-center gap-1">
                        {previewDevices.map((device) => (
                          <Button
                            key={device.id}
                            variant="ghost"
                            size="icon"
                            className={cn("h-8 w-8", previewDevice === device.id && "bg-muted")}
                            onClick={() => setPreviewDevice(device.id)}
                          >
                            <device.icon className="h-4 w-4" />
                          </Button>
                        ))}
                      </div>
                    </div>
                    <CardDescription>Real-time preview of your login page</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center bg-muted/50 rounded-lg p-4 overflow-hidden">
                      <div
                        className="relative bg-background rounded-lg shadow-lg overflow-hidden transition-all duration-300"
                        style={{
                          width: deviceWidths[previewDevice as keyof typeof deviceWidths],
                          maxWidth: "100%",
                        }}
                      >
                        <div
                          className={cn("min-h-80 p-6 flex flex-col", currentBackground?.preview)}
                        >
                          {logoUrl && (
                            <img
                              src={logoUrl}
                              alt="Logo"
                              className="h-10 w-auto object-contain mb-6 self-center"
                            />
                          )}
                          {!logoUrl && (
                            <div className="h-10 w-32 bg-primary/10 rounded-md mb-6 self-center flex items-center justify-center">
                              <Globe className="h-6 w-6 text-primary" />
                            </div>
                          )}
                          <div className="flex-1 flex items-center justify-center">
                            <div className="w-full max-w-xs space-y-4 bg-background/95 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                              <div className="text-center space-y-1">
                                <h3 className="text-lg font-semibold">{welcomeTitle}</h3>
                                <p className="text-sm text-muted-foreground">{welcomeSubtitle}</p>
                              </div>
                              <div className="space-y-3">
                                <div className="h-10 bg-muted rounded-lg" />
                                <div className="h-10 bg-muted rounded-lg" />
                              </div>
                              <Button className="w-full">Sign In</Button>
                              {showRememberMe && (
                                <div className="flex items-center gap-2 text-xs">
                                  <div className="h-4 w-4 rounded border" />
                                  <span>Remember me</span>
                                </div>
                              )}
                              {showSocialLogin && (
                                <div className="space-y-2 pt-2">
                                  <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                      <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                      <span className="bg-background px-2 text-muted-foreground">
                                        Or continue with
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 pt-2">
                                    <div className="flex-1 h-8 bg-muted rounded-lg" />
                                    <div className="flex-1 h-8 bg-muted rounded-lg" />
                                  </div>
                                </div>
                              )}
                              <div className="text-center text-xs text-muted-foreground space-y-1">
                                {showForgotPassword && <p>Forgot your password?</p>}
                                {showSignUp && <p>Don&apos;t have an account? Sign up</p>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Sparkles className="h-4 w-4 mr-2" />
                      AI Theme Generator
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Eye className="h-4 w-4 mr-2" />
                      Open Full Preview
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <LayoutTemplate className="h-4 w-4 mr-2" />
                      Browse Templates
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
                    <CardDescription>Use Universal Login in your apps</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Authorization URL</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          readOnly
                          value="https://auth.aetheridentity.dev/u/login"
                          className="text-xs font-mono"
                        />
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Sparkles className="h-3 w-3" />
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
        </>
      )}
    </div>
  );
}
