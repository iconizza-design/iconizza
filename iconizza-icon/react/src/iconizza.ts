import React from 'react';
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
 * Properties for React component
 */
export interface IconizzaIconProps
	extends React.HTMLProps<HTMLElement>,
		IconizzaIconProperties {
	// Rotation can be string or number
	rotate?: string | number;
}

/**
 * React component
 */
export const Icon = React.forwardRef(
	(
		props: IconizzaIconProps,
		ref: React.ForwardedRef<IconizzaIconHTMLElement>
	) => {
		const newProps: Record<string, unknown> = {
			...props,
			ref,
		};

		// Stringify icon
		if (typeof props.icon === 'object') {
			newProps.icon = JSON.stringify(props.icon);
		}

		// Boolean
		if (!props.inline) {
			delete newProps.inline;
		}

		// React cannot handle className for web components
		if (props.className) {
			newProps['class'] = props.className;
		}

		return React.createElement('iconizza-icon', newProps);
	}
);
