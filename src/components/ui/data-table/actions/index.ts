/**
 * Row & Table Action Plugins - plug-and-play components for DataTable
 *
 * Each action is self-contained and handles:
 * - API calls using TanStack React Query
 * - Loading and error states
 * - UI using shadcn components
 * - Query invalidation after successful actions
 *
 * Usage:
 * ```tsx
 * import { DBTableActions, DBRowActions } from '@/components/ui/data-table/actions';
 *
 * // Table-level action
 * const createAction = DBTableActions.createForm({
 *   title: "Add Location",
 *   CreateForm: LocationForm,
 * });
 *
 * // Row-level actions
 * const deleteAction = DBRowActions.delete({
 *   deleteApi: (id) => api.delete(id),
 * });
 * ```
 */

import { createAcceptRejectAction } from "./row-actions/accept-reject-action";
import { createDeleteAction } from "./row-actions/delete-action";
import { createEditAction } from "./row-actions/edit-action";
import { createRemarkAction } from "./row-actions/remarks-action";
import { createToggleIsFeaturedAction } from "./row-actions/toggle-is-featured-action";
import { createToggleStatusAction } from "./row-actions/toggle-status-action";
import { createViewAction } from "./row-actions/view-action";
import { createCreateFormAction } from "./table-actions/create-form-action";
/**
 * Table-level action factories
 * For actions that appear as buttons above the table
 */
export const DBTableActions = {
  createForm: createCreateFormAction,
};

/**
 * Row-level action factories
 * For actions that appear in table rows
 */
export const DBRowActions = {
  acceptReject: createAcceptRejectAction,
  delete: createDeleteAction,
  edit: createEditAction,
  toggleFeatured: createToggleIsFeaturedAction,
  toggleStatus: createToggleStatusAction,
  view: createViewAction,
  remarks: createRemarkAction,
};

export type {
  AcceptRejectActionConfig,
  CreateFormActionConfig,
  DeleteActionConfig,
  EditActionConfig,
  RemarksActionConfig,
  RowActionPluginConfig,
  TableActionPluginConfig,
  ToggleIsFeaturedActionConfig,
  ToggleStatusActionConfig,
  ViewActionConfig,
} from "./types/table-action-types";
