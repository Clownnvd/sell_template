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

### 💳 Payments

- **Stripe** one-time checkout ($99) — no subscriptions
- **SePay** Vietnamese bank transfer via VietQR (optional)
- Webhook handling with signature verification & idempotency
- Duplicate purchase prevention (composite unique per user per product)
- GitHub collaborator invite after purchase (automatic repo access)

### 🎨 Landing Page & Design

- Ferrari-themed luxury design (red/black/gold palette)
- 12+ landing sections: Hero, Parallax, Video, Features, ROI, Logos, How It Works, Testimonials, Pricing, Product Preview, FAQ, CTA
- Horizontal logo marquee with real company SVGs
- Fully responsive (mobile, tablet, desktop)
- Dark/light mode with smooth transitions

### 📊 Dashboard

- Sidebar navigation with collapsible layout
- Purchase status & GitHub repo access form
- Settings pages (profile, account)
- Help page
- User profile with avatar support

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

## 🔌 API Endpoints

All API routes return a consistent envelope: `{ success, data?, error?, code?, errors? }`

| Method | Path | Auth | Rate Limit | Description |
|--------|------|------|------------|-------------|
| `POST` | `/api/stripe/checkout` | Yes | Strict (5/min) | Create Stripe checkout session |
| `POST` | `/api/checkout/sepay` | Yes | Strict (5/min) | Create SePay QR payment |
| `GET` | `/api/checkout/sepay?id=` | Yes | Relaxed (60/min) | Poll SePay payment status |
| `GET` | `/api/user/purchase` | Yes | Standard (20/min) | Get user's purchase status |
| `PATCH` | `/api/user/github-username` | Yes | Strict (5/min) | Update GitHub username + trigger invite |
| `GET` | `/api/user/profile` | Yes | Standard (20/min) | Get current user profile |
| `PATCH` | `/api/user/profile` | Yes | 10/min | Update user profile (name, avatar) |
| `POST` | `/api/send` | Yes | Strict (5/min) | Send welcome email |
| `POST` | `/api/webhooks/stripe` | Signature | Webhook (100/min) | Stripe webhook handler |
| `POST` | `/api/webhooks/sepay` | API Key | Webhook (100/min) | SePay webhook handler |
| `GET` | `/api/health` | No | — | Health check (DB connectivity) |
| `GET` | `/api/ready` | No | — | Readiness probe (DB + env vars) |

**Headers**: All responses include `X-Request-Id` for tracing. Authenticated responses include `Cache-Control: private, no-store`. Rate-limited responses include `Retry-After`, `X-RateLimit-*` headers.

### Example Request/Response

```bash
# Create checkout session
curl -X POST http://localhost:3000/api/stripe/checkout \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=..." \
  -H "Origin: http://localhost:3000" \
  -d '{}'

# Success (200)
{
  "success": true,
  "data": { "url": "https://checkout.stripe.com/c/pay/cs_test_..." }
}

# Error (409 — already purchased)
{
  "success": false,
  "error": "You have already purchased this product",
  "code": "CONFLICT"
}

# Validation Error (400)
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "errors": { "githubUsername": ["Must start with a letter or number"] }
}
```

### Error Code Catalog

| Code | HTTP | Cause | Resolution |
|------|------|-------|------------|
| `VALIDATION_ERROR` | 400 | Invalid request body or parameters | Check `errors` field for field-level details |
| `UNAUTHORIZED` | 401 | Missing or invalid session | Sign in and retry with valid session cookie |
| `FORBIDDEN` | 403 | CSRF check failed or insufficient permissions | Include `Origin` header matching app URL |
| `NOT_FOUND` | 404 | Resource does not exist | Verify the resource ID is correct |
| `CONFLICT` | 409 | Duplicate action (e.g., already purchased) | No action needed — operation already completed |
| `UNSUPPORTED_MEDIA_TYPE` | 415 | Wrong Content-Type header | Set `Content-Type: application/json` |
| `RATE_LIMITED` | 429 | Too many requests | Wait for `Retry-After` seconds |
| `SERVICE_UNAVAILABLE` | 503 | Payment provider not configured | Check environment variable configuration |
| `SERVER_ERROR` | 500 | Unexpected internal error | Retry; if persistent, check server logs |

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
| 💳 Payments | **Stripe** (One-time Checkout, Webhooks) + **SePay** | 20.2.0 |
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
# 🗄️ Database (Neon) — pooled for queries, direct for migrations
DATABASE_URL="postgresql://user:pass@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://user:pass@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# 🔐 Auth (BetterAuth)
BETTER_AUTH_SECRET="<generate-with-openssl-rand-base64-32>"

