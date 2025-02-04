import { useState, useEffect } from "react";
import { Menu, X, Github, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/lib/data";
import { svgsData } from "@/lib/data";

export function Sidebar() {
	const [isOpen, setIsOpen] = useState(false);
	const categories = getCategories();

	// Get category counts
	const categoryCounts: Record<string, number> = {};
	categories.forEach((category) => {
		categoryCounts[category] = svgsData.filter((svg) =>
			svg.category.includes(category),
		).length;
	});

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
					<h1 className="text-xl font-bold">Svgr</h1>
				</div>

				{/* Categories */}
				<nav className="h-[calc(100vh-8rem)] overflow-y-auto p-4">
					<ul className="space-y-2">
						{categories.map((category) => (
							<li key={category}>
								<Button
									variant="ghost"
									className="w-full justify-between font-normal"
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

				{/* Footer */}
				<div className="absolute bottom-0 flex w-full justify-center space-x-4 border-t p-4">
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
