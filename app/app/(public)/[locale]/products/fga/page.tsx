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
  Clock,
  Landmark,
  ShoppingCart,
  HeartPulse,
  Building,
  LockOpen,
  Eye,
  Workflow,
  Layers,
  Scale,
  PenTool,
  FileCheck,
  Gauge,
} from "lucide-react";

const features = [
  {
    icon: LockOpen,
    title: "Role-Based Access Control",
    description:
      "Define roles and hierarchies with inheritance, making it easy to manage permissions across large organizations.",
  },
  {
    icon: Eye,
    title: "Attribute-Based Policies",
    description:
      "Create dynamic policies based on user attributes, resource metadata, and contextual data like time, location, and device.",
  },
  {
    icon: Layers,
    title: "Hierarchical Scopes",
    description:
      "Support for nested groups, organizational units, and resource hierarchies with automatic permission propagation.",
  },
  {
    icon: Scale,
    title: "Deny Override",
    description:
      "Implement explicit deny rules that take precedence, ensuring security-critical permissions can be locked down.",
  },
  {
    icon: Workflow,
    title: "Policy Conditions",
    description:
      "Express complex authorization logic with conditions, expressions, and custom functions that evaluate in real-time.",
  },
  {
    icon: Gauge,
    title: "Real-Time Evaluation",
    description:
      "Sub-millisecond permission checks with cached policies and optimized evaluation engine for high-throughput APIs.",
  },
];

const metrics = [
  { value: "< 1ms", label: "Authorization latency" },
  { value: "10M+", label: "Policy evaluations/sec" },
  { value: "99.99%", label: "SLA availability" },
  { value: "Zero", label: "Vendor lock-in" },
];

const deploymentOptions = [
  {
    icon: Database,
    title: "On-Premise",
    description:
      "Full control with air-gapped deployment support. Your authorization data never leaves your infrastructure.",
  },
  {
    icon: Cloud,
    title: "Cloud Native",
    description:
      "Kubernetes operator with horizontal scaling, multi-region replication, and zero-trust networking.",
  },
  {
    icon: GitBranch,
    title: "Hybrid",
    description:
      "Bridge on-premise directories with cloud APIs through secure federation and policy synchronization.",
  },
];

const sdkSupport = [
  { name: "Node.js", category: "Backend" },
  { name: "Go", category: "Backend" },
  { name: "Python", category: "Backend" },
  { name: "Java", category: "Backend" },
  { name: ".NET", category: "Backend" },
  { name: "React", category: "Frontend" },
  { name: "Vue", category: "Frontend" },
  { name: "Angular", category: "Frontend" },
  { name: "iOS", category: "Mobile" },
  { name: "Android", category: "Mobile" },
];

