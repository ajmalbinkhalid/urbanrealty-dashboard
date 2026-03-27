"use client";

import { useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { cmsApi } from "@/api/dashboard/cmsApi";
import { Button } from "@/components/ui/button";
import SheetFormLayout from "@/components/ui/sheet/sheet-form-layout";
import type { TCmsListItems } from "@/types/cms";
import { FaqEditForm } from "./faq-edit-form";
import { HowItWorksEditForm } from "./how-it-works-edit-form";
import { PrivacyPolicyEditForm } from "./privacy-policy-edit-form";
import { TermsEditForm } from "./terms-and-conditions-edit-form";

const CMS_PAGE_REGISTRY = {
  "privacy-policy": {
    title: "Privacy & Policy",
    type: "1",
    Form: PrivacyPolicyEditForm,
  },
  "terms-and-conditions": {
    title: "Terms & Conditions",
    type: "2",
    Form: TermsEditForm,
  },
  faq: {
    title: "FAQ",
    type: "3",
    Form: FaqEditForm,
  },
  "how-it-works": {
    title: "How It Works",
    type: "4",
    Form: HowItWorksEditForm,
  },
} as const;

export function CmsEditAction({ row }: { row: TCmsListItems }) {
  const [open, setOpen] = useState(false);

  const pageKey = row.pageKey as keyof typeof CMS_PAGE_REGISTRY;
  const pageConfig = CMS_PAGE_REGISTRY[pageKey];

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["cms", pageKey],
    queryFn: () => cmsApi.getCms(pageConfig.type),
    enabled: !!pageConfig && open,
    select: (res) => res.data,
  });

  if (!pageConfig) {
    return null;
  }

  return (
    <>
      <Button
        aria-label="Edit"
        onClick={() => setOpen(true)}
        size="sm"
        variant="ghost"
      >
        <Pencil className="h-4 w-4" />
      </Button>

      <SheetFormLayout
        isError={isError}
        isLoading={isLoading}
        onOpenChange={() => setOpen(false)}
        onRetry={refetch}
        open={open}
        title={`Edit ${pageConfig.title}`}
      >
        {data && (
          <pageConfig.Form data={data} onSuccess={() => setOpen(false)} />
        )}
      </SheetFormLayout>
    </>
  );
}
