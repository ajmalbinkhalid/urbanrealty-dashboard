import { Check, ChevronDown } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

type FilterField = {
  key: string;
  label: string;
  type?: "text" | "select" | "date";
  options?: { label: string; value: unknown }[];
  placeholder?: string;
};

type FilterDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filterFields: FilterField[];
  filters: Record<string, unknown>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  onApply: () => void;
};

export function FilterDialog({
  open,
  onOpenChange,
  filterFields,
  filters,
  setFilters,
  onApply,
}: FilterDialogProps) {
  const [localFilters, setLocalFilters] =
    React.useState<Record<string, unknown>>(filters);
  React.useEffect(() => {
    if (open) {
      setLocalFilters(filters);
    }
  }, [open, filters]);

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-9"
          onSubmit={(e) => {
            e.preventDefault();
            setFilters(localFilters);
            onOpenChange(false);
            onApply();
          }}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filterFields.map((field) => (
              <div className="flex flex-col gap-1" key={field.key}>
                <label className="font-medium text-sm">{field.label}</label>
                {field.type === "select" && field.options ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="w-full text-left" variant="outline">
                        {localFilters[field.key]
                          ? field.options.find(
                              (opt) => opt.value === localFilters[field.key]
                            )?.label
                          : field.placeholder || "Select"}
                        <ChevronDown className="ml-auto h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {field.options.map((opt) => (
                        <DropdownMenuItem
                          className={
                            localFilters[field.key] === opt.value
                              ? "bg-green-100 text-green-800"
                              : ""
                          }
                          key={`${opt.value}`}
                          onClick={() =>
                            setLocalFilters((f) => ({
                              ...f,
                              [field.key]: opt.value,
                            }))
                          }
                        >
                          {opt.label}
                          {localFilters[field.key] === opt.value && (
                            <Check className="ml-auto h-4 w-4" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Input
                    onChange={(e) =>
                      setLocalFilters((f) => ({
                        ...f,
                        [field.key]: e.target.value,
                      }))
                    }
                    placeholder={field.placeholder}
                    type={field.type || "text"}
                    value={`${localFilters[field.key] ?? ""}`}
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setLocalFilters({});
              }}
              type="button"
              variant="outline"
            >
              Clear Filters
            </Button>
            <Button type="submit">Apply Filters</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
