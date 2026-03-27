"use client";

import { z } from "zod";
import { agencyApi } from "@/api/dashboard/agencyApi";
import { FormGrid } from "@/components/form/FormGrid";
import type { AddSheetFormProps } from "@/components/ui/data-table/actions/types/sheet-form-props";
import { SheetFormFooter } from "@/components/ui/sheet/sheet-form-layout";
import { useFormMutation } from "@/hooks/use-form-mutation";

// const phoneNumberRegex = /^[0-9]+$/;
const optionalPhoneNumber = z.preprocess(
  (val) => (val === "" ? undefined : val),
  z
    .string()
    .regex(/^[0-9]+$/, "Phone number must contain only digits")
    .optional()
);

const nameRegex = /^[A-Za-z\u0600-\u06FF]+(?: [A-Za-z\u0600-\u06FF]+)*$/;

const AgencySchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .regex(nameRegex, "First name can contain only Arabic or English letters"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .regex(nameRegex, "Last name can contain only Arabic or English letters"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  // phone: z
  //   .object({
  //     phoneCode: z.string(),
  //     phoneNumber: z
  //       .string()
  //       .min(1, "Phone number is required")
  //       .regex(phoneNumberRegex, "Phone number must contain only digits"),
  //   })
  //   .required(),
  companyName: z.string().min(1, "Company name is required"),
  cRNumber: z.string().min(1, "CR Number is required"),
  companyEmail: z.string().email("Invalid email").or(z.literal("")).optional(),
  companyPhone: z.object({
    phoneCode: z.string(),
    phoneNumber: optionalPhoneNumber,
  }),
  companyWhatsapp: z.object({
    phoneCode: z.string(),
    phoneNumber: optionalPhoneNumber,
  }),
  about: z.object({
    en: z.string().optional(),
    ar: z.string().optional(),
  }),
  companyLogo: z.preprocess(
    (val) => (val === null ? undefined : val),
    z
      .instanceof(File)
      .refine(
        (file) => file.size <= 2 * 1024 * 1024,
        "Company logo must be less than or equal to 2 MB"
      )
      .optional()
  ),

  coverImage: z.preprocess(
    (val) => (val === null ? undefined : val),
    z
      .instanceof(File)
      .refine(
        (file) => file.size <= 2 * 1024 * 1024,
        "Cover Image must be less than or equal to 2 MB"
      )
      .optional()
  ),
});

export type AgencyCreateFormData = z.infer<typeof AgencySchema>;

export function AgencyCreateForm({ onSuccess }: AddSheetFormProps) {
  const { form, mutation, CustomForm, resetForm } =
    useFormMutation<AgencyCreateFormData>({
      mutationFn: (formData) => agencyApi.createAgency(formData),
      schema: AgencySchema,
      onSuccess,
      defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
        // phone: {
        //   phoneCode: "+91",
        //   phoneNumber: "",
        // },
        companyName: "",
        cRNumber: "",
        companyEmail: "",
        companyPhone: {
          phoneCode: "+91",
          phoneNumber: "",
        },
        companyWhatsapp: {
          phoneCode: "+91",
          phoneNumber: "",
        },
        about: {
          en: "",
          ar: "",
        },
        companyLogo: null as unknown as File,
        coverImage: null as unknown as File,
      },
    });

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

        <FormGrid.Item>
          <form.AppField name="email">
            {(field) => (
              <field.Input
                label="Email"
                placeholder="Enter email address"
                required
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        {/* <FormGrid.Item>
          <form.AppField name="phone">
            {(field) => <field.Phone label="Phone" required />}
          </form.AppField>
        </FormGrid.Item> */}

        <FormGrid.Item>
          <form.AppField name="companyName">
            {(field) => (
              <field.Input
                label="Company Name"
                placeholder="Enter company name"
                required
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item>
          <form.AppField name="cRNumber">
            {(field) => (
              <field.Input
                label="CR Number"
                placeholder="Enter CR number"
                required
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item>
          <form.AppField name="companyEmail">
            {(field) => (
              <field.Input
                label="Company Email"
                placeholder="Enter email address"
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item>
          <form.AppField name="companyPhone">
            {(field) => <field.Phone label="Company Phone" />}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item>
          <form.AppField name="companyWhatsapp">
            {(field) => <field.Phone label="Company Whatsapp" />}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item>
          <form.AppField name="about.en">
            {(field) => (
              <field.Input
                label="About (EN)"
                placeholder="Enter About (English)"
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item>
          <form.AppField name="about.ar">
            {(field) => (
              <field.Input
                dir="rtl"
                label="About (AR)"
                placeholder="Enter About (Arabic)"
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item>
          <form.AppField name="companyLogo">
            {(field) => (
              <field.FileUploader
                accept="image/png,image/jpeg,/image/jpg,image/webp"
                label="Logo"
                maxFiles={1}
                maxSize={2 * 1024 * 1024}
                multiple
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item>
          <form.AppField name="coverImage">
            {(field) => (
              <field.FileUploader
                accept="image/png,image/jpeg,/image/jpg,image/webp"
                label="Cover Image"
                maxFiles={1}
                maxSize={2 * 1024 * 1024}
                multiple
              />
            )}
          </form.AppField>
        </FormGrid.Item>
      </FormGrid>

      <SheetFormFooter isPending={mutation.isPending} onReset={resetForm} />
    </CustomForm>
  );
}
