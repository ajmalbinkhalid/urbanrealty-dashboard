// form types
export const FormModeEnum = {
  CREATE: "create",
  EDIT: "edit",
};

export type TFormModeEnum = (typeof FormModeEnum)[keyof typeof FormModeEnum];

export type TFurnishingEnum =
  (typeof FurnishingEnum)[keyof typeof FurnishingEnum];

export type TPropertyConditionEnum =
  (typeof PropertyConditionEnum)[keyof typeof PropertyConditionEnum];

export type TPossessionStatusEnum =
  (typeof PossessionStatusEnum)[keyof typeof PossessionStatusEnum];

export type TCustomerShipEnum =
  (typeof CustomerShipEnum)[keyof typeof CustomerShipEnum];

export type TZoneTypeEnum = (typeof ZoneTypeEnum)[keyof typeof ZoneTypeEnum];

export type TLocationHubEnum =
  (typeof LocationHubEnum)[keyof typeof LocationHubEnum];

// owner types
export const OwnerTypeEnum = {
  Admin: 0,
  User: 1,
  Agency: 2,
} as const;

export type TOwnerTypeEnum = (typeof OwnerTypeEnum)[keyof typeof OwnerTypeEnum];

// package types
export const PackageTypeEnum = {
  Subscription: 1,
  Promotion: 2,
} as const;

export type TPackageTypeEnum =
  (typeof PackageTypeEnum)[keyof typeof PackageTypeEnum];

// package user types
export const UserTypeEnum = {
  Agent: 1,
  Customer: 2,
} as const;

export const PropertyCategoryEnum = {
  Residential: 1,
  Commercial: 2,
  Land: 3,
} as const;

export const PropertyPurposeEnum = {
  Sell: 1,
  Rent: 2,
} as const;

export const FurnishingEnum = {
  Unfurnished: 1,
  Semi_Furnished: 2,
  Fully_Furnished: 3,
} as const;

export const CustomerShipEnum = {
  Running: 1,
  Vacant: 2,
} as const;

export const PossessionStatusEnum = {
  Ready: 1,
  In_Progress: 2,
} as const;

export const PropertyConditionEnum = {
  Well_Maintained: 1,
  Needs_Renovation: 2,
  Under_Renovation: 3,
} as const;

export const ZoneTypeEnum = {
  Residential: 1,
  Commercial: 2,
  Industrial: 3,
  IT: 4,
  Mixed: 5,
  Agricultural: 6,
} as const;

export const LocationHubEnum = {
  Main_Road: 1,
  Inner_Road: 2,
  Highway: 3,
  Mall: 4,
  Commercial_Complex: 5,
  IT_Park: 6,
  Residential_Area: 7,
  Industrial_Area: 8,
  Market_Area: 9,
  Business_District: 10,
} as const;

export const VerificationStatusEnum = {
  Draft: 0,
  Published: 1,
  Rejected: 2,
  Verification_Pending: 3,
} as const;

export type TUserTypeEnum = (typeof UserTypeEnum)[keyof typeof UserTypeEnum];
