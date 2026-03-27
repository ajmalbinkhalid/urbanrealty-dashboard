"use client";

import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useMemo } from "react";
import { propertyApi } from "@/api/dashboard/propertyApi";
import {
  DBRowActions,
  DBTableActions,
} from "@/components/ui/data-table/actions";
import { DataTable } from "@/components/ui/data-table/data-table";
import type { TProperty } from "@/types/property";
import {
  OwnerTypeEnum,
  PropertyCategoryEnum,
  PropertyPurposeEnum,
} from "@/utils/enum";
import { EnumHelper } from "@/utils/enum-key-by-value";
import { PropertyCreateForm } from "../_components/property-create-form";
import { PropertyEditForm } from "../_components/property-edit-form";
import { PropertyFeaturedToggle } from "../_components/property-featured-toggle";
import { PropertyStatusToggle } from "../_components/property-status-toggle";
import { PropertyViewComponent } from "../_components/property-view-component";

/* ------------------------------------------------------------------ */
/* helpers */
/* ------------------------------------------------------------------ */

type LocalizedText = { en: string; ar: string };

const normalizeText = (value?: Partial<LocalizedText>): LocalizedText => ({
  en: value?.en ?? "",
  ar: value?.ar ?? "",
});

const enumLabel = (enumObj: Record<string, number>, value?: number): string => {
  if (!value) {
    return "—";
  }

  const entry = Object.entries(enumObj).find(
    ([, enumValue]) => enumValue === value
  );

  return entry?.[0] ?? "—";
};

const extractGalleryFiles = (images?: (string | File)[]): File[] => {
  if (!Array.isArray(images)) {
    return [];
  }

  return images.filter((img): img is File => img instanceof File);
};

const extractGalleryPaths = (images?: (string | File)[]): string[] => {
  if (Array.isArray(images)) {
    return images.filter((img): img is string => typeof img === "string");
  }

  if (typeof images === "string") {
    return [images];
  }

  return [];
};

const buildBasePayload = (data: Partial<TProperty>) => ({
  purpose: Number(data.purpose),
  propertyCategoryId: Number(data.category),
  propertyInformation: {
    title: normalizeText(data.title),
    description: normalizeText(data.description),
    landmark: normalizeText(data.landmark),
    locationId: data.locationId ?? "",
    location: {
      latitude: data.location?.latitude ?? 0,
      longitude: data.location?.longitude ?? 0,
    },
    area: Number(data.area ?? 0),
    price: Number(data.price ?? 0),
    possessionStatus: Number(data.possessionStatus ?? 1),
    propertySubCategoryId: data.propertyTypeId ?? "",
  },
  coverImage:
    typeof data.coverImage === "string"
      ? undefined
      : (data.coverImage ?? undefined),
  galleryImages: extractGalleryFiles(data.galleryImages),
  galleryImagePaths: extractGalleryPaths(data.galleryImages),
});

const buildResidentialPayload = (
  base: ReturnType<typeof buildBasePayload>,
  data: Partial<TProperty>
) => ({
  ...base,
  keyFeatures: {
    noOfBedroom: Number(data.keyFeatures?.noOfBedroom ?? 0),
    noOfBathroom: Number(data.keyFeatures?.noOfBathroom ?? 0),
    propertyAge: Number(data.keyFeatures?.propertyAge ?? 0),
    furnishing: Number(data.keyFeatures?.furnishing ?? 1),
  },
  amenities: data.amenities ?? [],
});

const buildCommercialPayload = (
  base: ReturnType<typeof buildBasePayload>,
  data: Partial<TProperty>
) => ({
  ...base,
  keyFeatures: {
    totalFloor: Number(data.keyFeatures?.totalFloor ?? 0),
    floorNumber: Number(data.keyFeatures?.floorNumber ?? 0),
    propertyAge: Number(data.keyFeatures?.propertyAge ?? 0),
    customerShip: Number(data.keyFeatures?.customerShip ?? 1),
    propertyCondition: Number(data.keyFeatures?.propertyCondition ?? 1),
    zoneType: Number(data.keyFeatures?.zoneType ?? 1),
    locationHub: Number(data.keyFeatures?.locationHub ?? 1),
    furnishing: Number(data.keyFeatures?.furnishing ?? 1),
  },
  amenities: data.amenities ?? [],
});

/* ------------------------------------------------------------------ */
/* page */
/* ------------------------------------------------------------------ */

type PropertyRequestsProps = {
  showTableToolbar?: boolean;
  showTableFooter?: boolean;
};

