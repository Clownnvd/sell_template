# API Documentation

Complete API reference for the Next.js 16 SaaS Template.

## Table of Contents

- [Authentication](#authentication)
- [Billing](#billing)
- [Webhooks](#webhooks)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Pagination](#pagination)
- [Best Practices](#best-practices)

---

## Base URL

```
Development: http://localhost:3000/api
Production: https://yourdomain.com/api
```

## Authentication

All API endpoints (except webhooks) require authentication via session cookies managed by BetterAuth.

### Headers

```http
Cookie: better-auth.session_token=<session-token>
```

---

## Billing

### Create Checkout Session

Create a Stripe checkout session to subscribe to a plan.

**Endpoint:** `POST /stripe/checkout`

**Authentication:** Required

**Request Body:**

```json
{
  "priceId": "price_1234567890",
  "successUrl": "https://yourdomain.com/billing?success=true", // Optional
  "cancelUrl": "https://yourdomain.com/billing?canceled=true" // Optional
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "url": "https://checkout.stripe.com/c/pay/cs_test_abc123xyz"
  }
}
```

**Usage:**

```javascript
const response = await fetch('/api/stripe/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ priceId: 'price_123' })
});

const { data } = await response.json();
window.location.href = data.url; // Redirect to Stripe Checkout
```

### Create Customer Portal Session

Create a Stripe customer portal session to manage subscription.

**Endpoint:** `POST /stripe/portal`

**Authentication:** Required

**Request Body:**

```json
{
  "returnUrl": "https://yourdomain.com/billing" // Optional
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "url": "https://billing.stripe.com/p/session/test_abc123xyz"
  }
}
```

**Usage:**

```javascript
const response = await fetch('/api/stripe/portal', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({})
});

const { data } = await response.json();
window.location.href = data.url; // Redirect to Stripe Portal
```

---

## Webhooks

### Stripe Webhook

Receives events from Stripe to sync subscription data.

**Endpoint:** `POST /webhooks/stripe`

**Authentication:** Stripe signature verification

**Events Handled:**

- `checkout.session.completed` - Creates subscription after successful checkout
- `customer.subscription.created` - Syncs new subscription
- `customer.subscription.updated` - Syncs subscription updates
- `customer.subscription.deleted` - Cancels subscription
- `invoice.payment_succeeded` - Updates subscription on successful payment
- `invoice.payment_failed` - Marks subscription as past due

**Request Headers:**

```http
stripe-signature: t=1234567890,v1=abc123...
```

**Setup:**

1. Configure webhook endpoint in Stripe Dashboard
2. Add webhook secret to `.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_abc123xyz
```

**Response:**

```json
{
  "received": true
}
```

---

## Error Handling

### Standard Error Response

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message here",
  "errors": {
    // Optional validation errors
    "field": ["Error message 1", "Error message 2"]
  }
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Validation error or invalid request |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error |

### Common Errors

**401 Unauthorized**

```json
{
  "success": false,
  "error": "Unauthorized"
}
```

**400 Validation Error**

```json
{
  "success": false,
  "error": "Validation failed",
  "errors": {
    "name": ["Name must be at least 2 characters"],
    "email": ["Invalid email address"]
  }
}
```

**500 Server Error**

```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting in production using:

- [next-rate-limit](https://github.com/vercel/next.js/tree/canary/examples/api-routes-rate-limit)
- [upstash/ratelimit](https://github.com/upstash/ratelimit)

---

## Pagination

Currently, all list endpoints return all results. For production, consider implementing pagination:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## Best Practices

### Client-Side Usage

Use the provided React hooks for easier API integration:

```typescript
import { useSubscription } from '@/hooks/use-subscription';

const { createCheckout, createPortal } = useSubscription();
```

### Error Handling

Always check the `success` field and handle errors:

```typescript
const response = await fetch('/api/stripe/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ priceId: 'price_123' })
});

const result = await response.json();

if (!result.success) {
  console.error(result.error);
  if (result.errors) {
    Object.entries(result.errors).forEach(([field, messages]) => {
      console.error(`${field}: ${messages.join(', ')}`);
    });
  }
}
```

### TypeScript Types

All API responses are typed. Import from `@/types`:

```typescript
import type { ApiResponse } from '@/types';

const response: ApiResponse<unknown> = await fetch(...).then(r => r.json());
```

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/your-repo/issues
- Documentation: Check README.md for setup instructions
