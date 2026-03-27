"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Field, FieldContent, FieldError } from "../ui/field";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";

const phoneCodes = [
  { phoneCode: "+1", country: "US" },
  // { phoneCode: "+1", country: "CA" },
  { phoneCode: "+44", country: "GB" },
  { phoneCode: "+33", country: "FR" },
  { phoneCode: "+49", country: "DE" },
  { phoneCode: "+39", country: "IT" },
  { phoneCode: "+34", country: "ES" },
  { phoneCode: "+31", country: "NL" },
  { phoneCode: "+32", country: "BE" },
  { phoneCode: "+41", country: "CH" },
  { phoneCode: "+43", country: "AT" },
  { phoneCode: "+45", country: "DK" },
  { phoneCode: "+46", country: "SE" },
  { phoneCode: "+47", country: "NO" },
  { phoneCode: "+358", country: "FI" },
  { phoneCode: "+48", country: "PL" },
  { phoneCode: "+420", country: "CZ" },
  { phoneCode: "+421", country: "SK" },
  { phoneCode: "+36", country: "HU" },
  { phoneCode: "+40", country: "RO" },
  { phoneCode: "+359", country: "BG" },
  { phoneCode: "+30", country: "GR" },
  { phoneCode: "+353", country: "IE" },
  { phoneCode: "+372", country: "EE" },
  { phoneCode: "+371", country: "LV" },
  { phoneCode: "+370", country: "LT" },
  { phoneCode: "+7", country: "RU" },
  { phoneCode: "+380", country: "UA" },
  { phoneCode: "+375", country: "BY" },
  { phoneCode: "+90", country: "TR" },
  { phoneCode: "+91", country: "IN" },
  { phoneCode: "+92", country: "PK" },
  { phoneCode: "+880", country: "BD" },
  { phoneCode: "+94", country: "LK" },
  { phoneCode: "+886", country: "TW" },
  { phoneCode: "+81", country: "JP" },
  { phoneCode: "+82", country: "KR" },
  { phoneCode: "+86", country: "CN" },
  { phoneCode: "+65", country: "SG" },
  { phoneCode: "+60", country: "MY" },
  { phoneCode: "+62", country: "ID" },
  { phoneCode: "+66", country: "TH" },
  { phoneCode: "+84", country: "VN" },
  { phoneCode: "+63", country: "PH" },
  { phoneCode: "+64", country: "NZ" },
  { phoneCode: "+61", country: "AU" },
  { phoneCode: "+27", country: "ZA" },
  { phoneCode: "+20", country: "EG" },
  { phoneCode: "+212", country: "MA" },
  { phoneCode: "+234", country: "NG" },
  { phoneCode: "+254", country: "KE" },
  { phoneCode: "+256", country: "UG" },
  { phoneCode: "+255", country: "TZ" },
  { phoneCode: "+250", country: "RW" },
  { phoneCode: "+55", country: "BR" },
  { phoneCode: "+54", country: "AR" },
  { phoneCode: "+56", country: "CL" },
  { phoneCode: "+57", country: "CO" },
  { phoneCode: "+51", country: "PE" },
  { phoneCode: "+58", country: "VE" },
  { phoneCode: "+591", country: "BO" },
  { phoneCode: "+595", country: "PY" },
  { phoneCode: "+598", country: "UY" },
  { phoneCode: "+52", country: "MX" },
  { phoneCode: "+507", country: "PA" },
  { phoneCode: "+506", country: "CR" },
  { phoneCode: "+503", country: "SV" },
  { phoneCode: "+504", country: "HN" },
  { phoneCode: "+505", country: "NI" },
  { phoneCode: "+502", country: "GT" },
  { phoneCode: "+501", country: "BZ" },
  { phoneCode: "+974", country: "QA" },
  { phoneCode: "+966", country: "SA" },
  { phoneCode: "+971", country: "AE" },
  { phoneCode: "+965", country: "KW" },
  { phoneCode: "+973", country: "BH" },
  { phoneCode: "+968", country: "OM" },
  { phoneCode: "+962", country: "JO" },
  { phoneCode: "+963", country: "SY" },
  { phoneCode: "+961", country: "LB" },
  { phoneCode: "+970", country: "PS" },
  { phoneCode: "+972", country: "IL" },
  { phoneCode: "+964", country: "IQ" },
  { phoneCode: "+98", country: "IR" },
  { phoneCode: "+993", country: "TM" },
  { phoneCode: "+998", country: "UZ" },
  { phoneCode: "+992", country: "TJ" },
  { phoneCode: "+996", country: "KG" },
  { phoneCode: "+994", country: "AZ" },
  { phoneCode: "+374", country: "AM" },
  { phoneCode: "+995", country: "GE" },
];

