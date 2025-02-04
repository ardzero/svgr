import { PackageOpen, ArrowUpRight, SquareDashed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NotFoundProps {
	notFoundTerm: string;
	className?: string;
}

export function NotFound({ notFoundTerm, className }: NotFoundProps) {
	return (
		<div
			className={cn(
				"mt-6 flex w-full flex-col items-center justify-center text-gray-600 dark:text-gray-400",
				className,
			)}
		>
			<SquareDashed size={40} className="mb-4" />

			<p className="mb-1 text-xl font-medium">Couldn't find the Icon</p>
			<p className="text-md mb-4 font-mono">&quot;{notFoundTerm}&quot;</p>
			<div className="flex items-center space-x-1">
				<Button
					variant="outline"
					className="text-sm font-medium"
					href=""
					target="_blank"
				>
					<span>Submit logo</span>
					<ArrowUpRight size={16} />
				</Button>
				<Button
					variant="outline"
					className="text-sm font-medium"
					href=""
					target="_blank"
				>
					<span>Request Icon</span>
					<ArrowUpRight size={16} />
				</Button>
			</div>
		</div>
	);
}
