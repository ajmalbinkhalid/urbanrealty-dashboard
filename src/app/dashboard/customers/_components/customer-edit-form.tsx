"use client";

import { z } from "zod";
import { customerApi } from "@/api/dashboard/customerApi";
import { FormGrid } from "@/components/form/FormGrid";
import type { EditSheetFormProps } from "@/components/ui/data-table/actions/types/sheet-form-props";
import { SheetFormFooter } from "@/components/ui/sheet/sheet-form-layout";
import { useFormMutation } from "@/hooks/use-form-mutation";
import type { TCustomer } from "@/types/customer";

const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;

const CustomerEditSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .regex(nameRegex, "First name must contain only letters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .regex(nameRegex, "Last name must contain only letters"),
});

export type CustomerFormData = z.infer<typeof CustomerEditSchema>;

export function CustomerEditForm({
  data,
  onSuccess,
}: EditSheetFormProps<TCustomer>) {
  const { form, mutation, CustomForm } = useFormMutation<CustomerFormData>({
    mutationFn: (formData) =>
      customerApi.updateCustomer(data?._id ?? "", formData),
    schema: CustomerEditSchema,
    onSuccess,
    defaultValues: {
      firstName: data.firstName ?? "",
      lastName: data.lastName ?? "",
    },
  });

  const handleReset = () => {
    form.reset({
      firstName: "",
      lastName: "",
    });
  };

  return (
    <CustomForm className="py-4">
      <FormGrid className="px-6">
        <FormGrid.Item>
          <form.AppField name="firstName">
            {(field) => (
              <field.Input
                label="First Name"
                placeholder="Enter first name"
                required
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item>
          <form.AppField name="lastName">
            {(field) => (
              <field.Input
                label="Last Name"
                placeholder="Enter last name"
                required
              />
            )}
          </form.AppField>
        </FormGrid.Item>
      </FormGrid>
      <SheetFormFooter isPending={mutation.isPending} onReset={handleReset} />
    </CustomForm>
  );
}
