import Link from "next/link";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import {
  Shield,
  Lock,
  Users,
  Zap,
  ArrowRight,
  Server,
  Building2,
  CheckCircle2,
  FileCheck,
  Handshake,
  Bus,
  ClipboardList,
  Search,
  GraduationCap,
  Vote,
  Banknote,
  AlertTriangle,
  FileText,
  Calendar,
  BarChart3,
  Clock,
  Scale,
  Database,
  Cloud,
  Landmark,
  UserCheck,
  Key,
  Signal,
} from "lucide-react";

const capabilities = [
  {
    icon: Building2,
    title: "FedRAMP Authorized",
    description:
      "Complete FedRAMP compliance pathway with Authority to Operate (ATO) documentation and continuous monitoring support.",
  },
  {
    icon: Key,
    title: "ICAM Integration",
    description:
      "Seamless integration with government ICAM (Identity, Credential, and Access Management) frameworks and PIV/PIV-I cards.",
  },
  {
    icon: Shield,
    title: "Zero Trust Architecture",
    description:
      "Implement Zero Trust principles with continuous verification, least privilege access, and micro-segmentation.",
  },
  {
    icon: Database,
    title: "On-Premise Deployment",
    description:
      "Deploy in government data centers with air-gapped capabilities. Your data never leaves your infrastructure.",
  },
  {
    icon: Users,
    title: "Citizen Identity",
    description:
      "Secure authentication for citizen portals, benefits enrollment, and public service applications.",
  },
  {
    icon: FileCheck,
    title: "Audit & Compliance",
    description:
      "Comprehensive audit logs, FISMA compliance reporting, and automated compliance dashboards.",
  },
];

const certifications = [
  { name: "FedRAMP Ready", status: "In Progress" },
  { name: "FIPS 140-2", status: "Certified" },
  { name: "SOC 2 Type II", status: "Certified" },
  { name: "NIST SP 800-53", status: "Compliant" },
  { name: "WCAG 2.1 AA", status: "Compliant" },
  { name: "Section 508", status: "Compliant" },
];

const governmentSolutions = [
  {
    icon: UserCheck,
    title: "Government Employee Access",
    description:
      "Secure internal agency access with PIV card integration, multi-factor authentication, and role-based access control for government systems.",
  },
  {
    icon: Bus,
    title: "Public Transportation",
    description:
      "Citizen authentication for transit applications, fare management, and multi-modal transportation networks.",
  },
  {
    icon: GraduationCap,
    title: "Education",
    description:
      "Student and faculty identity management for educational portals, financial aid, and academic records access.",
  },
  {
    icon: Vote,
    title: "Elections",
    description:
      "Secure voter authentication, absentee voting, and election administration systems.",
  },
  {
    icon: Banknote,
    title: "Benefits Administration",
    description:
      "Citizen identity verification for social services, unemployment benefits, and public assistance programs.",
  },
  {
    icon: Search,
    title: "Law Enforcement",
    description:
      "Secure access to criminal justice databases, case management systems, and inter-agency collaboration platforms.",
  },
];

const deploymentOptions = [
  {
    icon: Database,
    title: "Government Cloud",
    description:
      "Deploy on AWS GovCloud, Azure Government, or Google Cloud for Government with FedRAMP compliance.",
  },
  {
    icon: Server,
    title: "On-Premise",
    description:
      "Full control in your data center with air-gapped deployment options and government-approved hosting.",
  },
  {
    icon: Cloud,
    title: "Hybrid",
    description:
      "Bridge on-premise systems with cloud applications through secure federation and API integration.",
  },
];

const complianceStandards = [
  "FedRAMP",
  "FISMA",
  "NIST SP 800-53",
  "HIPAA",
  "Section 508",
  "WCAG 2.1",
  "E-Gov",
  "Civic Services",
];

const agencyTypes = [
  { name: "Federal Agencies", count: "24" },
  { name: "State Governments", count: "50" },
  { name: "Local Municipalities", count: "500+" },
  { name: "International Governments", count: "12" },
];

const benefits = [
  {
    title: "Faster ATO Process",
    description:
      "Pre-built documentation and compliance artifacts accelerate your FedRAMP Authorization to Operate.",
    icon: Clock,
  },
  {
    title: "Reduced Costs",
    description:
      "Self-hosted deployment eliminates per-user licensing fees and reduces identity infrastructure costs by up to 60%.",
    icon: Landmark,
  },
  {
    title: "Complete Control",
    description:
      "Your data stays in your infrastructure. No third-party access to citizen information or government systems.",
    icon: Lock,
  },
  {
    title: "Interoperability",
    description:
      "Seamless integration with existing government systems, ICAM frameworks, and agency databases.",
    icon: Handshake,
  },
];

