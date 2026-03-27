// export type AgencyStatus = "requests" | "active" | "inactive";

// export interface AgencyItem {
//   id: string;
//   name: string;
//   email: string;
//   mobile: string;
//   active: boolean;
//   featured?: boolean;
// }

export type TRejectionLog = {
  _id: string;
  agencyId: string;
  companyName: string;
  cRNumber: string;
  companyEmail: string;

  companyPhone: {
    phoneCode: string;
    phoneNumber: string;
  };

  firstName: string;
  lastName: string;

  verificationRejectMessage: string;

  status: number;

  createdBy: {
    actorType: number;
    actorId: string;
  };

  updatedBy: {
    actorType: number;
    actorId: string;
  };

  deletedBy: {
    actorType: number;
    actorId: string;
  } | null;

  createdAt: string;
  updatedAt: string;
};

export type TAgencyLogsResponse = {
  _id: string;
  agency: TAgency;
  rejectionHistory: TRejectionLog[];
  rejectionCount: number;
  isApproved: boolean;
  approval: {
    verifiedAt: Date;
  };
};

export type TAgency = {
  _id: string;
  agencyId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: {
    phoneCode: string;
    phoneNumber: string;
    _id?: string;
  };
  companyName: string;
  cRNumber: string;
  companyEmail: string;
  companyWhatsapp: {
    phoneCode: string;
    phoneNumber: string;
    _id?: string;
  };
  companyPhone: {
    phoneCode: string;
    phoneNumber: string;
    _id?: string;
  };
  about: {
    en: string;
    ar: string;
  };
  companyLogo: string;
  coverImage: string;
  status: number; // 0 = inactive, 1 = active
  verificationStatus?: number; // 1 = pending, 2 = rejected, 3 = verified
  isFeatured: boolean;
  remarks: string;
  verificationRejectMessage?: string | null;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string | null;
  [key: string]: unknown;
};
