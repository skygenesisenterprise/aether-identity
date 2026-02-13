import { ContextOverview } from "@/components/dashboard/context-overview";
import { MetricCard } from "@/components/dashboard/metric-card";
import { SecurityPosture } from "@/components/dashboard/security-posture";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { SystemHealthWidget } from "@/components/dashboard/system-health-widget";
import { SecurityScoreWidget } from "@/components/dashboard/security-score-widget";
import { AlertsBanner } from "@/components/dashboard/alerts-banner";
import { RecentChangesList } from "@/components/dashboard/recent-changes-list";
import { PendingReviewsList } from "@/components/dashboard/pending-reviews-list";
import { SystemUpdatesWidget } from "@/components/dashboard/system-updates-widget";
import { Users, UserCheck, Mail, UserMinus, ShieldAlert } from "lucide-react";

// ============================================================================
// MOCK DATA - Dashboard State
// ============================================================================

const contextData = {
  authority: "Acme Corporation",
  workspace: "Production",
  environment: "US-East",
  role: "Identity Administrator",
  accessLevel: "Full administrative access",
  userRole: "Identity Admin",
  isPrivileged: true,
  lastLogin: "Today, 9:42 AM",
};

const systemHealthData = {
  status: "degraded" as const,
  uptime: "45d 12h 34m",
  components: {
    total: 5,
    healthy: 4,
    degraded: 1,
    critical: 0,
  },
  lastCheck: "2s ago",
};

const securityScoreData = {
  score: 82,
  trend: "up" as const,
  previousScore: 78,
  criticalFindings: 1,
};

const alertsData = [
  {
    id: "alert-001",
    severity: "critical" as const,
    category: "security" as const,
    title: "Multiple failed login attempts detected",
    description: "5 failed attempts from unusual location (IP: 192.168.1.100)",
    timestamp: "3 minutes ago",
    actionRequired: true,
  },
  {
    id: "alert-002",
    severity: "high" as const,
    category: "system" as const,
    title: "Message queue consumer lag detected",
    timestamp: "15 minutes ago",
    actionRequired: true,
  },
  {
    id: "alert-003",
    severity: "medium" as const,
    category: "compliance" as const,
    title: "Password policy review recommended",
    timestamp: "2 hours ago",
    actionRequired: false,
  },
];

const metricsData = {
  totalUsers: 2847,
  activeUsers: 2134,
  pendingInvitations: 23,
  dormantAccounts: 156,
  privilegedAccounts: 42,
};

const securityData = {
  mfaAdoptionRate: 87,
  flaggedIdentities: 3,
  securityScore: 82,
  recentChanges: [
    {
      description: "Password policy updated to require 14 characters minimum",
      timestamp: "2 hours ago",
      type: "policy" as const,
    },
    {
      description: "SSO configuration modified for Azure AD integration",
      timestamp: "Yesterday",
      type: "access" as const,
    },
    {
      description: "New privileged role created: Security Auditor",
      timestamp: "3 days ago",
      type: "role" as const,
    },
  ],
  riskIndicators: {
    highRiskUsers: 5,
    failedLogins24h: 23,
    anomalousActivities: 2,
  },
};

const activityData = [
  {
    id: "1",
    type: "login" as const,
    title: "Successful authentication",
    description: "User john.smith@acme.com authenticated via SSO",
    timestamp: "2 minutes ago",
    user: "john.smith@acme.com",
  },
  {
    id: "2",
    type: "role_change" as const,
    title: "Role assignment modified",
    description: "User sarah.jones@acme.com elevated to Security Reviewer role",
    timestamp: "15 minutes ago",
    user: "admin@acme.com",
    isHighlight: true,
  },
  {
    id: "3",
    type: "provisioning" as const,
    title: "User provisioned",
    description:
      "New user michael.chen@acme.com created and assigned to Engineering workspace",
    timestamp: "1 hour ago",
    user: "hr-sync@acme.com",
  },
  {
    id: "4",
    type: "integration" as const,
    title: "SCIM sync completed",
    description: "Synchronized 847 users from Okta directory",
    timestamp: "2 hours ago",
  },
  {
    id: "5",
    type: "audit" as const,
    title: "Failed login attempts detected",
    description:
      "3 failed attempts for user david.lee@acme.com from unusual location",
    timestamp: "3 hours ago",
    isHighlight: true,
  },
];

const recentChangesData = [
  {
    id: "chg-001",
    type: "policy" as const,
    description: "Updated password policy to require 14 characters",
    actor: "admin@acme.com",
    timestamp: "2 hours ago",
    severity: "normal" as const,
  },
  {
    id: "chg-002",
    type: "access" as const,
    description: "Modified Azure AD SSO configuration",
    actor: "system",
    timestamp: "Yesterday",
    severity: "high" as const,
  },
  {
    id: "chg-003",
    type: "role" as const,
    description: "Created new Security Auditor role",
    actor: "security@acme.com",
    timestamp: "3 days ago",
    severity: "normal" as const,
  },
  {
    id: "chg-004",
    type: "system" as const,
    description: "Upgraded identity engine to v2.4.1",
    actor: "system",
    timestamp: "1 week ago",
    severity: "normal" as const,
  },
];

