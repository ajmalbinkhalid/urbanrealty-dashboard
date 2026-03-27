"use client";

import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { cmsApi } from "@/api/dashboard/cmsApi";
import { FormEditor } from "@/components/form/FormEditor";
import { FormGrid } from "@/components/form/FormGrid";
import type { EditSheetFormProps } from "@/components/ui/data-table/actions/types/sheet-form-props";
import { SheetFormFooter } from "@/components/ui/sheet/sheet-form-layout";
import { useFormMutation } from "@/hooks/use-form-mutation";
import type { TCms } from "@/types/cms";
import { buildCmsUpdatePayload } from "@/utils/cms-update-helper";

const privacySchema = z.object({
  pageTitle: z.object({
    en: z.string().nonempty("Title (EN) is required"),
    ar: z.string().nonempty("Title (AR) is required"),
  }),
  description: z.object({
    en: z.string().nonempty("Title (EN) is required"),
    ar: z.string().nonempty("Title (AR) is required"),
  }),
});

export type FaqEditFormData = z.infer<typeof privacySchema>;

export function FaqEditForm({ data, onSuccess }: EditSheetFormProps<TCms>) {
  const queryClient = useQueryClient();
  const mutationFn = (formData: FaqEditFormData) => {
    return cmsApi.updateCms(
      buildCmsUpdatePayload("3", {
        pageTitle: formData.pageTitle,
        description: formData.description,
      })
    );
  };

  const { form, CustomForm, mutation } = useFormMutation<FaqEditFormData>({
    mutationFn,
    schema: privacySchema,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", "faq"] });
      queryClient.invalidateQueries({ queryKey: ["cms-list"] });
      onSuccess?.();
    },
    defaultValues: {
      pageTitle: {
        en: data.pageTitle?.en ?? "",
        ar: data.pageTitle?.ar ?? "",
      },
      description: {
        en: data.description?.en ?? "",
        ar: data.description?.ar ?? "",
      },
    },
  });

  const handleReset = () => {
    form.reset({
      pageTitle: {
        en: "",
        ar: "",
      },
      description: {
        en: "",
        ar: "",
      },
    });
  };

  return (
    <CustomForm className="py-4">
      <FormGrid className="px-6">
        <FormGrid.Item>
          <form.AppField name="pageTitle.en">
            {(field) => (
              <field.Input
                label="Page title (EN)"
                placeholder="Enter city name"
                required
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item>
          <form.AppField name="pageTitle.ar">
            {(field) => (
              <field.Input
                dir="rtl"
                label="(AR) عنوان الصفحة"
                placeholder="Enter city name"
                required
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item>
          <form.AppField name="description.en">
            {() => (
              <FormEditor
                label="Content (EN)"
                placeholder="Enter city name"
                required
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item>
          <form.AppField name="description.ar">
            {() => (
              <FormEditor
                dir="rtl"
                label="(AR) المحتوى"
                placeholder="Enter city name"
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
