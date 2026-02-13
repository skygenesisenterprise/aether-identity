"use client";

import * as React from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/dashboard/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Check,
  X,
  Sparkles,
  Building2,
  ArrowRight,
  HelpCircle,
  Shield,
  Zap,
  Users,
  Database,
  Globe,
  Clock,
} from "lucide-react";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface PlanFeature {
  name: string;
  included: boolean;
  tooltip?: string;
  highlight?: boolean;
}

interface Plan {
  id: string;
  name: string;
  tier: "free" | "starter" | "professional" | "enterprise";
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  badge?: string;
  popular?: boolean;
  current?: boolean;
  features: PlanFeature[];
  limits: {
    users: number;
    identities: number;
    apiCalls: string;
    storage: string;
    environments: number;
    regions: number;
  };
  cta: {
    text: string;
    variant: "default" | "outline" | "secondary";
  };
}

// ============================================================================
// MOCK DATA - Available Plans
// ============================================================================

const plansData: Plan[] = [
  {
    id: "free",
    name: "Free",
    tier: "free",
    description: "Perfect for individuals and small projects getting started",
    price: {
      monthly: 0,
      yearly: 0,
    },
    current: false,
    features: [
      { name: "Up to 100 users", included: true },
      { name: "Up to 1,000 identities", included: true },
      { name: "10,000 API calls/month", included: true },
      { name: "5 GB audit log storage", included: true },
      { name: "Email support", included: true },
      { name: "Standard authentication", included: true },
      { name: "Basic analytics", included: true },
      { name: "Community support", included: true },
      { name: "SSO integration", included: false },
      { name: "SCIM provisioning", included: false },
      { name: "Advanced analytics", included: false },
      { name: "Custom domains", included: false },
      { name: "99.9% SLA", included: false },
      { name: "Dedicated support", included: false },
    ],
    limits: {
      users: 100,
      identities: 1000,
      apiCalls: "10K/month",
      storage: "5 GB",
      environments: 1,
      regions: 1,
    },
    cta: {
      text: "Get Started Free",
      variant: "outline",
    },
  },
  {
    id: "starter",
    name: "Starter",
    tier: "starter",
    description: "For growing teams that need more power and flexibility",
    price: {
      monthly: 29,
      yearly: 24,
    },
    current: false,
    features: [
      { name: "Up to 1,000 users", included: true },
      { name: "Up to 5,000 identities", included: true },
      { name: "100,000 API calls/month", included: true },
      { name: "25 GB audit log storage", included: true },
      { name: "Email & chat support", included: true },
      { name: "Standard authentication", included: true },
      { name: "Basic analytics", included: true },
      { name: "Community support", included: true },
      { name: "SSO integration", included: true, highlight: true },
      { name: "SCIM provisioning", included: false },
      { name: "Advanced analytics", included: false },
      { name: "Custom domains", included: false },
      { name: "99.9% SLA", included: false },
      { name: "Dedicated support", included: false },
    ],
    limits: {
      users: 1000,
      identities: 5000,
      apiCalls: "100K/month",
      storage: "25 GB",
      environments: 2,
      regions: 2,
    },
    cta: {
      text: "Start Free Trial",
      variant: "outline",
    },
  },
  {
    id: "professional",
    name: "Professional",
    tier: "professional",
    description: "For established organizations with advanced requirements",
    price: {
      monthly: 79,
      yearly: 63,
    },
    badge: "Popular",
    popular: true,
    current: true,
    features: [
      { name: "Up to 5,000 users", included: true },
      { name: "Up to 10,000 identities", included: true },
      { name: "500,000 API calls/month", included: true },
      { name: "100 GB audit log storage", included: true },
      { name: "Priority support", included: true, highlight: true },
      { name: "Standard authentication", included: true },
      { name: "Basic analytics", included: true },
      { name: "Community support", included: true },
      { name: "SSO integration", included: true },
      { name: "SCIM provisioning", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Custom domains", included: true },
      { name: "99.9% SLA", included: true },
      { name: "Dedicated support", included: false },
    ],
    limits: {
      users: 5000,
      identities: 10000,
      apiCalls: "500K/month",
      storage: "100 GB",
      environments: 5,
      regions: 3,
    },
    cta: {
      text: "Current Plan",
      variant: "secondary",
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tier: "enterprise",
    description: "Custom solutions for large-scale deployments",
    price: {
      monthly: -1,
      yearly: -1,
    },
    badge: "Custom",
    current: false,
    features: [
      { name: "Unlimited users", included: true, highlight: true },
      { name: "Unlimited identities", included: true, highlight: true },
      { name: "Unlimited API calls", included: true, highlight: true },
      { name: "Unlimited storage", included: true, highlight: true },
      { name: "24/7 dedicated support", included: true, highlight: true },
      { name: "Standard authentication", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Custom integrations", included: true },
      { name: "SSO integration", included: true },
      { name: "SCIM provisioning", included: true },
      { name: "Custom domains", included: true },
      { name: "99.99% SLA", included: true, highlight: true },
      { name: "Dedicated infrastructure", included: true, highlight: true },
      { name: "Custom contracts", included: true },
    ],
    limits: {
      users: -1,
      identities: -1,
      apiCalls: "Unlimited",
      storage: "Unlimited",
      environments: -1,
      regions: -1,
    },
    cta: {
      text: "Contact Sales",
      variant: "default",
    },
  },
];

const comparisonFeatures = [
  {
    category: "Identity Management",
    items: [
      { name: "Maximum Users", key: "users" },
      { name: "Maximum Identities", key: "identities" },
      { name: "Authentication Methods", value: "OAuth 2.0, SAML, LDAP" },
      { name: "MFA Support", value: "TOTP, SMS, Email, Hardware Keys" },
    ],
  },
  {
    category: "API & Integration",
    items: [
      { name: "Monthly API Calls", key: "apiCalls" },
      { name: "Rate Limiting", free: "Standard", enterprise: "Custom" },
      { name: "Webhook Events", free: "100/sec", enterprise: "Unlimited" },
      {
        name: "SCIM Provisioning",
        free: false,
        starter: true,
        professional: true,
        enterprise: true,
      },
    ],
  },
  {
    category: "Infrastructure",
    items: [
      { name: "Audit Log Storage", key: "storage" },
      { name: "Environments", key: "environments" },
      { name: "Geographic Regions", key: "regions" },
      {
        name: "Data Residency",
        free: false,
        professional: true,
        enterprise: true,
      },
      {
        name: "Custom Domains",
        free: false,
        professional: true,
        enterprise: true,
      },
    ],
  },
  {
    category: "Support & SLA",
    items: [
      {
        name: "Support Channels",
        free: "Email",
        starter: "Email & Chat",
        professional: "Priority",
        enterprise: "24/7 Dedicated",
      },
      {
        name: "Response Time",
        free: "48 hours",
        starter: "24 hours",
        professional: "4 hours",
        enterprise: "1 hour",
      },
      {
        name: "Uptime SLA",
        free: "99.5%",
        starter: "99.5%",
        professional: "99.9%",
        enterprise: "99.99%",
      },
      { name: "Customer Success Manager", free: false, enterprise: true },
    ],
  },
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function FeatureItem({ feature }: { feature: PlanFeature }) {
  return (
    <div className="flex items-start gap-3 py-1.5">
      {feature.included ? (
        <div className="mt-0.5 rounded-full bg-accent/10 p-0.5">
          <Check className="h-3.5 w-3.5 text-accent" />
        </div>
      ) : (
        <div className="mt-0.5 rounded-full bg-muted p-0.5">
          <X className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
      )}
      <span
        className={cn(
          "text-sm",
          feature.included ? "text-foreground" : "text-muted-foreground",
          feature.highlight && feature.included && "font-medium",
        )}
      >
        {feature.name}
      </span>
    </div>
  );
}

function PlanCard({
  plan,
  billingInterval,
}: {
  plan: Plan;
  billingInterval: "monthly" | "yearly";
}) {
  const price =
    billingInterval === "monthly" ? plan.price.monthly : plan.price.yearly;
  const isContactUs = price === -1;

  return (
    <Card
      className={cn(
        "relative flex flex-col border-border bg-card transition-all duration-200",
        plan.popular && "border-accent shadow-lg shadow-accent/5",
        plan.current && "ring-2 ring-accent/20",
      )}
    >
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge
            variant={plan.popular ? "default" : "secondary"}
            className={cn(plan.popular && "bg-accent text-accent-foreground")}
          >
            {plan.badge}
          </Badge>
        </div>
      )}

      <CardHeader className={cn("pb-4", plan.badge && "pt-8")}>
        <CardTitle className="text-xl font-semibold">{plan.name}</CardTitle>
        <CardDescription className="text-sm mt-1.5 min-h-[40px]">
          {plan.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <div className="mb-6">
          {isContactUs ? (
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">Custom</span>
            </div>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">${price}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          )}
          {!isContactUs && billingInterval === "yearly" && (
            <p className="text-xs text-accent mt-1">
              Save ${(plan.price.monthly - plan.price.yearly) * 12}/year
            </p>
          )}
        </div>

        <div className="space-y-1 mb-6">
          {plan.features.slice(0, 8).map((feature, index) => (
            <FeatureItem key={index} feature={feature} />
          ))}
        </div>

        <div className="mt-auto">
          <Button
            variant={plan.cta.variant}
            className="w-full"
            disabled={plan.current}
          >
            {plan.current ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                {plan.cta.text}
              </>
            ) : (
              <>
                {plan.cta.text}
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function PlansPage() {
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">(
    "monthly",
  );

  const currentPlan = plansData.find((p) => p.current);

  const formatValue = (value: unknown): string => {
    if (typeof value === "number") {
      if (value === -1) return "Unlimited";
      return value.toString();
    }
    if (typeof value === "string") return value;
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return "-";
  };

  return (
    <div className="space-y-8 text-foreground">
      {/* =====================================================================
          HEADER SECTION
          ===================================================================== */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-card-foreground mb-3">
          Choose Your Plan
        </h1>
        <p className="text-muted-foreground">
          Select the perfect plan for your organization. All plans include core
          identity management features. Upgrade or downgrade at any time.
        </p>
      </div>

      {/* =====================================================================
          CURRENT PLAN ALERT
          ===================================================================== */}
      {currentPlan && (
        <div className="rounded-lg border border-accent/20 bg-accent/5 p-4 flex items-center gap-4">
          <div className="rounded-full bg-accent/10 p-2">
            <Sparkles className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">
              You are currently on the {currentPlan.name} Plan
            </p>
            <p className="text-sm text-muted-foreground">
              Your plan renews on March 1, 2025. You can upgrade anytime to
              access more features.
            </p>
          </div>
          <Button variant="outline" size="sm">
            View Billing
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}

      {/* =====================================================================
          BILLING INTERVAL TOGGLE
          ===================================================================== */}
      <div className="flex justify-center">
        <Tabs
          value={billingInterval}
          onValueChange={(v) => setBillingInterval(v as "monthly" | "yearly")}
          className="w-auto"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">
              Yearly
              <Badge variant="secondary" className="ml-2 text-xs">
                Save 20%
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* =====================================================================
          PLANS GRID
          ===================================================================== */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {plansData.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              billingInterval={billingInterval}
            />
          ))}
        </div>
      </section>

      {/* =====================================================================
          DETAILED COMPARISON
          ===================================================================== */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Detailed Comparison</h2>
          <p className="text-sm text-muted-foreground">
            Compare all features across plans
          </p>
        </div>

        <Card className="border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm w-[40%]">
                      Feature
                    </th>
                    {plansData.map((plan) => (
                      <th
                        key={plan.id}
                        className={cn(
                          "text-center p-4 font-semibold text-sm min-w-[140px]",
                          plan.popular && "bg-accent/5",
                        )}
                      >
                        {plan.name}
                        {plan.current && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Current
                          </Badge>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((category, catIndex) => (
                    <React.Fragment key={catIndex}>
                      <tr className="bg-muted/50">
                        <td
                          colSpan={5}
                          className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                        >
                          {category.category}
                        </td>
                      </tr>
                      {category.items.map((item, itemIndex) => (
                        <tr
                          key={itemIndex}
                          className="border-b border-border last:border-0"
                        >
                          <td className="p-4 text-sm">{item.name}</td>
                          {plansData.map((plan) => {
                            let displayValue: React.ReactNode;

                            if ("key" in item && item.key) {
                              const limitValue =
                                plan.limits[
                                  item.key as keyof typeof plan.limits
                                ];
                              displayValue = formatValue(limitValue);
                            } else if ("value" in item) {
                              const tierKey = plan.tier as string;
                              const planValue =
                                tierKey in item
                                  ? (item as Record<string, unknown>)[tierKey]
                                  : item.value;
                              if (typeof planValue === "boolean") {
                                displayValue = planValue ? (
                                  <Check className="h-4 w-4 text-accent mx-auto" />
                                ) : (
                                  <X className="h-4 w-4 text-muted-foreground mx-auto" />
                                );
                              } else {
                                displayValue = formatValue(planValue);
                              }
                            } else {
                              displayValue = "-";
                            }

                            return (
                              <td
                                key={plan.id}
                                className={cn(
                                  "p-4 text-center text-sm",
                                  plan.popular && "bg-accent/5",
                                )}
                              >
                                {displayValue}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* =====================================================================
          ENTERPRISE CTA
          ===================================================================== */}
      <section>
        <Card className="border-border bg-gradient-to-br from-secondary/50 to-background">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="rounded-xl bg-accent/10 p-4">
                <Building2 className="h-8 w-8 text-accent" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold mb-2">
                  Need a Custom Enterprise Solution?
                </h3>
                <p className="text-muted-foreground">
                  Get dedicated infrastructure, custom SLAs, and personalized
                  support tailored to your organization&apos;s unique
                  requirements.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Talk to Sales
                </Button>
                <Button>
                  Request Custom Quote
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* =====================================================================
          FAQ SECTION
          ===================================================================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-center">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          <Card className="border-border">
            <CardContent className="p-5">
              <h4 className="font-medium mb-2">Can I change plans anytime?</h4>
              <p className="text-sm text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes
                take effect immediately and prorated charges apply.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-5">
              <h4 className="font-medium mb-2">
                What happens if I exceed limits?
              </h4>
              <p className="text-sm text-muted-foreground">
                We will notify you when approaching limits. You can upgrade to
                avoid service interruption or purchase additional capacity.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-5">
              <h4 className="font-medium mb-2">Is there a free trial?</h4>
              <p className="text-sm text-muted-foreground">
                Yes, all paid plans come with a 14-day free trial. No credit
                card required to start.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-5">
              <h4 className="font-medium mb-2">
                How does yearly billing work?
              </h4>
              <p className="text-sm text-muted-foreground">
                Yearly billing offers a 20% discount. You are charged annually
                and can cancel anytime with prorated refunds.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* =====================================================================
          FOOTER SUPPORT
          ===================================================================== */}
      <div className="text-center pt-8 border-t border-border">
        <p className="text-muted-foreground text-sm">
          Have questions? Contact our support team or browse our documentation.
        </p>
      </div>
    </div>
  );
}
