"use client";

import { useState } from "react";
import {
  LayoutTemplate,
  Eye,
  Save,
  RotateCcw,
  Upload,
  Monitor,
  Smartphone,
  Tablet,
  Check,
  Copy,
  Download,
  Trash2,
  Edit3,
  Plus,
  FileText,
  Palette,
  Grid3X3,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface PageTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail?: string;
  isDefault: boolean;
  isActive: boolean;
  usageCount: number;
}

const templateCategories = [
  { id: "all", name: "All Templates" },
  { id: "login", name: "Login Pages" },
  { id: "signup", name: "Signup Pages" },
  { id: "password", name: "Password Reset" },
  { id: "error", name: "Error Pages" },
  { id: "mfa", name: "MFA Pages" },
];

const mockTemplates: PageTemplate[] = [
  {
    id: "classic-login",
    name: "Classic Login",
    description: "Traditional centered card layout with company branding",
    category: "login",
    isDefault: true,
    isActive: true,
    usageCount: 8432,
  },
  {
    id: "modern-split",
    name: "Modern Split",
    description: "Full-screen split layout with background image",
    category: "login",
    isDefault: false,
    isActive: true,
    usageCount: 2156,
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    description: "Clean, minimal design with focus on simplicity",
    category: "login",
    isDefault: false,
    isActive: true,
    usageCount: 1890,
  },
  {
    id: "enterprise-pro",
    name: "Enterprise Pro",
    description: "Professional design with advanced security options",
    category: "login",
    isDefault: false,
    isActive: true,
    usageCount: 945,
  },
  {
    id: "social-focused",
    name: "Social Focus",
    description: "Emphasizes social login options prominently",
    category: "login",
    isDefault: false,
    isActive: true,
    usageCount: 678,
  },
  {
    id: "classic-signup",
    name: "Classic Signup",
    description: "Traditional centered signup form",
    category: "signup",
    isDefault: true,
    isActive: true,
    usageCount: 6234,
  },
  {
    id: "stepped-signup",
    name: "Stepped Signup",
    description: "Multi-step registration with progress indicator",
    category: "signup",
    isDefault: false,
    isActive: true,
    usageCount: 1456,
  },
  {
    id: "password-reset",
    name: "Password Reset",
    description: "Standard password reset flow",
    category: "password",
    isDefault: true,
    isActive: true,
    usageCount: 3456,
  },
  {
    id: "mfa-code",
    name: "MFA Code Entry",
    description: "Simple code entry for 2FA",
    category: "mfa",
    isDefault: true,
    isActive: true,
    usageCount: 4567,
  },
];

