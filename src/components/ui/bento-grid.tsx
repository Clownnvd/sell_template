import { cn } from "@/utils/cn";

interface BentoGridProps {
  className?: string;
  children: React.ReactNode;
}

export function BentoGrid({ className, children }: BentoGridProps) {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-5xl auto-rows-[minmax(16rem,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface BentoGridItemProps {
  className?: string;
  title: string;
  description: string;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}

export function BentoGridItem({
  className,
  title,
  description,
  header,
  icon,
}: BentoGridItemProps) {
  return (
    <div
      className={cn(
        "group/bento row-span-1 flex flex-col justify-between space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-lg hover:border-primary/20",
        className,
      )}
    >
      {header && <div className="flex-1">{header}</div>}
      <div>
        <div className="mb-2 flex items-center gap-2">
          {icon}
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
