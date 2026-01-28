export const mainNav = [
  {
    title: "Features",
    href: "/#features",
  },
  {
    title: "Pricing",
    href: "/#pricing",
  },
  {
    title: "Docs",
    href: "/docs",
  },
] as const;

export const dashboardNav = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: "settings",
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: "billing",
  },
  {
    title: "Team",
    href: "/dashboard/team",
    icon: "users",
  },
] as const;

export const userNav = [
  {
    title: "Profile",
    href: "/dashboard/profile",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
  },
] as const;

export type MainNav = typeof mainNav;
export type DashboardNav = typeof dashboardNav;
export type UserNav = typeof userNav;
