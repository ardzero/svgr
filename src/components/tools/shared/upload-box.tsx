import React from "react";
import { Button } from "@/components/ui/button";

interface UploadBoxProps {
	title: string;
	subtitle?: string;
	description: string;
	accept: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function UploadBox({
	title,
	subtitle,
	description,
	accept,
	onChange,
}: UploadBoxProps) {
	return (
		<div className="flex flex-col items-center justify-center gap-4 p-4">
			<div className="flex flex-col items-center gap-2">
				<div className="flex flex-col items-center gap-2">
					<h1 className="text-center text-2xl font-bold">{title}</h1>
					{subtitle && (
						<p className="inline-block rounded-full border bg-foreground/5 px-3 py-1 text-center text-sm">
							{subtitle}
						</p>
					)}
				</div>
			</div>
			<div className="flex w-full max-w-80 flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-foreground/30 bg-muted p-6 py-8 backdrop-blur-sm dark:bg-muted/50">
				<svg
					className="h-8 w-8 text-muted-foreground"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="m18 9-6-6-6 6" />
					<path d="M12 3v14" />
					<path d="M5 21h14" />
				</svg>
				<p className="text-sm text-muted-foreground">Drag and Drop</p>
				<p className="text-sm text-muted-foreground/80">or</p>
				<Button asChild>
					<label className="font-semibold" tabIndex={0} role="button">
						<span>{description}</span>
						<input
							type="file"
							onChange={onChange}
							accept={accept}
							className="hidden"
						/>
					</label>
				</Button>
			</div>
			<p className="text-sm opacity-80">
				{/* {subtitle} */} This is based on{" "}
				<a
					href="https://github.com/t3dotgg/quickpic"
					className="text-blue-500 underline focus-within:text-blue-600 hover:text-blue-600 dark:text-blue-400 dark:focus-within:text-blue-500 dark:hover:text-blue-500"
				>
					theo's quikpic
				</a>
			</p>
		</div>
	);
}
