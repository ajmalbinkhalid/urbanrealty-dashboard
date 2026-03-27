"use client";

import { FormGrid } from "@/components/form/FormGrid";
import type { ViewSheetFormProps } from "@/components/ui/data-table/actions/types/sheet-form-props";
import type { TPurchase } from "@/types/purchase";

export function PurchaseViewComponent({ data }: ViewSheetFormProps<TPurchase>) {
  return (
    <div className="space-y-6 py-4">
      <FormGrid className="grid grid-cols-2 gap-4">
        <FormGrid.Item span="full">
          <div className="space-y-1">
            <span className="font-medium text-sm">Purchase ID</span>
            <p className="text-muted-foreground text-sm">
              {data.agencyId || "—"}
            </p>
          </div>
        </FormGrid.Item>

        <FormGrid.Item span="full">
          <div className="space-y-1">
            <span className="font-medium text-sm">User</span>
            <p className="text-muted-foreground text-sm">
              {data.packageName || "—"}
            </p>
          </div>
        </FormGrid.Item>

        <FormGrid.Item>
          <div className="space-y-1">
            <span className="font-medium text-sm">User Type</span>
            <p className="text-muted-foreground text-sm">
              {data.packageType || "—"}
            </p>
          </div>
        </FormGrid.Item>

        <FormGrid.Item>
          <div className="space-y-1">
            <span className="font-medium text-sm">Package name</span>
            <p className="text-muted-foreground text-sm">
              {data.price ? `$${data.price.toLocaleString()}` : "—"}
            </p>
          </div>
        </FormGrid.Item>

        <FormGrid.Item>
          <div className="space-y-1">
            <span className="font-medium text-sm">Package type</span>
            <p className="text-muted-foreground text-sm">
              {data.numberOfProperties || "—"}
            </p>
          </div>
        </FormGrid.Item>

        <FormGrid.Item>
          <div className="space-y-1">
            <span className="font-medium text-sm">PurchasedOn</span>
            <p className="text-muted-foreground text-sm capitalize">
              {data.status || "—"}
            </p>
          </div>
        </FormGrid.Item>

        <FormGrid.Item span="full">
          <div className="space-y-1">
            <span className="font-medium text-sm">Validity</span>
            <p className="text-muted-foreground text-sm">
              {data.purchaseDate
                ? new Date(data.purchaseDate).toLocaleDateString()
                : "—"}
            </p>
          </div>
        </FormGrid.Item>

        <FormGrid.Item span="full">
          <div className="space-y-1">
            <span className="font-medium text-sm">Price</span>
            <p className="text-muted-foreground text-sm">
              {data.expiryDate
                ? new Date(data.expiryDate).toLocaleDateString()
                : "—"}
            </p>
          </div>
        </FormGrid.Item>

        {data.verificationStatus && (
          <FormGrid.Item span="full">
            <div className="space-y-1">
              <span className="font-medium text-sm">Verification Status</span>
              <p className="text-muted-foreground text-sm capitalize">
                {data.verificationStatus}
              </p>
            </div>
          </FormGrid.Item>
        )}
      </FormGrid>
    </div>
  );
}
