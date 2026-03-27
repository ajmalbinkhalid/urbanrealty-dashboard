import type { PromiseApiResponse } from "@/types/api-response";
import type { TCms } from "@/types/cms";
import AxiosClient from "../../utils/axios-config";

const cmsFormData = (cmsData: TCms): FormData => {
  const formData = new FormData();

  if (!cmsData.type) {
    throw new Error("CMS type is required");
  }
  formData.append("type", cmsData.type);

  if (cmsData.pageTitle?.en) {
    formData.append("pageTitle.en", cmsData.pageTitle.en);
  }

  if (cmsData.pageTitle?.ar) {
    formData.append("pageTitle.ar", cmsData.pageTitle.ar);
  }

  if (cmsData.description?.en) {
    formData.append("description.en", cmsData.description.en);
  }

  if (cmsData.description?.ar) {
    formData.append("description.ar", cmsData.description.ar);
  }

  if (cmsData.title1?.title?.en) {
    formData.append("title1.title.en", cmsData.title1?.title?.en);
  }

  if (cmsData.title1?.title?.ar) {
    formData.append("title1.title.ar", cmsData.title1?.title?.ar);
  }

  if (cmsData.title1?.icon instanceof File) {
    formData.append("title1.icon", cmsData.title1?.icon);
  }

  if (cmsData.title2?.title?.en) {
    formData.append("title2.title.en", cmsData.title2?.title?.en);
  }

  if (cmsData.title2?.title?.ar) {
    formData.append("title2.title.ar", cmsData.title2?.title?.ar);
  }

  if (cmsData.title2?.icon instanceof File) {
    formData.append("title2.icon", cmsData.title2?.icon);
  }
  if (cmsData.title3?.title?.en) {
    formData.append("title3.title.en", cmsData.title3?.title?.en);
  }

  if (cmsData.title3?.title?.ar) {
    formData.append("title3.title.ar", cmsData.title3?.title?.ar);
  }

  if (cmsData.title3?.icon instanceof File) {
    formData.append("title3.icon", cmsData.title3?.icon);
  }
  if (cmsData.title4?.title?.en) {
    formData.append("title4.title.en", cmsData.title4?.title?.en);
  }

  if (cmsData.title4?.title?.ar) {
    formData.append("title4.title.ar", cmsData.title4?.title?.ar);
  }

  if (cmsData.title4?.icon instanceof File) {
    formData.append("title4.icon", cmsData.title4?.icon);
  }

  if (cmsData.image instanceof File) {
    formData.append("image", cmsData.image);
  }

  if (cmsData.createdAt) {
    formData.append("createdAt", cmsData.createdAt);
  }

  return formData;
};

export const cmsApi = {
  async getCms(type: "1" | "2" | "3" | "4"): PromiseApiResponse<TCms> {
    const response = await AxiosClient.get("cms", {
      params: { type },
    });
    return response.data;
  },

  async updateCms(
    body: Partial<TCms> & { type: "1" | "2" | "3" | "4" }
  ): PromiseApiResponse<TCms> {
    const isMultipart = body.type === "4";

    if (isMultipart) {
      const formData = cmsFormData(body as TCms & { type: string });
      const response = await AxiosClient.put("cms", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    }

    const response = await AxiosClient.put("cms", body);
    return response.data;
  },
};