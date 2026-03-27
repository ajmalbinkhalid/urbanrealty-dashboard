import type {
  PromiseApiResponse,
  PromiseDataTableApiResponse,
} from "@/types/api-response";
import type { TPurchase } from "@/types/purchase";
import { buildUrlParams, type DataTableQueryParams } from "@/utils/url-helper";
import AxiosClient from "../../utils/axios-config";

export const purchaseApi = {
  async getPurchasesTable({
    query,
  }: {
    query: DataTableQueryParams;
  }): PromiseDataTableApiResponse<TPurchase> {
    const response = await AxiosClient.get(
      `/purchases?${buildUrlParams(query)}`
    );
    return response.data;
  },

  async getPurchaseById(id: string) {
    const response = await AxiosClient.get(`purchases/${id}`);
    return response.data as {
      success: boolean;
      data: { purchase: TPurchase };
    };
  },

  async createPurchase(body: Partial<TPurchase>): PromiseApiResponse {
    const response = await AxiosClient.post("purchases", body);
    return response.data;
  },

  async updatePurchase(
    id: string,
    body: Partial<TPurchase>
  ): PromiseApiResponse {
    const response = await AxiosClient.put(`purchases/${id}`, body);
    return response.data;
  },

  async toggleStatus(id: string) {
    const response = await AxiosClient.patch(`purchases/${id}/status`);
    return response.data as { success: boolean; data: TPurchase };
  },

  async toggleFeatured(id: string) {
    const response = await AxiosClient.patch(`purchases/${id}/featured`);
    return response.data as { success: boolean; data: TPurchase };
  },

  async deletePurchase(id: string): PromiseApiResponse {
    const response = await AxiosClient.delete(`purchases/${id}`);
    return response.data;
  },
};
