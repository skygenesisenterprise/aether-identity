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
  HeartPulse,
  Stethoscope,
  Hospital,
  UserCog,
  Activity,
  Brain,
  ClipboardCheck,
  Scale,
  CheckCircle2,
  Building2,
  Database,
  Globe,
  Key,
} from "lucide-react";

export default async function HealthcarePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Healthcare" });

  const features = [
    {
      icon: HeartPulse,
      title: t("features.patient.title"),
      description: t("features.patient.description"),
    },
    {
      icon: Stethoscope,
      title: t("features.telemedicine.title"),
      description: t("features.telemedicine.description"),
    },
    {
      icon: Hospital,
      title: t("features.ehr.title"),
      description: t("features.ehr.description"),
    },
    {
      icon: UserCog,
      title: t("features.provider.title"),
      description: t("features.provider.description"),
    },
    {
      icon: Activity,
      title: t("features.monitoring.title"),
      description: t("features.monitoring.description"),
    },
    {
      icon: Brain,
      title: t("features.clinical.title"),
      description: t("features.clinical.description"),
    },
  ];

  const complianceFeatures = [
    {
      icon: Shield,
      title: t("compliance.hipaa.title"),
      description: t("compliance.hipaa.description"),
    },
    {
      icon: ClipboardCheck,
      title: t("compliance.audit.title"),
      description: t("compliance.audit.description"),
    },
    {
      icon: Lock,
      title: t("compliance.encryption.title"),
      description: t("compliance.encryption.description"),
    },
    {
      icon: Scale,
      title: t("compliance.governance.title"),
      description: t("compliance.governance.description"),
    },
  ];

  const metrics = [
    { value: "100%", label: t("metrics.hipaa") },
    { value: "< 15ms", label: t("metrics.latency") },
    { value: "99.99%", label: t("metrics.availability") },
    { value: "Zero", label: t("metrics.breaches") },
  ];

  const useCases = [
    {
      icon: Users,
      title: t("useCases.patient.title"),
      description: t("useCases.patient.description"),
    },
    {
      icon: Building2,
      title: t("useCases.staff.title"),
      description: t("useCases.staff.description"),
    },
    {
      icon: Database,
      title: t("useCases.interoperability.title"),
      description: t("useCases.interoperability.description"),
    },
    {
      icon: Globe,
      title: t("useCases.remote.title"),
      description: t("useCases.remote.description"),
    },
  ];

  const integrations = [
    "Epic MyChart",
    "Cerner PowerChart",
    "Allscripts Sunrise",
    "MEDITECH Expanse",
    "eClinicalWorks",
    "Athenahealth",
    "NextGen Healthcare",
    "MEDITECH",
  ];

  const deploymentOptions = [
    {
      icon: Server,
      title: t("deployment.onPremise"),
      description:
        "Deploy within your data center or private cloud. Air-gapped options available for maximum security environments.",
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
        "Bridge on-premise EHR systems with cloud applications while maintaining consistent identity policies.",
    },
  ];

  const faqs = [
    {
      question: t("faq.hipaa.title"),
      answer: t("faq.hipaa.answer"),
    },
    {
      question: t("faq.ehr.title"),
      answer: t("faq.ehr.answer"),
    },
    {
      question: t("faq.consent.title"),
      answer: t("faq.consent.answer"),
    },
    {
      question: t("faq.credentials.title"),
      answer: t("faq.credentials.answer"),
    },
    {
      question: t("faq.emergency.title"),
      answer: t("faq.emergency.answer"),
    },
  ];

  const resources = [
    {
      icon: FileText,
      title: t("resources.whitepaper"),
      description: t("resources.whitepaperDesc"),
    },
    {
      icon: ClipboardCheck,
      title: t("resources.compliance"),
      description: t("resources.complianceDesc"),
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

        {/* EHR Integrations */}
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
                    <Key className="h-6 w-6 text-foreground mb-2" />
                    <div className="text-lg font-semibold text-foreground">CMEK</div>
                    <div className="text-sm text-muted-foreground">{t("security.keys")}</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span className="text-sm text-foreground">{t("security.saml")}</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span className="text-sm text-foreground">{t("security.smartcard")}</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span className="text-sm text-foreground">{t("security.session")}</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span className="text-sm text-foreground">{t("security.mfa")}</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span className="text-sm text-foreground">{t("security.breakglass")}</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span className="text-sm text-foreground">{t("security.threat")}</span>
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
