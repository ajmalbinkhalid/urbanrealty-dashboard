"use client";

import logo from "@public/logo/logo-dashboard.png";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { APP_CONFIG, SIDEBAR_ITEMS } from "@/utils/app-config";
import { NavMain } from "./nav-main";

export type NavSubItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
  permission?: string;
};

export type NavMainItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
  permission?: string;
};

export type NavGroup = {
  id: number;
  label?: string;
  items: NavMainItem[];
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  return (
    <Sidebar {...props} className="z-50 bg-sidebar">
      <SidebarHeader className="p-0!">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button] h-18 rounded-xs hover:bg-sidebar"
            >
              <a href="/dashboard/home">
                <div className="relative size-11">
                  <Image
                    alt="logo"
                    className="object-contain"
                    fill
                    src={logo}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm">{APP_CONFIG.name}</span>
                  <span className="font-extralight text-[10px]">
                    Admin portal
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent
        className={cn(
          "scrollbar-hide min-w-0 flex-1 overflow-y-auto overflow-x-hidden pt-4"
        )}
      >
        <NavMain items={SIDEBAR_ITEMS} />
      </SidebarContent>
      <SidebarFooter className="px-3">
        <div className="text-center text-[9px]">
          <span>Copyright © Urban Reality 2025</span>
          <br />
          <span>All right reserved.</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
