export type TLocation = {
  locationId: string;
  _id: string;
  city: {
    en: string;
    ar: string;
  };
  cityRadius: string;
  status: number; // 0 = inactive, 1 = active
  createdBy: string | null;
  createdAt: string;
  [key: string]: unknown;
};

export type TLocationResponse = {
  locations: TLocation[];
};

