import type { FullIconCustomisations } from '@iconizza/utils/lib/customisations/defaults';
import { defaultIconCustomisations } from '@iconizza/utils/lib/customisations/defaults';
import { rotateFromString } from '@iconizza/utils/lib/customisations/rotate';
import { flipFromString } from '@iconizza/utils/lib/customisations/flip';
import type { IconizzaIconSVGAttributes } from './types';

/**
 * Customisations that affect rendering
 */
export type RenderedIconCustomisations = FullIconCustomisations &
	IconizzaIconSVGAttributes;

const defaultCustomisations = {
	...defaultIconCustomisations,
	preserveAspectRatio: '',
} as IconizzaIconSVGAttributes & FullIconCustomisations;
export { defaultCustomisations };

/**
 * Get customisations
 */
export function getCustomisations(node: Element): RenderedIconCustomisations {
	const customisations = {
		...defaultCustomisations,
	};

	const attr = (key: string, def: string | null) =>
		node.getAttribute(key) || def;

	// Dimensions
	customisations.width = attr('width', null);
	customisations.height = attr('height', null);

	// Rotation
	customisations.rotate = rotateFromString(attr('rotate', ''));

	// Flip
	flipFromString(customisations, attr('flip', ''));

	// SVG attributes
	customisations.preserveAspectRatio = attr(
		'preserveAspectRatio',
		attr('preserveaspectratio', '')
	);

	return customisations;
}

/**
 * Check if customisations have been updated
 */
export function haveCustomisationsChanged(
	value1: RenderedIconCustomisations,
	value2: RenderedIconCustomisations
): boolean {
	for (const key in defaultCustomisations) {
		if (value1[key] !== value2[key]) {
			return true;
		}
	}

	return false;
}
