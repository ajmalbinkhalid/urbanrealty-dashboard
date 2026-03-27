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
import { AgencyViewComponent } from "../_components/agency-view-component";

// import { AgencyStatusToggle } from "../_components/AgencyStatusToggle";
// import { AgencyFeaturedToggle } from "../_components/AgencyFeaturedToggle";
// import { AgencyEditForm } from "../_components/agency-edit-form";

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
    ViewForm: (props) => <AgencyViewComponent {...props} page="rejected" />,
    //  renderHeaderActions: ({ data, queryKey }) => {
    //       if (!data?.agency) {
    //         return null;
    //       }

    //       const { agency, isApproved } = data;

    //       return (
    //         <div className="flex gap-3">

    //           {isApproved && (
    //             <>
    //               <AgencyStatusToggle
    //                 agencyId={agency._id}
    //                 isChecked={agency.status === 1}
    //                 queryKey={queryKey}
    //               />

    //               <AgencyFeaturedToggle
    //                 agencyId={agency._id}
    //                 isChecked={agency.isFeatured}
    //                 queryKey={queryKey}
    //               />
    //             </>
    //           )}
    //         </div>
    //       );
    //     },
  });

  const remarkAction = DBRowActions.remarks<TAgency>({
    getRemark: (row) => row.verificationRejectMessage,
  });

  // const editAction = DBRowActions.edit<TAgency>({
  //   fetchApi: async (id) => {
  //     const response = await agencyApi.getAgencyById(id);
  //     return { data: response?.data?.agency };
  //   },
  //   title: "Agenycy",
  //   updateApi: (id, data) => {
  //     return agencyApi.updateAgency(id, {
  //       companyName: data.companyName ?? "",
  //       cRNumber: data.cRNumber ?? "",
  //       email: data.email ?? "",
  //       phone: {
  //         phoneCode: data.phone?.phoneCode ?? "",
  //         phoneNumber: data.phone?.phoneNumber ?? "",
  //       },
  //     });
  //   },
  //   EditForm: AgencyEditForm,
  // });

  // const toggleStatusAction = DBRowActions.toggleStatus<TAgency>({
  //   toggleApi: agencyApi.toggleStatus,
  //   getChecked: (row) => row.status === 1,
  // });

  // const deleteAction = DBRowActions.delete<TAgency>({
  //   deleteApi: agencyApi.deleteAgency,
  // });

  return (
    <DataTable
      actionPlugins={[remarkAction, viewAction]}
      columns={columns}
      fetchApi={agencyApi.getAgenciesTable}
      fetchApiQueryParams={{ status: "rejected" }}
      pageSize={10}
      queryKey="agencies-inactive"
      searchPlaceholder="Search by Agency ID, name, email, mobile"
      tableActionPlugins={[createFormAction]}
      title="Rejected Agencies"
    />
  );
};

export default Page;
