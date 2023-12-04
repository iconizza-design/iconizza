import Vue from 'vue';
import type { CreateElement, VNode } from 'vue';
import type { ExtendedVue } from 'vue/types/vue';
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
	IconProps,
	IconizzaIconCustomisations,
	IconizzaIconProps,
} from './props';

// Render SVG
import { render } from './render';

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
	IconProps,
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
 * Empty icon data, rendered when icon is not available
 */
const emptyIcon = {
	body: '',
};

/**
 * Component
 */
interface IconComponentData {
	data: IconizzaIcon;
	classes?: string[];
}

export const Icon = Vue.extend({
	// Do not inherit other attributes: it is handled by render()
	// In Vue 2 style is still passed!
	inheritAttrs: false,

	// Set initial data
	data() {
		return {
			// Mounted status
			iconMounted: false,
		};
	},

	beforeMount() {
		// Current icon name
		this._name = '';

		// Loading
		this._loadingIcon = null;

		// Mark as mounted
		this.iconMounted = true;
	},

	beforeDestroy() {
		this.abortLoading();
	},

	methods: {
		abortLoading() {
			if (this._loadingIcon) {
				this._loadingIcon.abort();
				this._loadingIcon = null;
			}
		},
		// Get data for icon to render or null
		getIcon(
			icon: IconizzaIcon | string,
			onload?: IconizzaIconOnLoad
		): IconComponentData | null {
			// Icon is an object
			if (
				typeof icon === 'object' &&
				icon !== null &&
				typeof icon.body === 'string'
			) {
				// Stop loading
				this._name = '';
				this.abortLoading();
				return {
					data: icon,
				};
			}

			// Invalid icon?
			let iconName: IconizzaIconName | null;
			if (
				typeof icon !== 'string' ||
				(iconName = stringToIcon(icon, false, true)) === null
			) {
				this.abortLoading();
				return null;
			}

			// Load icon
			const data = getIconData(iconName);
			if (!data) {
				// Icon data is not available
				if (!this._loadingIcon || this._loadingIcon.name !== icon) {
					// New icon to load
					this.abortLoading();
					this._name = '';
					if (data !== null) {
						// Icon was not loaded
						this._loadingIcon = {
							name: icon,
							abort: loadIcons([iconName], () => {
								this.$forceUpdate();
							}),
						};
					}
				}
				return null;
			}

			// Icon data is available
			this.abortLoading();
			if (this._name !== icon) {
				this._name = icon;
				if (onload) {
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
		},
	},

	// Render icon
	render(createElement: CreateElement): VNode {
		const props = Object.assign({}, this.$attrs);
		let context = this.$data;

		// Get icon data
		const icon: IconComponentData | null = this.iconMounted
			? this.getIcon(props.icon, props.onLoad)
			: null;

		// Validate icon object
		if (!icon) {
			return render(createElement, props, context, emptyIcon);
		}

		// Add classes
		if (icon.classes) {
			context = {
				...context,
				class:
					(typeof context['class'] === 'string'
						? context['class'] + ' '
						: '') + icon.classes.join(' '),
			};
		}

		// Render icon
		return render(createElement, props, context, icon.data);
	},
});

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
