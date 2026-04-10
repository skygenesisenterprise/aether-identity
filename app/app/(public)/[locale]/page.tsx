import Link from "next/link";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Users, Key, Fingerprint, Zap, CheckCircle, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Enterprise-Grade Security",
    description:
      "Protect your users and data with industry-leading security measures and compliance standards.",
  },
  {
    icon: Lock,
    title: "Single Sign-On (SSO)",
    description:
      "Seamless authentication across all your applications with our unified login experience.",
  },
  {
    icon: Users,
    title: "User Management",
    description: "Complete identity lifecycle management from onboarding to offboarding with ease.",
  },
  {
    icon: Key,
    title: "Multi-Factor Authentication",
    description:
      "Add an extra layer of security with MFA options including SMS, email, and biometrics.",
  },
  {
    icon: Fingerprint,
    title: "Passwordless Authentication",
    description:
      "Eliminate passwords and provide frictionless, secure access to your applications.",
  },
  {
    icon: Zap,
    title: "Fast Integration",
    description: "Get up and running in minutes with our SDKs and comprehensive documentation.",
  },
];

const stats = [
  { value: "99.99%", label: "Uptime SLA" },
  { value: "10B+", label: "Authentications/Month" },
  { value: "3B+", label: "Attacks Blocked/Month" },
  { value: "<50ms", label: "Average Response Time" },
];

const useCases = [
  {
    title: "B2C Applications",
    description:
      "Deliver seamless user experiences while protecting customer data and maintaining compliance.",
    href: "/solutions/b2c",
  },
  {
    title: "B2B SaaS",
    description: "Scale your multi-tenant application with enterprise-grade identity management.",
    href: "/solutions/b2b-saas",
  },
  {
    title: "Enterprise",
    description:
      "Meet enterprise security requirements with SSO, MFA, and advanced access controls.",
    href: "/solutions/enterprise",
  },
  {
    title: "Healthcare",
    description:
      "HIPAA-compliant identity solutions for healthcare applications and patient portals.",
    href: "/solutions/healthcare",
  },
];

const sdks = [
  { name: "JavaScript", icon: "JS" },
  { name: "React", icon: "React" },
  { name: "Angular", icon: "Angular" },
  { name: "Vue", icon: "Vue" },
  { name: "Node.js", icon: "Node" },
  { name: "Python", icon: "Python" },
  { name: ".NET", icon: ".NET" },
  { name: "iOS (Swift)", icon: "iOS" },
  { name: "Android (Kotlin)", icon: "Android" },
  { name: "Java", icon: "Java" },
];

export default async function PublicPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="relative bg-linear-to-b from-background to-background/80 py-20 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
                <Shield className="h-4 w-4" />
                Secure Identity Management
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                Identity & Access Management
                <br />
                <span className="text-primary">Built for the Enterprise</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Secure your applications with enterprise-grade authentication, authorization, and
                user management. Protect your users and data with our scalable identity platform.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="gap-2">
                    Start Free Trial
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-primary">{stat.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Everything You Need for Identity Management
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Our comprehensive platform provides all the tools you need to secure your
                applications and manage user identities.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="p-6 rounded-lg border bg-card text-card-foreground hover:shadow-lg transition-shadow"
                >
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Integrate in Minutes
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Get started quickly with our SDKs and comprehensive documentation. We support all
                major platforms and frameworks.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {sdks.map((sdk) => (
                <div
                  key={sdk.name}
                  className="px-4 py-2 rounded-md bg-background border text-sm font-medium hover:border-primary hover:text-primary transition-colors cursor-pointer"
                >
                  {sdk.name}
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/docs/quickstarts">
                <Button variant="outline" className="gap-2">
                  View Quickstarts
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Built for What You&apos;re Building
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Whether you&apos;re building consumer apps, enterprise software, or anything in
                between, we have you covered.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {useCases.map((useCase) => (
                <Link
                  key={useCase.title}
                  href={useCase.href}
                  className="group p-6 rounded-lg border bg-card text-card-foreground hover:shadow-lg hover:border-primary transition-all"
                >
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {useCase.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{useCase.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-primary text-primary-foreground">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold">Ready to Get Started?</h2>
            <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">
              Join thousands of companies who trust Sky Genesis Enterprise for their identity
              management needs. Start your free trial today.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="gap-2">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/20 hover:bg-primary-foreground/10"
                >
                  Talk to Sales
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Why Choose Aether Identity?
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                "SOC 2 Type II Certified",
                "GDPR Compliant",
                "HIPAA Ready",
                "99.99% Uptime SLA",
                "24/7 Enterprise Support",
                "Dedicated Success Manager",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale as "fr" | "be_fr" | "be_nl" | "ch_fr"} />
    </div>
  );
}
