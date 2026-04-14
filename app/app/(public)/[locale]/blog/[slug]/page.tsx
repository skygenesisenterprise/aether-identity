import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { BlogCard } from "@/components/blog/BlogCard";
import { getBlogPost, getRelatedPosts, getBlogPosts } from "@/lib/blog/data";
import { ArrowLeft, Clock, Calendar, Tag, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const posts = getBlogPosts();
  const locales = ["fr", "be_fr", "be_nl", "ch_fr"];

  return locales.flatMap((locale) =>
    posts.map((post) => ({
      locale,
      slug: post.slug,
    }))
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug, 3);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(post.publishedAt));

  // Simple markdown-like rendering for code blocks and headings
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    const elements: JSX.Element[] = [];
    let inCodeBlock = false;
    let codeContent: string[] = [];
    let codeLanguage = "";

    lines.forEach((line, index) => {
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          elements.push(
            <div key={`code-${index}`} className="my-6 rounded-lg overflow-hidden border border-border">
              <div className="bg-muted/50 px-4 py-2 text-xs text-muted-foreground font-mono border-b border-border">
                {codeLanguage || "code"}
              </div>
              <pre className="p-4 overflow-x-auto bg-muted/30">
                <code className="text-sm font-mono text-foreground">{codeContent.join("\n")}</code>
              </pre>
            </div>
          );
          codeContent = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
          codeLanguage = line.replace("```", "").trim();
        }
        return;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return;
      }

      if (line.startsWith("## ")) {
        elements.push(
          <h2 key={index} className="text-2xl font-semibold text-foreground mt-12 mb-4">
            {line.replace("## ", "")}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3 key={index} className="text-xl font-semibold text-foreground mt-8 mb-3">
            {line.replace("### ", "")}
          </h3>
        );
      } else if (line.startsWith("- ")) {
        elements.push(
          <li key={index} className="text-muted-foreground leading-relaxed ml-4">
            {line.replace("- ", "")}
          </li>
        );
      } else if (line.startsWith("| ")) {
        // Simple table row handling
        const cells = line.split("|").filter((c) => c.trim());
        elements.push(
          <div key={index} className="flex border-b border-border">
            {cells.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className="flex-1 px-4 py-2 text-sm text-muted-foreground font-mono"
              >
                {cell.trim()}
              </div>
            ))}
          </div>
        );
      } else if (line.trim() === "") {
        elements.push(<div key={index} className="h-4" />);
      } else {
        // Handle inline code
        const parts = line.split(/(`[^`]+`)/);
        const formattedParts = parts.map((part, partIndex) => {
          if (part.startsWith("`") && part.endsWith("`")) {
            return (
              <code
                key={partIndex}
                className="px-1.5 py-0.5 bg-muted rounded text-sm font-mono text-foreground"
              >
                {part.slice(1, -1)}
              </code>
            );
          }
          // Handle bold
          const boldParts = part.split(/(\*\*[^*]+\*\*)/);
          return boldParts.map((bp, bpIndex) => {
            if (bp.startsWith("**") && bp.endsWith("**")) {
              return (
                <strong key={`${partIndex}-${bpIndex}`} className="font-semibold text-foreground">
                  {bp.slice(2, -2)}
                </strong>
              );
            }
            return bp;
          });
        });

        elements.push(
          <p key={index} className="text-muted-foreground leading-relaxed">
            {formattedParts}
          </p>
        );
      }
    });

    return elements;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
     <Header locale={locale as import("@/lib/locale").Locale} />

      <main className="flex-1">
        {/* Back Navigation */}
        <div className="border-b border-border">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </div>
        </div>

        {/* Article Header */}
        <article>
          <header className="border-b border-border">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
              <div className="flex items-center gap-3 mb-6">
                <Link
                  href={`/${locale}/blog?category=${post.category}`}
                  className="text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                >
                  {post.category}
                </Link>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {formattedDate}
                </div>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readingTime} min read
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground text-balance">
                {post.title}
              </h1>

              <p className="mt-6 text-xl text-muted-foreground leading-relaxed">{post.excerpt}</p>

              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-lg font-medium text-foreground">
                      {post.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{post.author.name}</p>
                    <p className="text-sm text-muted-foreground">{post.author.role}</p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-xs text-muted-foreground mr-2">Share</span>
                  <button
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    aria-label="Share on Twitter"
                  >
                    <Twitter className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    aria-label="Copy link"
                  >
                    <Link2 className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="prose-custom">{renderContent(post.content)}</div>

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/${locale}/blog?tag=${tag}`}
                    className="px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full hover:bg-muted/80 hover:text-foreground transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-border bg-muted/30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-8">
                Related Articles
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard key={relatedPost.slug} post={relatedPost} locale={locale} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Ready to take control of your identity infrastructure?
            </h2>
            <p className="text-muted-foreground mb-8">
              Deploy Aether Identity today and eliminate dependency on third-party providers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link href={`/${locale}/docs`}>Get Started</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/${locale}/contact`}>Contact Sales</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale as "fr" | "be_fr" | "be_nl" | "ch_fr"} />
    </div>
  );
}
