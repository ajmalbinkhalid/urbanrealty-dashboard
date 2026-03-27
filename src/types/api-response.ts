/**
 * Generic API response type for all non-table API endpoints
 */
export type ApiResponse<T = unknown> = {
  success: boolean;
  status: number;
  message: string;
  data: T;
};

export type PromiseApiResponse<T = unknown> = Promise<ApiResponse<T>>;

/**
 * Generic response type for all data table API endpoints
 */
export type DataTableApiResponse<T = unknown> = {
  success: boolean;
  status: number;
  message: string;
  data: {
    items: T[];
    totalCount: number;
    currentPage: number;
    pageSize: number;
  };
};

export type PromiseDataTableApiResponse<T> = Promise<DataTableApiResponse<T>>;
