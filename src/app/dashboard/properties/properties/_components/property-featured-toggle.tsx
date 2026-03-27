"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ConfirmDialog } from "@/components/ui/data-table/components/confirm-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { propertyApi } from "@/api/dashboard/propertyApi";
import { toast } from "sonner";

type Props = {
  propertyId: string;
  queryKey: string;
  isChecked: boolean;
};

export function PropertyFeaturedToggle({
  propertyId,
  queryKey,
  isChecked,
}: Props) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => propertyApi.toggleFeatured(propertyId),
    onSuccess: () => {
      toast.success("Featured status updated");
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setOpen(false);
    },
  });

   const tooltipText = isChecked
    ? "Make it unfeatured"
    : "Make it featured";

  const dialogTitle = isChecked
    ? "Remove Featured?"
    : "Mark as Featured?";

  const dialogMessage = isChecked
    ? "Are you sure you want to remove this property from featured?"
    : "Are you sure you want to mark this property as featured?";

  const confirmLabel = isChecked ? "Unfeature" : "Feature";

  return (
    <>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            disabled={mutation.isPending}
            aria-label="Toggle featured"
            onClick={() => setOpen(true)}
          >
            <Star
              className={`h-4 w-4 ${
                isChecked ? "fill-current text-yellow-500" : ""
              }`}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent color="#ec413d">
          {tooltipText}
        </TooltipContent>
      </Tooltip>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={dialogTitle}
        message={dialogMessage}
        confirmLabel={confirmLabel}
        variant={isChecked ? "destructive" : "default"}
        isLoading={mutation.isPending}
        onCancel={() => setOpen(false)}
        onConfirm={() => mutation.mutate()}
      />
    </>
  );
}
