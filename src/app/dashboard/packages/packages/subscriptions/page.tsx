"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { packageApi } from "@/api/dashboard/packageApi";
import {
  DBRowActions,
  DBTableActions,
} from "@/components/ui/data-table/actions";
import { DataTable } from "@/components/ui/data-table/data-table";
import type { TPackage } from "@/types/package";
import { PackageTypeEnum, UserTypeEnum } from "@/utils/enum";
import { getPackageStyle } from "@/utils/package-style";
import { PackageCreateForm } from "../_components/package-create-form";
import { PackageEditForm } from "../_components/package-edit-form";

/* ------------------------------------------------------------------ */
/* helpers */
/* ------------------------------------------------------------------ */

type LocalizedText = { en: string; ar: string };

const normalizeText = (value?: Partial<LocalizedText>): LocalizedText => ({
  en: value?.en ?? "",
  ar: value?.ar ?? "",
});

const buildBasePayload = (data: Partial<TPackage>) => ({
  type: Number(data.type),
  userType: String(data.userType),
  name: normalizeText(data.name),
  validity: Number(data.validity ?? 0),
  price: Number(data.price ?? 0),
  noOfFeaturedProperty: Number(data.noOfFeaturedProperty ?? 0),
});

const buildSubscriptionPayload = (
  base: ReturnType<typeof buildBasePayload>,
  data: Partial<TPackage>
) => ({
  ...base,
  offerText: String(data.offerText),
  flatPrice: Number(data.flatPrice ?? 0),
  noOfProperties: Number(data.noOfProperties ?? 0),
});

/* ------------------------------------------------------------------ */
/* page */
/* ------------------------------------------------------------------ */

const Page = () => {
  const columns = useMemo<ColumnDef<TPackage>[]>(() => {
    return [
      {
        accessorKey: "subscriptionId",
        header: "Subscription ID",
        cell: (info) => info.getValue() || "—",
      },
      {
        accessorKey: "name",
        header: "Package name",
        cell: (info) => {
          const nameObj = info.getValue() as TPackage["name"] | undefined;
          const label = nameObj?.en;

          if (!label) {
            return "—";
          }

          const style = getPackageStyle(label);

          return (
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 font-medium text-xs ${style}`}
            >
              {label}
            </span>
          );
        },
      },
      {
        accessorKey: "userType",
        header: "User type",
        cell: (info) => {
          const value = info.getValue() as number | undefined;
          if (!value) {
            return "—";
          }
          const entries = Object.entries(UserTypeEnum);
          const userType = entries
            .find(([, typeValue]) => typeValue === value)
            ?.at(0);
          return userType ?? "—";
        },
      },
      {
        accessorKey: "validity",
        header: "Validity",
        cell: (info) => {
          const validity = info.getValue() as TPackage["validity"] | undefined;
          return validity ? `${validity} Days` : "—";
        },
      },
      {
        accessorKey: "noOfProperties",
        header: "No. of properties",
        cell: (info) => info.getValue() || "—",
      },
      {
        accessorKey: "noOfFeaturedProperty",
        header: "No. of featured properties",
        cell: (info) => info.getValue() || "—",
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: (info) => {
          const validity = info.getValue() as TPackage["price"] | undefined;
          return validity ? `£ ${validity}` : "—";
        },
      },
    ];
  }, []);

  const createFormAction = DBTableActions.createForm({
    title: "Create new",
    CreateForm: PackageCreateForm,
  });

  const editAction = DBRowActions.edit<TPackage>({
    fetchApi: async (id) => {
      const res = await packageApi.getPackageById(id);
      return { data: res.data?.package };
    },
    title: "Package",
    updateApi: (id, data) => {
      const type = Number(data.type);
      const basePayload = buildBasePayload(data);

      if (type === PackageTypeEnum.Subscription) {
        return packageApi.updatePackage(
          id,
          buildSubscriptionPayload(basePayload, data)
        );
      }

      return packageApi.updatePackage(id, basePayload);
    },
    EditForm: PackageEditForm,
  });

  const toggleStatusAction = DBRowActions.toggleStatus<TPackage>({
    toggleApi: packageApi.toggleStatus,
    getChecked: (row) => row.status === 1,
  });

  const deleteAction = DBRowActions.delete<TPackage>({
    deleteApi: packageApi.deletePackage,
  });

  return (
    <DataTable
      actionPlugins={[toggleStatusAction, editAction, deleteAction]}
      columns={columns}
      fetchApi={packageApi.getPackagesTable}
      fetchApiQueryParams={{ query: "subscription" }}
      pageSize={10}
      queryKey="subscription"
      searchPlaceholder="Search packages"
      showSearchSection={false}
      tableActionPlugins={[createFormAction]}
      title="subscription Packages"
    />
  );
};

export default Page;
