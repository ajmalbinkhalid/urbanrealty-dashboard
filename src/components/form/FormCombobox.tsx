"use client";

import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import * as React from "react";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";

//
// Types
//
export interface ComboboxOption<T = string | number> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  data?: any; // Store the complete object here
}

export interface SearchResponse<T> {
  results: ComboboxOption<T>[];
  hasMore: boolean;
}

type ExtraProps<T> = {
  options?: ComboboxOption<T>[];
  onSearch?: (
    query: string,
    page: number,
    pageSize: number
  ) => Promise<SearchResponse<T>>;
  onSelect?: (value: T, fullData?: any) => void | Promise<void>;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  multiselect?: boolean;
  pageSize?: number;
  allowCustomInput?: boolean; // New prop for free solo functionality
};

//
// Final merged component
//
export function FormCombobox<T = string | number>(
  props: FormControlProps & ExtraProps<T>
) {
  const {
    options = [],
    onSearch,
    placeholder = "Select an option...",
    searchPlaceholder = "Search...",
    emptyMessage = "No results found.",
    disabled,
    multiselect = false,
    pageSize = 20,
    allowCustomInput = false,
  } = props;

  const field = useFieldContext<T | T[]>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debounced] = useDebounce(searchQuery, 300);

  const [loading, setLoading] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [results, setResults] = React.useState<ComboboxOption<T>[]>([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(false);
  const [selectedOption, setSelectedOption] =
    React.useState<ComboboxOption<T> | null>(null);

  const scrollRef = React.useRef<HTMLDivElement>(null);

  //
  // Fetch data function
  //
  const fetchData = React.useCallback(
    async (searchTerm: string, pageNum: number, append = false) => {
      if (!onSearch) return;

      const isLoadingMore = pageNum > 1 && append;
      if (isLoadingMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const response = await onSearch(searchTerm, pageNum, pageSize);

        setResults((prev) =>
          append ? [...prev, ...response.results] : response.results
        );
        setHasMore(response.hasMore);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [onSearch, pageSize]
  );

  //
  // Reset and fetch on search change or when popup opens
  //
  React.useEffect(() => {
    if (!(onSearch && open)) return;

    setPage(1);
    setResults([]);
    fetchData(debounced, 1, false);
  }, [debounced, open, onSearch, fetchData]);

  //
  // Handle scroll to load more
  //
  const handleScroll = React.useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (!hasMore || loadingMore || !onSearch || loading) return;

      const target = e.currentTarget;
      const scrolledToBottom =
        target.scrollHeight - target.scrollTop <= target.clientHeight + 100;

      if (scrolledToBottom) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchData(debounced, nextPage, true);
      }
    },
    [hasMore, loadingMore, loading, page, debounced, fetchData, onSearch]
  );

  //
  // Items to display
  //
  const displayOptions = React.useMemo(() => {
    if (onSearch) return results;

    // Fallback to client-side filtering if no onSearch provided
    if (searchQuery)
      return options.filter((o) =>
        o.label.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return options;
  }, [onSearch, results, options, searchQuery]);

  //
  // Get display label(s)
  //
  const selectedDisplay = React.useMemo(() => {
    // If we have a stored selected option, use its label
    if (selectedOption && selectedOption.value === field.state.value) {
      return selectedOption.label;
    }

    const val = field.state.value;

    const all = [...options, ...results];

    if (multiselect) {
      const arr = Array.isArray(val) ? val : [];
      const labels = arr
        .map((v) => all.find((o) => o.value === v)?.label)
        .filter(Boolean);
      return labels.length ? labels.join(", ") : placeholder;
    }

    const match = all.find((o) => o.value === val);
    return match ? match.label : (val as string) || placeholder;
  }, [
    field.state.value,
    multiselect,
    options,
    results,
    placeholder,
    selectedOption,
  ]);

  //
  // Handle selection
  //
  const handleSelect = React.useCallback(
    (v: T, option?: ComboboxOption<T>) => {
      field.setMeta((prev) => ({
        ...prev,
        errorMap: {
          ...prev.errorMap,
          onServer: undefined,
        },
      }));

      // Store the selected option for display purposes
      if (option) {
        setSelectedOption(option);
      }

      if (multiselect) {
        const current = Array.isArray(field.state.value)
          ? [...field.state.value]
          : [];

        const exists = current.includes(v);

        const updated = exists
          ? current.filter((x) => x !== v)
          : [...current, v];

        field.handleChange(updated as any);
      } else {
        field.handleChange(v as any);
        setOpen(false);
        setSearchQuery("");
        setResults([]);
        setPage(1);
      }

      // Call the external callback with both value and full data
      if (props.onSelect) {
        props.onSelect(v, option?.data);
      }
    },
    [field, multiselect, props]
  );

  //
  // Handle custom input (free solo)
  //
  const handleCustomInput = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!allowCustomInput) return;

      if (e.key === "Enter" && searchQuery.trim()) {
        e.preventDefault();
        const customValue = searchQuery.trim() as unknown as T;
        handleSelect(customValue);
      }
    },
    [allowCustomInput, searchQuery, handleSelect]
  );

  //
  // Component UI
  //
  return (
    <FormBase {...props}>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            aria-invalid={isInvalid}
            className={cn(
              "h-11 w-full justify-between rounded-none border-black text-sm",
              !selectedDisplay && "text-muted-foreground",
              isInvalid && "border border-destructive"
            )}
            disabled={disabled}
            type="button"
            variant="outline"
          >
            {selectedDisplay}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
          <Command shouldFilter={false}>
            <CommandInput
              className="h-8 text-primary text-sm"
              onKeyDown={handleCustomInput}
              onValueChange={setSearchQuery}
              placeholder={searchPlaceholder}
            />

            <CommandList onScroll={handleScroll} ref={scrollRef}>
              {loading && !loadingMore && (
                <div className="flex items-center gap-2 p-2 text-muted-foreground text-xs">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading...
                </div>
              )}

              {!loading && displayOptions.length === 0 && (
                <CommandEmpty className="p-2 text-xs">
                  {emptyMessage}
                  {allowCustomInput && searchQuery && (
                    <div className="mt-2 text-primary">
                      Press Enter to use "{searchQuery}"
                    </div>
                  )}
                </CommandEmpty>
              )}

              {displayOptions.length > 0 && (
                <CommandGroup>
                  {displayOptions.map((opt) => {
                    const selected = multiselect
                      ? Array.isArray(field.state.value) &&
                        field.state.value.includes(opt.value)
                      : field.state.value === opt.value;

                    return (
                      <CommandItem
                        className="cursor-pointer text-sm"
                        key={String(opt.value)}
                        onSelect={() => handleSelect(opt.value, opt)}
                        value={String(opt.value)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selected ? "opacity-100" : "opacity-0"
                          )}
                        />

                        {opt.icon && (
                          <span className="mr-2 shrink-0">{opt.icon}</span>
                        )}

                        <span>{opt.label}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}

              {loadingMore && (
                <div className="flex items-center justify-center gap-2 p-2 text-muted-foreground text-xs">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading more...
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </FormBase>
  );
}
