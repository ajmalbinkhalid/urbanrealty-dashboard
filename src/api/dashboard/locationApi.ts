import type {
  PromiseApiResponse,
  PromiseDataTableApiResponse,
} from "@/types/api-response";
import type { TLocation, TLocationResponse } from "@/types/location";
import { buildUrlParams, type DataTableQueryParams } from "@/utils/url-helper";
import AxiosClient from "../../utils/axios-config";

export const locationApi = {
  async createLocation(body: {
    city: { en: string; ar: string };
  }): PromiseApiResponse<TLocation> {
    const response = await AxiosClient.post("locations", body);
    return response.data;
  },

  async getLocationsTable({
    query,
  }: {
    query: DataTableQueryParams;
  }): PromiseDataTableApiResponse<TLocation> {
    const response = await AxiosClient.get(
      `/locations?${buildUrlParams(query)}`
    );
    return response.data as PromiseDataTableApiResponse<TLocation>;
  },

  async getLocationById(
    id: string
  ): PromiseApiResponse<{ location: TLocation } | null> {
    const response = await AxiosClient.get(`locations/${id}`);
    return response.data;
  },

  async updateLocation(
    id: string,
    body: { city: { en: string; ar: string } }
  ): PromiseApiResponse<TLocation> {
    const response = await AxiosClient.put(`locations/${id}`, body);
    return response.data;
  },

  async toggleLocation(id: string): PromiseApiResponse<TLocation> {
    const response = await AxiosClient.patch(`locations/${id}/status`);
    return response.data;
  },

  async deleteLocation(id: string): PromiseApiResponse<TLocation> {
    const response = await AxiosClient.delete(`locations/${id}`);
    return response.data;
  },

  async getLocations(): PromiseApiResponse<TLocationResponse> {
      const response = await AxiosClient.get("locations/all");
      return response.data;
  },
};
