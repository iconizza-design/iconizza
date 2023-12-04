import type _Vue from 'vue';
import type { VNode, VNodeData, RenderContext } from 'vue';
import type { IconizzaIcon } from '@iconizza/types';
import { mergeCustomisations } from '@iconizza/utils/lib/customisations/merge';
import { flipFromString } from '@iconizza/utils/lib/customisations/flip';
import { rotateFromString } from '@iconizza/utils/lib/customisations/rotate';
import { iconToSVG } from '@iconizza/utils/lib/svg/build';
import { replaceIDs } from '@iconizza/utils/lib/svg/id';
import type { IconProps } from './props';
import { defaultExtendedIconCustomisations } from './props';

/**
 * Default SVG attributes
 */
const svgDefaults: Record<string, unknown> = {
	'xmlns': 'http://www.w3.org/2000/svg',
	'xmlns:xlink': 'http://www.w3.org/1999/xlink',
	'aria-hidden': true,
	'role': 'img',
};

/**
 * Aliases for customisations.
 * In Vue 'v-' properties are reserved, so v-flip must be renamed
 */
const customisationAliases: Record<string, string> = {};
['horizontal', 'vertical'].forEach((prefix) => {
	const attr = prefix.slice(0, 1) + 'Flip';

	// vertical-flip
	customisationAliases[prefix + '-flip'] = attr;
	// v-flip
	customisationAliases[prefix.slice(0, 1) + '-flip'] = attr;
	// verticalFlip
	customisationAliases[prefix + 'Flip'] = attr;
});

/**
 * Render icon
 */
export const render = (
	createElement: typeof _Vue.prototype.$createElement,

	// context.props
	props: IconProps,

	// context.data
	contextData: VNodeData,

	// Icon must be validated before calling this function
	icon: IconizzaIcon
): VNode => {
	// Split properties
	const customisations = mergeCustomisations(
		defaultExtendedIconCustomisations,
		props
	);
	const componentProps = { ...svgDefaults };

	// Style in Vue 2 components is always passed to rendered component, so no point in parsing it
	const style = {} as Record<string, string>;

	// Get element properties
	for (let key in props) {
		const value = props[key];
		if (value === void 0) {
			continue;
		}
		switch (key) {
			// Properties to ignore
			case 'icon':
			case 'style':
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

			// Color: override style
			case 'color':
				style.color = value;
				break;

			// Rotation as string
			case 'rotate':
				if (typeof value === 'string') {
					customisations[key] = rotateFromString(value);
				} else if (typeof value === 'number') {
					customisations[key] = value;
				}
				break;

			// Remove aria-hidden
			case 'ariaHidden':
			case 'aria-hidden':
				// Vue transforms 'aria-hidden' property to 'ariaHidden'
				if (value !== true && value !== 'true') {
					delete componentProps['aria-hidden'];
				}
				break;

			default:
				const alias = customisationAliases[key];
				if (alias) {
					// Aliases for boolean customisations
					if (value === true || value === 'true' || value === 1) {
						customisations[alias] = true;
					}
				} else if (defaultExtendedIconCustomisations[key] === void 0) {
					// Copy missing property if it does not exist in customisations
					componentProps[key] = value;
				}
		}
	}

	// Generate icon
	const item = iconToSVG(icon, customisations);

	// Add icon stuff
	for (let key in item.attributes) {
		componentProps[key] = item.attributes[key];
	}

	if (customisations.inline) {
		style.verticalAlign = '-0.125em';
	}

	// Counter for ids based on "id" property to render icons consistently on server and client
	let localCounter = 0;
	let id = props.id;
	if (typeof id === 'string') {
		// Convert '-' to '_' to avoid errors in animations
		id = id.replace(/-/g, '_');
	}

	// Generate node data
	const data: VNodeData = {
		attrs: componentProps,
		domProps: {
			innerHTML: replaceIDs(
				item.body,
				id ? () => id + 'ID' + localCounter++ : 'iconizzaVue'
			),
		},
	};
	if (Object.keys(style).length > 0) {
		data.style = style;
	}

	if (contextData) {
		['on', 'ref'].forEach((attr) => {
			if (contextData[attr] !== void 0) {
				data[attr] = contextData[attr];
			}
		});
		['staticClass', 'class'].forEach((attr) => {
			if (contextData[attr] !== void 0) {
				data.class = contextData[attr];
			}
		});
	}

	// Render icon
	return createElement('svg', data);
};
