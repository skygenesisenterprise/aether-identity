import Link from "next/link";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { GitHubIcon } from "@/components/ui/icons/GitHubIcon";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import { CodeBlock } from "@/components/public/CodeBlock";
import {
  Shield,
  Lock,
  Fingerprint,
  ArrowRight,
  Code2,
  CheckCircle2,
  GitBranch,
  Database,
  Cloud,
  FileText,
  BookOpen,
  Calendar,
  BarChart3,
  LogIn,
  RefreshCw,
  Smartphone,
  Monitor,
  Gauge,
  Layers,
  Plug,
} from "lucide-react";

const capabilities = [
  {
    icon: LogIn,
    title: "Universal Authentication",
    description:
      "Seamless login experience across all your applications with a single set of credentials. Support for web, mobile, and desktop platforms.",
  },
  {
    icon: RefreshCw,
    title: "Session Synchronization",
    description:
      "Real-time session state synchronization across all devices and applications. Users stay logged in seamlessly as they switch between apps.",
  },
  {
    icon: Smartphone,
    title: "Cross-Device SSO",
    description:
      "Enterprise-grade single sign-on that works across web, iOS, Android, and native desktop applications with consistent UX.",
  },
  {
    icon: Fingerprint,
    title: "Adaptive Authentication",
    description:
      "Risk-based authentication that adapts security requirements based on device, location, and user behavior patterns.",
  },
  {
    icon: Monitor,
    title: "Customizable Branding",
    description:
      "Fully white-label the login experience with custom themes, logos, and styling to maintain brand consistency.",
  },
  {
    icon: Plug,
    title: "Identity Provider Integration",
    description:
      "Connect to existing identity providers including Okta, Auth0, Azure AD, or any SAML/OIDC compliant IdP.",
  },
];

const metrics = [
  { value: "< 50ms", label: "Login page load time" },
  { value: "99.99%", label: "SLA availability" },
  { value: "10M+", label: "Logins per month" },
  { value: "Zero", label: "Password fatigue" },
];

const deploymentOptions = [
  {
    icon: Cloud,
    title: "Cloud-Hosted",
    description:
      "Fully managed service with automatic scaling, global CDN, and enterprise SLAs. Deploy in minutes.",
  },
  {
    icon: Database,
    title: "On-Premise",
    description:
      "Deploy within your infrastructure for complete data sovereignty and compliance requirements.",
  },
  {
    icon: GitBranch,
    title: "Hybrid",
    description:
      "Cloud-managed control plane with on-premise session storage for maximum flexibility.",
  },
];

const sdkSupport = [
  { name: "React", category: "Frontend" },
  { name: "Vue", category: "Frontend" },
  { name: "Angular", category: "Frontend" },
  { name: "iOS", category: "Mobile" },
  { name: "Android", category: "Mobile" },
  { name: "Node.js", category: "Backend" },
  { name: "Python", category: "Backend" },
  { name: "Go", category: "Backend" },
];

const sampleCode = [
  {
    language: "typescript",
    filename: "universal-login.tsx",
    code: `import { UniversalLogin } from '@aether-identity/react';

export function LoginPage() {
  return (
    <UniversalLogin
      theme="custom"
      logo="/logo.png"
      backgroundImage="/bg.jpg"
      providers={['google', 'github', 'microsoft']}
      mfaEnabled={true}
      onSuccess={(user) => {
        console.log('Authenticated:', user);
      }}
    />
  );
}`,
  },
  {
    language: "typescript",
    filename: "react-native.tsx",
    code: `import { UniversalLogin } from '@aether-identity/react-native';

export default function App() {
  return (
    <UniversalLogin
      theme="dark"
      logo={require('./assets/logo.png')}
      providers={['apple', 'google']}
      onSuccess={handleAuth}
    />
  );
}`,
  },
];

const complianceStandards = [
  "SOC 2 Type II",
  "GDPR",
  "HIPAA",
  "ISO 27001",
  "PCI DSS",
  "FedRAMP Ready",
];

