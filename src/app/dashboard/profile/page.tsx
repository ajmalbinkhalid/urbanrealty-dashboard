"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { profileApi } from "@/api/dashboard/profileApi";
import { FormGrid } from "@/components/form/FormGrid";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useFormMutation } from "@/hooks/use-form-mutation";

const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;

const ProfileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Name is required")
    .regex(nameRegex, "Name must contain only letters"),
});

type ProfileUpdateData = z.infer<typeof ProfileUpdateSchema>;

const PasswordChangeSchema = z
  .object({
    oldPassword: z.string().min(8, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmedPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmedPassword, {
    message: "Passwords don't match",
    path: ["confirmedPassword"],
  });

type PasswordChangeData = z.infer<typeof PasswordChangeSchema>;

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  /* ---------- FETCH PROFILE ---------- */
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: profileApi.getProfile,
  });
  const admin = data?.data?.admin;

  /* ---------- PROFILE UPDATE FORM ---------- */
  const {
    form: profileForm,
    mutation: profileMutation,
    CustomForm: ProfileForm,
  } = useFormMutation<ProfileUpdateData>({
    schema: ProfileUpdateSchema,
    mutationFn: (formData) => profileApi.updateProfile(formData), // <-- API
    defaultValues: {
      name: admin?.name || "",
    },
    onSuccess: (response) => {
      const adminData = (response.data as any)?.admin || response.data;
      updateUser(adminData);
      queryClient.invalidateQueries({ queryKey: ["admin-profile"] });
    },
  });

  /* ---------- PASSWORD UPDATE FORM ---------- */
  const {
    form: passwordForm,
    mutation: passwordMutation,
    CustomForm: PasswordForm,
  } = useFormMutation<PasswordChangeData>({
    schema: PasswordChangeSchema,
    mutationFn: (formData) => profileApi.updatePassword(formData),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmedPassword: "",
    },
    onSuccess: () => {
      passwordForm.reset();
    },
  });

  if (isLoading) {
    return <div className="p-6">Loading profile...</div>;
  }

  if (isError) {
    return <div className="p-6 text-destructive">Failed to load profile.</div>;
  }

  return (
    <div className="flex h-full w-full flex-col gap-8 py-4">
      {/* PROFILE INFORMATION*/}
      <ProfileForm className="flex flex-col">
        <h2 className="mb-4 font-semibold text-lg">Profile Information</h2>

        <FormGrid px="0">
          {/* Name - Editable */}
          <FormGrid.Item span="full">
            <profileForm.AppField name="name">
              {(field) => (
                <field.Input label="Name" placeholder="Enter your name" />
              )}
            </profileForm.AppField>
          </FormGrid.Item>

          {/* Email - Read Only */}
          <FormGrid.Item span="full">
            <div className="space-y-2">
              <div className="font-medium text-sm">Email</div>
              <div className="rounded-md px-3 py-2 text-muted-foreground">
                {admin?.email || "N/A"}
              </div>
            </div>
          </FormGrid.Item>
        </FormGrid>

        <div className="mt-4 flex justify-end">
          <Button disabled={profileMutation.isPending} type="submit">
            {profileMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </ProfileForm>

      {/* PASSWORD SECTION */}
      <PasswordForm className="flex flex-col border-t pt-8">
        <h2 className="mb-4 font-semibold text-lg">Change Password</h2>
        <FormGrid px="0">
          {/* Old Password */}
          <FormGrid.Item span="full">
            <passwordForm.AppField name="oldPassword">
              {(field) => (
                <field.Input
                  label="Current Password"
                  placeholder="Enter current password"
                  type="text"
                />
              )}
            </passwordForm.AppField>
          </FormGrid.Item>

          {/* New Password */}
          <FormGrid.Item span="full">
            <passwordForm.AppField name="newPassword">
              {(field) => (
                <field.Input
                  label="New Password"
                  placeholder="Enter new password"
                  type="text"
                />
              )}
            </passwordForm.AppField>
          </FormGrid.Item>

          {/* Confirm Password */}
          <FormGrid.Item span="full">
            <passwordForm.AppField name="confirmedPassword">
              {(field) => (
                <field.Input
                  label="Confirm Password"
                  placeholder="Confirm new password"
                  type="text"
                />
              )}
            </passwordForm.AppField>
          </FormGrid.Item>
        </FormGrid>

        <div className="mt-4 flex justify-end">
          <Button disabled={passwordMutation.isPending} type="submit">
            {passwordMutation.isPending ? "Changing..." : "Change Password"}
          </Button>
        </div>
      </PasswordForm>
    </div>
  );
}
