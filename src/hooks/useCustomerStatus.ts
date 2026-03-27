"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { customerApi } from "@/api/dashboard/customerApi";

type Params = {
  customerId: string;
  queryKey: string;
};

export function useAgencyStatus({ customerId, queryKey }: Params) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => customerApi.toggleCustomer(customerId),

    onSuccess: () => {
      toast.success("Status updated");
    },

    onSettled: () => {
  queryClient.invalidateQueries({
    queryKey: ["agencies-active"],
  });

  queryClient.invalidateQueries({
    queryKey: ["agencies-active", customerId],
  });
},


    onError: () => {
      toast.error("Failed to update status");
    },
  });

  return {
    toggle: mutation.mutate,
    isLoading: mutation.isPending,
  };
}
