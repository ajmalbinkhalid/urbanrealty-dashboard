import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
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
import { Label } from "../ui/label";

export type ComboBoxOption = {
  id: string | number;
  name: string;
};

type CustomComboBox3Props<T = unknown> = {
  name: string;
  value?: string | number;
  onValueChange: (value: string | number) => void;
  options?: ComboBoxOption[];
  placeholder?: string;
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  isSearchable?: boolean;
  enumValues?: Record<string, string | number>;
  apiFunction?: () => Promise<T>;
  transformData?: (data: T) => ComboBoxOption[];
  className?: string;
  queryKey?: Record<string, unknown>;
  // NEW: Add these props for edit mode
  defaultValue?: string;
  initialOptions?: ComboBoxOption[];
  isLoadingForm?: boolean;
};

const CustomComboBox3 = <T = unknown>({
  name,
  value,
  onValueChange,
  options = [],
  placeholder = "Select option...",
  label,
  error,
  required,
  disabled = false,
  isSearchable = true,
  enumValues,
  apiFunction,
  transformData,
  className,
  queryKey,
  // NEW props
  initialOptions = [],
  isLoadingForm = false,
}: CustomComboBox3Props<T>) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [internalOptions, setInternalOptions] =
    useState<ComboBoxOption[]>(initialOptions);

  // Always fetch API data, not just when open
  const {
    data: transformedApiData,
    isLoading: apiIsLoading,
    isError: apiIsError,
  } = useQuery({
    queryKey: [name, queryKey ?? ""],
    queryFn: apiFunction ?? (() => Promise.resolve([] as unknown as T)),
    enabled: apiFunction !== undefined, // ALWAYS enabled if apiFunction exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: transformData,
  });

  // Update options when API data loads
  useEffect(() => {
    if (transformedApiData) {
      setInternalOptions(transformedApiData);
    }
  }, [transformedApiData]);

  // Update options when enumValues changes
  useEffect(() => {
    if (enumValues) {
      const enumOptions = Object.entries(enumValues).map(([name, id]) => ({
        id: String(id),
        name: name.replace(/_/g, " "),
      }));
      setInternalOptions(enumOptions);
    }
  }, [enumValues]);

  // Update options when static options change
  useEffect(() => {
    if (options.length > 0) {
      setInternalOptions(options);
    }
  }, [options]);

  const isLoading = apiIsLoading || isLoadingForm;
  const isError = apiIsError;

  const selectedOption = internalOptions.find(
    (opt) => opt.id === value || String(opt.id) === String(value)
  );

  // Get display name for selected value
  const getDisplayName = () => {
    if (selectedOption) return selectedOption.name;

    // If we have a value but options haven't loaded yet
    if (value && (isLoading || internalOptions.length === 0)) {
      // Try to find in initial options
      const found = initialOptions.find(
        (opt) => opt.id === value || String(opt.id) === String(value)
      );
      if (found) return found.name;

      // Return the value as string as fallback
      return String(value);
    }

    return placeholder;
  };

  const filteredOptions = searchTerm
    ? internalOptions.filter((opt) =>
        opt.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : internalOptions;

  return (
    <div className="w-full">
      {label && (
        <Label
          className="font-semibold text-[#474777] text-[.875rem]"
          htmlFor={name}
        >
          {label}
          {required && <span className="text-red-500"> *</span>}
        </Label>
      )}
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            aria-expanded={open}
            className={cn(
              "mt-2.5 h-auto w-full cursor-pointer rounded-[.375rem] border border-[#6254B4] bg-white px-3.75 py-2.5 font-medium text-[.875rem] placeholder-gray-400 transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500",
              !selectedOption && value && "text-gray-900", // Show text even if not found in options
              className
            )}
            disabled={disabled || isLoading}
            role="combobox"
            variant="outline"
          >
            <div className="w-full text-start">{getDisplayName()}</div>
            {isLoading ? (
              <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
            ) : (
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0"
          style={{ width: "var(--radix-popover-trigger-width)" }}
        >
          <Command shouldFilter={false}>
            {isSearchable && (
              <CommandInput
                onValueChange={setSearchTerm}
                placeholder="Search..."
                value={searchTerm}
              />
            )}
            <CommandList>
              {isLoading && internalOptions.length === 0 && (
                <CommandEmpty className="py-6 text-center text-gray-500 text-sm">
                  Loading options...
                </CommandEmpty>
              )}
              {isError && (
                <CommandEmpty className="py-6 text-center text-red-500 text-sm">
                  Failed to load options
                </CommandEmpty>
              )}
              {!(isLoading || isError) && filteredOptions.length === 0 && (
                <CommandEmpty className="py-6 text-center text-gray-500 text-sm">
                  {searchTerm
                    ? "No matching options found."
                    : "No options available."}
                </CommandEmpty>
              )}
              {!(isLoading || isError) && (
                <CommandGroup>
                  {filteredOptions.map((option) => (
                    <CommandItem
                      key={option.id}
                      onSelect={(currentValue) => {
                        onValueChange(
                          currentValue === String(value) ? "" : option.id
                        );
                        setOpen(false);
                        setSearchTerm("");
                      }}
                      value={String(option.id)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option.id ||
                            String(value) === String(option.id)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {option.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="mt-1 text-[.75rem] text-red-500">* {error}</p>}
    </div>
  );
};

CustomComboBox3.displayName = "CustomComboBox3";

export default CustomComboBox3;
