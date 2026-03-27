import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { FormAutocomplete } from "./FormAutoComplete";
import { FormCheckbox } from "./FormCheckbox";
import { FormCombobox } from "./FormCombobox";
import { FormCountryPicker } from "./FormCountryPicker";
import { FormDatePicker } from "./FormDatePicker";
import { FormEditor } from "./FormEditor";
import { FormPassword } from "./FormPassword";
import { FormRadioGroup } from "./FormRadioGroup";
import { FormTabRadioGroup } from "./FormTabRadioGroup";
import { FormTextarea } from "./FormTextarea";
import { FormFileUploader } from "./form-file-uploader";
import { FormInput } from "./form-input";
import { FormPhone } from "./form-phone";

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    Input: FormInput,
    Textarea: FormTextarea,
    Checkbox: FormCheckbox,
    RadioGroup: FormRadioGroup,
    TabRadioGroup: FormTabRadioGroup,
    Password: FormPassword,
    Combobox: FormCombobox,
    Phone: FormPhone,
    DatePicker: FormDatePicker,
    CountryPicker: FormCountryPicker,
    Editor: FormEditor,
    AutoComplete: FormAutocomplete,
    FileUploader: FormFileUploader,
  },
  formComponents: {},
  fieldContext,
  formContext,
});

export { useAppForm, useFieldContext, useFormContext };