const previewDevices = [
  { id: "desktop", name: "Desktop", icon: Monitor },
  { id: "tablet", name: "Tablet", icon: Tablet },
  { id: "mobile", name: "Mobile", icon: Smartphone },
];

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState("library");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate | null>(null);
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [searchQuery, setSearchQuery] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");

  const filteredTemplates = mockTemplates.filter((template) => {
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActive = showInactive || template.isActive;
    return matchesCategory && matchesSearch && matchesActive;
  });

  const deviceWidths = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "login":
        return <FileText className="h-4 w-4" />;
      case "signup":
        return <Plus className="h-4 w-4" />;
      case "password":
        return <Edit3 className="h-4 w-4" />;
      case "mfa":
        return <Grid3X3 className="h-4 w-4" />;
      case "error":
        return <FileText className="h-4 w-4" />;
      default:
        return <LayoutTemplate className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="px-6 py-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">Page Templates</h1>
            <p className="text-muted-foreground">
              Manage and customize login page templates for your applications
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
                  <p className="text-sm font-medium text-muted-foreground">Total Templates</p>
                  <p className="text-3xl font-bold tracking-tight">{mockTemplates.length}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Active Templates</p>
                  <p className="text-3xl font-bold tracking-tight">
                    {mockTemplates.filter((t) => t.isActive).length}
                  </p>
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
                  <p className="text-sm font-medium text-muted-foreground">Total Usage</p>
                  <p className="text-3xl font-bold tracking-tight">
                    {mockTemplates.reduce((acc, t) => acc + t.usageCount, 0).toLocaleString()}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Grid3X3 className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Custom Templates</p>
                  <p className="text-3xl font-bold tracking-tight">3</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Palette className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="library">Template Library</TabsTrigger>
            <TabsTrigger value="create">Create Template</TabsTrigger>
            <TabsTrigger value="defaults">Default Settings</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="library" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Input
                        placeholder="Search templates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                      <LayoutTemplate className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {templateCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="show-inactive"
                        checked={showInactive}
                        onCheckedChange={setShowInactive}
                      />
                      <Label htmlFor="show-inactive" className="text-sm">
                        Show inactive
                      </Label>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {filteredTemplates.map((template) => (
                      <Card
                        key={template.id}
                        className={cn(
                          "cursor-pointer transition-all hover:shadow-md",
                          selectedTemplate?.id === template.id && "ring-2 ring-primary"
                        )}
                        onClick={() => setSelectedTemplate(template)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="h-16 w-24 rounded-lg bg-muted flex items-center justify-center shrink-0">
                              <LayoutTemplate className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium truncate">{template.name}</p>
                                {template.isDefault && (
                                  <Badge variant="secondary" className="text-xs">
                                    Default
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {template.description}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{template.usageCount.toLocaleString()} uses</span>
                                <span>•</span>
                                <span className="capitalize">{template.category}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                            <Button variant="ghost" size="sm" className="h-7">
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              Preview
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7">
                              <Edit3 className="h-3.5 w-3.5 mr-1" />
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 ml-auto">
                              {template.isActive ? (
                                <Badge variant="outline" className="text-xs text-green-600">
                                  Active
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs">
                                  Inactive
                                </Badge>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold">Template Details</CardTitle>
                      {selectedTemplate && (
                        <CardDescription>{selectedTemplate.name} configuration</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedTemplate ? (
                        <>
                          <div className="space-y-2">
                            <Label>Template Name</Label>
                            <Input value={selectedTemplate.name} readOnly />
                          </div>
                          <div className="space-y-2">
                            <Label>Category</Label>
                            <Select value={selectedTemplate.category} disabled>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={selectedTemplate.category}>
                                  {selectedTemplate.category}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Active</Label>
                              <p className="text-sm text-muted-foreground">
                                Template is available for use
                              </p>
                            </div>
                            <Switch checked={selectedTemplate.isActive} disabled />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Default</Label>
                              <p className="text-sm text-muted-foreground">
                                Use as default for category
                              </p>
                            </div>
                            <Switch checked={selectedTemplate.isDefault} disabled />
                          </div>
                          <Separator />
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1">
                              <Download className="h-4 w-4 mr-2" />
                              Export
                            </Button>
                            <Button variant="outline" className="flex-1">
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </Button>
                          </div>
                          <Button
                            variant="outline"
                            className="w-full text-red-600 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Template
                          </Button>
                        </>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <LayoutTemplate className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>Select a template to view details</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold">Preview</CardTitle>
                      <CardDescription>Live preview of selected template</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-1 mb-4">
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
                      <div className="flex justify-center bg-muted/50 rounded-lg p-4 overflow-hidden">
                        <div
                          className="relative bg-background rounded-lg shadow-lg overflow-hidden"
                          style={{
                            width: deviceWidths[previewDevice as keyof typeof deviceWidths],
                            maxWidth: "100%",
                          }}
                        >
                          <div className="min-h-64 p-4 flex flex-col items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
                            <div className="w-full max-w-xs space-y-3 bg-white p-4 rounded-lg shadow-sm">
                              <div className="h-8 w-16 bg-primary/10 rounded mx-auto mb-2" />
                              <div className="h-8 bg-muted rounded-lg" />
                              <div className="h-8 bg-muted rounded-lg" />
                              <div className="h-8 bg-primary rounded-lg" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="create">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Create New Template</CardTitle>
                  <CardDescription>
                    Design a custom login page template for your applications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Template Name</Label>
                      <Input
                        placeholder="My Custom Template"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="login">Login Page</SelectItem>
                          <SelectItem value="signup">Signup Page</SelectItem>
                          <SelectItem value="password">Password Reset</SelectItem>
                          <SelectItem value="mfa">MFA Page</SelectItem>
                          <SelectItem value="error">Error Page</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      placeholder="Describe your template..."
                      value={templateDescription}
                      onChange={(e) => setTemplateDescription(e.target.value)}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium">Start from Template</h3>
                    <div className="grid gap-3 md:grid-cols-3">
                      {mockTemplates.slice(0, 3).map((template) => (
                        <button
                          key={template.id}
                          className="flex flex-col items-start p-4 rounded-lg border-2 transition-all hover:scale-[1.02] hover:border-muted-foreground"
                        >
                          <div className="flex items-center gap-2 w-full">
                            <LayoutTemplate className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{template.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 text-left">
                            {template.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium">Upload Custom Design</h3>
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop your HTML/CSS template here
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Supports .html, .zip files (max 5MB)
                      </p>
                      <Button variant="outline" className="mt-4">
                        Browse Files
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="defaults">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">
                    Default Template Settings
                  </CardTitle>
                  <CardDescription>
                    Configure which templates are used by default for each page type
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {templateCategories.slice(1).map((category) => {
                    const categoryTemplates = mockTemplates.filter(
                      (t) => t.category === category.id
                    );
                    const defaultTemplate = categoryTemplates.find((t) => t.isDefault);
                    return (
                      <div key={category.id} className="space-y-3">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(category.id)}
                          <Label className="font-medium">{category.name}</Label>
                        </div>
                        <Select defaultValue={defaultTemplate?.id}>
                          <SelectTrigger className="w-64">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryTemplates.map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Separator />
                      </div>
                    );
                  })}

                  <div className="flex justify-end gap-2">
                    <Button variant="outline">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset to Defaults
                    </Button>
                    <Button>
                      <Save className="h-4 w-4 mr-2" />
                      Save Defaults
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
