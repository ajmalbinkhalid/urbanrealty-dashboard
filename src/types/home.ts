export type THomeStats = {
  _id: string;
  properties: number;
  propertiesForSale: number;
  propertiesForRent: number;
  users: number;
  agencies: number;
  [key: string]: unknown;
};

export type TLocationResponse = {
  home: THomeStats[];
};
