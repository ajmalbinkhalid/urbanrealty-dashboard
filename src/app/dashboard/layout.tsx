"use client";

import { useRouter } from "@bprogress/next/app";
import { type ReactNode, useEffect } from "react";
import { AppSidebar } from "@/app/dashboard/_components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SpinnerCustom } from "@/components/ui/spinner";
import { AbilityProvider } from "@/contexts/ability-context";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { HeaderBreadcrumbs } from "./_components/layout/header-breadcrumbs";
import { NotificationButton } from "./_components/layout/notification-button";
import { UserMenu } from "./_components/layout/user-menu";

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!(isAuthenticated || isLoading)) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, router, isLoading]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        Authenticating...
        <SpinnerCustom />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        Redirecting to login...
        <SpinnerCustom />
      </div>
    );
  }

  return (
    <AbilityProvider>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar collapsible="icon" variant="sidebar" />
        <SidebarInset
          className={cn(
            "relative min-w-0 flex-1 rounded-none! peer-data-[variant=inset]:rounded-none!",
            "data-[content-layout=centered]:mx-auto! data-[content-layout=centered]:max-w-screen-2xl",
            "min-h-screen bg-page-background max-[113rem]:peer-data-[variant=inset]:mr-2! min-[101rem]:peer-data-[variant=inset]:peer-data-[state=collapsed]:mr-auto!"
          )}
        >
          <header className="sticky inset-x-0 top-0 z-40 flex h-18 w-full shrink-0 items-center gap-2 bg-white shadow-xs transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex w-full items-center justify-between px-4 lg:px-8">
              <div className="flex items-center gap-1 lg:gap-2">
                <SidebarTrigger className="md:hidden" />
                <HeaderBreadcrumbs />
              </div>
              <div className="flex items-center gap-4">
                <NotificationButton />
                <UserMenu />
              </div>
            </div>
          </header>
          <div className="mt-8 px-8">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </AbilityProvider>
  );
}
