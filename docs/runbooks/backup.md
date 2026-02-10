# Backup & Disaster Recovery Runbook

## Provider: Neon PostgreSQL

- **Region**: ap-southeast-1 (Singapore)
- **Project**: sell-template
- **Backup Type**: Continuous (provider-managed)
- **Point-in-Time Recovery**: Via Neon branching

## Recovery Objectives

| Metric | Target | Notes |
|--------|--------|-------|
| **RPO** (Recovery Point Objective) | ~1 minute | Neon continuous WAL backup |
| **RTO** (Recovery Time Objective) | ~15 minutes | Branch creation + env update + verification |

## Backup Strategy

### Automated (Provider-Managed)
- Neon automatically backs up all data continuously
- WAL (Write-Ahead Log) streaming enables PITR
- Retention: per Neon plan (Free: 7 days, Pro: 30 days)

### Application-Level
- Prisma migrations versioned in git (`prisma/migrations/`)
- Seed script available (`prisma/seed.ts`) for fresh environments
- Database schema always recoverable from migration history

## Restore Procedures

### Scenario 1: Restore to Specific Point in Time

1. Go to **Neon Console > Project > Branches**
2. Click **"Create Branch"**
3. Select **"From specific point in time"**
4. Choose the desired timestamp (before the incident)
5. Name the branch: `restore-YYYYMMDD-HHMM`
6. Copy the branch connection string
7. Update `DATABASE_URL` in Vercel environment variables
8. Trigger redeploy or restart
9. Verify: `curl https://your-domain.com/api/ready`
10. Once verified, promote branch or migrate data

### Scenario 2: Full Database Reset (Development)

```bash
# Reset to clean state with seed data
pnpm prisma migrate reset
```

### Scenario 3: Schema Rollback

```bash
# If a migration caused issues
pnpm prisma migrate resolve --rolled-back <migration-name>

# Then fix the migration and re-apply
pnpm prisma migrate dev
```

### Scenario 4: New Environment Setup

```bash
# From scratch
cp .env.example .env.local
# Fill in environment variables
pnpm install
pnpm prisma migrate deploy
pnpm prisma db seed
```

## Data Export (GDPR)

To export a user's data:

```sql
-- Export user data
SELECT * FROM "User" WHERE id = '<user-id>';
SELECT * FROM "Purchase" WHERE "userId" = '<user-id>';
SELECT * FROM "Session" WHERE "userId" = '<user-id>';
SELECT * FROM "Account" WHERE "userId" = '<user-id>';
SELECT * FROM "EmailLog" WHERE "userId" = '<user-id>';
```

## Recovery Testing Schedule

- **Monthly**: Verify Neon branch creation works
- **Quarterly**: Full restore test on Neon branch
- **After major migrations**: Test rollback procedure

## Contacts

- **Database Provider**: Neon (https://neon.tech/docs/introduction/support)
- **Hosting**: Vercel (https://vercel.com/support)
