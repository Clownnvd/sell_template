import { icons } from "@/lib/icons";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";

export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface PricingPlan {
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: PricingFeature[];
  popular?: boolean;
  cta: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
  priceIds?: {
    monthly: string;
    yearly: string;
  };
}

interface PricingCardProps {
  plan: PricingPlan;
  billingCycle: "monthly" | "yearly";
  className?: string;
}

export function PricingCard({
  plan,
  billingCycle,
  className,
}: PricingCardProps) {
  const price =
    billingCycle === "monthly" ? plan.price.monthly : plan.price.yearly;
  const yearlyDiscount =
    plan.price.yearly > 0
      ? Math.round((1 - plan.price.yearly / (plan.price.monthly * 12)) * 100)
      : 0;

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-xl",
        plan.popular && "border-primary shadow-lg",
        className
      )}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-primary px-4 py-1 text-sm font-medium text-white">
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-2xl font-bold">{plan.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold">
            ${price === 0 ? "0" : price.toLocaleString()}
          </span>
          {price > 0 && (
            <span className="text-muted-foreground">
              /{billingCycle === "monthly" ? "month" : "year"}
            </span>
          )}
        </div>
        {billingCycle === "yearly" && yearlyDiscount > 0 && (
          <p className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
            Save {yearlyDiscount}% with yearly billing
          </p>
        )}
      </div>

      <Button
        size="lg"
        variant={plan.popular ? "default" : "outline"}
        className="mb-6 w-full"
        onClick={plan.cta.onClick}
        asChild={!!plan.cta.href}
      >
        {plan.cta.href ? (
          <a href={plan.cta.href}>{plan.cta.text}</a>
        ) : (
          <span>{plan.cta.text}</span>
        )}
      </Button>

      <div className="flex-1 space-y-3">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            {feature.included ? (
              <icons.check className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
            ) : (
              <icons.close className="mt-0.5 size-5 shrink-0 text-muted-foreground opacity-50" />
            )}
            <span
              className={cn(
                "text-sm",
                feature.included
                  ? "text-foreground"
                  : "text-muted-foreground line-through"
              )}
            >
              {feature.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Grid container for pricing cards
interface PricingGridProps {
  children: React.ReactNode;
  className?: string;
}

export function PricingGrid({ children, className }: PricingGridProps) {
  return (
    <div
      className={cn(
        "grid gap-8 md:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  );
}
