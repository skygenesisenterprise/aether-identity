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
  Zap,
  ArrowRight,
  Server,
  Globe,
  Building2,
  CheckCircle2,
  HeadphonesIcon,
  Clock,
  BarChart3,
  FileText,
  BookOpen,
  Calendar,
  Mail,
  MessageSquare,
  CreditCard,
  Star,
  Award,
  Briefcase,
  Globe2,
  Scale,
} from "lucide-react";

export default async function EnterprisePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Enterprise" });

  const enterpriseFeatures = [
    { icon: Shield, titleKey: "features.security", descKey: "features.securityDesc" },
    { icon: HeadphonesIcon, titleKey: "features.support", descKey: "features.supportDesc" },
    { icon: Scale, titleKey: "features.scaling", descKey: "features.scalingDesc" },
    { icon: Clock, titleKey: "features.sla", descKey: "features.slaDesc" },
    { icon: Key, titleKey: "features.mfa", descKey: "features.mfaDesc" },
    { icon: Users, titleKey: "features.federation", descKey: "features.federationDesc" },
  ];

  const includedFeatures = [
    { icon: Globe, titleKey: "included.global", descKey: "included.globalDesc" },
    { icon: BarChart3, titleKey: "included.analytics", descKey: "included.analyticsDesc" },
    { icon: FileText, titleKey: "included.compliance", descKey: "included.complianceDesc" },
    { icon: Zap, titleKey: "included.performance", descKey: "included.performanceDesc" },
    { icon: Server, titleKey: "included.private", descKey: "included.privateDesc" },
    { icon: CreditCard, titleKey: "included.billing", descKey: "included.billingDesc" },
  ];

  const plans = [
    {
      nameKey: "plans.starter",
      priceKey: "plans.custom",
      descKey: "plans.starterDesc",
      featuresKey: "plans.starterFeatures",
      ctaKey: "plans.cta",
      popular: false,
    },
    {
      nameKey: "plans.professional",
      priceKey: "plans.custom",
      descKey: "plans.professionalDesc",
      featuresKey: "plans.professionalFeatures",
      ctaKey: "plans.cta",
      popular: true,
    },
    {
      nameKey: "plans.enterprise",
      priceKey: "plans.custom",
      descKey: "plans.enterpriseDesc",
      featuresKey: "plans.enterpriseFeatures",
      ctaKey: "plans.cta",
      popular: false,
    },
  ];

  const testimonials = [
    {
      quoteKey: "testimonials.quote1",
      authorKey: "testimonials.author1",
      roleKey: "testimonials.role1",
      companyKey: "testimonials.company1",
    },
    {
      quoteKey: "testimonials.quote2",
      authorKey: "testimonials.author2",
      roleKey: "testimonials.role2",
      companyKey: "testimonials.company2",
    },
    {
      quoteKey: "testimonials.quote3",
      authorKey: "testimonials.author3",
      roleKey: "testimonials.role3",
      companyKey: "testimonials.company3",
    },
  ];

  const industries = [
    { icon: Briefcase, titleKey: "industries.financial", descKey: "industries.financialDesc" },
    { icon: Shield, titleKey: "industries.healthcare", descKey: "industries.healthcareDesc" },
    { icon: Globe2, titleKey: "industries.government", descKey: "industries.governmentDesc" },
    { icon: Award, titleKey: "industries.technology", descKey: "industries.technologyDesc" },
  ];

  const resources = [
    { icon: BookOpen, titleKey: "resources.architecture", descKey: "resources.architectureDesc" },
    { icon: FileText, titleKey: "resources.security", descKey: "resources.securityDesc" },
    { icon: Calendar, titleKey: "resources.demo", descKey: "resources.demoDesc" },
    { icon: MessageSquare, titleKey: "resources.contact", descKey: "resources.contactDesc" },
  ];

  const faqs = [
    { questionKey: "faq.included.title", answerKey: "faq.included.answer" },
    { questionKey: "faq.contract.title", answerKey: "faq.contract.answer" },
    { questionKey: "faq.onpremise.title", answerKey: "faq.onpremise.answer" },
    { questionKey: "faq.support.title", answerKey: "faq.support.answer" },
    { questionKey: "faq.migration.title", answerKey: "faq.migration.answer" },
  ];

  const faqItems = faqs.map((faq) => ({
    question: t(faq.questionKey),
    answer: t(faq.answerKey),
  }));

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
                <Link href="#plans">
                  <Button size="lg" className="gap-2 h-12 px-6 text-base">
                    {t("hero.ctaPlans")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/${locale}/contact`}>
                  <Button variant="outline" size="lg" className="gap-2 h-12 px-6 text-base">
                    {t("hero.ctaContact")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Enterprise Features */}
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {enterpriseFeatures.map((feature) => (
                <div key={feature.titleKey} className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                      <feature.icon className="h-5 w-5 text-foreground" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">
                      {t(feature.titleKey)}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-13">
                    {t(feature.descKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Included Features */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("included.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("included.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {includedFeatures.map((feature) => (
                <div
                  key={feature.titleKey}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <feature.icon className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(feature.descKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section id="plans" className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("plans.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("plans.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.nameKey}
                  className={`relative p-6 rounded-lg border bg-card transition-colors ${
                    plan.popular
                      ? "border-emerald-500 ring-1 ring-emerald-500"
                      : "border-border hover:border-foreground/20"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500 text-white">
                        {t("plans.mostPopular")}
                      </span>
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-foreground">{t(plan.nameKey)}</h3>
                    <div className="mt-2 text-3xl font-semibold text-foreground">
                      {t(plan.priceKey)}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{t(plan.descKey)}</p>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {t.raw(plan.featuresKey).map((feature: string) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/${locale}/contact`} className="block">
                    <Button
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                      size="lg"
                    >
                      {t(plan.ctaKey)}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industries */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
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
                  key={industry.titleKey}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <industry.icon className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t(industry.titleKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(industry.descKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("testimonials.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("testimonials.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.authorKey}
                  className="p-6 rounded-lg border border-border bg-card"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed mb-4">
                    &ldquo;{t(testimonial.quoteKey)}&rdquo;
                  </p>
                  <div>
                    <div className="font-semibold text-foreground">{t(testimonial.authorKey)}</div>
                    <div className="text-sm text-muted-foreground">
                      {t(testimonial.roleKey)}, {t(testimonial.companyKey)}
                    </div>
                  </div>
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
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="text-sm text-foreground">{t("compliance.soc2")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="text-sm text-foreground">{t("compliance.gdpr")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="text-sm text-foreground">{t("compliance.hipaa")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="text-sm text-foreground">{t("compliance.iso")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="text-sm text-foreground">{t("compliance.fedramp")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="text-sm text-foreground">{t("compliance.pci")}</span>
                  </div>
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
                  <Building2 className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">Air-Gap</div>
                  <div className="text-sm text-muted-foreground">
                    {t("compliance.deploymentReady")}
                  </div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Zap className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">Audit Logs</div>
                  <div className="text-sm text-muted-foreground">{t("compliance.auditTrails")}</div>
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
            <FaqAccordion faqs={faqItems} />
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
                <Link
                  key={resource.titleKey}
                  href={`/${locale}/contact`}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors group"
                >
                  <resource.icon className="h-8 w-8 text-foreground mb-4 group-hover:text-emerald-600 transition-colors" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t(resource.titleKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(resource.descKey)}
                  </p>
                </Link>
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
                    {t("cta.cta")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="mailto:sales@skygenesisenterprise.com">
                  <Button variant="outline" size="lg" className="gap-2 h-12 px-8 text-base">
                    <Mail className="h-4 w-4" />
                    sales@skygenesisenterprise.com
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
