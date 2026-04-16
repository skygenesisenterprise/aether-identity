import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/public/CodeBlock";
import {
  ArrowRight,
  Puzzle,
  Zap,
  Shield,
  Globe,
  Database,
  MessageSquare,
  Webhook,
  FileCode,
  Box,
  Layers,
  Plug,
  Hexagon,
  Share2,
  Lock,
  Gauge,
  Users,
  Fingerprint,
  Wifi,
  Smartphone,
  Tablet,
  Watch,
} from "lucide-react";

const extensionTypes = [
  {
    icon: Puzzle,
    title: "Auth Plugins",
    description:
      "Extend authentication flows with custom providers, MFA methods, and identity verification.",
  },
  {
    icon: Webhook,
    title: "Event Hooks",
    description: "Trigger custom actions on user events, login attempts, or account changes.",
  },
  {
    icon: Database,
    title: "Storage Connectors",
    description: "Connect to custom databases, LDAP directories, or external user stores.",
  },
  {
    icon: MessageSquare,
    title: "Notification",
    description: "Send notifications via SMS, email, push, or third-party messaging platforms.",
  },
];

const popularExtensions = [
  { name: "SAML Connector", description: "Enterprise SSO integration", downloads: "50K+" },
  { name: "Twilio SMS", description: "SMS two-factor authentication", downloads: "30K+" },
  { name: "Slack Notifications", description: "Login alerts to Slack", downloads: "25K+" },
  { name: "Active Directory", description: "LDAP user federation", downloads: "20K+" },
  { name: "Custom Webhooks", description: "HTTP event forwarding", downloads: "18K+" },
  { name: "Redis Sessions", description: "Distributed session cache", downloads: "15K+" },
];

const useCases = [
  {
    icon: Fingerprint,
    title: "Biometric Authentication",
    description: "Add face ID, fingerprint, or voice recognition to your auth flows.",
  },
  {
    icon: Smartphone,
    title: "Mobile Push Notifications",
    description: "Send real-time authentication alerts to iOS and Android devices.",
  },
  {
    icon: Shield,
    title: "Fraud Detection",
    description: "Integrate risk analysis engines to prevent account takeover.",
  },
  {
    icon: Globe,
    title: "Social Login",
    description: "Add Google, Apple, Facebook, and other OAuth providers.",
  },
];

const metrics = [
  { value: "100+", label: "Community extensions" },
  { value: "500K+", label: "Monthly downloads" },
  { value: "50+", label: "Official integrations" },
  { value: "< 5ms", label: "Extension overhead" },
];

const sampleCode = [
  {
    language: "typescript",
    filename: "extension.ts",
    code: `import { AetherExtension } from '@aether-identity/extensions';

const myExtension = new AetherExtension({
  name: 'custom-auth',
  version: '1.0.0',
  hooks: {
    beforeLogin: async (ctx) => {
      // Add custom validation
      const riskScore = await checkRisk(ctx);
      if (riskScore > 0.8) {
        ctx.requireMFA = true;
      }
    },
  },
});

await aether.register(myExtension);`,
  },
  {
    language: "json",
    filename: "extension.json",
    code: `{
  "name": "@aether/slack-notify",
  "version": "2.0.0",
  "events": ["login", "logout", "mfa"],
  "config": {
    "webhookUrl": "$SLACK_WEBHOOK_URL",
    "channel": "#auth-alerts"
  }
}`,
  },
];

const featuredIntegrations = [
  { name: "AWS", category: "Cloud" },
  { name: "Azure AD", category: "Identity" },
  { name: "Google Workspace", category: "Productivity" },
  { name: "Salesforce", category: "CRM" },
  { name: "ServiceNow", category: "ITSM" },
  { name: "Jira", category: "Project" },
];

const communityShowcase = [
  { name: "Okta Migrator", author: "Community", description: "Import users from Okta" },
  { name: "YubiKey Support", author: "Yubico", description: "Hardware token integration" },
  { name: "Duo Security", author: "Community", description: "Duo push notifications" },
  { name: "JumpCloud", author: "Community", description: "Directory sync" },
];

const features = [
  {
    icon: Zap,
    title: "Instant Loading",
    description: "Extensions load in under 5ms with optimized hot-reload.",
  },
  {
    icon: Lock,
    title: "Sandboxed Execution",
    description: "Each extension runs in isolation with minimal permissions.",
  },
  {
    icon: Gauge,
    title: "Zero Overhead",
    description: "Extensions are lazy-loaded only when needed.",
  },
  {
    icon: Share2,
    title: "Easy Distribution",
    description: "Publish to npm or install directly from GitHub.",
  },
];

