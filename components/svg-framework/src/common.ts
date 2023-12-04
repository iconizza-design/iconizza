import type { IconizzaJSON } from '@iconizza/types';
import { stringToIcon } from '@iconizza/utils/lib/icon/name';
import type { IconizzaIconCustomisations } from '@iconizza/utils/lib/customisations/defaults';
import { mergeCustomisations } from '@iconizza/utils/lib/customisations/merge';
import {
	getIconData,
	addCollection,
} from '@iconizza/core/lib/storage/functions';
import type { IconizzaIconBuildResult } from '@iconizza/utils/lib/svg/build';
import { iconToSVG } from '@iconizza/utils/lib/svg/build';
import { initObserver } from './observer/index';
import { scanDOM, scanElement } from './scanner/index';
import { addBodyNode } from './observer/root';
import { renderInlineSVG } from './render/svg';
import { defaultExtendedIconCustomisations } from './scanner/config';

/**
 * Generate icon
 */
function generateIcon(
	name: string,
	customisations: IconizzaIconCustomisations | undefined,
	returnString: false | undefined
): SVGSVGElement | null;
function generateIcon(
	name: string,
	customisations: IconizzaIconCustomisations | undefined,
	returnString: true
): string | null;
function generateIcon(
	name: string,
	customisations?: IconizzaIconCustomisations,
	returnString = false
): SVGSVGElement | string | null {
	// Get icon data
	const iconData = getIconData(name);
	if (!iconData) {
		return null;
	}

	// Split name
	const iconName = stringToIcon(name);

	// Clean up customisations
	const changes = mergeCustomisations(
		defaultExtendedIconCustomisations,
		customisations || {}
	);

	// Get data
	const result = renderInlineSVG(
		document.createElement('span'),
		{
			name,
			icon: iconName,
			customisations: changes,
		},
		iconData
	);
	return returnString
		? result.outerHTML
		: (result as unknown as SVGSVGElement);
}

/**
 * Iconizza interface
 */
export interface IconizzaCommonFunctions {
	/* General section */
	/**
	 * Get version
	 */
	getVersion: () => string;

	/* Render icons */
	/**
	 * Render icons
	 */
	renderSVG: (
		name: string,
		customisations?: IconizzaIconCustomisations
	) => SVGElement | null;

	renderHTML: (
		name: string,
		customisations?: IconizzaIconCustomisations
	) => string | null;

	/**
	 * Get icon data
	 */
	renderIcon: (
		name: string,
		customisations?: IconizzaIconCustomisations
	) => IconizzaIconBuildResult | null;

	/* Scanner */
	/**
	 * Scan DOM
	 */
	scan: (root?: HTMLElement) => void;

	/* Observer */
	/**
	 * Add root node
	 */
	observe: (root: HTMLElement) => void;

	/**
	 * Remove root node
	 */
	stopObserving: (root: HTMLElement) => void;

	/**
	 * Pause observer
	 */
	pauseObserver: (root?: HTMLElement) => void;

	/**
	 * Resume observer
	 */
	resumeObserver: (root?: HTMLElement) => void;
}

/**
 * Get version
 */
export function getVersion(): string {
	return '__iconizza_version__';
}

/**
 * Generate SVG element
 */
export function renderSVG(
	name: string,
	customisations?: IconizzaIconCustomisations
): SVGElement | null {
	return generateIcon(name, customisations, false) as SVGElement | null;
}

/**
 * Generate SVG as string
 */
export function renderHTML(
	name: string,
	customisations?: IconizzaIconCustomisations
): string | null {
	return generateIcon(name, customisations, true) as string | null;
}

/**
 * Get rendered icon as object that can be used to create SVG (use replaceIDs on body)
 */
export function renderIcon(
	name: string,
	customisations?: IconizzaIconCustomisations
): IconizzaIconBuildResult | null {
	// Get icon data
	const iconData = getIconData(name);
	if (!iconData) {
		return null;
	}

	// Clean up customisations
	const changes = mergeCustomisations(
		defaultExtendedIconCustomisations,
		customisations || {}
	);

	// Get data
	return iconToSVG(iconData, changes);
}

/**
 * Scan DOM
 */
export function scan(root?: HTMLElement): void {
	if (root) {
		scanElement(root);
	} else {
		scanDOM();
	}
}

/**
 * Initialise stuff
 */
if (typeof document !== 'undefined' && typeof window !== 'undefined') {
	// Add document.body node
	addBodyNode();

	interface WindowWithIconizzaStuff {
		IconizzaPreload?: IconizzaJSON[] | IconizzaJSON;
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

	// Load observer and scan DOM on next tick
	setTimeout(() => {
		initObserver(scanDOM);
		scanDOM();
	});
}
