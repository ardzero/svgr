import { cn } from "@/lib/utils";
import { svgsData } from "@/lib/data";
import { useState, useEffect } from "react";
import type { iSVG } from "@/types/svg";
import { SvgCard } from "@/components/SvgCard";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import { ArrowDown } from "lucide-react";

type TSvgList = {
	className?: string;
};

const allSvgs = JSON.parse(JSON.stringify(svgsData));
const notSortedSvgs = [...allSvgs].sort((a, b) => b.id! - a.id!);
const totalSvgs = notSortedSvgs.length;
export function SvgList({ className }: TSvgList) {
	const [displaySvgs, setDisplaySvgs] = useState<iSVG[]>([]);
	const [showAll, setShowAll] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		setTimeout(() => {
			setDisplaySvgs(showAll ? notSortedSvgs : notSortedSvgs.slice(0, 30));
			setIsLoading(false);
		}, 500);
	}, [showAll]);

	const SkeletonCard = () => (
		<div className="flex h-48 animate-pulse flex-col items-center justify-center gap-4 rounded-lg border p-4">
			<div className="aspect-square h-24 w-full rounded-md bg-muted"></div>
			<div className="h-2 w-3/4 rounded-md bg-muted"></div>
			<div className="h-2 w-1/2 rounded-md bg-muted"></div>
		</div>
	);

	return (
		<div className={cn("min-h-screen w-full", className)}>
			<SearchBar
				count={totalSvgs}
				setSearchTerm={setSearchTerm}
				searchTerm={searchTerm}
				className="container mt-10"
			/>

			<section className="container mx-auto mb-10">
				<div className="relative mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
					{isLoading
						? Array(30)
								.fill(0)
								.map((_, index) => <SkeletonCard key={index} />)
						: displaySvgs.map((svg) => <SvgCard key={svg.id} svg={svg} />)}
				</div>
				<div
					className={cn(
						"relative z-16 grid w-full place-items-center items-end bg-gradient-to-t from-background from-30% to-transparent",
						showAll ? "hidden" : "-mt-[7rem] h-36",
					)}
				>
					<Button
						onClick={() => setShowAll(!showAll)}
						className="pointer-events-auto rounded-full"
						variant="outline"
					>
						<ArrowDown className="size-3" />
						<span className="font-semibold">Load All Svgs</span>
						<span>({totalSvgs - 30} more)</span>
					</Button>
				</div>
			</section>
		</div>
	);
}
