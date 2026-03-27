import type {
  PromiseApiResponse,
  PromiseDataTableApiResponse,
} from "@/types/api-response";
import type { TPackage } from "@/types/package";
import { buildUrlParams, type DataTableQueryParams } from "@/utils/url-helper";
import AxiosClient from "../../utils/axios-config";

export type PackageCreatePayload = {
  type: number;
  userType: string;

  name: {
    en: string;
    ar: string;
  };

  price: number;
  validity: number;
  noOfProperties?: number;

  // ✅ optional (subscription-only)
  noOfFeaturedProperty: number;

  flatPrice?: number;
  offerText?: string
};

export const packageApi = {

  async createPackage(
    body: PackageCreatePayload
  ): PromiseApiResponse<TPackage> {
    const response = await AxiosClient.post("packages", body);
    return response.data;
  },

  async updatePackage(
    id: string,
    body: PackageCreatePayload
  ): PromiseApiResponse<TPackage> {
    const response = await AxiosClient.put(`packages/${id}`, body);
    return response.data;
  },

  async getPackagesTable({
    query,
  }: {
    query: DataTableQueryParams;
  }): PromiseDataTableApiResponse<TPackage> {
    const response = await AxiosClient.get(`packages?${buildUrlParams(query)}`);
    return response.data as PromiseDataTableApiResponse<TPackage>;
  },

  async getPackageById(
    id: string
  ): PromiseApiResponse<{ package: TPackage } | null> {
    const response = await AxiosClient.get(`packages/${id}`);
    return response.data;
  },

  async toggleStatus(id: string): PromiseApiResponse<TPackage> {
    const response = await AxiosClient.patch(`packages/${id}`);
    return response.data;
  },

  async deletePackage(id: string): PromiseApiResponse<TPackage> {
    const response = await AxiosClient.delete(`packages/${id}`);
    return response.data;
  },
};
