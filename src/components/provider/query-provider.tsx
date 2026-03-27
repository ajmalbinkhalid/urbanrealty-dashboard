"use client";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { isApiError } from "@/utils/error-handler";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (!isApiError(error)) {
        toast.error("Unexpected error");
        return;
      }

      if (error.isNetworkError) {
        toast.error("Network error. Please check your connection.");
        return;
      }

      if (error.status && error.status >= 500) {
        toast.error(error.message);
        return;
      }

      if (error.status && error.status > 400 && error.status < 500) {
        toast.error(error.message);
      }
    },
  }),

  mutationCache: new MutationCache({
    onError: (error) => {
      if (!isApiError(error)) {
        toast.error("Unexpected error");
        return;
      }

      if (error.isNetworkError) {
        toast.error("Network error. Please try again.");
        return;
      }

      if (error.status && error.status === 400) {
        toast.error(error.message);
        return;
      }

      if (error.status && error.status >= 500) {
        toast.error(error.message);
        return;
      }

      if (error.status && error.status > 400 && error.status < 500) {
        toast.error(error.message);
      }
    },
  }),

  defaultOptions: {
    queries: {
      retry: (count, error) => {
        if (!isApiError(error)) {
          return false;
        }
        if (error.status && error.status < 500) {
          return false;
        }
        return count < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

type Props = {
  children: ReactNode;
};

const QueryProvider = ({ children }: Props) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

export default QueryProvider;
