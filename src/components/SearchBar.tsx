import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useId, useRef, useEffect } from "react";
import { Search } from "lucide-react";

type TSearchBar = {
	className?: string;
	count?: number;
	setSearchTerm: (term: string) => void;
	searchTerm: string;
	placeholderEndText?: string;
};

export function SearchBar({
	className,
	count,
	setSearchTerm,
	searchTerm,
	placeholderEndText = "",
}: TSearchBar) {
	const id = useId();
	const searchInputRef = useRef<HTMLInputElement>(null);

	// Add useEffect for keyboard shortcut
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				searchInputRef.current?.focus();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, []);

	return (
		<div className={cn("space-y-2", className)}>
			<Label htmlFor={id} className="sr-only">
				Search {count} svgs
			</Label>
			<div className="relative">
				<Input
					ref={searchInputRef}
					id={id}
					className="peer min-h-10 ps-9 pe-9"
					placeholder={`Search ${count} svgs ${placeholderEndText}`}
					type="search"
					onChange={(e) => setSearchTerm(e.target.value)}
					value={searchTerm}
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
