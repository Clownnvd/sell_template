import { Marquee } from "@/components/ui/marquee";

function NextjsLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 180 180" fill="none" aria-hidden="true">
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

function StripeLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 60 25" fill="currentColor" aria-hidden="true">
      <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a12.7 12.7 0 0 1-4.56.85c-4.05 0-6.83-2.51-6.83-7.34 0-4.08 2.36-7.6 6.35-7.6 3.88 0 5.85 3.09 5.85 7.01v2.16zm-8.06-2.68h4.38c0-1.58-.73-2.98-2.16-2.98-1.35 0-2.12 1.34-2.22 2.98zM25.65 5.07l.03 3.61-2.53-.38c-2.38 0-3.42 1.8-3.42 4.46v6.95h-4.17V5.48h3.95l.22 2.42c.72-1.6 2.14-2.83 4.22-2.83h1.7zM13.43 5.48h4.17v14.23h-4.17V5.48zm0-5.1h4.17v3.56h-4.17V.38zm-4.6 19.33L.65.38h4.56l4.68 11.63L14.35.38h4.38L8.98 23.55H4.77l4.06-3.84zM41.67 19.71h-4.17V0h4.17v19.71zM50.14 5.07c-3.24 0-5.67 2.91-5.67 7.52 0 5.06 2.43 7.47 5.67 7.47 1.85 0 3.2-.78 4.07-1.69l.23 1.34h3.9V.01h-4.13v6.79c-.85-.97-2.2-1.73-4.07-1.73zm.92 11.59c-1.72 0-2.82-1.38-2.82-4.07 0-2.89 1.22-4.28 2.82-4.28 1.35 0 2.32.74 2.93 1.72v5.05c-.61.98-1.58 1.58-2.93 1.58z" />
    </svg>
  );
}

function TailwindLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 54 33" fill="none" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.514-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.514-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"
        fill="#06B6D4"
      />
    </svg>
  );
}

function PrismaLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 159 194" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.362 130.34L66.725 4.22c3.03-5.94 11.497-6.462 15.18-0.936l67.4 101.218c2.578 3.872 1.586 9.095-2.228 11.748l-70.434 49.013c-1.82 1.267-4.044 1.707-6.165 1.22L5.457 148.476c-5.3-1.218-7.217-7.64-3.095-12.136z"
      />
    </svg>
  );
}

function TypeScriptLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" aria-hidden="true">
      <rect width="400" height="400" rx="50" fill="#3178C6" />
      <path d="M87 200.664V222.84H138.32V367H166.72V222.84H218V200.664H87Z" fill="white" />
      <path d="M233.15 348.772C239.297 352.685 248.417 356.598 258.34 358.554C268.727 360.511 279.58 361.489 290.43 360.511C301.047 359.531 310.863 357.087 319.517 352.685C328.17 348.285 335.22 342.022 340.433 333.9C345.647 325.778 348.253 315.8 348.253 303.964C348.253 295.353 346.853 287.72 344.05 281.064C341.247 274.409 337.037 268.731 331.42 264.033C325.803 259.335 318.753 255.031 310.267 251.118C304.187 248.185 298.803 245.449 294.127 242.907C289.447 240.364 285.7 237.822 282.897 235.28C280.093 232.738 278.227 230.001 277.293 227.068C276.36 224.135 275.893 220.811 275.893 217.097C275.893 213.771 276.593 210.642 278 207.709C279.4 204.776 281.5 202.233 284.303 200.08C287.107 197.927 290.613 196.264 294.827 195.091C299.037 193.918 303.953 193.529 309.567 193.918C313.547 194.113 317.52 194.696 321.5 195.673C325.48 196.653 329.46 198.022 333.44 199.784C337.42 201.547 341.167 203.698 344.673 206.24C348.18 208.782 351.213 211.715 353.787 215.039V186.487C347.24 183.163 340.227 180.621 332.733 178.86C325.24 177.1 316.587 176.22 306.767 176.22C295.917 176.22 285.767 177.882 276.36 181.209C266.953 184.535 258.977 189.233 252.597 195.091C246.217 200.949 241.7 208.391 239.13 217.097C237.73 222.169 237.03 227.066 237.03 231.782C237.03 243.618 240.537 253.987 247.587 262.891C254.637 271.793 265.487 279.135 280.093 284.933C286.64 287.476 292.487 289.822 297.63 291.975C302.773 294.126 307.22 296.278 310.967 298.624C314.707 300.971 317.517 303.513 319.383 306.446C321.25 309.38 322.183 312.706 322.183 316.42C322.183 319.744 321.483 322.873 320.083 325.806C318.683 328.74 316.35 331.282 313.08 333.435C309.803 335.589 305.827 337.252 301.15 338.425C296.473 339.598 290.86 340.184 284.31 339.794C275.657 339.207 267.233 337.252 259.04 333.9C250.85 330.575 243.567 325.975 237.15 320.311V348.772H233.15Z" fill="white" />
    </svg>
  );
}

interface LogoItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

const LOGOS: LogoItem[] = [
  { name: "Next.js", icon: NextjsLogo },
  { name: "Stripe", icon: StripeLogo },
  { name: "Tailwind CSS", icon: TailwindLogo },
  { name: "Prisma", icon: PrismaLogo },
  { name: "TypeScript", icon: TypeScriptLogo },
];

export function LogosSection() {
  return (
    <section className="border-y border-border">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h2 className="text-center text-sm font-medium text-muted-foreground">
          Built with the best tools in the ecosystem
        </h2>

        <Marquee
          className="mt-8 [--duration:25s] [--gap:3rem]"
          pauseOnHover
        >
          {LOGOS.map((logo) => (
            <div
              key={logo.name}
              className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-primary"
            >
              <logo.icon className="size-6 shrink-0" />
              <span className="text-sm font-medium whitespace-nowrap">
                {logo.name}
              </span>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
