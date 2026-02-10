"use server";

import { revalidatePathWithLog } from "@/lib/cache-utils";
import prisma from "@/lib/db";
import { requireUserId } from "@/lib/auth/server";
import { updateProfileSchema } from "@/lib/validations/profile";

export interface UpdateProfileResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function updateProfile(formData: FormData): Promise<UpdateProfileResult> {
  const userId = await requireUserId();

  const raw = {
    name: formData.get("name"),
    avatarUrl: formData.get("avatarUrl"),
  };

  const parseResult = updateProfileSchema.safeParse(raw);
  if (!parseResult.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parseResult.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { name, avatarUrl } = parseResult.data;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        image: avatarUrl || null,
      },
    });

    revalidatePathWithLog("/dashboard/settings/profile", "profile-action:update");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update profile" };
  }
}
