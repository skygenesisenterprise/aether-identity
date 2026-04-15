"use client";

import { useState, useEffect } from "react";
import {
  Palette,
  LayoutTemplate,
  Eye,
  Save,
  RotateCcw,
  Upload,
  Monitor,
  Smartphone,
  Tablet,
  Check,
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
import { cn } from "@/lib/utils";
import { brandingApi } from "@/lib/api/client";

const colorThemes = [
  { id: "default", name: "Default", primary: "#000000", accent: "#3b82f6" },
  { id: "ocean", name: "Ocean", primary: "#0f172a", accent: "#0ea5e9" },
  { id: "forest", name: "Forest", primary: "#14532d", accent: "#22c55e" },
  { id: "sunset", name: "Sunset", primary: "#7c2d12", accent: "#f97316" },
  { id: "purple", name: "Purple", primary: "#581c87", accent: "#a855f7" },
  { id: "rose", name: "Rose", primary: "#4f0922", accent: "#f43f5e" },
];

const backgroundPatterns = [
  { id: "none", name: "None", preview: "bg-gradient-to-br from-gray-50 to-gray-100" },
  { id: "gradient", name: "Gradient", preview: "bg-gradient-to-br from-violet-500 to-purple-600" },
  {
    id: "dots",
    name: "Dots",
    preview: "bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]",
  },
  {
    id: "grid",
    name: "Grid",
    preview:
      "bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]",
  },
  {
    id: "noise",
    name: "Noise",
    preview:
      "bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%220.05%22/%3E%3C/svg%3E')]",
  },
];

const fontOptions = [
  { id: "inter", name: "Inter", preview: "font-sans" },
  { id: "geist", name: "Geist", preview: "font-sans" },
  { id: "roboto", name: "Roboto", preview: "font-sans" },
  { id: "playfair", name: "Playfair Display", preview: "font-serif" },
  { id: "mono", name: "JetBrains Mono", preview: "font-mono" },
];

const previewDevices = [
  { id: "desktop", name: "Desktop", icon: Monitor },
  { id: "tablet", name: "Tablet", icon: Tablet },
  { id: "mobile", name: "Mobile", icon: Smartphone },
];

export default function CustomLoginPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState("branding");
  const [selectedTheme, setSelectedTheme] = useState("default");
  const [selectedPattern, setSelectedPattern] = useState("gradient");
  const [selectedFont, setSelectedFont] = useState("inter");
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [logoUrl, setLogoUrl] = useState("");
  const [showPoweredBy, setShowPoweredBy] = useState(true);
  const [socialButtons, setSocialButtons] = useState(true);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [customCss, setCustomCss] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);

  const [stats, setStats] = useState({
    templates: 0,
    lastUpdated: "Just now",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await brandingApi.getCustomLogin();

        if (response.data) {
          const data = response.data;
          setSelectedTheme(data.theme || "default");
          setSelectedPattern(data.pattern || "gradient");
          setSelectedFont(data.font || "inter");
          setLogoUrl(data.logoUrl || "");
          setShowPoweredBy(data.showPoweredBy ?? true);
          setSocialButtons(data.showSocialButtons ?? true);
          setRememberDevice(data.showRememberDevice ?? true);
          setCustomCss(data.customCss || "");
          setIsEnabled(data.isEnabled ?? true);
        }

        setStats((prev) => ({ ...prev, lastUpdated: "Just now" }));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load custom login settings");
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

      await brandingApi.updateCustomLogin({
        theme: selectedTheme,
        pattern: selectedPattern,
        font: selectedFont,
        logoUrl,
        showSocialButtons: socialButtons,
        showRememberDevice: rememberDevice,
        showPoweredBy: showPoweredBy,
        customCss,
        isEnabled,
      });

      setSuccess("Settings saved successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const currentTheme = colorThemes.find((t) => t.id === selectedTheme);
  const currentPattern = backgroundPatterns.find((p) => p.id === selectedPattern);

  const deviceWidths = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

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
                <h1 className="text-2xl font-semibold tracking-tight">Identity Custom Login</h1>
                <p className="text-muted-foreground">Customize the appearance of your login pages.</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Enabled</p>
                  <p className="text-3xl font-bold tracking-tight">Yes</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Templates</p>
                  <p className="text-3xl font-bold tracking-tight">3</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p className="text-xl font-bold tracking-tight">2h ago</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Eye className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Preview</p>
                  <p className="text-xl font-bold tracking-tight">Live</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Monitor className="h-6 w-6 text-foreground" />
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
                      <CardTitle className="text-base font-semibold">Login Page Settings</CardTitle>
                      <CardDescription>Configure your custom login experience</CardDescription>
                    </div>
                  </div>
                  <TabsList className="mt-4">
                    <TabsTrigger value="branding">Branding</TabsTrigger>
                    <TabsTrigger value="colors">Colors</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>
                </CardHeader>

                <CardContent>
                  <TabsContent value="branding" className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Logo</Label>
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
                        <Label>Background Pattern</Label>
                        <div className="grid grid-cols-5 gap-2">
                          {backgroundPatterns.map((pattern) => (
                            <button
                              key={pattern.id}
                              onClick={() => setSelectedPattern(pattern.id)}
                              className={cn(
                                "h-16 rounded-lg border-2 transition-all hover:scale-105",
                                selectedPattern === pattern.id
                                  ? "border-primary ring-2 ring-primary/20"
                                  : "border-border",
                                pattern.preview
                              )}
                              title={pattern.name}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Selected: {currentPattern?.name}
                        </p>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label>Font Family</Label>
                        <Select value={selectedFont} onValueChange={setSelectedFont}>
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fontOptions.map((font) => (
                              <SelectItem key={font.id} value={font.id}>
                                <span className={font.preview}>{font.name}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="colors" className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Color Theme</Label>
                        <div className="grid grid-cols-3 gap-3">
                          {colorThemes.map((theme) => (
                            <button
                              key={theme.id}
                              onClick={() => setSelectedTheme(theme.id)}
                              className={cn(
                                "flex items-center gap-3 p-3 rounded-lg border-2 transition-all hover:scale-[1.02]",
                                selectedTheme === theme.id
                                  ? "border-primary ring-2 ring-primary/20"
                                  : "border-border"
                              )}
                            >
                              <div
                                className="h-8 w-8 rounded-full"
                                style={{ backgroundColor: theme.accent }}
                              />
                              <div className="flex-1 text-left">
                                <p className="text-sm font-medium">{theme.name}</p>
                                <p className="text-xs text-muted-foreground">Primary</p>
                              </div>
                              {selectedTheme === theme.id && (
                                <Check className="h-4 w-4 text-primary" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Primary Color</Label>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-10 w-10 rounded-lg border"
                              style={{ backgroundColor: currentTheme?.primary }}
                            />
                            <Input
                              type="color"
                              value={currentTheme?.primary}
                              className="w-20 h-10 p-1"
                              readOnly
                            />
                            <Input
                              value={currentTheme?.primary}
                              className="flex-1 font-mono"
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Accent Color</Label>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-10 w-10 rounded-lg border"
                              style={{ backgroundColor: currentTheme?.accent }}
                            />
                            <Input
                              type="color"
                              value={currentTheme?.accent}
                              className="w-20 h-10 p-1"
                              readOnly
                            />
                            <Input
                              value={currentTheme?.accent}
                              className="flex-1 font-mono"
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="content" className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Social Login Buttons</Label>
                          <p className="text-sm text-muted-foreground">
                            Display social connection options on login page
                          </p>
                        </div>
                        <Switch checked={socialButtons} onCheckedChange={setSocialButtons} />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Remember Device</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow users to remember their device
                          </p>
                        </div>
                        <Switch checked={rememberDevice} onCheckedChange={setRememberDevice} />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Show "Powered by Aether Identity"</Label>
                          <p className="text-sm text-muted-foreground">
                            Display branding footer on login page
                          </p>
                        </div>
                        <Switch checked={showPoweredBy} onCheckedChange={setShowPoweredBy} />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Custom CSS</Label>
                        <textarea
                          value={customCss}
                          onChange={(e) => setCustomCss(e.target.value)}
                          className="min-h-50 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder=".login-container { ... }"
                        />
                        <p className="text-xs text-muted-foreground">
                          Add custom CSS to further customize the login page appearance.
                        </p>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label>JSON Configuration</Label>
                        <textarea
                          className="min-h-37.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          readOnly
                          value={JSON.stringify(
                            {
                              theme: selectedTheme,
                              pattern: selectedPattern,
                              font: selectedFont,
                              logo: logoUrl || null,
                              socialButtons,
                              rememberDevice,
                              showPoweredBy,
                            },
                            null,
                            2
                          )}
                        />
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
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Preview</CardTitle>
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
                <CardDescription>Live preview of your login page</CardDescription>
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
                      className={cn("h-64 p-6 flex flex-col", currentPattern?.preview)}
                      style={{
                        backgroundColor: selectedPattern === "none" ? "#fafafa" : undefined,
                      }}
                    >
                      {logoUrl && (
                        <img src={logoUrl} alt="Logo" className="h-8 w-auto object-contain mb-6" />
                      )}
                      <div className="flex-1 flex items-center justify-center">
                        <div className="w-full max-w-xs space-y-4">
                          <div className="h-8 bg-foreground/10 rounded w-3/4 mx-auto" />
                          <div className="space-y-2">
                            <div className="h-10 bg-background rounded-lg border" />
                            <div className="h-10 bg-background rounded-lg border" />
                          </div>
                          <Button
                            className="w-full"
                            style={{ backgroundColor: currentTheme?.accent }}
                          >
                            Sign In
                          </Button>
                          {socialButtons && (
                            <div className="flex gap-2 pt-2">
                              <div className="flex-1 h-8 bg-muted rounded" />
                              <div className="flex-1 h-8 bg-muted rounded" />
                            </div>
                          )}
                        </div>
                      </div>
                      {showPoweredBy && (
                        <p className="text-xs text-center text-muted-foreground mt-4">
                          Powered by Aether Identity
                        </p>
                      )}
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
                  <Eye className="h-4 w-4 mr-2" />
                  Open Full Preview
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Palette className="h-4 w-4 mr-2" />
                  Import Theme
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <LayoutTemplate className="h-4 w-4 mr-2" />
                  Browse Templates
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        </>
      )}
    </div>
  );
}
