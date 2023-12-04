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
} from './functions';

// JSON stuff
export { IconizzaIcon, IconizzaJSON, IconizzaIconName } from './functions';

// Customisations
export {
	IconizzaIconCustomisations,
	IconizzaIconSize,
	IconizzaIconProps,
	IconProps,
	IconizzaRenderMode,
} from './functions';

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
} from './functions';

// Builder functions
export { IconizzaIconBuildResult } from './functions';

// Browser cache
export { IconizzaBrowserCacheType } from './functions';

// Component params
export { IconizzaIconOnLoad } from './functions';

// Functions
// Important: duplicate of global exports in Icon.svelte. When changing exports, they must be changed in both files.
export { enableCache, disableCache } from './functions';

export {
	iconLoaded,
	iconExists, // deprecated, kept to avoid breaking changes
	getIcon,
	listIcons,
	addIcon,
	addCollection,
} from './functions';

export { calculateSize, replaceIDs, buildIcon } from './functions';

export { loadIcons, loadIcon, addAPIProvider, _api } from './functions';
