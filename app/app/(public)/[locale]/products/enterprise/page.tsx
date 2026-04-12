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

const enterpriseFeatures = [
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-grade encryption, SOC 2 Type II compliance, and advanced threat protection for your most sensitive applications.",
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Support",
    description:
      "24/7 priority support with dedicated account managers and guaranteed response times for enterprise customers.",
  },
  {
    icon: Scale,
    title: "Unlimited Scaling",
    description:
      "Scale to millions of users with our distributed architecture. No arbitrary limits on users, applications, or API calls.",
  },
  {
    icon: Clock,
    title: "99.99% SLA",
    description:
      "Industry-leading uptime guarantee with financial reparations. Enterprise-grade reliability you can count on.",
  },
  {
    icon: Key,
    title: "Advanced MFA",
    description:
      "TOTP, WebAuthn, push notifications, SMS, and email verification with adaptive risk-based policies.",
  },
  {
    icon: Users,
    title: "User Federation",
    description:
      "Seamless integration with Active Directory, LDAP, and external identity providers.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "Custom",
    description: "For small teams getting started with identity",
    features: [
      "Up to 10,000 users",
      "Basic MFA support",
      "Community support",
      "Standard documentation",
      "Monthly releases",
    ],
    cta: "Contact Sales",
    popular: false,
  },
  {
    name: "Professional",
    price: "Custom",
    description: "For growing organizations with advanced needs",
    features: [
      "Up to 100,000 users",
      "Advanced MFA (TOTP, WebAuthn)",
      "Priority email support",
      "Active Directory integration",
      "Quarterly releases",
      "Audit logging",
    ],
    cta: "Contact Sales",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations at scale",
    features: [
      "Unlimited users",
      "All MFA methods",
      "24/7 dedicated support",
      "SLA guarantee (99.99%)",
      "Custom integrations",
      "Security review",
      "Dedicated account manager",
      "Air-gapped deployment",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const includedFeatures = [
  {
    icon: Globe,
    title: "Global Infrastructure",
    description: "Deploy across multiple regions with automatic failover",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Real-time dashboards with custom reporting and alerts",
  },
  {
    icon: FileText,
    title: "Compliance Reports",
    description: "Automated SOC 2, HIPAA, and GDPR compliance reports",
  },
  {
    icon: Zap,
    title: "High Performance",
    description: "< 15ms token validation with horizontal scaling",
  },
  {
    icon: Server,
    title: "Private Deployment",
    description: "Dedicated infrastructure with network isolation",
  },
  {
    icon: CreditCard,
    title: "Flexible Billing",
    description: "Annual or multi-year contracts with volume discounts",
  },
];

const testimonials = [
  {
    quote:
      "Aether Enterprise gave us complete control over our identity infrastructure while providing the reliability our financial services require.",
    author: "Jean-Pierre Dubois",
    role: "CISO",
    company: "Banque Suisse",
  },
  {
    quote:
      "The migration from Okta was seamless. Their team handled everything, and we reduced our authentication costs by 60%.",
    author: "Marie Lambert",
    role: "VP Engineering",
    company: "TechCorp Europe",
  },
  {
    quote:
      "The 99.99% SLA and dedicated support give us the confidence to handle millions of transactions daily.",
    author: "Hans Mueller",
    role: "CTO",
    company: "GlobalPay",
  },
];

const faqs = [
  {
    question: "What is included in the Enterprise plan?",
    answer:
      "The Enterprise plan includes unlimited users, all MFA methods, 24/7 dedicated support, SLA guarantee, custom integrations, security reviews, a dedicated account manager, and air-gapped deployment options.",
  },
  {
    question: "Can we get a custom contract?",
    answer:
      "Yes, we offer flexible contract terms including annual and multi-year options. Contact our sales team to discuss your specific requirements.",
  },
  {
    question: "Do you offer on-premise deployment?",
    answer:
      "Yes, we support fully on-premise, cloud, and hybrid deployments. Our enterprise plan includes air-gapped deployment for organizations with strict security requirements.",
  },
  {
    question: "What kind of support do you provide?",
    answer:
      "Enterprise customers receive 24/7 priority support with dedicated account managers, guaranteed response times, and access to our security team for architecture reviews.",
  },
  {
    question: "Can we migrate from our current provider?",
    answer:
      "Yes, we provide full migration assistance including user migration, application configuration transfer, and custom integration work at no additional cost.",
  },
];

const industries = [
  {
    icon: Briefcase,
    title: "Financial Services",
    description: "Banking, insurance, and fintech with regulatory compliance",
  },
  {
    icon: Shield,
    title: "Healthcare",
    description: "HIPAA-compliant identity for patient data protection",
  },
  {
    icon: Globe2,
    title: "Government",
    description: "FedRAMP Ready solutions for citizen services",
  },
  {
    icon: Award,
    title: "Technology",
    description: "SaaS platforms requiring enterprise-grade security",
  },
];

const resources = [
  {
    icon: BookOpen,
    title: "Enterprise Architecture Guide",
    description: "Best practices for identity infrastructure",
  },
  {
    icon: FileText,
    title: "Security Whitepaper",
    description: "Detailed security model and compliance information",
  },
  {
    icon: Calendar,
    title: "Demo Request",
    description: "Schedule a personalized product walkthrough",
  },
  {
    icon: MessageSquare,
    title: "Contact Sales",
    description: "Talk to our enterprise team about your needs",
  },
];

export default async function EnterprisePage({ params }: { params: Promise<{ locale: string }> }) {
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
                Enterprise Solutions
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight text-balance">
                Enterprise Identity, Without Compromise
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Comprehensive identity management for large organizations. Dedicated support,
                unlimited scaling, and the security certifications your industry demands.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                <Link href="#plans">
                  <Button size="lg" className="gap-2 h-12 px-6 text-base">
                    View Plans
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="gap-2 h-12 px-6 text-base">
                    Contact Sales
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
                Built for Enterprise
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Everything your organization needs for comprehensive identity management at scale.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {enterpriseFeatures.map((feature) => (
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

        {/* Included Features */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Everything Included
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                All plans include our core features with enterprise-grade reliability.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {includedFeatures.map((feature) => (
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

        {/* Pricing Plans */}
        <section id="plans" className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Enterprise Plans
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Choose the plan that fits your organization. All plans include our core identity
                platform.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative p-6 rounded-lg border bg-card transition-colors ${
                    plan.popular
                      ? "border-emerald-500 ring-1 ring-emerald-500"
                      : "border-border hover:border-foreground/20"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500 text-white">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                    <div className="mt-2 text-3xl font-semibold text-foreground">{plan.price}</div>
                    <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact" className="block">
                    <Button
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                      size="lg"
                    >
                      {plan.cta}
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
                Industry Solutions
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Specialized identity management for regulated industries.
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

        {/* Testimonials */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Trusted by Industry Leaders
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                See why leading enterprises choose Aether for their identity needs.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.author}
                  className="p-6 rounded-lg border border-border bg-card"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed mb-4">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
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
                  Enterprise Compliance
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  Meet the most stringent security and compliance requirements with our
                  enterprise-grade identity platform.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="text-sm text-foreground">SOC 2 Type II</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="text-sm text-foreground">GDPR Ready</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="text-sm text-foreground">HIPAA Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="text-sm text-foreground">ISO 27001</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="text-sm text-foreground">FedRAMP Ready</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="text-sm text-foreground">PCI DSS</span>
                  </div>
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
                  <Building2 className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">Air-Gap</div>
                  <div className="text-sm text-muted-foreground">Deployment ready</div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Zap className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">Audit Logs</div>
                  <div className="text-sm text-muted-foreground">Complete trail</div>
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
                Common questions about our enterprise plans and services.
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
                Enterprise Resources
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Documentation, guides, and resources to help you get started.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {resources.map((resource) => (
                <Link
                  key={resource.title}
                  href="/contact"
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors group"
                >
                  <resource.icon className="h-8 w-8 text-foreground mb-4 group-hover:text-emerald-600 transition-colors" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {resource.description}
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
                Ready to Get Started?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Contact our enterprise team to discuss your identity management needs.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/contact">
                  <Button size="lg" className="gap-2 h-12 px-8 text-base">
                    Contact Sales
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
