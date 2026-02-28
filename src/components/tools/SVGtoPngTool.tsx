"use client";
// import { usePlausible } from "next-plausible";
// import { Button } from "@/components/ui/button";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { toast } from "sonner";

import {
	type FileUploaderResult,
	useFileUploader,
} from "@/hooks/use-file-uploader";
import { UploadBox } from "@/components/tools/shared/upload-box";
import { SVGScaleSelector } from "@/components/tools/svg-scale-selector";
import { FileDropzone } from "@/components/tools/shared/file-dropzone";
import { getSvgDimensions } from "@/lib/utils/svg-dimensions";
import { cn } from "@/lib/utils";

export type Scale = "custom" | number;

function scaleSvg(svgContent: string, scale: number) {
	const parser = new DOMParser();
	const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
	const svgElement = svgDoc.documentElement;
	const { width, height } = getSvgDimensions(svgElement);

	const scaledWidth = width * scale;
	const scaledHeight = height * scale;

	svgElement.setAttribute("width", scaledWidth.toString());
	svgElement.setAttribute("height", scaledHeight.toString());

	return new XMLSerializer().serializeToString(svgDoc);
}

function useSvgConverter(props: {
	canvas: HTMLCanvasElement | null;
	svgContent: string;
	scale: number;
	fileName?: string;
	imageMetadata: { width: number; height: number; name: string };
}) {
	const { width, height, scaledSvg } = useMemo(() => {
		const scaledSvg = scaleSvg(props.svgContent, props.scale);

		return {
			width: props.imageMetadata.width * props.scale,
			height: props.imageMetadata.height * props.scale,
			scaledSvg,
		};
	}, [props.svgContent, props.scale, props.imageMetadata]);

	const drawToCanvas = (onDone: () => void) => {
		const ctx = props.canvas?.getContext("2d");
		if (!ctx) throw new Error("Failed to get canvas context");

		const img = new Image();
		img.onload = () => {
			ctx.drawImage(img, 0, 0);
			onDone();
		};
		img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(scaledSvg)}`;
	};

	const convertToPng = () => {
		drawToCanvas(() => {
			if (props.canvas) {
				const dataURL = props.canvas.toDataURL("image/png");
				const link = document.createElement("a");
				link.href = dataURL;
				const svgFileName = props.imageMetadata.name ?? "svg_converted";
				link.download = `${svgFileName.replace(".svg", "")}-${props.scale}x.png`;
				link.click();
			}
		});
	};

	const copyToClipboard = () => {
		drawToCanvas(async () => {
			if (!props.canvas) return;
			try {
				props.canvas.toBlob(async (blob) => {
					if (!blob) return;
					await navigator.clipboard.write([
						new ClipboardItem({ "image/png": blob }),
					]);
					toast.success("PNG copied to clipboard");
				}, "image/png");
			} catch {
				toast.error("Failed to copy to clipboard");
			}
		});
	};

	return {
		convertToPng,
		copyToClipboard,
		canvasProps: { width: width, height: height },
	};
}

interface SVGRendererProps {
	svgContent: string;
	className?: string;
}

function SVGRenderer({ svgContent, className }: SVGRendererProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.innerHTML = svgContent;
			const svgElement = containerRef.current.querySelector("svg");
			if (svgElement) {
				svgElement.setAttribute("width", "100%");
				svgElement.setAttribute("height", "100%");
			}
		}
	}, [svgContent]);

	return <div ref={containerRef} className={className} />;
}

function SaveAsPngButton({
	svgContent,
	scale,
	imageMetadata,
}: {
	svgContent: string;
	scale: number;
	imageMetadata: { width: number; height: number; name: string };
}) {
	const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
	const { convertToPng, copyToClipboard, canvasProps } = useSvgConverter({
		canvas: canvasRef,
		svgContent,
		scale,
		imageMetadata,
	});

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.ctrlKey || e.metaKey) {
				if (e.key.toLowerCase() === "s") {
					e.preventDefault();
					void convertToPng();
				} else if (e.key.toLowerCase() === "c") {
					e.preventDefault();
					void copyToClipboard();
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [convertToPng, copyToClipboard]);

	return (
		<div className="flex flex-wrap justify-center gap-3">
			<canvas ref={setCanvasRef} {...canvasProps} hidden />
			<button
				onClick={() => void copyToClipboard()}
				className="focus:ring-opacity-75 rounded bg-muted px-4 py-2 text-sm font-semibold text-foreground shadow-md transition-colors duration-200 hover:bg-muted/80 focus:ring-2 focus:ring-primary focus:outline-none"
				title="Keyboard shortcut: Ctrl/Cmd + C"
			>
				Copy PNG
				<kbd className="ml-2">(⌘ C)</kbd>
			</button>
			<button
				onClick={() => void convertToPng()}
				className="focus:ring-opacity-75 rounded bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors duration-200 hover:bg-green-800 focus:ring-2 focus:ring-green-400 focus:outline-none"
				title="Keyboard shortcut: Ctrl/Cmd + S"
			>
				Save as PNG
				<kbd className="ml-2">(⌘ S)</kbd>
			</button>
		</div>
	);
}

function SVGToolCore(props: { fileUploaderProps: FileUploaderResult }) {
	const {
		rawContent,
		imageMetadata,
		handleFileUploadEvent,
		cancel,
		handleFileUpload,
	} = props.fileUploaderProps;

	const [scale, setScale] = useLocalStorage<Scale>("svgTool_scale", 1);
	const [customScale, setCustomScale] = useLocalStorage<number>(
		"svgTool_customScale",
		1,
	);

	// Combine keyboard shortcuts into a single effect
	useEffect(() => {
		const handleKeyboardShortcuts = (e: KeyboardEvent) => {
			if (e.ctrlKey || e.metaKey) {
				if (e.key.toLowerCase() === "x") {
					e.preventDefault();
					cancel();
				}
			}
		};

		window.addEventListener("keydown", handleKeyboardShortcuts);
		return () => window.removeEventListener("keydown", handleKeyboardShortcuts);
	}, [cancel]);

	// Simplified paste handler with toast notifications
	const handlePaste = async (e: ClipboardEvent) => {
		try {
			const items = e.clipboardData?.items;
			if (!items) return;

			let foundValidContent = false;

			for (const item of items) {
				if (item.type === "image/svg+xml") {
					const blob = item.getAsFile();
					if (blob) {
						handleFileUpload(blob);
						foundValidContent = true;
						break;
					}
				} else if (item.type === "text/plain") {
					await new Promise<void>((resolve) => {
						item.getAsString((text) => {
							if (text.trim().toLowerCase().startsWith("<svg")) {
								const parser = new DOMParser();
								const svgDoc = parser.parseFromString(text, "image/svg+xml");
								const titleElement = svgDoc.querySelector("title");
								const fileName = titleElement?.textContent || "pasted-svg";

								const blob = new Blob([text], { type: "image/svg+xml" });
								const file = new File([blob], `${fileName}.svg`, {
									type: "image/svg+xml",
									lastModified: Date.now(),
								});
								handleFileUpload(file);
								foundValidContent = true;
							}
							resolve();
						});
					});
				}
				if (foundValidContent) break;
			}

			if (!foundValidContent) {
				toast.error("No valid SVG content found in clipboard", {
					description: "No valid SVG content found in clipboard",
				});
			}
		} catch (error) {
			toast.error("Failed to paste SVG content", {
				description: "Failed to paste SVG content",
			});
		}
	};

	// Add effect to handle paste events
	useEffect(() => {
		document.addEventListener("paste", handlePaste);
		return () => document.removeEventListener("paste", handlePaste);
	}, []);

	// Get the actual numeric scale value
	const effectiveScale = scale === "custom" ? customScale : scale;

	if (!imageMetadata)
		return (
			<div className="flex flex-col gap-2">
				<UploadBox
					title="SVG to PNG"
					subtitle="Allows pasting SVG from clipboard."
					divTitle="Keyboard shortcut: Ctrl/Cmd + V"
					description="Upload SVG"
					accept=".svg"
					onChange={handleFileUploadEvent}
				/>
				{/* Mobile paste button with toast */}
				<button
					onClick={async () => {
						try {
							const text = await navigator.clipboard.readText();
							if (text.trim().toLowerCase().startsWith("<svg")) {
								const parser = new DOMParser();
								const svgDoc = parser.parseFromString(text, "image/svg+xml");
								const titleElement = svgDoc.querySelector("title");
								const fileName = titleElement?.textContent || "pasted-svg";

								const blob = new Blob([text], { type: "image/svg+xml" });
								const file = new File([blob], `${fileName}.svg`, {
									type: "image/svg+xml",
									lastModified: Date.now(),
								});
								handleFileUpload(file);
								return;
							} else {
								toast.error("Error", {
									description: "No valid SVG content found in clipboard",
								});
							}
						} catch (error) {
							toast.error("Failed to read clipboard");
							console.error("Clipboard error:", error);
						}
					}}
					className="mx-auto rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 lg:hidden"
				>
					Paste SVG
				</button>
			</div>
		);

	return (
		<div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-6 p-6">
			{/* Preview Section */}
			<div className="flex w-full flex-col items-center gap-4 rounded-xl p-6">
				<div className="relative size-96">
					{/* <div
						className="absolute inset-0 grid size-full"
						style={{
							backgroundImage:
								"url('data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAACoAAAAoCAYAAACIC2hQAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAbRJREFUeNrsl91ugzAMhQMGJk3qNJVe7f0fb/+TWlqVskQ6YVYaCC2OduNIp6XCMV9DnCMXxpgX8zf2Vp/sN1nt8B2Oo9Ubrp+tHs30GBB7smqsWqsiEndGXG+1gUaQDQusrDqrSwLS3f9CQoM5NeZLQBrEu/HgPspIwjPg2hnIdyRySbZ48AdWeQ5yuwCyYYv3A40ryhN6yCoB6VenxvUBajA3BlkugGz9KmKuU0GMPAU5RCALtmU4rIP/vhOy4K8cOY6Ei34BZGqfVQD0sH0CsmeQFeohzDnCEiuqdmUxeFhCcfnToJ6AfGWFc2F/1MRgXdInaC2kHzWDPWIeTUAS/swJb4GmYP1KlkKQIewBwB42hNzhXoO4SdjwHL3n7NsjJgVLOML6yBlNKdgY6K0HdBds/DnYYcZIiBVjF8KGoCIuEimw1W5X5nCRHG4Xc6bVLoJ7om5HOVwkh9tRDhfJ4XZ8v4i5yMKVvMntvDOIuggeKup2hNct6iKIEXU7X/WiLiLQjly5HT/wxVxEoB25cjvtmbRn0p5JeybtmbRn0p5JeybtmbRn0p5Je6Z/6Jl+BRgAqFHkuKGmPZUAAAAASUVORK5CYII=')",
						}}
					></div> */}
					<SVGRenderer
						svgContent={rawContent}
						className="relative size-96 object-contain"
					/>
				</div>
				<div className="text-center">
					<p className="text-lg font-medium text-foreground/80">
						{imageMetadata.name}
					</p>
					<p className="text-xs text-foreground/60 md:text-sm">
						if you can't see the img,<br></br>try switching the theme to
						light/dark
					</p>
				</div>
			</div>

			{/* Size Information */}
			<div className="flex gap-6 text-base">
				<div className="flex flex-col items-center rounded bg-muted/80 p-3">
					<span className="text-sm opacity-60">Original</span>
					<span className="font-medium">
						{imageMetadata.width} × {imageMetadata.height}
					</span>
				</div>

				<div className="flex flex-col items-center rounded bg-muted/80 p-3">
					<span className="text-sm opacity-60">Scaled</span>
					<span className="font-medium">
						{imageMetadata.width * effectiveScale} ×{" "}
						{imageMetadata.height * effectiveScale}
					</span>
				</div>
			</div>

			{/* Scale Controls */}
			<SVGScaleSelector
				title="Scale Factor"
				options={[1, 2, 4, 8, 16, 32, 64]}
				selected={scale}
				onChange={setScale}
				customValue={customScale}
				onCustomValueChange={setCustomScale}
			/>

			{/* Action Buttons */}
			<div className="flex flex-wrap justify-center gap-3">
				<button
					onClick={cancel}
					className="rounded bg-red-700 px-4 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-red-800"
					title="Keyboard shortcut: Ctrl/Cmd + X"
				>
					Cancel
					<kbd className="ml-2">(⌘ X)</kbd>
				</button>
				<SaveAsPngButton
					svgContent={rawContent}
					scale={effectiveScale}
					imageMetadata={imageMetadata}
				/>
			</div>
		</div>
	);
}

export function SVGTool({ className }: { className?: string }) {
	const fileUploaderProps = useFileUploader();
	return (
		<FileDropzone
			setCurrentFile={fileUploaderProps.handleFileUpload}
			acceptedFileTypes={["image/svg+xml", ".svg"]}
			dropText="Drop or paste SVG file"
			className={cn(className)}
		>
			<SVGToolCore fileUploaderProps={fileUploaderProps} />
		</FileDropzone>
	);
}
