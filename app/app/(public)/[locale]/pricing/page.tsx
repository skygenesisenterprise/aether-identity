import Link from "next/link";
import { Locale, isValidLocale, defaultLocale } from "@/lib/locale";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface PageProps {
  params: Promise<{ locale?: string }>;
}

const tiers = [
  {
    name: "Community",
    description: "Perfect for small teams and personal projects",
    price: "Free",
    period: "",
    features: [
      { name: "Up to 100 users", included: true },
      { name: "OAuth 2.0 / OIDC", included: true },
      { name: "Basic MFA (TOTP)", included: true },
      { name: "Email support", included: true },
      { name: "Community documentation", included: true },
      { name: "Self-hosted deployment", included: true },
      { name: "Basic audit logs (7 days)", included: true },
      { name: "SSO connections", included: false },
      { name: "Custom branding", included: false },
      { name: "SLA guarantee", included: false },
      { name: "Priority support", included: false },
    ],
    cta: "Get Started",
    href: "/docs",
    popular: false,
  },
  {
    name: "Professional",
    description: "For growing organizations needing more power",
    price: "€99",
    period: "/years",
    features: [
      { name: "Up to 10,000 users", included: true },
      { name: "OAuth 2.0 / OIDC", included: true },
      { name: "Advanced MFA (WebAuthn, SMS)", included: true },
      { name: "Priority email support", included: true },
      { name: "Full documentation access", included: true },
      { name: "Self-hosted deployment", included: true },
      { name: "Extended audit logs (90 days)", included: true },
      { name: "Up to 50 SSO connections", included: true },
      { name: "Custom branding", included: true },
      { name: "SLA guarantee (99.9%)", included: true },
      { name: "Priority support", included: false },
    ],
    cta: "Start Free Trial",
    href: "/trial",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For large organizations with advanced needs",
    price: "Custom",
    period: "",
    features: [
      { name: "Unlimited users", included: true },
      { name: "OAuth 2.0 / OIDC", included: true },
      { name: "Advanced MFA (WebAuthn, SMS, biometrics)", included: true },
      { name: "24/7 dedicated support", included: true },
      { name: "Custom documentation", included: true },
      { name: "Self-hosted or cloud", included: true },
      { name: "Unlimited audit logs", included: true },
      { name: "Unlimited SSO connections", included: true },
      { name: "Full white-label branding", included: true },
      { name: "SLA guarantee (99.99%)", included: true },
      { name: "Dedicated success manager", included: true },
    ],
    cta: "Contact Sales",
    href: "/contact",
    popular: false,
  },
  {
    name: "Self-Hosted",
    description: "Deploy on your own infrastructure. Full control.",
    price: "Free",
    period: "",
    features: [
      { name: "Unlimited users", included: true },
      { name: "OAuth 2.0 / OIDC", included: true },
      { name: "Advanced MFA (all methods)", included: true },
      { name: "Community support", included: true },
      { name: "Full documentation access", included: true },
      { name: "Self-hosted deployment", included: true },
      { name: "Unlimited audit logs", included: true },
      { name: "Unlimited SSO connections", included: true },
      { name: "Full white-label branding", included: true },
      { name: "No SLA (self-managed)", included: true },
      { name: "Community support only", included: true },
    ],
    cta: "Download",
    href: "/docs",
    popular: false,
    badge: "Open Source",
  },
];

function FeatureRow({ feature }: { feature: { name: string; included: boolean } }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground">{feature.name}</span>
      {feature.included ? (
        <Check className="h-5 w-5 text-emerald-600" />
      ) : (
        <X className="h-5 w-5 text-muted-foreground/30" />
      )}
    </div>
  );
}

export default async function PricingPage({ params }: PageProps) {
  const { locale: paramLocale } = await params;
  const locale: Locale = paramLocale && isValidLocale(paramLocale) ? paramLocale : defaultLocale;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header locale={locale as import("@/lib/locale").Locale} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground tracking-tight text-balance">
                Simple, transparent pricing
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Choose the plan that fits your organization. The pricing below applies to our SaaS
                Cloud solutions. All plans also include the option to self-host Aether Identity
                completely free of charge with no per-authentication fees.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`relative rounded-xl border p-8 flex flex-col ${
                    tier.popular
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                      : "border-border bg-card"
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  {tier.badge && !tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {tier.badge}
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-foreground">{tier.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-semibold text-foreground">{tier.price}</span>
                      <span className="text-sm text-muted-foreground">{tier.period}</span>
                    </div>
                  </div>

                  <div className="flex-1 mb-6">
                    <div className="space-y-1">
                      {tier.features.map((feature) => (
                        <FeatureRow key={feature.name} feature={feature} />
                      ))}
                    </div>
                  </div>

                  <Link href={tier.href}>
                    <Button
                      className="w-full"
                      variant={tier.popular ? "default" : "outline"}
                      size="lg"
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 lg:py-28 border-t border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold text-foreground mb-8">
                Frequently asked questions
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    Can I switch plans later?
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Yes, you can upgrade or downgrade your plan at any time. Changes take effect
                    immediately and billing is prorated.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    What payment methods do you accept?
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We accept all major credit cards, bank transfers, and invoices for Enterprise
                    customers. All payments are processed securely.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    Is there a free trial?
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Yes, the Professional plan includes a 14-day free trial with full access to all
                    features. No credit card required.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    What happens when I exceed my user limit?
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We&apos;ll notify you when you approach your limit. You can upgrade to a higher
                    plan or purchase additional user packs at any time.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    Do you offer refunds?
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We offer a 30-day money-back guarantee for all paid plans. If you&apos;re not
                    satisfied, contact us for a full refund.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Ready to get started?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Deploy Aether Identity in minutes. No credit card required for the Community plan.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/docs">
                  <Button size="lg" className="gap-2 h-12 px-8 text-base">
                    Get Started
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
