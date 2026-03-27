import type { TAgency, TAgencyLogsResponse } from "@/types/agency";
import type { PromiseApiResponse } from "@/types/api-response";
import AxiosClient from "../../utils/axios-config";

type PhonePayload = {
  phoneCode: string;
  phoneNumber?: string;
};

type AgencyFormBody = {
  firstName?: string;
  lastName?: string;
  email?: string;

  phone?: {
    phoneCode: string;
    phoneNumber: string;
  };

  companyName?: string;
  cRNumber?: string;
  companyEmail?: string;

  companyPhone?: PhonePayload;
  companyWhatsapp?: PhonePayload;

  about?: {
    en?: string;
    ar?: string;
  };

  logo?: File | null;
};

function appendIfDefined(formData: FormData, key: string, value?: string) {
  if (value) {
    formData.append(key, value);
  }
}

function appendRequiredPhone(
  formData: FormData,
  key: string,
  phone?: { phoneCode: string; phoneNumber: string }
) {
  if (!phone) {
    return;
  }

  formData.append(`${key}.phoneCode`, phone.phoneCode);
  formData.append(`${key}.phoneNumber`, phone.phoneNumber);
}

function appendOptionalPhone(
  formData: FormData,
  key: "companyPhone" | "companyWhatsapp",
  phone?: PhonePayload
) {
  if (!phone?.phoneNumber?.trim()) {
    return;
  }

  formData.append(`${key}.phoneCode`, phone.phoneCode);
  formData.append(`${key}.phoneNumber`, phone.phoneNumber);
}

function appendAbout(formData: FormData, about?: { en?: string; ar?: string }) {
  if (about?.en) {
    formData.append("about.en", about.en);
  }
  if (about?.ar) {
    formData.append("about.ar", about.ar);
  }
}

function appendFile(formData: FormData, key: string, file?: File | null) {
  if (file instanceof File) {
    formData.append(key, file);
  }
}

export const RejectedAgencyApi = {
  async getAgencyById(id: string): PromiseApiResponse<TAgencyLogsResponse> {
    const res = await AxiosClient.get(`rejected-agencies/${id}`);
    return res.data;
  },

  async updateAgency(
    id: string,
    body: AgencyFormBody
  ): PromiseApiResponse<TAgency> {
    const formData = new FormData();

    appendIfDefined(formData, "firstName", body.firstName);
    appendIfDefined(formData, "lastName", body.lastName);
    appendIfDefined(formData, "email", body.email);

    appendRequiredPhone(formData, "phone", body.phone);

    appendIfDefined(formData, "companyName", body.companyName);
    appendIfDefined(formData, "cRNumber", body.cRNumber);
    appendIfDefined(formData, "companyEmail", body.companyEmail);

    appendOptionalPhone(formData, "companyPhone", body.companyPhone);
    appendOptionalPhone(formData, "companyWhatsapp", body.companyWhatsapp);

    appendAbout(formData, body.about);
    appendFile(formData, "logo", body.logo);

    const response = await AxiosClient.put(
      `rejected-agencies/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data;
  },

  deleteAgency: async (id: string): PromiseApiResponse<TAgency> => {
    const res = await AxiosClient.delete(`rejected-agencies/${id}`);
    return res.data;
  },
};
