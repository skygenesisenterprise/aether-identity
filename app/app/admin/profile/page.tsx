"use client";

import * as React from "react";
import {
  Shield,
  Key,
  Smartphone,
  Globe,
  Bell,
  Palette,
  Building2,
  Crown,
  Clock,
  Lock,
  Fingerprint,
  CreditCard,
  Users,
  AlertTriangle,
  CheckCircle2,
  LogOut,
  ChevronRight,
  Activity,
  UserCheck,
  Eye,
  FileText,
  Settings,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/dashboard/ui/card";
import { Badge } from "@/components/dashboard/ui/badge";
import { Button } from "@/components/dashboard/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/dashboard/ui/avatar";
import { Separator } from "@/components/dashboard/ui/separator";
import { Switch } from "@/components/dashboard/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/dashboard/ui/tabs";
import { Input } from "@/components/dashboard/ui/input";
import { Label } from "@/components/dashboard/ui/label";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ContextOverview } from "@/components/dashboard/context-overview";
import { Progress } from "@/components/dashboard/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/dashboard/ui/dialog";

// ============================================================================
// MOCK DATA - User Profile State
// ============================================================================

const userData = {
  id: "usr_2vPqN5wX8kL9mJ4h",
  firstName: "Alexandra",
  lastName: "Chen",
  email: "alexandra.chen@acme.com",
  avatarUrl: "",
  initials: "AC",
  role: "Identity Administrator",
  department: "Engineering",
  timezone: "America/New_York",
  language: "English (US)",
  lastLogin: "Today, 9:42 AM",
  lastLoginIp: "192.168.1.45",
  accountCreated: "March 15, 2023",
  isPrivileged: true,
  mfaEnabled: true,
  mfaMethod: "Authenticator App",
};

const organizationData = {
  name: "Acme Corporation",
  workspace: "Production",
  plan: "Enterprise",
  seats: {
    total: 100,
    used: 87,
  },
  billingCycle: "Annual",
  nextBillingDate: "March 15, 2026",
};

const sessionsData = [
  {
    id: "sess_001",
    device: "Chrome on macOS",
    location: "New York, USA",
    ip: "192.168.1.45",
    lastActive: "Current session",
    isCurrent: true,
  },
  {
    id: "sess_002",
    device: "Safari on iPhone",
    location: "New York, USA",
    ip: "192.168.1.78",
    lastActive: "2 hours ago",
    isCurrent: false,
  },
  {
    id: "sess_003",
    device: "Firefox on Windows",
    location: "Boston, USA",
    ip: "10.0.0.23",
    lastActive: "3 days ago",
    isCurrent: false,
  },
];

const securityEventsData = [
  {
    id: "evt_001",
    type: "password_change",
    description: "Password changed successfully",
    timestamp: "2 weeks ago",
    status: "success" as const,
  },
  {
    id: "evt_002",
    type: "mfa_enabled",
    description: "Two-factor authentication enabled",
    timestamp: "1 month ago",
    status: "success" as const,
  },
  {
    id: "evt_003",
    type: "login",
    description: "New device login from Firefox on Windows",
    timestamp: "3 days ago",
    status: "warning" as const,
  },
];

const permissionsData = [
  {
    category: "User Management",
    permissions: ["Create users", "Edit users", "Delete users", "Assign roles"],
    count: 4,
  },
  {
    category: "Security",
    permissions: [
      "View audit logs",
      "Manage MFA settings",
      "Configure SSO",
      "Access security reports",
      "Review access requests",
    ],
    count: 5,
  },
  {
    category: "Platform",
    permissions: [
      "Manage integrations",
      "Configure domains",
      "View system health",
      "Manage API keys",
      "Deploy changes",
    ],
    count: 5,
  },
];

// ============================================================================
// KPI DATA
// ============================================================================

