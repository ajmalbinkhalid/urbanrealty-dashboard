import type { ReactNode } from "react";
import { CustomTabs } from "@/components/ui/shared/custom-tabs";

const PURCHASES_TABS = [
  { value: "pending", label: "Pending" },
  { value: "purchased", label: "Purchased" },
];

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <CustomTabs
        basePath="/dashboard/packages/purchases"
        tabs={PURCHASES_TABS}
      />
      {children}
    </div>
  );
}
