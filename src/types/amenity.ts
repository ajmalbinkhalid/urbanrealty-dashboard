export type TAmenity = {
  _id: string;
  name: {
    en: string;
    ar: string;
  };
  icon: string;
  status: number; // 0 = inactive, 1 = active
  createdBy: string;
  createdAt: string;
  [key: string]: unknown;
};

export type TAmenitiesResponse = {
  amenities: TAmenity[];
};
