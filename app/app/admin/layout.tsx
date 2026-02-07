import type { Metadata } from "next";
import "./styles/globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Aether Identity | Administrator",
  description: "Administration Console for Aether Identity",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">
        <div className="flex h-screen flex-col">
          {/* Header - Full width at top */}
          <div className="fixed top-0 left-0 right-0 z-30 h-16">
            <Header />
          </div>

          {/* Content Area */}
          <div className="flex flex-1 mt-16">
            {/* Sidebar - Starts below header */}
            <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] z-20">
              <Sidebar />
            </div>

            {/* Page Content */}
            <main className="flex-1 ml-64 overflow-y-auto bg-background p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
