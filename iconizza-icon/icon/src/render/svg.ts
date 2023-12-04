import type { IconizzaIconBuildResult } from '@iconizza/utils/lib/svg/build';
import { iconToHTML } from '@iconizza/utils/lib/svg/html';
import { cleanUpInnerHTML } from '@iconizza/utils/lib/svg/inner-html';

/**
 * Render node as <svg>
 */
export function renderSVG(data: IconizzaIconBuildResult): Element {
	const node = document.createElement('span');

	// Add style if needed
	const attr = data.attributes as Record<string, string>;
	let style = '';
	if (!attr.width) {
		style = 'width: inherit;';
	}
	if (!attr.height) {
		style += 'height: inherit;';
	}
	if (style) {
		attr.style = style;
	}

	// Generate SVG
	const html = iconToHTML(data.body, attr);
	node.innerHTML = cleanUpInnerHTML(html);
	return node.firstChild as HTMLElement;
}
