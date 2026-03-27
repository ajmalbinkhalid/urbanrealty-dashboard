"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { customerApi } from "@/api/dashboard/customerApi";
import { DBRowActions } from "@/components/ui/data-table/actions";
import { DataTable } from "@/components/ui/data-table/data-table";
import type { TCustomer } from "@/types/customer";
import { CustomerStatusToggle } from "./_components/CustomerStatusToggle";
import { CustomerEditForm } from "./_components/customer-edit-form";
import { CustomerViewComponent } from "./_components/customer-view-component";

const Page = () => {
  const columns = useMemo<ColumnDef<TCustomer>[]>(() => {
    return [
      {
        accessorKey: "userId",
        header: "Customer ID",
        cell: (info) => info.getValue() || "—",
      },
      {
        accessorKey: "firstName",
        header: "Name",
        cell: ({ row }) =>
          [row.original.firstName, row.original.lastName]
            .filter(Boolean)
            .join(" ") || "—",
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => info.getValue() || "—",
      },
    ];
  }, []);

  const viewAction = DBRowActions.view<TCustomer>({
    fetchApi: async (id) => {
      const response = await customerApi.getCustomerById(id);
      return { data: response?.data?.user };
    },
    title: "Customer",
    ViewForm: CustomerViewComponent,

    renderHeaderActions: ({ data, queryKey }) => (
      <CustomerStatusToggle
        checked={data.status === 1}
        customerId={data._id}
        queryKey={queryKey}
      />
    ),
  });

  const editAction = DBRowActions.edit<TCustomer>({
    fetchApi: async (id) => {
      const response = await customerApi.getCustomerById(id);
      return { data: response?.data?.user };
    },
    title: "Customer",
    updateApi: (id, data) => {
      return customerApi.updateCustomer(id, {
        firstName: data.firstName ?? "",
        lastName: data.lastName ?? "",
      });
    },
    EditForm: CustomerEditForm,
  });

  const toggleStatusAction = DBRowActions.toggleStatus<TCustomer>({
    toggleApi: customerApi.toggleCustomer,
    getChecked: (row) => row.status === 1,
  });

  const deleteAction = DBRowActions.delete<TCustomer>({
    deleteApi: customerApi.deleteCustomer,
  });

  return (
    <div>
      <DataTable
        actionPlugins={[
          toggleStatusAction,
          viewAction,
          editAction,
          deleteAction,
        ]}
        columns={columns}
        fetchApi={customerApi.getCustomersTable}
        queryKey="customers"
        searchPlaceholder="Search by Customer ID, name, email, mobile"
        title="Customers"
      />
    </div>
  );
};

export default Page;
