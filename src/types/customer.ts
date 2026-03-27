export type TCustomer = {
  _id: string;
  userId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: {
    phoneCode: string;
    phoneNumber: string;
  };
  status: number; // 0 = inactive, 1 = active
  createdBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
};
