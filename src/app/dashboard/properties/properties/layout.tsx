import type { ReactNode } from "react";
import { CustomTabs } from "@/components/ui/shared/custom-tabs";

const PROPERTIES_TABS = [
  { value: "property-requests", label: "Property Requests" },
  { value: "active-properties", label: "Active Properties" },
  { value: "inactive-properties", label: "Inactive Properties" },
];

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <CustomTabs
        basePath="/dashboard/properties/properties"
        tabs={PROPERTIES_TABS}
      />
      {children}
    </div>
  );
}
