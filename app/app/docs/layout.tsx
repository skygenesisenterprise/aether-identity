import type { Metadata } from "next";
import { Sidebar } from "./_components/Sidebar";
import { Header } from "./_components/Header";
import "./styles/global.css";

export const metadata: Metadata = {
  title: "Aether Identity | Documentation",
  description: "Official Documentation for Aether Identity",
};

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col">
      <div className="fixed top-0 left-0 right-0 z-30 h-16">
        <Header />
      </div>

      <div className="flex flex-1 mt-16">
        <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] z-20">
          <Sidebar />
        </div>

        <main className="flex-1 ml-[280px] overflow-y-auto p-8 bg-white dark:bg-slate-900">
          <div className="max-w-4xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
