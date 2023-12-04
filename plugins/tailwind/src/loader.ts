import { readFileSync } from 'fs';
import type { IconizzaJSON } from '@iconizza/types';

/**
 * Callback for loading icon set
 */
type IconizzaJSONLoaderCallback = () => IconizzaJSON;

/**
 * Options for icon set loaders
 */
export interface IconizzaPluginLoaderOptions {
	// Custom icon sets
	// Value can be loaded icon set or callback that loads icon set
	iconSets?: Record<string, IconizzaJSON | string | IconizzaJSONLoaderCallback>;
}

/**
 * Locate icon set
 */
interface LocatedIconSet {
	main: string;
	info?: string;
}
export function locateIconSet(prefix: string): LocatedIconSet | undefined {
	try {
		const main = require.resolve(`@iconizza-json/${prefix}/icons.json`);
		const info = require.resolve(`@iconizza-json/${prefix}/info.json`);
		return {
			main,
			info,
		};
	} catch {}
	try {
		const main = require.resolve(`@iconizza/json/json/${prefix}.json`);
		return {
			main,
		};
	} catch {}
}

/**
 * Cache for loaded icon sets
 *
 * Tailwind CSS can send multiple separate requests to plugin, this will
 * prevent same data from being loaded multiple times.
 *
 * Key is filename, not prefix!
 */
const cache = Object.create(null) as Record<string, IconizzaJSON>;

/**
 * Load icon set
 */
export function loadIconSet(
	prefix: string,
	options: IconizzaPluginLoaderOptions
): IconizzaJSON | undefined {
	let filename: LocatedIconSet;

	// Check for custom icon set
	const customIconSet = options.iconSets?.[prefix];
	if (customIconSet) {
		switch (typeof customIconSet) {
			case 'function': {
				// Callback. Store result in options to avoid loading it again
				const result = customIconSet();
				options.iconSets[prefix] = result;
				return result;
			}

			case 'string': {
				// Filename to load it from
				filename = {
					main: customIconSet,
				};
				break;
			}

			default:
				return customIconSet;
		}
	} else {
		// Find icon set
		filename = locateIconSet(prefix);
	}

	if (!filename) {
		return;
	}

	const main = typeof filename === 'string' ? filename : filename.main;

	// Check for cache
	if (cache[main]) {
		return cache[main];
	}

	// Attempt to load it
	try {
		const result = JSON.parse(readFileSync(main, 'utf8'));
		if (!result.info && typeof filename === 'object' && filename.info) {
			// Load info from a separate file
			result.info = JSON.parse(readFileSync(filename.info, 'utf8'));
		}
		cache[main] = result;
		return result;
	} catch {}
}
