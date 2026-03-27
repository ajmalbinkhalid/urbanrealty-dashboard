"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRowLevelAction } from "../../context/data-table-action-context";
import type {
  RowActionPluginConfig,
  ToggleIsFeaturedActionConfig,
} from "../types/table-action-types";
import { ConfirmDialog } from "../../components/confirm-dialog";

/**
 * Toggle IsFeatured action plugin
 * Shows a button/icon and calls API mutation on click
 */
export function createToggleIsFeaturedAction<
  T extends { _id: string; isFeatured?: boolean },
>(
  config: ToggleIsFeaturedActionConfig<T>
): RowActionPluginConfig<T, ToggleIsFeaturedActionConfig<T>> {
  const actionId = "toggle-featured";

  function Cell({ row }: { row: T }) {
    const { openAction } = useRowLevelAction<T>();
    // const { queryKey } = useRowLevelAction<T>();
    // const queryClient = useQueryClient();
    // const [isLoading, setIsLoading] = useState(false);

    // const toggleMutation = useMutation({
    //   mutationFn: () => config.toggleApi(row._id),
    //   onSuccess: () => {
    //     toast.success("Featured status updated");
    //     queryClient.invalidateQueries({ queryKey: [queryKey] });
    //   },
    // });

    // const handleToggle = async () => {
    //   setIsLoading(true);
    //   try {
    //     await toggleMutation.mutateAsync();
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };

    const isChecked = config.getChecked
      ? config.getChecked(row)
      : row.isFeatured === true;
    const isDisabled = config.disabled ? config.disabled(row) : false;

    return (
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            aria-label="Toggle featured"
            disabled={isDisabled}
            onClick={() =>
              openAction(actionId, {
                ...row,
                _nextFeatured: !isChecked,
              })
            }

            size="sm"
            variant="ghost"
          >
            <Star
              className={`h-4 w-4 ${isChecked ? "fill-current text-yellow-500" : ""}`}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent color="#ec413d">
          {isChecked ? "Make it unfeatured" : "Make it featured"}
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
  const nextFeatured = rowData?._nextFeatured;

  const toggleMutation = useMutation({
    mutationFn: () => config.toggleApi(rowData._id),
    onSuccess: () => {
      toast.success("Featured status updated");
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setOpen(false);
      closeAction();
    },
  });

  if (isActive && !open) setOpen(true);

  return (
    <ConfirmDialog
      open={open && isActive}
      onOpenChange={() => {
        setOpen(false);
        closeAction();
      }}
      title={nextFeatured ? "Mark as Featured?" : "Remove Featured?"}
      message={
        nextFeatured
          ? "Are you sure you want to mark this item as featured?"
          : "Are you sure you want to remove this item from featured?"
      }
      confirmLabel={nextFeatured ? "Feature" : "Unfeature"}
      variant={nextFeatured ? "default" : "destructive"}
      isLoading={toggleMutation.isPending}
      onCancel={() => {
        setOpen(false);
        closeAction();
      }}
      onConfirm={() => toggleMutation.mutate()}
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
