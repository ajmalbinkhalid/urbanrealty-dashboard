/**
 * Type definitions for  Form components
 */

export type EditSheetFormProps<T extends { _id: string | number }> = {
  data: T;
  onSuccess: () => void;
};

export type AddSheetFormProps = {
  onSuccess: () => void;
};

export type ViewSheetFormProps<T extends { _id: string | number }> = {
  data: T;
  onTriggerConfirm?: (mode: "accept" | "reject", agencyId: string) => void;
  page?: "pending" | "rejected" | "active";
};
