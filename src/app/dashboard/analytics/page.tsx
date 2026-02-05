import { EmptyState } from "@/components/shared/empty-state";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="mt-2 text-muted-foreground">
          Track your project metrics and performance
        </p>
      </div>

      <EmptyState
        icon={BarChart3}
        title="Analytics Coming Soon"
        description="We're working on bringing you powerful analytics and insights. Stay tuned for updates!"
        className="min-h-[400px]"
      />
    </div>
  );
}
