"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/data-table/components/confirm-dialog";
import { useRowLevelAction } from "../../context/data-table-action-context";
import type {
  AcceptRejectActionConfig,
  RowActionPluginConfig,
} from "../types/table-action-types";

type AcceptRejectAction = "accept" | "reject";

/**
 * Accept/Reject action plugin
 * Shows two buttons and confirmation dialogs for each action
 */
export function createAcceptRejectAction<T extends { _id: string }>(
  config: AcceptRejectActionConfig<T>
): RowActionPluginConfig<T, AcceptRejectActionConfig<T>> {
  const actionId = "accept-reject";
  function Cell({ row }: { row: T }) {
    const { openAction } = useRowLevelAction<T>();

    return (
      <div className="flex gap-2">
        <Button
          aria-label="Accept"
          className="bg-[#0030CE] text-white hover:bg-[#0030CE]/90"
          onClick={() => {
            openAction(actionId, { ...row, _actionType: "accept" });
          }}
          size="sm"
        >
          <p className="text-xs">Accept</p>
        </Button>
        <Button
          aria-label="Reject"
          onClick={() => {
            openAction(actionId, { ...row, _actionType: "reject" });
          }}
          size="sm"
          variant="outline"
        >
          <p className="text-muted-foreground text-xs">Reject</p>
        </Button>
      </div>
    );
  }

  function Shared() {
    const { activeAction, activeRow, closeAction, queryKey } =
      useRowLevelAction<T>();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const isActive = activeAction === actionId && !!activeRow;
    const activeRowData = activeRow as unknown as Record<string, unknown>;
    const actionType = activeRowData?._actionType as
      | AcceptRejectAction
      | undefined;

    const acceptMutation = useMutation({
      mutationFn: () => config.acceptApi((activeRowData._id as string) ?? ""),
      onSuccess: () => {
        toast.success("Request accepted");
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        setOpen(false);
        closeAction();
      },
    });

    const rejectMutation = useMutation({
      mutationFn: (remarks: string) =>
        config.rejectApi((activeRowData._id as string) ?? "", remarks),
      onSuccess: () => {
        toast.success("Request rejected");
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        setOpen(false);
        closeAction();
      },
    });

    // Handle dialog open/close
    if (isActive && !open) {
      setOpen(true);
    }

    const isLoading = acceptMutation.isPending || rejectMutation.isPending;

    const handleConfirm = (remarks: string | undefined) => {
      if (actionType === "accept") {
        acceptMutation.mutate();
      } else if (actionType === "reject") {
        rejectMutation.mutate(remarks ?? "");
      }
    };

    const handleClose = useCallback(() => {
      setOpen(false);
      closeAction();
    }, [closeAction]);

    const isAccept = actionType === "accept";
    const title = isAccept
      ? config.acceptDialogTitle || "Accept Request?"
      : config.rejectDialogTitle || "Reject Request?";
    const message = isAccept
      ? config.acceptDialogMessage || "Are you sure you want to accept this?"
      : config.rejectDialogMessage || "Are you sure you want to reject this?";

    return (
      <ConfirmDialog
        isLoading={isLoading}
        message={message}
        onCancel={handleClose}
        onConfirm={handleConfirm}
        onOpenChange={(newOpen) => !newOpen && handleClose()}
        onReset={handleClose}
        open={open && isActive}
        showRemarkInput={!isAccept}
        title={title}
        variant={isAccept ? "default" : "destructive"}
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
