import Link from "next/link";
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

const benefits = [
  {
    icon: Shield,
    title: "PSD2 & Open Banking Compliance",
    description:
      "Built-in support for PSD2 regulatory requirements, secure API access, and third-party provider (TPP) integration.",
  },
  {
    icon: Lock,
    title: "Multi-Layered Security",
    description:
      "End-to-end encryption, hardware security module (HSM) integration, and real-time fraud detection capabilities.",
  },
  {
    icon: Fingerprint,
    title: "Adaptive Authentication",
    description:
      "Risk-based authentication with biometric verification, device fingerprinting, and behavioral analysis.",
  },
  {
    icon: Users,
    title: "Customer Identity & Access Management",
    description:
      "Seamless onboarding with progressive profiling, self-service account management, and consent management.",
  },
  {
    icon: Key,
    title: "Role-Based Access Control",
    description:
      "Granular permissions for internal staff, external auditors, and third-party service providers with full audit trails.",
  },
  {
    icon: Globe,
    title: "Global Regulatory Support",
    description:
      "Pre-configured compliance templates for GDPR, PCI-DSS, SOX, and local banking regulations across jurisdictions.",
  },
];

const metrics = [
  { value: "99.99%", label: "Uptime SLA" },
  { value: "< 10ms", label: "Authentication latency" },
  { value: "100+", label: "Compliance frameworks" },
  { value: "Zero", label: "Data breaches" },
];

