import { TableCell, TableRow } from "@/components/ui/table";

type TableSkeletonProps = {
  columnLength: number;
  pageSize: number;
};

export function TableSkeleton({ columnLength, pageSize }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: pageSize }).map((_, idx) => (
        <TableRow key={`skeleton-${idx}`}>
          {Array.from({ length: columnLength }).map((_, colIdx) => (
            <TableCell key={`skeleton-${colIdx}-${idx}`}>
              <div className="w-full">
                <div className="h-7 animate-pulse rounded bg-white duration-50" />
              </div>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
