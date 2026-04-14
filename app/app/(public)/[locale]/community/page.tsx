import Link from "next/link";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { GitHubIcon } from "@/components/ui/icons/GitHubIcon";
import { DiscordIcon } from "@/components/ui/icons/DiscordIcon";
import { TwitterIcon } from "@/components/ui/icons/TwitterIcon";
import { YoutubeIcon } from "@/components/ui/icons/YoutubeIcon";
import {
  Users,
  MessageCircle,
  Heart,
  GitPullRequest,
  Calendar,
  Award,
  MessageSquare,
  Coffee,
  Code2,
  Shield,
  Zap,
  Trophy,
  GraduationCap,
  BookOpen,
  Megaphone,
  Clock,
} from "lucide-react";

const communityStats = [
  { value: "12K+", label: "Community members" },
  { value: "2.5K+", label: "GitHub stars" },
  { value: "500+", label: "Contributors" },
  { value: "150+", label: "Enterprise deployments" },
];

const values = [
  {
    icon: Heart,
    title: "Open Source First",
    description:
      "Aether Identity is built transparently. Every feature is open for scrutiny, contribution, and customization by the community.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "Your feedback shapes our roadmap. Features requested by the community are prioritized and implemented collaboratively.",
  },
  {
    icon: Shield,
    title: "Security First",
    description:
      "We maintain rigorous security standards. Every contribution is reviewed, and we coordinate responsible disclosures.",
  },
  {
    icon: Coffee,
    title: "Friendly & Welcoming",
    description:
      "We believe in constructive collaboration. All community members are respected, regardless of skill level or background.",
  },
];

const getInvolved = [
  {
    icon: GitPullRequest,
    title: "Contribute Code",
    description:
      "Help build Aether by submitting pull requests, reporting issues, or improving documentation.",
    link: "https://github.com/skygenesisenterprise/aether-identity/contribute",
    linkText: "Start Contributing",
  },
  {
    icon: MessageSquare,
    title: "Join Discussions",
    description: "Participate in conversations, help answer questions, and share your use cases.",
    link: "https://github.com/skygenesisenterprise/aether-identity/discussions",
    linkText: "Browse Forums",
  },
  {
    icon: GraduationCap,
    title: "Share Knowledge",
    description:
      "Write tutorials, create videos, or speak at community events about how you use Aether.",
    link: "/community/share",
    linkText: "Share Your Story",
  },
  {
    icon: Heart,
    title: "Sponsor Development",
    description:
      "Support the project financially through GitHub Sponsors or enterprise sponsorship.",
    link: "https://github.com/skygenesisenterprise/aether-identity/sponsors",
    linkText: "Become a Sponsor",
  },
];

const upcomingEvents = [
  {
    title: "Aether Identity v3.0 Launch",
    date: "April 20, 2026",
    time: "2:00 PM UTC",
    type: "Webinar",
    description: "Join us for the announcement of our biggest release yet with live demo.",
  },
  {
    title: "Community Call: April",
    date: "April 15, 2026",
    time: "5:00 PM UTC",
    type: "Meeting",
    description: "Monthly community call to discuss updates, roadmap, and answer questions.",
  },
  {
    title: "Hackathon: Security Extensions",
    date: "May 1-7, 2026",
    time: "All week",
    type: "Event",
    description: "Week-long hackathon focused on building security extensions for Aether.",
  },
  {
    title: "Office Hours",
    date: "Every Friday",
    time: "3:00 PM UTC",
    type: "Drop-in",
    description: "Open office hours with the core team for questions and chat.",
  },
];

const contributors = [
  { name: "Alex Chen", role: "Core Team", image: "AC" },
  { name: "Sarah Miller", role: "Maintainer", image: "SM" },
  { name: "James Wilson", role: "Commiter", image: "JW" },
  { name: "Emily Davis", role: "Reviewer", image: "ED" },
  { name: "Michael Brown", role: "Contributor", image: "MB" },
  { name: "Lisa Zhang", role: "Contributor", image: "LZ" },
  { name: "David Kim", role: "Contributor", image: "DK" },
  { name: "Anna Kowalski", role: "Contributor", image: "AK" },
];

const testemonials = [
  {
    quote:
      "Aether Identity transformed how we handle authentication. The community support is incredible.",
    author: "TechCorp Engineering",
    role: "Enterprise User",
  },
  {
    quote:
      "We migrated from Auth0 in a weekend. The community-made migration tools saved us months of work.",
    author: "StartupXYZ",
    role: "SaaS Founder",
  },
  {
    quote: "The contributor experience is fantastic. Our first PR was merged within hours.",
    author: "DevTools Inc",
    role: "Open Source Maintainer",
  },
];

