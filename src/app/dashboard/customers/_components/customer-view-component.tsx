"use client";

import dayjs from "dayjs";
import { FormGrid } from "@/components/form/FormGrid";
import type { ViewSheetFormProps } from "@/components/ui/data-table/actions/types/sheet-form-props";
import { ViewTabs } from "@/components/ui/tabs/tabs-layout";
import type { TCustomer } from "@/types/customer";

export function CustomerViewComponent({ data }: ViewSheetFormProps<TCustomer>) {
  if (!data) {
    return (
      <div className="px-6 py-4 text-muted-foreground text-sm">
        Loading customer details…
      </div>
    );
  }

  const basicInfoTab = (
    <FormGrid className="grid gap-4 md:grid-cols-3">
      <FormGrid.Item className="col-span-full">
        <span className="font-medium text-sm">Customer Id</span>
        <p className="text-muted-foreground text-sm">{data.userId || "—"}</p>
      </FormGrid.Item>

      <FormGrid.Item>
        <span className="font-medium text-sm">First Name</span>
        <p className="text-muted-foreground text-sm">{data.firstName || "—"}</p>
      </FormGrid.Item>

      <FormGrid.Item>
        <span className="font-medium text-sm">Last Name</span>
        <p className="text-muted-foreground text-sm">{data.lastName || "—"}</p>
      </FormGrid.Item>

      <FormGrid.Item>
        <span className="font-medium text-sm">Email</span>
        <p className="text-muted-foreground text-sm">{data.email || "—"}</p>
      </FormGrid.Item>

      {/* <FormGrid.Item>
        <span className="font-medium text-sm">Phone</span>
        <p className="text-muted-foreground text-sm">
          {data.phone
            ? `${data.phone.phoneCode} ${data.phone.phoneNumber}`
            : "—"}
        </p>
      </FormGrid.Item> */}

      {/* <FormGrid.Item>
        <span className="font-medium text-sm">Status</span>
        <p className="text-muted-foreground text-sm">
          {data.status === 1 ? "Active" : "Inactive"}
        </p>
      </FormGrid.Item> */}

      <FormGrid.Item>
        <span className="font-medium text-sm">Created At</span>
        <p className="text-muted-foreground text-sm">
          {data.createdAt ? dayjs(data.createdAt).format("DD-MM-YYYY") : "—"}
        </p>
      </FormGrid.Item>
      <FormGrid.Item>
        <span className="font-medium text-sm">Updated At</span>
        <p className="text-muted-foreground text-sm">
          {data.updatedAt ? dayjs(data.updatedAt).format("DD-MM-YYYY") : "—"}
        </p>
      </FormGrid.Item>
    </FormGrid>
  );

  const packageHistoryTab = (
    <div className="text-muted-foreground text-sm">
      Package purchase history will appear here.
    </div>
  );

  const tabs = [
    {
      value: "basic",
      label: "Basic Info",
      content: basicInfoTab,
    },
    {
      value: "packages",
      label: "Package Purchase History",
      content: packageHistoryTab,
    },
  ];

  return <ViewTabs tabs={tabs} />;
}
