import type { PromiseApiResponse } from "@/types/api-response";
import type { TGeneralSettings } from "@/types/generalSettings";
import AxiosClient from "../../utils/axios-config";

export const generalSettingsApi = {
  async getGeneralSettings(): PromiseApiResponse<{
    settings: TGeneralSettings;
  }> {
    const response = await AxiosClient.get("general-settings/");
    return response.data;
  },

  async updateGeneralSettings(body: {
    name: {
      en: string;
      ar: string;
    };
    about: {
      en: string;
      ar: string;
    };
    email: string;
    phone: {
      phoneCode: string;
      phoneNumber: string;
    };
    whatsapp: {
      phoneCode: string;
      phoneNumber: string;
    };
    logo?: File | null;
  }): PromiseApiResponse<TGeneralSettings> {
    const formData = new FormData();

    // name
    formData.append("name.en", body.name.en);
    formData.append("name.ar", body.name.ar);

    // about
    formData.append("about.en", body.about.en);
    formData.append("about.ar", body.about.ar);

    // email
    formData.append("email", body.email);

    // phone
    formData.append("phone.phoneCode", body.phone.phoneCode);
    formData.append("phone.phoneNumber", body.phone.phoneNumber);

    // whatsapp
    formData.append("whatsapp.phoneCode", body.whatsapp.phoneCode);
    formData.append("whatsapp.phoneNumber", body.whatsapp.phoneNumber);

    // logo (file)
    if (body.logo) {
      formData.append("logo", body.logo);
    }

    const response = await AxiosClient.patch("general-settings/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
};
