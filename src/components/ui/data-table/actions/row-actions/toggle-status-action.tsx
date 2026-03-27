"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ConfirmDialog } from "../../components/confirm-dialog";
import { useRowLevelAction } from "../../context/data-table-action-context";
import type {
  RowActionPluginConfig,
  ToggleStatusActionConfig,
} from "../types/table-action-types";

/**
 * Toggle Status action plugin
 * Shows a switch and calls API mutation on toggle
 */
export function createToggleStatusAction<
  T extends { _id: string; status?: number | boolean },
>(
  config: ToggleStatusActionConfig<T>
): RowActionPluginConfig<T, ToggleStatusActionConfig<T>> {
  const actionId = "toggle-status";

  function Cell({ row }: { row: T }) {
    const { openAction } = useRowLevelAction<T>();
    // const { queryKey } = useRowLevelAction<T>();
    // const queryClient = useQueryClient();
    // const [isLoading, setIsLoading] = useState(false);

    // const toggleMutation = useMutation({
    //   mutationFn: () => config.toggleApi(row._id),
    //   onSuccess: () => {
    //     toast.success("Status updated");
    //     queryClient.invalidateQueries({ queryKey: [queryKey] });
    //   },
    // });

    // const handleToggle = async (_checked: boolean) => {
    //   setIsLoading(true);
    //   try {
    //     await toggleMutation.mutateAsync();
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };

    const isChecked = config.getChecked
      ? config.getChecked(row)
      : row.status === 1 || row.status === true;
    // const isDisabled =
    //   toggleMutation.isPending ||
    //   isLoading ||
    //   (config.disabled ? config.disabled(row) : false);

    return (
      <Tooltip delayDuration={300} open={false}>
        <TooltipTrigger asChild>
          <div>
            <Switch
              aria-label="Toggle status"
              checked={isChecked}
              className="cursor-pointer"
              // disabled={isDisabled}
              onCheckedChange={(checked) => {
                openAction(actionId, {
                  ...row,
                  _nextChecked: checked, // store intended state
                });
              }}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          Status: {isChecked ? "Active" : "Inactive"}
        </TooltipContent>
      </Tooltip>
    );
  }

  function Shared() {
    const { activeAction, activeRow, closeAction, queryKey } =
      useRowLevelAction<T>();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const isActive = activeAction === actionId && !!activeRow;
    const rowData = activeRow as any;
    const nextChecked = rowData?._nextChecked;

    const toggleMutation = useMutation({
      mutationFn: () => config.toggleApi(rowData._id),
      onSuccess: () => {
        toast.success("Status updated");
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        setOpen(false);
        closeAction();
      },
    });

    if (isActive && !open) setOpen(true);

    return (
      <ConfirmDialog
        confirmLabel={nextChecked ? "Activate" : "Deactivate"}
        isLoading={toggleMutation.isPending}
        message={
          nextChecked
            ? "Are you sure you want to activate this?"
            : "Are you sure you want to deactivate this?"
        }
        onCancel={() => {
          setOpen(false);
          closeAction();
        }}
        onConfirm={() => toggleMutation.mutate()}
        onOpenChange={() => {
          setOpen(false);
          closeAction();
        }}
        open={open && isActive}
        title={nextChecked ? "Activate?" : "Deactivate?"}
        variant={nextChecked ? "default" : "destructive"}
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
