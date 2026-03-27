"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { customerApi } from "@/api/dashboard/customerApi";
import { ConfirmDialog } from "@/components/ui/data-table/components/confirm-dialog";
import { Switch } from "@/components/ui/switch";

type Props = {
  customerId: string;
  queryKey: string;
  checked: boolean;
};

export function CustomerStatusToggle({ customerId, queryKey, checked }: Props) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => customerApi.toggleCustomer(customerId),
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setOpen(false);
    },
  });

  return (
    <>
      <div className="flex items-center">
        <Switch
          checked={checked}
          disabled={mutation.isPending}
          onCheckedChange={() => setOpen(true)}
        />
      </div>

      <ConfirmDialog
        isLoading={mutation.isPending}
        message="Are you sure you want to change the customer status?"
        onCancel={() => setOpen(false)}
        onConfirm={() => mutation.mutate()}
        onOpenChange={setOpen}
        open={open}
        title="Change Status?"
      />
    </>
  );
}
