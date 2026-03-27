"use client";

import { useQuery } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/data-table/components/confirm-dialog";
import SheetFormLayout from "@/components/ui/sheet/sheet-form-layout";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePropertyApproval } from "@/hooks/use-property-action";
import { useAgencyApproval } from "@/hooks/useAgencyActions";
import { useRowLevelAction } from "../../context/data-table-action-context";
import type {
  RowActionPluginConfig,
  ViewActionConfig,
} from "../types/table-action-types";

export function createViewAction<
  T extends { _id: string | number },
  X extends { _id: string | number } = T,
>(config: ViewActionConfig<X>): RowActionPluginConfig<T, ViewActionConfig<X>> {
  const actionId = "view";

  function Cell({ row }: { row: T }) {
    const { openAction } = useRowLevelAction<T>();

    return (
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            aria-label="View"
            onClick={() => openAction(actionId, row)}
            size="sm"
            variant="ghost"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>View</TooltipContent>
      </Tooltip>
    );
  }

  function Shared() {
    const { activeAction, activeRow, closeAction, queryKey } =
      useRowLevelAction<T>();

    const [open, setOpen] = useState(false);

    // Confirm dialog state
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmMode, setConfirmMode] = useState<"accept" | "reject" | null>(
      null
    );
    const [confirmAgencyId, setConfirmAgencyId] = useState<string | null>(null);

    const isActive = activeAction === actionId && !!activeRow;
    const entityType = config.entityType || "agency";
    const entityLabel =
      entityType.charAt(0).toUpperCase() + entityType.slice(1);

    const handleClose = () => {
      setOpen(false);
      closeAction();
    };

    // Open confirm dialog and close sheet
    const openConfirm = (mode: "accept" | "reject", agencyId: string) => {
      setConfirmMode(mode);
      setConfirmAgencyId(agencyId);
      setConfirmOpen(true);
      handleClose();
    };

    // Approval hook - dynamic based on entity type
    const agencyApproval = useAgencyApproval(confirmAgencyId ?? "", queryKey);
    const propertyApproval = usePropertyApproval(
      confirmAgencyId ?? "",
      queryKey
    );

    const approval =
      entityType === "property" ? propertyApproval : agencyApproval;
    const { accept, reject, isLoading: approvalLoading } = approval;

    const handleConfirm = async (remarks?: string) => {
      if (confirmMode === "accept") {
        await accept();
      }
      if (confirmMode === "reject") {
        await reject(remarks ?? "");
      }

      setConfirmOpen(false);
      setConfirmMode(null);
      setConfirmAgencyId(null);
    };

    const {
      data: rowData,
      isLoading,
      isError,
      refetch,
    } = useQuery({
      queryKey: [queryKey, activeRow?._id],
      queryFn: () => config.fetchApi(String(activeRow?._id ?? "")),
      enabled: isActive && open,
      placeholderData: (previousData) => previousData,
      select: (data) => data?.data,
    });

    if (isActive && !open) {
      setOpen(true);
    }

    const ViewComponent = config.ViewForm;

    const headerActions =
      rowData && config.renderHeaderActions
        ? config.renderHeaderActions({
            data: rowData,
            queryKey,
          })
        : undefined;

    return (
      <>
        <SheetFormLayout
          isEmpty={!rowData}
          isError={isError}
          isLoading={isLoading}
          onOpenChange={handleClose}
          onRetry={refetch}
          open={open && isActive}
          rightSlot={headerActions}
          title={`View ${config.title || "Item"}`}
        >
          {!!ViewComponent && rowData && (
            <ViewComponent data={rowData} onTriggerConfirm={openConfirm} />
          )}
        </SheetFormLayout>

        {/* Confirm Dialog OUTSIDE Sheet */}
        <ConfirmDialog
          isLoading={approvalLoading}
          message={
            confirmMode === "accept"
              ? `Are you sure you want to accept this ${entityType}?`
              : `Are you sure you want to reject this ${entityType}?`
          }
          onCancel={() => setConfirmOpen(false)}
          onConfirm={handleConfirm}
          onOpenChange={setConfirmOpen}
          open={confirmOpen}
          showRemarkInput={confirmMode === "reject"}
          title={
            confirmMode === "accept"
              ? `Accept ${entityLabel}?`
              : `Reject ${entityLabel}?`
          }
        />
      </>
    );
  }

  return {
    id: actionId,
    Cell,
    Shared,
    config,
  };
}
