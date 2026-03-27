"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { agencyApi } from "@/api/dashboard/agencyApi";

type Params = {
  agencyId: string;
  queryKey: string;
};

export function useAgencyFeatured({ agencyId, queryKey }: Params) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => agencyApi.toggleFeatured(agencyId),

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
        queryKey: [queryKey, agencyId],
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