# 💳 Payment (Stripe)
STRIPE_SECRET_KEY="sk_test_xxxxxxxxxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxxxxxxxxxxx"

# 🔑 OAuth (optional)
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# 🌐 App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Generate your auth secret:
```bash
openssl rand -base64 32
```

### 3️⃣ Database Setup

```bash
npx prisma migrate dev
# Seed runs automatically via prisma.config.ts
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
│   └── schema.prisma            # Database schema (User, Session, Purchase)
├── src/
│   ├── app/
│   │   ├── (auth)/              # 🔐 Auth pages (sign-in, sign-up, verify-email)
│   │   ├── (landing)/           # 🏠 Landing page & pricing
│   │   ├── api/
│   │   │   ├── stripe/          # 💳 Stripe checkout endpoint
│   │   │   ├── checkout/        # 💳 SePay checkout endpoint
│   │   │   ├── user/            # 👤 User profile & purchase endpoints
│   │   │   └── webhooks/        # 🔔 Stripe + SePay webhook handlers
│   │   └── dashboard/           # 📊 Dashboard (purchase status, settings, help)
│   ├── components/
│   │   ├── auth/                # Auth forms, OAuth buttons
│   │   ├── dashboard/           # Sidebar, header, user menu
│   │   ├── landing/             # Landing sections (hero, features, pricing, ROI, etc.)
│   │   │   └── header/          # Landing header with CTA
│   │   └── ui/                  # Shared UI (button, card, input, theme toggle)
│   ├── config/                  # 📋 Product & pricing configuration
│   ├── hooks/                   # 🪝 Custom hooks (useAuth, usePurchase, usePassword, useLocale)
│   ├── i18n/                    # 🌍 Internationalization config
│   ├── lib/
│   │   ├── api/                 # API response helpers
│   │   ├── auth/                # Better Auth configuration
│   │   ├── email/               # Email service (Resend + React Email)
│   │   ├── payment/             # Stripe + SePay service & client
│   │   ├── github/              # GitHub collaborator invite service
│   │   └── validations/         # Zod schemas
│   ├── messages/                # 🗂️ Translation files (en.json, vi.json)
│   └── middleware.ts            # 🛡️ Security middleware (CSP, rate limiting, CSRF)
├── .env.local                   # Environment variables (not committed)
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── tsconfig.json                # TypeScript configuration
```

---

## 💰 Pricing

**One-time payment: $99 USD** (or VND equivalent via SePay)

Includes lifetime access to the private GitHub repository + all future updates.

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

---

## 🗄️ Database & Backup

### Provider: Neon PostgreSQL (ap-southeast-1)

| Feature | Details |
|---------|---------|
| **PITR** | Enabled (Point-in-Time Recovery) |
| **Retention** | Free: 24h, Pro: 7 days (configurable) |
| **RTO** | < 5 minutes (Neon branch restore) |
| **RPO** | < 1 minute (continuous WAL archiving) |

### Connection Architecture

- **DATABASE_URL** (pooled via pgbouncer) — used by app queries (`src/lib/db/index.ts`)
- **DIRECT_URL** (direct, no pgbouncer) — used by migration engine (`prisma.config.ts`)

### Pre-Migration Safety

Before running destructive migrations on production:

```bash
# 1. Create a Neon branch backup
neon branches create --name pre-migration-backup

# 2. Test migration on the branch
npx prisma migrate deploy

# 3. If something goes wrong, restore from branch
neon branches restore pre-migration-backup
```

### Backup Verification (monthly recommended)

```bash
# 1. Create a test branch from production
neon branches create --name backup-test-$(date +%Y%m%d)

# 2. Connect to the branch and verify data
psql $BRANCH_CONNECTION_STRING -c "SELECT count(*) FROM \"user\"; SELECT count(*) FROM purchase;"

# 3. Verify migrations replay cleanly
DATABASE_URL=$BRANCH_CONNECTION_STRING npx prisma migrate deploy

# 4. Clean up test branch
neon branches delete backup-test-$(date +%Y%m%d)
```

### Database Reset (development only)

```bash
npx prisma migrate reset
# Drops all tables, replays migrations, runs seed
```

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
