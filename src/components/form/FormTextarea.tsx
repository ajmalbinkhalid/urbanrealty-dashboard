import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";

type ExtraProps = {
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  dir?: string;
};

export function FormTextarea(props: FormControlProps & ExtraProps) {
  const { placeholder, rows = 4, maxLength, dir } = props;

  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...props}>
      <Textarea
        aria-invalid={isInvalid}
        className={cn(
          "resize-y rounded-none border-black",
          "overflow-hidden",
          "min-h-20",
          isInvalid && "border-destructive"
        )}
        dir={dir}
        id={field.name}
        maxLength={maxLength}
        name={field.name}
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
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        value={field.state.value}
      />
    </FormBase>
  );
}
