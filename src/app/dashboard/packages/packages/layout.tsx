import type { ReactNode } from "react";
import { CustomTabs } from "@/components/ui/shared/custom-tabs";

const PACKAGES_TABS = [
  { value: "subscriptions", label: "Subscriptions" },
  { value: "promotions", label: "Promotions" },
];

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <CustomTabs
        basePath="/dashboard/packages/packages"
        tabs={PACKAGES_TABS}
      />
      {children}
    </div>
  );
}
