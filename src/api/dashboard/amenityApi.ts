import type { TAmenitiesResponse, TAmenity } from "@/types/amenity";
import type {
  PromiseApiResponse,
  PromiseDataTableApiResponse,
} from "@/types/api-response";
import { buildUrlParams, type DataTableQueryParams } from "@/utils/url-helper";
import AxiosClient from "../../utils/axios-config";

export const amenityApi = {
  async createAmenity(body: {
    name: { en: string; ar: string };
    icon: File;
  }): PromiseApiResponse<TAmenity> {
    const formData = new FormData();
    formData.append("name.en", body.name.en);
    formData.append("name.ar", body.name.ar);
    formData.append("icon", body.icon);
    const response = await AxiosClient.post("amenities", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async getAmenitiesTable({
    query,
  }: {
    query: DataTableQueryParams;
  }): PromiseDataTableApiResponse<TAmenity> {
    const response = await AxiosClient.get(
      `/amenities?${buildUrlParams(query)}`
    );
    return response.data as PromiseDataTableApiResponse<TAmenity>;
  },

  async getAmenityById(
    id: string
  ): PromiseApiResponse<{ amenity: TAmenity } | null> {
    const response = await AxiosClient.get(`amenities/${id}`);
    return response.data;
  },

  async updateAmenity(
    id: string,
    body: { name: { en: string; ar: string }; icon?: File | null }
  ): PromiseApiResponse<TAmenity> {
    const formData = new FormData();
    formData.append("name.en", body.name.en);
    formData.append("name.ar", body.name.ar);
    if (body.icon) {
      formData.append("icon", body.icon);
    }
    const response = await AxiosClient.put(`amenities/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async toggleAmenity(id: string): PromiseApiResponse<TAmenity> {
    const response = await AxiosClient.patch(`amenities/${id}/status`);
    return response.data;
  },

  async deleteAmenity(id: string): PromiseApiResponse<TAmenity> {
    const response = await AxiosClient.delete(`amenities/${id}`);
    return response.data;
  },

  async getAmenities(): PromiseApiResponse<TAmenitiesResponse> {
    const response = await AxiosClient.get("amenities/all");
    return response.data;
  },
};
