"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { agencyApi } from "@/api/dashboard/agencyApi";
import {
  DBRowActions,
  DBTableActions,
} from "@/components/ui/data-table/actions";
import { DataTable } from "@/components/ui/data-table/data-table";
import type { TAgency, TAgencyLogsResponse } from "@/types/agency";
import { AgencyCreateForm } from "../_components/agency-create-form";
import { AgencyEditForm } from "../_components/agency-edit-form";
import { AgencyViewComponent } from "../_components/agency-view-component";

const Page = () => {
  const columns = useMemo<ColumnDef<TAgency>[]>(() => {
    return [
      {
        accessorKey: "agencyId",
        header: "Agency ID",
        cell: (info) => info.getValue() || "—",
      },
      {
        accessorKey: "companyName",
        header: "Name",
        cell: (info) => info.getValue() || "—",
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => info.getValue() || "—",
      },
      // {
      //   accessorKey: "phone",
      //   header: "Mobile",
      //   cell: (info) => {
      //     const phone = info.getValue() as TAgency["phone"] | undefined;
      //     return phone ? `${phone.phoneCode} ${phone.phoneNumber}` : "—";
      //   },
      // },
    ];
  }, []);

  const createFormAction = DBTableActions.createForm({
    title: "Create New",
    CreateForm: AgencyCreateForm,
  });

  const viewAction = DBRowActions.view<TAgency, TAgencyLogsResponse>({
    fetchApi: async (id) => {
      const response = await agencyApi.getAgencyById(id);
      return { data: response.data };
    },
    title: "Agency",
    ViewForm: (props) => <AgencyViewComponent {...props} page="pending" />,
  });

  const editAction = DBRowActions.edit<TAgency>({
    fetchApi: async (id) => {
      const response = await agencyApi.getAgencyById(id);
      return { data: response?.data?.agency };
    },
    title: "Agency",
    updateApi: (id, data) => {
      return agencyApi.updateAgency(id, {
        companyName: data.companyName ?? "",
        cRNumber: data.cRNumber ?? "",
        email: data.email ?? "",
        // phone: {
        //   phoneCode: data.phone?.phoneCode ?? "",
        //   phoneNumber: data.phone?.phoneNumber ?? "",
        // },
      });
    },
    EditForm: AgencyEditForm,
  });

  const acceptRejectAction = DBRowActions.acceptReject<TAgency>({
    acceptApi: async (id: string) => {
      await agencyApi.updateVerificationStatus(id, {
        status: "accept",
      });
    },

    rejectApi: async (id: string, remarks: string) => {
      await agencyApi.updateVerificationStatus(id, {
        status: "reject",
        remarks, // from modal
      });
    },
    acceptDialogTitle: "Accept Agency Request?",
    acceptDialogMessage: "Are you sure you want to Accept the Agency request?",

    rejectDialogTitle: "Reject Agency Request?",
    rejectDialogMessage: "Are you sure you want to Reject the Agency request?",
  });

  const deleteAction = DBRowActions.delete<TAgency>({
    deleteApi: agencyApi.deleteAgency,
  });

  return (
    <DataTable
      actionPlugins={[acceptRejectAction, viewAction, editAction, deleteAction]}
      columns={columns}
      fetchApi={agencyApi.getAgenciesTable}
      fetchApiQueryParams={{ status: "pending" }}
      pageSize={10}
      queryKey="agencies-pending"
      searchPlaceholder="Search by Agency ID, name, email, mobile"
      tableActionPlugins={[createFormAction]}
      title="Agency Requests"
    />
  );
};

export default Page;
