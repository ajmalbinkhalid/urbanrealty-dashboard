import { Button } from "../ui/button";
import { SpinnerCustom } from "../ui/spinner";

type Props = {
  isPending?: boolean;
  className?: string;
   onClick?: () => void;  
};

export const FormSubmitButton = ({ isPending, className }: Props) => {
  return (
    <Button className={className} disabled={isPending} type="submit">
      {isPending ? <SpinnerCustom /> : "Submit"}
    </Button>
  );
};

export const FormResetButton = ({ isPending, className , onClick,}: Props) => {
  return (
    <Button
      className={className}
      disabled={isPending}
      type="button"
      variant={"outline"}
      onClick={onClick}   
    >
      Reset
    </Button>
  );
};

export default {
  Submit: FormSubmitButton,
  Reset: FormResetButton,
};
