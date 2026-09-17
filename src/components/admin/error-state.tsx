import { Button } from "@/components/ui/button";
import { describe, type AdminError } from "@/lib/admin";

export function ErrorState({
  error,
  onRetry,
}: {
  error: AdminError;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <p className="text-sm font-medium text-red-800">{describe(error)}</p>
      {onRetry ? (
        <Button className="mt-4" variant="outline" onClick={onRetry} type="button">
          Try again
        </Button>
      ) : null}
    </div>
  );
}
