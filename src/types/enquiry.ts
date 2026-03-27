export type TEnquiry = {
  _id: string;
  enquiryId: string;
  message: string;
  name: string;
  email: string;
  phone: {
    phoneCode: string;
    phoneNumber: string;
  };
  userId: string;
  createdBy: string;
  createdAt: string;
  [key: string]: unknown;
};
