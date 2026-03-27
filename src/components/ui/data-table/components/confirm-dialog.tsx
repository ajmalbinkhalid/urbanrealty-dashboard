import { TriangleAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "../../textarea";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  message?: string;
  onCancel: () => void;
  onConfirm: (remarks: string | undefined) => void;
  isLoading: boolean;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;

  showRemarkInput?: boolean;
  confirmLabel?: string;
  onReset?: () => void;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  onCancel,
  onConfirm,
  isLoading,
  variant = "default",
  showRemarkInput = false,
  confirmLabel,
  onReset,
}: ConfirmDialogProps) {
  const [remarks, setRemarks] = useState("");
  const onResetRef = useRef(onReset);
  onResetRef.current = onReset;

  // Reset remarks when dialog closes
  useEffect(() => {
    if (!open) {
      setRemarks("");
      onResetRef.current?.();
    }
  }, [open]);
  return (
    <Dialog onOpenChange={isLoading ? undefined : onOpenChange} open={open}>
      <DialogContent className="max-w-110! p-8" showCloseButton={false}>
        <div className="flex w-full justify-center">
          <TriangleAlert className="size-13 text-alert-foreground" />
        </div>
        <DialogHeader className="">
          <DialogTitle className="text-center text-th-background">
            {title}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center text-muted-foreground">
          {message}
        </DialogDescription>

        {showRemarkInput && (
          <div className="">
            <p className="mb-2 font-medium text-[10px]">
              Remarks<span className="text-red-500">*</span>
            </p>
            <Textarea
              className="rounded-none border-black text-muted-foreground placeholder:text-[10px]"
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter remarks"
              required
              value={remarks}
            />
          </div>
        )}

        <DialogFooter className="justify-center! flex gap-3">
          <Button
            className="rounded-none border-black px-6 py-5 font-mono"
            disabled={isLoading}
            onClick={onCancel}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            className="rounded-none bg-black px-6 py-5 font-mono hover:bg-black/90"
            disabled={isLoading}
            onClick={() => onConfirm(remarks)}
            variant={variant}
          >
            {isLoading
              ? "Processing..."
              : (confirmLabel ?? (showRemarkInput ? "Reject" : "Accept"))}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
