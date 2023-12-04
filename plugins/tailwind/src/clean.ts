import { getIconsCSSData } from '@iconizza/utils/lib/css/icons';
import { loadIconSet } from './loader';
import { getIconNames } from './names';
import type { CleanIconizzaPluginOptions } from './options';

/**
 * Get CSS rules for icons list
 */
export function getCSSRulesForIcons(
	icons: string[] | string,
	options: CleanIconizzaPluginOptions = {}
): Record<string, Record<string, string>> {
	const rules = Object.create(null) as Record<string, Record<string, string>>;

	// Get all icons
	const prefixes = getIconNames(icons);

	// Parse all icon sets
	for (const prefix in prefixes) {
		const iconSet = loadIconSet(prefix, options);
		if (!iconSet) {
			throw new Error(
				`Cannot load icon set for "${prefix}". Install "@iconizza-json/${prefix}" as dev dependency?`
			);
		}
		const generated = getIconsCSSData(
			iconSet,
			Array.from(prefixes[prefix]),
			options
		);

		const result = generated.common
			? [generated.common, ...generated.css]
			: generated.css;
		result.forEach((item) => {
			const selector =
				item.selector instanceof Array
					? item.selector.join(', ')
					: item.selector;
			rules[selector] = item.rules;
		});
	}

	return rules;
}
