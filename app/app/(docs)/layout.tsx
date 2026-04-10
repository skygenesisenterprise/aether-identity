import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DocsSidebar } from "@/components/docs/sidebar";
import { DocsHeader } from "@/components/docs/header";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <DocsSidebar />
        <SidebarInset>
          <DocsHeader />
          <main className="flex-1 overflow-auto">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
