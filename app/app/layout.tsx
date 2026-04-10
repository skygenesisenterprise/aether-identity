import type { Metadata } from "next";
import { Source_Serif_4, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/context/Providers";
import "@/styles/globals.css";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Sky Genesis Enterprise",
    default: "Aether Identity | Sky Genesis Enterprise",
  },
  description:
    "An Enterprise OAuth2/OIDC support, multi-factor authentication, and secure account management for applications and services.",
  icons: {
    icon: [
      {
        url: "/etheriatimes.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/etheriatimes.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/etheriatimes.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${sourceSerif.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
