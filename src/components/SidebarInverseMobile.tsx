import { useState, useEffect, useMemo } from "react";
import { Menu, X, Github, Globe, Search, Twitter } from "lucide-react";
import Fuse from "fuse.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ui/theme-selector";
import { getCategories } from "@/lib/data";
import { svgsData } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Sidebar() {
	const [isOpen, setIsOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [activeCategory, setActiveCategory] = useState<string | null>(null);

	// Memoize core data
	const categories = useMemo(() => getCategories().sort(), []);
	const fuse = useMemo(
		() =>
			new Fuse(categories, {
				threshold: 0.3,
				distance: 100,
			}),
		[categories],
	);

	const { categoryCounts, totalCount, filteredCategories } = useMemo(() => {
		const counts: Record<string, number> = {};
		categories.forEach((cat) => {
			counts[cat] = svgsData.filter((svg) => svg.category.includes(cat)).length;
		});

		const filtered = search
			? fuse.search(search).map((result) => result.item)
			: categories;

		return {
			categoryCounts: counts,
			totalCount: svgsData.length,
			filteredCategories: filtered,
		};
	}, [categories, search]);

	// URL sync effect
	useEffect(() => {
		const syncCategory = () => {
			const category = new URLSearchParams(window.location.search).get("cat");
			setActiveCategory(category);

			if (category) {
				requestAnimationFrame(() => {
					document
						.querySelector(`[data-category="${category}"]`)
						?.scrollIntoView({ behavior: "smooth", block: "center" });
				});
			}
		};

		syncCategory();
		const events = ["urlchange", "popstate"];
		events.forEach((e) => window.addEventListener(e, syncCategory));
		return () =>
			events.forEach((e) => window.removeEventListener(e, syncCategory));
	}, []);

	// Click outside effect
	useEffect(() => {
		const handler = (e: MouseEvent) => {
			const sidebar = document.getElementById("sidebar");
			const toggle = document.getElementById("sidebar-toggle");
			if (
				isOpen &&
				sidebar &&
				toggle &&
				!sidebar.contains(e.target as Node) &&
				!toggle.contains(e.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [isOpen]);

	// Add keyboard shortcut effect
	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			// Command/Control + P to navigate to PNG converter
			if ((e.metaKey || e.ctrlKey) && e.key === "q") {
				e.preventDefault();
				window.location.href = "/svg-to-png";
			}
			// Command/Control + K to focus All SVGs
			if ((e.metaKey || e.ctrlKey) && e.key === "a") {
				e.preventDefault();
				handleCategoryClick(null);
			}
		};

		document.addEventListener("keydown", handleKeyPress);
		return () => document.removeEventListener("keydown", handleKeyPress);
	}, []);

	const handleCategoryClick = (category: string | null) => {
		// If not on homepage, redirect to homepage with category param
		if (window.location.pathname !== "/") {
			const params = new URLSearchParams();
			if (category) {
				params.set("cat", category);
			}
			window.location.href = `/${params.toString() ? `?${params}` : ""}`;
			return;
		}

		const params = new URLSearchParams(window.location.search);

		if (activeCategory === category) {
			params.delete("cat");
			setActiveCategory(null);
		} else {
			category ? params.set("cat", category) : params.delete("cat");
			setActiveCategory(category);
		}

		// Clear search when selecting a category
		setSearch("");

		const newUrl = `${window.location.pathname}${params.toString() ? `?${params}` : ""}`;
		window.history.pushState({}, "", newUrl);
		window.dispatchEvent(new Event("urlchange"));
		setIsOpen(false);
	};

	return (
		<>
			{/* Mobile Toggle */}
			<Button
				id="sidebar-toggle"
				variant="ghost"
				size="icon"
				className="fixed top-3 left-1 z-50 lg:hidden"
				onClick={() => setIsOpen(!isOpen)}
			>
				{isOpen ? <X size={20} /> : <Menu size={20} />}
			</Button>

			{/* Sidebar */}
			<aside
				id="sidebar"
				className={cn(
					"fixed inset-y-0 left-0 z-40 w-80 transform border-r bg-background/75 lg:w-64",
					"backdrop-blur-lg transition-transform md:bg-background/95 md:backdrop-blur-none lg:translate-x-0",
					!isOpen && "-translate-x-full",
				)}
			>
				{/* Header */}
				<div className="flex min-h-16 items-center border-b px-16 lg:px-6">
					<a href="/" className="flex gap-2 text-xl font-bold">
						<img src="/favicon.svg" alt="Svgr" className="size-6" />
						<span className="-mb-4 text-xl font-bold">Svgr</span>

						<span className="-mb-4 text-xs text-muted-foreground">(v0.5)</span>
					</a>
				</div>

				{/* Categories Container */}
				<div className="flex h-[calc(100dvh-4rem)] flex-col-reverse lg:flex-col">
					{/* Sticky All SVGs */}
					<div className="mb-16 flex flex-col-reverse gap-1.5 bg-background/95 p-2 pb-1 backdrop-blur supports-[backdrop-filter]:bg-background/20 lg:mb-0 lg:flex-col">
						<Button
							variant="secondary"
							className={cn("w-full font-bold")}
							asChild
						>
							<a
								href="/svg-to-png"
								className="relative flex w-full items-center gap-2"
							>
								{/* <div className="relative flex h-2 w-2">
									<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
									<span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
								</div> */}
								<div className="absolute -top-1 -right-2 rounded-md bg-emerald-500 px-2 py-0.5 text-xs text-black">
									New
								</div>
								SVG &gt; PNG Converter{" "}
								<span className="text-xs text-muted-foreground">(⌘ Q)</span>
							</a>
						</Button>
						<div className="relative">
							<Search className="absolute top-2.5 left-2 size-4 text-muted-foreground" />
							<Input
								placeholder={`Search ${categories.length} categories...`}
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="pl-8 text-sm"
							/>
						</div>
						<Button
							variant="ghost"
							className={cn(
								"w-full justify-between font-normal",
								activeCategory === null && "bg-muted",
							)}
							onClick={() => handleCategoryClick(null)}
						>
							<span>All SVGs</span>
							<span className="text-xs text-muted-foreground">
								{totalCount}
								<span className="ml-1">(⌘ A)</span>
							</span>
						</Button>
					</div>

					{/* Scrollable Categories */}
					<nav className="flex-1 overflow-y-auto p-3">
						<ul className="space-y-0.5 lg:pb-12">
							{filteredCategories.map((category) => (
								<li key={category}>
									<Button
										variant="ghost"
										data-category={category}
										className={cn(
											"w-full justify-between p-0 px-4 font-normal",
											activeCategory === category && "bg-muted",
										)}
										onClick={() => handleCategoryClick(category)}
									>
										<span>{category}</span>
										<span className="text-xs text-muted-foreground">
											{categoryCounts[category]}
										</span>
									</Button>
								</li>
							))}
						</ul>
					</nav>
				</div>

				{/* Footer */}
				<div className="sticky bottom-0 w-full border-t p-4 backdrop-blur-xl">
					<div className="flex w-full place-items-center justify-between">
						<ModeToggle className="min-w-fit" iconClassName="size-3.5" />
						<div className="flex w-full justify-end space-x-4">
							<a
								href="https://github.com/ardzero/svgr"
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground hover:text-foreground"
								title="Project GitHub"
							>
								<Github size={18} />
								<span className="sr-only">Project GitHub</span>
							</a>
							<a
								href="https://x.com/ardastroid"
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground hover:text-foreground"
								title="Author Twitter"
							>
								<Twitter size={18} />
								<span className="sr-only">Author Twitter</span>
							</a>
							<a
								href="https://ardastroid.com/links"
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground hover:text-foreground"
								title="Author Website"
							>
								<Globe size={18} />
								<span className="sr-only">Author Website</span>
							</a>
						</div>
					</div>
				</div>
			</aside>
		</>
	);
}
