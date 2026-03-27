"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { propertyApi } from "@/api/dashboard/propertyApi";

type Params = {
  propertyId: string;
  queryKey: string;
};

export function usePropertyFeatured({ propertyId, queryKey }: Params) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => propertyApi.toggleFeatured(propertyId),

    onSuccess: () => {
      toast.success("Featured status updated");
    },

    onSettled: () => {
      // 1️⃣ refresh table list
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });

      // 2️⃣ refresh OPEN view modal
      queryClient.invalidateQueries({
        queryKey: [queryKey, propertyId],
      });
    },

    onError: () => {
      toast.error("Failed to update featured status");
    },
  });

  return {
    toggle: mutation.mutate,
    isLoading: mutation.isPending,
  };
}
