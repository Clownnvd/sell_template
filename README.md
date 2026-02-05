<div align="center">

# 👑 King Template

### Production-Ready SaaS Starter Kit

**Ship your SaaS in days, not months.**

Built with Next.js 16 · React 19 · Stripe · Better Auth · Prisma · Tailwind CSS 4

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?logo=stripe)](https://stripe.com)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)](https://prisma.io)

</div>

---

## ⚡ What is King Template?

King Template is a **premium SaaS starter kit** that gives you everything you need to launch your next product. Stop wasting weeks on boilerplate — get authentication, payments, dashboards, and a stunning landing page out of the box.

Featuring a **Ferrari-inspired luxury design** (red/black/gold palette) that makes your product stand out from day one.

---

## 🎯 Features

### 🔐 Authentication & Security

- **Better Auth** with Email/Password, GitHub & Google OAuth
- Email verification & password reset flows
- Session management with cookie-based detection
- CSRF protection with origin/referer validation
- Rate limiting on all endpoints (Upstash Redis)
- Security headers (CSP, X-Frame-Options, XSS Protection)
- Two-layer auth: Edge middleware + API-level verification

### 💳 Payments & Subscriptions

- **Stripe** checkout sessions & customer portal
- 3-tier pricing: Free ($0), Basic ($29/mo), Pro ($99/mo)
- Monthly/yearly billing toggle with yearly savings
- Webhook handling with signature verification & idempotency
- Subscription lifecycle management (upgrade, downgrade, cancel)
- Automatic plan sync via Stripe webhooks

### 🎨 Landing Page & Design

- Ferrari-themed luxury design (red/black/gold palette)
- 9+ landing sections: Hero, Video, Features, Logos, How It Works, Testimonials, Pricing, FAQ, CTA
- Horizontal logo marquee with 12 real company SVGs (GitHub, Google, Vercel, Stripe, etc.)
- Interactive Purchase dropdown with plan comparison
- Fully responsive (mobile, tablet, desktop)
- Dark/light mode with smooth transitions

### 📊 Dashboard

- Sidebar navigation with collapsible layout
- Analytics, Projects, Team, and Settings pages
- Billing management with Stripe portal integration
- User profile with avatar support
- Plans overlay for quick upgrade prompts

### 🌍 Internationalization

- **next-intl** for multi-language support
- English & Vietnamese out of the box
- Language switcher component
- Easily extendable to more languages

### 🛡️ API & Backend

- Standardized API response helpers (`successResponse`, `errorResponse`, etc.)
- Zod schema validation on all inputs
- Type-safe environment variable validation at startup
- Error boundaries at app, dashboard, and global levels
- Prisma ORM with PostgreSQL (Neon serverless)
- Transactional emails via Resend + React Email templates

---

## 🛠️ Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| ⚛️ Framework | **Next.js** (App Router) | 16.1.3 |
| 🖼️ UI Library | **React** (Server Components) | 19.2.3 |
| 📝 Language | **TypeScript** | 5.x |
| 🎨 Styling | **Tailwind CSS** (OKLCH colors) | 4.x |
| 🧩 Components | **ShadCN UI** + Radix Primitives | — |
| 🔐 Auth | **Better Auth** (Email, OAuth) | 1.4.14 |
| 💳 Payments | **Stripe** (Checkout, Portal, Webhooks) | 20.2.0 |
| 🗄️ Database | **PostgreSQL** via Prisma ORM | Prisma 7.2.0 |
| ☁️ DB Hosting | **Neon** (Serverless PostgreSQL) | — |
| 📧 Email | **Resend** + React Email | 6.7.0 |
| 🌍 i18n | **next-intl** | 4.8.2 |
| ✅ Validation | **Zod** | 4.3.5 |
| 🚦 Rate Limiting | **Upstash Redis** + Ratelimit | 2.0.8 |
| 📦 State | **Zustand** | 5.0.10 |
| 📋 Forms | **React Hook Form** + Resolvers | 7.71.1 |
| 🎬 Animations | **tw-animate-css** | 1.4.0 |
| 🔤 Icons | **Lucide React** | 0.562.0 |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.17
- **pnpm** (recommended package manager)
- **PostgreSQL** database ([Neon](https://neon.tech) recommended)
- **Stripe** account ([stripe.com](https://stripe.com))

### 1️⃣ Clone & Install

```bash
git clone https://github.com/Clownnvd/king-template.git
cd king-template
pnpm install
```

### 2️⃣ Environment Setup

Create `.env.local` in the project root:

```env
# 🗄️ Database (Neon)
DATABASE_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/db?sslmode=require"

# 🔐 Auth (BetterAuth)
BETTER_AUTH_SECRET="<generate-with-openssl-rand-base64-32>"
BETTER_AUTH_URL="http://localhost:3000"

# 📧 Email (Resend)
RESEND_API_KEY="re_xxxxxxxxxxxx"
EMAIL_FROM="noreply@yourdomain.com"

# 💳 Payment (Stripe)
STRIPE_SECRET_KEY="sk_test_xxxxxxxxxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxxxxxxxxxxx"
NEXT_PUBLIC_STRIPE_PRICE_BASIC_MONTHLY="price_..."
NEXT_PUBLIC_STRIPE_PRICE_BASIC_YEARLY="price_..."
NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY="price_..."
NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY="price_..."

# 🔑 OAuth (optional)
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# 🌐 App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="King Template"
```

Generate your auth secret:
```bash
openssl rand -base64 32
```

### 3️⃣ Database Setup

```bash
pnpm prisma generate
pnpm prisma db push
```

### 4️⃣ Verify Setup

```bash
pnpm verify
```

### 5️⃣ Start Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

---

## 📁 Project Structure

```
king-template/
├── prisma/
│   └── schema.prisma            # Database schema (User, Session, Subscription)
├── src/
│   ├── app/
│   │   ├── (auth)/              # 🔐 Auth pages (sign-in, sign-up, verify-email)
│   │   ├── (landing)/           # 🏠 Landing page & pricing
│   │   ├── api/
│   │   │   ├── stripe/          # 💳 Stripe checkout & portal endpoints
│   │   │   ├── user/            # 👤 User profile & subscription endpoints
│   │   │   └── webhooks/        # 🔔 Stripe webhook handler
│   │   └── dashboard/           # 📊 Dashboard (billing, settings, projects, team, analytics)
│   ├── components/
│   │   ├── auth/                # Auth forms, OAuth buttons
│   │   ├── dashboard/           # Sidebar, header, user menu, plans overlay
│   │   ├── landing/             # Landing sections (hero, features, video, pricing, etc.)
│   │   │   └── header/          # Landing header with Purchase dropdown
│   │   └── ui/                  # Shared UI (button, card, input, theme toggle)
│   ├── config/                  # 📋 Plans & pricing configuration
│   ├── hooks/                   # 🪝 Custom hooks (useAuth, useSubscription, usePassword, useLocale)
│   ├── i18n/                    # 🌍 Internationalization config
│   ├── lib/
│   │   ├── api/                 # API response helpers
│   │   ├── auth/                # Better Auth configuration
│   │   ├── email/               # Email service (Resend + React Email)
│   │   ├── payment/             # Stripe service & client
│   │   └── validations/         # Zod schemas
│   ├── messages/                # 🗂️ Translation files (en.json, vi.json)
│   └── middleware.ts            # 🛡️ Security middleware (CSP, rate limiting, CSRF)
├── .env.local                   # Environment variables (not committed)
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── tsconfig.json                # TypeScript configuration
```

---

## 💰 Pricing Plans

| | 🆓 Free | ⚡ Basic | 🚀 Pro |
|---|---|---|---|
| **Monthly** | $0 | $29/mo | $99/mo |
| **Yearly** | $0 | $290/yr | $990/yr |
| **Projects** | 1 | 5 | Unlimited |
| **Team Members** | 3 | 10 | 50 |
| **Storage** | 1 GB | 10 GB | 100 GB |
| **Priority Support** | — | ✅ | ✅ |
| **Advanced Analytics** | — | — | ✅ |
| **Custom Integrations** | — | — | ✅ |

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | 🔧 Start development server |
| `pnpm build` | 📦 Build for production |
| `pnpm start` | 🚀 Start production server |
| `pnpm lint` | 🔍 Run ESLint |
| `pnpm typecheck` | ✅ Run TypeScript type checking |
| `pnpm format` | 🎨 Format code with Prettier |
| `pnpm verify` | 🩺 Verify project setup |

### Prisma Commands

| Command | Description |
|---------|-------------|
| `pnpm prisma studio` | 🗄️ Open Prisma Studio GUI |
| `pnpm prisma generate` | ⚙️ Generate Prisma Client |
| `pnpm prisma db push` | 📤 Push schema to database |
| `pnpm prisma migrate dev` | 🔄 Create & apply migration |

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local`
4. Deploy — Vercel handles the rest!

### Stripe Webhook Setup

For production, set up a Stripe webhook endpoint:
```
https://yourdomain.com/api/webhooks/stripe
```

Events to listen for:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org) — The React framework for the web
- [Better Auth](https://www.better-auth.com) — Simple, secure authentication
- [Stripe](https://stripe.com) — Payment processing platform
- [Prisma](https://prisma.io) — Next-generation Node.js ORM
- [Neon](https://neon.tech) — Serverless PostgreSQL
- [ShadCN UI](https://ui.shadcn.com) — Beautiful, accessible components
- [Tailwind CSS](https://tailwindcss.com) — Utility-first CSS framework
- [Resend](https://resend.com) — Email API for developers
- [next-intl](https://next-intl-docs.vercel.app) — Internationalization for Next.js
- [Lucide](https://lucide.dev) — Beautiful & consistent icons
- [Upstash](https://upstash.com) — Serverless Redis for rate limiting

---

## 📄 License

MIT License — feel free to use this template for your own projects.

---

<div align="center">

**👑 Built with King Template**

Next.js 16 · React 19 · Stripe · Tailwind CSS 4

[⬆ Back to top](#-king-template)

</div>
