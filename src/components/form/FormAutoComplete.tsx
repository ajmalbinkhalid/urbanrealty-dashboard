"use client";

import { useMutation } from "@tanstack/react-query";
import { FormCombobox } from "@/components/form/FormCombobox";

type SearchFn = (
  query: string,
  page: number,
  pageSize: number
) => Promise<{
  results: { value: string; label: string }[];
  hasMore: boolean;
}>;

type ViewFn<T> = (id: string) => Promise<T>;

interface FormAutocompleteProps<T> {
  label: string;
  placeholder?: string;
  searchPlaceholder?: string;
  pageSize?: number;

  /** Required */
  searchFn: SearchFn;

  /** Optional: fetch full object after select */
  viewFn?: ViewFn<T>;

  /** Optional: side-effects after loading object */
  onItemLoaded?: (item: T) => void;

  /** Forwarded to FormBase */
  name?: string;
  disabled?: boolean;
}

export function FormAutocomplete<T>({
  label,
  placeholder,
  searchPlaceholder,
  pageSize = 10,
  searchFn,
  viewFn,
  onItemLoaded,
  name,
  disabled,
}: FormAutocompleteProps<T>) {
  const loadItem = useMutation({
    mutationFn: async (id: string) => {
      if (!viewFn) return null;
      return viewFn(id);
    },
    onSuccess(data) {
      if (data && onItemLoaded) {
        onItemLoaded(data);
      }
    },
  });

  return (
    <FormCombobox
      disabled={disabled}
      label={label}
      onSearch={searchFn}
      onSelect={(id: string) => {
        if (viewFn) loadItem.mutate(id);
      }}
      pageSize={pageSize}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
    />
  );
}
