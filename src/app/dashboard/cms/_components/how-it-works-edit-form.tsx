"use client";

import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { cmsApi } from "@/api/dashboard/cmsApi";
import { FormGrid } from "@/components/form/FormGrid";
import type { EditSheetFormProps } from "@/components/ui/data-table/actions/types/sheet-form-props";
import { SheetFormFooter } from "@/components/ui/sheet/sheet-form-layout";
import { useFormMutation } from "@/hooks/use-form-mutation";
import type { TCms } from "@/types/cms";
import { buildCmsUpdatePayload } from "@/utils/cms-update-helper";

const multilingualSchema = z.object({
  en: z.string().nonempty("Title (EN) is required"),
  ar: z.string().nonempty("Title (AR) is required"),
});

const titleBlockSchema = z.object({
  title: multilingualSchema,
  icon: z.union([z.instanceof(File), z.string()]).optional(),
});

const howItWorksSchema = z.object({
  pageTitle: multilingualSchema,

  image: z.union([z.instanceof(File), z.string()]).optional(),

  title1: titleBlockSchema,
  title2: titleBlockSchema,
  title3: titleBlockSchema,
  title4: titleBlockSchema,
});

export type HowItWorksFormData = z.infer<typeof howItWorksSchema>;

export function HowItWorksEditForm({
  data,
  onSuccess,
}: EditSheetFormProps<TCms>) {
  const queryClient = useQueryClient();
  const mutationFn = (formData: HowItWorksFormData) => {
    return cmsApi.updateCms(
      buildCmsUpdatePayload("4", {
        pageTitle: formData.pageTitle,

        image: formData.image,

        title1: {
          title: formData.title1.title,
          icon: formData.title1.icon,
        },

        title2: {
          title: formData.title2.title,
          icon: formData.title2.icon,
        },

        title3: {
          title: formData.title3.title,
          icon: formData.title3.icon,
        },

        title4: {
          title: formData.title4.title,
          icon: formData.title4.icon,
        },
      })
    );
  };

  const { form, CustomForm, mutation } = useFormMutation<HowItWorksFormData>({
    mutationFn,
    schema: howItWorksSchema,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", "how-it-works"] });
      queryClient.invalidateQueries({ queryKey: ["cms-list"] });
      onSuccess?.();
    },
    defaultValues: {
      pageTitle: {
        en: data.pageTitle?.en ?? "",
        ar: data.pageTitle?.ar ?? "",
      },

      // image: data.image ?? undefined,

      title1: {
        title: {
          en: data.title1?.title?.en ?? "",
          ar: data.title1?.title?.ar ?? "",
        },
        // icon: data.title1?.icon ?? null,
      },

      title2: {
        title: {
          en: data.title2?.title?.en ?? "",
          ar: data.title2?.title?.ar ?? "",
        },
        // icon: data.title2?.icon ?? null,
      },

      title3: {
        title: {
          en: data.title3?.title?.en ?? "",
          ar: data.title3?.title?.ar ?? "",
        },
        // icon: data.title3?.icon ?? null,
      },

      title4: {
        title: {
          en: data.title4?.title?.en ?? "",
          ar: data.title4?.title?.ar ?? "",
        },
        // icon: data.title4?.icon ?? null,
      },
    },
  });

  const emptyTitleBlock = {
    title: {
      en: "",
      ar: "",
    },
    icon: undefined,
  };

  const handleReset = () => {
    form.reset({
      pageTitle: {
        en: "",
        ar: "",
      },
      image: undefined,
      title1: emptyTitleBlock,
      title2: emptyTitleBlock,
      title3: emptyTitleBlock,
      title4: emptyTitleBlock,
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
                placeholder="Enter page title"
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
                placeholder="Enter page title"
                required
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item span={"full"}>
          <form.AppField name="image">
            {(field) => (
              <field.FileUploader
                accept="image/png,image/jpeg,image/jpg,image/webp"
                fileUrl={data.image ?? undefined}
                label="Image"
                maxFiles={1}
                maxSize={0.5 * 1024 * 1024}
                required
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item>
          <form.AppField name="title1.title.en">
            {(field) => (
              <field.Input
                label="Title1 (EN)"
                placeholder="Title goes here"
                required
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item>
          <form.AppField name="title1.title.ar">
            {(field) => (
              <field.Input
                dir="rtl"
                label="(AR) 1عنوان"
                placeholder="Title goes here"
                required
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item span={"full"}>
          <form.AppField name="title1.icon">
            {(field) => (
              <field.FileUploader
                accept="image/png,image/jpeg,image/jpg,image/webp"
                fileUrl={data.title1?.icon ?? undefined}
                label="Icon1"
                maxFiles={1}
                maxSize={0.5 * 1024 * 1024}
                placeholder="Choose icon"
                required
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item>
          <form.AppField name="title2.title.en">
            {(field) => (
              <field.Input
                label="Title2 (EN)"
                placeholder="Title goes here"
                required
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item>
          <form.AppField name="title2.title.ar">
            {(field) => (
              <field.Input
                dir="rtl"
                label="(AR) 2عنوان"
                placeholder="Title goes here"
                required
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item span={"full"}>
          <form.AppField name="title2.icon">
            {(field) => (
              <field.FileUploader
                accept="image/png,image/jpeg,image/jpg,image/webp"
                fileUrl={data.title2?.icon ?? undefined}
                label="Icon2"
                maxFiles={1}
                maxSize={0.5 * 1024 * 1024}
                placeholder="Choose icon"
                required
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item>
          <form.AppField name="title3.title.en">
            {(field) => (
              <field.Input
                label="Title3 (EN)"
                placeholder="Title goes here"
                required
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item>
          <form.AppField name="title3.title.ar">
            {(field) => (
              <field.Input
                dir="rtl"
                label="(AR) 3عنوان"
                placeholder="Title goes here"
                required
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item span={"full"}>
          <form.AppField name="title3.icon">
            {(field) => (
              <field.FileUploader
                accept="image/png,image/jpeg,image/jpg,image/webp"
                fileUrl={data.title3?.icon ?? undefined}
                label="Icon3"
                maxFiles={1}
                maxSize={0.5 * 1024 * 1024}
                placeholder="Choose icon"
                required
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item>
          <form.AppField name="title4.title.en">
            {(field) => (
              <field.Input
                label="Title4 (EN)"
                placeholder="Title goes here"
                required
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item>
          <form.AppField name="title4.title.ar">
            {(field) => (
              <field.Input
                dir="rtl"
                label="(AR) 4عنوان"
                placeholder="Title goes here"
                required
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item span={"full"}>
          <form.AppField name="title4.icon">
            {(field) => (
              <field.FileUploader
                accept="image/png,image/jpeg,image/jpg,image/webp"
                fileUrl={data.title4?.icon ?? undefined}
                label="Icon4"
                maxFiles={1}
                maxSize={0.5 * 1024 * 1024}
                placeholder="Choose icon"
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