const useCases = [
  {
    icon: Landmark,
    title: "Retail Banking",
    description:
      "Secure customer authentication for online and mobile banking with PSD2-compliant strong customer authentication (SCA).",
    features: [
      "Mobile banking authentication",
      "Biometric login support",
      "Transaction authorization",
      "Account takeover protection",
    ],
  },
  {
    icon: Building2,
    title: "Corporate Banking",
    description:
      "Enterprise-grade identity management for business banking portals, treasury operations, and payment workflows.",
    features: [
      "Multi-factor authentication",
      "API security for treasury",
      "Delegation & approval workflows",
      "Audit-ready logging",
    ],
  },
  {
    icon: TrendingUp,
    title: "Trading Platforms",
    description:
      "High-assurance authentication for trading applications requiring real-time identity verification and compliance.",
    features: [
      "Real-time identity verification",
      "Regulatory compliance automation",
      "Session management",
      "Trade audit trails",
    ],
  },
  {
    icon: Wallet,
    title: "Payment Services",
    description:
      "Secure payment authentication for PSPs, e-wallets, and payment gateways with 3D Secure 2.0 support.",
    features: [
      "3D Secure 2.0 integration",
      "Payment tokenization",
      "Fraud prevention",
      "PCI-DSS compliance",
    ],
  },
  {
    icon: CreditCard,
    title: "Card Issuers",
    description:
      "Cardholder authentication for digital card management, instant issuance, and dynamic card controls.",
    features: [
      "Virtual card activation",
      "Spending limit controls",
      "Geolocation alerts",
      "Instant notifications",
    ],
  },
  {
    icon: Handshake,
    title: "Insurance",
    description:
      "Secure portals for policyholders, agents, and claims processing with identity verification for sensitive operations.",
    features: [
      "Policyholder self-service",
      "Agent authentication",
      "Claims workflow security",
      "Document signing verification",
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
  " AML/KYC",
  "Local Banking Regulations",
];

const securityFeatures = [
  {
    icon: Banknote,
    title: "Hardware Security Module (HSM)",
    description: "Integrate with Thales, Utimaco, or cloud HSMs for cryptographic key protection.",
  },
  {
    icon: PieChart,
    title: "Fraud Detection Integration",
    description:
      "Connect with fraud detection platforms to assess risk in real-time during authentication.",
  },
  {
    icon: BarChart3,
    title: "Behavioral Analytics",
    description: "Machine learning-based anomaly detection to identify suspicious login patterns.",
  },
  {
    icon: Scale,
    title: "Audit & Compliance Reporting",
    description: "Automated compliance reports for regulatory examinations and internal audits.",
  },
];

const faqs = [
  {
    question: "How does Aether support PSD2 compliance?",
    answer:
      "Aether provides built-in support for PSD2 requirements including strong customer authentication (SCA), secure communication APIs for TPP access, consent management, and dynamic linking. Our solution is regularly updated to reflect the latest EBA guidelines.",
  },
  {
    question: "Can Aether integrate with our existing banking core systems?",
    answer:
      "Yes, Aether provides pre-built integrations with major banking platforms including Fis, Temenos, Avaloq, and Oracle Flexcube. Our professional services team can also build custom integrations for legacy systems.",
  },
  {
    question: "How does Aether handle high-volume authentication for trading platforms?",
    answer:
      "Aether is built for high-performance scenarios with sub-10ms authentication latency. Our distributed architecture supports horizontal scaling and can handle millions of authentications per day with 99.99% uptime.",
  },
  {
    question: "Is Aether certified for PCI-DSS?",
    answer:
      "Aether can be deployed in a PCI-DSS compliant manner. When deployed according to our security guidelines and combined with your card infrastructure, Aether helps you meet PCI-DSS requirements for authentication and access control.",
  },
  {
    question:
      "Do you offer on-premise deployment for banks with strict data residency requirements?",
    answer:
      "Yes, Aether supports full on-premise deployment including air-gapped installations. We also offer cloud deployments in specific regions to meet data residency requirements in jurisdictions like Germany, France, and Switzerland.",
  },
];

const resources = [
  {
    icon: FileText,
    title: "Whitepaper",
    description: "Financial Services Identity Architecture Guide",
  },
  {
    icon: FileText,
    title: "Case Study",
    description: "How a European Bank Achieved PSD2 Compliance",
  },
  {
    icon: FileText,
    title: "Technical Guide",
    description: "Integration with Core Banking Systems",
  },
  {
    icon: FileText,
    title: "Compliance Brief",
    description: "PSD2 SCA Implementation Best Practices",
  },
];

export default async function FinancialPage({ params }: { params: Promise<{ locale: string }> }) {
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
                Financial Services Solutions
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight text-balance">
                Secure Identity Infrastructure for Financial Institutions
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Enterprise-grade identity and access management built for banks, payment service
                providers, and fintech companies. Meet regulatory requirements while delivering
                seamless customer experiences.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                <Link href="/contact">
                  <Button size="lg" className="gap-2 h-12 px-6 text-base">
                    Contact Sales
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

        {/* Benefits Section */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Built for Financial Services
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Purpose-built identity management that addresses the unique security, compliance,
                and user experience requirements of the financial industry.
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
                  <p className="text-sm text-muted-foreground leading-relaxed pl-13">
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
                Solutions for Every Financial Service
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Tailored identity management for retail banking, corporate banking, trading,
                payments, and insurance.
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
                Enterprise Security Features
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Financial-grade security capabilities that meet the most stringent requirements for
                protection of customer assets and data.
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
                  Regulatory Compliance Built-In
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  Aether Identity comes pre-configured with compliance templates and automation for
                  major financial regulations, reducing implementation time and ensuring continuous
                  compliance.
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
                  <div className="text-sm text-muted-foreground">Encryption at rest</div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Lock className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">TLS 1.3</div>
                  <div className="text-sm text-muted-foreground">Encryption in transit</div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Server className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">HSM Ready</div>
                  <div className="text-sm text-muted-foreground">Key protection</div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Key className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">FIDO2</div>
                  <div className="text-sm text-muted-foreground">Passwordless auth</div>
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
                Common questions about financial services identity management.
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
                Explore our documentation, compliance guides, and case studies for financial
                services.
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
                Integration with Banking Systems
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Seamlessly integrate with your existing core banking, payment processing, and fraud
                detection systems.
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
                Secure Your Financial Services Infrastructure
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Deploy enterprise-grade identity management that meets regulatory requirements and
                delivers seamless customer experiences.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/contact">
                  <Button size="lg" className="gap-2 h-12 px-8 text-base">
                    Contact Sales
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
