export type PlanKey = "FREE" | "BASIC" | "PRO" | "ENTERPRISE";

export interface Plan {
  name: string;
  slug: PlanKey;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  stripePriceId: {
    monthly: string;
    yearly: string;
  };
  limits: {
    projects: number;
    teamMembers: number;
    storage: number; // in GB
    apiCalls: number; // per month
  };
  features: string[];
}

export const plans: Record<PlanKey, Plan> = {
  FREE: {
    name: "Free",
    slug: "FREE",
    description: "Perfect for trying out the platform",
    price: {
      monthly: 0,
      yearly: 0,
    },
    stripePriceId: {
      monthly: "",
      yearly: "",
    },
    limits: {
      projects: 1,
      teamMembers: 1,
      storage: 1,
      apiCalls: 1000,
    },
    features: [
      "1 project",
      "1 team member",
      "1 GB storage",
      "1,000 API calls/month",
      "Community support",
    ],
  },
  BASIC: {
    name: "Basic",
    slug: "BASIC",
    description: "For small teams getting started",
    price: {
      monthly: 9,
      yearly: 90,
    },
    stripePriceId: {
      monthly: process.env.STRIPE_PRICE_ID_BASIC_MONTHLY || "",
      yearly: process.env.STRIPE_PRICE_ID_BASIC_YEARLY || "",
    },
    limits: {
      projects: 5,
      teamMembers: 3,
      storage: 10,
      apiCalls: 10000,
    },
    features: [
      "5 projects",
      "3 team members",
      "10 GB storage",
      "10,000 API calls/month",
      "Email support",
      "Basic analytics",
    ],
  },
  PRO: {
    name: "Pro",
    slug: "PRO",
    description: "For growing businesses",
    price: {
      monthly: 29,
      yearly: 290,
    },
    stripePriceId: {
      monthly: process.env.STRIPE_PRICE_ID_PRO_MONTHLY || "",
      yearly: process.env.STRIPE_PRICE_ID_PRO_YEARLY || "",
    },
    limits: {
      projects: 20,
      teamMembers: 10,
      storage: 100,
      apiCalls: 100000,
    },
    features: [
      "20 projects",
      "10 team members",
      "100 GB storage",
      "100,000 API calls/month",
      "Priority email support",
      "Advanced analytics",
      "Custom integrations",
    ],
  },
  ENTERPRISE: {
    name: "Enterprise",
    slug: "ENTERPRISE",
    description: "For large teams",
    price: {
      monthly: 99,
      yearly: 990,
    },
    stripePriceId: {
      monthly: process.env.STRIPE_PRICE_ID_ENTERPRISE_MONTHLY || "",
      yearly: process.env.STRIPE_PRICE_ID_ENTERPRISE_YEARLY || "",
    },
    limits: {
      projects: -1, // unlimited
      teamMembers: -1, // unlimited
      storage: -1, // unlimited
      apiCalls: -1, // unlimited
    },
    features: [
      "Unlimited projects",
      "Unlimited team members",
      "Unlimited storage",
      "Unlimited API calls",
      "24/7 phone & email support",
      "Advanced analytics",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantees",
    ],
  },
};

export function getPlan(slug: PlanKey): Plan {
  return plans[slug];
}

export function getAllPlans(): Plan[] {
  return Object.values(plans);
}
