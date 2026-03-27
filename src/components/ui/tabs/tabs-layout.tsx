"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import type * as React from "react";
import { cn } from "@/lib/utils";

type TabItem = {
  value: string;
  label: string;
  content: React.ReactNode;
};

type ViewTabsProps = {
  tabs: TabItem[];
  defaultTab?: string;
  rightSlot?: React.ReactNode;
};

export function ViewTabs({ tabs, defaultTab, rightSlot }: ViewTabsProps) {
  return (
    <TabsPrimitive.Root
      className="w-full"
      defaultValue={defaultTab ?? tabs[0].value}
    >
      {/* Tabs Header */}
      <div className="flex items-center justify-between px-6 pt-4">
        <TabsPrimitive.List className="flex gap-3">
          {tabs.map((tab) => (
            <TabsPrimitive.Trigger
              className={cn(
                "rounded-xs px-5 py-3 font-medium text-sm transition-all",
                "bg-[#EEF4FF] text-[#1E3A8A]",
                "data-[state=active]:bg-[#2563EB]",
                "data-[state=active]:text-white",
                "data-[state=active]:shadow-sm"
              )}
              key={tab.value}
              value={tab.value}
            >
              {tab.label}
            </TabsPrimitive.Trigger>
          ))}
        </TabsPrimitive.List>

        {/* RIGHT SIDE ACTIONS */}
        {rightSlot && (
          <div className="flex items-center gap-3">{rightSlot}</div>
        )}
      </div>

      {/* Content area */}
      <div className="px-6 pt-4 pb-6">
        {tabs.map((tab) => (
          <TabsPrimitive.Content
            className="mt-0"
            key={tab.value}
            value={tab.value}
          >
            {/* Light content background box */}
            <div className="rounded-md bg-[#F6F9FF] p-4">{tab.content}</div>
          </TabsPrimitive.Content>
        ))}
      </div>
    </TabsPrimitive.Root>
  );
}
