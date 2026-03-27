"use client";

import { useQuery } from "@tanstack/react-query";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type PaginationState,
  type Row,
  type RowData,
  type SortingState,
  type Updater,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import type {
  RowActionPluginConfig,
  TableActionPluginConfig,
} from "@/components/ui/data-table/actions";
import { ActiveFilterPills } from "@/components/ui/data-table/components/ActiveFilterPills";
import { ErrorUI } from "@/components/ui/data-table/components/ErrorUI";
import { FilterDialog } from "@/components/ui/data-table/components/FilterDialog";
import { TableFooter } from "@/components/ui/data-table/components/table-footer";
import { TableSkeleton } from "@/components/ui/data-table/components/table-skeleton";
import { TableToolbar } from "@/components/ui/data-table/components/table-toolbar";
import { DataTableActionProvider } from "@/components/ui/data-table/context/data-table-action-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PromiseDataTableApiResponse } from "@/types/api-response";
import { createDataTableFetchApi } from "@/utils/data-table-helper";
import type { DataTableQueryParams } from "@/utils/url-helper";

type FilterField = {
  key: string;
  label: string;
  type?: "text" | "select" | "date";
  options?: { label: string; value: unknown }[];
  placeholder?: string;
};

type FetchApiParams = {
  query: DataTableQueryParams;
};

type FetchApiResponse<T> = {
  data: T[];
  totalCount: number;
};

