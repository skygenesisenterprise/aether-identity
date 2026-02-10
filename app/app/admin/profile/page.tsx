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
    status: "success",
  },
  {
    id: "evt_002",
    type: "mfa_enabled",
    description: "Two-factor authentication enabled",
    timestamp: "1 month ago",
    status: "success",
  },
  {
    id: "evt_003",
    type: "login",
    description: "New device login from Firefox on Windows",
    timestamp: "3 days ago",
    status: "warning",
  },
];

const permissionsData = [
  {
    category: "User Management",
    permissions: ["Create users", "Edit users", "Delete users", "Assign roles"],
  },
  {
    category: "Security",
    permissions: [
      "View audit logs",
      "Manage MFA settings",
      "Configure SSO",
      "Access security reports",
    ],
  },
  {
    category: "Platform",
    permissions: [
      "Manage integrations",
      "Configure domains",
      "View system health",
      "Manage API keys",
    ],
  },
];

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function ProfilePage() {
  return (
    <div className="space-y-6 text-foreground">
      {/* =========================================================================
          HEADER SECTION
          ========================================================================= */}
      <div>
        <h1 className="text-2xl font-semibold text-card-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account settings, security preferences, and workspace
          information
        </p>
      </div>

      {/* =========================================================================
          PROFILE OVERVIEW CARD
          ========================================================================= */}
      <Card className="border-border bg-card overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Left: Avatar & Basic Info */}
            <div className="p-6 flex items-start gap-4 border-b md:border-b-0 md:border-r border-border">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={userData.avatarUrl}
                  alt={`${userData.firstName} ${userData.lastName}`}
                />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {userData.initials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-card-foreground">
                    {userData.firstName} {userData.lastName}
                  </h2>
                  {userData.isPrivileged && (
                    <Badge className="h-5 px-1.5 text-[10px] bg-amber-500/20 text-amber-400 border-amber-500/30">
                      Privileged
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {userData.email}
                </p>
                <p className="text-sm text-muted-foreground">{userData.role}</p>
                <div className="flex items-center gap-2 pt-1">
                  <Badge variant="secondary" className="text-xs">
                    {userData.department}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    ID: {userData.id}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Right: Context Info */}
            <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-border">
              <div className="p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Building2 className="h-3 w-3" />
                  Organization
                </div>
                <p className="text-sm font-medium text-foreground truncate">
                  {organizationData.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {organizationData.workspace}
                </p>
              </div>

              <div className="p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Crown className="h-3 w-3" />
                  Plan
                </div>
                <p className="text-sm font-medium text-foreground">
                  {organizationData.plan}
                </p>
                <p className="text-xs text-muted-foreground">
                  {organizationData.seats.used} / {organizationData.seats.total}{" "}
                  seats
                </p>
              </div>

              <div className="p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Last Active
                </div>
                <p className="text-sm font-medium text-foreground">
                  {userData.lastLogin}
                </p>
                <p className="text-xs text-muted-foreground">
                  IP: {userData.lastLoginIp}
                </p>
              </div>

              <div className="p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  Security Status
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <p className="text-sm font-medium text-foreground">
                    Protected
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">MFA enabled</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* =========================================================================
          MAIN CONTENT TABS
          ========================================================================= */}
      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
        </TabsList>

        {/* ========================================================================
            ACCOUNT TAB
            ======================================================================== */}
        <TabsContent value="account" className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue={userData.firstName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue={userData.lastName} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue={userData.email} />
              </div>
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile Picture */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile Picture</CardTitle>
              <CardDescription>
                Upload a new avatar or remove your current one
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={userData.avatarUrl}
                    alt={`${userData.firstName} ${userData.lastName}`}
                  />
                  <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                    {userData.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex gap-2">
                  <Button variant="outline">Upload New</Button>
                  <Button
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Account Information</CardTitle>
              <CardDescription>
                Details about your account creation and identifiers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">User ID</span>
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  {userData.id}
                </code>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">
                  Account Created
                </span>
                <span className="text-sm">{userData.accountCreated}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">
                  Department
                </span>
                <span className="text-sm">{userData.department}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========================================================================
            SECURITY TAB
            ======================================================================== */}
        <TabsContent value="security" className="space-y-6">
          {/* Password */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Key className="h-4 w-4" />
                Password
              </CardTitle>
              <CardDescription>
                Change your password to keep your account secure
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
              <div className="flex justify-end">
                <Button>Update Password</Button>
              </div>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Fingerprint className="h-4 w-4" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">2FA is enabled</p>
                    <p className="text-xs text-muted-foreground">
                      Using {userData.mfaMethod}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Regenerate Backup Codes
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                >
                  Disable 2FA
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Active Sessions
              </CardTitle>
              <CardDescription>
                Manage devices that are currently logged into your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {sessionsData.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{session.device}</p>
                        {session.isCurrent && (
                          <Badge variant="secondary" className="text-[10px]">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {session.location} • {session.ip} • {session.lastActive}
                      </p>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  className="text-destructive border-destructive hover:bg-destructive/10"
                >
                  Sign Out All Devices
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Activity Log */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Recent Security Activity
              </CardTitle>
              <CardDescription>
                Log of recent security-related events for your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {securityEventsData.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border"
                >
                  {event.status === "success" ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{event.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========================================================================
            PREFERENCES TAB
            ======================================================================== */}
        <TabsContent value="preferences" className="space-y-6">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  label: "Email notifications",
                  description: "Receive email updates about your account",
                  defaultChecked: true,
                },
                {
                  label: "Security alerts",
                  description: "Get notified about important security events",
                  defaultChecked: true,
                },
                {
                  label: "Product updates",
                  description:
                    "Receive news about new features and improvements",
                  defaultChecked: false,
                },
                {
                  label: "Weekly digest",
                  description: "Get a weekly summary of account activity",
                  defaultChecked: true,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">{item.label}</Label>
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
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize how the interface looks for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    defaultValue={userData.language}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    defaultValue={userData.timezone}
                    readOnly
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========================================================================
            ORGANIZATION TAB
            ======================================================================== */}
        <TabsContent value="organization" className="space-y-6">
          {/* Organization Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Organization Details
              </CardTitle>
              <CardDescription>
                Information about your workspace and subscription
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">
                  Organization Name
                </span>
                <span className="text-sm font-medium">
                  {organizationData.name}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Workspace</span>
                <span className="text-sm font-medium">
                  {organizationData.workspace}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Plan</span>
                <Badge variant="secondary">{organizationData.plan}</Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">
                  Billing Cycle
                </span>
                <span className="text-sm">{organizationData.billingCycle}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">
                  Next Billing Date
                </span>
                <span className="text-sm">
                  {organizationData.nextBillingDate}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Seat Usage */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Seat Usage
              </CardTitle>
              <CardDescription>
                Monitor your organization seat allocation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Seats Used
                </span>
                <span className="text-sm font-medium">
                  {organizationData.seats.used} / {organizationData.seats.total}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{
                    width: `${(organizationData.seats.used / organizationData.seats.total) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {organizationData.seats.total - organizationData.seats.used}{" "}
                seats remaining
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Manage Seats
                </Button>
                <Button variant="outline" size="sm">
                  Upgrade Plan
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Permissions & Access */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Your Permissions
              </CardTitle>
              <CardDescription>
                Access levels and capabilities for your role
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {permissionsData.map((category, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="text-sm font-medium">{category.category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {category.permissions.map((permission, pIndex) => (
                      <Badge key={pIndex} variant="outline" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                  {index < permissionsData.length - 1 && (
                    <Separator className="my-3" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Billing Link */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Billing
              </CardTitle>
              <CardDescription>
                Manage your payment methods and invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full justify-between"
                asChild
              >
                <a href="/admin/billing">
                  <span>Go to Billing</span>
                  <ChevronRight className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
