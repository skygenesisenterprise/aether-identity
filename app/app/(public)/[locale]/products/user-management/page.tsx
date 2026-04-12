import Link from "next/link";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import { CodeBlock } from "@/components/public/CodeBlock";
import {
  Users,
  UserPlus,
  UserCog,
  Shield,
  Activity,
  Clock,
  FileText,
  Settings,
  Database,
  Mail,
  Phone,
  Building2,
  ArrowRight,
  CheckCircle2,
  Search,
  Filter,
  Download,
  Upload,
  Trash2,
  Edit3,
  UserCheck,
  UserX,
  Layers,
  BadgeCheck,
  AlertTriangle,
  BarChart3,
  Calendar,
} from "lucide-react";

const capabilities = [
  {
    icon: UserPlus,
    title: "User Lifecycle Management",
    description:
      "Complete user onboarding, profile management, and offboarding workflows with automated role assignment and deprovisioning.",
  },
  {
    icon: Search,
    title: "Advanced Directory Search",
    description:
      "Powerful search with filters, pagination, and real-time results across millions of user records with sub-millisecond performance.",
  },
  {
    icon: Shield,
    title: "Role-Based Access Control",
    description:
      "Granular permission management with hierarchical roles, custom attributes, and dynamic access policies based on user context.",
  },
  {
    icon: Activity,
    title: "Real-Time Activity Monitoring",
    description:
      "Live dashboard of user activities, session tracking, and behavioral analytics to detect anomalies and ensure compliance.",
  },
  {
    icon: FileText,
    title: "Comprehensive Audit Trails",
    description:
      "Complete history of all user actions, modifications, and system events with tamper-proof logging and export capabilities.",
  },
  {
    icon: Settings,
    title: "Workflow Automation",
    description:
      "Automated user provisioning, approval workflows, and scheduled tasks to reduce manual overhead and ensure consistency.",
  },
];

const metrics = [
  { value: "10M+", label: "Users supported per instance" },
  { value: "< 50ms", label: "Directory query latency" },
  { value: "99.99%", label: "Service availability" },
  { value: "Zero", label: "Data loss tolerance" },
];

