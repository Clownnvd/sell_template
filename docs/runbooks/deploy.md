# Deploy Runbook

## Pre-Deploy Checklist

- [ ] All CI checks pass (lint, typecheck, test, build)
- [ ] PR reviewed and approved
- [ ] Database migrations tested on Neon branch (if any)
- [ ] Environment variables updated in Vercel (if new vars added)
- [ ] `.env.example` updated (if new vars added)
- [ ] No breaking API changes without client coordination

## Deploy Process (Vercel)

1. **Merge PR to master** — Vercel auto-deploys to production
2. **Monitor deployment** — Check Vercel dashboard for build success
3. **Verify health** — `curl https://your-domain.com/api/health`
4. **Verify readiness** — `curl https://your-domain.com/api/ready`
5. **Smoke test** — Visit landing page, verify key flows work

## Rollback Procedure

### Option 1: Vercel Instant Rollback (fastest)
1. Go to **Vercel Dashboard > Deployments**
2. Find last known good deployment
3. Click **"..." > "Promote to Production"**
4. Verify health endpoint returns 200

### Option 2: Git Revert
1. `git revert <bad-commit-sha>`
2. Push to master → triggers redeploy
3. Verify deployment

## Hotfix Process

1. Create branch from master: `git checkout -b hotfix/<description>`
2. Apply minimal fix
3. Run `pnpm typecheck && pnpm test:run`
4. Create PR with `[HOTFIX]` prefix
5. Get expedited review (1 reviewer minimum)
6. Merge → auto-deploys to production
7. Verify health endpoint

## Database Migration Deploy

1. **Test migration** on Neon branch first
2. Merge PR (Prisma auto-generates migration)
3. Vercel build runs `prisma generate`
4. If migration fails: revert PR, run `prisma migrate resolve --rolled-back`

## Incident Response

### Severity Levels
- **P0 (Critical)**: Site down, payments broken → Immediate rollback
- **P1 (High)**: Feature broken, data issue → Fix within 1 hour
- **P2 (Medium)**: UI bug, non-critical feature → Fix within 24 hours

### Steps
1. **Assess**: Check `/api/health` and `/api/ready`
2. **Communicate**: Update team on status
3. **Rollback** if P0: Use Vercel instant rollback
4. **Investigate**: Check Vercel logs, structured logs
5. **Fix**: Apply hotfix or revert
6. **Post-mortem**: Document what happened and prevention
