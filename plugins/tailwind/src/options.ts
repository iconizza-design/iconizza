import type { IconCSSIconSetOptions } from '@iconizza/utils/lib/css/types';
import type { IconizzaPluginLoaderOptions } from './loader';

/**
 * Common options
 */
export interface CommonIconizzaPluginOptions extends IconizzaPluginLoaderOptions {
	//
}

/**
 * Options for clean class names
 */
export interface CleanIconizzaPluginOptions
	extends CommonIconizzaPluginOptions,
		IconCSSIconSetOptions {
	//
}

/**
 * Options for dynamic class names
 */
export interface DynamicIconizzaPluginOptions
	extends CommonIconizzaPluginOptions {
	// Class prefix
	prefix?: string;

	// Include icon-specific selectors only
	overrideOnly?: true;

	// Sets the default height/width value (ex. scale: 2 = 2em)
	scale?: number;
}
