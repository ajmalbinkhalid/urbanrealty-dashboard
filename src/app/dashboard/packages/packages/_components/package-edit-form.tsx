"use client";

import { useStore } from "@tanstack/react-form";
import { z } from "zod";
import {
  type PackageCreatePayload,
  packageApi,
} from "@/api/dashboard/packageApi";
import { FormGrid } from "@/components/form/FormGrid";
import type { EditSheetFormProps } from "@/components/ui/data-table/actions/types/sheet-form-props";
import { SheetFormFooter } from "@/components/ui/sheet/sheet-form-layout";
import { useFormMutation } from "@/hooks/use-form-mutation";
import type { TPackage } from "@/types/package";
import { PackageTypeEnum, UserTypeEnum } from "@/utils/enum";

/* ------------------------------------------------------------------ */
/* helpers */
/* ------------------------------------------------------------------ */

const numberString = (name: string) => z.string().min(1, `${name} is required`);

/* ------------------------------------------------------------------ */
/* schema */
/* ------------------------------------------------------------------ */

const BaseSchema = z.object({
  type: z.number().min(1, "Package type is required"),
  userType: z.coerce.number().min(1, "User type is required"),

  name: z.object({
    en: z.string().min(1, "Package name (English) is required"),
    ar: z.string().min(1, "Package name (Arabic) is required"),
  }),

  price: numberString("Price"),
  validity: numberString("Validity"),
});

const PromotionSchema = BaseSchema.extend({
  type: z.literal(String(PackageTypeEnum.Promotion)),
  noOfFeaturedProperty: numberString("No. of featured properties"),
});

const SubscriptionSchema = BaseSchema.extend({
  type: z.literal(String(PackageTypeEnum.Subscription)),
  flatPrice: z.string().optional(),
  offerText: z.string().optional(),
  noOfFeaturedProperty: z.string().optional(),
  noOfProperties: numberString("No. of properties"),
});

export const PackageSchema = z.discriminatedUnion("type", [
  PromotionSchema,
  SubscriptionSchema,
]);

export type PackageFormData = z.infer<typeof PackageSchema>;

type SubscriptionData = z.infer<typeof SubscriptionSchema>;

/* ------------------------------------------------------------------ */
/* payload mapper */
/* ------------------------------------------------------------------ */

function mapFormToApiPayload(data: PackageFormData): PackageCreatePayload {
  const isSubscription = data.type === String(PackageTypeEnum.Subscription);

  return {
    type: Number(data.type),
    userType: String(data.userType),
    name: data.name,
    price: Number(data.price),
    validity: Number(data.validity),
    noOfFeaturedProperty: Number(data.noOfFeaturedProperty ?? 0),

    // ✅ subscription-only
    ...(isSubscription && {
      noOfProperties: Number((data as SubscriptionData).noOfProperties),
      flatPrice: Number((data as SubscriptionData).flatPrice),
      offerText: (data as SubscriptionData).offerText,
    }),
  };
}

/* ------------------------------------------------------------------ */
/* component */
/* ------------------------------------------------------------------ */

export function PackageEditForm({
  data,
  onSuccess,
}: EditSheetFormProps<TPackage>) {
  const packageTypes = Object.entries(PackageTypeEnum)
    .filter(([, v]) => typeof v === "number")
    .map(([label, value]) => ({ label, value: String(value) }));

  const userTypes = Object.entries(UserTypeEnum)
    .filter(([, value]) => typeof value === "number")
    .map(([label, value]) => ({
      label,
      value,
    }));

  const { form, mutation, CustomForm } = useFormMutation<PackageFormData>({
    mutationFn: (formData) =>
      packageApi.updatePackage(data._id, mapFormToApiPayload(formData)),
    schema: PackageSchema,
    onSuccess,
    defaultValues: {
      type: String(data.type),
      userType: Number(data.userType),
      name: {
        en: data.name.en,
        ar: data.name.ar,
      },
      price: String(data.price),
      validity: String(data.validity),
      noOfFeaturedProperty: String(data.noOfFeaturedProperty ?? 0),
      flatPrice: String(data.flatPrice ?? ""),
      noOfProperties: String(data.noOfProperties ?? ""),
      offerText: String(data.offerText),
    },
  });

  const type = useStore(form.store, (s) => s.values.type);
  const isSubscription = type === String(PackageTypeEnum.Subscription);
  const isPromotion = type === String(PackageTypeEnum.Promotion);

  const handleReset = () => {
    form.reset({
      type: String(data.type),
      userType: Number(data.userType),
      name: {
        en: "",
        ar: "",
      },
      price: "",
      validity: "",
      noOfFeaturedProperty: "",
      flatPrice: "",
      noOfProperties: "",
      offerText: "",
    });
  };

  return (
    <CustomForm className="py-4">
      <FormGrid className="px-6">
        <FormGrid.Item className="space-y-3 pt-6">
          <form.AppField name="type">
            {(field) => (
              <field.RadioGroup
                label="Package Type"
                options={packageTypes}
                required
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item>
          <form.AppField name="userType">
            {(field) => (
              <field.Combobox
                label="User type"
                options={userTypes.map((cat) => ({
                  value: cat.value,
                  label: cat.label,
                }))}
                placeholder="Select user type"
                required
                searchPlaceholder="Search user type..."
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item>
          <form.AppField name="name.en">
            {(field) => (
              <field.Input
                label="Name (EN)"
                placeholder="Enter package name"
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
                label="Name (AR)"
                placeholder="Enter package name"
                required
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item>
          <form.AppField name="price">
            {(field) => (
              <field.Input
                label="Price"
                placeholder="Enter price"
                required
                type="number"
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        <FormGrid.Item>
          <form.AppField name="validity">
            {(field) => (
              <field.Input
                label="Validity (in days)"
                placeholder="Enter validity in days"
                required
                type="number"
              />
            )}
          </form.AppField>
        </FormGrid.Item>

        {isSubscription && (
          <FormGrid.Item>
            <form.AppField name="noOfProperties">
              {(field) => (
                <field.Input
                  label="No. of Properties"
                  placeholder="Enter number of properties"
                  required
                  type="number"
                />
              )}
            </form.AppField>
          </FormGrid.Item>
        )}

        {isSubscription && (
          <FormGrid.Item>
            <form.AppField name="noOfFeaturedProperty">
              {(field) => (
                <field.Input
                  label="No. of featured Properties"
                  placeholder="Enter number of featured properties"
                  type="number"
                />
              )}
            </form.AppField>
          </FormGrid.Item>
        )}

        {isPromotion && (
          <FormGrid.Item>
            <form.AppField name="noOfFeaturedProperty">
              {(field) => (
                <field.Input
                  label="No. of featured Properties"
                  placeholder="Enter number of featured properties"
                  required
                  type="number"
                />
              )}
            </form.AppField>
          </FormGrid.Item>
        )}

        {isSubscription && (
          <FormGrid.Item>
            <form.AppField name="flatPrice">
              {(field) => (
                <field.Input
                  label="Flat Price"
                  placeholder="Enter flat price"
                  type="number"
                />
              )}
            </form.AppField>
          </FormGrid.Item>
        )}

        {isSubscription && (
          <FormGrid.Item>
            <form.AppField name="offerText">
              {(field) => (
                <field.Input
                  label="Offer Text"
                  placeholder="Enter offer text"
                />
              )}
            </form.AppField>
          </FormGrid.Item>
        )}
      </FormGrid>

      <SheetFormFooter isPending={mutation.isPending} onReset={handleReset} />
    </CustomForm>
  );
}
