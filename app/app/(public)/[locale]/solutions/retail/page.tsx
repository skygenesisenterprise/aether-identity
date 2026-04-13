import Link from "next/link";
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

const features = [
  {
    icon: ShoppingCart,
    title: "E-Commerce Authentication",
    description:
      "Secure customer login for online stores with MFA, social login integration, and seamless checkout experiences that reduce cart abandonment.",
  },
  {
    icon: CreditCard,
    title: "Payment Security",
    description:
      "PCI-DSS compliant authentication for payment processing, tokenization support, and secure card-not-present transactions.",
  },
  {
    icon: Store,
    title: "POS Integration",
    description:
      "Unified identity across in-store, online, and mobile channels. Support for RFID, barcode, and biometric authentication at point of sale.",
  },
  {
    icon: Users,
    title: "Loyalty Program Management",
    description:
      "Single customer identity across all touchpoints. Link loyalty accounts, track preferences, and deliver personalized experiences.",
  },
  {
    icon: Smartphone,
    title: "Mobile App Security",
    description:
      "Secure mobile authentication with device fingerprinting, push notifications, and biometric support for retail apps.",
  },
  {
    icon: TrendingUp,
    title: "Fraud Prevention",
    description:
      "Real-time risk assessment, adaptive authentication, and anomaly detection to prevent account takeover and fraudulent transactions.",
  },
];

const complianceFeatures = [
  {
    icon: Shield,
    title: "PCI-DSS Compliance",
    description:
      "Full PCI-DSS compliance for payment authentication. Tokenization and encryption to protect cardholder data.",
  },
  {
    icon: Lock,
    title: "Data Encryption",
    description:
      "AES-256 encryption at rest and TLS 1.3 in transit. Customer-managed encryption keys available for on-premise deployments.",
  },
  {
    icon: Users2,
    title: "GDPR Ready",
    description:
      "Customer data handling compliant with GDPR. Right to erasure, data portability, and consent management built-in.",
  },
  {
    icon: Key,
    title: "Access Governance",
    description:
      "Role-based access control for retail staff, franchisees, and partners. Granular permissions for inventory, pricing, and customer data.",
  },
];

const metrics = [
  { value: "40%", label: "Reduced cart abandonment" },
  { value: "< 15ms", label: "Authentication latency" },
  { value: "99.99%", label: "System availability" },
  { value: "60%", label: "Fraud reduction" },
];

const useCases = [
  {
    icon: Globe,
    title: "Omnichannel Commerce",
    description:
      "Unified customer identity across web, mobile, and physical stores. Consistent personalization and loyalty tracking.",
  },
  {
    icon: Tag,
    title: "Staff Access Control",
    description:
      "Manage employee, contractor, and franchisee credentials with role-based access to inventory, pricing, and reporting systems.",
  },
  {
    icon: Wallet,
    title: "Digital Wallets",
    description:
      "Secure integration with Apple Pay, Google Pay, and Samsung Pay for frictionless in-store and online payments.",
  },
  {
    icon: Package,
    title: "Supply Chain Partners",
    description:
      "B2B authentication for suppliers, distributors, and logistics partners with secure API access and audit trails.",
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
    title: "On-Premise",
    description:
      "Deploy within your data center for complete control over customer data and authentication infrastructure.",
  },
  {
    icon: Database,
    title: "Private Cloud",
    description:
      "Dedicated infrastructure in your cloud environment (AWS, Azure, GCP) with full data sovereignty.",
  },
  {
    icon: Globe,
    title: "Hybrid",
    description:
      "Connect on-premise POS systems with cloud e-commerce platforms while maintaining consistent identity policies.",
  },
];

const faqs = [
  {
    question: "How does Aether handle PCI-DSS compliance?",
    answer:
      "Aether Identity is designed to meet PCI-DSS requirements for payment authentication. We provide tokenization, encryption, and access controls that help you maintain compliance. Aether can also integrate with your existing payment gateway.",
  },
  {
    question: "Can we integrate with our existing e-commerce platform?",
    answer:
      "Yes, Aether supports OAuth 2.0/OpenID Connect integrations with all major e-commerce platforms including Shopify, Magento, Salesforce Commerce Cloud, and custom implementations via our API.",
  },
  {
    question: "How does Aether support omnichannel retail?",
    answer:
      "Aether provides a unified customer identity that works across web, mobile, and physical stores. Customers can authenticate once and enjoy seamless experiences across all channels with consistent loyalty tracking and personalization.",
  },
  {
    question: "Can we use our existing loyalty program with Aether?",
    answer:
      "Yes, Aether integrates with existing loyalty programs via API. We can federate loyalty identities, link customer accounts, and synchronize preferences across channels.",
  },
  {
    question: "What fraud prevention features are included?",
    answer:
      "Aether includes device fingerprinting, behavioral analysis, risk-based authentication, and real-time threat detection. You can configure adaptive policies based on transaction risk, geography, and user behavior.",
  },
];

