import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/platform/sidebar";
import { AdminHeader } from "@/components/platform/header";
// import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <AdminHeader />
          <main className="flex-1 overflow-auto">{children}</main>
        </SidebarInset>
      </SidebarProvider>
  );
}
