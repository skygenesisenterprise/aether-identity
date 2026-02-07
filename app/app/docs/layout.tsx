import type { Metadata } from "next";
import { Sidebar } from "./_components/Sidebar";
import { Header } from "./_components/Header";
import "./styles/globals.css"

export const metadata: Metadata = {
  title: "Aether Identity | Documentation",
  description: "Official Documentation for Aether Identity",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
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
  );
}
