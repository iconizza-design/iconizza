import plugin from 'tailwindcss/plugin';
import { getCSSRulesForIcons } from './clean';
import { getDynamicCSSRules } from './dynamic';
import type {
	CleanIconizzaPluginOptions,
	DynamicIconizzaPluginOptions,
} from './options';

/**
 * Generate styles for dynamic selector: class="icon-[mdi-light--home]"
 */
export function addDynamicIconSelectors(options?: DynamicIconizzaPluginOptions) {
	const prefix = options?.prefix || 'icon';
	return plugin(({ matchComponents }) => {
		matchComponents({
			[prefix]: (icon: string) => getDynamicCSSRules(icon, options),
		});
	});
}

/**
 * Generate styles for preset list of icons
 */
export function addCleanIconSelectors(
	icons: string[] | string,
	options?: CleanIconizzaPluginOptions
) {
	const rules = getCSSRulesForIcons(icons, options);
	return plugin(({ addUtilities }) => {
		addUtilities(rules);
	});
}

/**
 * Export types
 */
export type { CleanIconizzaPluginOptions, DynamicIconizzaPluginOptions };
