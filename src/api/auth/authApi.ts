import type { LoginCredentials } from "@/contexts/auth-context";
import type { PromiseApiResponse } from "@/types/api-response";
import type { TAdmin } from "@/types/auth";
import AxiosClient from "../../utils/axios-config";

export const authApi = {
  async login(body: LoginCredentials): PromiseApiResponse<{
    accessToken: string;
    expiresIn: string;
    admin: TAdmin;
  }> {
    const response = await AxiosClient.post("auth/login", body);
    return response.data;
  },

  async validate(): PromiseApiResponse<{ admin: TAdmin }> {
    const response = await AxiosClient.get("auth/validate");
    return response.data;
  },

  async sendOtp(email: string): PromiseApiResponse<{
    sessionToken: string;
    otp: string;
    expiresAt: string;
  }> {
    const response = await AxiosClient.post("auth/request-otp", { email });
    return response.data;
  },

  verifyOtp: async ({
    otp,
    token,
  }: {
    otp: string;
    token: string;
  }): PromiseApiResponse<{
    sessionToken: string;
    user: object;
  }> => {
    const response = await AxiosClient.post(
      "auth/verify-otp",
      { otp },
      {
        headers: {
          authorization: `Bearer ${token}`, // Fixed: Added backticks for template literal
        },
      }
    );
    return response.data;
  },

  confirmPassword: async ({
    newPassword,
    confirmPassword,
    token,
  }: {
    newPassword: string;
    confirmPassword: string;
    token: string;
  }): PromiseApiResponse<object> => {
    const response = await AxiosClient.post(
      "/auth/reset-password",
      { newPassword, confirmPassword },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  resendOtp: async (
    token: string
  ): PromiseApiResponse<{
    sessionToken: string;
    otp: string;
    expiresAt: string;
  }> => {
    const response = await AxiosClient.post(
      "/auth/resend-otp",
      {},
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};
