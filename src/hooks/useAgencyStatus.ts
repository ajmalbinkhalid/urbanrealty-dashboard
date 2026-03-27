"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { agencyApi } from "@/api/dashboard/agencyApi";

type Params = {
  agencyId: string;
  queryKey: string;
};

export function useAgencyStatus({ agencyId, queryKey }: Params) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => agencyApi.toggleStatus(agencyId),

    onSuccess: () => {
      toast.success("Agency status updated");
    },

    onSettled: () => {
      // 🔑 table list
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });

      // 🔑 view modal
      queryClient.invalidateQueries({
        queryKey: [queryKey, agencyId],
      });
    },

    onError: () => {
      toast.error("Failed to update agency status");
    },
  });

  return {
    toggle: mutation.mutate,
    isLoading: mutation.isPending,
  };
}
