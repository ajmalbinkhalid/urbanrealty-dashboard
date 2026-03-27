export type UserRole = "SUPER_ADMIN" | "ADMIN" | "AGENT" | "USER";

export type Permission =
  | "CREATE_PROPERTY"
  | "UPDATE_PROPERTY"
  | "DELETE_PROPERTY"
  | "APPROVE_PROPERTY"
  | "MANAGE_AGENCIES";

export type TAdmin = {
  adminId: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
};

export type TPassword = {
  oldPassword: string;
  newPassword: string;
  confirmedPassword: string;
};