const kpiData = {
  securityScore: {
    value: 92,
    trend: { value: 4, isPositive: true },
    subtitle: "Excellent standing",
  },
  activeSessions: {
    value: 3,
    subtitle: "Across 2 locations",
  },
  permissionsCount: {
    value: 14,
    subtitle: "Across 3 categories",
  },
  recentActivity: {
    value: 12,
    trend: { value: 8, isPositive: false },
    subtitle: "Events this week",
  },
};

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function ProfilePage() {
  const [avatarUrl, setAvatarUrl] = React.useState(userData.avatarUrl);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl("");
  };

  const handleExportData = () => {
    const exportData = {
      user: {
        ...userData,
        avatarUrl: avatarUrl || userData.avatarUrl,
      },
      organization: organizationData,
      sessions: sessionsData,
      securityEvents: securityEventsData,
      permissions: permissionsData,
      exportedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `profile-export-${userData.id}-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-foreground">
      {/* =========================================================================
          HEADER SECTION - Strategic Decision Center
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-card-foreground">
              Aether Identity | Profile & Account
            </h1>
            {userData.isPrivileged && (
              <Badge className="h-6 px-2 text-[11px] bg-amber-500/15 text-amber-500 border-amber-500/30 hover:bg-amber-500/20">
                <Shield className="h-3 w-3 mr-1" />
                Privileged Access
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1.5">
            Central hub for managing your identity, security posture, and
            workspace configuration
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <FileText className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Quick Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Quick Settings</DialogTitle>
                <DialogDescription>
                  Access frequently used settings and configurations
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">
                        Compact Mode
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Reduce spacing for denser content
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">
                        Auto-refresh Data
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically refresh every 5 minutes
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Dark Mode</Label>
                      <p className="text-xs text-muted-foreground">
                        Switch between light and dark theme
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start"
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start"
                      asChild
                    >
                      <a href="/totp/register">
                        <Shield className="h-4 w-4 mr-2" />
                        Setup 2FA
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start"
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Manage Team
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* =========================================================================
          CONTEXT OVERVIEW - Organizational Context
          ========================================================================= */}
      <ContextOverview
        authority={organizationData.name}
        workspace={organizationData.workspace}
        role={userData.role}
        accessLevel="Full administrative access to all workspaces"
        isPrivileged={userData.isPrivileged}
        lastLogin={userData.lastLogin}
      />

      {/* =========================================================================
          KPI CARDS - Strategic Metrics
          ========================================================================= */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Account Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Security Score"
            value={kpiData.securityScore.value}
            subtitle={kpiData.securityScore.subtitle}
            icon={Shield}
            trend={kpiData.securityScore.trend}
            variant="accent"
          />
          <MetricCard
            title="Active Sessions"
            value={kpiData.activeSessions.value}
            subtitle={kpiData.activeSessions.subtitle}
            icon={Globe}
          />
          <MetricCard
            title="Permissions"
            value={kpiData.permissionsCount.value}
            subtitle={kpiData.permissionsCount.subtitle}
            icon={UserCheck}
            variant="default"
          />
          <MetricCard
            title="Recent Activity"
            value={kpiData.recentActivity.value}
            subtitle={kpiData.recentActivity.subtitle}
            icon={Activity}
            trend={kpiData.recentActivity.trend}
            variant="warning"
          />
        </div>
      </section>

      {/* =========================================================================
          PROFILE SUMMARY CARD - Identity Overview
          ========================================================================= */}
      <Card className="border-border bg-card overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Left: Identity Block */}
            <div className="p-6 flex items-start gap-5 border-b md:border-b-0 md:border-r border-border">
              <Avatar className="h-24 w-24 ring-2 ring-border ring-offset-2 ring-offset-background">
                <AvatarImage
                  src={avatarUrl}
                  alt={`${userData.firstName} ${userData.lastName}`}
                />
                <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                  {userData.initials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div>
                  <h2 className="text-xl font-semibold text-card-foreground">
                    {userData.firstName} {userData.lastName}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {userData.email}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {userData.role}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {userData.department}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                  <Clock className="h-3 w-3" />
                  <span>Member since {userData.accountCreated}</span>
                </div>
              </div>
            </div>

            {/* Right: Quick Info Grid */}
            <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-border">
              {/* Organization */}
              <div className="p-5 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Building2 className="h-3 w-3" />
                  Organization
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground truncate">
                    {organizationData.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {organizationData.workspace} Workspace
                  </p>
                </div>
              </div>

              {/* Plan */}
              <div className="p-5 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Crown className="h-3 w-3" />
                  Subscription
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {organizationData.plan}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {organizationData.seats.used}/{organizationData.seats.total}{" "}
                    seats
                  </p>
                </div>
              </div>

              {/* Last Activity */}
              <div className="p-5 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  Last Access
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {userData.lastLogin}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {userData.lastLoginIp}
                  </p>
                </div>
              </div>

              {/* Security Status */}
              <div className="p-5 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  Security
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <p className="text-sm font-medium text-foreground">
                    Protected
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  MFA • {userData.mfaMethod}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* =========================================================================
          MAIN CONTENT TABS - Structured Configuration
          ========================================================================= */}
      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="bg-muted h-10">
          <TabsTrigger value="account" className="text-sm">
            Account
          </TabsTrigger>
          <TabsTrigger value="security" className="text-sm">
            Security
          </TabsTrigger>
          <TabsTrigger value="preferences" className="text-sm">
            Preferences
          </TabsTrigger>
          <TabsTrigger value="organization" className="text-sm">
            Organization
          </TabsTrigger>
        </TabsList>

        {/* =======================================================================
            ACCOUNT TAB - Identity Management
            ======================================================================= */}
        <TabsContent value="account" className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                    Personal Information
                  </CardTitle>
                  <CardDescription className="mt-1.5">
                    Manage your identity details and contact information
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2.5">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    defaultValue={userData.firstName}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    defaultValue={userData.lastName}
                    className="h-10"
                  />
                </div>
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={userData.email}
                  className="h-10"
                />
                <p className="text-xs text-muted-foreground">
                  This email is used for notifications and authentication
                </p>
              </div>
              <div className="flex justify-end pt-2">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Picture */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Profile Picture</CardTitle>
                <CardDescription className="mt-1.5">
                  Upload a new avatar or manage your current one
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-5">
                  <Avatar className="h-20 w-20 ring-2 ring-border">
                    <AvatarImage
                      src={avatarUrl}
                      alt={`${userData.firstName} ${userData.lastName}`}
                    />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {userData.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/jpeg,image/png,image/gif"
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleUploadClick}
                      >
                        Upload New
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={handleRemoveAvatar}
                        disabled={!avatarUrl}
                      >
                        Remove
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG or GIF. Max 2MB.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Metadata */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Account Details</CardTitle>
                <CardDescription className="mt-1.5">
                  Technical identifiers and account metadata
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center py-2.5 border-b border-border">
                  <span className="text-sm text-muted-foreground">User ID</span>
                  <code className="text-sm bg-muted px-2.5 py-1 rounded font-mono">
                    {userData.id}
                  </code>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-border">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm font-medium">
                    {userData.accountCreated}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-border">
                  <span className="text-sm text-muted-foreground">
                    Department
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {userData.department}
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-2.5">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium">Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* =======================================================================
            SECURITY TAB - Security Management
            ======================================================================= */}
        <TabsContent value="security" className="space-y-6">
          {/* Security Status Banner */}
          <Card className="bg-emerald-500/5 border-emerald-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <Shield className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-emerald-700">
                    Your account is well protected
                  </h3>
                  <p className="text-sm text-emerald-600/80 mt-0.5">
                    You have enabled all recommended security features. Security
                    score: 92/100
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 border-emerald-500/30"
                >
                  View Report
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Password */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  Password
                </CardTitle>
                <CardDescription className="mt-1.5">
                  Update your password to maintain account security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Enter current password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <Button>Update Password</Button>
                </div>
              </CardContent>
            </Card>

            {/* Two-Factor Authentication */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Fingerprint className="h-4 w-4 text-muted-foreground" />
                  Two-Factor Authentication
                </CardTitle>
                <CardDescription className="mt-1.5">
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-emerald-500/15 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">2FA is enabled</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Method: {userData.mfaMethod}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30">
                    Active
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href="/totp/register">Configure</a>
                  </Button>
                  <Button variant="outline" size="sm">
                    Backup Codes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Sessions */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                Active Sessions
              </CardTitle>
              <CardDescription className="mt-1.5">
                Manage devices currently logged into your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {sessionsData.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">
                          {session.device}
                        </p>
                        {session.isCurrent && (
                          <Badge variant="secondary" className="text-[10px]">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {session.location} • {session.ip}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.lastActive}
                      </p>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <LogOut className="h-4 w-4 mr-1.5" />
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
              <div className="flex justify-end pt-3">
                <Button
                  variant="outline"
                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out All Devices
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Activity Log */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                Security Activity Log
              </CardTitle>
              <CardDescription className="mt-1.5">
                Recent security events and account changes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {securityEventsData.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                >
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                      event.status === "success"
                        ? "bg-emerald-500/15"
                        : "bg-amber-500/15"
                    }`}
                  >
                    {event.status === "success" ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{event.description}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {event.timestamp}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      event.status === "success"
                        ? "text-emerald-600 border-emerald-500/30"
                        : "text-amber-600 border-amber-500/30"
                    }
                  >
                    {event.status === "success" ? "Success" : "Warning"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* =======================================================================
            PREFERENCES TAB - Personalization
            ======================================================================= */}
        <TabsContent value="preferences" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Notifications */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  Notifications
                </CardTitle>
                <CardDescription className="mt-1.5">
                  Choose how and when you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                {[
                  {
                    label: "Security alerts",
                    description:
                      "Critical security events and suspicious activities",
                    defaultChecked: true,
                    critical: true,
                  },
                  {
                    label: "Account updates",
                    description:
                      "Changes to your account settings and permissions",
                    defaultChecked: true,
                  },
                  {
                    label: "Team activity",
                    description: "Updates about your team and workspace",
                    defaultChecked: true,
                  },
                  {
                    label: "Product updates",
                    description:
                      "New features, improvements, and announcements",
                    defaultChecked: false,
                  },
                  {
                    label: "Weekly digest",
                    description:
                      "Weekly summary of account activity and metrics",
                    defaultChecked: true,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3.5 border-b border-border last:border-0"
                  >
                    <div className="space-y-0.5 pr-4">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium">
                          {item.label}
                        </Label>
                        {item.critical && (
                          <Badge
                            variant="outline"
                            className="text-[10px] text-destructive border-destructive/30"
                          >
                            Recommended
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <Switch defaultChecked={item.defaultChecked} />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                  Appearance & Language
                </CardTitle>
                <CardDescription className="mt-1.5">
                  Customize your interface experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2.5">
                  <Label htmlFor="language">Display Language</Label>
                  <Input
                    id="language"
                    defaultValue={userData.language}
                    readOnly
                    className="bg-muted/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Contact support to change your language preference
                  </p>
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    defaultValue={userData.timezone}
                    readOnly
                    className="bg-muted/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Automatically detected from your location
                  </p>
                </div>
                <Separator />
                <div className="space-y-3">
                  <Label>Interface Density</Label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Compact
                    </Button>
                    <Button variant="default" size="sm" className="flex-1">
                      Default
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Comfortable
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* =======================================================================
            ORGANIZATION TAB - Workspace Management
            ======================================================================= */}
        <TabsContent value="organization" className="space-y-6">
          {/* Organization Overview */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    Organization Overview
                  </CardTitle>
                  <CardDescription className="mt-1.5">
                    Workspace information and subscription details
                  </CardDescription>
                </div>
                <Badge variant="secondary">{organizationData.plan}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/30 space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Organization
                  </p>
                  <p className="text-sm font-semibold">
                    {organizationData.name}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Workspace
                  </p>
                  <p className="text-sm font-semibold">
                    {organizationData.workspace}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Billing Cycle
                  </p>
                  <p className="text-sm font-semibold">
                    {organizationData.billingCycle}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Next Billing
                  </p>
                  <p className="text-sm font-semibold">
                    {organizationData.nextBillingDate}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Seat Usage */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Seat Allocation
                </CardTitle>
                <CardDescription className="mt-1.5">
                  Monitor organization seat usage and availability
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-semibold">
                      {organizationData.seats.used}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      of {organizationData.seats.total} seats used
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-emerald-600">
                      {organizationData.seats.total -
                        organizationData.seats.used}
                    </p>
                    <p className="text-sm text-muted-foreground">available</p>
                  </div>
                </div>
                <Progress
                  value={
                    (organizationData.seats.used /
                      organizationData.seats.total) *
                    100
                  }
                  className="h-2"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {Math.round(
                      (organizationData.seats.used /
                        organizationData.seats.total) *
                        100,
                    )}
                    % utilized
                  </span>
                  <span>
                    {organizationData.seats.total - organizationData.seats.used}{" "}
                    remaining
                  </span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Manage Seats
                  </Button>
                  <Button variant="default" size="sm" className="flex-1">
                    Upgrade Plan
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Billing Link */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  Billing & Payments
                </CardTitle>
                <CardDescription className="mt-1.5">
                  Manage payment methods, invoices, and subscription
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Payment Method</p>
                        <p className="text-xs text-muted-foreground">
                          Visa ending in 4242
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-emerald-600 border-emerald-500/30"
                    >
                      Active
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  asChild
                >
                  <a href="/admin/billing">
                    <span>Go to Billing Center</span>
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Permissions & Access */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                Your Permissions & Access Levels
              </CardTitle>
              <CardDescription className="mt-1.5">
                Capabilities and permissions associated with your role
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {permissionsData.map((category, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">
                      {category.category}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {category.count} permissions
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.permissions.map((permission, pIndex) => (
                      <Badge
                        key={pIndex}
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        {permission}
                      </Badge>
                    ))}
                  </div>
                  {index < permissionsData.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
