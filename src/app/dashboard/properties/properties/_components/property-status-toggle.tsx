"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { propertyApi } from "@/api/dashboard/propertyApi";
import { ConfirmDialog } from "@/components/ui/data-table/components/confirm-dialog";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  propertyId: string;
  queryKey: string;
  isChecked: boolean;
};

export function PropertyStatusToggle({
  propertyId,
  queryKey,
  isChecked,
}: Props) {
  const [open, setOpen] = useState(false);
  const [nextChecked, setNextChecked] = useState<boolean | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => propertyApi.toggleStatus(propertyId),
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
                className="cursor-pointer"
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
            ? "Are you sure you want to activate this property?"
            : "Are you sure you want to deactivate this property?"
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
