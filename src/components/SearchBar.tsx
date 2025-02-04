import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useId, useRef } from "react";
import { Search, X } from "lucide-react";

type TSearchBar = {
	className?: string;
	count?: number;
	setSearchTerm: (term: string) => void;
	searchTerm: string;
};

export function SearchBar({
	className,
	count,
	setSearchTerm,
	searchTerm,
}: TSearchBar) {
	const id = useId();
	const searchInputRef = useRef<HTMLInputElement>(null);
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newSearchValue = e.target.value;
		setSearchTerm(newSearchValue);

		const url = new URL(window.location.href);
		if (newSearchValue) {
			// Add search query to URL and reset filter
			url.searchParams.set("q", newSearchValue);
		} else {
			// Remove search query from URL when search is cleared
			url.searchParams.delete("q");
		}
		window.history.pushState({}, "", url);
	};
	const handleClearSearch = () => {
		setSearchTerm("");

		window.history.pushState({}, "", window.location.href);
	};

	return (
		<div className={cn("space-y-2", className)}>
			<Label htmlFor={id} className="sr-only">
				Search {count} svgs
			</Label>
			<div className="relative">
				<Input
					ref={searchInputRef}
					id={id}
					className="peer ps-9 pe-9"
					placeholder={`Search ${count} svgs`}
					type="search"
					onChange={handleSearch}
				/>

				<div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
					<Search size={16} strokeWidth={2} />
				</div>

				<div className="absolute inset-y-0 end-0 flex items-center justify-center pe-2 text-muted-foreground">
					{/* a */}
					<kbd className="pointer-events-none inline-flex h-5 max-h-full items-center rounded border border-border px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
						⌘K
					</kbd>
				</div>
			</div>
		</div>
	);
}
