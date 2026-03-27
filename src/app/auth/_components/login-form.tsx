"use client";

import { useRouter } from "@bprogress/next/app";
import Link from "next/link";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useFormMutation } from "@/hooks/use-form-mutation";

const FormSchema = z.object({
  email: z
    .email({ message: "Please enter a valid email address." })
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters." })
    .trim(),
});

type FormData = z.infer<typeof FormSchema>;

export function LoginForm() {
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const { form, mutation, CustomForm } = useFormMutation<FormData>({
    mutationFn: login,
    onSuccess: () => {
      router.push("/dashboard/home");
    },
    defaultValues: {
      email: "",
      password: "",
    },
    schema: FormSchema,
  });

  return (
    <CustomForm className="w-100 space-y-1">
      <div className="mb-15 space-y-2">
        <h1 className="font-medium text-3xl">Sign in</h1>
        <p className="text-muted-foreground text-sm">
          Login with your username & password{" "}
        </p>
      </div>

      {/* Email */}
      <form.AppField name="email">
        {(field) => (
          <field.Input
            group
            label="Email"
            placeholder="Please enter your email"
            required
          />
        )}
      </form.AppField>

      {/* Password */}
      <form.AppField name="password">
        {(field) => (
          <field.Input
            group
            label="Password"
            placeholder="Please enter your password"
            required
          />
        )}
      </form.AppField>

      <Link
        className="m-0 flex w-full justify-end pb-10 text-auth-link text-xs underline"
        href={"reset-password"}
      >
        Forgot Password ?
      </Link>

      <Button
        className="w-full rounded-none bg-auth-button text-xs hover:bg-auth-button"
        disabled={mutation.isPending || isLoading}
        type="submit"
      >
        {mutation.isPending || isLoading ? "Signing in ..." : "Sign in"}
      </Button>
    </CustomForm>
  );
}
