// ✅ DETAIL ITEM (edit form only)
export type TCms = TCmsListItems & {
  type?: "1" | "2" | "3" | "4";

  pageTitle?: {
    en?: string;
    ar?: string;
  };

  description?: {
    en?: string;
    ar?: string;
  };

  title1?: {
    title: { en: string; ar: string };
    icon?: File | string | null;
  };

  title2?: {
    title: { en: string; ar: string };
    icon?: File | string | null;
  };

  title3?: {
    title: { en: string; ar: string };
    icon?: File | string | null;
  };

  title4?: {
    title: { en: string; ar: string };
    icon?: File | string | null;
  };

  image?: File | string | null;
  createdAt?: string;
};

// ✅ LIST ITEM (table only)
export type TCmsListItems = {
  _id: string;
  pageId: string;
  category: {
    en: string;
    ar: string;
  };
  pageKey: "privacy-policy" | "terms-and-conditions" | "faq" | "how-it-works";
};
