"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { categoryApi } from "@/api/dashboard/categoryApi";
import {
  DBRowActions,
  DBTableActions,
} from "@/components/ui/data-table/actions";
import { DataTable } from "@/components/ui/data-table/data-table";
import type { TCategory } from "@/types/category";
import { PropertyCategoryEnum } from "@/utils/enum";
import { CategoryCreateForm } from "./_components/category-create-form";
import { CategoryEditForm } from "./_components/category-edit-form";
import { CategoryViewComponent } from "./_components/category-view-component";

const Page = () => {
  const columns = useMemo<ColumnDef<TCategory>[]>(() => {
    return [
      {
        accessorKey: "subCategoryId",
        header: "Category ID",
        cell: (info) => info.getValue() || "—",
      },
       {
        accessorKey: "name.en",
        header: "Sub category (EN)",
        cell: (info) => info.getValue() || "—",
      },
      {
        accessorKey: "name.ar",
        header: "Sub category (AR)",
        cell: (info) => info.getValue() || "—",
      },
      {
        accessorKey: "propertyCategoryId",
        header: "Category",
        cell: (info) => {
          const value = info.getValue() as number | undefined;
          if (!value) {
            return "—";
          }
          const entries = Object.entries(PropertyCategoryEnum);
          const categoryName = entries
            .find(([, catValue]) => catValue === value)
            ?.at(0);
          return categoryName ?? "—";
        },
      },
    ];
  }, []);

  const createFormAction = DBTableActions.createForm({
    title: "Add Category",
    CreateForm: CategoryCreateForm,
  });

  const viewAction = DBRowActions.view<TCategory>({
    fetchApi: async (id) => {
      const response = await categoryApi.getCategoryById(id);
      return { data: response?.data?.category };
    },
    title: "Category",
    ViewForm: CategoryViewComponent,
  });

  const editAction = DBRowActions.edit<TCategory>({
    fetchApi: async (id) => {
      const response = await categoryApi.getCategoryById(id);
      return { data: response?.data?.category };
    },
    title: "Category",
    updateApi: (id, data) => {
      return categoryApi.updateCategory(id, {
        propertyCategoryId: data.propertyCategoryId ?? 1,
        name: {
          en: data.name?.en ?? "",
          ar: data.name?.ar ?? "",
        },
      });
    },
    EditForm: CategoryEditForm,
  });

  const toggleStatusAction = DBRowActions.toggleStatus<TCategory>({
    toggleApi: categoryApi.toggleCategory,
    getChecked: (row) => row.status === 1,
  });

  const deleteAction = DBRowActions.delete<TCategory>({
    deleteApi: categoryApi.deleteCategory,
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
        fetchApi={categoryApi.getCategoriesTable}
        pageSize={10}
        queryKey="categories"
        searchPlaceholder="Search by category"
        tableActionPlugins={[createFormAction]}
        title="Categories"
      />
    </div>
  );
};

export default Page;
