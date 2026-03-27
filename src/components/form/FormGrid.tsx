import { cn } from "@/lib/utils";

type FormGridProps = {
  children: React.ReactNode;
  cols?: string;
  gapX?: string;
  gapY?: string;
  px?: string;
  className?: string;
};

type FormGridItemProps = {
  children?: React.ReactNode;
  span?: "full" | number;
  className?: string;
};

export function FormGrid({
  children,
  cols = "grid-cols-1 md:grid-cols-2",
  gapX = "gap-x-6",
  gapY = "gap-y-0",
  px = "px-4",
  className,
}: FormGridProps) {
  return (
    <div className={cn("grid", px, cols, gapX, gapY, className)}>
      {children}
    </div>
  );
}

FormGrid.Item = function FormGridItem({
  span,
  children,
  className,
}: FormGridItemProps) {
  return (
    <div
      className={cn(
        span === "full" ? "col-span-full" : "",
        typeof span === "number" ? `col-span-${span}` : "",
        className
      )}
    >
      {children}
    </div>
  );
};
