import { cn } from "@/lib/utils";

type TSkeletonCard = {
	className?: string;
};

export function SkeletonCard({ className }: TSkeletonCard) {
	return (
		<div
			className={cn(
				"flex h-48 animate-pulse flex-col items-center justify-center gap-4 rounded-lg border p-4",
				className,
			)}
		>
			<div className="aspect-square h-24 w-full rounded-md bg-muted"></div>
			<div className="h-2 w-3/4 rounded-md bg-muted"></div>
			<div className="h-2 w-1/2 rounded-md bg-muted"></div>
		</div>
	);
}
