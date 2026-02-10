"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema, type UpdateProfileInput } from "@/lib/validations/profile";
import { updateProfile } from "@/app/dashboard/settings/profile/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { icons } from "@/lib/icons";
import { useGlobalStore } from "@/stores/global-store";

export interface ProfileUser {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
}

interface ProfileFormProps {
  user: ProfileUser;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [currentUser, setCurrentUser] = useState<ProfileUser>(user);
  const [isPending, startTransition] = useTransition();
  const addNotification = useGlobalStore((state) => state.addNotification);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name ?? "",
      avatarUrl: user.avatarUrl ?? "",
    },
  });

  const onSubmit = (data: UpdateProfileInput) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("name", data.name);
      formData.set("avatarUrl", data.avatarUrl ?? "");

      const result = await updateProfile(formData);

      if (result.success) {
        setCurrentUser({
          ...currentUser,
          name: data.name,
          avatarUrl: data.avatarUrl ?? null,
        });
        addNotification({
          type: "success",
          title: "Profile updated",
          message: "Your profile has been updated successfully.",
        });
      } else {
        addNotification({
          type: "error",
          title: "Update failed",
          message: result.error || "Failed to update profile",
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
              {currentUser.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1">
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input
                id="avatarUrl"
                type="url"
                placeholder="https://example.com/avatar.jpg"
                {...register("avatarUrl")}
                error={errors.avatarUrl?.message}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Provide a URL to your avatar image
              </p>
            </div>
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register("name")}
              error={errors.name?.message}
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                value={currentUser.email}
                disabled
                className="flex-1"
              />
              <Button type="button" variant="outline" asChild>
                <a href="/dashboard/settings/account">
                  <icons.edit className="mr-2 size-4" />
                  Change
                </a>
              </Button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              To change your email, go to Account settings
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <icons.refresh className="mr-2 size-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <icons.check className="mr-2 size-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
