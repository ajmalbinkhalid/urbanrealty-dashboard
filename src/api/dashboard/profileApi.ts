import type { PromiseApiResponse } from "@/types/api-response";
import type { TAdmin, TPassword } from "@/types/auth";
import AxiosClient from "../../utils/axios-config";

export const profileApi = {
  async getProfile(): PromiseApiResponse<{ admin: TAdmin }> {
    const response = await AxiosClient.get("auth/profile");
    return response.data;
  },

  async getPassword(): PromiseApiResponse<{ admin: TPassword }> {
    const response = await AxiosClient.get("auth/profile");
    return response.data;
  },

  async updateProfile(body: { name: string }): PromiseApiResponse<TAdmin> {
    const response = await AxiosClient.post("auth/update-name", body);
    return response.data;
  },

  async updatePassword(body: {
    oldPassword: string;
    newPassword: string;
    confirmedPassword: string;
  }): PromiseApiResponse<TPassword> {
    const response = await AxiosClient.patch("auth/update-password", body);
    return response.data;
  },
};
