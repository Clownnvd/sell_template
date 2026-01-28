import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        purple: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
        pink: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        md: "text-sm px-2.5 py-0.5",
        lg: "text-base px-3 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
  dot?: boolean;
}

export function StatusBadge({
  variant,
  size,
  dot = false,
  className,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      className={cn(statusBadgeVariants({ variant, size }), className)}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "mr-1.5 size-1.5 rounded-full",
            variant === "success" && "bg-green-600 dark:bg-green-400",
            variant === "error" && "bg-red-600 dark:bg-red-400",
            variant === "warning" && "bg-yellow-600 dark:bg-yellow-400",
            variant === "info" && "bg-blue-600 dark:bg-blue-400",
            variant === "purple" && "bg-purple-600 dark:bg-purple-400",
            variant === "pink" && "bg-pink-600 dark:bg-pink-400",
            variant === "default" && "bg-muted-foreground"
          )}
        />
      )}
      {children}
    </span>
  );
}

export function SubscriptionStatusBadge({
  status,
}: {
  status: "ACTIVE" | "CANCELED" | "PAST_DUE" | "UNPAID" | "TRIALING";
}) {
  const variants: Record<
    typeof status,
    "success" | "default" | "error" | "warning" | "info"
  > = {
    ACTIVE: "success",
    CANCELED: "default",
    PAST_DUE: "error",
    UNPAID: "error",
    TRIALING: "info",
  };

  const labels: Record<typeof status, string> = {
    ACTIVE: "Active",
    CANCELED: "Canceled",
    PAST_DUE: "Past Due",
    UNPAID: "Unpaid",
    TRIALING: "Trial",
  };

  return (
    <StatusBadge variant={variants[status]} dot>
      {labels[status]}
    </StatusBadge>
  );
}
