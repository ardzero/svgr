import { cn } from "@/lib/utils";
import type { iSVG } from "@/types/svg";
import { useState, useEffect } from "react";
import { getSvgContent } from "@/lib/utils/getSvgContent";
import {
	ArrowUpRight,
	ChevronsRight,
	Baseline,
	Sparkles,
	MoreHorizontal,
	Tag,
	X,
	Palette,
} from "lucide-react";

// import DownloadSvg from "@/components/DownloadSvg";
// import CopySvg from "@/components/CopySvg";
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

export function SvgCard({ className, svg, searchTerm }: TSvgCard) {
	const [isInFigma, setIsInFigma] = useState(false);
	const [wordmarkSvg, setWordmarkSvg] = useState(false);

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		setIsInFigma(searchParams.get("figma") === "1");
	}, []);

	// useEffect(() => {
	// 	if (searchTerm) {
	// 		setWordmarkSvg(false);
	// 	}
	// }, [searchTerm]);

	const insertSVG = async (url?: string) => {
		const content = await getSvgContent(url);
		// Implement your Figma insert logic here
	};

	const iconStroke = 2;
	const iconSize = 13;
	const maxVisibleCategories = 1;
	const btnStyles = "";
	const globalImageStyles = "mb-4 mt-2 h-10 select-none pointer-events-none";
	const tagesClassName =
		"rounded-md border border-border px-2 py-1 text-xs hover:bg-muted";

	const handleCategoryClick = (category: string, e: React.MouseEvent) => {
		e.preventDefault();
		const params = new URLSearchParams(window.location.search);
		params.set("cat", category);

		const newUrl = `${window.location.pathname}?${params.toString()}`;
		window.history.pushState({}, "", newUrl);
		window.dispatchEvent(new Event("urlchange"));
	};

	return (
		<div
			className={cn(
				"group flex flex-col items-center justify-center rounded-md border border-neutral-200 p-4 transition-colors duration-100 hover:bg-neutral-100/80 dark:border-neutral-800 dark:hover:bg-neutral-800/20",
				className,
			)}
		>
			{/* Image */}
			{wordmarkSvg && svg.wordmark ? (
				<>
					<img
						className={cn("hidden dark:block", globalImageStyles)}
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
						className={cn("block dark:hidden", globalImageStyles)}
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
						className={cn("hidden dark:block", globalImageStyles)}
						src={typeof svg.route !== "string" ? svg.route.dark : svg.route}
						alt={svg.title}
						title={svg.title}
						loading="lazy"
					/>
					<img
						className={cn("block dark:hidden", globalImageStyles)}
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
				{/* {isInFigma && (
					<Button
						title="Insert to figma"
						onClick={() => {
							const svgHasTheme = typeof svg.route !== "string";
							if (!svgHasTheme) {
								insertSVG(typeof svg.route === "string" ? svg.route : "");
								return;
							}
							const isDark =
								document.documentElement.classList.contains("dark");
							insertSVG(
								typeof svg.route !== "string"
									? isDark
										? svg.route.dark
										: svg.route.light
									: svg.route,
							);
						}}
						className={btnStyles}
					>
						<ChevronsRight size={iconSize} strokeWidth={iconStroke} />
					</Button>
				)} */}

				<CopyToClipboard
					iconStroke={iconStroke}
					svgInfo={svg}
					isWordmarkSvg={wordmarkSvg && svg.wordmark !== undefined}
				/>

				{/*
				<DownloadSvg
					svg={svg}
					isDarkTheme={() =>
						document.documentElement.classList.contains("dark")
					}
				/> */}

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
			</div>
		</div>
	);
}
