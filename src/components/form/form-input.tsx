import { Input } from "../ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";

type ExtraProps = {
  placeholder?: string;
  autoComplete?: string;
  type?: string;
  group?: boolean;
  startWith?: React.ReactNode;
  addonRight?: React.ReactNode;
  dir?: string;
  required?: boolean;
};

export function FormInput(props: FormControlProps & ExtraProps) {
  const {
    placeholder,
    required = false,
    dir,
    autoComplete,
    type = "text",
    group,
    startWith,
    addonRight,
  } = props;

  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...props} required={required}>
      {group ? (
        <InputGroup className="h-12 rounded-none border border-black">
          {startWith && <InputGroupAddon>{startWith}</InputGroupAddon>}

          <InputGroupInput
            aria-invalid={isInvalid}
            autoComplete={autoComplete}
            id={field.name}
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
            type={type}
            value={field.state.value}
          />

          {addonRight && <InputGroupAddon>{addonRight}</InputGroupAddon>}
        </InputGroup>
      ) : (
        <Input
          aria-invalid={isInvalid}
          autoComplete={autoComplete}
          className="h-11 rounded-none border border-black bg-background!"
          dir={dir}
          id={field.name}
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
          type={type}
          value={field.state.value}
        />
      )}
    </FormBase>
  );
}
