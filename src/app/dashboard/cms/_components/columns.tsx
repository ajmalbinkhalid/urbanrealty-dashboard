"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { TCmsListItems } from "@/types/cms";
import { CmsEditAction } from "./cms-edit-action";

export const columns: ColumnDef<TCmsListItems>[] = [
  {
    accessorKey: "pageId",
    header: "Pages ID",
  },
  {
    accessorKey: "category.en",
    header: "Category (EN)",
  },
  {
    accessorKey: "category.ar",
    header: () => (
      <div className="text-right" dir="rtl">
        Category (AR)
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="text-right" dir="rtl">
        {getValue<string>()}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="flex justify-end pr-2">{""}</div>,
    cell: ({ row }) => (
      <div className="flex justify-end pr-4">
        <CmsEditAction row={row.original} />
      </div>
    ),
  },
];
