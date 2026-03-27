"use client";

import { usePathname } from "next/navigation";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function useDynamicBreadcrumb(): {
  title: string;
  items: BreadcrumbItem[];
} {
  const pathname = usePathname();

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .filter((segment) => segment !== "dashboard");

  const items: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/dashboard/home" },
  ];

  let accumulatedPath = "/dashboard";

  segments.forEach((segment, index) => {
    accumulatedPath += `/${segment}`;

    const label = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    items.push({
      label,
      href: index === segments.length - 1 ? undefined : accumulatedPath,
    });
  });

  const title =
    segments.length > 0
      ? (segments
          .at(-1)
          ?.replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()) ?? "")
      : "Dashboard";

  return { title, items };
}
