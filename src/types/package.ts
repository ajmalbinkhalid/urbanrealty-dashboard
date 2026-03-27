export type TPackage = {
  _id: string;
  type: string; // PackageTypeEnum.subscription | PackageTypeEnum.promotion
  subscriptionId: number;
  userType: string; // UserTypeEnum.agent | UserTypeEnum.customer
  name: {
    en: string;
    ar: string;
  };
  offerText?: {
    en: string;
    ar: string;
  };
  price: number;
  flatPrice?: number; // subscription only
  validity: number; // in days
  noOfProperties?: number; // subscription only
  noOfFeaturedProperty: number;
  status: number; // 0 = inactive, 1 = active
  createdAt?: string;
  createdBy?: string | null;
  updatedAt?: string;
  updatedBy?: string | null;
};
