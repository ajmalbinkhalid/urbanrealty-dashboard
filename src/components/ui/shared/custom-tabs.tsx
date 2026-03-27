"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "../tabs";

export function CustomTabs({
  tabs,
  basePath,
}: {
  tabs: { value: string; label: string }[];
  basePath: string;
}) {
  const pathname = usePathname();
  const currentTab = pathname.split("/").pop();
  const formatBasePath = basePath.replace(/^\/|\/$/g, "");

  return (
    <Tabs className="mb-6" value={currentTab}>
      {/* 🔹 SCROLL WRAPPER (functional only) */}
      <div className="overflow-x-auto overflow-y-hidden">
        {/* 🔹 TabsList UNCHANGED */}
        <TabsList className="h-12 gap-3 bg-inherit">
          {tabs.map((tab) => (
            <Link
              href={`/${formatBasePath}/${tab.value}`}
              key={tab.value}
              prefetch
            >
              <TabsTrigger
                className="cursor-pointer rounded-md bg-white px-4 py-3 transition-all duration-300 ease-in-out hover:opacity-80 data-[state=active]:bg-primary data-[state=active]:font-semibold data-[state=active]:text-white dark:data-[state=active]:bg-primary dark:data-[state=active]:text-white"
                value={tab.value}
              >
                {tab.label}
              </TabsTrigger>
            </Link>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
}