type GenericDataTableProps<T> = {
  fetchApi: (params: FetchApiParams) => PromiseDataTableApiResponse<T>;
  fetchApiQueryParams?: Record<string, unknown>;
  columns: ColumnDef<T>[];
  title: string;
  queryKey: string;
  tableActionPlugins?: TableActionPluginConfig[];
  actionPlugins?: RowActionPluginConfig<T, unknown>[];
  searchPlaceholder?: string;
  dataKey?: string;
  totalCountKey?: string;
  pageSize?: number;
  pageSizeOptions?: number[];
  filterFields?: FilterField[];
  tabs?: DataTableTab[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
  showSearchSection?: boolean;
  showTableToolbar?: boolean;
  showTableFooter?: boolean;
};

type PaginationModel = {
  pageIndex: number;
  pageSize: number;
};

type DataTableTab = {
  value: string;
  label: string;
};

type InternalRow<T> = T & { id: string | number };

function DataTableContent<T extends RowData & { _id: string | number }>({
  fetchApi,
  fetchApiQueryParams,
  columns: baseColumns,
  tableActionPlugins = [],
  actionPlugins = [],
  queryKey,
  searchPlaceholder = "Search",
  dataKey = "data",
  totalCountKey = "totalCount",
  pageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  filterFields = [],
  tabs,
  activeTab,
  onTabChange,
  showSearchSection = true,
  showTableToolbar = true,
  showTableFooter = true,
}: GenericDataTableProps<T>) {
  const [showFilterDialog, setShowFilterDialog] = useState<boolean>(false);
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState<string>("");
  const [draftQuery, setDraftQuery] = useState<string>("");
  const [debouncedQuery] = useDebounce(query, 500);
  const [paginationModel, setPaginationModel] = useState<PaginationModel>({
    pageIndex: 0,
    pageSize,
  });
  const [total, setTotal] = useState<number>(0);

  const {
    data: tableData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      queryKey,
      paginationModel.pageIndex,
      paginationModel.pageSize,
      debouncedQuery,
      filters,
    ],
    queryFn: async (): Promise<FetchApiResponse<T>> => {
      const fetchApiWithHelper = createDataTableFetchApi<T>(fetchApi);

      const res = await fetchApiWithHelper({
        query: {
          sort: "asc",
          q: debouncedQuery,
          page: paginationModel.pageIndex + 1,
          pageSize: paginationModel.pageSize,
          filters,
          ...fetchApiQueryParams,
        },
      });

      return res;
    },
  });

  const rows: T[] = useMemo(
    () =>
      tableData
        ? ((tableData as unknown as Record<string, unknown>)[dataKey] as T[]) ||
          []
        : [],
    [tableData, dataKey]
  );

  const normalizedRows = useMemo<InternalRow<T>[]>(
    () => rows.map((r) => ({ ...r, id: r._id })),
    [rows]
  );

  useEffect(() => {
    setTotal(
      (tableData as unknown as Record<string, number | undefined>)?.[
        totalCountKey
      ] || 0
    );
  }, [tableData, totalCountKey]);

  const columnsWithActions: ColumnDef<InternalRow<T>>[] = useMemo(() => {
    return [
      ...(baseColumns as unknown as ColumnDef<InternalRow<T>>[]),
      ...(actionPlugins.length > 0
        ? [
            {
              id: "actions",
              enableHiding: false,
              cell: ({ row }: { row: Row<InternalRow<T>> }) => (
                <div className="flex items-center justify-end gap-2">
                  {actionPlugins.map((plugin) => (
                    <plugin.Cell key={plugin.id} row={row.original as T} />
                  ))}
                </div>
              ),
            } as ColumnDef<InternalRow<T>>,
          ]
        : []),
    ];
  }, [baseColumns, actionPlugins]);

  const table = useReactTable<InternalRow<T>>({
    data: normalizedRows,
    columns: columnsWithActions,
    pageCount: Math.ceil(total / paginationModel.pageSize),
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: ((updater: Updater<PaginationState>) => {
      setPaginationModel((prev: PaginationModel) => {
        const next: PaginationState =
          typeof updater === "function" ? updater(prev) : updater;
        return next;
      });
    }) as OnChangeFn<PaginationState>,
    getRowId: (row: InternalRow<T>): string => String(row._id),
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: paginationModel.pageIndex,
        pageSize: paginationModel.pageSize,
      },
    },
    manualPagination: true,
    enableRowSelection: true,
  });

  // Error UI
  if (error) {
    return <ErrorUI onRetry={refetch} />;
  }

  return (
    <div className="w-full bg-page-background">
      {/* Tabs ABOVE search */}
      {tabs && tabs.length > 0 && (
        <Tabs className="mb-4" onValueChange={onTabChange} value={activeTab}>
          <TabsList className="bg-background">
            {tabs.map((tab) => (
              <TabsTrigger
                className="text-sidebar data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                key={tab.value}
                value={tab.value}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}
      {showTableToolbar && (
        <TableToolbar
          bulkActions={[]}
          columns={table.getAllColumns()}
          draftQuery={draftQuery}
          isFetching={isFetching || isLoading}
          onShowFilter={() => setShowFilterDialog(true)}
          query={query}
          refetchData={refetch}
          searchPlaceholder={searchPlaceholder}
          selectedRows={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          setDraftQuery={setDraftQuery}
          setQuery={setQuery}
          showSearchSection={showSearchSection}
          tableActionButtons={tableActionPlugins.map((plugin) => (
            <plugin.Button key={plugin.id} />
          ))}
        />
      )}

      <ActiveFilterPills
        filterFields={filterFields}
        filters={filters}
        refetch={refetch}
        setFilters={setFilters}
      />

      <FilterDialog
        filterFields={filterFields}
        filters={filters}
        onApply={refetch}
        onOpenChange={setShowFilterDialog}
        open={showFilterDialog}
        setFilters={setFilters}
      />

      <div className="relative overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className="h-11 bg-th-background text-left font-semibold text-th-foreground text-xs hover:bg-th-background"
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableSkeleton
                columnLength={columnsWithActions.length}
                pageSize={10}
              />
            )}
            {!isLoading && table.getRowModel().rows?.length
              ? table.getRowModel().rows.map((row) => (
                  <TableRow
                    className="bg-td-background text-td-foreground hover:bg-td-background/50"
                    data-state={row.getIsSelected() && "selected"}
                    key={row.original._id}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell className="text-sm" key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : !isLoading && (
                  <TableRow>
                    <TableCell
                      className="h-24 text-center"
                      colSpan={columnsWithActions.length}
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>
      {showTableFooter && (
        <TableFooter
          pageIndex={paginationModel.pageIndex}
          pageSize={paginationModel.pageSize}
          pageSizeOptions={pageSizeOptions}
          rowCount={table.getFilteredRowModel().rows.length}
          selectedCount={table.getFilteredSelectedRowModel().rows.length}
          setPageIndex={(index: number) =>
            setPaginationModel((prev: PaginationModel) => ({
              ...prev,
              pageIndex: index,
            }))
          }
          setPageSize={(size: number) =>
            setPaginationModel((prev: PaginationModel) => ({
              ...prev,
              pageSize: size,
              pageIndex: 0,
            }))
          }
          total={total}
        />
      )}

      {/* Render all table action shared components */}
      {tableActionPlugins.map((plugin) => (
        <plugin.Shared key={plugin.id} />
      ))}

      {/* Render all row action shared components */}
      {actionPlugins.map((plugin) => (
        <plugin.Shared key={plugin.id} />
      ))}
    </div>
  );
}

export function DataTable<T extends RowData & { _id: string | number }>(
  props: GenericDataTableProps<T>
) {
  return (
    <DataTableActionProvider queryKey={props.queryKey}>
      <DataTableContent {...props} />
    </DataTableActionProvider>
  );
}
