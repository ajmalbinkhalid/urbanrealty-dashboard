"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
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
export interface CountryOption {
  code: string;
  label: string;
  phone: string;
}

type ExtraProps = {
  countries: CountryOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  phoneCodeFieldNames?: string[];
};

//
// FormCountryPicker Component
//
export function FormCountryPicker(props: FormControlProps & ExtraProps) {
  const {
    countries = [],
    placeholder = "Select country...",
    searchPlaceholder = "Search country...",
    emptyMessage = "No country found.",
    disabled,
    phoneCodeFieldNames,
  } = props;

  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  //
  // Filter countries based on search
  //
  const filteredCountries = React.useMemo(() => {
    if (!searchQuery) return countries;

    return countries.filter((country) =>
      country.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [countries, searchQuery]);

  //
  // Get selected country
  //
  const selectedCountry = React.useMemo(() => {
    return countries.find((c) => c.label === field.state.value);
  }, [field.state.value, countries]);

  //
  // Display label
  //
  const selectedDisplay = React.useMemo(() => {
    if (!selectedCountry) return placeholder;

    return (
      <div className="flex items-center gap-2">
        <img
          alt=""
          className="flex-shrink-0"
          src={`https://flagcdn.com/w20/${selectedCountry.code.toLowerCase()}.png`}
          srcSet={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png 2x`}
          width="20"
        />
        <span>
          {selectedCountry.label} ({selectedCountry.code}) +
          {selectedCountry.phone}
        </span>
      </div>
    );
  }, [selectedCountry, placeholder]);

  //
  // Handle selection
  //
  const handleSelect = React.useCallback(
    (countryLabel: string) => {
      const country = countries.find((c) => c.label === countryLabel);

      if (country) {
        field.handleChange(country.label);

        if (phoneCodeFieldNames?.length) {
          phoneCodeFieldNames.forEach((name) => {
            field.form.setFieldValue(name, `+${country?.phone}`);
          });
        }
      }

      setOpen(false);
      setSearchQuery("");
    },
    [field, countries, phoneCodeFieldNames]
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
              "h-8 w-full justify-between text-sm",
              !selectedCountry && "text-muted-foreground",
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
              className="h-8 text-sm"
              onValueChange={setSearchQuery}
              placeholder={searchPlaceholder}
            />

            <CommandList>
              <CommandEmpty className="p-2 text-xs">
                {emptyMessage}
              </CommandEmpty>

              <CommandGroup className="max-h-64 overflow-auto">
                {filteredCountries.map((country) => {
                  const selected = field.state.value === country.label;

                  return (
                    <CommandItem
                      className="cursor-pointer text-sm"
                      key={country.code}
                      onSelect={() => handleSelect(country.label)}
                      value={country.label}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selected ? "opacity-100" : "opacity-0"
                        )}
                      />

                      <img
                        alt=""
                        className="mr-2 shrink-0"
                        src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                        srcSet={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png 2x`}
                        width="20"
                      />

                      <span>
                        {country.label} ({country.code}) +{country.phone}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </FormBase>
  );
}
