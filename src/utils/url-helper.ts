export const BaseUrl = new URL(
  process.env.NEXT_PUBLIC_BASE_URL as string
).toString();

export const StorageUrl = new URL(
  (process.env.NEXT_PUBLIC_STORAGE_URL as string) ||
    "https://stagingapi.urbanrealty-lb.com/"
).toString();

/**
 * Query parameters for data table API requests
 */
export type DataTableQueryParams = {
  page: number;
  pageSize: number;
  q?: string;
  sort?: string;
  filters?: Record<string, unknown>;
  [key: string]: unknown;
};

/**
 * Helper function to convert query parameters to URLSearchParams
 * Used by data table implementations in respective module API files
 */
export function buildUrlParams(query: DataTableQueryParams): URLSearchParams {
  return new URLSearchParams(
    Object.entries(query).reduce(
      (acc, [key, value]) => {
        if (value === undefined || value === null) {
          return acc;
        }

        if (typeof value === "object" && Object.keys(value).length === 0) {
          return acc;
        }

        acc[key] = String(value);
        return acc;
      },
      {} as Record<string, string>
    )
  );
}
