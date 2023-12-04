import type { IconizzaIcon } from '@iconizza/types';
import type { IconizzaIconName } from '@iconizza/utils/lib/icon/name';
import type { IconizzaIconLoaderAbort } from '@iconizza/core/lib/api/icons';

/**
 * Value for currently selected icon
 */
export interface CurrentIconData {
	// Value passed as parameter
	value: unknown;

	// Data, if available. Can be null if icon is missing in API
	data?: IconizzaIcon | null;

	// Icon name as object, if `value` is a valid icon name
	name?: IconizzaIconName | null;

	// Loader abort function, set if icon is being loaded. Used only when `name` is valid
	loading?: IconizzaIconLoaderAbort;
}

/**
 * Same as above, used if icon is currenly being rendered
 */
export interface RenderedCurrentIconData extends CurrentIconData {
	// Icon data
	data: IconizzaIcon;
}
