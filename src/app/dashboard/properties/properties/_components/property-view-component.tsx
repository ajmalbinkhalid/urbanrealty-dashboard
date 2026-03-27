"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import type { ViewSheetFormProps } from "@/components/ui/data-table/actions/types/sheet-form-props";
import type { TProperty } from "@/types/property";
import {
  CustomerShipEnum,
  FurnishingEnum,
  LocationHubEnum,
  OwnerTypeEnum,
  PropertyCategoryEnum,
  PropertyConditionEnum,
  PropertyPurposeEnum,
  ZoneTypeEnum,
} from "@/utils/enum";
import { EnumHelper } from "@/utils/enum-key-by-value";
import { PropertyApprovalActions } from "./property-approval-action";

interface PropertyViewProps extends ViewSheetFormProps<TProperty> {
  onTriggerConfirm?: (mode: "accept" | "reject", propertyId: string) => void;
  page?: "pending" | "rejected" | "active";
}

export function PropertyViewComponent({
  data,
  onTriggerConfirm,
  page,
}: PropertyViewProps) {
  const isPendingPage = page === "pending";

  return (
    <div className="flex h-full flex-col">
      {/* Scrollable Content */}

      <div className="flex-1 overflow-y-auto">
        <div className="flex w-full justify-end pt-4 pr-4">
          {isPendingPage && (
            <PropertyApprovalActions
              onTriggerConfirm={onTriggerConfirm}
              propertyId={data._id}
            />
          )}
        </div>

        {/* Property Information Section */}
        <section>
          <h2 className="my-4 bg-[#fafafa] px-6 py-3 font-bold text-lg">
            Property Information
          </h2>
          <div className="space-y-6 px-6">
            {/* Row 1 */}
            <div className="grid grid-cols-3 gap-12">
              <div>
                <p className="mb-2 font-medium text-sm">Category</p>
                <p className="text-base text-muted-foreground">
                  {EnumHelper.getKeyName(
                    PropertyCategoryEnum,
                    Number(data.propertyCategoryId)
                  ) || "—"}
                </p>
              </div>
              <div>
                <p className="mb-2 font-medium text-sm">Purpose</p>
                <p className="text-base text-muted-foreground">
                  {EnumHelper.getKeyName(
                    PropertyPurposeEnum,
                    Number(data.purpose)
                  ) || "—"}
                </p>
              </div>
            </div>

            {/* Row 2 */}
            <div>
              <p className="mb-2 font-medium text-sm">Property title</p>
              <p className="text-base text-muted-foreground">
                {data.propertyInformation.title.en || "—"}
              </p>
            </div>

            {/* Row 3 */}
            <div>
              <p className="mb-2 font-medium text-sm">Description</p>
              <p className="text-base text-muted-foreground leading-relaxed">
                {data.propertyInformation.description.en || "—"}
              </p>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-3 gap-12">
              <div>
                <p className="mb-2 font-medium text-sm">Location</p>
                <p className="text-base text-muted-foreground">
                  {data.propertyInformation.locationName || "—"}
                </p>
              </div>
              <div>
                <p className="mb-2 font-medium text-sm">Address</p>
                <p className="text-base text-muted-foreground">
                  {data.address || "—"}
                </p>
              </div>
              <div>
                <p className="mb-2 font-medium text-sm">Landmark</p>
                <p className="text-base text-muted-foreground">
                  {data.propertyInformation.landmark || "—"}
                </p>
              </div>
            </div>

            {/* Row 5 */}
            <div className="grid grid-cols-3 gap-12">
              <div>
                <p className="mb-2 font-medium text-sm">Type</p>
                <p className="text-base text-muted-foreground">
                  {data.propertyInformation?.propertySubCategoryName || "—"}
                </p>
              </div>
              <div>
                <p className="mb-2 font-medium text-sm">Price</p>
                <p className="text-base text-muted-foreground">
                  {data.propertyInformation.price
                    ? Number(data.propertyInformation.price).toLocaleString()
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* User Details Section */}
        <section>
          <h2 className="my-4 mb-6 bg-[#fafafa] px-6 py-3 font-bold text-lg">
            User details
          </h2>
          <div className="space-y-6 px-6">
            {/* Row 1 */}
            <div className="grid grid-cols-3 gap-12">
              <div>
                <p className="mb-2 font-medium text-sm"> User ID</p>
                <p className="text-base text-muted-foreground">
                  {data.owner.ownerId}
                </p>
              </div>
              <div>
                <p className="mb-2 font-medium text-sm">User Type</p>
                <p className="text-base text-muted-foreground">
                  {EnumHelper.getKeyName(OwnerTypeEnum, data.owner.ownerType)}
                </p>
              </div>
              <div>
                <p className="mb-2 font-medium text-sm">Name</p>
                <p className="text-base text-muted-foreground">
                  {data.owner.ownerName || "—"}
                </p>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-3 gap-12">
              <div>
                <p className="mb-2 font-medium text-sm">Email</p>
                <p className="text-base text-muted-foreground">
                  {/* {data.locationHub || data.zoneType || "—"} */}
                </p>
              </div>
              <div>
                <p className="mb-2 font-medium text-sm">Mobile</p>
                <p className="text-base text-muted-foreground">
                  {data.price ? Number(data.price).toLocaleString() : "—"}
                </p>
              </div>
              <div>
                <p className="mb-2 font-medium text-sm">Subscription Type</p>
                <p className="text-base">
                  <span className="rounded-full bg-green-500 px-2 py-1 font-semibold text-white text-xs">
                    {data.status === 1 ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
            </div>

            {/* Row 3 */}
            <div>
              <p className="mb-2 font-medium text-sm">Promotion Type</p>
              <p className="text-base text-muted-foreground">
                {data.area || "—"}
              </p>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section>
          <h2 className="my-4 mb-6 bg-[#fafafa] px-6 py-3 font-bold text-xl">
            Key features
          </h2>
          <div className="grid grid-cols-3 gap-8 px-6">
            {/* Conditionally render each key feature if data exists */}
            {data.keyFeatures?.noOfBedroom && (
              <div>
                <p className="mb-2 font-medium text-sm">No. of bedroom</p>
                <p className="text-base text-muted-foreground">
                  {data.keyFeatures.noOfBedroom}
                </p>
              </div>
            )}
            {data.keyFeatures?.noOfBathroom && (
              <div>
                <p className="mb-2 font-medium text-sm">No. of bathroom</p>
                <p className="text-base text-muted-foreground">
                  {data.keyFeatures.noOfBathroom}
                </p>
              </div>
            )}
            {data.propertyInformation?.area && (
              <div>
                <p className="mb-2 font-medium text-sm">Area (sqft)</p>
                <p className="text-base text-muted-foreground">
                  {data.propertyInformation.area}
                </p>
              </div>
            )}
            {data.keyFeatures?.propertyAge && (
              <div>
                <p className="mb-2 font-medium text-sm">
                  Property establish year
                </p>
                <p className="text-base text-muted-foreground">
                  {data.keyFeatures.propertyAge}
                </p>
              </div>
            )}
            {data.keyFeatures?.furnishing && (
              <div>
                <p className="mb-2 font-medium text-sm">Furnishing</p>
                <p className="text-base text-muted-foreground">
                  {EnumHelper.getKeyName(
                    FurnishingEnum,
                    data.keyFeatures.furnishing
                  )}
                </p>
              </div>
            )}
            {data.keyFeatures?.totalFloor && (
              <div>
                <p className="mb-2 font-medium text-sm">Total Floors</p>
                <p className="text-base text-muted-foreground">
                  {data.keyFeatures.totalFloor}
                </p>
              </div>
            )}
            {data.keyFeatures?.floorNumber && (
              <div>
                <p className="mb-2 font-medium text-sm">Floor Number</p>
                <p className="text-base text-muted-foreground">
                  {data.keyFeatures.floorNumber}
                </p>
              </div>
            )}
            {data.keyFeatures?.customerShip && (
              <div>
                <p className="mb-2 font-medium text-sm">Customer Ship</p>
                <p className="text-base text-muted-foreground">
                  {EnumHelper.getKeyName(
                    CustomerShipEnum,
                    data.keyFeatures.customerShip
                  )}
                </p>
              </div>
            )}
            {data.keyFeatures?.propertyCondition && (
              <div>
                <p className="mb-2 font-medium text-sm">Property Condition</p>
                <p className="text-base text-muted-foreground">
                  {EnumHelper.getKeyName(
                    PropertyConditionEnum,
                    data.keyFeatures.propertyCondition
                  )}
                </p>
              </div>
            )}
            {data.keyFeatures?.zoneType && (
              <div>
                <p className="mb-2 font-medium text-sm">Zone Type</p>
                <p className="text-base text-muted-foreground">
                  {EnumHelper.getKeyName(
                    ZoneTypeEnum,
                    data.keyFeatures.zoneType
                  )}
                </p>
              </div>
            )}
            {data.keyFeatures?.locationHub && (
              <div>
                <p className="mb-2 font-medium text-sm">Location Hub</p>
                <p className="text-base text-muted-foreground">
                  {EnumHelper.getKeyName(
                    LocationHubEnum,
                    data.keyFeatures.locationHub
                  )}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Amenities Section */}
        <section>
          <h2 className="my-4 mb-6 bg-[#fafafa] px-6 py-3 font-bold text-xl">
            Amenities
          </h2>
          <div className="grid grid-cols-3 gap-8 px-6">
            {data.amenities && data.amenities.length > 0 ? (
              data.amenities.map(
                (
                  amenity: string | { _id: string; name: string; icon: string }
                ) => {
                  const key =
                    typeof amenity === "string" ? amenity : amenity._id;

                  return (
                    <div className="flex items-start gap-3" key={key}>
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-foreground" />
                      <span className="text-sm">
                        {typeof amenity === "string" ? amenity : amenity.name}
                      </span>
                    </div>
                  );
                }
              )
            ) : (
              <p className="text-muted-foreground text-sm">
                No amenities listed
              </p>
            )}
          </div>
        </section>

        {/* Images Section */}
        <section>
          <h2 className="my-4 mb-6 bg-[#fafafa] px-6 py-3 font-bold text-xl">
            Images
          </h2>

          <div className="px-6">
            {/* Cover Image */}
            {data.coverImage && (
              <div className="mb-8">
                <p className="mb-3 font-medium text-sm">Cover image</p>
                <div className="relative flex h-48 w-64 items-center justify-center overflow-hidden rounded border border-border bg-muted">
                  <Image
                    alt="Cover image"
                    className="object-cover"
                    fill
                    src={
                      typeof data.coverImage === "string"
                        ? data.coverImage
                        : URL.createObjectURL(data.coverImage)
                    }
                  />
                </div>
              </div>
            )}

            {/* Gallery Images */}
            <div className="grid grid-cols-4 gap-6">
              {data.galleryImages?.map((image: string | File) => {
                const key =
                  typeof image === "string"
                    ? image
                    : `${image.name}-${image.lastModified}`;

                const imageSrc =
                  typeof image === "string"
                    ? image
                    : URL.createObjectURL(image);

                return (
                  <div
                    className="relative flex h-32 w-full items-center justify-center overflow-hidden rounded border border-border bg-muted"
                    key={key}
                  >
                    <Image
                      alt="Gallery image"
                      className="object-cover"
                      fill
                      src={imageSrc}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
