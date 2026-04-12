import Link from "next/link";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  Shield,
  Settings,
  Key,
  Workflow,
  Link2,
  ArrowRight,
  CheckCircle2,
  LayoutGrid,
  UserCheck,
  FileText,
  BarChart3,
  Clock,
  Lock,
  Globe,
  ChevronDown,
  FolderKanban,
  Crown,
} from "lucide-react";

const features = [
  {
    icon: Building2,
    title: "Multi-Organization Management",
    description:
      "Create and manage multiple organizations from a single dashboard. Perfect for enterprises with subsidiaries, franchises, or multiple business units.",
  },
  {
    icon: Users,
    title: "Team Hierarchy",
    description:
      "Define hierarchical team structures with nested departments, reporting lines, and cross-functional groups.",
  },
  {
    icon: UserCheck,
    title: "User Lifecycle Management",
    description:
      "Automate user onboarding and offboarding across all connected applications with customizable workflows.",
  },
  {
    icon: Key,
    title: "Role & Permission Management",
    description:
      "Define granular roles and permissions with inheritance, delegation, and custom attribute-based access controls.",
  },
  {
    icon: Shield,
    title: "Organization-Level Security",
    description:
      "Enforce security policies, MFA requirements, and access controls at the organization level.",
  },
  {
    icon: Settings,
    title: "Organization Settings",
    description:
      "Configure branding, session policies, token lifetimes, and authentication flows per organization.",
  },
];

const adminFeatures = [
  {
    icon: LayoutGrid,
    title: "Admin Dashboard",
    description:
      "Unified view of all organizations, users, and activity across your infrastructure.",
  },
  {
    icon: FileText,
    title: "Audit Logs",
    description:
      "Comprehensive logging of all administrative actions with search and export capabilities.",
  },
  {
    icon: BarChart3,
    title: "Usage Analytics",
    description:
      "Track authentication metrics, user activity, and resource usage per organization.",
  },
  {
    icon: Globe,
    title: "Federation",
    description: "Connect organizations across different identity providers and directories.",
  },
];

const metrics = [
  { value: "Unlimited", label: "Organizations" },
  { value: "Unlimited", label: "Users per org" },
  { value: "< 10ms", label: "Permission check" },
  { value: "99.99%", label: "SLA availability" },
];

const useCases = [
  {
    title: "Enterprise Fleet Management",
    description:
      "Manage authentication across hundreds of subsidiaries with centralized identity governance.",
    icon: Building2,
  },
  {
    title: "SaaS Multi-Tenancy",
    description:
      "Provide secure isolation between tenant organizations in your multi-tenant application.",
    icon: FolderKanban,
  },
  {
    title: "Government Agencies",
    description:
      "Meet strict compliance requirements with dedicated organization isolation and audit trails.",
    icon: Crown,
  },
  {
    title: "Partner Networks",
    description:
      "Enable secure partner access to specific resources with organization-scoped permissions.",
    icon: Link2,
  },
];

const comparison = [
  { feature: "Multi-organization support", aether: true, keycloak: true, auth0: false, okta: true },
  {
    feature: "Hierarchical team structure",
    aether: true,
    keycloak: true,
    auth0: false,
    okta: true,
  },
  { feature: "Organization-level MFA", aether: true, keycloak: true, auth0: true, okta: true },
  { feature: "Cross-org federation", aether: true, keycloak: true, auth0: false, okta: false },
  { feature: "Delegated admin roles", aether: true, keycloak: true, auth0: true, okta: true },
  { feature: "Org-scoped audit logs", aether: true, keycloak: false, auth0: true, okta: true },
  { feature: "Custom branding per org", aether: true, keycloak: true, auth0: true, okta: true },
  { feature: "SLA guarantee", aether: "99.99%", keycloak: "N/A", auth0: "99.9%", okta: "99.9%" },
];

