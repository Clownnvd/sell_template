# Infrastructure Overview

## Architecture

```
User → Vercel Edge (CDN + Middleware) → Next.js App Router → Neon PostgreSQL
                                          ├── Stripe (payments)
                                          ├── GitHub API (repo invite)
                                          ├── Resend (email)
                                          └── Upstash Redis (rate limiting)
```

## Hosting: Vercel

- **Platform**: Vercel (serverless)
- **Framework**: Next.js 16 App Router
- **Region**: Auto (edge network)
- **Deploy**: Auto on push to `master`
- **Preview**: Auto for each PR

## Database: Neon PostgreSQL

- **Provider**: Neon
- **Region**: ap-southeast-1 (Singapore)
- **Project**: sell-template
- **Connection**: Pooled via pgbouncer (serverless driver)
- **Migrations**: Prisma (direct URL bypasses pgbouncer)

## External Services

| Service | Purpose | Timeout | Retry |
|---------|---------|---------|-------|
| Stripe | Payments ($99 one-time) | 15s (SDK) | 2 retries (SDK) |
| GitHub API | Repo collaborator invite | 10s (AbortController) | None (non-fatal) |
| Resend | Welcome email | 10s (Promise.race) | None (non-fatal) |
| Upstash Redis | Rate limiting | 5s (SDK default) | None (fallback to in-memory) |
| Neon PostgreSQL | Database queries | Connection pool timeout | Prisma handles reconnect |

## Monitoring Endpoints

| Endpoint | Purpose | Checks |
|----------|---------|--------|
| `GET /api/health` | Liveness probe | Database connectivity, latency |
| `GET /api/ready` | Readiness probe | Database + required env vars |

## Observability Stack

### Structured Logging
- JSON format in production (machine-parseable)
- Human-readable in development
- Fields: level, event, method, path, status, durationMs, userId, IP, requestId
- Location: `src/lib/api/logger.ts`

### Request Tracing
- Every request gets unique `x-request-id` (via middleware)
- Request ID propagated to all log entries
- Duration tracked (Date.now() for each API route)

### Security Logging
- Authentication events (sign up, sign in, OAuth link)
- Rate limit hits
- CSRF violations
- Webhook processing events

## CI/CD Pipeline

```
PR → GitHub Actions CI → Lint + TypeCheck + Test (parallel) → Build → Vercel Preview
                                                                         ↓
Merge to master → GitHub Actions CI → Build → Vercel Production → Smoke Test
```

### Workflows
- `ci.yml`: Lint, typecheck, test (parallel), then build
- `security.yml`: Weekly dependency audit (pnpm audit)
- `deploy.yml`: Post-deploy smoke test (health check)

## Environment Configuration

- **Validation**: Zod schemas at startup (`src/lib/env.ts`)
- **Documentation**: `.env.example` with all variables
- **Secrets**: Vercel environment variables (per environment)
- **Rotation**: See `docs/runbooks/secrets-rotation.md`
