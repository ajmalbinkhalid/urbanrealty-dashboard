import type {
  PromiseApiResponse,
  PromiseDataTableApiResponse,
} from "@/types/api-response";
import type { TCategory, TCategoryResponse } from "@/types/category";
import { buildUrlParams, type DataTableQueryParams } from "@/utils/url-helper";
import AxiosClient from "../../utils/axios-config";

export const categoryApi = {
  async createCategory(body: {
    propertyCategoryId: number;
    name: { en: string; ar: string };
  }): PromiseApiResponse<TCategory> {
    const response = await AxiosClient.post("categories", {
      ...body,
      propertyCategoryId: body.propertyCategoryId.toString(),
    });
    return response.data;
  },

  async getCategoriesTable({
    query,
  }: {
    query: DataTableQueryParams;
  }): PromiseDataTableApiResponse<TCategory> {
    const response = await AxiosClient.get(
      `/categories?${buildUrlParams(query)}`
    );
    return response.data as PromiseDataTableApiResponse<TCategory>;
  },

  async getCategoryById(
    id: string
  ): PromiseApiResponse<{ category: TCategory } | null> {
    const response = await AxiosClient.get(`categories/${id}`);
    return response.data;
  },

  async updateCategory(
    id: string,
    body: { name: { en: string; ar: string }; propertyCategoryId: number }
  ): PromiseApiResponse<TCategory> {
    const response = await AxiosClient.put(`categories/${id}`, {
      ...body,
      propertyCategoryId: body.propertyCategoryId.toString(),
    });
    return response.data;
  },

  async toggleCategory(id: string): PromiseApiResponse<TCategory> {
    const response = await AxiosClient.patch(`categories/${id}/status`);
    return response.data;
  },

  async deleteCategory(id: string): PromiseApiResponse<TCategory> {
    const response = await AxiosClient.delete(`categories/${id}`);
    return response.data;
  },

  async getCategories(): PromiseApiResponse<TCategoryResponse> {
    const response = await AxiosClient.get("categories/all");
    return response.data;
  },
};
