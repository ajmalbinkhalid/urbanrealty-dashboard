"use client";

import { useStore } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { z } from "zod";
import { amenityApi } from "@/api/dashboard/amenityApi";
import { categoryApi } from "@/api/dashboard/categoryApi";
import { locationApi } from "@/api/dashboard/locationApi";
import { propertyApi } from "@/api/dashboard/propertyApi";
import { FormGrid } from "@/components/form/FormGrid";
import LocationPoints from "@/components/form/location-points";
import type { AddSheetFormProps } from "@/components/ui/data-table/actions/types/sheet-form-props";
import { SheetFormFooter } from "@/components/ui/sheet/sheet-form-layout";
import { SpinnerCustom } from "@/components/ui/spinner";
import { useFormMutation } from "@/hooks/use-form-mutation";
import { cn } from "@/lib/utils";
import {
  CustomerShipEnum,
  FurnishingEnum,
  LocationHubEnum,
  PossessionStatusEnum,
  PropertyCategoryEnum,
  PropertyConditionEnum,
  PropertyPurposeEnum,
  ZoneTypeEnum,
} from "@/utils/enum";
import { StorageUrl } from "@/utils/url-helper";

/* ---------------- Schema ---------------- */
const enumString = <T extends Record<string, number>>(enumObj: T) =>
  z.string().refine((val) => Object.values(enumObj).includes(Number(val)), {
    message: "Required",
  });

const numberString = (name: string) => z.string().min(1, `${name} is required`);

const BasePropertySchema = z.object({
  purpose: enumString(PropertyPurposeEnum),
  category: enumString(PropertyCategoryEnum),
  title: z.object({
    en: z.string().min(1, "English title required"),
    // .regex(nameRegex, "Only letters allowed"),
    ar: z.string().min(1, "Arabic title required"),
    // .regex(nameRegex, "Only letters allowed"),
  }),
  description: z.object({
    en: z.string().min(1, "English description required"),
    // .regex(nameRegex, "Only letters allowed"),
    ar: z.string().min(1, "Arabic description required"),
    // .regex(nameRegex, "Only letters allowed"),
  }),
  landmark: z.object({
    en: z.string().min(1, "English landmark required"),
    // .regex(nameRegex, "Only letters allowed"),
    ar: z.string().min(1, "Arabic landmark required"),
    // .regex(nameRegex, "Only letters allowed"),
  }),
  locationId: z.string().min(1, "Location required"),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  address: z.string().optional(),
  possessionStatus: enumString(PossessionStatusEnum),
  area: numberString("Area"),
  price: numberString("Price"),
  coverImage: z.instanceof(File, { message: "Cover image is required" }),
  galleryImages: z
    .array(z.instanceof(File))
    .min(1, "At least 1 gallery image required"),
});

const ResidentialSchema = BasePropertySchema.extend({
  category: z.literal(String(PropertyCategoryEnum.Residential)),
  propertyTypeId: z.string().optional(),
  bedrooms: numberString("Bedrooms"),
  bathrooms: numberString("Bathrooms"),
  propertyAge: z.string().min(1, "Property year required"),
  propertySubCategoryId: z.string().min(1, "Property type is required"),
  furnishing: enumString(FurnishingEnum),
  amenities: z.array(z.string()).min(2, "Select at least 2 amenities"),
});

const CommercialSchema = BasePropertySchema.extend({
  category: z.literal(String(PropertyCategoryEnum.Commercial)),
  propertyTypeId: z.string().optional(),
  totalFloors: numberString("Total Floors"),
  floorNumber: numberString("Floor Number"),
  propertyAge: z.string().min(1, "Property year required"),
  customership: enumString(CustomerShipEnum),
  propertyCondition: enumString(PropertyConditionEnum),
  propertySubCategoryId: z.string().min(1, "Property type is required"),
  zoneType: enumString(ZoneTypeEnum),
  locationHub: enumString(LocationHubEnum),
  furnishing: enumString(FurnishingEnum),
  amenities: z.array(z.string()).min(2, "Select at least 2 amenities"),
});

const LandSchema = BasePropertySchema.extend({
  category: z.literal(String(PropertyCategoryEnum.Land)),
  propertyTypeId: z.string().optional(),
  propertySubCategoryId: z.string().optional(),
});

export const PropertyFormSchema = z.discriminatedUnion("category", [
  ResidentialSchema,
  CommercialSchema,
  LandSchema,
]);

