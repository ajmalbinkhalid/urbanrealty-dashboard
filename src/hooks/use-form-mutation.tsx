"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { z } from "zod";
import { useAppForm } from "@/components/form/hooks";
import type { ApiResponse } from "@/types/api-response";
import { handleFormApiError } from "@/utils/error-handler";

type UseFormMutationProps<
  TValues,
  TResponse extends ApiResponse<unknown> = ApiResponse<unknown>,
> = {
  mutationFn: (data: TValues) => Promise<TResponse>;
  onSuccess?: (response: TResponse) => void;
  onError?: (error: unknown) => void;
  defaultValues?: Partial<TValues>;
  schema: z.ZodType<TValues>;
};

export function useFormMutation<
  TValues,
  TResponse extends ApiResponse<unknown> = ApiResponse<unknown>,
>({
  mutationFn,
  onSuccess,
  onError,
  defaultValues,
  schema,
}: UseFormMutationProps<TValues, TResponse>) {
  const form = useAppForm({
    defaultValues: defaultValues as TValues,
    validators: { onDynamic: schema as z.ZodType<TValues, TValues> },
    validationLogic: revalidateLogic(),
    onSubmit: ({ value }: { value: TValues }) => {
      if (mutation.isPending) {
        return;
      }
      mutation.mutate(value);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    form.handleSubmit();
  };

  const resetForm = () => {
  form.reset();
};


  const CustomForm = ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => {
    return (
      <form className={className} noValidate onSubmit={handleSubmit}>
        {children}
      </form>
    );
  };

  const mutation = useMutation({
    mutationFn,
    onSuccess: (response: TResponse) => {
      if (!response.success) {
        toast.error(response.message);
        onError?.(response);
        return;
      }

      form.reset();
      const otp =
        process.env.NODE_ENV !== "production" &&
        response?.data &&
        typeof response.data === "object" &&
        "otp" in response.data
          ? (response.data as { otp?: string }).otp
          : undefined;

      toast.success(
        otp
          ? `${response.message} (OTP: ${otp})`
          : response.message || "Success"
      );

      onSuccess?.(response);
    },
    onError: (error) => {
      handleFormApiError({
        error,
        schema: schema as unknown as { shape: Record<string, unknown> },
        setFieldError: (field, message) => {
          form.setFieldMeta(field, (prev) => ({
            ...prev,
            errorMap: { onServer: { message } },
            errorSourceMap: { onServer: "field" },
          }));
        },
      });
      onError?.(error);
    },
  });

  return { form, mutation, CustomForm , resetForm };
}
