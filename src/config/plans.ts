export type PlanKey = "FREE" | "BASIC" | "PRO";

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
  popular?: boolean;
}

export const plans: Record<PlanKey, Plan> = {
  FREE: {
    name: "Free",
    slug: "FREE",
    description: "Perfect for getting started",
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
      teamMembers: 3,
      storage: 1,
      apiCalls: 1000,
    },
    features: [
      "1 project",
      "Up to 3 team members",
      "1 GB storage",
      "1,000 API calls/month",
      "Community support",
    ],
  },
  BASIC: {
    name: "Basic",
    slug: "BASIC",
    description: "Essential features for small teams",
    price: {
      monthly: 29,
      yearly: 290,
    },
    stripePriceId: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC_MONTHLY || "",
      yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC_YEARLY || "",
    },
    limits: {
      projects: 5,
      teamMembers: 10,
      storage: 10,
      apiCalls: 10000,
    },
    features: [
      "5 projects",
      "Up to 10 team members",
      "10 GB storage",
      "10,000 API calls/month",
      "Email support",
      "Basic analytics",
    ],
  },
  PRO: {
    name: "Pro",
    slug: "PRO",
    description: "Advanced features for growing businesses",
    price: {
      monthly: 99,
      yearly: 990,
    },
    stripePriceId: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY || "",
      yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY || "",
    },
    limits: {
      projects: -1, // unlimited
      teamMembers: 50,
      storage: 100,
      apiCalls: 100000,
    },
    features: [
      "Unlimited projects",
      "Up to 50 team members",
      "100 GB storage",
      "100,000 API calls/month",
      "Priority support",
      "Advanced analytics",
      "Custom integrations",
    ],
    popular: true,
  },
};

export function getPlan(slug: PlanKey): Plan {
  return plans[slug];
}

export function getAllPlans(): Plan[] {
  return Object.values(plans);
}

export function getUpgradePlans(currentPlan: PlanKey): Plan[] {
  const order: PlanKey[] = ["FREE", "BASIC", "PRO"];
  const currentIndex = order.indexOf(currentPlan);
  return order.slice(currentIndex + 1).map((key) => plans[key]);
}
