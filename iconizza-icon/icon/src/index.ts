import type { IconizzaJSON, IconizzaIcon } from '@iconizza/types';

// Core
import type { IconizzaIconName } from '@iconizza/utils/lib/icon/name';
import type {
	IconizzaIconSize,
	IconizzaIconCustomisations,
} from '@iconizza/utils/lib/customisations/defaults';
import type { IconizzaStorageFunctions } from '@iconizza/core/lib/storage/functions';
import type { IconizzaBuilderFunctions } from '@iconizza/core/lib/builder/functions';
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
import type {
	PartialIconizzaAPIConfig,
	IconizzaAPIConfig,
	GetAPIConfig,
} from '@iconizza/core/lib/api/config';
import type {
	IconizzaIconLoaderCallback,
	IconizzaIconLoaderAbort,
} from '@iconizza/core/lib/api/icons';

// Cache
import type {
	IconizzaBrowserCacheType,
	IconizzaBrowserCacheFunctions,
} from '@iconizza/core/lib/browser-storage/functions';

// Component
import type {
	IconizzaIconProperties,
	IconizzaIconAttributes,
	IconizzaRenderMode,
} from './attributes/types';
import { defineIconizzaIcon } from './component';
import type {
	IconizzaIconHTMLElement,
	IconizzaIconHTMLElementClass,
} from './component';
import { exportFunctions } from './functions';
import { appendCustomStyle } from './render/style';

/**
 * Export used types
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
export { IconizzaIconCustomisations, IconizzaIconSize };

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

// Browser cache
export { IconizzaBrowserCacheType };

// Component types
export {
	IconizzaIconProperties,
	IconizzaIconAttributes,
	IconizzaRenderMode,
	IconizzaIconHTMLElement,
	IconizzaIconHTMLElementClass,
};

/**
 * Create exported data: either component instance or functions
 */
export const IconizzaIconComponent = defineIconizzaIcon() || exportFunctions();

/**
 * Export functions
 */
const {
	enableCache,
	disableCache,
	iconLoaded,
	iconExists, // deprecated, kept to avoid breaking changes
	getIcon,
	listIcons,
	addIcon,
	addCollection,
	calculateSize,
	buildIcon,
	loadIcons,
	loadIcon,
	addAPIProvider,
	_api,
} = IconizzaIconComponent;

export {
	enableCache,
	disableCache,
	iconLoaded,
	iconExists, // deprecated, kept to avoid breaking changes
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
