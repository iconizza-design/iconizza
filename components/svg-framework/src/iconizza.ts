// Core
import type { IconizzaJSON, IconizzaIcon } from '@iconizza/types';
import type { IconizzaIconName } from '@iconizza/utils/lib/icon/name';
import type { IconizzaIconSize } from '@iconizza/utils/lib/customisations/defaults';
import type { IconizzaIconBuildResult } from '@iconizza/utils/lib/svg/build';
import type { IconizzaStorageFunctions } from '@iconizza/core/lib/storage/functions';
import {
	iconLoaded,
	getIcon,
	addIcon,
	addCollection,
} from '@iconizza/core/lib/storage/functions';
import { listIcons } from '@iconizza/core/lib/storage/storage';
import type { IconizzaBuilderFunctions } from '@iconizza/core/lib/builder/functions';
import { iconToSVG as buildIcon } from '@iconizza/utils/lib/svg/build';
import { replaceIDs } from '@iconizza/utils/lib/svg/id';
import { calculateSize } from '@iconizza/utils/lib/svg/size';

// Cache
import { initBrowserStorage } from '@iconizza/core/lib/browser-storage';
import type {
	IconizzaBrowserCacheFunctions,
	IconizzaBrowserCacheType,
} from '@iconizza/core/lib/browser-storage/functions';
import { toggleBrowserCache } from '@iconizza/core/lib/browser-storage/functions';

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
	getFetch,
	setFetch,
} from '@iconizza/core/lib/api/modules/fetch';
import type {
	IconizzaIconLoaderCallback,
	IconizzaIconLoaderAbort,
} from '@iconizza/core/lib/api/icons';
import { loadIcons, loadIcon } from '@iconizza/core/lib/api/icons';
import { sendAPIQuery } from '@iconizza/core/lib/api/query';

// Other
import type { IconizzaCommonFunctions } from './common';
import { getVersion, renderSVG, renderHTML, renderIcon, scan } from './common';
import {
	observe,
	stopObserving,
	pauseObserver,
	resumeObserver,
} from './observer/index';
import type {
	IconizzaRenderMode,
	IconizzaIconCustomisations,
} from './scanner/config';

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
export { IconizzaIconCustomisations, IconizzaIconSize, IconizzaRenderMode };

// Build
export { IconizzaIconBuildResult };

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

// Cache
export { IconizzaBrowserCacheType };

/**
 * Iconizza interface
 */
export interface IconizzaGlobal
	extends IconizzaStorageFunctions,
		IconizzaBuilderFunctions,
		IconizzaCommonFunctions,
		IconizzaBrowserCacheFunctions,
		IconizzaAPIFunctions {
	_api: IconizzaAPIInternalFunctions;
}

/**
 * Enable cache
 */
function enableCache(storage: IconizzaBrowserCacheType, enable?: boolean): void {
	toggleBrowserCache(storage, enable !== false);
}

/**
 * Disable cache
 */
function disableCache(storage: IconizzaBrowserCacheType): void {
	toggleBrowserCache(storage, true);
}

/**
 * Initialise stuff
 */
// Set API module
setAPIModule('', fetchAPIModule);

/**
 * Browser stuff
 */
if (typeof document !== 'undefined' && typeof window !== 'undefined') {
	// Set cache and load existing cache
	initBrowserStorage();

	interface WindowWithIconizzaStuff {
		IconizzaProviders?: Record<string, PartialIconizzaAPIConfig>;
	}
	const _window = window as WindowWithIconizzaStuff;

	// Set API from global "IconizzaProviders"
	if (_window.IconizzaProviders !== void 0) {
		const providers = _window.IconizzaProviders;
		if (typeof providers === 'object' && providers !== null) {
			for (const key in providers) {
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
 * Global variable
 */
const Iconizza: IconizzaGlobal = {
	// IconizzaAPIInternalFunctions
	_api,

	// IconizzaAPIFunctions
	addAPIProvider,
	loadIcons,
	loadIcon,

	// IconizzaStorageFunctions
	iconLoaded,
	iconExists: iconLoaded, // deprecated, kept to avoid breaking changes
	getIcon,
	listIcons,
	addIcon,
	addCollection,

	// IconizzaBuilderFunctions
	replaceIDs,
	calculateSize,
	buildIcon,

	// IconizzaCommonFunctions
	getVersion,
	renderSVG,
	renderHTML,
	renderIcon,
	scan,
	observe,
	stopObserving,
	pauseObserver,
	resumeObserver,

	// IconizzaBrowserCacheFunctions
	enableCache,
	disableCache,
};

/**
 * Default export
 */
export default Iconizza;

/**
 * Named exports
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

// IconizzaCommonFunctions
export {
	getVersion,
	renderSVG,
	renderHTML,
	renderIcon,
	scan,
	observe,
	stopObserving,
	pauseObserver,
	resumeObserver,
};

// IconizzaBrowserCacheFunctions
export { enableCache, disableCache };
