import type {
  PromiseApiResponse,
  PromiseDataTableApiResponse,
} from "@/types/api-response";
import type { TProperty } from "@/types/property";
import { buildUrlParams, type DataTableQueryParams } from "@/utils/url-helper";
import AxiosClient from "../../utils/axios-config";

// Type for the API payload (after transformation from form data)
export type PropertyCreatePayload = {
  purpose: number;
  propertyCategoryId: string | number;
  propertyInformation: {
    title: { en: string; ar: string };
    description: { en: string; ar: string };
    landmark: { en: string; ar: string };
    locationId: string;
    location: { latitude: number; longitude: number };
    address?: string;
    area: number;
    price: number;
    possessionStatus: number;
    availableFrom?: string;
    propertySubCategoryId: string;
  };
  keyFeatures?: {
    noOfBedroom?: number;
    noOfBathroom?: number;
    propertyAge?: number;
    furnishing?: number;
    totalFloor?: number;
    floorNumber?: number;
    customerShip?: number;
    propertyCondition?: number;
    zoneType?: number;
    locationHub?: number;
  };
  amenities?: string[];
  coverImage?: File;
  galleryImages?: File[];
  galleryImagePaths?: string[];
};

export const propertyApi = {
  async createProperty(
    body: PropertyCreatePayload
  ): PromiseApiResponse<TProperty> {
    const formData = getPropertyFormData(body);
    const response = await AxiosClient.post("properties", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async updateProperty(
    id: string,
    body: PropertyCreatePayload
  ): PromiseApiResponse<TProperty> {
    const formData = getPropertyFormData(body);
    const response = await AxiosClient.patch(`properties/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async getPropertiesTable({
    query,
  }: {
    query: DataTableQueryParams;
    status?: string;
  }): PromiseDataTableApiResponse<TProperty> {
    const response = await AxiosClient.get(
      `properties?${buildUrlParams(query)}`
    );
    return response.data as PromiseDataTableApiResponse<TProperty>;
  },

  async getPropertyById(
    id: string
  ): PromiseApiResponse<{ property: TProperty } | null> {
    const response = await AxiosClient.get(`properties/${id}`);
    return response.data;
  },

  updateVerificationStatus: async (
    id: string,
    body: {
      status: "accept" | "reject";
      remarks?: string;
    }
  ): PromiseApiResponse<TProperty> => {
    const res = await AxiosClient.patch(
      `properties/${id}/verification-status`,
      body
    );
    return res.data;
  },

  toggleStatus: async (id: string): PromiseApiResponse<TProperty> => {
    const res = await AxiosClient.patch(`properties/${id}/status`);
    return res.data;
  },

  async toggleFeatured(id: string): PromiseApiResponse<TProperty> {
    const response = await AxiosClient.patch(`properties/${id}/featured`);
    return response.data;
  },

  async deleteProperty(id: string): PromiseApiResponse<TProperty> {
    const response = await AxiosClient.delete(`properties/${id}`);
    return response.data;
  },
};

// TODO -- give type
const getPropertyFormData = (propertyData: PropertyCreatePayload): FormData => {
  const formData = new FormData();

  formData.append("purpose", String(propertyData.purpose));

  formData.append(
    "propertyCategoryId",
    propertyData.propertyCategoryId.toString()
  );

  formData.append(
    "propertyInformation.address",
    propertyData.propertyInformation.address ?? ""
  );

  formData.append(
    "propertyInformation.title.en",
    propertyData.propertyInformation.title.en
  );

  formData.append(
    "propertyInformation.title.ar",
    propertyData.propertyInformation.title.ar
  );

  formData.append(
    "propertyInformation.description.en",
    propertyData.propertyInformation.description.en
  );

  formData.append(
    "propertyInformation.description.ar",
    propertyData.propertyInformation.description.ar
  );

  formData.append(
    "propertyInformation.landmark.en",
    propertyData.propertyInformation.landmark.en
  );

  formData.append(
    "propertyInformation.landmark.ar",
    propertyData.propertyInformation.landmark.ar
  );

  formData.append(
    "propertyInformation.locationId",
    propertyData.propertyInformation.locationId
  );

  formData.append(
    "propertyInformation.location.latitude",
    propertyData.propertyInformation.location.latitude.toString()
  );

  formData.append(
    "propertyInformation.location.longitude",
    propertyData.propertyInformation.location.longitude.toString()
  );

  if (propertyData.propertyInformation.propertySubCategoryId) {
    formData.append(
      "propertyInformation.propertySubCategoryId",
      propertyData.propertyInformation.propertySubCategoryId
    );
  }

  formData.append(
    "propertyInformation.possessionStatus",
    propertyData.propertyInformation.possessionStatus.toString()
  );

  if (propertyData.propertyInformation.availableFrom) {
    formData.append(
      "propertyInformation.availableFrom",
      propertyData.propertyInformation.availableFrom.toString()
    );
  }

  if (propertyData.propertyInformation.area) {
    formData.append(
      "propertyInformation.area",
      propertyData.propertyInformation.area.toString()
    );
  }

  if (propertyData.propertyInformation.price) {
    formData.append(
      "propertyInformation.price",
      propertyData.propertyInformation.price.toString()
    );
  }

  if (propertyData.keyFeatures?.propertyAge !== undefined) {
    formData.append(
      "keyFeatures.propertyAge",
      propertyData.keyFeatures.propertyAge.toString()
    );
  }

  if (propertyData.keyFeatures?.furnishing !== undefined) {
    formData.append(
      "keyFeatures.furnishing",
      propertyData.keyFeatures.furnishing.toString()
    );
  }

  if (propertyData.keyFeatures?.noOfBedroom) {
    formData.append(
      "keyFeatures.noOfBedroom",
      propertyData.keyFeatures.noOfBedroom.toString()
    );
  }

  if (propertyData.keyFeatures?.noOfBathroom) {
    formData.append(
      "keyFeatures.noOfBathroom",
      propertyData.keyFeatures.noOfBathroom.toString()
    );
  }

  if (propertyData.keyFeatures?.zoneType !== undefined) {
    formData.append(
      "keyFeatures.zoneType",
      propertyData.keyFeatures.zoneType.toString()
    );
  }

  if (propertyData.keyFeatures?.locationHub !== undefined) {
    formData.append(
      "keyFeatures.locationHub",
      propertyData.keyFeatures.locationHub.toString()
    );
  }

  if (propertyData.keyFeatures?.propertyCondition !== undefined) {
    formData.append(
      "keyFeatures.propertyCondition",
      propertyData.keyFeatures.propertyCondition.toString()
    );
  }

  if (propertyData.keyFeatures?.customerShip !== undefined) {
    formData.append(
      "keyFeatures.customerShip",
      propertyData.keyFeatures.customerShip.toString()
    );
  }

  if (propertyData.keyFeatures?.totalFloor) {
    formData.append(
      "keyFeatures.totalFloor",
      propertyData.keyFeatures.totalFloor.toString()
    );
  }

  if (propertyData.keyFeatures?.floorNumber) {
    formData.append(
      "keyFeatures.floorNumber",
      propertyData.keyFeatures.floorNumber.toString()
    );
  }

  if (propertyData.amenities) {
    for (const amenityId of propertyData.amenities) {
      formData.append("amenities", amenityId);
    }
  }

  if (propertyData.coverImage) {
    formData.append("coverImage", propertyData.coverImage);
  }

  if (propertyData.galleryImages) {
    for (const imageFile of propertyData.galleryImages) {
      formData.append("galleryImages[]", imageFile);
    }
  }

  if (propertyData.galleryImagePaths) {
    for (const filePath of propertyData.galleryImagePaths) {
      formData.append("galleryImagePaths", filePath);
    }
  }
  return formData;
};
