"use client";

import { useQuery } from "@tanstack/react-query";
import { cmsApi } from "@/api/dashboard/cmsApi";
import type { TCmsListItems } from "@/types/cms";
import { DataTable } from "./cms-data-table";
import { columns } from "./columns";

const CMS_TYPES = [
  { type: "1", pageKey: "privacy-policy" },
  { type: "2", pageKey: "terms-and-conditions" },
  { type: "3", pageKey: "faq" },
  { type: "4", pageKey: "how-it-works" },
] as const;

export default function CmsClient() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["cms-list"],
    queryFn: async () => {
      const results = await Promise.all(
        CMS_TYPES.map(async ({ type, pageKey }) => {
          const res = await cmsApi.getCms(type);

          return {
            _id: type,
            pageId: res.data.pageId,
            pageKey,
            category: {
              en: res.data.pageTitle?.en ?? "-",
              ar: res.data.pageTitle?.ar ?? "-",
            },
          } as TCmsListItems;
        })
      );
      return results;
    },
  });

  if (isLoading) {
    return <div>Loading CMS…</div>;
  }

  return <DataTable columns={columns} data={data} />;
}
