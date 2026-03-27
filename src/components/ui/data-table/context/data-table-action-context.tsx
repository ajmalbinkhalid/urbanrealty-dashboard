"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type RowLevelActionContextType<T> = {
  activeAction: string | null;
  activeRow: T | null;
  queryKey: string;
  openAction: (actionId: string, row: T) => void;
  closeAction: () => void;
  isActionActive: (actionId: string) => boolean;
};

export const RowLevelActionContext =
  createContext<RowLevelActionContextType<unknown> | null>(null);

export function useRowLevelAction<T = unknown>(): RowLevelActionContextType<T> {
  const ctx = useContext(RowLevelActionContext);
  if (!ctx) {
    throw new Error(
      "useRowLevelAction must be used inside DataTableActionProvider"
    );
  }
  return ctx as RowLevelActionContextType<T>;
}

export type TableLevelActionContextType = {
  activeAction: string | null;
  queryKey: string;
  openAction: (actionId: string) => void;
  closeAction: () => void;
  isActionActive: (actionId: string) => boolean;
};

export const TableLevelActionContext =
  createContext<TableLevelActionContextType | null>(null);

export function useTableLevelAction(): TableLevelActionContextType {
  const ctx = useContext(TableLevelActionContext);
  if (!ctx) {
    throw new Error(
      "useTableLevelAction must be used inside DataTableActionProvider"
    );
  }
  return ctx;
}

export type DataTableActionProviderProps = {
  children: ReactNode;
  queryKey: string;
};

export function DataTableActionProvider({
  children,
  queryKey,
}: DataTableActionProviderProps) {
  const [activeRowAction, setActiveRowAction] = useState<{
    actionId: string;
    row: unknown;
  } | null>(null);

  const [activeTableAction, setActiveTableAction] = useState<string | null>(
    null
  );

  const openRowAction = useCallback((actionId: string, row: unknown) => {
    setActiveRowAction({ actionId, row });
  }, []);

  const closeRowAction = useCallback(() => {
    setActiveRowAction(null);
  }, []);

  const isRowActionActive = useCallback(
    (actionId: string): boolean =>
      activeRowAction?.actionId === actionId && !!activeRowAction?.row,
    [activeRowAction]
  );

  const openTableAction = useCallback((actionId: string) => {
    setActiveTableAction(actionId);
  }, []);

  const closeTableAction = useCallback(() => {
    setActiveTableAction(null);
  }, []);

  const isTableActionActive = useCallback(
    (actionId: string): boolean => activeTableAction === actionId,
    [activeTableAction]
  );

  const rowActionValue = useMemo<RowLevelActionContextType<unknown>>(
    () => ({
      activeAction: activeRowAction?.actionId ?? null,
      activeRow: activeRowAction?.row ?? null,
      queryKey,
      openAction: openRowAction,
      closeAction: closeRowAction,
      isActionActive: isRowActionActive,
    }),
    [
      activeRowAction,
      queryKey,
      openRowAction,
      closeRowAction,
      isRowActionActive,
    ]
  );

  const tableActionValue = useMemo<TableLevelActionContextType>(
    () => ({
      activeAction: activeTableAction,
      queryKey,
      openAction: openTableAction,
      closeAction: closeTableAction,
      isActionActive: isTableActionActive,
    }),
    [
      activeTableAction,
      queryKey,
      openTableAction,
      closeTableAction,
      isTableActionActive,
    ]
  );

  return (
    <RowLevelActionContext.Provider value={rowActionValue}>
      <TableLevelActionContext.Provider value={tableActionValue}>
        {children}
      </TableLevelActionContext.Provider>
    </RowLevelActionContext.Provider>
  );
}
