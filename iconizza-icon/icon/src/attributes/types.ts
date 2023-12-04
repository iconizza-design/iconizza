import type { IconizzaIcon } from '@iconizza/types';

/**
 * SVG attributes that can be overwritten
 */
export interface IconizzaIconSVGAttributes {
	preserveAspectRatio: string;
}

/**
 * Icon render modes
 *
 * 'bg' = SPAN with style using `background`
 * 'mask' = SPAN with style using `mask`
 * 'svg' = SVG
 */
export type ActualRenderMode = 'bg' | 'mask' | 'svg';

/**
 * Extra render modes
 *
 * 'style' = 'bg' or 'mask', depending on icon content
 */
export type IconizzaRenderMode = 'style' | ActualRenderMode;

/**
 * Icon customisations
 */
export type IconizzaIconCustomisationProperties = {
	// Dimensions
	width?: string | number;
	height?: string | number;

	// Transformations
	rotate?: string | number;
	flip?: string;
};

/**
 * All properties
 */
export interface IconizzaIconProperties
	extends IconizzaIconCustomisationProperties,
		Partial<IconizzaIconSVGAttributes> {
	// Icon to render: name, object or serialised object
	icon: string | IconizzaIcon;

	// Render mode
	mode?: IconizzaRenderMode;

	// Inline mode
	inline?: boolean;
}

/**
 * Attributes as properties
 */
export interface IconizzaIconAttributes
	extends Partial<
			Record<keyof Omit<IconizzaIconProperties, 'icon' | 'mode'>, string>
		>,
		Partial<IconizzaIconSVGAttributes> {
	// Icon to render: name or serialised object
	icon: string;

	// Render mode
	mode?: IconizzaRenderMode;
}