const socialChannels = [
  {
    icon: DiscordIcon,
    name: "Discord",
    description: "Real-time chat and support",
    members: "5,200+",
    link: "https://discord.gg/aether-identity",
  },
  {
    icon: GitHubIcon,
    name: "GitHub",
    description: "Code and issue tracking",
    stars: "2,500+",
    link: "https://github.com/skygenesisenterprise/aether-identity",
  },
  {
    icon: TwitterIcon,
    name: "Twitter",
    description: "Updates and announcements",
    followers: "8,500+",
    link: "https://twitter.com/aetheridentity",
  },
  {
    icon: YoutubeIcon,
    name: "YouTube",
    description: "Tutorials and demos",
    subscribers: "12K+",
    link: "https://youtube.com/@aetheridentity",
  },
];

const resources = [
  {
    icon: BookOpen,
    title: "Contributor Guide",
    description: "Everything you need to start contributing",
  },
  {
    icon: Code2,
    title: "Code of Conduct",
    description: "Community guidelines and expectations",
  },
  {
    icon: Trophy,
    title: "Hall of Fame",
    description: "Recognizing our top contributors",
  },
  {
    icon: Megaphone,
    title: "Announcements",
    description: "Latest news and release notes",
  },
];

export default async function CommunityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header locale={locale as import("@/lib/locale").Locale} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                Community Driven
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight text-balance">
                Join Thousands Building the Future of Identity
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Aether Identity is more than software. It&apos;s a thriving community of developers,
                security experts, and organizations working together to create better identity
                solutions.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                <Link href="https://discord.gg/aether-identity">
                  <Button size="lg" className="gap-2 h-12 px-6 text-base">
                    <MessageCircle className="h-4 w-4" />
                    Join Discord
                  </Button>
                </Link>
                <Link href="https://github.com/skygenesisenterprise/aether-identity">
                  <Button variant="outline" size="lg" className="gap-2 h-12 px-6 text-base">
                    <GitHubIcon className="h-4 w-4" />
                    Star on GitHub
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Community Stats */}
        <section className="py-16 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {communityStats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl sm:text-4xl font-semibold text-foreground">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Values */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Our Community Values
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                We&apos;re building more than code. We&apos;re creating a community built on trust,
                transparency, and shared success.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => (
                <div key={value.title} className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                      <value.icon className="h-5 w-5 text-foreground" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">{value.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-13">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Get Involved */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Ways to Get Involved
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Whether you&apos;re a developer, security expert, or just passionate about identity,
                there&apos;s a place for you in our community.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {getInvolved.map((item) => (
                <div
                  key={item.title}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <item.icon className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {item.description}
                  </p>
                  <Link href={item.link}>
                    <Button variant="outline" size="sm" className="gap-2">
                      {item.linkText}
                      <Zap className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Upcoming Events
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Connect with the community through webinars, meetups, and hackathons.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {upcomingEvents.map((event) => (
                <div
                  key={event.title}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{event.date}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      {event.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{event.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Clock className="h-3 w-3" />
                    {event.time}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Contributors */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Top Contributors
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Thank you to the amazing people who make Aether Identity possible.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {contributors.map((contributor) => (
                <div
                  key={contributor.name}
                  className="p-4 rounded-lg border border-border bg-card text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-semibold text-foreground">
                      {contributor.image}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground truncate">
                    {contributor.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{contributor.role}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="https://github.com/skygenesisenterprise/aether-identity/graphs/contributors">
                <Button variant="outline" size="sm" className="gap-2">
                  <Award className="h-4 w-4" />
                  View All Contributors
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Social Channels */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Join the Conversation
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Connect with the community on your preferred platform. Every channel is active and
                moderated.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {socialChannels.map((channel) => (
                <Link
                  key={channel.name}
                  href={channel.link}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <channel.icon className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{channel.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {channel.description}
                  </p>
                  <div className="text-sm font-medium text-foreground">
                    {channel.members || channel.stars || channel.followers || channel.subscribers}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                What Our Community Says
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Hear from organizations and developers who have joined our community.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testemonials.map((testimonial, index) => (
                <div key={index} className="p-6 rounded-lg border border-border bg-card">
                  <MessageSquare className="h-6 w-6 text-muted-foreground/50 mb-4" />
                  <p className="text-sm text-foreground leading-relaxed mb-4">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <div className="border-t border-border pt-4">
                    <p className="text-sm font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Community Resources
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Everything you need to get started and thrive in our community.
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
        <section className="py-20 lg:py-28 bg-foreground text-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-semibold text-balance">
                Ready to Join Our Community?
              </h2>
              <p className="mt-4 text-lg text-background/70 leading-relaxed">
                Thousands of developers are already building with Aether. Join us to shape the
                future of identity infrastructure.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="https://discord.gg/aether-identity">
                  <Button variant="secondary" size="lg" className="gap-2 h-12 px-8 text-base">
                    <MessageCircle className="h-4 w-4" />
                    Join Discord
                  </Button>
                </Link>
                <Link href="https://github.com/skygenesisenterprise/aether-identity">
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 h-12 px-8 text-base border-background/20 text-background hover:bg-background/10"
                  >
                    <GitHubIcon className="h-4 w-4" />
                    Star on GitHub
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
