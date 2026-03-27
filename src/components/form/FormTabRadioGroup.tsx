import { cn } from "@/lib/utils";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";

type TabOption = {
  label: string;
  value: string;
};

interface FormTabRadioGroupProps extends FormControlProps {
  options: TabOption[];
  className?: string;
}

export function FormTabRadioGroup({
  options,
  className,
  ...props
}: FormTabRadioGroupProps) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...props} controlFirst>
      <div
        aria-invalid={isInvalid}
        className={cn("flex gap-3", className)}
        role="radiogroup"
      >
        {options.map((opt) => {
          const isActive = field.state.value === opt.value;

          return (
            <button
              aria-checked={isActive}
              className={cn(
                "rounded-md border px-6 py-3 font-medium text-sm transition",
                "hover:border-primary",
                isActive
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-muted text-muted-foreground"
              )}
              key={opt.value}
              onBlur={() => {
                field.handleBlur();
                field.setMeta((prev) => ({
                  ...prev,
                  errorMap: {
                    ...prev.errorMap,
                    onServer: undefined,
                  },
                }));
              }}
              onClick={() => field.handleChange(opt.value)}
              role="radio"
              type="button"
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </FormBase>
  );
}
