import { Button } from "@/components/ui/button";

type ErrorUIProps = {
  message?: string;
  onRetry: () => void;
};

export function ErrorUI({
  message = "An error occurred while loading the table.",
  onRetry,
}: ErrorUIProps) {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
      <div className="font-semibold text-lg text-red-600">{message}</div>
      <Button onClick={onRetry} variant="outline">
        Refresh
      </Button>
    </div>
  );
}
