import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { SidebarProvider } from "@/components/dashboard/sidebar-provider";
import { DashboardMainContent } from "@/components/dashboard/main-content";
import { getServerSession } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <DashboardSidebar user={session.user} />
        <DashboardMainContent>{children}</DashboardMainContent>
      </SidebarProvider>
    </div>
  );
}
