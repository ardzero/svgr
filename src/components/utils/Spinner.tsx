import { Icons } from "@/components/utils/icons";
import { cn } from "@/lib/utils";
// a simple spinner fallback for suspanse components
export const SuspanseFallback = ({
  className,
  spinnerClassName,
}: {
  className?: string;
  spinnerClassName?: string;
}) => {
  return (
    <div className={cn("h-full w-full grid place-items-center", className)}>
      <div
        className={cn(
          "size-10 animate-spin rounded-full border-2 border-primary border-t-transparent",
          spinnerClassName
        )}
      />
    </div>
  );
};
