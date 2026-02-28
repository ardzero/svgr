/** Read width/height from SVG, falling back to viewBox when attributes are missing. */
export function getSvgDimensions(
	svgElement: Element,
): { width: number; height: number } {
	const w = svgElement.getAttribute("width");
	const h = svgElement.getAttribute("height");
	const parsedW = w != null ? parseFloat(w) : NaN;
	const parsedH = h != null ? parseFloat(h) : NaN;
	if (
		Number.isFinite(parsedW) &&
		Number.isFinite(parsedH) &&
		parsedW > 0 &&
		parsedH > 0
	) {
		return { width: Math.round(parsedW), height: Math.round(parsedH) };
	}
	const viewBox = svgElement.getAttribute("viewBox");
	if (viewBox) {
		const parts = viewBox.trim().split(/\s+/);
		if (parts.length >= 4) {
			const vw = parseFloat(parts[2]);
			const vh = parseFloat(parts[3]);
			if (
				Number.isFinite(vw) &&
				Number.isFinite(vh) &&
				vw > 0 &&
				vh > 0
			) {
				return { width: Math.round(vw), height: Math.round(vh) };
			}
		}
	}
	return { width: 300, height: 300 };
}
