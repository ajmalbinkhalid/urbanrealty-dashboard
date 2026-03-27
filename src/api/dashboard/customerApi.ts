import type {
  PromiseApiResponse,
  PromiseDataTableApiResponse,
} from "@/types/api-response";
import type { TCustomer } from "@/types/customer";
import { buildUrlParams, type DataTableQueryParams } from "@/utils/url-helper";
import AxiosClient from "../../utils/axios-config";

export const customerApi = {
  async getCustomersTable({
    query,
  }: {
    query: DataTableQueryParams;
  }): PromiseDataTableApiResponse<TCustomer> {
    const response = await AxiosClient.get(`users?${buildUrlParams(query)}`);
    return response.data as PromiseDataTableApiResponse<TCustomer>;
  },

  async getCustomerById(
    id: string
  ): PromiseApiResponse<{ user: TCustomer } | null> {
    const response = await AxiosClient.get(`users/${id}`);
    return response.data;
  },

  async updateCustomer(
    id: string,
    body: {
      firstName: string;
      lastName: string;
    }
  ): PromiseApiResponse<TCustomer> {
    const response = await AxiosClient.put(`users/${id}`, body);
    return response.data;
  },

  async toggleCustomer(id: string): PromiseApiResponse<TCustomer> {
    const response = await AxiosClient.patch(`users/${id}/status`);
    return response.data;
  },

  async deleteCustomer(id: string): PromiseApiResponse<TCustomer> {
    const response = await AxiosClient.delete(`users/${id}`);
    return response.data;
  },
};