export function FormPhone({ label, required = false }: FormControlProps) {
  const field = useFieldContext<{ phoneCode?: string; phoneNumber?: string }>();

  const safeValue = {
    phoneCode: field.state.value?.phoneCode ?? "",
    phoneNumber: field.state.value?.phoneNumber ?? "",
  };

  const phoneCodeMeta = field.form.getFieldMeta(`${field.name}.phoneCode`);
  const phoneNumberMeta = field.form.getFieldMeta(`${field.name}.phoneNumber`);

  const isTouched =
    field.state.meta.isTouched ||
    (phoneNumberMeta?.isTouched ?? false) ||
    (phoneCodeMeta?.isTouched ?? false);

  const isInvalid = !(
    field.state.meta.isValid &&
    (phoneNumberMeta?.isValid ?? true) &&
    (phoneCodeMeta?.isValid ?? true)
  );

  // const schema = field.form.options?.validators?.onSubmit;
  // const zodField = schema?.shape?.[field.name];

  // const isRequired =
  //   zodField && !zodField.isOptional?.() && !zodField.isNullable?.();

  const [open, setOpen] = React.useState(false);

  const phoneNumberErrors = Array.isArray((phoneNumberMeta?.errors || []).at(0))
    ? (phoneNumberMeta?.errors || [])[0]
    : phoneNumberMeta?.errors || [];

  const phoneCodeErrors = Array.isArray((phoneCodeMeta?.errors || []).at(0))
    ? (phoneCodeMeta?.errors || [])[0]
    : phoneCodeMeta?.errors || [];

  const allErrors = [
    ...(field.state.meta.errors || []),
    ...phoneCodeErrors,
    ...phoneNumberErrors,
  ];

  return (
    <FormBase label={label} required={required}>
      <Field className="relative pb-5" data-invalid={isTouched && isInvalid}>
        <FieldContent>
          {/* <FieldLabel className="mb-1 font-medium text-sm" htmlFor={field.name}>
            {label}
            {isRequired && <span className="text-destructive">*</span>}
          </FieldLabel> */}
          <InputGroup className="h-11 rounded-none border border-black bg-background!">
            {/* LEFT: CODE SELECT */}
            <Popover modal={false} onOpenChange={setOpen} open={open}>
              <PopoverTrigger asChild>
                <InputGroupAddon
                  className={cn(
                    "h-8 cursor-pointer select-none px-2 text-sm",
                    "flex items-center justify-between gap-1",
                    "rounded-l-md border-r",
                    "min-w-20 shrink-0"
                  )}
                >
                  {safeValue.phoneCode ? `${safeValue.phoneCode}` : "+ Code"}

                  <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
                </InputGroupAddon>
              </PopoverTrigger>

              <PopoverContent className="w-40 p-0">
                <Command>
                  <CommandInput
                    className="h-8 text-sm"
                    placeholder="Search Code..."
                  />
                  <CommandEmpty className="p-2 text-xs">
                    No phoneCode found.
                  </CommandEmpty>

                  <CommandGroup>
                    <CommandList
                      className="max-h-64 overflow-y-auto"
                      onWheel={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {phoneCodes.map((item, index) => (
                        <CommandItem
                          className="h-8 cursor-pointer text-sm"
                          key={`${item.phoneCode}-${item.country}-${index}`}
                          onSelect={() => {
                            field.handleChange({
                              ...safeValue,
                              phoneCode: item.phoneCode,
                            });
                            setOpen(false);
                          }}
                          value={`${item.phoneCode} ${item.country}`}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              safeValue.phoneCode === item.phoneCode
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {item.phoneCode} ({item.country})
                        </CommandItem>
                      ))}
                    </CommandList>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            <InputGroupInput
              aria-invalid={isTouched && isInvalid}
              className="h-12 rounded-none"
              onBlur={() => {
                field.handleBlur();
                field.setMeta((prev) => ({
                  ...prev,
                  errorMap: {
                    ...(prev?.errorMap || {}),
                    onServer: undefined,
                  },
                }));
                field.form.setFieldMeta(
                  `${field.name}.phoneNumber`,
                  (prev) => ({
                    ...prev,
                    errorMap: {
                      ...(prev?.errorMap || {}),
                      onServer: undefined,
                    },
                  })
                );
              }}
              onChange={(e) =>
                field.handleChange({
                  ...safeValue,
                  phoneNumber: e.target.value,
                })
              }
              placeholder="Phone Number"
              type="text"
              value={safeValue.phoneNumber}
            />
          </InputGroup>
          <FieldError className="text-xs" errors={allErrors} />
        </FieldContent>
      </Field>
    </FormBase>
  );
}
