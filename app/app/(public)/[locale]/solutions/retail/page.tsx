import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import {
  Shield,
  Lock,
  Users,
  Fingerprint,
  ArrowRight,
  Server,
  FileText,
  Calendar,
  BarChart3,
  ShoppingCart,
  CreditCard,
  Store,
  Globe,
  Package,
  QrCode,
  Smartphone,
  TrendingUp,
  Users2,
  Tag,
  Wallet,
  Database,
  Key,
  CheckCircle2,
} from "lucide-react";

export default async function RetailPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Retail" });

  const features = [
    {
      icon: ShoppingCart,
      title: t("features.ecommerce.title"),
      description: t("features.ecommerce.description"),
    },
    {
      icon: CreditCard,
      title: t("features.payment.title"),
      description: t("features.payment.description"),
    },
    {
      icon: Store,
      title: t("features.pos.title"),
      description: t("features.pos.description"),
    },
    {
      icon: Users,
      title: t("features.loyalty.title"),
      description: t("features.loyalty.description"),
    },
    {
      icon: Smartphone,
      title: t("features.mobile.title"),
      description: t("features.mobile.description"),
    },
    {
      icon: TrendingUp,
      title: t("features.fraud.title"),
      description: t("features.fraud.description"),
    },
  ];

  const complianceFeatures = [
    {
      icon: Shield,
      title: t("compliance.pci.title"),
      description: t("compliance.pci.description"),
    },
    {
      icon: Lock,
      title: t("compliance.encryption.title"),
      description: t("compliance.encryption.description"),
    },
    {
      icon: Users2,
      title: t("compliance.gdpr.title"),
      description: t("compliance.gdpr.description"),
    },
    {
      icon: Key,
      title: t("compliance.governance.title"),
      description: t("compliance.governance.description"),
    },
  ];

  const metrics = [
    { value: "40%", label: t("metrics.cartAbandonment") },
    { value: "< 15ms", label: t("metrics.latency") },
    { value: "99.99%", label: t("metrics.availability") },
    { value: "60%", label: t("metrics.fraudReduction") },
  ];

  const useCases = [
    {
      icon: Globe,
      title: t("useCases.omnichannel.title"),
      description: t("useCases.omnichannel.description"),
    },
    {
      icon: Tag,
      title: t("useCases.staff.title"),
      description: t("useCases.staff.description"),
    },
    {
      icon: Wallet,
      title: t("useCases.wallets.title"),
      description: t("useCases.wallets.description"),
    },
    {
      icon: Package,
      title: t("useCases.supply.title"),
      description: t("useCases.supply.description"),
    },
  ];

  const integrations = [
    "Shopify",
    "Magento",
    "Salesforce Commerce Cloud",
    "Oracle CX",
    "SAP Commerce",
    "BigCommerce",
    "WooCommerce",
    "Square",
  ];

  const deploymentOptions = [
    {
      icon: Server,
      title: t("deployment.onPremise"),
      description:
        "Deploy within your data center for complete control over customer data and authentication infrastructure.",
    },
    {
      icon: Database,
      title: t("deployment.private"),
      description:
        "Dedicated infrastructure in your cloud environment (AWS, Azure, GCP) with full data sovereignty.",
    },
    {
      icon: Globe,
      title: t("deployment.hybrid"),
      description:
        "Connect on-premise POS systems with cloud e-commerce platforms while maintaining consistent identity policies.",
    },
  ];

  const faqs = [
    {
      question: t("faq.pci.title"),
      answer: t("faq.pci.answer"),
    },
    {
      question: t("faq.ecommerce.title"),
      answer: t("faq.ecommerce.answer"),
    },
    {
      question: t("faq.omnichannel.title"),
      answer: t("faq.omnichannel.answer"),
    },
    {
      question: t("faq.loyalty.title"),
      answer: t("faq.loyalty.answer"),
    },
    {
      question: t("faq.fraud.title"),
      answer: t("faq.fraud.answer"),
    },
  ];

  const resources = [
    {
      icon: FileText,
      title: t("resources.whitepaper"),
      description: t("resources.whitepaperDesc"),
    },
    {
      icon: ShoppingCart,
      title: t("resources.ebook"),
      description: t("resources.ebookDesc"),
    },
    {
      icon: Calendar,
      title: t("resources.webinar"),
      description: t("resources.webinarDesc"),
    },
    {
      icon: BarChart3,
      title: t("resources.caseStudy"),
      description: t("resources.caseStudyDesc"),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

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
                <Link href={`/${locale}/contact`}>
                  <Button size="lg" className="gap-2 h-12 px-6 text-base">
                    {t("hero.ctaContact")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/${locale}/docs`}>
                  <Button variant="outline" size="lg" className="gap-2 h-12 px-6 text-base">
                    {t("hero.ctaDocs")}
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
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

        {/* Compliance Section */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("compliance.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("compliance.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {complianceFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <feature.icon className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 lg:py-28">
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
              {useCases.map((useCase) => (
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

        {/* E-Commerce Integrations */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("integrations.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("integrations.description")}
              </p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-4">
              {integrations.map((integration) => (
                <div
                  key={integration}
                  className="px-6 py-3 rounded-lg border border-border bg-card text-foreground font-medium"
                >
                  {integration}
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-muted-foreground">
              {t("integrations.notFound")}
            </p>
          </div>
        </section>

        {/* Deployment Options */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("deployment.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("deployment.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {deploymentOptions.map((option) => (
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

        {/* Security Features */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                  {t("security.title")}
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  {t("security.description")}
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <Shield className="h-6 w-6 text-foreground mb-2" />
                    <div className="text-lg font-semibold text-foreground">AES-256</div>
                    <div className="text-sm text-muted-foreground">
                      {t("security.encryptionRest")}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <Lock className="h-6 w-6 text-foreground mb-2" />
                    <div className="text-lg font-semibold text-foreground">TLS 1.3</div>
                    <div className="text-sm text-muted-foreground">
                      {t("security.encryptionTransit")}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <Fingerprint className="h-6 w-6 text-foreground mb-2" />
                    <div className="text-lg font-semibold text-foreground">WebAuthn</div>
                    <div className="text-sm text-muted-foreground">{t("security.biometric")}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <QrCode className="h-6 w-6 text-foreground mb-2" />
                    <div className="text-lg font-semibold text-foreground">Tokenization</div>
                    <div className="text-sm text-muted-foreground">
                      {t("security.tokenization")}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span className="text-sm text-foreground">{t("security.oauth")}</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span className="text-sm text-foreground">{t("security.social")}</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span className="text-sm text-foreground">{t("security.device")}</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span className="text-sm text-foreground">{t("security.mfa")}</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span className="text-sm text-foreground">{t("security.fraud")}</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span className="text-sm text-foreground">{t("security.session")}</span>
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
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <Link href={`/${locale}/contact`}>
                  <Button size="lg" className="gap-2 h-12 px-8 text-base">
                    {t("cta.contact")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/${locale}/docs`}>
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                    {t("cta.docs")}
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
