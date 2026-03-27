import { MinimalTiptap } from "../ui/shadcn-io/minimal-tiptap";
import { Skeleton } from "../ui/skeleton";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";

type ExtraProps = {
  placeholder?: string;
  editable?: boolean;
  className?: string;
  dir?: "ltr" | "rtl";
};

export function FormEditor(props: FormControlProps & ExtraProps) {
  const { placeholder, editable = true, className, dir } = props;

  const field = useFieldContext<string>();

  return (
    <FormBase {...props}>
      <MinimalTiptap
        className={className}
        content={field.state.value || ""}
        dir={dir}
        editable={editable}
        fallback={
          <div className="overflow-hidden rounded-lg border">
            <div className="flex flex-wrap items-center gap-1 border-b p-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <div className="mx-2 h-6 w-px bg-border" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
            <div className="min-h-[200px] p-4">
              <Skeleton className="mb-2 h-4 w-3/4" />
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="mb-2 h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        }
        onChange={(content) => field.handleChange(content)}
        placeholder={placeholder}
      />
    </FormBase>
  );
}
