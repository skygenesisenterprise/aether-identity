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
  Smartphone,
  Mail,
  MessageSquare,
  Key,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
  Gem,
  LockOpen,
  RefreshCw,
  UserCheck,
  AlertTriangle,
  Zap,
} from "lucide-react";

const capabilities = [
  {
    icon: Fingerprint,
    title: "WebAuthn / FIDO2",
    description:
      "Passwordless authentication using hardware keys, Touch ID, Face ID, and Windows Hello. Highest level of security with phishing-resistant credentials.",
  },
  {
    icon: Smartphone,
    title: "TOTP / Authenticator Apps",
    description:
      "Time-based one-time passwords compatible with Google Authenticator, Authy, Microsoft Authenticator, and any RFC 6238 compliant app.",
  },
  {
    icon: Mail,
    title: "Email Verification",
    description:
      "Secure email-based verification codes with templated messages, branding options, and delivery tracking.",
  },
  {
    icon: MessageSquare,
    title: "SMS Verification",
    description:
      "Two-factor authentication via SMS with support for multiple providers, fallback options, and rate limiting.",
  },
  {
    icon: Eye,
    title: "Adaptive Risk-Based Auth",
    description:
      "Machine learning-powered risk analysis that automatically steps up authentication for suspicious logins.",
  },
  {
    icon: Key,
    title: "Hardware Token Support",
    description:
      "Support for YubiKey, Titan Security Key, and other FIDO2-compatible tokens. Enterprise-grade key management and enrollment.",
  },
];

const features = [
  {
    title: "Passwordless Login",
    description: "Eliminate passwords entirely with WebAuthn and magic links",
    tags: ["WebAuthn", "Magic Links", "FIDO2", "Biometrics"],
  },
  {
    title: "Step-Up Authentication",
    description: "Increase trust level for sensitive actions",
    tags: ["Transaction Signing", "Risk Scoring", "Policy Engine"],
  },
  {
    title: "MFA Enrollment Flows",
    description: "Guided user enrollment with backup methods",
    tags: ["Self-Service", "Admin Enforced", "Backup Codes"],
  },
  {
    title: "Recovery Mechanisms",
    description: "Secure account recovery without compromising security",
    tags: ["Trusted Devices", "Recovery Codes", "Identity Verification"],
  },
  {
    title: "Policy Enforcement",
    description: "Granular controls over when and how MFA is required",
    tags: ["Conditional Access", "Network Rules", "Time-Based"],
  },
  {
    title: "Compliance Logging",
    description: "Complete audit trail for regulatory requirements",
    tags: ["SOC 2", "GDPR", "HIPAA", "PCI DSS"],
  },
];

const metrics = [
  { value: "99.99%", label: "Uptime SLA" },
  { value: "< 5ms", label: "MFA verification latency" },
  { value: "100%", label: "FIDO2 certified" },
  { value: "Zero", label: "Phishing incidents in 2025" },
];

const sampleCode = [
  {
    language: "typescript",
    filename: "mfa-enrollment.ts",
    code: `import { AetherMFA } from '@aether-identity/node';

const mfa = new AetherMFA({
  domain: 'auth.company.com',
  clientId: process.env.MFA_CLIENT_ID,
});

// Enroll user in MFA
const enrollment = await mfa.enrollUser({
  userId: 'user-123',
  methods: ['totp', 'webauthn', 'sms'],
});

// Verify TOTP code
const verified = await mfa.verify({
  userId: 'user-123',
  code: '123456',
  method: 'totp',
});`,
  },
  {
    language: "typescript",
    filename: "policy-config.ts",
    code: `import { AetherPolicy } from '@aether-identity/node';

const policy = new AetherPolicy({
  domain: 'auth.company.com',
});

// Define adaptive MFA policy
await policy.create({
  name: 'Adaptive MFA Policy',
  rules: [
    {
      condition: 'risk_score > 70',
      requireMFA: true,
      methods: ['webauthn', 'totp'],
    },
    {
      condition: 'new_device',
      requireMFA: true,
      methods: ['any'],
    },
    {
      condition: 'trusted_network',
      requireMFA: false,
    },
  ],
});`,
  },
];

const comparison = [
  { feature: "Self-hosted MFA", aether: true, okta: false, auth0: false, duo: false },
  { feature: "WebAuthn / FIDO2", aether: true, okta: true, auth0: true, duo: true },
  { feature: "TOTP Support", aether: true, okta: true, auth0: true, duo: true },
  { feature: "Adaptive Risk-Based", aether: true, okta: true, auth0: true, duo: false },
  { feature: "Hardware Tokens", aether: true, okta: true, auth0: true, duo: false },
  { feature: "No per-user pricing", aether: true, okta: false, auth0: false, duo: false },
  { feature: "Full Audit Logs", aether: true, okta: true, auth0: true, duo: true },
];