export default async function ExtensionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "DevelopersExtensions" });

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
                <Link href={`/${locale}/docs/extensions`}>
                  <Button size="lg" className="gap-2 h-12 px-6 text-base">
                    {t("hero.ctaCreate")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/${locale}/docs/extensions/browse`}>
                  <Button variant="outline" size="lg" className="gap-2 h-12 px-6 text-base">
                    <Plug className="h-4 w-4" />
                    {t("hero.ctaBrowse")}
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
              {[
                { value: "100+", label: t("metrics.community") },
                { value: "500K+", label: t("metrics.downloads") },
                { value: "50+", label: t("metrics.official") },
                { value: "< 5ms", label: t("metrics.overhead") },
              ].map((metric) => (
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

        {/* Extension Types */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("categories.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("categories.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Puzzle,
                  title: t("categories.authPlugins"),
                  description: t("categories.authPluginsDesc"),
                },
                {
                  icon: Webhook,
                  title: t("categories.webhooks"),
                  description: t("categories.webhooksDesc"),
                },
                {
                  icon: Database,
                  title: t("categories.storage"),
                  description: t("categories.storageDesc"),
                },
                {
                  icon: MessageSquare,
                  title: t("categories.notifications"),
                  description: t("categories.notificationsDesc"),
                },
              ].map((type) => (
                <div key={type.title} className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                      <type.icon className="h-5 w-5 text-foreground" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">{type.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {type.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Extensions */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("popular.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("popular.description")}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularExtensions.map((ext) => (
                <div
                  key={ext.name}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/5">
                      <Plug className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{ext.name}</div>
                      <div className="text-sm text-muted-foreground">{ext.description}</div>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-muted rounded">
                    {ext.downloads}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href={`/${locale}/docs/extensions/browse`}>
                <Button variant="secondary" size="lg" className="gap-2">
                  <Box className="h-4 w-4" />
                  {t("popular.cta")}
                </Button>
              </Link>
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
                  <Link href={`/${locale}/docs/extensions/quickstart`}>
                    <Button variant="secondary" size="lg" className="gap-2">
                      <FileCode className="h-4 w-4" />
                      {t("code.cta")}
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <CodeBlock samples={sampleCode} defaultLanguage="typescript" />
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("useCases.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("useCases.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Fingerprint,
                  title: t("useCases.biometric"),
                  description: t("useCases.biometricDesc"),
                },
                {
                  icon: Smartphone,
                  title: t("useCases.mobilePush"),
                  description: t("useCases.mobilePushDesc"),
                },
                { icon: Shield, title: t("useCases.fraud"), description: t("useCases.fraudDesc") },
                { icon: Globe, title: t("useCases.social"), description: t("useCases.socialDesc") },
              ].map((useCase) => (
                <div
                  key={useCase.title}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <useCase.icon className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{useCase.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {useCase.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Integrations */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("integrations.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("integrations.description")}
              </p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
              {featuredIntegrations.map((integration) => (
                <div
                  key={integration.name}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-card"
                >
                  <Hexagon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-lg font-medium text-foreground">{integration.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("features.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("features.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Zap, title: t("features.loading"), description: t("features.loadingDesc") },
                {
                  icon: Lock,
                  title: t("features.sandbox"),
                  description: t("features.sandboxDesc"),
                },
                {
                  icon: Gauge,
                  title: t("features.overhead"),
                  description: t("features.overheadDesc"),
                },
                {
                  icon: Share2,
                  title: t("features.distribution"),
                  description: t("features.distributionDesc"),
                },
              ].map((feature) => (
                <div key={feature.title} className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                      <feature.icon className="h-5 w-5 text-foreground" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Showcase */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("community.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("community.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {communityShowcase.map((item) => (
                <div
                  key={item.name}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <Layers className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{item.author}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="https://github.com/skygenesisenterprise/aether-extensions">
                <Button variant="outline" size="lg" className="gap-2">
                  <Box className="h-4 w-4" />
                  {t("community.cta")}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Device Support */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("devices.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("devices.description")}
              </p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
              <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                <Smartphone className="h-8 w-8 text-foreground" />
                <span className="text-lg font-medium text-foreground">iOS / Android</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                <Tablet className="h-8 w-8 text-foreground" />
                <span className="text-lg font-medium text-foreground">Tablets</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                <Watch className="h-8 w-8 text-foreground" />
                <span className="text-lg font-medium text-foreground">Wearables</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                <Wifi className="h-8 w-8 text-foreground" />
                <span className="text-lg font-medium text-foreground">IoT Devices</span>
              </div>
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
                <Link href={`/${locale}/docs/extensions/quickstart`}>
                  <Button size="lg" className="gap-2 h-12 px-8 text-base">
                    {t("cta.ctaQuickstart")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/${locale}/docs/api-reference/extensions`}>
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                    {t("cta.ctaApi")}
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
