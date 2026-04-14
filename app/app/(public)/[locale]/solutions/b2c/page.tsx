import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { GitHubIcon } from "@/components/ui/icons/GitHubIcon";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import {
  Shield,
  Lock,
  Users,
  Key,
  Fingerprint,
  Zap,
  ArrowRight,
  Globe,
  Code2,
  Building2,
  CheckCircle2,
  ShoppingCart,
  HeartPulse,
  Mail,
  Smartphone,
  UserCheck,
  Database,
  Cloud,
  FileText,
  BookOpen,
  BarChart3,
  Clock,
  X,
  Eye,
  HandHeart,
  Bell,
  CreditCard,
  Wallet,
} from "lucide-react";

export default async function PublicPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "B2C" });

  const capabilities = [
    {
      icon: Fingerprint,
      title: t("capabilities.biometric"),
      description: t("capabilities.biometricDesc"),
    },
    {
      icon: Mail,
      title: t("capabilities.social"),
      description: t("capabilities.socialDesc"),
    },
    {
      icon: Key,
      title: t("capabilities.magic"),
      description: t("capabilities.magicDesc"),
    },
    {
      icon: Users,
      title: t("capabilities.customer"),
      description: t("capabilities.customerDesc"),
    },
    {
      icon: Globe,
      title: t("capabilities.crossBorder"),
      description: t("capabilities.crossBorderDesc"),
    },
    {
      icon: Shield,
      title: t("capabilities.fraud"),
      description: t("capabilities.fraudDesc"),
    },
  ];

  const metrics = [
    { value: "40%", label: t("metrics.reducedFriction") },
    { value: "99.9%", label: t("metrics.slaUptime") },
    { value: "65%", label: t("metrics.higherConversion") },
    { value: "Zero", label: t("metrics.passwordsManage") },
  ];

  const loginOptions = [
    {
      icon: Fingerprint,
      title: t("loginOptions.passwordless"),
      description: t("loginOptions.passwordlessDesc"),
    },
    {
      icon: Mail,
      title: t("loginOptions.socialProviders"),
      description: t("loginOptions.socialProvidersDesc"),
    },
    {
      icon: Smartphone,
      title: t("loginOptions.mobileSso"),
      description: t("loginOptions.mobileSsoDesc"),
    },
    {
      icon: UserCheck,
      title: t("loginOptions.enterpriseSso"),
      description: t("loginOptions.enterpriseSsoDesc"),
    },
  ];

  const complianceStandards = ["GDPR", "CCPA", "SOC 2 Type II", "ISO 27001", "COPPA", "PCI DSS"];

  const industries = [
    {
      icon: ShoppingCart,
      title: t("industries.ecommerce"),
      description: t("industries.ecommerceDesc"),
    },
    {
      icon: HeartPulse,
      title: t("industries.healthcare"),
      description: t("industries.healthcareDesc"),
    },
    {
      icon: Wallet,
      title: t("industries.fintech"),
      description: t("industries.fintechDesc"),
    },
    {
      icon: Globe,
      title: t("industries.marketplaces"),
      description: t("industries.marketplacesDesc"),
    },
  ];

  const faqs = [
    {
      question: t("faq.diffB2b.title"),
      answer: t("faq.diffB2b.answer"),
    },
    {
      question: t("faq.migration.title"),
      answer: t("faq.migration.answer"),
    },
    {
      question: t("faq.consentGdpr.title"),
      answer: t("faq.consentGdpr.answer"),
    },
    {
      question: t("faq.deviceLoss.title"),
      answer: t("faq.deviceLoss.answer"),
    },
    {
      question: t("faq.progressive.title"),
      answer: t("faq.progressive.answer"),
    },
  ];

  const features = [
    {
      title: t("features.progressive"),
      description: t("features.progressiveDesc"),
    },
    {
      title: t("features.preference"),
      description: t("features.preferenceDesc"),
    },
    {
      title: t("features.linking"),
      description: t("features.linkingDesc"),
    },
    {
      title: t("features.session"),
      description: t("features.sessionDesc"),
    },
    {
      title: t("features.emailVerify"),
      description: t("features.emailVerifyDesc"),
    },
    {
      title: t("features.export"),
      description: t("features.exportDesc"),
    },
  ];

  const resources = [
    {
      icon: FileText,
      title: t("resources.whitepaper"),
      description: t("resources.whitepaperDesc"),
    },
    {
      icon: BookOpen,
      title: t("resources.ebook"),
      description: t("resources.ebookDesc"),
    },
    {
      icon: BarChart3,
      title: t("resources.caseStudy"),
      description: t("resources.caseStudyDesc"),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header locale={locale as import("@/lib/locale").Locale} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                {t("hero.badge")}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight text-balance">
                {t("hero.title")}
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                {t("hero.description")}
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                <Link href="/docs">
                  <Button size="lg" className="gap-2 h-12 px-6 text-base">
                    {t("hero.ctaDocs")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="https://github.com/skygenesisenterprise/aether-identity">
                  <Button variant="outline" size="lg" className="gap-2 h-12 px-6 text-base">
                    <GitHubIcon className="h-4 w-4" />
                    {t("hero.ctaGithub")}
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

        {/* Core Capabilities */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("capabilities.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("capabilities.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {capabilities.map((capability) => (
                <div key={capability.title} className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                      <capability.icon className="h-5 w-5 text-foreground" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">{capability.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-13">
                    {capability.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Login Options */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("loginOptions.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("loginOptions.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loginOptions.map((option) => (
                <div
                  key={option.title}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <option.icon className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{option.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {option.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("features.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("features.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industry Use Cases */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("industries.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("industries.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {industries.map((industry) => (
                <div
                  key={industry.title}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <industry.icon className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{industry.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {industry.description}
                  </p>
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
                  <Eye className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">Consent</div>
                  <div className="text-sm text-muted-foreground">{t("compliance.consent")}</div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <HandHeart className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">Right to Delete</div>
                  <div className="text-sm text-muted-foreground">{t("compliance.rightDelete")}</div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Database className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">Data Export</div>
                  <div className="text-sm text-muted-foreground">{t("compliance.dataExport")}</div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Bell className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">Breach Alert</div>
                  <div className="text-sm text-muted-foreground">{t("compliance.breachAlert")}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Code Example Section */}
        <section className="py-20 lg:py-28 bg-foreground text-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-balance">
                  {t("code.title")}
                </h2>
                <p className="mt-4 text-lg text-background/70 leading-relaxed">
                  {t("code.description")}
                </p>
                <div className="mt-8">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 text-sm bg-background/10 rounded-md text-background/80">
                      React
                    </span>
                    <span className="px-3 py-1.5 text-sm bg-background/10 rounded-md text-background/80">
                      Vue
                    </span>
                    <span className="px-3 py-1.5 text-sm bg-background/10 rounded-md text-background/80">
                      Angular
                    </span>
                    <span className="px-3 py-1.5 text-sm bg-background/10 rounded-md text-background/80">
                      iOS
                    </span>
                    <span className="px-3 py-1.5 text-sm bg-background/10 rounded-md text-background/80">
                      Android
                    </span>
                    <span className="px-3 py-1.5 text-sm bg-background/10 rounded-md text-background/80">
                      Flutter
                    </span>
                  </div>
                </div>
                <div className="mt-8">
                  <Link href="/docs/quickstarts">
                    <Button variant="secondary" size="lg" className="gap-2">
                      <Code2 className="h-4 w-4" />
                      {t("code.quickstart")}
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="p-6 rounded-lg bg-background/5">
                <pre className="text-sm text-background/80 overflow-x-auto">
                  <code>{`import { AetherCIAM } from '@aether-identity/react';

const auth = new AetherCIAM({
  domain: 'auth.yourapp.com',
  clientId: process.env.AETHER_CLIENT_ID,
});

// Sign up with email
const { user, session } = await auth.signUp({
  email: 'customer@example.com',
  password: 'secure-password',
  profile: {
    name: 'John Doe',
    preferences: { marketing: true }
  }
});

// Login with magic link
await auth.sendMagicLink('customer@example.com');

// Social login
await auth.loginWithProvider('google');`}</code>
                </pre>
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

        {/* Resources Section */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("resources.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("resources.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => (
                <div
                  key={resource.title}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors cursor-pointer"
                >
                  <resource.icon className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {resource.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("cta.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">{t("cta.description")}</p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/docs">
                  <Button size="lg" className="gap-2 h-12 px-8 text-base">
                    {t("cta.getStarted")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
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
