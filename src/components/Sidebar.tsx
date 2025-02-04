import { useState, useEffect, useMemo } from "react";
import { Menu, X, Github, Globe, Search, Twitter } from "lucide-react";
import Fuse from "fuse.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

	const handleCategoryClick = (category: string | null) => {
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
					"fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-background/75",
					"backdrop-blur-lg transition-transform md:bg-background/95 md:backdrop-blur-none lg:translate-x-0",
					!isOpen && "-translate-x-full",
				)}
			>
				{/* Header */}
				<div className="flex min-h-16 items-center border-b px-16 lg:px-6">
					<a href="/" className="flex gap-2 text-xl font-bold">
						<img src="/favicon.svg" alt="Svgr" className="size-6" />
						<span className="-mb-4 text-xl font-bold">Svgr</span>

						<span className="-mb-4 text-xs text-muted-foreground">(v0.3)</span>
					</a>
				</div>

				{/* Categories Container */}
				<div className="flex h-[calc(100vh-4rem)] flex-col">
					{/* Sticky All SVGs */}
					<div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/20">
						<div className="relative mb-2">
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
							</span>
						</Button>
					</div>

					{/* Scrollable Categories */}
					<nav className="flex-1 overflow-y-auto p-3">
						<ul className="space-y-0.5 pb-10">
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
				<div className="absolute bottom-0 flex w-full justify-end space-x-4 border-t p-4 backdrop-blur-xl lg:justify-center">
					<a
						href="https://github.com/ardzero/svgr"
						target="_blank"
						rel="noopener noreferrer"
						className="text-muted-foreground hover:text-foreground"
						title="Project GitHub"
					>
						<Github size={20} />
						<span className="sr-only">Project GitHub</span>
					</a>
					<a
						href="https://x.com/ardastroid"
						target="_blank"
						rel="noopener noreferrer"
						className="text-muted-foreground hover:text-foreground"
						title="Author Twitter"
					>
						<Twitter size={20} />
						<span className="sr-only">Author Twitter</span>
					</a>
					<a
						href="https://ardastroid.com/links"
						target="_blank"
						rel="noopener noreferrer"
						className="text-muted-foreground hover:text-foreground"
						title="Author Website"
					>
						<Globe size={20} />
						<span className="sr-only">Author Website</span>
					</a>
				</div>
			</aside>
		</>
	);
}
