import { useState, useEffect, useMemo } from "react";
import { Menu, X, Github, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/lib/data";
import { svgsData } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Sidebar() {
	const [isOpen, setIsOpen] = useState(false);
	const [activeCategory, setActiveCategory] = useState<string | null>(null);
	const categories = useMemo(() => getCategories().sort(), []);

	// Memoize category counts to prevent recalculation on re-renders
	const { categoryCounts, totalCount } = useMemo(() => {
		const counts: Record<string, number> = {};
		categories.forEach((category) => {
			counts[category] = svgsData.filter((svg) =>
				svg.category.includes(category),
			).length;
		});
		return { categoryCounts: counts, totalCount: svgsData.length };
	}, [categories]);

	// Sync with URL params and listen for URL changes
	useEffect(() => {
		const syncCategory = () => {
			const params = new URLSearchParams(window.location.search);
			const category = params.get("cat");
			setActiveCategory(category);

			// Scroll active category into view
			if (category) {
				requestAnimationFrame(() => {
					const element = document.querySelector(
						`[data-category="${category}"]`,
					);
					element?.scrollIntoView({ behavior: "smooth", block: "center" });
				});
			}
		};

		// Initial sync
		syncCategory();

		// Use a single event listener with event delegation
		const handleUrlChange = (event: Event) => {
			syncCategory();
		};

		window.addEventListener("urlchange", handleUrlChange);
		window.addEventListener("popstate", handleUrlChange);

		return () => {
			window.removeEventListener("urlchange", handleUrlChange);
			window.removeEventListener("popstate", handleUrlChange);
		};
	}, []);

	const handleCategoryClick = (category: string | null) => {
		const params = new URLSearchParams(window.location.search);

		if (activeCategory === category) {
			params.delete("cat");
			setActiveCategory(null);
		} else {
			if (category) {
				params.set("cat", category);
			} else {
				params.delete("cat");
			}
			setActiveCategory(category);
		}

		const newUrl = params.toString()
			? `${window.location.pathname}?${params.toString()}`
			: window.location.pathname;
		window.history.pushState({}, "", newUrl);

		window.dispatchEvent(new Event("urlchange"));
		setIsOpen(false);
	};

	// Close sidebar on mobile when clicking outside
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
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

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isOpen]);

	return (
		<>
			{/* Mobile Toggle */}
			<Button
				id="sidebar-toggle"
				variant="ghost"
				size="icon"
				className="fixed top-4 left-4 z-50 lg:hidden"
				onClick={() => setIsOpen(!isOpen)}
			>
				{isOpen ? <X size={20} /> : <Menu size={20} />}
			</Button>

			{/* Sidebar */}
			<aside
				id="sidebar"
				className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-background/95 backdrop-blur transition-transform duration-200 ease-in-out lg:translate-x-0 ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				{/* Header */}
				<div className="flex h-16 items-center border-b px-6">
					<a href="/" className="text-xl font-bold">
						Svgr
					</a>
				</div>

				{/* Categories Container */}
				<div className="flex h-[calc(100vh-4rem)] flex-col">
					{/* Sticky All SVGs */}
					<div className="bg-background/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
							{categories.map((category) => (
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
				<div className="absolute bottom-0 flex w-full justify-center space-x-4 border-t p-4 backdrop-blur-xl">
					<a
						href="https://github.com"
						target="_blank"
						rel="noopener noreferrer"
						className="text-muted-foreground hover:text-foreground"
					>
						<Github size={20} />
					</a>
					<a
						href="https://twitter.com"
						target="_blank"
						rel="noopener noreferrer"
						className="text-muted-foreground hover:text-foreground"
					>
						<Twitter size={20} />
					</a>
				</div>
			</aside>
		</>
	);
}
