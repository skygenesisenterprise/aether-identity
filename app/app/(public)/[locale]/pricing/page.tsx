import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { FaqAccordion } from "@/components/public/FaqAccordion";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const tiers = [
  {
    key: "community" as const,
    features: [
      { key: "users100", included: true },
      { key: "oauth", included: true },
      { key: "mfaBasic", included: true },
      { key: "supportEmail", included: true },
      { key: "docsBasic", included: true },
      { key: "deploySelf", included: true },
      { key: "auditBasic", included: true },
      { key: "ssoBasic", included: false },
      { key: "brandingCustom", included: false },
      { key: "slaNone", included: false },
      { key: "supportPriorityExcl", included: false },
    ],
    popular: false,
  },
  {
    key: "professional" as const,
    features: [
      { key: "users10000", included: true },
      { key: "oauth", included: true },
      { key: "mfaAdvanced", included: true },
      { key: "supportPriority", included: true },
      { key: "docsFull", included: true },
      { key: "deploySelf", included: true },
      { key: "auditExtended", included: true },
      { key: "sso50", included: true },
      { key: "brandingCustom", included: true },
      { key: "sla99", included: true },
      { key: "supportPriorityExcl", included: false },
    ],
    popular: true,
  },
  {
    key: "enterprise" as const,
    features: [
      { key: "usersUnlimited", included: true },
      { key: "oauth", included: true },
      { key: "mfaAdvancedFull", included: true },
      { key: "supportDedicated", included: true },
      { key: "docsCustom", included: true },
      { key: "deployBoth", included: true },
      { key: "auditUnlimited", included: true },
      { key: "ssoUnlimited", included: true },
      { key: "brandingFull", included: true },
      { key: "slaHigh", included: true },
      { key: "successManager", included: true },
    ],
    popular: false,
  },
  {
    key: "selfHosted" as const,
    features: [
      { key: "usersUnlimited", included: true },
      { key: "oauth", included: true },
      { key: "mfaAll", included: true },
      { key: "supportCommunity", included: true },
      { key: "docsFull", included: true },
      { key: "deploySelf", included: true },
      { key: "auditUnlimited", included: true },
      { key: "ssoUnlimited", included: true },
      { key: "brandingFull", included: true },
      { key: "slaNone", included: true },
      { key: "supportCommunity", included: true },
    ],
    popular: false,
    badge: true,
  },
];

function FeatureRow({
  feature,
  featureLabel,
}: {
  feature: { included: boolean };
  featureLabel: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground">{featureLabel}</span>
      {feature.included ? (
        <Check className="h-5 w-5 text-emerald-600" />
      ) : (
        <X className="h-5 w-5 text-muted-foreground/30" />
      )}
    </div>
  );
}

export default async function PricingPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Public" });
  const tp = await getTranslations({ locale, namespace: "Public.pricing" });

  const faqs = [
    { question: tp("faq.switchPlans.question"), answer: tp("faq.switchPlans.answer") },
    { question: tp("faq.paymentMethods.question"), answer: tp("faq.paymentMethods.answer") },
    { question: tp("faq.freeTrial.question"), answer: tp("faq.freeTrial.answer") },
    { question: tp("faq.exceedLimit.question"), answer: tp("faq.exceedLimit.answer") },
    { question: tp("faq.refunds.question"), answer: tp("faq.refunds.answer") },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header locale={locale as import("@/lib/locale").Locale} />

      <main className="flex-1">
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground tracking-tight text-balance">
                {tp("hero.title")}
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                {tp("hero.description")}
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {tiers.map((tier) => (
                <div
                  key={tier.key}
                  className={`relative rounded-xl border p-8 flex flex-col ${
                    tier.popular
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                      : "border-border bg-card"
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                        {tp("tiers.mostPopular")}
                      </span>
                    </div>
                  )}
                  {tier.badge && !tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {tp(`tiers.${tier.key}.badge`)}
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-foreground">
                      {tp(`tiers.${tier.key}.name`)}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {tp(`tiers.${tier.key}.description`)}
                    </p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-semibold text-foreground">
                        {tp(`tiers.${tier.key}.price`)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {tp(`tiers.${tier.key}.period`)}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 mb-6">
                    <div className="space-y-1">
                      {tier.features.map((feature, idx) => (
                        <FeatureRow
                          key={idx}
                          feature={feature}
                          featureLabel={tp(`features.${feature.key}`)}
                        />
                      ))}
                    </div>
                  </div>

                  <Link href={tp(`hrefs.${tier.key}`)}>
                    <Button
                      className="w-full"
                      variant={tier.popular ? "default" : "outline"}
                      size="lg"
                    >
                      {tp(`tiers.${tier.key}.cta`)}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28 border-t border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-semibold text-foreground">{tp("faq.title")}</h2>
            </div>
            <FaqAccordion faqs={faqs} />
          </div>
        </section>

        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {tp("cta.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">{tp("cta.description")}</p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href={`/${locale}/docs`}>
                  <Button size="lg" className="gap-2 h-12 px-8 text-base">
                    {tp("cta.getStarted")}
                  </Button>
                </Link>
                <Link href={`/${locale}/contact`}>
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                    {tp("cta.contactSales")}
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