export type PropertyFormData = z.infer<typeof PropertyFormSchema>;

type ResidentialData = z.infer<typeof ResidentialSchema>;
type CommercialData = z.infer<typeof CommercialSchema>;

type BaseApiPayload = {
  purpose: number;
  propertyCategoryId: string;
  propertyInformation: {
    title: { en: string; ar: string };
    description: { en: string; ar: string };
    landmark: { en: string; ar: string };
    locationId: string;
    location: { latitude: number; longitude: number };
    address?: string;
    area: number;
    price: number;
    possessionStatus: number;
    propertySubCategoryId: string;
  };
  amenities: string[];
  coverImage: File;
  galleryImages: File[];
  galleryImagePaths?: string[];
};

interface ResidentialApiPayload extends BaseApiPayload {
  keyFeatures: {
    noOfBedroom: number;
    noOfBathroom: number;
    propertyAge: number;
    furnishing: number;
  };
}

interface CommercialApiPayload extends BaseApiPayload {
  keyFeatures: {
    totalFloor: number;
    floorNumber: number;
    propertyAge: number;
    customerShip: number;
    propertyCondition: number;
    zoneType: number;
    locationHub: number;
    furnishing: number;
  };
}

interface LandApiPayload extends BaseApiPayload {
  keyFeatures?: undefined;
}

type ApiPayload = ResidentialApiPayload | CommercialApiPayload | LandApiPayload;

function mapFormToApiPayload(data: PropertyFormData): ApiPayload {
  const galleryFiles = (data.galleryImages ?? []) as File[];
  const galleryPaths: string[] = [];

  const basePayload = {
    purpose: Number(data.purpose),
    propertyCategoryId: String(data.category),
    propertyInformation: {
      title: data.title,
      description: data.description,
      landmark: data.landmark,
      locationId: data.locationId,
      location: data.location,
      address: data.address,
      area: Number(data.area),
      price: Number(data.price),
      possessionStatus: Number(data.possessionStatus),
      propertySubCategoryId: data.propertySubCategoryId,
    },
    coverImage: data.coverImage,
    galleryImages: galleryFiles,
    galleryImagePaths: galleryPaths,
  };

  if (data.category === String(PropertyCategoryEnum.Residential)) {
    const residentialData = data as ResidentialData;
    return {
      ...basePayload,
      amenities: residentialData.amenities,
      keyFeatures: {
        noOfBedroom: Number(residentialData.bedrooms),
        noOfBathroom: Number(residentialData.bathrooms),
        propertyAge: Number(residentialData.propertyAge),
        furnishing: Number(residentialData.furnishing),
      },
    } as ResidentialApiPayload;
  }

  if (data.category === String(PropertyCategoryEnum.Commercial)) {
    const commercialData = data as CommercialData;
    return {
      ...basePayload,
      amenities: commercialData.amenities,
      keyFeatures: {
        totalFloor: Number(commercialData.totalFloors),
        floorNumber: Number(commercialData.floorNumber),
        propertyAge: Number(commercialData.propertyAge),
        customerShip: Number(commercialData.customership),
        propertyCondition: Number(commercialData.propertyCondition),
        zoneType: Number(commercialData.zoneType),
        locationHub: Number(commercialData.locationHub),
        furnishing: Number(commercialData.furnishing),
      },
    } as CommercialApiPayload;
  }

  // Land
  return {
    ...basePayload,
    amenities: [],
  } as LandApiPayload;
}

type DefaultFormValues = {
  purpose: string;
  category: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  landmark: { en: string; ar: string };
  locationId: string;
  propertyTypeId: string;
  possessionStatus: string;
  area: string;
  price: string;
  propertyAge: string;
  furnishing: string;
  bedrooms: string;
  bathrooms: string;
  zoneType: string;
  locationHub: string;
  propertyCondition: string;
  customership: string;
  totalFloors: string;
  floorNumber: string;
  amenities: string[];
  coverImage: undefined;
  galleryImages: File[];
  address?: string;
  location: {
    latitude: number;
    longitude: number;
  };
};

type EnumOption = {
  label: string;
  value: string;
};

