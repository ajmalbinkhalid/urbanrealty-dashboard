"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { locationApi } from "@/api/dashboard/locationApi";
import {
  DBRowActions,
  DBTableActions,
} from "@/components/ui/data-table/actions";
import type { TLocation } from "@/types/location";
import { DataTable } from "../../../components/ui/data-table/data-table";
import { LocationCreateForm } from "./_components/location-create-form";
import { LocationEditForm } from "./_components/location-edit-form";
import { LocationViewComponent } from "./_components/location-view-component";

const Page = () => {
  const columns = useMemo<ColumnDef<TLocation>[]>(() => {
    return [
      {
        accessorKey: "locationId",
        header: "Location ID",
        cell: (info) => info.getValue() || "—",
      },
      {
        accessorKey: "city.en",
        header: "City (EN)",
        cell: (info) => info.getValue() || "—",
      },
      {
        accessorKey: "city.ar",
        header: "(AR) مدينة",
        cell: (info) => info.getValue() || "—",
      },
    ];
  }, []);

  const createFormAction = DBTableActions.createForm({
    title: "Add Location",
    CreateForm: LocationCreateForm,
  });

  const viewAction = DBRowActions.view<TLocation>({
    fetchApi: async (id) => {
      const response = await locationApi.getLocationById(id);
      return { data: response?.data?.location };
    },
    title: "Location",
    ViewForm: LocationViewComponent,
  });

  const editAction = DBRowActions.edit<TLocation>({
    fetchApi: async (id) => {
      const response = await locationApi.getLocationById(id);
      return { data: response?.data?.location };
    },
    title: "Location",
    updateApi: (id, data) => {
      return locationApi.updateLocation(id, {
        city: {
          en: data.city?.en ?? "",
          ar: data.city?.ar ?? "",
        },
      });
    },
    EditForm: LocationEditForm,
  });

  const toggleStatusAction = DBRowActions.toggleStatus<TLocation>({
    toggleApi: locationApi.toggleLocation,
    getChecked: (row) => row.status === 1,
  });

  const deleteAction = DBRowActions.delete<TLocation>({
    deleteApi: locationApi.deleteLocation,
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
        fetchApi={locationApi.getLocationsTable}
        pageSize={10}
        queryKey="locations"
        searchPlaceholder="Search by city"
        tableActionPlugins={[createFormAction]}
        title="Locations"
      />
    </div>
  );
};

export default Page;
