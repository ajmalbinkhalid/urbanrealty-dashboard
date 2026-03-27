import type {
  AddSheetFormProps,
  EditSheetFormProps,
  ViewSheetFormProps,
} from "./sheet-form-props";

/**
 * Base interface for all row action plugins
 */
export type RowActionPluginConfig<T = unknown, P = unknown> = {
  id: string;
  config?: P;
  Cell: React.ComponentType<{ row: T }>;
  Shared: React.ComponentType<unknown>;
};

/**
 * Base interface for all table action plugins
 * Renders a button/component above the table and a shared dialog/sheet
 */
export type TableActionPluginConfig<P = unknown> = {
  id: string;
  config?: P;
  Button: React.ComponentType<unknown>;
  Shared: React.ComponentType<unknown>;
};

/**
 * Configuration for Create/Form action (table-level)
 */
export type CreateFormActionConfig<
  _T extends { _id?: string } = Record<string, unknown>,
> = {
  title?: string;
  CreateForm: React.ComponentType<AddSheetFormProps>;
};

/**
 * Configuration for Edit action
 */
export type EditActionConfig<T extends { _id: string }> = {
  fetchApi: (id: string) => Promise<{ data?: T }>;
  updateApi: (id: string, data: Partial<T>) => Promise<unknown>;
  title?: string;
  EditForm?: React.ComponentType<EditSheetFormProps<T>>;
};

/**
 * Configuration for Delete action
 */
export type DeleteActionConfig<_T extends { _id: string }> = {
  deleteApi: (id: string) => Promise<unknown>;
  dialogTitle?: string;
  dialogMessage?: string;
};

/**
 * Configuration for Toggle Status action
 */
export type ToggleStatusActionConfig<
  T extends { _id: string; status?: number | boolean },
> = {
  toggleApi: (id: string) => Promise<unknown>;
  getChecked?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
};

/**
 * Configuration for Toggle IsFeatured action
 */
export type ToggleIsFeaturedActionConfig<
  T extends { _id: string; isFeatured?: boolean },
> = {
  toggleApi: (id: string) => Promise<unknown>;
  getChecked?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
};

/**
 * Configuration for Remarks tooltip action
 */
export type RemarksActionConfig<
  T extends {
    _id: string;
    remarks?: string | null;
  },
> = {
  remarkApi?: (id: string) => Promise<unknown>;
  getRemark?: (row: T) => string | null | undefined;
  disabled?: (row: T) => boolean;
};

/**
 * Configuration for Accept/Reject action
 */
export type AcceptRejectActionConfig<_T extends { _id: string }> = {
  acceptApi: (id: string) => Promise<unknown>;
  rejectApi: (id: string, remarks: string) => Promise<unknown>;
  acceptDialogTitle?: string;
  acceptDialogMessage?: string;
  rejectDialogTitle?: string;
  rejectDialogMessage?: string;
};

/**
 * Configuration for View action
 */
export type ViewActionConfig<T extends { _id: string | number }> = {
  fetchApi: (id: string) => Promise<{ data?: T }>;
  title?: string;
  entityType?: string; // e.g., "agency", "property" for dialog messages
  ViewForm?: React.ComponentType<ViewSheetFormProps<T>>;

   renderHeaderActions?: (args: {
    data: T;
    queryKey: string;
  }) => React.ReactNode;
};