export function PropertyCreateForm({ onSuccess }: AddSheetFormProps) {
  const { data: amenities, isLoading: amenitiesLoading } = useQuery({
    queryKey: ["amenities"],
    queryFn: () => amenityApi.getAmenities(),
  });

  const { data: locations, isLoading: locationsLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: () => locationApi.getLocations(),
  });

  // const { data: categories, isLoading: categoriesLoading } = useQuery({
  //   queryKey: ["categories"],
  //   queryFn: () => categoryApi.getCategories(),
  // });

  const { form, mutation, CustomForm, resetForm } =
    useFormMutation<PropertyFormData>({
      mutationFn: (data) => {
        const payload = mapFormToApiPayload(data);
        return propertyApi.createProperty(payload);
      },
      schema: PropertyFormSchema,
      onSuccess,
      defaultValues: {
        purpose: String(PropertyPurposeEnum.Sell),
        category: String(PropertyCategoryEnum.Residential),
        title: { en: "", ar: "" },
        description: { en: "", ar: "" },
        landmark: { en: "", ar: "" },
        locationId: "",
        propertyTypeId: "",
        possessionStatus: "",
        propertySubCategoryId: "",
        area: "",
        price: "",
        propertyAge: "",
        furnishing: "",
        bedrooms: "",
        bathrooms: "",
        zoneType: "",
        locationHub: "",
        propertyCondition: "",
        customership: "",
        totalFloors: "",
        floorNumber: "",
        amenities: [],
        coverImage: undefined,
        galleryImages: [],
        address: "",
        location: {
          latitude: 25.276_987,
          longitude: 55.296_249,
        },
      } as DefaultFormValues,
    });

  const bedroomOptions = Array.from({ length: 10 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }));

  const bathroomOptions = Array.from({ length: 10 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }));

  const currentYear = new Date().getFullYear();
  const propertyAgeOptions = Array.from({ length: 50 }, (_, i) => ({
    value: String(currentYear - i),
    label: String(currentYear - i),
  }));

  const totalFloorsOptions = Array.from({ length: 100 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }));

  const floorNumberOptions = Array.from({ length: 100 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }));

  const propertyPurposeTypes: EnumOption[] = Object.entries(PropertyPurposeEnum)
    .filter(([, value]) => typeof value === "number")
    .map(([label, value]) => ({
      label: label.replace(/_/g, " "),
      value: String(value),
    }));

  const propertyCategoryTypes: EnumOption[] = Object.entries(
    PropertyCategoryEnum
  )
    .filter(([, value]) => typeof value === "number")
    .map(([label, value]) => ({
      label: label.replace(/_/g, " "),
      value: String(value),
    }));

  const propertyFurnishingTypes: EnumOption[] = Object.entries(FurnishingEnum)
    .filter(([, value]) => typeof value === "number")
    .map(([label, value]) => ({
      label: label.replace(/_/g, " "),
      value: String(value),
    }));

  const propertyConditionTypes: EnumOption[] = Object.entries(
    PropertyConditionEnum
  )
    .filter(([, value]) => typeof value === "number")
    .map(([label, value]) => ({
      label: label.replace(/_/g, " "),
      value: String(value),
    }));

  const possessionStatusTypes: EnumOption[] = Object.entries(
    PossessionStatusEnum
  )
    .filter(([, value]) => typeof value === "number")
    .map(([label, value]) => ({
      label: label.replace(/_/g, " "),
      value: String(value),
    }));

  const customerShipTypes: EnumOption[] = Object.entries(CustomerShipEnum)
    .filter(([, value]) => typeof value === "number")
    .map(([label, value]) => ({
      label: label.replace(/_/g, " "),
      value: String(value),
    }));

  const zoneTypes: EnumOption[] = Object.entries(ZoneTypeEnum)
    .filter(([, value]) => typeof value === "number")
    .map(([label, value]) => ({
      label: label.replace(/_/g, " "),
      value: String(value),
    }));

  const locationHubTypes: EnumOption[] = Object.entries(LocationHubEnum)
    .filter(([, value]) => typeof value === "number")
    .map(([label, value]) => ({
      label: label.replace(/_/g, " "),
      value: String(value),
    }));

  const locationOptions: EnumOption[] =
    locations?.data.locations.map((loc) => ({
      value: loc._id,
      label: loc.city.en,
    })) ?? [];

  const category = useStore(form.store, (state) => state.values.category);
  const purpose = useStore(form.store, (state) => state.values.purpose);
  // const possessionStatus = useStore(
  //   form.store,
  //   (state) => state.values.possessionStatus
  // );

  const isResidential = category === String(PropertyCategoryEnum.Residential);
  const isCommercial = category === String(PropertyCategoryEnum.Commercial);
  const isLand = category === String(PropertyCategoryEnum.Land);
  const isRent = purpose === String(PropertyPurposeEnum.Rent);

  // Filter out Land category when purpose is Rent
  const filteredCategoryTypes = isRent
    ? propertyCategoryTypes.filter(
        (cat) => cat.value !== String(PropertyCategoryEnum.Land)
      )
    : propertyCategoryTypes;
  // const showAvailableFrom = possessionStatus === "3"; // Future status

  if (amenitiesLoading || locationsLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <SpinnerCustom />
      </div>
    );
  }

  return (
    <CustomForm className="space-y-6">
      <div className="space-y-6 px-6">
        {/* Purpose Section */}
        <div className="space-y-3 pt-6">
          <form.AppField name="purpose">
            {(field) => (
              <field.RadioGroup
                label="Purpose "
                options={propertyPurposeTypes}
                required
              />
            )}
          </form.AppField>
        </div>

        {/* Category Section */}
        <div className="space-y-3">
          <form.AppField name="category">
            {(field) => (
              <field.TabRadioGroup
                label="Category "
                options={filteredCategoryTypes}
                required
              />
            )}
          </form.AppField>
        </div>

        {/* Property Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-base">Property Information</h3>

          <FormGrid className="px-0">
            <FormGrid.Item>
              <form.AppField name="title.en">
                {(field) => (
                  <field.Input
                    label="Property title (EN)"
                    placeholder="Property title"
                    required
                  />
                )}
              </form.AppField>
            </FormGrid.Item>

            <FormGrid.Item>
              <form.AppField name="title.ar">
                {(field) => (
                  <field.Input
                    dir="rtl"
                    label="Property title (AR)"
                    placeholder="Property title"
                    required
                  />
                )}
              </form.AppField>
            </FormGrid.Item>

            <FormGrid.Item>
              <form.AppField name="description.en">
                {(field) => (
                  <field.Textarea
                    label="Description (EN)"
                    placeholder="Enter property description"
                    required
                  />
                )}
              </form.AppField>
            </FormGrid.Item>

            <FormGrid.Item>
              <form.AppField name="description.ar">
                {(field) => (
                  <field.Textarea
                    dir="rtl"
                    label="Description (AR)"
                    placeholder="Enter property description"
                    required
                  />
                )}
              </form.AppField>
            </FormGrid.Item>

            <FormGrid.Item>
              <form.AppField name="landmark.en">
                {(field) => (
                  <field.Input
                    label="Landmark (EN)"
                    placeholder="Enter landmark"
                    required
                  />
                )}
              </form.AppField>
            </FormGrid.Item>

            <FormGrid.Item>
              <form.AppField name="landmark.ar">
                {(field) => (
                  <field.Input
                    dir="rtl"
                    label="Landmark (AR)"
                    placeholder="Enter landmark"
                    required
                  />
                )}
              </form.AppField>
            </FormGrid.Item>

            <FormGrid.Item>
              <form.AppField name="locationId">
                {(field) => (
                  <field.Combobox
                    label="Location"
                    options={locationOptions}
                    placeholder="Select locations"
                    required
                    searchPlaceholder="Search..."
                  />
                )}
              </form.AppField>
            </FormGrid.Item>

            <FormGrid.Item className="col-span-2 mb-6">
              <form.AppField name="location">
                {(field) => (
                  <LocationPoints
                    disabled={mutation.isPending}
                    error={
                      field.state.meta.isTouched && !field.state.meta.isValid
                        ? field.state.meta.errors
                            .map((err) => err?.message)
                            .join(", ")
                        : undefined
                    }
                    latitude={field.state.value.latitude}
                    longitude={field.state.value.longitude}
                    onAddressChange={(address) => {
                      // Store address in the form data
                      form.setFieldValue("address", address);
                    }}
                    onLocationChange={(lat, lng) => {
                      field.handleChange({
                        latitude: lat,
                        longitude: lng,
                      });
                    }}
                    required
                  />
                )}
              </form.AppField>
            </FormGrid.Item>

            {!isLand && (
              <FormGrid.Item>
                <form.AppField name="propertySubCategoryId">
                  {(field) => (
                    <field.Combobox
                      label="Property Type"
                      onSearch={async (query, page, pageSize) => {
                        const res = await categoryApi.getCategoriesTable({
                          query: {
                            page,
                            pageSize,
                            q: query || undefined,
                          },
                        });

                        return {
                          results: res.data.items.map(
                            (c: { _id: string; name: { en: string } }) => ({
                              value: c._id,
                              label: c.name.en, // ✅ string
                            })
                          ),
                          hasMore:
                            res.data.currentPage * res.data.pageSize <
                            res.data.totalCount,
                        };
                      }}
                      pageSize={10}
                      placeholder="Select Property Type"
                      searchPlaceholder="Search property type..."
                    />
                  )}
                </form.AppField>
              </FormGrid.Item>
            )}

            <FormGrid.Item>
              <form.AppField name="possessionStatus">
                {(field) => (
                  <field.Combobox
                    label="Possession Status"
                    options={possessionStatusTypes}
                    placeholder="Select possession status"
                    required
                    searchPlaceholder="Search status..."
                  />
                )}
              </form.AppField>
            </FormGrid.Item>

            <FormGrid.Item>
              <form.AppField name="area">
                {(field) => (
                  <field.Input
                    label="Area (sqft)"
                    placeholder="Enter area"
                    required
                    type="number"
                  />
                )}
              </form.AppField>
            </FormGrid.Item>

            <FormGrid.Item>
              <form.AppField name="price">
                {(field) => (
                  <field.Input
                    label="Price($)"
                    placeholder="Enter property price"
                    required
                    type="number"
                  />
                )}
              </form.AppField>
            </FormGrid.Item>
          </FormGrid>
        </div>

        {/* Key Features - Residential */}
        {isResidential && (
          <div className="space-y-4">
            <h3 className="font-semibold text-base">Key features</h3>

            <FormGrid className="px-0">
              <FormGrid.Item>
                <form.AppField name="bedrooms">
                  {(field) => (
                    <field.Combobox
                      label="No. of bedroom"
                      options={bedroomOptions}
                      placeholder="Select number of bedroom"
                      required
                      searchPlaceholder="Search..."
                    />
                  )}
                </form.AppField>
              </FormGrid.Item>

              <FormGrid.Item>
                <form.AppField name="bathrooms">
                  {(field) => (
                    <field.Combobox
                      label="No. of bathroom"
                      options={bathroomOptions}
                      placeholder="Select number of bathroom"
                      required
                      searchPlaceholder="Search..."
                    />
                  )}
                </form.AppField>
              </FormGrid.Item>

              <FormGrid.Item>
                <form.AppField name="propertyAge">
                  {(field) => (
                    <field.Combobox
                      label="Property Establish year"
                      options={propertyAgeOptions}
                      placeholder="Select property establish year"
                      required
                      searchPlaceholder="Search..."
                    />
                  )}
                </form.AppField>
              </FormGrid.Item>

              <FormGrid.Item>
                <form.AppField name="furnishing">
                  {(field) => (
                    <field.Combobox
                      label="Furnishing"
                      options={propertyFurnishingTypes}
                      placeholder="Select furnishing type"
                      required
                      searchPlaceholder="Search..."
                    />
                  )}
                </form.AppField>
              </FormGrid.Item>
            </FormGrid>
          </div>
        )}

        {/* Key Features - Commercial */}
        {isCommercial && (
          <div className="space-y-4">
            <h3 className="font-semibold text-base">Key features</h3>

            <FormGrid className="px-0">
              <FormGrid.Item>
                <form.AppField name="totalFloors">
                  {(field) => (
                    <field.Combobox
                      label="Total Floors"
                      options={totalFloorsOptions}
                      placeholder="Select total floors"
                      required
                      searchPlaceholder="Search..."
                    />
                  )}
                </form.AppField>
              </FormGrid.Item>

              <FormGrid.Item>
                <form.AppField name="floorNumber">
                  {(field) => (
                    <field.Combobox
                      label="Floor Number"
                      options={floorNumberOptions}
                      placeholder="Select floor number"
                      required
                      searchPlaceholder="Search..."
                    />
                  )}
                </form.AppField>
              </FormGrid.Item>

              <FormGrid.Item>
                <form.AppField name="propertyAge">
                  {(field) => (
                    <field.Combobox
                      label="Property Establish year"
                      options={propertyAgeOptions}
                      placeholder="Select property establish year"
                      required
                      searchPlaceholder="Search..."
                    />
                  )}
                </form.AppField>
              </FormGrid.Item>

              <FormGrid.Item>
                <form.AppField name="customership">
                  {(field) => (
                    <field.Combobox
                      label="Customer Ship"
                      options={customerShipTypes}
                      placeholder="Select customer ship"
                      required
                      searchPlaceholder="Search..."
                    />
                  )}
                </form.AppField>
              </FormGrid.Item>

              <FormGrid.Item>
                <form.AppField name="propertyCondition">
                  {(field) => (
                    <field.Combobox
                      label="Property Condition"
                      options={propertyConditionTypes}
                      placeholder="Select condition"
                      required
                      searchPlaceholder="Search..."
                    />
                  )}
                </form.AppField>
              </FormGrid.Item>

              <FormGrid.Item>
                <form.AppField name="zoneType">
                  {(field) => (
                    <field.Combobox
                      label="Zone Type"
                      options={zoneTypes}
                      placeholder="Select zone type"
                      required
                      searchPlaceholder="Search..."
                    />
                  )}
                </form.AppField>
              </FormGrid.Item>

              <FormGrid.Item>
                <form.AppField name="locationHub">
                  {(field) => (
                    <field.Combobox
                      label="Location Hub"
                      options={locationHubTypes}
                      placeholder="Select location hub"
                      required
                      searchPlaceholder="Search..."
                    />
                  )}
                </form.AppField>
              </FormGrid.Item>

              <FormGrid.Item>
                <form.AppField name="furnishing">
                  {(field) => (
                    <field.Combobox
                      label="Furnishing"
                      options={propertyFurnishingTypes}
                      placeholder="Select furnishing type"
                      required
                      searchPlaceholder="Search..."
                    />
                  )}
                </form.AppField>
              </FormGrid.Item>
            </FormGrid>
          </div>
        )}

        {/* Amenities - Not for Land */}
        {!isLand && (
          <div className="space-y-4">
            <h3 className="font-semibold text-base">Amenities</h3>

            <form.AppField name="amenities">
              {(field) => {
                const selected: string[] = field.state.value ?? [];
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                const toggleAmenity = (id: string): void => {
                  if (selected.includes(id)) {
                    field.handleChange(selected.filter((item) => item !== id));
                  } else {
                    field.handleChange([...selected, id]);
                  }
                  field.handleBlur();
                };

                return (
                  <div className="space-y-3">
                    <div className="grid max-h-80 grid-cols-2 gap-3 overflow-y-auto pr-2">
                      {amenities?.data.amenities.map((amenity) => (
                        <label
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-all",
                            selected.includes(amenity._id)
                              ? "border-primary bg-primary/5"
                              : "border-input hover:bg-accent"
                          )}
                          key={amenity._id}
                        >
                          <input
                            checked={selected.includes(amenity._id)}
                            className="h-4 w-4 shrink-0 cursor-pointer"
                            onChange={() => toggleAmenity(amenity._id)}
                            type="checkbox"
                          />

                          <div className="relative flex h-6 w-6 items-center justify-center text-lg">
                            <Image
                              alt=""
                              fill
                              src={StorageUrl + amenity.icon}
                            />
                            {/* {amenity.icon} */}
                          </div>

                          <span className="flex-1 text-sm leading-tight">
                            {amenity.name.en}
                          </span>
                        </label>
                      ))}
                    </div>
                    {isInvalid && (
                      <p className="text-destructive text-xs">
                        {field.state.meta.errors
                          .map((err) => err?.message)
                          .join(", ")}
                      </p>
                    )}
                  </div>
                );
              }}
            </form.AppField>
          </div>
        )}

        {/* Upload Images */}
        <div className="space-y-4">
          <FormGrid className="px-0">
            <FormGrid.Item>
              <form.AppField name="coverImage">
                {(field) => (
                  <field.FileUploader
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    label="Cover Image"
                    maxFiles={1}
                    maxSize={2 * 1024 * 1024}
                    required
                  />
                )}
              </form.AppField>
            </FormGrid.Item>

            <FormGrid.Item>
              <form.AppField name="galleryImages">
                {(field) => (
                  <field.FileUploader
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    label="Gallery images"
                    maxFiles={10}
                    maxSize={2 * 1024 * 1024}
                    multiple
                    required
                  />
                )}
              </form.AppField>
            </FormGrid.Item>
          </FormGrid>
        </div>
      </div>

      <SheetFormFooter isPending={mutation.isPending} onReset={resetForm} />
    </CustomForm>
  );
}
