export type TPurchase = {
  _id: string;
  agencyId: string;
  packageId: string;
  packageName: string;
  packageType: string;
  price: number;
  purchaseDate: string;
  expiryDate: string;
  status: number; // 0 = pending, 1 = completed, 2 = cancelled
  verificationStatus?: number; // 0 = pending, 1 = approved, 2 = rejected
  numberOfProperties: number;
  createdAt?: string;
  createdBy?: string | null;
};
