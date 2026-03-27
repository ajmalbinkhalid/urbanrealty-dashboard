import type { PromiseApiResponse } from "@/types/api-response";
import type { THomeStats } from "@/types/home";
import AxiosClient from "../../utils/axios-config";

export const homeApi = {
  async homeStats(): PromiseApiResponse<THomeStats> {
    const response = await AxiosClient.get("home/stats");
    return response.data;
  },
};
