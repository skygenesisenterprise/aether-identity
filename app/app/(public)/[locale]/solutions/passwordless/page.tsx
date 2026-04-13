import Link from "next/link";
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

const benefits = [
  {
    icon: Shield,
    title: "Enhanced Security",
    description:
      "Eliminate password breaches entirely. Passwordless authentication uses cryptographic keys that cannot be guessed, reused, or leaked.",
  },
  {
    icon: Zap,
    title: "Faster User Experience",
    description:
      "Users authenticate in seconds, not minutes. No more forgotten passwords or reset requests to handle.",
  },
  {
    icon: Smartphone,
    title: "Seamless Device Integration",
    description:
      "Leverage devices users already carry. Biometric authentication feels natural on mobile and desktop.",
  },
  {
    icon: BarChart3,
    title: "Reduced Support Costs",
    description:
      "Drastically reduce password-related support tickets. Users never need to reset credentials again.",
  },
];

const methods = [
  {
    title: "Passkeys (WebAuthn)",
    description:
      "Industry-standard passwordless authentication using cryptographic credentials stored on users' devices. Supports fingerprint, face recognition, and hardware security keys.",
    features: [
      "Phishing-resistant",
      "Device-bound credentials",
      "Platform authenticator support",
      "Cross-device authentication",
    ],
  },
  {
    title: "Magic Links",
    description:
      "Email-based authentication where users receive a unique, time-limited link to complete sign-in. No passwords or apps required.",
    features: [
      "No app installation",
      "Email-based verification",
      "Time-limited tokens",
      "Device tracking optional",
    ],
  },
  {
    title: "OTP (One-Time Password)",
    description:
      "Time-based or counter-based codes delivered via email, SMS, or authenticator apps. Familiar and widely accepted.",
    features: [
      "Multiple delivery methods",
      "Offline capability",
      "High adoption rate",
      "Familiar user pattern",
    ],
  },
  {
    title: "Email Verification",
    description:
      "Passwordless email authentication where users confirm identity by clicking a link or entering a code sent to their email.",
    features: [
      "No new apps needed",
      "Instant setup",
      "Audit trail built-in",
      "Universal accessibility",
    ],
  },
];

const metrics = [
  { value: "100%", label: "Eliminates password breaches" },
  { value: "80%", label: "Reduction in support tickets" },
  { value: "3x", label: "Faster user authentication" },
  { value: "< 1%", label: "Failed login rate" },
];

const useCases = [
  {
    icon: UserPlus,
    title: "Customer Onboarding",
    description:
      "Remove friction from signup flows. New users can create accounts and authenticate immediately without remembering yet another password.",
  },
  {
    icon: LogIn,
    title: "Employee Access",
    description:
      "Simplify internal authentication. Employees access applications with biometrics or security keys, improving productivity and security.",
  },
  {
    icon: Globe,
    title: "Partner Integrations",
    description:
      "Enable secure partner access without password management overhead. Partners authenticate using their own identity providers.",
  },
  {
    icon: Database,
    title: "Admin Security",
    description:
      "Secure administrative accounts with the strongest authentication available. Protect critical systems with passkeys and hardware tokens.",
  },
];

const comparison = [
  {
    method: "Security Level",
    password: "Low",
    passkey: "Very High",
    magicLink: "High",
    otp: "Medium",
  },
  {
    method: "User Experience",
    password: "Medium",
    passkey: "Excellent",
    magicLink: "Good",
    otp: "Good",
  },
  { method: "Setup Complexity", password: "N/A", passkey: "Low", magicLink: "Low", otp: "Low" },
  {
    method: "Device Dependency",
    password: "None",
    passkey: "High",
    magicLink: "Low",
    otp: "Medium",
  },
  {
    method: "Recovery Options",
    password: "Password reset",
    passkey: "Account recovery",
    magicLink: "Resend link",
    otp: "Resend code",
  },
];

const complianceStandards = [
  "FIDO2/WebAuthn Compliant",
  "eIDAS Ready",
  "GDPR Compatible",
  "SOC 2 Type II",
  "ISO 27001",
];