const features = [
  {
    title: "Bulk Operations",
    description:
      "Import, update, or delete thousands of users in a single operation with CSV or JSON upload.",
    icon: Upload,
  },
  {
    title: "Custom Attributes",
    description:
      "Extend user profiles with custom fields, schemas, and validation rules specific to your organization.",
    icon: Layers,
  },
  {
    title: "Delegated Administration",
    description:
      "Grant limited admin access to department managers without full system privileges.",
    icon: UserCog,
  },
  {
    title: "Password Policies",
    description:
      "Configurable password complexity, expiration, history, and multi-factor authentication requirements.",
    icon: Shield,
  },
  {
    title: "Account Lifecycle",
    description:
      "Automated triggers for onboarding, transfers, suspensions, and termination based on HR events.",
    icon: Calendar,
  },
  {
    title: "Reporting & Analytics",
    description:
      "Built-in reports on user activity, compliance status, and administrative actions with export options.",
    icon: BarChart3,
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

const integrations = [
  { name: "Active Directory", category: "Directory" },
  { name: "LDAP", category: "Directory" },
  { name: "Slack", category: "Communication" },
  { name: "Microsoft 365", category: "Productivity" },
  { name: "Google Workspace", category: "Productivity" },
  { name: "ServiceNow", category: "ITSM" },
  { name: "Workday", category: "HRIS" },
  { name: "SAP", category: "ERP" },
];

const sampleCode = [
  {
    language: "typescript",
    filename: "users.ts",
    code: `import { AetherUsers } from '@aether-identity/admin';

const users = new AetherUsers({
  domain: 'yourcompany.com',
  apiKey: process.env.AETHER_API_KEY,
});

// Create a new user with custom attributes
const user = await users.create({
  email: 'john.doe@company.com',
  firstName: 'John',
  lastName: 'Doe',
  department: 'Engineering',
  title: 'Senior Developer',
  groups: ['engineers', 'api-developers'],
  roles: ['developer'],
});

// Query users with advanced filters
const result = await users.list({
  filter: {
    department: 'Engineering',
    status: 'active',
  },
  limit: 100,
  offset: 0,
});`,
  },
  {
    language: "python",
    filename: "users.py",
    code: `from aether_admin import AetherUsers

users = AetherUsers(
    domain='yourcompany.com',
    api_key=os.environ['AETHER_API_KEY']
)

# Create a new user with custom attributes
user = users.create(
    email='john.doe@company.com',
    first_name='John',
    last_name='Doe',
    department='Engineering',
    title='Senior Developer',
    groups=['engineers', 'api-developers'],
    roles=['developer']
)

# Query users with advanced filters
result = users.list(
    filter={
        'department': 'Engineering',
        'status': 'active',
    },
    limit=100,
    offset=0
)`,
  },
];

const faqs = [
  {
    question: "How does user management integrate with our existing directory?",
    answer:
      "Aether User Management supports bidirectional synchronization with Active Directory, LDAP, and other identity sources. Changes made in either system are automatically synced, ensuring consistent user data across your infrastructure.",
  },
  {
    question: "Can we bulk import users from our HR system?",
    answer:
      "Yes, our bulk import feature supports CSV and JSON formats with field mapping, validation rules, and error reporting. You can also set up automated imports from Workday, SAP, or any system via our API.",
  },
  {
    question: "How do you handle user deprovisioning?",
    answer:
      "When a user is terminated, Aether automatically revokes all access, removes from groups, archives their data, and can trigger offboarding workflows in connected systems like email, cloud storage, and SaaS applications.",
  },
  {
    question: "Is there a limit on the number of users we can manage?",
    answer:
      "Aether User Management is designed to scale to millions of users. Our distributed architecture ensures consistent performance regardless of user count, with horizontal scaling capabilities for enterprise deployments.",
  },
  {
    question: "Can we customize the user data model?",
    answer:
      "Yes, you can define custom attributes, schemas, and validation rules that align with your organization's data requirements. Custom fields support various data types and can be used in workflows, reports, and access policies.",
  },
];

const resources = [
  {
    icon: FileText,
    title: "Documentation",
    description: "Complete API reference and admin guides",
  },
  {
    icon: Settings,
    title: "Integration Guide",
    description: "Connect with your existing systems",
  },
  {
    icon: Calendar,
    title: "Webinar",
    description: "Advanced user management strategies",
  },
  {
    icon: BarChart3,
    title: "Case Study",
    description: "How Enterprise Corp scaled to 500K users",
  },
];

export default async function UserManagementPage({
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
                Enterprise User Management
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight text-balance">
                Complete Identity Lifecycle Management
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Centralize user provisioning, deprovisioning, and profile management across your
                entire organization. Scale to millions of users with enterprise-grade performance
                and security.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                <Link href="/docs">
                  <Button size="lg" className="gap-2 h-12 px-6 text-base">
                    View Documentation
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="h-12 px-6 text-base">
                    Contact Sales
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
                Enterprise-Grade User Management
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Built for organizations that need complete control over their user identity
                lifecycle with advanced automation, compliance, and integration capabilities.
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
                Everything You Need to Manage Users
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Comprehensive tools to handle user identity at any scale, from small teams to global
                enterprises.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
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

        {/* Code Example Section */}
        <section className="py-20 lg:py-28 bg-foreground text-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-balance">
                  Programmatic User Management
                </h2>
                <p className="mt-4 text-lg text-background/70 leading-relaxed">
                  Our REST API and SDKs give you full control over user lifecycle operations.
                  Automate provisioning, build custom admin portals, or integrate with your existing
                  tools.
                </p>
                <div className="mt-8">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 text-sm bg-background/10 rounded-md text-background/80">
                      REST API
                    </span>
                    <span className="px-3 py-1.5 text-sm bg-background/10 rounded-md text-background/80">
                      GraphQL
                    </span>
                    <span className="px-3 py-1.5 text-sm bg-background/10 rounded-md text-background/80">
                      Webhooks
                    </span>
                    <span className="px-3 py-1.5 text-sm bg-background/10 rounded-md text-background/80">
                      SCIM 2.0
                    </span>
                  </div>
                </div>
                <div className="mt-8">
                  <Link href="/docs">
                    <Button variant="secondary" size="lg" className="gap-2">
                      API Reference
                      <ArrowRight className="h-4 w-4" />
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

        {/* Integrations Section */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Seamless Integrations
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Connect with your existing enterprise systems for unified identity management across
                your entire infrastructure.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {integrations.map((integration) => (
                <div
                  key={integration.name}
                  className="p-4 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors text-center"
                >
                  <div className="text-base font-semibold text-foreground">{integration.name}</div>
                  <div className="text-sm text-muted-foreground">{integration.category}</div>
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
                  User management designed to meet the stringent security and compliance
                  requirements of healthcare, finance, government, and enterprise organizations.
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
                  <div className="text-2xl font-semibold text-foreground">SOC 2</div>
                  <div className="text-sm text-muted-foreground">Type II certified</div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <FileText className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">GDPR</div>
                  <div className="text-sm text-muted-foreground">Compliant</div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Users className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">SCIM 2.0</div>
                  <div className="text-sm text-muted-foreground">Full support</div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Activity className="h-8 w-8 text-foreground mb-3" />
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
                Common questions about Aether User Management.
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
                Explore our documentation, guides, and best practices for user management.
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
                Take Control of Your User Identity
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Start managing your users with enterprise-grade security, compliance, and automation
                capabilities.
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
