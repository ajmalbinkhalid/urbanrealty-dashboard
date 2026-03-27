"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { agencyApi } from "@/api/dashboard/agencyApi";
import { ConfirmDialog } from "@/components/ui/data-table/components/confirm-dialog";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  agencyId: string;
  queryKey: string;
  isChecked: boolean;
};

export function AgencyStatusToggle({ agencyId, queryKey, isChecked }: Props) {
  const [open, setOpen] = useState(false);
  const [nextChecked, setNextChecked] = useState<boolean | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => agencyApi.toggleStatus(agencyId),
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setOpen(false);
      setNextChecked(null);
    },
  });

  return (
    <>
      <div className="flex items-center">
        <Tooltip open={false}>
          <TooltipTrigger asChild>
            <div
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Switch
                checked={isChecked}
                className="cursor-pointer flex"
                disabled={mutation.isPending}
                onCheckedChange={(checked) => {
                  setNextChecked(checked);
                  setOpen(true);
                }}
              />
            </div>
          </TooltipTrigger>

          <TooltipContent>
            Status: {isChecked ? "Active" : "Inactive"}
          </TooltipContent>
        </Tooltip>
      </div>

      <ConfirmDialog
        confirmLabel={nextChecked ? "Activate" : "Deactivate"}
        isLoading={mutation.isPending}
        message={
          nextChecked
            ? "Are you sure you want to activate this?"
            : "Are you sure you want to deactivate this?"
        }
        onCancel={() => {
          setOpen(false);
          setNextChecked(null);
        }}
        onConfirm={() => mutation.mutate()}
        onOpenChange={(value) => {
          if (!value) {
            setOpen(false);
            setNextChecked(null);
          }
        }}
        open={open}
        title={nextChecked ? "Activate?" : "Deactivate?"}
        variant={nextChecked ? "default" : "destructive"}
      />
    </>
  );
}
