"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useDynamicBreadcrumb } from "@/hooks/use-dynamic-breadcrumb";

export function HeaderBreadcrumbs() {
  const { title, items } = useDynamicBreadcrumb();

  return (
    <div className="flex flex-col">
      {/* PAGE TITLE */}
      <h1 className="font-semibold text-foreground text-lg">{title}</h1>

      {/* BREADCRUMB */}
      <Breadcrumb>
        <BreadcrumbList className="gap-1!">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <span
                className="flex items-center gap-1"
                key={item.label + item.href}
              >
                <BreadcrumbItem>
                  {item.href && !isLast ? (
                    <BreadcrumbLink
                      className="text-[10px] text-breadcrumb-foreground"
                      href={item.href}
                    >
                      {item.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="text-[10px] text-breadcrumb-foreground">
                      {item.label}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>

                {!isLast && (
                  <BreadcrumbSeparator className="text-[10px] text-breadcrumb-foreground">
                    &gt;
                  </BreadcrumbSeparator>
                )}
              </span>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
