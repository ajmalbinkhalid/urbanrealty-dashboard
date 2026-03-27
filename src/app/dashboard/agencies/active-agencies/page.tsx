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
import { AgencyApprovalActions } from "../_components/AgencyApprovalActions";
import { AgencyFeaturedToggle } from "../_components/AgencyFeaturedToggle";
import { AgencyStatusToggle } from "../_components/AgencyStatusToggle";
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
    ViewForm: (props) => <AgencyViewComponent {...props} page="active" />,
    renderHeaderActions: ({ data, queryKey }) => {
      if (!data?.agency) {
        return null;
      }

      const { agency, isApproved } = data;

      return (
        <div className="flex h-full items-center gap-2">
          {!isApproved && <AgencyApprovalActions agencyId={agency._id} />}

          {isApproved && (
            <>
              <AgencyStatusToggle
                agencyId={agency._id}
                isChecked={agency.status === 1}
                queryKey={queryKey}
              />

              <AgencyFeaturedToggle
                agencyId={agency._id}
                isChecked={agency.isFeatured}
                queryKey={queryKey}
              />
            </>
          )}
        </div>
      );
    },
  });

  const editAction = DBRowActions.edit<TAgency>({
    fetchApi: async (id) => {
      const response = await agencyApi.getAgencyById(id);
      return { data: response?.data?.agency };
    },
    title: "Agenycy",
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

  const toggleStatusAction = DBRowActions.toggleStatus<TAgency>({
    toggleApi: agencyApi.toggleStatus,
    getChecked: (row) => row.status === 1,
  });

  const toggleFeaturedAction = DBRowActions.toggleFeatured<TAgency>({
    toggleApi: agencyApi.toggleFeatured,
    getChecked: (row) => row.isFeatured === true,
  });

  const deleteAction = DBRowActions.delete<TAgency>({
    deleteApi: agencyApi.deleteAgency,
  });

  return (
    <DataTable
      actionPlugins={[
        toggleStatusAction,
        toggleFeaturedAction,
        viewAction,
        editAction,
        deleteAction,
      ]}
      columns={columns}
      fetchApi={agencyApi.getAgenciesTable}
      fetchApiQueryParams={{ status: "active" }}
      pageSize={10}
      queryKey="agencies-active"
      searchPlaceholder="Search by Agency ID, name, email"
      tableActionPlugins={[createFormAction]}
      title="Active Agencies"
    />
  );
};

export default Page;
