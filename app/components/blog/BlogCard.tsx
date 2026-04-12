import Link from "next/link";
import { BlogPost } from "@/lib/blog/types";
import { ArrowRight, Clock } from "lucide-react";

interface BlogCardProps {
  post: BlogPost;
  locale: string;
  variant?: "default" | "featured" | "compact";
}

export function BlogCard({ post, locale, variant = "default" }: BlogCardProps) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(post.publishedAt));

  if (variant === "featured") {
    return (
      <article className="group relative">
        <Link href={`/${locale}/blog/${post.slug}`} className="block">
          <div className="flex flex-col lg:flex-row gap-8 p-8 rounded-2xl border border-border bg-card hover:border-foreground/20 transition-colors">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {post.category}
                </span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                <time className="text-xs text-muted-foreground">{formattedDate}</time>
              </div>
              <h2 className="text-2xl lg:text-3xl font-semibold text-foreground mb-4 text-balance group-hover:text-foreground/80 transition-colors">
                {post.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-sm font-medium text-foreground">
                      {post.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{post.author.name}</p>
                    <p className="text-xs text-muted-foreground">{post.author.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readingTime} min read
                </div>
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group">
        <Link href={`/${locale}/blog/${post.slug}`} className="block py-4 border-b border-border hover:border-foreground/20 transition-colors">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-medium text-muted-foreground">{post.category}</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                <time className="text-xs text-muted-foreground">{formattedDate}</time>
              </div>
              <h3 className="text-base font-medium text-foreground group-hover:text-foreground/80 transition-colors line-clamp-2">
                {post.title}
              </h3>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group">
      <Link href={`/${locale}/blog/${post.slug}`} className="block">
        <div className="p-6 rounded-xl border border-border bg-card hover:border-foreground/20 transition-colors h-full flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {post.category}
            </span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
            <time className="text-xs text-muted-foreground">{formattedDate}</time>
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-3 text-balance group-hover:text-foreground/80 transition-colors line-clamp-2">
            {post.title}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3 flex-1">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xs font-medium text-foreground">
                  {post.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <span className="text-sm text-foreground">{post.author.name}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {post.readingTime} min
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
