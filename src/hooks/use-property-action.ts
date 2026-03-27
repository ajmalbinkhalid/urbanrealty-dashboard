"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { propertyApi } from "@/api/dashboard/propertyApi";

export function usePropertyApproval(
  propertyId: string,
  queryKey: string
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: {
      status: "accept" | "reject";
      remarks?: string;
    }) =>
      propertyApi.updateVerificationStatus(propertyId, payload),

    onSuccess: (_, vars) => {
      toast.success(
        vars.status === "accept"
          ? "Property accepted"
          : "Property rejected"
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
