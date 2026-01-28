import { icons, type IconName, type LucideIcon } from "@/lib/icons";
import { cn } from "@/utils/cn";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: IconName | LucideIcon;
  change?: number;
  changeLabel?: string;
  className?: string;
  trend?: "up" | "down" | "neutral";
}

export function StatsCard({
  title,
  value,
  icon,
  change,
  changeLabel,
  className,
  trend,
}: StatsCardProps) {
  // Determine if icon is a string (IconName) or a component (LucideIcon)
  const IconComponent = icon
    ? typeof icon === "string"
      ? icons[icon as IconName]
      : icon
    : null;

  // Auto-determine trend from change if not provided
  const determinedTrend =
    trend ||
    (change !== undefined
      ? change > 0
        ? "up"
        : change < 0
        ? "down"
        : "neutral"
      : undefined);

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          {(change !== undefined || changeLabel) && (
            <div className="mt-2 flex items-center gap-1 text-sm">
              {change !== undefined && (
                <span
                  className={cn(
                    "flex items-center gap-0.5 font-medium",
                    determinedTrend === "up" && "text-green-600 dark:text-green-400",
                    determinedTrend === "down" && "text-red-600 dark:text-red-400",
                    determinedTrend === "neutral" && "text-muted-foreground"
                  )}
                >
                  {determinedTrend === "up" && (
                    <icons.trendingUp className="size-4" />
                  )}
                  {determinedTrend === "down" && (
                    <icons.trendingDown className="size-4" />
                  )}
                  {change > 0 && "+"}
                  {change}%
                </span>
              )}
              {changeLabel && (
                <span className="text-muted-foreground">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        {IconComponent && (
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
            <IconComponent className="size-6 text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}

// Grid container for stats cards
interface StatsGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function StatsGrid({
  children,
  columns = 3,
  className,
}: StatsGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        columns === 2 && "md:grid-cols-2",
        columns === 3 && "md:grid-cols-3",
        columns === 4 && "md:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  );
}
