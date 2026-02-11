import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
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
  const [session, locale, messages] = await Promise.all([
    getServerSession(),
    getLocale(),
    getMessages(),
  ]);

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <div className="min-h-screen bg-background">
        <SidebarProvider>
          <DashboardSidebar user={session.user} />
          <DashboardMainContent>{children}</DashboardMainContent>
        </SidebarProvider>
      </div>
    </NextIntlClientProvider>
  );
}
