"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { propertyApi } from "@/api/dashboard/propertyApi";

type Params = {
  propertyId: string;
  queryKey: string;
};

export function usePropertyStatus({ propertyId, queryKey }: Params) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => propertyApi.toggleStatus(propertyId),

    onSuccess: () => {
      toast.success("Property status updated");
    },

    onSettled: () => {
      // 🔑 table list
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });

      // 🔑 view modal
      queryClient.invalidateQueries({
        queryKey: [queryKey, propertyId],
      });
    },

    onError: () => {
      toast.error("Failed to update property status");
    },
  });

  return {
    toggle: mutation.mutate,
    isLoading: mutation.isPending,
  };
}
