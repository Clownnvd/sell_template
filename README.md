# King Template - Production-Ready SaaS Starter Kit

Get complete access to King Template, a production-ready SaaS starter kit that gives you everything you need to launch your next project — authentication, payments, dashboard, and a stunning Ferrari-themed landing page included.

This application delivers a seamless SaaS experience featuring:

## Product Management

- Subscription-based pricing with Free, Basic ($29/mo), and Pro ($99/mo) plans
- Stripe integration for secure payment processing and customer portal
- Webhook-driven payment event handling with signature verification and idempotency
- Billing cycle toggle (monthly/yearly) with yearly savings

## User Experience

- Ferrari-inspired luxury design theme (red/black/gold palette)
- Beautiful landing page with hero, video demo, features, testimonials, pricing, FAQ sections
- Horizontal logo marquee featuring real company brand SVGs (GitHub, Google, Vercel, Stripe, etc.)
- Interactive Purchase dropdown with plan comparison in the header
- Responsive design for mobile and desktop
- Dark mode and light mode with smooth transitions
- Multi-language support (English & Vietnamese)
- Toast notifications for real-time status updates

## Technical Foundation

- Next.js 16 App Router architecture with Server Components
- Secure authentication with Better Auth (email/password, GitHub, Google OAuth)
- PostgreSQL database with Prisma ORM
- Stripe for subscription billing and payment processing
- Rate limiting and CSRF protection on all API endpoints
- Zod schema validation on all inputs
- Type-safe environment variable validation
- Error boundaries at app, dashboard, and global levels
- Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)

Perfect for SaaS founders, indie hackers, and development teams who want to skip the boilerplate and ship faster. King Template demonstrates how modern web technologies can create premium, production-grade applications while maintaining a focus on beautiful presentation and user experience.

---

## Features

### Core Technologies

- **Next.js 16** App Router for server-side rendering, routing, and API endpoints with Server Components
- **React 19** for building interactive user interfaces with reusable components
- **Better Auth** for secure authentication with Email/Password, GitHub, and Google Sign-in
- **ShadCN UI** for accessible, customizable React components
- **PostgreSQL** with Prisma ORM for type-safe database operations
- **Stripe** for subscription billing, checkout sessions, and customer portal
- **TypeScript** for static typing and enhanced development experience
- **Tailwind CSS 4** for utility-first, responsive styling with OKLCH color space
- **Zod** for schema validation and form handling
- **next-intl** for internationalization (EN/VI)
- **Resend** for transactional emails with React Email templates

### Application Features

- Subscription management with plan upgrades/downgrades
- Secure Stripe webhook processing with signature verification
- Beautiful Ferrari-themed landing page with 9+ sections
- Video demo section with YouTube embed
- Interactive pricing page with billing cycle toggle
- Dashboard with sidebar navigation, analytics, projects, team, and settings
- OAuth social login (GitHub, Google) + email/password
- Email verification and password reset flows
- Rate limiting with configurable presets (API, auth, webhook)
- CSRF protection with origin/referer validation
- Responsive design for mobile and desktop
- Dark/light mode toggle
- Language switcher (English/Vietnamese)
- Error boundaries and global error handling
- Environment variable validation at startup
- Production-ready deployment

---

## Getting Started

### Prerequisites

- Node.js >= 18.17
- pnpm (recommended)
- PostgreSQL database (Neon recommended)
- Stripe account

### 1. Clone and Install

```bash
git clone https://github.com/Clownnvd/king-template.git
cd king-template
pnpm install
```

### 2. Environment Setup

Create `.env.local`:

```env
# Database (Neon)
DATABASE_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/db?sslmode=require"

# Auth (BetterAuth)
BETTER_AUTH_SECRET="<generate-with-openssl-rand-base64-32>"
BETTER_AUTH_URL="http://localhost:3000"

# Email (Resend)
RESEND_API_KEY="re_xxxxxxxxxxxx"
EMAIL_FROM="noreply@yourdomain.com"

# Payment (Stripe)
STRIPE_SECRET_KEY="sk_test_xxxxxxxxxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxxxxxxxxxxx"
NEXT_PUBLIC_STRIPE_PRICE_BASIC_MONTHLY="price_..."
NEXT_PUBLIC_STRIPE_PRICE_BASIC_YEARLY="price_..."
NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY="price_..."
NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY="price_..."

# OAuth (optional)
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="King Template"
```

Generate auth secret:
```bash
openssl rand -base64 32
```

### 3. Database Setup

```bash
pnpm prisma generate
pnpm prisma db push
```

### 4. Verify Setup

```bash
pnpm verify
```

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
src/
  app/
    (auth)/              # Auth pages (sign-in, sign-up, verify-email)
    (landing)/           # Landing page and pricing
    api/
      stripe/            # Stripe checkout & portal
      user/              # User profile & subscription
      webhooks/          # Stripe webhook handler
    dashboard/           # Dashboard pages (billing, settings, projects, team, analytics)
  components/
    auth/                # Auth forms, OAuth buttons
    dashboard/           # Sidebar, header, user menu, plans overlay
    landing/             # Landing page sections (hero, features, video, pricing, etc.)
      header/            # Landing header with Purchase dropdown
    ui/                  # Shared UI (button, card, input, theme toggle, language switcher)
  config/                # Plans and pricing configuration
  hooks/                 # Custom hooks (useAuth, useSubscription, usePassword, useLocale)
  i18n/                  # Internationalization config
  lib/
    auth/                # Better Auth configuration
    payment/             # Stripe service and client
    api/                 # API response helpers
    db/                  # Prisma client
    email/               # Email service with React Email templates
    validations/         # Zod schemas
  messages/              # Translation files (en.json, vi.json)
  middleware.ts          # Security middleware (rate limiting, CSRF, headers)
```

---

## Pricing Plans

| Plan | Monthly | Yearly | Projects | Team Members | Storage |
|------|---------|--------|----------|--------------|---------|
| **Free** | $0 | $0 | 1 | 3 | 1 GB |
| **Basic** | $29 | $290 | 5 | 10 | 10 GB |
| **Pro** | $99 | $990 | Unlimited | 50 | 100 GB |

---

## Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm verify       # Verify project setup
```

### Prisma Commands

```bash
pnpm prisma studio              # Open Prisma Studio
pnpm prisma generate            # Generate Prisma Client
pnpm prisma db push             # Push schema to database
pnpm prisma migrate dev         # Create and apply migration
```

---

## Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

---

## Acknowledgements

- [Next.js](https://nextjs.org) for the framework
- [Better Auth](https://www.better-auth.com) for authentication
- [Stripe](https://stripe.com) for payment processing
- [Prisma](https://prisma.io) for database ORM
- [Neon](https://neon.tech) for serverless PostgreSQL
- [ShadCN UI](https://ui.shadcn.com) for UI components
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Resend](https://resend.com) for transactional emails
- [next-intl](https://next-intl-docs.vercel.app) for internationalization
- [Lucide](https://lucide.dev) for icons

---

## License

MIT

---

Built with love using Next.js 16, Tailwind CSS 4, and Stripe
