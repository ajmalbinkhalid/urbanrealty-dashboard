import type {
  PromiseApiResponse,
  PromiseDataTableApiResponse,
} from "@/types/api-response";
import type { TEnquiry } from "@/types/enquiry";
import { buildUrlParams, type DataTableQueryParams } from "@/utils/url-helper";
import AxiosClient from "../../utils/axios-config";

export const enquiryApi = {
  async getEnquiriesTable({
    query,
  }: {
    query: DataTableQueryParams;
  }): PromiseDataTableApiResponse<TEnquiry> {
    const response = await AxiosClient.get(
      `enquiries?${buildUrlParams(query)}`
    );
    return response.data;
  },

  async getEnquiryById(
    id: string
  ): PromiseApiResponse<{ enquiry: TEnquiry } | null> {
    const response = await AxiosClient.get(`enquiries/${id}`);
    return response.data;
  },

  async deleteEnquiry(id: string): PromiseApiResponse<TEnquiry> {
    const response = await AxiosClient.delete(`enquiries/${id}`);
    return response.data;
  },
};
