import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";

export function FormPassword(props: FormControlProps) {
  const { placeholder } = props;
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const [show, setShow] = useState(false);

  return (
    <FormBase {...props}>
      <div className="relative">
        <InputGroup>
          <InputGroupInput
            aria-invalid={isInvalid}
            className="pr-10"
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
            placeholder= {placeholder}
            type={show ? "text" : "password"}
            value={field.state.value}
          />

          <InputGroupAddon>
            {" "}
            <button
              className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShow((prev) => !prev)}
              tabIndex={-1}
              type="button"
            >
              {show ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </FormBase>
  );
}
