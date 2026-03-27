"use client";

import Image from "next/image";
import { FormGrid } from "@/components/form/FormGrid";
import type { ViewSheetFormProps } from "@/components/ui/data-table/actions/types/sheet-form-props";
import type { TAmenity } from "@/types/amenity";

export function AmenityViewComponent({ data }: ViewSheetFormProps<TAmenity>) {
  return (
      <FormGrid className="py-4 grid grid-cols-2 gap-4 m-6 bg-page-background">
        <FormGrid.Item>
          <div className="space-y-1">
            <span className="font-medium text-xs">Amenity (EN)</span>
            <p className="text-muted-foreground text-xs">
              {data.name?.en || "—"}
            </p>
          </div>
        </FormGrid.Item>

        <FormGrid.Item>
          <div className="space-y-1">
            <span className="font-medium text-xs">Amenity (AR)</span>
            <p className="text-muted-foreground text-xs">
              {data.name?.ar || "—"}
            </p>
          </div>
        </FormGrid.Item>

        <FormGrid.Item>
          <div className="space-y-1">
            <span className="font-medium text-xs">Icon</span>
            {data.icon ? (
              <Image
                alt="amenity icon"
                className="h-16 w-16 rounded-md border object-contain text-xs"
                height={64}
                src={data.icon}
                width={64}
              />
            ) : (
              <p className="text-muted-foreground text-xs">—</p>
            )}
          </div>
        </FormGrid.Item>

        <FormGrid.Item>
          <div className="space-y-1">
            <span className="font-medium text-xs">Status</span>
            <p className="text-muted-foreground text-xs">
              {data.status === 1 ? "Active" : "Inactive"}
            </p>
          </div>
        </FormGrid.Item>

        <FormGrid.Item>
          <div className="space-y-1">
            <span className="font-medium text-xs">Created</span>
            <p className="text-muted-foreground text-xs">
              {data.createdAt
                ? new Date(data.createdAt).toLocaleDateString()
                : "—"}
            </p>
          </div>
        </FormGrid.Item>
      </FormGrid>
  );
}
