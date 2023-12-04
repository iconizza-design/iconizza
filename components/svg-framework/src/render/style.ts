import type {
	IconizzaElement,
	IconizzaElementChangedStyles,
} from '../scanner/config';

/**
 * Copy old styles, apply new styles
 */
export function applyStyle(
	svg: IconizzaElement,
	styles: Record<string, string>,
	previouslyAddedStyles?: IconizzaElementChangedStyles
): IconizzaElementChangedStyles {
	const svgStyle = svg.style;

	// Remove previously added styles
	(previouslyAddedStyles || []).forEach((prop) => {
		svgStyle.removeProperty(prop);
	});

	// Apply new styles, ignoring styles that already exist
	const appliedStyles: IconizzaElementChangedStyles = [];
	for (const prop in styles) {
		if (!svgStyle.getPropertyValue(prop)) {
			appliedStyles.push(prop);
			svgStyle.setProperty(prop, styles[prop]);
		}
	}

	return appliedStyles;
}
