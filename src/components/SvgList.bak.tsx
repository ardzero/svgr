import { cn } from "@/lib/utils";
import { svgsData } from "@/lib/data";
import { useState, useEffect, useMemo } from "react";
import type { iSVG } from "@/types/svg";
import { SvgCard } from "@/components/SvgCard";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import { ArrowDown, ArrowDownUp, ArrowUpDown, Trash } from "lucide-react";
import { NotFound } from "@/components/NotFound";
import Fuse from "fuse.js";

type TSvgList = {
	className?: string;
};

export function SvgList({ className }: TSvgList) {
	// States
	const [displaySvgs, setDisplaySvgs] = useState<iSVG[]>([]);
	const [showAll, setShowAll] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [sorted, setSorted] = useState(false);

	// Memoized sorted arrays
	const allSvgs = useMemo(() => JSON.parse(JSON.stringify(svgsData)), []);
	const latestSorted = useMemo(
		() => [...allSvgs].sort((a, b) => b.id! - a.id!),
		[allSvgs],
	);
	const alphabeticallySorted = useMemo(
		() => [...allSvgs].sort((a, b) => a.title.localeCompare(b.title)),
		[allSvgs],
	);

	// Memoized Fuse instance
	const fuse = useMemo(
		() =>
			new Fuse<iSVG>(allSvgs, {
				keys: ["title"],
				threshold: 0.35,
				ignoreLocation: true,
				isCaseSensitive: false,
				shouldSort: true,
			}),
		[allSvgs],
	);

	// Search function with hybrid strategy
	const searchSvgs = (term: string) => {
		if (!term) {
			return sorted ? alphabeticallySorted : latestSorted;
		}

		if (term.length < 3) {
			return allSvgs.filter((svg: iSVG) =>
				svg.title.toLowerCase().includes(term.toLowerCase()),
			);
		}

		return fuse.search(term).map((result) => result.item);
	};

	// Update displayed SVGs based on search and show all state
	useEffect(() => {
		// Skip the loading state if we're handling a URL search param
		const isUrlSearch = window.location.search.includes("search=");
		if (searchTerm === "" && !isUrlSearch) {
			setIsLoading(true);
			setTimeout(() => {
				const filtered = searchSvgs(searchTerm);
				setDisplaySvgs(showAll ? filtered : filtered.slice(0, 30));
				setIsLoading(false);
			}, 500);
		} else {
			// Immediate update for search results without loading state
			const filtered = searchSvgs(searchTerm);
			setDisplaySvgs(showAll ? filtered : filtered.slice(0, 30));
		}
	}, [searchTerm, sorted, showAll]);

	// Initialize with URL search param and trigger search
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const search = params.get("search");
		if (search) {
			setSearchTerm(search);
			const filtered = searchSvgs(search);
			setDisplaySvgs(showAll ? filtered : filtered.slice(0, 30));
			setIsLoading(false);
		}
	}, []); // Only run once on mount

	// Update URL search param
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		if (searchTerm) {
			params.set("search", searchTerm);
		} else {
			params.delete("search");
		}
		const queryString = params.toString();
		window.history.replaceState(
			{},
			"",
			queryString
				? `${window.location.pathname}?${queryString}`
				: window.location.pathname,
		);
	}, [searchTerm]);

	const SkeletonCard = () => (
		<div className="flex h-48 animate-pulse flex-col items-center justify-center gap-4 rounded-lg border p-4">
			<div className="aspect-square h-24 w-full rounded-md bg-muted"></div>
			<div className="h-2 w-3/4 rounded-md bg-muted"></div>
			<div className="h-2 w-1/2 rounded-md bg-muted"></div>
		</div>
	);

	return (
		<div className={cn("min-h-screen w-full", className)}>
			<div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<SearchBar
					count={allSvgs.length}
					setSearchTerm={setSearchTerm}
					searchTerm={searchTerm}
					className="[&_input:focus]:ring-opacity-25 container py-4"
				/>
			</div>

			<section className="container mx-auto mb-10">
				<div
					className={cn(
						"mb-4 flex items-center justify-end",
						searchTerm.length > 0 && "justify-between",
					)}
				>
					{searchTerm.length > 0 && (
						<button
							className={cn(
								"flex items-center justify-center space-x-1 rounded-md py-1.5 text-sm font-medium opacity-80 transition-opacity hover:opacity-100",
								displaySvgs.length === 0 && "hidden",
							)}
							onClick={() => setSearchTerm("")}
						>
							<Trash size={16} strokeWidth={2} className="mr-1" />
							<span>Clear results</span>
						</button>
					)}

					<Button
						variant={"ghost"}
						className={cn(
							displaySvgs.length === 0 && "hidden",
							searchTerm.length > 0 && "hidden",
						)}
						onClick={() => setSorted(!sorted)}
						disabled={searchTerm.length > 0}
					>
						{sorted ? (
							<ArrowDownUp size={16} strokeWidth={2} className="mr-1" />
						) : (
							<ArrowUpDown size={16} strokeWidth={2} className="mr-1" />
						)}
						<span>{sorted ? "Sort by latest" : "Sort A-Z"}</span>
					</Button>
				</div>

				<div className="relative mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
					{isLoading ? (
						Array(30)
							.fill(0)
							.map((_, index) => <SkeletonCard key={index} />)
					) : displaySvgs.length === 0 ? (
						<div className="col-span-full flex min-h-[65vh] items-center justify-center">
							<NotFound notFoundTerm={searchTerm} />
						</div>
					) : (
						displaySvgs.map((svg) => (
							<SvgCard key={svg.id} svg={svg} searchTerm={searchTerm} />
						))
					)}
				</div>

				{!showAll && searchSvgs(searchTerm).length > 30 && (
					<div
						className={cn(
							"relative z-16 grid w-full place-items-center items-end bg-gradient-to-t from-background from-30% to-transparent",
							"-mt-[7rem] h-36",
						)}
					>
						<Button
							onClick={() => setShowAll(true)}
							className="pointer-events-auto rounded-full"
							variant="outline"
						>
							<ArrowDown className="size-3" />
							<span className="font-semibold">Load All Svgs</span>
							<span>({searchSvgs(searchTerm).length - 30} more)</span>
						</Button>
					</div>
				)}
			</section>
		</div>
	);
}
