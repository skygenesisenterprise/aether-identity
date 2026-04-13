import Link from "next/link";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { GitHubIcon } from "@/components/ui/icons/GitHubIcon";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import {
  Shield,
  Lock,
  Users,
  Key,
  Fingerprint,
  Zap,
  ArrowRight,
  Globe,
  Code2,
  Building2,
  CheckCircle2,
  ShoppingCart,
  HeartPulse,
  Mail,
  Smartphone,
  UserCheck,
  Database,
  Cloud,
  FileText,
  BookOpen,
  BarChart3,
  Clock,
  X,
  Eye,
  HandHeart,
  Bell,
  CreditCard,
  Wallet,
} from "lucide-react";

const capabilities = [
  {
    icon: Fingerprint,
    title: "Biometric Authentication",
    description:
      "Face ID, Touch ID, and WebAuthn support for seamless passwordless login across web and mobile applications.",
  },
  {
    icon: Mail,
    title: "Social Login",
    description:
      "One-click authentication with Google, Apple, Facebook, and other major identity providers.",
  },
  {
    icon: Key,
    title: "Magic Links & OTP",
    description:
      "Email and SMS-based authentication eliminating the need for passwords while maintaining security.",
  },
  {
    icon: Users,
    title: "Customer Identity Management",
    description:
      "Complete user profile management with consent tracking, preference centers, and GDPR compliance.",
  },
  {
    icon: Globe,
    title: "Cross-Border Identity",
    description:
      "Support for international phone numbers, identity verification, and localized authentication flows.",
  },
  {
    icon: Shield,
    title: "Fraud Prevention",
    description:
      "Real-time risk analysis, device fingerprinting, and behavioral biometrics to prevent account takeover.",
  },
];

const metrics = [
  { value: "40%", label: "Reduced login friction" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "65%", label: "Higher conversion" },
  { value: "Zero", label: "Passwords to manage" },
];

const loginOptions = [
  {
    icon: Fingerprint,
    title: "Passwordless",
    description:
      "Eliminate passwords entirely with biometric authentication, magic links, or passkeys.",
  },
  {
    icon: Mail,
    title: "Social Providers",
    description:
      "Let users authenticate with their existing Google, Apple, or social media accounts.",
  },
  {
    icon: Smartphone,
    title: "Mobile SSO",
    description: "Seamless authentication across iOS and Android apps with shared credentials.",
  },
  {
    icon: UserCheck,
    title: "Enterprise SSO",
    description: "Bridge consumer and enterprise identities with SAML and OIDC federation.",
  },
];

const complianceStandards = ["GDPR", "CCPA", "SOC 2 Type II", "ISO 27001", "COPPA", "PCI DSS"];

const industries = [
  {
    icon: ShoppingCart,
    title: "E-commerce",
    description: "Streamlined customer accounts, wishlists, and personalized shopping experiences.",
  },
  {
    icon: HeartPulse,
    title: "Healthcare",
    description: "Patient portal authentication with HIPAA-compliant identity verification.",
  },
  {
    icon: Wallet,
    title: "Fintech",
    description: "Secure customer onboarding with identity verification and strong authentication.",
  },
  {
    icon: Globe,
    title: "Marketplaces",
    description: "Buyer and seller identity management with reputation and trust systems.",
  },
];

const faqs = [
  {
    question: "How does B2C authentication differ from B2B?",
    answer:
      "B2C focuses on consumer-facing applications with emphasis on reducing login friction, supporting social logins, and managing consent. B2B typically involves organizational authentication, role-based access, and enterprise federation.",
  },
  {
    question: "Can I migrate existing customer accounts?",
    answer:
      "Yes, we provide migration tools to import users from Auth0, Okta, Firebase Auth, or any custom identity system. We handle password hashing compatibility and seamless transition.",
  },
  {
    question: "How do you handle consent under GDPR?",
    answer:
      "Aether provides built-in consent management with granular preference centers, audit trails for consent changes, and easy data export/deletion for data subject requests.",
  },
  {
    question: "What happens if a user loses their device?",
    answer:
      "Users can recover their account through backup methods like email, phone, or security questions. Administrative recovery options are also available.",
  },
  {
    question: "Do you support progressive profiling?",
    answer:
      "Yes, you can collect user information gradually across sessions to reduce signup friction while building complete user profiles.",
  },
];

const features = [
  {
    title: "Progressive Profiling",
    description:
      "Gather user information gradually to reduce signup friction while building comprehensive customer profiles.",
  },
  {
    title: "Preference Centers",
    description:
      "Allow customers to manage their data, communications, and privacy settings from a single dashboard.",
  },
  {
    title: "Account Linking",
    description:
      "Enable users to link multiple authentication methods to a single account for flexible recovery.",
  },
  {
    title: "Session Management",
    description:
      "Give users visibility into active sessions with the ability to revoke access remotely.",
  },
  {
    title: "Email Verification",
    description:
      "Automated email verification flows with customizable templates and delivery settings.",
  },
  {
    title: "Customer Data Export",
    description: "One-click GDPR-compliant data export in standard formats for portability.",
  },
];

