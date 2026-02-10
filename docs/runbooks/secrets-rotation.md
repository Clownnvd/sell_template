# Secrets Rotation Runbook

## Rotation Schedule

| Secret | Rotation Frequency | Location |
|--------|--------------------|----------|
| BETTER_AUTH_SECRET | Quarterly | Vercel env vars |
| STRIPE_SECRET_KEY | On compromise | Stripe Dashboard → Vercel |
| STRIPE_WEBHOOK_SECRET | On endpoint change | Stripe Dashboard → Vercel |
| GITHUB_PAT | Annually (or on compromise) | GitHub Settings → Vercel |
| RESEND_API_KEY | Annually | Resend Dashboard → Vercel |
| SEPAY_API_KEY | Annually | SePay Dashboard → Vercel |
| SEPAY_WEBHOOK_KEY | On endpoint change | SePay Dashboard → Vercel |
| DATABASE_URL | On compromise | Neon Console → Vercel |

## Rotation Procedures

### BETTER_AUTH_SECRET

1. Generate new secret: `openssl rand -base64 48`
2. Update in **Vercel Dashboard > Settings > Environment Variables**
3. Trigger redeploy
4. Note: Existing sessions will be invalidated (users must re-login)

### Stripe Keys

1. Go to **Stripe Dashboard > Developers > API Keys**
2. Roll the secret key (Stripe generates a new one)
3. Update `STRIPE_SECRET_KEY` in Vercel
4. For webhook secret: update webhook endpoint → copy new signing secret
5. Update `STRIPE_WEBHOOK_SECRET` in Vercel
6. Trigger redeploy
7. Verify: make a test purchase on preview deployment

### GitHub PAT

1. Go to **GitHub > Settings > Developer Settings > Personal Access Tokens**
2. Generate new token with `repo` scope
3. Update `GITHUB_PAT` in Vercel
4. Trigger redeploy
5. Verify: GitHub invite still works after purchase

### Database Credentials

1. Go to **Neon Console > Project > Connection Details**
2. Reset password (Neon generates a new one)
3. Update `DATABASE_URL` and `DIRECT_URL` in Vercel
4. Trigger redeploy
5. Verify: `curl https://your-domain.com/api/ready`

## Emergency Rotation (Compromised Secret)

1. **Immediately** rotate the compromised secret using steps above
2. Check Vercel deployment logs for unauthorized access
3. If DB credentials: check Neon query history for suspicious activity
4. If Stripe keys: check Stripe Dashboard for unauthorized charges
5. If GitHub PAT: check repo for unauthorized collaborator additions
6. Document the incident

## Verification After Rotation

After any secret rotation:
1. Check `/api/health` — should return 200
2. Check `/api/ready` — all checks should pass
3. Test the affected integration (payment, email, GitHub invite)
4. Monitor logs for errors in the first 30 minutes
