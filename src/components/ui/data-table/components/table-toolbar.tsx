import type { Column } from "@tanstack/react-table";
import { RotateCcw, Search } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { TableSearchInput } from "./table-search-input";

type BulkAction<T> = {
  label: string;
  icon?: React.ReactNode;
  onClick: (rows: T[]) => void;
  disabled?: boolean;
};

type TableToolbarProps<T = unknown> = {
  searchPlaceholder: string;
  query: string;
  setQuery: (q: string) => void;
  draftQuery: string;
  setDraftQuery: (q: string) => void;
  onShowFilter: () => void;
  columns: Column<T>[];
  tableActionButtons?: React.ReactNode[];
  bulkActions?: BulkAction<T>[];
  selectedRows?: T[];
  loadingAction?: string;
  refetchData?: () => void;
  isFetching?: boolean;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  showSearchSection?: boolean;
};

export function TableToolbar<T = unknown>({
  searchPlaceholder,
  query,
  setQuery,
  draftQuery,
  setDraftQuery,
  onShowFilter,
  columns,
  tableActionButtons = [],
  bulkActions = [],
  selectedRows = [],
  loadingAction,
  isFetching,
  refetchData,
  showSearchSection = true,
}: TableToolbarProps<T>) {
  return (
    <div className="mb-4 flex w-full flex-wrap-reverse items-center gap-2">
      {showSearchSection && (
        <div className="flex min-w-[250px] flex-1 items-center gap-2">
          <TableSearchInput
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setQuery(draftQuery);
              }
            }}
            query={draftQuery}
            searchPlaceholder={searchPlaceholder}
            setQuery={setDraftQuery}
          />
          <Button
            aria-label="search"
            className="rounded-full"
            onClick={() => setQuery(draftQuery)}
            size="icon"
            variant="default"
          >
            <Search className="size-4" />
          </Button>

          <Button
            aria-label="Refresh"
            className="rounded-full bg-th-background hover:bg-th-background/90"
            disabled={isFetching}
            onClick={() => {
              setDraftQuery("");
              setQuery("");
              refetchData?.();
            }}
            size="icon"
            variant="outline"
          >
            <RotateCcw
              className={cn("h-4 w-4 text-white", {
                "animate-spin": isFetching,
              })}
            />
          </Button>
        </div>
      )}

      {bulkActions.length > 0 && selectedRows.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="relative mr-2" size="default" variant="outline">
              {selectedRows.length > 0 && (
                <span className="inline-flex items-center justify-center rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-800 text-xs">
                  {selectedRows.length}
                </span>
              )}
              Bulk Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {bulkActions.map((action: BulkAction<T>) => (
              <DropdownMenuItem
                disabled={!!loadingAction || action.disabled}
                key={action.label}
                onClick={() => action.onClick(selectedRows)}
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {loadingAction === action.label
                  ? "Processing..."
                  : action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* <Button
          aria-label="Filter"
          onClick={onShowFilter}
          size="icon"
          variant="outline"
        >
          <Filter className="h-4 w-4" />
        </Button> */}
      {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="ml-auto" variant="outline">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {columns
              .filter(
                (column) =>
                  column.getCanHide() &&
                  typeof column.columnDef.header === "string"
              )
              .map((column) => (
                <DropdownMenuCheckboxItem
                  checked={column.getIsVisible()}
                  className="text-foreground capitalize"
                  key={column.id}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.columnDef.header as string}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu> */}
      <div className="ml-auto flex items-center gap-2">
        {tableActionButtons && tableActionButtons.length > 0 && (
          <div className="flex gap-2">{tableActionButtons}</div>
        )}
      </div>
    </div>
  );
}