export const PropertyRequests = ({
  showTableToolbar,
  showTableFooter,
}: PropertyRequestsProps) => {
  const columns = useMemo<ColumnDef<TProperty>[]>(
    () => [
      {
        accessorKey: "propertyId",
        header: "Property ID",
        cell: (info) => info.getValue() || "—",
      },
      {
        accessorKey: "propertyInformation.title",
        header: "Property Name",
        cell: (info) => info.getValue() || "—",
      },
      {
        accessorKey: "propertyInformation.propertySubCategoryName",
        header: "Type",
        cell: (info) => info.getValue() || "—",
      },
      {
        accessorKey: "propertyCategoryId",
        header: "Property Category",
        cell: (info) =>
          enumLabel(PropertyCategoryEnum, info.getValue() as number),
      },
      {
        accessorKey: "purpose",
        header: "Purpose",
        cell: (info) =>
          enumLabel(PropertyPurposeEnum, info.getValue() as number),
      },
      {
        accessorKey: "ownerType",
        header: "User",
        cell: (info) => {
          const row = info.row.original;
          const ownerDetails = row.ownerDetails;
          const ownerType = EnumHelper.getKeyName(
            OwnerTypeEnum,
            ownerDetails?.ownerType
          );
          const isAgency = ownerDetails?.ownerType === OwnerTypeEnum.Agency;
          return ownerDetails ? (
            <div className="flex flex-col gap-1">
              <span className="font-medium text-md">{ownerDetails.name}</span>
              <span
                className={
                  isAgency
                    ? "text-orange-500 text-sm"
                    : "text-muted-foreground text-sm"
                }
              >{`(${ownerType})`}</span>
            </div>
          ) : (
            "—"
          );
        },
      },
      {
        accessorKey: "subscription",
        header: "Subscription",
        cell: (info) => info.getValue() || "—",
      },
      {
        accessorKey: "propertyInformation.locationName",
        header: "Location",
        cell: (info) => info.getValue() || "—",
      },
      {
        accessorKey: "createdAt",
        header: "Posted On",
        cell: (info) => {
          const date = info.getValue() as string | undefined;

          if (!date) {
            return "—";
          }

          return dayjs(date).format("DD MMMM YYYY");
        },
      },
    ],
    []
  );

  const createFormAction = DBTableActions.createForm({
    title: "Add Property",
    CreateForm: PropertyCreateForm,
  });

  const viewAction = DBRowActions.view<TProperty>({
    fetchApi: async (id) => {
      const res = await propertyApi.getPropertyById(id);
      return { data: res.data?.property };
    },
    title: "Property",
    entityType: "property",
    ViewForm: (props) => <PropertyViewComponent {...props} page="active" />,
    renderHeaderActions: ({ data, queryKey }) => (
      <div className="flex gap-3">
        <PropertyStatusToggle
          isChecked={data.status === 1}
          propertyId={data._id}
          queryKey={queryKey}
        />
        <PropertyFeaturedToggle
          isChecked={data.isFeatured}
          propertyId={data._id}
          queryKey={queryKey}
        />
      </div>
    ),
  });

  const editAction = DBRowActions.edit<TProperty>({
    fetchApi: async (id) => {
      const res = await propertyApi.getPropertyById(id);
      return { data: res.data?.property };
    },
    updateApi: (id, data) => {
      const categoryId = Number(data.category);
      const basePayload = buildBasePayload(data);

      if (categoryId === PropertyCategoryEnum.Residential) {
        return propertyApi.updateProperty(
          id,
          buildResidentialPayload(basePayload, data)
        );
      }

      if (categoryId === PropertyCategoryEnum.Commercial) {
        return propertyApi.updateProperty(
          id,
          buildCommercialPayload(basePayload, data)
        );
      }

      return propertyApi.updateProperty(id, basePayload);
    },
    EditForm: PropertyEditForm,
  });

  const acceptRejectAction = DBRowActions.acceptReject<TProperty>({
    acceptApi: async (id: string) => {
      await propertyApi.updateVerificationStatus(id, {
        status: "accept",
      });
    },

    rejectApi: async (id: string, remarks: string) => {
      await propertyApi.updateVerificationStatus(id, {
        status: "reject",
        remarks, // from modal
      });
    },
    acceptDialogTitle: "Accept Property Request?",
    acceptDialogMessage:
      "Are you sure you want to Accept the Property request?",

    rejectDialogTitle: "Reject Property Request?",
    rejectDialogMessage:
      "Are you sure you want to Reject the Property request?",
  });

  const deleteAction = DBRowActions.delete<TProperty>({
    deleteApi: propertyApi.deleteProperty,
  });

  return (
    <DataTable
      actionPlugins={[acceptRejectAction, viewAction, editAction, deleteAction]}
      columns={columns}
      fetchApi={propertyApi.getPropertiesTable}
      fetchApiQueryParams={{ status: "pending" }}
      pageSize={10}
      queryKey="properties-pending"
      searchPlaceholder="Search by properties"
      showTableFooter={showTableFooter}
      showTableToolbar={showTableToolbar}
      tableActionPlugins={[createFormAction]}
      title="Property Requests"
    />
  );
};

export default PropertyRequests;
