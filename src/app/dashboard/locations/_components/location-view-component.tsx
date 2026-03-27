"use client";

import { FormGrid } from "@/components/form/FormGrid";
import type { TLocation } from "@/types/location";

export type LocationViewProps = {
  data: TLocation;
};

export function LocationViewComponent({ data }: LocationViewProps) {
  return (
    <FormGrid className="m-6 gap-4 bg-page-background py-4">
      <FormGrid.Item>
        <div className="space-y-1">
          <span className="font-medium text-xs">City (EN)</span>
          <p className="text-muted-foreground text-xs">
            {data.city?.en || "—"}
          </p>
        </div>
      </FormGrid.Item>

      <FormGrid.Item>
        <div className="space-y-1">
          <span className="font-medium text-xs">City (AR)</span>
          <p className="text-muted-foreground text-xs">
            {data.city?.ar || "—"}
          </p>
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
