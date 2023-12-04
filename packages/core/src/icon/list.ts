import type { IconizzaIconName } from '@iconizza/utils/lib/icon/name';
import { stringToIcon } from '@iconizza/utils/lib/icon/name';

/**
 * Convert icons list from string/icon mix to icons and validate them
 */
export function listToIcons(
	list: (string | IconizzaIconName)[],
	validate = true,
	simpleNames = false
): IconizzaIconName[] {
	const result: IconizzaIconName[] = [];

	list.forEach((item) => {
		const icon =
			typeof item === 'string'
				? (stringToIcon(item, validate, simpleNames) as IconizzaIconName)
				: item;
		if (icon) {
			result.push(icon);
		}
	});

	return result;
}

/**
 * Get all providers
 */
export function getProviders(list: IconizzaIconName[]): string[] {
	const providers = Object.create(null) as Record<string, boolean>;
	list.forEach((icon) => {
		providers[icon.provider] = true;
	});
	return Object.keys(providers);
}
