import type { IconizzaJSON, IconizzaIcon } from '@iconizza/types';

// Core
import type { IconizzaIconName } from '@iconizza/utils/lib/icon/name';
import { stringToIcon } from '@iconizza/utils/lib/icon/name';
import type { IconizzaIconSize } from '@iconizza/utils/lib/customisations/defaults';
import type { IconizzaStorageFunctions } from '@iconizza/core/lib/storage/functions';
import {
	iconLoaded,
	getIcon,
	addIcon,
	addCollection,
	getIconData,
	allowSimpleNames,
} from '@iconizza/core/lib/storage/functions';
import { listIcons } from '@iconizza/core/lib/storage/storage';
import type { IconizzaBuilderFunctions } from '@iconizza/core/lib/builder/functions';
import { iconToSVG as buildIcon } from '@iconizza/utils/lib/svg/build';
import { replaceIDs } from '@iconizza/utils/lib/svg/id';
import { calculateSize } from '@iconizza/utils/lib/svg/size';
import type { IconizzaIconBuildResult } from '@iconizza/utils/lib/svg/build';
import { defaultIconProps } from '@iconizza/utils/lib/icon/defaults';

// API
import type {
	IconizzaAPIFunctions,
	IconizzaAPIInternalFunctions,
	IconizzaAPIQueryParams,
	IconizzaAPICustomQueryParams,
} from '@iconizza/core/lib/api/functions';
import type {
	IconizzaAPIModule,
	IconizzaAPISendQuery,
	IconizzaAPIPrepareIconsQuery,
} from '@iconizza/core/lib/api/modules';
import { setAPIModule } from '@iconizza/core/lib/api/modules';
import type {
	PartialIconizzaAPIConfig,
	IconizzaAPIConfig,
	GetAPIConfig,
} from '@iconizza/core/lib/api/config';
import {
	addAPIProvider,
	getAPIConfig,
	listAPIProviders,
} from '@iconizza/core/lib/api/config';
import {
	fetchAPIModule,
	setFetch,
	getFetch,
} from '@iconizza/core/lib/api/modules/fetch';
import type {
	IconizzaIconLoaderCallback,
	IconizzaIconLoaderAbort,
} from '@iconizza/core/lib/api/icons';
import { loadIcons, loadIcon } from '@iconizza/core/lib/api/icons';
import { sendAPIQuery } from '@iconizza/core/lib/api/query';

// Cache
import { initBrowserStorage } from '@iconizza/core/lib/browser-storage';
import { toggleBrowserCache } from '@iconizza/core/lib/browser-storage/functions';
import type {
	IconizzaBrowserCacheType,
	IconizzaBrowserCacheFunctions,
} from '@iconizza/core/lib/browser-storage/functions';

// Properties
import type {
	IconProps,
	IconizzaIconCustomisations,
	IconizzaIconProps,
	IconizzaRenderMode,
} from './props';

// Render SVG
import { render } from './render';
import type { RenderResult } from './render';

/**
 * Export required types
 */
// Function sets
export {
	IconizzaStorageFunctions,
	IconizzaBuilderFunctions,
	IconizzaBrowserCacheFunctions,
	IconizzaAPIFunctions,
	IconizzaAPIInternalFunctions,
};

// JSON stuff
export { IconizzaIcon, IconizzaJSON, IconizzaIconName };

// Customisations
export {
	IconizzaIconCustomisations,
	IconizzaIconSize,
	IconizzaRenderMode,
	IconizzaIconProps,
	IconProps,
};

// API
export {
	IconizzaAPIConfig,
	IconizzaIconLoaderCallback,
	IconizzaIconLoaderAbort,
	IconizzaAPIModule,
	GetAPIConfig,
	IconizzaAPIPrepareIconsQuery,
	IconizzaAPISendQuery,
	PartialIconizzaAPIConfig,
	IconizzaAPIQueryParams,
	IconizzaAPICustomQueryParams,
};

// Builder functions
export { IconizzaIconBuildResult };

/* Browser cache */
export { IconizzaBrowserCacheType };

/**
 * Enable cache
 */
function enableCache(storage: IconizzaBrowserCacheType): void {
	toggleBrowserCache(storage, true);
}

/**
 * Disable cache
 */
function disableCache(storage: IconizzaBrowserCacheType): void {
	toggleBrowserCache(storage, false);
}

/**
 * Initialise stuff
 */
// Enable short names
allowSimpleNames(true);

// Set API module
setAPIModule('', fetchAPIModule);

/**
 * Browser stuff
 */
