"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { agencyApi } from "@/api/dashboard/agencyApi";
import { FormGrid } from "@/components/form/FormGrid";
import type { EditSheetFormProps } from "@/components/ui/data-table/actions/types/sheet-form-props";
import { SheetFormFooter } from "@/components/ui/sheet/sheet-form-layout";
import { SpinnerCustom } from "@/components/ui/spinner";
import { useFormMutation } from "@/hooks/use-form-mutation";
import type { TAgency } from "@/types/agency";
import { StorageUrl } from "@/utils/url-helper";
import { urlToFile } from "@/utils/url-to-file";

const nameRegex = /^[A-Za-z\u0600-\u06FF]+(?: [A-Za-z\u0600-\u06FF]+)*$/;
// const phoneNumberRegex = /^[0-9]+$/;
const optionalPhoneNumber = z.preprocess(
  (val) => (val === "" ? undefined : val),
  z
    .string()
    .regex(/^[0-9]+$/, "Phone number must contain only digits")
    .optional()
);

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
  // phone: z.object({
  //   phoneCode: z.string().min(1, "Phone code is required"),
  //   phoneNumber: z
  //     .string()
  //     .min(1, "Phone number is required")
  //     .regex(phoneNumberRegex, "Phone number must contain only digits"),
  // }),
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
        "Company logo must be less than or equal to 2 MB"
      )
      .optional()
  ),
});

export type AgencyEditFormData = z.infer<typeof AgencySchema>;

export function AgencyEditForm({
  data,
  onSuccess,
}: EditSheetFormProps<TAgency>) {
  const [loading, setLoading] = useState<boolean>(false);

  const { form, mutation, CustomForm } = useFormMutation<AgencyEditFormData>({
    mutationFn: (formData) => agencyApi.updateAgency(data?._id ?? "", formData),
    schema: AgencySchema,
    onSuccess,
    defaultValues: {
      firstName: data.firstName ?? "",
      lastName: data.lastName ?? "",
      // phone: {
      //   phoneCode: data.phone?.phoneCode ?? "+91",
      //   phoneNumber: data.phone?.phoneNumber ?? "",
      // },
      email: data.email ?? "",
      companyName: data.companyName ?? "",
      companyPhone: {
        phoneCode: data.companyPhone?.phoneCode ?? "+91",
        phoneNumber: data.companyPhone?.phoneNumber ?? "",
      },
      companyWhatsapp: {
        phoneCode: data.companyWhatsapp?.phoneCode ?? "+91",
        phoneNumber: data.companyWhatsapp?.phoneNumber ?? "",
      },
      companyEmail: data.companyEmail ?? "",
      cRNumber: data.cRNumber ?? "",
      about: {
        en: data.about?.en ?? "",
        ar: data.about?.ar ?? "",
      },
      // companyLogo: data.companyLogo ?? null as unknown as File,
    },
  });

  const { setFieldValue } = form;

  useEffect(() => {
    const loadImages = async () => {
      if (!(data?.companyLogo || data?.coverImage)) {
        return;
      }

      setLoading(true);
      try {
        if (data?.companyLogo) {
          const logoFile = await urlToFile(
            StorageUrl + data.companyLogo,
            "company-logo.jpg"
          );
          setFieldValue("companyLogo", logoFile);
        }

        if (data?.coverImage) {
          const coverFile = await urlToFile(
            StorageUrl + data.coverImage,
            "cover-image.jpg"
          );
          setFieldValue("coverImage", coverFile);
        }
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [data?.companyLogo, data?.coverImage, setFieldValue]);

  const handleReset = () => {
    form.reset({
      firstName: "",
      lastName: "",
      // phone: {
      //   phoneCode: "+91",
      //   phoneNumber: "",
      // },
      email: "",
      companyName: "",
      companyPhone: {
        phoneCode: "+91",
        phoneNumber: "",
      },
      companyWhatsapp: {
        phoneCode: "+91",
        phoneNumber: "",
      },
      companyEmail: "",
      cRNumber: "",
      about: {
        en: "",
        ar: "",
      },
      // companyLogo: null, // keep commented if not part of form state
    });
  };

  if (loading) {
    <div className="flex h-screen w-full items-center justify-center">
      <SpinnerCustom />
    </div>;
  }

  return (
    <CustomForm className="py-4">
      <FormGrid className="px-6">
        <FormGrid.Item>
          <form.AppField name="firstName">
            {(field) => (
              <field.Input
                label="First Name"
                placeholder="First name"
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
                label="Company name"
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
                label="Company email"
                placeholder="Enter email address"
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item>
          <form.AppField name="companyPhone">
            {(field) => <field.Phone label="Company phone" />}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item>
          <form.AppField name="companyWhatsapp">
            {(field) => <field.Phone label="Company whatsapp" />}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item>
          <form.AppField name="about.en">
            {(field) => (
              <field.Input
                label="About (English)"
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
                label="About (Arabic)"
                placeholder="Enter About (Arabic)"
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item>
          <form.AppField name="companyLogo">
            {(field) => (
              <field.FileUploader
                accept="image/png,image/jpeg/image/gif,image/bmp,image/tiff,image/x-icon"
                fileUrl={StorageUrl + data.companyLogo}
                label="Logo"
                maxFiles={1}
                maxSize={2 * 1024 * 1024}
              />
            )}
          </form.AppField>
        </FormGrid.Item>
        <FormGrid.Item>
          <form.AppField name="coverImage">
            {(field) => (
              <field.FileUploader
                accept="image/png,image/jpeg/image/gif,image/bmp,image/tiff,image/x-icon"
                fileUrl={StorageUrl + data.companyLogo}
                label="Cover Image"
                maxFiles={1}
                maxSize={2 * 1024 * 1024}
              />
            )}
          </form.AppField>
        </FormGrid.Item>
      </FormGrid>

      <SheetFormFooter isPending={mutation.isPending} onReset={handleReset} />
    </CustomForm>
  );
}
