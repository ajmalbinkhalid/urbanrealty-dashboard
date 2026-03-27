import { toast } from "sonner";
import type { PromiseDataTableApiResponse } from "@/types/api-response";
import type { DataTableQueryParams } from "@/utils/url-helper";

/**
 * Generic fetch API factory for data tables
 * Handles the standard response structure and provides typed data
 */
export function createDataTableFetchApi<T extends Record<string, unknown>>(
  apiMethod: (params: {
    query: DataTableQueryParams;
  }) => PromiseDataTableApiResponse<Record<string, unknown>>
) {
  return async ({
    query,
  }: {
    query: {
      page: number;
      pageSize: number;
      q?: string;
      sort?: string;
      filters?: Record<string, unknown>;
      [key: string]: unknown;
    };
  }): Promise<{ data: T[]; totalCount: number }> => {
    try {
      const response = await apiMethod({ query });

      if (!response) {
        toast.error("No response from server.");
        return { data: [], totalCount: 0 };
      }

      if (response.success && response.data) {
        return {
          data: response.data.items as T[],
          totalCount: response.data.totalCount,
        };
      }

      const message = response.message || "Failed to fetch data";
      toast.error(message);
      return { data: [], totalCount: 0 };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch data";
      toast.error(errorMessage);
      return { data: [], totalCount: 0 };
    }
  };
}
