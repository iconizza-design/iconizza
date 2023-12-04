import type { IconizzaIcon } from '@iconizza/types';
import type { IconizzaIconCustomisations as RawIconizzaIconCustomisations } from '@iconizza/utils/lib/customisations/defaults';
import { defaultIconCustomisations } from '@iconizza/utils/lib/customisations/defaults';

/**
 * Icon render mode
 *
 * 'style' = 'bg' or 'mask', depending on icon content
 * 'bg' = <span> with style using `background`
 * 'mask' = <span> with style using `mask`
 * 'svg' = <svg>
 */
export type IconizzaRenderMode = 'style' | 'bg' | 'mask' | 'svg';

/**
 * Icon customisations
 */
export type IconizzaIconCustomisations = RawIconizzaIconCustomisations & {
	// Allow rotation to be string
	rotate?: string | number;

	// Inline mode
	inline?: boolean;
};

export const defaultExtendedIconCustomisations = {
	...defaultIconCustomisations,
	inline: false,
};

/**
 * Icon properties
 */
export interface IconizzaIconProps extends IconizzaIconCustomisations {
	// Icon object
	icon: IconizzaIcon | string;

	// Render mode
	mode?: IconizzaRenderMode;

	// Style
	color?: string;

	// Flip shorthand
	flip?: string;
}

/**
 * Properties for element that are mentioned in render.ts
 */
interface IconizzaElementProps {
	// Unique id, used as base for ids for shapes. Use it to get consistent ids for server side rendering
	id?: string;

	// Style
	style?: string;
}

/**
 * Mix of icon properties and HTMLElement properties
 */
export type IconProps = IconizzaElementProps & IconizzaIconProps;
