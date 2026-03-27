"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/data-table/components/confirm-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRowLevelAction } from "../../context/data-table-action-context";
import type {
  DeleteActionConfig,
  RowActionPluginConfig,
} from "../types/table-action-types";

/**
 * Delete action plugin
 * Shows a confirmation dialog and deletes the row on confirm
 */
export function createDeleteAction<T extends { _id: string }>(
  config: DeleteActionConfig<T>
): RowActionPluginConfig<T, DeleteActionConfig<T>> {
  const actionId = "delete";

  function Cell({ row }: { row: T }) {
    const { openAction } = useRowLevelAction<T>();

    return (
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            aria-label="Delete"
            onClick={() => openAction(actionId, row)}
            size="sm"
            variant="ghost"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete</TooltipContent>
      </Tooltip>
    );
  }

  function Shared() {
    const { activeAction, activeRow, closeAction, queryKey } =
      useRowLevelAction<T>();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const isActive = activeAction === actionId && !!activeRow;

    const deleteMutation = useMutation({
      mutationFn: () => config.deleteApi(activeRow?._id || ""),
      onSuccess: () => {
        toast.success("Deleted successfully");
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        setOpen(false);
        closeAction();
      },
    });

    if (isActive && !open) {
      setOpen(true);
    }

    const handleConfirm = () => {
      deleteMutation.mutate();
    };

    const handleClose = () => {
      setOpen(false);
      closeAction();
    };

    return (
      <ConfirmDialog
        isLoading={deleteMutation.isPending}
        message={
          config.dialogMessage ||
          "Are you sure you want to delete this item? This action cannot be undone."
        }
        onCancel={handleClose}
        onConfirm={handleConfirm}
        onOpenChange={handleClose}
        open={open && isActive}
        title={config.dialogTitle || "Delete?"}
        variant="destructive"
        confirmLabel="Delete"
      />
    );
  }

  return {
    id: actionId,
    Cell,
    Shared,
    config,
  };
}
