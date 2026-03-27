"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAbility } from "@/contexts/ability-context";
import type { NavGroup, NavMainItem } from "./app-sidebar";

const TRAILING_SLASH_REGEX = /\/$/;

type NavMainProps = {
  readonly items: readonly NavGroup[];
};

const IsComingSoon = () => (
  <span className="ml-auto rounded-md bg-muted px-2 py-1 text-muted-foreground text-xs">
    Soon
  </span>
);

const NavItemExpanded = ({
  item,
  isActive,
  isSubmenuOpen,
}: {
  item: NavMainItem;
  isActive: (url: string, subItems?: NavMainItem["subItems"]) => boolean;
  isSubmenuOpen: (subItems?: NavMainItem["subItems"]) => boolean;
}) => {
  return (
    <Collapsible
      asChild
      className="group/collapsible"
      defaultOpen={isSubmenuOpen(item.subItems)}
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          {item.subItems ? (
            <SidebarMenuButton
              className="group/nav-item cursor-pointer rounded-xs px-2! py-5.5! font-medium text-sidebar-foreground text-xs transition-all duration-300 ease-in-out hover:bg-sidebar-accent"
              disabled={item.comingSoon}
              isActive={isActive(item.url, item.subItems)}
              tooltip={item.title}
            >
              {item.icon && (
                <span className="flex h-7 w-7 items-center justify-center rounded-xs bg-sidebar-primary transition-all duration-300 ease-in-out group-hover/nav-item:bg-accent group-data-[active=true]/nav-item:bg-accent">
                  <item.icon className="h-3.5 w-3.5 text-accent-foreground" />
                </span>
              )}
              <span>{item.title}</span>
              {item.comingSoon && <IsComingSoon />}
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          ) : (
            <SidebarMenuButton
              aria-disabled={item.comingSoon}
              asChild
              className="group/nav-item rounded-xs px-2! py-5.5! font-medium text-sidebar-foreground text-xs transition-all duration-300 ease-in-out hover:bg-sidebar-accent"
              isActive={isActive(item.url)}
              tooltip={item.title}
            >
              <Link href={item.url} target={item.newTab ? "_blank" : undefined}>
                {item.icon && (
                  <span className="flex h-7 w-7 items-center justify-center rounded-xs bg-sidebar-primary transition-all duration-300 ease-in-out group-hover/nav-item:bg-accent group-data-[active=true]/nav-item:bg-accent">
                    <item.icon className="h-3.5 w-3.5 text-accent-foreground" />
                  </span>
                )}
                <span>{item.title}</span>
                {item.comingSoon && <IsComingSoon />}
              </Link>
            </SidebarMenuButton>
          )}
        </CollapsibleTrigger>

        {item.subItems && (
          <CollapsibleContent>
            <SidebarMenuSub className="mx-0! gap-1 px-0! pt-1">
              {item.subItems.map((subItem) => (
                <SidebarMenuSubItem className="ml-8" key={subItem.title}>
                  <SidebarMenuSubButton
                    aria-disabled={subItem.comingSoon}
                    asChild
                    className="group/sub-item h-10 rounded-xs text-[12px] text-sidebar-foreground transition-all duration-300 ease-in-out hover:bg-sidebar-accent"
                    isActive={isActive(subItem.url)}
                  >
                    <Link
                      className="p-2!"
                      href={subItem.url}
                      target={subItem.newTab ? "_blank" : undefined}
                    >
                      {subItem.icon && (
                        <span className="flex h-6 w-6 items-center justify-center rounded-xs bg-sidebar-primary transition-all duration-300 ease-in-out group-hover/sub-item:bg-accent group-data-[active=true]/sub-item:bg-accent">
                          <subItem.icon className="size-3.5 text-accent-foreground" />
                        </span>
                      )}

                      <span>{subItem.title}</span>
                      {subItem.comingSoon && <IsComingSoon />}
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </SidebarMenuItem>
    </Collapsible>
  );
};

const NavItemCollapsed = ({
  item,
  isActive,
}: {
  item: NavMainItem;
  isActive: (url: string, subItems?: NavMainItem["subItems"]) => boolean;
}) => {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            className="group/nav-item cursor-pointer px-2! py-5.5! font-medium text-sidebar-foreground text-xs transition-all duration-300 ease-in-out hover:bg-sidebar-accent"
            disabled={item.comingSoon}
            isActive={isActive(item.url, item.subItems)}
            tooltip={item.title}
          >
            {item.icon && (
              <span className="flex h-5 w-5 items-center justify-center rounded-xs bg-sidebar-primary transition-all duration-300 ease-in-out group-hover/nav-item:bg-accent group-data-[active=true]/nav-item:bg-accent">
                <item.icon className="h-3.5 w-3.5 text-accent-foreground" />
              </span>
            )}
            <span>{item.title}</span>
            <ChevronRight />
          </SidebarMenuButton>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="w-50 space-y-1"
          side="right"
        >
          {item.subItems?.map((subItem) => (
            <DropdownMenuItem asChild className="p-0!" key={subItem.title}>
              <SidebarMenuSubButton
                asChild
                className="text-[13px] transition-all duration-300 ease-in-out hover:bg-sidebar-accent"
                isActive={isActive(subItem.url)}
              >
                <Link href={subItem.url}>
                  {subItem.icon && (
                    <subItem.icon className="h-3.5 w-3.5 text-accent transition-all duration-300 ease-in-out" />
                  )}
                  <span>{subItem.title}</span>
                </Link>
              </SidebarMenuSubButton>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

export function NavMain({ items }: NavMainProps) {
  const path = usePathname();
  const { state, isMobile } = useSidebar();
  const { ability } = useAbility();

  const normalize = (url: string) =>
    url !== "/" ? url.replace(TRAILING_SLASH_REGEX, "") : url;

  const isPathActive = (targetUrl: string) => {
    const current = normalize(path);
    const target = normalize(targetUrl);

    return current === target || current.startsWith(`${target}/`);
  };

  const isItemActive = (url: string, subItems?: NavMainItem["subItems"]) => {
    if (isPathActive(url)) {
      return true;
    }
    return subItems?.some((sub) => isPathActive(sub.url)) ?? false;
  };

  const isSubmenuOpen = (subItems?: NavMainItem["subItems"]) =>
    subItems?.some((sub) => isPathActive(sub.url)) ?? false;

  const hasPermission = (permission?: string) => {
    if (!permission) {
      return true;
    }
    const [subject, action] = permission.split(".");
    return ability.can(action as any, subject as any);
  };

  return (
    <>
      {items.map((group) => {
        const filteredItems = group.items.filter(
          (item) =>
            hasPermission(item.permission) &&
            (!item.subItems ||
              item.subItems.some((sub) => hasPermission(sub.permission)))
        );

        if (!filteredItems.length) {
          return null;
        }

        return (
          <SidebarGroup className="p-0!" key={group.id}>
            {group.label && (
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            )}
            <SidebarGroupContent className="flex flex-col gap-2">
              <SidebarMenu className="gap-2">
                {filteredItems.map((item) =>
                  state === "collapsed" && !isMobile ? (
                    <NavItemCollapsed
                      isActive={isItemActive}
                      item={item}
                      key={item.title}
                    />
                  ) : (
                    <NavItemExpanded
                      isActive={isItemActive}
                      isSubmenuOpen={isSubmenuOpen}
                      item={item}
                      key={item.title}
                    />
                  )
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        );
      })}
    </>
  );
}
