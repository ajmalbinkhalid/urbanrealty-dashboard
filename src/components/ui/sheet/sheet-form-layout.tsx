import { ChartNoAxesColumnIcon } from "lucide-react";
import type React from "react";
import FormButtons from "@/components/form/FormButtons";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../button";
import { SpinnerCustom } from "../spinner";

type SheetLayoutProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  onRetry?: () => void;
  rightSlot?: React.ReactNode;
};

export default function SheetFormLayout({
  open,
  onOpenChange,
  title,
  description,
  children,
  isLoading = false,
  isError = false,
  isEmpty = false,
  onRetry,
  rightSlot,
}: SheetLayoutProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className="gap-0 p-2 md:min-w-180 lg:min-w-225"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="border-b p-6">
          <div className="flex items-center gap-4">
            {/* Inline content */}
            <DialogTitle asChild>
              <h2 className="flex items-center gap-4 font-semibold text-lg">
                <span>{title}</span>

                {description && (
                  <span className="text-muted-foreground text-sm">
                    {description}
                  </span>
                )}

                {rightSlot && (
                  <span className="flex items-center gap-2 self-center">
                    {rightSlot}
                  </span>
                )}
              </h2>
            </DialogTitle>
          </div>
        </DialogHeader>

        {isLoading && (
          <div className="flex flex-1 items-center justify-center p-12">
            <div className="flex flex-col items-center gap-2">
              <SpinnerCustom />
              <p className="pb-4 text-muted-foreground text-sm">Loading...</p>
            </div>
          </div>
        )}

        {isError && !isLoading && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 p-12">
            <p className="text-destructive text-sm">
              An error occurred while loading data.
            </p>
          </div>
        )}

        {isEmpty && !isLoading && !isError && (
          <div className="flex h-full flex-col items-center justify-center p-12">
            <ChartNoAxesColumnIcon className="mb-4 h-10 w-10 text-muted-foreground" />
            <p>No data available.</p>
          </div>
        )}

        {!(isLoading || isError || isEmpty) && (
          <div className="max-h-[90svh] overflow-y-auto">{children}</div>
        )}

        {!isLoading && isError && onRetry && (
          <DialogFooter className="pb-6 sm:justify-center">
            <Button onClick={onRetry} type="button" variant="outline">
              Try Again
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

export const SheetFormFooter = ({
  isPending,
  onReset,
}: {
  isPending: boolean;
  onReset: () => void;
}) => {
  return (
    <DialogFooter className="gap-2 px-6">
      <FormButtons.Reset
        className="h-auto rounded-[.1875rem] border-gray-400 px-6"
        isPending={isPending}
        onClick={onReset}
      />
      <FormButtons.Submit
        className="h-auto rounded-[.1875rem] bg-black px-6 hover:bg-black/70"
        isPending={isPending}
      />
    </DialogFooter>
  );
};
