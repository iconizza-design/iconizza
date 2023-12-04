'use client';

import React from 'react';
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
	IconizzaIconCustomisations,
	IconizzaIconProps,
	IconizzaRenderMode,
	IconProps,
	IconRef,
} from './props';

// Render SVG
import { render } from './render';
import { defaultIconProps } from '@iconizza/utils/lib/icon/defaults';

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
	IconizzaRenderMode,
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
 * Component
 */
interface InternalIconProps extends IconProps {
	_ref?: IconRef;
	_inline: boolean;
}

interface IconComponentData {
	data: IconizzaIcon;
	classes?: string[];
}

interface IconComponentState {
	icon: IconComponentData | null;
}

interface ComponentAbortData {
	name: string;
	abort: IconizzaIconLoaderAbort;
}

class IconComponent extends React.Component<
	InternalIconProps,
	IconComponentState
> {
	protected _icon: string;
	protected _loading: ComponentAbortData | null;

	constructor(props: InternalIconProps) {
		super(props);
		this.state = {
			// Render placeholder before component is mounted
			icon: null,
		};
	}

	/**
	 * Abort loading icon
	 */
	_abortLoading() {
		if (this._loading) {
			this._loading.abort();
			this._loading = null;
		}
	}

	/**
	 * Update state
	 */
	_setData(icon: IconComponentData | null) {
		if (this.state.icon !== icon) {
			this.setState({
				icon,
			});
		}
	}

	/**
	 * Check if icon should be loaded
	 */
	_checkIcon(changed: boolean) {
		const state = this.state;
		const icon = this.props.icon;

		// Icon is an object
		if (
			typeof icon === 'object' &&
			icon !== null &&
			typeof icon.body === 'string'
		) {
			// Stop loading
			this._icon = '';
			this._abortLoading();

			if (changed || state.icon === null) {
				// Set data if it was changed
				this._setData({
					data: icon,
				});
			}
			return;
		}

		// Invalid icon?
		let iconName: IconizzaIconName | null;
		if (
			typeof icon !== 'string' ||
			(iconName = stringToIcon(icon, false, true)) === null
		) {
			this._abortLoading();
			this._setData(null);
			return;
		}

		// Load icon
		const data = getIconData(iconName);
		if (!data) {
			// Icon data is not available
			if (!this._loading || this._loading.name !== icon) {
				// New icon to load
				this._abortLoading();
				this._icon = '';
				this._setData(null);
				if (data !== null) {
					// Icon was not loaded
					this._loading = {
						name: icon,
						abort: loadIcons(
							[iconName],
							this._checkIcon.bind(this, false)
						),
					};
				}
			}
			return;
		}

		// Icon data is available
		if (this._icon !== icon || state.icon === null) {
			// New icon or icon has been loaded
			this._abortLoading();
			this._icon = icon;

			// Add classes
			const classes: string[] = ['iconizza'];
			if (iconName.prefix !== '') {
				classes.push('iconizza--' + iconName.prefix);
			}
			if (iconName.provider !== '') {
				classes.push('iconizza--' + iconName.provider);
			}

			// Set data
			this._setData({
				data,
				classes,
			});
			if (this.props.onLoad) {
				this.props.onLoad(icon);
			}
		}
	}

	/**
	 * Component mounted
	 */
	componentDidMount() {
		this._checkIcon(false);
	}

	/**
	 * Component updated
	 */
	componentDidUpdate(oldProps) {
		if (oldProps.icon !== this.props.icon) {
			this._checkIcon(true);
		}
	}

	/**
	 * Abort loading
	 */
	componentWillUnmount() {
		this._abortLoading();
	}

	/**
	 * Render
	 */
	render() {
		const props = this.props;
		const icon = this.state.icon;

		if (icon === null) {
			// Render placeholder
			return props.children
				? (props.children as JSX.Element)
				: React.createElement('span', {});
		}

		// Add classes
		let newProps = props;
		if (icon.classes) {
			newProps = {
				...props,
				className:
					(typeof props.className === 'string'
						? props.className + ' '
						: '') + icon.classes.join(' '),
			};
		}

		// Render icon
		return render(
			{
				...defaultIconProps,
				...icon.data,
			},
			newProps,
			props._inline,
			props._ref
		);
	}
}

/**
 * Block icon
 *
 * @param props - Component properties
 */
export const Icon = React.forwardRef<IconRef, IconProps>(function Icon(
	props,
	ref
) {
	const newProps = {
		...props,
		_ref: ref,
		_inline: false,
	} as InternalIconProps;
	return React.createElement(IconComponent, newProps);
});

/**
 * Inline icon (has negative verticalAlign that makes it behave like icon font)
 *
 * @param props - Component properties
 */
export const InlineIcon = React.forwardRef<IconRef, IconProps>(
	function InlineIcon(props, ref) {
		const newProps = {
			...props,
			_ref: ref,
			_inline: true,
		} as InternalIconProps;
		return React.createElement(IconComponent, newProps);
	}
);

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
