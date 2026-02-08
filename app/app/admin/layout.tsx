import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import "./styles/globals.css";

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
    <div className="flex h-screen">
      {/* Sidebar - Full height on the left */}
      <div className="fixed left-0 top-0 h-screen z-20 w-64">
        <Sidebar />
      </div>

      {/* Right Side Content Area */}
      <div className="flex flex-col flex-1 ml-64">
        {/* Header - Above page content */}
        <div className="h-16 z-30">
          <Header />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
