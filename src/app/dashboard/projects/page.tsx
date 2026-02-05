"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { FolderPlus, FileText } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your projects and collaborate with your team
          </p>
        </div>
        <Button>
          <FolderPlus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <EmptyState
        icon={FileText}
        title="No projects yet"
        description="Create your first project to get started. Projects help you organize your work and collaborate with your team."
        action={
          <Button>
            <FolderPlus className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        }
        className="min-h-[400px]"
      />
    </div>
  );
}
