import type { IconizzaJSON } from '@iconizza/types';

// Core
import {
	allowSimpleNames,
	IconizzaStorageFunctions,
} from '@iconizza/core/lib/storage/functions';
import {
	iconLoaded,
	getIcon,
	addIcon,
	addCollection,
} from '@iconizza/core/lib/storage/functions';
import { listIcons } from '@iconizza/core/lib/storage/storage';
import type { IconizzaBuilderFunctions } from '@iconizza/core/lib/builder/functions';
import { iconToSVG as buildIcon } from '@iconizza/utils/lib/svg/build';
import { calculateSize } from '@iconizza/utils/lib/svg/size';

// API
import type {
	IconizzaAPIFunctions,
	IconizzaAPIInternalFunctions,
} from '@iconizza/core/lib/api/functions';
import { setAPIModule } from '@iconizza/core/lib/api/modules';
import type { PartialIconizzaAPIConfig } from '@iconizza/core/lib/api/config';
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
import { loadIcons, loadIcon } from '@iconizza/core/lib/api/icons';
import { sendAPIQuery } from '@iconizza/core/lib/api/query';

// Cache
import { initBrowserStorage } from '@iconizza/core/lib/browser-storage';
import { toggleBrowserCache } from '@iconizza/core/lib/browser-storage/functions';
import type {
	IconizzaBrowserCacheType,
	IconizzaBrowserCacheFunctions,
} from '@iconizza/core/lib/browser-storage/functions';
import { appendCustomStyle } from './render/style';

/**
 * Interface for exported functions
 */
export interface IconizzaExportedFunctions
	extends IconizzaStorageFunctions,
		IconizzaBuilderFunctions,
		IconizzaBrowserCacheFunctions,
		IconizzaAPIFunctions {
	// API internal functions
	_api: IconizzaAPIInternalFunctions;

	// Append custom style to all components
	appendCustomStyle: (value: string) => void;
}

/**
 * Get functions and initialise stuff
 */
export function exportFunctions(): IconizzaExportedFunctions {
	/**
	 * Initialise stuff
	 */
	// Set API module
	setAPIModule('', fetchAPIModule);

	// Allow simple icon names
	allowSimpleNames(true);

	/**
	 * Browser stuff
	 */
	interface WindowWithIconizzaStuff {
		IconizzaPreload?: IconizzaJSON[] | IconizzaJSON;
		IconizzaProviders?: Record<string, PartialIconizzaAPIConfig>;
	}
	let _window: WindowWithIconizzaStuff;
	try {
		_window = window as WindowWithIconizzaStuff;
	} catch (err) {
		//
	}
	if (_window) {
		// Set cache and load existing cache
		initBrowserStorage();

		// Load icons from global "IconizzaPreload"
		if (_window.IconizzaPreload !== void 0) {
			const preload = _window.IconizzaPreload;
			const err = 'Invalid IconizzaPreload syntax.';
			if (typeof preload === 'object' && preload !== null) {
				(preload instanceof Array ? preload : [preload]).forEach(
					(item) => {
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
					}
				);
			}
		}

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

	const _api: IconizzaAPIInternalFunctions = {
		getAPIConfig,
		setAPIModule,
		sendAPIQuery,
		setFetch,
		getFetch,
		listAPIProviders,
	};

	return {
		enableCache: (storage: IconizzaBrowserCacheType) =>
			toggleBrowserCache(storage, true),
		disableCache: (storage: IconizzaBrowserCacheType) =>
			toggleBrowserCache(storage, false),
		iconLoaded,
		iconExists: iconLoaded, // deprecated, kept to avoid breaking changes
		getIcon,
		listIcons,
		addIcon,
		addCollection,
		calculateSize,
		buildIcon,
		loadIcons,
		loadIcon,
		addAPIProvider,
		appendCustomStyle,
		_api,
	};
}
