import { cn } from "@/lib/utils";
import { svgsData } from "@/lib/data";
import { useState, useEffect, useMemo } from "react";
import type { iSVG } from "@/types/svg";
import { ArrowDown, ArrowDownUp, ArrowUpDown, Trash } from "lucide-react";
import { NotFound } from "@/components/NotFound";
import Fuse from "fuse.js";

import { SvgCard } from "@/components/SvgCard";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import { SkeletonCard } from "@/components/SkeletonCard";
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
	const [activeCategory, setActiveCategory] = useState<string | null>(null);

	// Memoized data
	const allSvgs = useMemo(() => JSON.parse(JSON.stringify(svgsData)), []);
	const filteredSvgs = useMemo(() => {
		let filtered = [...allSvgs];
		if (activeCategory) {
			filtered = filtered.filter((svg) =>
				svg.category.includes(activeCategory),
			);
		}
		return filtered;
	}, [allSvgs, activeCategory]);

	const sortedSvgs = useMemo(
		() => ({
			latest: [...filteredSvgs].sort((a, b) => b.id! - a.id!),
			alphabetical: [...filteredSvgs].sort((a, b) =>
				a.title.localeCompare(b.title),
			),
		}),
		[filteredSvgs],
	);

	const fuse = useMemo(
		() =>
			new Fuse<iSVG>(filteredSvgs, {
				keys: ["title"],
				threshold: 0.35,
				ignoreLocation: true,
				isCaseSensitive: false,
				shouldSort: true,
			}),
		[filteredSvgs],
	);

	// Search function with hybrid strategy
	const searchSvgs = (term: string) => {
		if (!term) return sorted ? sortedSvgs.alphabetical : sortedSvgs.latest;

		return term.length < 3
			? filteredSvgs.filter((svg: iSVG) =>
					svg.title.toLowerCase().includes(term.toLowerCase()),
				)
			: fuse.search(term).map((result) => result.item);
	};

	// Handle URL search params
	useEffect(() => {
		const handleUrlChange = () => {
			const params = new URLSearchParams(window.location.search);
			const search = params.get("search");
			const category = params.get("cat");

			if (search) setSearchTerm(search);
			setActiveCategory(category);

			const filtered = searchSvgs(search || "");
			setDisplaySvgs(showAll ? filtered : filtered.slice(0, 30));
			setIsLoading(false);
		};

		handleUrlChange();
		window.addEventListener("urlchange", handleUrlChange);
		return () => window.removeEventListener("urlchange", handleUrlChange);
	}, []);

	// Update displayed SVGs
	useEffect(() => {
		const isUrlSearch = window.location.search.includes("search=");
		if (searchTerm === "" && !isUrlSearch) {
			// Only show loading state on initial load, not during sorting
			if (!displaySvgs.length) {
				setIsLoading(true);
				const timer = setTimeout(() => {
					updateDisplaySvgs();
					setIsLoading(false);
				}, 500);
				return () => clearTimeout(timer);
			} else {
				updateDisplaySvgs();
			}
		}
		updateDisplaySvgs();
	}, [searchTerm, sorted, showAll, activeCategory]);

	// Update URL search param
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		searchTerm ? params.set("search", searchTerm) : params.delete("search");

		const newUrl = params.toString()
			? `${window.location.pathname}?${params.toString()}`
			: window.location.pathname;

		window.history.replaceState({}, "", newUrl);
	}, [searchTerm]);

	const updateDisplaySvgs = () => {
		const filtered = searchSvgs(searchTerm);
		setDisplaySvgs(showAll ? filtered : filtered.slice(0, 30));
	};

	const searchResults = searchSvgs(searchTerm);
	const hasMoreResults = !showAll && searchResults.length > 30;

	return (
		<div className={cn("w-full", className)}>
			<div className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<SearchBar
					count={filteredSvgs.length}
					setSearchTerm={setSearchTerm}
					searchTerm={searchTerm}
					className="[&_input:focus]:ring-opacity-25 px-4 py-4 lg:px-6"
				/>
			</div>

			<section className="mx-auto mb-4 px-4 lg:px-6">
				<div
					className={cn(
						"mb-4 flex items-center justify-end",
						searchTerm.length > 0 && "justify-between",
					)}
				>
					{searchTerm.length > 0 && displaySvgs.length > 0 && (
						<button
							className="flex items-center justify-center space-x-1 rounded-md py-1.5 text-sm font-medium opacity-80 transition-opacity hover:opacity-100"
							onClick={() => setSearchTerm("")}
						>
							<Trash size={16} strokeWidth={2} className="mr-1" />
							<span>Clear results</span>
						</button>
					)}

					{!searchTerm && displaySvgs.length > 0 && (
						<Button variant="ghost" onClick={() => setSorted(!sorted)}>
							{sorted ? (
								<ArrowDownUp size={16} strokeWidth={2} className="mr-1" />
							) : (
								<ArrowUpDown size={16} strokeWidth={2} className="mr-1" />
							)}
							<span>{sorted ? "Sort by latest" : "Sort A-Z"}</span>
						</Button>
					)}
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

				{hasMoreResults ? (
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
							<span>({searchResults.length - 30} more)</span>
						</Button>
					</div>
				) : (
					showAll &&
					searchResults.length > 30 && (
						<div className="sticky bottom-4 mt-8 grid w-full place-items-center">
							<Button
								onClick={() => {
									const grid = document.querySelector(".grid");
									const header = document.querySelector(".sticky.top-0");
									if (grid && header) {
										const headerHeight = header.getBoundingClientRect().height;
										window.scrollTo({
											top: 0,
											behavior: "instant",
										});
									}
									setShowAll(false);
								}}
								className="pointer-events-auto rounded-full shadow-lg"
								variant="outline"
							>
								<ArrowDown className="size-3 rotate-180" />
								<span className="font-semibold">Show Less</span>
							</Button>
						</div>
					)
				)}
			</section>
		</div>
	);
}
