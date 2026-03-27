"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import SheetFormLayout from "@/components/ui/sheet/sheet-form-layout";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRowLevelAction } from "../../context/data-table-action-context";
import type {
  EditActionConfig,
  RowActionPluginConfig,
} from "../types/table-action-types";

export function createEditAction<T extends { _id: string }>(
  config: EditActionConfig<T>
): RowActionPluginConfig<T, EditActionConfig<T>> {
  const actionId = "edit";

  function Cell({ row }: { row: T }) {
    const { openAction } = useRowLevelAction<T>();

    return (
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            aria-label="Edit"
            onClick={() => openAction(actionId, row)}
            size="sm"
            variant="ghost"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Edit</TooltipContent>
      </Tooltip>
    );
  }

  function Shared() {
    const { activeAction, activeRow, closeAction, queryKey } =
      useRowLevelAction<T>();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const isActive = activeAction === actionId && !!activeRow;

    const {
      data: rowData,
      isLoading,
      isError,
      refetch,
    } = useQuery({
      queryKey: [queryKey, activeRow?._id],
      queryFn: () => config.fetchApi(activeRow?._id ?? ""),
      enabled: isActive && open,
      select: (data) => data?.data,
    });

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

    const EditFormComponent = config.EditForm;

    return (
      <SheetFormLayout
        isEmpty={!rowData}
        isError={isError}
        isLoading={isLoading}
        onOpenChange={handleClose}
        onRetry={refetch}
        open={open && isActive}
        title={`Edit ${config.title || "Item"}`}
      >
        {!!EditFormComponent && (
          <EditFormComponent
            // biome-ignore lint/style/noNonNullAssertion: Its safe because the component is only rendered when rowData is available
            data={rowData!}
            onSuccess={handleSuccess}
          />
        )}
      </SheetFormLayout>
    );
  }

  return {
    id: actionId,
    Cell,
    Shared,
    config,
  };
}
