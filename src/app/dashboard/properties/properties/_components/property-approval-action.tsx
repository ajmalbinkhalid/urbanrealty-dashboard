"use client";

import { Button } from "@/components/ui/button";

type Props = {
  propertyId: string;
  onTriggerConfirm?: (mode: "accept" | "reject", propertyId: string) => void;
};

export function PropertyApprovalActions({ propertyId, onTriggerConfirm }: Props) {
  return (
    <div className="flex gap-2">
      <Button
        className="h-8 w-18 rounded-xs bg-[#0030CE] text-white hover:bg-[#0030CE]/90"
        onClick={() => onTriggerConfirm?.("accept", propertyId)}
        size="sm"
      >
        Accept
      </Button>

      <Button
        className="h-8 w-18 rounded-xs"
        onClick={() => onTriggerConfirm?.("reject", propertyId)}
        size="sm"
        variant="outline"
      >
        Reject
      </Button>
    </div>
  );
}
