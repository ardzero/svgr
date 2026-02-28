import { cn } from "@/lib/utils";
import type { iSVG } from "@/types/svg";
import { memo, useState } from "react";
import {
	ArrowUpRight,
	Baseline,
	Sparkles,
	Palette,
	Monitor,
	Sun,
	Moon,
} from "lucide-react";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { CopyToClipboard } from "@/components/CardActions/CopyToClipboard";
import { Button } from "./ui/button";

type TSvgCard = {
	className?: string;
	svg: iSVG;
	searchTerm?: string;
};

function SvgCardInner({ className, svg }: TSvgCard) {
	const [wordmarkSvg, setWordmarkSvg] = useState(false);
	const [localTheme, setLocalTheme] = useState<"system" | "light" | "dark">(
		"system",
	);

	const iconStroke = 2;
	const iconSize = 13;
	const maxVisibleCategories = 1;
	const btnStyles =
		"motion-scale-in-[0.38] motion-translate-x-in-[69%] motion-translate-y-in-[-1%] motion-duration-[0.11s]";
	const globalImageStyles = cn(
		"pointer-events-none mt-2 mb-4 h-10 select-none",
		localTheme === "light"
			? "motion-preset-bounce"
			: localTheme === "dark"
				? "motion-preset-bounce"
				: "",
	);
	const tagesClassName =
		"rounded-md border border-border px-2 py-1 text-xs hover:bg-muted";

	const handleCategoryClick = (category: string, e: React.MouseEvent) => {
		e.preventDefault();
		const params = new URLSearchParams(window.location.search);

		// Return early if category is already active
		if (params.get("cat") === category) return;

		params.set("cat", category);
		const newUrl = `${window.location.pathname}?${params.toString()}`;
		window.history.pushState({}, "", newUrl);
		window.dispatchEvent(new Event("urlchange"));
	};

	return (
		<div
			className={cn(
				"group relative flex flex-col items-center justify-center rounded-md border border-neutral-200 p-4 transition-colors duration-100 hover:bg-neutral-100/80 dark:border-neutral-800 dark:hover:bg-neutral-800/20",
				className,
			)}
		>
			<div
				className={cn(
					"absolute inset-0 -z-2 bg-muted/65 dark:bg-muted/35",
					localTheme === "system" ? "hidden" : "block",
				)}
			/>
			{/* Image */}

			{wordmarkSvg && svg.wordmark ? (
				<>
					<img
						className={cn(
							globalImageStyles,
							localTheme === "system"
								? "hidden dark:block"
								: localTheme === "dark"
									? "block"
									: "hidden",
						)}
						src={
							typeof svg.wordmark !== "string"
								? svg.wordmark?.dark || ""
								: svg.wordmark
						}
						alt={svg.title}
						title={svg.title}
						loading="lazy"
					/>
					<img
						className={cn(
							globalImageStyles,
							localTheme === "system"
								? "block dark:hidden"
								: localTheme === "light"
									? "block"
									: "hidden",
						)}
						src={
							typeof svg.wordmark !== "string"
								? svg.wordmark?.light || ""
								: svg.wordmark
						}
						alt={svg.title}
						title={svg.title}
						loading="lazy"
					/>
				</>
			) : (
				<>
					<img
						className={cn(
							globalImageStyles,
							localTheme === "system"
								? "hidden dark:block"
								: localTheme === "dark"
									? "block"
									: "hidden",
						)}
						src={typeof svg.route !== "string" ? svg.route.dark : svg.route}
						alt={svg.title}
						title={svg.title}
						loading="lazy"
					/>
					<img
						className={cn(
							globalImageStyles,
							localTheme === "system"
								? "block dark:hidden"
								: localTheme === "light"
									? "block"
									: "hidden",
						)}
						src={typeof svg.route !== "string" ? svg.route.light : svg.route}
						alt={svg.title}
						title={svg.title}
						loading="lazy"
					/>
				</>
			)}

			{/* Title and Categories */}
			<div className="mb-3 flex flex-col items-center justify-center space-y-1">
				<p className="truncate text-center text-[15px] font-medium text-balance select-all">
					{svg.title}
				</p>
				{svg.subTitle && (
					<p className="-mt-2 mb-2 text-center text-xs text-muted-foreground">
						( {svg.subTitle} )
					</p>
				)}

				<div className="flex items-center justify-center space-x-1">
					{Array.isArray(svg.category) ? (
						<>
							{svg.category
								.slice(0, maxVisibleCategories)
								.map((category, index) => (
									<a
										key={index}
										href={`?cat=${category}`}
										onClick={(e) => handleCategoryClick(category, e)}
										title={`This icon is part of the ${category} category`}
										className={tagesClassName}
									>
										{category}
									</a>
								))}
							{svg.category.length > maxVisibleCategories && (
								<Popover>
									<PopoverTrigger>
										<button className={tagesClassName}>...</button>
									</PopoverTrigger>
									<PopoverContent
										title="Categories"
										className="bg-muted/50 backdrop-blur-2xl"
									>
										<h4 className="mb-2 text-xs font-medium">
											Other categories
										</h4>
										<div className="flex flex-wrap gap-2">
											{svg.category
												.slice(1, svg.category.length)
												.map((category, index) => (
													<a
														key={index}
														href={`?cat=${category}`}
														onClick={(e) => handleCategoryClick(category, e)}
														title={`This icon is part of the ${category} category`}
														className={tagesClassName}
													>
														{category}
													</a>
												))}
										</div>
									</PopoverContent>
								</Popover>
							)}
						</>
					) : (
						<a
							href={`?cat=${svg.category}`}
							onClick={(e) => handleCategoryClick(svg.category as string, e)}
							className={tagesClassName}
						>
							{svg.category}
						</a>
					)}
				</div>
			</div>

			{/* Actions */}
			<div className="flex items-center space-x-1">
				<CopyToClipboard
					iconStroke={iconStroke}
					svgInfo={svg}
					isWordmarkSvg={wordmarkSvg && svg.wordmark !== undefined}
					localTheme={localTheme}
				/>

				<Button
					href={svg.url}
					title="Website"
					target="_blank"
					rel="noopener noreferrer"
					className={btnStyles}
					variant={"ghost"}
					size={"icon"}
				>
					<ArrowUpRight size={iconSize} strokeWidth={iconStroke} />
				</Button>

				{svg.wordmark && (
					<Button
						title={wordmarkSvg ? "Show logo SVG" : "Show wordmark SVG"}
						onClick={() => setWordmarkSvg(!wordmarkSvg)}
						className={btnStyles}
						variant={"ghost"}
						size={"icon"}
					>
						{wordmarkSvg ? (
							<Sparkles size={iconSize} strokeWidth={iconStroke} />
						) : (
							<Baseline size={iconSize} strokeWidth={iconStroke} />
						)}
					</Button>
				)}

				{svg.brandUrl && (
					<Button
						title="Brand Assets"
						onClick={() => window.open(svg.brandUrl, "_blank")}
						className={btnStyles}
						variant={"ghost"}
						size={"icon"}
					>
						<Palette size={iconSize} strokeWidth={iconStroke} />
					</Button>
				)}

				{((wordmarkSvg && typeof svg.wordmark !== "string") ||
					(!wordmarkSvg && typeof svg.route !== "string")) && (
					<Button
						title={`Switch to ${localTheme === "light" ? "dark" : "light"} theme`}
						onClick={() =>
							setLocalTheme((prev) => (prev === "light" ? "dark" : "light"))
						}
						className={btnStyles}
						variant={"ghost"}
						size={"icon"}
					>
						{localTheme === "light" ? (
							<Sun size={iconSize} strokeWidth={iconStroke} />
						) : (
							<Moon size={iconSize} strokeWidth={iconStroke} />
						)}
					</Button>
				)}
			</div>
		</div>
	);
}

export const SvgCard = memo(SvgCardInner);
