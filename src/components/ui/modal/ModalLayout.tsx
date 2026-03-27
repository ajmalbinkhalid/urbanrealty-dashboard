import type React from "react";
import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

type props = {
  title: string;
  form: any;
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  footer?: ReactNode;
};

const ModalLayout = ({
  title,
  children,
  open,
  onOpenChange,
  footer,
  form,
}: props) => {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="overflow-y-auto">
        <form.AppForm
          className="space-y-6"
          noValidate
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <Separator />

          {children}
          <DialogFooter>{footer}</DialogFooter>
        </form.AppForm>
      </DialogContent>
    </Dialog>
  );
};

export default ModalLayout;
