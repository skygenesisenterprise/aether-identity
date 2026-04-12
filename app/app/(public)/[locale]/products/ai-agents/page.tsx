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
  Key,
  Zap,
  ArrowRight,
  Code2,
  Building2,
  CheckCircle2,
  GitBranch,
  Database,
  Cloud,
  FileText,
  BookOpen,
  Calendar,
  BarChart3,
  Clock,
  X,
  Landmark,
  ShoppingCart,
  HeartPulse,
  Building,
  Brain,
  Network,
  Eye,
  Workflow,
} from "lucide-react";

const capabilities = [
  {
    icon: Brain,
    title: "AI-Native Identity",
    description:
      "Purpose-built identity layer for AI agents with credential management, session handling, and permission scoping designed for autonomous systems.",
  },
  {
    icon: Key,
    title: "Agent Credentials",
    description:
      "Secure credential issuance for AI agents with automatic rotation, scoped permissions, and usage tracking for every agent identity.",
  },
  {
    icon: Network,
    title: "Agent Mesh",
    description:
      "Enable secure inter-agent communication with verified identities, capability-based access, and audit trails across your agent fleet.",
  },
  {
    icon: Shield,
    title: "Autonomous Security",
    description:
      "Risk-based policies that adapt to agent behavior with anomaly detection, rate limiting, and automatic threat response.",
  },
  {
    icon: Workflow,
    title: "Agent Workflows",
    description:
      "Define identity-based workflows that agents can execute with explicit permissions and multi-step approval chains.",
  },
  {
    icon: Eye,
    title: "Full Observability",
    description:
      "Complete audit logs, metrics, and traces for every agent action with real-time dashboards and alerting.",
  },
];

const metrics = [
  { value: "< 5ms", label: "Agent authentication" },
  { value: "10K+", label: "Agents supported" },
  { value: "99.99%", label: "Uptime SLA" },
  { value: "Zero", label: "Credential leaks" },
];

const deploymentOptions = [
  {
    icon: Database,
    title: "On-Premise",
    description:
      "Deploy in your own data center with complete isolation for sensitive AI operations.",
  },
  {
    icon: Cloud,
    title: "Cloud Native",
    description:
      "Kubernetes-native deployment with horizontal scaling and cloud provider integrations.",
  },
  {
    icon: GitBranch,
    title: "Hybrid",
    description: "Bridge on-premise agents with cloud AI services through secure federation.",
  },
];

const sdkSupport = [
  { name: "Python", category: "SDK" },
  { name: "TypeScript", category: "SDK" },
  { name: "Go", category: "SDK" },
  { name: "Rust", category: "SDK" },
  { name: "OpenAI", category: "Integration" },
  { name: "Anthropic", category: "Integration" },
  { name: "LangChain", category: "Integration" },
  { name: "CrewAI", category: "Integration" },
  { name: "AutoGen", category: "Integration" },
  { name: "Vertex AI", category: "Integration" },
];

const sampleCode = [
  {
    language: "typescript",
    filename: "agent-auth.ts",
    code: `import { AetherAgent } from '@aether-identity/agent';

const agent = new AetherAgent({
  domain: 'auth.yourcompany.com',
  agentId: process.env.AETHER_AGENT_ID,
  agentKey: process.env.AETHER_AGENT_KEY,
});

// Authenticate agent
await agent.authenticate();

// Execute workflow with scoped permissions
const result = await agent.execute('data-pipeline', {
  inputs: { dataset: 'customer-data' },
  permissions: ['read:data', 'write:results'],
});`,
  },
  {
    language: "python",
    filename: "agent_auth.py",
    code: `from aether_identity import AetherAgent

agent = AetherAgent(
    domain="auth.yourcompany.com",
    agent_id=os.environ["AETHER_AGENT_ID"],
    agent_key=os.environ["AETHER_AGENT_KEY"],
)

# Authenticate agent
await agent.authenticate()

# Execute workflow with scoped permissions
result = await agent.execute(
    "data-pipeline",
    inputs={"dataset": "customer-data"},
    permissions=["read:data", "write:results"],
)`,
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
    title: "Healthcare AI",
    description:
      "HIPAA-compliant AI agents for patient data processing, clinical workflows, and medical research.",
  },
  {
    icon: Landmark,
    title: "Financial Services",
    description:
      "AI agents for trading, risk analysis, and regulatory compliance with full audit trails.",
  },
  {
    icon: Building,
    title: "Enterprise Automation",
    description:
      "Autonomous agents for business processes, document processing, and decision support.",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    description:
      "AI agents for customer service, inventory management, and personalized recommendations.",
  },
];

