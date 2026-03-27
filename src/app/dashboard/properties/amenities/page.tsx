"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { amenityApi } from "@/api/dashboard/amenityApi";
import {
  DBRowActions,
  DBTableActions,
} from "@/components/ui/data-table/actions";
import { DataTable } from "@/components/ui/data-table/data-table";
import type { TAmenity } from "@/types/amenity";
import { AmenityCreateForm } from "./_components/amenity-create-form";
import { AmenityEditForm } from "./_components/amenity-edit-form";
import { AmenityViewComponent } from "./_components/amenity-view-component";

const Page = () => {
  const columns = useMemo<ColumnDef<TAmenity>[]>(() => {
    return [
      {
        accessorKey: "amenityId",
        header: "Amenities ID",
        cell: (info) => info.getValue() || "—",
      },
      {
        accessorKey: "name.en",
        header: "Amenities (EN)",
        cell: (info) => info.getValue() || "—",
      },
      {
        accessorKey: "name.ar",
        header: "(AR) المرافق",
        cell: (info) => info.getValue() || "—",
      },
    ];
  }, []);

  const createFormAction = DBTableActions.createForm({
    title: "Add Amenity",
    CreateForm: AmenityCreateForm,
  });

  const deleteAction = DBRowActions.delete<TAmenity>({
    deleteApi: amenityApi.deleteAmenity,
  });

  const editAction = DBRowActions.edit<TAmenity>({
    fetchApi: async (id) => {
      const response = await amenityApi.getAmenityById(id);
      return { data: response?.data?.amenity };
    },
    title: "Amenity",
    updateApi: (id, data) => {
      return amenityApi.updateAmenity(id, {
        name: {
          en: data.name?.en ?? "",
          ar: data.name?.ar ?? "",
        },
      });
    },
    EditForm: AmenityEditForm,
  });

  const toggleStatusAction = DBRowActions.toggleStatus<TAmenity>({
    toggleApi: amenityApi.toggleAmenity,
    getChecked: (row) => row.status === 1,
  });

  const viewAction = DBRowActions.view<TAmenity>({
    fetchApi: async (id) => {
      const response = await amenityApi.getAmenityById(id);
      return { data: response?.data?.amenity };
    },
    title: "Amenity",
    ViewForm: AmenityViewComponent,
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
        fetchApi={amenityApi.getAmenitiesTable}
        queryKey="amenities"
        searchPlaceholder="Search by amenities"
        tableActionPlugins={[createFormAction]}
        title="Amenities"
      />
    </div>
  );
};

export default Page;
