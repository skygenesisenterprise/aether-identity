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
  Key,
  Fingerprint,
  Globe,
  Building2,
  Landmark,
  CheckCircle2,
  Wallet,
  CreditCard,
  TrendingUp,
  FileText,
  ArrowRight,
  Server,
  Banknote,
  PieChart,
  BarChart3,
  Handshake,
  Scale,
} from "lucide-react";

export default async function FinancialPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Financial" });

  const benefits = [
    {
      icon: Shield,
      title: t("benefits.psd2.title"),
      description: t("benefits.psd2.description"),
    },
    {
      icon: Lock,
      title: t("benefits.security.title"),
      description: t("benefits.security.description"),
    },
    {
      icon: Fingerprint,
      title: t("benefits.adaptive.title"),
      description: t("benefits.adaptive.description"),
    },
    {
      icon: Users,
      title: t("benefits.ciam.title"),
      description: t("benefits.ciam.description"),
    },
    {
      icon: Key,
      title: t("benefits.rbac.title"),
      description: t("benefits.rbac.description"),
    },
    {
      icon: Globe,
      title: t("benefits.global.title"),
      description: t("benefits.global.description"),
    },
  ];

  const metrics = [
    { value: "99.99%", label: t("metrics.uptime") },
    { value: "< 10ms", label: t("metrics.latency") },
    { value: "100+", label: t("metrics.frameworks") },
    { value: "Zero", label: t("metrics.breaches") },
  ];

  const useCases = [
    {
      icon: Landmark,
      title: t("useCases.retail.title"),
      description: t("useCases.retail.description"),
      features: [
        t("useCases.retail.features.0"),
        t("useCases.retail.features.1"),
        t("useCases.retail.features.2"),
        t("useCases.retail.features.3"),
      ],
    },
    {
      icon: Building2,
      title: t("useCases.corporate.title"),
      description: t("useCases.corporate.description"),
      features: [
        t("useCases.corporate.features.0"),
        t("useCases.corporate.features.1"),
        t("useCases.corporate.features.2"),
        t("useCases.corporate.features.3"),
      ],
    },
    {
      icon: TrendingUp,
      title: t("useCases.trading.title"),
      description: t("useCases.trading.description"),
      features: [
        t("useCases.trading.features.0"),
        t("useCases.trading.features.1"),
        t("useCases.trading.features.2"),
        t("useCases.trading.features.3"),
      ],
    },
    {
      icon: Wallet,
      title: t("useCases.payments.title"),
      description: t("useCases.payments.description"),
      features: [
        t("useCases.payments.features.0"),
        t("useCases.payments.features.1"),
        t("useCases.payments.features.2"),
        t("useCases.payments.features.3"),
      ],
    },
    {
      icon: CreditCard,
      title: t("useCases.cards.title"),
      description: t("useCases.cards.description"),
      features: [
        t("useCases.cards.features.0"),
        t("useCases.cards.features.1"),
        t("useCases.cards.features.2"),
        t("useCases.cards.features.3"),
      ],
    },
    {
      icon: Handshake,
      title: t("useCases.insurance.title"),
      description: t("useCases.insurance.description"),
      features: [
        t("useCases.insurance.features.0"),
        t("useCases.insurance.features.1"),
        t("useCases.insurance.features.2"),
        t("useCases.insurance.features.3"),
      ],
    },
  ];

  const complianceStandards = [
    "PSD2 / Open Banking",
    "PCI-DSS",
    "GDPR",
    "SOX",
    "ISO 27001",
    "eIDAS",
    "AML/KYC",
    "Local Banking Regulations",
  ];

  const securityFeatures = [
    {
      icon: Banknote,
      title: t("security.hsm.title"),
      description: t("security.hsm.description"),
    },
    {
      icon: PieChart,
      title: t("security.fraud.title"),
      description: t("security.fraud.description"),
    },
    {
      icon: BarChart3,
      title: t("security.behavioral.title"),
      description: t("security.behavioral.description"),
    },
    {
      icon: Scale,
      title: t("security.audit.title"),
      description: t("security.audit.description"),
    },
  ];

  const faqs = [
    {
      question: t("faq.psd2.title"),
      answer: t("faq.psd2.answer"),
    },
    {
      question: t("faq.integration.title"),
      answer: t("faq.integration.answer"),
    },
    {
      question: t("faq.performance.title"),
      answer: t("faq.performance.answer"),
    },
    {
      question: t("faq.pci.title"),
      answer: t("faq.pci.answer"),
    },
    {
      question: t("faq.premise.title"),
      answer: t("faq.premise.answer"),
    },
  ];

  const resources = [
    {
      icon: FileText,
      title: t("resources.whitepaper"),
      description: t("resources.whitepaperDesc"),
    },
    {
      icon: FileText,
      title: t("resources.caseStudy"),
      description: t("resources.caseStudyDesc"),
    },
    {
      icon: FileText,
      title: t("resources.technical"),
      description: t("resources.technicalDesc"),
    },
    {
      icon: FileText,
      title: t("resources.compliance"),
      description: t("resources.complianceDesc"),
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

        {/* Benefits Section */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("benefits.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("benefits.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                      <benefit.icon className="h-5 w-5 text-foreground" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">{benefit.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("useCases.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("useCases.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {useCases.map((useCase) => (
                <div
                  key={useCase.title}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <useCase.icon className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{useCase.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {useCase.description}
                  </p>
                  <ul className="space-y-2">
                    {useCase.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Features Section */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("security.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("security.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {securityFeatures.map((feature) => (
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

        {/* Compliance Section */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
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
                    {t("compliance.encryptionRest")}
                  </div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Lock className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">TLS 1.3</div>
                  <div className="text-sm text-muted-foreground">
                    {t("compliance.encryptionTransit")}
                  </div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Server className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">HSM Ready</div>
                  <div className="text-sm text-muted-foreground">{t("compliance.hsm")}</div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Key className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">FIDO2</div>
                  <div className="text-sm text-muted-foreground">
                    {t("compliance.passwordless")}
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

        {/* Integration Partners */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("partners.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("partners.description")}
              </p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
              <div className="text-lg font-semibold text-muted-foreground/60">Temenos</div>
              <div className="text-lg font-semibold text-muted-foreground/60">Fis</div>
              <div className="text-lg font-semibold text-muted-foreground/60">Oracle</div>
              <div className="text-lg font-semibold text-muted-foreground/60">Avaloq</div>
              <div className="text-lg font-semibold text-muted-foreground/60">SDK</div>
              <div className="text-lg font-semibold text-muted-foreground/60">Thales</div>
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
