import type { IconizzaIcon } from '@iconizza/types';
import type { IconizzaIconCustomisations as RawIconizzaIconCustomisations } from '@iconizza/utils/lib/customisations/defaults';
import { defaultIconCustomisations } from '@iconizza/utils/lib/customisations/defaults';

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
 * Callback for when icon has been loaded (only triggered for icons loaded from API)
 */
export type IconizzaIconOnLoad = (name: string) => void;

/**
 * Icon properties
 */
export interface IconizzaIconProps extends IconizzaIconCustomisations {
	// Icon object or icon name (must be added to storage using addIcon for offline package)
	icon: IconizzaIcon | string;

	// Style
	color?: string;

	// Flip shorthand
	flip?: string;

	// Unique id, used as base for ids for shapes. Use it to get consistent ids for server side rendering
	id?: string;

	// Callback to call when icon data has been loaded. Used only for icons loaded from API
	onLoad?: IconizzaIconOnLoad;
}
