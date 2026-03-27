import {
  format,
  startOfMonth,
  startOfToday,
  startOfWeek,
  startOfYesterday,
  subDays,
} from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";

type ExtraProps = {
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  mode?: "single" | "range";
};

export function FormDatePicker(props: FormControlProps & ExtraProps) {
  const { placeholder, className, disabled = false, mode = "single" } = props;

  const defaultPlaceholder =
    mode === "range" ? "Pick a date range" : "Pick a date";
  const finalPlaceholder = placeholder || defaultPlaceholder;

  const field = useFieldContext<Date | DateRange | undefined>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const formatDateDisplay = (value: Date | DateRange | undefined) => {
    if (mode === "range") {
      if (
        value &&
        typeof value === "object" &&
        "from" in value &&
        "to" in value &&
        value.to
      ) {
        return `${format(value.from!, "LLL dd, y")} - ${format(value.to, "LLL dd, y")}`;
      }
      if (value && typeof value === "object" && "from" in value && value.from) {
        return `${format(value.from, "LLL dd, y")} - Select end date`;
      }
      return finalPlaceholder;
    }
    return value ? format(value as Date, "PPP") : finalPlaceholder;
  };

  const handleQuickSelect = (date: Date | DateRange) => {
    field.handleChange(date);
  };

  return (
    <FormBase {...props}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              "h-8 w-full min-w-[230px] justify-start text-left font-normal",
              !field.state.value && "text-muted-foreground",
              isInvalid && "border-red-500 focus:border-red-500",
              className
            )}
            disabled={disabled}
            id={field.name}
            variant="outline"
          >
            <CalendarIcon className="mr-2 h-3 w-4" />
            {formatDateDisplay(field.state.value)}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <div className="flex">
            <div className="flex flex-col border-r p-3">
              {mode === "single" ? (
                <>
                  <Button
                    className="h-8 justify-start px-2 text-xs"
                    onClick={() => handleQuickSelect(startOfToday())}
                    size="sm"
                    variant="ghost"
                  >
                    Today
                  </Button>
                  <Button
                    className="h-8 justify-start px-2 text-xs"
                    onClick={() => handleQuickSelect(startOfYesterday())}
                    size="sm"
                    variant="ghost"
                  >
                    Yesterday
                  </Button>
                  <Button
                    className="h-8 justify-start px-2 text-xs"
                    onClick={() => handleQuickSelect(startOfWeek(new Date()))}
                    size="sm"
                    variant="ghost"
                  >
                    This Week
                  </Button>
                  <Button
                    className="h-8 justify-start px-2 text-xs"
                    onClick={() => handleQuickSelect(startOfMonth(new Date()))}
                    size="sm"
                    variant="ghost"
                  >
                    This Month
                  </Button>
                  <Button
                    className="h-8 justify-start px-2 text-xs"
                    onClick={() => handleQuickSelect(subDays(new Date(), 7))}
                    size="sm"
                    variant="ghost"
                  >
                    7 Days Ago
                  </Button>
                  <Button
                    className="h-8 justify-start px-2 text-xs"
                    onClick={() => handleQuickSelect(subDays(new Date(), 30))}
                    size="sm"
                    variant="ghost"
                  >
                    30 Days Ago
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="h-8 justify-start px-2 text-xs"
                    onClick={() =>
                      handleQuickSelect({
                        from: startOfToday(),
                        to: new Date(),
                      })
                    }
                    size="sm"
                    variant="ghost"
                  >
                    Today
                  </Button>
                  <Button
                    className="h-8 justify-start px-2 text-xs"
                    onClick={() =>
                      handleQuickSelect({
                        from: startOfYesterday(),
                        to: startOfToday(),
                      })
                    }
                    size="sm"
                    variant="ghost"
                  >
                    Yesterday
                  </Button>
                  <Button
                    className="h-8 justify-start px-2 text-xs"
                    onClick={() =>
                      handleQuickSelect({
                        from: startOfWeek(new Date()),
                        to: new Date(),
                      })
                    }
                    size="sm"
                    variant="ghost"
                  >
                    This Week
                  </Button>
                  <Button
                    className="h-8 justify-start px-2 text-xs"
                    onClick={() =>
                      handleQuickSelect({
                        from: startOfMonth(new Date()),
                        to: new Date(),
                      })
                    }
                    size="sm"
                    variant="ghost"
                  >
                    This Month
                  </Button>
                  <Button
                    className="h-8 justify-start px-2 text-xs"
                    onClick={() =>
                      handleQuickSelect({
                        from: subDays(new Date(), 7),
                        to: new Date(),
                      })
                    }
                    size="sm"
                    variant="ghost"
                  >
                    Last 7 Days
                  </Button>
                  <Button
                    className="h-8 justify-start px-2 text-xs"
                    onClick={() =>
                      handleQuickSelect({
                        from: subDays(new Date(), 30),
                        to: new Date(),
                      })
                    }
                    size="sm"
                    variant="ghost"
                  >
                    Last 30 Days
                  </Button>
                </>
              )}
            </div>
            {mode === "single" ? (
              <Calendar
                autoFocus
                captionLayout="dropdown"
                disabled={disabled}
                mode="single"
                onSelect={(date) => field.handleChange(date)}
                selected={field.state.value as Date}
              />
            ) : (
              <Calendar
                autoFocus
                captionLayout="dropdown"
                disabled={disabled}
                mode="range"
                numberOfMonths={2}
                onSelect={(date) => field.handleChange(date)}
                selected={field.state.value as DateRange}
              />
            )}
          </div>
        </PopoverContent>
      </Popover>
    </FormBase>
  );
}
