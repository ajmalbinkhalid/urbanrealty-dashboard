export type TGeneralSettings = {
  _id: string;
  name: {
    en: string;
    ar: string;
  };
  about: {
    en: string;
    ar: string;
  };
  email: string;
  phone: {
    phoneCode: string;
    phoneNumber: string;
    _id?: string;
  };
  whatsapp: {
    phoneCode: string;
    phoneNumber: string;
    _id?: string;
  };
  logo: string;
  createdBy: string | null;
  createdAt: string;
};