const sampleCode = [
  {
    language: "typescript",
    filename: "authz.ts",
    code: `import { Aether Authorizer } from '@aether-identity/node';

const authorizer = new AetherAuthorizer({
  domain: 'auth.yourcompany.com',
  policyStore: 'policy-db',
});

// Check permissions with ABAC
const decision = await authorizer.check({
  action: 'read:document',
  resource: {
    id: doc.id,
    owner: doc.ownerId,
    department: doc.department,
    classification: doc.classification,
  },
  subject: {
    id: user.id,
    roles: user.roles,
    department: user.department,
    clearances: user.clearances,
  },
  context: {
    time: new Date(),
    ip: request.ip,
    device: request.deviceId,
  },
});

if (decision.effect === 'ALLOW') {
  // Access granted
}`,
  },
  {
    language: "json",
    filename: "policy.json",
    code: `{
  "version": "1.0",
  "policies": [
    {
      "id": "doc-access-policy",
      "effect": "ALLOW",
      "principals": ["role:employee"],
      "actions": ["doc:read", "doc:write"],
      "resources": ["resource:documents/*"],
      "conditions": {
        "match": {
          "subject.department": "resource.department"
        }
      }
    },
    {
      "id": "exec-only-policy",
      "effect": "ALLOW",
      "principals": ["role:executive"],
      "actions": ["*"],
      "resources": ["resource:documents/*"]
    },
    {
      "id": "deny-confidential",
      "effect": "DENY",
      "principals": ["role:employee"],
      "actions": ["doc:read"],
      "resources": ["resource:documents/*"],
      "conditions": {
        "equals": {
          "resource.classification": "confidential"
        }
      }
    }
  ]
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

const industries = [
  {
    icon: HeartPulse,
    title: "Healthcare",
    description:
      "HIPAA-compliant authorization for patient records, with role-based access to PHI and audit trails.",
  },
  {
    icon: Landmark,
    title: "Finance",
    description:
      "SOX-compliant controls with segregation of duties, transaction limits, and regulatory reporting.",
  },
  {
    icon: Building,
    title: "Government",
    description:
      "FedRAMP Ready solutions with classification-based access, need-to-know enforcement, and clearance levels.",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    description:
      "Dynamic authorization based on user tier, order value, and fraud risk scores with real-time policy updates.",
  },
];

const faqs = [
  {
    question: "What is the difference between RBAC and ABAC?",
    answer:
      "RBAC (Role-Based Access Control) assigns permissions to roles which are then assigned to users. ABAC (Attribute-Based Access Control) uses attributes of the subject, resource, and environment to make authorization decisions. Aether supports both models and allows you to combine them for hybrid policies.",
  },
  {
    question: "How does Aether handle policy updates?",
    answer:
      "Aether uses a policy versioning system with atomic updates. Changes are validated before deployment, and you can roll back to previous versions. Real-time propagation to authorization nodes ensures sub-second policy updates across your infrastructure.",
  },
  {
    question: "Can Aether integrate with my existing identity provider?",
    answer:
      "Yes, Aether integrates with any OIDC or SAML identity provider. It can sync groups and attributes from Active Directory, LDAP, or cloud identity providers. The authorization engine uses these attributes for policy evaluation without duplicating user data.",
  },
  {
    question: "Is there a free tier for Aether FGA?",
    answer:
      "Yes, Aether FGA Community Edition is free and open source. For high-throughput requirements, enterprise SLAs, and dedicated support, contact our sales team.",
  },
  {
    question: "How do you ensure authorization performance?",
    answer:
      "Aether uses an optimized policy evaluation engine with pre-compiled policies, attribute caching, and smart indexing. Our architecture supports horizontal scaling with policy distribution across multiple nodes, delivering sub-millisecond latency at millions of requests per second.",
  },
];

const resources = [
  {
    icon: FileText,
    title: "Whitepaper",
    description: "Modern Authorization Architecture Guide",
  },
  {
    icon: BookOpen,
    title: "E-book",
    description: "Zero Trust Authorization Implementation",
  },
  {
    icon: Calendar,
    title: "Webinar",
    description: "RBAC to ABAC: Migration Strategies",
  },
  {
    icon: BarChart3,
    title: "Case Study",
    description: "How TechFlow Secured API Access at Scale",
  },
];

const recentUpdates = [
  {
    version: "v2.4.0",
    date: "March 2026",
    description: "Graph-based policy evaluation and improved hierarchy support",
  },
  {
    version: "v2.3.0",
    date: "February 2026",
    description: "Custom condition functions and policy testing framework",
  },
  {
    version: "v2.2.0",
    date: "January 2026",
    description: "Kubernetes operator improvements and multi-region support",
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
                Product: Fine-Grained Authorization
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight text-balance">
                Authorization That Adapts to Your Complex Requirements
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Implement RBAC, ABAC, or hybrid authorization policies with real-time evaluation,
                sub-millisecond latency, and complete audit trails.
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

        {/* Core Features */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Fine-Grained Authorization
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                From simple role assignments to complex attribute-based policies. Aether FGA gives
                you the flexibility to express any authorization model.
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

        {/* Code Example Section */}
        <section className="py-20 lg:py-28 bg-foreground text-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-balance">
                  Authorization in Code
                </h2>
                <p className="mt-4 text-lg text-background/70 leading-relaxed">
                  Define policies in code or JSON, test them locally, and deploy with confidence.
                  Our SDKs make it easy to integrate authorization into your applications.
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
                      Quickstart Guides
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <CodeBlock samples={sampleCode} defaultLanguage="json" />
              </div>
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
                Whether you need complete isolation, cloud scalability, or a hybrid approach, Aether
                FGA adapts to your infrastructure requirements.
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

        {/* Industry Use Cases */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Built for Regulated Industries
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Specialized authorization solutions tailored to the unique security and compliance
                requirements of your sector.
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
                  Enterprise-Grade Security
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  Aether FGA is designed to meet the stringent security and compliance requirements
                  of healthcare, finance, government, and enterprise organizations.
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
                  <div className="text-sm text-muted-foreground">Policy encryption</div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Lock className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">TLS 1.3</div>
                  <div className="text-sm text-muted-foreground">API encryption</div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <FileCheck className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">Audit Logs</div>
                  <div className="text-sm text-muted-foreground">Complete trail</div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <PenTool className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">Policy Tests</div>
                  <div className="text-sm text-muted-foreground">Pre-deployment</div>
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
                Common questions about Aether FGA and authorization.
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
                Explore our documentation, guides, and latest research on authorization.
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

        {/* Recent Updates */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">Recent Updates</h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Stay up to date with the latest features and improvements.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {recentUpdates.map((update) => (
                <div
                  key={update.version}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{update.date}</span>
                  </div>
                  <div className="text-lg font-semibold text-foreground mb-2">{update.version}</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {update.description}
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
                Take Control of Your Authorization
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Implement fine-grained authorization that scales with your organization. Open
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
