"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { purchaseApi } from "@/api/dashboard/purchaseApi";
import { DBRowActions } from "@/components/ui/data-table/actions";
import { DataTable } from "@/components/ui/data-table/data-table";
import type { TPurchase } from "@/types/purchase";
import { PurchaseViewComponent } from "../_components/purchase-view-component";

const Purchases = () => {
  const columns = useMemo<ColumnDef<TPurchase>[]>(() => {
    return [
      {
        accessorKey: "purchaseId",
        header: "Purchase ID",
        cell: (info) => info.getValue() || "—",
      },
      {
        accessorKey: "user",
        header: "User",
        cell: (info) => info.getValue() || "—",
      },
      {
        accessorKey: "userType",
        header: "User type",
        cell: (info) => info.getValue() || "—",
      },
      {
        accessorKey: "package",
        header: "Package name",
        cell: (info) => info.getValue() || "—",
      },
      {
        accessorKey: "packageType",
        header: "Package type",
        cell: (info) => info.getValue() || "—",
      },
      {
        accessorKey: "purhcasedOn",
        header: "Purchased on",
        cell: (info) => info.getValue() || "—",
      },
      {
        accessorKey: "validity",
        header: "Validity",
        cell: (info) => info.getValue() || "—",
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: (info) => {
          const price = info.getValue() as number | undefined;
          return price ? `$${price.toLocaleString()}` : "—";
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => info.getValue() || "—",
      },
    ];
  }, []);

  const viewAction = DBRowActions.view<TPurchase>({
    fetchApi: async (id) => {
      const response = await purchaseApi.getPurchaseById(id);
      return { data: response?.data?.purchase };
    },
    title: "View Purchase",
    ViewForm: PurchaseViewComponent,
  });

  const toggleStatusAction = DBRowActions.toggleStatus<TPurchase>({
    toggleApi: purchaseApi.toggleStatus,
    getChecked: (row) => row.status === 1,
  });

  return (
    <DataTable
      actionPlugins={[toggleStatusAction, viewAction]}
      columns={columns}
      fetchApi={purchaseApi.getPurchasesTable}
      fetchApiQueryParams={{ status: "completed" }}
      pageSize={10}
      queryKey="purchases-completed"
      searchPlaceholder="Search purchases"
      title="Purchased Packages"
    />
  );
};

export default Purchases;
