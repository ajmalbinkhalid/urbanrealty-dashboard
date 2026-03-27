import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type ComboBoxOption = {
  id: string | number;
  name: string;
};

type CustomComboBoxProps<T = unknown> = {
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
};

const CustomComboBox = <T = unknown>({
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
}: CustomComboBoxProps<T>) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: transformedApiData,
    isLoading: apiIsLoading,
    isError: apiIsError,
  } = useQuery({
    queryKey: [name, queryKey ?? ""],
    queryFn: apiFunction ?? (() => Promise.resolve([] as unknown as T)),
    enabled: apiFunction !== undefined && open,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: transformData,
  });

  const isLoading = apiIsLoading;
  const isError = apiIsError;

  let displayOptions: ComboBoxOption[] = [];
  if (enumValues) {
    displayOptions = Object.entries(enumValues).map(([name, id]) => ({
      id: String(id),
      name: name.replace(/_/g, " "),
    }));
  } else if (apiFunction !== undefined) {
    displayOptions = transformedApiData ?? [];
  } else {
    displayOptions = options;
  }

  const selectedOption = displayOptions.find(
    (opt) => opt.id === value || String(opt.id) === String(value)
  );

  const filteredOptions = searchTerm
    ? displayOptions.filter((opt) =>
        opt.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : displayOptions;

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
              !selectedOption && "text-gray-500",
              className
            )}
            disabled={disabled || isLoading}
            role="combobox"
            variant="outline"
          >
            <div className="w-full text-start">
              {selectedOption ? selectedOption.name : placeholder}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
              {isLoading && (
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
                  No options found.
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

CustomComboBox.displayName = "CustomComboBox3";

export default CustomComboBox;
