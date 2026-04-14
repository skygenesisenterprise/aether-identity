import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import {
  Server,
  Database,
  Lock,
  Shield,
  ArrowRight,
  CheckCircle2,
  Globe,
  Zap,
  HardDrive,
  Network,
  Clock,
  HeadphonesIcon,
  RefreshCw,
  Scale,
  Activity,
} from "lucide-react";

export default async function PrivateCloudPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PrivateCloud" });

  const features = [
    {
      icon: Server,
      title: t("features.dedicated"),
      description: t("features.dedicatedDesc"),
    },
    {
      icon: Lock,
      title: t("features.security"),
      description: t("features.securityDesc"),
    },
    {
      icon: Shield,
      title: t("features.compliance"),
      description: t("features.complianceDesc"),
    },
    {
      icon: Database,
      title: t("features.sovereignty"),
      description: t("features.sovereigntyDesc"),
    },
    {
      icon: Network,
      title: t("features.networking"),
      description: t("features.networkingDesc"),
    },
    {
      icon: HardDrive,
      title: t("features.storage"),
      description: t("features.storageDesc"),
    },
  ];

  const metrics = [
    { value: "99.99%", label: t("metrics.uptimeSla") },
    { value: "< 10ms", label: t("metrics.networkLatency") },
    { value: "24/7", label: t("metrics.supportCoverage") },
    { value: "Zero", label: t("metrics.sharedResources") },
  ];

  const benefits = [
    {
      icon: Scale,
      title: t("benefits.scaling"),
      description: t("benefits.scalingDesc"),
    },
    {
      icon: RefreshCw,
      title: t("benefits.costs"),
      description: t("benefits.costsDesc"),
    },
    {
      icon: HeadphonesIcon,
      title: t("benefits.support"),
      description: t("benefits.supportDesc"),
    },
    {
      icon: Zap,
      title: t("benefits.performance"),
      description: t("benefits.performanceDesc"),
    },
  ];

  const services = [
    {
      name: t("pricing.standard"),
      description: t("pricing.standardDesc"),
      price: t("pricing.custom"),
      features: [
        "Dedicated virtual servers",
        "500GB storage",
        "24/7 monitoring",
        "Email support",
        "99.9% uptime",
        "Basic security",
      ],
    },
    {
      name: t("pricing.professional"),
      description: t("pricing.professionalDesc"),
      price: t("pricing.custom"),
      features: [
        "Dedicated physical servers",
        "2TB storage",
        "Priority support",
        "99.99% uptime",
        "Advanced security",
        "Custom networking",
      ],
      popular: true,
    },
    {
      name: t("pricing.enterprise"),
      description: t("pricing.enterpriseDesc"),
      price: t("pricing.custom"),
      features: [
        "Full rack deployment",
        "Unlimited storage",
        "Dedicated account manager",
        "99.999% uptime",
        "Custom compliance",
        "On-premise options",
      ],
    },
  ];

  const faqs = [
    {
      question: t("faq.diffPublic.title"),
      answer: t("faq.diffPublic.answer"),
    },
    {
      question: t("faq.dataCenter.title"),
      answer: t("faq.dataCenter.answer"),
    },
    {
      question: t("faq.migration.title"),
      answer: t("faq.migration.answer"),
    },
    {
      question: t("faq.billing.title"),
      answer: t("faq.billing.answer"),
    },
    {
      question: t("faq.commitment.title"),
      answer: t("faq.commitment.answer"),
    },
  ];

  const recentUpdates = [
    {
      version: "Q1 2026",
      date: "April 2026",
      description: "New data center in Frankfurt with enhanced compliance options",
    },
    {
      version: "Q4 2025",
      date: "December 2025",
      description: "Added GPU instance types for AI/ML workloads",
    },
    {
      version: "Q3 2025",
      date: "September 2025",
      description: "Expanded storage options with NVMe performance tier",
    },
  ];

  const complianceStandards = ["SOC 2", "GDPR", "ISO 27001", "HIPAA", "PCI DSS", "FedRAMP"];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header locale={locale as import("@/lib/locale").Locale} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
                {t("hero.badge")}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight text-balance">
                {t("hero.title")}
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                {t("hero.description")}
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                <Link href="#contact">
                  <Button size="lg" className="gap-2 h-12 px-6 text-base">
                    {t("hero.ctaQuote")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg" className="h-12 px-6 text-base">
                    {t("hero.ctaFeatures")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics Section */}
        <section className="py-16 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {metrics.map((metric) => (
                <div key={metric.label}>
                  <div className="text-3xl sm:text-4xl font-semibold text-foreground">
                    {metric.value}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("features.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("features.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                      <feature.icon className="h-5 w-5 text-foreground" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-13">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("benefits.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("benefits.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <benefit.icon className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("pricing.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("pricing.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service.name}
                  className={`relative p-6 rounded-lg border bg-card ${
                    service.popular
                      ? "border-blue-500 ring-1 ring-blue-500"
                      : "border-border hover:border-foreground/20"
                  } transition-colors`}
                >
                  {service.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                      {t("pricing.mostPopular")}
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-foreground mb-2">{service.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                  <div className="text-2xl font-semibold text-foreground mb-6">{service.price}</div>
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="#contact">
                    <Button className="w-full" variant={service.popular ? "default" : "outline"}>
                      {t("pricing.getStarted")}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Compliance Section */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                  {t("compliance.title")}
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  {t("compliance.description")}
                </p>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  {complianceStandards.map((standard) => (
                    <div key={standard} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="text-sm text-foreground">{standard}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Shield className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">AES-256</div>
                  <div className="text-sm text-muted-foreground">
                    {t("compliance.dataEncryption")}
                  </div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Lock className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">Zero</div>
                  <div className="text-sm text-muted-foreground">
                    {t("compliance.tenantIsolation")}
                  </div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Globe className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">10+</div>
                  <div className="text-sm text-muted-foreground">
                    {t("compliance.regionsAvailable")}
                  </div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Activity className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">24/7</div>
                  <div className="text-sm text-muted-foreground">
                    {t("compliance.securityMonitoring")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("faq.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("faq.description")}
              </p>
            </div>
            <FaqAccordion faqs={faqs} />
          </div>
        </section>

        {/* Recent Updates */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("updates.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("updates.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {recentUpdates.map((update) => (
                <div
                  key={update.version}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{update.date}</span>
                  </div>
                  <div className="text-lg font-semibold text-foreground mb-2">{update.version}</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {update.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("cta.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">{t("cta.description")}</p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="gap-2 h-12 px-8 text-base">
                  {t("cta.ctaQuote")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                    {t("cta.contactSales")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale as "fr" | "be_fr" | "be_nl" | "ch_fr"} />
    </div>
  );
}
