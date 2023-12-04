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

// Local code
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
export { IconizzaStorageFunctions, IconizzaBuilderFunctions };

// JSON stuff
export { IconizzaIcon, IconizzaJSON, IconizzaIconName };

// Customisations
export { IconizzaIconSize, IconizzaRenderMode, IconizzaIconCustomisations };

// Build
export { IconizzaIconBuildResult };

/**
 * Iconizza interface
 */
export interface IconizzaGlobal
	extends IconizzaStorageFunctions,
		IconizzaBuilderFunctions,
		IconizzaCommonFunctions {}

/**
 * Global variable
 */
const Iconizza: IconizzaGlobal = {
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
};

/**
 * Default export
 */
export default Iconizza;

/**
 * Named exports
 */
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
