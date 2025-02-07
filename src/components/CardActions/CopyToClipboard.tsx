import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CopyIcon, Loader, X } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
type TCopyToClipboard = {
	className?: string;
	iconClassName?: string;
	iconStroke?: number;
	isWordmarkSvg?: boolean;
	svgInfo: {
		title: string;
		category: string | string[];
		route:
			| string
			| {
					dark: string;
					light: string;
			  };
		wordmark?:
			| string
			| {
					dark: string;
					light: string;
			  };
	};
};

export function CopyToClipboard({
	className,
	iconClassName = "size-4",
	iconStroke = 2,
	isWordmarkSvg = false,
	svgInfo,
}: TCopyToClipboard) {
	const { toast } = useToast();

	// Updated getSvgUrl to handle wordmark SVGs
	const getSvgUrl = () => {
		const dark = document.documentElement.classList.contains("dark");

		if (isWordmarkSvg) {
			const svgHasTheme = typeof svgInfo.wordmark !== "string";
			if (!svgHasTheme) {
				return typeof svgInfo.wordmark === "string"
					? svgInfo.wordmark
					: "Something went wrong. Couldn't copy the SVG.";
			}

			return typeof svgInfo.wordmark !== "string"
				? dark
					? svgInfo.wordmark?.dark
					: svgInfo.wordmark?.light
				: svgInfo.wordmark;
		}

		const svgHasTheme = typeof svgInfo.route !== "string";
		if (!svgHasTheme) {
			return typeof svgInfo.route === "string"
				? svgInfo.route
				: "Something went wrong. Couldn't copy the SVG.";
		}

		return typeof svgInfo.route !== "string"
			? dark
				? svgInfo.route.dark
				: svgInfo.route.light
			: svgInfo.route;
	};

	// Updated copyToClipboard to handle wordmark SVGs
	const copyToClipboard = async () => {
		const svgUrlToCopy = getSvgUrl();
		if (!svgUrlToCopy) {
			toast({
				title: "Invalid SVG URL",
				description: `${svgInfo.title}`,
			});
			return;
		}

		try {
			const response = await fetch(svgUrlToCopy);
			let content = await response.text();

			// Parse SVG and add/update title if needed
			const parser = new DOMParser();
			const svgDoc = parser.parseFromString(content, "image/svg+xml");
			const svgElement = svgDoc.documentElement;

			// Find or create title element
			let titleElement = svgElement.querySelector("title");
			if (!titleElement) {
				titleElement = svgDoc.createElement("title");
				// Insert title as first child
				svgElement.insertBefore(titleElement, svgElement.firstChild);
			} else titleElement.removeAttribute("xmlns"); // Remove any xmlns attribute from the title element

			titleElement.textContent = svgInfo.title;

			// Serialize back to string and clean up any xmlns attributes in the title tag
			content = new XMLSerializer()
				.serializeToString(svgDoc)
				.replace(/<title xmlns(?:="[^"]*"|='[^']*'|)>/, "<title>"); // Remove xmlns attribute from title tag

			await navigator.clipboard.writeText(content);

			if (isWordmarkSvg) {
				toast({
					title: "Copied wordmark SVG to clipboard",
					description: `${svgInfo.title}`,
				});
				return;
			}

			toast({
				title: "Copied svg to clipboard",
				description: `${svgInfo.title}`,
			});
		} catch (err) {
			console.error("Failed to copy:", err);
			toast({
				title: "Failed to copy SVG",
				description: `${svgInfo.title} - ${err}`,
			});
		}
	};

	return (
		<Button
			variant={"ghost"}
			size={"icon"}
			onClick={copyToClipboard}
			className={cn("", className)}
		>
			<CopyIcon
				className={cn("size-4", iconClassName)}
				strokeWidth={iconStroke}
			/>
			<span className="sr-only">Copy button</span>
		</Button>
	);
}
