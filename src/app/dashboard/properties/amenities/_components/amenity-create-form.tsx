"use client";

import { z } from "zod";
import { amenityApi } from "@/api/dashboard/amenityApi";
import { FormGrid } from "@/components/form/FormGrid";
import type { AddSheetFormProps } from "@/components/ui/data-table/actions/types/sheet-form-props";
import { SheetFormFooter } from "@/components/ui/sheet/sheet-form-layout";
import { useFormMutation } from "@/hooks/use-form-mutation";

const nameRegex = /^[\p{L}]+(?:\s[\p{L}]+)*$/u;

const AmenitySchema = z.object({
  name: z.object({
    en: z
      .string()
      .min(1, "Amenity (English) is required")
      .regex(nameRegex, "Name (EN) must contain only letters"),
    ar: z
      .string()
      .min(1, "Amenity (Arabic) is required")
      .regex(nameRegex, "Name (AR) must contain only letters"),
  }),
  icon: z.instanceof(File),
});

export type AmenityCreateFormData = z.infer<typeof AmenitySchema>;

export function AmenityCreateForm({ onSuccess }: AddSheetFormProps) {
  const { form, mutation, CustomForm, resetForm } =
    useFormMutation<AmenityCreateFormData>({
      mutationFn: (data) => amenityApi.createAmenity(data),
      schema: AmenitySchema,
      onSuccess,
      defaultValues: {
        name: {
          en: "",
          ar: "",
        },
        icon: null as unknown as File,
      },
    });

  return (
    <CustomForm className="py-4">
      <FormGrid className="px-6">
        <FormGrid.Item>
          <form.AppField name="name.en">
            {(field) => (
              <field.Input
                label="Amenity (EN)"
                placeholder="Enter amenity (English)"
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
                label="Amenity (AR)"
                placeholder="Enter amenity (Arabic)"
                required
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item span={"full"}>
          <form.AppField name="icon">
            {(field) => (
              <field.FileUploader
                accept="image/svg+xml"
                label="Icon"
                maxFiles={1}
                maxSize={0.5 * 1024 * 1024}
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
