"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRowLevelAction } from "../../context/data-table-action-context";
import type {
  RemarksActionConfig,
  RowActionPluginConfig,
} from "../types/table-action-types";

/**
 * Remarks action plugin
 * Hover-based, connected to RowLevelActionContext
 */
export function createRemarkAction<
  T extends {
    _id: string;
    remarks?: string | null;
  },
>(
  config: RemarksActionConfig<T>
): RowActionPluginConfig<T, RemarksActionConfig<T>> {
  const actionId = "remarks";

  function Cell({ row }: { row: T }) {
    const { openAction, closeAction, isActionActive } = useRowLevelAction<T>();

    const isDisabled = config.disabled ? config.disabled(row) : false;

    const remarkText =
      (config.getRemark?.(row) ?? row.remarks)?.trim() ||
      "No remarks available";

    const isActive = isActionActive(actionId);

    return (
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            aria-label="Remark"
            disabled={isDisabled}
            onMouseEnter={() => openAction(actionId, row)}
            onMouseLeave={closeAction}
            size="sm"
            variant="ghost"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground font-medium text-[13px] text-background leading-none">
              i
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="wrap-break-word mr-10 max-w-xs whitespace-normal bg-remarks-background p-4 text-left font-thin">
          <p className="pb-1 font-bold">Remarks</p>
          {remarkText}
        </TooltipContent>
      </Tooltip>
    );
  }

  function Shared() {
    return null;
  }

  return {
    id: actionId,
    Cell,
    Shared,
    config,
  };
}
