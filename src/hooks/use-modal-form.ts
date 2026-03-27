import { useCallback, useState } from "react";
import { FormModeEnum } from "@/utils/enum";

type FormMode = (typeof FormModeEnum)[keyof typeof FormModeEnum];

/**
 * Modal form state combining open/closed, mode (create/edit), and selected data
 */
type ModalFormState<T> = {
  open: boolean;
  mode: FormMode;
  data: T | null;
};

/**
 * Generic hook for managing modal form state (create/edit operations)
 * Combines modal open/close state, form mode, and selected item data into a single state
 *
 * @template T - The data type being edited
 * @returns Object with modal state and handler functions
 *
 * @example
 * const { state, openAdd, openEdit, close, reset } = useModalForm<Location>();
 *
 * // Open add modal
 * const handleAdd = useCallback(() => {
 *   openAdd();
 * }, [openAdd]);
 *
 * // Open edit modal
 * const handleEdit = useCallback(async (id) => {
 *   const data = await api.getById(id);
 *   openEdit(data);
 * }, [openEdit]);
 *
 * // Use in form
 * <LocationForm
 *   open={state.open}
 *   mode={state.mode}
 *   initialData={state.data}
 *   onOpenChange={close}
 * />
 */
export function useModalForm<T extends { _id?: string }>() {
  const [state, setState] = useState<ModalFormState<T>>({
    open: false,
    mode: FormModeEnum.CREATE,
    data: null,
  });

  const openAdd = useCallback(() => {
    setState({
      open: true,
      mode: FormModeEnum.CREATE,
      data: null,
    });
  }, []);

  const openEdit = useCallback((data: T) => {
    setState({
      open: true,
      mode: FormModeEnum.EDIT,
      data,
    });
  }, []);

  const close = useCallback(() => {
    setState((prev) => ({
      ...prev,
      open: false,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      open: false,
      mode: FormModeEnum.CREATE,
      data: null,
    });
  }, []);

  return {
    state,
    openAdd,
    openEdit,
    close,
    reset,
  };
}