const resources = [
  {
    icon: FileText,
    title: "Whitepaper",
    description: " passwordless Security Implementation Guide",
  },
  {
    icon: BookOpen,
    title: "E-book",
    description: "Complete Guide to Passkeys",
  },
  {
    icon: Calendar,
    title: "Webinar",
    description: "Migrating from Passwords to Passkeys",
  },
  {
    icon: Video,
    title: "Video Demo",
    description: "Passwordless Authentication Setup",
  },
];

const faqs = [
  {
    question: "What is passwordless authentication?",
    answer:
      "Passwordless authentication is any method of verifying user identity without using traditional passwords. This includes passkeys, magic links, OTPs, and biometric authentication. These methods are more secure and provide better user experience.",
  },
  {
    question: "Are passkeys safe?",
    answer:
      "Yes, passkeys are among the most secure authentication methods available. They use cryptographic key pairs that are resistant to phishing, cannot be reused across sites, and are stored securely on user's devices. They meet or exceed the security of traditional multi-factor authentication.",
  },
  {
    question: "What happens if a user loses their device?",
    answer:
      "Aether Identity provides multiple recovery options including cloud sync for passkeys, backup verification methods, and administrative account recovery. Users can also register multiple authenticators for redundancy.",
  },
  {
    question: "Can I use passwordless alongside passwords?",
    answer:
      "Yes, you can enable passwordless authentication as an option while maintaining password-based login. Many organizations run both methods during a transition period. However, we recommend going fully passwordless for optimal security.",
  },
  {
    question: "Do passwordless methods work offline?",
    answer:
      "TOTP and some passkey implementations work offline. Magic links and email verification require connectivity. For offline scenarios, we recommend TOTP-based authenticators or hardware security keys.",
  },
];

export default async function PasswordlessPage({
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
                Passwordless Authentication
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight text-balance">
                The Future of Authentication is Password-Free
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Eliminate the weakest link in your security chain. Implement secure, frictionless
                authentication that users love and attackers cannot compromise.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                <Link href="/docs/guides/passwordless">
                  <Button size="lg" className="gap-2 h-12 px-6 text-base">
                    Implementation Guide
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="h-12 px-6 text-base">
                    Talk to Sales
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
                Why Go Passwordless
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Passwords are the leading cause of security breaches. Passwordless authentication
                eliminates this attack vector while improving user experience.
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
                Authentication Methods
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Choose the passwordless methods that fit your users and security requirements.
                Aether Identity supports all major passwordless standards.
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
                Method Comparison
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Compare passwordless methods across security, usability, and implementation factors.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-150">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">
                      Criteria
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">
                      Password
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">
                      Passkey
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">
                      Magic Link
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">
                      OTP
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
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">Use Cases</h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Passwordless authentication adapts to various scenarios, from customer-facing
                applications to enterprise internal systems.
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
                  Easy Implementation
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  Integrate passwordless authentication in minutes with our SDKs and comprehensive
                  documentation. Support for all major frameworks and languages.
                </p>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    <span className="text-sm text-foreground">Full FIDO2/WebAuthn support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    <span className="text-sm text-foreground">Magic link and email OTP</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    <span className="text-sm text-foreground">TOTP authenticator integration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    <span className="text-sm text-foreground">
                      Adaptive authentication policies
                    </span>
                  </div>
                </div>
                <div className="mt-8">
                  <Link href="/docs/guides/passwordless">
                    <Button size="lg" className="gap-2">
                      <Rocket className="h-4 w-4" />
                      Quickstart Guide
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg border border-border p-6">
                <div className="text-sm text-muted-foreground mb-4">Example: Enable Passkeys</div>
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
                Standards Compliant
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Aether Identity implements industry-standard passwordless protocols, ensuring
                compatibility and compliance with regulatory requirements.
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
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Common questions about passwordless authentication.
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
                Explore our documentation and guides for implementing passwordless authentication.
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
                Ready to Eliminate Passwords?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Implement passwordless authentication today. Start with our free tier and scale as
                your needs grow.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/docs/guides/passwordless">
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
