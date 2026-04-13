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
  Zap,
  ArrowRight,
  Server,
  Building2,
  CheckCircle2,
  FileCheck,
  Handshake,
  Bus,
  ClipboardList,
  Search,
  GraduationCap,
  Vote,
  Banknote,
  AlertTriangle,
  FileText,
  Calendar,
  BarChart3,
  Clock,
  Scale,
  Database,
  Cloud,
  Landmark,
  UserCheck,
  Key,
  Signal,
} from "lucide-react";

export default async function GovernmentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Government" });

  const capabilities = [
    {
      icon: Building2,
      title: t("capabilities.fedramp.title"),
      description: t("capabilities.fedramp.description"),
    },
    {
      icon: Key,
      title: t("capabilities.icam.title"),
      description: t("capabilities.icam.description"),
    },
    {
      icon: Shield,
      title: t("capabilities.zeroTrust.title"),
      description: t("capabilities.zeroTrust.description"),
    },
    {
      icon: Database,
      title: t("capabilities.premise.title"),
      description: t("capabilities.premise.description"),
    },
    {
      icon: Users,
      title: t("capabilities.citizen.title"),
      description: t("capabilities.citizen.description"),
    },
    {
      icon: FileCheck,
      title: t("capabilities.audit.title"),
      description: t("capabilities.audit.description"),
    },
  ];

  const certifications = [
    { name: "FedRAMP Ready", status: "In Progress" },
    { name: "FIPS 140-2", status: "Certified" },
    { name: "SOC 2 Type II", status: "Certified" },
    { name: "NIST SP 800-53", status: "Compliant" },
    { name: "WCAG 2.1 AA", status: "Compliant" },
    { name: "Section 508", status: "Compliant" },
  ];

  const governmentSolutions = [
    {
      icon: UserCheck,
      title: t("solutions.employee.title"),
      description: t("solutions.employee.description"),
    },
    {
      icon: Bus,
      title: t("solutions.transport.title"),
      description: t("solutions.transport.description"),
    },
    {
      icon: GraduationCap,
      title: t("solutions.education.title"),
      description: t("solutions.education.description"),
    },
    {
      icon: Vote,
      title: t("solutions.elections.title"),
      description: t("solutions.elections.description"),
    },
    {
      icon: Banknote,
      title: t("solutions.benefits.title"),
      description: t("solutions.benefits.description"),
    },
    {
      icon: Search,
      title: t("solutions.law.title"),
      description: t("solutions.law.description"),
    },
  ];

  const deploymentOptions = [
    {
      icon: Database,
      title: t("deployment.cloud"),
      description:
        "Deploy on AWS GovCloud, Azure Government, or Google Cloud for Government with FedRAMP compliance.",
    },
    {
      icon: Server,
      title: t("deployment.onPremise"),
      description:
        "Full control in your data center with air-gapped deployment options and government-approved hosting.",
    },
    {
      icon: Cloud,
      title: t("deployment.hybrid"),
      description:
        "Bridge on-premise systems with cloud applications through secure federation and API integration.",
    },
  ];

  const complianceStandards = [
    "FedRAMP",
    "FISMA",
    "NIST SP 800-53",
    "HIPAA",
    "Section 508",
    "WCAG 2.1",
    "E-Gov",
    "Civic Services",
  ];

  const agencyTypes = [
    { name: t("agencies.federal"), count: "24" },
    { name: t("agencies.state"), count: "50" },
    { name: t("agencies.local"), count: "500+" },
    { name: t("agencies.international"), count: "12" },
  ];

  const benefits = [
    {
      title: t("benefits.ato.title"),
      description: t("benefits.ato.description"),
      icon: Clock,
    },
    {
      title: t("benefits.costs.title"),
      description: t("benefits.costs.description"),
      icon: Landmark,
    },
    {
      title: t("benefits.control.title"),
      description: t("benefits.control.description"),
      icon: Lock,
    },
    {
      title: t("benefits.interop.title"),
      description: t("benefits.interop.description"),
      icon: Handshake,
    },
  ];

  const faqs = [
    {
      question: t("faq.fedramp.title"),
      answer: t("faq.fedramp.answer"),
    },
    {
      question: t("faq.piv.title"),
      answer: t("faq.piv.answer"),
    },
    {
      question: t("faq.airgap.title"),
      answer: t("faq.airgap.answer"),
    },
    {
      question: t("faq.agencies.title"),
      answer: t("faq.agencies.answer"),
    },
    {
      question: t("faq.section508.title"),
      answer: t("faq.section508.answer"),
    },
  ];

  const resources = [
    {
      icon: FileText,
      title: t("resources.whitepaper"),
      description: t("resources.whitepaperDesc"),
    },
    {
      icon: ClipboardList,
      title: t("resources.caseStudy"),
      description: t("resources.caseStudyDesc"),
    },
    {
      icon: Calendar,
      title: t("resources.webinar"),
      description: t("resources.webinarDesc"),
    },
    {
      icon: BarChart3,
      title: t("resources.calculator"),
      description: t("resources.calculatorDesc"),
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

        {/* Agency Types */}
        <section className="py-16 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {agencyTypes.map((agency) => (
                <div key={agency.name}>
                  <div className="text-3xl sm:text-4xl font-semibold text-foreground">
                    {agency.count}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">{agency.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Capabilities Section */}
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
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {capability.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("certifications.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("certifications.description")}
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {certifications.map((cert) => (
                <div
                  key={cert.name}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-card"
                >
                  <span className="text-sm font-medium text-foreground">{cert.name}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      cert.status === "Certified"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : cert.status === "Compliant"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                    }`}
                  >
                    {cert.status}
                  </span>
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
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="p-6 rounded-lg border border-border bg-card">
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

        {/* Government Solutions */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("solutions.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("solutions.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {governmentSolutions.map((solution) => (
                <div
                  key={solution.title}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <solution.icon className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{solution.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {solution.description}
                  </p>
                </div>
              ))}
            </div>
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

        {/* Compliance Section */}
        <section className="py-20 lg:py-28">
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
                  <Scale className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">FIPS 140-2</div>
                  <div className="text-sm text-muted-foreground">{t("compliance.fips")}</div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Signal className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">TLS 1.3</div>
                  <div className="text-sm text-muted-foreground">{t("compliance.tls")}</div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <AlertTriangle className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">NIST</div>
                  <div className="text-sm text-muted-foreground">{t("compliance.nist")}</div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Zap className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">Audit Logs</div>
                  <div className="text-sm text-muted-foreground">{t("compliance.audit")}</div>
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
