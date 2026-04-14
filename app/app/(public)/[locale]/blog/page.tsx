import { Suspense } from "react";
import Link from "next/link";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { BlogCard } from "@/components/blog/BlogCard";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { getBlogPosts, getFeaturedPosts, getPostsByCategory } from "@/lib/blog/data";
import { BLOG_CATEGORIES } from "@/lib/blog/types";
import { ArrowRight, Rss } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const { locale } = await params;
  const { category } = await searchParams;

  const allPosts = category ? getPostsByCategory(category) : getBlogPosts();
  const featuredPosts = getFeaturedPosts();

  const showFeatured = !category && featuredPosts.length > 0;
  const displayPosts = showFeatured ? allPosts.filter((p) => !p.featured) : allPosts;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header locale={locale as import("@/lib/locale").Locale} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground">
                  Blog
                </h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
                  Insights on identity management, security best practices, engineering deep-dives,
                  and product updates from the Aether Identity team.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <Link href={`/${locale}/blog/rss.xml`}>
                    <Rss className="h-4 w-4" />
                    RSS Feed
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <Suspense fallback={<div className="h-10" />}>
              <CategoryFilter locale={locale} currentCategory={category} />
            </Suspense>
          </div>
        </section>

        {/* Featured Posts */}
        {showFeatured && (
          <section className="border-b border-border">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Featured
                </h2>
              </div>
              <div className="grid gap-6">
                {featuredPosts.slice(0, 2).map((post) => (
                  <BlogCard key={post.slug} post={post} locale={locale} variant="featured" />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Posts Grid */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {category ? `${category} Articles` : "Latest Articles"}
              </h2>
              <span className="text-sm text-muted-foreground">
                {displayPosts.length} {displayPosts.length === 1 ? "article" : "articles"}
              </span>
            </div>

            {displayPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} locale={locale} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground mb-4">No articles found in this category.</p>
                <Button variant="outline" asChild>
                  <Link href={`/${locale}/blog`}>View all articles</Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="border-t border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4">
                Stay Updated
              </h2>
              <p className="text-muted-foreground mb-8">
                Get the latest articles on identity security, engineering insights, and product
                updates delivered to your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
                <Button type="submit" className="gap-2">
                  Subscribe
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-4">
                No spam. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale as "fr" | "be_fr" | "be_nl" | "ch_fr"} />
    </div>
  );
}
