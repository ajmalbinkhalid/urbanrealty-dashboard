"use client";

import { useRouter } from "@bprogress/next/app";
import Link from "next/link";

import { useEffect, useState } from "react";
import { z } from "zod";
import { authApi } from "@/api/auth/authApi";
import { Button } from "@/components/ui/button";
import { useFormMutation } from "@/hooks/use-form-mutation";

const EmailSchema = z.object({
  email: z.email().toLowerCase().trim(),
});

const OTPSchema = z.object({
  otp: z
    .string()
    .length(4, "OTP must be 4 digits")
    .nonempty("This field is required"),
});

const PasswordSchema = z
  .object({
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function ResetPasswordForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [sessionToken, setSessionToken] = useState("");
  // const [accessToken, setAccessToken] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const getResendButtonLabel = (): string => {
    if (canResend) {
      return "Resend";
    }
    return `Resend in ${resendTimer}s`;
  };

  useEffect(() => {
    if (step !== 2) {
      return;
    }

    if (resendTimer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer, step]);

  const router = useRouter();

  const emailForm = useFormMutation({
    schema: EmailSchema,
    defaultValues: { email: "" },
    mutationFn: async ({ email }) => {
      return await authApi.sendOtp(email);
    },
    onSuccess: (data) => {
      setSessionToken(data?.data?.sessionToken ?? "");
      setStep(2);
      setResendTimer(30);
      setCanResend(false);
    },
  });

  const resendOtp = useFormMutation({
    schema: z.object({}),
    mutationFn: () => authApi.resendOtp(sessionToken),
    onSuccess: (data) => {
      setSessionToken(data?.data?.sessionToken ?? "");
    },
  });

  const otpForm = useFormMutation({
    schema: OTPSchema,
    defaultValues: { otp: "" },
    // include session token from previous step
    mutationFn: async ({ otp }) => {
      if (!sessionToken) {
        throw new Error("Session expired. Please resend OTP.");
      }

      return await authApi.verifyOtp({
        otp,
        token: sessionToken,
      });
    },

    onSuccess: (data) => {
      setSessionToken(data?.data?.sessionToken ?? "");
      setStep(3);
    },
  });

  /* STEP 3 – PASSWORD */
  const passwordForm = useFormMutation({
    schema: PasswordSchema,
    defaultValues: { newPassword: "", confirmPassword: "" },
    mutationFn: async ({ newPassword, confirmPassword }) => {
      if (!sessionToken) {
        throw new Error("Unauthorized");
      }

      return await authApi.confirmPassword({
        newPassword,
        confirmPassword,
        token: sessionToken,
      });
    },

    onSuccess: () => {
      router.replace("/auth/login");
    },
  });

  return (
    <div className="max-w-100 space-y-1">
      {step === 1 && (
        <div className="mb-15 space-y-2">
          <h1 className="font-medium text-2xl">Forgot password</h1>
          <p className="text-muted-foreground text-sm">
            Please enter your email registered with us and click submit.
          </p>
        </div>
      )}
      {step === 2 && (
        <div className="mb-6 space-y-2">
          <h1 className="font-medium text-2xl">Verify account</h1>
          <p className="text-muted-foreground text-sm">
            We have send verification code to your email entered, please verify
            the account.
          </p>
        </div>
      )}
      {step === 3 && (
        <div className="mb-6 space-y-2">
          <h1 className="font-medium text-2xl">Reset Password</h1>
          <p className="text-muted-foreground text-sm">
            Please enter your new password.
          </p>
        </div>
      )}
      {/* STEP 1 */}
      {step === 1 && (
        <emailForm.CustomForm className="space-y-8">
          <emailForm.form.AppField name="email">
            {(field) => (
              <field.Input
                group
                label="Email"
                placeholder="Please enter your email"
              />
            )}
          </emailForm.form.AppField>

          <div className="flex w-full justify-between gap-4">
            <Button
              asChild
              className="h-11 w-45 rounded-none bg-auth-button text-xs hover:bg-auth-button"
            >
              <Link href={"login"}>Cancel</Link>
            </Button>
            <Button
              className="h-11 w-45 rounded-none bg-auth-button text-xs hover:bg-auth-button"
              disabled={emailForm.mutation.isPending}
              type="submit"
            >
              {emailForm.mutation.isPending ? "Sending OTP..." : "Submit"}
            </Button>
          </div>
        </emailForm.CustomForm>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <otpForm.CustomForm className="space-y-4">
          <otpForm.form.AppField name="otp">
            {(field) => (
              <field.Input label="" placeholder="Enter verification code" />
            )}
          </otpForm.form.AppField>

          <div className="flex flex-col justify-between gap-10">
            <Button
              className="h-11 w-full rounded-none bg-auth-button"
              disabled={otpForm.mutation.isPending}
              type="submit"
            >
              {otpForm.mutation.isPending ? "Verifying..." : "Verify OTP"}
            </Button>

            <p>
              Didn't receive code?{" "}
              <Button
                className="p-0 text-[#FF3A02] underline disabled:opacity-50"
                disabled={!canResend || resendOtp.mutation.isPending}
                onClick={() => {
                  resendOtp.mutation.mutate({});
                  setResendTimer(30);
                  setCanResend(false);
                }}
                variant={"link"}
              >
                {resendOtp.mutation.isPending
                  ? "Sending OTP..."
                  : getResendButtonLabel()}
              </Button>
            </p>
          </div>
        </otpForm.CustomForm>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <passwordForm.CustomForm className="space-y-4">
          <passwordForm.form.AppField name="newPassword">
            {(field) => <field.Password label="New Password" />}
          </passwordForm.form.AppField>
          <passwordForm.form.AppField name="confirmPassword">
            {(field) => <field.Password label="Confirm Password" />}
          </passwordForm.form.AppField>

          <div className="flex justify-between gap-2">
            <Button
              className="w-40 rounded-none bg-auth-button"
              onClick={() => setStep(2)}
              type="button"
            >
              Back
            </Button>
            <Button
              className="w-40 rounded-none bg-auth-button"
              disabled={passwordForm.mutation.isPending}
              type="submit"
            >
              {passwordForm.mutation.isPending
                ? "Resetting..."
                : "Reset Password"}
            </Button>
          </div>
        </passwordForm.CustomForm>
      )}
    </div>
  );
}