const faqs = [
  {
    question: "How does multi-organization support work?",
    answer:
      "Aether allows you to create multiple organizations under a single deployment. Each organization has its own users, applications, and security policies while sharing the same infrastructure.",
  },
  {
    question: "Can we partition users between organizations?",
    answer:
      "Yes, users can belong to multiple organizations with different roles and permissions in each. This enables cross-organization collaboration while maintaining isolation.",
  },
  {
    question: "Is there a limit on the number of organizations?",
    answer:
      "No hard limits. Aether supports unlimited organizations with efficient resource usage. Performance scales horizontally as needed.",
  },
  {
    question: "Can we customize branding per organization?",
    answer:
      "Yes, each organization can have custom logos, colors, and login page themes. This is ideal for SaaS providers offering white-label solutions.",
  },
  {
    question: "How do cross-organization permissions work?",
    answer:
      "You can define permissions that apply across organizations or scoped to specific ones. This enables flexible collaboration while maintaining security boundaries.",
  },
];

export default async function OrganizationsPage({
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
                Enterprise Feature
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight text-balance">
                Organization Management at Scale
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Manage multiple organizations, teams, and hierarchies from a single control plane.
                Built for enterprises with subsidiaries, franchises, or complex organizational
                structures.
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

        {/* Core Features */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Comprehensive Organization Control
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Everything you need to manage complex organizational structures with security and
                compliance built in.
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

        {/* Comparison Table */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">How We Compare</h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Superior multi-organization support compared to legacy identity providers.
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
                      Keycloak
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">
                      Auth0
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">
                      Okta
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr key={row.feature} className="border-b border-border/50">
                      <td className="py-4 px-4 text-sm text-foreground">{row.feature}</td>
                      <td className="py-4 px-4 text-center">
                        {typeof row.aether === "boolean" ? (
                          row.aether ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                          )
                        ) : (
                          <span className="text-sm font-medium text-foreground">{row.aether}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {row.keycloak === true ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                        ) : row.keycloak === false ? (
                          <ChevronDown className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                        ) : (
                          <span className="text-sm text-muted-foreground">{row.keycloak}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {row.auth0 === true ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                        ) : row.auth0 === false ? (
                          <ChevronDown className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                        ) : (
                          <span className="text-sm text-muted-foreground">{row.auth0}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {row.okta === true ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                        ) : row.okta === false ? (
                          <ChevronDown className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                        ) : (
                          <span className="text-sm text-muted-foreground">{row.okta}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Admin Features */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Administration & Governance
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Powerful administrative tools to manage organizations at scale with full visibility
                and control.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {adminFeatures.map((feature) => (
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
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">Use Cases</h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Built for the most demanding enterprise scenarios.
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

        {/* Security Section */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                  Enterprise-Grade Security
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  Organization-level security policies ensure complete isolation and compliance with
                  industry regulations.
                </p>
                <div className="mt-8 space-y-4">
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-base font-semibold text-foreground">
                        Organization-Level MFA
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Enforce MFA requirements per organization
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-base font-semibold text-foreground">
                        Access Certification
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Periodic access reviews for compliance
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-base font-semibold text-foreground">Audit Trail</h4>
                      <p className="text-sm text-muted-foreground">
                        Complete logging with retention policies
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Workflow className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-base font-semibold text-foreground">
                        Approval Workflows
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Multi-level approval for sensitive actions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-lg bg-background border border-border">
                  <Users className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">Isolated</div>
                  <div className="text-sm text-muted-foreground">User directories</div>
                </div>
                <div className="p-6 rounded-lg bg-background border border-border">
                  <Key className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">Scoped</div>
                  <div className="text-sm text-muted-foreground">Token validation</div>
                </div>
                <div className="p-6 rounded-lg bg-background border border-border">
                  <Settings className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">Custom</div>
                  <div className="text-sm text-muted-foreground">Policies per org</div>
                </div>
                <div className="p-6 rounded-lg bg-background border border-border">
                  <Clock className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">Audited</div>
                  <div className="text-sm text-muted-foreground">Full traceability</div>
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
                Common questions about organization management in Aether Identity.
              </p>
            </div>
            <div className="max-w-2xl mx-auto space-y-4">
              {faqs.map((faq) => (
                <div key={faq.question} className="p-6 rounded-lg border border-border bg-card">
                  <h3 className="text-base font-semibold text-foreground mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
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
                Scale Your Organization Management
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Get started with multi-organization support today. Contact our team for a customized
                demonstration.
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
