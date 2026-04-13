"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Play,
  Pause,
  Trash2,
  Copy,
  Edit,
  ArrowRight,
  Clock,
  Users,
  LogIn,
  Shield,
  UserPlus,
  Lock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Search,
  FormInput,
  LayoutTemplate,
  Variable,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const formTemplates = [
  {
    id: "login-standard",
    name: "Standard Login Form",
    description: "Classic username/password login form",
    icon: LogIn,
    category: "Authentication",
    fields: 2,
    popularity: "popular",
  },
  {
    id: "login-social",
    name: "Social Login Form",
    description: "Login with social providers",
    icon: Users,
    category: "Authentication",
    fields: 0,
    popularity: "popular",
  },
  {
    id: "signup-basic",
    name: "Basic Registration Form",
    description: "Simple user registration with email and password",
    icon: UserPlus,
    category: "Registration",
    fields: 4,
    popularity: "popular",
  },
  {
    id: "mfa-verification",
    name: "MFA Verification Form",
    description: "Multi-factor authentication code entry",
    icon: Shield,
    category: "Security",
    fields: 1,
    popularity: "common",
  },
  {
    id: "password-reset",
    name: "Password Reset Form",
    description: "Password reset request form",
    icon: Lock,
    category: "Security",
    fields: 1,
    popularity: "common",
  },
  {
    id: "custom-profile",
    name: "Profile Update Form",
    description: "Custom form for profile updates",
    icon: FormInput,
    category: "Profile",
    fields: 6,
    popularity: "advanced",
  },
];

const deployedForms = [
  {
    id: "1",
    name: "Customer Portal Login",
    description: "Login form for customer portal",
    status: "active",
    version: "2.1.0",
    lastModified: "2 hours ago",
    action: "Login",
    submissions: 8432,
    errors: 2,
  },
  {
    id: "2",
    name: "Partner Registration",
    description: "Registration form for partner onboarding",
    status: "active",
    version: "1.5.2",
    lastModified: "1 day ago",
    action: "Sign Up",
    submissions: 1245,
    errors: 8,
  },
  {
    id: "3",
    name: "Employee SSO Login",
    description: "SSO login form for employees",
    status: "active",
    version: "3.0.1",
    lastModified: "3 days ago",
    action: "Login",
    submissions: 5200,
    errors: 0,
  },
  {
    id: "4",
    name: "MFA Challenge Form",
    description: "MFA verification for sensitive actions",
    status: "active",
    version: "1.0.0",
    lastModified: "1 week ago",
    action: "MFA",
    submissions: 3156,
    errors: 1,
  },
  {
    id: "5",
    name: "Newsletter Signup",
    description: "Simple email signup for newsletter",
    status: "disabled",
    version: "0.9.8",
    lastModified: "2 weeks ago",
    action: "Sign Up",
    submissions: 0,
    errors: 0,
  },
];

const formStats = [
  { label: "Total Forms", value: "8", change: "+2", trend: "up" },
  { label: "Active Forms", value: "6", change: "+1", trend: "up" },
  { label: "Total Submissions", value: "18.3K", change: "+15.2%", trend: "up" },
  { label: "Error Rate", value: "0.06%", change: "-0.02%", trend: "down" },
];

const fieldTypes = [
  { type: "email", label: "Email", count: 5 },
  { type: "password", label: "Password", count: 4 },
  { type: "text", label: "Text Input", count: 3 },
  { type: "select", label: "Dropdown", count: 2 },
  { type: "checkbox", label: "Checkbox", count: 2 },
  { type: "tel", label: "Phone", count: 1 },
];