const resources = [
  {
    icon: FileText,
    title: "Whitepaper",
    description: "Consumer Identity architecture Best Practices",
  },
  {
    icon: BookOpen,
    title: "E-book",
    description: "Reducing Customer Login Friction",
  },
  {
    icon: BarChart3,
    title: "Case Study",
    description: "How RetailBrand Increased Conversions by 65%",
  },
];

export default async function PublicPage({ params }: { params: Promise<{ locale: string }> }) {
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
                Consumer Identity Solution
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight text-balance">
                Customer Identity That Converts
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Secure, seamless authentication for consumer applications. Reduce friction, increase
                conversions, and build lasting customer relationships.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                <Link href="/docs">
                  <Button size="lg" className="gap-2 h-12 px-6 text-base">
                    View Documentation
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="https://github.com/skygenesisenterprise/aether-identity">
                  <Button variant="outline" size="lg" className="gap-2 h-12 px-6 text-base">
                    <GitHubIcon className="h-4 w-4" />
                    GitHub Repository
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

        {/* Core Capabilities */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Build Trust with Every Login
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Modern authentication that balances security with user experience. Every login
                should feel effortless, every account secure.
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
                  <p className="text-sm text-muted-foreground leading-relaxed pl-13">
                    {capability.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Login Options */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Authentication Your Users Love
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Give users multiple ways to authenticate that fit their preferences and security
                needs.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loginOptions.map((option) => (
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

        {/* Features Section */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Customer Data Done Right
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Comprehensive customer identity management that respects privacy while enabling
                personalized experiences.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industry Use Cases */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Built for Consumer Apps
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Tailored identity solutions for every type of consumer-facing application.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {industries.map((industry) => (
                <div
                  key={industry.title}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <industry.icon className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{industry.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {industry.description}
                  </p>
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
                  Privacy by Design
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  Built from the ground up to meet global privacy regulations. Handle customer data
                  with confidence and compliance.
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
                  <Eye className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">Consent</div>
                  <div className="text-sm text-muted-foreground">Granular tracking</div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <HandHeart className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">Right to Delete</div>
                  <div className="text-sm text-muted-foreground">Automated workflows</div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Database className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">Data Export</div>
                  <div className="text-sm text-muted-foreground">Portable formats</div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Bell className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">Breach Alert</div>
                  <div className="text-sm text-muted-foreground">Instant notifications</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Code Example Section */}
        <section className="py-20 lg:py-28 bg-foreground text-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-balance">
                  Integrate in Minutes
                </h2>
                <p className="mt-4 text-lg text-background/70 leading-relaxed">
                  Our SDKs make it simple to add powerful authentication to any consumer
                  application. Support for web, iOS, and Android out of the box.
                </p>
                <div className="mt-8">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 text-sm bg-background/10 rounded-md text-background/80">
                      React
                    </span>
                    <span className="px-3 py-1.5 text-sm bg-background/10 rounded-md text-background/80">
                      Vue
                    </span>
                    <span className="px-3 py-1.5 text-sm bg-background/10 rounded-md text-background/80">
                      Angular
                    </span>
                    <span className="px-3 py-1.5 text-sm bg-background/10 rounded-md text-background/80">
                      iOS
                    </span>
                    <span className="px-3 py-1.5 text-sm bg-background/10 rounded-md text-background/80">
                      Android
                    </span>
                    <span className="px-3 py-1.5 text-sm bg-background/10 rounded-md text-background/80">
                      Flutter
                    </span>
                  </div>
                </div>
                <div className="mt-8">
                  <Link href="/docs/quickstarts">
                    <Button variant="secondary" size="lg" className="gap-2">
                      <Code2 className="h-4 w-4" />
                      Quickstart Guides
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="p-6 rounded-lg bg-background/5">
                <pre className="text-sm text-background/80 overflow-x-auto">
                  <code>{`import { AetherCIAM } from '@aether-identity/react';

const auth = new AetherCIAM({
  domain: 'auth.yourapp.com',
  clientId: process.env.AETHER_CLIENT_ID,
});

// Sign up with email
const { user, session } = await auth.signUp({
  email: 'customer@example.com',
  password: 'secure-password',
  profile: {
    name: 'John Doe',
    preferences: { marketing: true }
  }
});

// Login with magic link
await auth.sendMagicLink('customer@example.com');

// Social login
await auth.loginWithProvider('google');`}</code>
                </pre>
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
                Common questions about consumer identity management.
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
                Explore guides and research on consumer identity management.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                Transform Your Customer Experience
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Secure, frictionless authentication that helps you build lasting customer
                relationships while staying compliant.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/docs">
                  <Button size="lg" className="gap-2 h-12 px-8 text-base">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                    Contact Sales
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
