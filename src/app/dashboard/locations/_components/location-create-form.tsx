"use client";

import { z } from "zod";
import { locationApi } from "@/api/dashboard/locationApi";
import { FormGrid } from "@/components/form/FormGrid";
import type { AddSheetFormProps } from "@/components/ui/data-table/actions/types/sheet-form-props";
import { SheetFormFooter } from "@/components/ui/sheet/sheet-form-layout";
import { useFormMutation } from "@/hooks/use-form-mutation";

const nameRegex = /^[\p{L}]+(?:\s[\p{L}]+)*$/u;

const LocationSchema = z.object({
  city: z.object({
    en: z
      .string()
      .nonempty("City (English) is required")
      .regex(nameRegex, "City (EN) must contain only letters"),
    ar: z
      .string()
      .nonempty("City (Arabic) is required")
      .regex(nameRegex, "City (AR) must contain only letters"),
  }),
});

export type LocationFormData = z.infer<typeof LocationSchema>;

export function LocationCreateForm({ onSuccess }: AddSheetFormProps) {
  const { form, mutation, CustomForm, resetForm } =
    useFormMutation<LocationFormData>({
      mutationFn: (data) => locationApi.createLocation(data),
      schema: LocationSchema,
      onSuccess,
      defaultValues: {
        city: {
          en: "",
          ar: "",
        },
      },
    });

  return (
    <CustomForm className="py-4">
      <FormGrid className="px-6">
        <FormGrid.Item span={1}>
          <form.AppField name="city.en">
            {(field) => (
              <field.Input
                label="City (EN)"
                placeholder="Enter city name"
                required
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item span={1}>
          <form.AppField name="city.ar">
            {(field) => (
              <field.Input
                dir="rtl"
                label="City (AR)"
                placeholder="Enter city name"
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
