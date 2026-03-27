"use client";

import { z } from "zod";
import { categoryApi } from "@/api/dashboard/categoryApi";
import { FormGrid } from "@/components/form/FormGrid";
import type { AddSheetFormProps } from "@/components/ui/data-table/actions/types/sheet-form-props";
import { SheetFormFooter } from "@/components/ui/sheet/sheet-form-layout";
import { useFormMutation } from "@/hooks/use-form-mutation";
import { PropertyCategoryEnum } from "@/utils/enum";

const nameRegex = /^[\p{L}]+(?:\s[\p{L}]+)*$/u;

const CategorySchema = z.object({
  propertyCategoryId: z.number().min(1, "Property category is required"),
  name: z.object({
    en: z
      .string()
      .min(1, "Category (English) is required")
      .regex(nameRegex, "Name (EN) must contain only letters"),
    ar: z
      .string()
      .min(1, "Category (Arabic) is required")
      .regex(nameRegex, "Name (AR) must contain only letters"),
  }),
});

export type CategoryCreateFormData = z.infer<typeof CategorySchema>;

export function CategoryCreateForm({ onSuccess }: AddSheetFormProps) {
  const propertyCategories = Object.entries(PropertyCategoryEnum).map(
    ([label, value]) => ({
      label,
      value,
    })
  );

  const { form, mutation, CustomForm, resetForm } =
    useFormMutation<CategoryCreateFormData>({
      mutationFn: (data) => categoryApi.createCategory(data),
      schema: CategorySchema,
      onSuccess,
      defaultValues: {
        propertyCategoryId: 1,
        name: {
          en: "",
          ar: "",
        },
      },
    });

  return (
    <CustomForm className="py-4">
      <FormGrid className="px-6">
        <FormGrid.Item span={"full"}>
          <form.AppField name="propertyCategoryId">
            {(field) => (
              <field.Combobox
                label="Category"
                options={propertyCategories.map((cat) => ({
                  value: cat.value,
                  label: cat.label,
                }))}
                placeholder="Choose category"
                required
                searchPlaceholder="Search categories..."
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item>
          <form.AppField name="name.en">
            {(field) => (
              <field.Input
                label="Subcategory (EN)"
                placeholder="Enter subcategory"
                required
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item>
          <form.AppField name="name.ar">
            {(field) => (
              <field.Input
                dir="rtl"
                label="Subcategory (AR)"
                placeholder="Enter subcategory"
                required
              />
            )}
          </form.AppField>
        </FormGrid.Item>
      </FormGrid>

      <SheetFormFooter isPending={mutation.isPending} onReset={resetForm} />
    </CustomForm>
  );
}
