import type { JSX } from 'solid-js';

import type {
	IconizzaIcon,
	IconizzaIconProperties,
	IconizzaIconAttributes,
	IconizzaIconHTMLElement,
} from 'iconizza-icon';

/**
 * Export types
 */
export type {
	IconizzaStorageFunctions,
	IconizzaBuilderFunctions,
	IconizzaBrowserCacheFunctions,
	IconizzaAPIFunctions,
	IconizzaAPIInternalFunctions,
} from 'iconizza-icon';

// JSON stuff
export type { IconizzaIcon, IconizzaJSON, IconizzaIconName } from 'iconizza-icon';

// Customisations
export type { IconizzaIconCustomisations, IconizzaIconSize } from 'iconizza-icon';

// API
export type {
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
} from 'iconizza-icon';

// Builder functions
export type { IconizzaIconBuildResult } from 'iconizza-icon';

// Browser cache
export type { IconizzaBrowserCacheType } from 'iconizza-icon';

// Component types
export type {
	IconizzaIconAttributes,
	IconizzaIconProperties,
	IconizzaRenderMode,
	IconizzaIconHTMLElement,
} from 'iconizza-icon';

/**
 * Export functions
 */
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
} from 'iconizza-icon';

/**
 * Properties for Solid component
 */
type BaseElementProps = JSX.IntrinsicElements['span'];
export interface IconizzaIconProps
	extends BaseElementProps,
		IconizzaIconProperties {
	// Rotation can be string or number
	rotate?: string | number;
}

/**
 * Solid component
 */
export function Icon(props: IconizzaIconProps): JSX.Element {
	let {
		icon,
		mode,
		inline,
		rotate,
		flip,
		width,
		height,
		preserveAspectRatio,
	} = props;

	// Convert icon to string
	if (typeof icon === 'object') {
		icon = JSON.stringify(icon);
	}

	return (
		// @ts-ignore
		<iconizza-icon
			attr:icon={icon}
			attr:mode={mode}
			attr:inline={inline}
			attr:rotate={rotate}
			attr:flip={flip}
			attr:width={width}
			attr:height={height}
			attr:preserveAspectRatio={preserveAspectRatio}
			{...props}
		/>
	);
}