const resources = [
  {
    icon: FileText,
    title: "Whitepaper",
    description: "Retail Identity Management Guide",
  },
  {
    icon: ShoppingCart,
    title: "E-Book",
    description: "Omnichannel Commerce Security",
  },
  {
    icon: Calendar,
    title: "Webinar",
    description: "PCI-DSS Compliance for Retail",
  },
  {
    icon: BarChart3,
    title: "Case Study",
    description: "Global Retailer Migration Success",
  },
];

export default async function RetailPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

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
                Retail Solutions
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight text-balance">
                Secure Identity for Modern Retail
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Protect customer accounts, secure payments, and deliver seamless omnichannel
                experiences with enterprise-grade identity management built for retail.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                <Link href="/contact">
                  <Button size="lg" className="gap-2 h-12 px-6 text-base">
                    Request Demo
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/docs">
                  <Button variant="outline" size="lg" className="gap-2 h-12 px-6 text-base">
                    View Documentation
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
                Built for Retail Operations
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Every feature designed to meet the unique security, customer experience, and
                operational requirements of modern retail.
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

        {/* Compliance Section */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Retail Compliance Built-In
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Meet PCI-DSS, GDPR, and emerging retail data regulations with confidence.
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
                Comprehensive Use Cases
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                From customer authentication to supply chain security, Aether secures every
                touchpoint in the retail ecosystem.
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
                E-Commerce Platform Integrations
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Seamless integration with the retail platforms you already use.
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
              Don&apos;t see your platform? Contact us for custom integration support.
            </p>
          </div>
        </section>

        {/* Deployment Options */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Deploy According to Your Policy
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Whether you require complete on-premise control or cloud scalability, Aether adapts
                to your infrastructure and data residency requirements.
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
                  Enterprise Security for Retail Data
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  Protect customer information and payment data with security controls designed
                  specifically for retail environments.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <Shield className="h-6 w-6 text-foreground mb-2" />
                    <div className="text-lg font-semibold text-foreground">AES-256</div>
                    <div className="text-sm text-muted-foreground">Encryption at rest</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <Lock className="h-6 w-6 text-foreground mb-2" />
                    <div className="text-lg font-semibold text-foreground">TLS 1.3</div>
                    <div className="text-sm text-muted-foreground">Encryption in transit</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <Fingerprint className="h-6 w-6 text-foreground mb-2" />
                    <div className="text-lg font-semibold text-foreground">WebAuthn</div>
                    <div className="text-sm text-muted-foreground">Biometric support</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <QrCode className="h-6 w-6 text-foreground mb-2" />
                    <div className="text-lg font-semibold text-foreground">Tokenization</div>
                    <div className="text-sm text-muted-foreground">Payment tokens</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span className="text-sm text-foreground">
                    OAuth 2.0 / OpenID Connect support
                  </span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span className="text-sm text-foreground">
                    Social login (Google, Apple, Facebook)
                  </span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span className="text-sm text-foreground">
                    Device fingerprinting & risk assessment
                  </span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span className="text-sm text-foreground">
                    Multi-factor authentication (TOTP, SMS, email)
                  </span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span className="text-sm text-foreground">
                    Real-time fraud detection & alerting
                  </span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span className="text-sm text-foreground">
                    Session management across channels
                  </span>
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
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Common questions about retail identity management.
              </p>
            </div>
            <FaqAccordion faqs={faqs} />
          </div>
        </section>

        {/* Resources Section */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">Resources</h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Explore guides, compliance documentation, and case studies for retail identity.
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
                Secure Your Retail Identity Today
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join retailers that trust Aether Identity to protect customer data and deliver
                seamless shopping experiences.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/contact">
                  <Button size="lg" className="gap-2 h-12 px-8 text-base">
                    Request a Demo
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/docs">
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                    View Documentation
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