if (typeof document !== 'undefined' && typeof window !== 'undefined') {
	// Set cache and load existing cache
	initBrowserStorage();

	interface WindowWithIconizzaStuff {
		IconizzaPreload?: IconizzaJSON[] | IconizzaJSON;
		IconizzaProviders?: Record<string, PartialIconizzaAPIConfig>;
	}
	const _window = window as WindowWithIconizzaStuff;

	// Load icons from global "IconizzaPreload"
	if (_window.IconizzaPreload !== void 0) {
		const preload = _window.IconizzaPreload;
		const err = 'Invalid IconizzaPreload syntax.';
		if (typeof preload === 'object' && preload !== null) {
			(preload instanceof Array ? preload : [preload]).forEach((item) => {
				try {
					if (
						// Check if item is an object and not null/array
						typeof item !== 'object' ||
						item === null ||
						item instanceof Array ||
						// Check for 'icons' and 'prefix'
						typeof item.icons !== 'object' ||
						typeof item.prefix !== 'string' ||
						// Add icon set
						!addCollection(item)
					) {
						console.error(err);
					}
				} catch (e) {
					console.error(err);
				}
			});
		}
	}

	// Set API from global "IconizzaProviders"
	if (_window.IconizzaProviders !== void 0) {
		const providers = _window.IconizzaProviders;
		if (typeof providers === 'object' && providers !== null) {
			for (let key in providers) {
				const err = 'IconizzaProviders[' + key + '] is invalid.';
				try {
					const value = providers[key];
					if (
						typeof value !== 'object' ||
						!value ||
						value.resources === void 0
					) {
						continue;
					}
					if (!addAPIProvider(key, value)) {
						console.error(err);
					}
				} catch (e) {
					console.error(err);
				}
			}
		}
	}
}

/**
 * Function to get icon status
 */
interface IconLoadingState {
	name: string;
	abort: IconizzaIconLoaderAbort;
}

type IconComponentData = IconizzaIcon | null;

interface IconState {
	// Last icon name
	name: string;

	// Loading status
	loading: IconLoadingState | null;

	// True when component has been destroyed
	destroyed: boolean;
}

type IconStateCallback = () => void;

/**
 * Callback for when icon has been loaded (only triggered for icons loaded from API)
 */
export type IconizzaIconOnLoad = (name: string) => void;

/**
 * checkIconState result
 */
export interface CheckIconStateResult {
	data: IconComponentData;
	classes?: string[];
}

/**
 * Check if component needs to be updated
 */
export function checkIconState(
	icon: string | IconizzaIcon,
	state: IconState,
	mounted: boolean,
	callback: IconStateCallback,
	onload?: IconizzaIconOnLoad
): CheckIconStateResult | null {
	// Abort loading icon
	function abortLoading() {
		if (state.loading) {
			state.loading.abort();
			state.loading = null;
		}
	}

	// Icon is an object
	if (
		typeof icon === 'object' &&
		icon !== null &&
		typeof icon.body === 'string'
	) {
		// Stop loading
		state.name = '';
		abortLoading();
		return { data: { ...defaultIconProps, ...icon } };
	}

	// Invalid icon?
	let iconName: IconizzaIconName | null;
	if (
		typeof icon !== 'string' ||
		(iconName = stringToIcon(icon, false, true)) === null
	) {
		abortLoading();
		return null;
	}

	// Load icon
	const data = getIconData(iconName);
	if (!data) {
		// Icon data is not available
		// Do not load icon until component is mounted
		if (mounted && (!state.loading || state.loading.name !== icon)) {
			// New icon to load
			abortLoading();
			state.name = '';
			state.loading = {
				name: icon,
				abort: loadIcons([iconName], callback),
			};
		}
		return null;
	}

	// Icon data is available
	abortLoading();
	if (state.name !== icon) {
		state.name = icon;
		if (onload && !state.destroyed) {
			onload(icon);
		}
	}

	// Add classes
	const classes: string[] = ['iconizza'];
	if (iconName.prefix !== '') {
		classes.push('iconizza--' + iconName.prefix);
	}
	if (iconName.provider !== '') {
		classes.push('iconizza--' + iconName.provider);
	}

	return { data, classes };
}

/**
 * Generate icon
 */
export function generateIcon(
	icon: IconComponentData,
	props: IconProps
): RenderResult | null {
	return icon
		? render(
				{
					...defaultIconProps,
					...icon,
				},
				props
		  )
		: null;
}

/**
 * Internal API
 */
const _api: IconizzaAPIInternalFunctions = {
	getAPIConfig,
	setAPIModule,
	sendAPIQuery,
	setFetch,
	getFetch,
	listAPIProviders,
};

/**
 * Export functions
 */
// IconizzaAPIInternalFunctions
export { _api };

// IconizzaAPIFunctions
export { addAPIProvider, loadIcons, loadIcon };

// IconizzaStorageFunctions
export {
	iconLoaded,
	iconLoaded as iconExists, // deprecated, kept to avoid breaking changes
	getIcon,
	listIcons,
	addIcon,
	addCollection,
};

// IconizzaBuilderFunctions
export { replaceIDs, calculateSize, buildIcon };

// IconizzaBrowserCacheFunctions
export { enableCache, disableCache };
