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
import { Users, Fingerprint, Zap, Database } from "lucide-react";

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

const paymentMethodsData = [
  {
    id: "pm_001",
    type: "card" as const,
    brand: "visa",
    last4: "4242",
    expMonth: 12,
    expYear: 2026,
    isDefault: true,
    status: "active" as const,
  },
  {
    id: "pm_002",
    type: "card" as const,
    brand: "mastercard",
    last4: "8888",
    expMonth: 8,
    expYear: 2025,
    isDefault: false,
    status: "expiring_soon" as const,
  },
];

const invoicesData = [
  {
    id: "inv_001",
    number: "INV-2025-002",
    date: "2025-02-01",
    amount: 79.0,
    currency: "usd",
    status: "paid" as const,
    description: "Professional Plan - Monthly",
  },
  {
    id: "inv_002",
    number: "INV-2025-001",
    date: "2025-01-01",
    amount: 79.0,
    currency: "usd",
    status: "paid" as const,
    description: "Professional Plan - Monthly",
  },
  {
    id: "inv_003",
    number: "INV-2024-012",
    date: "2024-12-01",
    amount: 79.0,
    currency: "usd",
    status: "paid" as const,
    description: "Professional Plan - Monthly",
  },
  {
    id: "inv_004",
    number: "INV-2024-011",
    date: "2024-11-01",
    amount: 79.0,
    currency: "usd",
    status: "paid" as const,
    description: "Professional Plan - Monthly",
  },
  {
    id: "inv_005",
    number: "INV-2024-010",
    date: "2024-10-01",
    amount: 79.0,
    currency: "usd",
    status: "paid" as const,
    description: "Professional Plan - Monthly",
  },
];

const billingAddressData = {
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

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function BillingPage() {
  const handleUpgrade = () => {
    // TODO: Navigate to upgrade flow
    console.log("Navigate to upgrade");
  };

  const handleManageSubscription = () => {
    // TODO: Navigate to subscription management
    console.log("Manage subscription");
  };

  const handleAddPaymentMethod = () => {
    // TODO: Open add payment method modal
    console.log("Add payment method");
  };

  const handleRemovePaymentMethod = (id: string) => {
    // TODO: Remove payment method
    console.log("Remove payment method:", id);
  };

  const handleSetDefaultPaymentMethod = (id: string) => {
    // TODO: Set default payment method
    console.log("Set default payment method:", id);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    // TODO: Download invoice PDF
    console.log("Download invoice:", invoice.id);
  };

  const handleSaveBillingInfo = (address: BillingAddress) => {
    // TODO: Save billing address
    console.log("Save billing info:", address);
  };

  return (
    <div className="space-y-6 text-foreground">
      {/* =========================================================================
          HEADER SECTION
          Page title and description
          ========================================================================= */}
      <div>
        <h1 className="text-2xl font-semibold text-card-foreground">Billing</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your subscription, payment methods, and billing history
        </p>
      </div>

      {/* =========================================================================
          SECTION 1: SUBSCRIPTION OVERVIEW
          Current plan details and usage summary
          ========================================================================= */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Subscription
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Subscription Card - Takes 3 columns */}
          <div className="lg:col-span-3">
            <SubscriptionCard
              plan={subscriptionData.plan}
              features={subscriptionData.features}
              onUpgrade={handleUpgrade}
              onManage={handleManageSubscription}
            />
          </div>

          {/* Usage Stats - Takes 2 columns */}
          <div className="lg:col-span-2">
            <UsageStats
              metrics={usageData.metrics}
              planName={subscriptionData.plan.name}
            />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: PAYMENT METHODS & BILLING INFO
          Payment management and legal information
          ========================================================================= */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Payment & Information
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Methods */}
          <PaymentMethods
            methods={paymentMethodsData}
            onAddMethod={handleAddPaymentMethod}
            onRemoveMethod={handleRemovePaymentMethod}
            onSetDefault={handleSetDefaultPaymentMethod}
          />

          {/* Billing Information */}
          <BillingInfo
            address={billingAddressData}
            onSave={handleSaveBillingInfo}
          />
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: INVOICE HISTORY
          Past billing records
          ========================================================================= */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          History
        </h2>

        <InvoiceHistory
          invoices={invoicesData}
          onDownload={handleDownloadInvoice}
        />
      </section>

      {/* =========================================================================
          SECTION 4: BILLING SUPPORT
          Help and support links
          ========================================================================= */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Support
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-border bg-card">
            <h3 className="font-medium text-foreground mb-1">
              Billing Questions?
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Contact our support team for help with invoices, refunds, or
              billing issues.
            </p>
            <a
              href="/admin/support"
              className="text-sm text-accent hover:underline font-medium"
            >
              Contact Support →
            </a>
          </div>

          <div className="p-4 rounded-lg border border-border bg-card">
            <h3 className="font-medium text-foreground mb-1">
              Need a Custom Plan?
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Enterprise organizations with specific requirements can contact
              our sales team.
            </p>
            <a
              href="https://skygenesisenterprise.com/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent hover:underline font-medium"
            >
              Contact Sales →
            </a>
          </div>

          <div className="p-4 rounded-lg border border-border bg-card">
            <h3 className="font-medium text-foreground mb-1">
              Understanding Your Bill
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Learn more about our pricing, billing cycles, and how charges are
              calculated.
            </p>
            <a
              href="https://docs.skygenesisenterprise.com/billing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent hover:underline font-medium"
            >
              View Documentation →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