const pendingReviewsData = [
  {
    id: "rev-001",
    type: "access_request" as const,
    requester: "jane.doe@acme.com",
    description: "Requesting access to Production environment",
    requestedAt: "1 hour ago",
    priority: "high" as const,
  },
  {
    id: "rev-002",
    type: "role_assignment" as const,
    requester: "manager@acme.com",
    description: "Elevate user to Database Admin role",
    requestedAt: "3 hours ago",
    priority: "medium" as const,
  },
];

const systemUpdatesData = [
  {
    id: "upd-001",
    version: "2.4.2",
    type: "security" as const,
    severity: "critical" as const,
    releaseDate: "Today",
    description:
      "Security patch addressing CVE-2025-XXXX in authentication module",
    size: "45 MB",
    status: "available" as const,
  },
  {
    id: "upd-002",
    version: "2.5.0",
    type: "feature" as const,
    severity: "medium" as const,
    releaseDate: "2 days ago",
    description: "Major feature release with new RBAC capabilities",
    size: "128 MB",
    status: "available" as const,
  },
  {
    id: "upd-003",
    version: "2.4.1-hotfix1",
    type: "patch" as const,
    severity: "low" as const,
    releaseDate: "1 week ago",
    description: "Minor bug fixes and performance improvements",
    size: "12 MB",
    status: "completed" as const,
  },
];

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function DashboardPage() {
  // Mock user role - in production this would come from auth context
  const userRole = "superadmin" as const;
  const userScopes = [
    "admin:users:read",
    "admin:users:write",
    "admin:security:read",
    "admin:security:write",
    "admin:system:read",
    "admin:audit:read",
    "admin:settings:read",
  ];

  return (
    <div className="space-y-6 text-foreground">
      {/* =========================================================================
          HEADER SECTION
          Context and navigation anchor
          ========================================================================= */}
      <div>
        <h1 className="text-2xl font-semibold text-card-foreground">
          Aether Identity | Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Identity and access management overview for your workspace
        </p>
      </div>

      {/* Context Overview Bar */}
      <ContextOverview
        authority={contextData.authority}
        workspace={contextData.workspace}
        role={contextData.role}
        accessLevel={contextData.accessLevel}
        isPrivileged={contextData.isPrivileged}
        lastLogin={contextData.lastLogin}
      />

      {/* =========================================================================
          SECTION 1: PLATFORM STATUS
          Critical priority - System health and alerts
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Platform Status
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SystemHealthWidget {...systemHealthData} />
          <SecurityScoreWidget {...securityScoreData} />
          <AlertsBanner alerts={alertsData} maxDisplay={3} />
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: SECURITY POSTURE
          High priority - Identity metrics and security overview
          ========================================================================= */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Security & Identity
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Identity Metrics - 5 columns on large screens */}
          <div className="lg:col-span-5 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <MetricCard
                title="Total Users"
                value={metricsData.totalUsers}
                icon={Users}
                trend={{ value: 4.2, isPositive: true }}
              />
              <MetricCard
                title="Active Users"
                value={metricsData.activeUsers}
                subtitle="Last 30 days"
                icon={UserCheck}
                variant="accent"
              />
              <MetricCard
                title="Pending Invites"
                value={metricsData.pendingInvitations}
                subtitle="Awaiting acceptance"
                icon={Mail}
              />
              <MetricCard
                title="Dormant Accounts"
                value={metricsData.dormantAccounts}
                subtitle="90+ days inactive"
                icon={UserMinus}
                variant="warning"
              />
              <MetricCard
                title="Privileged Accounts"
                value={metricsData.privilegedAccounts}
                subtitle="Elevated access"
                icon={ShieldAlert}
                variant="destructive"
              />
            </div>
          </div>

          {/* Security Posture - 7 columns on large screens */}
          <div className="lg:col-span-7">
            <SecurityPosture
              mfaAdoptionRate={securityData.mfaAdoptionRate}
              flaggedIdentities={securityData.flaggedIdentities}
              securityScore={securityData.securityScore}
              recentChanges={securityData.recentChanges}
              riskIndicators={securityData.riskIndicators}
            />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: OPERATIONAL ACTIVITY
          Medium priority - Activity feed and quick actions
          ========================================================================= */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Activity & Operations
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Feed - Takes 2 columns */}
          <div className="lg:col-span-2">
            <ActivityFeed events={activityData} />
          </div>

          {/* Quick Actions - Takes 1 column */}
          <div className="lg:col-span-1">
            <QuickActions userRole={userRole} userScopes={userScopes} />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: ADMIN OPERATIONS (SUPERADMIN ONLY)
          Standard priority - Recent changes, pending reviews, system updates
          ========================================================================= */}
      {userRole === "superadmin" && (
        <section className="space-y-4">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Administration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RecentChangesList changes={recentChangesData} maxDisplay={4} />
            <PendingReviewsList reviews={pendingReviewsData} maxDisplay={3} />
            <SystemUpdatesWidget updates={systemUpdatesData} />
          </div>
        </section>
      )}
    </div>
  );
}
