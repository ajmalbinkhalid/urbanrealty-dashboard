import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../ui/field";
import { useFieldContext } from "./hooks";

export type FormControlProps = {
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
};

type FormBaseProps = FormControlProps & {
  children: ReactNode;
  horizontal?: boolean;
  controlFirst?: boolean;
  required?: boolean;
};

export function FormBase({
  children,
  label,
  required,
  description,
  horizontal,
}: FormBaseProps) {
  const field = useFieldContext();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  // Access your Zod schema
  // const schema = field.form.options?.validators?.onSubmit;

  // Determine if field is required using Zod shape
  // const zodField = schema?.shape?.[field.name];

  // const isRequired =
  //   zodField && !zodField.isOptional?.() && !zodField.isNullable?.();

  return (
    <Field
      className={cn("relative", isInvalid ? "pb-5" : "pb-5")}
      data-invalid={isInvalid}
      orientation={horizontal ? "horizontal" : undefined}
    >
      <FieldContent>
        <FieldLabel
          className="mb-1 gap-0 font-medium text-sm"
          htmlFor={field.name}
        >
          {label}{" "}
          {required && (
            <span className="text-[#FE6B35] text-xl leading-none">*</span>
          )}
        </FieldLabel>

        {description && (
          <FieldDescription className="text-xs">{description}</FieldDescription>
        )}

        {children}

        <FieldError className="text-xs" errors={field.state.meta.errors} />
      </FieldContent>
    </Field>
  );
}
