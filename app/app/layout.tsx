import type { Metadata } from "next";
import "@/styles/globals.css";
import { AuthProvider } from "@/context/JwtAuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";

export const metadata: Metadata = {
  title: "Aether Identity",
  description: "An Enterprise OAuth2/OIDC support, multi-factor authentication, and secure account management for applications and services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">
        <AuthProvider>
          <DashboardLayout>{children}</DashboardLayout>
          {/* <Toaster /> */}
        </AuthProvider>
      </body>
    </html>
  );
}
