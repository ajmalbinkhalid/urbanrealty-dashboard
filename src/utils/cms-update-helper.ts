// cms-update-helper.ts
export type CmsType = "1" | "2" | "3" | "4";

export function buildCmsUpdatePayload<T>(type: CmsType, data: T) {
  switch (type) {
    case "1":
      return {
        type,
        privacyPolicy: data,
      };

    case "2":
      return {
        type,
        termsAndConditions: data,
      };

    case "3":
      return {
        type,
        faq: data,
      };

    case "4":
      return {
        type,
        howItWorks: data,
      };
    default:
      throw new Error("Invalid CMS type");
  }
}
