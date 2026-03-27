"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect } from "react";
import { z } from "zod";
import { generalSettingsApi } from "@/api/dashboard/generalSettingsApi";
import { FormGrid } from "@/components/form/FormGrid";
import { Button } from "@/components/ui/button";
import { useFormMutation } from "@/hooks/use-form-mutation";
import logoStatic from "../../../../public/logo/logo-black.svg";

const nameRegex = /^[\p{L}]+(?:\s[\p{L}]+)*$/u;

const GeneralSettingsSchema = z.object({
  name: z.object({
    en: z
      .string()
      .min(2, "Name (English) is required")
      .regex(nameRegex, "Name (EN) must contain only letters"),
    ar: z
      .string()
      .min(2, "Name (Arabic) is required")
      .regex(nameRegex, "Name (AR) must contain only letters"),
  }),
  about: z.object({
    en: z
      .string()
      .min(10, "About (English) is required")
      .regex(nameRegex, "Name (EN) must contain only letters"),
    ar: z
      .string()
      .min(10, "About (Arabic) is required")
      .regex(nameRegex, "Name (EN) must contain only letters"),
  }),
  email: z.string().email("Invalid email"),
  phone: z.object({
    phoneCode: z.string().min(1),
    phoneNumber: z.string().min(6),
  }),
  whatsapp: z.object({
    phoneCode: z.string().min(1),
    phoneNumber: z.string().min(6),
  }),
  logo: z.instanceof(File).optional().nullable(),
});

type GeneralSettingsFormData = z.infer<typeof GeneralSettingsSchema>;

export default function GeneralSettingsPage() {
  // const [logoUrl, setLogoUrl] = useState<string | undefined>();
  const queryClient = useQueryClient();

  const { form, mutation, CustomForm } =
    useFormMutation<GeneralSettingsFormData>({
      schema: GeneralSettingsSchema,
      mutationFn: (formData) =>
        generalSettingsApi.updateGeneralSettings(formData),

      defaultValues: {
        name: { en: "", ar: "" },
        about: { en: "", ar: "" },
        email: "",
        phone: { phoneCode: "", phoneNumber: "" },
        whatsapp: { phoneCode: "", phoneNumber: "" },
      },

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["general-settings"],
        });
      },
    });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["general-settings"],
    queryFn: generalSettingsApi.getGeneralSettings,
  });

  useEffect(() => {
    if (!data?.data?.settings) {
      return;
    }

    const { logo, ...rest } = data.data.settings;

    form.reset(rest);
    // setLogoUrl(logo);
  }, [data, form]);

  if (isLoading) {
    return <div className="p-6">Loading general settings...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-destructive">
        Failed to load general settings.
      </div>
    );
  }

  return (
    <CustomForm className="flex h-full w-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-3">
        <div className="relative size-10">
          <Image alt="Logo" fill src={logoStatic} />
        </div>
        <h1 className="font-semibold text-lg">General Settings</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto py-3">
        <FormGrid px="0">
          {/* Company logo */}
          <FormGrid.Item>
            <form.AppField name="logo">
              {(field) => (
                <field.FileUploader
                  accept="image/png,image/jpeg/image/gif,image/bmp,image/tiff,image/x-icon"
                  // fileUrl={logoUrl}
                  label="Company logo"
                  maxFiles={1}
                  maxSize={0.5 * 1024 * 1024}
                />
              )}
            </form.AppField>
          </FormGrid.Item>

          {/* Email */}
          <FormGrid.Item>
            <form.AppField name="email">
              {(field) => (
                <field.Input
                  label="Company email"
                  placeholder="company@email.com"
                />
              )}
            </form.AppField>
          </FormGrid.Item>

          {/* Company Name */}
          <FormGrid.Item>
            <form.AppField name="name.en">
              {(field) => (
                <field.Input
                  label="Company Name (English)"
                  placeholder="Enter company name"
                />
              )}
            </form.AppField>
          </FormGrid.Item>

          <FormGrid.Item>
            <form.AppField name="name.ar">
              {(field) => (
                <field.Input
                  dir="rtl"
                  label="Company Name (Arabic)"
                  placeholder="أدخل اسم الشركة"
                />
              )}
            </form.AppField>
          </FormGrid.Item>

          {/* About */}
          <FormGrid.Item>
            <form.AppField name="about.en">
              {(field) => (
                <field.Textarea
                  label="About (English)"
                  placeholder="About company"
                />
              )}
            </form.AppField>
          </FormGrid.Item>

          <FormGrid.Item>
            <form.AppField name="about.ar">
              {(field) => (
                <field.Textarea
                  dir="rtl"
                  label="About (Arabic)"
                  placeholder="نبذة عن الشركة"
                />
              )}
            </form.AppField>
          </FormGrid.Item>

          {/* Phone */}
          <FormGrid.Item>
            <form.AppField name="phone">
              {(field) => <field.Phone label="Phone" />}
            </form.AppField>
          </FormGrid.Item>

          {/* WhatsApp */}
          <FormGrid.Item>
            <form.AppField name="whatsapp">
              {(field) => <field.Phone label="WhatsApp" />}
            </form.AppField>
          </FormGrid.Item>
        </FormGrid>
      </div>

      {/* Footer */}
      <div className="flex justify-end">
        <Button disabled={mutation.isPending} type="submit">
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </CustomForm>
  );
}
