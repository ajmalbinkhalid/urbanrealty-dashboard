"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { enquiryApi } from "@/api/dashboard/enquiryApi";
import { DBRowActions } from "@/components/ui/data-table/actions";
import { DataTable } from "@/components/ui/data-table/data-table";
import type { TEnquiry } from "@/types/enquiry";
import { EnquiryViewComponent } from "./_components/enquiry-view-component";

const Page = () => {
  const columns = useMemo<ColumnDef<TEnquiry>[]>(() => {
    return [
      {
        accessorKey: "enquiryId",
        header: "Enquiry ID",
        cell: (info) => info.getValue() || "—",
      },
      {
        accessorKey: "message",
        header: "Message",
        cell: (info) => info.getValue() || "—",
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: (info) => info.getValue() || "—",
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => info.getValue() || "—",
      },
      {
        accessorKey: "phone",
        header: "Mobile",
        cell: (info) => {
          const phone = info.getValue() as TEnquiry["phone"] | undefined;
          return phone ? `${phone.phoneCode} ${phone.phoneNumber}` : "—";
        },
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: (info) => {
          const date = info.getValue() as string | undefined;
          return date ? new Date(date).toLocaleDateString() : "—";
        },
      },
    ];
  }, []);

  const deleteAction = DBRowActions.delete<TEnquiry>({
    deleteApi: enquiryApi.deleteEnquiry,
  });

  const viewAction = DBRowActions.view<TEnquiry>({
    fetchApi: async (id) => {
      const response = await enquiryApi.getEnquiryById(id);
      return { data: response?.data?.enquiry };
    },
    title: "Enquiry",
    ViewForm: EnquiryViewComponent,
  });

  return (
    <div>
      <DataTable
        actionPlugins={[viewAction, deleteAction]}
        columns={columns}
        fetchApi={enquiryApi.getEnquiriesTable}
        pageSize={10}
        queryKey="enquiries"
        searchPlaceholder="Search by name, email & mobile"
        title="Enquiries"
      />
    </div>
  );
};

export default Page;
