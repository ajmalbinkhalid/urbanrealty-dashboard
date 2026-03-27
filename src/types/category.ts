export type TCategory = {
  _id: string;
  name: {
    en: string;
    ar: string;
  };
  propertyCategoryId: number;
  status: number; // 0 = inactive, 1 = active
  createdBy?: string;
  createdAt?: string;
  [key: string]: unknown;
};

export type TCategoryResponse = {
  subCategories: TCategory[];
};
