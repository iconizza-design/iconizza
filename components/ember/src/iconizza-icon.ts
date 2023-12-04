import type { IconizzaJSON, IconizzaIcon } from '@iconizza/types';

// Core
import type { IconizzaIconName } from '@iconizza/utils/lib/icon/name';
import type { IconizzaIconSize } from '@iconizza/utils/lib/customisations/defaults';
import type { IconizzaStorageFunctions } from '@iconizza/core/lib/storage/functions';
import {
	iconLoaded,
	getIcon,
	addIcon,
	addCollection,
	allowSimpleNames,
} from '@iconizza/core/lib/storage/functions';
import { listIcons } from '@iconizza/core/lib/storage/storage';
import type { IconizzaBuilderFunctions } from '@iconizza/core/lib/builder/functions';
import { iconToSVG as buildIcon } from '@iconizza/utils/lib/svg/build';
import { replaceIDs } from '@iconizza/utils/lib/svg/id';
import { calculateSize } from '@iconizza/utils/lib/svg/size';
import type { IconizzaIconBuildResult } from '@iconizza/utils/lib/svg/build';

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
	IconizzaIconOnLoad,
	IconizzaIconCustomisations,
	IconizzaIconProps,
} from './props';

// Component
import { IconizzaIconComponent } from './component';

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

// Customisations and icon props
export {
	IconizzaIconCustomisations,
	IconizzaIconSize,
	IconizzaIconProps,
	IconizzaIconOnLoad,
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

/**
 * Component
 */
export default IconizzaIconComponent;
