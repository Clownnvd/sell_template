"use client";

import { useTranslations } from "next-intl";

/* ------------------------------------------------------------------ */
/*  Real company SVG logos                                             */
/* ------------------------------------------------------------------ */

function GitHubLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 98 96" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
      />
    </svg>
  );
}

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function VercelLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 76 65" fill="currentColor">
      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
    </svg>
  );
}

function StripeLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 60 25" fill="currentColor">
      <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a12.7 12.7 0 0 1-4.56.85c-4.05 0-6.83-2.51-6.83-7.34 0-4.08 2.36-7.6 6.35-7.6 3.88 0 5.85 3.09 5.85 7.01v2.16zm-8.06-2.68h4.38c0-1.58-.73-2.98-2.16-2.98-1.35 0-2.12 1.34-2.22 2.98zM25.65 5.07l.03 3.61-2.53-.38c-2.38 0-3.42 1.8-3.42 4.46v6.95h-4.17V5.48h3.95l.22 2.42c.72-1.6 2.14-2.83 4.22-2.83h1.7zM13.43 5.48h4.17v14.23h-4.17V5.48zm0-5.1h4.17v3.56h-4.17V.38zm-4.6 19.33L.65.38h4.56l4.68 11.63L14.35.38h4.38L8.98 23.55H4.77l4.06-3.84zM41.67 19.71h-4.17V0h4.17v19.71zM50.14 5.07c-3.24 0-5.67 2.91-5.67 7.52 0 5.06 2.43 7.47 5.67 7.47 1.85 0 3.2-.78 4.07-1.69l.23 1.34h3.9V.01h-4.13v6.79c-.85-.97-2.2-1.73-4.07-1.73zm.92 11.59c-1.72 0-2.82-1.38-2.82-4.07 0-2.89 1.22-4.28 2.82-4.28 1.35 0 2.32.74 2.93 1.72v5.05c-.61.98-1.58 1.58-2.93 1.58z" />
    </svg>
  );
}

function SlackLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#E01E5A" />
      <path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="#36C5F0" />
      <path d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.27 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.163 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" fill="#2EB67D" />
      <path d="M15.163 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.163 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.27a2.527 2.527 0 0 1-2.52-2.523 2.527 2.527 0 0 1 2.52-2.52h6.315A2.528 2.528 0 0 1 24 15.163a2.528 2.528 0 0 1-2.522 2.523h-6.315z" fill="#ECB22E" />
    </svg>
  );
}

function NotionLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="currentColor">
      <path d="M6.017 4.313l55.333-4.087c6.797-.583 8.543-.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277-1.553 6.807-6.99 7.193L24.467 99.967c-4.08.193-6.023-.39-8.16-3.113L3.3 79.94c-2.333-3.113-3.3-5.443-3.3-8.167V11.113c0-3.497 1.553-6.413 6.017-6.8z" />
      <path
        d="M61.35.227l-55.333 4.087C1.553 4.7 0 7.617 0 11.113v60.66c0 2.723.967 5.053 3.3 8.167l12.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113l64.257-3.89c5.433-.387 6.99-2.917 6.99-7.193V20.64c0-2.21-.81-2.803-3.16-4.53m0 0L74.167 3.143C69.893.033 68.147-.36 61.35.227M22.5 87.213V23.053l58.5-3.5v64l-58.5 3.66z"
        fill="white"
      />
      <path
        d="M35 38.257l29.5-1.75v3.5L39 41.757v16l25.5-1.5v3.5l-25.5 1.5v18.5l-4 .243V38.257z"
        fill="white"
      />
    </svg>
  );
}

function FigmaLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 38 57" fill="none">
      <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
      <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
      <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
      <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
      <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
    </svg>
  );
}

function SupabaseLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 109 113" fill="none">
      <path
        d="M63.708 110.284c-2.86 3.601-8.658 1.628-8.727-2.97l-1.007-67.251h45.22c8.19 0 12.758 9.46 7.665 15.874L63.708 110.284z"
        fill="url(#supabase-a)"
      />
      <path
        d="M63.708 110.284c-2.86 3.601-8.658 1.628-8.727-2.97l-1.007-67.251h45.22c8.19 0 12.758 9.46 7.665 15.874L63.708 110.284z"
        fill="url(#supabase-b)"
        fillOpacity=".2"
      />
      <path
        d="M45.317 2.071c2.86-3.601 8.657-1.628 8.726 2.97l.442 67.251H9.83c-8.19 0-12.759-9.46-7.665-15.875L45.317 2.072z"
        fill="#3ECF8E"
      />
      <defs>
        <linearGradient id="supabase-a" x1="53.974" y1="54.974" x2="94.163" y2="71.829" gradientUnits="userSpaceOnUse">
          <stop stopColor="#249361" />
          <stop offset="1" stopColor="#3ECF8E" />
        </linearGradient>
        <linearGradient id="supabase-b" x1="36.156" y1="30.578" x2="54.484" y2="65.081" gradientUnits="userSpaceOnUse">
          <stop />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function TailwindLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 54 33" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.514-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.514-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"
        fill="#06B6D4"
      />
    </svg>
  );
}

function NextjsLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 180 180" fill="none">
      <mask id="nextjs-mask" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
        <circle cx="90" cy="90" r="90" fill="black" />
      </mask>
      <g mask="url(#nextjs-mask)">
        <circle cx="90" cy="90" r="90" fill="black" />
        <path d="M149.508 157.52L69.142 54H54v71.97h12.114V69.384l73.885 95.461a90.304 90.304 0 0 0 9.509-7.325z" fill="url(#nextjs-g1)" />
        <rect x="115" y="54" width="12" height="72" fill="url(#nextjs-g2)" />
      </g>
      <defs>
        <linearGradient id="nextjs-g1" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="nextjs-g2" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function AwsLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 304 182" fill="currentColor">
      <path d="M86.4 66.4c0 3.7.4 6.7 1.1 8.9.8 2.2 1.8 4.6 3.2 7.2.5.8.7 1.6.7 2.3 0 1-.6 2-1.9 3l-6.3 4.2c-.9.6-1.8.9-2.6.9-1 0-2-.5-3-1.4-1.4-1.5-2.6-3.1-3.6-4.7-1-1.7-2-3.6-3.1-5.9-7.8 9.2-17.6 13.8-29.4 13.8-8.4 0-15.1-2.4-20-7.2-4.9-4.8-7.4-11.2-7.4-19.2 0-8.5 3-15.4 9.1-20.6 6.1-5.2 14.2-7.8 24.5-7.8 3.4 0 6.9.3 10.6.8 3.7.5 7.5 1.3 11.5 2.2v-7.3c0-7.6-1.6-12.9-4.7-16-3.2-3.1-8.6-4.6-16.3-4.6-3.5 0-7.1.4-10.8 1.3-3.7.9-7.3 2-10.8 3.4-1.6.7-2.8 1.1-3.5 1.3-.7.2-1.2.3-1.6.3-1.4 0-2.1-1-2.1-3.1v-4.9c0-1.6.2-2.8.7-3.5.5-.7 1.4-1.4 2.8-2.1 3.5-1.8 7.7-3.3 12.6-4.5C41 1.9 46.2 1.3 51.7 1.3c12.2 0 21.1 2.8 26.8 8.3 5.6 5.6 8.5 14 8.5 25.3v33.5H86.4z" />
    </svg>
  );
}

function MicrosoftLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 23 23">
      <path fill="#f35325" d="M1 1h10v10H1z" />
      <path fill="#81bc06" d="M12 1h10v10H12z" />
      <path fill="#05a6f0" d="M1 12h10v10H1z" />
      <path fill="#ffba08" d="M12 12h10v10H12z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Logo items with name + icon                                        */
/* ------------------------------------------------------------------ */

interface LogoItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

const LOGOS: LogoItem[] = [
  { name: "GitHub", icon: GitHubLogo },
  { name: "Google", icon: GoogleLogo },
  { name: "Vercel", icon: VercelLogo },
  { name: "Stripe", icon: StripeLogo },
  { name: "Slack", icon: SlackLogo },
  { name: "Notion", icon: NotionLogo },
  { name: "Figma", icon: FigmaLogo },
  { name: "Supabase", icon: SupabaseLogo },
  { name: "Tailwind", icon: TailwindLogo },
  { name: "Next.js", icon: NextjsLogo },
  { name: "AWS", icon: AwsLogo },
  { name: "Microsoft", icon: MicrosoftLogo },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function LogosSection() {
  const t = useTranslations("landing.logos");

  const doubled = [...LOGOS, ...LOGOS];

  return (
    <section className="border-y border-border/30 bg-muted/10">
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <p className="text-center text-sm font-medium text-muted-foreground">
          {t("title")}
        </p>

        <div className="relative mt-8 overflow-hidden">
          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-linear-to-r from-background to-transparent sm:w-32" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-linear-to-l from-background to-transparent sm:w-32" />

          {/* Marquee track */}
          <div className="animate-marquee flex w-max gap-8 motion-reduce:animate-none motion-reduce:paused">
            {doubled.map((logo, i) => (
              <div
                key={`${logo.name}-${i}`}
                className="flex h-14 shrink-0 items-center gap-3 rounded-xl border border-border/40 bg-card px-6 transition-all duration-300 hover:border-red-500/40 hover:shadow-lg hover:shadow-red-500/5 hover:-translate-y-0.5"
              >
                <logo.icon className="h-6 w-6 shrink-0" />
                <span className="text-sm font-semibold text-foreground/80 whitespace-nowrap">
                  {logo.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
