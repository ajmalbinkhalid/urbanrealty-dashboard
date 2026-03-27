"use client";

import { Button } from "@/components/ui/button";

type Props = {
  agencyId: string;
  onTriggerConfirm?: (mode: "accept" | "reject", agencyId: string) => void;
};

export function AgencyApprovalActions({ agencyId, onTriggerConfirm }: Props) {
  return (
    <div className="flex gap-2">
      <Button
        className="h-8 w-18 rounded-xs bg-[#0030CE] text-white hover:bg-[#0030CE]/90"
        onClick={() => onTriggerConfirm?.("accept", agencyId)}
        size="sm"
      >
        Accept
      </Button>

      <Button
        className="h-8 w-18 rounded-xs"
        onClick={() => onTriggerConfirm?.("reject", agencyId)}
        size="sm"
        variant="outline"
      >
        Reject
      </Button>
    </div>
  );
}