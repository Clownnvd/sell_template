import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { requireUserId } from "@/lib/auth/server";
import { ProfileForm } from "@/components/dashboard/profile-form";

export default async function ProfilePage() {
  const userId = await requireUserId();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your profile information
        </p>
      </div>

      <ProfileForm
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.image,
        }}
      />
    </div>
  );
}
