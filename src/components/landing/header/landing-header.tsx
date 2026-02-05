import { auth } from "@/lib/auth";
import { LandingHeaderClient } from "./landing-header-client";

const navItems = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/#faq" },
];

export async function LandingHeader() {
  let isAuthed = false;

  try {
    const session = await auth.api.getSession();
    isAuthed = !!session?.user;
  } catch {
    isAuthed = false;
  }

  return <LandingHeaderClient navItems={navItems} isAuthed={isAuthed} />;
}
