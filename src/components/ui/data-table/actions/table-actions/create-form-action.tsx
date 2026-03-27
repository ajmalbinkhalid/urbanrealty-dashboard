"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import SheetFormLayout from "@/components/ui/sheet/sheet-form-layout";
import { useTableLevelAction } from "../../context/data-table-action-context";
import type {
  CreateFormActionConfig,
  TableActionPluginConfig,
} from "../types/table-action-types";

/**
 * Create Form action plugin
 * Shows a button above the table and opens a sheet with a create form
 */
export function createCreateFormAction<
  T extends { _id?: string } = Record<string, unknown>,
>(config: CreateFormActionConfig<T>): TableActionPluginConfig {
  const id = "create-form";

  function UiButton() {
    const { openAction } = useTableLevelAction();

    return (
      <Button onClick={() => openAction(id)}>
        <Plus className="h-4 w-4" />
        {config.title || "Add"}
      </Button>
    );
  }

  function Shared() {
    const { activeAction, closeAction, queryKey } = useTableLevelAction();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const isActive = activeAction === id;

    if (isActive && !open) {
      setOpen(true);
    }

    const handleClose = () => {
      setOpen(false);
      closeAction();
    };

    const handleSuccess = () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      handleClose();
    };

    return (
      <SheetFormLayout
        onOpenChange={handleClose}
        open={open}
        title={`${config.title || "Item"}`}
      >
        <config.CreateForm onSuccess={handleSuccess} />
      </SheetFormLayout>
    );
  }

  return { id, Button: UiButton, Shared };
}
