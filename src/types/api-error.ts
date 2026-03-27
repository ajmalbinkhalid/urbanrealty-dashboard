export type ApiError = {
  status?: number;
  message: string;
  data?: unknown;
  isNetworkError: boolean;
  errors?: Record<string, string | string[]>;
};
