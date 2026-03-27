export type TProperty = {
  _id: string;
  propertyCategoryId: string;
  ownerType: string;
  address?: string;
  totalFloor?: string;
  ownerName: string;
  propertyId: number;
  propertyInformation: {
    title: {
      en: string;
      ar: string;
    };
    address: string;
    description: {
      en: string;
      ar: string;
    };
    landmark: string;
    landmarkObject: {
      ar: string;
      en: string;
    };
    locationId: string;
    locationName: string;
    area: number;
    price: string; // kept as string because backend expects it as string
    possessionStatus: number; // could use enum: PossessionStatusEnum
    availableFrom?: string; // optional
    propertySubCategoryId: string;
    propertySubCategoryName: string;
    location: {
      type: "Point";
      coordinates: [number, number]; // [longitude, latitude]
    };
  };
  keyFeatures: {
    noOfBedroom: string;
    noOfBathroom: string;
    propertyAge: string;
    furnishing: string;
    totalFloor: string;
    floorNumber: string;
    customerShip: string;
    propertyCondition: string;
    zoneType: string;
    locationHub: string;
  };
  purpose: string;
  category: string;
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  landmark: {
    en: string;
    ar: string;
  };
  locationId: string;
  location: {
    latitude: number;
    longitude: number;
  };
  propertyTypeId?: string;
  possessionStatus: string;
  // availableFrom?: string | Date;
  area?: string;
  price?: string;
  amenities?: string[];
  amenitiesId?: string[];
  coverImage?: File;
  coverImagePath?: File | string;
  galleryImages?: string[];
  galleryImagePaths?: string[];

  status: number;
  isFeatured: boolean;
  createdBy?: string | null;
  createdAt: string;

  owner: {
    ownerName: string;
    ownerId: string;
    ownerEmail: string;
    ownerType: number;
  };
  ownerDetails: {
    name: string;
    ownerId: string;
    ownerEmail: string;
    ownerType: number;
  };
};
