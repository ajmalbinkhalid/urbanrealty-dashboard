import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";

type RadioOption = {
  label: string;
  value: string;
};

interface FormRadioGroupProps extends FormControlProps {
  options: RadioOption[];
}

export function FormRadioGroup({ options, ...props }: FormRadioGroupProps) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...props} controlFirst>
      <RadioGroup
        aria-invalid={isInvalid}
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
        onValueChange={field.handleChange}
        value={field.state.value}
      >
        <div className="flex gap-4">
          {options.map((opt) => (
            <div className="flex items-center gap-2" key={opt.value}>
              <RadioGroupItem
                className=""
                id={`${field.name}-${opt.value}`}
                value={opt.value}
              />
              <Label htmlFor={`${field.name}-${opt.value}`}>{opt.label}</Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </FormBase>
  );
}