export default function ActionsFormsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("deployed");

  const filteredTemplates = formTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredForms = deployedForms.filter((form) => {
    const matchesSearch =
      form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "active" && form.status === "active") ||
      (selectedCategory === "disabled" && form.status === "disabled");
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="px-6 py-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">Identity Actions Forms</h1>
            <p className="text-muted-foreground">
              Create and manage custom forms for authentication flows.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {formStats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <FileText className="h-6 w-6 text-foreground" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <div
                    className={cn(
                      "flex items-center gap-1",
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {stat.trend === "up" ? (
                      <ChevronRight className="h-4 w-4 rotate-90" />
                    ) : (
                      <ChevronRight className="h-4 w-4 -rotate-90" />
                    )}
                    <span className="font-medium">{stat.change}</span>
                  </div>
                  <span className="text-muted-foreground">from last week</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="deployed">Deployed Forms</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="builder">Form Builder</TabsTrigger>
          </TabsList>

          <TabsContent value="deployed" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search forms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Form
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {filteredForms.map((form) => (
                    <div
                      key={form.id}
                      className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <FileText className="h-5 w-5 text-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{form.name}</p>
                          <Badge
                            variant={form.status === "active" ? "outline" : "secondary"}
                            className={cn(
                              "text-xs",
                              form.status === "active" &&
                                "border-green-200 bg-green-50 text-green-700"
                            )}
                          >
                            {form.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{form.description}</p>
                      </div>
                      <div className="hidden flex-col items-end gap-1 md:flex">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{form.lastModified}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>v{form.version}</span>
                          <span>-</span>
                          <span>{form.submissions.toLocaleString()} submissions</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {form.status === "active" ? (
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pause className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Authentication">Authentication</SelectItem>
                  <SelectItem value="Registration">Registration</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Profile">Profile</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="group cursor-pointer transition-all hover:shadow-md"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                        <template.icon className="h-6 w-6 text-foreground" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <p className="font-medium">{template.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
                    </div>
                    <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FormInput className="h-3 w-3" />
                        <span>{template.fields} fields</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {template.popularity === "popular" && (
                          <>
                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                            <span>Popular</span>
                          </>
                        )}
                        {template.popularity === "common" && (
                          <>
                            <Users className="h-3 w-3 text-blue-600" />
                            <span>Common</span>
                          </>
                        )}
                        {template.popularity === "advanced" && (
                          <>
                            <AlertTriangle className="h-3 w-3 text-orange-600" />
                            <span>Advanced</span>
                          </>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 opacity-0 group-hover:opacity-100"
                      >
                        Create
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="builder" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">Form Builder</CardTitle>
                    <CardDescription>Drag and drop form creator</CardDescription>
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Form
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="space-y-4">
                    <div className="text-sm font-medium">Form Fields</div>
                    <div className="flex flex-col gap-2">
                      {fieldTypes.map((field) => (
                        <div
                          key={field.type}
                          className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50 cursor-grab"
                        >
                          <div className="flex items-center gap-2">
                            <Variable className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{field.label}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {field.count}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <div className="rounded-lg border border-dashed p-8 text-center">
                      <LayoutTemplate className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-4 text-sm font-medium">Canvas Area</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Drag fields here to build your form
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Separator />

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Form Analytics</CardTitle>
              <CardDescription>Submission patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deployedForms.slice(0, 3).map((form) => (
                  <div key={form.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-foreground" />
                      <span className="text-sm">{form.name}</span>
                    </div>
                    <span className="text-sm font-mono text-muted-foreground">
                      {form.submissions.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Recent Submissions</CardTitle>
              <CardDescription>Latest form submissions</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {deployedForms.slice(0, 4).map((form, index) => (
                  <div key={index} className="flex items-center gap-3 px-6 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted mt-0.5">
                      {form.errors > 0 ? (
                        <XCircle className="h-4 w-4 text-red-500" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{form.name}</p>
                        <Badge
                          variant={form.errors > 0 ? "destructive" : "outline"}
                          className="text-xs"
                        >
                          {form.errors > 0 ? `${form.errors} errors` : "success"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{form.lastModified}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Need help with Forms?</p>
            <p className="text-sm text-muted-foreground">
              Check our documentation for form customization guides.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="https://docs.aetheridentity.dev/actions/forms" target="_blank">
              Forms Documentation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
