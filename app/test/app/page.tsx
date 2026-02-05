import { ContextHeader } from "@/components/dashboard/context-header"
import { ContextOverview } from "@/components/dashboard/context-overview"
import { MetricCard } from "@/components/dashboard/metric-card"
import { SecurityPosture } from "@/components/dashboard/security-posture"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { 
  Users, 
  UserCheck, 
  Mail, 
  UserMinus, 
  ShieldAlert 
} from "lucide-react"

// Mock data for the dashboard
const contextData = {
  authority: "Acme Corporation",
  workspace: "Production",
  environment: "US-East",
  role: "Identity Administrator",
  accessLevel: "Full administrative access",
  userRole: "Identity Admin",
  isPrivileged: true,
  lastLogin: "Today, 9:42 AM",
}

const metricsData = {
  totalUsers: 2847,
  activeUsers: 2134,
  pendingInvitations: 23,
  dormantAccounts: 156,
  privilegedAccounts: 42,
}

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
}

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
    description: "New user michael.chen@acme.com created and assigned to Engineering workspace",
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
    description: "3 failed attempts for user david.lee@acme.com from unusual location",
    timestamp: "3 hours ago",
    isHighlight: true,
  },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <ContextHeader
        authority={contextData.authority}
        workspace={contextData.workspace}
        environment={contextData.environment}
        userRole={contextData.userRole}
        isPrivileged={contextData.isPrivileged}
      />

      {/* Main Content */}
      <main className="px-6 py-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Page Title */}
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
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

          {/* Key Metrics */}
          <section>
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
              Identity Metrics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
          </section>

          {/* Main Grid - Security, Activity, Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Security Posture - Takes 1 column */}
            <SecurityPosture
              mfaAdoptionRate={securityData.mfaAdoptionRate}
              flaggedIdentities={securityData.flaggedIdentities}
              securityScore={securityData.securityScore}
              recentChanges={securityData.recentChanges}
            />

            {/* Activity Feed - Takes 1 column */}
            <ActivityFeed events={activityData} />

            {/* Quick Actions - Takes 1 column */}
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  )
}