const faqs = [
  {
    question: "How is Aether for AI Agents different from regular IAM?",
    answer:
      "Aether for AI Agents is purpose-built for autonomous AI systems. It handles agent-specific concepts like capability scoping, inter-agent communication, workflow execution, and adaptive security policies that traditional IAM systems don't support.",
  },
  {
    question: "Can I use Aether with my existing LLM provider?",
    answer:
      "Yes, Aether integrates with OpenAI, Anthropic, Google Gemini, and any LangChain-compatible model. We're continuously adding new integrations.",
  },
  {
    question: "How do you handle agent credential security?",
    answer:
      "We use hardware security modules (HSM) for key storage, automatic credential rotation, short-lived tokens, and comprehensive audit logging. Credentials never leave your secure infrastructure.",
  },
  {
    question: "Is there a free tier for testing?",
    answer:
      "Yes, Aether Community Edition is free and includes up to 100 agents. For larger deployments, contact our sales team.",
  },
];

const resources = [
  {
    icon: FileText,
    title: "Whitepaper",
    description: "AI Agent Identity Architecture Guide",
  },
  {
    icon: BookOpen,
    title: "E-book",
    description: "Securing Autonomous AI Systems",
  },
  {
    icon: Calendar,
    title: "Webinar",
    description: "Building Trustworthy AI Agents",
  },
  {
    icon: BarChart3,
    title: "Case Study",
    description: "How TechFlow Scaled to 10K+ AI Agents",
  },
];

const teamMembers = [
  { name: "Alex Chen", role: "CEO & Founder", image: "AC" },
  { name: "Sarah Miller", role: "CTO", image: "SM" },
  { name: "James Wilson", role: "VP Engineering", image: "JW" },
  { name: "Emily Davis", role: "Head of Security", image: "ED" },
];

const recentUpdates = [
  {
    version: "v1.3.0",
    date: "March 2026",
    description: "Agent Mesh GA and improved inter-agent auth",
  },
  {
    version: "v1.2.0",
    date: "February 2026",
    description: "Autonomous security policies and anomaly detection",
  },
  {
    version: "v1.1.0",
    date: "January 2026",
    description: "Workflow execution with multi-step approvals",
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
                AI Agent Identity Platform
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight text-balance">
                Secure Identity for Autonomous AI Agents
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Purpose-built identity and access management for AI agents. Secure credential
                issuance, capability scoping, inter-agent authentication, and full observability for
                your agent fleet.
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

        {/* Trusted By Section */}
        <section className="py-16 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Trusted by industry leaders
              </p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
              <div className="text-xl font-semibold text-muted-foreground/60">Acme Corp</div>
              <div className="text-xl font-semibold text-muted-foreground/60">TechFlow</div>
              <div className="text-xl font-semibold text-muted-foreground/60">SecureBank</div>
              <div className="text-xl font-semibold text-muted-foreground/60">HealthPlus</div>
              <div className="text-xl font-semibold text-muted-foreground/60">GlobalSys</div>
              <div className="text-xl font-semibold text-muted-foreground/60">DataVault</div>
            </div>
          </div>
        </section>

        {/* Core Capabilities */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Core Capabilities
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Every feature designed specifically for AI agent identity and autonomous systems.
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

        {/* Comparison Table */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">How We Compare</h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                See why leading organizations choose Aether for AI agent identity.
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
                      Aether
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">
                      AWS IAM
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">
                      Azure AD
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">
                      Okta
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-4 px-4 text-sm text-foreground">Agent credentials</td>
                    <td className="py-4 px-4 text-center">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-4 px-4 text-sm text-foreground">Capability scoping</td>
                    <td className="py-4 px-4 text-center">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-4 px-4 text-sm text-foreground">Agent mesh</td>
                    <td className="py-4 px-4 text-center">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-4 px-4 text-sm text-foreground">Workflow execution</td>
                    <td className="py-4 px-4 text-center">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-4 px-4 text-sm text-foreground">Autonomous security</td>
                    <td className="py-4 px-4 text-center">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-4 px-4 text-sm text-foreground">Self-hosted</td>
                    <td className="py-4 px-4 text-center">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-4 px-4 text-sm text-foreground">SLA guarantee</td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-sm font-medium text-foreground">99.99%</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-sm text-muted-foreground">99.9%</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-sm text-muted-foreground">99.9%</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-sm text-muted-foreground">99.9%</span>
                    </td>
                  </tr>
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
                  Integrate in Minutes, Not Weeks
                </h2>
                <p className="mt-4 text-lg text-background/70 leading-relaxed">
                  Our SDKs make it simple to add agent identity to your AI applications with just a
                  few lines of code.
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
                <CodeBlock samples={sampleCode} defaultLanguage="typescript" />
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
                adapts to your infrastructure.
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
                Built for Every Industry
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Specialized identity solutions for AI agents in regulated industries.
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
                  Built for Regulated Industries
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  Aether for AI Agents meets the stringent security and compliance requirements of
                  healthcare, finance, government, and enterprise organizations.
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
                Common questions about Aether for AI Agents.
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
                Explore our documentation, guides, and latest research on AI agent security.
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

        {/* Team Section */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Built by Experts
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Our team brings decades of experience in identity, security, and AI infrastructure.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="p-6 rounded-lg border border-border bg-card text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-foreground/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-semibold text-foreground">{member.image}</span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
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
                Secure Your AI Agent Fleet
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Deploy Aether for AI Agents today and gain complete control over agent identity,
                credentials, and permissions. Open source, self-hosted, enterprise-ready.
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
