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
  HeartPulse,
  Stethoscope,
  Hospital,
  UserCog,
  Activity,
  Brain,
  ClipboardCheck,
  Scale,
  CheckCircle2,
  Building2,
  Database,
  Globe,
  Key,
} from "lucide-react";

const features = [
  {
    icon: HeartPulse,
    title: "Patient Portal Security",
    description:
      "Secure patient authentication with MFA, biometric support, and smart card integration for accessing medical records, scheduling appointments, and managing prescriptions.",
  },
  {
    icon: Stethoscope,
    title: "Telemedicine Authentication",
    description:
      "HIPAA-compliant video consultation authentication with end-to-end encryption, session timeouts, and audit logging for all telehealth interactions.",
  },
  {
    icon: Hospital,
    title: "EHR/EMR Integration",
    description:
      "Seamless integration with Epic, Cerner, Allscripts, and other major EHR systems using SAML 2.0, OAuth 2.0, and FHIR-based identity protocols.",
  },
  {
    icon: UserCog,
    title: "Provider Identity Management",
    description:
      "Manage credentials for physicians, nurses, administrative staff, and contractors with role-based access tailored to clinical workflows.",
  },
  {
    icon: Activity,
    title: "Real-Time Monitoring",
    description:
      "Continuous security monitoring with anomaly detection, failed login alerts, and suspicious activity flags for compliance and threat prevention.",
  },
  {
    icon: Brain,
    title: "Clinical Decision Support",
    description:
      "Attribute-based access control that adapts permissions based on patient-provider relationships, department assignments, and treatment contexts.",
  },
];

const complianceFeatures = [
  {
    icon: Shield,
    title: "HIPAA Compliance",
    description:
      "Full HIPAA Security Rule compliance with administrative, physical, and technical safeguards built into every authentication flow.",
  },
  {
    icon: ClipboardCheck,
    title: "Audit Trail",
    description:
      "Comprehensive audit logging of all PHI access with immutable records, retention policies, and export capabilities for compliance audits.",
  },
  {
    icon: Lock,
    title: "Data Encryption",
    description:
      "AES-256 encryption at rest and TLS 1.3 in transit. Support for customer-managed encryption keys in on-premise deployments.",
  },
  {
    icon: Scale,
    title: "Access Governance",
    description:
      "Automated access reviews, least-privilege enforcement, and segregation of duties (SoD) policies to meet regulatory requirements.",
  },
];

const metrics = [
  { value: "100%", label: "HIPAA compliance" },
  { value: "< 15ms", label: "Authentication latency" },
  { value: "99.99%", label: "System availability" },
  { value: "Zero", label: "Data breaches" },
];

const useCases = [
  {
    icon: Users,
    title: "Patient Access",
    description:
      "Self-service password management, MFA enrollment, and secure sharing of medical records with family members or other providers.",
  },
  {
    icon: Building2,
    title: "Staff Authentication",
    description:
      "Single sign-on across clinical applications, smart card integration, and proximity-based authentication for hospital environments.",
  },
  {
    icon: Database,
    title: "Interoperability",
    description:
      "Federated identity across healthcare networks, HIEs, and partner organizations using standards-based protocols.",
  },
  {
    icon: Globe,
    title: "Remote Work",
    description:
      "Secure VPN-less access for remote clinical staff, telehealth providers, and administrative personnel working from home.",
  },
];

const integrations = [
  "Epic MyChart",
  "Cerner PowerChart",
  "Allscripts Sunrise",
  "MEDITECH Expanse",
  "eClinicalWorks",
  "Athenahealth",
  "NextGen Healthcare",
  "MEDITECH",
];

const deploymentOptions = [
  {
    icon: Server,
    title: "On-Premise",
    description:
      "Deploy within your data center or private cloud. Air-gapped options available for maximum security environments.",
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
      "Bridge on-premise EHR systems with cloud applications while maintaining consistent identity policies.",
  },
];

const faqs = [
  {
    question: "Is Aether HIPAA certified?",
    answer:
      "Aether Identity is designed to meet HIPAA Security Rule requirements. We provide a Business Associate Agreement (BAA) for all healthcare deployments and can assist with your compliance documentation.",
  },
  {
    question: "Can we integrate with our existing EHR system?",
    answer:
      "Yes, Aether supports SAML 2.0, OAuth 2.0/OpenID Connect, and SCIM integrations with all major EHR platforms including Epic, Cerner, Allscripts, and MEDITECH.",
  },
  {
    question: "How do you handle patient consent for data sharing?",
    answer:
      "Aether supports granular consent management through attribute-based policies. You can define which data types can be shared with which parties based on patient consent records.",
  },
  {
    question: "Can healthcare staff use their existing hospital credentials?",
    answer:
      "Yes, Aether supports user federation with Active Directory, LDAP, and existing IAM systems. Staff can continue using their hospital credentials while gaining SSO access to clinical applications.",
  },
  {
    question: "Do you offer emergency access (break-glass) procedures?",
    answer:
      "Yes, Aether supports emergency access workflows with elevated privilege provisioning, dual-actor approval, and mandatory post-access review documentation.",
  },
];

const resources = [
  {
    icon: FileText,
    title: "Whitepaper",
    description: "Healthcare Identity Management Guide",
  },
  {
    icon: ClipboardCheck,
    title: "Compliance Report",
    description: "HIPAA Security Rule Implementation",
  },
  {
    icon: Calendar,
    title: "Webinar",
    description: "EHR Integration Best Practices",
  },
  {
    icon: BarChart3,
    title: "Case Study",
    description: "Regional Hospital Network Migration",
  },
];

export default async function HealthcarePage({ params }: { params: Promise<{ locale: string }> }) {
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
                Healthcare Solutions
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight text-balance">
                HIPAA-Compliant Identity for Modern Healthcare
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Secure patient portals, provider authentication, EHR integration, and telemedicine
                platforms with enterprise-grade identity management designed for healthcare
                regulatory requirements.
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
                Built for Healthcare Workflows
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Every feature designed to meet the unique security, compliance, and usability
                requirements of healthcare environments.
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
                Healthcare Compliance Built-In
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Meet HIPAA, HITECH, and emerging healthcare data regulations with confidence.
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
                From patient access to clinical workflows, Aether secures every touchpoint in the
                healthcare ecosystem.
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

        {/* EHR Integrations */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                EHR System Integrations
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Seamless integration with the healthcare applications you already use.
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
              Don&apos;t see your EHR? Contact us for custom integration support.
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
                  Enterprise Security for Patient Data
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  Protect sensitive health information with military-grade security controls
                  designed specifically for healthcare environments.
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
                    <Key className="h-6 w-6 text-foreground mb-2" />
                    <div className="text-lg font-semibold text-foreground">CMEK</div>
                    <div className="text-sm text-muted-foreground">Customer keys</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span className="text-sm text-foreground">SAML 2.0 & OAuth 2.0/OIDC support</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span className="text-sm text-foreground">
                    Smart card & proximity card integration
                  </span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span className="text-sm text-foreground">
                    Automatic session timeout policies
                  </span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span className="text-sm text-foreground">
                    Dual-factor authentication (TOTP, SMS, email)
                  </span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span className="text-sm text-foreground">
                    Break-glass emergency access workflows
                  </span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span className="text-sm text-foreground">
                    Real-time threat detection & alerting
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
                Common questions about healthcare identity management.
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
                Explore guides, compliance documentation, and case studies for healthcare identity.
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
                Secure Your Healthcare Identity Today
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join healthcare organizations that trust Aether Identity to protect patient data and
                enable secure clinical workflows.
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