const features = [
  {
    title: "Passwordless Authentication",
    description:
      "Eliminate passwords entirely with WebAuthn, magic links, or biometric authentication for frictionless user experience.",
  },
  {
    title: "Social Login",
    description:
      "Support for Google, GitHub, Microsoft, Apple, and 50+ other social identity providers out of the box.",
  },
  {
    title: "Enterprise SSO",
    description:
      "SAML 2.0 and OIDC federation with Azure AD, Okta, OneLogin, and any SAML-compliant identity provider.",
  },
  {
    title: "Multi-Factor Authentication",
    description:
      "TOTP, SMS, email, and WebAuthn second factors with flexible policies and remember device features.",
  },
  {
    title: "Progressive Profiling",
    description:
      "Collect user attributes incrementally across sessions to reduce signup friction while building complete profiles.",
  },
  {
    title: "Account Recovery",
    description:
      "Secure account recovery flows with verified email, phone, or backup codes to prevent account lockouts.",
  },
];

const faqs = [
  {
    question: "How does Universal Login differ from traditional SSO?",
    answer:
      "Universal Login provides a modern, consistent authentication experience across all applications regardless of the underlying identity system. Unlike traditional SSO solutions, it offers a unified user experience with built-in session management, passwordless options, and adaptive security policies.",
  },
  {
    question: "Can I integrate with my existing identity provider?",
    answer:
      "Yes, Universal Login integrates with Okta, Azure AD, Auth0, Keycloak, and any SAML 2.0 or OIDC-compliant identity provider. You can federate authentication while maintaining your existing user directory.",
  },
  {
    question: "Is the login page customizable?",
    answer:
      "Absolutely. You can customize colors, logos, backgrounds, typography, and even the full HTML/CSS template. White-label options are available for enterprise deployments.",
  },
  {
    question: "How does passwordless authentication work?",
    answer:
      "Passwordless authentication uses WebAuthn (FIDO2) for biometric or hardware key authentication, magic links sent via email, or one-time codes via SMS. This eliminates password fatigue while improving security.",
  },
  {
    question: "What happens if the identity provider goes down?",
    answer:
      "Universal Login includes built-in failover mechanisms and session caching. Users with active sessions remain authenticated, and fallback authentication methods can be configured for emergencies.",
  },
];

const resources = [
  {
    icon: FileText,
    title: "Documentation",
    description: "Integration guides and API reference",
  },
  {
    icon: BookOpen,
    title: "Tutorial",
    description: "Step-by-step Universal Login setup",
  },
  {
    icon: Calendar,
    title: "Webinar",
    description: "Best practices for passwordless migration",
  },
  {
    icon: BarChart3,
    title: "Case Study",
    description: "How Acme Corp reduced login friction by 70%",
  },
];

export default async function UniversalLoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
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
                Enterprise Authentication
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight text-balance">
                One Login for All Your Applications
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Provide a seamless, secure authentication experience across all your web and mobile
                applications. Universal Login unifies your brand while eliminating password fatigue.
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

        {/* Features Grid */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Everything You Need for Modern Authentication
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Built for developers who demand flexibility without compromising on security or user
                experience.
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

        {/* Code Example Section */}
        <section className="py-20 lg:py-28 bg-foreground text-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-balance">
                  Integrate in Minutes
                </h2>
                <p className="mt-4 text-lg text-background/70 leading-relaxed">
                  Our React component library makes it easy to add powerful authentication to any
                  application with just a few lines of code.
                </p>
                <div className="mt-8">
                  <div className="flex flex-wrap gap-2">
                    {sdkSupport.map((sdk) => (
                      <span
                        key={sdk.name}
                        className="px-3 py-1.5 text-sm bg-background/10 rounded-md text-background/80"
                      >
                        {sdk.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-8">
                  <Link href="/docs/quickstarts">
                    <Button variant="secondary" size="lg" className="gap-2">
                      <Code2 className="h-4 w-4" />
                      Quickstart Guide
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <CodeBlock samples={sampleCode} defaultLanguage="typescript" />
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Features */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Advanced Features
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Everything you need to build a secure, user-friendly authentication system.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Deployment Options */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Deploy Your Way
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Choose between fully managed cloud service, on-premise deployment, or a hybrid
                approach that gives you the best of both worlds.
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
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                  Enterprise-Grade Security
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  Universal Login is built with security at its core, meeting the stringent
                  requirements of regulated industries.
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
                  <Gauge className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">99.99%</div>
                  <div className="text-sm text-muted-foreground">Uptime SLA</div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Layers className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">2FA</div>
                  <div className="text-sm text-muted-foreground">Built-in support</div>
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
                Common questions about Universal Login.
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
                Explore our documentation and guides to get started with Universal Login.
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
                Simplify Your Authentication
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Give your users a seamless login experience across all applications. Try Universal
                Login today.
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