const faqs = [
  {
    question: "Is Aether FedRAMP authorized?",
    answer:
      "We are currently on the FedRAMP authorization pathway with AWS GovCloud and Azure Government. Our on-premise deployment option allows agencies to leverage their existing ATO.",
  },
  {
    question: "Does Aether support PIV/PIV-I cards?",
    answer:
      "Yes, Aether fully supports PIV (Personal Identity Verification) and PIV-I (PIV-Interoperable) cards for government employee authentication.",
  },
  {
    question: "Can Aether be deployed in an air-gapped environment?",
    answer:
      "Yes, Aether supports air-gapped deployments with no external network dependencies. All components can operate fully offline.",
  },
  {
    question: "What agencies are currently using Aether?",
    answer:
      "Aether is being used by various federal, state, and local government agencies. Contact our government team for specific case studies.",
  },
  {
    question: "How does Aether handle Section 508 accessibility?",
    answer:
      "Aether is built with Section 508 and WCAG 2.1 AA compliance in mind. Our UI components are fully accessible and undergo regular accessibility audits.",
  },
];

const resources = [
  {
    icon: FileText,
    title: "Whitepaper",
    description: "FedRAMP Compliance Guide for Identity Providers",
  },
  {
    icon: ClipboardList,
    title: "Case Study",
    description: "State Agency Reduces Auth Costs by 60%",
  },
  {
    icon: Calendar,
    title: "Webinar",
    description: "Zero Trust Implementation for Government",
  },
  {
    icon: BarChart3,
    title: "TCO Calculator",
    description: "Calculate Your Identity Infrastructure Savings",
  },
];

export default async function GovernmentPage({ params }: { params: Promise<{ locale: string }> }) {
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
                Government Solutions
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight text-balance">
                Identity Infrastructure for the Public Sector
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                FedRAMP-ready, self-hosted identity management built for government agencies. Secure
                citizen services, protect sensitive data, and maintain complete control.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                <Link href="/contact">
                  <Button size="lg" className="gap-2 h-12 px-6 text-base">
                    Contact Government Sales
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

        {/* Agency Types */}
        <section className="py-16 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {agencyTypes.map((agency) => (
                <div key={agency.name}>
                  <div className="text-3xl sm:text-4xl font-semibold text-foreground">
                    {agency.count}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">{agency.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Capabilities Section */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Government-Grade Security
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Built to meet the stringent security and compliance requirements of federal, state,
                and local government agencies.
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

        {/* Certifications */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Certifications & Compliance
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Aether meets the most demanding government security and accessibility standards.
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {certifications.map((cert) => (
                <div
                  key={cert.name}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-card"
                >
                  <span className="text-sm font-medium text-foreground">{cert.name}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      cert.status === "Certified"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : cert.status === "Compliant"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                    }`}
                  >
                    {cert.status}
                  </span>
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
                Why Government Agencies Choose Aether
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Reduce costs, accelerate compliance, and maintain complete sovereignty over your
                citizen data.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="p-6 rounded-lg border border-border bg-card">
                  <benefit.icon className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Government Solutions */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Solutions for Every Government Sector
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Specialized identity management tailored to the unique needs of government programs
                and public services.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {governmentSolutions.map((solution) => (
                <div
                  key={solution.title}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <solution.icon className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{solution.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {solution.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Deployment Options */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Deploy According to Your Requirements
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Choose the deployment model that meets your agency&apos;s security posture and
                infrastructure needs.
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
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                  Built for Compliance
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  Aether is designed to help your agency meet the most demanding security and
                  accessibility compliance requirements.
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
                  <Scale className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">FIPS 140-2</div>
                  <div className="text-sm text-muted-foreground">Cryptographic modules</div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Signal className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">TLS 1.3</div>
                  <div className="text-sm text-muted-foreground">Secure transport</div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <AlertTriangle className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">NIST</div>
                  <div className="text-sm text-muted-foreground">SP 800-53 controls</div>
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
                Common questions about government identity solutions.
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
                Guides, case studies, and compliance resources for government agencies.
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
                Secure Your Government Identity Infrastructure
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join federal, state, and local government agencies that trust Aether for their
                identity management needs.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/contact">
                  <Button size="lg" className="gap-2 h-12 px-8 text-base">
                    Contact Government Sales
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
