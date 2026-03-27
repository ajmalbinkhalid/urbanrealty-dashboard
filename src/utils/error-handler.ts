import type { ApiError } from "@/types/api-error";

export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "isNetworkError" in error
  );
};

export const handleFormApiError = <T extends string>({
  error,
  schema,
  setFieldError,
}: {
  error: unknown;
  schema?: { shape: Record<T, unknown> };
  setFieldError?: (field: T, message: string) => void;
}): boolean => {
  if (!isApiError(error)) {
    return false;
  }

  // 422 → field-level validation
  if (error.status === 422 && error.errors && setFieldError && schema) {
    for (const [field, message] of Object.entries(error.errors)) {
      setFieldError(field as T, String(message));
    }

    return true;
  }

  return false;
};
