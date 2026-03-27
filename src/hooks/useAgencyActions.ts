"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { agencyApi } from "@/api/dashboard/agencyApi";

export function useAgencyApproval(
  agencyId: string,
  queryKey: string
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: {
      status: "accept" | "reject";
      remarks?: string;
    }) =>
      agencyApi.updateVerificationStatus(agencyId, payload),

    onSuccess: (_, vars) => {
      toast.success(
        vars.status === "accept"
          ? "Agency accepted"
          : "Agency rejected"
      );
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });

  return {
    accept: () => mutation.mutate({ status: "accept" }),
    reject: (remarks: string) =>
      mutation.mutate({ status: "reject", remarks }),
    isLoading: mutation.isPending,
  };
}
