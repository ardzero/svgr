import type { iSVG } from "@/types/svg";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import Fuse from "fuse.js";
import { cn } from "@/lib/utils";
import { svgsData } from "@/lib/data";
import { ArrowDown, ArrowDownUp, ArrowUpDown, Trash } from "lucide-react";

import { NotFound } from "@/components/NotFound";
import { SvgCard } from "@/components/SvgCard";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import { SkeletonCard } from "@/components/SkeletonCard";
import type { Tcategory } from "@/types/categories";

const VIRTUALIZE_THRESHOLD = 50;
const ROW_HEIGHT_ESTIMATE = 236;

function getColumnCount(width: number) {
	if (width >= 1280) return 6;
	if (width >= 1024) return 4;
	if (width >= 600) return 3;
	if (width >= 380) return 2;
	return 1;
}

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
	const [columnCount, setColumnCount] = useState(() =>
		getColumnCount(typeof window !== "undefined" ? window.innerWidth : 1280),
	);
	const [scrollMargin, setScrollMargin] = useState(0);
	const gridContainerRef = useRef<HTMLDivElement>(null);

	const useVirtualizedGrid = displaySvgs.length > VIRTUALIZE_THRESHOLD;
	const rowCount = useVirtualizedGrid
		? Math.ceil(displaySvgs.length / columnCount)
		: 0;

	// Memoized data
	const allSvgs = useMemo(() => JSON.parse(JSON.stringify(svgsData)), []);

	// Handle URL params and initial data load
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const search = params.get("search") || "";
		const category = params.get("cat");

		setSearchTerm(search);
		setActiveCategory(category);

		// Always limit to 30 items initially, regardless of category or search
		const filtered = getFilteredSvgs(search, category);
		setDisplaySvgs(filtered.slice(0, 30));
		setShowAll(false); // Reset showAll when changing category
		setIsLoading(false);
	}, []);

	// Filter SVGs based on category
	const filteredSvgs = useMemo(() => {
		if (!activeCategory) return allSvgs;
		return allSvgs.filter((svg: iSVG) =>
			svg.category.includes(activeCategory as Tcategory),
		);
	}, [allSvgs, activeCategory]);

	// Sort SVGs
	const sortedSvgs = useMemo(
		() => ({
			latest: [...filteredSvgs].sort((a, b) => b.id! - a.id!),
			alphabetical: [...filteredSvgs].sort((a, b) =>
				a.title.localeCompare(b.title),
			),
		}),
		[filteredSvgs],
	);

	// Fuse instance for search
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

	// Search function
	const getFilteredSvgs = (term: string, category: string | null = null) => {
		const baseList = sorted ? sortedSvgs.alphabetical : sortedSvgs.latest;

		if (!term) return baseList;

		return term.length < 3
			? filteredSvgs.filter((svg: iSVG) =>
					svg.title.toLowerCase().includes(term.toLowerCase()),
				)
			: fuse.search(term).map((result) => result.item);
	};

	// Handle URL changes
	useEffect(() => {
		const handleUrlChange = () => {
			const params = new URLSearchParams(window.location.search);
			const search = params.get("search") || "";
			const category = params.get("cat");

			setSearchTerm(search);
			setActiveCategory(category);

			const filtered = getFilteredSvgs(search, category);
			// Reset to showing only 30 items when category changes
			setDisplaySvgs(filtered.slice(0, 30));
			setShowAll(false);
		};

		window.addEventListener("urlchange", handleUrlChange);
		return () => window.removeEventListener("urlchange", handleUrlChange);
	}, []);

	// Update displayed SVGs when filters change
	useEffect(() => {
		const filtered = getFilteredSvgs(searchTerm, activeCategory);
		setDisplaySvgs(showAll ? filtered : filtered.slice(0, 30));
	}, [searchTerm, sorted, showAll, activeCategory]);

	// Update URL search params
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);

		if (searchTerm) {
			params.set("search", searchTerm);
		} else {
			params.delete("search");
		}

		const newUrl = params.toString()
			? `${window.location.pathname}?${params.toString()}`
			: window.location.pathname;

		window.history.replaceState({}, "", newUrl);
	}, [searchTerm]);

	// Add useEffect for keyboard shortcut
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === "x") {
				e.preventDefault();
				setSearchTerm("");
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	// Responsive column count for virtualized grid
	useEffect(() => {
		const updateColumns = () => setColumnCount(getColumnCount(window.innerWidth));
		updateColumns();
		window.addEventListener("resize", updateColumns);
		return () => window.removeEventListener("resize", updateColumns);
	}, []);

	// Measure scroll margin for window virtualizer (offset of grid from top of document)
	useEffect(() => {
		if (!useVirtualizedGrid || !gridContainerRef.current) return;
		const el = gridContainerRef.current;
		const updateMargin = () => {
			setScrollMargin(el.getBoundingClientRect().top + window.scrollY);
		};
		updateMargin();
		const ro = new ResizeObserver(updateMargin);
		ro.observe(el);
		window.addEventListener("scroll", updateMargin, { passive: true });
		return () => {
			ro.disconnect();
			window.removeEventListener("scroll", updateMargin);
		};
	}, [useVirtualizedGrid]);

	const virtualizer = useWindowVirtualizer({
		count: rowCount,
		estimateSize: () => ROW_HEIGHT_ESTIMATE,
		overscan: 2,
		scrollMargin: scrollMargin,
		getScrollElement: useCallback(() => window, []),
	});

	const searchResults = getFilteredSvgs(searchTerm, activeCategory);
	const hasMoreResults = !showAll && searchResults.length > 30;

	return (
		<div className={cn("w-full", className)}>
			<div className="sticky top-0 z-30 flex min-h-16 flex-col justify-center border-b bg-background/95 backdrop-blur-lg supports-backdrop-filter:bg-background/70">
				<SearchBar
					count={filteredSvgs.length}
					setSearchTerm={setSearchTerm}
					searchTerm={searchTerm}
					className="[&_input:focus]:ring-opacity-25 px-4 pl-12 lg:px-6"
					placeholderEndText={`in ${activeCategory} category`}
				/>
			</div>

			<section
				ref={gridContainerRef}
				className="mx-auto mt-2 mb-4 px-4 lg:px-6"
			>
				<div
					className={cn(
						"mb-4 flex items-center justify-end",
						searchTerm.length > 0 && "justify-between",
					)}
				>
					{searchTerm.length > 0 && displaySvgs.length > 0 && (
						<Button
							variant="ghost"
							onClick={() => setSearchTerm("")}
							className="pr-2 pl-4"
						>
							<Trash size={16} strokeWidth={2} />
							Clear results{" "}
							<span className="rounded-md border border-border p-1 px-2 text-xs">
								⌘ + X
							</span>
						</Button>
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

				<div className="relative mt-4">
					{isLoading ? (
						<div className="grid gap-4 min-[380px]:grid-cols-2 min-[600px]:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
							{Array(30)
								.fill(0)
								.map((_, index) => (
									<SkeletonCard key={index} />
								))}
						</div>
					) : displaySvgs.length === 0 ? (
						<div className="flex min-h-[65vh] items-center justify-center">
							<NotFound notFoundTerm={searchTerm} />
						</div>
					) : useVirtualizedGrid ? (
						<div
							style={{
								height: `${virtualizer.getTotalSize()}px`,
								width: "100%",
								position: "relative",
							}}
						>
							{virtualizer.getVirtualItems().map((row) => {
								const start = row.index * columnCount;
								const rowSvgs = displaySvgs.slice(
									start,
									start + columnCount,
								);
								return (
									<div
										key={row.key}
										style={{
											position: "absolute",
											top: 0,
											left: 0,
											width: "100%",
											transform: `translateY(${
												row.start - virtualizer.options.scrollMargin
											}px)`,
										}}
									>
										<div className="grid gap-4 min-[380px]:grid-cols-2 min-[600px]:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
											{rowSvgs.map((svg) => (
												<SvgCard
													key={svg.id}
													svg={svg}
													searchTerm={searchTerm}
												/>
											))}
										</div>
									</div>
								);
							})}
						</div>
					) : (
						<div className="grid gap-4 min-[380px]:grid-cols-2 min-[600px]:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
							{displaySvgs.map((svg) => (
								<SvgCard
									key={svg.id}
									svg={svg}
									searchTerm={searchTerm}
								/>
							))}
						</div>
					)}
				</div>

				{hasMoreResults ? (
					<div
						className={cn(
							"pointer-events-none relative z-16 grid w-full place-items-center items-end bg-linear-to-t from-background from-30% to-transparent",
							"-mt-28 h-36",
							"bg-linear-to-t from-background from-30% to-transparent",
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
						<div className="pointer-events-none sticky bottom-4 mt-8 grid w-full place-items-center">
							<Button
								onClick={() => {
									window.scrollTo({
										top: 0,
										behavior: "instant",
									});
									setShowAll(false);
								}}
								className="pointer-events-auto rounded-full bg-background/50 shadow-lg backdrop-blur-lg"
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
