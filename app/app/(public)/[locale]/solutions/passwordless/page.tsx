import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import {
  Smartphone,
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
  LogIn,
  UserPlus,
  BarChart3,
  FileText,
  BookOpen,
  Calendar,
  Video,
  Globe,
  Database,
  Rocket,
} from "lucide-react";

export default async function PasswordlessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Passwordless" });

  const benefits = [
    {
      icon: Shield,
      title: t("benefits.security.title"),
      description: t("benefits.security.description"),
    },
    {
      icon: Zap,
      title: t("benefits.ux.title"),
      description: t("benefits.ux.description"),
    },
    {
      icon: Smartphone,
      title: t("benefits.device.title"),
      description: t("benefits.device.description"),
    },
    {
      icon: BarChart3,
      title: t("benefits.support.title"),
      description: t("benefits.support.description"),
    },
  ];

  const methods = [
    {
      title: t("methods.passkeys.title"),
      description: t("methods.passkeys.description"),
      features: [
        t("methods.passkeys.features.0"),
        t("methods.passkeys.features.1"),
        t("methods.passkeys.features.2"),
        t("methods.passkeys.features.3"),
      ],
    },
    {
      title: t("methods.magicLink.title"),
      description: t("methods.magicLink.description"),
      features: [
        t("methods.magicLink.features.0"),
        t("methods.magicLink.features.1"),
        t("methods.magicLink.features.2"),
        t("methods.magicLink.features.3"),
      ],
    },
    {
      title: t("methods.otp.title"),
      description: t("methods.otp.description"),
      features: [
        t("methods.otp.features.0"),
        t("methods.otp.features.1"),
        t("methods.otp.features.2"),
        t("methods.otp.features.3"),
      ],
    },
    {
      title: t("methods.email.title"),
      description: t("methods.email.description"),
      features: [
        t("methods.email.features.0"),
        t("methods.email.features.1"),
        t("methods.email.features.2"),
        t("methods.email.features.3"),
      ],
    },
  ];

  const metrics = [
    { value: "100%", label: t("metrics.eliminatesBreaches") },
    { value: "80%", label: t("metrics.supportTickets") },
    { value: "3x", label: t("metrics.fasterAuth") },
    { value: "< 1%", label: t("metrics.failedLogin") },
  ];

  const useCases = [
    {
      icon: UserPlus,
      title: t("useCases.onboarding.title"),
      description: t("useCases.onboarding.description"),
    },
    {
      icon: LogIn,
      title: t("useCases.employee.title"),
      description: t("useCases.employee.description"),
    },
    {
      icon: Globe,
      title: t("useCases.partner.title"),
      description: t("useCases.partner.description"),
    },
    {
      icon: Database,
      title: t("useCases.admin.title"),
      description: t("useCases.admin.description"),
    },
  ];

  const comparison = [
    {
      method: t("comparison.security"),
      password: t("comparison.password"),
      passkey: "Very High",
      magicLink: "High",
      otp: "Medium",
    },
    {
      method: t("comparison.experience"),
      password: "Medium",
      passkey: "Excellent",
      magicLink: "Good",
      otp: "Good",
    },
    {
      method: t("comparison.complexity"),
      password: "N/A",
      passkey: "Low",
      magicLink: "Low",
      otp: "Low",
    },
    {
      method: t("comparison.dependency"),
      password: "None",
      passkey: "High",
      magicLink: "Low",
      otp: "Medium",
    },
    {
      method: t("comparison.recovery"),
      password: "Password reset",
      passkey: "Account recovery",
      magicLink: "Resend link",
      otp: "Resend code",
    },
  ];

  const complianceStandards = [
    t("compliance.fido"),
    t("compliance.eidas"),
    t("compliance.gdpr"),
    t("compliance.soc"),
    t("compliance.iso"),
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
      icon: Calendar,
      title: t("resources.webinar"),
      description: t("resources.webinarDesc"),
    },
    {
      icon: Video,
      title: t("resources.video"),
      description: t("resources.videoDesc"),
    },
  ];

  const faqs = [
    {
      question: t("faq.what.title"),
      answer: t("faq.what.answer"),
    },
    {
      question: t("faq.safe.title"),
      answer: t("faq.safe.answer"),
    },
    {
      question: t("faq.lost.title"),
      answer: t("faq.lost.answer"),
    },
    {
      question: t("faq.alongside.title"),
      answer: t("faq.alongside.answer"),
    },
    {
      question: t("faq.offline.title"),
      answer: t("faq.offline.answer"),
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
                <Link href={`/${locale}/docs/guides/passwordless`}>
                  <Button size="lg" className="gap-2 h-12 px-6 text-base">
                    {t("hero.ctaDocs")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/${locale}/contact`}>
                  <Button variant="outline" size="lg" className="h-12 px-6 text-base">
                    {t("hero.ctaContact")}
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
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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

        {/* Authentication Methods */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("methods.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("methods.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {methods.map((method) => (
                <div
                  key={method.title}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-2">{method.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {method.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {method.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-2.5 py-1 text-xs bg-muted rounded-md text-muted-foreground"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("comparison.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("comparison.description")}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-150">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">
                      {t("comparison.criteria")}
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">
                      {t("comparison.password")}
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">
                      {t("comparison.passkey")}
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">
                      {t("comparison.magicLink")}
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">
                      {t("comparison.otp")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr key={row.method} className="border-b border-border/50">
                      <td className="py-4 px-4 text-sm text-foreground">{row.method}</td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">{row.password}</td>
                      <td className="py-4 px-4 text-sm font-semibold text-foreground">
                        {row.passkey}
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">{row.magicLink}</td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">{row.otp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Use Cases */}
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

        {/* Implementation Section */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                  {t("implementation.title")}
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  {t("implementation.description")}
                </p>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    <span className="text-sm text-foreground">
                      {t("implementation.checklist.webauthn")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    <span className="text-sm text-foreground">
                      {t("implementation.checklist.magic")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    <span className="text-sm text-foreground">
                      {t("implementation.checklist.totp")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    <span className="text-sm text-foreground">
                      {t("implementation.checklist.adaptive")}
                    </span>
                  </div>
                </div>
                <div className="mt-8">
                  <Link href={`/${locale}/docs/guides/passwordless`}>
                    <Button size="lg" className="gap-2">
                      <Rocket className="h-4 w-4" />
                      {t("implementation.cta")}
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg border border-border p-6">
                <div className="text-sm text-muted-foreground mb-4">
                  {t("implementation.example")}
                </div>
                <pre className="text-sm text-foreground overflow-x-auto">
                  <code>{`import { AetherClient } from '@aether-identity/node';

const aether = new AetherClient({
  domain: 'auth.yourcompany.com',
  clientId: process.env.AETHER_CLIENT_ID,
});

// Enable passkey registration
await aether.auth.passwordless.register({
  credentialType: 'public-key',
  relyingParty: {
    name: 'Your Application',
    id: 'yourcompany.com',
  },
  user: {
    name: 'user@example.com',
    displayName: 'John Doe',
  },
});`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance Section */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("compliance.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("compliance.description")}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {complianceStandards.map((standard) => (
                <div
                  key={standard}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="text-sm text-foreground">{standard}</span>
                </div>
              ))}
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
                <Link href={`/${locale}/docs/guides/passwordless`}>
                  <Button size="lg" className="gap-2 h-12 px-8 text-base">
                    {t("cta.getStarted")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/${locale}/contact`}>
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                    {t("cta.contact")}
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
