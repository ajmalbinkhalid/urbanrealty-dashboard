"use client";

import { FormGrid } from "@/components/form/FormGrid";
import type { TEnquiry } from "@/types/enquiry";

export type EnquiryViewProps = {
  data: TEnquiry;
};

export function EnquiryViewComponent({ data }: EnquiryViewProps) {
  return (
    <FormGrid className="m-6 grid grid-cols-3 gap-4 bg-page-background py-4" cols="3">
      <FormGrid.Item>
        <div className="space-y-1">
          <span className="font-medium text-sm">Enquiry ID</span>
          <p className="text-muted-foreground text-sm">
            {data.enquiryId || "—"}
          </p>
        </div>
      </FormGrid.Item>

      <FormGrid.Item>
        <div className="space-y-1">
          <span className="font-medium text-sm">Message</span>
          <p className="text-muted-foreground text-sm">{data.message || "—"}</p>
        </div>
      </FormGrid.Item>

      <FormGrid.Item>
        <div className="space-y-1">
          <span className="font-medium text-sm">Name</span>
          <p className="text-muted-foreground text-sm">{data.name || "—"}</p>
        </div>
      </FormGrid.Item>

      <FormGrid.Item>
        <div className="space-y-1">
          <span className="font-medium text-sm">Email</span>
          <p className="text-muted-foreground text-sm">{data.email || "—"}</p>
        </div>
      </FormGrid.Item>

      <FormGrid.Item>
        <div className="space-y-1">
          <span className="font-medium text-sm">Mobile</span>
          <p className="text-muted-foreground text-sm">
            {data.phone
              ? `${data.phone.phoneCode} ${data.phone.phoneNumber}`
              : "—"}
          </p>
        </div>
      </FormGrid.Item>

      <FormGrid.Item>
        <div className="space-y-1">
          <span className="font-medium text-sm">Created</span>
          <p className="text-muted-foreground text-sm">
            {data.createdAt
              ? new Date(data.createdAt).toLocaleDateString()
              : "—"}
          </p>
        </div>
      </FormGrid.Item>
    </FormGrid>
  );
}
