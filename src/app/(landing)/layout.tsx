import { LandingHeader } from "@/components/landing/header/landing-header";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LandingHeader />
      {children}
    </>
  );
}
