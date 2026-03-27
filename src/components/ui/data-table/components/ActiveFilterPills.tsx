import { Badge } from "@/components/ui/badge";

interface FilterField {
  key: string;
  label: string;
  type?: "text" | "select" | "date";
  options?: { label: string; value: any }[];
  placeholder?: string;
}

interface ActiveFilterPillsProps {
  filters: Record<string, any>;
  filterFields: FilterField[];
  setFilters: (filters: Record<string, any>) => void;
  refetch: () => void;
}

export function ActiveFilterPills({
  filters,
  filterFields,
  setFilters,
  refetch,
}: ActiveFilterPillsProps) {
  if (Object.keys(filters).length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 py-4">
      <div className="text-muted-foreground text-sm">Filters:</div>
      {Object.entries(filters).map(([key, value]) =>
        value ? (
          <Badge
            className="flex items-center gap-2 px-3 py-1 font-medium text-xs"
            key={key}
            variant="secondary"
          >
            {(() => {
              const field = filterFields.find((f) => f.key === key);
              if (field && field.type === "select" && field.options) {
                const opt = field.options.find((o) => o.value === value);
                return opt
                  ? `${field.label}: ${opt.label}`
                  : `${field.label}: ${value}`;
              }
              return `${field?.label || key}: ${value}`;
            })()}
            <button
              aria-label={`Remove filter ${key}`}
              className="ml-2 cursor-pointer rounded-full bg-muted p-0.5 transition hover:bg-accent"
              onClick={() => {
                const newFilters = { ...filters };
                delete newFilters[key];
                setFilters(newFilters);
                refetch();
              }}
              type="button"
            >
              <span className="text-base text-muted-foreground leading-none">
                &times;
              </span>
            </button>
          </Badge>
        ) : null
      )}
    </div>
  );
}
