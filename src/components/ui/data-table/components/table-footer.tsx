import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TableFooterProps = {
  pageSize: number;
  pageSizeOptions: number[];
  pageIndex: number;
  total: number;
  setPageSize: (size: number) => void;
  setPageIndex: (index: number) => void;
  selectedCount: number;
  rowCount: number;
};

export function TableFooter({
  pageSize,
  pageSizeOptions,
  pageIndex,
  total,
  setPageSize,
  setPageIndex,
  selectedCount,
  rowCount,
}: TableFooterProps) {

  const totalPages = Math.ceil(total / pageSize);
  const pages: number[] = Array.from(
  { length: totalPages },
  (_, index) => index
);

  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <div className="ml-4 flex-1 text-table-footer-foreground text-xs max-sm:hidden">
        {selectedCount > 0
          ? `${selectedCount} of ${rowCount} row(s) selected.`
          : `Showing ${pageIndex * pageSize + 1} to ${Math.min((pageIndex + 1) * pageSize, total)} of ${total} total item(s).`}
      </div>
      <div className="flex items-center space-x-2">
        {/* <div className="text-muted-foreground text-sm max-sm:hidden">
          Per Page
        </div> */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="min-w-20 justify-between"
              size="sm"
              variant="outline"
            >
              {pageSize}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {pageSizeOptions.map((size) => (
              <DropdownMenuCheckboxItem
                checked={pageSize === size}
                className="text-foreground focus:text-foreground dark:text-foreground"
                key={size}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setPageSize(size);
                    setPageIndex(0);
                  }
                }}
              >
                {size}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
      <div className="flex items-center justify-end gap-2 py-4">
  {/* Page Numbers */}
  {pages.map((page) => {
    const isActive = page === pageIndex;

    return (
      <Button
        key={page}
        variant={isActive ? "default" : "outline"}
        className={`size-6 px-3 text-xs rounded-none text-table-footer-foreground ${
          isActive ? "bg-accent hover:bg-accent/90 text-white" : ""
        }`}
        onClick={() => setPageIndex(page)}
      >
        {page + 1}
      </Button>
    );
  })}

  {/* Next (>>) button */}
  <Button
    variant="outline"
    disabled={pageIndex === totalPages - 1}
    onClick={() => setPageIndex(pageIndex + 1)}
    className="size-6 rounded-none text-xs text-table-footer-foreground"
  >
    {">>"}
    {/* <ChevronRight className="h-4 w-4" /> */}
    {/* <div className="flex justify-center items-center h-4 w-4">{">>"}</div> */}
  </Button>
</div>


      {/* <Button
        disabled={pageIndex === 0}
        onClick={() => setPageIndex(Math.max(pageIndex - 1, 0))}
        size="sm"
        variant="outline"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      <Button
        disabled={(pageIndex + 1) * pageSize >= total}
        onClick={() => setPageIndex(pageIndex + 1)}
        size="sm"
        variant="outline"
      >
        <ChevronRight className="h-4 w-4" />
      </Button> */}
    </div>
  );
}