const faqs = [
  {
    question: "How does Aether MFA compare to Duo Security?",
    answer:
      "Aether MFA offers all the features of Duo with self-hosted deployment, no per-user pricing, and full data sovereignty. You retain complete control over your authentication infrastructure.",
  },
  {
    question: "Can Aether integrate with our existing IdP?",
    answer:
      "Yes, Aether MFA integrates with any OAuth 2.0/OIDC provider, SAML IdP, or can operate as a standalone MFA solution. It works alongside Okta, Azure AD, Keycloak, and more.",
  },
  {
    question: "What happens if a user loses their second factor?",
    answer:
      "Aether provides multiple recovery options including backup codes, trusted device recovery, and admin-initiated recovery with identity verification. Recovery is logged for compliance.",
  },
  {
    question: "Is passwordless authentication supported?",
    answer:
      "Yes, Aether fully supports WebAuthn/FIDO2 for passwordless authentication. Users can authenticate with hardware keys, biometric sensors, or device-based credentials.",
  },
  {
    question: "Can we enforce MFA for specific users or groups?",
    answer:
      "Yes, Aether's policy engine allows granular enforcement rules based on user attributes, groups, IP ranges, risk scores, or any custom conditions.",
  },
];

export default async function MFAPage({ params }: { params: Promise<{ locale: string }> }) {
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
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500" />
                Multi-Factor Authentication
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight text-balance">
                Enterprise MFA Without the Vendor Lock-In
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Secure authentication with TOTP, WebAuthn, SMS, email, and adaptive risk-based
                policies. Self-hosted, self-controlled, enterprise-grade.
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
                Complete Authentication Security
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Modern MFA solution with support for all authentication methods and adaptive
                security policies.
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

        {/* Features Grid */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Advanced MFA Features
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Enterprise features for maximum security without sacrificing user experience.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {feature.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">How We Compare</h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                See why organizations choose Aether MFA over cloud-only alternatives.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-150">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">
                      Feature
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-foreground">
                      Aether MFA
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">
                      Okta
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">
                      Auth0
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">
                      Duo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr key={row.feature} className="border-b border-border/50">
                      <td className="py-4 px-4 text-sm text-foreground">{row.feature}</td>
                      <td className="py-4 px-4 text-center">
                        {row.aether === true ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {row.okta === true ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {row.auth0 === true ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {row.duo === true ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Code Example Section */}
        <section className="py-20 lg:py-28 bg-foreground text-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-balance">
                  Easy Integration
                </h2>
                <p className="mt-4 text-lg text-background/70 leading-relaxed">
                  Simple SDKs make adding MFA to your applications straightforward. Support for all
                  major authentication methods.
                </p>
                <div className="mt-8">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 text-sm bg-background/10 rounded-md text-background/80">
                      WebAuthn
                    </span>
                    <span className="px-3 py-1.5 text-sm bg-background/10 rounded-md text-background/80">
                      TOTP
                    </span>
                    <span className="px-3 py-1.5 text-sm bg-background/10 rounded-md text-background/80">
                      SMS
                    </span>
                    <span className="px-3 py-1.5 text-sm bg-background/10 rounded-md text-background/80">
                      Email
                    </span>
                    <span className="px-3 py-1.5 text-sm bg-background/10 rounded-md text-background/80">
                      Push
                    </span>
                  </div>
                </div>
                <div className="mt-8">
                  <Link href="/docs/quickstarts">
                    <Button variant="secondary" size="lg" className="gap-2">
                      <Zap className="h-4 w-4" />
                      Quickstart Guides
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

        {/* Security Benefits */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Why Choose Aether MFA?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                The most secure and flexible MFA solution for modern enterprises.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg border border-border bg-card">
                <LockOpen className="h-8 w-8 text-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Zero Vendor Lock-In</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Self-hosted solution means you own your authentication infrastructure. Migrate
                  anytime with standard protocols.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border bg-card">
                <UserCheck className="h-8 w-8 text-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Frictionless User Experience
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Adaptive authentication means trusted users get seamless access while suspicious
                  activity triggers additional verification.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border bg-card">
                <AlertTriangle className="h-8 w-8 text-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Phishing-Resistant</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  WebAuthn credentials are bound to specific origins, making them impossible to
                  phish. Hardware-backed security for your users.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border bg-card">
                <Gem className="h-8 w-8 text-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Complete Compliance</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Full audit logging, SOC 2 compliance, GDPR ready. Meet the strictest regulatory
                  requirements with detailed authentication logs.
                </p>
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
                Common questions about Aether MFA.
              </p>
            </div>
            <FaqAccordion faqs={faqs} />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Secure Your Authentication Today
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Deploy Aether MFA and gain complete control over your authentication security. Open
                source, self-hosted, enterprise-ready.
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
