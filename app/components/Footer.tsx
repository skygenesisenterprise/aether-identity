import * as React from "react";
import { cn } from "@/lib/utils";

interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "absolute";
}

export function Footer({
  className,
  variant = "default",
  ...props
}: FooterProps) {
  const baseStyles = "bg-muted/30 text-sm text-muted-foreground";

  const variants = {
    default: "py-6",
    absolute: "absolute bottom-0 left-0 right-0 py-3",
  };

  return (
    <footer className={cn(baseStyles, variants[variant], className)} {...props}>
      <div
        className={cn(
          "container mx-auto flex items-center justify-between gap-4 px-4 md:px-6 lg:px-8",
          variant === "absolute" && "flex-wrap text-xs text-[#605e5c]",
        )}
      >
        <p className={cn(variant === "absolute" && "text-xs", "order-1")}>
          © {new Date().getFullYear()} Sky Genesis Enterprise. Tous droits réservés.
        </p>
        <nav
          className={cn(
            "flex gap-4",
            variant === "absolute" && "gap-x-6 gap-y-1 order-2 mx-auto",
          )}
        >
          {variant === "absolute" && (
            <button className="hover:underline focus:underline">...</button>
          )}
          {variant === "absolute" && (
            <a
              href="/terms"
              className={cn(
                "hover:text-foreground transition-colors",
                variant === "absolute" && "hover:underline",
              )}
            >
              Conditions d&apos;utilisation
            </a>
          )}
          <a
            href="/privacy"
            className={cn(
              "hover:text-foreground transition-colors",
              variant === "absolute" && "hover:underline",
            )}
          >
            Confidentialité et cookies
          </a>
          {variant !== "absolute" && <span className="text-border">|</span>}
          <a
            href="/accessibility"
            className={cn(
              "hover:text-foreground transition-colors",
              variant === "absolute" && "hover:underline",
            )}
          >
            Accessibilité : partiellement conforme
          </a>
        </nav>
        <p className={cn(variant === "absolute" && "text-xs", "order-3")}>
          Powered by Aether Identity
        </p>
      </div>
    </footer>
  );
}
