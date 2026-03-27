import type { ReactNode } from "react";
import { CustomTabs } from "@/components/ui/shared/custom-tabs";

const AGENCY_TABS = [
  { value: "agency-requests", label: "Agency Requests" },
  { value: "active-agencies", label: "Active Agencies" },
  { value: "rejected-agencies", label: "Rejected Agencies" },
];

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <CustomTabs basePath="/dashboard/agencies" tabs={AGENCY_TABS} />
      {children}
    </div>
  );
}
