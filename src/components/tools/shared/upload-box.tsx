import React from "react";

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
						<p className="inline-block rounded-full border border-white/30 bg-white/5 px-2 py-0.5 text-center text-sm text-white/60">
							{subtitle}
						</p>
					)}
				</div>
			</div>
			<div className="flex w-72 flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-white/30 bg-white/10 p-6 backdrop-blur-sm">
				<svg
					className="h-8 w-8 text-gray-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
					/>
				</svg>
				<p className="text-sm text-gray-400">Drag and Drop</p>
				<p className="text-sm text-gray-500">or</p>
				<label className="focus:ring-opacity-75 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-md transition-colors duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none">
					<span>{description}</span>
					<input
						type="file"
						onChange={onChange}
						accept={accept}
						className="hidden"
					/>
				</label>
			</div>
			<p className="text-sm opacity-80">
				{/* {subtitle} */} This is based on{" "}
				<a
					href="https://github.com/t3dotgg/quickpic"
					className="text-blue-400 underline focus-within:text-blue-500 hover:text-blue-500"
				>
					theo's quikpic
				</a>
			</p>
		</div>
	);
}
