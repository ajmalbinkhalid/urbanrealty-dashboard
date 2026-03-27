"use client";

import { Search, X } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

type TableSearchInputProps = {
  searchPlaceholder: string;
  query: string;
  setQuery: (q: string) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
};

export function TableSearchInput({
  searchPlaceholder,
  query,
  setQuery,
  onKeyDown,
}: TableSearchInputProps) {
  const handleClear = () => {
    setQuery("");
  };

  return (
    <div className="w-full rounded-xl bg-white p-2 shadow-sm">
      <InputGroup className="w-full dark:bg-page-background">
        <InputGroupAddon align="inline-start">
          <Search className="size-4 text-muted-foreground" />
        </InputGroupAddon>
        <InputGroupInput
          onChange={(event) => setQuery(event.target.value)}
          placeholder={searchPlaceholder}
          value={query}
          onKeyDown={onKeyDown}
        />
        {query.length > 0 && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton aria-label="Clear search" onClick={handleClear}>
              <X className="h-4 w-4" />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
    </div>
  );
}
