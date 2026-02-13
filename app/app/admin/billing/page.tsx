"use client";

import { SubscriptionCard } from "@/components/billing/subscription-card";
import { UsageStats } from "@/components/billing/usage-stats";
import { PaymentMethods } from "@/components/billing/payment-methods";
import {
  InvoiceHistory,
  type Invoice,
} from "@/components/billing/invoice-history";
import {
  BillingInfo,
  type BillingAddress,
} from "@/components/billing/billing-info";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/dashboard/ui/progress";
import { cn } from "@/lib/utils";
import {
  Users,
  Fingerprint,
  Zap,
  Database,
  Receipt,
  Calendar,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  FileText,
  Building2,
  Mail,
  HelpCircle,
} from "lucide-react";

// ============================================================================
// TYPES & CONFIGURATION
// ============================================================================

interface UsageMetric {
  id: string;
  name: string;
  icon: typeof Users;
  used: number;
  limit: number;
  unit: string;
  warningThreshold: number;
}

interface PaymentMethod {
  id: string;
  type: "card" | "bank_transfer";
  brand?: string;
  last4: string;
  expMonth?: number;
  expYear?: number;
  isDefault: boolean;
  status: "active" | "expiring_soon";
}

// ============================================================================
// MOCK DATA - Billing State
// ============================================================================

const subscriptionData = {
  plan: {
    name: "Professional",
    tier: "professional" as const,
    price: 79,
    interval: "monthly" as const,
    status: "active" as const,
    currentPeriodStart: "Feb 1, 2025",
    currentPeriodEnd: "Mar 1, 2025",
    nextBillingDate: "Mar 1, 2025",
    daysUntilRenewal: 17,
  },
  features: [
    "Up to 5,000 users",
    "Unlimited identities",
    "Priority support",
    "SSO & SCIM provisioning",
    "Advanced analytics",
    "Custom domains",
    "99.9% SLA",
    "API access",
  ],
};

const usageData = {
  metrics: [
    {
      id: "users",
      name: "Active Users",
      icon: Users,
      used: 2847,
      limit: 5000,
      unit: "users",
      warningThreshold: 80,
    },
    {
      id: "identities",
      name: "Identities",
      icon: Fingerprint,
      used: 8934,
      limit: 10000,
      unit: "identities",
      warningThreshold: 85,
    },
    {
      id: "api",
      name: "API Calls",
      icon: Zap,
      used: 450000,
      limit: 500000,
      unit: "calls/month",
      warningThreshold: 90,
    },
    {
      id: "storage",
      name: "Audit Log Storage",
      icon: Database,
      used: 45,
      limit: 100,
      unit: "GB",
      warningThreshold: 80,
    },
  ],
};

const paymentMethodsData: PaymentMethod[] = [
  {
    id: "pm_001",
    type: "card",
    brand: "visa",
    last4: "4242",
    expMonth: 12,
    expYear: 2026,
    isDefault: true,
    status: "active",
  },
  {
    id: "pm_002",
    type: "card",
    brand: "mastercard",
    last4: "8888",
    expMonth: 8,
    expYear: 2025,
    isDefault: false,
    status: "expiring_soon",
  },
];

const invoicesData: Invoice[] = [
  {
    id: "inv_001",
    number: "INV-2025-002",
    date: "2025-02-01",
    amount: 79.0,
    currency: "usd",
    status: "paid",
    description: "Professional Plan - Monthly",
  },
  {
    id: "inv_002",
    number: "INV-2025-001",
    date: "2025-01-01",
    amount: 79.0,
    currency: "usd",
    status: "paid",
    description: "Professional Plan - Monthly",
  },
  {
    id: "inv_003",
    number: "INV-2024-012",
    date: "2024-12-01",
    amount: 79.0,
    currency: "usd",
    status: "paid",
    description: "Professional Plan - Monthly",
  },
  {
    id: "inv_004",
    number: "INV-2024-011",
    date: "2024-11-01",
    amount: 79.0,
    currency: "usd",
    status: "paid",
    description: "Professional Plan - Monthly",
  },
  {
    id: "inv_005",
    number: "INV-2024-010",
    date: "2024-10-01",
    amount: 79.0,
    currency: "usd",
    status: "paid",
    description: "Professional Plan - Monthly",
  },
];

const billingAddressData: BillingAddress = {
  companyName: "Acme Corporation",
  addressLine1: "123 Innovation Drive",
  addressLine2: "Suite 456",
  city: "San Francisco",
  state: "CA",
  postalCode: "94105",
  country: "United States",
  vatNumber: "EU123456789",
  taxId: "12-3456789",
};

