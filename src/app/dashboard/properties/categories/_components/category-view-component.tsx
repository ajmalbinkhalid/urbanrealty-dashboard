"use client";

import { FormGrid } from "@/components/form/FormGrid";
import type { ViewSheetFormProps } from "@/components/ui/data-table/actions/types/sheet-form-props";
import type { TCategory } from "@/types/category";
import { PropertyCategoryEnum } from "@/utils/enum";

export function CategoryViewComponent({ data }: ViewSheetFormProps<TCategory>) {
  const getCategoryLabel = (value: number) => {
    const entries = Object.entries(PropertyCategoryEnum);
    return entries.find(([, catValue]) => catValue === value)?.[0] ?? "—";
  };

  return (
      <FormGrid className="py-4 grid grid-cols-2 gap-4 m-6 bg-page-background">
        <FormGrid.Item>
          <div className="space-y-1">
            <span className="font-medium text-xs">Category</span>
            <p className="text-muted-foreground text-xs">
              {getCategoryLabel(data.propertyCategoryId)}
            </p>
          </div>
        </FormGrid.Item>

        <FormGrid.Item>
          <div className="space-y-1">
            <span className="font-medium text-xs">Subcategory (EN)</span>
            <p className="text-muted-foreground text-xs">
              {data.name?.en || "—"}
            </p>
          </div>
        </FormGrid.Item>

        <FormGrid.Item>
          <div className="space-y-1">
            <span className="font-medium text-xs">Subcategory (AR)</span>
            <p className="text-muted-foreground text-xs">
              {data.name?.ar || "—"}
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
