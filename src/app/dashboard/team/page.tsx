"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { UserPlus, Users } from "lucide-react";

export default function TeamPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your team members and their roles
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      <EmptyState
        icon={Users}
        title="No team members yet"
        description="Invite your team members to collaborate on projects. You can assign roles and permissions to each member."
        action={
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Team Member
          </Button>
        }
        className="min-h-[400px]"
      />
    </div>
  );
}