const upcomingInvoiceData = {
  date: "Mar 1, 2025",
  amount: 79.0,
  currency: "usd",
  period: "Mar 1 - Apr 1, 2025",
  lineItems: [
    { description: "Professional Plan (Monthly)", amount: 79.0 },
    { description: "Additional API calls (0 overage)", amount: 0 },
    { description: "Additional storage (0 overage)", amount: 0 },
  ],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function calculateBillingHealth(metrics: UsageMetric[]): {
  status: "healthy" | "warning" | "critical";
  label: string;
  percentage: number;
} {
  const criticalCount = metrics.filter(
    (m) => (m.used / m.limit) * 100 >= 100,
  ).length;
  const warningCount = metrics.filter((m) => {
    const pct = (m.used / m.limit) * 100;
    return pct >= m.warningThreshold && pct < 100;
  }).length;

  if (criticalCount > 0) {
    return { status: "critical", label: "Action Required", percentage: 100 };
  }
  if (warningCount > 0) {
    return {
      status: "warning",
      label: `${warningCount} warning${warningCount > 1 ? "s" : ""}`,
      percentage: 75,
    };
  }
  return { status: "healthy", label: "All Systems Normal", percentage: 100 };
}

function getTotalUsagePercentage(metrics: UsageMetric[]): number {
  const totalUsed = metrics.reduce((sum, m) => sum + m.used / m.limit, 0);
  return Math.round((totalUsed / metrics.length) * 100);
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function BillingHealthCard({
  health,
}: {
  health: { status: string; label: string; percentage: number };
}) {
  const statusConfig = {
    healthy: {
      icon: CheckCircle2,
      color: "text-accent",
      bgColor: "bg-accent/10",
      progressColor: "bg-accent",
    },
    warning: {
      icon: AlertCircle,
      color: "text-amber-400",
      bgColor: "bg-amber-400/10",
      progressColor: "bg-amber-400",
    },
    critical: {
      icon: AlertCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      progressColor: "bg-destructive",
    },
  };

  const config = statusConfig[health.status as keyof typeof statusConfig];
  const Icon = config.icon;

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Billing Health
            </p>
            <div className="flex items-center gap-2">
              <p className={cn("text-2xl font-semibold", config.color)}>
                {health.label}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              {health.status === "healthy"
                ? "No issues detected"
                : health.status === "warning"
                  ? "Review usage limits"
                  : "Immediate action required"}
            </p>
          </div>
          <div className={cn("rounded-md p-2", config.bgColor, config.color)}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UpcomingInvoiceCard({
  invoice,
  onViewDetails,
}: {
  invoice: typeof upcomingInvoiceData;
  onViewDetails?: () => void;
}) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Receipt className="h-5 w-5 text-accent" />
              Upcoming Invoice
            </CardTitle>
            <CardDescription className="text-sm mt-1">
              Estimated charges for next billing period
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            {invoice.date}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-foreground">
            ${invoice.amount.toFixed(2)}
          </span>
          <span className="text-sm text-muted-foreground">
            {invoice.currency.toUpperCase()}
          </span>
        </div>

        <div className="space-y-2">
          {invoice.lineItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-muted-foreground">{item.description}</span>
              <span className="font-medium text-foreground">
                ${item.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              Total Estimated
            </span>
            <span className="text-lg font-bold text-foreground">
              ${invoice.amount.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Billing period: {invoice.period}
          </p>
        </div>

        {onViewDetails && (
          <Button variant="outline" className="w-full" size="sm">
            View Invoice Details
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function DaysUntilRenewalCard({ days }: { days: number }) {
  const isUrgent = days <= 7;
  const isWarning = days <= 14;

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Renewal In
            </p>
            <p
              className={cn(
                "text-2xl font-semibold tabular-nums",
                isUrgent
                  ? "text-destructive"
                  : isWarning
                    ? "text-amber-400"
                    : "text-foreground",
              )}
            >
              {days} days
            </p>
            <p className="text-xs text-muted-foreground">
              {isUrgent
                ? "Renewal approaching"
                : isWarning
                  ? "Plan ahead"
                  : "On schedule"}
            </p>
          </div>
          <div
            className={cn(
              "rounded-md p-2",
              isUrgent
                ? "bg-destructive/10 text-destructive"
                : isWarning
                  ? "bg-amber-400/10 text-amber-400"
                  : "bg-secondary text-muted-foreground",
            )}
          >
            <Calendar className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function BillingPage() {
  const billingHealth = calculateBillingHealth(usageData.metrics);
  const totalUsagePercentage = getTotalUsagePercentage(usageData.metrics);
  const hasExpiringCard = paymentMethodsData.some(
    (m) => m.status === "expiring_soon",
  );

  const handleUpgrade = () => {
    console.log("Navigate to upgrade");
  };

  const handleManageSubscription = () => {
    console.log("Manage subscription");
  };

  const handleAddPaymentMethod = () => {
    console.log("Add payment method");
  };

  const handleRemovePaymentMethod = (id: string) => {
    console.log("Remove payment method:", id);
  };

  const handleSetDefaultPaymentMethod = (id: string) => {
    console.log("Set default payment method:", id);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    console.log("Download invoice:", invoice.id);
  };

  const handleSaveBillingInfo = (address: BillingAddress) => {
    console.log("Save billing info:", address);
  };

  return (
    <div className="space-y-6 text-foreground">
      {/* =====================================================================
          HEADER SECTION
          Strategic title with status indicator and quick context
          ===================================================================== */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-semibold text-card-foreground">
              Aether Identity | Billing & Subscription
            </h1>
            <Badge
              variant={
                billingHealth.status === "healthy" ? "default" : "destructive"
              }
              className={cn(
                billingHealth.status === "healthy"
                  ? "bg-accent/10 text-accent border-accent/20"
                  : billingHealth.status === "warning"
                    ? "bg-amber-400/10 text-amber-400 border-amber-400/20"
                    : "bg-destructive/10 text-destructive border-destructive/20",
              )}
            >
              {billingHealth.status === "healthy" ? (
                <>
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Active
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {billingHealth.label}
                </>
              )}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Manage your subscription, monitor usage, and control billing
            settings. Your next billing date is{" "}
            <strong>{subscriptionData.plan.nextBillingDate}</strong>.
          </p>
        </div>
        <Button onClick={handleUpgrade} className="gap-2">
          <TrendingUp className="h-4 w-4" />
          Upgrade Plan
        </Button>
      </div>

      {/* =====================================================================
          SECTION 1: KPI METRICS
          Quick overview of billing health and key metrics
          ===================================================================== */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Monthly Spend"
            value={`$${subscriptionData.plan.price}`}
            subtitle="Professional Plan"
            icon={CreditCard}
            variant="accent"
          />
          <MetricCard
            title="Total Usage"
            value={`${totalUsagePercentage}%`}
            subtitle="Across all resources"
            icon={Zap}
            trend={{ value: 5.2, isPositive: false }}
          />
          <DaysUntilRenewalCard days={subscriptionData.plan.daysUntilRenewal} />
          <BillingHealthCard health={billingHealth} />
        </div>
      </section>

      {/* =====================================================================
          SECTION 2: SUBSCRIPTION & USAGE
          Current plan details and consumption metrics
          ===================================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Subscription & Usage
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleManageSubscription}
            className="text-accent"
          >
            Manage Subscription
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <SubscriptionCard
              plan={subscriptionData.plan}
              features={subscriptionData.features}
              onUpgrade={handleUpgrade}
              onManage={handleManageSubscription}
            />
          </div>
          <div className="lg:col-span-2">
            <UsageStats
              metrics={usageData.metrics}
              planName={subscriptionData.plan.name}
            />
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 3: PAYMENT & BILLING INFO
          Payment methods and company billing details
          ===================================================================== */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Payment & Billing Information
        </h2>

        {hasExpiringCard && (
          <div className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-400">
                Payment Method Expiring Soon
              </p>
              <p className="text-sm text-amber-400/80 mt-1">
                One of your payment methods expires soon. Update it to avoid
                service interruption.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-amber-400/30 text-amber-400 hover:bg-amber-400/10"
              onClick={handleAddPaymentMethod}
            >
              Update Payment Method
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PaymentMethods
            methods={paymentMethodsData}
            onAddMethod={handleAddPaymentMethod}
            onRemoveMethod={handleRemovePaymentMethod}
            onSetDefault={handleSetDefaultPaymentMethod}
          />
          <BillingInfo
            address={billingAddressData}
            onSave={handleSaveBillingInfo}
          />
        </div>
      </section>

      {/* =====================================================================
          SECTION 4: INVOICE HISTORY & UPCOMING
          Past billing records and upcoming charges preview
          ===================================================================== */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Billing History & Forecast
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <InvoiceHistory
              invoices={invoicesData}
              onDownload={handleDownloadInvoice}
            />
          </div>
          <div className="lg:col-span-1">
            <UpcomingInvoiceCard invoice={upcomingInvoiceData} />
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 5: SUPPORT & RESOURCES
          Help links and support options
          ===================================================================== */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Support & Resources
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border bg-card hover:border-accent/30 transition-colors group">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-accent/10 p-2.5 group-hover:bg-accent/20 transition-colors">
                  <HelpCircle className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground mb-1">
                    Billing Questions?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Get help with invoices, refunds, or billing issues from our
                    support team.
                  </p>
                  <a
                    href="/admin/support"
                    className="inline-flex items-center text-sm text-accent hover:underline font-medium"
                  >
                    Contact Support
                    <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card hover:border-accent/30 transition-colors group">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-secondary p-2.5 group-hover:bg-secondary/80 transition-colors">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground mb-1">
                    Enterprise Solutions
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Custom plans for large organizations with specific
                    requirements.
                  </p>
                  <a
                    href="https://skygenesisenterprise.com/contact"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-accent hover:underline font-medium"
                  >
                    Contact Sales
                    <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card hover:border-accent/30 transition-colors group">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-secondary p-2.5 group-hover:bg-secondary/80 transition-colors">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground mb-1">
                    Documentation
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Learn about pricing, billing cycles, and how charges are
                    calculated.
                  </p>
                  <a
                    href="https://docs.skygenesisenterprise.com/billing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-accent hover:underline font-medium"
                  >
                    View Docs
                    <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
