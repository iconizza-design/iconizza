// @ts-ignore
import { htmlSafe } from '@ember/template';
import type { IconizzaIcon } from '@iconizza/types';
import { mergeCustomisations } from '@iconizza/utils/lib/customisations/merge';
import { flipFromString } from '@iconizza/utils/lib/customisations/flip';
import { rotateFromString } from '@iconizza/utils/lib/customisations/rotate';
import { iconToSVG } from '@iconizza/utils/lib/svg/build';
import { replaceIDs } from '@iconizza/utils/lib/svg/id';
import type { IconizzaIconCustomisations, IconizzaIconProps } from './props';
import { defaultExtendedIconCustomisations } from './props';

/**
 * Render result
 */
export interface RenderResult {
	width?: string | number;
	height?: string | number;
	viewBox: string;
	style?: string;
	className: string;
	body: string;
}

/**
 * Render icon
 */
export const render = (
	// Icon must be validated before calling this function
	icon: IconizzaIcon,

	// Partial properties
	props: IconizzaIconProps,

	// Class name
	className: string
): RenderResult => {
	// Get all customisations
	const customisations = mergeCustomisations(
		defaultExtendedIconCustomisations,
		props as IconizzaIconCustomisations
	);

	// Create empty style
	let style = '';

	// Get element properties
	for (let key in props) {
		const value = props[key];
		if (value === void 0) {
			continue;
		}
		switch (key) {
			// Properties to ignore
			case 'icon':
			case 'onLoad':
				break;

			// Boolean attributes
			case 'inline':
			case 'hFlip':
			case 'vFlip':
				customisations[key] =
					value === true || value === 'true' || value === 1;
				break;

			// Flip as string: 'horizontal,vertical'
			case 'flip':
				if (typeof value === 'string') {
					flipFromString(customisations, value);
				}
				break;

			// Color: copy to style
			case 'color':
				style += 'color: ' + value + ';';
				break;

			// Rotation as string
			case 'rotate':
				if (typeof value === 'string') {
					customisations[key] = rotateFromString(value);
				} else if (typeof value === 'number') {
					customisations[key] = value;
				}
				break;

			// Ignore other properties
		}
	}

	// Generate icon
	const item = iconToSVG(icon, customisations);

	// Counter for ids based on "id" property to render icons consistently on server and client
	let localCounter = 0;
	let id = props.id;
	if (typeof id === 'string') {
		// Convert '-' to '_' to avoid errors in animations
		id = id.replace(/-/g, '_');
	}

	// Create body
	const body = replaceIDs(
		item.body,
		id ? () => id + 'ID' + localCounter++ : 'iconizzaEmber'
	);

	// Add inline
	if (customisations.inline) {
		style += 'vertical-align: -0.125em;';
	}

	return {
		...item.attributes,
		style: style === '' ? void 0 : htmlSafe(style),
		className,
		body,
	};
};
